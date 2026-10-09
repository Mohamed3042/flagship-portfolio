import{x as K,aR as N,aS as W,y as E,al as Y,a as Z,a9 as b,aE as q,V as D,s as k,i as $,aT as j,a5 as H,M as V,u as U,v as I}from"./EditionWorld.astro_astro_type_script_index_0_lang.DwgUqTlS.js";import{f as z,F as P,a as J}from"./lines.C3D1h-xU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const B="ابتثجحخدذرزسشصضطظعغفقكلمنهويةآىءؤئ",Q="0123456789",tt="ABCDEFGHIJKLMNOPQRSTUVWXYZ",et="+-=*/\\|<>[]{}()#$%&@!?~^:;.,_'\"`",at="",ot="abcdefghijklmnopqrstuvwxyz",_={M:"",K:"",MK:""},o=80,st=10,S=16,R=1e20;function L(s,i,r,c,u){let t=0;c[0]=0,u[0]=-R,u[1]=R;for(let a=1;a<i;a++){let e=(s[a]+a*a-(s[c[t]]+c[t]*c[t]))/(2*a-2*c[t]);for(;e<=u[t];)t--,e=(s[a]+a*a-(s[c[t]]+c[t]*c[t]))/(2*a-2*c[t]);t++,c[t]=a,u[t]=e,u[t+1]=R}t=0;for(let a=0;a<i;a++){for(;u[t+1]<a;)t++;const e=a-c[t];r[a]=e*e+s[c[t]]}}function O(s,i,r){const c=Math.max(i,r),u=new Float32Array(c),t=new Float32Array(c),a=new Int32Array(c),e=new Float32Array(c+1);for(let p=0;p<i;p++){for(let n=0;n<r;n++)u[n]=s[n*i+p];L(u,r,t,a,e);for(let n=0;n<r;n++)s[n*i+p]=t[n]}for(let p=0;p<r;p++){for(let n=0;n<i;n++)u[n]=s[p*i+n];L(u,i,t,a,e);for(let n=0;n<i;n++)s[p*i+n]=t[n]}}async function ct(s){const i=s;return i.__mkAtlas?i.__mkAtlas:i.__mkAtlas=(async()=>{await z(J);const r=[...B,...Q,...tt,...et,...at],c=r.length;r.push(...ot);const u=r.length,t=Math.ceil(u/S),a=S*o,e=t*o,p=new Uint8Array(a*e),n=document.createElement("canvas");n.width=n.height=o;const v=n.getContext("2d",{willReadFrequently:!0}),C=new Float32Array(o*o),f=new Float32Array(o*o),h=(m,d,x,A)=>{v.beginPath();for(const F of m)F.forEach(([l,g],w)=>w?v.lineTo(o/2+(l-x)*d,o/2-(g-A)*d):v.moveTo(o/2+(l-x)*d,o/2-(g-A)*d));v.fill()};r.forEach((m,d)=>{if(v.fillStyle="#000",v.fillRect(0,0,o,o),v.fillStyle="#fff",m===_.M)h([U[0]],21,.95,1);else if(m===_.K)h([U[1]],21,2.15+.86,1);else if(m===_.MK)h(U,52/I.width,I.width/2,1);else{const l=d<B.length;v.font=l?`700 54px ${P.ar}`:`500 56px ${P.mono}`,v.textAlign="center",v.textBaseline="alphabetic",v.fillText(m,o/2,l?58:60)}const x=v.getImageData(0,0,o,o).data;for(let l=0;l<o*o;l++){const g=x[l*4]>127;C[l]=g?0:R,f[l]=g?R:0}O(C,o,o),O(f,o,o);const A=d%S,F=Math.floor(d/S);for(let l=0;l<o;l++)for(let g=0;g<o;g++){const w=l*o+g,G=x[w*4]>127?Math.sqrt(f[w])-.5:-(Math.sqrt(C[w])-.5),X=Math.max(0,Math.min(1,.5+G/(2*st)));p[(F*o+(o-1-l))*a+A*o+g]=Math.round(X*255)}});const y=new K(p,a,e,N,W);y.minFilter=E,y.magFilter=E,y.generateMipmaps=!1,y.unpackAlignment=1,y.needsUpdate=!0;const M=new Map;return r.forEach((m,d)=>M.set(m,d)),{tex:y,cols:S,rows:t,cell:o,rain:c,n:u,idx:m=>M.get(m)??M.get("?")}})()}const nt=`
attribute vec3 aPos; attribute float aG; attribute float aS; attribute vec4 aC; attribute vec4 aF;
void inst(float id, out vec3 pos, out float glyph, out float size, out vec4 col, out vec4 fx){ pos = aPos; glyph = aG; size = aS; col = aC; fx = aF; }`,lt="vec4 shade(vec4 col, float a, float halo, vec4 fx){ return vec4(col.rgb * (a + halo), col.a); }";function ft(s){const{atlas:i,count:r,shared:c}=s,u=s.plane?0:1,t=new Y,a=new Z(1,1);t.index=a.index,t.setAttribute("position",a.getAttribute("position")),t.setAttribute("uv",a.getAttribute("uv")),t.instanceCount=r;const e=s.inst?null:{pos:new b(new Float32Array(r*3),3),g:new b(new Float32Array(r),1),s:new b(new Float32Array(r),1),c:new b(new Float32Array(r*4),4),f:new b(new Float32Array(r*4),4)};if(e){t.setAttribute("aPos",e.pos),t.setAttribute("aG",e.g),t.setAttribute("aS",e.s),t.setAttribute("aC",e.c),t.setAttribute("aF",e.f);for(const f of Object.values(e))f.setUsage(q)}const p={tGlyph:{value:i.tex},uGrid:{value:new k(i.cols,i.rows)},uRight:{value:s.plane?.right??new D(1,0,0)},uUp:{value:s.plane?.up??new D(0,1,0)},uBill:{value:u},uGlow:{value:s.glow??0},uFog:{value:s.fog??0},uRain:{value:i.rain},...c,...s.uniforms},n=new $({uniforms:p,transparent:!0,depthWrite:!1,depthTest:s.depthTest??!0,blending:s.normal?j:H,defines:s.normal?{NORMAL:1}:{},vertexShader:`
      uniform vec2 uGrid; uniform vec3 uRight, uUp; uniform float uBill, uFog, uTime, uRain;
      varying vec2 vUv; varying vec4 vCol; varying vec4 vFx; varying float vFog;
      ${s.inst??nt}
      void main(){
        float id = float(gl_InstanceID);
        vec3 pos; float g, sz; vec4 col, fx; inst(id, pos, g, sz, col, fx);
        if (col.a <= .001 || sz <= 0.) { gl_Position = vec4(2., 2., 2., 1.); return; }
        vec3 w = (modelMatrix * vec4(pos, 1.)).xyz;
        vec3 R = mix(uRight, vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), uBill);
        vec3 U = mix(uUp, vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]), uBill);
        vec4 mv = viewMatrix * vec4(w + (R * position.x + U * position.y) * sz, 1.);
        gl_Position = projectionMatrix * mv;
        vec2 cell = vec2(mod(g, uGrid.x), floor(g / uGrid.x));
        vUv = (cell + position.xy + .5) / uGrid;
        vCol = col; vFx = fx; vFog = exp(-uFog * length(mv.xyz));
      }`,fragmentShader:`
      uniform sampler2D tGlyph; uniform float uGlow;
      varying vec2 vUv; varying vec4 vCol; varying vec4 vFx; varying float vFog;
      ${s.shade??lt}
      void main(){
        float d = texture2D(tGlyph, vUv).r;
        float aa = fwidth(d) * .8 + .004;
        float a = smoothstep(.5 - aa, .5 + aa, d);
        float halo = uGlow > 0. ? pow(clamp(d * 2., 0., 1.), 3.2) * (1. - a) * uGlow : 0.;
        vec4 s = shade(vCol, a, halo, vFx);
        float k = max(s.r, max(s.g, s.b));
        if (k < .002 && a < .01) discard;
        #ifdef NORMAL
          gl_FragColor = vec4(s.rgb, s.a * clamp(a + halo, 0., 1.) * vFog);
        #else
          gl_FragColor = vec4(s.rgb * s.a * vFog, 1.);
        #endif
      }`}),v=new V(t,n);return v.frustumCulled=!1,v.renderOrder=s.order??5,{mesh:v,material:n,U:p,geo:t,count:r,setCount(f){t.instanceCount=f},set(f,h,y,M,m,d,x,A,F,l=1,g=0,w=0,T=0,G=0){e.pos.setXYZ(f,h,y,M),e.g.setX(f,m),e.s.setX(f,d),e.c.setXYZW(f,x,A,F,l),e.f.setXYZW(f,g,w,T,G)},line(f,h,y,M,m,d,x,A=.42,F=!1){let l=f,g=y;for(const w of[...h]){if(l>=r)break;if(w===" "){g+=(F?-1:1)*A*d;continue}e.pos.setXYZ(l,g,M,m),e.g.setX(l,i.idx(w)),e.s.setX(l,d),e.c.setXYZW(l,x[0],x[1],x[2],x[3]??1),e.f.setXYZW(l,0,0,0,0),g+=(F?-1:1)*A*d,l++}return l},clear(f=0){if(e)for(let h=f;h<r;h++)e.c.setW(h,0)},dirty(){if(e)for(const f of Object.values(e))f.needsUpdate=!0},attrs:e,dispose(){t.dispose(),n.dispose(),a.dispose()}}}export{_ as M,ct as a,ft as g};
