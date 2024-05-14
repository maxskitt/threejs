import * as THREE from "three";
import Stats from "stats.js";
import { Entity } from "./entities/Entity.js";
import { TransformComponent } from "./components/TransformComponent.js";
import { MeshComponent } from "./components/MeshComponent.js";
import { SystemManager } from "./systems/SystemManager";
import { createSystems } from "./systems/SystemFactory";
import { HPComponent } from "./components/HPComponent";
import { DamageComponent } from "./components/DamageComponent";
import { IDComponent } from "./components/IDComponent";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ArmyComponent } from "./components/ArmyComponent";
import { ClosestEnemyComponent } from "./components/ClosestEnemyComponent";

let scene, camera, renderer, stats, clock, controls;
const entities = [];
const systemManager = new SystemManager();

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
  camera.position.z = 5;

  // Создание рендерера
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Создание stats
  stats = new Stats();
  container.appendChild(stats.dom);

  // Создание нескольких кубов
  const cubeCount = 3;
  const distanceBetweenCubes = 10; // Расстояние между кубами по оси X

  for (let i = 0; i < cubeCount; i++) {
    const cubeEntity = new Entity();
    cubeEntity.addComponent(new IDComponent(i)); // Добавление компонента ID
    cubeEntity.addComponent(new ArmyComponent(i)); // Добавление компонента Army с идентификатором 1 (например)
    const transformComponent = new TransformComponent();
    transformComponent.position.x = i * distanceBetweenCubes; // Расстояние между кубами по оси X
    cubeEntity.addComponent(transformComponent);
    cubeEntity.addComponent(
      new MeshComponent(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      ),
    );
    cubeEntity.addComponent(new HPComponent(100)); // Добавление компонента HP с 100 очками здоровья
    cubeEntity.addComponent(new DamageComponent(1)); // Добавление компонента Damage с 1 очком урона
    cubeEntity.addComponent(new ClosestEnemyComponent());

    scene.add(cubeEntity.getComponent("MeshComponent").mesh); // Добавление меша в сцену
    entities.push(cubeEntity);
  }

  // Обработка изменения размера окна
  window.addEventListener("resize", onWindowResize, false);

  // Создание и регистрация систем через фабрику систем
  createSystems(systemManager, entities, renderer, scene, camera, clock);

  // Анимация
  function animate() {
    requestAnimationFrame(animate);

    systemManager.update();

    stats.update();
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

init();
