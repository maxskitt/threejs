import createNameComponent from "../components/name";
import createFactionComponent from "../components/faction";
import createHealthComponent from "../components/health";
import createPositionComponent from "../components/position";
import createVelocityComponent from "../components/velocity";
import createAppearanceComponent from "../components/appearance";

const createCharacterEntity = (name, faction, characterAISystem) => {
  // Создание компонентов для
  const characterName = createNameComponent(name);
  const characterFaction = createFactionComponent(faction);
  const characterHealth = createHealthComponent(100);
  const characterPosition = createPositionComponent(0, 0);
  const characterVelocity = createVelocityComponent(0, 0);
  const characterAppearance = createAppearanceComponent(); // Создание компонента вида персонажа

  // Возвращаем объект сущности
  return {
    name: characterName,
    faction: characterFaction,
    health: characterHealth,
    position: characterPosition,
    velocity: characterVelocity,
    appearance: characterAppearance,
  };
};

export default createCharacterEntity;
