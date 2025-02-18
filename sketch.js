let bugImage, squishedImage;
let bugs = [];
let squishCount = 0;
let gameTime = 30;
let gameOver = false;

function preload() {
    bugImage = loadImage('bug.png'); // 4-frame sprite sheet (32x32 per frame)
    squishedImage = loadImage('bugsquish.png'); // Single squished image (32x32)
}

function setup() {
    createCanvas(800, 600);
    frameRate(30);
    angleMode(RADIANS);
    imageMode(CENTER);

    // Create initial bugs with position constraints
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(
            random(50, width - 50),
            random(50, height - 50)
        ));
    }
}

function draw() {
    background(220);

    // UI Elements
    fill(0);
    textSize(24);
    text(`Time: ${gameTime}`, 20, 30);
    text(`Squished: ${squishCount}`, 20, 60);

    // Game state
    if (!gameOver) {
        // Update timer
        if (frameCount % 30 === 0) gameTime--;
        
        // End game
        if (gameTime <= 0) {
            gameOver = true;
            noLoop();
            textSize(40);
            textAlign(CENTER, CENTER);
            fill(255, 0, 0);
            text('Game Over!', width / 2, height / 2);
        }
    }

    // Bug management
    for (let i = bugs.length - 1; i >= 0; i--) {
        bugs[i].update();
        bugs[i].display();
        
        // Remove squished bugs after 1 second
        if (bugs[i].squished && bugs[i].squishTimer <= 0) {
            bugs.splice(i, 1);
        }
    }
}

function mousePressed() {
    for (let bug of bugs) {
        if (bug.isSquished(mouseX, mouseY)) {
            bug.squish();
            squishCount++;
            bugs.push(new Bug(random(width), random(height)));
        }
    }
}

class Bug {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.speed = random(1, 3);
        this.velocity = p5.Vector.random2D().mult(this.speed);
        this.size = 32; // Size of one frame
        this.squished = false;
        this.squishTimer = 30; // Timer to remove squished bugs
        
        // Animation properties
        this.currentFrame = 0;
        this.frameCount = 4; // Total number of frames in bug.png
        this.animationSpeed = 0.1; // Adjusted for smooth animation
    }

    update() {
        if (!this.squished) {
            // Update position
            this.pos.add(this.velocity);
            
            // Bounce off edges
            if (this.pos.x < this.size / 2 || this.pos.x > width - this.size / 2) {
                this.velocity.x *= -1;
                this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
            }
            if (this.pos.y < this.size / 2 || this.pos.y > height - this.size / 2) {
                this.velocity.y *= -1;
                this.pos.y = constrain(this.pos.y, this.size / 2, height - this.size / 2);
            }

            // Update animation
            this.currentFrame = (this.currentFrame + this.animationSpeed);
            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = 0; // Reset to the first frame
            }
        } else {
            // Decrease squish timer
            this.squishTimer--;
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        
        if (!this.squished) {
            // Rotate bug to face movement direction
            let angle = atan2(this.velocity.y, this.velocity.x);
            rotate(angle + HALF_PI);
            
            // Get current frame position in sprite sheet
            let sx = floor(this.currentFrame) * this.size;
            
            // Draw current animation frame
            image(
                bugImage,        // Source image
                0, 0,           // Destination x, y (centered)
                this.size,      // Destination width
                this.size,      // Destination height
                sx,             // Source x (frame position in sprite sheet)
                0,              // Source y
                this.size,      // Source width (one frame)
                this.size       // Source height
            );
        } else {
            // Draw squished bug
            image(
                squishedImage,
                0, 0,
                this.size,
                this.size
            );
        }
        pop();
    }

    isSquished(mx, my) {
        // Check if the mouse click is within the bug's bounds
        return !this.squished && 
               dist(mx, my, this.pos.x, this.pos.y) < this.size / 2;
    }

    squish() {
        this.squished = true;
        // Increase speed of active bugs
        bugs.forEach(b => {
            if (!b.squished) b.velocity.mult(1.2);
        });
    }
}