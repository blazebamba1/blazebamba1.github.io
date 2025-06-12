// gameDrawing.js
import * as Constants from './constants.js';
import * as DOMElements from './domElements.js';

export function drawGame() {
    DOMElements.ctx.clearRect(0, 0, DOMElements.gameCanvas.width, DOMElements.gameCanvas.height);

    // Draw player
    DOMElements.ctx.fillStyle = Constants.invisiblePlayerEnabled ? `rgba(0, 255, 0, ${Math.abs(Math.sin(Constants.invisibleDuration * 0.1))})` : 'lime';
    DOMElements.ctx.font = `${Constants.player.width}px 'Courier New', monospace`;
    DOMElements.ctx.textAlign = 'center';
    DOMElements.ctx.textBaseline = 'middle';
    DOMElements.ctx.fillText(Constants.player.asciiFace, Constants.player.x, Constants.player.y);

    // Draw projectiles
    Constants.projectiles.forEach(p => {
        if (p.alive) {
            DOMElements.ctx.fillStyle = p.color || 'white';
            if (p.alpha !== undefined) {
                DOMElements.ctx.fillStyle = `rgba(${parseInt(p.color.slice(1,3), 16)}, ${parseInt(p.color.slice(3,5), 16)}, ${parseInt(p.color.slice(5,7), 16)}, ${p.alpha})`;
            }
            DOMElements.ctx.font = `${p.width}px 'Courier New', monospace`;
            DOMElements.ctx.fillText(p.asciiFace, p.x, p.y);
        }
    });

    // Draw aliens
    Constants.aliens.forEach(alien => {
        if (alien.alive) {
            DOMElements.ctx.fillStyle = alien.color || 'white';
            DOMElements.ctx.font = `${alien.width}px 'Courier New', monospace`;
            DOMElements.ctx.textAlign = 'center';
            DOMElements.ctx.textBaseline = 'middle';
            DOMElements.ctx.fillText(alien.asciiFace, alien.x, alien.y);
        }
    });

    // Draw boss
    if (Constants.boss && Constants.boss.alive) {
        if (Constants.boss.isBossInvisible) {
            DOMElements.ctx.fillStyle = `rgba(${parseInt(Constants.boss.color.slice(1,3), 16)}, ${parseInt(Constants.boss.color.slice(3,5), 16)}, ${parseInt(Constants.boss.color.slice(5,7), 16)}, ${Math.abs(Math.sin(Constants.boss.invisibleTimer * 0.05))})`;
        } else {
            DOMElements.ctx.fillStyle = Constants.boss.color;
        }
        DOMElements.ctx.font = `${Constants.boss.width}px 'Courier New', monospace`;
        DOMElements.ctx.textAlign = 'center';
        DOMElements.ctx.textBaseline = 'middle';
        DOMElements.ctx.fillText(Constants.boss.asciiFace, Constants.boss.x, Constants.boss.y);
    }

    // Draw explosions
    Constants.explosions.forEach(e => {
        DOMElements.ctx.beginPath();
        DOMElements.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        DOMElements.ctx.fillStyle = `rgba(255, 165, 0, ${e.opacity})`;
        DOMElements.ctx.fill();
    });
}