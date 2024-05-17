function handleObjectByType(objectTarget) {
  const typeMapping = {
    isMesh: objectTarget.isMesh,
    isInstancedMesh: objectTarget.isInstancedMesh,
    isGroup: objectTarget.isGroup,
  };

  for (const [type, value] of Object.entries(typeMapping)) {
    if (value) {
      return type;
    }
  }

  return null;
}

export { handleObjectByType };
