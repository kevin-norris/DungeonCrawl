import generateDungeon from "./../utils/DungeonGenerator";
import * as dungeonConstants from "./../utils/DungeonGenerator/DungeonConstants";
import { clamp, randomRangeInt } from "./../utils/helperFunctions";

const clampToWorld = (row, col) => {
	return [
		clamp(row, 0, dungeonConstants.DUNGEON_HEIGHT - 1),
		clamp(col, 0, dungeonConstants.DUNGEON_WIDTH - 1)
	];
}

const initialState = {
	gameOver: 0,
	level: 0,
	dungeon: [],
	entities: [],
	enemies: [],
	enemyPositions: [],
	enemiesMovedLastTurn: false,
	heroPosition: {},
	hero: dungeonConstants.HeroBase,
	heroWeapon: {...dungeonConstants.weapons[0]},
	heroStats: {killCount: 0, hpIncrease: 0, stepCount: 0, damageTaken: 0}
};

// Stores the id's of enemies attacked by the hero so they can retaliate
let enemiesAttacked = [];

// Randomize the given damage value based on the damage deviation
const randomizeDamage = (damage) => {
	const deviation = damage * dungeonConstants.damageDeviation;
	return randomRangeInt(Math.floor(damage - deviation), Math.ceil(damage + deviation) + 1);
};

// Calculates hero's attack damage and returns a new state that depicts the results of the attack
const heroAttack = (s, enemyIndex) => {
	const damage = randomizeDamage(s.hero.damage * s.heroWeapon.multiplier);
	const enemyHp = s.enemies[enemyIndex].hp - damage;
	let enemies;
	// If the enemy was killed in this attack
	if (enemyHp <= 0){
		if (s.level === 4 && s.enemies[enemyIndex].type === dungeonConstants.DUNGEON_TILES.BOSS){
			return {...s, gameOver: 1};
		}
		// Remove the enemy from the state
		enemies = s.enemies.filter((e, index) => index !== enemyIndex);
		const enemyPositions = s.enemyPositions.filter((e, index) => index !== enemyIndex);
		enemiesAttacked = enemiesAttacked.filter((e, index) => index !== enemyIndex);	// If not removed from here, enemy will attack from the grave
		// Update nextLevelXP
		const newXp = s.hero.nextLevelXP - s.enemies[enemyIndex].xp;
		return {
			...s,
			enemies: enemies,
			enemyPositions: enemyPositions,
			hero: newXp <= 0 ? dungeonConstants.levelHero(s.hero) : {...s.hero, nextLevelXP: newXp},
			heroPosition: {row: s.enemyPositions[enemyIndex][0], col: s.enemyPositions[enemyIndex][1]},
			heroStats: {...s.heroStats, stepCount: s.heroStats.stepCount + 1, killCount: s.heroStats.killCount + 1}
		};
	// Else update enemies hp
	} else {
		enemies = [...s.enemies];
		enemies[enemyIndex] = {...enemies[enemyIndex], hp: enemyHp};
		return {
			...s,
			enemies: enemies,
		};
	}
	
};

// Calculates the enemies attack damage and returns a new state that depicts the result of the attack
const enemyAttack = (s, enemyIndex) => {
	const damage = randomizeDamage(s.enemies[enemyIndex].damage);
	const heroHp = s.hero.hp - damage;
	if (heroHp <= 0){
		return {...s,
			gameOver: -1,
			heroStats: {...s.heroStats, damageTaken: s.heroStats.damageTaken + s.hero.hp}
		};
	} else {
		return {
			...s,
			hero: {...s.hero, hp: heroHp},
			heroStats: {...s.heroStats, damageTaken: s.heroStats.damageTaken + damage}
		};
	}
};

// Changes the dungeon level
const changeLevel = (s, level) => {
	// If called with level 1, reinitializes the state
	if (level === 1){
		s = {...initialState};
	}
	const [dungeon, heroPosition, entities, enemyStartPos] = generateDungeon(dungeonConstants.DUNGEON_HEIGHT, dungeonConstants.DUNGEON_WIDTH, [17,20], [5,10], [5,10], [1,3], level);
		return {
			...s,
			level: s.level + 1,
			dungeon: dungeon,
			heroPosition: {row: heroPosition[0], col: heroPosition[1]},
			entities: entities,
			enemyPositions: enemyStartPos,
			enemies: enemyStartPos.map((position, index) => {
				if (level === 4 && index === enemyStartPos.length - 1){
					return dungeonConstants.boss;
				}
				return dungeonConstants.getEnemyOfLevel(s.level + 1);
			})
		};
};

