import { System } from "./System.js";

export class DamageSystem extends System {
  constructor(entities, clock) {
    super(entities);
    this.clock = clock;
  }

  update() {

    this.entities.forEach((entity) => {
      const hpComponent = entity.getComponent("HPComponent");
      const damageComponent = entity.getComponent("DamageComponent");
      if (hpComponent && damageComponent) {
        // Вычисляем урон на основе дельты времени и обновляем текущее здоровье
        const damage = damageComponent.damage * this.clock.getDelta();
        hpComponent.currentHP = Math.max(
          hpComponent.currentHP - damage,
          0,
        );
      }
    });
  }
}
