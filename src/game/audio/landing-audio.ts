interface LandingMotion {grounded:boolean;flying:boolean;seat:unknown;velocity:{y:number};resetSequence:number}
/** Observe physics state only: a real upward jump arms one landing, never a small floor drop. */
export class LandingAudioGate {
 private previous:boolean|null=null;
 private reset=-1;
 private armed=false;
 private suppressedUntil=0;
 update(motion:LandingMotion,now:number,active=true){
  if(this.previous===null||this.reset!==motion.resetSequence||motion.flying||motion.seat||!active){
   this.previous=motion.grounded;this.reset=motion.resetSequence;this.armed=false;return false;
  }
  if(this.previous&&!motion.grounded&&motion.velocity.y>.5)this.armed=true;
  const landed=this.armed&&!this.previous&&motion.grounded;
  this.previous=motion.grounded;
  if(motion.grounded)this.armed=false;
  if(landed)this.suppressedUntil=now+.10;
  return landed;
 }
 canFootstep(now:number){return now>=this.suppressedUntil;}
}
