// gameSettings.js
import * as Constants from './constants.js';

export function applyDifficultySettings(modifier) {
    switch (modifier) {
        case "easy":
            Constants.setInitialAlienCount(3);
            Constants.setAliensBeforeMiniBoss1(3);
            Constants.setAliensBeforeMiniBoss2(5);
            Constants.setAlienSpeedMultiplier(0.8);
            Constants.setAlienProjectileChance(0);
            Constants.setAlienMinionSpawnChance(0);
            break;
        case "normal":
            Constants.setInitialAlienCount(5);
            Constants.setAliensBeforeMiniBoss1(Constants.ALIENS_BEFORE_MINI_BOSS_1_BASE);
            Constants.setAliensBeforeMiniBoss2(Constants.ALIENS_BEFORE_MINI_BOSS_2_BASE);
            Constants.setAlienSpeedMultiplier(1);
            Constants.setAlienProjectileChance(0);
            Constants.setAlienMinionSpawnChance(0);
            break;
        case "hard":
            Constants.setInitialAlienCount(7);
            Constants.setAliensBeforeMiniBoss1(7);
            Constants.setAliensBeforeMiniBoss2(12);
            Constants.setAlienSpeedMultiplier(1.2);
            Constants.setAlienProjectileChance(0.005);
            Constants.setAlienMinionSpawnChance(0.01);
            break;
    }
    Constants.setCurrentAlienCount(Constants.initialAlienCount);
}