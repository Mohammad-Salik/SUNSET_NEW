document.addEventListener( 'keypress', onDocumentKeyPress, false );

// misc
let scene, camera, renderer;

//ORBIT CONTROLS
let controls;

// walls variables
let meshWallLeft, meshWallRight, meshWallFrontLeft, meshWallFrontRight, meshWallBack, meshRoomFloor,
   meshWallFrontBottom, meshWallFrontMiddle, meshWallFrontTop, meshRoomRoof, meshFloor;

// apartment variable
let apartmentBottom, apartmentTop, apartmentLeft, apartmentLeftBottom, apartmentMiddle;

// models variables
let meshBed, meshDoor, meshDresser, meshWindow, meshDresserSecond, meshbulb, meshBall, curtainLeft, curtainRight,
   meshPillowLeft, meshPillowRight, meshPillowBottom, meshPillowTop, meshPainting, meshNetflix, meshCarpet,
   meshMirror;

// light variables
let directionalLight, lighthelper, ambientLight, light, spotLight, reflectionCamera;
let lightRising = false;

// load all scene lights
function loadPointLight(){

   // ambient 
   ambientLight = new THREE.AmbientLight(0x404040);
   scene.add(ambientLight);

   // spotlight
   spotLight = new THREE.SpotLight( 0xFFA500 , 0.8);
   spotLight.target.position.set( 0, 0, 0 );
   spotLight.castShadow = true;
   scene.add( spotLight.target );
   scene.add( spotLight );
   spotLight.shadow.mapSize.width = 512; 
   spotLight.shadow.mapSize.height = 512; 
   spotLight.shadow.camera.near = 0.5;
   spotLight.shadow.camera.far = 15000;
   spotLight.position.set(6, -33, -72);
   scene.add(spotLight);

   // point light
   light = new THREE.PointLight(0xffffff, 2, 18);
   light.position.set(-9, 9, -2);
   light.castShadow = true;
   light.shadow.camera.near = 0.1;
   light.shadow.camera.far = 25;
   lighthelper = new THREE.PointLightHelper(spotLight);
   scene.add(light, lighthelper);

   // directional light code
   // directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6 );
   // directionalLight.castShadow = true;
   // directionalLight.position.set(12, 3, -56);
   // scene.add( directionalLight );
   // lighthelper = new THREE.DirectionalLightHelper(directionalLight);
   // scene.add(lighthelper);
}
 
function init(){

   scene = new THREE.Scene();
   scene.background = (new THREE.TextureLoader().load( 'assets/textures/background.jpg' ));
   scene.fog = new THREE.Fog(0x33aaff, 10, 500);

   loadCamera();
   loadWalls();
   loadModels();
   loadPointLight();
   loadFloor();   
   loadRenderer();

   //ORBIT CONTROLS
   controls = new THREE.OrbitControls (camera, renderer.domElement);
   controls.target.set( 0, 5, 0);
   animate();
}
 
// function to animate put movements here
function animate(){
   reflectionCamera.update(renderer, scene);
   if (lightRising == true){
      if (spotLight.position.y == 50){
         lightRising = false;
      }
      else{ 
         spotLight.position.y += 0.5; 
         ambientLight.intensity += 0.01
         curtainLeft.position.x += 0.01;
      }
   }if (lightRising == false){
      if (spotLight.position.y == -100){
         lightRising = true;
      }
      else{ 
         spotLight.position.y += -0.5;  
         ambientLight.intensity -= 0.01
         curtainLeft.position.x -= 0.01;
      }
   }

   //ORBIT CONTROLS
   controls.update();
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
}

// floor options
function loadFloor(){
   let textureFloor = new THREE.TextureLoader().load( 'assets/textures/grass.jpg' );
   let materialFloor = new THREE.MeshLambertMaterial( { map: textureFloor } );
   meshFloor = new THREE.Mesh( new THREE.CircleBufferGeometry(70, 24), materialFloor);
   meshFloor.receiveShadow = true;
   meshFloor.rotation.x -= Math.PI / 2;
   meshFloor.position.set(0, -30, 0);
   scene.add(meshFloor);
}

