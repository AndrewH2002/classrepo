// Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load Audio Files
const loadAudio = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

// Create Audio Buffers
const audioFiles = [
    { name: 'kick', url: 'kick.wav' },
    { name: 'snare', url: 'snare.wav' },
    { name: 'hihat', url: 'hihat.wav' },
    { name: 'clap', url: 'clap.wav' }
];

const audioBuffers = {};
const loadAllAudio = async () => {
    for (const file of audioFiles) {
        try {
            audioBuffers[file.name] = await loadAudio(file.url);
            console.log(`${file.name} loaded successfully`);
        } catch (error) {
            console.error(`Failed to load ${file.name}:`, error);
        }
    }
};

// Play Audio
const playAudio = (buffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // Create Delay Effect
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();
    const wetLevel = audioContext.createGain();

    // Set Initial Values
    delay.delayTime.value = 0; // Initial delay time
    feedback.gain.value = 0.5; // Feedback amount
    wetLevel.gain.value = 0.7; // Wet signal level

    // Connect Nodes
    source.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetLevel);
    wetLevel.connect(audioContext.destination);
    source.connect(audioContext.destination);

    // Control Delay
    const delayControl = document.getElementById('delay');
    delayControl.addEventListener('input', () => {
        delay.delayTime.value = parseFloat(delayControl.value);
    });

    // Start Playback
    source.start();
};

// Add Event Listeners to Buttons
document.getElementById('kick').addEventListener('click', () => {
    if (audioBuffers.kick) {
        playAudio(audioBuffers.kick);
    } else {
        console.error('Kick buffer not loaded');
    }
});

document.getElementById('snare').addEventListener('click', () => {
    if (audioBuffers.snare) {
        playAudio(audioBuffers.snare);
    } else {
        console.error('Snare buffer not loaded');
    }
});

document.getElementById('hihat').addEventListener('click', () => {
    if (audioBuffers.hihat) {
        playAudio(audioBuffers.hihat);
    } else {
        console.error('Hi-Hat buffer not loaded');
    }
});

document.getElementById('clap').addEventListener('click', () => {
    if (audioBuffers.clap) {
        playAudio(audioBuffers.clap);
    } else {
        console.error('Clap buffer not loaded');
    }
});

// Start Audio Context on User Interaction
document.getElementById('start').addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context resumed');
        });
    }
});

// Load All Audio Files
loadAllAudio();