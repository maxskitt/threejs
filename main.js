import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { AmmoPhysics } from "three/addons/physics/AmmoPhysics.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "stats.js";

// Variables
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let stats;
let camera, scene, renderer, controls;

let model, skeleton, mixer, clock;
const crossFadeControls = [];

// Массив для хранения боксов
let boxesRed = [];
let boxesBlue = [];
let physics, position;

const mixers = [],
  objects = [];

let wall1, wall2, wall3, wall4;

let currentBaseAction = "idle";
const allActions = [];
const baseActions = {
  idle: { weight: 1 },
  walk: { weight: 0 },
  run: { weight: 0 },
};
let panelSettings, numAnimations;

// Переменные для управления движением и анимацией
let movementSpeed = 0.1; // Скорость перемещения объекта

if (WebGL.isWebGLAvailable()) {
    init();
    animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("app").appendChild(warning);
}

async function init() {
  // Создание рендерера
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  document.getElementById("app").appendChild(renderer.domElement);

  physics = await AmmoPhysics();
  // position = new THREE.Vector3();

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    75,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    0.1,
    1000,
  );
  // END CAMERA

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x999999);

  // Создаем оси XYZ
  const axesHelper = new THREE.AxesHelper(5); // Длина осей - 5 единиц
  scene.add(axesHelper);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0.5, 1.0, 0.5).normalize();

  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    3500,
  );

  camera.position.y = 10;
  camera.position.z = -25;

  scene.add(camera);
  // Вызов функции для создания боксов и сохранение их в массиве
  createBoxes();
  // scene.add(boxes);

  controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 1;
  // controls.maxDistance = 25;

  clock = new THREE.Clock();

  const grid = new THREE.GridHelper(60, 50, 0xffffff, 0x7b7b7b);
  scene.add(grid);

  // Создаем загрузчик текстур
  const textureLoader = new THREE.TextureLoader();

  // Загружаем изображение для текстуры
  textureLoader.load(
    "assets/textures/grasslight-big.jpg",
    function (texture) {
      // Создаем материал с текстурой
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      // Создаем геометрию для пола
      const planeGeometry = new THREE.PlaneGeometry(60, 60, 32, 32);

      // Создаем меш пола, используя геометрию и материал
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

      // Поворачиваем пол, чтобы он был параллелен плоскости XZ
      planeMesh.rotation.x = -Math.PI / 2;

      // Позиционируем пол, например, чтобы он находился внизу сцены
      planeMesh.position.y = 0;

      // Добавляем пол на сцену
      scene.add(planeMesh);
    },
    undefined,
    function (error) {
      console.error("Ошибка загрузки текстуры", error);
    },
  );

  // Создаем геометрию и материал для стен
  const wallGeometry = new THREE.BoxGeometry(55, 5, 1); // Ширина, высота, толщина стены
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

  // Создаем стены и устанавливаем их позиции
  wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall1.position.set(0, 2.5, -25); // Позиция стены 1

  wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.position.set(0, 2.5, 25); // Позиция стены 2

  wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall3.position.set(-25, 2.5, 0); // Позиция стены 3
  wall3.rotation.y = Math.PI / 2; // Поворот на 90 градусов

  wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall4.position.set(25, 2.5, 0); // Позиция стены 4
  wall4.rotation.y = Math.PI / 2; // Поворот на 90 градусов

  // Добавляем стены на сцену
  // scene.add(wall1);
  // scene.add(wall2);
  // scene.add(wall3);
  // scene.add(wall4);

  /////// * /////////// * /////////// * CHARACTER * /////////// *

  // Загружаем несколько экземпляров модели
  for (let i = 0; i < 3; i++) {
    // loadModel();
  }

  // loadModel();

  // END SCENE

  // STATS
  stats = new Stats();
  document.body.appendChild(stats.dom);

  /////// * /////////// * /////////// * CHARACTER * /////////// *

  // END SCENE

  createPanel();

  physics.addScene( scene );
}

function animate() {
  requestAnimationFrame(animate);

  render();

  stats.update();
}
function render() {
  if (mixer) {
    // mixer.update(clock.getDelta());
    // for (const mixer of mixers) mixer.update(clock.getDelta());
  }

  // console.log(model, 'model');

  if (model) {
    // Перемещаем объект (например, персонажа)
    // model.userData.previousPosition.copy(object.position);
    // Проверяем столкновения с объектами
    // checkCollisions(model);
  }

  // Статическая скорость притяжения
  const attractionSpeed = 1;

  // Притягивание красных и синих блоков друг к другу
  // Примерная реализация обнаружения столкновений
  // updatePositionsAndCollisions();

  renderer.render(scene, camera);
}

