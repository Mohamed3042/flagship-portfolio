import{m as M,M as C,j as d}from"./WorldChrome.astro_astro_type_script_index_0_lang.CEb86_wl.js";import{f as x,g as v,h as y,i as f,u as A,n as g,b as P,l as S,v as O}from"./three.module.BV0dDOYn.js";function B({base:t="#e8ebed",mark:a="#8e979c",cell:o=104}={}){const n=new y({depthTest:!1,depthWrite:!1,uniforms:{uBase:{value:new f(t)},uMark:{value:new f(a)},uCell:{value:o},uRes:{value:new g(1,1)},uShift:{value:new g},uDark:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec3 uBase, uMark; uniform float uCell, uDark; uniform vec2 uRes, uShift; varying vec2 vUv;
      void main(){
        vec2 px = vUv * uRes + uShift;
        vec2 c = mod(px, uCell) - uCell * .5;
        float arm = 6., w = .6;
        float plus = (step(abs(c.x), w) * step(abs(c.y), arm) + step(abs(c.y), w) * step(abs(c.x), arm));
        float hair = step(abs(mod(px.y + uCell * 1.5, uCell * 4.) - uCell * 2.), .5) * .25;
        vec3 col = uBase * (1. - .05 * length(vUv - .5));
        col = mix(col, uMark, clamp(plus, 0., 1.) * .55 + hair * .35);
        col = mix(col, vec3(.02, .025, .03), uDark);
        gl_FragColor = vec4(col, 1.);
      }`}),r=new P(new S(2,2),n);return r.frustumCulled=!1,r.renderOrder=-10,r}function D(t,a,{color:o="#1c2124",opacity:n=1,dur:r=.08}={}){const u=a.length,s=new Float32Array(u*6),i=new Float32Array(u*6),l=new Float32Array(u*2),m=new Float32Array(u*2);for(let e=0;e<u;e++){const h=t.slice(e*6,e*6+3),w=t.slice(e*6+3,e*6+6);s.set(h,e*6),s.set(w,e*6+3),i.set(w,e*6),i.set(h,e*6+3),l[e*2]=l[e*2+1]=a[e],m[e*2]=0,m[e*2+1]=1}const c=new x;c.setAttribute("position",new v(s,3)),c.setAttribute("aOther",new v(i,3)),c.setAttribute("aBirth",new v(l,1)),c.setAttribute("aEnd",new v(m,1));const b=new y({transparent:!0,depthWrite:!1,uniforms:{uP:{value:0},uDur:{value:r},uColor:{value:new f(o)},uOpacity:{value:n}},vertexShader:`
      attribute vec3 aOther; attribute float aBirth, aEnd; uniform float uP, uDur; varying float vGrow;
      void main(){
        float grow = clamp((uP - aBirth) / uDur, 0., 1.);
        vec3 p = aEnd > .5 ? mix(aOther, position, grow) : position;
        vGrow = grow;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }`,fragmentShader:"uniform vec3 uColor; uniform float uOpacity; varying float vGrow; void main(){ gl_FragColor = vec4(uColor, uOpacity * step(.001, vGrow)); }"}),p=new A(c,b);return p.frustumCulled=!1,p}function E(){const t=d.width/2,a=d.height/2;return C.map(o=>o.map(([n,r])=>[n-t,r-a]))}function F(t=.55){const a=new O(M(t,!1),12);return Array.from(a.attributes.position.array)}function _(t,a=0,o=96,n=0,r=0){const u=[];for(let s=0;s<o;s++){const i=s/o*Math.PI*2,l=(s+1)/o*Math.PI*2;u.push(n+Math.cos(i)*t,r+Math.sin(i)*t,a,n+Math.cos(l)*t,r+Math.sin(l)*t,a)}return u}export{F as a,_ as c,D as g,E as m,B as p};
