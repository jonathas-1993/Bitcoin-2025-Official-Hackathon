import {
    BASE_WIDTH,
    BASE_HEIGHT,
    MINER_START_X,
    MINER_START_Y,
    MINER_SIZE,
    MAX_BLOCKS,
    GAME_OVER_MESSAGES
} from './constants.js';
import { updateScoreDisplay, updateBlocksDisplay, updateHashRateDisplay, updateLevelDisplay, showGameOver } from './ui.js';
import { createEnemiesForLevel, spawnCoin } from './objects.js';
import { resetEducationState } from './education.js';

// Game state
export let blocksMined = 0; // Total blocks mined across levels
export let hashPower = 1;
export let score = 0;
export let gameActive = true;
export let level = 1; // Current level

// Game objects (using base dimensions)
export const miner = {
    x: MINER_START_X,
    y: MINER_START_Y,
    width: MINER_SIZE,
    height: MINER_SIZE,
    speed: 0, // Speed is applied in game.js based on input and constants
    direction: 1, // 1 = right, -1 = left
    mining: false
};

export let enemies = [];
export let coins = [];
export const chain = [];

// Input state
export const keys = {};

// Audio state
export let audioEnabled = false;

// Additional education state
export let educationalMilestones = {
    firstBlockMined: false,
    firstCoinCollected: false,
    firstLevelUp: false,
    firstEnemyEvaded: false,
    firstHalvingReached: false
};

// Setters for state variables (needed if importing modules modify them)
export function setAudioEnabled(enabled) {
    audioEnabled = enabled;
}

export function setGameActive(active) {
    gameActive = active;
}

export function setScore(newScore) {
    score = newScore;
    updateScoreDisplay(score);
}

export function setHashPower(newHashPower) {
    hashPower = newHashPower;
    updateHashRateDisplay(hashPower);
}

export function setBlocksMined(count) {
    blocksMined = count;
}

export function setLevel(newLevel) {
    level = newLevel;
    updateLevelDisplay(level);
}

export function setEnemies(newEnemies) {
    enemies = newEnemies;
}

export function setCoins(newCoins) {
    coins = newCoins;
}

// Game management functions
export function resetGame() {
    blocksMined = 0;
    hashPower = 1;
    score = 0;
    level = 1; 
    gameActive = true; 

    miner.x = MINER_START_X;
    miner.y = MINER_START_Y;
    miner.direction = 1;
    miner.mining = false;

    enemies.length = 0;
    coins.length = 0;
    chain.length = 0;

    for (const key in keys) {
       delete keys[key];
    }
    
    educationalMilestones = {
        firstBlockMined: false,
        firstCoinCollected: false,
        firstLevelUp: false,
        firstEnemyEvaded: false,
        firstHalvingReached: false
    };
    resetEducationState();

    updateScoreDisplay(score);

    updateBlocksDisplay(chain.length, MAX_BLOCKS);
    updateHashRateDisplay(hashPower);
}

export function gameOver(messageKey = 'GAME_OVER') {
    gameActive = false;
    const message = GAME_OVER_MESSAGES[messageKey] || 'GAME OVER';
    showGameOver(score, message);
}