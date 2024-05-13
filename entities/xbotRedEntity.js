import createXbotRedComponent from "../components/createXbotRedComponent";

const createXbotRedEntity = () => {
  return {
    ...createXbotRedComponent,
    getHealth() {
      return this.health;
    },
    attack(target, otherTarget) {
      const chanceToHit = Math.random();
      const hitProbability = 0.8;

      if (chanceToHit < hitProbability) {
        target.health -= otherTarget.damage;
      }
    },
  };
};

export default createXbotRedEntity;
