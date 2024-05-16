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
} from "./components/components.mjs";
import {
  AttackSystem,
  MovementSystem,
  TargetSystem
  // CollisionSystem,
} from "./systems/systems.mjs";

let world = new World();

world
  .registerComponent(Object3D)
  .registerComponent(Target)
  .registerComponent(UID)
  .registerComponent(Movement)
  .registerComponent(Attack)
  .registerComponent(Health)
  .registerComponent(Collider)
  .registerComponent(Allegiance);

world
  .registerSystem(TargetSystem)
  .registerSystem(MovementSystem)
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

  // Создаем зеленый куб
  const geometryGreen = new THREE.BoxGeometry();
  const materialGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  for (let i = 0; i < 1; i++) {
    const cubeGreen = new THREE.Mesh(geometryGreen, materialGreen);
    // cubeGreen.position.set(
    //   Math.random() * 200 - 100,
    //   Math.random() * 200 - 100,
    //   Math.random() * 200 - 100,
    // ); // Случайные координаты

    // Создаем сущность для зеленого куба
    const cubeEntity = world.createEntity();
    cubeEntity.addComponent(Object3D, { object: cubeGreen });
    cubeEntity.addComponent(Allegiance, { team: "green" });
    cubeEntity.addComponent(UID, { uid: `green-${i}` });
    cubeEntity.addComponent(Attack);
    cubeEntity.addComponent(Health);
    cubeEntity.addComponent(Movement);
    cubeEntity.addComponent(Collider, { width: 1, height: 1 });
    cubeEntity.addComponent(Target);

    scene.add(cubeGreen);
  }

  // Создаем красный куб
  const geometryRed = new THREE.BoxGeometry();
  const materialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //
  for (let i = 0; i < 1; i++) {
    const cubeRed = new THREE.Mesh(geometryRed, materialRed);
    cubeRed.position.set(10, 0, 0);
    // cubeRed.position.set(
    //   Math.random() * 200 - 100,
    //   Math.random() * 200 - 100,
    //   Math.random() * 200 - 100,
    // ); // Случайные координаты

    // Создаем сущность для красного куба
    const cubeEntityRed = world.createEntity();
    cubeEntityRed.addComponent(Object3D, { object: cubeRed });
    cubeEntityRed.addComponent(Allegiance, { team: "red" });
    cubeEntityRed.addComponent(UID, { uid: `red-${i}` });
    cubeEntityRed.addComponent(Attack);
    cubeEntityRed.addComponent(Health);
    cubeEntityRed.addComponent(Movement);
    cubeEntityRed.addComponent(Collider, { width: 1, height: 1 });
    cubeEntityRed.addComponent(Target);

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
