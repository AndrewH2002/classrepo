let characters = [];
let spelunkySheet, greenSheet, yellowSheet;
let moveDirection = 0;

function preload() {
  spelunkySheet = loadImage('spelunky.png');
  greenSheet = loadImage('green.png');
  yellowSheet = loadImage('yellow.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create characters with random positions and different sprites
  for (let i = 0; i < 5; i++) {
    let sheets = [spelunkySheet, greenSheet, yellowSheet];
    let randomSheet = random(sheets);
    characters.push(new Character(
      randomSheet,
      random(width),
      random(height - 80)
    ));
  }
}

function draw() {
  background(220);
  
  characters.forEach(character => {
    if (moveDirection !== 0) {
      character.move(moveDirection);
    } else {
      character.stop();
    }
    character.update();
    character.display();
  });
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    moveDirection = -1;
  } else if (keyCode === RIGHT_ARROW) {
    moveDirection = 1;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    moveDirection = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}