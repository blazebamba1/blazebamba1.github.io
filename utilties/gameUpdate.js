// gameUpdate.js
import * as Constants from './constants.js';
import * as DOMElements from './domElements.js';
import { playSound } from './audioManager.js';
import { createAlien, createBoss } from './entities.js';
import { checkCollision } from './collisionDetection.js';
import { stopGame } from './gameCore.js';

export function updateGame() {
    // Player movement
    if (Constants.keys['ArrowLeft'] && Constants.player.x > Constants.player.width / 2) {
        Constants.setPlayer({ x: Constants.player.x - Constants.player.speed });
    }
    if (Constants.keys['ArrowRight'] && Constants.player.x < DOMElements.gameCanvas.width - Constants.player.width / 2) {
        Constants.setPlayer({ x: Constants.player.x + Constants.player.speed });
    }

    // Invisible Potion countdown
    if (Constants.invisiblePlayerEnabled && Constants.invisibleDuration > 0) {
        Constants.setInvisibleDuration(Constants.invisibleDuration - 1);
        if (Constants.invisibleDuration <= 0) {
            Constants.setInvisiblePlayerEnabled(false);
            DOMElements.gameMessages.textContent = "Invisibility wore off!";
        } else if (Constants.invisibleDuration < 60 && Constants.invisibleDuration % 20 === 0) {
            DOMElements.gameMessages.textContent = "Invisibility fading...";
        }
    }

    // Update projectiles
    Constants.projectiles.forEach((p, pIndex) => {
        if (!p.alive) return;

        if (p.isHomingProjectile && p.isBossProjectile) {
            const angleToPlayer = Math.atan2(Constants.player.y - p.y, Constants.player.x - p.x);
            p.x += Math.cos(angleToPlayer) * p.speed;
            p.y += Math.sin(angleToPlayer) * p.speed;
        } else {
            p.x += p.speedX;
            p.y += p.speedY;
        }

        if (p.fadeSpeed) {
            p.alpha = Math.max(0, p.alpha - p.fadeSpeed);
            if (p.alpha <= 0) {
                p.alive = false;
            }
        }

        if (p.y < 0 || p.y > DOMElements.gameCanvas.height || p.x < 0 || p.x > DOMElements.gameCanvas.width) {
            p.alive = false;
        }

        if (!p.isBossProjectile) {
            Constants.aliens.forEach(alien => {
                if (alien.alive && checkCollision(p, alien)) {
                    p.alive = false;
                    alien.alive = false;
                    Constants.explosions.push({ x: alien.x, y: alien.y, radius: alien.width / 2, opacity: 1, color: alien.color || 'white' });
                    playSound(DOMElements.alienHitSound, false, 0.4);
                    Constants.setDefeatedAliensCount(Constants.defeatedAliensCount + 1);
                }
            });
            if (Constants.boss && Constants.boss.alive && !Constants.boss.isBossInvisible && checkCollision(p, Constants.boss)) {
                p.alive = false;
                Constants.boss.health--;
                playSound(DOMElements.bossHitSound, false, 0.4);
                updateBossHealthBar();
                if (Constants.boss.health <= 0) {
                    playSound(DOMElements.screamSound, false, 0.8);
                    Constants.explosions.push({ x: Constants.boss.x, y: Constants.boss.y, radius: Constants.boss.width / 2, opacity: 1, color: Constants.boss.color || 'red' });
                    Constants.boss.alive = false;
                    Constants.setDefeatedBossesCount(Constants.defeatedBossesCount + 1);
                    DOMElements.gameMessages.textContent = `${Constants.boss.name} defeated!`;
                    DOMElements.bossHealthBarContainer.style.display = 'none';
                    DOMElements.bossNameAndPhaseDisplay.style.display = 'none';
                }
            }
        }
    });

    if (Constants.zapChainEnabled) {
        Constants.projectiles.filter(p => p.alive && p.isElectricProjectile).forEach(electricP => {
            if (electricP.chainedTo === undefined) electricP.chainedTo = null;

            if (electricP.chainedTo === null) {
                const potentialTargets = Constants.aliens.filter(a => a.alive && !a.isLevitating);
                if (potentialTargets.length > 0) {
                    const closestAlien = potentialTargets.reduce((prev, curr) => {
                        const distPrev = Math.sqrt(Math.pow(electricP.x - prev.x, 2) + Math.pow(electricP.y - prev.y, 2));
                        const distCurr = Math.sqrt(Math.pow(electricP.x - curr.x, 2) + Math.pow(electricP.y - curr.y, 2));
                        return (distPrev < distCurr && distPrev < 100) ? prev : curr;
                    });
                    if (closestAlien && Math.sqrt(Math.pow(electricP.x - closestAlien.x, 2) + Math.pow(electricP.y - closestAlien.y, 2)) < 100) {
                        electricP.chainedTo = closestAlien;
                    }
                }
            }

            if (electricP.chainedTo && !electricP.chainedTo.alive) {
                electricP.chainedTo = null;
            }
        });
    }

    // Update aliens
    Constants.setAlienSpawnTimer(Constants.alienSpawnTimer + 1);
    if (Constants.aliens.length < Constants.currentAlienCount && Constants.alienSpawnTimer >= 120 && !Constants.boss) {
        Constants.aliens.push(createAlien());
        Constants.setAlienSpawnTimer(0);
    }

    Constants.aliens.forEach(alien => {
        if (!alien.alive) return;

        if (alien.isLevitating) {
            alien.levitateDuration--;
            if (alien.levitateDuration <= 0) {
                alien.isLevitating = false;
                alien.speedY = alien.originalSpeedY;
            }
        } else {
            alien.y += alien.speedY;
            alien.x += alien.speedX;
            if (alien.x - alien.width / 2 < 0 || alien.x + alien.width / 2 > DOMElements.gameCanvas.width) {
                alien.speedX *= -1;
            }

            if (Constants.alienChasePlayer) {
                const dx = Constants.player.x - alien.x;
                if (Math.abs(dx) > 5) {
                    alien.x += Math.sign(dx) * (alien.speedX / 2);
                }
            }
        }

        if (Constants.selectedDifficulty && Constants.selectedDifficulty.modifier === "hard" && Constants.alienProjectileChance > 0) {
            alien.shootTimer++;
            if (alien.shootTimer >= alien.shootInterval) {
                if (Math.random() < Constants.alienProjectileChance) {
                    const pSpeed = 2 + (Constants.selectedDifficulty.modifier === "hard" ? 1 : 0);
                    const angleToPlayer = Math.atan2(Constants.player.y - alien.y, Constants.player.x - alien.x);
                    Constants.projectiles.push({
                        x: alien.x,
                        y: alien.y + alien.height / 2,
                        width: 8,
                        height: 8,
                        speedX: Math.cos(angleToPlayer) * pSpeed,
                        speedY: Math.sin(angleToPlayer) * pSpeed,
                        speed: pSpeed,
                        alive: true,
                        isBossProjectile: true,
                        color: 'red',
                        asciiFace: '•'
                    });
                    playSound(DOMElements.alienShootSound, false, 0.3);
                }
                alien.shootTimer = 0;
            }
        }

        if (!Constants.invisiblePlayerEnabled && checkCollision(Constants.player, alien)) {
            stopGame("You were caught by an alien! Game Over.");
            return;
        }

        if (alien.y + alien.height / 2 > DOMElements.gameCanvas.height) {
            stopGame("An alien reached the bottom! Game Over.");
            return;
        }
    });

    Constants.setAliens(Constants.aliens.filter(alien => alien.alive));
    Constants.setProjectiles(Constants.projectiles.filter(p => p.alive));
    Constants.setExplosions(Constants.explosions.filter(e => e.opacity > 0));

    // Boss spawning logic
    if (Constants.defeatedAliensCount >= Constants.ALIENS_BEFORE_MINI_BOSS_1 && Constants.currentBossType === 0) {
        Constants.setCurrentBossType(1);
        Constants.setBoss(createBoss(Constants.selectedPotion.effect, 1));
        DOMElements.gameMessages.textContent = `A Mini-Boss appears: ${Constants.boss.name}!`;
        DOMElements.bossHealthBarContainer.style.display = 'block';
        DOMElements.bossNameAndPhaseDisplay.style.display = 'block';
        playSound(DOMElements.bossSpawnSound, false, 0.7);
    } else if (Constants.defeatedAliensCount >= Constants.ALIENS_BEFORE_MINI_BOSS_2 && Constants.currentBossType === 1 && !Constants.boss.alive) {
        Constants.setCurrentBossType(2);
        Constants.setBoss(createBoss(Constants.selectedPotion.effect, 2));
        DOMElements.gameMessages.textContent = `The Final Boss, ${Constants.boss.name}, has arrived!`;
        DOMElements.bossHealthBarContainer.style.display = 'block';
        DOMElements.bossNameAndPhaseDisplay.style.display = 'block';
        playSound(DOMElements.bossSpawnSound, false, 0.7);
    }

    // Update boss
    if (Constants.boss && Constants.boss.alive) {
        Constants.boss.y += Constants.boss.speedY;
        Constants.boss.x += Constants.boss.speedX;

        if (Constants.boss.x - Constants.boss.width / 2 < 0 || Constants.boss.x + Constants.boss.width / 2 > DOMElements.gameCanvas.width) {
            Constants.boss.speedX *= -1;
        }

        if (Constants.boss.y - Constants.boss.height / 2 < 0 || Constants.boss.y + Constants.boss.height / 2 > DOMElements.gameCanvas.height / 2) {
            Constants.boss.speedY *= -1;
        }

        if (Constants.boss.specialBehavior) {
            Constants.boss.specialBehavior();
        }

        Constants.boss.shotTimer++;
        if (Constants.boss.shotTimer >= Constants.boss.shotInterval) {
            if (!Constants.boss.isBossInvisible) {
                bossShoot(Constants.boss);
            }
            Constants.boss.shotTimer = 0;
        }

        if (!Constants.invisiblePlayerEnabled && !Constants.boss.isBossInvisible && checkCollision(Constants.player, Constants.boss)) {
            stopGame("You were crushed by the boss! Game Over.");
            return;
        }
    } else if (Constants.boss && !Constants.boss.alive && Constants.defeatedBossesCount === 1 && Constants.currentBossType === 1) {
        DOMElements.gameMessages.textContent = "Great job! More aliens are coming...";
        Constants.setBoss(null);
        Constants.setCurrentAlienCount(Constants.initialAlienCount);
        Constants.setDefeatedAliensCount(Constants.ALIENS_BEFORE_MINI_BOSS_1);
    } else if (Constants.boss && !Constants.boss.alive && Constants.defeatedBossesCount === 2 && Constants.currentBossType === 2) {
        stopGame("Congratulations! You defeated the final boss!");
        return;
    }

    // Handle boss phase changes
    if (Constants.boss && Constants.boss.alive && Constants.boss.totalPhases > 1 && Constants.boss.health <= (Constants.boss.maxHealth / Constants.boss.totalPhases) * (Constants.boss.totalPhases - Constants.boss.currentPhase)) {
        if (Constants.boss.currentPhase < Constants.boss.totalPhases) {
            Constants.boss.currentPhase++;
            playSound(DOMElements.phaseChangeSound, false, 0.7);
            DOMElements.gameMessages.textContent = `${Constants.boss.name} entered Phase ${Constants.boss.currentPhase}!`;
            Constants.boss.health = Constants.boss.maxHealth;
            Constants.boss.speedY *= 1.2;
            Constants.boss.speedX *= 1.2;
            Constants.boss.shotInterval = Math.max(20, Constants.boss.shotInterval * 0.8);
            updateBossHealthBar();
        }
    }

    // Update explosions
    Constants.explosions.forEach(e => {
        e.opacity -= 0.05;
        e.radius += 1;
    });

    // Player projectile (lava shot)
    if (Constants.lavaShotEnabled) {
        Constants.setLavaPotionSpawnInterval(Constants.lavaPotionSpawnInterval - 1);
        if (Constants.lavaPotionSpawnInterval <= 0) {
            Constants.projectiles.push({
                x: Constants.player.x,
                y: Constants.player.y,
                width: 15 * Constants.projectileSizeMultiplier,
                height: 15 * Constants.projectileSizeMultiplier,
                speedX: 0,
                speedY: -10 * Constants.projectileSpeedMultiplier,
                speed: 10 * Constants.projectileSpeedMultiplier,
                alive: true,
                isLavaProjectile: true,
                color: 'red',
                asciiFace: '🌋'
            });
            playSound(DOMElements.playerShootSound, false, 0.3);
            Constants.setLavaPotionSpawnInterval(60);
        }
    }
}

// Function to update boss health bar display
export function updateBossHealthBar() {
    if (Constants.boss && Constants.boss.alive) {
        DOMElements.bossHealthBar.style.width = `${(Constants.boss.health / Constants.boss.maxHealth) * 100}%`;
        DOMElements.bossNameAndPhaseDisplay.textContent = `${Constants.boss.name} - Phase ${Constants.boss.currentPhase}/${Constants.boss.totalPhases}`;
    }
}