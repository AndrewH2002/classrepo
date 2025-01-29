let greenShapeCanvas, circlesCanvas, starLogoCanvas, pacmanCanvas;

function setup() {
  createCanvas(800, 200);

  greenShapeCanvas = createGraphics(200, 100);
  circlesCanvas = createGraphics(200, 200);
  starLogoCanvas = createGraphics(200, 200);
  pacmanCanvas = createGraphics(200, 200);

  drawGreenShapes(greenShapeCanvas);
  drawOverlappingCircles(circlesCanvas);
  drawStarLogo(starLogoCanvas);
  drawPacmanScene(pacmanCanvas);
}

function draw() {
  background(255);
  image(greenShapeCanvas, 0, 0);
  image(circlesCanvas, 200, 0);
  image(starLogoCanvas, 400, 0);
  image(pacmanCanvas, 600, 0);
}

function drawGreenShapes(pg) {
  pg.background(0, 255, 0);
  pg.noFill();
  pg.stroke(0);

  pg.fill(255);
  pg.ellipse(50, 50, 80, 80);
  pg.rect(110, 10, 80, 80);
}

function drawOverlappingCircles(pg) {
  pg.background(255);
  pg.noStroke();

  pg.fill(255, 0, 0, 150);
  pg.ellipse(100, 75, 100, 100);

  pg.fill(0, 255, 0, 150);
  pg.ellipse(125, 125, 100, 100);

  pg.fill(0, 0, 255, 150);
  pg.ellipse(75, 125, 100, 100);
}

function drawStarLogo(pg) {
  pg.background(0, 0, 139);
  pg.translate(pg.width/2, pg.height/2);
  
  // Green circle
  pg.fill(0, 128, 0);
  pg.noStroke();
  pg.circle(0, 0, 120);
  
  // White ring
  pg.stroke(255);
  pg.strokeWeight(4);
  pg.noFill();
  pg.circle(0, 0, 120);
  
  
  pg.stroke(255);
  pg.strokeWeight(2);
  pg.fill(255, 0, 0);
  pg.beginShape();
  for (let i = 0; i < 5; i++) {
    let angleOuter = TWO_PI * i / 5 - PI/2;
    let xOuter = cos(angleOuter) * 45;
    let yOuter = sin(angleOuter) * 45;
    pg.vertex(xOuter, yOuter);
    
    let angleInner = TWO_PI * (i + 0.5) / 5 - PI/2;
    let xInner = cos(angleInner) * 20;
    let yInner = sin(angleInner) * 20;
    pg.vertex(xInner, yInner);
  }
  pg.endShape(CLOSE);
}

function drawPacmanScene(pg) {
  pg.background(0); 
  const centerY = 100;  
  
  
  pg.fill(255, 255, 0);  
  pg.noStroke();
  pg.arc(80, centerY + 5, 60, 60, 3.67, 2.62); 
  
  
  pg.fill(255, 0, 0); 
  pg.noStroke();
  
  pg.rect(130, centerY , 50, 35);  
  
  pg.arc(155, centerY , 50, 50, PI, TWO_PI);
  
  
  pg.fill(255);
  pg.ellipse(145, centerY , 16, 16);
  pg.ellipse(165, centerY , 16, 16);
  
  
  pg.fill(0, 0, 255);
  pg.ellipse(145, centerY , 8, 8);
  pg.ellipse(165, centerY , 8, 8);
}