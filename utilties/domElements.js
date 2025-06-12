// domElements.js
export const door = document.getElementById('door');
export const doorContainer = document.getElementById('door-container');
export const shopContainer = document.getElementById('shop-container');
export const elfDialogue = document.getElementById('elf-dialogue');
export const usernameInput = document.getElementById('username-input');
export const enterShopBtn = document.getElementById('enter-shop-btn');
export const difficultySelection = document.getElementById('difficulty-selection');
export const difficultyShelf = document.querySelector('.difficulty-shelf');
export const selectedDifficultyMessage = document.getElementById('selected-difficulty-message');
export const chooseDifficultyBtn = document.getElementById('choose-difficulty-btn');
export const potionSelection = document.getElementById('potion-selection');
export const elfWelcomeMessage = document.getElementById('elf-welcome-message');
export const potionShelf = document.querySelector('.potion-shelf');
export const selectedPotionMessage = document.getElementById('selected-potion-message');
export const choosePotionBtn = document.getElementById('choose-potion-btn');
export const inventoryNote = document.getElementById('inventory-note');
export const farewellMessage = document.getElementById('farewell-message');

export const gameArea = document.getElementById('game-area');
export const gameCanvas = document.getElementById('game-canvas');
export const ctx = gameCanvas.getContext('2d');
export const gameMessages = document.getElementById('game-messages');
export const bossHealthBarContainer = document.getElementById('boss-health-bar-container');
export const bossHealthBar = document.getElementById('boss-health-bar');
export const bossNameAndPhaseDisplay = document.getElementById('boss-name-and-phase');

// Audio Elements
export const knockSound = document.getElementById('knock-sound');
export const screamSound = document.getElementById('scream-sound');
export const playerShootSound = document.getElementById('player-shoot-sound');
export const alienHitSound = document.getElementById('alien-hit-sound');
export const bossHitSound = document.getElementById('boss-hit-sound');
export const playerHitSound = document.getElementById('player-hit-sound');
export const potionSelectSound = document.getElementById('potion-select-sound');
export const buttonClickSound = document.getElementById('button-click-sound');
export const bossSpawnSound = document.getElementById('boss-spawn-sound');
export const phaseChangeSound = document.getElementById('phase-change-sound');
export const teleportSound = document.getElementById('teleport-sound');
export const alienShootSound = document.getElementById('alien-shoot-sound');