// camera options
function loadCamera(){
   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 5000 );
   camera.position.set(0, 3, 0);
   reflectionCamera = new THREE.CubeCamera(1, 1000, 128);
}

// renderer options
function loadRenderer(){
   renderer = new THREE.WebGLRenderer();
   renderer.setSize( window.innerWidth, window.innerHeight );
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.BasicShadowMap;
   document.body.appendChild(renderer.domElement);
   lighthelper.update();
}

// loading 3d models
function loadModels(){
   let textureBed = new THREE.TextureLoader().load( 'assets/textures/bed.jpg' );
   let textureDoor = new THREE.TextureLoader().load( 'assets/textures/door.jpg' );
   let textureDresser = new THREE.TextureLoader().load( 'assets/textures/dresser.jpg' );
   let textureDresserSecond = new THREE.TextureLoader().load( 'assets/textures/dresser2.jpg' );
   let textureCurtain = new THREE.TextureLoader().load( 'assets/textures/curtain.jpg' );
   let texturePortrait = new THREE.TextureLoader().load( 'assets/textures/overlay.jpg' );
   let textureNetflix = new THREE.TextureLoader().load( 'assets/textures/netflix.jpg' );
   let textureCarpet = new THREE.TextureLoader().load( 'assets/textures/carpet.jpg' );

   let materialCarpet = new THREE.MeshLambertMaterial( { map: textureCarpet } );
   let materialNetflix = new THREE.MeshStandardMaterial( { map: textureNetflix } );
   let materialPortrait = new THREE.MeshLambertMaterial( { map: texturePortrait } );
   let materialBed = new THREE.MeshLambertMaterial( { map: textureBed } );
   let materialDoor = new THREE.MeshLambertMaterial( { map: textureDoor } );
   let materialCurtain = new THREE.MeshLambertMaterial( { map: textureCurtain, transparent: true } );
   materialCurtain.opacity = 0.4;

   let materialDresser = new THREE.MeshStandardMaterial( { map: textureDresser } );
   let materialDresserSecond = new THREE.MeshStandardMaterial( { map: textureDresserSecond } );

   let materialBall = new THREE.MeshPhongMaterial( { color: 0x0087E6, shininess: 100 } );
   let materialBulb = new THREE.MeshPhongMaterial( { color: 0xFFFF00, shininess: 100, transparent: true} );
   materialBulb.opacity = 0.2;
   
   let materialReflection = new THREE.MeshPhongMaterial({shininess: 50, color: 0xffffff, specular: 0xffffff, envMap: reflectionCamera.renderTarget.texture});

   meshBed = new THREE.Mesh( new THREE.BoxBufferGeometry(8, 12, 2), materialBed);
   meshBed.castShadow = true; meshBed.receiveShadow = true;
   meshBed.rotation.x -= Math.PI / 2; meshBed.rotation.z -= Math.PI / 2;
   meshBed.position.set(8, 2, 5);



   meshDoor = new THREE.Mesh( new THREE.BoxBufferGeometry(4.5, 8.5, 1), materialDoor);
   meshDoor.castShadow = true; meshDoor.receiveShadow = true;
   meshDoor.position.set(14.5, 4, -7); meshDoor.rotation.y -= Math.PI / 2;

   curtainLeft = new THREE.Mesh( new THREE.BoxBufferGeometry(4.5, 8.5, 1), materialCurtain);
   curtainLeft.castShadow = true; curtainLeft.receiveShadow = true;
   curtainLeft.position.set(-6, 6, -14); 

   curtainRight = new THREE.Mesh( new THREE.BoxBufferGeometry(4.5, 8.5, 1), materialCurtain);
   curtainRight.castShadow = true; curtainRight.receiveShadow = true;
   curtainRight.position.set(8, 6, -14); 


   meshDresser = new THREE.Mesh( new THREE.BoxBufferGeometry(8, 8, 2), materialDresser);
   meshDresser.castShadow = true; meshDresser.receiveShadow = true;
   meshDresser.rotation.y -= Math.PI / 2; 
   meshDresser.position.set(-13, 4, 8.5);

   meshDresserSecond = new THREE.Mesh( new THREE.BoxBufferGeometry(12, 3, 4), materialDresserSecond);
   meshDresserSecond.castShadow = true; meshDresserSecond.receiveShadow = true;
   meshDresserSecond.rotation.y -= Math.PI / 2; 
   meshDresserSecond.position.set(-12.5, 2, -2.4)

   meshBall = new THREE.Mesh( new THREE.SphereBufferGeometry(2, 12, 8), materialBall);
   meshBall.castShadow = true; meshBall.receiveShadow = true;
   meshBall.rotation.y -= Math.PI / 2; 
   meshBall.position.set(3.5, 1, -0.4);

   meshPillowLeft = new THREE.Mesh( new THREE.DodecahedronBufferGeometry(2), materialBed);
   meshPillowLeft.castShadow = true; meshPillowLeft.receiveShadow = true;
   meshPillowLeft.position.set(14, 3, 2);

   meshPillowRight = new THREE.Mesh( new THREE.DodecahedronBufferGeometry(2), materialBed);
   meshPillowRight.castShadow = true; meshPillowRight.receiveShadow = true;
   meshPillowRight.position.set(12, 2, 4);

   meshPillowTop = new THREE.Mesh( new THREE.DodecahedronBufferGeometry(2), materialBed);
   meshPillowTop.castShadow = true; meshPillowTop.receiveShadow = true;
   meshPillowTop.position.set(14, 4, 6);

   meshPillowBottom = new THREE.Mesh( new THREE.DodecahedronBufferGeometry(2), materialBed);
   meshPillowBottom.castShadow = true; meshPillowBottom.receiveShadow = true;
   meshPillowBottom.position.set(12, 2, 6);
   
   meshbulb = new THREE.Mesh( new THREE.BoxBufferGeometry(0.5, 0.5, 5), materialBulb);
   meshPillowBottom.castShadow = true; meshPillowBottom.receiveShadow = true;
   meshbulb.position.set(-14, 8, -2);

   meshPainting = new THREE.Mesh( new THREE.BoxBufferGeometry(5, 3, 0.5), materialPortrait);
   meshPainting.castShadow = true; meshPillowBottom.receiveShadow = true;
   meshPainting.position.set(8, 6, 14);

   meshMirror = new THREE.Mesh( new THREE.BoxBufferGeometry(12, 7, 0.5), materialReflection);
   meshMirror.castShadow = true; meshMirror.receiveShadow = true;
   meshMirror.position.set(-5, 5, 14);

   meshNetflix = new THREE.Mesh( new THREE.BoxBufferGeometry(0.2, 5, 7), materialNetflix);
   meshNetflix.castShadow = true; meshNetflix.receiveShadow = false;
   meshNetflix.position.set(-12, 6, -2);

   meshCarpet = new THREE.Mesh( new THREE.BoxBufferGeometry(8, 0.2, 15), materialCarpet);
   meshCarpet.castShadow = true; meshCarpet.receiveShadow = true;
   meshCarpet.position.set(-4, 0.5, 0);

   scene.add(meshBed, meshDoor, meshDresser, meshDresserSecond, meshbulb, meshBall, curtainLeft, curtainRight,
      meshPillowLeft, meshPillowRight, meshPillowBottom, meshPillowTop, meshPainting, meshNetflix, meshCarpet,
      meshMirror);
}

