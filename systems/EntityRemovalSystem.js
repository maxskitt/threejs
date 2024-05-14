import { System } from "./System";

export class EntityRemovalSystem extends System {
  constructor(entities, scene) {
    super(entities);
    this.scene = scene;
  }

  update() {
    this.entities.forEach((entity) => {
      const hpComponent = entity.getComponent("HPComponent");
      if (hpComponent && hpComponent.currentHP === 0) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
          const meshComponent = entity.getComponent("MeshComponent");
          const objectToRemove = meshComponent.mesh; // Предположим, что у сущности есть свойство object, содержащее объект Three.js

          if (objectToRemove) {
            this.scene.remove(objectToRemove); // Удаляем объект из сцены
          }

          // Удаление сущности из системы управления сущностями
          this.entities.splice(index, 1);
        }
      }
    });
  }
}
