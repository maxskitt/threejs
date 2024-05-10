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
        console.log("Attack hit White!");
      } else {
        console.log("Attack missed White!");
      }
    },
  };
};

export default createXbotWhiteEntity;
