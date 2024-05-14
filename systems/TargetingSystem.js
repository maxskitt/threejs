import { System } from "./System.js";
import { ClosestEnemyComponent } from "../components/ClosestEnemyComponent";

export class TargetingSystem extends System {
  constructor(entities) {
    super(entities);
  }

  update() {
    this.entities.forEach((entity) => {
      const armyComponent = entity.getComponent("ArmyComponent");
      const transformComponent = entity.getComponent("TransformComponent");

      if (armyComponent && transformComponent) {
        const closestEnemy = this.findClosestEnemy(
          entity,
          armyComponent.armyId,
          transformComponent.position,
        );

        if (closestEnemy) {
          this.updateClosestEnemyComponent(entity, closestEnemy);
        }
      }
    });
  }

  findClosestEnemy(entity, armyId, position) {
    const enemies = this.entities.filter((e) => {
      const enemyArmyComponent = e.getComponent("ArmyComponent");
      return enemyArmyComponent && enemyArmyComponent.armyId !== armyId;
    });

    if (enemies.length === 0) return null;

    return enemies.reduce((closest, enemy) => {
      const enemyPosition = enemy.getComponent("TransformComponent").position;
      const distance = position.distanceTo(enemyPosition);
      const closestDistance = position.distanceTo(
        closest.getComponent("TransformComponent").position,
      );
      return distance < closestDistance ? enemy : closest;
    }, enemies[0]);
  }

  updateClosestEnemyComponent(entity, closestEnemy) {
    let closestEnemyComponent = entity.getComponent("ClosestEnemyComponent");

    if (!closestEnemyComponent) {
      closestEnemyComponent = new ClosestEnemyComponent();
      entity.addComponent(closestEnemyComponent);
    }

    closestEnemyComponent.closestEnemy = closestEnemy;
  }
}
