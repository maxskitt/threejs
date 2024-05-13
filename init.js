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

  camera.position.x = 30;
  camera.position.y = 25;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });

  const planeGeometry = new THREE.PlaneGeometry(60, 60, 32, 32);

  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  planeMesh.rotation.x = -Math.PI / 2;

  planeMesh.position.y = 0;

  scene.add(planeMesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  scene.add(ambientLight);

  return { sizes, scene, canvas, camera, renderer, controls, clock };
};

export default init;
