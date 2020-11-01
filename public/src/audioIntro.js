let soundIntro;
let soundIntroOn = false;

function preload() {
  // soundFormats('mp3', 'ogg');
  // soundIntro = loadSound('./audio/0_sound_altardigital.mp3');
  soundIntro = loadSound(`./audio/0_portadaLoop.mp3`);
  // getAudioContext().suspend();
}

function setup() {
  noCanvas();

  userStartAudio();

  soundIntro.setVolume(0.4, 3);
  soundIntro.loop();
  soundIntro.play();
  // soundIntro.play();
  console.log("hioli setup");
}

console.log("hioli p5");
