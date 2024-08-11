import ash from './ash.json';
import aspen from './aspen.json';
import oak from './oak.json';
import pine from './pine.json';
import { TreePreset } from '../enums';
import TreeOptions from '../options';

export function loadPreset(name) {
  switch (name) {
    case TreePreset.Ash:
      return ash;
    case TreePreset.Aspen:
      return aspen;
    case TreePreset.Oak:
      return oak;
    case TreePreset.Pine:
      return pine;
    default:
      return new TreeOptions();
  }
}