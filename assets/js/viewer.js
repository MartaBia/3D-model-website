import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('viewer');
if (container) {
  // getting the model and the material URL from the html file
  const modelUrl = container.dataset.modelUrl;
  const materialUrl = container.dataset.materialUrl;

  const width = container.clientWidth;
  const height = 500;

  // Set scene + camera + rendered - needed to show anything with 3js
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf2f2f2);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(3, 5, 2);
  scene.add(dirLight);

  const mtlLoader = new MTLLoader();
  mtlLoader.load(
    materialUrl,
    (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        modelUrl,
        (object) => {
          scene.add(object);

          // Center the model
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          object.position.sub(center);

          // Set the camera distance to the model's size
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const fitDistance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));

          camera.position.set(0, 0, fitDistance * 1.3);
          camera.lookAt(0, 0, 0);

          controls.target.set(0, 0, 0);
          controls.update();
        },
        undefined,
        (error) => console.error('Error loading model:', error)
      );
    },
    undefined,
    (error) => console.error('Error loading materials:', error)
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    camera.aspect = newWidth / height;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, height);
  });
}
