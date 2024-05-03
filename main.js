import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats.js";
import createCharacterEntity from "./entities/character";
import createCharacterAISystem from "./systems/character_ai";

// Variables
const keyStates = {};
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

const colliderRadius = 0.5; // Радиус коллайдера
let stats;
let camera, scene, renderer, clock, controls;
// Создаем персонажа с мешем
const character = createCharacterEntity(
  "Character",
  "Good",
  createCharacterAISystem,
);

function init() {
  // Создание рендерера
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  document.getElementById("container").appendChild(renderer.domElement);

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    75,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    0.1,
    1000,
  );
  camera.rotation.order = "YXZ";
  // END CAMERA

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x999999);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0.5, 1.0, 0.5).normalize();

  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );

  camera.position.y = 5;
  camera.position.z = 10;

  scene.add(camera);

  const grid = new THREE.GridHelper(50, 50, 0xffffff, 0x7b7b7b);
  scene.add(grid);

  /////// * /////////// * /////////// * CHARACTER * /////////// *

  console.log(character, "character");

  // Добавляем меш персонажа в сцену
  scene.add(character.appearance.mesh);

  // renderingSystem.addMeshToScene(scene, renderer, character.mesh);

  /////// * /////////// * /////////// * CHARACTER * /////////// *

  // END SCENE

  // STATS
  stats = new Stats();
  document.body.appendChild(stats.dom);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 25;

  clock = new THREE.Clock();

  // EVENTS
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  render();

  stats.update();
}
function render() {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  init();
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

function updateCameraPosition() {
  const cameraSpeed = 0.1; // Скорость перемещения камеры

  if (keyStates["ArrowLeft"] || keyStates["KeyA"]) {
    camera.position.x -= cameraSpeed; // Движение влево
  }
  if (keyStates["ArrowRight"] || keyStates["KeyD"]) {
    camera.position.x += cameraSpeed; // Движение вправо
  }
  if (keyStates["ArrowUp"] || keyStates["KeyW"]) {
    camera.position.y += cameraSpeed; // Движение вверх
  }
  if (keyStates["ArrowDown"] || keyStates["KeyS"]) {
    camera.position.y -= cameraSpeed; // Движение вниз
  }

  // Проверяем расстояние между камерой и центром сферы коллайдера
  // const distance = camera.position.distanceTo(colliderSphere.position);
  // if (distance < colliderRadius) {
  // Если расстояние меньше радиуса коллайдера, камера сталкивается с коллайдером
  // Здесь можно добавить логику для предотвращения движения камеры или другие действия при столкновении
  // }
}

// EVENT HANDLERS
function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
}

document.addEventListener("keydown", (event) => {
  keyStates[event.code] = true;
});

document.addEventListener("keyup", (event) => {
  keyStates[event.code] = false;
});
