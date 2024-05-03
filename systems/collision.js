const checkCollision = (entityA, entityB) => {
  const positionA = entityA.position;
  const positionB = entityB.position;

  // Проверка на столкновение по координатам
  if (
    Math.abs(positionA.getX() - positionB.getX()) < COLLISION_THRESHOLD &&
    Math.abs(positionA.getY() - positionB.getY()) < COLLISION_THRESHOLD
  ) {
    // Обработка столкновения (может включать различные действия)
    console.log(
      `Collision detected between ${entityA.name.getName()} and ${entityB.name.getName()}`,
    );
  }
};

const COLLISION_THRESHOLD = 1; // Порог расстояния для определения столкновения

const collisionSystem = {
  entities: [],

  addEntity: function (entity) {
    this.entities.push(entity);
  },

  update: function () {
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        checkCollision(this.entities[i], this.entities[j]);
      }
    }
  },
};

export default collisionSystem;
