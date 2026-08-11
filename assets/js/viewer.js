import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('viewer');
if (container) {
  const modelUrl = container.dataset.modelUrl;
  const materialUrl = container.dataset.materialUrl;

  const width = container.clientWidth;
  const height = 500;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf2f2f2);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
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