// Функция для загрузки и добавления модели
function loadModel() {
  const loader = new GLTFLoader();

  loader.load("assets/models/Xbot.glb", function (gltf) {
    console.log(gltf, "gltf");
    model = gltf.scene;
    // Генерация случайных координат в диапазоне от -25 до 25
    const randomX = THREE.MathUtils.randFloat(-24, 24);
    // const randomX = 0;
    const randomY = 0;
    // const randomZ = 0;
    const randomZ = THREE.MathUtils.randFloat(-24, 24);

    // Задайте новые координаты появления модели
    model.position.set(randomX, randomY, randomZ);

    scene.add(model);

    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = true;
    scene.add(skeleton);

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    // mixers.push(mixer);

    numAnimations = animations.length;

    for (let i = 0; i !== numAnimations; ++i) {
      let clip = animations[i];
      const name = clip.name;

      if (baseActions[name]) {
        const action = mixer.clipAction(clip);
        activateAction(action);
        baseActions[name].action = action;
        allActions.push(action);
      }
    }
  });
}

function createBoxes() {
  const totalBoxes = 2000;
  const boxSize = 1;

  // Генерация 1000 красных и 1000 синих боксов
  for (let i = 0; i < totalBoxes; i++) {
    const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    let color, position;
    if (i < totalBoxes / 2) {
      // Красные боксы с положительным x
      color = 0xff0000;
      position = new THREE.Vector3(
        Math.random() * 25 + 3,
        Math.floor(Math.random() * 11 + 1),
        Math.random() * 50 - 25,
      );
    } else {
      // Синие боксы с отрицательным x
      color = 0x0000ff;
      position = new THREE.Vector3(
        -(Math.random() * 25 + 3),
        Math.floor(Math.random() * 11 + 1),
        Math.random() * 50 - 25,
      );
    }
    const material = new THREE.MeshBasicMaterial({ color });
    const box = new THREE.Mesh(geometry, material);

    // Установка позиции бокса
    box.position.copy(position);

    // Создание физического тела для бокса
    // const boxShape = new Ammo.btBoxShape(new Ammo.btVector3(boxSize / 2, boxSize / 2, boxSize / 2));
    // const transform = new Ammo.btTransform();
    // transform.setIdentity();
    // transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    // const motionState = new Ammo.btDefaultMotionState(transform);
    // const localInertia = new Ammo.btVector3(0, 0, 0);
    // boxShape.calculateLocalInertia(1, localInertia);
    // const rbInfo = new Ammo.btRigidBodyConstructionInfo(1, motionState, boxShape, localInertia);
    // const boxBody = new Ammo.btRigidBody(rbInfo);

    // Добавление физического тела в мир
    // physicsWorld.addRigidBody(boxBody);

    // Добавление бокса в массив в зависимости от цвета

    if (i < totalBoxes / 2) {
      boxesRed.push(box);
    } else {
      boxesBlue.push(box);
    }
    scene.add(box);
  }

  console.log(boxesRed, "boxesRed");
}

function updatePositionsAndCollisions() {
  // Получаем время, прошедшее с последнего кадра
  const delta = clock.getDelta();

  for (let i = 0; i < boxesRed.length; i++) {
    for (let j = 0; j < boxesBlue.length; j++) {
      const boxRed = boxesRed[i];
      const boxBlue = boxesBlue[j];
      // Вычисляем вектор направления от красного к синему объекту
      const direction = boxBlue.position
        .clone()
        .sub(boxRed.position)
        .normalize();
      // Устанавливаем скорость движения
      const speed = 0.05;
      // Изменяем позицию красного объекта
      boxRed.position.add(direction.clone().multiplyScalar(speed * delta));
      // Изменяем позицию синего объекта
      boxBlue.position.sub(direction.clone().multiplyScalar(speed * delta));
      // Проверяем столкновение
      if (boxRed.position.distanceTo(boxBlue.position) < 1) {
        // Удаляем объекты из сцены
        scene.remove(boxRed);
        scene.remove(boxBlue);
        // Удаляем объекты из массивов
        boxesRed.splice(i, 1);
        boxesBlue.splice(j, 1);
        // Поскольку мы удалили объекты из массива, сдвигаем индексы
        i--;
        j--;
      }
    }
  }
}

// Функция для управления перемещением модели
function moveModel() {
  if (false) {
    // Перемещайте объект вперед (например, вдоль оси Z)
    model.position.z += movementSpeed;
  }
}

function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

function activateAction(action) {
  const clip = action.getClip();

  const settings = baseActions[clip.name];
  setWeight(action, settings.weight);
  action.play();
}

function createPanel() {
  const panel = new GUI({ width: 310 });

  const folder1 = panel.addFolder("Base Actions");

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

  folder1.open();

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

// Проверка столкновения объекта с стенами
function checkCollisions(object) {
  // Проверяем столкновения с каждой стеной
  const objects = [wall1, wall2, wall3, wall4];
  for (const wall of objects) {
    const collision =
      object.position.distanceTo(wall.position) <
      (object.geometry.parameters.width + wall.geometry.parameters.width) / 2;
    if (collision) {
      // Обработка столкновения
      // Например, отмена перемещения объекта
      object.position.copy(object.userData.previousPosition);
      break; // Выходим из цикла, если найдено столкновение
    }
  }
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

// EVENTS
window.addEventListener("resize", onWindowResize);

window.addEventListener("DOMContentLoaded", () => {
  Ammo().then((AmmoLoaded) => {
    window.Ammo = AmmoLoaded;
    // new Game("renderCanvas");
  });
});
