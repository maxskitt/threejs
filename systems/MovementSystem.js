// И в вашей системе вы можете использовать компонент перемещения для обработки движения
import { System } from "ecsy";
import { Movement, Object3D, Target } from "../components/components.mjs";

export class MovementSystem extends System {
  execute(delta, time) {
    let entities = this.queries.entities.results;
    entities.forEach((entity) => {
      const movement = entity.getComponent(Movement);
      const object3D = entity.getComponent(Object3D);
      const target = entity.getComponent(Target);

      if (target && target.entityId !== null && !movement.isStopped) {
        // Если цель есть, двигаем объект к цели
        const targetPosition = target.position; // Предполагается, что у компонента Target есть поле position, где хранятся координаты цели
        const currentPosition = object3D.object.position;

        // Рассчитываем вектор направления к цели
        const direction = targetPosition
          .clone()
          .sub(currentPosition)
          .normalize();

        // Перемещаем объект в направлении цели
        object3D.object.position.add(
          direction.multiplyScalar(movement.speed * delta),
        );
      }
    });
  }
}

MovementSystem.queries = {
  entities: { components: [Movement, Object3D, Target] }, // Система работает с сущностями, имеющими компонент перемещения и компонент Object3D
};
