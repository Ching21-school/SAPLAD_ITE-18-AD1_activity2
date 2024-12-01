import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Import OrbitControls

// Create the scene
const scene = new THREE.Scene();

// Setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 15); // Position the camera to see the house
camera.lookAt(0, 0, 0);

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Load textures
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/textures/floor_texture.jpg');
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1; // Floor is at y = -1
floor.receiveShadow = true;
scene.add(floor);

// Create a house
const houseGroup = new THREE.Group();

// Wall texture
const wallTexture = textureLoader.load('/textures/wall_texture.jpg');
const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 4), wallMaterial);
walls.position.y = 1.25 - 1; // Bottom edge of walls at y = -1
walls.castShadow = true;
houseGroup.add(walls);

// Roof (pyramid-shaped)
const roofGeometry = new THREE.ConeGeometry(3.5, 1.5, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: '#b35f45' });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.rotation.y = Math.PI * 0.25; // Rotate to align with the house
roof.position.y = 2; // Place above the walls
roof.castShadow = true;
houseGroup.add(roof);



// Door texture
const doorTexture = textureLoader.load('/textures/door.jpg');
const doorMaterial = new THREE.MeshStandardMaterial({ map: doorTexture });
const door = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.5), doorMaterial);
door.position.set(0, 0.25, 2.01); // On the front wall
houseGroup.add(door);

// Add house to the scene
scene.add(houseGroup);

// Add fireflies
const fireflies = [];
const numFireflies = 100;

for (let i = 0; i < numFireflies; i++) {
  const firefly = new THREE.PointLight(0xffff00, Math.random() * 1.5 + 0.5, 5);
  firefly.position.set(Math.random() * 20 - 10, Math.random() * 5, Math.random() * 20 - 10);
  firefly.castShadow = false;
  fireflies.push(firefly);
  scene.add(firefly);
}

// Add stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const starCount = 1000;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  starPositions[i * 3] = Math.random() * 100 - 50;
  starPositions[i * 3 + 1] = Math.random() * 50 + 20; // Place stars higher in the sky
  starPositions[i * 3 + 2] = Math.random() * 100 - 50;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Add ambient light and directional light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Shadow settings for directional light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;

// Animate fireflies
let fireflyTime = 0;
function animateFireflies() {
  fireflyTime += 0.01;
  fireflies.forEach(firefly => {
    firefly.position.x += Math.sin(fireflyTime + Math.random() * 5) * 0.05;
    firefly.position.y += Math.cos(fireflyTime + Math.random() * 5) * 0.05;
    firefly.position.z += Math.sin(fireflyTime + Math.random() * 5) * 0.05;
    firefly.intensity = Math.random() * 1.5 + 0.5; // Flickering effect
  });
}

// OrbitControls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Render loop
function animate() {
  requestAnimationFrame(animate);
  animateFireflies(); // Firefly animation
  controls.update(); // OrbitControls
  renderer.render(scene, camera); // Render the scene
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});