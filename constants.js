// Define base game dimensions (the internal resolution)
export const BASE_WIDTH = 960;
export const BASE_HEIGHT = 720;
export const ASPECT_RATIO = BASE_WIDTH / BASE_HEIGHT;

// Blockchain limit
export const MAX_BLOCKS = 15; // Max blocks per level
export const BLOCK_SIZE = 54; // Base size for block rendering

// Speeds and Sizes (Base dimensions)
export const MINER_SPEED = 4.5;
export const MINER_SIZE = 72;
export const COIN_SIZE = 48;
export const BASE_ENEMY_SPEED = 1.5; // Base speed for level 1
export const BASE_ENEMY_SIZE = 72;
export const BOSS_SIZE = 100;
export const BOSS_SPEED_MULTIPLIER = 2.5; // Boss speed relative to level 9 speed

// Spacing/Padding (Base dimensions)
export const BLOCK_SPACING = 6;
export const BLOCK_START_X = 15;
export const BLOCK_Y = 75;
export const MINER_START_X = 75;
export const MINER_START_Y = 525;

// Scores
export const SCORE_PER_COIN = 10;
export const SCORE_PER_BLOCK = 50;
export const BONUS_PER_LEVEL = 100; // Multiplied by level

// Game Over Messages
export const GAME_OVER_MESSAGES = {
    HACKER_ATTACK: 'HACKER ATTACK!',
    BLOCKCHAIN_FULL: 'BLOCKCHAIN FULL!' // Assuming this is now a game over condition
};

// Level Up Messages
export const LEVEL_UP_MESSAGE = 'LEVEL UP!';
export const BOSS_LEVEL_MESSAGE = 'BOSS LEVEL!';

// Other constants
export const MINING_DURATION = 500; // Milliseconds
export const LEVEL_UP_MESSAGE_DURATION = 2000; // Milliseconds
export const COLLISION_BUFFER_BASE = 5;
export const COLLISION_BUFFER_BOSS = 10;
export const COIN_SPAWN_CHANCE = 0.02;
export const MAX_COINS_NORMAL = 5;
export const MAX_COINS_BOSS = 3;
export const ENEMY_Y_MOVEMENT_CHANCE = 0.02;
export const ENEMY_Y_MOVEMENT_SPEED_MULTIPLIER = 0.5;