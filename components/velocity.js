const createVelocityComponent = (initialDx, initialDy) => {
  let dx = initialDx;
  let dy = initialDy;

  return {
    getDx: () => dx,
    getDy: () => dy,
    setDx: (newDx) => {
      dx = newDx;
    },
    setDy: (newDy) => {
      dy = newDy;
    },
    setVelocity: (newDx, newDy) => {
      dx = newDx;
      dy = newDy;
    },
  };
};

export default createVelocityComponent;
