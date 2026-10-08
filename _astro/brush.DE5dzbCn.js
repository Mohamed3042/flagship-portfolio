import{c as d,aP as c,aM as m,i as h,C as f,aF as x,ao as g,aq as M,M as b,a as w}from"./EditionWorld.astro_astro_type_script_index_0_lang.Bwhdv6R4.js";import{F as v,C}from"./plan.J8JxyhfM.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function D(l,e={}){const s=!!e.rtl,n=e.px??300,i=s?v.ar:v.serif,p=(()=>{const r=document.createElement("canvas").getContext("2d");return r.font=`${e.weight??900} ${n}px ${i}`,Math.min(1,(e.width??2048)*.9/Math.max(1,...l.map(u=>r.measureText(u).width)))})(),t=d(l,{font:`${e.italic&&!s?"italic ":""}${e.weight??900} ${Math.round(n*p)}px ${i}`,color:"#fff",width:e.width??2048,lineHeight:e.lineHeight??1.05,rtl:s});t.texture.colorSpace=c,t.texture.minFilter=m,t.texture.generateMipmaps=!0;const o=new h({transparent:!0,depthTest:!1,depthWrite:!1,blending:M,blendSrc:g,blendDst:x,uniforms:{uMap:{value:t.texture},uReveal:{value:0},uSeed:{value:e.seed??3},uDir:{value:s?-1:1},uAlpha:{value:1},uDrops:{value:e.drops??1},uColor:{value:new f(e.color??"#f2eadf")},uColor2:{value:new f(e.color2??"#a99f92")}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:C+`
      uniform sampler2D uMap; uniform float uReveal, uSeed, uDir, uAlpha, uDrops; uniform vec3 uColor, uColor2; varying vec2 vUv;
      void main(){
        vec2 uv = vUv;
        float soft = textureLod(uMap, uv, 2.4).a, cov = texture2D(uMap, uv).a;
        float br = fbm(vec2(uv.x * 7., uv.y * 150.) + uSeed), br2 = vn(vec2(uv.x * 26., uv.y * 330.) + uSeed * 3.);
        float edge = 1. - abs(soft * 2. - 1.);
        float ink = smoothstep(.30, .50, mix(soft, cov, .35) + (br - .5) * .8 * (.3 + edge) + (br2 - .5) * .3 * edge);
        float x = uDir > 0. ? uv.x : 1. - uv.x;
        float front = uReveal * 1.14 - .07 + (fbm(vec2(uv.y * 9., uSeed + 4.)) - .5) * .1;
        float seen = smoothstep(front, front - .035, x);
        float dry = smoothstep(front - .24, front - .02, x);                      // the stroke runs dry as the sweep ends
        ink *= seen * (1. - dry * smoothstep(.25, .75, br2 + (br - .5) * .8) * .85);
        float pool = smoothstep(.15, .95, soft) * (.78 + .22 * br);
        vec3 col = mix(uColor2, uColor, pool);
        // a few drops thrown off ahead of the brush
        vec2 g = uv * vec2(260., 130.); vec2 id = floor(g), f = fract(g) - .5;
        float drop = step(.986, h12(id + uSeed)) * smoothstep(.22, .08, length(f - (h22(id) - .5) * .4)) * smoothstep(.01, .25, soft + .02) * (1. - smoothstep(.0, .35, soft)) * seen * uDrops;
        float a = clamp(ink + drop, 0., 1.) * uAlpha;
        gl_FragColor = vec4(col * a, a);
      }`}),a=new b(new w(1,1/t.aspect),o);return a.renderOrder=50,a.frustumCulled=!1,{mesh:a,mat:o,aspect:t.aspect,set(r,u=1){o.uniforms.uReveal.value=r,o.uniforms.uAlpha.value=u,a.visible=u>.001&&r>.001},dispose(){t.texture.dispose(),o.dispose(),a.geometry.dispose()}}}export{D as b};
