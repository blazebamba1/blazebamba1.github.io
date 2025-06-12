// entities.js
import * as Constants from './constants.js';
import * as DOMElements from './domElements.js';
import { playSound } from './audioManager.js';

export function createAlien() {
    const baseSpeedY = 0.5;
    const baseSpeedX = 1;
    const baseWidth = 25;

    let alienSpeed = baseSpeedY * Constants.alienSpeedMultiplier;
    let alienHorizontalSpeed = (Math.random() - 0.5) * baseSpeedX * Constants.alienHorizontalSpeedMultiplier;
    let alienSize = baseWidth * Constants.alienSizeMultiplier;
    let alienShootInterval = 180;

    if (Constants.selectedDifficulty && Constants.selectedDifficulty.modifier === "hard") {
        alienShootInterval = 120;
    }

    return {
        x: Math.random() * (DOMElements.gameCanvas.width - alienSize) + alienSize / 2,
        y: 50 + Constants.alienSpawnYOffset,
        width: alienSize,
        height: alienSize,
        speedY: alienSpeed,
        speedX: alienHorizontalSpeed,
        alive: true,
        isLevitating: false,
        levitateDuration: 0,
        explosionTimer: 0,
        originalSpeedY: alienSpeed,
        color: null,
        asciiFace: '👾',
        shootTimer: Math.random() * alienShootInterval,
        shootInterval: alienShootInterval
    };
}

export function createAlienAt(x, y, size, color, ascii) {
    const baseSpeedY = 0.5;
    const baseSpeedX = 1;
    let alienSpeed = baseSpeedY * Constants.alienSpeedMultiplier;
    let alienHorizontalSpeed = (Math.random() - 0.5) * baseSpeedX * Constants.alienHorizontalSpeedMultiplier;
    if (Constants.selectedDifficulty && Constants.selectedDifficulty.modifier === "hard") {
        alienSpeed *= 1.5;
        alienHorizontalSpeed *= 1.5;
    }
    return {
        x: x,
        y: y,
        width: size,
        height: size,
        speedY: alienSpeed,
        speedX: alienHorizontalSpeed,
        alive: true,
        isLevitating: false,
        levitateDuration: 0,
        explosionTimer: 0,
        originalSpeedY: alienSpeed,
        color: color,
        asciiFace: ascii,
        shootTimer: Math.random() * 120,
        shootInterval: 180
    };
}

function getTotalPhases(potionIndex, bossNumber) {
    let basePhases = 1;
    if (bossNumber === 2) basePhases = 2;

    if (potionIndex === 0) basePhases += bossNumber === 1 ? 1 : 1;
    if (potionIndex === 6) basePhases += bossNumber === 1 ? 1 : 2;

    if (Constants.selectedDifficulty && Constants.selectedDifficulty.modifier === "hard") {
        basePhases += 1;
    }
    return Math.max(1, basePhases);
}

