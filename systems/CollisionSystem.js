import { System } from "ecsy";
import { Collider, Movement, Position } from "../components/components.mjs";

export class CollisionSystem extends System {
  execute(delta, time) {
    const entities = this.queries.colliders.results;
    for (let i = 0; i < entities.length; i++) {
      const entityA = entities[i];
      const colliderA = entityA.getComponent(Collider);
      const movementA = entityA.getMutableComponent(Movement);
      const positionA = entityA.getComponent(Position).position;

      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j];
        const colliderB = entityB.getComponent(Collider);
        const movementB = entityB.getMutableComponent(Movement);
        const positionB = entityB.getComponent(Position).position;

        if (this.checkCollision(positionA, colliderA, positionB, colliderB)) {
          movementA.isStopped = true;
          movementB.isStopped = true;
        }
      }
    }
  }

  checkCollision(positionA, colliderA, positionB, colliderB) {
    // Simple AABB collision detection
    return (
      positionA.x < positionB.x + colliderB.width &&
      positionA.x + colliderA.width > positionB.x &&
      positionA.y < positionB.y + colliderB.height &&
      positionA.y + colliderA.height > positionB.y
    );
  }
}

CollisionSystem.queries = {
  colliders: { components: [Collider, Position, Movement] },
};