//debugging
function getMe(){
   return meshMirror;
}

// load room walls
function loadWalls(){
   let textureWalls = new THREE.TextureLoader().load( 'assets/textures/walls.jpg' );
   let textureRoomFloor = new THREE.TextureLoader().load( 'assets/textures/floor_wood.jpg' );
   let textureRoomRoof = new THREE.TextureLoader().load( 'assets/textures/marble.jpg' );
   let textureApartment = new THREE.TextureLoader().load( 'assets/textures/apartment.jpg' );
   let materialApartment = new THREE.MeshLambertMaterial( { map: textureApartment } );
   let materialRoomFloor = new THREE.MeshLambertMaterial( { map: textureRoomFloor } );
   let materialWalls = new THREE.MeshLambertMaterial( { map: textureWalls } );
   let materialRoof = new THREE.MeshLambertMaterial( { map: textureRoomRoof } );

   apartmentBottom = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 30, 30), materialApartment);
   apartmentBottom.castShadow = true; apartmentBottom.receiveShadow = true;
   apartmentBottom.position.set(0, 25, 0);
   apartmentTop = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 30, 30), materialApartment);
   apartmentTop.castShadow = true; apartmentTop.receiveShadow = true;
   apartmentTop.position.set(0, -15, 0);

   apartmentTop = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 30, 30), materialApartment);
   apartmentTop.castShadow = true; apartmentTop.receiveShadow = true;
   apartmentTop.position.set(0, -15, 0);

   apartmentLeftTop = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 30, 30), materialApartment);
   apartmentLeftTop.castShadow = true; apartmentLeftTop.receiveShadow = true;
   apartmentLeftTop.position.set(30, 15, 0);

   apartmentLeftBottom = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 30, 30), materialApartment);
   apartmentLeftBottom.castShadow = true; apartmentLeftBottom.receiveShadow = true;
   apartmentLeftBottom.position.set(30, -15, 0);

   apartmentMiddle = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 20, 30), materialApartment);
   apartmentMiddle.castShadow = true; apartmentMiddle.receiveShadow = true;
   apartmentMiddle.position.set(30, 39, 0);

   scene.add(apartmentBottom, apartmentTop, apartmentLeftTop, apartmentLeftBottom, apartmentMiddle);

   meshWallLeft = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 10), materialWalls);
   meshWallLeft.castShadow = true; meshWallLeft.receiveShadow = true;
   meshWallLeft.rotation.x -= Math.PI / 2;
   meshWallLeft.position.set(0, 5, 15);
   meshWallRight = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 10), materialWalls);
   meshWallRight.castShadow = true; meshWallRight.receiveShadow = true;
   meshWallRight.rotation.x -= Math.PI / 2;  meshWallRight.rotation.z -= Math.PI / 2;
   meshWallRight.position.set(15, 5, 0);
   meshWallBack = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 10), materialWalls);
   meshWallBack.castShadow = true; meshWallBack.receiveShadow = true;
   meshWallBack.rotation.x -= Math.PI / 2;  meshWallBack.rotation.z -= Math.PI / 2;
   meshWallBack.position.set(-15, 5, 0);
   
   meshWallFrontLeft = new THREE.Mesh( new THREE.BoxBufferGeometry(10, 1, 10), materialWalls);
   meshWallFrontLeft.castShadow = true; meshWallFrontLeft.receiveShadow = true;
   meshWallFrontLeft.rotation.x -= Math.PI / 2; 
   meshWallFrontLeft.position.set(-10, 5, -15);

   meshWallFrontRight = new THREE.Mesh( new THREE.BoxBufferGeometry(5, 1, 10), materialWalls);
   meshWallFrontRight.castShadow = true; meshWallFrontRight.receiveShadow = true;
   meshWallFrontRight.rotation.x -= Math.PI / 2; 
   meshWallFrontRight.position.set(12, 5, -15);

   meshWallFrontMiddle = new THREE.Mesh( new THREE.BoxBufferGeometry(2, 1, 10), materialWalls);
   meshWallFrontMiddle.castShadow = true; meshWallFrontMiddle.receiveShadow = true;
   meshWallFrontMiddle.rotation.x -= Math.PI / 2; 
   meshWallFrontMiddle.position.set(2, 5, -15);

   meshWallFrontBottom = new THREE.Mesh( new THREE.BoxBufferGeometry(14.5, 1, 3), materialWalls);
   meshWallFrontBottom.castShadow = true; meshWallFrontBottom.receiveShadow = true;
   meshWallFrontBottom.rotation.x -= Math.PI / 2; 
   meshWallFrontBottom.position.set(2.3, 1.5, -15);

   meshWallFrontTop = new THREE.Mesh( new THREE.BoxBufferGeometry(14.5, 1, 1), materialWalls);
   meshWallFrontTop.castShadow = true; meshWallFrontTop.receiveShadow = true;
   meshWallFrontTop.rotation.x -= Math.PI / 2; 
   meshWallFrontTop.position.set(2.3, 9.5, -15);

   scene.add(meshWallFrontLeft, meshWallFrontRight, meshWallFrontBottom, meshWallFrontMiddle, meshWallFrontTop);

   meshRoomFloor = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 30), materialRoomFloor);
   meshRoomFloor.receiveShadow = true; meshRoomFloor.castShadow = true;

   meshRoomRoof = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 30), materialRoof);
   meshRoomRoof.receiveShadow = true; meshRoomRoof.castShadow = true;
   meshRoomRoof.position.set(0, 10, 0);
   scene.add(meshWallLeft, meshWallRight, meshWallBack, meshRoomFloor, meshRoomRoof);
}

