import { System } from "ecsy";
import {
  Allegiance,
  Attack,
  Health,
  Target,
} from "../components/components.mjs";
import { log } from "three/nodes";

export class AttackSystem extends System {
  execute(delta, time) {
    this.queries.attackers.results.forEach((attacker) => {
      const attackComponent = attacker.getMutableComponent(Attack);
      const attackerAllegiance = attacker.getComponent(Allegiance);

      this.queries.attacked.results.forEach((defender) => {
        const targetComponent = defender.getComponent(Target);
        const targetAllegiance = defender.getComponent(Allegiance);
        const healthComponent = defender.getMutableComponent(Health);

        if (time < attackComponent.cooldown) {
          return;
        }

        if (
          attackComponent.range >= targetComponent.distance &&
          targetAllegiance.team !== attackerAllegiance.team &&
          healthComponent.isAlive
        ) {
          const damage = attackComponent.damage * delta;
          healthComponent.hp -= damage;
          attackComponent.lastAttackTime = time;

          if (healthComponent.hp <= 0) {
            healthComponent.isAlive = false;
            console.log(`Defender died`);
          }
        }
      });
    });
  }
}

AttackSystem.queries = {
  attackers: { components: [Attack, Allegiance, Target] },
  attacked: {
    components: [Health, Target, Allegiance],
  },
};
