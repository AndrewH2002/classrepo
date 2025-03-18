let currentColor;
let isDrawing = false;
let colors = [];
let drawingBuffer;
let clearButton;
let isEraser = false;
let eraserButton;
let canvasFilledPercentage = 0;
let lastFilledPercentage = 0;
let pixelsFilled = 0;
let totalPixels;

// Sound-related variables
let synth;
let backgroundLoop;
let colorNotes = [];
let paintingScale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let backgroundPattern;
let reverb;
let delay;

function setup() {
  createCanvas(860, 600);
  drawingBuffer = createGraphics(800, 600);
  drawingBuffer.background(255);
  totalPixels = 800 * 600;
  
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
  
  // Create clear button
  clearButton = createButton('Clear Canvas');
  clearButton.position(700, 610);
  clearButton.mousePressed(clearCanvas);
  
  // Create eraser button
  eraserButton = createButton('Eraser');
  eraserButton.position(620, 610);
  eraserButton.mousePressed(toggleEraser);
  
  // Initialize Tone.js
  initializeSound();
}

function initializeSound() {
  // Wait for user interaction to start audio
  document.body.addEventListener('click', function() {
    if (Tone.context.state !== 'running') {
      Tone.start();
      startBackgroundMusic();
    }
  }, { once: true });
  
  // Set up effects
  reverb = new Tone.Reverb({
    decay: 1.5,
    wet: 0.2
  }).toDestination();
  
  delay = new Tone.FeedbackDelay({
    delayTime: 0.25,
    feedback: 0.1,
    wet: 0.1
  }).connect(reverb);
  
  // Main synth for painting
  synth = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    },
    oscillator: {
      type: 'triangle'
    }
  }).connect(delay);
  
  // Set up notes for each color
  colorNotes = [
    'C4',  // Red
    'D4',  // Orange
    'E4',  // Yellow
    'F4',  // Green
    'G4',  // Cyan
    'A4',  // Blue
    'B4',  // Magenta
    'C5',  // Brown
    'E5',  // White
    'G3'   // Black
  ];
  
  // Background music loop
  backgroundLoop = new Tone.Loop(time => {
    let note = paintingScale[Math.floor(canvasFilledPercentage * paintingScale.length / 100)];
    let synthType = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.4,
        release: 0.8
      }
    }).connect(reverb);
    
    synthType.triggerAttackRelease(note, '8n', time);
    synthType.volume.value = -20 + (canvasFilledPercentage / 10);
  }, '4n');
}

function startBackgroundMusic() {
  // Start transport
  Tone.Transport.bpm.value = 70 + (canvasFilledPercentage / 2);
  Tone.Transport.start();
  backgroundLoop.start();
}

function draw() {
  background(255);
  image(drawingBuffer, 60, 0); // Draw painting area
  drawPalette(); // Draw color selector
  
  // Display eraser status
  if (isEraser) {
    fill(100);
    textSize(12);
    text("ERASER ACTIVE", 700, 580);
  }
  
  // Draw if mouse is pressed
  if (isDrawing && mouseIsPressed && mouseX >= 60) {
    drawingBuffer.strokeWeight(8);
    
    if (isEraser) {
      // Use eraser
      drawingBuffer.stroke(255);
      drawingBuffer.line(pmouseX - 60, pmouseY, mouseX - 60, mouseY);
      // Play eraser sound
      if (frameCount % 5 === 0) {
        let eraserSynth = new Tone.NoiseSynth({
          noise: {
            type: 'white'
          },
          envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.05,
            release: 0.1
          }
        }).connect(reverb);
        eraserSynth.volume.value = -25;
        eraserSynth.triggerAttackRelease('16n');
      }
    } else {
      // Normal drawing
      drawingBuffer.stroke(currentColor);
      drawingBuffer.line(pmouseX - 60, pmouseY, mouseX - 60, mouseY);
      
      // Play sound for drawing
      if (frameCount % 5 === 0 && Tone.context.state === 'running') {
        // Find the color index
        let colorIndex = 9; // Default to black
        for (let i = 0; i < colors.length; i++) {
          if (colorsEqual(colors[i], currentColor)) {
            colorIndex = i;
            break;
          }
        }
        
        // Calculate velocity based on stroke speed
        let strokeSpeed = dist(pmouseX, pmouseY, mouseX, mouseY);
        let velocity = map(strokeSpeed, 0, 50, 0.1, 0.6);
        
        // Play the note
        synth.triggerAttackRelease(colorNotes[colorIndex], '16n', undefined, velocity);
      }
    }
  }
  
  // Calculate canvas fill percentage
  if (frameCount % 30 === 0) {
    updateCanvasFillPercentage();
  }
}

