// potionEffects.js
import * as Constants from './constants.js';

export function resetPotionEffects() {
    Constants.setProjectileSpeedMultiplier(1);
    Constants.setProjectileSizeMultiplier(1);
    Constants.setAutoAimEnabled(false);
    Constants.setLevitateHitActive(false);
    Constants.setLavaShotEnabled(false);
    Constants.setZapChainEnabled(false);
    Constants.setInvisiblePlayerEnabled(false);
    Constants.setInvisibleDuration(0);

    Constants.setPlayer({
        width: Constants.player.originalWidth,
        height: Constants.player.originalHeight,
        speed: Constants.player.originalSpeed,
        asciiFace: 'P'
    });
    Constants.setIsLionPotionActive(false);

    Constants.setAlienSpeedMultiplier(1);
    Constants.setAlienChasePlayer(false);
    Constants.setInitialAlienCount(5); // Base value, will be set by difficulty
    Constants.setCurrentAlienCount(Constants.initialAlienCount);
    Constants.setAlienSpawnYOffset(0);
    Constants.setAlienHorizontalSpeedMultiplier(1);
    Constants.setAlienSizeMultiplier(1);
    Constants.setLavaPotionSpawnInterval(120);
    Constants.setAlienSpawnTimer(0);

    Constants.setBoss(null);
    Constants.setDefeatedAliensCount(0);
    Constants.setDefeatedBossesCount(0);
    Constants.setCurrentBossType(0);
    Constants.bossHealthBarContainer.style.display = 'none'; // Access DOM directly if in separate file
    Constants.bossNameAndPhaseDisplay.style.display = 'none';

    Constants.setExplosions([]);
    Constants.setProjectiles([]);
}

export function applyPotionEffect(effect) {
    switch (effect) {
        case "speed":
            Constants.setProjectileSpeedMultiplier(2);
            break;
        case "levitate":
            Constants.setLevitateHitActive(true);
            Constants.setCurrentAlienCount(3);
            break;
        case "slow-aliens":
            Constants.setAlienSpeedMultiplier(0.5);
            break;
        case "lava-shot":
            Constants.setLavaShotEnabled(true);
            Constants.setLavaPotionSpawnInterval(60);
            break;
        case "auto-aim":
            Constants.setAutoAimEnabled(true);
            Constants.setAlienSpawnYOffset(Constants.gameCanvas.height * 0.2); // Access DOM directly
            break;
        case "lion-power":
            Constants.setProjectileSpeedMultiplier(1.5);
            Constants.setProjectileSizeMultiplier(1.5);
            Constants.setAlienChasePlayer(true);
            Constants.setIsLionPotionActive(true);
            Constants.setPlayer({ asciiFace: '🦁' });
            break;
        case "strong":
            Constants.setProjectileSizeMultiplier(2);
            Constants.setAlienSizeMultiplier(1.5);
            Constants.setAlienSpeedMultiplier(0.7);
            break;
        case "mini-paka":
            Constants.setPlayer({
                width: Constants.player.originalWidth / 2,
                height: Constants.player.originalHeight / 2,
                speed: Constants.player.originalSpeed * 1.5,
                asciiFace: '◕‿◕'
            });
            Constants.setAlienHorizontalSpeedMultiplier(1.5);
            break;
        case "zap-chain":
            Constants.setZapChainEnabled(true);
            Constants.setCurrentAlienCount(8);
            break;
        case "invisible":
            Constants.setInvisiblePlayerEnabled(true);
            Constants.setInvisibleDuration(Constants.INVISIBLE_MAX_DURATION);
            break;
        case "none":
        default:
            break;
    }
}