// function for initializing movement
function onDocumentKeyPress(event){
   var Object = getMe(); 
   var keyCode = event.which;
   console.log(keyCode);
   moveObject(Object, keyCode);
   // moveCamera(keyCode);
 }

// function for printing position
function printLocation(target){
   console.log(
      ("position.set(" + target.position.x + ", " +
            target.position.y + ", " +
            target.position.z + ")" +
            "Rotation y " + target.rotation.y)
   );
 }
 
 // function for moving object
 function moveObject(entity, Key){
   if (Key == 119){
      entity.position.z -= 2;
      printLocation(entity);
   }else if (Key == 115){
      entity.position.z += 2;
      printLocation(entity);
   }else if (Key == 97){
      entity.position.x -= 2;
      printLocation(entity);
   }else if (Key == 100){
      entity.position.x += 2;
      printLocation(entity);
   }else if (Key == 113){
      entity.rotation.x += 0.1;
      printLocation(entity);
   }else if (Key == 101){
      entity.rotation.x -= 0.1;
      printLocation(entity);
   }else if (Key == 49){
      entity.position.y -= 1;
      printLocation(entity);
   }else if (Key == 50){
      entity.position.y += 1;
      printLocation(entity);
   }
 }

// function moveCamera(key){
//    if (key == 32){
//       camera.position.y += 1;
//    }
//    else if (key == 119){
//       camera.position.x += 1;
//    }else if (key == 97){
//       camera.position.x -= 1;
//    }else if (key == 115){
//       camera.position.z += 1;
//    }else if (key == 100){
//       camera.position.z -= 1;
//    }
// }
// rotate around algorithm
// my_counter += 0.01;
// camera.lookAt(point.position);
// camera.position.x = Math.sin(my_counter) * 200;
// camera.position.z = Math.cos(my_counter) * 200;

