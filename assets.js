export const minerImg = new Image();
minerImg.src = 'miner.png';
export const blockImg = new Image();
blockImg.src = 'block.png';
export const enemyImg = new Image();
enemyImg.src = 'enemy.png'; // Regular enemy image
export const coinImg = new Image();
coinImg.src = 'coin.png';
export const bossImg = new Image(); // New boss image
bossImg.src = 'haddad.png';

// Audio
export const mineSound = new Audio('mine.mp3');
export const chainSound = new Audio('chain.mp3');

// Optional: Wait for images to load before starting?
// export function loadAssets() {
//     return Promise.all([
//         new Promise(resolve => minerImg.onload = resolve),
//         new Promise(resolve => blockImg.onload = resolve),
//         new Promise(resolve => enemyImg.onload = resolve),
//         new Promise(resolve => coinImg.onload = resolve),
//         new Promise(resolve => bossImg.onload = resolve),
//         // Note: Audio loading is trickier, often handled on first user interaction
//     ]);
// }