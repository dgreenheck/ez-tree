import * as THREE from 'three/webgpu';
import { setupUI } from './ui';
import { createScene } from './scene';

function toggleAudio() {
  document.getElementById('app').removeEventListener('click', toggleAudio);

  if (window.isAudioPlaying) {
    window.isAudioPlaying = false;
    document.getElementById('audio-status').src = "/icons/icon_muted.png";
    document.getElementById('background-audio').pause();
  } else {
    window.isAudioPlaying = true;
    document.getElementById('audio-status').src = "/icons/icon_playing.png";
    document.getElementById('background-audio').play();
  }
}

window.toggleAudio = toggleAudio;

async function start() {
  const container = document.getElementById('app')

  // User needs to interact with the page before audio will play
  container.addEventListener('click', toggleAudio);

  const renderer = new THREE.WebGPURenderer({ antialias: true });
  await renderer.init();
  renderer.setClearColor(0);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 2;
  container.appendChild(renderer.domElement);

  const { scene, environment, tree, camera, controls } = await createScene(renderer);

  const clock = new THREE.Clock();
  function animate() {
    // Update time for wind sway nodes
    const t = clock.getElapsedTime();
    tree.update(t);
    scene.getObjectByName('Forest').children.forEach((o) => o.update(t));
    environment.update(t);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function resize() {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);

  setupUI(tree, environment, renderer, scene, camera, controls, 'Ash Medium');
  animate();
  resize();

  document.getElementById('audio-status').style.display = 'block';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
