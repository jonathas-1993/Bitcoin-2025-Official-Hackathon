import { keys } from './state.js';

// Map directional buttons to corresponding key codes
const CONTROL_MAP = {
    'btn-up': 'ArrowUp',
    'btn-down': 'ArrowDown',
    'btn-left': 'ArrowLeft',
    'btn-right': 'ArrowRight'
};

// Set up touch controls
export function setupMobileControls() {
    // For each control button
    Object.keys(CONTROL_MAP).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        // Map to corresponding key
        const keyName = CONTROL_MAP[btnId];

        // Touch/click start - simulate key down
        const handleStart = (e) => {
            e.preventDefault(); // Prevent scrolling
            keys[keyName] = true;
        };

        // Touch/click end - simulate key up
        const handleEnd = (e) => {
            e.preventDefault();
            keys[keyName] = false;
        };

        // Add event listeners for both touch and mouse events
        btn.addEventListener('touchstart', handleStart, { passive: false });
        btn.addEventListener('mousedown', handleStart);
        
        btn.addEventListener('touchend', handleEnd);
        btn.addEventListener('mouseup', handleEnd);
        
        // Also handle touch leave/cancel events
        btn.addEventListener('touchcancel', handleEnd);
        btn.addEventListener('touchleave', handleEnd);
        btn.addEventListener('mouseleave', handleEnd);
    });

    // Helper function to detect if on mobile device
    function isMobileDevice() {
        return (typeof window.orientation !== 'undefined') || 
               (navigator.userAgent.indexOf('IEMobile') !== -1) ||
               (window.innerWidth <= 768); // Also consider screen size
    }

    // Show/hide controls based on device type
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        if (isMobileDevice()) {
            mobileControls.style.display = 'flex';
        } else {
            mobileControls.style.display = 'none';
        }
    }
}