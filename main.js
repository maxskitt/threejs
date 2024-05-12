import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "stats.js";
import init from "./init";
import createXbotRedEntity from "./entities/xbotRedEntity";
import createXbotWhiteEntity from "./entities/xbotWhiteEntity";
import armySystem from "./systems/armySystem";
import { updatePhysics } from "./physics/physicsUtils";

const { sizes, camera, scene, canvas, controls, renderer, clock } = init();

// Physics variables
const gravityConstant = -9.8;
let collisionConfiguration;
let dispatcher;
let broadphase;
let solver;
let softBodySolver;
let physicsWorld;
const rigidBodies = [];
const margin = 0.05;
let hinge;
let rope;
let transformAux1;

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
const attackInterval = 0.5; // Интервал атаки в секундах

if (WebGL.isWebGLAvailable()) {
  Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    // Загружаем модель и создаем сущность красного робота после загрузки модели
    loadModel("assets/models/XbotRed.glb", true, 20);
    loadModel("assets/models/XbotWhite.glb", false, 20);

    initPhysics();
    animate();
  });
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("app").appendChild(warning);
}

function initPhysics() {
  // Physics configuration

  collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
  dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  broadphase = new Ammo.btDbvtBroadphase();
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  softBodySolver = new Ammo.btDefaultSoftBodySolver();
  physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration,
    softBodySolver,
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
  physicsWorld
    .getWorldInfo()
    .set_m_gravity(new Ammo.btVector3(0, gravityConstant, 0));

  transformAux1 = new Ammo.btTransform();
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
      timeSinceLastAttack = 0;
    }
  }

  addSceneEntity();

  for (const entity of [...xbotRedEntities, ...xbotWhiteEntities]) {
    entity.mixer.update(deltaTime);
  }

  updatePhysics(deltaTime, physicsWorld, rigidBodies, transformAux1);

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
      // Использование рандомного значения для i в диапазоне от 0 до 10
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

      // Поворот модели на 90 градусов вокруг оси Y
      clonedModel.rotation.y = -Math.PI / 2;
    }
    // clonedModel.position.y = 10;

    // Create mixer for each model
    const mixer = new THREE.AnimationMixer(clonedModel);

    // Play the same animation for each model
    mixer.clipAction(animations[2]).play(); // idle

    // Создаем физическое тело для модели
    const rigidBody = createRigidBodyForModel(clonedModel); // Функция createRigidBodyForModel нужно реализовать

    // Add the cloned model and mixer to the scene
    scene.add(clonedModel);
    physicsWorld.addRigidBody(rigidBody);

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

// Функция создания физического тела для модели
function createRigidBodyForModel(model) {
  // Получаем ограничивающий объем (bounding box) модели
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);

  // Определяем размеры капсулы
  const radius = Math.max(size.x, size.z) * 0.5; // Радиус капсулы, выбираем максимальную сторону модели
  const height = size.y; // Высота капсулы равна высоте ограничивающего объема модели

  // Создаем форму для физического тела
  const shape = new Ammo.btCapsuleShape(radius, height);

  // Определяем положение капсулы в центре ограничивающего объема модели
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  const centerPos = new Ammo.btVector3(center.x, center.y, center.z);

  // Создаем трансформацию для физического тела
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(centerPos);

  // Создаем физическое тело с массой и формой
  const mass = 1; // Примерная масса
  const localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);
  const motionState = new Ammo.btDefaultMotionState(transform);
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    shape,
    localInertia,
  );
  const rigidBody = new Ammo.btRigidBody(rbInfo);

  // Возвращаем созданное физическое тело
  return rigidBody;
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

  const isRed = Math.random() < 0.5; // Шанс получить true или false - 50/50

  if (xbotRedCount > 0 && isRed && xbotWhiteEntities.length >= 10) {
    xbotRedCount -= 1;
    console.log(xbotRedCount, "xbotRedCount");
    setupDefaultScene(isRed, 1, false); // Вызов функции с аргументами
  }

  if (xbotWhiteCount > 0 && !isRed && xbotRedEntities.length >= 10) {
    xbotWhiteCount -= 1;
    console.log(xbotWhiteCount, "xbotWhiteCount");
    setupDefaultScene(isRed, 1, false); // Вызов функции с аргументами
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
