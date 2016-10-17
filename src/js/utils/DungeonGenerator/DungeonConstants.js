import { randomRangeInt } from "./../helperFunctions";

export const DUNGEON_WIDTH = 80;
export const DUNGEON_HEIGHT = 80;
export const DUNGEON_TILES = {
	WALL: 0,
	CORRIDOR: 1,
	ROOM: 2,
	HP: 3,
	WEAPON: 4,
	PORTOL: 5,
	ENEMY: 6,
	BOSS: 7
};
export const damageDeviation = 0.2;
export const weapons = [
						{name: "Fists", multiplier: 1},
						{name: "Stick", multiplier: 1.5},
						{name: "Knife", multiplier: 2},
						{name: "Mace", multiplier: 3},
						{name: "Great Sword", multiplier: 5}
						];

export const HeroBase = {hp: 60, damage: 10, nextLevelXP: 50, level: 1};
export const levelHero = (hero) => {
	return {hp: hero.hp, damage: hero.damage + 5, nextLevelXP: HeroBase.nextLevelXP * Math.pow(2, hero.level), level: hero.level + 1};
};

// Enemy constatns
export const minEnemis = 5;
export const getEnemyCount = (level) => {
	return randomRangeInt(minEnemis, minEnemis + level * 1.5 + 1);
};
export const EnemyBase = {hp: 30, damage: 10, xp: 10};
// Enemies stats double each level
export const getEnemyOfLevel = (level) => {
	return {hp: EnemyBase.hp * Math.pow(2, level - 1), damage: EnemyBase.damage * Math.pow(2, level - 1), xp: EnemyBase.xp * Math.pow(2, level - 1), type: DUNGEON_TILES.ENEMY};
};
export const EnemyVisionRange = 7;

// hpPack constants
export const minHpPack = 5;
export const getHPCount = (level) => {
	return randomRangeInt(minHpPack, minHpPack + level * 1.5 + 1);
};
export const hpPackBase = 30;
// hp packs have 30 more hp each level
export const getHpPackOfLevel = (level) => {
	return hpPackBase + ((level - 1) * 30);
};

export const boss = {hp: 600, damage: 100, type: DUNGEON_TILES.BOSS};
