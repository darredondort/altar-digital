/* Based on Daniel Shiffman's Nature of Code: https://github.com/nature-of-code/noc-examples-p5.js
and its port to ThreeJS by @playgrdstar: https://medium.com/creative-coding-space/generative-coding-the-nature-of-code-ported-to-three-js-629b9724c02e
*/

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; 

function initScene() {  
  // colors array
  let colors = ["#E7C045", '#E37E05', '#F74000', '#7A946E', '#2C3143'];

  // camera, scene & renderer intial settings
  let boundary = 1000;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 30000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1500;    

  // set lights
  // let light1 = new THREE.DirectionalLight(0x12BAB6, 1.5);
  let light1 = new THREE.DirectionalLight(0xffffff, 2);
  light1.position.y = 10;
  scene.add(light1);

  let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  // let light2 = new THREE.DirectionalLight(0x12BAB6, 0.5);
  light2.position.set(-10,-10,10);
  scene.add(light2); 
  
  let light3 = new THREE.DirectionalLight(colors[0], 0.5);
  light3.position.set(-10,-50,10);
  scene.add(light3);  
  
  let light4 = new THREE.DirectionalLight(colors[1], 1.5);
  light4.position.set(50,-50,10);
  scene.add(light4);

  // scene.background = new THREE.Color( 0xefd1b5 );
	scene.fog = new THREE.FogExp2( 0x000000, 0, -boundary);

  // set scene div and renderer
  let renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  const sceneCont  = document.getElementById('sceneCont');
  sceneCont.appendChild( renderer.domElement );

  // // set camera orbit controls
  // let orbit =  new OrbitControls( camera, renderer.domElement );
  // orbit.enableZoom = false;
  // orbit.minDistance = 500;
  // orbit.maxDistance = 2000;


  // get video element (mp4) & disable display
  let vidCor = document.getElementById("vidCor");
  vidCor.disabled = true;
  vidCor.loop = false;
  // vidCor.disabled = true;



  // create new video element
  const videoOut = document.createElement('video');
  videoOut.setAttribute('width', 1920);
  videoOut.setAttribute('height', 1080);  
  videoOut.autoplay = true;

  // create video & webcam divs
  const vidDiv = document.getElementById('videoCont');
  const camDiv = document.getElementById('camVid');

  // camDiv.appendChild(vidCor);
  vidDiv.appendChild(vidCor);


  
  // stream webcam for display
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(function (stream) {
    videoOut.srcObject = stream;
  }).catch(function (err) {
    console.log("An error occurred! " + err);
  });

  // initialise mover attractors
  let attractors = [];
  let grAttractors = new THREE.Group();
  scene.add( grAttractors );

  // initialise mouse attractors
  let mouse = new THREE.Vector2();
  let mouseAttractor = new Attractor(Math.random()*boundary, boundary, boundary/1.5, 200, 25);
  // let mouseAttractorOp = new Attractor(Math.random()*boundary, boundary, 1000, 50, 15);
  mouseAttractor.initialise();
  // mouseAttractorOp.initialise();
  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster.setFromCamera( mouse.clone(), camera );   
    // raycaster.setFromCamera( mouse.clone(), camera );   
    mouseAttractor.position.x = THREE.Math.mapLinear( mouse.x, -1, 1, -boundary, boundary );
    mouseAttractor.position.y = THREE.Math.mapLinear( mouse.y, -1, 1, -boundary, boundary );

    // mouseAttractorOp.position.x = THREE.Math.mapLinear( mouse.x, -1, 1, boundary, -boundary );
    // mouseAttractorOp.position.y = THREE.Math.mapLinear( mouse.y, -1, 1, boundary, -boundary );
    // console.log(mouse.x,mouse.y)
    mouseAttractor.update();
    mouseAttractor.display();

    // mouseAttractorOp.update();
    // mouseAttractorOp.display();
  }
  document.addEventListener( 'mousemove', onDocumentMouseMove );

  // create particle sprites (geometry + texture + pMaterial + vectors)
  let cloud;
  // let mouseCloud;
  let mouseGeom = new THREE.Geometry();
  let geom = new THREE.Geometry();
  let texture = new THREE.TextureLoader().load( "img/texture_particle_05.png" );
  let pMaterial = new THREE.PointsMaterial({
      size: 8,
      transparent: false,
      alphaTest: 0.5,
      depthWrite: false,
      opacity: 0,
      map: texture,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      color: "#F9DF88",
      lights: true
  });
  for (let i = 0; i < 1; i++) {
      let particle = new THREE.Vector3(THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(0, boundary));
      mouseGeom.vertices.push(particle);
  }  
  for (let i = 0; i <20000; i++) {
      let particle = new THREE.Vector3(THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(0, boundary));
      geom.vertices.push(particle);
  }
  // create point cloud with stored vertices and material. Add to scene.
  // mouseCloud = new THREE.Points(mouseGeom, pMaterial);
  cloud = new THREE.Points(geom, pMaterial);

  // scene.add(mouseCloud);
  scene.add(cloud);

  // create new Cloud for particle physics system, initialise particle forces
  let cloudSystem = new Cloud(cloud);
  cloudSystem.initialise();

  // let mouseCloudSystem = new Cloud(mouseCloud);
  // mouseCloudSystem.initialise();

  // set other forces
  // let windLeft = new THREE.Vector3(-0.01,0.0,0.0);
  // let windRight = new THREE.Vector3(0.01,0.0,0.0);
  let windIn = new THREE.Vector3(0,0.0,-0.05);
  let windOut = new THREE.Vector3(0,0.0,0.08);
  let gravityUp = new THREE.Vector3(0.0,-0.05,0);
  let gravityDown = new THREE.Vector3(0.0,0.05,0);


  // petals settings
  // let numPetals = 80;
  let petalsCreated = false;
  let numPetals;
  let petals = [];
  let petalsCont = new THREE.Object3D();
  let petalsAttractor;
  let petalPoints = [];
  for ( let i = 0; i < 10; i ++ ) {
    petalPoints.push( new THREE.Vector2( Math.sin( i * -0.2 ) * 30 + 5, ( i - 1 ) *  4) );
  }
  let petalGeom = new THREE.LatheGeometry( petalPoints );
  // create petal meshes
  // createPetals();
  // let petalGeom = new THREE.BoxBufferGeometry(30,60,30);
  // let petalGeom = new THREE.SphereBufferGeometry(35,3,4);

  function mouseAttractOff() {
    mouseAttractor.mass = 0;
    // mouseAttractorOp.mass = 0;
    mouseAttractor.position.z = boundary*100;
    // mouseAttractorOp.position.z = boundary*100;
  }

 
  // loop render function
  let render = function () {
    // orbit.update();  

    // loop through all attractors
    for (let i = 0; i < attractors.length; i++) {
      if (attractors[i]) {
        attractors[i].update();
        attractors[i].display();
      }

      // attract particle system to attractors
      cloudSystem.attract(attractors[i]);
      // mouseCloudSystem.attract(attractors[i]);
    }

    // apply forces to particle system and update vertices
    cloud.geometry.verticesNeedUpdate = true;
    cloudSystem.applyForce(gravityUp);
    cloudSystem.applyForce(gravityDown);
    cloudSystem.applyForce(windOut);
    cloudSystem.applyForce(windIn);

    // mouseCloud.geometry.verticesNeedUpdate = true;
    // mouseCloudSystem.applyForce(gravityUp);
    // mouseCloudSystem.applyForce(gravityDown);
    // mouseCloudSystem.applyForce(windOut);
    // mouseCloudSystem.applyForce(windIn);

    if (partsOn && pMaterial.opacity < 0.75) {
      pMaterial.opacity +=0.01;
    } else if (!partsOn && pMaterial.opacity > 0) {
      pMaterial.opacity -= 0.1;
    }

    if(coreoOn) {
      vidCor.loop = false;
      vidCor.play();
      // mouseCloudSystem.attract(mouseAttractorOp);
      cloudSystem.attract(mouseAttractor);
    }

    if (formOn) {
      // formOn = false;
    }

    if (jamOn) {
      vidCor.currentTime = 0;
      vidCor.disabled = true;

 
      for (let i = 0; i < attractors.length; i++) {
        attractors[i].position.z = camera.position.z - 750;
      }


      mouseAttractor.position.z = camera.position.z - 780;


      let webcamAdded = false;
      if (!webcamAdded) {
        camVid.appendChild(videoOut); // display video input
        camVid.style.opacity = 1;
        vidDiv.style.opacity = 0;
        webcamAdded = true;
      }
    }

    if (jam01On) {
      cloudSystem.attract(mouseAttractor);

      if (camera.position.z > 1300 ) {
        camera.position.z -= 0.3;

        // console.log("camera.position.z", camera.position.z)
      }
    }

    if (jam02On) {
      if (camera.position.z < 1500 ) {
        camera.position.z += 7;
        // console.log("camera.position.z", camera.position.z)
      }
    }


    if (jam03On) {
      cloudSystem.attract(mouseAttractor);

      if (!petalsCreated) {
        // console.log("petalsCreated")
        createPetals();
        petalsCreated = true;
      }
      if (camera.position.z > 1200 ) {
        camera.position.z -= 0.8;
        // camera.rotation.y -= 2;
        // console.log("camera.position.z", camera.position.z)
      } else if (camera.position.z > 1000) {
        camera.position.z -= 0.04;
        // camera.rotation.y -= 2;
        // console.log("camera.position.z", camera.position.z)
      
      }

      // let jam03Added = false;
      // if (!jam03Added) {
      //   let vidJam03Src = document.getElementById( 'vidJam03' );
      //   vidJam03Src.play();
      //   let jam03texture = new THREE.VideoTexture( vidJam03Src );
      //   // jam01texture.minFilter = THREE.LinearFilter;
      //   // jam01texture.magFilter = THREE.LinearFilter;
      //   jam03texture.format = THREE.RGBFormat;
      //   planeMaterial.map = jam03texture;

      //   // light1.color = 0xE3BF7A;
      //   jam03Added = true;
      // }
    }



    if (transOn) {

      if (camera.position.z < 1500 ) {
        camera.position.z += 2;
        // console.log("camera.position.z", camera.position.z)
      }
      let petalsAdded = false;
      if (!petalsAdded) {
        scene.add(petalsCont);
        petalsAdded = true;
      }
      animatePetals();
      attractToPetals();

    }

    if (altarOn) {
 
      for (let i = 0; i < attractors.length; i++) {
        attractors[i].position.z = camera.position.z - 750;
        attractors[i].position.mass = 1;
      }
      if (camera.position.z < 1500 ) {
        camera.position.z += 4;
        // console.log("camera.position.z", camera.position.z)
      }
      camVid.style.opacity = 1;


    }

    // mouseCloudSystem.update();
    // mouseCloudSystem.checkEdges();

    cloudSystem.update();
    cloudSystem.checkEdges();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  };

  // threejs window resize function
  window.addEventListener( 'resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );
  
  render();
  
  // orbit.addEventListener('change', onPositionChange);
  
  // function onPositionChange(o) {
  //   console.log("position changed in object");
  //   console.log(camera.position.x, camera.position.y, camera.position.z);
  //   console.log(o);
  // }

  function Attractor(x,y,z,r,m) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.r = r;
      this.mass = m;
      // set max/min velocity
      this.max = new THREE.Vector3(30,30,30);
      this.min = new THREE.Vector3(-30,-30,-30);

      // create particle mesh (geometry + material)
      let geometry = new THREE.SphereGeometry(this.r,5,25);

      let material =  new THREE.MeshToonMaterial( { flatShading: false, color: colors[0], transparent: true, opacity: 0 } );

      let sphere = new THREE.Mesh(geometry, material);
      grAttractors.add(sphere);

      this.initialise = function() {
          this.position = new THREE.Vector3(this.x,this.y,this.z);
          this.velocity = new THREE.Vector3();
          this.acceleration = new THREE.Vector3();              
      }

      this.display = function(){
          sphere.position.x = this.position.x;
          sphere.position.y = this.position.y;
          sphere.position.z = this.position.z;
          // console.log(sphere.position);
      }

      this.applyForce = function(force){
          let tempForce = force.clone();
          let f = tempForce.divideScalar(this.mass);
          this.acceleration.add(f);
      }

      this.update = function() {
          this.velocity.add(this.acceleration);
          this.velocity.clamp(this.min, this.max);
          this.position.add(this.velocity);
          this.acceleration.multiplyScalar(0);
      }
  }

  function Cloud(cloudGroup) {
    this.vertices = cloudGroup.geometry.vertices;
    this.max = new THREE.Vector3(3,3,3);
    this.min = new THREE.Vector3(-3,-3,-3);
    this.velocities = [];
    this.accelerations = [];
    this.mass = 20;
    
    this.initialise = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        let velocity = new THREE.Vector3();
        this.velocities.push(velocity);
        let acceleration = new THREE.Vector3();  
        this.accelerations.push(acceleration);
      }            
    }

    this.applyForce = function(force) {
      let tempForce = force.clone();
      let f = tempForce.divideScalar(this.mass);
      for (let i = 0; i < this.vertices.length; i++) {
        this.accelerations[i].add(f);
      }
    }

    this.update = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        this.velocities[i].add(this.accelerations[i]);
        this.velocities[i].clamp(this.min, this.max);
        this.vertices[i].add(this.velocities[i]);
        this.accelerations[i].multiplyScalar(0);
      }
    }

    this.checkEdges = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].x > boundary){
            this.vertices[i].x = boundary;
            this.velocities[i].x *= -1;
        }
        else if (this.vertices[i].x < -boundary){
            this.vertices[i].x = -boundary;
            this.velocities[i].x *= -1;
        }

        if (this.vertices[i].y > boundary){
           this.vertices[i].y = boundary;
            this.velocities[i].y *= -1;
        }
        else if (this.vertices[i].y < -boundary/2){
          this.vertices[i].y = -boundary/2;
          this.velocities[i].y *= -1;
        }

        if (this.vertices[i].z > boundary*1.15){
          this.vertices[i].z = boundary*1.15;
          this.velocities[i].z *= -1;
        }
        else if (this.vertices[i].z < -boundary/2){
          this.vertices[i].z = -boundary/2;
          this.velocities[i].z *= -1;
        }                      
      }
    }
        
    this.attract = function(m) {
      for (let i = 0; i < this.vertices.length; i++) {
            let tempVert = this.vertices[i].clone();
            let tempPos = m.position.clone();
            let aForce = tempPos.sub(tempVert);
            // let distance = Math.max(aForce.length()+25,25);
            // let distance = Math.max(aForce.length()+55,55);
            let distance = Math.max(aForce.length()+25,25);
            aForce.normalize();
            let strength = 0.8*(this.mass*this.mass)/(distance*distance);
            aForce.multiplyScalar(strength);
            this.accelerations[i].add(aForce);


        }
      }
  }
  
  // define create and animate petals functions
  function createPetals() {
    // get petals number from global variable
    // numPetals = yearPetals;
    // if(typeof parseInt(yearPetals) == 'number') {
    if(Number(yearPetals) > 0 && Number(yearPetals) < 100) {
      // console.log("yearPetals",yearPetals)
      // console.log("mapped years to petals")
      numPetals = yearPetals;
      // numPetals = parseInt(THREE.Math.mapLinear( yearPetals, 1, 100, 1, 100 ));
    } else {
      // console.log("mapped default petals")
      numPetals = 50;
    }
    // draw petals
    let petalMaterial =  new THREE.MeshPhongMaterial( { shininess: 15, flatShading: false, transparent: true, opacity: 0, color: colors[0], wireframe: false} );
    for (let i = 0; i < numPetals; i++) {    
      let petal = new THREE.Mesh(petalGeom, petalMaterial);
      // petal.rotation.x = 10 * Math.sin(i);
      // // petal.rotation.y = 10 * Math.cos(i);    
      // petal.rotation.z = 0.1 * Math.cos(i);

      petal.rotation.x = 10 * Math.sin(i);
      // petal.rotation.y = 10 * Math.cos(i);    
      petal.rotation.z = 10 * Math.cos(i);
      
      // petal.position.x = 20 * Math.sin(i);
      // petal.scale.set( 2 * Math.sin(i), 2 * Math.sin(i), 2 * Math.sin(i) );

      // petal.geometry.scale(100 * Math.cos(i),10 * Math.cos(i),10 * Math.cos(i));
      // petal.scale(2,2,2);

      petal.speedX = 0;
      petal.speedY = 0;
      petal.speedZ = 0.001;    
      // petal.speedX = Math.random() * 0.001 - 0.0001;
      // petal.speedY = Math.random() * 0.001 - 0.0001;
      // petal.speedZ = Math.random() * 0.001 - 0.0001;
      petal.castShadow = true;
      petal.receiveShadow = true;
      petal.material.opacity = 0;
      
      petals.push(petal);
      petalsCont.add(petal);
    }
    petalsCont.position.z = 1350;
    petalsCont.position.x = 0;
    petalsCont.position.y = 5;
    // petalsAttractor = new Attractor(boundary, boundary/1.1, boundary/1.1, 60, 1000);
    petalsAttractor = new Attractor(0, 0, 1350, 200, 20);
    petalsAttractor.initialise();
  }
  function animatePetals() {
    // console.log("animando");
    for (let i = 0; i < numPetals; i++) {
      // petals[i].rotation.x += petals[i].speedX*1.2;
      // petals[i].rotation.y += petals[i].speedY*1.2;
      // petals[i].rotation.z += petals[i].speedZ*1.2;
      
      petals[i].rotation.z += petals[i].speedZ*THREE.Math.randInt(0.1, 10);

      
      if ( petals[i].material.opacity < 0.70 ) {
        petals[i].material.opacity += 0.0055;
      }

    }
    // scene.rotation.y -= 0.05;
    // camera.rotation.y -= 0.05;
    petalsCont.rotation.y += 0.005;
  }

  function attractToPetals() {
    cloudSystem.attract(petalsAttractor);
    // mouseCloudSystem.attract(petalsAttractor);
  }
}



// once everything is loaded, run
window.onload = initScene;
