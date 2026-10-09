import{i as y,s as d,C as m,M as b,a as x,E as M,m as A,u as P,ac as S,ad as v,L as O,v as g}from"./EditionWorld.astro_astro_type_script_index_0_lang.B6nfWhaD.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function G({base:t="#e8ebed",mark:a="#8e979c",cell:o=104}={}){const n=new y({depthTest:!1,depthWrite:!1,uniforms:{uBase:{value:new m(t)},uMark:{value:new m(a)},uCell:{value:o},uRes:{value:new d(1,1)},uShift:{value:new d},uDark:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec3 uBase, uMark; uniform float uCell, uDark; uniform vec2 uRes, uShift; varying vec2 vUv;
      void main(){
        vec2 px = vUv * uRes + uShift;
        vec2 c = mod(px, uCell) - uCell * .5;
        float arm = 6., w = .6;
        float plus = (step(abs(c.x), w) * step(abs(c.y), arm) + step(abs(c.y), w) * step(abs(c.x), arm));
        float hair = step(abs(mod(px.y + uCell * 1.5, uCell * 4.) - uCell * 2.), .5) * .25;
        vec2 fc = abs(mod(px, uCell * .25) - uCell * .125);                 // Alche's faint fine grid between the crosses
        float fine = step(uCell * .125 - .6, max(fc.x, fc.y));
        vec3 col = uBase * (1.05 - .16 * pow(length((vUv - .5) * vec2(uRes.x / uRes.y, 1.)), 1.6));   // lighter in the middle
        col *= 1. - .035 * fine;
        col = mix(col, uMark, clamp(plus, 0., 1.) * .55 + hair * .35);
        col = mix(col, vec3(.02, .025, .03), uDark);
        gl_FragColor = vec4(col, 1.);
      }`}),r=new b(new x(2,2),n);return r.frustumCulled=!1,r.renderOrder=-10,r}function B(t,a,{color:o="#1c2124",opacity:n=1,dur:r=.08}={}){const s=a.length,u=new Float32Array(s*6),i=new Float32Array(s*6),l=new Float32Array(s*2),f=new Float32Array(s*2);for(let e=0;e<s;e++){const h=t.slice(e*6,e*6+3),w=t.slice(e*6+3,e*6+6);u.set(h,e*6),u.set(w,e*6+3),i.set(w,e*6),i.set(h,e*6+3),l[e*2]=l[e*2+1]=a[e],f[e*2]=0,f[e*2+1]=1}const c=new S;c.setAttribute("position",new v(u,3)),c.setAttribute("aOther",new v(i,3)),c.setAttribute("aBirth",new v(l,1)),c.setAttribute("aEnd",new v(f,1));const C=new y({transparent:!0,depthWrite:!1,uniforms:{uP:{value:0},uDur:{value:r},uColor:{value:new m(o)},uOpacity:{value:n}},vertexShader:`
      attribute vec3 aOther; attribute float aBirth, aEnd; uniform float uP, uDur; varying float vGrow;
      void main(){
        float grow = clamp((uP - aBirth) / uDur, 0., 1.);
        vec3 p = aEnd > .5 ? mix(aOther, position, grow) : position;
        vGrow = grow;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }`,fragmentShader:"uniform vec3 uColor; uniform float uOpacity; varying float vGrow; void main(){ gl_FragColor = vec4(uColor, uOpacity * step(.001, vGrow)); }"}),p=new O(c,C);return p.frustumCulled=!1,p}function E(){const t=g.width/2,a=g.height/2;return P.map(o=>o.map(([n,r])=>[n-t,r-a]))}function R(t=.55){const a=new M(A(t,!1),12);return Array.from(a.attributes.position.array)}function D(t,a=0,o=96,n=0,r=0){const s=[];for(let u=0;u<o;u++){const i=u/o*Math.PI*2,l=(u+1)/o*Math.PI*2;s.push(n+Math.cos(i)*t,r+Math.sin(i)*t,a,n+Math.cos(l)*t,r+Math.sin(l)*t,a)}return s}export{R as a,D as c,B as g,E as m,G as p};
