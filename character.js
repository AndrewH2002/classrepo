class Character {
    constructor(img, x, y) {
      this.img = img;
      this.x = x;
      this.y = y;
      this.spriteSize = 80;
      this.currentFrame = 0;
      this.frameCount = 0;
      this.isMoving = false;
      this.direction = 1; // 1 = right, -1 = left
      this.animationSpeed = 6; // Lower numbers = faster animation
    }
  
    update() {
      if (this.isMoving) {
        this.frameCount++;
        if (this.frameCount % this.animationSpeed === 0) {
          this.currentFrame = (this.currentFrame + 1) % 6;
        }
      } else {
        this.currentFrame = 0;
      }
    }
  
    display() {
  console.log("Displaying character");
  console.log("Image width:", this.img.width);
  console.log("Current frame:", this.currentFrame);
  
  push();
  translate(this.x, this.y);
  
  if (this.direction === -1) {
    scale(-1, 1);
    translate(-this.spriteSize, 0);
  }

  image(
    this.img,
    0,
    0,
    this.spriteSize,
    this.spriteSize,
    this.currentFrame * this.spriteSize,
    0,
    this.spriteSize,
    this.spriteSize
  );
  
  pop();
}
  
    move(direction) {
      this.isMoving = true;
      this.direction = direction;
      this.x += direction * 2;
    }
  
    stop() {
      this.isMoving = false;
    }
  }