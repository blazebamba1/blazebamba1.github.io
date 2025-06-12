// audioManager.js
export function playSound(audioElement, loop = false, volume = 0.5) {
    if (!audioElement || !audioElement.src || audioElement.src.includes('path/to/your/')) {
        console.warn("Audio file path not set for:", audioElement.id, ". Skipping sound playback.");
        return;
    }
    audioElement.currentTime = 0;
    audioElement.loop = loop;
    audioElement.volume = volume;
    audioElement.play().catch(e => console.error("Error playing sound:", e));
}

export function stopSound(audioElement) {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
}