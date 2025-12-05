import { Group, InstancedMesh, Mesh, Object3D, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let loadInitialized = false;

async function fetchAssets() {

  if (loadInitialized) return;
  // Set the flag immediately in async function
  loadInitialized = true;

  try {

    const gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    gltfLoader.setDRACOLoader(dracoLoader);

    const rocks = await Promise.all([
      gltfLoader.loadAsync("rock1.glb").then((glb: GLTF) => glb.scene.children[0] as Mesh),
      gltfLoader.loadAsync("rock2.glb").then((glb: GLTF) => glb.scene.children[0] as Mesh),
      gltfLoader.loadAsync("rock3.glb").then((glb: GLTF) => glb.scene.children[0] as Mesh)
    ])

    return rocks
  } catch (err) {
    console.log(err)
    throw new Error("Failed to load assets")
  }
}

export class RockOptions {
  /**
   * Scale factor 
   */
  size = { x: 2, y: 2, z: 2 };

  /**
   * Maximum variation in the rock size
   */
  sizeVariation = { x: 3, y: 3, z: 3 };
}

export class Rocks extends Group {
  options: RockOptions;
  constructor(options = new RockOptions()) {
    super();

    /**
     * @type {RockOptions}
     */
    this.options = options;

    fetchAssets().then((rocks) => {
      rocks?.forEach(rock => {
        this.add(this.generateInstances(rock))
      })
    });
  }

  generateInstances(mesh: Mesh) {
    const instancedMesh = new InstancedMesh(mesh.geometry, mesh.material, 200);

    const dummy = new Object3D();

    let count = 0;
    for (let i = 0; i < 50; i++) {
      // Set position randomly
      const p = new Vector3(
        2 * (Math.random() - 0.5) * 250,
        0.3,
        2 * (Math.random() - 0.5) * 250
      );

      dummy.position.copy(p);

      // Set rotation randomly
      dummy.rotation.set(
        0,
        2 * Math.PI * Math.random(),
        0
      );

      // Set scale randomly
      dummy.scale.set(
        this.options.sizeVariation.x * Math.random() + this.options.size.x,
        this.options.sizeVariation.y * Math.random() + this.options.size.y,
        this.options.sizeVariation.z * Math.random() + this.options.size.z
      );

      // Apply the transformation to the instance
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(count, dummy.matrix);
      count++;
    }
    instancedMesh.count = count;

    // Ensure the transformation is updated in the GPU
    instancedMesh.instanceMatrix.needsUpdate = true;

    instancedMesh.castShadow = true;

    return instancedMesh;
  }
}
