import ashSmall from './ash_small.json';
import ashMedium from './ash_medium.json';
import ashLarge from './ash_large.json';
import aspenSmall from './aspen_small.json';
import aspenMedium from './aspen_medium.json';
import aspenLarge from './aspen_large.json';
import bush1 from './bush_1.json';
import bush2 from './bush_2.json';
import bush3 from './bush_3.json';
import oakSmall from './oak_small.json';
import oakMedium from './oak_medium.json';
import oakLarge from './oak_large.json';
import pineSmall from './pine_small.json';
import pineMedium from './pine_medium.json';
import pineLarge from './pine_large.json';
import TreeOptions from '../options';

export const treePreset = {
  'Ash Small': ashSmall,
  'Ash Medium': ashMedium,
  'Ash Large': ashLarge,
  'Aspen Small': aspenSmall,
  'Aspen Medium': aspenMedium,
  'Aspen Large': aspenLarge,
  'Bush 1': bush1,
  'Bush 2': bush2,
  'Bush 3': bush3,
  'Oak Small': oakSmall,
  'Oak Medium': oakMedium,
  'Oak Large': oakLarge,
  'Pine Small': pineSmall,
  'Pine Medium': pineMedium,
  'Pine Large': pineLarge,
} as const;

export type TreePresetStructure = typeof treePreset

export type TreePreset = keyof TreePresetStructure

export function loadPreset(name: TreePreset) {
  const preset = treePreset[name];
  return preset ? structuredClone(preset) : new TreeOptions();
}