import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
/** Bounded screen-space photographic CoC. Reuses main render depth, no depth rerender. */
export function createPhotographyDof(samples:number){
 const pass=new ShaderPass({name:'PhotographyDOF',defines:{TAPS:samples},uniforms:{tDiffuse:{value:null},tDepth:{value:null},nearClip:{value:.1},farClip:{value:500},focus:{value:10},focal:{value:35},fstop:{value:4},aspect:{value:1},strength:{value:1},maxRadius:{value:.003}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 #include <packing>
 varying vec2 vUv;uniform sampler2D tDiffuse;uniform sampler2D tDepth;
 uniform float nearClip,farClip,focus,focal,fstop,aspect,strength,maxRadius;
 float distanceAt(vec2 uv){return -perspectiveDepthToViewZ(texture2D(tDepth,uv).x,nearClip,farClip);}
 void main(){float z=max(.05,distanceAt(vUv));
  float coc=focal*focal/(max(1.,fstop)*36000.)*abs(1./z-1./max(.3,focus));
  float radius=min(maxRadius,coc*.35)*strength;
  vec4 color=texture2D(tDiffuse,vUv)*.4;float weight=.4;
  for(int i=0;i<TAPS;i++){
   // Stratified disk, not a sparse ring of repeated edge ghosts.
   float r=sqrt((float(i)+.5)/float(TAPS)),angle=float(i)*2.39996323;
   vec2 uv=clamp(vUv+vec2(cos(angle),sin(angle)*aspect)*radius*r,vec2(.001),vec2(.999));
   float depth=max(.05,distanceAt(uv));
   // Symmetric bilateral rejection: neither nearer nor farther surfaces may bleed
   // over a silhouette. Linearized distances also distinguish architecture from sky.
   float gap=abs(depth-z)/max(.06,min(depth,z)*.018);
   float edgeWeight=gap<3.?exp(-2.*gap*gap):0.;
   float w=edgeWeight*exp(-r*r)*(.6/float(TAPS));
   color+=texture2D(tDiffuse,uv)*w;weight+=w;
  }
  gl_FragColor=color/weight;
 }`});
 pass.material.toneMapped=false;
 const render=pass.render.bind(pass);pass.render=(renderer,write,read,dt,mask)=>{pass.uniforms.tDepth.value=read.depthTexture;render(renderer,write,read,dt,mask);};
 return pass;
}
