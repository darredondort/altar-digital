// P_2_3_3_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * draw tool. shows how to draw with dynamic elements.
 *
 * MOUSE
 * drag                : draw with text
 *
 * KEYS
 * del, backspace      : clear screen
 * arrow up            : angle distortion +
 * arrow down          : angle distortion -
 * s                   : save png
 */
'use strict';


let sounds = [];
let soundCount = 7;
let soundPlaying;

let currSub = "";

let subsJam01 = ["Creatura, es momento de activar la luz.","Sostén en tu mano una veladora o el celular con la linterna encendida.","Alumbra hacia acá, dirige la luz dirige la luz hacia la cámara.","La luz no es el final creatura...","...la luz nos muestra el camino para recordar a lxs que solían vivir."];
let subsJam01Triggers = [6, 13, 20, 29, 33, 40];
let subsJam01Toggle = false;

let subsJam02 = ["Muéstrame tu mano creatura,","alúmbrala con la luz","Observa las arrugas de la piel...","...las marcas de vida.","Sigue alumbrando hacia el brazo...","...vello por vello...","..pasando por el codo.","Alumbra el hombro, la clavícula.","Lleva la luz hacia tu cara,","Observa piel...","observa entre las arrugas...","Respira...","Recuerda..."];
let subsJam02Triggers = [5, 8, 15, 18, 24, 28, 31, 34, 41, 47, 50, 56, 61, 68];
let subsJam02Toggle = false;

let subsJam03 = ["Lanza los brazos hacia arriba","Creatura, la vida es tuya, muy tuya en este momento.","Siéntela Pulsando desde el corazón hasta la punta de tus dedos.","Inhala,","Siente el aire entre las costillas","la carne entre hueso y hueso,","Exhala,","Baja los brazos y sostenlos con ternura","¿A quién quieres recordar hoy?","Elles, nos abrazan en las noches más obscuras,","Susurran sabiduría","En tu sangre esperan por ti.","Ya están aquí...","...en tu cuerpo...","...y en tu memoria"];
let subsJam03Triggers = [5, 8, 14, 22, 25, 28, 33, 42, 48, 53, 59, 65, 71, 74, 77, 80];
let subsJam03Toggle = false;

var x = 0;
var y = 0;
var stepSize = 5.0;

var letters = '';
var fontSizeMin = 3;
var angleDistortion = 0.0;

var counter = 0;

let coreoSteps;

let canvasRitual;
let nombre;
let nacio;
let murio;
let textInput;
let yearPetals;
let form;

let nombreString;
let nacioString;
let murioString;
let textInputString;

let formButton;

function preload() {
  for (let i = 0; i < soundCount; i++){
    // introSound = new p5.SoundFile('audio/1_IntroTextoLoop_MIX1_96kb.mp3', initTriggers, errorSound, loadingSound);
    sounds[i] = loadSound(`audio/${String(i)}_sound_altardigital.mp3`, initTriggers(i), errorSound, loadingSound);
  }
}

function setup() {
  // use full screen size
  canvasRitual = createCanvas(displayWidth, displayHeight).parent('canvasRitual');
  background(255,0);
  cursor(CROSS);

  // portadaIntroSound = loadSound('audio/1_IntroTextoLoop_MIX1_96kb.mp3', initTriggers());
  // introSound = new p5.SoundFile('audio/1_IntroTextoLoop_MIX1_96kb.mp3', initTriggers, errorSound, loadingSound);
  // for (let i = 0; i < soundCount; i++){
  //   // introSound = new p5.SoundFile('audio/1_IntroTextoLoop_MIX1_96kb.mp3', initTriggers, errorSound, loadingSound);
  //   sounds[i] = loadSound(`audio/${String(i)}_sound_altardigital.mp3`, initTriggers(i), errorSound, loadingSound);
  // }





  x = mouseX;
  y = mouseY;

  textFont('Cormorant Garamond');
  textAlign(LEFT);
  fill(255);

  coreoSteps = selectAll(".coreo-step");

  form = select("#form");

  nombre = select("#nombre");
  nacio = select("#nacio");
  murio = select("#murio");
  textInput = select("#text-input");
  formButton = select("#form-button");
  formButton.mousePressed(replaceText);

  


}

