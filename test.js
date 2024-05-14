import * as THREE from "three";
import { initGraphics } from "./graphics/initGraphics.js";
import { initPhysics } from "./physics/initPhysics.js";
import { createObjects } from "./objects/createObjects.js";

let container, camera, scene, renderer, controls, stats, loader;
let physicsWorld, transformAux1;
const gravityConstant = -9.8;
const clock = new THREE.Clock();

const rigidBodies = [];
const mixers = [];
let animations = [];

Ammo().then(function (AmmoLib) {
  Ammo = AmmoLib;

  init();
  animate();
});

function init() {
  ({ container, camera, scene, renderer, controls, stats, loader } =
    initGraphics());
  ({ physicsWorld, transformAux1 } = initPhysics(gravityConstant));
  createObjects(scene, physicsWorld, rigidBodies, loader, mixers, animations);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  const deltaTime = clock.getDelta();

  for (const mixer of mixers) mixer.update(deltaTime);

  updatePhysics(deltaTime);

  for (const rigidBody of rigidBodies) {
    rigidBody.position.x += 0.5;
  }

  renderer.render(scene, camera);
}

function updatePhysics(deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 10);

  // Update rigid bodies
  for (let i = 0, il = rigidBodies.length; i < il; i++) {
    const objThree = rigidBodies[i];
    const objMixer = mixers[i];
    const objPhys = objThree.userData.physicsBody;
    let tt = i % 2;
    // Переместить объект на одну единицу вправо
    moveRigidBodyAlongX(objThree, objMixer, objPhys, tt ? -1 : 1, deltaTime);

    const ms = objPhys.getMotionState();
    if (ms) {
      ms.getWorldTransform(transformAux1);
      const p = transformAux1.getOrigin();
      // const q = transformAux1.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      // objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
}

function moveRigidBodyAlongX(objThree, objMixer, objPhys, distance, deltaTime) {
  // Получаем текущую позицию и ориентацию объекта
  const transform = objPhys.getWorldTransform();

  // Получаем позицию объекта
  const origin = transform.getOrigin();

  // Проверяем столкновения
  // const collisions = checkCollisions(objThree);

  // Перемещаем объект на заданное расстояние по оси X
  origin.setX(origin.x() + distance * deltaTime);

  // Обновляем позицию объекта
  transform.setOrigin(origin);
}

function checkCollisions(object) {
  // Проверяем столкновения объекта с другими объектами на сцене
  const collisions = [];
  for (let i = 0; i < rigidBodies.length; i++) {
    const otherObject = rigidBodies[i];
    if (
      object !== otherObject &&
      object.position.distanceTo(otherObject.position) < 2
    ) {
      // Если объекты находятся на расстоянии менее 2 единиц, считаем это столкновением
      collisions.push(otherObject);
    }
  }
  return collisions;
}
