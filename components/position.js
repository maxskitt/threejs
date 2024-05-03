const createPositionComponent = (initialX, initialY) => {
  let x = initialX;
  let y = initialY;

  return {
    getX: () => x,
    getY: () => y,
    setX: (newX) => {
      x = newX;
    },
    setY: (newY) => {
      y = newY;
    },
    setPosition: (newX, newY) => {
      x = newX;
      y = newY;
    },
    move: (dx, dy) => {
      x += dx;
      y += dy;
    },
  };
};

export default createPositionComponent;
