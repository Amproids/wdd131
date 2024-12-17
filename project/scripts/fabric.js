// Fabric Simulation with Cutting Functionality
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
        this.pinned = false;
    }

    update(gravity, damping) {
        if (this.pinned) return;

        const vx = (this.x - this.oldX) * damping;
        const vy = (this.y - this.oldY) * damping;

        this.oldX = this.x;
        this.oldY = this.y;

        this.x += vx;
        this.y += vy + gravity;
    }

    pin() {
        this.pinned = true;
    }

    unpin() {
        this.pinned = false;
    }
}

class Spring {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = this.getDistance();
        this.isActive = true;
    }

    getDistance() {
        const dx = this.p1.x - this.p2.x;
        const dy = this.p1.y - this.p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    update(stiffness) {
        if (!this.isActive) return;

        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const difference = (distance - this.length) / distance;

        const offsetX = dx * difference * 0.5 * stiffness;
        const offsetY = dy * difference * 0.5 * stiffness;

        if (!this.p1.pinned) {
            this.p1.x += offsetX;
            this.p1.y += offsetY;
        }

        if (!this.p2.pinned) {
            this.p2.x -= offsetX;
            this.p2.y -= offsetY;
        }
    }

    // Check if a line segment intersects with this spring
    intersectsLine(x1, y1, x2, y2) {
        // Line segment intersection check
        const denom = ((this.p2.x - this.p1.x) * (y2 - y1)) - 
                     ((this.p2.y - this.p1.y) * (x2 - x1));
        
        if (denom === 0) return false;

        const ua = (((x2 - x1) * (this.p1.y - y1)) - 
                   ((y2 - y1) * (this.p1.x - x1))) / denom;
        const ub = (((this.p2.x - this.p1.x) * (this.p1.y - y1)) - 
                   ((this.p2.y - this.p1.y) * (this.p1.x - x1))) / denom;

        return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
    }
}

class FabricSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.springs = [];
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.settings = {
            gravity: 0.8,
            stiffness: 0.3,
            damping: 0.96,
            pinPoints: 2,
            wind: false,
            type: 'fabric'
        };

        this.setupEventListeners();
        this.resize();
        this.init();
    }

    resize() {
        const wrapper = this.canvas.parentElement;
        // Set canvas size to match wrapper dimensions
        this.canvas.width = wrapper.offsetWidth;
        this.canvas.height = wrapper.offsetHeight;
        
        // Set canvas style dimensions to match
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }

    setupEventListeners() {
        // Mouse events for cutting
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            const rect = this.canvas.getBoundingClientRect();
            this.lastMouseX = e.clientX - rect.left;
            this.lastMouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check for springs to cut
            this.springs.forEach(spring => {
                if (spring.isActive && spring.intersectsLine(
                    this.lastMouseX, this.lastMouseY, mouseX, mouseY)) {
                    spring.isActive = false;
                }
            });

            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Settings controls
        document.getElementById('simulation-type').addEventListener('change', (e) => {
            this.settings.type = e.target.value;
            this.init();
        });

        document.getElementById('gravity').addEventListener('input', (e) => {
            this.settings.gravity = parseFloat(e.target.value);
            document.getElementById('gravity-value').textContent = e.target.value;
        });

        document.getElementById('stiffness').addEventListener('input', (e) => {
            this.settings.stiffness = parseFloat(e.target.value);
            document.getElementById('stiffness-value').textContent = e.target.value;
        });

        document.getElementById('damping').addEventListener('input', (e) => {
            this.settings.damping = parseFloat(e.target.value);
            document.getElementById('damping-value').textContent = e.target.value;
        });

        document.getElementById('pin-points').addEventListener('input', (e) => {
            this.settings.pinPoints = parseInt(e.target.value);
            this.init();
        });

        document.getElementById('wind').addEventListener('change', (e) => {
            this.settings.wind = e.target.checked;
        });

        document.getElementById('reset-simulation').addEventListener('click', () => {
            this.init();
        });

        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
    }

    init() {
        this.points = [];
        this.springs = [];

        switch (this.settings.type) {
            case 'fabric':
                this.createFabric();
                break;
            case 'rope':
                this.createRope();
                break;
            case 'curtain':
                this.createCurtain();
                break;
        }
    }

    createFabric() {
        const cols = 20;
        const rows = 20;
        const marginX = this.canvas.width * 0.1;  // 10% margin
        const marginY = this.canvas.height * 0.1;
        const spacingX = (this.canvas.width - 2 * marginX) / (cols - 1);
        const spacingY = (this.canvas.height - 2 * marginY) / (rows - 1);

        // Create points
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const point = new Point(
                    marginX + x * spacingX,
                    marginY + y * spacingY
                );
                if (y === 0 && x % Math.floor(cols / (this.settings.pinPoints - 1)) === 0) {
                    point.pin();
                }
                this.points.push(point);
            }
        }

        // Create springs
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const idx = y * cols + x;

                // Horizontal springs
                if (x < cols - 1) {
                    this.springs.push(new Spring(
                        this.points[idx],
                        this.points[idx + 1]
                    ));
                }

                // Vertical springs
                if (y < rows - 1) {
                    this.springs.push(new Spring(
                        this.points[idx],
                        this.points[idx + cols]
                    ));
                }
            }
        }
    }

    createRope() {
        const segments = 20;
        const marginX = this.canvas.width * 0.1;
        const spacingX = (this.canvas.width - 2 * marginX) / segments;

        // Create points
        for (let i = 0; i < segments; i++) {
            const point = new Point(
                marginX + i * spacingX,
                this.canvas.height * 0.3
            );
            if (i === 0) point.pin();
            this.points.push(point);
        }

        // Create springs
        for (let i = 0; i < segments - 1; i++) {
            this.springs.push(new Spring(
                this.points[i],
                this.points[i + 1]
            ));
        }
    }

    createCurtain() {
        const cols = 30;
        const rows = 20;
        const marginX = this.canvas.width * 0.1;
        const marginY = this.canvas.height * 0.1;
        const spacingX = (this.canvas.width - 2 * marginX) / (cols - 1);
        const spacingY = (this.canvas.height - 2 * marginY) / (rows - 1);

        // Create points
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const point = new Point(
                    marginX + x * spacingX,
                    marginY + y * spacingY
                );
                if (y === 0) point.pin();
                this.points.push(point);
            }
        }

        // Create springs
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const idx = y * cols + x;

                // Horizontal springs
                if (x < cols - 1) {
                    this.springs.push(new Spring(
                        this.points[idx],
                        this.points[idx + 1]
                    ));
                }

                // Vertical springs
                if (y < rows - 1) {
                    this.springs.push(new Spring(
                        this.points[idx],
                        this.points[idx + cols]
                    ));
                }
            }
        }
    }

    update() {
        // Apply wind if enabled
        if (this.settings.wind) {
            const windForce = Math.sin(Date.now() / 1000) * 0.5;
            this.points.forEach(point => {
                if (!point.pinned) {
                    point.x += windForce;
                }
            });
        }

        // Update springs
        for (let i = 0; i < 3; i++) {
            this.springs.forEach(spring => {
                spring.update(this.settings.stiffness);
            });
        }

        // Update points
        this.points.forEach(point => {
            point.update(this.settings.gravity, this.settings.damping);

            // Constrain points to canvas
            point.x = Math.max(0, Math.min(this.canvas.width, point.x));
            point.y = Math.max(0, Math.min(this.canvas.height, point.y));
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw springs
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#2ecc71';
        this.ctx.lineWidth = 2;

        this.springs.forEach(spring => {
            if (spring.isActive) {
                this.ctx.moveTo(spring.p1.x, spring.p1.y);
                this.ctx.lineTo(spring.p2.x, spring.p2.y);
            }
        });

        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = '#27ae60';
        this.points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw cutting line while dragging
        if (this.isDragging) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#e74c3c';
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(this.lastMouseX, this.lastMouseY);
            this.ctx.lineTo(this.lastMouseX, this.lastMouseY);
            this.ctx.stroke();
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the simulation when the window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('fabric-canvas');
    const simulation = new FabricSimulation(canvas);
    simulation.animate();
});