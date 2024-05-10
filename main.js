import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "stats.js";
import init from "./init";
import createXbotRedEntity from "./entities/xbotRedEntity";
import createXbotWhiteEntity from "./entities/xbotWhiteEntity";
import armySystem from "./systems/armySystem";

const { sizes, camera, scene, canvas, controls, renderer, clock } = init();

let animations;
let maxArmy = 40;
let xbotRed = 20000;
let xbotWhite = 20000;
let xbotRedEntities = [];
let xbotWhiteEntities = [];

// Загружаем модель и создаем сущность красного робота после загрузки модели
loadModel("assets/models/XbotRed.glb", true);
loadModel("assets/models/XbotWhite.glb");

let stats = new Stats();
document.body.appendChild(stats.dom);

camera.position.z = 60;
camera.position.x = 0;
camera.position.y = 300;

let timeSinceLastAttack = 0;
const attackInterval = 0.5; // Интервал атаки в секундах

const animate = () => {
  stats.begin();
  controls.update();
  const delta = clock.getDelta();

  if (animations) {
    timeSinceLastAttack += delta;
    const intervalAttack = timeSinceLastAttack >= attackInterval;

    armySystem(
      xbotRedEntities,
      xbotWhiteEntities,
      delta,
      animations,
      scene,
      intervalAttack,
    );
    if (intervalAttack) {
      timeSinceLastAttack = 0;
    }
  }

  for (const entity of [...xbotRedEntities, ...xbotWhiteEntities]) {
    entity.mixer.update(delta);
  }

  if (
    maxArmy > xbotRedEntities.length + xbotWhiteEntities.length &&
    xbotRedEntities.length === 0 &&
    xbotWhiteEntities.length
  ) {
    // loadModel("assets/models/XbotRed.glb", true);
    // console.log("1");
  }

  renderer.render(scene, camera);
  stats.end();
  window.requestAnimationFrame(animate);
};

if (WebGL.isWebGLAvailable()) {
  init();
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("app").appendChild(warning);
}
function loadModel(url, isRed) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    animations = gltf.animations;

    setupDefaultScene(model, isRed);
  });
}

function setupDefaultScene(model, isRed) {
  const numModels = 20; // Number of models to create

  for (let i = 0; i < numModels; i++) {
    const clonedModel = SkeletonUtils.clone(model);
    let component;
    if (isRed) {
      component = createXbotRedEntity();
    } else {
      component = createXbotWhiteEntity();
    }

    if (isRed) {
      // Position each model
      clonedModel.position.z = i * 2 - 5;
      clonedModel.position.x = -10;

      // Поворот модели на 90 градусов вокруг оси Y
      clonedModel.rotation.y = Math.PI / 2;
    } else {
      // Position each model
      clonedModel.position.z = i * 2 - 5;
      clonedModel.position.x = 10 + i;

      // Поворот модели на 90 градусов вокруг оси Y
      clonedModel.rotation.y = -Math.PI / 2;
    }

    // Create mixer for each model
    const mixer = new THREE.AnimationMixer(clonedModel);

    // Play the same animation for each model
    mixer.clipAction(animations[2]).play(); // idle

    // Add the cloned model and mixer to the scene
    scene.add(clonedModel);
    const addEntity = {
      object: clonedModel,
      mixer,
      component,
    };

    if (isRed) {
      xbotRedEntities.push(addEntity);
    } else {
      xbotWhiteEntities.push(addEntity);
    }
  }
}

/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener("resize", () => {
  // Обновляем размеры
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Обновляем соотношение сторон камеры
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Обновляем renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
