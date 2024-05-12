import * as THREE from "three";

function armySystem(
  redEntities,
  whiteEntities,
  delta,
  animations,
  scene,
  intervalAttack,
) {
  // Если красные объекты закончились, но еще остались белые объекты
  if (redEntities.length === 0 && whiteEntities.length > 0) {
    // Проиграть анимацию для оставшихся белых объектов
    whiteEntities.forEach((whiteEntity) => {
      const currentAction = whiteEntity.mixer.clipAction(animations[2]); // Получаем экземпляр анимации
      const currentActionIsPlaying = currentAction.isRunning(); // Проверяем, играет ли уже эта анимация

      if (!currentActionIsPlaying) {
        whiteEntity.mixer.clipAction(animations[3]).stop();
        whiteEntity.mixer.clipAction(animations[2]).play();
      }
    });

    return;
  }

  // Если белые объекты закончились, но еще остались красные объекты
  if (redEntities.length > 0 && whiteEntities.length === 0) {
    // Проиграть анимацию для оставшихся красных объектов
    redEntities.forEach((redEntity) => {
      const currentAction = redEntity.mixer.clipAction(animations[2]); // Получаем экземпляр анимации
      const currentActionIsPlaying = currentAction.isRunning(); // Проверяем, играет ли уже эта анимация

      if (!currentActionIsPlaying) {
        redEntity.mixer.clipAction(animations[3]).stop();
        redEntity.mixer.clipAction(animations[2]).play();
      }
    });

    return;
  }

  // Объединенный цикл для красных и белых объектов
  for (let i = 0; i < Math.max(redEntities.length, whiteEntities.length); i++) {
    const redEntity = redEntities[i];
    const whiteEntity = whiteEntities[i];

    // Если есть красный объект для обработки
    if (redEntity) {

      const closestWhiteEntity = findEntity(redEntity.object, whiteEntities);

      if (closestWhiteEntity !== -1) {
        const currentAction = redEntity.mixer.clipAction(animations[3]); // Получаем экземпляр анимации
        const currentActionIsPlaying = currentAction.isRunning(); // Проверяем, играет ли уже эта анимация

        const getWhiteEntity = whiteEntities[closestWhiteEntity];
        // Calculate distance between currentModel and nearestModel
        const distance = redEntity.object.position.distanceTo(
          getWhiteEntity.object.position,
        );

        if (distance > 1) {
          if (!currentActionIsPlaying) {
            // Play the same animation for each model
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
            // Play the same animation for each model
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
          // Play the same animation for each model
          if (!currentActionIsPlaying) {
            redEntity.mixer.clipAction(animations[3]).stop();
            redEntity.mixer.clipAction(animations[2]).play();
          }

          // Remove redEntity if health is <= 0
          whiteEntities.splice(closestWhiteEntity, 1); // Remove from array
          scene.remove(getWhiteEntity.object); // Remove from scene
        }
      }
    }

    // Если есть белый объект для обработки
    if (whiteEntity) {
      const closestRedEntity = findEntity(whiteEntity.object, redEntities);

      if (closestRedEntity !== -1) {
        const currentAction = whiteEntity.mixer.clipAction(animations[3]); // Получаем экземпляр анимации
        const currentActionIsPlaying = currentAction.isRunning(); // Проверяем, играет ли уже эта анимация

        const getRedEntity = redEntities[closestRedEntity];
        // Calculate distance between currentModel and nearestModel
        const distance = whiteEntity.object.position.distanceTo(
          getRedEntity.object.position,
        );

        if (distance > 1) {
          if (!currentActionIsPlaying) {
            // Play the same animation for each model
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
            // Play the same animation for each model
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
            // Play the same animation for each model
            whiteEntity.mixer.clipAction(animations[3]).stop();
            whiteEntity.mixer.clipAction(animations[2]).play();
          }

          // Remove redEntity if health is <= 0
          redEntities.splice(closestRedEntity, 1); // Remove from array
          scene.remove(getRedEntity.object); // Remove from scene
        }
      }
    }
  }
}

function findEntity(entity, entities) {
  let closestIndex = -1;
  let minDistance = Infinity;

  // Проходим по всем объектам и ищем ближайший
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
  // Clone the target position
  const targetPosition = targetEntity.position.clone();

  // Linear interpolation between current and target position
  const newPosition = entity.position.clone().lerp(targetPosition, 0.5);

  // Calculate the direction vector
  const direction = new THREE.Vector3()
    .copy(newPosition)
    .sub(entity.position)
    .normalize();

  // Calculate the movement amount based on speed and time
  const moveAmount = movementSpeed * delta;

  // Move the entity towards the target position
  entity.position.add(direction.multiplyScalar(moveAmount));

  // Look at the target entity
  entity.lookAt(targetEntity.position);
  // entity.lookAt(entity.position);
}

function stop() {}

export default armySystem;
