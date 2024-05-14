import { System } from "./System";

export class RotationSystem extends System {
  update() {
    this.entities.forEach(entity => {
      const transform = entity.getComponent('TransformComponent');
      if (transform) {
        transform.rotation.x += 0.01;
        transform.rotation.y += 0.01;
      }
    });
  }
}
