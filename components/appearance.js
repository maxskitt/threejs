import * as THREE from "three";

const createAppearanceComponent = () => {
  // Создаем скелет и привязываем его к модели
  const bone1 = new THREE.Bone();
  bone1.position.set(0, 0, 0); // Установка позиции первой кости

  const bone2 = new THREE.Bone();
  bone2.position.set(0, 0, 0); // Установка позиции второй кости

  const skeleton = new THREE.Skeleton([bone1, bone2]);

  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const mesh = new THREE.SkinnedMesh(geometry, material);
  mesh.add(skeleton.bones[0]); // Привязываем модель к скелету

  // Привязываем кость к модели (это просто пример, вы можете добавить больше костей и настроить их по мере необходимости)
  mesh.skeleton = skeleton;
  mesh.bind(skeleton);

  // Добавляем анимацию: вращение модели
  const animate = () => {
    mesh.rotation.y += 0.01;
  };

  // Возвращаем объект компонента с возможностью анимации и параметрами
  return {
    mesh: mesh, // Меш персонажа
    animate: animate, // Функция анимации
    setColor: (color) => {
      // Функция для установки цвета персонажа
      mesh.material.color.set(color);
    },
    setSize: (width, height, depth) => {
      // Функция для изменения размеров персонажа
      mesh.scale.set(width, height, depth);
    },
  };
};

export default createAppearanceComponent;
