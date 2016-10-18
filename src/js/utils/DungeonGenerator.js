import Room from "./DungeonGenerator/Room";
import Corridor from "./DungeonGenerator/Corridor";
import  { Direction, randomRangeInt } from "./helperFunctions";
import { getHpPackOfLevel, EnemyVisionRange, getEnemyCount, getHPCount } from "./DungeonGenerator/DungeonConstants";
import { DUNGEON_TILES } from "./DungeonGenerator/DungeonConstants";

/*
  @params:
	-rows: integer, number of rows in the dungeon
	-columns: integer, number of columns in the dungeon
	-numRooms: array, first value is minimum number of rooms second is maximum
	-roomWidth: array, first value min width second max width
	-roomHeight: array, first value min height second max height
	-corridorLength: array, first value min length second max length
	-level: integer, level of the dungeon
  @return:
	-array with [dungeon, heroPosition, entities, enemyStartPos]
		-dungeon: 2d int array of [rows][columns], values are tile types from DUNGEON_TILES
		-heroPosition: array, contains position [row, column]
		-entities: array of objects, each representing an entity
		-enemyStartPos: array, each element contains a position array for the enemy with the same index
*/
export default function generateDungeon(rows, columns, numRooms, roomWidth, roomHeight, corridorLength, level){
	//Pushes rooms and corridors from the startingCorridor until the next room or corridor would be out of bounds
	const createRoomsAndCorridors = (nextRoomIndex, roomNum, startingCorridor) => {
		let a = nextRoomIndex, end = nextRoomIndex + roomNum;
		while (a < end){
			let room;
			if ( a === nextRoomIndex){
				// If firt room start from starting corridor
				room = new Room(roomWidth, roomHeight, rows, columns, startingCorridor);
			} else {
				// start from last corridor
				room = new Room(roomWidth, roomHeight, rows, columns, corridors[corridors.length - 1]);
			}
			if (room.outOfBounds){
				break;
			}
			rooms.push(room);
			if (a < end - 1){
				let corridor = new Corridor(rooms[rooms.length - 1], corridorLength, roomWidth,
					roomHeight, rows, columns);
				if (corridor.outOfBounds){
					break;
				}
				corridors.push(corridor);
			}
			a++;
		}
	};

	// Initialize rooms array with first room
	let rooms = [new Room(roomWidth, roomHeight, rows, columns)];
	let corridors = [];

	// Create corridors and rooms  branching from the origin room in each cardinal direction
	for (let c = 0; c < 4; c ++){
		// Choose a number of rooms to try and spawn in the given direction
		let numberRooms = randomRangeInt(numRooms[0], numRooms[1]);
		// Initialize first corridor coming of the origin room in the given direction
		corridors.push(new Corridor(rooms[0], corridorLength, roomWidth, roomHeight,
		rows, columns, true, c));
		// Create the rooms and corridors in that direction
		createRoomsAndCorridors(rooms.length + 1, numberRooms, corridors[corridors.length - 1]);
	}


	// Create dungeon with all wall tiles
	let dungeon = new Array(rows);
	for (let l = 0; l < dungeon.length; l++){
		dungeon[l] = new Array(columns).fill(DUNGEON_TILES.WALL);
	}

	// Go through all coridors setting tiles to corridor
	for (let i = 0; i < corridors.length; i++){
		// Go through length of corridor
		for (let d = 0; d < corridors[i].corridorLength; d++){
			let xCoord = corridors[i].startXPos;
			let yCoord = corridors[i].startYPos;

			switch (corridors[i].direction){
				case Direction.NORTH:
					yCoord -= d;
					break;
				case Direction.EAST:
					xCoord += d;
					break;
				case Direction.SOUTH:
					yCoord += d;
					break;
				case Direction.WEST:
					xCoord -= d;
					break;
			}
			dungeon[yCoord][xCoord] = DUNGEON_TILES.CORRIDOR;
		}
	}

	// Go through all rooms setting tiles to room
	for (let b = 0; b < rooms.length; b++){
		// Go through room height
		for (let j = 0; j < rooms[b].roomHeight; j++){
			let yCoord = rooms[b].yPos - j;
			// Go through room width for each row
			for (let k = 0; k < rooms[b].roomWidth; k++){
				let xCoord = rooms[b].xPos + k;
				dungeon[yCoord][xCoord] = DUNGEON_TILES.ROOM;
			}

		}
	}

	// Instantiate entities, enemy starting positions, and hero starting position
	let entities = [{type: DUNGEON_TILES.WEAPON, index: level, position: [-1, -1]}];
	if (level < 4){
		entities.push({type: DUNGEON_TILES.PORTOL, position: [-1, -1]});
	}
	let numHP = getHPCount(level);
	let enemyStartPos = [];
	let numEnemy = getEnemyCount(level);

	// Returns true if the dungeon position is not occupied
	const tileNotOccupied = (pos) => {
		const entityIndex = entities.findIndex((entity) => entity.position[0] === pos[0] && entity.position[1] === pos[1]);
		const enemyIndex = enemyStartPos.findIndex((enemyPos) => enemyPos[0] === pos[0] && enemyPos[1] === pos[1]);

		return entityIndex === -1 && enemyIndex === -1;
	};

	// get a random position in a random room, that is not already taken
	const getRandRoomPos = () => {
		let roomIndex = randomRangeInt(0, rooms.length);
		const row = randomRangeInt(rooms[roomIndex].yPos - rooms[roomIndex].roomHeight + 1, rooms[roomIndex].yPos + 1);	// randomRangeInt requires the min number to be first, and the max number is non enclusive
		const col = randomRangeInt(rooms[roomIndex].xPos, rooms[roomIndex].xPos + rooms[roomIndex].roomWidth);
		if (dungeon[row][col] <= DUNGEON_TILES.ROOM && tileNotOccupied([row, col])){
			return [row, col];
		} else {
			return getRandRoomPos();
		}
	};

	// Generate weapon position and portal position
	entities[0].position = getRandRoomPos();
	if (level < 4){
		entities[1].position = getRandRoomPos();
	}

	// Generate HP
	while (numHP > 0){
		entities.push({type: DUNGEON_TILES.HP, position: getRandRoomPos(), value: getHpPackOfLevel(level)});
		numHP--;
	}

	// Generate enemy starting positions
	while (numEnemy > 0){
		enemyStartPos.push(getRandRoomPos());
		numEnemy--;
	}

	// If lvl 4 add boss
	if (level === 4){
		enemyStartPos.push(getRandRoomPos());
	}

	// Returns true if an enemy is within a radius of "range" of the given position
	const enemyInRange = (pos, range) => {
		for (let row = Math.max(0, pos[0] - range); row < Math.min(pos[0] + range, rows); row++){
			for (let col = Math.max(0, pos[1] -  range); col < Math.min(pos[1] + range, columns); col++){
				if (enemyStartPos.findIndex((enemyPos) => enemyPos[0] === row && enemyPos[1] === col) !== -1){
					return true;
				}
			}
		}
		return false;
	};

	// Ensure hero does not start in range of enemy
	let heroPosition = getRandRoomPos();
	while (enemyInRange(heroPosition, EnemyVisionRange)){
		heroPosition = getRandRoomPos();
	}

	return [dungeon, heroPosition, entities, enemyStartPos];
}

