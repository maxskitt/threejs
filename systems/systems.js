// systems.js
import * as THREE from "three";

class AnimationSystem {
  constructor(models) {
    this.models = models;
    this.clock = new THREE.Clock();
  }

  update() {
    const delta = this.clock.getDelta();

    this.models.forEach((modelState) => {
      if (modelState.mixer) {
        modelState.mixer.update(delt);
      }
    });
  }
}

export { AnimationSystem };
