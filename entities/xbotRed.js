import * as THREE from "three";
// import { ModelComponent } from "../components/model";
import { AnimationSystem } from "../systems/systems";
function createXbotRedEntity(scene, url) {
  // Create entity object
  const entity = {};

  // Transform component
  entity.transform = {
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  };

  // Model component
  // entity.model = new ModelComponent(url, scene);


  console.log(entity.model, "entity.model");

  // Animation component (example)
  // entity.animation =  new AnimationSystem(models);

  return entity;
}

export default createXbotRedEntity;

// const modelState = {
//   id: models.length,
//   model: model,
//   mixer: mixer,
//   idleAction: idleAction,
//   walkAction: walkAction,
//   isWalking: false,
// };

// Movement component
// entity.movement = {
//   speed: 0.1,
//   move: function (direction) {
//     // Move the character in the specified direction
//     const delta = direction.clone().multiplyScalar(this.speed);
//     entity.transform.position.add(delta);
//   },
// };
