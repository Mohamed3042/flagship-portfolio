import * as THREE from 'three';
import type { ChapterSpec, Seat } from './types';
import { STAR_FRAGMENT } from './field';
export const HOLOGRAM = { fps:12, seconds:8, points:4000, ahead:2 };
export const hologramFrame=(local:number)=>Math.min(95,Math.floor(Math.max(0,Math.min(1,local/.75))*96));
type Film={xy:Uint16Array;frames:number;points:number};
/** One reusable point buffer, the field's own star fragment, no second renderer. */
export function createHolograms(root:HTMLElement,chapters:ChapterSpec[],pixelRatio:number) {
  const film=new Map<string,Film>();const requested=new Set<string>();const errors:Record<string,string>={};
  const urls=[...root.querySelectorAll<HTMLElement>('[data-hologram]')].map(e=>({id:e.dataset.chapter!,url:e.dataset.hologram!,index:chapters.findIndex(c=>c.id===e.dataset.chapter)}));
  const geometry=new THREE.BufferGeometry();const positions=new Float32Array(HOLOGRAM.points*3);
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const uniforms={uPixelRatio:{value:pixelRatio},uOpacity:{value:1}};
  const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthTest:false,depthWrite:false,
    fragmentShader:STAR_FRAGMENT,vertexShader:`
    uniform float uPixelRatio;uniform float uOpacity;
    varying float vAlpha;varying vec3 vTint;varying float vHalo;varying float vCore;varying float vSpike;
    void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_PointSize=2.2*uPixelRatio;vAlpha=uOpacity*.9;vTint=vec3(.8745,.9098,1.0);vHalo=.28;vCore=1.0;vSpike=0.0;}`});
  const object=new THREE.Points(geometry,material);object.frustumCulled=false;object.visible=false;object.renderOrder=3;
  let disposed=false,last='',applied=-1;
  return {object,
    frame(c:ChapterSpec,index:number,local:number,u:number,seat:Seat,alignment:number,reduced:boolean){
      for(const e of urls)if(u>0 && Math.abs(e.index-index)<=HOLOGRAM.ahead && !requested.has(e.id)){
        requested.add(e.id);
        void fetch(e.url).then(r=>{if(!r.ok)throw Error('hologram unavailable');return r.blob();})
          .then(b=>new Response(b.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())
          .then(buffer=>{if(disposed)return;const header=new DataView(buffer);if(header.getUint32(0,true)!==0x42524144)throw Error('invalid hologram');film.set(e.id,{xy:new Uint16Array(buffer,12),frames:header.getUint16(4,true),points:header.getUint16(6,true)});})
          .catch(error=>{errors[e.id]=String(error);});
      }
      const data=film.get(c.id);object.visible=!!data && c.act==='games';if(!data)return;
      const frame=reduced?48:hologramFrame(local),key=`${c.id}:${frame}:${seat.width}:${seat.height}`;
      uniforms.uOpacity.value=reduced?1:Math.min(1,Math.max(0,(local-.15)/.2))*Math.min(1,Math.max(0,(.94-local)/.10));
      if(key===last)return;last=key;applied=frame;
      const scale=45/seat.distance,height=Math.min(seat.height*.68,seat.width/1.777)*scale,width=height*1.777;
      const offset=Math.min(frame,data.frames-1)*data.points*2;
      for(let i=0;i<data.points;i++)positions.set([(seat.offsetX??0)*scale+(data.xy[offset+i*2]/65535-.5)*width,(seat.offsetY??0)*scale+(.5-data.xy[offset+i*2+1]/65535)*height,-(alignment+45)],i*3);
      geometry.setDrawRange(0,data.points);geometry.attributes.position.needsUpdate=true;
    },
    state:()=>({loaded:[...film.keys()],applied,errors,requested:[...requested]}),
    dispose(){disposed=true;geometry.dispose();material.dispose();},
  };
}
