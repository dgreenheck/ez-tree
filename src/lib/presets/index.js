import ashSmall from './ash_small.json';
import ashMedium from './ash_medium.json';
import ashLarge from './ash_large.json';
import aspen from './aspen.json';
import oakSmall from './oak_small.json';
import oakMedium from './oak_medium.json';
import oakLarge from './oak_large.json';
import pineSmall from './pine_small.json';
import pineMedium from './pine_medium.json';
import pineLarge from './pine_large.json';
import TreeOptions from '../options';

export const TreePreset = {
  'Ash Small': ashSmall,
  'Ash Medium': ashMedium,
  'Ash Large': ashLarge,
  'Aspen': aspen,
  'Oak Small': oakSmall,
  'Oak Medium': oakMedium,
  'Oak Large': oakLarge,
  'Pine Small': pineSmall,
  'Pine Medium': pineMedium,
  'Pine Large': pineLarge,
};

export function loadPreset(name) {
  const preset = TreePreset[name];
  return preset ? structuredClone(preset) : new TreeOptions();
}