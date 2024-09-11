import * as THREE from 'three';

import birchAo from './assets/bark/birch_ao_1k.jpg';
import birchColor from './assets/bark/birch_color_1k.jpg';
import birchNormal from './assets/bark/birch_normal_1k.jpg';
import birchRoughness from './assets/bark/birch_roughness_1k.jpg';

import oakAo from './assets/bark/oak_ao_1k.jpg';
import oakColor from './assets/bark/oak_color_1k.jpg';
import oakNormal from './assets/bark/oak_normal_1k.jpg';
import oakRoughness from './assets/bark/oak_roughness_1k.jpg';

import pineAo from './assets/bark/pine_ao_1k.jpg';
import pineColor from './assets/bark/pine_color_1k.jpg';
import pineNormal from './assets/bark/pine_normal_1k.jpg';
import pineRoughness from './assets/bark/pine_roughness_1k.jpg';

import willowAo from './assets/bark/willow_ao_1k.jpg';
import willowColor from './assets/bark/willow_color_1k.jpg';
import willowNormal from './assets/bark/willow_normal_1k.jpg';
import willowRoughness from './assets/bark/willow_roughness_1k.jpg';

import ashLeaves from './assets/leaves/ash_color.png';
import aspenLeaves from './assets/leaves/aspen_color.png';
import oakLeaves from './assets/leaves/oak_color.png';
import pineLeaves from './assets/leaves/pine_color.png';

const textureLoader = new THREE.TextureLoader();

/**
 * Gets a bark texture for the specified bark type
 * @param {string} barkType 
 * @param {'ao' | 'color' | 'normal' | 'roughness'} fileType 
 * @param {THREE.Vector2} scale 
 * @returns 
 */
export function getBarkTexture(barkType, fileType, scale = { x: 1, y: 1 }) {
  const texture = textures.bark[barkType][fileType];
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = scale.x;
  texture.repeat.y = 1 / scale.y;
  return texture;
}

/**
 * Gets the leaf texture for the specified leaf type
 * @param {string} leafType 
 * @returns 
 */
export function getLeafTexture(leafType) {
  return textures.leaves[leafType];
}

/**
 * 
 * @param {string} url Path to texture
 * @param {THREE.Vector2} scale Scale of the texture repeat
 * @param {boolean} srgb Set to true to set texture color space to SRGB
 * @returns {THREE.Texture}
 */
const loadTexture = (url, srgb = true) => {
  const texture = textureLoader.load(url);
  texture.premultiplyAlpha = true;
  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return texture;
};

const textures = {
  "bark": {
    "birch": {
      "ao": loadTexture(birchAo, false),
      "color": loadTexture(birchColor),
      "normal": loadTexture(birchNormal, false),
      "roughness": loadTexture(birchRoughness, false),
    },
    "oak": {
      "ao": loadTexture(oakAo, false),
      "color": loadTexture(oakColor),
      "normal": loadTexture(oakNormal, false),
      "roughness": loadTexture(oakRoughness, false),
    },
    "pine": {
      "ao": loadTexture(pineAo, false),
      "color": loadTexture(pineColor),
      "normal": loadTexture(pineNormal, false),
      "roughness": loadTexture(pineRoughness, false),
    },
    "willow": {
      "ao": loadTexture(willowAo, false),
      "color": loadTexture(willowColor),
      "normal": loadTexture(willowNormal, false),
      "roughness": loadTexture(willowRoughness, false),
    }
  },
  "leaves": {
    "ash": loadTexture(ashLeaves),
    "aspen": loadTexture(aspenLeaves),
    "oak": loadTexture(oakLeaves),
    "pine": loadTexture(pineLeaves)
  }
};