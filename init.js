import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const init = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const canvas = document.querySelector(".canvas");
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  // Создаем оси XYZ
  const axesHelper = new THREE.AxesHelper(5); // Длина осей - 5 единиц
  scene.add(axesHelper);

  // grid - сетка
  const grid = new THREE.GridHelper(60, 50, 0xffffff, 0x7b7b7b);
  scene.add(grid);

  // Создаем загрузчик текстур
  const textureLoader = new THREE.TextureLoader();

  // Загружаем изображение для текстуры
  textureLoader.load(
    "assets/textures/grasslight-big.jpg",
    function (texture) {
      // Создаем материал с текстурой
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      // Создаем геометрию для пола
      const planeGeometry = new THREE.PlaneGeometry(60, 60, 32, 32);

      // Создаем меш пола, используя геометрию и материал
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

      // Поворачиваем пол, чтобы он был параллелен плоскости XZ
      planeMesh.rotation.x = -Math.PI / 2;

      // Позиционируем пол, например, чтобы он находился внизу сцены
      planeMesh.position.y = 0;

      // Добавляем пол на сцену
      scene.add(planeMesh);
    },
    undefined,
    function (error) {
      console.error("Ошибка загрузки текстуры", error);
    },
  );

  // Создаем геометрию и материал для стен
  const wallGeometry = new THREE.BoxGeometry(55, 5, 1); // Ширина, высота, толщина стены
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

  // Создаем новую группу
  let wallsGroup = new THREE.Group();

  // Создаем стены и добавляем их в группу
  let wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall1.position.set(0, 2.5, -25); // Позиция стены 1
  wallsGroup.add(wall1);

  let wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.position.set(0, 2.5, 25); // Позиция стены 2
  wallsGroup.add(wall2);

  let wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall3.position.set(-25, 2.5, 0); // Позиция стены 3
  wall3.rotation.y = Math.PI / 2; // Поворот на 90 градусов
  wallsGroup.add(wall3);

  let wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall4.position.set(25, 2.5, 0); // Позиция стены 4
  wall4.rotation.y = Math.PI / 2; // Поворот на 90 градусов
  wallsGroup.add(wall4);

  // Добавляем группу стен на сцену
  scene.add(wallsGroup);

  // Создаем направленный свет
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Цвет света и его интенсивность
  directionalLight.position.set(0, 1, 0); // Устанавливаем позицию света
  scene.add(directionalLight);

  // Создаем линии для визуализации направления света
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5,
  ); // Размер линии
  scene.add(directionalLightHelper);

  // Создаем точечный свет
  const pointLight = new THREE.PointLight(0xffffff, 0.5); // Цвет света и его интенсивность
  pointLight.position.set(0, 100, 0); // Устанавливаем позицию света
  scene.add(pointLight);

  // Создаем линии для визуализации позиции точечного света
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1); // Размер линии
  scene.add(pointLightHelper);

  return { sizes, scene, canvas, camera, renderer, controls, clock };
};

export default init;
