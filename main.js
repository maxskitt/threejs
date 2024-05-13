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

loadModel("assets/models/XbotRed.glb", true, 20);
loadModel("assets/models/XbotWhite.glb", false, 20);

// army variables
let animations;
let maxArmy = 40;
let xbotmodelRedClone;
let xbotmodelWhiteClone;
let xbotRedCount = 20000;
let xbotWhiteCount = 20000;
let xbotRedEntities = [];
let xbotWhiteEntities = [];

let stats = new Stats();
document.body.appendChild(stats.dom);

let timeSinceLastAttack = 0;
const attackInterval = 0.5;

if (WebGL.isWebGLAvailable()) {
  init();
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("app").appendChild(warning);
}

function animate() {
  stats.begin();
  render();
  stats.end();
  window.requestAnimationFrame(animate);
}

function render() {
  const deltaTime = clock.getDelta();

  if (animations) {
    timeSinceLastAttack += deltaTime;
    const intervalAttack = timeSinceLastAttack >= attackInterval;

    armySystem(
      xbotRedEntities,
      xbotWhiteEntities,
      deltaTime,
      animations,
      scene,
      intervalAttack,
    );

    if (intervalAttack) {
      addSceneEntity();

      timeSinceLastAttack = 0;
    }
  }

  for (const entity of [...xbotRedEntities, ...xbotWhiteEntities]) {
    entity.mixer.update(deltaTime);
  }

  renderer.render(scene, camera);
}

function loadModel(url, isRed, numModels) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    if (isRed) {
      xbotmodelRedClone = gltf.scene;
    } else {
      xbotmodelWhiteClone = gltf.scene;
    }

    animations = gltf.animations;

    setupDefaultScene(isRed, numModels, true);
  });
}

function setupDefaultScene(isRed, numModels, isDefault) {
  for (let i = 0; i < numModels; i++) {
    let clonedModel;
    let component;

    if (isRed) {
      clonedModel = SkeletonUtils.clone(xbotmodelRedClone);
    } else {
      clonedModel = SkeletonUtils.clone(xbotmodelWhiteClone);
    }

    if (isRed) {
      component = createXbotRedEntity();
    } else {
      component = createXbotWhiteEntity();
    }

    if (!isDefault) {
      let randomI = Math.floor(Math.random() * 10);

      if (isRed) {
        clonedModel.position.z = randomI * 2 - 10;
        clonedModel.position.x = randomI % 2 === 0 ? -20 : -18;
      } else {
        clonedModel.position.z = randomI * 2 - 10;
        clonedModel.position.x = randomI % 2 === 0 ? 12 : 10;
      }
    }

    if (isRed && isDefault) {
      if (i >= 0 && 10 >= i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 10;
        clonedModel.position.x = i % 2 === 0 ? -20 : -18;
      }
      if (i >= 10 && 20 > i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 30;
        clonedModel.position.x = i % 2 === 0 ? -16 : -14;
      }

      if (i >= 20 && 30 > i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 50;
        clonedModel.position.x = i % 2 === 0 ? -12 : -10;
      }

      if (i >= 30 && 40 > i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 70;
        clonedModel.position.x = i % 2 === 0 ? -8 : -6;
      }

      clonedModel.rotation.y = Math.PI / 2;
    } else if (isDefault) {
      if (i >= 0 && 10 >= i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 10;
        clonedModel.position.x = i % 2 === 0 ? 12 : 10;
      }
      if (i >= 10 && 20 > i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 30;
        clonedModel.position.x = i % 2 === 0 ? 16 : 14;
      }

      if (i >= 20 && 30 > i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 50;
        clonedModel.position.x = i % 2 === 0 ? 20 : 18;
      }

      if (i >= 30 && 40 > i && Infinity >= i) {
        clonedModel.position.z = i * 2 - 70;
        clonedModel.position.x = i % 2 === 0 ? 22 : 24;
      }
      clonedModel.rotation.y = -Math.PI / 2;
    }

    const mixer = new THREE.AnimationMixer(clonedModel);

    mixer.clipAction(animations[2]).play();

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

    scene.add(clonedModel);
  }
}

function addSceneEntity() {
  if (!xbotmodelRedClone || !xbotmodelWhiteClone) {
    return;
  }

  if (xbotRedEntities.length + xbotWhiteEntities.length >= maxArmy) {
    return;
  }

  if (xbotRedEntities.length === 0 && xbotWhiteEntities.length > 0) {
    return;
  }

  if (xbotRedEntities.length > 0 && xbotWhiteEntities.length === 0) {
    return;
  }

  const isRed = Math.random() < 0.5;

  if (xbotRedCount > 0 && isRed && xbotWhiteEntities.length >= 10) {
    xbotRedCount -= 1;
    setupDefaultScene(isRed, 1, false);
  }

  if (xbotWhiteCount > 0 && !isRed && xbotRedEntities.length >= 10) {
    xbotWhiteCount -= 1;
    setupDefaultScene(isRed, 1, false);
  }
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
