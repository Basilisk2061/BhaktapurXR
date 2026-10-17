export const zoneIds=["KHAUMA_EXTERIOR","KHAUMA_ENTRANCE","WESTERN_SQUARE","CENTRAL_SQUARE","PALACE_EDGE"] as const;
export type ZoneId=typeof zoneIds[number];
export const streamingDistances={active:50,preload:75,unload:100,safety:35} as const;
export function zoneDistance(bounds:readonly number[],x:number,z:number){return Math.hypot(Math.max(bounds[0]-x,0,x-bounds[2]),Math.max(bounds[1]-z,0,z-bounds[3]));}

export function keepStreamed(distance:number,active:boolean){return distance<=(active?streamingDistances.unload:streamingDistances.active);}
