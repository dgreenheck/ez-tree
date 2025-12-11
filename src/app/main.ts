import { Clock, NeutralToneMapping, PCFShadowMap, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { setupUI } from './ui';
import { createScene } from './scene';

declare global {
  interface Window {
    toggleAudio: () => void;
    isAudioPlaying: boolean;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('app')!

  // User needs to interact with the page before audio will play
  container.addEventListener('click', toggleAudio);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 2;
  container.appendChild(renderer.domElement);

  const { scene, environment, tree, camera, controls } = await createScene(renderer);

  const composer = new EffectComposer(renderer);

  composer.addPass(new RenderPass(scene, camera));

  const smaaPass = new SMAAPass();
  composer.addPass(smaaPass);

  composer.addPass(new OutputPass());

  const clock = new Clock();

  console.log("ok")
  function animate() {
    // Update time for wind sway shaders
    const t = clock.getElapsedTime();
    tree.update(t);
    scene.getObjectByName('Forest')?.children.forEach((o) => (o as any).update(t));
    environment.update(t);

    controls.update();
    composer.render();
    requestAnimationFrame(animate);
  }

  function resize() {
    renderer.setSize(container.clientWidth, container.clientHeight);
    smaaPass.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);

  setupUI(tree, environment, renderer, scene, camera, controls, 'Ash Medium');
  animate();
  resize();

  const audioStatus = document.getElementById('audio-status');
  if (audioStatus) {
    audioStatus.style.display = 'block';
  }
});

function toggleAudio () {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.removeEventListener('click', toggleAudio);
  }

  if (window.isAudioPlaying) {
    window.isAudioPlaying = false;
    const audioStatus = document.getElementById('audio-status') as HTMLImageElement;
    if (audioStatus) audioStatus.src = "icon_muted.png";
    const backgroundAudio = document.getElementById('background-audio') as HTMLAudioElement;
    if (backgroundAudio) backgroundAudio.pause();
  } else {
    window.isAudioPlaying = true;
    const audioStatus = document.getElementById('audio-status') as HTMLImageElement;
    if (audioStatus) audioStatus.src = "icon_playing.png";
    const backgroundAudio = document.getElementById('background-audio') as HTMLAudioElement;
    if (backgroundAudio) backgroundAudio.play();
  }
}

