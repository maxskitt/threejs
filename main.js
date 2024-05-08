import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "stats.js";
import init from "./init";

const { sizes, camera, scene, canvas, controls, renderer, clock } = init();
let models = [];
let mixers = [];
let idleAction, walkAction;
let skeleton = null;
let isWalking = true;


let frames = 0, prevTime = performance.now();

// Initialize variables for tracking FPS
let lastFrameTime = performance.now();

// FPS tracking interval (in milliseconds)
const fpsInterval = 1000; // 1 second

let stats = new Stats();
document.body.appendChild(stats.dom);

camera.position.z = 0;
camera.position.x = 0;
camera.position.y = 35;

// // Define the number of times to load the model
const numberOfModels = 100;
let modelsLoaded = 0;
//

// // Load the same model multiple times using a for loop
for (let i = 0; i < numberOfModels; i++) {
  loadModel("assets/models/XbotWhite.glb");
}

const renderLoop = () => {
  // FPS

  let fps = 0;
  frames ++;
  const time = performance.now();

  if ( time >= prevTime + 1000 ) {
    fps =  Math.round( ( frames * 1000 ) / ( time - prevTime ) );
    frames = 0;
    prevTime = time;

  }

  console.log("FPS: ", fps);

  if (fps >= 30) {
    loadModel("assets/models/Xbot.glb");
  }
};

const animate = () => {
  stats.begin();
  controls.update();
  const delta = clock.getDelta();

  // Call renderLoop to handle FPS tracking and model rendering
  // renderLoop();

  // Call moveModelsTowardsEachOther to update the positions of the models
  if (models.length !== 0) {
    moveModelsTowardsEachOther(delta);
  }

  if (mixers) {
    for (const mixer of mixers) mixer.update(delta);
  }

  renderer.render(scene, camera);
  stats.end();
  window.requestAnimationFrame(animate);
};

if (WebGL.isWebGLAvailable()) {
  init();
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("app").appendChild(warning);
}
function loadModel(url) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    const model = gltf.scene;

    const skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    scene.add(skeleton);

    const animations = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);

    idleAction = mixer.clipAction(animations[2]);
    walkAction = mixer.clipAction(animations[3]);

    idleAction.play();

    scene.add(model);

    model.position.set(Math.random() * 40 - 20, 0, Math.random() * 40 - 20);

    const modelState = {
      id: models.length,
      model: model,
      mixer: mixer,
      idleAction: idleAction,
      walkAction: walkAction,
      isWalking: false,
    };

    models.push(modelState);
    mixers.push(mixer);
  });
}

// Function to move the model
function updateAnimation(modelState) {
  if (modelState.isWalking) {
    modelState.idleAction.stop();
    modelState.walkAction.play();
  } else {
    modelState.walkAction.stop();
    modelState.idleAction.play();
  }
}