function draw() {

  // if (soundPlaying) {
  //   // console.log(round(soundPlaying.currentTime(),2));
  // }
  fill(255,10)
  textAlign(CENTER,CENTER);
  textSize(24);
  text(currSub, width/2, height-height/4);


  if (introOn && sounds[0].isLoaded() && sounds[0].isPlaying() == false) {
    // currSub = "introOn";
    currSub = "";
    clear();
    fadeOutSounds();   
    triggerSound(sounds[0]); 
  }

  if (coreoOn && sounds[1].isLoaded() && sounds[1].isPlaying() == false) {
    // currSub = "coreoOn";
    currSub = "";
    clear();
    fadeOutSounds();   
    triggerSound(sounds[1])   
  }

  if (formOn && sounds[2].isLoaded() && sounds[2].isPlaying() == false) {
    // currSub = "formOn";
    currSub = "";
    clear();
    fadeOutSounds();   
    triggerSound(sounds[2]);  
  }

  if (jam01On) {
    startSubsJam01();
    if (sounds[3].isLoaded() && sounds[3].isPlaying() == false) {
      currSub = "";
      clear();
      fadeOutSounds();   
      triggerSound(sounds[3]);  
    }
  }

  if (jam02On) {
    startSubsJam02();
    if (sounds[4].isLoaded() && sounds[4].isPlaying() == false) {
      currSub = "";
      clear();
      fadeOutSounds();   
      triggerSound(sounds[4]);  
    }
  }

  if (jam03On) {
    startSubsJam03();
    if (sounds[5].isLoaded() && sounds[5].isPlaying() == false) {
      currSub = "";
      clear();
      fadeOutSounds();   
      triggerSound(sounds[5]);  
    }
  }
  
  if (transOn) {
    clear();
    currSub = "sigue bajando...";
  }


  if (altarOn) {

    if (sounds[6].isLoaded() && sounds[6].isPlaying() == false) {
      currSub = "";
      clear();
      fadeOutSounds();   
      triggerSound(sounds[6]);  
    }
    fill(255,10)
    drawFormText();

  }
  







  // if (altarOn && mouseIsPressed && mouseButton == LEFT) {
  //   drawTextMousePath();
  // }
}


function initTriggers(counter) {
  console.log("loaded" + sounds[counter]);
  // console.log("loaded" + introSound);
  // introSound.play();
}

function errorSound() {
  console.log("could not get sound file")
}

function loadingSound() {
  console.log("loading sound file")
}

function fadeOutSounds() {
  for (let i = 0; i < soundCount; i++){
    sounds[i].stop();
  }  
}

function triggerSound(currSound) {
  currSound.setLoop(false); 
  currSound.play();
  soundPlaying = currSound;
}


function startSubsJam01() {
  if (soundPlaying.currentTime()>subsJam01Triggers[0] && soundPlaying.currentTime()<subsJam01Triggers[1]) {
    if (!subsJam01Toggle) {
      clear();
      subsJam01Toggle = true;
    }
    currSub = subsJam01[0];
    console.log(subsJam01[0]);
  } else if (soundPlaying.currentTime()>subsJam01Triggers[1] && soundPlaying.currentTime()<subsJam01Triggers[2]) {
    if (subsJam01Toggle) {
      clear();
      subsJam01Toggle = false;
    }
    currSub = subsJam01[1];
    console.log(subsJam01[1]);
  } else if (soundPlaying.currentTime()>subsJam01Triggers[2] && soundPlaying.currentTime()<subsJam01Triggers[3]) {
    if (!subsJam01Toggle) {
      clear();
      subsJam01Toggle = true;
    }
    currSub = subsJam01[2];
    console.log(subsJam01[2]);
  } else if (soundPlaying.currentTime()>subsJam01Triggers[3] && soundPlaying.currentTime()<subsJam01Triggers[4]) {
    if (subsJam01Toggle) {
      clear();
      subsJam01Toggle = false;
    }
    currSub = subsJam01[3];
    console.log(subsJam01[3]);
  } else if (soundPlaying.currentTime()>subsJam01Triggers[4] && soundPlaying.currentTime()<subsJam01Triggers[5]) {
    if (!subsJam01Toggle) {
      clear();
      subsJam01Toggle = true;
    }
    currSub = subsJam01[4];
    console.log(subsJam01[4]);
  } else if (soundPlaying.currentTime()>subsJam01Triggers[5]) {
    if (subsJam01Toggle) {
      clear();
      subsJam01Toggle = false;
    }
    currSub = "(sigue hacia abajo...)"
  } else if (soundPlaying.currentTime()>subsJam01Triggers[5]+4) {
    if (!subsJam01Toggle) {
      clear();
      subsJam01Toggle = true;
    }
    currSub = ""
  }
}

