const createCharacterAISystem = () => {
  // Определение метода rotatePoint
  const rotatePoint = (mesh, angle) => {
    mesh.rotation.y += angle; // Пример логики вращения
  };

  // Возвращение объекта с методом rotatePoint
  return {
    rotatePoint: rotatePoint,
  };
};

export default createCharacterAISystem;