<<<<<<< HEAD
=======
=======
document.addEventListener( 'keypress', onDocumentKeyPress, false );

// misc
let scene, camera, renderer, mesh;
let ambientLight, light, controls;

// wall variables
let meshWallLeft, meshWallRight, meshWallFrontLeft, meshWallFrontRight, meshWallBack, meshRoomFloor,
   meshWallFrontBottom, meshWallFrontMiddle, meshWallFrontTop, meshRoomRoof;

// models variables
let meshBed, meshDoor, meshDresser, meshWindow, meshDresserSecond, point, meshBall, curtainLeft, curtainRight;

//light variables
let directionalLight, lighthelper, spotLight;
let lightRising = true;


function loadPointLight(){
   ambientLight = new THREE.AmbientLight(0x404040);
   scene.add(ambientLight);
   // directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6 );
   // directionalLight.castShadow = true;
   // directionalLight.position.set(12, 3, -56);
   // scene.add( directionalLight );
   // lighthelper = new THREE.DirectionalLightHelper(directionalLight);
   // scene.add(lighthelper);

   spotLight = new THREE.SpotLight( 0xFFA500 , 0.8);
   spotLight.target.position.set( 0, 0, 0 );
   spotLight.castShadow = true;
   scene.add( spotLight.target );
   scene.add( spotLight );
   spotLight.shadow.mapSize.width = 512; 
   spotLight.shadow.mapSize.height = 512; 
   spotLight.shadow.camera.near = 0.5;
   spotLight.shadow.camera.far = 15000;
   spotLight.position.set(6, -33, -72);
   // scene.add(spotLight);

   light = new THREE.PointLight(0xffffff, 0.8, 18);
   light.position.set(-14, 8, -2);
   light.castShadow = true;
   light.shadow.camera.near = 0.1;
   light.shadow.camera.far = 25;
   lighthelper = new THREE.PointLightHelper(spotLight);
   scene.add(light, lighthelper);
}
 