function colorsEqual(c1, c2) {
  return red(c1) === red(c2) && 
         green(c1) === green(c2) && 
         blue(c1) === blue(c2);
}

function updateCanvasFillPercentage() {
  drawingBuffer.loadPixels();
  pixelsFilled = 0;
  
  // Count non-white pixels (simplified approach)
  for (let i = 0; i < drawingBuffer.pixels.length; i += 4) {
    // Check if pixel is not white (RGB all 255)
    if (drawingBuffer.pixels[i] !== 255 || 
        drawingBuffer.pixels[i + 1] !== 255 || 
        drawingBuffer.pixels[i + 2] !== 255) {
      pixelsFilled++;
    }
  }
  
  lastFilledPercentage = canvasFilledPercentage;
  canvasFilledPercentage = floor((pixelsFilled / (totalPixels)) * 100);
  
  // Adjust music tempo based on canvas fill
  if (Math.abs(canvasFilledPercentage - lastFilledPercentage) > 5 && Tone.Transport.state === 'started') {
    Tone.Transport.bpm.rampTo(70 + (canvasFilledPercentage / 2), 2);
    
    // Change reverb wet value based on canvas fill
    reverb.wet.rampTo(0.1 + (canvasFilledPercentage / 200), 2);
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
    if ((colors[i] === currentColor && !isEraser) || 
        (i === colors.length - 1 && isEraser)) {
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
        isEraser = false;
        
        // Play color selection sound
        if (Tone.context.state === 'running') {
          let colorSelectionSynth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.5 }
          }).connect(reverb);
          
          colorSelectionSynth.triggerAttackRelease(colorNotes[i], '8n');
        }
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

function clearCanvas() {
  drawingBuffer.background(255);
  pixelsFilled = 0;
  canvasFilledPercentage = 0;
  
  // Play clear canvas sound
  if (Tone.context.state === 'running') {
    let clearSynth = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 1.4,
        release: 0.2
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(reverb);
    
    clearSynth.volume.value = -15;
    clearSynth.triggerAttackRelease('16n');
    
    // Reset tempo
    Tone.Transport.bpm.rampTo(70, 1);
  }
}

function toggleEraser() {
  isEraser = !isEraser;
  
  // Play toggle sound
  if (Tone.context.state === 'running') {
    let toggleSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
        attackCurve: 'exponential'
      }
    }).connect(reverb);
    
    toggleSynth.volume.value = -20;
    toggleSynth.triggerAttackRelease('C2', '8n');
  }
}

// Function to save the drawing
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas(drawingBuffer, 'myPainting', 'png');
    
    // Play save sound
    if (Tone.context.state === 'running') {
      let saveSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
      }).connect(reverb);
      
      let saveSequence = new Tone.Sequence((time, note) => {
        saveSynth.triggerAttackRelease(note, '16n', time);
      }, ['C5', 'E5', 'G5', 'C6'], '16n').start();
      
      // Stop the sequence after playing once
      setTimeout(() => {
        saveSequence.stop();
        saveSequence.dispose();
      }, 1000);
    }
  }
}