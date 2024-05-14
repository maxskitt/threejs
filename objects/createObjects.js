import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

let scene, physicsWorld, rigidBodies;

let animations = [];
let mixers;
let xbotmodelRedClone;
let xbotmodelWhiteClone;

function createObjects(
  sceneState,
  physicsWorldState,
  rigidBodiesState,
  loader,
  mixersState,
  animationsState,
) {
  scene = sceneState;
  physicsWorld = physicsWorldState;
  rigidBodies = rigidBodiesState;
  mixers = mixersState;
  animations = animationsState;

  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  pos.set(0, -0.5, 0);
  quat.set(0, 0, 0, 1);
  const ground = createParalellepiped(
    60,
    1,
    60,
    0,
    pos,
    quat,
    new THREE.MeshPhongMaterial({ color: 0x006400 }),
  );

  loader.load("assets/models/XbotWhite.glb", (gltf) => {
    xbotmodelWhiteClone = gltf.scene;
    animations = gltf.animations;

    const clonedModel = SkeletonUtils.clone(xbotmodelWhiteClone);

    const mixer = new THREE.AnimationMixer(clonedModel);

    // Get the current quaternion of the cloned model
    const currentPosition = clonedModel.position;
    const currentQuaternion = clonedModel.quaternion;

    pos.set(currentPosition.x, currentPosition.y, currentPosition.z);
    quat.set(
      currentQuaternion.x,
      currentQuaternion.y,
      currentQuaternion.z,
      currentQuaternion.w,
    );

    const shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 1, 0.5));
    shape.setMargin(0.05);

    createRigidBody(clonedModel, shape, 1, pos, quat);

    mixer.clipAction(animations[2]).play();

    mixers.push(mixer);

    if (animationsState.length === 0) {
      animationsState.push(gltf.animations);
    }
  });

  loader.load("assets/models/XbotRed.glb", (gltf) => {
    xbotmodelRedClone = gltf.scene;
    animations = gltf.animations;

    for (let i = 0; i < 20; i++) {
      const clonedModel = SkeletonUtils.clone(xbotmodelRedClone);

      createPosition(false, true, clonedModel, i);

      // Get the current quaternion of the cloned model
      const currentPosition = clonedModel.position;
      const currentQuaternion = clonedModel.quaternion;

      const mixer = new THREE.AnimationMixer(clonedModel);

      pos.set(currentPosition.x, currentPosition.y, currentPosition.z);
      quat.set(
        currentQuaternion.x,
        currentQuaternion.y,
        currentQuaternion.z,
        currentQuaternion.w,
      );

      const shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 1, 0.5));
      shape.setMargin(0.05);

      createRigidBody(clonedModel, shape, 1, pos, quat);

      mixer.clipAction(animations[2]).play();

      mixers.push(mixer);

      if (animationsState.length === 0) {
        animationsState.push(gltf.animations);
      }
    }
  });
}

function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
  const threeObject = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1),
    material,
  );
  const shape = new Ammo.btBoxShape(
    new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5),
  );
  shape.setMargin(0.05);

  createRigidBody(threeObject, shape, mass, pos, quat);

  return threeObject;
}

function createRigidBody(threeObject, physicsShape, mass, pos, quat) {
  threeObject.position.copy(pos);
  threeObject.quaternion.copy(quat);

  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  physicsShape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    physicsShape,
    localInertia,
  );
  const body = new Ammo.btRigidBody(rbInfo);

  threeObject.userData.physicsBody = body;

  scene.add(threeObject);

  if (mass > 0) {
    rigidBodies.push(threeObject);

    // Disable deactivation
    body.setActivationState(4);
  }

  physicsWorld.addRigidBody(body);
}

function createPosition(isDefault, isRed, clonedModel, i) {
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
}

export { createObjects };
