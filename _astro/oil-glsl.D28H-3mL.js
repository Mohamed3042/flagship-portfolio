/*! © 2026 Mohamed Mahmoud. All rights reserved. */const r=`
  uniform float uOil, uOilT; uniform sampler2D uOilN;
  float oT(vec2 i){ return texture2D(uOilN, (i + .5) / 256.).r; }
  float oN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6. - 15.) + 10.);
    return mix(mix(oT(i), oT(i + vec2(1., 0.)), f.x), mix(oT(i + vec2(0., 1.)), oT(i + 1.), f.x), f.y); }
  float oH(vec2 p, float t){
    vec2 w = vec2(oN(p * .45 + vec2(0., t * .03)), oN(p * .45 + vec2(5.2, -t * .025))) - .5;
    vec2 q = p + w * 1.6 + vec2(0., t * .045);
    return oN(q) * .72 + oN(q * 2.07 + 7.3) * .28;
  }
  vec3 oLight(vec3 n){
    vec3 r = reflect(vec3(0., 0., -1.), n);
    float F = .04 + .96 * pow(1. - clamp(n.z, 0., 1.), 5.);
    float s1 = exp(-pow((r.y - .34) / .075, 2.)) * smoothstep(.8, .2, abs(r.x + .08));
    float s2 = exp(-pow((r.x + .34) / .04, 2.)) * smoothstep(.75, .1, abs(r.y - .06));
    float s3 = exp(-pow((r.x - .40) / .045, 2.)) * smoothstep(.7, .1, abs(r.y + .1));
    float sky = smoothstep(.05, .9, r.y) * .06;
    return vec3(1., .985, .97) * ((s1 * 1.1 + s2 * .9) * (.1 + F * 3.4) + sky) + vec3(.4, .016, .026) * s3 * (.05 + F * 1.6);
  }

  float oS(float h){ return smoothstep(.28, .72, h); }
  float oSmax(float a, float b, float k){ float h = clamp(.5 - .5 * (b - a) / k, 0., 1.); return mix(b, a, h) + k * h * (1. - h); }`;function a(o=256){const e=new Uint8Array(o*o*4);let f=1234567;for(let t=0;t<o*o;t++)f=f*1103515245+12345>>>0,e[t*4]=f>>>24,e[t*4+3]=255;return e}export{r as O,a as o};
