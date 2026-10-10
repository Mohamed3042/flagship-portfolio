import{i,aj as u,M as r,ai as f,C as v,a as p}from"./EditionWorld.astro_astro_type_script_index_0_lang.C5-V8Ssb.js";import{G as n}from"./plan.D7MyNZHr.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const s=`
  uniform float uDraw, uSplit, uGlow, uFlood;
  vec3 horizonTint(float az, float t){ return mix(vec3(1.), spectrum(az * .12 + t * .015 + .62), .32); }
  vec3 horizon(float el, float az, float t, float aa){
    float span = 1. - smoothstep(uDraw * 3.4 - .25, uDraw * 3.4, abs(az));   // the power-on draws it out from the middle
    float core = 1. - smoothstep(0., aa * 1.6, abs(el));
    vec3 line = vec3(1. - smoothstep(0., aa * 1.6, abs(el - uSplit)), core, 1. - smoothstep(0., aa * 1.6, abs(el + uSplit)));
    float bloom = exp(-abs(el) / .012) * .55 + exp(-abs(el) / .06) * .2 + exp(-max(el, 0.) / .35) * .045;
    vec3 tint = horizonTint(az, t);
    return (line * 1.6 + tint * bloom * uGlow) * span + vec3(1., .98, .97) * uFlood * exp(-abs(el) / (.1 + uFlood * 2.));
  }
`;function h(){const o=new i({side:u,depthWrite:!1,uniforms:{uTime:{value:0},uDraw:{value:1},uSplit:{value:0},uGlow:{value:1},uFlood:{value:0},uLevel:{value:1}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }",fragmentShader:`
      uniform float uTime, uLevel; varying vec3 vDir;
      ${n}
      ${s}
      void main(){
        vec3 d = normalize(vDir);
        float el = asin(clamp(d.y, -1., 1.)), az = atan(d.x, -d.z);
        float aa = max(fwidth(el), 1e-5);
        vec3 c = vec3(.0025, .0025, .004) + horizon(el, az, uTime, aa);
        gl_FragColor = vec4(c * uLevel, 1.);
      }`}),e=new r(new f(500,48,24),o);return e.frustumCulled=!1,e.renderOrder=-10,{mesh:e,U:o.uniforms,follow(t){e.position.copy(t.position)},dispose(){e.geometry.dispose(),o.dispose()}}}function d({size:o=900,cell:e=1.2}={}){const t=new i({transparent:!0,depthWrite:!0,uniforms:{uTime:{value:0},uCell:{value:e},uLevel:{value:1},uReveal:{value:1},uAlpha:{value:.86},uPulse:{value:1},uDraw:{value:1},uSplit:{value:0},uGlow:{value:1},uFlood:{value:0},uFlow:{value:0},uLine:{value:new v(.075,.078,.095)}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform float uTime, uCell, uLevel, uReveal, uAlpha, uPulse, uFlow; uniform vec3 uLine;
      varying vec3 vW;
      ${n}
      ${s}
      float lineAt(float x, float fw, float w){ return 1. - min(abs(fract(x - .5) - .5) / (fw * w), 1.); }
      void main(){
        vec3 toP = vW - cameraPosition; float dist = length(toP.xz);
        vec3 v = normalize(toP);
        float el = asin(clamp(v.y, -1., 1.)), az = atan(v.x, -v.z);
        vec2 p = vW.xz / uCell, fw = max(fwidth(p), vec2(1e-4));
        float fade = 1. - smoothstep(.18, .65, max(fw.x, fw.y));      // where cells shrink under a few pixels, the lines go to haze
        float gx = lineAt(p.x, fw.x, 1.), gz = lineAt(p.y, fw.y, 1.);
        float fine = max(gx, gz) * fade;
        float gx4 = lineAt(p.x / 4., fw.x / 4., 1.2), gz4 = lineAt(p.y / 4., fw.y / 4., 1.2);
        float bold = max(gx4, gz4) * (1. - smoothstep(.1, .5, max(fw.x, fw.y) / 4.));
        // pulses: along the lines that run away from you (x constant), each line its own hue and pace, toward you
        float ix = floor(p.x + .5), on = step(.55, h21(vec2(ix, 4.1)));
        float pace = 5. + h21(vec2(ix, 1.3)) * 9., period = 26. + h21(vec2(ix, 9.7)) * 30.;
        float q = fract((p.y - (uTime * pace + uFlow) / uCell) / period + h21(vec2(ix, 2.9)));
        float tail = smoothstep(.0, .09, q) * (1. - smoothstep(.09, .095, q));
        float pulse = gx * on * pow(tail, 1.5) * uPulse * fade;
        vec3 hue = spectrum(ix * .041 + uTime * .03);
        // the power-on: the lines light from the horizon toward you, a bright front leading
        float front = (1. - uReveal) * 160.;
        float shown = smoothstep(front - 2., front + 6., dist), edge = exp(-pow((dist - front) / 2.5, 2.)) * step(.001, uReveal) * step(uReveal, .999);
        float near = exp(-dist * .006);
        vec3 col = vec3(.0035, .0035, .005);
        col += uLine * (fine * .55 + bold * 1.2) * near * shown;
        col += hue * pulse * 1.6 * near * shown;
        col += vec3(.75, .8, 1.) * edge * (fine + bold) * 1.5;
        // gloss: far off, at a grazing angle, the floor mirrors the horizon; then it is the haze itself
        float graze = pow(clamp(1. - abs(v.y) * 3.5, 0., 1.), 6.);
        vec3 haze = horizon(el, az, uTime, max(fwidth(el), 1e-5)) * .55;
        col += haze * graze;
        float far = smoothstep(90., 380., dist);
        col = mix(col, haze, far);
        float a = uAlpha * mix(1., .62, graze);
        gl_FragColor = vec4(col * uLevel, mix(a, 1., far));
      }`}),a=new r(new p(o,o,1,1),t);return a.rotation.x=-Math.PI/2,a.renderOrder=0,{mesh:a,U:t.uniforms,follow(l){a.position.x=l.position.x,a.position.z=l.position.z},dispose(){a.geometry.dispose(),t.dispose()}}}export{d as l,h as s};
