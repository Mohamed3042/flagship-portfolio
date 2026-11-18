import{_ as vc}from"./preload-helper.4QTdcD_W.js";import{V as _,y as z0,M as Ke,P as tr,C as Gt,aG as k0,r as fe,f as rn,W as sa,H as la,d as fn,aN as hi,w as hs,az as nr,U as Os,R as gc,j as mi,o as vi,au as Gn,k as bt,F as ct,b9 as gi,a as Ln,Q as Wt,h as Bn,aP as xc,ba as wc,G as pt,Y as yn,i as m0,T as ua,N as ya,s as uo,a9 as Cn,a7 as ft,am as Ua,ak as or,a3 as yc,aH as bc,ay as $a,J as y0,ag as P0,B as ra,ah as xn,ab as ms,m as xi,e as Pn,c as oo,S as ja,ao as kr,O as wi,b5 as yi,b3 as Mc,b4 as Sc,aD as bi,I as zc,z as kc,A as Mi,ap as Pc,aE as Si,b as ca,$ as $0,a0 as Ac,bb as Rc,n as Pr,as as rs,bc as Cc,_ as Tc,aa as zi,u as Ba,ai as Fc,a8 as no,aj as ki,aR as Pi,bd as ar,ae as Ai,be as _c,aZ as Ic,a_ as Lc,bf as Dc,bg as Ec,bh as Wc,bi as Nc,v as Bc,x as Hc,bj as Oc,bk as Vc}from"./three.module.Ck-uN-my.js";import{a as Ri,m as qc}from"./BufferGeometryUtils.C-QZNzVN.js";import{R as Gc}from"./RoundedBoxGeometry.CwROy-wR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ci=-14,La=-12,Ro=7/60*Math.PI*2,Wo=[6.4,7,-8.1],is=1,Na=[3.5,-11.3,-11.5],j0=3.4,ro=[9.7,-11.25,-9.2],Vs=1.75,Uc=[7.6,-11.2,-11.2],vo=[7.95,-11.05,-9.75],Ti=[19,-8.6,-6.5],qs=[8.2,-10.6,-9.6],F0=70,n0=260,$c=[[-6.5,-9.2,6.5],[-14.5,-6,3],[-14,-2.4,-6],[-6,-1.8,-11],[.5,-3,-6],[1,-3,.5],[4.6,-3.6,7.5],[1.5,-7.8,12],[-4,-10.5,13.5]],bo=(t,e)=>[t[0]+e[0],t[1]+e[1],t[2]+e[2]],jc=(t,e)=>Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]),Fi=[{id:"0",name:"THE LID",move:"held",approach:.04,hold:.06,rim:1,pose:{pos:[69.2,50,35.6],look:[-10.4,-1,3.2],mm:40,pl:[3,0,-7.4]},drift:[0,0,0],light:{blade:{from:[-90,140,-30],to:[0,0,0],angle:.36,power:40},red:{at:[9,-3,-8],power:0,reach:30},haze:.02,env:0},stop:{blade:.4,red:1,angle:1},trick:{loop:8,release:.8,rare:0},exposure:1.3},{id:"1",name:"THE HAND",move:"slide",approach:.06,hold:.05,returnPow:3,pose:{pos:[12.95,1.54,-18],look:[10.9,-1.05,-10.49],mm:24,pf:1.15,pl:[0,-.5,0]},drift:[.006,-.002,-.004],light:{blade:{from:[-24,30,14],to:[13.1,0,-14.6],angle:.14,power:60},red:{at:[10,-1.4,-11],power:0,reach:18},haze:0,env:2},stop:{blade:.5,red:2.4,angle:1},trick:{loop:6,release:.7,rare:6},exposure:5.5,sharp:[.18,1]},{id:"2",name:"THE DROPS",move:"crane",approach:.05,hold:.05,pose:{pos:[22.2,21.9,6.2],look:[8.01,7,-9.77],mm:90,pf:1.25,pl:[-1.4,1.5,1.3]},drift:[0,.1,0],sharp:[.95,1.05],aperture:4,blurMul:1.25,light:{blade:{from:[-30,40,-40],to:[-1,0,-14],angle:.3,power:1.5},red:{at:[3,1,-13],power:0,reach:22},haze:.25,env:2},stop:{blade:.45,red:1.4,angle:1},trick:{loop:8,release:.8,rare:6},exposure:1.1,exposureIn:.5,lift:[.6,0,.35]},{id:"G",name:"THE GATE",move:"through",approach:.05,hold:.07,pose:{pos:[-8,22,34],look:[-6,0,11],mm:32,pf:1.05},drift:[0,-.6,-.4],light:{blade:{from:[-34,80,52],to:[-6,0,8],angle:.28,power:14},red:{at:[9.5,-10.5,-9],power:10,reach:3},haze:0,env:2},stop:{blade:.8,red:1.8,angle:1},trick:{loop:8,release:1,rare:0},exposure:6.8,exposureIn:.55,lightFrom:.12,lightIn:.6,lift:[1.2,0,1,.12],liftPre:1.35,pulseGain:.02,neutral:1},{id:"3",name:"THE BURST",move:"fall",approach:.06,hold:.06,pose:{pos:[-3,-3.2,12.5],look:[-4.5,-6.4,0],mm:24,pf:.86,pr:-.85,pl:[1.2,0,-.15]},drift:[-.15,-.05,-.25],light:{blade:{from:[-23.93,32.93,14.84],to:[-3.1,-4.49,1.03],angle:.2,power:40,pen:.4},red:{at:[3.2,-7.4,-4.6],power:22,reach:6},haze:.1,env:2},stop:{blade:.6,red:.7,angle:1},trick:{loop:9,release:1,rare:5},pulseWidth:.04,sharp:[.4,1.25]},{id:"4",name:"THE STRAIN",move:"ride",approach:.06,hold:.05,pose:{pos:[1.97,-3.488,8.394],look:[3.985,-6.7,1.807],mm:100,roll:0,pf:.92,pl:[-.36,-.205,.132]},drift:[.01,0,-.02],light:{blade:{from:[2.543,-2,-8.958],to:[3.547,-7,1.394],angle:.09,power:6.8,pen:.9},red:{at:[5,-8.2,0],power:1.5,reach:6},haze:3.6,env:2},stop:{blade:1.25,red:1.6,angle:.85},trick:{loop:8,release:.6,rare:4},pulseWidth:.05,sharp:[.975,1.025],aperture:3,blurMul:1.4,lift:[.7,.5,.85]},{id:"5",name:"THE HEART",move:"track",approach:.07,hold:.06,pose:{pos:bo(Na,[0,2.9,9.6]),look:bo(Na,[1.5,1,0]),mm:28,pf:.6,pl:[-1.3,3.9,0],pp:[.6,1,2.2]},drift:[0,.05,.25],light:{blade:{from:bo(Na,[-10.4,24.8,-11.2]),to:bo(Na,[-.1,0,.3]),angle:.11,power:120,pen:.18},red:{at:bo(vo,[-.3,-.4,.2]),power:7,reach:6.8},haze:0,env:2},stop:{blade:.67,red:1.6,angle:1},trick:{loop:8,release:.9,rare:8},lightIn:.3,stopDelay:1.5,pulseWidth:.05,sharp:[.42,1.06]},{id:"6",name:"THE JAM",move:"spiral",approach:.05,hold:.06,pose:{pos:bo(vo,[4.977,3.433,2.874]),look:bo(vo,[0,-.2,.3]),mm:100,pf:.9,pr:-1,pl:[0,0,-.05]},drift:[.02,0,-.06],light:{blade:{from:bo(vo,[-5,10,-2]),to:bo(vo,[.1,-.22,.4]),angle:.105,power:256},red:{at:bo(vo,[.1,.3,.5]),power:.05,reach:2},haze:0,env:0},stop:{blade:.05,red:1.8,angle:1},trick:{loop:6,release:.5,rare:2},pulseWidth:.05,lightFrom:.5,lightIn:.62,sharp:[.77,1.06]},{id:"7",name:"THE TICK",move:"recoil",approach:.05,hold:.06,pose:{pos:Ti,look:qs,mm:50,pf:.66,pl:[.047,0,-.163]},drift:[-.189,-.035,-.054],light:{blade:{from:[20,-2.17,-3.1],to:bo(qs,[.6,0,.2]),angle:.3,power:16},red:{at:[11.27,-9.98,-9.4],power:1.5,reach:3},haze:.2,env:2},stop:{blade:.75,red:2.2,angle:1},trick:{loop:8,release:.8,rare:6},sharp:[.5,1.4],lift:[.8,.1,.8]},{id:"8",name:"THE SECOND ENDS",move:"wipe",approach:.06,hold:.08,rim:1,pose:{pos:[92,66,44],look:[-16,14,4],mm:33,pf:.8,pl:[12,-6,4]},drift:[-.8,-.6,-.6],light:{blade:{from:[50,170,70],to:[-8,-4,0],angle:.42,power:52},red:{at:[4,2,-4],power:0,reach:30},haze:.14,env:0},stop:{blade:1,red:1,angle:1},trick:{loop:10,release:1,rare:8},exposure:1.8}],Ar=Fi.reduce((t,e)=>t+e.approach+e.hold,0),Fe=(()=>{let t=0;return Fi.map(e=>{const n=t,o=n+e.approach/Ar,a=o+e.hold/Ar;return t=a,{...e,a0:n,h0:o,h1:a,focus:e.focus??jc(e.pose.pos,e.pose.look)}})})();Fe[Fe.length-1].h1=1;function _i(t,e,n){if(n){const i=Fe[t+1]?.liftPre;return i?1+(i-1)*ve((e-.85)/.15):1}const o=Fe[t]?.lift,a=Fe[t]?.liftPre,s=o?o[3]??Math.min(.3,(o[2]-o[1])/2):1,r=o?1+o[0]*ve((e-o[1])/.04)*(1-ve((e-o[2]+s)/s)):1;return a?Math.max(r,1+(a-1)*(1-ve(e/.15))):r}const Zn={cut:.2,lead:[.2,.76],trail:[.22,.84]},Gs=(t,e)=>-.12+(Math.PI/2+.37)*ve((t-e[0])/(e[1]-e[0])),wn={settle:1,pulse:1.5,rare:10,pulseLen:1.6},xt=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),ve=t=>{const e=xt(t);return e*e*(3-2*e)};function Ha(t){const e=xt(t);let n=Fe.findIndex(r=>e<r.h1);n<0&&(n=Fe.length-1);const o=Fe[n],a=e>=o.h0,s=a?(e-o.h0)/(o.h1-o.h0):(e-o.a0)/(o.h0-o.a0);return{i:n,place:o,inHold:a,u:xt(s)}}function Kc(t){let e=0,n=1/0;return Fe.forEach((o,a)=>{const s=t<o.h0?o.h0-t:t>o.h1?t-o.h1:0;s<n&&(n=s,e=a)}),e}function Yc(t,e){const n=Fe[t].trick.loop,o=Math.max(0,e-wn.pulse)/n;return o-Math.floor(o)}const sr=Fe.find(t=>t.id==="3"),Ii=2270/1290,rr=new _(...sr.pose.pos),Xc=new _(...sr.pose.look),Oa=Xc.clone().sub(rr).normalize(),xa=Oa.clone().cross(new _(0,1,0)).normalize(),ga=xa.clone().cross(Oa).normalize(),Li=36/Ii/2/sr.pose.mm,Zc=Li*Ii,ea=rr;function kn(t,e,n){return rr.clone().addScaledVector(Oa,n).addScaledVector(xa,t*n*Zc).addScaledVector(ga,e*n*Li)}const Us=[kn(-.3,-.46,10.4),kn(-.06,0,11.2),kn(.12,.42,12.2),kn(.35,.68,12.8),kn(.58,.8,13.2),kn(.8,.68,13),kn(.93,.36,12.4),kn(.86,.06,11.8),kn(.68,-.02,11.4)],Qc=kn(-.4,-.66,8.7),Jc=new _(3.5,-7,2),Rr=new _(.996,0,-.087).normalize(),Uo=t=>new _(t[0],t[1],t[2]),un=(t,e,n)=>t+(e-t)*n,Da=(t,e=3)=>1-Math.pow(1-xt(t),e),Cr=(t,e=2)=>Math.pow(xt(t),e),Qt=(t,e,n)=>xt((t-e)/(n-e));new z0($c.map(Uo),!1,"centripetal");const Tr=new z0(Us.slice(1),!1,"centripetal"),ho={i:Fe.findIndex(t=>t.id==="8"),shut:.62,land:.69};function No(t,e){const n=Fe[t],o=n.drift,a=e-.5;return{pos:Uo(n.pose.pos).add(new _(o[0]*a,o[1]*a,o[2]*a)),look:Uo(n.pose.look),mm:n.pose.mm,roll:n.pose.roll??0,shake:0,cover:0,wipe:0,flip:0}}const ko=(t,e,n)=>({pos:t.pos.clone().lerp(e.pos,n),look:t.look.clone().lerp(e.look,n),mm:un(t.mm,e.mm,n),roll:un(t.roll,e.roll,n),shake:un(t.shake,e.shake,n),cover:0,wipe:0,flip:0});function el(t,e){const n=t>0?No(t-1,1):No(0,0),o=No(t,0);switch(Fe[t].move){case"held":return o;case"slide":{const s={...ko(n,o,ve(e))};return s.pos.y=un(n.pos.y,o.pos.y,Da(e,4)),s.pos.x=un(n.pos.x,o.pos.x,Math.pow(ve(e),1.4)),s}case"crane":{const s=ve(Qt(e,0,.5)),r=ve(Qt(e,.38,1)),i=11,c=new _(un(n.pos.x,o.pos.x,r),un(n.pos.y,i,s)+(o.pos.y-i)*r,un(n.pos.z,o.pos.z,r)),l=Uo(Wo);l.y=n.look.y;const d=n.look.clone().lerp(l.lerp(Uo(Wo),.35),ve(Qt(e,.08,.55))).lerp(o.look,r);return{pos:c,look:d,mm:un(n.mm,o.mm,Cr(Qt(e,.3,1),2)),roll:0,shake:0,cover:0,wipe:0,flip:0}}case"through":{const s=Uo(Wo),r=s.clone().add(new _(1.2,4.5,.8)),i=ve(e)*.55+(1-(1-e)**2.4)*.45,c=1-i,l=n.pos.clone().multiplyScalar(c*c).add(r.clone().multiplyScalar(2*c*i)).add(o.pos.clone().multiplyScalar(i*i)),d=n.look.clone().lerp(s,ve(Qt(e,0,.45))).lerp(o.look,ve(Qt(e,.45,1)));return{pos:l,look:d,mm:un(n.mm,o.mm,ve(e)),roll:0,shake:0,cover:0,wipe:0,flip:0}}case"fall":{const s=ve(Qt(e,0,.4)),r=e<.8?.9*Cr(e/.8,1.6):.9+.1*Da(Qt(e,.8,1),2),i=new _(un(n.pos.x,o.pos.x,s),un(n.pos.y,o.pos.y,r),un(n.pos.z,o.pos.z,s)),c=n.look.clone().sub(n.pos).normalize(),l=new _(0,-1,0),d=o.look.clone().sub(o.pos).normalize(),u=c.lerp(l,ve(Qt(e,0,.4))).lerp(d,ve(Qt(e,.55,1))).normalize(),p=i.clone().add(u.multiplyScalar(10));return{pos:i,look:p,mm:un(n.mm,o.mm,ve(e)),roll:0,shake:e>.6&&e<.9?.15*Math.sin(Qt(e,.6,.9)*Math.PI):0,cover:0,wipe:0,flip:0}}case"ride":{const s=un(.05,.6,ve(xt(e/.8))),r=Tr.getPointAt(s),i=Tr.getPointAt(Math.min(1,s+.08)),c=ea.clone().sub(r).normalize().multiplyScalar(.7).add(new _(0,.8,0)),l={pos:r.clone().add(c),look:i.addScaledVector(c,.3),mm:un(24,45,ve(e)),roll:Math.sin(e*Math.PI)*.3,shake:0,cover:0,wipe:0,flip:0};if(e<.15)return ko(n,l,ve(e/.15));if(e>.5&&o.mm>60){const d=ve(Qt(e,.5,1)),u=o.look.clone().add(o.pos.clone().sub(o.look).multiplyScalar(1+2.5*(1-d))),p=ko(l,o,d);return p.pos.copy(l.pos.clone().lerp(u,ve(Qt(e,.5,.62)))),p.look.lerp(o.look,ve(Qt(e,.5,.62))),p}return e>.72?ko(l,o,ve(Qt(e,.72,1))):l}case"track":{const s={pos:new _(-4.5,-8.2,-5.2),look:new _(.6,-10,-15),mm:28,roll:0,shake:0},r={pos:new _(3.5,-8.4,-5.6),look:new _(4.8,-10.2,-14.6),mm:28,roll:0,shake:0};return e<.22?ko(n,s,ve(e/.22)):e<.62?ko(s,r,Qt(e,.22,.62)):ko(r,o,ve(Qt(e,.62,1)))}case"spiral":{const s=Uo(Na).add(new _(0,.14,0)),r=Math.atan2(n.pos.z-s.z,n.pos.x-s.x),i=Math.hypot(n.pos.x-s.x,n.pos.z-s.z),c=ve(Qt(e,0,.55)),l=r-c*Math.PI*2.1,d=un(i,.75,Math.pow(c,.7)),u=new _(s.x+Math.cos(l)*d,un(n.pos.y,s.y+.36,Math.pow(c,.8)),s.z+Math.sin(l)*d),p=new _(s.x+Math.cos(l-.9)*d*.55,s.y-.05,s.z+Math.sin(l-.9)*d*.55),f=ve(Qt(e,.3,.62)),v={pos:u,look:n.look.clone().lerp(p,ve(Qt(e,0,.3))).lerp(o.look,f),mm:un(n.mm,24,c),roll:0,shake:0,cover:0,wipe:0,flip:0};if(e<.55)return v;const h=ve(Qt(e,.55,1)),m=ko(v,o,h);return m.pos.y+=Math.sin(Math.PI*h)*1.1,{...m,look:p.clone().lerp(o.look,f)}}case"recoil":{const s=Da(Qt(e,.04,.86),3.2),r=Uo(vo),i=n.pos.clone().sub(r).multiplyScalar(2.4).add(r),l={pos:n.pos.clone().multiplyScalar((1-s)*(1-s)).addScaledVector(i,2*s*(1-s)).addScaledVector(o.pos,s*s),look:r.lerp(o.look,ve(Qt(e,.04,.7))),mm:un(n.mm,o.mm,Da(Qt(e,.04,.6),2)),roll:0,shake:0,cover:0,wipe:0,flip:0};return l.shake=e<.04?e/.04*.15:.7*Math.exp(-(e-.04)*14),l}case"wipe":{const s={...o,pos:o.pos.clone().lerp(o.look,.18)},r=e<Zn.cut?Di(n,e):ko(s,o,Da(Qt(e,Zn.trail[0],1),3));return r.cover=0,r.wipe=e,r}}}function Di(t,e){return ko(t,{...t,pos:t.pos.clone().lerp(Uo(vo),-.15)},ve(e/Zn.trail[1]))}function tl(t){const e=ho.i,n=No(e,0),o={...n,pos:n.pos.clone().lerp(n.look,.18)},a=ko(o,n,Da(Qt(t,Zn.trail[0],1),3));a.wipe=t;const s=Di(No(e-1,1),t);return s.wipe=t,{a:s,b:a}}function o0(t){const e=Ha(t.p);let n;if(t.reduced?n=No(e.i,.5):n=e.inHold?No(e.i,e.u):el(e.i,e.u),t.stop.station>=0&&!t.reduced){const o=ve(t.stop.t/wn.settle)*(1-ve(t.stop.rel/.8));n.pos.lerp(n.look,.012*o)}if(e.i===ho.i&&e.inHold&&t.stop.station===ho.i&&t.stop.rare&&!t.reduced&&Fe[ho.i].trick.rare>0){const o=(t.stop.t-wn.rare)/Fe[ho.i].trick.rare;if(o>=ho.shut){const a=t.stop.rel>0?1-ve(t.stop.rel/Fe[ho.i].trick.release):1,s=xt((o-ho.shut)/(ho.land-ho.shut)),r=s*s*a,i=No(0,0);n={...n,pos:n.pos.clone().lerp(i.pos,r),look:n.look.clone().lerp(i.look,r),mm:un(n.mm,i.mm,r)};const c=t.stop.t-wn.rare-ho.land*Fe[ho.i].trick.rare;n.shake=c>=0&&c<.45?.5*Math.exp(-c*9):0}}return n}const nl=new _,_0=new _,Fr=new _;function ol(t,e,n,o){t.filmGauge=36;const a=Ha(n.p),s=h=>Fe[Math.max(0,h)].pose.pf??.72,r=a.inHold||n.reduced?s(a.i):un(s(a.i-1),s(a.i),ve(a.u));if(o){const h=g=>new _(...Fe[Math.max(0,g)].pose.pl??[0,0,0]),m=a.inHold||n.reduced?h(a.i):h(a.i-1).lerp(h(a.i),ve(a.u)),M=g=>new _(...Fe[Math.max(0,g)].pose.pp??[0,0,0]),x=a.inHold||n.reduced?M(a.i):M(a.i-1).lerp(M(a.i),ve(a.u));(m.lengthSq()>0||x.lengthSq()>0)&&(e={...e,look:e.look.clone().add(m),pos:e.pos.clone().add(x)})}if(o){const h=M=>Fe[Math.max(0,M)].pose.pr??0,m=a.inHold||n.reduced?h(a.i):un(h(a.i-1),h(a.i),ve(a.u));m!==0&&(e={...e,roll:e.roll+m})}t.setFocalLength(o?e.mm*r:e.mm);const i=nl.copy(e.look).sub(e.pos).normalize(),c=ve((Math.abs(i.y)-.85)/.14);Fr.set(0,1,0).lerp(new _(0,0,-1),c).normalize(),_0.crossVectors(i,Fr).normalize();const l=new _().crossVectors(_0,i).normalize(),d=e.pos.distanceTo(e.look),u=n.reduced?0:(n.pointer.x-.5)*2,p=n.reduced?0:(n.pointer.y-.5)*2,f=d*.025,v=e.pos.clone().addScaledVector(_0,u*f).addScaledVector(l,-p*f*.6);if(e.shake>0&&!n.reduced){const h=n.time*37;v.addScaledVector(_0,Math.sin(h*1.3)*e.shake*d*.02).addScaledVector(l,Math.sin(h*1.7+1)*e.shake*d*.02)}return t.position.copy(v),t.up.copy(l),t.lookAt(e.look),t.rotateZ(e.roll-u*.012),t.near=Math.max(.004,d*.004),t.far=2e3,t.updateProjectionMatrix(),t.updateMatrixWorld(),d}const cs=()=>({station:-1,t:0,rare:!0,rel:99});function tt(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let n=e;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}class Sa extends Ke{constructor(e,n={}){super(e),this.isReflector=!0,this.type="Reflector",this.forceUpdate=!1,this.camera=new tr;const o=this,a=n.color!==void 0?new Gt(n.color):new Gt(8355711),s=n.textureWidth||512,r=n.textureHeight||512,i=n.clipBias||0,c=n.shader||Sa.ReflectorShader,l=n.multisample!==void 0?n.multisample:4,d=new k0,u=new _,p=new _,f=new _,v=new fe,h=new _(0,0,-1),m=new rn,M=new _,x=new _,g=new rn,w=new fe,y=this.camera,S=new sa(s,r,{samples:l,type:la}),R=new fn({name:c.name!==void 0?c.name:"unspecified",uniforms:hi.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});R.uniforms.tDiffuse.value=S.texture,R.uniforms.color.value=a,R.uniforms.textureMatrix.value=w,this.material=R,this.onBeforeRender=function(k,L,C){if(p.setFromMatrixPosition(o.matrixWorld),f.setFromMatrixPosition(C.matrixWorld),v.extractRotation(o.matrixWorld),u.set(0,0,1),u.applyMatrix4(v),M.subVectors(p,f),M.dot(u)>0===!0&&this.forceUpdate===!1)return;M.reflect(u).negate(),M.add(p),v.extractRotation(C.matrixWorld),h.set(0,0,-1),h.applyMatrix4(v),h.add(f),x.subVectors(p,h),x.reflect(u).negate(),x.add(p),y.position.copy(M),y.up.set(0,1,0),y.up.applyMatrix4(v),y.up.reflect(u),y.lookAt(x),y.far=C.far,y.updateMatrixWorld(),y.projectionMatrix.copy(C.projectionMatrix),w.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),w.multiply(y.projectionMatrix),w.multiply(y.matrixWorldInverse),w.multiply(o.matrixWorld),d.setFromNormalAndCoplanarPoint(u,p),d.applyMatrix4(y.matrixWorldInverse),m.set(d.normal.x,d.normal.y,d.normal.z,d.constant);const b=y.projectionMatrix;g.x=(Math.sign(m.x)+b.elements[8])/b.elements[0],g.y=(Math.sign(m.y)+b.elements[9])/b.elements[5],g.z=-1,g.w=(1+b.elements[10])/b.elements[14],m.multiplyScalar(2/m.dot(g)),b.elements[2]=m.x,b.elements[6]=m.y,b.elements[10]=m.z+1-i,b.elements[14]=m.w,o.visible=!1;const P=k.getRenderTarget(),I=k.xr.enabled,F=k.shadowMap.autoUpdate;k.xr.enabled=!1,k.shadowMap.autoUpdate=!1,k.setRenderTarget(S),k.state.buffers.depth.setMask(!0),k.autoClear===!1&&k.clear(),k.render(L,y),k.xr.enabled=I,k.shadowMap.autoUpdate=F,k.setRenderTarget(P);const D=C.viewport;D!==void 0&&k.state.viewport(D),o.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return S},this.dispose=function(){S.dispose(),o.material.dispose()}}}Sa.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};function Ei(t,e,n){const o=new Float32Array(e*e).map(()=>n()),a=new Float32Array(t*t);for(let s=0;s<t;s++)for(let r=0;r<t;r++){const i=r/t*e,c=s/t*e,l=Math.floor(i),d=Math.floor(c),u=i-l,p=c-d,f=u*u*(3-2*u),v=p*p*(3-2*p),h=(x,g)=>o[(g%e+e)%e*e+(x%e+e)%e],m=h(l,d)+(h(l+1,d)-h(l,d))*f,M=h(l,d+1)+(h(l+1,d+1)-h(l,d+1))*f;a[s*t+r]=m+(M-m)*v}return a}function I0(t,e,n,o){const a=new Float32Array(t*t);let s=.5,r=0;for(let i=0;i<n;i++){const c=Ei(t,e<<i,o);for(let l=0;l<a.length;l++)a[l]+=c[l]*s;r+=s,s*=.5}for(let i=0;i<a.length;i++)a[i]/=r;return a}function ys(t,e){const n=new hs(e,t,t,nr,Os);return n.wrapS=n.wrapT=gc,n.magFilter=mi,n.minFilter=vi,n.generateMipmaps=!0,n.anisotropy=4,n.needsUpdate=!0,n}const a0=t=>{let e=1/0,n=-1/0;for(const o of t)e=Math.min(e,o),n=Math.max(n,o);return t.map(o=>(o-e)/(n-e||1))};let L0=null;function Yo(){if(L0)return L0;const t=tt(90210),e=256,n=a0(I0(e,16,4,t)),o=a0(I0(e,8,4,t)),a=a0(I0(e,4,3,t)),s=a0(Ei(e,128,t)),r=new Uint8Array(e*e*4);for(let m=0;m<e*e;m++)r[m*4]=n[m]*255,r[m*4+1]=o[m]*255,r[m*4+2]=a[m]*255,r[m*4+3]=s[m]*255;const i=512,c=new Float32Array(i*i),l=a0(I0(i,6,3,t));for(let m=0;m<5200;m++){let M=t()*i,x=t()*i;for(let S=0;S<6&&l[Math.floor(x)%i*i+Math.floor(M)%i]<.55;S++)M=t()*i,x=t()*i;const g=1.2+t()*t()*5.5,w=.5+t()*.5,y=Math.ceil(g+1);for(let S=-y;S<=y;S++)for(let R=-y;R<=y;R++){const k=Math.hypot(R,S)/g;if(k>=1)continue;const L=((Math.floor(M)+R)%i+i)%i,C=((Math.floor(x)+S)%i+i)%i,z=w*(1-k*k);c[C*i+L]=Math.max(c[C*i+L],z)}}const d=new Uint8Array(i*i*4);for(let m=0;m<i*i;m++)d[m*4]=Math.min(1,c[m])*255,d[m*4+1]=l[m]*255,d[m*4+2]=0,d[m*4+3]=255;const u=512,p=new Float32Array(u*u),f=new Float32Array(u*u),v=(m,M,x,g)=>{for(let w=0;w<M;w++){const y=t()*u,S=t()*u,R=g+(t()-.5)*1.2,k=60+t()*300,L=x*(.5+t()),C=.4+t()*.6,z=Math.cos(R),b=Math.sin(R),P=Math.ceil(k*2);for(let I=0;I<P;I++){const F=I/2,D=Math.sin(Math.PI*F/k),J=Math.sin(F/k*3+w)*4,Y=y+z*F-b*J,oe=S+b*F+z*J;for(let ae=-2;ae<=2;ae++)for(let G=-2;G<=2;G++){const te=Math.floor(Y)+G,V=Math.floor(oe)+ae,B=Math.abs((te+.5-Y)*-b+(V+.5-oe)*z),U=Math.max(0,1-B/L)*D*C,H=(V%u+u)%u*u+(te%u+u)%u;m[H]=Math.max(m[H],U)}}}};v(p,70,.9,.3),v(f,22,1.4,1.9);const h=new Uint8Array(u*u*4);for(let m=0;m<u*u;m++)h[m*4]=Math.min(1,p[m])*255,h[m*4+1]=Math.min(1,f[m])*255,h[m*4+2]=0,h[m*4+3]=255;return L0={noise:ys(e,r),pits:ys(i,d),scratch:ys(u,h)},L0}const Qn={centre:{value:new _},radius:{value:-1},width:{value:4},gain:{value:0}};function To(t){t.uniforms.uPulseC=Qn.centre,t.uniforms.uPulseR=Qn.radius,t.uniforms.uPulseW=Qn.width,t.uniforms.uPulseG=Qn.gain,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vPW;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
#ifdef USE_INSTANCING
vPW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
vPW = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vPW;
uniform vec3 uPulseC;
uniform float uPulseR;
uniform float uPulseW;
uniform float uPulseG;`).replace("#include <opaque_fragment>",["float pd = (length(vPW - uPulseC) - uPulseR) / uPulseW;","float pf = uPulseR > 0.0 ? exp(-pd * pd) * uPulseG : 0.0;","outgoingLight = outgoingLight * (1.0 + 3.0 * pf) + vec3(0.05, 0.0, 0.0) * pf;","#include <opaque_fragment>"].join(`
`))}function al(t){return t.onBeforeCompile=e=>To(e),t.customProgramCacheKey=()=>"ss-pulse",t}const Qa={value:1080},sl=`
attribute vec4 aThin;
uniform float uPxH;
varying float vThinF;`,rl=`
vThinF = 1.0;
if (dot(aThin.xyz, aThin.xyz) > 0.5) {
  vec4 mvT = modelViewMatrix * vec4(transformed, 1.0);
  float halfMin = max(-mvT.z, 1e-4) / (projectionMatrix[1][1] * uPxH * length(modelMatrix[0].xyz));
  vThinF = clamp(aThin.w / halfMin, 0.0, 1.0);
  transformed += aThin.xyz * max(halfMin - aThin.w, 0.0);
}`;function ir(t){t.uniforms.uPxH=Qa,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${sl}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${rl}`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying float vThinF;`).replace("#include <opaque_fragment>",`outgoingLight *= vThinF;
#include <opaque_fragment>`)}const il={polished:0,grained:1,striped:2,sunray:3,turned:4,brushed:5,blackened:6},cl=`
attribute float aCav;
attribute float aEdge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;
uniform float uObjScale;`,ll=`
vCav = aCav;
vEdge = aEdge;
vOP = position * uObjScale;
vON = normal;
#ifdef USE_INSTANCING
vOP += instanceMatrix[3].xyz * 0.731;
#endif`,ul=`
uniform sampler2D tNz;
uniform sampler2D tPit;
uniform sampler2D tScr;
uniform vec3 uSeed;
uniform float uWear;
uniform float uBump;
uniform float uDir;
uniform float uTone;
uniform vec2 uRS2;
uniform vec3 uTurn;
uniform float uAge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;
vec3 triW(vec3 n) { vec3 w = ((abs(n)) * (abs(n)) * (abs(n)) * (abs(n))); return w / (w.x + w.y + w.z); }
vec4 tri(sampler2D t, vec3 p, vec3 w) { return texture2D(t, p.yz) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.xy) * w.z; }
float bl(float period, float fw) { return 1.0 - smoothstep(0.3, 0.85, fw / period); }
vec3 bumpN(vec3 pos, vec3 n, vec2 dH, float fd) {
  vec3 sx = dFdx(pos);
  vec3 sy = dFdy(pos);
  vec3 r1 = cross(sy, n);
  vec3 r2 = cross(n, sx);
  float det = dot(sx, r1) * fd;
  vec3 g = sign(det) * (dH.x * r1 + dH.y * r2);
  return normalize(abs(det) * n - g);
}`,dl=`
vec3 sp = vOP + uSeed;
vec3 tw = triW(vON);
float fw = max(max(length(dFdx(vOP)), length(dFdy(vOP))), 1e-6);
float face = smoothstep(0.55, 0.85, abs(vON.y));
float rr = length(vOP.xz);
float an = atan(vOP.z, vOP.x);
float dax = dFdx(an); dax -= 6.2831853 * floor(dax / 6.2831853 + 0.5);
float day = dFdy(an); day -= 6.2831853 * floor(day / 6.2831853 + 0.5);
float hF = 0.0;
float rF = 0.3;
float cF = 0.5;
float mF = 1.0;
float sideH = textureGrad(tNz, vec2(vOP.y * 0.3, an * 0.02), vec2(dFdx(vOP.y) * 0.3, dax * 0.02), vec2(dFdy(vOP.y) * 0.3, day * 0.02)).a * 0.0016 * bl(0.026, fw);
#if SS_FIN == 0
  rF = 0.13; cF = 0.44;
  hF = (tri(tNz, sp * 9.0, tw).a - 0.5) * 0.00012 * bl(0.02, fw);
#elif SS_FIN == 1
  float s = 0.6;
  vec2 q = vOP.xz / s;
  vec2 cell = floor(q);
  float best = -1e9;
  vec2 loc = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = cell + vec2(float(i), float(j));
    vec2 jit = texture2D(tNz, (c + uSeed.xz * 3.0 + 0.5) / 256.0).ab - 0.5;
    vec2 ctr = c + 0.5 + jit * 0.35;
    float d = length(q - ctr);
    float ord = c.y * 1.7 + c.x * 0.13;
    if (d < 0.66 && ord > best) { best = ord; loc = q - ctr; }
  }
  float dd = length(loc);
  float ring = textureGrad(tNz, vec2(dd * 2.2 + best * 0.37, 0.25), vec2(length(dFdx(loc)) * 2.2, 0.0), vec2(length(dFdy(loc)) * 2.2, 0.0)).a;
  hF = mix(sideH, ring * 0.0013 * bl(0.004, fw) + dd * dd * 0.012 * bl(0.3, fw), face);
  rF = 0.27 + 0.08 * dd; cF = 0.34;
#elif SS_FIN == 2
  float W = 1.15;
  vec2 dir = vec2(cos(uDir), sin(uDir));
  float xb = dot(vOP.xz, dir);
  float yb = dot(vOP.xz, vec2(-dir.y, dir.x));
  float b = xb / W;
  float f = fract(b);
  float id = floor(b);
  float qa = yb + (f - 0.5) * (f - 0.5) * W * 1.8;
  vec2 g1 = vec2(dFdx(qa), dFdx(id)) * vec2(0.5, 0.0);
  vec2 g2 = vec2(dFdy(qa), dFdy(id)) * vec2(0.5, 0.0);
  float lines = textureGrad(tNz, vec2(qa * 0.5, id * 0.37 + 0.11), g1, g2).a;
  float roof = -(f - 0.5) * (f - 0.5) * W * 0.11;
  float seam = -0.006 * exp(-((min(f, 1.0 - f) * W / 0.025) * (min(f, 1.0 - f) * W / 0.025)));
  hF = mix(sideH, lines * 0.0012 * bl(0.012, fw) + (roof + seam) * bl(0.25, fw), face);
  rF = 0.27 + 0.06 * fract(id * 0.618); cF = 0.36;
#elif SS_FIN == 3
  vec2 suv = vec2(an * 3.82, rr * 0.0015);
  float ln = textureGrad(tNz, suv, vec2(dax * 3.82, dFdx(rr) * 0.0015), vec2(day * 3.82, dFdy(rr) * 0.0015)).a;
  hF = mix(sideH, ln * 0.0035 * bl(rr * 0.0026, fw), face);
  rF = 0.25; cF = 0.4;
#elif SS_FIN == 4
  float ring2 = textureGrad(tNz, vec2(rr * uTurn.x, an * 0.015), vec2(dFdx(rr) * uTurn.x, dax * 0.015), vec2(dFdy(rr) * uTurn.x, day * 0.015)).a;
  hF = mix(sideH, ring2 * 0.0016 * uTurn.z * bl(uTurn.y, fw), face);
  rF = 0.26; cF = 0.37;
#elif SS_FIN == 5
  vec2 buv = mix(vec2(vOP.y * 0.4, (vOP.x + vOP.z) * 0.01), vec2(vOP.z * 0.4, vOP.x * 0.01), face);
  hF = texture2D(tNz, buv).a * 0.0016 * bl(0.02, fw);
  rF = 0.3; cF = 0.3;
#else
  rF = 0.28; cF = 0.17; mF = 0.9;
  hF = (tri(tNz, sp * 9.0, tw).a - 0.5) * 0.00015 * bl(0.02, fw);
#endif
vec4 nz = tri(tNz, sp * 0.3, tw);
vec4 nzf = tri(tNz, sp * 1.1, tw);
float reg = tri(tNz, sp * 0.11 + 0.61, tw).a;
float isl = mix(tri(tNz, sp * 0.55 + 0.17, tw).b, tri(tNz, sp * 1.35 + 0.41, tw).g, 0.35);
float cluster = smoothstep(0.69, 0.87, isl + (reg - 0.5) * 0.6 + vEdge * 0.07 + vCav * 0.2 + (uWear - 0.5) * 0.35);
float pitM = 0.0;
float pitH = 0.0;
float scr = 0.0;
#ifndef SS_LOW
  float pit = tri(tPit, sp * 1.35, tw).r * (0.55 + 0.9 * tri(tNz, sp * 7.0, tw).a);
  pitM = mix(cluster * 0.1, smoothstep(0.1, 0.3, pit) * cluster, bl(0.025, fw));
  pitH = pit * cluster * 0.0005 * bl(0.006, fw);
  scr = tri(tScr, sp * 0.055, tw).r * smoothstep(0.15, 0.85, nz.g) * (1.0 - cluster);
  scr += tri(tScr, sp * 0.09 + 0.3, tw).g * 0.6;
  scr *= bl(0.03, fw);
#endif
float grime = smoothstep(0.5, 0.95, vCav + (nzf.g - 0.5) * 0.3) * (0.55 + 0.45 * uWear);
float oilG = grime * smoothstep(0.42, 0.58, nz.g);
float chip = smoothstep(0.72, 0.8, tri(tNz, sp * 2.6, tw).r) * smoothstep(0.62, 0.95, vEdge) * bl(0.06, fw);
float bright = smoothstep(0.55, 0.95, vEdge) * (1.0 - chip);
float dull = smoothstep(0.3, 0.9, nz.g) * 0.35;
float tarn = smoothstep(0.35, 0.7, nz.b) * uWear;
float rub = smoothstep(0.8, 0.92, tri(tNz, sp * 0.09 + 0.33, tw).b);
float scaleN = reg * 0.5 + nz.b * 0.35 + nzf.g * 0.15;
float rag = tri(tNz, sp * 5.0, tw).r * 0.16 + tri(tNz, sp * 13.0, tw).a * 0.07;
float scA = scaleN + rag - 0.19 + vCav * 0.6 - vEdge * 0.3 + (uAge - 0.5) * 0.4;
float scW = max(fwidth(scA), 1e-4);
float scaleM = smoothstep(0.53 - scW, 0.53 + scW, scA) * (1.0 - rub) * step(0.001, uAge);
float oldOil = scaleM * smoothstep(0.5, 0.62, nzf.r + vCav * 0.2);
float halo = 0.0;
float col = cF * uTone * (1.0 + 0.45 * bright) * (1.0 - 0.06 * dull) * (1.0 - 0.08 * tarn) * (1.0 - 0.85 * halo);
col = mix(col, 0.012, clamp(max(pitM * 1.15, chip * 0.85), 0.0, 1.0));
col = mix(col, 0.008, grime * 0.92);
col = mix(col, mix(0.006, 0.003, oldOil), scaleM * (1.0 - bright * 0.8));
col += scr * 0.05 * (1.0 - pitM) * (1.0 - scaleM) * cF * uTone;
diffuseColor.rgb *= vec3(col);
float ssRough = rF + dull * 0.02 + tarn * 0.015 - bright * 0.06;
ssRough = mix(ssRough, 0.9, max(pitM, halo * 0.8));
ssRough = mix(ssRough, mix(0.8, 0.14, oilG / max(grime, 1e-3)), grime);
ssRough = mix(ssRough, mix(0.72, 0.12, oldOil), scaleM * (1.0 - bright * 0.8));
ssRough += scr * 0.035;
float ssMetal = mF * (1.0 - clamp(max(max(pitM, halo * 0.8), max(grime * 0.9, scaleM * (1.0 - oldOil))), 0.0, 1.0) * 0.85);
float ssH = hF * uBump * (1.0 - scaleM) - pitH - scr * 0.0003 * (1.0 - scaleM);`,fl="{ vec3 vv = normalize(vViewPosition); float fr = smoothstep(0.72, 0.97, 1.0 - abs(dot(normal, vv))); totalEmissiveRadiance += vec3(uRim.w * fr * smoothstep(0.0, 0.5, dot(normal, uRim.xyz)) * (1.0 - 0.8 * scaleM) * (1.0 - pitM)); }",pl="totalEmissiveRadiance += vec3(uLine.x * smoothstep(0.3, 0.85, vEdge) * smoothstep(0.25, 0.7, vON.y) * step(uLine.y, rr) * (1.0 - chip) * (1.0 - pitM) * (0.75 + 0.5 * nzf.r));";function cn(t){const e=Yo(),n=tt((t.seed??1)*7331+17),o=new Gn({color:16777215,metalness:1,roughness:.3,envMapIntensity:t.envMap??1.15,ior:1.5}),a={tNz:{value:e.noise},tPit:{value:e.pits},tScr:{value:e.scratch},uSeed:{value:new _(n()*40,n()*40,n()*40)},uWear:{value:t.wear??.6},uBump:{value:t.bump??1},uDir:{value:t.stripeDir??.5},uObjScale:{value:t.objScale??1},uTone:{value:t.tone??.62},uRS2:{value:new bt(0,t.direct??1)},uAge:{value:t.age??.6},uTurn:{value:new _(...t.turn??[.22,.035,1])},uTwist:t.twist??{value:0},uTwistR:{value:t.twistR??1},uRim:t.rim??{value:new rn},uLine:t.lineU??{value:new bt(...t.line??[0,0])}},s=t.tier==="low",r=t.twist?`float twA = uTwist * (1.0 - clamp(length(transformed.xz) / uTwistR, 0.0, 1.0));
transformed.xz = mat2(cos(twA), sin(twA), -sin(twA), cos(twA)) * transformed.xz;
`:"";return o.onBeforeCompile=i=>{Object.assign(i.uniforms,a),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${cl}
uniform float uTwist;
uniform float uTwistR;`).replace("#include <begin_vertex>",`#include <begin_vertex>
${ll}
${r}`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#define SS_FIN ${il[t.finish]}
${s?`#define SS_LOW
`:""}#include <common>
uniform vec4 uRim;
uniform vec2 uLine;
${ul}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${t.rim?fl:""}
${t.line?pl:""}`).replace("#include <color_fragment>",`#include <color_fragment>
${dl}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = clamp(ssRough, 0.04, 1.0);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = ssMetal;`).replace("#include <aomap_fragment>",`reflectedLight.directSpecular *= uRS2.y;
reflectedLight.directDiffuse *= uRS2.y;
#include <aomap_fragment>`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = bumpN(-vViewPosition, normal, vec2(dFdx(ssH), dFdy(ssH)), faceDirection);`),ir(i),To(i)},o.customProgramCacheKey=()=>`ss-steel-${t.finish}-${s?"l":"h"}${t.twist?"-tw":""}${t.rim?"-rim":""}${t.line?"-ln":""}`,Object.assign(o,{ss:a})}const hl=`
uniform vec3 uCamO;
uniform vec3 uCrackP;
uniform vec3 uCrackN;
uniform vec3 uNode;
uniform vec3 uHalf;
uniform float uGlow;
uniform float uHot;
uniform sampler2D tNz;
varying vec3 vOP;`,ml=`
vec3 rd = normalize(vOP - uCamO);
vec3 inv = 1.0 / (rd + vec3(1e-5));
vec3 tA = (-uHalf - vOP) * inv;
vec3 tB = (uHalf - vOP) * inv;
vec3 tMax = max(tA, tB);
float tExit = max(min(min(tMax.x, tMax.y), tMax.z), 0.0);
float absorb = 1.0 - exp(-tExit * 3.2);
float dn = dot(rd, uCrackN);
float tc = abs(dn) > 1e-4 ? dot(uCrackP - vOP, uCrackN) / dn : -1.0;
float sheet = 0.0;
float node = 0.0;
if (tc > 0.0 && tc < tExit) {
  vec3 hp = vOP + rd * tc;
  float lines = texture2D(tNz, hp.xz * 1.7 + hp.y * 0.6).r;
  float veins = smoothstep(0.035, 0.0, abs(lines - 0.5)) + 0.5 * smoothstep(0.06, 0.0, abs(texture2D(tNz, hp.xz * 3.1 + 0.4).g - 0.5));
  float nd = length(hp - uNode);
  sheet = (0.03 + veins * 0.9) * exp(-nd * 2.2);
}
{
  float tn = clamp(dot(uNode - vOP, rd), 0.0, tExit);
  float dn2 = length(vOP + rd * tn - uNode);
  node = exp(-dn2 * dn2 / 0.0025);
}
float halo = exp(-length(vOP - uNode) * 6.0) * 0.06;
vec3 glowC = vec3(1.0, 0.0, 0.012) * (absorb * 0.01 + sheet + halo * 0.5) * uGlow + vec3(1.0, 0.16, 0.1) * node * uHot;
totalEmissiveRadiance += glowC;`;function vl(t){const e=Yo(),n=new Gn({color:new Gt().setRGB(.0035,0,2e-4),metalness:0,roughness:.02,ior:1.76,envMapIntensity:4.5,specularIntensity:1,emissive:0,flatShading:!1}),o={uCamO:{value:new _},uCrackP:{value:t.crackP??new _},uCrackN:{value:(t.crackN??new _(.3,.2,.93)).normalize()},uNode:{value:t.node??new _},uHalf:{value:t.half},uGlow:{value:t.glow??1},uHot:{value:t.hot??1},tNz:{value:e.noise}};n.onBeforeCompile=r=>{Object.assign(r.uniforms,o),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${hl}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${ml}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(glowC.r * 3.0, 0.0, 1.0);`),To(r)},n.customProgramCacheKey=()=>"ss-ruby";const a=new fe;return Object.assign(n,{ss:o,aim:(r,i)=>{r.updateMatrixWorld(),a.copy(r.matrixWorld).invert(),o.uCamO.value.setFromMatrixPosition(i.matrixWorld).applyMatrix4(a)}})}function jo(t={}){const e=new Gn({color:new Gt().setRGB(.01,.01,.01),metalness:0,roughness:.12,clearcoat:1,clearcoatRoughness:.075,ior:1.47,specularIntensity:0,envMapIntensity:t.env??6});return e.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <opaque_fragment>",`vec3 ssEx = max(outgoingLight - 0.32, 0.0);
outgoingLight = min(outgoingLight, vec3(0.32)) + ssEx / (1.0 + ssEx * 3.0);
#include <opaque_fragment>`),ir(n),To(n)},e.customProgramCacheKey=()=>"ss-oil",e}const $t=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),Lt=(t,e,n)=>t+(e-t)*n,Co=t=>{const e=$t(t);return e*e*(3-2*e)},Xe=Math.PI*2,dt=(t,e,n=3)=>Math.max(n,Math.round(t*(e===2?1:e===1?.55:.3)));class mn{p=[];n=[];c=[];e=[];i=[];th=[];thin(e,n,o,a,s){for(;this.th.length<(e+1)*4;)this.th.push(0);this.th.splice(e*4,4,n,o,a,s)}v(e,n,o,a,s,r,i=0,c=0){return this.p.push(e,n,o),this.n.push(a,s,r),this.c.push($t(i)),this.e.push($t(c)),this.p.length/3-1}tri(e,n,o){const a=this.p,s=e*3,r=n*3,i=o*3,c=a[r]-a[s],l=a[r+1]-a[s+1],d=a[r+2]-a[s+2],u=a[i]-a[s],p=a[i+1]-a[s+1],f=a[i+2]-a[s+2];Math.hypot(l*f-d*p,d*u-c*f,c*p-l*u)<2e-12||this.i.push(e,n,o)}quad(e,n,o,a){this.tri(e,n,o),this.tri(e,o,a)}fixWinding(){const e=this.p,n=this.n,o=this.i;for(let a=0;a<o.length;a+=3){const s=o[a]*3,r=o[a+1]*3,i=o[a+2]*3,c=e[r]-e[s],l=e[r+1]-e[s+1],d=e[r+2]-e[s+2],u=e[i]-e[s],p=e[i+1]-e[s+1],f=e[i+2]-e[s+2],v=l*f-d*p,h=d*u-c*f,m=c*p-l*u;if(v*(n[s]+n[r]+n[i])+h*(n[s+1]+n[r+1]+n[i+1])+m*(n[s+2]+n[r+2]+n[i+2])<0){const x=o[a+1];o[a+1]=o[a+2],o[a+2]=x}}}geometry(){this.fixWinding();const e=new Ln;if(e.setAttribute("position",new ct(this.p,3)),e.setAttribute("normal",new ct(this.n,3)),e.setAttribute("aCav",new ct(this.c,1)),e.setAttribute("aEdge",new ct(this.e,1)),this.th.length){for(;this.th.length<this.p.length/3*4;)this.th.push(0);e.setAttribute("aThin",new ct(this.th,4))}return e.setIndex(this.i),e}}function gl(t){let e=0;for(let n=0;n<t.length;n++){const o=t[n],a=t[(n+1)%t.length];e+=o[0]*a[1]-a[0]*o[1]}return e/2}const ls=(t,e)=>gl(t)>0===e?t:t.slice().reverse();function us(t,e=1e-5){const n=[];for(const o of t){const a=n[n.length-1];(!a||Math.hypot(o[0]-a[0],o[1]-a[1])>e)&&n.push(o)}for(;n.length>2&&Math.hypot(n[0][0]-n[n.length-1][0],n[0][1]-n[n.length-1][1])<=e;)n.pop();return n}function b0(t,e=2,n){let o=t,a=n??t.map(()=>!1);for(let s=0;s<e;s++){const r=[],i=[];for(let c=0;c<o.length;c++){const l=o[c],d=o[(c+1)%o.length];a[c]?(r.push(l),i.push(!0)):(r.push([l[0]*.75+d[0]*.25,l[1]*.75+d[1]*.25]),i.push(!1)),a[(c+1)%o.length]||(r.push([l[0]*.25+d[0]*.75,l[1]*.25+d[1]*.75]),i.push(!1))}o=r,a=i}return o}const Ka=(t,e,n=0,o=0,a=0)=>Array.from({length:e},(s,r)=>[n+Math.cos(a+r/e*Xe)*t,o+Math.sin(a+r/e*Xe)*t]);function xl(t,e){const n=t.length,o=new Array(n).fill(0),a=new Array(n).fill(0);for(let s=0;s<n;s++){const r=t[(s-1+n)%n],i=t[s],c=t[(s+1)%n],l=Math.atan2(i[1]-r[1],i[0]-r[0]);let u=Math.atan2(c[1]-i[1],c[0]-i[0])-l;for(;u>Math.PI;)u-=Xe;for(;u<-Math.PI;)u+=Xe;o[s]=u}for(let s=0;s<n;s++){let r=0;for(let i=-e;i<=e;i++)r+=o[(s+i+n)%n];a[s]=r}return{raw:o,win:a}}function bn(t,e,n){const o=new mn,a=n.segs??2,s=n.t/2,r=[{...t,pts:ls(us(t.pts),!0)},...e.map(u=>({...u,pts:ls(us(u.pts),!1)}))],i=[],c=[],l=[];for(const u of r){const p=u.pts,f=p.length,v=Math.min(u.bevel??n.bevel,s*.95),h=u.sink??0,m=xl(p,Math.max(1,Math.round(f/400))),M=[];for(let F=0;F<f;F++){const D=p[F],J=p[(F+1)%f],Y=J[0]-D[0],oe=J[1]-D[1],ae=Math.hypot(Y,oe)||1;M.push([oe/ae,-Y/ae])}const x=[],g=[],w=[],y=Math.cos((u.sharp??35)*Math.PI/180);for(let F=0;F<f;F++){const D=M[(F-1+f)%f],J=M[F];let Y=D[0]+J[0],oe=D[1]+J[1];const ae=Math.hypot(Y,oe)||1;Y/=ae,oe/=ae,x.push([Y,oe]);const G=Math.max(.35,Y*J[0]+oe*J[1]);g.push(1/G),w.push(D[0]*J[0]+D[1]*J[1]<y)}const S=p.map((F,D)=>$t(-m.win[D]/1.6)+(u.cav??0)+(u.cavAt?.[D]??0)),R=p.map((F,D)=>$t(m.win[D]/1.2)+(u.edgeAt?.[D]??0)),k=[],L=h>0?h:v;for(let F=0;F<=a;F++){const D=F/a*Math.PI/2;if(h>0){const J=F/a;k.push({inset:L*(1-J),y:s-L*.55*J,nu:.72,ns:.69,edge:F===0?.5:.15,cavK:.4+.6*J})}else k.push({inset:v-v*Math.sin(D),y:s-v+v*Math.cos(D),nu:Math.cos(D),ns:Math.sin(D),edge:F===0?.35:F===a?.45:.9,cavK:.55})}const C=k[a].y,z=u.bottom!==!1,b=z?v:0,P=[];for(let F=a;F>=0;F--){const D=F/a*Math.PI/2;if(P.push(z?{inset:b-b*Math.sin(D),y:-s+b-b*Math.cos(D),nu:-Math.cos(D),ns:Math.sin(D),edge:F===0?.3:F===a?.4:.8,cavK:.55}:{inset:0,y:-s,nu:0,ns:1,edge:.3,cavK:.55}),!z)break}const I=[...k,{inset:0,y:(C+P[0].y)/2,nu:0,ns:1,edge:.2,cavK:.7},...P];for(let F=0;F<f;F++){const D=(F+1)%f,J=[];for(const Y of I){const oe=[];for(const ae of[F,D]){const G=w[ae]?M[F]:x[ae],te=p[ae][0]-x[ae][0]*Y.inset*g[ae],V=p[ae][1]-x[ae][1]*Y.inset*g[ae],B=G[0]*Y.ns,U=G[1]*Y.ns,H=Y.nu,pe=Math.hypot(B,H,U)||1;oe.push(o.v(te,Y.y,V,B/pe,H/pe,U/pe,S[ae]*Y.cavK,Y.edge*(.45+.8*R[ae])+(w[ae]&&R[ae]>0?.25:0)))}J.push(oe)}for(let Y=0;Y<J.length-1;Y++)o.quad(J[Y][0],J[Y+1][0],J[Y+1][1],J[Y][1])}i.push(p.map((F,D)=>[F[0]-x[D][0]*k[0].inset*g[D],F[1]-x[D][1]*k[0].inset*g[D]])),c.push(p.map((F,D)=>[F[0]-x[D][0]*P[P.length-1].inset*g[D],F[1]-x[D][1]*P[P.length-1].inset*g[D]])),l.push(S.map(F=>F*.12+(h>0?.35:0)))}const d=u=>u.map(p=>new bt(p[0],p[1]));for(const u of[!0,!1]){if(u&&n.top===!1||!u&&n.bottomFace===!1)continue;const p=u?i:c,f=d(p[0]),v=p.slice(1).map(d),h=gi.triangulateShape(f,v),m=o.p.length/3,M=p.flat(),x=l.flat(),g=u?s:-s;M.forEach((w,y)=>o.v(w[0],g,w[1],0,u?1:-1,0,x[y],0));for(const w of h)u?o.tri(m+w[0],m+w[2],m+w[1]):o.tri(m+w[0],m+w[1],m+w[2])}return o.geometry()}function Pt(t,e,n={}){const o=new mn,a=t.length,s=n.a0??0,r=n.a1??Xe,i=Math.abs(r-s-Xe)<1e-6,c=[];for(let u=0;u<a-1;u++){const p=t[u+1].r-t[u].r,f=t[u+1].y-t[u].y,v=Math.hypot(p,f)||1;c.push([f/v,-p/v])}const l=t.map((u,p)=>{if(p===0||p===a-1)return 0;const f=Math.atan2(t[p].y-t[p-1].y,t[p].r-t[p-1].r);let h=Math.atan2(t[p+1].y-t[p].y,t[p+1].r-t[p].r)-f;for(;h>Math.PI;)h-=Xe;for(;h<-Math.PI;)h+=Xe;return h}),d=i?e:e+1;for(let u=0;u<a-1;u++){const p=[u,u+1].map(w=>{const S=t[w].smooth&&w>0&&w<a-1?(()=>{const L=c[w-1],C=c[w],z=L[0]+C[0],b=L[1]+C[1],P=Math.hypot(z,b)||1;return[z/P,b/P]})():c[u],R=$t(-l[w]/1.2)*.9+(t[w].cav??0),k=$t(l[w]/1)+(t[w].edge??0);return{k:w,N:S,cav:R,edge:k}}),f=t[u],v=t[u+1],h=Math.hypot(v.r-f.r,v.y-f.y),m=h>.2?.05/h:0,M=m?[0,m,1-m,1]:[0,1],x=o.p.length/3,g=M.length;for(let w=0;w<d;w++){const y=s+(r-s)*w/e,S=Math.cos(y),R=Math.sin(y);for(const k of M){const L=Lt(f.r,v.r,k),C=Lt(f.y,v.y,k),z=Lt(p[0].N[0],p[1].N[0],k),b=Lt(p[0].N[1],p[1].N[1],k),P=Math.hypot(z,b)||1,I=k===0?p[0]:k===1?p[1]:null;o.v(L*S,C,L*R,z/P*S,b/P,z/P*R,I?I.cav:0,I?I.edge:0)}}for(let w=0;w<e;w++){const y=i?(w+1)%e:w+1;for(let S=0;S+1<g;S++){const R=x+w*g+S,k=x+y*g+S,L=Lt(f.r,v.r,M[S]),C=Lt(f.r,v.r,M[S+1]);L>1e-7&&o.tri(R,k+1,k),C>1e-7&&o.tri(R,R+1,k+1)}}}return o.geometry()}const _r=(t,e,n,o,a)=>{const s=n-t,r=o-e,i=Math.hypot(s,r)||1;return[{r:t,y:e},{r:t+s/i*a,y:e+r/i*a}]};function wl(t,e,n,o,a={}){const s=new mn,r=t.length,i=a.cs??2,c=[];[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([f,v],h)=>{const m=[0,Math.PI/2,Math.PI,Math.PI*1.5][h];for(let M=0;M<=i;M++){const x=m+M/i*Math.PI/2;c.push({x:f,y:v,nx:Math.cos(x),ny:Math.sin(x),edge:M===0||M===i?.5:1})}});const d=c.length,u=new _,p=new _;for(let f=0;f<r;f++){const v=f/(r-1);u.copy(t[Math.min(r-1,f+1)]).sub(t[Math.max(0,f-1)]).normalize();const h=e[f];p.crossVectors(u,h).normalize();const m=n(v)/2,M=o(v)/2,x=Math.min(m,M)*(a.corner??.45),g=a.cav?a.cav(v):0;for(const w of c){const y=w.x*(m-x)+w.nx*x,S=w.y*(M-x)+w.ny*x,R=t[f],k=h.x*w.nx+p.x*w.ny,L=h.y*w.nx+p.y*w.ny,C=h.z*w.nx+p.z*w.ny,z=s.v(R.x+h.x*y+p.x*S,R.y+h.y*y+p.y*S,R.z+h.z*y+p.z*S,k,L,C,g,w.edge);if(M<m){const b=Math.sign(S)||1;s.thin(z,p.x*b,p.y*b,p.z*b,M)}}}for(let f=0;f<r-1;f++)for(let v=0;v<d;v++){const h=(v+1)%d,m=f*d+v,M=f*d+h,x=(f+1)*d+h,g=(f+1)*d+v;s.quad(m,M,x,g)}if(a.caps!==!1)for(const f of[0,r-1]){const v=new _().copy(t[f===0?1:r-1]).sub(t[f===0?0:r-2]).normalize().multiplyScalar(f===0?-1:1),h=s.p.length/3;for(let m=0;m<d;m++){const M=f*d+m,x=s.v(s.p[M*3],s.p[M*3+1],s.p[M*3+2],v.x,v.y,v.z,.3,.8);s.th.length>M*4&&s.thin(x,s.th[M*4],s.th[M*4+1],s.th[M*4+2],s.th[M*4+3])}for(let m=1;m<d-1;m++)f===0?s.tri(h,h+m+1,h+m):s.tri(h,h+m,h+m+1)}return s.geometry()}function yl(t,e,n,o,a){const s=t.getAttribute("position"),r=t.getAttribute("normal"),i=t.getAttribute("aEdge"),c=t.getAttribute("aCav"),l=Math.hypot(n[0],n[1]),d=n[0]/l,u=n[1]/l,p=u,f=-d,v=new _(d,0,u),h=new Wt,m=new _,M=new _(e[0],0,e[1]);for(let x=0;x<s.count;x++){const g=(s.getX(x)-e[0])*p+(s.getZ(x)-e[1])*f;if(g<=-a)continue;const w=Co((g+a)/(2*a));h.setFromAxisAngle(v,o*w),m.set(s.getX(x),s.getY(x),s.getZ(x)).sub(M).applyQuaternion(h).add(M),s.setXYZ(x,m.x,m.y,m.z),m.set(r.getX(x),r.getY(x),r.getZ(x)).applyQuaternion(h),r.setXYZ(x,m.x,m.y,m.z);const y=1-Math.abs(w*2-1);i.setX(x,$t(i.getX(x)+y*.35)),c.setX(x,$t(c.getX(x)+y*.25))}return s.needsUpdate=r.needsUpdate=i.needsUpdate=c.needsUpdate=!0,t}function _t(t){const e=t.some(o=>o.getAttribute("aThin")),n=Ri(t.map(o=>{if(e&&!o.getAttribute("aThin")&&o.setAttribute("aThin",new ct(new Float32Array(o.getAttribute("position").count*4),4)),!o.index){const a=Array.from({length:o.getAttribute("position").count},(s,r)=>r);o.setIndex(a)}for(const a of["aCav","aEdge"])o.getAttribute(a)||o.setAttribute(a,new ct(new Float32Array(o.getAttribute("position").count),1));for(const a of Object.keys(o.attributes))["position","normal","aCav","aEdge","aThin"].includes(a)||o.deleteAttribute(a);return o}),!1);if(!n)throw new Error("merge failed");return n}function dn(t,e=0,n=0,o=0,a=0,s=0,r=0,i=1){const c=new fe().compose(new _(e,n,o),new Wt().setFromEuler(new Bn(a,s,r)),new _(i,i,i));return t.applyMatrix4(c)}function bl(t){t.scale(1,-1,1);const e=t.index.array;for(let n=0;n<e.length;n+=3){const o=e[n+1];e[n+1]=e[n+2],e[n+2]=o}return t.index.needsUpdate=!0,t}const Ja=(t=[],e=[])=>({pieces:t,inst:e}),co=(t,e,n=1,o)=>({geo:t,finish:e,seed:n,at:o});function Wi(t,e=new _(0,1,0),n=0,o=1){const a=new Wt().setFromUnitVectors(new _(0,1,0),e.clone().normalize());return a.multiply(new Wt().setFromAxisAngle(new _(0,1,0),n)),new fe().compose(t,a,new _(o,o,o))}function Ni(t){const e=t.teeth,n=t.r,o=t.detail,a=tt(t.seed*7919+13),s=[],r=[],i=[],c=[],l=(k,L,C,z,b=!1)=>{s.push([Math.cos(L)*k,Math.sin(L)*k]),r.push(C),i.push(z),c.push(b)},d=new Set;for(let k=0;k<(t.sheared??0);k++)d.add(Math.floor(e*(.08+.22*k+a()*.06))%e);const u=Xe/e;if(t.profile==="club"){const k=n*.2,L=n-k,C=[[-.42,0,1,0],[-.27,.1,.7,0],[-.1,.35,.2,.1],[0,.6,0,.3],[-.02,.72,0,.5],[-.06,.8,0,1],[.2,.9,0,.7],[.5,1,0,1],[.45,.86,0,.5],[.31,.6,.1,.1],[.2,.33,.3,0],[.18,.1,.8,0],[.27,0,1,0]],z=dt(3,o,1);for(let b=0;b<e;b++){const P=b*u,I=d.has(b);for(let Y=0;Y<C.length;Y++){const[oe,ae,G,te]=C[Y];let V=ae;if(I&&ae>.3&&(V=.3+a()*.08),l(L+V*k,P+oe*k/(L+V*k),G,I&&ae>.3?1:te,Y===5||Y===7),Y<C.length-1&&Y!==5&&Y!==6&&z>1){const[B,U]=C[Y+1];for(let H=1;H<z;H++){const pe=H/z,he=Lt(V,I&&U>.3?.32:U,pe);l(L+he*k,P+Lt(oe,B,pe)*k/(L+he*k),G*(1-pe),0)}}}const F=P+.27*k/L,D=P+u-.42*k/L,J=dt(4,o,1);for(let Y=1;Y<J;Y++)l(L,Lt(F,D,Y/J),1,0)}return{pts:s,cav:r,edge:i,keep:c,root:L}}if(t.profile==="ratchet"){const k=Math.min(n*.1,Xe*n/e*.55),L=n-k;for(let C=0;C<e;C++){const z=C*u;l(L,z,1,0),l(L+k*.5,z+u*.01,.3,.1),l(n,z+u*.03,0,1,!0);for(let b=1;b<=dt(4,o,2);b++){const P=b/dt(4,o,2);l(Lt(n,L,Math.pow(P,1.25)),z+u*Lt(.03,.96,P),P*P*.8,(1-P)*.4)}}return{pts:s,cav:r,edge:i,keep:c,root:L}}const p=t.profile==="leaf"?2*n/(e+1.6):t.profile==="barrel"?2*n/(e+2.2):2*n/(e+2.6),f=t.profile==="leaf"?.8*p:t.profile==="barrel"?1.1*p:1.3*p,v=t.profile==="leaf"?1.9*p:t.profile==="barrel"?1.45*p:1.65*p,h=(t.profile==="leaf"?.21:t.profile==="barrel"?.26:.235)*Math.PI*p,m=n-f,M=m-v,x=Math.min(.42*p,(Math.PI*M/e-h)*.8),g=(f*f+h*h)/(2*h),w=dt(6,o,3),y=dt(3,o,2),S=dt(3,o,1),R=(k,L,C,z)=>{const b=[];for(let P=0;P<=y;P++){const I=P/y*Math.PI/2;b.push([M+x-x*Math.cos(I),h+x-x*Math.sin(I),1-.8*P/y,0,!1])}if(b.push([Lt(M+x,m,.5),h*1.01,.12,.05,!1]),C){const P=m-p*(.2+a()*.5);b.push([P,h*1,0,1,!0]);const I=.4+a()*.5;b.push([P+p*.12*I,h*.3,0,1,!0])}else for(let P=0;P<w;P++){const I=P/w*f,F=t.profile==="leaf"?h*Math.sqrt(Math.max(0,1-(I/f)**2)):h-g+Math.sqrt(Math.max(0,g*g-I*I));b.push([m+I,Math.max(F,h*.06),0,.25+.5*P/w,!1])}z||b.reverse();for(const[P,I,F,D,J]of b)l(P,L+k*I/P,F,D,J)};for(let k=0;k<e;k++){const L=k*u,C=d.has(k);R(-1,L,C,!0),C||l(n,L,0,1,!1),R(1,L,C,!1);const z=L+(h+x)/M,b=L+u-(h+x)/M;for(let P=1;P<S+1;P++)l(M,Lt(z,b,P/(S+1)),1,0)}return{pts:s,cav:r,edge:i,keep:c,root:M}}function Ml(t,e,n,o,a,s,r){const i=tt(s*31+7),c=[],l=o*.12,d=o*.065,u=i()*Xe,p=x=>Lt(l,d,$t((x-n)/(e-n)))/2/x,f=dt(7,a,4),v=dt(16,a,6),h=(x,g,w,y)=>{const S=[];for(let R=0;R<=f;R++){const k=Lt(w,y,R/f);S.push([Math.cos(x+g*p(k))*k,Math.sin(x+g*p(k))*k])}return S},m=(x,g,w)=>{const y=[],S=Math.max(3,Math.round(v*Math.abs(w-g)/1.5));for(let R=1;R<S;R++){const k=Lt(g,w,R/S);y.push([Math.cos(k)*x,Math.sin(k)*x])}return y},M=r?1:-1;for(let x=0;x<t;x++){if(x===M)continue;const g=u+x*Xe/t,w=u+(x+1)*Xe/t;let y;if(x+1===M){const S=w,R=u+(x+2)*Xe/t,k=e-(e-n)*(.28+i()*.1),L=n+(e-n)*(.22+i()*.08),C=(z,b,P)=>{const I=[];for(let F=0;F<=4;F++){const D=F/4,J=z+P*(D*2-1)*p(b),Y=b+(i()-.5)*(e-n)*.07;I.push([Math.cos(J)*Y,Math.sin(J)*Y])}return I};y=[...h(g,1,n,e),...m(e,g+p(e),S-p(e)),...h(S,-1,e,k),...C(S,k,1),...h(S,1,k,e),...m(e,S+p(e),R-p(e)),...h(R,-1,e,n),...m(n,R-p(n),S+p(n)).reverse().reverse(),...h(S,1,n,L),...C(S,L,-1),...h(S,-1,L,n),...m(n,S-p(n),g+p(n))],y.length,c.push({pts:b0(y,a===2?3:2),cav:.15}),x++;continue}y=[...h(g,1,n,e),...m(e,g+p(e),w-p(e)),...h(w,-1,e,n),...m(n,w-p(n),g+p(n))],c.push({pts:b0(y,a===2?3:2),cav:.15})}return c}function Ko(t){const e=t.detail??2,n=t.seed??1,o=t.r,a=t.profile??"train",s=t.t??o*2/25,r=Ni({teeth:t.teeth,r:o,profile:a,detail:e,seed:n,sheared:t.sheared}),i={pts:b0(r.pts,e===0?0:1,r.keep),cavAt:[],edgeAt:[],sharp:50};if(e!==0){const v=r.pts;let h=0;i.cavAt=i.pts.map(m=>{for(;h<v.length-1&&Math.hypot(v[h+1][0]-m[0],v[h+1][1]-m[1])<Math.hypot(v[h][0]-m[0],v[h][1]-m[1]);)h++;return r.cav[h]}),h=0,i.edgeAt=i.pts.map(m=>{for(;h<v.length-1&&Math.hypot(v[h+1][0]-m[0],v[h+1][1]-m[1])<Math.hypot(v[h][0]-m[0],v[h][1]-m[1]);)h++;return r.edge[h]})}else i.cavAt=r.cav,i.edgeAt=r.edge;const c=t.bevel??Math.min(s*.16,o*.006),l=[],d=(t.hub??.17)*o,u=t.hole??o*.05;if(t.inner)l.push({pts:Ka(t.inner,dt(96,e,24)),bevel:c*1.5});else{const v=r.root-(t.rim??.1)*o;(t.spokes??0)>0&&v>d*1.5&&l.push(...Ml(t.spokes,v,d,o,e,n,!!t.snapped)),l.push({pts:Ka(u,dt(32,e,12)),bevel:c*.8,cav:.5})}const p=[bn(i,l,{t:s,bevel:c,segs:e===0?1:2})];if(t.boss!==!1&&!t.inner){const v=s*.55,h=d*.72,m=Math.min(v*.35,h*.1),M=dt(48,e,16),x=[{r:u,y:s/2-.001},{r:h+m*.5,y:s/2-.001,cav:.7},{r:h,y:s/2+m*.6},{r:h,y:s/2+v-m},{r:h-m,y:s/2+v,edge:.4},{r:u+m*.6,y:s/2+v},{r:u,y:s/2+v-m*.6,edge:.3},{r:u,y:s/2}];p.push(Pt(x,M)),p.push(bl(Pt(x,M)))}let f=_t(p);if(t.fold){const v=tt(n*101+3),h=v()*Xe,m=t.foldAt??.28;f=yl(f,[Math.cos(h)*o*m,Math.sin(h)*o*m],[-Math.sin(h),Math.cos(h)],t.fold,o*.07)}return f}function v0(t){const e=t.detail??2,n=t.length,o=t.ra,a=o*2/8,s=dt(40,e,12),r=t.pinionR??o*2.6,i=t.pinionH??n*.28,c=t.pinionAt??n*.2,l=t.seatAt??n*.66,d=n*.07,u=[{r:0,y:0},{r:a*.55,y:a*.12,smooth:!0,edge:.6},{r:a*.9,y:a*.5,smooth:!0,edge:.5},{r:a,y:a},{r:a,y:d},{r:a*1.25,y:d+a*.3,cav:.4},{r:o*.8,y:d+(o*.8-a)*1.2},{r:o,y:d+(o-a)*1.5},{r:o,y:c-.02,cav:.3},{r:o*1.15,y:c+.01,cav:.5},{r:o*1.15,y:c+i-.01,cav:.5},{r:o,y:c+i+.02,cav:.3},{r:o,y:l-o*.5},{r:o*1.55,y:l-o*.25},{r:o*1.55,y:l,edge:.5},{r:o*.92,y:l,cav:.9},{r:o*.92,y:l+o*1.2},{r:o*.85,y:l+o*1.6},{r:o*.85,y:n-d-(o*.85-a)*1.5},{r:a*1.25,y:n-d-a*.3,cav:.3},{r:a,y:n-d},{r:a,y:n-a},{r:a*.9,y:n-a*.5,smooth:!0,edge:.5},{r:a*.55,y:n-a*.12,smooth:!0,edge:.6},{r:0,y:n}],p=[Pt(u,s)],f=Ko({teeth:t.leaves??8,r,profile:"leaf",detail:e,seed:t.seed??3,t:i,boss:!1,hole:o*.5,bevel:Math.min(r*.045,.03)});return dn(f,0,c+i/2,0),p.push(f),{geo:_t(p),seat:l}}const Sl={large:{rh:.9,hh:.55,L:2.2,pitch:.2,thread:!0},medium:{rh:.55,hh:.36,L:1.4,pitch:.14,thread:!0},small:{rh:.22,hh:.16,L:.55,pitch:.08,thread:!1},timing:{rh:.115,hh:.12,L:.3,pitch:.035,thread:!0}};function zl(t,e,n,o){const a=new mn,s=t*.8,r=dt(28,o,10),i=dt(8,o,4),c=Math.max(4,Math.round(e/n*i)),l=(p,f)=>{const v=((f/n-p/Xe)%1+1)%1,h=v<.12?v/.12:v<.3?1:v<.42?1-(v-.3)/.12:0,m=$t((f+e)/(n*1.5));return s+(t-s)*h*m},d=[];for(let p=0;p<=c;p++){const f=-e+e*p/c,v=[];for(let h=0;h<r;h++){const m=h/r*Xe,M=l(m,f),x=.01,g=(l(m,f+x)-l(m,f-x))/(2*x),w=new _(Math.cos(m),-g,Math.sin(m)).normalize(),y=(M-s)/(t-s);v.push(a.v(Math.cos(m)*M,f,Math.sin(m)*M,w.x,w.y,w.z,(1-y)*.8,y>.95?.6:0))}d.push(v)}for(let p=0;p<c;p++)for(let f=0;f<r;f++){const v=(f+1)%r;a.quad(d[p][f],d[p][v],d[p+1][v],d[p+1][f])}const u=a.v(0,-e-s*.3,0,0,-1,0,.3,.3);for(let p=0;p<r;p++)a.tri(d[0][p],u,d[0][(p+1)%r]);return a.geometry()}function ba(t){const e=Sl[t.size],n=t.detail??2,o=tt((t.seed??5)*977+1),a=e.rh,s=e.hh,r=a*2/8,i=Math.min(a*2/4,s*.6),c=a*.09,l=dt(48,n,16),d=[];for(const m of[1,-1]){const M=Math.acos(r/2/a),x=[];for(let y=0;y<=l/2;y++){const S=-M+2*M*y/(l/2);x.push([Math.cos(S)*a,Math.sin(S)*a])}const g=dt(8,n,3);for(let y=1;y<g;y++){const S=1-y/g,R=t.abused&&o()<.5?o()*r*.35:0;x.push([r/2-R,(S*2-1)*Math.sin(M)*a])}const w=bn({pts:x.map(y=>[y[0]*m,y[1]*m]),sharp:30},[],{t:s,bevel:c,segs:n===0?1:2,bottomFace:!1});if(dn(w,0,s/2,0),t.abused){const y=w.getAttribute("position"),S=w.getAttribute("aEdge");for(let R=0;R<y.count;R++){const k=Math.abs(y.getX(R)),L=y.getY(R);if(k<r/2+c*2.2&&L>s-c*1.2){const C=y.getZ(R),z=(.5+.5*Math.sin(C*41+m*3))*c*.9;y.setY(R,L+z),S.setX(R,1)}}}d.push(w)}const u=bn({pts:Ka(a,l)},[],{t:s-i,bevel:c,segs:n===0?1:2,bottomFace:!1});dn(u,0,(s-i)/2,0);const p=u.getAttribute("aCav"),f=u.getAttribute("position");for(let m=0;m<p.count;m++)f.getY(m)>s-i-1e-4&&p.setX(m,.9);d.push(u);const v=a*.48;e.thread&&n>0?d.push(zl(v,e.L,e.pitch,n)):d.push(Pt([{r:0,y:-e.L-v*.3},{r:v*.8,y:-e.L},{r:v*.85,y:0}],dt(16,n,8)));const h=_t(d);return t.slotAngle&&h.rotateY(t.slotAngle),h}function Bi(t){const{h:e,r:n}=t,o=n*.08,a=t.detail??2,s=[{r:0,y:0},{r:n*.55,y:0},{r:n*.55,y:e*.03},{r:n*1-o,y:e*.03,cav:.6},{r:n,y:e*.03+o},{r:n,y:e*.1-o},{r:n-o,y:e*.1,edge:.3},{r:n*.78,y:e*.11,cav:.6},{r:n*.7,y:e*.2,smooth:!0},{r:n*.66,y:e*.44,cav:.4},{r:n*.82,y:e*.47},{r:n*.95,y:e*.49,smooth:!0,edge:.5},{r:n*.95,y:e*.51,smooth:!0,edge:.5},{r:n*.82,y:e*.53},{r:n*.66,y:e*.56,cav:.4},{r:n*.7,y:e*.8,smooth:!0},{r:n*.78,y:e*.89,cav:.6},{r:n-o,y:e*.9},{r:n,y:e*.9+o},{r:n,y:e*.97-o},{r:n-o,y:e*.97,edge:.3},{r:n*.55,y:e*.97,cav:.6},{r:n*.55,y:e-o},{r:n*.5,y:e,edge:.3},{r:n*.18,y:e,cav:.8},{r:n*.18,y:e-n*.6},{r:0,y:e-n*.6}];return Pt(s,dt(48,a,16))}function kl(t){const{r:e,hole:n,h:o}=t;return Pt([{r:e,y:-o},{r:e,y:-.004},{r:e*.96,y:.012,edge:.8},{r:n*1.6,y:.006,edge:.4},{r:n*1.05,y:-o*.25,cav:.9},{r:n,y:-o*.3,cav:1},{r:n,y:-o}],dt(40,t.detail??2,14))}function Pl(t){const{L:e,ra:n}=t,o=t.detail??2,a=n/4,s=-e*.45,r=[{r:0,y:s},{r:a*.6,y:s+a*.1,smooth:!0},{r:a,y:s+a*.6},{r:a,y:s+e*.06},{r:n*.7,y:s+e*.1},{r:n*.7,y:s+e*.2},{r:n,y:s+e*.22},{r:n,y:-e*.04},{r:n*1.9,y:-e*.03},{r:n*1.9,y:0,edge:.5},{r:n*.9,y:0,cav:.9},{r:n*.9,y:e*.12},{r:n*.8,y:e*.2},{r:n*.8,y:e*.4},{r:n*.7,y:e*.42},{r:a,y:e*.5},{r:a,y:e*.55-a*.6},{r:a*.6,y:e*.55-a*.1,smooth:!0},{r:0,y:e*.55}],i=[Pt(r,dt(32,o,12))],c=n*4.2,l=s+e*.14,d=e*.035,u=bn({pts:(()=>{const f=[],v=dt(40,o,14);for(let h=0;h<v;h++){const m=h/v*Xe,M=Math.abs((m+Math.PI)%Xe-Math.PI)<.35?.8:1;f.push([Math.cos(m)*c*M,Math.sin(m)*c*M])}return f})()},[{pts:Ka(n*.7,16)}],{t:d,bevel:d*.2});dn(u,0,l,0),i.push(u);const p=Pt([{r:0,y:0},{r:n*.45,y:0},{r:n*.45,y:e*.07},{r:n*.3,y:e*.075},{r:0,y:e*.075}],10);return dn(p,c*.75,l-e*.075-d/2+.002,0),i.push(p),_t(i)}function Al(t){const{L:e,ra:n}=t,o=t.detail??2,a=n*.35,s=[Pt([{r:0,y:0},{r:a,y:0},{r:a,y:e*.1},{r:n,y:e*.14},{r:n,y:e*.3},{r:n*1.7,y:e*.31},{r:n*1.7,y:e*.62,edge:.3},{r:n,y:e*.63,cav:.7},{r:n,y:e*.78},{r:a*1.3,y:e*.8},{r:a*1.3,y:e},{r:0,y:e}],dt(32,o,12))],r=bn({pts:[[-n*.7,-n*.7],[n*.7,-n*.7],[n*.7,n*.7],[-n*.7,n*.7]],sharp:30},[],{t:e*.14,bevel:n*.08});dn(r,0,e*.87,0),s.push(r);const i=bn({pts:[[0,-n*.25],[n*2.05,-n*.2],[n*2.05,n*.2],[0,n*.25]],sharp:30},[],{t:n*.5,bevel:n*.06});return dn(i,0,e*.46,0,0,0,0),s.push(i),_t(s)}const K0=0,Rl=1,Cl=new _,Ir=new xc,bs=new k0,Lr=new _,D0=new wc;class Tl{constructor(){this.tolerance=-1,this.faces=[],this.newFaces=[],this.assigned=new Dr,this.unassigned=new Dr,this.vertices=[]}setFromPoints(e){if(e.length>=4){this.makeEmpty();for(let n=0,o=e.length;n<o;n++)this.vertices.push(new Fl(e[n]));this._compute()}return this}setFromObject(e){const n=[];return e.updateMatrixWorld(!0),e.traverse(function(o){const a=o.geometry;if(a!==void 0){const s=a.attributes.position;if(s!==void 0)for(let r=0,i=s.count;r<i;r++){const c=new _;c.fromBufferAttribute(s,r).applyMatrix4(o.matrixWorld),n.push(c)}}}),this.setFromPoints(n)}containsPoint(e){const n=this.faces;for(let o=0,a=n.length;o<a;o++)if(n[o].distanceToPoint(e)>this.tolerance)return!1;return!0}intersectRay(e,n){const o=this.faces;let a=-1/0,s=1/0;for(let r=0,i=o.length;r<i;r++){const c=o[r],l=c.distanceToPoint(e.origin),d=c.normal.dot(e.direction);if(l>0&&d>=0)return null;const u=d!==0?-l/d:0;if(!(u<=0)&&(d>0?s=Math.min(u,s):a=Math.max(u,a),a>s))return null}return a!==-1/0?e.at(a,n):e.at(s,n),n}intersectsRay(e){return this.intersectRay(e,Cl)!==null}makeEmpty(){return this.faces=[],this.vertices=[],this}_addVertexToFace(e,n){return e.face=n,n.outside===null?this.assigned.append(e):this.assigned.insertBefore(n.outside,e),n.outside=e,this}_removeVertexFromFace(e,n){return e===n.outside&&(e.next!==null&&e.next.face===n?n.outside=e.next:n.outside=null),this.assigned.remove(e),this}_removeAllVerticesFromFace(e){if(e.outside!==null){const n=e.outside;let o=e.outside;for(;o.next!==null&&o.next.face===e;)o=o.next;return this.assigned.removeSubList(n,o),n.prev=o.next=null,e.outside=null,n}}_deleteFaceVertices(e,n){const o=this._removeAllVerticesFromFace(e);if(o!==void 0)if(n===void 0)this.unassigned.appendChain(o);else{let a=o;do{const s=a.next;n.distanceToPoint(a.point)>this.tolerance?this._addVertexToFace(a,n):this.unassigned.append(a),a=s}while(a!==null)}return this}_resolveUnassignedPoints(e){if(this.unassigned.isEmpty()===!1){let n=this.unassigned.first();do{const o=n.next;let a=this.tolerance,s=null;for(let r=0;r<e.length;r++){const i=e[r];if(i.mark===K0){const c=i.distanceToPoint(n.point);if(c>a&&(a=c,s=i),a>1e3*this.tolerance)break}}s!==null&&this._addVertexToFace(n,s),n=o}while(n!==null)}return this}_computeExtremes(){const e=new _,n=new _,o=[],a=[];for(let s=0;s<3;s++)o[s]=a[s]=this.vertices[0];e.copy(this.vertices[0].point),n.copy(this.vertices[0].point);for(let s=0,r=this.vertices.length;s<r;s++){const i=this.vertices[s],c=i.point;for(let l=0;l<3;l++)c.getComponent(l)<e.getComponent(l)&&(e.setComponent(l,c.getComponent(l)),o[l]=i);for(let l=0;l<3;l++)c.getComponent(l)>n.getComponent(l)&&(n.setComponent(l,c.getComponent(l)),a[l]=i)}return this.tolerance=3*Number.EPSILON*(Math.max(Math.abs(e.x),Math.abs(n.x))+Math.max(Math.abs(e.y),Math.abs(n.y))+Math.max(Math.abs(e.z),Math.abs(n.z))),{min:o,max:a}}_computeInitialHull(){const e=this.vertices,n=this._computeExtremes(),o=n.min,a=n.max;let s=0,r=0;for(let p=0;p<3;p++){const f=a[p].point.getComponent(p)-o[p].point.getComponent(p);f>s&&(s=f,r=p)}const i=o[r],c=a[r];let l,d;s=0,Ir.set(i.point,c.point);for(let p=0,f=this.vertices.length;p<f;p++){const v=e[p];if(v!==i&&v!==c){Ir.closestPointToPoint(v.point,!0,Lr);const h=Lr.distanceToSquared(v.point);h>s&&(s=h,l=v)}}s=-1,bs.setFromCoplanarPoints(i.point,c.point,l.point);for(let p=0,f=this.vertices.length;p<f;p++){const v=e[p];if(v!==i&&v!==c&&v!==l){const h=Math.abs(bs.distanceToPoint(v.point));h>s&&(s=h,d=v)}}const u=[];if(bs.distanceToPoint(d.point)<0){u.push(Po.create(i,c,l),Po.create(d,c,i),Po.create(d,l,c),Po.create(d,i,l));for(let p=0;p<3;p++){const f=(p+1)%3;u[p+1].getEdge(2).setTwin(u[0].getEdge(f)),u[p+1].getEdge(1).setTwin(u[f+1].getEdge(0))}}else{u.push(Po.create(i,l,c),Po.create(d,i,c),Po.create(d,c,l),Po.create(d,l,i));for(let p=0;p<3;p++){const f=(p+1)%3;u[p+1].getEdge(2).setTwin(u[0].getEdge((3-p)%3)),u[p+1].getEdge(0).setTwin(u[f+1].getEdge(1))}}for(let p=0;p<4;p++)this.faces.push(u[p]);for(let p=0,f=e.length;p<f;p++){const v=e[p];if(v!==i&&v!==c&&v!==l&&v!==d){s=this.tolerance;let h=null;for(let m=0;m<4;m++){const M=this.faces[m].distanceToPoint(v.point);M>s&&(s=M,h=this.faces[m])}h!==null&&this._addVertexToFace(v,h)}}return this}_reindexFaces(){const e=[];for(let n=0;n<this.faces.length;n++){const o=this.faces[n];o.mark===K0&&e.push(o)}return this.faces=e,this}_nextVertexToAdd(){if(this.assigned.isEmpty()===!1){let e,n=0;const o=this.assigned.first().face;let a=o.outside;do{const s=o.distanceToPoint(a.point);s>n&&(n=s,e=a),a=a.next}while(a!==null&&a.face===o);return e}}_computeHorizon(e,n,o,a){this._deleteFaceVertices(o),o.mark=Rl;let s;n===null?s=n=o.getEdge(0):s=n.next;do{const r=s.twin,i=r.face;i.mark===K0&&(i.distanceToPoint(e)>this.tolerance?this._computeHorizon(e,r,i,a):a.push(s)),s=s.next}while(s!==n);return this}_addAdjoiningFace(e,n){const o=Po.create(e,n.tail(),n.head());return this.faces.push(o),o.getEdge(-1).setTwin(n.twin),o.getEdge(0)}_addNewFaces(e,n){this.newFaces=[];let o=null,a=null;for(let s=0;s<n.length;s++){const r=n[s],i=this._addAdjoiningFace(e,r);o===null?o=i:i.next.setTwin(a),this.newFaces.push(i.face),a=i}return o.next.setTwin(a),this}_addVertexToHull(e){const n=[];return this.unassigned.clear(),this._removeVertexFromFace(e,e.face),this._computeHorizon(e.point,null,e.face,n),this._addNewFaces(e,n),this._resolveUnassignedPoints(this.newFaces),this}_cleanup(){return this.assigned.clear(),this.unassigned.clear(),this.newFaces=[],this}_compute(){let e;for(this._computeInitialHull();(e=this._nextVertexToAdd())!==void 0;)this._addVertexToHull(e);return this._reindexFaces(),this._cleanup(),this}}class Po{constructor(){this.normal=new _,this.midpoint=new _,this.area=0,this.constant=0,this.outside=null,this.mark=K0,this.edge=null}static create(e,n,o){const a=new Po,s=new Ms(e,a),r=new Ms(n,a),i=new Ms(o,a);return s.next=i.prev=r,r.next=s.prev=i,i.next=r.prev=s,a.edge=s,a.compute()}getEdge(e){let n=this.edge;for(;e>0;)n=n.next,e--;for(;e<0;)n=n.prev,e++;return n}compute(){const e=this.edge.tail(),n=this.edge.head(),o=this.edge.next.head();return D0.set(e.point,n.point,o.point),D0.getNormal(this.normal),D0.getMidpoint(this.midpoint),this.area=D0.getArea(),this.constant=this.normal.dot(this.midpoint),this}distanceToPoint(e){return this.normal.dot(e)-this.constant}}class Ms{constructor(e,n){this.vertex=e,this.prev=null,this.next=null,this.twin=null,this.face=n}head(){return this.vertex}tail(){return this.prev?this.prev.vertex:null}length(){const e=this.head(),n=this.tail();return n!==null?n.point.distanceTo(e.point):-1}lengthSquared(){const e=this.head(),n=this.tail();return n!==null?n.point.distanceToSquared(e.point):-1}setTwin(e){return this.twin=e,e.twin=this,this}}class Fl{constructor(e){this.point=e,this.prev=null,this.next=null,this.face=null}}class Dr{constructor(){this.head=null,this.tail=null}first(){return this.head}last(){return this.tail}clear(){return this.head=this.tail=null,this}insertBefore(e,n){return n.prev=e.prev,n.next=e,n.prev===null?this.head=n:n.prev.next=n,e.prev=n,this}insertAfter(e,n){return n.prev=e,n.next=e.next,n.next===null?this.tail=n:n.next.prev=n,e.next=n,this}append(e){return this.head===null?this.head=e:this.tail.next=e,e.prev=this.tail,e.next=null,this.tail=e,this}appendChain(e){for(this.head===null?this.head=e:this.tail.next=e,e.prev=this.tail;e.next!==null;)e=e.next;return this.tail=e,this}remove(e){return e.prev===null?this.head=e.next:e.prev.next=e.next,e.next===null?this.tail=e.prev:e.next.prev=e.prev,this}removeSubList(e,n){return e.prev===null?this.head=n.next:e.prev.next=n.next,n.next===null?this.tail=e.prev:n.next.prev=e.prev,this}isEmpty(){return this.head===null}}class _l extends Ln{constructor(e=[]){super();const n=[],o=[],s=new Tl().setFromPoints(e).faces;for(let r=0;r<s.length;r++){const i=s[r];let c=i.edge;do{const l=c.head().point;n.push(l.x,l.y,l.z),o.push(i.normal.x,i.normal.y,i.normal.z),c=c.next}while(c!==i.edge)}this.setAttribute("position",new ct(n,3)),this.setAttribute("normal",new ct(o,3))}}const Il=(t,e)=>{let n=!1;for(let o=0,a=e.length-1;o<e.length;a=o++){const s=e[o],r=e[a];s[1]>t[1]!=r[1]>t[1]&&t[0]<(r[0]-s[0])*(t[1]-s[1])/(r[1]-s[1])+s[0]&&(n=!n)}return n},Ll=(t,e)=>{let n=1/0;for(let o=0;o<e.length;o++){const a=e[o],s=e[(o+1)%e.length],r=s[0]-a[0],i=s[1]-a[1],c=$t(((t[0]-a[0])*r+(t[1]-a[1])*i)/(r*r+i*i||1));n=Math.min(n,Math.hypot(t[0]-a[0]-c*r,t[1]-a[1]-c*i))}return n};function xo(t){const e=t.detail??2,n=t.t,o=t.bevel??n*.14,a={pts:t.round===0?t.outline:b0(t.outline,t.round??2),sharp:40},s=[],r=[];for(const i of t.holes??[]){const c=i.bush?i.r*2.2:i.r;if(s.push({pts:Ka(c,dt(Math.max(16,Math.round(c*60)),e,12),i.at[0],i.at[1]),bevel:o*.7,sink:i.sink,cav:i.cav??.45}),i.bush){const l=kl({r:c*1.001,hole:i.r,h:n*.95,detail:e});dn(l,i.at[0],n/2,i.at[1]),r.push(l)}}if(t.pierce){const i=tt(t.pierce.seed*613+5),c=t.pierce.size,l=t.pierce.margin??c*1.4,d=a.pts.map(f=>f[0]),u=a.pts.map(f=>f[1]),p=(t.holes??[]).map(f=>[f.at,(f.bush?f.r*2.2:f.r)+(f.sink??0)]);for(let f=Math.min(...u),v=0;f<Math.max(...u);f+=c*1.9,v++)for(let h=Math.min(...d)+v%2*c;h<Math.max(...d);h+=c*2.1){const m=[h+(i()-.5)*c*.4,f+(i()-.5)*c*.4];if(!Il(m,a.pts)||Ll(m,a.pts)<l||p.some(([y,S])=>Math.hypot(y[0]-m[0],y[1]-m[1])<S+c*1.3))continue;const M=i()*Xe,x=.55+i()*.5,g=dt(14,e,8),w=[];for(let y=0;y<g;y++){const S=y/g*Xe,R=1+.45*Math.max(0,Math.cos(S))**3,k=Math.cos(S)*c*.5*R,L=Math.sin(S)*c*.5*x;w.push([m[0]+k*Math.cos(M)-L*Math.sin(M),m[1]+k*Math.sin(M)+L*Math.cos(M)])}s.push({pts:w,bevel:Math.min(o*.6,c*.12),cav:.3}),p.push([m,c*.8])}}return{geo:bn(a,s,{t:n,bevel:o,segs:e===0?1:2}),bushes:r.length?_t(r):null}}function M0(t,e,n,o,a={}){const s=tt(o*43+9),r=ba({size:t,detail:a.detail,seed:o}),i=e.map(l=>Wi(new _(l[0],n,l[1]),void 0,s()*Xe)),c=[{geo:r,finish:a.finish??"polished",seed:o,mats:i}];if(a.abused?.length){const l=ba({size:t,detail:a.detail,seed:o+1,abused:!0});c[0].mats=i.filter((d,u)=>!a.abused.includes(u)),c.push({geo:l,finish:a.finish??"polished",seed:o+1,mats:i.filter((d,u)=>a.abused.includes(u))})}return c}function vs(t,e,n,o=10){const a=[],s=[],r=c=>t($t(c));for(let c=0;c<=n;c++){const l=c/n,d=r(l-.002),u=r(l+.002),p=u[0]-d[0],f=u[1]-d[1],v=Math.hypot(p,f)||1,h=-f/v,m=p/v,M=r(l),x=e(l);a.push([M[0]+h*x,M[1]+m*x]),s.push([M[0]-h*x,M[1]-m*x])}const i=(c,l,d)=>{const u=r(c),p=e(c),f=Math.atan2(l[1]-u[1],l[0]-u[0]),v=[];for(let h=1;h<o;h++){const m=f+d*Math.PI*h/o;v.push([u[0]+Math.cos(m)*p,u[1]+Math.sin(m)*p])}return v};return[...a,...i(1,a[n],-1),...s.reverse(),...i(0,s[s.length-1],-1)]}function cr(t){const e=t.detail??2,n=t.seed??4,o=t.length??14,a=t.width??2.6,s=t.t??.7,r=v=>[Lt(-o/2,o/2,v),Math.sin(v*Math.PI)*o*.12-v*o*.04],c=vs(r,v=>a/2*(1.25-.55*v+.35*Math.exp(-(((v-.08)/.1)**2))+.25*Math.exp(-(((v-.62)/.09)**2))),dt(60,e,20),dt(14,e,6)),l=(v,h=0)=>{const m=r(v);return[m[0],m[1]+h]},d=[l(.06,-.15),l(.3,.2),l(.97)],u=[...d.map(v=>({at:v,r:.5,sink:.32})),{at:l(.62),r:.14,bush:!0},{at:l(.45),r:.1,bush:!0}],p=xo({outline:c,holes:u,t:s,bevel:.09,detail:e,round:1}),f=M0("medium",d,s/2-.19,n,{detail:e,abused:[1]});return Ja([co(p.geo,"striped",n),...p.bushes?[co(p.bushes,"polished",n+1)]:[]],f)}function Dl(t){const e=t.detail??2,n=t.seed??6,o=t.balanceR,a=o*t.table,s=t.t,r=t.h??1.6,i=a*.42,c=-4.318,l=a*.62,d=dt(48,e,20),u=[],p=Math.asin(i/a);for(let F=0;F<=d;F++){const D=-(Math.PI-p)+2*(Math.PI-p)*F/d;u.push([Math.cos(D)*a,Math.sin(D)*a])}const f=F=>{const D=[];for(let J=1;J<8;J++){const Y=J/8;D.push([Lt(-a*Math.cos(p),c+l*.2,Y),F*Lt(i,l,Y*Y)*(1-.18*Math.sin(Y*Math.PI))])}return D};u.push(...f(1));for(let F=0;F<=10;F++){const D=Math.PI/2+Math.PI*F/10;u.push([c+Math.cos(D)*l*.5-l*0,Math.sin(D)*l])}u.push(...f(-1).reverse());const v=[c+l*.15,0],h=xo({outline:u,holes:[{at:v,r:.5,sink:.32},{at:[0,0],r:a*.2}],t:s,bevel:.1,detail:e,round:2});dn(h.geo,0,-s/2,0);const m=[h.geo],M=xo({outline:(()=>{const F=[];for(let D=0;D<24;D++){const J=D/24*Xe;F.push([c+Math.cos(J)*l*.78,Math.sin(J)*l*.9])}return F})(),holes:[{at:v,r:.5}],t:r-s,bevel:.08,detail:e,round:0});dn(M.geo,0,-s-(r-s)/2,0),m.push(M.geo);for(const F of[-1,1]){const D=Pt([{r:0,y:0},{r:.16,y:0},{r:.16,y:.55},{r:.12,y:.62},{r:0,y:.62}],14);D.scale(1,-1,1);const J=D.index.array;for(let Y=0;Y<J.length;Y+=3){const oe=J[Y+1];J[Y+1]=J[Y+2],J[Y+2]=oe}dn(D,c-l*.25,-r,F*l*.55),m.push(D)}const x=[],g=.35,w=1.45,y=21;for(let F=0;F<y;F++){const D=Lt(g,w,F/(y-1)),J=F===0||F===y-1||F===(y-1)/2,Y=a*.93,oe=a*(J?.74:.82),ae=.022,G=Math.cos(D),te=Math.sin(D),V=bn({pts:[[oe*G-ae*-te,oe*te-ae*G],[Y*G-ae*-te,Y*te-ae*G],[Y*G+ae*-te,Y*te+ae*G],[oe*G+ae*-te,oe*te+ae*G]],cav:.6,sharp:30},[],{t:.025,bevel:.006,segs:1});dn(V,0,.0125-.006,0),x.push(V)}m.push(_t(x));const S=_t(m),R=xo({outline:(()=>{const F=[];for(let D=0;D<32;D++){const J=D/32*Xe;F.push([Math.cos(J)*a*.38*(1+.45*Math.abs(Math.cos(J))**4),Math.sin(J)*a*.3])}return F})(),holes:[{at:[-a*.38,0],r:.2,sink:.12},{at:[a*.38,0],r:.2,sink:.12}],t:.16,bevel:.04,detail:e,round:0});dn(R.geo,0,.08+.19,0);const k=vs(F=>[Lt(-1.666-.15,a*1.02,F),0],F=>F<.2?.2-F*.35:Lt(.13,.045,(F-.2)/.8),dt(30,e,12),8),L=xo({outline:k,holes:[{at:[0,0],r:a*.25}],t:.14,bevel:.035,detail:e,round:1}),C=Pt([{r:a*.25,y:-.07},{r:a*.34,y:-.07},{r:a*.34,y:.07,edge:.5},{r:a*.25,y:.07}],dt(40,e,14)),z=[];for(const F of[-1,1]){const D=Pt([{r:0,y:-r*.75},{r:.05,y:-r*.74},{r:.05,y:0},{r:0,y:0}],10);dn(D,-1.666,-.07,F*.07),z.push(D)}const b=_t([L.geo,C,...z]);b.rotateY(-0),dn(b,0,.07,0);const P=M0("small",[[-a*.38,0],[a*.38,0]],.27+.08-.1,n+3,{detail:e}),I=M0("large",[v],-.32+.05,n+5,{detail:e});return Ja([co(S,"striped",n),co(R.geo,"polished",n+1),co(b,"polished",n+2)],[...P,...I])}function lr(t){const e=t.detail??2,n=t.seed??8,o=.26,a=4.2,s=[],r=[],i=(y,S=!1)=>{s.push(y),r.push(S)};i([a+.02,-.1],!0),i([a-.32,-.1],!0),i([a-.38,-.05]),i([a-.39,0]),i([a-.38,.05]),i([a-.32,.1],!0),i([a+.02,.1],!0),i([a+.07,.17],!0),i([a-.1,.25]),i([a-.45,.22]),i([a-.85,.12]);for(let y=0;y<=6;y++){const S=Lt(a-1.1,.7,y/6);i([S,Lt(.085,.15,y/6)])}const c=(y,S)=>{const R=[Math.cos(y),Math.sin(y)],k=[-R[1],R[0]],L=.15,C=.085,z=.45,b=(P,I)=>[R[0]*P+k[0]*I,R[1]*P+k[1]*I];return i(b(.45,-L)),i(b(S*.6,-L*.92)),i(b(S,-L),!0),i(b(S,-C),!0),i(b(S-z,-C),!0),i(b(S-z,C),!0),i(b(S,C),!0),i(b(S+.02,L),!0),i(b(S*.6,L*.92)),i(b(.45,L)),{u:R,v:k,La:S,sd:z,sh:C}};i([.42,.24]);const l=c(Math.PI*.6,1.55);i([-.42,.12]),i([-.46,0]),i([-.42,-.12]),c(Math.PI*1.4,1.55),i([.42,-.24]);for(let y=0;y<=6;y++){const S=Lt(.7,a-1.1,y/6);i([S,-Lt(.15,.085,y/6)])}i([a-.85,-.12]),i([a-.45,-.22]),i([a-.1,-.25]),i([a+.07,-.17],!0);const d=b0(s,e===0?1:2,r),p=[xo({outline:d,holes:[{at:[0,0],r:.12}],t:o,bevel:.05,detail:e,round:0}).geo],f=Pt([{r:0,y:-.62},{r:.045,y:-.6},{r:.045,y:0},{r:0,y:0}],10);dn(f,a-.55,-o/2+.01,0),p.push(f);const v=Pt([{r:0,y:-1.2},{r:.05,y:-1.18},{r:.05,y:-.9},{r:.12,y:-.85},{r:.12,y:.55},{r:.05,y:.6},{r:.05,y:.9},{r:0,y:.92}],16);p.push(v);const h=_t(p),m=l.sd+.45,M=l.sh*.97,x=ur({L:m,w:M,h:o*1.25}).geo,g=new fe().makeRotationY(-Math.atan2(l.u[1],l.u[0])).multiply(new fe().makeTranslation(l.La-l.sd+m/2,0,0)),w=[co(h,"brushed",n)];return t.stone!==!1&&w.push(co(x,"ruby",n,g)),Ja(w)}function ur(t){const e=t.L,n=t.w,o=t.h/2,a=t.slant??.16,s=t.b??Math.min(.014,n*.16),r=[[-e/2,-n],[e/2,-n],[e/2-a,n],[-e/2,n]],i=[],c=1,l=[.11*e/.9,.06,.1*o/.1625];let d=new _(0,1,0),u=new _;for(let v=0;v<4;v++){const h=r[v],m=r[(v+3)%4],M=r[(v+1)%4],x=new bt(m[0]-h[0],m[1]-h[1]).normalize(),g=new bt(M[0]-h[0],M[1]-h[1]).normalize(),w=(y,S,R)=>new _(h[0]+x.x*y+g.x*S,R,h[1]+x.y*y+g.y*S);for(const y of[1,-1]){if(v===c&&y===1){const S=w(l[0],0,o-s*.5),R=w(0,l[1],o-s*.5),k=w(0,0,o-l[2]);i.push(S,R,k,w(l[0]+s,s,o),w(s,l[1]+s,o),w(s,0,o-l[2]-s*.3),w(0,s,o-l[2]-s*.3)),d=new _().subVectors(R,S).cross(new _().subVectors(k,S)).normalize(),d.dot(new _(h[0],0,h[1]).add(new _(0,o,0)))<0&&d.negate(),u=S.clone().add(R).add(k).multiplyScalar(1/3);continue}i.push(w(s,s,y*o),w(s,0,y*(o-s)),w(0,s,y*(o-s)))}}if(t.side===1){for(const v of i)v.z=-v.z;d.z=-d.z,u.z=-u.z}const p=new _l(i),f=p.getAttribute("position").count;return p.setAttribute("aCav",new ct(new Float32Array(f),1)),p.setAttribute("aEdge",new ct(new Float32Array(f),1)),p.computeBoundingBox(),{geo:p,chip:{at:u,n:d},half:new _(e/2,o,n),corner:new _(e/2,o,(t.side??-1)*n)}}function Hi(t){const e=t.r??2.6;return Ko({teeth:15,r:e,profile:"club",spokes:4,rim:.07,hub:.2,t:e*.06,detail:t.detail,seed:t.seed??11,sheared:t.sheared,bevel:.018})}function gs(t){const e=typeof t.w=="number"?(()=>t.w):t.w,n=typeof t.t=="number"?(()=>t.t):t.t;return wl(t.pts,t.side,e,n,{cs:t.detail===0?1:2,cav:t.cav})}function dr(t){const e=t.detail??2,n=t.rIn??.42,o=t.rOut??2.75,a=t.turns??13,s=t.t??.03,r=t.h??s*6.5,i=t.angle??0,c=dt(150,e,40),l=Math.round(a*c),d=[],u=[],p=new _(0,1,0),f=i/Xe*.55;for(let R=0;R<=l;R++){const k=R/l,L=Xe*a*k+i*(1-k),C=n+(o-n)*Math.pow(k,1+f*(1-k)*2),z=i*.05*o*k;d.push(new _(Math.cos(L)*C+z,0,Math.sin(L)*C)),u.push(p)}const v=t.overcoil??!0,h=Xe*a,m=v?dt(110,e,30):0,M=r*2.4;for(let R=1;R<=m;R++){const k=R/m,L=h+Xe*.72*k,C=o-o*.34*Math.min(1,k*1.6)**1.5,z=M*Math.min(1,k*3)**2*(3-2*Math.min(1,k*3));d.push(new _(Math.cos(L)*C+i*.05*o,z,Math.sin(L)*C)),u.push(p)}const x=gs({pts:d,side:u,w:r,t:s,detail:e}),g=Pt([{r:.16,y:-r*.7},{r:n+.02,y:-r*.7},{r:n+.02,y:r*.7,edge:.4},{r:.16,y:r*.7}],dt(32,e,12));g.rotateY(-i);const w=d[d.length-1],y=h+(v?Xe*.72:0),S=bn({pts:[[-.16,-.12],[.16,-.12],[.16,.12],[-.16,.12]],sharp:30},[],{t:r*2.2,bevel:.025,segs:1});return S.rotateY(-y),dn(S,w.x*1.04,w.y,w.z*1.04),{geo:_t([x,g,S]),outer:o}}function El(t){const e=t.detail??2,n=t.seed??21,o=t.R,a=t.angle??0,s=o*.075,r=o*.085,i=t.screws,c=new fe().makeRotationY(-a),l=[],d=[],u=dt(12,e,6),p=k=>o*(.06+.05*Math.exp(-((k/(o*.25))**2)));for(let k=0;k<=u;k++){const L=Lt(-3.2725,o-s*.5,k/u);d.push([L,p(L)])}for(let k=u;k>=0;k--){const L=Lt(-3.2725,o-s*.5,k/u);d.push([L,-p(L)])}const f=bn({pts:d},[{pts:Ka(o*.05,16),cav:.5}],{t:r*.8,bevel:r*.1,segs:e===0?1:2});l.push(f);const v=.035,h=dt(90,e,30);for(const k of[0,1]){const L=k*Math.PI-.08,C=k*Math.PI+Math.PI-.08-v*2,z=[];for(let b=0;b<=h;b++){const P=Lt(L,C,b/h);z.push([Math.cos(P)*o,Math.sin(P)*o])}for(let b=h;b>=0;b--){const P=Lt(L,C,b/h);z.push([Math.cos(P)*(o-s),Math.sin(P)*(o-s)])}l.push(bn({pts:z,sharp:40},[],{t:r,bevel:r*.12,segs:e===0?1:2}))}const m=Pl({L:t.staffL,ra:o*.022,detail:e});l.push(m);const M=_t(l).applyMatrix4(c),x=tt(n*17+3),g=[];for(let k=0;k<i;k++){const L=(k+.5)/i*Xe+.03,C=Wi(new _(Math.cos(L)*(o+.04),0,Math.sin(L)*(o+.04)),new _(Math.cos(L),0,Math.sin(L)),x()*Xe);g.push(c.clone().multiply(C))}const w=ba({size:"timing",detail:e,seed:n+2}),y=r/2+.3,S=dr({rOut:t.springR,angle:a,detail:e});dn(S.geo,0,y,0);const R=[{geo:w,finish:"polished",seed:n+2,mats:g}];return{...Ja([co(M,"polished",n),co(S.geo,"blackened",n+1)],R),hairspringY:y}}function Wl(t){const e=t.detail??2,n=t.w??1.9,o=n/12,a=t.inner,s=t.outer??5.2,r=t.coils,i=t.throwLen,c=tt((t.seed??2)*211+1),l=[],d=[],u=Math.round(r*dt(90,e,30));for(let g=0;g<=u;g++){const w=g/u,y=w*r*Xe,S=Lt(a,s,Math.pow(w,.8))+Math.sin(w*37)*.03;l.push(new _(Math.cos(y)*S,0,Math.sin(y)*S)),d.push(new _(0,1,0))}const p=l[l.length-1].clone(),f=r*Xe,v=new _(-Math.sin(f),0,Math.cos(f)),h=new _(Math.cos(f),0,Math.sin(f)),m=dt(260,e,80),M=c()*Xe;for(let g=1;g<=m;g++){const w=g/m,y=w*i,S=p.clone().addScaledVector(v,y*.9).addScaledVector(h,Math.sin(w*Math.PI*1.6+M*.1)*i*.22+w*i*.15).add(new _(0,Math.sin(w*Math.PI)*i*.32-Math.sin(w*Math.PI*2.2)*i*.12,0));l.push(S);const R=Co(w*1.6)*Math.PI*.5+Math.sin(w*7)*.25;d.push(new _(0,Math.cos(R),0).addScaledVector(h,Math.sin(R)).normalize())}for(let g=0;g<l.length;g++){const w=l[Math.min(l.length-1,g+1)].clone().sub(l[Math.max(0,g-1)]).normalize();d[g].addScaledVector(w,-d[g].dot(w)).normalize()}const x=g=>g>.985?.5+(1-g)*30:1;return gs({pts:l,side:d,w:g=>n*x(g),t:o,detail:e,cav:g=>g<u/l.length?.35:0})}function Nl(t){const e=t.detail??2,n=t.seed??31,o=t.R??6,a=2.4,s=.28,r=dt(96,e,32),i=Pt([{r:0,y:0},{r:o-.1,y:0},{r:o,y:.1},{r:o,y:a-.06},{r:o-.05,y:a,edge:.8},{r:o-s,y:a,edge:.6},{r:o-s,y:.3,cav:.9},{r:1.1,y:.3,cav:.7},{r:1.1,y:.65},{r:.7,y:.7},{r:.55,y:.7},{r:.55,y:-.1},{r:0,y:-.1}],r),c=Ko({teeth:84,r:o+.55,profile:"barrel",inner:o-.05,t:.5,detail:e,seed:n,boss:!1,bevel:.04});dn(c,0,.45,0);const l=Pt([{r:0,y:0},{r:o-.35,y:0},{r:o-.3,y:.05},{r:o-.3,y:.22},{r:o-.38,y:.26,edge:.7},{r:.9,y:.26},{r:.9,y:.4},{r:.5,y:.4},{r:0,y:.4}],r),d=new fe().compose(new _(-o*1.95,.2,-o*.55),new Wt().setFromEuler(new Bn(.3,0,.38,"ZYX")),new _(1,1,1)),u=Al({L:a+1.6,ra:.42,detail:e});dn(u,0,-.4,0);const p=Ko({teeth:40,r:2.6,profile:"ratchet",spokes:0,hole:.3,t:.55,detail:e,seed:n+1,bevel:.05});p.rotateY(.3),dn(p,0,a+1.05,0);const v=bn({pts:[[0,-.25],[1.6,-.15],[2.15,-.45],[2.3,-.25],[1.75,.25],[0,.3],[-.3,0]],sharp:30},[],{t:.45,bevel:.06});dn(v,2.15,a+1.05,1.2,0,-.5,0);const h=Wl({inner:1.3,outer:o-s-.1,coils:4,throwLen:9,detail:e,seed:n});return dn(h,0,1.3,0),Ja([co(_t([i,c]),"turned",n),co(l,"sunray",n+1,d),co(_t([u,p,v]),"grained",n+2),co(h,"blackened",n+3)])}function Oi(t){const e=t.detail??2,n=t.seed??41,o=tt(n*7+11),[a,s,r]=t.box,i=t.centre??[0,0,0],c=(()=>{const h=[],m=[],M=dt(24,e,8);for(let x=0;x<=M;x++){const g=x/M,w=g*4.2,y=.12+g*.1;h.push(new _(Math.cos(w)*y,g*.12,Math.sin(w)*y)),m.push(new _(0,1,0))}return gs({pts:h,side:m,w:.05,t:.012,detail:0})})(),l=(()=>{const h=Ni({teeth:80,r:5,profile:"train",detail:1,seed:1}),m=Math.round(h.pts.length/80),M=h.pts.slice(0,m-1).map(x=>[x[0]-4.8,x[1]]);return bn({pts:M,sharp:30},[],{t:.4,bevel:.02,segs:1})})(),d=(()=>{const h=[],m=tt(n+5);for(let M=0;M<7;M++){const x=M/7*Xe;h.push([Math.cos(x)*(.1+m()*.12),Math.sin(x)*(.1+m()*.12)])}return bn({pts:h,sharp:25},[],{t:.04,bevel:.01,segs:1})})(),u=Pt([{r:0,y:-.02},{r:.025,y:0},{r:0,y:.02}],4),p=ba({size:"small",detail:e>1?1:0,seed:n+9}),f=[[c,.22,"polished",.8],[l,.05,"brushed",1],[d,.3,"blackened",1.2],[p,.03,"polished",1],[u,.4,"blackened",1.5]],v=[];return f.forEach(([h,m,M,x],g)=>{const w=Math.max(1,Math.round(t.count*m)),y=[];for(let S=0;S<w;S++){const R=o(),k=x*(R<.6?.55+o()*.3:R<.9?1+o()*.4:1.8+o()*.6),L=new _(i[0]+(o()-.5)*a,i[1]+(o()-.5)*s,i[2]+(o()-.5)*r),C=new Wt().setFromEuler(new Bn(o()*Xe,o()*Xe,o()*Xe));y.push(new fe().compose(L,C,new _(k,k,k)))}v.push({geo:h,finish:M,seed:n+g,mats:y})}),Ja([],v)}const Ya=(t=0,e=0,n=0)=>new _(t,e,n);function ia(t,e,n,o={}){const a=new mn,s=t.length,r=[];for(let u=0;u<s;u++)r.push(t[Math.min(s-1,u+1)].clone().sub(t[Math.max(0,u-1)]).normalize());const i=[0];for(let u=1;u<s;u++)i.push(i[u-1]+t[u].distanceTo(t[u-1]));const c=i[s-1]||1;let l=Math.abs(r[0].y)<.9?Ya(0,1,0):Ya(1,0,0);l=l.sub(r[0].clone().multiplyScalar(l.dot(r[0]))).normalize();const d=[];for(let u=0;u<s;u++){l.sub(r[u].clone().multiplyScalar(l.dot(r[u]))).normalize();const p=r[u].clone().cross(l),f=i[u]/c,v=.001,h=(e(Math.min(1,f+v))-e(Math.max(0,f-v)))/(2*v*c),m=e(f),M=[];for(let x=0;x<n;x++){const g=x/n*Xe,w=l.clone().multiplyScalar(Math.cos(g)).add(p.clone().multiplyScalar(Math.sin(g))),y=w.clone().sub(r[u].clone().multiplyScalar(h)).normalize(),S=t[u].clone().add(w.multiplyScalar(m)),R=a.v(S.x,S.y,S.z,y.x,y.y,y.z,o.cav?o.cav(f):0,0);if(m>0){const k=w.clone().normalize();a.thin(R,k.x,k.y,k.z,m)}M.push(R)}d.push(M)}for(let u=0;u+1<s;u++)for(let p=0;p<n;p++){const f=d[u][p],v=d[u][(p+1)%n],h=d[u+1][(p+1)%n],m=d[u+1][p];a.quad(f,v,h,m)}if(o.caps??!0)for(const[u,p]of[[0,-1],[s-1,1]]){const f=r[u].clone().multiplyScalar(p),v=t[u].clone().add(f.clone().multiplyScalar(e(u?1:0)*.8)),h=a.v(v.x,v.y,v.z,f.x,f.y,f.z);for(let m=0;m<n;m++)a.tri(h,d[u][m],d[u][(m+1)%n])}return a.geometry()}function Vi(t,e,n,o,a=0){const s=e.clone().sub(t).cross(Ya(0,1,0)).normalize();return Array.from({length:o+1},(r,i)=>{const c=i/o,l=4*c*(1-c);return t.clone().lerp(e,c).add(Ya(0,-n*l*(1+.25*l),0)).add(s.clone().multiplyScalar(a*Math.sin(c*Math.PI)*Math.sin(c*Xe)))})}function Ra(t){const e=t.detail??2,n=t.r??.06,o=$t(t.phase??0),a=tt(t.seed??1),s=t.a.distanceTo(t.b),r=dt(14,e,6),i=dt(90,e,16),c=(a()-.5)*s*.06,l=u=>n*2.6*Math.exp(-((u*s/(n*5))**2));if(o<.92){const u=Vi(t.a,t.b,(t.sag??s*.12)*(1+o*.8),i,c),p=.5+(a()-.5)*.2;return ia(u,v=>n*(1-.86*o*Math.exp(-(((v-p)/(.12+.2*(1-o)))**2)))+l(v)+l(1-v),r)}const d=(u,p,f)=>{const v=s*(.25+(o-.92)*3)*(.8+.4*f),h=p.clone().sub(u).normalize(),m=Array.from({length:i/2+1},(M,x)=>{const g=x/(i/2);return u.clone().add(h.clone().multiplyScalar(v*.35*Math.sin(g*1.4))).add(Ya(0,-v*g*g,0))});return ia(m,M=>n*(.55+.5*Math.exp(-(((M-.93)/.07)**2))*1.8)*(1-.3*M)+l(M),r)};return _t([d(t.a,t.b,0),d(t.b,t.a,1)])}function Bl(t){const e=t.detail??2,n=t.r,o=$t(t.phase),a=t.beads,s=t.a.distanceTo(t.b),r=Vi(t.a,t.b,t.sag,dt(160,e,30)),i=o*.04;return ia(r,l=>{const d=Math.max(0,Math.cos(Xe*a*(l-i)+Math.PI))**3*Co(l*8)*Co((1-l)*8);return n*(1-.65*o)+n*2.4*o*d+n*2*Math.exp(-((l*s/(n*5))**2))+n*2*Math.exp(-(((1-l)*s/(n*5))**2))},dt(14,e,6))}function Hl(t,e,n={}){const o=n.detail??2,a=$t(n.phase??0),s=n.t??.006,r=dt(16,o,5),i=t.length-1,c=tt(n.seed??3),l=9,d=5,u=Array.from({length:(l+1)*(d+1)},()=>c()),p=(M,x)=>{const g=M*l,w=x*d,y=Math.min(l-1,Math.floor(g)),S=Math.min(d-1,Math.floor(w)),R=Co(g-y),k=Co(w-S),L=(C,z)=>u[z*(l+1)+C];return Lt(Lt(L(y,S),L(y+1,S),R),Lt(L(y,S+1),L(y+1,S+1),R),k)},f=(M,x)=>{const g=x/r;return t[M].clone().lerp(e[M],g).add(Ya(0,-(n.sag??.15)*4*g*(1-g),0))},v=new mn,h=.2+a*.55,m=[[],[]];for(let M=0;M<2;M++)for(let x=0;x<=i;x++){const g=[];for(let w=0;w<=r;w++){const y=f(x,w),S=f(Math.min(i,x+1),w).sub(f(Math.max(0,x-1),w)),R=f(x,Math.min(r,w+1)).sub(f(x,Math.max(0,w-1))),k=S.cross(R).normalize().multiplyScalar(M?-1:1),L=y.clone().add(k.clone().multiplyScalar(s*.5));g.push(v.v(L.x,L.y,L.z,k.x,k.y,k.z))}m[M].push(g)}for(let M=0;M<i;M++)for(let x=0;x<r;x++){const g=(M+.5)/i,w=(x+.5)/r,y=Math.min(w,1-w)*2;if(!(p(g,w)*(.6+y)<h&&y>.15))for(let S=0;S<2;S++)v.quad(m[S][M][x],m[S][M+1][x],m[S][M+1][x+1],m[S][M][x+1])}return v.geometry()}function E0(t={}){const e=t.detail??2,n=t.R??.6,o=t.rIn??.12,a=t.phase??0,s=n*(.42+.1*Math.sin(a*Xe)),r=[],i=dt(18,e,6);r.push({r:n*1.04,y:0,smooth:!0});for(let c=0;c<=i;c++){const l=c/i*Math.PI*.5,d=Lt(o*1.15,n,Math.cos(l));r.push({r:d,y:s*Math.sin(l)**.8+n*.03*(1-Math.cos(l)),smooth:!0})}return r.push({r:o*1.15,y:s*1.08,smooth:!0},{r:o,y:s*1.25,smooth:!0},{r:o,y:s*.4,smooth:!0}),Pt(r.reverse(),dt(48,e,14))}const za=t=>t==="high"?2:t==="mid"?1:0;function Er(t,e,n){if(t.finish==="oil")return jo();if(t.finish==="ruby"){t.geo.computeBoundingBox();const o=t.geo.boundingBox,a=o.getSize(new _).multiplyScalar(.5),s=o.getCenter(new _);return vl({half:a,crackP:s.clone().add(new _(a.x*.15,0,0)),crackN:new _(.85,.25,.45),node:s.clone().add(new _(a.x*.55,a.y*.1,-a.z*.2))})}return cn({finish:t.finish,seed:t.seed,wear:n,tier:e})}function Ol(t,e,n={}){const o=new pt,a=n.wear??.6;for(const s of t.pieces){const r=Er(s,e,a),i=new Ke(s.geo,r);s.at&&i.applyMatrix4(s.at),i.castShadow=i.receiveShadow=n.shadows??e!=="low";const c=r.aim;c&&(i.onBeforeRender=(l,d,u)=>c(i,u)),o.add(i)}for(const s of t.inst){if(!s.mats.length)continue;const r=Er(s,e,a),i=new yn(s.geo,r,s.mats.length);s.mats.forEach((c,l)=>i.setMatrixAt(l,c)),i.instanceMatrix.needsUpdate=!0,i.castShadow=i.receiveShadow=n.shadows??e!=="low",i.computeBoundingSphere(),o.add(i)}return o}const Bo=(t=[],e=[])=>({pieces:t,inst:e}),qt=(t,e,n=1,o,a,s)=>({geo:t,finish:e,seed:n,name:o,at:a,wear:s});function hn(t,e,n,o,a={}){const s=[];for(let l=0;l<e;l++)for(let d=0;d<n;d++)s.push(o(l,d));const r=(l,d)=>(a.wrapJ?d=(d+n)%n:d=Math.max(0,Math.min(n-1,d)),l=Math.max(0,Math.min(e-1,l)),s[l*n+d].p),i=t.p.length/3;for(let l=0;l<e;l++)for(let d=0;d<n;d++){const u=s[l*n+d],p=u.p;let f=a.nrm?.(p,l,d)??null;if(!f){let v=r(l+1,d),h=r(l-1,d),m=r(l,d+1),M=r(l,d-1),x=[v[0]-h[0],v[1]-h[1],v[2]-h[2]],g=[m[0]-M[0],m[1]-M[1],m[2]-M[2]];if(Math.hypot(g[0],g[1],g[2])<1e-9){const y=l===0?1:e-2;m=r(y,d+1),M=r(y,d-1),g=[m[0]-M[0],m[1]-M[1],m[2]-M[2]]}Math.hypot(x[0],x[1],x[2])<1e-9&&(v=r(l+1,d+1),h=r(l-1,d-1),x=[v[0]-h[0],v[1]-h[1],v[2]-h[2]]),f=[x[1]*g[2]-x[2]*g[1],x[2]*g[0]-x[0]*g[2],x[0]*g[1]-x[1]*g[0]];let w=Math.hypot(f[0],f[1],f[2]);if(w<1e-12&&(f=a.out?a.out(p,l,d):[0,1,0],w=Math.hypot(f[0],f[1],f[2])||1),f=[f[0]/w,f[1]/w,f[2]/w],a.out){const y=a.out(p,l,d);f[0]*y[0]+f[1]*y[1]+f[2]*y[2]<0&&(f=[-f[0],-f[1],-f[2]])}}t.v(p[0],p[1],p[2],f[0],f[1],f[2],u.cav??0,u.edge??0)}const c=a.wrapJ?n:n-1;for(let l=0;l<e-1;l++)for(let d=0;d<c;d++){const u=(d+1)%n,p=i+l*n+d,f=i+l*n+u,v=i+(l+1)*n+u,h=i+(l+1)*n+d;t.quad(p,f,v,h)}return i}function Vl(t){const e=tt(t*977+13),n=256,o=new Float32Array(n*n).map(()=>e()),a=(s,r)=>o[(r%n+n)%n*n+(s%n+n)%n];return(s,r)=>{const i=Math.floor(s),c=Math.floor(r),l=s-i,d=r-c,u=l*l*(3-2*l),p=d*d*(3-2*d),f=a(i,c)+(a(i+1,c)-a(i,c))*u,v=a(i,c+1)+(a(i+1,c+1)-a(i,c+1))*u;return f+(v-f)*p}}function Ss(t,e=3){const n=Array.from({length:e},(o,a)=>Vl(t+a*31));return(o,a)=>{let s=0,r=.5,i=0;for(let c=0;c<e;c++)s+=n[c](o*(1<<c)+c*17.3,a*(1<<c)-c*9.1)*r,i+=r,r*=.5;return s/i}}function ql(t,e,n,o,a,s={}){return hn(t,e,n,(r,i)=>{const c=r/(e-1)*Math.PI,l=i/n*Math.PI*2;return{p:o(c,l),cav:s.cav?.(c)??0}},{wrapJ:!0,out:r=>[r[0]-a[0],r[1]-a[1],r[2]-a[2]]})}function qi(t,e,n,o,a,s,r=0){const i=e.length;return hn(t,i,a,(c,l)=>{const d=c/(i-1),u=c,p=e[u],f=e[Math.min(i-1,u+1)].clone().sub(e[Math.max(0,u-1)]).normalize(),v=n[u].clone().sub(f.clone().multiplyScalar(n[u].dot(f))).normalize(),h=f.clone().cross(v),m=l/a*Math.PI*2,M=o(d,m),x=p.clone().addScaledVector(v,Math.cos(m)*M).addScaledVector(h,Math.sin(m)*M);return{p:[x.x,x.y,x.z],edge:r*$t(Math.abs(Math.cos(m*2)))}},{wrapJ:!0,out:(c,l)=>{const d=e[l];return[c[0]-d.x,c[1]-d.y,c[2]-d.z]}})}const _e={dialR:21.5,enamelT:.15,baseT:.25,dome:.12,chapterIn:13.25,chapterOut:20.85,recess:.045,numeralR:15.2,numeralH:3.1,numeralT:.25,trackIn:19.15,trackOut:20.15,hourIn:18.55,hole:1.15,handY:{hour:.32,minute:.62,second:.94},crystalR:22.25,crystalY:1.35,crystalT:1.2,crystalDome:1.45,caseIn:22.45,caseOut:25,caseTop:2.35,caseBottom:-6.2,lidDome:2.55,lidT:.55,hinge:{x:-25.55,y:2.2,r:.95,len:11.2},crownR:2.7,crownLen:2.9},io=t=>-.12*(t/_e.dialR)**2-(t>_e.chapterIn&&t<_e.chapterOut?_e.recess:0),s0=t=>-.12*(t/_e.dialR)**2,r0=(t,e)=>[Math.sin(t)*e,-Math.cos(t)*e],Gl=Math.PI/180;function Ul(t={}){const e=t.seed??5,n=t.detail??2,o=tt(e*131+7),a=_e.dialR,s=t.impact??[-13,.8],r=Math.atan2(-s[1],-s[0]),i=Math.hypot(s[0],s[1]),l=(t.cracks??[-145,-112,-82,null,22,55,98,140,176].map((b,P)=>b===null?r:(b+(P===2?(o()-.5)*3:(o()-.5)*7))*Gl)).map(b=>b),d=l.length,u=l.map((b,P)=>{const I=[o()*6,o()*6,o()*6,o()*6],F=.25+o()*.2,D=Math.abs(b-r)<1e-6;return J=>{const Y=ae=>Math.abs((ae%2+2)%2-1)*2-1;let oe=F*Math.sin(J*.33+I[0])+.13*Math.sin(J*1.07+I[1])+.05*Math.sin(J*3.1+I[2])+.022*Y(J*1.9+I[3])+.01*Y(J*5.3+I[0]);return oe-=F*Math.sin(I[0])+.13*Math.sin(I[1])+.05*Math.sin(I[2])+.022*Y(I[3])+.01*Y(I[0]),D&&(oe*=Co(Math.abs(J-i)/2.5)),oe*Co(J/1.6)*(P===2?.6:1)}}),p=(b,P)=>l[b%d]+(b>=d?Xe:0)+Math.atan2(u[b%d](P),Math.max(P,.4)),f=b=>{const P=Math.cos(b),I=Math.sin(b),F=s[0]*P+s[1]*I,D=s[0]*s[0]+s[1]*s[1]-a*a;return-F+Math.sqrt(F*F-D)},v=l.map(()=>[0,1].map(()=>{const b=[];for(let P=.6+o()*.5;P<36;P+=.35+o()*1.4){const I=.07+o()*.26*(o()<.1?2.2:1);b.push({c:P,w:I,h:I*(.18+o()*.32)})}return b})),h=t.shardSector??6,m=l.findIndex(b=>Math.abs(b-r)<1e-6),M={c:6.4+o()*.6,w:1.7,h:1.25},x=(b,P,I,F,D)=>{let J=0;for(const oe of v[b][P]){const ae=(I-oe.c)/oe.w;ae>-1&&ae<1&&(J=Math.max(J,oe.h*Math.sqrt(1-ae*ae)))}let Y=F?.03+J*.18:.028+J;if(D===h&&P===1){const oe=(I-M.c)/M.w;if(oe>-1&&oe<1){const ae=M.h*Math.pow(1-Math.abs(oe),.85)*(1+.12*Math.sin(I*9+e));Y=Math.max(Y,F?ae*.86:ae+.03)}}if(b===m){const oe=I-i;Math.abs(oe)<_e.hole&&(Y=Math.max(Y,Math.sqrt(_e.hole*_e.hole-oe*oe)+(F?0:.04)))}return Y},g=(b,P)=>(b===m&&Math.abs(P-i)<_e.hole?Math.sqrt(_e.hole*_e.hole-(P-i)**2):0)+.006,w=[.62,.34,.2][n],y=b=>.75+.4*Math.abs(Math.sin(b*3.7+e)*Math.sin(b*7.3)),S=(b,P)=>{const I=Math.hypot(b-s[0],P-s[1]);let F=Math.atan2(P-s[1],b-s[0]);for(let D=0;D<d;D++){const J=p(D,I),Y=p(D+1,I);let oe=F;for(;oe<J;)oe+=Xe;for(;oe>=J+Xe;)oe-=Xe;if(oe<Y)return D}return 0},R=[];for(let b=0;b<d;b++){const P=b,I=b+1,F=l[b],D=b+1<d?l[b+1]:l[0]+Xe,J=Math.max(...Array.from({length:9},(ee,j)=>f(F+(D-F)*j/8))),Y=(ee,j,X,le)=>{let xe=F+(D-F)*ee,Ce=j(xe);for(let Ee=0;Ee<4;Ee++){const Je=p(P,Ce)+X(Ce)/Math.max(Ce,.3),A=p(I,Ce)-le(Ce)/Math.max(Ce,.3);xe=Je+(A-Je)*ee,Ce=j(xe)}return[s[0]+Math.cos(xe)*Ce,s[1]+Math.sin(xe)*Ce,xe]},oe=Math.max(6,Math.ceil(J/w)),ae=Math.max(4,Math.ceil((D-F)*J/w)),G=new mn,te=[.14,.06,.02,0],V=[0,.012,.045,.1],B=2+oe+te.length,U=ee=>j=>{const X=f(j),le=y(j);return ee===0?le:ee===1?le+.09:ee<2+oe?le+.22+(X-.16-le-.22)*(ee-2)/(oe-1):X-te[ee-2-oe]},H=ee=>x(P%d,1,ee,!1,b),pe=ee=>x(I%d,0,ee,!1,b),he=ee=>x(P%d,1,ee,!0,b),ge=ee=>x(I%d,0,ee,!0,b),W=(ee,j)=>{const X=Math.hypot(ee,j),le=w*.45;for(const xe of[_e.chapterIn,_e.chapterOut])if(Math.abs(X-xe)<le){const Ce=X<xe?xe-.004:xe+.004;return[ee*Ce/X,j*Ce/X]}return[ee,j]},ie=(ee,j,X)=>{const le=Math.hypot(j,X);return ee===0?s0(le)-_e.enamelT+.03:ee===1?io(le)-.05:ee>=2+oe?io(le)-V[ee-2-oe]:io(le)};hn(G,B,ae,(ee,j)=>{const X=j/(ae-1),le=Y(X,U(ee),H,pe);let[xe,Ce]=[le[0],le[1]];ee>=2&&ee<2+oe&&([xe,Ce]=W(xe,Ce));const Ee=j===0||j===ae-1||ee===0||ee===B-1?1:0;return{p:[xe,ie(ee,xe,Ce),Ce],edge:Ee}},{out:()=>[0,1,0],nrm:(ee,j)=>{if(j<=1||j>=2+oe+1)return null;const X=_e.dome/(a*a),le=Math.hypot(2*X*ee[0],1,2*X*ee[2]);return[2*X*ee[0]/le,1/le,2*X*ee[2]/le]}});for(const ee of[0,1]){const j=ee?1:0,X=ee?pe:H,le=ee?ge:he,xe=Ce=>(X(Ce)+le(Ce))*.5+(X(Ce)-le(Ce))*.28;hn(G,B,3,(Ce,Ee)=>{const Je=Ee===0?X:Ee===1?xe:le,A=Y(j,U(Ce),ee?H:Je,ee?Je:pe),E=Math.hypot(A[0],A[1]),Z=ie(Ce,A[0],A[1]),se=s0(E)-_e.enamelT,ue=Ee===0?Z:Ee===1?se+(Z-se)*.55:se;return{p:[A[0],ue,A[1]],edge:Ee===0?1:0,cav:Ee===2?1:0}},{out:Ce=>{const Ee=Math.atan2(Ce[2]-s[1],Ce[0]-s[0])+(ee?1:-1)*Math.PI/2;return[Math.cos(Ee),.3,Math.sin(Ee)]}})}const Ae=G.geometry(),be=new mn,Se=Math.max(3,Math.round(ae/5)),Be=1+oe+1,Le=ee=>j=>{const X=f(j);return ee===0?.12:ee<=oe?.12+(X-.12)*(ee-1)/oe:X},Ve=ee=>g(P%d,ee),Ye=ee=>g(I%d,ee);for(const ee of[!0,!1])hn(be,Be,Se,(j,X)=>{const le=Y(X/(Se-1),Le(j),Ve,Ye),xe=Math.hypot(le[0],le[1]);return{p:[le[0],s0(xe)-_e.enamelT-(ee?0:_e.baseT),le[1]],edge:ee&&(X===0||X===Se-1)?1:0}},{out:()=>[0,ee?1:-1,0]});for(const ee of[0,1])hn(be,Be,2,(j,X)=>{const le=Y(ee,Le(j),Ve,Ye),xe=Math.hypot(le[0],le[1]);return{p:[le[0],s0(xe)-_e.enamelT-(X?_e.baseT:0),le[1]],edge:X?.5:1}},{out:j=>{const X=Math.atan2(j[2]-s[1],j[0]-s[0])+(ee?1:-1)*Math.PI/2;return[Math.cos(X),0,Math.sin(X)]}});hn(be,2,Se,(ee,j)=>{const X=Y(j/(Se-1),Le(Be-1),Ve,Ye),le=Math.hypot(X[0],X[1]);return{p:[X[0],s0(le)-_e.enamelT-(ee?_e.baseT:0),X[1]],edge:1}},{out:ee=>[ee[0],0,ee[2]]});const Pe=be.geometry(),Ue=[];for(let ee=0;ee<60;ee++){const j=ee%5===0,X=ee/60*Xe,le=j?_e.hourIn:_e.trackIn,xe=_e.trackOut,Ce=[le,(le+xe)/2,xe].map(se=>[Math.sin(X)*se,-Math.cos(X)*se]);if(!Ce.every(se=>S(se[0],se[1])===b)||!Ce.every(se=>{const ue=Math.hypot(se[0]-s[0],se[1]-s[1]);let T=Math.atan2(se[1]-s[1],se[0]-s[0]);const q=p(P,ue);for(;T<q;)T+=Xe;return(T-q)*ue>H(ue)+.12&&(p(I,ue)-T)*ue>pe(ue)+.12}))continue;const Je=j?.2:.07,A=xe-le,E=bn({pts:[[-Je/2,-A],[Je/2,-A],[Je/2,0],[-Je/2,0]]},[],{t:.03,bevel:j?.012:.008,segs:1}),Z=io((le+xe)/2)+.012;E.applyMatrix4(new fe().makeRotationY(-X).multiply(new fe().makeTranslation(0,Z,-le))),Ue.push(E)}const et=Ue.length?_t(Ue):null,Ie=b===(t.dropSector??3);if(Ie){const ee=new _(Math.cos(l[b]),0,Math.sin(l[b])),j=new fe().makeTranslation(s[0],0,s[1]).multiply(new fe().makeRotationAxis(ee,-(t.drop??.25)/14)).multiply(new fe().makeTranslation(-s[0],-(t.drop??.25)*.55,-s[1]));for(const X of[Ae,Pe,et])X?.applyMatrix4(j)}Ae.computeBoundingBox();const ke=Ae.boundingBox.getCenter(new _);R.push({enamel:Ae,base:Pe,ticks:et,from:F,to:D,centroid:ke,dropped:Ie})}const k=_e.hole,L=Pt([{r:k-.15,y:-.4-.05},{r:k+.32,y:-.4-.05},{r:k+.32,y:-.4},{r:k-.01,y:-.4},{r:k-.01,y:-.005},{r:k+.16,y:-.005},{r:k+.16,y:.03,smooth:!0},{r:k+.08,y:.075,smooth:!0},{r:k-.15,y:.075},{r:k-.15,y:-.4-.05}],[24,48,96][n]),C=R.flatMap((b,P)=>[qt(b.enamel,"enamel",e*10+P,`enamel-${P}`),qt(b.base,"polished",e*10+P+50,`base-${P}`),...b.ticks?[qt(b.ticks,"polished",e*10+P+80,`ticks-${P}`,void 0,.3)]:[]]);C.push(qt(L,"polished",e+3,"collar",void 0,.3));const z=(b,P)=>{const I=p(b,P);return[s[0]+Math.cos(I)*P,s[1]+Math.sin(I)*P]};return{part:Bo(C),sectors:R,impact:new _(s[0],0,s[1]),cracks:l,sectorOf:S,crackAt:z,crackLen:b=>f(l[b])}}const na=_e.numeralH,Ca=.4,W0=.19,zs=.34,ks=.13,N0=.17,Ps=.2;function $l(t){const e=(o,a,s,r,i,c)=>[[o-i/2,0],[o+i/2,0],[a+c/2,na],[a-c/2,na]];if(t==="I")return{strokes:[{pts:e(0,0,0,0,zs,zs)}],w:zs,feet:[0]};if(t==="V")return{strokes:[{pts:e(0,-.62,0,0,Ca*.75,Ca)},{pts:e(0,.62,0,0,W0*.75,W0)}],w:2*.62+Ca,feet:[-.62*.5]};const n=.66;return{strokes:[{pts:e(n,-n,0,0,Ca,Ca)},{pts:e(-n,n,0,0,W0,W0)}],w:2*n+Ca,feet:[0]}}const jl=["XII","I","II","III","IIII","V","VI","VII","VIII","IX","X","XI"];function $s(t,e={}){const n=e.detail??2,o=[],a=[...t].map(p=>$l(p)),s=a.reduce((p,f)=>p+f.w,0)+Ps*(a.length-1);let r=-s/2;const i=[];a.forEach(p=>{const f=r+p.w/2;for(const v of p.strokes)o.push(bn({pts:v.pts.map(([h,m])=>[h+f,-(m-na/2)])},[],{t:_e.numeralT,bevel:.055,segs:n?2:1}));for(const v of p.feet)i.push(f+v);r+=p.w+Ps}),r=-s/2,a.forEach(p=>{for(const f of[0,na-ks])o.push(bn({pts:[[r-N0,-(f-na/2)],[r+p.w+N0,-(f-na/2)],[r+p.w+N0,-(f+ks-na/2)],[r-N0,-(f+ks-na/2)]]},[],{t:_e.numeralT*.96,bevel:.045,segs:n?2:1}));r+=p.w+Ps});const c=_t(o);c.translate(0,_e.numeralT/2,0);const l=[i[0],i[i.length-1]],d=[-.6819999999999997,.6819999999999999],u=l.map((p,f)=>{const v=Pt([{r:0,y:-.42},{r:.085,y:-.4,smooth:!0},{r:.095,y:-.33},{r:.095,y:.02},{r:0,y:.02}],n?12:6);return v.translate(p,0,d[f]),v});return{geo:_t([c,...u]),feet:l.map((p,f)=>new _(p,0,d[f])),width:s}}function Kl(t={}){const e=t.detail??2,n=tt((t.seed??3)*71+5),o=t.loose??[4,7],a=t.fallen??9,s=[],r=[],i=[];for(let c=0;c<12;c++){const l=$s(jl[c],{detail:e}),d=c/12*Xe,u=_e.numeralR,p=io(u)+.002,f=new fe().makeRotationY(-d).multiply(new fe().makeTranslation(0,p,-u));let v=f.clone();if(o.includes(c)){const h=l.feet[c%2],m=new _(1,0,.25*(n()-.5)).normalize(),M=(c%2?1:-1)*(.2+n()*.12),x=(n()-.5)*.35,g=new fe().makeTranslation(h.x,0,h.z),w=new fe().makeTranslation(-h.x,0,-h.z);v=f.clone().multiply(g).multiply(new fe().makeRotationY(x)).multiply(new fe().makeRotationAxis(m,M)).multiply(w)}else if(c===a){const h=t.fallenAt??[-9.2,5.6],m=Math.hypot(h[0],h[1]);v=new fe().makeTranslation(h[0],io(m)+_e.numeralT+.004,h[1]).multiply(new fe().makeRotationY(.6+n())).multiply(new fe().makeRotationZ(Math.PI)).multiply(new fe().makeRotationX(.03))}i.push(v),o.includes(c)||c===a?r.push(qt(l.geo,"grained",300+c,`numeral-${c}`,v,.22)):s.push(l.geo.clone().applyMatrix4(v))}return r.unshift(qt(_t(s),"grained",299,"numerals",void 0,.22)),{part:Bo(r),at:i}}const zn=_e.crystalR,Y0=_e.crystalY,X0=t=>Y0+_e.crystalDome*(1-(Math.min(t,zn)/zn)**2),Ea=t=>{const e=X0(t)+_e.crystalT,n=.55;if(t<zn-n)return e;const o=$t((t-(zn-n))/n);return e-o*o*.32-o*.05-(t>=zn-1e-6,0)};function Yl(t={}){const e=t.detail??2,n=t.seed??11,o=tt(n*313+1),a=t.impact??[-5.2,6.4],s=(z,b=zn)=>{const P=Math.cos(z),I=Math.sin(z),F=a[0]*P+a[1]*I,D=a[0]*a[0]+a[1]*a[1]-b*b;return-F+Math.sqrt(F*F-D)},r=t.wedge??[1.95,2.45],i=z=>{const b=[o()*6,o()*6];return P=>(.18*Math.sin(P*.5+b[0])+.06*Math.sin(P*1.7+b[1])-.18*Math.sin(b[0])-.06*Math.sin(b[1]))*Co(P/1.2)*(z?1:-1)},c=i(0),l=i(1),d=(z,b)=>{const P=r[1]+Math.atan2(l(b),Math.max(b,.3)),I=r[0]+Xe+Math.atan2(c(b),Math.max(b,.3));return P+(I-P)*z},u=[.9,.5,.3][e],p=Math.ceil(zn*1.4/u),f=Math.ceil((Xe-(r[1]-r[0]))*zn*1.2/u),v=[zn-.55,zn-.4,zn-.25,zn-.1,zn],h=(z,b)=>z<p?.02+(s(b,v[0])-.02)*Math.pow(z/p,1):s(b,v[z-p]),m=p+v.length,M=(z,b)=>{let P=d(b,2),I=h(z,P);for(let F=0;F<3;F++)P=d(b,I),I=h(z,P);return[a[0]+Math.cos(P)*I,a[1]+Math.sin(P)*I,P]},x=new mn;for(const z of[!0,!1])hn(x,m,f,(b,P)=>{const I=M(b,P/(f-1)),F=Math.hypot(I[0],I[1]);return{p:[I[0],z?Ea(F):b===m-1?Y0:X0(F),I[1]],edge:b===m-1||P===0||P===f-1?1:0}},{out:()=>[0,z?1:-1,0]});hn(x,2,f,(z,b)=>{const P=M(m-1,b/(f-1));return{p:[P[0],z?Ea(zn):Y0,P[1]],edge:1}},{out:z=>[z[0],0,z[2]]});const g=x.geometry(),w=new mn;for(const z of[0,1])hn(w,m,3,(b,P)=>{const I=M(b,z),F=Math.hypot(I[0],I[1]),D=Ea(F),J=b===m-1?Y0:X0(F),Y=P===1?.05*(z?1:-1):0,oe=I[2]+(z?-1:1)*Math.PI/2;return{p:[I[0]+Math.cos(oe)*Y,P===0?D:P===1?(D+J)/2:J,I[1]+Math.sin(oe)*Y],edge:P===1?0:1,cav:P===0?1:P===1?.5:0}},{out:b=>{const P=Math.atan2(b[2]-a[1],b[0]-a[0])+(z?-1:1)*Math.PI/2;return[Math.cos(P),0,Math.sin(P)]}});const y=w.geometry(),S=new mn,R=(z,b)=>{const P=z.length;hn(S,P,2,(I,F)=>{const[D,J]=z[I],Y=Math.hypot(D,J),oe=Ea(Math.min(Y,zn))-.015,ae=X0(Math.min(Y,zn))+.015,G=z[Math.min(P-1,I+1)],te=z[Math.max(0,I-1)],V=G[0]-te[0],B=G[1]-te[1],U=Math.hypot(V,B)||1,H=(F?1:-1)*b*_e.crystalT*.5;return{p:[D-B/U*H,F?oe:ae,J+V/U*H],edge:F,cav:F}},{out:(I,F)=>{const D=z[Math.min(P-1,F+1)],J=z[Math.max(0,F-1)];return[-(D[1]-J[1]),0,D[0]-J[0]]}})},k=(z,b,P,I)=>{const F=Math.hypot(b[0]-z[0],b[1]-z[1]),D=Math.max(4,Math.ceil(F/[.6,.3,.15][e])),J=tt(I),Y=[J()*6,J()*6,J()*6],oe=-(b[1]-z[1])/F,ae=(b[0]-z[0])/F,G=[];for(let te=0;te<=D;te++){const V=te/D,B=V*F,U=(P*Math.sin(B*.45+Y[0])+P*.35*Math.sin(B*1.6+Y[1])+P*.12*Math.sin(B*5.1+Y[2]))*Math.sin(Math.PI*V)**.5;G.push([z[0]+(b[0]-z[0])*V+oe*U,z[1]+(b[1]-z[1])*V+ae*U])}return G},L=t.rays??10;for(let z=0;z<L;z++){let b=(z+.3+o()*.5)/L*Xe;b>r[0]-.12&&b<r[1]+.12&&(b+=.35);const P=s(b),I=z%3!==1,F=I?P-.02:P*(.3+o()*.45);R(k([a[0]+Math.cos(b)*.25,a[1]+Math.sin(b)*.25],[a[0]+Math.cos(b)*F,a[1]+Math.sin(b)*F],.25,n*7+z),(o()-.5)*.35)}for(const[z,b,P]of[[-2.55,.35,1],[-.9,2.05,2]]){const I=[Math.cos(z)*(zn-.02),Math.sin(z)*(zn-.02)],F=[Math.cos(b)*(zn-.02),Math.sin(b)*(zn-.02)];R(k(I,F,.9,n*13+P),(o()-.5)*.25)}const C=S.geometry();return{part:Bo([qt(g,"glass",n,"crystal"),qt(y,"glassEdge",n+1,"crystal-edge"),qt(C,"crack",n+2,"crystal-cracks")]),impact:new _(a[0],Ea(Math.hypot(a[0],a[1])),a[1])}}const Mo=-1.5,Xl=(t,e,n,o)=>t.applyMatrix4(new fe().makeTranslation(e,n,o).multiply(new fe().makeRotationZ(-Math.PI/2))),Wr=(t,e,n,o)=>t.applyMatrix4(new fe().makeTranslation(e,n,o).multiply(new fe().makeRotationX(-Math.PI/2)));function Zl(t,e,n,o,a,s){const r=t.getAttribute("position"),i=t.getAttribute("normal"),c=tt(s),l=[c()*Xe,c()*Xe];for(let d=0;d<r.count;d++){const u=r.getX(d),p=r.getY(d),f=r.getZ(d),v=Math.hypot(u,f);if(p<n||p>o||v<_e.caseOut-.9)continue;const h=Math.atan2(f,u),m=Math.sin(Math.PI*(p-n)/(o-n))**.35,M=1-.85*Math.exp(-(((p-(n+o)/2)/((o-n)*.22))**2))*(.55+.45*Math.sin(h*2+l[0])*Math.sin(h*5+l[1])),x=h*e/Xe,g=x-Math.floor(x),w=Math.pow(Math.sin(Math.PI*g),2),y=2*Math.sin(Math.PI*g)*Math.cos(Math.PI*g)*Math.PI*e/Xe,S=a*m*M,R=v-S*(1-w);r.setX(d,u/v*R),r.setZ(d,f/v*R);const k=S*y/v,L=-Math.sin(h),C=Math.cos(h),z=i.getX(d)-L*k,b=i.getY(d),P=i.getZ(d)-C*k,I=Math.hypot(z,b,P);i.setXYZ(d,z/I,b/I,P/I)}return r.needsUpdate=i.needsUpdate=!0,t}function Ql(t,e){const n=t.getAttribute("position"),o=t.getAttribute("normal");for(let a=0;a<n.count;a++){let s=0,r=0,i=0;for(const[f,v,h,m]of e){const M=n.getX(a)-f,x=n.getZ(a)-v,g=m*Math.exp(-(M*M+x*x)/(h*h));s-=g,r+=2*M/(h*h)*g,i+=2*x/(h*h)*g}if(Math.abs(s)<1e-6)continue;n.setY(a,n.getY(a)+s);const c=o.getY(a),l=c>=0?1:-1,d=o.getX(a)-r*l,u=o.getZ(a)-i*l,p=Math.hypot(d,c,u);o.setXYZ(a,d/p,c/p,u/p)}return n.needsUpdate=o.needsUpdate=!0,t}function Jl(t,e){const n=[],o=[],a=e.open??0,s=e.n,r=!a;for(let i=0;i<=s&&!(r&&i===s);i++){const c=a+(Xe-2*a)*i/s,l=new _(e.a*Math.cos(c),e.b*.45*Math.sin(2*c)*.35+(a?Math.sin(c)*.5*(c>Math.PI?1:0):0),e.b*Math.sin(c)).applyMatrix4(e.at);n.push(l),o.push(new _(0,1,0).transformDirection(e.at))}if(r&&(n.push(n[0].clone()),o.push(o[0].clone())),qi(t,n,o,()=>e.r,e.segs,!1,.5),a)for(const i of[0,n.length-1]){const c=n[i],l=new ua(e.r*.98,10,6);l.translate(c.x,c.y,c.z);const d=l.getAttribute("position"),u=l.getAttribute("normal"),p=l.index,f=t.p.length/3;for(let v=0;v<d.count;v++)t.v(d.getX(v),d.getY(v),d.getZ(v),u.getX(v),u.getY(v),u.getZ(v),0,.6);for(let v=0;v<p.count;v+=3)t.tri(f+p.getX(v),f+p.getX(v+1),f+p.getX(v+2))}}function eu(t={}){const e=t.detail??2,n=t.seed??21,o=tt(n*17+3),a=[180,720,1440][e],s=[16,28,48][e],r=_e.caseTop,i=_e.caseBottom,c=(Ie,ke,ee=!1)=>({r:Ie,y:ke,smooth:ee}),l=9,u=[...Array.from({length:l},(Ie,ke)=>{const ee=ke/(l-1),j=ee*23.3;return c(j,i+1.45*(j/23.3)**2,ke>0&&ke<l-1)}),c(23.55,-4.62),c(23.62,-4.48),c(23.9,-4.4),c(24.45,-4.1,!0),c(24.85,-3.45,!0),c(25,-2.4,!0),c(25.02,-1.4,!0),c(24.95,-.4,!0),c(24.75,.4,!0),c(24.4,.95),c(24,1.12),c(23.85,1.3),c(23.6,1.85,!0),c(23.15,2.22,!0),c(22.65,2.38),c(22.08,2.42),c(22.05,2.28),c(22.32,2.12),c(22.32,-.35),c(21.4,-.42),c(21.35,-1.3),c(20.6,-1.3)],p=Zl(Pt(u,a),e===2?360:e===1?180:1,-3.7,.55,e?.085:0,n),f=_e.hinge,v=5,h=.1,m=(f.len-h*(v-1))/v,M=Ie=>{const ke=Pt([c(0,0),c(f.r-.1,0),c(f.r,.1),c(f.r,m-.1),c(f.r-.1,m),c(.33,m),c(.33,m+.001),c(0,m+.001)],s);return Wr(ke,f.x,f.y,Ie+m)},x=[],g=[];for(let Ie=0;Ie<v;Ie++){const ke=-5.6+Ie*(m+h),ee=M(ke);(Ie%2===0?x:g).push(ee);const j=bn({pts:[[-.55,0],[.55,0],[.55,m-.06],[-.55,m-.06]]},[],{t:.7,bevel:.12,segs:1});j.applyMatrix4(new fe().makeTranslation(f.x+.75,Ie%2===0?f.y-.62:f.y+.55,ke+.03).multiply(new fe().makeRotationZ(Ie%2===0?-.5:.35)).multiply(new fe().makeRotationX(Math.PI/2).premultiply(new fe().makeTranslation(0,.35,0)))),(Ie%2===0?x:g).push(j)}const w=Wr(Pt([c(0,-.12),c(.22,-.1,!0),c(.31,-.02),c(.31,f.len+.02),c(.22,f.len+.1,!0),c(0,f.len+.12)],s),f.x,f.y,f.len/2),y=Pt([c(0,0),c(2.35,0),c(2.1,.35,!0),c(1.72,.9,!0),c(1.6,1.6),c(1.62,2.5),c(1.95,2.6),c(1.98,3.15,!0),c(1.7,3.3),c(1.3,3.35),c(0,3.36)],s*2);Xl(y,24.55,Mo,0);const S=[-1,1].map(Ie=>Pt([c(0,0),c(.5,0),c(.5,.25,!0),c(.38,.38,!0),c(0,.4)],s).applyMatrix4(new fe().makeTranslation(27.1,Mo,Ie*1.6).multiply(new fe().makeRotationX(Ie*-Math.PI/2)))),R=new mn,k=_e.crownR,L=_e.crownLen,C=27.95,z=30,b=z*[4,6,10][e],P=Ie=>{const ke=Ie*L;return{r:ke<.25?k*.8+(k-k*.8)*ke/.25:ke>L-.35?k-(ke-(L-.35))**2*3.2:k,f:$t(Math.min((ke-.2)/.25,(L-.25-ke)/.25))}},I=[10,18,30][e];hn(R,I,b,(Ie,ke)=>{const ee=Ie/(I-1),j=ke/b*Xe,X=P(ee),le=j*z/Xe%1,xe=Math.pow(Math.sin(Math.PI*le),.7),Ce=X.r-.2*X.f*(1-xe);return{p:[C+ee*L,Mo+Math.cos(j)*Ce,Math.sin(j)*Ce],edge:X.f*xe>.9?1:0,cav:X.f*(1-xe)>.8?1:0}},{wrapJ:!0,out:Ie=>[0,Ie[1]-Mo,Ie[2]]});const F=Pt([c(0,0),c(k-.38,0),c(k-.62,.14,!0),c(1,.22,!0),c(0,.25)],s*2).applyMatrix4(new fe().makeTranslation(C+L-.02,Mo,0).multiply(new fe().makeRotationZ(-Math.PI/2))),D=_t([R.geometry(),F]),J=new mn,Y=31.6,oe=4.9,ae=4.15,G=2.4,te=[],V=[],B=.66,U=[60,120,220][e];for(let Ie=0;Ie<=U;Ie++){const ke=Math.PI+B+(Xe-2*B)*Ie/U,ee=Math.cos(ke),j=Math.sin(ke);te.push(new _(Y+oe*Math.sign(ee)*Math.abs(ee)**(2/G),Mo,ae*Math.sign(j)*Math.abs(j)**(2/G))),V.push(new _(0,1,0))}te.unshift(new _(27.1,Mo,-1.95)),V.unshift(new _(0,1,0)),te.push(new _(27.1,Mo,1.95)),V.push(new _(0,1,0)),qi(J,te,V,Ie=>.6*(1-.38*Math.exp(-(((Ie-.5)/.07)**2))),[10,16,24][e],!1,.5);const H=J.geometry(),pe=new mn;if(t.chain!==!1){const Ie=Y+oe;[[Ie+1.95,Mo-.15,.25,0,.12,0],[Ie+5.4,Mo-.55,.6,1.45,.18,0],[Ie+8.75,Mo-1.4,1.2,.25,-.22,.5]].forEach(([ee,j,X,le,xe,Ce])=>{const Ee=new fe().makeTranslation(ee,j,X).multiply(new fe().makeRotationFromEuler(new Bn(le,o()*.25-.12,xe)));Jl(pe,{a:2.55,b:1.55,r:.42,at:Ee,open:Ce,segs:[8,12,18][e],n:[36,64,110][e]})})}const he=pe.geometry(),ge=_e.lidDome,W=_e.lidT,ie=22,ye=[c(25.12,.5),c(24.95,.85,!0),...Array.from({length:ie},(Ie,ke)=>{const ee=1-(ke+1)/ie,j=ee*24.6;return c(j,.95+(ge+.2-.95)*(1-(j/24.6)**2),ke<ie-1)})],Ae=Array.from({length:ie},(Ie,ke)=>{const ee=ke/(ie-1)*24.15;return c(ee,.4+(ge+.2-W-.4)*(1-(ee/24.15)**2),ke>0&&ke<ie-1)}),be=[c(24.15,.4),c(24.15,.08),c(24.3,0),c(25.05,0),c(25.12,.08),c(25.12,.5)],Se=Ql(Pt(ye,a>>1),[[9.5,11.5,1.9,.2],[-13,-10.5,1.2,.14]]),Be=Pt(Ae,a>>2),Le=Pt(be,a>>1),Ve=bn({pts:[[-.3,-1.1],[.4,-1.1],[.4,1.1],[-.3,1.1]]},[],{t:.62,bevel:.12,segs:1});Ve.translate(24.95,-.22,0);const Ye=new fe().makeTranslation(0,r,0),Pe=m0.degToRad(t.lidAngle??0),Ue=new fe().makeTranslation(f.x,f.y,0).multiply(new fe().makeRotationZ(Pe)).multiply(new fe().makeTranslation(25.55,-2.2,0)).multiply(Ye),et=new fe().makeTranslation(f.x,f.y,0).multiply(new fe().makeRotationZ(Pe)).multiply(new fe().makeTranslation(25.55,-2.2,0));return{part:Bo([qt(p,"polished",n,"case-body",void 0,.3),qt(_t([...x,...S]),"polished",n+1,"case-hinge",void 0,.28),qt(w,"polished",n+2,"hinge-pin",void 0,.3),qt(_t([y]),"turned",n+3,"pendant",void 0,.28),qt(D,"polished",n+4,"crown",void 0,.3),qt(H,"polished",n+5,"bow",void 0,.26),...t.chain!==!1?[qt(he,"polished",n+6,"chain",void 0,.3)]:[],qt(Se,"guilloche",n+7,"lid-outside",Ue,.24),qt(Be,"polishedIn",n+8,"lid-inside",Ue,.15),qt(_t([Le,Ve]),"polished",n+9,"lid-rim",Ue,.24),qt(_t(g),"polished",n+10,"lid-hinge",et,.28)]),lid:Ue,hinge:new _(f.x,f.y,0)}}function Nr(t){const e=t.detail??2,n=t.t??.1,o=t.ridge??.13,a=new mn,s=t.rb*.55,r=t.rb+.9,i=t.L,c=M=>{if(M<=r)return .2+.06*(1-$t((M-s)/(r-s)));const x=(M-r)/(i-r);return Math.max(.012,.2*(1-x)**2+t.wMax/2*Math.pow(Math.sin(Math.PI*Math.pow(x,.78)),.9)*(1-x*.15))},l=[80,140,240][e],d=[3,6,10][e],u=M=>s+(i-s)*(1-(1-M/(l-1))**1.25),p=M=>n*.45+(n*.55+o-n)*(1-Math.pow(Math.abs(M),1.4));for(const M of[-1,1])hn(a,l,d,(x,g)=>{const w=u(x),y=M*g/(d-1),S=c(w),R=$t((i-w)/.25);return{p:[y*S,p(y)*(.4+.6*R),-w],edge:g===d-1?1:g===0?.6:0}},{out:()=>[0,1,0]});const f=M=>hn(a,l,2,(x,g)=>{const w=u(x),y=c(w),S=$t((i-w)/.25);return{p:[M*y,g?p(1)*(.4+.6*S):0,-w],edge:g?1:.4}},{out:()=>[M,0,0]});f(-1),f(1),hn(a,l,2,(M,x)=>{const g=u(M),w=c(g);return{p:[(x?1:-1)*w,0,-g]}},{out:()=>[0,-1,0]});const v=a.geometry(),h=[24,40,72][e],m=Pt([{r:t.hole,y:0},{r:t.rb,y:0},{r:t.rb,y:n*.7},{r:t.rb-.06,y:n+.05,smooth:!0},{r:t.hole+.08,y:n+.07},{r:t.hole,y:n+.02},{r:t.hole,y:0}],h);return _t([v,m])}function tu(t={}){const e=t.detail??2,n=t.L??19.9,o=.55,a=3.6,s=.085,r=g=>{const w=$t(g);return w*w*(3-2*w)},i=g=>{let w=0;if(g>=0&&g<=n&&(w=Math.max(w,(.15-.1*g/n)*Math.pow($t((n-g)/1.1),.62))),Math.abs(g)<o&&(w=Math.max(w,Math.sqrt(o*o-g*g))),g<=0&&g>=-a){const y=-g/a;w=Math.max(w,.16+.2*Math.pow(y,1.4)*(1-r((y-.82)/.18))+.04*(1-r((y-.82)/.18))*y)}return Math.max(w,1e-4)},c=[],l=[260,520,900][e];for(let g=0;g<=l;g++){const w=g/l;c.push(-a+(n+a)*(1-(1-w)**1.6))}const d=c.length,u=[3,5,7][e],p=g=>s*(.55+.45*$t((n-g)/2.5)),f=g=>.018*Math.pow($t((g-(n-.12))/.12),2),v=(g,w)=>{const y=Math.abs(w);return p(g)*(y>.92?.42:.42+.58*(.92-y)/.92)+f(g)},h=new mn;for(const g of[-1,1])hn(h,d,u,(w,y)=>{const S=c[w],R=g*y/(u-1);return{p:[R*i(S),v(S,R),-S],edge:y===u-1?1:y===0?.8:0}},{out:()=>[0,1,0]});const m=g=>hn(h,d,2,(w,y)=>{const S=c[w];return{p:[g*i(S),y?v(S,1):f(S),-S],edge:y?1:.4}},{out:()=>[g,0,0]});m(-1),m(1),hn(h,d,2,(g,w)=>{const y=c[g];return{p:[(w?1:-1)*i(y),f(y),-y]}},{out:()=>[0,-1,0]});const M=h.geometry(),x=Pt([{r:.13,y:0},{r:.36,y:0},{r:.36,y:.085},{r:.3,y:.2},{r:.22,y:.32,smooth:!0},{r:.13,y:.33}],[20,32,56][e]);return x.translate(0,.07,0),{needle:M,collet:x}}function nu(t={}){const e=t.detail??2,n=[20,36,64][e],o=(c,l)=>new fe().makeTranslation(0,l,0).multiply(new fe().makeRotationY(-c)),a=Nr({L:10.6,wMax:1.55,rb:1.25,hole:.62,detail:e}),s=Nr({L:16.2,wMax:1.15,rb:.95,hole:.36,t:.09,ridge:.11,detail:e}),r=tu({detail:e}),i=_t([Pt([{r:.62,y:-.4},{r:.64,y:_e.handY.hour+.02},{r:.6,y:_e.handY.hour+.14,smooth:!0},{r:.45,y:_e.handY.hour+.15},{r:.45,y:-.4}],n),Pt([{r:.36,y:-.4},{r:.37,y:_e.handY.minute+.05},{r:.34,y:_e.handY.minute+.16,smooth:!0},{r:.3,y:_e.handY.minute+.21,smooth:!0},{r:.14,y:_e.handY.minute+.22},{r:.14,y:-.4}],n),Pt([{r:.13,y:-.4},{r:.13,y:_e.handY.second+.42},{r:.1,y:_e.handY.second+.5,smooth:!0},{r:.04,y:_e.handY.second+.53,smooth:!0},{r:0,y:_e.handY.second+.535}],n)]);return Bo([qt(a,"polished",401,"hand-hour",o(t.hour??4.9,_e.handY.hour),.25),qt(s,"polished",402,"hand-minute",o(t.minute??1.15,_e.handY.minute),.25),qt(r.needle,"lacquer",403,"hand-second",o(t.second??.64,_e.handY.second),.25),qt(r.collet,"polished",404,"hand-collet",o(t.second??.64,_e.handY.second),.25),qt(i,"polished",405,"hand-pipes",void 0,.25)])}const Z0=(t,e)=>{const n=(t*t+e*e)/(2*e);return{c:e-n,R:n}};function ou(t,e,n){const o=new mn,a=tt((t.seed??1)*59+7),s=[a()*Xe,a()*Xe,a()*Xe],r=t.lean??0;return ql(o,e,n,(c,l)=>{const d=1+.025*Math.sin(l*2+s[0])+.015*Math.sin(l*3+s[1]);if(c<Math.PI*.3){const M=c/(Math.PI*.3),x=t.r*d*M;return[Math.cos(l)*x,0,Math.sin(l)*x]}const p=(c-Math.PI*.3)/(Math.PI*.7)*Math.PI/2,f=t.r*d*Math.cos(p)*(1+.12*Math.sin(p*2)*(t.h>t.r?1:.4));let v=t.h*Math.sin(p);const h=t.dimple??0;if(h){const M=f/t.r;v-=h*t.h*Math.exp(-M*M/.06)}const m=r*Math.sin(p)*t.h*.25;return[Math.cos(l)*f+m,v,Math.sin(l)*f]},[0,t.h*.4,0],{cav:c=>c<Math.PI*.3?1:$t(1-(c-Math.PI*.3)*6)}),o.geometry()}const au=[.28,.5,.85];function Q0(t,e=!1){return ou({r:1,h:e?.42:.7,seed:e?9:3},[6,9,12][t],[10,14,20][t])}function J0(t,e,n=1,o=au){const a=tt(n*131+3),s=o.map(()=>[]);let r=0;for(;s.reduce((i,c)=>i+c.length,0)<t&&r++<t*8;){const i=e(a(),a());if(!i)continue;const c=a()<.62?0:a()<.75?1:2,l=o[c]*(.8+a()*.4),d=new Wt().setFromUnitVectors(new _(0,1,0),i.up.clone().normalize()).multiply(new Wt().setFromAxisAngle(new _(0,1,0),a()*Xe));s[c].push(new fe().compose(i.p,d,new _(l*(1+a()*.2),l*(.85+a()*.3),l)))}return s}function Gi(t={}){const e=t.detail??2,n=t.seed??21,o=tt(n*97+5),a=t.cols??7,s=t.rows??8,[r,i]=t.sett??[150,95],c=t.joint??9,l=t.hollow?.x??20,d=t.hollow?.z??15,u=t.hollow?.r??260,p=t.hollow?.depth??16,f=(V,B)=>-p*Co(1-Math.hypot(V-l,B-d)/u),v=-p*(t.water??.3),h=Ss(n+3,3),m=Ss(n+9,2),M=a*(r+c),x=s*(i+c),g=new mn,w=new mn,y=[],S=[5,10,18][e],R=[4,8,12][e],k=[],L=o()*6;for(let V=-x/2;V<x/2-i*.4;){const B=i*(.72+o()*.55),U=o()*6;for(let H=-M/2-o()*r*.8;H<M/2;){const pe=r*(.55+o()*.6),he=H+pe/2,ge=Math.sin(he*.004+L)*16+Math.sin(he*.011+U)*2.5,W=Math.cos(he*.004+L)*16*.004;he-pe/2>-M/2-1&&he+pe/2<M/2+1&&k.push({cx:he,cz:V+B/2+ge,w:pe,dd:B*(.88+o()*.12),rot:Math.atan(W)+(o()-.5)*.07}),H+=pe+c*(.7+o()*1.6)}V+=B+c*(.8+o()*1.2)}for(const V of k){const B=V.w,U=V.dd,H=V.cx+(o()-.5)*3,pe=V.cz+(o()-.5)*3,he=V.rot,ge=f(H,pe)+(o()-.5)*5,W=6,ie=(f(H+W,pe)-f(H-W,pe))/(2*W)*.8+(o()-.5)*.012,ye=(f(H,pe+W)-f(H,pe-W))/(2*W)*.8+(o()-.5)*.012,Ae=.4+o()*1.3,be=o()*100,Se=3.5+o()*9;y.push({cx:H,cz:pe,y:ge,gx:ie,gz:ye,w:B,dd:U});const Be=Math.cos(he),Le=Math.sin(he),Ve=(ke,ee,j)=>[H+ke*Be-ee*Le,ge+j+ie*ke+ye*ee,pe+ke*Le+ee*Be],Ye=S+4,Pe=R+4,Ue=(ke,ee,j)=>{const X=ee+4,le=ke<=X/2?ke:X-ke,xe=ke<=X/2?-1:1;if(le===0)return{x:xe*(j-3),y:-32,rim:2};if(le===1)return{x:xe*j,y:-Se*.55,rim:1};if(le===2)return{x:xe*(j-Se*.32),y:-Se*.12,rim:.5};const Ce=(ke-3)/(ee-2);return{x:-j+Se+(2*j-2*Se)*Ce,y:0,rim:0}};hn(g,Ye+1,Pe+1,(ke,ee)=>{const j=Ue(ke,S,B/2),X=Ue(ee,R,U/2),le=Math.max(j.rim,X.rim),xe=j.x/(B/2),Ce=X.x/(U/2),Ee=Ae*(1-Math.pow(Math.abs(xe),3))*(1-Math.pow(Math.abs(Ce),3)),Je=j.x+be,A=X.x-be,E=(h(Je*.025,A*.025)-.5)*2.4+(h(Je*.11+5,A*.11)-.5)*.5,Z=le>0&&le<2?-Math.max(0,m(Je*.04+A*.04,Je*.02-A*.03)-.55)*18:0;let se=Math.min(j.y,X.y)+(le<2?Ee*(le?.5:1)+E*(le?.4:1):0)+Z-(j.rim>0&&X.rim>0&&le<2?Se*.35:0);return{p:Ve(j.x,X.x,se),cav:le>=2?1:0,edge:le===1||le===.5?$t(1-Z*-.1):0}},{out:ke=>{const ee=[ke[0]-H,ke[1]-(ge-30),ke[2]-pe];return[ee[0]/B,ee[1]/20,ee[2]/U]}});const et=ge-Se*.55;if(Math.hypot(H-l,pe-d)<u*1.1&&et+ie*0>v-25&&ge-32<v){const ke=[],ee=[12,24,40][e];for(let j=0;j<ee;j++){const X=j/ee*4,le=X%1,xe=Math.floor(X),Ce=xe===0?-B/2+B*le:xe===1?B/2:xe===2?B/2-B*le:-B/2,Ee=xe===0?-U/2:xe===1?-U/2+U*le:xe===2?U/2:U/2-U*le;ke.push([Ce,Ee])}hn(w,3,ee,(j,X)=>{const[le,xe]=ke[X],Ce=Math.hypot(le/(B/2),xe/(U/2))||1,Ee=[j*1.4*le/(B/2)/Ce,j*1.4*xe/(U/2)/Ce],Je=Ve(le+Ee[0],xe+Ee[1],0);return{p:[Je[0],v+[1.1,.3,.02][j],Je[2]],cav:j/2,edge:0}},{wrapJ:!0,out:()=>[0,1,0]})}}const C=g.geometry(),z=[24,48,80][e],b=new mn,P=Ss(n+17,3);hn(b,z,z,(V,B)=>{const U=-M/2+M*B/(z-1),H=-x/2+x*V/(z-1);return{p:[U,f(U,H)-3.5+(P(U*.08,H*.08)-.5)*4,H],cav:1}},{out:()=>[0,1,0]});const I=b.geometry();let F=0;for(let V=0;V<u;V+=2)-p*Co(1-V/u)-3.5<v&&(F=V);F=Math.max(F+20,40);const D=new mn,J=[6,12,20][e],Y=[24,48,72][e];hn(D,J,Y,(V,B)=>{const U=F*V/(J-1),H=B/Y*Xe;return{p:[l+Math.cos(H)*U,v,d+Math.sin(H)*U]}},{wrapJ:!0,out:()=>[0,1,0],nrm:()=>[0,1,0]});const oe=D.geometry(),ae=Array.from({length:t.ripples??7},()=>{const V=o()*Xe,B=Math.sqrt(o())*F*.8;return{x:l+Math.cos(V)*B,z:d+Math.sin(V)*B,phase:o(),speed:.8+o()*.5}}),G=[qt(C,"stone",n,"setts"),qt(I,"stone",n+1,"joints"),qt(oe,"puddle",n+2,"puddle")];w.p.length&&G.push(qt(w.geometry(),"water",n+3,"meniscus"));const te=(V,B)=>{let U=f(V,B);for(const H of y)Math.abs(V-H.cx)<H.w/2&&Math.abs(B-H.cz)<H.dd/2&&(U=H.y+H.gx*(V-H.cx)+H.gz*(B-H.cz)+2);return U};return{part:Bo(G),water:{y:v,x:l,z:d,r:F},ripples:ae,topAt:te}}const su=`
attribute float aCav;
attribute float aEdge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;`,ru=`
vCav = aCav;
vEdge = aEdge;
vOP = position;
vON = normal;
#ifdef USE_INSTANCING
vOP += instanceMatrix[3].xyz * 0.731;
#endif`,iu=`
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;
uniform sampler2D tNz;
uniform vec3 uSeed;
vec2 h22(vec2 p) { vec3 a = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); a += dot(a, a.yzx + 33.33); return fract((a.xx + a.yz) * a.zy); }
float h12(vec2 p) { vec3 a = fract(vec3(p.xyx) * 0.1031); a += dot(a, a.yzx + 33.33); return fract((a.x + a.y) * a.z); }
float bl(float period, float fw) { return 1.0 - smoothstep(0.3, 0.85, fw / period); }
vec3 triW(vec3 n) { vec3 w = ((abs(n)) * (abs(n)) * (abs(n)) * (abs(n))); return w / (w.x + w.y + w.z); }
vec4 tri(sampler2D t, vec3 p, vec3 w) { return texture2D(t, p.yz) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.xy) * w.z; }
vec3 cell(vec2 p) {
  vec2 c = floor(p);
  float f1 = 8.0;
  float f2 = 8.0;
  vec2 id = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = c + vec2(float(i), float(j));
    vec2 o = g + 0.15 + 0.7 * h22(g);
    float d = length(p - o);
    if (d < f1) { f2 = f1; f1 = d; id = g; } else if (d < f2) { f2 = d; }
  }
  return vec3(f2 - f1, h12(id + 7.0), h12(id + 3.1));
}
vec3 bumpN(vec3 pos, vec3 n, vec2 dH, float fd) {
  vec3 sx = dFdx(pos);
  vec3 sy = dFdy(pos);
  vec3 r1 = cross(sy, n);
  vec3 r2 = cross(n, sx);
  float det = dot(sx, r1) * fd;
  vec3 g = sign(det) * (dH.x * r1 + dH.y * r2);
  return normalize(abs(det) * n - g);
}`;function fr(t){t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${su}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${ru}`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
${iu}`)}function xs(t,e){t.fragmentShader=t.fragmentShader.replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= ${e.toFixed(3)};
iblIrradiance *= ${e.toFixed(3)};
#ifdef USE_CLEARCOAT
clearcoatRadiance *= ${e.toFixed(3)};
#endif`)}const cu=.3,lu=`
float eQz = 0.0;
float eQl = 0.0;
float fw = max(max(length(dFdx(vOP)), length(dFdy(vOP))), 1e-6);
float face = smoothstep(0.55, 0.85, vON.y);
vec2 q = vOP.xz + uSeed.xy;
vec3 c1 = cell(q * 2.4);
float craz = (1.0 - smoothstep(0.0, fwidth(c1.x) * 1.0 + 0.0015, c1.x)) * bl(1.0 / 2.4, fw * 1.4);
vec3 c2 = cell(q * 0.8 + 3.0);
float craz2 = (1.0 - smoothstep(0.0, fwidth(c2.x) * 1.15 + 1e-5, c2.x)) * bl(1.0 / 0.8, fw);
float reg = texture2D(tNz, q * 0.031).g;
float near = exp(-length(vOP.xz - uImpact) / 7.0);
craz *= smoothstep(0.6, 0.75, reg + near * 0.55) * step(0.3, c1.z) * smoothstep(0.42, 0.55, texture2D(tNz, q * 0.9 + 0.13).g);
craz *= smoothstep(0.42, 0.52, texture2D(tNz, q * 2.9 + 0.71).g);
craz2 *= smoothstep(0.4, 0.5, texture2D(tNz, q * 1.1 + 0.37).r);
float cz = max(craz, craz2 * step(0.45, c2.z) * smoothstep(0.45, 0.6, texture2D(tNz, q * 0.35 + 0.5).b)) * face;
float czH = 0.0;
if (uEMode > 0.5 && uEMode < 1.5) {
  float m1 = smoothstep(0.6, 0.75, reg + near * 0.55) * step(0.3, c1.z) * smoothstep(0.42, 0.55, texture2D(tNz, q * 0.9 + 0.13).g) * smoothstep(0.42, 0.52, texture2D(tNz, q * 2.9 + 0.71).g);
  float m2 = smoothstep(0.4, 0.5, texture2D(tNz, q * 1.1 + 0.37).r) * step(0.45, c2.z) * smoothstep(0.45, 0.6, texture2D(tNz, q * 0.35 + 0.5).b);
  float cW = 1.0 + 2.5 * cFall(length(vOP.xz - uCFront));
  eQl = max((1.0 - smoothstep(0.0, fwidth(c1.x) * 1.2 * cW + 1e-5, c1.x)) * bl(1.0 / 2.4, fw * 1.4) * m1, (1.0 - smoothstep(0.0, fwidth(c2.x) * 1.2 * cW + 1e-5, c2.x)) * bl(1.0 / 0.8, fw) * m2) * face;
  czH = max(exp(-c1.x / (fwidth(c1.x) * 1.1 * cW + 1e-5)) * bl(1.0 / 2.4, fw * 1.4) * m1, exp(-c2.x / (fwidth(c2.x) * 1.1 * cW + 1e-5)) * bl(1.0 / 0.8, fw) * m2) * face;
}
float lit = step(0.94, c1.y) * craz * face;
float dustS = texture2D(tNz, q * 2.3 + 0.61).g;
float dustM = smoothstep(0.8, 0.9, texture2D(tNz, q * 0.21 + 0.31).b * 0.6 + texture2D(tNz, q * 0.9 + 0.1).g * 0.4 + vCav * 0.25) * smoothstep(0.62, 0.7, dustS) * face;
float dustF = texture2D(tNz, q * 1.7).r;
float tideN = texture2D(tNz, q * 0.11 + 0.7).r;
float tideW = fwidth(tideN) * 0.7 + 0.002;
float tide = (1.0 - smoothstep(0.0, tideW, abs(tideN - 0.53))) * smoothstep(0.7, 0.8, texture2D(tNz, q * 0.027 + 0.2).g) * face;
float rr = length(vOP.xz);
float stepD = min(abs(rr - ${_e.chapterIn.toFixed(3)}), abs(rr - ${_e.chapterOut.toFixed(3)}));
float chL = (1.0 - smoothstep(0.0, max(fwidth(rr) * 1.3, 0.004), stepD)) * face;
float col = mix(0.03, 0.0012, face);
col = mix(col, 0.01 + 0.025 * smoothstep(0.7, 0.9, dustF), dustM * 0.6);
col = mix(col, 0.012, tide * 0.5);
lit *= 1.0 - step(1.5, uEMode);
col = mix(col, 0.16, lit * 0.8);
col = mix(col, 0.0, chL * 0.6);
col = mix(col, 0.0012, step(1.5, uEMode) * max(tide * 0.5, dustM * 0.6) * face);
vec3 ecol = vec3(col);
if (uEMode > 0.5 && uEMode < 1.5) {
  vec3 c3 = cell(q * 19.0 + 11.0 + vec2(texture2D(tNz, q * 0.7).r, texture2D(tNz, q * 0.7 + 0.4).g) * 0.8);
  float qz = (1.0 - smoothstep(0.0, fwidth(c3.x) * 0.9 + 0.0006, c3.x)) * bl(1.0 / 19.0, fw * 1.2) * face;
  float qe = smoothstep(fwidth(c3.x) * 0.9, fwidth(c3.x) * 2.2 + 1e-5, c3.x) * (1.0 - smoothstep(fwidth(c3.x) * 2.2, fwidth(c3.x) * 3.4 + 1e-5, c3.x)) * bl(1.0 / 19.0, fw * 1.2) * face;
  float iv = 0.0015 * (0.85 + 0.3 * texture2D(tNz, q * 0.4 + 0.2).g);
  ecol = mix(vec3(col), vec3(iv) * vec3(1.0, 0.95, 0.86), face * (1.0 - dustM * 0.4));
  ecol = mix(ecol, vec3(0.0015), max(qz, cz) * 0.9);
  ecol += vec3(0.004, 0.0039, 0.0036) * qe * smoothstep(0.35, 0.9, texture2D(tNz, q * 0.6 + 0.27).b);
  eQz = max(qz, qe * 0.6);

  ecol *= 1.0 - clamp(uCGlow, 0.0, 1.0) * clamp(czH * 2.6, 0.0, 1.0) * 0.97;

}
diffuseColor.rgb = ecol;
float eRough = mix(0.75, 0.3, face);
eRough = mix(eRough, 0.6, max(dustM * 0.6, tide * 0.6));
eRough = mix(eRough, 0.45, lit);
float eCoat = face * (1.0 - max(cz, eQz) * 0.92) * (1.0 - dustM * 0.75) * (1.0 - tide * 0.8) * (1.0 - chL * 0.7);
float eCoatR = 0.016 + dustM * 0.25 + (1.0 - face) * 0.3;`,wa={value:1},pr={value:0},Ui={value:0},$i={value:new bt(8.485,-8.485)};function uu(t={}){const e=Yo(),n=tt((t.seed??1)*7919+3),o=new Gn({color:16777215,metalness:0,roughness:.3,clearcoat:1,clearcoatRoughness:.035,ior:1.52,specularIntensity:0,envMapIntensity:.5}),a={tNz:{value:e.noise},uSeed:{value:new _(n()*40,n()*40,n()*40)},uImpact:{value:new bt(t.impact?.x??-13,t.impact?.z??.8)},uCcDirect:{value:.04},uStrN:{value:new _(0,0,1)},uStrL:{value:new _(0,1,0)},uStrW:{value:.006},uStrC:{value:.7},uStrG:{value:0},uStrRef:{value:0},uStrM:wa,uCGlow:pr,uCFront:$i,uEMode:Ui,uEnv:{value:cu}};return o.onBeforeCompile=s=>{Object.assign(s.uniforms,a),fr(s),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform vec2 uImpact;
uniform float uCcDirect;
uniform vec3 uStrN;
uniform vec3 uStrL;
uniform float uStrW;
uniform float uStrC;
uniform float uStrG;
uniform float uStrRef;
uniform float uStrM;
uniform float uEnv;
uniform float uEMode;`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
clearcoatSpecularDirect *= uCcDirect;
vec3 sV = normalize(vViewPosition);
vec3 sR = inverseTransformDirection(reflect(-sV, normal), viewMatrix);
float sS = dot(sR, uStrN);
float sAA = fwidth(sS) * 1.2 + 1e-4;
float sHard = smoothstep(-uStrW - sAA, -uStrW + sAA, sS);
float sSoft = sS < uStrW ? 1.0 : exp(-(sS - uStrW) / (uStrW * 1.6));
float sAlong = dot(sR, uStrL);
float sEnd = smoothstep(uStrC - 0.22, uStrC + 0.12, sAlong);
float sWand = 0.3 + 0.7 * smoothstep(0.3, 0.7, texture2D(tNz, vOP.xz * 0.045 + 0.19).b) * (0.75 + 0.25 * texture2D(tNz, vOP.xz * 0.21 + 0.37).g);
float sBand = sHard * sSoft * sEnd * sWand;
float sIrr = dot(reflectedLight.directDiffuse, vec3(0.0, 1.0, 0.0)) * PI / max(material.diffuseColor.g, 1e-5);
float sLit = uStrRef > 0.0 ? smoothstep(0.05, 1.0, sIrr / uStrRef) : 1.0;
float sFr = 0.04 + 0.96 * ((1.0 - clamp(dot(normal, sV), 0.0, 1.0)) * (1.0 - clamp(dot(normal, sV), 0.0, 1.0)) * (1.0 - clamp(dot(normal, sV), 0.0, 1.0)) * (1.0 - clamp(dot(normal, sV), 0.0, 1.0)) * (1.0 - clamp(dot(normal, sV), 0.0, 1.0)));
clearcoatSpecularIndirect += vec3(sBand * sLit * sFr * uStrG * uStrM * eCoat);`).replace("#include <color_fragment>",`#include <color_fragment>
${lu}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = eRough;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = eCoat;
material.clearcoatRoughness = eCoatR;`),s.fragmentShader=s.fragmentShader.replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= uEnv;
iblIrradiance *= uEnv;
clearcoatRadiance *= uEnv;`).replace("#include <opaque_fragment>",`outgoingLight *= mix(vec3(1.0), vec3(1.0, 0.1, 0.08), (1.0 - smoothstep(0.5, 0.95, vON.y)) * clamp(uCGlow * 3.0, 0.0, 1.0) * (1.0 - step(1.5, uEMode)) * (uEMode > 0.5 && uEMode < 1.5 ? cFall(length(vOP.xz - uCFront)) : 1.0));
if (uEMode > 0.5 && uEMode < 1.5) outgoingLight += vec3(0.5, 0.0, 0.0) * uCGlow * (1.0 - smoothstep(0.5, 0.95, vON.y)) * cFall(length(vOP.xz - uCFront));
if (uEMode > 0.5 && uEMode < 1.5) { float sR = length(vOP.xz - uCFront); outgoingLight += vec3(1.0, 0.0, 0.0) * uCGlow * face * (3.6 * czH + 1.6 * eQl) * cFall(sR) * 5.0; }
#include <opaque_fragment>`).replace("uniform float uEnv;",`uniform float uEnv;
uniform float uCGlow;
uniform vec2 uCFront;
float cFall(float d) { return exp(-d / 2.4) * (1.0 - smoothstep(2.5, 6.0, d)); }`),To(s)},o.customProgramCacheKey=()=>"ss-out-enamel",Object.assign(o,{ss:a})}const du=`
float along = -vOP.z;
float across = vOP.x;
float fw = max(max(length(dFdx(vOP)), length(dFdy(vOP))), 1e-6);
float nA = texture2D(tNz, vec2(along * 0.9, across * 2.0) * 0.5 + uSeed.xy).r;
float nB = texture2D(tNz, vec2(along * 0.6, 0.37 + across * 0.6) + uSeed.yz).g;
float tipC = smoothstep(uLen - 2.0, uLen - 1.9, along + (nA - 0.5) * 0.4);
float side = smoothstep(0.15, 0.45, vON.x);
float edgeC = side * smoothstep(0.7, 0.73, nB + (nA - 0.5) * 0.35) * step(1.5, along) + smoothstep(0.62, 0.7, nA) * smoothstep(0.1, 0.16, abs(across)) * step(0.0, across) * step(2.0, along);
float chip = clamp(max(tipC, edgeC), 0.0, 1.0);
float rim = clamp(max(smoothstep(0.0, 0.08, tipC) - tipC, 0.0) * 4.0 + max(smoothstep(0.0, 0.25, edgeC) - edgeC, 0.0) * 2.0, 0.0, 1.0);
float hl = abs(across - (along - uHair) * 0.14 + 0.03 * sin(along * 6.0));
float hair = (1.0 - smoothstep(0.0, max(fwidth(hl) * 1.1, 0.004), hl)) * step(uHair - 1.0, along) * step(along, uHair + 1.3) * (1.0 - chip);

float boss = 1.0 - smoothstep(0.62, 0.7, length(vOP.xz));
chip = max(chip, boss);
vec3 lac = vec3(0.014, 0.0007, 0.0005) * (0.85 + 0.3 * nA);
diffuseColor.rgb = mix(lac, vec3(0.022 + 0.02 * nA) * (1.0 - 0.6 * boss), chip);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.008, 0.0005, 0.0004), rim * (1.0 - chip));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.09), hair);
float lRough = mix(0.42, 0.07 + 0.03 * nB, chip);
lRough = mix(lRough, 0.8, hair);
float lMetal = chip;
float lCoat = (1.0 - chip) * (1.0 - hair * 0.8) * (1.0 - rim * 0.6);`;function fu(t={}){const e=Yo(),n=tt((t.seed??1)*4241+9),o=new Gn({color:16777215,metalness:0,roughness:.42,clearcoat:1,clearcoatRoughness:.025,ior:1.5,specularIntensity:0,envMapIntensity:.5,emissive:new Gt().setRGB(.0045,0,0)}),a={tNz:{value:e.noise},uSeed:{value:new _(n(),n(),n())},uLen:{value:t.len??19.9},uHair:{value:11.5+n()*2}};return o.onBeforeCompile=s=>{Object.assign(s.uniforms,a),fr(s),xs(s,.22),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uLen;
uniform float uHair;`).replace("#include <color_fragment>",`#include <color_fragment>
${du}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = lRough;`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = lMetal;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance *= (1.0 - chip);`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = lCoat;`).replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= mix(1.0, 0.08, chip);`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= mix(1.0, 0.15, chip);
{ vec3 cT = vec3(0.8, 0.035, 0.03); float cA = max(clearcoatSpecularDirect.r, clearcoatSpecularIndirect.r); float hot = smoothstep(12.0, 40.0, cA); clearcoatSpecularDirect *= mix(cT, vec3(1.0), hot); clearcoatSpecularIndirect *= mix(cT, vec3(1.0), hot); }`),ir(s),To(s)},o.customProgramCacheKey=()=>"ss-out-lacquer",Object.assign(o,{ss:a})}const ji=t=>`vec3 gEx = max(outgoingLight - ${t.toFixed(3)}, 0.0);
outgoingLight = min(outgoingLight, vec3(${t.toFixed(3)})) + gEx / (1.0 + gEx * 4.0);`,js={value:1};function pu(t={}){const e=new Gn({color:0,metalness:0,roughness:.012,ior:1.52,specularIntensity:1,envMapIntensity:t.env??.07,transparent:!0,depthWrite:!1});e.blending=Cn,e.blendSrc=ft,e.blendDst=or,e.blendEquation=Ua;const n=t.tint??.1;return e.onBeforeCompile=o=>{o.uniforms.uGEnv=js,xs(o,t.env??.3),o.fragmentShader=o.fragmentShader.replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= 0.0;
reflectedLight.indirectSpecular *= uGEnv;`).replace("#include <common>",`#include <common>
uniform float uGEnv;`).replace("#include <opaque_fragment>",`${ji(.38)}
float gF = ((1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)));
gl_FragColor = vec4(outgoingLight, ${n.toFixed(3)} + 0.35 * gF);`),To(o)},e.customProgramCacheKey=()=>`ss-out-glass-${t.env??.3}`,e}const Ki={value:0};function Br(t={}){const e=new ya({color:new Gt().setScalar(t.gain??.45),metalness:1,roughness:t.rough??.2,envMapIntensity:t.env??.12,transparent:!0,depthWrite:!1,side:uo});return e.blending=Cn,e.blendSrc=ft,e.blendDst=ft,e.blendEquation=Ua,e.onBeforeCompile=n=>{n.uniforms.uCFace=Ki,n.uniforms.uCGlow=pr,n.uniforms.uCFront=$i,xs(n,t.env??.12),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aCav;
varying float vV;
varying vec2 vCP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vV = aCav;
vCP = position.xz;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uCFace;
uniform float uCGlow;
uniform vec2 uCFront;
varying float vV;
varying vec2 vCP;`).replace("#include <opaque_fragment>",`float cw = max(fwidth(vV) * 1.2, 0.002);
float cLine = exp(-(((1.0 - vV) / cw) * ((1.0 - vV) / cw))) + 0.45 * exp(-((vV / cw) * (vV / cw)));
outgoingLight *= (cLine + ${(t.face??.07).toFixed(3)}) * mix(1.0, cLine, uCFace);
float cD = length(vCP - uCFront);
float cG = clamp(uCGlow * 3.0, 0.0, 1.0) * mix(1.0, exp(-cD / 2.4) * (1.0 - smoothstep(2.5, 6.0, cD)), step(0.5, uCFace));
outgoingLight *= mix(vec3(1.0), vec3(1.0, 0.1, 0.08), cG);
${ji(.3)}
gl_FragColor = vec4(outgoingLight, 0.0);`)},e.customProgramCacheKey=()=>`ss-out-crack-${t.face??.07}-${t.env??.12}`,e}const hu=`
float gr = length(vOP.xz);
float ga = atan(vOP.z, vOP.x);
float gq = gr / uPitch;
float ringI = floor(gq);
float nW = floor(gr * 6.2831853 / 0.92) + 1.0;
float wav = sin(ga * nW + mod(ringI, 2.0) * 3.14159265) * 0.24;
float gph = fract(gq + wav);
float vg = abs(gph - 0.5) * 2.0;
float gfw = max(fwidth(gq), 1e-5);
float glim = 1.0 - smoothstep(0.22, 0.5, gfw);
float gIn = smoothstep(uCart + 0.35, uCart + 0.5, gr) * (1.0 - smoothstep(uGRim - 1.6, uGRim - 1.3, gr)) * face;
float bead = exp(-(((gr - uCart - 0.18) / 0.06) * ((gr - uCart - 0.18) / 0.06))) * face;
float rimLine = exp(-(((gr - uGRim + 1.15) / 0.05) * ((gr - uGRim + 1.15) / 0.05))) * face;
ssH += (vg - 0.5) * 0.0042 * glim * gIn + (bead + rimLine) * 0.006 * bl(0.1, fw);
ssRough = mix(ssRough, ssRough * 0.8 + 0.05 * vg, gIn * glim);`,oa={value:1},mu=`{
float rkD = dot(vOP.xz, vec2(-0.8, 0.6)) - uRake.x;
float rkB = rkD < 0.0 ? exp(-((rkD / 1.2) * (rkD / 1.2))) : exp(-((rkD / 3.2) * (rkD / 3.2)));
float rkE = 0.25 + 0.75 * smoothstep(-22.0, 8.0, dot(vOP.xz, vec2(0.6, 0.8)));
float rk = mix(1.0, 0.08 + 0.92 * rkB * rkE, uRake.y);
reflectedLight.directDiffuse *= rk; reflectedLight.directSpecular *= rk;
reflectedLight.indirectSpecular *= uLidEnv;
}`;function vu(t){const e=cn({finish:"polished",seed:t.seed,wear:t.wear,tier:t.tier,age:t.age}),n=e.onBeforeCompile,o={uCart:{value:t.cart??7},uGRim:{value:t.rim??24.6},uPitch:{value:t.pitch??.3},uRake:{value:new bt(0,1)},uLidEnv:oa};return e.onBeforeCompile=(a,s)=>{n.call(e,a,s),Object.assign(a.uniforms,o),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
uniform float uCart;
uniform float uGRim;
uniform float uPitch;
uniform vec2 uRake;
uniform float uLidEnv;`).replace("#include <roughnessmap_fragment>",`${hu}
#include <roughnessmap_fragment>`).replace("#include <aomap_fragment>",`reflectedLight.directSpecular *= mix(1.0, 0.1 + 1.2 * smoothstep(0.55, 0.9, 1.0 - vg), gIn * glim);
`+mu+`
#include <aomap_fragment>`)},e.customProgramCacheKey=()=>`ss-out-guilloche-${t.tier==="low"?"l":"h"}`,e}const gu=`
#include <common>
uniform vec2 uSph;
varying vec3 vDC;
varying float vDR;`,xu=`
#include <worldpos_vertex>
#ifdef USE_INSTANCING
mat4 dM = modelMatrix * instanceMatrix;
#else
mat4 dM = modelMatrix;
#endif
vDC = (dM * vec4(0.0, uSph.x, 0.0, 1.0)).xyz;
vDR = uSph.y * length(dM[0].xyz);`,wu=`
#include <common>
uniform samplerCube uCube;
uniform float uHasCube;
uniform vec3 uLd;
uniform float uCaus;
varying vec3 vDC;
varying float vDR;`,yu=`
vec3 dV = normalize(vPW - cameraPosition);
vec3 dN = normalize(inverseTransformDirection(normal, viewMatrix));
float dCos = clamp(dot(-dV, dN), 0.0, 1.0);
vec3 r1 = refract(dV, dN, 0.75);
vec3 oc = vPW - vDC;
float hb = dot(oc, r1);
float hc = dot(oc, oc) - vDR * vDR;
float ht = -hb + sqrt(max(hb * hb - hc, 0.0));
vec3 p2 = vPW + r1 * ht;
vec3 n2 = normalize(p2 - vDC);
vec3 r2 = refract(r1, -n2, 1.33);
if (dot(r2, r2) < 0.01) r2 = reflect(r1, -n2);
vec3 refr = vec3(0.004);
if (uHasCube > 0.5) refr = textureCube(uCube, r2).rgb;
#ifdef ENVMAP_TYPE_CUBE_UV
else refr = textureCubeUV(envMap, r2, 0.0).rgb * 0.25;
#endif
float dF = 0.02 + 0.98 * ((1.0 - dCos) * (1.0 - dCos) * (1.0 - dCos) * (1.0 - dCos) * (1.0 - dCos));
float dRim = smoothstep(0.42, 0.08, dCos);
refr *= (1.0 - dF) * (1.0 - 0.93 * dRim) * vec3(1.5, 1.53, 1.55);
vec3 pc = vDC - normalize(uLd * vec3(1.0, 0.25, 1.0)) * vDR * 0.62;
pc.y = min(pc.y, vDC.y + vDR * 0.2);
float cd = length(cross(pc - vPW, dV));
float caus = exp(-((cd / (vDR * 0.05)) * (cd / (vDR * 0.05)))) * uCaus * smoothstep(0.1, 0.4, dCos);
outgoingLight += refr + vec3(caus);`;function bu(t={}){const e=new Gn({color:0,metalness:0,roughness:.03,ior:1.33,specularIntensity:1,envMapIntensity:2.2}),n={uCube:{value:t.cube??null},uHasCube:{value:t.cube?1:0},uSph:{value:new bt(t.sphere?.c??-.3,t.sphere?.R??1.05)},uLd:{value:(t.light??new _(-.6,.7,-.4)).clone().normalize()},uCaus:{value:t.caustic??2.2}};return e.onBeforeCompile=o=>{Object.assign(o.uniforms,n),To(o),o.vertexShader=o.vertexShader.replace("#include <common>",gu).replace("#include <worldpos_vertex>",xu),o.fragmentShader=o.fragmentShader.replace("#include <common>",wu).replace("#include <opaque_fragment>",`${yu}
#include <opaque_fragment>`)},e.customProgramCacheKey=()=>"ss-out-drop",Object.assign(e,{ss:n})}function Mu(t={}){const e=new Gn({color:0,metalness:0,roughness:.025,ior:1.33,specularIntensity:1,envMapIntensity:t.env??2.4,transparent:!0,depthWrite:!1});e.blending=Cn,e.blendSrc=ft,e.blendDst=or,e.blendEquation=Ua;const n=t.tint??.14;return e.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("#include <opaque_fragment>",`vec3 wEx = max(outgoingLight - 0.5, 0.0);
outgoingLight = min(outgoingLight, vec3(0.5)) + wEx / (1.0 + wEx * 3.0);
float wF = ((1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)) * (1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)) * (1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)));
gl_FragColor = vec4(outgoingLight, ${n.toFixed(3)} + 0.4 * wF);`),To(o)},e.customProgramCacheKey=()=>"ss-out-thin",e}function Su(t={}){const e=new ya({color:new Gt().setScalar(t.gain??.3),metalness:1,roughness:.12,envMapIntensity:.5,transparent:!0,depthWrite:!1});return e.blending=Cn,e.blendSrc=ft,e.blendDst=ft,e.blendEquation=Ua,e.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aCav;
varying float vR;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vR = aCav;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying float vR;`).replace("#include <opaque_fragment>",`outgoingLight *= (1.0 - vR) * (0.35 + 0.65 * abs(dot(normalize(vViewPosition), normal)));
gl_FragColor = vec4(min(outgoingLight, vec3(0.35)), 0.0);`)},e.customProgramCacheKey=()=>"ss-out-rain",e}const zu=`
float fw = max(max(length(dFdx(vOP)), length(dFdy(vOP))), 1e-6);
vec3 an = abs(vON);
vec2 sp = (an.y > 0.6 ? vOP.xz : (an.x > an.z ? vOP.zy : vOP.xy)) + uSeed.xy * 30.0;
vec3 g1 = cell(sp * 0.95);
vec3 g2 = cell(sp * 2.1 + 7.0);
vec3 g3 = cell(sp * 3.7 + 3.0);
float b1 = bl(1.0 / 0.95, fw);
float b2 = bl(1.0 / 2.1, fw);
float b3 = bl(1.0 / 3.7, fw);
float feld = step(0.78, g1.y) * b1;
float quartz = step(0.5, g2.y) * step(g2.y, 0.75) * b2;
float spk = step(0.82, g3.y) * b3;
float stone = 0.042 + 0.038 * feld + 0.012 * quartz + 0.03 * spk - 0.018 * step(g3.z, 0.3) * b3;
float bigN = texture2D(tNz, sp * 0.004).b;
float midN = texture2D(tNz, sp * 0.017 + 0.3).g;
stone *= 0.75 + 0.5 * bigN;
vec3 sc = vec3(stone) * mix(vec3(1.0), vec3(1.06, 1.0, 0.95), feld);
float grit = vCav;
float gritN = texture2D(tNz, sp * 0.4).r;
sc = mix(sc, vec3(0.008 + 0.012 * gritN), grit);
float wet = clamp(0.55 + 0.6 * uWet + 0.25 * (bigN - 0.5) + 0.1 * (midN - 0.5) + 0.3 * grit, 0.0, 1.0);
sc *= mix(1.0, 0.62, wet);
diffuseColor.rgb = sc;
float sRough = mix(0.62, 0.38, vEdge) - 0.12 * quartz;
float mica = step(0.965, g3.z) * b3 * (1.0 - grit);
sRough = mix(sRough, 0.12, mica);
sRough = mix(sRough, 0.9, grit * (1.0 - wet));
float sCoat = mix(0.3, 0.6, wet) * mix(1.0, 1.4, grit);
float sCoatR = mix(0.38, 0.22, wet) + 0.03 * (1.0 - midN);`;function ku(t={}){const e=Yo(),n=tt((t.seed??1)*4271+9),o=new Gn({color:16777215,metalness:0,roughness:.6,clearcoat:1,clearcoatRoughness:.05,ior:1.33,specularIntensity:.6,envMapIntensity:1.2}),a={tNz:{value:e.noise},uSeed:{value:new _(n(),n(),n())},uWet:{value:t.wet??.45}};return o.onBeforeCompile=s=>{Object.assign(s.uniforms,a),fr(s),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uWet;`).replace("#include <color_fragment>",`#include <color_fragment>
${zu}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = sRough;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = sCoat;
material.clearcoatRoughness = sCoatR;
material.specularF90 = mix(material.specularF90, 1.0, mica);`),To(s)},o.customProgramCacheKey=()=>"ss-out-stone",Object.assign(o,{ss:a})}const es=8,Hr={name:"OutPuddle",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uTime:{value:0},uRip:{value:Array.from({length:es},()=>new rn(0,0,0,0))},uRipN:{value:0},uRipR:{value:60},uGain:{value:1},uLd:{value:new _(-.6,.7,-.4).normalize()},uSpec:{value:1.2}},vertexShader:`
uniform mat4 textureMatrix;
varying vec4 vUv;
varying vec3 vWP;
#include <common>
#include <logdepthbuf_pars_vertex>
void main() {
  vUv = textureMatrix * vec4(position, 1.0);
  vWP = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}`,fragmentShader:`
uniform vec3 color;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec4 uRip[${es}];
uniform int uRipN;
uniform float uRipR;
uniform float uGain;
uniform vec3 uLd;
uniform float uSpec;
varying vec4 vUv;
varying vec3 vWP;
#include <logdepthbuf_pars_fragment>
void main() {
  #include <logdepthbuf_fragment>
  vec2 sl = vec2(0.0);
  for (int i = 0; i < ${es}; i++) {
    if (i >= uRipN) break;
    vec4 r = uRip[i];
    vec2 dv = vWP.xz - r.xy;
    float d = length(dv) + 1e-4;
    float age = fract(uTime * r.w * 0.45 + r.z);
    float R = age * uRipR;
    float x = (d - R) / (2.0 + age * 6.0);
    float env = exp(-x * x) * ((1.0 - age) * (1.0 - age));
    sl += dv / d * cos(x * 3.2) * env;
  }
  vec3 V = normalize(cameraPosition - vWP);
  float cosT = clamp(V.y, 0.0, 1.0);
  vec4 uv = vUv;
  uv.xy += sl * 0.012 * uv.w;
  vec3 refl = texture2DProj(tDiffuse, uv).rgb;
  float F = 0.02 + 0.98 * ((1.0 - cosT) * (1.0 - cosT) * (1.0 - cosT) * (1.0 - cosT) * (1.0 - cosT));
  float w = mix(0.62, 1.0, F) * uGain;
  vec3 silt = vec3(0.006, 0.0045, 0.0035) * (1.0 - F);
  float ring = clamp(length(sl), 0.0, 1.0);
  vec3 pN = normalize(vec3(-sl.x * 0.9, 1.0, -sl.y * 0.9));
  vec3 pH = normalize(uLd + V);
  float glint = pow(max(dot(pN, pH), 0.0), 900.0) * 6.0 + pow(max(dot(pN, pH), 0.0), 60.0) * 0.05;
  gl_FragColor = vec4(refl * color * w * (1.0 - 0.25 * ring) + silt + vec3(0.03 * ring * (0.25 + F)) + vec3(glint * uSpec * F * 6.0), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`};function Pu(t,e={}){const n=e.y??0,o=t.clone();o.translate(0,-n,0),o.rotateX(Math.PI/2);const[a,s]=e.res??[Math.round(innerWidth*Math.min(devicePixelRatio,2)/2),Math.round(innerHeight*Math.min(devicePixelRatio,2)/2)],r=new Sa(o,{textureWidth:a,textureHeight:s,color:14210256,clipBias:.002,shader:{...Hr,uniforms:hi.clone(Hr.uniforms)}});r.rotation.x=-Math.PI/2,r.position.y=n;const i=r.material.uniforms,c=(e.ripples??[]).slice(0,es);return c.forEach((l,d)=>i.uRip.value[d].set(l.x,l.z,l.phase,l.speed)),i.uRipN.value=c.length,i.uGain.value=e.gain??1,Object.assign(r,{ss:i})}function Or(t,e,n){switch(t){case"enamel":return uu({seed:e,impact:n.impact});case"lacquer":return fu({seed:e});case"glass":return pu();case"guilloche":return vu({seed:e,wear:n.wear,tier:n.q,age:n.age??n.wear*.5});case"polishedIn":return cn({finish:"polished",seed:e,wear:n.wear,tier:n.q,age:.08});case"crack":return Br();case"drop":return bu({cube:n.cube,sphere:n.sphere,light:n.light});case"water":return Mu();case"rain":return Su();case"stone":return ku({seed:e,wet:n.wet});case"glassEdge":return Br({gain:.75,rough:.18,env:.1,face:.03});case"grained":return Oo(cn({finish:"grained",seed:e,wear:n.wear,tier:n.q,age:n.age??n.wear*.5}),Au);default:return cn({finish:["polished","grained","striped","sunray","turned","brushed","blackened"].includes(t)?t:"polished",seed:e,wear:n.wear,tier:n.q,age:n.age??n.wear*.5})}}const Au=.3;function Oo(t,e){const n=t.onBeforeCompile,o=t.customProgramCacheKey;return t.onBeforeCompile=(a,s)=>{n.call(t,a,s),xs(a,e)},t.customProgramCacheKey=()=>`${o.call(t)}-e${e}`,t}function Eo(t,e,n={}){const o=new pt,a={q:e,wear:n.wear??.5,...n};for(const s of t.pieces){if(s.finish==="puddle"){const u=Pu(s.geo,{y:n.water?.y??0,ripples:n.ripples,res:e==="low"?[256,256]:void 0});u.name=s.name??"puddle",o.add(u);continue}const r=n.sphereOf?.(s.name??""),i=Or(s.finish,s.seed,{...a,...s.wear===void 0?{}:{wear:s.wear},...r?{sphere:r}:{}}),c=new Ke(s.geo,i);s.at&&c.applyMatrix4(s.at),c.name=s.name??"";const l=i.transparent;c.castShadow=!l&&(n.shadows??e!=="low"),c.receiveShadow=n.shadows??e!=="low";const d=i.aim;d&&(c.onBeforeRender=(u,p,f)=>d(c,f)),o.add(c)}for(const s of t.inst){if(!s.mats.length)continue;const r=n.sphereOf?.(s.name??""),i=Or(s.finish,s.seed,r?{...a,sphere:r}:a),c=new yn(s.geo,i,s.mats.length);s.mats.forEach((l,d)=>c.setMatrixAt(d,l)),c.instanceMatrix.needsUpdate=!0,c.name=s.name??"",c.castShadow=!i.transparent&&(n.shadows??e!=="low"),c.receiveShadow=n.shadows??e!=="low",c.computeBoundingSphere(),o.add(c)}return o}const Yi={"lid-out":{id:"lid-out",en:["MK"],ar:["MK"],surface:"steel",layout:{kind:"mono"},aspect:1.32,cap:.44,tex:{high:200,mid:150,low:90}},"dial-xii":{id:"dial-xii",en:["STILL HERE"],ar:["لسه هنا"],surface:"enamel",layout:{kind:"line"},aspect:6,cap:.42,tex:{high:120,mid:90,low:56}},"barrel-bridge":{id:"barrel-bridge",en:["UNADJUSTED"],ar:["غير مضبوطة"],surface:"steel",layout:{kind:"line"},aspect:8.5,cap:.42,tex:{high:110,mid:84,low:52}},cock:{id:"cock",en:["F","·","S"],ar:["سريع","·","بطيء"],surface:"steel",layout:{kind:"row",x:.18,y:.56,gap:.85},aspect:1,cap:.1,tex:{high:104,mid:80,low:48}},"pallet-bridge":{id:"pallet-bridge",en:["ONE JEWEL"],ar:["جوهرة واحدة"],surface:"steel",layout:{kind:"line"},aspect:6.5,cap:.42,tex:{high:110,mid:84,low:52}},"lid-in":{id:"lid-in",en:["FOR WHOEVER WAITS"],ar:["للي بيستنى"],surface:"steel",layout:{kind:"line",wrap:!0},aspect:1.4,cap:.44,tex:{high:110,mid:84,low:52}}},Xi=t=>t.toLowerCase().startsWith("ar")?"ar":"en",Ru="/flagship-portfolio/_astro/amiri-latin-700-normal.DIjoEGk6.woff2",Cu="/flagship-portfolio/_astro/amiri-arabic-700-normal.D8FrblyB.woff2",ts={en:"ss-engrave-lat",ar:"ss-engrave-ar"},Tu={en:Ru,ar:Cu},Fu={},_u={};function Iu(t){return Fu[t]??=(async()=>{try{if(typeof FontFace>"u"||typeof document>"u")return!1;const e=new FontFace(ts[t],`url(${_u[t]??Tu[t]})`,{weight:"700",style:"normal"});return await e.load(),document.fonts.add(e),await document.fonts.load(`700 64px "${ts[t]}"`,t==="ar"?"لسه":"MK"),document.fonts.check(`700 64px "${ts[t]}"`,t==="ar"?"لسه":"MK")}catch{return!1}})()}const Lu=.16,Du=1.3;function hr(t,e,n){t.font=`700 ${n}px "${ts[e]}"`}function B0(t,e,n){hr(t,e,200);const o=t.measureText(e==="ar"?"ا":"H");return n*(e==="ar"?Du:1)*200/Math.max(1,o.actualBoundingBoxAscent)}function i0(t,e,n,o,a=!1){if(hr(t,e,o),e==="ar"){t.direction="rtl",t.textAlign="center";const d=t.measureText(n),u=d.actualBoundingBoxAscent,p=d.actualBoundingBoxDescent;return a||t.fillText(n,0,(u-p)/2),{w:d.actualBoundingBoxLeft+d.actualBoundingBoxRight,h:u+p}}t.direction="ltr",t.textAlign="left";const s=[...n],r=s.map(d=>t.measureText(d).width),i=Lu*o,c=r.reduce((d,u)=>d+u,0)+i*(s.length-1),l=t.measureText("H").actualBoundingBoxAscent;if(!a){let d=-c/2;s.forEach((u,p)=>{u!==" "&&t.fillText(u,d,l/2),d+=r[p]+i})}return{w:c,h:l}}function Eu(t,e,n){const o=t.id==="lid-out"?"en":e,a=e==="ar"?t.ar:t.en;let s=t.tex[n];const r=Math.round(s/t.cap),i=Math.round(r*t.aspect),c=document.createElement("canvas");c.width=i,c.height=r;const l=c.getContext("2d",{willReadFrequently:!0});l.fillStyle="#000",l.fillRect(0,0,i,r),l.fillStyle="#fff";const d=[];if(t.layout.kind==="line"){let f=B0(l,o,s);const v=a[0],h=t.layout.wrap&&o==="en"?v.split(" "):[v],m=1.55,M=h.map(y=>i0(l,o,y,f,!0)),x=Math.max(...M.map(y=>y.w)),g=M[0].h*(1+m*(h.length-1)),w=Math.min(1,i*.92/x,r*.9/g);f*=w,s*=w,h.forEach((y,S)=>{l.setTransform(1,0,0,1,i/2,r/2+(S-(h.length-1)/2)*m*M[0].h*w),i0(l,o,y,f)})}else if(t.layout.kind==="mono"){const f=B0(l,"en",s);hr(l,"en",f);const v=l.measureText("M").width,h=l.measureText("K").width,m=f*.08,M=l.measureText("H").actualBoundingBoxAscent,x=i/2-(v+m+h)/2;l.direction="ltr",l.textAlign="left",l.fillText("M",x,r/2+M/2),l.fillText("K",x+v+m,r/2+M/2),l.strokeStyle="#fff",l.lineWidth=s*.028,l.beginPath(),l.ellipse(i/2,r/2,i*.455,r*.43,0,0,Math.PI*2),l.stroke()}else if(t.layout.kind==="row"){const{x:f,y:v,gap:h}=t.layout,m=B0(l,o,s),M=h*s,x=e==="ar"?[a[2],a[1],a[0]]:a,g=x.map(R=>R==="·"?0:i0(l,o,R,m,!0).w),w=g.reduce((R,k)=>R+k,0)+M*(x.length-1);let y=i/2*(1+f)-w/2;const S=r/2*(1-v);x.forEach((R,k)=>{R==="·"?d.push({x:y,y:S,r:s*.13}):(l.setTransform(1,0,0,1,y+g[k]/2,S),i0(l,o,R,m)),y+=g[k]+M})}else{const{r:f,a0:v,a1:h}=t.layout,m=f*i/2,M=B0(l,o,s),x=e==="ar"?[a[2],a[1],a[0]]:a;x.forEach((g,w)=>{const y=v+(h-v)*w/(x.length-1),S=i/2+Math.cos(y)*m,R=r/2+Math.sin(y)*m;if(g==="·"){d.push({x:S,y:R,r:s*.14});return}const k=y+Math.PI/2;l.setTransform(Math.cos(k),Math.sin(k),-Math.sin(k),Math.cos(k),S,R),i0(l,o,g,M)})}l.setTransform(1,0,0,1,0,0);const u=l.getImageData(0,0,i,r).data,p=new Float32Array(i*r);for(let f=0;f<i*r;f++)p[f]=u[f*4]/255;return{cov:p,w:i,h:r,capTex:s,dimples:d,aspect:t.aspect}}const g0=1e20;function Vr(t,e,n,o,a){n[0]=0,o[0]=-g0,o[1]=g0;for(let s=1,r=0;s<a;s++){let i=(t[s]+s*s-(t[n[r]]+n[r]*n[r]))/(2*s-2*n[r]);for(;i<=o[r];)r--,i=(t[s]+s*s-(t[n[r]]+n[r]*n[r]))/(2*s-2*n[r]);r++,n[r]=s,o[r]=i,o[r+1]=g0}for(let s=0,r=0;s<a;s++){for(;o[r+1]<s;)r++;const i=s-n[r];e[s]=i*i+t[n[r]]}}function qr(t,e,n){const o=Math.max(e,n),a=new Float64Array(o),s=new Float64Array(o),r=new Int32Array(o),i=new Float64Array(o+1);for(let c=0;c<e;c++){for(let l=0;l<n;l++)a[l]=t[l*e+c];Vr(a,s,r,i,n);for(let l=0;l<n;l++)t[l*e+c]=s[l]}for(let c=0;c<n;c++){for(let l=0;l<e;l++)a[l]=t[c*e+l];Vr(a,s,r,i,e);for(let l=0;l<e;l++)t[c*e+l]=s[l]}}function Wu(t,e,n){const o=new Float64Array(e*n),a=new Float64Array(e*n);for(let r=0;r<e*n;r++){const i=t[r];i>=.999?(o[r]=0,a[r]=g0):i<=.001?(o[r]=g0,a[r]=0):(o[r]=Math.max(0,.5-i)**2,a[r]=Math.max(0,i-.5)**2)}qr(o,e,n),qr(a,e,n);const s=new Float32Array(e*n);for(let r=0;r<e*n;r++)s[r]=Math.sqrt(o[r])-Math.sqrt(a[r]);return s}function H0(t,e,n){let o=t*374761393+e*668265263+n*2147483647|0;return o=Math.imul(o^o>>>13,1274126177),o^=o>>>16,(o>>>0)/4294967296}function As(t,e,n){const o=Math.floor(t),a=Math.floor(e),s=t-o,r=e-a,i=s*s*(3-2*s),c=r*r*(3-2*r),l=H0(o,a,n),d=H0(o+1,a,n),u=H0(o,a+1,n),p=H0(o+1,a+1,n);return l+(d-l)*i+(u-l)*c+(l-d-u+p)*i*c}function Nu(t,e,n,o){const a=o.capTex,s=o.grow*a,r=o.slope,i=o.depth*a,c=(o.burr??0)*a,l=Math.max(1.2,o.burrW*a),d=o.seed??1,u=o.burrDir??[.6,-.8],p=Math.hypot(u[0],u[1])||1,f=u[0]/p,v=-u[1]/p,h=Wu(t,e,n),m=new Float32Array(e*n),M=new Float32Array(e*n),x=(w,y)=>h[Math.min(n-1,Math.max(0,y))*e+Math.min(e-1,Math.max(0,w))]-s;for(let w=0;w<n;w++)for(let y=0;y<e;y++){const S=w*e+y,R=x(y,w);let k=R<0?i*Math.tanh(-R*r/i):0,L=0;if(c>0&&R>0&&R<l){const P=x(y+1,w)-x(y-1,w),I=x(y,w+1)-x(y,w-1),F=Math.hypot(P,I)||1,D=Math.min(1,Math.max(0,(P*f+I*v)/F*1.6-.2));L=c*Math.sin(Math.PI*R/l)*D*(.7+.3*As(y/(a*.08),w/(a*.08),d+5))}for(const P of o.dimples??[]){const I=Math.hypot(y+.5-P.x,w+.5-P.y);I<P.r?(k=Math.max(k,Math.max(i*1.15,P.r*.5)*(1-(I/P.r)**2)),L=0):c>0&&I<P.r+l&&(L=Math.max(L,c*.6*Math.sin(Math.PI*(I-P.r)/l)))}m[S]=L-k;const C=k/i,z=As(y/(a*.11),w/(a*.11),d),b=As(y/(a*.035),w/(a*.035),d+9);M[S]=Math.min(1,Math.max(0,(C-.45)/.5)*(.5+.5*z)+Math.max(0,Math.min(1,(C-.12)/.4))*.35*b*b)}const g=new Float32Array(e*n*4);for(let w=0;w<n;w++)for(let y=0;y<e;y++){const S=w*e+y,R=Math.max(0,y-1),k=Math.min(e-1,y+1),L=Math.max(0,w-1),C=Math.min(n-1,w+1),z=(m[w*e+k]-m[w*e+R])/(k-R||1),b=(m[C*e+y]-m[L*e+y])/(C-L||1);g[S*4]=m[S]/i,g[S*4+1]=z,g[S*4+2]=-b,g[S*4+3]=M[S]}return g}function Bu(t){const e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);let n=2166136261;for(let o=0;o<e.length;o++)n^=e[o],n=Math.imul(n,16777619);return(n>>>0).toString(16).padStart(8,"0")}const Hu=`
uniform vec3 uWO;
uniform vec3 uWR;
uniform vec3 uWUp;
uniform vec2 uWHalf;
varying vec3 vWF;
varying float vWNd;
varying vec3 vWRv;
varying vec3 vWUv;`,Ou=`
vec3 wRel = position - uWO;
vec3 wNo = cross(uWR, uWUp);
vWF = vec3(dot(wRel, uWR) / uWHalf.x, dot(wRel, uWUp) / uWHalf.y, dot(wRel, wNo));
vWNd = dot(normalize(normal), wNo);
mat3 wMV = mat3(modelViewMatrix);
#ifdef USE_INSTANCING
wMV = wMV * mat3(instanceMatrix);
#endif
vWRv = wMV * uWR;
vWUv = wMV * uWUp;`,Vu=`
uniform sampler2D tWords;
uniform float uWOn;
uniform float uWDepth;
uniform float uWBump;
uniform float uWCalm;
uniform float uWLit;
varying vec3 vWF;
varying float vWNd;
varying vec3 vWRv;
varying vec3 vWUv;`,qu=`
vec2 wUv = vWF.xy * 0.5 + 0.5;
vec4 wM = texture2D(tWords, vec2(wUv.x, 1.0 - wUv.y));
float wIn = uWOn * step(abs(vWF.x), 1.0) * step(abs(vWF.y), 1.0) * (1.0 - smoothstep(uWDepth * 0.6, uWDepth, abs(vWF.z))) * smoothstep(0.35, 0.6, vWNd);
float wH = wM.r * wIn;
vec2 wS = wM.gb * wIn * uWBump;
float wGr = wM.a * wIn;
float wCut = smoothstep(0.0, 0.1, -wH);
float wFloor = smoothstep(0.5, 0.95, -wH);
float wBurr = smoothstep(0.0, 0.06, wH);
vec2 wQ = abs(vWF.xy);
float wPanel = uWOn * (1.0 - smoothstep(0.55, 1.0, pow(max(((wQ.x) * (wQ.x) * (wQ.x) * (wQ.x)) + ((wQ.y) * (wQ.y) * (wQ.y) * (wQ.y)), 0.0), 0.25))) * (1.0 - smoothstep(uWDepth * 0.6, uWDepth, abs(vWF.z))) * smoothstep(0.35, 0.6, vWNd) * uWCalm;
normal = normalize(mix(normal, nonPerturbedNormal, wPanel));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2), wPanel * 0.6);
roughnessFactor = mix(roughnessFactor, 0.3, wPanel * 0.75);
metalnessFactor = mix(metalnessFactor, 1.0, wPanel * 0.5);
vec3 wG = wS.x * normalize(vWRv) + wS.y * normalize(vWUv);
normal = normalize(normal - (wG - normal * dot(normal, wG)));
float wWall = wCut * (1.0 - wFloor * 0.6);
#ifdef SS_W_ENAMEL
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.09), wWall);
roughnessFactor = mix(roughnessFactor, 0.62, wCut);
metalnessFactor = mix(metalnessFactor, 0.0, wCut);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.004), wGr);
roughnessFactor = mix(roughnessFactor, 0.9, wGr);
#else
diffuseColor.rgb = mix(diffuseColor.rgb, min(diffuseColor.rgb * 1.6 + 0.05, vec3(0.62)), wWall * 0.9);
roughnessFactor = mix(roughnessFactor, 0.2, wWall * 0.85);
roughnessFactor = mix(roughnessFactor, max(roughnessFactor - 0.06, 0.08), wBurr);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.006), wGr * 0.95);
roughnessFactor = mix(roughnessFactor, 0.86, wGr);
metalnessFactor = mix(metalnessFactor, 0.15, wGr);
#endif`,Gu=`
#ifdef USE_CLEARCOAT
material.clearcoat *= 1.0 - wCut;
#endif`,Gr=new Map,Zi=new hs(new Uint16Array(4),1,1,nr,la);Zi.needsUpdate=!0;async function Uu(t,e,n="high"){const o=Yi[t],a=t==="lid-out"?"en":Xi(e);if(!await Iu(t==="lid-out"?"en":a))return null;const s=Eu(o,a,n),r=o.surface==="steel";return{data:Nu(s.cov,s.w,s.h,{capTex:s.capTex,grow:.03,slope:1.15,depth:.09,burr:r?.006:0,burrW:.035,dimples:s.dimples,seed:t.length*31+(a==="ar"?7:1)}),w:s.w,h:s.h,aspect:s.aspect,capTex:s.capTex,ink:s.cov.reduce((c,l)=>c+l,0)}}function $u(t,e,n="high"){const o=`${t}|${Xi(e)}|${n}`;let a=Gr.get(o);return a||(a=(async()=>{const s=await Uu(t,e,n);if(!s)return null;const{data:r}=s;for(let l=0;l<r.length;l++)if(!Number.isFinite(r[l]))return null;const i=new Uint16Array(r.length);for(let l=0;l<r.length;l++)i[l]=yc.toHalfFloat(r[l]);const c=new hs(i,s.w,s.h,nr,la);return c.minFilter=vi,c.magFilter=mi,c.generateMipmaps=!0,c.wrapS=c.wrapT=bc,c.anisotropy=n==="low"?2:8,c.needsUpdate=!0,{tex:c,hash:Bu(r),w:s.w,h:s.h,aspect:s.aspect,cap:s.capTex/s.h}})().catch(()=>null),Gr.set(o,a)),a}function ju(t){const e=[],n=o=>{if(o.isMaterial){e.push(o);return}o.traverse(a=>{const s=a.material;a.isMesh&&s&&(Array.isArray(s)?s:[s]).forEach(r=>e.push(r))})};return(Array.isArray(t)?t:[t]).forEach(n),[...new Set(e)].filter(o=>o.isMeshStandardMaterial)}function Xa(t,e,n,o,a={}){const s=Yi[t],r=a.tier??"high",i=new _(...n.right).normalize(),c=new _(...n.up),l=c.addScaledVector(i,-c.dot(i)).normalize(),d=n.height??n.width/s.aspect,u={uWO:{value:new _(...n.at)},uWR:{value:i},uWUp:{value:l},uWHalf:{value:new bt(n.width/2,d/2)},tWords:{value:Zi},uWOn:{value:0},uWDepth:{value:n.depth??d*.6},uWBump:{value:a.bump??1},uWCalm:{value:a.calm??(s.surface==="steel"?1:0)},uWLit:{value:a.lit??1}};let p=null;for(const v of ju(e)){if(v.userData.ssWords)continue;v.userData.ssWords=t;const h=v.onBeforeCompile,m=v.customProgramCacheKey.bind(v);v.onBeforeCompile=(M,x)=>{h.call(v,M,x),Object.assign(M.uniforms,u),M.vertexShader=M.vertexShader.replace("#include <common>",`#include <common>
${Hu}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${Ou}`),M.fragmentShader=M.fragmentShader.replace("#include <common>",`${s.surface==="enamel"?`#define SS_W_ENAMEL
`:""}#include <common>
${Vu}`).replace("#include <lights_physical_fragment>",`${qu}
#include <lights_physical_fragment>`).replace("#include <lights_fragment_begin>",`${Gu}
#include <lights_fragment_begin>`).replace("#include <opaque_fragment>",`outgoingLight *= mix(1.0, uWLit, wCut);
#include <opaque_fragment>`)},v.customProgramCacheKey=()=>`${m()}-w${s.surface==="enamel"?"e":"s"}`,v.needsUpdate=!0}return{ready:$u(t,o,r).then(v=>(p=v,v?(u.tWords.value=v.tex,u.uWOn.value=1,!0):!1)),hash:()=>p?.hash??null,cap:()=>p?.cap??null,size:()=>p?[p.w,p.h]:null,uniforms:u}}function Ks(t){const e=window;(e.__secondWait??=[]).push(t)}const c0=-1.4,Qi=-14,Ku=Math.PI/180,Ur=99,Va=104;function Yu(t){const e=xt(t/.72),n=e<.16?.05*ve(e/.16):.05+.95*ve((e-.16)/.84);return Ur*n+(Va-Ur)*ve((t-.72)/.28)}function Xu(t){const e=t.getAttribute("position"),n=t.getAttribute("normal"),o=(c0-Qi)/(c0-_e.caseBottom);for(let a=0;a<e.count;a++){const s=e.getY(a);if(!(s>=c0)&&(e.setY(a,c0+(s-c0)*o),n)){const r=n.getX(a),i=n.getY(a)/o,c=n.getZ(a),l=Math.hypot(r,i,c)||1;n.setXYZ(a,r/l,i/l,c/l)}}e.needsUpdate=!0,n&&(n.needsUpdate=!0),t.computeBoundingBox(),t.computeBoundingSphere()}function Zu(t,e,n,o){const a=t.onBeforeCompile,s=t.customProgramCacheKey?.bind(t);t.onBeforeCompile=(r,i)=>{a.call(t,r,i),r.uniforms.tMir={value:e},r.uniforms.uMirM={value:n},r.uniforms.uMirG=o,r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
uniform mat4 uMirM;
varying vec4 vMirUv;`).replace("#include <project_vertex>",`#include <project_vertex>
vMirUv = uMirM * modelMatrix * vec4(transformed, 1.0);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D tMir;
uniform float uMirG;
varying vec4 vMirUv;`).replace("#include <opaque_fragment>",`vec2 mUv = vMirUv.xy / vMirUv.w + normal.xz * 0.004;
outgoingLight += texture2D(tMir, mUv).rgb * uMirG;
#include <opaque_fragment>`)},t.customProgramCacheKey=()=>`${s?s():""}-mir`,t.needsUpdate=!0}const Ji={value:0};function ec(t){const e=[],n=new Set;for(const o of t)o.traverse(a=>{const s=a.material,r=s?.ss;if(!r?.uAge||n.has(s))return;n.add(s),e.push([r,r.uAge.value]);const i=s.onBeforeCompile.bind(s),c=s.customProgramCacheKey.bind(s);s.onBeforeCompile=(l,d)=>{i(l,d),l.uniforms.uClean=Ji,l.fragmentShader=l.fragmentShader.replace("void main() {",`uniform float uClean;
void main() {`).replace("float ssH =",`pitH *= 1.0 - uClean;
scr *= 1.0 - uClean;
ssRough = mix(ssRough, rF + 0.04, uClean);
ssMetal = mix(ssMetal, mF, uClean);
float ssH =`)},s.customProgramCacheKey=()=>c()+"-clean"});return e}function Qu(t){const e=t.kit.q,n=za(e),o=new pt,a=eu({detail:n,lidAngle:0}),s=a.part.pieces.find(ae=>ae.name==="case-body");s&&Xu(s.geo);const r=Eo(a.part,e,{}),i=Fe.findIndex(ae=>ae.id==="G"),c=r.children.find(ae=>ae.name==="case-body")?.material??null;o.add(r);const l=ec(r.children),d=_e.hinge,u=new pt;u.position.set(d.x,d.y,0);const p=[];r.children.slice().forEach(ae=>{/^lid-/.test(ae.name)&&(p.push(ae),ae.position.x-=d.x,ae.position.y-=d.y,u.add(ae))}),o.add(u);const f=ae=>p.find(G=>G.name===ae),v=f("lid-outside"),h=f("lid-inside");v&&Oo(v.material,.25),v&&Ks(Xa("lid-out",v,{at:[0,_e.lidDome+.2,0],right:[1,0,0],up:[0,0,-1],width:11,depth:.8},t.lang).ready),h&&Ks(Xa("lid-in",h,{at:[0,_e.lidDome+.2-_e.lidT,0],right:[0,0,-1],up:[1,0,0],width:44,depth:1.6},t.lang,{lit:.3}).ready);let m=null;const M=6,x=/^(case-body|case-hinge|hand-(hour|minute|second|pipes)|enamel-\d|numerals-\d)$/,g={value:0};if(e!=="low"&&h){m=new Sa(new $a(23.6,48),{textureWidth:512,textureHeight:512,clipBias:.02,color:16777215}),m.rotation.x=Math.PI/2,m.position.set(25.55,_e.caseTop-d.y+.32,0);const G=m.material;G.colorWrite=!1,G.depthWrite=!1,m.renderOrder=-1,m.camera.layers.set(M),u.add(m),Zu(h.material,m.getRenderTarget().texture,G.uniforms.textureMatrix.value,g);const te=m.onBeforeRender.bind(m);let V=!1;m.onBeforeRender=(B,U,H,pe,he,ge)=>{const W=p.map(ie=>ie.visible);p.forEach(ie=>ie.visible=!1),V||(V=!0,U.traverse(ie=>{let ye=ie,Ae="";for(;ye&&!Ae;)Ae=ye.name,ye=ye.parent;(ie.isLight||x.test(Ae))&&ie.layers.enable(M)})),wa.value=0,te(B,U,H,pe,he,ge),wa.value=1,p.forEach((ie,ye)=>ie.visible=W[ye])}}const w=Gi({detail:n,hollow:{x:0,z:0,r:200,depth:2},water:.6,ripples:0}),y=Eo(w.part,e,{water:w.water,ripples:w.ripples,shadows:e!=="low"});y.position.y=Qi+1.4-w.water.y,o.add(y);const S=tt(404),R=J0(46,()=>{const ae=S()*Math.PI*2,G=6+Math.sqrt(S())*70;return{p:new _(Math.cos(ae)*G,6+S()*48,Math.sin(ae)*G),up:new _((S()-.5)*.3,1,(S()-.5)*.3)}},5,[.35,.6,1]),k=J0(34,(ae,G)=>{const te=9+Math.pow(ae,.6)*15,V=Math.PI+(G-.5)*2.4*(1-ae*.3),B=Math.cos(V)*te,U=Math.sin(V)*te,H=.95+(_e.lidDome+.2-.95)*(1-(te/24.6)**2)+_e.caseTop-.01;return{p:new _(B-d.x,H-d.y,U),up:new _(0,1,0)}},9,[.22,.38,.6]),L=Bo([],[...R.map((ae,G)=>({geo:Q0(n),finish:"drop",seed:80+G,mats:ae,name:`air-${G}`}))]),C=Bo([],[{geo:Q0(n,!0),finish:"drop",seed:90,mats:k.flat(),name:"beads"}]),z=Eo(L,e,{shadows:!1,sphereOf:()=>Z0(1,.7)}),b=Eo(C,e,{shadows:!1,sphereOf:()=>Z0(1,.42)});o.add(z),u.add(b),r.updateMatrixWorld(!0);const P=new y0,I=new _(0,-1,0),F=tt(431),D=[[200,4.5],[232,3.5],[158,3],[268,4]],J=J0(40,(ae,G)=>{const te=D[Math.min(3,Math.floor(F()*4))],V=(te[0]+(ae-.5)*2*te[1]*(.4+.6*F()))*Math.PI/180,B=22.9+G*1.7;P.set(new _(B*Math.sin(V),20,-B*Math.cos(V)),I);const U=P.intersectObjects(r.children,!1)[0];if(!U?.face)return null;const H=U.face.normal.clone().transformDirection(U.object.matrixWorld);return H.y<.6?null:{p:U.point.clone().addScaledVector(H,-.01),up:H}},13,[.16,.26,.4]),Y=Eo(Bo([],[{geo:Q0(n,!0),finish:"drop",seed:93,mats:J.flat(),name:"gate-drops"}]),e,{shadows:!1,sphereOf:()=>Z0(1,.42)});Y.visible=!1,o.add(Y);let oe=0;return{group:o,lid:u,street:y,air:z,lidAngle:()=>oe,update(ae){const G=ae.i;y.visible=z.visible=G<=3,Y.visible=G===i,u.visible=G<=3||G>=9,m&&(m.visible=G<=0||G>=9,g.value=m.visible?G===0?.08:.12:0),oa.value=G===0?.12:1,c&&(c.envMap=t.scene.environment,c.envMapIntensity=G===1?.03:G===i&&ae.local("G")>.3?.04:t.scene.environmentIntensity);const te=G===i&&(ae.inHold||ae.u>.3),V=te||G>=9;for(const[H,pe]of l)H.uAge.value=V?0:pe;Ji.value=V?1:0;let B=Yu(ae.local("0"));const U=ae.trick("0");if(U.k>0){const H=U.phase,pe=ve(H/.55)*(1-ve((H-.62)/.2)),he=H>.62&&H<.95?Math.sin((H-.62)*60)*Math.exp(-(H-.62)*14)*.45:0;B-=(3.5*pe+he)*U.k}if(G>=9){B=Va;const H=ae.trick("8");H.rare>=0&&(B=Va*(1-ve(Math.max(0,H.rare-.85)/.15)))}oe=B,u.rotation.z=B*Ku}}}const Rs=Math.PI/180,Ju={n:6},l0=Zn,ds={v:-1},ha={x:30,z:0,r:260,water:.72,stone:.03},$r=-14+1.4,jr=2.6,O0={lift:60,shift:[-34,39],turn:Math.PI},Ys=Math.PI*2,x0={mirrorShut:.62,fall:.07},V0={angle:.25,blade:.5},e1=1,t1=x0.mirrorShut+x0.fall;function n1(t){const e=Math.floor(t),n=t-e,o=ve(n/.09)+.1*Math.sin(xt((n-.09)/.25)*Math.PI)*Math.exp(-n*4);return Ro+(e+o)*Ys/60}const o1=`
attribute vec4 aR;
uniform float uTime;
uniform float uFreeze;
uniform float uY0;
uniform float uH;
uniform float uLen;
varying vec3 vW;
varying float vA;
void main() {
  float sp = aR.w;
  float yy = mix(mod(aR.z - uTime * sp * 520.0, uH), aR.z, uFreeze);
  vec3 c = vec3(aR.x, uY0 + yy, aR.y);
  vec3 toC = normalize(cameraPosition - c);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), toC));
  float L = mix(uLen * sp, 0.55, uFreeze), w = mix(0.06, 0.16, uFreeze);
  vec3 p = c + side * position.x * w + vec3(0.0, 1.0, 0.0) * position.y * L;
  vA = position.y + 0.5;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,a1=`
uniform vec3 uBF;
uniform vec3 uBD;
uniform float uBC;
uniform float uGain;
uniform float uFreeze;
varying vec3 vW;
varying float vA;
void main() {
  vec3 d = normalize(vW - uBF);
  float cone = smoothstep(uBC, uBC + 0.025, dot(d, uBD));
  float along = mix(smoothstep(0.0, 0.7, vA) * smoothstep(1.0, 0.85, vA), 1.0 - abs(vA - 0.5) * 1.6, uFreeze);
  float g = (0.012 + cone) * along * uGain;
  gl_FragColor = vec4(vec3(0.62, 0.61, 0.6) * g, 0.0);
}`;function s1(t,e,n){const o=t.kit.q,a=new pt,s=Fe.findIndex(j=>j.id==="8"),r=Gi({detail:za(o),seed:27,hollow:{x:ha.x,z:ha.z,r:ha.r,depth:16},water:ha.water,ripples:8}),i=Eo(r.part,o,{water:r.water,ripples:r.ripples,shadows:o!=="low"});i.position.y=$r-r.water.y,a.add(i),i.traverse(j=>{const X=j.material;if(X&&X.ss?.uWet){X.ss.uWet.value=1;const le=X.onBeforeCompile.bind(X);X.onBeforeCompile=(xe,Ce)=>{le(xe,Ce),xe.fragmentShader=xe.fragmentShader.replace("diffuseColor.rgb = sc;",`diffuseColor.rgb = sc * ${ha.stone.toFixed(3)};`)},X.customProgramCacheKey=()=>"stone-soaked"}});const c=i.getObjectByName("setts");c&&(c.visible=!1);const l=i.getObjectByName("joints");l&&(l.visible=!1);const d=i.getObjectByName("puddle"),u=$r;d?.ss&&(d.ss.uRipR.value=22,d.ss.uSpec.value=.6,d.ss.uLd.value.set(.1,1,.12).normalize());const p=o==="low"?260:620,f=150,v=tt(8080),h=new P0;h.index=new ra(new Uint16Array([0,1,2,0,2,3]),1),h.setAttribute("position",new ct([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3));const m=new Float32Array(p*4);for(let j=0;j<p;j++){const X=v()*Ys,le=Math.sqrt(v())*110;m.set([Math.cos(X)*le-10,Math.sin(X)*le,v()*f,.75+v()*.5],j*4)}h.setAttribute("aR",new xn(m,4)),h.instanceCount=p;const M={uTime:{value:0},uFreeze:{value:0},uY0:{value:u},uH:{value:f},uLen:{value:16},uBF:{value:new _},uBD:{value:new _(0,-1,0)},uBC:{value:.95},uGain:{value:.32}},x=new fn({uniforms:M,vertexShader:o1,fragmentShader:a1,transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendEquation:Ua}),g=new Ke(h,x);g.frustumCulled=!1,a.add(g);const w=new pt,y=new ms;y.moveTo(-.9,-3),y.lineTo(-.55,0),y.lineTo(-.06,40),y.lineTo(.06,40),y.lineTo(.55,0),y.lineTo(.9,-3),y.closePath();const S=new Ke(new xi(y,{depth:.3,bevelEnabled:!0,bevelThickness:.08,bevelSize:.08,bevelSegments:2}),new Pn({color:3802114})),R=new Ke(new oo(1,1),new fn({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uLead:{value:-1},uTrail:{value:-1},uAsp:{value:1.78},uP:{value:new bt(-1.02,-1.04)}},vertexShader:"varying vec2 vU; void main() { vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uLead;
uniform float uTrail;
uniform float uAsp;
uniform vec2 uP;
varying vec2 vU;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = (vU * 2.0 - 1.0) - uP;
  q.x *= uAsp;
  float a = atan(q.x, q.y), r = length(q);
  float lead = uLead + (n(vec2(r * 3.0, uLead * 4.0)) - 0.5) * 0.08;
  float d = smoothstep(lead + 0.02, lead - 0.16, a) * smoothstep(uTrail - 0.03, uTrail + 0.05, a);
  gl_FragColor = vec4(0.0, 0.0, 0.0, d * 0.65);
}`})),k=new pt;k.add(S),w.add(k,R),w.visible=!1;const L=_e.hinge,C=_e.lidDome+.2-_e.lidT-.35-L.y,z=tt(77),b=new ua(1,20,14),P=new ya({color:394758,roughness:.05,metalness:.2,envMapIntensity:2.5}),I=Array.from({length:Ju.n},()=>({z:(z()-.5)*26,ph:z(),sp:.06+z()*.05,r:.45+z()*.35,wob:z()*6})),F=I.map(j=>{const X=new Ke(b,P);return X.scale.set(j.r,j.r*.55,j.r),e.lid.add(X),X}),D=e.lid.getObjectByName("lid-inside"),J=(j,X)=>{if(!D)return C;const xe=new y0(e.lid.localToWorld(new _(j-L.x,-40,X)),new _(0,1,0).transformDirection(e.lid.matrixWorld)).intersectObject(D,!1)[0];return xe?e.lid.worldToLocal(xe.point.clone()).y:C};e.group.updateMatrixWorld(!0);const Y=I.map(j=>Array.from({length:25},(X,le)=>{const xe=21-le/24*42;return J(xe,j.z*Math.sqrt(Math.max(0,1-(xe/24)**2)))})),oe=new y0,ae=new bt,G=new k0(new _(0,1,0),-u),te=new _,V=d?.ss?.uRip?.value??[],B={uRip:{value:V},uRipN:{value:0},uTime:{value:0},uR:{value:22},uC:{value:new _(ha.x,u+.05,ha.z)},uPR:{value:92}},U=new fn({uniforms:B,transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendEquation:Ua,vertexShader:`varying vec3 vW;
void main() {vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;}`,fragmentShader:`uniform vec4 uRip[8];
uniform int uRipN;
uniform float uTime;
uniform float uR;
uniform vec3 uC;
uniform float uPR;
varying vec3 vW;
void main() {
  float g = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uRipN) break;
    vec4 r = uRip[i];
    if (r.w <= 0.0) continue;
    vec2 dv = vW.xz - r.xy;
    float d = length(dv), age = fract(uTime * r.w * 0.45 + r.z), R = age * uR, a = atan(dv.y, dv.x);
    float x = (d - R) / (0.35 + age * 1.2);
    float k = i >= 6 ? 0.22 : 0.06;
    float br = 0.45 + 0.55 * smoothstep(-0.3, 0.8, sin(a * 3.0 + r.z * 41.0 + float(i)) * 0.6 + sin(a * 7.0 - r.z * 17.0) * 0.4);
    g += exp(-x * x) * pow(max(1.0 - age, 0.0), 1.5) * k * br * smoothstep(0.0, 0.15, age);
  }
  g *= 1.0 - smoothstep(uPR * 0.8, uPR, length(vW.xz - uC.xz));
  gl_FragColor = vec4(vec3(0.62, 0.61, 0.6) * g, 0.0);
}`}),H=new Ke(new oo(220,220).rotateX(-Math.PI/2),U);H.position.copy(B.uC.value),H.renderOrder=4,a.add(H);const pe=tt(31),he=Array.from({length:6},()=>[pe(),.7+pe()*.6]),ge=[];e.lid.traverse(j=>{j.isReflector&&ge.push(j)});const W=new fe().makeTranslation(O0.shift[0],O0.lift+u,O0.shift[1]).multiply(new fe().makeScale(1,-1,1)).multiply(new fe().makeTranslation(0,-u,0)).multiply(new fe().makeRotationY(O0.turn));let ie=Va,ye=1;if(d){const j=d.onBeforeRender.bind(d);d.onBeforeRender=(X,le,xe,Ce,Ee,Je)=>{if(!a.visible){j(X,le,xe,Ce,Ee,Je);return}const A=n.hand.rotation.y,E=e.lid.rotation.z;be&&(M.uFreeze.value=1,n.hand.rotation.y=-Ro),e.lid.rotation.z=ie*Rs;const Z=e.air.visible,se=ge.map(K=>K.visible);e.air.visible=!1,ge.forEach(K=>K.visible=!1);for(const K of[e.group,n.group])K.matrixAutoUpdate=!1,K.matrix.copy(W),K.matrixWorldNeedsUpdate=!0;let ue=null;le.traverse(K=>{!ue&&K.isSpotLight&&(ue=K)});const T=ue,q=T?.position.clone(),$=T?.target.position.clone(),de=T?.intensity??0,re=oa.value,ne=le.environmentIntensity;oa.value*=ye,le.environmentIntensity=ne*ye,T&&(T.intensity*=ye,T.position.applyMatrix4(W),T.target.position.applyMatrix4(W),T.updateMatrixWorld(),T.target.updateMatrixWorld()),Ue.uniforms.uG.value=o==="low"?jr*.55:jr,j(X,le,xe,Ce,Ee,Je),Ue.uniforms.uG.value=1,oa.value=re,le.environmentIntensity=ne,T&&q&&$&&(T.intensity=de,T.position.copy(q),T.target.position.copy($),T.updateMatrixWorld(),T.target.updateMatrixWorld());for(const K of[e.group,n.group])K.matrixAutoUpdate=!0,K.updateMatrix(),K.updateMatrixWorld(!0);e.air.visible=Z,ge.forEach((K,ze)=>K.visible=se[ze]),M.uFreeze.value=Ae,n.hand.rotation.y=A,e.lid.rotation.z=E}}let Ae=0,be=!1;const Se=new _,Be=new _,Le=new Wt,Ve=new _(0,1,0);let Ye=null,Pe=!1;const Ue=new fn({uniforms:{uL:{value:new _(.35,1,.25).normalize()},uG:{value:1}},vertexShader:"varying vec3 vN; varying vec3 vV; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uL;
uniform float uG;
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN);
  float d = 0.5 + 0.5 * dot(n, uL), h = pow(max(dot(n, normalize(uL + vV)), 0.0), 24.0);
  gl_FragColor = vec4(vec3((0.07 + 0.1 * d + 0.16 * h) * uG, 0.0, 0.0), 1.0);
}`}),et=n.hand.children.filter(j=>j.name==="hand-second"||j.name==="hand-collet"),Ie=et.map(j=>j.material);let ke=!1;const ee=j=>{j!==ke&&(ke=j,et.forEach((X,le)=>X.material=j?Ue:Ie[le]))};return{group:a,update(j){Pe&&(t.scene.environmentIntensity=1,Pe=!1);const X=j.i,le=X===s;a.visible=le,ee(le&&j.inHold),le&&j.inHold&&(Qn.gain.value=0),w.parent!==j.camera&&j.camera.add(w);const xe=ds.v>=0?ds.v:X===s&&!j.inHold?j.u:-1;if(w.visible=xe>0&&xe<l0.trail[1]+.02,w.visible){const T=j.camera.fov*Rs,q=6,$=Math.tan(T/2)*q,de=$*j.camera.aspect,re=Gs(xe,l0.lead),ne=xe<l0.trail[0]?-1:Gs(xe,l0.trail);R.position.set(0,0,-q),R.scale.set(de*2,$*2,1),R.renderOrder=10;const K=R.material.uniforms;K.uLead.value=re,K.uTrail.value=ne,K.uAsp.value=j.camera.aspect,k.position.set(de*K.uP.value.x,$*K.uP.value.y,-q+.5),k.scale.setScalar(Math.hypot(de*2.1,$*2.1)*1.05/40),k.rotation.z=-ne,S.visible=xe>=l0.trail[0]-.03}if(!le){F.forEach(T=>T.visible=!1);return}const Ce=j.state.reduced?0:j.state.time,Ee=j.trick("8"),Je=Ee.rare,A=Je>=0?ve(xt(Je/x0.mirrorShut)):0;ie=Va*(1-A),ye=(1-ve((A-.45)/.4))**2;const E=Je>=0?xt((Je-x0.mirrorShut)/x0.fall):0,Z=Je>=t1;if(Je>=0){const T=E<1?Va*(1-E*E):0;e.lid.rotation.z=T*Rs}Ae=Z?1:0,F.forEach((T,q)=>{const $=I[q],de=((Ce*$.sp+$.ph)%1+1)%1,re=de*de,ne=21-re*42,K=$.z*Math.sqrt(Math.max(0,1-(ne/24)**2))+Math.sin(de*9+$.wob)*.6,ze=(21-ne)/42*24,Ne=Math.min(23,Math.floor(ze)),Te=Y[q][Ne]+(Y[q][Ne+1]-Y[q][Ne])*(ze-Ne);T.position.set(ne-L.x,Te-$.r*.45,K),T.visible=!Z&&de<.96&&Math.hypot(ne,K)<23}),be=Ee.on||Z,M.uFreeze.value=Ae,e.air.visible=Z,g.visible=!Z,i.visible=!Z,e.street.visible=Z;const se=Z?0:Ce;n.hand.rotation.y=-(Z?Ro:n1(se)),M.uTime.value=Ce;let ue=null;if(t.scene.traverse(T=>{!ue&&T.isSpotLight&&(ue=T)}),ue){const T=ue;if(Z){const $=Fe[0].light.blade,de=1+(e1/(Fe[9].exposure??1)-1)*1;if(T.position.lerp(Se.set(...$.from),1),T.target.position.lerp(Se.set(...$.to),1),T.angle+=($.angle*V0.angle-T.angle)*1,T.intensity=(T.intensity+($.power*.4*V0.blade-T.intensity)*1)*de,T.updateMatrixWorld(),T.target.updateMatrixWorld(),Ye||t.scene.traverse(re=>{const ne=re.material?.uniforms;!Ye&&re.renderOrder===5&&ne?.uCam&&ne?.uGain&&(Ye=re)}),Ye){const re=Ye.material.uniforms,ne=Fe[0].light,K=Se.set(...$.from),ze=Be.set(...$.to).sub(K),Ne=ze.length()*1.15;Ye.position.lerp(K,1),Le.setFromUnitVectors(Ve,ze.normalize().negate()),Ye.quaternion.slerp(Le,1);const Te=Math.tan($.angle*V0.angle)*Ne;Ye.scale.lerp(Be.set(Te,Ne,Te),1),re.uGain.value=(re.uGain.value+(ne.haze*.18*V0.blade-re.uGain.value)*1)*de}oa.value=(oa.value+(.12-oa.value)*1)*de,t.scene.environmentIntensity=de,Pe=!0}M.uBF.value.copy(T.position),M.uBD.value.copy(T.target.position).sub(T.position).normalize(),M.uBC.value=Math.cos(T.angle)}if(d?.ss){const T=d.ss;T.uTime.value=Z?0:Ce,B.uTime.value=T.uTime.value,T.uRipN.value=8;for(let $=0;$<6;$++){const[de,re]=he[$],ne=Math.floor(Ce*re*.45+de),K=tt($*977+ne*13+5),ze=K()*Ys,Ne=30+Math.sqrt(K())*70;V[$].set(Math.cos(ze)*Ne-10,Math.sin(ze)*Ne,de,Z?0:re)}const q=Ee.on?Ee.k:0;ae.set((j.state.pointer.x-.5)*2,-(j.state.pointer.y-.5)*2),oe.setFromCamera(ae,j.camera),q>0&&oe.ray.intersectPlane(G,te)?(V[6].set(te.x,te.z,0,1.8),V[7].set(te.x,te.z,.5,1.8)):(V[6].set(0,0,0,0),V[7].set(0,0,0,0),T.uRipN.value=6),Z&&(T.uRipN.value=0),B.uRipN.value=T.uRipN.value,H.visible=!Z}}}}const tc=[];function ws(t){tc.push(t)}function r1(){for(const t of tc)t()}function i1(t,e){t instanceof ja&&t.environment&&e.has(t.environment)&&(t.environment=e.get(t.environment)),t.traverse(n=>{const o=n.material;if(o)for(const a of Array.isArray(o)?o:[o]){const s=a;for(const r of Object.keys(s)){const i=s[r];i instanceof kr&&e.has(i)&&(s[r]=e.get(i),a.needsUpdate=!0)}if(s.uniforms)for(const r of Object.values(s.uniforms))r&&r.value instanceof kr&&e.has(r.value)&&(r.value=e.get(r.value))}})}const c1=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,l1=`
uniform sampler2D tSrc;
varying vec2 vUv;
void main() {
  vec4 s4 = texture2D(tSrc, vUv);
  vec3 c = s4.rgb * clamp(s4.a - 1.0, 0.0, 1.0);
  float r = c.r, o = max(c.g, c.b);
  float purity = clamp((r - 3.2 * o) / max(r, 1e-4), 0.0, 1.0);
  float lift = smoothstep(0.05, 0.6, r);
  gl_FragColor = vec4(vec3(r, o * 0.15, o * 0.15) * purity * lift, 1.0);
}`,u1=`
uniform sampler2D tSrc;
uniform vec2 uDir;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(tSrc, vUv).rgb * 0.227;
  s += texture2D(tSrc, vUv + uDir * 1.385).rgb * 0.316;
  s += texture2D(tSrc, vUv - uDir * 1.385).rgb * 0.316;
  s += texture2D(tSrc, vUv + uDir * 3.231).rgb * 0.070;
  s += texture2D(tSrc, vUv - uDir * 3.231).rgb * 0.070;
  gl_FragColor = vec4(s, 1.0);
}`,d1=`
#include <packing>
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tB1;
uniform sampler2D tB2;
uniform sampler2D tB3;
uniform sampler2D tFade;
uniform float uFade;
uniform float uSweep;
uniform float uNear;
uniform float uFar;
uniform float uFocus;
uniform float uFocusN;
uniform float uFocusF;
uniform float uAperture;
uniform float uMaxBlur;
uniform vec2 uTexel;
uniform float uExposure;
uniform float uNeutral;
uniform float uBloom;
uniform float uGrain;
uniform float uSeed;
uniform float uVig;
uniform float uAspect;
uniform float uCover;
uniform float uRim;
float rimR(vec3 x) { return smoothstep(1.8, 2.6, x.r / max(max(x.g, x.b), 1e-4)) * smoothstep(0.004, 0.012, x.r); }
uniform float uAO;
uniform sampler2D tVol;
uniform float uVolOn;
uniform vec2 uVTexel;
uniform vec2 uKAO[12];
uniform vec2 uKDOF[16];
varying vec2 vUv;
float viewZ(vec2 uv) {
  float d = texture2D(tDepth, uv).x;
  return -perspectiveDepthToViewZ(d, uNear, uFar);
}
float coc(float z) { return clamp((max(uFocusN - z, 0.0) + max(z - uFocusF, 0.0)) / max(z, 1e-3) * uAperture, 0.0, uMaxBlur); }
float hash(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
vec3 tone(vec3 x) {
  x *= uExposure;
  vec3 a = x * (2.51 * x + 0.03);
  vec3 b = x * (2.43 * x + 0.59) + 0.14;
  vec3 y = clamp(a / b, 0.0, 1.0);
  return pow(max(y, 0.0), vec3(1.18));
}
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float ao(vec2 uv, float z) {
  float occ = 0.0;
  float rad = clamp(60.0 / z, 6.0, 48.0) * uAO;
  float range = 0.09 * z;
  for (int i = 0; i < 12; i++) {
    vec2 o = uKAO[i] * rad * uTexel;
    float d = z - viewZ(uv + o);
    occ += clamp(d / range, 0.0, 1.0) * (1.0 - smoothstep(range, range * 2.5, d));
  }
  return 1.0 - 0.75 * occ / 12.0;
}
void main() {
  float z = viewZ(vUv);
  float r0 = coc(z);
  vec3 acc = texture2D(tColor, vUv).rgb;
  float wsum = 1.0;
  if (r0 > 0.5) {
    for (int i = 0; i < 16; i++) {
      vec2 k = uKDOF[i];
      float rr = length(k);
      vec2 o = k * r0 * uTexel;
      vec2 uv = vUv + o;
      float rs = coc(viewZ(uv));
      float w = smoothstep(rr * r0 - 1.0, rr * r0 + 1.0, max(rs, r0 * step(z, viewZ(uv)) ));
      acc += texture2D(tColor, uv).rgb * w;
      wsum += w;
    }
  }
  vec3 c = acc / wsum;
  if (uRim > 0.0) {
    float nr = 0.0;
    for (int k = 0; k < 8; k++) {
      vec2 o = vec2(k < 4 ? 1.0 : 2.0) * vec2(k % 2 == 0 ? (k % 4 == 0 ? 1.0 : -1.0) : 0.0, k % 2 == 1 ? (k % 4 == 1 ? 1.0 : -1.0) : 0.0);
      nr = max(nr, rimR(texture2D(tColor, vUv + o * uTexel).rgb));
    }
    c *= 1.0 - 0.85 * uRim * nr * (1.0 - rimR(texture2D(tColor, vUv).rgb));
  }
  if (uAO > 0.0) c *= ao(vUv, z);
  c += (texture2D(tB1, vUv).rgb * 0.9 + texture2D(tB2, vUv).rgb * 0.25 + texture2D(tB3, vUv).rgb * 0.0) * uBloom;
  if (uVolOn > 0.5) {
    vec3 vs = vec3(0.0);
    float vw = 0.0;
    float zr = 0.03 * z + 0.01;
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(0.0, 0.0)); float w = 0.2 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(1.0, 1.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(-1.0, 1.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(1.0, -1.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(-1.0, -1.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(2.0, 0.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(-2.0, 0.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(0.0, 2.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    { vec4 s = texture2D(tVol, vUv + uVTexel * vec2(0.0, -2.0)); float w = 0.1 * exp(-abs(s.a - z) / zr) + 1e-5; vs += s.rgb * w; vw += w; }
    c += vs / vw;
  }
  c = tone(c);
  if (uNeutral > 0.0) { float red = smoothstep(1.55, 1.8, c.r / max(max(c.g, c.b), 1e-4)); c = mix(c, mix(vec3(dot(c, vec3(0.299, 0.587, 0.114))), c, red), uNeutral); }
  vec2 q = vUv - 0.5; q.x *= uAspect;
  c *= mix(1.0, smoothstep(0.95, 0.2, length(q)), uVig);
  c *= 1.0 - uCover;
  c = srgb(c);
  c = c * (1.0 + (hash(floor(gl_FragCoord.xy) * 0.0137 + fract(uSeed * 0.618) * 7.0) - 0.5) * uGrain * 6.0) + (hash(floor(gl_FragCoord.xy) * 0.0291 + 3.1) - 0.5) * uGrain * 0.12;
  c = max(c, 0.0);
  float mx = max(c.g, c.b);
  float redness = smoothstep(1.15, 1.28, c.r / max(mx, 1e-4)) * smoothstep(0.03, 0.07, c.r - mx) * (1.0 - smoothstep(0.9, 0.98, mx));
  c.gb = mix(c.gb, min(c.gb, vec2(0.18 * c.r)), redness);
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float sat = (max(c.r, mx) - min(c.r, min(c.g, c.b))) / max(max(c.r, mx), 1e-4);
  float neutral = 1.0 - smoothstep(0.2, 0.45, sat);
  float capL = lum > 0.58 ? 0.58 + 0.105 * (1.0 - exp(-(lum - 0.58) / 0.105)) : lum;
  c *= mix(1.0, capL / max(lum, 1e-4), neutral);
  float fk = uFade;
  if (uSweep > -8.0) { vec2 sq = (vUv * 2.0 - 1.0) - vec2(-1.02, -1.04); sq.x *= uAspect; fk *= smoothstep(uSweep - 0.004, uSweep + 0.03, atan(sq.x, sq.y)); }
  c = mix(c, texture2D(tFade, vUv).rgb, fk);
  gl_FragColor = vec4(c, 1.0);
}`,f1=`
uniform sampler2D tDepth;
uniform sampler2D tNz;
uniform mat4 uInvProj;
uniform mat4 uCamW;
uniform vec3 uCamP;
uniform vec3 uBA;
uniform vec3 uBD;
uniform float uBCos;
uniform float uBPow;
uniform vec4 uCols[16];
uniform int uNCol;
uniform vec3 uRC;
uniform vec3 uRS;
uniform float uRP;
uniform vec3 uRuby;
uniform float uRuP;
uniform vec3 uPC;
uniform float uPR;
uniform float uPW;
uniform float uPG;
uniform float uFloor;
uniform vec2 uVFade;
uniform float uT;
uniform float uSteps;
uniform float uRSteps;
uniform vec4 uNave;
varying vec2 vUv;
vec3 worldAt(vec2 uv, float d) {
  vec4 v = uInvProj * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  v /= v.w;
  return (uCamW * v).xyz;
}
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float nz(vec3 p) {
  float a = textureLod(tNz, p.xz * 0.011 + p.y * 0.006 + vec2(0.0, uT * 0.0015), 0.0).b;
  float b = textureLod(tNz, p.zy * 0.026 + p.x * 0.009 + 0.37, 0.0).b;
  return a * 0.65 + b * 0.55;
}
float colShadow(vec3 X) {
  float sh = 1.0;
  vec2 a = uBA.xz;
  vec2 ab = X.xz - a;
  float L2 = max(dot(ab, ab), 1e-4);
  for (int i = 0; i < 16; i++) {
    if (i >= uNCol) break;
    vec4 c = uCols[i];
    float s = clamp(dot(c.xy - a, ab) / L2, 0.0, 1.0);
    float dd = length(a + ab * s - c.xy);
    float y = mix(uBA.y, X.y, s);
    float occ = (1.0 - smoothstep(c.z * 0.85, c.z * 1.1, dd)) * smoothstep(c.w + 0.3, c.w - 0.3, y) * step(0.01, s);
    sh *= 1.0 - occ * 0.985;
  }
  return sh;
}
vec3 scatter(vec3 X, vec3 rd, float mir) {
  vec3 v = X - uBA;
  float t = dot(v, uBD);
  float c = t / max(length(v), 1e-3);
  float rf = sqrt(max(1.0 - c, 0.0) / max(1.0 - uBCos, 1e-5));
  float cone = (1.0 - smoothstep(0.5, 1.0, rf)) * (0.4 + 0.6 * (1.0 - smoothstep(0.1, 0.75, rf))) * step(0.0, t);
  vec3 o = vec3(0.0);
  if (cone > 0.001) {
    float g = 0.6;
    float mu = dot(uBD, -rd);
    float ph = (1.0 - g * g) / pow(max(1.0 + g * g - 2.0 * g * mu, 1e-4), 1.5) * 0.08;
    float dust = 0.3 + 1.6 * smoothstep(0.4, 0.85, nz(X));
    vec3 bu = normalize(cross(uBD, vec3(0.0, 0.0, 1.0)));
    vec3 bw = cross(uBD, bu);
    vec2 ang = vec2(dot(v, bu), dot(v, bw)) / max(t, 1e-3);
    float stk = textureLod(tNz, ang * 9.0 + vec2(0.13, 0.71) + t * 0.0004, 0.0).g;
    float streaks = 0.2 + 1.6 * smoothstep(0.4, 0.68, stk);
    float along = (0.28 + 0.72 * smoothstep(uFloor + 0.5, uFloor + 13.0, X.y)) * (uVFade.y > 0.0 ? 1.0 - smoothstep(uVFade.x - uVFade.y, uVFade.x, X.y) : 1.0);
    o += vec3(0.62, 0.61, 0.6) * cone * colShadow(X) * dust * streaks * along * ph * uBPow * (1.0 - 0.9 * mir);
  }
  if (uNave.w > 0.0) {
    float s = clamp((uNave.y - X.z) / (uNave.y - uNave.z), 0.0, 1.0) * step(uNave.z + 0.4, X.z);
    float lat = exp(-(((X.x - uNave.x) / 5.5) * ((X.x - uNave.x) / 5.5)));
    float hh = exp(-max(X.y - uFloor, 0.0) / 6.0);
    o += vec3(0.62, 0.61, 0.6) * uNave.w * s * s * lat * hh * (0.55 + 0.8 * nz(X * 0.6)) * (1.0 - 0.6 * mir);
  }
  vec3 q = (X - uRC) / uRS;
  float qh = q.x * q.x + q.z * q.z;
  float top = (0.05 + 1.6 * smoothstep(0.42, 0.78, nz(vec3(X.x * 1.4, 0.0, X.z * 1.4) + 7.3))) * (0.2 + 1.2 * exp(-qh * 3.0));
  float qy = q.y / top;
  float gap = smoothstep(0.38, 0.62, nz(vec3(X.x * 1.1, X.y * 0.1, X.z * 1.1) + 11.0));
  float rh = exp(-qh * 2.2 - qy * qy * 1.4) * gap * (0.08 + 1.7 * smoothstep(0.42, 0.85, nz(X * 0.7 + 3.1)));
  float low = exp(-max(X.y - uFloor, 0.0) / (1.1 * mix(1.0, top * 2.4, step(0.5, uRS.x - 2.0))));
  float rg = exp(-length(X - uRuby) / 0.3);
  o += vec3(1.0, 0.0, 0.01) * (rh * low * uRP + rg * uRuP * (1.0 - mir));
  if (uPG > 0.0) {
    float pd = (length(X - uPC) - uPR) / uPW;
    float air = exp(-max(X.y - uFloor, 0.0) / 2.2) * (0.15 + smoothstep(0.35, 0.95, nz(X * 1.3)));
    o += vec3(1.0, 0.0, 0.01) * exp(-pd * pd) * uPG * air * 0.03;
  }
  return o;
}
void main() {
  float d = texture2D(tDepth, vUv).x;
  vec3 P = worldAt(vUv, d);
  vec3 rd = normalize(P - uCamP);
  float tEnd = d >= 1.0 ? 70.0 : min(length(P - uCamP), 70.0);
  float j = bayer4(gl_FragCoord.xy) + 0.03125;
  int N = int(uSteps);
  float dt = tEnd / uSteps;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 48; i++) {
    if (i >= N) break;
    acc += scatter(uCamP + rd * (dt * (float(i) + j)), rd, 0.0) * dt;
  }
  if (d < 1.0 && abs(P.y - uFloor) < 0.03) {
    vec2 sw = vec2(textureLod(tNz, P.xz * 0.045 + 0.3, 0.0).g, textureLod(tNz, P.zx * 0.06 + 0.7, 0.0).b) - 0.5;
    vec3 rr = normalize(reflect(rd, vec3(0.0, 1.0, 0.0)) + vec3(sw.x * 0.04, 0.0, sw.y * 0.04));
    float fres = 0.1 + 0.62 * ((1.0 - clamp(-rd.y, 0.0, 1.0)) * (1.0 - clamp(-rd.y, 0.0, 1.0)) * (1.0 - clamp(-rd.y, 0.0, 1.0)));
    int NR = int(uRSteps);
    float dr = 26.0 / uRSteps;
    vec3 ra = vec3(0.0);
    for (int i = 0; i < 48; i++) {
      if (i >= NR) break;
      ra += scatter(P + rr * (dr * (float(i) + j)), rr, 1.0) * dr;
    }
    acc += ra * fres * 0.4;
  }
  vec4 vv = uInvProj * vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  gl_FragColor = vec4(acc, min(-vv.z / vv.w, 60000.0));
}`,p1=`
uniform sampler2D tSrc;
varying vec2 vUv;
void main() { gl_FragColor = texture2D(tSrc, vUv); }`,$e={on:0,columns:[],floorY:0,red:new _,redSize:new _(1,1,1),redPower:0,ruby:new _,rubyPower:0,bladeGain:1,wake:0,fadeTop:0,fadeLen:0,steps:0,reflSteps:0,bladeFrom:new _,bladeDir:new _(0,-1,0),bladeCos:.98,bladePower:0,nave:new rn,pulseC:new _,pulseR:-1,pulseW:1,pulseG:0,time:0};function h1(t,e){const n=new Ln;n.setAttribute("position",new ct([-1,-1,0,3,-1,0,-1,3,0],3));const o=new wi(-1,1,1,-1,0,1),a=new Ke(n);a.frustumCulled=!1;const s=new ja;s.add(a);const r=(V,B)=>new fn({vertexShader:c1,fragmentShader:V,uniforms:B,depthTest:!1,depthWrite:!1}),i=r(l1,{tSrc:{value:null}}),c=r(u1,{tSrc:{value:null},uDir:{value:new bt}}),l=r(p1,{tSrc:{value:null}}),d=r(f1,{tDepth:{value:null},tNz:{value:Yo().noise},uInvProj:{value:new fe},uCamW:{value:new fe},uCamP:{value:new _},uBA:{value:new _},uBD:{value:new _},uBCos:{value:.98},uBPow:{value:0},uCols:{value:Array.from({length:16},()=>new rn)},uNCol:{value:0},uRC:{value:new _},uRS:{value:new _(1,1,1)},uRP:{value:0},uRuby:{value:new _},uRuP:{value:0},uPC:{value:new _},uPR:{value:-1},uPW:{value:1},uPG:{value:0},uFloor:{value:0},uVFade:{value:new bt},uT:{value:0},uSteps:{value:e==="low"?18:24},uRSteps:{value:24},uNave:{value:new rn}}),u=new sa(1,1,{type:la}),p=r(d1,{tVol:{value:u.texture},uVolOn:{value:0},uVTexel:{value:new bt},tColor:{value:null},tDepth:{value:null},tB1:{value:null},tB2:{value:null},tB3:{value:null},tFade:{value:null},uFade:{value:0},uSweep:{value:-9},uNear:{value:.01},uFar:{value:100},uFocus:{value:10},uFocusN:{value:10},uFocusF:{value:10},uAperture:{value:6},uMaxBlur:{value:10},uTexel:{value:new bt},uExposure:{value:1},uNeutral:{value:0},uBloom:{value:1},uGrain:{value:.04},uSeed:{value:0},uVig:{value:.8},uAspect:{value:1},uCover:{value:0},uRim:{value:0},uAO:{value:e==="high"&&!location.search.includes("noao")?1:0},uKAO:{value:Array.from({length:12},(V,B)=>{const U=B*2.39996+.7,H=(B+.5)/12;return new bt(Math.fround(Math.cos(U)*H),Math.fround(Math.sin(U)*H))})},uKDOF:{value:Array.from({length:16},(V,B)=>{const U=B*2.39996,H=Math.sqrt((B+.5)/16);return new bt(Math.fround(Math.cos(U)*H),Math.fround(Math.sin(U)*H))})}}),f=(V,B)=>{a.material=V,t.setRenderTarget(B),t.render(s,o)},v=e==="high"&&!location.search.includes("nomsaa")?4:0,h=()=>{const V=new yi(1,1);return V.type=Mc,V},m=new sa(1,1,{type:la,samples:v,...v?{}:{depthTexture:h()}}),M=v?new sa(1,1,{type:Os,depthTexture:h()}):null,x=new Pn({colorWrite:!1}),g=[],w=[],y=()=>{},S=new sa(1,1,{type:Os}),R=[0,1,2].map(()=>[0,1].map(()=>new sa(1,1,{type:la})));let k=1,L=1;function C(V,B){k=V,L=B,m.setSize(V,B),S.setSize(V,B),M?.setSize(V,B),u.setSize(Math.max(1,V>>1),Math.max(1,B>>1)),R.forEach((U,H)=>U.forEach(pe=>pe.setSize(Math.max(1,V>>H+1),Math.max(1,B>>H+1))))}function z(V,B){}const b=new Float64Array(1),P=new Int32Array(b.buffer);let I=0,F=0;ws(()=>{F++});const D=V=>{b[0]=V,I=Math.imul(I^P[0],16777619)^P[1],I=Math.imul(I,16777619)},J=V=>{const B=V.elements;for(let U=0;U<16;U++)D(B[U])},Y=[];function oe(V){if(!t.shadowMap.enabled)return;V.updateMatrixWorld(),I=2166136261,D(F),Y.length=0,V.traverseVisible(U=>{if(U.isLight){U.castShadow&&U.shadow&&Y.push(U);return}const H=U;if(!U.castShadow||!H.geometry)return;D(H.id),J(H.matrixWorld),D(H.geometry.id),D(H.geometry.attributes.position?.version??0),D(H.geometry.drawRange.start),D(H.geometry.drawRange.count);for(const he of Array.isArray(H.material)?H.material:[H.material])he&&(D(he.id),D(he.visible?1:0),D(he.side),D(he.alphaTest));const pe=U;if(pe.isInstancedMesh){D(pe.count);const he=pe.instanceMatrix.array;for(let ge=0,W=Math.min(he.length,pe.count*16);ge<W;ge++)D(he[ge])}});const B=I;for(const U of Y){I=B,J(U.matrixWorld);const H=U;H.target&&J(H.target.matrixWorld),D(H.angle??0),D(H.distance??0),D(H.shadow.mapSize.x),D(H.shadow.bias),D(H.shadow.radius);const pe=H.shadow;U.intensity<=0||pe.autoUpdate===!1&&pe.ssKey===void 0||(pe.autoUpdate=!1,(pe.ssKey!==I||!pe.map)&&(pe.needsUpdate=!0,pe.ssKey=I))}}function ae(V,B){if(oe(V),t.setRenderTarget(m),t.clear(),t.info.render.calls,t.shadowMap.autoUpdate,t.render(V,B),!M)return;g.length=0,w.length=0,V.traverseVisible(H=>{const pe=H.material;pe&&!Array.isArray(pe)&&(pe.transparent||!pe.depthWrite)&&g.push(H),H.isReflector&&w.push({o:H,f:H.onBeforeRender})}),g.forEach(H=>{H.visible=!1}),w.forEach(H=>{H.o.onBeforeRender=y}),V.overrideMaterial=x;const U=t.shadowMap.autoUpdate;t.shadowMap.autoUpdate=!1,t.setRenderTarget(M),t.clear(),t.render(V,B),V.overrideMaterial=null,t.shadowMap.autoUpdate=U,g.forEach(H=>{H.visible=!0}),w.forEach(H=>{H.o.onBeforeRender=H.f})}function G(V,B,U){const H=m.texture;i.uniforms.tSrc.value=H,f(i,R[0][0]);let pe=R[0][0];for(let ge=0;ge<3;ge++){ge>0&&(l.uniforms.tSrc.value=pe.texture,f(l,R[ge][0]));const[W,ie]=R[ge],ye=1/W.width,Ae=1/W.height;c.uniforms.tSrc.value=W.texture,c.uniforms.uDir.value.set(ye*1.5,0),f(c,ie),c.uniforms.tSrc.value=ie.texture,c.uniforms.uDir.value.set(0,Ae*1.5),f(c,W),pe=W}const he=p.uniforms;if(he.tColor.value=H,he.tDepth.value=M?M.depthTexture:m.depthTexture,he.tB1.value=R[0][0].texture,he.tB2.value=R[1][0].texture,he.tB3.value=R[2][0].texture,he.tFade.value=U===S?R[2][1].texture:S.texture,he.uFade.value=U===S?0:B.fade,he.uSweep.value=U===S?-9:B.sweep??-9,he.uNear.value=V.near,he.uFar.value=V.far,he.uFocus.value=B.focus,he.uFocusN.value=B.focusN??B.focus,he.uFocusF.value=B.focusF??B.focus,he.uAperture.value=B.aperture*L/1e3,he.uMaxBlur.value=(e==="low"?6:12)*(B.blurMul??1),he.uTexel.value.set(1/k,1/L),he.uExposure.value=B.exposure,he.uNeutral.value=B.neutral??0,he.uBloom.value=B.bloom,he.uGrain.value=B.grain,he.uSeed.value=B.seed,he.uVig.value=B.vig,he.uAspect.value=k/L,he.uCover.value=B.cover,he.uRim.value=B.rim??0,he.uVolOn.value=$e.on,$e.on){const ge=d.uniforms;ge.tDepth.value=he.tDepth.value,ge.uInvProj.value.copy(V.projectionMatrixInverse),ge.uCamW.value.copy(V.matrixWorld),ge.uCamP.value.setFromMatrixPosition(V.matrixWorld),ge.uBA.value.copy($e.bladeFrom),ge.uBD.value.copy($e.bladeDir),ge.uBCos.value=$e.bladeCos,ge.uBPow.value=$e.bladePower*$e.bladeGain;const W=Math.min(16,$e.columns.length);ge.uNCol.value=W;for(let ye=0;ye<W;ye++)ge.uCols.value[ye].set($e.columns[ye][0],$e.columns[ye][1],$e.columns[ye][2],$e.columns[ye][3]);ge.uRC.value.copy($e.red),ge.uRS.value.copy($e.redSize),ge.uRP.value=$e.redPower,ge.uRuby.value.copy($e.ruby),ge.uRuP.value=$e.rubyPower,ge.uPC.value.copy($e.pulseC),ge.uPR.value=$e.pulseR,ge.uPW.value=$e.pulseW,ge.uPG.value=$e.pulseG,ge.uFloor.value=$e.floorY,ge.uVFade.value.set($e.fadeTop,$e.fadeLen),ge.uT.value=$e.time,ge.uNave.value.copy($e.nave);const ie=$e.steps||(e==="low"?18:24);ge.uSteps.value=ie,ge.uRSteps.value=$e.reflSteps||ie,f(d,u),he.uVTexel.value.set(1/u.width,1/u.height)}f(p,U)}function te(){const V=new pt;for(const B of[i,c,l,d,p])V.add(new Ke(n,B));t.compile(V,o,s)}return{setSize:C,useGtao:z,drawScene:ae,finish:G,compile:te,fadeTarget:S,mainTarget:m,scratch:R[0][1],depthPass:!!M,get size(){return[k,L]}}}const m1=`
{
  float ssNL = dot( geometryNormal, directLight.direction );
  float ssW = saturate( ssNL * 0.6 + 0.4 );
  vec3 ssC = material.diffuseColor;
  #if defined( STANDARD ) || defined( PHONG )
  ssC += material.specularColor * 0.6;
  #endif
  vec3 ssA = directLight.color * ssW * ssW * RECIPROCAL_PI * ssC;
  reflectedLight.directDiffuse += ssA / (1.0 + ssA * 4.0);
}`;{const t=Sc,e=t.lights_fragment_begin,n=e.indexOf("getPointLightInfo"),o="RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",a=e.indexOf(o,n);n>0&&a>n&&!e.includes("ssNL")&&(t.lights_fragment_begin=e.slice(0,a)+m1+e.slice(a+o.length))}const v1=`
varying vec3 vP;
varying vec3 vN;
varying vec3 vW;
void main() {
  vP = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,g1=`
uniform float uGain;
uniform float uSeed;
uniform vec3 uCam;
varying vec3 vP;
varying vec3 vN;
varying vec3 vW;
float h(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float n3(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h(i), h(i + vec3(1, 0, 0)), f.x), mix(h(i + vec3(0, 1, 0)), h(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h(i + vec3(0, 0, 1)), h(i + vec3(1, 0, 1)), f.x), mix(h(i + vec3(0, 1, 1)), h(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
void main() {
  vec3 v = normalize(uCam - vW);
  float edge = pow(abs(dot(normalize(vN), v)), 1.6);
  float along = clamp(-vP.y, 0.0, 1.0);
  float fall = smoothstep(0.0, 0.15, along) * (1.0 - 0.6 * along);
  float dust = 0.55 + 0.9 * n3(vW * 0.35 + vec3(0.0, uSeed * 0.05, 0.0));
  gl_FragColor = vec4(vec3(0.62, 0.61, 0.6) * edge * fall * dust * uGain, 0.0);
}`;function x1(t,e,n){const o=new bi(15921129,10,0,.2,.55,0);o.castShadow=n!=="low",o.shadow.mapSize.set(n==="high"?2048:1024,n==="high"?2048:1024),o.shadow.bias=-4e-4,o.shadow.normalBias=.02,o.shadow.camera.near=1,o.shadow.camera.far=400,e.add(o,o.target);const a=new zc(16711688,20,30,1.6);e.add(a);const s=new kc(2763306,0,.08);e.add(s);const r=new fn({vertexShader:v1,fragmentShader:g1,transparent:!0,depthWrite:!1,blending:Mi,side:uo,uniforms:{uGain:{value:.3},uSeed:{value:0},uCam:{value:new _}}}),i=new Pc(1,1,32,1,!0);i.translate(0,-.5,0);const c=new Ke(i,r);c.frustumCulled=!1,c.renderOrder=5,e.add(c);const l=[],d=[],u=()=>{const h=new Si(t);[0,1,2].forEach(m=>{const M=new ja;M.background=new Gt(0);const x=(w,y,S,R,k,L,C,z=1)=>{const b=new Ke(new oo(w,y),new Pn({color:new Gt(S).multiplyScalar(z),side:uo}));b.position.set(R,k,L),b.rotation.y=C,b.lookAt(0,0,0),M.add(b)};x(1.2,9,9079434,-6,2,-3,0,5),x(.6,9,5921370,6,1,2,0,5),x(10,.5,6974058,0,7,0,0,2.5),m<2&&x(.8,7,16711684,4,-2,-6,0,m?.35:.12);const g=h.fromScene(M,.02);d[m]?.dispose(),d[m]=g,l[m]=g.texture}),h.dispose()};u(),ws(u);const p=new _(0,1,0),f=new _;function v(h,m,M,x){const g=1+(m.blade-1)*M,w=1+(m.red-1)*M,y=1+(m.angle-1)*M,S=h.blade.angle*y*(x.angleMul??1);o.position.set(...h.blade.from),o.target.position.set(...h.blade.to),o.target.updateMatrixWorld(),o.angle=S,o.penumbra=h.blade.pen??.55,o.intensity=h.blade.power*.4*g*(x.bladeMul??1),a.position.set(...h.red.at),a.intensity=h.red.power*w*(x.redMul??1),a.distance=h.red.reach*2,e.environment=l[h.env];const R=Math.hypot(h.blade.to[0]-h.blade.from[0],h.blade.to[1]-h.blade.from[1],h.blade.to[2]-h.blade.from[2])*1.15;c.position.set(...h.blade.from),f.set(h.blade.to[0]-h.blade.from[0],h.blade.to[1]-h.blade.from[1],h.blade.to[2]-h.blade.from[2]).normalize(),c.quaternion.setFromUnitVectors(p,f.negate());const k=Math.tan(S)*R;c.scale.set(k,R,k),r.uniforms.uGain.value=h.haze*.18*Math.min(1.5,g*(x.bladeMul??1)),r.uniforms.uSeed.value=x.seed,r.uniforms.uCam.value.copy(x.cam)}return{blade:o,red:a,haze:c,apply:v}}const w1=.004,y1=1;function b1(t){return t.station<0?"none":t.rel>0?"release":t.rare&&t.t>=wn.rare?"rare":t.t<wn.settle?"settle":t.t<wn.pulse?"wait":"loop"}function M1(){let t=0,e=!1,n=-1,o=0,a=99,s=!0,r=-1;const i=new Set;return{update(c,l,d,u){const p=Kc(l);return p!==r&&(r=p,i.delete(p)),Math.abs(d)<w1&&!u?t+=c:t=0,!e&&t>=y1?(e=!0,n=p,o=0,a=0,s=!i.has(p)):e&&t===0&&(e=!1,a=1e-6),e?(o+=c,s&&o>=wn.rare&&i.add(n)):n>=0&&(a+=c,a>Fe[n].trick.release&&(n=-1,a=99)),{station:n,t:o,rare:s,rel:e?0:a}},reset(){t=0,e=!1,n=-1,o=0,a=99,i.clear(),r=-1}}}function Kr(t,e,n,o){if(t.station!==e)return{on:!1,k:0,t:0,phase:0,rare:-1};const a=Fe[e],s=t.rel>0?1-ve(t.rel/a.trick.release):1;if(o)return{on:!0,k:ve(t.t/3)*s,t:t.t,phase:.5,rare:-1};const r=ve((t.t-wn.pulse)/.5),i=t.rare&&a.trick.rare>0&&t.t>=wn.rare;return{on:!0,k:r*s*(n?1:.35),t:t.t,phase:Yc(e,t.t),rare:i?xt((t.t-wn.rare)/a.trick.rare):-1}}function S1(t){if(t.station<0||t.rel>0)return-1;const e=(t.t-wn.pulse)/wn.pulseLen;return e>=0&&e<=1?e:-1}function z1(t){const e=n=>al(new ya(n));return{q:t,metal:e({color:4867905,metalness:.9,roughness:.34,envMapIntensity:1.3}),metalPale:e({color:6973282,metalness:1,roughness:.22,envMapIntensity:1.1}),enamel:e({color:3420719,metalness:0,roughness:.5,envMapIntensity:.5}),blood:e({color:6029832,metalness:.35,roughness:.3,emissive:2752514,envMapIntensity:.7}),ruby:e({color:7995400,metalness:.1,roughness:.08,emissive:12582928,emissiveIntensity:.6}),oil:e({color:131586,metalness:.2,roughness:.06,envMapIntensity:1.4}),glass:e({color:1052688,metalness:0,roughness:.05,transparent:!0,opacity:.16,depthWrite:!1,envMapIntensity:1.5}),stone:e({color:1776153,metalness:0,roughness:.62,envMapIntensity:.4})}}function k1(t){return Ri(t.map(e=>{const n=e.index?e.toNonIndexed():e;return n.deleteAttribute("uv"),n}))}const Yr=["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"],_n=Math.PI/180,P1={v:.15},A1=Math.atan2(-.8,13),R1=[-145*_n,-112*_n,-82*_n,A1,22*_n,55*_n,98*_n,140*_n],Cs=[10.5,-6.5],Ts=[-.42,.02],C1=.2;Number(new URLSearchParams(typeof location>"u"?"":location.search).get("fexp")??.18);const Xr=.07,T1={0:{at:[10,8],g:6,tube:!0},1:{at:[13.1,-14.6],g:.2,tube:!0},G:{at:[17,2],g:2,env:.1}},nc={value:0};function F1(t,e){const n=new Pn({color:16777215,side:uo});return n.onBeforeCompile=o=>{o.uniforms.uGain=t,o.uniforms.uFront=e,o.uniforms.uThin=nc,o.uniforms.uPxH=Qa,o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWp;
attribute vec3 aPerp;
attribute float aHw;
uniform float uThin;
uniform float uPxH;`).replace("#include <begin_vertex>",`#include <begin_vertex>
{ vec3 cC = transformed - aPerp * aHw; float cD = length((modelViewMatrix * vec4(cC, 1.0)).xyz); float pw = cD / (projectionMatrix[1][1] * uPxH * 0.5); transformed = cC + aPerp * mix(max(aHw, 0.006 * cD / projectionMatrix[1][1]), clamp(aHw, pw * 0.55, pw * 1.0), uThin); }`).replace("#include <project_vertex>",`#include <project_vertex>
vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGain;
uniform vec3 uFront;
uniform float uThin;
varying vec3 vWp;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float dF = length(vWp.xz - uFront.xy);
float reach = smoothstep(uFront.z + 2.0, uFront.z - 2.0, dF);
float e = uGain * reach * mix(0.55 + 0.45 * exp(-dF / 9.0), 1.6 * exp(-dF / 2.2) * (1.0 - smoothstep(2.5, 6.0, dF)), uThin);
gl_FragColor = vec4(0.95 * mix(smoothstep(0.0, 0.12, e), clamp(e * 0.6, 0.0, 1.0), uThin), 0.0, 0.0, 1.0 + clamp(e * 2.0, 0.0, 1.0));`)},n.customProgramCacheKey=()=>"ss-crack-emit",n}function _1(t){const e=[],n=[],o=[],a=[];t.cracks.forEach((r,i)=>{const c=t.crackLen(i),l=Math.max(8,Math.ceil(c/.2)),d=e.length/3;for(let u=0;u<=l;u++){const p=.25+(c-.5)*u/l,[f,v]=t.crackAt(i,p),[h,m]=t.crackAt(i,p+.05),M=h-f,x=m-v,g=Math.hypot(M,x)||1,w=.075*(1-.4*u/l),y=io(Math.hypot(f,v))+.012;if(e.push(f-x/g*w,y,v+M/g*w,f+x/g*w,y,v-M/g*w),o.push(-x/g,0,M/g,x/g,0,-M/g),a.push(w,w),u<l){const S=d+u*2;n.push(S,S+1,S+2,S+1,S+3,S+2)}}});const s=new Ln;return s.setAttribute("position",new ct(e,3)),s.setIndex(n),s.setAttribute("aPerp",new ct(o,3)),s.setAttribute("aHw",new ct(a,1)),s}function I1(t){const e=t.kit.q,n=za(e),o=new pt,a=Ul({detail:n,cracks:R1}),s=Kl({detail:n}),r=Eo(a.part,e,{impact:a.impact}),i=a.sectors.map((O,Q)=>{const me=new pt;me.name=`sector-${Q}`;const Ge=O.centroid.clone();return{pivot:me,mid:Math.atan2(Ge.x,-Ge.z),centroid:Ge,order:0}}),c=[];r.children.slice().forEach(O=>{const Q=/^(enamel|base|ticks)-(\d+)$/.exec(O.name);Q?(i[Number(Q[2])].pivot.add(O),Q[1]==="enamel"&&c.push(O)):o.add(O)});const l=i.map(()=>[]),d=[],u=[];for(let O=0;O<12;O++){const Q=$s(Yr[O],{detail:n}).geo.clone().translate(0,Xr,0);O===2&&(Q.translate(.9,0,0),Q.rotateZ(-.11),Q.rotateY(.06),Q.translate(-.9,0,0)),Q.applyMatrix4(s.at[O]),Q.computeBoundingBox();const me=Q.boundingBox.getCenter(new _);if(O<=2?d.push([a.sectorOf(me.x,me.z),Q]):l[a.sectorOf(me.x,me.z)]?.push(Q),O<=2){const Ge=[{tilt:0,yaw:0,roll:0,lift:.02},{tilt:0,yaw:0,roll:65*_n,lift:.02},{tilt:48,yaw:.12,roll:18*_n,lift:.06}][O],mt=$s(Yr[O],{detail:n}),vt=mt.geo.clone(),It=vt.attributes.position;for(let Ft=0;Ft<It.count;Ft++)It.getY(Ft)>.021&&It.setY(Ft,It.getY(Ft)*3);vt.computeVertexNormals();const gt=Ge.roll,ut=_e.numeralH/2,Xt=mt.width/2+.17;vt.translate(0,0,ut).rotateX(-Ge.tilt*_n).translate(0,0,-ut).rotateZ(gt).translate(0,Xr+Ge.lift+Xt*Math.abs(Math.sin(gt)),0).rotateY(Ge.yaw),u.push(vt.applyMatrix4(s.at[O]))}}const p=Oo(cn({finish:"grained",seed:299,wear:.22,tier:e,age:.11,direct:.12}),.3);l.forEach((O,Q)=>{if(!O.length)return;const me=new Ke(_t(O),p);me.castShadow=e!=="low",me.receiveShadow=e!=="low",me.name=`numerals-${Q}`,i[Q].pivot.add(me)});const f=d.map(([O,Q])=>{const me=new Ke(Q,p);return me.castShadow=me.receiveShadow=e!=="low",me.name="numerals-near",i[O].pivot.add(me),me}),v=new Ke(_t(u),Oo(cn({finish:"grained",seed:297,wear:.08,tier:e,age:.03,direct:1}),.9));v.castShadow=v.receiveShadow=e!=="low",v.name="p1-numerals";for(const O of i)o.add(O.pivot);const h=45*_n;[...i].sort((O,Q)=>(O.mid-h+4*Math.PI)%(2*Math.PI)-(Q.mid-h+4*Math.PI)%(2*Math.PI)).forEach((O,Q)=>O.order=Q);const m=nu({detail:n,second:0,hour:4.9,minute:1.15}),M=Eo(m,e,{}),x=new pt;x.name="second",M.children.slice().forEach(O=>{(O.name==="hand-second"||O.name==="hand-collet")&&x.add(O)});for(const O of M.children)(O.name==="hand-hour"||O.name==="hand-minute")&&Oo(O.material,C1);o.add(M,x);let g=null;const w=(()=>{const O=x.children.find(ut=>ut.name==="hand-second");if(!O)return null;const Q=O.geometry.clone(),me=Q.attributes.position;let Ge=0,mt=0,vt=0;for(let ut=0;ut<me.count;ut++){const Xt=me.getX(ut),Ft=me.getZ(ut),Sn=Xt*Xt+Ft*Ft;Sn>vt&&(vt=Sn,Ge=Xt,mt=Ft)}const It=Math.hypot(Ge,mt)||1;Ge/=It,mt/=It;for(let ut=0;ut<me.count;ut++){const Xt=me.getX(ut),Ft=me.getZ(ut),Sn=Xt*Ge+Ft*mt,Qe=Xt-Sn*Ge,st=Ft-Sn*mt,zt=Math.hypot(Qe,st),Et=zt>1e-6?(zt*1.75+.035)/zt:1;me.setXYZ(ut,Sn*Ge+Qe*Et,me.getY(ut)-.03,Sn*mt+st*Et)}Q.deleteAttribute("normal");const gt=new Ke(Q,new Pn({color:0}));return gt.name="hand-skirt",gt.position.copy(O.position),gt.quaternion.copy(O.quaternion),gt.scale.copy(O.scale),gt.renderOrder=-1,x.add(gt),gt})(),y=x.children.map(O=>O.material).find(O=>O?.emissive&&O.clearcoat>0),S=x.children.find(O=>O.name==="hand-second"),R={value:0};if(y){const O=y.onBeforeCompile.bind(y),Q=y.customProgramCacheKey.bind(y);y.onBeforeCompile=(me,Ge)=>{O(me,Ge),me.uniforms.uWhole=R,me.fragmentShader=me.fragmentShader.replace("void main() {",`uniform float uWhole;
void main() {`).replace("chip = max(chip, boss);",`chip = mix(chip, 0.0, uWhole);
rim *= 1.0 - uWhole;
hair *= 1.0 - uWhole;
chip = max(chip, boss);`).replace("{ vec3 cT = vec3(0.8, 0.035, 0.03);",`clearcoatSpecularDirect *= 1.0 - 0.9 * uWhole;
reflectedLight.directDiffuse *= 1.0 - 0.5 * uWhole;
{ vec3 cT = vec3(0.8, 0.035, 0.03);`)},y.customProgramCacheKey=()=>Q()+"-whole"}const k=Yl({detail:n,impact:Cs,wedge:Ts}),L=Eo(k.part,e,{});o.add(L);const C=tt(517),z=J0(8,(O,Q)=>{const me=Q*Math.PI*2,Ge=3+Math.sqrt(O)*18.5,mt=Math.cos(me)*Ge,vt=Math.sin(me)*Ge,It=Math.atan2(vt-Cs[1],mt-Cs[0]);return It>Ts[0]-.14&&It<Ts[1]+.14||Math.hypot(mt-12.95,vt+18)<15?null:{p:new _(mt,Ea(Ge)-.02,vt),up:new _(-mt*.004+(C()-.5)*.1,1,-vt*.004)}},31,[.3,.55,.9]),b=Eo(Bo([],[{geo:Q0(n),finish:"drop",seed:77,mats:z.flat(),name:"sky-drops"}]),e,{shadows:!1,sphereOf:()=>Z0(1,.7)});b.visible=!1,o.add(b);const P=new pt;P.visible=!1,o.add(P);const I=new Pn({color:0}),F=Oo(cn({finish:"polished",seed:641,wear:.1,tier:e,age:.05,direct:.9}),1.2);{const O=[],Q=[];for(let mt=0;mt<60;mt++){const vt=mt%5===0,It=mt/60*Math.PI*2,gt=vt?_e.hourIn:_e.trackIn,ut=_e.trackOut,Xt=vt?.2:.075,Ft=ut-gt,Sn=io((gt+ut)/2),Qe=new fe().makeRotationY(-It).multiply(new fe().makeTranslation(0,Sn,-(gt+ut)/2));O.push(new ca(Xt,.012,Ft).applyMatrix4(Qe));for(const st of[-1,1])Q.push(new ca(.016,.022,Ft+.02).translate(st*(Xt/2+.008),.004,0).applyMatrix4(Qe))}const me=new Ke(_t(O),I),Ge=new Ke(_t(Q),F);me.name="p1-grooves",Ge.name="p1-lips",Ge.receiveShadow=e!=="low",P.add(me,Ge,v)}const D=r.children.filter(O=>/^ticks-/.test(O.name)).concat(...i.map(O=>O.pivot.children.filter(Q=>/^ticks-/.test(Q.name)))),J=new sa(e==="low"?512:1024,e==="low"?512:1024,{type:la,samples:e==="low"?0:4}),Y=new tr(136,1,.2,120);Y.position.set(...Wo),Y.up.set(0,0,-1),Y.lookAt(Wo[0],0,Wo[2]);const oe=.95,ae=new ua(is*1.006,64,24,0,Math.PI*2,0,oe),G=new fn({uniforms:{tPic:{value:J.texture},uGain:{value:4.2},uK:{value:0}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vP; void main() { vP = position.xz / ("+(is*Math.sin(oe)).toFixed(4)+"); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform sampler2D tPic; uniform float uGain; uniform float uK; varying vec2 vP; void main() { float r = length(vP); vec2 uv = 0.5 - vP * 0.5 * (0.82 + 0.18 * r * r); vec3 c = texture2D(tPic, uv).rgb * uGain * (1.0 - 0.55 * r * r) + vec3(0.85) * exp(-(((r - 0.955) / 0.012) * ((r - 0.955) / 0.012))); gl_FragColor = vec4(c, uK * (1.0 - smoothstep(0.78, 1.0, r))); }"}),te=new Ke(ae,G);te.position.set(...Wo),te.visible=!1,te.renderOrder=2,o.add(te);const V=Oo(cn({finish:"grained",seed:611,wear:.06,tier:e,age:0,direct:1}),1.1),B=new Gc(2.1,.5,1.7,2,.1),U=new ca(2.5,.62,.35),H=new yn(B,V,8);H.castShadow=H.receiveShadow=e!=="low",H.frustumCulled=!1;const pe=Array.from({length:8},(O,Q)=>{const me=(Q+.5)*Math.PI/4;return U.clone().rotateY(-me).translate(20.55*Math.sin(me),.3,-20.55*Math.cos(me))});o.add(H);const he=Array.from({length:8},(O,Q)=>({a:(Q+.5)*Math.PI/4})),ge=new fe,W=new Wt,ie=new _(1,1,1),ye=new _,Ae=new _(0,1,0),be=20.05,Se=90,Be=-.1,Le=.55,Ve=new Ke(_t([new $0(be-.3,be+.3,192,1).rotateX(-Math.PI/2).translate(0,-.08,0),new $0(be-.33,be-.29,192,1).rotateX(-Math.PI/2).translate(0,-.02,0),new $0(be+.29,be+.33,192,1).rotateX(-Math.PI/2).translate(0,-.02,0),...pe].map((O,Q)=>{const me=O.attributes.position.count,Ge=new Float32Array(me*3).fill(Q===1||Q===2?.55:0);return O.setAttribute("color",new ra(Ge,3)),O})),new Pn({vertexColors:!0}));Ve.visible=!1,o.add(Ve);const Ye=Ve,Pe=new Ln,Ue=new Float32Array((Se+1)*6),et=new Float32Array((Se+1)*8),Ie=[];for(let O=0;O<=Se;O++){const Q=-1.25*(1-O/Se);Ue.set([be*Math.sin(Q),Be,-be*Math.cos(Q),be*Math.sin(Q),Le,-be*Math.cos(Q)],O*6),O<Se&&Ie.push(2*O,2*O+1,2*O+2,2*O+1,2*O+3,2*O+2)}Pe.setAttribute("position",new ra(Ue,3)),Pe.setAttribute("color",new ra(et,4)),Pe.setIndex(Ie);const ke=new Ke(Pe,new Pn({vertexColors:!0,transparent:!0,side:uo,depthWrite:!1}));ke.visible=!1,ke.frustumCulled=!1;const ee=new pt;ee.add(ke),o.add(ee);const j=34,X=new Float32Array(8*j*3),le=new Float32Array(8*j*3),xe=[];{const O=tt(655);for(let Q=0;Q<8*j;Q++)xe.push(O()-.5,O()*.8,O()-.5,.4+O()*.6)}const Ce=new Ln;Ce.setAttribute("position",new ra(X,3)),Ce.setAttribute("color",new ra(le,3));const Ee=new Ac(Ce,new Rc({size:2.6,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Mi,map:(()=>{const O=document.createElement("canvas");O.width=O.height=32;const Q=O.getContext("2d"),me=Q.createRadialGradient(16,16,0,16,16,16);return me.addColorStop(0,"rgba(255,255,255,1)"),me.addColorStop(1,"rgba(255,255,255,0)"),Q.fillStyle=me,Q.fillRect(0,0,32,32),new Pr(O)})()}));Ee.visible=!1,Ee.frustumCulled=!1,o.add(Ee);const Je=new Ke(new $a(_e.caseIn*1.6,64),new Pn({colorWrite:!1,depthWrite:!1,side:uo}));Je.rotation.x=-Math.PI/2,Je.position.y=-.45,Je.castShadow=!0,Je.visible=!1,o.add(Je);const A=74*Math.PI/180,E=new pt;E.visible=!1,E.rotation.y=A,o.add(E);const Z=Oo(cn({finish:"grained",seed:621,wear:.3,tier:e,age:.2,direct:.7}),.08);{const O=new Ke(_t([[9,-3.2,-2,4.2,48],[15,-3.8,3,2.8,36],[6,-4.4,7,5.5,64],[13,-2.9,-7.5,2.2,30]].map(([Q,me,Ge,mt,vt],It)=>Ko({teeth:vt,r:mt,profile:"train",spokes:5,rim:.08,hub:.14,hole:.3,detail:n,seed:620+It}).rotateY(It*1.3).translate(Q,me,Ge))),Z);O.castShadow=O.receiveShadow=e!=="low",E.add(O)}[[11.5,-2.1,1,.5],[9.6,-1.9,-8.2,-.6]].forEach(([O,Q,me,Ge],mt)=>{const vt=Ol(cr({length:11,width:2.4,t:.6,detail:n,seed:630+mt}),e);vt.position.set(O,Q,me),vt.rotation.y=Ge,E.add(vt)});{const O=new Ke(dr({detail:n,rOut:2.4,t:.05}).geo,Z);O.position.set(16,-2.6,-3),E.add(O)}const se=new _(10*Math.sin(50*_n),-3,-10*Math.cos(50*_n)),ue={value:0},T=new Pn({color:16777215});T.onBeforeCompile=O=>{O.uniforms.uK=ue,O.fragmentShader=O.fragmentShader.replace("#include <common>",`#include <common>
uniform float uK;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor = vec4(0.95 * uK, 0.0, 0.0, 1.0 + uK);`)},T.customProgramCacheKey=()=>"ss-gate-ruby";const q=new Ke(new rs(.26,2),T);q.position.copy(se).applyAxisAngle(new _(0,1,0),-A),E.add(q);let $=null;const de=(O,Q,me=0)=>{Je.visible=Q&&O>.2&&e!=="low",H.visible=Ye.visible=Q;const Ge=205*_n,mt=xt((O-.12)/.19),vt=Ge+mt*Math.PI*2;let It=!1;if(he.forEach(({a:gt},ut)=>{const Xt=.12+.19*(((gt-Ge)%(2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)+.004,Ft=xt((O-Xt)/.006),Sn=Ft>=1?1:1+2.2*(Ft-1)**3+1.2*(Ft-1)**2,Qe=xt(Sn,0,1.08)*(ut===2?1-.55*me:1),st=19+1.6*Qe,zt=(O-Xt)/.03,Et=zt>0&&zt<1,Dn=le[ut*j*3]>0;if(Et||Dn)for(let En=0;En<j;En++){const Hn=(ut*j+En)*3,Fo=(ut*j+En)*4,Zo=Math.sqrt(Math.max(zt,0))*1.5*xe[Fo+3],ka=Et?.014*(1-zt)*xe[Fo+3]+1e-4:0;X[Hn]=20.5*Math.sin(gt)+xe[Fo]*Zo*2,X[Hn+1]=.45+xe[Fo+1]*Zo,X[Hn+2]=-20.5*Math.cos(gt)+xe[Fo+2]*Zo*2,le[Hn]=le[Hn+1]=le[Hn+2]=ka}Et&&(It=!0),H.setMatrixAt(ut,ge.compose(ye.set(st*Math.sin(gt),.32-.1*Qe,-st*Math.cos(gt)),W.setFromAxisAngle(Ae,-gt),ie))}),H.instanceMatrix.needsUpdate=!0,Ee.visible=It&&Q,It&&(Ce.attributes.position.needsUpdate=Ce.attributes.color.needsUpdate=!0),ke.visible=Q&&mt>0&&mt<1,ke.visible){ee.rotation.y=-vt;const gt=O*55%1;for(let ut=0;ut<=Se;ut++){const Xt=ut/Se,Ft=Math.exp(-(((Xt-gt)/.035)**2))*.8+Math.exp(-(((Xt-.985)/.02)**2))*.6,Sn=Math.min(1,(Xt/.55)**1.6)*(Xt>.995?0:1);et.set([.5+Ft,.5+Ft,.52+Ft,Math.min(1,Sn+Ft*.5),.3+Ft*.5,.3+Ft*.5,.32+Ft*.5,Math.min(1,Sn+Ft*.3)],ut*8)}Pe.attributes.color.needsUpdate=!0}},re=O=>{if(te.visible=O>0,G.uniforms.uK.value=O,!(O>0))return;const Q=t.renderer.getRenderTarget(),me=L.visible;te.visible=!1,L.visible=!1;const Ge=t.renderer.shadowMap.autoUpdate;t.renderer.shadowMap.autoUpdate=!1,t.renderer.setRenderTarget(J),t.renderer.render(t.scene,Y),t.renderer.setRenderTarget(Q),t.renderer.shadowMap.autoUpdate=Ge,te.visible=!0,L.visible=me},ne={value:0},K={value:new _(...r0(1.5/12*Math.PI*2,12),0)};K.value.set(r0(1.5/12*Math.PI*2,12)[0],r0(1.5/12*Math.PI*2,12)[1],0);const ze=new Ke(_1(a),F1(ne,K));ze.frustumCulled=!1,o.add(ze);const Ne=new _;{let O=1e9;a.cracks.forEach((Q,me)=>{const Ge=a.crackLen(me);for(let mt=.3;mt<Ge;mt+=.3){const[vt,It]=a.crackAt(me,mt),gt=Math.hypot(vt-11.4,It+12.4);gt<O&&(O=gt,Ne.set(vt,.8,It))}})}const Te=new _,at=new Pn({color:0});at.onBeforeCompile=O=>{O.uniforms.uGain=ne,O.uniforms.uFront=K,O.vertexShader=O.vertexShader.replace("#include <common>",`#include <common>
attribute float aU;
varying float vU;
varying vec3 vWp;`).replace("#include <project_vertex>",`#include <project_vertex>
vU = aU;
vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;`),O.fragmentShader=O.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGain;
uniform vec3 uFront;
varying float vU;
varying vec3 vWp;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float dF = length(vWp.xz - uFront.xy);
float wl = uGain * smoothstep(uFront.z + 2.0, uFront.z - 2.0, dF) * exp(-dF / 4.5) * smoothstep(-0.95, -0.72, vU) * exp(-max(vU + 0.72, 0.0) * 2.2) * step(abs(vU), 1.5);
gl_FragColor = vec4(0.3 * wl * (0.45 + 0.55 * smoothstep(0.2, 0.8, 0.5 + 0.5 * sin(dot(vWp.xz, vec2(9.0, 6.0)) + 3.0 * sin(dot(vWp.xz, vec2(2.3, -3.1)))))), 0.0, 0.0, 1.0);`)},at.customProgramCacheKey=()=>"ss-p1-canyon";const qe=new pt;qe.visible=!1,o.add(qe);{const O=Fe[1].pose.pos,Q=tt(733),me=[],Ge=new bt(Fe[1].pose.look[0]-O[0],Fe[1].pose.look[2]-O[2]).normalize(),mt=new bt(-Ge.y,Ge.x),vt=[[-3.6,2.75],[-1.8,2.35],[0,2.15],[1.6,2.2],[2.8,2.7],[3.8,3.8]];for(let Ot=0,On=150;Ot<=On;Ot++){const Wn=Ot/On*(vt.length-1),on=Math.min(vt.length-2,Math.floor(Wn)),Vn=ve(Wn-on),jn=vt[on][0]+(vt[on+1][0]-vt[on][0])*Vn,kt=vt[on][1]+(vt[on+1][1]-vt[on][1])*Vn,Ut=(Q()-.5)*.025+.02*Math.sin(Ot*.9);me.push([O[0]+Ge.x*(kt+Ut)+mt.x*jn,O[2]+Ge.y*(kt+Ut)+mt.y*jn])}const It=[],gt=[[8.28,-15.33],[6.9,-12.9],[7.3,-10.3],[8.49,-8.49],[10.3,-6.9],[12.2,-5.3]];for(let Ot=0,On=160;Ot<=On;Ot++){const Wn=Ot/On*(gt.length-1),on=Math.min(gt.length-2,Math.floor(Wn)),Vn=Wn-on,jn=gt[on][0]+(gt[on+1][0]-gt[on][0])*Vn,kt=gt[on][1]+(gt[on+1][1]-gt[on][1])*Vn,Ut=(Q()-.5)*.03+.025*Math.sin(Ot*1.3)+.04*Math.sin(Ot*.21);It.push([jn+Ut,kt-Ut*.6])}const ut=[],Xt=[],Ft=[],Sn=[],Qe=[],st=[],zt=[],Et=[],Dn=[],En=[],Hn=(Ot,On,Wn,on,Vn)=>Ot.push(...On,...on,...Wn,...Wn,...on,...Vn);for(const[Ot,On]of[[me,1],[It,.75]]){const Wn=Ot.length,on=Ot.map((kt,Ut)=>{const[Rn,qn]=Ot[Math.max(0,Ut-2)],[Jn,so]=Ot[Math.min(Wn-1,Ut+2)],_o=Math.hypot(Jn-Rn,so-qn)||1;let eo=-(so-qn)/_o,yo=(Jn-Rn)/_o;return eo*(O[0]-Ot[Ut][0])+yo*(O[2]-Ot[Ut][1])>0&&(eo=-eo,yo=-yo),[eo,yo]}),Vn=Ot.map((kt,Ut)=>{const Rn=Ut/(Wn-1),qn=Math.sin(Math.min(1,Rn*1.15)*Math.PI)**.5;return[On*(.04+.1*qn)*(.7+.6*(.5+.5*Math.sin(Rn*37+2*Math.sin(Rn*11)))),(.01+.028*qn)*(.6+.8*(.5+.5*Math.sin(Rn*29+1.3+2*Math.sin(Rn*7)))),qn]}),jn=(kt,Ut,Rn)=>{const[qn,Jn]=Ot[kt],[so,_o]=on[kt];return[qn+so*Ut,io(Math.hypot(qn,Jn))+Rn,Jn+_o*Ut]};for(let kt=0;kt<Wn-1;kt++){const[Ut,Rn,qn]=Vn[kt],[Jn,so]=Vn[kt+1];Hn(Ft,jn(kt,-Ut*.55,.004),jn(kt,Ut*.45,.004),jn(kt+1,-Jn*.55,.004),jn(kt+1,Jn*.45,.004)),ut.push(-1,-1,1,1,-1,1),Hn(Sn,jn(kt,Ut*.45,.005),jn(kt,Ut*.45+Rn,.005),jn(kt+1,Jn*.45,.005),jn(kt+1,Jn*.45+so,.005));{const Kn=.55+.45*Math.sin(kt*1.7+Math.sin(kt*.37)*3)**2,Yn=.55+.45*Math.sin((kt+1)*1.7+Math.sin((kt+1)*.37)*3)**2,Nn=.12;Xt.push(Nn*Kn,Nn*Kn,Nn*Kn,Nn*Yn,Nn*Yn,Nn*Yn,Kn,Kn,Kn,Kn,Kn,Kn,Nn*Yn,Nn*Yn,Nn*Yn,Yn,Yn,Yn)}const[_o,eo]=on[kt],[yo,Pa]=Ot[kt],[br,Mr]=Ot[kt+1],C0=br-yo,T0=Mr-Pa,Aa=Math.hypot(C0,T0)||1,t0=io(Math.hypot(yo,Pa));if(Q()<.1*qn){const Kn=.015+.03*Q(),Yn=Q()<.5,Nn=Yn?Ut*.45+Rn:-Ut*.55,pa=Yn?1:-1;Qe.push(...jn(kt,Nn,.006),...jn(kt+1,Nn,.006),(yo+br)/2+_o*(Nn+pa*Kn),t0+.006,(Pa+Mr)/2+eo*(Nn+pa*Kn))}if(Q()<.12*qn){const Kn=Q()<.5?1:-1,Yn=.25+.6*Q(),Nn=(Q()-.5)*1.2,pa=.006,Sr=yo+(_o*Kn+C0/Aa*Nn)*Yn,zr=Pa+(eo*Kn+T0/Aa*Nn)*Yn;Hn(st,[yo-C0/Aa*pa,t0+.005,Pa-T0/Aa*pa],[yo+C0/Aa*pa,t0+.005,Pa+T0/Aa*pa],[Sr,t0+.005,zr],[Sr+1e-4,t0+.005,zr])}}for(let kt=0;kt<Wn;kt++){const[Ut,Rn]=on[kt],qn=Ot[kt][0]-Ut*Vn[kt][0]*.33,Jn=Ot[kt][1]-Rn*Vn[kt][0]*.33,so=Vn[kt][0]*.2,_o=io(Math.hypot(qn,Jn))+.007,eo=zt.length/3;zt.push(qn-Ut*so,_o,Jn-Rn*so,qn+Ut*so,_o,Jn+Rn*so),Et.push(-Ut,0,-Rn,Ut,0,Rn),Dn.push(so,so),kt<Wn-1&&En.push(eo,eo+1,eo+2,eo+1,eo+3,eo+2)}}const Fo=Ot=>{const On=new Ln;return On.setAttribute("position",new ct(Ot,3)),On.computeVertexNormals(),On},Zo=Fo(Ft.concat(Qe,st));Zo.setAttribute("aU",new ct(ut.concat(new Array((Qe.length+st.length)/3).fill(9)),1));const ka=new Ke(Zo,at);ka.name="p1-canyon-depth";const R0=Fo(Sn);R0.setAttribute("color",new ct(Xt,3));const yr=new Ke(R0,new Cc({color:1052688,vertexColors:!0,side:uo}));yr.name="p1-canyon-wall",P.add(ka,yr);const e0=new Ln;e0.setAttribute("position",new ct(zt,3)),e0.setIndex(En),e0.setAttribute("aPerp",new ct(Et,3)),e0.setAttribute("aHw",new ct(Dn,1)),qe.userData.geo=e0;{const Ot=r0(Ro,19.9);let On=1e9;for(const[Wn,on]of me){const Vn=Math.hypot(Wn-Ot[0],on-Ot[1]);Vn<On&&(On=Vn,Te.set(Wn,.12,on))}}}{const O=new Ke(qe.userData.geo,ze.material);O.frustumCulled=!1,qe.add(O)}const rt=Xa("dial-xii",c.map(O=>O.material),{at:[0,io(10.2),-10.2],right:[1,0,0],up:[0,0,-1],width:8,depth:.3},t.lang);let St=!1;Ks(rt.ready.then(O=>St=O));const vn={value:.3},Jt={value:new _},Zt={value:new _},ln={value:0},Me={value:0},Ze={value:.7};for(const O of c)Object.assign(O.material.ss,{uStrN:Jt,uStrL:Zt,uStrG:ln,uStrRef:Me,uStrC:Ze,uEnv:vn});const Re=new _,it=new _,nt=new _,We=new bi(15921129,0,0,.14,.1,0);{const O=document.createElement("canvas");O.width=O.height=256;const Q=O.getContext("2d"),me=tt(919);Q.fillStyle="#000",Q.fillRect(0,0,256,256),Q.save(),Q.translate(128,128),Q.rotate(-.5);const Ge=Q.createLinearGradient(-128,0,128,0);Ge.addColorStop(0,"rgba(255,255,255,0)"),Ge.addColorStop(.3,"#fff"),Ge.addColorStop(.75,"#fff"),Ge.addColorStop(1,"rgba(255,255,255,0)"),Q.fillStyle=Ge,Q.fillRect(-128,-17,256,34),Q.restore(),Q.strokeStyle="#000",Q.lineCap="round";for(let mt=0;mt<7;mt++){let vt=128+(me()-.5)*60,It=128+(me()-.5)*60,gt=me()*6.28;Q.lineWidth=1.5+me()*3,Q.beginPath(),Q.moveTo(vt,It);for(let ut=0;ut<14;ut++)gt+=(me()-.5)*.9,vt+=Math.cos(gt)*14,It+=Math.sin(gt)*14,Q.lineTo(vt,It);Q.stroke()}We.map=new Pr(O),We.castShadow=e!=="low",We.shadow.mapSize.set(512,512),We.shadow.camera.near=.5,We.shadow.camera.far=20}o.add(We,We.target);const Tt=new y0,jt=new bt,en=new k0(new _(0,1,0),0),Nt=new _,Kt=Oo(cn({finish:"grained",seed:640,wear:.05,tier:e,age:0,direct:1}),.9),Un=Array.from({length:24},(O,Q)=>{const me=Q/23,Ge=me*Math.PI*5;return new _(Math.cos(Ge)*(.28-.12*me),me*.5-.25,Math.sin(Ge)*(.28-.12*me))}),Tn=[_t([new Ba(.24,.24,.1,18).translate(0,.05,0),new Ba(.085,.085,.5,8).translate(0,-.25,0)]),new Tc(.5,.07,8,36),new ca(1.4,.08,.17),new zi(new z0(Un),48,.028,5)],Xo=[10,7,8,6],fa=Tn.map((O,Q)=>{const me=new yn(O,Kt,Xo[Q]);return me.name=`gate-debris-${Q}`,me.frustumCulled=!1,me.castShadow=e!=="low",me.visible=!1,o.add(me),me}),fo=tt(733),lt=new _(4.2,-1.4,-4.6),ce=new _(-15,13,27).clone().sub(lt),we=new _().crossVectors(ce,new _(0,1,0)).normalize(),He=new _().crossVectors(we,ce).normalize(),De=[];Xo.forEach((O,Q)=>{for(let me=0;me<O;me++)De.push({k:Q,j:me,u:.06+.66*fo()**1.3,s:fo()*2-1,v:fo()*2-1,ax:new _(fo()-.5,fo()-.5,fo()-.5).normalize(),rot:2+fo()*5,sc:.8+fo()*.5})});const ht=De.find(O=>O.k===1),je=De.find(O=>O.k===2);Object.assign(ht,{u:.86,s:-1,v:-.55,sc:2.6}),Object.assign(je,{u:.9,s:.9,v:.5,sc:2.4});const tn=new fe,Dt=new Wt,Bt=new _,wt=new _,At=O=>{for(const Q of fa)Q.visible=O>0;if(!(O<=0)){for(const Q of De){const me=Q.u*(.35+.65*O),Ge=.25+2.6*me;Bt.copy(lt).addScaledVector(ce,me).addScaledVector(we,Q.s*Ge).addScaledVector(He,Q.v*Ge*.5),Dt.setFromAxisAngle(Q.ax,Q.rot*me+Q.j),fa[Q.k].setMatrixAt(Q.j,tn.compose(Bt,Dt,wt.setScalar(Q.sc*Math.min(1,O*3))))}for(const Q of fa)Q.instanceMatrix.needsUpdate=!0}},ot=128,Yt=(()=>{const O=new Uint8Array(ot*ot*4),Q=_e.dialR;for(let Ge=0;Ge<ot;Ge++)for(let mt=0;mt<ot;mt++){const vt=((mt+.5)/ot*2-1)*Q,It=((Ge+.5)/ot*2-1)*Q,gt=Math.hypot(vt,It)<Q?a.sectorOf(vt,It):-1;O[(Ge*ot+mt)*4]=gt>=0&&gt<8?gt*16+8:255}const me=new hs(O,ot,ot);return me.magFilter=me.minFilter=Fc,me.needsUpdate=!0,me})(),pn=new Array(8).fill(0),nn=new _(-8,0,-3.5),Mn=new _(.81,-.51,-.28).normalize(),Fn=68,An=3.6,wo=new fn({uniforms:{uA:{value:nn.clone().addScaledVector(Mn,-60)},uD:{value:Mn},uTan:{value:An/60},uLen:{value:Fn},uGain:{value:0},tSec:{value:Yt},uSt:{value:pn},uR:{value:_e.dialR},tNz:{value:Yo().noise}},vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
uniform vec3 uA; uniform vec3 uD; uniform float uTan; uniform float uLen; uniform float uGain; uniform sampler2D tSec; uniform float uSt[8]; uniform float uR; uniform sampler2D tNz;
varying vec3 vW;
void main() {
  vec3 rd = normalize(vW - cameraPosition);
  float acc = 0.0;
  for (int i = 0; i < 12; i++) {
    vec3 P = vW + rd * (float(i) + 0.5) * 0.9;
    vec3 ap = P - uA; float t = dot(ap, uD); if (t < 0.0 || t > uLen) continue;
    float r = length(ap - uD * t), R = t * uTan;
    float edge = 1.0 - smoothstep(R * 0.6, R, r);
    if (edge <= 0.0) continue;
    float lit = smoothstep(0.0, -1.2, P.y);
    if (P.y < -0.05) {
      vec3 Q = P - uD * (P.y / uD.y);
      if (length(Q.xz) > uR) lit = 0.0;
      else { float k = texture2D(tSec, Q.xz / (2.0 * uR) + 0.5).r * 255.0; int ki = int((k - 8.0) / 16.0 + 0.5); float s = 1.0;
        for (int j = 0; j < 8; j++) if (j == ki) s = uSt[j];
        lit = k > 250.0 ? 0.0 : smoothstep(0.2, 0.7, s); }
    }
    float dust = 0.35 + 0.9 * texture2D(tNz, P.xz * 0.11 + P.y * 0.07).g * texture2D(tNz, P.zy * 0.23 + 0.4).r;
    float fall = mix(1.0, 0.28, smoothstep(30.0, 62.0, t)) * smoothstep(15.0, 35.0, t) * (1.0 - smoothstep(uLen - 7.0, uLen - 1.0, t));
    acc += edge * lit * dust * fall;
  }
  gl_FragColor = vec4(vec3(0.62, 0.61, 0.6) * acc * uGain / 12.0, 0.0);
}`,transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft}),po=new Ba(.01,An/60*Fn*1.05,Fn,32,1,!0).translate(0,-Fn/2,0),$n=new Ke(po,wo);$n.name="gate-shaft",$n.frustumCulled=!1,$n.visible=!1,$n.renderOrder=6,$n.position.copy(nn).addScaledVector(Mn,-60),$n.quaternion.setFromUnitVectors(new _(0,-1,0),Mn),o.add($n);const gn=Fe.findIndex(O=>O.id==="G"),A0=new Gt,hc=new Gt;let xr=null;const wr=new _,mc=ec([o]);return{group:o,hand:x,sectors:i,emit:ne,setHandAngle(O){xr=O},update(O){const Q=O.i,me=Q===1||Q===2&&!O.inHold&&O.u<P1.v;{const Qe=Fe[Q].light.blade;Re.set(Qe.from[0]-Qe.to[0],Qe.from[1]-Qe.to[1],Qe.from[2]-Qe.to[2]).normalize();const st=T1[Fe[Q].id],zt=Fe[Q].pose.pos,Et=st?.at??[0,0],Dn=Math.hypot(zt[0]-Et[0],zt[1],zt[2]-Et[1])||1;it.set(-(zt[0]-Et[0])/Dn,zt[1]/Dn,-(zt[2]-Et[1])/Dn),st?.tube?(nt.set(-(zt[2]-Et[1]),0,zt[0]-Et[0]).normalize(),nt.dot(Re)<0&&nt.negate(),Zt.value.copy(nt),Jt.value.crossVectors(nt,it).normalize(),Ze.value=st.c??-.1):(Zt.value.copy(Re),Jt.value.crossVectors(Re,it).normalize(),Ze.value=.7);const En=O.trick(Fe[Q].id);vn.value=st?.env??.3,ln.value=(st?.g??0)*(1+(Fe[Q].stop.blade-1)*En.k)**3}let Ge=Q===gn?xt((O.local("G")-.5)/.5):Q>gn&&Q<9?1:0;const mt=O.trick("G"),vt=mt.on?ve(xt((mt.t-wn.pulse)/7))*mt.k:0;Ge>.25&&(Ge=.25+(Ge-.25)*(1-.55*vt));for(const Qe of i){const st=ve(xt((Ge-.25)/.75*3.3-Qe.order*.3));pn[i.indexOf(Qe)]=st;const zt=Q===gn?1+5*Math.min(1,st*5):1;for(const Et of Qe.pivot.children)/^(enamel|base)-/.test(Et.name)&&(Et.scale.y=zt,Et.position.y=.1*(1-zt));if(Qe.pivot.position.set(0,0,0),Qe.pivot.rotation.set(0,0,0),st>0){const Et=Qe.centroid,Dn=Math.hypot(Et.x,Et.z)||1,En=new _(-Et.z/Dn,0,Et.x/Dn);wr.set(Et.x/Dn,0,Et.z/Dn),Qe.pivot.position.copy(Et).multiplyScalar(-1),Qe.pivot.position.set(0,0,0),Qe.pivot.rotateOnWorldAxis(wr,-.85*st),Qe.pivot.rotateOnWorldAxis(new _(0,1,0),.18*st),Qe.pivot.position.copy(En.multiplyScalar(5.5*st*st)).add(new _(0,-.6*st-7*st**4,0))}Qe.pivot.visible=st<.999}const It=Q===gn&&(O.inHold||O.u>.3);Ui.value=me?1:It?2:0;for(const[Qe,st]of mc)Qe.uAge.value=It?0:st;js.value=me?.12:1,Ki.value=me?1:0,L.visible=Q<gn||Q===gn&&O.local("G")<.3||Q>=9,b.visible=me&&L.visible,At(Q===gn?ve(xt((Ge-.55)/.45)):0),$n.visible=Q===gn&&Ge>.26,wo.uniforms.uGain.value=1*ve(xt((Ge-.26)/.2)),P.visible=me;for(const Qe of D)Qe.visible=!me;for(const Qe of f)Qe.visible=!me;if(p.ss.uRS2.value.y=me?.04:.12,de(Ge,Q===gn||Q===gn-1,vt),Ve.material.color.setScalar(Q===gn?1:0),R.value=me||Q===gn?1:0,y&&y.emissive.setRGB(Q===0?.07:me?.006:Q===gn?0:.0045,0,0),y){g??=[y.clearcoatRoughness,y.roughness,y.envMapIntensity];const Qe=Q===0?1:Q===1?1-ve(xt((O.local("1")-.4)/.15)):0;y.clearcoatRoughness=g[0]+(.55-g[0])*Qe,y.roughness=g[1]+(.6-g[1])*Qe,y.envMapIntensity=g[2]+(.3-g[2])*Qe,me&&y.emissive.setRGB(.006+.07*Qe,0,0),w&&(w.visible=Q<=1||me),S&&(S.scale.y=(S.userData.sy??=S.scale.y)*(me?1+3*Qe:1))}E.visible=Q===gn&&Ge>.2;{const Qe=t.kit,st=Q===gn?O.inHold?1:ve(xt(O.u/.6)):0,zt=(Et,Dn)=>A0.setHex(Et).lerp(hc.setHex(Dn),st);Qe.metal.color.copy(zt(4867905,2368548)),Qe.metalPale.color.copy(zt(6973282,3815994)),Qe.enamel.color.copy(zt(3420719,2105376)),Qe.metal.envMapIntensity=1.3+(.25-1.3)*st,Qe.metalPale.envMapIntensity=1.1+(.25-1.1)*st}if($||($={},t.scene.traverse(Qe=>{const st=Qe;st.isLight&&st!==We&&st.isSpotLight&&($.blade=st),st.isLight&&st.isPointLight&&st.color.r>.9&&st.color.g<.1&&($.red=st)})),Me.value=($.blade?.intensity??0)*.4,Q===gn){$||($={},t.scene.traverse(st=>{const zt=st;zt.isLight&&zt!==We&&zt.isSpotLight&&($.blade=zt),zt.isLight&&zt.isPointLight&&zt.color.r>.9&&zt.color.g<.1&&($.red=zt)})),$.blade&&e==="low"&&($.blade.intensity*=1-.75*ve(xt((Ge-.2)/.15)));const Qe=!O.inHold&&O.u<.35;$.red&&Qe&&($.red.intensity*=1-ve(O.u/.35)),$.red&&!Qe&&($.red.intensity*=ve(xt((Ge-.25)/.3))*(1+3*vt),$.red.position.copy(se).add(new _(0,-.4,0)),$.red.distance=3.5),ue.value=ve(xt((Ge-.25)/.3))}re(Q===gn?ve(xt((O.local("G")-.08)/.12))*(1-ve(xt((O.local("G")-.27)/.03))):0);const gt=O.trick("0"),ut=O.trick("1"),Xt=gt.on?gt:ut;if(Q<=1&&(Qn.gain.value=0),ze.visible=Q<=1&&Xt.k>0,qe.visible=Q===1&&ze.visible,ze.visible){const Qe=xt((Xt.t-wn.pulse+.1)/1.4);K.value.z=Qe*40,ne.value=Xt.k*(Q===1?.9:.6)*(.75+.25*Math.sin(Xt.phase*Math.PI*2*(Q===1?1:2)))}else ne.value=0;pr.value=ne.value,nc.value=me?1:0,js.value*=1-.85*xt(ne.value*3),Q===1&&$.red&&($.red.position.copy(Te),$.red.intensity=0,$.red.distance=10);let Ft=Ro-.6*_n;if(ut.k>0){const Qe=Fe[1].trick.loop,st=ut.phase*Qe,zt=[0,.9,2.6,3.2,6],Et=zt.findIndex((ka,R0)=>st>=ka&&st<(zt[R0+1]??99)),Dn=zt[Math.max(0,Et)],En=st-Dn,Hn=[.9,1.7,.6,2.8][Math.max(0,Et)]??1,Fo=ve(En/(Hn*.7))*(En<Hn*.78?1:0),Zo=En>=Hn*.78?Math.exp(-(En-Hn*.78)*18)*Math.cos((En-Hn*.78)*70)*.25:0;Ft+=(Fo+Zo)*_n*ut.k+Math.sin(O.state.time*90)*.0012*ut.k}else Ft+=Math.sin(O.state.time*70)*6e-4;Q===9&&O.inHold&&(Ft=Ro-.6*_n+(O.state.reduced?0:O.state.time)*Math.PI*2/60),x.rotation.order="YXZ",x.rotation.y=-(xr??Ft),x.rotation.x=Q===1?-2.05*_n:0;const Sn=Q===1?ut.k:0;if(We.intensity=0,Sn>0){jt.set(O.state.pointer.x*2-1,1-O.state.pointer.y*2),Tt.setFromCamera(jt,O.camera),(!Tt.ray.intersectPlane(en,Nt)||Nt.distanceTo(Tt.ray.origin)>2.4)&&(Tt.ray.at(2.4,Nt),Nt.y=Math.max(0,Nt.y-.3)),Nt.length()>_e.dialR-.5&&Nt.setLength(_e.dialR-.5);const Qe=r0(Ro,19.9);Nt.lerp(new _(Qe[0],0,Qe[1]),1),We.target.position.copy(Nt),We.position.set(Nt.x-3.5,6,Nt.z-1.5),We.intensity=260*ve(xt((ut.t-wn.settle)/.6))*Sn}We.shadow.autoUpdate=We.intensity>0,St&&(rt.uniforms.uWOn.value=Q===1&&ut.rare>=0?ve(ut.rare/.2)*(1-ve((ut.rare-.8)/.2)):0)}}}const aa=24,Fs=7,L1=60/Fe.find(t=>t.id==="2").light.blade.power,D1=.3,Vo=2.7,Zr=`
uniform vec3 uC;
uniform float uR;
uniform vec3 uB;
uniform float uBulge;
uniform float uTime;
attribute float aPh;
varying vec3 vW;
varying vec3 vN;
varying vec3 vC;
varying float vR;
varying float vPh;
float disp(vec3 n) {
  float c = max(dot(n, uB), 0.0);
  float hump = ((c) * (c) * (c) * (c) * (c));
  float ring = sin(acos(clamp(c, -1.0, 1.0)) * 14.0 - uTime * 21.0) * exp(-acos(clamp(c, -1.0, 1.0)) * 1.6);
  float shiver = sin(uTime * 53.0 + dot(n, vec3(11.0, 7.0, 5.0))) * 0.5 + sin(uTime * 31.0 + n.y * 9.0) * 0.5;
  return uBulge * (hump * (1.0 + 0.18 * shiver) + 0.025 * ring);
}
void main() {
  vec3 n = normalize(position);
#ifdef USE_INSTANCING
  mat4 M = modelMatrix * instanceMatrix;
  vec3 p = n;
  vPh = aPh;
#else
  mat4 M = modelMatrix;
  vec3 t1 = normalize(cross(n, abs(n.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 t2 = cross(n, t1);
  vec3 n1 = normalize(n + t1 * 0.02), n2 = normalize(n + t2 * 0.02);
  vec3 p = n * (1.0 + disp(n));
  vec3 p1 = n1 * (1.0 + disp(n1)), p2 = n2 * (1.0 + disp(n2));
  n = normalize(cross(p1 - p, p2 - p));
  if (dot(n, p) < 0.0) n = -n;
  vPh = 0.0;
#endif
  vec4 w = M * vec4(p * vec3(1.0, 1.08, 1.0), 1.0);
  vW = w.xyz;
  vN = normalize(mat3(M) * (n * vec3(1.0, 1.0 / 1.08, 1.0)));
  vC = (M * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vR = length(M[0].xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Qr=`
uniform sampler2D tPic;
uniform float uGain;
uniform float uDark;
uniform vec3 uL;
uniform float uRim;
uniform float uPin;
uniform float uCaus;
uniform float uHand;
uniform float uShade;
uniform float uShadeC;
uniform float uShadeT;
uniform float uRare;
uniform float uRareT;
uniform float uSmall;
uniform vec2 uQ0;
uniform vec2 uQc;
uniform float uWide;
varying vec3 vW;
varying vec3 vN;
varying vec3 vC;
varying float vR;
varying float vPh;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.55; for (int k = 0; k < 4; k++) { s += a * vn(p); p = p * 2.03 + vec2(3.1, 1.7); a *= 0.5; } return s; }
float handMask(vec2 q, float a, float px) {
  vec2 d = vec2(sin(a), -cos(a)), s = vec2(-d.y, d.x);
  float al = dot(q, d), ac = abs(dot(q, s));
  float w = al > 0.0 ? mix(0.26, 0.035, clamp(al / 19.5, 0.0, 1.0)) : 0.2;
  float needle = (1.0 - smoothstep(w - px, w + px, ac)) * step(-4.6, al) * (1.0 - smoothstep(19.5 - px, 19.5 + px, al));
  float cw = 1.0 - smoothstep(0.85 - px, 0.85 + px, length(q + d * 3.4));
  return max(needle, cw);
}
float handAngle(float ph) {
  float run = uHand;
  float t = run * 5.6;
  float k = floor(t), f = t - k;
  float tick = k + smoothstep(0.0, 0.12, f) + 0.12 * sin(clamp((f - 0.12) / 0.3, 0.0, 1.0) * 3.14159) * exp(-f * 3.0);
  return ${Ro.toFixed(6)} + tick * 0.10472;
}
void main() {
  vec3 Vd = normalize(vW - cameraPosition);
  vec3 N = normalize(vN);
  float cs = clamp(dot(-Vd, N), 0.0, 1.0);
  vec3 r1 = refract(Vd, N, 0.75);
  vec3 oc = vW - vC;
  float hb = dot(oc, r1), hc = dot(oc, oc) - vR * vR * 1.04;
  float ht = -hb + sqrt(max(hb * hb - hc, 0.0));
  vec3 p2 = vW + r1 * ht;
  vec3 n2 = normalize(p2 - vC);
  vec3 r2 = refract(r1, -n2, 1.33);
  float tir = 0.0;
  if (dot(r2, r2) < 0.01) { r2 = reflect(r1, -n2); tir = 1.0; }
  vec3 col = vec3(0.0);
  float hit = 0.0, hmA = 0.0;
  vec2 q = vec2(0.0);
  if (r2.y < -0.02) {
    float t = -p2.y / r2.y;
    vec3 X = p2 + r2 * t;
    q = (X.xz - uQ0) * uWide + uQc;
    vec2 uv = vec2(q.x / ${(2*aa).toFixed(1)} + 0.5, -q.y / ${(2*aa).toFixed(1)} + 0.5);
    float inside = step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
    col = texture2D(tPic, uv).rgb * inside;
    hit = inside;
    float px = max(fwidth(q.x) + fwidth(q.y), 0.015) * 0.7;
    float a = handAngle(vPh);
    if (uSmall > 0.5) {
      float lag = vPh * smoothstep(0.35, 0.75, uRareT) * 1.7;
      a = ${Ro.toFixed(6)} + floor(clamp(uRareT * 9.0 - lag, 0.0, 6.0) + 0.0) * 0.10472 * step(0.02, uRare);
    }
    float hm = handMask(q, a, px) * hit;
    if (uSmall > 0.5) col *= 1.0 - handMask(q, a, px * 3.0 + 0.3) * hit;
    vec3 lac = vec3(0.11, 0.004, 0.003) * (0.55 + 0.45 * smoothstep(-6.0, 12.0, q.x - q.y));
    col = mix(col, lac, hm); hmA = hm;
    float s = 0.0;
    if (uShade > 0.0) {
      vec2 D = normalize(vec2(0.82, 0.57));
      float along = dot(q, D), side = dot(q, vec2(-D.y, D.x));
      float e = fbm(vec2(side * 0.22, uShadeT * 0.35)) * 2.0 - 1.0;
      float e2 = fbm(vec2(side * 0.31 + 7.0, uShadeT * 0.4 + 3.0)) * 2.0 - 1.0;
      float lead = uShadeC - along + e * 5.5;
      float tail = along - (uShadeC - 17.0) + e2 * 5.0;
      s = smoothstep(-0.6, 0.6, min(lead, tail)) * uShade;
      float lum = dot(col, vec3(0.3, 0.59, 0.11));
      col = mix(col, vec3(lum * 0.05), s);
    }
  }
  col *= uGain;
  col *= ${Vo.toFixed(2)};
  float rim = smoothstep(0.42, 0.06, cs);
  col *= (1.0 - 0.96 * rim) * (1.0 - tir);
  col += vec3(0.004 * ${Vo.toFixed(2)}) * uDark;
  float F0 = 0.02 + 0.98 * ((1.0 - cs) * (1.0 - cs) * (1.0 - cs) * (1.0 - cs) * (1.0 - cs));
  float lit = 0.04 + 0.96 * smoothstep(-0.1, 0.75, dot(N, uL));
  float edge = exp(-(((cs - 0.07) / 0.05) * ((cs - 0.07) / 0.05)));
  vec3 under = col; float keepH = clamp(hmA * 1.5, 0.0, 1.0);
  col += vec3(0.92, 0.91, 0.89) * uRim * (edge * lit + F0 * 0.12 * lit);
  vec3 R = reflect(Vd, N);
  if (uSmall > 0.5) col += vec3(1.0) * uPin * 0.22 * pow(max(dot(R, uL), 0.0), 700.0);
  else col += vec3(1.0) * uPin * pow(max(dot(R, uL), 0.0), 5000.0);
  vec3 pc = vC - normalize(uL * vec3(1.0, 0.25, 1.0)) * vR * 0.62;
  pc.y = min(pc.y, vC.y - vR * 0.45);
  float cd = length(cross(pc - vW, Vd));
  col += vec3(0.95, 0.93, 0.9) * exp(-((cd / (vR * 0.012)) * (cd / (vR * 0.012)))) * uCaus * smoothstep(0.2, 0.5, cs);
  col = mix(col, under, keepH);
  gl_FragColor = vec4(col, 1.0);
}`;function E1(t,e){const{kit:n,renderer:o,scene:a}=t,s=n.q,r=new pt,i=s==="low"?512:1024,c=new sa(i,i,{type:la,samples:s==="low"?0:4}),l=new wi(-aa,aa,aa,-aa,.1,40);l.position.set(0,6,0),l.up.set(0,0,-1),l.lookAt(0,0,0),l.updateMatrixWorld(),l.layers.set(Fs);let d=!1;const u=()=>{if(d)return;d=!0;const W=/^(hand-hour|hand-minute|hand-pipes|enamel-|base-|ticks-|numerals-)/;e.group.traverse(ie=>{let ye="",Ae=ie;for(;Ae&&Ae!==e.group&&!ye;)ye=Ae.name,Ae=Ae.parent;let be=!1;for(Ae=ie;Ae;)Ae===e.hand&&(be=!0),Ae=Ae.parent;W.test(ye)&&!be&&ie.isMesh&&ie.layers.enable(Fs)}),a.traverse(ie=>{ie.isLight&&ie.layers.enable(Fs)})},p={tPic:{value:c.texture},uGain:{value:1},uDark:{value:1},uL:{value:new _(-36.4,33,-31.9).normalize()},uRim:{value:.55*Vo},uPin:{value:2.2*Vo},uCaus:{value:.9*Vo},uHand:{value:0},uShade:{value:0},uShadeC:{value:-30},uShadeT:{value:0},uRare:{value:0},uRareT:{value:0},uSmall:{value:0},uQ0:{value:new bt(-1.03,-14.8)},uQc:{value:new bt(1,-2)},uWide:{value:3.2},uC:{value:new _(...Wo)},uR:{value:is},uB:{value:new _(0,1,0)},uBulge:{value:0},uTime:{value:0}},f=new fn({uniforms:p,vertexShader:Zr,fragmentShader:Qr}),v=s==="low"?[64,48]:[160,120],h=new ua(1,v[0],v[1]);h.setAttribute("aPh",new ct(new Float32Array(h.attributes.position.count),1));const m=new Ke(h,f);m.position.set(...Wo),m.scale.setScalar(is),m.frustumCulled=!1,r.add(m);const M={...p,uGain:{value:.15},uRim:{value:.18*Vo},uPin:{value:1.6*Vo},uCaus:{value:0},uSmall:{value:1},uBulge:{value:0}},x=new fn({uniforms:M,vertexShader:Zr,fragmentShader:Qr}),g=tt(2207),w=12,y=new ua(1,40,28),S=new Float32Array(w),R=new yn(y,x,w),k=new fe,L=new Wt,C=new _,z=new _,b=new _(...Wo),P=[.14,.22,.34];let I=0;const F=Fe.find(W=>W.id==="2").pose,D=new _(...F.pos),J=new _(...F.look).add(new _(...s==="low"?F.pl??[0,0,0]:[0,0,0])).sub(D).normalize(),Y=J.clone().cross(new _(0,1,0)).normalize(),oe=Y.clone().cross(J),ae=D.distanceTo(b),G=Math.tan(10.24/90);for(let W=0;I<w&&W<4e3;W++){const ie=I<4,ye=I>=4&&I<7,Ae=ie?ae+(g()-.5)*2.5:ye?14+g()*5:27.5+g()*3;let be=ie?s==="low"?-1.6+g()*3.4:.25+g()*.7:(g()*2-1)*1.9;ye&&(be=(g()<.5?-1:1)*(1.25+g()*.55)),!ie&&!ye&&(be=-1.7+(I-7)*.78+(g()-.5)*.5);const Se=ie?(g()*2-1)*.75:ye?(g()*2-1)*1.1:.35+g()*.65;if(z.copy(D).addScaledVector(J,Ae).addScaledVector(Y,be*G*Ae*.924*(s==="low"?.32:1)).addScaledVector(oe,Se*G*Ae*(s==="low"?1.6:1)),z.y<3.2)continue;const Be=Ae<ae,Le=new _().subVectors(z,D),Ve=new _().subVectors(b,D);if(Le.normalize().angleTo(Ve.normalize())<(Be?.1:.06))continue;let Ye=!1;for(let Ue=0;Ue<I;Ue++)R.getMatrixAt(Ue,k),new _().setFromMatrixPosition(k).sub(D).normalize().angleTo(Le)<.022&&(Ye=!0);if(Ye)continue;const Pe=ie?.3+g()*.12:ye?.3+g()*.1:P[I%3]*(.6+g()*.25);C.setScalar(Pe),k.compose(z,L,C),R.setMatrixAt(I,k),S[I]=g(),I++}R.count=I,y.setAttribute("aPh",new xn(S,1)),R.frustumCulled=!1,r.add(R);const te={tPic:{value:c.texture},uGain:{value:6.4},uO:{value:new bt(2.5,-17)},uD:{value:new bt(-29,-26).normalize()}},V=new fn({uniforms:te,transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
uniform sampler2D tPic;
uniform float uGain;
uniform vec2 uO;
uniform vec2 uD;
varying vec3 vW;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec2 uv = vec2(vW.x / ${(2*aa).toFixed(1)} + 0.5, -vW.z / ${(2*aa).toFixed(1)} + 0.5);
  vec3 c = texture2D(tPic, uv).rgb;
  vec2 hd = vec2(sin(${Ro.toFixed(6)}), -cos(${Ro.toFixed(6)}));
  float hl = dot(vW.xz, hd), hs = abs(dot(vW.xz, vec2(-hd.y, hd.x)));
  c *= 1.0 - 0.9 * (1.0 - smoothstep(0.25, 0.6, hs)) * step(-4.5, hl) * (1.0 - smoothstep(19.0, 19.6, hl));
  vec2 d = vW.xz - uO;
  float along = dot(d, uD), side = dot(d, vec2(-uD.y, uD.x));
  float w = 3.2 + 2.0 * vn(vec2(along * 0.12, 1.7));
  float band = exp(-(((side + 2.0 * vn(vec2(along * 0.2, 4.0)) - 1.0) / w) * ((side + 2.0 * vn(vec2(along * 0.2, 4.0)) - 1.0) / w)));
  float pass = 0.05 + 0.95 * band * (0.55 + 0.45 * vn(vec2(along * 0.09, side * 0.09)));
  gl_FragColor = vec4(c * uGain * pass, 0.0);
}`}),B=new $a(21.4,128,0,Math.PI*2);B.rotateX(-Math.PI/2);{const W=B.attributes.position;for(let ie=0;ie<W.count;ie++)W.setY(ie,io(Math.hypot(W.getX(ie),W.getZ(ie)))+.02)}const U=new Ke(B,V);U.renderOrder=-1,r.add(U);const H=3,pe=new _,he=new _;let ge=!1;return{group:r,update(W){const ie=W.i,ye=W.local("G"),Ae=ie===2||ie===H&&ye<.3||ie===1&&!W.inHold&&W.u>.3;r.visible=Ae;const be=ie===2||ie===H&&!W.inHold&&W.u<.3;if((be||ge)&&(wa.value=be?D1:1,ge=be),!Ae)return;R.visible=ie===2||ie===H&&!W.inHold&&W.u<.3,U.visible=ie===2||ie===H;const Se=W.trick("2"),Be=W.state.time;p.uTime.value=Be;const Le=Se.phase,Ve=Se.k;p.uHand.value=Ve>0?xt(Le/.7)*(1-ve((Le-.8)/.06)):0,p.uShade.value=Ve>0?1:0,p.uShadeC.value=-24+66*ve((Le-.42)/.58),p.uShadeT.value=Se.t,p.uGain.value=1+1.3*Ve;const Ye=Fe[2],Pe=Fe[1].exposure??1,Ue=Ye.exposure??1,et=Fe[H],Ie=et.exposure??1,ke=ie===2&&!W.inHold?Pe+(Ue-Pe)*ve(W.u/(Ye.exposureIn??1)):ie===H?W.inHold?Ie:Ue+(Ie-Ue)*ve(W.u/(et.exposureIn??1)):Ue;te.uGain.value=6.4*(1+.4*Ve)*Ue/ke*(ie===2&&!W.inHold?ve((W.u-.1)/.35):ie===H?1-ve((ye-.12)/.16):1),p.uRim.value=.55*Vo*(1-.55*Ve),p.uCaus.value=.9*Vo*(1-.7*Ve);const ee=Se.rare>=0?Se.rare:-1;if(M.uRare.value=ee>=0?1:0,M.uRareT.value=Math.max(0,ee),M.uGain.value=.15+(ee>=0?1.4*Math.sin(Math.PI*xt(ee*1.15)):0)+.05*Ve,Se.on&&Ve>0){pe.set((W.state.pointer.x-.5)*2,-(W.state.pointer.y-.5)*2,.5).unproject(W.camera).sub(W.camera.position).normalize();const Ee=b.clone().sub(W.camera.position),Je=Ee.dot(pe);he.copy(W.camera.position).addScaledVector(pe,Je).sub(b);const A=he.length();he.addScaledVector(Ee.normalize(),-.6).normalize(),p.uB.value.copy(he),p.uBulge.value=.2*Ve*Math.exp(-Math.max(0,A-1.2)/3)}else p.uBulge.value=0;u();const j=o.getRenderTarget(),X=wa.value,le=Qn.gain.value;wa.value=0,Qn.gain.value=0;const xe=[];a.traverse(Ee=>{Ee.isSpotLight&&xe.push([Ee,Ee.intensity])}),xe.forEach(([Ee,Je])=>Ee.intensity=Je*L1);const Ce=o.shadowMap.autoUpdate;o.shadowMap.autoUpdate=!1,o.setRenderTarget(c),o.clear(),o.render(a,l),o.setRenderTarget(j),o.shadowMap.autoUpdate=Ce,wa.value=X,Qn.gain.value=le,xe.forEach(([Ee,Je])=>Ee.intensity=Je)}}}const W1=Math.PI*2,So=(t,e,n)=>{const o=Math.min(1,Math.max(0,(n-t)/(e-t)));return o*o*(3-2*o)},Xs=t=>.5-.5*Math.cos(W1*t);function Jr(t){t=t-Math.floor(t);const e=Xs(t),n=1+.35*So(0,.3,t)*(1-So(.75,.97,t)),o=So(.12,.28,t)*(1-So(.75,.95,t)),a=1-So(.2,.42,t)*(1-So(.85,.98,t)),s=.43,r=Math.max(0,(t-s)/.05),i=t<s?0:Math.min(1.12,1-Math.exp(-r*3.2)*Math.cos(r*5))*(1-So(.8,.97,t)),c=t<s?0:So(s,s+.03,t)*(1-So(.55,.72,t)),l=So(.08,.3,t)*(1-So(.8,.97,t));return{s:e,grow:n,ch:o,bridge:a,rec:i,bead:c,open:l}}const oc=`
uniform float uT;
uniform float uK;
uniform vec3 uPO;
uniform vec3 uPD;
uniform float uLean;
uniform float uLoPxH;
float soPx(vec3 p) {
  vec4 m = viewMatrix * vec4(p, 1.0);
  return max(-m.z, 1e-4) / (projectionMatrix[1][1] * uLoPxH * 0.5);
}
vec3 soPull(vec3 p) {
  vec3 q = uPO + uPD * max(dot(p - uPO, uPD), 0.0);
  vec3 d = q - p;
  float l = length(d);
  vec4 m = viewMatrix * vec4(p, 1.0);
  float cap = 0.03 * 2.0 * max(-m.z, 1e-3) / projectionMatrix[1][1];
  return d / max(l, 1e-4) * min(l * 0.2, cap) * exp(-l / 8.0) * uLean * uK;
}
float soSm(float a, float b, float x) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
vec4 soEv(float tau, float snap) {
  tau = fract(tau);
  float s = 0.5 - 0.5 * cos(6.2832 * tau);
  if (snap < 0.5) return vec4(s, 0.0, 0.0, 0.0);
  float p = tau < 0.6 ? soSm(0.25, 0.6, tau) : 0.0;
  float x = max(0.0, (tau - 0.6) / 0.04);
  float gO = clamp(1.0 - exp(-x * 4.0) * cos(x * 7.0), 0.0, 1.25);
  float g = tau < 0.6 ? 0.0 : 0.2 * gO * (1.0 - soSm(0.8, 0.97, tau));
  float dr = tau < 0.6 ? 0.0 : soSm(0.6, 0.68, tau) * (1.0 - soSm(0.84, 0.97, tau));
  return vec4(s, p, g, dr);
}
float soTip(float tau, float snap) {
  tau = fract(tau);
  return (snap < 0.5 || tau < 0.6) ? 0.0 : 1.0 - soSm(0.9, 0.98, tau);
}
`,N1=`
attribute vec3 iA;
attribute vec3 iB;
attribute vec4 iR;
attribute vec4 iS;
${oc}
vec3 loP;
vec3 loN;
float soH(float n) { return fract(sin(n * 91.345 + 7.13) * 43758.5453); }
vec3 soA;
vec3 soB;
float soLen;
float soSag;
vec3 soLeanV;
vec4 soE;
float soTipK;
float soW;
float soNb;
float soSeed;
float soUp;
float soFreeB;
vec3 soCen(float u) {
  float w = 4.0 * u * (1.0 - u);
  vec3 c = mix(soA, soB, u) + vec3(0.0, -soSag * w * (1.0 + 0.25 * w), 0.0) + soLeanV * w;
  return c;
}
float soBeadR(float u, float we) {
  float r = 0.0;
  for (int j = 0; j < 7; j++) {
    if (float(j) >= soNb) break;
    float h = soH(soSeed * 13.1 + float(j) * 3.7);
    float m = h > 0.55 ? 2.0 : 1.0;
    float f0 = fract(h * 7.31);
    float fL = fract(f0 + soUp * m * uT);
    float f = mix(f0, fL, uK);
    float c = 0.12 + 0.76 * f;
    float hb = we * (1.5 + 1.7 * soH(soSeed + float(j) * 5.3)) * pow(max(sin(3.14159 * f), 0.0), 0.6);
    float x = (u - c) * soLen / max(hb * 2.6, 1e-5);
    r = max(r, hb * pow(max(0.0, 1.0 - x * x), 0.85));
  }
  return r;
}
float soRad(float u, float e, float nk) {
  float we = soW * (1.0 - 0.35 * soE.x);
  float q = 2.0 * u - 1.0;
  float r = we * (1.0 + 1.3 * q * q);
  r *= 1.0 - 0.9 * soE.y * exp(-(((u - nk) / (0.05 + 0.12 * (1.0 - soE.y))) * ((u - nk) / (0.05 + 0.12 * (1.0 - soE.y)))));
  float sl = soLen * u, sr = soLen * (1.0 - u);
  r += soW * (1.2 * exp(-sl / (1.6 * soW)) + 1.0 * exp(-((sl / (0.7 * soW)) * (sl / (0.7 * soW)))));
  r += (1.0 - soFreeB) * soW * (1.2 * exp(-sr / (1.6 * soW)) + 1.0 * exp(-((sr / (0.7 * soW)) * (sr / (0.7 * soW)))));
  r = max(r, soBeadR(u, we));
  float tk = max(soTipK, soFreeB);
  if (tk > 0.0) {
    float Rt = soW * (2.3 + 0.6 * soE.w + 0.7 * soFreeB);
    float Lt = Rt * (3.0 + 0.6 * soFreeB);
    float x = e / Lt;
    float tear = x < 1.0 ? Rt * 2.7 * sqrt(max(x, 0.0)) * pow(max(1.0 - x, 0.0), 1.1) : 0.0;
    r = mix(r, max(r * soSm(0.25, 1.0, x), tear), tk);
  }
  return r;
}
void loStrand() {
  float v = min(position.x, 1.0), tip = step(1.0005, position.x), ang = position.y, hs = position.z;
  float flags = iR.w;
  float snap = mod(flags, 2.0);
  soFreeB = step(1.5, mod(flags, 4.0));
  float nk = soFreeB > 0.5 ? 1.0 : iS.x;
  soNb = iS.y; soSeed = iS.z;
  float dropU = iS.w;
  vec4 F = soEv(iR.z, snap);
  vec4 L = soEv(iR.z + uT, snap);
  soE = mix(F, L, uK);
  soTipK = mix(soTip(iR.z, snap), soTip(iR.z + uT, snap), uK);
  soW = iR.x;
  vec3 D = iB - iA;
  float len0 = length(D);
  D /= max(len0, 1e-5);
  soA = iA - D * len0 * 0.025 * soE.x * (1.0 - soFreeB);
  soB = iB + D * len0 * 0.025 * soE.x * (1.0 - soFreeB) + vec3(0.0, -1.0, 0.0) * len0 * 0.12 * soE.x * soFreeB;
  soLen = length(soB - soA);
  soUp = soB.y >= soA.y ? 1.0 : -1.0;
  soSag = iR.y * (1.0 + 0.6 * soE.x);
  soLeanV = soPull(mix(soA, soB, 0.5)) * (1.0 - 0.6 * soE.w);
  float g = soE.z;
  float r;
  vec3 c;
  vec3 T;
  if (hs < 1.5) {
    float span = hs < 0.5 ? nk - g : 1.0 - nk - g;
    if (soFreeB > 0.5 && hs > 0.5) span = 0.0;
    float u = hs < 0.5 ? v * span : 1.0 - v * span;
    float du = 0.002;
    float u2 = hs < 0.5 ? u + du : u - du;
    vec3 hang = vec3(0.0, -1.0, 0.0) * soE.w * soLen * 0.16 * v * v;
    vec3 hang2 = vec3(0.0, -1.0, 0.0) * soE.w * soLen * 0.16 * (v + du / max(span, 1e-3)) * (v + du / max(span, 1e-3));
    c = soCen(u) + hang;
    vec3 c2 = soCen(u2) + hang2;
    T = normalize(c2 - c + vec3(1e-6, 0.0, 0.0));
    float e = soLen * span * (1.0 - v);
    float e2 = max(e - soLen * du, 0.0);
    r = soRad(u, e, nk);
    float r2 = soRad(u2, e2, nk);
    r = max(r, 0.6 * soPx(c));
    r2 = max(r2, 0.6 * soPx(c2));
    vec3 ref = abs(T.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 N1 = normalize(cross(T, ref));
    vec3 N2 = cross(T, N1);
    vec3 rad = cos(ang) * N1 + sin(ang) * N2;
    float drds = (r2 - r) / max(length(c2 - c), 1e-6);
    if (span <= 0.0) r = 0.0;
    if (tip > 0.5) { r = 0.0; }
    loP = c + rad * r;
    loN = tip > 0.5 ? T : normalize(rad - T * drds);
  } else {
    float on = step(0.001, dropU) * (1.0 - step(0.5, snap));
    vec3 c0 = soCen(dropU);
    float Ld = soW * (9.0 + 5.0 * soE.x) * on;
    float Rb = soW * 1.8;
    c = c0 + vec3(0.0, 1.0, 0.0) * soW * 0.6 + vec3(0.0, -1.0, 0.0) * Ld * v;
    T = vec3(0.0, -1.0, 0.0);
    float e = (1.0 - v) * Ld, Lb = Rb * 3.0, x = e / Lb;
    float neck = soW * 0.5 + soW * 1.6 * exp(-(v * Ld) / soW);
    float tear = x < 1.0 ? Rb * 2.7 * sqrt(max(x, 0.0)) * pow(max(1.0 - x, 0.0), 1.1) : 0.0;
    float ex = (1.0 - v - 0.01) * Ld / Lb;
    float tear2 = ex < 1.0 ? Rb * 2.7 * sqrt(max(ex, 0.0)) * pow(max(1.0 - ex, 0.0), 1.1) : 0.0;
    float neck2 = soW * 0.5 + soW * 1.6 * exp(-((v + 0.01) * Ld) / soW);
    r = max(neck, tear);
    float r2 = max(neck2, tear2);
    r = max(r, 0.6 * soPx(c)) * on;
    vec3 rad = cos(ang) * vec3(1.0, 0.0, 0.0) + sin(ang) * vec3(0.0, 0.0, 1.0);
    float drds = (r2 - r) / max(Ld * 0.01, 1e-6);
    if (tip > 0.5) r = 0.0;
    loP = c + rad * r;
    loN = tip > 0.5 ? T : normalize(rad - T * drds);
  }
}
`,B1=`
attribute vec2 aM;
attribute vec4 aE;
attribute vec3 aTu;
attribute vec3 aTv;
${oc}
uniform float uWs;
varying vec2 vM;
varying vec4 vE;
varying vec3 vTu;
varying vec3 vTv;
vec3 loP;
vec3 loN;
void loWeb() {
  vec3 p = position + vec3(0.0, -1.0, 0.0) * aE.y * 0.06 * uWs;
  p += soPull(p) * aE.y;
  loP = p;
  loN = normal;
  vM = aM;
  vE = aE;
  vTu = normalize((modelViewMatrix * vec4(aTu, 0.0)).xyz);
  vTv = normalize((modelViewMatrix * vec4(aTv, 0.0)).xyz);
}
`,qa=30,H1=`
uniform vec4 uH[${qa}];
uniform vec4 uH2[${qa}];
uniform vec4 uPa;
uniform vec4 uPb;
uniform vec4 uPc;
uniform float uRim;
uniform vec3 uLv;
uniform float uHl;
varying vec2 vM;
varying vec4 vE;
varying vec3 vTu;
varying vec3 vTv;
float soHole(vec2 p, vec4 h, vec4 h2) {
  vec2 d = p - h.xy;
  float ca = cos(h2.x), sa = sin(h2.x);
  vec2 q = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
  vec2 rr = max(h.zw, vec2(1e-4));
  float k = length(q / rr);
  float a = atan(q.y, q.x);
  float wob = 1.0 + 0.07 * sin(a * 3.0 + h2.w) + 0.04 * sin(a * 5.0 + h2.w * 2.3);
  return (k - wob) * min(rr.x, rr.y);
}
float soField(vec2 p) {
  float web = vE.w;
  float f = 1e3;
  for (int i = 0; i < ${qa}; i++) {
    if (abs(uH2[i].z - web) > 0.25 || uH[i].z <= 0.0) continue;
    f = min(f, soHole(p, uH[i], uH2[i]));
  }
  if (abs(uPc.w - web) < 0.25 && uPc.x > 0.0) {
    vec2 A = uPa.xy, B = uPa.zw, ax = normalize(B - A), nx = vec2(-ax.y, ax.x);
    float L = length(B - A);
    vec2 d = p - A;
    float al = dot(d, ax), pe = dot(d, nx);
    float cw = uPc.x;
    float dc = max(abs(pe) - cw, abs(al - 0.5 * L) - 0.5 * L);
    float mid = uPb.w;
    float bw = uPc.y;
    float gh = uPc.z;
    float br = max(abs(al - mid) - 0.5 * bw, gh - abs(pe));
    float rb = uPb.x;
    if (rb > 0.0) {
      br = min(br, length(vec2(al - mid, abs(pe) - gh)) - rb);
    }
    f = min(f, max(dc, -br));
  }
  float sc = 0.5 + 0.5 * sin(vM.x * 5.3 + 0.7) * sin(vM.x * 2.1 + 2.0);
  f = min(f, vE.x - vE.z * 0.09 * sc);
  return f;
}
`;function O1(t,e,n){const o=[],a=[];for(let r=0;r<3;r++){const i=o.length/3,c=r<2?t:n;for(let d=0;d<=c;d++)for(let u=0;u<e;u++)o.push(d/c,u/e*Math.PI*2,r);const l=o.length/3;o.push(1.01,0,r);for(let d=0;d<c;d++)for(let u=0;u<e;u++){const p=i+d*e+u,f=i+d*e+(u+1)%e,v=p+e,h=f+e;a.push(p,f,v,f,h,v)}for(let d=0;d<e;d++){const u=i+c*e+d,p=i+c*e+(d+1)%e;a.push(u,p,l)}}const s=new P0;return s.setAttribute("position",new ct(o,3)),s.setIndex(a),s}function ei(t,e,n,o,a,s){const r=t.onBeforeCompile;return t.onBeforeCompile=(i,c)=>{r.call(t,i,c),Object.assign(i.uniforms,e,{uLoPxH:Qa}),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${n}`).replace("#include <beginnormal_vertex>",`${o}
vec3 objectNormal = loN;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = loP;"),s&&(i.fragmentShader=s(i.fragmentShader))},t.customProgramCacheKey=()=>a,t}function ta(t,e,n){const o=t.top.length-1,a=(r,i)=>{const c=i*o,l=Math.min(o-1,Math.floor(c)),d=c-l;return r[l].clone().lerp(r[l+1],d)},s=t.waist?.5+(e-.5)*(1-t.waist*Math.sin(Math.PI*n)):e;return a(t.top,s).lerp(a(t.bot,s),n)}function V1(t,e){const n=[],o=[],a=[],s=[],r=[],i=[],c=[],l=[];t.forEach((u,p)=>{u.top.length-1;const f=e?u.small?10:22:u.small?18:44,v=e?u.small?14:36:u.small?28:80,h=(w,y)=>ta(u,w,y),m=(()=>{let w=0,y=h(0,.5);for(let S=1;S<=60;S++){const R=h(S/60,.5);w+=R.distanceTo(y),y=R}return w})(),M=w=>{let y=0,S=h(w,0);for(let R=1;R<=20;R++){const k=h(w,R/20);y+=k.distanceTo(S),S=k}return y},x=M(.5);l.push({W:m,H:x});const g=n.length/3;for(let w=0;w<=v;w++){const y=w/v,S=M(y);for(let R=0;R<=f;R++){const k=R/f,L=h(y,k),C=.001,z=h(Math.min(1,y+C),k).sub(h(Math.max(0,y-C),k)),b=h(y,Math.min(1,k+C)).sub(h(y,Math.max(0,k-C))),P=z.clone().cross(b).normalize();n.push(L.x,L.y,L.z),o.push(P.x,P.y,P.z);const I=S*k-(x*.5-S*.5);a.push(m*y,I);let F=1e3;(u.free==="topbot"||u.free==="bot")&&(F=Math.min(F,S*(1-k))),u.free==="topbot"&&(F=Math.min(F,S*k)),u.free==="sides"&&(F=Math.min(F,m*Math.min(y,1-y)*(1-u.waist*Math.sin(Math.PI*k))));const D=u.free==="sides"?Math.sin(Math.PI*k)*.6:Math.sin(Math.PI*y)*(u.free==="bot"?k:1);s.push(F,D,u.free!=="sides"&&k>.5?1:0,p),z.normalize(),b.normalize(),r.push(z.x,z.y,z.z),i.push(b.x,b.y,b.z)}}for(let w=0;w<v;w++)for(let y=0;y<f;y++){const S=g+w*(f+1)+y,R=S+f+1;c.push(S,R,S+1,S+1,R,R+1)}});const d=new Ln;return d.setAttribute("position",new ct(n,3)),d.setAttribute("normal",new ct(o,3)),d.setAttribute("aM",new ct(a,2)),d.setAttribute("aE",new ct(s,4)),d.setAttribute("aTu",new ct(r,3)),d.setAttribute("aTv",new ct(i,3)),d.setIndex(c),{g:d,sizes:l}}function ac(t){const e=t.q==="low",n=e?t.strands.filter(C=>(C.tier??1)<2):t.strands,o=e?t.webs.filter(C=>!C.small):t.webs,a={uT:{value:0},uK:{value:0},uPO:{value:new _},uPD:{value:new _(0,0,-1)},uLean:{value:1}},s=new pt,r=O1(e?40:110,e?6:10,e?16:36),i=Math.max(1,n.length),c=new Float32Array(i*3),l=new Float32Array(i*3),d=new Float32Array(i*4),u=new Float32Array(i*4),p=(C,z)=>{c.set([z.a.x,z.a.y,z.a.z],C*3),l.set([z.b.x,z.b.y,z.b.z],C*3);const b=(z.snap?1:0)+(z.end==="drop"?2:0);d.set([z.w,z.sag??z.a.distanceTo(z.b)*.1,z.ph??0,b],C*4),u.set([z.nk??.5,Math.min(7,z.beads??0),z.seed??C*1.37,z.drop??0],C*4)};n.forEach((C,z)=>p(z,C));const f={iA:new xn(c,3),iB:new xn(l,3),iR:new xn(d,4),iS:new xn(u,4)};for(const[C,z]of Object.entries(f))z.setUsage(ki),r.setAttribute(C,z);r.instanceCount=n.length;const v=ei(jo({env:t.env??1}),a,N1,"loStrand();","ss-sticky-strand"),h=new Ke(r,v);h.frustumCulled=!1,s.add(h);const m={uH:{value:Array.from({length:qa},()=>new rn)},uH2:{value:Array.from({length:qa},()=>new rn(0,0,-1,0))},uPa:{value:new rn},uPb:{value:new rn},uPc:{value:new rn(0,0,0,-1)},uRim:{value:.05},uLv:{value:new _(0,1,0)},uHl:{value:1},uWs:{value:0}};let M=null,x=[];const g=[];if(o.forEach((C,z)=>C.holes.forEach(b=>g.push({w:z,h:b}))),o.length){const C=V1(o,e);x=C.sizes;const z=jo({env:(t.env??1)*1.3});z.side=uo,ei(z,{...a,...m},B1,"loWeb();","ss-sticky-web",D=>D.replace("#include <common>",`#include <common>
${H1}`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
float soF = soField(vM);
if (soF < 0.0) discard;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
float soHl = 0.0;
{
  float eps = 0.004;
  float gx = soField(vM + vec2(eps, 0.0)) - soF;
  float gy = soField(vM + vec2(0.0, eps)) - soF;
  vec2 gm = vec2(gx, gy);
  float gl = length(gm);
  float x = clamp(soF / uRim, 0.0, 1.0);
  if (gl > 1e-6 && x < 1.0) {
    vec3 gw = normalize(vTu * gm.x + vTv * gm.y);
    float c = sqrt(max(1.0 - (1.0 - x) * (1.0 - x), 0.0));
    vec3 nn = normalize(normal * c - gw * (1.0 - x) * 1.4);
    normal = nn;
    float fac = max(dot(-gw, uLv), 0.0);
    soHl = exp(-(((x - 0.4) / 0.2) * ((x - 0.4) / 0.2))) * (0.08 + 0.92 * fac * fac * fac);
  }
}`).replace("#include <clearcoat_normal_fragment_maps>",`#include <clearcoat_normal_fragment_maps>
clearcoatNormal = normal;`).replace("#include <opaque_fragment>",`outgoingLight *= mix(0.1, 1.0, 1.0 - clamp(soF / uRim, 0.0, 1.0));
outgoingLight += vec3(0.16) * soHl * uHl;
#include <opaque_fragment>`)),M=new Ke(C.g,z),M.frustumCulled=!1,s.add(M);const b=new Ln,P=C.g.getIndex().array,I=[];for(let D=0;D<P.length;D+=3)I.push(P[D],P[D+1],P[D+2],P[D],P[D+2],P[D+1]);b.setAttribute("position",C.g.getAttribute("position")),b.setIndex(I);const F=new Ke(b,new fn({colorWrite:!1,depthWrite:!1,vertexShader:"void main() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }",fragmentShader:"void main() { gl_FragColor = vec4(0.0); }"}));F.material.depthWrite=!0,F.frustumCulled=!1,s.add(F)}const w=(C,z,b)=>C+(z-C)*b;function y(C,z){if(!M)return;const b=Jr(C),P=Jr(0),I=B=>w(P[B],b[B],z),F=I("grow"),D=I("ch"),J=I("bridge"),Y=I("rec"),oe=I("bead"),ae=I("open");let G=-1,te=-1,V=-1;if(g.forEach(({w:B,h:U},H)=>{if(H>=qa)return;const pe=x[B],he=w(Xs(U.ph??0),Xs((U.ph??0)+C),z);let ge=1;(U.kind==="breathe"||!U.kind)&&(ge=1+.18*he),U.kind==="open"&&(ge=ae),(U.kind==="pairA"||U.kind==="pairB")&&(ge=F,V=B,U.kind==="pairA"?G=H:te=H),m.uH.value[H].set(U.u*pe.W,U.v*pe.H,U.rx*pe.W*ge,U.ry*pe.W*ge),m.uH2.value[H].set(U.ang??0,0,B,(U.ph??0)*6.283+H)}),G>=0&&te>=0){const B=m.uH.value[G],U=m.uH.value[te];m.uPa.value.set(B.x,B.y,U.x,U.y);const H=Math.hypot(U.x-B.x,U.y-B.y),pe=Math.min(B.z,B.w),he=Math.min(U.z,U.w),ge=Math.max(.01,H-Math.max(B.z,B.w)-Math.max(U.z,U.w)),W=.014,ie=Math.min(pe,he)*.7*D,ye=(H+Math.max(B.z,B.w)-Math.max(U.z,U.w))*.5,Ae=w(W,ge+.2,J);m.uPc.value.set(ie,Ae,ie*Math.min(1.12,Y),V),m.uPb.value.set(oe*W*3.4,0,0,ye)}m.uWs.value=I("s")}function S(C){m.uLv.value.copy(C).normalize()}function R(C,z,b,P=1){a.uT.value=C,a.uK.value=z,a.uPO.value.copy(b.origin),a.uPD.value.copy(b.direction),a.uLean.value=P,y(C,z)}function k(C,z){p(C,z)}function L(){for(const C of Object.values(f))C.needsUpdate=!0}return{group:s,strands:h,webs:M,uniforms:a,webUniforms:m,update:R,setLight:S,moveStrand:k,commit:L,material:v,kept:n,sizes:x}}function q1(t){const e=t>2?28:14,n=t>2?10:5,o=[],a=[];for(let r=0;r<=e;r++){const i=r/e*Math.PI*2;for(let c=0;c<=n;c++){const l=c/n,d=Math.cos(l*Math.PI/2),u=Math.sin(l*Math.PI/2)*.55,p=Math.cos(i),f=Math.sin(i),v=f<0?1+1.6*(-f)**1.5:1;o.push(p*d*(1-.12*(f<0?-f:0)),u*(f<0?1-.45*-f:1),f*d*v)}}for(let r=0;r<e;r++)for(let i=0;i<n;i++){const c=r*(n+1)+i,l=c+n+1;a.push(c,c+1,l,c+1,l+1,l)}const s=new Ln;return s.setAttribute("position",new ct(o,3)),s.setIndex(a),s.computeVertexNormals(),s}function G1(t){const e=t?40:18,n=[];for(let a=0;a<=e;a++){const s=a/e,r=.022+.05*Math.exp(-s/.05)+.035*Math.exp(-(((s-0)/.12)**2)),i=.022*(1-.35*Math.exp(-(((s-.45)/.18)**2))),c=Math.max(0,1-((s-.45)/.09)**2)**.85*.05,l=s>.6?1-(s-.6)/.4:1;n.push(new bt(Math.max(8e-4,Math.max(s<.1?r:i,c)*(s>.6?l**1.3:1)),s))}const o=new Pi(n,t?12:6);return o.computeVertexNormals(),o}const Rt=(t=0,e=0,n=0)=>new _(t,e,n),q0=Math.PI*2,Qo=Fe.findIndex(t=>t.id==="3"),U1=.5,G0=2.5,$1=2.4,u0=.5,j1=.35;function K1(t){const{kit:e}=t,n=e.q,o=za(n),a=n==="low",s=new pt,r=tt(303),i=Fe[Qo],c=(N,ce,we,He=!0)=>{const De=new Ke(N,cn({tier:n,...ce}));return we&&De.applyMatrix4(we),De.castShadow=He&&!a,De.receiveShadow=!a,De},l=(N,ce,we={})=>{for(const He of N.inst){if(!He.mats.length)continue;const De=new yn(He.geo,cn({finish:He.finish,seed:He.seed,tier:n,...we}),He.mats.length);He.mats.forEach((ht,je)=>De.setMatrixAt(je,ht)),De.instanceMatrix.needsUpdate=!0,De.computeBoundingSphere(),De.castShadow=!1,De.receiveShadow=!a,ce.add(De)}},d={value:new rn(0,1,0,0)},u=ga.clone().multiplyScalar(.72).addScaledVector(Oa,-.69).normalize(),p=xa.clone().addScaledVector(u,-xa.dot(u)).normalize(),f=p.clone().cross(u).normalize(),v=$1+j1,h=new _(3.5,v+u0/2,-.3),m=Qc,M=new fe().makeBasis(p,u,f),x=m.clone().sub(h.clone().applyMatrix4(M));M.setPosition(x);const g=(N,ce,we)=>Rt(N,ce,we).applyMatrix4(M);{const N=Array.from({length:96},(He,De)=>[Math.cos(De/96*q0)*23.5,Math.sin(De/96*q0)*23.5]),ce=[[-9,6,1.2],[3,-4,.9],[-14,-6,1.6],[8,10,.7],[-3,14,1.1],[12,-2,.8]].map(([He,De,ht])=>({at:[He,De],r:ht,sink:ht*.6})),we=xo({outline:N,holes:ce,t:1.6,bevel:.15,detail:o,round:0});s.add(c(we.geo,{finish:"grained",seed:301,age:.5,tone:.2,direct:.1,wear:.5},new fe().makeTranslation(0,La-.8,0),!1))}const w=new pt;w.applyMatrix4(M),s.add(w);const y=Nl({R:G0,detail:o,seed:31});w.add(c(y.pieces[0].geo,{finish:"turned",seed:31,age:.3,tone:.5,direct:.5,rim:d})),w.add(c(y.pieces[1].geo,{finish:"sunray",seed:32,age:.15,tone:.3,direct:.35},y.pieces[1].at));{const N=Ko({teeth:32,r:1.25,profile:"ratchet",spokes:0,hole:.3,t:.4,detail:o,seed:33,bevel:.04});N.translate(0,v+u0/2+.2,0),w.add(c(N,{finish:"sunray",seed:33,age:0,wear:.05,tone:.3,direct:.5}))}const S=(()=>{const N=vs(je=>[je*6,-je*.5],je=>1.45-.6*(je*je*(3-2*je)),dt(70,o,24),18),ce=[[-.9,-.9],[5.95,-.5],[.9,.95]],we=xo({outline:N,holes:[...ce.map(je=>({at:je,r:.5,sink:.3})),{at:[0,0],r:.6,bush:!0}],t:u0,bevel:.1,detail:o,round:1}),He=new fe().makeTranslation(0,v,0).multiply(new fe().makeRotationY(0)),De=c(we.geo,{finish:"brushed",seed:21,age:0,tone:.14,direct:.3,wear:0},He);{const je=De.material,tn=je.onBeforeCompile,Dt=je.customProgramCacheKey;je.onBeforeCompile=(Bt,wt)=>{tn.call(je,Bt,wt),Bt.fragmentShader=Bt.fragmentShader.replace(`reflectedLight.directSpecular *= uRS2.y;
reflectedLight.directDiffuse *= uRS2.y;`,`float bandM = mix(0.08, 1.0, 1.0 - smoothstep(0.32, 0.62, abs(vOP.z + 0.3)));
reflectedLight.directSpecular *= uRS2.y * bandM;
reflectedLight.directDiffuse *= uRS2.y * bandM;`)},je.customProgramCacheKey=()=>Dt.call(je)+"-band"}we.bushes&&w.add(c(we.bushes,{finish:"polished",seed:22,age:.3},He));const ht=new pt;return ht.applyMatrix4(He),w.add(ht),l({inst:M0("small",ce,u0/2-.19,21,{detail:o,abused:[2]})},ht,{age:.4,tone:.8}),w.add(De),{mesh:De,m:He}})();{const N=S.m.clone().invert(),ce=h.clone().applyMatrix4(N),we=Rt(1,0,0).transformDirection(N),He=Rt(0,0,-1).transformDirection(N),De=Xa("barrel-bridge",S.mesh,{at:[ce.x,ce.y,ce.z],right:[we.x,we.y,we.z],up:[He.x,He.y,He.z],width:7.6,depth:.12},t.lang,{tier:n}),ht=globalThis;(ht.__secondWait??=[]).push(De.ready)}const R=[],k=3.2,L=.8,C=G0-.3,z=1.2;for(let N=0;N<=160;N++){const ce=N/160,we=z+ce*k*q0,He=L+(C-L)*Math.pow(ce,.85);R.push(g(Math.cos(we)*He,.75,Math.sin(we)*He))}const b=z+k*q0,P=g(Math.cos(b+.5)*(G0+.25),.8,Math.sin(b+.5)*(G0+.25)),I=new z0([...R,P,...Us],!1,"centripetal"),F=a?500:1400,D=I.getSpacedPoints(F),J=I.getLength(),oe=(()=>{let N=0;for(let ce=1;ce<R.length;ce++)N+=R[ce].distanceTo(R[ce-1]);return N})()/J,ae=Rt(...i.light.blade.to).sub(Rt(...i.light.blade.from)).normalize(),G=(()=>{let N=0,ce=1e9;return D.forEach((we,He)=>{const De=we.distanceTo(Us[3]);De<ce&&(ce=De,N=He)}),N/F})(),te=[],V=[],B=[];for(let N=0;N<=F;N++){const ce=N/F,we=D[Math.min(F,N+1)].clone().sub(D[Math.max(0,N-1)]).normalize(),He=ea.clone().sub(D[N]).normalize(),De=ae.clone().negate(),ht=De.addScaledVector(He,-De.dot(He)).normalize().addScaledVector(He,.14).normalize();let je=ht.clone().addScaledVector(we,-ht.dot(we)).normalize();const tn=Math.exp(-(((ce-G)/.1)**2)),Dt=Math.exp(-(((ce-(oe+(G-oe)*.45))/.07)**2)),Bt=(1-tn)*(Math.PI*.5*Dt+Math.sin(ce*23)*.45+(ce>G?(ce-G)*3.2:0));je.applyAxisAngle(we,Bt);let wt=we.clone().cross(je).normalize();if(ce<oe+.02){const At=u.clone().addScaledVector(we,-u.dot(we)).normalize(),ot=ve((ce-oe+.02)/.06);wt=At.lerp(wt,ot).normalize(),je=wt.clone().cross(we).normalize()}te.push(we),V.push(je),B.push(wt)}const U=3.1,H=U/14,pe=N=>U*(N>.985?.45+(1-N)*36:1),he=gs({pts:D,side:B,w:pe,t:H,detail:o,cav:N=>N<oe?.35:0});{const N=o===0?1:2,ce=4*(N+1),we=he.getAttribute("normal"),He=Math.tan(.42),De=Rt(),ht=new Map([[N,1],[N+1,-1],[3*(N+1)-1,-1],[3*(N+1),1]]);if(we.count>=D.length*ce)for(let je=0;je<D.length;je++)for(const[tn,Dt]of ht){const Bt=je*ce+tn;De.set(we.getX(Bt),we.getY(Bt),we.getZ(Bt)).addScaledVector(B[je],Dt*He).normalize(),we.setXYZ(Bt,De.x,De.y,De.z)}we.needsUpdate=!0}const ge={value:new rn(0,1,0,0)},W=c(he,{finish:"polished",seed:34,age:.3,wear:.55,tone:.6,direct:1,objScale:1,envMap:.35,rim:ge},void 0,!1);{const N=W.material,ce=N.onBeforeCompile.bind(N),we=N.customProgramCacheKey.bind(N);N.onBeforeCompile=(He,De)=>{ce(He,De),He.fragmentShader=He.fragmentShader.replace("col += scr * 0.05 * (1.0 - pitM) * (1.0 - scaleM) * cF * uTone;","float stn = smoothstep(0.32, 0.5, scr + (tri(tNz, sp * 5.0, tw).r - 0.5) * 0.45 + (tri(tNz, sp * 13.0, tw).a - 0.5) * 0.2) * step(0.0001, scr); col = mix(col, 0.005, stn * (1.0 - scaleM)); col = mix(col, 0.004, smoothstep(0.02, 0.2, pitM));").replace("ssRough += scr * 0.035;","ssRough = mix(ssRough, 0.85, stn);").replace("float ssH = ","ssMetal = mix(ssMetal, 1.0, clamp(max(max(smoothstep(0.02, 0.2, pitM), chip * 0.85), stn), 0.0, 1.0)); float ssH = ").replace(" - pitH - scr"," - pitH * 0.15 - scr")},N.customProgramCacheKey=()=>we()+"-stain"}s.add(W);const ie={uGain:{value:0},uT:{value:0}},ye=new Ke(new oo(1,1),new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:ie,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv * vec2(1.4, 1.0) + vec2(uT * 0.03, -uT * 0.02);
  float n = 0.5 * vn(q * 2.3 + 1.7) + 0.3 * vn(q * 5.1 + 4.2) + 0.2 * vn(q * 11.0 + 8.9);
  vec2 bq = vUv * vec2(1.1, 1.4); float body = exp(-dot(bq, bq) * 1.6);
  float e = body * (0.25 + 0.75 * smoothstep(0.28, 0.85, n)) * (0.6 + 0.4 * smoothstep(-0.6, 0.4, -vUv.y));
  gl_FragColor = vec4(vec3(0.6, 0.035, 0.02) * e * uGain, 0.0);
}`}));ye.position.copy(kn(.62,-.22,17)),ye.lookAt(ea),ye.scale.set(15,10,1),ye.renderOrder=4,ye.frustumCulled=!1,s.add(ye);const Ae={uGain:{value:0}},be=new Ke(new oo(1,1),new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:Ae,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; varying vec2 vUv;
float h1(float x) { return fract(sin(x * 91.7) * 43758.5); }
float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main() {
  vec2 d = normalize(vec2(0.8, -0.6)), n = vec2(-d.y, d.x);
  float a = dot(vUv, d), c = dot(vUv, n);
  float core = exp(-c * c * 5.0) * (1.0 - smoothstep(0.6, 1.0, abs(a)));
  float streak = 0.6 + 0.4 * vn(c * 19.0 + 2.0) * vn(c * 47.0 + 5.0);
  float e = core * streak * (1.0 - smoothstep(0.8, 1.0, length(vUv)));
  gl_FragColor = vec4(vec3(0.6, 0.59, 0.58) * e * uGain, 0.0);
}`}));be.position.copy(kn(-.4,.35,44)),be.lookAt(ea),be.scale.set(46,30,1),be.renderOrder=4,be.frustumCulled=!1,s.add(be);const Se=be.clone();Se.position.copy(kn(.38,.78,30)),Se.lookAt(ea),Se.scale.set(15,8.5,1),s.add(Se);let Be=!1,Le=0,Ve=1;W.frustumCulled=!1,W.onBeforeRender=()=>{if(!Be)return;const N=Le;$e.on=1,$e.columns=ee.map(ce=>[...ce]),$e.floorY=La,$e.red.set(10-2*N,La+1+.5*N,-8+1.5*N),$e.redSize.set(9+1.5*N,3.2+.6*N,9+1*N),$e.redPower=(.12+.03*N)*Ve,$e.ruby.set(vo[0],vo[1],vo[2]),$e.rubyPower=0,$e.nave.set(0,0,0,0),$e.bladeGain=U1*(1-.5*N)*Ve,$e.wake=N};for(let N=0;N<=F;N++)V[N].dot(ea.clone().sub(D[N]))<0&&V[N].negate();const Ye=N=>{const ce=Math.round(xt(N)*F);return{p:D[ce].clone(),n:V[ce].clone(),s:B[ce].clone(),t:te[ce].clone(),w:pe(N)}},Pe=(N,ce)=>{const we=Math.round(xt(N)*F);return ce.p.copy(D[we]),ce.n.copy(V[we]),ce.s.copy(B[we]),ce.t.copy(te[we]),ce.w=pe(N),ce},Ue=(N,ce=0,we=1,He=0)=>{const De=Ye(N);return De.p.addScaledVector(De.s,ce*De.w*.45).addScaledVector(De.n,we*(H*.5+He))},et=new pt;s.add(et);const Ie=[];[[-.6,.35,22,3.6,96,1],[-.1,.62,26,3,80,2],[.45,.05,27,2.6,72,3],[-.4,.02,20,2,64,4],[.92,.72,24,3.2,84,5],[.12,.3,34,4.2,110,6],[-.85,.6,19,1.6,60,7]].forEach(([N,ce,we,He,De,ht],je)=>{const tn=Ko({teeth:De,r:He,profile:"train",spokes:je%3?5:4,rim:.08,hub:.14,hole:.2,detail:o,seed:330+je,sheared:je%2,fold:je===2?.7:void 0,foldAt:je===2?.5:void 0,snapped:je===4}),Dt=kn(N,ce,we),Bt=new Bn(.6+ht*.7,ht*1.9,.4-ht*.5),wt=new fe().compose(Dt,new Wt().setFromEuler(Bt),Rt(1,1,1));if(et.add(c(tn,{finish:"sunray",seed:330+je,age:.2,tone:.12,direct:.08,envMap:.4,rim:d},wt,!1)),Ie.push({c:Dt,r:He,ax:Rt(0,1,0).applyEuler(Bt)}),je<5){const At=v0({length:4.5,ra:.16,leaves:8+je,pinionR:.5,pinionH:.7,pinionAt:1.2,seatAt:2.2,detail:o,seed:340+je}),ot=wt.clone().multiply(new fe().makeTranslation(je===0||je===3?.55:0,je===0||je===3?-3.7:-2.2,je===0||je===3?.35:0));et.add(c(At.geo,{finish:"turned",seed:340+je,age:.6,tone:.45,direct:.3,rim:d},ot,!1))}});{const N=cr({length:12,width:2.4,t:.6,detail:o,seed:350}),ce=new fe().compose(kn(.55,.25,25),new Wt().setFromEuler(new Bn(1.1,.5,-.7)),Rt(1,1,1));et.add(c(N.pieces[0].geo,{finish:"blackened",seed:350,age:.6,tone:.4,direct:.25,rim:d},ce,!1))}const ee=[];for(const[N,ce,we]of[[-.78,24,.9],[.98,22,.8],[.3,34,1],[-.25,38,.9]]){const He=kn(N,0,ce),De=11.2,ht=Bi({h:De,r:we,detail:o});et.add(c(ht,{finish:"turned",seed:360+ee.length,age:.6,tone:.4,direct:.3,rim:d},new fe().makeTranslation(He.x,La,He.z),!1)),ee.push([He.x,He.z,we,La+De])}const j={value:new rn(0,1,0,0)},X=[];{const N=Oi({count:a?50:90,box:[1,1,1],centre:[0,0,0],seed:371,detail:o}),ce=tt(372),we=new fe,He=new Wt,De=Rt(),ht=Rt(),je=xa.clone().multiplyScalar(.7).addScaledVector(ga,.55).addScaledVector(Oa,-.45).normalize();for(const tn of N.inst)tn.mats.forEach(Dt=>{Dt.decompose(ht,He,De);const Bt=G-.12+ce()*.3,wt=Ye(Bt),At=Math.pow(ce(),1.6),ot=wt.p.addScaledVector(wt.n,.3+At*1.2).addScaledVector(je,At*6.5).addScaledVector(wt.s,(ce()-.5)*(1+3*At)).addScaledVector(ga,(ce()-.5)*At*2),Yt=De.x*(.55+.5*(1-At));Dt.copy(we.compose(ot,He,Rt(Yt,Yt,Yt))),At<.3&&X.length<16&&X.push(ot.clone())});l(N,s,{age:.4,tone:.8,rim:j})}const le=[],xe=[],Ce=[8,3,1.6],Ee=kn(0,1,1).sub(kn(0,0,1)).dot(ga),Je=kn(1,0,1).sub(kn(0,0,1)).dot(xa),A=N=>{const ce=N.clone().sub(ea),we=ce.dot(Oa);return{x:ce.dot(xa)/we/Je,y:ce.dot(ga)/we/Ee,z:we}},E=N=>A(N).z*2*Ee/1935,Z=(N,ce,we)=>Ce[N]*.5*E(ce.clone().lerp(we,.5))*(.85+.3*r()),se=(N,ce,we,He={})=>le.push({a:N,b:ce,w:Z(we,N,ce),tier:we,ph:r(),beads:we===2?0:3+Math.floor(r()*5),nk:.4+r()*.2,seed:r()*50,...He}),ue=(N,ce)=>g(N,v+u0/2-.1,ce),T=(N,ce=0,we=1)=>Ue(N,ce,we,-H*.45);for(let N=0;N<9;N++){const ce=oe+.015+N*.012,we=1.9+N*.42+r()*.2,He=-.7-r()*.45;se(T(ce,(r()-.5)*1.6,-1),ue(we,He),N%3,{sag:.15+r()*.35,drop:N%3===0?.42+r()*.16:0,snap:N===4})}for(let N=0;N<Math.min(10,X.length);N++){const ce=G-.09+N*.02,we=T(ce,r()<.6?1:-1,1);se(we,X[N],1+N%2,{sag:.15+r()*.3,snap:N===3||N===7})}for(let N=0;N<14;N++){const ce=oe+.025+N*(G-oe-.03)/14+r()*.006;se(T(ce,-1.05,1),T(ce+(r()-.5)*.02,1.05,1),N%3,{sag:-.18-r()*.3,snap:N%5===2})}for(let N=0;N<8;N++){const ce=.9+N*.011,we=G-.16+N*.022;se(T(ce,(r()-.5)*1.6,-1),T(we,(r()-.5)*1.4,1),1+N%2,{sag:.2+r()*.3,drop:N%2?0:.45+r()*.1})}for(let N=0;N<9;N++){const ce=oe+.06+N*((G+.05-oe)/9),we=T(ce,(r()-.5)*1.5,-1),He=.4+r()*.9;se(we,we.clone().add(Rt((r()-.5)*.2,-He,(r()-.5)*.2)),N%2,{sag:0,end:"drop",beads:1+Math.floor(r()*3)})}for(let N=0;N<2;N++){const ce=Ie[N*2+1];se(T(G-.03+N*.05,(r()-.5)*1.4,-1),ce.c.clone().addScaledVector(ga,-ce.r*.9),0,{sag:.9,beads:6,drop:.5})}for(let N=0;N<8;N++){const ce=1.8+r()*3.6,we=-.7-r()*.4;se(ue(ce,we),ue(ce+.3+r()*.9,we-.1-r()*.2),2,{sag:-.12-r()*.2})}const q=(N,ce,we,He)=>{let De=Ue(N,1,0),ht=1e9;for(let je=0;je<=200;je++)for(const tn of[-1,1]){const Dt=N+(ce-N)*je/200,Bt=Ue(Dt,tn*.98,0),wt=A(Bt),At=Math.abs(wt.y-we)-He*wt.x*.02;At<ht&&(ht=At,De=Bt)}return De};{const N=q(oe+.02,G-.05,.12,1),ce=q(oe+.02,G-.05,-.42,1),we=q(G+.05,.99,.16,-1),He=q(G+.05,.99,-.03,-1),De=14,ht=(wt,At)=>At*A(wt).z*Ee,je=[],tn=[];for(let wt=0;wt<=De;wt++){const At=wt/De,ot=Math.sin(Math.PI*At),Yt=N.clone().lerp(we,At),pn=ce.clone().lerp(He,At);je.push(Yt.add(Rt(0,-ht(Yt,.08)*ot,0))),pn.add(Rt(0,-ht(pn,.26)*ot*(1+.2*Math.sin(At*5)),0)),tn.push(pn)}const Dt={top:je,bot:tn,free:"topbot",rim:.04,holes:[{u:.62,v:.5,rx:.1,ry:.07,ang:.35,ph:.1},{u:.2,v:.62,rx:.068,ry:.05,ang:-.7,ph:.45},{u:.34,v:.3,rx:.046,ry:.034,ang:-.4,kind:"pairA"},{u:.44,v:.52,rx:.04,ry:.03,ang:.5,kind:"pairB"},{u:.8,v:.76,rx:.035,ry:.026,ang:1,ph:.4},{u:.09,v:.38,rx:.018,ry:.03,ang:.2,ph:.7},{u:.87,v:.3,rx:.028,ry:.019,ang:-.6,ph:.25},{u:.5,v:.84,rx:.022,ry:.016,ph:.55},{u:.7,v:.2,rx:.014,ry:.021,ang:.9,kind:"open"},{u:.22,v:.16,rx:.02,ry:.014,ang:.3,ph:.9},{u:.94,v:.58,rx:.011,ry:.009,ph:.15},{u:.36,v:.78,rx:.012,ry:.016,kind:"open"},{u:.53,v:.24,rx:.009,ry:.007,ph:.6},{u:.75,v:.45,rx:.008,ry:.011,ph:.3},{u:.3,v:.9,rx:.01,ry:.007,ph:.8},{u:.13,v:.82,rx:.007,ry:.009,ph:.2},{u:.62,v:.9,rx:.013,ry:.01,ang:.4,ph:.65},{u:.47,v:.1,rx:.012,ry:.008,ph:.05}]};xe.push(Dt);const Bt=(wt,At)=>{const ot=ta(Dt,1,At).distanceTo(ta(Dt,0,At)),Yt=ta(Dt,wt,1).distanceTo(ta(Dt,wt,0));for(let nn=0;nn<3;nn++)for(const Mn of Dt.holes){const Fn=Math.max(Mn.rx,Mn.ry)*ot*1.6,An=(wt-Mn.u)*ot,wo=(At-Mn.v)*Yt,po=Math.hypot(An,wo);if(po<Fn){const $n=Fn/Math.max(po,1e-6);wt=Mn.u+An*$n/ot,At=Mn.v+(po<1e-6?Fn:wo*$n)/Yt}}const pn=ta(Dt,Math.min(.98,Math.max(.02,wt)),Math.min(.95,Math.max(.05,At)));return pn.addScaledVector(pn.clone().sub(ea).normalize(),-.02)};for(const[wt,At,ot,Yt,pn]of[[.5,.44,.73,.58,1],[.55,.6,.7,.38,2],[.12,.58,.28,.68,1],[.6,.42,.64,.6,2],[.3,.29,.4,.55,2],[.74,.72,.86,.8,2]])se(Bt(wt,At),Bt(ot,Yt),pn,{sag:.05+r()*.1,beads:pn===1?4:0});for(const[wt,At]of[[.18,.5],[.33,.9],[.47,.35],[.58,1.1],[.71,.6],[.86,.4]]){const ot=ta(Dt,wt,.97),Yt=ta(Dt,wt,.8);se(Yt,ot.clone().add(Rt((r()-.5)*.1,-At,0)),1,{sag:0,end:"drop",beads:1+Math.floor(r()*3)})}}for(const[N,ce,we,He,De]of[[3,oe+.03,oe+.1,-1,1],[1,oe+.2,oe+.3,-1,2]]){const ht=Ie[N],je=6,tn=[],Dt=[],Bt=Ue((ce+we)/2,He,0).sub(ht.c),wt=ht.ax.clone().normalize(),At=Bt.clone().addScaledVector(wt,-Bt.dot(wt)).normalize(),ot=wt.clone().cross(At);for(let Yt=0;Yt<=je;Yt++){const pn=Yt/je;tn.push(Ue(ce+(we-ce)*pn,He*.98,0));const nn=(pn-.5)*.9;Dt.push(ht.c.clone().addScaledVector(At,Math.cos(nn)*ht.r*.97).addScaledVector(ot,Math.sin(nn)*ht.r*.97))}xe.push({top:tn,bot:Dt,free:"sides",waist:.35,small:!0,rim:.03,holes:De===1?[{u:.45,v:.5,rx:.12,ry:.08,ang:.4,ph:.2},{u:.7,v:.28,rx:.05,ry:.04,kind:"open"},{u:.3,v:.76,rx:.04,ry:.06,ph:.6}]:[{u:.55,v:.42,rx:.1,ry:.07,ang:-.3,ph:.5},{u:.3,v:.7,rx:.05,ry:.035,ph:.1},{u:.74,v:.76,rx:.03,ry:.04,kind:"open"}]}),se(tn[0],Dt[0],1,{sag:.1,beads:3}),se(tn[je],Dt[je],1,{sag:.1,beads:4})}const $=a?28:56,de=le.length,re=Array.from({length:$},(N,ce)=>oe+.02+(ce+r()*.7)/$*(G+.03-oe)),ne=Array.from({length:$},()=>.05+r()*r()*.12),K=Array.from({length:$},()=>(r()-.5)*1.5),ze=Array.from({length:$},()=>r());for(let N=0;N<$;N++)le.push({a:Ue(re[N]),b:Ue(re[N]+.01),w:.01,tier:1,sag:0,beads:0,seed:N});const Ne=ac({strands:le,webs:xe,q:n,env:.8});s.add(Ne.group);const Te=Array.from({length:$},(N,ce)=>Ne.kept.indexOf(le[de+ce])),at=jo({env:.8}),qe=new yn(q1(o),at,$);qe.frustumCulled=!1,s.add(qe);const rt=a?18:30,St=new yn(G1(o),jo({env:.8}),rt);St.frustumCulled=!1,s.add(St);const vn=oe+(G-oe)*.62,Jt=Array.from({length:rt},(N,ce)=>{const we=ce*2.399,He=Math.sqrt((ce+.5)/rt);return[Math.cos(we)*He,Math.sin(we)*He,.6+r()*.5]}),Zt=new fe,ln=new Wt,Me=Rt(0,1,0),Ze=Rt(),Re=new ar,it=Rt(),nt=Rt(),We=Rt(),Tt=new fe,jt={p:Rt(),n:Rt(),s:Rt(),t:Rt(),w:0},en={p:Rt(),n:Rt(),s:Rt(),t:Rt(),w:0},Nt=Rt(),Kt=Rt(),Un=Rt(),Tn=Rt(),Xo=Rt(),fa=Rt(),fo=Rt(),lt=Rt();return{group:s,update(N){if(s.visible=N.i>=Qo-1&&N.i<=Qo+1,!s.visible){Ve=0,Be=!1,Le=0,ye.visible=be.visible=Se.visible=!1;return}const ce=N.i===Qo&&N.inHold;N.camera.getWorldPosition(nt),We.copy($e.bladeDir).negate().transformDirection(N.camera.matrixWorldInverse),d.value.set(We.x,We.y,We.z,.5),ge.value.set(We.x,We.y,We.z,1.6),j.value.set(We.x,We.y,We.z,1.4);const we=N.trick("3"),He=we.phase,De=we.k;it.set(N.state.pointer.x*2-1,1-N.state.pointer.y*2,.5).unproject(N.camera),Re.origin.copy(nt),Re.direction.copy(it).sub(nt).normalize();const ht=we.rare>=0?we.rare:-1,je=ht>=0?ve(ht/.35)*(1-ve((ht-.62)/.38)):0;Ne.setLight(We),Ne.update(He,De*(1-.6*je),Re,1);let tn=.5,Dt=1e9;for(let ot=0;ot<=40;ot++){const Yt=oe+(1-oe)*ot/40,pn=D[Math.round(xt(Yt)*F)],nn=Re.distanceSqToPoint(pn);nn<Dt&&(Dt=nn,tn=Yt)}for(let ot=0;ot<$;ot++){const Yt=G+.02-(oe+.03),pn=De>0?(He*(ot%3===0?2:1)+ze[ot])%1:0;let nn=De>0?oe+.03+(re[ot]-oe-.03+pn*Yt*De)%(Yt+.25):re[ot];nn+=(tn-nn)*.25*De*Math.exp(-Math.abs(tn-nn)*6),nn=nn+(vn-nn)*je;const Mn=De>0?ve((nn-oe-.03)/.03)*(1-ve((nn-G)/.04)):1,Fn=ne[ot]*(De>0?.4+.6*Mn:1)*(1-.7*je),An=Pe(Math.min(.99,nn),jt),wo=An.p.addScaledVector(An.s,K[ot]*An.w*.45*(1-je)).addScaledVector(An.n,H*.5);Nt.copy(An.t).addScaledVector(An.n,-An.t.dot(An.n)).normalize(),Kt.copy(An.n).cross(Nt),Tt.makeBasis(Kt,An.n,Nt),ln.setFromRotationMatrix(Tt),Zt.compose(wo,ln,Un.set(Fn,Fn*(.7+.5*De*Mn),Fn*(1+.5*De*Mn))),qe.setMatrixAt(ot,Zt);const po=Pe(Math.max(oe,nn-(.012+.02*De)*Mn),en),$n=po.p.addScaledVector(po.s,K[ot]*po.w*.45*(1-je)).addScaledVector(po.n,H*.5);Te[ot]>=0&&Ne.moveStrand(Te[ot],{a:$n,b:Tn.copy(wo).addScaledVector(Nt,-Fn*1.2),w:Fn*(.08+.1*De),sag:-Fn*.1,beads:0,seed:ot})}Ne.commit(),qe.instanceMatrix.needsUpdate=!0;const Bt=ht>=0?ve((ht-.3)/.22)*(1-ve((ht-.66)/.3)):0;if(St.visible=Bt>.001,St.visible){const ot=Pe(vn,jt),Yt=ot.n.dot(Ze.copy(nt).sub(ot.p))<0?ot.n.negate():ot.n,pn=ot.p.addScaledVector(Yt,H*.5),nn=Ze.copy(nt).sub(pn).normalize(),Mn=fo.copy(ot.s),Fn=lt.copy(nn).cross(Mn).normalize();Jt.forEach(([An,wo,po],$n)=>{Xo.copy(nn).multiplyScalar(.7).addScaledVector(Mn,An*1.5).addScaledVector(Fn,wo*1.5).normalize(),ln.setFromUnitVectors(Me,Xo);const gn=1.5*po*Bt,A0=.45+.2*Bt;Zt.compose(fa.copy(pn).addScaledVector(Mn,An*.15).addScaledVector(Fn,wo*.15),ln,Un.set(gn*A0,gn,gn*A0)),St.setMatrixAt($n,Zt)}),St.instanceMatrix.needsUpdate=!0}const wt=N.i===Qo+1&&!N.inHold;Ve=ce||wt?1:N.i===Qo?ve((N.u-.35)/.25):0,Be=s.visible&&(ce||N.i===Qo&&N.u>.35||wt),Le=De,ye.visible=s.visible&&(ce||N.i===Qo&&N.u>.35),ie.uGain.value=.42*(1+.25*De)*Ve,ie.uT.value=He,be.visible=ye.visible,Se.visible=ye.visible,Ae.uGain.value=.15*Ve;const At=W.material.ss;At.uRS2.value.y=wt?.5:1,At.uTone.value=wt?.45:.6,wt&&(ge.value.w=.2)}}}const sc=(t,e,n)=>{const o=xt((n-t)/(e-t));return o*o*(3-2*o)},ao=.2,Ma=2.2*ao,da=1.2*ao,mr=80,Y1=2*ao,$o=mr*Y1/(2*Math.PI),h0=.5*Ma,go=$o-h0,Do=.028,_s=.026,Ga=Math.PI*2/mr,Ao=-Ga/2,lo=Do*1.1,X1=.42,Z1=.006;function ti(t,e,n,o){const a=new mn,s=n/2,r=[{...t,pts:ls(us(t.pts),!0)},...e.map(l=>({...l,pts:ls(us(l.pts),!1)}))],i=[],c=[];for(const l of r){const d=l.pts,u=d.length,p=l.bevel??o,f=[];for(let S=0;S<u;S++){const R=d[S],k=d[(S+1)%u],L=k[0]-R[0],C=k[1]-R[1],z=Math.hypot(L,C)||1;f.push([C/z,-L/z])}const v=[],h=[],m=[],M=Math.cos((l.sharp??35)*Math.PI/180);for(let S=0;S<u;S++){const R=f[(S-1+u)%u],k=f[S];let L=R[0]+k[0],C=R[1]+k[1];const z=Math.hypot(L,C)||1;L/=z,C/=z,v.push([L,C]),h.push(1/Math.max(.35,L*k[0]+C*k[1])),m.push(R[0]*k[0]+R[1]*k[1]<M)}const x=d.map((S,R)=>(l.cav??0)+(l.cavAt?.[R]??0)),g=d.map((S,R)=>l.edgeAt?.[R]??0),w=Math.SQRT1_2,y=[[[p,s,w,w,.35],[0,s-p,w,w,.35]],[[0,s-p,0,1,.15],[0,-s+p,0,1,.15]],[[0,-s+p,-w,w,.25],[p,-s,-w,w,.25]]];for(let S=0;S<u;S++){const R=(S+1)%u;for(const k of y){const L=k.map(([C,z,b,P,I])=>[S,R].map(F=>{const D=m[F]?f[S]:v[F];return a.v(d[F][0]-v[F][0]*C*h[F],z,d[F][1]-v[F][1]*C*h[F],D[0]*P,b,D[1]*P,x[F]*.55,I*(.6+.6*g[F]))}));a.quad(L[0][0],L[1][0],L[1][1],L[0][1])}}i.push(d.map((S,R)=>[S[0]-v[R][0]*p*h[R],S[1]-v[R][1]*p*h[R]])),c.push(x.map(S=>S*.12))}for(const l of[!0,!1]){const d=i[0].map(m=>new bt(m[0],m[1])),u=i.slice(1).map(m=>m.map(M=>new bt(M[0],M[1]))),p=gi.triangulateShape(d,u),f=a.p.length/3,v=l?s:-s,h=c.flat();i.flat().forEach((m,M)=>a.v(m[0],v,m[1],0,l?1:-1,0,h[M],0));for(const m of p)l?a.tri(f+m[0],f+m[2],f+m[1]):a.tri(f+m[0],f+m[1],f+m[2])}return a.geometry()}function rc(t){const e=t==="low",n=e?3:6,o=e?3:7,a=e?6:16,s=ao/2,r=Ma-h0,i=(r*r+s*s)/(2*s),c=s-i,l=[];l.push({x:-ao,h:0,cav:1,edge:0});for(let u=0;u<=n;u++){const p=u/n*Math.PI/2;l.push({x:-s-Do+Do*Math.sin(p),h:Do-Do*Math.cos(p),cav:.8*(1-u/n),edge:0})}const d=new Set;for(let u=1;u<o;u++)d.add(Do+(h0-Do)*u/o);if(!e)for(const u of[-1.5,-.5,.5,1.5])d.add(lo+u*Z1*.7);[...d].filter(u=>u>Do+1e-4&&u<h0-1e-4).sort((u,p)=>u-p).forEach(u=>l.push({x:-s,h:u,cav:0,edge:0}));for(let u=0;u<a;u++){const p=u/a*.985,f=p*r,v=Math.max(.004,c+Math.sqrt(Math.max(0,i*i-f*f)));l.push({x:-v,h:h0+f,cav:0,edge:sc(.4,.95,p)})}return l}function Q1(t){const e=rc(t),n=[...e,{x:0,h:Ma,cav:0,edge:1},...e.slice(1).reverse().map(d=>({...d,x:-d.x}))];n.pop();const o=[],a=[],s=[],r=[],i=[],c=Array.from({length:7},(d,u)=>-ao/2+ao*u/6),l=[...n.filter(d=>d.x<0&&d.h<lo-1e-4),...c.map(d=>({x:d,h:lo,cav:.2,edge:0})),...n.filter(d=>d.x>0&&d.h<lo-1e-4)];for(let d=0;d<mr;d++)for(const u of d===0?l:n){const p=go+u.h,f=Ao+d*Ga+u.x/$o;o.push([Math.cos(f)*p,Math.sin(f)*p]),a.push(u.cav),s.push(u.edge),r.push(d),i.push(u.h)}return{pts:o,cav:a,edge:s,tooth:r,h:i}}function vr(t,e){const n=new _(Math.cos(Ao),0,Math.sin(Ao)),o=new _(-Math.sin(Ao),0,Math.cos(Ao)),a=Math.hypot(t.x,t.z),s=Math.atan2(t.z,t.x);if(Math.abs(s-Ao)>Ga*.5||a-go<lo-.0201)return t;const r=1,i=X1*r,c=-.175*r,l=(d,u)=>{let p=d.dot(n)-(u?go+lo:0),f=d.dot(o),v=d.y-(u?-da/2:0);const h=Math.cos(i),m=Math.sin(i);[p,v]=[p*h-v*m,p*m+v*h];const M=Math.cos(c),x=Math.sin(c);[p,f]=[p*M-f*x,p*x+f*M],d.copy(n).multiplyScalar(p+(u?go+lo:0)).addScaledVector(o,f),d.y=v+(u?-da/2:0)};return l(t,!0),e&&l(e,!1),t}function J1(t){const e=Q1(t),n=t==="low",o=[],a=go-2*Ma,s=1.25,r=5,i=.42,c=n?24:64;for(let g=0;g<r;g++){const w=(g+.5)*Math.PI*2/r+.3,y=Math.PI/r-i/a/2,S=Math.PI/r-i/s/2,R=Math.max(4,c>>2),k=[];for(let L=0;L<=c;L++){const C=w-y+2*y*L/c;k.push([Math.cos(C)*a,Math.sin(C)*a])}for(let L=0;L<=R;L++){const C=w+S-2*S*L/R;k.push([Math.cos(C)*s,Math.sin(C)*s])}o.push({pts:k,bevel:_s,cav:.4})}o.push({pts:Array.from({length:40},(g,w)=>[Math.cos(w/40*Math.PI*2)*.32,Math.sin(w/40*Math.PI*2)*.32]),bevel:.015,cav:.5});const l=ti({pts:e.pts,cavAt:e.cav,edgeAt:e.edge,sharp:40},o,da,_s);l.computeBoundingSphere();const d=rc(t).filter(g=>g.h>lo-.015+1e-4&&g.x>-ao/2-1e-4),u=lo-.015,p=[{x:-ao/2,h:u,cav:0,edge:0},...d,{x:0,h:Ma,cav:0,edge:1},...d.slice().reverse().map(g=>({...g,x:-g.x})),{x:ao/2,h:u,cav:0,edge:0}],f=p.map(g=>{const w=go+g.h,y=Ao+g.x/$o;return[Math.cos(y)*w,Math.sin(y)*w]}),v=ti({pts:f,cavAt:p.map(g=>g.cav),edgeAt:p.map(g=>g.edge),sharp:40},[],da,_s),h=v.getAttribute("position"),m=v.getAttribute("normal"),M=new _,x=new _;for(let g=0;g<h.count;g++)M.set(h.getX(g),h.getY(g),h.getZ(g)),x.set(m.getX(g),m.getY(g),m.getZ(g)),vr(M,x),h.setXYZ(g,M.x,M.y,M.z),m.setXYZ(g,x.x,x.y,x.z);return h.needsUpdate=m.needsUpdate=!0,v.computeBoundingSphere(),{geo:l,piece:v,O:e}}const Zs=8,ni=1.6*ao,Qs=4*da,Za=.62,S0=.2;function ed(t){const e=t==="low",n=e?3:5,o=e?2:4,a=e?6:14,s=Math.PI*2/Zs,r=ni/2,i=.035,c=[],l=[],d=[],u=[],p=(s*Za-ni)/2;u.push({x:-r-p,h:0,c:1,e:0});for(let x=0;x<=n;x++){const g=x/n*Math.PI/2;u.push({x:-r-i+i*Math.sin(g),h:i-i*Math.cos(g),c:.8*(1-x/n),e:0})}for(let x=1;x<o;x++)u.push({x:-r,h:i+(S0-i)*x/o,c:0,e:0});for(let x=0;x<=a;x++){const g=x/a*Math.PI/2;u.push({x:-r*Math.cos(g),h:S0+r*Math.sin(g),c:0,e:sc(.3,1,x/a)})}const f=[...u,...u.slice(0,-1).reverse().map(x=>({...x,x:-x.x}))];f.pop();for(let x=0;x<Zs;x++)for(const g of f){const w=Za+g.h,y=Math.PI+x*s+g.x/w;c.push([Math.cos(y)*w,Math.sin(y)*w]),l.push(g.c),d.push(g.e)}const v=bn({pts:c,cavAt:l,edgeAt:d,sharp:40},[],{t:Qs,bevel:.022,segs:e?1:3}),h=Qs/2,m=[{r:.001,y:-h-1.2},{r:.22,y:-h-1.2},{r:.22,y:-h-.02},{r:.22,y:h+.02},..._r(.22,h+.34,.33,h+.4,.025),{r:.33,y:h+.46},..._r(.33,h+.5,.22,h+.53,.02),{r:.22,y:h+5},{r:.001,y:h+5}],M=Pt(m,e?32:72);return{geo:v,arb:M,pts:c}}function td(t,e){const n=new _,o=[],a=[];t.pts.forEach((u,p)=>{t.tooth[p]===0&&t.h[p]>Do&&(n.set(u[0],da/2,u[1]),vr(n),o.push([n.x-$o,n.z])),t.tooth[p]===1&&t.h[p]>Do&&a.push([u[0]-$o,u[1]])});const s=e.filter(u=>u[0]<-Za),r=(u,p,f)=>{let v=1e9,h=[0,0],m=[0,0];for(const M of s)for(const x of f){const g=Math.hypot(M[0]+u-x[0],M[1]+p-x[1]);g<v&&(v=g,h=[M[0]+u,M[1]+p],m=x)}return{d:v,a:h,b:m}},i=-.035;let c=Za+S0+ao*1.6+.4,l=r(c,i,o);for(;c>0&&(l=r(c,i,o),!(l.d<.004));c-=.002);const d=r(c,i,a);return{cx:c,cz:i,contact:new _((l.a[0]+l.b[0])/2,0,(l.a[1]+l.b[1])/2),clear:d.d}}const ic=`
uniform float uT;
uniform float uK;
uniform vec3 uPO;
uniform vec3 uPD;
uniform float uLean;
uniform float uLoPxH;
vec4 loShape(float tau) {
  float s = smoothstep(0.0, 0.66, tau) * (1.0 - smoothstep(0.66, 0.76, tau));
  float x = clamp((tau - 0.66) / 0.12, 0.0, 1.0);
  float gO = clamp(1.0 - exp(-x * 7.0) * cos(x * 11.0), 0.0, 1.3);
  float g = tau < 0.66 ? 0.0 : 0.3 * gO * (1.0 - smoothstep(0.8, 0.97, tau));
  float bd = smoothstep(0.34, 0.64, tau) * (1.0 - smoothstep(0.8, 0.98, tau));
  return vec4(s, g, bd, smoothstep(0.66, 0.71, tau) * (1.0 - smoothstep(0.84, 0.97, tau)));
}
vec4 loState(float ph, float rate, float still) {
  vec4 F = loShape(ph);
  vec4 L = loShape(fract(ph + uT * rate));
  vec4 S = mix(F, L, uK);
  if (still > 0.5) S = vec4(S.x * 0.4, 0.0, S.z * 0.5, 0.0);
  return S;
}
vec3 loLean(vec3 mid, float len) {
  vec3 p = uPO + uPD * max(dot(mid - uPO, uPD), 0.0);
  vec3 d = p - mid;
  float l = length(d);
  return d / max(l, 1e-4) * min(l, len * 0.22) * exp(-l / 9.0) * uLean * uK;
}
vec3 loCen(float u, vec3 A, vec3 B, float sag, vec3 lean) {
  float w = 4.0 * u * (1.0 - u);
  return mix(A, B, u) + vec3(0.0, -sag * w * (1.0 + 0.25 * w), 0.0) + lean * w;
}
float loPx(vec3 p) {
  vec4 m = viewMatrix * vec4(p, 1.0);
  return max(-m.z, 1e-4) / (projectionMatrix[1][1] * uLoPxH * 0.5);
}
`,nd=`
attribute vec3 iA;
attribute vec3 iB;
attribute vec4 iR;
attribute vec4 iS;
${ic}
vec3 loP;
vec3 loN;
void loStrand() {
  float v = min(position.x, 1.0), tip = step(1.0005, position.x), ang = position.y, hs = position.z;
  vec4 S = loState(iR.z, iR.w, step(0.5, iS.w));
  float s = S.x, g = S.y, bd = S.z, dr = S.w;
  float nk = iS.x, nb = iS.y, r0 = iR.x;
  float len = length(iB - iA);
  float sag = iR.y * (1.0 + 0.9 * s);
  vec3 lean = loLean(mix(iA, iB, 0.5), len) * (1.0 - 0.6 * dr);
  float span = hs < 0.5 ? nk - g : 1.0 - nk - g;
  float u = hs < 0.5 ? v * span : 1.0 - v * span;
  float du = 0.004;
  vec3 drop = vec3(0.0, -1.0, 0.0) * dr * len * 0.16 * v * v;
  vec3 c = loCen(u, iA, iB, sag, lean) + drop;
  float u2 = hs < 0.5 ? (v + du) * span : 1.0 - (v + du) * span;
  vec3 c2 = loCen(u2, iA, iB, sag, lean) + vec3(0.0, -1.0, 0.0) * dr * len * 0.16 * (v + du) * (v + du);
  vec3 T = normalize(c2 - c + vec3(1e-6, 0.0, 0.0));
  float nkW = 0.07 + 0.2 * (1.0 - s);
  float r = r0 * (1.0 - 0.88 * s * exp(-(((u - nk) / nkW) * ((u - nk) / nkW))));
  float slide = 0.05 * s + iS.z * 0.13;
  float bw = ((max(0.0, cos(6.2832 * nb * (u - slide)))) * (max(0.0, cos(6.2832 * nb * (u - slide)))) * (max(0.0, cos(6.2832 * nb * (u - slide))))) * smoothstep(0.0, 0.1, u) * smoothstep(0.0, 0.1, 1.0 - u);
  r *= (1.0 - 0.6 * bd) + 2.0 * bd * bw;
  float sl = len * u, sr = len * (1.0 - u);
  r += r0 * 1.1 * (exp(-((sl / (r0 * 5.0)) * (sl / (r0 * 5.0)))) + exp(-((sr / (r0 * 5.0)) * (sr / (r0 * 5.0)))));
  float e = len * span * (1.0 - v);
  r += r0 * (0.2 + 1.5 * dr) * step(0.001, g) * exp(-((e / (r0 * 3.5)) * (e / (r0 * 3.5))));
  r = max(r, 0.6 * loPx(c));
  if (tip > 0.5) {
    r = 0.0;
    c += T * r0 * (0.6 + 1.6 * dr) * step(0.001, g) + T * 0.6 * loPx(c) * (1.0 - step(0.001, g));
  }
  vec3 ref = abs(T.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 N1 = normalize(cross(T, ref));
  vec3 N2 = cross(T, N1);
  vec3 rad = cos(ang) * N1 + sin(ang) * N2;
  loP = c + rad * r;
  loN = tip > 0.5 ? T : rad;
}
`,od=`
attribute vec3 iA1;
attribute vec3 iB1;
attribute vec3 iA2;
attribute vec3 iB2;
attribute vec4 iW;
${ic}
varying vec3 vWeb;
varying float vTear;
vec3 loP;
vec3 loN;
vec3 loWebAt(float u, float v, vec4 S) {
  float len = 0.5 * (length(iB1 - iA1) + length(iB2 - iA2));
  vec3 lean = loLean(0.25 * (iA1 + iB1 + iA2 + iB2), len);
  float sag = iW.x * (1.0 + 0.9 * S.x);
  vec3 c1 = loCen(u, iA1, iB1, sag, lean), c2 = loCen(u, iA2, iB2, sag, lean);
  return mix(c1, c2, v) + vec3(0.0, -iW.y * (1.0 + S.x) * 4.0 * v * (1.0 - v) * (0.4 + 4.0 * u * (1.0 - u)), 0.0);
}
void loWeb() {
  vec4 S = loState(iW.z, iW.w, 0.0);
  float u = position.x, v = position.y;
  vec3 p = loWebAt(u, v, S);
  vec3 pu = loWebAt(u + 0.01, v, S), pv = loWebAt(u, v + 0.01, S);
  loP = p;
  loN = normalize(cross(pu - p, pv - p));
  vWeb = vec3(u, v, position.z);
  vTear = 0.12 + 0.55 * S.x + 1.2 * S.w + 0.9 * step(0.001, S.y);
}
`,ad=`
varying vec3 vWeb;
varying float vTear;
float loH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float loN2(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(loH(i), loH(i + vec2(1.0, 0.0)), f.x), mix(loH(i + vec2(0.0, 1.0)), loH(i + vec2(1.0, 1.0)), f.x), f.y);
}
`;function sd(t,e){const n=[],o=[];for(let s=0;s<2;s++){const r=n.length/3;for(let c=0;c<=t;c++)for(let l=0;l<e;l++)n.push(c/t,l/e*Math.PI*2,s);const i=n.length/3;n.push(1.01,0,s);for(let c=0;c<t;c++)for(let l=0;l<e;l++){const d=r+c*e+l,u=r+c*e+(l+1)%e,p=d+e,f=u+e;o.push(d,u,p,u,f,p)}for(let c=0;c<e;c++){const l=r+t*e+c,d=r+t*e+(c+1)%e;o.push(l,d,i)}}const a=new P0;return a.setAttribute("position",new ct(n,3)),a.setIndex(o),a}function rd(t,e){const n=[],o=[];for(let s=0;s<=t;s++)for(let r=0;r<=e;r++)n.push(s/t,r/e,0);for(let s=0;s<t;s++)for(let r=0;r<e;r++){const i=s*(e+1)+r,c=i+e+1;o.push(i,c,i+1,i+1,c,c+1)}const a=new P0;return a.setAttribute("position",new ct(n,3)),a.setIndex(o),a}function oi(t,e,n,o,a,s){const r=t.onBeforeCompile;return t.onBeforeCompile=(i,c)=>{r.call(t,i,c),Object.assign(i.uniforms,e,{uLoPxH:Qa}),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${n}`).replace("#include <beginnormal_vertex>",`${o}
vec3 objectNormal = loN;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = loP;"),s&&(i.fragmentShader=s(i.fragmentShader))},t.customProgramCacheKey=()=>a,t}function id(t){const e=t.q==="low",n={uT:{value:0},uK:{value:0},uPO:{value:new _},uPD:{value:new _(0,0,-1)},uLean:{value:1}},o=new pt,a=sd(e?28:64,e?6:10),s=t.strands.length,r=new Float32Array(s*3),i=new Float32Array(s*3),c=new Float32Array(s*4),l=new Float32Array(s*4),d=(x,g)=>{r.set([g.a.x,g.a.y,g.a.z],x*3),i.set([g.b.x,g.b.y,g.b.z],x*3),c.set([g.r,g.sag??g.a.distanceTo(g.b)*.12,g.ph??0,g.rate??1],x*4),l.set([g.nk??.5,g.beads??6,g.seed??0,g.still?1:0],x*4)};t.strands.forEach((x,g)=>d(g,x));const u={iA:new xn(r,3),iB:new xn(i,3),iR:new xn(c,4),iS:new xn(l,4)};for(const[x,g]of Object.entries(u))g.setUsage(ki),a.setAttribute(x,g);a.instanceCount=s;const p=oi(jo({env:t.env??5}),n,nd,"loStrand();","ss-liveoil-strand"),f=new Ke(a,p);f.frustumCulled=!1,o.add(f);let v=null;if(t.webs.length){const x=rd(e?18:40,e?8:18),g=t.webs.length,w=new Float32Array(g*3),y=new Float32Array(g*3),S=new Float32Array(g*3),R=new Float32Array(g*3),k=new Float32Array(g*4),L=new Float32Array(g);t.webs.forEach((z,b)=>{w.set(z.a1.toArray(),b*3),y.set(z.b1.toArray(),b*3),S.set(z.a2.toArray(),b*3),R.set(z.b2.toArray(),b*3),k.set([z.sag??.2,z.sagW??.15,z.ph??0,z.rate??1],b*4),L[b]=z.seed??b*7.3}),x.setAttribute("iA1",new xn(w,3)),x.setAttribute("iB1",new xn(y,3)),x.setAttribute("iA2",new xn(S,3)),x.setAttribute("iB2",new xn(R,3)),x.setAttribute("iW",new xn(k,4)),x.setAttribute("iSeed",new xn(L,1)),x.instanceCount=g;const C=jo({env:(t.env??5)*1.6});C.side=uo,oi(C,n,`${od}
attribute float iSeed;
varying float vSeed;`,`loWeb();
vSeed = iSeed;`,"ss-liveoil-web",z=>z.replace("#include <common>",`#include <common>
${ad}
varying float vSeed;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{
  vec2 q = vWeb.xy * vec2(7.0, 3.2) + vec2(vSeed, vSeed * 1.7);
  float nz = loN2(q) * 0.65 + loN2(q * 2.3 + 4.1) * 0.35;
  float edge = min(vWeb.y, 1.0 - vWeb.y) * 2.0;
  float hold = smoothstep(0.0, 0.16, edge);
  if (nz * (0.55 + 0.6 * edge) < vTear * 0.62 && hold > 0.5) discard;
  if (vTear > 1.25 && edge > 0.05) discard;
}`)),v=new Ke(x,C),v.frustumCulled=!1,o.add(v)}function h(x,g,w,y=1){n.uT.value=x,n.uK.value=g,n.uPO.value.copy(w.origin),n.uPD.value.copy(w.direction),n.uLean.value=y}function m(x,g){d(x,g)}function M(){for(const x of Object.values(u))x.needsUpdate=!0}return{group:o,strands:f,webs:v,uniforms:n,update:h,moveStrand:m,commit:M,material:p}}function cd(t){const e=[],n=t>2?28:14;e.push(new bt(0,-.05)),e.push(new bt(1.18,-.02));for(let a=0;a<=n;a++){const s=a/n*Math.PI/2;e.push(new bt(Math.cos(s)*1,.12+Math.sin(s)*.85))}const o=new Pi(e.map(a=>new bt(Math.max(a.x,.001),a.y)),t>2?72:22);return o.computeVertexNormals(),o}const Vt=(t=0,e=0,n=0)=>new _(t,e,n),Io=Fe.findIndex(t=>t.id==="4"),ld=[[0,1],[.9,1],[2.4,1],[3.3,.6],[3.9,1]];function ud(){const t={uGlow:{value:0}},e=new Pn({color:328708,side:uo,vertexColors:!0});return e.onBeforeCompile=n=>{n.uniforms.uGlow=t.uGlow,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGlow;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + uGlow;`)},{m:e,u:t}}function ai(t,e,n){const o=[],a=[];t.forEach((r,i)=>{const c=t[Math.min(t.length-1,i+1)].clone().sub(t[Math.max(0,i-1)]).normalize(),l=c.cross(n).normalize(),d=e*.5*(i===0||i===t.length-1?.35:1);o.push(r.x+l.x*d,r.y+l.y*d,r.z+l.z*d,r.x-l.x*d,r.y-l.y*d,r.z-l.z*d),i&&a.push(2*i-2,2*i-1,2*i,2*i-1,2*i+1,2*i)});const s=new Ln;return s.setAttribute("position",new ct(o,3)),s.setIndex(a),s}const si=(t,e,n)=>{const o=xt((n-t)/(e-t));return o*o*(3-2*o)},zo=t=>[],cc=typeof location<"u"?new URLSearchParams(location.search):null,lc=cc?.get("form4d")==="1",Ta=cc?.get("form4")==="1"||lc;function dd(t){const{kit:e}=t,n=e.q,o=n==="low",a=new pt,s=new pt,r=new pt;a.add(s),s.add(r),r.position.copy(Jc),r.rotation.y=Math.atan2(-Rr.z,Rr.x);const i=tt(404),c=Ta?new ya({color:8026746,roughness:.5,metalness:0}):null;if(Ta){const Me=Fe[Io],Ze=(Re,it,nt)=>(r.updateMatrixWorld(),Vt(Re,it,nt).applyMatrix4(r.matrixWorld).toArray());Me.light.haze=0,Me.light.red.power=0,Me.light.blade.from=Ze(-6,10,9),Me.light.blade.to=Ze(0,0,0),Me.light.blade.angle=.6,Me.light.blade.pen=0,Me.light.blade.power=15,Me.sharp=[.02,50]}const l=(Me,Ze)=>{const Re=new Ke(Me,c??cn({tier:n,...Ze}));return Re.castShadow=!o,Re.receiveShadow=!o,Re},d={value:new rn(0,1,0,0)},u={value:new rn(0,1,0,0)},p={value:new rn(0,1,0,0)},f=Vt(),v=Vt(...Fe[Io].light.blade.from).sub(Vt(...Fe[Io].light.blade.to)).normalize(),h=J1(n),m={finish:"turned",seed:41,age:0,wear:.08,tone:.8,direct:.3,objScale:2,envMap:.07,turn:[2.2,.005,.25],line:[0,0],lineU:{value:new bt(1.6,go+.25)},rim:d},M=l(h.geo,m),x=l(h.piece,{...m,turn:[2.2,.005,.06],seed:zo()[8]??45,wear:0,direct:zo()[6]??.55,tone:zo()[7]??.9}),g=new pt;g.position.set(-$o,0,0),g.add(M,x),r.add(g);const w=new pt;g.add(w);const y=(Me,Ze,Re)=>{const it=go+Ze,nt=Ao+Me/$o;return Vt(Math.cos(nt)*it,Re,Math.sin(nt)*it)},S=(Me,Ze,Re,it=0)=>{const nt=go+Ze,We=Ao+it*Ga+Me/$o,Tt=Vt(Math.cos(We)*nt,Re,Math.sin(We)*nt);return it===0?vr(Tt):Tt},R=ed(n),k=td(h.O,R.pts),L=.12,C=l(R.geo,{finish:"turned",seed:42,age:0,wear:0,bump:zo()[0]??.15,tone:.6,direct:.4,envMap:1.8,rim:u,objScale:2,turn:[2.2,.005,.25],line:[.8,0]}),z=l(R.arb,{finish:"polished",seed:43,age:.2,wear:.3,tone:.3,direct:.3,envMap:.6}),b=new pt;b.position.set(k.cx,da/2+.02-Qs/2-L,k.cz),b.add(C,z),r.add(b),k.contact.clone().add(Vt($o,0,0));const P=zo(),I=new Map;ws(()=>{const Me=[...I],Ze=new Map;I.clear();for(const[Re,it]of Me)Ze.set(Re,F(it.list)),it.rt.dispose();i1(t.scene,Ze)});const F=Me=>{const Ze=new ja;Ze.background=new Gt(0);const Re=Vt(...Fe[Io].pose.pos).sub(Vt(...Fe[Io].pose.look));Re.y=0,Re.normalize();for(const[We,Tt,jt,en,Nt]of Me){const Kt=m0.degToRad(We),Un=Vt(Re.x*Math.cos(Kt)-Re.z*Math.sin(Kt),0,Re.x*Math.sin(Kt)+Re.z*Math.cos(Kt)),Tn=new Ke(new oo(Tt,jt),new Pn({color:new Gt(.62,.62,.6).multiplyScalar(Nt),side:uo}));Tn.position.copy(Un).multiplyScalar(6).setY(en),Tn.lookAt(0,0,0),Ze.add(Tn)}const it=new Si(t.renderer),nt=it.fromScene(Ze,.01);return it.dispose(),I.set(nt.texture,{list:Me,rt:nt}),nt.texture},D=zo(),J=F([[P[0]??-35,P[1]??.6,P[7]??7,P[6]??-4,P[2]??6],[D[0]??180,D[1]??8,D[2]??.8,D[3]??2.8,D[4]??.03]]),Y=zo(),oe=F([[Y[0]??-15,Y[1]??24,Y[2]??8,Y[3]??-3.5,Y[4]??1]]),ae=(Me,Ze,Re)=>{const it=Me.onBeforeCompile,nt=Me.customProgramCacheKey.bind(Me);Me.onBeforeCompile=(We,Tt)=>{it.call(Me,We,Tt),We.fragmentShader=We.fragmentShader.replace("roughnessFactor = clamp(ssRough, 0.04, 1.0);",`roughnessFactor = clamp(ssRough * ${Ze.toFixed(3)}, 0.02, 1.0);`)},Me.customProgramCacheKey=()=>nt()+Re};if(!Ta){const Me=C.material;ae(Me,P[5]??.4,"-b4"),Me.envMap=J,Me.envMapIntensity=P[3]??5;const Ze=z.material;Ze.envMap=J,Ze.envMapIntensity=P[4]??.25;const Re=x.material;Re.envMap=oe,Re.envMapIntensity=Y[5]??.6}const G=da/2,te=Vt(0,1,0),V=ao/2,B=Me=>{let Ze=lo-.015,Re=lo+.2;for(let it=0;it<30;it++){const nt=(Ze+Re)/2;S(Me,nt,G).y<G?Ze=nt:Re=nt}return Re},U=B(0),H=Array.from({length:22},(Me,Ze)=>{const Re=-V+.004+(ao-.008)*Ze/21;return S(Re,B(Re)+.002,G+8e-4)}),pe=new Ke(ai(H,.0022,te),new Pn({color:new Gt(1.6,1.57,1.5),side:uo}));w.add(pe);const he=ud(),ge=[];for(let Me=0;Me<5;Me++){const Ze=[.04,-.01,.015,-.05,-.075][Me],Re=[.04,.03,.046,.026,.034][Me],it=[.008,-.01,.004,-.006,.01][Me],nt=[],We=[];for(let en=0;en<14;en++){const Nt=en/13,Kt=Ze+it*Nt+Math.sin(Nt*7+Me*2)*.0015+(i()-.5)*8e-4,Un=S(Kt,B(Kt),G),Tn=Math.hypot(Un.x,Un.z)-go;nt.push(y(Kt,Tn-.0015-Re*Nt,G+9e-4)),We.push(1-Nt*.85)}const Tt=ai(nt,.0016,te);Tt.setAttribute("color",new ct(We.flatMap(en=>[en,en,en,en,en,en]),3));const jt=new Ke(Tt,he.m);jt.visible=!1,jt.renderOrder=2,w.add(jt),ge.push(jt)}const W=o?4:6,ie=(()=>{const Me=tt(9),Ze=[];for(let Re=0;Re<7;Re++){const it=Re/7*Math.PI*2,nt=.55+Me()*.6;Ze.push([Math.cos(it)*.018*nt,Math.sin(it)*.011*nt])}return bn({pts:Ze},[],{t:.0016,bevel:5e-4,segs:1})})(),ye=new yn(ie,cn({tier:n,finish:"polished",seed:47,tone:.1,age:0,direct:.6,wear:0,envMap:.25,rim:p}),W),Ae=[];{S(V+.01,lo+.08,0).sub(S(V,lo+.08,0)).normalize();for(let Me=0;Me<W;Me++){const Ze=Me===W-1,Re=U+.008+Me/W*.1+i()*.008,it=.006+i()*.03,nt=S(V-it,Re,G+.0012).add(Vt(0,Ze?.03:i()*.003,0)),We=S(V-it,Re,G+.01).sub(S(V-it,Re,G)).normalize(),Tt=new Wt().setFromUnitVectors(Vt(0,1,0),We).multiply(new Wt().setFromEuler(new Bn(.3+i()*.5+(Ze?.9:0),i()*6.3,(i()-.5)*.3,"YXZ")));Ae.push({p:nt,r:Tt,s:.9+i()*.6,loose:Ze})}}w.add(ye);const be=new Ke(cd(o?2:3),jo({env:1.4})),Se=zo(),Be=Se[0]??.3,Le=G-L+(Se[2]??.01);be.position.copy(S(V+(Se[1]??.01),Be,Le));const Ve=S(V,Be+.05,Le).sub(S(V,Be-.05,Le)).normalize();be.scale.set(Se[3]??.04,Se[4]??.026,Se[5]??.028),be.rotation.set(0,-Math.atan2(Ve.z,Ve.x)+(Se[6]??Math.PI/2),Math.PI/2);const Ye=be.scale.clone(),Pe=new Ke(new zi(new z0(Array.from({length:9},(Me,Ze)=>{const Re=-.72+1.44*Ze/8,it=zo()[0]??-.4;return Vt(Re,Math.sqrt(Math.max(0,1-Re*Re-it*it))*1.02,it)})),16,zo()[1]??.06,4),new Pn({color:new Gt(.62,.61,.58)}));be.add(Pe),w.add(be);const Ue=[{a:S(V+.02,Be-.03,Le+.012),b:S(V+.1,Be-.13,G-L+.001),r:.0032,sag:.02,ph:.15,rate:1,nk:.5,beads:3,seed:1},{a:S(V+.012,Be+.03,Le+.014),b:S(V+.001,Be+.13,G-.03),r:.0022,sag:.015,ph:.3,rate:1,nk:.5,beads:4,seed:2}],et=id({strands:Ue,webs:[],q:n,env:1.2});w.add(et.group),Ta&&!lc&&(w.visible=!1);const Ie=o?30:70,ke=new yn(new rs(.004,0),cn({tier:n,finish:"blackened",seed:48,tone:.3,age:.5,direct:.6}),Ie);ke.frustumCulled=!1,s.add(ke);const ee=Array.from({length:Ie},()=>[(i()-.5)*.5,.25+i()*.5,(i()-.5)*.5,.5+i()]),j=o?14:30,X=new yn(new rs(1,1),cn({tier:n,finish:"blackened",seed:49,tone:.6,age:.4,direct:1}),j);X.frustumCulled=!1,a.add(X);const le=Array.from({length:j},()=>[(i()-.5)*2.2,i()*1.2,1+i()*2.5,.0015+i()*i()*.006,.6+i()*.8]),xe={uGain:{value:.2},uAng:{value:-.75}},Ce=new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:xe,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uAng; varying vec2 vUv;
float h1(float x) { return fract(sin(x * 91.7) * 43758.5); }
float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main() {
  vec2 d = vec2(cos(uAng), sin(uAng)), n = vec2(-d.y, d.x);
  float a = dot(vUv, d), c = dot(vUv, n);
  float w = 0.32 + 0.12 * a;
  float core = 1.0 - smoothstep(w * 0.35, w, abs(c + 0.08 * a));
  float streak = 0.55 + 0.45 * vn(c * 23.0 + 3.0) * vn(c * 61.0 + 9.0) + 0.25 * vn(c * 7.0);
  float along = smoothstep(-1.0, -0.2, a) * (1.0 - smoothstep(0.35, 1.0, a));
  float e = core * streak * along * (1.0 - smoothstep(0.75, 1.0, length(vUv * vec2(0.8, 1.0))));
  gl_FragColor = vec4(vec3(0.6, 0.59, 0.58) * e * uGain, 0.0);
}`}),Ee=new Ke(new oo(5.5,3.6),Ce);Ee.position.set(.2,.1,-5),Ee.renderOrder=4,Ee.frustumCulled=!1,r.add(Ee);const Je={uGain:{value:0},uT:{value:0}},A=new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:Je,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv * vec2(1.6, 1.0) + vec2(uT * 0.05, 0.0);
  float n = 0.5 * vn(q * 2.1) + 0.3 * vn(q * 4.7 + 3.1) + 0.2 * vn(q * 9.3 + 7.7);
  vec2 bq = (vUv - vec2(0.15, 0.35)) * vec2(1.0, 1.5); float body = exp(-dot(bq, bq));
  float e = body * smoothstep(0.32, 0.8, n);
  gl_FragColor = vec4(vec3(0.62, 0.035, 0.02) * e * uGain, 0.0);
}`}),E=new Ke(new oo(1,1),A);E.renderOrder=4,E.frustumCulled=!1,E.visible=!1,a.add(E);const Z={uGain:{value:0},uC:{value:new bt(.18,-.12)}},se=new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:Z,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform vec2 uC; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv;
  float n = 0.55 * vn(q * vec2(2.2, 1.3) + 11.0) + 0.3 * vn(q * vec2(5.5, 2.0) + 9.0) + 0.15 * vn(q * vec2(13.0, 3.0) + 2.0);
  float gaps = 0.08 + 0.92 * smoothstep(0.32, 0.68, vn(vec2(q.x * 7.0 + 1.3, q.y * 0.7)));
  float streak = 0.78 + 0.22 * vn(vec2(q.x * 17.0 + 5.0, q.y * 2.5 + q.x * 3.0)) * vn(vec2(q.x * 41.0 + 2.0, q.y * 1.6)) + 0.08 * vn(vec2(q.x * 90.0, q.y * 4.0));
  vec2 bq = (q - uC + 0.35 * vec2(n - 0.5, vn(q * 1.7 + 4.0) - 0.5)) * vec2(1.4, 1.75); float body = exp(-dot(bq, bq) * 2.2);
  float edge = smoothstep(-0.5, -0.12, q.x - 0.7 * max(q.y, 0.0)) * (1.0 - smoothstep(0.7, 1.0, q.x)) * (1.0 - smoothstep(0.65, 1.0, abs(q.y)));
  float e = body * edge * gaps * streak * mix(0.12, 1.0, smoothstep(0.3, 0.75, n));
  gl_FragColor = vec4(vec3(0.5, 0.012, 0.008) * e * uGain, 0.0);
}`}),ue=new Ke(new oo(1,1),se);ue.renderOrder=4,ue.frustumCulled=!1,ue.visible=!1,a.add(ue);const T=zo(),q=new Wt,$=Vt(),de=Vt(),re=[];for(let Me=-6;Me<=6;Me++){re.push({w:0,p:Vt(Math.cos(Ao+Me*Ga)*(go+Ma-.05),G,Math.sin(Ao+Me*Ga)*(go+Ma-.05))});const Ze=Math.PI+Me*Math.PI*2/Zs;re.push({w:1,p:Vt(Math.cos(Ze)*(Za+S0),0,Math.sin(Ze)*(Za+S0))})}Ta&&(Ee.visible=!1,ke.visible=!1);const ne=new fe,K=new Wt,ze=new Wt,Ne=new Bn,Te=Vt(),at=new ar,qe=Vt(),rt=Vt(),St=Vt(),vn=Vt(),Jt=Vt(),Zt=g.rotation.y,ln=b.rotation.y;return{group:a,update(Me){if(a.visible=Me.i>=Io-1&&Me.i<=Io+1,!a.visible)return;const Ze=Me.trick("4"),Re=Ze.k;Me.camera.getWorldPosition(Te),qe.set(Me.state.pointer.x*2-1,1-Me.state.pointer.y*2,.5).unproject(Me.camera),at.origin.copy(Te),at.direction.copy(qe).sub(Te).normalize();const it=Ze.phase*8;let nt=0,We=0,Tt=9;if(Re>0)for(const[lt,N]of ld)it>=lt&&(nt++,Tt=it-lt,We=N*Math.exp(-Tt*7));const jt=Ze.rare,en=jt>=0&&jt<.55,Nt=jt>=.55?Math.exp(-(jt-.55)*4*9):0,Kt=jt>=.55?(jt-.55)*4:9;en&&(We=0);const Un=Re>0?Math.min(5,nt+(jt>=.55?1:0)):0;ge.forEach((lt,N)=>lt.visible=N<Un),pe.visible=Un===0,he.u.uGlow.value=Re*(.55+.45*We),he.m.color.setRGB(.02+.98*Re*(.7+.3*We),.02*(1-Re)+.012*Re,.02*(1-Re)+.01*Re);let Tn=re[0],Xo=1e9;for(const lt of re){rt.copy(lt.p).applyMatrix4((lt.w?C:M).matrixWorld);const N=at.distanceSqToPoint(rt);N<Xo&&(Xo=N,Tn=lt)}const fa=We*Re*(Tn.w===0?1:.5)*.0022,fo=We*Re*(Tn.w===1?1:.5)*.0022;g.rotation.y=Zt+fa*Math.sin(Tt*70),b.rotation.y=ln-fo*1.27*Math.sin(Tt*70+.6),rt.copy(Tn.p).applyMatrix4((Tn.w?C:M).matrixWorld);for(let lt=0;lt<Ie;lt++){const N=Re>0&&Tt<1.4&&!en,ce=Tt*ee[lt][3];if(!N){ne.makeScale(0,0,0),ke.setMatrixAt(lt,ne);continue}const we=rt.clone().add(Vt(ee[lt][0]*ce,ee[lt][1]*ce-1.6*ce*ce,ee[lt][2]*ce)).sub(s.position);ne.compose(we,K.setFromEuler(Ne.set(lt,lt*2,ce*9)),Vt(1,1,1).multiplyScalar(.6+.8*(lt*7%5)/5)),ke.setMatrixAt(lt,ne)}ke.instanceMatrix.needsUpdate=!0,Ae.forEach((lt,N)=>{const ce=lt.loose?We*Re*.03:We*Re*.004;ne.compose(lt.p.clone().add(Vt(0,ce,0)),K.copy(lt.r).multiply(ze.setFromAxisAngle(Vt(1,0,0),ce*20)),Vt(lt.s,lt.s,lt.s)),ye.setMatrixAt(N,ne)}),ye.instanceMatrix.needsUpdate=!0,be.scale.set(Ye.x*(1+We*Re*.2),Ye.y*(1-We*Re*.12),Ye.z*(1+We*Re*.06)),et.update(Ze.phase,Re*.6,at,.5),f.copy(v).transformDirection(Me.camera.matrixWorldInverse),d.value.set(f.x,f.y,f.z,.5),u.value.set(f.x,f.y,f.z,0),p.value.set(f.x,f.y,f.z,2.5);{const lt=Me.i===Io&&!Me.inHold,N=lt?Math.sin(Math.PI*xt(Me.u/.9)):0;if(E.visible=N>.01,E.visible){Me.camera.getWorldQuaternion(q),$.set(0,0,-1).applyQuaternion(q);const ce=22,we=2*ce*Math.tan(m0.degToRad(Me.camera.fov)/2)*1.15;E.position.copy(Te).addScaledVector($,ce),E.quaternion.copy(q),E.scale.set(we*Me.camera.aspect,we,1),Je.uGain.value=.55*N/Math.sqrt(_i(Me.i,Me.u,Me.inHold))}}{const lt=Me.i===Io?Me.inHold?1:si(.55,1,Me.u):Me.i===Io+1&&!Me.inHold?1-si(0,.35,Me.u):0;if(ue.visible=lt>.01&&!Ta,ue.visible){Me.camera.getWorldQuaternion(q),$.set(0,0,-1).applyQuaternion(q),b.getWorldPosition(de);const N=Te.distanceTo(de)+(T[0]??3),ce=2*N*Math.tan(m0.degToRad(Me.camera.fov)/2)*1.1;ue.position.copy(Te).addScaledVector($,N),ue.quaternion.copy(q),ue.scale.set(ce*Me.camera.aspect,ce,1),Z.uGain.value=(T[1]??.72)*lt*(1+.25*Re);const we=Me.camera.aspect<1;Z.uC.value.set(T[2]??(we?.5:.15),T[3]??(we?-.25:-.05))}}if(Ee.lookAt(Te),xe.uGain.value=(Me.camera.aspect<1?T[4]??.33:.58)*(1+.1*Re),s.position.set(0,0,0),Nt>.001){const lt=Nt*.025;s.position.set(Math.sin(Kt*61)*lt,Math.sin(Kt*47+1)*lt*.7,Math.sin(Kt*53+2)*lt*.5)}if(X.visible=jt>=.55,X.visible){St.set(0,0,-1).transformDirection(Me.camera.matrixWorld),vn.set(1,0,0).transformDirection(Me.camera.matrixWorld),Jt.set(0,1,0).transformDirection(Me.camera.matrixWorld);for(let lt=0;lt<j;lt++){const[N,ce,we,He,De]=le[lt],ht=1.2+ce*.5-Kt*De*1.8,je=Te.clone().addScaledVector(St,we).addScaledVector(vn,N*we*.18).addScaledVector(Jt,ht*we*.102);ne.compose(je,K.setFromEuler(Ne.set(lt,Kt*3,lt*3)),Vt(He,He*.6,He)),X.setMatrixAt(lt,ne)}X.instanceMatrix.needsUpdate=!0}}}}const uc=16,fd=`uniform float uFill;
uniform float uGain;
uniform vec3 uBevC;
uniform vec2 uCrW;
uniform vec3 uCamO;
uniform vec3 uHalf;
uniform vec3 uCtr;
uniform vec3 uCrackP;
uniform vec3 uCrackN;
uniform vec3 uE1;
uniform vec3 uE2;
uniform vec4 uSeg[16];
uniform int uSegN;
uniform vec3 uNode;
uniform float uPx;
uniform float uGlow;
uniform float uLit;
uniform float uNodeK;
uniform float uHeat;
uniform vec3 uChipN;
uniform float uBody;
uniform vec3 uKey;
uniform float uSheen;
uniform float uBev;
uniform vec3 uBl;
uniform float uSheet;
uniform float uSheetW;
varying vec3 vOP;
varying vec3 vON;`,pd=`
vec3 rd = normalize(vOP - uCamO);
vec3 inv = 1.0 / (rd + vec3(1e-6));
vec3 tA = (uCtr - uHalf - vOP) * inv;
vec3 tB = (uCtr + uHalf - vOP) * inv;
vec3 tMax = max(tA, tB);
float tExit = max(min(min(tMax.x, tMax.y), tMax.z), 0.0);
float body = 1.0 - exp(-tExit * 5.0);
float dn = dot(rd, uCrackN);
float tc = abs(dn) > 1e-4 ? dot(uCrackP - vOP, uCrackN) / dn : -1.0;
float lines = 0.0;
float fill = 0.0;
float wide = 0.0;
float sheet = 0.0;
if (tc > 0.0 && tc < tExit) {
  vec3 hp = vOP + rd * tc;
  vec2 q = vec2(dot(hp - uCrackP, uE1), dot(hp - uCrackP, uE2));
  float fq = uCrW.y;
  vec2 qw = q + uCrW.x * vec2(sin(q.y * fq + 1.7) + 0.5 * sin(q.y * fq * 2.3 + 0.2), sin(q.x * fq * 1.3 + 0.4) + 0.5 * sin(q.x * fq * 2.9 + 2.1) + 0.25 * sin(q.x * fq * 6.1));
  float wv = 0.55 + 0.45 * sin(q.x * fq * 0.7 + q.y * fq * 1.1) * sin(q.x * fq * 0.31 + 0.6);
  float dm = 1e3;
  for (int i = 0; i < 16; i++) {
    if (i >= uSegN) break;
    vec4 s = uSeg[i];
    vec2 ab = s.zw - s.xy;
    float h = clamp(dot(qw - s.xy, ab) / max(dot(ab, ab), 1e-10), 0.0, 1.0);
    dm = min(dm, length(qw - s.xy - ab * h));
  }
  float deep = exp(-tc * 7.0);
  float near = exp(-length(hp - uNode) * 4.0);
  lines = exp(-dm / (uPx * (0.45 + 0.9 * wv))) * deep * (0.25 + 0.55 * near) * (0.6 + 0.4 * wv);
  fill = exp(-dm / (uPx * 9.0)) * deep * near;
  wide = exp(-dm / (uPx * 26.0)) * deep;
  sheet = exp(-dm / uSheetW) * exp(-tc * 3.0) * (0.3 + 0.7 * exp(-length(hp - uNode) * 2.5));
  vec2 qn = q * fq / 34.0;
  float fth = 0.5 + 0.5 * sin(q.x * fq * 9.0 + 3.0 * sin(q.y * fq * 2.1)) * sin(q.y * fq * 14.0 + q.x * fq * 1.9);
  sheet *= 0.4 + 0.95 * fth * fth;
  fill *= 0.7 + 0.45 * fth;
  vec2 qa = vec2(abs(qn.x), qn.y);
  float inc = max(max(smoothstep(0.03, 0.012, length(qa - vec2(0.16, 0.05))), smoothstep(0.022, 0.008, length(qa - vec2(0.37, -0.07)))),
                  max(smoothstep(0.035, 0.014, length(qa - vec2(0.58, 0.09))), smoothstep(0.018, 0.006, length(qa - vec2(0.74, -0.02)))));
  float keep = 1.0 - 0.9 * inc;
  lines *= keep; fill *= keep; wide *= keep; sheet *= keep;
}
float tn = clamp(dot(uNode - vOP, rd), 0.0, tExit);
float dq = length(vOP + rd * tn - uNode);
float core = exp(-dq * dq / (uPx * uPx * 2.2));
float halo = exp(-dq / (uPx * 5.0));
float chipF = smoothstep(0.985, 0.998, dot(normalize(vON), uChipN));
vec3 redC = vec3(1.0, 0.0, 0.012);
vec3 glowC = redC * (uGlow * (body * uBody + fill * 0.22 + wide * uFill + sheet * uSheet + lines * uLit) + uNodeK * (halo * 0.35 + core * 1.6));
glowC += vec3(1.0, 0.8, 0.72) * core * core * uHeat * uNodeK * 9.0;
vec3 rfl = reflect(rd, normalize(vON));
float bx = (vOP.x - uCtr.x) / uHalf.x + 0.3;
glowC += vec3(0.86, 0.88, 0.92) * pow(max(dot(rfl, uKey), 0.0), 24.0) * exp(-bx * bx * 30.0) * uSheen * (1.0 - chipF);
vec3 an = abs(normalize(vON));
float bev = (1.0 - step(0.93, max(an.x, max(an.y, an.z)))) * step(an.x, 0.35) * (1.0 - chipF);
glowC += uBevC * bev * (0.3 + 0.7 * max(dot(normalize(vON), uBl), 0.0)) * uBev;
totalEmissiveRadiance += glowC * uGain;`;function hd(t,e,n,o,a=61){const s=n.clone().normalize(),r=e.clone().addScaledVector(s,-e.dot(s)).normalize(),i=new _().crossVectors(s,r).normalize(),c=tt(a),l=[],d=[new bt(0,0)],u=7;for(let f=1;f<=u;f++)d.push(new bt(o*f/u,(c()-.5)*o*.09+(f>2?-o*.025*(f-2):0)));for(let f=0;f<u;f++)l.push({a:d[f],b:d[f+1],t0:f/u*.92,t1:(f+1)/u*.92});const p=[1,2,3,5];for(const[f,v]of p.entries()){const h=d[v],m=f%2?1:-1,M=m*(.5+c()*.35),x=o*(.08+c()*.1),g=new bt(Math.cos(M),Math.sin(M)),w=h.clone().addScaledVector(g,x),y=M+m*(c()-.3)*.6,S=w.clone().addScaledVector(new bt(Math.cos(y),Math.sin(y)),x*.7),R=v/u*.92+.03,k=R+.12;l.push({a:h,b:w,t0:R,t1:k},{a:w,b:S,t0:k,t1:k+.1})}return{len:o,p:t.clone(),n:s,e1:r,e2:i,segs:l.slice(0,uc)}}function dc(t){const e=Yo(),n=new Gn({color:new Gt().setRGB(6e-4,0,3e-5),metalness:0,roughness:.03,ior:1.76,envMapIntensity:t.env??2.5,specularIntensity:1}),o=Array.from({length:uc},()=>new rn),a={uCamO:{value:new _},uCrW:{value:new bt(t.crack.len*.006,34/t.crack.len)},uFill:{value:t.fill??0},uHalf:{value:t.half.clone()},uCtr:{value:(t.centre??new _).clone()},uCrackP:{value:t.crack.p},uCrackN:{value:t.crack.n},uE1:{value:t.crack.e1},uE2:{value:t.crack.e2},uSeg:{value:o},uSegN:{value:0},uNode:{value:t.node.clone()},uPx:{value:.002},uGlow:{value:t.glow??1},uLit:{value:t.lit??1},uNodeK:{value:t.nodeK??1},uHeat:{value:0},uChipN:{value:t.chipN.clone().normalize()},uBody:{value:t.body??.05},uKey:{value:new _(0,1,0)},uSheen:{value:t.sheen??0},uBev:{value:t.bevel??0},uGain:{value:t.gain??1},uBevC:{value:new Gt(.86,.88,.92)},uBl:{value:new _(0,1,0)},uSheet:{value:t.sheet??0},uSheetW:{value:t.crack.len*.05},tNz:{value:e.noise}};n.onBeforeCompile=u=>{Object.assign(u.uniforms,a),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP;
varying vec3 vON;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position;
vON = normal;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
${fd}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.42, smoothstep(0.985, 0.998, dot(normalize(vON), uChipN)));`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${pd}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(core * uNodeK * 1.5 + halo * uNodeK * 0.12 + lines * uLit * uGlow * 0.4, 0.0, 1.0);`),To(u)},n.customProgramCacheKey=()=>"ss-stone";const s=new fe,r=new _,i=new _,c=new _,l=(u,p)=>{u.updateMatrixWorld(),s.copy(u.matrixWorld).invert(),i.setFromMatrixPosition(p.matrixWorld),a.uCamO.value.copy(i).applyMatrix4(s),r.copy(a.uNode.value).applyMatrix4(u.matrixWorld);const f=p,v=r.distanceTo(i);c.setFromMatrixScale(u.matrixWorld);const h=2*v*Math.tan(m0.degToRad((f.fov??30)/2))/Math.max(1,Qa.value);a.uPx.value=h/Math.max(1e-6,Math.abs(c.x)),t.face&&a.uKey.value.copy(a.uCtr.value).sub(a.uCamO.value).normalize().reflect(t.face).add(t.tilt??new _).normalize()},d=u=>{let p=0;for(const f of t.crack.segs){const v=Math.min(1,Math.max(0,(u-f.t0)/(f.t1-f.t0)));if(v<=0)continue;const h=f.a.clone().lerp(f.b,v);o[p++].set(f.a.x,f.a.y,h.x,h.y)}a.uSegN.value=p};return d(0),Object.assign(n,{ss:a,aim:l,crack:d})}const sn={ready:!1,fork:new fe,stone:new fe,stoneWorld:new _,escRot:0,stoneGeo:null,side:-1};function fc(t,e=-1){t.computeBoundingBox();const n=t.boundingBox,o=n.getSize(new _).multiplyScalar(.5),a=n.getCenter(new _),s=o.x*2,r=o.y,i=o.z,c=new _(a.x+s/2-.012,a.y-r*.3,a.z+e*(i-.01)),l=hd(c,new _(-1,-.25,-e*.1),new _(.12,.5,-e*.86),s*.78),d=ur({L:s,w:i,h:r*2,side:e}).chip.n.clone();return{half:o,centre:a,node:c,crack:l,chipN:d}}function md(t,e,n){t.computeBoundingBox();const o=t.boundingBox,a=o.getCenter(new _),s=o.getSize(new _).multiplyScalar(.5),r=i=>new _(a.x+s.x,a.y,a.z+i*s.z).applyMatrix4(e).distanceTo(n);return r(1)<r(-1)?1:-1}const an=La+.02,d0={glow:1,lit:.6,node:4,body:.05,crack:.12},vd=2,gd=.7,xd=.65,wd=.1,yd=.1,bd=.12,Md=.12,Sd=10,zd=6,kd=4,Is=[.865,1.056,1.9],Pd=1.4,Ad=.012,Rd=4.2,ri=[20,10],Ct=(t,e,n)=>new _(t,e,n),Jo=Math.PI*2,ii=12.6,ma=4.8,ci=-38.5,Fa=[{x:-2.7,z:-3.5,r:.9,kind:"pillar"},{x:-2.3,z:-8.6,r:.62,kind:"arbor"},{x:-1.6,z:-13.9,r:.85,kind:"pillar",h:11.4},{x:-.6,z:-19.2,r:.8,kind:"pillar",h:12.2},{x:-.2,z:-24.8,r:.6,kind:"arbor",h:13.4},{x:.7,z:-30.1,r:.78,kind:"pillar"},{x:1.2,z:-35.4,r:.55,kind:"arbor",h:11.8},{x:12.3,z:-1.2,r:.72,kind:"arbor"},{x:12,z:-6.7,r:.95,kind:"pillar"},{x:11.4,z:-12.3,r:.66,kind:"arbor",h:13.6},{x:10.7,z:-17.6,r:.9,kind:"pillar",h:11.2},{x:10,z:-23.3,r:.62,kind:"arbor"},{x:9.2,z:-28.6,r:.8,kind:"pillar",h:5.6,snapped:!0},{x:8.6,z:-33.9,r:.58,kind:"arbor"},{x:1.75,z:-4.6,r:.42,kind:"arbor"},{x:-1.4,z:-7.6,r:.5,kind:"arbor"}],li=[{c:2,y:6.3,r:2.3,n:64,rx:.55,rz:-.3,fold:.9,sheared:3,dx:2.4,dz:.4},{c:3,y:7.3,r:2.6,n:84,rx:.42,rz:.2,dx:1.6},{c:4,y:7.2,r:3.8,n:110,rx:.3,rz:-.12,dx:1.6},{c:5,y:8.4,r:3,n:80,rx:-.36,rz:.18,dx:.6},{c:9,y:7.4,r:3.2,n:96,rx:.38,rz:.16,dx:-2},{c:10,y:8.2,r:2.9,n:72,rx:-.4,rz:-.22,dx:-.6},{c:11,y:8.8,r:3.4,n:90,rx:.34,rz:.1,dx:-.8},{c:12,y:7.8,r:2.6,n:66,rx:.44,rz:.25,dx:-.4},{c:7,y:4.15,r:1.9,n:64,rx:.42,rz:.32,dx:-5.5,dz:-6.8},{c:15,y:3,r:1.6,n:64,rx:.5,rz:-.22},{c:1,y:11.4,r:3,n:88,rx:.3,rz:.16,dx:2.4},{c:9,y:12.2,r:3.3,n:92,rx:-.3,rz:-.18,dx:-2.4}];function Cd(t){const{kit:e}=t,n=e.q,o=za(n),a=new pt,s=tt(55),[r,i,c]=Na,l={value:new rn(0,1,0,0)},d={value:new rn(0,1,0,0)},u=(A,E,Z,se=!0)=>{const ue=cn({tier:n,...E}),T=new Ke(A,ue);return Z&&T.applyMatrix4(Z),T.castShadow=se&&n!=="low",T.receiveShadow=n!=="low",T.castShadow,T},p=(A,E,Z={},se=!1,ue=1)=>{for(const T of A.inst){if(!T.mats.length)continue;const q=cn({finish:T.finish,seed:T.seed,tier:n,...Z}),$=new yn(T.geo,q,T.mats.length);T.mats.forEach((de,re)=>$.setMatrixAt(re,ue===1?de:de.clone().multiply(new fe().makeScale(ue,ue,ue)))),$.instanceMatrix.needsUpdate=!0,$.computeBoundingSphere(),$.castShadow=se&&n!=="low",$.receiveShadow=n!=="low",E.add($)}},f=Yo(),v=new oo(90,90,1,1);v.rotateX(-Math.PI/2);const h=new fn({uniforms:{tDiffuse:{value:null},textureMatrix:{value:new fe},tNz:{value:f.noise},uHas:{value:n==="low"?0:1},uTexel:{value:new bt(1/1024,1/1024)},uNearF:{value:0},uCamP:{value:new _},uGain:{value:2.6},uRuby:{value:new _},uStreak:{value:0},tDepth:{value:null},uPI:{value:new fe},uVW:{value:new fe},uOil:{value:an},uHR:{value:new bt(5,.8)}},vertexShader:`
uniform mat4 textureMatrix;
varying vec4 vUv;
varying vec3 vW;
void main() {
  vUv = textureMatrix * vec4(position, 1.0);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,fragmentShader:`
uniform sampler2D tDiffuse;
uniform sampler2D tNz;
uniform float uHas;
uniform float uGain;
uniform vec2 uTexel;
uniform vec3 uCamP;
uniform vec3 uRuby;
uniform float uStreak;
uniform float uNearF;
uniform sampler2D tDepth;
uniform mat4 uPI;
uniform mat4 uVW;
uniform float uOil;
uniform vec2 uHR;
varying vec4 vUv;
varying vec3 vW;
float hgt(vec2 uv) {
  float d = texture2D(tDepth, uv).r;
  vec4 p = uPI * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  vec3 w = (uVW * vec4(p.xyz / p.w, 1.0)).xyz;
  return d > 0.9999 ? 1e4 : max(w.y - uOil, 0.0);
}
void main() {
  vec3 v = normalize(uCamP - vW);
  float dist = length(uCamP - vW);
  float cosT = clamp(v.y, 0.0, 1.0);
  float fres = 0.26 + 0.6 * ((1.0 - cosT) * (1.0 - cosT) * (1.0 - cosT));
  vec2 sw = vec2(texture2D(tNz, vW.xz * 0.045 + 0.3).g, texture2D(tNz, vW.zx * 0.06 + 0.7).b) - 0.5;
  float skin = smoothstep(0.58, 0.74, texture2D(tNz, vW.xz * 0.028 + 0.11).b);
  vec3 col = vec3(0.0);
  if (uHas > 0.5) {
    vec2 uv = vUv.xy / vUv.w + sw * 0.0025;
    float h = hgt(uv);
    float spread = 0.35 + min(h, 30.0) * uHR.y;
    vec3 acc = texture2D(tDiffuse, uv).rgb * 0.36;
    acc += texture2D(tDiffuse, uv + vec2(1.0, 0.0) * spread * uTexel).rgb * 0.16;
    acc += texture2D(tDiffuse, uv - vec2(1.0, 0.0) * spread * uTexel).rgb * 0.16;
    acc += texture2D(tDiffuse, uv + vec2(0.0, 1.3) * spread * uTexel).rgb * 0.16;
    acc += texture2D(tDiffuse, uv - vec2(0.0, 1.3) * spread * uTexel).rgb * 0.16;
    col = acc * fres * exp(-h / uHR.x) * (uNearF > 0.0 ? smoothstep(uNearF, uNearF + 1.5, dist) : 1.0);
  }
  vec2 rs = uRuby.xz, toC = normalize(uCamP.xz - rs), d2 = vW.xz - rs;
  float al = dot(d2, toC), pe = dot(d2, vec2(-toC.y, toC.x));
  float sw2 = 0.04 + max(al, 0.0) * 0.008;
  float brk = smoothstep(0.35, 0.75, texture2D(tNz, vec2(al * 0.7, pe * 2.0) + 0.23).g);
  float streak = exp(-pe * pe / (sw2 * sw2)) * exp(-max(al, 0.0) / 3.0) * smoothstep(-0.1, 1.0, al) * (0.2 + 0.8 * brk);
  col += vec3(1.0, 0.0, 0.01) * streak * uStreak * fres;
  col *= 1.0 - 0.55 * skin;
  col += vec3(0.0035) * skin;
  gl_FragColor = vec4(col * uGain, 1.0);
}`});let m,M=new ya;const x={value:new bt};let g=null;if(n!=="low"){g=new Sa(v,{textureWidth:n==="high"?1792:1024,textureHeight:n==="high"?896:512,clipBias:.003,multisample:0});const A=g.material;h.uniforms.tDiffuse.value=g.getRenderTarget().texture,g.getRenderTarget().depthTexture=new yi(g.getRenderTarget().width,g.getRenderTarget().height),h.uniforms.tDepth.value=g.getRenderTarget().depthTexture;const E=g.onBeforeRender,Z=g.camera;g.onBeforeRender=(...se)=>{const ue=se[1],T=ue.environmentIntensity;ue.environmentIntensity=Md,M.envMap=ue.environment;const q=x.value.x;x.value.x=0,E.apply(g,se),x.value.x=q,ue.environmentIntensity=T,h.uniforms.uPI.value.copy(Z.projectionMatrix).invert(),h.uniforms.uVW.value.copy(Z.matrixWorld)},h.uniforms.textureMatrix=A.uniforms.textureMatrix,g.material=h,m=g}else m=new Ke(v,h);m.position.set(r,an,c-8),a.add(m);const w=new pt;a.add(w);const y=[],S=[];Fa.forEach((A,E)=>{const Z=A.h??ii*(.94+s()*.12);if(S.push(an+Z),A.kind==="pillar"){const se=Bi({h:Z,r:A.r,detail:o});w.add(u(se,{finish:"turned",seed:100+E,age:.55,tone:.42,rim:l},new fe().makeTranslation(A.x,an-.25,A.z)));const ue=Pt([{r:A.r*1.9,y:0},{r:A.r*1.35,y:.02,smooth:!0},{r:A.r*1.08,y:.09,smooth:!0},{r:A.r*1,y:.2,smooth:!0},{r:A.r*.99,y:.2}],o?40:16);ue.translate(A.x,an,A.z),y.push(ue)}else{const se=A.r*.42,ue=v0({length:Z,ra:se,leaves:8+E%5,pinionR:A.r*1.25,pinionH:Z*.14,pinionAt:Z*(.16+s()*.1),seatAt:Z*.55,detail:o,seed:200+E});w.add(u(ue.geo,{finish:"turned",seed:200+E,age:.5,tone:.42,rim:l},new fe().makeTranslation(A.x,an-.02,A.z)));const T=Pt([{r:se*3.4,y:0},{r:se*2.2,y:.015,smooth:!0},{r:se*1.35,y:.06,smooth:!0},{r:se*1.02,y:.16,smooth:!0},{r:se,y:.16}],o?32:12);T.translate(A.x,an,A.z),y.push(T);const q=E0({R:se*2.6,rIn:se*.26,phase:s(),detail:o});q.translate(A.x,an,A.z),y.push(q)}if(A.snapped){const se=v0({length:ii*.55,ra:A.r*.42,leaves:10,pinionR:A.r*1.25,pinionH:1.4,pinionAt:1.2,seatAt:4.5,detail:o,seed:290}),ue=new fe().compose(Ct(A.x+1.2,an+.2,A.z-.6),new Wt().setFromEuler(new Bn(-.25,.2,-.62)),Ct(1,1,1));w.add(u(se.geo,{finish:"turned",seed:291,age:.75,tone:.42,rim:l},ue))}});const R=new pt;a.add(R);const k=[];li.forEach((A,E)=>{const Z=Fa[A.c],se=Ko({teeth:A.n,r:A.r,profile:"train",spokes:5,rim:.08,hub:.14,hole:Z.r*.44,detail:o,seed:300+E,sheared:A.sheared??(E%3===0?1:0),fold:A.fold,foldAt:A.fold?.5:void 0,snapped:E===3}),ue=u(se,{finish:"sunray",seed:300+E,age:.66,tone:E===0?.3:.45,direct:E===0?bd:1,rim:E===0?d:l});ue.position.set(Z.x+(A.dx??0),an+A.y,Z.z+(A.dz??0)),ue.rotation.set(A.rx,s()*Jo,A.rz,"XZY"),R.add(ue),k.push({mesh:ue,n:A.n,base:ue.rotation.y})});const L=new pt;a.add(L);const C=[[ma+.4,7.7,-5.6,.1,1.05],[ma-.3,6.4,-17.4,.06,.86],[ma+.5,7.6,-22.8,-.09,.78],[ma-.4,6.9,-28.2,.12,.7],[ma+.2,8.1,-33.4,-.05,.6]];{const A=[],E=[];let Z=null;C.forEach(([se,ue,T,q,$],de)=>{const re=cr({length:14,width:2.6,t:.7,detail:o,seed:40+de}),ne=new fe().compose(Ct(se,an+ue,T),new Wt().setFromEuler(new Bn(Math.PI,q,0)),Ct($,$,$));A.push(re.pieces[0].geo.clone().applyMatrix4(ne)),re.inst.forEach((K,ze)=>{Z??=K.geo,(E[ze]??=[]).push(...K.mats.map(Ne=>ne.clone().multiply(Ne)))})}),L.add(u(_t(A),{finish:"blackened",seed:40,age:.6,tone:.4,wear:.3,rim:l})),Z&&p({inst:[{geo:Z,finish:"blackened",seed:44,mats:E.flat()}]},L,{age:.4,tone:.5})}{const Z=[[-11,0],[11,0],[11,16],[-11,16]],se=[[-6.5,4.2,.9],[-2,9.5,.5],[3.6,6.2,1.2],[7.4,11,.6],[.8,2.6,.35],[-8.2,12.5,.7]].map(([q,$,de])=>({at:[q,$],r:de,sink:de*.5})),T=xo({outline:Z,holes:se,t:1.2,bevel:.12,detail:o,round:0}).geo.clone();T.rotateX(-Math.PI/2),L.add(u(T,{finish:"grained",seed:48,age:.7,tone:.35,wear:.5},new fe().makeTranslation(ma,an-.3,ci)))}const z=j0,b={value:0},P=new pt;P.position.set(r,i,c),a.add(P);const I=z*.5,F=El({R:z,screws:16,detail:o,seed:21,staffL:1.5,springR:I}),D=u(F.pieces[0].geo,{finish:"polished",seed:21,age:gd,tone:.95,direct:xd,objScale:vd,line:[8,z*.955],lineU:(x.value.set(8,z*.955),x)});M=D.material,P.add(D),p({inst:F.inst},P,{age:.2,tone:1.05},!0);const J=dr({rOut:I,turns:13,detail:o}),Y=u(J.geo,{finish:"blackened",seed:22,twist:b,twistR:I,age:.25,tone:.7});Y.position.set(r,i+.14,c),a.add(Y);const oe=i+.95,ae=.42,G=1.38,te=Dl({balanceR:z,h:oe-an,t:.3,table:.32,detail:o,seed:6}),V=new pt;V.position.set(r,oe,c),V.rotation.y=-1.04,a.add(V);{const A=te.pieces[0].geo.index?te.pieces[0].geo.toNonIndexed():te.pieces[0].geo,E=-z*.32*1.08,Z=A.attributes.position,se=Z.count/3,ue=de=>{const re=new Ln,ne={};for(const K of Object.keys(A.attributes))ne[K]=[];for(let K=0;K<se;K++)if((Z.getX(3*K)+Z.getX(3*K+1)+Z.getX(3*K+2))/3<E===de)for(const Ne of Object.keys(A.attributes)){const Te=A.attributes[Ne];for(let at=0;at<3;at++)for(let qe=0;qe<Te.itemSize;qe++)ne[Ne].push(Te.array[(3*K+at)*Te.itemSize+qe])}for(const K of Object.keys(A.attributes))re.setAttribute(K,new ct(ne[K],A.attributes[K].itemSize));return re},T=u(ue(!1),{finish:"striped",seed:6,age:.3,tone:.55});V.add(T);const q=Xa("cock",T,{at:[Is[0],0,Is[1]],right:[Math.cos(1.04),0,-Math.sin(1.04)],up:[-Math.sin(1.04),0,-Math.cos(1.04)],width:Is[2],depth:.1},t.lang,{tier:n}),$=globalThis;($.__secondWait??=[]).push(q.ready),V.add(u(ue(!0),{finish:"striped",seed:6,age:.5,tone:.55,direct:wd,wear:.5}))}V.add(u(te.pieces[1].geo,{finish:"polished",seed:7,age:.35}));const B=u(te.pieces[2].geo,{finish:"polished",seed:8,age:0,tone:1.15});V.add(B),p({inst:te.inst},V,{age:.4},!0);const U=lr({detail:o,seed:8}),H=Ct(...Uc),pe=Ct(r,0,c).sub(Ct(H.x,0,H.z)).normalize(),he=Math.atan2(-pe.z,pe.x),ge=U.pieces[1];ge.geo.computeBoundingBox();const W=ge.geo.boundingBox.getCenter(Ct(0,0,0)).applyMatrix4(ge.at),ie=A=>new fe().compose(H,new Wt().setFromAxisAngle(Ct(0,1,0),he),Ct(1,1,A?-1:1)),ye=Ct(...vo),Ae=W.clone().applyMatrix4(ie(!0)).distanceTo(ye)<W.clone().applyMatrix4(ie(!1)).distanceTo(ye),be=new pt;be.applyMatrix4(ie(Ae)),a.add(be),be.add(u(U.pieces[0].geo,{finish:"brushed",seed:9,age:.5}));const Se=md(ge.geo,ie(Ae).multiply(ge.at),Ct(...ro));if(Se===1){const A=ge.geo.boundingBox,E=A.getSize(Ct(0,0,0));ge.geo=ur({L:E.x,w:E.z/2,h:E.y,side:Se}).geo}const Be=fc(ge.geo,Se),Le=dc({half:Be.half,centre:Be.centre,crack:Be.crack,node:Be.node,chipN:Be.chipN,glow:d0.glow,lit:d0.lit,nodeK:d0.node,body:d0.body});Le.crack(d0.crack);const Ve=new Ke(ge.geo,Le);Ve.applyMatrix4(ge.at),Ve.onBeforeRender=(A,E,Z)=>Le.aim(Ve,Z),be.add(Ve);const Ye=W.clone().applyMatrix4(ie(Ae));sn.fork.copy(ie(Ae)),sn.stone.copy(Ve.matrix),sn.stoneWorld.copy(Ye),sn.stoneGeo=ge.geo,sn.side=Se;const Pe=Hi({r:Vs,detail:o,seed:11,sheared:1}),Ue=u(Pe,{finish:"polished",seed:11,age:.5,tone:.8});Ue.position.set(...ro);const et=Math.atan2(-(Ye.z-ro[2]),Ye.x-ro[0]);Ue.rotation.y=et+.18,sn.escRot=Ue.rotation.y,sn.ready=!0,a.add(Ue);const Ie=v0({length:3,ra:.12,leaves:7,pinionR:.34,pinionH:.5,pinionAt:.35,seatAt:1,detail:o,seed:12}),ke=u(Ie.geo,{finish:"turned",seed:12,age:.6},new fe().makeTranslation(ro[0],an-.02,ro[2]));a.add(ke);const ee=new pt;a.add(ee);{const A=li[0],E=Fa[A.c],Z=Ct(E.x+(A.dx??0),an+A.y-.4,E.z+(A.dz??0)),se=Ct(r+.2,i+1.5,c+.4),ue=Oi({count:n==="low"?70:170,box:[1,1,1],centre:[0,0,0],seed:51,detail:o}),T=Pt([{r:.07,y:-.025},{r:.12,y:-.025},{r:.125,y:.02},{r:.07,y:.025},{r:.07,y:-.025}],o?20:10),q=new ca(.7,.045,.07),$=[ue.inst[0],ue.inst[3]],de=tt(53),re=new fe,ne=new Wt,K=Ct(1,1,1),ze=Ct(0,0,0),Ne=[{geo:T,finish:"polished",seed:54,mats:Array.from({length:n==="low"?5:12},()=>new fe)},{geo:q,finish:"sunray",seed:55,mats:Array.from({length:n==="low"?3:7},()=>new fe)}],Te=[...$,...Ne],at=Ct(0,0,0),qe=Ct(0,0,0),rt=se.clone().sub(Z).normalize();at.crossVectors(rt,Ct(0,1,0)).normalize(),qe.crossVectors(at,rt).normalize();for(const St of Te)St.mats.forEach(vn=>{vn.decompose(ze,ne,K),(St.geo===T||St.geo===q)&&ne.setFromEuler(new Bn(de()*6.3,de()*6.3,de()*6.3));const Jt=Math.pow(de(),.75),Zt=.35+1.5*Jt,ln=de()*Jo,Me=Math.sqrt(de())*Zt,Ze=Z.clone().lerp(se,Jt).addScaledVector(at,Math.cos(ln)*Me*1.3).addScaledVector(qe,Math.sin(ln)*Me*.7),Re=(St.geo===T||St.geo===q?1:K.x)*.42;vn.copy(re.compose(Ze,ne,Ct(Re,Re,Re)))});p({inst:Te},ee,{age:.4})}[[7.3,-7,-5.2,-1.2,.3,.9,.7],[1.9,-7.2,-6.6,.6,1.1,.4,.45],[1.4,-9.6,-6.2,1.55,.7,0,.5]].forEach(([A,E,Z,se,ue,T,q],$)=>ee.add(u(ba({size:$===1?"large":"medium",detail:o,seed:60+$,abused:$===0}),{finish:"blackened",seed:60+$,age:.4,tone:.8},new fe().compose(Ct(A,E,Z),new Wt().setFromEuler(new Bn(se,ue,T)),Ct(q,q,q)))));{const A=new $a(.05,4);A.rotateX(-Math.PI/2);const E=n==="low"?160:700,Z=[],se=tt(77),ue=[[r-3.5,c+3.5,2.2],[r+6.5,c+1,1.6],[r-1,c-6,2.6],[r+2,c+6.5,1.4]];for(let T=0;T<E;T++){const q=ue[T%ue.length],$=se()*Jo,de=Math.sqrt(se())*q[2]*(.4+se()*.6),re=.4+se()*se()*2.2;Z.push(new fe().compose(Ct(q[0]+Math.cos($)*de*1.4,an+.004,q[1]+Math.sin($)*de),new Wt().setFromEuler(new Bn(0,se()*Jo,0)),Ct(re,1,re*(.3+se()))))}p({inst:[{geo:A,finish:"blackened",seed:78,mats:Z}]},ee,{age:0,tone:.7})}const X=(A,E)=>Ct(Fa[A].x,an+E,Fa[A].z);y.push(Ra({a:X(2,7.2),b:X(4,5.9),r:.06,sag:1.6,phase:.45,seed:1,detail:o}),Ra({a:X(9,6),b:X(11,8.1),r:.05,sag:1.2,phase:.7,seed:2,detail:o}),Ra({a:X(10,3.4),b:Ct(ro[0]+.6,an+.1,ro[2]-.4),r:.045,sag:.4,phase:.3,seed:3,detail:o}),Ra({a:X(4,3.2),b:X(5,6.4),r:.04,sag:.9,phase:.95,seed:4,detail:o}),Bl({a:X(11,4),b:X(12,3.2),r:.035,sag:.9,phase:.6,beads:8,detail:o}),Ra({a:X(14,4.6),b:Ct(-1.4,an+6.2,-9.4),r:.05,sag:.8,phase:.35,seed:6,detail:o}));{const A=[],E=[];for(let Z=0;Z<=10;Z++){const se=Z/10;A.push(X(4,7.4-se*4.2).add(Ct(.6,0,0))),E.push(X(5,7-se*3.6).add(Ct(.4,0,.3)))}y.push(Hl(A,E,{phase:.55,seed:7,detail:o,t:.008,sag:.5}))}{const A=E0({R:.55,rIn:.07,phase:.3,detail:o});A.translate(r,i+.2,c),y.push(A);const E=E0({R:.38,rIn:.12,phase:.6,detail:o});E.translate(ro[0],ro[1]+.1,ro[2]),y.push(E);const Z=E0({R:.32,rIn:.05,phase:.1,detail:o});Z.translate(H.x,H.y+.16,H.z),y.push(Z),y.push(Ra({a:Ct(r-1,oe-.5,c+.2),b:Ct(r-2.2,i+.2,c+1.6),r:.03,sag:.2,phase:.93,seed:8,detail:o}))}{const A=z*.022,E=Pt([{r:A*3.6,y:0},{r:A*2.3,y:.015,smooth:!0},{r:A*1.4,y:.06,smooth:!0},{r:A*1.03,y:.15,smooth:!0},{r:A,y:.15}],o?28:12);E.translate(r,an,c),y.push(E)}{const A=tt(71),E=[];for(const[se,ue,T]of[[-3.2,4.2,.55],[2.6,5.4,.32],[-5.6,.6,.8],[5.4,-2.6,.6]]){const $=new ms;for(let re=0;re<=26;re++){const ne=re/26*Jo,K=T*(.7+.3*Math.sin(ne*3+A()*.6)+.12*(A()-.5));re?$.lineTo(Math.cos(ne)*K,Math.sin(ne)*K*.8):$.moveTo(K,0)}const de=new Ai($);de.rotateX(-Math.PI/2),de.translate(r+se,an+.004,c+ue),E.push(de);for(let re=0;re<14;re++){const ne=A()*Jo,K=Math.sqrt(A())*T*.8,ze=new ca(.05+A()*.09,.012,.012);ze.rotateY(A()*Jo),ze.translate(r+se+Math.cos(ne)*K,an+.012,c+ue+Math.sin(ne)*K*.8),E.push(ze)}}const Z=new Ke(_t(E.map(se=>se.index?se.toNonIndexed():se)),new ya({color:855308,roughness:.95,metalness:0}));Z.receiveShadow=n!=="low",a.add(Z)}const le=new Ke(_t(y),jo({env:5}));le.receiveShadow=n!=="low",a.add(le);const xe=A=>Jo/A,Ce=Ct(0,0,0),Ee=Ct(0,0,0),Je=Ct(0,0,0);return{group:a,update(A){if(a.visible=A.i>=4&&(A.i<=8||!A.inHold),A.i===6||A.i===7&&!A.inHold||A.i,m.visible=a.visible&&A.i>=5&&A.i<=7,be.visible=Ue.visible=ke.visible=A.i<=6,ee.visible=!(A.i===7&&(A.inHold||A.u>.8)),A.camera.getWorldPosition(Ce),A.camera.updateMatrixWorld(),Je.copy($e.bladeDir).negate().transformDirection(A.camera.matrixWorldInverse),l.value.set(Je.x,Je.y,Je.z,Pd*(1-.55*(A.state.stop.station===6?A.trick("5").k:0))),d.value.copy(l.value),d.value.w*=yd,h.uniforms.uCamP.value.copy(Ce),g){const re=g.getRenderTarget();h.uniforms.uTexel.value.set(1/re.width,1/re.height)}const E=A.trick("5"),Z=A.state.stop;let se=0,ue=0,T=0;if(E.k>0){const re=E.phase*8,ne=[.9,1.7,2.3,3.6,4.2,5.5,6.1,7],K=[.6,.35,.8,.5,.9,.4,.7,.55];ne.forEach((at,qe)=>{re>=at&&(se=K[qe]*Math.exp(-(re-at)*2.6)*Math.min(1,(re-at)*12))}),Ee.set(r,i,c).project(A.camera);const ze=A.state.pointer.x*2-1,Ne=1-A.state.pointer.y*2,Te=1-xt(Math.hypot(ze-Ee.x,(Ne-Ee.y)*.6)/1.2);se*=(.75+.9*Te)*E.k,ue=re<.12?ve(re/.12):1,T=re<.12?0:ve((re-.12)/7.8)}const q=E.k>0?ue*(1-T):0,$=se*.11+q*.05;P.rotation.y=$,b.value=$,k.forEach((re,ne)=>{re.mesh.rotation.y=re.base+q*xe(re.n)*(ne%2?-1:1)}),Ue.rotation.y=et+.18+q*xe(15)*.8,be.rotation.y=0,be.position.copy(H),be.scale.set(1,1,Ae?-1:1),be.quaternion.setFromAxisAngle(Ct(0,1,0),he+q*.09*(Ae?-1:1)),ee.position.y=E.k>0?(ue<1?Math.sin(ue*Math.PI)*.12:0)-q*.05:0,B.rotation.y=-(E.rare>=0?ae+(G-ae)*ve(E.rare):ae);const de=a.visible&&(A.i===6||A.i===7&&!A.inHold&&A.u<.4);if($e.on=de?1:0,$e.fadeTop=an+zd,$e.fadeLen=de&&A.camera.aspect<1?kd:0,$e.steps=de&&n==="high"?ri[0]:0,$e.reflSteps=de&&n==="high"?ri[1]:0,de){const re=Z.station===6?ve(Z.t/1)*(Z.rel>0?1-ve(Z.rel/.9):1):0,ne=E.k;$e.columns=Fa.map((K,ze)=>[K.x,K.z,K.r*.95,S[ze]]),$e.floorY=an,$e.red.copy(Ct(Ye.x-4.2*ne,an+.5+.3*ne,Ye.z-3.6*ne)),$e.redSize.set(1.6+5.2*ne,.7+1.3*ne,1.4+2.2*ne),Y.material.color.setScalar(1-.9*ne),$e.redPower=.012+.17*ne,$e.nave.set(ma,c-2,ci,Ad*(1-.6*re)),$e.ruby.copy(Ye),$e.rubyPower=.05+.06*ne,$e.bladeGain=Rd*(1-.33*re),$e.wake=ne}h.uniforms.uRuby.value.copy(Ye),h.uniforms.uStreak.value=de?1.6+.4*E.k:0,h.uniforms.uNearF.value=A.i===6&&A.inHold?Sd:0}}}const Mt=(t,e,n)=>new _(t,e,n),Oe={tooth:5,gap:.004,glow:1.4,lit:2.2,node:3,body:.07,crack0:.4,push:.022,back:.05,bite:.006,words:2.25,under:.012,sheen:0,fill:.3,toothAz:20,seat:.3,bevel:.8,sheet:1.4,env:.12,envFork:.35,envWheel:.2,envBridge:.25,bridgeNdc:[-.9,-.67],bridgeDepth:5.35,bridgeRecede:.1,bridgeS:.66,toothDirect:.06,toothLine:0,envTooth:.05,toothLen:.32,flank:1,flankR:.004,tilt:0,haze:.07,hazeAt:3.5,hazeSize:2,rimBehind:.9,dress:.3,duelBody:0,duelSheet:1,duelEnv:0,nearR:.09,nearLen:1.4,nearNdc:[.38,-.78],nearDepth:1.86,nearAng:.3,hot:2.5,duelFill:.6,gain:3.2,envGain:5.5,duelPlate:.75};function Td(t){const e=t.kit.q,n=za(e),o=new pt,a=(T,q,$=!0)=>{const de=new Ke(T,cn({tier:e,...q}));return de.castShadow=$&&e!=="low",de.receiveShadow=e!=="low",de};if(!sn.ready||!sn.stoneGeo)return{group:o,update(){o.visible=!1}};const s=new pt;s.applyMatrix4(sn.fork),o.add(s);const r=lr({detail:n,seed:8}),i=a(r.pieces[0].geo,{finish:"brushed",seed:9,age:.35,tone:.45,direct:.06,objScale:.12});i.position.setFromMatrixColumn(sn.stone,0).normalize().multiplyScalar(-.3),i.material.envMapIntensity*=Oe.envFork,s.add(i);const c=fc(sn.stoneGeo,sn.side),l=dc({half:c.half,centre:c.centre,crack:c.crack,node:c.node,chipN:c.chipN,glow:Oe.glow,lit:Oe.lit,nodeK:Oe.node,body:Oe.body,sheen:Oe.sheen,fill:Oe.fill,bevel:Oe.bevel,sheet:Oe.sheet,gain:Oe.gain,env:Oe.env,face:new _(0,1,0),tilt:new _(.12,0,.1)}),d=new Ke(sn.stoneGeo,l);d.applyMatrix4(sn.stone);const u=Mt(0,0,0),p=new fe;d.onBeforeRender=(T,q,$)=>{l.aim(d,$),p.copy(d.matrixWorld).invert(),l.ss.uBl.value.copy(u.copy($e.bladeDir).negate().transformDirection(p))},s.add(d),s.updateMatrixWorld(!0);const f=c.node.clone().applyMatrix4(d.matrixWorld),v=new Gn({color:new Gt().setRGB(.008,.0035,8e-4),roughness:.35,clearcoat:.08,clearcoatRoughness:.2,metalness:0,envMapIntensity:.02,specularIntensity:.1});{const T=c.half.y,q=c.half.z,$=c.centre;for(const[de,re]of[[-q,-1],[q,1]]){const ne=new Ke(new ua(1,20,12),v);ne.scale.set(.06,.016,.02),ne.position.set($.x-c.half.x+.45-Oe.seat-.01,$.y+T*.55,$.z+de+re*.006),d.add(ne)}}const h=Hi({r:Vs,detail:n,seed:11,sheared:1}),m=a(h,{finish:"polished",seed:11,age:.5,tone:.45,objScale:.12,direct:.08});m.material.envMapIntensity*=Oe.envWheel,m.position.set(...ro),o.add(m);const M=h.attributes.position,x=Mt(...ro),g=Mt(0,0,0).setFromMatrixColumn(d.matrixWorld,0).setY(0).normalize(),w=Mt(0,0,0).setFromMatrixColumn(d.matrixWorld,2).setY(0).normalize().multiplyScalar(sn.side),y=g.multiplyScalar(Math.cos(Oe.toothAz*Math.PI/180)).addScaledVector(w,Math.sin(Oe.toothAz*Math.PI/180)).normalize();x.copy(f).addScaledVector(y,Vs);const S=Math.atan2(-(f.z-x.z),f.x-x.x);let R=Mt(0,0,0),k=1e9,L=0,C=1e9,z=-1e9;for(let T=0;T<M.count;T++)L=Math.max(L,Math.hypot(M.getX(T),M.getZ(T)));for(let T=0;T<M.count;T++)Math.hypot(M.getX(T),M.getZ(T))>L-.05&&(C=Math.min(C,M.getY(T)),z=Math.max(z,M.getY(T)));for(let T=0;T<M.count;T++){const q=M.getX(T),$=M.getZ(T),de=Math.hypot(q,$),re=Math.atan2(-$,q);if(de<L-.004)continue;const ne=Math.abs(Math.atan2(Math.sin(re-(S-sn.escRot)),Math.cos(re-(S-sn.escRot))));ne<k&&(k=ne,R=Mt(q,M.getY(T),$))}const b=Math.atan2(-R.z,R.x),P=Math.hypot(R.x,R.z),I=new Pn({color:new Gt(0,0,0),vertexColors:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft});{const T=h.index?h.toNonIndexed():h,q=b-Oe.tooth*Math.PI*2/15,$=T.attributes.position.count,de=[],re=[],ne=T.attributes.position;for(let ze=0;ze<$;ze+=3){let Ne=0,Te=0;for(let rt=0;rt<3;rt++)Ne+=ne.getX(ze+rt)/3,Te+=ne.getZ(ze+rt)/3;const at=Math.atan2(-Te,Ne);(Math.abs(Math.atan2(Math.sin(at-q),Math.cos(at-q)))<Math.PI/15&&Math.hypot(Ne,Te)>L-Oe.toothLen?de:re).push(ze)}const K=ze=>{const Ne=new Ln;for(const[Te,at]of Object.entries(T.attributes)){const qe=at,rt=new Float32Array(ze.length*3*qe.itemSize);ze.forEach((St,vn)=>{for(let Jt=0;Jt<3;Jt++)for(let Zt=0;Zt<qe.itemSize;Zt++)rt[(vn*3+Jt)*qe.itemSize+Zt]=qe.getComponent(St+Jt,Zt)}),Ne.setAttribute(Te,new ra(rt,qe.itemSize))}return Ne};if(de.length){m.geometry=K(re);const ze=a(K(de),{finish:"polished",seed:12,age:.6,tone:.5,objScale:2,direct:Oe.toothDirect,line:[Oe.toothLine,L-Oe.toothLen]});ze.material.envMapIntensity*=Oe.envTooth,m.add(ze);const Ne=ze.geometry.attributes.position;for(const[Te,at,qe,rt]of[[Oe.flank,Oe.flankR,1,.3],[-1,Oe.flankR*.6,.35,.1]]){const St=Array(14).fill(null),vn=Array(14).fill(-1e9);for(let We=0;We<Ne.count;We++){const Tt=Ne.getX(We),jt=Ne.getY(We),en=Ne.getZ(We),Nt=Math.hypot(Tt,en);if(jt<z-.003||Nt<L-Oe.toothLen+.02)continue;const Kt=Math.min(13,Math.floor((Nt-(L-Oe.toothLen+.02))/(Oe.toothLen-.02)*14)),Un=Math.atan2(-en,Tt),Tn=Te*Math.atan2(Math.sin(Un-q),Math.cos(Un-q));Tn>vn[Kt]&&(vn[Kt]=Tn,St[Kt]=Mt(Tt,jt+.001,en))}const Jt=St.filter(We=>!!We);if(Jt.length<3)continue;const Zt=a(ia(Jt,()=>at,6),{finish:"polished",seed:13,age:0,tone:1,direct:qe});Zt.material.envMapIntensity*=rt,m.add(Zt);const ln=Jt.slice(-4),Me=ln[ln.length-1],Ze=Math.max(1e-4,ln[0].distanceTo(Me)),Re=ia(ln,()=>at*1.6,6),it=Re.attributes.position,nt=new Float32Array(it.count*3);for(let We=0;We<it.count;We++){const Tt=1-Math.min(1,Mt(it.getX(We),it.getY(We),it.getZ(We)).distanceTo(Me)/Ze);nt[We*3]=Tt*Tt,nt[We*3+1]=0}Re.setAttribute("color",new ra(nt,3)),m.add(new Ke(Re,I))}}}m.position.copy(f).addScaledVector(y,P+Oe.gap).setY(f.y-z-Oe.under);const F=new pt;F.position.copy(f),o.add(F),F.quaternion.setFromAxisAngle(Mt(0,0,0).crossVectors(y,Mt(0,1,0)).normalize(),Oe.tilt*Math.PI/180),m.position.sub(f),o.remove(m),F.add(m);const D=S-b-Oe.bite/P+Oe.tooth*Math.PI*2/15,J=new pt;J.rotation.y=-5*Math.PI*2/15,m.add(J);const Y=new pt;J.add(Y),Y.scale.setScalar(Oe.dress),Y.position.copy(R).multiplyScalar(1-Oe.dress);const oe=Mt(R.x,0,R.z).normalize(),ae=Mt(-oe.z,0,oe.x),G=Mt(0,1,0),te=R.y;{const T=z-te,q=[];for(let K=0;K<=10;K++){const ze=K/10,Ne=R.clone().addScaledVector(ae,(ze-.5)*.07).addScaledVector(oe,-.004+.008*Math.sin(ze*Math.PI)).addScaledVector(G,T+.002+.004*Math.sin(ze*3.1));q.push(Ne)}Y.add(a(ia(q,K=>.006*(.4+Math.sin(K*Math.PI)),6),{finish:"polished",seed:31,age:.2,tone:1}));const $=[],de=R.clone().addScaledVector(oe,-.1).addScaledVector(ae,-.01).addScaledVector(G,T+.026);for(let K=0;K<=80;K++){const ze=K/80,Ne=ze*Math.PI*5,Te=.028*(1-.45*ze),at=de.clone().addScaledVector(ae,Math.cos(Ne)*Te*.6).addScaledVector(G,Math.sin(Ne)*Te*.45).addScaledVector(oe,ze*.03);$.push(at)}Y.add(a(ia($,K=>.0045*(1-.5*K),5),{finish:"polished",seed:32,age:.3,tone:.95}));const re=new Ke(new ua(1,32,16),new Gn({color:new Gt().setRGB(.004,.0035,.003),roughness:.04,ior:1.47,envMapIntensity:1.2}));re.scale.set(.008,.0075,.045);const ne=R.clone().addScaledVector(oe,-.06).addScaledVector(ae,-.04).addScaledVector(G,T+.003);re.position.copy(ne),re.lookAt(ne.clone().add(oe.clone().multiplyScalar(-1).addScaledVector(ae,-.6))),Y.add(re)}const V=new pt;o.add(V);{const $=vs(Te=>[-1.25+Te*2.5,Math.sin(Te*Math.PI)*-.15],Te=>.2-.03*Math.sin(Te*Math.PI),dt(40,n,16),12),de=[[-2.5/2+.16,0]],re=xo({outline:$,holes:[...de.map(Te=>({at:Te,r:.1,sink:.06})),{at:[-.25,-.1],r:.045,bush:!0}],t:.12,bevel:.04,detail:n,round:1}),ne=a(re.geo,{finish:"striped",seed:9,age:.3,tone:.3,direct:.06,wear:.4,objScale:.15});ne.material.envMapIntensity*=Oe.envBridge,V.add(ne),re.bushes&&V.add(a(re.bushes,{finish:"polished",seed:10,age:.3}));const K=M0("small",de,.12/2-.06,9,{detail:n});for(const Te of K){const at=new yn(Te.geo,cn({finish:Te.finish,seed:Te.seed,tier:e,age:.4}),Te.mats.length);Te.mats.forEach((qe,rt)=>at.setMatrixAt(rt,qe.clone().multiply(new fe().makeScale(.42,.42,.42)))),at.instanceMatrix.needsUpdate=!0,at.computeBoundingSphere(),V.add(at)}const ze=Xa("pallet-bridge",ne,{at:[.62,.12/2,-.06],right:[1,0,0],up:[0,0,-1],width:Oe.words,depth:.03},t.lang,{tier:e}),Ne=globalThis;(Ne.__secondWait??=[]).push(ze.ready)}Mt(0,0,0).applyMatrix4(sn.fork);{const T=Fe.find(rt=>rt.id==="6").pose,q=Mt(...T.pos),$=Mt(...T.look).sub(q).normalize(),de=Mt(0,0,0).crossVectors($,Mt(0,1,0)).normalize(),re=Mt(0,0,0).crossVectors(de,$),[ne,K]=Oe.bridgeNdc,ze=Oe.bridgeDepth,Ne=ze*.18;V.position.copy(q).addScaledVector($,ze).addScaledVector(de,ne*Ne).addScaledVector(re,K*Ne*9/16);const Te=de.clone().multiplyScalar(Math.cos(Oe.bridgeRecede)).addScaledVector($,Math.sin(Oe.bridgeRecede)),at=Mt(0,1,0).addScaledVector($,.08);at.addScaledVector(Te,-at.dot(Te)).normalize(),Te.normalize();const qe=Mt(0,0,0).crossVectors(Te,at);V.quaternion.setFromRotationMatrix(new fe().makeBasis(Te,at,qe)),V.scale.setScalar(Oe.bridgeS)}const B=new fn({vertexShader:`varying vec2 vU;
void main() {vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}`,fragmentShader:`varying vec2 vU;
void main() {
  float a = 1.0 - smoothstep(0.15, 0.5, abs(vU.y - 0.5));
  a *= smoothstep(0.0, 0.25, vU.x) * smoothstep(0.0, 0.25, 1.0 - vU.x);
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}`,transparent:!0,depthWrite:!1,depthTest:!1,blending:Cn,blendSrc:no,blendDst:or,blendSrcAlpha:no,blendDstAlpha:ft}),U=new Ke(new oo(Oe.nearLen,Oe.nearR*2),B);U.renderOrder=10,U.frustumCulled=!1;{const T=Fe.find(qe=>qe.id==="6").pose,q=Mt(...T.pos),$=Mt(...T.look).sub(q).normalize(),de=Mt(0,0,0).crossVectors($,Mt(0,1,0)).normalize(),re=Mt(0,0,0).crossVectors(de,$),[ne,K]=Oe.nearNdc,ze=Oe.nearDepth,Ne=ze*.18;U.position.copy(q).addScaledVector($,ze).addScaledVector(de,ne*Ne).addScaledVector(re,K*Ne*9/16);const Te=de.clone().multiplyScalar(Math.cos(Oe.nearAng)).addScaledVector(re,Math.sin(Oe.nearAng)).normalize(),at=Mt(0,0,0).crossVectors($.clone().negate(),Te);U.quaternion.setFromRotationMatrix(new fe().makeBasis(Te,at,$.clone().negate()))}o.add(U);const H=new fn({uniforms:{uK:{value:Oe.haze}},vertexShader:`varying vec2 vUv;
void main() {vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}`,fragmentShader:`uniform float uK;
varying vec2 vUv;
void main() {
vec2 q = vUv * 2.0 - 1.0;
vec2 d = vec2(dot(q, vec2(0.83, 0.55)), dot(q, vec2(-0.55, 0.83)));
float r = d.x * d.x * 1.6 + d.y * d.y * 7.0;
float n = 0.5 + 0.5 * sin(q.x * 6.3 + 1.3 * sin(q.y * 4.1 + 0.7)) * sin(q.y * 5.2 - q.x * 2.7 + 0.4);
float m = 0.5 + 0.5 * sin(d.x * 9.0 + 2.5 * sin(d.y * 11.0 + 1.0) + 3.0 * n);
float g = exp(-r * 2.2) * smoothstep(0.15, 0.85, n * (0.4 + 0.6 * m)) * smoothstep(1.0, 0.6, max(abs(q.x), abs(q.y)));
gl_FragColor = vec4(vec3(1.0, 0.0, 0.012) * g * uK, 0.0);
}`,transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft}),pe=new Ke(new oo(1,1),H);pe.frustumCulled=!1,pe.renderOrder=-1,o.add(pe);const he=[];for(let T=0;T<=48;T++){const q=Math.PI+(T/48-.5)*1.4;he.push(Mt(Math.cos(q)*j0,0,Math.sin(q)*j0))}const ge=a(ia(he,()=>.07,8),{finish:"polished",seed:14,age:.6,tone:.4,direct:.05});ge.material.envMapIntensity*=.05,o.add(ge);{const T=Fe.find($=>$.id==="6").pose,q=Mt(...T.look).sub(Mt(...T.pos)).setY(0).normalize();ge.position.copy(sn.stoneWorld).addScaledVector(q,j0+Oe.rimBehind).setY(sn.stoneWorld.y-.1),ge.rotation.y=-Math.atan2(-q.z,-q.x)+Math.PI}const W=tt(67),ie=9,ye=new _c(1,0),Ae=new Gn({color:new Gt().setRGB(.006,0,3e-4),roughness:.05,metalness:0,ior:1.76,emissive:new Gt(.004,0,1e-4)}),be=new yn(ye,Ae,ie);be.frustumCulled=!1,o.add(be);const Se=Array.from({length:ie},()=>({t:.25+W()*.7,d:Mt(W()-.3,W()*.9+.2,W()-.5).normalize(),s:.006+W()*.012,r:Mt(W()*6,W()*6,W()*6),v:.12+W()*.2})),Be=18,Le=new Pn({color:new Gt(1.3*Oe.gain,0,.02*Oe.gain),transparent:!1,depthWrite:!0,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft}),Ve=Le.clone();Ve.color.setRGB(6,5,4.6);const Ye=new Ba(1,1,1,4,1,!0);Ye.translate(0,-.5,0),Ye.rotateX(Math.PI/2);const Pe=new yn(Ye,Le,Be),Ue=new yn(new ua(1,6,4),Ve,Be);Pe.frustumCulled=Ue.frustumCulled=!1,o.add(Pe,Ue);const et=Array.from({length:Be},()=>({a:W()*Math.PI*2,c:Math.pow(W(),.7),v:.45+W()*.9,g:W()})),Ie=[.25,.85,1.3,2.4,2.9,3.6,4.3,5.1],ke=new fe,ee=new Wt,j=Mt(1,1,1),X=Mt(0,0,0),le=Mt(0,0,1),xe=Mt(0,0,0),Ce=Mt(0,0,0),Ee=Mt(0,0,0),Je=Mt(0,0,0),A=Mt(0,0,0),E=Mt(0,0,0),Z=[],se=new Set;V.traverse(T=>{const q=T.material;q&&se.add(q)}),o.traverse(T=>{const q=T.material;q&&"envMapIntensity"in q&&!Z.some($=>$[0]===q)&&Z.push([q,q.envMapIntensity])});const ue=[];for(const[T]of Z){const q=T.ss?.uRS2;q&&ue.push([q.value,q.value.y])}return{group:o,update(T){if(o.visible=T.i>=7&&(T.i<=8||!T.inHold),!o.visible)return;const q=T.trick("6");{const qe=T.i===7&&(T.inHold||T.u>.9);pe.visible=ge.visible=U.visible=qe,qe&&(T.camera.matrixWorld.extractBasis(xe,Ce,Ee),pe.position.copy(sn.stoneWorld).addScaledVector(Ee,-3.5),pe.quaternion.copy(T.camera.quaternion),pe.scale.setScalar(Oe.hazeSize*(1+Oe.hazeAt/T.camera.position.distanceTo(sn.stoneWorld))),H.uniforms.uK.value=Oe.gain*Oe.haze*(1-.5*q.k))}for(const[qe,rt]of Z)qe.envMap=t.scene.environment,qe.envMapIntensity=rt*(qe===l?Oe.gain:Oe.envGain)*t.scene.environmentIntensity*(1-(se.has(qe)?Oe.duelPlate:Oe.duelEnv)*q.k);for(const[qe,rt]of ue)qe.y=rt*(1-.95*q.k);l.ss.uSheen.value=Oe.sheen*(1-.85*q.k);const $=Math.pow(1-q.k,6);l.ss.uBevC.value.setRGB(.86*$+.045*q.k,.88*$,.92*$),l.ss.uBody.value=Oe.body*(1+Oe.duelBody*q.k),l.ss.uSheet.value=Oe.sheet*(1+Oe.duelSheet*q.k);const de=T.i===7?T.inHold?ve(T.u):0:1;let re=0,ne=0,K=0;if(q.k>0){const qe=q.phase*6;re=qe<2?ve(qe/2):qe<5?1:1-ve((qe-5)/1),ne=Math.sin(T.state.time*71)*.5+Math.sin(T.state.time*113+1)*.5,ne*=re*(qe<2?qe/2:1),re*=q.k}q.rare>=0&&(K=q.rare);const ze=K>0?ve(K/.06):0;I.color.setScalar(Oe.gain*Oe.hot*q.k*(1-ze)),m.rotation.y=D+de*Oe.push-re*Oe.back-ne*.0025*q.k-ze*.28;const Ne=Oe.crack0+(.96-Oe.crack0)*de;l.crack(K>0?Ne*(1-.85*ve(K/.5)):Ne);const Te=ve((de-.55)/.45)*(1-ze);l.ss.uHeat.value=Te*(1-.35*re)+Math.max(0,ne)*.3*q.k,l.ss.uNodeK.value=Oe.node*(1+2.2*de)*(1-.7*ze),l.ss.uFill.value=Oe.fill*(1-ze)*(1-Oe.duelFill*q.k),l.ss.uLit.value=Oe.lit*(1-.8*ve(K/.5));for(let qe=0;qe<ie;qe++){const rt=Se[qe],St=xt((de-rt.t)/.25)*(1-ze);X.copy(f).addScaledVector(rt.d,St*rt.v).add(E.set(0,-St*St*.05,0)),ee.setFromEuler(new Bn(rt.r.x*St,rt.r.y*St,rt.r.z*St)),ke.compose(X,ee,j.setScalar(St>0&&St<1?rt.s:0)),be.setMatrixAt(qe,ke)}be.instanceMatrix.needsUpdate=!0;const at=q.k>0&&!ze;if(Pe.visible=Ue.visible=at,at){const qe=q.phase*6;let rt=-1;for(const nt of Ie)qe>=nt&&(rt=nt);const St=rt<0?1:(qe-rt)/.4;T.camera.matrixWorld.extractBasis(xe,Ce,Ee),E.copy(f).project(T.camera);const vn=T.state.pointer.x*2-1,Jt=1-T.state.pointer.y*2,Zt=E.x-vn,ln=E.y-Jt,Me=Math.hypot(Zt,ln)||1;Je.set(0,0,0).addScaledVector(xe,Zt/Me).addScaledVector(Ce,ln/Me).addScaledVector(Ee,-.1).normalize();const Ze=Mt(0,0,0).crossVectors(Je,Ee).normalize(),Re=Mt(0,0,0).crossVectors(Ze,Je).normalize(),it=T.camera.position.distanceTo(f);for(let nt=0;nt<Be;nt++){const We=et[nt],Tt=St<1&&nt%2===0&&We.g>.15*(Ie.indexOf(rt)%3),jt=1.05*We.c;A.copy(Je).addScaledVector(Ze,Math.cos(We.a)*jt).addScaledVector(Re,Math.sin(We.a)*jt).normalize(),A.addScaledVector(Ee,-.85*A.dot(Ee)).normalize();const en=We.v*St*(1-.3*St),Nt=.03+.12*We.v*(1-St*.8);X.copy(f).addScaledVector(A,en).add(E.set(0,-St*St*.04,0)),ee.setFromUnitVectors(le,A);const Kt=Math.min(1,T.camera.position.distanceTo(X)/it);ke.compose(X,ee,j.set(5e-4*Kt,5e-4*Kt,Tt?Nt:0)),Pe.setMatrixAt(nt,ke),ke.compose(X,ee,j.setScalar(Tt?6e-4*Kt:0)),Ue.setMatrixAt(nt,ke)}Pe.instanceMatrix.needsUpdate=Ue.instanceMatrix.needsUpdate=!0}if(K>0&&K<.25&&!T.state.reduced){const qe=Math.exp(-K*30)*Math.sin(K*140)*.012*T.camera.position.distanceTo(f);T.camera.matrixWorld.extractBasis(xe,Ce,Ee),T.camera.position.addScaledVector(Ce,qe).addScaledVector(xe,qe*.4),T.camera.updateMatrixWorld()}}}}const f0=(t=0,e=0,n=0)=>new _(t,e,n),yt=(()=>{const t=f0(...Ti),e=f0(...qs),n=e.clone().sub(t).normalize(),o=f0().crossVectors(n,f0(0,1,0)).normalize(),a=f0().crossVectors(o,n).normalize();return{E:t,L:e,F:n,R:o,U:a,Dref:t.distanceTo(e),H:1.95}})();function Lo(t){const e=t/yt.Dref*yt.H,n=new fe;return n.makeBasis(yt.R.clone().multiplyScalar(e),yt.U.clone().multiplyScalar(e),yt.F.clone().multiplyScalar(-e)).setPosition(yt.E.clone().addScaledVector(yt.F,t)),n}function Fd(t){const e=t.clone().sub(yt.E),n=e.dot(yt.F),o=n/yt.Dref*yt.H;return{x:e.dot(yt.R)/o,y:e.dot(yt.U)/o,D:n}}const Xn=[{a:[-.975,-.5],b:[-.975,.5],hw:.1,letter:0},{a:[-.96,.48],b:[-.525,-.2],hw:.088,letter:0},{a:[-.525,-.2],b:[-.09,.48],hw:.088,letter:0},{a:[-.075,.5],b:[-.075,-.5],hw:.1,letter:0},{a:[.325,-.5],b:[.325,.5],hw:.1,letter:1},{a:[.37,-.03],b:[1.03,.5],hw:.09,letter:1},{a:[.6,.17],b:[1.06,-.5],hw:.094,letter:1}],to=t=>Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),Ls=[6.7,7.2,6.8,6.35,7,7.65,7.1],Wa=(()=>{const t=Xn.map(to),e=t[0]+t[1]+t[2];return[{g0:.4+.5+t[2]+t[1],tg:1,h0:0,hdir:1},{g0:.4+.5+t[2],tg:1,h0:t[0],hdir:1},{g0:.4+.5,tg:1,h0:t[0]+t[1],hdir:1},{g0:.4,tg:.5,h0:e,hdir:-1},{g0:0,tg:.5,h0:e+t[3]+.2,hdir:1},{g0:0,tg:0,h0:e+t[3]+.2+.5,hdir:1},{g0:.25,tg:0,h0:e+t[3]+.2+.5+.3,hdir:1}]})(),In={OIL:0,FORGE:1,SCALES:2,SWARM:3,RARE:4},Ds=1.5,qo=5.5,w0=6.5,pc=1.5,fs=w0+pc,_d=3.62,Id=5.45,Ld=t=>t-Math.floor(t),Dd=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),ui=t=>{const e=Dd(t);return e*e*(3-2*e)};function di(t,e){return!e||t<4?t%4:t===4?In.RARE:(t-1)%4}function Ed(t,e){const n=t<Ds?0:_d*ui((t-Ds)/(qo-Ds))**.85,o=Ld((t-qo)/w0);if(t<qo)return{flood:n,a:In.OIL,b:In.OIL,front:-1,phase:o,slot:0,inSlot:t-qo};const a=(t-qo)/fs,s=Math.floor(a),r=t-qo-s*fs,i=di(s,e),c=di(s+1,e),l=r>w0?(r-w0)/pc:-1,d=l<0?-1:-.4+(Id+.8)*ui(l);return{flood:n,a:i,b:l<0?i:c,front:d,phase:o,slot:s,inSlot:r}}const Wd=t=>[In.OIL,In.FORGE,In.SCALES,In.SWARM,In.SCALES,In.OIL,In.FORGE][t]??0,Es=8,_a=(t=0,e=0,n=0)=>new _(t,e,n),ps=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),va=t=>{const e=ps(t);return e*e*(3-2*e)},Js=`
uniform float uA[7];
uniform float uB[7];
uniform float uFront;
uniform float uFlood;
uniform float uT;
uniform vec3 uPtr;
float skH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float skVN(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(skH(i), skH(i + vec2(1.0, 0.0)), f.x), mix(skH(i + vec2(0.0, 1.0)), skH(i + vec2(1.0, 1.0)), f.x), f.y); }
float skSel(float h, float r) {
  if (uFront < -0.5) return 0.0;
  return clamp((uFront - h - r * 0.22) / 0.1 + 0.5, 0.0, 1.0);
}
float skW(float skin, int s, float sel) {
  return (abs(uA[s] - skin) < 0.5 ? 1.0 - sel : 0.0) + (abs(uB[s] - skin) < 0.5 ? sel : 0.0);
}
vec2 skLean(vec2 p) {
  vec2 d = uPtr.xy - p;
  float l = length(d);
  return d / max(l, 1e-4) * uPtr.z * exp(-l * l * 1.2);
}
`,Nd=`
vec3 skVor(vec2 x) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  vec2 mg = vec2(0.0);
  vec2 mr = vec2(0.0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = vec2(skH(n + g), skH(n + g + 17.3));
    vec2 r = g + o - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  float ed = 8.0;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j));
    vec2 o = vec2(skH(n + g), skH(n + g + 17.3));
    vec2 r = g + o - f;
    if (dot(mr - r, mr - r) > 1e-5) ed = min(ed, dot(0.5 * (mr + r), normalize(r - mr)));
  }
  return vec3(ed, length(mr), skH(n + mg));
}
`;function Bd(t,e){const n=[],o=[],a=[],s=[],r=[],i=[];for(const l of t){let d=new Ln;d.setAttribute("position",l.geo.getAttribute("position").clone()),l.geo.index&&d.setIndex(l.geo.index.clone()),d=qc(d,2e-4),d.computeVertexNormals();const u=Xn[l.s],p=to(u),f=Wa[l.s],v=(u.b[0]-u.a[0])/p,h=(u.b[1]-u.a[1])/p,m=d.getAttribute("position"),M=d.getAttribute("normal"),x=n.length/3;for(let w=0;w<m.count;w++){const y=M.getX(w),S=M.getY(w),R=M.getZ(w),k=m.getX(w)+y*e,L=m.getY(w)+S*e,C=m.getZ(w)+R*e;n.push(k,L,C),o.push(y,S,R),r.push(l.D);const z=(k-u.a[0])*v+(L-u.a[1])*h,b=ps(((k-u.a[0])*-h+(L-u.a[1])*v)/u.hw,-1.2,1.2);a.push(l.s,z,b,R);const P=ps(z/p);s.push(f.h0+(f.hdir>0?P:1-P)*p,f.g0+Math.abs(P-f.tg)*p)}const g=d.index;for(let w=0;w<g.count;w++)i.push(x+g.getX(w))}const c=new Ln;return c.setAttribute("position",new ct(n,3)),c.setAttribute("normal",new ct(o,3)),c.setAttribute("aSL",new ct(a,4)),c.setAttribute("aHG",new ct(s,2)),c.setAttribute("aD",new ct(r,1)),c.setIndex(n.length/3>65535?new Ic(i,1):new Lc(i,1)),c}function Hd(t){const e=new Gn({color:16777215,roughness:.1,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.2});return e.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
${Js}
attribute vec4 aSL;
attribute vec2 aHG;
attribute float aD;
uniform vec3 uE;
uniform vec3 uF;
uniform vec3 uR;
uniform vec3 uU;
uniform vec2 uDH;
varying vec4 vSL;
varying vec2 vHG;`).replace("#include <beginnormal_vertex>","vec3 objectNormal = normalize(normal.x * uR + normal.y * uU - normal.z * uF);").replace("#include <begin_vertex>",`vec3 transformed = position;
{
  int si = int(aSL.x + 0.5);
  float sel = skSel(aHG.x, 0.5);
  float wO = skW(0.0, si, sel);
  float wF = skW(1.0, si, sel);
  float fr = max(aSL.w, 0.0);
  float u1 = fract(aSL.y * 1.6 - uT * 2.0 + aSL.x * 0.37);
  float u2 = fract(aSL.y * 0.9 - uT + aSL.x * 0.61);
  float bead = exp(-(((u1 - 0.5) * 9.0) * ((u1 - 0.5) * 9.0))) + 0.7 * exp(-(((u2 - 0.5) * 12.0) * ((u2 - 0.5) * 12.0)));
  float edge = exp(-(((uFlood - aHG.y) / 0.08 - 1.0) * ((uFlood - aHG.y) / 0.08 - 1.0))) * step(uFlood, 3.5);
  transformed += normal * (wO * (0.004 + 0.012 * bead * (0.3 + 0.7 * fr)) + 0.008 * edge - 0.002 * wF);
  vec2 ln = skLean(position.xy);
  float lw = length(ln);
  transformed += normal * lw * (0.25 + 0.75 * max(0.0, dot(normal.xy, ln / max(lw, 1e-5)))) * 0.5;
  float sD = aD / uDH.x * uDH.y;
  transformed = uE + uF * aD + sD * (transformed.x * uR + transformed.y * uU - transformed.z * uF);
}
vSL = aSL; vHG = aHG;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
${Js}
${Nd}
uniform float uForgeTag;
uniform float L7[7];
varying vec4 vSL;
varying vec2 vHG;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
int si = int(vSL.x + 0.5);
if (vHG.y > uFlood - 0.09 * (1.0 - sqrt(max(0.0, 1.0 - vSL.z * vSL.z))) * (1.0 - smoothstep(3.3, 3.6, uFlood))) discard;
float rr = 0.6 * skVN(vec2(vSL.y * 9.0, vSL.z * 2.0) + vSL.x * 7.0) + 0.4 * skVN(vec2(vSL.y * 23.0, vSL.z * 5.0) + vSL.x * 3.0);
float sel = skSel(vHG.x, rr);
float seam = uFront < -0.5 ? 0.0 : exp(-(((uFront - vHG.x - rr * 0.22) / 0.04) * ((uFront - vHG.x - rr * 0.22) / 0.04)));
float sk = sel > 0.5 ? uB[si] : uA[si];
vec3 skCol = vec3(0.0);
vec3 skEm = vec3(0.0);
float skRough = 0.1;
float skCoat = 1.0;
float skTag = 0.0;
float frn = smoothstep(0.0, 0.06, uFlood - vHG.y);
if (sk < 0.5) {
  float band = vSL.z - 0.3 - 0.12 * sin(vSL.y * 1.7 + vSL.x * 2.3);
  float hl = exp(-band * band / 0.006) * smoothstep(0.25, 0.75, vSL.w) * (0.3 + 0.7 * ((0.5 + 0.5 * sin(vSL.y * 1.9 + vSL.x * 1.3 - 6.2832 * uT)) * (0.5 + 0.5 * sin(vSL.y * 1.9 + vSL.x * 1.3 - 6.2832 * uT))));
  float drawn = 0.5 + 0.5 * sin(vSL.y * 37.0 + vSL.z * 4.0 + vSL.x * 5.0);
  skCol = vec3(0.007, 0.0066, 0.007);
  skRough = 0.025 + 0.035 * drawn;
  skEm = vec3(0.15, 0.15, 0.155) * hl;
  skCoat = 1.0;
} else if (sk < 1.5) {
  vec2 q = vec2(vSL.y * 6.5, vSL.z * 1.7 + vSL.x * 5.1);
  q += 0.35 * vec2(sin(q.y * 2.3 + vSL.x), sin(q.x * 1.7 + 2.0 * vSL.x));
  vec3 v = skVor(q);
  vec3 v2 = skVor(q * 2.3 + 11.0);
  float crack = 1.0 - smoothstep(0.0, 0.045 + 0.035 * v.z, v.x);
  crack = max(crack, (1.0 - smoothstep(0.0, 0.03, v2.x)) * step(0.55, v.z) * 0.6);
  float heat = 0.04 + 2.2 * ((0.5 + 0.5 * cos(6.2832 * (vHG.x * 0.45 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 0.45 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 0.45 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 0.45 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 0.45 - uT * 2.0)))) + 0.5 * ((0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))) * (0.5 + 0.5 * cos(6.2832 * (vHG.x * 1.1 + uT))));
  float flake = step(0.72, v.z) * smoothstep(0.3, 0.05, v.x) * (0.5 + 0.5 * sin(6.2832 * (uT + v.z * 5.0)));
  skCol = vec3(0.008, 0.0076, 0.0076) * (0.5 + 1.0 * skH(floor(q * 3.0))) + flake * 0.04;
  skRough = 0.68;
  skCoat = 0.0;
  skEm = vec3(1.0, 0.0, 0.012) * crack * heat * 1.6 * step(-0.3, vSL.w) + vec3(0.5, 0.0, 0.006) * heat * smoothstep(0.2, 0.0, v.x) * 0.08;
  skTag = crack * min(heat, 1.0) * uForgeTag;
} else if (sk < 2.5) {
  float n = skH(floor(vec2(vSL.y * 22.0, vSL.z * 4.0)));
  skRough = 0.9;
  skCoat = 0.0;
  float wv = ((0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (vSL.y * 1.3 - uT * 2.0))));
  skEm = vec3(1.0, 0.0, 0.02) * (0.004 + 3.0 * wv) * (0.6 + 0.6 * n) * smoothstep(0.85, 0.6, abs(vSL.z)) * step(0.0, vSL.z * (skH(vec2(floor(vSL.y * 7.0), vSL.x)) > 0.5 ? 1.0 : -1.0) - 0.15) * step(-0.3, vSL.w) * step(0.0, vSL.y) * step(vSL.y, L7[si]);
  skCol = vec3(0.01);
} else {
  float n = skH(floor(vec2(vSL.y * 9.0, vSL.z * 2.0)) + vSL.x);
  skCol = vec3(0.006);
  skRough = 0.5;
  skCoat = 0.2;
  skEm = vec3(1.0, 0.0, 0.02) * (0.3 + 0.9 * n * n) * exp(-vSL.z * vSL.z * 10.0) * step(-0.3, vSL.w);
}
skEm += vec3(1.0, 0.0, 0.02) * seam * 2.2;`).replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb = skCol;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = skRough;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance = skEm;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat *= skCoat;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(skTag, 0.0, 1.0);`)},e.customProgramCacheKey=()=>"mk-coat",e}function Ws(t,e,n){const o=new Gn(n),a=[`float ang = 0.1 + 0.66 * ((0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))));
  vec2 lp = iA.xy + dir * l + nrm * c * hw;
  ang += min(length(skLean(lp)) * 10.0, 0.3);
  crest = ang;
  float cz = sqrt(max(0.0, 1.0 - c * c)) * 0.06 + 0.006;
  float ca = cos(ang), sa = sin(ang);
  float sg = dir.y > -0.05 ? 1.0 : -1.0;
  vec3 X = vec3(-nrm * sg, 0.0);
  vec3 Y = vec3(dir * sg * ca, -sa);
  R = mat3(X, Y, cross(X, Y));
  float rl = -c * 0.35 + (sd - 0.5) * 0.08;
  float cr = cos(rl), sr = sin(rl);
  R = R * mat3(cr, 0.0, -sr, 0.0, 1.0, 0.0, sr, 0.0, cr);
  ctr = vec3(lp, cz);`,`float u = fract(sd + uT * iD.y);
  u = fract(u + 0.04 * sin(6.2832 * (u * 2.0 - uT * 2.0)));
  l = -hw + u * (L + 2.0 * hw);
  crest = ((0.5 + 0.5 * cos(6.2832 * (u * 2.0 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (u * 2.0 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (u * 2.0 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (u * 2.0 - uT * 2.0))) * (0.5 + 0.5 * cos(6.2832 * (u * 2.0 - uT * 2.0))));
  vec2 lp = iA.xy + dir * l + nrm * c * hw * (1.0 - 0.25 * crest);
  lp += skLean(lp) * 1.4;
  float cz = sqrt(max(0.0, 1.0 - c * c)) * 0.06 + 0.012 + iD.z * 0.045 + crest * 0.07;
  float a1 = 6.2832 * (uT * floor(iD.w) + sd * 3.0);
  vec3 Y = normalize(vec3(dir, 0.0) + vec3(nrm * (sd - 0.5) * 0.5, (fract(sd * 13.0) - 0.5) * 0.6));
  vec3 X0 = normalize(cross(Y, vec3(0.0, 0.0, 1.0)));
  vec3 Z0 = cross(X0, Y);
  float ca = cos(a1), sa = sin(a1);
  vec3 X = X0 * ca + Z0 * sa;
  R = mat3(X, Y, cross(X, Y));
  sc *= 1.5 + 0.6 * crest;
  ctr = vec3(lp, cz);`,`float u = fract(sd * 7.0 + uT * 2.0);
  vec2 lp = iA.xy + dir * l + nrm * c * hw;
  lp += skLean(lp) * 0.8;
  float cz = sqrt(max(0.0, 1.0 - c * c)) * 0.06 + 0.01 + u * 0.09;
  lp.y -= u * u * 0.3;
  float a1 = 6.2832 * (uT * 2.0 + sd) + u * 6.0;
  float ca = cos(a1), sa = sin(a1);
  vec3 ax = normalize(vec3(sin(sd * 40.0), cos(sd * 40.0), 0.7));
  R = mat3(ca) + sa * mat3(0.0, ax.z, -ax.y, -ax.z, 0.0, ax.x, ax.y, -ax.x, 0.0) + (1.0 - ca) * outerProduct(ax, ax);
  sc *= smoothstep(0.0, 0.08, u) * (1.0 - smoothstep(0.6, 1.0, u));
  crest = 1.0 - u;
  ctr = vec3(lp, cz);`][e],s=[In.SCALES,In.SWARM,In.FORGE][e];return o.onBeforeCompile=r=>{Object.assign(r.uniforms,t),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
${Js}
attribute vec4 iA;
attribute vec4 iB;
attribute vec4 iC;
attribute vec4 iD;
varying float vCrest;
varying vec3 vLoc;
varying vec3 vLN;`).replace("#include <beginnormal_vertex>",`float L = iB.x;
float hw = iB.y;
int si = int(iB.z + 0.5);
float sd = iB.w;
vec2 dir = iA.zw;
vec2 nrm = vec2(-dir.y, dir.x);
float l = iD.x;
float c = iD.x * 0.0 + (${e} == 1 ? iD.x : iD.y);
if (${e} == 1) l = 0.0;
float sc = 1.0;
float crest = 0.0;
mat3 R = mat3(1.0);
vec3 ctr = vec3(0.0);
{
  ${a}
}
{
  float tt = clamp(l / L, 0.0, 1.0);
  float h = iC.x + (iC.y > 0.0 ? tt : 1.0 - tt) * L;
  float g = iC.z + abs(tt - iC.w) * L;
  float w = skW(${s}.0, si, skSel(h, sd));
  sc *= smoothstep(0.3, 0.7, w) * step(g, uFlood);
}
vCrest = crest;
vLoc = position;
vLN = normal;
vec3 objectNormal = R * normal;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = ctr + R * (position * sc);"),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
uniform float uCrestLit;
uniform vec3 uCrestCol;
varying float vCrest;
varying vec3 vLoc;
varying vec3 vLN;`).replace("#include <color_fragment>",e===0?`#include <color_fragment>
float pRimL = smoothstep(0.9, 0.55, abs(vLN.z));
float mPh = (vLoc.y - 1.9 * abs(vLoc.x)) * 820.0;
float mAmp = 1.0 - smoothstep(0.25, 0.6, fwidth(mPh) / 6.2832);
float mLine = 0.5 + 0.5 * sin(mPh) * mAmp;
diffuseColor.rgb = mix(vec3(0.055, 0.058, 0.064) * (0.75 + 0.5 * mLine), vec3(0.62, 0.63, 0.66), pRimL);`:"#include <color_fragment>").replace("#include <roughnessmap_fragment>",e===0?`#include <roughnessmap_fragment>
roughnessFactor = mix(0.2 + 0.12 * mLine, 0.1, pRimL);`:"#include <roughnessmap_fragment>").replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${e===0?"totalEmissiveRadiance += vec3(0.34, 0.34, 0.357) * pRimL * (0.1 + 0.9 * ((max(0.0, dot(normalize(normal.xy + vec2(1e-4)), vec2(-0.54, 0.84)))) * (max(0.0, dot(normalize(normal.xy + vec2(1e-4)), vec2(-0.54, 0.84)))) * (max(0.0, dot(normalize(normal.xy + vec2(1e-4)), vec2(-0.54, 0.84))))));":`totalEmissiveRadiance += uCrestCol * ((vCrest) * (vCrest) * (vCrest)) * uCrestLit;
float pRim = ((1.0 - abs(dot(normal, normalize(vViewPosition)))) * (1.0 - abs(dot(normal, normalize(vViewPosition)))) * (1.0 - abs(dot(normal, normalize(vViewPosition)))) * (1.0 - abs(dot(normal, normalize(vViewPosition)))));
totalEmissiveRadiance += vec3(0.2, 0.2, 0.21) * pRim * (0.3 + 1.2 * ((vCrest) * (vCrest)));`}`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= ${e===1?"0.12":e===0?`mix(0.075, 1.0, pRimL);
reflectedLight.directSpecular = mix(min(reflectedLight.directSpecular, vec3(0.05)), reflectedLight.directSpecular, pRimL);
reflectedLight.indirectSpecular = mix(min(reflectedLight.indirectSpecular, vec3(0.05)), reflectedLight.indirectSpecular, pRimL)`:"0.2"};
reflectedLight.directDiffuse *= ${e===0?"0.28":"0.5"};`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0;`)},o.customProgramCacheKey=()=>`mk-part-${e}`,o}function Od(){const e=new ms;e.moveTo(-.05*.3,0),e.lineTo(.05*.3,0),e.lineTo(.05,-.15*.34),e.lineTo(.05*.16,-.15*.9),e.lineTo(0,-.15),e.lineTo(-.05*.16,-.15*.9),e.lineTo(-.05,-.15*.34),e.lineTo(-.05*.3,0);const n=new xi(e,{depth:.003,bevelEnabled:!0,bevelThickness:.003,bevelSize:.0048,bevelSegments:2,curveSegments:5});return n.computeVertexNormals(),n}function Vd(){const t=new Ba(.0045,.0035,.028,6,1).translate(0,-.012,0),e=new Ba(.011,.011,.006,10,1).translate(0,.004,0),n=new Ln,o=t.toNonIndexed(),a=e.toNonIndexed(),s=[...o.attributes.position.array,...a.attributes.position.array],r=[...o.attributes.normal.array,...a.attributes.normal.array];return n.setAttribute("position",new ct(s,3)),n.setAttribute("normal",new ct(r,3)),n}function qd(t){const{q:e}=t,n=e==="low",o=new pt;o.visible=!1,t.group.add(o);const a={uA:{value:[0,0,0,0,0,0,0]},uB:{value:[0,0,0,0,0,0,0]},uFront:{value:-1},uFlood:{value:0},uT:{value:0},L7:{value:Xn.map(to)},uE:{value:yt.E.clone()},uF:{value:yt.F.clone()},uR:{value:yt.R.clone()},uU:{value:yt.U.clone()},uDH:{value:new bt(yt.Dref,yt.H)},uPtr:{value:_a(0,0,0)},uForgeTag:{value:0},uCrestLit:{value:0},uCrestCol:{value:_a(.022,.022,.024)}},s=Hd(a);{const C=new Ke(Bd(t.coat,.005),s);C.frustumCulled=!1,o.add(C)}const r=tt(7077),i=(C,z,b)=>{const P=b.length,I=new P0;I.index=C.index;for(const G of["position","normal"])I.setAttribute(G,C.getAttribute(G));const F=new Float32Array(P*4),D=new Float32Array(P*4),J=new Float32Array(P*4),Y=new Float32Array(P*4),oe=new Float32Array(P*16);b.forEach((G,te)=>{const V=G[0],B=Xn[V],U=to(B),H=Wa[V];F.set([B.a[0],B.a[1],(B.b[0]-B.a[0])/U,(B.b[1]-B.a[1])/U],te*4),D.set([U,B.hw,V,G[1]],te*4),J.set([H.h0,H.hdir,H.g0,H.tg],te*4),Y.set(G.slice(2,6),te*4),Lo(Ls[V]).toArray(oe,te*16)}),I.setAttribute("iA",new xn(F,4)),I.setAttribute("iB",new xn(D,4)),I.setAttribute("iC",new xn(J,4)),I.setAttribute("iD",new xn(Y,4)),I.instanceCount=P;const ae=new yn(I,z,P);return ae.instanceMatrix=new xn(oe,16),ae.frustumCulled=!1,o.add(ae),ae},c=[];Xn.forEach((C,z)=>{const b=to(C),P=n?.085:.068,I=3;for(let F=0,D=-C.hw*.6;D<b+C.hw*.6;F++,D+=P)for(let J=0;J<I;J++){const Y=-.86+1.72*(J+(F%2?.5:0))/(I-(F%2?0:1)||1);Math.abs(Y)>.95||c.push([z,r(),D,Y,F,0])}}),i(Od(),Ws(a,0,{color:new Gt(.09,.09,.095),metalness:1,roughness:.42,envMapIntensity:.45}),c);const l=[];Xn.forEach((C,z)=>{const b=Math.round(to(C)*(n?190:540));for(let P=0;P<b;P++)l.push([z,r(),(r()*2-1)*.95,1+(r()<.3?1:0),r()*r(),1+Math.floor(r()*3)])}),i(Vd(),Ws(a,1,{color:new Gt(.16,.16,.17),metalness:1,roughness:.35,envMapIntensity:.22}),l);const d=[];Xn.forEach((C,z)=>{const b=to(C),P=Math.round(b*(n?10:24));for(let I=0;I<P;I++)d.push([z,r(),r()*b,(r()*2-1)*.8,0,0])});const u=new rs(.017,0).scale(1,.75,.22);i(u,Ws(a,2,{color:new Gt(.04,.037,.036),metalness:.3,roughness:.7,emissive:new Gt(.07,0,.001)}),d);const p=(C,z,b,P=.05)=>_a(C,z,P).applyMatrix4(Lo(Ls[b])),f=(C,z,b,P=.03)=>{const I=Xn[C],F=to(I),D=(I.b[0]-I.a[0])/F,J=(I.b[1]-I.a[1])/F;return p(I.a[0]+(I.b[0]-I.a[0])*z-J*b*I.hw,I.a[1]+(I.b[1]-I.a[1])*z+D*b*I.hw,C,P)},v=Ls[4]/yt.Dref*yt.H,h=[];[[.55,.5,0],[.72,.3,1],[.86,.16,2]].forEach(([C,z,b])=>h.push({a:f(1,C,1),b:f(2,1-C+.02*b,1),w:.011*v,sag:.03*v,ph:b*.23,beads:3+b,nk:.5,seed:11+b,tier:b===2?2:1,snap:b===1})),[[.12,.18,0],[.3,.33,1]].forEach(([C,z,b])=>h.push({a:f(5,C,-1),b:f(6,z,1),w:.012*v,sag:.02*v,ph:.4+b*.3,beads:2+b,seed:21+b,tier:1})),h.push({a:f(3,.45,1),b:f(4,.58,1),w:.011*v,sag:.05*v,ph:.1,beads:4,seed:31,tier:1,drop:.55}),h.push({a:f(3,.7,1),b:f(4,.32,1),w:.008*v,sag:.07*v,ph:.6,beads:3,seed:32,tier:2,snap:!0}),[[0,0],[3,1],[4,0],[6,1]].forEach(([C,z],b)=>{const P=f(C,z,0,.02),I=P.clone().addScaledVector(yt.U,-(.16+.06*b)*v);h.push({a:P,b:I,w:.013*v,end:"drop",ph:b*.27,seed:41+b,tier:1})}),[[1,.3,.12],[1,.72,.2],[2,.45,.09],[2,.8,.15],[5,.5,.14],[5,.86,.1],[6,.6,.17]].forEach(([C,z,b],P)=>{const I=f(C,z,-1,.02),F=I.clone().addScaledVector(yt.U,-b*v);h.push({a:I,b:F,w:(.008+.003*(P%3))*v,end:"drop",ph:.13+P*.31,seed:51+P,tier:P%3===2?2:1})}),[[.25,.25,0],[.42,.4,1]].forEach(([C,z,b])=>h.push({a:f(4,C,-1),b:f(6,z,-1),w:.009*v,sag:.04*v,ph:.7+b*.2,beads:3,seed:61+b,tier:1,snap:b===1}));const m=[],M=6;m.push({top:Array.from({length:M},(C,z)=>f(1,.3+.66*z/(M-1),1,.01)),bot:Array.from({length:M},(C,z)=>f(2,.7-.66*z/(M-1),1,.01)),free:"sides",holes:[{u:.25,v:.5,rx:.05*v,ry:.038*v,kind:"breathe",ph:.1},{u:.55,v:.42,rx:.04*v,ry:.03*v,kind:"open",ph:.5},{u:.8,v:.5,rx:.022*v,ry:.018*v,kind:"breathe",ph:.8},{u:.14,v:.68,rx:.034*v,ry:.024*v,kind:"breathe",ph:.3},{u:.22,v:.84,rx:.014*v,ry:.011*v,kind:"breathe",ph:.65},{u:.34,v:.63,rx:.022*v,ry:.017*v,kind:"breathe",ph:.9},{u:.1,v:.5,rx:.012*v,ry:.01*v,kind:"breathe",ph:.4},{u:.27,v:.74,rx:.009*v,ry:.008*v,kind:"breathe",ph:.15}],waist:.14}),m.push({top:Array.from({length:M},(C,z)=>f(5,.06+.5*z/(M-1),-1,.01)),bot:Array.from({length:M},(C,z)=>f(6,.02+.5*z/(M-1),1,.01)),free:"sides",holes:[{u:.4,v:.5,rx:.04*v,ry:.03*v,kind:"pairA",ph:.2},{u:.72,v:.45,rx:.035*v,ry:.026*v,kind:"pairB",ph:.2}],waist:.12});const x=ac({strands:h,webs:m,q:e,env:.9});o.add(x.group);const g=new ar,w=_a(),y=new k0,S=_a(),R=_a();y.setFromNormalAndCoplanarPoint(yt.F,yt.E.clone().addScaledVector(yt.F,yt.Dref));const k=(C,z)=>C===In.RARE?Wd(z):C,L=(C,z,b,P)=>{const I=P<0?0:va((P-b)/.1+.5);return(a.uA.value[z]===C?1-I:0)+(a.uB.value[z]===C?I:0)};return{forge:0,cover:0,oil:0,scales:0,update(C,z){const b=C.state.stop,P=b.station===Es&&(C.i===Es||C.i===Es+1);if(o.visible=P&&b.t>1.4,!o.visible){this.forge=0,this.cover=0,this.oil=0,this.scales=0,t.shardMat.u&&(t.shardMat.u.uRoot.value=1);return}const I=Ed(b.t,b.rare),F=b.rel>0?1-va(b.rel/.8):1;a.uFlood.value=I.flood*F-(F<1?.02:0),a.uFront.value=I.front,a.uT.value=I.phase;for(let te=0;te<7;te++)a.uA.value[te]=k(I.a,te),a.uB.value[te]=k(I.b,te);w.set(C.state.pointer.x*2-1,1-C.state.pointer.y*2,.5).unproject(C.camera),g.origin.copy(z),g.direction.copy(w).sub(z).normalize();const D=va((b.t-1.5)/.5)*F;if(g.intersectPlane(y,S)){const te=Fd(S);a.uPtr.value.set(te.x,te.y,.035*D)}else a.uPtr.value.set(0,0,0);let J=0;for(let te=0;te<7;te++)J+=L(In.FORGE,te,Wa[te].h0+to(Xn[te])*.5,I.front);J=J/7*va(a.uFlood.value/1);let Y=0;for(let te=0;te<7;te++)Y+=L(In.OIL,te,Wa[te].h0+to(Xn[te])*.5,I.front);let oe=0;for(let te=0;te<7;te++)oe+=L(In.SCALES,te,Wa[te].h0+to(Xn[te])*.5,I.front);this.forge=J,this.cover=ps(a.uFlood.value/3.62),this.oil=Y/7*va(a.uFlood.value/3),this.scales=oe/7*va(a.uFlood.value/1),a.uForgeTag.value=J>.3?.9:0,t.shardMat.u&&(t.shardMat.u.uRoot.value=J>.3?0:1),a.uCrestLit.value=1;const ae=Math.min(...[1,2,3,4,5,6].map(te=>L(In.OIL,te,Wa[te].h0+to(Xn[te])*.5,I.front))),G=a.uFlood.value>2.6;x.group.visible=G&&ae>.5,R.set(.3,1,.4),x.setLight(R),x.update(I.phase,(b.t<qo?va((b.t-4.5)/1):1)*D,g,1)}}}const Ht=(t=0,e=0,n=0)=>new _(t,e,n),er=Math.PI*2,Ns=8,Gd=t=>t.map(([e,n])=>[e*yt.H,-n*yt.H]).reverse(),Ud=[{s:0,k:"bridge",t0:-.05,t1:.56,v:-.015,w:.08,D:9.6,fin:"striped",ends:["sq","snap"],holes:[[.12,"s"],[.42,"b"]],seed:701},{s:0,k:"bridge",t0:.42,t1:1.04,v:.02,w:.072,D:7.7,fin:"striped",ends:["snap","rd"],holes:[[.35,"b"],[.82,"s"]],seed:702},{s:0,k:"lever",t0:.12,t1:.86,v:.072,w:.019,D:6.9,fin:"polished",ends:["rd","rd"],holes:[[.22,"h"]],boss:.22,seed:711},{s:0,k:"spoke",t0:.04,t1:.62,v:-.088,w:.013,D:10.4,fin:"blackened",ends:["sq","snap"],seed:721},{s:0,k:"arbor",t0:.6,t1:.98,v:-.066,D:8.6,seed:731},{s:1,k:"bridge",t0:-.03,t1:.62,v:0,w:.072,D:10.7,fin:"brushed",ends:["rd","snap"],holes:[[.18,"s"],[.5,"b"]],seed:703},{s:1,k:"fork",t0:.4,t1:.97,v:.012,D:8.9,seed:741},{s:1,k:"spoke",t0:.1,t1:.72,v:.066,w:.015,D:7.4,fin:"blackened",ends:["snap","snap"],seed:722},{s:1,k:"frag",t0:.6,t1:1.03,v:-.035,w:.058,D:9.8,fin:"grained",ends:["snap","sq"],holes:[[.5,"h"]],seed:712},{s:2,k:"bridge",t0:-.04,t1:.55,v:.02,w:.07,D:8.4,fin:"polished",ends:["sq","snap"],holes:[[.2,"b"],[.47,"s"]],seed:704},{s:2,k:"bridge",t0:.44,t1:1.03,v:-.015,w:.072,D:10.2,fin:"striped",ends:["snap","rd"],holes:[[.5,"b"],[.85,"s"]],seed:705},{s:2,k:"lever",t0:.08,t1:.88,v:-.066,w:.018,D:7,fin:"polished",ends:["rd","rd"],holes:[[.8,"h"]],boss:.8,seed:713},{s:2,k:"arbor",t0:.26,t1:.8,v:.07,D:9.4,seed:732},{s:3,k:"bridge",t0:-.04,t1:.56,v:-.01,w:.078,D:11.1,fin:"striped",ends:["rd","snap"],holes:[[.18,"s"],[.48,"b"]],seed:706},{s:3,k:"bridge",t0:.46,t1:1.04,v:.02,w:.072,D:8,fin:"grained",ends:["snap","sq"],holes:[[.4,"b"],[.86,"s"]],seed:707},{s:3,k:"arbor",t0:-.03,t1:1.02,v:-.03,D:6.6,seed:733},{s:3,k:"lever",t0:.3,t1:.8,v:-.082,w:.02,D:9.5,fin:"polished",ends:["rd","rd"],holes:[[.72,"h"]],boss:.72,seed:714},{s:3,k:"spoke",t0:.56,t1:1,v:.084,w:.014,D:7.6,fin:"blackened",ends:["snap","sq"],seed:723},{s:4,k:"spoke",t0:.1,t1:.62,v:.01,w:.014,D:10.6,fin:"blackened",ends:["snap","snap"],seed:724},{s:6,k:"lever",t0:.28,t1:.78,v:.1,w:.016,D:8.5,fin:"polished",ends:["rd","snap"],holes:[[.2,"h"]],boss:.2,seed:715}];function $d(t,e,n,o,a,s,r){const i=tt(r*97+3),c=to(t),l=(t.b[0]-t.a[0])/c,d=(t.b[1]-t.a[1])/c,u=-d,p=l,f=36,v=y=>{const S=e+(n-e)*y;return[t.a[0]+(t.b[0]-t.a[0])*S+u*o,t.a[1]+(t.b[1]-t.a[1])*S+p*o]},h=(y,S,R)=>{const k=v(y);return[k[0]+l*S+u*R,k[1]+d*S+p*R]},m=[],M=[];for(let y=0;y<=f;y++){const S=y/f;m.push(h(S,0,a(S))),M.push(h(S,0,-a(S)))}const x=(y,S,R)=>{const k=[],L=a(y);if(S==="rd")for(let C=1;C<12;C++){const z=Math.PI*C/12;k.push(h(y,-R*Math.sin(z)*L,R*Math.cos(z)*L))}if(S==="snap"){const C=4+Math.floor(i()*4);let z=0;for(let b=1;b<C;b++){z+=(1-z)/(C-b+1)*(.5+i());const P=i()<.55?.15+i()*1.1:-(.02+i()*.35);k.push(h(y,-R*P*L,R*(1-2*Math.min(z,.97))*L))}}return k},g=x(0,s[0],1),w=x(1,s[1],-1);return[m[0],...g,...M,...w,...m.slice().reverse().slice(0,f)]}function jd(t,e,n,o,a,s){const r=tt(a*131+7),i=5,c=7,l=Ht(e[0]-t[0],e[1]-t[1],0),d=l.length();l.normalize();const u=Ht(-l.y,l.x,0),p=Ht(0,0,1),f=Array.from({length:i},()=>.7+r()*.5),v=Array.from({length:i},(b,P)=>(P+(r()-.5)*.5)/i*er),h=[],m=r()*.3,M=r()*.3;for(let b=0;b<=c;b++){const P=b/c,I=Math.pow(Math.min(1,P/.3,(1-P)/.38),.9)*(.8+r()*.4),F=Ht(t[0],t[1],0).addScaledVector(l,P*d).addScaledVector(u,(r()-.5)*n*.25);h.push(v.map((D,J)=>F.clone().addScaledVector(u,Math.cos(D)*n*f[J]*I).addScaledVector(p,Math.sin(D)*o*f[J]*I)))}h[0]=h[0].map(()=>Ht(t[0],t[1],0).addScaledVector(u,(m-.15)*n)),h[c]=h[c].map(()=>Ht(e[0],e[1],0).addScaledVector(u,(M-.15)*n));const x=[],g=[],w=[],y=[],S=[],R=[],k=.75+r()*.5,L=r()*10,C=(b,P)=>{x.push(b.x,b.y,b.z),g.push(P),w.push(b.clone().sub(Ht(t[0],t[1],0)).dot(u)/n),y.push(s),S.push(l.x,l.y,k,L),R.push(t[0],t[1],d,n)};for(let b=0;b<c;b++)for(let P=0;P<i;P++){const I=(P+1)%i,F=h[b][P],D=h[b][I],J=h[b+1][P],Y=h[b+1][I],oe=b/c,ae=(b+1)/c;b<c-1&&(C(F,oe),C(Y,ae),C(J,ae)),b>0&&(C(F,oe),C(D,oe),C(Y,ae))}const z=new Ln;return z.setAttribute("position",new ct(x,3)),z.setAttribute("aA",new ct(g,1)),z.setAttribute("aC",new ct(w,1)),z.setAttribute("aTag",new ct(y,1)),z.setAttribute("aAx",new ct(S,4)),z.setAttribute("aOr",new ct(R,4)),z.computeVertexNormals(),z}function Kd(){const t={uGlow:{value:1},uRoot:{value:1},uT:{value:0}},e=new Gn({color:new Gt().setRGB(.012,6e-4,8e-4),roughness:.06,metalness:0,clearcoat:.35,clearcoatRoughness:.04,envMapIntensity:.22,ior:1.76,flatShading:!0});return e.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aA;
attribute float aTag;
attribute vec4 aAx;
attribute vec4 aOr;
varying float vA;
varying float vTag;
varying vec4 vAx;
varying vec4 vOr;
varying vec3 vObj;
varying vec3 vCamObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vA = aA; vTag = aTag; vAx = aAx; vOr = aOr; vObj = position;
#ifdef USE_INSTANCING
vCamObj = (inverse(modelMatrix * instanceMatrix) * vec4(cameraPosition, 1.0)).xyz;
#else
vCamObj = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
#endif`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGlow;
uniform float uRoot;
uniform float uT;
varying float vA;
varying float vTag;
varying vec4 vAx;
varying vec4 vOr;
varying vec3 vObj;
varying vec3 vCamObj;
float shH(float x) { return fract(sin(x * 91.7) * 43758.5); }
float shN(float x) { float i = floor(x); float f = fract(x); return mix(shH(i), shH(i + 1.0), f * f * (3.0 - 2.0 * f)); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
vec3 ax = vec3(vAx.xy, 0.0);
vec3 nx = vec3(-vAx.y, vAx.x, 0.0);
vec3 cn = normalize(nx * cos(vAx.z) + vec3(0.0, 0.0, 1.0) * sin(vAx.z));
vec3 c2 = normalize(cross(cn, ax));
vec3 o = vec3(vOr.xy, 0.0);
vec3 rd = normalize(vObj - vCamObj);
float den = dot(rd, cn);
float tt = abs(den) > 1e-4 ? -dot(vObj - o, cn) / den : -1.0;
float inner = 0.0;
if (tt > 0.0) {
  vec3 h = vObj + rd * tt - o;
  float al = dot(h, ax) / vOr.z;
  float cr = dot(h, c2) / vOr.w;
  float sd = vAx.w;
  float seam = exp(-abs(cr - 0.18 * sin(al * 5.0 + sd)) / 0.028);
  float br1 = exp(-abs(cr - (al - 0.35 - 0.1 * sd / 10.0) * 1.6) / 0.03) * step(0.35, al) * step(al, 0.62);
  float br2 = exp(-abs(cr + (al - 0.6) * 1.2) / 0.025) * step(0.6, al) * step(al, 0.85);
  float streak = 0.4 + 0.6 * shN(al * 14.0 + sd);
  float ends = smoothstep(0.0, 0.15, al) * smoothstep(1.0, 0.75, al);
  float deep = exp(-tt / (vOr.w * 1.3));
  inner = (seam * streak + 0.7 * (br1 + br2)) * ends * deep * uGlow;
}
float hot = vTag * uRoot;
totalEmissiveRadiance += vec3(1.0, 0.012, 0.02) * (inner * mix(0.3, 3.4, hot) + (0.005 + 0.012 * abs(den)) * uGlow * (0.6 + 0.4 * shN(vA * 9.0 + vAx.w)));`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directDiffuse *= 0.0;
reflectedLight.directSpecular *= 0.0;
reflectedLight.indirectSpecular *= 0.0;
reflectedLight.indirectDiffuse *= 0.0;
#ifdef USE_CLEARCOAT
clearcoatSpecularDirect *= 0.0;
#endif`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(vTag * uRoot * inner * 0.8, 0.0, 1.0);`)},Object.assign(e,{u:t})}function Yd(t){const e=t.kit.q,n=za(e),o=e==="low",a=new pt,s={value:new rn(0,1,0,0)},r={value:new rn(0,0,0,0)},i=W=>{const ie=W.material,ye=ie.onBeforeCompile,Ae=ie.customProgramCacheKey.bind(ie);return ie.onBeforeCompile=(be,Se)=>{ye.call(ie,be,Se),be.uniforms.uKR=r,be.fragmentShader=be.fragmentShader.replace("#include <common>",`#include <common>
uniform vec4 uKR;`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
{ vec3 kd = uKR.xyz + vViewPosition; float kr = length(kd); totalEmissiveRadiance += vec3(1.0, 0.0, 0.015) * uKR.w * (0.25 + 0.75 * max(dot(normal, kd / kr), 0.0)) / (1.0 + kr * kr / 2.5); }`)},ie.customProgramCacheKey=()=>Ae()+"-kr",W},c=(W,ie)=>{const ye=new Ke(W,cn({tier:e,rim:s,...ie}));return ye.castShadow=!o,ye.receiveShadow=!o,ye},l=[],d=(W,ie)=>{W.updateMatrix();const ye=Ht().setFromMatrixPosition(W.matrix);l.push({obj:W,base:W.matrix.clone(),c:ye,notch:ie}),W.matrixAutoUpdate=!1,a.add(W)},u=ba({size:"medium",detail:n,seed:3});u.computeBoundingBox();const p=u.boundingBox,f=p.max.y,v=(p.max.x-p.min.x)/2,h=[],m=[],M=W=>new fe().makeBasis(Ht(1,0,0),Ht(0,0,1),Ht(0,-1,0)).multiply(new fe().makeScale(1/yt.H,1/yt.H,1/yt.H)).multiply(new fe().makeTranslation(0,-W/2,0)),x=W=>[W[0]*yt.H,-W[1]*yt.H],g=W=>{const ie=to(W),ye=(W.b[0]-W.a[0])/ie,Ae=(W.b[1]-W.a[1])/ie;return{L:ie,dx:ye,dy:Ae,nx:-Ae,ny:ye}};for(const W of Ud){const ie=Xn[W.s],ye=g(ie),Ae=tt(W.seed),be=(Pe,Ue=W.v)=>[ie.a[0]+(ie.b[0]-ie.a[0])*Pe+ye.nx*Ue,ie.a[1]+(ie.b[1]-ie.a[1])*Pe+ye.ny*Ue];let Se,Be=W.fin??"turned",Le=.3,Ve=.5;if(W.k==="arbor"){const Pe=(W.t1-W.t0)*ye.L;Se=v0({length:Pe,ra:.014,leaves:8,pinionR:.034,pinionH:Pe*.16,pinionAt:Pe*(.2+.3*Ae()),detail:n,seed:W.seed}).geo;const et=be(W.t0);Se.applyMatrix4(new fe().makeBasis(Ht(ye.dy,-ye.dx,0),Ht(ye.dx,ye.dy,0),Ht(0,0,1)).setPosition(et[0],et[1],-.02)),Be="turned",Le=.5,Ve=.55}else if(W.k==="fork"){const Pe=(W.t1-W.t0)*ye.L,Ue=Pe/4.4;Se=lr({detail:n,seed:W.seed,stone:!1}).pieces[0].geo.clone();const Ie=be(W.t0);Se.applyMatrix4(new fe().makeTranslation(.2,-.13,0)).applyMatrix4(new fe().makeScale(Ue,Ue,Ue)).applyMatrix4(new fe().makeBasis(Ht(ye.dx,ye.dy,0),Ht(0,0,1),Ht(ye.dy,-ye.dx,0)).setPosition(Ie[0],Ie[1],0)),Be="brushed",Le=.35,Ve=.55}else{const Pe=W.w,Ue=(W.holes??[]).filter(X=>X[1]==="b").map(X=>X[0]),et=X=>{let le=W.k==="bridge"?1.08-.16*X:W.k==="frag"?.9+.2*Math.sin(X*5+W.seed):1;for(const xe of Ue)le+=.32*Math.exp(-(((X-xe)/.07)**2));return W.boss!==void 0&&(le+=1.7*Math.exp(-(((X-W.boss)/.055)**2))),Pe*le},Ie=$d(ie,W.t0,W.t1,W.v,et,W.ends??["sq","sq"],W.seed),ke=(W.holes??[]).map(([X,le])=>{const xe=le==="s"?.34*Pe:le==="b"?.17*Pe:W.boss!==void 0?.5*Pe:.36*Pe;return{at:x(be(W.t0+(W.t1-W.t0)*X)),r:xe*yt.H,bush:le==="b",sink:le==="s"?xe*yt.H*.35:void 0}}),ee=W.k==="bridge"?.072:W.k==="frag"?.06:W.k==="lever"?.046:.034,j=xo({outline:Ie.map(x).reverse(),holes:ke,t:ee,bevel:W.k==="spoke"?.008:.018,detail:n,round:0});Se=j.bushes?k1([j.geo,j.bushes]):j.geo,Se.applyMatrix4(M(ee));for(const[X,le]of W.holes??[]){if(le!=="s")continue;const xe=be(W.t0+(W.t1-W.t0)*X),Ce=.34*Pe*1.02/v,Ee=new fe().makeRotationY(Ae()*er).premultiply(new fe().makeBasis(Ht(1,0,0),Ht(0,0,1),Ht(0,-1,0))).premultiply(new fe().makeScale(Ce,Ce,Ce)).setPosition(xe[0],xe[1],.006-f*Ce);h.push(Lo(W.D).multiply(Ee))}Le=W.k==="lever"?.45:W.k==="spoke"?.3:.22,Ve=W.k==="spoke"?.35:W.k==="lever"?.6:.42}const Ye=c(Se,{finish:Be,seed:W.seed,age:W.k==="frag"?.55:Be==="polished"?.08:.25,tone:Ve,direct:Le,objScale:.14,envMap:1.1,wear:.3});Ye.position.set(0,0,0),Ye.matrix.copy(Lo(W.D)),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),W.s>=3&&i(Ye),d(Ye,(W.seed%2?1:-1)*(.03+.03*Ae())),m.push({geo:Se,D:W.D,s:W.s})}const w=new yn(u,cn({finish:"polished",seed:709,tier:e,age:.3,tone:.75,objScale:.08,rim:s}),h.length);h.forEach((W,ie)=>w.setMatrixAt(ie,W)),w.castShadow=!o,a.add(w);const y=Kd(),S=[],R=[[4,-.04,.5,.015,8.9,.76],[4,.26,.64,-.035,7.6,.4],[4,.44,.9,.03,10.4,.62],[4,.68,1.04,-.02,8.2,.56],[4,.05,.55,-.06,10.9,.22],[4,.5,.97,.06,7.2,.2],[5,0,.5,0,9.3,.7],[5,.38,.8,.03,7.9,.46],[5,.6,1.04,-.015,10.2,.5],[5,.15,.6,-.06,11.2,.24],[5,.74,1,.058,8.6,.24],[6,-.02,.5,0,8.1,.58],[6,.36,.82,-.03,10.1,.5],[6,.64,1.04,.02,8.8,.48],[6,.12,.55,.062,9.6,.22],[6,.5,.95,-.065,7.3,.2]],k=Ht();R.forEach(([W,ie,ye,Ae,be,Se],Be)=>{const Le=Xn[W],Ve=Le.b[0]-Le.a[0],Ye=Le.b[1]-Le.a[1],Pe=Math.hypot(Ve,Ye),Ue=-Ye/Pe,et=Ve/Pe,Ie=le=>[Le.a[0]+Ve*le+Ue*Ae,Le.a[1]+Ye*le+et*Ae],ke=Be===6?1:0,ee=jd(Ie(ie),Ie(ye),Le.hw*Se*1,Le.hw*(.2+.25*Se),900+Be,ke),j=new Ke(ee,y);j.matrixAutoUpdate=!1,j.castShadow=!o;const X=Lo(be);j.matrix.copy(X),a.add(j),m.push({geo:ee,D:be,s:W}),S.push({mesh:j,end:X,spin:Ht(Math.sin(Be*2.1),Math.cos(Be*1.3),Math.sin(Be*.7+1)).normalize(),seed:Be}),ke&&k.copy(Ht(...Ie(ie+(ye-ie)*.2),0).applyMatrix4(X))});const L=[];for(const[W,ie,ye]of L){const Ae=Xn[W],be=Ae.b[0]-Ae.a[0],Se=Ae.b[1]-Ae.a[1],Be=Math.hypot(be,Se),Le=[Ae.a[0]+be*ie,Ae.a[1]+Se*ie],Ve=-Se/Be,Ye=be/Be,Pe=be/Be,Ue=Se/Be,et=Ae.hw*1.35,Ie=.045,ke=[[Le[0]+Ve*et-Pe*Ie,Le[1]+Ye*et-Ue*Ie],[Le[0]-Ve*et-Pe*Ie,Le[1]-Ye*et-Ue*Ie],[Le[0]-Ve*et+Pe*Ie,Le[1]-Ye*et+Ue*Ie],[Le[0]+Ve*et+Pe*Ie,Le[1]+Ye*et+Ue*Ie]],ee=xo({outline:Gd(ke),holes:[],t:.05,bevel:.015,detail:n,round:1}).geo,j=new fe().makeBasis(Ht(1,0,0),Ht(0,0,1),Ht(0,-1,0)).premultiply(new fe().makeScale(1/yt.H,1/yt.H,1/yt.H));ee.applyMatrix4(new fe().makeTranslation(0,-.01,0));const X=c(ee,{finish:"striped",seed:760+W*3,age:.5,tone:.28,objScale:.1,direct:.35});X.matrix.copy(Lo(ye).multiply(j)),X.matrix.decompose(X.position,X.quaternion,X.scale),d(X,.07)}const C=tt(7707);[[-1.75,.62,13,.42,60],[1.7,-.7,15,.55,72],[1.55,.78,9,.2,40],[-1.55,-.78,10,.26,48],[.12,-1.05,17,.5,80],[-.4,1.1,16,.38,64]].forEach(([W,ie,ye,Ae,be],Se)=>{const Be=Ko({teeth:be,r:Ae*yt.H,t:Ae*yt.H*.08,profile:"train",spokes:5,detail:n,seed:720+Se}),Le=c(Be,{finish:"sunray",seed:720+Se,age:.6,tone:.3,direct:.25,objScale:.14,envMap:.6}),Ve=1/yt.H,Ye=new fe().makeRotationFromEuler(new Bn(1.15+Se%2*.2,Se*.8,.25+.2*Se)),Pe=new fe().makeScale(Ve,Ve,Ve).premultiply(Ye).setPosition(W,ie,0);Le.matrix.copy(Lo(ye).multiply(Pe)),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),d(Le,er/be)});const b=o?40:110,P=new yn(ba({size:"small",detail:Math.min(n,1),seed:9}),cn({finish:"blackened",seed:731,tier:e,age:.6,tone:.35,objScale:.1,rim:s}),b);for(let W=0;W<b;W++){const ie=W%3===0?-1:1,ye=Math.pow(C(),.7),Ae=ie>0?.9+ye*1.1+(C()-.5)*.3:-1.25-ye*.7+(C()-.5)*.3,be=ie>0?.35+ye*.45+(C()-.5)*.5:-.2-ye*.5+(C()-.5)*.6,Se=6+C()*12,Be=(.05+C()*.05)*(Se/10),Le=new fe().makeRotationFromEuler(new Bn(C()*6,C()*6,C()*6)).premultiply(new fe().makeScale(Be*3,Be*3,Be*3));Le.setPosition(Ae,be,0);const Ve=Lo(Se).multiply(Le);P.setMatrixAt(W,Ve)}P.castShadow=!o,a.add(P);const I={uGain:{value:.07}},F=new Ke(new oo(1,1),new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:I,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; varying vec2 vUv;
float h1(float x) { return fract(sin(x * 91.7) * 43758.5); }
float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main() {
  vec2 d = normalize(vec2(0.62, -0.78)), n = vec2(-d.y, d.x);
  vec2 q = vUv - vec2(-0.08, 0.05);
  float a = dot(q, d), c = dot(q, n);
  float core = exp(-c * c * 7.0) * (1.0 - smoothstep(0.35, 0.95, abs(a + 0.15)));
  float streak = 0.55 + 0.45 * vn(c * 23.0 + 2.0) * vn(c * 61.0 + 5.0);
  float pool = 0.35 * exp(-dot(q, q) * 6.0);
  float e = (core * streak + pool) * (1.0 - smoothstep(0.7, 1.0, length(vUv)));
  gl_FragColor = vec4(vec3(0.6, 0.59, 0.58) * e * uGain, 0.0);
}`}));F.matrixAutoUpdate=!1,F.frustumCulled=!1,F.renderOrder=4,F.matrix.copy(Lo(26).multiply(new fe().makeScale(7.5,7.5,1))),a.add(F);const D={uGain:{value:0},uT:{value:0},uS:{value:new bt(1,1)},uM:{value:0},uWide:{value:1},uOil:{value:0},uSc:{value:0}},J=new Ke(new oo(1,1),new fn({transparent:!0,depthWrite:!1,blending:Cn,blendSrc:ft,blendDst:ft,blendSrcAlpha:no,blendDstAlpha:ft,uniforms:D,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; uniform vec2 uS; uniform float uM; uniform float uWide; uniform float uOil; uniform float uSc; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y); }
float sg(vec2 p, vec2 a, vec2 b) { vec2 d = b - a; return length(p - a - d * clamp(dot(p - a, d) / dot(d, d), 0.0, 1.0)); }
void main() {
  vec2 q = vUv;
  vec2 L = vec2(0.0, 0.05) + q * vec2(1.6, 0.85) * uS;
  float cx = (L.x - 0.6) / uWide;
  float dy = L.y - 0.02;
  float sm = mix(1.0, 1.25, uM) * (uWide > 1.5 ? 1.35 : 1.0);
  float acc = 0.0;
  if (abs(cx) < 1.2) for (int i = 0; i < 50; i++) {
    float fi = float(i);
    float r1 = h2(vec2(fi, 1.7)), r2 = h2(vec2(fi, 5.3));
    float broad = step(0.74, r2);
    float x0 = mix(-0.38, 0.6, (fi + 0.5 + (r1 - 0.5) * 1.7) / 50.0);
    if (abs(cx - x0) > mix(0.026, 0.062, broad) * (uWide > 1.5 ? 1.3 : 1.0) * 1.2 * 3.0 + 0.05) continue;
    float r3 = h2(vec2(fi, 9.1)), r4 = h2(vec2(fi, 13.7)), r5 = h2(vec2(fi, 17.3));
    float y0 = mix(-0.4, 0.34, r5);
    float hu = mix(0.08, 1.0, r4 * r4) * sm;
    float hd = mix(0.05, 0.62, pow(max(fract(r3 * 5.7), 0.0), 1.6)) * sm;
    float d = dy - y0;
    float up = clamp(d / hu, 0.0, 1.0), dn = clamp(-d / hd, 0.0, 1.0);
    float w = mix(0.007 + 0.019 * r3, 0.036 + 0.026 * r3, broad) * (uWide > 1.5 ? 1.3 : 1.0) * (1.0 - 0.8 * up * up) * (1.0 - 0.7 * dn * dn) * mix(0.8 + 0.4 * n2(vec2(fi * 3.7, d * 6.0)), 0.5 + 0.8 * n2(vec2(fi * 3.7, d * (2.5 + 2.5 * r4))), broad);
    float xc = x0 + 0.02 * sin(d * (2.0 + 3.0 * r3) + fi * 1.3) * (0.4 + broad) + 0.03 * up * up * (r1 - 0.5);
    float a = abs(cx - xc) / w;
    float prof = exp(-a * a * 1.3) * (1.0 - broad * 0.4 * smoothstep(0.5, 0.9, n2(vec2(cx * 70.0 + fi, d * 5.0))));
    float cut = fract(r4 * 7.3) > 0.55 ? 1.0 - smoothstep(0.0, 0.03, up - 0.6 - 0.12 * (n2(vec2(cx * 90.0, fi)) - 0.5)) : 1.0;
    float along = exp(-pow(max(d / hu, 0.0), 1.8) * 2.0 - pow(max(-d / hd, 0.0), 1.5) * 2.2) * cut;
    float brk = smoothstep(0.08, 0.36, n2(vec2(fi * 7.1, d * (3.0 + 7.0 * r3) - 0.15 * uT)));
    acc += step(0.33, fract(r2 * 13.1 + r5)) * mix(0.42 + 0.58 * fract(r1 * 31.7), 0.85, broad) * prof * along * mix(brk, 1.0, broad * 0.5);
  }
  float horiz = exp(-cx * cx * 2.2 * (cx < 0.0 ? 2.4 : 1.0)) * (uWide > 1.5 ? 1.0 - smoothstep(0.17, 0.3, cx) : 1.0);
  float br = n2(L * vec2(5.0, 2.0) + vec2(3.0, uT)) * 0.6 + n2(L * vec2(13.0, 3.0) - vec2(uT, 1.0)) * 0.4;
  float cm = L.x + 0.55;
  float horizM = uOil * exp(-cm * cm * 13.0) * 0.5;
  float vertM = exp(-pow(max(dy / ((0.12 + 0.3 * n2(vec2(L.x * 9.0, 4.0))) * sm), 0.0), 1.6) - pow(max(-dy / (0.16 * sm), 0.0), 1.4));
  float st = n2(vec2(L.x * 11.0 + 3.0, L.y * 1.2 + 0.2 * uT)) * 0.7 + n2(vec2(L.x * 29.0, L.y * 2.0)) * 0.3;
  float e = min(1.0 - 0.14 * uM, 1.15 * (1.0 - exp(-5.5 * (1.0 + 1.2 * uSc) * acc * horiz)) + 3.0 * vertM * horizM * smoothstep(0.35, 0.75, st)) * (0.75 + 0.25 * br) * (1.0 - smoothstep(0.75, 1.0, abs(q.x))) * (1.0 - smoothstep(0.7, 1.0, abs(q.y)));
  gl_FragColor = vec4(vec3(1.0, 0.012, 0.018) * e * uGain, 0.0);
}`}));J.matrixAutoUpdate=!1,J.frustumCulled=!1,J.renderOrder=5,J.matrix.copy(Lo(15).multiply(new fe().makeTranslation(0,.05,0)).multiply(new fe().makeScale(3.2,1.7,1))),a.add(J);const Y=J.matrix.clone(),oe=new fe,ae=new _,G=qd({q:e,coat:m,group:a,shardMat:y,shards:S.map(W=>W.mesh)}),te=Ht(),V=new fe,B=new Wt,U=Ht(),H=Ht(),pe=Ht(),he=new Wt,ge=Ht();return{group:a,update(W){const ie=W.i===Ns,ye=W.i===Ns+1&&!W.inHold;if(a.visible=ie||ye,!a.visible)return;W.camera.getWorldPosition(H),U.copy($e.bladeDir).negate().transformDirection(W.camera.matrixWorldInverse),s.value.set(U.x,U.y,U.z,.9);const Ae=ie&&!W.inHold?W.u:1,be=Ae>=.04?1:0;for(const Pe of l){if(Pe.obj.visible=W.inHold||W.i!==Ns||Pe.c.distanceToSquared(H)>2.6,be){Pe.obj.matrix.copy(Pe.base);continue}B.setFromAxisAngle(yt.F,-Pe.notch),V.makeTranslation(-Pe.c.x,-Pe.c.y,-Pe.c.z).premultiply(new fe().makeRotationFromQuaternion(B)).premultiply(new fe().makeTranslation(Pe.c.x,Pe.c.y,Pe.c.z)),Pe.obj.matrix.copy(Pe.base).premultiply(V)}sn.ready?te.copy(sn.stoneWorld):te.copy(yt.L);const Se=be?1-Math.pow(1-Math.min(1,(Ae-.04)/.62),3):0;for(const Pe of S){if(Pe.mesh.visible=be===1,Se>=1){Pe.mesh.matrix.copy(Pe.end);continue}Pe.end.decompose(pe,he,ge);const Ue=te.clone().lerp(pe,Se),et=new Wt().setFromAxisAngle(Pe.spin,(1-Se)*(2.5+Pe.seed*.3));Pe.mesh.matrix.compose(Ue,et.multiply(he),ge.clone().multiplyScalar(.25+.75*Se))}y.u.uGlow.value=be?(.6+.4*Se)*1.3:0,G.update(W,H);const Be=G.cover,Le=W.camera.aspect<1?1.45:1,Ve=Math.min(1,Math.max(0,(Ae-.35)/.65)),Ye=Ve*Ve*(3-2*Ve);if(r.value.set(0,0,0,0),be){const Pe=k.clone().applyMatrix4(a.matrixWorld).applyMatrix4(W.camera.matrixWorldInverse);r.value.set(Pe.x,Pe.y,Pe.z,.03*Se)}D.uGain.value=be?.31*(.68+.32*Se)*Math.min(1,Ae/.06)*(1.04-.04*Ye)*(.97+.1*Be)*(Le>1?.9-.1*Be:1)*(1-.3*G.forge):0,D.uM.value=Be,D.uOil.value=G.oil,D.uSc.value=G.scales,I.uGain.value=.062*(1-.1*Be)*(Le>1?1.07+.25*Be:1),D.uWide.value=Le>1?2.05-.2*Be:1.22,D.uS.value.set(1+.08*Be,(1+.15*Be)*Le),J.matrix.copy(Y).multiply(oe.makeScale(D.uS.value.x,D.uS.value.y,1)),ae.copy(H).sub(yt.E).multiplyScalar(1-15/7.6),J.matrix.premultiply(oe.makeTranslation(ae.x,ae.y,ae.z))}}}const Bs=Ci+1.6;function Xd(t){const{kit:e}=t,n=new pt,o=tt(88),a=e.q==="low"?500:1100,s=new yn(new ca(1,1,1,2,1,2),e.stone,a),r=new fe,i=new Wt,c=new Bn,l=new _,d=new _;let u=0;const p=15;for(let S=-n0;S<n0&&u<a;S+=p)for(let R=-n0;R<n0&&u<a;R+=p*.75){const k=Math.round(R/(p*.75)),L=S+(k%2?p/2:0)+(o()-.5)*2,C=R+(o()-.5)*1.5;if(Math.hypot(L,C)>n0)continue;const z=Math.hypot(L,C),b=z<F0?2.4*(1-z/F0):0;c.set((o()-.5)*.06,(o()-.5)*.2,(o()-.5)*.06),i.setFromEuler(c),l.set(L,Ci-2.4-b+o()*.4,C),d.set(p*.9,4,p*.66),r.compose(l,i,d),s.setMatrixAt(u++,r)}s.count=u,s.receiveShadow=!0,n.add(s);let f;e.q==="low"?f=new Ke(new $a(F0,64),e.oil):f=new Sa(new $a(F0,64),{textureWidth:e.q==="high"?1024:640,textureHeight:e.q==="high"?1024:640,color:4868166,clipBias:.003}),f.rotation.x=-Math.PI/2,f.position.y=Bs,n.add(f);const v=e.q==="low"?500:1200,h=220,m=new yn(new ca(.12,1,.12),new Pn({color:3815736,transparent:!0,opacity:.5,depthWrite:!1}),v);m.frustumCulled=!1;const M=Array.from({length:v},()=>[(o()-.5)*2*160,o()*h,(o()-.5)*2*160,.6+o()*.8]);n.add(m);const x=new Ke(new $0(.9,1,64),new Pn({color:3815478,transparent:!0,opacity:.5,depthWrite:!1}));x.rotation.x=-Math.PI/2,n.add(x);const g=new pt,w=new ms;w.moveTo(-.02,-3),w.lineTo(-.05,0),w.lineTo(-.012,9),w.lineTo(.012,9),w.lineTo(.05,0),w.lineTo(.02,-3);const y=new Ke(new Ai(w),e.blood);return y.position.set(0,-2.6,-1),g.add(y),new y0,{group:n,update(S){const R=S.i<=3||S.i===9;n.visible=R,g.parent!==S.camera&&S.camera.add(g);const k=S.shot.wipe;if(g.visible=k>.08&&k<.78,g.visible){const b=(k-.08)/.7;y.rotation.z=1.25-b*2.6,y.scale.setScalar(1.4)}if(!R)return;const L=S.i===9,C=S.state.time;for(let b=0;b<v;b++){const[P,I,F,D]=M[b],J=L?((I-C*140*D)%h+h)%h:I;l.set(P,Bs+J,F),d.set(L?1:2.2,L?9*D:3,L?1:2.2),r.compose(l,i.identity(),d),m.setMatrixAt(b,r)}m.instanceMatrix.needsUpdate=!0;const z=S.trick("8");if(x.visible=z.k>0,x.visible){const b=z.phase*5%1;x.position.set((S.state.pointer.x-.5)*90,Bs+.05,(S.state.pointer.y-.5)*70+20),x.scale.setScalar(2+b*26),x.material.opacity=.5*(1-b)*z.k}}}}function Zd(t){const e=I1(t),n=Qu(t),o=[Xd(t),n,e,E1(t,e),K1(t),dd(t),Cd(t),Td(t),Yd(t),s1(t,n,e)],a=new pt;for(const i of o)a.add(i.group);t.scene.add(a);let s=[],r=null;return{root:a,update(i){for(const c of s)c.group.visible=!0;s=[],o.forEach((c,l)=>{l===0&&i.i===9||c.update(i)}),i.i===9&&o.forEach((c,l)=>{(!i.inHold&&i.u<Zn.cut?l!==8:l===0||l>=3&&l<=8)&&c.group.visible&&(c.group.visible=!1,s.push(c))}),i.i===6&&(o[7].group.visible=!1,i.inHold&&o.forEach((c,l)=>{l!==6&&c.group.visible&&(c.group.visible=!1,s.push(c))})),(i.i===2&&(i.inHold||i.u>=.7)||i.i===3&&!i.inHold&&i.u<.3)&&(n.air.visible=!1),i.i<=3&&o[0].group.visible&&(o[0].group.visible=!1,s.push(o[0])),i.i<=1&&o[3].group.visible&&(o[3].group.visible=!1,s.push(o[3])),i.i===7&&(i.inHold||i.u>.8)&&o.forEach((c,l)=>{l!==7&&(l!==6||i.inHold||i.u>.9)&&c.group.visible&&(c.group.visible=!1,s.push(c))}),(i.i===8||i.i===9&&!i.inHold)&&(r||o[7].group.traverse(c=>{!r&&c.material&&"ss"in c.material&&(r=c)}),r&&r.visible&&(i.i===9||i.inHold||i.u>=.04)&&(r.visible=!1,s.push({group:r,update(){}})),i.i===8&&(i.inHold||i.u>.2)&&o.forEach((c,l)=>{l!==8&&c.group.visible&&(c.group.visible=!1,s.push(c))})),(i.i===4||i.i===5)&&(i.inHold||i.i===5&&i.u>.55)&&o.forEach((c,l)=>{l!==i.i&&c.group.visible&&(c.group.visible=!1,s.push(c))})}}}const Ho=(()=>{const t=new URLSearchParams(location.search).get("cam")?.split(",").map(Number);return t&&t.length>=6&&t.every(Number.isFinite)?t:null})(),Go=(t,e,n)=>t+(e-t)*n,Hs=(t,e,n)=>[Go(t[0],e[0],n),Go(t[1],e[1],n),Go(t[2],e[2],n)];function Qd(t,e,n){return{blade:{from:Hs(t.blade.from,e.blade.from,n),to:Hs(t.blade.to,e.blade.to,n),angle:Go(t.blade.angle,e.blade.angle,n),power:Go(t.blade.power,e.blade.power,n),pen:Go(t.blade.pen??.55,e.blade.pen??.55,n)},red:{at:Hs(t.red.at,e.red.at,n),power:Go(t.red.power,e.red.power,n),reach:Go(t.red.reach,e.red.reach,n)},haze:Go(t.haze,e.haze,n),env:n<.5?t.env:e.env}}function Jd(t,e){const n=e.quality,o=new Dc({canvas:t,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});o.outputColorSpace=Ec,o.toneMapping=Wc,o.shadowMap.enabled=n!=="low"&&!0,o.shadowMap.type=Nc,o.shadowMap.autoUpdate=!0,o.info.autoReset=!1,o.setClearColor(0,1);const a=new ja;a.background=new Gt(0);const s=new tr(30,1,.01,2e3);a.add(s);const r=z1(n),i=x1(o,a,n),c=Zd({kit:r,renderer:o,scene:a,lang:e.lang}),l=h1(o,n),d=matchMedia("(pointer: coarse)").matches,u=n==="high"?66e5:n==="mid"?42e5:17e5,p=n==="high"?1.5:n==="mid"?1.25:d?2:1.25;let f=1,v=1,h=1,m="";function M(){m="";const A=t.clientWidth||innerWidth,E=t.clientHeight||innerHeight;h=Math.min(p,devicePixelRatio||1,Math.sqrt(u/Math.max(1,A*E))),o.setPixelRatio(h),o.setSize(A,E,!1),f=Math.round(A*h),v=Math.round(E*h),l.setSize(f,v),s.aspect=A/E,s.updateProjectionMatrix()}M();let x=0,g=!1;t.addEventListener("webglcontextlost",A=>{A.preventDefault(),g=!0,e.onLost?.()}),t.addEventListener("webglcontextrestored",()=>{g=!1,e.onRestored?.(),M(),r1()});const w=Fe.map(A=>A.id),y={1:[.775,.825],2:[.088,.103],5:[.115,.165],7:[.17,.23]},S=.06,R=.08,k=w.indexOf("3"),L=.35,C=.75,z=A=>w.indexOf(A);function b(A,E){const Z=Ha(A.p);return{state:A,i:Z.i,inHold:Z.inHold,u:Z.u,shot:E,camera:s,local:se=>{const ue=Fe[z(se)];return xt((A.p-ue.a0)/(ue.h1-ue.a0))},hold:se=>{const ue=Fe[z(se)];return xt((A.p-ue.h0)/(ue.h1-ue.h0))},trick:se=>{const ue=z(se);return Kr(A.stop,ue,Z.i===ue&&Z.inHold,A.reduced)}}}function P(A,E,Z){const se=s.aspect<1,ue=ol(s,E,A,se),T=Ha(A.p),q=Fe[T.i],$=Z?Z.light:T.inHold||T.i===0||A.reduced?q.light:Qd(Fe[T.i-1].light,q.light,ve(xt((T.u-(q.lightFrom??0))/((q.lightIn??1)-(q.lightFrom??0))))),de=A.stop,re=de.station===T.i;let ne=re?ve((de.t-(q.stopDelay??0))/1)*(de.rel>0?1-ve(de.rel/q.trick.release):1):0;re&&de.rel>0&&(ne=1-Math.pow(1-ne,q.returnPow??1));let K=1,ze=1;const Ne=Kr(de,0,T.i===0,A.reduced);if(Ne.k>0&&(ze*=1+Math.sin(Ne.phase*Math.PI*2)*.25*Ne.k),T.i===0){const Ze=ve(xt(A.p/Math.max(1e-6,q.h1)*1.25));ze*=.25+.75*Ze,K*=.5+.5*Ze}i.apply($,q.stop,ne,{bladeMul:K,angleMul:ze,seed:A.time,cam:s.position}),$e.bladeFrom.copy(i.blade.position),$e.bladeDir.copy(i.blade.target.position).sub(i.blade.position).normalize(),$e.bladeCos=Math.cos(i.blade.angle),$e.bladePower=i.blade.intensity*.015,$e.time=A.time;const Te=A.reduced?-1:S1(de);if(Te>=0){const Ze=new _(...$.red.at),Re=Ze.distanceTo(s.position)*1.7+4;Qn.centre.value.copy(Ze),Qn.radius.value=Te*Re,Qn.width.value=Re*(q.pulseWidth??.14),Qn.gain.value=Math.sin(Te*Math.PI)*.9*(q.pulseGain??1),$e.pulseC.copy(Ze),$e.pulseR=Te*Re,$e.pulseW=Re*.045,$e.pulseG=Math.sin(Te*Math.PI)*(q.pulseGain??1)}else Qn.radius.value=-1,Qn.gain.value=0,$e.pulseR=-1,$e.pulseG=0;c.update(b(A,E));const at=E.mm,qe=(T.i>0?Fe[T.i-1].sharp:null)??[1,1],rt=q.sharp??[1,1],St=ve(T.u),vn=T.inHold||A.reduced?rt:[qe[0]+(rt[0]-qe[0])*St,qe[1]+(rt[1]-qe[1])*St],Jt=T.i>0&&!A.reduced?Fe[T.i-1]:null,Zt=Jt?.blurMul??1,ln=Jt?.aperture??1;return{focus:ue,focusN:ue*vn[0],focusF:ue*vn[1],blurMul:T.inHold?q.blurMul??1:Zt+((q.blurMul??1)-Zt)*ve(T.u),aperture:(4+at*.09)*(T.inHold?q.aperture??1:ln+((q.aperture??1)-ln)*ve(T.u)),exposure:Z?Z.exposure:ef(T),neutral:T.inHold||T.i===0?q.neutral??0:(Fe[T.i-1].neutral??0)+((q.neutral??0)-(Fe[T.i-1].neutral??0))*ve(T.u/(q.exposureIn??1)),bloom:1,grain:.025,seed:A.reduced?0:A.time*60%997,vig:.85,cover:Math.max(E.cover,x),fade:0,rim:q.rim??0}}let I=0;const F=()=>{I===2?Ve():I===3?G():I<2&&l.drawScene(a,s)};let D=null,J=!1;const Y=(A,E)=>{I<2&&l.finish(s,A,I===1&&(E===null||E===l.fadeTarget)?l.scratch:E)},oe=new Set,ae=[];function G(){let A=`${a.environment?.id??-1}`;a.traverseVisible(E=>{E.isLight&&(A+=`,${E.id}`)}),a.traverseVisible(E=>{const Z=E;if(!(!Z.geometry||!Z.material))for(const se of Array.isArray(Z.material)?Z.material:[Z.material]){const ue=`${A}|${E.id}.${se.id}`;oe.has(ue)||ae.push(ue)}})}let te=-1,V=0,B=!1;const U=o.extensions.has("KHR_parallel_shader_compile");let H=null;const pe=new ja,he=[],ge=new Map,W=new Set,ie=new Map,ye=new Pn({colorWrite:!1}),Ae=[Bc,Hc,uo];let be="";const Se=(A,E)=>{const Z=Object.create(A);return Z.children=[],E&&(Z.material=E),Z},Be=A=>{const E=A,Z=A.geometry;return`${A.type}|${E.isInstancedMesh?1:0}${E.instanceColor?1:0}${E.morphTexture?1:0}${E.isSkinnedMesh?1:0}${E.isBatchedMesh?1:0}|${Object.keys(Z.attributes).sort().join()}|${Object.entries(Z.morphAttributes).map(([se,ue])=>se+ue.length).join()}|${Z.morphTargetsRelative?1:0}`},Le=(A,E,Z,se)=>{W.has(A)||(W.add(A),he.push({o:E,L:Z,env:se}))};function Ve(){const A=[];a.traverseVisible(T=>{T.isLight&&A.push(T)});const E=A.map(T=>`${T.id}:${T.castShadow?1:0}:${T.map?1:0}`).join(),Z=a.environment;ge.has(E)||ge.set(E,A);const se=Z?`${Z.image?.height??0}`:"-",ue=T=>{const q=T;if(!q.geometry||!(q.isMesh||T.isPoints||T.isLine||T.isSprite))return;const $=Be(q);for(const de of Array.isArray(q.material)?q.material:[q.material])if(de){if(Le(`${E}|${se}|${de.id}.${de.version}|${$}`,Se(T,de),E,Z),o.shadowMap.enabled&&T.castShadow){const re=T.customDepthMaterial,ne=de,K=de.alphaToCoverage?.5:de.alphaTest,ze=re?`c${re.id}|${$}`:`d|${$}|${de.shadowSide??Ae[de.side]}|${K>0?1:0}|${ne.map&&K>0?1:0}|${ne.alphaMap&&K>0?1:0}|${ne.displacementMap?1:0}`;if(!ie.has(ze)){let Ne=re;if(!Ne){const Te=new Oc({depthPacking:Vc});Te.side=de.shadowSide??Ae[de.side],Te.alphaTest=K,Te.map=ne.map??null,Te.alphaMap=ne.alphaMap??null,Te.displacementMap=ne.displacementMap??null,Te.displacementScale=ne.displacementScale??1,Ne=Te}ie.set(ze,Se(T,Ne))}Le(`${E}|${ze}`,ie.get(ze),E,null)}if(l.depthPass&&q.isMesh&&!(de.transparent||!de.depthWrite)){const re=`z|${$}`;ie.has(re)||ie.set(re,Se(T,ye.clone())),Le(`${E}|${se}|${re}`,ie.get(re),E,Z)}}};a.traverseVisible(ue),te<0&&(te=he.length),a.traverse(ue)}function Ye(){for(const A of ge.keys())for(const[E,Z]of ie)E[0]!=="z"&&Le(`${A}|${E}`,Z,A,null)}const Pe=()=>{let A=0;for(const E of o.info.programs??[])E.isReady()||A++;return A};function Ue(A,E){if(g)return he.length;const Z=performance.now(),se=o.info.programs?.length??0,ue=o.getRenderTarget();for(!B&&E>0&&(l.compile(),B=!0),o.setRenderTarget(l.mainTarget);he.length&&performance.now()-Z<A&&(o.info.programs?.length??0)-se<E;){const T=he.shift();if(V++,T.L!==be){pe.clear();for(const q of ge.get(T.L)??[])pe.add(Se(q));be=T.L}pe.environment=T.env,o.compile(T.o,s,pe),V===te&&(H=[...o.info.programs??[]])}return!H&&te===0&&B&&(H=[...o.info.programs??[]]),o.setRenderTarget(ue),he.length}function et(A,E){if(g)return;const Z=o.info.render.calls,se=o.info.render.triangles,ue=m,T=o.render;A>=2&&(o.render=()=>{});const q=[];A===1&&o.shadowMap.enabled&&a.traverse(re=>{const ne=re;if(!ne.isLight||!ne.castShadow||!ne.shadow)return;let K=Ie.get(ne);K||(K=ne.shadow.clone(),K.autoUpdate=!0,Ie.set(ne,K)),q.push([ne,ne.shadow]),ne.shadow=K});const $=Object.entries($e).map(([re,ne])=>[re,ne instanceof _||ne instanceof rn?ne.clone():Array.isArray(ne)?ne.map(K=>[...K]):ne]),de=[];A!==4&&a.traverse(re=>{const ne=re,K=ne.geometry;if(ne.isInstancedMesh&&(de.push([ne.instanceMatrix,ne.instanceMatrix.version,ne.instanceMatrix.array.slice()]),ne.instanceColor&&de.push([ne.instanceColor,ne.instanceColor.version,ne.instanceColor.array.slice()])),K?.attributes)for(const ze of Object.values(K.attributes))ze.isInstancedBufferAttribute&&de.push([ze,ze.version,ze.array.slice()])}),I=A,m=A===4?ue:"",A!==4&&(J=!0);try{le(E)}finally{I=0,o.render=T;for(const[re,ne]of q)re.shadow=ne;for(const[re,ne,K]of de)re.version!==ne&&(re.array.set(K),re.needsUpdate=!0);for(const[re,ne]of $){const K=$e;ne instanceof _||ne instanceof rn?K[re].copy(ne):K[re]=ne}m=ue,o.info.render.calls=Z,o.info.render.triangles=se}}const Ie=new Map,ke=new WeakSet;function ee(A){const E=[],Z=(q,$=cs(),de=3)=>E.push({...A,p:q,time:de,stop:$,speed:0}),se=(q,$,de=0)=>({station:q,t:$,rare:!0,rel:de}),ue=Fe.length-1,T=z("7");return Fe.forEach((q,$)=>{const de=K=>q.a0+(q.h0-q.a0)*K,re=(q.h0+q.h1)/2;if($>0)for(const K of A.reduced?[.5]:[.03,.35,.7,.96])Z(de(K));const ne=y[q.id];if(ne&&!A.reduced&&Z(de((ne[0]+ne[1])/2)),$===ue&&!A.reduced)for(const K of[Zn.cut+.01,(Zn.trail[0]+Zn.trail[1])/2,Zn.trail[1]-.02])Z(de(K));if(Z(re),Z(re,se($,wn.pulse+wn.pulseLen*.5)),Z(re,se($,6)),q.trick.rare>0)for(const K of[.2,.6,.95])Z(re,se($,wn.rare+q.trick.rare*K));if(Z(re,se($,6,q.trick.release*.5)),$===T&&!A.reduced)for(let K=0;K<6;K++)Z(re,se($,qo+fs*K+1)),Z(re,se($,qo+fs*K+w0+C));if($===ue&&!A.reduced&&q.trick.rare>0){const K=wn.rare+.69*q.trick.rare;Z(re,se($,K+L*.5)),Z(re,se($,K+L+.5))}}),E}const j={states:ee,compile(A){et(2,A)},finishCompile(){g||Ye()},firstReady(){return!!H&&H.every(A=>A.isReady()&&(U||ke.has(A)))},parallel:U,pump:Ue,ready(){return Pe()===0},busy:Pe,touch(A,E=1e9){const Z=performance.now();let se=0;for(const ue of o.info.programs??[]){if(se>=E)break;if(ke.has(ue))continue;const T=ue;if(T.isReady()&&(T.getUniforms(),ke.add(ue),se++,performance.now()-Z>A))break}return se},draw(A){if(ae.length=0,et(3,A),!ae.length)return!1;for(const E of ae)oe.add(E);return et(1,A),!0},reset(){oe.clear(),W.clear(),he.length=0,be="",te=-1,V=0,B=!1,H=null},release(){for(const A of Ie.values())A.dispose();Ie.clear()},qa:{step(A,E=7){E&1&&et(2,A),ae.length=0,E&2&&et(3,A),E&4&&et(1,A)},forget(){m=""}}};function X(A,E){if(A===m)return;const Z=P(E,o0(E));F(),Y(Z,l.fadeTarget),m=A}function le(A){if(g)return;I===0&&(J&&D&&(J=!1,et(4,D)),D=A),o.info.reset(),Qa.value=v;const E=Ha(A.p);if(A.reduced&&!E.inHold&&E.i>0&&E.u<.999){if(m!==`rm:${E.i}`){const Ne={...A,p:(Fe[E.i-1].h0+Fe[E.i-1].h1)/2},Te=P(Ne,No(E.i-1,.5));F(),Y(Te,l.fadeTarget),m=`rm:${E.i}`}const K={...A,p:(Fe[E.i].h0+Fe[E.i].h1)/2},ze=P(K,No(E.i,.5));F(),Y({...ze,fade:1-ve(E.u)},null);return}const Z=Fe.length-1;if(!A.reduced&&E.i===Z&&!E.inHold&&E.u>=Zn.cut&&E.u<Zn.trail[1]+.01){const K=Fe[Z],ze=Fe[Z-1],Ne=tl(E.u);ds.v=E.u;const Te={...A,p:K.a0+(K.h0-K.a0)*Zn.cut*.5},at=P(Te,Ne.a,{light:ze.light,exposure:ze.exposure??1});F(),Y(at,l.fadeTarget),m="";const qe=P(A,Ne.b,{light:K.light,exposure:K.exposure??1});F(),Y({...qe,fade:1,sweep:E.u<Zn.trail[0]?-9:Gs(E.u,Zn.trail)},null),ds.v=-1;return}const se=!A.reduced&&!E.inHold?y[Fe[E.i].id]:void 0;if(se&&E.u>se[0]&&E.u<se[1]){const K=Fe[E.i],ze=at=>K.a0+(K.h0-K.a0)*at,Ne={...A,p:ze(se[1])};X(`gap:${E.i}`,{...A,p:ze(se[0])});const Te=P(Ne,o0(Ne));F(),Y({...Te,fade:1-ve((E.u-se[0])/(se[1]-se[0]))},null);return}const ue=Fe[Z],T=wn.rare+.69*ue.trick.rare;if(!A.reduced&&E.i===Z&&E.inHold&&A.stop.station===Z&&A.stop.rare&&ue.trick.rare>0&&A.stop.t>=T&&A.stop.t<T+L){X("land",{...A,stop:{...A.stop,t:T-1e-4}});const K=P(A,o0(A));F(),Y({...K,fade:1-ve((A.stop.t-T)/L)},null);return}const q=Fe[E.i],$=!E.inHold&&E.i>0&&E.i!==Z&&E.u<S,de=E.inHold&&E.i===k&&E.u<R;if(!A.reduced&&!Ho&&($||de)){X(`${$?"arr":"hst"}:${E.i}`,{...A,p:($?q.a0:q.h0)-1e-7});const K=P(A,o0(A));F(),Y({...K,fade:1-ve(E.u/($?S:R))},null);return}const re=o0(A);Ho&&(re.pos.set(Ho[0],Ho[1],Ho[2]),re.look.set(Ho[3],Ho[4],Ho[5]),re.mm=Ho[6]||re.mm);const ne=P(A,re);F(),Y(ne,null)}function xe(){return{calls:o.info.render.calls,triangles:o.info.render.triangles,w:f,h:v,dpr:h,programs:o.info.programs?.length??0}}const Ce=o.getContext(),Ee=new Uint8Array(4);function Je(A,E){const Z=[];for(let ue=0;ue<E;ue++){const T=performance.now();le({...A,time:A.time+ue/60}),Ce.readPixels(0,0,1,1,Ce.RGBA,Ce.UNSIGNED_BYTE,Ee),Z.push(performance.now()-T)}return Z.sort((ue,T)=>ue-T),{avg:Z.reduce((ue,T)=>ue+T,0)/E,worst:Z[E-1],p95:Z[Math.floor(E*.95)],calls:o.info.render.calls}}return{render:le,resize:M,info:xe,bench:Je,renderer:o,ix:z,warm:j,setVeil(A){x=xt(A)}}}function ef(t){const e=Fe[t.i].exposure??1,n=Fe[t.i-1]?.exposure??1,o=_i(t.i,t.u,t.inHold);return(t.inHold?e:n+(e-n)*ve(t.u/(Fe[t.i].exposureIn??1)))*o}function tf(){const t=document.createElement("div");t.className="ss-hud",t.setAttribute("aria-hidden","true"),document.body.appendChild(t);let e=0;return{update(n,o,a){if(e++%6)return;const s=Ha(n.p),r=Fe[s.i];t.textContent=[`p ${n.p.toFixed(4)}  ${r.id} ${s.inHold?"hold":"approach"} ${s.u.toFixed(2)}`,`stop ${n.stop.station>=0?Fe[n.stop.station].id:"-"}  ${b1(n.stop)}  t ${n.stop.t.toFixed(2)}`,`tier ${n.quality}${n.reduced?" reduced":""}  ${a.toFixed(1)} ms  calls ${o.calls}  ${o.w}x${o.h}@${o.dpr.toFixed(2)}`].join(`
`)}}}const gr=document.documentElement,mo=new URLSearchParams(location.search),Ia=(t,e)=>{const n=parseFloat(mo.get(t)??"");return Number.isFinite(n)?n:e},ns=gr.lang==="ar"?"ar":"en",fi=matchMedia("(pointer: coarse)").matches,nf=Math.min(screen.width,screen.height)<520,pi=navigator.hardwareConcurrency||4,U0=mo.get("q"),os=U0==="high"||U0==="mid"||U0==="low"?U0:fi&&nf||pi<=4?"low":pi>=8&&!fi?"high":"mid",as=mo.get("rm")==="1"||mo.get("rm")!=="0"&&matchMedia("(prefers-reduced-motion: reduce)").matches,of=mo.has("still");function ss(){gr.classList.add("ss-static"),window.__secondReady=!0}function af(){try{const t=document.createElement("canvas").getContext("webgl2");if(!t)return!1;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("WEBGL_lose_context")?.loseContext(),e}catch{return!1}}function p0(t){const e=t.time??0,n=t.stopAt!==void 0&&t.stopAt>=0?{station:t.stopAt,t:t.st??e,rare:!0,rel:t.rel??0}:cs();return{p:t.p??0,time:e,stop:n,pointer:t.pointer??{x:.5,y:.5},lang:ns,quality:os,reduced:t.reduced??as,speed:0}}async function sf(){const t=document.getElementById("ss-canvas");if(!t||!af()||mo.get("static")==="1"){ss();return}let e;try{e=Jd(t,{quality:os,lang:ns,onLost:ss,onRestored:()=>gr.classList.remove("ss-static")})}catch{ss();return}window.__secondRender=G=>e.render(p0(G)),window.__secondBench=(G,te)=>e.bench(p0(G),te),window.__secondInfo=()=>e.info();const n=mo.get("hud")==="1"?tf():null;if(of){const G=mo.get("stop"),te=G===null?-1:Fe.findIndex(B=>B.id===G);await Promise.race([Promise.all(window.__secondWait??[]),new Promise(B=>setTimeout(B,6e3))]);const V=p0({p:Ia("p",0),time:Ia("time",0),stopAt:te,st:mo.has("st")?Ia("st",0):void 0,rel:Ia("rel",0),pointer:{x:Ia("px",.5),y:Ia("py",.5)}});if(await Promise.race([Promise.all(globalThis.__secondWait??[]),new Promise(B=>setTimeout(B,6e3))]),mo.get("trace")==="1"){window.__secondTraceQA={states:B=>e.warm.states({...p0({}),reduced:B}).map(U=>({p:U.p,time:U.time,stopAt:U.stop.station,st:U.stop.t,rel:U.stop.rel,reduced:U.reduced})),step:(B,U)=>e.warm.qa.step(p0(B),U),forget:()=>e.warm.qa.forget()},window.__secondReady=!0;return}if(mo.get("warm")==="1"){const B=e.warm.states({...V,stop:cs(),speed:0});for(const U of B)e.warm.compile(U);for(e.warm.finishCompile();e.warm.pump(1e9,1e9)>0;);for(let U=0;U<2e3&&!e.warm.ready();U++)await new Promise(H=>setTimeout(H,10));for(const U of B)e.warm.draw(U)}e.render(V),requestAnimationFrame(()=>{e.render(V),requestAnimationFrame(()=>{e.render(V),requestAnimationFrame(()=>{window.__secondReady=!0})})}),n?.update(V,e.info(),0);return}let o=null;if(!as){const{default:G}=await vc(async()=>{const{default:te}=await import("./lenis.BxbUXgKI.js");return{default:te}},[]);o=new G({lerp:.085,wheelMultiplier:.85,touchMultiplier:1.2,autoRaf:!1})}const a=M1(),s={x:.5,y:.5},r={x:.5,y:.5};let i=!1,c=-1;const l=()=>t.clientWidth||innerWidth,d=()=>t.clientHeight||innerHeight;addEventListener("pointermove",G=>{G.pointerType==="mouse"&&(r.x=G.clientX/l(),r.y=G.clientY/d())},{passive:!0}),document.addEventListener("pointerleave",()=>{r.x=.5,r.y=.5}),addEventListener("touchstart",G=>{const te=G.touches[0];te&&(r.x=te.clientX/l(),r.y=te.clientY/d())},{passive:!0}),addEventListener("touchmove",()=>{i=!0,c=performance.now()},{passive:!0}),addEventListener("touchend",()=>{i=!1},{passive:!0});let u=0;const p=()=>{clearTimeout(u),u=window.setTimeout(()=>e.resize(),120)};addEventListener("resize",p,{passive:!0}),visualViewport?.addEventListener("resize",p,{passive:!0});const f=globalThis.__secondWait??[];let v=!1,h=0,m=0;Promise.race([Promise.all(f),new Promise(G=>setTimeout(G,6e3))]).then(()=>{v=!0,m=performance.now()}),e.setVeil(1);const M=performance.now();let x=M,g=0,w=0,y=0;const S=()=>{const G=Math.max(1,o?o.limit:document.documentElement.scrollHeight-innerHeight);return Math.min(1,Math.max(0,(o?o.scroll:scrollY)/G))};function R(G){if(requestAnimationFrame(R),document.hidden){x=G;return}o?.raf(G);const te=Math.min(.1,Math.max(.001,(G-x)/1e3));x=G;const V=S(),B=(V-g)/te;g=V,w+=(B-w)*Math.min(1,te*8);const U=Math.min(1,te*2.8);s.x+=(r.x-s.x)*U,s.y+=(r.y-s.y)*U,i&&G-c>250&&(i=!1);const H=a.update(te,V,w,i),pe={p:V,time:(G-M)/1e3,stop:H,pointer:{...s},lang:ns,quality:os,reduced:as,speed:w};v&&!h&&(L!=="compiling"||e.warm.firstReady()||G-m>1500)&&(h=G,window.__secondUp=G),e.setVeil(h?1-rf((G-h)/1400):1);const he=performance.now();(L!=="compiling"||h||e.warm.firstReady())&&e.render(pe),y+=(performance.now()-he-y)*.1,n&&n.update(pe,e.info(),y),ae(G,V,w)}const k=mo.get("warm")!=="0";let L="done",C=[],z=[],b=[],P=0,I=!1,F=0;const D=G=>{L=G,window.__secondWarm=G,(window.__secondWarmAt??={})[G]=Math.round(performance.now())},J=100,Y=.3;function oe(){if(!k){D("done");return}C=e.warm.states({p:0,time:0,stop:cs(),pointer:{x:.5,y:.5},lang:ns,quality:os,reduced:as,speed:0});const G=S(),te=Math.max(0,C.findIndex(V=>V.p>=G-.002));z=C.map((V,B)=>(te+B)%C.length),b=C.map(()=>!1),P=0,I=!1,e.warm.reset(),D("compiling")}function ae(G,te,V){if(L==="compiling"){const pe=performance.now();for(;P<z.length&&performance.now()-pe<4&&e.warm.pump(0,0)<400;)performance.now(),e.warm.compile(C[z[P++]]);e.warm.parallel||e.warm.touch(h?0:4,h?1:3);const he=e.warm.parallel?h?Math.min(4,8-e.warm.busy()):Math.min(8,24-e.warm.busy()):h?1:3,ge=he>0?e.warm.pump(Math.max(1,6-(performance.now()-pe)),he):1;P>=z.length&&ge===0&&!I?(e.warm.finishCompile(),I=!0):I&&ge===0&&e.warm.ready()&&(D("warming"),F=G);return}if(L!=="warming"||G-F<J||Math.abs(V)>Y)return;F=G,e.warm.touch(3);let B=-1,U=9;for(let pe=0;pe<C.length;pe++)if(!b[pe]){const he=(C[pe].p-te+1.002)%1;he<U&&(U=he,B=pe)}const H=performance.now();for(;B>=0;){if(b[B]=!0,performance.now(),e.warm.draw(C[B])||performance.now()-H>6)return;B=-1,U=9;for(let he=0;he<C.length;he++)if(!b[he]){const ge=(C[he].p-te+1.002)%1;ge<U&&(U=ge,B=he)}}e.warm.ready()&&e.warm.touch(3)===0&&(e.warm.release(),D("done"))}oe(),ws(oe),requestAnimationFrame(R)}const rf=t=>{const e=Math.min(1,Math.max(0,t));return e*e*(3-2*e)};sf().catch(()=>ss());
