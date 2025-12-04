import {Vector3, Euler} from 'three'

export class Branch {
  origin: Vector3;
  orientation: Euler;
  length: number;
  radius: number;
  level: number;
  sectionCount: number;
  segmentCount: number;

  constructor(
    origin = new Vector3(),
    orientation = new Euler(),
    length = 0,
    radius = 0,
    level = 0,
    sectionCount = 0,
    segmentCount = 0,
  ) {
    this.origin = origin.clone();
    this.orientation = orientation.clone();
    this.length = length;
    this.radius = radius;
    this.level = level;
    this.sectionCount = sectionCount;
    this.segmentCount = segmentCount;
  }
}
