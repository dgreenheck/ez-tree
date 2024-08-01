import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class AssetLoader {
  constructor() {
    this.queue = [];
    this.loading = false;
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/');
    this.loader.setDRACOLoader(dracoLoader);
  }

  addGLB(url, onLoad) {
    this.queue.push({ url, onLoad });
  }

  load(onComplete, onProgress, onError) {
    let loadedAssets = 0;
    const totalAssetCount = this.queue.length;
    while (this.queue.length > 0) {
      const { url, onLoad } = this.queue.shift();
      this.loader.load(
        url,
        (gltf) => {
          console.log(`Loaded ${url}`);
          console.log(gltf.scene);
          onLoad?.(gltf);
          onProgress(++loadedAssets / totalAssetCount);
          if (loadedAssets === totalAssetCount) {
            onComplete?.();
          }
        },
        null,
        (err) => onError?.(err)
      );
    }
  }
}