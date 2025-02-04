let currentColor;
let isDrawing = false;
let colors = [];
let drawingBuffer;

function setup() {
  createCanvas(860, 600);
  drawingBuffer = createGraphics(800, 600);
  drawingBuffer.background(255);
  
  // Define color palette
  colors = [
    color(255, 0, 0),    // Red
    color(255, 165, 0),  // Orange
    color(255, 255, 0),  // Yellow
    color(0, 255, 0),    // Green
    color(0, 255, 255),  // Cyan
    color(0, 0, 255),    // Blue
    color(255, 0, 255),  // Magenta
    color(165, 42, 42),  // Brown
    color(255),          // White
    color(0)             // Black
  ];
  
  currentColor = color(0); // Start with black
}

function draw() {
  background(255);
  image(drawingBuffer, 60, 0); // Draw painting area
  drawPalette(); // Draw color selector
  
  if (isDrawing && mouseIsPressed) {
    // Draw line on buffer
    drawingBuffer.stroke(currentColor);
    drawingBuffer.strokeWeight(4);
    drawingBuffer.line(pmouseX - 60, pmouseY, mouseX - 60, mouseY);
  }
}

function drawPalette() {
  // Draw color boxes
  for (let i = 0; i < colors.length; i++) {
    let y = 5 + i * 55;
    fill(colors[i]);
    noStroke();
    rect(5, y, 50, 50);
    
    // Draw selection border
    if (colors[i] === currentColor) {
      stroke(0);
      strokeWeight(2);
      noFill();
      rect(5, y, 50, 50);
    }
  }
}

function mousePressed() {
  // Check color selection
  if (mouseX >= 5 && mouseX <= 55) {
    for (let i = 0; i < colors.length; i++) {
      let y = 5 + i * 55;
      if (mouseY >= y && mouseY <= y + 50) {
        currentColor = colors[i];
        break;
      }
    }
  }
  // Start drawing
  else if (mouseX >= 60) {
    isDrawing = true;
  }
}

function mouseReleased() {
  isDrawing = false;
}