// Function to move models towards each other
function moveModelsTowardsEachOther(delta) {
  let numModels = models.length;

  if (numModels === 1) {
    models[0].isWalking = false;
    updateAnimation(models[0]);

    // models = [];
    return;
  }

  for (let i = 0; i < numModels; i++) {
    const currentModel = models[i];
    const model = currentModel.model;

    // Find the nearest model
    let nearestModelIndex = -1;
    let minDistance = Infinity;
    for (let j = 0; j < numModels; j++) {
      if (i !== j) {
        const distance = model.position.distanceTo(models[j].model.position);
        if (distance < minDistance) {
          minDistance = distance;
          nearestModelIndex = j;
        }
      }
    }

    if (nearestModelIndex !== -1) {
      const nearestModel = models[nearestModelIndex].model;

      // Calculate distance between currentModel and nearestModel
      const distance = model.position.distanceTo(nearestModel.position);

      if (distance > 1) {
        currentModel.isWalking = true;
        updateAnimation(currentModel);
        // Move the current model towards the nearest model
        const targetPosition = model.position
          .clone()
          .lerp(nearestModel.position, 0.5);

        const direction = new THREE.Vector3()
          .copy(targetPosition)
          .sub(model.position)
          .normalize();

        // Вычисляем величину перемещения на основе скорости и времени
        const moveAmount = 1 * delta;

        // Перемещаем модели по направлению к целевой позиции
        model.position.add(direction.multiplyScalar(moveAmount));

        // Look at the nearest model
        model.lookAt(nearestModel.position);
      }

      if (distance <= 1) {
        currentModel.isWalking = false;
        updateAnimation(currentModel);
        updateAnimation(models[nearestModelIndex]);

        const randomIndex = Math.round(Math.random());

        if (randomIndex === 0) {
          const indexToRemove = models.findIndex(
            (item) => item.id === currentModel.id,
          ); // Находим индекс элемента с указанным id

          if (indexToRemove !== -1) {
            // Если элемент с указанным id найден
            models.splice(indexToRemove, 1); // Удаляем элемент из исходного массива по индексу
            numModels--; // Уменьшаем количество моделей в массиве
            i--; // Корректируем счетчик цикла
          } else {
            console.log("Элемент с id не найден в массиве.");
          }

          scene.remove(model);
        } else {
          const indexToRemove = models.findIndex(
            (item) => item.id === models[nearestModelIndex].id,
          ); // Находим индекс элемента с указанным id

          if (indexToRemove !== -1) {
            // Если элемент с указанным id найден
            models.splice(indexToRemove, 1); // Удаляем элемент из исходного массива по индексу
            numModels--; // Уменьшаем количество моделей в массиве
            i--; // Корректируем счетчик цикла
          } else {
            console.log("Элемент с id не найден в массиве.");
          }

          scene.remove(nearestModel);
        }
      }
    }
  }

  // for (let i = 0; i < numModels - 1; i += 2) {
  //   const model1State = models[i];
  //   const model2State = models[i + 1];
  //
  //   if (!model2State) {
  //     console.error("Not enough models for pairing.");
  //     break; // Break the loop if there are no more models to pair
  //   }
  //
  //   const model1 = model1State.model;
  //   const model2 = model2State.model;
  //
  //   const targetPosition = model1.position.clone().lerp(model2.position, 0.5);
  //
  //   // Calculate distance between models
  //   const distance = model1.position.distanceTo(model2.position);
  //
  //   // Move models towards each other
  //   if (distance > 1) {
  //     const moveAmount = 0.5 * delta; // Adjust the movement amount here
  //     model1.position.lerp(targetPosition, moveAmount);
  //     model2.position.lerp(targetPosition, moveAmount);
  //     model1State.isWalking = true;
  //     model2State.isWalking = true;
  //     updateAnimation(model1State);
  //     updateAnimation(model2State);
  //   }
  //
  //   // Look at each other
  //   model1.lookAt(model2.position);
  //   model2.lookAt(model1.position);
  //
  //   // Check if distance is less than or equal to 1
  //   if (distance <= 1) {
  //     // Stop the movement if distance is less than or equal to 1
  //     model1State.isWalking = false;
  //     model2State.isWalking = false;
  //     updateAnimation(model1State);
  //     updateAnimation(model2State);
  //
  //     // Remove either model1 or model2 randomly
  //     const randomIndex = Math.round(Math.random());
  //     const modelToRemove = models[randomIndex];
  //
  //     console.log(modelToRemove, "modelToRemove");
  //     console.log(randomIndex, "randomIndex");
  //
  //
  //     // Remove models from the scene
  //     // scene.remove(model1);
  //     // scene.remove(model2);
  //
  //     // Remove model from the scene
  //     // scene.remove(modelToRemove);
  //
  //     // Remove models from the array
  //     // models.splice(i, 1);
  //     // i -= 1;
  //   }
  // }
}

/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener("resize", () => {
  // Обновляем размеры
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Обновляем соотношение сторон камеры
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Обновляем renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
