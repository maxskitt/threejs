import { System } from "ecsy";
import { Object3DComponent } from "ecsy-three";
import Rotating from "../components/RotatingComponent";
class RotationSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach((entity) => {
      var rotation = entity.getObject3D().rotation;
      rotation.x += 0.1 * delta;
      rotation.y += 0.1 * delta;
    });
  }
}

RotationSystem.queries = {
  entities: {
    components: [Rotating, Object3DComponent],
  },
};

export default RotationSystem;
