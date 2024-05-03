const updateEntityPosition = (entity) => {
  const velocity = entity.velocity;
  const position = entity.position;
  position.setX(position.getX() + velocity.getDx());
  position.setY(position.getY() + velocity.getDy());
};

const movementSystem = {
  entities: [],

  addEntity: function (entity) {
    this.entities.push(entity);
  },

  update: function () {
    this.entities.forEach(updateEntityPosition);
  },
};

export default movementSystem;
