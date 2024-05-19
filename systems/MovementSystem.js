import * as THREE from "three";
import { System } from "ecsy";
import { Movement, Object3D, Target, TargetInstance } from "../components/components.mjs";
import { handleObjectByType } from "../utils/checkObjectType";

export class MovementSystem extends System {
  execute(delta, time) {
    let entities = this.queries.moving.results;

    entities.forEach((entity) => {

      const object = entity.getComponent(Object3D).object;
      const movement = entity.getComponent(Movement);
      const target = entity.getComponent(Target);
      const typeObject = handleObjectByType(object);

      if (typeObject === "isMeshы") {
        moveObjectTowardsTarget(object, target, movement, delta);
      } else if (typeObject === "isInstancedMesh") {
        const targetInstance = entity.getComponent(TargetInstance);
        if (!targetInstance.targetID) return; // Если нет целей, пропустить

        moveInstancedMeshTowardsTarget(object, delta);
      }
    });
  }
}

function moveObjectTowardsTarget(object, target, movement, delta) {
  if (movement.isStopped || !target.uuid) {
    return;
  }

  const targetPosition = target.position;
  const direction = targetPosition.clone().sub(object.position).normalize();

  // Move towards the target position
  object.position.add(direction.multiplyScalar(movement.speed * delta));
}

function moveInstancedMeshTowardsTarget(instancedMesh, delta, targetPosition) {
  return
  const dummy = new THREE.Object3D();

  for (let i = 0; i < instancedMesh.count; i++) {
    const matrix = new THREE.Matrix4();
    instancedMesh.getMatrixAt(i, matrix);

    dummy.matrix.copy(matrix);
    dummy.matrix.decompose(dummy.position, dummy.rotation, dummy.scale);

    // Вычисляем направление движения к цели
    const direction = new THREE.Vector3().subVectors(targetPosition, dummy.position).normalize();

    // Вычисляем новую позицию с учетом скорости и времени
    dummy.position.add(direction.multiplyScalar(1 * delta)); // 1 - скорость движения, можно настроить

    // Обновляем матрицу позиции
    dummy.matrix.compose(dummy.position, dummy.rotation, dummy.scale);
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  // Обновляем флаг, чтобы указать, что матрицы были изменены
  instancedMesh.instanceMatrix.needsUpdate = true;
}

MovementSystem.queries = {
  moving: { components: [Object3D, Movement, TargetInstance] },
};
