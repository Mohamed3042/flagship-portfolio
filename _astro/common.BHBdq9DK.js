import{M as C,a as A,I as L,V as b,aB as S,p as F}from"./EditionWorld.astro_astro_type_script_index_0_lang.59ypKK2N.js";import{p as i}from"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const I=`
  float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
  float h31(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  vec3 h33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y); }
  float vnoise3(vec3 p){ vec3 i = floor(p), f = fract(p); vec3 u = f * f * (3. - 2. * f);
    return mix(mix(mix(h31(i), h31(i + vec3(1, 0, 0)), u.x), mix(h31(i + vec3(0, 1, 0)), h31(i + vec3(1, 1, 0)), u.x), u.y),
               mix(mix(h31(i + vec3(0, 0, 1)), h31(i + vec3(1, 0, 1)), u.x), mix(h31(i + vec3(0, 1, 1)), h31(i + vec3(1, 1, 1)), u.x), u.y), u.z); }
  float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vnoise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.1; a *= .5; } return v; }
  float fbm3(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 3; i++){ v += a * vnoise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.1; a *= .5; } return v / .875; }
  // Voronoi: x = distance to the nearest border, y = the cell's hash, zw = the cell's centre
  vec4 voronoi(vec2 p){
    vec2 n = floor(p), f = fract(p), mg = vec2(0.), mr = vec2(0.); float md = 8.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
      vec2 g = vec2(i, j), o = h22(n + g), r = g + o - f; float d = dot(r, r);
      if (d < md){ md = d; mr = r; mg = g; }
    }
    md = 8.;
    for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++){
      vec2 g = mg + vec2(i, j), o = h22(n + g), r = g + o - f;
      if (dot(mr - r, mr - r) > .00001) md = min(md, dot(.5 * (mr + r), normalize(r - mr)));
    }
    return vec4(md, h21(n + mg), n + mg + h22(n + mg));
  }
`,T=`
      // a feather of window frost: a stem along +x from the origin, barbs leaving it at 60° toward its tip on both
      // sides, shorter toward the tip, each with a few finer barbs of its own (q: the point in the feather's frame)
      float feather(vec2 q, float L, float s){
        if (q.x < -.02 || q.x > L + .02) return 0.;
        float y = abs(q.y);
        float stem = smoothstep(.006 + .006 * (1. - q.x / L), .002, y) * smoothstep(L, L - .04, q.x);
        float t = y / .866, x0 = q.x - .5 * t, k = floor(x0 / s + .5) * s;
        float lb = max(L - k, 0.) * (.38 + .2 * h11(k * 13.7 + L));
        vec2 b = vec2(q.x - k, y), dir = vec2(.5, .866);
        float al = clamp(dot(b, dir), 0., lb);
        vec2 off = b - al * dir;
        float barb = smoothstep(.005, .0015, length(off)) * step(0., k) * step(k, L);
        // the barbs' own barbs, at 60° off the barb
        vec2 nb = vec2(-dir.y, dir.x);
        float u = dot(b, dir), v = dot(b, nb), s2 = s * .45;
        float t2 = abs(v) / .866, u0 = u - .5 * t2, k2 = floor(u0 / s2 + .5) * s2;
        float lb2 = max(lb - k2, 0.) * .35;
        vec2 c = vec2(u - k2, abs(v));
        float al2 = clamp(dot(c, dir), 0., lb2);
        float fine = smoothstep(.0035, .001, length(c - al2 * dir)) * step(.0, k2) * step(k2, lb) * step(0., k) * step(k, L) * .7;
        return max(stem, max(barb, fine));
      }
      // feathers rooted on a lattice, growing in from the frame (toward the centre, give or take), grown to g
      float frostFeathers(vec2 p, float cell, float g, float seed){
        vec2 base = floor(p / cell);
        float best = 0.;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
          vec2 id = base + vec2(i, j);
          vec2 h = h22(id + seed);
          vec2 o = (id + h) * cell;                                    // the root
          vec2 inward = -normalize(o + 1e-4);
          float an = atan(inward.y, inward.x) + (h.x - .5) * 1.6;
          vec2 dd = vec2(cos(an), sin(an));
          vec2 q = mat2(dd.x, -dd.y, dd.y, dd.x) * (p - o);
          q.y += sin(q.x / cell * 3.1 + h.y * 6.) * cell * .06;      // stems are never quite straight
          float L = (.7 + .5 * h.y) * g;
          best = max(best, feather(q / cell, L, .075));
        }
        return best;
      }
