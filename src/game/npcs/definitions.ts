export type NpcState='IDLE'|'WALKING'|'SITTING';
export type AnimationRole='idle'|'walk'|'sit'|'run'|'jump'|'special';
export interface ClipReference {library:'character'|'player';clip:string}
export interface NpcDefinition {id:string;asset:string;height:number;speed:number;gaitSpeed:number;sitDepth?:number;sitPoseOffsetY?:number;roles:Partial<Record<AnimationRole,ClipReference>>}
export const npcDefinitions:Record<string,NpcDefinition>={
 female_01:{id:'female_01',asset:'/assets/characters/npcs/female_01/character.glb',height:1.63,speed:1,gaitSpeed:1.15,sitDepth:.12,roles:{idle:{library:'character',clip:'FemaleIdle'},walk:{library:'character',clip:'FemaleWalk'},sit:{library:'character',clip:'FemaleSit'},special:{library:'character',clip:'FemalePhone'}}},
 // The imported mesh-minimum estimate lifts the folded seated pose; keep hips/thighs at seat level.
 old_man_01:{id:'old_man_01',asset:'/assets/characters/npcs/old_man_01/character.glb',height:1.68,speed:.75,gaitSpeed:.95,sitPoseOffsetY:0,roles:{idle:{library:'character',clip:'OldManIdle'},walk:{library:'character',clip:'OldManWalk'},sit:{library:'player',clip:'Sit'}}},
};
export const npcInstances=[{id:'female-a',character:'female_01',seed:7101,start:0},{id:'female-b',character:'female_01',seed:9127,start:8},{id:'old-a',character:'old_man_01',seed:12041,start:3},{id:'old-b',character:'old_man_01',seed:17033,start:7}] as const;
export function seededRandom(seed:number){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
