import { audioEnabled, setAudioEnabled } from './state.js';
import { mineSound, chainSound } from './assets.js';

export function playMineSound() {
    if (audioEnabled) {
        // Reset time and play
        mineSound.currentTime = 0;
        mineSound.play().catch(e => console.warn("Mine sound play prevented:", e));
    }
}

export function playChainSound() {
    if (audioEnabled) {
        // Reset time and play (allows fast chaining sounds)
        chainSound.currentTime = 0;
        chainSound.play().catch(e => console.warn("Chain sound play prevented:", e));
    }
}

// Function to initially set up audio context/state on first interaction (called from input.js)
export function enableAudioOnInteraction() {
    if (!audioEnabled) {
        setAudioEnabled(true);
         // Attempt to load/unlock sounds by playing and pausing
         try {
             mineSound.play().then(() => mineSound.pause()).catch(e => console.warn("Audio unlock failed (mine):", e));
             chainSound.play().then(() => chainSound.pause()).catch(e => console.warn("Audio unlock failed (chain):", e));
         } catch (e) {
             console.warn("Error during audio unlock attempt:", e);
         }
         console.log("Audio state set to enabled.");
         return true; // Indicate audio was just enabled
    }
    return false; // Indicate audio was already enabled
}