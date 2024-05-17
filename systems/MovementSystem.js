import { System } from "ecsy";
import { Movement, Object3D, Target } from "../components/components.mjs";

export class MovementSystem extends System {
  execute(delta, time) {
    let entities = this.queries.moving.results;

    entities.forEach((entity) => {
      const object = entity.getComponent(Object3D).object;
      const movement = entity.getComponent(Movement);
      const target = entity.getComponent(Target);

      if (movement.isStopped || !target.uuid) {
        return;
      }
      // const foundObject = object.uuid === target.uuid;


      const targetPosition = target.position;
      const direction = targetPosition.clone().sub(object.position).normalize();

      // Move towards the target position
      object.position.add(direction.multiplyScalar(movement.speed * delta));
    });
  }
}

MovementSystem.queries = {
  moving: { components: [Object3D, Movement, Target] },
};
