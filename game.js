import { miner, enemies, coins, chain, keys, gameActive, setGameActive, gameOver, level, educationalMilestones } from './state.js';
import {
    MINER_SPEED,
    BASE_WIDTH,
    BASE_HEIGHT,
    COIN_SPAWN_CHANCE,
    MAX_COINS_NORMAL,
    MAX_COINS_BOSS,
    MINER_SIZE,
    BASE_ENEMY_SIZE,
    BOSS_SIZE
} from './constants.js';
import { scaleX, scaleY, scaleSize, checkCollision, resizeCanvas } from './utils.js';
import { setupInput } from './input.js';
import { 
    updateScoreDisplay, updateBlocksDisplay, updateHashRateDisplay, 
    updateLevelDisplay, hideGameOver, showMessage, canvas, ctx, 
    gameContainer, showTutorial, showEducationalPopup, 
    showAchievement, updateHistoricalEvent
} from './ui.js';
import { 
    mineBlock, spawnCoin, collectCoin, updateEnemies, 
    createEnemiesForLevel, nextLevel 
} from './objects.js';
import { minerImg, blockImg, enemyImg, coinImg, bossImg } from './assets.js';
import { resetGame } from './state.js';
import { educationState, achievements, unlockAchievement } from './education.js';

// Main game loop function
export function gameLoop() {
    if (!gameActive) return;

    update(); // Update game state
    render(); // Draw game
    checkEducationalTriggers(); // Check for educational content to show

    if (gameActive) {
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    if (!gameActive) return;

    // Miner movement - fixed so player can move free!
    if (keys['ArrowLeft']) {
        miner.x -= MINER_SPEED; 
        miner.direction = -1;
    }
    if (keys['ArrowRight']) {
        miner.x += MINER_SPEED; 
        miner.direction = 1;
    }
    if (keys['ArrowUp']) miner.y -= MINER_SPEED;
    if (keys['ArrowDown']) miner.y += MINER_SPEED;

    // Clamp position to screen
    miner.x = Math.max(0, Math.min(BASE_WIDTH - MINER_SIZE, miner.x));
    miner.y = Math.max(0, Math.min(BASE_HEIGHT - MINER_SIZE, miner.y));

    // Enemies move/pursue
    updateEnemies();

    // Check collision with any active enemy (lose if collision)
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (checkCollision(miner, enemy)) {
            createLightningEffect(miner.x, miner.y);
            gameOver('HACKER_ATTACK!');
            return;
        }
    }

    // Coins collection
    for (let i = coins.length - 1; i >= 0; i--) {
        if (checkCollision(miner, coins[i])) {
            collectCoin(i);
        }
    }
    // Spawn coins if needed
    if (coins.length < (level >= 10 ? MAX_COINS_BOSS : MAX_COINS_NORMAL) && Math.random() < COIN_SPAWN_CHANCE) { 
        spawnCoin();
    }
}

// Function to create lightning effect when miner is attacked
function createLightningEffect(x, y) {
    const lightning = document.createElement('div');
    lightning.className = 'lightning-effect';
    
    // Position and size the lightning relative to canvas
    lightning.style.width = `${scaleSize(MINER_SIZE * 1.5)}px`;
    lightning.style.height = `${scaleSize(MINER_SIZE * 1.5)}px`;
    lightning.style.left = `${scaleX(x - MINER_SIZE * 0.25)}px`;
    lightning.style.top = `${scaleY(y - MINER_SIZE * 0.25)}px`;
    
    // Add to game container
    gameContainer.appendChild(lightning);
    
    // Remove after animation completes
    setTimeout(() => {
        lightning.remove();
    }, 300);
}

function checkEducationalTriggers() {
    // Show tutorial first time
    if (educationState.tutorialActive && !educationState.tutorialCompleted) {
        showTutorial();
    }
    
    // First block mined
    if (chain.length === 1 && !educationalMilestones.firstBlockMined) {
        educationalMilestones.firstBlockMined = true;
        setTimeout(() => {
            showEducationalPopup('firstBlock');
            unlockAchievement('firstMiner');
            showAchievement('firstMiner');
        }, 1000);
    }
    
    // Chain building
    if (chain.length >= 5 && !achievements.chainBuilder.unlocked) {
        setTimeout(() => {
            unlockAchievement('chainBuilder');
            showAchievement('chainBuilder');
        }, 1000);
    }
    
    // Level up (halving)
    if (level >= 3 && !educationalMilestones.firstHalvingReached) {
        educationalMilestones.firstHalvingReached = true;
        setTimeout(() => {
            unlockAchievement('halvingSurvivor');
            showAchievement('halvingSurvivor');
        }, 2000);
    }
}

export function render() {
    // Clear screen 
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling factors
    const scaleW = canvas.width / BASE_WIDTH;
    const scale = scaleW; 

    // Draw blocks in chain
    chain.forEach((block, index) => {
        ctx.drawImage(blockImg,
            scaleX(block.x), scaleY(block.y),
            scaleSize(block.width), scaleSize(block.height)
        );
    });

    // Draw connection lines between blocks
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2 * scale; 
    if (chain.length > 0) { 
        ctx.beginPath();
        ctx.moveTo(scaleX(chain[0].x + chain[0].width), scaleY(chain[0].y + chain[0].height / 2));

        for (let i = 0; i < chain.length; i++) {
            const current = chain[i];
            ctx.lineTo(scaleX(current.x), scaleY(current.y + current.height / 2));
            ctx.moveTo(scaleX(current.x + current.width), scaleY(current.y + current.height / 2));
        }
        ctx.stroke();
    }
    
    // Draw coins
    coins.forEach(coin => {
        ctx.drawImage(coinImg,
            scaleX(coin.x), scaleY(coin.y),
            scaleSize(coin.width), scaleSize(coin.height)
        );
    });

    // Draw miner character
    ctx.save();
    if (miner.direction === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(minerImg,
            -scaleX(miner.x + miner.width), scaleY(miner.y), 
            scaleSize(miner.width), scaleSize(miner.height)
        );
    } else {
        ctx.drawImage(minerImg,
            scaleX(miner.x), scaleY(miner.y),
            scaleSize(miner.width), scaleSize(miner.height)
        );
    }
    ctx.restore();
    
    // Draw enemies
    enemies.forEach(enemy => {
        ctx.save();
        const currentEnemyImg = (level >= 9) ? bossImg : enemyImg; 

        if (enemy.direction === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(currentEnemyImg,
                -scaleX(enemy.x + enemy.width), scaleY(enemy.y), 
                scaleSize(enemy.width), scaleSize(enemy.height)
            );
        } else {
            ctx.drawImage(currentEnemyImg,
                scaleX(enemy.x), scaleY(enemy.y),
                scaleSize(enemy.width), scaleSize(enemy.height)
            );
        }
        ctx.restore();
    });

    // Draw mining animation
    if (miner.mining) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3 * scale; 
        ctx.beginPath();
        ctx.arc(scaleX(miner.x + miner.width/2), scaleY(miner.y + miner.height/2),
                scaleSize(miner.width / 1.5), 0, Math.PI * 2); 
        ctx.stroke();
    }

    // Draw tooltips for educational elements 
    // (additional educational visual elements can be added here)
}

// Start game
setupInput();
resetGame();
showTutorial(); // Show tutorial on game start
gameLoop();

// Add event listener for window resize
window.addEventListener('resize', resizeCanvas);