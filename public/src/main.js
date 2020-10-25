// d3 for selections
let main = d3.select("main");
let scrolly = main.select("#scrolly");
//  let figure = scrolly.select("figure");
let article = scrolly.select("article");
let step = article.selectAll(".step");

// let button = document.getElementById("form-button");
// let nombre = document.getElementById("nombre");
// let nacio = document.getElementById("nacio");
// let murio = document.getElementById("murio");

let introOn = false;
let partsOn = false;
let coreoOn = false;
let formOn = false;
let jamOn = false;
let altarOn = false;
let transOn = false;

let jam01On;
let jam02On;
let jam03On;


// if ( nombre.value && nacio.value && murio.value ) {
//   button.disabled = false;
//   console.log(nombre.value, nacio.value, murio.value)
// } 

// initialize the scrollama
let scroller = scrollama();

// generic window resize listener event
function handleResize() {
  let stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

//  let figureHeight = window.innerHeight / 2;
//  let figureMarginTop = (window.innerHeight - figureHeight) / 2;
//  figure
//    .style("height", figureHeight + "px")
//    .style("top", figureMarginTop + "px");

  scroller.resize();
}

 // scrollama event handlers
 function handleStepEnter(response) {
   console.log(response);
   // response = { element, direction, index }

   if (response.index == 0) {
    introOn = true;
    coreoOn = false;
    formOn = false;
    console.log("introOn");
   }


   if (response.index >0 && !coreoOn) {
    partsOn = true;

   } 
  //  else if (response.index == 4 && coreoOn) {
  //   partsOn = false;
  //  } 

   if (response.index == 1) {
    introOn = false;
    coreoOn = true;
    formOn = false;
    partsOn = true;
    jamOn = false;
    console.log("coreoOn");
    console.log(coreoOn);
    jam01On = false;
    jam02On = false;
    jam03On = false;
    
    console.log("coreoOn");
   }
  
   if (response.index == 4) {
    introOn = false;
    coreoOn = false;
    formOn = true;
    partsOn = false;
    jamOn = true;
    console.log("formOn");
    console.log(formOn);
    jam01On = false;
    jam02On = false;
    jam03On = false;
    console.log("jam01On")
   }

  // if (response.index === 5 || response.index === 6 || response.index === 7 ) {
  //     coreoOn = false;
  //     partsOn = true;
  //     jamOn = true;
  //     console.log("jamOn")
  // }

  if (response.index === 5 ) {
    introOn = false;
    coreoOn = false;
    formOn = false;
    partsOn = true;
    jamOn = true;
    console.log("jamOn")
    jam01On = true;
    jam02On = false;
    jam03On = false;
    console.log("jam01On")
  }
  if (response.index === 6 ) {
    introOn = false;
    coreoOn = false;
    formOn = false;
    partsOn = true;
    jamOn = true;
    console.log("jamOn")
    jam01On = false;
    jam02On = true;
    jam03On = false;
    console.log("jam02On")
  }
  if (response.index === 7 ) {
    introOn = false;
    coreoOn = false;
    formOn = false;
    partsOn = true;
    jamOn = true;
    console.log("jamOn")
    jam01On = false;
    jam02On = false;
    jam03On = true;
    console.log("jam03On")
  }


  if (response.index === 8 ) {
      introOn = false;
      coreoOn = false;
      formOn = false;
      jam01On = false;
      jam02On = false;
      jam03On = false;

      transOn = true;
      partsOn = true;
      console.log("transOn")
  }

  if (response.index === 9 ) {
      introOn = false;
      coreoOn = false;
      formOn = false;
      altarOn = true;
      partsOn = true;
      console.log("petalsOn")
  }

  if (response.direction == "down") {
    // add color to current step
    step.classed("is-active", function (d, i) {
      return i === response.index;
    });
  }

   // update graphic based on step
  //  figure.select("p").text(response.index + 1);
  //  figure.select("p").text(textos[response.index]);
 }

 function setupStickyfill() {
   d3.selectAll(".sticky").each(function() {
     Stickyfill.add(this);
   });
 }

 function init() {
   setupStickyfill();
   handleResize();

   scroller
     .setup({
       step: "#scrolly article .step",
       offset: 0.65,
       debug: false
     })
     .onStepEnter(handleStepEnter);

   // setup resize event
   window.addEventListener("resize", handleResize);
 }

 // run script
 init();