function getMe(){
   return curtainRight;
}

function init(){
   scene = new THREE.Scene();
   loadModels();
   loadPointLight();
   loadFloor();   
   loadWalls();
   loadCamera();
   loadRenderer();
   controls = new THREE.OrbitControls (camera, renderer.domElement);
   animate();
}
 
// function to animate put movements here
function animate(){
   if (lightRising == true){
      if (spotLight.position.y == 50){
         lightRising = false;
      }
      else{ spotLight.position.y += 0.5; ambientLight.intensity += 0.01}
   }if (lightRising == false){
      if (spotLight.position.y == -100){
         lightRising = true;
      }
      else{ spotLight.position.y += -0.5;  ambientLight.intensity -= 0.01}
   }
   // rotate around algorithm
   // my_counter += 0.01;
   // camera.lookAt(point.position);
   // camera.position.x = Math.sin(my_counter) * 200;
   // camera.position.z = Math.cos(my_counter) * 200;
   controls.update();
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
}

// floor options
function loadFloor(){
   let textureFloor = new THREE.TextureLoader().load( 'assets/textures/grass.jpg' );
   let materialFloor = new THREE.MeshLambertMaterial( { map: textureFloor } );
   let meshFloor = new THREE.Mesh( new THREE.CircleBufferGeometry(70, 24), materialFloor);
   meshFloor.receiveShadow = true;
   meshFloor.rotation.x -= Math.PI / 2;
   scene.add(meshFloor);
}

// camera options
function loadCamera(){
   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 5000 );
   camera.position.set(0, 5, 0);
}

// renderer options
function loadRenderer(){
   renderer = new THREE.WebGLRenderer();
   renderer.setSize( window.innerWidth, window.innerHeight );
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.BasicShadowMap;
   document.body.appendChild(renderer.domElement);
   lighthelper.update();
}

