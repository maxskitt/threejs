import * as THREE from "three";
import { World } from "ecsy";
import Stats from "stats.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Movement,
  Object3D,
  Target,
  Collider,
  Allegiance,
  UID,
  Attack,
  Health,
  TargetInstance,
} from "./components/components.mjs";
import {
  AliveCheckSystem,
  AttackSystem,
  MovementSystem,
  TargetSystem,
  // CollisionSystem,
} from "./systems/systems.mjs";

let world = new World();

world
  .registerComponent(Object3D)
  .registerComponent(Target)
  .registerComponent(TargetInstance)
  .registerComponent(UID)
  .registerComponent(Movement)
  .registerComponent(Attack)
  .registerComponent(Health)
  .registerComponent(Collider)
  .registerComponent(Allegiance);

world
  .registerSystem(TargetSystem)
  .registerSystem(MovementSystem)
  .registerSystem(AliveCheckSystem)
  .registerSystem(AttackSystem);
//   .registerSystem(CollisionSystem);

let scene, camera, renderer, stats, clock, controls;

init();

function init() {
  const container = document.querySelector(".container");

  // Создание сцены
  scene = new THREE.Scene();

  clock = new THREE.Clock();

  // Создание камеры
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  // Устанавливаем положение камеры
  camera.position.set(0, 0, 5);

  // Направляем камеру на центр сцены
  camera.lookAt(0, 0, 0);

  // Красный
  const geometryRed = new THREE.BoxGeometry();
  const materialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const countRed = 1;
  const meshRed = new THREE.InstancedMesh(geometryRed, materialRed, countRed);

  // Зелёный
  const geometryGreen = new THREE.BoxGeometry();
  const materialGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const countGreen = 100;
  const meshGreen = new THREE.InstancedMesh(
    geometryGreen,
    materialGreen,
    countGreen,
  );

  // Создаем массив матриц трансформации и применяем их для всех наборов
  const offsetsR = [];
  const offsets = [];
  for (let i = 0; i < countRed; i++) {
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(i * 2, 2, 0);
    offsets.push(matrix);
  }

  for (let i = 0; i < countGreen; i++) {
    const matrix = new THREE.Matrix4();

    matrix.makeTranslation(i * 2, 0, 0);
    offsetsR.push(matrix);
  }

  for (let i = 0; i < countRed; i++) {
    meshRed.setMatrixAt(i, offsets[i]);

  }
  for (let i = 0; i < countGreen; i++) {
    meshGreen.setMatrixAt(i, offsetsR[i]);

  }

  scene.add(meshRed);
  scene.add(meshGreen);

  console.log(meshRed, "meshRed");


  const instancedMeshEntity = world.createEntity();
  instancedMeshEntity
    .addComponent(Object3D, { object: meshGreen })
    .addComponent(TargetInstance, {
      targetID: new Array(countGreen).fill(null),
    })
    .addComponent(Movement);

  const instancedMeshEntityR = world.createEntity();
  instancedMeshEntityR
    .addComponent(Object3D, { object: meshRed })
    .addComponent(TargetInstance, {
      targetID: new Array(countRed).fill(null),
    })
    .addComponent(Movement);

  console.log(world, "meshGreen");

  // Создание рендерера
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Создание stats
  stats = new Stats();
  container.appendChild(stats.dom);

  // Обработка изменения размера окна
  window.addEventListener("resize", onWindowResize, false);

  // Анимация
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;

    // console.log(world, "world");

    // console.time("render");
    world.execute(delta, elapsedTime);
    // console.timeEnd("render");

    stats.update();
    renderer.render(scene, camera);
  }

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
}
