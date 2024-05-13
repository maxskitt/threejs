import createXbotWhiteComponent from "../components/createXbotWhiteComponent";

const createXbotWhiteEntity = () => {
  return {
    ...createXbotWhiteComponent,
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

export default createXbotWhiteEntity;