// loading walls
function loadModels(){
   let textureBed = new THREE.TextureLoader().load( 'assets/textures/bed.jpg' );
   let textureDoor = new THREE.TextureLoader().load( 'assets/textures/door.jpg' );
   let textureDresser = new THREE.TextureLoader().load( 'assets/textures/dresser.jpg' );
   let textureDresserSecond = new THREE.TextureLoader().load( 'assets/textures/dresser2.jpg' );
   let textureCurtain = new THREE.TextureLoader().load( 'assets/textures/curtain.jpg' );

   let materialBed = new THREE.MeshLambertMaterial( { map: textureBed } );
   let materialDoor = new THREE.MeshLambertMaterial( { map: textureDoor } );
   let materialCurtain = new THREE.MeshLambertMaterial( { map: textureCurtain, transparent: true } );
   materialCurtain.opacity = 0.4;

   let materialDresser = new THREE.MeshStandardMaterial( { map: textureDresser } );
   let materialDresserSecond = new THREE.MeshStandardMaterial( { map: textureDresserSecond } );

   let materialBall = new THREE.MeshPhongMaterial( { color: 0x0087E6, shininess: 100 } );
   let materialBulb = new THREE.MeshPhongMaterial( { color: 0xFFFF00, shininess: 100, transparent: true} );
   materialBulb.opacity = 0.2;
   
   meshBed = new THREE.Mesh( new THREE.BoxBufferGeometry(8, 12, 2), materialBed);
   meshBed.castShadow = true; meshBed.receiveShadow = true;
   meshBed.rotation.x -= Math.PI / 2; meshBed.rotation.z -= Math.PI / 2;
   meshBed.position.set(8, 2, 5);

   meshDoor = new THREE.Mesh( new THREE.BoxBufferGeometry(4.5, 8.5, 1), materialDoor);
   meshDoor.castShadow = true; meshDoor.receiveShadow = true;
   meshDoor.position.set(14.5, 4, -7); meshDoor.rotation.y -= Math.PI / 2;

   curtainLeft = new THREE.Mesh( new THREE.BoxBufferGeometry(4.5, 8.5, 1), materialCurtain);
   curtainLeft.castShadow = true; curtainLeft.receiveShadow = true;
   curtainLeft.position.set(-6, 6, -14); 

   curtainRight = new THREE.Mesh( new THREE.BoxBufferGeometry(4.5, 8.5, 1), materialCurtain);
   curtainRight.castShadow = true; curtainRight.receiveShadow = true;
   curtainRight.position.set(8, 6, -14); 


   meshDresser = new THREE.Mesh( new THREE.BoxBufferGeometry(8, 8, 2), materialDresser);
   meshDresser.castShadow = true; meshDresser.receiveShadow = true;
   meshDresser.rotation.y -= Math.PI / 2; 
   meshDresser.position.set(-13, 4, 8.5);

   meshDresserSecond = new THREE.Mesh( new THREE.BoxBufferGeometry(12, 3, 4), materialDresserSecond);
   meshDresserSecond.castShadow = true; meshDresserSecond.receiveShadow = true;
   meshDresserSecond.rotation.y -= Math.PI / 2; 
   meshDresserSecond.position.set(-12.5, 2, -2.4)

   meshBall = new THREE.Mesh( new THREE.SphereBufferGeometry(2, 12, 8), materialBall);
   meshBall.castShadow = true; meshBall.receiveShadow = true;
   meshBall.rotation.y -= Math.PI / 2; 
   meshBall.position.set(3.5, 1, -0.4);

   point = new THREE.Mesh( new THREE.BoxBufferGeometry(0.5, 0.5, 5), materialBulb);
   point.position.set(-14, 8, -2);

   scene.add(meshBed, meshDoor, meshDresser, meshDresserSecond, point, meshBall, curtainLeft, curtainRight);
}

