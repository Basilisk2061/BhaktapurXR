/** Ambient-life placement, not a heritage/reconstruction claim.
 * Inspected against final architecture + saved parent/part transforms and primitives.
 * Live ground/clearance queries still reject occupied positions. */
export const pigeonZones=[
 {id:'western-palace-forecourt',x:-49,z:-5,radius:4.5,ground:0,clearance:11.74},
 {id:'western-open-apron',x:-94,z:1,radius:3.3,ground:0,clearance:7.94},
 {id:'eastern-open-forecourt',x:29,z:-8,radius:3.3,ground:0,clearance:7.70},
] as const;
export const pigeonCounts={'VERY LOW':3,LOW:9,MEDIUM:15,HIGH:24} as const;
export const pigeonLimit=24;
