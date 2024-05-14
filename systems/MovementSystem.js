import { System } from "./System.js";
import * as THREE from "three";

export class MovementSystem extends System {
  constructor(entities) {
    super(entities);
  }

  update(delta) {
    this.entities.forEach((entity) => {
      const transformComponent = entity.getComponent("TransformComponent");
      const velocityComponent = entity.getComponent("VelocityComponent");
      const closestEnemyComponent = entity.getComponent(
        "ClosestEnemyComponent",
      );

      // Проверяем наличие всех необходимых компонентов
      if (
        transformComponent &&
        velocityComponent &&
        closestEnemyComponent &&
        closestEnemyComponent.closestEnemy
      ) {
        const enemyTransform =
          closestEnemyComponent.closestEnemy.getComponent("TransformComponent");
        const direction = new THREE.Vector3()
          .subVectors(enemyTransform.position, transformComponent.position)
          .normalize();
        velocityComponent.velocity.copy(direction).multiplyScalar(0.1); // Скорость движения к цели
        transformComponent.position.addScaledVector(
          velocityComponent.velocity,
          delta,
        );
      }
    });
  }
}
