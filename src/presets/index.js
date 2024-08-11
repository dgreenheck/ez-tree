import ash from './ash.json';
import oak from './oak.json';
import pine from './pine.json';
import { TreePreset } from '../enums';

export function loadPreset(name) {
  switch (name) {
    case TreePreset.Ash:
      return ash;
    case TreePreset.Oak:
      return oak;
    case TreePreset.Pine:
      return pine;
    default:
      return null;
  }
}