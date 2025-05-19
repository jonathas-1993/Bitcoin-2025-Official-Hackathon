import { keys, setAudioEnabled } from './state.js'; // Import state and setter
import { mineSound, chainSound } from './assets.js'; // Import sounds to potentially load them
import { setupMobileControls } from './mobile.js'; // Import mobile controls setup

export function setupInput() {
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Set up mobile controls
    setupMobileControls();

    // Optional: Prevent default behavior for arrow keys to stop scrolling
    window.addEventListener("keydown", function(e) {
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) > -1) {
            e.preventDefault();
        }
    }, false);
}

function handleUserInteraction() {
    // Enable audio only on the first user interaction
    // This is crucial for mobile browsers (iOS/Safari)
    // Play/pause sounds immediately to unlock them
    if (!setAudioEnabled(true)) { // Check if audio was just enabled
         // Try playing and pausing sounds
         try {
             mineSound.play().then(() => mineSound.pause()).catch(e => console.warn("Audio play prevented:", e));
             chainSound.play().then(() => chainSound.pause()).catch(e => console.warn("Audio play prevented:", e));
         } catch (e) {
             console.warn("Error attempting to play sounds:", e);
         }
         console.log("Audio enabled on user interaction.");
         document.removeEventListener('click', handleUserInteraction); // Remove listener after first interaction
         document.removeEventListener('keydown', handleUserInteraction); // Also remove keydown listener if it was used
     }
}

function handleKeyDown(e) {
    keys[e.key] = true;
    
    // Add WASD key support
    if (e.key.toLowerCase() === 'w') keys['ArrowUp'] = true;
    if (e.key.toLowerCase() === 'a') keys['ArrowLeft'] = true;
    if (e.key.toLowerCase() === 's') keys['ArrowDown'] = true;
    if (e.key.toLowerCase() === 'd') keys['ArrowRight'] = true;
    
    // Also call the interaction handler on keydown
    handleUserInteraction();
}

function handleKeyUp(e) {
    keys[e.key] = false;
    
    // Add WASD key support for key up
    if (e.key.toLowerCase() === 'w') keys['ArrowUp'] = false;
    if (e.key.toLowerCase() === 'a') keys['ArrowLeft'] = false;
    if (e.key.toLowerCase() === 's') keys['ArrowDown'] = false;
    if (e.key.toLowerCase() === 'd') keys['ArrowRight'] = false;
}