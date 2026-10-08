import{q as k,y as M,H as S,s as w,t as U,i as F,aO as L,S as H,M as W,a as B,af as G}from"./EditionWorld.astro_astro_type_script_index_0_lang.5PJRRDCZ.js";import{p as E}from"./scene.DKmQLocv.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const O=`
uniform sampler2D tPrev; uniform vec2 uTexel, uAsp2; uniform vec4 uDrop, uDrop2; varying vec2 vUv;
void main(){
  vec2 s = texture2D(tPrev, vUv).rg;
  float n = texture2D(tPrev, vUv + vec2(uTexel.x, 0.)).r + texture2D(tPrev, vUv - vec2(uTexel.x, 0.)).r + texture2D(tPrev, vUv + vec2(0., uTexel.y)).r + texture2D(tPrev, vUv - vec2(0., uTexel.y)).r;
  float v = (s.g + (n * .25 - s.r) * .4) * .992;
  float h = (s.r + v) * .9996;
  vec2 d = (vUv - uDrop.xy) * uAsp2; h += uDrop.w * exp(-dot(d, d) / (uDrop.z * uDrop.z));
  d = (vUv - uDrop2.xy) * uAsp2; h += uDrop2.w * exp(-dot(d, d) / (uDrop2.z * uDrop2.z));
  gl_FragColor = vec4(h, v, 0., 1.);
}`,V=`
uniform sampler2D uRip; uniform vec2 uRipTexel;
vec4 paint(vec2 uv, vec2 q){
  float asp = uAsp, t = uTime;
  vec2 tx = vec2(uRipTexel.x, 0.), ty = vec2(0., uRipTexel.y);
  vec2 gr = vec2(texture2D(uRip, uv + tx).r - texture2D(uRip, uv - tx).r, texture2D(uRip, uv + ty).r - texture2D(uRip, uv - ty).r);
  q.x += uLean.x * .02; q.y += uLean.y * .012;
  vec2 qd = q + gr * 1.7;                                    // the waves bend what lies in the water
  float yy = qd.y + .5;                                      // 0 at the bottom of the view, 1 at the top
  float tr = fbm(vec2(qd.x * 3.6 + 2., qd.y * 1.3 + .5)) + (yy - .62) * 1.5;
  float tree = smoothstep(.5, .72, tr);
  vec3 treeC = mix(vec3(.08, .24, .22), vec3(.30, .26, .52), fbm(vec2(qd.x * 2.4, qd.y * 2.2 + 3.)));
  treeC = mix(treeC, vec3(.62, .66, .30), smoothstep(.55, .9, fbm(vec2(qd.x * 7., qd.y * 3.))) * .4);
  vec3 sky = mix(vec3(.55, .68, .92), vec3(.99, .80, .72), smoothstep(.05, .85, yy));
  float cl = smoothstep(.45, .75, fbm(vec2(qd.x * 1.6 + t * .01, qd.y * 6. + 1.)));
  sky = mix(sky, mix(vec3(1., .9, .82), vec3(.86, .64, .78), fbm(vec2(qd.x * 2., qd.y * 4.))), cl * .6);
  vec3 col = mix(sky, treeC, tree * smoothstep(.35, .62, yy));
  float rip = fbm(vec2(qd.x * 2.2, qd.y * 26. + t * .15));
  col = mix(col, col * vec3(.82, .9, 1.08), smoothstep(.45, .75, rip) * .5);
  float dep = mix(.1, .85, smoothstep(.15, .9, yy));
  // lily pads, three rows from the far bank to the near one
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float a = mix(.36, -.04, fi / 2.), b = mix(.64, .24, fi / 2.);
    vec2 cs = vec2(.20, .125) * (.62 + fi * .55);
    vec2 pp = qd + vec2(fi * .07, 0.);
    vec2 ci = floor(pp / cs), cf = pp / cs - ci;
    float hh = h21(ci + fi * 17.3);
    vec2 d = (cf - (.3 + .4 * h22(ci + fi * 5.1))) * cs;
    float rad = cs.x * (.30 + .18 * hh);
    float e = length(d / vec2(rad, rad * .55));
    float on = step(.42, hh) * smoothstep(a - .05, a, yy) * smoothstep(b + .05, b, yy);
    float ang = atan(d.y, d.x), na = hh * 6.28 - 3.14;
    float notch = step(abs(sin((ang - na) * .5)), .09) * step(.25, e);
    float pad = (1. - smoothstep(.92, 1., e)) * on * (1. - notch);
    vec3 pc = mix(vec3(.12, .34, .20), vec3(.44, .62, .26), fbm(d * 40. / rad * .3 + hh * 9.));
    pc *= .8 + .35 * clamp(dot(normalize(d + 1e-4), vec2(-.55, .8)) * .5 + .5, 0., 1.) * smoothstep(.5, 1., e) + .1;
    pc = mix(pc, vec3(.78, .86, .5), smoothstep(.82, 1., e) * .3);
    col = mix(col, pc, pad);
    if (pad > .5) dep = mix(.7, .12, fi / 2.);
    // a lotus on some of them
    vec2 fc = vec2(.12, -.05) * rad * 3.;
    float fl = (1. - smoothstep(.55, .85, length((d - fc) / (rad * .42)))) * on * step(.8, hh) * (1. - notch);
    vec3 fcol = mix(vec3(.96, .56, .72), vec3(1., .94, .9), smoothstep(.3, .0, length((d - fc) / (rad * .42))));
    col = mix(col, fcol, fl);
    if (fl > .5) dep = .2;
  }
  vec3 n = normalize(vec3(-gr * 22., 1.));
  col += vec3(1., .95, .82) * pow(max(dot(n, normalize(vec3(-.45, .7, .55))), 0.), 36.) * .9;
  col += vec3(1., .96, .85) * smoothstep(.015, .08, length(gr)) * .3;
  return vec4(col, dep);
}`,X=async s=>{const i=s.renderer;let r=160,v=128,t=m(),c=m();function m(){return new k(r,v,{type:S,depthBuffer:!1,minFilter:M,magFilter:M})}const h={uRip:{value:t.texture},uRipTexel:{value:new w(1/r,1/v)}},n={tPrev:{value:t.texture},uTexel:{value:new w(1/r,1/v)},uAsp2:{value:new w(1.6,1)},uDrop:{value:new U(0,0,.02,0)},uDrop2:{value:new U(0,0,.02,0)}},D=new F({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:O,uniforms:n,depthTest:!1,depthWrite:!1,blending:L}),q=new H;q.add(new W(new B(2,2),D));const A=new G(-1,1,1,-1,0,1);let f=0,x=.3,y={x:.5,y:.5},R=7,g=s.viewport.aspect;const l=()=>(R=R*1664525+1013904223>>>0)/4294967296,u=[],z=matchMedia("(pointer: coarse)").matches,T=e=>{e.target.closest?.("a,button,header,nav,input,summary")||u.push({x:e.clientX/innerWidth,y:1-e.clientY/innerHeight,r:.03,a:1.1})};addEventListener("pointerdown",T,{passive:!0});function b(e){const p=Math.max(72,Math.min(224,Math.round(128*e)));p!==r&&(r=p,t.dispose(),c.dispose(),t=m(),c=m(),h.uRipTexel.value.set(1/r,1/v),n.uTexel.value.set(1/r,1/v))}b(g);function P(e){f=Math.min(f+e,.1);const p=i.getRenderTarget(),d=i.getClearAlpha();for(;f>=1/60;){f-=1/60;const o=u.shift(),a=u.shift();n.uDrop.value.set(o?.x??0,o?.y??0,o?.r??.02,o?.a??0),n.uDrop2.value.set(a?.x??0,a?.y??0,a?.r??.02,a?.a??0),n.tPrev.value=t.texture,i.setRenderTarget(c),i.render(q,A);const C=t;t=c,c=C}i.setRenderTarget(p),i.setClearAlpha(d),h.uRip.value=t.texture}return await E(s,{id:"water",frag:V,uniforms:h,light:!1,onResize(e){g=e.aspect,b(e.aspect),n.uAsp2.value.set(e.aspect,1)},tick({f:e}){const p=g;if(x-=e.dt,x<0&&(x=1.4+l()*2.2,u.push({x:.1+l()*.8,y:.05+l()*.75,r:.018+l()*.012,a:.5+l()*.3})),s.pointer.inside&&!z){const d=s.pointer.x*.5+.5,o=s.pointer.y*.5+.5,a=Math.hypot((d-y.x)*p,o-y.y);a>.004&&u.push({x:d,y:o,r:.016,a:Math.min(.45,a*9)}),y={x:d,y:o}}return P(e.dt),{size:1.05,len:.95,jit:.85,sat:1.15,cool:.35,warm:.35,dry:.25,relief:.95,spec:.8,depth:.45,swirl:.5,angle:0,shim:1,ground:[.62,.7,.62],rake:[-.65,.6],coh:.8}},dispose(){removeEventListener("pointerdown",T),t.dispose(),c.dispose(),D.dispose()}})};export{X as default};
