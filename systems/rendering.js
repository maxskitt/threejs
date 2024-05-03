const createRenderingSystem = (scene, renderer, mesh) => {
  const setScene = (newScene) => {
    scene = newScene;
  };

  const setRenderer = (newRenderer) => {
    renderer = newRenderer;
  };

  const render = () => {
    renderer.render(scene, this.camera);
  };

  const addMeshToScene = () => {
    scene.add(mesh);
  };

  return {
    setScene,
    setRenderer,
    render,
    addMeshToScene,
  };
};

export default createRenderingSystem;
