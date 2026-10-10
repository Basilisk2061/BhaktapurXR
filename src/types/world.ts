export type Vector3Tuple = [number, number, number];

export interface SpawnPoint {
  position: Vector3Tuple;
  /** Euler angles in radians; a future player faces local -Z at zero yaw. */
  rotation: Vector3Tuple;
}

export interface TestBox {
  id: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  rotation?: Vector3Tuple;
}
