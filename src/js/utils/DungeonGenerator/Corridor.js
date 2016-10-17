import  { Direction, clamp, randomRangeInt } from "./../helperFunctions";

export default class Corridor{
	constructor(room, length, roomWidth, roomHeight, rows, columns, firstCorridor = false, direction = -1){
		this.room = room;
		this.startXPos;
		this.startYPos;
		this.EndPositionY;
		this.EndPositionX;
		this.outOfBounds = false;
		// Set a random length
		this.corridorLength = randomRangeInt(length[0], length[1]);
		// Set a random direction
		if (direction < 0){
			this.direction = randomRangeInt(0,4);
		} else {
			this.direction = direction;
		}

		// The direction opposit the direction of the last corridor entering this room
		let oppositDirect = (room.enteringCorridorDirection + 2) % 4;

		// If not the first corridor and the randomly selected directin is doubling back
		if (!firstCorridor && this.direction === oppositDirect){
			// Rotate the directiong 90 degrees
			this.direction = (this.direction + 1) % 4;
		}

		let maxLength = length[1];
		switch (this.direction){
			case Direction.NORTH:
				// Start position x is random within room width
				this.startXPos = randomRangeInt(room.xPos, room.xPos + room.roomWidth - 1);
				// Start position y is 1 tile above the top of the room
				this.startYPos = room.yPos - room.roomHeight;
				// Corridor lenght must leave room for the the next room
				maxLength = this.startYPos + 1 - roomHeight[0];
				break;
			case Direction.EAST:
				this.startXPos = room.xPos + room.roomWidth;
				this.startYPos = randomRangeInt(room.yPos, room.yPos - room.roomHeight + 1);
				maxLength = columns - this.startXPos - roomWidth[0];
				break;
			case Direction.SOUTH:
				this.startXPos = randomRangeInt(room.xPos, room.xPos + room.roomWidth - 1);
				this.startYPos = room.yPos + 1;
				maxLength = this.startYPos + 1 - roomHeight[0];
				break;
			case Direction.WEST:
				this.startXPos = room.xPos - 1;
				this.startYPos = randomRangeInt(room.yPos, room.yPos - room.roomHeight + 1);
				maxLength = this.startXPos - roomWidth[0];
				break;
			default:
				console.log("Corridor direction is not a direction Corridor.js line 66");
		}
		// Clamp corridor length to ensure it does not go off the map.
		this.corridorLength = clamp(this.corridorLength, 1, maxLength);

		if (this.direction === Direction.NORTH || this.direction === Direction.SOUTH){
			this.EndPositionX = this.startXPos;
		} else if (this.direction === Direction.EAST) {
			this.EndPositionX = this.startXPos + this.corridorLength - 1;
		} else {
			this.EndPositionX = this.startXPos - this.corridorLength + 1;
		}

		if (this.direction === Direction.EAST || this.direction === Direction.WEST){
			this.EndPositionY = this.startYPos;
		} else if (this.direction === Direction.NORTH) {
			this.EndPositionY = this.startYPos - this.corridorLength + 1;
		} else {
			this.EndPositionY = this.startYPos + this.corridorLength - 1;
		}

		// Check out of bounds
		switch (this.direction){
			case Direction.NORTH:
				if (this.EndPositionY - roomHeight[0] < 0){
					this.outOfBounds = true;
				}
				break;
			case Direction.EAST:
				if (this.EndPositionX + roomWidth[0] >= columns){
					this.outOfBounds = true;
				}
				break;
			case Direction.SOUTH:
				if (this.EndPositionY + roomHeight[0] >= rows){
					this.outOfBounds = true;
				}
				break;
			case Direction.WEST:
				if (this.EndPositionX - roomWidth[0] < 0){
					this.outOfBounds = true;
				}
				break;
		}
	}
	toString(){
		return "startXPos: " + this.startXPos + " startYPos: " + this.startYPos +
		"\ncorridorLength: " + this.corridorLength + " Direction: " + this.direction +
		"\nEndPositionX: " + this.EndPositionX + " EndPositionY: " + this.EndPositionY;
	}
}
