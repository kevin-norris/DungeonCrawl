export const Direction = {
	NORTH: 0,
	EAST: 1,
	SOUTH: 2,
	WEST: 3,
};

export function clamp(num, min, max) {
	return Math.max(Math.min(num, max), min);
}

// Returns and intiger betwee min (included) and max (excluded)
export function randomRangeInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// Returns the width and height of the screen
export function getScreenSize() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
    return { width: x, height: y };
}
