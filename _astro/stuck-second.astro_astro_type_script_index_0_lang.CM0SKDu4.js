import{_ as mc}from"./preload-helper.4QTdcD_W.js";import{V as C,y as ba,M as je,P as Qs,C as Gt,aG as Ma,r as se,f as ln,W as a0,H as c0,d as un,aN as fi,w as cs,az as Js,U as Es,R as vc,j as hi,o as mi,au as Gn,k as bt,F as rt,b9 as vi,a as In,Q as Wt,h as Nn,aP as gc,ba as xc,G as gt,Y as gn,i as fa,T as l0,N as y0,s as vo,a9 as An,a7 as dt,am as U0,ak as er,a3 as wc,aH as yc,ay as j0,J as ga,ag as Sa,B as s0,ah as vn,ab as ls,m as gi,e as Pn,c as no,S as za,ao as Sr,O as xi,b5 as wi,b3 as bc,b4 as Mc,aD as yi,I as Sc,z as zc,A as bi,ap as kc,aE as Mi,b as i0,$ as Ga,a0 as Pc,bb as Ac,n as zr,as as ns,bc as Rc,_ as Cc,aa as Si,u as B0,ai as Tc,a8 as to,aj as zi,aR as ki,bd as tr,ae as Pi,be as Fc,aZ as _c,a_ as Ic,bf as Lc,bg as Ec,bh as Dc,bi as Wc}from"./three.module.DotLUvJB.js";import{a as Ai,m as Nc}from"./BufferGeometryUtils.DT9FFXp1.js";import{R as Bc}from"./RoundedBoxGeometry.Ck0-tbS7.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ri=-14,L0=-12,Ao=7/60*Math.PI*2,Do=[6.4,7,-8.1],os=1,N0=[3.5,-11.3,-11.5],Ua=3.4,so=[9.7,-11.25,-9.2],Ds=1.75,Hc=[7.6,-11.2,-11.2],fo=[7.95,-11.05,-9.75],Ci=[19,-8.6,-6.5],Ws=[8.2,-10.6,-9.6],Ca=70,ta=260,Oc=[[-6.5,-9.2,6.5],[-14.5,-6,3],[-14,-2.4,-6],[-6,-1.8,-11],[.5,-3,-6],[1,-3,.5],[4.6,-3.6,7.5],[1.5,-7.8,12],[-4,-10.5,13.5]],wo=(t,e)=>[t[0]+e[0],t[1]+e[1],t[2]+e[2]],Vc=(t,e)=>Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]),Ti=[{id:"0",name:"THE LID",move:"held",approach:.04,hold:.06,rim:1,pose:{pos:[69.2,50,35.6],look:[-10.4,-1,3.2],mm:40,pl:[3,0,-7.4]},drift:[0,0,0],light:{blade:{from:[-90,140,-30],to:[0,0,0],angle:.36,power:40},red:{at:[9,-3,-8],power:0,reach:30},haze:.02,env:0},stop:{blade:.4,red:1,angle:1},trick:{loop:8,release:.8,rare:0},exposure:1.3},{id:"1",name:"THE HAND",move:"slide",approach:.06,hold:.05,returnPow:3,pose:{pos:[12.95,1.54,-18],look:[10.9,-1.05,-10.49],mm:24,pf:1.15,pl:[0,-.5,0]},drift:[.006,-.002,-.004],light:{blade:{from:[-24,30,14],to:[13.1,0,-14.6],angle:.14,power:60},red:{at:[10,-1.4,-11],power:0,reach:18},haze:0,env:2},stop:{blade:.5,red:2.4,angle:1},trick:{loop:6,release:.7,rare:6},exposure:5.5,sharp:[.18,1]},{id:"2",name:"THE DROPS",move:"crane",approach:.05,hold:.05,pose:{pos:[22.2,21.9,6.2],look:[8.01,7,-9.77],mm:90,pf:1.25,pl:[-1.4,1.5,1.3]},drift:[0,.1,0],sharp:[.95,1.05],aperture:4,blurMul:1.25,light:{blade:{from:[-30,40,-40],to:[-1,0,-14],angle:.3,power:1.5},red:{at:[3,1,-13],power:0,reach:22},haze:.25,env:2},stop:{blade:.45,red:1.4,angle:1},trick:{loop:8,release:.8,rare:6},exposure:1.1,exposureIn:.5,lift:[.6,0,.35]},{id:"G",name:"THE GATE",move:"through",approach:.05,hold:.07,pose:{pos:[-8,22,34],look:[-6,0,11],mm:32,pf:1.05},drift:[0,-.6,-.4],light:{blade:{from:[-34,80,52],to:[-6,0,8],angle:.28,power:14},red:{at:[9.5,-10.5,-9],power:10,reach:3},haze:0,env:2},stop:{blade:.8,red:1.8,angle:1},trick:{loop:8,release:1,rare:0},exposure:6.8,exposureIn:.55,lightFrom:.12,lightIn:.6,lift:[1.2,0,1,.12],liftPre:1.35,pulseGain:.02,neutral:1},{id:"3",name:"THE BURST",move:"fall",approach:.06,hold:.06,pose:{pos:[-3,-3.2,12.5],look:[-4.5,-6.4,0],mm:24,pf:.86,pr:-.85,pl:[1.2,0,-.15]},drift:[-.15,-.05,-.25],light:{blade:{from:[-23.93,32.93,14.84],to:[-3.1,-4.49,1.03],angle:.2,power:40,pen:.4},red:{at:[3.2,-7.4,-4.6],power:22,reach:6},haze:.1,env:2},stop:{blade:.6,red:.7,angle:1},trick:{loop:9,release:1,rare:5},pulseWidth:.04,sharp:[.4,1.25]},{id:"4",name:"THE STRAIN",move:"ride",approach:.06,hold:.05,pose:{pos:[1.97,-3.488,8.394],look:[3.985,-6.7,1.807],mm:100,roll:0,pf:.92,pl:[-.36,-.205,.132]},drift:[.01,0,-.02],light:{blade:{from:[2.543,-2,-8.958],to:[3.547,-7,1.394],angle:.09,power:6.8,pen:.9},red:{at:[5,-8.2,0],power:1.5,reach:6},haze:3.6,env:2},stop:{blade:1.25,red:1.6,angle:.85},trick:{loop:8,release:.6,rare:4},pulseWidth:.05,sharp:[.975,1.025],aperture:3,blurMul:1.4,lift:[.7,.5,.85]},{id:"5",name:"THE HEART",move:"track",approach:.07,hold:.06,pose:{pos:wo(N0,[0,2.9,9.6]),look:wo(N0,[1.5,1,0]),mm:28,pf:.6,pl:[-1.3,3.9,0],pp:[.6,1,2.2]},drift:[0,.05,.25],light:{blade:{from:wo(N0,[-10.4,24.8,-11.2]),to:wo(N0,[-.1,0,.3]),angle:.11,power:120,pen:.18},red:{at:wo(fo,[-.3,-.4,.2]),power:7,reach:6.8},haze:0,env:2},stop:{blade:.67,red:1.6,angle:1},trick:{loop:8,release:.9,rare:8},lightIn:.3,stopDelay:1.5,pulseWidth:.05,sharp:[.42,1.06]},{id:"6",name:"THE JAM",move:"spiral",approach:.05,hold:.06,pose:{pos:wo(fo,[4.977,3.433,2.874]),look:wo(fo,[0,-.2,.3]),mm:100,pf:.9,pr:-1,pl:[0,0,-.05]},drift:[.02,0,-.06],light:{blade:{from:wo(fo,[-5,10,-2]),to:wo(fo,[.1,-.22,.4]),angle:.105,power:256},red:{at:wo(fo,[.1,.3,.5]),power:.05,reach:2},haze:0,env:0},stop:{blade:.05,red:1.8,angle:1},trick:{loop:6,release:.5,rare:2},pulseWidth:.05,lightFrom:.5,lightIn:.62,sharp:[.77,1.06]},{id:"7",name:"THE TICK",move:"recoil",approach:.05,hold:.06,pose:{pos:Ci,look:Ws,mm:50,pf:.66,pl:[.047,0,-.163]},drift:[-.189,-.035,-.054],light:{blade:{from:[20,-2.17,-3.1],to:wo(Ws,[.6,0,.2]),angle:.3,power:16},red:{at:[11.27,-9.98,-9.4],power:1.5,reach:3},haze:.2,env:2},stop:{blade:.75,red:2.2,angle:1},trick:{loop:8,release:.8,rare:6},sharp:[.5,1.4],lift:[.8,.1,.8]},{id:"8",name:"THE SECOND ENDS",move:"wipe",approach:.06,hold:.08,rim:1,pose:{pos:[92,66,44],look:[-16,14,4],mm:33,pf:.8,pl:[12,-6,4]},drift:[-.8,-.6,-.6],light:{blade:{from:[50,170,70],to:[-8,-4,0],angle:.42,power:52},red:{at:[4,2,-4],power:0,reach:30},haze:.14,env:0},stop:{blade:1,red:1,angle:1},trick:{loop:10,release:1,rare:8},exposure:1.8}],kr=Ti.reduce((t,e)=>t+e.approach+e.hold,0),Te=(()=>{let t=0;return Ti.map(e=>{const n=t,o=n+e.approach/kr,s=o+e.hold/kr;return t=s,{...e,a0:n,h0:o,h1:s,focus:e.focus??Vc(e.pose.pos,e.pose.look)}})})();Te[Te.length-1].h1=1;function Fi(t,e,n){if(n){const i=Te[t+1]?.liftPre;return i?1+(i-1)*ie((e-.85)/.15):1}const o=Te[t]?.lift,s=Te[t]?.liftPre,a=o?o[3]??Math.min(.3,(o[2]-o[1])/2):1,r=o?1+o[0]*ie((e-o[1])/.04)*(1-ie((e-o[2]+a)/a)):1;return s?Math.max(r,1+(s-1)*(1-ie(e/.15))):r}const ko={cut:.2,lead:[.2,.76],trail:[.22,.84]},Ns=(t,e)=>-.12+(Math.PI/2+.37)*ie((t-e[0])/(e[1]-e[0])),Bn={settle:1,pulse:1.5,rare:10,pulseLen:1.6},vt=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),ie=t=>{const e=vt(t);return e*e*(3-2*e)};function H0(t){const e=vt(t);let n=Te.findIndex(r=>e<r.h1);n<0&&(n=Te.length-1);const o=Te[n],s=e>=o.h0,a=s?(e-o.h0)/(o.h1-o.h0):(e-o.a0)/(o.h0-o.a0);return{i:n,place:o,inHold:s,u:vt(a)}}function qc(t){let e=0,n=1/0;return Te.forEach((o,s)=>{const a=t<o.h0?o.h0-t:t>o.h1?t-o.h1:0;a<n&&(n=a,e=s)}),e}function Gc(t,e){const n=Te[t].trick.loop,o=Math.max(0,e-Bn.pulse)/n;return o-Math.floor(o)}const nr=Te.find(t=>t.id==="3"),_i=2270/1290,or=new C(...nr.pose.pos),Uc=new C(...nr.pose.look),O0=Uc.clone().sub(or).normalize(),x0=O0.clone().cross(new C(0,1,0)).normalize(),v0=x0.clone().cross(O0).normalize(),Ii=36/_i/2/nr.pose.mm,jc=Ii*_i,Jo=or;function Sn(t,e,n){return or.clone().addScaledVector(O0,n).addScaledVector(x0,t*n*jc).addScaledVector(v0,e*n*Ii)}const Bs=[Sn(-.3,-.46,10.4),Sn(-.06,0,11.2),Sn(.12,.42,12.2),Sn(.35,.68,12.8),Sn(.58,.8,13.2),Sn(.8,.68,13),Sn(.93,.36,12.4),Sn(.86,.06,11.8),Sn(.68,-.02,11.4)],$c=Sn(-.4,-.66,8.7),Yc=new C(3.5,-7,2),Pr=new C(.996,0,-.087).normalize(),qo=t=>new C(t[0],t[1],t[2]),rn=(t,e,n)=>t+(e-t)*n,E0=(t,e=3)=>1-Math.pow(1-vt(t),e),Ar=(t,e=2)=>Math.pow(vt(t),e),Zt=(t,e,n)=>vt((t-e)/(n-e));new ba(Oc.map(qo),!1,"centripetal");const Rr=new ba(Bs.slice(1),!1,"centripetal"),po={i:Te.findIndex(t=>t.id==="8"),shut:.62,land:.69};function Wo(t,e){const n=Te[t],o=n.drift,s=e-.5;return{pos:qo(n.pose.pos).add(new C(o[0]*s,o[1]*s,o[2]*s)),look:qo(n.pose.look),mm:n.pose.mm,roll:n.pose.roll??0,shake:0,cover:0,wipe:0,flip:0}}const So=(t,e,n)=>({pos:t.pos.clone().lerp(e.pos,n),look:t.look.clone().lerp(e.look,n),mm:rn(t.mm,e.mm,n),roll:rn(t.roll,e.roll,n),shake:rn(t.shake,e.shake,n),cover:0,wipe:0,flip:0});function Kc(t,e){const n=t>0?Wo(t-1,1):Wo(0,0),o=Wo(t,0);switch(Te[t].move){case"held":return o;case"slide":{const a={...So(n,o,ie(e))};return a.pos.y=rn(n.pos.y,o.pos.y,E0(e,4)),a.pos.x=rn(n.pos.x,o.pos.x,Math.pow(ie(e),1.4)),a}case"crane":{const a=ie(Zt(e,0,.5)),r=ie(Zt(e,.38,1)),i=11,c=new C(rn(n.pos.x,o.pos.x,r),rn(n.pos.y,i,a)+(o.pos.y-i)*r,rn(n.pos.z,o.pos.z,r)),l=qo(Do);l.y=n.look.y;const d=n.look.clone().lerp(l.lerp(qo(Do),.35),ie(Zt(e,.08,.55))).lerp(o.look,r);return{pos:c,look:d,mm:rn(n.mm,o.mm,Ar(Zt(e,.3,1),2)),roll:0,shake:0,cover:0,wipe:0,flip:0}}case"through":{const a=qo(Do),r=a.clone().add(new C(1.2,4.5,.8)),i=ie(e)*.55+(1-(1-e)**2.4)*.45,c=1-i,l=n.pos.clone().multiplyScalar(c*c).add(r.clone().multiplyScalar(2*c*i)).add(o.pos.clone().multiplyScalar(i*i)),d=n.look.clone().lerp(a,ie(Zt(e,0,.45))).lerp(o.look,ie(Zt(e,.45,1)));return{pos:l,look:d,mm:rn(n.mm,o.mm,ie(e)),roll:0,shake:0,cover:0,wipe:0,flip:0}}case"fall":{const a=ie(Zt(e,0,.4)),r=e<.8?.9*Ar(e/.8,1.6):.9+.1*E0(Zt(e,.8,1),2),i=new C(rn(n.pos.x,o.pos.x,a),rn(n.pos.y,o.pos.y,r),rn(n.pos.z,o.pos.z,a)),c=n.look.clone().sub(n.pos).normalize(),l=new C(0,-1,0),d=o.look.clone().sub(o.pos).normalize(),u=c.lerp(l,ie(Zt(e,0,.4))).lerp(d,ie(Zt(e,.55,1))).normalize(),f=i.clone().add(u.multiplyScalar(10));return{pos:i,look:f,mm:rn(n.mm,o.mm,ie(e)),roll:0,shake:e>.6&&e<.9?.15*Math.sin(Zt(e,.6,.9)*Math.PI):0,cover:0,wipe:0,flip:0}}case"ride":{const a=rn(.05,.6,ie(vt(e/.8))),r=Rr.getPointAt(a),i=Rr.getPointAt(Math.min(1,a+.08)),c=Jo.clone().sub(r).normalize().multiplyScalar(.7).add(new C(0,.8,0)),l={pos:r.clone().add(c),look:i.addScaledVector(c,.3),mm:rn(24,45,ie(e)),roll:Math.sin(e*Math.PI)*.3,shake:0,cover:0,wipe:0,flip:0};if(e<.15)return So(n,l,ie(e/.15));if(e>.5&&o.mm>60){const d=ie(Zt(e,.5,1)),u=o.look.clone().add(o.pos.clone().sub(o.look).multiplyScalar(1+2.5*(1-d))),f=So(l,o,d);return f.pos.copy(l.pos.clone().lerp(u,ie(Zt(e,.5,.62)))),f.look.lerp(o.look,ie(Zt(e,.5,.62))),f}return e>.72?So(l,o,ie(Zt(e,.72,1))):l}case"track":{const a={pos:new C(-4.5,-8.2,-5.2),look:new C(.6,-10,-15),mm:28,roll:0,shake:0},r={pos:new C(3.5,-8.4,-5.6),look:new C(4.8,-10.2,-14.6),mm:28,roll:0,shake:0};return e<.22?So(n,a,ie(e/.22)):e<.62?So(a,r,Zt(e,.22,.62)):So(r,o,ie(Zt(e,.62,1)))}case"spiral":{const a=qo(N0).add(new C(0,.14,0)),r=Math.atan2(n.pos.z-a.z,n.pos.x-a.x),i=Math.hypot(n.pos.x-a.x,n.pos.z-a.z),c=ie(Zt(e,0,.55)),l=r-c*Math.PI*2.1,d=rn(i,.75,Math.pow(c,.7)),u=new C(a.x+Math.cos(l)*d,rn(n.pos.y,a.y+.36,Math.pow(c,.8)),a.z+Math.sin(l)*d),f=new C(a.x+Math.cos(l-.9)*d*.55,a.y-.05,a.z+Math.sin(l-.9)*d*.55),p=ie(Zt(e,.3,.62)),v={pos:u,look:n.look.clone().lerp(f,ie(Zt(e,0,.3))).lerp(o.look,p),mm:rn(n.mm,24,c),roll:0,shake:0,cover:0,wipe:0,flip:0};if(e<.55)return v;const h=ie(Zt(e,.55,1)),m=So(v,o,h);return m.pos.y+=Math.sin(Math.PI*h)*1.1,{...m,look:f.clone().lerp(o.look,p)}}case"recoil":{const a=E0(Zt(e,.04,.86),3.2),r=qo(fo),i=n.pos.clone().sub(r).multiplyScalar(2.4).add(r),l={pos:n.pos.clone().multiplyScalar((1-a)*(1-a)).addScaledVector(i,2*a*(1-a)).addScaledVector(o.pos,a*a),look:r.lerp(o.look,ie(Zt(e,.04,.7))),mm:rn(n.mm,o.mm,E0(Zt(e,.04,.6),2)),roll:0,shake:0,cover:0,wipe:0,flip:0};return l.shake=e<.04?e/.04*.15:.7*Math.exp(-(e-.04)*14),l}case"wipe":{const a={...o,pos:o.pos.clone().lerp(o.look,.18)},r=e<ko.cut?Li(n,e):So(a,o,E0(Zt(e,ko.trail[0],1),3));return r.cover=0,r.wipe=e,r}}}function Li(t,e){return So(t,{...t,pos:t.pos.clone().lerp(qo(fo),-.15)},ie(e/ko.trail[1]))}function Xc(t){const e=po.i,n=Wo(e,0),o={...n,pos:n.pos.clone().lerp(n.look,.18)},s=So(o,n,E0(Zt(t,ko.trail[0],1),3));s.wipe=t;const a=Li(Wo(e-1,1),t);return a.wipe=t,{a,b:s}}function na(t){const e=H0(t.p);let n;if(t.reduced?n=Wo(e.i,.5):n=e.inHold?Wo(e.i,e.u):Kc(e.i,e.u),t.stop.station>=0&&!t.reduced){const o=ie(t.stop.t/Bn.settle)*(1-ie(t.stop.rel/.8));n.pos.lerp(n.look,.012*o)}if(e.i===po.i&&e.inHold&&t.stop.station===po.i&&t.stop.rare&&!t.reduced&&Te[po.i].trick.rare>0){const o=(t.stop.t-Bn.rare)/Te[po.i].trick.rare;if(o>=po.shut){const s=t.stop.rel>0?1-ie(t.stop.rel/Te[po.i].trick.release):1,a=vt((o-po.shut)/(po.land-po.shut)),r=a*a*s,i=Wo(0,0);n={...n,pos:n.pos.clone().lerp(i.pos,r),look:n.look.clone().lerp(i.look,r),mm:rn(n.mm,i.mm,r)};const c=t.stop.t-Bn.rare-po.land*Te[po.i].trick.rare;n.shake=c>=0&&c<.45?.5*Math.exp(-c*9):0}}return n}const Zc=new C,Ta=new C,Cr=new C;function Qc(t,e,n,o){t.filmGauge=36;const s=H0(n.p),a=h=>Te[Math.max(0,h)].pose.pf??.72,r=s.inHold||n.reduced?a(s.i):rn(a(s.i-1),a(s.i),ie(s.u));if(o){const h=g=>new C(...Te[Math.max(0,g)].pose.pl??[0,0,0]),m=s.inHold||n.reduced?h(s.i):h(s.i-1).lerp(h(s.i),ie(s.u)),M=g=>new C(...Te[Math.max(0,g)].pose.pp??[0,0,0]),x=s.inHold||n.reduced?M(s.i):M(s.i-1).lerp(M(s.i),ie(s.u));(m.lengthSq()>0||x.lengthSq()>0)&&(e={...e,look:e.look.clone().add(m),pos:e.pos.clone().add(x)})}if(o){const h=M=>Te[Math.max(0,M)].pose.pr??0,m=s.inHold||n.reduced?h(s.i):rn(h(s.i-1),h(s.i),ie(s.u));m!==0&&(e={...e,roll:e.roll+m})}t.setFocalLength(o?e.mm*r:e.mm);const i=Zc.copy(e.look).sub(e.pos).normalize(),c=ie((Math.abs(i.y)-.85)/.14);Cr.set(0,1,0).lerp(new C(0,0,-1),c).normalize(),Ta.crossVectors(i,Cr).normalize();const l=new C().crossVectors(Ta,i).normalize(),d=e.pos.distanceTo(e.look),u=n.reduced?0:(n.pointer.x-.5)*2,f=n.reduced?0:(n.pointer.y-.5)*2,p=d*.025,v=e.pos.clone().addScaledVector(Ta,u*p).addScaledVector(l,-f*p*.6);if(e.shake>0&&!n.reduced){const h=n.time*37;v.addScaledVector(Ta,Math.sin(h*1.3)*e.shake*d*.02).addScaledVector(l,Math.sin(h*1.7+1)*e.shake*d*.02)}return t.position.copy(v),t.up.copy(l),t.lookAt(e.look),t.rotateZ(e.roll-u*.012),t.near=Math.max(.004,d*.004),t.far=2e3,t.updateProjectionMatrix(),t.updateMatrixWorld(),d}const Jc=()=>({station:-1,t:0,rare:!0,rel:99});function et(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let n=e;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}class S0 extends je{constructor(e,n={}){super(e),this.isReflector=!0,this.type="Reflector",this.forceUpdate=!1,this.camera=new Qs;const o=this,s=n.color!==void 0?new Gt(n.color):new Gt(8355711),a=n.textureWidth||512,r=n.textureHeight||512,i=n.clipBias||0,c=n.shader||S0.ReflectorShader,l=n.multisample!==void 0?n.multisample:4,d=new Ma,u=new C,f=new C,p=new C,v=new se,h=new C(0,0,-1),m=new ln,M=new C,x=new C,g=new ln,w=new se,b=this.camera,S=new a0(a,r,{samples:l,type:c0}),P=new un({name:c.name!==void 0?c.name:"unspecified",uniforms:fi.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});P.uniforms.tDiffuse.value=S.texture,P.uniforms.color.value=s,P.uniforms.textureMatrix.value=w,this.material=P,this.onBeforeRender=function(z,_,R){if(f.setFromMatrixPosition(o.matrixWorld),p.setFromMatrixPosition(R.matrixWorld),v.extractRotation(o.matrixWorld),u.set(0,0,1),u.applyMatrix4(v),M.subVectors(f,p),M.dot(u)>0===!0&&this.forceUpdate===!1)return;M.reflect(u).negate(),M.add(f),v.extractRotation(R.matrixWorld),h.set(0,0,-1),h.applyMatrix4(v),h.add(p),x.subVectors(f,h),x.reflect(u).negate(),x.add(f),b.position.copy(M),b.up.set(0,1,0),b.up.applyMatrix4(v),b.up.reflect(u),b.lookAt(x),b.far=R.far,b.updateMatrixWorld(),b.projectionMatrix.copy(R.projectionMatrix),w.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),w.multiply(b.projectionMatrix),w.multiply(b.matrixWorldInverse),w.multiply(o.matrixWorld),d.setFromNormalAndCoplanarPoint(u,f),d.applyMatrix4(b.matrixWorldInverse),m.set(d.normal.x,d.normal.y,d.normal.z,d.constant);const y=b.projectionMatrix;g.x=(Math.sign(m.x)+y.elements[8])/y.elements[0],g.y=(Math.sign(m.y)+y.elements[9])/y.elements[5],g.z=-1,g.w=(1+y.elements[10])/y.elements[14],m.multiplyScalar(2/m.dot(g)),y.elements[2]=m.x,y.elements[6]=m.y,y.elements[10]=m.z+1-i,y.elements[14]=m.w,o.visible=!1;const A=z.getRenderTarget(),F=z.xr.enabled,T=z.shadowMap.autoUpdate;z.xr.enabled=!1,z.shadowMap.autoUpdate=!1,z.setRenderTarget(S),z.state.buffers.depth.setMask(!0),z.autoClear===!1&&z.clear(),z.render(_,b),z.xr.enabled=F,z.shadowMap.autoUpdate=T,z.setRenderTarget(A);const I=R.viewport;I!==void 0&&z.state.viewport(I),o.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return S},this.dispose=function(){S.dispose(),o.material.dispose()}}}S0.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
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

		}`};function Ei(t,e,n){const o=new Float32Array(e*e).map(()=>n()),s=new Float32Array(t*t);for(let a=0;a<t;a++)for(let r=0;r<t;r++){const i=r/t*e,c=a/t*e,l=Math.floor(i),d=Math.floor(c),u=i-l,f=c-d,p=u*u*(3-2*u),v=f*f*(3-2*f),h=(x,g)=>o[(g%e+e)%e*e+(x%e+e)%e],m=h(l,d)+(h(l+1,d)-h(l,d))*p,M=h(l,d+1)+(h(l+1,d+1)-h(l,d+1))*p;s[a*t+r]=m+(M-m)*v}return s}function Fa(t,e,n,o){const s=new Float32Array(t*t);let a=.5,r=0;for(let i=0;i<n;i++){const c=Ei(t,e<<i,o);for(let l=0;l<s.length;l++)s[l]+=c[l]*a;r+=a,a*=.5}for(let i=0;i<s.length;i++)s[i]/=r;return s}function fs(t,e){const n=new cs(e,t,t,Js,Es);return n.wrapS=n.wrapT=vc,n.magFilter=hi,n.minFilter=mi,n.generateMipmaps=!0,n.anisotropy=4,n.needsUpdate=!0,n}const oa=t=>{let e=1/0,n=-1/0;for(const o of t)e=Math.min(e,o),n=Math.max(n,o);return t.map(o=>(o-e)/(n-e||1))};let _a=null;function Yo(){if(_a)return _a;const t=et(90210),e=256,n=oa(Fa(e,16,4,t)),o=oa(Fa(e,8,4,t)),s=oa(Fa(e,4,3,t)),a=oa(Ei(e,128,t)),r=new Uint8Array(e*e*4);for(let m=0;m<e*e;m++)r[m*4]=n[m]*255,r[m*4+1]=o[m]*255,r[m*4+2]=s[m]*255,r[m*4+3]=a[m]*255;const i=512,c=new Float32Array(i*i),l=oa(Fa(i,6,3,t));for(let m=0;m<5200;m++){let M=t()*i,x=t()*i;for(let S=0;S<6&&l[Math.floor(x)%i*i+Math.floor(M)%i]<.55;S++)M=t()*i,x=t()*i;const g=1.2+t()*t()*5.5,w=.5+t()*.5,b=Math.ceil(g+1);for(let S=-b;S<=b;S++)for(let P=-b;P<=b;P++){const z=Math.hypot(P,S)/g;if(z>=1)continue;const _=((Math.floor(M)+P)%i+i)%i,R=((Math.floor(x)+S)%i+i)%i,k=w*(1-z*z);c[R*i+_]=Math.max(c[R*i+_],k)}}const d=new Uint8Array(i*i*4);for(let m=0;m<i*i;m++)d[m*4]=Math.min(1,c[m])*255,d[m*4+1]=l[m]*255,d[m*4+2]=0,d[m*4+3]=255;const u=512,f=new Float32Array(u*u),p=new Float32Array(u*u),v=(m,M,x,g)=>{for(let w=0;w<M;w++){const b=t()*u,S=t()*u,P=g+(t()-.5)*1.2,z=60+t()*300,_=x*(.5+t()),R=.4+t()*.6,k=Math.cos(P),y=Math.sin(P),A=Math.ceil(z*2);for(let F=0;F<A;F++){const T=F/2,I=Math.sin(Math.PI*T/z),Q=Math.sin(T/z*3+w)*4,X=b+k*T-y*Q,E=S+y*T+k*Q;for(let N=-2;N<=2;N++)for(let $=-2;$<=2;$++){const q=Math.floor(X)+$,D=Math.floor(E)+N,V=Math.abs((q+.5-X)*-y+(D+.5-E)*k),O=Math.max(0,1-V/_)*I*R,j=(D%u+u)%u*u+(q%u+u)%u;m[j]=Math.max(m[j],O)}}}};v(f,70,.9,.3),v(p,22,1.4,1.9);const h=new Uint8Array(u*u*4);for(let m=0;m<u*u;m++)h[m*4]=Math.min(1,f[m])*255,h[m*4+1]=Math.min(1,p[m])*255,h[m*4+2]=0,h[m*4+3]=255;return _a={noise:fs(e,r),pits:fs(i,d),scratch:fs(u,h)},_a}const Zn={centre:{value:new C},radius:{value:-1},width:{value:4},gain:{value:0}};function Co(t){t.uniforms.uPulseC=Zn.centre,t.uniforms.uPulseR=Zn.radius,t.uniforms.uPulseW=Zn.width,t.uniforms.uPulseG=Zn.gain,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
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
`))}function el(t){return t.onBeforeCompile=e=>Co(e),t.customProgramCacheKey=()=>"ss-pulse",t}const Z0={value:1080},tl=`
attribute vec4 aThin;
uniform float uPxH;
varying float vThinF;`,nl=`
vThinF = 1.0;
if (dot(aThin.xyz, aThin.xyz) > 0.5) {
  vec4 mvT = modelViewMatrix * vec4(transformed, 1.0);
  float halfMin = max(-mvT.z, 1e-4) / (projectionMatrix[1][1] * uPxH * length(modelMatrix[0].xyz));
  vThinF = clamp(aThin.w / halfMin, 0.0, 1.0);
  transformed += aThin.xyz * max(halfMin - aThin.w, 0.0);
}`;function ar(t){t.uniforms.uPxH=Z0,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${tl}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${nl}`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying float vThinF;`).replace("#include <opaque_fragment>",`outgoingLight *= vThinF;
#include <opaque_fragment>`)}const ol={polished:0,grained:1,striped:2,sunray:3,turned:4,brushed:5,blackened:6},al=`
attribute float aCav;
attribute float aEdge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;
uniform float uObjScale;`,sl=`
vCav = aCav;
vEdge = aEdge;
vOP = position * uObjScale;
vON = normal;
#ifdef USE_INSTANCING
vOP += instanceMatrix[3].xyz * 0.731;
#endif`,rl=`
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
}`,il=`
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
float ssH = hF * uBump * (1.0 - scaleM) - pitH - scr * 0.0003 * (1.0 - scaleM);`,cl="{ vec3 vv = normalize(vViewPosition); float fr = smoothstep(0.72, 0.97, 1.0 - abs(dot(normal, vv))); totalEmissiveRadiance += vec3(uRim.w * fr * smoothstep(0.0, 0.5, dot(normal, uRim.xyz)) * (1.0 - 0.8 * scaleM) * (1.0 - pitM)); }",ll="totalEmissiveRadiance += vec3(uLine.x * smoothstep(0.3, 0.85, vEdge) * smoothstep(0.25, 0.7, vON.y) * step(uLine.y, rr) * (1.0 - chip) * (1.0 - pitM) * (0.75 + 0.5 * nzf.r));";function an(t){const e=Yo(),n=et((t.seed??1)*7331+17),o=new Gn({color:16777215,metalness:1,roughness:.3,envMapIntensity:t.envMap??1.15,ior:1.5}),s={tNz:{value:e.noise},tPit:{value:e.pits},tScr:{value:e.scratch},uSeed:{value:new C(n()*40,n()*40,n()*40)},uWear:{value:t.wear??.6},uBump:{value:t.bump??1},uDir:{value:t.stripeDir??.5},uObjScale:{value:t.objScale??1},uTone:{value:t.tone??.62},uRS2:{value:new bt(0,t.direct??1)},uAge:{value:t.age??.6},uTurn:{value:new C(...t.turn??[.22,.035,1])},uTwist:t.twist??{value:0},uTwistR:{value:t.twistR??1},uRim:t.rim??{value:new ln},uLine:t.lineU??{value:new bt(...t.line??[0,0])}},a=t.tier==="low",r=t.twist?`float twA = uTwist * (1.0 - clamp(length(transformed.xz) / uTwistR, 0.0, 1.0));
transformed.xz = mat2(cos(twA), sin(twA), -sin(twA), cos(twA)) * transformed.xz;
`:"";return o.onBeforeCompile=i=>{Object.assign(i.uniforms,s),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${al}
uniform float uTwist;
uniform float uTwistR;`).replace("#include <begin_vertex>",`#include <begin_vertex>
${sl}
${r}`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#define SS_FIN ${ol[t.finish]}
${a?`#define SS_LOW
`:""}#include <common>
uniform vec4 uRim;
uniform vec2 uLine;
${rl}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${t.rim?cl:""}
${t.line?ll:""}`).replace("#include <color_fragment>",`#include <color_fragment>
${il}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = clamp(ssRough, 0.04, 1.0);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = ssMetal;`).replace("#include <aomap_fragment>",`reflectedLight.directSpecular *= uRS2.y;
reflectedLight.directDiffuse *= uRS2.y;
#include <aomap_fragment>`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = bumpN(-vViewPosition, normal, vec2(dFdx(ssH), dFdy(ssH)), faceDirection);`),ar(i),Co(i)},o.customProgramCacheKey=()=>`ss-steel-${t.finish}-${a?"l":"h"}${t.twist?"-tw":""}${t.rim?"-rim":""}${t.line?"-ln":""}`,Object.assign(o,{ss:s})}const ul=`
uniform vec3 uCamO;
uniform vec3 uCrackP;
uniform vec3 uCrackN;
uniform vec3 uNode;
uniform vec3 uHalf;
uniform float uGlow;
uniform float uHot;
uniform sampler2D tNz;
varying vec3 vOP;`,dl=`
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
totalEmissiveRadiance += glowC;`;function pl(t){const e=Yo(),n=new Gn({color:new Gt().setRGB(.0035,0,2e-4),metalness:0,roughness:.02,ior:1.76,envMapIntensity:4.5,specularIntensity:1,emissive:0,flatShading:!1}),o={uCamO:{value:new C},uCrackP:{value:t.crackP??new C},uCrackN:{value:(t.crackN??new C(.3,.2,.93)).normalize()},uNode:{value:t.node??new C},uHalf:{value:t.half},uGlow:{value:t.glow??1},uHot:{value:t.hot??1},tNz:{value:e.noise}};n.onBeforeCompile=r=>{Object.assign(r.uniforms,o),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${ul}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${dl}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(glowC.r * 3.0, 0.0, 1.0);`),Co(r)},n.customProgramCacheKey=()=>"ss-ruby";const s=new se;return Object.assign(n,{ss:o,aim:(r,i)=>{r.updateMatrixWorld(),s.copy(r.matrixWorld).invert(),o.uCamO.value.setFromMatrixPosition(i.matrixWorld).applyMatrix4(s)}})}function jo(t={}){const e=new Gn({color:new Gt().setRGB(.01,.01,.01),metalness:0,roughness:.12,clearcoat:1,clearcoatRoughness:.075,ior:1.47,specularIntensity:0,envMapIntensity:t.env??6});return e.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <opaque_fragment>",`vec3 ssEx = max(outgoingLight - 0.32, 0.0);
outgoingLight = min(outgoingLight, vec3(0.32)) + ssEx / (1.0 + ssEx * 3.0);
#include <opaque_fragment>`),ar(n),Co(n)},e.customProgramCacheKey=()=>"ss-oil",e}const jt=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),Lt=(t,e,n)=>t+(e-t)*n,Ro=t=>{const e=jt(t);return e*e*(3-2*e)},$e=Math.PI*2,lt=(t,e,n=3)=>Math.max(n,Math.round(t*(e===2?1:e===1?.55:.3)));class hn{p=[];n=[];c=[];e=[];i=[];th=[];thin(e,n,o,s,a){for(;this.th.length<(e+1)*4;)this.th.push(0);this.th.splice(e*4,4,n,o,s,a)}v(e,n,o,s,a,r,i=0,c=0){return this.p.push(e,n,o),this.n.push(s,a,r),this.c.push(jt(i)),this.e.push(jt(c)),this.p.length/3-1}tri(e,n,o){const s=this.p,a=e*3,r=n*3,i=o*3,c=s[r]-s[a],l=s[r+1]-s[a+1],d=s[r+2]-s[a+2],u=s[i]-s[a],f=s[i+1]-s[a+1],p=s[i+2]-s[a+2];Math.hypot(l*p-d*f,d*u-c*p,c*f-l*u)<2e-12||this.i.push(e,n,o)}quad(e,n,o,s){this.tri(e,n,o),this.tri(e,o,s)}fixWinding(){const e=this.p,n=this.n,o=this.i;for(let s=0;s<o.length;s+=3){const a=o[s]*3,r=o[s+1]*3,i=o[s+2]*3,c=e[r]-e[a],l=e[r+1]-e[a+1],d=e[r+2]-e[a+2],u=e[i]-e[a],f=e[i+1]-e[a+1],p=e[i+2]-e[a+2],v=l*p-d*f,h=d*u-c*p,m=c*f-l*u;if(v*(n[a]+n[r]+n[i])+h*(n[a+1]+n[r+1]+n[i+1])+m*(n[a+2]+n[r+2]+n[i+2])<0){const x=o[s+1];o[s+1]=o[s+2],o[s+2]=x}}}geometry(){this.fixWinding();const e=new In;if(e.setAttribute("position",new rt(this.p,3)),e.setAttribute("normal",new rt(this.n,3)),e.setAttribute("aCav",new rt(this.c,1)),e.setAttribute("aEdge",new rt(this.e,1)),this.th.length){for(;this.th.length<this.p.length/3*4;)this.th.push(0);e.setAttribute("aThin",new rt(this.th,4))}return e.setIndex(this.i),e}}function fl(t){let e=0;for(let n=0;n<t.length;n++){const o=t[n],s=t[(n+1)%t.length];e+=o[0]*s[1]-s[0]*o[1]}return e/2}const as=(t,e)=>fl(t)>0===e?t:t.slice().reverse();function ss(t,e=1e-5){const n=[];for(const o of t){const s=n[n.length-1];(!s||Math.hypot(o[0]-s[0],o[1]-s[1])>e)&&n.push(o)}for(;n.length>2&&Math.hypot(n[0][0]-n[n.length-1][0],n[0][1]-n[n.length-1][1])<=e;)n.pop();return n}function xa(t,e=2,n){let o=t,s=n??t.map(()=>!1);for(let a=0;a<e;a++){const r=[],i=[];for(let c=0;c<o.length;c++){const l=o[c],d=o[(c+1)%o.length];s[c]?(r.push(l),i.push(!0)):(r.push([l[0]*.75+d[0]*.25,l[1]*.75+d[1]*.25]),i.push(!1)),s[(c+1)%o.length]||(r.push([l[0]*.25+d[0]*.75,l[1]*.25+d[1]*.75]),i.push(!1))}o=r,s=i}return o}const $0=(t,e,n=0,o=0,s=0)=>Array.from({length:e},(a,r)=>[n+Math.cos(s+r/e*$e)*t,o+Math.sin(s+r/e*$e)*t]);function hl(t,e){const n=t.length,o=new Array(n).fill(0),s=new Array(n).fill(0);for(let a=0;a<n;a++){const r=t[(a-1+n)%n],i=t[a],c=t[(a+1)%n],l=Math.atan2(i[1]-r[1],i[0]-r[0]);let u=Math.atan2(c[1]-i[1],c[0]-i[0])-l;for(;u>Math.PI;)u-=$e;for(;u<-Math.PI;)u+=$e;o[a]=u}for(let a=0;a<n;a++){let r=0;for(let i=-e;i<=e;i++)r+=o[(a+i+n)%n];s[a]=r}return{raw:o,win:s}}function xn(t,e,n){const o=new hn,s=n.segs??2,a=n.t/2,r=[{...t,pts:as(ss(t.pts),!0)},...e.map(u=>({...u,pts:as(ss(u.pts),!1)}))],i=[],c=[],l=[];for(const u of r){const f=u.pts,p=f.length,v=Math.min(u.bevel??n.bevel,a*.95),h=u.sink??0,m=hl(f,Math.max(1,Math.round(p/400))),M=[];for(let T=0;T<p;T++){const I=f[T],Q=f[(T+1)%p],X=Q[0]-I[0],E=Q[1]-I[1],N=Math.hypot(X,E)||1;M.push([E/N,-X/N])}const x=[],g=[],w=[],b=Math.cos((u.sharp??35)*Math.PI/180);for(let T=0;T<p;T++){const I=M[(T-1+p)%p],Q=M[T];let X=I[0]+Q[0],E=I[1]+Q[1];const N=Math.hypot(X,E)||1;X/=N,E/=N,x.push([X,E]);const $=Math.max(.35,X*Q[0]+E*Q[1]);g.push(1/$),w.push(I[0]*Q[0]+I[1]*Q[1]<b)}const S=f.map((T,I)=>jt(-m.win[I]/1.6)+(u.cav??0)+(u.cavAt?.[I]??0)),P=f.map((T,I)=>jt(m.win[I]/1.2)+(u.edgeAt?.[I]??0)),z=[],_=h>0?h:v;for(let T=0;T<=s;T++){const I=T/s*Math.PI/2;if(h>0){const Q=T/s;z.push({inset:_*(1-Q),y:a-_*.55*Q,nu:.72,ns:.69,edge:T===0?.5:.15,cavK:.4+.6*Q})}else z.push({inset:v-v*Math.sin(I),y:a-v+v*Math.cos(I),nu:Math.cos(I),ns:Math.sin(I),edge:T===0?.35:T===s?.45:.9,cavK:.55})}const R=z[s].y,k=u.bottom!==!1,y=k?v:0,A=[];for(let T=s;T>=0;T--){const I=T/s*Math.PI/2;if(A.push(k?{inset:y-y*Math.sin(I),y:-a+y-y*Math.cos(I),nu:-Math.cos(I),ns:Math.sin(I),edge:T===0?.3:T===s?.4:.8,cavK:.55}:{inset:0,y:-a,nu:0,ns:1,edge:.3,cavK:.55}),!k)break}const F=[...z,{inset:0,y:(R+A[0].y)/2,nu:0,ns:1,edge:.2,cavK:.7},...A];for(let T=0;T<p;T++){const I=(T+1)%p,Q=[];for(const X of F){const E=[];for(const N of[T,I]){const $=w[N]?M[T]:x[N],q=f[N][0]-x[N][0]*X.inset*g[N],D=f[N][1]-x[N][1]*X.inset*g[N],V=$[0]*X.ns,O=$[1]*X.ns,j=X.nu,ae=Math.hypot(V,j,O)||1;E.push(o.v(q,X.y,D,V/ae,j/ae,O/ae,S[N]*X.cavK,X.edge*(.45+.8*P[N])+(w[N]&&P[N]>0?.25:0)))}Q.push(E)}for(let X=0;X<Q.length-1;X++)o.quad(Q[X][0],Q[X+1][0],Q[X+1][1],Q[X][1])}i.push(f.map((T,I)=>[T[0]-x[I][0]*z[0].inset*g[I],T[1]-x[I][1]*z[0].inset*g[I]])),c.push(f.map((T,I)=>[T[0]-x[I][0]*A[A.length-1].inset*g[I],T[1]-x[I][1]*A[A.length-1].inset*g[I]])),l.push(S.map(T=>T*.12+(h>0?.35:0)))}const d=u=>u.map(f=>new bt(f[0],f[1]));for(const u of[!0,!1]){if(u&&n.top===!1||!u&&n.bottomFace===!1)continue;const f=u?i:c,p=d(f[0]),v=f.slice(1).map(d),h=vi.triangulateShape(p,v),m=o.p.length/3,M=f.flat(),x=l.flat(),g=u?a:-a;M.forEach((w,b)=>o.v(w[0],g,w[1],0,u?1:-1,0,x[b],0));for(const w of h)u?o.tri(m+w[0],m+w[2],m+w[1]):o.tri(m+w[0],m+w[1],m+w[2])}return o.geometry()}function kt(t,e,n={}){const o=new hn,s=t.length,a=n.a0??0,r=n.a1??$e,i=Math.abs(r-a-$e)<1e-6,c=[];for(let u=0;u<s-1;u++){const f=t[u+1].r-t[u].r,p=t[u+1].y-t[u].y,v=Math.hypot(f,p)||1;c.push([p/v,-f/v])}const l=t.map((u,f)=>{if(f===0||f===s-1)return 0;const p=Math.atan2(t[f].y-t[f-1].y,t[f].r-t[f-1].r);let h=Math.atan2(t[f+1].y-t[f].y,t[f+1].r-t[f].r)-p;for(;h>Math.PI;)h-=$e;for(;h<-Math.PI;)h+=$e;return h}),d=i?e:e+1;for(let u=0;u<s-1;u++){const f=[u,u+1].map(w=>{const S=t[w].smooth&&w>0&&w<s-1?(()=>{const _=c[w-1],R=c[w],k=_[0]+R[0],y=_[1]+R[1],A=Math.hypot(k,y)||1;return[k/A,y/A]})():c[u],P=jt(-l[w]/1.2)*.9+(t[w].cav??0),z=jt(l[w]/1)+(t[w].edge??0);return{k:w,N:S,cav:P,edge:z}}),p=t[u],v=t[u+1],h=Math.hypot(v.r-p.r,v.y-p.y),m=h>.2?.05/h:0,M=m?[0,m,1-m,1]:[0,1],x=o.p.length/3,g=M.length;for(let w=0;w<d;w++){const b=a+(r-a)*w/e,S=Math.cos(b),P=Math.sin(b);for(const z of M){const _=Lt(p.r,v.r,z),R=Lt(p.y,v.y,z),k=Lt(f[0].N[0],f[1].N[0],z),y=Lt(f[0].N[1],f[1].N[1],z),A=Math.hypot(k,y)||1,F=z===0?f[0]:z===1?f[1]:null;o.v(_*S,R,_*P,k/A*S,y/A,k/A*P,F?F.cav:0,F?F.edge:0)}}for(let w=0;w<e;w++){const b=i?(w+1)%e:w+1;for(let S=0;S+1<g;S++){const P=x+w*g+S,z=x+b*g+S,_=Lt(p.r,v.r,M[S]),R=Lt(p.r,v.r,M[S+1]);_>1e-7&&o.tri(P,z+1,z),R>1e-7&&o.tri(P,P+1,z+1)}}}return o.geometry()}const Tr=(t,e,n,o,s)=>{const a=n-t,r=o-e,i=Math.hypot(a,r)||1;return[{r:t,y:e},{r:t+a/i*s,y:e+r/i*s}]};function ml(t,e,n,o,s={}){const a=new hn,r=t.length,i=s.cs??2,c=[];[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([p,v],h)=>{const m=[0,Math.PI/2,Math.PI,Math.PI*1.5][h];for(let M=0;M<=i;M++){const x=m+M/i*Math.PI/2;c.push({x:p,y:v,nx:Math.cos(x),ny:Math.sin(x),edge:M===0||M===i?.5:1})}});const d=c.length,u=new C,f=new C;for(let p=0;p<r;p++){const v=p/(r-1);u.copy(t[Math.min(r-1,p+1)]).sub(t[Math.max(0,p-1)]).normalize();const h=e[p];f.crossVectors(u,h).normalize();const m=n(v)/2,M=o(v)/2,x=Math.min(m,M)*(s.corner??.45),g=s.cav?s.cav(v):0;for(const w of c){const b=w.x*(m-x)+w.nx*x,S=w.y*(M-x)+w.ny*x,P=t[p],z=h.x*w.nx+f.x*w.ny,_=h.y*w.nx+f.y*w.ny,R=h.z*w.nx+f.z*w.ny,k=a.v(P.x+h.x*b+f.x*S,P.y+h.y*b+f.y*S,P.z+h.z*b+f.z*S,z,_,R,g,w.edge);if(M<m){const y=Math.sign(S)||1;a.thin(k,f.x*y,f.y*y,f.z*y,M)}}}for(let p=0;p<r-1;p++)for(let v=0;v<d;v++){const h=(v+1)%d,m=p*d+v,M=p*d+h,x=(p+1)*d+h,g=(p+1)*d+v;a.quad(m,M,x,g)}if(s.caps!==!1)for(const p of[0,r-1]){const v=new C().copy(t[p===0?1:r-1]).sub(t[p===0?0:r-2]).normalize().multiplyScalar(p===0?-1:1),h=a.p.length/3;for(let m=0;m<d;m++){const M=p*d+m,x=a.v(a.p[M*3],a.p[M*3+1],a.p[M*3+2],v.x,v.y,v.z,.3,.8);a.th.length>M*4&&a.thin(x,a.th[M*4],a.th[M*4+1],a.th[M*4+2],a.th[M*4+3])}for(let m=1;m<d-1;m++)p===0?a.tri(h,h+m+1,h+m):a.tri(h,h+m,h+m+1)}return a.geometry()}function vl(t,e,n,o,s){const a=t.getAttribute("position"),r=t.getAttribute("normal"),i=t.getAttribute("aEdge"),c=t.getAttribute("aCav"),l=Math.hypot(n[0],n[1]),d=n[0]/l,u=n[1]/l,f=u,p=-d,v=new C(d,0,u),h=new Wt,m=new C,M=new C(e[0],0,e[1]);for(let x=0;x<a.count;x++){const g=(a.getX(x)-e[0])*f+(a.getZ(x)-e[1])*p;if(g<=-s)continue;const w=Ro((g+s)/(2*s));h.setFromAxisAngle(v,o*w),m.set(a.getX(x),a.getY(x),a.getZ(x)).sub(M).applyQuaternion(h).add(M),a.setXYZ(x,m.x,m.y,m.z),m.set(r.getX(x),r.getY(x),r.getZ(x)).applyQuaternion(h),r.setXYZ(x,m.x,m.y,m.z);const b=1-Math.abs(w*2-1);i.setX(x,jt(i.getX(x)+b*.35)),c.setX(x,jt(c.getX(x)+b*.25))}return a.needsUpdate=r.needsUpdate=i.needsUpdate=c.needsUpdate=!0,t}function _t(t){const e=t.some(o=>o.getAttribute("aThin")),n=Ai(t.map(o=>{if(e&&!o.getAttribute("aThin")&&o.setAttribute("aThin",new rt(new Float32Array(o.getAttribute("position").count*4),4)),!o.index){const s=Array.from({length:o.getAttribute("position").count},(a,r)=>r);o.setIndex(s)}for(const s of["aCav","aEdge"])o.getAttribute(s)||o.setAttribute(s,new rt(new Float32Array(o.getAttribute("position").count),1));for(const s of Object.keys(o.attributes))["position","normal","aCav","aEdge","aThin"].includes(s)||o.deleteAttribute(s);return o}),!1);if(!n)throw new Error("merge failed");return n}function cn(t,e=0,n=0,o=0,s=0,a=0,r=0,i=1){const c=new se().compose(new C(e,n,o),new Wt().setFromEuler(new Nn(s,a,r)),new C(i,i,i));return t.applyMatrix4(c)}function gl(t){t.scale(1,-1,1);const e=t.index.array;for(let n=0;n<e.length;n+=3){const o=e[n+1];e[n+1]=e[n+2],e[n+2]=o}return t.index.needsUpdate=!0,t}const Q0=(t=[],e=[])=>({pieces:t,inst:e}),io=(t,e,n=1,o)=>({geo:t,finish:e,seed:n,at:o});function Di(t,e=new C(0,1,0),n=0,o=1){const s=new Wt().setFromUnitVectors(new C(0,1,0),e.clone().normalize());return s.multiply(new Wt().setFromAxisAngle(new C(0,1,0),n)),new se().compose(t,s,new C(o,o,o))}function Wi(t){const e=t.teeth,n=t.r,o=t.detail,s=et(t.seed*7919+13),a=[],r=[],i=[],c=[],l=(z,_,R,k,y=!1)=>{a.push([Math.cos(_)*z,Math.sin(_)*z]),r.push(R),i.push(k),c.push(y)},d=new Set;for(let z=0;z<(t.sheared??0);z++)d.add(Math.floor(e*(.08+.22*z+s()*.06))%e);const u=$e/e;if(t.profile==="club"){const z=n*.2,_=n-z,R=[[-.42,0,1,0],[-.27,.1,.7,0],[-.1,.35,.2,.1],[0,.6,0,.3],[-.02,.72,0,.5],[-.06,.8,0,1],[.2,.9,0,.7],[.5,1,0,1],[.45,.86,0,.5],[.31,.6,.1,.1],[.2,.33,.3,0],[.18,.1,.8,0],[.27,0,1,0]],k=lt(3,o,1);for(let y=0;y<e;y++){const A=y*u,F=d.has(y);for(let X=0;X<R.length;X++){const[E,N,$,q]=R[X];let D=N;if(F&&N>.3&&(D=.3+s()*.08),l(_+D*z,A+E*z/(_+D*z),$,F&&N>.3?1:q,X===5||X===7),X<R.length-1&&X!==5&&X!==6&&k>1){const[V,O]=R[X+1];for(let j=1;j<k;j++){const ae=j/k,ye=Lt(D,F&&O>.3?.32:O,ae);l(_+ye*z,A+Lt(E,V,ae)*z/(_+ye*z),$*(1-ae),0)}}}const T=A+.27*z/_,I=A+u-.42*z/_,Q=lt(4,o,1);for(let X=1;X<Q;X++)l(_,Lt(T,I,X/Q),1,0)}return{pts:a,cav:r,edge:i,keep:c,root:_}}if(t.profile==="ratchet"){const z=Math.min(n*.1,$e*n/e*.55),_=n-z;for(let R=0;R<e;R++){const k=R*u;l(_,k,1,0),l(_+z*.5,k+u*.01,.3,.1),l(n,k+u*.03,0,1,!0);for(let y=1;y<=lt(4,o,2);y++){const A=y/lt(4,o,2);l(Lt(n,_,Math.pow(A,1.25)),k+u*Lt(.03,.96,A),A*A*.8,(1-A)*.4)}}return{pts:a,cav:r,edge:i,keep:c,root:_}}const f=t.profile==="leaf"?2*n/(e+1.6):t.profile==="barrel"?2*n/(e+2.2):2*n/(e+2.6),p=t.profile==="leaf"?.8*f:t.profile==="barrel"?1.1*f:1.3*f,v=t.profile==="leaf"?1.9*f:t.profile==="barrel"?1.45*f:1.65*f,h=(t.profile==="leaf"?.21:t.profile==="barrel"?.26:.235)*Math.PI*f,m=n-p,M=m-v,x=Math.min(.42*f,(Math.PI*M/e-h)*.8),g=(p*p+h*h)/(2*h),w=lt(6,o,3),b=lt(3,o,2),S=lt(3,o,1),P=(z,_,R,k)=>{const y=[];for(let A=0;A<=b;A++){const F=A/b*Math.PI/2;y.push([M+x-x*Math.cos(F),h+x-x*Math.sin(F),1-.8*A/b,0,!1])}if(y.push([Lt(M+x,m,.5),h*1.01,.12,.05,!1]),R){const A=m-f*(.2+s()*.5);y.push([A,h*1,0,1,!0]);const F=.4+s()*.5;y.push([A+f*.12*F,h*.3,0,1,!0])}else for(let A=0;A<w;A++){const F=A/w*p,T=t.profile==="leaf"?h*Math.sqrt(Math.max(0,1-(F/p)**2)):h-g+Math.sqrt(Math.max(0,g*g-F*F));y.push([m+F,Math.max(T,h*.06),0,.25+.5*A/w,!1])}k||y.reverse();for(const[A,F,T,I,Q]of y)l(A,_+z*F/A,T,I,Q)};for(let z=0;z<e;z++){const _=z*u,R=d.has(z);P(-1,_,R,!0),R||l(n,_,0,1,!1),P(1,_,R,!1);const k=_+(h+x)/M,y=_+u-(h+x)/M;for(let A=1;A<S+1;A++)l(M,Lt(k,y,A/(S+1)),1,0)}return{pts:a,cav:r,edge:i,keep:c,root:M}}function xl(t,e,n,o,s,a,r){const i=et(a*31+7),c=[],l=o*.12,d=o*.065,u=i()*$e,f=x=>Lt(l,d,jt((x-n)/(e-n)))/2/x,p=lt(7,s,4),v=lt(16,s,6),h=(x,g,w,b)=>{const S=[];for(let P=0;P<=p;P++){const z=Lt(w,b,P/p);S.push([Math.cos(x+g*f(z))*z,Math.sin(x+g*f(z))*z])}return S},m=(x,g,w)=>{const b=[],S=Math.max(3,Math.round(v*Math.abs(w-g)/1.5));for(let P=1;P<S;P++){const z=Lt(g,w,P/S);b.push([Math.cos(z)*x,Math.sin(z)*x])}return b},M=r?1:-1;for(let x=0;x<t;x++){if(x===M)continue;const g=u+x*$e/t,w=u+(x+1)*$e/t;let b;if(x+1===M){const S=w,P=u+(x+2)*$e/t,z=e-(e-n)*(.28+i()*.1),_=n+(e-n)*(.22+i()*.08),R=(k,y,A)=>{const F=[];for(let T=0;T<=4;T++){const I=T/4,Q=k+A*(I*2-1)*f(y),X=y+(i()-.5)*(e-n)*.07;F.push([Math.cos(Q)*X,Math.sin(Q)*X])}return F};b=[...h(g,1,n,e),...m(e,g+f(e),S-f(e)),...h(S,-1,e,z),...R(S,z,1),...h(S,1,z,e),...m(e,S+f(e),P-f(e)),...h(P,-1,e,n),...m(n,P-f(n),S+f(n)).reverse().reverse(),...h(S,1,n,_),...R(S,_,-1),...h(S,-1,_,n),...m(n,S-f(n),g+f(n))],b.length,c.push({pts:xa(b,s===2?3:2),cav:.15}),x++;continue}b=[...h(g,1,n,e),...m(e,g+f(e),w-f(e)),...h(w,-1,e,n),...m(n,w-f(n),g+f(n))],c.push({pts:xa(b,s===2?3:2),cav:.15})}return c}function $o(t){const e=t.detail??2,n=t.seed??1,o=t.r,s=t.profile??"train",a=t.t??o*2/25,r=Wi({teeth:t.teeth,r:o,profile:s,detail:e,seed:n,sheared:t.sheared}),i={pts:xa(r.pts,e===0?0:1,r.keep),cavAt:[],edgeAt:[],sharp:50};if(e!==0){const v=r.pts;let h=0;i.cavAt=i.pts.map(m=>{for(;h<v.length-1&&Math.hypot(v[h+1][0]-m[0],v[h+1][1]-m[1])<Math.hypot(v[h][0]-m[0],v[h][1]-m[1]);)h++;return r.cav[h]}),h=0,i.edgeAt=i.pts.map(m=>{for(;h<v.length-1&&Math.hypot(v[h+1][0]-m[0],v[h+1][1]-m[1])<Math.hypot(v[h][0]-m[0],v[h][1]-m[1]);)h++;return r.edge[h]})}else i.cavAt=r.cav,i.edgeAt=r.edge;const c=t.bevel??Math.min(a*.16,o*.006),l=[],d=(t.hub??.17)*o,u=t.hole??o*.05;if(t.inner)l.push({pts:$0(t.inner,lt(96,e,24)),bevel:c*1.5});else{const v=r.root-(t.rim??.1)*o;(t.spokes??0)>0&&v>d*1.5&&l.push(...xl(t.spokes,v,d,o,e,n,!!t.snapped)),l.push({pts:$0(u,lt(32,e,12)),bevel:c*.8,cav:.5})}const f=[xn(i,l,{t:a,bevel:c,segs:e===0?1:2})];if(t.boss!==!1&&!t.inner){const v=a*.55,h=d*.72,m=Math.min(v*.35,h*.1),M=lt(48,e,16),x=[{r:u,y:a/2-.001},{r:h+m*.5,y:a/2-.001,cav:.7},{r:h,y:a/2+m*.6},{r:h,y:a/2+v-m},{r:h-m,y:a/2+v,edge:.4},{r:u+m*.6,y:a/2+v},{r:u,y:a/2+v-m*.6,edge:.3},{r:u,y:a/2}];f.push(kt(x,M)),f.push(gl(kt(x,M)))}let p=_t(f);if(t.fold){const v=et(n*101+3),h=v()*$e,m=t.foldAt??.28;p=vl(p,[Math.cos(h)*o*m,Math.sin(h)*o*m],[-Math.sin(h),Math.cos(h)],t.fold,o*.07)}return p}function ha(t){const e=t.detail??2,n=t.length,o=t.ra,s=o*2/8,a=lt(40,e,12),r=t.pinionR??o*2.6,i=t.pinionH??n*.28,c=t.pinionAt??n*.2,l=t.seatAt??n*.66,d=n*.07,u=[{r:0,y:0},{r:s*.55,y:s*.12,smooth:!0,edge:.6},{r:s*.9,y:s*.5,smooth:!0,edge:.5},{r:s,y:s},{r:s,y:d},{r:s*1.25,y:d+s*.3,cav:.4},{r:o*.8,y:d+(o*.8-s)*1.2},{r:o,y:d+(o-s)*1.5},{r:o,y:c-.02,cav:.3},{r:o*1.15,y:c+.01,cav:.5},{r:o*1.15,y:c+i-.01,cav:.5},{r:o,y:c+i+.02,cav:.3},{r:o,y:l-o*.5},{r:o*1.55,y:l-o*.25},{r:o*1.55,y:l,edge:.5},{r:o*.92,y:l,cav:.9},{r:o*.92,y:l+o*1.2},{r:o*.85,y:l+o*1.6},{r:o*.85,y:n-d-(o*.85-s)*1.5},{r:s*1.25,y:n-d-s*.3,cav:.3},{r:s,y:n-d},{r:s,y:n-s},{r:s*.9,y:n-s*.5,smooth:!0,edge:.5},{r:s*.55,y:n-s*.12,smooth:!0,edge:.6},{r:0,y:n}],f=[kt(u,a)],p=$o({teeth:t.leaves??8,r,profile:"leaf",detail:e,seed:t.seed??3,t:i,boss:!1,hole:o*.5,bevel:Math.min(r*.045,.03)});return cn(p,0,c+i/2,0),f.push(p),{geo:_t(f),seat:l}}const wl={large:{rh:.9,hh:.55,L:2.2,pitch:.2,thread:!0},medium:{rh:.55,hh:.36,L:1.4,pitch:.14,thread:!0},small:{rh:.22,hh:.16,L:.55,pitch:.08,thread:!1},timing:{rh:.115,hh:.12,L:.3,pitch:.035,thread:!0}};function yl(t,e,n,o){const s=new hn,a=t*.8,r=lt(28,o,10),i=lt(8,o,4),c=Math.max(4,Math.round(e/n*i)),l=(f,p)=>{const v=((p/n-f/$e)%1+1)%1,h=v<.12?v/.12:v<.3?1:v<.42?1-(v-.3)/.12:0,m=jt((p+e)/(n*1.5));return a+(t-a)*h*m},d=[];for(let f=0;f<=c;f++){const p=-e+e*f/c,v=[];for(let h=0;h<r;h++){const m=h/r*$e,M=l(m,p),x=.01,g=(l(m,p+x)-l(m,p-x))/(2*x),w=new C(Math.cos(m),-g,Math.sin(m)).normalize(),b=(M-a)/(t-a);v.push(s.v(Math.cos(m)*M,p,Math.sin(m)*M,w.x,w.y,w.z,(1-b)*.8,b>.95?.6:0))}d.push(v)}for(let f=0;f<c;f++)for(let p=0;p<r;p++){const v=(p+1)%r;s.quad(d[f][p],d[f][v],d[f+1][v],d[f+1][p])}const u=s.v(0,-e-a*.3,0,0,-1,0,.3,.3);for(let f=0;f<r;f++)s.tri(d[0][f],u,d[0][(f+1)%r]);return s.geometry()}function b0(t){const e=wl[t.size],n=t.detail??2,o=et((t.seed??5)*977+1),s=e.rh,a=e.hh,r=s*2/8,i=Math.min(s*2/4,a*.6),c=s*.09,l=lt(48,n,16),d=[];for(const m of[1,-1]){const M=Math.acos(r/2/s),x=[];for(let b=0;b<=l/2;b++){const S=-M+2*M*b/(l/2);x.push([Math.cos(S)*s,Math.sin(S)*s])}const g=lt(8,n,3);for(let b=1;b<g;b++){const S=1-b/g,P=t.abused&&o()<.5?o()*r*.35:0;x.push([r/2-P,(S*2-1)*Math.sin(M)*s])}const w=xn({pts:x.map(b=>[b[0]*m,b[1]*m]),sharp:30},[],{t:a,bevel:c,segs:n===0?1:2,bottomFace:!1});if(cn(w,0,a/2,0),t.abused){const b=w.getAttribute("position"),S=w.getAttribute("aEdge");for(let P=0;P<b.count;P++){const z=Math.abs(b.getX(P)),_=b.getY(P);if(z<r/2+c*2.2&&_>a-c*1.2){const R=b.getZ(P),k=(.5+.5*Math.sin(R*41+m*3))*c*.9;b.setY(P,_+k),S.setX(P,1)}}}d.push(w)}const u=xn({pts:$0(s,l)},[],{t:a-i,bevel:c,segs:n===0?1:2,bottomFace:!1});cn(u,0,(a-i)/2,0);const f=u.getAttribute("aCav"),p=u.getAttribute("position");for(let m=0;m<f.count;m++)p.getY(m)>a-i-1e-4&&f.setX(m,.9);d.push(u);const v=s*.48;e.thread&&n>0?d.push(yl(v,e.L,e.pitch,n)):d.push(kt([{r:0,y:-e.L-v*.3},{r:v*.8,y:-e.L},{r:v*.85,y:0}],lt(16,n,8)));const h=_t(d);return t.slotAngle&&h.rotateY(t.slotAngle),h}function Ni(t){const{h:e,r:n}=t,o=n*.08,s=t.detail??2,a=[{r:0,y:0},{r:n*.55,y:0},{r:n*.55,y:e*.03},{r:n*1-o,y:e*.03,cav:.6},{r:n,y:e*.03+o},{r:n,y:e*.1-o},{r:n-o,y:e*.1,edge:.3},{r:n*.78,y:e*.11,cav:.6},{r:n*.7,y:e*.2,smooth:!0},{r:n*.66,y:e*.44,cav:.4},{r:n*.82,y:e*.47},{r:n*.95,y:e*.49,smooth:!0,edge:.5},{r:n*.95,y:e*.51,smooth:!0,edge:.5},{r:n*.82,y:e*.53},{r:n*.66,y:e*.56,cav:.4},{r:n*.7,y:e*.8,smooth:!0},{r:n*.78,y:e*.89,cav:.6},{r:n-o,y:e*.9},{r:n,y:e*.9+o},{r:n,y:e*.97-o},{r:n-o,y:e*.97,edge:.3},{r:n*.55,y:e*.97,cav:.6},{r:n*.55,y:e-o},{r:n*.5,y:e,edge:.3},{r:n*.18,y:e,cav:.8},{r:n*.18,y:e-n*.6},{r:0,y:e-n*.6}];return kt(a,lt(48,s,16))}function bl(t){const{r:e,hole:n,h:o}=t;return kt([{r:e,y:-o},{r:e,y:-.004},{r:e*.96,y:.012,edge:.8},{r:n*1.6,y:.006,edge:.4},{r:n*1.05,y:-o*.25,cav:.9},{r:n,y:-o*.3,cav:1},{r:n,y:-o}],lt(40,t.detail??2,14))}function Ml(t){const{L:e,ra:n}=t,o=t.detail??2,s=n/4,a=-e*.45,r=[{r:0,y:a},{r:s*.6,y:a+s*.1,smooth:!0},{r:s,y:a+s*.6},{r:s,y:a+e*.06},{r:n*.7,y:a+e*.1},{r:n*.7,y:a+e*.2},{r:n,y:a+e*.22},{r:n,y:-e*.04},{r:n*1.9,y:-e*.03},{r:n*1.9,y:0,edge:.5},{r:n*.9,y:0,cav:.9},{r:n*.9,y:e*.12},{r:n*.8,y:e*.2},{r:n*.8,y:e*.4},{r:n*.7,y:e*.42},{r:s,y:e*.5},{r:s,y:e*.55-s*.6},{r:s*.6,y:e*.55-s*.1,smooth:!0},{r:0,y:e*.55}],i=[kt(r,lt(32,o,12))],c=n*4.2,l=a+e*.14,d=e*.035,u=xn({pts:(()=>{const p=[],v=lt(40,o,14);for(let h=0;h<v;h++){const m=h/v*$e,M=Math.abs((m+Math.PI)%$e-Math.PI)<.35?.8:1;p.push([Math.cos(m)*c*M,Math.sin(m)*c*M])}return p})()},[{pts:$0(n*.7,16)}],{t:d,bevel:d*.2});cn(u,0,l,0),i.push(u);const f=kt([{r:0,y:0},{r:n*.45,y:0},{r:n*.45,y:e*.07},{r:n*.3,y:e*.075},{r:0,y:e*.075}],10);return cn(f,c*.75,l-e*.075-d/2+.002,0),i.push(f),_t(i)}function Sl(t){const{L:e,ra:n}=t,o=t.detail??2,s=n*.35,a=[kt([{r:0,y:0},{r:s,y:0},{r:s,y:e*.1},{r:n,y:e*.14},{r:n,y:e*.3},{r:n*1.7,y:e*.31},{r:n*1.7,y:e*.62,edge:.3},{r:n,y:e*.63,cav:.7},{r:n,y:e*.78},{r:s*1.3,y:e*.8},{r:s*1.3,y:e},{r:0,y:e}],lt(32,o,12))],r=xn({pts:[[-n*.7,-n*.7],[n*.7,-n*.7],[n*.7,n*.7],[-n*.7,n*.7]],sharp:30},[],{t:e*.14,bevel:n*.08});cn(r,0,e*.87,0),a.push(r);const i=xn({pts:[[0,-n*.25],[n*2.05,-n*.2],[n*2.05,n*.2],[0,n*.25]],sharp:30},[],{t:n*.5,bevel:n*.06});return cn(i,0,e*.46,0,0,0,0),a.push(i),_t(a)}const ja=0,zl=1,kl=new C,Fr=new gc,hs=new Ma,_r=new C,Ia=new xc;class Pl{constructor(){this.tolerance=-1,this.faces=[],this.newFaces=[],this.assigned=new Ir,this.unassigned=new Ir,this.vertices=[]}setFromPoints(e){if(e.length>=4){this.makeEmpty();for(let n=0,o=e.length;n<o;n++)this.vertices.push(new Al(e[n]));this._compute()}return this}setFromObject(e){const n=[];return e.updateMatrixWorld(!0),e.traverse(function(o){const s=o.geometry;if(s!==void 0){const a=s.attributes.position;if(a!==void 0)for(let r=0,i=a.count;r<i;r++){const c=new C;c.fromBufferAttribute(a,r).applyMatrix4(o.matrixWorld),n.push(c)}}}),this.setFromPoints(n)}containsPoint(e){const n=this.faces;for(let o=0,s=n.length;o<s;o++)if(n[o].distanceToPoint(e)>this.tolerance)return!1;return!0}intersectRay(e,n){const o=this.faces;let s=-1/0,a=1/0;for(let r=0,i=o.length;r<i;r++){const c=o[r],l=c.distanceToPoint(e.origin),d=c.normal.dot(e.direction);if(l>0&&d>=0)return null;const u=d!==0?-l/d:0;if(!(u<=0)&&(d>0?a=Math.min(u,a):s=Math.max(u,s),s>a))return null}return s!==-1/0?e.at(s,n):e.at(a,n),n}intersectsRay(e){return this.intersectRay(e,kl)!==null}makeEmpty(){return this.faces=[],this.vertices=[],this}_addVertexToFace(e,n){return e.face=n,n.outside===null?this.assigned.append(e):this.assigned.insertBefore(n.outside,e),n.outside=e,this}_removeVertexFromFace(e,n){return e===n.outside&&(e.next!==null&&e.next.face===n?n.outside=e.next:n.outside=null),this.assigned.remove(e),this}_removeAllVerticesFromFace(e){if(e.outside!==null){const n=e.outside;let o=e.outside;for(;o.next!==null&&o.next.face===e;)o=o.next;return this.assigned.removeSubList(n,o),n.prev=o.next=null,e.outside=null,n}}_deleteFaceVertices(e,n){const o=this._removeAllVerticesFromFace(e);if(o!==void 0)if(n===void 0)this.unassigned.appendChain(o);else{let s=o;do{const a=s.next;n.distanceToPoint(s.point)>this.tolerance?this._addVertexToFace(s,n):this.unassigned.append(s),s=a}while(s!==null)}return this}_resolveUnassignedPoints(e){if(this.unassigned.isEmpty()===!1){let n=this.unassigned.first();do{const o=n.next;let s=this.tolerance,a=null;for(let r=0;r<e.length;r++){const i=e[r];if(i.mark===ja){const c=i.distanceToPoint(n.point);if(c>s&&(s=c,a=i),s>1e3*this.tolerance)break}}a!==null&&this._addVertexToFace(n,a),n=o}while(n!==null)}return this}_computeExtremes(){const e=new C,n=new C,o=[],s=[];for(let a=0;a<3;a++)o[a]=s[a]=this.vertices[0];e.copy(this.vertices[0].point),n.copy(this.vertices[0].point);for(let a=0,r=this.vertices.length;a<r;a++){const i=this.vertices[a],c=i.point;for(let l=0;l<3;l++)c.getComponent(l)<e.getComponent(l)&&(e.setComponent(l,c.getComponent(l)),o[l]=i);for(let l=0;l<3;l++)c.getComponent(l)>n.getComponent(l)&&(n.setComponent(l,c.getComponent(l)),s[l]=i)}return this.tolerance=3*Number.EPSILON*(Math.max(Math.abs(e.x),Math.abs(n.x))+Math.max(Math.abs(e.y),Math.abs(n.y))+Math.max(Math.abs(e.z),Math.abs(n.z))),{min:o,max:s}}_computeInitialHull(){const e=this.vertices,n=this._computeExtremes(),o=n.min,s=n.max;let a=0,r=0;for(let f=0;f<3;f++){const p=s[f].point.getComponent(f)-o[f].point.getComponent(f);p>a&&(a=p,r=f)}const i=o[r],c=s[r];let l,d;a=0,Fr.set(i.point,c.point);for(let f=0,p=this.vertices.length;f<p;f++){const v=e[f];if(v!==i&&v!==c){Fr.closestPointToPoint(v.point,!0,_r);const h=_r.distanceToSquared(v.point);h>a&&(a=h,l=v)}}a=-1,hs.setFromCoplanarPoints(i.point,c.point,l.point);for(let f=0,p=this.vertices.length;f<p;f++){const v=e[f];if(v!==i&&v!==c&&v!==l){const h=Math.abs(hs.distanceToPoint(v.point));h>a&&(a=h,d=v)}}const u=[];if(hs.distanceToPoint(d.point)<0){u.push(zo.create(i,c,l),zo.create(d,c,i),zo.create(d,l,c),zo.create(d,i,l));for(let f=0;f<3;f++){const p=(f+1)%3;u[f+1].getEdge(2).setTwin(u[0].getEdge(p)),u[f+1].getEdge(1).setTwin(u[p+1].getEdge(0))}}else{u.push(zo.create(i,l,c),zo.create(d,i,c),zo.create(d,c,l),zo.create(d,l,i));for(let f=0;f<3;f++){const p=(f+1)%3;u[f+1].getEdge(2).setTwin(u[0].getEdge((3-f)%3)),u[f+1].getEdge(0).setTwin(u[p+1].getEdge(1))}}for(let f=0;f<4;f++)this.faces.push(u[f]);for(let f=0,p=e.length;f<p;f++){const v=e[f];if(v!==i&&v!==c&&v!==l&&v!==d){a=this.tolerance;let h=null;for(let m=0;m<4;m++){const M=this.faces[m].distanceToPoint(v.point);M>a&&(a=M,h=this.faces[m])}h!==null&&this._addVertexToFace(v,h)}}return this}_reindexFaces(){const e=[];for(let n=0;n<this.faces.length;n++){const o=this.faces[n];o.mark===ja&&e.push(o)}return this.faces=e,this}_nextVertexToAdd(){if(this.assigned.isEmpty()===!1){let e,n=0;const o=this.assigned.first().face;let s=o.outside;do{const a=o.distanceToPoint(s.point);a>n&&(n=a,e=s),s=s.next}while(s!==null&&s.face===o);return e}}_computeHorizon(e,n,o,s){this._deleteFaceVertices(o),o.mark=zl;let a;n===null?a=n=o.getEdge(0):a=n.next;do{const r=a.twin,i=r.face;i.mark===ja&&(i.distanceToPoint(e)>this.tolerance?this._computeHorizon(e,r,i,s):s.push(a)),a=a.next}while(a!==n);return this}_addAdjoiningFace(e,n){const o=zo.create(e,n.tail(),n.head());return this.faces.push(o),o.getEdge(-1).setTwin(n.twin),o.getEdge(0)}_addNewFaces(e,n){this.newFaces=[];let o=null,s=null;for(let a=0;a<n.length;a++){const r=n[a],i=this._addAdjoiningFace(e,r);o===null?o=i:i.next.setTwin(s),this.newFaces.push(i.face),s=i}return o.next.setTwin(s),this}_addVertexToHull(e){const n=[];return this.unassigned.clear(),this._removeVertexFromFace(e,e.face),this._computeHorizon(e.point,null,e.face,n),this._addNewFaces(e,n),this._resolveUnassignedPoints(this.newFaces),this}_cleanup(){return this.assigned.clear(),this.unassigned.clear(),this.newFaces=[],this}_compute(){let e;for(this._computeInitialHull();(e=this._nextVertexToAdd())!==void 0;)this._addVertexToHull(e);return this._reindexFaces(),this._cleanup(),this}}class zo{constructor(){this.normal=new C,this.midpoint=new C,this.area=0,this.constant=0,this.outside=null,this.mark=ja,this.edge=null}static create(e,n,o){const s=new zo,a=new ms(e,s),r=new ms(n,s),i=new ms(o,s);return a.next=i.prev=r,r.next=a.prev=i,i.next=r.prev=a,s.edge=a,s.compute()}getEdge(e){let n=this.edge;for(;e>0;)n=n.next,e--;for(;e<0;)n=n.prev,e++;return n}compute(){const e=this.edge.tail(),n=this.edge.head(),o=this.edge.next.head();return Ia.set(e.point,n.point,o.point),Ia.getNormal(this.normal),Ia.getMidpoint(this.midpoint),this.area=Ia.getArea(),this.constant=this.normal.dot(this.midpoint),this}distanceToPoint(e){return this.normal.dot(e)-this.constant}}class ms{constructor(e,n){this.vertex=e,this.prev=null,this.next=null,this.twin=null,this.face=n}head(){return this.vertex}tail(){return this.prev?this.prev.vertex:null}length(){const e=this.head(),n=this.tail();return n!==null?n.point.distanceTo(e.point):-1}lengthSquared(){const e=this.head(),n=this.tail();return n!==null?n.point.distanceToSquared(e.point):-1}setTwin(e){return this.twin=e,e.twin=this,this}}class Al{constructor(e){this.point=e,this.prev=null,this.next=null,this.face=null}}class Ir{constructor(){this.head=null,this.tail=null}first(){return this.head}last(){return this.tail}clear(){return this.head=this.tail=null,this}insertBefore(e,n){return n.prev=e.prev,n.next=e,n.prev===null?this.head=n:n.prev.next=n,e.prev=n,this}insertAfter(e,n){return n.prev=e,n.next=e.next,n.next===null?this.tail=n:n.next.prev=n,e.next=n,this}append(e){return this.head===null?this.head=e:this.tail.next=e,e.prev=this.tail,e.next=null,this.tail=e,this}appendChain(e){for(this.head===null?this.head=e:this.tail.next=e,e.prev=this.tail;e.next!==null;)e=e.next;return this.tail=e,this}remove(e){return e.prev===null?this.head=e.next:e.prev.next=e.next,e.next===null?this.tail=e.prev:e.next.prev=e.prev,this}removeSubList(e,n){return e.prev===null?this.head=n.next:e.prev.next=n.next,n.next===null?this.tail=e.prev:n.next.prev=e.prev,this}isEmpty(){return this.head===null}}class Rl extends In{constructor(e=[]){super();const n=[],o=[],a=new Pl().setFromPoints(e).faces;for(let r=0;r<a.length;r++){const i=a[r];let c=i.edge;do{const l=c.head().point;n.push(l.x,l.y,l.z),o.push(i.normal.x,i.normal.y,i.normal.z),c=c.next}while(c!==i.edge)}this.setAttribute("position",new rt(n,3)),this.setAttribute("normal",new rt(o,3))}}const Cl=(t,e)=>{let n=!1;for(let o=0,s=e.length-1;o<e.length;s=o++){const a=e[o],r=e[s];a[1]>t[1]!=r[1]>t[1]&&t[0]<(r[0]-a[0])*(t[1]-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n},Tl=(t,e)=>{let n=1/0;for(let o=0;o<e.length;o++){const s=e[o],a=e[(o+1)%e.length],r=a[0]-s[0],i=a[1]-s[1],c=jt(((t[0]-s[0])*r+(t[1]-s[1])*i)/(r*r+i*i||1));n=Math.min(n,Math.hypot(t[0]-s[0]-c*r,t[1]-s[1]-c*i))}return n};function mo(t){const e=t.detail??2,n=t.t,o=t.bevel??n*.14,s={pts:t.round===0?t.outline:xa(t.outline,t.round??2),sharp:40},a=[],r=[];for(const i of t.holes??[]){const c=i.bush?i.r*2.2:i.r;if(a.push({pts:$0(c,lt(Math.max(16,Math.round(c*60)),e,12),i.at[0],i.at[1]),bevel:o*.7,sink:i.sink,cav:i.cav??.45}),i.bush){const l=bl({r:c*1.001,hole:i.r,h:n*.95,detail:e});cn(l,i.at[0],n/2,i.at[1]),r.push(l)}}if(t.pierce){const i=et(t.pierce.seed*613+5),c=t.pierce.size,l=t.pierce.margin??c*1.4,d=s.pts.map(p=>p[0]),u=s.pts.map(p=>p[1]),f=(t.holes??[]).map(p=>[p.at,(p.bush?p.r*2.2:p.r)+(p.sink??0)]);for(let p=Math.min(...u),v=0;p<Math.max(...u);p+=c*1.9,v++)for(let h=Math.min(...d)+v%2*c;h<Math.max(...d);h+=c*2.1){const m=[h+(i()-.5)*c*.4,p+(i()-.5)*c*.4];if(!Cl(m,s.pts)||Tl(m,s.pts)<l||f.some(([b,S])=>Math.hypot(b[0]-m[0],b[1]-m[1])<S+c*1.3))continue;const M=i()*$e,x=.55+i()*.5,g=lt(14,e,8),w=[];for(let b=0;b<g;b++){const S=b/g*$e,P=1+.45*Math.max(0,Math.cos(S))**3,z=Math.cos(S)*c*.5*P,_=Math.sin(S)*c*.5*x;w.push([m[0]+z*Math.cos(M)-_*Math.sin(M),m[1]+z*Math.sin(M)+_*Math.cos(M)])}a.push({pts:w,bevel:Math.min(o*.6,c*.12),cav:.3}),f.push([m,c*.8])}}return{geo:xn(s,a,{t:n,bevel:o,segs:e===0?1:2}),bushes:r.length?_t(r):null}}function wa(t,e,n,o,s={}){const a=et(o*43+9),r=b0({size:t,detail:s.detail,seed:o}),i=e.map(l=>Di(new C(l[0],n,l[1]),void 0,a()*$e)),c=[{geo:r,finish:s.finish??"polished",seed:o,mats:i}];if(s.abused?.length){const l=b0({size:t,detail:s.detail,seed:o+1,abused:!0});c[0].mats=i.filter((d,u)=>!s.abused.includes(u)),c.push({geo:l,finish:s.finish??"polished",seed:o+1,mats:i.filter((d,u)=>s.abused.includes(u))})}return c}function us(t,e,n,o=10){const s=[],a=[],r=c=>t(jt(c));for(let c=0;c<=n;c++){const l=c/n,d=r(l-.002),u=r(l+.002),f=u[0]-d[0],p=u[1]-d[1],v=Math.hypot(f,p)||1,h=-p/v,m=f/v,M=r(l),x=e(l);s.push([M[0]+h*x,M[1]+m*x]),a.push([M[0]-h*x,M[1]-m*x])}const i=(c,l,d)=>{const u=r(c),f=e(c),p=Math.atan2(l[1]-u[1],l[0]-u[0]),v=[];for(let h=1;h<o;h++){const m=p+d*Math.PI*h/o;v.push([u[0]+Math.cos(m)*f,u[1]+Math.sin(m)*f])}return v};return[...s,...i(1,s[n],-1),...a.reverse(),...i(0,a[a.length-1],-1)]}function sr(t){const e=t.detail??2,n=t.seed??4,o=t.length??14,s=t.width??2.6,a=t.t??.7,r=v=>[Lt(-o/2,o/2,v),Math.sin(v*Math.PI)*o*.12-v*o*.04],c=us(r,v=>s/2*(1.25-.55*v+.35*Math.exp(-(((v-.08)/.1)**2))+.25*Math.exp(-(((v-.62)/.09)**2))),lt(60,e,20),lt(14,e,6)),l=(v,h=0)=>{const m=r(v);return[m[0],m[1]+h]},d=[l(.06,-.15),l(.3,.2),l(.97)],u=[...d.map(v=>({at:v,r:.5,sink:.32})),{at:l(.62),r:.14,bush:!0},{at:l(.45),r:.1,bush:!0}],f=mo({outline:c,holes:u,t:a,bevel:.09,detail:e,round:1}),p=wa("medium",d,a/2-.19,n,{detail:e,abused:[1]});return Q0([io(f.geo,"striped",n),...f.bushes?[io(f.bushes,"polished",n+1)]:[]],p)}function Fl(t){const e=t.detail??2,n=t.seed??6,o=t.balanceR,s=o*t.table,a=t.t,r=t.h??1.6,i=s*.42,c=-4.318,l=s*.62,d=lt(48,e,20),u=[],f=Math.asin(i/s);for(let T=0;T<=d;T++){const I=-(Math.PI-f)+2*(Math.PI-f)*T/d;u.push([Math.cos(I)*s,Math.sin(I)*s])}const p=T=>{const I=[];for(let Q=1;Q<8;Q++){const X=Q/8;I.push([Lt(-s*Math.cos(f),c+l*.2,X),T*Lt(i,l,X*X)*(1-.18*Math.sin(X*Math.PI))])}return I};u.push(...p(1));for(let T=0;T<=10;T++){const I=Math.PI/2+Math.PI*T/10;u.push([c+Math.cos(I)*l*.5-l*0,Math.sin(I)*l])}u.push(...p(-1).reverse());const v=[c+l*.15,0],h=mo({outline:u,holes:[{at:v,r:.5,sink:.32},{at:[0,0],r:s*.2}],t:a,bevel:.1,detail:e,round:2});cn(h.geo,0,-a/2,0);const m=[h.geo],M=mo({outline:(()=>{const T=[];for(let I=0;I<24;I++){const Q=I/24*$e;T.push([c+Math.cos(Q)*l*.78,Math.sin(Q)*l*.9])}return T})(),holes:[{at:v,r:.5}],t:r-a,bevel:.08,detail:e,round:0});cn(M.geo,0,-a-(r-a)/2,0),m.push(M.geo);for(const T of[-1,1]){const I=kt([{r:0,y:0},{r:.16,y:0},{r:.16,y:.55},{r:.12,y:.62},{r:0,y:.62}],14);I.scale(1,-1,1);const Q=I.index.array;for(let X=0;X<Q.length;X+=3){const E=Q[X+1];Q[X+1]=Q[X+2],Q[X+2]=E}cn(I,c-l*.25,-r,T*l*.55),m.push(I)}const x=[],g=.35,w=1.45,b=21;for(let T=0;T<b;T++){const I=Lt(g,w,T/(b-1)),Q=T===0||T===b-1||T===(b-1)/2,X=s*.93,E=s*(Q?.74:.82),N=.022,$=Math.cos(I),q=Math.sin(I),D=xn({pts:[[E*$-N*-q,E*q-N*$],[X*$-N*-q,X*q-N*$],[X*$+N*-q,X*q+N*$],[E*$+N*-q,E*q+N*$]],cav:.6,sharp:30},[],{t:.025,bevel:.006,segs:1});cn(D,0,.0125-.006,0),x.push(D)}m.push(_t(x));const S=_t(m),P=mo({outline:(()=>{const T=[];for(let I=0;I<32;I++){const Q=I/32*$e;T.push([Math.cos(Q)*s*.38*(1+.45*Math.abs(Math.cos(Q))**4),Math.sin(Q)*s*.3])}return T})(),holes:[{at:[-s*.38,0],r:.2,sink:.12},{at:[s*.38,0],r:.2,sink:.12}],t:.16,bevel:.04,detail:e,round:0});cn(P.geo,0,.08+.19,0);const z=us(T=>[Lt(-1.666-.15,s*1.02,T),0],T=>T<.2?.2-T*.35:Lt(.13,.045,(T-.2)/.8),lt(30,e,12),8),_=mo({outline:z,holes:[{at:[0,0],r:s*.25}],t:.14,bevel:.035,detail:e,round:1}),R=kt([{r:s*.25,y:-.07},{r:s*.34,y:-.07},{r:s*.34,y:.07,edge:.5},{r:s*.25,y:.07}],lt(40,e,14)),k=[];for(const T of[-1,1]){const I=kt([{r:0,y:-r*.75},{r:.05,y:-r*.74},{r:.05,y:0},{r:0,y:0}],10);cn(I,-1.666,-.07,T*.07),k.push(I)}const y=_t([_.geo,R,...k]);y.rotateY(-0),cn(y,0,.07,0);const A=wa("small",[[-s*.38,0],[s*.38,0]],.27+.08-.1,n+3,{detail:e}),F=wa("large",[v],-.32+.05,n+5,{detail:e});return Q0([io(S,"striped",n),io(P.geo,"polished",n+1),io(y,"polished",n+2)],[...A,...F])}function rr(t){const e=t.detail??2,n=t.seed??8,o=.26,s=4.2,a=[],r=[],i=(b,S=!1)=>{a.push(b),r.push(S)};i([s+.02,-.1],!0),i([s-.32,-.1],!0),i([s-.38,-.05]),i([s-.39,0]),i([s-.38,.05]),i([s-.32,.1],!0),i([s+.02,.1],!0),i([s+.07,.17],!0),i([s-.1,.25]),i([s-.45,.22]),i([s-.85,.12]);for(let b=0;b<=6;b++){const S=Lt(s-1.1,.7,b/6);i([S,Lt(.085,.15,b/6)])}const c=(b,S)=>{const P=[Math.cos(b),Math.sin(b)],z=[-P[1],P[0]],_=.15,R=.085,k=.45,y=(A,F)=>[P[0]*A+z[0]*F,P[1]*A+z[1]*F];return i(y(.45,-_)),i(y(S*.6,-_*.92)),i(y(S,-_),!0),i(y(S,-R),!0),i(y(S-k,-R),!0),i(y(S-k,R),!0),i(y(S,R),!0),i(y(S+.02,_),!0),i(y(S*.6,_*.92)),i(y(.45,_)),{u:P,v:z,La:S,sd:k,sh:R}};i([.42,.24]);const l=c(Math.PI*.6,1.55);i([-.42,.12]),i([-.46,0]),i([-.42,-.12]),c(Math.PI*1.4,1.55),i([.42,-.24]);for(let b=0;b<=6;b++){const S=Lt(.7,s-1.1,b/6);i([S,-Lt(.15,.085,b/6)])}i([s-.85,-.12]),i([s-.45,-.22]),i([s-.1,-.25]),i([s+.07,-.17],!0);const d=xa(a,e===0?1:2,r),f=[mo({outline:d,holes:[{at:[0,0],r:.12}],t:o,bevel:.05,detail:e,round:0}).geo],p=kt([{r:0,y:-.62},{r:.045,y:-.6},{r:.045,y:0},{r:0,y:0}],10);cn(p,s-.55,-o/2+.01,0),f.push(p);const v=kt([{r:0,y:-1.2},{r:.05,y:-1.18},{r:.05,y:-.9},{r:.12,y:-.85},{r:.12,y:.55},{r:.05,y:.6},{r:.05,y:.9},{r:0,y:.92}],16);f.push(v);const h=_t(f),m=l.sd+.45,M=l.sh*.97,x=ir({L:m,w:M,h:o*1.25}).geo,g=new se().makeRotationY(-Math.atan2(l.u[1],l.u[0])).multiply(new se().makeTranslation(l.La-l.sd+m/2,0,0)),w=[io(h,"brushed",n)];return t.stone!==!1&&w.push(io(x,"ruby",n,g)),Q0(w)}function ir(t){const e=t.L,n=t.w,o=t.h/2,s=t.slant??.16,a=t.b??Math.min(.014,n*.16),r=[[-e/2,-n],[e/2,-n],[e/2-s,n],[-e/2,n]],i=[],c=1,l=[.11*e/.9,.06,.1*o/.1625];let d=new C(0,1,0),u=new C;for(let v=0;v<4;v++){const h=r[v],m=r[(v+3)%4],M=r[(v+1)%4],x=new bt(m[0]-h[0],m[1]-h[1]).normalize(),g=new bt(M[0]-h[0],M[1]-h[1]).normalize(),w=(b,S,P)=>new C(h[0]+x.x*b+g.x*S,P,h[1]+x.y*b+g.y*S);for(const b of[1,-1]){if(v===c&&b===1){const S=w(l[0],0,o-a*.5),P=w(0,l[1],o-a*.5),z=w(0,0,o-l[2]);i.push(S,P,z,w(l[0]+a,a,o),w(a,l[1]+a,o),w(a,0,o-l[2]-a*.3),w(0,a,o-l[2]-a*.3)),d=new C().subVectors(P,S).cross(new C().subVectors(z,S)).normalize(),d.dot(new C(h[0],0,h[1]).add(new C(0,o,0)))<0&&d.negate(),u=S.clone().add(P).add(z).multiplyScalar(1/3);continue}i.push(w(a,a,b*o),w(a,0,b*(o-a)),w(0,a,b*(o-a)))}}if(t.side===1){for(const v of i)v.z=-v.z;d.z=-d.z,u.z=-u.z}const f=new Rl(i),p=f.getAttribute("position").count;return f.setAttribute("aCav",new rt(new Float32Array(p),1)),f.setAttribute("aEdge",new rt(new Float32Array(p),1)),f.computeBoundingBox(),{geo:f,chip:{at:u,n:d},half:new C(e/2,o,n),corner:new C(e/2,o,(t.side??-1)*n)}}function Bi(t){const e=t.r??2.6;return $o({teeth:15,r:e,profile:"club",spokes:4,rim:.07,hub:.2,t:e*.06,detail:t.detail,seed:t.seed??11,sheared:t.sheared,bevel:.018})}function ds(t){const e=typeof t.w=="number"?(()=>t.w):t.w,n=typeof t.t=="number"?(()=>t.t):t.t;return ml(t.pts,t.side,e,n,{cs:t.detail===0?1:2,cav:t.cav})}function cr(t){const e=t.detail??2,n=t.rIn??.42,o=t.rOut??2.75,s=t.turns??13,a=t.t??.03,r=t.h??a*6.5,i=t.angle??0,c=lt(150,e,40),l=Math.round(s*c),d=[],u=[],f=new C(0,1,0),p=i/$e*.55;for(let P=0;P<=l;P++){const z=P/l,_=$e*s*z+i*(1-z),R=n+(o-n)*Math.pow(z,1+p*(1-z)*2),k=i*.05*o*z;d.push(new C(Math.cos(_)*R+k,0,Math.sin(_)*R)),u.push(f)}const v=t.overcoil??!0,h=$e*s,m=v?lt(110,e,30):0,M=r*2.4;for(let P=1;P<=m;P++){const z=P/m,_=h+$e*.72*z,R=o-o*.34*Math.min(1,z*1.6)**1.5,k=M*Math.min(1,z*3)**2*(3-2*Math.min(1,z*3));d.push(new C(Math.cos(_)*R+i*.05*o,k,Math.sin(_)*R)),u.push(f)}const x=ds({pts:d,side:u,w:r,t:a,detail:e}),g=kt([{r:.16,y:-r*.7},{r:n+.02,y:-r*.7},{r:n+.02,y:r*.7,edge:.4},{r:.16,y:r*.7}],lt(32,e,12));g.rotateY(-i);const w=d[d.length-1],b=h+(v?$e*.72:0),S=xn({pts:[[-.16,-.12],[.16,-.12],[.16,.12],[-.16,.12]],sharp:30},[],{t:r*2.2,bevel:.025,segs:1});return S.rotateY(-b),cn(S,w.x*1.04,w.y,w.z*1.04),{geo:_t([x,g,S]),outer:o}}function _l(t){const e=t.detail??2,n=t.seed??21,o=t.R,s=t.angle??0,a=o*.075,r=o*.085,i=t.screws,c=new se().makeRotationY(-s),l=[],d=[],u=lt(12,e,6),f=z=>o*(.06+.05*Math.exp(-((z/(o*.25))**2)));for(let z=0;z<=u;z++){const _=Lt(-3.2725,o-a*.5,z/u);d.push([_,f(_)])}for(let z=u;z>=0;z--){const _=Lt(-3.2725,o-a*.5,z/u);d.push([_,-f(_)])}const p=xn({pts:d},[{pts:$0(o*.05,16),cav:.5}],{t:r*.8,bevel:r*.1,segs:e===0?1:2});l.push(p);const v=.035,h=lt(90,e,30);for(const z of[0,1]){const _=z*Math.PI-.08,R=z*Math.PI+Math.PI-.08-v*2,k=[];for(let y=0;y<=h;y++){const A=Lt(_,R,y/h);k.push([Math.cos(A)*o,Math.sin(A)*o])}for(let y=h;y>=0;y--){const A=Lt(_,R,y/h);k.push([Math.cos(A)*(o-a),Math.sin(A)*(o-a)])}l.push(xn({pts:k,sharp:40},[],{t:r,bevel:r*.12,segs:e===0?1:2}))}const m=Ml({L:t.staffL,ra:o*.022,detail:e});l.push(m);const M=_t(l).applyMatrix4(c),x=et(n*17+3),g=[];for(let z=0;z<i;z++){const _=(z+.5)/i*$e+.03,R=Di(new C(Math.cos(_)*(o+.04),0,Math.sin(_)*(o+.04)),new C(Math.cos(_),0,Math.sin(_)),x()*$e);g.push(c.clone().multiply(R))}const w=b0({size:"timing",detail:e,seed:n+2}),b=r/2+.3,S=cr({rOut:t.springR,angle:s,detail:e});cn(S.geo,0,b,0);const P=[{geo:w,finish:"polished",seed:n+2,mats:g}];return{...Q0([io(M,"polished",n),io(S.geo,"blackened",n+1)],P),hairspringY:b}}function Il(t){const e=t.detail??2,n=t.w??1.9,o=n/12,s=t.inner,a=t.outer??5.2,r=t.coils,i=t.throwLen,c=et((t.seed??2)*211+1),l=[],d=[],u=Math.round(r*lt(90,e,30));for(let g=0;g<=u;g++){const w=g/u,b=w*r*$e,S=Lt(s,a,Math.pow(w,.8))+Math.sin(w*37)*.03;l.push(new C(Math.cos(b)*S,0,Math.sin(b)*S)),d.push(new C(0,1,0))}const f=l[l.length-1].clone(),p=r*$e,v=new C(-Math.sin(p),0,Math.cos(p)),h=new C(Math.cos(p),0,Math.sin(p)),m=lt(260,e,80),M=c()*$e;for(let g=1;g<=m;g++){const w=g/m,b=w*i,S=f.clone().addScaledVector(v,b*.9).addScaledVector(h,Math.sin(w*Math.PI*1.6+M*.1)*i*.22+w*i*.15).add(new C(0,Math.sin(w*Math.PI)*i*.32-Math.sin(w*Math.PI*2.2)*i*.12,0));l.push(S);const P=Ro(w*1.6)*Math.PI*.5+Math.sin(w*7)*.25;d.push(new C(0,Math.cos(P),0).addScaledVector(h,Math.sin(P)).normalize())}for(let g=0;g<l.length;g++){const w=l[Math.min(l.length-1,g+1)].clone().sub(l[Math.max(0,g-1)]).normalize();d[g].addScaledVector(w,-d[g].dot(w)).normalize()}const x=g=>g>.985?.5+(1-g)*30:1;return ds({pts:l,side:d,w:g=>n*x(g),t:o,detail:e,cav:g=>g<u/l.length?.35:0})}function Ll(t){const e=t.detail??2,n=t.seed??31,o=t.R??6,s=2.4,a=.28,r=lt(96,e,32),i=kt([{r:0,y:0},{r:o-.1,y:0},{r:o,y:.1},{r:o,y:s-.06},{r:o-.05,y:s,edge:.8},{r:o-a,y:s,edge:.6},{r:o-a,y:.3,cav:.9},{r:1.1,y:.3,cav:.7},{r:1.1,y:.65},{r:.7,y:.7},{r:.55,y:.7},{r:.55,y:-.1},{r:0,y:-.1}],r),c=$o({teeth:84,r:o+.55,profile:"barrel",inner:o-.05,t:.5,detail:e,seed:n,boss:!1,bevel:.04});cn(c,0,.45,0);const l=kt([{r:0,y:0},{r:o-.35,y:0},{r:o-.3,y:.05},{r:o-.3,y:.22},{r:o-.38,y:.26,edge:.7},{r:.9,y:.26},{r:.9,y:.4},{r:.5,y:.4},{r:0,y:.4}],r),d=new se().compose(new C(-o*1.95,.2,-o*.55),new Wt().setFromEuler(new Nn(.3,0,.38,"ZYX")),new C(1,1,1)),u=Sl({L:s+1.6,ra:.42,detail:e});cn(u,0,-.4,0);const f=$o({teeth:40,r:2.6,profile:"ratchet",spokes:0,hole:.3,t:.55,detail:e,seed:n+1,bevel:.05});f.rotateY(.3),cn(f,0,s+1.05,0);const v=xn({pts:[[0,-.25],[1.6,-.15],[2.15,-.45],[2.3,-.25],[1.75,.25],[0,.3],[-.3,0]],sharp:30},[],{t:.45,bevel:.06});cn(v,2.15,s+1.05,1.2,0,-.5,0);const h=Il({inner:1.3,outer:o-a-.1,coils:4,throwLen:9,detail:e,seed:n});return cn(h,0,1.3,0),Q0([io(_t([i,c]),"turned",n),io(l,"sunray",n+1,d),io(_t([u,f,v]),"grained",n+2),io(h,"blackened",n+3)])}function Hi(t){const e=t.detail??2,n=t.seed??41,o=et(n*7+11),[s,a,r]=t.box,i=t.centre??[0,0,0],c=(()=>{const h=[],m=[],M=lt(24,e,8);for(let x=0;x<=M;x++){const g=x/M,w=g*4.2,b=.12+g*.1;h.push(new C(Math.cos(w)*b,g*.12,Math.sin(w)*b)),m.push(new C(0,1,0))}return ds({pts:h,side:m,w:.05,t:.012,detail:0})})(),l=(()=>{const h=Wi({teeth:80,r:5,profile:"train",detail:1,seed:1}),m=Math.round(h.pts.length/80),M=h.pts.slice(0,m-1).map(x=>[x[0]-4.8,x[1]]);return xn({pts:M,sharp:30},[],{t:.4,bevel:.02,segs:1})})(),d=(()=>{const h=[],m=et(n+5);for(let M=0;M<7;M++){const x=M/7*$e;h.push([Math.cos(x)*(.1+m()*.12),Math.sin(x)*(.1+m()*.12)])}return xn({pts:h,sharp:25},[],{t:.04,bevel:.01,segs:1})})(),u=kt([{r:0,y:-.02},{r:.025,y:0},{r:0,y:.02}],4),f=b0({size:"small",detail:e>1?1:0,seed:n+9}),p=[[c,.22,"polished",.8],[l,.05,"brushed",1],[d,.3,"blackened",1.2],[f,.03,"polished",1],[u,.4,"blackened",1.5]],v=[];return p.forEach(([h,m,M,x],g)=>{const w=Math.max(1,Math.round(t.count*m)),b=[];for(let S=0;S<w;S++){const P=o(),z=x*(P<.6?.55+o()*.3:P<.9?1+o()*.4:1.8+o()*.6),_=new C(i[0]+(o()-.5)*s,i[1]+(o()-.5)*a,i[2]+(o()-.5)*r),R=new Wt().setFromEuler(new Nn(o()*$e,o()*$e,o()*$e));b.push(new se().compose(_,R,new C(z,z,z)))}v.push({geo:h,finish:M,seed:n+g,mats:b})}),Q0([],v)}const Y0=(t=0,e=0,n=0)=>new C(t,e,n);function r0(t,e,n,o={}){const s=new hn,a=t.length,r=[];for(let u=0;u<a;u++)r.push(t[Math.min(a-1,u+1)].clone().sub(t[Math.max(0,u-1)]).normalize());const i=[0];for(let u=1;u<a;u++)i.push(i[u-1]+t[u].distanceTo(t[u-1]));const c=i[a-1]||1;let l=Math.abs(r[0].y)<.9?Y0(0,1,0):Y0(1,0,0);l=l.sub(r[0].clone().multiplyScalar(l.dot(r[0]))).normalize();const d=[];for(let u=0;u<a;u++){l.sub(r[u].clone().multiplyScalar(l.dot(r[u]))).normalize();const f=r[u].clone().cross(l),p=i[u]/c,v=.001,h=(e(Math.min(1,p+v))-e(Math.max(0,p-v)))/(2*v*c),m=e(p),M=[];for(let x=0;x<n;x++){const g=x/n*$e,w=l.clone().multiplyScalar(Math.cos(g)).add(f.clone().multiplyScalar(Math.sin(g))),b=w.clone().sub(r[u].clone().multiplyScalar(h)).normalize(),S=t[u].clone().add(w.multiplyScalar(m)),P=s.v(S.x,S.y,S.z,b.x,b.y,b.z,o.cav?o.cav(p):0,0);if(m>0){const z=w.clone().normalize();s.thin(P,z.x,z.y,z.z,m)}M.push(P)}d.push(M)}for(let u=0;u+1<a;u++)for(let f=0;f<n;f++){const p=d[u][f],v=d[u][(f+1)%n],h=d[u+1][(f+1)%n],m=d[u+1][f];s.quad(p,v,h,m)}if(o.caps??!0)for(const[u,f]of[[0,-1],[a-1,1]]){const p=r[u].clone().multiplyScalar(f),v=t[u].clone().add(p.clone().multiplyScalar(e(u?1:0)*.8)),h=s.v(v.x,v.y,v.z,p.x,p.y,p.z);for(let m=0;m<n;m++)s.tri(h,d[u][m],d[u][(m+1)%n])}return s.geometry()}function Oi(t,e,n,o,s=0){const a=e.clone().sub(t).cross(Y0(0,1,0)).normalize();return Array.from({length:o+1},(r,i)=>{const c=i/o,l=4*c*(1-c);return t.clone().lerp(e,c).add(Y0(0,-n*l*(1+.25*l),0)).add(a.clone().multiplyScalar(s*Math.sin(c*Math.PI)*Math.sin(c*$e)))})}function R0(t){const e=t.detail??2,n=t.r??.06,o=jt(t.phase??0),s=et(t.seed??1),a=t.a.distanceTo(t.b),r=lt(14,e,6),i=lt(90,e,16),c=(s()-.5)*a*.06,l=u=>n*2.6*Math.exp(-((u*a/(n*5))**2));if(o<.92){const u=Oi(t.a,t.b,(t.sag??a*.12)*(1+o*.8),i,c),f=.5+(s()-.5)*.2;return r0(u,v=>n*(1-.86*o*Math.exp(-(((v-f)/(.12+.2*(1-o)))**2)))+l(v)+l(1-v),r)}const d=(u,f,p)=>{const v=a*(.25+(o-.92)*3)*(.8+.4*p),h=f.clone().sub(u).normalize(),m=Array.from({length:i/2+1},(M,x)=>{const g=x/(i/2);return u.clone().add(h.clone().multiplyScalar(v*.35*Math.sin(g*1.4))).add(Y0(0,-v*g*g,0))});return r0(m,M=>n*(.55+.5*Math.exp(-(((M-.93)/.07)**2))*1.8)*(1-.3*M)+l(M),r)};return _t([d(t.a,t.b,0),d(t.b,t.a,1)])}function El(t){const e=t.detail??2,n=t.r,o=jt(t.phase),s=t.beads,a=t.a.distanceTo(t.b),r=Oi(t.a,t.b,t.sag,lt(160,e,30)),i=o*.04;return r0(r,l=>{const d=Math.max(0,Math.cos($e*s*(l-i)+Math.PI))**3*Ro(l*8)*Ro((1-l)*8);return n*(1-.65*o)+n*2.4*o*d+n*2*Math.exp(-((l*a/(n*5))**2))+n*2*Math.exp(-(((1-l)*a/(n*5))**2))},lt(14,e,6))}function Dl(t,e,n={}){const o=n.detail??2,s=jt(n.phase??0),a=n.t??.006,r=lt(16,o,5),i=t.length-1,c=et(n.seed??3),l=9,d=5,u=Array.from({length:(l+1)*(d+1)},()=>c()),f=(M,x)=>{const g=M*l,w=x*d,b=Math.min(l-1,Math.floor(g)),S=Math.min(d-1,Math.floor(w)),P=Ro(g-b),z=Ro(w-S),_=(R,k)=>u[k*(l+1)+R];return Lt(Lt(_(b,S),_(b+1,S),P),Lt(_(b,S+1),_(b+1,S+1),P),z)},p=(M,x)=>{const g=x/r;return t[M].clone().lerp(e[M],g).add(Y0(0,-(n.sag??.15)*4*g*(1-g),0))},v=new hn,h=.2+s*.55,m=[[],[]];for(let M=0;M<2;M++)for(let x=0;x<=i;x++){const g=[];for(let w=0;w<=r;w++){const b=p(x,w),S=p(Math.min(i,x+1),w).sub(p(Math.max(0,x-1),w)),P=p(x,Math.min(r,w+1)).sub(p(x,Math.max(0,w-1))),z=S.cross(P).normalize().multiplyScalar(M?-1:1),_=b.clone().add(z.clone().multiplyScalar(a*.5));g.push(v.v(_.x,_.y,_.z,z.x,z.y,z.z))}m[M].push(g)}for(let M=0;M<i;M++)for(let x=0;x<r;x++){const g=(M+.5)/i,w=(x+.5)/r,b=Math.min(w,1-w)*2;if(!(f(g,w)*(.6+b)<h&&b>.15))for(let S=0;S<2;S++)v.quad(m[S][M][x],m[S][M+1][x],m[S][M+1][x+1],m[S][M][x+1])}return v.geometry()}function La(t={}){const e=t.detail??2,n=t.R??.6,o=t.rIn??.12,s=t.phase??0,a=n*(.42+.1*Math.sin(s*$e)),r=[],i=lt(18,e,6);r.push({r:n*1.04,y:0,smooth:!0});for(let c=0;c<=i;c++){const l=c/i*Math.PI*.5,d=Lt(o*1.15,n,Math.cos(l));r.push({r:d,y:a*Math.sin(l)**.8+n*.03*(1-Math.cos(l)),smooth:!0})}return r.push({r:o*1.15,y:a*1.08,smooth:!0},{r:o,y:a*1.25,smooth:!0},{r:o,y:a*.4,smooth:!0}),kt(r.reverse(),lt(48,e,14))}const z0=t=>t==="high"?2:t==="mid"?1:0;function Lr(t,e,n){if(t.finish==="oil")return jo();if(t.finish==="ruby"){t.geo.computeBoundingBox();const o=t.geo.boundingBox,s=o.getSize(new C).multiplyScalar(.5),a=o.getCenter(new C);return pl({half:s,crackP:a.clone().add(new C(s.x*.15,0,0)),crackN:new C(.85,.25,.45),node:a.clone().add(new C(s.x*.55,s.y*.1,-s.z*.2))})}return an({finish:t.finish,seed:t.seed,wear:n,tier:e})}function Wl(t,e,n={}){const o=new gt,s=n.wear??.6;for(const a of t.pieces){const r=Lr(a,e,s),i=new je(a.geo,r);a.at&&i.applyMatrix4(a.at),i.castShadow=i.receiveShadow=n.shadows??e!=="low";const c=r.aim;c&&(i.onBeforeRender=(l,d,u)=>c(i,u)),o.add(i)}for(const a of t.inst){if(!a.mats.length)continue;const r=Lr(a,e,s),i=new gn(a.geo,r,a.mats.length);a.mats.forEach((c,l)=>i.setMatrixAt(l,c)),i.instanceMatrix.needsUpdate=!0,i.castShadow=i.receiveShadow=n.shadows??e!=="low",i.computeBoundingSphere(),o.add(i)}return o}const No=(t=[],e=[])=>({pieces:t,inst:e}),qt=(t,e,n=1,o,s,a)=>({geo:t,finish:e,seed:n,name:o,at:s,wear:a});function fn(t,e,n,o,s={}){const a=[];for(let l=0;l<e;l++)for(let d=0;d<n;d++)a.push(o(l,d));const r=(l,d)=>(s.wrapJ?d=(d+n)%n:d=Math.max(0,Math.min(n-1,d)),l=Math.max(0,Math.min(e-1,l)),a[l*n+d].p),i=t.p.length/3;for(let l=0;l<e;l++)for(let d=0;d<n;d++){const u=a[l*n+d],f=u.p;let p=s.nrm?.(f,l,d)??null;if(!p){let v=r(l+1,d),h=r(l-1,d),m=r(l,d+1),M=r(l,d-1),x=[v[0]-h[0],v[1]-h[1],v[2]-h[2]],g=[m[0]-M[0],m[1]-M[1],m[2]-M[2]];if(Math.hypot(g[0],g[1],g[2])<1e-9){const b=l===0?1:e-2;m=r(b,d+1),M=r(b,d-1),g=[m[0]-M[0],m[1]-M[1],m[2]-M[2]]}Math.hypot(x[0],x[1],x[2])<1e-9&&(v=r(l+1,d+1),h=r(l-1,d-1),x=[v[0]-h[0],v[1]-h[1],v[2]-h[2]]),p=[x[1]*g[2]-x[2]*g[1],x[2]*g[0]-x[0]*g[2],x[0]*g[1]-x[1]*g[0]];let w=Math.hypot(p[0],p[1],p[2]);if(w<1e-12&&(p=s.out?s.out(f,l,d):[0,1,0],w=Math.hypot(p[0],p[1],p[2])||1),p=[p[0]/w,p[1]/w,p[2]/w],s.out){const b=s.out(f,l,d);p[0]*b[0]+p[1]*b[1]+p[2]*b[2]<0&&(p=[-p[0],-p[1],-p[2]])}}t.v(f[0],f[1],f[2],p[0],p[1],p[2],u.cav??0,u.edge??0)}const c=s.wrapJ?n:n-1;for(let l=0;l<e-1;l++)for(let d=0;d<c;d++){const u=(d+1)%n,f=i+l*n+d,p=i+l*n+u,v=i+(l+1)*n+u,h=i+(l+1)*n+d;t.quad(f,p,v,h)}return i}function Nl(t){const e=et(t*977+13),n=256,o=new Float32Array(n*n).map(()=>e()),s=(a,r)=>o[(r%n+n)%n*n+(a%n+n)%n];return(a,r)=>{const i=Math.floor(a),c=Math.floor(r),l=a-i,d=r-c,u=l*l*(3-2*l),f=d*d*(3-2*d),p=s(i,c)+(s(i+1,c)-s(i,c))*u,v=s(i,c+1)+(s(i+1,c+1)-s(i,c+1))*u;return p+(v-p)*f}}function vs(t,e=3){const n=Array.from({length:e},(o,s)=>Nl(t+s*31));return(o,s)=>{let a=0,r=.5,i=0;for(let c=0;c<e;c++)a+=n[c](o*(1<<c)+c*17.3,s*(1<<c)-c*9.1)*r,i+=r,r*=.5;return a/i}}function Bl(t,e,n,o,s,a={}){return fn(t,e,n,(r,i)=>{const c=r/(e-1)*Math.PI,l=i/n*Math.PI*2;return{p:o(c,l),cav:a.cav?.(c)??0}},{wrapJ:!0,out:r=>[r[0]-s[0],r[1]-s[1],r[2]-s[2]]})}function Vi(t,e,n,o,s,a,r=0){const i=e.length;return fn(t,i,s,(c,l)=>{const d=c/(i-1),u=c,f=e[u],p=e[Math.min(i-1,u+1)].clone().sub(e[Math.max(0,u-1)]).normalize(),v=n[u].clone().sub(p.clone().multiplyScalar(n[u].dot(p))).normalize(),h=p.clone().cross(v),m=l/s*Math.PI*2,M=o(d,m),x=f.clone().addScaledVector(v,Math.cos(m)*M).addScaledVector(h,Math.sin(m)*M);return{p:[x.x,x.y,x.z],edge:r*jt(Math.abs(Math.cos(m*2)))}},{wrapJ:!0,out:(c,l)=>{const d=e[l];return[c[0]-d.x,c[1]-d.y,c[2]-d.z]}})}const Re={dialR:21.5,enamelT:.15,baseT:.25,dome:.12,chapterIn:13.25,chapterOut:20.85,recess:.045,numeralR:15.2,numeralH:3.1,numeralT:.25,trackIn:19.15,trackOut:20.15,hourIn:18.55,hole:1.15,handY:{hour:.32,minute:.62,second:.94},crystalR:22.25,crystalY:1.35,crystalT:1.2,crystalDome:1.45,caseIn:22.45,caseOut:25,caseTop:2.35,caseBottom:-6.2,lidDome:2.55,lidT:.55,hinge:{x:-25.55,y:2.2,r:.95,len:11.2},crownR:2.7,crownLen:2.9},ro=t=>-.12*(t/Re.dialR)**2-(t>Re.chapterIn&&t<Re.chapterOut?Re.recess:0),aa=t=>-.12*(t/Re.dialR)**2,sa=(t,e)=>[Math.sin(t)*e,-Math.cos(t)*e],Hl=Math.PI/180;function Ol(t={}){const e=t.seed??5,n=t.detail??2,o=et(e*131+7),s=Re.dialR,a=t.impact??[-13,.8],r=Math.atan2(-a[1],-a[0]),i=Math.hypot(a[0],a[1]),l=(t.cracks??[-145,-112,-82,null,22,55,98,140,176].map((y,A)=>y===null?r:(y+(A===2?(o()-.5)*3:(o()-.5)*7))*Hl)).map(y=>y),d=l.length,u=l.map((y,A)=>{const F=[o()*6,o()*6,o()*6,o()*6],T=.25+o()*.2,I=Math.abs(y-r)<1e-6;return Q=>{const X=N=>Math.abs((N%2+2)%2-1)*2-1;let E=T*Math.sin(Q*.33+F[0])+.13*Math.sin(Q*1.07+F[1])+.05*Math.sin(Q*3.1+F[2])+.022*X(Q*1.9+F[3])+.01*X(Q*5.3+F[0]);return E-=T*Math.sin(F[0])+.13*Math.sin(F[1])+.05*Math.sin(F[2])+.022*X(F[3])+.01*X(F[0]),I&&(E*=Ro(Math.abs(Q-i)/2.5)),E*Ro(Q/1.6)*(A===2?.6:1)}}),f=(y,A)=>l[y%d]+(y>=d?$e:0)+Math.atan2(u[y%d](A),Math.max(A,.4)),p=y=>{const A=Math.cos(y),F=Math.sin(y),T=a[0]*A+a[1]*F,I=a[0]*a[0]+a[1]*a[1]-s*s;return-T+Math.sqrt(T*T-I)},v=l.map(()=>[0,1].map(()=>{const y=[];for(let A=.6+o()*.5;A<36;A+=.35+o()*1.4){const F=.07+o()*.26*(o()<.1?2.2:1);y.push({c:A,w:F,h:F*(.18+o()*.32)})}return y})),h=t.shardSector??6,m=l.findIndex(y=>Math.abs(y-r)<1e-6),M={c:6.4+o()*.6,w:1.7,h:1.25},x=(y,A,F,T,I)=>{let Q=0;for(const E of v[y][A]){const N=(F-E.c)/E.w;N>-1&&N<1&&(Q=Math.max(Q,E.h*Math.sqrt(1-N*N)))}let X=T?.03+Q*.18:.028+Q;if(I===h&&A===1){const E=(F-M.c)/M.w;if(E>-1&&E<1){const N=M.h*Math.pow(1-Math.abs(E),.85)*(1+.12*Math.sin(F*9+e));X=Math.max(X,T?N*.86:N+.03)}}if(y===m){const E=F-i;Math.abs(E)<Re.hole&&(X=Math.max(X,Math.sqrt(Re.hole*Re.hole-E*E)+(T?0:.04)))}return X},g=(y,A)=>(y===m&&Math.abs(A-i)<Re.hole?Math.sqrt(Re.hole*Re.hole-(A-i)**2):0)+.006,w=[.62,.34,.2][n],b=y=>.75+.4*Math.abs(Math.sin(y*3.7+e)*Math.sin(y*7.3)),S=(y,A)=>{const F=Math.hypot(y-a[0],A-a[1]);let T=Math.atan2(A-a[1],y-a[0]);for(let I=0;I<d;I++){const Q=f(I,F),X=f(I+1,F);let E=T;for(;E<Q;)E+=$e;for(;E>=Q+$e;)E-=$e;if(E<X)return I}return 0},P=[];for(let y=0;y<d;y++){const A=y,F=y+1,T=l[y],I=y+1<d?l[y+1]:l[0]+$e,Q=Math.max(...Array.from({length:9},(Z,G)=>p(T+(I-T)*G/8))),X=(Z,G,K,oe)=>{let de=T+(I-T)*Z,Ce=G(de);for(let We=0;We<4;We++){const Je=f(A,Ce)+K(Ce)/Math.max(Ce,.3),U=f(F,Ce)-oe(Ce)/Math.max(Ce,.3);de=Je+(U-Je)*Z,Ce=G(de)}return[a[0]+Math.cos(de)*Ce,a[1]+Math.sin(de)*Ce,de]},E=Math.max(6,Math.ceil(Q/w)),N=Math.max(4,Math.ceil((I-T)*Q/w)),$=new hn,q=[.14,.06,.02,0],D=[0,.012,.045,.1],V=2+E+q.length,O=Z=>G=>{const K=p(G),oe=b(G);return Z===0?oe:Z===1?oe+.09:Z<2+E?oe+.22+(K-.16-oe-.22)*(Z-2)/(E-1):K-q[Z-2-E]},j=Z=>x(A%d,1,Z,!1,y),ae=Z=>x(F%d,0,Z,!1,y),ye=Z=>x(A%d,1,Z,!0,y),_e=Z=>x(F%d,0,Z,!0,y),L=(Z,G)=>{const K=Math.hypot(Z,G),oe=w*.45;for(const de of[Re.chapterIn,Re.chapterOut])if(Math.abs(K-de)<oe){const Ce=K<de?de-.004:de+.004;return[Z*Ce/K,G*Ce/K]}return[Z,G]},J=(Z,G,K)=>{const oe=Math.hypot(G,K);return Z===0?aa(oe)-Re.enamelT+.03:Z===1?ro(oe)-.05:Z>=2+E?ro(oe)-D[Z-2-E]:ro(oe)};fn($,V,N,(Z,G)=>{const K=G/(N-1),oe=X(K,O(Z),j,ae);let[de,Ce]=[oe[0],oe[1]];Z>=2&&Z<2+E&&([de,Ce]=L(de,Ce));const We=G===0||G===N-1||Z===0||Z===V-1?1:0;return{p:[de,J(Z,de,Ce),Ce],edge:We}},{out:()=>[0,1,0],nrm:(Z,G)=>{if(G<=1||G>=2+E+1)return null;const K=Re.dome/(s*s),oe=Math.hypot(2*K*Z[0],1,2*K*Z[2]);return[2*K*Z[0]/oe,1/oe,2*K*Z[2]/oe]}});for(const Z of[0,1]){const G=Z?1:0,K=Z?ae:j,oe=Z?_e:ye,de=Ce=>(K(Ce)+oe(Ce))*.5+(K(Ce)-oe(Ce))*.28;fn($,V,3,(Ce,We)=>{const Je=We===0?K:We===1?de:oe,U=X(G,O(Ce),Z?j:Je,Z?Je:ae),he=Math.hypot(U[0],U[1]),Me=J(Ce,U[0],U[1]),ge=aa(he)-Re.enamelT,Pe=We===0?Me:We===1?ge+(Me-ge)*.55:ge;return{p:[U[0],Pe,U[1]],edge:We===0?1:0,cav:We===2?1:0}},{out:Ce=>{const We=Math.atan2(Ce[2]-a[1],Ce[0]-a[0])+(Z?1:-1)*Math.PI/2;return[Math.cos(We),.3,Math.sin(We)]}})}const ve=$.geometry(),pe=new hn,fe=Math.max(3,Math.round(N/5)),Le=1+E+1,Fe=Z=>G=>{const K=p(G);return Z===0?.12:Z<=E?.12+(K-.12)*(Z-1)/E:K},De=Z=>g(A%d,Z),Ue=Z=>g(F%d,Z);for(const Z of[!0,!1])fn(pe,Le,fe,(G,K)=>{const oe=X(K/(fe-1),Fe(G),De,Ue),de=Math.hypot(oe[0],oe[1]);return{p:[oe[0],aa(de)-Re.enamelT-(Z?0:Re.baseT),oe[1]],edge:Z&&(K===0||K===fe-1)?1:0}},{out:()=>[0,Z?1:-1,0]});for(const Z of[0,1])fn(pe,Le,2,(G,K)=>{const oe=X(Z,Fe(G),De,Ue),de=Math.hypot(oe[0],oe[1]);return{p:[oe[0],aa(de)-Re.enamelT-(K?Re.baseT:0),oe[1]],edge:K?.5:1}},{out:G=>{const K=Math.atan2(G[2]-a[1],G[0]-a[0])+(Z?1:-1)*Math.PI/2;return[Math.cos(K),0,Math.sin(K)]}});fn(pe,2,fe,(Z,G)=>{const K=X(G/(fe-1),Fe(Le-1),De,Ue),oe=Math.hypot(K[0],K[1]);return{p:[K[0],aa(oe)-Re.enamelT-(Z?Re.baseT:0),K[1]],edge:1}},{out:Z=>[Z[0],0,Z[2]]});const Se=pe.geometry(),He=[];for(let Z=0;Z<60;Z++){const G=Z%5===0,K=Z/60*$e,oe=G?Re.hourIn:Re.trackIn,de=Re.trackOut,Ce=[oe,(oe+de)/2,de].map(ge=>[Math.sin(K)*ge,-Math.cos(K)*ge]);if(!Ce.every(ge=>S(ge[0],ge[1])===y)||!Ce.every(ge=>{const Pe=Math.hypot(ge[0]-a[0],ge[1]-a[1]);let B=Math.atan2(ge[1]-a[1],ge[0]-a[0]);const ne=f(A,Pe);for(;B<ne;)B+=$e;return(B-ne)*Pe>j(Pe)+.12&&(f(F,Pe)-B)*Pe>ae(Pe)+.12}))continue;const Je=G?.2:.07,U=de-oe,he=xn({pts:[[-Je/2,-U],[Je/2,-U],[Je/2,0],[-Je/2,0]]},[],{t:.03,bevel:G?.012:.008,segs:1}),Me=ro((oe+de)/2)+.012;he.applyMatrix4(new se().makeRotationY(-K).multiply(new se().makeTranslation(0,Me,-oe))),He.push(he)}const ot=He.length?_t(He):null,ke=y===(t.dropSector??3);if(ke){const Z=new C(Math.cos(l[y]),0,Math.sin(l[y])),G=new se().makeTranslation(a[0],0,a[1]).multiply(new se().makeRotationAxis(Z,-(t.drop??.25)/14)).multiply(new se().makeTranslation(-a[0],-(t.drop??.25)*.55,-a[1]));for(const K of[ve,Se,ot])K?.applyMatrix4(G)}ve.computeBoundingBox();const be=ve.boundingBox.getCenter(new C);P.push({enamel:ve,base:Se,ticks:ot,from:T,to:I,centroid:be,dropped:ke})}const z=Re.hole,_=kt([{r:z-.15,y:-.4-.05},{r:z+.32,y:-.4-.05},{r:z+.32,y:-.4},{r:z-.01,y:-.4},{r:z-.01,y:-.005},{r:z+.16,y:-.005},{r:z+.16,y:.03,smooth:!0},{r:z+.08,y:.075,smooth:!0},{r:z-.15,y:.075},{r:z-.15,y:-.4-.05}],[24,48,96][n]),R=P.flatMap((y,A)=>[qt(y.enamel,"enamel",e*10+A,`enamel-${A}`),qt(y.base,"polished",e*10+A+50,`base-${A}`),...y.ticks?[qt(y.ticks,"polished",e*10+A+80,`ticks-${A}`,void 0,.3)]:[]]);R.push(qt(_,"polished",e+3,"collar",void 0,.3));const k=(y,A)=>{const F=f(y,A);return[a[0]+Math.cos(F)*A,a[1]+Math.sin(F)*A]};return{part:No(R),sectors:P,impact:new C(a[0],0,a[1]),cracks:l,sectorOf:S,crackAt:k,crackLen:y=>p(l[y])}}const t0=Re.numeralH,C0=.4,Ea=.19,gs=.34,xs=.13,Da=.17,ws=.2;function Vl(t){const e=(o,s,a,r,i,c)=>[[o-i/2,0],[o+i/2,0],[s+c/2,t0],[s-c/2,t0]];if(t==="I")return{strokes:[{pts:e(0,0,0,0,gs,gs)}],w:gs,feet:[0]};if(t==="V")return{strokes:[{pts:e(0,-.62,0,0,C0*.75,C0)},{pts:e(0,.62,0,0,Ea*.75,Ea)}],w:2*.62+C0,feet:[-.62*.5]};const n=.66;return{strokes:[{pts:e(n,-n,0,0,C0,C0)},{pts:e(-n,n,0,0,Ea,Ea)}],w:2*n+C0,feet:[0]}}const ql=["XII","I","II","III","IIII","V","VI","VII","VIII","IX","X","XI"];function Hs(t,e={}){const n=e.detail??2,o=[],s=[...t].map(f=>Vl(f)),a=s.reduce((f,p)=>f+p.w,0)+ws*(s.length-1);let r=-a/2;const i=[];s.forEach(f=>{const p=r+f.w/2;for(const v of f.strokes)o.push(xn({pts:v.pts.map(([h,m])=>[h+p,-(m-t0/2)])},[],{t:Re.numeralT,bevel:.055,segs:n?2:1}));for(const v of f.feet)i.push(p+v);r+=f.w+ws}),r=-a/2,s.forEach(f=>{for(const p of[0,t0-xs])o.push(xn({pts:[[r-Da,-(p-t0/2)],[r+f.w+Da,-(p-t0/2)],[r+f.w+Da,-(p+xs-t0/2)],[r-Da,-(p+xs-t0/2)]]},[],{t:Re.numeralT*.96,bevel:.045,segs:n?2:1}));r+=f.w+ws});const c=_t(o);c.translate(0,Re.numeralT/2,0);const l=[i[0],i[i.length-1]],d=[-.6819999999999997,.6819999999999999],u=l.map((f,p)=>{const v=kt([{r:0,y:-.42},{r:.085,y:-.4,smooth:!0},{r:.095,y:-.33},{r:.095,y:.02},{r:0,y:.02}],n?12:6);return v.translate(f,0,d[p]),v});return{geo:_t([c,...u]),feet:l.map((f,p)=>new C(f,0,d[p])),width:a}}function Gl(t={}){const e=t.detail??2,n=et((t.seed??3)*71+5),o=t.loose??[4,7],s=t.fallen??9,a=[],r=[],i=[];for(let c=0;c<12;c++){const l=Hs(ql[c],{detail:e}),d=c/12*$e,u=Re.numeralR,f=ro(u)+.002,p=new se().makeRotationY(-d).multiply(new se().makeTranslation(0,f,-u));let v=p.clone();if(o.includes(c)){const h=l.feet[c%2],m=new C(1,0,.25*(n()-.5)).normalize(),M=(c%2?1:-1)*(.2+n()*.12),x=(n()-.5)*.35,g=new se().makeTranslation(h.x,0,h.z),w=new se().makeTranslation(-h.x,0,-h.z);v=p.clone().multiply(g).multiply(new se().makeRotationY(x)).multiply(new se().makeRotationAxis(m,M)).multiply(w)}else if(c===s){const h=t.fallenAt??[-9.2,5.6],m=Math.hypot(h[0],h[1]);v=new se().makeTranslation(h[0],ro(m)+Re.numeralT+.004,h[1]).multiply(new se().makeRotationY(.6+n())).multiply(new se().makeRotationZ(Math.PI)).multiply(new se().makeRotationX(.03))}i.push(v),o.includes(c)||c===s?r.push(qt(l.geo,"grained",300+c,`numeral-${c}`,v,.22)):a.push(l.geo.clone().applyMatrix4(v))}return r.unshift(qt(_t(a),"grained",299,"numerals",void 0,.22)),{part:No(r),at:i}}const Mn=Re.crystalR,$a=Re.crystalY,Ya=t=>$a+Re.crystalDome*(1-(Math.min(t,Mn)/Mn)**2),D0=t=>{const e=Ya(t)+Re.crystalT,n=.55;if(t<Mn-n)return e;const o=jt((t-(Mn-n))/n);return e-o*o*.32-o*.05-(t>=Mn-1e-6,0)};function Ul(t={}){const e=t.detail??2,n=t.seed??11,o=et(n*313+1),s=t.impact??[-5.2,6.4],a=(k,y=Mn)=>{const A=Math.cos(k),F=Math.sin(k),T=s[0]*A+s[1]*F,I=s[0]*s[0]+s[1]*s[1]-y*y;return-T+Math.sqrt(T*T-I)},r=t.wedge??[1.95,2.45],i=k=>{const y=[o()*6,o()*6];return A=>(.18*Math.sin(A*.5+y[0])+.06*Math.sin(A*1.7+y[1])-.18*Math.sin(y[0])-.06*Math.sin(y[1]))*Ro(A/1.2)*(k?1:-1)},c=i(0),l=i(1),d=(k,y)=>{const A=r[1]+Math.atan2(l(y),Math.max(y,.3)),F=r[0]+$e+Math.atan2(c(y),Math.max(y,.3));return A+(F-A)*k},u=[.9,.5,.3][e],f=Math.ceil(Mn*1.4/u),p=Math.ceil(($e-(r[1]-r[0]))*Mn*1.2/u),v=[Mn-.55,Mn-.4,Mn-.25,Mn-.1,Mn],h=(k,y)=>k<f?.02+(a(y,v[0])-.02)*Math.pow(k/f,1):a(y,v[k-f]),m=f+v.length,M=(k,y)=>{let A=d(y,2),F=h(k,A);for(let T=0;T<3;T++)A=d(y,F),F=h(k,A);return[s[0]+Math.cos(A)*F,s[1]+Math.sin(A)*F,A]},x=new hn;for(const k of[!0,!1])fn(x,m,p,(y,A)=>{const F=M(y,A/(p-1)),T=Math.hypot(F[0],F[1]);return{p:[F[0],k?D0(T):y===m-1?$a:Ya(T),F[1]],edge:y===m-1||A===0||A===p-1?1:0}},{out:()=>[0,k?1:-1,0]});fn(x,2,p,(k,y)=>{const A=M(m-1,y/(p-1));return{p:[A[0],k?D0(Mn):$a,A[1]],edge:1}},{out:k=>[k[0],0,k[2]]});const g=x.geometry(),w=new hn;for(const k of[0,1])fn(w,m,3,(y,A)=>{const F=M(y,k),T=Math.hypot(F[0],F[1]),I=D0(T),Q=y===m-1?$a:Ya(T),X=A===1?.05*(k?1:-1):0,E=F[2]+(k?-1:1)*Math.PI/2;return{p:[F[0]+Math.cos(E)*X,A===0?I:A===1?(I+Q)/2:Q,F[1]+Math.sin(E)*X],edge:A===1?0:1,cav:A===0?1:A===1?.5:0}},{out:y=>{const A=Math.atan2(y[2]-s[1],y[0]-s[0])+(k?-1:1)*Math.PI/2;return[Math.cos(A),0,Math.sin(A)]}});const b=w.geometry(),S=new hn,P=(k,y)=>{const A=k.length;fn(S,A,2,(F,T)=>{const[I,Q]=k[F],X=Math.hypot(I,Q),E=D0(Math.min(X,Mn))-.015,N=Ya(Math.min(X,Mn))+.015,$=k[Math.min(A-1,F+1)],q=k[Math.max(0,F-1)],D=$[0]-q[0],V=$[1]-q[1],O=Math.hypot(D,V)||1,j=(T?1:-1)*y*Re.crystalT*.5;return{p:[I-V/O*j,T?E:N,Q+D/O*j],edge:T,cav:T}},{out:(F,T)=>{const I=k[Math.min(A-1,T+1)],Q=k[Math.max(0,T-1)];return[-(I[1]-Q[1]),0,I[0]-Q[0]]}})},z=(k,y,A,F)=>{const T=Math.hypot(y[0]-k[0],y[1]-k[1]),I=Math.max(4,Math.ceil(T/[.6,.3,.15][e])),Q=et(F),X=[Q()*6,Q()*6,Q()*6],E=-(y[1]-k[1])/T,N=(y[0]-k[0])/T,$=[];for(let q=0;q<=I;q++){const D=q/I,V=D*T,O=(A*Math.sin(V*.45+X[0])+A*.35*Math.sin(V*1.6+X[1])+A*.12*Math.sin(V*5.1+X[2]))*Math.sin(Math.PI*D)**.5;$.push([k[0]+(y[0]-k[0])*D+E*O,k[1]+(y[1]-k[1])*D+N*O])}return $},_=t.rays??10;for(let k=0;k<_;k++){let y=(k+.3+o()*.5)/_*$e;y>r[0]-.12&&y<r[1]+.12&&(y+=.35);const A=a(y),F=k%3!==1,T=F?A-.02:A*(.3+o()*.45);P(z([s[0]+Math.cos(y)*.25,s[1]+Math.sin(y)*.25],[s[0]+Math.cos(y)*T,s[1]+Math.sin(y)*T],.25,n*7+k),(o()-.5)*.35)}for(const[k,y,A]of[[-2.55,.35,1],[-.9,2.05,2]]){const F=[Math.cos(k)*(Mn-.02),Math.sin(k)*(Mn-.02)],T=[Math.cos(y)*(Mn-.02),Math.sin(y)*(Mn-.02)];P(z(F,T,.9,n*13+A),(o()-.5)*.25)}const R=S.geometry();return{part:No([qt(g,"glass",n,"crystal"),qt(b,"glassEdge",n+1,"crystal-edge"),qt(R,"crack",n+2,"crystal-cracks")]),impact:new C(s[0],D0(Math.hypot(s[0],s[1])),s[1])}}const yo=-1.5,jl=(t,e,n,o)=>t.applyMatrix4(new se().makeTranslation(e,n,o).multiply(new se().makeRotationZ(-Math.PI/2))),Er=(t,e,n,o)=>t.applyMatrix4(new se().makeTranslation(e,n,o).multiply(new se().makeRotationX(-Math.PI/2)));function $l(t,e,n,o,s,a){const r=t.getAttribute("position"),i=t.getAttribute("normal"),c=et(a),l=[c()*$e,c()*$e];for(let d=0;d<r.count;d++){const u=r.getX(d),f=r.getY(d),p=r.getZ(d),v=Math.hypot(u,p);if(f<n||f>o||v<Re.caseOut-.9)continue;const h=Math.atan2(p,u),m=Math.sin(Math.PI*(f-n)/(o-n))**.35,M=1-.85*Math.exp(-(((f-(n+o)/2)/((o-n)*.22))**2))*(.55+.45*Math.sin(h*2+l[0])*Math.sin(h*5+l[1])),x=h*e/$e,g=x-Math.floor(x),w=Math.pow(Math.sin(Math.PI*g),2),b=2*Math.sin(Math.PI*g)*Math.cos(Math.PI*g)*Math.PI*e/$e,S=s*m*M,P=v-S*(1-w);r.setX(d,u/v*P),r.setZ(d,p/v*P);const z=S*b/v,_=-Math.sin(h),R=Math.cos(h),k=i.getX(d)-_*z,y=i.getY(d),A=i.getZ(d)-R*z,F=Math.hypot(k,y,A);i.setXYZ(d,k/F,y/F,A/F)}return r.needsUpdate=i.needsUpdate=!0,t}function Yl(t,e){const n=t.getAttribute("position"),o=t.getAttribute("normal");for(let s=0;s<n.count;s++){let a=0,r=0,i=0;for(const[p,v,h,m]of e){const M=n.getX(s)-p,x=n.getZ(s)-v,g=m*Math.exp(-(M*M+x*x)/(h*h));a-=g,r+=2*M/(h*h)*g,i+=2*x/(h*h)*g}if(Math.abs(a)<1e-6)continue;n.setY(s,n.getY(s)+a);const c=o.getY(s),l=c>=0?1:-1,d=o.getX(s)-r*l,u=o.getZ(s)-i*l,f=Math.hypot(d,c,u);o.setXYZ(s,d/f,c/f,u/f)}return n.needsUpdate=o.needsUpdate=!0,t}function Kl(t,e){const n=[],o=[],s=e.open??0,a=e.n,r=!s;for(let i=0;i<=a&&!(r&&i===a);i++){const c=s+($e-2*s)*i/a,l=new C(e.a*Math.cos(c),e.b*.45*Math.sin(2*c)*.35+(s?Math.sin(c)*.5*(c>Math.PI?1:0):0),e.b*Math.sin(c)).applyMatrix4(e.at);n.push(l),o.push(new C(0,1,0).transformDirection(e.at))}if(r&&(n.push(n[0].clone()),o.push(o[0].clone())),Vi(t,n,o,()=>e.r,e.segs,!1,.5),s)for(const i of[0,n.length-1]){const c=n[i],l=new l0(e.r*.98,10,6);l.translate(c.x,c.y,c.z);const d=l.getAttribute("position"),u=l.getAttribute("normal"),f=l.index,p=t.p.length/3;for(let v=0;v<d.count;v++)t.v(d.getX(v),d.getY(v),d.getZ(v),u.getX(v),u.getY(v),u.getZ(v),0,.6);for(let v=0;v<f.count;v+=3)t.tri(p+f.getX(v),p+f.getX(v+1),p+f.getX(v+2))}}function Xl(t={}){const e=t.detail??2,n=t.seed??21,o=et(n*17+3),s=[180,720,1440][e],a=[16,28,48][e],r=Re.caseTop,i=Re.caseBottom,c=(ke,be,Z=!1)=>({r:ke,y:be,smooth:Z}),l=9,u=[...Array.from({length:l},(ke,be)=>{const Z=be/(l-1),G=Z*23.3;return c(G,i+1.45*(G/23.3)**2,be>0&&be<l-1)}),c(23.55,-4.62),c(23.62,-4.48),c(23.9,-4.4),c(24.45,-4.1,!0),c(24.85,-3.45,!0),c(25,-2.4,!0),c(25.02,-1.4,!0),c(24.95,-.4,!0),c(24.75,.4,!0),c(24.4,.95),c(24,1.12),c(23.85,1.3),c(23.6,1.85,!0),c(23.15,2.22,!0),c(22.65,2.38),c(22.08,2.42),c(22.05,2.28),c(22.32,2.12),c(22.32,-.35),c(21.4,-.42),c(21.35,-1.3),c(20.6,-1.3)],f=$l(kt(u,s),e===2?360:e===1?180:1,-3.7,.55,e?.085:0,n),p=Re.hinge,v=5,h=.1,m=(p.len-h*(v-1))/v,M=ke=>{const be=kt([c(0,0),c(p.r-.1,0),c(p.r,.1),c(p.r,m-.1),c(p.r-.1,m),c(.33,m),c(.33,m+.001),c(0,m+.001)],a);return Er(be,p.x,p.y,ke+m)},x=[],g=[];for(let ke=0;ke<v;ke++){const be=-5.6+ke*(m+h),Z=M(be);(ke%2===0?x:g).push(Z);const G=xn({pts:[[-.55,0],[.55,0],[.55,m-.06],[-.55,m-.06]]},[],{t:.7,bevel:.12,segs:1});G.applyMatrix4(new se().makeTranslation(p.x+.75,ke%2===0?p.y-.62:p.y+.55,be+.03).multiply(new se().makeRotationZ(ke%2===0?-.5:.35)).multiply(new se().makeRotationX(Math.PI/2).premultiply(new se().makeTranslation(0,.35,0)))),(ke%2===0?x:g).push(G)}const w=Er(kt([c(0,-.12),c(.22,-.1,!0),c(.31,-.02),c(.31,p.len+.02),c(.22,p.len+.1,!0),c(0,p.len+.12)],a),p.x,p.y,p.len/2),b=kt([c(0,0),c(2.35,0),c(2.1,.35,!0),c(1.72,.9,!0),c(1.6,1.6),c(1.62,2.5),c(1.95,2.6),c(1.98,3.15,!0),c(1.7,3.3),c(1.3,3.35),c(0,3.36)],a*2);jl(b,24.55,yo,0);const S=[-1,1].map(ke=>kt([c(0,0),c(.5,0),c(.5,.25,!0),c(.38,.38,!0),c(0,.4)],a).applyMatrix4(new se().makeTranslation(27.1,yo,ke*1.6).multiply(new se().makeRotationX(ke*-Math.PI/2)))),P=new hn,z=Re.crownR,_=Re.crownLen,R=27.95,k=30,y=k*[4,6,10][e],A=ke=>{const be=ke*_;return{r:be<.25?z*.8+(z-z*.8)*be/.25:be>_-.35?z-(be-(_-.35))**2*3.2:z,f:jt(Math.min((be-.2)/.25,(_-.25-be)/.25))}},F=[10,18,30][e];fn(P,F,y,(ke,be)=>{const Z=ke/(F-1),G=be/y*$e,K=A(Z),oe=G*k/$e%1,de=Math.pow(Math.sin(Math.PI*oe),.7),Ce=K.r-.2*K.f*(1-de);return{p:[R+Z*_,yo+Math.cos(G)*Ce,Math.sin(G)*Ce],edge:K.f*de>.9?1:0,cav:K.f*(1-de)>.8?1:0}},{wrapJ:!0,out:ke=>[0,ke[1]-yo,ke[2]]});const T=kt([c(0,0),c(z-.38,0),c(z-.62,.14,!0),c(1,.22,!0),c(0,.25)],a*2).applyMatrix4(new se().makeTranslation(R+_-.02,yo,0).multiply(new se().makeRotationZ(-Math.PI/2))),I=_t([P.geometry(),T]),Q=new hn,X=31.6,E=4.9,N=4.15,$=2.4,q=[],D=[],V=.66,O=[60,120,220][e];for(let ke=0;ke<=O;ke++){const be=Math.PI+V+($e-2*V)*ke/O,Z=Math.cos(be),G=Math.sin(be);q.push(new C(X+E*Math.sign(Z)*Math.abs(Z)**(2/$),yo,N*Math.sign(G)*Math.abs(G)**(2/$))),D.push(new C(0,1,0))}q.unshift(new C(27.1,yo,-1.95)),D.unshift(new C(0,1,0)),q.push(new C(27.1,yo,1.95)),D.push(new C(0,1,0)),Vi(Q,q,D,ke=>.6*(1-.38*Math.exp(-(((ke-.5)/.07)**2))),[10,16,24][e],!1,.5);const j=Q.geometry(),ae=new hn;if(t.chain!==!1){const ke=X+E;[[ke+1.95,yo-.15,.25,0,.12,0],[ke+5.4,yo-.55,.6,1.45,.18,0],[ke+8.75,yo-1.4,1.2,.25,-.22,.5]].forEach(([Z,G,K,oe,de,Ce])=>{const We=new se().makeTranslation(Z,G,K).multiply(new se().makeRotationFromEuler(new Nn(oe,o()*.25-.12,de)));Kl(ae,{a:2.55,b:1.55,r:.42,at:We,open:Ce,segs:[8,12,18][e],n:[36,64,110][e]})})}const ye=ae.geometry(),_e=Re.lidDome,L=Re.lidT,J=22,ue=[c(25.12,.5),c(24.95,.85,!0),...Array.from({length:J},(ke,be)=>{const Z=1-(be+1)/J,G=Z*24.6;return c(G,.95+(_e+.2-.95)*(1-(G/24.6)**2),be<J-1)})],ve=Array.from({length:J},(ke,be)=>{const Z=be/(J-1)*24.15;return c(Z,.4+(_e+.2-L-.4)*(1-(Z/24.15)**2),be>0&&be<J-1)}),pe=[c(24.15,.4),c(24.15,.08),c(24.3,0),c(25.05,0),c(25.12,.08),c(25.12,.5)],fe=Yl(kt(ue,s>>1),[[9.5,11.5,1.9,.2],[-13,-10.5,1.2,.14]]),Le=kt(ve,s>>2),Fe=kt(pe,s>>1),De=xn({pts:[[-.3,-1.1],[.4,-1.1],[.4,1.1],[-.3,1.1]]},[],{t:.62,bevel:.12,segs:1});De.translate(24.95,-.22,0);const Ue=new se().makeTranslation(0,r,0),Se=fa.degToRad(t.lidAngle??0),He=new se().makeTranslation(p.x,p.y,0).multiply(new se().makeRotationZ(Se)).multiply(new se().makeTranslation(25.55,-2.2,0)).multiply(Ue),ot=new se().makeTranslation(p.x,p.y,0).multiply(new se().makeRotationZ(Se)).multiply(new se().makeTranslation(25.55,-2.2,0));return{part:No([qt(f,"polished",n,"case-body",void 0,.3),qt(_t([...x,...S]),"polished",n+1,"case-hinge",void 0,.28),qt(w,"polished",n+2,"hinge-pin",void 0,.3),qt(_t([b]),"turned",n+3,"pendant",void 0,.28),qt(I,"polished",n+4,"crown",void 0,.3),qt(j,"polished",n+5,"bow",void 0,.26),...t.chain!==!1?[qt(ye,"polished",n+6,"chain",void 0,.3)]:[],qt(fe,"guilloche",n+7,"lid-outside",He,.24),qt(Le,"polishedIn",n+8,"lid-inside",He,.15),qt(_t([Fe,De]),"polished",n+9,"lid-rim",He,.24),qt(_t(g),"polished",n+10,"lid-hinge",ot,.28)]),lid:He,hinge:new C(p.x,p.y,0)}}function Dr(t){const e=t.detail??2,n=t.t??.1,o=t.ridge??.13,s=new hn,a=t.rb*.55,r=t.rb+.9,i=t.L,c=M=>{if(M<=r)return .2+.06*(1-jt((M-a)/(r-a)));const x=(M-r)/(i-r);return Math.max(.012,.2*(1-x)**2+t.wMax/2*Math.pow(Math.sin(Math.PI*Math.pow(x,.78)),.9)*(1-x*.15))},l=[80,140,240][e],d=[3,6,10][e],u=M=>a+(i-a)*(1-(1-M/(l-1))**1.25),f=M=>n*.45+(n*.55+o-n)*(1-Math.pow(Math.abs(M),1.4));for(const M of[-1,1])fn(s,l,d,(x,g)=>{const w=u(x),b=M*g/(d-1),S=c(w),P=jt((i-w)/.25);return{p:[b*S,f(b)*(.4+.6*P),-w],edge:g===d-1?1:g===0?.6:0}},{out:()=>[0,1,0]});const p=M=>fn(s,l,2,(x,g)=>{const w=u(x),b=c(w),S=jt((i-w)/.25);return{p:[M*b,g?f(1)*(.4+.6*S):0,-w],edge:g?1:.4}},{out:()=>[M,0,0]});p(-1),p(1),fn(s,l,2,(M,x)=>{const g=u(M),w=c(g);return{p:[(x?1:-1)*w,0,-g]}},{out:()=>[0,-1,0]});const v=s.geometry(),h=[24,40,72][e],m=kt([{r:t.hole,y:0},{r:t.rb,y:0},{r:t.rb,y:n*.7},{r:t.rb-.06,y:n+.05,smooth:!0},{r:t.hole+.08,y:n+.07},{r:t.hole,y:n+.02},{r:t.hole,y:0}],h);return _t([v,m])}function Zl(t={}){const e=t.detail??2,n=t.L??19.9,o=.55,s=3.6,a=.085,r=g=>{const w=jt(g);return w*w*(3-2*w)},i=g=>{let w=0;if(g>=0&&g<=n&&(w=Math.max(w,(.15-.1*g/n)*Math.pow(jt((n-g)/1.1),.62))),Math.abs(g)<o&&(w=Math.max(w,Math.sqrt(o*o-g*g))),g<=0&&g>=-s){const b=-g/s;w=Math.max(w,.16+.2*Math.pow(b,1.4)*(1-r((b-.82)/.18))+.04*(1-r((b-.82)/.18))*b)}return Math.max(w,1e-4)},c=[],l=[260,520,900][e];for(let g=0;g<=l;g++){const w=g/l;c.push(-s+(n+s)*(1-(1-w)**1.6))}const d=c.length,u=[3,5,7][e],f=g=>a*(.55+.45*jt((n-g)/2.5)),p=g=>.018*Math.pow(jt((g-(n-.12))/.12),2),v=(g,w)=>{const b=Math.abs(w);return f(g)*(b>.92?.42:.42+.58*(.92-b)/.92)+p(g)},h=new hn;for(const g of[-1,1])fn(h,d,u,(w,b)=>{const S=c[w],P=g*b/(u-1);return{p:[P*i(S),v(S,P),-S],edge:b===u-1?1:b===0?.8:0}},{out:()=>[0,1,0]});const m=g=>fn(h,d,2,(w,b)=>{const S=c[w];return{p:[g*i(S),b?v(S,1):p(S),-S],edge:b?1:.4}},{out:()=>[g,0,0]});m(-1),m(1),fn(h,d,2,(g,w)=>{const b=c[g];return{p:[(w?1:-1)*i(b),p(b),-b]}},{out:()=>[0,-1,0]});const M=h.geometry(),x=kt([{r:.13,y:0},{r:.36,y:0},{r:.36,y:.085},{r:.3,y:.2},{r:.22,y:.32,smooth:!0},{r:.13,y:.33}],[20,32,56][e]);return x.translate(0,.07,0),{needle:M,collet:x}}function Ql(t={}){const e=t.detail??2,n=[20,36,64][e],o=(c,l)=>new se().makeTranslation(0,l,0).multiply(new se().makeRotationY(-c)),s=Dr({L:10.6,wMax:1.55,rb:1.25,hole:.62,detail:e}),a=Dr({L:16.2,wMax:1.15,rb:.95,hole:.36,t:.09,ridge:.11,detail:e}),r=Zl({detail:e}),i=_t([kt([{r:.62,y:-.4},{r:.64,y:Re.handY.hour+.02},{r:.6,y:Re.handY.hour+.14,smooth:!0},{r:.45,y:Re.handY.hour+.15},{r:.45,y:-.4}],n),kt([{r:.36,y:-.4},{r:.37,y:Re.handY.minute+.05},{r:.34,y:Re.handY.minute+.16,smooth:!0},{r:.3,y:Re.handY.minute+.21,smooth:!0},{r:.14,y:Re.handY.minute+.22},{r:.14,y:-.4}],n),kt([{r:.13,y:-.4},{r:.13,y:Re.handY.second+.42},{r:.1,y:Re.handY.second+.5,smooth:!0},{r:.04,y:Re.handY.second+.53,smooth:!0},{r:0,y:Re.handY.second+.535}],n)]);return No([qt(s,"polished",401,"hand-hour",o(t.hour??4.9,Re.handY.hour),.25),qt(a,"polished",402,"hand-minute",o(t.minute??1.15,Re.handY.minute),.25),qt(r.needle,"lacquer",403,"hand-second",o(t.second??.64,Re.handY.second),.25),qt(r.collet,"polished",404,"hand-collet",o(t.second??.64,Re.handY.second),.25),qt(i,"polished",405,"hand-pipes",void 0,.25)])}const Ka=(t,e)=>{const n=(t*t+e*e)/(2*e);return{c:e-n,R:n}};function Jl(t,e,n){const o=new hn,s=et((t.seed??1)*59+7),a=[s()*$e,s()*$e,s()*$e],r=t.lean??0;return Bl(o,e,n,(c,l)=>{const d=1+.025*Math.sin(l*2+a[0])+.015*Math.sin(l*3+a[1]);if(c<Math.PI*.3){const M=c/(Math.PI*.3),x=t.r*d*M;return[Math.cos(l)*x,0,Math.sin(l)*x]}const f=(c-Math.PI*.3)/(Math.PI*.7)*Math.PI/2,p=t.r*d*Math.cos(f)*(1+.12*Math.sin(f*2)*(t.h>t.r?1:.4));let v=t.h*Math.sin(f);const h=t.dimple??0;if(h){const M=p/t.r;v-=h*t.h*Math.exp(-M*M/.06)}const m=r*Math.sin(f)*t.h*.25;return[Math.cos(l)*p+m,v,Math.sin(l)*p]},[0,t.h*.4,0],{cav:c=>c<Math.PI*.3?1:jt(1-(c-Math.PI*.3)*6)}),o.geometry()}const eu=[.28,.5,.85];function Xa(t,e=!1){return Jl({r:1,h:e?.42:.7,seed:e?9:3},[6,9,12][t],[10,14,20][t])}function Za(t,e,n=1,o=eu){const s=et(n*131+3),a=o.map(()=>[]);let r=0;for(;a.reduce((i,c)=>i+c.length,0)<t&&r++<t*8;){const i=e(s(),s());if(!i)continue;const c=s()<.62?0:s()<.75?1:2,l=o[c]*(.8+s()*.4),d=new Wt().setFromUnitVectors(new C(0,1,0),i.up.clone().normalize()).multiply(new Wt().setFromAxisAngle(new C(0,1,0),s()*$e));a[c].push(new se().compose(i.p,d,new C(l*(1+s()*.2),l*(.85+s()*.3),l)))}return a}function qi(t={}){const e=t.detail??2,n=t.seed??21,o=et(n*97+5),s=t.cols??7,a=t.rows??8,[r,i]=t.sett??[150,95],c=t.joint??9,l=t.hollow?.x??20,d=t.hollow?.z??15,u=t.hollow?.r??260,f=t.hollow?.depth??16,p=(D,V)=>-f*Ro(1-Math.hypot(D-l,V-d)/u),v=-f*(t.water??.3),h=vs(n+3,3),m=vs(n+9,2),M=s*(r+c),x=a*(i+c),g=new hn,w=new hn,b=[],S=[5,10,18][e],P=[4,8,12][e],z=[],_=o()*6;for(let D=-x/2;D<x/2-i*.4;){const V=i*(.72+o()*.55),O=o()*6;for(let j=-M/2-o()*r*.8;j<M/2;){const ae=r*(.55+o()*.6),ye=j+ae/2,_e=Math.sin(ye*.004+_)*16+Math.sin(ye*.011+O)*2.5,L=Math.cos(ye*.004+_)*16*.004;ye-ae/2>-M/2-1&&ye+ae/2<M/2+1&&z.push({cx:ye,cz:D+V/2+_e,w:ae,dd:V*(.88+o()*.12),rot:Math.atan(L)+(o()-.5)*.07}),j+=ae+c*(.7+o()*1.6)}D+=V+c*(.8+o()*1.2)}for(const D of z){const V=D.w,O=D.dd,j=D.cx+(o()-.5)*3,ae=D.cz+(o()-.5)*3,ye=D.rot,_e=p(j,ae)+(o()-.5)*5,L=6,J=(p(j+L,ae)-p(j-L,ae))/(2*L)*.8+(o()-.5)*.012,ue=(p(j,ae+L)-p(j,ae-L))/(2*L)*.8+(o()-.5)*.012,ve=.4+o()*1.3,pe=o()*100,fe=3.5+o()*9;b.push({cx:j,cz:ae,y:_e,gx:J,gz:ue,w:V,dd:O});const Le=Math.cos(ye),Fe=Math.sin(ye),De=(be,Z,G)=>[j+be*Le-Z*Fe,_e+G+J*be+ue*Z,ae+be*Fe+Z*Le],Ue=S+4,Se=P+4,He=(be,Z,G)=>{const K=Z+4,oe=be<=K/2?be:K-be,de=be<=K/2?-1:1;if(oe===0)return{x:de*(G-3),y:-32,rim:2};if(oe===1)return{x:de*G,y:-fe*.55,rim:1};if(oe===2)return{x:de*(G-fe*.32),y:-fe*.12,rim:.5};const Ce=(be-3)/(Z-2);return{x:-G+fe+(2*G-2*fe)*Ce,y:0,rim:0}};fn(g,Ue+1,Se+1,(be,Z)=>{const G=He(be,S,V/2),K=He(Z,P,O/2),oe=Math.max(G.rim,K.rim),de=G.x/(V/2),Ce=K.x/(O/2),We=ve*(1-Math.pow(Math.abs(de),3))*(1-Math.pow(Math.abs(Ce),3)),Je=G.x+pe,U=K.x-pe,he=(h(Je*.025,U*.025)-.5)*2.4+(h(Je*.11+5,U*.11)-.5)*.5,Me=oe>0&&oe<2?-Math.max(0,m(Je*.04+U*.04,Je*.02-U*.03)-.55)*18:0;let ge=Math.min(G.y,K.y)+(oe<2?We*(oe?.5:1)+he*(oe?.4:1):0)+Me-(G.rim>0&&K.rim>0&&oe<2?fe*.35:0);return{p:De(G.x,K.x,ge),cav:oe>=2?1:0,edge:oe===1||oe===.5?jt(1-Me*-.1):0}},{out:be=>{const Z=[be[0]-j,be[1]-(_e-30),be[2]-ae];return[Z[0]/V,Z[1]/20,Z[2]/O]}});const ot=_e-fe*.55;if(Math.hypot(j-l,ae-d)<u*1.1&&ot+J*0>v-25&&_e-32<v){const be=[],Z=[12,24,40][e];for(let G=0;G<Z;G++){const K=G/Z*4,oe=K%1,de=Math.floor(K),Ce=de===0?-V/2+V*oe:de===1?V/2:de===2?V/2-V*oe:-V/2,We=de===0?-O/2:de===1?-O/2+O*oe:de===2?O/2:O/2-O*oe;be.push([Ce,We])}fn(w,3,Z,(G,K)=>{const[oe,de]=be[K],Ce=Math.hypot(oe/(V/2),de/(O/2))||1,We=[G*1.4*oe/(V/2)/Ce,G*1.4*de/(O/2)/Ce],Je=De(oe+We[0],de+We[1],0);return{p:[Je[0],v+[1.1,.3,.02][G],Je[2]],cav:G/2,edge:0}},{wrapJ:!0,out:()=>[0,1,0]})}}const R=g.geometry(),k=[24,48,80][e],y=new hn,A=vs(n+17,3);fn(y,k,k,(D,V)=>{const O=-M/2+M*V/(k-1),j=-x/2+x*D/(k-1);return{p:[O,p(O,j)-3.5+(A(O*.08,j*.08)-.5)*4,j],cav:1}},{out:()=>[0,1,0]});const F=y.geometry();let T=0;for(let D=0;D<u;D+=2)-f*Ro(1-D/u)-3.5<v&&(T=D);T=Math.max(T+20,40);const I=new hn,Q=[6,12,20][e],X=[24,48,72][e];fn(I,Q,X,(D,V)=>{const O=T*D/(Q-1),j=V/X*$e;return{p:[l+Math.cos(j)*O,v,d+Math.sin(j)*O]}},{wrapJ:!0,out:()=>[0,1,0],nrm:()=>[0,1,0]});const E=I.geometry(),N=Array.from({length:t.ripples??7},()=>{const D=o()*$e,V=Math.sqrt(o())*T*.8;return{x:l+Math.cos(D)*V,z:d+Math.sin(D)*V,phase:o(),speed:.8+o()*.5}}),$=[qt(R,"stone",n,"setts"),qt(F,"stone",n+1,"joints"),qt(E,"puddle",n+2,"puddle")];w.p.length&&$.push(qt(w.geometry(),"water",n+3,"meniscus"));const q=(D,V)=>{let O=p(D,V);for(const j of b)Math.abs(D-j.cx)<j.w/2&&Math.abs(V-j.cz)<j.dd/2&&(O=j.y+j.gx*(D-j.cx)+j.gz*(V-j.cz)+2);return O};return{part:No($),water:{y:v,x:l,z:d,r:T},ripples:N,topAt:q}}const tu=`
attribute float aCav;
attribute float aEdge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;`,nu=`
vCav = aCav;
vEdge = aEdge;
vOP = position;
vON = normal;
#ifdef USE_INSTANCING
vOP += instanceMatrix[3].xyz * 0.731;
#endif`,ou=`
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
}`;function lr(t){t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${tu}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${nu}`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
${ou}`)}function ps(t,e){t.fragmentShader=t.fragmentShader.replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= ${e.toFixed(3)};
iblIrradiance *= ${e.toFixed(3)};
#ifdef USE_CLEARCOAT
clearcoatRadiance *= ${e.toFixed(3)};
#endif`)}const au=.3,su=`
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
float stepD = min(abs(rr - ${Re.chapterIn.toFixed(3)}), abs(rr - ${Re.chapterOut.toFixed(3)}));
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
float eCoatR = 0.016 + dustM * 0.25 + (1.0 - face) * 0.3;`,w0={value:1},ur={value:0},Gi={value:0},Ui={value:new bt(8.485,-8.485)};function ru(t={}){const e=Yo(),n=et((t.seed??1)*7919+3),o=new Gn({color:16777215,metalness:0,roughness:.3,clearcoat:1,clearcoatRoughness:.035,ior:1.52,specularIntensity:0,envMapIntensity:.5}),s={tNz:{value:e.noise},uSeed:{value:new C(n()*40,n()*40,n()*40)},uImpact:{value:new bt(t.impact?.x??-13,t.impact?.z??.8)},uCcDirect:{value:.04},uStrN:{value:new C(0,0,1)},uStrL:{value:new C(0,1,0)},uStrW:{value:.006},uStrC:{value:.7},uStrG:{value:0},uStrRef:{value:0},uStrM:w0,uCGlow:ur,uCFront:Ui,uEMode:Gi,uEnv:{value:au}};return o.onBeforeCompile=a=>{Object.assign(a.uniforms,s),lr(a),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
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
${su}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = eRough;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = eCoat;
material.clearcoatRoughness = eCoatR;`),a.fragmentShader=a.fragmentShader.replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= uEnv;
iblIrradiance *= uEnv;
clearcoatRadiance *= uEnv;`).replace("#include <opaque_fragment>",`outgoingLight *= mix(vec3(1.0), vec3(1.0, 0.1, 0.08), (1.0 - smoothstep(0.5, 0.95, vON.y)) * clamp(uCGlow * 3.0, 0.0, 1.0) * (1.0 - step(1.5, uEMode)) * (uEMode > 0.5 && uEMode < 1.5 ? cFall(length(vOP.xz - uCFront)) : 1.0));
if (uEMode > 0.5 && uEMode < 1.5) outgoingLight += vec3(0.5, 0.0, 0.0) * uCGlow * (1.0 - smoothstep(0.5, 0.95, vON.y)) * cFall(length(vOP.xz - uCFront));
if (uEMode > 0.5 && uEMode < 1.5) { float sR = length(vOP.xz - uCFront); outgoingLight += vec3(1.0, 0.0, 0.0) * uCGlow * face * (3.6 * czH + 1.6 * eQl) * cFall(sR) * 5.0; }
#include <opaque_fragment>`).replace("uniform float uEnv;",`uniform float uEnv;
uniform float uCGlow;
uniform vec2 uCFront;
float cFall(float d) { return exp(-d / 2.4) * (1.0 - smoothstep(2.5, 6.0, d)); }`),Co(a)},o.customProgramCacheKey=()=>"ss-out-enamel",Object.assign(o,{ss:s})}const iu=`
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
float lCoat = (1.0 - chip) * (1.0 - hair * 0.8) * (1.0 - rim * 0.6);`;function cu(t={}){const e=Yo(),n=et((t.seed??1)*4241+9),o=new Gn({color:16777215,metalness:0,roughness:.42,clearcoat:1,clearcoatRoughness:.025,ior:1.5,specularIntensity:0,envMapIntensity:.5,emissive:new Gt().setRGB(.0045,0,0)}),s={tNz:{value:e.noise},uSeed:{value:new C(n(),n(),n())},uLen:{value:t.len??19.9},uHair:{value:11.5+n()*2}};return o.onBeforeCompile=a=>{Object.assign(a.uniforms,s),lr(a),ps(a,.22),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
uniform float uLen;
uniform float uHair;`).replace("#include <color_fragment>",`#include <color_fragment>
${iu}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = lRough;`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = lMetal;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance *= (1.0 - chip);`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = lCoat;`).replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= mix(1.0, 0.08, chip);`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= mix(1.0, 0.15, chip);
{ vec3 cT = vec3(0.8, 0.035, 0.03); float cA = max(clearcoatSpecularDirect.r, clearcoatSpecularIndirect.r); float hot = smoothstep(12.0, 40.0, cA); clearcoatSpecularDirect *= mix(cT, vec3(1.0), hot); clearcoatSpecularIndirect *= mix(cT, vec3(1.0), hot); }`),ar(a),Co(a)},o.customProgramCacheKey=()=>"ss-out-lacquer",Object.assign(o,{ss:s})}const ji=t=>`vec3 gEx = max(outgoingLight - ${t.toFixed(3)}, 0.0);
outgoingLight = min(outgoingLight, vec3(${t.toFixed(3)})) + gEx / (1.0 + gEx * 4.0);`,Os={value:1};function lu(t={}){const e=new Gn({color:0,metalness:0,roughness:.012,ior:1.52,specularIntensity:1,envMapIntensity:t.env??.07,transparent:!0,depthWrite:!1});e.blending=An,e.blendSrc=dt,e.blendDst=er,e.blendEquation=U0;const n=t.tint??.1;return e.onBeforeCompile=o=>{o.uniforms.uGEnv=Os,ps(o,t.env??.3),o.fragmentShader=o.fragmentShader.replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= 0.0;
reflectedLight.indirectSpecular *= uGEnv;`).replace("#include <common>",`#include <common>
uniform float uGEnv;`).replace("#include <opaque_fragment>",`${ji(.38)}
float gF = ((1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)));
gl_FragColor = vec4(outgoingLight, ${n.toFixed(3)} + 0.35 * gF);`),Co(o)},e.customProgramCacheKey=()=>`ss-out-glass-${t.env??.3}`,e}const $i={value:0};function Wr(t={}){const e=new y0({color:new Gt().setScalar(t.gain??.45),metalness:1,roughness:t.rough??.2,envMapIntensity:t.env??.12,transparent:!0,depthWrite:!1,side:vo});return e.blending=An,e.blendSrc=dt,e.blendDst=dt,e.blendEquation=U0,e.onBeforeCompile=n=>{n.uniforms.uCFace=$i,n.uniforms.uCGlow=ur,n.uniforms.uCFront=Ui,ps(n,t.env??.12),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
gl_FragColor = vec4(outgoingLight, 0.0);`)},e.customProgramCacheKey=()=>`ss-out-crack-${t.face??.07}-${t.env??.12}`,e}const uu=`
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
ssRough = mix(ssRough, ssRough * 0.8 + 0.05 * vg, gIn * glim);`,n0={value:1},du=`{
float rkD = dot(vOP.xz, vec2(-0.8, 0.6)) - uRake.x;
float rkB = rkD < 0.0 ? exp(-((rkD / 1.2) * (rkD / 1.2))) : exp(-((rkD / 3.2) * (rkD / 3.2)));
float rkE = 0.25 + 0.75 * smoothstep(-22.0, 8.0, dot(vOP.xz, vec2(0.6, 0.8)));
float rk = mix(1.0, 0.08 + 0.92 * rkB * rkE, uRake.y);
reflectedLight.directDiffuse *= rk; reflectedLight.directSpecular *= rk;
reflectedLight.indirectSpecular *= uLidEnv;
}`;function pu(t){const e=an({finish:"polished",seed:t.seed,wear:t.wear,tier:t.tier,age:t.age}),n=e.onBeforeCompile,o={uCart:{value:t.cart??7},uGRim:{value:t.rim??24.6},uPitch:{value:t.pitch??.3},uRake:{value:new bt(0,1)},uLidEnv:n0};return e.onBeforeCompile=(s,a)=>{n.call(e,s,a),Object.assign(s.uniforms,o),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uCart;
uniform float uGRim;
uniform float uPitch;
uniform vec2 uRake;
uniform float uLidEnv;`).replace("#include <roughnessmap_fragment>",`${uu}
#include <roughnessmap_fragment>`).replace("#include <aomap_fragment>",`reflectedLight.directSpecular *= mix(1.0, 0.1 + 1.2 * smoothstep(0.55, 0.9, 1.0 - vg), gIn * glim);
`+du+`
#include <aomap_fragment>`)},e.customProgramCacheKey=()=>`ss-out-guilloche-${t.tier==="low"?"l":"h"}`,e}const fu=`
#include <common>
uniform vec2 uSph;
varying vec3 vDC;
varying float vDR;`,hu=`
#include <worldpos_vertex>
#ifdef USE_INSTANCING
mat4 dM = modelMatrix * instanceMatrix;
#else
mat4 dM = modelMatrix;
#endif
vDC = (dM * vec4(0.0, uSph.x, 0.0, 1.0)).xyz;
vDR = uSph.y * length(dM[0].xyz);`,mu=`
#include <common>
uniform samplerCube uCube;
uniform float uHasCube;
uniform vec3 uLd;
uniform float uCaus;
varying vec3 vDC;
varying float vDR;`,vu=`
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
outgoingLight += refr + vec3(caus);`;function gu(t={}){const e=new Gn({color:0,metalness:0,roughness:.03,ior:1.33,specularIntensity:1,envMapIntensity:2.2}),n={uCube:{value:t.cube??null},uHasCube:{value:t.cube?1:0},uSph:{value:new bt(t.sphere?.c??-.3,t.sphere?.R??1.05)},uLd:{value:(t.light??new C(-.6,.7,-.4)).clone().normalize()},uCaus:{value:t.caustic??2.2}};return e.onBeforeCompile=o=>{Object.assign(o.uniforms,n),Co(o),o.vertexShader=o.vertexShader.replace("#include <common>",fu).replace("#include <worldpos_vertex>",hu),o.fragmentShader=o.fragmentShader.replace("#include <common>",mu).replace("#include <opaque_fragment>",`${vu}
#include <opaque_fragment>`)},e.customProgramCacheKey=()=>"ss-out-drop",Object.assign(e,{ss:n})}function xu(t={}){const e=new Gn({color:0,metalness:0,roughness:.025,ior:1.33,specularIntensity:1,envMapIntensity:t.env??2.4,transparent:!0,depthWrite:!1});e.blending=An,e.blendSrc=dt,e.blendDst=er,e.blendEquation=U0;const n=t.tint??.14;return e.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("#include <opaque_fragment>",`vec3 wEx = max(outgoingLight - 0.5, 0.0);
outgoingLight = min(outgoingLight, vec3(0.5)) + wEx / (1.0 + wEx * 3.0);
float wF = ((1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)) * (1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)) * (1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)));
gl_FragColor = vec4(outgoingLight, ${n.toFixed(3)} + 0.4 * wF);`),Co(o)},e.customProgramCacheKey=()=>"ss-out-thin",e}function wu(t={}){const e=new y0({color:new Gt().setScalar(t.gain??.3),metalness:1,roughness:.12,envMapIntensity:.5,transparent:!0,depthWrite:!1});return e.blending=An,e.blendSrc=dt,e.blendDst=dt,e.blendEquation=U0,e.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aCav;
varying float vR;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vR = aCav;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying float vR;`).replace("#include <opaque_fragment>",`outgoingLight *= (1.0 - vR) * (0.35 + 0.65 * abs(dot(normalize(vViewPosition), normal)));
gl_FragColor = vec4(min(outgoingLight, vec3(0.35)), 0.0);`)},e.customProgramCacheKey=()=>"ss-out-rain",e}const yu=`
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
float sCoatR = mix(0.38, 0.22, wet) + 0.03 * (1.0 - midN);`;function bu(t={}){const e=Yo(),n=et((t.seed??1)*4271+9),o=new Gn({color:16777215,metalness:0,roughness:.6,clearcoat:1,clearcoatRoughness:.05,ior:1.33,specularIntensity:.6,envMapIntensity:1.2}),s={tNz:{value:e.noise},uSeed:{value:new C(n(),n(),n())},uWet:{value:t.wet??.45}};return o.onBeforeCompile=a=>{Object.assign(a.uniforms,s),lr(a),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
uniform float uWet;`).replace("#include <color_fragment>",`#include <color_fragment>
${yu}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = sRough;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = sCoat;
material.clearcoatRoughness = sCoatR;
material.specularF90 = mix(material.specularF90, 1.0, mica);`),Co(a)},o.customProgramCacheKey=()=>"ss-out-stone",Object.assign(o,{ss:s})}const Qa=8,Nr={name:"OutPuddle",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uTime:{value:0},uRip:{value:Array.from({length:Qa},()=>new ln(0,0,0,0))},uRipN:{value:0},uRipR:{value:60},uGain:{value:1},uLd:{value:new C(-.6,.7,-.4).normalize()},uSpec:{value:1.2}},vertexShader:`
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
uniform vec4 uRip[${Qa}];
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
  for (int i = 0; i < ${Qa}; i++) {
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
}`};function Mu(t,e={}){const n=e.y??0,o=t.clone();o.translate(0,-n,0),o.rotateX(Math.PI/2);const[s,a]=e.res??[Math.round(innerWidth*Math.min(devicePixelRatio,2)/2),Math.round(innerHeight*Math.min(devicePixelRatio,2)/2)],r=new S0(o,{textureWidth:s,textureHeight:a,color:14210256,clipBias:.002,shader:{...Nr,uniforms:fi.clone(Nr.uniforms)}});r.rotation.x=-Math.PI/2,r.position.y=n;const i=r.material.uniforms,c=(e.ripples??[]).slice(0,Qa);return c.forEach((l,d)=>i.uRip.value[d].set(l.x,l.z,l.phase,l.speed)),i.uRipN.value=c.length,i.uGain.value=e.gain??1,Object.assign(r,{ss:i})}function Br(t,e,n){switch(t){case"enamel":return ru({seed:e,impact:n.impact});case"lacquer":return cu({seed:e});case"glass":return lu();case"guilloche":return pu({seed:e,wear:n.wear,tier:n.q,age:n.age??n.wear*.5});case"polishedIn":return an({finish:"polished",seed:e,wear:n.wear,tier:n.q,age:.08});case"crack":return Wr();case"drop":return gu({cube:n.cube,sphere:n.sphere,light:n.light});case"water":return xu();case"rain":return wu();case"stone":return bu({seed:e,wet:n.wet});case"glassEdge":return Wr({gain:.75,rough:.18,env:.1,face:.03});case"grained":return Ho(an({finish:"grained",seed:e,wear:n.wear,tier:n.q,age:n.age??n.wear*.5}),Su);default:return an({finish:["polished","grained","striped","sunray","turned","brushed","blackened"].includes(t)?t:"polished",seed:e,wear:n.wear,tier:n.q,age:n.age??n.wear*.5})}}const Su=.3;function Ho(t,e){const n=t.onBeforeCompile,o=t.customProgramCacheKey;return t.onBeforeCompile=(s,a)=>{n.call(t,s,a),ps(s,e)},t.customProgramCacheKey=()=>`${o.call(t)}-e${e}`,t}function Eo(t,e,n={}){const o=new gt,s={q:e,wear:n.wear??.5,...n};for(const a of t.pieces){if(a.finish==="puddle"){const u=Mu(a.geo,{y:n.water?.y??0,ripples:n.ripples,res:e==="low"?[256,256]:void 0});u.name=a.name??"puddle",o.add(u);continue}const r=n.sphereOf?.(a.name??""),i=Br(a.finish,a.seed,{...s,...a.wear===void 0?{}:{wear:a.wear},...r?{sphere:r}:{}}),c=new je(a.geo,i);a.at&&c.applyMatrix4(a.at),c.name=a.name??"";const l=i.transparent;c.castShadow=!l&&(n.shadows??e!=="low"),c.receiveShadow=n.shadows??e!=="low";const d=i.aim;d&&(c.onBeforeRender=(u,f,p)=>d(c,p)),o.add(c)}for(const a of t.inst){if(!a.mats.length)continue;const r=n.sphereOf?.(a.name??""),i=Br(a.finish,a.seed,r?{...s,sphere:r}:s),c=new gn(a.geo,i,a.mats.length);a.mats.forEach((l,d)=>c.setMatrixAt(d,l)),c.instanceMatrix.needsUpdate=!0,c.name=a.name??"",c.castShadow=!i.transparent&&(n.shadows??e!=="low"),c.receiveShadow=n.shadows??e!=="low",c.computeBoundingSphere(),o.add(c)}return o}const Yi={"lid-out":{id:"lid-out",en:["MK"],ar:["MK"],surface:"steel",layout:{kind:"mono"},aspect:1.32,cap:.44,tex:{high:200,mid:150,low:90}},"dial-xii":{id:"dial-xii",en:["STILL HERE"],ar:["لسه هنا"],surface:"enamel",layout:{kind:"line"},aspect:6,cap:.42,tex:{high:120,mid:90,low:56}},"barrel-bridge":{id:"barrel-bridge",en:["UNADJUSTED"],ar:["غير مضبوطة"],surface:"steel",layout:{kind:"line"},aspect:8.5,cap:.42,tex:{high:110,mid:84,low:52}},cock:{id:"cock",en:["F","·","S"],ar:["سريع","·","بطيء"],surface:"steel",layout:{kind:"row",x:.18,y:.56,gap:.85},aspect:1,cap:.1,tex:{high:104,mid:80,low:48}},"pallet-bridge":{id:"pallet-bridge",en:["ONE JEWEL"],ar:["جوهرة واحدة"],surface:"steel",layout:{kind:"line"},aspect:6.5,cap:.42,tex:{high:110,mid:84,low:52}},"lid-in":{id:"lid-in",en:["FOR WHOEVER WAITS"],ar:["للي بيستنى"],surface:"steel",layout:{kind:"line",wrap:!0},aspect:1.4,cap:.44,tex:{high:110,mid:84,low:52}}},Ki=t=>t.toLowerCase().startsWith("ar")?"ar":"en",zu="/flagship-portfolio/_astro/amiri-latin-700-normal.DIjoEGk6.woff2",ku="/flagship-portfolio/_astro/amiri-arabic-700-normal.D8FrblyB.woff2",Ja={en:"ss-engrave-lat",ar:"ss-engrave-ar"},Pu={en:zu,ar:ku},Au={},Ru={};function Cu(t){return Au[t]??=(async()=>{try{if(typeof FontFace>"u"||typeof document>"u")return!1;const e=new FontFace(Ja[t],`url(${Ru[t]??Pu[t]})`,{weight:"700",style:"normal"});return await e.load(),document.fonts.add(e),await document.fonts.load(`700 64px "${Ja[t]}"`,t==="ar"?"لسه":"MK"),document.fonts.check(`700 64px "${Ja[t]}"`,t==="ar"?"لسه":"MK")}catch{return!1}})()}const Tu=.16,Fu=1.3;function dr(t,e,n){t.font=`700 ${n}px "${Ja[e]}"`}function Wa(t,e,n){dr(t,e,200);const o=t.measureText(e==="ar"?"ا":"H");return n*(e==="ar"?Fu:1)*200/Math.max(1,o.actualBoundingBoxAscent)}function ra(t,e,n,o,s=!1){if(dr(t,e,o),e==="ar"){t.direction="rtl",t.textAlign="center";const d=t.measureText(n),u=d.actualBoundingBoxAscent,f=d.actualBoundingBoxDescent;return s||t.fillText(n,0,(u-f)/2),{w:d.actualBoundingBoxLeft+d.actualBoundingBoxRight,h:u+f}}t.direction="ltr",t.textAlign="left";const a=[...n],r=a.map(d=>t.measureText(d).width),i=Tu*o,c=r.reduce((d,u)=>d+u,0)+i*(a.length-1),l=t.measureText("H").actualBoundingBoxAscent;if(!s){let d=-c/2;a.forEach((u,f)=>{u!==" "&&t.fillText(u,d,l/2),d+=r[f]+i})}return{w:c,h:l}}function _u(t,e,n){const o=t.id==="lid-out"?"en":e,s=e==="ar"?t.ar:t.en;let a=t.tex[n];const r=Math.round(a/t.cap),i=Math.round(r*t.aspect),c=document.createElement("canvas");c.width=i,c.height=r;const l=c.getContext("2d",{willReadFrequently:!0});l.fillStyle="#000",l.fillRect(0,0,i,r),l.fillStyle="#fff";const d=[];if(t.layout.kind==="line"){let p=Wa(l,o,a);const v=s[0],h=t.layout.wrap&&o==="en"?v.split(" "):[v],m=1.55,M=h.map(b=>ra(l,o,b,p,!0)),x=Math.max(...M.map(b=>b.w)),g=M[0].h*(1+m*(h.length-1)),w=Math.min(1,i*.92/x,r*.9/g);p*=w,a*=w,h.forEach((b,S)=>{l.setTransform(1,0,0,1,i/2,r/2+(S-(h.length-1)/2)*m*M[0].h*w),ra(l,o,b,p)})}else if(t.layout.kind==="mono"){const p=Wa(l,"en",a);dr(l,"en",p);const v=l.measureText("M").width,h=l.measureText("K").width,m=p*.08,M=l.measureText("H").actualBoundingBoxAscent,x=i/2-(v+m+h)/2;l.direction="ltr",l.textAlign="left",l.fillText("M",x,r/2+M/2),l.fillText("K",x+v+m,r/2+M/2),l.strokeStyle="#fff",l.lineWidth=a*.028,l.beginPath(),l.ellipse(i/2,r/2,i*.455,r*.43,0,0,Math.PI*2),l.stroke()}else if(t.layout.kind==="row"){const{x:p,y:v,gap:h}=t.layout,m=Wa(l,o,a),M=h*a,x=e==="ar"?[s[2],s[1],s[0]]:s,g=x.map(P=>P==="·"?0:ra(l,o,P,m,!0).w),w=g.reduce((P,z)=>P+z,0)+M*(x.length-1);let b=i/2*(1+p)-w/2;const S=r/2*(1-v);x.forEach((P,z)=>{P==="·"?d.push({x:b,y:S,r:a*.13}):(l.setTransform(1,0,0,1,b+g[z]/2,S),ra(l,o,P,m)),b+=g[z]+M})}else{const{r:p,a0:v,a1:h}=t.layout,m=p*i/2,M=Wa(l,o,a),x=e==="ar"?[s[2],s[1],s[0]]:s;x.forEach((g,w)=>{const b=v+(h-v)*w/(x.length-1),S=i/2+Math.cos(b)*m,P=r/2+Math.sin(b)*m;if(g==="·"){d.push({x:S,y:P,r:a*.14});return}const z=b+Math.PI/2;l.setTransform(Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),S,P),ra(l,o,g,M)})}l.setTransform(1,0,0,1,0,0);const u=l.getImageData(0,0,i,r).data,f=new Float32Array(i*r);for(let p=0;p<i*r;p++)f[p]=u[p*4]/255;return{cov:f,w:i,h:r,capTex:a,dimples:d,aspect:t.aspect}}const ma=1e20;function Hr(t,e,n,o,s){n[0]=0,o[0]=-ma,o[1]=ma;for(let a=1,r=0;a<s;a++){let i=(t[a]+a*a-(t[n[r]]+n[r]*n[r]))/(2*a-2*n[r]);for(;i<=o[r];)r--,i=(t[a]+a*a-(t[n[r]]+n[r]*n[r]))/(2*a-2*n[r]);r++,n[r]=a,o[r]=i,o[r+1]=ma}for(let a=0,r=0;a<s;a++){for(;o[r+1]<a;)r++;const i=a-n[r];e[a]=i*i+t[n[r]]}}function Or(t,e,n){const o=Math.max(e,n),s=new Float64Array(o),a=new Float64Array(o),r=new Int32Array(o),i=new Float64Array(o+1);for(let c=0;c<e;c++){for(let l=0;l<n;l++)s[l]=t[l*e+c];Hr(s,a,r,i,n);for(let l=0;l<n;l++)t[l*e+c]=a[l]}for(let c=0;c<n;c++){for(let l=0;l<e;l++)s[l]=t[c*e+l];Hr(s,a,r,i,e);for(let l=0;l<e;l++)t[c*e+l]=a[l]}}function Iu(t,e,n){const o=new Float64Array(e*n),s=new Float64Array(e*n);for(let r=0;r<e*n;r++){const i=t[r];i>=.999?(o[r]=0,s[r]=ma):i<=.001?(o[r]=ma,s[r]=0):(o[r]=Math.max(0,.5-i)**2,s[r]=Math.max(0,i-.5)**2)}Or(o,e,n),Or(s,e,n);const a=new Float32Array(e*n);for(let r=0;r<e*n;r++)a[r]=Math.sqrt(o[r])-Math.sqrt(s[r]);return a}function Na(t,e,n){let o=t*374761393+e*668265263+n*2147483647|0;return o=Math.imul(o^o>>>13,1274126177),o^=o>>>16,(o>>>0)/4294967296}function ys(t,e,n){const o=Math.floor(t),s=Math.floor(e),a=t-o,r=e-s,i=a*a*(3-2*a),c=r*r*(3-2*r),l=Na(o,s,n),d=Na(o+1,s,n),u=Na(o,s+1,n),f=Na(o+1,s+1,n);return l+(d-l)*i+(u-l)*c+(l-d-u+f)*i*c}function Lu(t,e,n,o){const s=o.capTex,a=o.grow*s,r=o.slope,i=o.depth*s,c=(o.burr??0)*s,l=Math.max(1.2,o.burrW*s),d=o.seed??1,u=o.burrDir??[.6,-.8],f=Math.hypot(u[0],u[1])||1,p=u[0]/f,v=-u[1]/f,h=Iu(t,e,n),m=new Float32Array(e*n),M=new Float32Array(e*n),x=(w,b)=>h[Math.min(n-1,Math.max(0,b))*e+Math.min(e-1,Math.max(0,w))]-a;for(let w=0;w<n;w++)for(let b=0;b<e;b++){const S=w*e+b,P=x(b,w);let z=P<0?i*Math.tanh(-P*r/i):0,_=0;if(c>0&&P>0&&P<l){const A=x(b+1,w)-x(b-1,w),F=x(b,w+1)-x(b,w-1),T=Math.hypot(A,F)||1,I=Math.min(1,Math.max(0,(A*p+F*v)/T*1.6-.2));_=c*Math.sin(Math.PI*P/l)*I*(.7+.3*ys(b/(s*.08),w/(s*.08),d+5))}for(const A of o.dimples??[]){const F=Math.hypot(b+.5-A.x,w+.5-A.y);F<A.r?(z=Math.max(z,Math.max(i*1.15,A.r*.5)*(1-(F/A.r)**2)),_=0):c>0&&F<A.r+l&&(_=Math.max(_,c*.6*Math.sin(Math.PI*(F-A.r)/l)))}m[S]=_-z;const R=z/i,k=ys(b/(s*.11),w/(s*.11),d),y=ys(b/(s*.035),w/(s*.035),d+9);M[S]=Math.min(1,Math.max(0,(R-.45)/.5)*(.5+.5*k)+Math.max(0,Math.min(1,(R-.12)/.4))*.35*y*y)}const g=new Float32Array(e*n*4);for(let w=0;w<n;w++)for(let b=0;b<e;b++){const S=w*e+b,P=Math.max(0,b-1),z=Math.min(e-1,b+1),_=Math.max(0,w-1),R=Math.min(n-1,w+1),k=(m[w*e+z]-m[w*e+P])/(z-P||1),y=(m[R*e+b]-m[_*e+b])/(R-_||1);g[S*4]=m[S]/i,g[S*4+1]=k,g[S*4+2]=-y,g[S*4+3]=M[S]}return g}function Eu(t){const e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);let n=2166136261;for(let o=0;o<e.length;o++)n^=e[o],n=Math.imul(n,16777619);return(n>>>0).toString(16).padStart(8,"0")}const Du=`
uniform vec3 uWO;
uniform vec3 uWR;
uniform vec3 uWUp;
uniform vec2 uWHalf;
varying vec3 vWF;
varying float vWNd;
varying vec3 vWRv;
varying vec3 vWUv;`,Wu=`
vec3 wRel = position - uWO;
vec3 wNo = cross(uWR, uWUp);
vWF = vec3(dot(wRel, uWR) / uWHalf.x, dot(wRel, uWUp) / uWHalf.y, dot(wRel, wNo));
vWNd = dot(normalize(normal), wNo);
mat3 wMV = mat3(modelViewMatrix);
#ifdef USE_INSTANCING
wMV = wMV * mat3(instanceMatrix);
#endif
vWRv = wMV * uWR;
vWUv = wMV * uWUp;`,Nu=`
uniform sampler2D tWords;
uniform float uWOn;
uniform float uWDepth;
uniform float uWBump;
uniform float uWCalm;
uniform float uWLit;
varying vec3 vWF;
varying float vWNd;
varying vec3 vWRv;
varying vec3 vWUv;`,Bu=`
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
#endif`,Hu=`
#ifdef USE_CLEARCOAT
material.clearcoat *= 1.0 - wCut;
#endif`,Vr=new Map,Xi=new cs(new Uint16Array(4),1,1,Js,c0);Xi.needsUpdate=!0;async function Ou(t,e,n="high"){const o=Yi[t],s=t==="lid-out"?"en":Ki(e);if(!await Cu(t==="lid-out"?"en":s))return null;const a=_u(o,s,n),r=o.surface==="steel";return{data:Lu(a.cov,a.w,a.h,{capTex:a.capTex,grow:.03,slope:1.15,depth:.09,burr:r?.006:0,burrW:.035,dimples:a.dimples,seed:t.length*31+(s==="ar"?7:1)}),w:a.w,h:a.h,aspect:a.aspect,capTex:a.capTex,ink:a.cov.reduce((c,l)=>c+l,0)}}function Vu(t,e,n="high"){const o=`${t}|${Ki(e)}|${n}`;let s=Vr.get(o);return s||(s=(async()=>{const a=await Ou(t,e,n);if(!a)return null;const{data:r}=a;for(let l=0;l<r.length;l++)if(!Number.isFinite(r[l]))return null;const i=new Uint16Array(r.length);for(let l=0;l<r.length;l++)i[l]=wc.toHalfFloat(r[l]);const c=new cs(i,a.w,a.h,Js,c0);return c.minFilter=mi,c.magFilter=hi,c.generateMipmaps=!0,c.wrapS=c.wrapT=yc,c.anisotropy=n==="low"?2:8,c.needsUpdate=!0,{tex:c,hash:Eu(r),w:a.w,h:a.h,aspect:a.aspect,cap:a.capTex/a.h}})().catch(()=>null),Vr.set(o,s)),s}function qu(t){const e=[],n=o=>{if(o.isMaterial){e.push(o);return}o.traverse(s=>{const a=s.material;s.isMesh&&a&&(Array.isArray(a)?a:[a]).forEach(r=>e.push(r))})};return(Array.isArray(t)?t:[t]).forEach(n),[...new Set(e)].filter(o=>o.isMeshStandardMaterial)}function K0(t,e,n,o,s={}){const a=Yi[t],r=s.tier??"high",i=new C(...n.right).normalize(),c=new C(...n.up),l=c.addScaledVector(i,-c.dot(i)).normalize(),d=n.height??n.width/a.aspect,u={uWO:{value:new C(...n.at)},uWR:{value:i},uWUp:{value:l},uWHalf:{value:new bt(n.width/2,d/2)},tWords:{value:Xi},uWOn:{value:0},uWDepth:{value:n.depth??d*.6},uWBump:{value:s.bump??1},uWCalm:{value:s.calm??(a.surface==="steel"?1:0)},uWLit:{value:s.lit??1}};let f=null;for(const v of qu(e)){if(v.userData.ssWords)continue;v.userData.ssWords=t;const h=v.onBeforeCompile,m=v.customProgramCacheKey.bind(v);v.onBeforeCompile=(M,x)=>{h.call(v,M,x),Object.assign(M.uniforms,u),M.vertexShader=M.vertexShader.replace("#include <common>",`#include <common>
${Du}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${Wu}`),M.fragmentShader=M.fragmentShader.replace("#include <common>",`${a.surface==="enamel"?`#define SS_W_ENAMEL
`:""}#include <common>
${Nu}`).replace("#include <lights_physical_fragment>",`${Bu}
#include <lights_physical_fragment>`).replace("#include <lights_fragment_begin>",`${Hu}
#include <lights_fragment_begin>`).replace("#include <opaque_fragment>",`outgoingLight *= mix(1.0, uWLit, wCut);
#include <opaque_fragment>`)},v.customProgramCacheKey=()=>`${m()}-w${a.surface==="enamel"?"e":"s"}`,v.needsUpdate=!0}return{ready:Vu(t,o,r).then(v=>(f=v,v?(u.tWords.value=v.tex,u.uWOn.value=1,!0):!1)),hash:()=>f?.hash??null,cap:()=>f?.cap??null,size:()=>f?[f.w,f.h]:null,uniforms:u}}function Vs(t){const e=window;(e.__secondWait??=[]).push(t)}const ia=-1.4,Zi=-14,Gu=Math.PI/180,qr=99,V0=104;function Uu(t){const e=vt(t/.72),n=e<.16?.05*ie(e/.16):.05+.95*ie((e-.16)/.84);return qr*n+(V0-qr)*ie((t-.72)/.28)}function ju(t){const e=t.getAttribute("position"),n=t.getAttribute("normal"),o=(ia-Zi)/(ia-Re.caseBottom);for(let s=0;s<e.count;s++){const a=e.getY(s);if(!(a>=ia)&&(e.setY(s,ia+(a-ia)*o),n)){const r=n.getX(s),i=n.getY(s)/o,c=n.getZ(s),l=Math.hypot(r,i,c)||1;n.setXYZ(s,r/l,i/l,c/l)}}e.needsUpdate=!0,n&&(n.needsUpdate=!0),t.computeBoundingBox(),t.computeBoundingSphere()}function $u(t,e,n,o){const s=t.onBeforeCompile,a=t.customProgramCacheKey?.bind(t);t.onBeforeCompile=(r,i)=>{s.call(t,r,i),r.uniforms.tMir={value:e},r.uniforms.uMirM={value:n},r.uniforms.uMirG=o,r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
uniform mat4 uMirM;
varying vec4 vMirUv;`).replace("#include <project_vertex>",`#include <project_vertex>
vMirUv = uMirM * modelMatrix * vec4(transformed, 1.0);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D tMir;
uniform float uMirG;
varying vec4 vMirUv;`).replace("#include <opaque_fragment>",`vec2 mUv = vMirUv.xy / vMirUv.w + normal.xz * 0.004;
outgoingLight += texture2D(tMir, mUv).rgb * uMirG;
#include <opaque_fragment>`)},t.customProgramCacheKey=()=>`${a?a():""}-mir`,t.needsUpdate=!0}const Qi={value:0};function Ji(t){const e=[],n=new Set;for(const o of t)o.traverse(s=>{const a=s.material,r=a?.ss;if(!r?.uAge||n.has(a))return;n.add(a),e.push([r,r.uAge.value]);const i=a.onBeforeCompile.bind(a),c=a.customProgramCacheKey.bind(a);a.onBeforeCompile=(l,d)=>{i(l,d),l.uniforms.uClean=Qi,l.fragmentShader=l.fragmentShader.replace("void main() {",`uniform float uClean;
void main() {`).replace("float ssH =",`pitH *= 1.0 - uClean;
scr *= 1.0 - uClean;
ssRough = mix(ssRough, rF + 0.04, uClean);
ssMetal = mix(ssMetal, mF, uClean);
float ssH =`)},a.customProgramCacheKey=()=>c()+"-clean"});return e}function Yu(t){const e=t.kit.q,n=z0(e),o=new gt,s=Xl({detail:n,lidAngle:0}),a=s.part.pieces.find(N=>N.name==="case-body");a&&ju(a.geo);const r=Eo(s.part,e,{}),i=Te.findIndex(N=>N.id==="G"),c=r.children.find(N=>N.name==="case-body")?.material??null;o.add(r);const l=Ji(r.children),d=Re.hinge,u=new gt;u.position.set(d.x,d.y,0);const f=[];r.children.slice().forEach(N=>{/^lid-/.test(N.name)&&(f.push(N),N.position.x-=d.x,N.position.y-=d.y,u.add(N))}),o.add(u);const p=N=>f.find($=>$.name===N),v=p("lid-outside"),h=p("lid-inside");v&&Ho(v.material,.25),v&&Vs(K0("lid-out",v,{at:[0,Re.lidDome+.2,0],right:[1,0,0],up:[0,0,-1],width:11,depth:.8},t.lang).ready),h&&Vs(K0("lid-in",h,{at:[0,Re.lidDome+.2-Re.lidT,0],right:[0,0,-1],up:[1,0,0],width:44,depth:1.6},t.lang,{lit:.3}).ready);let m=null;const M=6,x=/^(case-body|case-hinge|hand-(hour|minute|second|pipes)|enamel-\d|numerals-\d)$/,g={value:0};if(e!=="low"&&h){m=new S0(new j0(23.6,48),{textureWidth:512,textureHeight:512,clipBias:.02,color:16777215}),m.rotation.x=Math.PI/2,m.position.set(25.55,Re.caseTop-d.y+.32,0);const $=m.material;$.colorWrite=!1,$.depthWrite=!1,m.renderOrder=-1,m.camera.layers.set(M),u.add(m),$u(h.material,m.getRenderTarget().texture,$.uniforms.textureMatrix.value,g);const q=m.onBeforeRender.bind(m);let D=!1;m.onBeforeRender=(V,O,j,ae,ye,_e)=>{const L=f.map(J=>J.visible);f.forEach(J=>J.visible=!1),D||(D=!0,O.traverse(J=>{let ue=J,ve="";for(;ue&&!ve;)ve=ue.name,ue=ue.parent;(J.isLight||x.test(ve))&&J.layers.enable(M)})),w0.value=0,q(V,O,j,ae,ye,_e),w0.value=1,f.forEach((J,ue)=>J.visible=L[ue])}}const w=qi({detail:n,hollow:{x:0,z:0,r:200,depth:2},water:.6,ripples:0}),b=Eo(w.part,e,{water:w.water,ripples:w.ripples,shadows:e!=="low"});b.position.y=Zi+1.4-w.water.y,o.add(b);const S=et(404),P=Za(46,()=>{const N=S()*Math.PI*2,$=6+Math.sqrt(S())*70;return{p:new C(Math.cos(N)*$,6+S()*48,Math.sin(N)*$),up:new C((S()-.5)*.3,1,(S()-.5)*.3)}},5,[.35,.6,1]),z=Za(34,(N,$)=>{const q=9+Math.pow(N,.6)*15,D=Math.PI+($-.5)*2.4*(1-N*.3),V=Math.cos(D)*q,O=Math.sin(D)*q,j=.95+(Re.lidDome+.2-.95)*(1-(q/24.6)**2)+Re.caseTop-.01;return{p:new C(V-d.x,j-d.y,O),up:new C(0,1,0)}},9,[.22,.38,.6]),_=No([],[...P.map((N,$)=>({geo:Xa(n),finish:"drop",seed:80+$,mats:N,name:`air-${$}`}))]),R=No([],[{geo:Xa(n,!0),finish:"drop",seed:90,mats:z.flat(),name:"beads"}]),k=Eo(_,e,{shadows:!1,sphereOf:()=>Ka(1,.7)}),y=Eo(R,e,{shadows:!1,sphereOf:()=>Ka(1,.42)});o.add(k),u.add(y),r.updateMatrixWorld(!0);const A=new ga,F=new C(0,-1,0),T=et(431),I=[[200,4.5],[232,3.5],[158,3],[268,4]],Q=Za(40,(N,$)=>{const q=I[Math.min(3,Math.floor(T()*4))],D=(q[0]+(N-.5)*2*q[1]*(.4+.6*T()))*Math.PI/180,V=22.9+$*1.7;A.set(new C(V*Math.sin(D),20,-V*Math.cos(D)),F);const O=A.intersectObjects(r.children,!1)[0];if(!O?.face)return null;const j=O.face.normal.clone().transformDirection(O.object.matrixWorld);return j.y<.6?null:{p:O.point.clone().addScaledVector(j,-.01),up:j}},13,[.16,.26,.4]),X=Eo(No([],[{geo:Xa(n,!0),finish:"drop",seed:93,mats:Q.flat(),name:"gate-drops"}]),e,{shadows:!1,sphereOf:()=>Ka(1,.42)});X.visible=!1,o.add(X);let E=0;return{group:o,lid:u,street:b,air:k,lidAngle:()=>E,update(N){const $=N.i;b.visible=k.visible=$<=3,X.visible=$===i,u.visible=$<=3||$>=9,m&&(m.visible=$<=0||$>=9,g.value=m.visible?$===0?.08:.12:0),n0.value=$===0?.12:1,c&&(c.envMap=t.scene.environment,c.envMapIntensity=$===1?.03:$===i&&N.local("G")>.3?.04:t.scene.environmentIntensity);const q=$===i&&(N.inHold||N.u>.3),D=q||$>=9;for(const[j,ae]of l)j.uAge.value=D?0:ae;Qi.value=D?1:0;let V=Uu(N.local("0"));const O=N.trick("0");if(O.k>0){const j=O.phase,ae=ie(j/.55)*(1-ie((j-.62)/.2)),ye=j>.62&&j<.95?Math.sin((j-.62)*60)*Math.exp(-(j-.62)*14)*.45:0;V-=(3.5*ae+ye)*O.k}if($>=9){V=V0;const j=N.trick("8");j.rare>=0&&(V=V0*(1-ie(Math.max(0,j.rare-.85)/.15)))}E=V,u.rotation.z=V*Gu}}}const bs=Math.PI/180,Ku={n:6},ca=ko,rs={v:-1},f0={x:30,z:0,r:260,water:.72,stone:.03},Gr=-14+1.4,Ur=2.6,Ba={lift:60,shift:[-34,39],turn:Math.PI},qs=Math.PI*2,va={mirrorShut:.62,fall:.07},Ha={angle:.25,blade:.5},Xu=1,Zu=va.mirrorShut+va.fall;function Qu(t){const e=Math.floor(t),n=t-e,o=ie(n/.09)+.1*Math.sin(vt((n-.09)/.25)*Math.PI)*Math.exp(-n*4);return Ao+(e+o)*qs/60}const Ju=`
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
}`,e1=`
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
}`;function t1(t,e,n){const o=t.kit.q,s=new gt,a=Te.findIndex(G=>G.id==="8"),r=qi({detail:z0(o),seed:27,hollow:{x:f0.x,z:f0.z,r:f0.r,depth:16},water:f0.water,ripples:8}),i=Eo(r.part,o,{water:r.water,ripples:r.ripples,shadows:o!=="low"});i.position.y=Gr-r.water.y,s.add(i),i.traverse(G=>{const K=G.material;if(K&&K.ss?.uWet){K.ss.uWet.value=1;const oe=K.onBeforeCompile.bind(K);K.onBeforeCompile=(de,Ce)=>{oe(de,Ce),de.fragmentShader=de.fragmentShader.replace("diffuseColor.rgb = sc;",`diffuseColor.rgb = sc * ${f0.stone.toFixed(3)};`)},K.customProgramCacheKey=()=>"stone-soaked"}});const c=i.getObjectByName("setts");c&&(c.visible=!1);const l=i.getObjectByName("joints");l&&(l.visible=!1);const d=i.getObjectByName("puddle"),u=Gr;d?.ss&&(d.ss.uRipR.value=22,d.ss.uSpec.value=.6,d.ss.uLd.value.set(.1,1,.12).normalize());const f=o==="low"?260:620,p=150,v=et(8080),h=new Sa;h.index=new s0(new Uint16Array([0,1,2,0,2,3]),1),h.setAttribute("position",new rt([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3));const m=new Float32Array(f*4);for(let G=0;G<f;G++){const K=v()*qs,oe=Math.sqrt(v())*110;m.set([Math.cos(K)*oe-10,Math.sin(K)*oe,v()*p,.75+v()*.5],G*4)}h.setAttribute("aR",new vn(m,4)),h.instanceCount=f;const M={uTime:{value:0},uFreeze:{value:0},uY0:{value:u},uH:{value:p},uLen:{value:16},uBF:{value:new C},uBD:{value:new C(0,-1,0)},uBC:{value:.95},uGain:{value:.32}},x=new un({uniforms:M,vertexShader:Ju,fragmentShader:e1,transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendEquation:U0}),g=new je(h,x);g.frustumCulled=!1,s.add(g);const w=new gt,b=new ls;b.moveTo(-.9,-3),b.lineTo(-.55,0),b.lineTo(-.06,40),b.lineTo(.06,40),b.lineTo(.55,0),b.lineTo(.9,-3),b.closePath();const S=new je(new gi(b,{depth:.3,bevelEnabled:!0,bevelThickness:.08,bevelSize:.08,bevelSegments:2}),new Pn({color:3802114})),P=new je(new no(1,1),new un({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uLead:{value:-1},uTrail:{value:-1},uAsp:{value:1.78},uP:{value:new bt(-1.02,-1.04)}},vertexShader:"varying vec2 vU; void main() { vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uLead;
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
}`})),z=new gt;z.add(S),w.add(z,P),w.visible=!1;const _=Re.hinge,R=Re.lidDome+.2-Re.lidT-.35-_.y,k=et(77),y=new l0(1,20,14),A=new y0({color:394758,roughness:.05,metalness:.2,envMapIntensity:2.5}),F=Array.from({length:Ku.n},()=>({z:(k()-.5)*26,ph:k(),sp:.06+k()*.05,r:.45+k()*.35,wob:k()*6})),T=F.map(G=>{const K=new je(y,A);return K.scale.set(G.r,G.r*.55,G.r),e.lid.add(K),K}),I=e.lid.getObjectByName("lid-inside"),Q=(G,K)=>{if(!I)return R;const de=new ga(e.lid.localToWorld(new C(G-_.x,-40,K)),new C(0,1,0).transformDirection(e.lid.matrixWorld)).intersectObject(I,!1)[0];return de?e.lid.worldToLocal(de.point.clone()).y:R};e.group.updateMatrixWorld(!0);const X=F.map(G=>Array.from({length:25},(K,oe)=>{const de=21-oe/24*42;return Q(de,G.z*Math.sqrt(Math.max(0,1-(de/24)**2)))})),E=new ga,N=new bt,$=new Ma(new C(0,1,0),-u),q=new C,D=d?.ss?.uRip?.value??[],V={uRip:{value:D},uRipN:{value:0},uTime:{value:0},uR:{value:22},uC:{value:new C(f0.x,u+.05,f0.z)},uPR:{value:92}},O=new un({uniforms:V,transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendEquation:U0,vertexShader:`varying vec3 vW;
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
}`}),j=new je(new no(220,220).rotateX(-Math.PI/2),O);j.position.copy(V.uC.value),j.renderOrder=4,s.add(j);const ae=et(31),ye=Array.from({length:6},()=>[ae(),.7+ae()*.6]),_e=[];e.lid.traverse(G=>{G.isReflector&&_e.push(G)});const L=new se().makeTranslation(Ba.shift[0],Ba.lift+u,Ba.shift[1]).multiply(new se().makeScale(1,-1,1)).multiply(new se().makeTranslation(0,-u,0)).multiply(new se().makeRotationY(Ba.turn));let J=V0,ue=1;if(d){const G=d.onBeforeRender.bind(d);d.onBeforeRender=(K,oe,de,Ce,We,Je)=>{if(!s.visible){G(K,oe,de,Ce,We,Je);return}const U=n.hand.rotation.y,he=e.lid.rotation.z;pe&&(M.uFreeze.value=1,n.hand.rotation.y=-Ao),e.lid.rotation.z=J*bs;const Me=e.air.visible,ge=_e.map(ce=>ce.visible);e.air.visible=!1,_e.forEach(ce=>ce.visible=!1);for(const ce of[e.group,n.group])ce.matrixAutoUpdate=!1,ce.matrix.copy(L),ce.matrixWorldNeedsUpdate=!0;let Pe=null;oe.traverse(ce=>{!Pe&&ce.isSpotLight&&(Pe=ce)});const B=Pe,ne=B?.position.clone(),te=B?.target.position.clone(),ze=B?.intensity??0,xe=n0.value,we=oe.environmentIntensity;n0.value*=ue,oe.environmentIntensity=we*ue,B&&(B.intensity*=ue,B.position.applyMatrix4(L),B.target.position.applyMatrix4(L),B.updateMatrixWorld(),B.target.updateMatrixWorld()),He.uniforms.uG.value=o==="low"?Ur*.55:Ur,G(K,oe,de,Ce,We,Je),He.uniforms.uG.value=1,n0.value=xe,oe.environmentIntensity=we,B&&ne&&te&&(B.intensity=ze,B.position.copy(ne),B.target.position.copy(te),B.updateMatrixWorld(),B.target.updateMatrixWorld());for(const ce of[e.group,n.group])ce.matrixAutoUpdate=!0,ce.updateMatrix(),ce.updateMatrixWorld(!0);e.air.visible=Me,_e.forEach((ce,Ve)=>ce.visible=ge[Ve]),M.uFreeze.value=ve,n.hand.rotation.y=U,e.lid.rotation.z=he}}let ve=0,pe=!1;const fe=new C,Le=new C,Fe=new Wt,De=new C(0,1,0);let Ue=null,Se=!1;const He=new un({uniforms:{uL:{value:new C(.35,1,.25).normalize()},uG:{value:1}},vertexShader:"varying vec3 vN; varying vec3 vV; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uL;
uniform float uG;
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN);
  float d = 0.5 + 0.5 * dot(n, uL), h = pow(max(dot(n, normalize(uL + vV)), 0.0), 24.0);
  gl_FragColor = vec4(vec3((0.07 + 0.1 * d + 0.16 * h) * uG, 0.0, 0.0), 1.0);
}`}),ot=n.hand.children.filter(G=>G.name==="hand-second"||G.name==="hand-collet"),ke=ot.map(G=>G.material);let be=!1;const Z=G=>{G!==be&&(be=G,ot.forEach((K,oe)=>K.material=G?He:ke[oe]))};return{group:s,update(G){Se&&(t.scene.environmentIntensity=1,Se=!1);const K=G.i,oe=K===a;s.visible=oe,Z(oe&&G.inHold),oe&&G.inHold&&(Zn.gain.value=0),w.parent!==G.camera&&G.camera.add(w);const de=rs.v>=0?rs.v:K===a&&!G.inHold?G.u:-1;if(w.visible=de>0&&de<ca.trail[1]+.02,w.visible){const B=G.camera.fov*bs,ne=6,te=Math.tan(B/2)*ne,ze=te*G.camera.aspect,xe=Ns(de,ca.lead),we=de<ca.trail[0]?-1:Ns(de,ca.trail);P.position.set(0,0,-ne),P.scale.set(ze*2,te*2,1),P.renderOrder=10;const ce=P.material.uniforms;ce.uLead.value=xe,ce.uTrail.value=we,ce.uAsp.value=G.camera.aspect,z.position.set(ze*ce.uP.value.x,te*ce.uP.value.y,-ne+.5),z.scale.setScalar(Math.hypot(ze*2.1,te*2.1)*1.05/40),z.rotation.z=-we,S.visible=de>=ca.trail[0]-.03}if(!oe){T.forEach(B=>B.visible=!1);return}const Ce=G.state.reduced?0:G.state.time,We=G.trick("8"),Je=We.rare,U=Je>=0?ie(vt(Je/va.mirrorShut)):0;J=V0*(1-U),ue=(1-ie((U-.45)/.4))**2;const he=Je>=0?vt((Je-va.mirrorShut)/va.fall):0,Me=Je>=Zu;if(Je>=0){const B=he<1?V0*(1-he*he):0;e.lid.rotation.z=B*bs}ve=Me?1:0,T.forEach((B,ne)=>{const te=F[ne],ze=((Ce*te.sp+te.ph)%1+1)%1,xe=ze*ze,we=21-xe*42,ce=te.z*Math.sqrt(Math.max(0,1-(we/24)**2))+Math.sin(ze*9+te.wob)*.6,Ve=(21-we)/42*24,Ze=Math.min(23,Math.floor(Ve)),Ke=X[ne][Ze]+(X[ne][Ze+1]-X[ne][Ze])*(Ve-Ze);B.position.set(we-_.x,Ke-te.r*.45,ce),B.visible=!Me&&ze<.96&&Math.hypot(we,ce)<23}),pe=We.on||Me,M.uFreeze.value=ve,e.air.visible=Me,g.visible=!Me,i.visible=!Me,e.street.visible=Me;const ge=Me?0:Ce;n.hand.rotation.y=-(Me?Ao:Qu(ge)),M.uTime.value=Ce;let Pe=null;if(t.scene.traverse(B=>{!Pe&&B.isSpotLight&&(Pe=B)}),Pe){const B=Pe;if(Me){const te=Te[0].light.blade,ze=1+(Xu/(Te[9].exposure??1)-1)*1;if(B.position.lerp(fe.set(...te.from),1),B.target.position.lerp(fe.set(...te.to),1),B.angle+=(te.angle*Ha.angle-B.angle)*1,B.intensity=(B.intensity+(te.power*.4*Ha.blade-B.intensity)*1)*ze,B.updateMatrixWorld(),B.target.updateMatrixWorld(),Ue||t.scene.traverse(xe=>{const we=xe.material?.uniforms;!Ue&&xe.renderOrder===5&&we?.uCam&&we?.uGain&&(Ue=xe)}),Ue){const xe=Ue.material.uniforms,we=Te[0].light,ce=fe.set(...te.from),Ve=Le.set(...te.to).sub(ce),Ze=Ve.length()*1.15;Ue.position.lerp(ce,1),Fe.setFromUnitVectors(De,Ve.normalize().negate()),Ue.quaternion.slerp(Fe,1);const Ke=Math.tan(te.angle*Ha.angle)*Ze;Ue.scale.lerp(Le.set(Ke,Ze,Ke),1),xe.uGain.value=(xe.uGain.value+(we.haze*.18*Ha.blade-xe.uGain.value)*1)*ze}n0.value=(n0.value+(.12-n0.value)*1)*ze,t.scene.environmentIntensity=ze,Se=!0}M.uBF.value.copy(B.position),M.uBD.value.copy(B.target.position).sub(B.position).normalize(),M.uBC.value=Math.cos(B.angle)}if(d?.ss){const B=d.ss;B.uTime.value=Me?0:Ce,V.uTime.value=B.uTime.value,B.uRipN.value=8;for(let te=0;te<6;te++){const[ze,xe]=ye[te],we=Math.floor(Ce*xe*.45+ze),ce=et(te*977+we*13+5),Ve=ce()*qs,Ze=30+Math.sqrt(ce())*70;D[te].set(Math.cos(Ve)*Ze-10,Math.sin(Ve)*Ze,ze,Me?0:xe)}const ne=We.on?We.k:0;N.set((G.state.pointer.x-.5)*2,-(G.state.pointer.y-.5)*2),E.setFromCamera(N,G.camera),ne>0&&E.ray.intersectPlane($,q)?(D[6].set(q.x,q.z,0,1.8),D[7].set(q.x,q.z,.5,1.8)):(D[6].set(0,0,0,0),D[7].set(0,0,0,0),B.uRipN.value=6),Me&&(B.uRipN.value=0),V.uRipN.value=B.uRipN.value,j.visible=!Me}}}}const ec=[];function pr(t){ec.push(t)}function n1(){for(const t of ec)t()}function o1(t,e){t instanceof za&&t.environment&&e.has(t.environment)&&(t.environment=e.get(t.environment)),t.traverse(n=>{const o=n.material;if(o)for(const s of Array.isArray(o)?o:[o]){const a=s;for(const r of Object.keys(a)){const i=a[r];i instanceof Sr&&e.has(i)&&(a[r]=e.get(i),s.needsUpdate=!0)}if(a.uniforms)for(const r of Object.values(a.uniforms))r&&r.value instanceof Sr&&e.has(r.value)&&(r.value=e.get(r.value))}})}const a1=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,s1=`
uniform sampler2D tSrc;
varying vec2 vUv;
void main() {
  vec4 s4 = texture2D(tSrc, vUv);
  vec3 c = s4.rgb * clamp(s4.a - 1.0, 0.0, 1.0);
  float r = c.r, o = max(c.g, c.b);
  float purity = clamp((r - 3.2 * o) / max(r, 1e-4), 0.0, 1.0);
  float lift = smoothstep(0.05, 0.6, r);
  gl_FragColor = vec4(vec3(r, o * 0.15, o * 0.15) * purity * lift, 1.0);
}`,r1=`
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
}`,i1=`
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
}`,c1=`
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
}`,l1=`
uniform sampler2D tSrc;
varying vec2 vUv;
void main() { gl_FragColor = texture2D(tSrc, vUv); }`,Ge={on:0,columns:[],floorY:0,red:new C,redSize:new C(1,1,1),redPower:0,ruby:new C,rubyPower:0,bladeGain:1,wake:0,fadeTop:0,fadeLen:0,steps:0,reflSteps:0,bladeFrom:new C,bladeDir:new C(0,-1,0),bladeCos:.98,bladePower:0,nave:new ln,pulseC:new C,pulseR:-1,pulseW:1,pulseG:0,time:0};function u1(t,e){const n=new In;n.setAttribute("position",new rt([-1,-1,0,3,-1,0,-1,3,0],3));const o=new xi(-1,1,1,-1,0,1),s=new je(n);s.frustumCulled=!1;const a=new za;a.add(s);const r=(q,D)=>new un({vertexShader:a1,fragmentShader:q,uniforms:D,depthTest:!1,depthWrite:!1}),i=r(s1,{tSrc:{value:null}}),c=r(r1,{tSrc:{value:null},uDir:{value:new bt}}),l=r(l1,{tSrc:{value:null}}),d=r(c1,{tDepth:{value:null},tNz:{value:Yo().noise},uInvProj:{value:new se},uCamW:{value:new se},uCamP:{value:new C},uBA:{value:new C},uBD:{value:new C},uBCos:{value:.98},uBPow:{value:0},uCols:{value:Array.from({length:16},()=>new ln)},uNCol:{value:0},uRC:{value:new C},uRS:{value:new C(1,1,1)},uRP:{value:0},uRuby:{value:new C},uRuP:{value:0},uPC:{value:new C},uPR:{value:-1},uPW:{value:1},uPG:{value:0},uFloor:{value:0},uVFade:{value:new bt},uT:{value:0},uSteps:{value:e==="low"?18:24},uRSteps:{value:24},uNave:{value:new ln}}),u=new a0(1,1,{type:c0}),f=r(i1,{tVol:{value:u.texture},uVolOn:{value:0},uVTexel:{value:new bt},tColor:{value:null},tDepth:{value:null},tB1:{value:null},tB2:{value:null},tB3:{value:null},tFade:{value:null},uFade:{value:0},uSweep:{value:-9},uNear:{value:.01},uFar:{value:100},uFocus:{value:10},uFocusN:{value:10},uFocusF:{value:10},uAperture:{value:6},uMaxBlur:{value:10},uTexel:{value:new bt},uExposure:{value:1},uNeutral:{value:0},uBloom:{value:1},uGrain:{value:.04},uSeed:{value:0},uVig:{value:.8},uAspect:{value:1},uCover:{value:0},uRim:{value:0},uAO:{value:e==="high"&&!location.search.includes("noao")?1:0},uKAO:{value:Array.from({length:12},(q,D)=>{const V=D*2.39996+.7,O=(D+.5)/12;return new bt(Math.fround(Math.cos(V)*O),Math.fround(Math.sin(V)*O))})},uKDOF:{value:Array.from({length:16},(q,D)=>{const V=D*2.39996,O=Math.sqrt((D+.5)/16);return new bt(Math.fround(Math.cos(V)*O),Math.fround(Math.sin(V)*O))})}}),p=(q,D)=>{s.material=q,t.setRenderTarget(D),t.render(a,o)},v=e==="high"&&!location.search.includes("nomsaa")?4:0,h=()=>{const q=new wi(1,1);return q.type=bc,q},m=new a0(1,1,{type:c0,samples:v,...v?{}:{depthTexture:h()}}),M=v?new a0(1,1,{type:Es,depthTexture:h()}):null,x=new Pn({colorWrite:!1}),g=[],w=[],b=()=>{},S=new a0(1,1,{type:Es}),P=[0,1,2].map(()=>[0,1].map(()=>new a0(1,1,{type:c0})));let z=1,_=1;function R(q,D){z=q,_=D,m.setSize(q,D),S.setSize(q,D),M?.setSize(q,D),u.setSize(Math.max(1,q>>1),Math.max(1,D>>1)),P.forEach((V,O)=>V.forEach(j=>j.setSize(Math.max(1,q>>O+1),Math.max(1,D>>O+1))))}function k(q,D){}const y=new Float64Array(1),A=new Int32Array(y.buffer);let F=0,T=0;pr(()=>{T++});const I=q=>{y[0]=q,F=Math.imul(F^A[0],16777619)^A[1],F=Math.imul(F,16777619)},Q=q=>{const D=q.elements;for(let V=0;V<16;V++)I(D[V])},X=[];function E(q){if(!t.shadowMap.enabled)return;q.updateMatrixWorld(),F=2166136261,I(T),X.length=0,q.traverseVisible(V=>{if(V.isLight){V.castShadow&&V.shadow&&X.push(V);return}const O=V;if(!V.castShadow||!O.geometry)return;I(O.id),Q(O.matrixWorld),I(O.geometry.id),I(O.geometry.attributes.position?.version??0),I(O.geometry.drawRange.start),I(O.geometry.drawRange.count);for(const ae of Array.isArray(O.material)?O.material:[O.material])ae&&(I(ae.id),I(ae.visible?1:0),I(ae.side),I(ae.alphaTest));const j=V;if(j.isInstancedMesh){I(j.count);const ae=j.instanceMatrix.array;for(let ye=0,_e=Math.min(ae.length,j.count*16);ye<_e;ye++)I(ae[ye])}});const D=F;for(const V of X){F=D,Q(V.matrixWorld);const O=V;O.target&&Q(O.target.matrixWorld),I(O.angle??0),I(O.distance??0),I(O.shadow.mapSize.x),I(O.shadow.bias),I(O.shadow.radius);const j=O.shadow;V.intensity<=0||j.autoUpdate===!1&&j.ssKey===void 0||(j.autoUpdate=!1,(j.ssKey!==F||!j.map)&&(j.needsUpdate=!0,j.ssKey=F))}}function N(q,D){if(E(q),t.setRenderTarget(m),t.clear(),t.info.render.calls,t.shadowMap.autoUpdate,t.render(q,D),!M)return;g.length=0,w.length=0,q.traverseVisible(O=>{const j=O.material;j&&!Array.isArray(j)&&(j.transparent||!j.depthWrite)&&g.push(O),O.isReflector&&w.push({o:O,f:O.onBeforeRender})}),g.forEach(O=>{O.visible=!1}),w.forEach(O=>{O.o.onBeforeRender=b}),q.overrideMaterial=x;const V=t.shadowMap.autoUpdate;t.shadowMap.autoUpdate=!1,t.setRenderTarget(M),t.clear(),t.render(q,D),q.overrideMaterial=null,t.shadowMap.autoUpdate=V,g.forEach(O=>{O.visible=!0}),w.forEach(O=>{O.o.onBeforeRender=O.f})}function $(q,D,V){const O=m.texture;i.uniforms.tSrc.value=O,p(i,P[0][0]);let j=P[0][0];for(let ye=0;ye<3;ye++){ye>0&&(l.uniforms.tSrc.value=j.texture,p(l,P[ye][0]));const[_e,L]=P[ye],J=1/_e.width,ue=1/_e.height;c.uniforms.tSrc.value=_e.texture,c.uniforms.uDir.value.set(J*1.5,0),p(c,L),c.uniforms.tSrc.value=L.texture,c.uniforms.uDir.value.set(0,ue*1.5),p(c,_e),j=_e}const ae=f.uniforms;if(ae.tColor.value=O,ae.tDepth.value=M?M.depthTexture:m.depthTexture,ae.tB1.value=P[0][0].texture,ae.tB2.value=P[1][0].texture,ae.tB3.value=P[2][0].texture,ae.tFade.value=V===S?P[2][1].texture:S.texture,ae.uFade.value=V===S?0:D.fade,ae.uSweep.value=V===S?-9:D.sweep??-9,ae.uNear.value=q.near,ae.uFar.value=q.far,ae.uFocus.value=D.focus,ae.uFocusN.value=D.focusN??D.focus,ae.uFocusF.value=D.focusF??D.focus,ae.uAperture.value=D.aperture*_/1e3,ae.uMaxBlur.value=(e==="low"?6:12)*(D.blurMul??1),ae.uTexel.value.set(1/z,1/_),ae.uExposure.value=D.exposure,ae.uNeutral.value=D.neutral??0,ae.uBloom.value=D.bloom,ae.uGrain.value=D.grain,ae.uSeed.value=D.seed,ae.uVig.value=D.vig,ae.uAspect.value=z/_,ae.uCover.value=D.cover,ae.uRim.value=D.rim??0,ae.uVolOn.value=Ge.on,Ge.on){const ye=d.uniforms;ye.tDepth.value=ae.tDepth.value,ye.uInvProj.value.copy(q.projectionMatrixInverse),ye.uCamW.value.copy(q.matrixWorld),ye.uCamP.value.setFromMatrixPosition(q.matrixWorld),ye.uBA.value.copy(Ge.bladeFrom),ye.uBD.value.copy(Ge.bladeDir),ye.uBCos.value=Ge.bladeCos,ye.uBPow.value=Ge.bladePower*Ge.bladeGain;const _e=Math.min(16,Ge.columns.length);ye.uNCol.value=_e;for(let J=0;J<_e;J++)ye.uCols.value[J].set(Ge.columns[J][0],Ge.columns[J][1],Ge.columns[J][2],Ge.columns[J][3]);ye.uRC.value.copy(Ge.red),ye.uRS.value.copy(Ge.redSize),ye.uRP.value=Ge.redPower,ye.uRuby.value.copy(Ge.ruby),ye.uRuP.value=Ge.rubyPower,ye.uPC.value.copy(Ge.pulseC),ye.uPR.value=Ge.pulseR,ye.uPW.value=Ge.pulseW,ye.uPG.value=Ge.pulseG,ye.uFloor.value=Ge.floorY,ye.uVFade.value.set(Ge.fadeTop,Ge.fadeLen),ye.uT.value=Ge.time,ye.uNave.value.copy(Ge.nave);const L=Ge.steps||(e==="low"?18:24);ye.uSteps.value=L,ye.uRSteps.value=Ge.reflSteps||L,p(d,u),ae.uVTexel.value.set(1/u.width,1/u.height)}p(f,V)}return{setSize:R,useGtao:k,drawScene:N,finish:$,fadeTarget:S,get size(){return[z,_]}}}const d1=`
{
  float ssNL = dot( geometryNormal, directLight.direction );
  float ssW = saturate( ssNL * 0.6 + 0.4 );
  vec3 ssC = material.diffuseColor;
  #if defined( STANDARD ) || defined( PHONG )
  ssC += material.specularColor * 0.6;
  #endif
  vec3 ssA = directLight.color * ssW * ssW * RECIPROCAL_PI * ssC;
  reflectedLight.directDiffuse += ssA / (1.0 + ssA * 4.0);
}`;{const t=Mc,e=t.lights_fragment_begin,n=e.indexOf("getPointLightInfo"),o="RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",s=e.indexOf(o,n);n>0&&s>n&&!e.includes("ssNL")&&(t.lights_fragment_begin=e.slice(0,s)+d1+e.slice(s+o.length))}const p1=`
varying vec3 vP;
varying vec3 vN;
varying vec3 vW;
void main() {
  vP = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,f1=`
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
}`;function h1(t,e,n){const o=new yi(15921129,10,0,.2,.55,0);o.castShadow=n!=="low",o.shadow.mapSize.set(n==="high"?2048:1024,n==="high"?2048:1024),o.shadow.bias=-4e-4,o.shadow.normalBias=.02,o.shadow.camera.near=1,o.shadow.camera.far=400,e.add(o,o.target);const s=new Sc(16711688,20,30,1.6);e.add(s);const a=new zc(2763306,0,.08);e.add(a);const r=new un({vertexShader:p1,fragmentShader:f1,transparent:!0,depthWrite:!1,blending:bi,side:vo,uniforms:{uGain:{value:.3},uSeed:{value:0},uCam:{value:new C}}}),i=new kc(1,1,32,1,!0);i.translate(0,-.5,0);const c=new je(i,r);c.frustumCulled=!1,c.renderOrder=5,e.add(c);const l=[],d=[],u=()=>{const h=new Mi(t);[0,1,2].forEach(m=>{const M=new za;M.background=new Gt(0);const x=(w,b,S,P,z,_,R,k=1)=>{const y=new je(new no(w,b),new Pn({color:new Gt(S).multiplyScalar(k),side:vo}));y.position.set(P,z,_),y.rotation.y=R,y.lookAt(0,0,0),M.add(y)};x(1.2,9,9079434,-6,2,-3,0,5),x(.6,9,5921370,6,1,2,0,5),x(10,.5,6974058,0,7,0,0,2.5),m<2&&x(.8,7,16711684,4,-2,-6,0,m?.35:.12);const g=h.fromScene(M,.02);d[m]?.dispose(),d[m]=g,l[m]=g.texture}),h.dispose()};u(),pr(u);const f=new C(0,1,0),p=new C;function v(h,m,M,x){const g=1+(m.blade-1)*M,w=1+(m.red-1)*M,b=1+(m.angle-1)*M,S=h.blade.angle*b*(x.angleMul??1);o.position.set(...h.blade.from),o.target.position.set(...h.blade.to),o.target.updateMatrixWorld(),o.angle=S,o.penumbra=h.blade.pen??.55,o.intensity=h.blade.power*.4*g*(x.bladeMul??1),s.position.set(...h.red.at),s.intensity=h.red.power*w*(x.redMul??1),s.distance=h.red.reach*2,e.environment=l[h.env];const P=Math.hypot(h.blade.to[0]-h.blade.from[0],h.blade.to[1]-h.blade.from[1],h.blade.to[2]-h.blade.from[2])*1.15;c.position.set(...h.blade.from),p.set(h.blade.to[0]-h.blade.from[0],h.blade.to[1]-h.blade.from[1],h.blade.to[2]-h.blade.from[2]).normalize(),c.quaternion.setFromUnitVectors(f,p.negate());const z=Math.tan(S)*P;c.scale.set(z,P,z),r.uniforms.uGain.value=h.haze*.18*Math.min(1.5,g*(x.bladeMul??1)),r.uniforms.uSeed.value=x.seed,r.uniforms.uCam.value.copy(x.cam)}return{blade:o,red:s,haze:c,apply:v}}const m1=.004,v1=1;function g1(t){return t.station<0?"none":t.rel>0?"release":t.rare&&t.t>=Bn.rare?"rare":t.t<Bn.settle?"settle":t.t<Bn.pulse?"wait":"loop"}function x1(){let t=0,e=!1,n=-1,o=0,s=99,a=!0,r=-1;const i=new Set;return{update(c,l,d,u){const f=qc(l);return f!==r&&(r=f,i.delete(f)),Math.abs(d)<m1&&!u?t+=c:t=0,!e&&t>=v1?(e=!0,n=f,o=0,s=0,a=!i.has(f)):e&&t===0&&(e=!1,s=1e-6),e?(o+=c,a&&o>=Bn.rare&&i.add(n)):n>=0&&(s+=c,s>Te[n].trick.release&&(n=-1,s=99)),{station:n,t:o,rare:a,rel:e?0:s}},reset(){t=0,e=!1,n=-1,o=0,s=99,i.clear(),r=-1}}}function jr(t,e,n,o){if(t.station!==e)return{on:!1,k:0,t:0,phase:0,rare:-1};const s=Te[e],a=t.rel>0?1-ie(t.rel/s.trick.release):1;if(o)return{on:!0,k:ie(t.t/3)*a,t:t.t,phase:.5,rare:-1};const r=ie((t.t-Bn.pulse)/.5),i=t.rare&&s.trick.rare>0&&t.t>=Bn.rare;return{on:!0,k:r*a*(n?1:.35),t:t.t,phase:Gc(e,t.t),rare:i?vt((t.t-Bn.rare)/s.trick.rare):-1}}function w1(t){if(t.station<0||t.rel>0)return-1;const e=(t.t-Bn.pulse)/Bn.pulseLen;return e>=0&&e<=1?e:-1}function y1(t){const e=n=>el(new y0(n));return{q:t,metal:e({color:4867905,metalness:.9,roughness:.34,envMapIntensity:1.3}),metalPale:e({color:6973282,metalness:1,roughness:.22,envMapIntensity:1.1}),enamel:e({color:3420719,metalness:0,roughness:.5,envMapIntensity:.5}),blood:e({color:6029832,metalness:.35,roughness:.3,emissive:2752514,envMapIntensity:.7}),ruby:e({color:7995400,metalness:.1,roughness:.08,emissive:12582928,emissiveIntensity:.6}),oil:e({color:131586,metalness:.2,roughness:.06,envMapIntensity:1.4}),glass:e({color:1052688,metalness:0,roughness:.05,transparent:!0,opacity:.16,depthWrite:!1,envMapIntensity:1.5}),stone:e({color:1776153,metalness:0,roughness:.62,envMapIntensity:.4})}}function b1(t){return Ai(t.map(e=>{const n=e.index?e.toNonIndexed():e;return n.deleteAttribute("uv"),n}))}const $r=["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"],Fn=Math.PI/180,M1={v:.15},S1=Math.atan2(-.8,13),z1=[-145*Fn,-112*Fn,-82*Fn,S1,22*Fn,55*Fn,98*Fn,140*Fn],Ms=[10.5,-6.5],Ss=[-.42,.02],k1=.2;Number(new URLSearchParams(typeof location>"u"?"":location.search).get("fexp")??.18);const Yr=.07,P1={0:{at:[10,8],g:6,tube:!0},1:{at:[13.1,-14.6],g:.2,tube:!0},G:{at:[17,2],g:2,env:.1}},tc={value:0};function A1(t,e){const n=new Pn({color:16777215,side:vo});return n.onBeforeCompile=o=>{o.uniforms.uGain=t,o.uniforms.uFront=e,o.uniforms.uThin=tc,o.uniforms.uPxH=Z0,o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
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
gl_FragColor = vec4(0.95 * mix(smoothstep(0.0, 0.12, e), clamp(e * 0.6, 0.0, 1.0), uThin), 0.0, 0.0, 1.0 + clamp(e * 2.0, 0.0, 1.0));`)},n.customProgramCacheKey=()=>"ss-crack-emit",n}function R1(t){const e=[],n=[],o=[],s=[];t.cracks.forEach((r,i)=>{const c=t.crackLen(i),l=Math.max(8,Math.ceil(c/.2)),d=e.length/3;for(let u=0;u<=l;u++){const f=.25+(c-.5)*u/l,[p,v]=t.crackAt(i,f),[h,m]=t.crackAt(i,f+.05),M=h-p,x=m-v,g=Math.hypot(M,x)||1,w=.075*(1-.4*u/l),b=ro(Math.hypot(p,v))+.012;if(e.push(p-x/g*w,b,v+M/g*w,p+x/g*w,b,v-M/g*w),o.push(-x/g,0,M/g,x/g,0,-M/g),s.push(w,w),u<l){const S=d+u*2;n.push(S,S+1,S+2,S+1,S+3,S+2)}}});const a=new In;return a.setAttribute("position",new rt(e,3)),a.setIndex(n),a.setAttribute("aPerp",new rt(o,3)),a.setAttribute("aHw",new rt(s,1)),a}function C1(t){const e=t.kit.q,n=z0(e),o=new gt,s=Ol({detail:n,cracks:z1}),a=Gl({detail:n}),r=Eo(s.part,e,{impact:s.impact}),i=s.sectors.map((H,Y)=>{const re=new gt;re.name=`sector-${Y}`;const Oe=H.centroid.clone();return{pivot:re,mid:Math.atan2(Oe.x,-Oe.z),centroid:Oe,order:0}}),c=[];r.children.slice().forEach(H=>{const Y=/^(enamel|base|ticks)-(\d+)$/.exec(H.name);Y?(i[Number(Y[2])].pivot.add(H),Y[1]==="enamel"&&c.push(H)):o.add(H)});const l=i.map(()=>[]),d=[],u=[];for(let H=0;H<12;H++){const Y=Hs($r[H],{detail:n}).geo.clone().translate(0,Yr,0);H===2&&(Y.translate(.9,0,0),Y.rotateZ(-.11),Y.rotateY(.06),Y.translate(-.9,0,0)),Y.applyMatrix4(a.at[H]),Y.computeBoundingBox();const re=Y.boundingBox.getCenter(new C);if(H<=2?d.push([s.sectorOf(re.x,re.z),Y]):l[s.sectorOf(re.x,re.z)]?.push(Y),H<=2){const Oe=[{tilt:0,yaw:0,roll:0,lift:.02},{tilt:0,yaw:0,roll:65*Fn,lift:.02},{tilt:48,yaw:.12,roll:18*Fn,lift:.06}][H],ft=Hs($r[H],{detail:n}),ht=ft.geo.clone(),It=ht.attributes.position;for(let Ft=0;Ft<It.count;Ft++)It.getY(Ft)>.021&&It.setY(Ft,It.getY(Ft)*3);ht.computeVertexNormals();const mt=Oe.roll,ct=Re.numeralH/2,Xt=ft.width/2+.17;ht.translate(0,0,ct).rotateX(-Oe.tilt*Fn).translate(0,0,-ct).rotateZ(mt).translate(0,Yr+Oe.lift+Xt*Math.abs(Math.sin(mt)),0).rotateY(Oe.yaw),u.push(ht.applyMatrix4(a.at[H]))}}const f=Ho(an({finish:"grained",seed:299,wear:.22,tier:e,age:.11,direct:.12}),.3);l.forEach((H,Y)=>{if(!H.length)return;const re=new je(_t(H),f);re.castShadow=e!=="low",re.receiveShadow=e!=="low",re.name=`numerals-${Y}`,i[Y].pivot.add(re)});const p=d.map(([H,Y])=>{const re=new je(Y,f);return re.castShadow=re.receiveShadow=e!=="low",re.name="numerals-near",i[H].pivot.add(re),re}),v=new je(_t(u),Ho(an({finish:"grained",seed:297,wear:.08,tier:e,age:.03,direct:1}),.9));v.castShadow=v.receiveShadow=e!=="low",v.name="p1-numerals";for(const H of i)o.add(H.pivot);const h=45*Fn;[...i].sort((H,Y)=>(H.mid-h+4*Math.PI)%(2*Math.PI)-(Y.mid-h+4*Math.PI)%(2*Math.PI)).forEach((H,Y)=>H.order=Y);const m=Ql({detail:n,second:0,hour:4.9,minute:1.15}),M=Eo(m,e,{}),x=new gt;x.name="second",M.children.slice().forEach(H=>{(H.name==="hand-second"||H.name==="hand-collet")&&x.add(H)});for(const H of M.children)(H.name==="hand-hour"||H.name==="hand-minute")&&Ho(H.material,k1);o.add(M,x);let g=null;const w=(()=>{const H=x.children.find(ct=>ct.name==="hand-second");if(!H)return null;const Y=H.geometry.clone(),re=Y.attributes.position;let Oe=0,ft=0,ht=0;for(let ct=0;ct<re.count;ct++){const Xt=re.getX(ct),Ft=re.getZ(ct),bn=Xt*Xt+Ft*Ft;bn>ht&&(ht=bn,Oe=Xt,ft=Ft)}const It=Math.hypot(Oe,ft)||1;Oe/=It,ft/=It;for(let ct=0;ct<re.count;ct++){const Xt=re.getX(ct),Ft=re.getZ(ct),bn=Xt*Oe+Ft*ft,Xe=Xt-bn*Oe,at=Ft-bn*ft,St=Math.hypot(Xe,at),Dt=St>1e-6?(St*1.75+.035)/St:1;re.setXYZ(ct,bn*Oe+Xe*Dt,re.getY(ct)-.03,bn*ft+at*Dt)}Y.deleteAttribute("normal");const mt=new je(Y,new Pn({color:0}));return mt.name="hand-skirt",mt.position.copy(H.position),mt.quaternion.copy(H.quaternion),mt.scale.copy(H.scale),mt.renderOrder=-1,x.add(mt),mt})(),b=x.children.map(H=>H.material).find(H=>H?.emissive&&H.clearcoat>0),S=x.children.find(H=>H.name==="hand-second"),P={value:0};if(b){const H=b.onBeforeCompile.bind(b),Y=b.customProgramCacheKey.bind(b);b.onBeforeCompile=(re,Oe)=>{H(re,Oe),re.uniforms.uWhole=P,re.fragmentShader=re.fragmentShader.replace("void main() {",`uniform float uWhole;
void main() {`).replace("chip = max(chip, boss);",`chip = mix(chip, 0.0, uWhole);
rim *= 1.0 - uWhole;
hair *= 1.0 - uWhole;
chip = max(chip, boss);`).replace("{ vec3 cT = vec3(0.8, 0.035, 0.03);",`clearcoatSpecularDirect *= 1.0 - 0.9 * uWhole;
reflectedLight.directDiffuse *= 1.0 - 0.5 * uWhole;
{ vec3 cT = vec3(0.8, 0.035, 0.03);`)},b.customProgramCacheKey=()=>Y()+"-whole"}const z=Ul({detail:n,impact:Ms,wedge:Ss}),_=Eo(z.part,e,{});o.add(_);const R=et(517),k=Za(8,(H,Y)=>{const re=Y*Math.PI*2,Oe=3+Math.sqrt(H)*18.5,ft=Math.cos(re)*Oe,ht=Math.sin(re)*Oe,It=Math.atan2(ht-Ms[1],ft-Ms[0]);return It>Ss[0]-.14&&It<Ss[1]+.14||Math.hypot(ft-12.95,ht+18)<15?null:{p:new C(ft,D0(Oe)-.02,ht),up:new C(-ft*.004+(R()-.5)*.1,1,-ht*.004)}},31,[.3,.55,.9]),y=Eo(No([],[{geo:Xa(n),finish:"drop",seed:77,mats:k.flat(),name:"sky-drops"}]),e,{shadows:!1,sphereOf:()=>Ka(1,.7)});y.visible=!1,o.add(y);const A=new gt;A.visible=!1,o.add(A);const F=new Pn({color:0}),T=Ho(an({finish:"polished",seed:641,wear:.1,tier:e,age:.05,direct:.9}),1.2);{const H=[],Y=[];for(let ft=0;ft<60;ft++){const ht=ft%5===0,It=ft/60*Math.PI*2,mt=ht?Re.hourIn:Re.trackIn,ct=Re.trackOut,Xt=ht?.2:.075,Ft=ct-mt,bn=ro((mt+ct)/2),Xe=new se().makeRotationY(-It).multiply(new se().makeTranslation(0,bn,-(mt+ct)/2));H.push(new i0(Xt,.012,Ft).applyMatrix4(Xe));for(const at of[-1,1])Y.push(new i0(.016,.022,Ft+.02).translate(at*(Xt/2+.008),.004,0).applyMatrix4(Xe))}const re=new je(_t(H),F),Oe=new je(_t(Y),T);re.name="p1-grooves",Oe.name="p1-lips",Oe.receiveShadow=e!=="low",A.add(re,Oe,v)}const I=r.children.filter(H=>/^ticks-/.test(H.name)).concat(...i.map(H=>H.pivot.children.filter(Y=>/^ticks-/.test(Y.name)))),Q=new a0(e==="low"?512:1024,e==="low"?512:1024,{type:c0,samples:e==="low"?0:4}),X=new Qs(136,1,.2,120);X.position.set(...Do),X.up.set(0,0,-1),X.lookAt(Do[0],0,Do[2]);const E=.95,N=new l0(os*1.006,64,24,0,Math.PI*2,0,E),$=new un({uniforms:{tPic:{value:Q.texture},uGain:{value:4.2},uK:{value:0}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vP; void main() { vP = position.xz / ("+(os*Math.sin(E)).toFixed(4)+"); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform sampler2D tPic; uniform float uGain; uniform float uK; varying vec2 vP; void main() { float r = length(vP); vec2 uv = 0.5 - vP * 0.5 * (0.82 + 0.18 * r * r); vec3 c = texture2D(tPic, uv).rgb * uGain * (1.0 - 0.55 * r * r) + vec3(0.85) * exp(-(((r - 0.955) / 0.012) * ((r - 0.955) / 0.012))); gl_FragColor = vec4(c, uK * (1.0 - smoothstep(0.78, 1.0, r))); }"}),q=new je(N,$);q.position.set(...Do),q.visible=!1,q.renderOrder=2,o.add(q);const D=Ho(an({finish:"grained",seed:611,wear:.06,tier:e,age:0,direct:1}),1.1),V=new Bc(2.1,.5,1.7,2,.1),O=new i0(2.5,.62,.35),j=new gn(V,D,8);j.castShadow=j.receiveShadow=e!=="low",j.frustumCulled=!1;const ae=Array.from({length:8},(H,Y)=>{const re=(Y+.5)*Math.PI/4;return O.clone().rotateY(-re).translate(20.55*Math.sin(re),.3,-20.55*Math.cos(re))});o.add(j);const ye=Array.from({length:8},(H,Y)=>({a:(Y+.5)*Math.PI/4})),_e=new se,L=new Wt,J=new C(1,1,1),ue=new C,ve=new C(0,1,0),pe=20.05,fe=90,Le=-.1,Fe=.55,De=new je(_t([new Ga(pe-.3,pe+.3,192,1).rotateX(-Math.PI/2).translate(0,-.08,0),new Ga(pe-.33,pe-.29,192,1).rotateX(-Math.PI/2).translate(0,-.02,0),new Ga(pe+.29,pe+.33,192,1).rotateX(-Math.PI/2).translate(0,-.02,0),...ae].map((H,Y)=>{const re=H.attributes.position.count,Oe=new Float32Array(re*3).fill(Y===1||Y===2?.55:0);return H.setAttribute("color",new s0(Oe,3)),H})),new Pn({vertexColors:!0}));De.visible=!1,o.add(De);const Ue=De,Se=new In,He=new Float32Array((fe+1)*6),ot=new Float32Array((fe+1)*8),ke=[];for(let H=0;H<=fe;H++){const Y=-1.25*(1-H/fe);He.set([pe*Math.sin(Y),Le,-pe*Math.cos(Y),pe*Math.sin(Y),Fe,-pe*Math.cos(Y)],H*6),H<fe&&ke.push(2*H,2*H+1,2*H+2,2*H+1,2*H+3,2*H+2)}Se.setAttribute("position",new s0(He,3)),Se.setAttribute("color",new s0(ot,4)),Se.setIndex(ke);const be=new je(Se,new Pn({vertexColors:!0,transparent:!0,side:vo,depthWrite:!1}));be.visible=!1,be.frustumCulled=!1;const Z=new gt;Z.add(be),o.add(Z);const G=34,K=new Float32Array(8*G*3),oe=new Float32Array(8*G*3),de=[];{const H=et(655);for(let Y=0;Y<8*G;Y++)de.push(H()-.5,H()*.8,H()-.5,.4+H()*.6)}const Ce=new In;Ce.setAttribute("position",new s0(K,3)),Ce.setAttribute("color",new s0(oe,3));const We=new Pc(Ce,new Ac({size:2.6,vertexColors:!0,transparent:!0,depthWrite:!1,blending:bi,map:(()=>{const H=document.createElement("canvas");H.width=H.height=32;const Y=H.getContext("2d"),re=Y.createRadialGradient(16,16,0,16,16,16);return re.addColorStop(0,"rgba(255,255,255,1)"),re.addColorStop(1,"rgba(255,255,255,0)"),Y.fillStyle=re,Y.fillRect(0,0,32,32),new zr(H)})()}));We.visible=!1,We.frustumCulled=!1,o.add(We);const Je=new je(new j0(Re.caseIn*1.6,64),new Pn({colorWrite:!1,depthWrite:!1,side:vo}));Je.rotation.x=-Math.PI/2,Je.position.y=-.45,Je.castShadow=!0,Je.visible=!1,o.add(Je);const U=74*Math.PI/180,he=new gt;he.visible=!1,he.rotation.y=U,o.add(he);const Me=Ho(an({finish:"grained",seed:621,wear:.3,tier:e,age:.2,direct:.7}),.08);{const H=new je(_t([[9,-3.2,-2,4.2,48],[15,-3.8,3,2.8,36],[6,-4.4,7,5.5,64],[13,-2.9,-7.5,2.2,30]].map(([Y,re,Oe,ft,ht],It)=>$o({teeth:ht,r:ft,profile:"train",spokes:5,rim:.08,hub:.14,hole:.3,detail:n,seed:620+It}).rotateY(It*1.3).translate(Y,re,Oe))),Me);H.castShadow=H.receiveShadow=e!=="low",he.add(H)}[[11.5,-2.1,1,.5],[9.6,-1.9,-8.2,-.6]].forEach(([H,Y,re,Oe],ft)=>{const ht=Wl(sr({length:11,width:2.4,t:.6,detail:n,seed:630+ft}),e);ht.position.set(H,Y,re),ht.rotation.y=Oe,he.add(ht)});{const H=new je(cr({detail:n,rOut:2.4,t:.05}).geo,Me);H.position.set(16,-2.6,-3),he.add(H)}const ge=new C(10*Math.sin(50*Fn),-3,-10*Math.cos(50*Fn)),Pe={value:0},B=new Pn({color:16777215});B.onBeforeCompile=H=>{H.uniforms.uK=Pe,H.fragmentShader=H.fragmentShader.replace("#include <common>",`#include <common>
uniform float uK;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor = vec4(0.95 * uK, 0.0, 0.0, 1.0 + uK);`)},B.customProgramCacheKey=()=>"ss-gate-ruby";const ne=new je(new ns(.26,2),B);ne.position.copy(ge).applyAxisAngle(new C(0,1,0),-U),he.add(ne);let te=null;const ze=(H,Y,re=0)=>{Je.visible=Y&&H>.2&&e!=="low",j.visible=Ue.visible=Y;const Oe=205*Fn,ft=vt((H-.12)/.19),ht=Oe+ft*Math.PI*2;let It=!1;if(ye.forEach(({a:mt},ct)=>{const Xt=.12+.19*(((mt-Oe)%(2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)+.004,Ft=vt((H-Xt)/.006),bn=Ft>=1?1:1+2.2*(Ft-1)**3+1.2*(Ft-1)**2,Xe=vt(bn,0,1.08)*(ct===2?1-.55*re:1),at=19+1.6*Xe,St=(H-Xt)/.03,Dt=St>0&&St<1,Ln=oe[ct*G*3]>0;if(Dt||Ln)for(let En=0;En<G;En++){const Hn=(ct*G+En)*3,To=(ct*G+En)*4,Xo=Math.sqrt(Math.max(St,0))*1.5*de[To+3],k0=Dt?.014*(1-St)*de[To+3]+1e-4:0;K[Hn]=20.5*Math.sin(mt)+de[To]*Xo*2,K[Hn+1]=.45+de[To+1]*Xo,K[Hn+2]=-20.5*Math.cos(mt)+de[To+2]*Xo*2,oe[Hn]=oe[Hn+1]=oe[Hn+2]=k0}Dt&&(It=!0),j.setMatrixAt(ct,_e.compose(ue.set(at*Math.sin(mt),.32-.1*Xe,-at*Math.cos(mt)),L.setFromAxisAngle(ve,-mt),J))}),j.instanceMatrix.needsUpdate=!0,We.visible=It&&Y,It&&(Ce.attributes.position.needsUpdate=Ce.attributes.color.needsUpdate=!0),be.visible=Y&&ft>0&&ft<1,be.visible){Z.rotation.y=-ht;const mt=H*55%1;for(let ct=0;ct<=fe;ct++){const Xt=ct/fe,Ft=Math.exp(-(((Xt-mt)/.035)**2))*.8+Math.exp(-(((Xt-.985)/.02)**2))*.6,bn=Math.min(1,(Xt/.55)**1.6)*(Xt>.995?0:1);ot.set([.5+Ft,.5+Ft,.52+Ft,Math.min(1,bn+Ft*.5),.3+Ft*.5,.3+Ft*.5,.32+Ft*.5,Math.min(1,bn+Ft*.3)],ct*8)}Se.attributes.color.needsUpdate=!0}},xe=H=>{if(q.visible=H>0,$.uniforms.uK.value=H,!(H>0))return;const Y=t.renderer.getRenderTarget(),re=_.visible;q.visible=!1,_.visible=!1;const Oe=t.renderer.shadowMap.autoUpdate;t.renderer.shadowMap.autoUpdate=!1,t.renderer.setRenderTarget(Q),t.renderer.render(t.scene,X),t.renderer.setRenderTarget(Y),t.renderer.shadowMap.autoUpdate=Oe,q.visible=!0,_.visible=re},we={value:0},ce={value:new C(...sa(1.5/12*Math.PI*2,12),0)};ce.value.set(sa(1.5/12*Math.PI*2,12)[0],sa(1.5/12*Math.PI*2,12)[1],0);const Ve=new je(R1(s),A1(we,ce));Ve.frustumCulled=!1,o.add(Ve);const Ze=new C;{let H=1e9;s.cracks.forEach((Y,re)=>{const Oe=s.crackLen(re);for(let ft=.3;ft<Oe;ft+=.3){const[ht,It]=s.crackAt(re,ft),mt=Math.hypot(ht-11.4,It+12.4);mt<H&&(H=mt,Ze.set(ht,.8,It))}})}const Ke=new C,ut=new Pn({color:0});ut.onBeforeCompile=H=>{H.uniforms.uGain=we,H.uniforms.uFront=ce,H.vertexShader=H.vertexShader.replace("#include <common>",`#include <common>
attribute float aU;
varying float vU;
varying vec3 vWp;`).replace("#include <project_vertex>",`#include <project_vertex>
vU = aU;
vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;`),H.fragmentShader=H.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGain;
uniform vec3 uFront;
varying float vU;
varying vec3 vWp;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float dF = length(vWp.xz - uFront.xy);
float wl = uGain * smoothstep(uFront.z + 2.0, uFront.z - 2.0, dF) * exp(-dF / 4.5) * smoothstep(-0.95, -0.72, vU) * exp(-max(vU + 0.72, 0.0) * 2.2) * step(abs(vU), 1.5);
gl_FragColor = vec4(0.3 * wl * (0.45 + 0.55 * smoothstep(0.2, 0.8, 0.5 + 0.5 * sin(dot(vWp.xz, vec2(9.0, 6.0)) + 3.0 * sin(dot(vWp.xz, vec2(2.3, -3.1)))))), 0.0, 0.0, 1.0);`)},ut.customProgramCacheKey=()=>"ss-p1-canyon";const Ye=new gt;Ye.visible=!1,o.add(Ye);{const H=Te[1].pose.pos,Y=et(733),re=[],Oe=new bt(Te[1].pose.look[0]-H[0],Te[1].pose.look[2]-H[2]).normalize(),ft=new bt(-Oe.y,Oe.x),ht=[[-3.6,2.75],[-1.8,2.35],[0,2.15],[1.6,2.2],[2.8,2.7],[3.8,3.8]];for(let Ot=0,On=150;Ot<=On;Ot++){const Dn=Ot/On*(ht.length-1),tn=Math.min(ht.length-2,Math.floor(Dn)),Vn=ie(Dn-tn),$n=ht[tn][0]+(ht[tn+1][0]-ht[tn][0])*Vn,zt=ht[tn][1]+(ht[tn+1][1]-ht[tn][1])*Vn,Ut=(Y()-.5)*.025+.02*Math.sin(Ot*.9);re.push([H[0]+Oe.x*(zt+Ut)+ft.x*$n,H[2]+Oe.y*(zt+Ut)+ft.y*$n])}const It=[],mt=[[8.28,-15.33],[6.9,-12.9],[7.3,-10.3],[8.49,-8.49],[10.3,-6.9],[12.2,-5.3]];for(let Ot=0,On=160;Ot<=On;Ot++){const Dn=Ot/On*(mt.length-1),tn=Math.min(mt.length-2,Math.floor(Dn)),Vn=Dn-tn,$n=mt[tn][0]+(mt[tn+1][0]-mt[tn][0])*Vn,zt=mt[tn][1]+(mt[tn+1][1]-mt[tn][1])*Vn,Ut=(Y()-.5)*.03+.025*Math.sin(Ot*1.3)+.04*Math.sin(Ot*.21);It.push([$n+Ut,zt-Ut*.6])}const ct=[],Xt=[],Ft=[],bn=[],Xe=[],at=[],St=[],Dt=[],Ln=[],En=[],Hn=(Ot,On,Dn,tn,Vn)=>Ot.push(...On,...tn,...Dn,...Dn,...tn,...Vn);for(const[Ot,On]of[[re,1],[It,.75]]){const Dn=Ot.length,tn=Ot.map((zt,Ut)=>{const[kn,qn]=Ot[Math.max(0,Ut-2)],[Qn,ao]=Ot[Math.min(Dn-1,Ut+2)],Fo=Math.hypot(Qn-kn,ao-qn)||1;let Jn=-(ao-qn)/Fo,xo=(Qn-kn)/Fo;return Jn*(H[0]-Ot[Ut][0])+xo*(H[2]-Ot[Ut][1])>0&&(Jn=-Jn,xo=-xo),[Jn,xo]}),Vn=Ot.map((zt,Ut)=>{const kn=Ut/(Dn-1),qn=Math.sin(Math.min(1,kn*1.15)*Math.PI)**.5;return[On*(.04+.1*qn)*(.7+.6*(.5+.5*Math.sin(kn*37+2*Math.sin(kn*11)))),(.01+.028*qn)*(.6+.8*(.5+.5*Math.sin(kn*29+1.3+2*Math.sin(kn*7)))),qn]}),$n=(zt,Ut,kn)=>{const[qn,Qn]=Ot[zt],[ao,Fo]=tn[zt];return[qn+ao*Ut,ro(Math.hypot(qn,Qn))+kn,Qn+Fo*Ut]};for(let zt=0;zt<Dn-1;zt++){const[Ut,kn,qn]=Vn[zt],[Qn,ao]=Vn[zt+1];Hn(Ft,$n(zt,-Ut*.55,.004),$n(zt,Ut*.45,.004),$n(zt+1,-Qn*.55,.004),$n(zt+1,Qn*.45,.004)),ct.push(-1,-1,1,1,-1,1),Hn(bn,$n(zt,Ut*.45,.005),$n(zt,Ut*.45+kn,.005),$n(zt+1,Qn*.45,.005),$n(zt+1,Qn*.45+ao,.005));{const Yn=.55+.45*Math.sin(zt*1.7+Math.sin(zt*.37)*3)**2,Kn=.55+.45*Math.sin((zt+1)*1.7+Math.sin((zt+1)*.37)*3)**2,Wn=.12;Xt.push(Wn*Yn,Wn*Yn,Wn*Yn,Wn*Kn,Wn*Kn,Wn*Kn,Yn,Yn,Yn,Yn,Yn,Yn,Wn*Kn,Wn*Kn,Wn*Kn,Kn,Kn,Kn)}const[Fo,Jn]=tn[zt],[xo,P0]=Ot[zt],[wr,yr]=Ot[zt+1],Aa=wr-xo,Ra=yr-P0,A0=Math.hypot(Aa,Ra)||1,ea=ro(Math.hypot(xo,P0));if(Y()<.1*qn){const Yn=.015+.03*Y(),Kn=Y()<.5,Wn=Kn?Ut*.45+kn:-Ut*.55,p0=Kn?1:-1;Xe.push(...$n(zt,Wn,.006),...$n(zt+1,Wn,.006),(xo+wr)/2+Fo*(Wn+p0*Yn),ea+.006,(P0+yr)/2+Jn*(Wn+p0*Yn))}if(Y()<.12*qn){const Yn=Y()<.5?1:-1,Kn=.25+.6*Y(),Wn=(Y()-.5)*1.2,p0=.006,br=xo+(Fo*Yn+Aa/A0*Wn)*Kn,Mr=P0+(Jn*Yn+Ra/A0*Wn)*Kn;Hn(at,[xo-Aa/A0*p0,ea+.005,P0-Ra/A0*p0],[xo+Aa/A0*p0,ea+.005,P0+Ra/A0*p0],[br,ea+.005,Mr],[br+1e-4,ea+.005,Mr])}}for(let zt=0;zt<Dn;zt++){const[Ut,kn]=tn[zt],qn=Ot[zt][0]-Ut*Vn[zt][0]*.33,Qn=Ot[zt][1]-kn*Vn[zt][0]*.33,ao=Vn[zt][0]*.2,Fo=ro(Math.hypot(qn,Qn))+.007,Jn=St.length/3;St.push(qn-Ut*ao,Fo,Qn-kn*ao,qn+Ut*ao,Fo,Qn+kn*ao),Dt.push(-Ut,0,-kn,Ut,0,kn),Ln.push(ao,ao),zt<Dn-1&&En.push(Jn,Jn+1,Jn+2,Jn+1,Jn+3,Jn+2)}}const To=Ot=>{const On=new In;return On.setAttribute("position",new rt(Ot,3)),On.computeVertexNormals(),On},Xo=To(Ft.concat(Xe,at));Xo.setAttribute("aU",new rt(ct.concat(new Array((Xe.length+at.length)/3).fill(9)),1));const k0=new je(Xo,ut);k0.name="p1-canyon-depth";const Pa=To(bn);Pa.setAttribute("color",new rt(Xt,3));const xr=new je(Pa,new Rc({color:1052688,vertexColors:!0,side:vo}));xr.name="p1-canyon-wall",A.add(k0,xr);const J0=new In;J0.setAttribute("position",new rt(St,3)),J0.setIndex(En),J0.setAttribute("aPerp",new rt(Dt,3)),J0.setAttribute("aHw",new rt(Ln,1)),Ye.userData.geo=J0;{const Ot=sa(Ao,19.9);let On=1e9;for(const[Dn,tn]of re){const Vn=Math.hypot(Dn-Ot[0],tn-Ot[1]);Vn<On&&(On=Vn,Ke.set(Dn,.12,tn))}}}{const H=new je(Ye.userData.geo,Ve.material);H.frustumCulled=!1,Ye.add(H)}const xt=K0("dial-xii",c.map(H=>H.material),{at:[0,ro(10.2),-10.2],right:[1,0,0],up:[0,0,-1],width:8,depth:.3},t.lang);let Pt=!1;Vs(xt.ready.then(H=>Pt=H));const Rn={value:.3},dn={value:new C},sn={value:new C},wn={value:0},me={value:0},Qe={value:.7};for(const H of c)Object.assign(H.material.ss,{uStrN:dn,uStrL:sn,uStrG:wn,uStrRef:me,uStrC:Qe,uEnv:Rn});const Ae=new C,st=new C,tt=new C,Ee=new yi(15921129,0,0,.14,.1,0);{const H=document.createElement("canvas");H.width=H.height=256;const Y=H.getContext("2d"),re=et(919);Y.fillStyle="#000",Y.fillRect(0,0,256,256),Y.save(),Y.translate(128,128),Y.rotate(-.5);const Oe=Y.createLinearGradient(-128,0,128,0);Oe.addColorStop(0,"rgba(255,255,255,0)"),Oe.addColorStop(.3,"#fff"),Oe.addColorStop(.75,"#fff"),Oe.addColorStop(1,"rgba(255,255,255,0)"),Y.fillStyle=Oe,Y.fillRect(-128,-17,256,34),Y.restore(),Y.strokeStyle="#000",Y.lineCap="round";for(let ft=0;ft<7;ft++){let ht=128+(re()-.5)*60,It=128+(re()-.5)*60,mt=re()*6.28;Y.lineWidth=1.5+re()*3,Y.beginPath(),Y.moveTo(ht,It);for(let ct=0;ct<14;ct++)mt+=(re()-.5)*.9,ht+=Math.cos(mt)*14,It+=Math.sin(mt)*14,Y.lineTo(ht,It);Y.stroke()}Ee.map=new zr(H),Ee.castShadow=e!=="low",Ee.shadow.mapSize.set(512,512),Ee.shadow.camera.near=.5,Ee.shadow.camera.far=20}o.add(Ee,Ee.target);const Tt=new ga,$t=new bt,Qt=new Ma(new C(0,1,0),0),Nt=new C,Yt=Ho(an({finish:"grained",seed:640,wear:.05,tier:e,age:0,direct:1}),.9),Un=Array.from({length:24},(H,Y)=>{const re=Y/23,Oe=re*Math.PI*5;return new C(Math.cos(Oe)*(.28-.12*re),re*.5-.25,Math.sin(Oe)*(.28-.12*re))}),Cn=[_t([new B0(.24,.24,.1,18).translate(0,.05,0),new B0(.085,.085,.5,8).translate(0,-.25,0)]),new Cc(.5,.07,8,36),new i0(1.4,.08,.17),new Si(new ba(Un),48,.028,5)],Ko=[10,7,8,6],d0=Cn.map((H,Y)=>{const re=new gn(H,Yt,Ko[Y]);return re.name=`gate-debris-${Y}`,re.frustumCulled=!1,re.castShadow=e!=="low",re.visible=!1,o.add(re),re}),lo=et(733),it=new C(4.2,-1.4,-4.6),ee=new C(-15,13,27).clone().sub(it),le=new C().crossVectors(ee,new C(0,1,0)).normalize(),Ne=new C().crossVectors(le,ee).normalize(),Ie=[];Ko.forEach((H,Y)=>{for(let re=0;re<H;re++)Ie.push({k:Y,j:re,u:.06+.66*lo()**1.3,s:lo()*2-1,v:lo()*2-1,ax:new C(lo()-.5,lo()-.5,lo()-.5).normalize(),rot:2+lo()*5,sc:.8+lo()*.5})});const pt=Ie.find(H=>H.k===1),qe=Ie.find(H=>H.k===2);Object.assign(pt,{u:.86,s:-1,v:-.55,sc:2.6}),Object.assign(qe,{u:.9,s:.9,v:.5,sc:2.4});const Jt=new se,Et=new Wt,Bt=new C,wt=new C,At=H=>{for(const Y of d0)Y.visible=H>0;if(!(H<=0)){for(const Y of Ie){const re=Y.u*(.35+.65*H),Oe=.25+2.6*re;Bt.copy(it).addScaledVector(ee,re).addScaledVector(le,Y.s*Oe).addScaledVector(Ne,Y.v*Oe*.5),Et.setFromAxisAngle(Y.ax,Y.rot*re+Y.j),d0[Y.k].setMatrixAt(Y.j,Jt.compose(Bt,Et,wt.setScalar(Y.sc*Math.min(1,H*3))))}for(const Y of d0)Y.instanceMatrix.needsUpdate=!0}},nt=128,Kt=(()=>{const H=new Uint8Array(nt*nt*4),Y=Re.dialR;for(let Oe=0;Oe<nt;Oe++)for(let ft=0;ft<nt;ft++){const ht=((ft+.5)/nt*2-1)*Y,It=((Oe+.5)/nt*2-1)*Y,mt=Math.hypot(ht,It)<Y?s.sectorOf(ht,It):-1;H[(Oe*nt+ft)*4]=mt>=0&&mt<8?mt*16+8:255}const re=new cs(H,nt,nt);return re.magFilter=re.minFilter=Tc,re.needsUpdate=!0,re})(),pn=new Array(8).fill(0),en=new C(-8,0,-3.5),yn=new C(.81,-.51,-.28).normalize(),Tn=68,zn=3.6,go=new un({uniforms:{uA:{value:en.clone().addScaledVector(yn,-60)},uD:{value:yn},uTan:{value:zn/60},uLen:{value:Tn},uGain:{value:0},tSec:{value:Kt},uSt:{value:pn},uR:{value:Re.dialR},tNz:{value:Yo().noise}},vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
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
}`,transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt}),uo=new B0(.01,zn/60*Tn*1.05,Tn,32,1,!0).translate(0,-Tn/2,0),jn=new je(uo,go);jn.name="gate-shaft",jn.frustumCulled=!1,jn.visible=!1,jn.renderOrder=6,jn.position.copy(en).addScaledVector(yn,-60),jn.quaternion.setFromUnitVectors(new C(0,-1,0),yn),o.add(jn);const mn=Te.findIndex(H=>H.id==="G"),ka=new Gt,fc=new Gt;let vr=null;const gr=new C,hc=Ji([o]);return{group:o,hand:x,sectors:i,emit:we,setHandAngle(H){vr=H},update(H){const Y=H.i,re=Y===1||Y===2&&!H.inHold&&H.u<M1.v;{const Xe=Te[Y].light.blade;Ae.set(Xe.from[0]-Xe.to[0],Xe.from[1]-Xe.to[1],Xe.from[2]-Xe.to[2]).normalize();const at=P1[Te[Y].id],St=Te[Y].pose.pos,Dt=at?.at??[0,0],Ln=Math.hypot(St[0]-Dt[0],St[1],St[2]-Dt[1])||1;st.set(-(St[0]-Dt[0])/Ln,St[1]/Ln,-(St[2]-Dt[1])/Ln),at?.tube?(tt.set(-(St[2]-Dt[1]),0,St[0]-Dt[0]).normalize(),tt.dot(Ae)<0&&tt.negate(),sn.value.copy(tt),dn.value.crossVectors(tt,st).normalize(),Qe.value=at.c??-.1):(sn.value.copy(Ae),dn.value.crossVectors(Ae,st).normalize(),Qe.value=.7);const En=H.trick(Te[Y].id);Rn.value=at?.env??.3,wn.value=(at?.g??0)*(1+(Te[Y].stop.blade-1)*En.k)**3}let Oe=Y===mn?vt((H.local("G")-.5)/.5):Y>mn&&Y<9?1:0;const ft=H.trick("G"),ht=ft.on?ie(vt((ft.t-Bn.pulse)/7))*ft.k:0;Oe>.25&&(Oe=.25+(Oe-.25)*(1-.55*ht));for(const Xe of i){const at=ie(vt((Oe-.25)/.75*3.3-Xe.order*.3));pn[i.indexOf(Xe)]=at;const St=Y===mn?1+5*Math.min(1,at*5):1;for(const Dt of Xe.pivot.children)/^(enamel|base)-/.test(Dt.name)&&(Dt.scale.y=St,Dt.position.y=.1*(1-St));if(Xe.pivot.position.set(0,0,0),Xe.pivot.rotation.set(0,0,0),at>0){const Dt=Xe.centroid,Ln=Math.hypot(Dt.x,Dt.z)||1,En=new C(-Dt.z/Ln,0,Dt.x/Ln);gr.set(Dt.x/Ln,0,Dt.z/Ln),Xe.pivot.position.copy(Dt).multiplyScalar(-1),Xe.pivot.position.set(0,0,0),Xe.pivot.rotateOnWorldAxis(gr,-.85*at),Xe.pivot.rotateOnWorldAxis(new C(0,1,0),.18*at),Xe.pivot.position.copy(En.multiplyScalar(5.5*at*at)).add(new C(0,-.6*at-7*at**4,0))}Xe.pivot.visible=at<.999}const It=Y===mn&&(H.inHold||H.u>.3);Gi.value=re?1:It?2:0;for(const[Xe,at]of hc)Xe.uAge.value=It?0:at;Os.value=re?.12:1,$i.value=re?1:0,_.visible=Y<mn||Y===mn&&H.local("G")<.3||Y>=9,y.visible=re&&_.visible,At(Y===mn?ie(vt((Oe-.55)/.45)):0),jn.visible=Y===mn&&Oe>.26,go.uniforms.uGain.value=1*ie(vt((Oe-.26)/.2)),A.visible=re;for(const Xe of I)Xe.visible=!re;for(const Xe of p)Xe.visible=!re;if(f.ss.uRS2.value.y=re?.04:.12,ze(Oe,Y===mn||Y===mn-1,ht),De.material.color.setScalar(Y===mn?1:0),P.value=re||Y===mn?1:0,b&&b.emissive.setRGB(Y===0?.07:re?.006:Y===mn?0:.0045,0,0),b){g??=[b.clearcoatRoughness,b.roughness,b.envMapIntensity];const Xe=Y===0?1:Y===1?1-ie(vt((H.local("1")-.4)/.15)):0;b.clearcoatRoughness=g[0]+(.55-g[0])*Xe,b.roughness=g[1]+(.6-g[1])*Xe,b.envMapIntensity=g[2]+(.3-g[2])*Xe,re&&b.emissive.setRGB(.006+.07*Xe,0,0),w&&(w.visible=Y<=1||re),S&&(S.scale.y=(S.userData.sy??=S.scale.y)*(re?1+3*Xe:1))}he.visible=Y===mn&&Oe>.2;{const Xe=t.kit,at=Y===mn?H.inHold?1:ie(vt(H.u/.6)):0,St=(Dt,Ln)=>ka.setHex(Dt).lerp(fc.setHex(Ln),at);Xe.metal.color.copy(St(4867905,2368548)),Xe.metalPale.color.copy(St(6973282,3815994)),Xe.enamel.color.copy(St(3420719,2105376)),Xe.metal.envMapIntensity=1.3+(.25-1.3)*at,Xe.metalPale.envMapIntensity=1.1+(.25-1.1)*at}if(te||(te={},t.scene.traverse(Xe=>{const at=Xe;at.isLight&&at!==Ee&&at.isSpotLight&&(te.blade=at),at.isLight&&at.isPointLight&&at.color.r>.9&&at.color.g<.1&&(te.red=at)})),me.value=(te.blade?.intensity??0)*.4,Y===mn){te||(te={},t.scene.traverse(at=>{const St=at;St.isLight&&St!==Ee&&St.isSpotLight&&(te.blade=St),St.isLight&&St.isPointLight&&St.color.r>.9&&St.color.g<.1&&(te.red=St)})),te.blade&&e==="low"&&(te.blade.intensity*=1-.75*ie(vt((Oe-.2)/.15)));const Xe=!H.inHold&&H.u<.35;te.red&&Xe&&(te.red.intensity*=1-ie(H.u/.35)),te.red&&!Xe&&(te.red.intensity*=ie(vt((Oe-.25)/.3))*(1+3*ht),te.red.position.copy(ge).add(new C(0,-.4,0)),te.red.distance=3.5),Pe.value=ie(vt((Oe-.25)/.3))}xe(Y===mn?ie(vt((H.local("G")-.08)/.12))*(1-ie(vt((H.local("G")-.27)/.03))):0);const mt=H.trick("0"),ct=H.trick("1"),Xt=mt.on?mt:ct;if(Y<=1&&(Zn.gain.value=0),Ve.visible=Y<=1&&Xt.k>0,Ye.visible=Y===1&&Ve.visible,Ve.visible){const Xe=vt((Xt.t-Bn.pulse+.1)/1.4);ce.value.z=Xe*40,we.value=Xt.k*(Y===1?.9:.6)*(.75+.25*Math.sin(Xt.phase*Math.PI*2*(Y===1?1:2)))}else we.value=0;ur.value=we.value,tc.value=re?1:0,Os.value*=1-.85*vt(we.value*3),Y===1&&te.red&&(te.red.position.copy(Ke),te.red.intensity=0,te.red.distance=10);let Ft=Ao-.6*Fn;if(ct.k>0){const Xe=Te[1].trick.loop,at=ct.phase*Xe,St=[0,.9,2.6,3.2,6],Dt=St.findIndex((k0,Pa)=>at>=k0&&at<(St[Pa+1]??99)),Ln=St[Math.max(0,Dt)],En=at-Ln,Hn=[.9,1.7,.6,2.8][Math.max(0,Dt)]??1,To=ie(En/(Hn*.7))*(En<Hn*.78?1:0),Xo=En>=Hn*.78?Math.exp(-(En-Hn*.78)*18)*Math.cos((En-Hn*.78)*70)*.25:0;Ft+=(To+Xo)*Fn*ct.k+Math.sin(H.state.time*90)*.0012*ct.k}else Ft+=Math.sin(H.state.time*70)*6e-4;Y===9&&H.inHold&&(Ft=Ao-.6*Fn+(H.state.reduced?0:H.state.time)*Math.PI*2/60),x.rotation.order="YXZ",x.rotation.y=-(vr??Ft),x.rotation.x=Y===1?-2.05*Fn:0;const bn=Y===1?ct.k:0;if(Ee.intensity=0,bn>0){$t.set(H.state.pointer.x*2-1,1-H.state.pointer.y*2),Tt.setFromCamera($t,H.camera),(!Tt.ray.intersectPlane(Qt,Nt)||Nt.distanceTo(Tt.ray.origin)>2.4)&&(Tt.ray.at(2.4,Nt),Nt.y=Math.max(0,Nt.y-.3)),Nt.length()>Re.dialR-.5&&Nt.setLength(Re.dialR-.5);const Xe=sa(Ao,19.9);Nt.lerp(new C(Xe[0],0,Xe[1]),1),Ee.target.position.copy(Nt),Ee.position.set(Nt.x-3.5,6,Nt.z-1.5),Ee.intensity=260*ie(vt((ct.t-Bn.settle)/.6))*bn}Ee.shadow.autoUpdate=Ee.intensity>0,Pt&&(xt.uniforms.uWOn.value=Y===1&&ct.rare>=0?ie(ct.rare/.2)*(1-ie((ct.rare-.8)/.2)):0)}}}const o0=24,zs=7,T1=60/Te.find(t=>t.id==="2").light.blade.power,F1=.3,Oo=2.7,Kr=`
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
}`,Xr=`
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
  return ${Ao.toFixed(6)} + tick * 0.10472;
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
    vec2 uv = vec2(q.x / ${(2*o0).toFixed(1)} + 0.5, -q.y / ${(2*o0).toFixed(1)} + 0.5);
    float inside = step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
    col = texture2D(tPic, uv).rgb * inside;
    hit = inside;
    float px = max(fwidth(q.x) + fwidth(q.y), 0.015) * 0.7;
    float a = handAngle(vPh);
    if (uSmall > 0.5) {
      float lag = vPh * smoothstep(0.35, 0.75, uRareT) * 1.7;
      a = ${Ao.toFixed(6)} + floor(clamp(uRareT * 9.0 - lag, 0.0, 6.0) + 0.0) * 0.10472 * step(0.02, uRare);
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
  col *= ${Oo.toFixed(2)};
  float rim = smoothstep(0.42, 0.06, cs);
  col *= (1.0 - 0.96 * rim) * (1.0 - tir);
  col += vec3(0.004 * ${Oo.toFixed(2)}) * uDark;
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
}`;function _1(t,e){const{kit:n,renderer:o,scene:s}=t,a=n.q,r=new gt,i=a==="low"?512:1024,c=new a0(i,i,{type:c0,samples:a==="low"?0:4}),l=new xi(-o0,o0,o0,-o0,.1,40);l.position.set(0,6,0),l.up.set(0,0,-1),l.lookAt(0,0,0),l.updateMatrixWorld(),l.layers.set(zs);let d=!1;const u=()=>{if(d)return;d=!0;const L=/^(hand-hour|hand-minute|hand-pipes|enamel-|base-|ticks-|numerals-)/;e.group.traverse(J=>{let ue="",ve=J;for(;ve&&ve!==e.group&&!ue;)ue=ve.name,ve=ve.parent;let pe=!1;for(ve=J;ve;)ve===e.hand&&(pe=!0),ve=ve.parent;L.test(ue)&&!pe&&J.isMesh&&J.layers.enable(zs)}),s.traverse(J=>{J.isLight&&J.layers.enable(zs)})},f={tPic:{value:c.texture},uGain:{value:1},uDark:{value:1},uL:{value:new C(-36.4,33,-31.9).normalize()},uRim:{value:.55*Oo},uPin:{value:2.2*Oo},uCaus:{value:.9*Oo},uHand:{value:0},uShade:{value:0},uShadeC:{value:-30},uShadeT:{value:0},uRare:{value:0},uRareT:{value:0},uSmall:{value:0},uQ0:{value:new bt(-1.03,-14.8)},uQc:{value:new bt(1,-2)},uWide:{value:3.2},uC:{value:new C(...Do)},uR:{value:os},uB:{value:new C(0,1,0)},uBulge:{value:0},uTime:{value:0}},p=new un({uniforms:f,vertexShader:Kr,fragmentShader:Xr}),v=a==="low"?[64,48]:[160,120],h=new l0(1,v[0],v[1]);h.setAttribute("aPh",new rt(new Float32Array(h.attributes.position.count),1));const m=new je(h,p);m.position.set(...Do),m.scale.setScalar(os),m.frustumCulled=!1,r.add(m);const M={...f,uGain:{value:.15},uRim:{value:.18*Oo},uPin:{value:1.6*Oo},uCaus:{value:0},uSmall:{value:1},uBulge:{value:0}},x=new un({uniforms:M,vertexShader:Kr,fragmentShader:Xr}),g=et(2207),w=12,b=new l0(1,40,28),S=new Float32Array(w),P=new gn(b,x,w),z=new se,_=new Wt,R=new C,k=new C,y=new C(...Do),A=[.14,.22,.34];let F=0;const T=Te.find(L=>L.id==="2").pose,I=new C(...T.pos),Q=new C(...T.look).add(new C(...a==="low"?T.pl??[0,0,0]:[0,0,0])).sub(I).normalize(),X=Q.clone().cross(new C(0,1,0)).normalize(),E=X.clone().cross(Q),N=I.distanceTo(y),$=Math.tan(10.24/90);for(let L=0;F<w&&L<4e3;L++){const J=F<4,ue=F>=4&&F<7,ve=J?N+(g()-.5)*2.5:ue?14+g()*5:27.5+g()*3;let pe=J?a==="low"?-1.6+g()*3.4:.25+g()*.7:(g()*2-1)*1.9;ue&&(pe=(g()<.5?-1:1)*(1.25+g()*.55)),!J&&!ue&&(pe=-1.7+(F-7)*.78+(g()-.5)*.5);const fe=J?(g()*2-1)*.75:ue?(g()*2-1)*1.1:.35+g()*.65;if(k.copy(I).addScaledVector(Q,ve).addScaledVector(X,pe*$*ve*.924*(a==="low"?.32:1)).addScaledVector(E,fe*$*ve*(a==="low"?1.6:1)),k.y<3.2)continue;const Le=ve<N,Fe=new C().subVectors(k,I),De=new C().subVectors(y,I);if(Fe.normalize().angleTo(De.normalize())<(Le?.1:.06))continue;let Ue=!1;for(let He=0;He<F;He++)P.getMatrixAt(He,z),new C().setFromMatrixPosition(z).sub(I).normalize().angleTo(Fe)<.022&&(Ue=!0);if(Ue)continue;const Se=J?.3+g()*.12:ue?.3+g()*.1:A[F%3]*(.6+g()*.25);R.setScalar(Se),z.compose(k,_,R),P.setMatrixAt(F,z),S[F]=g(),F++}P.count=F,b.setAttribute("aPh",new vn(S,1)),P.frustumCulled=!1,r.add(P);const q={tPic:{value:c.texture},uGain:{value:6.4},uO:{value:new bt(2.5,-17)},uD:{value:new bt(-29,-26).normalize()}},D=new un({uniforms:q,transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
uniform sampler2D tPic;
uniform float uGain;
uniform vec2 uO;
uniform vec2 uD;
varying vec3 vW;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec2 uv = vec2(vW.x / ${(2*o0).toFixed(1)} + 0.5, -vW.z / ${(2*o0).toFixed(1)} + 0.5);
  vec3 c = texture2D(tPic, uv).rgb;
  vec2 hd = vec2(sin(${Ao.toFixed(6)}), -cos(${Ao.toFixed(6)}));
  float hl = dot(vW.xz, hd), hs = abs(dot(vW.xz, vec2(-hd.y, hd.x)));
  c *= 1.0 - 0.9 * (1.0 - smoothstep(0.25, 0.6, hs)) * step(-4.5, hl) * (1.0 - smoothstep(19.0, 19.6, hl));
  vec2 d = vW.xz - uO;
  float along = dot(d, uD), side = dot(d, vec2(-uD.y, uD.x));
  float w = 3.2 + 2.0 * vn(vec2(along * 0.12, 1.7));
  float band = exp(-(((side + 2.0 * vn(vec2(along * 0.2, 4.0)) - 1.0) / w) * ((side + 2.0 * vn(vec2(along * 0.2, 4.0)) - 1.0) / w)));
  float pass = 0.05 + 0.95 * band * (0.55 + 0.45 * vn(vec2(along * 0.09, side * 0.09)));
  gl_FragColor = vec4(c * uGain * pass, 0.0);
}`}),V=new j0(21.4,128,0,Math.PI*2);V.rotateX(-Math.PI/2);{const L=V.attributes.position;for(let J=0;J<L.count;J++)L.setY(J,ro(Math.hypot(L.getX(J),L.getZ(J)))+.02)}const O=new je(V,D);O.renderOrder=-1,r.add(O);const j=3,ae=new C,ye=new C;let _e=!1;return{group:r,update(L){const J=L.i,ue=L.local("G"),ve=J===2||J===j&&ue<.3||J===1&&!L.inHold&&L.u>.3;r.visible=ve;const pe=J===2||J===j&&!L.inHold&&L.u<.3;if((pe||_e)&&(w0.value=pe?F1:1,_e=pe),!ve)return;P.visible=J===2||J===j&&!L.inHold&&L.u<.3,O.visible=J===2||J===j;const fe=L.trick("2"),Le=L.state.time;f.uTime.value=Le;const Fe=fe.phase,De=fe.k;f.uHand.value=De>0?vt(Fe/.7)*(1-ie((Fe-.8)/.06)):0,f.uShade.value=De>0?1:0,f.uShadeC.value=-24+66*ie((Fe-.42)/.58),f.uShadeT.value=fe.t,f.uGain.value=1+1.3*De;const Ue=Te[2],Se=Te[1].exposure??1,He=Ue.exposure??1,ot=Te[j],ke=ot.exposure??1,be=J===2&&!L.inHold?Se+(He-Se)*ie(L.u/(Ue.exposureIn??1)):J===j?L.inHold?ke:He+(ke-He)*ie(L.u/(ot.exposureIn??1)):He;q.uGain.value=6.4*(1+.4*De)*He/be*(J===2&&!L.inHold?ie((L.u-.1)/.35):J===j?1-ie((ue-.12)/.16):1),f.uRim.value=.55*Oo*(1-.55*De),f.uCaus.value=.9*Oo*(1-.7*De);const Z=fe.rare>=0?fe.rare:-1;if(M.uRare.value=Z>=0?1:0,M.uRareT.value=Math.max(0,Z),M.uGain.value=.15+(Z>=0?1.4*Math.sin(Math.PI*vt(Z*1.15)):0)+.05*De,fe.on&&De>0){ae.set((L.state.pointer.x-.5)*2,-(L.state.pointer.y-.5)*2,.5).unproject(L.camera).sub(L.camera.position).normalize();const We=y.clone().sub(L.camera.position),Je=We.dot(ae);ye.copy(L.camera.position).addScaledVector(ae,Je).sub(y);const U=ye.length();ye.addScaledVector(We.normalize(),-.6).normalize(),f.uB.value.copy(ye),f.uBulge.value=.2*De*Math.exp(-Math.max(0,U-1.2)/3)}else f.uBulge.value=0;u();const G=o.getRenderTarget(),K=w0.value,oe=Zn.gain.value;w0.value=0,Zn.gain.value=0;const de=[];s.traverse(We=>{We.isSpotLight&&de.push([We,We.intensity])}),de.forEach(([We,Je])=>We.intensity=Je*T1);const Ce=o.shadowMap.autoUpdate;o.shadowMap.autoUpdate=!1,o.setRenderTarget(c),o.clear(),o.render(s,l),o.setRenderTarget(G),o.shadowMap.autoUpdate=Ce,w0.value=K,Zn.gain.value=oe,de.forEach(([We,Je])=>We.intensity=Je)}}}const I1=Math.PI*2,bo=(t,e,n)=>{const o=Math.min(1,Math.max(0,(n-t)/(e-t)));return o*o*(3-2*o)},Gs=t=>.5-.5*Math.cos(I1*t);function Zr(t){t=t-Math.floor(t);const e=Gs(t),n=1+.35*bo(0,.3,t)*(1-bo(.75,.97,t)),o=bo(.12,.28,t)*(1-bo(.75,.95,t)),s=1-bo(.2,.42,t)*(1-bo(.85,.98,t)),a=.43,r=Math.max(0,(t-a)/.05),i=t<a?0:Math.min(1.12,1-Math.exp(-r*3.2)*Math.cos(r*5))*(1-bo(.8,.97,t)),c=t<a?0:bo(a,a+.03,t)*(1-bo(.55,.72,t)),l=bo(.08,.3,t)*(1-bo(.8,.97,t));return{s:e,grow:n,ch:o,bridge:s,rec:i,bead:c,open:l}}const nc=`
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
`,L1=`
attribute vec3 iA;
attribute vec3 iB;
attribute vec4 iR;
attribute vec4 iS;
${nc}
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
`,E1=`
attribute vec2 aM;
attribute vec4 aE;
attribute vec3 aTu;
attribute vec3 aTv;
${nc}
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
`,q0=30,D1=`
uniform vec4 uH[${q0}];
uniform vec4 uH2[${q0}];
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
  for (int i = 0; i < ${q0}; i++) {
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
`;function W1(t,e,n){const o=[],s=[];for(let r=0;r<3;r++){const i=o.length/3,c=r<2?t:n;for(let d=0;d<=c;d++)for(let u=0;u<e;u++)o.push(d/c,u/e*Math.PI*2,r);const l=o.length/3;o.push(1.01,0,r);for(let d=0;d<c;d++)for(let u=0;u<e;u++){const f=i+d*e+u,p=i+d*e+(u+1)%e,v=f+e,h=p+e;s.push(f,p,v,p,h,v)}for(let d=0;d<e;d++){const u=i+c*e+d,f=i+c*e+(d+1)%e;s.push(u,f,l)}}const a=new Sa;return a.setAttribute("position",new rt(o,3)),a.setIndex(s),a}function Qr(t,e,n,o,s,a){const r=t.onBeforeCompile;return t.onBeforeCompile=(i,c)=>{r.call(t,i,c),Object.assign(i.uniforms,e,{uLoPxH:Z0}),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${n}`).replace("#include <beginnormal_vertex>",`${o}
vec3 objectNormal = loN;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = loP;"),a&&(i.fragmentShader=a(i.fragmentShader))},t.customProgramCacheKey=()=>s,t}function e0(t,e,n){const o=t.top.length-1,s=(r,i)=>{const c=i*o,l=Math.min(o-1,Math.floor(c)),d=c-l;return r[l].clone().lerp(r[l+1],d)},a=t.waist?.5+(e-.5)*(1-t.waist*Math.sin(Math.PI*n)):e;return s(t.top,a).lerp(s(t.bot,a),n)}function N1(t,e){const n=[],o=[],s=[],a=[],r=[],i=[],c=[],l=[];t.forEach((u,f)=>{u.top.length-1;const p=e?u.small?10:22:u.small?18:44,v=e?u.small?14:36:u.small?28:80,h=(w,b)=>e0(u,w,b),m=(()=>{let w=0,b=h(0,.5);for(let S=1;S<=60;S++){const P=h(S/60,.5);w+=P.distanceTo(b),b=P}return w})(),M=w=>{let b=0,S=h(w,0);for(let P=1;P<=20;P++){const z=h(w,P/20);b+=z.distanceTo(S),S=z}return b},x=M(.5);l.push({W:m,H:x});const g=n.length/3;for(let w=0;w<=v;w++){const b=w/v,S=M(b);for(let P=0;P<=p;P++){const z=P/p,_=h(b,z),R=.001,k=h(Math.min(1,b+R),z).sub(h(Math.max(0,b-R),z)),y=h(b,Math.min(1,z+R)).sub(h(b,Math.max(0,z-R))),A=k.clone().cross(y).normalize();n.push(_.x,_.y,_.z),o.push(A.x,A.y,A.z);const F=S*z-(x*.5-S*.5);s.push(m*b,F);let T=1e3;(u.free==="topbot"||u.free==="bot")&&(T=Math.min(T,S*(1-z))),u.free==="topbot"&&(T=Math.min(T,S*z)),u.free==="sides"&&(T=Math.min(T,m*Math.min(b,1-b)*(1-u.waist*Math.sin(Math.PI*z))));const I=u.free==="sides"?Math.sin(Math.PI*z)*.6:Math.sin(Math.PI*b)*(u.free==="bot"?z:1);a.push(T,I,u.free!=="sides"&&z>.5?1:0,f),k.normalize(),y.normalize(),r.push(k.x,k.y,k.z),i.push(y.x,y.y,y.z)}}for(let w=0;w<v;w++)for(let b=0;b<p;b++){const S=g+w*(p+1)+b,P=S+p+1;c.push(S,P,S+1,S+1,P,P+1)}});const d=new In;return d.setAttribute("position",new rt(n,3)),d.setAttribute("normal",new rt(o,3)),d.setAttribute("aM",new rt(s,2)),d.setAttribute("aE",new rt(a,4)),d.setAttribute("aTu",new rt(r,3)),d.setAttribute("aTv",new rt(i,3)),d.setIndex(c),{g:d,sizes:l}}function oc(t){const e=t.q==="low",n=e?t.strands.filter(R=>(R.tier??1)<2):t.strands,o=e?t.webs.filter(R=>!R.small):t.webs,s={uT:{value:0},uK:{value:0},uPO:{value:new C},uPD:{value:new C(0,0,-1)},uLean:{value:1}},a=new gt,r=W1(e?40:110,e?6:10,e?16:36),i=Math.max(1,n.length),c=new Float32Array(i*3),l=new Float32Array(i*3),d=new Float32Array(i*4),u=new Float32Array(i*4),f=(R,k)=>{c.set([k.a.x,k.a.y,k.a.z],R*3),l.set([k.b.x,k.b.y,k.b.z],R*3);const y=(k.snap?1:0)+(k.end==="drop"?2:0);d.set([k.w,k.sag??k.a.distanceTo(k.b)*.1,k.ph??0,y],R*4),u.set([k.nk??.5,Math.min(7,k.beads??0),k.seed??R*1.37,k.drop??0],R*4)};n.forEach((R,k)=>f(k,R));const p={iA:new vn(c,3),iB:new vn(l,3),iR:new vn(d,4),iS:new vn(u,4)};for(const[R,k]of Object.entries(p))k.setUsage(zi),r.setAttribute(R,k);r.instanceCount=n.length;const v=Qr(jo({env:t.env??1}),s,L1,"loStrand();","ss-sticky-strand"),h=new je(r,v);h.frustumCulled=!1,a.add(h);const m={uH:{value:Array.from({length:q0},()=>new ln)},uH2:{value:Array.from({length:q0},()=>new ln(0,0,-1,0))},uPa:{value:new ln},uPb:{value:new ln},uPc:{value:new ln(0,0,0,-1)},uRim:{value:.05},uLv:{value:new C(0,1,0)},uHl:{value:1},uWs:{value:0}};let M=null,x=[];const g=[];if(o.forEach((R,k)=>R.holes.forEach(y=>g.push({w:k,h:y}))),o.length){const R=N1(o,e);x=R.sizes;const k=jo({env:(t.env??1)*1.3});k.side=vo,Qr(k,{...s,...m},E1,"loWeb();","ss-sticky-web",I=>I.replace("#include <common>",`#include <common>
${D1}`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
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
#include <opaque_fragment>`)),M=new je(R.g,k),M.frustumCulled=!1,a.add(M);const y=new In,A=R.g.getIndex().array,F=[];for(let I=0;I<A.length;I+=3)F.push(A[I],A[I+1],A[I+2],A[I],A[I+2],A[I+1]);y.setAttribute("position",R.g.getAttribute("position")),y.setIndex(F);const T=new je(y,new un({colorWrite:!1,depthWrite:!1,vertexShader:"void main() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }",fragmentShader:"void main() { gl_FragColor = vec4(0.0); }"}));T.material.depthWrite=!0,T.frustumCulled=!1,a.add(T)}const w=(R,k,y)=>R+(k-R)*y;function b(R,k){if(!M)return;const y=Zr(R),A=Zr(0),F=V=>w(A[V],y[V],k),T=F("grow"),I=F("ch"),Q=F("bridge"),X=F("rec"),E=F("bead"),N=F("open");let $=-1,q=-1,D=-1;if(g.forEach(({w:V,h:O},j)=>{if(j>=q0)return;const ae=x[V],ye=w(Gs(O.ph??0),Gs((O.ph??0)+R),k);let _e=1;(O.kind==="breathe"||!O.kind)&&(_e=1+.18*ye),O.kind==="open"&&(_e=N),(O.kind==="pairA"||O.kind==="pairB")&&(_e=T,D=V,O.kind==="pairA"?$=j:q=j),m.uH.value[j].set(O.u*ae.W,O.v*ae.H,O.rx*ae.W*_e,O.ry*ae.W*_e),m.uH2.value[j].set(O.ang??0,0,V,(O.ph??0)*6.283+j)}),$>=0&&q>=0){const V=m.uH.value[$],O=m.uH.value[q];m.uPa.value.set(V.x,V.y,O.x,O.y);const j=Math.hypot(O.x-V.x,O.y-V.y),ae=Math.min(V.z,V.w),ye=Math.min(O.z,O.w),_e=Math.max(.01,j-Math.max(V.z,V.w)-Math.max(O.z,O.w)),L=.014,J=Math.min(ae,ye)*.7*I,ue=(j+Math.max(V.z,V.w)-Math.max(O.z,O.w))*.5,ve=w(L,_e+.2,Q);m.uPc.value.set(J,ve,J*Math.min(1.12,X),D),m.uPb.value.set(E*L*3.4,0,0,ue)}m.uWs.value=F("s")}function S(R){m.uLv.value.copy(R).normalize()}function P(R,k,y,A=1){s.uT.value=R,s.uK.value=k,s.uPO.value.copy(y.origin),s.uPD.value.copy(y.direction),s.uLean.value=A,b(R,k)}function z(R,k){f(R,k)}function _(){for(const R of Object.values(p))R.needsUpdate=!0}return{group:a,strands:h,webs:M,uniforms:s,webUniforms:m,update:P,setLight:S,moveStrand:z,commit:_,material:v,kept:n,sizes:x}}function B1(t){const e=t>2?28:14,n=t>2?10:5,o=[],s=[];for(let r=0;r<=e;r++){const i=r/e*Math.PI*2;for(let c=0;c<=n;c++){const l=c/n,d=Math.cos(l*Math.PI/2),u=Math.sin(l*Math.PI/2)*.55,f=Math.cos(i),p=Math.sin(i),v=p<0?1+1.6*(-p)**1.5:1;o.push(f*d*(1-.12*(p<0?-p:0)),u*(p<0?1-.45*-p:1),p*d*v)}}for(let r=0;r<e;r++)for(let i=0;i<n;i++){const c=r*(n+1)+i,l=c+n+1;s.push(c,c+1,l,c+1,l+1,l)}const a=new In;return a.setAttribute("position",new rt(o,3)),a.setIndex(s),a.computeVertexNormals(),a}function H1(t){const e=t?40:18,n=[];for(let s=0;s<=e;s++){const a=s/e,r=.022+.05*Math.exp(-a/.05)+.035*Math.exp(-(((a-0)/.12)**2)),i=.022*(1-.35*Math.exp(-(((a-.45)/.18)**2))),c=Math.max(0,1-((a-.45)/.09)**2)**.85*.05,l=a>.6?1-(a-.6)/.4:1;n.push(new bt(Math.max(8e-4,Math.max(a<.1?r:i,c)*(a>.6?l**1.3:1)),a))}const o=new ki(n,t?12:6);return o.computeVertexNormals(),o}const Rt=(t=0,e=0,n=0)=>new C(t,e,n),Oa=Math.PI*2,Zo=Te.findIndex(t=>t.id==="3"),O1=.5,Va=2.5,V1=2.4,la=.5,q1=.35;function G1(t){const{kit:e}=t,n=e.q,o=z0(n),s=n==="low",a=new gt,r=et(303),i=Te[Zo],c=(W,ee,le,Ne=!0)=>{const Ie=new je(W,an({tier:n,...ee}));return le&&Ie.applyMatrix4(le),Ie.castShadow=Ne&&!s,Ie.receiveShadow=!s,Ie},l=(W,ee,le={})=>{for(const Ne of W.inst){if(!Ne.mats.length)continue;const Ie=new gn(Ne.geo,an({finish:Ne.finish,seed:Ne.seed,tier:n,...le}),Ne.mats.length);Ne.mats.forEach((pt,qe)=>Ie.setMatrixAt(qe,pt)),Ie.instanceMatrix.needsUpdate=!0,Ie.computeBoundingSphere(),Ie.castShadow=!1,Ie.receiveShadow=!s,ee.add(Ie)}},d={value:new ln(0,1,0,0)},u=v0.clone().multiplyScalar(.72).addScaledVector(O0,-.69).normalize(),f=x0.clone().addScaledVector(u,-x0.dot(u)).normalize(),p=f.clone().cross(u).normalize(),v=V1+q1,h=new C(3.5,v+la/2,-.3),m=$c,M=new se().makeBasis(f,u,p),x=m.clone().sub(h.clone().applyMatrix4(M));M.setPosition(x);const g=(W,ee,le)=>Rt(W,ee,le).applyMatrix4(M);{const W=Array.from({length:96},(Ne,Ie)=>[Math.cos(Ie/96*Oa)*23.5,Math.sin(Ie/96*Oa)*23.5]),ee=[[-9,6,1.2],[3,-4,.9],[-14,-6,1.6],[8,10,.7],[-3,14,1.1],[12,-2,.8]].map(([Ne,Ie,pt])=>({at:[Ne,Ie],r:pt,sink:pt*.6})),le=mo({outline:W,holes:ee,t:1.6,bevel:.15,detail:o,round:0});a.add(c(le.geo,{finish:"grained",seed:301,age:.5,tone:.2,direct:.1,wear:.5},new se().makeTranslation(0,L0-.8,0),!1))}const w=new gt;w.applyMatrix4(M),a.add(w);const b=Ll({R:Va,detail:o,seed:31});w.add(c(b.pieces[0].geo,{finish:"turned",seed:31,age:.3,tone:.5,direct:.5,rim:d})),w.add(c(b.pieces[1].geo,{finish:"sunray",seed:32,age:.15,tone:.3,direct:.35},b.pieces[1].at));{const W=$o({teeth:32,r:1.25,profile:"ratchet",spokes:0,hole:.3,t:.4,detail:o,seed:33,bevel:.04});W.translate(0,v+la/2+.2,0),w.add(c(W,{finish:"sunray",seed:33,age:0,wear:.05,tone:.3,direct:.5}))}const S=(()=>{const W=us(qe=>[qe*6,-qe*.5],qe=>1.45-.6*(qe*qe*(3-2*qe)),lt(70,o,24),18),ee=[[-.9,-.9],[5.95,-.5],[.9,.95]],le=mo({outline:W,holes:[...ee.map(qe=>({at:qe,r:.5,sink:.3})),{at:[0,0],r:.6,bush:!0}],t:la,bevel:.1,detail:o,round:1}),Ne=new se().makeTranslation(0,v,0).multiply(new se().makeRotationY(0)),Ie=c(le.geo,{finish:"brushed",seed:21,age:0,tone:.14,direct:.3,wear:0},Ne);{const qe=Ie.material,Jt=qe.onBeforeCompile,Et=qe.customProgramCacheKey;qe.onBeforeCompile=(Bt,wt)=>{Jt.call(qe,Bt,wt),Bt.fragmentShader=Bt.fragmentShader.replace(`reflectedLight.directSpecular *= uRS2.y;
reflectedLight.directDiffuse *= uRS2.y;`,`float bandM = mix(0.08, 1.0, 1.0 - smoothstep(0.32, 0.62, abs(vOP.z + 0.3)));
reflectedLight.directSpecular *= uRS2.y * bandM;
reflectedLight.directDiffuse *= uRS2.y * bandM;`)},qe.customProgramCacheKey=()=>Et.call(qe)+"-band"}le.bushes&&w.add(c(le.bushes,{finish:"polished",seed:22,age:.3},Ne));const pt=new gt;return pt.applyMatrix4(Ne),w.add(pt),l({inst:wa("small",ee,la/2-.19,21,{detail:o,abused:[2]})},pt,{age:.4,tone:.8}),w.add(Ie),{mesh:Ie,m:Ne}})();{const W=S.m.clone().invert(),ee=h.clone().applyMatrix4(W),le=Rt(1,0,0).transformDirection(W),Ne=Rt(0,0,-1).transformDirection(W),Ie=K0("barrel-bridge",S.mesh,{at:[ee.x,ee.y,ee.z],right:[le.x,le.y,le.z],up:[Ne.x,Ne.y,Ne.z],width:7.6,depth:.12},t.lang,{tier:n}),pt=globalThis;(pt.__secondWait??=[]).push(Ie.ready)}const P=[],z=3.2,_=.8,R=Va-.3,k=1.2;for(let W=0;W<=160;W++){const ee=W/160,le=k+ee*z*Oa,Ne=_+(R-_)*Math.pow(ee,.85);P.push(g(Math.cos(le)*Ne,.75,Math.sin(le)*Ne))}const y=k+z*Oa,A=g(Math.cos(y+.5)*(Va+.25),.8,Math.sin(y+.5)*(Va+.25)),F=new ba([...P,A,...Bs],!1,"centripetal"),T=s?500:1400,I=F.getSpacedPoints(T),Q=F.getLength(),E=(()=>{let W=0;for(let ee=1;ee<P.length;ee++)W+=P[ee].distanceTo(P[ee-1]);return W})()/Q,N=Rt(...i.light.blade.to).sub(Rt(...i.light.blade.from)).normalize(),$=(()=>{let W=0,ee=1e9;return I.forEach((le,Ne)=>{const Ie=le.distanceTo(Bs[3]);Ie<ee&&(ee=Ie,W=Ne)}),W/T})(),q=[],D=[],V=[];for(let W=0;W<=T;W++){const ee=W/T,le=I[Math.min(T,W+1)].clone().sub(I[Math.max(0,W-1)]).normalize(),Ne=Jo.clone().sub(I[W]).normalize(),Ie=N.clone().negate(),pt=Ie.addScaledVector(Ne,-Ie.dot(Ne)).normalize().addScaledVector(Ne,.14).normalize();let qe=pt.clone().addScaledVector(le,-pt.dot(le)).normalize();const Jt=Math.exp(-(((ee-$)/.1)**2)),Et=Math.exp(-(((ee-(E+($-E)*.45))/.07)**2)),Bt=(1-Jt)*(Math.PI*.5*Et+Math.sin(ee*23)*.45+(ee>$?(ee-$)*3.2:0));qe.applyAxisAngle(le,Bt);let wt=le.clone().cross(qe).normalize();if(ee<E+.02){const At=u.clone().addScaledVector(le,-u.dot(le)).normalize(),nt=ie((ee-E+.02)/.06);wt=At.lerp(wt,nt).normalize(),qe=wt.clone().cross(le).normalize()}q.push(le),D.push(qe),V.push(wt)}const O=3.1,j=O/14,ae=W=>O*(W>.985?.45+(1-W)*36:1),ye=ds({pts:I,side:V,w:ae,t:j,detail:o,cav:W=>W<E?.35:0});{const W=o===0?1:2,ee=4*(W+1),le=ye.getAttribute("normal"),Ne=Math.tan(.42),Ie=Rt(),pt=new Map([[W,1],[W+1,-1],[3*(W+1)-1,-1],[3*(W+1),1]]);if(le.count>=I.length*ee)for(let qe=0;qe<I.length;qe++)for(const[Jt,Et]of pt){const Bt=qe*ee+Jt;Ie.set(le.getX(Bt),le.getY(Bt),le.getZ(Bt)).addScaledVector(V[qe],Et*Ne).normalize(),le.setXYZ(Bt,Ie.x,Ie.y,Ie.z)}le.needsUpdate=!0}const _e={value:new ln(0,1,0,0)},L=c(ye,{finish:"polished",seed:34,age:.3,wear:.55,tone:.6,direct:1,objScale:1,envMap:.35,rim:_e},void 0,!1);{const W=L.material,ee=W.onBeforeCompile.bind(W),le=W.customProgramCacheKey.bind(W);W.onBeforeCompile=(Ne,Ie)=>{ee(Ne,Ie),Ne.fragmentShader=Ne.fragmentShader.replace("col += scr * 0.05 * (1.0 - pitM) * (1.0 - scaleM) * cF * uTone;","float stn = smoothstep(0.32, 0.5, scr + (tri(tNz, sp * 5.0, tw).r - 0.5) * 0.45 + (tri(tNz, sp * 13.0, tw).a - 0.5) * 0.2) * step(0.0001, scr); col = mix(col, 0.005, stn * (1.0 - scaleM)); col = mix(col, 0.004, smoothstep(0.02, 0.2, pitM));").replace("ssRough += scr * 0.035;","ssRough = mix(ssRough, 0.85, stn);").replace("float ssH = ","ssMetal = mix(ssMetal, 1.0, clamp(max(max(smoothstep(0.02, 0.2, pitM), chip * 0.85), stn), 0.0, 1.0)); float ssH = ").replace(" - pitH - scr"," - pitH * 0.15 - scr")},W.customProgramCacheKey=()=>le()+"-stain"}a.add(L);const J={uGain:{value:0},uT:{value:0}},ue=new je(new no(1,1),new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:J,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv * vec2(1.4, 1.0) + vec2(uT * 0.03, -uT * 0.02);
  float n = 0.5 * vn(q * 2.3 + 1.7) + 0.3 * vn(q * 5.1 + 4.2) + 0.2 * vn(q * 11.0 + 8.9);
  vec2 bq = vUv * vec2(1.1, 1.4); float body = exp(-dot(bq, bq) * 1.6);
  float e = body * (0.25 + 0.75 * smoothstep(0.28, 0.85, n)) * (0.6 + 0.4 * smoothstep(-0.6, 0.4, -vUv.y));
  gl_FragColor = vec4(vec3(0.6, 0.035, 0.02) * e * uGain, 0.0);
}`}));ue.position.copy(Sn(.62,-.22,17)),ue.lookAt(Jo),ue.scale.set(15,10,1),ue.renderOrder=4,ue.frustumCulled=!1,a.add(ue);const ve={uGain:{value:0}},pe=new je(new no(1,1),new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:ve,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; varying vec2 vUv;
float h1(float x) { return fract(sin(x * 91.7) * 43758.5); }
float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main() {
  vec2 d = normalize(vec2(0.8, -0.6)), n = vec2(-d.y, d.x);
  float a = dot(vUv, d), c = dot(vUv, n);
  float core = exp(-c * c * 5.0) * (1.0 - smoothstep(0.6, 1.0, abs(a)));
  float streak = 0.6 + 0.4 * vn(c * 19.0 + 2.0) * vn(c * 47.0 + 5.0);
  float e = core * streak * (1.0 - smoothstep(0.8, 1.0, length(vUv)));
  gl_FragColor = vec4(vec3(0.6, 0.59, 0.58) * e * uGain, 0.0);
}`}));pe.position.copy(Sn(-.4,.35,44)),pe.lookAt(Jo),pe.scale.set(46,30,1),pe.renderOrder=4,pe.frustumCulled=!1,a.add(pe);const fe=pe.clone();fe.position.copy(Sn(.38,.78,30)),fe.lookAt(Jo),fe.scale.set(15,8.5,1),a.add(fe);let Le=!1,Fe=0,De=1;L.frustumCulled=!1,L.onBeforeRender=()=>{if(!Le)return;const W=Fe;Ge.on=1,Ge.columns=Z.map(ee=>[...ee]),Ge.floorY=L0,Ge.red.set(10-2*W,L0+1+.5*W,-8+1.5*W),Ge.redSize.set(9+1.5*W,3.2+.6*W,9+1*W),Ge.redPower=(.12+.03*W)*De,Ge.ruby.set(fo[0],fo[1],fo[2]),Ge.rubyPower=0,Ge.nave.set(0,0,0,0),Ge.bladeGain=O1*(1-.5*W)*De,Ge.wake=W};for(let W=0;W<=T;W++)D[W].dot(Jo.clone().sub(I[W]))<0&&D[W].negate();const Ue=W=>{const ee=Math.round(vt(W)*T);return{p:I[ee].clone(),n:D[ee].clone(),s:V[ee].clone(),t:q[ee].clone(),w:ae(W)}},Se=(W,ee)=>{const le=Math.round(vt(W)*T);return ee.p.copy(I[le]),ee.n.copy(D[le]),ee.s.copy(V[le]),ee.t.copy(q[le]),ee.w=ae(W),ee},He=(W,ee=0,le=1,Ne=0)=>{const Ie=Ue(W);return Ie.p.addScaledVector(Ie.s,ee*Ie.w*.45).addScaledVector(Ie.n,le*(j*.5+Ne))},ot=new gt;a.add(ot);const ke=[];[[-.6,.35,22,3.6,96,1],[-.1,.62,26,3,80,2],[.45,.05,27,2.6,72,3],[-.4,.02,20,2,64,4],[.92,.72,24,3.2,84,5],[.12,.3,34,4.2,110,6],[-.85,.6,19,1.6,60,7]].forEach(([W,ee,le,Ne,Ie,pt],qe)=>{const Jt=$o({teeth:Ie,r:Ne,profile:"train",spokes:qe%3?5:4,rim:.08,hub:.14,hole:.2,detail:o,seed:330+qe,sheared:qe%2,fold:qe===2?.7:void 0,foldAt:qe===2?.5:void 0,snapped:qe===4}),Et=Sn(W,ee,le),Bt=new Nn(.6+pt*.7,pt*1.9,.4-pt*.5),wt=new se().compose(Et,new Wt().setFromEuler(Bt),Rt(1,1,1));if(ot.add(c(Jt,{finish:"sunray",seed:330+qe,age:.2,tone:.12,direct:.08,envMap:.4,rim:d},wt,!1)),ke.push({c:Et,r:Ne,ax:Rt(0,1,0).applyEuler(Bt)}),qe<5){const At=ha({length:4.5,ra:.16,leaves:8+qe,pinionR:.5,pinionH:.7,pinionAt:1.2,seatAt:2.2,detail:o,seed:340+qe}),nt=wt.clone().multiply(new se().makeTranslation(qe===0||qe===3?.55:0,qe===0||qe===3?-3.7:-2.2,qe===0||qe===3?.35:0));ot.add(c(At.geo,{finish:"turned",seed:340+qe,age:.6,tone:.45,direct:.3,rim:d},nt,!1))}});{const W=sr({length:12,width:2.4,t:.6,detail:o,seed:350}),ee=new se().compose(Sn(.55,.25,25),new Wt().setFromEuler(new Nn(1.1,.5,-.7)),Rt(1,1,1));ot.add(c(W.pieces[0].geo,{finish:"blackened",seed:350,age:.6,tone:.4,direct:.25,rim:d},ee,!1))}const Z=[];for(const[W,ee,le]of[[-.78,24,.9],[.98,22,.8],[.3,34,1],[-.25,38,.9]]){const Ne=Sn(W,0,ee),Ie=11.2,pt=Ni({h:Ie,r:le,detail:o});ot.add(c(pt,{finish:"turned",seed:360+Z.length,age:.6,tone:.4,direct:.3,rim:d},new se().makeTranslation(Ne.x,L0,Ne.z),!1)),Z.push([Ne.x,Ne.z,le,L0+Ie])}const G={value:new ln(0,1,0,0)},K=[];{const W=Hi({count:s?50:90,box:[1,1,1],centre:[0,0,0],seed:371,detail:o}),ee=et(372),le=new se,Ne=new Wt,Ie=Rt(),pt=Rt(),qe=x0.clone().multiplyScalar(.7).addScaledVector(v0,.55).addScaledVector(O0,-.45).normalize();for(const Jt of W.inst)Jt.mats.forEach(Et=>{Et.decompose(pt,Ne,Ie);const Bt=$-.12+ee()*.3,wt=Ue(Bt),At=Math.pow(ee(),1.6),nt=wt.p.addScaledVector(wt.n,.3+At*1.2).addScaledVector(qe,At*6.5).addScaledVector(wt.s,(ee()-.5)*(1+3*At)).addScaledVector(v0,(ee()-.5)*At*2),Kt=Ie.x*(.55+.5*(1-At));Et.copy(le.compose(nt,Ne,Rt(Kt,Kt,Kt))),At<.3&&K.length<16&&K.push(nt.clone())});l(W,a,{age:.4,tone:.8,rim:G})}const oe=[],de=[],Ce=[8,3,1.6],We=Sn(0,1,1).sub(Sn(0,0,1)).dot(v0),Je=Sn(1,0,1).sub(Sn(0,0,1)).dot(x0),U=W=>{const ee=W.clone().sub(Jo),le=ee.dot(O0);return{x:ee.dot(x0)/le/Je,y:ee.dot(v0)/le/We,z:le}},he=W=>U(W).z*2*We/1935,Me=(W,ee,le)=>Ce[W]*.5*he(ee.clone().lerp(le,.5))*(.85+.3*r()),ge=(W,ee,le,Ne={})=>oe.push({a:W,b:ee,w:Me(le,W,ee),tier:le,ph:r(),beads:le===2?0:3+Math.floor(r()*5),nk:.4+r()*.2,seed:r()*50,...Ne}),Pe=(W,ee)=>g(W,v+la/2-.1,ee),B=(W,ee=0,le=1)=>He(W,ee,le,-j*.45);for(let W=0;W<9;W++){const ee=E+.015+W*.012,le=1.9+W*.42+r()*.2,Ne=-.7-r()*.45;ge(B(ee,(r()-.5)*1.6,-1),Pe(le,Ne),W%3,{sag:.15+r()*.35,drop:W%3===0?.42+r()*.16:0,snap:W===4})}for(let W=0;W<Math.min(10,K.length);W++){const ee=$-.09+W*.02,le=B(ee,r()<.6?1:-1,1);ge(le,K[W],1+W%2,{sag:.15+r()*.3,snap:W===3||W===7})}for(let W=0;W<14;W++){const ee=E+.025+W*($-E-.03)/14+r()*.006;ge(B(ee,-1.05,1),B(ee+(r()-.5)*.02,1.05,1),W%3,{sag:-.18-r()*.3,snap:W%5===2})}for(let W=0;W<8;W++){const ee=.9+W*.011,le=$-.16+W*.022;ge(B(ee,(r()-.5)*1.6,-1),B(le,(r()-.5)*1.4,1),1+W%2,{sag:.2+r()*.3,drop:W%2?0:.45+r()*.1})}for(let W=0;W<9;W++){const ee=E+.06+W*(($+.05-E)/9),le=B(ee,(r()-.5)*1.5,-1),Ne=.4+r()*.9;ge(le,le.clone().add(Rt((r()-.5)*.2,-Ne,(r()-.5)*.2)),W%2,{sag:0,end:"drop",beads:1+Math.floor(r()*3)})}for(let W=0;W<2;W++){const ee=ke[W*2+1];ge(B($-.03+W*.05,(r()-.5)*1.4,-1),ee.c.clone().addScaledVector(v0,-ee.r*.9),0,{sag:.9,beads:6,drop:.5})}for(let W=0;W<8;W++){const ee=1.8+r()*3.6,le=-.7-r()*.4;ge(Pe(ee,le),Pe(ee+.3+r()*.9,le-.1-r()*.2),2,{sag:-.12-r()*.2})}const ne=(W,ee,le,Ne)=>{let Ie=He(W,1,0),pt=1e9;for(let qe=0;qe<=200;qe++)for(const Jt of[-1,1]){const Et=W+(ee-W)*qe/200,Bt=He(Et,Jt*.98,0),wt=U(Bt),At=Math.abs(wt.y-le)-Ne*wt.x*.02;At<pt&&(pt=At,Ie=Bt)}return Ie};{const W=ne(E+.02,$-.05,.12,1),ee=ne(E+.02,$-.05,-.42,1),le=ne($+.05,.99,.16,-1),Ne=ne($+.05,.99,-.03,-1),Ie=14,pt=(wt,At)=>At*U(wt).z*We,qe=[],Jt=[];for(let wt=0;wt<=Ie;wt++){const At=wt/Ie,nt=Math.sin(Math.PI*At),Kt=W.clone().lerp(le,At),pn=ee.clone().lerp(Ne,At);qe.push(Kt.add(Rt(0,-pt(Kt,.08)*nt,0))),pn.add(Rt(0,-pt(pn,.26)*nt*(1+.2*Math.sin(At*5)),0)),Jt.push(pn)}const Et={top:qe,bot:Jt,free:"topbot",rim:.04,holes:[{u:.62,v:.5,rx:.1,ry:.07,ang:.35,ph:.1},{u:.2,v:.62,rx:.068,ry:.05,ang:-.7,ph:.45},{u:.34,v:.3,rx:.046,ry:.034,ang:-.4,kind:"pairA"},{u:.44,v:.52,rx:.04,ry:.03,ang:.5,kind:"pairB"},{u:.8,v:.76,rx:.035,ry:.026,ang:1,ph:.4},{u:.09,v:.38,rx:.018,ry:.03,ang:.2,ph:.7},{u:.87,v:.3,rx:.028,ry:.019,ang:-.6,ph:.25},{u:.5,v:.84,rx:.022,ry:.016,ph:.55},{u:.7,v:.2,rx:.014,ry:.021,ang:.9,kind:"open"},{u:.22,v:.16,rx:.02,ry:.014,ang:.3,ph:.9},{u:.94,v:.58,rx:.011,ry:.009,ph:.15},{u:.36,v:.78,rx:.012,ry:.016,kind:"open"},{u:.53,v:.24,rx:.009,ry:.007,ph:.6},{u:.75,v:.45,rx:.008,ry:.011,ph:.3},{u:.3,v:.9,rx:.01,ry:.007,ph:.8},{u:.13,v:.82,rx:.007,ry:.009,ph:.2},{u:.62,v:.9,rx:.013,ry:.01,ang:.4,ph:.65},{u:.47,v:.1,rx:.012,ry:.008,ph:.05}]};de.push(Et);const Bt=(wt,At)=>{const nt=e0(Et,1,At).distanceTo(e0(Et,0,At)),Kt=e0(Et,wt,1).distanceTo(e0(Et,wt,0));for(let en=0;en<3;en++)for(const yn of Et.holes){const Tn=Math.max(yn.rx,yn.ry)*nt*1.6,zn=(wt-yn.u)*nt,go=(At-yn.v)*Kt,uo=Math.hypot(zn,go);if(uo<Tn){const jn=Tn/Math.max(uo,1e-6);wt=yn.u+zn*jn/nt,At=yn.v+(uo<1e-6?Tn:go*jn)/Kt}}const pn=e0(Et,Math.min(.98,Math.max(.02,wt)),Math.min(.95,Math.max(.05,At)));return pn.addScaledVector(pn.clone().sub(Jo).normalize(),-.02)};for(const[wt,At,nt,Kt,pn]of[[.5,.44,.73,.58,1],[.55,.6,.7,.38,2],[.12,.58,.28,.68,1],[.6,.42,.64,.6,2],[.3,.29,.4,.55,2],[.74,.72,.86,.8,2]])ge(Bt(wt,At),Bt(nt,Kt),pn,{sag:.05+r()*.1,beads:pn===1?4:0});for(const[wt,At]of[[.18,.5],[.33,.9],[.47,.35],[.58,1.1],[.71,.6],[.86,.4]]){const nt=e0(Et,wt,.97),Kt=e0(Et,wt,.8);ge(Kt,nt.clone().add(Rt((r()-.5)*.1,-At,0)),1,{sag:0,end:"drop",beads:1+Math.floor(r()*3)})}}for(const[W,ee,le,Ne,Ie]of[[3,E+.03,E+.1,-1,1],[1,E+.2,E+.3,-1,2]]){const pt=ke[W],qe=6,Jt=[],Et=[],Bt=He((ee+le)/2,Ne,0).sub(pt.c),wt=pt.ax.clone().normalize(),At=Bt.clone().addScaledVector(wt,-Bt.dot(wt)).normalize(),nt=wt.clone().cross(At);for(let Kt=0;Kt<=qe;Kt++){const pn=Kt/qe;Jt.push(He(ee+(le-ee)*pn,Ne*.98,0));const en=(pn-.5)*.9;Et.push(pt.c.clone().addScaledVector(At,Math.cos(en)*pt.r*.97).addScaledVector(nt,Math.sin(en)*pt.r*.97))}de.push({top:Jt,bot:Et,free:"sides",waist:.35,small:!0,rim:.03,holes:Ie===1?[{u:.45,v:.5,rx:.12,ry:.08,ang:.4,ph:.2},{u:.7,v:.28,rx:.05,ry:.04,kind:"open"},{u:.3,v:.76,rx:.04,ry:.06,ph:.6}]:[{u:.55,v:.42,rx:.1,ry:.07,ang:-.3,ph:.5},{u:.3,v:.7,rx:.05,ry:.035,ph:.1},{u:.74,v:.76,rx:.03,ry:.04,kind:"open"}]}),ge(Jt[0],Et[0],1,{sag:.1,beads:3}),ge(Jt[qe],Et[qe],1,{sag:.1,beads:4})}const te=s?28:56,ze=oe.length,xe=Array.from({length:te},(W,ee)=>E+.02+(ee+r()*.7)/te*($+.03-E)),we=Array.from({length:te},()=>.05+r()*r()*.12),ce=Array.from({length:te},()=>(r()-.5)*1.5),Ve=Array.from({length:te},()=>r());for(let W=0;W<te;W++)oe.push({a:He(xe[W]),b:He(xe[W]+.01),w:.01,tier:1,sag:0,beads:0,seed:W});const Ze=oc({strands:oe,webs:de,q:n,env:.8});a.add(Ze.group);const Ke=Array.from({length:te},(W,ee)=>Ze.kept.indexOf(oe[ze+ee])),ut=jo({env:.8}),Ye=new gn(B1(o),ut,te);Ye.frustumCulled=!1,a.add(Ye);const xt=s?18:30,Pt=new gn(H1(o),jo({env:.8}),xt);Pt.frustumCulled=!1,a.add(Pt);const Rn=E+($-E)*.62,dn=Array.from({length:xt},(W,ee)=>{const le=ee*2.399,Ne=Math.sqrt((ee+.5)/xt);return[Math.cos(le)*Ne,Math.sin(le)*Ne,.6+r()*.5]}),sn=new se,wn=new Wt,me=Rt(0,1,0),Qe=Rt(),Ae=new tr,st=Rt(),tt=Rt(),Ee=Rt(),Tt=new se,$t={p:Rt(),n:Rt(),s:Rt(),t:Rt(),w:0},Qt={p:Rt(),n:Rt(),s:Rt(),t:Rt(),w:0},Nt=Rt(),Yt=Rt(),Un=Rt(),Cn=Rt(),Ko=Rt(),d0=Rt(),lo=Rt(),it=Rt();return{group:a,update(W){if(a.visible=W.i>=Zo-1&&W.i<=Zo+1,!a.visible){De=0,Le=!1,Fe=0,ue.visible=pe.visible=fe.visible=!1;return}const ee=W.i===Zo&&W.inHold;W.camera.getWorldPosition(tt),Ee.copy(Ge.bladeDir).negate().transformDirection(W.camera.matrixWorldInverse),d.value.set(Ee.x,Ee.y,Ee.z,.5),_e.value.set(Ee.x,Ee.y,Ee.z,1.6),G.value.set(Ee.x,Ee.y,Ee.z,1.4);const le=W.trick("3"),Ne=le.phase,Ie=le.k;st.set(W.state.pointer.x*2-1,1-W.state.pointer.y*2,.5).unproject(W.camera),Ae.origin.copy(tt),Ae.direction.copy(st).sub(tt).normalize();const pt=le.rare>=0?le.rare:-1,qe=pt>=0?ie(pt/.35)*(1-ie((pt-.62)/.38)):0;Ze.setLight(Ee),Ze.update(Ne,Ie*(1-.6*qe),Ae,1);let Jt=.5,Et=1e9;for(let nt=0;nt<=40;nt++){const Kt=E+(1-E)*nt/40,pn=I[Math.round(vt(Kt)*T)],en=Ae.distanceSqToPoint(pn);en<Et&&(Et=en,Jt=Kt)}for(let nt=0;nt<te;nt++){const Kt=$+.02-(E+.03),pn=Ie>0?(Ne*(nt%3===0?2:1)+Ve[nt])%1:0;let en=Ie>0?E+.03+(xe[nt]-E-.03+pn*Kt*Ie)%(Kt+.25):xe[nt];en+=(Jt-en)*.25*Ie*Math.exp(-Math.abs(Jt-en)*6),en=en+(Rn-en)*qe;const yn=Ie>0?ie((en-E-.03)/.03)*(1-ie((en-$)/.04)):1,Tn=we[nt]*(Ie>0?.4+.6*yn:1)*(1-.7*qe),zn=Se(Math.min(.99,en),$t),go=zn.p.addScaledVector(zn.s,ce[nt]*zn.w*.45*(1-qe)).addScaledVector(zn.n,j*.5);Nt.copy(zn.t).addScaledVector(zn.n,-zn.t.dot(zn.n)).normalize(),Yt.copy(zn.n).cross(Nt),Tt.makeBasis(Yt,zn.n,Nt),wn.setFromRotationMatrix(Tt),sn.compose(go,wn,Un.set(Tn,Tn*(.7+.5*Ie*yn),Tn*(1+.5*Ie*yn))),Ye.setMatrixAt(nt,sn);const uo=Se(Math.max(E,en-(.012+.02*Ie)*yn),Qt),jn=uo.p.addScaledVector(uo.s,ce[nt]*uo.w*.45*(1-qe)).addScaledVector(uo.n,j*.5);Ke[nt]>=0&&Ze.moveStrand(Ke[nt],{a:jn,b:Cn.copy(go).addScaledVector(Nt,-Tn*1.2),w:Tn*(.08+.1*Ie),sag:-Tn*.1,beads:0,seed:nt})}Ze.commit(),Ye.instanceMatrix.needsUpdate=!0;const Bt=pt>=0?ie((pt-.3)/.22)*(1-ie((pt-.66)/.3)):0;if(Pt.visible=Bt>.001,Pt.visible){const nt=Se(Rn,$t),Kt=nt.n.dot(Qe.copy(tt).sub(nt.p))<0?nt.n.negate():nt.n,pn=nt.p.addScaledVector(Kt,j*.5),en=Qe.copy(tt).sub(pn).normalize(),yn=lo.copy(nt.s),Tn=it.copy(en).cross(yn).normalize();dn.forEach(([zn,go,uo],jn)=>{Ko.copy(en).multiplyScalar(.7).addScaledVector(yn,zn*1.5).addScaledVector(Tn,go*1.5).normalize(),wn.setFromUnitVectors(me,Ko);const mn=1.5*uo*Bt,ka=.45+.2*Bt;sn.compose(d0.copy(pn).addScaledVector(yn,zn*.15).addScaledVector(Tn,go*.15),wn,Un.set(mn*ka,mn,mn*ka)),Pt.setMatrixAt(jn,sn)}),Pt.instanceMatrix.needsUpdate=!0}const wt=W.i===Zo+1&&!W.inHold;De=ee||wt?1:W.i===Zo?ie((W.u-.35)/.25):0,Le=a.visible&&(ee||W.i===Zo&&W.u>.35||wt),Fe=Ie,ue.visible=a.visible&&(ee||W.i===Zo&&W.u>.35),J.uGain.value=.42*(1+.25*Ie)*De,J.uT.value=Ne,pe.visible=ue.visible,fe.visible=ue.visible,ve.uGain.value=.15*De;const At=L.material.ss;At.uRS2.value.y=wt?.5:1,At.uTone.value=wt?.45:.6,wt&&(_e.value.w=.2)}}}const ac=(t,e,n)=>{const o=vt((n-t)/(e-t));return o*o*(3-2*o)},oo=.2,M0=2.2*oo,u0=1.2*oo,fr=80,U1=2*oo,Go=fr*U1/(2*Math.PI),pa=.5*M0,ho=Go-pa,Lo=.028,ks=.026,G0=Math.PI*2/fr,Po=-G0/2,co=Lo*1.1,j1=.42,$1=.006;function Jr(t,e,n,o){const s=new hn,a=n/2,r=[{...t,pts:as(ss(t.pts),!0)},...e.map(l=>({...l,pts:as(ss(l.pts),!1)}))],i=[],c=[];for(const l of r){const d=l.pts,u=d.length,f=l.bevel??o,p=[];for(let S=0;S<u;S++){const P=d[S],z=d[(S+1)%u],_=z[0]-P[0],R=z[1]-P[1],k=Math.hypot(_,R)||1;p.push([R/k,-_/k])}const v=[],h=[],m=[],M=Math.cos((l.sharp??35)*Math.PI/180);for(let S=0;S<u;S++){const P=p[(S-1+u)%u],z=p[S];let _=P[0]+z[0],R=P[1]+z[1];const k=Math.hypot(_,R)||1;_/=k,R/=k,v.push([_,R]),h.push(1/Math.max(.35,_*z[0]+R*z[1])),m.push(P[0]*z[0]+P[1]*z[1]<M)}const x=d.map((S,P)=>(l.cav??0)+(l.cavAt?.[P]??0)),g=d.map((S,P)=>l.edgeAt?.[P]??0),w=Math.SQRT1_2,b=[[[f,a,w,w,.35],[0,a-f,w,w,.35]],[[0,a-f,0,1,.15],[0,-a+f,0,1,.15]],[[0,-a+f,-w,w,.25],[f,-a,-w,w,.25]]];for(let S=0;S<u;S++){const P=(S+1)%u;for(const z of b){const _=z.map(([R,k,y,A,F])=>[S,P].map(T=>{const I=m[T]?p[S]:v[T];return s.v(d[T][0]-v[T][0]*R*h[T],k,d[T][1]-v[T][1]*R*h[T],I[0]*A,y,I[1]*A,x[T]*.55,F*(.6+.6*g[T]))}));s.quad(_[0][0],_[1][0],_[1][1],_[0][1])}}i.push(d.map((S,P)=>[S[0]-v[P][0]*f*h[P],S[1]-v[P][1]*f*h[P]])),c.push(x.map(S=>S*.12))}for(const l of[!0,!1]){const d=i[0].map(m=>new bt(m[0],m[1])),u=i.slice(1).map(m=>m.map(M=>new bt(M[0],M[1]))),f=vi.triangulateShape(d,u),p=s.p.length/3,v=l?a:-a,h=c.flat();i.flat().forEach((m,M)=>s.v(m[0],v,m[1],0,l?1:-1,0,h[M],0));for(const m of f)l?s.tri(p+m[0],p+m[2],p+m[1]):s.tri(p+m[0],p+m[1],p+m[2])}return s.geometry()}function sc(t){const e=t==="low",n=e?3:6,o=e?3:7,s=e?6:16,a=oo/2,r=M0-pa,i=(r*r+a*a)/(2*a),c=a-i,l=[];l.push({x:-oo,h:0,cav:1,edge:0});for(let u=0;u<=n;u++){const f=u/n*Math.PI/2;l.push({x:-a-Lo+Lo*Math.sin(f),h:Lo-Lo*Math.cos(f),cav:.8*(1-u/n),edge:0})}const d=new Set;for(let u=1;u<o;u++)d.add(Lo+(pa-Lo)*u/o);if(!e)for(const u of[-1.5,-.5,.5,1.5])d.add(co+u*$1*.7);[...d].filter(u=>u>Lo+1e-4&&u<pa-1e-4).sort((u,f)=>u-f).forEach(u=>l.push({x:-a,h:u,cav:0,edge:0}));for(let u=0;u<s;u++){const f=u/s*.985,p=f*r,v=Math.max(.004,c+Math.sqrt(Math.max(0,i*i-p*p)));l.push({x:-v,h:pa+p,cav:0,edge:ac(.4,.95,f)})}return l}function Y1(t){const e=sc(t),n=[...e,{x:0,h:M0,cav:0,edge:1},...e.slice(1).reverse().map(d=>({...d,x:-d.x}))];n.pop();const o=[],s=[],a=[],r=[],i=[],c=Array.from({length:7},(d,u)=>-oo/2+oo*u/6),l=[...n.filter(d=>d.x<0&&d.h<co-1e-4),...c.map(d=>({x:d,h:co,cav:.2,edge:0})),...n.filter(d=>d.x>0&&d.h<co-1e-4)];for(let d=0;d<fr;d++)for(const u of d===0?l:n){const f=ho+u.h,p=Po+d*G0+u.x/Go;o.push([Math.cos(p)*f,Math.sin(p)*f]),s.push(u.cav),a.push(u.edge),r.push(d),i.push(u.h)}return{pts:o,cav:s,edge:a,tooth:r,h:i}}function hr(t,e){const n=new C(Math.cos(Po),0,Math.sin(Po)),o=new C(-Math.sin(Po),0,Math.cos(Po)),s=Math.hypot(t.x,t.z),a=Math.atan2(t.z,t.x);if(Math.abs(a-Po)>G0*.5||s-ho<co-.0201)return t;const r=1,i=j1*r,c=-.175*r,l=(d,u)=>{let f=d.dot(n)-(u?ho+co:0),p=d.dot(o),v=d.y-(u?-u0/2:0);const h=Math.cos(i),m=Math.sin(i);[f,v]=[f*h-v*m,f*m+v*h];const M=Math.cos(c),x=Math.sin(c);[f,p]=[f*M-p*x,f*x+p*M],d.copy(n).multiplyScalar(f+(u?ho+co:0)).addScaledVector(o,p),d.y=v+(u?-u0/2:0)};return l(t,!0),e&&l(e,!1),t}function K1(t){const e=Y1(t),n=t==="low",o=[],s=ho-2*M0,a=1.25,r=5,i=.42,c=n?24:64;for(let g=0;g<r;g++){const w=(g+.5)*Math.PI*2/r+.3,b=Math.PI/r-i/s/2,S=Math.PI/r-i/a/2,P=Math.max(4,c>>2),z=[];for(let _=0;_<=c;_++){const R=w-b+2*b*_/c;z.push([Math.cos(R)*s,Math.sin(R)*s])}for(let _=0;_<=P;_++){const R=w+S-2*S*_/P;z.push([Math.cos(R)*a,Math.sin(R)*a])}o.push({pts:z,bevel:ks,cav:.4})}o.push({pts:Array.from({length:40},(g,w)=>[Math.cos(w/40*Math.PI*2)*.32,Math.sin(w/40*Math.PI*2)*.32]),bevel:.015,cav:.5});const l=Jr({pts:e.pts,cavAt:e.cav,edgeAt:e.edge,sharp:40},o,u0,ks);l.computeBoundingSphere();const d=sc(t).filter(g=>g.h>co-.015+1e-4&&g.x>-oo/2-1e-4),u=co-.015,f=[{x:-oo/2,h:u,cav:0,edge:0},...d,{x:0,h:M0,cav:0,edge:1},...d.slice().reverse().map(g=>({...g,x:-g.x})),{x:oo/2,h:u,cav:0,edge:0}],p=f.map(g=>{const w=ho+g.h,b=Po+g.x/Go;return[Math.cos(b)*w,Math.sin(b)*w]}),v=Jr({pts:p,cavAt:f.map(g=>g.cav),edgeAt:f.map(g=>g.edge),sharp:40},[],u0,ks),h=v.getAttribute("position"),m=v.getAttribute("normal"),M=new C,x=new C;for(let g=0;g<h.count;g++)M.set(h.getX(g),h.getY(g),h.getZ(g)),x.set(m.getX(g),m.getY(g),m.getZ(g)),hr(M,x),h.setXYZ(g,M.x,M.y,M.z),m.setXYZ(g,x.x,x.y,x.z);return h.needsUpdate=m.needsUpdate=!0,v.computeBoundingSphere(),{geo:l,piece:v,O:e}}const Us=8,ei=1.6*oo,js=4*u0,X0=.62,ya=.2;function X1(t){const e=t==="low",n=e?3:5,o=e?2:4,s=e?6:14,a=Math.PI*2/Us,r=ei/2,i=.035,c=[],l=[],d=[],u=[],f=(a*X0-ei)/2;u.push({x:-r-f,h:0,c:1,e:0});for(let x=0;x<=n;x++){const g=x/n*Math.PI/2;u.push({x:-r-i+i*Math.sin(g),h:i-i*Math.cos(g),c:.8*(1-x/n),e:0})}for(let x=1;x<o;x++)u.push({x:-r,h:i+(ya-i)*x/o,c:0,e:0});for(let x=0;x<=s;x++){const g=x/s*Math.PI/2;u.push({x:-r*Math.cos(g),h:ya+r*Math.sin(g),c:0,e:ac(.3,1,x/s)})}const p=[...u,...u.slice(0,-1).reverse().map(x=>({...x,x:-x.x}))];p.pop();for(let x=0;x<Us;x++)for(const g of p){const w=X0+g.h,b=Math.PI+x*a+g.x/w;c.push([Math.cos(b)*w,Math.sin(b)*w]),l.push(g.c),d.push(g.e)}const v=xn({pts:c,cavAt:l,edgeAt:d,sharp:40},[],{t:js,bevel:.022,segs:e?1:3}),h=js/2,m=[{r:.001,y:-h-1.2},{r:.22,y:-h-1.2},{r:.22,y:-h-.02},{r:.22,y:h+.02},...Tr(.22,h+.34,.33,h+.4,.025),{r:.33,y:h+.46},...Tr(.33,h+.5,.22,h+.53,.02),{r:.22,y:h+5},{r:.001,y:h+5}],M=kt(m,e?32:72);return{geo:v,arb:M,pts:c}}function Z1(t,e){const n=new C,o=[],s=[];t.pts.forEach((u,f)=>{t.tooth[f]===0&&t.h[f]>Lo&&(n.set(u[0],u0/2,u[1]),hr(n),o.push([n.x-Go,n.z])),t.tooth[f]===1&&t.h[f]>Lo&&s.push([u[0]-Go,u[1]])});const a=e.filter(u=>u[0]<-X0),r=(u,f,p)=>{let v=1e9,h=[0,0],m=[0,0];for(const M of a)for(const x of p){const g=Math.hypot(M[0]+u-x[0],M[1]+f-x[1]);g<v&&(v=g,h=[M[0]+u,M[1]+f],m=x)}return{d:v,a:h,b:m}},i=-.035;let c=X0+ya+oo*1.6+.4,l=r(c,i,o);for(;c>0&&(l=r(c,i,o),!(l.d<.004));c-=.002);const d=r(c,i,s);return{cx:c,cz:i,contact:new C((l.a[0]+l.b[0])/2,0,(l.a[1]+l.b[1])/2),clear:d.d}}const rc=`
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
`,Q1=`
attribute vec3 iA;
attribute vec3 iB;
attribute vec4 iR;
attribute vec4 iS;
${rc}
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
`,J1=`
attribute vec3 iA1;
attribute vec3 iB1;
attribute vec3 iA2;
attribute vec3 iB2;
attribute vec4 iW;
${rc}
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
`,ed=`
varying vec3 vWeb;
varying float vTear;
float loH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float loN2(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(loH(i), loH(i + vec2(1.0, 0.0)), f.x), mix(loH(i + vec2(0.0, 1.0)), loH(i + vec2(1.0, 1.0)), f.x), f.y);
}
`;function td(t,e){const n=[],o=[];for(let a=0;a<2;a++){const r=n.length/3;for(let c=0;c<=t;c++)for(let l=0;l<e;l++)n.push(c/t,l/e*Math.PI*2,a);const i=n.length/3;n.push(1.01,0,a);for(let c=0;c<t;c++)for(let l=0;l<e;l++){const d=r+c*e+l,u=r+c*e+(l+1)%e,f=d+e,p=u+e;o.push(d,u,f,u,p,f)}for(let c=0;c<e;c++){const l=r+t*e+c,d=r+t*e+(c+1)%e;o.push(l,d,i)}}const s=new Sa;return s.setAttribute("position",new rt(n,3)),s.setIndex(o),s}function nd(t,e){const n=[],o=[];for(let a=0;a<=t;a++)for(let r=0;r<=e;r++)n.push(a/t,r/e,0);for(let a=0;a<t;a++)for(let r=0;r<e;r++){const i=a*(e+1)+r,c=i+e+1;o.push(i,c,i+1,i+1,c,c+1)}const s=new Sa;return s.setAttribute("position",new rt(n,3)),s.setIndex(o),s}function ti(t,e,n,o,s,a){const r=t.onBeforeCompile;return t.onBeforeCompile=(i,c)=>{r.call(t,i,c),Object.assign(i.uniforms,e,{uLoPxH:Z0}),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${n}`).replace("#include <beginnormal_vertex>",`${o}
vec3 objectNormal = loN;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = loP;"),a&&(i.fragmentShader=a(i.fragmentShader))},t.customProgramCacheKey=()=>s,t}function od(t){const e=t.q==="low",n={uT:{value:0},uK:{value:0},uPO:{value:new C},uPD:{value:new C(0,0,-1)},uLean:{value:1}},o=new gt,s=td(e?28:64,e?6:10),a=t.strands.length,r=new Float32Array(a*3),i=new Float32Array(a*3),c=new Float32Array(a*4),l=new Float32Array(a*4),d=(x,g)=>{r.set([g.a.x,g.a.y,g.a.z],x*3),i.set([g.b.x,g.b.y,g.b.z],x*3),c.set([g.r,g.sag??g.a.distanceTo(g.b)*.12,g.ph??0,g.rate??1],x*4),l.set([g.nk??.5,g.beads??6,g.seed??0,g.still?1:0],x*4)};t.strands.forEach((x,g)=>d(g,x));const u={iA:new vn(r,3),iB:new vn(i,3),iR:new vn(c,4),iS:new vn(l,4)};for(const[x,g]of Object.entries(u))g.setUsage(zi),s.setAttribute(x,g);s.instanceCount=a;const f=ti(jo({env:t.env??5}),n,Q1,"loStrand();","ss-liveoil-strand"),p=new je(s,f);p.frustumCulled=!1,o.add(p);let v=null;if(t.webs.length){const x=nd(e?18:40,e?8:18),g=t.webs.length,w=new Float32Array(g*3),b=new Float32Array(g*3),S=new Float32Array(g*3),P=new Float32Array(g*3),z=new Float32Array(g*4),_=new Float32Array(g);t.webs.forEach((k,y)=>{w.set(k.a1.toArray(),y*3),b.set(k.b1.toArray(),y*3),S.set(k.a2.toArray(),y*3),P.set(k.b2.toArray(),y*3),z.set([k.sag??.2,k.sagW??.15,k.ph??0,k.rate??1],y*4),_[y]=k.seed??y*7.3}),x.setAttribute("iA1",new vn(w,3)),x.setAttribute("iB1",new vn(b,3)),x.setAttribute("iA2",new vn(S,3)),x.setAttribute("iB2",new vn(P,3)),x.setAttribute("iW",new vn(z,4)),x.setAttribute("iSeed",new vn(_,1)),x.instanceCount=g;const R=jo({env:(t.env??5)*1.6});R.side=vo,ti(R,n,`${J1}
attribute float iSeed;
varying float vSeed;`,`loWeb();
vSeed = iSeed;`,"ss-liveoil-web",k=>k.replace("#include <common>",`#include <common>
${ed}
varying float vSeed;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{
  vec2 q = vWeb.xy * vec2(7.0, 3.2) + vec2(vSeed, vSeed * 1.7);
  float nz = loN2(q) * 0.65 + loN2(q * 2.3 + 4.1) * 0.35;
  float edge = min(vWeb.y, 1.0 - vWeb.y) * 2.0;
  float hold = smoothstep(0.0, 0.16, edge);
  if (nz * (0.55 + 0.6 * edge) < vTear * 0.62 && hold > 0.5) discard;
  if (vTear > 1.25 && edge > 0.05) discard;
}`)),v=new je(x,R),v.frustumCulled=!1,o.add(v)}function h(x,g,w,b=1){n.uT.value=x,n.uK.value=g,n.uPO.value.copy(w.origin),n.uPD.value.copy(w.direction),n.uLean.value=b}function m(x,g){d(x,g)}function M(){for(const x of Object.values(u))x.needsUpdate=!0}return{group:o,strands:p,webs:v,uniforms:n,update:h,moveStrand:m,commit:M,material:f}}function ad(t){const e=[],n=t>2?28:14;e.push(new bt(0,-.05)),e.push(new bt(1.18,-.02));for(let s=0;s<=n;s++){const a=s/n*Math.PI/2;e.push(new bt(Math.cos(a)*1,.12+Math.sin(a)*.85))}const o=new ki(e.map(s=>new bt(Math.max(s.x,.001),s.y)),t>2?72:22);return o.computeVertexNormals(),o}const Vt=(t=0,e=0,n=0)=>new C(t,e,n),_o=Te.findIndex(t=>t.id==="4"),sd=[[0,1],[.9,1],[2.4,1],[3.3,.6],[3.9,1]];function rd(){const t={uGlow:{value:0}},e=new Pn({color:328708,side:vo,vertexColors:!0});return e.onBeforeCompile=n=>{n.uniforms.uGlow=t.uGlow,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGlow;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + uGlow;`)},{m:e,u:t}}function ni(t,e,n){const o=[],s=[];t.forEach((r,i)=>{const c=t[Math.min(t.length-1,i+1)].clone().sub(t[Math.max(0,i-1)]).normalize(),l=c.cross(n).normalize(),d=e*.5*(i===0||i===t.length-1?.35:1);o.push(r.x+l.x*d,r.y+l.y*d,r.z+l.z*d,r.x-l.x*d,r.y-l.y*d,r.z-l.z*d),i&&s.push(2*i-2,2*i-1,2*i,2*i-1,2*i+1,2*i)});const a=new In;return a.setAttribute("position",new rt(o,3)),a.setIndex(s),a}const oi=(t,e,n)=>{const o=vt((n-t)/(e-t));return o*o*(3-2*o)},Mo=t=>[],ic=typeof location<"u"?new URLSearchParams(location.search):null,cc=ic?.get("form4d")==="1",T0=ic?.get("form4")==="1"||cc;function id(t){const{kit:e}=t,n=e.q,o=n==="low",s=new gt,a=new gt,r=new gt;s.add(a),a.add(r),r.position.copy(Yc),r.rotation.y=Math.atan2(-Pr.z,Pr.x);const i=et(404),c=T0?new y0({color:8026746,roughness:.5,metalness:0}):null;if(T0){const me=Te[_o],Qe=(Ae,st,tt)=>(r.updateMatrixWorld(),Vt(Ae,st,tt).applyMatrix4(r.matrixWorld).toArray());me.light.haze=0,me.light.red.power=0,me.light.blade.from=Qe(-6,10,9),me.light.blade.to=Qe(0,0,0),me.light.blade.angle=.6,me.light.blade.pen=0,me.light.blade.power=15,me.sharp=[.02,50]}const l=(me,Qe)=>{const Ae=new je(me,c??an({tier:n,...Qe}));return Ae.castShadow=!o,Ae.receiveShadow=!o,Ae},d={value:new ln(0,1,0,0)},u={value:new ln(0,1,0,0)},f={value:new ln(0,1,0,0)},p=Vt(),v=Vt(...Te[_o].light.blade.from).sub(Vt(...Te[_o].light.blade.to)).normalize(),h=K1(n),m={finish:"turned",seed:41,age:0,wear:.08,tone:.8,direct:.3,objScale:2,envMap:.07,turn:[2.2,.005,.25],line:[0,0],lineU:{value:new bt(1.6,ho+.25)},rim:d},M=l(h.geo,m),x=l(h.piece,{...m,turn:[2.2,.005,.06],seed:Mo()[8]??45,wear:0,direct:Mo()[6]??.55,tone:Mo()[7]??.9}),g=new gt;g.position.set(-Go,0,0),g.add(M,x),r.add(g);const w=new gt;g.add(w);const b=(me,Qe,Ae)=>{const st=ho+Qe,tt=Po+me/Go;return Vt(Math.cos(tt)*st,Ae,Math.sin(tt)*st)},S=(me,Qe,Ae,st=0)=>{const tt=ho+Qe,Ee=Po+st*G0+me/Go,Tt=Vt(Math.cos(Ee)*tt,Ae,Math.sin(Ee)*tt);return st===0?hr(Tt):Tt},P=X1(n),z=Z1(h.O,P.pts),_=.12,R=l(P.geo,{finish:"turned",seed:42,age:0,wear:0,bump:Mo()[0]??.15,tone:.6,direct:.4,envMap:1.8,rim:u,objScale:2,turn:[2.2,.005,.25],line:[.8,0]}),k=l(P.arb,{finish:"polished",seed:43,age:.2,wear:.3,tone:.3,direct:.3,envMap:.6}),y=new gt;y.position.set(z.cx,u0/2+.02-js/2-_,z.cz),y.add(R,k),r.add(y),z.contact.clone().add(Vt(Go,0,0));const A=Mo(),F=new Map;pr(()=>{const me=[...F],Qe=new Map;F.clear();for(const[Ae,st]of me)Qe.set(Ae,T(st.list)),st.rt.dispose();o1(t.scene,Qe)});const T=me=>{const Qe=new za;Qe.background=new Gt(0);const Ae=Vt(...Te[_o].pose.pos).sub(Vt(...Te[_o].pose.look));Ae.y=0,Ae.normalize();for(const[Ee,Tt,$t,Qt,Nt]of me){const Yt=fa.degToRad(Ee),Un=Vt(Ae.x*Math.cos(Yt)-Ae.z*Math.sin(Yt),0,Ae.x*Math.sin(Yt)+Ae.z*Math.cos(Yt)),Cn=new je(new no(Tt,$t),new Pn({color:new Gt(.62,.62,.6).multiplyScalar(Nt),side:vo}));Cn.position.copy(Un).multiplyScalar(6).setY(Qt),Cn.lookAt(0,0,0),Qe.add(Cn)}const st=new Mi(t.renderer),tt=st.fromScene(Qe,.01);return st.dispose(),F.set(tt.texture,{list:me,rt:tt}),tt.texture},I=Mo(),Q=T([[A[0]??-35,A[1]??.6,A[7]??7,A[6]??-4,A[2]??6],[I[0]??180,I[1]??8,I[2]??.8,I[3]??2.8,I[4]??.03]]),X=Mo(),E=T([[X[0]??-15,X[1]??24,X[2]??8,X[3]??-3.5,X[4]??1]]),N=(me,Qe,Ae)=>{const st=me.onBeforeCompile,tt=me.customProgramCacheKey.bind(me);me.onBeforeCompile=(Ee,Tt)=>{st.call(me,Ee,Tt),Ee.fragmentShader=Ee.fragmentShader.replace("roughnessFactor = clamp(ssRough, 0.04, 1.0);",`roughnessFactor = clamp(ssRough * ${Qe.toFixed(3)}, 0.02, 1.0);`)},me.customProgramCacheKey=()=>tt()+Ae};if(!T0){const me=R.material;N(me,A[5]??.4,"-b4"),me.envMap=Q,me.envMapIntensity=A[3]??5;const Qe=k.material;Qe.envMap=Q,Qe.envMapIntensity=A[4]??.25;const Ae=x.material;Ae.envMap=E,Ae.envMapIntensity=X[5]??.6}const $=u0/2,q=Vt(0,1,0),D=oo/2,V=me=>{let Qe=co-.015,Ae=co+.2;for(let st=0;st<30;st++){const tt=(Qe+Ae)/2;S(me,tt,$).y<$?Qe=tt:Ae=tt}return Ae},O=V(0),j=Array.from({length:22},(me,Qe)=>{const Ae=-D+.004+(oo-.008)*Qe/21;return S(Ae,V(Ae)+.002,$+8e-4)}),ae=new je(ni(j,.0022,q),new Pn({color:new Gt(1.6,1.57,1.5),side:vo}));w.add(ae);const ye=rd(),_e=[];for(let me=0;me<5;me++){const Qe=[.04,-.01,.015,-.05,-.075][me],Ae=[.04,.03,.046,.026,.034][me],st=[.008,-.01,.004,-.006,.01][me],tt=[],Ee=[];for(let Qt=0;Qt<14;Qt++){const Nt=Qt/13,Yt=Qe+st*Nt+Math.sin(Nt*7+me*2)*.0015+(i()-.5)*8e-4,Un=S(Yt,V(Yt),$),Cn=Math.hypot(Un.x,Un.z)-ho;tt.push(b(Yt,Cn-.0015-Ae*Nt,$+9e-4)),Ee.push(1-Nt*.85)}const Tt=ni(tt,.0016,q);Tt.setAttribute("color",new rt(Ee.flatMap(Qt=>[Qt,Qt,Qt,Qt,Qt,Qt]),3));const $t=new je(Tt,ye.m);$t.visible=!1,$t.renderOrder=2,w.add($t),_e.push($t)}const L=o?4:6,J=(()=>{const me=et(9),Qe=[];for(let Ae=0;Ae<7;Ae++){const st=Ae/7*Math.PI*2,tt=.55+me()*.6;Qe.push([Math.cos(st)*.018*tt,Math.sin(st)*.011*tt])}return xn({pts:Qe},[],{t:.0016,bevel:5e-4,segs:1})})(),ue=new gn(J,an({tier:n,finish:"polished",seed:47,tone:.1,age:0,direct:.6,wear:0,envMap:.25,rim:f}),L),ve=[];{S(D+.01,co+.08,0).sub(S(D,co+.08,0)).normalize();for(let me=0;me<L;me++){const Qe=me===L-1,Ae=O+.008+me/L*.1+i()*.008,st=.006+i()*.03,tt=S(D-st,Ae,$+.0012).add(Vt(0,Qe?.03:i()*.003,0)),Ee=S(D-st,Ae,$+.01).sub(S(D-st,Ae,$)).normalize(),Tt=new Wt().setFromUnitVectors(Vt(0,1,0),Ee).multiply(new Wt().setFromEuler(new Nn(.3+i()*.5+(Qe?.9:0),i()*6.3,(i()-.5)*.3,"YXZ")));ve.push({p:tt,r:Tt,s:.9+i()*.6,loose:Qe})}}w.add(ue);const pe=new je(ad(o?2:3),jo({env:1.4})),fe=Mo(),Le=fe[0]??.3,Fe=$-_+(fe[2]??.01);pe.position.copy(S(D+(fe[1]??.01),Le,Fe));const De=S(D,Le+.05,Fe).sub(S(D,Le-.05,Fe)).normalize();pe.scale.set(fe[3]??.04,fe[4]??.026,fe[5]??.028),pe.rotation.set(0,-Math.atan2(De.z,De.x)+(fe[6]??Math.PI/2),Math.PI/2);const Ue=pe.scale.clone(),Se=new je(new Si(new ba(Array.from({length:9},(me,Qe)=>{const Ae=-.72+1.44*Qe/8,st=Mo()[0]??-.4;return Vt(Ae,Math.sqrt(Math.max(0,1-Ae*Ae-st*st))*1.02,st)})),16,Mo()[1]??.06,4),new Pn({color:new Gt(.62,.61,.58)}));pe.add(Se),w.add(pe);const He=[{a:S(D+.02,Le-.03,Fe+.012),b:S(D+.1,Le-.13,$-_+.001),r:.0032,sag:.02,ph:.15,rate:1,nk:.5,beads:3,seed:1},{a:S(D+.012,Le+.03,Fe+.014),b:S(D+.001,Le+.13,$-.03),r:.0022,sag:.015,ph:.3,rate:1,nk:.5,beads:4,seed:2}],ot=od({strands:He,webs:[],q:n,env:1.2});w.add(ot.group),T0&&!cc&&(w.visible=!1);const ke=o?30:70,be=new gn(new ns(.004,0),an({tier:n,finish:"blackened",seed:48,tone:.3,age:.5,direct:.6}),ke);be.frustumCulled=!1,a.add(be);const Z=Array.from({length:ke},()=>[(i()-.5)*.5,.25+i()*.5,(i()-.5)*.5,.5+i()]),G=o?14:30,K=new gn(new ns(1,1),an({tier:n,finish:"blackened",seed:49,tone:.6,age:.4,direct:1}),G);K.frustumCulled=!1,s.add(K);const oe=Array.from({length:G},()=>[(i()-.5)*2.2,i()*1.2,1+i()*2.5,.0015+i()*i()*.006,.6+i()*.8]),de={uGain:{value:.2},uAng:{value:-.75}},Ce=new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:de,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uAng; varying vec2 vUv;
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
}`}),We=new je(new no(5.5,3.6),Ce);We.position.set(.2,.1,-5),We.renderOrder=4,We.frustumCulled=!1,r.add(We);const Je={uGain:{value:0},uT:{value:0}},U=new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:Je,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv * vec2(1.6, 1.0) + vec2(uT * 0.05, 0.0);
  float n = 0.5 * vn(q * 2.1) + 0.3 * vn(q * 4.7 + 3.1) + 0.2 * vn(q * 9.3 + 7.7);
  vec2 bq = (vUv - vec2(0.15, 0.35)) * vec2(1.0, 1.5); float body = exp(-dot(bq, bq));
  float e = body * smoothstep(0.32, 0.8, n);
  gl_FragColor = vec4(vec3(0.62, 0.035, 0.02) * e * uGain, 0.0);
}`}),he=new je(new no(1,1),U);he.renderOrder=4,he.frustumCulled=!1,he.visible=!1,s.add(he);const Me={uGain:{value:0},uC:{value:new bt(.18,-.12)}},ge=new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:Me,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform vec2 uC; varying vec2 vUv;
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
}`}),Pe=new je(new no(1,1),ge);Pe.renderOrder=4,Pe.frustumCulled=!1,Pe.visible=!1,s.add(Pe);const B=Mo(),ne=new Wt,te=Vt(),ze=Vt(),xe=[];for(let me=-6;me<=6;me++){xe.push({w:0,p:Vt(Math.cos(Po+me*G0)*(ho+M0-.05),$,Math.sin(Po+me*G0)*(ho+M0-.05))});const Qe=Math.PI+me*Math.PI*2/Us;xe.push({w:1,p:Vt(Math.cos(Qe)*(X0+ya),0,Math.sin(Qe)*(X0+ya))})}T0&&(We.visible=!1,be.visible=!1);const we=new se,ce=new Wt,Ve=new Wt,Ze=new Nn,Ke=Vt(),ut=new tr,Ye=Vt(),xt=Vt(),Pt=Vt(),Rn=Vt(),dn=Vt(),sn=g.rotation.y,wn=y.rotation.y;return{group:s,update(me){if(s.visible=me.i>=_o-1&&me.i<=_o+1,!s.visible)return;const Qe=me.trick("4"),Ae=Qe.k;me.camera.getWorldPosition(Ke),Ye.set(me.state.pointer.x*2-1,1-me.state.pointer.y*2,.5).unproject(me.camera),ut.origin.copy(Ke),ut.direction.copy(Ye).sub(Ke).normalize();const st=Qe.phase*8;let tt=0,Ee=0,Tt=9;if(Ae>0)for(const[it,W]of sd)st>=it&&(tt++,Tt=st-it,Ee=W*Math.exp(-Tt*7));const $t=Qe.rare,Qt=$t>=0&&$t<.55,Nt=$t>=.55?Math.exp(-($t-.55)*4*9):0,Yt=$t>=.55?($t-.55)*4:9;Qt&&(Ee=0);const Un=Ae>0?Math.min(5,tt+($t>=.55?1:0)):0;_e.forEach((it,W)=>it.visible=W<Un),ae.visible=Un===0,ye.u.uGlow.value=Ae*(.55+.45*Ee),ye.m.color.setRGB(.02+.98*Ae*(.7+.3*Ee),.02*(1-Ae)+.012*Ae,.02*(1-Ae)+.01*Ae);let Cn=xe[0],Ko=1e9;for(const it of xe){xt.copy(it.p).applyMatrix4((it.w?R:M).matrixWorld);const W=ut.distanceSqToPoint(xt);W<Ko&&(Ko=W,Cn=it)}const d0=Ee*Ae*(Cn.w===0?1:.5)*.0022,lo=Ee*Ae*(Cn.w===1?1:.5)*.0022;g.rotation.y=sn+d0*Math.sin(Tt*70),y.rotation.y=wn-lo*1.27*Math.sin(Tt*70+.6),xt.copy(Cn.p).applyMatrix4((Cn.w?R:M).matrixWorld);for(let it=0;it<ke;it++){const W=Ae>0&&Tt<1.4&&!Qt,ee=Tt*Z[it][3];if(!W){we.makeScale(0,0,0),be.setMatrixAt(it,we);continue}const le=xt.clone().add(Vt(Z[it][0]*ee,Z[it][1]*ee-1.6*ee*ee,Z[it][2]*ee)).sub(a.position);we.compose(le,ce.setFromEuler(Ze.set(it,it*2,ee*9)),Vt(1,1,1).multiplyScalar(.6+.8*(it*7%5)/5)),be.setMatrixAt(it,we)}be.instanceMatrix.needsUpdate=!0,ve.forEach((it,W)=>{const ee=it.loose?Ee*Ae*.03:Ee*Ae*.004;we.compose(it.p.clone().add(Vt(0,ee,0)),ce.copy(it.r).multiply(Ve.setFromAxisAngle(Vt(1,0,0),ee*20)),Vt(it.s,it.s,it.s)),ue.setMatrixAt(W,we)}),ue.instanceMatrix.needsUpdate=!0,pe.scale.set(Ue.x*(1+Ee*Ae*.2),Ue.y*(1-Ee*Ae*.12),Ue.z*(1+Ee*Ae*.06)),ot.update(Qe.phase,Ae*.6,ut,.5),p.copy(v).transformDirection(me.camera.matrixWorldInverse),d.value.set(p.x,p.y,p.z,.5),u.value.set(p.x,p.y,p.z,0),f.value.set(p.x,p.y,p.z,2.5);{const it=me.i===_o&&!me.inHold,W=it?Math.sin(Math.PI*vt(me.u/.9)):0;if(he.visible=W>.01,he.visible){me.camera.getWorldQuaternion(ne),te.set(0,0,-1).applyQuaternion(ne);const ee=22,le=2*ee*Math.tan(fa.degToRad(me.camera.fov)/2)*1.15;he.position.copy(Ke).addScaledVector(te,ee),he.quaternion.copy(ne),he.scale.set(le*me.camera.aspect,le,1),Je.uGain.value=.55*W/Math.sqrt(Fi(me.i,me.u,me.inHold))}}{const it=me.i===_o?me.inHold?1:oi(.55,1,me.u):me.i===_o+1&&!me.inHold?1-oi(0,.35,me.u):0;if(Pe.visible=it>.01&&!T0,Pe.visible){me.camera.getWorldQuaternion(ne),te.set(0,0,-1).applyQuaternion(ne),y.getWorldPosition(ze);const W=Ke.distanceTo(ze)+(B[0]??3),ee=2*W*Math.tan(fa.degToRad(me.camera.fov)/2)*1.1;Pe.position.copy(Ke).addScaledVector(te,W),Pe.quaternion.copy(ne),Pe.scale.set(ee*me.camera.aspect,ee,1),Me.uGain.value=(B[1]??.72)*it*(1+.25*Ae);const le=me.camera.aspect<1;Me.uC.value.set(B[2]??(le?.5:.15),B[3]??(le?-.25:-.05))}}if(We.lookAt(Ke),de.uGain.value=(me.camera.aspect<1?B[4]??.33:.58)*(1+.1*Ae),a.position.set(0,0,0),Nt>.001){const it=Nt*.025;a.position.set(Math.sin(Yt*61)*it,Math.sin(Yt*47+1)*it*.7,Math.sin(Yt*53+2)*it*.5)}if(K.visible=$t>=.55,K.visible){Pt.set(0,0,-1).transformDirection(me.camera.matrixWorld),Rn.set(1,0,0).transformDirection(me.camera.matrixWorld),dn.set(0,1,0).transformDirection(me.camera.matrixWorld);for(let it=0;it<G;it++){const[W,ee,le,Ne,Ie]=oe[it],pt=1.2+ee*.5-Yt*Ie*1.8,qe=Ke.clone().addScaledVector(Pt,le).addScaledVector(Rn,W*le*.18).addScaledVector(dn,pt*le*.102);we.compose(qe,ce.setFromEuler(Ze.set(it,Yt*3,it*3)),Vt(Ne,Ne*.6,Ne)),K.setMatrixAt(it,we)}K.instanceMatrix.needsUpdate=!0}}}}const lc=16,cd=`uniform float uFill;
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
varying vec3 vON;`,ld=`
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
totalEmissiveRadiance += glowC * uGain;`;function ud(t,e,n,o,s=61){const a=n.clone().normalize(),r=e.clone().addScaledVector(a,-e.dot(a)).normalize(),i=new C().crossVectors(a,r).normalize(),c=et(s),l=[],d=[new bt(0,0)],u=7;for(let p=1;p<=u;p++)d.push(new bt(o*p/u,(c()-.5)*o*.09+(p>2?-o*.025*(p-2):0)));for(let p=0;p<u;p++)l.push({a:d[p],b:d[p+1],t0:p/u*.92,t1:(p+1)/u*.92});const f=[1,2,3,5];for(const[p,v]of f.entries()){const h=d[v],m=p%2?1:-1,M=m*(.5+c()*.35),x=o*(.08+c()*.1),g=new bt(Math.cos(M),Math.sin(M)),w=h.clone().addScaledVector(g,x),b=M+m*(c()-.3)*.6,S=w.clone().addScaledVector(new bt(Math.cos(b),Math.sin(b)),x*.7),P=v/u*.92+.03,z=P+.12;l.push({a:h,b:w,t0:P,t1:z},{a:w,b:S,t0:z,t1:z+.1})}return{len:o,p:t.clone(),n:a,e1:r,e2:i,segs:l.slice(0,lc)}}function uc(t){const e=Yo(),n=new Gn({color:new Gt().setRGB(6e-4,0,3e-5),metalness:0,roughness:.03,ior:1.76,envMapIntensity:t.env??2.5,specularIntensity:1}),o=Array.from({length:lc},()=>new ln),s={uCamO:{value:new C},uCrW:{value:new bt(t.crack.len*.006,34/t.crack.len)},uFill:{value:t.fill??0},uHalf:{value:t.half.clone()},uCtr:{value:(t.centre??new C).clone()},uCrackP:{value:t.crack.p},uCrackN:{value:t.crack.n},uE1:{value:t.crack.e1},uE2:{value:t.crack.e2},uSeg:{value:o},uSegN:{value:0},uNode:{value:t.node.clone()},uPx:{value:.002},uGlow:{value:t.glow??1},uLit:{value:t.lit??1},uNodeK:{value:t.nodeK??1},uHeat:{value:0},uChipN:{value:t.chipN.clone().normalize()},uBody:{value:t.body??.05},uKey:{value:new C(0,1,0)},uSheen:{value:t.sheen??0},uBev:{value:t.bevel??0},uGain:{value:t.gain??1},uBevC:{value:new Gt(.86,.88,.92)},uBl:{value:new C(0,1,0)},uSheet:{value:t.sheet??0},uSheetW:{value:t.crack.len*.05},tNz:{value:e.noise}};n.onBeforeCompile=u=>{Object.assign(u.uniforms,s),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP;
varying vec3 vON;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position;
vON = normal;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
${cd}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.42, smoothstep(0.985, 0.998, dot(normalize(vON), uChipN)));`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${ld}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(core * uNodeK * 1.5 + halo * uNodeK * 0.12 + lines * uLit * uGlow * 0.4, 0.0, 1.0);`),Co(u)},n.customProgramCacheKey=()=>"ss-stone";const a=new se,r=new C,i=new C,c=new C,l=(u,f)=>{u.updateMatrixWorld(),a.copy(u.matrixWorld).invert(),i.setFromMatrixPosition(f.matrixWorld),s.uCamO.value.copy(i).applyMatrix4(a),r.copy(s.uNode.value).applyMatrix4(u.matrixWorld);const p=f,v=r.distanceTo(i);c.setFromMatrixScale(u.matrixWorld);const h=2*v*Math.tan(fa.degToRad((p.fov??30)/2))/Math.max(1,Z0.value);s.uPx.value=h/Math.max(1e-6,Math.abs(c.x)),t.face&&s.uKey.value.copy(s.uCtr.value).sub(s.uCamO.value).normalize().reflect(t.face).add(t.tilt??new C).normalize()},d=u=>{let f=0;for(const p of t.crack.segs){const v=Math.min(1,Math.max(0,(u-p.t0)/(p.t1-p.t0)));if(v<=0)continue;const h=p.a.clone().lerp(p.b,v);o[f++].set(p.a.x,p.a.y,h.x,h.y)}s.uSegN.value=f};return d(0),Object.assign(n,{ss:s,aim:l,crack:d})}const on={ready:!1,fork:new se,stone:new se,stoneWorld:new C,escRot:0,stoneGeo:null,side:-1};function dc(t,e=-1){t.computeBoundingBox();const n=t.boundingBox,o=n.getSize(new C).multiplyScalar(.5),s=n.getCenter(new C),a=o.x*2,r=o.y,i=o.z,c=new C(s.x+a/2-.012,s.y-r*.3,s.z+e*(i-.01)),l=ud(c,new C(-1,-.25,-e*.1),new C(.12,.5,-e*.86),a*.78),d=ir({L:a,w:i,h:r*2,side:e}).chip.n.clone();return{half:o,centre:s,node:c,crack:l,chipN:d}}function dd(t,e,n){t.computeBoundingBox();const o=t.boundingBox,s=o.getCenter(new C),a=o.getSize(new C).multiplyScalar(.5),r=i=>new C(s.x+a.x,s.y,s.z+i*a.z).applyMatrix4(e).distanceTo(n);return r(1)<r(-1)?1:-1}const nn=L0+.02,ua={glow:1,lit:.6,node:4,body:.05,crack:.12},pd=2,fd=.7,hd=.65,md=.1,vd=.1,gd=.12,xd=.12,wd=10,yd=6,bd=4,Ps=[.865,1.056,1.9],Md=1.4,Sd=.012,zd=4.2,ai=[20,10],Ct=(t,e,n)=>new C(t,e,n),Qo=Math.PI*2,si=12.6,h0=4.8,ri=-38.5,F0=[{x:-2.7,z:-3.5,r:.9,kind:"pillar"},{x:-2.3,z:-8.6,r:.62,kind:"arbor"},{x:-1.6,z:-13.9,r:.85,kind:"pillar",h:11.4},{x:-.6,z:-19.2,r:.8,kind:"pillar",h:12.2},{x:-.2,z:-24.8,r:.6,kind:"arbor",h:13.4},{x:.7,z:-30.1,r:.78,kind:"pillar"},{x:1.2,z:-35.4,r:.55,kind:"arbor",h:11.8},{x:12.3,z:-1.2,r:.72,kind:"arbor"},{x:12,z:-6.7,r:.95,kind:"pillar"},{x:11.4,z:-12.3,r:.66,kind:"arbor",h:13.6},{x:10.7,z:-17.6,r:.9,kind:"pillar",h:11.2},{x:10,z:-23.3,r:.62,kind:"arbor"},{x:9.2,z:-28.6,r:.8,kind:"pillar",h:5.6,snapped:!0},{x:8.6,z:-33.9,r:.58,kind:"arbor"},{x:1.75,z:-4.6,r:.42,kind:"arbor"},{x:-1.4,z:-7.6,r:.5,kind:"arbor"}],ii=[{c:2,y:6.3,r:2.3,n:64,rx:.55,rz:-.3,fold:.9,sheared:3,dx:2.4,dz:.4},{c:3,y:7.3,r:2.6,n:84,rx:.42,rz:.2,dx:1.6},{c:4,y:7.2,r:3.8,n:110,rx:.3,rz:-.12,dx:1.6},{c:5,y:8.4,r:3,n:80,rx:-.36,rz:.18,dx:.6},{c:9,y:7.4,r:3.2,n:96,rx:.38,rz:.16,dx:-2},{c:10,y:8.2,r:2.9,n:72,rx:-.4,rz:-.22,dx:-.6},{c:11,y:8.8,r:3.4,n:90,rx:.34,rz:.1,dx:-.8},{c:12,y:7.8,r:2.6,n:66,rx:.44,rz:.25,dx:-.4},{c:7,y:4.15,r:1.9,n:64,rx:.42,rz:.32,dx:-5.5,dz:-6.8},{c:15,y:3,r:1.6,n:64,rx:.5,rz:-.22},{c:1,y:11.4,r:3,n:88,rx:.3,rz:.16,dx:2.4},{c:9,y:12.2,r:3.3,n:92,rx:-.3,rz:-.18,dx:-2.4}];function kd(t){const{kit:e}=t,n=e.q,o=z0(n),s=new gt,a=et(55),[r,i,c]=N0,l={value:new ln(0,1,0,0)},d={value:new ln(0,1,0,0)},u=(U,he,Me,ge=!0)=>{const Pe=an({tier:n,...he}),B=new je(U,Pe);return Me&&B.applyMatrix4(Me),B.castShadow=ge&&n!=="low",B.receiveShadow=n!=="low",B.castShadow,B},f=(U,he,Me={},ge=!1,Pe=1)=>{for(const B of U.inst){if(!B.mats.length)continue;const ne=an({finish:B.finish,seed:B.seed,tier:n,...Me}),te=new gn(B.geo,ne,B.mats.length);B.mats.forEach((ze,xe)=>te.setMatrixAt(xe,Pe===1?ze:ze.clone().multiply(new se().makeScale(Pe,Pe,Pe)))),te.instanceMatrix.needsUpdate=!0,te.computeBoundingSphere(),te.castShadow=ge&&n!=="low",te.receiveShadow=n!=="low",he.add(te)}},p=Yo(),v=new no(90,90,1,1);v.rotateX(-Math.PI/2);const h=new un({uniforms:{tDiffuse:{value:null},textureMatrix:{value:new se},tNz:{value:p.noise},uHas:{value:n==="low"?0:1},uTexel:{value:new bt(1/1024,1/1024)},uNearF:{value:0},uCamP:{value:new C},uGain:{value:2.6},uRuby:{value:new C},uStreak:{value:0},tDepth:{value:null},uPI:{value:new se},uVW:{value:new se},uOil:{value:nn},uHR:{value:new bt(5,.8)}},vertexShader:`
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
}`});let m,M=new y0;const x={value:new bt};let g=null;if(n!=="low"){g=new S0(v,{textureWidth:n==="high"?1792:1024,textureHeight:n==="high"?896:512,clipBias:.003,multisample:0});const U=g.material;h.uniforms.tDiffuse.value=g.getRenderTarget().texture,g.getRenderTarget().depthTexture=new wi(g.getRenderTarget().width,g.getRenderTarget().height),h.uniforms.tDepth.value=g.getRenderTarget().depthTexture;const he=g.onBeforeRender,Me=g.camera;g.onBeforeRender=(...ge)=>{const Pe=ge[1],B=Pe.environmentIntensity;Pe.environmentIntensity=xd,M.envMap=Pe.environment;const ne=x.value.x;x.value.x=0,he.apply(g,ge),x.value.x=ne,Pe.environmentIntensity=B,h.uniforms.uPI.value.copy(Me.projectionMatrix).invert(),h.uniforms.uVW.value.copy(Me.matrixWorld)},h.uniforms.textureMatrix=U.uniforms.textureMatrix,g.material=h,m=g}else m=new je(v,h);m.position.set(r,nn,c-8),s.add(m);const w=new gt;s.add(w);const b=[],S=[];F0.forEach((U,he)=>{const Me=U.h??si*(.94+a()*.12);if(S.push(nn+Me),U.kind==="pillar"){const ge=Ni({h:Me,r:U.r,detail:o});w.add(u(ge,{finish:"turned",seed:100+he,age:.55,tone:.42,rim:l},new se().makeTranslation(U.x,nn-.25,U.z)));const Pe=kt([{r:U.r*1.9,y:0},{r:U.r*1.35,y:.02,smooth:!0},{r:U.r*1.08,y:.09,smooth:!0},{r:U.r*1,y:.2,smooth:!0},{r:U.r*.99,y:.2}],o?40:16);Pe.translate(U.x,nn,U.z),b.push(Pe)}else{const ge=U.r*.42,Pe=ha({length:Me,ra:ge,leaves:8+he%5,pinionR:U.r*1.25,pinionH:Me*.14,pinionAt:Me*(.16+a()*.1),seatAt:Me*.55,detail:o,seed:200+he});w.add(u(Pe.geo,{finish:"turned",seed:200+he,age:.5,tone:.42,rim:l},new se().makeTranslation(U.x,nn-.02,U.z)));const B=kt([{r:ge*3.4,y:0},{r:ge*2.2,y:.015,smooth:!0},{r:ge*1.35,y:.06,smooth:!0},{r:ge*1.02,y:.16,smooth:!0},{r:ge,y:.16}],o?32:12);B.translate(U.x,nn,U.z),b.push(B);const ne=La({R:ge*2.6,rIn:ge*.26,phase:a(),detail:o});ne.translate(U.x,nn,U.z),b.push(ne)}if(U.snapped){const ge=ha({length:si*.55,ra:U.r*.42,leaves:10,pinionR:U.r*1.25,pinionH:1.4,pinionAt:1.2,seatAt:4.5,detail:o,seed:290}),Pe=new se().compose(Ct(U.x+1.2,nn+.2,U.z-.6),new Wt().setFromEuler(new Nn(-.25,.2,-.62)),Ct(1,1,1));w.add(u(ge.geo,{finish:"turned",seed:291,age:.75,tone:.42,rim:l},Pe))}});const P=new gt;s.add(P);const z=[];ii.forEach((U,he)=>{const Me=F0[U.c],ge=$o({teeth:U.n,r:U.r,profile:"train",spokes:5,rim:.08,hub:.14,hole:Me.r*.44,detail:o,seed:300+he,sheared:U.sheared??(he%3===0?1:0),fold:U.fold,foldAt:U.fold?.5:void 0,snapped:he===3}),Pe=u(ge,{finish:"sunray",seed:300+he,age:.66,tone:he===0?.3:.45,direct:he===0?gd:1,rim:he===0?d:l});Pe.position.set(Me.x+(U.dx??0),nn+U.y,Me.z+(U.dz??0)),Pe.rotation.set(U.rx,a()*Qo,U.rz,"XZY"),P.add(Pe),z.push({mesh:Pe,n:U.n,base:Pe.rotation.y})});const _=new gt;s.add(_);const R=[[h0+.4,7.7,-5.6,.1,1.05],[h0-.3,6.4,-17.4,.06,.86],[h0+.5,7.6,-22.8,-.09,.78],[h0-.4,6.9,-28.2,.12,.7],[h0+.2,8.1,-33.4,-.05,.6]];{const U=[],he=[];let Me=null;R.forEach(([ge,Pe,B,ne,te],ze)=>{const xe=sr({length:14,width:2.6,t:.7,detail:o,seed:40+ze}),we=new se().compose(Ct(ge,nn+Pe,B),new Wt().setFromEuler(new Nn(Math.PI,ne,0)),Ct(te,te,te));U.push(xe.pieces[0].geo.clone().applyMatrix4(we)),xe.inst.forEach((ce,Ve)=>{Me??=ce.geo,(he[Ve]??=[]).push(...ce.mats.map(Ze=>we.clone().multiply(Ze)))})}),_.add(u(_t(U),{finish:"blackened",seed:40,age:.6,tone:.4,wear:.3,rim:l})),Me&&f({inst:[{geo:Me,finish:"blackened",seed:44,mats:he.flat()}]},_,{age:.4,tone:.5})}{const Me=[[-11,0],[11,0],[11,16],[-11,16]],ge=[[-6.5,4.2,.9],[-2,9.5,.5],[3.6,6.2,1.2],[7.4,11,.6],[.8,2.6,.35],[-8.2,12.5,.7]].map(([ne,te,ze])=>({at:[ne,te],r:ze,sink:ze*.5})),B=mo({outline:Me,holes:ge,t:1.2,bevel:.12,detail:o,round:0}).geo.clone();B.rotateX(-Math.PI/2),_.add(u(B,{finish:"grained",seed:48,age:.7,tone:.35,wear:.5},new se().makeTranslation(h0,nn-.3,ri)))}const k=Ua,y={value:0},A=new gt;A.position.set(r,i,c),s.add(A);const F=k*.5,T=_l({R:k,screws:16,detail:o,seed:21,staffL:1.5,springR:F}),I=u(T.pieces[0].geo,{finish:"polished",seed:21,age:fd,tone:.95,direct:hd,objScale:pd,line:[8,k*.955],lineU:(x.value.set(8,k*.955),x)});M=I.material,A.add(I),f({inst:T.inst},A,{age:.2,tone:1.05},!0);const Q=cr({rOut:F,turns:13,detail:o}),X=u(Q.geo,{finish:"blackened",seed:22,twist:y,twistR:F,age:.25,tone:.7});X.position.set(r,i+.14,c),s.add(X);const E=i+.95,N=.42,$=1.38,q=Fl({balanceR:k,h:E-nn,t:.3,table:.32,detail:o,seed:6}),D=new gt;D.position.set(r,E,c),D.rotation.y=-1.04,s.add(D);{const U=q.pieces[0].geo.index?q.pieces[0].geo.toNonIndexed():q.pieces[0].geo,he=-k*.32*1.08,Me=U.attributes.position,ge=Me.count/3,Pe=ze=>{const xe=new In,we={};for(const ce of Object.keys(U.attributes))we[ce]=[];for(let ce=0;ce<ge;ce++)if((Me.getX(3*ce)+Me.getX(3*ce+1)+Me.getX(3*ce+2))/3<he===ze)for(const Ze of Object.keys(U.attributes)){const Ke=U.attributes[Ze];for(let ut=0;ut<3;ut++)for(let Ye=0;Ye<Ke.itemSize;Ye++)we[Ze].push(Ke.array[(3*ce+ut)*Ke.itemSize+Ye])}for(const ce of Object.keys(U.attributes))xe.setAttribute(ce,new rt(we[ce],U.attributes[ce].itemSize));return xe},B=u(Pe(!1),{finish:"striped",seed:6,age:.3,tone:.55});D.add(B);const ne=K0("cock",B,{at:[Ps[0],0,Ps[1]],right:[Math.cos(1.04),0,-Math.sin(1.04)],up:[-Math.sin(1.04),0,-Math.cos(1.04)],width:Ps[2],depth:.1},t.lang,{tier:n}),te=globalThis;(te.__secondWait??=[]).push(ne.ready),D.add(u(Pe(!0),{finish:"striped",seed:6,age:.5,tone:.55,direct:md,wear:.5}))}D.add(u(q.pieces[1].geo,{finish:"polished",seed:7,age:.35}));const V=u(q.pieces[2].geo,{finish:"polished",seed:8,age:0,tone:1.15});D.add(V),f({inst:q.inst},D,{age:.4},!0);const O=rr({detail:o,seed:8}),j=Ct(...Hc),ae=Ct(r,0,c).sub(Ct(j.x,0,j.z)).normalize(),ye=Math.atan2(-ae.z,ae.x),_e=O.pieces[1];_e.geo.computeBoundingBox();const L=_e.geo.boundingBox.getCenter(Ct(0,0,0)).applyMatrix4(_e.at),J=U=>new se().compose(j,new Wt().setFromAxisAngle(Ct(0,1,0),ye),Ct(1,1,U?-1:1)),ue=Ct(...fo),ve=L.clone().applyMatrix4(J(!0)).distanceTo(ue)<L.clone().applyMatrix4(J(!1)).distanceTo(ue),pe=new gt;pe.applyMatrix4(J(ve)),s.add(pe),pe.add(u(O.pieces[0].geo,{finish:"brushed",seed:9,age:.5}));const fe=dd(_e.geo,J(ve).multiply(_e.at),Ct(...so));if(fe===1){const U=_e.geo.boundingBox,he=U.getSize(Ct(0,0,0));_e.geo=ir({L:he.x,w:he.z/2,h:he.y,side:fe}).geo}const Le=dc(_e.geo,fe),Fe=uc({half:Le.half,centre:Le.centre,crack:Le.crack,node:Le.node,chipN:Le.chipN,glow:ua.glow,lit:ua.lit,nodeK:ua.node,body:ua.body});Fe.crack(ua.crack);const De=new je(_e.geo,Fe);De.applyMatrix4(_e.at),De.onBeforeRender=(U,he,Me)=>Fe.aim(De,Me),pe.add(De);const Ue=L.clone().applyMatrix4(J(ve));on.fork.copy(J(ve)),on.stone.copy(De.matrix),on.stoneWorld.copy(Ue),on.stoneGeo=_e.geo,on.side=fe;const Se=Bi({r:Ds,detail:o,seed:11,sheared:1}),He=u(Se,{finish:"polished",seed:11,age:.5,tone:.8});He.position.set(...so);const ot=Math.atan2(-(Ue.z-so[2]),Ue.x-so[0]);He.rotation.y=ot+.18,on.escRot=He.rotation.y,on.ready=!0,s.add(He);const ke=ha({length:3,ra:.12,leaves:7,pinionR:.34,pinionH:.5,pinionAt:.35,seatAt:1,detail:o,seed:12}),be=u(ke.geo,{finish:"turned",seed:12,age:.6},new se().makeTranslation(so[0],nn-.02,so[2]));s.add(be);const Z=new gt;s.add(Z);{const U=ii[0],he=F0[U.c],Me=Ct(he.x+(U.dx??0),nn+U.y-.4,he.z+(U.dz??0)),ge=Ct(r+.2,i+1.5,c+.4),Pe=Hi({count:n==="low"?70:170,box:[1,1,1],centre:[0,0,0],seed:51,detail:o}),B=kt([{r:.07,y:-.025},{r:.12,y:-.025},{r:.125,y:.02},{r:.07,y:.025},{r:.07,y:-.025}],o?20:10),ne=new i0(.7,.045,.07),te=[Pe.inst[0],Pe.inst[3]],ze=et(53),xe=new se,we=new Wt,ce=Ct(1,1,1),Ve=Ct(0,0,0),Ze=[{geo:B,finish:"polished",seed:54,mats:Array.from({length:n==="low"?5:12},()=>new se)},{geo:ne,finish:"sunray",seed:55,mats:Array.from({length:n==="low"?3:7},()=>new se)}],Ke=[...te,...Ze],ut=Ct(0,0,0),Ye=Ct(0,0,0),xt=ge.clone().sub(Me).normalize();ut.crossVectors(xt,Ct(0,1,0)).normalize(),Ye.crossVectors(ut,xt).normalize();for(const Pt of Ke)Pt.mats.forEach(Rn=>{Rn.decompose(Ve,we,ce),(Pt.geo===B||Pt.geo===ne)&&we.setFromEuler(new Nn(ze()*6.3,ze()*6.3,ze()*6.3));const dn=Math.pow(ze(),.75),sn=.35+1.5*dn,wn=ze()*Qo,me=Math.sqrt(ze())*sn,Qe=Me.clone().lerp(ge,dn).addScaledVector(ut,Math.cos(wn)*me*1.3).addScaledVector(Ye,Math.sin(wn)*me*.7),Ae=(Pt.geo===B||Pt.geo===ne?1:ce.x)*.42;Rn.copy(xe.compose(Qe,we,Ct(Ae,Ae,Ae)))});f({inst:Ke},Z,{age:.4})}[[7.3,-7,-5.2,-1.2,.3,.9,.7],[1.9,-7.2,-6.6,.6,1.1,.4,.45],[1.4,-9.6,-6.2,1.55,.7,0,.5]].forEach(([U,he,Me,ge,Pe,B,ne],te)=>Z.add(u(b0({size:te===1?"large":"medium",detail:o,seed:60+te,abused:te===0}),{finish:"blackened",seed:60+te,age:.4,tone:.8},new se().compose(Ct(U,he,Me),new Wt().setFromEuler(new Nn(ge,Pe,B)),Ct(ne,ne,ne)))));{const U=new j0(.05,4);U.rotateX(-Math.PI/2);const he=n==="low"?160:700,Me=[],ge=et(77),Pe=[[r-3.5,c+3.5,2.2],[r+6.5,c+1,1.6],[r-1,c-6,2.6],[r+2,c+6.5,1.4]];for(let B=0;B<he;B++){const ne=Pe[B%Pe.length],te=ge()*Qo,ze=Math.sqrt(ge())*ne[2]*(.4+ge()*.6),xe=.4+ge()*ge()*2.2;Me.push(new se().compose(Ct(ne[0]+Math.cos(te)*ze*1.4,nn+.004,ne[1]+Math.sin(te)*ze),new Wt().setFromEuler(new Nn(0,ge()*Qo,0)),Ct(xe,1,xe*(.3+ge()))))}f({inst:[{geo:U,finish:"blackened",seed:78,mats:Me}]},Z,{age:0,tone:.7})}const K=(U,he)=>Ct(F0[U].x,nn+he,F0[U].z);b.push(R0({a:K(2,7.2),b:K(4,5.9),r:.06,sag:1.6,phase:.45,seed:1,detail:o}),R0({a:K(9,6),b:K(11,8.1),r:.05,sag:1.2,phase:.7,seed:2,detail:o}),R0({a:K(10,3.4),b:Ct(so[0]+.6,nn+.1,so[2]-.4),r:.045,sag:.4,phase:.3,seed:3,detail:o}),R0({a:K(4,3.2),b:K(5,6.4),r:.04,sag:.9,phase:.95,seed:4,detail:o}),El({a:K(11,4),b:K(12,3.2),r:.035,sag:.9,phase:.6,beads:8,detail:o}),R0({a:K(14,4.6),b:Ct(-1.4,nn+6.2,-9.4),r:.05,sag:.8,phase:.35,seed:6,detail:o}));{const U=[],he=[];for(let Me=0;Me<=10;Me++){const ge=Me/10;U.push(K(4,7.4-ge*4.2).add(Ct(.6,0,0))),he.push(K(5,7-ge*3.6).add(Ct(.4,0,.3)))}b.push(Dl(U,he,{phase:.55,seed:7,detail:o,t:.008,sag:.5}))}{const U=La({R:.55,rIn:.07,phase:.3,detail:o});U.translate(r,i+.2,c),b.push(U);const he=La({R:.38,rIn:.12,phase:.6,detail:o});he.translate(so[0],so[1]+.1,so[2]),b.push(he);const Me=La({R:.32,rIn:.05,phase:.1,detail:o});Me.translate(j.x,j.y+.16,j.z),b.push(Me),b.push(R0({a:Ct(r-1,E-.5,c+.2),b:Ct(r-2.2,i+.2,c+1.6),r:.03,sag:.2,phase:.93,seed:8,detail:o}))}{const U=k*.022,he=kt([{r:U*3.6,y:0},{r:U*2.3,y:.015,smooth:!0},{r:U*1.4,y:.06,smooth:!0},{r:U*1.03,y:.15,smooth:!0},{r:U,y:.15}],o?28:12);he.translate(r,nn,c),b.push(he)}{const U=et(71),he=[];for(const[ge,Pe,B]of[[-3.2,4.2,.55],[2.6,5.4,.32],[-5.6,.6,.8],[5.4,-2.6,.6]]){const te=new ls;for(let xe=0;xe<=26;xe++){const we=xe/26*Qo,ce=B*(.7+.3*Math.sin(we*3+U()*.6)+.12*(U()-.5));xe?te.lineTo(Math.cos(we)*ce,Math.sin(we)*ce*.8):te.moveTo(ce,0)}const ze=new Pi(te);ze.rotateX(-Math.PI/2),ze.translate(r+ge,nn+.004,c+Pe),he.push(ze);for(let xe=0;xe<14;xe++){const we=U()*Qo,ce=Math.sqrt(U())*B*.8,Ve=new i0(.05+U()*.09,.012,.012);Ve.rotateY(U()*Qo),Ve.translate(r+ge+Math.cos(we)*ce,nn+.012,c+Pe+Math.sin(we)*ce*.8),he.push(Ve)}}const Me=new je(_t(he.map(ge=>ge.index?ge.toNonIndexed():ge)),new y0({color:855308,roughness:.95,metalness:0}));Me.receiveShadow=n!=="low",s.add(Me)}const oe=new je(_t(b),jo({env:5}));oe.receiveShadow=n!=="low",s.add(oe);const de=U=>Qo/U,Ce=Ct(0,0,0),We=Ct(0,0,0),Je=Ct(0,0,0);return{group:s,update(U){if(s.visible=U.i>=4&&(U.i<=8||!U.inHold),U.i===6||U.i===7&&!U.inHold||U.i,m.visible=s.visible&&U.i>=5&&U.i<=7,pe.visible=He.visible=be.visible=U.i<=6,Z.visible=!(U.i===7&&(U.inHold||U.u>.8)),U.camera.getWorldPosition(Ce),U.camera.updateMatrixWorld(),Je.copy(Ge.bladeDir).negate().transformDirection(U.camera.matrixWorldInverse),l.value.set(Je.x,Je.y,Je.z,Md*(1-.55*(U.state.stop.station===6?U.trick("5").k:0))),d.value.copy(l.value),d.value.w*=vd,h.uniforms.uCamP.value.copy(Ce),g){const xe=g.getRenderTarget();h.uniforms.uTexel.value.set(1/xe.width,1/xe.height)}const he=U.trick("5"),Me=U.state.stop;let ge=0,Pe=0,B=0;if(he.k>0){const xe=he.phase*8,we=[.9,1.7,2.3,3.6,4.2,5.5,6.1,7],ce=[.6,.35,.8,.5,.9,.4,.7,.55];we.forEach((ut,Ye)=>{xe>=ut&&(ge=ce[Ye]*Math.exp(-(xe-ut)*2.6)*Math.min(1,(xe-ut)*12))}),We.set(r,i,c).project(U.camera);const Ve=U.state.pointer.x*2-1,Ze=1-U.state.pointer.y*2,Ke=1-vt(Math.hypot(Ve-We.x,(Ze-We.y)*.6)/1.2);ge*=(.75+.9*Ke)*he.k,Pe=xe<.12?ie(xe/.12):1,B=xe<.12?0:ie((xe-.12)/7.8)}const ne=he.k>0?Pe*(1-B):0,te=ge*.11+ne*.05;A.rotation.y=te,y.value=te,z.forEach((xe,we)=>{xe.mesh.rotation.y=xe.base+ne*de(xe.n)*(we%2?-1:1)}),He.rotation.y=ot+.18+ne*de(15)*.8,pe.rotation.y=0,pe.position.copy(j),pe.scale.set(1,1,ve?-1:1),pe.quaternion.setFromAxisAngle(Ct(0,1,0),ye+ne*.09*(ve?-1:1)),Z.position.y=he.k>0?(Pe<1?Math.sin(Pe*Math.PI)*.12:0)-ne*.05:0,V.rotation.y=-(he.rare>=0?N+($-N)*ie(he.rare):N);const ze=s.visible&&(U.i===6||U.i===7&&!U.inHold&&U.u<.4);if(Ge.on=ze?1:0,Ge.fadeTop=nn+yd,Ge.fadeLen=ze&&U.camera.aspect<1?bd:0,Ge.steps=ze&&n==="high"?ai[0]:0,Ge.reflSteps=ze&&n==="high"?ai[1]:0,ze){const xe=Me.station===6?ie(Me.t/1)*(Me.rel>0?1-ie(Me.rel/.9):1):0,we=he.k;Ge.columns=F0.map((ce,Ve)=>[ce.x,ce.z,ce.r*.95,S[Ve]]),Ge.floorY=nn,Ge.red.copy(Ct(Ue.x-4.2*we,nn+.5+.3*we,Ue.z-3.6*we)),Ge.redSize.set(1.6+5.2*we,.7+1.3*we,1.4+2.2*we),X.material.color.setScalar(1-.9*we),Ge.redPower=.012+.17*we,Ge.nave.set(h0,c-2,ri,Sd*(1-.6*xe)),Ge.ruby.copy(Ue),Ge.rubyPower=.05+.06*we,Ge.bladeGain=zd*(1-.33*xe),Ge.wake=we}h.uniforms.uRuby.value.copy(Ue),h.uniforms.uStreak.value=ze?1.6+.4*he.k:0,h.uniforms.uNearF.value=U.i===6&&U.inHold?wd:0}}}const Mt=(t,e,n)=>new C(t,e,n),Be={tooth:5,gap:.004,glow:1.4,lit:2.2,node:3,body:.07,crack0:.4,push:.022,back:.05,bite:.006,words:2.25,under:.012,sheen:0,fill:.3,toothAz:20,seat:.3,bevel:.8,sheet:1.4,env:.12,envFork:.35,envWheel:.2,envBridge:.25,bridgeNdc:[-.9,-.67],bridgeDepth:5.35,bridgeRecede:.1,bridgeS:.66,toothDirect:.06,toothLine:0,envTooth:.05,toothLen:.32,flank:1,flankR:.004,tilt:0,haze:.07,hazeAt:3.5,hazeSize:2,rimBehind:.9,dress:.3,duelBody:0,duelSheet:1,duelEnv:0,nearR:.09,nearLen:1.4,nearNdc:[.38,-.78],nearDepth:1.86,nearAng:.3,hot:2.5,duelFill:.6,gain:3.2,envGain:5.5,duelPlate:.75};function Pd(t){const e=t.kit.q,n=z0(e),o=new gt,s=(B,ne,te=!0)=>{const ze=new je(B,an({tier:e,...ne}));return ze.castShadow=te&&e!=="low",ze.receiveShadow=e!=="low",ze};if(!on.ready||!on.stoneGeo)return{group:o,update(){o.visible=!1}};const a=new gt;a.applyMatrix4(on.fork),o.add(a);const r=rr({detail:n,seed:8}),i=s(r.pieces[0].geo,{finish:"brushed",seed:9,age:.35,tone:.45,direct:.06,objScale:.12});i.position.setFromMatrixColumn(on.stone,0).normalize().multiplyScalar(-.3),i.material.envMapIntensity*=Be.envFork,a.add(i);const c=dc(on.stoneGeo,on.side),l=uc({half:c.half,centre:c.centre,crack:c.crack,node:c.node,chipN:c.chipN,glow:Be.glow,lit:Be.lit,nodeK:Be.node,body:Be.body,sheen:Be.sheen,fill:Be.fill,bevel:Be.bevel,sheet:Be.sheet,gain:Be.gain,env:Be.env,face:new C(0,1,0),tilt:new C(.12,0,.1)}),d=new je(on.stoneGeo,l);d.applyMatrix4(on.stone);const u=Mt(0,0,0),f=new se;d.onBeforeRender=(B,ne,te)=>{l.aim(d,te),f.copy(d.matrixWorld).invert(),l.ss.uBl.value.copy(u.copy(Ge.bladeDir).negate().transformDirection(f))},a.add(d),a.updateMatrixWorld(!0);const p=c.node.clone().applyMatrix4(d.matrixWorld),v=new Gn({color:new Gt().setRGB(.008,.0035,8e-4),roughness:.35,clearcoat:.08,clearcoatRoughness:.2,metalness:0,envMapIntensity:.02,specularIntensity:.1});{const B=c.half.y,ne=c.half.z,te=c.centre;for(const[ze,xe]of[[-ne,-1],[ne,1]]){const we=new je(new l0(1,20,12),v);we.scale.set(.06,.016,.02),we.position.set(te.x-c.half.x+.45-Be.seat-.01,te.y+B*.55,te.z+ze+xe*.006),d.add(we)}}const h=Bi({r:Ds,detail:n,seed:11,sheared:1}),m=s(h,{finish:"polished",seed:11,age:.5,tone:.45,objScale:.12,direct:.08});m.material.envMapIntensity*=Be.envWheel,m.position.set(...so),o.add(m);const M=h.attributes.position,x=Mt(...so),g=Mt(0,0,0).setFromMatrixColumn(d.matrixWorld,0).setY(0).normalize(),w=Mt(0,0,0).setFromMatrixColumn(d.matrixWorld,2).setY(0).normalize().multiplyScalar(on.side),b=g.multiplyScalar(Math.cos(Be.toothAz*Math.PI/180)).addScaledVector(w,Math.sin(Be.toothAz*Math.PI/180)).normalize();x.copy(p).addScaledVector(b,Ds);const S=Math.atan2(-(p.z-x.z),p.x-x.x);let P=Mt(0,0,0),z=1e9,_=0,R=1e9,k=-1e9;for(let B=0;B<M.count;B++)_=Math.max(_,Math.hypot(M.getX(B),M.getZ(B)));for(let B=0;B<M.count;B++)Math.hypot(M.getX(B),M.getZ(B))>_-.05&&(R=Math.min(R,M.getY(B)),k=Math.max(k,M.getY(B)));for(let B=0;B<M.count;B++){const ne=M.getX(B),te=M.getZ(B),ze=Math.hypot(ne,te),xe=Math.atan2(-te,ne);if(ze<_-.004)continue;const we=Math.abs(Math.atan2(Math.sin(xe-(S-on.escRot)),Math.cos(xe-(S-on.escRot))));we<z&&(z=we,P=Mt(ne,M.getY(B),te))}const y=Math.atan2(-P.z,P.x),A=Math.hypot(P.x,P.z),F=new Pn({color:new Gt(0,0,0),vertexColors:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt});{const B=h.index?h.toNonIndexed():h,ne=y-Be.tooth*Math.PI*2/15,te=B.attributes.position.count,ze=[],xe=[],we=B.attributes.position;for(let Ve=0;Ve<te;Ve+=3){let Ze=0,Ke=0;for(let xt=0;xt<3;xt++)Ze+=we.getX(Ve+xt)/3,Ke+=we.getZ(Ve+xt)/3;const ut=Math.atan2(-Ke,Ze);(Math.abs(Math.atan2(Math.sin(ut-ne),Math.cos(ut-ne)))<Math.PI/15&&Math.hypot(Ze,Ke)>_-Be.toothLen?ze:xe).push(Ve)}const ce=Ve=>{const Ze=new In;for(const[Ke,ut]of Object.entries(B.attributes)){const Ye=ut,xt=new Float32Array(Ve.length*3*Ye.itemSize);Ve.forEach((Pt,Rn)=>{for(let dn=0;dn<3;dn++)for(let sn=0;sn<Ye.itemSize;sn++)xt[(Rn*3+dn)*Ye.itemSize+sn]=Ye.getComponent(Pt+dn,sn)}),Ze.setAttribute(Ke,new s0(xt,Ye.itemSize))}return Ze};if(ze.length){m.geometry=ce(xe);const Ve=s(ce(ze),{finish:"polished",seed:12,age:.6,tone:.5,objScale:2,direct:Be.toothDirect,line:[Be.toothLine,_-Be.toothLen]});Ve.material.envMapIntensity*=Be.envTooth,m.add(Ve);const Ze=Ve.geometry.attributes.position;for(const[Ke,ut,Ye,xt]of[[Be.flank,Be.flankR,1,.3],[-1,Be.flankR*.6,.35,.1]]){const Pt=Array(14).fill(null),Rn=Array(14).fill(-1e9);for(let Ee=0;Ee<Ze.count;Ee++){const Tt=Ze.getX(Ee),$t=Ze.getY(Ee),Qt=Ze.getZ(Ee),Nt=Math.hypot(Tt,Qt);if($t<k-.003||Nt<_-Be.toothLen+.02)continue;const Yt=Math.min(13,Math.floor((Nt-(_-Be.toothLen+.02))/(Be.toothLen-.02)*14)),Un=Math.atan2(-Qt,Tt),Cn=Ke*Math.atan2(Math.sin(Un-ne),Math.cos(Un-ne));Cn>Rn[Yt]&&(Rn[Yt]=Cn,Pt[Yt]=Mt(Tt,$t+.001,Qt))}const dn=Pt.filter(Ee=>!!Ee);if(dn.length<3)continue;const sn=s(r0(dn,()=>ut,6),{finish:"polished",seed:13,age:0,tone:1,direct:Ye});sn.material.envMapIntensity*=xt,m.add(sn);const wn=dn.slice(-4),me=wn[wn.length-1],Qe=Math.max(1e-4,wn[0].distanceTo(me)),Ae=r0(wn,()=>ut*1.6,6),st=Ae.attributes.position,tt=new Float32Array(st.count*3);for(let Ee=0;Ee<st.count;Ee++){const Tt=1-Math.min(1,Mt(st.getX(Ee),st.getY(Ee),st.getZ(Ee)).distanceTo(me)/Qe);tt[Ee*3]=Tt*Tt,tt[Ee*3+1]=0}Ae.setAttribute("color",new s0(tt,3)),m.add(new je(Ae,F))}}}m.position.copy(p).addScaledVector(b,A+Be.gap).setY(p.y-k-Be.under);const T=new gt;T.position.copy(p),o.add(T),T.quaternion.setFromAxisAngle(Mt(0,0,0).crossVectors(b,Mt(0,1,0)).normalize(),Be.tilt*Math.PI/180),m.position.sub(p),o.remove(m),T.add(m);const I=S-y-Be.bite/A+Be.tooth*Math.PI*2/15,Q=new gt;Q.rotation.y=-5*Math.PI*2/15,m.add(Q);const X=new gt;Q.add(X),X.scale.setScalar(Be.dress),X.position.copy(P).multiplyScalar(1-Be.dress);const E=Mt(P.x,0,P.z).normalize(),N=Mt(-E.z,0,E.x),$=Mt(0,1,0),q=P.y;{const B=k-q,ne=[];for(let ce=0;ce<=10;ce++){const Ve=ce/10,Ze=P.clone().addScaledVector(N,(Ve-.5)*.07).addScaledVector(E,-.004+.008*Math.sin(Ve*Math.PI)).addScaledVector($,B+.002+.004*Math.sin(Ve*3.1));ne.push(Ze)}X.add(s(r0(ne,ce=>.006*(.4+Math.sin(ce*Math.PI)),6),{finish:"polished",seed:31,age:.2,tone:1}));const te=[],ze=P.clone().addScaledVector(E,-.1).addScaledVector(N,-.01).addScaledVector($,B+.026);for(let ce=0;ce<=80;ce++){const Ve=ce/80,Ze=Ve*Math.PI*5,Ke=.028*(1-.45*Ve),ut=ze.clone().addScaledVector(N,Math.cos(Ze)*Ke*.6).addScaledVector($,Math.sin(Ze)*Ke*.45).addScaledVector(E,Ve*.03);te.push(ut)}X.add(s(r0(te,ce=>.0045*(1-.5*ce),5),{finish:"polished",seed:32,age:.3,tone:.95}));const xe=new je(new l0(1,32,16),new Gn({color:new Gt().setRGB(.004,.0035,.003),roughness:.04,ior:1.47,envMapIntensity:1.2}));xe.scale.set(.008,.0075,.045);const we=P.clone().addScaledVector(E,-.06).addScaledVector(N,-.04).addScaledVector($,B+.003);xe.position.copy(we),xe.lookAt(we.clone().add(E.clone().multiplyScalar(-1).addScaledVector(N,-.6))),X.add(xe)}const D=new gt;o.add(D);{const te=us(Ke=>[-1.25+Ke*2.5,Math.sin(Ke*Math.PI)*-.15],Ke=>.2-.03*Math.sin(Ke*Math.PI),lt(40,n,16),12),ze=[[-2.5/2+.16,0]],xe=mo({outline:te,holes:[...ze.map(Ke=>({at:Ke,r:.1,sink:.06})),{at:[-.25,-.1],r:.045,bush:!0}],t:.12,bevel:.04,detail:n,round:1}),we=s(xe.geo,{finish:"striped",seed:9,age:.3,tone:.3,direct:.06,wear:.4,objScale:.15});we.material.envMapIntensity*=Be.envBridge,D.add(we),xe.bushes&&D.add(s(xe.bushes,{finish:"polished",seed:10,age:.3}));const ce=wa("small",ze,.12/2-.06,9,{detail:n});for(const Ke of ce){const ut=new gn(Ke.geo,an({finish:Ke.finish,seed:Ke.seed,tier:e,age:.4}),Ke.mats.length);Ke.mats.forEach((Ye,xt)=>ut.setMatrixAt(xt,Ye.clone().multiply(new se().makeScale(.42,.42,.42)))),ut.instanceMatrix.needsUpdate=!0,ut.computeBoundingSphere(),D.add(ut)}const Ve=K0("pallet-bridge",we,{at:[.62,.12/2,-.06],right:[1,0,0],up:[0,0,-1],width:Be.words,depth:.03},t.lang,{tier:e}),Ze=globalThis;(Ze.__secondWait??=[]).push(Ve.ready)}Mt(0,0,0).applyMatrix4(on.fork);{const B=Te.find(xt=>xt.id==="6").pose,ne=Mt(...B.pos),te=Mt(...B.look).sub(ne).normalize(),ze=Mt(0,0,0).crossVectors(te,Mt(0,1,0)).normalize(),xe=Mt(0,0,0).crossVectors(ze,te),[we,ce]=Be.bridgeNdc,Ve=Be.bridgeDepth,Ze=Ve*.18;D.position.copy(ne).addScaledVector(te,Ve).addScaledVector(ze,we*Ze).addScaledVector(xe,ce*Ze*9/16);const Ke=ze.clone().multiplyScalar(Math.cos(Be.bridgeRecede)).addScaledVector(te,Math.sin(Be.bridgeRecede)),ut=Mt(0,1,0).addScaledVector(te,.08);ut.addScaledVector(Ke,-ut.dot(Ke)).normalize(),Ke.normalize();const Ye=Mt(0,0,0).crossVectors(Ke,ut);D.quaternion.setFromRotationMatrix(new se().makeBasis(Ke,ut,Ye)),D.scale.setScalar(Be.bridgeS)}const V=new un({vertexShader:`varying vec2 vU;
void main() {vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}`,fragmentShader:`varying vec2 vU;
void main() {
  float a = 1.0 - smoothstep(0.15, 0.5, abs(vU.y - 0.5));
  a *= smoothstep(0.0, 0.25, vU.x) * smoothstep(0.0, 0.25, 1.0 - vU.x);
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}`,transparent:!0,depthWrite:!1,depthTest:!1,blending:An,blendSrc:to,blendDst:er,blendSrcAlpha:to,blendDstAlpha:dt}),O=new je(new no(Be.nearLen,Be.nearR*2),V);O.renderOrder=10,O.frustumCulled=!1;{const B=Te.find(Ye=>Ye.id==="6").pose,ne=Mt(...B.pos),te=Mt(...B.look).sub(ne).normalize(),ze=Mt(0,0,0).crossVectors(te,Mt(0,1,0)).normalize(),xe=Mt(0,0,0).crossVectors(ze,te),[we,ce]=Be.nearNdc,Ve=Be.nearDepth,Ze=Ve*.18;O.position.copy(ne).addScaledVector(te,Ve).addScaledVector(ze,we*Ze).addScaledVector(xe,ce*Ze*9/16);const Ke=ze.clone().multiplyScalar(Math.cos(Be.nearAng)).addScaledVector(xe,Math.sin(Be.nearAng)).normalize(),ut=Mt(0,0,0).crossVectors(te.clone().negate(),Ke);O.quaternion.setFromRotationMatrix(new se().makeBasis(Ke,ut,te.clone().negate()))}o.add(O);const j=new un({uniforms:{uK:{value:Be.haze}},vertexShader:`varying vec2 vUv;
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
}`,transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt}),ae=new je(new no(1,1),j);ae.frustumCulled=!1,ae.renderOrder=-1,o.add(ae);const ye=[];for(let B=0;B<=48;B++){const ne=Math.PI+(B/48-.5)*1.4;ye.push(Mt(Math.cos(ne)*Ua,0,Math.sin(ne)*Ua))}const _e=s(r0(ye,()=>.07,8),{finish:"polished",seed:14,age:.6,tone:.4,direct:.05});_e.material.envMapIntensity*=.05,o.add(_e);{const B=Te.find(te=>te.id==="6").pose,ne=Mt(...B.look).sub(Mt(...B.pos)).setY(0).normalize();_e.position.copy(on.stoneWorld).addScaledVector(ne,Ua+Be.rimBehind).setY(on.stoneWorld.y-.1),_e.rotation.y=-Math.atan2(-ne.z,-ne.x)+Math.PI}const L=et(67),J=9,ue=new Fc(1,0),ve=new Gn({color:new Gt().setRGB(.006,0,3e-4),roughness:.05,metalness:0,ior:1.76,emissive:new Gt(.004,0,1e-4)}),pe=new gn(ue,ve,J);pe.frustumCulled=!1,o.add(pe);const fe=Array.from({length:J},()=>({t:.25+L()*.7,d:Mt(L()-.3,L()*.9+.2,L()-.5).normalize(),s:.006+L()*.012,r:Mt(L()*6,L()*6,L()*6),v:.12+L()*.2})),Le=18,Fe=new Pn({color:new Gt(1.3*Be.gain,0,.02*Be.gain),transparent:!1,depthWrite:!0,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt}),De=Fe.clone();De.color.setRGB(6,5,4.6);const Ue=new B0(1,1,1,4,1,!0);Ue.translate(0,-.5,0),Ue.rotateX(Math.PI/2);const Se=new gn(Ue,Fe,Le),He=new gn(new l0(1,6,4),De,Le);Se.frustumCulled=He.frustumCulled=!1,o.add(Se,He);const ot=Array.from({length:Le},()=>({a:L()*Math.PI*2,c:Math.pow(L(),.7),v:.45+L()*.9,g:L()})),ke=[.25,.85,1.3,2.4,2.9,3.6,4.3,5.1],be=new se,Z=new Wt,G=Mt(1,1,1),K=Mt(0,0,0),oe=Mt(0,0,1),de=Mt(0,0,0),Ce=Mt(0,0,0),We=Mt(0,0,0),Je=Mt(0,0,0),U=Mt(0,0,0),he=Mt(0,0,0),Me=[],ge=new Set;D.traverse(B=>{const ne=B.material;ne&&ge.add(ne)}),o.traverse(B=>{const ne=B.material;ne&&"envMapIntensity"in ne&&!Me.some(te=>te[0]===ne)&&Me.push([ne,ne.envMapIntensity])});const Pe=[];for(const[B]of Me){const ne=B.ss?.uRS2;ne&&Pe.push([ne.value,ne.value.y])}return{group:o,update(B){if(o.visible=B.i>=7&&(B.i<=8||!B.inHold),!o.visible)return;const ne=B.trick("6");{const Ye=B.i===7&&(B.inHold||B.u>.9);ae.visible=_e.visible=O.visible=Ye,Ye&&(B.camera.matrixWorld.extractBasis(de,Ce,We),ae.position.copy(on.stoneWorld).addScaledVector(We,-3.5),ae.quaternion.copy(B.camera.quaternion),ae.scale.setScalar(Be.hazeSize*(1+Be.hazeAt/B.camera.position.distanceTo(on.stoneWorld))),j.uniforms.uK.value=Be.gain*Be.haze*(1-.5*ne.k))}for(const[Ye,xt]of Me)Ye.envMap=t.scene.environment,Ye.envMapIntensity=xt*(Ye===l?Be.gain:Be.envGain)*t.scene.environmentIntensity*(1-(ge.has(Ye)?Be.duelPlate:Be.duelEnv)*ne.k);for(const[Ye,xt]of Pe)Ye.y=xt*(1-.95*ne.k);l.ss.uSheen.value=Be.sheen*(1-.85*ne.k);const te=Math.pow(1-ne.k,6);l.ss.uBevC.value.setRGB(.86*te+.045*ne.k,.88*te,.92*te),l.ss.uBody.value=Be.body*(1+Be.duelBody*ne.k),l.ss.uSheet.value=Be.sheet*(1+Be.duelSheet*ne.k);const ze=B.i===7?B.inHold?ie(B.u):0:1;let xe=0,we=0,ce=0;if(ne.k>0){const Ye=ne.phase*6;xe=Ye<2?ie(Ye/2):Ye<5?1:1-ie((Ye-5)/1),we=Math.sin(B.state.time*71)*.5+Math.sin(B.state.time*113+1)*.5,we*=xe*(Ye<2?Ye/2:1),xe*=ne.k}ne.rare>=0&&(ce=ne.rare);const Ve=ce>0?ie(ce/.06):0;F.color.setScalar(Be.gain*Be.hot*ne.k*(1-Ve)),m.rotation.y=I+ze*Be.push-xe*Be.back-we*.0025*ne.k-Ve*.28;const Ze=Be.crack0+(.96-Be.crack0)*ze;l.crack(ce>0?Ze*(1-.85*ie(ce/.5)):Ze);const Ke=ie((ze-.55)/.45)*(1-Ve);l.ss.uHeat.value=Ke*(1-.35*xe)+Math.max(0,we)*.3*ne.k,l.ss.uNodeK.value=Be.node*(1+2.2*ze)*(1-.7*Ve),l.ss.uFill.value=Be.fill*(1-Ve)*(1-Be.duelFill*ne.k),l.ss.uLit.value=Be.lit*(1-.8*ie(ce/.5));for(let Ye=0;Ye<J;Ye++){const xt=fe[Ye],Pt=vt((ze-xt.t)/.25)*(1-Ve);K.copy(p).addScaledVector(xt.d,Pt*xt.v).add(he.set(0,-Pt*Pt*.05,0)),Z.setFromEuler(new Nn(xt.r.x*Pt,xt.r.y*Pt,xt.r.z*Pt)),be.compose(K,Z,G.setScalar(Pt>0&&Pt<1?xt.s:0)),pe.setMatrixAt(Ye,be)}pe.instanceMatrix.needsUpdate=!0;const ut=ne.k>0&&!Ve;if(Se.visible=He.visible=ut,ut){const Ye=ne.phase*6;let xt=-1;for(const tt of ke)Ye>=tt&&(xt=tt);const Pt=xt<0?1:(Ye-xt)/.4;B.camera.matrixWorld.extractBasis(de,Ce,We),he.copy(p).project(B.camera);const Rn=B.state.pointer.x*2-1,dn=1-B.state.pointer.y*2,sn=he.x-Rn,wn=he.y-dn,me=Math.hypot(sn,wn)||1;Je.set(0,0,0).addScaledVector(de,sn/me).addScaledVector(Ce,wn/me).addScaledVector(We,-.1).normalize();const Qe=Mt(0,0,0).crossVectors(Je,We).normalize(),Ae=Mt(0,0,0).crossVectors(Qe,Je).normalize(),st=B.camera.position.distanceTo(p);for(let tt=0;tt<Le;tt++){const Ee=ot[tt],Tt=Pt<1&&tt%2===0&&Ee.g>.15*(ke.indexOf(xt)%3),$t=1.05*Ee.c;U.copy(Je).addScaledVector(Qe,Math.cos(Ee.a)*$t).addScaledVector(Ae,Math.sin(Ee.a)*$t).normalize(),U.addScaledVector(We,-.85*U.dot(We)).normalize();const Qt=Ee.v*Pt*(1-.3*Pt),Nt=.03+.12*Ee.v*(1-Pt*.8);K.copy(p).addScaledVector(U,Qt).add(he.set(0,-Pt*Pt*.04,0)),Z.setFromUnitVectors(oe,U);const Yt=Math.min(1,B.camera.position.distanceTo(K)/st);be.compose(K,Z,G.set(5e-4*Yt,5e-4*Yt,Tt?Nt:0)),Se.setMatrixAt(tt,be),be.compose(K,Z,G.setScalar(Tt?6e-4*Yt:0)),He.setMatrixAt(tt,be)}Se.instanceMatrix.needsUpdate=He.instanceMatrix.needsUpdate=!0}if(ce>0&&ce<.25&&!B.state.reduced){const Ye=Math.exp(-ce*30)*Math.sin(ce*140)*.012*B.camera.position.distanceTo(p);B.camera.matrixWorld.extractBasis(de,Ce,We),B.camera.position.addScaledVector(Ce,Ye).addScaledVector(de,Ye*.4),B.camera.updateMatrixWorld()}}}}const da=(t=0,e=0,n=0)=>new C(t,e,n),yt=(()=>{const t=da(...Ci),e=da(...Ws),n=e.clone().sub(t).normalize(),o=da().crossVectors(n,da(0,1,0)).normalize(),s=da().crossVectors(o,n).normalize();return{E:t,L:e,F:n,R:o,U:s,Dref:t.distanceTo(e),H:1.95}})();function Io(t){const e=t/yt.Dref*yt.H,n=new se;return n.makeBasis(yt.R.clone().multiplyScalar(e),yt.U.clone().multiplyScalar(e),yt.F.clone().multiplyScalar(-e)).setPosition(yt.E.clone().addScaledVector(yt.F,t)),n}function Ad(t){const e=t.clone().sub(yt.E),n=e.dot(yt.F),o=n/yt.Dref*yt.H;return{x:e.dot(yt.R)/o,y:e.dot(yt.U)/o,D:n}}const Xn=[{a:[-.975,-.5],b:[-.975,.5],hw:.1,letter:0},{a:[-.96,.48],b:[-.525,-.2],hw:.088,letter:0},{a:[-.525,-.2],b:[-.09,.48],hw:.088,letter:0},{a:[-.075,.5],b:[-.075,-.5],hw:.1,letter:0},{a:[.325,-.5],b:[.325,.5],hw:.1,letter:1},{a:[.37,-.03],b:[1.03,.5],hw:.09,letter:1},{a:[.6,.17],b:[1.06,-.5],hw:.094,letter:1}],eo=t=>Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),As=[6.7,7.2,6.8,6.35,7,7.65,7.1],W0=(()=>{const t=Xn.map(eo),e=t[0]+t[1]+t[2];return[{g0:.4+.5+t[2]+t[1],tg:1,h0:0,hdir:1},{g0:.4+.5+t[2],tg:1,h0:t[0],hdir:1},{g0:.4+.5,tg:1,h0:t[0]+t[1],hdir:1},{g0:.4,tg:.5,h0:e,hdir:-1},{g0:0,tg:.5,h0:e+t[3]+.2,hdir:1},{g0:0,tg:0,h0:e+t[3]+.2+.5,hdir:1},{g0:.25,tg:0,h0:e+t[3]+.2+.5+.3,hdir:1}]})(),_n={OIL:0,FORGE:1,SCALES:2,SWARM:3,RARE:4},Rs=1.5,g0=5.5,es=6.5,pc=1.5,ci=es+pc,Rd=3.62,Cd=5.45,Td=t=>t-Math.floor(t),Fd=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),li=t=>{const e=Fd(t);return e*e*(3-2*e)};function ui(t,e){return!e||t<4?t%4:t===4?_n.RARE:(t-1)%4}function _d(t,e){const n=t<Rs?0:Rd*li((t-Rs)/(g0-Rs))**.85,o=Td((t-g0)/es);if(t<g0)return{flood:n,a:_n.OIL,b:_n.OIL,front:-1,phase:o,slot:0,inSlot:t-g0};const s=(t-g0)/ci,a=Math.floor(s),r=t-g0-a*ci,i=ui(a,e),c=ui(a+1,e),l=r>es?(r-es)/pc:-1,d=l<0?-1:-.4+(Cd+.8)*li(l);return{flood:n,a:i,b:l<0?i:c,front:d,phase:o,slot:a,inSlot:r}}const Id=t=>[_n.OIL,_n.FORGE,_n.SCALES,_n.SWARM,_n.SCALES,_n.OIL,_n.FORGE][t]??0,Cs=8,_0=(t=0,e=0,n=0)=>new C(t,e,n),is=(t,e=0,n=1)=>Math.min(n,Math.max(e,t)),m0=t=>{const e=is(t);return e*e*(3-2*e)},$s=`
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
`,Ld=`
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
`;function Ed(t,e){const n=[],o=[],s=[],a=[],r=[],i=[];for(const l of t){let d=new In;d.setAttribute("position",l.geo.getAttribute("position").clone()),l.geo.index&&d.setIndex(l.geo.index.clone()),d=Nc(d,2e-4),d.computeVertexNormals();const u=Xn[l.s],f=eo(u),p=W0[l.s],v=(u.b[0]-u.a[0])/f,h=(u.b[1]-u.a[1])/f,m=d.getAttribute("position"),M=d.getAttribute("normal"),x=n.length/3;for(let w=0;w<m.count;w++){const b=M.getX(w),S=M.getY(w),P=M.getZ(w),z=m.getX(w)+b*e,_=m.getY(w)+S*e,R=m.getZ(w)+P*e;n.push(z,_,R),o.push(b,S,P),r.push(l.D);const k=(z-u.a[0])*v+(_-u.a[1])*h,y=is(((z-u.a[0])*-h+(_-u.a[1])*v)/u.hw,-1.2,1.2);s.push(l.s,k,y,P);const A=is(k/f);a.push(p.h0+(p.hdir>0?A:1-A)*f,p.g0+Math.abs(A-p.tg)*f)}const g=d.index;for(let w=0;w<g.count;w++)i.push(x+g.getX(w))}const c=new In;return c.setAttribute("position",new rt(n,3)),c.setAttribute("normal",new rt(o,3)),c.setAttribute("aSL",new rt(s,4)),c.setAttribute("aHG",new rt(a,2)),c.setAttribute("aD",new rt(r,1)),c.setIndex(n.length/3>65535?new _c(i,1):new Ic(i,1)),c}function Dd(t){const e=new Gn({color:16777215,roughness:.1,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.2});return e.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
${$s}
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
${$s}
${Ld}
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
gl_FragColor.a = 1.0 + clamp(skTag, 0.0, 1.0);`)},e.customProgramCacheKey=()=>"mk-coat",e}function Ts(t,e,n){const o=new Gn(n),s=[`float ang = 0.1 + 0.66 * ((0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))));
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
  ctr = vec3(lp, cz);`][e],a=[_n.SCALES,_n.SWARM,_n.FORGE][e];return o.onBeforeCompile=r=>{Object.assign(r.uniforms,t),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
${$s}
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
  ${s}
}
{
  float tt = clamp(l / L, 0.0, 1.0);
  float h = iC.x + (iC.y > 0.0 ? tt : 1.0 - tt) * L;
  float g = iC.z + abs(tt - iC.w) * L;
  float w = skW(${a}.0, si, skSel(h, sd));
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
gl_FragColor.a = 1.0;`)},o.customProgramCacheKey=()=>`mk-part-${e}`,o}function Wd(){const e=new ls;e.moveTo(-.05*.3,0),e.lineTo(.05*.3,0),e.lineTo(.05,-.15*.34),e.lineTo(.05*.16,-.15*.9),e.lineTo(0,-.15),e.lineTo(-.05*.16,-.15*.9),e.lineTo(-.05,-.15*.34),e.lineTo(-.05*.3,0);const n=new gi(e,{depth:.003,bevelEnabled:!0,bevelThickness:.003,bevelSize:.0048,bevelSegments:2,curveSegments:5});return n.computeVertexNormals(),n}function Nd(){const t=new B0(.0045,.0035,.028,6,1).translate(0,-.012,0),e=new B0(.011,.011,.006,10,1).translate(0,.004,0),n=new In,o=t.toNonIndexed(),s=e.toNonIndexed(),a=[...o.attributes.position.array,...s.attributes.position.array],r=[...o.attributes.normal.array,...s.attributes.normal.array];return n.setAttribute("position",new rt(a,3)),n.setAttribute("normal",new rt(r,3)),n}function Bd(t){const{q:e}=t,n=e==="low",o=new gt;o.visible=!1,t.group.add(o);const s={uA:{value:[0,0,0,0,0,0,0]},uB:{value:[0,0,0,0,0,0,0]},uFront:{value:-1},uFlood:{value:0},uT:{value:0},L7:{value:Xn.map(eo)},uE:{value:yt.E.clone()},uF:{value:yt.F.clone()},uR:{value:yt.R.clone()},uU:{value:yt.U.clone()},uDH:{value:new bt(yt.Dref,yt.H)},uPtr:{value:_0(0,0,0)},uForgeTag:{value:0},uCrestLit:{value:0},uCrestCol:{value:_0(.022,.022,.024)}},a=Dd(s);{const R=new je(Ed(t.coat,.005),a);R.frustumCulled=!1,o.add(R)}const r=et(7077),i=(R,k,y)=>{const A=y.length,F=new Sa;F.index=R.index;for(const $ of["position","normal"])F.setAttribute($,R.getAttribute($));const T=new Float32Array(A*4),I=new Float32Array(A*4),Q=new Float32Array(A*4),X=new Float32Array(A*4),E=new Float32Array(A*16);y.forEach(($,q)=>{const D=$[0],V=Xn[D],O=eo(V),j=W0[D];T.set([V.a[0],V.a[1],(V.b[0]-V.a[0])/O,(V.b[1]-V.a[1])/O],q*4),I.set([O,V.hw,D,$[1]],q*4),Q.set([j.h0,j.hdir,j.g0,j.tg],q*4),X.set($.slice(2,6),q*4),Io(As[D]).toArray(E,q*16)}),F.setAttribute("iA",new vn(T,4)),F.setAttribute("iB",new vn(I,4)),F.setAttribute("iC",new vn(Q,4)),F.setAttribute("iD",new vn(X,4)),F.instanceCount=A;const N=new gn(F,k,A);return N.instanceMatrix=new vn(E,16),N.frustumCulled=!1,o.add(N),N},c=[];Xn.forEach((R,k)=>{const y=eo(R),A=n?.085:.068,F=3;for(let T=0,I=-R.hw*.6;I<y+R.hw*.6;T++,I+=A)for(let Q=0;Q<F;Q++){const X=-.86+1.72*(Q+(T%2?.5:0))/(F-(T%2?0:1)||1);Math.abs(X)>.95||c.push([k,r(),I,X,T,0])}}),i(Wd(),Ts(s,0,{color:new Gt(.09,.09,.095),metalness:1,roughness:.42,envMapIntensity:.45}),c);const l=[];Xn.forEach((R,k)=>{const y=Math.round(eo(R)*(n?190:540));for(let A=0;A<y;A++)l.push([k,r(),(r()*2-1)*.95,1+(r()<.3?1:0),r()*r(),1+Math.floor(r()*3)])}),i(Nd(),Ts(s,1,{color:new Gt(.16,.16,.17),metalness:1,roughness:.35,envMapIntensity:.22}),l);const d=[];Xn.forEach((R,k)=>{const y=eo(R),A=Math.round(y*(n?10:24));for(let F=0;F<A;F++)d.push([k,r(),r()*y,(r()*2-1)*.8,0,0])});const u=new ns(.017,0).scale(1,.75,.22);i(u,Ts(s,2,{color:new Gt(.04,.037,.036),metalness:.3,roughness:.7,emissive:new Gt(.07,0,.001)}),d);const f=(R,k,y,A=.05)=>_0(R,k,A).applyMatrix4(Io(As[y])),p=(R,k,y,A=.03)=>{const F=Xn[R],T=eo(F),I=(F.b[0]-F.a[0])/T,Q=(F.b[1]-F.a[1])/T;return f(F.a[0]+(F.b[0]-F.a[0])*k-Q*y*F.hw,F.a[1]+(F.b[1]-F.a[1])*k+I*y*F.hw,R,A)},v=As[4]/yt.Dref*yt.H,h=[];[[.55,.5,0],[.72,.3,1],[.86,.16,2]].forEach(([R,k,y])=>h.push({a:p(1,R,1),b:p(2,1-R+.02*y,1),w:.011*v,sag:.03*v,ph:y*.23,beads:3+y,nk:.5,seed:11+y,tier:y===2?2:1,snap:y===1})),[[.12,.18,0],[.3,.33,1]].forEach(([R,k,y])=>h.push({a:p(5,R,-1),b:p(6,k,1),w:.012*v,sag:.02*v,ph:.4+y*.3,beads:2+y,seed:21+y,tier:1})),h.push({a:p(3,.45,1),b:p(4,.58,1),w:.011*v,sag:.05*v,ph:.1,beads:4,seed:31,tier:1,drop:.55}),h.push({a:p(3,.7,1),b:p(4,.32,1),w:.008*v,sag:.07*v,ph:.6,beads:3,seed:32,tier:2,snap:!0}),[[0,0],[3,1],[4,0],[6,1]].forEach(([R,k],y)=>{const A=p(R,k,0,.02),F=A.clone().addScaledVector(yt.U,-(.16+.06*y)*v);h.push({a:A,b:F,w:.013*v,end:"drop",ph:y*.27,seed:41+y,tier:1})}),[[1,.3,.12],[1,.72,.2],[2,.45,.09],[2,.8,.15],[5,.5,.14],[5,.86,.1],[6,.6,.17]].forEach(([R,k,y],A)=>{const F=p(R,k,-1,.02),T=F.clone().addScaledVector(yt.U,-y*v);h.push({a:F,b:T,w:(.008+.003*(A%3))*v,end:"drop",ph:.13+A*.31,seed:51+A,tier:A%3===2?2:1})}),[[.25,.25,0],[.42,.4,1]].forEach(([R,k,y])=>h.push({a:p(4,R,-1),b:p(6,k,-1),w:.009*v,sag:.04*v,ph:.7+y*.2,beads:3,seed:61+y,tier:1,snap:y===1}));const m=[],M=6;m.push({top:Array.from({length:M},(R,k)=>p(1,.3+.66*k/(M-1),1,.01)),bot:Array.from({length:M},(R,k)=>p(2,.7-.66*k/(M-1),1,.01)),free:"sides",holes:[{u:.25,v:.5,rx:.05*v,ry:.038*v,kind:"breathe",ph:.1},{u:.55,v:.42,rx:.04*v,ry:.03*v,kind:"open",ph:.5},{u:.8,v:.5,rx:.022*v,ry:.018*v,kind:"breathe",ph:.8},{u:.14,v:.68,rx:.034*v,ry:.024*v,kind:"breathe",ph:.3},{u:.22,v:.84,rx:.014*v,ry:.011*v,kind:"breathe",ph:.65},{u:.34,v:.63,rx:.022*v,ry:.017*v,kind:"breathe",ph:.9},{u:.1,v:.5,rx:.012*v,ry:.01*v,kind:"breathe",ph:.4},{u:.27,v:.74,rx:.009*v,ry:.008*v,kind:"breathe",ph:.15}],waist:.14}),m.push({top:Array.from({length:M},(R,k)=>p(5,.06+.5*k/(M-1),-1,.01)),bot:Array.from({length:M},(R,k)=>p(6,.02+.5*k/(M-1),1,.01)),free:"sides",holes:[{u:.4,v:.5,rx:.04*v,ry:.03*v,kind:"pairA",ph:.2},{u:.72,v:.45,rx:.035*v,ry:.026*v,kind:"pairB",ph:.2}],waist:.12});const x=oc({strands:h,webs:m,q:e,env:.9});o.add(x.group);const g=new tr,w=_0(),b=new Ma,S=_0(),P=_0();b.setFromNormalAndCoplanarPoint(yt.F,yt.E.clone().addScaledVector(yt.F,yt.Dref));const z=(R,k)=>R===_n.RARE?Id(k):R,_=(R,k,y,A)=>{const F=A<0?0:m0((A-y)/.1+.5);return(s.uA.value[k]===R?1-F:0)+(s.uB.value[k]===R?F:0)};return{forge:0,cover:0,oil:0,scales:0,update(R,k){const y=R.state.stop,A=y.station===Cs&&(R.i===Cs||R.i===Cs+1);if(o.visible=A&&y.t>1.4,!o.visible){this.forge=0,this.cover=0,this.oil=0,this.scales=0,t.shardMat.u&&(t.shardMat.u.uRoot.value=1);return}const F=_d(y.t,y.rare),T=y.rel>0?1-m0(y.rel/.8):1;s.uFlood.value=F.flood*T-(T<1?.02:0),s.uFront.value=F.front,s.uT.value=F.phase;for(let q=0;q<7;q++)s.uA.value[q]=z(F.a,q),s.uB.value[q]=z(F.b,q);w.set(R.state.pointer.x*2-1,1-R.state.pointer.y*2,.5).unproject(R.camera),g.origin.copy(k),g.direction.copy(w).sub(k).normalize();const I=m0((y.t-1.5)/.5)*T;if(g.intersectPlane(b,S)){const q=Ad(S);s.uPtr.value.set(q.x,q.y,.035*I)}else s.uPtr.value.set(0,0,0);let Q=0;for(let q=0;q<7;q++)Q+=_(_n.FORGE,q,W0[q].h0+eo(Xn[q])*.5,F.front);Q=Q/7*m0(s.uFlood.value/1);let X=0;for(let q=0;q<7;q++)X+=_(_n.OIL,q,W0[q].h0+eo(Xn[q])*.5,F.front);let E=0;for(let q=0;q<7;q++)E+=_(_n.SCALES,q,W0[q].h0+eo(Xn[q])*.5,F.front);this.forge=Q,this.cover=is(s.uFlood.value/3.62),this.oil=X/7*m0(s.uFlood.value/3),this.scales=E/7*m0(s.uFlood.value/1),s.uForgeTag.value=Q>.3?.9:0,t.shardMat.u&&(t.shardMat.u.uRoot.value=Q>.3?0:1),s.uCrestLit.value=1;const N=Math.min(...[1,2,3,4,5,6].map(q=>_(_n.OIL,q,W0[q].h0+eo(Xn[q])*.5,F.front))),$=s.uFlood.value>2.6;x.group.visible=$&&N>.5,P.set(.3,1,.4),x.setLight(P),x.update(F.phase,(y.t<g0?m0((y.t-4.5)/1):1)*I,g,1)}}}const Ht=(t=0,e=0,n=0)=>new C(t,e,n),Ys=Math.PI*2,Fs=8,Hd=t=>t.map(([e,n])=>[e*yt.H,-n*yt.H]).reverse(),Od=[{s:0,k:"bridge",t0:-.05,t1:.56,v:-.015,w:.08,D:9.6,fin:"striped",ends:["sq","snap"],holes:[[.12,"s"],[.42,"b"]],seed:701},{s:0,k:"bridge",t0:.42,t1:1.04,v:.02,w:.072,D:7.7,fin:"striped",ends:["snap","rd"],holes:[[.35,"b"],[.82,"s"]],seed:702},{s:0,k:"lever",t0:.12,t1:.86,v:.072,w:.019,D:6.9,fin:"polished",ends:["rd","rd"],holes:[[.22,"h"]],boss:.22,seed:711},{s:0,k:"spoke",t0:.04,t1:.62,v:-.088,w:.013,D:10.4,fin:"blackened",ends:["sq","snap"],seed:721},{s:0,k:"arbor",t0:.6,t1:.98,v:-.066,D:8.6,seed:731},{s:1,k:"bridge",t0:-.03,t1:.62,v:0,w:.072,D:10.7,fin:"brushed",ends:["rd","snap"],holes:[[.18,"s"],[.5,"b"]],seed:703},{s:1,k:"fork",t0:.4,t1:.97,v:.012,D:8.9,seed:741},{s:1,k:"spoke",t0:.1,t1:.72,v:.066,w:.015,D:7.4,fin:"blackened",ends:["snap","snap"],seed:722},{s:1,k:"frag",t0:.6,t1:1.03,v:-.035,w:.058,D:9.8,fin:"grained",ends:["snap","sq"],holes:[[.5,"h"]],seed:712},{s:2,k:"bridge",t0:-.04,t1:.55,v:.02,w:.07,D:8.4,fin:"polished",ends:["sq","snap"],holes:[[.2,"b"],[.47,"s"]],seed:704},{s:2,k:"bridge",t0:.44,t1:1.03,v:-.015,w:.072,D:10.2,fin:"striped",ends:["snap","rd"],holes:[[.5,"b"],[.85,"s"]],seed:705},{s:2,k:"lever",t0:.08,t1:.88,v:-.066,w:.018,D:7,fin:"polished",ends:["rd","rd"],holes:[[.8,"h"]],boss:.8,seed:713},{s:2,k:"arbor",t0:.26,t1:.8,v:.07,D:9.4,seed:732},{s:3,k:"bridge",t0:-.04,t1:.56,v:-.01,w:.078,D:11.1,fin:"striped",ends:["rd","snap"],holes:[[.18,"s"],[.48,"b"]],seed:706},{s:3,k:"bridge",t0:.46,t1:1.04,v:.02,w:.072,D:8,fin:"grained",ends:["snap","sq"],holes:[[.4,"b"],[.86,"s"]],seed:707},{s:3,k:"arbor",t0:-.03,t1:1.02,v:-.03,D:6.6,seed:733},{s:3,k:"lever",t0:.3,t1:.8,v:-.082,w:.02,D:9.5,fin:"polished",ends:["rd","rd"],holes:[[.72,"h"]],boss:.72,seed:714},{s:3,k:"spoke",t0:.56,t1:1,v:.084,w:.014,D:7.6,fin:"blackened",ends:["snap","sq"],seed:723},{s:4,k:"spoke",t0:.1,t1:.62,v:.01,w:.014,D:10.6,fin:"blackened",ends:["snap","snap"],seed:724},{s:6,k:"lever",t0:.28,t1:.78,v:.1,w:.016,D:8.5,fin:"polished",ends:["rd","snap"],holes:[[.2,"h"]],boss:.2,seed:715}];function Vd(t,e,n,o,s,a,r){const i=et(r*97+3),c=eo(t),l=(t.b[0]-t.a[0])/c,d=(t.b[1]-t.a[1])/c,u=-d,f=l,p=36,v=b=>{const S=e+(n-e)*b;return[t.a[0]+(t.b[0]-t.a[0])*S+u*o,t.a[1]+(t.b[1]-t.a[1])*S+f*o]},h=(b,S,P)=>{const z=v(b);return[z[0]+l*S+u*P,z[1]+d*S+f*P]},m=[],M=[];for(let b=0;b<=p;b++){const S=b/p;m.push(h(S,0,s(S))),M.push(h(S,0,-s(S)))}const x=(b,S,P)=>{const z=[],_=s(b);if(S==="rd")for(let R=1;R<12;R++){const k=Math.PI*R/12;z.push(h(b,-P*Math.sin(k)*_,P*Math.cos(k)*_))}if(S==="snap"){const R=4+Math.floor(i()*4);let k=0;for(let y=1;y<R;y++){k+=(1-k)/(R-y+1)*(.5+i());const A=i()<.55?.15+i()*1.1:-(.02+i()*.35);z.push(h(b,-P*A*_,P*(1-2*Math.min(k,.97))*_))}}return z},g=x(0,a[0],1),w=x(1,a[1],-1);return[m[0],...g,...M,...w,...m.slice().reverse().slice(0,p)]}function qd(t,e,n,o,s,a){const r=et(s*131+7),i=5,c=7,l=Ht(e[0]-t[0],e[1]-t[1],0),d=l.length();l.normalize();const u=Ht(-l.y,l.x,0),f=Ht(0,0,1),p=Array.from({length:i},()=>.7+r()*.5),v=Array.from({length:i},(y,A)=>(A+(r()-.5)*.5)/i*Ys),h=[],m=r()*.3,M=r()*.3;for(let y=0;y<=c;y++){const A=y/c,F=Math.pow(Math.min(1,A/.3,(1-A)/.38),.9)*(.8+r()*.4),T=Ht(t[0],t[1],0).addScaledVector(l,A*d).addScaledVector(u,(r()-.5)*n*.25);h.push(v.map((I,Q)=>T.clone().addScaledVector(u,Math.cos(I)*n*p[Q]*F).addScaledVector(f,Math.sin(I)*o*p[Q]*F)))}h[0]=h[0].map(()=>Ht(t[0],t[1],0).addScaledVector(u,(m-.15)*n)),h[c]=h[c].map(()=>Ht(e[0],e[1],0).addScaledVector(u,(M-.15)*n));const x=[],g=[],w=[],b=[],S=[],P=[],z=.75+r()*.5,_=r()*10,R=(y,A)=>{x.push(y.x,y.y,y.z),g.push(A),w.push(y.clone().sub(Ht(t[0],t[1],0)).dot(u)/n),b.push(a),S.push(l.x,l.y,z,_),P.push(t[0],t[1],d,n)};for(let y=0;y<c;y++)for(let A=0;A<i;A++){const F=(A+1)%i,T=h[y][A],I=h[y][F],Q=h[y+1][A],X=h[y+1][F],E=y/c,N=(y+1)/c;y<c-1&&(R(T,E),R(X,N),R(Q,N)),y>0&&(R(T,E),R(I,E),R(X,N))}const k=new In;return k.setAttribute("position",new rt(x,3)),k.setAttribute("aA",new rt(g,1)),k.setAttribute("aC",new rt(w,1)),k.setAttribute("aTag",new rt(b,1)),k.setAttribute("aAx",new rt(S,4)),k.setAttribute("aOr",new rt(P,4)),k.computeVertexNormals(),k}function Gd(){const t={uGlow:{value:1},uRoot:{value:1},uT:{value:0}},e=new Gn({color:new Gt().setRGB(.012,6e-4,8e-4),roughness:.06,metalness:0,clearcoat:.35,clearcoatRoughness:.04,envMapIntensity:.22,ior:1.76,flatShading:!0});return e.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
gl_FragColor.a = 1.0 + clamp(vTag * uRoot * inner * 0.8, 0.0, 1.0);`)},Object.assign(e,{u:t})}function Ud(t){const e=t.kit.q,n=z0(e),o=e==="low",s=new gt,a={value:new ln(0,1,0,0)},r={value:new ln(0,0,0,0)},i=L=>{const J=L.material,ue=J.onBeforeCompile,ve=J.customProgramCacheKey.bind(J);return J.onBeforeCompile=(pe,fe)=>{ue.call(J,pe,fe),pe.uniforms.uKR=r,pe.fragmentShader=pe.fragmentShader.replace("#include <common>",`#include <common>
uniform vec4 uKR;`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
{ vec3 kd = uKR.xyz + vViewPosition; float kr = length(kd); totalEmissiveRadiance += vec3(1.0, 0.0, 0.015) * uKR.w * (0.25 + 0.75 * max(dot(normal, kd / kr), 0.0)) / (1.0 + kr * kr / 2.5); }`)},J.customProgramCacheKey=()=>ve()+"-kr",L},c=(L,J)=>{const ue=new je(L,an({tier:e,rim:a,...J}));return ue.castShadow=!o,ue.receiveShadow=!o,ue},l=[],d=(L,J)=>{L.updateMatrix();const ue=Ht().setFromMatrixPosition(L.matrix);l.push({obj:L,base:L.matrix.clone(),c:ue,notch:J}),L.matrixAutoUpdate=!1,s.add(L)},u=b0({size:"medium",detail:n,seed:3});u.computeBoundingBox();const f=u.boundingBox,p=f.max.y,v=(f.max.x-f.min.x)/2,h=[],m=[],M=L=>new se().makeBasis(Ht(1,0,0),Ht(0,0,1),Ht(0,-1,0)).multiply(new se().makeScale(1/yt.H,1/yt.H,1/yt.H)).multiply(new se().makeTranslation(0,-L/2,0)),x=L=>[L[0]*yt.H,-L[1]*yt.H],g=L=>{const J=eo(L),ue=(L.b[0]-L.a[0])/J,ve=(L.b[1]-L.a[1])/J;return{L:J,dx:ue,dy:ve,nx:-ve,ny:ue}};for(const L of Od){const J=Xn[L.s],ue=g(J),ve=et(L.seed),pe=(Se,He=L.v)=>[J.a[0]+(J.b[0]-J.a[0])*Se+ue.nx*He,J.a[1]+(J.b[1]-J.a[1])*Se+ue.ny*He];let fe,Le=L.fin??"turned",Fe=.3,De=.5;if(L.k==="arbor"){const Se=(L.t1-L.t0)*ue.L;fe=ha({length:Se,ra:.014,leaves:8,pinionR:.034,pinionH:Se*.16,pinionAt:Se*(.2+.3*ve()),detail:n,seed:L.seed}).geo;const ot=pe(L.t0);fe.applyMatrix4(new se().makeBasis(Ht(ue.dy,-ue.dx,0),Ht(ue.dx,ue.dy,0),Ht(0,0,1)).setPosition(ot[0],ot[1],-.02)),Le="turned",Fe=.5,De=.55}else if(L.k==="fork"){const Se=(L.t1-L.t0)*ue.L,He=Se/4.4;fe=rr({detail:n,seed:L.seed,stone:!1}).pieces[0].geo.clone();const ke=pe(L.t0);fe.applyMatrix4(new se().makeTranslation(.2,-.13,0)).applyMatrix4(new se().makeScale(He,He,He)).applyMatrix4(new se().makeBasis(Ht(ue.dx,ue.dy,0),Ht(0,0,1),Ht(ue.dy,-ue.dx,0)).setPosition(ke[0],ke[1],0)),Le="brushed",Fe=.35,De=.55}else{const Se=L.w,He=(L.holes??[]).filter(K=>K[1]==="b").map(K=>K[0]),ot=K=>{let oe=L.k==="bridge"?1.08-.16*K:L.k==="frag"?.9+.2*Math.sin(K*5+L.seed):1;for(const de of He)oe+=.32*Math.exp(-(((K-de)/.07)**2));return L.boss!==void 0&&(oe+=1.7*Math.exp(-(((K-L.boss)/.055)**2))),Se*oe},ke=Vd(J,L.t0,L.t1,L.v,ot,L.ends??["sq","sq"],L.seed),be=(L.holes??[]).map(([K,oe])=>{const de=oe==="s"?.34*Se:oe==="b"?.17*Se:L.boss!==void 0?.5*Se:.36*Se;return{at:x(pe(L.t0+(L.t1-L.t0)*K)),r:de*yt.H,bush:oe==="b",sink:oe==="s"?de*yt.H*.35:void 0}}),Z=L.k==="bridge"?.072:L.k==="frag"?.06:L.k==="lever"?.046:.034,G=mo({outline:ke.map(x).reverse(),holes:be,t:Z,bevel:L.k==="spoke"?.008:.018,detail:n,round:0});fe=G.bushes?b1([G.geo,G.bushes]):G.geo,fe.applyMatrix4(M(Z));for(const[K,oe]of L.holes??[]){if(oe!=="s")continue;const de=pe(L.t0+(L.t1-L.t0)*K),Ce=.34*Se*1.02/v,We=new se().makeRotationY(ve()*Ys).premultiply(new se().makeBasis(Ht(1,0,0),Ht(0,0,1),Ht(0,-1,0))).premultiply(new se().makeScale(Ce,Ce,Ce)).setPosition(de[0],de[1],.006-p*Ce);h.push(Io(L.D).multiply(We))}Fe=L.k==="lever"?.45:L.k==="spoke"?.3:.22,De=L.k==="spoke"?.35:L.k==="lever"?.6:.42}const Ue=c(fe,{finish:Le,seed:L.seed,age:L.k==="frag"?.55:Le==="polished"?.08:.25,tone:De,direct:Fe,objScale:.14,envMap:1.1,wear:.3});Ue.position.set(0,0,0),Ue.matrix.copy(Io(L.D)),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),L.s>=3&&i(Ue),d(Ue,(L.seed%2?1:-1)*(.03+.03*ve())),m.push({geo:fe,D:L.D,s:L.s})}const w=new gn(u,an({finish:"polished",seed:709,tier:e,age:.3,tone:.75,objScale:.08,rim:a}),h.length);h.forEach((L,J)=>w.setMatrixAt(J,L)),w.castShadow=!o,s.add(w);const b=Gd(),S=[],P=[[4,-.04,.5,.015,8.9,.76],[4,.26,.64,-.035,7.6,.4],[4,.44,.9,.03,10.4,.62],[4,.68,1.04,-.02,8.2,.56],[4,.05,.55,-.06,10.9,.22],[4,.5,.97,.06,7.2,.2],[5,0,.5,0,9.3,.7],[5,.38,.8,.03,7.9,.46],[5,.6,1.04,-.015,10.2,.5],[5,.15,.6,-.06,11.2,.24],[5,.74,1,.058,8.6,.24],[6,-.02,.5,0,8.1,.58],[6,.36,.82,-.03,10.1,.5],[6,.64,1.04,.02,8.8,.48],[6,.12,.55,.062,9.6,.22],[6,.5,.95,-.065,7.3,.2]],z=Ht();P.forEach(([L,J,ue,ve,pe,fe],Le)=>{const Fe=Xn[L],De=Fe.b[0]-Fe.a[0],Ue=Fe.b[1]-Fe.a[1],Se=Math.hypot(De,Ue),He=-Ue/Se,ot=De/Se,ke=oe=>[Fe.a[0]+De*oe+He*ve,Fe.a[1]+Ue*oe+ot*ve],be=Le===6?1:0,Z=qd(ke(J),ke(ue),Fe.hw*fe*1,Fe.hw*(.2+.25*fe),900+Le,be),G=new je(Z,b);G.matrixAutoUpdate=!1,G.castShadow=!o;const K=Io(pe);G.matrix.copy(K),s.add(G),m.push({geo:Z,D:pe,s:L}),S.push({mesh:G,end:K,spin:Ht(Math.sin(Le*2.1),Math.cos(Le*1.3),Math.sin(Le*.7+1)).normalize(),seed:Le}),be&&z.copy(Ht(...ke(J+(ue-J)*.2),0).applyMatrix4(K))});const _=[];for(const[L,J,ue]of _){const ve=Xn[L],pe=ve.b[0]-ve.a[0],fe=ve.b[1]-ve.a[1],Le=Math.hypot(pe,fe),Fe=[ve.a[0]+pe*J,ve.a[1]+fe*J],De=-fe/Le,Ue=pe/Le,Se=pe/Le,He=fe/Le,ot=ve.hw*1.35,ke=.045,be=[[Fe[0]+De*ot-Se*ke,Fe[1]+Ue*ot-He*ke],[Fe[0]-De*ot-Se*ke,Fe[1]-Ue*ot-He*ke],[Fe[0]-De*ot+Se*ke,Fe[1]-Ue*ot+He*ke],[Fe[0]+De*ot+Se*ke,Fe[1]+Ue*ot+He*ke]],Z=mo({outline:Hd(be),holes:[],t:.05,bevel:.015,detail:n,round:1}).geo,G=new se().makeBasis(Ht(1,0,0),Ht(0,0,1),Ht(0,-1,0)).premultiply(new se().makeScale(1/yt.H,1/yt.H,1/yt.H));Z.applyMatrix4(new se().makeTranslation(0,-.01,0));const K=c(Z,{finish:"striped",seed:760+L*3,age:.5,tone:.28,objScale:.1,direct:.35});K.matrix.copy(Io(ue).multiply(G)),K.matrix.decompose(K.position,K.quaternion,K.scale),d(K,.07)}const R=et(7707);[[-1.75,.62,13,.42,60],[1.7,-.7,15,.55,72],[1.55,.78,9,.2,40],[-1.55,-.78,10,.26,48],[.12,-1.05,17,.5,80],[-.4,1.1,16,.38,64]].forEach(([L,J,ue,ve,pe],fe)=>{const Le=$o({teeth:pe,r:ve*yt.H,t:ve*yt.H*.08,profile:"train",spokes:5,detail:n,seed:720+fe}),Fe=c(Le,{finish:"sunray",seed:720+fe,age:.6,tone:.3,direct:.25,objScale:.14,envMap:.6}),De=1/yt.H,Ue=new se().makeRotationFromEuler(new Nn(1.15+fe%2*.2,fe*.8,.25+.2*fe)),Se=new se().makeScale(De,De,De).premultiply(Ue).setPosition(L,J,0);Fe.matrix.copy(Io(ue).multiply(Se)),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),d(Fe,Ys/pe)});const y=o?40:110,A=new gn(b0({size:"small",detail:Math.min(n,1),seed:9}),an({finish:"blackened",seed:731,tier:e,age:.6,tone:.35,objScale:.1,rim:a}),y);for(let L=0;L<y;L++){const J=L%3===0?-1:1,ue=Math.pow(R(),.7),ve=J>0?.9+ue*1.1+(R()-.5)*.3:-1.25-ue*.7+(R()-.5)*.3,pe=J>0?.35+ue*.45+(R()-.5)*.5:-.2-ue*.5+(R()-.5)*.6,fe=6+R()*12,Le=(.05+R()*.05)*(fe/10),Fe=new se().makeRotationFromEuler(new Nn(R()*6,R()*6,R()*6)).premultiply(new se().makeScale(Le*3,Le*3,Le*3));Fe.setPosition(ve,pe,0);const De=Io(fe).multiply(Fe);A.setMatrixAt(L,De)}A.castShadow=!o,s.add(A);const F={uGain:{value:.07}},T=new je(new no(1,1),new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:F,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; varying vec2 vUv;
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
}`}));T.matrixAutoUpdate=!1,T.frustumCulled=!1,T.renderOrder=4,T.matrix.copy(Io(26).multiply(new se().makeScale(7.5,7.5,1))),s.add(T);const I={uGain:{value:0},uT:{value:0},uS:{value:new bt(1,1)},uM:{value:0},uWide:{value:1},uOil:{value:0},uSc:{value:0}},Q=new je(new no(1,1),new un({transparent:!0,depthWrite:!1,blending:An,blendSrc:dt,blendDst:dt,blendSrcAlpha:to,blendDstAlpha:dt,uniforms:I,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; uniform vec2 uS; uniform float uM; uniform float uWide; uniform float uOil; uniform float uSc; varying vec2 vUv;
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
}`}));Q.matrixAutoUpdate=!1,Q.frustumCulled=!1,Q.renderOrder=5,Q.matrix.copy(Io(15).multiply(new se().makeTranslation(0,.05,0)).multiply(new se().makeScale(3.2,1.7,1))),s.add(Q);const X=Q.matrix.clone(),E=new se,N=new C,$=Bd({q:e,coat:m,group:s,shardMat:b,shards:S.map(L=>L.mesh)}),q=Ht(),D=new se,V=new Wt,O=Ht(),j=Ht(),ae=Ht(),ye=new Wt,_e=Ht();return{group:s,update(L){const J=L.i===Fs,ue=L.i===Fs+1&&!L.inHold;if(s.visible=J||ue,!s.visible)return;L.camera.getWorldPosition(j),O.copy(Ge.bladeDir).negate().transformDirection(L.camera.matrixWorldInverse),a.value.set(O.x,O.y,O.z,.9);const ve=J&&!L.inHold?L.u:1,pe=ve>=.04?1:0;for(const Se of l){if(Se.obj.visible=L.inHold||L.i!==Fs||Se.c.distanceToSquared(j)>2.6,pe){Se.obj.matrix.copy(Se.base);continue}V.setFromAxisAngle(yt.F,-Se.notch),D.makeTranslation(-Se.c.x,-Se.c.y,-Se.c.z).premultiply(new se().makeRotationFromQuaternion(V)).premultiply(new se().makeTranslation(Se.c.x,Se.c.y,Se.c.z)),Se.obj.matrix.copy(Se.base).premultiply(D)}on.ready?q.copy(on.stoneWorld):q.copy(yt.L);const fe=pe?1-Math.pow(1-Math.min(1,(ve-.04)/.62),3):0;for(const Se of S){if(Se.mesh.visible=pe===1,fe>=1){Se.mesh.matrix.copy(Se.end);continue}Se.end.decompose(ae,ye,_e);const He=q.clone().lerp(ae,fe),ot=new Wt().setFromAxisAngle(Se.spin,(1-fe)*(2.5+Se.seed*.3));Se.mesh.matrix.compose(He,ot.multiply(ye),_e.clone().multiplyScalar(.25+.75*fe))}b.u.uGlow.value=pe?(.6+.4*fe)*1.3:0,$.update(L,j);const Le=$.cover,Fe=L.camera.aspect<1?1.45:1,De=Math.min(1,Math.max(0,(ve-.35)/.65)),Ue=De*De*(3-2*De);if(r.value.set(0,0,0,0),pe){const Se=z.clone().applyMatrix4(s.matrixWorld).applyMatrix4(L.camera.matrixWorldInverse);r.value.set(Se.x,Se.y,Se.z,.03*fe)}I.uGain.value=pe?.31*(.68+.32*fe)*Math.min(1,ve/.06)*(1.04-.04*Ue)*(.97+.1*Le)*(Fe>1?.9-.1*Le:1)*(1-.3*$.forge):0,I.uM.value=Le,I.uOil.value=$.oil,I.uSc.value=$.scales,F.uGain.value=.062*(1-.1*Le)*(Fe>1?1.07+.25*Le:1),I.uWide.value=Fe>1?2.05-.2*Le:1.22,I.uS.value.set(1+.08*Le,(1+.15*Le)*Fe),Q.matrix.copy(X).multiply(E.makeScale(I.uS.value.x,I.uS.value.y,1)),N.copy(j).sub(yt.E).multiplyScalar(1-15/7.6),Q.matrix.premultiply(E.makeTranslation(N.x,N.y,N.z))}}}const _s=Ri+1.6;function jd(t){const{kit:e}=t,n=new gt,o=et(88),s=e.q==="low"?500:1100,a=new gn(new i0(1,1,1,2,1,2),e.stone,s),r=new se,i=new Wt,c=new Nn,l=new C,d=new C;let u=0;const f=15;for(let S=-ta;S<ta&&u<s;S+=f)for(let P=-ta;P<ta&&u<s;P+=f*.75){const z=Math.round(P/(f*.75)),_=S+(z%2?f/2:0)+(o()-.5)*2,R=P+(o()-.5)*1.5;if(Math.hypot(_,R)>ta)continue;const k=Math.hypot(_,R),y=k<Ca?2.4*(1-k/Ca):0;c.set((o()-.5)*.06,(o()-.5)*.2,(o()-.5)*.06),i.setFromEuler(c),l.set(_,Ri-2.4-y+o()*.4,R),d.set(f*.9,4,f*.66),r.compose(l,i,d),a.setMatrixAt(u++,r)}a.count=u,a.receiveShadow=!0,n.add(a);let p;e.q==="low"?p=new je(new j0(Ca,64),e.oil):p=new S0(new j0(Ca,64),{textureWidth:e.q==="high"?1024:640,textureHeight:e.q==="high"?1024:640,color:4868166,clipBias:.003}),p.rotation.x=-Math.PI/2,p.position.y=_s,n.add(p);const v=e.q==="low"?500:1200,h=220,m=new gn(new i0(.12,1,.12),new Pn({color:3815736,transparent:!0,opacity:.5,depthWrite:!1}),v);m.frustumCulled=!1;const M=Array.from({length:v},()=>[(o()-.5)*2*160,o()*h,(o()-.5)*2*160,.6+o()*.8]);n.add(m);const x=new je(new Ga(.9,1,64),new Pn({color:3815478,transparent:!0,opacity:.5,depthWrite:!1}));x.rotation.x=-Math.PI/2,n.add(x);const g=new gt,w=new ls;w.moveTo(-.02,-3),w.lineTo(-.05,0),w.lineTo(-.012,9),w.lineTo(.012,9),w.lineTo(.05,0),w.lineTo(.02,-3);const b=new je(new Pi(w),e.blood);return b.position.set(0,-2.6,-1),g.add(b),new ga,{group:n,update(S){const P=S.i<=3||S.i===9;n.visible=P,g.parent!==S.camera&&S.camera.add(g);const z=S.shot.wipe;if(g.visible=z>.08&&z<.78,g.visible){const y=(z-.08)/.7;b.rotation.z=1.25-y*2.6,b.scale.setScalar(1.4)}if(!P)return;const _=S.i===9,R=S.state.time;for(let y=0;y<v;y++){const[A,F,T,I]=M[y],Q=_?((F-R*140*I)%h+h)%h:F;l.set(A,_s+Q,T),d.set(_?1:2.2,_?9*I:3,_?1:2.2),r.compose(l,i.identity(),d),m.setMatrixAt(y,r)}m.instanceMatrix.needsUpdate=!0;const k=S.trick("8");if(x.visible=k.k>0,x.visible){const y=k.phase*5%1;x.position.set((S.state.pointer.x-.5)*90,_s+.05,(S.state.pointer.y-.5)*70+20),x.scale.setScalar(2+y*26),x.material.opacity=.5*(1-y)*k.k}}}}function $d(t){const e=C1(t),n=Yu(t),o=[jd(t),n,e,_1(t,e),G1(t),id(t),kd(t),Pd(t),Ud(t),t1(t,n,e)],s=new gt;for(const i of o)s.add(i.group);t.scene.add(s);let a=[],r=null;return{root:s,update(i){for(const c of a)c.group.visible=!0;a=[],o.forEach((c,l)=>{l===0&&i.i===9||c.update(i)}),i.i===9&&o.forEach((c,l)=>{(!i.inHold&&i.u<ko.cut?l!==8:l===0||l>=3&&l<=8)&&c.group.visible&&(c.group.visible=!1,a.push(c))}),i.i===6&&(o[7].group.visible=!1,i.inHold&&o.forEach((c,l)=>{l!==6&&c.group.visible&&(c.group.visible=!1,a.push(c))})),(i.i===2&&(i.inHold||i.u>=.7)||i.i===3&&!i.inHold&&i.u<.3)&&(n.air.visible=!1),i.i<=3&&o[0].group.visible&&(o[0].group.visible=!1,a.push(o[0])),i.i<=1&&o[3].group.visible&&(o[3].group.visible=!1,a.push(o[3])),i.i===7&&(i.inHold||i.u>.8)&&o.forEach((c,l)=>{l!==7&&(l!==6||i.inHold||i.u>.9)&&c.group.visible&&(c.group.visible=!1,a.push(c))}),(i.i===8||i.i===9&&!i.inHold)&&(r||o[7].group.traverse(c=>{!r&&c.material&&"ss"in c.material&&(r=c)}),r&&r.visible&&(i.i===9||i.inHold||i.u>=.04)&&(r.visible=!1,a.push({group:r,update(){}})),i.i===8&&(i.inHold||i.u>.2)&&o.forEach((c,l)=>{l!==8&&c.group.visible&&(c.group.visible=!1,a.push(c))})),(i.i===4||i.i===5)&&(i.inHold||i.i===5&&i.u>.55)&&o.forEach((c,l)=>{l!==i.i&&c.group.visible&&(c.group.visible=!1,a.push(c))})}}}const Bo=(()=>{const t=new URLSearchParams(location.search).get("cam")?.split(",").map(Number);return t&&t.length>=6&&t.every(Number.isFinite)?t:null})(),Vo=(t,e,n)=>t+(e-t)*n,Is=(t,e,n)=>[Vo(t[0],e[0],n),Vo(t[1],e[1],n),Vo(t[2],e[2],n)];function Yd(t,e,n){return{blade:{from:Is(t.blade.from,e.blade.from,n),to:Is(t.blade.to,e.blade.to,n),angle:Vo(t.blade.angle,e.blade.angle,n),power:Vo(t.blade.power,e.blade.power,n),pen:Vo(t.blade.pen??.55,e.blade.pen??.55,n)},red:{at:Is(t.red.at,e.red.at,n),power:Vo(t.red.power,e.red.power,n),reach:Vo(t.red.reach,e.red.reach,n)},haze:Vo(t.haze,e.haze,n),env:n<.5?t.env:e.env}}function Kd(t,e){const n=e.quality,o=new Lc({canvas:t,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});o.outputColorSpace=Ec,o.toneMapping=Dc,o.shadowMap.enabled=n!=="low"&&!0,o.shadowMap.type=Wc,o.shadowMap.autoUpdate=!0,o.info.autoReset=!1,o.setClearColor(0,1);const s=new za;s.background=new Gt(0);const a=new Qs(30,1,.01,2e3);s.add(a);const r=y1(n),i=h1(o,s,n),c=$d({kit:r,renderer:o,scene:s,lang:e.lang}),l=u1(o,n),d=matchMedia("(pointer: coarse)").matches,u=n==="high"?66e5:n==="mid"?42e5:17e5,f=n==="high"?1.5:n==="mid"?1.25:d?2:1.25;let p=1,v=1,h=1,m="";function M(){m="";const E=t.clientWidth||innerWidth,N=t.clientHeight||innerHeight;h=Math.min(f,devicePixelRatio||1,Math.sqrt(u/Math.max(1,E*N))),o.setPixelRatio(h),o.setSize(E,N,!1),p=Math.round(E*h),v=Math.round(N*h),l.setSize(p,v),a.aspect=E/N,a.updateProjectionMatrix()}M();let x=0,g=!1;t.addEventListener("webglcontextlost",E=>{E.preventDefault(),g=!0,e.onLost?.()}),t.addEventListener("webglcontextrestored",()=>{g=!1,e.onRestored?.(),M(),n1()});const w=Te.map(E=>E.id),b={1:[.775,.825],2:[.088,.103],5:[.115,.165],7:[.17,.23]},S=.06,P=.08,z=w.indexOf("3"),_=.35,R=E=>w.indexOf(E);function k(E,N){const $=H0(E.p);return{state:E,i:$.i,inHold:$.inHold,u:$.u,shot:N,camera:a,local:q=>{const D=Te[R(q)];return vt((E.p-D.a0)/(D.h1-D.a0))},hold:q=>{const D=Te[R(q)];return vt((E.p-D.h0)/(D.h1-D.h0))},trick:q=>{const D=R(q);return jr(E.stop,D,$.i===D&&$.inHold,E.reduced)}}}function y(E,N,$){const q=a.aspect<1,D=Qc(a,N,E,q),V=H0(E.p),O=Te[V.i],j=$?$.light:V.inHold||V.i===0||E.reduced?O.light:Yd(Te[V.i-1].light,O.light,ie(vt((V.u-(O.lightFrom??0))/((O.lightIn??1)-(O.lightFrom??0))))),ae=E.stop,ye=ae.station===V.i;let _e=ye?ie((ae.t-(O.stopDelay??0))/1)*(ae.rel>0?1-ie(ae.rel/O.trick.release):1):0;ye&&ae.rel>0&&(_e=1-Math.pow(1-_e,O.returnPow??1));let L=1,J=1;const ue=jr(ae,0,V.i===0,E.reduced);if(ue.k>0&&(J*=1+Math.sin(ue.phase*Math.PI*2)*.25*ue.k),V.i===0){const ke=ie(vt(E.p/Math.max(1e-6,O.h1)*1.25));J*=.25+.75*ke,L*=.5+.5*ke}i.apply(j,O.stop,_e,{bladeMul:L,angleMul:J,seed:E.time,cam:a.position}),Ge.bladeFrom.copy(i.blade.position),Ge.bladeDir.copy(i.blade.target.position).sub(i.blade.position).normalize(),Ge.bladeCos=Math.cos(i.blade.angle),Ge.bladePower=i.blade.intensity*.015,Ge.time=E.time;const ve=E.reduced?-1:w1(ae);if(ve>=0){const ke=new C(...j.red.at),be=ke.distanceTo(a.position)*1.7+4;Zn.centre.value.copy(ke),Zn.radius.value=ve*be,Zn.width.value=be*(O.pulseWidth??.14),Zn.gain.value=Math.sin(ve*Math.PI)*.9*(O.pulseGain??1),Ge.pulseC.copy(ke),Ge.pulseR=ve*be,Ge.pulseW=be*.045,Ge.pulseG=Math.sin(ve*Math.PI)*(O.pulseGain??1)}else Zn.radius.value=-1,Zn.gain.value=0,Ge.pulseR=-1,Ge.pulseG=0;c.update(k(E,N));const pe=N.mm,fe=(V.i>0?Te[V.i-1].sharp:null)??[1,1],Le=O.sharp??[1,1],Fe=ie(V.u),De=V.inHold||E.reduced?Le:[fe[0]+(Le[0]-fe[0])*Fe,fe[1]+(Le[1]-fe[1])*Fe],Ue=V.i>0&&!E.reduced?Te[V.i-1]:null,Se=Ue?.blurMul??1,He=Ue?.aperture??1;return{focus:D,focusN:D*De[0],focusF:D*De[1],blurMul:V.inHold?O.blurMul??1:Se+((O.blurMul??1)-Se)*ie(V.u),aperture:(4+pe*.09)*(V.inHold?O.aperture??1:He+((O.aperture??1)-He)*ie(V.u)),exposure:$?$.exposure:Xd(V),neutral:V.inHold||V.i===0?O.neutral??0:(Te[V.i-1].neutral??0)+((O.neutral??0)-(Te[V.i-1].neutral??0))*ie(V.u/(O.exposureIn??1)),bloom:1,grain:.025,seed:E.reduced?0:E.time*60%997,vig:.85,cover:Math.max(N.cover,x),fade:0,rim:O.rim??0}}function A(E,N){if(E===m)return;const $=y(N,na(N));l.drawScene(s,a),l.finish(a,$,l.fadeTarget),m=E}function F(E){if(g)return;o.info.reset(),Z0.value=v;const N=H0(E.p);if(E.reduced&&!N.inHold&&N.i>0&&N.u<.999){if(m!==`rm:${N.i}`){const ue={...E,p:(Te[N.i-1].h0+Te[N.i-1].h1)/2},ve=y(ue,Wo(N.i-1,.5));l.drawScene(s,a),l.finish(a,ve,l.fadeTarget),m=`rm:${N.i}`}const L={...E,p:(Te[N.i].h0+Te[N.i].h1)/2},J=y(L,Wo(N.i,.5));l.drawScene(s,a),l.finish(a,{...J,fade:1-ie(N.u)},null);return}const $=Te.length-1;if(!E.reduced&&N.i===$&&!N.inHold&&N.u>=ko.cut&&N.u<ko.trail[1]+.01){const L=Te[$],J=Te[$-1],ue=Xc(N.u);rs.v=N.u;const ve={...E,p:L.a0+(L.h0-L.a0)*ko.cut*.5},pe=y(ve,ue.a,{light:J.light,exposure:J.exposure??1});l.drawScene(s,a),l.finish(a,pe,l.fadeTarget),m="";const fe=y(E,ue.b,{light:L.light,exposure:L.exposure??1});l.drawScene(s,a),l.finish(a,{...fe,fade:1,sweep:N.u<ko.trail[0]?-9:Ns(N.u,ko.trail)},null),rs.v=-1;return}const q=!E.reduced&&!N.inHold?b[Te[N.i].id]:void 0;if(q&&N.u>q[0]&&N.u<q[1]){const L=Te[N.i],J=pe=>L.a0+(L.h0-L.a0)*pe,ue={...E,p:J(q[1])};A(`gap:${N.i}`,{...E,p:J(q[0])});const ve=y(ue,na(ue));l.drawScene(s,a),l.finish(a,{...ve,fade:1-ie((N.u-q[0])/(q[1]-q[0]))},null);return}const D=Te[$],V=Bn.rare+.69*D.trick.rare;if(!E.reduced&&N.i===$&&N.inHold&&E.stop.station===$&&E.stop.rare&&D.trick.rare>0&&E.stop.t>=V&&E.stop.t<V+_){A("land",{...E,stop:{...E.stop,t:V-1e-4}});const L=y(E,na(E));l.drawScene(s,a),l.finish(a,{...L,fade:1-ie((E.stop.t-V)/_)},null);return}const O=Te[N.i],j=!N.inHold&&N.i>0&&N.i!==$&&N.u<S,ae=N.inHold&&N.i===z&&N.u<P;if(!E.reduced&&!Bo&&(j||ae)){A(`${j?"arr":"hst"}:${N.i}`,{...E,p:(j?O.a0:O.h0)-1e-7});const L=y(E,na(E));l.drawScene(s,a),l.finish(a,{...L,fade:1-ie(N.u/(j?S:P))},null);return}const ye=na(E);Bo&&(ye.pos.set(Bo[0],Bo[1],Bo[2]),ye.look.set(Bo[3],Bo[4],Bo[5]),ye.mm=Bo[6]||ye.mm);const _e=y(E,ye);l.drawScene(s,a),l.finish(a,_e,null)}function T(){return{calls:o.info.render.calls,triangles:o.info.render.triangles,w:p,h:v,dpr:h}}const I=o.getContext(),Q=new Uint8Array(4);function X(E,N){const $=[];for(let D=0;D<N;D++){const V=performance.now();F({...E,time:E.time+D/60}),I.readPixels(0,0,1,1,I.RGBA,I.UNSIGNED_BYTE,Q),$.push(performance.now()-V)}return $.sort((D,V)=>D-V),{avg:$.reduce((D,V)=>D+V,0)/N,worst:$[N-1],p95:$[Math.floor(N*.95)],calls:o.info.render.calls}}return{render:F,resize:M,info:T,bench:X,renderer:o,ix:R,setVeil(E){x=vt(E)}}}function Xd(t){const e=Te[t.i].exposure??1,n=Te[t.i-1]?.exposure??1,o=Fi(t.i,t.u,t.inHold);return(t.inHold?e:n+(e-n)*ie(t.u/(Te[t.i].exposureIn??1)))*o}function Zd(){const t=document.createElement("div");t.className="ss-hud",t.setAttribute("aria-hidden","true"),document.body.appendChild(t);let e=0;return{update(n,o,s){if(e++%6)return;const a=H0(n.p),r=Te[a.i];t.textContent=[`p ${n.p.toFixed(4)}  ${r.id} ${a.inHold?"hold":"approach"} ${a.u.toFixed(2)}`,`stop ${n.stop.station>=0?Te[n.stop.station].id:"-"}  ${g1(n.stop)}  t ${n.stop.t.toFixed(2)}`,`tier ${n.quality}${n.reduced?" reduced":""}  ${s.toFixed(1)} ms  calls ${o.calls}  ${o.w}x${o.h}@${o.dpr.toFixed(2)}`].join(`
`)}}}const mr=document.documentElement,Uo=new URLSearchParams(location.search),I0=(t,e)=>{const n=parseFloat(Uo.get(t)??"");return Number.isFinite(n)?n:e},Ks=mr.lang==="ar"?"ar":"en",di=matchMedia("(pointer: coarse)").matches,Qd=Math.min(screen.width,screen.height)<520,pi=navigator.hardwareConcurrency||4,qa=Uo.get("q"),Xs=qa==="high"||qa==="mid"||qa==="low"?qa:di&&Qd||pi<=4?"low":pi>=8&&!di?"high":"mid",Zs=Uo.get("rm")==="1"||Uo.get("rm")!=="0"&&matchMedia("(prefers-reduced-motion: reduce)").matches,Jd=Uo.has("still");function ts(){mr.classList.add("ss-static"),window.__secondReady=!0}function ep(){try{const t=document.createElement("canvas").getContext("webgl2");if(!t)return!1;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("WEBGL_lose_context")?.loseContext(),e}catch{return!1}}function Ls(t){const e=t.time??0,n=t.stopAt!==void 0&&t.stopAt>=0?{station:t.stopAt,t:t.st??e,rare:!0,rel:t.rel??0}:Jc();return{p:t.p??0,time:e,stop:n,pointer:t.pointer??{x:.5,y:.5},lang:Ks,quality:Xs,reduced:t.reduced??Zs,speed:0}}async function tp(){const t=document.getElementById("ss-canvas");if(!t||!ep()||Uo.get("static")==="1"){ts();return}let e;try{e=Kd(t,{quality:Xs,lang:Ks,onLost:ts,onRestored:()=>mr.classList.remove("ss-static")})}catch{ts();return}window.__secondRender=P=>e.render(Ls(P)),window.__secondBench=(P,z)=>e.bench(Ls(P),z),window.__secondInfo=()=>e.info();const n=Uo.get("hud")==="1"?Zd():null;if(Jd){const P=Uo.get("stop"),z=P===null?-1:Te.findIndex(R=>R.id===P);await Promise.race([Promise.all(window.__secondWait??[]),new Promise(R=>setTimeout(R,6e3))]);const _=Ls({p:I0("p",0),time:I0("time",0),stopAt:z,st:Uo.has("st")?I0("st",0):void 0,rel:I0("rel",0),pointer:{x:I0("px",.5),y:I0("py",.5)}});await Promise.race([Promise.all(globalThis.__secondWait??[]),new Promise(R=>setTimeout(R,6e3))]),e.render(_),requestAnimationFrame(()=>{e.render(_),requestAnimationFrame(()=>{e.render(_),requestAnimationFrame(()=>{window.__secondReady=!0})})}),n?.update(_,e.info(),0);return}let o=null;if(!Zs){const{default:P}=await mc(async()=>{const{default:z}=await import("./lenis.BxbUXgKI.js");return{default:z}},[]);o=new P({lerp:.085,wheelMultiplier:.85,touchMultiplier:1.2,autoRaf:!1})}const s=x1(),a={x:.5,y:.5},r={x:.5,y:.5};let i=!1,c=-1;const l=()=>t.clientWidth||innerWidth,d=()=>t.clientHeight||innerHeight;addEventListener("pointermove",P=>{P.pointerType==="mouse"&&(r.x=P.clientX/l(),r.y=P.clientY/d())},{passive:!0}),document.addEventListener("pointerleave",()=>{r.x=.5,r.y=.5}),addEventListener("touchstart",P=>{const z=P.touches[0];z&&(r.x=z.clientX/l(),r.y=z.clientY/d())},{passive:!0}),addEventListener("touchmove",()=>{i=!0,c=performance.now()},{passive:!0}),addEventListener("touchend",()=>{i=!1},{passive:!0});let u=0;const f=()=>{clearTimeout(u),u=window.setTimeout(()=>e.resize(),120)};addEventListener("resize",f,{passive:!0}),visualViewport?.addEventListener("resize",f,{passive:!0});const p=globalThis.__secondWait??[];let v=!1,h=0;Promise.race([Promise.all(p),new Promise(P=>setTimeout(P,6e3))]).then(()=>{v=!0}),e.setVeil(1);const m=performance.now();let M=m,x=0,g=0,w=0;const b=()=>{const P=Math.max(1,o?o.limit:document.documentElement.scrollHeight-innerHeight);return Math.min(1,Math.max(0,(o?o.scroll:scrollY)/P))};function S(P){if(requestAnimationFrame(S),document.hidden){M=P;return}o?.raf(P);const z=Math.min(.1,Math.max(.001,(P-M)/1e3));M=P;const _=b(),R=(_-x)/z;x=_,g+=(R-g)*Math.min(1,z*8);const k=Math.min(1,z*2.8);a.x+=(r.x-a.x)*k,a.y+=(r.y-a.y)*k,i&&P-c>250&&(i=!1);const y=s.update(z,_,g,i),A={p:_,time:(P-m)/1e3,stop:y,pointer:{...a},lang:Ks,quality:Xs,reduced:Zs,speed:g};v&&!h&&(h=P),e.setVeil(h?1-np((P-h)/1400):1);const F=performance.now();e.render(A),w+=(performance.now()-F-w)*.1,n&&n.update(A,e.info(),w)}requestAnimationFrame(S)}const np=t=>{const e=Math.min(1,Math.max(0,t));return e*e*(3-2*e)};tp().catch(()=>ts());
