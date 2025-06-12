// projectileLogic.js
import * as Constants from './constants.js';
import * as DOMElements from './domElements.js';
import { playSound } from './audioManager.js';

export function bossShoot(boss) {
    let pSpeed = 3 + (boss.currentPhase * 0.5);
    let pSize = 10;
    let numProjectiles = 1;
    let pChar = '-';

    if (Constants.selectedDifficulty) {
        if (Constants.selectedDifficulty.modifier === "easy") {
            pSpeed *= 0.8;
        } else if (Constants.selectedDifficulty.modifier === "hard") {
            pSpeed *= 1.2;
        }
    }

    switch (boss.name) {
        case "Flash Scuttler":
        case "Chrono Blight":
            numProjectiles = boss.currentPhase;
            pSpeed = (5 + (boss.currentPhase * 1)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '>';
            if (boss.name === "Chrono Blight") {
                pSpeed *= 1.2;
                numProjectiles += 1;
            }
            for (let i = 0; i < numProjectiles; i++) {
                const angleSpread = (Math.PI / 8) * (numProjectiles - 1) / 2;
                const angle = (Math.PI / 2) - angleSpread + (i * (Math.PI / 8));
                Constants.projectiles.push({
                    x: boss.x,
                    y: boss.y + boss.height / 2,
                    width: pSize,
                    height: pSize * 2,
                    speedX: Math.cos(angle) * pSpeed * 0.5,
                    speedY: Math.sin(angle) * pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'orange',
                    asciiFace: pChar
                });
            }
            break;
        case "Aether Weaver":
        case "Astral Anomaly":
            numProjectiles = 3 + (boss.currentPhase * 1);
            pSpeed = (2 + (boss.currentPhase * 0.5)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '*';
            if (boss.name === "Astral Anomaly") {
                pSpeed *= 1.1;
                numProjectiles += 2;
            }
            for (let i = 0; i < numProjectiles; i++) {
                const angle = (Math.PI * 2 / numProjectiles) * i;
                Constants.projectiles.push({
                    x: boss.x,
                    y: boss.y + boss.height / 2,
                    width: pSize,
                    height: pSize,
                    speedX: Math.cos(angle) * pSpeed,
                    speedY: Math.sin(angle) * pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'purple',
                    asciiFace: pChar
                });
            }
            break;
        case "Glacial Sentinel":
        case "Temporal Quake":
            numProjectiles = 1;
            pSpeed = (4 + (boss.currentPhase * 0.5)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '❄️';
            if (boss.name === "Temporal Quake") {
                pSpeed *= 1.1;
                numProjectiles += 1;
            }
            Constants.projectiles.push({
                x: boss.x,
                y: boss.y + boss.height / 2,
                width: pSize * 2,
                height: pSize * 2,
                speedX: 0,
                speedY: pSpeed,
                speed: pSpeed,
                alive: true,
                isBossProjectile: true,
                color: 'lightblue',
                asciiFace: pChar,
                isSlowProjectile: true
            });
            break;
        case "Cinder Beast":
        case "Infernal Core":
            numProjectiles = 5;
            pSpeed = (3 + (boss.currentPhase * 0.8)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '🔥';
            if (boss.name === "Infernal Core") {
                pSpeed *= 1.2;
                numProjectiles += 2;
            }
            for (let i = 0; i < numProjectiles; i++) {
                const angle = Math.random() * Math.PI;
                Constants.projectiles.push({
                    x: boss.x + Math.random() * boss.width - boss.width / 2,
                    y: boss.y + boss.height / 2,
                    width: pSize,
                    height: pSize,
                    speedX: Math.cos(angle) * pSpeed,
                    speedY: Math.sin(angle) * pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'red',
                    asciiFace: pChar
                });
            }
            break;
        case "Gaze Weaver":
        case "Omniscient Eye":
            numProjectiles = 1;
            pSpeed = (5 + (boss.currentPhase * 1)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '•';
            const angleToPlayer = Math.atan2(Constants.player.y - boss.y, Constants.player.x - boss.x);
            Constants.projectiles.push({
                x: boss.x,
                y: boss.y + boss.height / 2,
                width: pSize,
                height: pSize,
                speedX: Math.cos(angleToPlayer) * pSpeed,
                speedY: Math.sin(angleToPlayer) * pSpeed,
                speed: pSpeed,
                alive: true,
                isBossProjectile: true,
                color: 'blue',
                asciiFace: pChar,
                isHomingProjectile: true
            });
            break;
        case "Feral Vanguard":
        case "Apex Predator":
            numProjectiles = 3;
            pSpeed = (4 + (boss.currentPhase * 0.8)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '🐾';
            if (boss.name === "Apex Predator") {
                pSpeed *= 1.1;
                numProjectiles += 2;
            }
            for (let i = 0; i < numProjectiles; i++) {
                const angleSpread = Math.PI / 4;
                const angle = (Math.PI / 2) - (angleSpread / 2) + (i * (angleSpread / (numProjectiles - 1)));
                Constants.projectiles.push({
                    x: boss.x,
                    y: boss.y + boss.height / 2,
                    width: pSize,
                    height: pSize,
                    speedX: Math.cos(angle) * pSpeed,
                    speedY: Math.sin(angle) * pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'yellow',
                    asciiFace: pChar
                });
            }
            break;
        case "Stone Colossus":
        case "Iron Behemoth":
            numProjectiles = 1;
            pSpeed = (2 + (boss.currentPhase * 0.5)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '🪨';
            Constants.projectiles.push({
                x: boss.x,
                y: boss.y + boss.height / 2,
                width: pSize * 3,
                height: pSize * 3,
                speedX: 0,
                speedY: pSpeed,
                speed: pSpeed,
                alive: true,
                isBossProjectile: true,
                color: 'darkgray',
                asciiFace: pChar
            });
            break;
        case "Pika Minion":
        case "Grand Pika":
            numProjectiles = 5 + (boss.currentPhase * 2);
            pSpeed = (6 + (boss.currentPhase * 1.5)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '⚡';
            for (let i = 0; i < numProjectiles; i++) {
                Constants.projectiles.push({
                    x: boss.x,
                    y: boss.y + boss.height / 2,
                    width: pSize / 2,
                    height: pSize / 2,
                    speedX: (Math.random() - 0.5) * pSpeed * 0.5,
                    speedY: pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'yellow',
                    asciiFace: pChar
                });
            }
            break;
        case "Static Overload":
        case "Arcane Overlord":
            numProjectiles = 2 + (boss.currentPhase * 1);
            pSpeed = (3 + (boss.currentPhase * 0.7)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = 'Z';
            for (let i = 0; i < numProjectiles; i++) {
                Constants.projectiles.push({
                    x: boss.x,
                    y: boss.y + boss.height / 2,
                    width: pSize,
                    height: pSize,
                    speedX: (Math.random() - 0.5) * pSpeed,
                    speedY: pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'cyan',
                    asciiFace: pChar,
                    isElectricProjectile: true
                });
            }
            break;
        case "Whisper Shade":
        case "Phantom King":
            numProjectiles = 1 + (boss.currentPhase * 0.5);
            pSpeed = (4 + (boss.currentPhase * 0.8)) * (Constants.selectedDifficulty.modifier === "hard" ? 1.2 : 1);
            pChar = '💨';
            for (let i = 0; i < numProjectiles; i++) {
                Constants.projectiles.push({
                    x: boss.x + (Math.random() - 0.5) * boss.width,
                    y: boss.y + boss.height / 2,
                    width: pSize,
                    height: pSize,
                    speedX: (Math.random() - 0.5) * pSpeed * 0.5,
                    speedY: pSpeed,
                    speed: pSpeed,
                    alive: true,
                    isBossProjectile: true,
                    color: 'lightgray',
                    asciiFace: pChar,
                    alpha: 1,
                    fadeSpeed: 0.02
                });
            }
            break;
        default:
            Constants.projectiles.push({
                x: boss.x,
                y: boss.y + boss.height / 2,
                width: pSize,
                height: pSize,
                speedX: (Math.random() - 0.5) * pSpeed,
                speedY: pSpeed,
                speed: pSpeed,
                alive: true,
                isBossProjectile: true,
                color: 'white',
                asciiFace: '•'
            });
            break;
    }
    playSound(DOMElements.alienShootSound, false, 0.3);
}