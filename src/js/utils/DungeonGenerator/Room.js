import  { Direction, clamp, randomRangeInt } from "./../helperFunctions";

export default class Room {
	constructor(width, height, rows, columns, corridor = false){
		// Height and width are arrays with [min, max];
		this.roomWidth = randomRangeInt(width[0], width[1]);
		this.roomHeight = randomRangeInt(height[0], height[1]);
		this.outOfBounds = false;
		this.corridor = corridor;

		if (!corridor){
		// Set x and y so room is roughly in middle of map
		this.xPos = Math.floor(columns / 2 - this.roomWidth / 2);
		this.yPos = Math.floor(rows / 2 + this.roomHeight / 2);
		console.log("First room: xPos: " + this.xPos + " yPos: " + this.yPos);
		} else {
			this.enteringCorridorDirection = corridor.direction;

			switch (corridor.direction){
				case Direction.NORTH:
					// Room must not exceed map so clamp height between 1 and the number of tiles between the corridor end and map end
					this.roomHeight = clamp(this.roomHeight, 1, corridor.EndPositionY);
					// Y coordinate of the room must be at the end of the corridor
					this.yPos = corridor.EndPositionY - 1;

					// Can randomly set X coordiate based on width  of room
					this.xPos = randomRangeInt(corridor.EndPositionX - this.roomWidth + 1, corridor.EndPositionX);
					// Clamp x so that room does not go out of bounds
					this.xPos = clamp(this.xPos, 0, columns - this.roomWidth);
					if (this.yPos - this.roomHeight + 1 < 0){
						this.outOfBounds = true;
					}
					break;
				case Direction.EAST:
					this.roomWidth = clamp(this.roomWidth, 1, columns - corridor.EndPositionX - 1);
					this.xPos = corridor.EndPositionX + 1;

					this.yPos = randomRangeInt(corridor.EndPositionY + this.roomHeight - 1, corridor.EndPositionY);
					this.yPos = clamp(this.yPos, this.roomHeight - 1, rows - 1);
					if (this.xPos + this.roomWidth > rows){
						this.outOfBounds = true;
					}
					break;
				case Direction.SOUTH:
					this.roomHeight = clamp(this.roomHeight, 1,  rows - corridor.EndPositionY - 1);
					this.yPos = corridor.EndPositionY + this.roomHeight;

					this.xPos = randomRangeInt(corridor.EndPositionX - this.roomWidth + 1, corridor.EndPositionX);
					this.xPos = clamp(this.xPos, 0, columns - this.roomWidth);
					if (this.yPos >= columns){
						this.outOfBounds = true;
					}
					break;
				case Direction.WEST:
					this.roomWidth = clamp(this.roomWidth, 1, corridor.EndPositionX);
					this.xPos = corridor.EndPositionX - this.roomWidth;

					this.yPos = randomRangeInt(corridor.EndPositionY + this.roomHeight - 1, corridor.EndPositionY);
					this.yPos = clamp(this.yPos, this.roomHeight - 1, rows - 1);
					if (this.xPos < 0){
						this.outOfBounds = true;
					}
					break;
				default:
					console.log("Corridor direction is not a direction Rooms.js line 50");
			}
		}
	}

	toString(){
		return "roomWidth: " + this.roomWidth + " roomHeight: " + this.roomHeight +
		"\nxPos: " + this.xPos + " yPos: " + this.yPos + "\n" + "enteringCorridorDirection: " + this.enteringCorridorDirection;
	}
}
