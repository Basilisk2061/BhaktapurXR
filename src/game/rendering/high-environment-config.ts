import {Euler,Vector3} from 'three';

export const highSkyFile='/assets/environment/kloppenheim_05_puresky_2k.hdr';
export const highDaylightHorizon='#9fc8e8';
export const daylightSunOffset:[number,number,number]=[-45,65,35];
// Radiance-weighted solar centroid measured from the source HDR, not guessed from a preview.
const sourceSun=new Vector3(.21601953574251245,.9637624643204454,.15651668455653933);
// Rotate only around vertical: keep the photographic horizon level and retain the old sun azimuth.
export const highSkyRotation:[number,number,number]=[0,Math.atan2(sourceSun.z,sourceSun.x)-Math.atan2(35,-45),0];
export const highSunOffset=sourceSun.applyEuler(new Euler(...highSkyRotation)).multiplyScalar(86);
export const highTimberFiles=[
 '/assets/materials/weathered-brown-planks/normal-1k.jpg',
 '/assets/materials/weathered-brown-planks/roughness-1k.jpg',
 '/assets/materials/weathered-brown-planks/ao-1k.jpg',
];
