import { System } from "ecsy";
import { ArmyId, Target, Object3D } from "../components/components.mjs";
export class TargetSystem extends System {
  execute(delta, time) {
    let entities = this.queries.entities.results;

    // Получаем все сущности с компонентами Target, ArmyId, Object3D
    entities.forEach((entity) => {
      const target = entity.getComponent(Target);
      const armyId = entity.getComponent(ArmyId);
      const object3D = entity.getComponent(Object3D);

      // Ищем ближайшего врага
      let minDistance = Infinity;
      let nearestEnemyId = null;
      entities.forEach((otherEntity) => {
        if (entity !== otherEntity) {
          const otherArmyId = otherEntity.getComponent(ArmyId);
          const otherObject3D = otherEntity.getComponent(Object3D);

          // Проверяем, что другая сущность - враг
          if (otherArmyId.armyID !== armyId.armyID) {
            const distance = object3D.object.position.distanceTo(
              otherObject3D.object.position,
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearestEnemyId = otherEntity.getComponent(Target).entityId;
            }
          }
        }
      });

      // Устанавливаем координаты ближайшего врага только один раз после окончания внутреннего цикла
      if (nearestEnemyId !== null) {
        const nearestEnemy = entities.find(
          (e) => e.getComponent(Target).entityId === nearestEnemyId,
        );

        if (nearestEnemy) {
          const nearestEnemyObject3D = nearestEnemy.getComponent(Object3D);

          target.position.set(
            nearestEnemyObject3D.object.position.x,
            nearestEnemyObject3D.object.position.y,
            nearestEnemyObject3D.object.position.z,
          );
        }
      }
    });
  }
}

// Определяем запросы для системы
TargetSystem.queries = {
  entities: { components: [Target, ArmyId, Object3D] },
};