export function createBoss(potionEffect, bossNumber) {
    const potionIndex = Constants.potions.findIndex(p => p.effect === potionEffect);
    let totalPhases = getTotalPhases(potionIndex, bossNumber);

    let baseHealthFactor = 1;
    let baseSpeedFactor = 1;
    let baseShotIntervalFactor = 1;
    let spawnMiniAliens = false;

    if (Constants.selectedDifficulty) {
        if (Constants.selectedDifficulty.modifier === "easy") {
            baseHealthFactor = 0.7;
            baseSpeedFactor = 0.8;
        } else if (Constants.selectedDifficulty.modifier === "hard") {
            baseHealthFactor = 1.3;
            baseSpeedFactor = 1.2;
            spawnMiniAliens = true;
        }
    }

    let bossProps = {
        x: DOMElements.gameCanvas.width / 2,
        y: 70,
        width: 70,
        height: 70,
        speedY: 0.3 * baseSpeedFactor,
        speedX: 0.5 * baseSpeedFactor,
        baseHealth: 10 * baseHealthFactor,
        health: 10 * baseHealthFactor,
        maxHealth: 10 * baseHealthFactor,
        alive: true,
        name: "Boss",
        color: 'purple',
        specialBehavior: null,
        shotTimer: 0,
        shotInterval: 90 / baseShotIntervalFactor,
        currentPhase: 1,
        totalPhases: totalPhases,
        asciiFace: 'O_O',
        spawnMinions: spawnMiniAliens
    };

    bossProps.health = Math.ceil(bossProps.baseHealth);
    bossProps.maxHealth = Math.ceil(bossProps.baseHealth);

    if (bossNumber === 1) { // MINI-BOSS 1 CONFIGURATIONS
        switch (potionEffect) {
            case "speed":
                bossProps.name = "Flash Scuttler";
                bossProps.baseHealth = 15 * baseHealthFactor;
                bossProps.speedY = 1.5 * baseSpeedFactor;
                bossProps.color = 'darkblue';
                bossProps.shotInterval = 60 / baseShotIntervalFactor;
                bossProps.asciiFace = '>o<';
                break;
            case "levitate":
                bossProps.name = "Aether Weaver";
                bossProps.baseHealth = 12 * baseHealthFactor;
                bossProps.speedY = 0;
                bossProps.color = 'lightgray';
                bossProps.shotInterval = 100 / baseShotIntervalFactor;
                bossProps.asciiFace = '-_-';
                bossProps.specialBehavior = function() {
                    if (this.spawnMinions && Math.random() < Constants.alienMinionSpawnChance * 1.5 && Constants.aliens.length < 5) {
                        Constants.aliens.push(createAlienAt(this.x + Math.random() * 40 - 20, this.y + this.height / 2, 15, 'white', 'o'));
                    }
                };
                break;
            case "slow-aliens":
                bossProps.name = "Glacial Sentinel";
                bossProps.baseHealth = 20 * baseHealthFactor;
                bossProps.speedY = 0.1 * baseSpeedFactor;
                bossProps.color = 'brown';
                bossProps.shotInterval = 150 / baseShotIntervalFactor;
                bossProps.asciiFace = 'o.o';
                break;
            case "lava-shot":
                bossProps.name = "Cinder Beast";
                bossProps.baseHealth = 18 * baseHealthFactor;
                bossProps.speedY = 0.4 * baseSpeedFactor;
                bossProps.color = 'red';
                bossProps.shotInterval = 90 / baseShotIntervalFactor;
                bossProps.asciiFace = '>_<';
                break;
            case "auto-aim":
                bossProps.name = "Gaze Weaver";
                bossProps.baseHealth = 10 * baseHealthFactor;
                bossProps.speedY = 0.3 * baseSpeedFactor;
                bossProps.color = 'gray';
                bossProps.teleportTimer = 0;
                bossProps.teleportInterval = 120 / baseSpeedFactor;
                bossProps.shotInterval = 120 / baseShotIntervalFactor;
                bossProps.asciiFace = '@_@';
                bossProps.specialBehavior = function() {
                    this.teleportTimer++;
                    if (this.teleportTimer >= this.teleportInterval) {
                        playSound(DOMElements.teleportSound, false, 0.7);
                        this.x = Math.random() * (DOMElements.gameCanvas.width - this.width) + this.width / 2;
                        this.y = Math.random() * (DOMElements.gameCanvas.height / 2 - this.height) + this.height / 2;
                        this.teleportTimer = 0;
                        this.teleportInterval = Math.max(60, (120 - (this.currentPhase - 1) * 10) / baseSpeedFactor);
                    }
                };
                break;
            case "lion-power":
                bossProps.name = "Feral Vanguard";
                bossProps.baseHealth = 20 * baseHealthFactor;
                bossProps.speedY = 0.8 * baseSpeedFactor;
                bossProps.color = 'gold';
                bossProps.width = 80;
                bossProps.height = 80;
                bossProps.shotInterval = 70 / baseShotIntervalFactor;
                bossProps.asciiFace = '^.^';
                bossProps.specialBehavior = function() {
                    const dx = Constants.player.x - this.x;
                    const dy = Constants.player.y - this.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    if (distance > 1) {
                        this.x += (dx / distance) * (this.speedY * 1.5);
                        this.y += (dy / distance) * (this.speedY * 0.5);
                    }
                };
                break;
            case "strong":
                bossProps.name = "Stone Colossus";
                bossProps.baseHealth = 25 * baseHealthFactor;
                bossProps.width = 90;
                bossProps.height = 90;
                bossProps.speedY = 0.2 * baseSpeedFactor;
                bossProps.color = 'darkgreen';
                bossProps.shotInterval = 180 / baseShotIntervalFactor;
                bossProps.asciiFace = 'O_O';
                break;
            case "mini-paka":
                bossProps.name = "Pika Minion";
                bossProps.baseHealth = 8 * baseHealthFactor;
                bossProps.width = 20;
                bossProps.height = 20;
                bossProps.speedY = 1.0 * baseSpeedFactor;
                bossProps.speedX = 2.0 * baseSpeedFactor;
                bossProps.color = 'pink';
                bossProps.shotInterval = 45 / baseShotIntervalFactor;
                bossProps.asciiFace = '^_^';
                bossProps.specialBehavior = function() {
                    this.x += this.speedX;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > DOMElements.gameCanvas.width) {
                        this.speedX *= -1;
                    }
                };
                break;
            case "zap-chain":
                bossProps.name = "Static Overload";
                bossProps.baseHealth = 15 * baseHealthFactor;
                bossProps.speedY = 0.6 * baseSpeedFactor;
                bossProps.color = 'lightblue';
                bossProps.shotInterval = 80 / baseShotIntervalFactor;
                bossProps.asciiFace = '*_*';
                bossProps.specialBehavior = function() {
                    if (this.spawnMinions && Math.random() < Constants.alienMinionSpawnChance * 1.5 && Constants.aliens.length < 5) {
                        Constants.aliens.push(createAlienAt(this.x + Math.random() * 60 - 30, this.y + this.height / 2, 10, 'cyan', '*'));
                    }
                };
                break;
            case "invisible":
                bossProps.name = "Whisper Shade";
                bossProps.baseHealth = 10 * baseHealthFactor;
                bossProps.speedY = 0.4 * baseSpeedFactor;
                bossProps.color = 'darkgray';
                bossProps.invisibleTimer = 0;
                bossProps.invisibleDuration = 120 / baseSpeedFactor;
                bossProps.visibleDuration = 120 / baseSpeedFactor;
                bossProps.isBossInvisible = false;
                bossProps.shotInterval = 100 / baseShotIntervalFactor;
                bossProps.asciiFace = '-.-';
                bossProps.specialBehavior = function() {
                    this.invisibleTimer++;
                    if (this.isBossInvisible) {
                        if (this.invisibleTimer >= this.invisibleDuration) {
                            this.isBossInvisible = false;
                            this.invisibleTimer = 0;
                            this.visibleDuration = Math.max(60, (120 - (this.currentPhase - 1) * 10) / baseSpeedFactor);
                        }
                    } else {
                        if (this.invisibleTimer >= this.visibleDuration) {
                            this.isBossInvisible = true;
                            this.invisibleTimer = 0;
                            this.invisibleDuration = Math.max(60, (120 - (this.currentPhase - 1) * 10) / baseSpeedFactor);
                        }
                    }
                };
                break;
        }
    } else if (bossNumber === 2) { // MINI-BOSS 2 CONFIGURATIONS (Harder)
        switch (potionEffect) {
            case "speed":
                bossProps.name = "Chrono Blight";
                bossProps.baseHealth = 25 * baseHealthFactor;
                bossProps.speedY = 2.5 * baseSpeedFactor;
                bossProps.speedX = 1.0 * baseSpeedFactor;
                bossProps.color = 'darkred';
                bossProps.shotInterval = 40 / baseShotIntervalFactor;
                bossProps.asciiFace = 'X_X';
                break;
            case "levitate":
                bossProps.name = "Astral Anomaly";
                bossProps.baseHealth = 20 * baseHealthFactor;
                bossProps.speedY = 0;
                bossProps.color = 'darkviolet';
                bossProps.shotInterval = 70 / baseShotIntervalFactor;
                bossProps.asciiFace = 'o.O';
                bossProps.specialBehavior = function() {
                    if (this.spawnMinions && Math.random() < Constants.alienMinionSpawnChance * 2 && Constants.aliens.length < 8) {
                        Constants.aliens.push(createAlienAt(this.x + Math.random() * 60 - 30, this.y + this.height / 2, 20, 'purple', 'O'));
                    }
                };
                break;
            case "slow-aliens":
                bossProps.name = "Temporal Quake";
                bossProps.baseHealth = 35 * baseHealthFactor;
                bossProps.speedY = 0.2 * baseSpeedFactor;
                bossProps.color = 'darkbrown';
                bossProps.shotInterval = 100 / baseShotIntervalFactor;
                bossProps.asciiFace = '(o_o)';
                break;
            case "lava-shot":
                bossProps.name = "Infernal Core";
                bossProps.baseHealth = 28 * baseHealthFactor;
                bossProps.speedY = 0.6 * baseSpeedFactor;
                bossProps.color = 'darkorange';
                bossProps.shotInterval = 70 / baseShotIntervalFactor;
                bossProps.asciiFace = '🔥';
                break;
            case "auto-aim":
                bossProps.name = "Omniscient Eye";
                bossProps.baseHealth = 18 * baseHealthFactor;
                bossProps.speedY = 0.5 * baseSpeedFactor;
                bossProps.color = 'darkblue';
                bossProps.teleportTimer = 0;
                bossProps.teleportInterval = 60 / baseSpeedFactor;
                bossProps.shotInterval = 90 / baseShotIntervalFactor;
                bossProps.asciiFace = '👁️';
                bossProps.specialBehavior = function() {
                    this.teleportTimer++;
                    if (this.teleportTimer >= this.teleportInterval) {
                        playSound(DOMElements.teleportSound, false, 0.7);
                        this.x = Math.random() * (DOMElements.gameCanvas.width - this.width) + this.width / 2;
                        this.y = Math.random() * (DOMElements.gameCanvas.height / 2 - this.height) + this.height / 2;
                        this.teleportTimer = 0;
                        this.teleportInterval = Math.max(30, (60 - (this.currentPhase - 1) * 5) / baseSpeedFactor);
                    }
                };
                break;
            case "lion-power":
                bossProps.name = "Apex Predator";
                bossProps.baseHealth = 30 * baseHealthFactor;
                bossProps.speedY = 1.2 * baseSpeedFactor;
                bossProps.color = 'darkgoldenrod';
                bossProps.width = 90;
                bossProps.height = 90;
                bossProps.shotInterval = 50 / baseShotIntervalFactor;
                bossProps.asciiFace = '🦁';
                bossProps.specialBehavior = function() {
                    const dx = Constants.player.x - this.x;
                    const dy = Constants.player.y - this.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    if (distance > 1) {
                        this.x += (dx / distance) * (this.speedY * 2);
                        this.y += (dy / distance) * (this.speedY * 0.7);
                    }
                };
                break;
            case "strong":
                bossProps.name = "Iron Behemoth";
                bossProps.baseHealth = 40 * baseHealthFactor;
                bossProps.width = 110;
                bossProps.height = 110;
                bossProps.speedY = 0.3 * baseSpeedFactor;
                bossProps.color = 'darkslategray';
                bossProps.shotInterval = 150 / baseShotIntervalFactor;
                bossProps.asciiFace = '[o_o]';
                break;
            case "mini-paka":
                bossProps.name = "Grand Pika";
                bossProps.baseHealth = 15 * baseHealthFactor;
                bossProps.width = 30;
                bossProps.height = 30;
                bossProps.speedY = 1.5 * baseSpeedFactor;
                bossProps.speedX = 3.0 * baseSpeedFactor;
                bossProps.color = 'fuchsia';
                bossProps.shotInterval = 25 / baseShotIntervalFactor;
                bossProps.asciiFace = '(*o*)';
                bossProps.specialBehavior = function() {
                    this.x += this.speedX;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > DOMElements.gameCanvas.width) {
                        this.speedX *= -1;
                    }
                };
                break;
            case "zap-chain":
                bossProps.name = "Arcane Overlord";
                bossProps.baseHealth = 22 * baseHealthFactor;
                bossProps.speedY = 0.8 * baseSpeedFactor;
                bossProps.color = 'darkturquoise';
                bossProps.shotInterval = 60 / baseShotIntervalFactor;
                bossProps.asciiFace = '⚡_⚡';
                bossProps.specialBehavior = function() {
                    if (this.spawnMinions && Math.random() < Constants.alienMinionSpawnChance * 2 && Constants.aliens.length < 12) {
                        Constants.aliens.push(createAlienAt(this.x + Math.random() * 80 - 40, this.y + this.height / 2, 12, 'lime', 'Z'));
                    }
                };
                break;
            case "invisible":
                bossProps.name = "Phantom King";
                bossProps.baseHealth = 16 * baseHealthFactor;
                bossProps.speedY = 0.6 * baseSpeedFactor;
                bossProps.color = 'black';
                bossProps.invisibleTimer = 0;
                bossProps.invisibleDuration = 90 / baseSpeedFactor;
                bossProps.visibleDuration = 90 / baseSpeedFactor;
                bossProps.isBossInvisible = false;
                bossProps.shotInterval = 80 / baseShotIntervalFactor;
                bossProps.asciiFace = '👻';
                bossProps.specialBehavior = function() {
                    this.invisibleTimer++;
                    if (this.isBossInvisible) {
                        if (this.invisibleTimer >= this.invisibleDuration) {
                            this.isBossInvisible = false;
                            this.invisibleTimer = 0;
                            this.visibleDuration = Math.max(30, (90 - (this.currentPhase - 1) * 5) / baseSpeedFactor);
                        }
                    } else {
                        if (this.invisibleTimer >= this.visibleDuration) {
                            this.isBossInvisible = true;
                            this.invisibleTimer = 0;
                            this.invisibleDuration = Math.max(30, (90 - (this.currentPhase - 1) * 5) / baseSpeedFactor);
                        }
                    }
                };
                break;
        }
    }
    bossProps.health = Math.ceil(bossProps.baseHealth);
    bossProps.maxHealth = Math.ceil(bossProps.baseHealth);
    bossProps.shotInterval = Math.max(10, Math.round(bossProps.shotInterval));
    return bossProps;
}