// returns a position 1 row closer to the hero
const moveRow = (s, enemyPos) => [enemyPos[0] + (enemyPos[0] < s.heroPosition.row ? 1 : -1), enemyPos[1]];
// returns a position 1 column closer to the hero
const moveCol = (s, enemyPos) => [enemyPos[0], enemyPos[1] + (enemyPos[1] < s.heroPosition.col ? 1 : -1)];
// Returns true if position is a room tile and is not occupied, room tile check added so enemies dont follow through corridors and trap hero
const tileIsFree = (s, pos, enemyPositions=s.enemyPositions) => {
	const entityIndex = s.entities.findIndex((entity) => entity.position[0] === pos[0] && entity.position[1] === pos[1]);
	const enemyIndex = enemyPositions.findIndex((enemyPos) => enemyPos[0] === pos[0] && enemyPos[1] === pos[1]);
	const inDungeon = pos[0] >= 0 && pos[0] < dungeonConstants.DUNGEON_HEIGHT && pos[1] >= 0 && pos[1] < dungeonConstants.DUNGEON_WIDTH;
	return inDungeon && entityIndex === -1 && enemyIndex === -1 && s.dungeon[pos[0]][pos[1]] === dungeonConstants.DUNGEON_TILES.ROOM;
};
// returns a random adjacent position
const randAdjacentRoomTile = (s, enemyPos) => {
	let pos;
	const r = randomRangeInt(0,4);
	switch (r){
		case 0:
			pos = [enemyPos[0] - 1, enemyPos[1]];
			break;
		case 1:
			pos = [enemyPos[0] + 1, enemyPos[1]];
			break;
		case 2:
			pos = [enemyPos[0], enemyPos[1] - 1];
			break;
		case 3:
			pos = [enemyPos[0], enemyPos[1] + 1];
			break;
	}
	return pos;
};

