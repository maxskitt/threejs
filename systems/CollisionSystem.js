import { System } from "ecsy";
import { Collision, Movement, Object3D } from "../components/components.mjs";

export class CollisionSystem extends System {
  execute(delta, time) {
    let entities = this.queries.entities.results;

    entities.forEach((entity1, index) => {
      const collision1 = entity1.getComponent(Collision);
      const object3D1 = entity1.getComponent(Object3D);

      entities.slice(index + 1).forEach((entity2) => {
        const collision2 = entity2.getComponent(Collision);
        const object3D2 = entity2.getComponent(Object3D);

        const distance = object3D1.object.position.distanceTo(
          object3D2.object.position,
        );
        const minDistance = collision1.radius + collision2.radius;

        if (distance < minDistance) {
          console.log(`Collision between entity1 and entity2!`);

          // Останавливаем объекты entity1 и entity2

          // Устанавливаем состояние остановки для объектов entity1 и entity2
          const movement1 = entity1.getMutableComponent(Movement);
          movement1.isStopped = true;

          const movement2 = entity2.getMutableComponent(Movement);
          movement2.isStopped = true;
          // Обработка коллизии между entity1 и entity2
          // Здесь можно добавить логику обработки коллизии, например, изменение положения или поведения сущностей
          // Можно также обновить список collidedEntities в компоненте Collision для каждой сущности
        }
      });
    });
  }
}

CollisionSystem.queries = {
  entities: { components: [Collision, Object3D, Movement] }, // Система работает с сущностями, имеющими компонент Collision и Object3D
};
