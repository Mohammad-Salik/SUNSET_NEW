document.addEventListener( 'keypress', onDocumentKeyPress, false );

//main variables
let scene, renderer, camera;
let cube, wallLeft, wallRight, wallBack, topWalls, bottomWalls, floor,
wall1, wall2, wall3, bed, door, dresser, divider, dividerLeft, dividerRight;
let materialPhong, materialLambert, materialBed, textFloor, materialDoor, materialDresser, materialWalls;
let controls, mesh, meshFloor;
let directionalLight, ambientLight, light, background;

init();
animate();

function init()
{  
   renderer = new THREE.WebGLRenderer( {antialias:true} );
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.BasicShadowMap;
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild (renderer.domElement);
   scene = new THREE.Scene();

   //loading textures
   let textureWalls = new THREE.TextureLoader().load( 'assets/textures/floor.jpg' );
   let textureBed = new THREE.TextureLoader().load( 'assets/textures/bed.jpg' );
   let textureDoor = new THREE.TextureLoader().load( 'assets/textures/Door.jpg' );
   let textureDresser = new THREE.TextureLoader().load( 'assets/textures/dresser.jpg' );
   let textureFloor = new THREE.TextureLoader().load( 'assets/textures/floor_wood.jpg' );
   let background = new THREE.TextureLoader().load( 'assets/textures/background.jpg' );
   scene.bakground = (background);

   //initializing textures
   materialWalls = new THREE.MeshStandardMaterial( { map: textureWalls } );
   materialDoor = new THREE.MeshStandardMaterial( { map: textureDoor } );
   materialBed = new THREE.MeshLambertMaterial( { map: textureBed } );
   materialFloor = new THREE.MeshLambertMaterial( { map: textureFloor } );
   materialDresser = new THREE.MeshPhongMaterial( {  map: textureDresser  } );

   //creating geometry
   const geomPlane = new THREE.BoxBufferGeometry(800, 10, 800);
   const geomBed = new THREE.BoxBufferGeometry(200, 40, 150); 
   const geomDresser = new THREE.BoxBufferGeometry(100, 100, 50);
   const geomDoor = new THREE.BoxBufferGeometry(15, 150, 80);
   const geomWalls = new THREE.BoxBufferGeometry(500, 150, 10);
   const geomTopWalls = new THREE.BoxBufferGeometry(500, 80, 10);
   const geomBottomWalls = new THREE.BoxBufferGeometry(500, 40, 10);
   const geomDivider = new THREE.BoxBufferGeometry(100, 70, 10);
   const geomBackground = new THREE.BoxBufferGeometry(500, 500, 80);

   //initializing geometry objects
   divider = new THREE.Mesh(geomDivider, materialWalls);
   dividerLeft = new THREE.Mesh(geomDivider, materialWalls);
   dividerRight = new THREE.Mesh(geomDivider, materialWalls);
   bottomWalls = new THREE.Mesh(geomBottomWalls, materialWalls); 
   topWalls = new THREE.Mesh(geomTopWalls, materialWalls); 
   wallBack = new THREE.Mesh(geomWalls, materialWalls);
   wallLeft = new THREE.Mesh(geomWalls, materialWalls);
   wallRight = new THREE.Mesh(geomWalls, materialWalls);
   door = new THREE.Mesh(geomDoor, materialDoor);
   dresser = new THREE.Mesh(geomDresser, materialDresser);
   bed = new THREE.Mesh(geomBed, materialBed);
   floor =  new THREE.Mesh(geomPlane, materialFloor);
   roof =  new THREE.Mesh(geomPlane, materialFloor);


   //adding shadow properties
   door.receiveShadow = true;
   door.castShadow = true;
   roof.receiveShadow = true;
   roof.castShadow = true;
   floor.receiveShadow = true;
   floor.castShadow = true;
   bed.receiveShadow = true;
   bed.castShadow = true;
   dresser.receiveShadow = true;
   dresser.castShadow = true;
   dividerLeft.receiveShadow = true;
   dividerLeft.castShadow = true;
   dividerRight.receiveShadow = true;
   dividerRight.castShadow = true;
   bottomWalls.receiveShadow = true;
   bottomWalls.castShadow = true;
   topWalls.receiveShadow = true;
   topWalls.castShadow = true;
   wallBack.receiveShadow = true;
   wallBack.castShadow = true;
   wallLeft.receiveShadow = true;
   wallLeft.castShadow = true;
   wallRight.receiveShadow = true;
   wallRight.castShadow = true;




   mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), materialBed);
   mesh.position.y = 2;
   mesh.receiveShadow = true;
   mesh.castShadow = true;
   scene.add(mesh);

   meshFloor = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), materialFloor);
   meshFloor.rotation.x = Math.PI / 2;
   meshFloor.receiveShadow = true;
   scene.add(meshFloor);
   ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
   scene.add(ambientLight);
   light = new THREE.PointLight(0xffffff, 0.8, 18);
   light.position.set(-3,6,-3);
   light.castShadow = true;
   light.shadow.camera.near = 0.1;
   light.shadow.camera.far = 25;
   scene.add(light);


   //add objects
   scene.add(wallLeft, floor, wallRight, wallBack, topWalls, roof,
   bottomWalls, bed, door, dresser, divider, dividerRight, dividerLeft);

   //object positions
   divider.position.set(-232, 48, -50);
   divider.rotation.y = -1.5;
   dividerLeft.position.set(-212, 50, 140);
   dividerLeft.rotation.y = -1.5;
   dividerRight.position.set(-232, 48, -146);
   dividerRight.rotation.y = -1.5;
   dresser.position.set(-100, 3, -276);
   door.position.set(-116, 30, 188);
   door.rotation.y = -1.6;
   bed.position.set(86, -15, 92);
   bed.rotation.y = 1.5;
   bottomWalls.position.set(-230, 96, -50);
   bottomWalls.rotation.y = -1.5;
   topWalls.position.set(-224, -22, -46);
   topWalls.rotation.y = -1.5;
   wallBack.position.set(264, 39, -48);
   wallBack.rotation.y = -1.5;
   wallRight.position.set(36, 42, 196);
   wallRight.position.set
   wallLeft.position.set(0, 40, -296);
   floor.position.set(0, -39, 0); 
   roof.position.set(0, 113, 0);       

   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 5000 );
   camera.position.y = 180;
   controls = new THREE.OrbitControls (camera, renderer.domElement);

   //guide for object placement
   var gridXZ = new THREE.GridHelper(100, 10);
   gridXZ.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff) );
   scene.add(gridXZ);

}

function onDocumentKeyPress(event){
   var Object = background; 
   var keyCode = event.which;
   console.log(keyCode);
   moveObject(Object, keyCode)
}

function animate()
{
   controls.update();
   requestAnimationFrame ( animate );  
   mesh.rotation.y += 0.1;
   renderer.render (scene, camera);
}

//function for printing position
function printLocation(target){
   console.log(
      ("(" + target.position.x + ", " +
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
      entity.rotation.y += 0.1;
      printLocation(entity);
   }else if (Key == 101){
      entity.rotation.y -= 0.1;
      printLocation(entity);
   }else if (Key == 49){
      entity.position.y -= 1;
      printLocation(entity);
   }else if (Key == 50){
      entity.position.y += 1;
      printLocation(entity);
   }
}