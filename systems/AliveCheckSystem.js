import { System } from "ecsy";
import { Health, Object3D } from "../components/components.mjs";

export class AliveCheckSystem extends System {
  execute(delta) {
    let entities = this.queries.entities.results;

    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      let healthComponent = entity.getComponent(Health);
      const object = entity.getMutableComponent(Object3D).object;

      // console.log(object.getObjectById(), "object");

      if (!healthComponent.isAlive) {
        // console.log(object, "1");
        object.removeFromParent();
        entity.remove();
      }
    }
  }
}

AliveCheckSystem.queries = {
  entities: { components: [Object3D, Health] },
};
