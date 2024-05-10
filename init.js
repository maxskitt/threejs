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
  const camera = new THREE.PerspectiveCamera(5, sizes.width / sizes.height);
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  // Создаем материал с цветом (зеленый, немного потемнее)
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 }); // зеленый цвет, потемнее

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

  // Создаем равномерное освещение (амбиентное освещение)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Цвет белый, интенсивность 0.5

  // Добавляем освещение на сцену
  scene.add(ambientLight);

  return { sizes, scene, canvas, camera, renderer, controls, clock };
};

export default init;
