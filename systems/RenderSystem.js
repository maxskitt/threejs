import { System } from "./System";

export class RenderSystem extends System {
  constructor(entities, renderer, scene, camera, clock) {
    super(entities);
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.clock = clock;
  }

  update() {
    const delta = this.clock.getDelta(); // Получаем дельту времени от часов


    this.entities.forEach((entity) => {
      const transform = entity.getComponent("TransformComponent");
      const meshComponent = entity.getComponent("MeshComponent");


      if (transform && meshComponent) {
        const mesh = meshComponent.mesh;

        // Обновляем позицию, поворот и масштаб меша
        mesh.position.copy(transform.position);
        mesh.rotation.copy(transform.rotation);
        mesh.scale.copy(transform.scale);
      }
    });

    // Рендерим сцену с камерой
    this.renderer.render(this.scene, this.camera);
  }
}
