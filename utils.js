import { BASE_WIDTH, BASE_HEIGHT, COLLISION_BUFFER_BASE, COLLISION_BUFFER_BOSS } from './constants.js';
import { canvas, gameContainer } from './ui.js'; // Import canvas and container from ui

// Helper function to scale base coordinates/sizes to current canvas dimensions
// Scale based on the ratio of canvas width to base width, as the canvas scales to fit the container width.
export function scaleX(x) { return x * (canvas.width / BASE_WIDTH); }
export function scaleY(y) { return y * (canvas.height / BASE_HEIGHT); }
export function scaleSize(size) { return size * (canvas.width / BASE_WIDTH); } // Scale size based on width ratio

// Function to resize the canvas while maintaining aspect ratio
export function resizeCanvas() {
    if (!canvas || !gameContainer) return; // Ensure elements exist

    // Get container width with a maximum width for large displays
    const maxWidth = Math.min(1280, window.innerWidth * 0.95);
    const containerWidth = Math.min(gameContainer.offsetWidth, maxWidth);
    const containerHeight = containerWidth * (BASE_HEIGHT / BASE_WIDTH); // Use BASE_HEIGHT / BASE_WIDTH for aspect ratio

    canvas.width = containerWidth;
    canvas.height = containerHeight;

     // When resizing, a full render is usually needed
    // The render loop in game.js will handle this if gameActive
    // If game is over, showGameOver in ui.js will handle the overlay
}

// Collision detection function (uses base dimensions)
export function checkCollision(obj1, obj2, level) {
    // Add a slight buffer to collisions for less frustration
    const buffer = (level >= 10 ? COLLISION_BUFFER_BOSS : COLLISION_BUFFER_BASE);
    return obj1.x < obj2.x + obj2.width - buffer &&
        obj1.x + obj1.width - buffer > obj2.x &&
        obj1.y < obj2.y + obj2.height - buffer &&
        obj1.y + obj1.height - buffer > obj2.y;
}