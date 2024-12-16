// DOM Element selection
const canvasWrapper = document.querySelector('.canvas-wrapper');
const canvas = document.getElementById('boids-canvas');
const ctx = canvas.getContext('2d');

// Track canvas dimensions for resize calculations
let oldCanvasDimensions = {x: canvas.width, y: canvas.height};

// Boid class represents individual particles in the simulation
class Boid {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 10;
        this.color = '#FFFFFF';
        this.init();
    }

    // Initialize boid at random position
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    // Render individual boid
    drawBoid(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    // Update boid position when canvas is resized
    canvasChanged() {
        this.x = this.x * (canvas.width / oldCanvasDimensions.x);
        this.y = this.y * (canvas.height / oldCanvasDimensions.y);
    }
}

// Handle canvas resize
function resizeCanvas() {
    canvas.width = canvasWrapper.clientWidth;
    canvas.height = canvasWrapper.clientHeight;
    
    boids.forEach(boid => boid.canvasChanged());
    
    oldCanvasDimensions = {x: canvas.width, y: canvas.height};
    drawCanvas();
}

// Clear and redraw all boids
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boids.forEach(boid => boid.drawBoid(ctx));
}

// Initialize simulation
const boids = [new Boid()];
resizeCanvas();

// Animation loop
function animate() {
    drawCanvas();
    requestAnimationFrame(animate);
}
animate();

// Event listeners
window.addEventListener('resize', resizeCanvas);