export const rogueReducer = function(state=initialState, action){
	switch (action.type){
		case "MOVE_HERO":
			enemiesAttacked = new Array(state.enemies.length).fill(false);
			const [newRow, newCol] = clampToWorld(state.heroPosition.row + action.vector[0], state.heroPosition.col + action.vector[1]);
			// If the new position is not a wall tile
			if (state.dungeon[newRow][newCol] > 0){
				// Get index of entity if on occupies the new position
				const entityIndex = state.entities.findIndex((element) => element.position[0] === newRow && element.position[1] === newCol);
				// Get index of enemy if on occupies the new position
				const enemyIndex = state.enemyPositions.findIndex((enemyPos) => enemyPos[0] === newRow && enemyPos[1] === newCol);
				// A copy of state is stored so that multiple changes can be made before returning without mutating the actual state
				let s = {...state};
				if (state.gameOver){
					s = {...s, gameOver: 0};
				}
				// If an entity in the way
				if (entityIndex !== -1){
					// Increase step count
					s = {...s, heroStats: {...s.heroStats, stepCount: s.heroStats.stepCount + 1}};
					switch (s.entities[entityIndex].type){
						case dungeonConstants.DUNGEON_TILES.HP:
							// Remove hp entity, increase hero hp by value of health pack, move the hero
							return {
								...s,
								entities: s.entities.filter((element, index) => index != entityIndex),		// Should be fine since filter returns a new array, not mutating existing array
								hero: {...s.hero, hp: s.hero.hp + s.entities[entityIndex].value},
								heroPosition: {row: newRow, col: newCol},
								heroStats: {...s.heroStats, hpIncrease: s.heroStats.hpIncrease + s.entities[entityIndex].value}
							}
						case dungeonConstants.DUNGEON_TILES.WEAPON:
							// Remove the weapon entity, change hero's weapon, move hero
							return {
								...s,
								entities: s.entities.filter((element, index) => index != entityIndex),
								heroWeapon: {...dungeonConstants.weapons[s.entities[entityIndex].index]},
								heroPosition: {row: newRow, col: newCol},
							}
						case dungeonConstants.DUNGEON_TILES.PORTOL:
							// reset dungeon
							return changeLevel(s, s.level + 1);
					}
				// If an enemy is in the way
				} else if (enemyIndex !== -1) {
					enemiesAttacked[enemyIndex] = true;
					return heroAttack(s, enemyIndex);

				// If the path is clear
				} else {
					return {
						...s,
						heroPosition: {row: newRow, col: newCol},
						heroStats: {...s.heroStats, stepCount: s.heroStats.stepCount + 1}
					}
				}
			}
			return state;
		case "MOVE_ENEMIES":
			// Only move enemies ever other turn
			if (!state.enemiesMovedLastTurn){
				let attackingEnemies = [];	// Array to hold index of all enemies that want to attack this turn

				let rowDiff, colDiff, newPos;
				// Creat deep copy of enemy positions
				let enemyPositions = [];
				for(let i = 0; i < state.enemyPositions.length; i++){
					enemyPositions.push(([...state.enemyPositions[i]]));
				}
				// Compute new enemy positions, use the latest enemy positions to determine if tile is free
				for(let i = 0; i < enemyPositions.length; i++){
					rowDiff = Math.abs(enemyPositions[i][0] - state.heroPosition.row);
					colDiff = Math.abs(enemyPositions[i][1] - state.heroPosition.col);
					// If hero in the enemies vision range
					if (rowDiff + colDiff <= dungeonConstants.EnemyVisionRange){
						let movingOnRow;
						// Move towards hero, on axis of greatest difference
						if(rowDiff >= colDiff){
							movingOnRow = true;
							newPos = moveRow(state, enemyPositions[i]);
						} else {
							movingOnRow = false;
							newPos = moveCol(state, enemyPositions[i]);
						}
						// If new position is not free, check other axis
						if (!tileIsFree(state, newPos, enemyPositions)){
							newPos = movingOnRow ? moveCol(state, enemyPositions[i]) : moveRow(state, enemyPositions[i]);
						}
						// Have to check again that the new position is free,
						// as the alternative axis may also be blocked
						if(tileIsFree(state, newPos, enemyPositions)){
							// If the new position is on top of hero, dont move, attack
							if (newPos[0] === state.heroPosition.row && newPos[1] === state.heroPosition.col){
								attackingEnemies.push(i);
								enemyPositions[i] = enemyPositions[i];
							} else {
								enemyPositions[i] = newPos;
							}
						} else {
							enemyPositions[i] = enemyPositions[i];
						}
					} else {
						// Random walk if hero is not in vision range
						newPos = randAdjacentRoomTile(state, enemyPositions[i]);;
						while (!tileIsFree(state, newPos, enemyPositions)){
							newPos = randAdjacentRoomTile(state, enemyPositions[i]);
						}
						enemyPositions[i] = newPos;
					}
				}

				let s = {
					...state,
					enemiesMovedLastTurn: true,
					enemyPositions: enemyPositions
				};
				// Call enemyAttack for each enemy that is able to
				if (attackingEnemies.length > 0){
					attackingEnemies.forEach((element) => s = enemyAttack(s, element));
				}
				return s;

			} else {
				let s = {
					...state,
					enemiesMovedLastTurn: false
				};
				// If enemy was attacked on a turn it does not move, retaliate
				enemiesAttacked.forEach((wasAttacked, index) => {
					if (wasAttacked)
						s = enemyAttack(s, index);
				});
				return s;
			}
		case "GENERATE_DUNGEON":
			let s = {...state, gameOver: 0};
			return changeLevel(s, 1);
			
		default:
			return state;
	}
}

export const viewReducer =  function(state={camera: {numRows: 40, numCols: 40}, dark: true}, action){
	switch (action.type){
		case "UPDATE_CAM_SIZE":
			return {
				...state,
				camera: {...action.size},
			};
		case "TOGGLE_DARKNESS":
			return {
				...state,
				dark: !state.dark,
			}
		default:
			return state;
	}
}