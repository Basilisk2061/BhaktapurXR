/** Contact onsets measured from the supplied Mixamo ankle/toe trajectories.
 * Walk (1.4 s): left heel settles ~.38, right ~1.08.
 * Run (.833333 s): left toe plants ~.2833, right ~.70.
 * These are clip-local seconds, never a wall-clock cadence or animation-speed override.
 */
export const footContacts={Walk:[.383333,1.083333],Run:[.283333,.7]} as const;
export type LocomotionClip=keyof typeof footContacts;
export function contactCrossings(clip:LocomotionClip,before:number,after:number,duration:number):number[]{
 if(after<=before||duration<=0||after-before>duration)return [];
 const contacts:number[]=[];
 for(let loop=Math.floor(before/duration);loop<=Math.floor(after/duration);loop++)for(const time of footContacts[clip]){
  const event=loop*duration+time;if(event>before&&event<=after)contacts.push(event);
 }return contacts;
}
export function canPlayFootstep(motion:{grounded:boolean;flying:boolean;seat:unknown;horizontalSpeed:number},threshold=.05){
 return motion.grounded&&!motion.flying&&!motion.seat&&motion.horizontalSpeed>threshold;
}
export function chooseVariation(count:number,last:number,random=Math.random){
 if(count<2)return 0;
 const pick=Math.floor(random()*(count-(last>=0?1:0)));
 return last>=0&&pick>=last?pick+1:pick;
}
