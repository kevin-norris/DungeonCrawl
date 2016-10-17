
export function generateDungeon() {
	return {
		type: "GENERATE_DUNGEON"
	};
}

export function move(vector){
	return {
		type: "MOVE_HERO",
		vector: vector
	};
}

export function moveEnemies(){
	return {
		type: "MOVE_ENEMIES"
	};
}

export function updateCamSize(newSize){
	return {
		type: "UPDATE_CAM_SIZE",
		size: newSize
	};
}

export function toggleDarkness(){
	return {type: "TOGGLE_DARKNESS"};
}
