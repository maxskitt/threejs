import * as THREE from "three";
import { World } from "ecsy";
import Stats from "stats.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  TargetSystem,
  MovementSystem,
  CollisionSystem,
} from "./systems/systems.mjs";
import {
  ArmyId,
  Movement,
  Object3D,
  Target,
  UI,
  Collision,
} from "./components/components.mjs";

// For debugging
import * as Components from "./components/components.mjs";
window.Components = Components;
import * as Systems from "./systems/systems.mjs";

window.Systems = Systems;
window.THREE = THREE;

let world = new World();

world
  .registerComponent(Object3D)
  .registerComponent(Target)
  .registerComponent(UI)
  .registerComponent(Movement)
  .registerComponent(Collision)
  .registerComponent(ArmyId);

world
  .registerSystem(TargetSystem)
  .registerSystem(MovementSystem)
  .registerSystem(CollisionSystem);

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

  // Создаем зеленый куб
  const geometryGreen = new THREE.BoxGeometry();
  const materialGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  for (let i = 0; i < 10; i++) {
    const cubeGreen = new THREE.Mesh(geometryGreen, materialGreen);
    cubeGreen.position.set(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
    ); // Случайные координаты

    // Создаем сущность для зеленого куба
    const cubeEntity = world.createEntity();
    cubeEntity.addComponent(Object3D, { object: cubeGreen });
    cubeEntity.addComponent(ArmyId, { armyID: "green" });
    cubeEntity.addComponent(UI);
    cubeEntity.addComponent(Movement);
    cubeEntity.addComponent(Collision);
    cubeEntity.addComponent(Target, { entityId: i });

    scene.add(cubeGreen);
  }

  // Создаем красный куб
  const geometryRed = new THREE.BoxGeometry();
  const materialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  for (let i = 0; i < 10; i++) {
    const cubeRed = new THREE.Mesh(geometryRed, materialRed);
    cubeRed.position.set(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
    ); // Случайные координаты

    // Создаем сущность для красного куба
    const cubeEntityRed = world.createEntity();
    cubeEntityRed.addComponent(Object3D, { object: cubeRed });
    cubeEntityRed.addComponent(ArmyId, { armyID: "red" });
    cubeEntityRed.addComponent(UI);
    cubeEntityRed.addComponent(Movement);
    cubeEntityRed.addComponent(Collision);
    cubeEntityRed.addComponent(Target, { entityId: i + 10 });

    scene.add(cubeRed);
  }

  // const geometry = new THREE.BoxGeometry();
  // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Укажите свой материал
  // const count = 50; // Укажите количество экземпляров
  // const mesh = new THREE.InstancedMesh(geometry, material, count);

  // Создаем массив матриц трансформации
  // const offsets = [];
  // for (let i = 0; i < count; i++) {
  //   const matrix = new THREE.Matrix4();
  // Добавляем смещение для каждого экземпляра
  // matrix.makeTranslation(i * 2, 0, 0); // Пример: смещение на i * 2 по оси X
  // offsets.push(matrix);
  // }

  // Устанавливаем матрицы трансформации для экземпляров
  //   for (let i = 0; i < count; i++) {
  //     mesh.setMatrixAt(i, offsets[i]);
  //   }
  //
  //   scene.add(mesh); // Добавьте InstancedMesh к сцене

  // const instancedMeshEntity = world.createEntity();
  // instancedMeshEntity.addComponent(Object3D, { object: mesh });
  // instancedMeshEntity.addComponent(Rotating, { rotatingSpeed: 0.01 });

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
