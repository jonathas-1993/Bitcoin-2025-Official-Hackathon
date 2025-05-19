import {
    chain,
    miner,
    enemies,
    coins,
    score, setScore,
    hashPower, setHashPower,
    level, setLevel,
    gameActive, gameOver,
    setEnemies, setCoins,
    educationalMilestones
} from './state.js';
import {
    MAX_BLOCKS,
    BLOCK_SIZE,
    BLOCK_SPACING,
    BLOCK_START_X,
    BLOCK_Y,
    BASE_WIDTH,
    BASE_HEIGHT,
    MINER_SIZE,
    COIN_SIZE,
    BASE_ENEMY_SPEED,
    BASE_ENEMY_SIZE,
    BOSS_SIZE,
    BOSS_SPEED_MULTIPLIER,
    SCORE_PER_BLOCK,
    SCORE_PER_COIN,
    BONUS_PER_LEVEL,
    MINING_DURATION,
    COIN_SPAWN_CHANCE,
    MAX_COINS_NORMAL,
    MAX_COINS_BOSS,
    ENEMY_Y_MOVEMENT_CHANCE,
    ENEMY_Y_MOVEMENT_SPEED_MULTIPLIER,
    GAME_OVER_MESSAGES,
    LEVEL_UP_MESSAGE,
    BOSS_LEVEL_MESSAGE,
    LEVEL_UP_MESSAGE_DURATION
} from './constants.js';
import { playMineSound, playChainSound } from './audio.js';
import { 
    updateBlocksDisplay, updateHashRateDisplay, 
    updateLevelDisplay, updateScoreDisplay, 
    showMessage, showEducationalPopup, 
    updateHistoricalEvent 
} from './ui.js';
import {
    enemyTypes
} from './education.js';

// Function to spawn a new coin
export function spawnCoin() {
    // Spawn coin in a random location within base dimensions
    coins.push({
        x: Math.random() * (BASE_WIDTH - COIN_SIZE),
        y: Math.random() * (BASE_HEIGHT - COIN_SIZE),
        width: COIN_SIZE,
        height: COIN_SIZE
    });
}

// Function to handle coin collection
export function collectCoin(coinIndex) {
    coins.splice(coinIndex, 1); // Remove collected coin
    setScore(score + SCORE_PER_COIN); // Update score state and UI
    miner.mining = true; // Start mining animation/state

    // Educational trigger
    if (!educationalMilestones.firstCoinCollected) {
        educationalMilestones.firstCoinCollected = true;
    }

    // Mine a block after collecting coin (simulated delay)
    setTimeout(() => {
        mineBlock();
        miner.mining = false; // End mining animation/state
        spawnCoin(); // Spawn a new coin after mining
    }, MINING_DURATION);
}

// Function to mine a block
export function mineBlock() {
    if (!gameActive) return; // Don't mine if game is already over

    // Increment total blocks mined (if tracking)
    // blocksMined++; // Removed for simplicity, score/hash power indicate progress

    setHashPower(hashPower + 0.1); // Update hash power state and UI
    setScore(score + SCORE_PER_BLOCK); // Update score state and UI

    playMineSound(); // Play sound

    // Add block to chain (use base dimensions for position and size)
    // Only add block if chain is not full
    if (chain.length < MAX_BLOCKS) {
        const block = {
            x: BLOCK_START_X + chain.length * (BLOCK_SIZE + BLOCK_SPACING), // Base x, add spacing
            y: BLOCK_Y, // Base y
            width: BLOCK_SIZE, // Base size
            height: BLOCK_SIZE // Base size
        };
        chain.push(block);
        updateBlocksDisplay(chain.length, MAX_BLOCKS); // Update blocks in current chain display

        playChainSound(); // Play chain sound

        // Check if blockchain is full *after* adding the block
        if (chain.length >= MAX_BLOCKS) {
            // Change from gameOver to nextLevel
            nextLevel(); // When chain is full, proceed to next level instead of ending the game
        }
    } 
}

