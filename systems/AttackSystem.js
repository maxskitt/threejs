import { System } from "ecsy";
import {
  Allegiance,
  Attack,
  Health,
  Movement,
  Target,
} from "../components/components.mjs";

export class AttackSystem extends System {
  execute(delta, time) {
    this.queries.attackers.results.forEach((attacker) => {
      const attackComponent = attacker.getMutableComponent(Attack);
      const attackerAllegiance = attacker.getComponent(Allegiance);
      const attackerMovement = attacker.getMutableComponent(Movement);

      this.queries.attacked.results.forEach((defender) => {
        const targetComponent = defender.getComponent(Target);
        const targetAllegiance = defender.getComponent(Allegiance);
        const healthComponent = defender.getMutableComponent(Health);
        const attackedMovement = defender.getMutableComponent(Movement);

        if (
          attackComponent.range >= targetComponent.distance &&
          targetAllegiance.team !== attackerAllegiance.team &&
          healthComponent.isAlive
        ) {
          attackerMovement.isStopped = true;
          attackedMovement.isStopped = true;

          if (time < attackComponent.cooldown) {
            return;
          }

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
  attackers: { components: [Attack, Allegiance, Movement, Target] },
  attacked: {
    components: [Health, Target, Movement, Allegiance],
  },
};
