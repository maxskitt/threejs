// components/health.js

const createHealthComponent = (initialHealth) => {
  let health = initialHealth;

  return {
    getHealth: () => health,
    setHealth: (newHealth) => {
      health = newHealth;
    },
    decreaseHealth: (amount) => {
      health -= amount;
      if (health < 0) {
        health = 0;
      }
    },
    increaseHealth: (amount) => {
      health += amount;
      // Можно добавить дополнительные проверки, если нужно ограничить максимальное значение здоровья
    }
  };
};

export default createHealthComponent;
