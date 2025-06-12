// shopLogic.js
import * as DOMElements from './domElements.js';
import * as Constants from './constants.js';
import { playSound } from './audioManager.js';
import { applyDifficultySettings } from './gameSettings.js';
import { applyPotionEffect, resetPotionEffects } from './potionEffects.js';
import { startGame } from './gameCore.js';

export function setupShopListeners() {
    DOMElements.door.addEventListener('click', handleDoorClick);
    DOMElements.enterShopBtn.addEventListener('click', handleEnterShopClick);
    DOMElements.chooseDifficultyBtn.addEventListener('click', handleChooseDifficultyClick);
    DOMElements.choosePotionBtn.addEventListener('click', handleChoosePotionClick);
}

function handleDoorClick() {
    playSound(DOMElements.knockSound);
    setTimeout(() => {
        playSound(DOMElements.screamSound);
        DOMElements.door.textContent = "Come in!";
        setTimeout(() => {
            DOMElements.shopContainer.style.display = 'block';
            DOMElements.shopContainer.classList.add('visible');
            DOMElements.doorContainer.style.opacity = 0;
            setTimeout(() => {
                DOMElements.doorContainer.style.display = 'none';
            }, 1000);
        }, 1000);
    }, 500);
}

function handleEnterShopClick() {
    playSound(DOMElements.buttonClickSound, false, 0.7);
    const username = DOMElements.usernameInput.value.trim();
    if (username) {
        DOMElements.elfDialogue.textContent = `Hello ${username}! Choose your challenge!`;
        DOMElements.elfWelcomeMessage.textContent = `Hello ${username},`;
        DOMElements.usernameInput.style.display = 'none';
        DOMElements.enterShopBtn.style.display = 'none';
        DOMElements.difficultySelection.style.display = 'block';
        renderDifficulties();
    } else {
        alert("Please enter your name, adventurer!");
    }
}

function renderDifficulties() {
    DOMElements.difficultyShelf.innerHTML = '';
    Constants.difficulties.forEach((difficulty, index) => {
        const difficultyItem = document.createElement('div');
        difficultyItem.classList.add('difficulty-item');
        const difficultyNameText = document.createElement('span');
        difficultyNameText.textContent = difficulty.name;
        difficultyItem.appendChild(difficultyNameText);
        difficultyItem.dataset.modifier = difficulty.modifier;
        difficultyItem.addEventListener('click', () => {
            playSound(DOMElements.potionSelectSound, false, 0.7);
            const currentSelected = document.querySelector('.difficulty-item.selected');
            if (currentSelected) {
                currentSelected.classList.remove('selected');
            }
            difficultyItem.classList.add('selected');
            Constants.setSelectedDifficulty(difficulty);
            DOMElements.selectedDifficultyMessage.textContent = `You have chosen ${difficulty.name} difficulty.`;
            DOMElements.chooseDifficultyBtn.disabled = false;
        });
        DOMElements.difficultyShelf.appendChild(difficultyItem);
    });
}

function handleChooseDifficultyClick() {
    playSound(DOMElements.buttonClickSound, false, 0.7);
    if (Constants.selectedDifficulty) {
        applyDifficultySettings(Constants.selectedDifficulty.modifier);
        DOMElements.difficultySelection.style.display = 'none';
        DOMElements.potionSelection.style.display = 'block';
        DOMElements.elfWelcomeMessage.textContent = `Excellent! Now, choose your potion wisely.`;
        renderPotions();
    } else {
        alert("Please select a difficulty first!");
    }
}

function renderPotions() {
    DOMElements.potionShelf.innerHTML = '';
    Constants.potions.forEach((potion, index) => {
        const potionItem = document.createElement('div');
        potionItem.classList.add('potion-item');
        const potionNameText = document.createElement('span');
        potionNameText.textContent = `${index + 1}: ${potion.name}`;
        potionItem.appendChild(potionNameText);
        potionItem.dataset.index = index;
        potionItem.addEventListener('click', () => {
            playSound(DOMElements.potionSelectSound, false, 0.7);
            const currentSelected = document.querySelector('.potion-item.selected');
            if (currentSelected) {
                currentSelected.classList.remove('selected');
            }
            potionItem.classList.add('selected');
            Constants.setSelectedPotion(potion);
            DOMElements.selectedPotionMessage.textContent = `You have chosen potion number ${index + 1}: ${potion.name}`;
            DOMElements.choosePotionBtn.disabled = false;
        });
        DOMElements.potionShelf.appendChild(potionItem);
    });
}

function handleChoosePotionClick() {
    playSound(DOMElements.buttonClickSound, false, 0.7);
    if (Constants.selectedPotion) {
        Constants.setCounter(Constants.counter - 1);
        DOMElements.inventoryNote.textContent = `Self note: ${Constants.counter} left!`;
        DOMElements.farewellMessage.textContent = `Adventurer, I only have ${Constants.counter} left. Thank you, have a nice day! (Pulls wand)`;

        resetPotionEffects();
        applyPotionEffect(Constants.selectedPotion.effect);

        DOMElements.choosePotionBtn.disabled = true;
        document.querySelectorAll('.potion-item').forEach(item => item.style.pointerEvents = 'none');
        
        setTimeout(() => {
            DOMElements.shopContainer.style.opacity = 0;
            setTimeout(() => {
                DOMElements.shopContainer.style.display = 'none';
                startGame(); // Start the game after potion selection
            }, 1000);
        }, 2000);
    } else {
        alert("Please select a potion first!");
    }
}