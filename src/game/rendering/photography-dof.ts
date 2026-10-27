import {cameraPerf} from './camera-performance';
import {HalfFloatType,NearestFilter,ShaderMaterial,Vector2,WebGLRenderTarget,type WebGLRenderer} from 'three';
import {Pass,FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
import {opticsGlsl} from '../inventory/photography-optics';
/** Sharp + half-resolution horizontal DOF + full-resolution vertical/edge-aware composite.
 * Near/far classes never exchange color. One scene render; depth comes from RenderPass.
 */
class PhotographyDofPass extends Pass {
 uniforms={tSharp:{value:null as unknown},tDepth:{value:null as unknown},tBlur:{value:null as unknown},nearClip:{value:.08},farClip:{value:260},focus:{value:10},focal:{value:35},fstop:{value:4},strength:{value:1},maxPixels:{value:18},resolution:{value:new Vector2(1,1)},workingSize:{value:new Vector2(1,1)}};
 private target=new WebGLRenderTarget(1,1,{type:HalfFloatType,depthBuffer:false,minFilter:NearestFilter,magFilter:NearestFilter});
 private horizontal:ShaderMaterial;private composite:ShaderMaterial;private quad=new FullScreenQuad();
 constructor(taps:number){super();
  const vertexShader='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
  const fragmentShader=`
   #include <packing>
   varying vec2 vUv;uniform sampler2D tSharp,tDepth,tBlur;uniform vec2 resolution,workingSize;
   uniform float nearClip,farClip,focus,focal,fstop,strength,maxPixels;
   float depthAt(vec2 uv){return max(.05,-perspectiveDepthToViewZ(texture2D(tDepth,uv).x,nearClip,farClip));}
   ${opticsGlsl}
   void main(){float z=depthAt(vUv),coc=signedCircleMm(z),radius=radiusPixels(z);
    vec4 sharp=texture2D(tSharp,vUv);if(radius<.35){gl_FragColor=sharp;return;}
    vec4 sum=vec4(0.);float weights=0.;
    for(int i=0;i<TAPS;i++){
     float x=(float(i)-float(TAPS-1)*.5)/(float(TAPS-1)*.5);
     #if FINAL_PASS == 1
      vec2 uv=vUv+vec2(0.,x*radius/resolution.y);
      // Sample exact working texel centers; never bilinearly mix depth silhouettes.
      uv=(floor(clamp(uv,vec2(0.),vec2(.99999))*workingSize)+.5)/workingSize;
     #else
      vec2 uv=clamp(vUv+vec2(x*radius/resolution.x,0.),vec2(.00001),vec2(.99999));
     #endif
     float sampleZ=depthAt(uv),sampleCoc=signedCircleMm(sampleZ);
     float gap=abs(sampleZ-z)/max(.12,min(z,sampleZ)*.04);
     float sameClass=step(0.,coc*sampleCoc);
     float w=exp(-2.*x*x)*sameClass*(gap<3.?exp(-gap*gap):0.);
     #if FINAL_PASS == 1
      sum+=texture2D(tBlur,uv)*w;
     #else
      sum+=texture2D(tSharp,uv)*w;
     #endif
     weights+=w;
    }
    vec4 blurred=weights>.0001?sum/weights:sharp;
    #if FINAL_PASS == 1
     gl_FragColor=mix(sharp,blurred,smoothstep(.35,1.25,radius));
    #else
     gl_FragColor=blurred;
    #endif
   }`;
  this.horizontal=new ShaderMaterial({uniforms:this.uniforms,defines:{TAPS:taps,FINAL_PASS:0},vertexShader,fragmentShader,depthTest:false,depthWrite:false,toneMapped:false});
  this.composite=new ShaderMaterial({uniforms:this.uniforms,defines:{TAPS:taps,FINAL_PASS:1},vertexShader,fragmentShader,depthTest:false,depthWrite:false,toneMapped:false});
 }
 setSize(width:number,height:number){if(this.uniforms.resolution.value.x===width&&this.uniforms.resolution.value.y===height)return;const resizeStart=process.env.NODE_ENV==='development'?performance.now():0;this.uniforms.resolution.value.set(width,height);const w=Math.max(1,Math.ceil(width/2)),h=Math.max(1,Math.ceil(height/2));this.target.setSize(w,h);this.uniforms.workingSize.value.set(w,h);if(process.env.NODE_ENV==='development')cameraPerf?.end('Render-target resize',resizeStart);}
 render(renderer:WebGLRenderer,write:WebGLRenderTarget,read:WebGLRenderTarget){const passStart=process.env.NODE_ENV==='development'?performance.now():0;this.uniforms.tSharp.value=read.texture;this.uniforms.tDepth.value=read.depthTexture;this.uniforms.tBlur.value=this.target.texture;this.quad.material=this.horizontal;renderer.setRenderTarget(this.target);this.quad.render(renderer);this.quad.material=this.composite;renderer.setRenderTarget(this.renderToScreen?null:write);this.quad.render(renderer);if(process.env.NODE_ENV==='development')cameraPerf?.end('DOF passes (CPU)',passStart);}
 dispose(){this.target.dispose();this.horizontal.dispose();this.composite.dispose();this.quad.dispose();}
}
export const createPhotographyDof=(taps:number)=>new PhotographyDofPass(taps);
