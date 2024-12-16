// Constants
const BOID_COUNT = 1000;
const DEFAULT_SPEED = 50;
const DEFAULT_SIZE = 10;

class Boid {
    constructor(canvas) {
        this.position = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
        this.direction = Math.random() * Math.PI * 2;
        this.speed = DEFAULT_SPEED;
        this.size = DEFAULT_SIZE;
        this.color = this.generateRandomColor();
    }

    generateRandomColor() {
        const rgb = Array.from({ length: 3 }, () => 
            Math.floor(Math.random() * 155 + 100).toString(16).padStart(2, '0')
        );
        return `#${rgb.join('')}`;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size
        );
    }

    updatePosition(canvas, deltaTime) {
        this.position.x += this.speed * Math.cos(this.direction) * deltaTime;
        this.position.y += this.speed * Math.sin(this.direction) * deltaTime;
        this.wrapAroundCanvas(canvas);
    }

    wrapAroundCanvas(canvas) {
        const halfSize = this.size / 2;
        if (this.position.x + halfSize < 0) this.position.x += canvas.width + this.size;
        if (this.position.x - halfSize > canvas.width) this.position.x -= canvas.width + this.size;
        if (this.position.y + halfSize < 0) this.position.y += canvas.height + this.size;
        if (this.position.y - halfSize > canvas.height) this.position.y -= canvas.height + this.size;
    }

    handleCanvasResize(scaleX, scaleY) {
        this.position.x *= scaleX;
        this.position.y *= scaleY;
    }
}

class BoidsSimulation {
    constructor() {
        this.canvasWrapper = document.querySelector('.canvas-wrapper');
        this.canvas = document.getElementById('boids-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dimensions = { width: this.canvas.width, height: this.canvas.height };
        this.lastTime = performance.now();
        this.boids = Array.from({ length: BOID_COUNT }, () => new Boid(this.canvas));

        this.bindEvents();
        this.resizeCanvas();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const newWidth = this.canvasWrapper.clientWidth;
        const newHeight = this.canvasWrapper.clientHeight;
        const scaleX = newWidth / this.dimensions.width;
        const scaleY = newHeight / this.dimensions.height;

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.dimensions = { width: newWidth, height: newHeight };

        this.boids.forEach(boid => boid.handleCanvasResize(scaleX, scaleY));
        this.draw();
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.boids.forEach(boid => boid.updatePosition(this.canvas, deltaTime));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.boids.forEach(boid => boid.draw(this.ctx));
    }

    animate = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

// Initialize simulation
new BoidsSimulation();