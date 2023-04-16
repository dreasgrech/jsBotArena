const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
export class Game {
    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
    }

    start() {

    }

    update() {

        // Call update function again using requestAnimationFrame
        requestAnimationFrame(update);
    }
}
