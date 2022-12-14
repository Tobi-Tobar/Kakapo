// Art 109 Three.js Demo Site
// client7.js
// A three.js scene which uses planes and texture loading to generate a scene with images which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.
import { GLTFLoader } from "../src/GLTFLoader.js";

// Import required source code
// Import three.js core
import * as THREE from "../build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "../src/PointerLockControls.js";
import {
FontLoader
} from "../src/FontLoader.js"

// Establish variables
let camera, scene, renderer, controls, material;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9BC4F9);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };
let mesh;

const loader = new GLTFLoader();
loader.load(
  "./assets/Kakapo.glb",
  function ( gltf ) {
    mesh = gltf.scene;
    mesh.scale.set(1.5,1.5,1.5);
    mesh.position.set(-2.5,1,-25);
    mesh.rotation.set(0,2.2,0);
    renderer.gammaOutput = true;
  scene.add( mesh );
},
)

let mesh1;

const loader1 = new GLTFLoader();
loader.load(
  "../../assets/ground2.glb",
  function ( gltf ) {
    mesh1 = gltf.scene;
    mesh1.scale.set(5,5,5);
    mesh1.position.set(0,2,-14);
    mesh1.rotation.set(0,0,0)
  scene.add( mesh1 );
},
)


  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);


  // First Image (red and purple glitch map)
  // Load image as texture
  const texture = new THREE.TextureLoader().load( '../assets/grass1.png' );
  // Immediately use the texture for material creation
  const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry = new THREE.PlaneGeometry( 10, 10 );
  // Apply image texture to plane geometry
  const plane = new THREE.Mesh( geometry, material );
  // Position plane geometry
  plane.position.set(10 , 6.2 , -20);
  plane.rotation.set(0,5.5,0);
  // Place plane geometry
  scene.add( plane );

  // Second Image (Text with image and white background)
  // Load image as texture
  const texture2 = new THREE.TextureLoader().load( '../assets/grass2.png' );
  // immediately use the texture for material creation
  const material2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry2 = new THREE.PlaneGeometry( 10, 10 );
  // Apply image texture to plane geometry
  const plane2 = new THREE.Mesh( geometry2, material2 );
  // Position plane geometry
  plane2.position.set(-15 , 6.2 , -30);
  plane2.rotation.set(0,6.5,0);
  // Place plane geometry
  scene.add( plane2 );


  const texture3 = new THREE.TextureLoader().load( '../assets/grass3.png' );
  // immediately use the texture for material creation
  const material3 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry3 = new THREE.PlaneGeometry( 10, 10 );
  // Apply image texture to plane geometry
  const plane3 = new THREE.Mesh( geometry3, material3 );
  // Position plane geometry
  plane3.position.set(10 , 6.2 , -30);
  plane3.rotation.set(0,6.5,0);

  // Place plane geometry
  scene.add( plane3 );

  const texture4 = new THREE.TextureLoader().load( '../assets/grass4.png' );
  // immediately use the texture for material creation
  const material4 = new THREE.MeshBasicMaterial( { map: texture4, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry4 = new THREE.PlaneGeometry( 10, 10 );
  // Apply image texture to plane geometry
  const plane4 = new THREE.Mesh( geometry4, material4 );
  // Position plane geometry
  plane4.position.set(-10 , 6.2 , -10);
  // Place plane geometry
  scene.add( plane4 );

  const texture5 = new THREE.TextureLoader().load( '../assets/forest.png' );
  // immediately use the texture for material creation
  const material5 = new THREE.MeshBasicMaterial( { map: texture5, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry5 = new THREE.PlaneGeometry( 100, 60 );
  // Apply image texture to plane geometry
  const plane5 = new THREE.Mesh( geometry5, material5 );
  // Position plane geometry
  plane5.position.set(-20 , 31 , -35);
  plane5.rotation.set(0,10,0);
  // Place plane geometry
  scene.add( plane5 );

  const texture6 = new THREE.TextureLoader().load( '../assets/forest2.png' );
  // immediately use the texture for material creation
  const material6 = new THREE.MeshBasicMaterial( { map: texture6, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry6 = new THREE.PlaneGeometry( 100, 60 );
  // Apply image texture to plane geometry
  const plane6 = new THREE.Mesh( geometry6, material6 );
  // Position plane geometry
  plane6.position.set(50 , 31 , -40);
  plane6.rotation.set(0,6,0);
  // Place plane geometry
  scene.add( plane6 );

  const texture7 = new THREE.TextureLoader().load( '../assets/green.png' );
  // immediately use the texture for material creation
  const material7 = new THREE.MeshBasicMaterial( { map: texture7, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry7 = new THREE.PlaneGeometry( 100, 60 );
  // Apply image texture to plane geometry
  const plane7 = new THREE.Mesh( geometry7, material7 );
  // Position plane geometry
  plane7.position.set(50 , 31 , 7);
  plane7.rotation.set(0,4,0);
  // Place plane geometry
  scene.add( plane7 );

  const texture8 = new THREE.TextureLoader().load( '../assets/green.png' );
  // immediately use the texture for material creation
  const material8 = new THREE.MeshBasicMaterial( { map: texture8, side: THREE.DoubleSide, transparent: true} );
  // Create plane geometry
  const geometry8 = new THREE.PlaneGeometry( 100, 60 );
  // Apply image texture to plane geometry
  const plane8 = new THREE.Mesh( geometry8, material8 );
  // Position plane geometry
  plane8.position.set(-20 , 31 , 17);
  plane8.rotation.set(0,2.5,0);
  // Place plane geometry
  scene.add( plane8 );

  // Add Text under models
  const loader3 = new FontLoader();
         loader3.load( '../../assets/helvetiker_regular.typeface.json', function ( font ) {
           // Define font color
           const color = 0xCEC88D;
           // Define font material
           const matDark = new THREE.LineBasicMaterial( {
             color: color,
             side: THREE.DoubleSide,
           } );
           // Generate and place left side text
           const message = "Also known as the Parrot Owl!";
           const shapes = font.generateShapes( message, 2);
           const geometry = new THREE.ShapeGeometry( shapes );
           geometry.computeBoundingBox();
           const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
           geometry.translate( xMid, 0, 0 );
           const text = new THREE.Mesh( geometry, matDark );
           text.position.set(50 , 31 , 6.9);
           text.rotation.set(0,4,0)
           scene.add( text );

           // Generate and place right side text
           const message2 = "Ankita's BFF";
           const shapes2 = font.generateShapes( message2, .5 );
           const geometry2 = new THREE.ShapeGeometry( shapes2 );
           geometry2.computeBoundingBox();
           const xMid2 = - 0.5 * ( geometry2.boundingBox.max.x - geometry2.boundingBox.min.x );
           geometry2.translate( xMid2, 0, 0 );
           const text2 = new THREE.Mesh( geometry2, matDark );
           text2.position.set(0, 15 , -20);
           scene.add( text2 );
         });

  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
