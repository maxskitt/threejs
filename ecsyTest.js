import * as THREE from "three";
import { Component, System, Types } from "ecsy";
import { initialize, Object3DComponent } from "ecsy-three";
import Rotating from "./components/RotatingComponent";
import RotationSystem from "./systems/RotationSystem";

// Initialize the default sets of entities and systems
const { world, sceneEntity, scene, camera } = initialize();

world.registerComponent(Rotating);

world.registerSystem(RotationSystem);

// Modify the position for the default camera
camera.position.z = 2;

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("assets/textures/grasslight-big.jpg"),
  }),
);


world
  .createEntity()
  .addComponent(Rotating)
  .addObject3DComponent(mesh, sceneEntity);
