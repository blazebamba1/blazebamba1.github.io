// eventListeners.js
import * as Constants from './constants.js';
import * as DOMElements from './domElements.js';
import { playSound } from './audioManager.js';

export function setupGameEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    Constants.keys[e.key] = true;
    if (e.key === ' ' && Constants.gameRunning) {
        if (!Constants.lavaShotEnabled) {
            Constants.projectiles.push({
                x: Constants.player.x,
                y: Constants.player.y,
                width: 10 * Constants.projectileSizeMultiplier,
                height: 10 * Constants.projectileSizeMultiplier,
                speedX: 0,
                speedY: -10 * Constants.projectileSpeedMultiplier,
                speed: 10 * Constants.projectileSpeedMultiplier,
                alive: true,
                isBossProjectile: false,
                color: 'white',
                asciiFace: '^'
            });
            playSound(DOMElements.playerShootSound, false, 0.3);
        }
    }
}

function handleKeyUp(e) {
    Constants.keys[e.key] = false;
}