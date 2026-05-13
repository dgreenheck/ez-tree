import * as THREE from 'three';

// Cluster atlas channels we bake. Order is the user-facing order in the UI.
export const CHANNELS = ['color', 'normal', 'roughness', 'ao', 'scattering'];

// PBR-channel encoding hints — used as fallback values when the source atlas
// doesn't ship a sidecar for that channel.
//   normal:     +Z up tangent normal (0.5, 0.5, 1.0)
//   roughness:  1.0 (fully rough)
//   ao:         1.0 (no occlusion)
//   scattering: 0.0 (no subsurface transmission)
const LEAF_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Sample a single channel of the source atlas through the leaf's UVs and emit
// it as the fragment color. Alpha cutout uses the source COLOR map's alpha so
// the silhouette matches across all channels.
const LEAF_FS = /* glsl */ `
  uniform sampler2D uColorMap;
  uniform sampler2D uChannelMap;
  uniform float uUseMap;     // 1.0 = sample uChannelMap, 0.0 = use uFallback
  uniform vec3 uFallback;
  uniform float uIsRgb;      // 1.0 = output rgb, 0.0 = broadcast .r as grayscale
  uniform float uAlphaTest;
  varying vec2 vUv;

  void main() {
    float a = texture2D(uColorMap, vUv).a;
    if (a < uAlphaTest) discard;
    vec3 outColor;
    if (uUseMap > 0.5) {
      vec4 s = texture2D(uChannelMap, vUv);
      outColor = (uIsRgb > 0.5) ? s.rgb : vec3(s.r);
    } else {
      outColor = uFallback;
    }
    gl_FragColor = vec4(outColor, 1.0);
  }
`;

const LEAF_CHANNEL_CONFIG = {
  // normal: pass through the source normal map's RGB (note: not corrected for
  //   the leaf's 3D rotation around the branch — see README/milestone notes)
  normal:     { rgb: 1.0, fallback: [0.5, 0.5, 1.0] },
  roughness:  { rgb: 0.0, fallback: [1.0, 1.0, 1.0] },
  ao:         { rgb: 0.0, fallback: [1.0, 1.0, 1.0] },
  scattering: { rgb: 0.0, fallback: [0.0, 0.0, 0.0] },
};

/**
 * Build the leaf material for one bake pass. For the color pass we leave the
 * library's MeshStandardMaterial alone (it carries the wind shader and lit
 * appearance). For other passes we substitute a shader that pulls the
 * matching source channel through the same UVs.
 *
 * @param {string} channel
 * @param {object} sourceMaps - { color, normal, roughness, ao, scattering } THREE.Textures
 * @param {number} alphaTest
 */
export function makeLeafMaterial(channel, sourceMaps, alphaTest) {
  if (channel === 'color') {
    return new THREE.MeshBasicMaterial({
      map: sourceMaps.color,
      side: THREE.DoubleSide,
      alphaTest,
      transparent: false,
    });
  }
  const cfg = LEAF_CHANNEL_CONFIG[channel];
  if (!cfg) throw new Error(`Unknown channel: ${channel}`);
  const channelMap = sourceMaps[channel];
  return new THREE.ShaderMaterial({
    uniforms: {
      uColorMap:   { value: sourceMaps.color },
      // ShaderMaterial requires a non-null Texture for sampler uniforms — use
      // the color map as a stand-in when the real map is missing; uUseMap=0
      // gates the actual read.
      uChannelMap: { value: channelMap ?? sourceMaps.color },
      uUseMap:     { value: channelMap ? 1.0 : 0.0 },
      uFallback:   { value: new THREE.Vector3(...cfg.fallback) },
      uIsRgb:      { value: cfg.rgb },
      uAlphaTest:  { value: alphaTest },
    },
    vertexShader: LEAF_VS,
    fragmentShader: LEAF_FS,
    side: THREE.DoubleSide,
    transparent: false,
  });
}

/**
 * Build the branch material for one bake pass. For the color pass we sample
 * the consumer tree's bark map so the twig in the cluster card matches what
 * the bark will look like on the rest of the tree. Other channels emit
 * channel-appropriate solid values (or view-space normals).
 *
 * @param {string} channel
 * @param {object} [barkMaps] - { color, normal, roughness, ao } THREE.Textures
 */
export function makeBranchMaterial(channel, barkMaps) {
  switch (channel) {
    case 'color':
      if (barkMaps?.color) {
        return new THREE.MeshBasicMaterial({
          map: barkMaps.color,
          side: THREE.DoubleSide,
        });
      }
      return new THREE.MeshBasicMaterial({ color: 0x6b4a2f, side: THREE.DoubleSide });
    case 'normal':
      return new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    case 'roughness':
      if (barkMaps?.roughness) {
        return new THREE.MeshBasicMaterial({ map: barkMaps.roughness, side: THREE.DoubleSide });
      }
      return new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    case 'ao':
      if (barkMaps?.ao) {
        return new THREE.MeshBasicMaterial({ map: barkMaps.ao, side: THREE.DoubleSide });
      }
      return new THREE.MeshBasicMaterial({ color: 0xa0a0a0, side: THREE.DoubleSide });
    case 'scattering':
      return new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    default:
      throw new Error(`Unknown channel: ${channel}`);
  }
}
