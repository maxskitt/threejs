import { RenderSystem } from "./RenderSystem.js";
import { DamageSystem } from "./DamageSystem";
import { EntityRemovalSystem } from "./EntityRemovalSystem";
import { MovementSystem } from "./MovementSystem";
import { TargetingSystem } from "./TargetingSystem";

export function createSystems(
  systemManager,
  entities,
  renderer,
  scene,
  camera,
  clock
) {
  const renderSystem = new RenderSystem(entities, renderer, scene, camera, clock);
  const damageSystem = new DamageSystem(entities, clock);
  const entityRemovalSystem = new EntityRemovalSystem(entities, scene);
  const movementSystem = new MovementSystem(entities);
  const targetingSystem = new TargetingSystem(entities);

  systemManager.addSystem(targetingSystem);
  systemManager.addSystem(movementSystem);
  systemManager.addSystem(damageSystem);
  systemManager.addSystem(entityRemovalSystem);
  systemManager.addSystem(renderSystem);
}