// Function to create enemies based on the current level
export function createEnemiesForLevel() {
    enemies.length = 0; // Clear existing enemies

    let numEnemies = 1;
    // +1 cracker every 2 levels: 1 for lv1~2, 2 for lv3~4, 3 for lv5~6, 4 for lv7~8, boss for lv9+
    if (level >= 3 && level < 9) {
        numEnemies = 1 + Math.floor((level - 1) / 2);
    } else if (level >= 9) {
        numEnemies = 1; // Only 1 boss after level 9
    }
    // At boss level (9+): Show the boss (Haddad/centralized enemy), only 1, stronger/faster

    let currentEnemySpeed = BASE_ENEMY_SPEED + Math.min(level - 1, 7) * 0.5;
    let enemyWidth = BASE_ENEMY_SIZE;
    let enemyHeight = BASE_ENEMY_SIZE;
    let startX = BASE_WIDTH - enemyWidth - 50;

    // On level 9+, configure boss ("chefão digital centralizado")
    if (level >= 9) {
        numEnemies = 1;
        currentEnemySpeed = (BASE_ENEMY_SPEED + (8 - 1) * 0.5) * BOSS_SPEED_MULTIPLIER;
        enemyWidth = BOSS_SIZE;
        enemyHeight = BOSS_SIZE;
        startX = BASE_WIDTH - enemyWidth - 20;
    }

    for (let i = 0; i < numEnemies; i++) {
        enemies.push({
            x: startX + Math.random() * 100 * (i % 2 === 0 ? 1 : -1),
            y: BASE_HEIGHT / 2 + Math.random() * (BASE_HEIGHT / 2 - enemyHeight),
            width: enemyWidth,
            height: enemyHeight,
            speed: currentEnemySpeed,
            direction: -1 // -1 = left, 1 = right, updated by AI below
        });
    }
}

// Function to update enemy positions and AI
export function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        // From level 5 onwards, allow all enemies to move diagonally toward the player!
        if (level < 5) {
            // Horizontal movement towards player, some vertical wiggle
            if (enemy.x < miner.x) {
                enemy.direction = 1;
                enemy.x += enemy.speed;
            } else {
                enemy.direction = -1;
                enemy.x -= enemy.speed;
            }
            // Slight vertical tracking
            if (Math.random() < ENEMY_Y_MOVEMENT_CHANCE * 2) {
                if (enemy.y < miner.y) {
                    enemy.y += enemy.speed * ENEMY_Y_MOVEMENT_SPEED_MULTIPLIER; 
                } else if (enemy.y > miner.y) {
                    enemy.y -= enemy.speed * ENEMY_Y_MOVEMENT_SPEED_MULTIPLIER; 
                }
            }
        } else {
            // LEVEL 5+ ENEMY AI: full 2D pursuit (all directions)
            const dx = miner.x - enemy.x;
            const dy = miner.y - enemy.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0.1) {
                const normDx = dx / dist;
                const normDy = dy / dist;
                enemy.x += normDx * enemy.speed;
                enemy.y += normDy * enemy.speed;
                enemy.direction = (normDx >= 0 ? 1 : -1);
            }
        }

        // Keep enemy on screen
        enemy.x = Math.max(0, Math.min(BASE_WIDTH - enemy.width, enemy.x));
        enemy.y = Math.max(0, Math.min(BASE_HEIGHT - enemy.height, enemy.y));
    }
}

// Function to advance to the next level
export function nextLevel() {
     setLevel(level + 1); // Increment level state and UI

     // Add bonus score for completing a level
     setScore(score + BONUS_PER_LEVEL * level); // Bonus scales with new level

     // Clear the chain for the next level
     chain.length = 0;
     updateBlocksDisplay(chain.length, MAX_BLOCKS); // Reset blocks in chain display

     // Update historical event display
     updateHistoricalEvent(level);
     
     // Create new set of enemies for the next level
     createEnemiesForLevel();

     // Show level up message
     const message = level >= 10 ? BOSS_LEVEL_MESSAGE : LEVEL_UP_MESSAGE;
     showMessage(message, LEVEL_UP_MESSAGE_DURATION);

     // Educational popup for level up
     if (!educationalMilestones.firstLevelUp) {
        educationalMilestones.firstLevelUp = true;
        setTimeout(() => {
            showEducationalPopup('levelUp');
        }, 2000);
     }
     
     if (level >= 10) {
         console.log("Boss approaching!");
     }
}