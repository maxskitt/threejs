import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "stats.js";
import createCharacterEntity from "./entities/character";
import createCharacterAISystem from "./systems/character_ai";

// Variables
const keyStates = {};
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

const colliderRadius = 0.5; // Радиус коллайдера
let stats;
let camera, scene, renderer, controls;

let model, skeleton, mixer, clock;

console.log(model, "model");

const crossFadeControls = [];

let currentBaseAction = "idle";
const allActions = [];
const baseActions = {
  idle: { weight: 1 },
  walk: { weight: 0 },
  run: { weight: 0 },
};
const additiveActions = {
  sneak_pose: { weight: 0 },
  sad_pose: { weight: 0 },
  agree: { weight: 0 },
  headShake: { weight: 0 },
};
let panelSettings, numAnimations;

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
  // scene.add(character.appearance.mesh);

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

  const loader = new GLTFLoader();
  loader.load("models/Xbot.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);

    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    scene.add(skeleton);

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    numAnimations = animations.length;

    for (let i = 0; i !== numAnimations; ++i) {
      let clip = animations[i];
      const name = clip.name;

      if (baseActions[name]) {
        const action = mixer.clipAction(clip);
        activateAction(action);
        baseActions[name].action = action;
        allActions.push(action);
      } else if (additiveActions[name]) {
        // Make the clip additive and remove the reference frame

        THREE.AnimationUtils.makeClipAdditive(clip);

        if (clip.name.endsWith("_pose")) {
          clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
        }

        const action = mixer.clipAction(clip);
        activateAction(action);
        additiveActions[name].action = action;
        allActions.push(action);
      }
    }
  });

  /////// * /////////// * /////////// * CHARACTER * /////////// *

  // END SCENE

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 25;

  clock = new THREE.Clock();

  createPanel();
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  stats.update();

  render();
}
function render() {
  for (let i = 0; i !== numAnimations; ++i) {
    const action = allActions[i];
    const clip = action.getClip();
    const settings = baseActions[clip.name] || additiveActions[clip.name];
    settings.weight = action.getEffectiveWeight();
  }

  if (mixer) {
    mixer.update(clock.getDelta());
  }

  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  init();
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

function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

function activateAction(action) {
  const clip = action.getClip();
  const settings = baseActions[clip.name] || additiveActions[clip.name];
  setWeight(action, settings.weight);
  action.play();
}

function createPanel() {
  const panel = new GUI({ width: 310 });

  const folder1 = panel.addFolder("Base Actions");
  const folder2 = panel.addFolder("Additive Action Weights");
  const folder3 = panel.addFolder("General Speed");

  panelSettings = {
    "modify time scale": 1.0,
  };

  const baseNames = ["None", ...Object.keys(baseActions)];

  for (let i = 0, l = baseNames.length; i !== l; ++i) {
    const name = baseNames[i];
    const settings = baseActions[name];
    panelSettings[name] = function () {
      const currentSettings = baseActions[currentBaseAction];
      const currentAction = currentSettings ? currentSettings.action : null;
      const action = settings ? settings.action : null;

      if (currentAction !== action) {
        prepareCrossFade(currentAction, action, 0.35);
      }
    };

    crossFadeControls.push(folder1.add(panelSettings, name));
  }

  for (const name of Object.keys(additiveActions)) {
    const settings = additiveActions[name];

    panelSettings[name] = settings.weight;
    folder2
      .add(panelSettings, name, 0.0, 1.0, 0.01)
      .listen()
      .onChange(function (weight) {
        setWeight(settings.action, weight);
        settings.weight = weight;
      });
  }

  folder3
    .add(panelSettings, "modify time scale", 0.0, 1.5, 0.01)
    .onChange(modifyTimeScale);

  folder1.open();
  folder2.open();
  folder3.open();

  crossFadeControls.forEach(function (control) {
    control.setInactive = function () {
      control.domElement.classList.add("control-inactive");
    };

    control.setActive = function () {
      control.domElement.classList.remove("control-inactive");
    };

    const settings = baseActions[control.property];

    if (!settings || !settings.weight) {
      control.setInactive();
    }
  });
}

function prepareCrossFade(startAction, endAction, duration) {
  // If the current action is 'idle', execute the crossfade immediately;
  // else wait until the current action has finished its current loop

  if (currentBaseAction === "idle" || !startAction || !endAction) {
    executeCrossFade(startAction, endAction, duration);
  } else {
    synchronizeCrossFade(startAction, endAction, duration);
  }

  // Update control colors

  if (endAction) {
    const clip = endAction.getClip();
    currentBaseAction = clip.name;
  } else {
    currentBaseAction = "None";
  }

  crossFadeControls.forEach(function (control) {
    const name = control.property;

    if (name === currentBaseAction) {
      control.setActive();
    } else {
      control.setInactive();
    }
  });
}

function synchronizeCrossFade(startAction, endAction, duration) {
  mixer.addEventListener("loop", onLoopFinished);

  function onLoopFinished(event) {
    if (event.action === startAction) {
      mixer.removeEventListener("loop", onLoopFinished);

      executeCrossFade(startAction, endAction, duration);
    }
  }
}

function executeCrossFade(startAction, endAction, duration) {
  // Not only the start action, but also the end action must get a weight of 1 before fading
  // (concerning the start action this is already guaranteed in this place)

  if (endAction) {
    setWeight(endAction, 1);
    endAction.time = 0;

    if (startAction) {
      // Crossfade with warping

      startAction.crossFadeTo(endAction, duration, true);
    } else {
      // Fade in

      endAction.fadeIn(duration);
    }
  } else {
    // Fade out

    startAction.fadeOut(duration);
  }
}

function modifyTimeScale(speed) {
  mixer.timeScale = speed;
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

// EVENTS
window.addEventListener("resize", onWindowResize);
