import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.2,
  2000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
function initGraphics(containerId) {
  const cameraPosition = new THREE.Vector3(-7, 5, 8);

  const container = document.getElementById(containerId);
  camera.position.copy(cameraPosition);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();

  const textureLoader = new THREE.TextureLoader();

  const ambientLight = new THREE.AmbientLight(0xbbbbbb);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-10, 10, 5);
  light.castShadow = true;
  const d = 10;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 2;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  scene.add(light);

  const stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  container.appendChild(stats.domElement);

  //

  window.addEventListener("resize", onWindowResize);

  return {
    container,
    camera,
    scene,
    renderer,
    controls,
    textureLoader,
    ambientLight,
    light,
    stats,
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

export default initGraphics;