//loading walls
function loadWalls(){
   let textureWalls = new THREE.TextureLoader().load( 'assets/textures/walls.jpg' );
   let textureRoomFloor = new THREE.TextureLoader().load( 'assets/textures/floor_wood.jpg' );
   let textureRoomRoof = new THREE.TextureLoader().load( 'assets/textures/marble.jpg' );
   let materialRoomFloor = new THREE.MeshLambertMaterial( { map: textureRoomFloor } );
   let materialWalls = new THREE.MeshLambertMaterial( { map: textureWalls } );
   let materialRoof = new THREE.MeshLambertMaterial( { map: textureRoomRoof } );

   meshWallLeft = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 10), materialWalls);
   meshWallLeft.castShadow = true; meshWallLeft.receiveShadow = true;
   meshWallLeft.rotation.x -= Math.PI / 2;
   meshWallLeft.position.set(0, 5, 15);
   meshWallRight = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 10), materialWalls);
   meshWallRight.castShadow = true; meshWallRight.receiveShadow = true;
   meshWallRight.rotation.x -= Math.PI / 2;  meshWallRight.rotation.z -= Math.PI / 2;
   meshWallRight.position.set(15, 5, 0);
   meshWallBack = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 10), materialWalls);
   meshWallBack.castShadow = true; meshWallBack.receiveShadow = true;
   meshWallBack.rotation.x -= Math.PI / 2;  meshWallBack.rotation.z -= Math.PI / 2;
   meshWallBack.position.set(-15, 5, 0);
   
   meshWallFrontLeft = new THREE.Mesh( new THREE.BoxBufferGeometry(10, 1, 10), materialWalls);
   meshWallFrontLeft.castShadow = true; meshWallFrontLeft.receiveShadow = true;
   meshWallFrontLeft.rotation.x -= Math.PI / 2; 
   meshWallFrontLeft.position.set(-10, 5, -15);

   meshWallFrontRight = new THREE.Mesh( new THREE.BoxBufferGeometry(5, 1, 10), materialWalls);
   meshWallFrontRight.castShadow = true; meshWallFrontRight.receiveShadow = true;
   meshWallFrontRight.rotation.x -= Math.PI / 2; 
   meshWallFrontRight.position.set(12, 5, -15);

   meshWallFrontMiddle = new THREE.Mesh( new THREE.BoxBufferGeometry(2, 1, 10), materialWalls);
   meshWallFrontMiddle.castShadow = true; meshWallFrontMiddle.receiveShadow = true;
   meshWallFrontMiddle.rotation.x -= Math.PI / 2; 
   meshWallFrontMiddle.position.set(2, 5, -15);

   meshWallFrontBottom = new THREE.Mesh( new THREE.BoxBufferGeometry(14.5, 1, 3), materialWalls);
   meshWallFrontBottom.castShadow = true; meshWallFrontBottom.receiveShadow = true;
   meshWallFrontBottom.rotation.x -= Math.PI / 2; 
   meshWallFrontBottom.position.set(2.3, 1.5, -15);

   meshWallFrontTop = new THREE.Mesh( new THREE.BoxBufferGeometry(14.5, 1, 1), materialWalls);
   meshWallFrontTop.castShadow = true; meshWallFrontTop.receiveShadow = true;
   meshWallFrontTop.rotation.x -= Math.PI / 2; 
   meshWallFrontTop.position.set(2.3, 9.5, -15);

   scene.add(meshWallFrontLeft, meshWallFrontRight, meshWallFrontBottom, meshWallFrontMiddle, meshWallFrontTop);

   meshRoomFloor = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 30), materialRoomFloor);
   meshRoomFloor.receiveShadow = true; meshRoomFloor.castShadow = true;

   meshRoomRoof = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 1, 30), materialRoof);
   meshRoomRoof.receiveShadow = true; meshRoomRoof.castShadow = true;
   meshRoomRoof.position.set(0, 10, 0);
   scene.add(meshWallLeft, meshWallRight, meshWallBack, meshRoomFloor, meshRoomRoof);
}

//function for initializing movement
function onDocumentKeyPress(event){
   var Object = getMe(); 
   var keyCode = event.which;
   console.log(keyCode);
   // moveObject(Object, keyCode);
   if (keyCode == 32){
      camera.position.y += 1;
   }
 }

//function for printing position
function printLocation(target){
   console.log(
      ("position.set(" + target.position.x + ", " +
            target.position.y + ", " +
            target.position.z + ")" +
            "Rotation y " + target.rotation.y)
   );
 }
 
 //function for moving object
 function moveObject(entity, Key){
   if (Key == 119){
      entity.position.z -= 2;
      printLocation(entity);
   }else if (Key == 115){
      entity.position.z += 2;
      printLocation(entity);
   }else if (Key == 97){
      entity.position.x -= 2;
      printLocation(entity);
   }else if (Key == 100){
      entity.position.x += 2;
      printLocation(entity);
   }else if (Key == 113){
      entity.rotation.x += 0.1;
      printLocation(entity);
   }else if (Key == 101){
      entity.rotation.x -= 0.1;
      printLocation(entity);
   }else if (Key == 49){
      entity.position.y -= 1;
      printLocation(entity);
   }else if (Key == 50){
      entity.position.y += 1;
      printLocation(entity);
   }
 }

window.onload = init;
