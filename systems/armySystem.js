import * as THREE from "three";

function armySystem(
  redEntities,
  whiteEntities,
  delta,
  animations,
  scene,
  intervalAttack,
) {
  if (redEntities.length === 0 && whiteEntities.length > 0) {
    whiteEntities.forEach((whiteEntity) => {
      const currentAction = whiteEntity.mixer.clipAction(animations[2]);
      const currentActionIsPlaying = currentAction.isRunning();

      if (!currentActionIsPlaying) {
        whiteEntity.mixer.clipAction(animations[3]).stop();
        whiteEntity.mixer.clipAction(animations[2]).play();
      }
    });

    return;
  }

  if (redEntities.length > 0 && whiteEntities.length === 0) {

    redEntities.forEach((redEntity) => {
      const currentAction = redEntity.mixer.clipAction(animations[2]);
      const currentActionIsPlaying = currentAction.isRunning();

      if (!currentActionIsPlaying) {
        redEntity.mixer.clipAction(animations[3]).stop();
        redEntity.mixer.clipAction(animations[2]).play();
      }
    });

    return;
  }


  for (let i = 0; i < Math.max(redEntities.length, whiteEntities.length); i++) {
    const redEntity = redEntities[i];
    const whiteEntity = whiteEntities[i];


    if (redEntity) {
      const closestWhiteEntity = findEntity(redEntity.object, whiteEntities);

      if (closestWhiteEntity !== -1) {
        const currentAction = redEntity.mixer.clipAction(animations[3]);
        const currentActionIsPlaying = currentAction.isRunning();

        const getWhiteEntity = whiteEntities[closestWhiteEntity];
        const distance = redEntity.object.position.distanceTo(
          getWhiteEntity.object.position,
        );

        if (distance > 1) {
          if (!currentActionIsPlaying) {
            redEntity.mixer.clipAction(animations[2]).stop();
            redEntity.mixer.clipAction(animations[3]).play();
          }

          moveTowards(
            redEntity.object,
            getWhiteEntity.object,
            redEntity.component.speed,
            delta,
          );
        }

        if (distance <= 1 && getWhiteEntity.component.health > 0) {
          if (currentActionIsPlaying) {
            redEntity.mixer.clipAction(animations[3]).stop();
            redEntity.mixer.clipAction(animations[2]).play();
          }

          if (intervalAttack) {
            getWhiteEntity.component.attack(
              getWhiteEntity.component,
              redEntity.component,
            );
          }
        } else if (getWhiteEntity.component.health <= 0) {
          if (!currentActionIsPlaying) {
            redEntity.mixer.clipAction(animations[3]).stop();
            redEntity.mixer.clipAction(animations[2]).play();
          }

          whiteEntities.splice(closestWhiteEntity, 1);
          scene.remove(getWhiteEntity.object);
        }
      }
    }

    if (whiteEntity) {
      const closestRedEntity = findEntity(whiteEntity.object, redEntities);

      if (closestRedEntity !== -1) {
        const currentAction = whiteEntity.mixer.clipAction(animations[3]);
        const currentActionIsPlaying = currentAction.isRunning();

        const getRedEntity = redEntities[closestRedEntity];

        const distance = whiteEntity.object.position.distanceTo(
          getRedEntity.object.position,
        );

        if (distance > 1) {
          if (!currentActionIsPlaying) {
            whiteEntity.mixer.clipAction(animations[2]).stop();
            whiteEntity.mixer.clipAction(animations[3]).play();
          }

          moveTowards(
            whiteEntity.object,
            getRedEntity.object,
            whiteEntity.component.speed,
            delta,
          );
        }

        if (distance <= 1 && getRedEntity.component.health > 0) {
          if (currentActionIsPlaying) {
            whiteEntity.mixer.clipAction(animations[3]).stop();
            whiteEntity.mixer.clipAction(animations[2]).play();
          }

          if (intervalAttack) {
            getRedEntity.component.attack(
              getRedEntity.component,
              whiteEntity.component,
            );
          }
        } else if (getRedEntity.component.health <= 0) {
          if (currentActionIsPlaying) {
            whiteEntity.mixer.clipAction(animations[3]).stop();
            whiteEntity.mixer.clipAction(animations[2]).play();
          }

          redEntities.splice(closestRedEntity, 1);
          scene.remove(getRedEntity.object);
        }
      }
    }
  }
}

function findEntity(entity, entities) {
  let closestIndex = -1;
  let minDistance = Infinity;

  for (let i = 0; i < entities.length; i++) {
    const distance = entity.position.distanceTo(entities[i].object.position);
    if (distance < minDistance) {
      closestIndex = i;
      minDistance = distance;
    }
  }

  return closestIndex;
}

function moveTowards(entity, targetEntity, movementSpeed, delta) {
  if (movementSpeed === 0) return;

  const direction = new THREE.Vector3()
    .copy(targetEntity.position)
    .sub(entity.position)
    .normalize();

  const moveAmount = movementSpeed * delta;

  entity.position.add(direction.multiplyScalar(moveAmount));

  entity.lookAt(targetEntity.position);
}

export default armySystem;
