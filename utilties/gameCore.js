// gameCore.js
import * as Constants from './constants.js';
import * as DOMElements from './domElements.js';
import { playSound } from './audioManager.js';
import { createAlien, createBoss } from './entities.js';
import { updateGame, updateBossHealthBar } from './gameUpdate.js';
import { drawGame } from './gameDrawing.js';

export function startGame() {
    DOMElements.gameArea.style.display = 'flex';
    DOMElements.gameArea.classList.add('visible');
    Constants.setGameRunning(true);
    Constants.setPlayer({
        x: DOMElements.gameCanvas.width / 2,
        y: DOMElements.gameCanvas.height - 40
    });
    Constants.setAliens([]);
    Constants.setProjectiles([]);
    Constants.setExplosions([]);
    Constants.setDefeatedAliensCount(0);
    Constants.setDefeatedBossesCount(0);
    Constants.setBoss(null);

    for (let i = 0; i < Constants.initialAlienCount; i++) {
        Constants.aliens.push(createAlien());
    }

    DOMElements.gameMessages.textContent = "Prepare to fight!";
    gameLoop();
}

export function stopGame(message) {
    Constants.setGameRunning(false);
    cancelAnimationFrame(Constants.gameFrameId);
    DOMElements.gameMessages.textContent = message;
    if (Constants.boss) {
        DOMElements.bossHealthBarContainer.style.display = 'none';
        DOMElements.bossNameAndPhaseDisplay.style.display = 'none';
    }

    setTimeout(() => {
        const restart = confirm("Game Over! " + message + "\nDo you want to play again?");
        if (restart) {
            DOMElements.shopContainer.style.display = 'block';
            DOMElements.shopContainer.classList.add('visible');
            DOMElements.doorContainer.style.opacity = 1;
            DOMElements.doorContainer.style.display = 'block';

            DOMElements.usernameInput.value = '';
            DOMElements.usernameInput.style.display = 'block';
            DOMElements.enterShopBtn.style.display = 'block';
            DOMElements.elfDialogue.textContent = `Hello adventurer, what is your name?`;

            DOMElements.difficultySelection.style.display = 'none';
            DOMElements.selectedDifficultyMessage.textContent = '';
            DOMElements.chooseDifficultyBtn.disabled = true;
            document.querySelectorAll('.difficulty-item').forEach(item => {
                item.classList.remove('selected');
                item.style.pointerEvents = 'auto';
            });

            DOMElements.potionSelection.style.display = 'none';
            DOMElements.selectedPotionMessage.textContent = '';
            DOMElements.choosePotionBtn.disabled = true;
            
            document.querySelectorAll('.potion-item').forEach(item => {
                item.classList.remove('selected');
                item.style.pointerEvents = 'auto';
            });
            Constants.setSelectedPotion(null);
            Constants.setCounter(500);
            DOMElements.inventoryNote.textContent = '';
            DOMElements.farewellMessage.textContent = '';
            
        } else {
            DOMElements.gameMessages.textContent += "\nThanks for playing!";
        }
    }, 1500);
}

export function gameLoop() {
    if (Constants.gameRunning) {
        updateGame();
        drawGame();
        Constants.setGameFrameId(requestAnimationFrame(gameLoop));
    }
}