function startSubsJam02() {
  if (soundPlaying.currentTime()>subsJam02Triggers[0] && soundPlaying.currentTime()<subsJam02Triggers[1]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[0];
    console.log(subsJam02[0]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[1] && soundPlaying.currentTime()<subsJam02Triggers[2]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = subsJam02[1];
    console.log(subsJam02[1]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[2] && soundPlaying.currentTime()<subsJam02Triggers[3]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[2];
    console.log(subsJam02[2]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[3] && soundPlaying.currentTime()<subsJam02Triggers[4]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = subsJam02[3];
    console.log(subsJam02[3]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[4] && soundPlaying.currentTime()<subsJam02Triggers[5]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[4];
    console.log(subsJam02[4]);
  } 

  else if (soundPlaying.currentTime()>subsJam02Triggers[5] && soundPlaying.currentTime()<subsJam02Triggers[6]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = subsJam02[5];
    console.log(subsJam02[5]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[6] && soundPlaying.currentTime()<subsJam02Triggers[7]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[6];
    console.log(subsJam02[6]);
  } 


  else if (soundPlaying.currentTime()>subsJam02Triggers[7] && soundPlaying.currentTime()<subsJam02Triggers[8]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = subsJam02[7];
    console.log(subsJam02[7]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[8] && soundPlaying.currentTime()<subsJam02Triggers[9]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[8];
    console.log(subsJam02[8]);
  } 


  else if (soundPlaying.currentTime()>subsJam02Triggers[9] && soundPlaying.currentTime()<subsJam02Triggers[10]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = subsJam02[9];
    console.log(subsJam02[9]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[10] && soundPlaying.currentTime()<subsJam02Triggers[11]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[10];
    console.log(subsJam02[10]);
  } 


  else if (soundPlaying.currentTime()>subsJam02Triggers[11] && soundPlaying.currentTime()<subsJam02Triggers[12]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = subsJam02[11];
    console.log(subsJam02[11]);
  } else if (soundPlaying.currentTime()>subsJam02Triggers[12] && soundPlaying.currentTime()<subsJam02Triggers[13]) {
    if (!subsJam02Toggle) {
      clear();
      subsJam02Toggle = true;
    }
    currSub = subsJam02[12];
    console.log(subsJam02[12]);
  }
  
  else if (soundPlaying.currentTime()>subsJam02Triggers[13]) {
    if (subsJam02Toggle) {
      clear();
      subsJam02Toggle = false;
    }
    currSub = "(sigue hacia abajo...)"
  } else if (soundPlaying.currentTime()>subsJam01Triggers[13]+4) {
    if (!subsJam01Toggle) {
      clear();
      subsJam01Toggle = true;
    }
    currSub = ""
  }
  

  
}







function startSubsJam03() {
  if (soundPlaying.currentTime()>subsJam03Triggers[0] && soundPlaying.currentTime()<subsJam03Triggers[1]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[0];
    console.log(subsJam03[0]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[1] && soundPlaying.currentTime()<subsJam03Triggers[2]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[1];
    console.log(subsJam03[1]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[2] && soundPlaying.currentTime()<subsJam03Triggers[3]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[2];
    console.log(subsJam03[2]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[3] && soundPlaying.currentTime()<subsJam03Triggers[4]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[3];
    console.log(subsJam03[3]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[4] && soundPlaying.currentTime()<subsJam03Triggers[5]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[4];
    console.log(subsJam03[4]);
  } 

  else if (soundPlaying.currentTime()>subsJam03Triggers[5] && soundPlaying.currentTime()<subsJam03Triggers[6]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[5];
    console.log(subsJam03[5]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[6] && soundPlaying.currentTime()<subsJam03Triggers[7]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[6];
    console.log(subsJam03[6]);
  } 


  else if (soundPlaying.currentTime()>subsJam03Triggers[7] && soundPlaying.currentTime()<subsJam03Triggers[8]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[7];
    console.log(subsJam03[7]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[8] && soundPlaying.currentTime()<subsJam03Triggers[9]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[8];
    console.log(subsJam03[8]);
  } 


  else if (soundPlaying.currentTime()>subsJam03Triggers[9] && soundPlaying.currentTime()<subsJam03Triggers[10]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[9];
    console.log(subsJam03[9]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[10] && soundPlaying.currentTime()<subsJam03Triggers[11]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[10];
    console.log(subsJam03[10]);
  } 


  else if (soundPlaying.currentTime()>subsJam03Triggers[11] && soundPlaying.currentTime()<subsJam03Triggers[12]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[11];
    console.log(subsJam03[11]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[12] && soundPlaying.currentTime()<subsJam03Triggers[13]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[12];
    console.log(subsJam03[12]);
  }

  else if (soundPlaying.currentTime()>subsJam03Triggers[13] && soundPlaying.currentTime()<subsJam03Triggers[14]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = subsJam03[13];
    console.log(subsJam03[13]);
  } else if (soundPlaying.currentTime()>subsJam03Triggers[14] && soundPlaying.currentTime()<subsJam03Triggers[15]) {
    if (!subsJam03Toggle) {
      clear();
      subsJam03Toggle = true;
    }
    currSub = subsJam03[14];
    console.log(subsJam03[14]);
  } 
  
  else if (soundPlaying.currentTime()>subsJam03Triggers[15]) {
    if (subsJam03Toggle) {
      clear();
      subsJam03Toggle = false;
    }
    currSub = "(sigue hacia abajo...)"
  } else if (soundPlaying.currentTime()>subsJam01Triggers[15]+4) {
    if (!subsJam01Toggle) {
      clear();
      subsJam01Toggle = true;
    }
    currSub = ""
  }
  

  
}

function drawFormText() {
  let yearsString = `Vivió ${yearPetals} años en esta tierra...`;
  console.log("drawing: ",nombreString, yearsString, textInputString);
  fill(255);
  textSize(32);
  text(nombreString, width/2, height*0.70);
  textSize(22);
  text(yearsString, width/2, height*0.80);
  text(textInputString, width/2, height*0.85);
}




function mapCurrentTime(currSound) {
  console.log("playing new sample at:");
  console.log(currSound.currentTime());
}



// function progressBar(currSound) {
//   // let barW = map(soundPlaying.currentTime(), 0, int(currSound.duration()), 100, width-100);
//   let barW = map(soundPlaying.currentTime(), 0, 100, 100, width-100);
//   let barH = 100;
//   fill("yellow");
//   rect(100, height-100, barW, barH)
//   // soundPlaying

// }




function mousePressed() {
  // x = mouseX;
  // y = mouseY;
  // clear();
}


function replaceText() {
  // coreoSteps.hide();
  // console.log(coreoSteps);
  for (let i = 0; i < coreoSteps.length; i++) {
    // coreoSteps.removeClass("is-active");
    // coreoSteps.addClass("faded");
  coreoSteps[i].hide();
}
  form.removeClass("is-active");
  form.addClass("faded");

  letters = textInput.value();
  console.log(letters);

  nombreString = nombre.value();
  nacioString = nacio.value();
  murioString = murio.value();
  textInputString = textInput.value();

  console.log(nombreString);
  console.log(nacioString);
  console.log(murioString);
  console.log(textInputString);

  yearPetals = int(murioString) - int(nacioString);
  console.log(`Vivió ${yearPetals} años en esta tierra...`)

  // return false;

}


function drawTextMousePath() {
  console.log("drawing");
  var d = dist(x, y, mouseX, mouseY);
  textSize(fontSizeMin + d / 2);
  var newLetter = letters.charAt(counter);
  stepSize = textWidth(newLetter);

  if (d > stepSize) {
    var angle = atan2(mouseY - y, mouseX - x);

    push();
    translate(x, y);
    rotate(angle + random(angleDistortion));
    text(newLetter, 0, 0);
    pop();

    counter++;
    if (counter >= letters.length) counter = 0;

    x = x + cos(angle) * stepSize;
    y = y + sin(angle) * stepSize;
  }
}

// function keyReleased() {
//   if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
//   if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
// }

// function keyPressed() {
//   // angleDistortion ctrls arrowkeys up/down
//   if (keyCode == UP_ARROW) angleDistortion += 0.1;
//   if (keyCode == DOWN_ARROW) angleDistortion -= 0.1;
// }


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}