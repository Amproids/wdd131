class Boid {
    constructor(x, y, dx, dy, width, height) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.dx = dx || Math.random() * 10 - 5;
        this.dy = dy || Math.random() * 10 - 5;
        this.color = this.generateRandomColor();
        this.size = 12;
    }

    generateRandomColor() {
        const rgb = Array.from({ length: 3 }, () => 
            Math.floor(Math.random() * 155 + 100).toString(16).padStart(2, '0')
        );
        return `#${rgb.join('')}`;
    }
}

class BoidsSimulation {
    constructor() {
        this.canvasWrapper = document.querySelector('.canvas-wrapper');
        this.width = this.canvasWrapper.clientWidth;
        this.height = this.canvasWrapper.clientHeight;
        this.canvas = document.getElementById('boids-canvas');
        this.ctx = this.canvas.getContext('2d');
        console.log(this.width, this.height);
        
        // Simulation parameters
        this.numBoids = 100;
        this.visualRange = 90;
        this.boids = [];
        this.settings = {
            speed: 0.5,
            separation: 1.5,
            alignment: 1.2,
            cohesion: 0.8,
        };

        this.initControls();
        this.initBoids();
        this.bindEvents();
        this.sizeCanvas();
        this.animate();
    }

    initControls() {
        ['num-boids', 'speed', 'separation', 'alignment', 'cohesion'].forEach(id => {
            const input = document.getElementById(id);
            const display = document.getElementById(`${id}-value`);
            
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                display.textContent = value;
                
                switch(id) {
                    case 'num-boids':
                        this.updateBoidCount(value);
                        break;
                    case 'speed':
                        this.settings.speed = value;
                        break;
                    case 'separation':
                        this.settings.separation = value;
                        break;
                    case 'alignment':
                        this.settings.alignment = value;
                        break;
                    case 'cohesion':
                        this.settings.cohesion = value;
                        break;
                }
            });
        });

        document.getElementById('reset-simulation').addEventListener('click', () => {
            this.resetSimulation();
        });
    }

    initBoids() {
        this.boids = Array.from({ length: this.numBoids }, 
            () => new Boid(null, null, null, null, this.width, this.height)
        );
    }

    updateBoidCount(newCount) {
        const diff = newCount - this.boids.length;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                this.boids.push(new Boid(null, null, null, null, this.width, this.height));
            }
        } else {
            this.boids = this.boids.slice(0, newCount);
        }
    }

    resetSimulation() {
        this.boids = [];
        this.initBoids();
    }

    sizeCanvas() {
        this.width = this.canvasWrapper.clientWidth;
        this.height = this.canvasWrapper.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        console.log(this.width, this.height);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.sizeCanvas(), false);
    }

    distance(boid1, boid2) {
        let dx = boid1.x - boid2.x;
        let dy = boid1.y - boid2.y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    flyTowardsCenter(boid) {
        const centeringFactor = 0.005 * this.settings.cohesion;
        let centerX = 0;
        let centerY = 0;
        let numNeighbors = 0;

        for (let otherBoid of this.boids) {
            if (this.distance(boid, otherBoid) < this.visualRange) {
                centerX += otherBoid.x;
                centerY += otherBoid.y;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            centerX = centerX / numNeighbors;
            centerY = centerY / numNeighbors;
            boid.dx += (centerX - boid.x) * centeringFactor;
            boid.dy += (centerY - boid.y) * centeringFactor;
        }
    }

    avoidOthers(boid) {
        const minDistance = 20;
        const avoidFactor = 0.05 * this.settings.separation;
        let moveX = 0;
        let moveY = 0;

        for (let otherBoid of this.boids) {
            if (otherBoid !== boid) {
                if (this.distance(boid, otherBoid) < minDistance) {
                    moveX += boid.x - otherBoid.x;
                    moveY += boid.y - otherBoid.y;
                }
            }
        }

        boid.dx += moveX * avoidFactor;
        boid.dy += moveY * avoidFactor;
    }

    matchVelocity(boid) {
        const matchingFactor = 0.05 * this.settings.alignment;
        let avgDX = 0;
        let avgDY = 0;
        let numNeighbors = 0;

        for (let otherBoid of this.boids) {
            if (this.distance(boid, otherBoid) < this.visualRange) {
                avgDX += otherBoid.dx;
                avgDY += otherBoid.dy;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            avgDX = avgDX / numNeighbors;
            avgDY = avgDY / numNeighbors;
            boid.dx += (avgDX - boid.dx) * matchingFactor;
            boid.dy += (avgDY - boid.dy) * matchingFactor;
        }
    }

    keepWithinBounds(boid) {
        // Bounce off the edges
        if (boid.x < 0) {
            boid.x = 0;
            boid.dx *= -1;
        } else if (boid.x > this.width) {
            boid.x = this.width;
            boid.dx *= -1;
        }
        
        if (boid.y < 0) {
            boid.y = 0;
            boid.dy *= -1;
        } else if (boid.y > this.height) {
            boid.y = this.height;
            boid.dy *= -1;
        }
    }

    limitSpeed(boid) {
        const speedLimit = 15;
        const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
        if (speed > speedLimit) {
            boid.dx = (boid.dx / speed) * speedLimit;
            boid.dy = (boid.dy / speed) * speedLimit;
        }
    }

    drawBoid(boid) {
        const angle = Math.atan2(boid.dy, boid.dx);
        this.ctx.translate(boid.x, boid.y);
        this.ctx.rotate(angle);
        this.ctx.translate(-boid.x, -boid.y);
        this.ctx.fillStyle = boid.color;
        this.ctx.beginPath();
        this.ctx.moveTo(boid.x + boid.size, boid.y);
        this.ctx.lineTo(boid.x - boid.size/2, boid.y + boid.size/3);
        this.ctx.lineTo(boid.x - boid.size/2, boid.y - boid.size/3);
        this.ctx.lineTo(boid.x + boid.size, boid.y);
        this.ctx.fill();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    updateBoids() {
        for (let boid of this.boids) {
            this.flyTowardsCenter(boid);
            this.avoidOthers(boid);
            this.matchVelocity(boid);
            this.limitSpeed(boid);
            this.keepWithinBounds(boid);

            boid.x += boid.dx * this.settings.speed;
            boid.y += boid.dy * this.settings.speed;
        }
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.updateBoids();
        for (let boid of this.boids) {
            this.drawBoid(boid);
        }
        requestAnimationFrame(this.animate);
    }
}

window.addEventListener('load', () => {
    new BoidsSimulation();
});