`,B=e=>e.replace(/(\d),(?=\d)/g,"$1٬").replace(/(\d)\.(?=\d)/g,"$1٫").replace(/\d/g,a=>"٠١٢٣٤٥٦٧٨٩"[+a]),u={first:.08,last:.93},E=(e,a)=>(e-u.first)/(u.last-u.first)*(a-1),r=i.almaali.channels,o=i.metaPilot,h=i.cumulative,m=i.crm,l=i.education[0],w=e=>e>=1e6?`${e/1e6}M`:e>=1e3?`${+(e/1e3).toFixed(1)}K`:String(e),s=e=>e.replace(/^1M\+$/,"أكثر من مليون").replace(/^(\d+(?:\.\d+)?)M\+$/,"أكثر من $1 مليون").replace(/^(\d+(?:\.\d+)?)K$/,(a,t)=>`${t} ${+t>2&&+t<11&&!t.includes(".")?"آلاف":"ألف"}`),O=[{year:"2020",head:{en:"A degree in AI begins",ar:"بداية دراسة الذكاء الاصطناعي"},line:{en:`${l.degree.en}, ${l.org.en}, ${l.period}.`,ar:`${l.degree.ar}، ${l.org.ar}، ${l.period}.`},etch:{en:"BSc · Artificial Intelligence",ar:"بكالوريوس · ذكاء اصطناعي"}},{year:"2021",head:{en:"A satellite channel’s pages",ar:"صفحات قناة فضائية"},line:{en:`Al-Ma’ali Satellite Channel, from ${r[0].fromLabel} on ${r[0].platform} and ${r[1].fromLabel} on ${r[1].platform}.`,ar:`قناة المعالي الفضائية، من ${s(r[0].fromLabel)} على فيسبوك و${s(r[1].fromLabel)} على إنستغرام.`},etch:{en:`Facebook ${r[0].fromLabel}`,ar:`فيسبوك ${s(r[0].fromLabel)}`}},{year:"2022",head:{en:"Both, every day",ar:"الاثنان، كل يوم"},line:{en:"Studying AI and growing the channel’s pages.",ar:"دراسة الذكاء الاصطناعي وتنمية صفحات القناة."},etch:{en:"Studying · the channel",ar:"الدراسة · القناة"}},{year:"2023",head:{en:"Still both",ar:"وما زال الاثنان"},line:{en:"The degree and the channel run on together.",ar:"الدراسة والقناة تمضيان معاً."},etch:{en:"Studying · the channel",ar:"الدراسة · القناة"}},{year:"2024",head:{en:"BSc, Artificial Intelligence",ar:"بكالوريوس الذكاء الاصطناعي"},line:{en:`${l.org.en}, ${l.period}.`,ar:`${l.org.ar}، ${l.period}.`},etch:{en:"BSc, Artificial Intelligence",ar:"بكالوريوس الذكاء الاصطناعي"}},{year:"2025",head:{en:`${r[0].toLabel} on Facebook`,ar:`${s(r[0].toLabel)} على فيسبوك`},line:{en:`Al-Ma’ali, ${i.almaali.period}: Instagram ${r[1].toLabel}, TikTok ${r[2].toLabel}, YouTube ${r[3].toLabel}. Paid social 2025–2026: ${h.impressionsLabel.en} impressions, ${h.leadsAndCalls}+ leads and calls.`,ar:`المعالي، ${i.almaali.period}: إنستغرام ${s(r[1].toLabel)}، تيك توك ${s(r[2].toLabel)}، يوتيوب ${s(r[3].toLabel)}. إعلانات ممولة 2025–2026: ${h.impressionsLabel.ar} ظهور، وأكثر من ${h.leadsAndCalls} عميل محتمل ومكالمة.`},etch:{en:`Facebook ${r[0].toLabel}`,ar:`فيسبوك ${s(r[0].toLabel)}`}},{year:"2026",head:{en:`${o.leads} leads from $${o.spendUsd}`,ar:`${o.leads} عميلاً محتملاً من ${o.spendUsd} دولاراً`},line:{en:`A Meta pilot: about $${o.costPerLeadUsd.toFixed(2)} a lead, the best campaign $${o.bestCostPerLeadUsd.toFixed(2)}, ${w(o.reach)} people reached, leads on ${o.leadChannel.en}.`,ar:`تجربة على ميتا: نحو ${o.costPerLeadUsd.toFixed(2)} دولار للعميل، وأفضل حملة ${o.bestCostPerLeadUsd.toFixed(2)} دولار، ووصول إلى ${s(w(o.reach))} شخص، والعملاء عبر ${o.leadChannel.ar}.`},etch:{en:`${o.leads} leads · $${o.costPerLeadUsd.toFixed(2)} each`,ar:`${o.leads} عميلاً · ${o.costPerLeadUsd.toFixed(2)} دولار للعميل`}},{year:"now",head:{en:"Fifteen apps",ar:"خمسة عشر تطبيقاً"},line:{en:`Each with its own film. A bilingual CRM of ${m.tabs} tabs and ${m.contactsCaptured}+ contacts. ${i.certifications[0].name.en}, ${i.certifications[0].org}.`,ar:`لكل منها فيلمه. ونظام عملاء ثنائي اللغة من ${m.tabs} تبويباً وأكثر من ${m.contactsCaptured} جهة اتصال. ${i.certifications[0].name.ar}، ${i.certifications[0].org}.`},etch:{en:"15 apps · 15 films",ar:"15 تطبيقاً · 15 فيلماً"}}],R={first:.09,last:.9},f=[{alt:5364,label:{en:"Base Camp",ar:"معسكر القاعدة"}},{alt:6065,label:{en:"Camp 1",ar:"المعسكر 1"}},{alt:6500,label:{en:"Camp 2",ar:"المعسكر 2"}},{alt:7470,label:{en:"Camp 3",ar:"المعسكر 3"}},{alt:7920,label:{en:"Camp 4 · South Col",ar:"المعسكر 4 · الممر الجنوبي"}},{alt:8848.86,label:{en:"Summit",ar:"القمة"}}],x={start:.06,end:.9},D=e=>Math.min(1,Math.max(0,(e-x.start)/(x.end-x.start))),v=[0,.2,.38,.58,.75,1];function G(e){for(let a=0;a<f.length-1;a++)if(e<=v[a+1]){const t=(e-v[a])/(v[a+1]-v[a]);return f[a].alt+(f[a+1].alt-f[a].alt)*t}return f[f.length-1].alt}const K={write:[.14,.5]},P=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,j=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,d={x:0,y:0,t:-1};function N(e,a,t){if(d.t!==a){d.t=a;const n=e.pointer.inside&&!j&&!P;d.x=L(d.x,n?e.pointer.x:0,2.6,t),d.y=L(d.y,n?e.pointer.y:0,2.6,t)}return d}const q=new b,z=new b(0,1,0),$=new S,M=new b,k=new b;function _(e,a,t,n,c,{roll:p=0,slide:g=1,upHint:y=z}={}){q.copy(t).sub(a).setLength(Math.min(5,a.distanceTo(t))).add(a),$.lookAt(a,t,y),M.setFromMatrixColumn($,0),k.setFromMatrixColumn($,1),e.position.copy(a).addScaledVector(M,n*.32*g).addScaledVector(k,c*.2*g),e.up.copy(y),e.lookAt(q),e.rotateZ(-n*.016+p),e.updateMatrixWorld()}function Y(e,a,t,n,c){const p=Math.tan(F.degToRad(e.fov/2));return Math.max(t/(2*p*c),a/(2*p*e.aspect*n))}function Q(e,a,t,n,c){if(Math.abs(a)<1e-4&&Math.abs(t)<1e-4){e.clearViewOffset();return}e.setViewOffset(n,c,-a*n/2,t*c/2,n,c)}function Z(e,a){const t=new C(new A(2,2),e);return t.frustumCulled=!1,t.renderOrder=a,t}const J=(e=1)=>`
  varying vec2 vUv; varying vec4 vDir;
  void main(){
    vUv = uv;
    vec4 w = inverse(projectionMatrix * viewMatrix) * vec4(position.xy, 1., 1.);
    vDir = vec4(w.xyz - cameraPosition * w.w, w.w);
    gl_Position = vec4(position.xy, ${e.toFixed(4)}, 1.);
  }`,X=e=>{const a=typeof location<"u"?new URLSearchParams(location.search).get(e):null;return a===null?null:Number(a)},W=()=>Promise.allSettled(['300 100px "Space Grotesk Variable"','500 100px "Space Grotesk Variable"','600 100px "Inter Variable"','700 100px "Cairo Variable"','500 100px "Cairo Variable"'].map(e=>document.fonts.load(e))),H=()=>new Promise(e=>requestAnimationFrame(()=>e()));export{R as C,T as F,O as L,I as N,K as S,P as a,B as b,Q as c,H as d,Y as e,W as f,E as g,v as h,f as i,G as j,D as k,_ as l,j as m,X as n,N as p,J as q,Z as s};
