// constants.js
export const potions = [
    { name: "Speed Potion", effect: "speed" },
    { name: "Levitate Potion", effect: "levitate" },
    { name: "Sleep Throw Potion", effect: "slow-aliens" },
    { name: "Lava Potion", effect: "lava-shot" },
    { name: "Smart Potion", effect: "auto-aim" },
    { name: "Lion Potion", effect: "lion-power" },
    { name: "Strong Potion", effect: "strong" },
    { name: "Mini Paka Potion", effect: "mini-paka" },
    { name: "Zap Evolution Potion", effect: "zap-chain" },
    { name: "Mega Night Potion", effect: "invisible" }
];

export const difficulties = [
    { name: "Beginner", modifier: "easy" },
    { name: "Regular", modifier: "normal" },
    { name: "Hard", modifier: "hard" }
];

// Initial game state variables (some will be mutable)
export let counter = 500;
export let selectedPotion = null;
export let selectedDifficulty = null; // Stores the selected difficulty object

export let gameRunning = false;
export let gameFrameId = null;

export let player = {
    x: 0, // Will be set based on canvas width
    y: 0, // Will be set based on canvas height
    width: 30,
    height: 30,
    speed: 5,
    originalWidth: 30,
    originalHeight: 30,
    originalSpeed: 5,
    asciiFace: 'P'
};
export let projectiles = [];
export let aliens = [];
export let keys = {};
export let explosions = [];

// Potion effect variables
export let projectileSpeedMultiplier = 1;
export let projectileSizeMultiplier = 1;
export let autoAimEnabled = false;
export let levitateHitActive = false;
export let lavaShotEnabled = false;
export let zapChainEnabled = false;
export let invisiblePlayerEnabled = false;
export let invisibleDuration = 0;
export const INVISIBLE_MAX_DURATION = 180;

export let alienSpeedMultiplier = 1;
export let alienChasePlayer = false;
export let initialAlienCount = 5; // Base, will be adjusted by difficulty
export let currentAlienCount = initialAlienCount;
export let alienSpawnYOffset = 0;
export let alienHorizontalSpeedMultiplier = 1;
export let alienSizeMultiplier = 1;

export let lavaPotionSpawnInterval = 120;
export let alienSpawnTimer = 0;

export let isLionPotionActive = false;

// BOSS Variables
export let boss = null;
export let defeatedAliensCount = 0;
export let defeatedBossesCount = 0;
export let currentBossType = 0; // 0: No boss, 1: Mini-Boss 1, 2: Mini-Boss 2

export const ALIENS_BEFORE_MINI_BOSS_1_BASE = 5;
export const ALIENS_BEFORE_MINI_BOSS_2_BASE = 10;
export let ALIENS_BEFORE_MINI_BOSS_1 = ALIENS_BEFORE_MINI_BOSS_1_BASE; // Will be adjusted by difficulty
export let ALIENS_BEFORE_MINI_BOSS_2 = ALIENS_BEFORE_MINI_BOSS_2_BASE; // Will be adjusted by difficulty

// Difficulty Variables
export let alienProjectileChance = 0; // % chance for alien to shoot per frame (Hard difficulty)
export let alienMinionSpawnChance = 0; // % chance for boss to spawn mini-aliens (Hard difficulty)


// Functions to update mutable constants (if needed outside this file)
export function setCounter(val) { counter = val; }
export function setSelectedPotion(val) { selectedPotion = val; }
export function setSelectedDifficulty(val) { selectedDifficulty = val; }
export function setGameRunning(val) { gameRunning = val; }
export function setGameFrameId(val) { gameFrameId = val; }
export function setPlayer(val) { player = { ...player, ...val }; } // Merge updates
export function setProjectiles(val) { projectiles = val; }
export function setAliens(val) { aliens = val; }
export function setKeys(val) { keys = val; }
export function setExplosions(val) { explosions = val; }

export function setProjectileSpeedMultiplier(val) { projectileSpeedMultiplier = val; }
export function setProjectileSizeMultiplier(val) { projectileSizeMultiplier = val; }
export function setAutoAimEnabled(val) { autoAimEnabled = val; }
export function setLevitateHitActive(val) { levitateHitActive = val; }
export function setLavaShotEnabled(val) { lavaShotEnabled = val; }
export function setZapChainEnabled(val) { zapChainEnabled = val; }
export function setInvisiblePlayerEnabled(val) { invisiblePlayerEnabled = val; }
export function setInvisibleDuration(val) { invisibleDuration = val; }

export function setAlienSpeedMultiplier(val) { alienSpeedMultiplier = val; }
export function setAlienChasePlayer(val) { alienChasePlayer = val; }
export function setInitialAlienCount(val) { initialAlienCount = val; }
export function setCurrentAlienCount(val) { currentAlienCount = val; }
export function setAlienSpawnYOffset(val) { alienSpawnYOffset = val; }
export function setAlienHorizontalSpeedMultiplier(val) { alienHorizontalSpeedMultiplier = val; }
export function setAlienSizeMultiplier(val) { alienSizeMultiplier = val; }

export function setLavaPotionSpawnInterval(val) { lavaPotionSpawnInterval = val; }
export function setAlienSpawnTimer(val) { alienSpawnTimer = val; }

export function setIsLionPotionActive(val) { isLionPotionActive = val; }

export function setBoss(val) { boss = val; }
export function setDefeatedAliensCount(val) { defeatedAliensCount = val; }
export function setDefeatedBossesCount(val) { defeatedBossesCount = val; }
export function setCurrentBossType(val) { currentBossType = val; }
export function setAliensBeforeMiniBoss1(val) { ALIENS_BEFORE_MINI_BOSS_1 = val; }
export function setAliensBeforeMiniBoss2(val) { ALIENS_BEFORE_MINI_BOSS_2 = val; }

export function setAlienProjectileChance(val) { alienProjectileChance = val; }
export function setAlienMinionSpawnChance(val) { alienMinionSpawnChance = val; }