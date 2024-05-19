import * as THREE from "three";
import { Octree } from "three/addons/math/Octree.js";
import { System } from "ecsy";
import { TargetInstance, Object3D } from "../components/components.mjs";
import { handleObjectByType } from "../utils/checkObjectType";
import { kdTree } from "kd-tree-javascript";

export class TargetSystem extends System {
  execute(delta, time) {
    let entities = this.queries.targets.results;

    // Собираем все InstancedMesh из сущностей
    const instancedMeshes = [];
    entities.forEach((entity) => {
      const object = entity.getComponent(Object3D).object;
      const typeObject = handleObjectByType(object);

      if (typeObject === "isInstancedMesh") {
        instancedMeshes.push(object);


      }
    });

    // Обновляем цели для каждого InstancedMesh
    instancedMeshes.forEach((sourceMesh) => {
      const nearestInstances = updateTargetsForInstancedMesh(
        sourceMesh,
        instancedMeshes,
      );

      // Записываем найденные экземпляры в компонент TargetInstance
      // const targetInstance = entity.getMutableComponent(TargetInstance);
      // targetInstance.targetID = nearestInstances;

      nearestInstances.forEach(
        ({ sourceInstanceId, targetMeshIndex, targetInstanceId, position }) => {
          console.log(
            `Source Instance ID: ${sourceInstanceId} is nearest to Target Mesh Index: ${targetMeshIndex}, Target Instance ID: ${targetInstanceId} at Position:`,
            position,
          );
        },
      );
    });
  }
}

function updateTargetsForInstancedMesh(sourceMesh, targetMeshes) {
  const sourceCount = sourceMesh.count;
  const sourcePoints = [];
  const dummy = new THREE.Object3D(); // Вспомогательный объект для получения позиции экземпляра

  // Сборка точек из sourceMesh
  for (let i = 0; i < sourceCount; i++) {
    sourceMesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.rotation, dummy.scale);
    sourcePoints.push([
      dummy.position.x,
      dummy.position.y,
      dummy.position.z,
      i,
    ]);
  }

  // Построение K-D дерева для sourcePoints
  const distance = (a, b) => {
    return Math.sqrt(
      (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2,
    );
  };

  const kdtree = new kdTree(sourcePoints, distance, [0, 1, 2]);

  const nearestInstances = [];

  // Поиск ближайших точек из sourceMesh для каждого экземпляра из targetMeshes
  targetMeshes.forEach((targetMesh, meshIndex) => {
    if (targetMesh === sourceMesh) return; // Пропускаем сам источник

    const targetCount = targetMesh.count;

    for (let i = 0; i < targetCount; i++) {
      targetMesh.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.rotation, dummy.scale);
      const nearest = kdtree.nearest(
        [dummy.position.x, dummy.position.y, dummy.position.z],
        1,
      );

      if (nearest.length > 0) {
        const nearestPoint = nearest[0][0];
        const nearestInstanceId = nearestPoint[3];


        nearestInstances.push({
          sourceInstanceId: nearestInstanceId,
          targetMeshIndex: meshIndex,
          targetInstanceId: i,
          position: dummy.position.clone(),
        });
      }
    }
  });

  return nearestInstances;
}

TargetSystem.queries = {
  targets: { components: [Object3D, TargetInstance] },
};
