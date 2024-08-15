import ashSmall from './ash_small.json';
import ashMedium from './ash_medium.json';
import ashLarge from './ash_large.json';
import aspen from './aspen.json';
import oak from './oak.json';
import pineSmall from './pine_small.json';
import pineMedium from './pine_medium.json';
import pineLarge from './pine_large.json';
import { TreePreset } from '../enums';
import TreeOptions from '../options';

export function loadPreset(name) {
  switch (name) {
    case TreePreset.AshSmall:
      return ashSmall;
    case TreePreset.AshMedium:
      return ashMedium;
    case TreePreset.AshLarge:
      return ashLarge;
    case TreePreset.Aspen:
      return aspen;
    case TreePreset.Oak:
      return oak;
    case TreePreset.PineSmall:
      return pineSmall;
    case TreePreset.PineMedium:
      return pineMedium;
    case TreePreset.PineLarge:
      return pineLarge;
    default:
      return new TreeOptions();
  }
}