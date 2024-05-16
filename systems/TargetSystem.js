import { System } from "ecsy";
import {
  Allegiance,
  Movement,
  Object3D,
  Target,
  UID,
} from "../components/components.mjs";

export class TargetSystem extends System {
  execute(delta, time) {
    const units = this.queries.units.results;
    const potentialTargets = this.queries.potentialTargets.results;

    units.forEach((unitEntity) => {
      const objectCurrent = unitEntity.getComponent(Object3D).object;
      const currentAllegiance = unitEntity.getComponent(Allegiance);
      const currentMovement = unitEntity.getMutableComponent(Movement);
      const currentTarget = unitEntity.getMutableComponent(Target);

      // Найденная ближайшая цель и расстояние до нее
      let nearestTarget = null;
      let nearestDistance = Infinity;

      potentialTargets.forEach((targetEntity) => {
        const objectTarget = targetEntity.getComponent(Object3D).object;
        const targetAllegiance = targetEntity.getComponent(Allegiance);
        const distance = objectCurrent.position.distanceTo(
          objectTarget.position,
        );
        if (
          distance < nearestDistance &&
          objectTarget.id !== objectCurrent.id &&
          targetAllegiance.team !== currentAllegiance.team
        ) {
          nearestDistance = distance;
          nearestTarget = objectTarget.position;
        }
      });

      // Записать ближайшую цель в компонент Movement текущего юнита
      if (nearestTarget) {
        currentTarget.position = nearestTarget;
        currentTarget.distance = nearestDistance;
        currentTarget.active = true;
        currentMovement.isStopped = false;
      }
    });
  }
}
TargetSystem.queries = {
  units: { components: [Object3D, Allegiance, Movement, Target, UID] },
  potentialTargets: {
    components: [Object3D, Allegiance, Movement, Target, UID],
  },
};
