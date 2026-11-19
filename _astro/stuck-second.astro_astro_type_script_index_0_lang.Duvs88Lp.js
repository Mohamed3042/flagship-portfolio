import{_ as Jc}from"./preload-helper.4QTdcD_W.js";import{V as R,y as No,M as ot,P as Ar,C as an,aG as Ga,r as ge,f as vn,W as ho,H as xo,d as zn,aN as ji,w as Es,az as Rr,U as fr,R as el,j as Ki,o as Yi,au as t0,k as Ft,F as wt,b9 as Xi,a as Gn,Q as Xt,h as Kn,aP as tl,ba as nl,G as zt,Y as Fn,i as Fa,T as wo,N as Io,s as M0,a9 as Wn,a7 as kt,am as ra,ak as Cr,a3 as ol,aH as al,ay as ia,J as Wa,ag as Ua,B as mo,ah as Tn,ab as Ds,m as Zi,e as In,c as h0,S as ca,ao as Xr,O as Qi,b5 as Ji,b3 as sl,b4 as rl,aD as ec,I as il,z as cl,A as tc,ap as ll,aE as nc,aF as ul,aL as Tr,b as go,$ as ms,a0 as dl,bb as fl,n as Zr,as as Rs,bc as pl,_ as hl,aa as oc,u as ta,ai as ml,a8 as p0,aj as ac,aR as sc,bd as Fr,ae as rc,be as vl,aZ as gl,a_ as xl,ac as wl,bf as yl,bg as bl,bh as Ml,bi as Sl,v as kl,x as zl,bj as Pl,bk as Al}from"./three.module.Ck-uN-my.js";import{a as ic,m as Rl}from"./BufferGeometryUtils.C-QZNzVN.js";import{R as Cl}from"./RoundedBoxGeometry.CwROy-wR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const cc=-14,Ko=-12,W0=7/60*Math.PI*2,Y0=[6.4,7,-8.1],_a=1,Ca=[3.5,-11.3,-11.5],vs=3.4,x0=[9.7,-11.25,-9.2],pr=1.75,Tl=[7.6,-11.2,-11.2],z0=[7.95,-11.05,-9.75],lc=[19,-8.6,-6.5],hr=[8.2,-10.6,-9.6],Xa=70,va=260,Fl=[[-6.5,-9.2,6.5],[-14.5,-6,3],[-14,-2.4,-6],[-6,-1.8,-11],[.5,-3,-6],[1,-3,.5],[4.6,-3.6,7.5],[1.5,-7.8,12],[-4,-10.5,13.5]],T0=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],_l=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2]),uc=[{id:"0",name:"THE LID",move:"held",approach:.04,hold:.06,rim:1,pose:{pos:[69.2,50,35.6],look:[-10.4,-1,3.2],mm:40,pl:[3,0,-7.4]},drift:[0,0,0],light:{blade:{from:[-90,140,-30],to:[0,0,0],angle:.36,power:40},red:{at:[9,-3,-8],power:0,reach:30},haze:.02,env:0},stop:{blade:.4,red:1,angle:1},trick:{loop:8,release:.8,rare:0},exposure:1.3},{id:"1",name:"THE HAND",move:"slide",approach:.06,hold:.05,returnPow:3,pose:{pos:[12.49,1.54,-17.37],look:[10.9,-1.05,-10.49],mm:24,pf:1.15,pl:[0,-.5,0]},drift:[.006,-.002,-.004],light:{blade:{from:[-24,30,14],to:[13.1,0,-14.6],angle:.14,power:60},red:{at:[10,-1.4,-11],power:0,reach:18},haze:0,env:2},stop:{blade:.5,red:2.4,angle:1},trick:{loop:6,release:.7,rare:6},exposure:5.5,sharp:[.18,1],lift:[.3,.3,.55,.12],lift2:[-.3,.5,.9,.2],liftRise:.15,lift2Rise:.15,envAt:.1},{id:"2",name:"THE DROPS",move:"crane",approach:.05,hold:.05,pose:{pos:[22.2,21.9,6.2],look:[8.01,7,-9.77],mm:90,pf:1.25,pl:[-1.4,1.5,1.3]},drift:[0,.1,0],sharp:[.95,1.05],aperture:4,blurMul:1.25,light:{blade:{from:[-30,40,-40],to:[-1,0,-14],angle:.3,power:1.5},red:{at:[3,1,-13],power:0,reach:22},haze:.25,env:2},stop:{blade:.45,red:1.4,angle:1},trick:{loop:8,release:.8,rare:6},exposure:1.1,exposureIn:.5,lift:[2.7,.1,.72,.14],lift2:[-.5,.36,1,.3],lift3:[.75,.48,.64,.06],liftRise:.24,lift2Rise:.1},{id:"G",name:"THE GATE",move:"through",approach:.05,hold:.07,pose:{pos:[-8,22,34],look:[-6,0,11],mm:32,pf:1.05},drift:[0,-.6,-.4],light:{blade:{from:[-34,80,52],to:[-6,0,8],angle:.28,power:14},red:{at:[9.5,-10.5,-9],power:10,reach:3},haze:0,env:2},stop:{blade:.8,red:1.8,angle:1},trick:{loop:8,release:1,rare:0},exposure:6.8,exposureIn:.55,lightFrom:.12,lightIn:.6,lift:[-.6,.16,.62,.14],lift2:[.35,.58,.97,.14],liftPre:1.35,pulseGain:.02,neutral:1},{id:"3",name:"THE BURST",move:"fall",approach:.06,hold:.06,pose:{pos:[-3,-3.2,12.5],look:[-4.5,-6.4,0],mm:24,pf:.86,pr:-.85,pl:[1.2,0,-.15]},drift:[-.15,-.05,-.25],light:{blade:{from:[-23.93,32.93,14.84],to:[-3.1,-4.49,1.03],angle:.2,power:40,pen:.4},red:{at:[3.2,-7.4,-4.6],power:22,reach:6},haze:.1,env:2},stop:{blade:.6,red:.7,angle:1},trick:{loop:9,release:1,rare:5},pulseWidth:.04,sharp:[.4,1.25],sharpIn:.3,lift:[-.68,0,.92,.3],lift2:[-.35,.78,1,.15],lift3:[-.45,.45,1,.35],lift2Rise:.1},{id:"4",name:"THE STRAIN",move:"ride",approach:.06,hold:.05,pose:{pos:[1.97,-3.488,8.394],look:[3.985,-6.7,1.807],mm:100,roll:0,pf:.92,pl:[-.36,-.205,.132]},drift:[.01,0,-.02],light:{blade:{from:[2.543,-2,-8.958],to:[3.547,-7,1.394],angle:.09,power:6.8,pen:.9},red:{at:[5,-8.2,0],power:1.5,reach:6},haze:3.6,env:2},stop:{blade:1.25,red:1.6,angle:.85},trick:{loop:8,release:.6,rare:4},pulseWidth:.05,sharp:[.975,1.025],aperture:3,blurMul:1.4,lift:[.7,.5,.85],lift2:[-.12,0,.2,.1],liftPhone:[[.5,.45,.97,.1]],liftPc:[[.9,.48,1,.1,.14]]},{id:"5",name:"THE HEART",move:"track",approach:.07,hold:.06,pose:{pos:T0(Ca,[0,2.9,9.6]),look:T0(Ca,[1.5,1,0]),mm:28,pf:.6,pl:[-1.3,3.9,0],pp:[.6,1,2.2]},drift:[0,.05,.25],light:{blade:{from:T0(Ca,[-10.4,24.8,-11.2]),to:T0(Ca,[-.1,0,.3]),angle:.11,power:120,pen:.18},red:{at:T0(z0,[-.3,-.4,.2]),power:7,reach:6.8},haze:0,env:2},stop:{blade:.67,red:1.6,angle:1},trick:{loop:8,release:.9,rare:8},lightIn:.3,stopDelay:1.5,pulseWidth:.05,sharp:[.42,1.06],lift:[.9,.4,1,.15],lift2:[.3,.38,.6,.12],liftPhone:[[2,.2,.62,.12,.15],[.4,.2,.41,.12,.07]],liftPhoneTrim:[[.19,1],[.2,1.018],[.2125,1.054],[.225,1.02],[.2375,.911],[.25,.833],[.2625,.815],[.275,.744],[.2875,.691],[.3,.755],[.3125,.903],[.325,1.136],[.3375,1.414],[.35,1.414],[.3625,1.42],[.375,1.574],[.3875,1.707],[.4,1.81],[.4125,1.613],[.425,1.235],[.4375,.894],[.45,.834],[.4625,.788],[.475,.738],[.4875,.73],[.5,.742],[.5125,.778],[.525,.814],[.5375,.866],[.55,.962],[.5625,1.082],[.575,1.13],[.5875,1.241],[.6,1.357],[.6125,1.352],[.625,1.228],[.6375,1.121],[.65,1.035],[.67,1]],liftPc:[[.25,.37,.44,.03]]},{id:"6",name:"THE JAM",move:"spiral",approach:.05,hold:.06,pose:{pos:T0(z0,[4.977,3.433,2.874]),look:T0(z0,[0,-.2,.3]),mm:100,pf:.9,pr:-1,pl:[0,0,-.05]},drift:[.02,0,-.06],light:{blade:{from:T0(z0,[-5,10,-2]),to:T0(z0,[.1,-.22,.4]),angle:.105,power:256},red:{at:T0(z0,[.1,.3,.5]),power:.05,reach:2},haze:0,env:0},stop:{blade:.05,red:1.8,angle:1},trick:{loop:6,release:.5,rare:2},pulseWidth:.05,lightFrom:.5,lightIn:.62,sharp:[.77,1.06],lift:[1.3,.55,.78,.08],lift2:[.4,.4,.6,.06],liftPhone:[[.7,0,.22,.1],[.6,.5,.72,.08]],liftPc:[[.15,.33,.58,.08]]},{id:"7",name:"THE TICK",move:"recoil",approach:.05,hold:.06,pose:{pos:lc,look:hr,mm:50,pf:.66,pl:[.047,0,-.163]},drift:[-.189,-.035,-.054],light:{blade:{from:[20,-2.17,-3.1],to:T0(hr,[.6,0,.2]),angle:.3,power:16},red:{at:[11.27,-9.98,-9.4],power:1.5,reach:3},haze:.2,env:2},stop:{blade:.75,red:2.2,angle:1},trick:{loop:8,release:.8,rare:6},sharp:[.5,1.4],lift:[.3,.1,.8],lift2:[.9,0,.18,.1]},{id:"8",name:"THE SECOND ENDS",move:"wipe",approach:.06,hold:.08,rim:1,pose:{pos:[92,66,44],look:[-16,14,4],mm:33,pf:.8,pl:[12,-6,4]},drift:[-.8,-.6,-.6],light:{blade:{from:[50,170,70],to:[-8,-4,0],angle:.42,power:52},red:{at:[4,2,-4],power:0,reach:30},haze:.14,env:0},stop:{blade:1,red:1,angle:1},trick:{loop:10,release:1,rare:8},exposure:1.8,liftPhone:[[.3,.35,.52,.06]]}],Qr={pc:1700,phone:2e3},Jr=uc.reduce((e,t)=>e+t.approach+t.hold,0),fe=(()=>{let e=0;return uc.map(t=>{const n=e,o=n+t.approach/Jr,a=o+t.hold/Jr;return e=a,{...t,a0:n,h0:o,h1:a,focus:t.focus??_l(t.pose.pos,t.pose.look)}})})();fe[fe.length-1].h1=1;function Ns(e,t,n){if(n){const u=fe[e+1]?.liftPre;return u?1+(u-1)*ne((t-.85)/.15):1}const o=fe[e]?.lift,a=fe[e]?.liftPre,s=o?o[3]??Math.min(.3,(o[2]-o[1])/2):1,r=fe[e]?.liftRise??.04,i=fe[e]?.lift2Rise??.04,c=u=>{if(!u)return 1;const f=u[3]??Math.min(.3,(u[2]-u[1])/2);return 1+u[0]*ne((t-u[1])/i)*(1-ne((t-u[2]+f)/f))},l=(o?1+o[0]*ne((t-o[1])/r)*(1-ne((t-o[2]+s)/s)):1)*c(fe[e]?.lift2)*c(fe[e]?.lift3),d=a?1+(a-1)*(1-ne(t/.15)):1;return l>=1?Math.max(l,d):l*d}function Ll(e,t,n,o="liftPhone"){const a=fe[e]?.[o];if(n||!a)return 1;const s=o==="liftPhone"?fe[e].liftPhoneTrim:void 0;let r=1;if(s&&t>s[0][0]&&t<s[s.length-1][0]){let i=1;for(;s[i][0]<t;)i++;const[c,l]=s[i-1],[d,u]=s[i];r=l+(u-l)*(t-c)/(d-c)}return r*a.reduce((i,c)=>{const l=c[3]??Math.min(.3,(c[2]-c[1])/2),d=c[4]??l;return i*(1+c[0]*ne((t-c[1])/l)*(1-ne((t-c[2]+d)/d)))},1)}const J0={rise:[.01,.035],full:[.035,.055],drain:[.055,.08],cut:.04},i0={cut:.2,lead:[.2,.76],trail:[.22,.84]},mr=(e,t)=>-.12+(Math.PI/2+.37)*ne((e-t[0])/(t[1]-t[0])),pn={settle:1,pulse:1.5,rare:10,pulseLen:1.6},Ge=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),ne=e=>{const t=Ge(e);return t*t*(3-2*t)};function H0(e){const t=Ge(e);let n=fe.findIndex(r=>t<r.h1);n<0&&(n=fe.length-1);const o=fe[n],a=t>=o.h0,s=a?(t-o.h0)/(o.h1-o.h0):(t-o.a0)/(o.h0-o.a0);return{i:n,place:o,inHold:a,u:Ge(s)}}function Il(e){let t=0,n=1/0;return fe.forEach((o,a)=>{const s=e<o.h0?o.h0-e:e>o.h1?e-o.h1:0;s<n&&(n=s,t=a)}),t}function El(e,t){const n=fe[e].trick.loop,o=Math.max(0,t-pn.pulse)/n;return o-Math.floor(o)}const _r=fe.find(e=>e.id==="3"),dc=2270/1290,Lr=new R(..._r.pose.pos),Dl=new R(..._r.pose.look),na=Dl.clone().sub(Lr).normalize(),_o=na.clone().cross(new R(0,1,0)).normalize(),To=_o.clone().cross(na).normalize(),fc=36/dc/2/_r.pose.mm,Nl=fc*dc,ko=Lr;function Ln(e,t,n){return Lr.clone().addScaledVector(na,n).addScaledVector(_o,e*n*Nl).addScaledVector(To,t*n*fc)}const vr=[Ln(-.3,-.46,10.4),Ln(-.06,0,11.2),Ln(.12,.42,12.2),Ln(.35,.68,12.8),Ln(.58,.8,13.2),Ln(.8,.68,13),Ln(.93,.36,12.4),Ln(.86,.06,11.8),Ln(.68,-.02,11.4)],Wl=Ln(-.4,-.66,8.7),Hl=new R(3.5,-7,2),ei=new R(.996,0,-.087).normalize(),ti=.25,ni={0:.17676,1:1.46108,2:1.88784,3:1.34833,4:1.6638,5:1.10436,6:1.25436,7:.71406,8:.32395,G:1.00176},Bl={0:[0,.017996,.035991,.053987,.071983,.089978,.107974,.12597,.143965,.161961,.179957,.197952,.21103,.222025,.233019,.244013,.255008,.266002,.276997,.287991,.298985,.30998,.320974,.331968,.344881,.361,.377119,.393237,.409356,.425475,.441593,.457712,.473831,.490333,.506849,.523365,.539882,.556398,.572914,.58943,.605946,.621574,.636921,.652267,.667613,.68296,.698306,.713652,.728999,.744345,.76102,.7778,.794579,.811359,.828138,.844918,.861697,.878477,.895761,.913134,.930507,.94788,.965254,.982627,1],1:[0,.006785,.016075,.029155,.042411,.057136,.073308,.090286,.107963,.126989,.147385,.167217,.18609,.205832,.228682,.251948,.274117,.296199,.321296,.347712,.375949,.406162,.437896,.469044,.495591,.520853,.549563,.576025,.600171,.623113,.646268,.6667,.684454,.698848,.710935,.720201,.728443,.736053,.743804,.75161,.759398,.767193,.775024,.781645,.787015,.7922,.79707,.80199,.807261,.812539,.820417,.828886,.838129,.84907,.86089,.873299,.885997,.900897,.918426,.934966,.950925,.966428,.980613,.991781,1],2:[0,.003081,.012393,.022066,.031529,.042354,.052753,.062486,.071087,.080811,.091493,.102812,.114328,.125869,.13706,.146759,.156533,.1666,.17763,.189222,.20065,.21218,.225339,.241878,.262807,.288688,.320481,.352904,.386235,.420103,.452685,.481156,.506802,.533089,.56046,.589127,.622378,.657904,.692275,.722904,.749882,.773476,.795711,.816114,.837396,.857631,.874437,.888733,.90137,.91255,.922521,.93151,.940078,.947925,.955237,.961526,.967529,.97315,.978417,.98304,.987662,.99109,.994422,.997754,1],3:[0,.013719,.04799,.090614,.129012,.163953,.195633,.220403,.23985,.255025,.268917,.280739,.292004,.303181,.316016,.328275,.340541,.353175,.367282,.380359,.393622,.40762,.422747,.437843,.453616,.470457,.489497,.507761,.526092,.545138,.565305,.583976,.601405,.618367,.634689,.650048,.664767,.67954,.696283,.711295,.725982,.740774,.755509,.769626,.783247,.797881,.813067,.82803,.842396,.856894,.872031,.886315,.900004,.913387,.92656,.937834,.948174,.957246,.965767,.973645,.980633,.986921,.992243,.996122,1],4:[0,.007992,.021764,.040395,.05902,.078427,.099704,.119969,.1399,.160658,.183509,.205282,.227007,.249711,.273944,.294773,.314382,.333078,.352435,.368659,.383998,.399354,.416114,.432438,.449116,.465525,.483091,.499381,.515801,.53305,.550716,.567171,.584168,.602428,.623476,.642975,.661018,.677894,.694324,.708286,.720896,.733322,.746383,.759381,.772641,.786583,.801104,.814677,.827928,.841699,.856396,.87006,.883497,.896959,.91221,.930779,.948889,.964218,.974852,.982675,.987839,.992547,.995031,.997516,1],5:[0,.004812,.012697,.022995,.035179,.046437,.057508,.068447,.079517,.090678,.103266,.116439,.130449,.146444,.167631,.192169,.219824,.250598,.284531,.315487,.341593,.366518,.38926,.411447,.430538,.448785,.468853,.487271,.507948,.530618,.557063,.582478,.60705,.631077,.655682,.67775,.697934,.716031,.732417,.74618,.758216,.769769,.781815,.792603,.803884,.816097,.828937,.841237,.854051,.867399,.882815,.896886,.910052,.922383,.934258,.944738,.954035,.962002,.969172,.975909,.981655,.987164,.991869,.995934,1],6:[0,.003594,.008127,.01266,.0172,.022967,.028734,.034787,.041356,.047987,.056566,.0653,.074498,.084728,.095988,.108072,.120662,.134018,.149349,.164415,.180016,.196762,.214689,.232514,.250075,.268411,.287073,.304438,.322478,.343138,.366847,.391518,.416156,.44102,.467793,.49043,.510899,.530871,.549897,.567448,.583861,.601411,.620848,.639335,.656381,.672346,.689183,.704826,.720013,.735287,.752732,.770428,.789105,.8092,.831129,.852424,.873798,.895632,.917375,.938024,.956488,.972361,.98523,.994245,1],7:[0,.019929,.050261,.084653,.117216,.151401,.187136,.219991,.253072,.286531,.315296,.340203,.359314,.380459,.402551,.425083,.447272,.470835,.495174,.51878,.541149,.563627,.586484,.606614,.626606,.646453,.666464,.685838,.704093,.722469,.740813,.757095,.773168,.788337,.802851,.815862,.828635,.839489,.850344,.859528,.867422,.875316,.883015,.889719,.896423,.903127,.909715,.915693,.921672,.927651,.933629,.939113,.944353,.949592,.954832,.960072,.964826,.969178,.97353,.977882,.982234,.986586,.990995,.995498,1],8:[0,.011103,.022206,.03331,.046398,.059841,.073283,.087311,.103989,.120667,.139004,.163072,.18808,.217489,.240988,.256388,.271788,.286439,.298437,.310435,.322433,.335363,.355766,.376169,.398316,.421231,.446901,.47496,.502082,.528263,.552192,.573236,.594083,.613069,.632055,.650783,.668479,.686175,.703871,.717282,.730635,.743989,.757216,.77014,.783064,.795988,.808814,.821533,.834253,.846972,.859344,.871487,.88363,.895773,.907335,.918408,.929481,.940553,.951358,.959462,.967566,.975669,.983773,.991876,1],G:[0,.003975,.011685,.019793,.027901,.036395,.044905,.054368,.064626,.076063,.089813,.105232,.122334,.137619,.151261,.163353,.174683,.189025,.204715,.222519,.240099,.257459,.27264,.286149,.296656,.306731,.316288,.325536,.334408,.343281,.354308,.36538,.37748,.38986,.403751,.418045,.432118,.446754,.463067,.478904,.494482,.510252,.525805,.540823,.554909,.568539,.582225,.595569,.608727,.623044,.638515,.655243,.673207,.69391,.720507,.750468,.783892,.820404,.857787,.890196,.919414,.946132,.969575,.987382,1]},Qo=[0],Jo=[0];(()=>{const e=fe.reduce((s,r)=>s+(r.h0-r.a0)*(ni[r.id]??1),0),t=fe.reduce((s,r)=>s+r.h1-r.h0,0),n=(1-ti)/e,o=ti/t;let a=0;for(const s of fe){const r=s.h0-s.a0,i=r*(ni[s.id]??1)*n,c=Bl[s.id]??[0,1];for(let l=1;l<c.length;l++)Qo.push(s.a0+r*l/(c.length-1)),Jo.push(a+i*c[l]);a+=i,a+=(s.h1-s.h0)*o,Qo.push(s.h1),Jo.push(a)}Qo[Qo.length-1]=1,Jo[Jo.length-1]=1})();function pc(e,t,n){if(!(e>0))return 0;if(e>=1)return 1;let o=1;for(;o<t.length-1&&e>t[o];)o++;const a=t[o-1],s=t[o];return s>a?n[o-1]+(n[o]-n[o-1])*(e-a)/(s-a):n[o]}const Za=e=>pc(e,Jo,Qo),Ol=e=>pc(e,Qo,Jo),oi={0:.05,1:.05,2:.05,G:.05,3:.05,4:.05,5:.05,6:.05,7:.05,8:.05},ai=.35;function hc(e){for(let t=0;t<fe.length;t++){const n=fe[t];if(e<n.a0)break;if(e<n.h0){if(t===0)return 0;const o=(e-n.a0)/(n.h0-n.a0);return o<ai?(oi[fe[t-1].id]??0)*(1-ne(o/ai)):0}if(e<=n.h1||t===fe.length-1)return(oi[n.id]??0)*ne((e-n.h0)/(n.h1-n.h0))}return 0}let Ir=!0;function Vl(e){Ir=e}const qn=e=>new R(e[0],e[1],e[2]),On=(e,t,n)=>e+(t-e)*n,gs=(e,t=3)=>1-Math.pow(1-Ge(e),t),ql=(e,t=2)=>Math.pow(Ge(e),t),fn=(e,t,n)=>Ge((e-t)/(n-t));new No(Fl.map(qn),!1,"centripetal");const Gl=new No(vr.slice(1),!1,"centripetal"),k0={i:fe.findIndex(e=>e.id==="8"),shut:.62,land:.69};function Ul(e,t){const n=e.length,o=e.slice(1).map((s,r)=>(t[r+1]-t[r])/(s-e[r])),a=e.map((s,r)=>r===0||r===n-1||o[r-1]*o[r]<=0?0:2/(1/o[r-1]+1/o[r]));return s=>{let r=0;for(;r<n-2&&s>e[r+1];)r++;const i=e[r+1]-e[r],c=Ge((s-e[r])/i),l=c*c,d=l*c;return(2*d-3*l+1)*t[r]+(d-2*l+c)*i*a[r]+(-2*d+3*l)*t[r+1]+(d-l)*i*a[r+1]}}function mc(e,t){const n=new No(e,!1,"centripetal"),o=n.getLengths(400),a=o[o.length-1],s=e.map((i,c)=>o[Math.round(c/(e.length-1)*400)]/a),r=Ul(t,s);return i=>n.getPointAt(Ge(r(Ge(i))))}const $l=[[17.2,10,-24.2],[14.4,6.3,-20],[12.6,3.9,-17.55]],jl=[0,.2,.44,.62,.82,1],Kl=[13.3,.7,-16.4],Yl=[11.8,.7,-13],zo={chip:[.08,.4],hand:[.4,.64],out:[.72,1],lift:1.8},Xl=mc([qn(fe[0].pose.pos),new R(42,16,6),...$l.map(qn),qn(fe[1].pose.pos).add(new R(-fe[1].drift[0]*.5,-fe[1].drift[1]*.5,-fe[1].drift[2]*.5))],jl),Zl=[[12.75,6.2,-17.75],[16.2,11.5,-9.5]],Ql=[0,.2,.5,1],Jl=mc([qn(fe[1].pose.pos).add(new R(fe[1].drift[0]*.5,fe[1].drift[1]*.5,fe[1].drift[2]*.5)),...Zl.map(qn),qn(fe[2].pose.pos).add(new R(-fe[2].drift[0]*.5,-fe[2].drift[1]*.5,-fe[2].drift[2]*.5))],Ql),si={aim:.15,focus:.2};function X0(e,t){const n=fe[e],o=n.drift,a=t-.5;return{pos:qn(n.pose.pos).add(new R(o[0]*a,o[1]*a,o[2]*a)),look:qn(n.pose.look),mm:n.pose.mm,roll:n.pose.roll??0,shake:0,cover:0,wipe:0,flip:0}}const Cs=(e,t,n)=>({pos:e.pos.clone().lerp(t.pos,n),look:e.look.clone().lerp(t.look,n),mm:On(e.mm,t.mm,n),roll:On(e.roll,t.roll,n),shake:On(e.shake,t.shake,n),cover:0,wipe:0,flip:0});function eu(e,t){const n=e>0?X0(e-1,1):X0(0,0),o=X0(e,0);switch(fe[e].move){case"held":return o;case"slide":{const s={...Cs(n,o,ne(t))};return s.pos.copy(Xl(t)),s.look.copy(n.look).lerp(qn(Kl),ne(fn(t,zo.chip[0],zo.chip[1]))).lerp(qn(Yl),ne(fn(t,zo.hand[0],zo.hand[1]))).lerp(o.look,ne(fn(t,zo.out[0],zo.out[1]))),s.look.y+=zo.lift*Math.sin(Math.PI*fn(t,.3,.62)),s}case"crane":{const s=Jl(t),r=qn(Y0).add(new R(0,2.5,0)),i=n.look.clone().lerp(r,ne(fn(t,.12,.5))).lerp(o.look,ne(fn(t,.55,1)));return{pos:s,look:i,mm:On(n.mm,o.mm,ql(fn(t,.3,1),2)),roll:0,shake:0,cover:0,wipe:0,flip:0}}case"through":{const s=qn(Y0),r=s.clone().add(new R(1.2,4.5,.8)),i=ne(t)*.55+(1-(1-t)**2.4)*.45,c=1-i,l=n.pos.clone().multiplyScalar(c*c).add(r.clone().multiplyScalar(2*c*i)).add(o.pos.clone().multiplyScalar(i*i)),d=n.look.clone().lerp(s,ne(fn(t,0,.45))).lerp(o.look,ne(fn(t,.45,1)));return{pos:l,look:d,mm:On(n.mm,o.mm,ne(t)),roll:0,shake:0,cover:0,wipe:0,flip:0}}case"fall":{const s=ne(fn(t,0,.4)),r=t*t*t*(t*(t*6-15)+10),i=new R(On(n.pos.x,o.pos.x,s),On(n.pos.y,o.pos.y,r),On(n.pos.z,o.pos.z,s)),c=n.look.clone().sub(n.pos).normalize(),l=o.look.clone().sub(i).normalize(),d=c.lerp(l,ne(fn(t,0,si.aim))).normalize(),u=On(n.pos.distanceTo(n.look),i.distanceTo(o.look),ne(fn(t,0,si.focus))),f=i.clone().add(d.multiplyScalar(u));return{pos:i,look:f,mm:On(n.mm,o.mm,ne(t)),roll:0,shake:t>.45&&t<.78?.08*Math.sin(fn(t,.45,.78)*Math.PI):0,cover:0,wipe:0,flip:0}}case"ride":return tu(n,o,t);case"track":return nu(n,o,t);case"spiral":return ou(n,o,t);case"recoil":{const s=gs(fn(t,.04,.86),3.2),r=qn(z0),i=n.pos.clone().sub(r).multiplyScalar(2.4).add(r),l={pos:n.pos.clone().multiplyScalar((1-s)*(1-s)).addScaledVector(i,2*s*(1-s)).addScaledVector(o.pos,s*s),look:n.look.clone().lerp(o.look,ne(fn(t,.04,.7))),mm:On(n.mm,o.mm,gs(fn(t,.04,.6),2)),roll:0,shake:0,cover:0,wipe:0,flip:0};return l.shake=t<.04?0:.7*Math.exp(-(t-.04)*14),l}case"wipe":{const s={...o,pos:o.pos.clone().lerp(o.look,.18)},r=t<i0.cut?vc(n,t):Cs(s,o,gs(fn(t,i0.trail[0],1),3));return r.cover=0,r.wipe=t,r}}}const Qa=new Map;function Er(e){const t=e.map(o=>o.toArray().join()).join("|");let n=Qa.get(t);return n||(Qa.size>24&&Qa.clear(),n=new No(e.map(o=>o.clone()),!1,"centripetal"),Qa.set(t,n)),n}const Vs={path:[[-1.6,-2.7,11.6],[.4,-2.9,9.9]],gaze:[.3,1]};function tu(e,t,n){const o=Er([e.pos,...Vs.path.map(qn),t.pos]).getPointAt(ne(n)),a=Gl.getPointAt(On(Vs.gaze[0],Vs.gaze[1],ne(fn(n,.05,.62)))),s=e.look.clone().lerp(a,ne(fn(n,0,.3))).lerp(t.look,ne(fn(n,.5,.92))),r=e.mm*Math.pow(t.mm/e.mm,ne(fn(n,.2,1)));return{pos:o,look:s,mm:r,roll:On(e.roll,t.roll,ne(n)),shake:0,cover:0,wipe:0,flip:0}}const ga={path:[[3,-4.3,7.9],[3.6,-6.6,6.6],[2.6,-8.7,4.6],[2.1,-8.8,1.6],[2,-8.8,-.6]],zoom:[0,.42],turn:[.25,.62]};function nu(e,t,n){const o=Er([e.pos,...ga.path.map(qn),t.pos]).getPointAt(ne(n)),a=e.look.clone().lerp(t.look,ne(fn(n,ga.turn[0],ga.turn[1]))),s=e.mm*Math.pow(t.mm/e.mm,ne(fn(n,ga.zoom[0],ga.zoom[1])));return{pos:o,look:a,mm:s,roll:On(e.roll,t.roll,ne(n)),shake:0,cover:0,wipe:0,flip:0}}const xa={path:[[5.6,-8.3,-3.4],[9.2,-8,-4.2],[11.6,-7.7,-5.6]],gaze:[.1,.62],zoom:[.3,1]};function ou(e,t,n){const o=Er([e.pos,...xa.path.map(qn),t.pos]).getPoint(ne(n)),a=e.look.clone().lerp(t.look,ne(fn(n,xa.gaze[0],xa.gaze[1]))),s=e.mm*Math.pow(t.mm/e.mm,ne(fn(n,xa.zoom[0],xa.zoom[1])));return{pos:o,look:a,mm:s,roll:On(e.roll,t.roll,ne(n)),shake:0,cover:0,wipe:0,flip:0}}function vc(e,t){return Cs(e,{...e,pos:e.pos.clone().lerp(qn(z0),-.15)},ne(t/i0.trail[1]))}function au(e){const t=k0.i,n=X0(t,0),o={...n,pos:n.pos.clone().lerp(n.look,.18)},a=Cs(o,n,gs(fn(e,i0.trail[0],1),3));a.wipe=e;const s=vc(X0(t-1,1),e);s.wipe=e;const r=fe[t];return s.lean=Ir?hc(r.a0+(r.h0-r.a0)*e):0,{a:s,b:a}}function Vo(e){const t=H0(e.p);let n;if(e.reduced?n=X0(t.i,.5):n=t.inHold?X0(t.i,t.u):eu(t.i,t.u),n.lean=Ir&&!e.reduced?hc(e.p):0,e.stop.station>=0&&!e.reduced){const o=ne(e.stop.t/pn.settle)*(1-ne(e.stop.rel/.8));n.pos.lerp(n.look,.012*o)}if(t.i===k0.i&&(t.inHold||e.stop.rel>0)&&e.stop.station===k0.i&&e.stop.rare&&!e.reduced&&fe[k0.i].trick.rare>0){const o=(e.stop.t-pn.rare)/fe[k0.i].trick.rare;if(o>=k0.shut){const a=e.stop.rel>0?1-ne(e.stop.rel/fe[k0.i].trick.release):1,s=Ge((o-k0.shut)/(k0.land-k0.shut)),r=s*s*a,i=X0(0,0);n={...n,pos:n.pos.clone().lerp(i.pos,r),look:n.look.clone().lerp(i.look,r),mm:On(n.mm,i.mm,r),lean:(n.lean??0)*(1-r)};const c=e.stop.t-pn.rare-k0.land*fe[k0.i].trick.rare;n.shake=c>=0&&c<.45?.5*Math.exp(-c*9):0}}return n}function su(e,t){const n=e.pos.clone().sub(e.look),o=n.length(),a=u=>new R(0,1,0).lerp(new R(0,0,-1),ne((Math.abs(u.y)/u.length()-.85)/.14)).normalize();t.orbit&&n.applyAxisAngle(new R(0,1,0),t.orbit),t.elev&&n.applyAxisAngle(new R().crossVectors(n,a(n)).normalize(),t.elev),n.multiplyScalar(1-(t.dolly??0));const s=e.look.clone(),r=n.clone().negate().normalize(),i=new R().crossVectors(r,a(n)).normalize(),c=new R().crossVectors(i,r).normalize();s.addScaledVector(i,(t.truck??0)*o).addScaledVector(c,(t.rise??0)*o);const l=s.clone().add(n),d=n.length();return s.addScaledVector(i,Math.tan(t.yaw??0)*d).addScaledVector(c,Math.tan(t.pitch??0)*d),{...e,pos:l,look:s,mm:e.mm*(1+(t.zoom??0)),roll:e.roll+(t.roll??0)}}const ru=new R,Ja=new R,ri=new R;function iu(e,t,n,o){e.filmGauge=36;const a=H0(n.p),s=h=>fe[Math.max(0,h)].pose.pf??.72;t.lean&&!n.film&&(t={...t,pos:t.pos.clone().lerp(t.look,t.lean)});const r=a.inHold||n.reduced?s(a.i):On(s(a.i-1),s(a.i),ne(a.u));if(o){const h=g=>new R(...fe[Math.max(0,g)].pose.pl??[0,0,0]),v=fe[a.i].id==="1"?ne(fn(a.u,0,.4)):ne(a.u),M=a.inHold||n.reduced?h(a.i):h(a.i-1).lerp(h(a.i),v),w=g=>new R(...fe[Math.max(0,g)].pose.pp??[0,0,0]),x=a.inHold||n.reduced?w(a.i):w(a.i-1).lerp(w(a.i),ne(a.u));(M.lengthSq()>0||x.lengthSq()>0)&&(t={...t,look:t.look.clone().add(M),pos:t.pos.clone().add(x)})}if(o){const h=M=>fe[Math.max(0,M)].pose.pr??0,v=a.inHold||n.reduced?h(a.i):On(h(a.i-1),h(a.i),ne(a.u));v!==0&&(t={...t,roll:t.roll+v})}n.film&&(t=su(t,n.film)),e.setFocalLength(o?t.mm*r:t.mm);const i=ru.copy(t.look).sub(t.pos).normalize(),c=ne((Math.abs(i.y)-.85)/.14);ri.set(0,1,0).lerp(new R(0,0,-1),c).normalize(),Ja.crossVectors(i,ri).normalize();const l=new R().crossVectors(Ja,i).normalize(),d=t.pos.distanceTo(t.look),u=n.reduced?0:(n.pointer.x-.5)*2,f=n.reduced?0:(n.pointer.y-.5)*2,p=d*.025,m=t.pos.clone().addScaledVector(Ja,u*p).addScaledVector(l,-f*p*.6);if(t.shake>0&&!n.reduced){const h=n.time*37;m.addScaledVector(Ja,Math.sin(h*1.3)*t.shake*d*.02).addScaledVector(l,Math.sin(h*1.7+1)*t.shake*d*.02)}return e.position.copy(m),e.up.copy(l),e.lookAt(t.look),e.rotateZ(t.roll-u*.012),e.near=Math.max(.004,d*.004),e.far=2e3,e.updateProjectionMatrix(),e.updateMatrixWorld(),d}const Ha=()=>({station:-1,t:0,rare:!0,rel:99});function ut(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}class Wo extends ot{constructor(t,n={}){super(t),this.isReflector=!0,this.type="Reflector",this.forceUpdate=!1,this.camera=new Ar;const o=this,a=n.color!==void 0?new an(n.color):new an(8355711),s=n.textureWidth||512,r=n.textureHeight||512,i=n.clipBias||0,c=n.shader||Wo.ReflectorShader,l=n.multisample!==void 0?n.multisample:4,d=new Ga,u=new R,f=new R,p=new R,m=new ge,h=new R(0,0,-1),v=new vn,M=new R,w=new R,x=new vn,g=new ge,y=this.camera,b=new ho(s,r,{samples:l,type:xo}),z=new zn({name:c.name!==void 0?c.name:"unspecified",uniforms:ji.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});z.uniforms.tDiffuse.value=b.texture,z.uniforms.color.value=a,z.uniforms.textureMatrix.value=g,this.material=z,this.onBeforeRender=function(k,I,P){if(f.setFromMatrixPosition(o.matrixWorld),p.setFromMatrixPosition(P.matrixWorld),m.extractRotation(o.matrixWorld),u.set(0,0,1),u.applyMatrix4(m),M.subVectors(f,p),M.dot(u)>0===!0&&this.forceUpdate===!1)return;M.reflect(u).negate(),M.add(f),m.extractRotation(P.matrixWorld),h.set(0,0,-1),h.applyMatrix4(m),h.add(p),w.subVectors(f,h),w.reflect(u).negate(),w.add(f),y.position.copy(M),y.up.set(0,1,0),y.up.applyMatrix4(m),y.up.reflect(u),y.lookAt(w),y.far=P.far,y.updateMatrixWorld(),y.projectionMatrix.copy(P.projectionMatrix),g.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),g.multiply(y.projectionMatrix),g.multiply(y.matrixWorldInverse),g.multiply(o.matrixWorld),d.setFromNormalAndCoplanarPoint(u,f),d.applyMatrix4(y.matrixWorldInverse),v.set(d.normal.x,d.normal.y,d.normal.z,d.constant);const S=y.projectionMatrix;x.x=(Math.sign(v.x)+S.elements[8])/S.elements[0],x.y=(Math.sign(v.y)+S.elements[9])/S.elements[5],x.z=-1,x.w=(1+S.elements[10])/S.elements[14],v.multiplyScalar(2/v.dot(x)),S.elements[2]=v.x,S.elements[6]=v.y,S.elements[10]=v.z+1-i,S.elements[14]=v.w,o.visible=!1;const F=k.getRenderTarget(),W=k.xr.enabled,A=k.shadowMap.autoUpdate;k.xr.enabled=!1,k.shadowMap.autoUpdate=!1,k.setRenderTarget(b),k.state.buffers.depth.setMask(!0),k.autoClear===!1&&k.clear(),k.render(I,y),k.xr.enabled=W,k.shadowMap.autoUpdate=A,k.setRenderTarget(F);const B=P.viewport;B!==void 0&&k.state.viewport(B),o.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return b},this.dispose=function(){b.dispose(),o.material.dispose()}}}Wo.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
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

		}`};function gc(e,t,n){const o=new Float32Array(t*t).map(()=>n()),a=new Float32Array(e*e);for(let s=0;s<e;s++)for(let r=0;r<e;r++){const i=r/e*t,c=s/e*t,l=Math.floor(i),d=Math.floor(c),u=i-l,f=c-d,p=u*u*(3-2*u),m=f*f*(3-2*f),h=(w,x)=>o[(x%t+t)%t*t+(w%t+t)%t],v=h(l,d)+(h(l+1,d)-h(l,d))*p,M=h(l,d+1)+(h(l+1,d+1)-h(l,d+1))*p;a[s*e+r]=v+(M-v)*m}return a}function es(e,t,n,o){const a=new Float32Array(e*e);let s=.5,r=0;for(let i=0;i<n;i++){const c=gc(e,t<<i,o);for(let l=0;l<a.length;l++)a[l]+=c[l]*s;r+=s,s*=.5}for(let i=0;i<a.length;i++)a[i]/=r;return a}function qs(e,t){const n=new Es(t,e,e,Rr,fr);return n.wrapS=n.wrapT=el,n.magFilter=Ki,n.minFilter=Yi,n.generateMipmaps=!0,n.anisotropy=4,n.needsUpdate=!0,n}const wa=e=>{let t=1/0,n=-1/0;for(const o of e)t=Math.min(t,o),n=Math.max(n,o);return e.map(o=>(o-t)/(n-t||1))};let ts=null;function ro(){if(ts)return ts;const e=ut(90210),t=256,n=wa(es(t,16,4,e)),o=wa(es(t,8,4,e)),a=wa(es(t,4,3,e)),s=wa(gc(t,128,e)),r=new Uint8Array(t*t*4);for(let v=0;v<t*t;v++)r[v*4]=n[v]*255,r[v*4+1]=o[v]*255,r[v*4+2]=a[v]*255,r[v*4+3]=s[v]*255;const i=512,c=new Float32Array(i*i),l=wa(es(i,6,3,e));for(let v=0;v<5200;v++){let M=e()*i,w=e()*i;for(let b=0;b<6&&l[Math.floor(w)%i*i+Math.floor(M)%i]<.55;b++)M=e()*i,w=e()*i;const x=1.2+e()*e()*5.5,g=.5+e()*.5,y=Math.ceil(x+1);for(let b=-y;b<=y;b++)for(let z=-y;z<=y;z++){const k=Math.hypot(z,b)/x;if(k>=1)continue;const I=((Math.floor(M)+z)%i+i)%i,P=((Math.floor(w)+b)%i+i)%i,C=g*(1-k*k);c[P*i+I]=Math.max(c[P*i+I],C)}}const d=new Uint8Array(i*i*4);for(let v=0;v<i*i;v++)d[v*4]=Math.min(1,c[v])*255,d[v*4+1]=l[v]*255,d[v*4+2]=0,d[v*4+3]=255;const u=512,f=new Float32Array(u*u),p=new Float32Array(u*u),m=(v,M,w,x)=>{for(let g=0;g<M;g++){const y=e()*u,b=e()*u,z=x+(e()-.5)*1.2,k=60+e()*300,I=w*(.5+e()),P=.4+e()*.6,C=Math.cos(z),S=Math.sin(z),F=Math.ceil(k*2);for(let W=0;W<F;W++){const A=W/2,B=Math.sin(Math.PI*A/k),oe=Math.sin(A/k*3+g)*4,ie=y+C*A-S*oe,U=b+S*A+C*oe;for(let O=-2;O<=2;O++)for(let D=-2;D<=2;D++){const E=Math.floor(ie)+D,N=Math.floor(U)+O,V=Math.abs((E+.5-ie)*-S+(N+.5-U)*C),K=Math.max(0,1-V/I)*B*P,j=(N%u+u)%u*u+(E%u+u)%u;v[j]=Math.max(v[j],K)}}}};m(f,70,.9,.3),m(p,22,1.4,1.9);const h=new Uint8Array(u*u*4);for(let v=0;v<u*u;v++)h[v*4]=Math.min(1,f[v])*255,h[v*4+1]=Math.min(1,p[v])*255,h[v*4+2]=0,h[v*4+3]=255;return ts={noise:qs(t,r),pits:qs(i,d),scratch:qs(u,h)},ts}const c0={centre:{value:new R},radius:{value:-1},width:{value:4},gain:{value:0}};function O0(e){e.uniforms.uPulseC=c0.centre,e.uniforms.uPulseR=c0.radius,e.uniforms.uPulseW=c0.width,e.uniforms.uPulseG=c0.gain,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vPW;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
#ifdef USE_INSTANCING
vPW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
vPW = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vPW;
uniform vec3 uPulseC;
uniform float uPulseR;
uniform float uPulseW;
uniform float uPulseG;`).replace("#include <opaque_fragment>",["float pd = (length(vPW - uPulseC) - uPulseR) / uPulseW;","float pf = uPulseR > 0.0 ? exp(-pd * pd) * uPulseG : 0.0;","outgoingLight = outgoingLight * (1.0 + 3.0 * pf) + vec3(0.05, 0.0, 0.0) * pf;","#include <opaque_fragment>"].join(`
`))}function cu(e){return e.onBeforeCompile=t=>O0(t),e.customProgramCacheKey=()=>"ss-pulse",e}const pa={value:1080},xc={value:.5},lu=`
attribute vec4 aThin;
uniform float uPxH;
uniform float uThinMin;
varying float vThinF;`,uu=`
vThinF = 1.0;
if (dot(aThin.xyz, aThin.xyz) > 0.5) {
  vec4 mvT = modelViewMatrix * vec4(transformed, 1.0);
  float halfMin = max(-mvT.z, 1e-4) / (projectionMatrix[1][1] * uPxH * length(modelMatrix[0].xyz)) * 2.0 * uThinMin;
  vThinF = clamp(aThin.w / halfMin, 0.0, 1.0);
  transformed += aThin.xyz * max(halfMin - aThin.w, 0.0);
}`;function Dr(e){e.uniforms.uPxH=pa,e.uniforms.uThinMin=xc,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
${lu}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${uu}`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying float vThinF;`).replace("#include <opaque_fragment>",`outgoingLight *= vThinF;
#include <opaque_fragment>`)}const du={polished:0,grained:1,striped:2,sunray:3,turned:4,brushed:5,blackened:6},fu=`
attribute float aCav;
attribute float aEdge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;
uniform float uObjScale;`,pu=`
vCav = aCav;
vEdge = aEdge;
vOP = position * uObjScale;
vON = normal;
#ifdef USE_INSTANCING
vOP += instanceMatrix[3].xyz * 0.731;
#endif`,hu=`
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
}`,mu=`
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
#ifdef SS_NEAR


  float nearK = 1.0 - smoothstep(uNear * 0.45, uNear, length(vViewPosition));
  scaleM *= 1.0 - nearK; pitM *= 1.0 - nearK; chip *= 1.0 - nearK; scr *= 1.0 - nearK; pitH *= 1.0 - nearK;
#endif
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
float ssH = hF * uBump * (1.0 - scaleM) - pitH - scr * 0.0003 * (1.0 - scaleM);`,vu="{ vec3 vv = normalize(vViewPosition); float fr = smoothstep(0.72, 0.97, 1.0 - abs(dot(normal, vv))); totalEmissiveRadiance += vec3(uRim.w * fr * smoothstep(0.0, 0.5, dot(normal, uRim.xyz)) * (1.0 - 0.8 * scaleM) * (1.0 - pitM)); }",gu="totalEmissiveRadiance += vec3(uLine.x * smoothstep(0.3, 0.85, vEdge) * smoothstep(0.25, 0.7, vON.y) * step(uLine.y, rr) * (1.0 - chip) * (1.0 - pitM) * (0.75 + 0.5 * nzf.r));";function bn(e){const t=ro(),n=ut((e.seed??1)*7331+17),o=new t0({color:16777215,metalness:1,roughness:.3,envMapIntensity:e.envMap??1.15,ior:1.5}),a={tNz:{value:t.noise},tPit:{value:t.pits},tScr:{value:t.scratch},uSeed:{value:new R(n()*40,n()*40,n()*40)},uWear:{value:e.wear??.6},uBump:{value:e.bump??1},uDir:{value:e.stripeDir??.5},uObjScale:{value:e.objScale??1},uTone:{value:e.tone??.62},uRS2:{value:new Ft(0,e.direct??1)},uAge:{value:e.age??.6},uTurn:{value:new R(...e.turn??[.22,.035,1])},uTwist:e.twist??{value:0},uTwistR:{value:e.twistR??1},uNear:{value:e.near??0},uRim:e.rim??{value:new vn},uLine:e.lineU??{value:new Ft(...e.line??[0,0])}},s=e.tier==="low",r=e.twist?`float twA = uTwist * (1.0 - clamp(length(transformed.xz) / uTwistR, 0.0, 1.0));
transformed.xz = mat2(cos(twA), sin(twA), -sin(twA), cos(twA)) * transformed.xz;
`:"";return o.onBeforeCompile=i=>{Object.assign(i.uniforms,a),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${fu}
uniform float uTwist;
uniform float uTwistR;`).replace("#include <begin_vertex>",`#include <begin_vertex>
${pu}
${r}`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#define SS_FIN ${du[e.finish]}
${s?`#define SS_LOW
`:""}${e.near?`#define SS_NEAR
uniform float uNear;
`:""}#include <common>
uniform vec4 uRim;
uniform vec2 uLine;
${hu}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${e.rim?vu:""}
${e.line?gu:""}`).replace("#include <color_fragment>",`#include <color_fragment>
${mu}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = clamp(ssRough, 0.04, 1.0);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = ssMetal;`).replace("#include <aomap_fragment>",`reflectedLight.directSpecular *= uRS2.y;
reflectedLight.directDiffuse *= uRS2.y;
#include <aomap_fragment>`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = bumpN(-vViewPosition, normal, vec2(dFdx(ssH), dFdy(ssH)), faceDirection);`),Dr(i),O0(i)},o.customProgramCacheKey=()=>`ss-steel-${e.finish}-${s?"l":"h"}${e.twist?"-tw":""}${e.rim?"-rim":""}${e.line?"-ln":""}${e.near?"-nr":""}`,Object.assign(o,{ss:a})}const xu=`
uniform vec3 uCamO;
uniform vec3 uCrackP;
uniform vec3 uCrackN;
uniform vec3 uNode;
uniform vec3 uHalf;
uniform float uGlow;
uniform float uHot;
uniform sampler2D tNz;
varying vec3 vOP;`,wu=`
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
totalEmissiveRadiance += glowC;`;function yu(e){const t=ro(),n=new t0({color:new an().setRGB(.0035,0,2e-4),metalness:0,roughness:.02,ior:1.76,envMapIntensity:4.5,specularIntensity:1,emissive:0,flatShading:!1}),o={uCamO:{value:new R},uCrackP:{value:e.crackP??new R},uCrackN:{value:(e.crackN??new R(.3,.2,.93)).normalize()},uNode:{value:e.node??new R},uHalf:{value:e.half},uGlow:{value:e.glow??1},uHot:{value:e.hot??1},tNz:{value:t.noise}};n.onBeforeCompile=r=>{Object.assign(r.uniforms,o),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${xu}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${wu}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(glowC.r * 3.0, 0.0, 1.0);`),O0(r)},n.customProgramCacheKey=()=>"ss-ruby";const a=new ge;return Object.assign(n,{ss:o,aim:(r,i)=>{r.updateMatrixWorld(),a.copy(r.matrixWorld).invert(),o.uCamO.value.setFromMatrixPosition(i.matrixWorld).applyMatrix4(a)}})}function ao(e={}){const t=new t0({color:new an().setRGB(.01,.01,.01),metalness:0,roughness:.12,clearcoat:1,clearcoatRoughness:.075,ior:1.47,specularIntensity:0,envMapIntensity:e.env??6});return t.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <opaque_fragment>",`vec3 ssEx = max(outgoingLight - 0.32, 0.0);
outgoingLight = min(outgoingLight, vec3(0.32)) + ssEx / (1.0 + ssEx * 3.0);
#include <opaque_fragment>`),Dr(n),O0(n)},t.customProgramCacheKey=()=>"ss-oil",t}const un=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),jt=(e,t,n)=>e+(t-e)*n,B0=e=>{const t=un(e);return t*t*(3-2*t)},at=Math.PI*2,Mt=(e,t,n=3)=>Math.max(n,Math.round(e*(t===2?1:t===1?.55:.3)));class Rn{p=[];n=[];c=[];e=[];i=[];th=[];thin(t,n,o,a,s){for(;this.th.length<(t+1)*4;)this.th.push(0);this.th.splice(t*4,4,n,o,a,s)}v(t,n,o,a,s,r,i=0,c=0){return this.p.push(t,n,o),this.n.push(a,s,r),this.c.push(un(i)),this.e.push(un(c)),this.p.length/3-1}tri(t,n,o){const a=this.p,s=t*3,r=n*3,i=o*3,c=a[r]-a[s],l=a[r+1]-a[s+1],d=a[r+2]-a[s+2],u=a[i]-a[s],f=a[i+1]-a[s+1],p=a[i+2]-a[s+2];Math.hypot(l*p-d*f,d*u-c*p,c*f-l*u)<2e-12||this.i.push(t,n,o)}quad(t,n,o,a){this.tri(t,n,o),this.tri(t,o,a)}fixWinding(){const t=this.p,n=this.n,o=this.i;for(let a=0;a<o.length;a+=3){const s=o[a]*3,r=o[a+1]*3,i=o[a+2]*3,c=t[r]-t[s],l=t[r+1]-t[s+1],d=t[r+2]-t[s+2],u=t[i]-t[s],f=t[i+1]-t[s+1],p=t[i+2]-t[s+2],m=l*p-d*f,h=d*u-c*p,v=c*f-l*u;if(m*(n[s]+n[r]+n[i])+h*(n[s+1]+n[r+1]+n[i+1])+v*(n[s+2]+n[r+2]+n[i+2])<0){const w=o[a+1];o[a+1]=o[a+2],o[a+2]=w}}}geometry(){this.fixWinding();const t=new Gn;if(t.setAttribute("position",new wt(this.p,3)),t.setAttribute("normal",new wt(this.n,3)),t.setAttribute("aCav",new wt(this.c,1)),t.setAttribute("aEdge",new wt(this.e,1)),this.th.length){for(;this.th.length<this.p.length/3*4;)this.th.push(0);t.setAttribute("aThin",new wt(this.th,4))}return t.setIndex(this.i),t}}function bu(e){let t=0;for(let n=0;n<e.length;n++){const o=e[n],a=e[(n+1)%e.length];t+=o[0]*a[1]-a[0]*o[1]}return t/2}const Ts=(e,t)=>bu(e)>0===t?e:e.slice().reverse();function Fs(e,t=1e-5){const n=[];for(const o of e){const a=n[n.length-1];(!a||Math.hypot(o[0]-a[0],o[1]-a[1])>t)&&n.push(o)}for(;n.length>2&&Math.hypot(n[0][0]-n[n.length-1][0],n[0][1]-n[n.length-1][1])<=t;)n.pop();return n}function Ba(e,t=2,n){let o=e,a=n??e.map(()=>!1);for(let s=0;s<t;s++){const r=[],i=[];for(let c=0;c<o.length;c++){const l=o[c],d=o[(c+1)%o.length];a[c]?(r.push(l),i.push(!0)):(r.push([l[0]*.75+d[0]*.25,l[1]*.75+d[1]*.25]),i.push(!1)),a[(c+1)%o.length]||(r.push([l[0]*.25+d[0]*.75,l[1]*.25+d[1]*.75]),i.push(!1))}o=r,a=i}return o}const la=(e,t,n=0,o=0,a=0)=>Array.from({length:t},(s,r)=>[n+Math.cos(a+r/t*at)*e,o+Math.sin(a+r/t*at)*e]);function Mu(e,t){const n=e.length,o=new Array(n).fill(0),a=new Array(n).fill(0);for(let s=0;s<n;s++){const r=e[(s-1+n)%n],i=e[s],c=e[(s+1)%n],l=Math.atan2(i[1]-r[1],i[0]-r[0]);let u=Math.atan2(c[1]-i[1],c[0]-i[0])-l;for(;u>Math.PI;)u-=at;for(;u<-Math.PI;)u+=at;o[s]=u}for(let s=0;s<n;s++){let r=0;for(let i=-t;i<=t;i++)r+=o[(s+i+n)%n];a[s]=r}return{raw:o,win:a}}function _n(e,t,n){const o=new Rn,a=n.segs??2,s=n.t/2,r=[{...e,pts:Ts(Fs(e.pts),!0)},...t.map(u=>({...u,pts:Ts(Fs(u.pts),!1)}))],i=[],c=[],l=[];for(const u of r){const f=u.pts,p=f.length,m=Math.min(u.bevel??n.bevel,s*.95),h=u.sink??0,v=Mu(f,Math.max(1,Math.round(p/400))),M=[];for(let A=0;A<p;A++){const B=f[A],oe=f[(A+1)%p],ie=oe[0]-B[0],U=oe[1]-B[1],O=Math.hypot(ie,U)||1;M.push([U/O,-ie/O])}const w=[],x=[],g=[],y=Math.cos((u.sharp??35)*Math.PI/180);for(let A=0;A<p;A++){const B=M[(A-1+p)%p],oe=M[A];let ie=B[0]+oe[0],U=B[1]+oe[1];const O=Math.hypot(ie,U)||1;ie/=O,U/=O,w.push([ie,U]);const D=Math.max(.35,ie*oe[0]+U*oe[1]);x.push(1/D),g.push(B[0]*oe[0]+B[1]*oe[1]<y)}const b=f.map((A,B)=>un(-v.win[B]/1.6)+(u.cav??0)+(u.cavAt?.[B]??0)),z=f.map((A,B)=>un(v.win[B]/1.2)+(u.edgeAt?.[B]??0)),k=[],I=h>0?h:m;for(let A=0;A<=a;A++){const B=A/a*Math.PI/2;if(h>0){const oe=A/a;k.push({inset:I*(1-oe),y:s-I*.55*oe,nu:.72,ns:.69,edge:A===0?.5:.15,cavK:.4+.6*oe})}else k.push({inset:m-m*Math.sin(B),y:s-m+m*Math.cos(B),nu:Math.cos(B),ns:Math.sin(B),edge:A===0?.35:A===a?.45:.9,cavK:.55})}const P=k[a].y,C=u.bottom!==!1,S=C?m:0,F=[];for(let A=a;A>=0;A--){const B=A/a*Math.PI/2;if(F.push(C?{inset:S-S*Math.sin(B),y:-s+S-S*Math.cos(B),nu:-Math.cos(B),ns:Math.sin(B),edge:A===0?.3:A===a?.4:.8,cavK:.55}:{inset:0,y:-s,nu:0,ns:1,edge:.3,cavK:.55}),!C)break}const W=[...k,{inset:0,y:(P+F[0].y)/2,nu:0,ns:1,edge:.2,cavK:.7},...F];for(let A=0;A<p;A++){const B=(A+1)%p,oe=[];for(const ie of W){const U=[];for(const O of[A,B]){const D=g[O]?M[A]:w[O],E=f[O][0]-w[O][0]*ie.inset*x[O],N=f[O][1]-w[O][1]*ie.inset*x[O],V=D[0]*ie.ns,K=D[1]*ie.ns,j=ie.nu,me=Math.hypot(V,j,K)||1;U.push(o.v(E,ie.y,N,V/me,j/me,K/me,b[O]*ie.cavK,ie.edge*(.45+.8*z[O])+(g[O]&&z[O]>0?.25:0)))}oe.push(U)}for(let ie=0;ie<oe.length-1;ie++)o.quad(oe[ie][0],oe[ie+1][0],oe[ie+1][1],oe[ie][1])}i.push(f.map((A,B)=>[A[0]-w[B][0]*k[0].inset*x[B],A[1]-w[B][1]*k[0].inset*x[B]])),c.push(f.map((A,B)=>[A[0]-w[B][0]*F[F.length-1].inset*x[B],A[1]-w[B][1]*F[F.length-1].inset*x[B]])),l.push(b.map(A=>A*.12+(h>0?.35:0)))}const d=u=>u.map(f=>new Ft(f[0],f[1]));for(const u of[!0,!1]){if(u&&n.top===!1||!u&&n.bottomFace===!1)continue;const f=u?i:c,p=d(f[0]),m=f.slice(1).map(d),h=Xi.triangulateShape(p,m),v=o.p.length/3,M=f.flat(),w=l.flat(),x=u?s:-s;M.forEach((g,y)=>o.v(g[0],x,g[1],0,u?1:-1,0,w[y],0));for(const g of h)u?o.tri(v+g[0],v+g[2],v+g[1]):o.tri(v+g[0],v+g[1],v+g[2])}return o.geometry()}function Wt(e,t,n={}){const o=new Rn,a=e.length,s=n.a0??0,r=n.a1??at,i=Math.abs(r-s-at)<1e-6,c=[];for(let u=0;u<a-1;u++){const f=e[u+1].r-e[u].r,p=e[u+1].y-e[u].y,m=Math.hypot(f,p)||1;c.push([p/m,-f/m])}const l=e.map((u,f)=>{if(f===0||f===a-1)return 0;const p=Math.atan2(e[f].y-e[f-1].y,e[f].r-e[f-1].r);let h=Math.atan2(e[f+1].y-e[f].y,e[f+1].r-e[f].r)-p;for(;h>Math.PI;)h-=at;for(;h<-Math.PI;)h+=at;return h}),d=i?t:t+1;for(let u=0;u<a-1;u++){const f=[u,u+1].map(g=>{const b=e[g].smooth&&g>0&&g<a-1?(()=>{const I=c[g-1],P=c[g],C=I[0]+P[0],S=I[1]+P[1],F=Math.hypot(C,S)||1;return[C/F,S/F]})():c[u],z=un(-l[g]/1.2)*.9+(e[g].cav??0),k=un(l[g]/1)+(e[g].edge??0);return{k:g,N:b,cav:z,edge:k}}),p=e[u],m=e[u+1],h=Math.hypot(m.r-p.r,m.y-p.y),v=h>.2?.05/h:0,M=v?[0,v,1-v,1]:[0,1],w=o.p.length/3,x=M.length;for(let g=0;g<d;g++){const y=s+(r-s)*g/t,b=Math.cos(y),z=Math.sin(y);for(const k of M){const I=jt(p.r,m.r,k),P=jt(p.y,m.y,k),C=jt(f[0].N[0],f[1].N[0],k),S=jt(f[0].N[1],f[1].N[1],k),F=Math.hypot(C,S)||1,W=k===0?f[0]:k===1?f[1]:null;o.v(I*b,P,I*z,C/F*b,S/F,C/F*z,W?W.cav:0,W?W.edge:0)}}for(let g=0;g<t;g++){const y=i?(g+1)%t:g+1;for(let b=0;b+1<x;b++){const z=w+g*x+b,k=w+y*x+b,I=jt(p.r,m.r,M[b]),P=jt(p.r,m.r,M[b+1]);I>1e-7&&o.tri(z,k+1,k),P>1e-7&&o.tri(z,z+1,k+1)}}}return o.geometry()}const ii=(e,t,n,o,a)=>{const s=n-e,r=o-t,i=Math.hypot(s,r)||1;return[{r:e,y:t},{r:e+s/i*a,y:t+r/i*a}]};function Su(e,t,n,o,a={}){const s=new Rn,r=e.length,i=a.cs??2,c=[];[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([p,m],h)=>{const v=[0,Math.PI/2,Math.PI,Math.PI*1.5][h];for(let M=0;M<=i;M++){const w=v+M/i*Math.PI/2;c.push({x:p,y:m,nx:Math.cos(w),ny:Math.sin(w),edge:M===0||M===i?.5:1})}});const d=c.length,u=new R,f=new R;for(let p=0;p<r;p++){const m=p/(r-1);u.copy(e[Math.min(r-1,p+1)]).sub(e[Math.max(0,p-1)]).normalize();const h=t[p];f.crossVectors(u,h).normalize();const v=n(m)/2,M=o(m)/2,w=Math.min(v,M)*(a.corner??.45),x=a.cav?a.cav(m):0;for(const g of c){const y=g.x*(v-w)+g.nx*w,b=g.y*(M-w)+g.ny*w,z=e[p],k=h.x*g.nx+f.x*g.ny,I=h.y*g.nx+f.y*g.ny,P=h.z*g.nx+f.z*g.ny,C=s.v(z.x+h.x*y+f.x*b,z.y+h.y*y+f.y*b,z.z+h.z*y+f.z*b,k,I,P,x,g.edge);if(M<v){const S=Math.sign(b)||1;s.thin(C,f.x*S,f.y*S,f.z*S,M)}}}for(let p=0;p<r-1;p++)for(let m=0;m<d;m++){const h=(m+1)%d,v=p*d+m,M=p*d+h,w=(p+1)*d+h,x=(p+1)*d+m;s.quad(v,M,w,x)}if(a.caps!==!1)for(const p of[0,r-1]){const m=new R().copy(e[p===0?1:r-1]).sub(e[p===0?0:r-2]).normalize().multiplyScalar(p===0?-1:1),h=s.p.length/3;for(let v=0;v<d;v++){const M=p*d+v,w=s.v(s.p[M*3],s.p[M*3+1],s.p[M*3+2],m.x,m.y,m.z,.3,.8);s.th.length>M*4&&s.thin(w,s.th[M*4],s.th[M*4+1],s.th[M*4+2],s.th[M*4+3])}for(let v=1;v<d-1;v++)p===0?s.tri(h,h+v+1,h+v):s.tri(h,h+v,h+v+1)}return s.geometry()}function ku(e,t,n,o,a){const s=e.getAttribute("position"),r=e.getAttribute("normal"),i=e.getAttribute("aEdge"),c=e.getAttribute("aCav"),l=Math.hypot(n[0],n[1]),d=n[0]/l,u=n[1]/l,f=u,p=-d,m=new R(d,0,u),h=new Xt,v=new R,M=new R(t[0],0,t[1]);for(let w=0;w<s.count;w++){const x=(s.getX(w)-t[0])*f+(s.getZ(w)-t[1])*p;if(x<=-a)continue;const g=B0((x+a)/(2*a));h.setFromAxisAngle(m,o*g),v.set(s.getX(w),s.getY(w),s.getZ(w)).sub(M).applyQuaternion(h).add(M),s.setXYZ(w,v.x,v.y,v.z),v.set(r.getX(w),r.getY(w),r.getZ(w)).applyQuaternion(h),r.setXYZ(w,v.x,v.y,v.z);const y=1-Math.abs(g*2-1);i.setX(w,un(i.getX(w)+y*.35)),c.setX(w,un(c.getX(w)+y*.25))}return s.needsUpdate=r.needsUpdate=i.needsUpdate=c.needsUpdate=!0,e}function qt(e){const t=e.some(o=>o.getAttribute("aThin")),n=ic(e.map(o=>{if(t&&!o.getAttribute("aThin")&&o.setAttribute("aThin",new wt(new Float32Array(o.getAttribute("position").count*4),4)),!o.index){const a=Array.from({length:o.getAttribute("position").count},(s,r)=>r);o.setIndex(a)}for(const a of["aCav","aEdge"])o.getAttribute(a)||o.setAttribute(a,new wt(new Float32Array(o.getAttribute("position").count),1));for(const a of Object.keys(o.attributes))["position","normal","aCav","aEdge","aThin"].includes(a)||o.deleteAttribute(a);return o}),!1);if(!n)throw new Error("merge failed");return n}function Sn(e,t=0,n=0,o=0,a=0,s=0,r=0,i=1){const c=new ge().compose(new R(t,n,o),new Xt().setFromEuler(new Kn(a,s,r)),new R(i,i,i));return e.applyMatrix4(c)}function zu(e){e.scale(1,-1,1);const t=e.index.array;for(let n=0;n<t.length;n+=3){const o=t[n+1];t[n+1]=t[n+2],t[n+2]=o}return e.index.needsUpdate=!0,e}const ha=(e=[],t=[])=>({pieces:e,inst:t}),y0=(e,t,n=1,o)=>({geo:e,finish:t,seed:n,at:o});function wc(e,t=new R(0,1,0),n=0,o=1){const a=new Xt().setFromUnitVectors(new R(0,1,0),t.clone().normalize());return a.multiply(new Xt().setFromAxisAngle(new R(0,1,0),n)),new ge().compose(e,a,new R(o,o,o))}function yc(e){const t=e.teeth,n=e.r,o=e.detail,a=ut(e.seed*7919+13),s=[],r=[],i=[],c=[],l=(k,I,P,C,S=!1)=>{s.push([Math.cos(I)*k,Math.sin(I)*k]),r.push(P),i.push(C),c.push(S)},d=new Set;for(let k=0;k<(e.sheared??0);k++)d.add(Math.floor(t*(.08+.22*k+a()*.06))%t);const u=at/t;if(e.profile==="club"){const k=n*.2,I=n-k,P=[[-.42,0,1,0],[-.27,.1,.7,0],[-.1,.35,.2,.1],[0,.6,0,.3],[-.02,.72,0,.5],[-.06,.8,0,1],[.2,.9,0,.7],[.5,1,0,1],[.45,.86,0,.5],[.31,.6,.1,.1],[.2,.33,.3,0],[.18,.1,.8,0],[.27,0,1,0]],C=Mt(3,o,1);for(let S=0;S<t;S++){const F=S*u,W=d.has(S);for(let ie=0;ie<P.length;ie++){const[U,O,D,E]=P[ie];let N=O;if(W&&O>.3&&(N=.3+a()*.08),l(I+N*k,F+U*k/(I+N*k),D,W&&O>.3?1:E,ie===5||ie===7),ie<P.length-1&&ie!==5&&ie!==6&&C>1){const[V,K]=P[ie+1];for(let j=1;j<C;j++){const me=j/C,xe=jt(N,W&&K>.3?.32:K,me);l(I+xe*k,F+jt(U,V,me)*k/(I+xe*k),D*(1-me),0)}}}const A=F+.27*k/I,B=F+u-.42*k/I,oe=Mt(4,o,1);for(let ie=1;ie<oe;ie++)l(I,jt(A,B,ie/oe),1,0)}return{pts:s,cav:r,edge:i,keep:c,root:I}}if(e.profile==="ratchet"){const k=Math.min(n*.1,at*n/t*.55),I=n-k;for(let P=0;P<t;P++){const C=P*u;l(I,C,1,0),l(I+k*.5,C+u*.01,.3,.1),l(n,C+u*.03,0,1,!0);for(let S=1;S<=Mt(4,o,2);S++){const F=S/Mt(4,o,2);l(jt(n,I,Math.pow(F,1.25)),C+u*jt(.03,.96,F),F*F*.8,(1-F)*.4)}}return{pts:s,cav:r,edge:i,keep:c,root:I}}const f=e.profile==="leaf"?2*n/(t+1.6):e.profile==="barrel"?2*n/(t+2.2):2*n/(t+2.6),p=e.profile==="leaf"?.8*f:e.profile==="barrel"?1.1*f:1.3*f,m=e.profile==="leaf"?1.9*f:e.profile==="barrel"?1.45*f:1.65*f,h=(e.profile==="leaf"?.21:e.profile==="barrel"?.26:.235)*Math.PI*f,v=n-p,M=v-m,w=Math.min(.42*f,(Math.PI*M/t-h)*.8),x=(p*p+h*h)/(2*h),g=Mt(6,o,3),y=Mt(3,o,2),b=Mt(3,o,1),z=(k,I,P,C)=>{const S=[];for(let F=0;F<=y;F++){const W=F/y*Math.PI/2;S.push([M+w-w*Math.cos(W),h+w-w*Math.sin(W),1-.8*F/y,0,!1])}if(S.push([jt(M+w,v,.5),h*1.01,.12,.05,!1]),P){const F=v-f*(.2+a()*.5);S.push([F,h*1,0,1,!0]);const W=.4+a()*.5;S.push([F+f*.12*W,h*.3,0,1,!0])}else for(let F=0;F<g;F++){const W=F/g*p,A=e.profile==="leaf"?h*Math.sqrt(Math.max(0,1-(W/p)**2)):h-x+Math.sqrt(Math.max(0,x*x-W*W));S.push([v+W,Math.max(A,h*.06),0,.25+.5*F/g,!1])}C||S.reverse();for(const[F,W,A,B,oe]of S)l(F,I+k*W/F,A,B,oe)};for(let k=0;k<t;k++){const I=k*u,P=d.has(k);z(-1,I,P,!0),P||l(n,I,0,1,!1),z(1,I,P,!1);const C=I+(h+w)/M,S=I+u-(h+w)/M;for(let F=1;F<b+1;F++)l(M,jt(C,S,F/(b+1)),1,0)}return{pts:s,cav:r,edge:i,keep:c,root:M}}function Pu(e,t,n,o,a,s,r){const i=ut(s*31+7),c=[],l=o*.12,d=o*.065,u=i()*at,f=w=>jt(l,d,un((w-n)/(t-n)))/2/w,p=Mt(7,a,4),m=Mt(16,a,6),h=(w,x,g,y)=>{const b=[];for(let z=0;z<=p;z++){const k=jt(g,y,z/p);b.push([Math.cos(w+x*f(k))*k,Math.sin(w+x*f(k))*k])}return b},v=(w,x,g)=>{const y=[],b=Math.max(3,Math.round(m*Math.abs(g-x)/1.5));for(let z=1;z<b;z++){const k=jt(x,g,z/b);y.push([Math.cos(k)*w,Math.sin(k)*w])}return y},M=r?1:-1;for(let w=0;w<e;w++){if(w===M)continue;const x=u+w*at/e,g=u+(w+1)*at/e;let y;if(w+1===M){const b=g,z=u+(w+2)*at/e,k=t-(t-n)*(.28+i()*.1),I=n+(t-n)*(.22+i()*.08),P=(C,S,F)=>{const W=[];for(let A=0;A<=4;A++){const B=A/4,oe=C+F*(B*2-1)*f(S),ie=S+(i()-.5)*(t-n)*.07;W.push([Math.cos(oe)*ie,Math.sin(oe)*ie])}return W};y=[...h(x,1,n,t),...v(t,x+f(t),b-f(t)),...h(b,-1,t,k),...P(b,k,1),...h(b,1,k,t),...v(t,b+f(t),z-f(t)),...h(z,-1,t,n),...v(n,z-f(n),b+f(n)).reverse().reverse(),...h(b,1,n,I),...P(b,I,-1),...h(b,-1,I,n),...v(n,b-f(n),x+f(n))],y.length,c.push({pts:Ba(y,a===2?3:2),cav:.15}),w++;continue}y=[...h(x,1,n,t),...v(t,x+f(t),g-f(t)),...h(g,-1,t,n),...v(n,g-f(n),x+f(n))],c.push({pts:Ba(y,a===2?3:2),cav:.15})}return c}function so(e){const t=e.detail??2,n=e.seed??1,o=e.r,a=e.profile??"train",s=e.t??o*2/25,r=yc({teeth:e.teeth,r:o,profile:a,detail:t,seed:n,sheared:e.sheared}),i={pts:Ba(r.pts,t===0?0:1,r.keep),cavAt:[],edgeAt:[],sharp:50};if(t!==0){const m=r.pts;let h=0;i.cavAt=i.pts.map(v=>{for(;h<m.length-1&&Math.hypot(m[h+1][0]-v[0],m[h+1][1]-v[1])<Math.hypot(m[h][0]-v[0],m[h][1]-v[1]);)h++;return r.cav[h]}),h=0,i.edgeAt=i.pts.map(v=>{for(;h<m.length-1&&Math.hypot(m[h+1][0]-v[0],m[h+1][1]-v[1])<Math.hypot(m[h][0]-v[0],m[h][1]-v[1]);)h++;return r.edge[h]})}else i.cavAt=r.cav,i.edgeAt=r.edge;const c=e.bevel??Math.min(s*.16,o*.006),l=[],d=(e.hub??.17)*o,u=e.hole??o*.05;if(e.inner)l.push({pts:la(e.inner,Mt(96,t,24)),bevel:c*1.5});else{const m=r.root-(e.rim??.1)*o;(e.spokes??0)>0&&m>d*1.5&&l.push(...Pu(e.spokes,m,d,o,t,n,!!e.snapped)),l.push({pts:la(u,Mt(32,t,12)),bevel:c*.8,cav:.5})}const f=[_n(i,l,{t:s,bevel:c,segs:t===0?1:2})];if(e.boss!==!1&&!e.inner){const m=s*.55,h=d*.72,v=Math.min(m*.35,h*.1),M=Mt(48,t,16),w=[{r:u,y:s/2-.001},{r:h+v*.5,y:s/2-.001,cav:.7},{r:h,y:s/2+v*.6},{r:h,y:s/2+m-v},{r:h-v,y:s/2+m,edge:.4},{r:u+v*.6,y:s/2+m},{r:u,y:s/2+m-v*.6,edge:.3},{r:u,y:s/2}];f.push(Wt(w,M)),f.push(zu(Wt(w,M)))}let p=qt(f);if(e.fold){const m=ut(n*101+3),h=m()*at,v=e.foldAt??.28;p=ku(p,[Math.cos(h)*o*v,Math.sin(h)*o*v],[-Math.sin(h),Math.cos(h)],e.fold,o*.07)}return p}function La(e){const t=e.detail??2,n=e.length,o=e.ra,a=o*2/8,s=Mt(40,t,12),r=e.pinionR??o*2.6,i=e.pinionH??n*.28,c=e.pinionAt??n*.2,l=e.seatAt??n*.66,d=n*.07,u=[{r:0,y:0},{r:a*.55,y:a*.12,smooth:!0,edge:.6},{r:a*.9,y:a*.5,smooth:!0,edge:.5},{r:a,y:a},{r:a,y:d},{r:a*1.25,y:d+a*.3,cav:.4},{r:o*.8,y:d+(o*.8-a)*1.2},{r:o,y:d+(o-a)*1.5},{r:o,y:c-.02,cav:.3},{r:o*1.15,y:c+.01,cav:.5},{r:o*1.15,y:c+i-.01,cav:.5},{r:o,y:c+i+.02,cav:.3},{r:o,y:l-o*.5},{r:o*1.55,y:l-o*.25},{r:o*1.55,y:l,edge:.5},{r:o*.92,y:l,cav:.9},{r:o*.92,y:l+o*1.2},{r:o*.85,y:l+o*1.6},{r:o*.85,y:n-d-(o*.85-a)*1.5},{r:a*1.25,y:n-d-a*.3,cav:.3},{r:a,y:n-d},{r:a,y:n-a},{r:a*.9,y:n-a*.5,smooth:!0,edge:.5},{r:a*.55,y:n-a*.12,smooth:!0,edge:.6},{r:0,y:n}],f=[Wt(u,s)],p=so({teeth:e.leaves??8,r,profile:"leaf",detail:t,seed:e.seed??3,t:i,boss:!1,hole:o*.5,bevel:Math.min(r*.045,.03)});return Sn(p,0,c+i/2,0),f.push(p),{geo:qt(f),seat:l}}const Au={large:{rh:.9,hh:.55,L:2.2,pitch:.2,thread:!0},medium:{rh:.55,hh:.36,L:1.4,pitch:.14,thread:!0},small:{rh:.22,hh:.16,L:.55,pitch:.08,thread:!1},timing:{rh:.115,hh:.12,L:.3,pitch:.035,thread:!0}};function Ru(e,t,n,o){const a=new Rn,s=e*.8,r=Mt(28,o,10),i=Mt(8,o,4),c=Math.max(4,Math.round(t/n*i)),l=(f,p)=>{const m=((p/n-f/at)%1+1)%1,h=m<.12?m/.12:m<.3?1:m<.42?1-(m-.3)/.12:0,v=un((p+t)/(n*1.5));return s+(e-s)*h*v},d=[];for(let f=0;f<=c;f++){const p=-t+t*f/c,m=[];for(let h=0;h<r;h++){const v=h/r*at,M=l(v,p),w=.01,x=(l(v,p+w)-l(v,p-w))/(2*w),g=new R(Math.cos(v),-x,Math.sin(v)).normalize(),y=(M-s)/(e-s);m.push(a.v(Math.cos(v)*M,p,Math.sin(v)*M,g.x,g.y,g.z,(1-y)*.8,y>.95?.6:0))}d.push(m)}for(let f=0;f<c;f++)for(let p=0;p<r;p++){const m=(p+1)%r;a.quad(d[f][p],d[f][m],d[f+1][m],d[f+1][p])}const u=a.v(0,-t-s*.3,0,0,-1,0,.3,.3);for(let f=0;f<r;f++)a.tri(d[0][f],u,d[0][(f+1)%r]);return a.geometry()}function Eo(e){const t=Au[e.size],n=e.detail??2,o=ut((e.seed??5)*977+1),a=t.rh,s=t.hh,r=a*2/8,i=Math.min(a*2/4,s*.6),c=a*.09,l=Mt(48,n,16),d=[];for(const v of[1,-1]){const M=Math.acos(r/2/a),w=[];for(let y=0;y<=l/2;y++){const b=-M+2*M*y/(l/2);w.push([Math.cos(b)*a,Math.sin(b)*a])}const x=Mt(8,n,3);for(let y=1;y<x;y++){const b=1-y/x,z=e.abused&&o()<.5?o()*r*.35:0;w.push([r/2-z,(b*2-1)*Math.sin(M)*a])}const g=_n({pts:w.map(y=>[y[0]*v,y[1]*v]),sharp:30},[],{t:s,bevel:c,segs:n===0?1:2,bottomFace:!1});if(Sn(g,0,s/2,0),e.abused){const y=g.getAttribute("position"),b=g.getAttribute("aEdge");for(let z=0;z<y.count;z++){const k=Math.abs(y.getX(z)),I=y.getY(z);if(k<r/2+c*2.2&&I>s-c*1.2){const P=y.getZ(z),C=(.5+.5*Math.sin(P*41+v*3))*c*.9;y.setY(z,I+C),b.setX(z,1)}}}d.push(g)}const u=_n({pts:la(a,l)},[],{t:s-i,bevel:c,segs:n===0?1:2,bottomFace:!1});Sn(u,0,(s-i)/2,0);const f=u.getAttribute("aCav"),p=u.getAttribute("position");for(let v=0;v<f.count;v++)p.getY(v)>s-i-1e-4&&f.setX(v,.9);d.push(u);const m=a*.48;t.thread&&n>0?d.push(Ru(m,t.L,t.pitch,n)):d.push(Wt([{r:0,y:-t.L-m*.3},{r:m*.8,y:-t.L},{r:m*.85,y:0}],Mt(16,n,8)));const h=qt(d);return e.slotAngle&&h.rotateY(e.slotAngle),h}function bc(e){const{h:t,r:n}=e,o=n*.08,a=e.detail??2,s=[{r:0,y:0},{r:n*.55,y:0},{r:n*.55,y:t*.03},{r:n*1-o,y:t*.03,cav:.6},{r:n,y:t*.03+o},{r:n,y:t*.1-o},{r:n-o,y:t*.1,edge:.3},{r:n*.78,y:t*.11,cav:.6},{r:n*.7,y:t*.2,smooth:!0},{r:n*.66,y:t*.44,cav:.4},{r:n*.82,y:t*.47},{r:n*.95,y:t*.49,smooth:!0,edge:.5},{r:n*.95,y:t*.51,smooth:!0,edge:.5},{r:n*.82,y:t*.53},{r:n*.66,y:t*.56,cav:.4},{r:n*.7,y:t*.8,smooth:!0},{r:n*.78,y:t*.89,cav:.6},{r:n-o,y:t*.9},{r:n,y:t*.9+o},{r:n,y:t*.97-o},{r:n-o,y:t*.97,edge:.3},{r:n*.55,y:t*.97,cav:.6},{r:n*.55,y:t-o},{r:n*.5,y:t,edge:.3},{r:n*.18,y:t,cav:.8},{r:n*.18,y:t-n*.6},{r:0,y:t-n*.6}];return Wt(s,Mt(48,a,16))}function Cu(e){const{r:t,hole:n,h:o}=e;return Wt([{r:t,y:-o},{r:t,y:-.004},{r:t*.96,y:.012,edge:.8},{r:n*1.6,y:.006,edge:.4},{r:n*1.05,y:-o*.25,cav:.9},{r:n,y:-o*.3,cav:1},{r:n,y:-o}],Mt(40,e.detail??2,14))}function Tu(e){const{L:t,ra:n}=e,o=e.detail??2,a=n/4,s=-t*.45,r=[{r:0,y:s},{r:a*.6,y:s+a*.1,smooth:!0},{r:a,y:s+a*.6},{r:a,y:s+t*.06},{r:n*.7,y:s+t*.1},{r:n*.7,y:s+t*.2},{r:n,y:s+t*.22},{r:n,y:-t*.04},{r:n*1.9,y:-t*.03},{r:n*1.9,y:0,edge:.5},{r:n*.9,y:0,cav:.9},{r:n*.9,y:t*.12},{r:n*.8,y:t*.2},{r:n*.8,y:t*.4},{r:n*.7,y:t*.42},{r:a,y:t*.5},{r:a,y:t*.55-a*.6},{r:a*.6,y:t*.55-a*.1,smooth:!0},{r:0,y:t*.55}],i=[Wt(r,Mt(32,o,12))],c=n*4.2,l=s+t*.14,d=t*.035,u=_n({pts:(()=>{const p=[],m=Mt(40,o,14);for(let h=0;h<m;h++){const v=h/m*at,M=Math.abs((v+Math.PI)%at-Math.PI)<.35?.8:1;p.push([Math.cos(v)*c*M,Math.sin(v)*c*M])}return p})()},[{pts:la(n*.7,16)}],{t:d,bevel:d*.2});Sn(u,0,l,0),i.push(u);const f=Wt([{r:0,y:0},{r:n*.45,y:0},{r:n*.45,y:t*.07},{r:n*.3,y:t*.075},{r:0,y:t*.075}],10);return Sn(f,c*.75,l-t*.075-d/2+.002,0),i.push(f),qt(i)}function Fu(e){const{L:t,ra:n}=e,o=e.detail??2,a=n*.35,s=[Wt([{r:0,y:0},{r:a,y:0},{r:a,y:t*.1},{r:n,y:t*.14},{r:n,y:t*.3},{r:n*1.7,y:t*.31},{r:n*1.7,y:t*.62,edge:.3},{r:n,y:t*.63,cav:.7},{r:n,y:t*.78},{r:a*1.3,y:t*.8},{r:a*1.3,y:t},{r:0,y:t}],Mt(32,o,12))],r=_n({pts:[[-n*.7,-n*.7],[n*.7,-n*.7],[n*.7,n*.7],[-n*.7,n*.7]],sharp:30},[],{t:t*.14,bevel:n*.08});Sn(r,0,t*.87,0),s.push(r);const i=_n({pts:[[0,-n*.25],[n*2.05,-n*.2],[n*2.05,n*.2],[0,n*.25]],sharp:30},[],{t:n*.5,bevel:n*.06});return Sn(i,0,t*.46,0,0,0,0),s.push(i),qt(s)}const xs=0,_u=1,Lu=new R,ci=new tl,Gs=new Ga,li=new R,ns=new nl;class Iu{constructor(){this.tolerance=-1,this.faces=[],this.newFaces=[],this.assigned=new ui,this.unassigned=new ui,this.vertices=[]}setFromPoints(t){if(t.length>=4){this.makeEmpty();for(let n=0,o=t.length;n<o;n++)this.vertices.push(new Eu(t[n]));this._compute()}return this}setFromObject(t){const n=[];return t.updateMatrixWorld(!0),t.traverse(function(o){const a=o.geometry;if(a!==void 0){const s=a.attributes.position;if(s!==void 0)for(let r=0,i=s.count;r<i;r++){const c=new R;c.fromBufferAttribute(s,r).applyMatrix4(o.matrixWorld),n.push(c)}}}),this.setFromPoints(n)}containsPoint(t){const n=this.faces;for(let o=0,a=n.length;o<a;o++)if(n[o].distanceToPoint(t)>this.tolerance)return!1;return!0}intersectRay(t,n){const o=this.faces;let a=-1/0,s=1/0;for(let r=0,i=o.length;r<i;r++){const c=o[r],l=c.distanceToPoint(t.origin),d=c.normal.dot(t.direction);if(l>0&&d>=0)return null;const u=d!==0?-l/d:0;if(!(u<=0)&&(d>0?s=Math.min(u,s):a=Math.max(u,a),a>s))return null}return a!==-1/0?t.at(a,n):t.at(s,n),n}intersectsRay(t){return this.intersectRay(t,Lu)!==null}makeEmpty(){return this.faces=[],this.vertices=[],this}_addVertexToFace(t,n){return t.face=n,n.outside===null?this.assigned.append(t):this.assigned.insertBefore(n.outside,t),n.outside=t,this}_removeVertexFromFace(t,n){return t===n.outside&&(t.next!==null&&t.next.face===n?n.outside=t.next:n.outside=null),this.assigned.remove(t),this}_removeAllVerticesFromFace(t){if(t.outside!==null){const n=t.outside;let o=t.outside;for(;o.next!==null&&o.next.face===t;)o=o.next;return this.assigned.removeSubList(n,o),n.prev=o.next=null,t.outside=null,n}}_deleteFaceVertices(t,n){const o=this._removeAllVerticesFromFace(t);if(o!==void 0)if(n===void 0)this.unassigned.appendChain(o);else{let a=o;do{const s=a.next;n.distanceToPoint(a.point)>this.tolerance?this._addVertexToFace(a,n):this.unassigned.append(a),a=s}while(a!==null)}return this}_resolveUnassignedPoints(t){if(this.unassigned.isEmpty()===!1){let n=this.unassigned.first();do{const o=n.next;let a=this.tolerance,s=null;for(let r=0;r<t.length;r++){const i=t[r];if(i.mark===xs){const c=i.distanceToPoint(n.point);if(c>a&&(a=c,s=i),a>1e3*this.tolerance)break}}s!==null&&this._addVertexToFace(n,s),n=o}while(n!==null)}return this}_computeExtremes(){const t=new R,n=new R,o=[],a=[];for(let s=0;s<3;s++)o[s]=a[s]=this.vertices[0];t.copy(this.vertices[0].point),n.copy(this.vertices[0].point);for(let s=0,r=this.vertices.length;s<r;s++){const i=this.vertices[s],c=i.point;for(let l=0;l<3;l++)c.getComponent(l)<t.getComponent(l)&&(t.setComponent(l,c.getComponent(l)),o[l]=i);for(let l=0;l<3;l++)c.getComponent(l)>n.getComponent(l)&&(n.setComponent(l,c.getComponent(l)),a[l]=i)}return this.tolerance=3*Number.EPSILON*(Math.max(Math.abs(t.x),Math.abs(n.x))+Math.max(Math.abs(t.y),Math.abs(n.y))+Math.max(Math.abs(t.z),Math.abs(n.z))),{min:o,max:a}}_computeInitialHull(){const t=this.vertices,n=this._computeExtremes(),o=n.min,a=n.max;let s=0,r=0;for(let f=0;f<3;f++){const p=a[f].point.getComponent(f)-o[f].point.getComponent(f);p>s&&(s=p,r=f)}const i=o[r],c=a[r];let l,d;s=0,ci.set(i.point,c.point);for(let f=0,p=this.vertices.length;f<p;f++){const m=t[f];if(m!==i&&m!==c){ci.closestPointToPoint(m.point,!0,li);const h=li.distanceToSquared(m.point);h>s&&(s=h,l=m)}}s=-1,Gs.setFromCoplanarPoints(i.point,c.point,l.point);for(let f=0,p=this.vertices.length;f<p;f++){const m=t[f];if(m!==i&&m!==c&&m!==l){const h=Math.abs(Gs.distanceToPoint(m.point));h>s&&(s=h,d=m)}}const u=[];if(Gs.distanceToPoint(d.point)<0){u.push(E0.create(i,c,l),E0.create(d,c,i),E0.create(d,l,c),E0.create(d,i,l));for(let f=0;f<3;f++){const p=(f+1)%3;u[f+1].getEdge(2).setTwin(u[0].getEdge(p)),u[f+1].getEdge(1).setTwin(u[p+1].getEdge(0))}}else{u.push(E0.create(i,l,c),E0.create(d,i,c),E0.create(d,c,l),E0.create(d,l,i));for(let f=0;f<3;f++){const p=(f+1)%3;u[f+1].getEdge(2).setTwin(u[0].getEdge((3-f)%3)),u[f+1].getEdge(0).setTwin(u[p+1].getEdge(1))}}for(let f=0;f<4;f++)this.faces.push(u[f]);for(let f=0,p=t.length;f<p;f++){const m=t[f];if(m!==i&&m!==c&&m!==l&&m!==d){s=this.tolerance;let h=null;for(let v=0;v<4;v++){const M=this.faces[v].distanceToPoint(m.point);M>s&&(s=M,h=this.faces[v])}h!==null&&this._addVertexToFace(m,h)}}return this}_reindexFaces(){const t=[];for(let n=0;n<this.faces.length;n++){const o=this.faces[n];o.mark===xs&&t.push(o)}return this.faces=t,this}_nextVertexToAdd(){if(this.assigned.isEmpty()===!1){let t,n=0;const o=this.assigned.first().face;let a=o.outside;do{const s=o.distanceToPoint(a.point);s>n&&(n=s,t=a),a=a.next}while(a!==null&&a.face===o);return t}}_computeHorizon(t,n,o,a){this._deleteFaceVertices(o),o.mark=_u;let s;n===null?s=n=o.getEdge(0):s=n.next;do{const r=s.twin,i=r.face;i.mark===xs&&(i.distanceToPoint(t)>this.tolerance?this._computeHorizon(t,r,i,a):a.push(s)),s=s.next}while(s!==n);return this}_addAdjoiningFace(t,n){const o=E0.create(t,n.tail(),n.head());return this.faces.push(o),o.getEdge(-1).setTwin(n.twin),o.getEdge(0)}_addNewFaces(t,n){this.newFaces=[];let o=null,a=null;for(let s=0;s<n.length;s++){const r=n[s],i=this._addAdjoiningFace(t,r);o===null?o=i:i.next.setTwin(a),this.newFaces.push(i.face),a=i}return o.next.setTwin(a),this}_addVertexToHull(t){const n=[];return this.unassigned.clear(),this._removeVertexFromFace(t,t.face),this._computeHorizon(t.point,null,t.face,n),this._addNewFaces(t,n),this._resolveUnassignedPoints(this.newFaces),this}_cleanup(){return this.assigned.clear(),this.unassigned.clear(),this.newFaces=[],this}_compute(){let t;for(this._computeInitialHull();(t=this._nextVertexToAdd())!==void 0;)this._addVertexToHull(t);return this._reindexFaces(),this._cleanup(),this}}class E0{constructor(){this.normal=new R,this.midpoint=new R,this.area=0,this.constant=0,this.outside=null,this.mark=xs,this.edge=null}static create(t,n,o){const a=new E0,s=new Us(t,a),r=new Us(n,a),i=new Us(o,a);return s.next=i.prev=r,r.next=s.prev=i,i.next=r.prev=s,a.edge=s,a.compute()}getEdge(t){let n=this.edge;for(;t>0;)n=n.next,t--;for(;t<0;)n=n.prev,t++;return n}compute(){const t=this.edge.tail(),n=this.edge.head(),o=this.edge.next.head();return ns.set(t.point,n.point,o.point),ns.getNormal(this.normal),ns.getMidpoint(this.midpoint),this.area=ns.getArea(),this.constant=this.normal.dot(this.midpoint),this}distanceToPoint(t){return this.normal.dot(t)-this.constant}}class Us{constructor(t,n){this.vertex=t,this.prev=null,this.next=null,this.twin=null,this.face=n}head(){return this.vertex}tail(){return this.prev?this.prev.vertex:null}length(){const t=this.head(),n=this.tail();return n!==null?n.point.distanceTo(t.point):-1}lengthSquared(){const t=this.head(),n=this.tail();return n!==null?n.point.distanceToSquared(t.point):-1}setTwin(t){return this.twin=t,t.twin=this,this}}class Eu{constructor(t){this.point=t,this.prev=null,this.next=null,this.face=null}}class ui{constructor(){this.head=null,this.tail=null}first(){return this.head}last(){return this.tail}clear(){return this.head=this.tail=null,this}insertBefore(t,n){return n.prev=t.prev,n.next=t,n.prev===null?this.head=n:n.prev.next=n,t.prev=n,this}insertAfter(t,n){return n.prev=t,n.next=t.next,n.next===null?this.tail=n:n.next.prev=n,t.next=n,this}append(t){return this.head===null?this.head=t:this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t,this}appendChain(t){for(this.head===null?this.head=t:this.tail.next=t,t.prev=this.tail;t.next!==null;)t=t.next;return this.tail=t,this}remove(t){return t.prev===null?this.head=t.next:t.prev.next=t.next,t.next===null?this.tail=t.prev:t.next.prev=t.prev,this}removeSubList(t,n){return t.prev===null?this.head=n.next:t.prev.next=n.next,n.next===null?this.tail=t.prev:n.next.prev=t.prev,this}isEmpty(){return this.head===null}}class Du extends Gn{constructor(t=[]){super();const n=[],o=[],s=new Iu().setFromPoints(t).faces;for(let r=0;r<s.length;r++){const i=s[r];let c=i.edge;do{const l=c.head().point;n.push(l.x,l.y,l.z),o.push(i.normal.x,i.normal.y,i.normal.z),c=c.next}while(c!==i.edge)}this.setAttribute("position",new wt(n,3)),this.setAttribute("normal",new wt(o,3))}}const Nu=(e,t)=>{let n=!1;for(let o=0,a=t.length-1;o<t.length;a=o++){const s=t[o],r=t[a];s[1]>e[1]!=r[1]>e[1]&&e[0]<(r[0]-s[0])*(e[1]-s[1])/(r[1]-s[1])+s[0]&&(n=!n)}return n},Wu=(e,t)=>{let n=1/0;for(let o=0;o<t.length;o++){const a=t[o],s=t[(o+1)%t.length],r=s[0]-a[0],i=s[1]-a[1],c=un(((e[0]-a[0])*r+(e[1]-a[1])*i)/(r*r+i*i||1));n=Math.min(n,Math.hypot(e[0]-a[0]-c*r,e[1]-a[1]-c*i))}return n};function A0(e){const t=e.detail??2,n=e.t,o=e.bevel??n*.14,a={pts:e.round===0?e.outline:Ba(e.outline,e.round??2),sharp:40},s=[],r=[];for(const i of e.holes??[]){const c=i.bush?i.r*2.2:i.r;if(s.push({pts:la(c,Mt(Math.max(16,Math.round(c*60)),t,12),i.at[0],i.at[1]),bevel:o*.7,sink:i.sink,cav:i.cav??.45}),i.bush){const l=Cu({r:c*1.001,hole:i.r,h:n*.95,detail:t});Sn(l,i.at[0],n/2,i.at[1]),r.push(l)}}if(e.pierce){const i=ut(e.pierce.seed*613+5),c=e.pierce.size,l=e.pierce.margin??c*1.4,d=a.pts.map(p=>p[0]),u=a.pts.map(p=>p[1]),f=(e.holes??[]).map(p=>[p.at,(p.bush?p.r*2.2:p.r)+(p.sink??0)]);for(let p=Math.min(...u),m=0;p<Math.max(...u);p+=c*1.9,m++)for(let h=Math.min(...d)+m%2*c;h<Math.max(...d);h+=c*2.1){const v=[h+(i()-.5)*c*.4,p+(i()-.5)*c*.4];if(!Nu(v,a.pts)||Wu(v,a.pts)<l||f.some(([y,b])=>Math.hypot(y[0]-v[0],y[1]-v[1])<b+c*1.3))continue;const M=i()*at,w=.55+i()*.5,x=Mt(14,t,8),g=[];for(let y=0;y<x;y++){const b=y/x*at,z=1+.45*Math.max(0,Math.cos(b))**3,k=Math.cos(b)*c*.5*z,I=Math.sin(b)*c*.5*w;g.push([v[0]+k*Math.cos(M)-I*Math.sin(M),v[1]+k*Math.sin(M)+I*Math.cos(M)])}s.push({pts:g,bevel:Math.min(o*.6,c*.12),cav:.3}),f.push([v,c*.8])}}return{geo:_n(a,s,{t:n,bevel:o,segs:t===0?1:2}),bushes:r.length?qt(r):null}}function Oa(e,t,n,o,a={}){const s=ut(o*43+9),r=Eo({size:e,detail:a.detail,seed:o}),i=t.map(l=>wc(new R(l[0],n,l[1]),void 0,s()*at)),c=[{geo:r,finish:a.finish??"polished",seed:o,mats:i}];if(a.abused?.length){const l=Eo({size:e,detail:a.detail,seed:o+1,abused:!0});c[0].mats=i.filter((d,u)=>!a.abused.includes(u)),c.push({geo:l,finish:a.finish??"polished",seed:o+1,mats:i.filter((d,u)=>a.abused.includes(u))})}return c}function Ws(e,t,n,o=10){const a=[],s=[],r=c=>e(un(c));for(let c=0;c<=n;c++){const l=c/n,d=r(l-.002),u=r(l+.002),f=u[0]-d[0],p=u[1]-d[1],m=Math.hypot(f,p)||1,h=-p/m,v=f/m,M=r(l),w=t(l);a.push([M[0]+h*w,M[1]+v*w]),s.push([M[0]-h*w,M[1]-v*w])}const i=(c,l,d)=>{const u=r(c),f=t(c),p=Math.atan2(l[1]-u[1],l[0]-u[0]),m=[];for(let h=1;h<o;h++){const v=p+d*Math.PI*h/o;m.push([u[0]+Math.cos(v)*f,u[1]+Math.sin(v)*f])}return m};return[...a,...i(1,a[n],-1),...s.reverse(),...i(0,s[s.length-1],-1)]}function Nr(e){const t=e.detail??2,n=e.seed??4,o=e.length??14,a=e.width??2.6,s=e.t??.7,r=m=>[jt(-o/2,o/2,m),Math.sin(m*Math.PI)*o*.12-m*o*.04],c=Ws(r,m=>a/2*(1.25-.55*m+.35*Math.exp(-(((m-.08)/.1)**2))+.25*Math.exp(-(((m-.62)/.09)**2))),Mt(60,t,20),Mt(14,t,6)),l=(m,h=0)=>{const v=r(m);return[v[0],v[1]+h]},d=[l(.06,-.15),l(.3,.2),l(.97)],u=[...d.map(m=>({at:m,r:.5,sink:.32})),{at:l(.62),r:.14,bush:!0},{at:l(.45),r:.1,bush:!0}],f=A0({outline:c,holes:u,t:s,bevel:.09,detail:t,round:1}),p=Oa("medium",d,s/2-.19,n,{detail:t,abused:[1]});return ha([y0(f.geo,"striped",n),...f.bushes?[y0(f.bushes,"polished",n+1)]:[]],p)}function Hu(e){const t=e.detail??2,n=e.seed??6,o=e.balanceR,a=o*e.table,s=e.t,r=e.h??1.6,i=a*.42,c=-4.318,l=a*.62,d=Mt(48,t,20),u=[],f=Math.asin(i/a);for(let A=0;A<=d;A++){const B=-(Math.PI-f)+2*(Math.PI-f)*A/d;u.push([Math.cos(B)*a,Math.sin(B)*a])}const p=A=>{const B=[];for(let oe=1;oe<8;oe++){const ie=oe/8;B.push([jt(-a*Math.cos(f),c+l*.2,ie),A*jt(i,l,ie*ie)*(1-.18*Math.sin(ie*Math.PI))])}return B};u.push(...p(1));for(let A=0;A<=10;A++){const B=Math.PI/2+Math.PI*A/10;u.push([c+Math.cos(B)*l*.5-l*0,Math.sin(B)*l])}u.push(...p(-1).reverse());const m=[c+l*.15,0],h=A0({outline:u,holes:[{at:m,r:.5,sink:.32},{at:[0,0],r:a*.2}],t:s,bevel:.1,detail:t,round:2});Sn(h.geo,0,-s/2,0);const v=[h.geo],M=A0({outline:(()=>{const A=[];for(let B=0;B<24;B++){const oe=B/24*at;A.push([c+Math.cos(oe)*l*.78,Math.sin(oe)*l*.9])}return A})(),holes:[{at:m,r:.5}],t:r-s,bevel:.08,detail:t,round:0});Sn(M.geo,0,-s-(r-s)/2,0),v.push(M.geo);for(const A of[-1,1]){const B=Wt([{r:0,y:0},{r:.16,y:0},{r:.16,y:.55},{r:.12,y:.62},{r:0,y:.62}],14);B.scale(1,-1,1);const oe=B.index.array;for(let ie=0;ie<oe.length;ie+=3){const U=oe[ie+1];oe[ie+1]=oe[ie+2],oe[ie+2]=U}Sn(B,c-l*.25,-r,A*l*.55),v.push(B)}const w=[],x=.35,g=1.45,y=21;for(let A=0;A<y;A++){const B=jt(x,g,A/(y-1)),oe=A===0||A===y-1||A===(y-1)/2,ie=a*.93,U=a*(oe?.74:.82),O=.022,D=Math.cos(B),E=Math.sin(B),N=_n({pts:[[U*D-O*-E,U*E-O*D],[ie*D-O*-E,ie*E-O*D],[ie*D+O*-E,ie*E+O*D],[U*D+O*-E,U*E+O*D]],cav:.6,sharp:30},[],{t:.025,bevel:.006,segs:1});Sn(N,0,.0125-.006,0),w.push(N)}v.push(qt(w));const b=qt(v),z=A0({outline:(()=>{const A=[];for(let B=0;B<32;B++){const oe=B/32*at;A.push([Math.cos(oe)*a*.38*(1+.45*Math.abs(Math.cos(oe))**4),Math.sin(oe)*a*.3])}return A})(),holes:[{at:[-a*.38,0],r:.2,sink:.12},{at:[a*.38,0],r:.2,sink:.12}],t:.16,bevel:.04,detail:t,round:0});Sn(z.geo,0,.08+.19,0);const k=Ws(A=>[jt(-1.666-.15,a*1.02,A),0],A=>A<.2?.2-A*.35:jt(.13,.045,(A-.2)/.8),Mt(30,t,12),8),I=A0({outline:k,holes:[{at:[0,0],r:a*.25}],t:.14,bevel:.035,detail:t,round:1}),P=Wt([{r:a*.25,y:-.07},{r:a*.34,y:-.07},{r:a*.34,y:.07,edge:.5},{r:a*.25,y:.07}],Mt(40,t,14)),C=[];for(const A of[-1,1]){const B=Wt([{r:0,y:-r*.75},{r:.05,y:-r*.74},{r:.05,y:0},{r:0,y:0}],10);Sn(B,-1.666,-.07,A*.07),C.push(B)}const S=qt([I.geo,P,...C]);S.rotateY(-0),Sn(S,0,.07,0);const F=Oa("small",[[-a*.38,0],[a*.38,0]],.27+.08-.1,n+3,{detail:t}),W=Oa("large",[m],-.32+.05,n+5,{detail:t});return ha([y0(b,"striped",n),y0(z.geo,"polished",n+1),y0(S,"polished",n+2)],[...F,...W])}function Wr(e){const t=e.detail??2,n=e.seed??8,o=.26,a=4.2,s=[],r=[],i=(y,b=!1)=>{s.push(y),r.push(b)};i([a+.02,-.1],!0),i([a-.32,-.1],!0),i([a-.38,-.05]),i([a-.39,0]),i([a-.38,.05]),i([a-.32,.1],!0),i([a+.02,.1],!0),i([a+.07,.17],!0),i([a-.1,.25]),i([a-.45,.22]),i([a-.85,.12]);for(let y=0;y<=6;y++){const b=jt(a-1.1,.7,y/6);i([b,jt(.085,.15,y/6)])}const c=(y,b)=>{const z=[Math.cos(y),Math.sin(y)],k=[-z[1],z[0]],I=.15,P=.085,C=.45,S=(F,W)=>[z[0]*F+k[0]*W,z[1]*F+k[1]*W];return i(S(.45,-I)),i(S(b*.6,-I*.92)),i(S(b,-I),!0),i(S(b,-P),!0),i(S(b-C,-P),!0),i(S(b-C,P),!0),i(S(b,P),!0),i(S(b+.02,I),!0),i(S(b*.6,I*.92)),i(S(.45,I)),{u:z,v:k,La:b,sd:C,sh:P}};i([.42,.24]);const l=c(Math.PI*.6,1.55);i([-.42,.12]),i([-.46,0]),i([-.42,-.12]),c(Math.PI*1.4,1.55),i([.42,-.24]);for(let y=0;y<=6;y++){const b=jt(.7,a-1.1,y/6);i([b,-jt(.15,.085,y/6)])}i([a-.85,-.12]),i([a-.45,-.22]),i([a-.1,-.25]),i([a+.07,-.17],!0);const d=Ba(s,t===0?1:2,r),f=[A0({outline:d,holes:[{at:[0,0],r:.12}],t:o,bevel:.05,detail:t,round:0}).geo],p=Wt([{r:0,y:-.62},{r:.045,y:-.6},{r:.045,y:0},{r:0,y:0}],10);Sn(p,a-.55,-o/2+.01,0),f.push(p);const m=Wt([{r:0,y:-1.2},{r:.05,y:-1.18},{r:.05,y:-.9},{r:.12,y:-.85},{r:.12,y:.55},{r:.05,y:.6},{r:.05,y:.9},{r:0,y:.92}],16);f.push(m);const h=qt(f),v=l.sd+.45,M=l.sh*.97,w=Hr({L:v,w:M,h:o*1.25}).geo,x=new ge().makeRotationY(-Math.atan2(l.u[1],l.u[0])).multiply(new ge().makeTranslation(l.La-l.sd+v/2,0,0)),g=[y0(h,"brushed",n)];return e.stone!==!1&&g.push(y0(w,"ruby",n,x)),ha(g)}function Hr(e){const t=e.L,n=e.w,o=e.h/2,a=e.slant??.16,s=e.b??Math.min(.014,n*.16),r=[[-t/2,-n],[t/2,-n],[t/2-a,n],[-t/2,n]],i=[],c=1,l=[.11*t/.9,.06,.1*o/.1625];let d=new R(0,1,0),u=new R;for(let m=0;m<4;m++){const h=r[m],v=r[(m+3)%4],M=r[(m+1)%4],w=new Ft(v[0]-h[0],v[1]-h[1]).normalize(),x=new Ft(M[0]-h[0],M[1]-h[1]).normalize(),g=(y,b,z)=>new R(h[0]+w.x*y+x.x*b,z,h[1]+w.y*y+x.y*b);for(const y of[1,-1]){if(m===c&&y===1){const b=g(l[0],0,o-s*.5),z=g(0,l[1],o-s*.5),k=g(0,0,o-l[2]);i.push(b,z,k,g(l[0]+s,s,o),g(s,l[1]+s,o),g(s,0,o-l[2]-s*.3),g(0,s,o-l[2]-s*.3)),d=new R().subVectors(z,b).cross(new R().subVectors(k,b)).normalize(),d.dot(new R(h[0],0,h[1]).add(new R(0,o,0)))<0&&d.negate(),u=b.clone().add(z).add(k).multiplyScalar(1/3);continue}i.push(g(s,s,y*o),g(s,0,y*(o-s)),g(0,s,y*(o-s)))}}if(e.side===1){for(const m of i)m.z=-m.z;d.z=-d.z,u.z=-u.z}const f=new Du(i),p=f.getAttribute("position").count;return f.setAttribute("aCav",new wt(new Float32Array(p),1)),f.setAttribute("aEdge",new wt(new Float32Array(p),1)),f.computeBoundingBox(),{geo:f,chip:{at:u,n:d},half:new R(t/2,o,n),corner:new R(t/2,o,(e.side??-1)*n)}}function Mc(e){const t=e.r??2.6;return so({teeth:15,r:t,profile:"club",spokes:4,rim:.07,hub:.2,t:t*.06,detail:e.detail,seed:e.seed??11,sheared:e.sheared,bevel:.018})}function Hs(e){const t=typeof e.w=="number"?(()=>e.w):e.w,n=typeof e.t=="number"?(()=>e.t):e.t;return Su(e.pts,e.side,t,n,{cs:e.detail===0?1:2,cav:e.cav})}function Br(e){const t=e.detail??2,n=e.rIn??.42,o=e.rOut??2.75,a=e.turns??13,s=e.t??.03,r=e.h??s*6.5,i=e.angle??0,c=Mt(150,t,40),l=Math.round(a*c),d=[],u=[],f=new R(0,1,0),p=i/at*.55;for(let z=0;z<=l;z++){const k=z/l,I=at*a*k+i*(1-k),P=n+(o-n)*Math.pow(k,1+p*(1-k)*2),C=i*.05*o*k;d.push(new R(Math.cos(I)*P+C,0,Math.sin(I)*P)),u.push(f)}const m=e.overcoil??!0,h=at*a,v=m?Mt(110,t,30):0,M=r*2.4;for(let z=1;z<=v;z++){const k=z/v,I=h+at*.72*k,P=o-o*.34*Math.min(1,k*1.6)**1.5,C=M*Math.min(1,k*3)**2*(3-2*Math.min(1,k*3));d.push(new R(Math.cos(I)*P+i*.05*o,C,Math.sin(I)*P)),u.push(f)}const w=Hs({pts:d,side:u,w:r,t:s,detail:t}),x=Wt([{r:.16,y:-r*.7},{r:n+.02,y:-r*.7},{r:n+.02,y:r*.7,edge:.4},{r:.16,y:r*.7}],Mt(32,t,12));x.rotateY(-i);const g=d[d.length-1],y=h+(m?at*.72:0),b=_n({pts:[[-.16,-.12],[.16,-.12],[.16,.12],[-.16,.12]],sharp:30},[],{t:r*2.2,bevel:.025,segs:1});return b.rotateY(-y),Sn(b,g.x*1.04,g.y,g.z*1.04),{geo:qt([w,x,b]),outer:o}}function Bu(e){const t=e.detail??2,n=e.seed??21,o=e.R,a=e.angle??0,s=o*.075,r=o*.085,i=e.screws,c=new ge().makeRotationY(-a),l=[],d=[],u=Mt(12,t,6),f=k=>o*(.06+.05*Math.exp(-((k/(o*.25))**2)));for(let k=0;k<=u;k++){const I=jt(-3.2725,o-s*.5,k/u);d.push([I,f(I)])}for(let k=u;k>=0;k--){const I=jt(-3.2725,o-s*.5,k/u);d.push([I,-f(I)])}const p=_n({pts:d},[{pts:la(o*.05,16),cav:.5}],{t:r*.8,bevel:r*.1,segs:t===0?1:2});l.push(p);const m=.035,h=Mt(90,t,30);for(const k of[0,1]){const I=k*Math.PI-.08,P=k*Math.PI+Math.PI-.08-m*2,C=[];for(let S=0;S<=h;S++){const F=jt(I,P,S/h);C.push([Math.cos(F)*o,Math.sin(F)*o])}for(let S=h;S>=0;S--){const F=jt(I,P,S/h);C.push([Math.cos(F)*(o-s),Math.sin(F)*(o-s)])}l.push(_n({pts:C,sharp:40},[],{t:r,bevel:r*.12,segs:t===0?1:2}))}const v=Tu({L:e.staffL,ra:o*.022,detail:t});l.push(v);const M=qt(l).applyMatrix4(c),w=ut(n*17+3),x=[];for(let k=0;k<i;k++){const I=(k+.5)/i*at+.03,P=wc(new R(Math.cos(I)*(o+.04),0,Math.sin(I)*(o+.04)),new R(Math.cos(I),0,Math.sin(I)),w()*at);x.push(c.clone().multiply(P))}const g=Eo({size:"timing",detail:t,seed:n+2}),y=r/2+.3,b=Br({rOut:e.springR,angle:a,detail:t});Sn(b.geo,0,y,0);const z=[{geo:g,finish:"polished",seed:n+2,mats:x}];return{...ha([y0(M,"polished",n),y0(b.geo,"blackened",n+1)],z),hairspringY:y}}function Ou(e){const t=e.detail??2,n=e.w??1.9,o=n/12,a=e.inner,s=e.outer??5.2,r=e.coils,i=e.throwLen,c=ut((e.seed??2)*211+1),l=[],d=[],u=Math.round(r*Mt(90,t,30));for(let x=0;x<=u;x++){const g=x/u,y=g*r*at,b=jt(a,s,Math.pow(g,.8))+Math.sin(g*37)*.03;l.push(new R(Math.cos(y)*b,0,Math.sin(y)*b)),d.push(new R(0,1,0))}const f=l[l.length-1].clone(),p=r*at,m=new R(-Math.sin(p),0,Math.cos(p)),h=new R(Math.cos(p),0,Math.sin(p)),v=Mt(260,t,80),M=c()*at;for(let x=1;x<=v;x++){const g=x/v,y=g*i,b=f.clone().addScaledVector(m,y*.9).addScaledVector(h,Math.sin(g*Math.PI*1.6+M*.1)*i*.22+g*i*.15).add(new R(0,Math.sin(g*Math.PI)*i*.32-Math.sin(g*Math.PI*2.2)*i*.12,0));l.push(b);const z=B0(g*1.6)*Math.PI*.5+Math.sin(g*7)*.25;d.push(new R(0,Math.cos(z),0).addScaledVector(h,Math.sin(z)).normalize())}for(let x=0;x<l.length;x++){const g=l[Math.min(l.length-1,x+1)].clone().sub(l[Math.max(0,x-1)]).normalize();d[x].addScaledVector(g,-d[x].dot(g)).normalize()}const w=x=>x>.985?.5+(1-x)*30:1;return Hs({pts:l,side:d,w:x=>n*w(x),t:o,detail:t,cav:x=>x<u/l.length?.35:0})}function Vu(e){const t=e.detail??2,n=e.seed??31,o=e.R??6,a=2.4,s=.28,r=Mt(96,t,32),i=Wt([{r:0,y:0},{r:o-.1,y:0},{r:o,y:.1},{r:o,y:a-.06},{r:o-.05,y:a,edge:.8},{r:o-s,y:a,edge:.6},{r:o-s,y:.3,cav:.9},{r:1.1,y:.3,cav:.7},{r:1.1,y:.65},{r:.7,y:.7},{r:.55,y:.7},{r:.55,y:-.1},{r:0,y:-.1}],r),c=so({teeth:84,r:o+.55,profile:"barrel",inner:o-.05,t:.5,detail:t,seed:n,boss:!1,bevel:.04});Sn(c,0,.45,0);const l=Wt([{r:0,y:0},{r:o-.35,y:0},{r:o-.3,y:.05},{r:o-.3,y:.22},{r:o-.38,y:.26,edge:.7},{r:.9,y:.26},{r:.9,y:.4},{r:.5,y:.4},{r:0,y:.4}],r),d=new ge().compose(new R(-o*1.95,.2,-o*.55),new Xt().setFromEuler(new Kn(.3,0,.38,"ZYX")),new R(1,1,1)),u=Fu({L:a+1.6,ra:.42,detail:t});Sn(u,0,-.4,0);const f=so({teeth:40,r:2.6,profile:"ratchet",spokes:0,hole:.3,t:.55,detail:t,seed:n+1,bevel:.05});f.rotateY(.3),Sn(f,0,a+1.05,0);const m=_n({pts:[[0,-.25],[1.6,-.15],[2.15,-.45],[2.3,-.25],[1.75,.25],[0,.3],[-.3,0]],sharp:30},[],{t:.45,bevel:.06});Sn(m,2.15,a+1.05,1.2,0,-.5,0);const h=Ou({inner:1.3,outer:o-s-.1,coils:4,throwLen:9,detail:t,seed:n});return Sn(h,0,1.3,0),ha([y0(qt([i,c]),"turned",n),y0(l,"sunray",n+1,d),y0(qt([u,f,m]),"grained",n+2),y0(h,"blackened",n+3)])}function Sc(e){const t=e.detail??2,n=e.seed??41,o=ut(n*7+11),[a,s,r]=e.box,i=e.centre??[0,0,0],c=(()=>{const h=[],v=[],M=Mt(24,t,8);for(let w=0;w<=M;w++){const x=w/M,g=x*4.2,y=.12+x*.1;h.push(new R(Math.cos(g)*y,x*.12,Math.sin(g)*y)),v.push(new R(0,1,0))}return Hs({pts:h,side:v,w:.05,t:.012,detail:0})})(),l=(()=>{const h=yc({teeth:80,r:5,profile:"train",detail:1,seed:1}),v=Math.round(h.pts.length/80),M=h.pts.slice(0,v-1).map(w=>[w[0]-4.8,w[1]]);return _n({pts:M,sharp:30},[],{t:.4,bevel:.02,segs:1})})(),d=(()=>{const h=[],v=ut(n+5);for(let M=0;M<7;M++){const w=M/7*at;h.push([Math.cos(w)*(.1+v()*.12),Math.sin(w)*(.1+v()*.12)])}return _n({pts:h,sharp:25},[],{t:.04,bevel:.01,segs:1})})(),u=Wt([{r:0,y:-.02},{r:.025,y:0},{r:0,y:.02}],4),f=Eo({size:"small",detail:t>1?1:0,seed:n+9}),p=[[c,.22,"polished",.8],[l,.05,"brushed",1],[d,.3,"blackened",1.2],[f,.03,"polished",1],[u,.4,"blackened",1.5]],m=[];return p.forEach(([h,v,M,w],x)=>{const g=Math.max(1,Math.round(e.count*v)),y=[];for(let b=0;b<g;b++){const z=o(),k=w*(z<.6?.55+o()*.3:z<.9?1+o()*.4:1.8+o()*.6),I=new R(i[0]+(o()-.5)*a,i[1]+(o()-.5)*s,i[2]+(o()-.5)*r),P=new Xt().setFromEuler(new Kn(o()*at,o()*at,o()*at));y.push(new ge().compose(I,P,new R(k,k,k)))}m.push({geo:h,finish:M,seed:n+x,mats:y})}),ha([],m)}const ua=(e=0,t=0,n=0)=>new R(e,t,n);function vo(e,t,n,o={}){const a=new Rn,s=e.length,r=[];for(let u=0;u<s;u++)r.push(e[Math.min(s-1,u+1)].clone().sub(e[Math.max(0,u-1)]).normalize());const i=[0];for(let u=1;u<s;u++)i.push(i[u-1]+e[u].distanceTo(e[u-1]));const c=i[s-1]||1;let l=Math.abs(r[0].y)<.9?ua(0,1,0):ua(1,0,0);l=l.sub(r[0].clone().multiplyScalar(l.dot(r[0]))).normalize();const d=[];for(let u=0;u<s;u++){l.sub(r[u].clone().multiplyScalar(l.dot(r[u]))).normalize();const f=r[u].clone().cross(l),p=i[u]/c,m=.001,h=(t(Math.min(1,p+m))-t(Math.max(0,p-m)))/(2*m*c),v=t(p),M=[];for(let w=0;w<n;w++){const x=w/n*at,g=l.clone().multiplyScalar(Math.cos(x)).add(f.clone().multiplyScalar(Math.sin(x))),y=g.clone().sub(r[u].clone().multiplyScalar(h)).normalize(),b=e[u].clone().add(g.multiplyScalar(v)),z=a.v(b.x,b.y,b.z,y.x,y.y,y.z,o.cav?o.cav(p):0,0);if(v>0){const k=g.clone().normalize();a.thin(z,k.x,k.y,k.z,v)}M.push(z)}d.push(M)}for(let u=0;u+1<s;u++)for(let f=0;f<n;f++){const p=d[u][f],m=d[u][(f+1)%n],h=d[u+1][(f+1)%n],v=d[u+1][f];a.quad(p,m,h,v)}if(o.caps??!0)for(const[u,f]of[[0,-1],[s-1,1]]){const p=r[u].clone().multiplyScalar(f),m=e[u].clone().add(p.clone().multiplyScalar(t(u?1:0)*.8)),h=a.v(m.x,m.y,m.z,p.x,p.y,p.z);for(let v=0;v<n;v++)a.tri(h,d[u][v],d[u][(v+1)%n])}return a.geometry()}function kc(e,t,n,o,a=0){const s=t.clone().sub(e).cross(ua(0,1,0)).normalize();return Array.from({length:o+1},(r,i)=>{const c=i/o,l=4*c*(1-c);return e.clone().lerp(t,c).add(ua(0,-n*l*(1+.25*l),0)).add(s.clone().multiplyScalar(a*Math.sin(c*Math.PI)*Math.sin(c*at)))})}function qo(e){const t=e.detail??2,n=e.r??.06,o=un(e.phase??0),a=ut(e.seed??1),s=e.a.distanceTo(e.b),r=Mt(14,t,6),i=Mt(90,t,16),c=(a()-.5)*s*.06,l=u=>n*2.6*Math.exp(-((u*s/(n*5))**2));if(o<.92){const u=kc(e.a,e.b,(e.sag??s*.12)*(1+o*.8),i,c),f=.5+(a()-.5)*.2;return vo(u,m=>n*(1-.86*o*Math.exp(-(((m-f)/(.12+.2*(1-o)))**2)))+l(m)+l(1-m),r)}const d=(u,f,p)=>{const m=s*(.25+(o-.92)*3)*(.8+.4*p),h=f.clone().sub(u).normalize(),v=Array.from({length:i/2+1},(M,w)=>{const x=w/(i/2);return u.clone().add(h.clone().multiplyScalar(m*.35*Math.sin(x*1.4))).add(ua(0,-m*x*x,0))});return vo(v,M=>n*(.55+.5*Math.exp(-(((M-.93)/.07)**2))*1.8)*(1-.3*M)+l(M),r)};return qt([d(e.a,e.b,0),d(e.b,e.a,1)])}function qu(e){const t=e.detail??2,n=e.r,o=un(e.phase),a=e.beads,s=e.a.distanceTo(e.b),r=kc(e.a,e.b,e.sag,Mt(160,t,30)),i=o*.04;return vo(r,l=>{const d=Math.max(0,Math.cos(at*a*(l-i)+Math.PI))**3*B0(l*8)*B0((1-l)*8);return n*(1-.65*o)+n*2.4*o*d+n*2*Math.exp(-((l*s/(n*5))**2))+n*2*Math.exp(-(((1-l)*s/(n*5))**2))},Mt(14,t,6))}function Gu(e,t,n={}){const o=n.detail??2,a=un(n.phase??0),s=n.t??.006,r=Mt(16,o,5),i=e.length-1,c=ut(n.seed??3),l=9,d=5,u=Array.from({length:(l+1)*(d+1)},()=>c()),f=(M,w)=>{const x=M*l,g=w*d,y=Math.min(l-1,Math.floor(x)),b=Math.min(d-1,Math.floor(g)),z=B0(x-y),k=B0(g-b),I=(P,C)=>u[C*(l+1)+P];return jt(jt(I(y,b),I(y+1,b),z),jt(I(y,b+1),I(y+1,b+1),z),k)},p=(M,w)=>{const x=w/r;return e[M].clone().lerp(t[M],x).add(ua(0,-(n.sag??.15)*4*x*(1-x),0))},m=new Rn,h=.2+a*.55,v=[[],[]];for(let M=0;M<2;M++)for(let w=0;w<=i;w++){const x=[];for(let g=0;g<=r;g++){const y=p(w,g),b=p(Math.min(i,w+1),g).sub(p(Math.max(0,w-1),g)),z=p(w,Math.min(r,g+1)).sub(p(w,Math.max(0,g-1))),k=b.cross(z).normalize().multiplyScalar(M?-1:1),I=y.clone().add(k.clone().multiplyScalar(s*.5));x.push(m.v(I.x,I.y,I.z,k.x,k.y,k.z))}v[M].push(x)}for(let M=0;M<i;M++)for(let w=0;w<r;w++){const x=(M+.5)/i,g=(w+.5)/r,y=Math.min(g,1-g)*2;if(!(f(x,g)*(.6+y)<h&&y>.15))for(let b=0;b<2;b++)m.quad(v[b][M][w],v[b][M+1][w],v[b][M+1][w+1],v[b][M][w+1])}return m.geometry()}function os(e={}){const t=e.detail??2,n=e.R??.6,o=e.rIn??.12,a=e.phase??0,s=n*(.42+.1*Math.sin(a*at)),r=[],i=Mt(18,t,6);r.push({r:n*1.04,y:0,smooth:!0});for(let c=0;c<=i;c++){const l=c/i*Math.PI*.5,d=jt(o*1.15,n,Math.cos(l));r.push({r:d,y:s*Math.sin(l)**.8+n*.03*(1-Math.cos(l)),smooth:!0})}return r.push({r:o*1.15,y:s*1.08,smooth:!0},{r:o,y:s*1.25,smooth:!0},{r:o,y:s*.4,smooth:!0}),Wt(r.reverse(),Mt(48,t,14))}const Ho=e=>e==="high"?2:e==="mid"?1:0;function di(e,t,n){if(e.finish==="oil")return ao();if(e.finish==="ruby"){e.geo.computeBoundingBox();const o=e.geo.boundingBox,a=o.getSize(new R).multiplyScalar(.5),s=o.getCenter(new R);return yu({half:a,crackP:s.clone().add(new R(a.x*.15,0,0)),crackN:new R(.85,.25,.45),node:s.clone().add(new R(a.x*.55,a.y*.1,-a.z*.2))})}return bn({finish:e.finish,seed:e.seed,wear:n,tier:t})}function Uu(e,t,n={}){const o=new zt,a=n.wear??.6;for(const s of e.pieces){const r=di(s,t,a),i=new ot(s.geo,r);s.at&&i.applyMatrix4(s.at),i.castShadow=i.receiveShadow=n.shadows??t!=="low";const c=r.aim;c&&(i.onBeforeRender=(l,d,u)=>c(i,u)),o.add(i)}for(const s of e.inst){if(!s.mats.length)continue;const r=di(s,t,a),i=new Fn(s.geo,r,s.mats.length);s.mats.forEach((c,l)=>i.setMatrixAt(l,c)),i.instanceMatrix.needsUpdate=!0,i.castShadow=i.receiveShadow=n.shadows??t!=="low",i.computeBoundingSphere(),o.add(i)}return o}const Z0=(e=[],t=[])=>({pieces:e,inst:t}),on=(e,t,n=1,o,a,s)=>({geo:e,finish:t,seed:n,name:o,at:a,wear:s});function kn(e,t,n,o,a={}){const s=[];for(let l=0;l<t;l++)for(let d=0;d<n;d++)s.push(o(l,d));const r=(l,d)=>(a.wrapJ?d=(d+n)%n:d=Math.max(0,Math.min(n-1,d)),l=Math.max(0,Math.min(t-1,l)),s[l*n+d].p),i=e.p.length/3;for(let l=0;l<t;l++)for(let d=0;d<n;d++){const u=s[l*n+d],f=u.p;let p=a.nrm?.(f,l,d)??null;if(!p){let m=r(l+1,d),h=r(l-1,d),v=r(l,d+1),M=r(l,d-1),w=[m[0]-h[0],m[1]-h[1],m[2]-h[2]],x=[v[0]-M[0],v[1]-M[1],v[2]-M[2]];if(Math.hypot(x[0],x[1],x[2])<1e-9){const y=l===0?1:t-2;v=r(y,d+1),M=r(y,d-1),x=[v[0]-M[0],v[1]-M[1],v[2]-M[2]]}Math.hypot(w[0],w[1],w[2])<1e-9&&(m=r(l+1,d+1),h=r(l-1,d-1),w=[m[0]-h[0],m[1]-h[1],m[2]-h[2]]),p=[w[1]*x[2]-w[2]*x[1],w[2]*x[0]-w[0]*x[2],w[0]*x[1]-w[1]*x[0]];let g=Math.hypot(p[0],p[1],p[2]);if(g<1e-12&&(p=a.out?a.out(f,l,d):[0,1,0],g=Math.hypot(p[0],p[1],p[2])||1),p=[p[0]/g,p[1]/g,p[2]/g],a.out){const y=a.out(f,l,d);p[0]*y[0]+p[1]*y[1]+p[2]*y[2]<0&&(p=[-p[0],-p[1],-p[2]])}}e.v(f[0],f[1],f[2],p[0],p[1],p[2],u.cav??0,u.edge??0)}const c=a.wrapJ?n:n-1;for(let l=0;l<t-1;l++)for(let d=0;d<c;d++){const u=(d+1)%n,f=i+l*n+d,p=i+l*n+u,m=i+(l+1)*n+u,h=i+(l+1)*n+d;e.quad(f,p,m,h)}return i}function $u(e){const t=ut(e*977+13),n=256,o=new Float32Array(n*n).map(()=>t()),a=(s,r)=>o[(r%n+n)%n*n+(s%n+n)%n];return(s,r)=>{const i=Math.floor(s),c=Math.floor(r),l=s-i,d=r-c,u=l*l*(3-2*l),f=d*d*(3-2*d),p=a(i,c)+(a(i+1,c)-a(i,c))*u,m=a(i,c+1)+(a(i+1,c+1)-a(i,c+1))*u;return p+(m-p)*f}}function $s(e,t=3){const n=Array.from({length:t},(o,a)=>$u(e+a*31));return(o,a)=>{let s=0,r=.5,i=0;for(let c=0;c<t;c++)s+=n[c](o*(1<<c)+c*17.3,a*(1<<c)-c*9.1)*r,i+=r,r*=.5;return s/i}}function ju(e,t,n,o,a,s={}){return kn(e,t,n,(r,i)=>{const c=r/(t-1)*Math.PI,l=i/n*Math.PI*2;return{p:o(c,l),cav:s.cav?.(c)??0}},{wrapJ:!0,out:r=>[r[0]-a[0],r[1]-a[1],r[2]-a[2]]})}function zc(e,t,n,o,a,s,r=0){const i=t.length;return kn(e,i,a,(c,l)=>{const d=c/(i-1),u=c,f=t[u],p=t[Math.min(i-1,u+1)].clone().sub(t[Math.max(0,u-1)]).normalize(),m=n[u].clone().sub(p.clone().multiplyScalar(n[u].dot(p))).normalize(),h=p.clone().cross(m),v=l/a*Math.PI*2,M=o(d,v),w=f.clone().addScaledVector(m,Math.cos(v)*M).addScaledVector(h,Math.sin(v)*M);return{p:[w.x,w.y,w.z],edge:r*un(Math.abs(Math.cos(v*2)))}},{wrapJ:!0,out:(c,l)=>{const d=t[l];return[c[0]-d.x,c[1]-d.y,c[2]-d.z]}})}const Oe={dialR:21.5,enamelT:.15,baseT:.25,dome:.12,chapterIn:13.25,chapterOut:20.85,recess:.045,numeralR:15.2,numeralH:3.1,numeralT:.25,trackIn:19.15,trackOut:20.15,hourIn:18.55,hole:1.15,handY:{hour:.32,minute:.62,second:.94},crystalR:22.25,crystalY:1.35,crystalT:1.2,crystalDome:1.45,caseIn:22.45,caseOut:25,caseTop:2.35,caseBottom:-6.2,lidDome:2.55,lidT:.55,hinge:{x:-25.55,y:2.2,r:.95,len:11.2},crownR:2.7,crownLen:2.9},w0=e=>-.12*(e/Oe.dialR)**2-(e>Oe.chapterIn&&e<Oe.chapterOut?Oe.recess:0),ya=e=>-.12*(e/Oe.dialR)**2,ba=(e,t)=>[Math.sin(e)*t,-Math.cos(e)*t],Ku=Math.PI/180;function Yu(e={}){const t=e.seed??5,n=e.detail??2,o=ut(t*131+7),a=Oe.dialR,s=e.impact??[-13,.8],r=Math.atan2(-s[1],-s[0]),i=Math.hypot(s[0],s[1]),l=(e.cracks??[-145,-112,-82,null,22,55,98,140,176].map((S,F)=>S===null?r:(S+(F===2?(o()-.5)*3:(o()-.5)*7))*Ku)).map(S=>S),d=l.length,u=l.map((S,F)=>{const W=[o()*6,o()*6,o()*6,o()*6],A=.25+o()*.2,B=Math.abs(S-r)<1e-6;return oe=>{const ie=O=>Math.abs((O%2+2)%2-1)*2-1;let U=A*Math.sin(oe*.33+W[0])+.13*Math.sin(oe*1.07+W[1])+.05*Math.sin(oe*3.1+W[2])+.022*ie(oe*1.9+W[3])+.01*ie(oe*5.3+W[0]);return U-=A*Math.sin(W[0])+.13*Math.sin(W[1])+.05*Math.sin(W[2])+.022*ie(W[3])+.01*ie(W[0]),B&&(U*=B0(Math.abs(oe-i)/2.5)),U*B0(oe/1.6)*(F===2?.6:1)}}),f=(S,F)=>l[S%d]+(S>=d?at:0)+Math.atan2(u[S%d](F),Math.max(F,.4)),p=S=>{const F=Math.cos(S),W=Math.sin(S),A=s[0]*F+s[1]*W,B=s[0]*s[0]+s[1]*s[1]-a*a;return-A+Math.sqrt(A*A-B)},m=l.map(()=>[0,1].map(()=>{const S=[];for(let F=.6+o()*.5;F<36;F+=.35+o()*1.4){const W=.07+o()*.26*(o()<.1?2.2:1);S.push({c:F,w:W,h:W*(.18+o()*.32)})}return S})),h=e.shardSector??6,v=l.findIndex(S=>Math.abs(S-r)<1e-6),M={c:6.4+o()*.6,w:1.7,h:1.25},w=(S,F,W,A,B)=>{let oe=0;for(const U of m[S][F]){const O=(W-U.c)/U.w;O>-1&&O<1&&(oe=Math.max(oe,U.h*Math.sqrt(1-O*O)))}let ie=A?.03+oe*.18:.028+oe;if(B===h&&F===1){const U=(W-M.c)/M.w;if(U>-1&&U<1){const O=M.h*Math.pow(1-Math.abs(U),.85)*(1+.12*Math.sin(W*9+t));ie=Math.max(ie,A?O*.86:O+.03)}}if(S===v){const U=W-i;Math.abs(U)<Oe.hole&&(ie=Math.max(ie,Math.sqrt(Oe.hole*Oe.hole-U*U)+(A?0:.04)))}return ie},x=(S,F)=>(S===v&&Math.abs(F-i)<Oe.hole?Math.sqrt(Oe.hole*Oe.hole-(F-i)**2):0)+.006,g=[.62,.34,.2][n],y=S=>.75+.4*Math.abs(Math.sin(S*3.7+t)*Math.sin(S*7.3)),b=(S,F)=>{const W=Math.hypot(S-s[0],F-s[1]);let A=Math.atan2(F-s[1],S-s[0]);for(let B=0;B<d;B++){const oe=f(B,W),ie=f(B+1,W);let U=A;for(;U<oe;)U+=at;for(;U>=oe+at;)U-=at;if(U<ie)return B}return 0},z=[];for(let S=0;S<d;S++){const F=S,W=S+1,A=l[S],B=S+1<d?l[S+1]:l[0]+at,oe=Math.max(...Array.from({length:9},(ae,Y)=>p(A+(B-A)*Y/8))),ie=(ae,Y,J,pe)=>{let Se=A+(B-A)*ae,Ee=Y(Se);for(let He=0;He<4;He++){const ct=f(F,Ee)+J(Ee)/Math.max(Ee,.3),mt=f(W,Ee)-pe(Ee)/Math.max(Ee,.3);Se=ct+(mt-ct)*ae,Ee=Y(Se)}return[s[0]+Math.cos(Se)*Ee,s[1]+Math.sin(Se)*Ee,Se]},U=Math.max(6,Math.ceil(oe/g)),O=Math.max(4,Math.ceil((B-A)*oe/g)),D=new Rn,E=[.14,.06,.02,0],N=[0,.012,.045,.1],V=2+U+E.length,K=ae=>Y=>{const J=p(Y),pe=y(Y);return ae===0?pe:ae===1?pe+.09:ae<2+U?pe+.22+(J-.16-pe-.22)*(ae-2)/(U-1):J-E[ae-2-U]},j=ae=>w(F%d,1,ae,!1,S),me=ae=>w(W%d,0,ae,!1,S),xe=ae=>w(F%d,1,ae,!0,S),Me=ae=>w(W%d,0,ae,!0,S),q=(ae,Y)=>{const J=Math.hypot(ae,Y),pe=g*.45;for(const Se of[Oe.chapterIn,Oe.chapterOut])if(Math.abs(J-Se)<pe){const Ee=J<Se?Se-.004:Se+.004;return[ae*Ee/J,Y*Ee/J]}return[ae,Y]},he=(ae,Y,J)=>{const pe=Math.hypot(Y,J);return ae===0?ya(pe)-Oe.enamelT+.03:ae===1?w0(pe)-.05:ae>=2+U?w0(pe)-N[ae-2-U]:w0(pe)};kn(D,V,O,(ae,Y)=>{const J=Y/(O-1),pe=ie(J,K(ae),j,me);let[Se,Ee]=[pe[0],pe[1]];ae>=2&&ae<2+U&&([Se,Ee]=q(Se,Ee));const He=Y===0||Y===O-1||ae===0||ae===V-1?1:0;return{p:[Se,he(ae,Se,Ee),Ee],edge:He}},{out:()=>[0,1,0],nrm:(ae,Y)=>{if(Y<=1||Y>=2+U+1)return null;const J=Oe.dome/(a*a),pe=Math.hypot(2*J*ae[0],1,2*J*ae[2]);return[2*J*ae[0]/pe,1/pe,2*J*ae[2]/pe]}});for(const ae of[0,1]){const Y=ae?1:0,J=ae?me:j,pe=ae?Me:xe,Se=Ee=>(J(Ee)+pe(Ee))*.5+(J(Ee)-pe(Ee))*.28;kn(D,V,3,(Ee,He)=>{const ct=He===0?J:He===1?Se:pe,mt=ie(Y,K(Ee),ae?j:ct,ae?ct:me),ht=Math.hypot(mt[0],mt[1]),xt=he(Ee,mt[0],mt[1]),yt=ya(ht)-Oe.enamelT,$=He===0?xt:He===1?yt+(xt-yt)*.55:yt;return{p:[mt[0],$,mt[1]],edge:He===0?1:0,cav:He===2?1:0}},{out:Ee=>{const He=Math.atan2(Ee[2]-s[1],Ee[0]-s[0])+(ae?1:-1)*Math.PI/2;return[Math.cos(He),.3,Math.sin(He)]}})}const ue=D.geometry(),Ae=new Rn,we=Math.max(3,Math.round(O/5)),De=1+U+1,Ve=ae=>Y=>{const J=p(Y);return ae===0?.12:ae<=U?.12+(J-.12)*(ae-1)/U:J},Ke=ae=>x(F%d,ae),Xe=ae=>x(W%d,ae);for(const ae of[!0,!1])kn(Ae,De,we,(Y,J)=>{const pe=ie(J/(we-1),Ve(Y),Ke,Xe),Se=Math.hypot(pe[0],pe[1]);return{p:[pe[0],ya(Se)-Oe.enamelT-(ae?0:Oe.baseT),pe[1]],edge:ae&&(J===0||J===we-1)?1:0}},{out:()=>[0,ae?1:-1,0]});for(const ae of[0,1])kn(Ae,De,2,(Y,J)=>{const pe=ie(ae,Ve(Y),Ke,Xe),Se=Math.hypot(pe[0],pe[1]);return{p:[pe[0],ya(Se)-Oe.enamelT-(J?Oe.baseT:0),pe[1]],edge:J?.5:1}},{out:Y=>{const J=Math.atan2(Y[2]-s[1],Y[0]-s[0])+(ae?1:-1)*Math.PI/2;return[Math.cos(J),0,Math.sin(J)]}});kn(Ae,2,we,(ae,Y)=>{const J=ie(Y/(we-1),Ve(De-1),Ke,Xe),pe=Math.hypot(J[0],J[1]);return{p:[J[0],ya(pe)-Oe.enamelT-(ae?Oe.baseT:0),J[1]],edge:1}},{out:ae=>[ae[0],0,ae[2]]});const Ce=Ae.geometry(),rt=[];for(let ae=0;ae<60;ae++){const Y=ae%5===0,J=ae/60*at,pe=Y?Oe.hourIn:Oe.trackIn,Se=Oe.trackOut,Ee=[pe,(pe+Se)/2,Se].map(yt=>[Math.sin(J)*yt,-Math.cos(J)*yt]);if(!Ee.every(yt=>b(yt[0],yt[1])===S)||!Ee.every(yt=>{const $=Math.hypot(yt[0]-s[0],yt[1]-s[1]);let L=Math.atan2(yt[1]-s[1],yt[0]-s[0]);const Q=f(F,$);for(;L<Q;)L+=at;return(L-Q)*$>j($)+.12&&(f(W,$)-L)*$>me($)+.12}))continue;const ct=Y?.2:.07,mt=Se-pe,ht=_n({pts:[[-ct/2,-mt],[ct/2,-mt],[ct/2,0],[-ct/2,0]]},[],{t:.03,bevel:Y?.012:.008,segs:1}),xt=w0((pe+Se)/2)+.012;ht.applyMatrix4(new ge().makeRotationY(-J).multiply(new ge().makeTranslation(0,xt,-pe))),rt.push(ht)}const st=rt.length?qt(rt):null,Te=S===(e.dropSector??3);if(Te){const ae=new R(Math.cos(l[S]),0,Math.sin(l[S])),Y=new ge().makeTranslation(s[0],0,s[1]).multiply(new ge().makeRotationAxis(ae,-(e.drop??.25)/14)).multiply(new ge().makeTranslation(-s[0],-(e.drop??.25)*.55,-s[1]));for(const J of[ue,Ce,st])J?.applyMatrix4(Y)}ue.computeBoundingBox();const Fe=ue.boundingBox.getCenter(new R);z.push({enamel:ue,base:Ce,ticks:st,from:A,to:B,centroid:Fe,dropped:Te})}const k=Oe.hole,I=Wt([{r:k-.15,y:-.4-.05},{r:k+.32,y:-.4-.05},{r:k+.32,y:-.4},{r:k-.01,y:-.4},{r:k-.01,y:-.005},{r:k+.16,y:-.005},{r:k+.16,y:.03,smooth:!0},{r:k+.08,y:.075,smooth:!0},{r:k-.15,y:.075},{r:k-.15,y:-.4-.05}],[24,48,96][n]),P=z.flatMap((S,F)=>[on(S.enamel,"enamel",t*10+F,`enamel-${F}`),on(S.base,"polished",t*10+F+50,`base-${F}`),...S.ticks?[on(S.ticks,"polished",t*10+F+80,`ticks-${F}`,void 0,.3)]:[]]);P.push(on(I,"polished",t+3,"collar",void 0,.3));const C=(S,F)=>{const W=f(S,F);return[s[0]+Math.cos(W)*F,s[1]+Math.sin(W)*F]};return{part:Z0(P),sectors:z,impact:new R(s[0],0,s[1]),cracks:l,sectorOf:b,crackAt:C,crackLen:S=>p(l[S])}}const uo=Oe.numeralH,Go=.4,as=.19,js=.34,Ks=.13,ss=.17,Ys=.2;function Xu(e){const t=(o,a,s,r,i,c)=>[[o-i/2,0],[o+i/2,0],[a+c/2,uo],[a-c/2,uo]];if(e==="I")return{strokes:[{pts:t(0,0,0,0,js,js)}],w:js,feet:[0]};if(e==="V")return{strokes:[{pts:t(0,-.62,0,0,Go*.75,Go)},{pts:t(0,.62,0,0,as*.75,as)}],w:2*.62+Go,feet:[-.62*.5]};const n=.66;return{strokes:[{pts:t(n,-n,0,0,Go,Go)},{pts:t(-n,n,0,0,as,as)}],w:2*n+Go,feet:[0]}}const Zu=["XII","I","II","III","IIII","V","VI","VII","VIII","IX","X","XI"];function gr(e,t={}){const n=t.detail??2,o=[],a=[...e].map(f=>Xu(f)),s=a.reduce((f,p)=>f+p.w,0)+Ys*(a.length-1);let r=-s/2;const i=[];a.forEach(f=>{const p=r+f.w/2;for(const m of f.strokes)o.push(_n({pts:m.pts.map(([h,v])=>[h+p,-(v-uo/2)])},[],{t:Oe.numeralT,bevel:.055,segs:n?2:1}));for(const m of f.feet)i.push(p+m);r+=f.w+Ys}),r=-s/2,a.forEach(f=>{for(const p of[0,uo-Ks])o.push(_n({pts:[[r-ss,-(p-uo/2)],[r+f.w+ss,-(p-uo/2)],[r+f.w+ss,-(p+Ks-uo/2)],[r-ss,-(p+Ks-uo/2)]]},[],{t:Oe.numeralT*.96,bevel:.045,segs:n?2:1}));r+=f.w+Ys});const c=qt(o);c.translate(0,Oe.numeralT/2,0);const l=[i[0],i[i.length-1]],d=[-.6819999999999997,.6819999999999999],u=l.map((f,p)=>{const m=Wt([{r:0,y:-.42},{r:.085,y:-.4,smooth:!0},{r:.095,y:-.33},{r:.095,y:.02},{r:0,y:.02}],n?12:6);return m.translate(f,0,d[p]),m});return{geo:qt([c,...u]),feet:l.map((f,p)=>new R(f,0,d[p])),width:s}}function Qu(e={}){const t=e.detail??2,n=ut((e.seed??3)*71+5),o=e.loose??[4,7],a=e.fallen??9,s=[],r=[],i=[];for(let c=0;c<12;c++){const l=gr(Zu[c],{detail:t}),d=c/12*at,u=Oe.numeralR,f=w0(u)+.002,p=new ge().makeRotationY(-d).multiply(new ge().makeTranslation(0,f,-u));let m=p.clone();if(o.includes(c)){const h=l.feet[c%2],v=new R(1,0,.25*(n()-.5)).normalize(),M=(c%2?1:-1)*(.2+n()*.12),w=(n()-.5)*.35,x=new ge().makeTranslation(h.x,0,h.z),g=new ge().makeTranslation(-h.x,0,-h.z);m=p.clone().multiply(x).multiply(new ge().makeRotationY(w)).multiply(new ge().makeRotationAxis(v,M)).multiply(g)}else if(c===a){const h=e.fallenAt??[-9.2,5.6],v=Math.hypot(h[0],h[1]);m=new ge().makeTranslation(h[0],w0(v)+Oe.numeralT+.004,h[1]).multiply(new ge().makeRotationY(.6+n())).multiply(new ge().makeRotationZ(Math.PI)).multiply(new ge().makeRotationX(.03))}i.push(m),o.includes(c)||c===a?r.push(on(l.geo,"grained",300+c,`numeral-${c}`,m,.22)):s.push(l.geo.clone().applyMatrix4(m))}return r.unshift(on(qt(s),"grained",299,"numerals",void 0,.22)),{part:Z0(r),at:i}}const Mn=Oe.crystalR,ws=Oe.crystalY,Yo=e=>ws+Oe.crystalDome*(1-(Math.min(e,Mn)/Mn)**2),Fo=e=>{const t=Yo(e)+Oe.crystalT,n=.55;if(e<Mn-n)return t;const o=un((e-(Mn-n))/n);return t-o*o*.32-o*.05-(e>=Mn-1e-6,0)};function Ju(e={}){const t=e.detail??2,n=e.seed??11,o=ut(n*313+1),a=e.impact??[-5.2,6.4],s=(U,O=Mn)=>{const D=Math.cos(U),E=Math.sin(U),N=a[0]*D+a[1]*E,V=a[0]*a[0]+a[1]*a[1]-O*O;return-N+Math.sqrt(N*N-V)},r=e.wedge??[1.95,2.45],i=U=>{const O=[o()*6,o()*6];return D=>(.18*Math.sin(D*.5+O[0])+.06*Math.sin(D*1.7+O[1])-.18*Math.sin(O[0])-.06*Math.sin(O[1]))*B0(D/1.2)*(U?1:-1)},c=i(0),l=i(1),d=(U,O)=>{const D=r[1]+Math.atan2(l(O),Math.max(O,.3)),E=r[0]+at+Math.atan2(c(O),Math.max(O,.3));return D+(E-D)*U},u=e.chip,f=ut(n*97+5),p=[f()*6,f()*6],m=U=>u?u.r*(1+.06*Math.sin(2*U+p[0])+.03*Math.sin(5*U+p[1])):0,h=(U,O)=>{if(!u)return[U,O];const D=U-u.at[0],E=O-u.at[1],N=Math.hypot(D,E),V=Math.atan2(E,D),K=m(V);return N>=K?[U,O]:N>1e-6?[u.at[0]+D/N*K,u.at[1]+E/N*K]:[u.at[0]+K,u.at[1]]},v=U=>{if(!u)return;const O=U.p,D=U.i,E=[];for(let N=0;N<D.length;N+=3){const V=(O[D[N]*3]+O[D[N+1]*3]+O[D[N+2]*3])/3-u.at[0],K=(O[D[N]*3+2]+O[D[N+1]*3+2]+O[D[N+2]*3+2])/3-u.at[1];Math.hypot(V,K)>=m(Math.atan2(K,V))*.995&&E.push(D[N],D[N+1],D[N+2])}U.i=E},M=[.9,.5,.3][t],w=Math.ceil(Mn*1.4/M),x=Math.ceil((at-(r[1]-r[0]))*Mn*1.2/M),g=[Mn-.55,Mn-.4,Mn-.25,Mn-.1,Mn],y=(U,O)=>U<w?.02+(s(O,g[0])-.02)*Math.pow(U/w,1):s(O,g[U-w]),b=w+g.length,z=(U,O)=>{let D=d(O,2),E=y(U,D);for(let K=0;K<3;K++)D=d(O,E),E=y(U,D);const[N,V]=h(a[0]+Math.cos(D)*E,a[1]+Math.sin(D)*E);return[N,V,D]},k=new Rn;for(const U of[!0,!1])kn(k,b,x,(O,D)=>{const E=z(O,D/(x-1)),N=Math.hypot(E[0],E[1]);return{p:[E[0],U?Fo(N):O===b-1&&N>=Mn-1e-4?ws:Yo(N),E[1]],edge:O===b-1||D===0||D===x-1?1:0}},{out:()=>[0,U?1:-1,0]});kn(k,2,x,(U,O)=>{const D=z(b-1,O/(x-1)),E=Math.hypot(D[0],D[1]),N=E>=Mn-1e-4;return{p:[D[0],U?Fo(N?Mn:E):N?ws:Yo(E),D[1]],edge:1}},{out:U=>[U[0],0,U[2]]}),v(k);const I=k.geometry(),P=new Rn;for(const U of[0,1])kn(P,b,3,(O,D)=>{const E=z(O,U),N=Math.hypot(E[0],E[1]),V=Fo(N),K=O===b-1?ws:Yo(N),j=D===1?.05*(U?1:-1):0,me=E[2]+(U?-1:1)*Math.PI/2;return{p:[E[0]+Math.cos(me)*j,D===0?V:D===1?(V+K)/2:K,E[1]+Math.sin(me)*j],edge:D===1?0:1,cav:D===0?1:D===1?.5:0}},{out:O=>{const D=Math.atan2(O[2]-a[1],O[0]-a[0])+(U?-1:1)*Math.PI/2;return[Math.cos(D),0,Math.sin(D)]}});if(u){const O=[],D=V=>{const K=V/256*at;return[u.at[0]+Math.cos(K)*m(K),u.at[1]+Math.sin(K)*m(K)]};for(let V=0;V<256;V++){const K=D(V);O.push(Math.hypot(K[0],K[1])<Mn-.01)}let E=O.findIndex((V,K)=>V&&!O[(K+256-1)%256]);const N=[];if(E>=0)for(let V=E;O[V%256]&&N.length<256;V++)N.push(V);N.length>2&&kn(P,N.length,3,(V,K)=>{const j=D(N[V]),me=Math.hypot(j[0],j[1]),xe=Fo(me),Me=Yo(me),q=N[V]/256*at,he=K===1?-.05:0;return{p:[j[0]+Math.cos(q)*he,K===0?xe:K===1?(xe+Me)/2:Me,j[1]+Math.sin(q)*he],edge:K===1?0:1,cav:K===0?1:K===1?.5:0}},{out:V=>[u.at[0]-V[0],0,u.at[1]-V[2]]})}const C=P.geometry(),S=new Rn,F=U=>!!u&&Math.hypot(U[0]-u.at[0],U[1]-u.at[1])<m(Math.atan2(U[1]-u.at[1],U[0]-u.at[0])),W=(U,O)=>{if(!u){A(U,O);return}let D=[];for(let E=0;E<U.length;E++)F(U[E])?D.length&&(D.push(U[E]),D.length>1&&A(D,O),D=[]):(!D.length&&E>0&&D.push(U[E-1]),D.push(U[E]));D.length>1&&A(D,O)},A=(U,O)=>{const D=U.length;kn(S,D,2,(E,N)=>{const[V,K]=h(U[E][0],U[E][1]),j=Math.hypot(V,K),me=Fo(Math.min(j,Mn))-.015,xe=Yo(Math.min(j,Mn))+.015,Me=U[Math.min(D-1,E+1)],q=U[Math.max(0,E-1)],he=Me[0]-q[0],ce=Me[1]-q[1],ue=Math.hypot(he,ce)||1,Ae=(N?1:-1)*O*Oe.crystalT*.5,[we,De]=h(V-ce/ue*Ae,K+he/ue*Ae);return{p:[we,N?me:xe,De],edge:N,cav:N}},{out:(E,N)=>{const V=U[Math.min(D-1,N+1)],K=U[Math.max(0,N-1)];return[-(V[1]-K[1]),0,V[0]-K[0]]}})},B=(U,O,D,E)=>{const N=Math.hypot(O[0]-U[0],O[1]-U[1]),V=Math.max(4,Math.ceil(N/[.6,.3,.15][t])),K=ut(E),j=[K()*6,K()*6,K()*6],me=-(O[1]-U[1])/N,xe=(O[0]-U[0])/N,Me=[];for(let q=0;q<=V;q++){const he=q/V,ce=he*N,ue=(D*Math.sin(ce*.45+j[0])+D*.35*Math.sin(ce*1.6+j[1])+D*.12*Math.sin(ce*5.1+j[2]))*Math.sin(Math.PI*he)**.5;Me.push([U[0]+(O[0]-U[0])*he+me*ue,U[1]+(O[1]-U[1])*he+xe*ue])}return Me},oe=e.rays??10;for(let U=0;U<oe;U++){let O=(U+.3+o()*.5)/oe*at;O>r[0]-.12&&O<r[1]+.12&&(O+=.35);const D=s(O),E=U%3!==1,N=E?D-.02:D*(.3+o()*.45);W(B([a[0]+Math.cos(O)*.25,a[1]+Math.sin(O)*.25],[a[0]+Math.cos(O)*N,a[1]+Math.sin(O)*N],.25,n*7+U),(o()-.5)*.35)}for(const[U,O,D]of[[-2.55,.35,1],[-.9,2.05,2]]){const E=[Math.cos(U)*(Mn-.02),Math.sin(U)*(Mn-.02)],N=[Math.cos(O)*(Mn-.02),Math.sin(O)*(Mn-.02)];W(B(E,N,.9,n*13+D),(o()-.5)*.25)}v(S);const ie=S.geometry();return{part:Z0([on(I,"glass",n,"crystal"),on(C,"glassEdge",n+1,"crystal-edge"),on(ie,"crack",n+2,"crystal-cracks")]),impact:new R(a[0],Fo(Math.hypot(a[0],a[1])),a[1])}}const F0=-1.5,e1=(e,t,n,o)=>e.applyMatrix4(new ge().makeTranslation(t,n,o).multiply(new ge().makeRotationZ(-Math.PI/2))),fi=(e,t,n,o)=>e.applyMatrix4(new ge().makeTranslation(t,n,o).multiply(new ge().makeRotationX(-Math.PI/2)));function t1(e,t,n,o,a,s){const r=e.getAttribute("position"),i=e.getAttribute("normal"),c=ut(s),l=[c()*at,c()*at];for(let d=0;d<r.count;d++){const u=r.getX(d),f=r.getY(d),p=r.getZ(d),m=Math.hypot(u,p);if(f<n||f>o||m<Oe.caseOut-.9)continue;const h=Math.atan2(p,u),v=Math.sin(Math.PI*(f-n)/(o-n))**.35,M=1-.85*Math.exp(-(((f-(n+o)/2)/((o-n)*.22))**2))*(.55+.45*Math.sin(h*2+l[0])*Math.sin(h*5+l[1])),w=h*t/at,x=w-Math.floor(w),g=Math.pow(Math.sin(Math.PI*x),2),y=2*Math.sin(Math.PI*x)*Math.cos(Math.PI*x)*Math.PI*t/at,b=a*v*M,z=m-b*(1-g);r.setX(d,u/m*z),r.setZ(d,p/m*z);const k=b*y/m,I=-Math.sin(h),P=Math.cos(h),C=i.getX(d)-I*k,S=i.getY(d),F=i.getZ(d)-P*k,W=Math.hypot(C,S,F);i.setXYZ(d,C/W,S/W,F/W)}return r.needsUpdate=i.needsUpdate=!0,e}function n1(e,t){const n=e.getAttribute("position"),o=e.getAttribute("normal");for(let a=0;a<n.count;a++){let s=0,r=0,i=0;for(const[p,m,h,v]of t){const M=n.getX(a)-p,w=n.getZ(a)-m,x=v*Math.exp(-(M*M+w*w)/(h*h));s-=x,r+=2*M/(h*h)*x,i+=2*w/(h*h)*x}if(Math.abs(s)<1e-6)continue;n.setY(a,n.getY(a)+s);const c=o.getY(a),l=c>=0?1:-1,d=o.getX(a)-r*l,u=o.getZ(a)-i*l,f=Math.hypot(d,c,u);o.setXYZ(a,d/f,c/f,u/f)}return n.needsUpdate=o.needsUpdate=!0,e}function o1(e,t){const n=[],o=[],a=t.open??0,s=t.n,r=!a;for(let i=0;i<=s&&!(r&&i===s);i++){const c=a+(at-2*a)*i/s,l=new R(t.a*Math.cos(c),t.b*.45*Math.sin(2*c)*.35+(a?Math.sin(c)*.5*(c>Math.PI?1:0):0),t.b*Math.sin(c)).applyMatrix4(t.at);n.push(l),o.push(new R(0,1,0).transformDirection(t.at))}if(r&&(n.push(n[0].clone()),o.push(o[0].clone())),zc(e,n,o,()=>t.r,t.segs,!1,.5),a)for(const i of[0,n.length-1]){const c=n[i],l=new wo(t.r*.98,10,6);l.translate(c.x,c.y,c.z);const d=l.getAttribute("position"),u=l.getAttribute("normal"),f=l.index,p=e.p.length/3;for(let m=0;m<d.count;m++)e.v(d.getX(m),d.getY(m),d.getZ(m),u.getX(m),u.getY(m),u.getZ(m),0,.6);for(let m=0;m<f.count;m+=3)e.tri(p+f.getX(m),p+f.getX(m+1),p+f.getX(m+2))}}function a1(e={}){const t=e.detail??2,n=e.seed??21,o=ut(n*17+3),a=[180,720,1440][t],s=[16,28,48][t],r=Oe.caseTop,i=Oe.caseBottom,c=(Te,Fe,ae=!1)=>({r:Te,y:Fe,smooth:ae}),l=9,u=[...Array.from({length:l},(Te,Fe)=>{const ae=Fe/(l-1),Y=ae*23.3;return c(Y,i+1.45*(Y/23.3)**2,Fe>0&&Fe<l-1)}),c(23.55,-4.62),c(23.62,-4.48),c(23.9,-4.4),c(24.45,-4.1,!0),c(24.85,-3.45,!0),c(25,-2.4,!0),c(25.02,-1.4,!0),c(24.95,-.4,!0),c(24.75,.4,!0),c(24.4,.95),c(24,1.12),c(23.85,1.3),c(23.6,1.85,!0),c(23.15,2.22,!0),c(22.65,2.38),c(22.08,2.42),c(22.05,2.28),c(22.32,2.12),c(22.32,-.35),c(21.4,-.42),c(21.35,-1.3),c(20.6,-1.3)],f=t1(Wt(u,a),t===2?360:t===1?180:1,-3.7,.55,t?.085:0,n),p=Oe.hinge,m=5,h=.1,v=(p.len-h*(m-1))/m,M=Te=>{const Fe=Wt([c(0,0),c(p.r-.1,0),c(p.r,.1),c(p.r,v-.1),c(p.r-.1,v),c(.33,v),c(.33,v+.001),c(0,v+.001)],s);return fi(Fe,p.x,p.y,Te+v)},w=[],x=[];for(let Te=0;Te<m;Te++){const Fe=-5.6+Te*(v+h),ae=M(Fe);(Te%2===0?w:x).push(ae);const Y=_n({pts:[[-.55,0],[.55,0],[.55,v-.06],[-.55,v-.06]]},[],{t:.7,bevel:.12,segs:1});Y.applyMatrix4(new ge().makeTranslation(p.x+.75,Te%2===0?p.y-.62:p.y+.55,Fe+.03).multiply(new ge().makeRotationZ(Te%2===0?-.5:.35)).multiply(new ge().makeRotationX(Math.PI/2).premultiply(new ge().makeTranslation(0,.35,0)))),(Te%2===0?w:x).push(Y)}const g=fi(Wt([c(0,-.12),c(.22,-.1,!0),c(.31,-.02),c(.31,p.len+.02),c(.22,p.len+.1,!0),c(0,p.len+.12)],s),p.x,p.y,p.len/2),y=Wt([c(0,0),c(2.35,0),c(2.1,.35,!0),c(1.72,.9,!0),c(1.6,1.6),c(1.62,2.5),c(1.95,2.6),c(1.98,3.15,!0),c(1.7,3.3),c(1.3,3.35),c(0,3.36)],s*2);e1(y,24.55,F0,0);const b=[-1,1].map(Te=>Wt([c(0,0),c(.5,0),c(.5,.25,!0),c(.38,.38,!0),c(0,.4)],s).applyMatrix4(new ge().makeTranslation(27.1,F0,Te*1.6).multiply(new ge().makeRotationX(Te*-Math.PI/2)))),z=new Rn,k=Oe.crownR,I=Oe.crownLen,P=27.95,C=30,S=C*[4,6,10][t],F=Te=>{const Fe=Te*I;return{r:Fe<.25?k*.8+(k-k*.8)*Fe/.25:Fe>I-.35?k-(Fe-(I-.35))**2*3.2:k,f:un(Math.min((Fe-.2)/.25,(I-.25-Fe)/.25))}},W=[10,18,30][t];kn(z,W,S,(Te,Fe)=>{const ae=Te/(W-1),Y=Fe/S*at,J=F(ae),pe=Y*C/at%1,Se=Math.pow(Math.sin(Math.PI*pe),.7),Ee=J.r-.2*J.f*(1-Se);return{p:[P+ae*I,F0+Math.cos(Y)*Ee,Math.sin(Y)*Ee],edge:J.f*Se>.9?1:0,cav:J.f*(1-Se)>.8?1:0}},{wrapJ:!0,out:Te=>[0,Te[1]-F0,Te[2]]});const A=Wt([c(0,0),c(k-.38,0),c(k-.62,.14,!0),c(1,.22,!0),c(0,.25)],s*2).applyMatrix4(new ge().makeTranslation(P+I-.02,F0,0).multiply(new ge().makeRotationZ(-Math.PI/2))),B=qt([z.geometry(),A]),oe=new Rn,ie=31.6,U=4.9,O=4.15,D=2.4,E=[],N=[],V=.66,K=[60,120,220][t];for(let Te=0;Te<=K;Te++){const Fe=Math.PI+V+(at-2*V)*Te/K,ae=Math.cos(Fe),Y=Math.sin(Fe);E.push(new R(ie+U*Math.sign(ae)*Math.abs(ae)**(2/D),F0,O*Math.sign(Y)*Math.abs(Y)**(2/D))),N.push(new R(0,1,0))}E.unshift(new R(27.1,F0,-1.95)),N.unshift(new R(0,1,0)),E.push(new R(27.1,F0,1.95)),N.push(new R(0,1,0)),zc(oe,E,N,Te=>.6*(1-.38*Math.exp(-(((Te-.5)/.07)**2))),[10,16,24][t],!1,.5);const j=oe.geometry(),me=new Rn;if(e.chain!==!1){const Te=ie+U;[[Te+1.95,F0-.15,.25,0,.12,0],[Te+5.4,F0-.55,.6,1.45,.18,0],[Te+8.75,F0-1.4,1.2,.25,-.22,.5]].forEach(([ae,Y,J,pe,Se,Ee])=>{const He=new ge().makeTranslation(ae,Y,J).multiply(new ge().makeRotationFromEuler(new Kn(pe,o()*.25-.12,Se)));o1(me,{a:2.55,b:1.55,r:.42,at:He,open:Ee,segs:[8,12,18][t],n:[36,64,110][t]})})}const xe=me.geometry(),Me=Oe.lidDome,q=Oe.lidT,he=22,ce=[c(25.12,.5),c(24.95,.85,!0),...Array.from({length:he},(Te,Fe)=>{const ae=1-(Fe+1)/he,Y=ae*24.6;return c(Y,.95+(Me+.2-.95)*(1-(Y/24.6)**2),Fe<he-1)})],ue=Array.from({length:he},(Te,Fe)=>{const ae=Fe/(he-1)*24.15;return c(ae,.4+(Me+.2-q-.4)*(1-(ae/24.15)**2),Fe>0&&Fe<he-1)}),Ae=[c(24.15,.4),c(24.15,.08),c(24.3,0),c(25.05,0),c(25.12,.08),c(25.12,.5)],we=n1(Wt(ce,a>>1),[[9.5,11.5,1.9,.2],[-13,-10.5,1.2,.14]]),De=Wt(ue,a>>2),Ve=Wt(Ae,a>>1),Ke=_n({pts:[[-.3,-1.1],[.4,-1.1],[.4,1.1],[-.3,1.1]]},[],{t:.62,bevel:.12,segs:1});Ke.translate(24.95,-.22,0);const Xe=new ge().makeTranslation(0,r,0),Ce=Fa.degToRad(e.lidAngle??0),rt=new ge().makeTranslation(p.x,p.y,0).multiply(new ge().makeRotationZ(Ce)).multiply(new ge().makeTranslation(25.55,-2.2,0)).multiply(Xe),st=new ge().makeTranslation(p.x,p.y,0).multiply(new ge().makeRotationZ(Ce)).multiply(new ge().makeTranslation(25.55,-2.2,0));return{part:Z0([on(f,"polished",n,"case-body",void 0,.3),on(qt([...w,...b]),"polished",n+1,"case-hinge",void 0,.28),on(g,"polished",n+2,"hinge-pin",void 0,.3),on(qt([y]),"turned",n+3,"pendant",void 0,.28),on(B,"polished",n+4,"crown",void 0,.3),on(j,"polished",n+5,"bow",void 0,.26),...e.chain!==!1?[on(xe,"polished",n+6,"chain",void 0,.3)]:[],on(we,"guilloche",n+7,"lid-outside",rt,.24),on(De,"polishedIn",n+8,"lid-inside",rt,.15),on(qt([Ve,Ke]),"polished",n+9,"lid-rim",rt,.24),on(qt(x),"polished",n+10,"lid-hinge",st,.28)]),lid:rt,hinge:new R(p.x,p.y,0)}}function pi(e){const t=e.detail??2,n=e.t??.1,o=e.ridge??.13,a=new Rn,s=e.rb*.55,r=e.rb+.9,i=e.L,c=M=>{if(M<=r)return .2+.06*(1-un((M-s)/(r-s)));const w=(M-r)/(i-r);return Math.max(.012,.2*(1-w)**2+e.wMax/2*Math.pow(Math.sin(Math.PI*Math.pow(w,.78)),.9)*(1-w*.15))},l=[80,140,240][t],d=[3,6,10][t],u=M=>s+(i-s)*(1-(1-M/(l-1))**1.25),f=M=>n*.45+(n*.55+o-n)*(1-Math.pow(Math.abs(M),1.4));for(const M of[-1,1])kn(a,l,d,(w,x)=>{const g=u(w),y=M*x/(d-1),b=c(g),z=un((i-g)/.25);return{p:[y*b,f(y)*(.4+.6*z),-g],edge:x===d-1?1:x===0?.6:0}},{out:()=>[0,1,0]});const p=M=>kn(a,l,2,(w,x)=>{const g=u(w),y=c(g),b=un((i-g)/.25);return{p:[M*y,x?f(1)*(.4+.6*b):0,-g],edge:x?1:.4}},{out:()=>[M,0,0]});p(-1),p(1),kn(a,l,2,(M,w)=>{const x=u(M),g=c(x);return{p:[(w?1:-1)*g,0,-x]}},{out:()=>[0,-1,0]});const m=a.geometry(),h=[24,40,72][t],v=Wt([{r:e.hole,y:0},{r:e.rb,y:0},{r:e.rb,y:n*.7},{r:e.rb-.06,y:n+.05,smooth:!0},{r:e.hole+.08,y:n+.07},{r:e.hole,y:n+.02},{r:e.hole,y:0}],h);return qt([m,v])}function s1(e={}){const t=e.detail??2,n=e.L??19.9,o=.55,a=3.6,s=.085,r=x=>{const g=un(x);return g*g*(3-2*g)},i=x=>{let g=0;if(x>=0&&x<=n&&(g=Math.max(g,(.15-.1*x/n)*Math.pow(un((n-x)/1.1),.62))),Math.abs(x)<o&&(g=Math.max(g,Math.sqrt(o*o-x*x))),x<=0&&x>=-a){const y=-x/a;g=Math.max(g,.16+.2*Math.pow(y,1.4)*(1-r((y-.82)/.18))+.04*(1-r((y-.82)/.18))*y)}return Math.max(g,1e-4)},c=[],l=[260,520,900][t];for(let x=0;x<=l;x++){const g=x/l;c.push(-a+(n+a)*(1-(1-g)**1.6))}const d=c.length,u=[3,5,7][t],f=x=>s*(.55+.45*un((n-x)/2.5)),p=x=>.018*Math.pow(un((x-(n-.12))/.12),2),m=(x,g)=>{const y=Math.abs(g);return f(x)*(y>.92?.42:.42+.58*(.92-y)/.92)+p(x)},h=new Rn;for(const x of[-1,1])kn(h,d,u,(g,y)=>{const b=c[g],z=x*y/(u-1);return{p:[z*i(b),m(b,z),-b],edge:y===u-1?1:y===0?.8:0}},{out:()=>[0,1,0]});const v=x=>kn(h,d,2,(g,y)=>{const b=c[g];return{p:[x*i(b),y?m(b,1):p(b),-b],edge:y?1:.4}},{out:()=>[x,0,0]});v(-1),v(1),kn(h,d,2,(x,g)=>{const y=c[x];return{p:[(g?1:-1)*i(y),p(y),-y]}},{out:()=>[0,-1,0]});const M=h.geometry(),w=Wt([{r:.13,y:0},{r:.36,y:0},{r:.36,y:.085},{r:.3,y:.2},{r:.22,y:.32,smooth:!0},{r:.13,y:.33}],[20,32,56][t]);return w.translate(0,.07,0),{needle:M,collet:w}}function r1(e={}){const t=e.detail??2,n=[20,36,64][t],o=(c,l)=>new ge().makeTranslation(0,l,0).multiply(new ge().makeRotationY(-c)),a=pi({L:10.6,wMax:1.55,rb:1.25,hole:.62,detail:t}),s=pi({L:16.2,wMax:1.15,rb:.95,hole:.36,t:.09,ridge:.11,detail:t}),r=s1({detail:t}),i=qt([Wt([{r:.62,y:-.4},{r:.64,y:Oe.handY.hour+.02},{r:.6,y:Oe.handY.hour+.14,smooth:!0},{r:.45,y:Oe.handY.hour+.15},{r:.45,y:-.4}],n),Wt([{r:.36,y:-.4},{r:.37,y:Oe.handY.minute+.05},{r:.34,y:Oe.handY.minute+.16,smooth:!0},{r:.3,y:Oe.handY.minute+.21,smooth:!0},{r:.14,y:Oe.handY.minute+.22},{r:.14,y:-.4}],n),Wt([{r:.13,y:-.4},{r:.13,y:Oe.handY.second+.42},{r:.1,y:Oe.handY.second+.5,smooth:!0},{r:.04,y:Oe.handY.second+.53,smooth:!0},{r:0,y:Oe.handY.second+.535}],n)]);return Z0([on(a,"polished",401,"hand-hour",o(e.hour??4.9,Oe.handY.hour),.25),on(s,"polished",402,"hand-minute",o(e.minute??1.15,Oe.handY.minute),.25),on(r.needle,"lacquer",403,"hand-second",o(e.second??.64,Oe.handY.second),.25),on(r.collet,"polished",404,"hand-collet",o(e.second??.64,Oe.handY.second),.25),on(i,"polished",405,"hand-pipes",void 0,.25)])}const ys=(e,t)=>{const n=(e*e+t*t)/(2*t);return{c:t-n,R:n}};function i1(e,t,n){const o=new Rn,a=ut((e.seed??1)*59+7),s=[a()*at,a()*at,a()*at],r=e.lean??0;return ju(o,t,n,(c,l)=>{const d=1+.025*Math.sin(l*2+s[0])+.015*Math.sin(l*3+s[1]);if(c<Math.PI*.3){const M=c/(Math.PI*.3),w=e.r*d*M;return[Math.cos(l)*w,0,Math.sin(l)*w]}const f=(c-Math.PI*.3)/(Math.PI*.7)*Math.PI/2,p=e.r*d*Math.cos(f)*(1+.12*Math.sin(f*2)*(e.h>e.r?1:.4));let m=e.h*Math.sin(f);const h=e.dimple??0;if(h){const M=p/e.r;m-=h*e.h*Math.exp(-M*M/.06)}const v=r*Math.sin(f)*e.h*.25;return[Math.cos(l)*p+v,m,Math.sin(l)*p]},[0,e.h*.4,0],{cav:c=>c<Math.PI*.3?1:un(1-(c-Math.PI*.3)*6)}),o.geometry()}const c1=[.28,.5,.85];function bs(e,t=!1){return i1({r:1,h:t?.42:.7,seed:t?9:3},[6,9,12][e],[10,14,20][e])}function Ms(e,t,n=1,o=c1){const a=ut(n*131+3),s=o.map(()=>[]);let r=0;for(;s.reduce((i,c)=>i+c.length,0)<e&&r++<e*8;){const i=t(a(),a());if(!i)continue;const c=a()<.62?0:a()<.75?1:2,l=o[c]*(.8+a()*.4),d=new Xt().setFromUnitVectors(new R(0,1,0),i.up.clone().normalize()).multiply(new Xt().setFromAxisAngle(new R(0,1,0),a()*at));s[c].push(new ge().compose(i.p,d,new R(l*(1+a()*.2),l*(.85+a()*.3),l)))}return s}function Pc(e={}){const t=e.detail??2,n=e.seed??21,o=ut(n*97+5),a=e.cols??7,s=e.rows??8,[r,i]=e.sett??[150,95],c=e.joint??9,l=e.hollow?.x??20,d=e.hollow?.z??15,u=e.hollow?.r??260,f=e.hollow?.depth??16,p=(N,V)=>-f*B0(1-Math.hypot(N-l,V-d)/u),m=-f*(e.water??.3),h=$s(n+3,3),v=$s(n+9,2),M=a*(r+c),w=s*(i+c),x=new Rn,g=new Rn,y=[],b=[5,10,18][t],z=[4,8,12][t],k=[],I=o()*6;for(let N=-w/2;N<w/2-i*.4;){const V=i*(.72+o()*.55),K=o()*6;for(let j=-M/2-o()*r*.8;j<M/2;){const me=r*(.55+o()*.6),xe=j+me/2,Me=Math.sin(xe*.004+I)*16+Math.sin(xe*.011+K)*2.5,q=Math.cos(xe*.004+I)*16*.004;xe-me/2>-M/2-1&&xe+me/2<M/2+1&&k.push({cx:xe,cz:N+V/2+Me,w:me,dd:V*(.88+o()*.12),rot:Math.atan(q)+(o()-.5)*.07}),j+=me+c*(.7+o()*1.6)}N+=V+c*(.8+o()*1.2)}for(const N of k){const V=N.w,K=N.dd,j=N.cx+(o()-.5)*3,me=N.cz+(o()-.5)*3,xe=N.rot,Me=p(j,me)+(o()-.5)*5,q=6,he=(p(j+q,me)-p(j-q,me))/(2*q)*.8+(o()-.5)*.012,ce=(p(j,me+q)-p(j,me-q))/(2*q)*.8+(o()-.5)*.012,ue=.4+o()*1.3,Ae=o()*100,we=3.5+o()*9;y.push({cx:j,cz:me,y:Me,gx:he,gz:ce,w:V,dd:K});const De=Math.cos(xe),Ve=Math.sin(xe),Ke=(Fe,ae,Y)=>[j+Fe*De-ae*Ve,Me+Y+he*Fe+ce*ae,me+Fe*Ve+ae*De],Xe=b+4,Ce=z+4,rt=(Fe,ae,Y)=>{const J=ae+4,pe=Fe<=J/2?Fe:J-Fe,Se=Fe<=J/2?-1:1;if(pe===0)return{x:Se*(Y-3),y:-32,rim:2};if(pe===1)return{x:Se*Y,y:-we*.55,rim:1};if(pe===2)return{x:Se*(Y-we*.32),y:-we*.12,rim:.5};const Ee=(Fe-3)/(ae-2);return{x:-Y+we+(2*Y-2*we)*Ee,y:0,rim:0}};kn(x,Xe+1,Ce+1,(Fe,ae)=>{const Y=rt(Fe,b,V/2),J=rt(ae,z,K/2),pe=Math.max(Y.rim,J.rim),Se=Y.x/(V/2),Ee=J.x/(K/2),He=ue*(1-Math.pow(Math.abs(Se),3))*(1-Math.pow(Math.abs(Ee),3)),ct=Y.x+Ae,mt=J.x-Ae,ht=(h(ct*.025,mt*.025)-.5)*2.4+(h(ct*.11+5,mt*.11)-.5)*.5,xt=pe>0&&pe<2?-Math.max(0,v(ct*.04+mt*.04,ct*.02-mt*.03)-.55)*18:0;let yt=Math.min(Y.y,J.y)+(pe<2?He*(pe?.5:1)+ht*(pe?.4:1):0)+xt-(Y.rim>0&&J.rim>0&&pe<2?we*.35:0);return{p:Ke(Y.x,J.x,yt),cav:pe>=2?1:0,edge:pe===1||pe===.5?un(1-xt*-.1):0}},{out:Fe=>{const ae=[Fe[0]-j,Fe[1]-(Me-30),Fe[2]-me];return[ae[0]/V,ae[1]/20,ae[2]/K]}});const st=Me-we*.55;if(Math.hypot(j-l,me-d)<u*1.1&&st+he*0>m-25&&Me-32<m){const Fe=[],ae=[12,24,40][t];for(let Y=0;Y<ae;Y++){const J=Y/ae*4,pe=J%1,Se=Math.floor(J),Ee=Se===0?-V/2+V*pe:Se===1?V/2:Se===2?V/2-V*pe:-V/2,He=Se===0?-K/2:Se===1?-K/2+K*pe:Se===2?K/2:K/2-K*pe;Fe.push([Ee,He])}kn(g,3,ae,(Y,J)=>{const[pe,Se]=Fe[J],Ee=Math.hypot(pe/(V/2),Se/(K/2))||1,He=[Y*1.4*pe/(V/2)/Ee,Y*1.4*Se/(K/2)/Ee],ct=Ke(pe+He[0],Se+He[1],0);return{p:[ct[0],m+[1.1,.3,.02][Y],ct[2]],cav:Y/2,edge:0}},{wrapJ:!0,out:()=>[0,1,0]})}}const P=x.geometry(),C=[24,48,80][t],S=new Rn,F=$s(n+17,3);kn(S,C,C,(N,V)=>{const K=-M/2+M*V/(C-1),j=-w/2+w*N/(C-1);return{p:[K,p(K,j)-3.5+(F(K*.08,j*.08)-.5)*4,j],cav:1}},{out:()=>[0,1,0]});const W=S.geometry();let A=0;for(let N=0;N<u;N+=2)-f*B0(1-N/u)-3.5<m&&(A=N);A=Math.max(A+20,40);const B=new Rn,oe=[6,12,20][t],ie=[24,48,72][t];kn(B,oe,ie,(N,V)=>{const K=A*N/(oe-1),j=V/ie*at;return{p:[l+Math.cos(j)*K,m,d+Math.sin(j)*K]}},{wrapJ:!0,out:()=>[0,1,0],nrm:()=>[0,1,0]});const U=B.geometry(),O=Array.from({length:e.ripples??7},()=>{const N=o()*at,V=Math.sqrt(o())*A*.8;return{x:l+Math.cos(N)*V,z:d+Math.sin(N)*V,phase:o(),speed:.8+o()*.5}}),D=[on(P,"stone",n,"setts"),on(W,"stone",n+1,"joints"),on(U,"puddle",n+2,"puddle")];g.p.length&&D.push(on(g.geometry(),"water",n+3,"meniscus"));const E=(N,V)=>{let K=p(N,V);for(const j of y)Math.abs(N-j.cx)<j.w/2&&Math.abs(V-j.cz)<j.dd/2&&(K=j.y+j.gx*(N-j.cx)+j.gz*(V-j.cz)+2);return K};return{part:Z0(D),water:{y:m,x:l,z:d,r:A},ripples:O,topAt:E}}const l1=`
attribute float aCav;
attribute float aEdge;
varying float vCav;
varying float vEdge;
varying vec3 vOP;
varying vec3 vON;`,u1=`
vCav = aCav;
vEdge = aEdge;
vOP = position;
vON = normal;
#ifdef USE_INSTANCING
vOP += instanceMatrix[3].xyz * 0.731;
#endif`,d1=`
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
}`;function Or(e){e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
${l1}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${u1}`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
${d1}`)}function Bs(e,t){e.fragmentShader=e.fragmentShader.replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= ${t.toFixed(3)};
iblIrradiance *= ${t.toFixed(3)};
#ifdef USE_CLEARCOAT
clearcoatRadiance *= ${t.toFixed(3)};
#endif`)}const f1=.3,p1=`
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
  float cR = length(vOP.xz - uCFront), tR = clamp(cR / max(uCRad, 0.3), 0.0, 1.0);
  float mR = smoothstep(0.44, 0.64, texture2D(tNz, q * 0.45 + 0.37).r * 0.75 + texture2D(tNz, q * 0.11 + 0.61).g * 0.25 + near * 0.2);

  m2 = max(m2, mR * (1.0 - smoothstep(uCRad - 1.2, uCRad, cR)));
  eQl = max((1.0 - smoothstep(0.0, fwidth(c1.x) * 1.2 * cW + 1e-5, c1.x)) * bl(1.0 / 2.4, fw * 1.4) * m1, (1.0 - smoothstep(0.0, fwidth(c2.x) * 1.2 * cW + 1e-5, c2.x)) * bl(1.0 / 0.8, fw) * m2) * face;


  float hw = mix(1.5, 0.8, tR) * (0.55 + 0.45 * mR), d2 = c2.x / max(fwidth(c2.x), 1e-4);
  czH = (1.0 - smoothstep(hw - 0.6, hw + 0.6, d2)) * bl(1.0 / 0.8, fw) * mR * face * (0.55 + 0.45 * (1.0 - tR));

  czH *= 1.0 - smoothstep(0.03, 0.065, fw);

  czH *= 1.0 - smoothstep(uCRad - 1.2, uCRad, cR);
}
float lit = step(0.94, c1.y) * craz * face;
float dustS = texture2D(tNz, q * 2.3 + 0.61).g;
float dustM = smoothstep(0.8, 0.9, texture2D(tNz, q * 0.21 + 0.31).b * 0.6 + texture2D(tNz, q * 0.9 + 0.1).g * 0.4 + vCav * 0.25) * smoothstep(0.62, 0.7, dustS) * face;
float dustF = texture2D(tNz, q * 1.7).r;
float tideN = texture2D(tNz, q * 0.11 + 0.7).r;
float tideW = fwidth(tideN) * 0.7 + 0.002;
float tide = (1.0 - smoothstep(0.0, tideW, abs(tideN - 0.53))) * smoothstep(0.7, 0.8, texture2D(tNz, q * 0.027 + 0.2).g) * face;
float rr = length(vOP.xz);
float stepD = min(abs(rr - ${Oe.chapterIn.toFixed(3)}), abs(rr - ${Oe.chapterOut.toFixed(3)}));
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
float eCoatR = 0.016 + dustM * 0.25 + (1.0 - face) * 0.3;`,Lo={value:1},Vr={value:0},Ac={value:0},Rc={value:new Ft(8.485,-8.485)},Cc={value:99};function h1(e={}){const t=ro(),n=ut((e.seed??1)*7919+3),o=new t0({color:16777215,metalness:0,roughness:.3,clearcoat:1,clearcoatRoughness:.035,ior:1.52,specularIntensity:0,envMapIntensity:.5}),a={tNz:{value:t.noise},uSeed:{value:new R(n()*40,n()*40,n()*40)},uImpact:{value:new Ft(e.impact?.x??-13,e.impact?.z??.8)},uCcDirect:{value:.04},uStrN:{value:new R(0,0,1)},uStrL:{value:new R(0,1,0)},uStrW:{value:.006},uStrC:{value:.7},uStrG:{value:0},uStrRef:{value:0},uStrM:Lo,uCGlow:Vr,uCFront:Rc,uCRad:Cc,uEMode:Ac,uEnv:{value:f1}};return o.onBeforeCompile=s=>{Object.assign(s.uniforms,a),Or(s),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
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
${p1}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = eRough;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = eCoat;
material.clearcoatRoughness = eCoatR;`),s.fragmentShader=s.fragmentShader.replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= uEnv;
iblIrradiance *= uEnv;
clearcoatRadiance *= uEnv;`).replace("#include <opaque_fragment>",`outgoingLight *= mix(vec3(1.0), vec3(1.0, 0.1, 0.08), (1.0 - smoothstep(0.5, 0.95, vON.y)) * clamp(uCGlow * 3.0, 0.0, 1.0) * (1.0 - step(1.5, uEMode)) * (uEMode > 0.5 && uEMode < 1.5 ? 0.0 : 1.0));
if (uEMode > 0.5 && uEMode < 1.5) { float sR = length(vOP.xz - uCFront); outgoingLight += vec3(1.0, 0.0, 0.0) * uCGlow * face * 3.2 * czH * cFall(sR) * 5.0; }
#include <opaque_fragment>`).replace("uniform float uEnv;",`uniform float uEnv;
uniform float uCGlow;
uniform vec2 uCFront;
uniform float uCRad;
float cFall(float d) { return exp(-d / 2.4) * (1.0 - smoothstep(2.5, 6.0, d)); }`),O0(s)},o.customProgramCacheKey=()=>"ss-out-enamel",Object.assign(o,{ss:a})}const m1=`
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
float lCoat = (1.0 - chip) * (1.0 - hair * 0.8) * (1.0 - rim * 0.6);`;function v1(e={}){const t=ro(),n=ut((e.seed??1)*4241+9),o=new t0({color:16777215,metalness:0,roughness:.42,clearcoat:1,clearcoatRoughness:.025,ior:1.5,specularIntensity:0,envMapIntensity:.5,emissive:new an().setRGB(.0045,0,0)}),a={tNz:{value:t.noise},uSeed:{value:new R(n(),n(),n())},uLen:{value:e.len??19.9},uHair:{value:11.5+n()*2}};return o.onBeforeCompile=s=>{Object.assign(s.uniforms,a),Or(s),Bs(s,.22),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uLen;
uniform float uHair;`).replace("#include <color_fragment>",`#include <color_fragment>
${m1}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = lRough;`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = lMetal;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance *= (1.0 - chip);`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = lCoat;`).replace("#include <lights_fragment_maps>",`#include <lights_fragment_maps>
radiance *= mix(1.0, 0.08, chip);`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= mix(1.0, 0.15, chip);
{ vec3 cT = vec3(0.8, 0.035, 0.03); float cA = max(clearcoatSpecularDirect.r, clearcoatSpecularIndirect.r); float hot = smoothstep(12.0, 40.0, cA); clearcoatSpecularDirect *= mix(cT, vec3(1.0), hot); clearcoatSpecularIndirect *= mix(cT, vec3(1.0), hot); }`),Dr(s),O0(s)},o.customProgramCacheKey=()=>"ss-out-lacquer",Object.assign(o,{ss:a})}const Tc=e=>`vec3 gEx = max(outgoingLight - ${e.toFixed(3)}, 0.0);
outgoingLight = min(outgoingLight, vec3(${e.toFixed(3)})) + gEx / (1.0 + gEx * 4.0);`,xr={value:1};function g1(e={}){const t=new t0({color:0,metalness:0,roughness:.012,ior:1.52,specularIntensity:1,envMapIntensity:e.env??.07,transparent:!0,depthWrite:!1});t.blending=Wn,t.blendSrc=kt,t.blendDst=Cr,t.blendEquation=ra;const n=e.tint??.1;return t.onBeforeCompile=o=>{o.uniforms.uGEnv=xr,Bs(o,e.env??.3),o.fragmentShader=o.fragmentShader.replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= 0.0;
reflectedLight.indirectSpecular *= uGEnv;`).replace("#include <common>",`#include <common>
uniform float uGEnv;`).replace("#include <opaque_fragment>",`${Tc(.38)}
float gF = ((1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)) * (1.0 - clamp(dot(normalize(vViewPosition), -normal) * -1.0, 0.0, 1.0)));
gl_FragColor = vec4(outgoingLight, ${n.toFixed(3)} + 0.35 * gF);`),O0(o)},t.customProgramCacheKey=()=>`ss-out-glass-${e.env??.3}`,t}const Fc={value:0};function hi(e={}){const t=new Io({color:new an().setScalar(e.gain??.45),metalness:1,roughness:e.rough??.2,envMapIntensity:e.env??.12,transparent:!0,depthWrite:!1,side:M0});return t.blending=Wn,t.blendSrc=kt,t.blendDst=kt,t.blendEquation=ra,t.onBeforeCompile=n=>{n.uniforms.uCFace=Fc,n.uniforms.uCGlow=Vr,n.uniforms.uCFront=Rc,Bs(n,e.env??.12),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
outgoingLight *= (cLine + ${(e.face??.07).toFixed(3)}) * mix(1.0, cLine, uCFace);
float cD = length(vCP - uCFront);
float cG = clamp(uCGlow * 3.0, 0.0, 1.0) * mix(1.0, exp(-cD / 2.4) * (1.0 - smoothstep(2.5, 6.0, cD)), step(0.5, uCFace));
outgoingLight *= mix(vec3(1.0), vec3(1.0, 0.1, 0.08), cG);
${Tc(.3)}
gl_FragColor = vec4(outgoingLight, 0.0);`)},t.customProgramCacheKey=()=>`ss-out-crack-${e.face??.07}-${e.env??.12}`,t}const x1=`
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
ssRough = mix(ssRough, ssRough * 0.8 + 0.05 * vg, gIn * glim);`,fo={value:1},w1=`{
float rkD = dot(vOP.xz, vec2(-0.8, 0.6)) - uRake.x;
float rkB = rkD < 0.0 ? exp(-((rkD / 1.2) * (rkD / 1.2))) : exp(-((rkD / 3.2) * (rkD / 3.2)));
float rkE = 0.25 + 0.75 * smoothstep(-22.0, 8.0, dot(vOP.xz, vec2(0.6, 0.8)));
float rk = mix(1.0, 0.08 + 0.92 * rkB * rkE, uRake.y);
reflectedLight.directDiffuse *= rk; reflectedLight.directSpecular *= rk;
reflectedLight.indirectSpecular *= uLidEnv;
}`;function y1(e){const t=bn({finish:"polished",seed:e.seed,wear:e.wear,tier:e.tier,age:e.age}),n=t.onBeforeCompile,o={uCart:{value:e.cart??7},uGRim:{value:e.rim??24.6},uPitch:{value:e.pitch??.3},uRake:{value:new Ft(0,1)},uLidEnv:fo};return t.onBeforeCompile=(a,s)=>{n.call(t,a,s),Object.assign(a.uniforms,o),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
uniform float uCart;
uniform float uGRim;
uniform float uPitch;
uniform vec2 uRake;
uniform float uLidEnv;`).replace("#include <roughnessmap_fragment>",`${x1}
#include <roughnessmap_fragment>`).replace("#include <aomap_fragment>",`reflectedLight.directSpecular *= mix(1.0, 0.1 + 1.2 * smoothstep(0.55, 0.9, 1.0 - vg), gIn * glim);
`+w1+`
#include <aomap_fragment>`)},t.customProgramCacheKey=()=>`ss-out-guilloche-${e.tier==="low"?"l":"h"}`,t}const b1=`
#include <common>
uniform vec2 uSph;
varying vec3 vDC;
varying float vDR;`,M1=`
#include <worldpos_vertex>
#ifdef USE_INSTANCING
mat4 dM = modelMatrix * instanceMatrix;
#else
mat4 dM = modelMatrix;
#endif
vDC = (dM * vec4(0.0, uSph.x, 0.0, 1.0)).xyz;
vDR = uSph.y * length(dM[0].xyz);`,S1=`
#include <common>
uniform samplerCube uCube;
uniform float uHasCube;
uniform vec3 uLd;
uniform float uCaus;
uniform float uBody;
varying vec3 vDC;
varying float vDR;`,k1=`
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
refr *= uBody;
vec3 pc = vDC - normalize(uLd * vec3(1.0, 0.25, 1.0)) * vDR * 0.62;
pc.y = min(pc.y, vDC.y + vDR * 0.2);
float cd = length(cross(pc - vPW, dV));
float caus = exp(-((cd / (vDR * 0.05)) * (cd / (vDR * 0.05)))) * uCaus * smoothstep(0.1, 0.4, dCos);
outgoingLight += refr + vec3(caus);`;function z1(e={}){const t=new t0({color:0,metalness:0,roughness:.03,ior:1.33,specularIntensity:1,envMapIntensity:2.2}),n={uCube:{value:e.cube??null},uHasCube:{value:e.cube?1:0},uSph:{value:new Ft(e.sphere?.c??-.3,e.sphere?.R??1.05)},uLd:{value:(e.light??new R(-.6,.7,-.4)).clone().normalize()},uCaus:{value:e.caustic??2.2},uBody:{value:1}};return t.onBeforeCompile=o=>{Object.assign(o.uniforms,n),O0(o),o.vertexShader=o.vertexShader.replace("#include <common>",b1).replace("#include <worldpos_vertex>",M1),o.fragmentShader=o.fragmentShader.replace("#include <common>",S1).replace("#include <opaque_fragment>",`${k1}
#include <opaque_fragment>`)},t.customProgramCacheKey=()=>"ss-out-drop",Object.assign(t,{ss:n})}function P1(e={}){const t=new t0({color:0,metalness:0,roughness:.025,ior:1.33,specularIntensity:1,envMapIntensity:e.env??2.4,transparent:!0,depthWrite:!1});t.blending=Wn,t.blendSrc=kt,t.blendDst=Cr,t.blendEquation=ra;const n=e.tint??.14;return t.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("#include <opaque_fragment>",`vec3 wEx = max(outgoingLight - 0.5, 0.0);
outgoingLight = min(outgoingLight, vec3(0.5)) + wEx / (1.0 + wEx * 3.0);
float wF = ((1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)) * (1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)) * (1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0)));
gl_FragColor = vec4(outgoingLight, ${n.toFixed(3)} + 0.4 * wF);`),O0(o)},t.customProgramCacheKey=()=>"ss-out-thin",t}function A1(e={}){const t=new Io({color:new an().setScalar(e.gain??.3),metalness:1,roughness:.12,envMapIntensity:.5,transparent:!0,depthWrite:!1});return t.blending=Wn,t.blendSrc=kt,t.blendDst=kt,t.blendEquation=ra,t.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aCav;
varying float vR;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vR = aCav;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying float vR;`).replace("#include <opaque_fragment>",`outgoingLight *= (1.0 - vR) * (0.35 + 0.65 * abs(dot(normalize(vViewPosition), normal)));
gl_FragColor = vec4(min(outgoingLight, vec3(0.35)), 0.0);`)},t.customProgramCacheKey=()=>"ss-out-rain",t}const R1=`
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
float sCoatR = mix(0.38, 0.22, wet) + 0.03 * (1.0 - midN);`;function C1(e={}){const t=ro(),n=ut((e.seed??1)*4271+9),o=new t0({color:16777215,metalness:0,roughness:.6,clearcoat:1,clearcoatRoughness:.05,ior:1.33,specularIntensity:.6,envMapIntensity:1.2}),a={tNz:{value:t.noise},uSeed:{value:new R(n(),n(),n())},uWet:{value:e.wet??.45}};return o.onBeforeCompile=s=>{Object.assign(s.uniforms,a),Or(s),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uWet;`).replace("#include <color_fragment>",`#include <color_fragment>
${R1}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = sRough;`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.clearcoat = sCoat;
material.clearcoatRoughness = sCoatR;
material.specularF90 = mix(material.specularF90, 1.0, mica);`),O0(s)},o.customProgramCacheKey=()=>"ss-out-stone",Object.assign(o,{ss:a})}const Ss=8,mi={name:"OutPuddle",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uTime:{value:0},uRip:{value:Array.from({length:Ss},()=>new vn(0,0,0,0))},uRipN:{value:0},uRipR:{value:60},uGain:{value:1},uLd:{value:new R(-.6,.7,-.4).normalize()},uSpec:{value:1.2}},vertexShader:`
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
uniform vec4 uRip[${Ss}];
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
  for (int i = 0; i < ${Ss}; i++) {
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
}`};function T1(e,t={}){const n=t.y??0,o=e.clone();o.translate(0,-n,0),o.rotateX(Math.PI/2);const[a,s]=t.res??[Math.round(innerWidth*Math.min(devicePixelRatio,2)/2),Math.round(innerHeight*Math.min(devicePixelRatio,2)/2)],r=new Wo(o,{textureWidth:a,textureHeight:s,color:14210256,clipBias:.002,shader:{...mi,uniforms:ji.clone(mi.uniforms)}});r.rotation.x=-Math.PI/2,r.position.y=n;const i=r.material.uniforms,c=(t.ripples??[]).slice(0,Ss);return c.forEach((l,d)=>i.uRip.value[d].set(l.x,l.z,l.phase,l.speed)),i.uRipN.value=c.length,i.uGain.value=t.gain??1,Object.assign(r,{ss:i})}function vi(e,t,n){switch(e){case"enamel":return h1({seed:t,impact:n.impact});case"lacquer":return v1({seed:t});case"glass":return g1();case"guilloche":return y1({seed:t,wear:n.wear,tier:n.q,age:n.age??n.wear*.5});case"polishedIn":return bn({finish:"polished",seed:t,wear:n.wear,tier:n.q,age:.08});case"crack":return hi();case"drop":return z1({cube:n.cube,sphere:n.sphere,light:n.light});case"water":return P1();case"rain":return A1();case"stone":return C1({seed:t,wet:n.wet});case"glassEdge":return hi({gain:.75,rough:.18,env:.1,face:.03});case"grained":return eo(bn({finish:"grained",seed:t,wear:n.wear,tier:n.q,age:n.age??n.wear*.5}),F1);default:return bn({finish:["polished","grained","striped","sunray","turned","brushed","blackened"].includes(e)?e:"polished",seed:t,wear:n.wear,tier:n.q,age:n.age??n.wear*.5,...n.near?{near:n.near}:{}})}}const F1=.3;function eo(e,t){const n=e.onBeforeCompile,o=e.customProgramCacheKey;return e.onBeforeCompile=(a,s)=>{n.call(e,a,s),Bs(a,t)},e.customProgramCacheKey=()=>`${o.call(e)}-e${t}`,e}function K0(e,t,n={}){const o=new zt,a={q:t,wear:n.wear??.5,...n};for(const s of e.pieces){if(s.finish==="puddle"){const f=T1(s.geo,{y:n.water?.y??0,ripples:n.ripples,res:t==="low"?[256,256]:void 0});f.name=s.name??"puddle",o.add(f);continue}const r=n.sphereOf?.(s.name??""),i=n.nearOf?.(s.name??""),c=vi(s.finish,s.seed,{...a,...s.wear===void 0?{}:{wear:s.wear},...r?{sphere:r}:{},...i?{near:i}:{}}),l=new ot(s.geo,c);s.at&&l.applyMatrix4(s.at),l.name=s.name??"";const d=c.transparent;l.castShadow=!d&&(n.shadows??t!=="low"),l.receiveShadow=n.shadows??t!=="low";const u=c.aim;u&&(l.onBeforeRender=(f,p,m)=>u(l,m)),o.add(l)}for(const s of e.inst){if(!s.mats.length)continue;const r=n.sphereOf?.(s.name??""),i=vi(s.finish,s.seed,r?{...a,sphere:r}:a),c=new Fn(s.geo,i,s.mats.length);s.mats.forEach((l,d)=>c.setMatrixAt(d,l)),c.instanceMatrix.needsUpdate=!0,c.name=s.name??"",c.castShadow=!i.transparent&&(n.shadows??t!=="low"),c.receiveShadow=n.shadows??t!=="low",c.computeBoundingSphere(),o.add(c)}return o}const _c={"lid-out":{id:"lid-out",en:["MK"],ar:["MK"],surface:"steel",layout:{kind:"mono"},aspect:1.32,cap:.44,tex:{high:200,mid:150,low:90}},"dial-xii":{id:"dial-xii",en:["STILL HERE"],ar:["لسه هنا"],surface:"enamel",layout:{kind:"line"},aspect:6,cap:.42,tex:{high:120,mid:90,low:56}},"barrel-bridge":{id:"barrel-bridge",en:["UNADJUSTED"],ar:["غير مضبوطة"],surface:"steel",layout:{kind:"line"},aspect:8.5,cap:.42,tex:{high:110,mid:84,low:52}},cock:{id:"cock",en:["F","·","S"],ar:["سريع","·","بطيء"],surface:"steel",layout:{kind:"row",x:.18,y:.56,gap:.85},aspect:1,cap:.1,tex:{high:104,mid:80,low:48}},"pallet-bridge":{id:"pallet-bridge",en:["ONE JEWEL"],ar:["جوهرة واحدة"],surface:"steel",layout:{kind:"line"},aspect:6.5,cap:.42,tex:{high:110,mid:84,low:52}},"lid-in":{id:"lid-in",en:["FOR WHOEVER WAITS"],ar:["للي بيستنى"],surface:"steel",layout:{kind:"line",wrap:!0},aspect:1.4,cap:.44,tex:{high:110,mid:84,low:52}}},Lc=e=>e.toLowerCase().startsWith("ar")?"ar":"en",_1="/flagship-portfolio/_astro/amiri-latin-700-normal.DIjoEGk6.woff2",L1="/flagship-portfolio/_astro/amiri-arabic-700-normal.D8FrblyB.woff2",ks={en:"ss-engrave-lat",ar:"ss-engrave-ar"},I1={en:_1,ar:L1},E1={},D1={};function N1(e){return E1[e]??=(async()=>{try{if(typeof FontFace>"u"||typeof document>"u")return!1;const t=new FontFace(ks[e],`url(${D1[e]??I1[e]})`,{weight:"700",style:"normal"});return await t.load(),document.fonts.add(t),await document.fonts.load(`700 64px "${ks[e]}"`,e==="ar"?"لسه":"MK"),document.fonts.check(`700 64px "${ks[e]}"`,e==="ar"?"لسه":"MK")}catch{return!1}})()}const W1=.16,H1=1.3;function qr(e,t,n){e.font=`700 ${n}px "${ks[t]}"`}function rs(e,t,n){qr(e,t,200);const o=e.measureText(t==="ar"?"ا":"H");return n*(t==="ar"?H1:1)*200/Math.max(1,o.actualBoundingBoxAscent)}function Ma(e,t,n,o,a=!1){if(qr(e,t,o),t==="ar"){e.direction="rtl",e.textAlign="center";const d=e.measureText(n),u=d.actualBoundingBoxAscent,f=d.actualBoundingBoxDescent;return a||e.fillText(n,0,(u-f)/2),{w:d.actualBoundingBoxLeft+d.actualBoundingBoxRight,h:u+f}}e.direction="ltr",e.textAlign="left";const s=[...n],r=s.map(d=>e.measureText(d).width),i=W1*o,c=r.reduce((d,u)=>d+u,0)+i*(s.length-1),l=e.measureText("H").actualBoundingBoxAscent;if(!a){let d=-c/2;s.forEach((u,f)=>{u!==" "&&e.fillText(u,d,l/2),d+=r[f]+i})}return{w:c,h:l}}function B1(e,t,n){const o=e.id==="lid-out"?"en":t,a=t==="ar"?e.ar:e.en;let s=e.tex[n];const r=Math.round(s/e.cap),i=Math.round(r*e.aspect),c=document.createElement("canvas");c.width=i,c.height=r;const l=c.getContext("2d",{willReadFrequently:!0});l.fillStyle="#000",l.fillRect(0,0,i,r),l.fillStyle="#fff";const d=[];if(e.layout.kind==="line"){let p=rs(l,o,s);const m=a[0],h=e.layout.wrap&&o==="en"?m.split(" "):[m],v=1.55,M=h.map(y=>Ma(l,o,y,p,!0)),w=Math.max(...M.map(y=>y.w)),x=M[0].h*(1+v*(h.length-1)),g=Math.min(1,i*.92/w,r*.9/x);p*=g,s*=g,h.forEach((y,b)=>{l.setTransform(1,0,0,1,i/2,r/2+(b-(h.length-1)/2)*v*M[0].h*g),Ma(l,o,y,p)})}else if(e.layout.kind==="mono"){const p=rs(l,"en",s);qr(l,"en",p);const m=l.measureText("M").width,h=l.measureText("K").width,v=p*.08,M=l.measureText("H").actualBoundingBoxAscent,w=i/2-(m+v+h)/2;l.direction="ltr",l.textAlign="left",l.fillText("M",w,r/2+M/2),l.fillText("K",w+m+v,r/2+M/2),l.strokeStyle="#fff",l.lineWidth=s*.028,l.beginPath(),l.ellipse(i/2,r/2,i*.455,r*.43,0,0,Math.PI*2),l.stroke()}else if(e.layout.kind==="row"){const{x:p,y:m,gap:h}=e.layout,v=rs(l,o,s),M=h*s,w=t==="ar"?[a[2],a[1],a[0]]:a,x=w.map(z=>z==="·"?0:Ma(l,o,z,v,!0).w),g=x.reduce((z,k)=>z+k,0)+M*(w.length-1);let y=i/2*(1+p)-g/2;const b=r/2*(1-m);w.forEach((z,k)=>{z==="·"?d.push({x:y,y:b,r:s*.13}):(l.setTransform(1,0,0,1,y+x[k]/2,b),Ma(l,o,z,v)),y+=x[k]+M})}else{const{r:p,a0:m,a1:h}=e.layout,v=p*i/2,M=rs(l,o,s),w=t==="ar"?[a[2],a[1],a[0]]:a;w.forEach((x,g)=>{const y=m+(h-m)*g/(w.length-1),b=i/2+Math.cos(y)*v,z=r/2+Math.sin(y)*v;if(x==="·"){d.push({x:b,y:z,r:s*.14});return}const k=y+Math.PI/2;l.setTransform(Math.cos(k),Math.sin(k),-Math.sin(k),Math.cos(k),b,z),Ma(l,o,x,M)})}l.setTransform(1,0,0,1,0,0);const u=l.getImageData(0,0,i,r).data,f=new Float32Array(i*r);for(let p=0;p<i*r;p++)f[p]=u[p*4]/255;return{cov:f,w:i,h:r,capTex:s,dimples:d,aspect:e.aspect}}const Ia=1e20;function gi(e,t,n,o,a){n[0]=0,o[0]=-Ia,o[1]=Ia;for(let s=1,r=0;s<a;s++){let i=(e[s]+s*s-(e[n[r]]+n[r]*n[r]))/(2*s-2*n[r]);for(;i<=o[r];)r--,i=(e[s]+s*s-(e[n[r]]+n[r]*n[r]))/(2*s-2*n[r]);r++,n[r]=s,o[r]=i,o[r+1]=Ia}for(let s=0,r=0;s<a;s++){for(;o[r+1]<s;)r++;const i=s-n[r];t[s]=i*i+e[n[r]]}}function xi(e,t,n){const o=Math.max(t,n),a=new Float64Array(o),s=new Float64Array(o),r=new Int32Array(o),i=new Float64Array(o+1);for(let c=0;c<t;c++){for(let l=0;l<n;l++)a[l]=e[l*t+c];gi(a,s,r,i,n);for(let l=0;l<n;l++)e[l*t+c]=s[l]}for(let c=0;c<n;c++){for(let l=0;l<t;l++)a[l]=e[c*t+l];gi(a,s,r,i,t);for(let l=0;l<t;l++)e[c*t+l]=s[l]}}function O1(e,t,n){const o=new Float64Array(t*n),a=new Float64Array(t*n);for(let r=0;r<t*n;r++){const i=e[r];i>=.999?(o[r]=0,a[r]=Ia):i<=.001?(o[r]=Ia,a[r]=0):(o[r]=Math.max(0,.5-i)**2,a[r]=Math.max(0,i-.5)**2)}xi(o,t,n),xi(a,t,n);const s=new Float32Array(t*n);for(let r=0;r<t*n;r++)s[r]=Math.sqrt(o[r])-Math.sqrt(a[r]);return s}function is(e,t,n){let o=e*374761393+t*668265263+n*2147483647|0;return o=Math.imul(o^o>>>13,1274126177),o^=o>>>16,(o>>>0)/4294967296}function Xs(e,t,n){const o=Math.floor(e),a=Math.floor(t),s=e-o,r=t-a,i=s*s*(3-2*s),c=r*r*(3-2*r),l=is(o,a,n),d=is(o+1,a,n),u=is(o,a+1,n),f=is(o+1,a+1,n);return l+(d-l)*i+(u-l)*c+(l-d-u+f)*i*c}function V1(e,t,n,o){const a=o.capTex,s=o.grow*a,r=o.slope,i=o.depth*a,c=(o.burr??0)*a,l=Math.max(1.2,o.burrW*a),d=o.seed??1,u=o.burrDir??[.6,-.8],f=Math.hypot(u[0],u[1])||1,p=u[0]/f,m=-u[1]/f,h=O1(e,t,n),v=new Float32Array(t*n),M=new Float32Array(t*n),w=(g,y)=>h[Math.min(n-1,Math.max(0,y))*t+Math.min(t-1,Math.max(0,g))]-s;for(let g=0;g<n;g++)for(let y=0;y<t;y++){const b=g*t+y,z=w(y,g);let k=z<0?i*Math.tanh(-z*r/i):0,I=0;if(c>0&&z>0&&z<l){const F=w(y+1,g)-w(y-1,g),W=w(y,g+1)-w(y,g-1),A=Math.hypot(F,W)||1,B=Math.min(1,Math.max(0,(F*p+W*m)/A*1.6-.2));I=c*Math.sin(Math.PI*z/l)*B*(.7+.3*Xs(y/(a*.08),g/(a*.08),d+5))}for(const F of o.dimples??[]){const W=Math.hypot(y+.5-F.x,g+.5-F.y);W<F.r?(k=Math.max(k,Math.max(i*1.15,F.r*.5)*(1-(W/F.r)**2)),I=0):c>0&&W<F.r+l&&(I=Math.max(I,c*.6*Math.sin(Math.PI*(W-F.r)/l)))}v[b]=I-k;const P=k/i,C=Xs(y/(a*.11),g/(a*.11),d),S=Xs(y/(a*.035),g/(a*.035),d+9);M[b]=Math.min(1,Math.max(0,(P-.45)/.5)*(.5+.5*C)+Math.max(0,Math.min(1,(P-.12)/.4))*.35*S*S)}const x=new Float32Array(t*n*4);for(let g=0;g<n;g++)for(let y=0;y<t;y++){const b=g*t+y,z=Math.max(0,y-1),k=Math.min(t-1,y+1),I=Math.max(0,g-1),P=Math.min(n-1,g+1),C=(v[g*t+k]-v[g*t+z])/(k-z||1),S=(v[P*t+y]-v[I*t+y])/(P-I||1);x[b*4]=v[b]/i,x[b*4+1]=C,x[b*4+2]=-S,x[b*4+3]=M[b]}return x}function q1(e){const t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);let n=2166136261;for(let o=0;o<t.length;o++)n^=t[o],n=Math.imul(n,16777619);return(n>>>0).toString(16).padStart(8,"0")}const G1=`
uniform vec3 uWO;
uniform vec3 uWR;
uniform vec3 uWUp;
uniform vec2 uWHalf;
varying vec3 vWF;
varying float vWNd;
varying vec3 vWRv;
varying vec3 vWUv;`,U1=`
vec3 wRel = position - uWO;
vec3 wNo = cross(uWR, uWUp);
vWF = vec3(dot(wRel, uWR) / uWHalf.x, dot(wRel, uWUp) / uWHalf.y, dot(wRel, wNo));
vWNd = dot(normalize(normal), wNo);
mat3 wMV = mat3(modelViewMatrix);
#ifdef USE_INSTANCING
wMV = wMV * mat3(instanceMatrix);
#endif
vWRv = wMV * uWR;
vWUv = wMV * uWUp;`,$1=`
uniform sampler2D tWords;
uniform float uWOn;
uniform float uWDepth;
uniform float uWBump;
uniform float uWCalm;
uniform float uWLit;
varying vec3 vWF;
varying float vWNd;
varying vec3 vWRv;
varying vec3 vWUv;`,j1=`
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
#endif`,K1=`
#ifdef USE_CLEARCOAT
material.clearcoat *= 1.0 - wCut;
#endif`,wi=new Map,Ic=new Es(new Uint16Array(4),1,1,Rr,xo);Ic.needsUpdate=!0;async function Y1(e,t,n="high"){const o=_c[e],a=e==="lid-out"?"en":Lc(t);if(!await N1(e==="lid-out"?"en":a))return null;await new Promise(c=>setTimeout(c,0));const s=B1(o,a,n),r=o.surface==="steel";return{data:V1(s.cov,s.w,s.h,{capTex:s.capTex,grow:.03,slope:1.15,depth:.09,burr:r?.006:0,burrW:.035,dimples:s.dimples,seed:e.length*31+(a==="ar"?7:1)}),w:s.w,h:s.h,aspect:s.aspect,capTex:s.capTex,ink:s.cov.reduce((c,l)=>c+l,0)}}function X1(e,t,n="high"){const o=`${e}|${Lc(t)}|${n}`;let a=wi.get(o);return a||(a=(async()=>{const s=await Y1(e,t,n);if(!s)return null;const{data:r}=s;for(let l=0;l<r.length;l++)if(!Number.isFinite(r[l]))return null;const i=new Uint16Array(r.length);for(let l=0;l<r.length;l++)i[l]=ol.toHalfFloat(r[l]);const c=new Es(i,s.w,s.h,Rr,xo);return c.minFilter=Yi,c.magFilter=Ki,c.generateMipmaps=!0,c.wrapS=c.wrapT=al,c.anisotropy=n==="low"?2:8,c.needsUpdate=!0,{tex:c,hash:q1(r),w:s.w,h:s.h,aspect:s.aspect,cap:s.capTex/s.h}})().catch(()=>null),wi.set(o,a)),a}function Z1(e){const t=[],n=o=>{if(o.isMaterial){t.push(o);return}o.traverse(a=>{const s=a.material;a.isMesh&&s&&(Array.isArray(s)?s:[s]).forEach(r=>t.push(r))})};return(Array.isArray(e)?e:[e]).forEach(n),[...new Set(t)].filter(o=>o.isMeshStandardMaterial)}function da(e,t,n,o,a={}){const s=_c[e],r=a.tier??"high",i=new R(...n.right).normalize(),c=new R(...n.up),l=c.addScaledVector(i,-c.dot(i)).normalize(),d=n.height??n.width/s.aspect,u={uWO:{value:new R(...n.at)},uWR:{value:i},uWUp:{value:l},uWHalf:{value:new Ft(n.width/2,d/2)},tWords:{value:Ic},uWOn:{value:0},uWDepth:{value:n.depth??d*.6},uWBump:{value:a.bump??1},uWCalm:{value:a.calm??(s.surface==="steel"?1:0)},uWLit:{value:a.lit??1}};let f=null;for(const m of Z1(t)){if(m.userData.ssWords)continue;m.userData.ssWords=e;const h=m.onBeforeCompile,v=m.customProgramCacheKey.bind(m);m.onBeforeCompile=(M,w)=>{h.call(m,M,w),Object.assign(M.uniforms,u),M.vertexShader=M.vertexShader.replace("#include <common>",`#include <common>
${G1}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${U1}`),M.fragmentShader=M.fragmentShader.replace("#include <common>",`${s.surface==="enamel"?`#define SS_W_ENAMEL
`:""}#include <common>
${$1}`).replace("#include <lights_physical_fragment>",`${j1}
#include <lights_physical_fragment>`).replace("#include <lights_fragment_begin>",`${K1}
#include <lights_fragment_begin>`).replace("#include <opaque_fragment>",`outgoingLight *= mix(1.0, uWLit, wCut);
#include <opaque_fragment>`)},m.customProgramCacheKey=()=>`${v()}-w${s.surface==="enamel"?"e":"s"}`,m.needsUpdate=!0}return{ready:X1(e,o,r).then(m=>(f=m,m?(u.tWords.value=m.tex,u.uWOn.value=1,!0):!1)),hash:()=>f?.hash??null,cap:()=>f?.cap??null,size:()=>f?[f.w,f.h]:null,uniforms:u}}function wr(e){const t=window;(t.__secondWait??=[]).push(e)}const Sa=-1.4,Ec=-14,Q1=Math.PI/180,yi=99,oa=104;function J1(e){const t=Ge(e/.72),n=t<.16?.05*ne(t/.16):.05+.95*ne((t-.16)/.84);return yi*n+(oa-yi)*ne((e-.72)/.28)}function ed(e){const t=e.getAttribute("position"),n=e.getAttribute("normal"),o=(Sa-Ec)/(Sa-Oe.caseBottom);for(let a=0;a<t.count;a++){const s=t.getY(a);if(!(s>=Sa)&&(t.setY(a,Sa+(s-Sa)*o),n)){const r=n.getX(a),i=n.getY(a)/o,c=n.getZ(a),l=Math.hypot(r,i,c)||1;n.setXYZ(a,r/l,i/l,c/l)}}t.needsUpdate=!0,n&&(n.needsUpdate=!0),e.computeBoundingBox(),e.computeBoundingSphere()}function td(e,t,n,o){const a=e.onBeforeCompile,s=e.customProgramCacheKey?.bind(e);e.onBeforeCompile=(r,i)=>{a.call(e,r,i),r.uniforms.tMir={value:t},r.uniforms.uMirM={value:n},r.uniforms.uMirG=o,r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
uniform mat4 uMirM;
varying vec4 vMirUv;`).replace("#include <project_vertex>",`#include <project_vertex>
vMirUv = uMirM * modelMatrix * vec4(transformed, 1.0);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D tMir;
uniform float uMirG;
varying vec4 vMirUv;`).replace("#include <opaque_fragment>",`vec2 mUv = vMirUv.xy / vMirUv.w + normal.xz * 0.004;
outgoingLight += texture2D(tMir, mUv).rgb * uMirG;
#include <opaque_fragment>`)},e.customProgramCacheKey=()=>`${s?s():""}-mir`,e.needsUpdate=!0}const Dc={value:0};function Nc(e){const t=[],n=new Set;for(const o of e)o.traverse(a=>{const s=a.material,r=s?.ss;if(!r?.uAge||n.has(s))return;n.add(s),t.push([r,r.uAge.value]);const i=s.onBeforeCompile.bind(s),c=s.customProgramCacheKey.bind(s);s.onBeforeCompile=(l,d)=>{i(l,d),l.uniforms.uClean=Dc,l.fragmentShader=l.fragmentShader.replace("void main() {",`uniform float uClean;
void main() {`).replace("float ssH =",`pitH *= 1.0 - uClean;
scr *= 1.0 - uClean;
ssRough = mix(ssRough, rF + 0.04, uClean);
ssMetal = mix(ssMetal, mF, uClean);
float ssH =`)},s.customProgramCacheKey=()=>c()+"-clean"});return t}function nd(e){const t=e.kit.q,n=Ho(t),o=new zt,a=a1({detail:n,lidAngle:0}),s=a.part.pieces.find(D=>D.name==="case-body");s&&ed(s.geo);const r=K0(a.part,t,{nearOf:D=>D==="case-body"?22:void 0}),i=fe.findIndex(D=>D.id==="G"),c=r.children.find(D=>D.name==="case-body")?.material??null;o.add(r);const l=Nc(r.children),d=Oe.hinge,u=new zt;u.position.set(d.x,d.y,0);const f=[];r.children.slice().forEach(D=>{/^lid-/.test(D.name)&&(f.push(D),D.position.x-=d.x,D.position.y-=d.y,u.add(D))}),o.add(u);const p=D=>f.find(E=>E.name===D),m=p("lid-outside"),h=p("lid-inside");m&&eo(m.material,.25),m&&wr(da("lid-out",m,{at:[0,Oe.lidDome+.2,0],right:[1,0,0],up:[0,0,-1],width:11,depth:.8},e.lang).ready),h&&wr(da("lid-in",h,{at:[0,Oe.lidDome+.2-Oe.lidT,0],right:[0,0,-1],up:[1,0,0],width:44,depth:1.6},e.lang,{lit:.3}).ready);let v=null;const M=6,w=/^(case-body|case-hinge|hand-(hour|minute|second|pipes)|enamel-\d|numerals-\d)$/,x={value:0};if(t!=="low"&&h){v=new Wo(new ia(23.6,48),{textureWidth:512,textureHeight:512,clipBias:.02,color:16777215}),v.rotation.x=Math.PI/2,v.position.set(25.55,Oe.caseTop-d.y+.32,0);const E=v.material;E.colorWrite=!1,E.depthWrite=!1,v.renderOrder=-1,v.camera.layers.set(M),u.add(v),td(h.material,v.getRenderTarget().texture,E.uniforms.textureMatrix.value,x);const N=v.onBeforeRender.bind(v);let V=!1;v.onBeforeRender=(K,j,me,xe,Me,q)=>{const he=f.map(ce=>ce.visible);f.forEach(ce=>ce.visible=!1),V||(V=!0,j.traverse(ce=>{let ue=ce,Ae="";for(;ue&&!Ae;)Ae=ue.name,ue=ue.parent;(ce.isLight||w.test(Ae))&&ce.layers.enable(M)})),Lo.value=0,N(K,j,me,xe,Me,q),Lo.value=1,f.forEach((ce,ue)=>ce.visible=he[ue])}}const g=Pc({detail:n,hollow:{x:0,z:0,r:200,depth:2},water:.6,ripples:0}),y=K0(g.part,t,{water:g.water,ripples:g.ripples,shadows:t!=="low"});y.position.y=Ec+1.4-g.water.y,o.add(y);const b=ut(404),z=Ms(46,()=>{const D=b()*Math.PI*2,E=6+Math.sqrt(b())*70;return{p:new R(Math.cos(D)*E,6+b()*48,Math.sin(D)*E),up:new R((b()-.5)*.3,1,(b()-.5)*.3)}},5,[.35,.6,1]),k=Ms(34,(D,E)=>{const N=9+Math.pow(D,.6)*15,V=Math.PI+(E-.5)*2.4*(1-D*.3),K=Math.cos(V)*N,j=Math.sin(V)*N,me=.95+(Oe.lidDome+.2-.95)*(1-(N/24.6)**2)+Oe.caseTop-.01;return{p:new R(K-d.x,me-d.y,j),up:new R(0,1,0)}},9,[.22,.38,.6]),I=Z0([],[...z.map((D,E)=>({geo:bs(n),finish:"drop",seed:80+E,mats:D,name:`air-${E}`}))]),P=Z0([],[{geo:bs(n,!0),finish:"drop",seed:90,mats:k.flat(),name:"beads"}]),C=K0(I,t,{shadows:!1,sphereOf:()=>ys(1,.7)}),S=K0(P,t,{shadows:!1,sphereOf:()=>ys(1,.42)});o.add(C),u.add(S),r.updateMatrixWorld(!0);const F=new Wa,W=new R(0,-1,0),A=ut(431),B=[[200,4.5],[232,3.5],[158,3],[268,4]],oe=Ms(40,(D,E)=>{const N=B[Math.min(3,Math.floor(A()*4))],V=(N[0]+(D-.5)*2*N[1]*(.4+.6*A()))*Math.PI/180,K=22.9+E*1.7;F.set(new R(K*Math.sin(V),20,-K*Math.cos(V)),W);const j=F.intersectObjects(r.children,!1)[0];if(!j?.face)return null;const me=j.face.normal.clone().transformDirection(j.object.matrixWorld);return me.y<.6?null:{p:j.point.clone().addScaledVector(me,-.01),up:me}},13,[.16,.26,.4]),ie=K0(Z0([],[{geo:bs(n,!0),finish:"drop",seed:93,mats:oe.flat(),name:"gate-drops"}]),t,{shadows:!1,sphereOf:()=>ys(1,.42)});ie.visible=!1,o.add(ie);let U=0,O=null;return{group:o,lid:u,street:y,air:C,lidAngle:()=>U,update(D){const E=D.i;y.visible=C.visible=E<=3;{const xe=fe[1].exposure??1,Me=fe[2].exposure??1,q=E===2&&!D.inHold?(xe+(Me-xe)*ne(D.u/(fe[2].exposureIn??1)))*Ns(2,D.u,!1):Me,he=E===2&&!D.inHold?Ge(Me/q):1;O||(O=[],o.traverse(ce=>{const ue=ce.material;ue?.ss?.uBody&&!O.includes(ue.ss.uBody)&&O.push(ue.ss.uBody)}));for(const ce of O)ce.value=he}ie.visible=E===i,u.visible=E<=3||E>=9,v&&(v.visible=E<=0||E>=9,x.value=v.visible?E===0?.08:.12:0),fo.value=E===0?.12:1;{const xe=c?.ss?.uNear;xe&&(xe.value=Math.max(.001,22*(E===1?1+(D.inHold?0:2*ne(Ge((D.u-.12)/.12))*(1-ne(Ge((D.u-.85)/.15)))):E===2&&!D.inHold?1-ne(Ge((D.u-.25)/.3)):0)))}c&&(c.envMap=e.scene.environment,c.envMapIntensity=E===1?D.inHold?.03:.03+(e.scene.environmentIntensity*2.6-.03)*ne(Ge((D.u-.3)/.12))*(1-ne(Ge((D.u-.6)/.25))):E===i&&D.local("G")>.3?.04:e.scene.environmentIntensity);const N=E===i&&(D.inHold||D.u>.3),V=N||E===i+1||E>=9,K=E===1&&!D.inHold?1-ne(Ge((D.u-.22)/.12))*(1-ne(Ge((D.u-.85)/.15))):1;for(const[xe,Me]of l)xe.uAge.value=V?0:Me*K;Dc.value=V?1:0;let j=J1(D.local("0"));const me=D.trick("0");if(me.k>0){const xe=me.phase,Me=ne(xe/.55)*(1-ne((xe-.62)/.2)),q=xe>.62&&xe<.95?Math.sin((xe-.62)*60)*Math.exp(-(xe-.62)*14)*.45:0;j-=(3.5*Me+q)*me.k}if(E>=9){j=oa;const xe=D.trick("8");xe.rare>=0&&(j=oa*(1-ne(Math.max(0,xe.rare-.85)/.15)))}U=j,u.rotation.z=j*Q1}}}const Zs=Math.PI/180,od={n:6},ka=i0,_s={v:-1},Po={x:30,z:0,r:260,water:.72,stone:.03},bi=-14+1.4,Mi=2.6,cs={lift:60,shift:[-34,39],turn:Math.PI},yr=Math.PI*2,Ea={mirrorShut:.62,fall:.07},ls={angle:.25,blade:.5},ad=1,sd=Ea.mirrorShut+Ea.fall;function rd(e){const t=Math.floor(e),n=e-t,o=ne(n/.09)+.1*Math.sin(Ge((n-.09)/.25)*Math.PI)*Math.exp(-n*4);return W0+(t+o)*yr/60}const id=`
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
}`,cd=`
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
}`;function ld(e,t,n){const o=e.kit.q,a=new zt,s=fe.findIndex(Y=>Y.id==="8"),r=Pc({detail:Ho(o),seed:27,hollow:{x:Po.x,z:Po.z,r:Po.r,depth:16},water:Po.water,ripples:8}),i=K0(r.part,o,{water:r.water,ripples:r.ripples,shadows:o!=="low"});i.position.y=bi-r.water.y,a.add(i),i.traverse(Y=>{const J=Y.material;if(J&&J.ss?.uWet){J.ss.uWet.value=1;const pe=J.onBeforeCompile.bind(J);J.onBeforeCompile=(Se,Ee)=>{pe(Se,Ee),Se.fragmentShader=Se.fragmentShader.replace("diffuseColor.rgb = sc;",`diffuseColor.rgb = sc * ${Po.stone.toFixed(3)};`)},J.customProgramCacheKey=()=>"stone-soaked"}});const c=i.getObjectByName("setts");c&&(c.visible=!1);const l=i.getObjectByName("joints");l&&(l.visible=!1);const d=i.getObjectByName("puddle"),u=bi;d?.ss&&(d.ss.uRipR.value=22,d.ss.uSpec.value=.6,d.ss.uLd.value.set(.1,1,.12).normalize());const f=o==="low"?260:620,p=150,m=ut(8080),h=new Ua;h.index=new mo(new Uint16Array([0,1,2,0,2,3]),1),h.setAttribute("position",new wt([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3));const v=new Float32Array(f*4);for(let Y=0;Y<f;Y++){const J=m()*yr,pe=Math.sqrt(m())*110;v.set([Math.cos(J)*pe-10,Math.sin(J)*pe,m()*p,.75+m()*.5],Y*4)}h.setAttribute("aR",new Tn(v,4)),h.instanceCount=f;const M={uTime:{value:0},uFreeze:{value:0},uY0:{value:u},uH:{value:p},uLen:{value:16},uBF:{value:new R},uBD:{value:new R(0,-1,0)},uBC:{value:.95},uGain:{value:.32}},w=new zn({uniforms:M,vertexShader:id,fragmentShader:cd,transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendEquation:ra}),x=new ot(h,w);x.frustumCulled=!1,a.add(x);const g=new zt,y=new Ds;y.moveTo(-.9,-3),y.lineTo(-.55,0),y.lineTo(-.06,40),y.lineTo(.06,40),y.lineTo(.55,0),y.lineTo(.9,-3),y.closePath();const b=new ot(new Zi(y,{depth:.3,bevelEnabled:!0,bevelThickness:.08,bevelSize:.08,bevelSegments:2}),new In({color:3802114})),z=new ot(new h0(1,1),new zn({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uLead:{value:-1},uTrail:{value:-1},uAsp:{value:1.78},uP:{value:new Ft(-1.02,-1.04)}},vertexShader:"varying vec2 vU; void main() { vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uLead;
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
}`})),k=new zt;k.add(b),g.add(k,z),g.visible=!1;const I=Oe.hinge,P=Oe.lidDome+.2-Oe.lidT-.35-I.y,C=ut(77),S=new wo(1,20,14),F=new Io({color:394758,roughness:.05,metalness:.2,envMapIntensity:2.5}),W=Array.from({length:od.n},()=>({z:(C()-.5)*26,ph:C(),sp:.06+C()*.05,r:.45+C()*.35,wob:C()*6})),A=W.map(Y=>{const J=new ot(S,F);return J.scale.set(Y.r,Y.r*.55,Y.r),t.lid.add(J),J}),B=t.lid.getObjectByName("lid-inside"),oe=(Y,J)=>{if(!B)return P;const Se=new Wa(t.lid.localToWorld(new R(Y-I.x,-40,J)),new R(0,1,0).transformDirection(t.lid.matrixWorld)).intersectObject(B,!1)[0];return Se?t.lid.worldToLocal(Se.point.clone()).y:P};t.group.updateMatrixWorld(!0);const ie=W.map(Y=>Array.from({length:25},(J,pe)=>{const Se=21-pe/24*42;return oe(Se,Y.z*Math.sqrt(Math.max(0,1-(Se/24)**2)))})),U=new Wa,O=new Ft,D=new Ga(new R(0,1,0),-u),E=new R,N=d?.ss?.uRip?.value??[],V={uRip:{value:N},uRipN:{value:0},uTime:{value:0},uR:{value:22},uC:{value:new R(Po.x,u+.05,Po.z)},uPR:{value:92}},K=new zn({uniforms:V,transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendEquation:ra,vertexShader:`varying vec3 vW;
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
}`}),j=new ot(new h0(220,220).rotateX(-Math.PI/2),K);j.position.copy(V.uC.value),j.renderOrder=4,a.add(j);const me=ut(31),xe=Array.from({length:6},()=>[me(),.7+me()*.6]),Me=[];t.lid.traverse(Y=>{Y.isReflector&&Me.push(Y)});const q=new ge().makeTranslation(cs.shift[0],cs.lift+u,cs.shift[1]).multiply(new ge().makeScale(1,-1,1)).multiply(new ge().makeTranslation(0,-u,0)).multiply(new ge().makeRotationY(cs.turn));let he=oa,ce=1;if(d){const Y=d.onBeforeRender.bind(d);d.onBeforeRender=(J,pe,Se,Ee,He,ct)=>{if(!a.visible){Y(J,pe,Se,Ee,He,ct);return}const mt=n.hand.rotation.y,ht=t.lid.rotation.z;Ae&&(M.uFreeze.value=1,n.hand.rotation.y=-W0),t.lid.rotation.z=he*Zs;const xt=t.air.visible,yt=Me.map(ve=>ve.visible);t.air.visible=!1,Me.forEach(ve=>ve.visible=!1);for(const ve of[t.group,n.group])ve.matrixAutoUpdate=!1,ve.matrix.copy(q),ve.matrixWorldNeedsUpdate=!0;let $=null;pe.traverse(ve=>{!$&&ve.isSpotLight&&($=ve)});const L=$,Q=L?.position.clone(),ee=L?.target.position.clone(),be=L?.intensity??0,Le=fo.value,Re=pe.environmentIntensity;fo.value*=ce,pe.environmentIntensity=Re*ce,L&&(L.intensity*=ce,L.position.applyMatrix4(q),L.target.position.applyMatrix4(q),L.updateMatrixWorld(),L.target.updateMatrixWorld()),rt.uniforms.uG.value=o==="low"?Mi*.55:Mi,Y(J,pe,Se,Ee,He,ct),rt.uniforms.uG.value=1,fo.value=Le,pe.environmentIntensity=Re,L&&Q&&ee&&(L.intensity=be,L.position.copy(Q),L.target.position.copy(ee),L.updateMatrixWorld(),L.target.updateMatrixWorld());for(const ve of[t.group,n.group])ve.matrixAutoUpdate=!0,ve.updateMatrix(),ve.updateMatrixWorld(!0);t.air.visible=xt,Me.forEach((ve,_e)=>ve.visible=yt[_e]),M.uFreeze.value=ue,n.hand.rotation.y=mt,t.lid.rotation.z=ht}}let ue=0,Ae=!1;const we=new R,De=new R,Ve=new Xt,Ke=new R(0,1,0);let Xe=null,Ce=!1;const rt=new zn({uniforms:{uL:{value:new R(.35,1,.25).normalize()},uG:{value:1}},vertexShader:"varying vec3 vN; varying vec3 vV; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uL;
uniform float uG;
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN);
  float d = 0.5 + 0.5 * dot(n, uL), h = pow(max(dot(n, normalize(uL + vV)), 0.0), 24.0);
  gl_FragColor = vec4(vec3((0.07 + 0.1 * d + 0.16 * h) * uG, 0.0, 0.0), 1.0);
}`}),st=n.hand.children.filter(Y=>Y.name==="hand-second"||Y.name==="hand-collet"),Te=st.map(Y=>Y.material);let Fe=!1;const ae=Y=>{Y!==Fe&&(Fe=Y,st.forEach((J,pe)=>J.material=Y?rt:Te[pe]))};return{group:a,update(Y){Ce&&(e.scene.environmentIntensity=1,Ce=!1);const J=Y.i,pe=J===s;a.visible=pe,ae(pe&&Y.inHold),pe&&Y.inHold&&(c0.gain.value=0),g.parent!==Y.camera&&Y.camera.add(g);const Se=_s.v>=0?_s.v:J===s&&!Y.inHold?Y.u:-1;if(g.visible=Se>0&&Se<ka.trail[1]+.02,g.visible){const L=Y.camera.fov*Zs,Q=6,ee=Math.tan(L/2)*Q,be=ee*Y.camera.aspect,Le=mr(Se,ka.lead),Re=Se<ka.trail[0]?-1:mr(Se,ka.trail);z.position.set(0,0,-Q),z.scale.set(be*2,ee*2,1),z.renderOrder=10;const ve=z.material.uniforms;ve.uLead.value=Le,ve.uTrail.value=Re,ve.uAsp.value=Y.camera.aspect,k.position.set(be*ve.uP.value.x,ee*ve.uP.value.y,-Q+.5),k.scale.setScalar(Math.hypot(be*2.1,ee*2.1)*1.05/40),k.rotation.z=-Re,b.visible=Se>=ka.trail[0]-.03}if(!pe){A.forEach(L=>L.visible=!1);return}const Ee=Y.state.reduced?0:Y.state.time,He=Y.trick("8"),ct=He.rare,mt=ct>=0?ne(Ge(ct/Ea.mirrorShut)):0;he=oa*(1-mt),ce=(1-ne((mt-.45)/.4))**2;const ht=ct>=0?Ge((ct-Ea.mirrorShut)/Ea.fall):0,xt=ct>=sd;if(ct>=0){const L=ht<1?oa*(1-ht*ht):0;t.lid.rotation.z=L*Zs}ue=xt?1:0,A.forEach((L,Q)=>{const ee=W[Q],be=((Ee*ee.sp+ee.ph)%1+1)%1,Le=be*be,Re=21-Le*42,ve=ee.z*Math.sqrt(Math.max(0,1-(Re/24)**2))+Math.sin(be*9+ee.wob)*.6,_e=(21-Re)/42*24,Ue=Math.min(23,Math.floor(_e)),Ne=ie[Q][Ue]+(ie[Q][Ue+1]-ie[Q][Ue])*(_e-Ue);L.position.set(Re-I.x,Ne-ee.r*.45,ve),L.visible=!xt&&be<.96&&Math.hypot(Re,ve)<23}),Ae=He.on||xt,M.uFreeze.value=ue,t.air.visible=xt,x.visible=!xt,i.visible=!xt,t.street.visible=xt;const yt=xt?0:Ee;n.hand.rotation.y=-(xt?W0:rd(yt)),M.uTime.value=Ee;let $=null;if(e.scene.traverse(L=>{!$&&L.isSpotLight&&($=L)}),$){const L=$;if(xt){const ee=fe[0].light.blade,be=1+(ad/(fe[9].exposure??1)-1)*1;if(L.position.lerp(we.set(...ee.from),1),L.target.position.lerp(we.set(...ee.to),1),L.angle+=(ee.angle*ls.angle-L.angle)*1,L.intensity=(L.intensity+(ee.power*.4*ls.blade-L.intensity)*1)*be,L.updateMatrixWorld(),L.target.updateMatrixWorld(),Xe||e.scene.traverse(Le=>{const Re=Le.material?.uniforms;!Xe&&Le.renderOrder===5&&Re?.uCam&&Re?.uGain&&(Xe=Le)}),Xe){const Le=Xe.material.uniforms,Re=fe[0].light,ve=we.set(...ee.from),_e=De.set(...ee.to).sub(ve),Ue=_e.length()*1.15;Xe.position.lerp(ve,1),Ve.setFromUnitVectors(Ke,_e.normalize().negate()),Xe.quaternion.slerp(Ve,1);const Ne=Math.tan(ee.angle*ls.angle)*Ue;Xe.scale.lerp(De.set(Ne,Ue,Ne),1),Le.uGain.value=(Le.uGain.value+(Re.haze*.18*ls.blade-Le.uGain.value)*1)*be}fo.value=(fo.value+(.12-fo.value)*1)*be,e.scene.environmentIntensity=be,Ce=!0}M.uBF.value.copy(L.position),M.uBD.value.copy(L.target.position).sub(L.position).normalize(),M.uBC.value=Math.cos(L.angle)}if(d?.ss){const L=d.ss;L.uTime.value=xt?0:Ee,V.uTime.value=L.uTime.value,L.uRipN.value=8;for(let ee=0;ee<6;ee++){const[be,Le]=xe[ee],Re=Math.floor(Ee*Le*.45+be),ve=ut(ee*977+Re*13+5),_e=ve()*yr,Ue=30+Math.sqrt(ve())*70;N[ee].set(Math.cos(_e)*Ue-10,Math.sin(_e)*Ue,be,xt?0:Le)}const Q=He.on?He.k:0;O.set((Y.state.pointer.x-.5)*2,-(Y.state.pointer.y-.5)*2),U.setFromCamera(O,Y.camera),Q>0&&U.ray.intersectPlane(D,E)?(N[6].set(E.x,E.z,0,1.8),N[7].set(E.x,E.z,.5,1.8)):(N[6].set(0,0,0,0),N[7].set(0,0,0,0),L.uRipN.value=6),xt&&(L.uRipN.value=0),V.uRipN.value=L.uRipN.value,j.visible=!xt}}}}const Wc=16,ud=`uniform float uFill;
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
varying vec3 vON;`,dd=`
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
totalEmissiveRadiance += glowC * uGain;`;function fd(e,t,n,o,a=61){const s=n.clone().normalize(),r=t.clone().addScaledVector(s,-t.dot(s)).normalize(),i=new R().crossVectors(s,r).normalize(),c=ut(a),l=[],d=[new Ft(0,0)],u=7;for(let p=1;p<=u;p++)d.push(new Ft(o*p/u,(c()-.5)*o*.09+(p>2?-o*.025*(p-2):0)));for(let p=0;p<u;p++)l.push({a:d[p],b:d[p+1],t0:p/u*.92,t1:(p+1)/u*.92});const f=[1,2,3,5];for(const[p,m]of f.entries()){const h=d[m],v=p%2?1:-1,M=v*(.5+c()*.35),w=o*(.08+c()*.1),x=new Ft(Math.cos(M),Math.sin(M)),g=h.clone().addScaledVector(x,w),y=M+v*(c()-.3)*.6,b=g.clone().addScaledVector(new Ft(Math.cos(y),Math.sin(y)),w*.7),z=m/u*.92+.03,k=z+.12;l.push({a:h,b:g,t0:z,t1:k},{a:g,b,t0:k,t1:k+.1})}return{len:o,p:e.clone(),n:s,e1:r,e2:i,segs:l.slice(0,Wc)}}function Hc(e){const t=ro(),n=new t0({color:new an().setRGB(6e-4,0,3e-5),metalness:0,roughness:.03,ior:1.76,envMapIntensity:e.env??2.5,specularIntensity:1}),o=Array.from({length:Wc},()=>new vn),a={uCamO:{value:new R},uCrW:{value:new Ft(e.crack.len*.006,34/e.crack.len)},uFill:{value:e.fill??0},uHalf:{value:e.half.clone()},uCtr:{value:(e.centre??new R).clone()},uCrackP:{value:e.crack.p},uCrackN:{value:e.crack.n},uE1:{value:e.crack.e1},uE2:{value:e.crack.e2},uSeg:{value:o},uSegN:{value:0},uNode:{value:e.node.clone()},uPx:{value:.002},uGlow:{value:e.glow??1},uLit:{value:e.lit??1},uNodeK:{value:e.nodeK??1},uHeat:{value:0},uChipN:{value:e.chipN.clone().normalize()},uBody:{value:e.body??.05},uKey:{value:new R(0,1,0)},uSheen:{value:e.sheen??0},uBev:{value:e.bevel??0},uGain:{value:e.gain??1},uBevC:{value:new an(.86,.88,.92)},uBl:{value:new R(0,1,0)},uSheet:{value:e.sheet??0},uSheetW:{value:e.crack.len*.05},tNz:{value:t.noise}};n.onBeforeCompile=u=>{Object.assign(u.uniforms,a),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP;
varying vec3 vON;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position;
vON = normal;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
${ud}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.42, smoothstep(0.985, 0.998, dot(normalize(vON), uChipN)));`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${dd}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + clamp(core * uNodeK * 1.5 + halo * uNodeK * 0.12 + lines * uLit * uGlow * 0.4, 0.0, 1.0);`),O0(u)},n.customProgramCacheKey=()=>"ss-stone";const s=new ge,r=new R,i=new R,c=new R,l=(u,f)=>{u.updateMatrixWorld(),s.copy(u.matrixWorld).invert(),i.setFromMatrixPosition(f.matrixWorld),a.uCamO.value.copy(i).applyMatrix4(s),r.copy(a.uNode.value).applyMatrix4(u.matrixWorld);const p=f,m=r.distanceTo(i);c.setFromMatrixScale(u.matrixWorld);const h=2*m*Math.tan(Fa.degToRad((p.fov??30)/2))/Math.max(1,pa.value);a.uPx.value=h/Math.max(1e-6,Math.abs(c.x)),e.face&&a.uKey.value.copy(a.uCtr.value).sub(a.uCamO.value).normalize().reflect(e.face).add(e.tilt??new R).normalize()},d=u=>{let f=0;for(const p of e.crack.segs){const m=Math.min(1,Math.max(0,(u-p.t0)/(p.t1-p.t0)));if(m<=0)continue;const h=p.a.clone().lerp(p.b,m);o[f++].set(p.a.x,p.a.y,h.x,h.y)}a.uSegN.value=f};return d(0),Object.assign(n,{ss:a,aim:l,crack:d})}const mn={ready:!1,fork:new ge,stone:new ge,stoneWorld:new R,escRot:0,stoneGeo:null,side:-1};function Bc(e,t=-1){e.computeBoundingBox();const n=e.boundingBox,o=n.getSize(new R).multiplyScalar(.5),a=n.getCenter(new R),s=o.x*2,r=o.y,i=o.z,c=new R(a.x+s/2-.012,a.y-r*.3,a.z+t*(i-.01)),l=fd(c,new R(-1,-.25,-t*.1),new R(.12,.5,-t*.86),s*.78),d=Hr({L:s,w:i,h:r*2,side:t}).chip.n.clone();return{half:o,centre:a,node:c,crack:l,chipN:d}}function pd(e,t,n){e.computeBoundingBox();const o=e.boundingBox,a=o.getCenter(new R),s=o.getSize(new R).multiplyScalar(.5),r=i=>new R(a.x+s.x,a.y,a.z+i*s.z).applyMatrix4(t).distanceTo(n);return r(1)<r(-1)?1:-1}const Oc=[];function Os(e){Oc.push(e)}function hd(){for(const e of Oc)e()}function md(e,t){e instanceof ca&&e.environment&&t.has(e.environment)&&(e.environment=t.get(e.environment)),e.traverse(n=>{const o=n.material;if(o)for(const a of Array.isArray(o)?o:[o]){const s=a;for(const r of Object.keys(s)){const i=s[r];i instanceof Xr&&t.has(i)&&(s[r]=t.get(i),a.needsUpdate=!0)}if(s.uniforms)for(const r of Object.values(s.uniforms))r&&r.value instanceof Xr&&t.has(r.value)&&(r.value=t.get(r.value))}})}const vd=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,gd=`
uniform sampler2D tSrc;
varying vec2 vUv;
void main() {
  vec4 s4 = texture2D(tSrc, vUv);
  vec3 c = s4.rgb * clamp(s4.a - 1.0, 0.0, 1.0);
  float r = c.r, o = max(c.g, c.b);
  float purity = clamp((r - 3.2 * o) / max(r, 1e-4), 0.0, 1.0);
  float lift = smoothstep(0.05, 0.6, r);
  gl_FragColor = vec4(vec3(r, o * 0.15, o * 0.15) * purity * lift, 1.0);
}`,xd=`
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
}`,wd=`
#include <packing>
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tB1;
uniform sampler2D tB2;
uniform sampler2D tB3;
uniform sampler2D tFade;
uniform float uFade;
uniform float uSweep;
uniform vec4 uFlash;
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
  if (uFlash.z > 0.0) {
    vec2 fq = vUv - uFlash.xy; fq.x *= uAspect; float fd = length(fq);
    float fa = (1.0 - smoothstep(uFlash.z - 0.3, uFlash.z, fd)) * smoothstep(uFlash.w - 0.3, uFlash.w, fd);
    vec3 fc = mix(vec3(0.753, 0.078, 0.122), vec3(1.0, 0.94, 0.92), exp(-fd * fd / 0.03));
    c = mix(c, fc, fa);
  }
  gl_FragColor = vec4(c, 1.0);
}`,yd=`
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
}`,bd=`
uniform sampler2D tSrc;
varying vec2 vUv;
void main() { gl_FragColor = texture2D(tSrc, vUv); }`,nt={on:0,columns:[],floorY:0,red:new R,redSize:new R(1,1,1),redPower:0,ruby:new R,rubyPower:0,bladeGain:1,wake:0,fadeTop:0,fadeLen:0,steps:0,reflSteps:0,bladeFrom:new R,bladeDir:new R(0,-1,0),bladeCos:.98,bladePower:0,nave:new vn,pulseC:new R,pulseR:-1,pulseW:1,pulseG:0,time:0};function Md(e,t){const n=new Gn;n.setAttribute("position",new wt([-1,-1,0,3,-1,0,-1,3,0],3));const o=new Qi(-1,1,1,-1,0,1),a=new ot(n);a.frustumCulled=!1;const s=new ca;s.add(a);const r=(N,V)=>new zn({vertexShader:vd,fragmentShader:N,uniforms:V,depthTest:!1,depthWrite:!1}),i=r(gd,{tSrc:{value:null}}),c=r(xd,{tSrc:{value:null},uDir:{value:new Ft}}),l=r(bd,{tSrc:{value:null}}),d=r(yd,{tDepth:{value:null},tNz:{value:ro().noise},uInvProj:{value:new ge},uCamW:{value:new ge},uCamP:{value:new R},uBA:{value:new R},uBD:{value:new R},uBCos:{value:.98},uBPow:{value:0},uCols:{value:Array.from({length:16},()=>new vn)},uNCol:{value:0},uRC:{value:new R},uRS:{value:new R(1,1,1)},uRP:{value:0},uRuby:{value:new R},uRuP:{value:0},uPC:{value:new R},uPR:{value:-1},uPW:{value:1},uPG:{value:0},uFloor:{value:0},uVFade:{value:new Ft},uT:{value:0},uSteps:{value:t==="low"?18:24},uRSteps:{value:24},uNave:{value:new vn}}),u=new ho(1,1,{type:xo}),f=r(wd,{tVol:{value:u.texture},uVolOn:{value:0},uVTexel:{value:new Ft},tColor:{value:null},tDepth:{value:null},tB1:{value:null},tB2:{value:null},tB3:{value:null},tFade:{value:null},uFade:{value:0},uSweep:{value:-9},uFlash:{value:new vn(0,0,-1,0)},uNear:{value:.01},uFar:{value:100},uFocus:{value:10},uFocusN:{value:10},uFocusF:{value:10},uAperture:{value:6},uMaxBlur:{value:10},uTexel:{value:new Ft},uExposure:{value:1},uNeutral:{value:0},uBloom:{value:1},uGrain:{value:.04},uSeed:{value:0},uVig:{value:.8},uAspect:{value:1},uCover:{value:0},uRim:{value:0},uAO:{value:t==="high"&&!location.search.includes("noao")?1:0},uKAO:{value:Array.from({length:12},(N,V)=>{const K=V*2.39996+.7,j=(V+.5)/12;return new Ft(Math.fround(Math.cos(K)*j),Math.fround(Math.sin(K)*j))})},uKDOF:{value:Array.from({length:16},(N,V)=>{const K=V*2.39996,j=Math.sqrt((V+.5)/16);return new Ft(Math.fround(Math.cos(K)*j),Math.fround(Math.sin(K)*j))})}}),p=(N,V)=>{a.material=N,e.setRenderTarget(V),e.render(s,o)},m=t==="high"&&!location.search.includes("nomsaa")?4:0,h=()=>{const N=new Ji(1,1);return N.type=sl,N},v=new ho(1,1,{type:xo,samples:m,...m?{}:{depthTexture:h()}}),M=m?new ho(1,1,{type:fr,depthTexture:h()}):null,w=new In({colorWrite:!1}),x=[],g=[],y=()=>{},b=new ho(1,1,{type:fr}),z=[0,1,2].map(()=>[0,1].map(()=>new ho(1,1,{type:xo})));let k=1,I=1;function P(N,V){k=N,I=V,v.setSize(N,V),b.setSize(N,V),M?.setSize(N,V),u.setSize(Math.max(1,N>>1),Math.max(1,V>>1)),z.forEach((K,j)=>K.forEach(me=>me.setSize(Math.max(1,N>>j+1),Math.max(1,V>>j+1))))}function C(N,V){}const S=new Float64Array(1),F=new Int32Array(S.buffer);let W=0,A=0;Os(()=>{A++});const B=N=>{S[0]=N,W=Math.imul(W^F[0],16777619)^F[1],W=Math.imul(W,16777619)},oe=N=>{const V=N.elements;for(let K=0;K<16;K++)B(V[K])},ie=[];function U(N){if(!e.shadowMap.enabled)return;N.updateMatrixWorld(),W=2166136261,B(A),ie.length=0,N.traverseVisible(K=>{if(K.isLight){K.castShadow&&K.shadow&&ie.push(K);return}const j=K;if(!K.castShadow||!j.geometry)return;B(j.id),oe(j.matrixWorld),B(j.geometry.id),B(j.geometry.attributes.position?.version??0),B(j.geometry.drawRange.start),B(j.geometry.drawRange.count);for(const xe of Array.isArray(j.material)?j.material:[j.material])xe&&(B(xe.id),B(xe.visible?1:0),B(xe.side),B(xe.alphaTest));const me=K;if(me.isInstancedMesh){B(me.count);const xe=me.instanceMatrix.array;for(let Me=0,q=Math.min(xe.length,me.count*16);Me<q;Me++)B(xe[Me])}});const V=W;for(const K of ie){W=V,oe(K.matrixWorld);const j=K;j.target&&oe(j.target.matrixWorld),B(j.angle??0),B(j.distance??0),B(j.shadow.mapSize.x),B(j.shadow.bias),B(j.shadow.radius);const me=j.shadow;K.intensity<=0||me.autoUpdate===!1&&me.ssKey===void 0||(me.autoUpdate=!1,(me.ssKey!==W||!me.map)&&(me.needsUpdate=!0,me.ssKey=W))}}function O(N,V){if(U(N),e.setRenderTarget(v),e.clear(),e.info.render.calls,e.shadowMap.autoUpdate,e.render(N,V),!M)return;x.length=0,g.length=0,N.traverseVisible(j=>{const me=j.material;me&&!Array.isArray(me)&&(me.transparent||!me.depthWrite)&&x.push(j),j.isReflector&&g.push({o:j,f:j.onBeforeRender})}),x.forEach(j=>{j.visible=!1}),g.forEach(j=>{j.o.onBeforeRender=y}),N.overrideMaterial=w;const K=e.shadowMap.autoUpdate;e.shadowMap.autoUpdate=!1,e.setRenderTarget(M),e.clear(),e.render(N,V),N.overrideMaterial=null,e.shadowMap.autoUpdate=K,x.forEach(j=>{j.visible=!0}),g.forEach(j=>{j.o.onBeforeRender=j.f})}function D(N,V,K){const j=v.texture;i.uniforms.tSrc.value=j,p(i,z[0][0]);let me=z[0][0];for(let Me=0;Me<3;Me++){Me>0&&(l.uniforms.tSrc.value=me.texture,p(l,z[Me][0]));const[q,he]=z[Me],ce=1/q.width,ue=1/q.height;c.uniforms.tSrc.value=q.texture,c.uniforms.uDir.value.set(ce*1.5,0),p(c,he),c.uniforms.tSrc.value=he.texture,c.uniforms.uDir.value.set(0,ue*1.5),p(c,q),me=q}const xe=f.uniforms;if(xe.tColor.value=j,xe.tDepth.value=M?M.depthTexture:v.depthTexture,xe.tB1.value=z[0][0].texture,xe.tB2.value=z[1][0].texture,xe.tB3.value=z[2][0].texture,xe.tFade.value=K===b?z[2][1].texture:b.texture,xe.uFade.value=K===b?0:V.fade,xe.uSweep.value=K===b?-9:V.sweep??-9,xe.uFlash.value.set(...V.flash??[0,0,-1,0]),xe.uNear.value=N.near,xe.uFar.value=N.far,xe.uFocus.value=V.focus,xe.uFocusN.value=V.focusN??V.focus,xe.uFocusF.value=V.focusF??V.focus,xe.uAperture.value=V.aperture*I/1e3,xe.uMaxBlur.value=(t==="low"?6:12)*(V.blurMul??1),xe.uTexel.value.set(1/k,1/I),xe.uExposure.value=V.exposure,xe.uNeutral.value=V.neutral??0,xe.uBloom.value=V.bloom,xe.uGrain.value=V.grain,xe.uSeed.value=V.seed,xe.uVig.value=V.vig,xe.uAspect.value=k/I,xe.uCover.value=V.cover,xe.uRim.value=V.rim??0,xe.uVolOn.value=nt.on,nt.on){const Me=d.uniforms;Me.tDepth.value=xe.tDepth.value,Me.uInvProj.value.copy(N.projectionMatrixInverse),Me.uCamW.value.copy(N.matrixWorld),Me.uCamP.value.setFromMatrixPosition(N.matrixWorld),Me.uBA.value.copy(nt.bladeFrom),Me.uBD.value.copy(nt.bladeDir),Me.uBCos.value=nt.bladeCos,Me.uBPow.value=nt.bladePower*nt.bladeGain;const q=Math.min(16,nt.columns.length);Me.uNCol.value=q;for(let ce=0;ce<q;ce++)Me.uCols.value[ce].set(nt.columns[ce][0],nt.columns[ce][1],nt.columns[ce][2],nt.columns[ce][3]);Me.uRC.value.copy(nt.red),Me.uRS.value.copy(nt.redSize),Me.uRP.value=nt.redPower,Me.uRuby.value.copy(nt.ruby),Me.uRuP.value=nt.rubyPower,Me.uPC.value.copy(nt.pulseC),Me.uPR.value=nt.pulseR,Me.uPW.value=nt.pulseW,Me.uPG.value=nt.pulseG,Me.uFloor.value=nt.floorY,Me.uVFade.value.set(nt.fadeTop,nt.fadeLen),Me.uT.value=nt.time,Me.uNave.value.copy(nt.nave);const he=nt.steps||(t==="low"?18:24);Me.uSteps.value=he,Me.uRSteps.value=nt.reflSteps||he,p(d,u),xe.uVTexel.value.set(1/u.width,1/u.height)}p(f,K)}function E(){const N=new zt;for(const V of[i,c,l,d,f])N.add(new ot(n,V));e.compile(N,o,s)}return{setSize:P,useGtao:C,drawScene:O,finish:D,compile:E,fadeTarget:b,mainTarget:v,scratch:z[0][1],depthPass:!!M,get size(){return[k,I]}}}const Sd=`
{
  float ssNL = dot( geometryNormal, directLight.direction );
  float ssW = saturate( ssNL * 0.6 + 0.4 );
  vec3 ssC = material.diffuseColor;
  #if defined( STANDARD ) || defined( PHONG )
  ssC += material.specularColor * 0.6;
  #endif
  vec3 ssA = directLight.color * ssW * ssW * RECIPROCAL_PI * ssC;
  reflectedLight.directDiffuse += ssA / (1.0 + ssA * 4.0);
}`;{const e=rl,t=e.lights_fragment_begin,n=t.indexOf("getPointLightInfo"),o="RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",a=t.indexOf(o,n);n>0&&a>n&&!t.includes("ssNL")&&(e.lights_fragment_begin=t.slice(0,a)+Sd+t.slice(a+o.length))}const kd=`
varying vec3 vP;
varying vec3 vN;
varying vec3 vW;
void main() {
  vP = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,zd=`
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
}`;function Pd(e,t,n){const o=new ec(15921129,10,0,.2,.55,0);o.castShadow=n!=="low",o.shadow.mapSize.set(n==="high"?2048:1024,n==="high"?2048:1024),o.shadow.bias=-4e-4,o.shadow.normalBias=.02,o.shadow.camera.near=1,o.shadow.camera.far=400,t.add(o,o.target);const a=new il(16711688,20,30,1.6);t.add(a);const s=new cl(2763306,0,.08);t.add(s);const r=new zn({vertexShader:kd,fragmentShader:zd,transparent:!0,depthWrite:!1,blending:tc,side:M0,uniforms:{uGain:{value:.3},uSeed:{value:0},uCam:{value:new R}}}),i=new ll(1,1,32,1,!0);i.translate(0,-.5,0);const c=new ot(i,r);c.frustumCulled=!1,c.renderOrder=5,t.add(c);const l=[],d=[],u=()=>{const h=new nc(e);[0,1,2].forEach(v=>{const M=new ca;M.background=new an(0);const w=(g,y,b,z,k,I,P,C=1)=>{const S=new ot(new h0(g,y),new In({color:new an(b).multiplyScalar(C),side:M0}));S.position.set(z,k,I),S.rotation.y=P,S.lookAt(0,0,0),M.add(S)};w(1.2,9,9079434,-6,2,-3,0,5),w(.6,9,5921370,6,1,2,0,5),w(10,.5,6974058,0,7,0,0,2.5),v<2&&w(.8,7,16711684,4,-2,-6,0,v?.35:.12);const x=h.fromScene(M,.02);d[v]?.dispose(),d[v]=x,l[v]=x.texture}),h.dispose()};u(),Os(u);const f=new R(0,1,0),p=new R;function m(h,v,M,w){const x=1+(v.blade-1)*M,g=1+(v.red-1)*M,y=1+(v.angle-1)*M,b=h.blade.angle*y*(w.angleMul??1);o.position.set(...h.blade.from),o.target.position.set(...h.blade.to),o.target.updateMatrixWorld(),o.angle=b,o.penumbra=h.blade.pen??.55,o.intensity=h.blade.power*.4*x*(w.bladeMul??1),a.position.set(...h.red.at),a.intensity=h.red.power*g*(w.redMul??1),a.distance=h.red.reach*2,t.environment=l[h.env];const z=Math.hypot(h.blade.to[0]-h.blade.from[0],h.blade.to[1]-h.blade.from[1],h.blade.to[2]-h.blade.from[2])*1.15;c.position.set(...h.blade.from),p.set(h.blade.to[0]-h.blade.from[0],h.blade.to[1]-h.blade.from[1],h.blade.to[2]-h.blade.from[2]).normalize(),c.quaternion.setFromUnitVectors(f,p.negate());const k=Math.tan(b)*z;c.scale.set(k,z,k),r.uniforms.uGain.value=h.haze*.18*Math.min(1.5,x*(w.bladeMul??1)),r.uniforms.uSeed.value=w.seed,r.uniforms.uCam.value.copy(w.cam)}return{blade:o,red:a,haze:c,apply:m}}const Ad=.004,Si=1,Rd=.35,Cd=.4,ki=.25;function Td(e){return e.station<0?"none":e.rel>0?"release":e.rare&&e.t>=pn.rare?"rare":e.t<pn.settle?"settle":e.t<pn.pulse?"wait":"loop"}function Fd(){let e=0,t=!1,n=-1,o=0,a=99,s=!0,r=-1,i=-1,c=-1;const l=new Set;return{update(d,u,f,p){const m=Il(u);m!==r&&(r=m,l.delete(m)),Math.abs(f)<Ad&&!p?e+=d:e=0;const h=H0(u),v=h.inHold?h.i:u<fe[0].h0?0:-1;return!t&&e>=Si&&v>=0?(t=!0,n=v,o=0,a=0,s=!l.has(v),i=c<0?-1:Math.max(c,ki)):t&&v!==n&&(t=!1,a=1e-6,e=0),t&&i>=0&&o<pn.pulse?(c>ki&&(i=c),i<=Cd&&(o=i<=d?pn.pulse:o+(pn.pulse-o)*d/i),i=Math.max(0,i-d)):t?(o+=d,s&&o>=pn.rare&&l.add(n)):n>=0&&(a+=v===n?d:d*Math.max(1,fe[n].trick.release/Rd),a>fe[n].trick.release&&(n=-1,a=99)),c=-1,{station:n,t:o,rare:s,rel:t?0:a}},land(d=0){e=Math.max(e,Si),c=d},cut(){t&&i>=0&&(t=!1,a=1e-6,e=0,i=-1)},running(){return t},reset(){e=0,t=!1,n=-1,o=0,a=99,l.clear(),r=-1,i=-1,c=-1}}}const Va=e=>e.station>=0&&e.rel>0?1-ne(e.rel/fe[e.station].trick.release):1;function _d(e,t,n,o){if(e.station!==t)return{on:!1,k:0,t:0,phase:0,rare:-1};const a=Va(e),s=fe[t];if(o)return{on:!0,k:ne(e.t/3)*a,t:e.t,phase:.5,rare:-1};const r=ne((e.t-pn.pulse)/.5),i=e.rare&&s.trick.rare>0&&e.t>=pn.rare;return{on:!0,k:r*a*(n||e.rel>0||t===0?1:.35),t:e.t,phase:El(t,e.t),rare:i?Ge((e.t-pn.rare)/s.trick.rare):-1}}function Ld(e){if(e.station<0||e.rel>0)return-1;const t=(e.t-pn.pulse)/pn.pulseLen;return t>=0&&t<=1?t:-1}function Id(e){const t=n=>cu(new Io(n));return{q:e,metal:t({color:4867905,metalness:.9,roughness:.34,envMapIntensity:1.3}),metalPale:t({color:6973282,metalness:1,roughness:.22,envMapIntensity:1.1}),enamel:t({color:3420719,metalness:0,roughness:.5,envMapIntensity:.5}),blood:t({color:6029832,metalness:.35,roughness:.3,emissive:2752514,envMapIntensity:.7}),ruby:t({color:7995400,metalness:.1,roughness:.08,emissive:12582928,emissiveIntensity:.6}),oil:t({color:131586,metalness:.2,roughness:.06,envMapIntensity:1.4}),glass:t({color:1052688,metalness:0,roughness:.05,transparent:!0,opacity:.16,depthWrite:!1,envMapIntensity:1.5}),stone:t({color:1776153,metalness:0,roughness:.62,envMapIntensity:.4})}}function Ed(e){return ic(e.map(t=>{const n=t.index?t.toNonIndexed():t;return n.deleteAttribute("uv"),n}))}const zi=new ul,Pi=new ge;function br(e,t){Pi.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),zi.setFromProjectionMatrix(Pi);for(const n of t)if(zi.intersectsSphere(n))return!0;return!1}function Dd(e,t=1){const n=[],o=new ge,a=new R,s=new Xt,r=new R;e.updateWorldMatrix(!0,!1);for(let i=0;i<e.count;i++)e.getMatrixAt(i,o),o.premultiply(e.matrixWorld),o.decompose(a,s,r),n.push(new Tr(a.clone(),t*Math.max(r.x,r.y,r.z)*1.15));return n}const Ai=["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"],Bn=Math.PI/180,Nd={v:.48},Wd=Math.atan2(-.8,13),Hd=[-145*Bn,-112*Bn,-82*Bn,Wd,22*Bn,55*Bn,98*Bn,140*Bn],Qs=[10.5,-6.5],Js=[-.42,.02],Bd={at:[12.99,-18.06],r:3.8},Od=.2;Number(new URLSearchParams(typeof location>"u"?"":location.search).get("fexp")??.18);const Ri=.07,Vd={0:{at:[10,8],g:6,tube:!0},1:{at:[13.1,-14.6],g:.2,tube:!0},G:{at:[17,2],g:2,env:.1}},Vc={value:0};function qd(e,t){const n=new In({color:16777215,side:M0});return n.onBeforeCompile=o=>{o.uniforms.uGain=e,o.uniforms.uFront=t,o.uniforms.uThin=Vc,o.uniforms.uPxH=pa,o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
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
gl_FragColor = vec4(0.95 * mix(smoothstep(0.0, 0.12, e), clamp(e * 0.6, 0.0, 1.0), uThin), 0.0, 0.0, 1.0 + clamp(e * 2.0, 0.0, 1.0));`)},n.customProgramCacheKey=()=>"ss-crack-emit",n}function Gd(e){const t=[],n=[],o=[],a=[];e.cracks.forEach((r,i)=>{const c=e.crackLen(i),l=Math.max(8,Math.ceil(c/.2)),d=t.length/3;for(let u=0;u<=l;u++){const f=.25+(c-.5)*u/l,[p,m]=e.crackAt(i,f),[h,v]=e.crackAt(i,f+.05),M=h-p,w=v-m,x=Math.hypot(M,w)||1,g=.075*(1-.4*u/l),y=w0(Math.hypot(p,m))+.012;if(t.push(p-w/x*g,y,m+M/x*g,p+w/x*g,y,m-M/x*g),o.push(-w/x,0,M/x,w/x,0,-M/x),a.push(g,g),u<l){const b=d+u*2;n.push(b,b+1,b+2,b+1,b+3,b+2)}}});const s=new Gn;return s.setAttribute("position",new wt(t,3)),s.setIndex(n),s.setAttribute("aPerp",new wt(o,3)),s.setAttribute("aHw",new wt(a,1)),s}function Ud(e){const t=e.kit.q,n=Ho(t),o=new zt,a=Yu({detail:n,cracks:Hd}),s=Qu({detail:n}),r=K0(a.part,t,{impact:a.impact}),i=a.sectors.map((H,X)=>{const ke=new zt;ke.name=`sector-${X}`;const je=H.centroid.clone();return{pivot:ke,mid:Math.atan2(je.x,-je.z),centroid:je,order:0}}),c=[];r.children.slice().forEach(H=>{const X=/^(enamel|base|ticks)-(\d+)$/.exec(H.name);X?(i[Number(X[2])].pivot.add(H),X[1]==="enamel"&&c.push(H)):o.add(H)});const l=i.map(()=>[]),d=[],u=[];for(let H=0;H<12;H++){const X=gr(Ai[H],{detail:n}).geo.clone().translate(0,Ri,0);H===2&&(X.translate(.9,0,0),X.rotateZ(-.11),X.rotateY(.06),X.translate(-.9,0,0)),X.applyMatrix4(s.at[H]),X.computeBoundingBox();const ke=X.boundingBox.getCenter(new R);if(H<=2?d.push([a.sectorOf(ke.x,ke.z),X]):l[a.sectorOf(ke.x,ke.z)]?.push(X),H<=2){const je=[{tilt:0,yaw:0,roll:0,lift:.02},{tilt:0,yaw:0,roll:65*Bn,lift:.02},{tilt:48,yaw:.12,roll:18*Bn,lift:.06}][H],gt=gr(Ai[H],{detail:n}),At=gt.geo.clone(),$t=At.attributes.position;for(let Ht=0;Ht<$t.count;Ht++)$t.getY(Ht)>.021&&$t.setY(Ht,$t.getY(Ht)*3);At.computeVertexNormals();const St=je.roll,Nt=Oe.numeralH/2,xn=gt.width/2+.17;At.translate(0,0,Nt).rotateX(-je.tilt*Bn).translate(0,0,-Nt).rotateZ(St).translate(0,Ri+je.lift+xn*Math.abs(Math.sin(St)),0).rotateY(je.yaw),u.push(At.applyMatrix4(s.at[H]))}}const f=eo(bn({finish:"grained",seed:299,wear:.22,tier:t,age:.11,direct:.12}),.3);l.forEach((H,X)=>{if(!H.length)return;const ke=new ot(qt(H),f);ke.castShadow=t!=="low",ke.receiveShadow=t!=="low",ke.name=`numerals-${X}`,i[X].pivot.add(ke)});const p=d.map(([H,X])=>{const ke=new ot(X,f);return ke.castShadow=ke.receiveShadow=t!=="low",ke.name="numerals-near",i[H].pivot.add(ke),ke}),m=new ot(qt(u),eo(bn({finish:"grained",seed:297,wear:.08,tier:t,age:.03,direct:1}),.9));m.castShadow=m.receiveShadow=t!=="low",m.name="p1-numerals";for(const H of i)o.add(H.pivot);const h=45*Bn;[...i].sort((H,X)=>(H.mid-h+4*Math.PI)%(2*Math.PI)-(X.mid-h+4*Math.PI)%(2*Math.PI)).forEach((H,X)=>H.order=X);const v=r1({detail:n,second:0,hour:4.9,minute:1.15}),M=K0(v,t,{}),w=new zt;w.name="second",M.children.slice().forEach(H=>{(H.name==="hand-second"||H.name==="hand-collet")&&w.add(H)});for(const H of M.children)(H.name==="hand-hour"||H.name==="hand-minute")&&eo(H.material,Od);o.add(M,w);let x=null;const g=(()=>{const H=w.children.find(Nt=>Nt.name==="hand-second");if(!H)return null;const X=H.geometry.clone(),ke=X.attributes.position;let je=0,gt=0,At=0;for(let Nt=0;Nt<ke.count;Nt++){const xn=ke.getX(Nt),Ht=ke.getZ(Nt),cn=xn*xn+Ht*Ht;cn>At&&(At=cn,je=xn,gt=Ht)}const $t=Math.hypot(je,gt)||1;je/=$t,gt/=$t;for(let Nt=0;Nt<ke.count;Nt++){const xn=ke.getX(Nt),Ht=ke.getZ(Nt),cn=xn*je+Ht*gt,En=xn-cn*je,Xn=Ht-cn*gt,n0=Math.hypot(En,Xn),it=n0>1e-6?(n0*1.75+.035)/n0:1;ke.setXYZ(Nt,cn*je+En*it,ke.getY(Nt)-.03,cn*gt+Xn*it)}X.deleteAttribute("normal");const St=new ot(X,new In({color:0}));return St.name="hand-skirt",St.position.copy(H.position),St.quaternion.copy(H.quaternion),St.scale.copy(H.scale),St.renderOrder=-1,w.add(St),St})(),y=w.children.map(H=>H.material).find(H=>H?.emissive&&H.clearcoat>0),b=w.children.find(H=>H.name==="hand-second"),z={value:0};if(y){const H=y.onBeforeCompile.bind(y),X=y.customProgramCacheKey.bind(y);y.onBeforeCompile=(ke,je)=>{H(ke,je),ke.uniforms.uWhole=z,ke.fragmentShader=ke.fragmentShader.replace("void main() {",`uniform float uWhole;
void main() {`).replace("chip = max(chip, boss);",`chip = mix(chip, 0.0, uWhole);
rim *= 1.0 - uWhole;
hair *= 1.0 - uWhole;
chip = max(chip, boss);`).replace("{ vec3 cT = vec3(0.8, 0.035, 0.03);",`clearcoatSpecularDirect *= 1.0 - 0.9 * uWhole;
reflectedLight.directDiffuse *= 1.0 - 0.5 * uWhole;
{ vec3 cT = vec3(0.8, 0.035, 0.03);`)},y.customProgramCacheKey=()=>X()+"-whole"}const k=Ju({detail:n,impact:Qs,wedge:Js,chip:Bd}),I=K0(k.part,t,{});o.add(I);const P=ut(517),C=Ms(8,(H,X)=>{const ke=X*Math.PI*2,je=3+Math.sqrt(H)*18.5,gt=Math.cos(ke)*je,At=Math.sin(ke)*je,$t=Math.atan2(At-Qs[1],gt-Qs[0]);return $t>Js[0]-.14&&$t<Js[1]+.14||Math.hypot(gt-fe[1].pose.pos[0],At-fe[1].pose.pos[2])<15?null:{p:new R(gt,Fo(je)-.02,At),up:new R(-gt*.004+(P()-.5)*.1,1,-At*.004)}},31,[.3,.55,.9]),S=K0(Z0([],[{geo:bs(n),finish:"drop",seed:77,mats:C.flat(),name:"sky-drops"}]),t,{shadows:!1,sphereOf:()=>ys(1,.7)});S.visible=!1,o.add(S);const F=new zt;F.visible=!1,o.add(F);const W=new In({color:0}),A=eo(bn({finish:"polished",seed:641,wear:.1,tier:t,age:.05,direct:.9}),1.2);{const H=[],X=[];for(let gt=0;gt<60;gt++){const At=gt%5===0,$t=gt/60*Math.PI*2,St=At?Oe.hourIn:Oe.trackIn,Nt=Oe.trackOut,xn=At?.2:.075,Ht=Nt-St,cn=w0((St+Nt)/2),En=new ge().makeRotationY(-$t).multiply(new ge().makeTranslation(0,cn,-(St+Nt)/2));H.push(new go(xn,.012,Ht).applyMatrix4(En));for(const Xn of[-1,1])X.push(new go(.016,.022,Ht+.02).translate(Xn*(xn/2+.008),.004,0).applyMatrix4(En))}const ke=new ot(qt(H),W),je=new ot(qt(X),A);ke.name="p1-grooves",je.name="p1-lips",je.receiveShadow=t!=="low",F.add(ke,je,m)}const B=r.children.filter(H=>/^ticks-/.test(H.name)).concat(...i.map(H=>H.pivot.children.filter(X=>/^ticks-/.test(X.name)))),oe=new ho(t==="low"?512:1024,t==="low"?512:1024,{type:xo,samples:t==="low"?0:4}),ie=new Ar(136,1,.2,120);ie.position.set(...Y0),ie.up.set(0,0,-1),ie.lookAt(Y0[0],0,Y0[2]);const U=.95,O=new wo(_a*1.006,64,24,0,Math.PI*2,0,U),D=new zn({uniforms:{tPic:{value:oe.texture},uGain:{value:4.2},uK:{value:0}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vP; void main() { vP = position.xz / ("+(_a*Math.sin(U)).toFixed(4)+"); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform sampler2D tPic; uniform float uGain; uniform float uK; varying vec2 vP; void main() { float r = length(vP); vec2 uv = 0.5 - vP * 0.5 * (0.82 + 0.18 * r * r); vec3 c = texture2D(tPic, uv).rgb * uGain * (1.0 - 0.55 * r * r) + vec3(0.85) * exp(-(((r - 0.955) / 0.012) * ((r - 0.955) / 0.012))); gl_FragColor = vec4(c, uK * (1.0 - smoothstep(0.78, 1.0, r))); }"}),E=new ot(O,D);E.position.set(...Y0),E.visible=!1,E.renderOrder=2,o.add(E);const N=eo(bn({finish:"grained",seed:611,wear:.06,tier:t,age:0,direct:1}),1.1),V=new Cl(2.1,.5,1.7,2,.1),K=new go(2.5,.62,.35),j=new Fn(V,N,8);j.castShadow=j.receiveShadow=t!=="low",j.frustumCulled=!1;const me=Array.from({length:8},(H,X)=>{const ke=(X+.5)*Math.PI/4;return K.clone().rotateY(-ke).translate(20.55*Math.sin(ke),.3,-20.55*Math.cos(ke))});o.add(j);const xe=Array.from({length:8},(H,X)=>({a:(X+.5)*Math.PI/4})),Me=new ge,q=new Xt,he=new R(1,1,1),ce=new R,ue=new R(0,1,0),Ae=20.05,we=90,De=-.1,Ve=.55,Ke=new ot(qt([new ms(Ae-.3,Ae+.3,192,1).rotateX(-Math.PI/2).translate(0,-.08,0),new ms(Ae-.33,Ae-.29,192,1).rotateX(-Math.PI/2).translate(0,-.02,0),new ms(Ae+.29,Ae+.33,192,1).rotateX(-Math.PI/2).translate(0,-.02,0),...me].map((H,X)=>{const ke=H.attributes.position.count,je=new Float32Array(ke*3).fill(X===1||X===2?.55:0);return H.setAttribute("color",new mo(je,3)),H})),new In({vertexColors:!0}));Ke.visible=!1,o.add(Ke);const Xe=Ke,Ce=new Gn,rt=new Float32Array((we+1)*6),st=new Float32Array((we+1)*8),Te=[];for(let H=0;H<=we;H++){const X=-1.25*(1-H/we);rt.set([Ae*Math.sin(X),De,-Ae*Math.cos(X),Ae*Math.sin(X),Ve,-Ae*Math.cos(X)],H*6),H<we&&Te.push(2*H,2*H+1,2*H+2,2*H+1,2*H+3,2*H+2)}Ce.setAttribute("position",new mo(rt,3)),Ce.setAttribute("color",new mo(st,4)),Ce.setIndex(Te);const Fe=new ot(Ce,new In({vertexColors:!0,transparent:!0,side:M0,depthWrite:!1}));Fe.visible=!1,Fe.frustumCulled=!1;const ae=new zt;ae.add(Fe),o.add(ae);const Y=34,J=new Float32Array(8*Y*3),pe=new Float32Array(8*Y*3),Se=[];{const H=ut(655);for(let X=0;X<8*Y;X++)Se.push(H()-.5,H()*.8,H()-.5,.4+H()*.6)}const Ee=new Gn;Ee.setAttribute("position",new mo(J,3)),Ee.setAttribute("color",new mo(pe,3));const He=new dl(Ee,new fl({size:2.6,vertexColors:!0,transparent:!0,depthWrite:!1,blending:tc,map:(()=>{const H=document.createElement("canvas");H.width=H.height=32;const X=H.getContext("2d"),ke=X.createRadialGradient(16,16,0,16,16,16);return ke.addColorStop(0,"rgba(255,255,255,1)"),ke.addColorStop(1,"rgba(255,255,255,0)"),X.fillStyle=ke,X.fillRect(0,0,32,32),new Zr(H)})()}));He.visible=!1,He.frustumCulled=!1,o.add(He);const ct=new ot(new ia(Oe.caseIn*1.6,64),new In({colorWrite:!1,depthWrite:!1,side:M0}));ct.rotation.x=-Math.PI/2,ct.position.y=-.45,ct.castShadow=!0,ct.visible=!1,o.add(ct);const mt=74*Math.PI/180,ht=new zt;ht.visible=!1,ht.rotation.y=mt,o.add(ht);const xt=eo(bn({finish:"grained",seed:621,wear:.3,tier:t,age:.2,direct:.7}),.08);{const H=new ot(qt([[9,-3.2,-2,4.2,48],[15,-3.8,3,2.8,36],[6,-4.4,7,5.5,64],[13,-2.9,-7.5,2.2,30]].map(([X,ke,je,gt,At],$t)=>so({teeth:At,r:gt,profile:"train",spokes:5,rim:.08,hub:.14,hole:.3,detail:n,seed:620+$t}).rotateY($t*1.3).translate(X,ke,je))),xt);H.castShadow=H.receiveShadow=t!=="low",ht.add(H)}[[11.5,-2.1,1,.5],[9.6,-1.9,-8.2,-.6]].forEach(([H,X,ke,je],gt)=>{const At=Uu(Nr({length:11,width:2.4,t:.6,detail:n,seed:630+gt}),t);At.position.set(H,X,ke),At.rotation.y=je,ht.add(At)});{const H=new ot(Br({detail:n,rOut:2.4,t:.05}).geo,xt);H.position.set(16,-2.6,-3),ht.add(H)}const yt=new R(10*Math.sin(50*Bn),-3,-10*Math.cos(50*Bn)),$={value:0},L=new In({color:16777215});L.onBeforeCompile=H=>{H.uniforms.uK=$,H.fragmentShader=H.fragmentShader.replace("#include <common>",`#include <common>
uniform float uK;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor = vec4(0.95 * uK, 0.0, 0.0, 1.0 + uK);`)},L.customProgramCacheKey=()=>"ss-gate-ruby";const Q=new ot(new Rs(.26,2),L);Q.position.copy(yt).applyAxisAngle(new R(0,1,0),-mt),ht.add(Q);let ee=null;const be=(H,X,ke=0)=>{ct.visible=X&&H>.2&&t!=="low",j.visible=Xe.visible=X;const je=205*Bn,gt=Ge((H-.12)/.19),At=je+gt*Math.PI*2;let $t=!1;if(xe.forEach(({a:St},Nt)=>{const xn=.12+.19*(((St-je)%(2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)+.004,Ht=Ge((H-xn)/.006),cn=Ht>=1?1:1+2.2*(Ht-1)**3+1.2*(Ht-1)**2,En=Ge(cn,0,1.08)*(Nt===2?1-.55*ke:1),Xn=19+1.6*En,n0=(H-xn)/.03,it=n0>0&&n0<1,_t=pe[Nt*Y*3]>0;if(it||_t)for(let Bt=0;Bt<Y;Bt++){const Kt=(Nt*Y+Bt)*3,Cn=(Nt*Y+Bt)*4,Zn=Math.sqrt(Math.max(n0,0))*1.5*Se[Cn+3],V0=it?.014*(1-n0)*Se[Cn+3]+1e-4:0;J[Kt]=20.5*Math.sin(St)+Se[Cn]*Zn*2,J[Kt+1]=.45+Se[Cn+1]*Zn,J[Kt+2]=-20.5*Math.cos(St)+Se[Cn+2]*Zn*2,pe[Kt]=pe[Kt+1]=pe[Kt+2]=V0}it&&($t=!0),j.setMatrixAt(Nt,Me.compose(ce.set(Xn*Math.sin(St),.32-.1*En,-Xn*Math.cos(St)),q.setFromAxisAngle(ue,-St),he))}),j.instanceMatrix.needsUpdate=!0,He.visible=$t&&X,$t&&(Ee.attributes.position.needsUpdate=Ee.attributes.color.needsUpdate=!0),Fe.visible=X&&gt>0&&gt<1,Fe.visible){ae.rotation.y=-At;const St=H*55%1;for(let Nt=0;Nt<=we;Nt++){const xn=Nt/we,Ht=Math.exp(-(((xn-St)/.035)**2))*.8+Math.exp(-(((xn-.985)/.02)**2))*.6,cn=Math.min(1,(xn/.55)**1.6)*(xn>.995?0:1);st.set([.5+Ht,.5+Ht,.52+Ht,Math.min(1,cn+Ht*.5),.3+Ht*.5,.3+Ht*.5,.32+Ht*.5,Math.min(1,cn+Ht*.3)],Nt*8)}Ce.attributes.color.needsUpdate=!0}},Le=H=>{if(E.visible=H>0,D.uniforms.uK.value=H,!(H>0))return;const X=e.renderer.getRenderTarget(),ke=I.visible;E.visible=!1,I.visible=!1;const je=e.renderer.shadowMap.autoUpdate;e.renderer.shadowMap.autoUpdate=!1,e.renderer.setRenderTarget(oe),e.renderer.render(e.scene,ie),e.renderer.setRenderTarget(X),e.renderer.shadowMap.autoUpdate=je,E.visible=!0,I.visible=ke},Re={value:0},ve={value:new R(...ba(1.5/12*Math.PI*2,12),0)};ve.value.set(ba(1.5/12*Math.PI*2,12)[0],ba(1.5/12*Math.PI*2,12)[1],0);const _e=new ot(Gd(a),qd(Re,ve));_e.frustumCulled=!1,o.add(_e);const Ue=new R;{let H=1e9;a.cracks.forEach((X,ke)=>{const je=a.crackLen(ke);for(let gt=.3;gt<je;gt+=.3){const[At,$t]=a.crackAt(ke,gt),St=Math.hypot(At-11.4,$t+12.4);St<H&&(H=St,Ue.set(At,.8,$t))}})}const Ne=new R,Qe=new In({color:0});Qe.onBeforeCompile=H=>{H.uniforms.uGain=Re,H.uniforms.uFront=ve,H.vertexShader=H.vertexShader.replace("#include <common>",`#include <common>
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
gl_FragColor = vec4(0.3 * wl * (0.45 + 0.55 * smoothstep(0.2, 0.8, 0.5 + 0.5 * sin(dot(vWp.xz, vec2(9.0, 6.0)) + 3.0 * sin(dot(vWp.xz, vec2(2.3, -3.1)))))), 0.0, 0.0, 1.0);`)},Qe.customProgramCacheKey=()=>"ss-p1-canyon";const _=new zt;_.visible=!1,o.add(_);{const H=fe[1].pose.pos,X=ut(733),ke=[],je=new Ft(fe[1].pose.look[0]-H[0],fe[1].pose.look[2]-H[2]).normalize(),gt=new Ft(-je.y,je.x),At=[[-3.6,2.75],[-1.8,2.35],[0,2.15],[1.6,2.2],[2.8,2.7],[3.8,3.8]];for(let Zt=0,Qn=150;Zt<=Qn;Zt++){const $n=Zt/Qn*(At.length-1),wn=Math.min(At.length-2,Math.floor($n)),Jn=ne($n-wn),o0=At[wn][0]+(At[wn+1][0]-At[wn][0])*Jn,Et=At[wn][1]+(At[wn+1][1]-At[wn][1])*Jn,ln=(X()-.5)*.025+.02*Math.sin(Zt*.9);ke.push([H[0]+je.x*(Et+ln)+gt.x*o0,H[2]+je.y*(Et+ln)+gt.y*o0])}const $t=[],St=[ke[Math.round(ke.length*.86)],[6.9,-12.9],[7.3,-10.3],[8.49,-8.49],[10.3,-6.9],[12.2,-5.3]];for(let Zt=0,Qn=160;Zt<=Qn;Zt++){const $n=Zt/Qn*(St.length-1),wn=Math.min(St.length-2,Math.floor($n)),Jn=$n-wn,o0=St[wn][0]+(St[wn+1][0]-St[wn][0])*Jn,Et=St[wn][1]+(St[wn+1][1]-St[wn][1])*Jn,ln=(X()-.5)*.03+.025*Math.sin(Zt*1.3)+.04*Math.sin(Zt*.21);$t.push([o0+ln,Et-ln*.6])}const Nt=[],xn=[],Ht=[],cn=[],En=[],Xn=[],n0=[],it=[],_t=[],Bt=[],Kt=(Zt,Qn,$n,wn,Jn)=>Zt.push(...Qn,...wn,...$n,...$n,...wn,...Jn);for(const[Zt,Qn]of[[ke,1],[$t,.75]]){const $n=Zt.length,wn=Zt.map((Et,ln)=>{const[Dn,e0]=Zt[Math.max(0,ln-2)],[l0,v0]=Zt[Math.min($n-1,ln+2)],q0=Math.hypot(l0-Dn,v0-e0)||1;let u0=-(v0-e0)/q0,C0=(l0-Dn)/q0;return u0*(H[0]-Zt[ln][0])+C0*(H[2]-Zt[ln][1])>0&&(u0=-u0,C0=-C0),[u0,C0]}),Jn=Zt.map((Et,ln)=>{const Dn=ln/($n-1),e0=Math.sin(Math.min(1,Dn*1.15)*Math.PI)**.5;return[Qn*(.04+.1*e0)*(.7+.6*(.5+.5*Math.sin(Dn*37+2*Math.sin(Dn*11)))),(.01+.028*e0)*(.6+.8*(.5+.5*Math.sin(Dn*29+1.3+2*Math.sin(Dn*7)))),e0]}),o0=(Et,ln,Dn)=>{const[e0,l0]=Zt[Et],[v0,q0]=wn[Et];return[e0+v0*ln,w0(Math.hypot(e0,l0))+Dn,l0+q0*ln]};for(let Et=0;Et<$n-1;Et++){const[ln,Dn,e0]=Jn[Et],[l0,v0]=Jn[Et+1];Kt(Ht,o0(Et,-ln*.55,.004),o0(Et,ln*.45,.004),o0(Et+1,-l0*.55,.004),o0(Et+1,l0*.45,.004)),Nt.push(-1,-1,1,1,-1,1),Kt(cn,o0(Et,ln*.45,.005),o0(Et,ln*.45+Dn,.005),o0(Et+1,l0*.45,.005),o0(Et+1,l0*.45+v0,.005));{const a0=.55+.45*Math.sin(Et*1.7+Math.sin(Et*.37)*3)**2,s0=.55+.45*Math.sin((Et+1)*1.7+Math.sin((Et+1)*.37)*3)**2,jn=.12;xn.push(jn*a0,jn*a0,jn*a0,jn*s0,jn*s0,jn*s0,a0,a0,a0,a0,a0,a0,jn*s0,jn*s0,jn*s0,s0,s0,s0)}const[q0,u0]=wn[Et],[C0,Bo]=Zt[Et],[$r,jr]=Zt[Et+1],Ka=$r-C0,Ya=jr-Bo,Oo=Math.hypot(Ka,Ya)||1,ma=w0(Math.hypot(C0,Bo));if(X()<.1*e0){const a0=.015+.03*X(),s0=X()<.5,jn=s0?ln*.45+Dn:-ln*.55,So=s0?1:-1;En.push(...o0(Et,jn,.006),...o0(Et+1,jn,.006),(C0+$r)/2+q0*(jn+So*a0),ma+.006,(Bo+jr)/2+u0*(jn+So*a0))}if(X()<.12*e0){const a0=X()<.5?1:-1,s0=.25+.6*X(),jn=(X()-.5)*1.2,So=.006,Kr=C0+(q0*a0+Ka/Oo*jn)*s0,Yr=Bo+(u0*a0+Ya/Oo*jn)*s0;Kt(Xn,[C0-Ka/Oo*So,ma+.005,Bo-Ya/Oo*So],[C0+Ka/Oo*So,ma+.005,Bo+Ya/Oo*So],[Kr,ma+.005,Yr],[Kr+1e-4,ma+.005,Yr])}}for(let Et=0;Et<$n;Et++){const[ln,Dn]=wn[Et],e0=Zt[Et][0]-ln*Jn[Et][0]*.33,l0=Zt[Et][1]-Dn*Jn[Et][0]*.33,v0=Jn[Et][0]*.2,q0=w0(Math.hypot(e0,l0))+.007,u0=n0.length/3;n0.push(e0-ln*v0,q0,l0-Dn*v0,e0+ln*v0,q0,l0+Dn*v0),it.push(-ln,0,-Dn,ln,0,Dn),_t.push(v0,v0),Et<$n-1&&Bt.push(u0,u0+1,u0+2,u0+1,u0+3,u0+2)}}const Cn=Zt=>{const Qn=new Gn;return Qn.setAttribute("position",new wt(Zt,3)),Qn.computeVertexNormals(),Qn},Zn=Cn(Ht.concat(En,Xn));Zn.setAttribute("aU",new wt(Nt.concat(new Array((En.length+Xn.length)/3).fill(9)),1));const V0=new ot(Zn,Qe);V0.name="p1-canyon-depth";const $a=Cn(cn);$a.setAttribute("color",new wt(xn,3));const ja=new ot($a,new pl({color:1052688,vertexColors:!0,side:M0}));ja.name="p1-canyon-wall",F.add(V0,ja);const Mo=new Gn;Mo.setAttribute("position",new wt(n0,3)),Mo.setIndex(Bt),Mo.setAttribute("aPerp",new wt(it,3)),Mo.setAttribute("aHw",new wt(_t,1)),_.userData.geo=Mo;{const Zt=ba(W0,19.9);let Qn=1e9;for(const[$n,wn]of ke){const Jn=Math.hypot($n-Zt[0],wn-Zt[1]);Jn<Qn&&(Qn=Jn,Ne.set($n,.12,wn))}}}{const H=new ot(_.userData.geo,_e.material);H.frustumCulled=!1,_.add(H)}const te=da("dial-xii",c.map(H=>H.material),{at:[0,w0(10.2),-10.2],right:[1,0,0],up:[0,0,-1],width:8,depth:.3},e.lang);let Z=!1;wr(te.ready.then(H=>Z=H));const qe={value:.3},Be={value:new R},ze={value:new R},We={value:0},T={value:0},le={value:.7};for(const H of c)Object.assign(H.material.ss,{uStrN:Be,uStrL:ze,uStrG:We,uStrRef:T,uStrC:le,uEnv:qe});const re=new R,se=new R,ye=new R,Pe=new ec(15921129,0,0,.14,.1,0);{const H=document.createElement("canvas");H.width=H.height=256;const X=H.getContext("2d"),ke=ut(919);X.fillStyle="#000",X.fillRect(0,0,256,256),X.save(),X.translate(128,128),X.rotate(-.5);const je=X.createLinearGradient(-128,0,128,0);je.addColorStop(0,"rgba(255,255,255,0)"),je.addColorStop(.3,"#fff"),je.addColorStop(.75,"#fff"),je.addColorStop(1,"rgba(255,255,255,0)"),X.fillStyle=je,X.fillRect(-128,-17,256,34),X.restore(),X.strokeStyle="#000",X.lineCap="round";for(let gt=0;gt<7;gt++){let At=128+(ke()-.5)*60,$t=128+(ke()-.5)*60,St=ke()*6.28;X.lineWidth=1.5+ke()*3,X.beginPath(),X.moveTo(At,$t);for(let Nt=0;Nt<14;Nt++)St+=(ke()-.5)*.9,At+=Math.cos(St)*14,$t+=Math.sin(St)*14,X.lineTo(At,$t);X.stroke()}Pe.map=new Zr(H),Pe.castShadow=t!=="low",Pe.shadow.mapSize.set(512,512),Pe.shadow.camera.near=.5,Pe.shadow.camera.far=20}o.add(Pe,Pe.target);const Je=new Wa,et=new Ft,Ct=new Ga(new R(0,1,0),0),pt=new R,vt=eo(bn({finish:"grained",seed:640,wear:.05,tier:t,age:0,direct:1}),.9),bt=Array.from({length:24},(H,X)=>{const ke=X/23,je=ke*Math.PI*5;return new R(Math.cos(je)*(.28-.12*ke),ke*.5-.25,Math.sin(je)*(.28-.12*ke))}),It=[qt([new ta(.24,.24,.1,18).translate(0,.05,0),new ta(.085,.085,.5,8).translate(0,-.25,0)]),new hl(.5,.07,8,36),new go(1.4,.08,.17),new oc(new No(bt),48,.028,5)],Qt=[10,7,8,6],tn=It.map((H,X)=>{const ke=new Fn(H,vt,Qt[X]);return ke.name=`gate-debris-${X}`,ke.frustumCulled=!1,ke.castShadow=t!=="low",ke.visible=!1,o.add(ke),ke}),dn=ut(733),Yn=new R(4.2,-1.4,-4.6),dt=new R(-15,13,27).clone().sub(Yn),sn=new R().crossVectors(dt,new R(0,1,0)).normalize(),gn=new R().crossVectors(sn,dt).normalize(),nn=[];Qt.forEach((H,X)=>{for(let ke=0;ke<H;ke++)nn.push({k:X,j:ke,u:.06+.66*dn()**1.3,s:dn()*2-1,v:dn()*2-1,ax:new R(dn()-.5,dn()-.5,dn()-.5).normalize(),rot:2+dn()*5,sc:.8+dn()*.5})});const Un=nn.find(H=>H.k===1),bo=nn.find(H=>H.k===2);Object.assign(Un,{u:.86,s:-1,v:-.55,sc:2.6}),Object.assign(bo,{u:.9,s:.9,v:.5,sc:2.4});const G=new ge,de=new Xt,Ie=new R,$e=new R,Ye=H=>{for(const X of tn)X.visible=H>0;if(!(H<=0)){for(const X of nn){const ke=X.u*(.35+.65*H),je=.25+2.6*ke;Ie.copy(Yn).addScaledVector(dt,ke).addScaledVector(sn,X.s*je).addScaledVector(gn,X.v*je*.5),de.setFromAxisAngle(X.ax,X.rot*ke+X.j),tn[X.k].setMatrixAt(X.j,G.compose(Ie,de,$e.setScalar(X.sc*Math.min(1,H*3))))}for(const X of tn)X.instanceMatrix.needsUpdate=!0}},lt=128,tt=(()=>{const H=new Uint8Array(lt*lt*4),X=Oe.dialR;for(let je=0;je<lt;je++)for(let gt=0;gt<lt;gt++){const At=((gt+.5)/lt*2-1)*X,$t=((je+.5)/lt*2-1)*X,St=Math.hypot(At,$t)<X?a.sectorOf(At,$t):-1;H[(je*lt+gt)*4]=St>=0&&St<8?St*16+8:255}const ke=new Es(H,lt,lt);return ke.magFilter=ke.minFilter=ml,ke.needsUpdate=!0,ke})(),hn=new Array(8).fill(0),Gt=new R(-8,0,-3.5),Ut=new R(.81,-.51,-.28).normalize(),Pt=68,Vt=3.6,ft=new zn({uniforms:{uA:{value:Gt.clone().addScaledVector(Ut,-60)},uD:{value:Ut},uTan:{value:Vt/60},uLen:{value:Pt},uGain:{value:0},tSec:{value:tt},uSt:{value:hn},uR:{value:Oe.dialR},tNz:{value:ro().noise}},vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
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
}`,transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt}),rn=new ta(.01,Vt/60*Pt*1.05,Pt,32,1,!0).translate(0,-Pt/2,0),Yt=new ot(rn,ft);Yt.name="gate-shaft",Yt.frustumCulled=!1,Yt.visible=!1,Yt.renderOrder=6,Yt.position.copy(Gt).addScaledVector(Ut,-60),Yt.quaternion.setFromUnitVectors(new R(0,-1,0),Ut),o.add(Yt);const Tt=fe.findIndex(H=>H.id==="G"),Pn=new an,Hn=new an;let An=null;const R0=new R,S0=Nc([o]);return{group:o,hand:w,sectors:i,emit:Re,setHandAngle(H){An=H},update(H){const X=H.i,ke=X===1||X===2&&!H.inHold&&H.u<Nd.v;{const it=fe[X].light.blade;re.set(it.from[0]-it.to[0],it.from[1]-it.to[1],it.from[2]-it.to[2]).normalize();const _t=Vd[fe[X].id],Bt=fe[X].pose.pos,Kt=_t?.at??[0,0],Cn=Math.hypot(Bt[0]-Kt[0],Bt[1],Bt[2]-Kt[1])||1;se.set(-(Bt[0]-Kt[0])/Cn,Bt[1]/Cn,-(Bt[2]-Kt[1])/Cn),_t?.tube?(ye.set(-(Bt[2]-Kt[1]),0,Bt[0]-Kt[0]).normalize(),ye.dot(re)<0&&ye.negate(),ze.value.copy(ye),Be.value.crossVectors(ye,se).normalize(),le.value=_t.c??-.1):(ze.value.copy(re),Be.value.crossVectors(re,se).normalize(),le.value=.7);const Zn=H.trick(fe[X].id);qe.value=_t?.env??.3,We.value=(_t?.g??0)*(1+(fe[X].stop.blade-1)*Zn.k)**3}let je=X===Tt?Ge((H.local("G")-.5)/.5):X>Tt&&X<9?1:0;const gt=H.trick("G"),At=gt.on?ne(Ge((gt.t-pn.pulse)/7))*gt.k:0;if(je>.25&&(je=.25+(je-.25)*(1-.55*At)),gt.on&&!H.state.reduced){const it=ne(Ge((gt.t-1.4)/1.1))*Va(H.state.stop)*(X===Tt&&H.inHold||H.state.stop.rel>0?1:.35);je=Math.max(je,.25+it*(.13+.03*Math.sin(gt.t*2.1)))}else gt.on&&(je=Math.max(je,.25+.1*gt.k));for(const it of i){const _t=ne(Ge((je-.25)/.75*3.3-it.order*.3));hn[i.indexOf(it)]=_t;const Bt=X===Tt?1+5*Math.min(1,_t*5):1;for(const Kt of it.pivot.children)/^(enamel|base)-/.test(Kt.name)&&(Kt.scale.y=Bt,Kt.position.y=.1*(1-Bt));if(it.pivot.position.set(0,0,0),it.pivot.rotation.set(0,0,0),_t>0){const Kt=it.centroid,Cn=Math.hypot(Kt.x,Kt.z)||1,Zn=new R(-Kt.z/Cn,0,Kt.x/Cn);R0.set(Kt.x/Cn,0,Kt.z/Cn),it.pivot.position.copy(Kt).multiplyScalar(-1),it.pivot.position.set(0,0,0),it.pivot.rotateOnWorldAxis(R0,-.85*_t),it.pivot.rotateOnWorldAxis(new R(0,1,0),.18*_t),it.pivot.position.copy(Zn.multiplyScalar(5.5*_t*_t)).add(new R(0,-.6*_t-7*_t**4,0))}it.pivot.visible=_t<.999}const $t=X===Tt&&(H.inHold||H.u>.3);Ac.value=ke?1:$t?2:0;for(const[it,_t]of S0)it.uAge.value=$t?0:_t;{const it=X===1&&!H.inHold?4*ne(Ge((H.u-.32)/.12))*(1-ne(Ge((H.u-.55)/.3))):ke?0:X===2&&!H.inHold?ne(Ge((H.u-.45)/.45)):1;xr.value=.12+.88*it,Fc.value=1-Math.min(1,it)}I.visible=X<Tt||X===Tt&&H.local("G")<.3||X>=9,S.visible=ke&&I.visible,Ye(X===Tt?ne(Ge((je-.55)/.45)):0),Yt.visible=X===Tt&&je>.26,ft.uniforms.uGain.value=1*ne(Ge((je-.26)/.2)),F.visible=ke;for(const it of B)it.visible=!ke;for(const it of p)it.visible=!ke;f.ss.uRS2.value.y=ke?.04:.12,be(je,X===Tt||X===Tt-1,At),Ke.material.color.setScalar(X===Tt?1:0),z.value=ke||X===Tt?1:0;const St=X===2&&!H.inHold?ne(Ge((H.u-.25)/.4)):1;if(X===2&&!H.inHold&&(z.value=1-St,f.ss.uRS2.value.y=.04+.08*St),y&&y.emissive.setRGB(X===0?.07:ke?.006:X===Tt?0:.0045,0,0),y){x??=[y.clearcoatRoughness,y.roughness,y.envMapIntensity];const it=X===0?1:X===1?1-ne(Ge((H.local("1")-.4)/.15)):0;y.clearcoatRoughness=x[0]+(.55-x[0])*it,y.roughness=x[1]+(.6-x[1])*it,y.envMapIntensity=x[2]+(.3-x[2])*it,ke&&y.emissive.setRGB(.006+.07*it,0,0),X===2&&!H.inHold&&y.emissive.setRGB(.006+(.0045-.006)*St,0,0),g&&(g.visible=X<=1||ke),b&&(b.scale.y=(b.userData.sy??=b.scale.y)*(ke?1+3*it:1))}ht.visible=X===Tt&&je>.2;{const it=e.kit,_t=X===Tt?H.inHold?1:ne(Ge(H.u/.6)):0,Bt=(Kt,Cn)=>Pn.setHex(Kt).lerp(Hn.setHex(Cn),_t);it.metal.color.copy(Bt(4867905,2368548)),it.metalPale.color.copy(Bt(6973282,3815994)),it.enamel.color.copy(Bt(3420719,2105376)),it.metal.envMapIntensity=1.3+(.25-1.3)*_t,it.metalPale.envMapIntensity=1.1+(.25-1.1)*_t}if(ee||(ee={},e.scene.traverse(it=>{const _t=it;_t.isLight&&_t!==Pe&&_t.isSpotLight&&(ee.blade=_t),_t.isLight&&_t.isPointLight&&_t.color.r>.9&&_t.color.g<.1&&(ee.red=_t)})),T.value=(ee.blade?.intensity??0)*.4,X===Tt){ee||(ee={},e.scene.traverse(_t=>{const Bt=_t;Bt.isLight&&Bt!==Pe&&Bt.isSpotLight&&(ee.blade=Bt),Bt.isLight&&Bt.isPointLight&&Bt.color.r>.9&&Bt.color.g<.1&&(ee.red=Bt)})),ee.blade&&t==="low"&&(ee.blade.intensity*=1-.75*ne(Ge((je-.2)/.15)));const it=!H.inHold&&H.u<.35;ee.red&&it&&(ee.red.intensity*=1-ne(H.u/.35)),ee.red&&!it&&(ee.red.intensity*=ne(Ge((je-.25)/.3))*(1+3*At),ee.red.position.copy(yt).add(new R(0,-.4,0)),ee.red.distance=3.5),$.value=ne(Ge((je-.25)/.3))}Le(X===Tt?ne(Ge((H.local("G")-.08)/.12))*(1-ne(Ge((H.local("G")-.27)/.03))):0);const Nt=.1,xn=H.trick("0"),Ht=H.trick("1"),cn=Ht.on&&!H.state.reduced?{...Ht,t:Ht.t+Nt,k:ne((Ht.t+Nt-pn.pulse)/.5)*Va(H.state.stop)*(H.inHold||H.state.stop.rel>0?1:.35)}:Ht,En=xn.on?xn:cn;if(X<=1&&(c0.gain.value=0),_e.visible=X<=1&&En.k>0,_.visible=X===1&&_e.visible,_e.visible){const it=Ge((En.t-pn.pulse+.1)/1.4);ve.value.z=it*40,Re.value=En.k*(X===1?.9:.6)*(.75+.25*Math.sin(En.phase*Math.PI*2*(X===1?1:2)))}else Re.value=0;Vr.value=Re.value,Vc.value=ke?1:0,Cc.value=X===1&&_e.visible?.3+7.5*ne(Ge((En.t-pn.pulse+.1)/1.6))*ne(Ge(En.k)):0,xr.value*=1-.85*Ge(Re.value*3),X===1&&ee.red&&(ee.red.position.copy(Ne),ee.red.intensity=0,ee.red.distance=10);let Xn=W0-.6*Bn;if(cn.k>0){const it=fe[1].trick.loop,_t=cn.phase*it,Bt=[0,.9,2.6,3.2,6],Kt=Bt.findIndex((Mo,Zt)=>_t>=Mo&&_t<(Bt[Zt+1]??99)),Cn=Bt[Math.max(0,Kt)],Zn=_t-Cn,V0=[.9,1.7,.6,2.8][Math.max(0,Kt)]??1,$a=ne(Zn/(V0*.7))*(Zn<V0*.78?1:0),ja=Zn>=V0*.78?Math.exp(-(Zn-V0*.78)*18)*Math.cos((Zn-V0*.78)*70)*.25:0;Xn+=($a+ja)*Bn*cn.k+Math.sin(H.state.time*90)*.0012*cn.k}else Xn+=Math.sin(H.state.time*70)*6e-4;X===9&&H.inHold&&(Xn=W0-.6*Bn+(H.state.reduced?0:H.state.time)*Math.PI*2/60),w.rotation.order="YXZ",w.rotation.y=-(An??Xn),w.rotation.x=X===1?-2.05*Bn:0;const n0=X===1?cn.k:0;if(Pe.intensity=0,n0>0){et.set(H.state.pointer.x*2-1,1-H.state.pointer.y*2),Je.setFromCamera(et,H.camera),(!Je.ray.intersectPlane(Ct,pt)||pt.distanceTo(Je.ray.origin)>2.4)&&(Je.ray.at(2.4,pt),pt.y=Math.max(0,pt.y-.3)),pt.length()>Oe.dialR-.5&&pt.setLength(Oe.dialR-.5);const it=ba(W0,19.9);pt.lerp(new R(it[0],0,it[1]),1),Pe.target.position.copy(pt),Pe.position.set(pt.x-3.5,6,pt.z-1.5),Pe.intensity=260*ne(Ge((cn.t-pn.settle)/.6))*n0}Pe.shadow.autoUpdate=Pe.intensity>0,Z&&(te.uniforms.uWOn.value=X===1&&cn.rare>=0?ne(cn.rare/.2)*(1-ne((cn.rare-.8)/.2)):0)}}}const po=24,er=7,$d=60/fe.find(e=>e.id==="2").light.blade.power,jd=.3,U0=2.7,Ci=`
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
}`,Ti=`
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
uniform float uArr;
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
  return ${W0.toFixed(6)} + tick * 0.10472;
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
    vec2 uv = vec2(q.x / ${(2*po).toFixed(1)} + 0.5, -q.y / ${(2*po).toFixed(1)} + 0.5);
    float inside = step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
    float inA = mix(inside, 1.0, uArr);
    col = texture2D(tPic, inside > 0.5 ? uv : 1.0 - abs(mod(uv, 2.0) - 1.0)).rgb * inA;
    hit = inA;
    float px = max(fwidth(q.x) + fwidth(q.y), 0.015) * 0.7;
    float a = handAngle(vPh);
    if (uSmall > 0.5) {
      float lag = vPh * smoothstep(0.35, 0.75, uRareT) * 1.7;
      a = ${W0.toFixed(6)} + floor(clamp(uRareT * 9.0 - lag, 0.0, 6.0) + 0.0) * 0.10472 * step(0.02, uRare);
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
  col *= ${U0.toFixed(2)};
  float rim = smoothstep(0.42, 0.06, cs);
  col *= (1.0 - 0.96 * rim) * (1.0 - tir);
  col += vec3(0.004 * ${U0.toFixed(2)}) * uDark;
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
  col += vec3(0.95, 0.93, 0.9) * exp(-((cd / (vR * 0.012)) * (cd / (vR * 0.012)))) * uCaus * (1.0 - uArr) * smoothstep(0.2, 0.5, cs);
  if (uArr > 0.0) {
    vec3 Hh = normalize(uL - Vd);
    vec3 t0 = cross(uL, vec3(0.0, 1.0, 0.0));
    vec3 t1 = normalize(t0 - Hh * dot(t0, Hh) + vec3(1e-4, 0.0, 0.0));
    vec3 t2 = cross(Hh, t1);
    vec2 wq = vec2(dot(N, t1) - 0.03, dot(N, t2) + 0.02);
    float wsd = length(max(abs(wq) - vec2(0.07, 0.035), 0.0)) - 0.035;
    float win = (1.0 - smoothstep(-0.025, 0.035, wsd)) * step(0.0, dot(N, Hh));
    float cres = (1.0 - smoothstep(0.06, 0.5, cs)) * smoothstep(-0.2, 0.8, dot(N, uL));
    col += vec3(0.95, 0.94, 0.92) * uArr * uRim * (1.3 * cres + 0.8 * win);
  }
  col = mix(col, under, keepH);
  gl_FragColor = vec4(col, 1.0);
}`;function Kd(e,t){const{kit:n,renderer:o,scene:a}=e,s=n.q,r=new zt,i=s==="low"?512:1024,c=new ho(i,i,{type:xo,samples:s==="low"?0:4}),l=new Qi(-po,po,po,-po,.1,40);l.position.set(0,6,0),l.up.set(0,0,-1),l.lookAt(0,0,0),l.updateMatrixWorld(),l.layers.set(er);let d=!1;const u=()=>{if(d)return;d=!0;const ce=/^(hand-hour|hand-minute|hand-pipes|enamel-|base-|ticks-|numerals-)/;t.group.traverse(ue=>{let Ae="",we=ue;for(;we&&we!==t.group&&!Ae;)Ae=we.name,we=we.parent;let De=!1;for(we=ue;we;)we===t.hand&&(De=!0),we=we.parent;ce.test(Ae)&&!De&&ue.isMesh&&ue.layers.enable(er)}),a.traverse(ue=>{ue.isLight&&ue.layers.enable(er)})},f={tPic:{value:c.texture},uGain:{value:1},uDark:{value:1},uL:{value:new R(-36.4,33,-31.9).normalize()},uRim:{value:.55*U0},uPin:{value:2.2*U0},uCaus:{value:.9*U0},uHand:{value:0},uShade:{value:0},uShadeC:{value:-30},uShadeT:{value:0},uRare:{value:0},uRareT:{value:0},uSmall:{value:0},uQ0:{value:new Ft(-1.03,-14.8)},uQc:{value:new Ft(1,-2)},uWide:{value:3.2},uArr:{value:0},uC:{value:new R(...Y0)},uR:{value:_a},uB:{value:new R(0,1,0)},uBulge:{value:0},uTime:{value:0}},p=new zn({uniforms:f,vertexShader:Ci,fragmentShader:Ti}),m=s==="low"?[64,48]:[160,120],h=new wo(1,m[0],m[1]);h.setAttribute("aPh",new wt(new Float32Array(h.attributes.position.count),1));const v=new ot(h,p);v.position.set(...Y0),v.scale.setScalar(_a),v.frustumCulled=!1,r.add(v);const M={...f,uGain:{value:.15},uRim:{value:.18*U0},uPin:{value:1.6*U0},uCaus:{value:0},uSmall:{value:1},uBulge:{value:0}},w=new zn({uniforms:M,vertexShader:Ci,fragmentShader:Ti}),x=ut(2207),g=12,y=new wo(1,40,28),b=new Float32Array(g),z=new Fn(y,w,g),k=new ge,I=new Xt,P=new R,C=new R,S=new R(...Y0),F=[.14,.22,.34];let W=0;const A=fe.find(ce=>ce.id==="2").pose,B=new R(...A.pos),oe=new R(...A.look).add(new R(...s==="low"?A.pl??[0,0,0]:[0,0,0])).sub(B).normalize(),ie=oe.clone().cross(new R(0,1,0)).normalize(),U=ie.clone().cross(oe),O=B.distanceTo(S),D=Math.tan(10.24/90);for(let ce=0;W<g&&ce<4e3;ce++){const ue=W<4,Ae=W>=4&&W<7,we=ue?O+(x()-.5)*2.5:Ae?14+x()*5:27.5+x()*3;let De=ue?s==="low"?-1.6+x()*3.4:.25+x()*.7:(x()*2-1)*1.9;Ae&&(De=(x()<.5?-1:1)*(1.25+x()*.55)),!ue&&!Ae&&(De=-1.7+(W-7)*.78+(x()-.5)*.5);const Ve=ue?(x()*2-1)*.75:Ae?(x()*2-1)*1.1:.35+x()*.65;if(C.copy(B).addScaledVector(oe,we).addScaledVector(ie,De*D*we*.924*(s==="low"?.32:1)).addScaledVector(U,Ve*D*we*(s==="low"?1.6:1)),C.y<3.2)continue;const Ke=we<O,Xe=new R().subVectors(C,B),Ce=new R().subVectors(S,B);if(Xe.normalize().angleTo(Ce.normalize())<(Ke?.1:.06))continue;let rt=!1;for(let Te=0;Te<W;Te++)z.getMatrixAt(Te,k),new R().setFromMatrixPosition(k).sub(B).normalize().angleTo(Xe)<.022&&(rt=!0);if(rt)continue;const st=ue?.3+x()*.12:Ae?.3+x()*.1:F[W%3]*(.6+x()*.25);P.setScalar(st),k.compose(C,I,P),z.setMatrixAt(W,k),b[W]=x(),W++}z.count=W,y.setAttribute("aPh",new Tn(b,1)),z.frustumCulled=!1,r.add(z);const E={tPic:{value:c.texture},uGain:{value:6.4},uO:{value:new Ft(2.5,-17)},uD:{value:new Ft(-29,-26).normalize()}},N=new zn({uniforms:E,transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
uniform sampler2D tPic;
uniform float uGain;
uniform vec2 uO;
uniform vec2 uD;
varying vec3 vW;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec2 uv = vec2(vW.x / ${(2*po).toFixed(1)} + 0.5, -vW.z / ${(2*po).toFixed(1)} + 0.5);
  vec3 c = texture2D(tPic, uv).rgb;
  vec2 hd = vec2(sin(${W0.toFixed(6)}), -cos(${W0.toFixed(6)}));
  float hl = dot(vW.xz, hd), hs = abs(dot(vW.xz, vec2(-hd.y, hd.x)));
  c *= 1.0 - 0.9 * (1.0 - smoothstep(0.25, 0.6, hs)) * step(-4.5, hl) * (1.0 - smoothstep(19.0, 19.6, hl));
  vec2 d = vW.xz - uO;
  float along = dot(d, uD), side = dot(d, vec2(-uD.y, uD.x));
  float w = 3.2 + 2.0 * vn(vec2(along * 0.12, 1.7));
  float band = exp(-(((side + 2.0 * vn(vec2(along * 0.2, 4.0)) - 1.0) / w) * ((side + 2.0 * vn(vec2(along * 0.2, 4.0)) - 1.0) / w)));
  float pass = 0.05 + 0.95 * band * (0.55 + 0.45 * vn(vec2(along * 0.09, side * 0.09)));
  gl_FragColor = vec4(c * uGain * pass, 0.0);
}`}),V=new ia(21.4,128,0,Math.PI*2);V.rotateX(-Math.PI/2);{const ce=V.attributes.position;for(let ue=0;ue<ce.count;ue++)ce.setY(ue,w0(Math.hypot(ce.getX(ue),ce.getZ(ue)))+.02)}const K=new ot(V,N);K.renderOrder=-1,r.add(K);const j=3,me=new R,xe=new R;let Me=!1,q=null;const he=[new Tr(new R(...Y0),_a*1.3)];return{group:r,update(ce){const ue=ce.i,Ae=ce.local("G");q??=Dd(z,1);const we=ue===j&&!ce.inHold&&Ae>=.3,De=we&&br(ce.camera,he),Ve=ue===j&&!ce.inHold&&br(ce.camera,q),Ke=ue===2||ue===j&&Ae<.3||De||we&&Ve||ue===1&&!ce.inHold&&ce.u>.3;r.visible=Ke;const Xe=ue===2||ue===j&&!ce.inHold&&ce.u<.3;if((Xe||Me)&&(Lo.value=Xe?jd:1,Me=Xe),!Ke)return;z.visible=ue===2||Ve,K.visible=ue===2||ue===j,v.visible=!we||De;const Ce=ce.trick("2"),rt=ce.state.time;f.uTime.value=rt;const st=Ce.phase,Te=Ce.k,Fe=Va(ce.state.stop);f.uHand.value=Te>0?Ge(st/.7)*(1-ne((st-.8)/.06))*Fe:0,f.uShade.value=Te>0?Fe:0,f.uShadeC.value=-24+66*ne((st-.42)/.58),f.uShadeT.value=Ce.t,f.uGain.value=1+1.3*Te;const ae=fe[2],Y=fe[1].exposure??1,J=ae.exposure??1,pe=fe[j],Se=pe.exposure??1,Ee=ue===2&&!ce.inHold?Y+(J-Y)*ne(ce.u/(ae.exposureIn??1)):ue===j?ce.inHold?Se:J+(Se-J)*ne(ce.u/(pe.exposureIn??1)):J;E.uGain.value=6.4*(1+.4*Te)*J/Ee*(ue===2&&!ce.inHold?ne((ce.u-.45)/.3):ue===j?1-ne((Ae-.12)/.16):1);const He=ue===2&&!ce.inHold?Ge(J/(Ee*Ns(2,ce.u,!1))):1;f.uGain.value*=He,f.uDark.value=He,M.uRim.value=.18*U0*Math.sqrt(He),f.uRim.value=.55*U0*(1-.55*Te)*Math.sqrt(He),f.uCaus.value=.9*U0*(1-.7*Te)*Math.sqrt(He),f.uArr.value=ue===2&&!ce.inHold?1-ne(Ge((ce.u-.62)/.38)):0;const ct=Ce.rare>=0?Ce.rare:-1;if(M.uRare.value=ct>=0?1:0,M.uRareT.value=Math.max(0,ct),M.uGain.value=(.15+(ct>=0?1.4*Math.sin(Math.PI*Ge(ct*1.15))*Fe:0)+.05*Te)*He,Ce.on&&Te>0){me.set((ce.state.pointer.x-.5)*2,-(ce.state.pointer.y-.5)*2,.5).unproject(ce.camera).sub(ce.camera.position).normalize();const L=S.clone().sub(ce.camera.position),Q=L.dot(me);xe.copy(ce.camera.position).addScaledVector(me,Q).sub(S);const ee=xe.length();xe.addScaledVector(L.normalize(),-.6).normalize(),f.uB.value.copy(xe),f.uBulge.value=.2*Te*Math.exp(-Math.max(0,ee-1.2)/3)}else f.uBulge.value=0;u();const mt=o.getRenderTarget(),ht=Lo.value,xt=c0.gain.value;Lo.value=0,c0.gain.value=0;const yt=[];a.traverse(L=>{L.isSpotLight&&yt.push([L,L.intensity])}),yt.forEach(([L,Q])=>L.intensity=Q*$d);const $=o.shadowMap.autoUpdate;o.shadowMap.autoUpdate=!1,o.setRenderTarget(c),o.clear(),o.render(a,l),o.setRenderTarget(mt),o.shadowMap.autoUpdate=$,Lo.value=ht,c0.gain.value=xt,yt.forEach(([L,Q])=>L.intensity=Q)}}}const Yd=Math.PI*2,_0=(e,t,n)=>{const o=Math.min(1,Math.max(0,(n-e)/(t-e)));return o*o*(3-2*o)},Mr=e=>.5-.5*Math.cos(Yd*e);function Fi(e){e=e-Math.floor(e);const t=Mr(e),n=1+.35*_0(0,.3,e)*(1-_0(.75,.97,e)),o=_0(.12,.28,e)*(1-_0(.75,.95,e)),a=1-_0(.2,.42,e)*(1-_0(.85,.98,e)),s=.43,r=Math.max(0,(e-s)/.05),i=e<s?0:Math.min(1.12,1-Math.exp(-r*3.2)*Math.cos(r*5))*(1-_0(.8,.97,e)),c=e<s?0:_0(s,s+.03,e)*(1-_0(.55,.72,e)),l=_0(.08,.3,e)*(1-_0(.8,.97,e));return{s:t,grow:n,ch:o,bridge:a,rec:i,bead:c,open:l}}const qc=`
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
`,Xd=`
attribute vec3 iA;
attribute vec3 iB;
attribute vec4 iR;
attribute vec4 iS;
${qc}
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
`,Zd=`
attribute vec2 aM;
attribute vec4 aE;
attribute vec3 aTu;
attribute vec3 aTv;
${qc}
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
`,aa=30,Qd=`
uniform vec4 uH[${aa}];
uniform vec4 uH2[${aa}];
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
  for (int i = 0; i < ${aa}; i++) {
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
`;function Jd(e,t,n){const o=[],a=[];for(let r=0;r<3;r++){const i=o.length/3,c=r<2?e:n;for(let d=0;d<=c;d++)for(let u=0;u<t;u++)o.push(d/c,u/t*Math.PI*2,r);const l=o.length/3;o.push(1.01,0,r);for(let d=0;d<c;d++)for(let u=0;u<t;u++){const f=i+d*t+u,p=i+d*t+(u+1)%t,m=f+t,h=p+t;a.push(f,p,m,p,h,m)}for(let d=0;d<t;d++){const u=i+c*t+d,f=i+c*t+(d+1)%t;a.push(u,f,l)}}const s=new Ua;return s.setAttribute("position",new wt(o,3)),s.setIndex(a),s}function _i(e,t,n,o,a,s){const r=e.onBeforeCompile;return e.onBeforeCompile=(i,c)=>{r.call(e,i,c),Object.assign(i.uniforms,t,{uLoPxH:pa}),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${n}`).replace("#include <beginnormal_vertex>",`${o}
vec3 objectNormal = loN;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = loP;"),s&&(i.fragmentShader=s(i.fragmentShader))},e.customProgramCacheKey=()=>a,e}function lo(e,t,n){const o=e.top.length-1,a=(r,i)=>{const c=i*o,l=Math.min(o-1,Math.floor(c)),d=c-l;return r[l].clone().lerp(r[l+1],d)},s=e.waist?.5+(t-.5)*(1-e.waist*Math.sin(Math.PI*n)):t;return a(e.top,s).lerp(a(e.bot,s),n)}function ef(e,t){const n=[],o=[],a=[],s=[],r=[],i=[],c=[],l=[];e.forEach((u,f)=>{u.top.length-1;const p=t?u.small?10:22:u.small?18:44,m=t?u.small?14:36:u.small?28:80,h=(g,y)=>lo(u,g,y),v=(()=>{let g=0,y=h(0,.5);for(let b=1;b<=60;b++){const z=h(b/60,.5);g+=z.distanceTo(y),y=z}return g})(),M=g=>{let y=0,b=h(g,0);for(let z=1;z<=20;z++){const k=h(g,z/20);y+=k.distanceTo(b),b=k}return y},w=M(.5);l.push({W:v,H:w});const x=n.length/3;for(let g=0;g<=m;g++){const y=g/m,b=M(y);for(let z=0;z<=p;z++){const k=z/p,I=h(y,k),P=.001,C=h(Math.min(1,y+P),k).sub(h(Math.max(0,y-P),k)),S=h(y,Math.min(1,k+P)).sub(h(y,Math.max(0,k-P))),F=C.clone().cross(S).normalize();n.push(I.x,I.y,I.z),o.push(F.x,F.y,F.z);const W=b*k-(w*.5-b*.5);a.push(v*y,W);let A=1e3;(u.free==="topbot"||u.free==="bot")&&(A=Math.min(A,b*(1-k))),u.free==="topbot"&&(A=Math.min(A,b*k)),u.free==="sides"&&(A=Math.min(A,v*Math.min(y,1-y)*(1-u.waist*Math.sin(Math.PI*k))));const B=u.free==="sides"?Math.sin(Math.PI*k)*.6:Math.sin(Math.PI*y)*(u.free==="bot"?k:1);s.push(A,B,u.free!=="sides"&&k>.5?1:0,f),C.normalize(),S.normalize(),r.push(C.x,C.y,C.z),i.push(S.x,S.y,S.z)}}for(let g=0;g<m;g++)for(let y=0;y<p;y++){const b=x+g*(p+1)+y,z=b+p+1;c.push(b,z,b+1,b+1,z,z+1)}});const d=new Gn;return d.setAttribute("position",new wt(n,3)),d.setAttribute("normal",new wt(o,3)),d.setAttribute("aM",new wt(a,2)),d.setAttribute("aE",new wt(s,4)),d.setAttribute("aTu",new wt(r,3)),d.setAttribute("aTv",new wt(i,3)),d.setIndex(c),{g:d,sizes:l}}function Gc(e){const t=e.q==="low",n=t?e.strands.filter(P=>(P.tier??1)<2):e.strands,o=t?e.webs.filter(P=>!P.small):e.webs,a={uT:{value:0},uK:{value:0},uPO:{value:new R},uPD:{value:new R(0,0,-1)},uLean:{value:1}},s=new zt,r=Jd(t?40:110,t?6:10,t?16:36),i=Math.max(1,n.length),c=new Float32Array(i*3),l=new Float32Array(i*3),d=new Float32Array(i*4),u=new Float32Array(i*4),f=(P,C)=>{c.set([C.a.x,C.a.y,C.a.z],P*3),l.set([C.b.x,C.b.y,C.b.z],P*3);const S=(C.snap?1:0)+(C.end==="drop"?2:0);d.set([C.w,C.sag??C.a.distanceTo(C.b)*.1,C.ph??0,S],P*4),u.set([C.nk??.5,Math.min(7,C.beads??0),C.seed??P*1.37,C.drop??0],P*4)};n.forEach((P,C)=>f(C,P));const p={iA:new Tn(c,3),iB:new Tn(l,3),iR:new Tn(d,4),iS:new Tn(u,4)};for(const[P,C]of Object.entries(p))C.setUsage(ac),r.setAttribute(P,C);r.instanceCount=n.length;const m=_i(ao({env:e.env??1}),a,Xd,"loStrand();","ss-sticky-strand"),h=new ot(r,m);h.frustumCulled=!1,s.add(h);const v={uH:{value:Array.from({length:aa},()=>new vn)},uH2:{value:Array.from({length:aa},()=>new vn(0,0,-1,0))},uPa:{value:new vn},uPb:{value:new vn},uPc:{value:new vn(0,0,0,-1)},uRim:{value:.05},uLv:{value:new R(0,1,0)},uHl:{value:1},uWs:{value:0}};let M=null,w=[];const x=[];if(o.forEach((P,C)=>P.holes.forEach(S=>x.push({w:C,h:S}))),o.length){const P=ef(o,t);w=P.sizes;const C=ao({env:(e.env??1)*1.3});C.side=M0,_i(C,{...a,...v},Zd,"loWeb();","ss-sticky-web",B=>B.replace("#include <common>",`#include <common>
${Qd}`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
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
#include <opaque_fragment>`)),M=new ot(P.g,C),M.frustumCulled=!1,s.add(M);const S=new Gn,F=P.g.getIndex().array,W=[];for(let B=0;B<F.length;B+=3)W.push(F[B],F[B+1],F[B+2],F[B],F[B+2],F[B+1]);S.setAttribute("position",P.g.getAttribute("position")),S.setIndex(W);const A=new ot(S,new zn({colorWrite:!1,depthWrite:!1,vertexShader:"void main() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }",fragmentShader:"void main() { gl_FragColor = vec4(0.0); }"}));A.material.depthWrite=!0,A.frustumCulled=!1,s.add(A)}const g=(P,C,S)=>P+(C-P)*S;function y(P,C){if(!M)return;const S=Fi(P),F=Fi(0),W=V=>g(F[V],S[V],C),A=W("grow"),B=W("ch"),oe=W("bridge"),ie=W("rec"),U=W("bead"),O=W("open");let D=-1,E=-1,N=-1;if(x.forEach(({w:V,h:K},j)=>{if(j>=aa)return;const me=w[V],xe=g(Mr(K.ph??0),Mr((K.ph??0)+P),C);let Me=1;(K.kind==="breathe"||!K.kind)&&(Me=1+.18*xe),K.kind==="open"&&(Me=O),(K.kind==="pairA"||K.kind==="pairB")&&(Me=A,N=V,K.kind==="pairA"?D=j:E=j),v.uH.value[j].set(K.u*me.W,K.v*me.H,K.rx*me.W*Me,K.ry*me.W*Me),v.uH2.value[j].set(K.ang??0,0,V,(K.ph??0)*6.283+j)}),D>=0&&E>=0){const V=v.uH.value[D],K=v.uH.value[E];v.uPa.value.set(V.x,V.y,K.x,K.y);const j=Math.hypot(K.x-V.x,K.y-V.y),me=Math.min(V.z,V.w),xe=Math.min(K.z,K.w),Me=Math.max(.01,j-Math.max(V.z,V.w)-Math.max(K.z,K.w)),q=.014,he=Math.min(me,xe)*.7*B,ce=(j+Math.max(V.z,V.w)-Math.max(K.z,K.w))*.5,ue=g(q,Me+.2,oe);v.uPc.value.set(he,ue,he*Math.min(1.12,ie),N),v.uPb.value.set(U*q*3.4,0,0,ce)}v.uWs.value=W("s")}function b(P){v.uLv.value.copy(P).normalize()}function z(P,C,S,F=1){a.uT.value=P,a.uK.value=C,a.uPO.value.copy(S.origin),a.uPD.value.copy(S.direction),a.uLean.value=F,y(P,C)}function k(P,C){f(P,C)}function I(){for(const P of Object.values(p))P.needsUpdate=!0}return{group:s,strands:h,webs:M,uniforms:a,webUniforms:v,update:z,setLight:b,moveStrand:k,commit:I,material:m,kept:n,sizes:w}}function tf(e){const t=e>2?28:14,n=e>2?10:5,o=[],a=[];for(let r=0;r<=t;r++){const i=r/t*Math.PI*2;for(let c=0;c<=n;c++){const l=c/n,d=Math.cos(l*Math.PI/2),u=Math.sin(l*Math.PI/2)*.55,f=Math.cos(i),p=Math.sin(i),m=p<0?1+1.6*(-p)**1.5:1;o.push(f*d*(1-.12*(p<0?-p:0)),u*(p<0?1-.45*-p:1),p*d*m)}}for(let r=0;r<t;r++)for(let i=0;i<n;i++){const c=r*(n+1)+i,l=c+n+1;a.push(c,c+1,l,c+1,l+1,l)}const s=new Gn;return s.setAttribute("position",new wt(o,3)),s.setIndex(a),s.computeVertexNormals(),s}function nf(e){const t=e?40:18,n=[];for(let a=0;a<=t;a++){const s=a/t,r=.022+.05*Math.exp(-s/.05)+.035*Math.exp(-(((s-0)/.12)**2)),i=.022*(1-.35*Math.exp(-(((s-.45)/.18)**2))),c=Math.max(0,1-((s-.45)/.09)**2)**.85*.05,l=s>.6?1-(s-.6)/.4:1;n.push(new Ft(Math.max(8e-4,Math.max(s<.1?r:i,c)*(s>.6?l**1.3:1)),s))}const o=new sc(n,e?12:6);return o.computeVertexNormals(),o}const Dt=(e=0,t=0,n=0)=>new R(e,t,n),us=Math.PI*2,L0=fe.findIndex(e=>e.id==="3"),of=.5,ds=2.5,af=2.4,za=.5,sf=.35;function rf(e){const{kit:t}=e,n=t.q,o=Ho(n),a=n==="low",s=new zt,r=ut(303),i=fe[L0],c=(G,de,Ie,$e=!0)=>{const Ye=new ot(G,bn({tier:n,...de}));return Ie&&Ye.applyMatrix4(Ie),Ye.castShadow=$e&&!a,Ye.receiveShadow=!a,Ye},l=(G,de,Ie={})=>{for(const $e of G.inst){if(!$e.mats.length)continue;const Ye=new Fn($e.geo,bn({finish:$e.finish,seed:$e.seed,tier:n,...Ie}),$e.mats.length);$e.mats.forEach((lt,tt)=>Ye.setMatrixAt(tt,lt)),Ye.instanceMatrix.needsUpdate=!0,Ye.computeBoundingSphere(),Ye.castShadow=!1,Ye.receiveShadow=!a,de.add(Ye)}},d={value:new vn(0,1,0,0)},u=To.clone().multiplyScalar(.72).addScaledVector(na,-.69).normalize(),f=_o.clone().addScaledVector(u,-_o.dot(u)).normalize(),p=f.clone().cross(u).normalize(),m=af+sf,h=new R(3.5,m+za/2,-.3),v=Wl,M=new ge().makeBasis(f,u,p),w=v.clone().sub(h.clone().applyMatrix4(M));M.setPosition(w);const x=(G,de,Ie)=>Dt(G,de,Ie).applyMatrix4(M);let g=null;{const G=Array.from({length:96},(Ye,lt)=>[Math.cos(lt/96*us)*23.5,Math.sin(lt/96*us)*23.5]),de=[[-9,6,1.2],[3,-4,.9],[-14,-6,1.6],[8,10,.7],[-3,14,1.1],[12,-2,.8]].map(([Ye,lt,tt])=>({at:[Ye,lt],r:tt,sink:tt*.6})),Ie=A0({outline:G,holes:de,t:1.6,bevel:.15,detail:o,round:0}),$e=c(Ie.geo,{finish:"grained",seed:301,age:.5,tone:.2,direct:.1,wear:.5},new ge().makeTranslation(0,Ko-.8,0),!1);g=$e.material.ss,s.add($e)}const y=new zt;y.applyMatrix4(M),s.add(y);const b=Vu({R:ds,detail:o,seed:31});y.add(c(b.pieces[0].geo,{finish:"turned",seed:31,age:.3,tone:.5,direct:.5,rim:d})),y.add(c(b.pieces[1].geo,{finish:"sunray",seed:32,age:.15,tone:.3,direct:.35},b.pieces[1].at));{const G=so({teeth:32,r:1.25,profile:"ratchet",spokes:0,hole:.3,t:.4,detail:o,seed:33,bevel:.04});G.translate(0,m+za/2+.2,0),y.add(c(G,{finish:"sunray",seed:33,age:0,wear:.05,tone:.3,direct:.5}))}const z=(()=>{const G=Ws(tt=>[tt*6,-tt*.5],tt=>1.45-.6*(tt*tt*(3-2*tt)),Mt(70,o,24),18),de=[[-.9,-.9],[5.95,-.5],[.9,.95]],Ie=A0({outline:G,holes:[...de.map(tt=>({at:tt,r:.5,sink:.3})),{at:[0,0],r:.6,bush:!0}],t:za,bevel:.1,detail:o,round:1}),$e=new ge().makeTranslation(0,m,0).multiply(new ge().makeRotationY(0)),Ye=c(Ie.geo,{finish:"brushed",seed:21,age:0,tone:.14,direct:.3,wear:0},$e);{const tt=Ye.material,hn=tt.onBeforeCompile,Gt=tt.customProgramCacheKey;tt.onBeforeCompile=(Ut,Pt)=>{hn.call(tt,Ut,Pt),Ut.fragmentShader=Ut.fragmentShader.replace(`reflectedLight.directSpecular *= uRS2.y;
reflectedLight.directDiffuse *= uRS2.y;`,`float bandM = mix(0.08, 1.0, 1.0 - smoothstep(0.32, 0.62, abs(vOP.z + 0.3)));
reflectedLight.directSpecular *= uRS2.y * bandM;
reflectedLight.directDiffuse *= uRS2.y * bandM;`)},tt.customProgramCacheKey=()=>Gt.call(tt)+"-band"}Ie.bushes&&y.add(c(Ie.bushes,{finish:"polished",seed:22,age:.3},$e));const lt=new zt;return lt.applyMatrix4($e),y.add(lt),l({inst:Oa("small",de,za/2-.19,21,{detail:o,abused:[2]})},lt,{age:.4,tone:.8}),y.add(Ye),{mesh:Ye,m:$e}})();{const G=z.m.clone().invert(),de=h.clone().applyMatrix4(G),Ie=Dt(1,0,0).transformDirection(G),$e=Dt(0,0,-1).transformDirection(G),Ye=da("barrel-bridge",z.mesh,{at:[de.x,de.y,de.z],right:[Ie.x,Ie.y,Ie.z],up:[$e.x,$e.y,$e.z],width:7.6,depth:.12},e.lang,{tier:n}),lt=globalThis;(lt.__secondWait??=[]).push(Ye.ready)}const k=[],I=3.2,P=.8,C=ds-.3,S=1.2;for(let G=0;G<=160;G++){const de=G/160,Ie=S+de*I*us,$e=P+(C-P)*Math.pow(de,.85);k.push(x(Math.cos(Ie)*$e,.75,Math.sin(Ie)*$e))}const F=S+I*us,W=x(Math.cos(F+.5)*(ds+.25),.8,Math.sin(F+.5)*(ds+.25)),A=new No([...k,W,...vr],!1,"centripetal"),B=a?500:1400,oe=A.getSpacedPoints(B),ie=A.getLength(),O=(()=>{let G=0;for(let de=1;de<k.length;de++)G+=k[de].distanceTo(k[de-1]);return G})()/ie,D=Dt(...i.light.blade.to).sub(Dt(...i.light.blade.from)).normalize(),E=(()=>{let G=0,de=1e9;return oe.forEach((Ie,$e)=>{const Ye=Ie.distanceTo(vr[3]);Ye<de&&(de=Ye,G=$e)}),G/B})(),N=[],V=[],K=[];for(let G=0;G<=B;G++){const de=G/B,Ie=oe[Math.min(B,G+1)].clone().sub(oe[Math.max(0,G-1)]).normalize(),$e=ko.clone().sub(oe[G]).normalize(),Ye=D.clone().negate(),lt=Ye.addScaledVector($e,-Ye.dot($e)).normalize().addScaledVector($e,.14).normalize();let tt=lt.clone().addScaledVector(Ie,-lt.dot(Ie)).normalize();const hn=Math.exp(-(((de-E)/.1)**2)),Gt=Math.exp(-(((de-(O+(E-O)*.45))/.07)**2)),Ut=(1-hn)*(Math.PI*.5*Gt+Math.sin(de*23)*.45+(de>E?(de-E)*3.2:0));tt.applyAxisAngle(Ie,Ut);let Pt=Ie.clone().cross(tt).normalize();if(de<O+.02){const Vt=u.clone().addScaledVector(Ie,-u.dot(Ie)).normalize(),ft=ne((de-O+.02)/.06);Pt=Vt.lerp(Pt,ft).normalize(),tt=Pt.clone().cross(Ie).normalize()}N.push(Ie),V.push(tt),K.push(Pt)}const j=3.1,me=j/14,xe=G=>j*(G>.985?.45+(1-G)*36:1),Me=Hs({pts:oe,side:K,w:xe,t:me,detail:o,cav:G=>G<O?.35:0});{const G=o===0?1:2,de=4*(G+1),Ie=Me.getAttribute("normal"),$e=Math.tan(.42),Ye=Dt(),lt=new Map([[G,1],[G+1,-1],[3*(G+1)-1,-1],[3*(G+1),1]]);if(Ie.count>=oe.length*de)for(let tt=0;tt<oe.length;tt++)for(const[hn,Gt]of lt){const Ut=tt*de+hn;Ye.set(Ie.getX(Ut),Ie.getY(Ut),Ie.getZ(Ut)).addScaledVector(K[tt],Gt*$e).normalize(),Ie.setXYZ(Ut,Ye.x,Ye.y,Ye.z)}Ie.needsUpdate=!0}const q={value:new vn(0,1,0,0)},he=c(Me,{finish:"polished",seed:34,age:.3,wear:.55,tone:.6,direct:1,objScale:1,envMap:.35,rim:q},void 0,!1);{const G=he.material,de=G.onBeforeCompile.bind(G),Ie=G.customProgramCacheKey.bind(G);G.onBeforeCompile=($e,Ye)=>{de($e,Ye),$e.fragmentShader=$e.fragmentShader.replace("col += scr * 0.05 * (1.0 - pitM) * (1.0 - scaleM) * cF * uTone;","float stn = smoothstep(0.32, 0.5, scr + (tri(tNz, sp * 5.0, tw).r - 0.5) * 0.45 + (tri(tNz, sp * 13.0, tw).a - 0.5) * 0.2) * step(0.0001, scr); col = mix(col, 0.005, stn * (1.0 - scaleM)); col = mix(col, 0.004, smoothstep(0.02, 0.2, pitM));").replace("ssRough += scr * 0.035;","ssRough = mix(ssRough, 0.85, stn);").replace("float ssH = ","ssMetal = mix(ssMetal, 1.0, clamp(max(max(smoothstep(0.02, 0.2, pitM), chip * 0.85), stn), 0.0, 1.0)); float ssH = ").replace(" - pitH - scr"," - pitH * 0.15 - scr")},G.customProgramCacheKey=()=>Ie()+"-stain"}s.add(he);const ce={uGain:{value:0},uT:{value:0}},ue=new ot(new h0(1,1),new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:ce,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv * vec2(1.4, 1.0) + vec2(uT * 0.03, -uT * 0.02);
  float n = 0.5 * vn(q * 2.3 + 1.7) + 0.3 * vn(q * 5.1 + 4.2) + 0.2 * vn(q * 11.0 + 8.9);
  vec2 bq = vUv * vec2(1.1, 1.4); float body = exp(-dot(bq, bq) * 1.6);
  float e = body * (0.25 + 0.75 * smoothstep(0.28, 0.85, n)) * (0.6 + 0.4 * smoothstep(-0.6, 0.4, -vUv.y));
  gl_FragColor = vec4(vec3(0.6, 0.035, 0.02) * e * uGain, 0.0);
}`}));ue.position.copy(Ln(.62,-.22,17)),ue.lookAt(ko),ue.scale.set(15,10,1),ue.renderOrder=4,ue.frustumCulled=!1,s.add(ue);const Ae={uGain:{value:0}},we=new ot(new h0(1,1),new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:Ae,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; varying vec2 vUv;
float h1(float x) { return fract(sin(x * 91.7) * 43758.5); }
float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main() {
  vec2 d = normalize(vec2(0.8, -0.6)), n = vec2(-d.y, d.x);
  float a = dot(vUv, d), c = dot(vUv, n);
  float core = exp(-c * c * 5.0) * (1.0 - smoothstep(0.6, 1.0, abs(a)));
  float streak = 0.6 + 0.4 * vn(c * 19.0 + 2.0) * vn(c * 47.0 + 5.0);
  float e = core * streak * (1.0 - smoothstep(0.8, 1.0, length(vUv)));
  gl_FragColor = vec4(vec3(0.6, 0.59, 0.58) * e * uGain, 0.0);
}`}));we.position.copy(Ln(-.4,.35,44)),we.lookAt(ko),we.scale.set(46,30,1),we.renderOrder=4,we.frustumCulled=!1,s.add(we);const De=we.clone();De.position.copy(Ln(.38,.78,30)),De.lookAt(ko),De.scale.set(15,8.5,1),s.add(De);let Ve=!1,Ke=0,Xe=1;he.frustumCulled=!1,he.onBeforeRender=()=>{if(!Ve)return;const G=Ke;nt.on=1,nt.columns=Y.map(de=>[...de]),nt.floorY=Ko,nt.red.set(10-2*G,Ko+1+.5*G,-8+1.5*G),nt.redSize.set(9+1.5*G,3.2+.6*G,9+1*G),nt.redPower=(.12+.03*G)*Xe,nt.ruby.set(z0[0],z0[1],z0[2]),nt.rubyPower=0,nt.nave.set(0,0,0,0),nt.bladeGain=of*(1-.5*G)*Xe,nt.wake=G};for(let G=0;G<=B;G++)V[G].dot(ko.clone().sub(oe[G]))<0&&V[G].negate();const Ce=G=>{const de=Math.round(Ge(G)*B);return{p:oe[de].clone(),n:V[de].clone(),s:K[de].clone(),t:N[de].clone(),w:xe(G)}},rt=(G,de)=>{const Ie=Math.round(Ge(G)*B);return de.p.copy(oe[Ie]),de.n.copy(V[Ie]),de.s.copy(K[Ie]),de.t.copy(N[Ie]),de.w=xe(G),de},st=(G,de=0,Ie=1,$e=0)=>{const Ye=Ce(G);return Ye.p.addScaledVector(Ye.s,de*Ye.w*.45).addScaledVector(Ye.n,Ie*(me*.5+$e))},Te=new zt;s.add(Te);const Fe=[];[[-.6,.35,22,3.6,96,1],[-.1,.62,26,3,80,2],[.45,.05,27,2.6,72,3],[-.4,.02,20,2,64,4],[.92,.72,24,3.2,84,5],[.12,.3,34,4.2,110,6],[-.85,.6,19,1.6,60,7]].forEach(([G,de,Ie,$e,Ye,lt],tt)=>{const hn=so({teeth:Ye,r:$e,profile:"train",spokes:tt%3?5:4,rim:.08,hub:.14,hole:.2,detail:o,seed:330+tt,sheared:tt%2,fold:tt===2?.7:void 0,foldAt:tt===2?.5:void 0,snapped:tt===4}),Gt=Ln(G,de,Ie),Ut=new Kn(.6+lt*.7,lt*1.9,.4-lt*.5),Pt=new ge().compose(Gt,new Xt().setFromEuler(Ut),Dt(1,1,1));if(Te.add(c(hn,{finish:"sunray",seed:330+tt,age:.2,tone:.12,direct:.08,envMap:.4,rim:d},Pt,!1)),Fe.push({c:Gt,r:$e,ax:Dt(0,1,0).applyEuler(Ut)}),tt<5){const Vt=La({length:4.5,ra:.16,leaves:8+tt,pinionR:.5,pinionH:.7,pinionAt:1.2,seatAt:2.2,detail:o,seed:340+tt}),ft=Pt.clone().multiply(new ge().makeTranslation(tt===0||tt===3?.55:0,tt===0||tt===3?-3.7:-2.2,tt===0||tt===3?.35:0));Te.add(c(Vt.geo,{finish:"turned",seed:340+tt,age:.6,tone:.45,direct:.3,rim:d},ft,!1))}});{const G=Nr({length:12,width:2.4,t:.6,detail:o,seed:350}),de=new ge().compose(Ln(.55,.25,25),new Xt().setFromEuler(new Kn(1.1,.5,-.7)),Dt(1,1,1));Te.add(c(G.pieces[0].geo,{finish:"blackened",seed:350,age:.6,tone:.4,direct:.25,rim:d},de,!1))}const Y=[];for(const[G,de,Ie]of[[-.78,24,.9],[.98,22,.8],[.3,34,1],[-.25,38,.9]]){const $e=Ln(G,0,de),Ye=11.2,lt=bc({h:Ye,r:Ie,detail:o});Te.add(c(lt,{finish:"turned",seed:360+Y.length,age:.6,tone:.4,direct:.3,rim:d},new ge().makeTranslation($e.x,Ko,$e.z),!1)),Y.push([$e.x,$e.z,Ie,Ko+Ye])}const J={value:new vn(0,1,0,0)},pe=[],Se=[],Ee=[],He=Dt(),ct=Dt();{const G=Sc({count:a?50:90,box:[1,1,1],centre:[0,0,0],seed:371,detail:o}),de=ut(372),Ie=new ge,$e=new Xt,Ye=Dt(),lt=Dt(),tt=_o.clone().multiplyScalar(.7).addScaledVector(To,.55).addScaledVector(na,-.45).normalize();for(const Gt of G.inst)Gt.mats.forEach(Ut=>{Ut.decompose(lt,$e,Ye);const Pt=E-.12+de()*.3,Vt=Ce(Pt),ft=Math.pow(de(),1.6),rn=Vt.p.addScaledVector(Vt.n,.3+ft*1.2).addScaledVector(tt,ft*6.5).addScaledVector(Vt.s,(de()-.5)*(1+3*ft)).addScaledVector(To,(de()-.5)*ft*2),Yt=Ye.x*(.55+.5*(1-ft));Ut.copy(Ie.compose(rn,$e,Dt(Yt,Yt,Yt)));const Tt=ft<.3&&pe.length<16;Tt&&pe.push(rn.clone()),Se.push({j:G.inst.filter(Pn=>Pn.mats.length).indexOf(Gt),k:Gt.mats.indexOf(Ut),p:rn.clone(),q:$e.clone(),s:Yt,tied:Tt,in4:(()=>{const Pn=Dt(...fe[L0+1].pose.pos),Hn=rn.clone().sub(Pn),An=Hn.length();return An<45&&Hn.dot(Dt(...fe[L0+1].pose.look).sub(Pn).normalize())>An*Math.cos(.28)})()})});const hn=s.children.length;l(G,s,{age:.4,tone:.8,rim:J}),Ee.push(...s.children.slice(hn)),He.copy(Ce(E).p).addScaledVector(Ce(E).n,.3),ct.copy(tt)}const mt=[],ht=[],xt=[8,3,1.6],yt=Ln(0,1,1).sub(Ln(0,0,1)).dot(To),$=Ln(1,0,1).sub(Ln(0,0,1)).dot(_o),L=G=>{const de=G.clone().sub(ko),Ie=de.dot(na);return{x:de.dot(_o)/Ie/$,y:de.dot(To)/Ie/yt,z:Ie}},Q=G=>L(G).z*2*yt/1935,ee=(G,de,Ie)=>xt[G]*.5*Q(de.clone().lerp(Ie,.5))*(.85+.3*r()),be=(G,de,Ie,$e={})=>mt.push({a:G,b:de,w:ee(Ie,G,de),tier:Ie,ph:r(),beads:Ie===2?0:3+Math.floor(r()*5),nk:.4+r()*.2,seed:r()*50,...$e}),Le=(G,de)=>x(G,m+za/2-.1,de),Re=(G,de=0,Ie=1)=>st(G,de,Ie,-me*.45);for(let G=0;G<9;G++){const de=O+.015+G*.012,Ie=1.9+G*.42+r()*.2,$e=-.7-r()*.45;be(Re(de,(r()-.5)*1.6,-1),Le(Ie,$e),G%3,{sag:.15+r()*.35,drop:G%3===0?.42+r()*.16:0,snap:G===4})}for(let G=0;G<Math.min(10,pe.length);G++){const de=E-.09+G*.02,Ie=Re(de,r()<.6?1:-1,1);be(Ie,pe[G],1+G%2,{sag:.15+r()*.3,snap:G===3||G===7})}for(let G=0;G<14;G++){const de=O+.025+G*(E-O-.03)/14+r()*.006;be(Re(de,-1.05,1),Re(de+(r()-.5)*.02,1.05,1),G%3,{sag:-.18-r()*.3,snap:G%5===2})}for(let G=0;G<8;G++){const de=.9+G*.011,Ie=E-.16+G*.022;be(Re(de,(r()-.5)*1.6,-1),Re(Ie,(r()-.5)*1.4,1),1+G%2,{sag:.2+r()*.3,drop:G%2?0:.45+r()*.1})}for(let G=0;G<9;G++){const de=O+.06+G*((E+.05-O)/9),Ie=Re(de,(r()-.5)*1.5,-1),$e=.4+r()*.9;be(Ie,Ie.clone().add(Dt((r()-.5)*.2,-$e,(r()-.5)*.2)),G%2,{sag:0,end:"drop",beads:1+Math.floor(r()*3)})}for(let G=0;G<2;G++){const de=Fe[G*2+1];be(Re(E-.03+G*.05,(r()-.5)*1.4,-1),de.c.clone().addScaledVector(To,-de.r*.9),0,{sag:.9,beads:6,drop:.5})}for(let G=0;G<8;G++){const de=1.8+r()*3.6,Ie=-.7-r()*.4;be(Le(de,Ie),Le(de+.3+r()*.9,Ie-.1-r()*.2),2,{sag:-.12-r()*.2})}const ve=(G,de,Ie,$e)=>{let Ye=st(G,1,0),lt=1e9;for(let tt=0;tt<=200;tt++)for(const hn of[-1,1]){const Gt=G+(de-G)*tt/200,Ut=st(Gt,hn*.98,0),Pt=L(Ut),Vt=Math.abs(Pt.y-Ie)-$e*Pt.x*.02;Vt<lt&&(lt=Vt,Ye=Ut)}return Ye};{const G=ve(O+.02,E-.05,.12,1),de=ve(O+.02,E-.05,-.42,1),Ie=ve(E+.05,.99,.16,-1),$e=ve(E+.05,.99,-.03,-1),Ye=14,lt=(Pt,Vt)=>Vt*L(Pt).z*yt,tt=[],hn=[];for(let Pt=0;Pt<=Ye;Pt++){const Vt=Pt/Ye,ft=Math.sin(Math.PI*Vt),rn=G.clone().lerp(Ie,Vt),Yt=de.clone().lerp($e,Vt);tt.push(rn.add(Dt(0,-lt(rn,.08)*ft,0))),Yt.add(Dt(0,-lt(Yt,.26)*ft*(1+.2*Math.sin(Vt*5)),0)),hn.push(Yt)}const Gt={top:tt,bot:hn,free:"topbot",rim:.04,holes:[{u:.62,v:.5,rx:.1,ry:.07,ang:.35,ph:.1},{u:.2,v:.62,rx:.068,ry:.05,ang:-.7,ph:.45},{u:.34,v:.3,rx:.046,ry:.034,ang:-.4,kind:"pairA"},{u:.44,v:.52,rx:.04,ry:.03,ang:.5,kind:"pairB"},{u:.8,v:.76,rx:.035,ry:.026,ang:1,ph:.4},{u:.09,v:.38,rx:.018,ry:.03,ang:.2,ph:.7},{u:.87,v:.3,rx:.028,ry:.019,ang:-.6,ph:.25},{u:.5,v:.84,rx:.022,ry:.016,ph:.55},{u:.7,v:.2,rx:.014,ry:.021,ang:.9,kind:"open"},{u:.22,v:.16,rx:.02,ry:.014,ang:.3,ph:.9},{u:.94,v:.58,rx:.011,ry:.009,ph:.15},{u:.36,v:.78,rx:.012,ry:.016,kind:"open"},{u:.53,v:.24,rx:.009,ry:.007,ph:.6},{u:.75,v:.45,rx:.008,ry:.011,ph:.3},{u:.3,v:.9,rx:.01,ry:.007,ph:.8},{u:.13,v:.82,rx:.007,ry:.009,ph:.2},{u:.62,v:.9,rx:.013,ry:.01,ang:.4,ph:.65},{u:.47,v:.1,rx:.012,ry:.008,ph:.05}]};ht.push(Gt);const Ut=(Pt,Vt)=>{const ft=lo(Gt,1,Vt).distanceTo(lo(Gt,0,Vt)),rn=lo(Gt,Pt,1).distanceTo(lo(Gt,Pt,0));for(let Tt=0;Tt<3;Tt++)for(const Pn of Gt.holes){const Hn=Math.max(Pn.rx,Pn.ry)*ft*1.6,An=(Pt-Pn.u)*ft,R0=(Vt-Pn.v)*rn,S0=Math.hypot(An,R0);if(S0<Hn){const H=Hn/Math.max(S0,1e-6);Pt=Pn.u+An*H/ft,Vt=Pn.v+(S0<1e-6?Hn:R0*H)/rn}}const Yt=lo(Gt,Math.min(.98,Math.max(.02,Pt)),Math.min(.95,Math.max(.05,Vt)));return Yt.addScaledVector(Yt.clone().sub(ko).normalize(),-.02)};for(const[Pt,Vt,ft,rn,Yt]of[[.5,.44,.73,.58,1],[.55,.6,.7,.38,2],[.12,.58,.28,.68,1],[.6,.42,.64,.6,2],[.3,.29,.4,.55,2],[.74,.72,.86,.8,2]])be(Ut(Pt,Vt),Ut(ft,rn),Yt,{sag:.05+r()*.1,beads:Yt===1?4:0});for(const[Pt,Vt]of[[.18,.5],[.33,.9],[.47,.35],[.58,1.1],[.71,.6],[.86,.4]]){const ft=lo(Gt,Pt,.97),rn=lo(Gt,Pt,.8);be(rn,ft.clone().add(Dt((r()-.5)*.1,-Vt,0)),1,{sag:0,end:"drop",beads:1+Math.floor(r()*3)})}}for(const[G,de,Ie,$e,Ye]of[[3,O+.03,O+.1,-1,1],[1,O+.2,O+.3,-1,2]]){const lt=Fe[G],tt=6,hn=[],Gt=[],Ut=st((de+Ie)/2,$e,0).sub(lt.c),Pt=lt.ax.clone().normalize(),Vt=Ut.clone().addScaledVector(Pt,-Ut.dot(Pt)).normalize(),ft=Pt.clone().cross(Vt);for(let rn=0;rn<=tt;rn++){const Yt=rn/tt;hn.push(st(de+(Ie-de)*Yt,$e*.98,0));const Tt=(Yt-.5)*.9;Gt.push(lt.c.clone().addScaledVector(Vt,Math.cos(Tt)*lt.r*.97).addScaledVector(ft,Math.sin(Tt)*lt.r*.97))}ht.push({top:hn,bot:Gt,free:"sides",waist:.35,small:!0,rim:.03,holes:Ye===1?[{u:.45,v:.5,rx:.12,ry:.08,ang:.4,ph:.2},{u:.7,v:.28,rx:.05,ry:.04,kind:"open"},{u:.3,v:.76,rx:.04,ry:.06,ph:.6}]:[{u:.55,v:.42,rx:.1,ry:.07,ang:-.3,ph:.5},{u:.3,v:.7,rx:.05,ry:.035,ph:.1},{u:.74,v:.76,rx:.03,ry:.04,kind:"open"}]}),be(hn[0],Gt[0],1,{sag:.1,beads:3}),be(hn[tt],Gt[tt],1,{sag:.1,beads:4})}const _e=a?28:56,Ue=mt.length,Ne=Array.from({length:_e},(G,de)=>O+.02+(de+r()*.7)/_e*(E+.03-O)),Qe=Array.from({length:_e},()=>.05+r()*r()*.12),_=Array.from({length:_e},()=>(r()-.5)*1.5),te=Array.from({length:_e},()=>r());for(let G=0;G<_e;G++)mt.push({a:st(Ne[G]),b:st(Ne[G]+.01),w:.01,tier:1,sag:0,beads:0,seed:G});const Z=Gc({strands:mt,webs:ht,q:n,env:.8});s.add(Z.group);const qe=Array.from({length:_e},(G,de)=>Z.kept.indexOf(mt[Ue+de])),Be=ao({env:.8}),ze=new Fn(tf(o),Be,_e);ze.frustumCulled=!1,s.add(ze);const We=a?18:30,T=new Fn(nf(o),ao({env:.8}),We);T.frustumCulled=!1,s.add(T);const le=O+(E-O)*.62,re=Array.from({length:We},(G,de)=>{const Ie=de*2.399,$e=Math.sqrt((de+.5)/We);return[Math.cos(Ie)*$e,Math.sin(Ie)*$e,.6+r()*.5]}),se=new ge,ye=new Xt,Pe=Dt(0,1,0),Je=Dt(),et=new Fr,Ct=Dt(),pt=Dt(),vt=Dt(),bt=new ge,It={p:Dt(),n:Dt(),s:Dt(),t:Dt(),w:0},Qt={p:Dt(),n:Dt(),s:Dt(),t:Dt(),w:0},tn=Dt(),dn=Dt(),Yn=Dt(),io=Dt(),dt=Dt(),sn=Dt(),gn=Dt(),nn=Dt();let Un=-1;const bo=G=>{if(+G!==Un){Un=+G,Se.forEach((de,Ie)=>{const $e=!G||!de.in4&&(de.tied||Ie%3===0),Ye=G&&!de.tied?1.8:1,lt=G&&!de.tied?Yn.copy(He).addScaledVector(ct,io.copy(de.p).sub(He).dot(ct)).lerp(de.p,.3):de.p;Ee[de.j].setMatrixAt(de.k,se.compose(lt,de.q,sn.setScalar($e?de.s*Ye:0)))});for(const de of Ee)de.instanceMatrix.needsUpdate=!0,de.computeBoundingSphere()}};return{group:s,update(G){if(g){const ft=G.i===L0&&!G.inHold?Math.max(1-ne(Ge(G.u/.12)),ne(Ge((G.u-.8)/.2))):1;g.uAge.value=.5*ft,g.uWear.value=.5*ft}if(s.visible=G.i>=L0-1&&G.i<=L0+1,!s.visible){Xe=0,Ve=!1,Ke=0,ue.visible=we.visible=De.visible=!1;return}const de=G.i===L0&&G.inHold;bo(G.camera.aspect<1),G.camera.getWorldPosition(pt),vt.copy(nt.bladeDir).negate().transformDirection(G.camera.matrixWorldInverse),d.value.set(vt.x,vt.y,vt.z,.5),q.value.set(vt.x,vt.y,vt.z,1.6),J.value.set(vt.x,vt.y,vt.z,1.4);const Ie=G.trick("3"),$e=Ie.phase,Ye=Ie.k;Ct.set(G.state.pointer.x*2-1,1-G.state.pointer.y*2,.5).unproject(G.camera),et.origin.copy(pt),et.direction.copy(Ct).sub(pt).normalize();const lt=Ie.rare>=0?Ie.rare:-1,tt=lt>=0?ne(lt/.35)*(1-ne((lt-.62)/.38)):0;Z.setLight(vt),Z.update($e,Ye*(1-.6*tt),et,1);let hn=.5,Gt=1e9;for(let ft=0;ft<=40;ft++){const rn=O+(1-O)*ft/40,Yt=oe[Math.round(Ge(rn)*B)],Tt=et.distanceSqToPoint(Yt);Tt<Gt&&(Gt=Tt,hn=rn)}for(let ft=0;ft<_e;ft++){const rn=E+.02-(O+.03),Yt=Ye>0?($e*(ft%3===0?2:1)+te[ft])%1:0;let Tt=Ye>0?O+.03+(Ne[ft]-O-.03+Yt*rn*Ye)%(rn+.25):Ne[ft];Tt+=(hn-Tt)*.25*Ye*Math.exp(-Math.abs(hn-Tt)*6),Tt=Tt+(le-Tt)*tt;const Pn=Ye>0?ne((Tt-O-.03)/.03)*(1-ne((Tt-E)/.04)):1,Hn=Qe[ft]*(Ye>0?.4+.6*Pn:1)*(1-.7*tt),An=rt(Math.min(.99,Tt),It),R0=An.p.addScaledVector(An.s,_[ft]*An.w*.45*(1-tt)).addScaledVector(An.n,me*.5);tn.copy(An.t).addScaledVector(An.n,-An.t.dot(An.n)).normalize(),dn.copy(An.n).cross(tn),bt.makeBasis(dn,An.n,tn),ye.setFromRotationMatrix(bt),se.compose(R0,ye,Yn.set(Hn,Hn*(.7+.5*Ye*Pn),Hn*(1+.5*Ye*Pn))),ze.setMatrixAt(ft,se);const S0=rt(Math.max(O,Tt-(.012+.02*Ye)*Pn),Qt),H=S0.p.addScaledVector(S0.s,_[ft]*S0.w*.45*(1-tt)).addScaledVector(S0.n,me*.5);qe[ft]>=0&&Z.moveStrand(qe[ft],{a:H,b:io.copy(R0).addScaledVector(tn,-Hn*1.2),w:Hn*(.08+.1*Ye),sag:-Hn*.1,beads:0,seed:ft})}Z.commit(),ze.instanceMatrix.needsUpdate=!0;const Ut=lt>=0?ne((lt-.3)/.22)*(1-ne((lt-.66)/.3)):0;if(T.visible=Ut>.001,T.visible){const ft=rt(le,It),rn=ft.n.dot(Je.copy(pt).sub(ft.p))<0?ft.n.negate():ft.n,Yt=ft.p.addScaledVector(rn,me*.5),Tt=Je.copy(pt).sub(Yt).normalize(),Pn=gn.copy(ft.s),Hn=nn.copy(Tt).cross(Pn).normalize();re.forEach(([An,R0,S0],H)=>{dt.copy(Tt).multiplyScalar(.7).addScaledVector(Pn,An*1.5).addScaledVector(Hn,R0*1.5).normalize(),ye.setFromUnitVectors(Pe,dt);const X=1.5*S0*Ut,ke=.45+.2*Ut;se.compose(sn.copy(Yt).addScaledVector(Pn,An*.15).addScaledVector(Hn,R0*.15),ye,Yn.set(X*ke,X,X*ke)),T.setMatrixAt(H,se)}),T.instanceMatrix.needsUpdate=!0}const Pt=G.i===L0+1&&!G.inHold;Xe=de?1:Pt?1-ne((G.u-.3)/.4):G.i===L0?ne((G.u-.35)/.25):0,Ve=s.visible&&(de||G.i===L0&&G.u>.35||Pt),Ke=Ye,ue.visible=s.visible&&(de||G.i===L0&&G.u>.35),ce.uGain.value=.42*(1+.25*Ye)*Xe,ce.uT.value=$e,we.visible=ue.visible,De.visible=ue.visible,Ae.uGain.value=.15*Xe;const Vt=he.material.ss;Vt.uRS2.value.y=Pt?.5:1,Vt.uTone.value=Pt?.45:.6,Pt&&(q.value.w=.2)}}}const Uc=(e,t,n)=>{const o=Ge((n-e)/(t-e));return o*o*(3-2*o)},m0=.2,Do=2.2*m0,yo=1.2*m0,Gr=80,cf=2*m0,oo=Gr*cf/(2*Math.PI),Ta=.5*Do,P0=oo-Ta,j0=.028,tr=.026,sa=Math.PI*2/Gr,N0=-sa/2,b0=j0*1.1,lf=.42,uf=.006;function Li(e,t,n,o){const a=new Rn,s=n/2,r=[{...e,pts:Ts(Fs(e.pts),!0)},...t.map(l=>({...l,pts:Ts(Fs(l.pts),!1)}))],i=[],c=[];for(const l of r){const d=l.pts,u=d.length,f=l.bevel??o,p=[];for(let b=0;b<u;b++){const z=d[b],k=d[(b+1)%u],I=k[0]-z[0],P=k[1]-z[1],C=Math.hypot(I,P)||1;p.push([P/C,-I/C])}const m=[],h=[],v=[],M=Math.cos((l.sharp??35)*Math.PI/180);for(let b=0;b<u;b++){const z=p[(b-1+u)%u],k=p[b];let I=z[0]+k[0],P=z[1]+k[1];const C=Math.hypot(I,P)||1;I/=C,P/=C,m.push([I,P]),h.push(1/Math.max(.35,I*k[0]+P*k[1])),v.push(z[0]*k[0]+z[1]*k[1]<M)}const w=d.map((b,z)=>(l.cav??0)+(l.cavAt?.[z]??0)),x=d.map((b,z)=>l.edgeAt?.[z]??0),g=Math.SQRT1_2,y=[[[f,s,g,g,.35],[0,s-f,g,g,.35]],[[0,s-f,0,1,.15],[0,-s+f,0,1,.15]],[[0,-s+f,-g,g,.25],[f,-s,-g,g,.25]]];for(let b=0;b<u;b++){const z=(b+1)%u;for(const k of y){const I=k.map(([P,C,S,F,W])=>[b,z].map(A=>{const B=v[A]?p[b]:m[A];return a.v(d[A][0]-m[A][0]*P*h[A],C,d[A][1]-m[A][1]*P*h[A],B[0]*F,S,B[1]*F,w[A]*.55,W*(.6+.6*x[A]))}));a.quad(I[0][0],I[1][0],I[1][1],I[0][1])}}i.push(d.map((b,z)=>[b[0]-m[z][0]*f*h[z],b[1]-m[z][1]*f*h[z]])),c.push(w.map(b=>b*.12))}for(const l of[!0,!1]){const d=i[0].map(v=>new Ft(v[0],v[1])),u=i.slice(1).map(v=>v.map(M=>new Ft(M[0],M[1]))),f=Xi.triangulateShape(d,u),p=a.p.length/3,m=l?s:-s,h=c.flat();i.flat().forEach((v,M)=>a.v(v[0],m,v[1],0,l?1:-1,0,h[M],0));for(const v of f)l?a.tri(p+v[0],p+v[2],p+v[1]):a.tri(p+v[0],p+v[1],p+v[2])}return a.geometry()}function $c(e){const t=e==="low",n=t?3:6,o=t?3:7,a=t?6:16,s=m0/2,r=Do-Ta,i=(r*r+s*s)/(2*s),c=s-i,l=[];l.push({x:-m0,h:0,cav:1,edge:0});for(let u=0;u<=n;u++){const f=u/n*Math.PI/2;l.push({x:-s-j0+j0*Math.sin(f),h:j0-j0*Math.cos(f),cav:.8*(1-u/n),edge:0})}const d=new Set;for(let u=1;u<o;u++)d.add(j0+(Ta-j0)*u/o);if(!t)for(const u of[-1.5,-.5,.5,1.5])d.add(b0+u*uf*.7);[...d].filter(u=>u>j0+1e-4&&u<Ta-1e-4).sort((u,f)=>u-f).forEach(u=>l.push({x:-s,h:u,cav:0,edge:0}));for(let u=0;u<a;u++){const f=u/a*.985,p=f*r,m=Math.max(.004,c+Math.sqrt(Math.max(0,i*i-p*p)));l.push({x:-m,h:Ta+p,cav:0,edge:Uc(.4,.95,f)})}return l}function df(e){const t=$c(e),n=[...t,{x:0,h:Do,cav:0,edge:1},...t.slice(1).reverse().map(d=>({...d,x:-d.x}))];n.pop();const o=[],a=[],s=[],r=[],i=[],c=Array.from({length:7},(d,u)=>-m0/2+m0*u/6),l=[...n.filter(d=>d.x<0&&d.h<b0-1e-4),...c.map(d=>({x:d,h:b0,cav:.2,edge:0})),...n.filter(d=>d.x>0&&d.h<b0-1e-4)];for(let d=0;d<Gr;d++)for(const u of d===0?l:n){const f=P0+u.h,p=N0+d*sa+u.x/oo;o.push([Math.cos(p)*f,Math.sin(p)*f]),a.push(u.cav),s.push(u.edge),r.push(d),i.push(u.h)}return{pts:o,cav:a,edge:s,tooth:r,h:i}}function Ur(e,t){const n=new R(Math.cos(N0),0,Math.sin(N0)),o=new R(-Math.sin(N0),0,Math.cos(N0)),a=Math.hypot(e.x,e.z),s=Math.atan2(e.z,e.x);if(Math.abs(s-N0)>sa*.5||a-P0<b0-.0201)return e;const r=1,i=lf*r,c=-.175*r,l=(d,u)=>{let f=d.dot(n)-(u?P0+b0:0),p=d.dot(o),m=d.y-(u?-yo/2:0);const h=Math.cos(i),v=Math.sin(i);[f,m]=[f*h-m*v,f*v+m*h];const M=Math.cos(c),w=Math.sin(c);[f,p]=[f*M-p*w,f*w+p*M],d.copy(n).multiplyScalar(f+(u?P0+b0:0)).addScaledVector(o,p),d.y=m+(u?-yo/2:0)};return l(e,!0),t&&l(t,!1),e}function ff(e){const t=df(e),n=e==="low",o=[],a=P0-2*Do,s=1.25,r=5,i=.42,c=n?24:64;for(let x=0;x<r;x++){const g=(x+.5)*Math.PI*2/r+.3,y=Math.PI/r-i/a/2,b=Math.PI/r-i/s/2,z=Math.max(4,c>>2),k=[];for(let I=0;I<=c;I++){const P=g-y+2*y*I/c;k.push([Math.cos(P)*a,Math.sin(P)*a])}for(let I=0;I<=z;I++){const P=g+b-2*b*I/z;k.push([Math.cos(P)*s,Math.sin(P)*s])}o.push({pts:k,bevel:tr,cav:.4})}o.push({pts:Array.from({length:40},(x,g)=>[Math.cos(g/40*Math.PI*2)*.32,Math.sin(g/40*Math.PI*2)*.32]),bevel:.015,cav:.5});const l=Li({pts:t.pts,cavAt:t.cav,edgeAt:t.edge,sharp:40},o,yo,tr);l.computeBoundingSphere();const d=$c(e).filter(x=>x.h>b0-.015+1e-4&&x.x>-m0/2-1e-4),u=b0-.015,f=[{x:-m0/2,h:u,cav:0,edge:0},...d,{x:0,h:Do,cav:0,edge:1},...d.slice().reverse().map(x=>({...x,x:-x.x})),{x:m0/2,h:u,cav:0,edge:0}],p=f.map(x=>{const g=P0+x.h,y=N0+x.x/oo;return[Math.cos(y)*g,Math.sin(y)*g]}),m=Li({pts:p,cavAt:f.map(x=>x.cav),edgeAt:f.map(x=>x.edge),sharp:40},[],yo,tr),h=m.getAttribute("position"),v=m.getAttribute("normal"),M=new R,w=new R;for(let x=0;x<h.count;x++)M.set(h.getX(x),h.getY(x),h.getZ(x)),w.set(v.getX(x),v.getY(x),v.getZ(x)),Ur(M,w),h.setXYZ(x,M.x,M.y,M.z),v.setXYZ(x,w.x,w.y,w.z);return h.needsUpdate=v.needsUpdate=!0,m.computeBoundingSphere(),{geo:l,piece:m,O:t}}const Sr=8,Ii=1.6*m0,kr=4*yo,fa=.62,qa=.2;function pf(e){const t=e==="low",n=t?3:5,o=t?2:4,a=t?6:14,s=Math.PI*2/Sr,r=Ii/2,i=.035,c=[],l=[],d=[],u=[],f=(s*fa-Ii)/2;u.push({x:-r-f,h:0,c:1,e:0});for(let w=0;w<=n;w++){const x=w/n*Math.PI/2;u.push({x:-r-i+i*Math.sin(x),h:i-i*Math.cos(x),c:.8*(1-w/n),e:0})}for(let w=1;w<o;w++)u.push({x:-r,h:i+(qa-i)*w/o,c:0,e:0});for(let w=0;w<=a;w++){const x=w/a*Math.PI/2;u.push({x:-r*Math.cos(x),h:qa+r*Math.sin(x),c:0,e:Uc(.3,1,w/a)})}const p=[...u,...u.slice(0,-1).reverse().map(w=>({...w,x:-w.x}))];p.pop();for(let w=0;w<Sr;w++)for(const x of p){const g=fa+x.h,y=Math.PI+w*s+x.x/g;c.push([Math.cos(y)*g,Math.sin(y)*g]),l.push(x.c),d.push(x.e)}const m=_n({pts:c,cavAt:l,edgeAt:d,sharp:40},[],{t:kr,bevel:.022,segs:t?1:3}),h=kr/2,v=[{r:.001,y:-h-1.2},{r:.22,y:-h-1.2},{r:.22,y:-h-.02},{r:.22,y:h+.02},...ii(.22,h+.34,.33,h+.4,.025),{r:.33,y:h+.46},...ii(.33,h+.5,.22,h+.53,.02),{r:.22,y:h+5},{r:.001,y:h+5}],M=Wt(v,t?32:72);return{geo:m,arb:M,pts:c}}function hf(e,t){const n=new R,o=[],a=[];e.pts.forEach((u,f)=>{e.tooth[f]===0&&e.h[f]>j0&&(n.set(u[0],yo/2,u[1]),Ur(n),o.push([n.x-oo,n.z])),e.tooth[f]===1&&e.h[f]>j0&&a.push([u[0]-oo,u[1]])});const s=t.filter(u=>u[0]<-fa),r=(u,f,p)=>{let m=1e9,h=[0,0],v=[0,0];for(const M of s)for(const w of p){const x=Math.hypot(M[0]+u-w[0],M[1]+f-w[1]);x<m&&(m=x,h=[M[0]+u,M[1]+f],v=w)}return{d:m,a:h,b:v}},i=-.035;let c=fa+qa+m0*1.6+.4,l=r(c,i,o);for(;c>0&&(l=r(c,i,o),!(l.d<.004));c-=.002);const d=r(c,i,a);return{cx:c,cz:i,contact:new R((l.a[0]+l.b[0])/2,0,(l.a[1]+l.b[1])/2),clear:d.d}}const jc=`
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
`,mf=`
attribute vec3 iA;
attribute vec3 iB;
attribute vec4 iR;
attribute vec4 iS;
${jc}
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
`,vf=`
attribute vec3 iA1;
attribute vec3 iB1;
attribute vec3 iA2;
attribute vec3 iB2;
attribute vec4 iW;
${jc}
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
`,gf=`
varying vec3 vWeb;
varying float vTear;
float loH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float loN2(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(loH(i), loH(i + vec2(1.0, 0.0)), f.x), mix(loH(i + vec2(0.0, 1.0)), loH(i + vec2(1.0, 1.0)), f.x), f.y);
}
`;function xf(e,t){const n=[],o=[];for(let s=0;s<2;s++){const r=n.length/3;for(let c=0;c<=e;c++)for(let l=0;l<t;l++)n.push(c/e,l/t*Math.PI*2,s);const i=n.length/3;n.push(1.01,0,s);for(let c=0;c<e;c++)for(let l=0;l<t;l++){const d=r+c*t+l,u=r+c*t+(l+1)%t,f=d+t,p=u+t;o.push(d,u,f,u,p,f)}for(let c=0;c<t;c++){const l=r+e*t+c,d=r+e*t+(c+1)%t;o.push(l,d,i)}}const a=new Ua;return a.setAttribute("position",new wt(n,3)),a.setIndex(o),a}function wf(e,t){const n=[],o=[];for(let s=0;s<=e;s++)for(let r=0;r<=t;r++)n.push(s/e,r/t,0);for(let s=0;s<e;s++)for(let r=0;r<t;r++){const i=s*(t+1)+r,c=i+t+1;o.push(i,c,i+1,i+1,c,c+1)}const a=new Ua;return a.setAttribute("position",new wt(n,3)),a.setIndex(o),a}function Ei(e,t,n,o,a,s){const r=e.onBeforeCompile;return e.onBeforeCompile=(i,c)=>{r.call(e,i,c),Object.assign(i.uniforms,t,{uLoPxH:pa}),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${n}`).replace("#include <beginnormal_vertex>",`${o}
vec3 objectNormal = loN;
#ifdef USE_TANGENT
vec3 objectTangent = vec3(1.0, 0.0, 0.0);
#endif`).replace("#include <begin_vertex>","vec3 transformed = loP;"),s&&(i.fragmentShader=s(i.fragmentShader))},e.customProgramCacheKey=()=>a,e}function yf(e){const t=e.q==="low",n={uT:{value:0},uK:{value:0},uPO:{value:new R},uPD:{value:new R(0,0,-1)},uLean:{value:1}},o=new zt,a=xf(t?28:64,t?6:10),s=e.strands.length,r=new Float32Array(s*3),i=new Float32Array(s*3),c=new Float32Array(s*4),l=new Float32Array(s*4),d=(w,x)=>{r.set([x.a.x,x.a.y,x.a.z],w*3),i.set([x.b.x,x.b.y,x.b.z],w*3),c.set([x.r,x.sag??x.a.distanceTo(x.b)*.12,x.ph??0,x.rate??1],w*4),l.set([x.nk??.5,x.beads??6,x.seed??0,x.still?1:0],w*4)};e.strands.forEach((w,x)=>d(x,w));const u={iA:new Tn(r,3),iB:new Tn(i,3),iR:new Tn(c,4),iS:new Tn(l,4)};for(const[w,x]of Object.entries(u))x.setUsage(ac),a.setAttribute(w,x);a.instanceCount=s;const f=Ei(ao({env:e.env??5}),n,mf,"loStrand();","ss-liveoil-strand"),p=new ot(a,f);p.frustumCulled=!1,o.add(p);let m=null;if(e.webs.length){const w=wf(t?18:40,t?8:18),x=e.webs.length,g=new Float32Array(x*3),y=new Float32Array(x*3),b=new Float32Array(x*3),z=new Float32Array(x*3),k=new Float32Array(x*4),I=new Float32Array(x);e.webs.forEach((C,S)=>{g.set(C.a1.toArray(),S*3),y.set(C.b1.toArray(),S*3),b.set(C.a2.toArray(),S*3),z.set(C.b2.toArray(),S*3),k.set([C.sag??.2,C.sagW??.15,C.ph??0,C.rate??1],S*4),I[S]=C.seed??S*7.3}),w.setAttribute("iA1",new Tn(g,3)),w.setAttribute("iB1",new Tn(y,3)),w.setAttribute("iA2",new Tn(b,3)),w.setAttribute("iB2",new Tn(z,3)),w.setAttribute("iW",new Tn(k,4)),w.setAttribute("iSeed",new Tn(I,1)),w.instanceCount=x;const P=ao({env:(e.env??5)*1.6});P.side=M0,Ei(P,n,`${vf}
attribute float iSeed;
varying float vSeed;`,`loWeb();
vSeed = iSeed;`,"ss-liveoil-web",C=>C.replace("#include <common>",`#include <common>
${gf}
varying float vSeed;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{
  vec2 q = vWeb.xy * vec2(7.0, 3.2) + vec2(vSeed, vSeed * 1.7);
  float nz = loN2(q) * 0.65 + loN2(q * 2.3 + 4.1) * 0.35;
  float edge = min(vWeb.y, 1.0 - vWeb.y) * 2.0;
  float hold = smoothstep(0.0, 0.16, edge);
  if (nz * (0.55 + 0.6 * edge) < vTear * 0.62 && hold > 0.5) discard;
  if (vTear > 1.25 && edge > 0.05) discard;
}`)),m=new ot(w,P),m.frustumCulled=!1,o.add(m)}function h(w,x,g,y=1){n.uT.value=w,n.uK.value=x,n.uPO.value.copy(g.origin),n.uPD.value.copy(g.direction),n.uLean.value=y}function v(w,x){d(w,x)}function M(){for(const w of Object.values(u))w.needsUpdate=!0}return{group:o,strands:p,webs:m,uniforms:n,update:h,moveStrand:v,commit:M,material:f}}function bf(e){const t=[],n=e>2?28:14;t.push(new Ft(0,-.05)),t.push(new Ft(1.18,-.02));for(let a=0;a<=n;a++){const s=a/n*Math.PI/2;t.push(new Ft(Math.cos(s)*1,.12+Math.sin(s)*.85))}const o=new sc(t.map(a=>new Ft(Math.max(a.x,.001),a.y)),e>2?72:22);return o.computeVertexNormals(),o}const en=(e=0,t=0,n=0)=>new R(e,t,n),d0=fe.findIndex(e=>e.id==="4"),Mf=[[0,1],[.9,1],[2.4,1],[3.3,.6],[3.9,1]];function Sf(){const e={uGlow:{value:0}},t=new In({color:328708,side:M0,vertexColors:!0});return t.onBeforeCompile=n=>{n.uniforms.uGlow=e.uGlow,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGlow;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0 + uGlow;`)},{m:t,u:e}}function Di(e,t,n){const o=[],a=[];e.forEach((r,i)=>{const c=e[Math.min(e.length-1,i+1)].clone().sub(e[Math.max(0,i-1)]).normalize(),l=c.cross(n).normalize(),d=t*.5*(i===0||i===e.length-1?.35:1);o.push(r.x+l.x*d,r.y+l.y*d,r.z+l.z*d,r.x-l.x*d,r.y-l.y*d,r.z-l.z*d),i&&a.push(2*i-2,2*i-1,2*i,2*i-1,2*i+1,2*i)});const s=new Gn;return s.setAttribute("position",new wt(o,3)),s.setIndex(a),s}const G0=(e,t,n)=>{const o=Ge((n-e)/(t-e));return o*o*(3-2*o)},I0=e=>[],Kc=typeof location<"u"?new URLSearchParams(location.search):null,Yc=Kc?.get("form4d")==="1",Ao=Kc?.get("form4")==="1"||Yc;function kf(e){const{kit:t}=e,n=t.q,o=n==="low",a=new zt,s=new zt,r=new zt;a.add(s),s.add(r),r.position.copy(Hl),r.rotation.y=Math.atan2(-ei.z,ei.x);const i=ut(404),c=Ao?new Io({color:8026746,roughness:.5,metalness:0}):null;if(Ao){const T=fe[d0],le=(re,se,ye)=>(r.updateMatrixWorld(),en(re,se,ye).applyMatrix4(r.matrixWorld).toArray());T.light.haze=0,T.light.red.power=0,T.light.blade.from=le(-6,10,9),T.light.blade.to=le(0,0,0),T.light.blade.angle=.6,T.light.blade.pen=0,T.light.blade.power=15,T.sharp=[.02,50]}const l=(T,le)=>{const re=new ot(T,c??bn({tier:n,...le}));return re.castShadow=!o,re.receiveShadow=!o,re},d={value:new vn(0,1,0,0)},u={value:new vn(0,1,0,0)},f={value:new vn(0,1,0,0)},p=en(),m=en(...fe[d0].light.blade.from).sub(en(...fe[d0].light.blade.to)).normalize(),h=ff(n),v={finish:"turned",seed:41,age:0,wear:.08,tone:.8,direct:.3,objScale:2,envMap:.07,turn:[2.2,.005,.25],line:[0,0],lineU:{value:new Ft(1.6,P0+.25)},rim:d},M=l(h.geo,v),w=l(h.piece,{...v,turn:[2.2,.005,.06],seed:I0()[8]??45,wear:0,direct:I0()[6]??.55,tone:I0()[7]??.9}),x=new zt;x.position.set(-oo,0,0),x.add(M,w),r.add(x);const g=new zt;x.add(g);const y=(T,le,re)=>{const se=P0+le,ye=N0+T/oo;return en(Math.cos(ye)*se,re,Math.sin(ye)*se)},b=(T,le,re,se=0)=>{const ye=P0+le,Pe=N0+se*sa+T/oo,Je=en(Math.cos(Pe)*ye,re,Math.sin(Pe)*ye);return se===0?Ur(Je):Je},z=pf(n),k=hf(h.O,z.pts),I=.12,P=l(z.geo,{finish:"turned",seed:42,age:0,wear:0,bump:I0()[0]??.15,tone:.6,direct:.4,envMap:1.8,rim:u,objScale:2,turn:[2.2,.005,.25],line:[.8,0]}),C=l(z.arb,{finish:"polished",seed:43,age:.2,wear:.3,tone:.3,direct:.3,envMap:.6}),S=new zt;S.position.set(k.cx,yo/2+.02-kr/2-I,k.cz),S.add(P,C),r.add(S),k.contact.clone().add(en(oo,0,0));const F=I0(),W=new Map;Os(()=>{const T=[...W],le=new Map;W.clear();for(const[re,se]of T)le.set(re,A(se.list)),se.rt.dispose();md(e.scene,le)});const A=T=>{const le=new ca;le.background=new an(0);const re=en(...fe[d0].pose.pos).sub(en(...fe[d0].pose.look));re.y=0,re.normalize();for(const[Pe,Je,et,Ct,pt]of T){const vt=Fa.degToRad(Pe),bt=en(re.x*Math.cos(vt)-re.z*Math.sin(vt),0,re.x*Math.sin(vt)+re.z*Math.cos(vt)),It=new ot(new h0(Je,et),new In({color:new an(.62,.62,.6).multiplyScalar(pt),side:M0}));It.position.copy(bt).multiplyScalar(6).setY(Ct),It.lookAt(0,0,0),le.add(It)}const se=new nc(e.renderer),ye=se.fromScene(le,.01);return se.dispose(),W.set(ye.texture,{list:T,rt:ye}),ye.texture},B=I0(),oe=A([[F[0]??-35,F[1]??.6,F[7]??7,F[6]??-4,F[2]??6],[B[0]??180,B[1]??8,B[2]??.8,B[3]??2.8,B[4]??.03]]),ie=I0(),U=A([[ie[0]??-15,ie[1]??24,ie[2]??8,ie[3]??-3.5,ie[4]??1]]),O=(T,le,re)=>{const se=T.onBeforeCompile,ye=T.customProgramCacheKey.bind(T);T.onBeforeCompile=(Pe,Je)=>{se.call(T,Pe,Je),Pe.fragmentShader=Pe.fragmentShader.replace("roughnessFactor = clamp(ssRough, 0.04, 1.0);",`roughnessFactor = clamp(ssRough * ${le.toFixed(3)}, 0.02, 1.0);`)},T.customProgramCacheKey=()=>ye()+re};if(!Ao){const T=P.material;O(T,F[5]??.4,"-b4"),T.envMap=oe,T.envMapIntensity=F[3]??5;const le=C.material;le.envMap=oe,le.envMapIntensity=F[4]??.25;const re=w.material;re.envMap=U,re.envMapIntensity=ie[5]??.6}const D=yo/2,E=en(0,1,0),N=m0/2,V=T=>{let le=b0-.015,re=b0+.2;for(let se=0;se<30;se++){const ye=(le+re)/2;b(T,ye,D).y<D?le=ye:re=ye}return re},K=V(0),j=Array.from({length:22},(T,le)=>{const re=-N+.004+(m0-.008)*le/21;return b(re,V(re)+.002,D+8e-4)}),me=new ot(Di(j,.0022,E),new In({color:new an(1.6,1.57,1.5),side:M0}));g.add(me);const xe=Sf(),Me=[];for(let T=0;T<5;T++){const le=[.04,-.01,.015,-.05,-.075][T],re=[.04,.03,.046,.026,.034][T],se=[.008,-.01,.004,-.006,.01][T],ye=[],Pe=[];for(let Ct=0;Ct<14;Ct++){const pt=Ct/13,vt=le+se*pt+Math.sin(pt*7+T*2)*.0015+(i()-.5)*8e-4,bt=b(vt,V(vt),D),It=Math.hypot(bt.x,bt.z)-P0;ye.push(y(vt,It-.0015-re*pt,D+9e-4)),Pe.push(1-pt*.85)}const Je=Di(ye,.0016,E);Je.setAttribute("color",new wt(Pe.flatMap(Ct=>[Ct,Ct,Ct,Ct,Ct,Ct]),3));const et=new ot(Je,xe.m);et.visible=!1,et.renderOrder=2,g.add(et),Me.push(et)}const q=o?4:6,he=(()=>{const T=ut(9),le=[];for(let re=0;re<7;re++){const se=re/7*Math.PI*2,ye=.55+T()*.6;le.push([Math.cos(se)*.018*ye,Math.sin(se)*.011*ye])}return _n({pts:le},[],{t:.0016,bevel:5e-4,segs:1})})(),ce=new Fn(he,bn({tier:n,finish:"polished",seed:47,tone:.1,age:0,direct:.6,wear:0,envMap:.25,rim:f}),q),ue=[];{b(N+.01,b0+.08,0).sub(b(N,b0+.08,0)).normalize();for(let T=0;T<q;T++){const le=T===q-1,re=K+.008+T/q*.1+i()*.008,se=.006+i()*.03,ye=b(N-se,re,D+.0012).add(en(0,le?.03:i()*.003,0)),Pe=b(N-se,re,D+.01).sub(b(N-se,re,D)).normalize(),Je=new Xt().setFromUnitVectors(en(0,1,0),Pe).multiply(new Xt().setFromEuler(new Kn(.3+i()*.5+(le?.9:0),i()*6.3,(i()-.5)*.3,"YXZ")));ue.push({p:ye,r:Je,s:.9+i()*.6,loose:le})}}g.add(ce);const Ae=new ot(bf(o?2:3),ao({env:1.4})),we=I0(),De=we[0]??.3,Ve=D-I+(we[2]??.01);Ae.position.copy(b(N+(we[1]??.01),De,Ve));const Ke=b(N,De+.05,Ve).sub(b(N,De-.05,Ve)).normalize();Ae.scale.set(we[3]??.04,we[4]??.026,we[5]??.028),Ae.rotation.set(0,-Math.atan2(Ke.z,Ke.x)+(we[6]??Math.PI/2),Math.PI/2);const Xe=Ae.scale.clone(),Ce=new ot(new oc(new No(Array.from({length:9},(T,le)=>{const re=-.72+1.44*le/8,se=I0()[0]??-.4;return en(re,Math.sqrt(Math.max(0,1-re*re-se*se))*1.02,se)})),16,I0()[1]??.06,4),new In({color:new an(.62,.61,.58)}));Ae.add(Ce),g.add(Ae);const rt=[{a:b(N+.02,De-.03,Ve+.012),b:b(N+.1,De-.13,D-I+.001),r:.0032,sag:.02,ph:.15,rate:1,nk:.5,beads:3,seed:1},{a:b(N+.012,De+.03,Ve+.014),b:b(N+.001,De+.13,D-.03),r:.0022,sag:.015,ph:.3,rate:1,nk:.5,beads:4,seed:2}],st=yf({strands:rt,webs:[],q:n,env:1.2});g.add(st.group),Ao&&!Yc&&(g.visible=!1);const Te=o?30:70,Fe=new Fn(new Rs(.004,0),bn({tier:n,finish:"blackened",seed:48,tone:.3,age:.5,direct:.6}),Te);Fe.frustumCulled=!1,s.add(Fe);const ae=Array.from({length:Te},()=>[(i()-.5)*.5,.25+i()*.5,(i()-.5)*.5,.5+i()]),Y=o?14:30,J=new Fn(new Rs(1,1),bn({tier:n,finish:"blackened",seed:49,tone:.6,age:.4,direct:1}),Y);J.frustumCulled=!1,a.add(J);const pe=Array.from({length:Y},()=>[(i()-.5)*2.2,i()*1.2,1+i()*2.5,.0015+i()*i()*.006,.6+i()*.8]),Se={uGain:{value:.2},uAng:{value:-.75}},Ee=new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:Se,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uAng; varying vec2 vUv;
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
}`}),He=new ot(new h0(5.5,3.6),Ee);He.position.set(.2,.1,-5),He.renderOrder=4,He.frustumCulled=!1,r.add(He);const ct={uGain:{value:0},uT:{value:0}},mt=new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:ct,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; varying vec2 vUv;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 q = vUv * vec2(1.6, 1.0) + vec2(uT * 0.05, 0.0);
  float n = 0.5 * vn(q * 2.1) + 0.3 * vn(q * 4.7 + 3.1) + 0.2 * vn(q * 9.3 + 7.7);
  vec2 bq = (vUv - vec2(0.15, 0.35)) * vec2(1.0, 1.5); float body = exp(-dot(bq, bq));
  float e = body * smoothstep(0.32, 0.8, n);
  gl_FragColor = vec4(vec3(0.62, 0.035, 0.02) * e * uGain, 0.0);
}`}),ht=new ot(new h0(1,1),mt);ht.renderOrder=4,ht.frustumCulled=!1,ht.visible=!1,a.add(ht);const xt={uGain:{value:0},uC:{value:new Ft(.18,-.12)}},yt=new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:xt,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform vec2 uC; varying vec2 vUv;
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
}`}),$=new ot(new h0(1,1),yt);$.renderOrder=4,$.frustumCulled=!1,$.visible=!1,a.add($);const L=I0(),Q=new Xt,ee=en(),be=en(),Le=[];for(let T=-6;T<=6;T++){Le.push({w:0,p:en(Math.cos(N0+T*sa)*(P0+Do-.05),D,Math.sin(N0+T*sa)*(P0+Do-.05))});const le=Math.PI+T*Math.PI*2/Sr;Le.push({w:1,p:en(Math.cos(le)*(fa+qa),0,Math.sin(le)*(fa+qa))})}Ao&&(He.visible=!1,Fe.visible=!1);const Re=new ge,ve=new Xt,_e=new Xt,Ue=new Kn,Ne=en(),Qe=new Fr,_=en(),te=en(),Z=en(),qe=en(),Be=en(),ze=x.rotation.y,We=S.rotation.y;return{group:a,update(T){if(a.visible=T.i>=d0-1&&T.i<=d0+1,!a.visible)return;const le=T.trick("4"),re=le.k;T.camera.getWorldPosition(Ne),_.set(T.state.pointer.x*2-1,1-T.state.pointer.y*2,.5).unproject(T.camera),Qe.origin.copy(Ne),Qe.direction.copy(_).sub(Ne).normalize();const se=le.phase*8;let ye=0,Pe=0,Je=9;if(re>0)for(const[dt,sn]of Mf)se>=dt&&(ye++,Je=se-dt,Pe=sn*Math.exp(-Je*7));const et=le.rare,Ct=et>=0&&et<.55,pt=et>=.55?Math.exp(-(et-.55)*4*9):0,vt=et>=.55?(et-.55)*4:9;Ct&&(Pe=0);const bt=re>0?Math.min(5,ye+(et>=.55?1:0)):0;Me.forEach((dt,sn)=>dt.visible=sn<bt),me.visible=bt===0,xe.u.uGlow.value=re*(.55+.45*Pe),xe.m.color.setRGB(.02+.98*re*(.7+.3*Pe),.02*(1-re)+.012*re,.02*(1-re)+.01*re);let It=Le[0],Qt=1e9;for(const dt of Le){te.copy(dt.p).applyMatrix4((dt.w?P:M).matrixWorld);const sn=Qe.distanceSqToPoint(te);sn<Qt&&(Qt=sn,It=dt)}const tn=Pe*re*(It.w===0?1:.5)*.0022,dn=Pe*re*(It.w===1?1:.5)*.0022;x.rotation.y=ze+tn*Math.sin(Je*70),S.rotation.y=We-dn*1.27*Math.sin(Je*70+.6),te.copy(It.p).applyMatrix4((It.w?P:M).matrixWorld);for(let dt=0;dt<Te;dt++){const sn=re>0&&Je<1.4&&!Ct,gn=Je*ae[dt][3];if(!sn){Re.makeScale(0,0,0),Fe.setMatrixAt(dt,Re);continue}const nn=te.clone().add(en(ae[dt][0]*gn,ae[dt][1]*gn-1.6*gn*gn,ae[dt][2]*gn)).sub(s.position);Re.compose(nn,ve.setFromEuler(Ue.set(dt,dt*2,gn*9)),en(1,1,1).multiplyScalar(.6+.8*(dt*7%5)/5)),Fe.setMatrixAt(dt,Re)}Fe.instanceMatrix.needsUpdate=!0,ue.forEach((dt,sn)=>{const gn=dt.loose?Pe*re*.03:Pe*re*.004;Re.compose(dt.p.clone().add(en(0,gn,0)),ve.copy(dt.r).multiply(_e.setFromAxisAngle(en(1,0,0),gn*20)),en(dt.s,dt.s,dt.s)),ce.setMatrixAt(sn,Re)}),ce.instanceMatrix.needsUpdate=!0,Ae.scale.set(Xe.x*(1+Pe*re*.2),Xe.y*(1-Pe*re*.12),Xe.z*(1+Pe*re*.06)),st.update(le.phase,re*.6,Qe,.5),p.copy(m).transformDirection(T.camera.matrixWorldInverse),d.value.set(p.x,p.y,p.z,.5*(T.i===d0+1&&!T.inHold&&T.camera.aspect<1?1-G0(.22,.34,T.u):1)),u.value.set(p.x,p.y,p.z,0),f.value.set(p.x,p.y,p.z,2.5);{const dt=T.i===d0&&!T.inHold,sn=dt?Math.sin(Math.PI*Ge(T.u/.9))*(1-G0(.42,.62,T.u)):0;if(ht.visible=sn>.01,ht.visible){T.camera.getWorldQuaternion(Q),ee.set(0,0,-1).applyQuaternion(Q);const gn=22,nn=2*gn*Math.tan(Fa.degToRad(T.camera.fov)/2)*1.15;ht.position.copy(Ne).addScaledVector(ee,gn),ht.quaternion.copy(Q),ht.scale.set(nn*T.camera.aspect,nn,1),ct.uGain.value=.55*sn/Math.sqrt(Ns(T.i,T.u,T.inHold))}}{const dt=T.i===d0?T.inHold?1:G0(.75,1,T.u):T.i===d0+1&&!T.inHold?1-G0(0,.35,T.u):0;if($.visible=dt>.01&&!Ao,$.visible){T.camera.getWorldQuaternion(Q),ee.set(0,0,-1).applyQuaternion(Q),S.getWorldPosition(be);const sn=Ne.distanceTo(be)+(L[0]??3),gn=2*sn*Math.tan(Fa.degToRad(T.camera.fov)/2)*1.1;$.position.copy(Ne).addScaledVector(ee,sn),$.quaternion.copy(Q),$.scale.set(gn*T.camera.aspect,gn,1),xt.uGain.value=(L[1]??.72)*dt*(1+.25*re);const nn=T.camera.aspect<1;xt.uC.value.set(L[2]??(nn?.5:.15),L[3]??(nn?-.25:-.05))}}const Yn=T.i===d0+1&&!T.inHold?1-(T.camera.aspect<1?G0(.08,.3,T.u):G0(.15,.55,T.u)):T.i===d0&&!T.inHold&&T.camera.aspect<1?1-.8*G0(.4,.55,T.u)*(1-G0(.85,1,T.u)):1,io=T.i===d0&&!T.inHold&&T.camera.aspect>=1?1-.85*G0(.45,.6,T.u)*(1-G0(.88,1,T.u)):1;if(He.lookAt(Ne),Se.uGain.value=(T.camera.aspect<1?L[4]??.33:.58)*(1+.1*re)*Yn*io,He.visible=!Ao&&Yn>.001,s.position.set(0,0,0),pt>.001){const dt=pt*.025;s.position.set(Math.sin(vt*61)*dt,Math.sin(vt*47+1)*dt*.7,Math.sin(vt*53+2)*dt*.5)}if(J.visible=et>=.55,J.visible){Z.set(0,0,-1).transformDirection(T.camera.matrixWorld),qe.set(1,0,0).transformDirection(T.camera.matrixWorld),Be.set(0,1,0).transformDirection(T.camera.matrixWorld);for(let dt=0;dt<Y;dt++){const[sn,gn,nn,Un,bo]=pe[dt],G=1.2+gn*.5-vt*bo*1.8,de=Ne.clone().addScaledVector(Z,nn).addScaledVector(qe,sn*nn*.18).addScaledVector(Be,G*nn*.102);Re.compose(de,ve.setFromEuler(Ue.set(dt,vt*3,dt*3)),en(Un,Un*.6,Un)),J.setMatrixAt(dt,Re)}J.instanceMatrix.needsUpdate=!0}}}}const yn=Ko+.02,Pa={glow:1,lit:.6,node:4,body:.05,crack:.12},zf=2,Pf=.7,Af=.65,Rf=.1,Cf=.1,Tf=.12,Ff=.12,_f=10,Lf=6,If=4,nr=[.865,1.056,1.9],Ef=1.4,Df=.012,Nf=4.2,Ni=[20,10],Ot=(e,t,n)=>new R(e,t,n),co=Math.PI*2,Wi=12.6,Ro=4.8,Hi=-38.5,Uo=[{x:-2.7,z:-3.5,r:.9,kind:"pillar"},{x:-2.3,z:-8.6,r:.62,kind:"arbor"},{x:-1.6,z:-13.9,r:.85,kind:"pillar",h:11.4},{x:-.6,z:-19.2,r:.8,kind:"pillar",h:12.2},{x:-.2,z:-24.8,r:.6,kind:"arbor",h:13.4},{x:.7,z:-30.1,r:.78,kind:"pillar"},{x:1.2,z:-35.4,r:.55,kind:"arbor",h:11.8},{x:12.3,z:-1.2,r:.72,kind:"arbor"},{x:12,z:-6.7,r:.95,kind:"pillar"},{x:11.4,z:-12.3,r:.66,kind:"arbor",h:13.6},{x:10.7,z:-17.6,r:.9,kind:"pillar",h:11.2},{x:10,z:-23.3,r:.62,kind:"arbor"},{x:9.2,z:-28.6,r:.8,kind:"pillar",h:5.6,snapped:!0},{x:8.6,z:-33.9,r:.58,kind:"arbor"},{x:1.75,z:-4.6,r:.42,kind:"arbor"},{x:-1.4,z:-7.6,r:.5,kind:"arbor"}],Bi=[{c:2,y:6.3,r:2.3,n:64,rx:.55,rz:-.3,fold:.9,sheared:3,dx:2.4,dz:.4},{c:3,y:7.3,r:2.6,n:84,rx:.42,rz:.2,dx:1.6},{c:4,y:7.2,r:3.8,n:110,rx:.3,rz:-.12,dx:1.6},{c:5,y:8.4,r:3,n:80,rx:-.36,rz:.18,dx:.6},{c:9,y:7.4,r:3.2,n:96,rx:.38,rz:.16,dx:-2},{c:10,y:8.2,r:2.9,n:72,rx:-.4,rz:-.22,dx:-.6},{c:11,y:8.8,r:3.4,n:90,rx:.34,rz:.1,dx:-.8},{c:12,y:7.8,r:2.6,n:66,rx:.44,rz:.25,dx:-.4},{c:7,y:4.15,r:1.9,n:64,rx:.42,rz:.32,dx:-5.5,dz:-6.8},{c:15,y:3,r:1.6,n:64,rx:.5,rz:-.22},{c:1,y:11.4,r:3,n:88,rx:.3,rz:.16,dx:2.4},{c:9,y:12.2,r:3.3,n:92,rx:-.3,rz:-.18,dx:-2.4}];function Wf(e){const{kit:t}=e,n=t.q,o=Ho(n),a=new zt,s=ut(55),[r,i,c]=Ca,l={value:new vn(0,1,0,0)},d={value:new vn(0,1,0,0)},u=($,L,Q,ee=!0)=>{const be=bn({tier:n,...L}),Le=new ot($,be);return Q&&Le.applyMatrix4(Q),Le.castShadow=ee&&n!=="low",Le.receiveShadow=n!=="low",Le.castShadow,Le},f=($,L,Q={},ee=!1,be=1)=>{for(const Le of $.inst){if(!Le.mats.length)continue;const Re=bn({finish:Le.finish,seed:Le.seed,tier:n,...Q}),ve=new Fn(Le.geo,Re,Le.mats.length);Le.mats.forEach((_e,Ue)=>ve.setMatrixAt(Ue,be===1?_e:_e.clone().multiply(new ge().makeScale(be,be,be)))),ve.instanceMatrix.needsUpdate=!0,ve.computeBoundingSphere(),ve.castShadow=ee&&n!=="low",ve.receiveShadow=n!=="low",L.add(ve)}},p=ro(),m=new h0(90,90,1,1);m.rotateX(-Math.PI/2);const h=new zn({uniforms:{tDiffuse:{value:null},textureMatrix:{value:new ge},tNz:{value:p.noise},uHas:{value:n==="low"?0:1},uTexel:{value:new Ft(1/1024,1/1024)},uNearF:{value:0},uNearK:{value:0},uCamP:{value:new R},uGain:{value:2.6},uRuby:{value:new R},uStreak:{value:0},tDepth:{value:null},uPI:{value:new ge},uVW:{value:new ge},uOil:{value:yn},uHR:{value:new Ft(5,.8)}},vertexShader:`
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
uniform float uNearK;
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
    col = acc * fres * exp(-h / uHR.x) * (uNearF > 0.0 ? mix(1.0, smoothstep(uNearF, uNearF + 1.5, dist), uNearK) : 1.0);
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
}`});let v,M=new Io;const w={value:new Ft};let x=null;if(n!=="low"){x=new Wo(m,{textureWidth:n==="high"?1792:1024,textureHeight:n==="high"?896:512,clipBias:.003,multisample:0});const $=x.material;h.uniforms.tDiffuse.value=x.getRenderTarget().texture,x.getRenderTarget().depthTexture=new Ji(x.getRenderTarget().width,x.getRenderTarget().height),h.uniforms.tDepth.value=x.getRenderTarget().depthTexture;const L=x.onBeforeRender,Q=x.camera;x.onBeforeRender=(...ee)=>{const be=ee[1],Le=be.environmentIntensity;be.environmentIntensity=Ff,M.envMap=be.environment;const Re=w.value.x;w.value.x=0,L.apply(x,ee),w.value.x=Re,be.environmentIntensity=Le,h.uniforms.uPI.value.copy(Q.projectionMatrix).invert(),h.uniforms.uVW.value.copy(Q.matrixWorld)},h.uniforms.textureMatrix=$.uniforms.textureMatrix,x.material=h,v=x}else v=new ot(m,h);const g=h.uniforms.uGain.value;v.position.set(r,yn,c-8),a.add(v);const y=new zt;a.add(y);const b=[],z=[];Uo.forEach(($,L)=>{const Q=$.h??Wi*(.94+s()*.12);if(z.push(yn+Q),$.kind==="pillar"){const ee=bc({h:Q,r:$.r,detail:o});y.add(u(ee,{finish:"turned",seed:100+L,age:.55,tone:.42,rim:l},new ge().makeTranslation($.x,yn-.25,$.z)));const be=Wt([{r:$.r*1.9,y:0},{r:$.r*1.35,y:.02,smooth:!0},{r:$.r*1.08,y:.09,smooth:!0},{r:$.r*1,y:.2,smooth:!0},{r:$.r*.99,y:.2}],o?40:16);be.translate($.x,yn,$.z),b.push(be)}else{const ee=$.r*.42,be=La({length:Q,ra:ee,leaves:8+L%5,pinionR:$.r*1.25,pinionH:Q*.14,pinionAt:Q*(.16+s()*.1),seatAt:Q*.55,detail:o,seed:200+L});y.add(u(be.geo,{finish:"turned",seed:200+L,age:.5,tone:.42,rim:l},new ge().makeTranslation($.x,yn-.02,$.z)));const Le=Wt([{r:ee*3.4,y:0},{r:ee*2.2,y:.015,smooth:!0},{r:ee*1.35,y:.06,smooth:!0},{r:ee*1.02,y:.16,smooth:!0},{r:ee,y:.16}],o?32:12);Le.translate($.x,yn,$.z),b.push(Le);const Re=os({R:ee*2.6,rIn:ee*.26,phase:s(),detail:o});Re.translate($.x,yn,$.z),b.push(Re)}if($.snapped){const ee=La({length:Wi*.55,ra:$.r*.42,leaves:10,pinionR:$.r*1.25,pinionH:1.4,pinionAt:1.2,seatAt:4.5,detail:o,seed:290}),be=new ge().compose(Ot($.x+1.2,yn+.2,$.z-.6),new Xt().setFromEuler(new Kn(-.25,.2,-.62)),Ot(1,1,1));y.add(u(ee.geo,{finish:"turned",seed:291,age:.75,tone:.42,rim:l},be))}});const k=new zt;a.add(k);const I=[];Bi.forEach(($,L)=>{const Q=Uo[$.c],ee=so({teeth:$.n,r:$.r,profile:"train",spokes:5,rim:.08,hub:.14,hole:Q.r*.44,detail:o,seed:300+L,sheared:$.sheared??(L%3===0?1:0),fold:$.fold,foldAt:$.fold?.5:void 0,snapped:L===3}),be=u(ee,{finish:"sunray",seed:300+L,age:.66,tone:L===0?.3:.45,direct:L===0?Tf:1,rim:L===0?d:l});be.position.set(Q.x+($.dx??0),yn+$.y,Q.z+($.dz??0)),be.rotation.set($.rx,s()*co,$.rz,"XZY"),k.add(be),I.push({mesh:be,n:$.n,base:be.rotation.y})});const P=new zt;a.add(P);const C=[[Ro+.4,7.7,-5.6,.1,1.05],[Ro-.3,6.4,-17.4,.06,.86],[Ro+.5,7.6,-22.8,-.09,.78],[Ro-.4,6.9,-28.2,.12,.7],[Ro+.2,8.1,-33.4,-.05,.6]];{const $=[],L=[];let Q=null;C.forEach(([ee,be,Le,Re,ve],_e)=>{const Ue=Nr({length:14,width:2.6,t:.7,detail:o,seed:40+_e}),Ne=new ge().compose(Ot(ee,yn+be,Le),new Xt().setFromEuler(new Kn(Math.PI,Re,0)),Ot(ve,ve,ve));$.push(Ue.pieces[0].geo.clone().applyMatrix4(Ne)),Ue.inst.forEach((Qe,_)=>{Q??=Qe.geo,(L[_]??=[]).push(...Qe.mats.map(te=>Ne.clone().multiply(te)))})}),P.add(u(qt($),{finish:"blackened",seed:40,age:.6,tone:.4,wear:.3,rim:l})),Q&&f({inst:[{geo:Q,finish:"blackened",seed:44,mats:L.flat()}]},P,{age:.4,tone:.5})}{const Q=[[-11,0],[11,0],[11,16],[-11,16]],ee=[[-6.5,4.2,.9],[-2,9.5,.5],[3.6,6.2,1.2],[7.4,11,.6],[.8,2.6,.35],[-8.2,12.5,.7]].map(([Re,ve,_e])=>({at:[Re,ve],r:_e,sink:_e*.5})),Le=A0({outline:Q,holes:ee,t:1.2,bevel:.12,detail:o,round:0}).geo.clone();Le.rotateX(-Math.PI/2),P.add(u(Le,{finish:"grained",seed:48,age:.7,tone:.35,wear:.5},new ge().makeTranslation(Ro,yn-.3,Hi)))}const S=vs,F={value:0},W=new zt;W.position.set(r,i,c),a.add(W);const A=S*.5,B=Bu({R:S,screws:16,detail:o,seed:21,staffL:1.5,springR:A}),oe=u(B.pieces[0].geo,{finish:"polished",seed:21,age:Pf,tone:.95,direct:Af,objScale:zf,line:[8,S*.955],lineU:(w.value.set(8,S*.955),w)});M=oe.material;const ie=M.color.clone(),U=M.envMapIntensity;W.add(oe),f({inst:B.inst},W,{age:.2,tone:1.05},!0);const O=W.children.slice(1).map($=>{const L=$.material;return[L,L.color.clone(),L.envMapIntensity]}),D=Br({rOut:A,turns:13,detail:o}),E=u(D.geo,{finish:"blackened",seed:22,twist:F,twistR:A,age:.25,tone:.7});E.position.set(r,i+.14,c),a.add(E);const N=i+.95,V=.42,K=1.38,j=Hu({balanceR:S,h:N-yn,t:.3,table:.32,detail:o,seed:6}),me=new zt;me.position.set(r,N,c),me.rotation.y=-1.04,a.add(me);{const $=j.pieces[0].geo.index?j.pieces[0].geo.toNonIndexed():j.pieces[0].geo,L=-S*.32*1.08,Q=$.attributes.position,ee=Q.count/3,be=_e=>{const Ue=new Gn,Ne={};for(const Qe of Object.keys($.attributes))Ne[Qe]=[];for(let Qe=0;Qe<ee;Qe++)if((Q.getX(3*Qe)+Q.getX(3*Qe+1)+Q.getX(3*Qe+2))/3<L===_e)for(const te of Object.keys($.attributes)){const Z=$.attributes[te];for(let qe=0;qe<3;qe++)for(let Be=0;Be<Z.itemSize;Be++)Ne[te].push(Z.array[(3*Qe+qe)*Z.itemSize+Be])}for(const Qe of Object.keys($.attributes))Ue.setAttribute(Qe,new wt(Ne[Qe],$.attributes[Qe].itemSize));return Ue},Le=u(be(!1),{finish:"striped",seed:6,age:.3,tone:.55});me.add(Le);const Re=da("cock",Le,{at:[nr[0],0,nr[1]],right:[Math.cos(1.04),0,-Math.sin(1.04)],up:[-Math.sin(1.04),0,-Math.cos(1.04)],width:nr[2],depth:.1},e.lang,{tier:n}),ve=globalThis;(ve.__secondWait??=[]).push(Re.ready),me.add(u(be(!0),{finish:"striped",seed:6,age:.5,tone:.55,direct:Rf,wear:.5}))}me.add(u(j.pieces[1].geo,{finish:"polished",seed:7,age:.35}));const xe=u(j.pieces[2].geo,{finish:"polished",seed:8,age:0,tone:1.15});me.add(xe),f({inst:j.inst},me,{age:.4},!0);const Me=Wr({detail:o,seed:8}),q=Ot(...Tl),he=Ot(r,0,c).sub(Ot(q.x,0,q.z)).normalize(),ce=Math.atan2(-he.z,he.x),ue=Me.pieces[1];ue.geo.computeBoundingBox();const Ae=ue.geo.boundingBox.getCenter(Ot(0,0,0)).applyMatrix4(ue.at),we=$=>new ge().compose(q,new Xt().setFromAxisAngle(Ot(0,1,0),ce),Ot(1,1,$?-1:1)),De=Ot(...z0),Ve=Ae.clone().applyMatrix4(we(!0)).distanceTo(De)<Ae.clone().applyMatrix4(we(!1)).distanceTo(De),Ke=new zt;Ke.applyMatrix4(we(Ve)),a.add(Ke),Ke.add(u(Me.pieces[0].geo,{finish:"brushed",seed:9,age:.5}));const Xe=pd(ue.geo,we(Ve).multiply(ue.at),Ot(...x0));if(Xe===1){const $=ue.geo.boundingBox,L=$.getSize(Ot(0,0,0));ue.geo=Hr({L:L.x,w:L.z/2,h:L.y,side:Xe}).geo}const Ce=Bc(ue.geo,Xe),rt=Hc({half:Ce.half,centre:Ce.centre,crack:Ce.crack,node:Ce.node,chipN:Ce.chipN,glow:Pa.glow,lit:Pa.lit,nodeK:Pa.node,body:Pa.body});rt.crack(Pa.crack);const st=new ot(ue.geo,rt);st.applyMatrix4(ue.at),st.onBeforeRender=($,L,Q)=>rt.aim(st,Q),Ke.add(st);const Te=Ae.clone().applyMatrix4(we(Ve));mn.fork.copy(we(Ve)),mn.stone.copy(st.matrix),mn.stoneWorld.copy(Te),mn.stoneGeo=ue.geo,mn.side=Xe;const Fe=Mc({r:pr,detail:o,seed:11,sheared:1}),ae=u(Fe,{finish:"polished",seed:11,age:.5,tone:.8});ae.position.set(...x0);const Y=Math.atan2(-(Te.z-x0[2]),Te.x-x0[0]);ae.rotation.y=Y+.18,mn.escRot=ae.rotation.y,mn.ready=!0,a.add(ae);const J=La({length:3,ra:.12,leaves:7,pinionR:.34,pinionH:.5,pinionAt:.35,seatAt:1,detail:o,seed:12}),pe=u(J.geo,{finish:"turned",seed:12,age:.6},new ge().makeTranslation(x0[0],yn-.02,x0[2]));a.add(pe);const Se=new zt;a.add(Se);{const $=Bi[0],L=Uo[$.c],Q=Ot(L.x+($.dx??0),yn+$.y-.4,L.z+($.dz??0)),ee=Ot(r+.2,i+1.5,c+.4),be=Sc({count:n==="low"?70:170,box:[1,1,1],centre:[0,0,0],seed:51,detail:o}),Le=Wt([{r:.07,y:-.025},{r:.12,y:-.025},{r:.125,y:.02},{r:.07,y:.025},{r:.07,y:-.025}],o?20:10),Re=new go(.7,.045,.07),ve=[be.inst[0],be.inst[3]],_e=ut(53),Ue=new ge,Ne=new Xt,Qe=Ot(1,1,1),_=Ot(0,0,0),te=[{geo:Le,finish:"polished",seed:54,mats:Array.from({length:n==="low"?5:12},()=>new ge)},{geo:Re,finish:"sunray",seed:55,mats:Array.from({length:n==="low"?3:7},()=>new ge)}],Z=[...ve,...te],qe=Ot(0,0,0),Be=Ot(0,0,0),ze=ee.clone().sub(Q).normalize();qe.crossVectors(ze,Ot(0,1,0)).normalize(),Be.crossVectors(qe,ze).normalize();for(const We of Z)We.mats.forEach(T=>{T.decompose(_,Ne,Qe),(We.geo===Le||We.geo===Re)&&Ne.setFromEuler(new Kn(_e()*6.3,_e()*6.3,_e()*6.3));const le=Math.pow(_e(),.75),re=.35+1.5*le,se=_e()*co,ye=Math.sqrt(_e())*re,Pe=Q.clone().lerp(ee,le).addScaledVector(qe,Math.cos(se)*ye*1.3).addScaledVector(Be,Math.sin(se)*ye*.7),Je=(We.geo===Le||We.geo===Re?1:Qe.x)*.42;T.copy(Ue.compose(Pe,Ne,Ot(Je,Je,Je)))});f({inst:Z},Se,{age:.4})}[[7.3,-7,-5.2,-1.2,.3,.9,.7],[1.9,-7.2,-6.6,.6,1.1,.4,.45],[1.4,-9.6,-6.2,1.55,.7,0,.5]].forEach(([$,L,Q,ee,be,Le,Re],ve)=>Se.add(u(Eo({size:ve===1?"large":"medium",detail:o,seed:60+ve,abused:ve===0}),{finish:"blackened",seed:60+ve,age:.4,tone:.8},new ge().compose(Ot($,L,Q),new Xt().setFromEuler(new Kn(ee,be,Le)),Ot(Re,Re,Re)))));{const $=new ia(.05,4);$.rotateX(-Math.PI/2);const L=n==="low"?160:700,Q=[],ee=ut(77),be=[[r-3.5,c+3.5,2.2],[r+6.5,c+1,1.6],[r-1,c-6,2.6],[r+2,c+6.5,1.4]];for(let Le=0;Le<L;Le++){const Re=be[Le%be.length],ve=ee()*co,_e=Math.sqrt(ee())*Re[2]*(.4+ee()*.6),Ue=.4+ee()*ee()*2.2;Q.push(new ge().compose(Ot(Re[0]+Math.cos(ve)*_e*1.4,yn+.004,Re[1]+Math.sin(ve)*_e),new Xt().setFromEuler(new Kn(0,ee()*co,0)),Ot(Ue,1,Ue*(.3+ee()))))}f({inst:[{geo:$,finish:"blackened",seed:78,mats:Q}]},Se,{age:0,tone:.7})}const He=($,L)=>Ot(Uo[$].x,yn+L,Uo[$].z);b.push(qo({a:He(2,7.2),b:He(4,5.9),r:.06,sag:1.6,phase:.45,seed:1,detail:o}),qo({a:He(9,6),b:He(11,8.1),r:.05,sag:1.2,phase:.7,seed:2,detail:o}),qo({a:He(10,3.4),b:Ot(x0[0]+.6,yn+.1,x0[2]-.4),r:.045,sag:.4,phase:.3,seed:3,detail:o}),qo({a:He(4,3.2),b:He(5,6.4),r:.04,sag:.9,phase:.95,seed:4,detail:o}),qu({a:He(11,4),b:He(12,3.2),r:.035,sag:.9,phase:.6,beads:8,detail:o}),qo({a:He(14,4.6),b:Ot(-1.4,yn+6.2,-9.4),r:.05,sag:.8,phase:.35,seed:6,detail:o}));{const $=[],L=[];for(let Q=0;Q<=10;Q++){const ee=Q/10;$.push(He(4,7.4-ee*4.2).add(Ot(.6,0,0))),L.push(He(5,7-ee*3.6).add(Ot(.4,0,.3)))}b.push(Gu($,L,{phase:.55,seed:7,detail:o,t:.008,sag:.5}))}{const $=os({R:.55,rIn:.07,phase:.3,detail:o});$.translate(r,i+.2,c),b.push($);const L=os({R:.38,rIn:.12,phase:.6,detail:o});L.translate(x0[0],x0[1]+.1,x0[2]),b.push(L);const Q=os({R:.32,rIn:.05,phase:.1,detail:o});Q.translate(q.x,q.y+.16,q.z),b.push(Q),b.push(qo({a:Ot(r-1,N-.5,c+.2),b:Ot(r-2.2,i+.2,c+1.6),r:.03,sag:.2,phase:.93,seed:8,detail:o}))}{const $=S*.022,L=Wt([{r:$*3.6,y:0},{r:$*2.3,y:.015,smooth:!0},{r:$*1.4,y:.06,smooth:!0},{r:$*1.03,y:.15,smooth:!0},{r:$,y:.15}],o?28:12);L.translate(r,yn,c),b.push(L)}{const $=ut(71),L=[];for(const[ee,be,Le]of[[-3.2,4.2,.55],[2.6,5.4,.32],[-5.6,.6,.8],[5.4,-2.6,.6]]){const ve=new Ds;for(let Ue=0;Ue<=26;Ue++){const Ne=Ue/26*co,Qe=Le*(.7+.3*Math.sin(Ne*3+$()*.6)+.12*($()-.5));Ue?ve.lineTo(Math.cos(Ne)*Qe,Math.sin(Ne)*Qe*.8):ve.moveTo(Qe,0)}const _e=new rc(ve);_e.rotateX(-Math.PI/2),_e.translate(r+ee,yn+.004,c+be),L.push(_e);for(let Ue=0;Ue<14;Ue++){const Ne=$()*co,Qe=Math.sqrt($())*Le*.8,_=new go(.05+$()*.09,.012,.012);_.rotateY($()*co),_.translate(r+ee+Math.cos(Ne)*Qe,yn+.012,c+be+Math.sin(Ne)*Qe*.8),L.push(_)}}const Q=new ot(qt(L.map(ee=>ee.index?ee.toNonIndexed():ee)),new Io({color:855308,roughness:.95,metalness:0}));Q.receiveShadow=n!=="low",a.add(Q)}const ct=new ot(qt(b),ao({env:5}));ct.receiveShadow=n!=="low",a.add(ct);const mt=$=>co/$,ht=Ot(0,0,0),xt=Ot(0,0,0),yt=Ot(0,0,0);return{group:a,update($){a.visible=$.i>=4&&($.i<=8||!$.inHold),$.i===6||$.i===7&&!$.inHold||$.i;const L=$.i===7&&!$.inHold?1-ne(Ge(($.u-.66)/.14)):1;h.uniforms.uGain.value=g*L,v.visible=a.visible&&$.i>=5&&$.i<=7&&L>0,Ke.visible=ae.visible=pe.visible=$.i<=6,Se.visible=!($.i===7&&($.inHold||$.u>=.95)),$.camera.getWorldPosition(ht),$.camera.updateMatrixWorld(),yt.copy(nt.bladeDir).negate().transformDirection($.camera.matrixWorldInverse),l.value.set(yt.x,yt.y,yt.z,Ef*(1-.55*($.state.stop.station===6?$.trick("5").k:0)));{const _=$.i===5&&!$.inHold?1-ne(Ge(($.u-.7)/.28)):$.i===7&&!$.inHold?1-ne(Ge(($.u-.72)/.18)):1,te=$.i===7&&!$.inHold?_:1;for(const[Z,qe,Be]of O)Z.color.copy(qe).multiplyScalar(te),Z.envMapIntensity=Be*te;M.color.copy(ie).multiplyScalar(_),M.envMapIntensity=U*_,w.value.x=8*_}if(d.value.copy(l.value),d.value.w*=Cf,h.uniforms.uCamP.value.copy(ht),x){const _=x.getRenderTarget();h.uniforms.uTexel.value.set(1/_.width,1/_.height)}const Q=$.trick("5"),ee=$.state.stop;let be=0,Le=0,Re=0;if(Q.k>0){const _=Q.phase*8,te=[.9,1.7,2.3,3.6,4.2,5.5,6.1,7],Z=[.6,.35,.8,.5,.9,.4,.7,.55];te.forEach((We,T)=>{_>=We&&(be=Z[T]*Math.exp(-(_-We)*2.6)*Math.min(1,(_-We)*12))}),xt.set(r,i,c).project($.camera);const qe=$.state.pointer.x*2-1,Be=1-$.state.pointer.y*2,ze=1-Ge(Math.hypot(qe-xt.x,(Be-xt.y)*.6)/1.2);be*=(.75+.9*ze)*Q.k,Le=_<.12?ne(_/.12):1,Re=_<.12?0:ne((_-.12)/7.8)}const ve=Va(ee),_e=Q.k>0?Le*(1-Re)*ve:0,Ue=be*.11+_e*.05;W.rotation.y=Ue,F.value=Ue,I.forEach((_,te)=>{_.mesh.rotation.y=_.base+_e*mt(_.n)*(te%2?-1:1)}),ae.rotation.y=Y+.18+_e*mt(15)*.8,Ke.rotation.y=0,Ke.position.copy(q),Ke.scale.set(1,1,Ve?-1:1),Ke.quaternion.setFromAxisAngle(Ot(0,1,0),ce+_e*.09*(Ve?-1:1)),Se.position.y=Q.k>0?(Le<1?Math.sin(Le*Math.PI)*.12*ve:0)-_e*.05:0,xe.rotation.y=-(Q.rare>=0?V+(K-V)*ne(Q.rare)*ve:V);const Ne=a.visible&&($.i===6||$.i===7&&!$.inHold&&$.u<.5),Qe=$.i===7?1-ne(Ge(($.u-.3)/.2)):1;if(nt.on=Ne?1:0,nt.fadeTop=yn+Lf,nt.fadeLen=Ne&&$.camera.aspect<1?If:0,nt.steps=Ne&&n==="high"?Ni[0]:0,nt.reflSteps=Ne&&n==="high"?Ni[1]:0,Ne){const _=ee.station===6?ne(ee.t/1)*(ee.rel>0?1-ne(ee.rel/.9):1):0,te=Q.k;nt.columns=Uo.map((Z,qe)=>[Z.x,Z.z,Z.r*.95,z[qe]]),nt.floorY=yn,nt.red.copy(Ot(Te.x-4.2*te,yn+.5+.3*te,Te.z-3.6*te)),nt.redSize.set(1.6+5.2*te,.7+1.3*te,1.4+2.2*te),E.material.color.setScalar(1-.9*te),nt.redPower=(.012+.17*te)*Qe,nt.nave.set(Ro,c-2,Hi,Df*(1-.6*_)*Qe),nt.ruby.copy(Te),nt.rubyPower=(.05+.06*te)*Qe,nt.bladeGain=Nf*(1-.33*_)*Qe,nt.wake=te}h.uniforms.uRuby.value.copy(Te),h.uniforms.uStreak.value=Ne?1.6+.4*Q.k:0,h.uniforms.uNearF.value=_f,h.uniforms.uNearK.value=$.i===6?$.inHold?1:ne(Ge(($.u-.6)/.4)):$.i===7&&!$.inHold?1-ne(Ge($.u/.3)):0}}}const Lt=(e,t,n)=>new R(e,t,n),Ze={tooth:5,gap:.004,glow:1.4,lit:2.2,node:3,body:.07,crack0:.4,push:.022,back:.05,bite:.006,words:2.25,under:.012,sheen:0,fill:.3,toothAz:20,seat:.3,bevel:.8,sheet:1.4,env:.12,envFork:.35,envWheel:.2,envBridge:.25,bridgeNdc:[-.9,-.67],bridgeDepth:5.35,bridgeRecede:.1,bridgeS:.66,toothDirect:.06,toothLine:0,envTooth:.05,toothLen:.32,flank:1,flankR:.004,tilt:0,haze:.07,hazeAt:3.5,hazeSize:2,rimBehind:.9,dress:.3,duelBody:0,duelSheet:1,duelEnv:0,nearR:.09,nearLen:1.4,nearNdc:[.38,-.78],nearDepth:1.86,nearAng:.3,hot:2.5,duelFill:.6,gain:3.2,envGain:5.5,duelPlate:.75};function Hf(e){const t=e.kit.q,n=Ho(t),o=new zt,a=(L,Q,ee=!0)=>{const be=new ot(L,bn({tier:t,...Q}));return be.castShadow=ee&&t!=="low",be.receiveShadow=t!=="low",be};if(!mn.ready||!mn.stoneGeo)return{group:o,update(){o.visible=!1}};const s=new zt;s.applyMatrix4(mn.fork),o.add(s);const r=Wr({detail:n,seed:8}),i=a(r.pieces[0].geo,{finish:"brushed",seed:9,age:.35,tone:.45,direct:.06,objScale:.12});i.position.setFromMatrixColumn(mn.stone,0).normalize().multiplyScalar(-.3),i.material.envMapIntensity*=Ze.envFork,s.add(i);const c=Bc(mn.stoneGeo,mn.side),l=Hc({half:c.half,centre:c.centre,crack:c.crack,node:c.node,chipN:c.chipN,glow:Ze.glow,lit:Ze.lit,nodeK:Ze.node,body:Ze.body,sheen:Ze.sheen,fill:Ze.fill,bevel:Ze.bevel,sheet:Ze.sheet,gain:Ze.gain,env:Ze.env,face:new R(0,1,0),tilt:new R(.12,0,.1)}),d=new ot(mn.stoneGeo,l);d.applyMatrix4(mn.stone);const u=Lt(0,0,0),f=new ge;d.onBeforeRender=(L,Q,ee)=>{l.aim(d,ee),f.copy(d.matrixWorld).invert(),l.ss.uBl.value.copy(u.copy(nt.bladeDir).negate().transformDirection(f))},s.add(d),s.updateMatrixWorld(!0);const p=c.node.clone().applyMatrix4(d.matrixWorld),m=new t0({color:new an().setRGB(.008,.0035,8e-4),roughness:.35,clearcoat:.08,clearcoatRoughness:.2,metalness:0,envMapIntensity:.02,specularIntensity:.1});{const L=c.half.y,Q=c.half.z,ee=c.centre;for(const[be,Le]of[[-Q,-1],[Q,1]]){const Re=new ot(new wo(1,20,12),m);Re.scale.set(.06,.016,.02),Re.position.set(ee.x-c.half.x+.45-Ze.seat-.01,ee.y+L*.55,ee.z+be+Le*.006),d.add(Re)}}const h=Mc({r:pr,detail:n,seed:11,sheared:1}),v=a(h,{finish:"polished",seed:11,age:.5,tone:.45,objScale:.12,direct:.08});v.material.envMapIntensity*=Ze.envWheel,v.position.set(...x0),o.add(v);const M=h.attributes.position,w=Lt(...x0),x=Lt(0,0,0).setFromMatrixColumn(d.matrixWorld,0).setY(0).normalize(),g=Lt(0,0,0).setFromMatrixColumn(d.matrixWorld,2).setY(0).normalize().multiplyScalar(mn.side),y=x.multiplyScalar(Math.cos(Ze.toothAz*Math.PI/180)).addScaledVector(g,Math.sin(Ze.toothAz*Math.PI/180)).normalize();w.copy(p).addScaledVector(y,pr);const b=Math.atan2(-(p.z-w.z),p.x-w.x);let z=Lt(0,0,0),k=1e9,I=0,P=1e9,C=-1e9;for(let L=0;L<M.count;L++)I=Math.max(I,Math.hypot(M.getX(L),M.getZ(L)));for(let L=0;L<M.count;L++)Math.hypot(M.getX(L),M.getZ(L))>I-.05&&(P=Math.min(P,M.getY(L)),C=Math.max(C,M.getY(L)));for(let L=0;L<M.count;L++){const Q=M.getX(L),ee=M.getZ(L),be=Math.hypot(Q,ee),Le=Math.atan2(-ee,Q);if(be<I-.004)continue;const Re=Math.abs(Math.atan2(Math.sin(Le-(b-mn.escRot)),Math.cos(Le-(b-mn.escRot))));Re<k&&(k=Re,z=Lt(Q,M.getY(L),ee))}const S=Math.atan2(-z.z,z.x),F=Math.hypot(z.x,z.z),W=new In({color:new an(0,0,0),vertexColors:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt});{const L=h.index?h.toNonIndexed():h,Q=S-Ze.tooth*Math.PI*2/15,ee=L.attributes.position.count,be=[],Le=[],Re=L.attributes.position;for(let _e=0;_e<ee;_e+=3){let Ue=0,Ne=0;for(let te=0;te<3;te++)Ue+=Re.getX(_e+te)/3,Ne+=Re.getZ(_e+te)/3;const Qe=Math.atan2(-Ne,Ue);(Math.abs(Math.atan2(Math.sin(Qe-Q),Math.cos(Qe-Q)))<Math.PI/15&&Math.hypot(Ue,Ne)>I-Ze.toothLen?be:Le).push(_e)}const ve=_e=>{const Ue=new Gn;for(const[Ne,Qe]of Object.entries(L.attributes)){const _=Qe,te=new Float32Array(_e.length*3*_.itemSize);_e.forEach((Z,qe)=>{for(let Be=0;Be<3;Be++)for(let ze=0;ze<_.itemSize;ze++)te[(qe*3+Be)*_.itemSize+ze]=_.getComponent(Z+Be,ze)}),Ue.setAttribute(Ne,new mo(te,_.itemSize))}return Ue};if(be.length){v.geometry=ve(Le);const _e=a(ve(be),{finish:"polished",seed:12,age:.6,tone:.5,objScale:2,direct:Ze.toothDirect,line:[Ze.toothLine,I-Ze.toothLen]});_e.material.envMapIntensity*=Ze.envTooth,v.add(_e);const Ue=_e.geometry.attributes.position;for(const[Ne,Qe,_,te]of[[Ze.flank,Ze.flankR,1,.3],[-1,Ze.flankR*.6,.35,.1]]){const Z=Array(14).fill(null),qe=Array(14).fill(-1e9);for(let Pe=0;Pe<Ue.count;Pe++){const Je=Ue.getX(Pe),et=Ue.getY(Pe),Ct=Ue.getZ(Pe),pt=Math.hypot(Je,Ct);if(et<C-.003||pt<I-Ze.toothLen+.02)continue;const vt=Math.min(13,Math.floor((pt-(I-Ze.toothLen+.02))/(Ze.toothLen-.02)*14)),bt=Math.atan2(-Ct,Je),It=Ne*Math.atan2(Math.sin(bt-Q),Math.cos(bt-Q));It>qe[vt]&&(qe[vt]=It,Z[vt]=Lt(Je,et+.001,Ct))}const Be=Z.filter(Pe=>!!Pe);if(Be.length<3)continue;const ze=a(vo(Be,()=>Qe,6),{finish:"polished",seed:13,age:0,tone:1,direct:_});ze.material.envMapIntensity*=te,v.add(ze);const We=Be.slice(-4),T=We[We.length-1],le=Math.max(1e-4,We[0].distanceTo(T)),re=vo(We,()=>Qe*1.6,6),se=re.attributes.position,ye=new Float32Array(se.count*3);for(let Pe=0;Pe<se.count;Pe++){const Je=1-Math.min(1,Lt(se.getX(Pe),se.getY(Pe),se.getZ(Pe)).distanceTo(T)/le);ye[Pe*3]=Je*Je,ye[Pe*3+1]=0}re.setAttribute("color",new mo(ye,3)),v.add(new ot(re,W))}}}v.position.copy(p).addScaledVector(y,F+Ze.gap).setY(p.y-C-Ze.under);const A=new zt;A.position.copy(p),o.add(A),A.quaternion.setFromAxisAngle(Lt(0,0,0).crossVectors(y,Lt(0,1,0)).normalize(),Ze.tilt*Math.PI/180),v.position.sub(p),o.remove(v),A.add(v);const B=b-S-Ze.bite/F+Ze.tooth*Math.PI*2/15,oe=new zt;oe.rotation.y=-5*Math.PI*2/15,v.add(oe);const ie=new zt;oe.add(ie),ie.scale.setScalar(Ze.dress),ie.position.copy(z).multiplyScalar(1-Ze.dress);const U=Lt(z.x,0,z.z).normalize(),O=Lt(-U.z,0,U.x),D=Lt(0,1,0),E=z.y;{const L=C-E,Q=[];for(let ve=0;ve<=10;ve++){const _e=ve/10,Ue=z.clone().addScaledVector(O,(_e-.5)*.07).addScaledVector(U,-.004+.008*Math.sin(_e*Math.PI)).addScaledVector(D,L+.002+.004*Math.sin(_e*3.1));Q.push(Ue)}ie.add(a(vo(Q,ve=>.006*(.4+Math.sin(ve*Math.PI)),6),{finish:"polished",seed:31,age:.2,tone:1}));const ee=[],be=z.clone().addScaledVector(U,-.1).addScaledVector(O,-.01).addScaledVector(D,L+.026);for(let ve=0;ve<=80;ve++){const _e=ve/80,Ue=_e*Math.PI*5,Ne=.028*(1-.45*_e),Qe=be.clone().addScaledVector(O,Math.cos(Ue)*Ne*.6).addScaledVector(D,Math.sin(Ue)*Ne*.45).addScaledVector(U,_e*.03);ee.push(Qe)}ie.add(a(vo(ee,ve=>.0045*(1-.5*ve),5),{finish:"polished",seed:32,age:.3,tone:.95}));const Le=new ot(new wo(1,32,16),new t0({color:new an().setRGB(.004,.0035,.003),roughness:.04,ior:1.47,envMapIntensity:1.2}));Le.scale.set(.008,.0075,.045);const Re=z.clone().addScaledVector(U,-.06).addScaledVector(O,-.04).addScaledVector(D,L+.003);Le.position.copy(Re),Le.lookAt(Re.clone().add(U.clone().multiplyScalar(-1).addScaledVector(O,-.6))),ie.add(Le)}const N=new zt;o.add(N);{const ee=Ws(Ne=>[-1.25+Ne*2.5,Math.sin(Ne*Math.PI)*-.15],Ne=>.2-.03*Math.sin(Ne*Math.PI),Mt(40,n,16),12),be=[[-2.5/2+.16,0]],Le=A0({outline:ee,holes:[...be.map(Ne=>({at:Ne,r:.1,sink:.06})),{at:[-.25,-.1],r:.045,bush:!0}],t:.12,bevel:.04,detail:n,round:1}),Re=a(Le.geo,{finish:"striped",seed:9,age:.3,tone:.3,direct:.06,wear:.4,objScale:.15});Re.material.envMapIntensity*=Ze.envBridge,N.add(Re),Le.bushes&&N.add(a(Le.bushes,{finish:"polished",seed:10,age:.3}));const ve=Oa("small",be,.12/2-.06,9,{detail:n});for(const Ne of ve){const Qe=new Fn(Ne.geo,bn({finish:Ne.finish,seed:Ne.seed,tier:t,age:.4}),Ne.mats.length);Ne.mats.forEach((_,te)=>Qe.setMatrixAt(te,_.clone().multiply(new ge().makeScale(.42,.42,.42)))),Qe.instanceMatrix.needsUpdate=!0,Qe.computeBoundingSphere(),N.add(Qe)}const _e=da("pallet-bridge",Re,{at:[.62,.12/2,-.06],right:[1,0,0],up:[0,0,-1],width:Ze.words,depth:.03},e.lang,{tier:t}),Ue=globalThis;(Ue.__secondWait??=[]).push(_e.ready)}Lt(0,0,0).applyMatrix4(mn.fork);{const L=fe.find(te=>te.id==="6").pose,Q=Lt(...L.pos),ee=Lt(...L.look).sub(Q).normalize(),be=Lt(0,0,0).crossVectors(ee,Lt(0,1,0)).normalize(),Le=Lt(0,0,0).crossVectors(be,ee),[Re,ve]=Ze.bridgeNdc,_e=Ze.bridgeDepth,Ue=_e*.18;N.position.copy(Q).addScaledVector(ee,_e).addScaledVector(be,Re*Ue).addScaledVector(Le,ve*Ue*9/16);const Ne=be.clone().multiplyScalar(Math.cos(Ze.bridgeRecede)).addScaledVector(ee,Math.sin(Ze.bridgeRecede)),Qe=Lt(0,1,0).addScaledVector(ee,.08);Qe.addScaledVector(Ne,-Qe.dot(Ne)).normalize(),Ne.normalize();const _=Lt(0,0,0).crossVectors(Ne,Qe);N.quaternion.setFromRotationMatrix(new ge().makeBasis(Ne,Qe,_)),N.scale.setScalar(Ze.bridgeS)}const V=new zn({vertexShader:`varying vec2 vU;
void main() {vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}`,fragmentShader:`varying vec2 vU;
void main() {
  float a = 1.0 - smoothstep(0.15, 0.5, abs(vU.y - 0.5));
  a *= smoothstep(0.0, 0.25, vU.x) * smoothstep(0.0, 0.25, 1.0 - vU.x);
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}`,transparent:!0,depthWrite:!1,depthTest:!1,blending:Wn,blendSrc:p0,blendDst:Cr,blendSrcAlpha:p0,blendDstAlpha:kt}),K=new ot(new h0(Ze.nearLen,Ze.nearR*2),V);K.renderOrder=10,K.frustumCulled=!1;{const L=fe.find(_=>_.id==="6").pose,Q=Lt(...L.pos),ee=Lt(...L.look).sub(Q).normalize(),be=Lt(0,0,0).crossVectors(ee,Lt(0,1,0)).normalize(),Le=Lt(0,0,0).crossVectors(be,ee),[Re,ve]=Ze.nearNdc,_e=Ze.nearDepth,Ue=_e*.18;K.position.copy(Q).addScaledVector(ee,_e).addScaledVector(be,Re*Ue).addScaledVector(Le,ve*Ue*9/16);const Ne=be.clone().multiplyScalar(Math.cos(Ze.nearAng)).addScaledVector(Le,Math.sin(Ze.nearAng)).normalize(),Qe=Lt(0,0,0).crossVectors(ee.clone().negate(),Ne);K.quaternion.setFromRotationMatrix(new ge().makeBasis(Ne,Qe,ee.clone().negate()))}o.add(K);const j=new zn({uniforms:{uK:{value:Ze.haze}},vertexShader:`varying vec2 vUv;
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
}`,transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt}),me=new ot(new h0(1,1),j);me.frustumCulled=!1,me.renderOrder=-1,o.add(me);const xe=[];for(let L=0;L<=48;L++){const Q=Math.PI+(L/48-.5)*1.4;xe.push(Lt(Math.cos(Q)*vs,0,Math.sin(Q)*vs))}const Me=a(vo(xe,()=>.07,8),{finish:"polished",seed:14,age:.6,tone:.4,direct:.05});Me.material.envMapIntensity*=.05,o.add(Me);{const L=fe.find(ee=>ee.id==="6").pose,Q=Lt(...L.look).sub(Lt(...L.pos)).setY(0).normalize();Me.position.copy(mn.stoneWorld).addScaledVector(Q,vs+Ze.rimBehind).setY(mn.stoneWorld.y-.1),Me.rotation.y=-Math.atan2(-Q.z,-Q.x)+Math.PI}const q=ut(67),he=9,ce=new vl(1,0),ue=new t0({color:new an().setRGB(.006,0,3e-4),roughness:.05,metalness:0,ior:1.76,emissive:new an(.004,0,1e-4)}),Ae=new Fn(ce,ue,he);Ae.frustumCulled=!1,o.add(Ae);const we=Array.from({length:he},()=>({t:.25+q()*.7,d:Lt(q()-.3,q()*.9+.2,q()-.5).normalize(),s:.006+q()*.012,r:Lt(q()*6,q()*6,q()*6),v:.12+q()*.2})),De=18,Ve=new In({color:new an(1.3*Ze.gain,0,.02*Ze.gain),transparent:!1,depthWrite:!0,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt}),Ke=Ve.clone();Ke.color.setRGB(6,5,4.6);const Xe=new ta(1,1,1,4,1,!0);Xe.translate(0,-.5,0),Xe.rotateX(Math.PI/2);const Ce=new Fn(Xe,Ve,De),rt=new Fn(new wo(1,6,4),Ke,De);Ce.frustumCulled=rt.frustumCulled=!1,o.add(Ce,rt);const st=Array.from({length:De},()=>({a:q()*Math.PI*2,c:Math.pow(q(),.7),v:.45+q()*.9,g:q()})),Te=[.25,.85,1.3,2.4,2.9,3.6,4.3,5.1],Fe=new ge,ae=new Xt,Y=Lt(1,1,1),J=Lt(0,0,0),pe=Lt(0,0,1),Se=Lt(0,0,0),Ee=Lt(0,0,0),He=Lt(0,0,0),ct=Lt(0,0,0),mt=Lt(0,0,0),ht=Lt(0,0,0),xt=[],yt=new Set;N.traverse(L=>{const Q=L.material;Q&&yt.add(Q)}),o.traverse(L=>{const Q=L.material;Q&&"envMapIntensity"in Q&&!xt.some(ee=>ee[0]===Q)&&xt.push([Q,Q.envMapIntensity])});const $=[];for(const[L]of xt){const Q=L.ss?.uRS2;Q&&$.push([Q.value,Q.value.y])}return{group:o,update(L){if(o.visible=L.i>=7&&(L.i<=8||!L.inHold),!o.visible)return;const Q=L.trick("6");{const _=L.i===7?L.inHold?1:ne(Ge((L.u-.8)/.15)):L.i===8&&!L.inHold?1-ne(Ge(L.u/.15)):0,te=_>0;me.visible=Me.visible=K.visible=te,K.scale.set(1,Math.max(.001,_),1),te&&(L.camera.matrixWorld.extractBasis(Se,Ee,He),me.position.copy(mn.stoneWorld).addScaledVector(He,-3.5),me.quaternion.copy(L.camera.quaternion),me.scale.setScalar(Ze.hazeSize*(1+Ze.hazeAt/L.camera.position.distanceTo(mn.stoneWorld))),j.uniforms.uK.value=_*Ze.gain*Ze.haze*(1-.5*Q.k))}for(const[_,te]of xt)_.envMap=e.scene.environment,_.envMapIntensity=te*(_===l?Ze.gain:Ze.envGain)*e.scene.environmentIntensity*(1-(yt.has(_)?Ze.duelPlate:Ze.duelEnv)*Q.k);for(const[_,te]of $)_.y=te*(1-.95*Q.k);l.ss.uSheen.value=Ze.sheen*(1-.85*Q.k);const ee=Math.pow(1-Q.k,6);l.ss.uBevC.value.setRGB(.86*ee+.045*Q.k,.88*ee,.92*ee),l.ss.uBody.value=Ze.body*(1+Ze.duelBody*Q.k),l.ss.uSheet.value=Ze.sheet*(1+Ze.duelSheet*Q.k);const be=L.i===7?L.inHold?ne(L.u):0:1;let Le=0,Re=0,ve=0;if(Q.k>0){const _=Q.phase*6;Le=_<2?ne(_/2):_<5?1:1-ne((_-5)/1),Re=Math.sin(L.state.time*71)*.5+Math.sin(L.state.time*113+1)*.5,Re*=Le*(_<2?_/2:1),Le*=Q.k}Q.rare>=0&&(ve=Q.rare);const _e=ve>0?ne(ve/.06):0;W.color.setScalar(Ze.gain*Ze.hot*Q.k*(1-_e)),v.rotation.y=B+be*Ze.push-Le*Ze.back-Re*.0025*Q.k-_e*.28;const Ue=Ze.crack0+(.96-Ze.crack0)*be;l.crack(ve>0?Ue*(1-.85*ne(ve/.5)):Ue);const Ne=ne((be-.55)/.45)*(1-_e);l.ss.uHeat.value=Ne*(1-.35*Le)+Math.max(0,Re)*.3*Q.k,l.ss.uNodeK.value=Ze.node*(1+2.2*be)*(1-.7*_e),l.ss.uFill.value=Ze.fill*(1-_e)*(1-Ze.duelFill*Q.k),l.ss.uLit.value=Ze.lit*(1-.8*ne(ve/.5));for(let _=0;_<he;_++){const te=we[_],Z=Ge((be-te.t)/.25)*(1-_e);J.copy(p).addScaledVector(te.d,Z*te.v).add(ht.set(0,-Z*Z*.05,0)),ae.setFromEuler(new Kn(te.r.x*Z,te.r.y*Z,te.r.z*Z)),Fe.compose(J,ae,Y.setScalar(Z>0&&Z<1?te.s:0)),Ae.setMatrixAt(_,Fe)}Ae.instanceMatrix.needsUpdate=!0;const Qe=Q.k>0&&!_e;if(Ce.visible=rt.visible=Qe,Qe){const _=Q.phase*6;let te=-1;for(const ye of Te)_>=ye&&(te=ye);const Z=te<0?1:(_-te)/.4;L.camera.matrixWorld.extractBasis(Se,Ee,He),ht.copy(p).project(L.camera);const qe=L.state.pointer.x*2-1,Be=1-L.state.pointer.y*2,ze=ht.x-qe,We=ht.y-Be,T=Math.hypot(ze,We)||1;ct.set(0,0,0).addScaledVector(Se,ze/T).addScaledVector(Ee,We/T).addScaledVector(He,-.1).normalize();const le=Lt(0,0,0).crossVectors(ct,He).normalize(),re=Lt(0,0,0).crossVectors(le,ct).normalize(),se=L.camera.position.distanceTo(p);for(let ye=0;ye<De;ye++){const Pe=st[ye],Je=Z<1&&ye%2===0&&Pe.g>.15*(Te.indexOf(te)%3),et=1.05*Pe.c;mt.copy(ct).addScaledVector(le,Math.cos(Pe.a)*et).addScaledVector(re,Math.sin(Pe.a)*et).normalize(),mt.addScaledVector(He,-.85*mt.dot(He)).normalize();const Ct=Pe.v*Z*(1-.3*Z),pt=.03+.12*Pe.v*(1-Z*.8);J.copy(p).addScaledVector(mt,Ct).add(ht.set(0,-Z*Z*.04,0)),ae.setFromUnitVectors(pe,mt);const vt=Math.min(1,L.camera.position.distanceTo(J)/se);Fe.compose(J,ae,Y.set(5e-4*vt,5e-4*vt,Je?pt:0)),Ce.setMatrixAt(ye,Fe),Fe.compose(J,ae,Y.setScalar(Je?6e-4*vt:0)),rt.setMatrixAt(ye,Fe)}Ce.instanceMatrix.needsUpdate=rt.instanceMatrix.needsUpdate=!0}if(ve>0&&ve<.25&&!L.state.reduced){const _=Math.exp(-ve*30)*Math.sin(ve*140)*.012*L.camera.position.distanceTo(p);L.camera.matrixWorld.extractBasis(Se,Ee,He),L.camera.position.addScaledVector(Ee,_).addScaledVector(Se,_*.4),L.camera.updateMatrixWorld()}}}}const Aa=(e=0,t=0,n=0)=>new R(e,t,n),Rt=(()=>{const e=Aa(...lc),t=Aa(...hr),n=t.clone().sub(e).normalize(),o=Aa().crossVectors(n,Aa(0,1,0)).normalize(),a=Aa().crossVectors(o,n).normalize();return{E:e,L:t,F:n,R:o,U:a,Dref:e.distanceTo(t),H:1.95}})();function $0(e){const t=e/Rt.Dref*Rt.H,n=new ge;return n.makeBasis(Rt.R.clone().multiplyScalar(t),Rt.U.clone().multiplyScalar(t),Rt.F.clone().multiplyScalar(-t)).setPosition(Rt.E.clone().addScaledVector(Rt.F,e)),n}function Bf(e){const t=e.clone().sub(Rt.E),n=t.dot(Rt.F),o=n/Rt.Dref*Rt.H;return{x:t.dot(Rt.R)/o,y:t.dot(Rt.U)/o,D:n}}const r0=[{a:[-.975,-.5],b:[-.975,.5],hw:.1,letter:0},{a:[-.96,.48],b:[-.525,-.2],hw:.088,letter:0},{a:[-.525,-.2],b:[-.09,.48],hw:.088,letter:0},{a:[-.075,.5],b:[-.075,-.5],hw:.1,letter:0},{a:[.325,-.5],b:[.325,.5],hw:.1,letter:1},{a:[.37,-.03],b:[1.03,.5],hw:.09,letter:1},{a:[.6,.17],b:[1.06,-.5],hw:.094,letter:1}],f0=e=>Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),or=[6.7,7.2,6.8,6.35,7,7.65,7.1],Xo=(()=>{const e=r0.map(f0),t=e[0]+e[1]+e[2];return[{g0:.4+.5+e[2]+e[1],tg:1,h0:0,hdir:1},{g0:.4+.5+e[2],tg:1,h0:e[0],hdir:1},{g0:.4+.5,tg:1,h0:e[0]+e[1],hdir:1},{g0:.4,tg:.5,h0:t,hdir:-1},{g0:0,tg:.5,h0:t+e[3]+.2,hdir:1},{g0:0,tg:0,h0:t+e[3]+.2+.5,hdir:1},{g0:.25,tg:0,h0:t+e[3]+.2+.5+.3,hdir:1}]})(),Vn={OIL:0,FORGE:1,SCALES:2,SWARM:3,RARE:4},ar=1.5,to=5.5,Da=6.5,Xc=1.5,Ls=Da+Xc,Of=3.62,Vf=5.45,qf=e=>e-Math.floor(e),Gf=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),Oi=e=>{const t=Gf(e);return t*t*(3-2*t)};function Vi(e,t){return!t||e<4?e%4:e===4?Vn.RARE:(e-1)%4}function Uf(e,t){const n=e<ar?0:Of*Oi((e-ar)/(to-ar))**.85,o=qf((e-to)/Da);if(e<to)return{flood:n,a:Vn.OIL,b:Vn.OIL,front:-1,phase:o,slot:0,inSlot:e-to};const a=(e-to)/Ls,s=Math.floor(a),r=e-to-s*Ls,i=Vi(s,t),c=Vi(s+1,t),l=r>Da?(r-Da)/Xc:-1,d=l<0?-1:-.4+(Vf+.8)*Oi(l);return{flood:n,a:i,b:l<0?i:c,front:d,phase:o,slot:s,inSlot:r}}const $f=e=>[Vn.OIL,Vn.FORGE,Vn.SCALES,Vn.SWARM,Vn.SCALES,Vn.OIL,Vn.FORGE][e]??0,sr=8,$o=(e=0,t=0,n=0)=>new R(e,t,n),Is=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),Co=e=>{const t=Is(e);return t*t*(3-2*t)},zr=`
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
`,jf=`
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
`;function Kf(e,t){const n=[],o=[],a=[],s=[],r=[],i=[];for(const l of e){let d=new Gn;d.setAttribute("position",l.geo.getAttribute("position").clone()),l.geo.index&&d.setIndex(l.geo.index.clone()),d=Rl(d,2e-4),d.computeVertexNormals();const u=r0[l.s],f=f0(u),p=Xo[l.s],m=(u.b[0]-u.a[0])/f,h=(u.b[1]-u.a[1])/f,v=d.getAttribute("position"),M=d.getAttribute("normal"),w=n.length/3;for(let g=0;g<v.count;g++){const y=M.getX(g),b=M.getY(g),z=M.getZ(g),k=v.getX(g)+y*t,I=v.getY(g)+b*t,P=v.getZ(g)+z*t;n.push(k,I,P),o.push(y,b,z),r.push(l.D);const C=(k-u.a[0])*m+(I-u.a[1])*h,S=Is(((k-u.a[0])*-h+(I-u.a[1])*m)/u.hw,-1.2,1.2);a.push(l.s,C,S,z);const F=Is(C/f);s.push(p.h0+(p.hdir>0?F:1-F)*f,p.g0+Math.abs(F-p.tg)*f)}const x=d.index;for(let g=0;g<x.count;g++)i.push(w+x.getX(g))}const c=new Gn;return c.setAttribute("position",new wt(n,3)),c.setAttribute("normal",new wt(o,3)),c.setAttribute("aSL",new wt(a,4)),c.setAttribute("aHG",new wt(s,2)),c.setAttribute("aD",new wt(r,1)),c.setIndex(n.length/3>65535?new gl(i,1):new xl(i,1)),c}function Yf(e){const t=new t0({color:16777215,roughness:.1,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.2});return t.onBeforeCompile=n=>{Object.assign(n.uniforms,e),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
${zr}
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
${zr}
${jf}
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
gl_FragColor.a = 1.0 + clamp(skTag, 0.0, 1.0);`)},t.customProgramCacheKey=()=>"mk-coat",t}function rr(e,t,n){const o=new t0(n),a=[`float ang = 0.1 + 0.66 * ((0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))) * (0.5 + 0.5 * sin(6.2832 * (l * 1.3 - uT * 2.0))));
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
  ctr = vec3(lp, cz);`][t],s=[Vn.SCALES,Vn.SWARM,Vn.FORGE][t];return o.onBeforeCompile=r=>{Object.assign(r.uniforms,e),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
${zr}
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
float c = iD.x * 0.0 + (${t} == 1 ? iD.x : iD.y);
if (${t} == 1) l = 0.0;
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
varying vec3 vLN;`).replace("#include <color_fragment>",t===0?`#include <color_fragment>
float pRimL = smoothstep(0.9, 0.55, abs(vLN.z));
float mPh = (vLoc.y - 1.9 * abs(vLoc.x)) * 820.0;
float mAmp = 1.0 - smoothstep(0.25, 0.6, fwidth(mPh) / 6.2832);
float mLine = 0.5 + 0.5 * sin(mPh) * mAmp;
diffuseColor.rgb = mix(vec3(0.055, 0.058, 0.064) * (0.75 + 0.5 * mLine), vec3(0.62, 0.63, 0.66), pRimL);`:"#include <color_fragment>").replace("#include <roughnessmap_fragment>",t===0?`#include <roughnessmap_fragment>
roughnessFactor = mix(0.2 + 0.12 * mLine, 0.1, pRimL);`:"#include <roughnessmap_fragment>").replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${t===0?"totalEmissiveRadiance += vec3(0.34, 0.34, 0.357) * pRimL * (0.1 + 0.9 * ((max(0.0, dot(normalize(normal.xy + vec2(1e-4)), vec2(-0.54, 0.84)))) * (max(0.0, dot(normalize(normal.xy + vec2(1e-4)), vec2(-0.54, 0.84)))) * (max(0.0, dot(normalize(normal.xy + vec2(1e-4)), vec2(-0.54, 0.84))))));":`totalEmissiveRadiance += uCrestCol * ((vCrest) * (vCrest) * (vCrest)) * uCrestLit;
float pRim = ((1.0 - abs(dot(normal, normalize(vViewPosition)))) * (1.0 - abs(dot(normal, normalize(vViewPosition)))) * (1.0 - abs(dot(normal, normalize(vViewPosition)))) * (1.0 - abs(dot(normal, normalize(vViewPosition)))));
totalEmissiveRadiance += vec3(0.2, 0.2, 0.21) * pRim * (0.3 + 1.2 * ((vCrest) * (vCrest)));`}`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directSpecular *= ${t===1?"0.12":t===0?`mix(0.075, 1.0, pRimL);
reflectedLight.directSpecular = mix(min(reflectedLight.directSpecular, vec3(0.05)), reflectedLight.directSpecular, pRimL);
reflectedLight.indirectSpecular = mix(min(reflectedLight.indirectSpecular, vec3(0.05)), reflectedLight.indirectSpecular, pRimL)`:"0.2"};
reflectedLight.directDiffuse *= ${t===0?"0.28":"0.5"};`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = 1.0;`)},o.customProgramCacheKey=()=>`mk-part-${t}`,o}function Xf(){const t=new Ds;t.moveTo(-.05*.3,0),t.lineTo(.05*.3,0),t.lineTo(.05,-.15*.34),t.lineTo(.05*.16,-.15*.9),t.lineTo(0,-.15),t.lineTo(-.05*.16,-.15*.9),t.lineTo(-.05,-.15*.34),t.lineTo(-.05*.3,0);const n=new Zi(t,{depth:.003,bevelEnabled:!0,bevelThickness:.003,bevelSize:.0048,bevelSegments:2,curveSegments:5});return n.computeVertexNormals(),n}function Zf(){const e=new ta(.0045,.0035,.028,6,1).translate(0,-.012,0),t=new ta(.011,.011,.006,10,1).translate(0,.004,0),n=new Gn,o=e.toNonIndexed(),a=t.toNonIndexed(),s=[...o.attributes.position.array,...a.attributes.position.array],r=[...o.attributes.normal.array,...a.attributes.normal.array];return n.setAttribute("position",new wt(s,3)),n.setAttribute("normal",new wt(r,3)),n}function Qf(e){const{q:t}=e,n=t==="low",o=new zt;o.visible=!1,e.group.add(o);const a={uA:{value:[0,0,0,0,0,0,0]},uB:{value:[0,0,0,0,0,0,0]},uFront:{value:-1},uFlood:{value:0},uT:{value:0},L7:{value:r0.map(f0)},uE:{value:Rt.E.clone()},uF:{value:Rt.F.clone()},uR:{value:Rt.R.clone()},uU:{value:Rt.U.clone()},uDH:{value:new Ft(Rt.Dref,Rt.H)},uPtr:{value:$o(0,0,0)},uForgeTag:{value:0},uCrestLit:{value:0},uCrestCol:{value:$o(.022,.022,.024)}},s=Yf(a);{const P=new ot(Kf(e.coat,.005),s);P.frustumCulled=!1,o.add(P)}const r=ut(7077),i=(P,C,S)=>{const F=S.length,W=new Ua;W.index=P.index;for(const D of["position","normal"])W.setAttribute(D,P.getAttribute(D));const A=new Float32Array(F*4),B=new Float32Array(F*4),oe=new Float32Array(F*4),ie=new Float32Array(F*4),U=new Float32Array(F*16);S.forEach((D,E)=>{const N=D[0],V=r0[N],K=f0(V),j=Xo[N];A.set([V.a[0],V.a[1],(V.b[0]-V.a[0])/K,(V.b[1]-V.a[1])/K],E*4),B.set([K,V.hw,N,D[1]],E*4),oe.set([j.h0,j.hdir,j.g0,j.tg],E*4),ie.set(D.slice(2,6),E*4),$0(or[N]).toArray(U,E*16)}),W.setAttribute("iA",new Tn(A,4)),W.setAttribute("iB",new Tn(B,4)),W.setAttribute("iC",new Tn(oe,4)),W.setAttribute("iD",new Tn(ie,4)),W.instanceCount=F;const O=new Fn(W,C,F);return O.instanceMatrix=new Tn(U,16),O.frustumCulled=!1,o.add(O),O},c=[];r0.forEach((P,C)=>{const S=f0(P),F=n?.085:.068,W=3;for(let A=0,B=-P.hw*.6;B<S+P.hw*.6;A++,B+=F)for(let oe=0;oe<W;oe++){const ie=-.86+1.72*(oe+(A%2?.5:0))/(W-(A%2?0:1)||1);Math.abs(ie)>.95||c.push([C,r(),B,ie,A,0])}}),i(Xf(),rr(a,0,{color:new an(.09,.09,.095),metalness:1,roughness:.42,envMapIntensity:.45}),c);const l=[];r0.forEach((P,C)=>{const S=Math.round(f0(P)*(n?190:540));for(let F=0;F<S;F++)l.push([C,r(),(r()*2-1)*.95,1+(r()<.3?1:0),r()*r(),1+Math.floor(r()*3)])}),i(Zf(),rr(a,1,{color:new an(.16,.16,.17),metalness:1,roughness:.35,envMapIntensity:.22}),l);const d=[];r0.forEach((P,C)=>{const S=f0(P),F=Math.round(S*(n?10:24));for(let W=0;W<F;W++)d.push([C,r(),r()*S,(r()*2-1)*.8,0,0])});const u=new Rs(.017,0).scale(1,.75,.22);i(u,rr(a,2,{color:new an(.04,.037,.036),metalness:.3,roughness:.7,emissive:new an(.07,0,.001)}),d);const f=(P,C,S,F=.05)=>$o(P,C,F).applyMatrix4($0(or[S])),p=(P,C,S,F=.03)=>{const W=r0[P],A=f0(W),B=(W.b[0]-W.a[0])/A,oe=(W.b[1]-W.a[1])/A;return f(W.a[0]+(W.b[0]-W.a[0])*C-oe*S*W.hw,W.a[1]+(W.b[1]-W.a[1])*C+B*S*W.hw,P,F)},m=or[4]/Rt.Dref*Rt.H,h=[];[[.55,.5,0],[.72,.3,1],[.86,.16,2]].forEach(([P,C,S])=>h.push({a:p(1,P,1),b:p(2,1-P+.02*S,1),w:.011*m,sag:.03*m,ph:S*.23,beads:3+S,nk:.5,seed:11+S,tier:S===2?2:1,snap:S===1})),[[.12,.18,0],[.3,.33,1]].forEach(([P,C,S])=>h.push({a:p(5,P,-1),b:p(6,C,1),w:.012*m,sag:.02*m,ph:.4+S*.3,beads:2+S,seed:21+S,tier:1})),h.push({a:p(3,.45,1),b:p(4,.58,1),w:.011*m,sag:.05*m,ph:.1,beads:4,seed:31,tier:1,drop:.55}),h.push({a:p(3,.7,1),b:p(4,.32,1),w:.008*m,sag:.07*m,ph:.6,beads:3,seed:32,tier:2,snap:!0}),[[0,0],[3,1],[4,0],[6,1]].forEach(([P,C],S)=>{const F=p(P,C,0,.02),W=F.clone().addScaledVector(Rt.U,-(.16+.06*S)*m);h.push({a:F,b:W,w:.013*m,end:"drop",ph:S*.27,seed:41+S,tier:1})}),[[1,.3,.12],[1,.72,.2],[2,.45,.09],[2,.8,.15],[5,.5,.14],[5,.86,.1],[6,.6,.17]].forEach(([P,C,S],F)=>{const W=p(P,C,-1,.02),A=W.clone().addScaledVector(Rt.U,-S*m);h.push({a:W,b:A,w:(.008+.003*(F%3))*m,end:"drop",ph:.13+F*.31,seed:51+F,tier:F%3===2?2:1})}),[[.25,.25,0],[.42,.4,1]].forEach(([P,C,S])=>h.push({a:p(4,P,-1),b:p(6,C,-1),w:.009*m,sag:.04*m,ph:.7+S*.2,beads:3,seed:61+S,tier:1,snap:S===1}));const v=[],M=6;v.push({top:Array.from({length:M},(P,C)=>p(1,.3+.66*C/(M-1),1,.01)),bot:Array.from({length:M},(P,C)=>p(2,.7-.66*C/(M-1),1,.01)),free:"sides",holes:[{u:.25,v:.5,rx:.05*m,ry:.038*m,kind:"breathe",ph:.1},{u:.55,v:.42,rx:.04*m,ry:.03*m,kind:"open",ph:.5},{u:.8,v:.5,rx:.022*m,ry:.018*m,kind:"breathe",ph:.8},{u:.14,v:.68,rx:.034*m,ry:.024*m,kind:"breathe",ph:.3},{u:.22,v:.84,rx:.014*m,ry:.011*m,kind:"breathe",ph:.65},{u:.34,v:.63,rx:.022*m,ry:.017*m,kind:"breathe",ph:.9},{u:.1,v:.5,rx:.012*m,ry:.01*m,kind:"breathe",ph:.4},{u:.27,v:.74,rx:.009*m,ry:.008*m,kind:"breathe",ph:.15}],waist:.14}),v.push({top:Array.from({length:M},(P,C)=>p(5,.06+.5*C/(M-1),-1,.01)),bot:Array.from({length:M},(P,C)=>p(6,.02+.5*C/(M-1),1,.01)),free:"sides",holes:[{u:.4,v:.5,rx:.04*m,ry:.03*m,kind:"pairA",ph:.2},{u:.72,v:.45,rx:.035*m,ry:.026*m,kind:"pairB",ph:.2}],waist:.12});const w=Gc({strands:h,webs:v,q:t,env:.9});o.add(w.group);const x=new Fr,g=$o(),y=new Ga,b=$o(),z=$o();y.setFromNormalAndCoplanarPoint(Rt.F,Rt.E.clone().addScaledVector(Rt.F,Rt.Dref));const k=(P,C)=>P===Vn.RARE?$f(C):P,I=(P,C,S,F)=>{const W=F<0?0:Co((F-S)/.1+.5);return(a.uA.value[C]===P?1-W:0)+(a.uB.value[C]===P?W:0)};return{forge:0,cover:0,oil:0,scales:0,update(P,C){const S=P.state.stop,F=S.station===sr&&(P.i===sr||P.i===sr+1);if(o.visible=F&&S.t>1.4,!o.visible){this.forge=0,this.cover=0,this.oil=0,this.scales=0,e.shardMat.u&&(e.shardMat.u.uRoot.value=1);return}const W=Uf(S.t,S.rare),A=S.rel>0?1-Co(S.rel/.8):1;a.uFlood.value=W.flood*A-(A<1?.02:0),a.uFront.value=W.front,a.uT.value=W.phase;for(let E=0;E<7;E++)a.uA.value[E]=k(W.a,E),a.uB.value[E]=k(W.b,E);g.set(P.state.pointer.x*2-1,1-P.state.pointer.y*2,.5).unproject(P.camera),x.origin.copy(C),x.direction.copy(g).sub(C).normalize();const B=Co((S.t-1.5)/.5)*A;if(x.intersectPlane(y,b)){const E=Bf(b);a.uPtr.value.set(E.x,E.y,.035*B)}else a.uPtr.value.set(0,0,0);let oe=0;for(let E=0;E<7;E++)oe+=I(Vn.FORGE,E,Xo[E].h0+f0(r0[E])*.5,W.front);oe=oe/7*Co(a.uFlood.value/1);let ie=0;for(let E=0;E<7;E++)ie+=I(Vn.OIL,E,Xo[E].h0+f0(r0[E])*.5,W.front);let U=0;for(let E=0;E<7;E++)U+=I(Vn.SCALES,E,Xo[E].h0+f0(r0[E])*.5,W.front);this.forge=oe,this.cover=Is(a.uFlood.value/3.62),this.oil=ie/7*Co(a.uFlood.value/3),this.scales=U/7*Co(a.uFlood.value/1),a.uForgeTag.value=oe>.3?.9:0,e.shardMat.u&&(e.shardMat.u.uRoot.value=oe>.3?0:1),a.uCrestLit.value=1;const O=Math.min(...[1,2,3,4,5,6].map(E=>I(Vn.OIL,E,Xo[E].h0+f0(r0[E])*.5,W.front))),D=a.uFlood.value>2.6;w.group.visible=D&&O>.5,z.set(.3,1,.4),w.setLight(z),w.update(W.phase,(S.t<to?Co((S.t-4.5)/1):1)*B,x,1)}}}const Jt=(e=0,t=0,n=0)=>new R(e,t,n),Pr=Math.PI*2,ir=8,Jf=e=>e.map(([t,n])=>[t*Rt.H,-n*Rt.H]).reverse(),ep=[{s:0,k:"bridge",t0:-.05,t1:.56,v:-.015,w:.08,D:9.6,fin:"striped",ends:["sq","snap"],holes:[[.12,"s"],[.42,"b"]],seed:701},{s:0,k:"bridge",t0:.42,t1:1.04,v:.02,w:.072,D:7.7,fin:"striped",ends:["snap","rd"],holes:[[.35,"b"],[.82,"s"]],seed:702},{s:0,k:"lever",t0:.12,t1:.86,v:.072,w:.019,D:6.9,fin:"polished",ends:["rd","rd"],holes:[[.22,"h"]],boss:.22,seed:711},{s:0,k:"spoke",t0:.04,t1:.62,v:-.088,w:.013,D:10.4,fin:"blackened",ends:["sq","snap"],seed:721},{s:0,k:"arbor",t0:.6,t1:.98,v:-.066,D:8.6,seed:731},{s:1,k:"bridge",t0:-.03,t1:.62,v:0,w:.072,D:10.7,fin:"brushed",ends:["rd","snap"],holes:[[.18,"s"],[.5,"b"]],seed:703},{s:1,k:"fork",t0:.4,t1:.97,v:.012,D:8.9,seed:741},{s:1,k:"spoke",t0:.1,t1:.72,v:.066,w:.015,D:7.4,fin:"blackened",ends:["snap","snap"],seed:722},{s:1,k:"frag",t0:.6,t1:1.03,v:-.035,w:.058,D:9.8,fin:"grained",ends:["snap","sq"],holes:[[.5,"h"]],seed:712},{s:2,k:"bridge",t0:-.04,t1:.55,v:.02,w:.07,D:8.4,fin:"polished",ends:["sq","snap"],holes:[[.2,"b"],[.47,"s"]],seed:704},{s:2,k:"bridge",t0:.44,t1:1.03,v:-.015,w:.072,D:10.2,fin:"striped",ends:["snap","rd"],holes:[[.5,"b"],[.85,"s"]],seed:705},{s:2,k:"lever",t0:.08,t1:.88,v:-.066,w:.018,D:7,fin:"polished",ends:["rd","rd"],holes:[[.8,"h"]],boss:.8,seed:713},{s:2,k:"arbor",t0:.26,t1:.8,v:.07,D:9.4,seed:732},{s:3,k:"bridge",t0:-.04,t1:.56,v:-.01,w:.078,D:11.1,fin:"striped",ends:["rd","snap"],holes:[[.18,"s"],[.48,"b"]],seed:706},{s:3,k:"bridge",t0:.46,t1:1.04,v:.02,w:.072,D:8,fin:"grained",ends:["snap","sq"],holes:[[.4,"b"],[.86,"s"]],seed:707},{s:3,k:"arbor",t0:-.03,t1:1.02,v:-.03,D:6.6,seed:733},{s:3,k:"lever",t0:.3,t1:.8,v:-.082,w:.02,D:9.5,fin:"polished",ends:["rd","rd"],holes:[[.72,"h"]],boss:.72,seed:714},{s:3,k:"spoke",t0:.56,t1:1,v:.084,w:.014,D:7.6,fin:"blackened",ends:["snap","sq"],seed:723},{s:4,k:"spoke",t0:.1,t1:.62,v:.01,w:.014,D:10.6,fin:"blackened",ends:["snap","snap"],seed:724},{s:6,k:"lever",t0:.28,t1:.78,v:.1,w:.016,D:8.5,fin:"polished",ends:["rd","snap"],holes:[[.2,"h"]],boss:.2,seed:715}];function tp(e,t,n,o,a,s,r){const i=ut(r*97+3),c=f0(e),l=(e.b[0]-e.a[0])/c,d=(e.b[1]-e.a[1])/c,u=-d,f=l,p=36,m=y=>{const b=t+(n-t)*y;return[e.a[0]+(e.b[0]-e.a[0])*b+u*o,e.a[1]+(e.b[1]-e.a[1])*b+f*o]},h=(y,b,z)=>{const k=m(y);return[k[0]+l*b+u*z,k[1]+d*b+f*z]},v=[],M=[];for(let y=0;y<=p;y++){const b=y/p;v.push(h(b,0,a(b))),M.push(h(b,0,-a(b)))}const w=(y,b,z)=>{const k=[],I=a(y);if(b==="rd")for(let P=1;P<12;P++){const C=Math.PI*P/12;k.push(h(y,-z*Math.sin(C)*I,z*Math.cos(C)*I))}if(b==="snap"){const P=4+Math.floor(i()*4);let C=0;for(let S=1;S<P;S++){C+=(1-C)/(P-S+1)*(.5+i());const F=i()<.55?.15+i()*1.1:-(.02+i()*.35);k.push(h(y,-z*F*I,z*(1-2*Math.min(C,.97))*I))}}return k},x=w(0,s[0],1),g=w(1,s[1],-1);return[v[0],...x,...M,...g,...v.slice().reverse().slice(0,p)]}function np(e,t,n,o,a,s){const r=ut(a*131+7),i=5,c=7,l=Jt(t[0]-e[0],t[1]-e[1],0),d=l.length();l.normalize();const u=Jt(-l.y,l.x,0),f=Jt(0,0,1),p=Array.from({length:i},()=>.7+r()*.5),m=Array.from({length:i},(S,F)=>(F+(r()-.5)*.5)/i*Pr),h=[],v=r()*.3,M=r()*.3;for(let S=0;S<=c;S++){const F=S/c,W=Math.pow(Math.min(1,F/.3,(1-F)/.38),.9)*(.8+r()*.4),A=Jt(e[0],e[1],0).addScaledVector(l,F*d).addScaledVector(u,(r()-.5)*n*.25);h.push(m.map((B,oe)=>A.clone().addScaledVector(u,Math.cos(B)*n*p[oe]*W).addScaledVector(f,Math.sin(B)*o*p[oe]*W)))}h[0]=h[0].map(()=>Jt(e[0],e[1],0).addScaledVector(u,(v-.15)*n)),h[c]=h[c].map(()=>Jt(t[0],t[1],0).addScaledVector(u,(M-.15)*n));const w=[],x=[],g=[],y=[],b=[],z=[],k=.75+r()*.5,I=r()*10,P=(S,F)=>{w.push(S.x,S.y,S.z),x.push(F),g.push(S.clone().sub(Jt(e[0],e[1],0)).dot(u)/n),y.push(s),b.push(l.x,l.y,k,I),z.push(e[0],e[1],d,n)};for(let S=0;S<c;S++)for(let F=0;F<i;F++){const W=(F+1)%i,A=h[S][F],B=h[S][W],oe=h[S+1][F],ie=h[S+1][W],U=S/c,O=(S+1)/c;S<c-1&&(P(A,U),P(ie,O),P(oe,O)),S>0&&(P(A,U),P(B,U),P(ie,O))}const C=new Gn;return C.setAttribute("position",new wt(w,3)),C.setAttribute("aA",new wt(x,1)),C.setAttribute("aC",new wt(g,1)),C.setAttribute("aTag",new wt(y,1)),C.setAttribute("aAx",new wt(b,4)),C.setAttribute("aOr",new wt(z,4)),C.computeVertexNormals(),C}function op(){const e={uGlow:{value:1},uRoot:{value:1},uT:{value:0}},t=new t0({color:new an().setRGB(.012,6e-4,8e-4),roughness:.06,metalness:0,clearcoat:.35,clearcoatRoughness:.04,envMapIntensity:.22,ior:1.76,flatShading:!0});return t.onBeforeCompile=n=>{Object.assign(n.uniforms,e),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
gl_FragColor.a = 1.0 + clamp(vTag * uRoot * inner * 0.8, 0.0, 1.0);`)},Object.assign(t,{u:e})}function ap(e){const t=e.kit.q,n=Ho(t),o=t==="low",a=new zt,s={value:new vn(0,1,0,0)},r={value:new vn(0,0,0,0)},i=q=>{const he=q.material,ce=he.onBeforeCompile,ue=he.customProgramCacheKey.bind(he);return he.onBeforeCompile=(Ae,we)=>{ce.call(he,Ae,we),Ae.uniforms.uKR=r,Ae.fragmentShader=Ae.fragmentShader.replace("#include <common>",`#include <common>
uniform vec4 uKR;`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
{ vec3 kd = uKR.xyz + vViewPosition; float kr = length(kd); totalEmissiveRadiance += vec3(1.0, 0.0, 0.015) * uKR.w * (0.25 + 0.75 * max(dot(normal, kd / kr), 0.0)) / (1.0 + kr * kr / 2.5); }`)},he.customProgramCacheKey=()=>ue()+"-kr",q},c=(q,he)=>{const ce=new ot(q,bn({tier:t,rim:s,...he}));return ce.castShadow=!o,ce.receiveShadow=!o,ce},l=[],d=(q,he)=>{q.updateMatrix();const ce=Jt().setFromMatrixPosition(q.matrix);l.push({obj:q,base:q.matrix.clone(),c:ce,notch:he}),q.matrixAutoUpdate=!1,a.add(q)},u=Eo({size:"medium",detail:n,seed:3});u.computeBoundingBox();const f=u.boundingBox,p=f.max.y,m=(f.max.x-f.min.x)/2,h=[],v=[],M=q=>new ge().makeBasis(Jt(1,0,0),Jt(0,0,1),Jt(0,-1,0)).multiply(new ge().makeScale(1/Rt.H,1/Rt.H,1/Rt.H)).multiply(new ge().makeTranslation(0,-q/2,0)),w=q=>[q[0]*Rt.H,-q[1]*Rt.H],x=q=>{const he=f0(q),ce=(q.b[0]-q.a[0])/he,ue=(q.b[1]-q.a[1])/he;return{L:he,dx:ce,dy:ue,nx:-ue,ny:ce}};for(const q of ep){const he=r0[q.s],ce=x(he),ue=ut(q.seed),Ae=(Ce,rt=q.v)=>[he.a[0]+(he.b[0]-he.a[0])*Ce+ce.nx*rt,he.a[1]+(he.b[1]-he.a[1])*Ce+ce.ny*rt];let we,De=q.fin??"turned",Ve=.3,Ke=.5;if(q.k==="arbor"){const Ce=(q.t1-q.t0)*ce.L;we=La({length:Ce,ra:.014,leaves:8,pinionR:.034,pinionH:Ce*.16,pinionAt:Ce*(.2+.3*ue()),detail:n,seed:q.seed}).geo;const st=Ae(q.t0);we.applyMatrix4(new ge().makeBasis(Jt(ce.dy,-ce.dx,0),Jt(ce.dx,ce.dy,0),Jt(0,0,1)).setPosition(st[0],st[1],-.02)),De="turned",Ve=.5,Ke=.55}else if(q.k==="fork"){const Ce=(q.t1-q.t0)*ce.L,rt=Ce/4.4;we=Wr({detail:n,seed:q.seed,stone:!1}).pieces[0].geo.clone();const Te=Ae(q.t0);we.applyMatrix4(new ge().makeTranslation(.2,-.13,0)).applyMatrix4(new ge().makeScale(rt,rt,rt)).applyMatrix4(new ge().makeBasis(Jt(ce.dx,ce.dy,0),Jt(0,0,1),Jt(ce.dy,-ce.dx,0)).setPosition(Te[0],Te[1],0)),De="brushed",Ve=.35,Ke=.55}else{const Ce=q.w,rt=(q.holes??[]).filter(J=>J[1]==="b").map(J=>J[0]),st=J=>{let pe=q.k==="bridge"?1.08-.16*J:q.k==="frag"?.9+.2*Math.sin(J*5+q.seed):1;for(const Se of rt)pe+=.32*Math.exp(-(((J-Se)/.07)**2));return q.boss!==void 0&&(pe+=1.7*Math.exp(-(((J-q.boss)/.055)**2))),Ce*pe},Te=tp(he,q.t0,q.t1,q.v,st,q.ends??["sq","sq"],q.seed),Fe=(q.holes??[]).map(([J,pe])=>{const Se=pe==="s"?.34*Ce:pe==="b"?.17*Ce:q.boss!==void 0?.5*Ce:.36*Ce;return{at:w(Ae(q.t0+(q.t1-q.t0)*J)),r:Se*Rt.H,bush:pe==="b",sink:pe==="s"?Se*Rt.H*.35:void 0}}),ae=q.k==="bridge"?.072:q.k==="frag"?.06:q.k==="lever"?.046:.034,Y=A0({outline:Te.map(w).reverse(),holes:Fe,t:ae,bevel:q.k==="spoke"?.008:.018,detail:n,round:0});we=Y.bushes?Ed([Y.geo,Y.bushes]):Y.geo,we.applyMatrix4(M(ae));for(const[J,pe]of q.holes??[]){if(pe!=="s")continue;const Se=Ae(q.t0+(q.t1-q.t0)*J),Ee=.34*Ce*1.02/m,He=new ge().makeRotationY(ue()*Pr).premultiply(new ge().makeBasis(Jt(1,0,0),Jt(0,0,1),Jt(0,-1,0))).premultiply(new ge().makeScale(Ee,Ee,Ee)).setPosition(Se[0],Se[1],.006-p*Ee);h.push($0(q.D).multiply(He))}Ve=q.k==="lever"?.45:q.k==="spoke"?.3:.22,Ke=q.k==="spoke"?.35:q.k==="lever"?.6:.42}const Xe=c(we,{finish:De,seed:q.seed,age:q.k==="frag"?.55:De==="polished"?.08:.25,tone:Ke,direct:Ve,objScale:.14,envMap:1.1,wear:.3});Xe.position.set(0,0,0),Xe.matrix.copy($0(q.D)),Xe.matrix.decompose(Xe.position,Xe.quaternion,Xe.scale),q.s>=3&&i(Xe),d(Xe,(q.seed%2?1:-1)*(.03+.03*ue())),v.push({geo:we,D:q.D,s:q.s})}const g=new Fn(u,bn({finish:"polished",seed:709,tier:t,age:.3,tone:.75,objScale:.08,rim:s}),h.length);h.forEach((q,he)=>g.setMatrixAt(he,q)),g.castShadow=!o,a.add(g);const y=op(),b=[],z=[[4,-.04,.5,.015,8.9,.76],[4,.26,.64,-.035,7.6,.4],[4,.44,.9,.03,10.4,.62],[4,.68,1.04,-.02,8.2,.56],[4,.05,.55,-.06,10.9,.22],[4,.5,.97,.06,7.2,.2],[5,0,.5,0,9.3,.7],[5,.38,.8,.03,7.9,.46],[5,.6,1.04,-.015,10.2,.5],[5,.15,.6,-.06,11.2,.24],[5,.74,1,.058,8.6,.24],[6,-.02,.5,0,8.1,.58],[6,.36,.82,-.03,10.1,.5],[6,.64,1.04,.02,8.8,.48],[6,.12,.55,.062,9.6,.22],[6,.5,.95,-.065,7.3,.2]],k=Jt();z.forEach(([q,he,ce,ue,Ae,we],De)=>{const Ve=r0[q],Ke=Ve.b[0]-Ve.a[0],Xe=Ve.b[1]-Ve.a[1],Ce=Math.hypot(Ke,Xe),rt=-Xe/Ce,st=Ke/Ce,Te=pe=>[Ve.a[0]+Ke*pe+rt*ue,Ve.a[1]+Xe*pe+st*ue],Fe=De===6?1:0,ae=np(Te(he),Te(ce),Ve.hw*we*1,Ve.hw*(.2+.25*we),900+De,Fe),Y=new ot(ae,y);Y.matrixAutoUpdate=!1,Y.castShadow=!o;const J=$0(Ae);Y.matrix.copy(J),a.add(Y),v.push({geo:ae,D:Ae,s:q}),b.push({mesh:Y,end:J,spin:Jt(Math.sin(De*2.1),Math.cos(De*1.3),Math.sin(De*.7+1)).normalize(),seed:De}),Fe&&k.copy(Jt(...Te(he+(ce-he)*.2),0).applyMatrix4(J))});const I=[];for(const[q,he,ce]of I){const ue=r0[q],Ae=ue.b[0]-ue.a[0],we=ue.b[1]-ue.a[1],De=Math.hypot(Ae,we),Ve=[ue.a[0]+Ae*he,ue.a[1]+we*he],Ke=-we/De,Xe=Ae/De,Ce=Ae/De,rt=we/De,st=ue.hw*1.35,Te=.045,Fe=[[Ve[0]+Ke*st-Ce*Te,Ve[1]+Xe*st-rt*Te],[Ve[0]-Ke*st-Ce*Te,Ve[1]-Xe*st-rt*Te],[Ve[0]-Ke*st+Ce*Te,Ve[1]-Xe*st+rt*Te],[Ve[0]+Ke*st+Ce*Te,Ve[1]+Xe*st+rt*Te]],ae=A0({outline:Jf(Fe),holes:[],t:.05,bevel:.015,detail:n,round:1}).geo,Y=new ge().makeBasis(Jt(1,0,0),Jt(0,0,1),Jt(0,-1,0)).premultiply(new ge().makeScale(1/Rt.H,1/Rt.H,1/Rt.H));ae.applyMatrix4(new ge().makeTranslation(0,-.01,0));const J=c(ae,{finish:"striped",seed:760+q*3,age:.5,tone:.28,objScale:.1,direct:.35});J.matrix.copy($0(ce).multiply(Y)),J.matrix.decompose(J.position,J.quaternion,J.scale),d(J,.07)}const P=ut(7707);[[-1.75,.62,13,.42,60],[1.7,-.7,15,.55,72],[1.55,.78,9,.2,40],[-1.55,-.78,10,.26,48],[.12,-1.05,17,.5,80],[-.4,1.1,16,.38,64]].forEach(([q,he,ce,ue,Ae],we)=>{const De=so({teeth:Ae,r:ue*Rt.H,t:ue*Rt.H*.08,profile:"train",spokes:5,detail:n,seed:720+we}),Ve=c(De,{finish:"sunray",seed:720+we,age:.6,tone:.3,direct:.25,objScale:.14,envMap:.6}),Ke=1/Rt.H,Xe=new ge().makeRotationFromEuler(new Kn(1.15+we%2*.2,we*.8,.25+.2*we)),Ce=new ge().makeScale(Ke,Ke,Ke).premultiply(Xe).setPosition(q,he,0);Ve.matrix.copy($0(ce).multiply(Ce)),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),d(Ve,Pr/Ae)});const S=o?40:110,F=new Fn(Eo({size:"small",detail:Math.min(n,1),seed:9}),bn({finish:"blackened",seed:731,tier:t,age:.6,tone:.35,objScale:.1,rim:s}),S);for(let q=0;q<S;q++){const he=q%3===0?-1:1,ce=Math.pow(P(),.7),ue=he>0?.9+ce*1.1+(P()-.5)*.3:-1.25-ce*.7+(P()-.5)*.3,Ae=he>0?.35+ce*.45+(P()-.5)*.5:-.2-ce*.5+(P()-.5)*.6,we=6+P()*12,De=(.05+P()*.05)*(we/10),Ve=new ge().makeRotationFromEuler(new Kn(P()*6,P()*6,P()*6)).premultiply(new ge().makeScale(De*3,De*3,De*3));Ve.setPosition(ue,Ae,0);const Ke=$0(we).multiply(Ve);F.setMatrixAt(q,Ke)}F.castShadow=!o,a.add(F);const W={uGain:{value:.07}},A=new ot(new h0(1,1),new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:W,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; varying vec2 vUv;
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
}`}));A.matrixAutoUpdate=!1,A.frustumCulled=!1,A.renderOrder=4,A.matrix.copy($0(26).multiply(new ge().makeScale(7.5,7.5,1))),a.add(A);const B={uGain:{value:0},uT:{value:0},uS:{value:new Ft(1,1)},uM:{value:0},uWide:{value:1},uOil:{value:0},uSc:{value:0}},oe=new ot(new h0(1,1),new zn({transparent:!0,depthWrite:!1,blending:Wn,blendSrc:kt,blendDst:kt,blendSrcAlpha:p0,blendDstAlpha:kt,uniforms:B,vertexShader:"varying vec2 vUv; void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uGain; uniform float uT; uniform vec2 uS; uniform float uM; uniform float uWide; uniform float uOil; uniform float uSc; varying vec2 vUv;
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
}`}));oe.matrixAutoUpdate=!1,oe.frustumCulled=!1,oe.renderOrder=5,oe.matrix.copy($0(15).multiply(new ge().makeTranslation(0,.05,0)).multiply(new ge().makeScale(3.2,1.7,1))),a.add(oe);const ie=oe.matrix.clone(),U=new ge,O=new R,D=Qf({q:t,coat:v,group:a,shardMat:y,shards:b.map(q=>q.mesh)}),E=Jt(),N=new ge,V=new Xt,K=Jt(),j=Jt(),me=Jt(),xe=new Xt,Me=Jt();return{group:a,update(q){const he=q.i===ir,ce=q.i===ir+1&&!q.inHold;if(a.visible=he||ce,!a.visible)return;q.camera.getWorldPosition(j),K.copy(nt.bladeDir).negate().transformDirection(q.camera.matrixWorldInverse),s.value.set(K.x,K.y,K.z,.9);const ue=he&&!q.inHold?q.u:1,Ae=ue>=.04?1:0;for(const Ce of l){if(Ce.obj.visible=q.inHold||q.i!==ir||Ce.c.distanceToSquared(j)>2.6,Ae){Ce.obj.matrix.copy(Ce.base);continue}V.setFromAxisAngle(Rt.F,-Ce.notch),N.makeTranslation(-Ce.c.x,-Ce.c.y,-Ce.c.z).premultiply(new ge().makeRotationFromQuaternion(V)).premultiply(new ge().makeTranslation(Ce.c.x,Ce.c.y,Ce.c.z)),Ce.obj.matrix.copy(Ce.base).premultiply(N)}mn.ready?E.copy(mn.stoneWorld):E.copy(Rt.L);const we=Ae?1-Math.pow(1-Math.min(1,(ue-.04)/.62),3):0;for(const Ce of b){if(Ce.mesh.visible=Ae===1,we>=1){Ce.mesh.matrix.copy(Ce.end);continue}Ce.end.decompose(me,xe,Me);const rt=E.clone().lerp(me,we),st=new Xt().setFromAxisAngle(Ce.spin,(1-we)*(2.5+Ce.seed*.3));Ce.mesh.matrix.compose(rt,st.multiply(xe),Me.clone().multiplyScalar(.25+.75*we))}y.u.uGlow.value=Ae?(.6+.4*we)*1.3:0,D.update(q,j);const De=D.cover,Ve=q.camera.aspect<1?1.45:1,Ke=Math.min(1,Math.max(0,(ue-.35)/.65)),Xe=Ke*Ke*(3-2*Ke);if(r.value.set(0,0,0,0),Ae){const Ce=k.clone().applyMatrix4(a.matrixWorld).applyMatrix4(q.camera.matrixWorldInverse);r.value.set(Ce.x,Ce.y,Ce.z,.03*we)}B.uGain.value=Ae?.31*(.68+.32*we)*Math.min(1,ue/.06)*(1.04-.04*Xe)*(.97+.1*De)*(Ve>1?.9-.1*De:1)*(1-.3*D.forge):0,B.uM.value=De,B.uOil.value=D.oil,B.uSc.value=D.scales,W.uGain.value=.062*(1-.1*De)*(Ve>1?1.07+.25*De:1),B.uWide.value=Ve>1?2.05-.2*De:1.22,B.uS.value.set(1+.08*De,(1+.15*De)*Ve),oe.matrix.copy(ie).multiply(U.makeScale(B.uS.value.x,B.uS.value.y,1)),O.copy(j).sub(Rt.E).multiplyScalar(1-15/7.6),oe.matrix.premultiply(U.makeTranslation(O.x,O.y,O.z))}}}const cr=cc+1.6;function sp(e){const{kit:t}=e,n=new zt,o=ut(88),a=t.q==="low"?500:1100,s=new Fn(new go(1,1,1,2,1,2),t.stone,a),r=new ge,i=new Xt,c=new Kn,l=new R,d=new R;let u=0;const f=15;for(let b=-va;b<va&&u<a;b+=f)for(let z=-va;z<va&&u<a;z+=f*.75){const k=Math.round(z/(f*.75)),I=b+(k%2?f/2:0)+(o()-.5)*2,P=z+(o()-.5)*1.5;if(Math.hypot(I,P)>va)continue;const C=Math.hypot(I,P),S=C<Xa?2.4*(1-C/Xa):0;c.set((o()-.5)*.06,(o()-.5)*.2,(o()-.5)*.06),i.setFromEuler(c),l.set(I,cc-2.4-S+o()*.4,P),d.set(f*.9,4,f*.66),r.compose(l,i,d),s.setMatrixAt(u++,r)}s.count=u,s.receiveShadow=!0,n.add(s);let p;t.q==="low"?p=new ot(new ia(Xa,64),t.oil):p=new Wo(new ia(Xa,64),{textureWidth:t.q==="high"?1024:640,textureHeight:t.q==="high"?1024:640,color:4868166,clipBias:.003}),p.rotation.x=-Math.PI/2,p.position.y=cr,n.add(p);const m=t.q==="low"?500:1200,h=220,v=new Fn(new go(.12,1,.12),new In({color:3815736,transparent:!0,opacity:.5,depthWrite:!1}),m);v.frustumCulled=!1;const M=Array.from({length:m},()=>[(o()-.5)*2*160,o()*h,(o()-.5)*2*160,.6+o()*.8]);n.add(v);const w=new ot(new ms(.9,1,64),new In({color:3815478,transparent:!0,opacity:.5,depthWrite:!1}));w.rotation.x=-Math.PI/2,n.add(w);const x=new zt,g=new Ds;g.moveTo(-.02,-3),g.lineTo(-.05,0),g.lineTo(-.012,9),g.lineTo(.012,9),g.lineTo(.05,0),g.lineTo(.02,-3);const y=new ot(new rc(g),t.blood);return y.position.set(0,-2.6,-1),x.add(y),new Wa,{group:n,update(b){const z=b.i<=3||b.i===9;n.visible=z,x.parent!==b.camera&&b.camera.add(x);const k=b.shot.wipe;if(x.visible=k>.08&&k<.78,x.visible){const S=(k-.08)/.7;y.rotation.z=1.25-S*2.6,y.scale.setScalar(1.4)}if(!z)return;const I=b.i===9,P=b.state.time;for(let S=0;S<m;S++){const[F,W,A,B]=M[S],oe=I?((W-P*140*B)%h+h)%h:W;l.set(F,cr+oe,A),d.set(I?1:2.2,I?9*B:3,I?1:2.2),r.compose(l,i.identity(),d),v.setMatrixAt(S,r)}v.instanceMatrix.needsUpdate=!0;const C=b.trick("8");if(w.visible=C.k>0,w.visible){const S=C.phase*5%1;w.position.set((b.state.pointer.x-.5)*90,cr+.05,(b.state.pointer.y-.5)*70+20),w.scale.setScalar(2+S*26),w.material.opacity=.5*(1-S)*C.k}}}}function*rp(e){const t=Ud(e);yield;const n=nd(e);yield;const o=sp(e);yield;const a=Kd(e,t);yield;const s=rf(e);yield;const r=kf(e);yield;const i=Wf(e);yield;const c=Hf(e);yield;const l=ap(e);yield;const d=[o,n,t,a,s,r,i,c,l,ld(e,n,t)],u=new zt;for(const g of d)u.add(g.group);e.scene.add(u);let f=[];const p=new Map,m=new Tr,h=(g,y)=>d.forEach((b,z)=>{if(z===y||!b.group.visible)return;let k=p.get(b);k||(k=[],b.group.traverse(I=>{const P=I;if(!P.isMesh)return;const C=P;C.isInstancedMesh?C.boundingSphere||C.computeBoundingSphere():P.geometry.boundingSphere||P.geometry.computeBoundingSphere(),k.push({o:P,s:C.isInstancedMesh?C.boundingSphere:P.geometry.boundingSphere})}),p.set(b,k));for(const{o:I,s:P}of k)I.visible&&(I.updateWorldMatrix(!0,!1),m.copy(P).applyMatrix4(I.matrixWorld),br(g.camera,[m])||(I.visible=!1,f.push({group:I,update(){}})))});let v=null;const M=new R(...fe[7].pose.pos),w=new wl,x=g=>{if(v||(v=[],d[6].group.updateMatrixWorld(!0),d[6].group.traverse(y=>{const b=y;!b.isMesh||b.isInstancedMesh||(w.setFromObject(b).expandByScalar(.6),w.containsPoint(M)&&v.push(b))})),g.i===7&&!g.inHold)for(const y of v)y.visible&&(y.visible=!1,f.push({group:y,update(){}}))};return{root:u,update(g){for(const y of f)y.group.visible=!0;if(f=[],d.forEach((y,b)=>{b===0&&g.i===9||y.update(g)}),g.i===9&&d.forEach((y,b)=>{(!g.inHold&&g.u<i0.cut?b!==8:b===0||b>=3&&b<=8)&&y.group.visible&&(y.group.visible=!1,f.push(y))}),g.i===6&&(d[7].group.visible=!1,g.inHold&&d.forEach((y,b)=>{b!==6&&y.group.visible&&(y.group.visible=!1,f.push(y))})),(g.i===2&&(g.inHold||g.u>=.7)||g.i===3&&!g.inHold&&g.u<.3)&&(n.air.visible=!1),g.i<=3&&d[0].group.visible&&(d[0].group.visible=!1,f.push(d[0])),g.i<=1&&d[3].group.visible&&(d[3].group.visible=!1,f.push(d[3])),g.i===7&&!g.inHold&&g.u>.8&&g.u<.95&&h(g,7),g.i===7&&(g.inHold||g.u>=.95)&&d.forEach((y,b)=>{b!==7&&y.group.visible&&(y.group.visible=!1,f.push(y))}),g.i===8){const y=!g.inHold&&g.u<J0.cut?7:8;d.forEach((b,z)=>{z!==y&&b.group.visible&&(b.group.visible=!1,f.push(b))})}g.i===5&&!g.inHold&&g.u>.55&&h(g,5),x(g),(g.i===4||g.i===5)&&g.inHold&&d.forEach((y,b)=>{b!==g.i&&y.group.visible&&(y.group.visible=!1,f.push(y))})}}}const Q0=(()=>{const e=new URLSearchParams(location.search).get("cam")?.split(",").map(Number);return e&&e.length>=6&&e.every(Number.isFinite)?e:null})(),no=(e,t,n)=>e+(t-e)*n,lr=(e,t,n)=>[no(e[0],t[0],n),no(e[1],t[1],n),no(e[2],t[2],n)];function ip(e,t,n,o=.5){return{blade:{from:lr(e.blade.from,t.blade.from,n),to:lr(e.blade.to,t.blade.to,n),angle:no(e.blade.angle,t.blade.angle,n),power:no(e.blade.power,t.blade.power,n),pen:no(e.blade.pen??.55,t.blade.pen??.55,n)},red:{at:lr(e.red.at,t.red.at,n),power:no(e.red.power,t.red.power,n),reach:no(e.red.reach,t.red.reach,n)},haze:no(e.haze,t.haze,n),env:n<o?e.env:t.env}}async function cp(e,t){const n=t.pause??(async()=>{}),o=t.quality,a=new yl({canvas:e,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});a.outputColorSpace=bl,a.toneMapping=Ml,a.shadowMap.enabled=o!=="low"&&!0,a.shadowMap.type=Sl,a.shadowMap.autoUpdate=!0,a.info.autoReset=!1,a.setClearColor(0,1);const s=new ca;s.background=new an(0);const r=new Ar(30,1,.01,2e3);s.add(r),await n();const i=Id(o);await n();const c=Pd(a,s,o);await n();const l=rp({kit:i,renderer:a,scene:s,lang:t.lang});let d=l.next();for(;!d.done;)await n(),d=l.next();const u=d.value;await n();const f=Md(a,o);await n(),await n();const p=matchMedia("(pointer: coarse)").matches,m=o==="high"?66e5:o==="mid"?42e5:17e5,h=o==="high"?1.5:o==="mid"?1.25:p?2:1.25;let v=1,M=1,w=1,x="",g=-1;function y(){x="";const _=e.clientWidth||innerWidth,te=e.clientHeight||innerHeight;w=Math.min(h,devicePixelRatio||1,Math.sqrt(m/Math.max(1,_*te))),a.setPixelRatio(w),a.setSize(_,te,!1),v=Math.round(_*w),M=Math.round(te*w),f.setSize(v,M),r.aspect=_/te,r.updateProjectionMatrix()}y();let b=0,z=!1;e.addEventListener("webglcontextlost",_=>{_.preventDefault(),z=!0,t.onLost?.()}),e.addEventListener("webglcontextrestored",()=>{z=!1,t.onRestored?.(),y(),hd()});const k=fe.map(_=>_.id),I={},P=.06,C=.08,S=k.indexOf("3"),F=.35,W=.75,A=_=>k.indexOf(_),B=A("7"),oe=A("6"),ie=.25,U=1,O=A("2"),D=A("8"),E=(_,te,Z,qe)=>_d(qe||_.station!==te||te===O||te===D&&_.rare?_:{..._,t:_.t+U},te,Z,qe);let N=null,V=-1e9,K=0,j=!1;function me(_,te){const Z=H0(_.p);return{state:_,i:Z.i,inHold:Z.inHold,u:Z.u,shot:te,camera:r,local:qe=>{const Be=fe[A(qe)];return Ge((_.p-Be.a0)/(Be.h1-Be.a0))},hold:qe=>{const Be=fe[A(qe)];return Ge((_.p-Be.h0)/(Be.h1-Be.h0))},trick:qe=>{const Be=A(qe);return E(_.stop,Be,Z.i===Be&&Z.inHold,_.reduced)}}}const xe=new R;function Me(_,te,Z){const qe=r.aspect<1,Be=iu(r,te,_,qe),ze=H0(_.p),We=fe[ze.i],T=Z?Z.light:ze.inHold||ze.i===0||_.reduced?We.light:ip(fe[ze.i-1].light,We.light,ne(Ge((ze.u-(We.lightFrom??0))/((We.lightIn??1)-(We.lightFrom??0)))),We.envAt),le=_.stop,re=le.station>=0&&(le.station===ze.i||le.rel>0),se=re?fe[le.station]:We;let ye=re?ne((le.t-(se.stopDelay??0))/1)*(le.rel>0?1-ne(le.rel/se.trick.release):1):0;re&&le.rel>0&&(ye=1-Math.pow(1-ye,se.returnPow??1));let Pe=1,Je=1;const et=E(le,0,ze.i===0,_.reduced);if(et.k>0&&(Je*=1+Math.sin(et.phase*Math.PI*2)*.25*et.k),ze.i===0){const nn=ne(Ge(_.p/Math.max(1e-6,We.h1)*1.25));Je*=.25+.75*nn,Pe*=.5+.5*nn}c.apply(T,se.stop,ye,{bladeMul:Pe,angleMul:Je,seed:_.time,cam:r.position});const Ct=qe&&!_.reduced&&!ze.inHold&&We.id==="5"?ne((ze.u-.27)/.05)*(1-ne((ze.u-.42)/.06)):0;nt.bladeFrom.copy(c.blade.position),nt.bladeDir.copy(c.blade.target.position).sub(c.blade.position).normalize(),nt.bladeCos=Math.cos(c.blade.angle),nt.bladePower=c.blade.intensity*.015*(1-Ct),nt.time=_.time;const pt=_.reduced?-1:Ld(le);if(pt>=0){const nn=new R(...T.red.at),Un=nn.distanceTo(r.position)*1.7+4;c0.centre.value.copy(nn),c0.radius.value=pt*Un,c0.width.value=Un*(We.pulseWidth??.14),c0.gain.value=Math.sin(pt*Math.PI)*.9*(We.pulseGain??1),nt.pulseC.copy(nn),nt.pulseR=pt*Un,nt.pulseW=Un*.045,nt.pulseG=Math.sin(pt*Math.PI)*(We.pulseGain??1)}else c0.radius.value=-1,c0.gain.value=0,nt.pulseR=-1,nt.pulseG=0;u.update(me(_,te));const vt=te.mm,bt=(ze.i>0?fe[ze.i-1].sharp:null)??[1,1],It=We.sharp??[1,1],Qt=ne(Ge(ze.u/(We.sharpIn??1))),tn=ze.inHold||_.reduced?It:[bt[0]+(It[0]-bt[0])*Qt,bt[1]+(It[1]-bt[1])*Qt],dn=ze.i>0&&!_.reduced?fe[ze.i-1]:null,Yn=dn?.blurMul??1,io=dn?.aperture??1,dt={focus:Be,focusN:Be*tn[0],focusF:Be*tn[1],blurMul:ze.inHold?We.blurMul??1:Yn+((We.blurMul??1)-Yn)*ne(ze.u),aperture:(4+vt*.09)*(ze.inHold?We.aperture??1:io+((We.aperture??1)-io)*ne(ze.u)),exposure:(Z?Z.exposure:lp(ze))*Ll(ze.i,ze.u,ze.inHold,qe?"liftPhone":"liftPc"),neutral:ze.inHold||ze.i===0?We.neutral??0:(fe[ze.i-1].neutral??0)+((We.neutral??0)-(fe[ze.i-1].neutral??0))*ne(ze.u/(We.exposureIn??1)),bloom:1,grain:.025,seed:_.reduced?0:_.time*60%997,vig:.85,cover:Math.max(te.cover,b),fade:0,rim:We.rim??0,flash:void 0};dt.aperture*=1-.8*Ct;const sn=!_.reduced&&!ze.inHold&&fe[ze.i].id==="7"&&ze.u>J0.rise[0]&&ze.u<J0.drain[1],gn=q===0&&ze.i>=oe&&ze.i<=D?K:0;if(sn||gn>0){xe.copy(mn.stoneWorld).project(r);const nn=xe.x*.5+.5,Un=xe.y*.5+.5,bo=r.aspect,G=Math.hypot(Math.max(nn,1-nn)*bo,Math.max(Un,1-Un))+.3,de=lt=>ne(Ge((ze.u-lt[0])/(lt[1]-lt[0]),0,1)),Ie=ze.i>B||ze.i===B&&ze.u>=J0.cut;let $e=sn?G*de(J0.rise):Ie?G:0,Ye=sn?G*de(J0.drain):Ie?G:0;if(gn>0){const lt=ne(gn);$e+=(G-$e)*lt,Ye*=1-lt}dt.flash=[nn,Un,$e,Ye]}return dt}let q=0;const he=()=>{q===2?ht():q===3?Ve():q<2&&f.drawScene(s,r)};let ce=null,ue=!1;const Ae=(_,te)=>{q<2&&f.finish(r,_,q===1&&(te===null||te===f.fadeTarget)?f.scratch:te)},we=new Set,De=[];function Ve(){let _=`${s.environment?.id??-1}`;s.traverseVisible(te=>{te.isLight&&(_+=`,${te.id}`)}),s.traverseVisible(te=>{const Z=te;if(!(!Z.geometry||!Z.material))for(const qe of Array.isArray(Z.material)?Z.material:[Z.material]){const Be=`${_}|${te.id}.${qe.id}`;we.has(Be)||De.push(Be)}})}let Ke=-1,Xe=0,Ce=!1;const rt=a.extensions.has("KHR_parallel_shader_compile");let st=null;const Te=new ca,Fe=[],ae=new Map,Y=new Set,J=new Map,pe=new In({colorWrite:!1}),Se=[kl,zl,M0];let Ee="";const He=(_,te)=>{const Z=Object.create(_);return Z.children=[],te&&(Z.material=te),Z},ct=_=>{const te=_,Z=_.geometry;return`${_.type}|${te.isInstancedMesh?1:0}${te.instanceColor?1:0}${te.morphTexture?1:0}${te.isSkinnedMesh?1:0}${te.isBatchedMesh?1:0}|${Object.keys(Z.attributes).sort().join()}|${Object.entries(Z.morphAttributes).map(([qe,Be])=>qe+Be.length).join()}|${Z.morphTargetsRelative?1:0}`},mt=(_,te,Z,qe)=>{Y.has(_)||(Y.add(_),Fe.push({o:te,L:Z,env:qe}))};function ht(){const _=[];s.traverseVisible(ze=>{ze.isLight&&_.push(ze)});const te=_.map(ze=>`${ze.id}:${ze.castShadow?1:0}:${ze.map?1:0}`).join(),Z=s.environment;ae.has(te)||ae.set(te,_);const qe=Z?`${Z.image?.height??0}`:"-",Be=ze=>{const We=ze;if(!We.geometry||!(We.isMesh||ze.isPoints||ze.isLine||ze.isSprite))return;const T=ct(We);for(const le of Array.isArray(We.material)?We.material:[We.material])if(le){if(mt(`${te}|${qe}|${le.id}.${le.version}|${T}`,He(ze,le),te,Z),a.shadowMap.enabled&&ze.castShadow){const re=ze.customDepthMaterial,se=le,ye=le.alphaToCoverage?.5:le.alphaTest,Pe=re?`c${re.id}|${T}`:`d|${T}|${le.shadowSide??Se[le.side]}|${ye>0?1:0}|${se.map&&ye>0?1:0}|${se.alphaMap&&ye>0?1:0}|${se.displacementMap?1:0}`;if(!J.has(Pe)){let Je=re;if(!Je){const et=new Pl({depthPacking:Al});et.side=le.shadowSide??Se[le.side],et.alphaTest=ye,et.map=se.map??null,et.alphaMap=se.alphaMap??null,et.displacementMap=se.displacementMap??null,et.displacementScale=se.displacementScale??1,Je=et}J.set(Pe,He(ze,Je))}mt(`${te}|${Pe}`,J.get(Pe),te,null)}if(f.depthPass&&We.isMesh&&!(le.transparent||!le.depthWrite)){const re=`z|${T}`;J.has(re)||J.set(re,He(ze,pe.clone())),mt(`${te}|${qe}|${re}`,J.get(re),te,Z)}}};s.traverseVisible(Be),Ke<0&&(Ke=Fe.length),s.traverse(Be)}function xt(){for(const _ of ae.keys())for(const[te,Z]of J)te[0]!=="z"&&mt(`${_}|${te}`,Z,_,null)}const yt=()=>{let _=0;for(const te of a.info.programs??[])te.isReady()||_++;return _};function $(_,te){if(z)return Fe.length;const Z=performance.now(),qe=a.info.programs?.length??0,Be=a.getRenderTarget();for(!Ce&&te>0&&(f.compile(),Ce=!0),a.setRenderTarget(f.mainTarget);Fe.length&&performance.now()-Z<_&&(a.info.programs?.length??0)-qe<te;){const ze=Fe.shift();if(Xe++,ze.L!==Ee){Te.clear();for(const We of ae.get(ze.L)??[])Te.add(He(We));Ee=ze.L}Te.environment=ze.env,a.compile(ze.o,r,Te),Xe===Ke&&(st=[...a.info.programs??[]])}return!st&&Ke===0&&Ce&&(st=[...a.info.programs??[]]),a.setRenderTarget(Be),Fe.length}function L(_,te){if(z)return;const Z=a.info.render.calls,qe=a.info.render.triangles,Be=x,ze=a.render;_>=2&&(a.render=()=>{});const We=[];_===1&&a.shadowMap.enabled&&s.traverse(re=>{const se=re;if(!se.isLight||!se.castShadow||!se.shadow)return;let ye=Q.get(se);ye||(ye=se.shadow.clone(),ye.autoUpdate=!0,Q.set(se,ye)),We.push([se,se.shadow]),se.shadow=ye});const T=Object.entries(nt).map(([re,se])=>[re,se instanceof R||se instanceof vn?se.clone():Array.isArray(se)?se.map(ye=>[...ye]):se]),le=[];_!==4&&s.traverse(re=>{const se=re,ye=se.geometry;if(se.isInstancedMesh&&(le.push([se.instanceMatrix,se.instanceMatrix.version,se.instanceMatrix.array.slice()]),se.instanceColor&&le.push([se.instanceColor,se.instanceColor.version,se.instanceColor.array.slice()])),ye?.attributes)for(const Pe of Object.values(ye.attributes))Pe.isInstancedBufferAttribute&&le.push([Pe,Pe.version,Pe.array.slice()])}),q=_,x=_===4?Be:"",_!==4&&(ue=!0);try{ve(te)}finally{q=0,a.render=ze;for(const[re,se]of We)re.shadow=se;for(const[re,se,ye]of le)re.version!==se&&(re.array.set(ye),re.needsUpdate=!0);for(const[re,se]of T){const ye=nt;se instanceof R||se instanceof vn?ye[re].copy(se):ye[re]=se}x=Be,a.info.render.calls=Z,a.info.render.triangles=qe}}const Q=new Map,ee=new WeakSet;function be(_){const te=[],Z=(We,T=Ha(),le=3)=>te.push({..._,p:We,time:le,stop:T,speed:0}),qe=(We,T,le=0)=>({station:We,t:T,rare:!0,rel:le}),Be=fe.length-1,ze=A("7");return fe.forEach((We,T)=>{const le=Pe=>We.a0+(We.h0-We.a0)*Pe,re=(We.h0+We.h1)/2;if(T>0)for(const Pe of _.reduced?[.5]:[.03,.35,.7,.96])Z(le(Pe));const se=I[We.id];if(se&&!_.reduced&&Z(le((se[0]+se[1])/2)),T===Be&&!_.reduced)for(const Pe of[i0.cut+.01,(i0.trail[0]+i0.trail[1])/2,i0.trail[1]-.02])Z(le(Pe));Z(re),Z(re,qe(T,pn.pulse+pn.pulseLen*.5));const ye=_.reduced||T===O||T===Be?0:U;if(Z(re,qe(T,6-ye)),We.trick.rare>0)for(const Pe of[.2,.6,.95])Z(re,qe(T,pn.rare+We.trick.rare*Pe-ye));if(Z(re,qe(T,6-ye,We.trick.release*.5)),T===ze&&!_.reduced)for(let Pe=0;Pe<6;Pe++)Z(re,qe(T,to+Ls*Pe+1-ye)),Z(re,qe(T,to+Ls*Pe+Da+W-ye));if(T===Be&&!_.reduced&&We.trick.rare>0){const Pe=pn.rare+.69*We.trick.rare;Z(re,qe(T,Pe+F*.5)),Z(re,qe(T,Pe+F+.5))}}),te}const Le={states:be,compile(_){L(2,_)},finishCompile(){z||xt()},firstReady(){return!!st&&st.every(_=>_.isReady()&&(rt||ee.has(_)))},parallel:rt,pump:$,ready(){return yt()===0},busy:yt,touch(_,te=1e9){const Z=performance.now();let qe=0;for(const Be of a.info.programs??[]){if(qe>=te)break;if(ee.has(Be))continue;const ze=Be;if(ze.isReady()&&(ze.getUniforms(),ee.add(Be),qe++,performance.now()-Z>_))break}return qe},draw(_){if(De.length=0,L(3,_),!De.length)return!1;for(const te of De)we.add(te);return L(1,_),!0},reset(){we.clear(),Y.clear(),Fe.length=0,Ee="",Ke=-1,Xe=0,Ce=!1,st=null},release(){for(const _ of Q.values())_.dispose();Q.clear()},qa:{step(_,te=7){te&1&&L(2,_),De.length=0,te&2&&L(3,_),te&4&&L(1,_)},forget(){x=""}}};function Re(_,te){if(_===x)return;const Z=Me(te,Vo(te));he(),Ae(Z,f.fadeTarget),x=_}function ve(_,te){if(z)return;if(te&&q===0){const bt=fe[B],It=(_.p-bt.a0)/(bt.h0-bt.a0),Qt=It>=J0.cut,tn=dn=>dn>=J0.full[0]&&dn<=J0.full[1];N&&Qt!==N.side&&!(tn(It)&&tn(N.u))&&!_.reduced&&(V=_.time),N={side:Qt,u:It},K=_.reduced?0:1-Ge((_.time-V)/ie)}else!te&&q===0&&!j&&(K=0);q===0&&(ue&&ce&&(ue=!1,L(4,ce)),ce=_),a.info.reset(),pa.value=M,xc.value=o==="low"?.75:.5;const Z=H0(_.p);if(_.reduced&&!Z.inHold&&Z.i>0&&Z.u<.999){if(x!==`rm:${Z.i}`){const Qt={..._,p:(fe[Z.i-1].h0+fe[Z.i-1].h1)/2},tn=Me(Qt,X0(Z.i-1,.5));he(),Ae(tn,f.fadeTarget),x=`rm:${Z.i}`}const bt={..._,p:(fe[Z.i].h0+fe[Z.i].h1)/2},It=Me(bt,X0(Z.i,.5));he(),Ae({...It,fade:te?te(`rm:${Z.i}`,1-Z.u,!0):1-ne(Z.u)},null);return}const qe=fe.length-1;if(!_.reduced&&Z.i===qe&&!Z.inHold&&Z.u>=i0.cut&&Z.u<i0.trail[1]+.01){const bt=fe[qe],It=fe[qe-1],Qt=au(Z.u);_s.v=Z.u;const tn={..._,p:bt.a0+(bt.h0-bt.a0)*i0.cut*.5},dn=Me(tn,Qt.a,{light:It.light,exposure:It.exposure??1});he(),Ae(dn,f.fadeTarget),x="";const Yn=Me(_,Qt.b,{light:bt.light,exposure:bt.exposure??1});he(),Ae({...Yn,fade:1,sweep:Z.u<i0.trail[0]?-9:mr(Z.u,i0.trail)},null),_s.v=-1;return}const Be=!_.reduced&&!Z.inHold?I[fe[Z.i].id]:void 0;if(Be&&Z.u>Be[0]&&Z.u<Be[1]){const bt=fe[Z.i],It=Yn=>bt.a0+(bt.h0-bt.a0)*Yn,Qt={..._,p:It(Be[1])};Re(`gap:${Z.i}`,{..._,p:It(Be[0])});const tn=Me(Qt,Vo(Qt)),dn=(Z.u-Be[0])/(Be[1]-Be[0]);he(),Ae({...tn,fade:te?ne(te(`gap:${Z.i}`,1-dn,!1)):1-ne(dn)},null);return}const ze=fe[qe],We=_.stop;if(!_.reduced&&We.station===qe&&We.rel>0&&We.rare&&ze.trick.rare>0&&We.t>=pn.rare){Re(`endrel:${We.t}`,{..._,p:ze.h0,stop:{...We,rel:0}});const bt={..._,stop:Ha()},It=Me(bt,Vo(bt));he(),Ae({...It,fade:1-ne(We.rel/ze.trick.release)},null);return}const T=pn.rare+.69*ze.trick.rare;if(!_.reduced&&Z.i===qe&&Z.inHold&&_.stop.station===qe&&_.stop.rare&&ze.trick.rare>0&&_.stop.t>=T&&_.stop.t<T+F){Re("land",{..._,stop:{..._.stop,t:T-1e-4}});const bt=Me(_,Vo(_));he(),Ae({...bt,fade:1-ne((_.stop.t-T)/F)},null);return}const le=_.stop,re=fe[Z.i],se=le.station>=0&&le.rel>0?1-ne(le.rel/fe[le.station].trick.release):0,ye=se>0&&le.station===Z.i-1&&!Z.inHold&&Z.i!==qe&&re.id!=="7",Pe=ye?se:0;ye?g=le.station:(se===0||le.station!==g)&&(g=-1);const Je=!ye&&g===Z.i&&Z.inHold&&!(Z.i===S&&Z.u<C),et=!Z.inHold&&Z.i>0&&Z.i!==qe&&re.id!=="7"&&(Z.u<P||Pe>0),Ct=Z.inHold&&Z.i===S&&Z.u<C;if(!_.reduced&&!Q0&&(et||Ct||Je)){const bt=le.rel>0?`:${le.t}${ye||Je?`:${le.rel}`:""}`:"";Re(`${et?"arr":Je?"bck":"hst"}:${Z.i}:${le.station}${bt}`,{..._,p:(et?re.a0:Je?fe[Z.i+1].a0:re.h0)-1e-7});const It=Me(_,Vo(_)),Qt=Z.u<(et?P:C)?1-ne(Z.u/(et?P:C)):0,tn=Z.u<(et?P:C),dn=te&&!Je&&tn?ne(te(`${et?"arr":"hst"}:${Z.i}`,1-Z.u/(et?P:C),!1)):Qt;if(te&&!Je&&tn&&dn>=1&&Pe===0){j=!0;try{ve({..._,p:(et?re.a0:re.h0)-1e-7})}finally{j=!1}return}he(),Ae({...It,fade:Je?se:Math.max(dn,Pe)},null);return}const pt=Vo(_);Q0&&(pt.pos.set(Q0[0],Q0[1],Q0[2]),pt.look.set(Q0[3],Q0[4],Q0[5]),pt.mm=Q0[6]||pt.mm);const vt=Me(_,pt);he(),Ae(vt,null)}function _e(){return{calls:a.info.render.calls,triangles:a.info.render.triangles,w:v,h:M,dpr:w,programs:a.info.programs?.length??0}}const Ue=a.getContext(),Ne=new Uint8Array(4);function Qe(_,te){const Z=[];for(let Be=0;Be<te;Be++){const ze=performance.now();ve({..._,time:_.time+Be/60}),Ue.readPixels(0,0,1,1,Ue.RGBA,Ue.UNSIGNED_BYTE,Ne),Z.push(performance.now()-ze)}return Z.sort((Be,ze)=>Be-ze),{avg:Z.reduce((Be,ze)=>Be+ze,0)/te,worst:Z[te-1],p95:Z[Math.floor(te*.95)],calls:a.info.render.calls}}return{render:ve,resize:y,info:_e,bench:Qe,renderer:a,ix:A,warm:Le,setVeil(_){b=Ge(_)}}}function lp(e){const t=fe[e.i].exposure??1,n=fe[e.i-1]?.exposure??1,o=Ns(e.i,e.u,e.inHold);return(e.inHold?t:n+(t-n)*ne(e.u/(fe[e.i].exposureIn??1)))*o}const up=1.2,dp=2.6,fp=2,pp=2.3,Zc=.4,qi=.12,Gi={pc:950,phone:800};function hp(e){if(!e.visible||e.finger||e.mouse||e.stopRunning||!e.armed||(e.cuts??0)>=2||e.quiet<((e.cuts??0)===1?dp:up)||e.sinceResize<Zc||!(e.p>=0&&e.p<=1)||e.p<fe[0].h0)return null;const t=H0(e.p);if(t.inHold)return null;if(e.dir<0){const o=fe[t.i-1];return o?o.h1-qi*(o.h1-o.h0):null}const n=fe[t.i];return n.h0+qi*(n.h1-n.h0)}const Qc=e=>{const t=H0(e);return t.inHold||e<fe[0].h0?-1:t.i},mp=(e,t)=>{if(e<0||!(t>=fe[0].h0))return!1;const n=H0(t);return n.i===e||n.inHold&&n.i===e-1},vp=.5,gp=(e,t)=>e||t!==null&&t>vp,xp={armed:!1,cuts:0,where:-1};function Zo(e,t,n,o=!1,a=1/0){if(o)return{...e,armed:!1};if(t==="cut"&&!(a>=fp))return e;const s=Qc(n);return t==="travel"?mp(e.where,n)?{...e,armed:!0}:{armed:!0,cuts:0,where:s}:t==="cut"?s<0?e:{armed:e.armed,cuts:s===e.where?e.cuts+1:1,where:s}:t==="land"?{...e,armed:!1}:{...e,armed:!0}}const wp=(e,t)=>e.where>=0&&Qc(t)===e.where?e.cuts:0,ur=(e,t,n,o=!1)=>Zo(e,"cut",t.p0,o,Math.abs(n-t.y0)),fs=e=>{const t=H0(e);return t.inHold?t.i:-1},yp=e=>e>=1?1:e<=0?0:e*e*e*(4-3*e),bp=e=>e>=1?1:e<=0?0:2*e*e-e**4,ea=400;function Mp(e,t){const n=Math.abs(e);let o=.9,a=.9,s=0,r=[],i=0;for(let c=0;c<24;c++){s=Ge(n/t+.6*o+.467*a,.7,pp);let l=o,d=a;if(l+d>s){const p=s/(l+d);l*=p,d*=p}r=[0];let u=0;for(let p=1;p<=ea;p++){const m=(p-.5)/ea*s;u+=yp(m/l)*bp((s-m)/d),r.push(u)}for(let p=0;p<=ea;p++)r[p]/=u;if(i=n/(u*s/ea),Ui(r,.4/s)*n<28||c===23){o=l,a=d;break}o*=1.08,a=Math.max(.45,a*.97)}return{T:s,vmax:i,rin:o,rout:a,at:c=>Ui(r,c)}}function Ui(e,t){const n=Ge(t)*ea,o=Math.min(ea-1,Math.floor(n));return e[o]+(e[o+1]-e[o])*(n-o)}function Sp(){const e=document.createElement("div");e.className="ss-hud",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);let t=0;return{update(n,o,a){if(t++%6)return;const s=H0(n.p),r=fe[s.i];e.textContent=[`p ${n.p.toFixed(4)}  ${r.id} ${s.inHold?"hold":"approach"} ${s.u.toFixed(2)}`,`stop ${n.stop.station>=0?fe[n.stop.station].id:"-"}  ${Td(n.stop)}  t ${n.stop.t.toFixed(2)}`,`tier ${n.quality}${n.reduced?" reduced":""}  ${a.toFixed(1)} ms  calls ${o.calls}  ${o.w}x${o.h}@${o.dpr.toFixed(2)}`].join(`
`)}}}const kp=2,D0=document.documentElement,Nn=new URLSearchParams(location.search),jo=(e,t)=>{const n=parseFloat(Nn.get(e)??"");return Number.isFinite(n)?n:t},zs=D0.lang==="ar"?"ar":"en",Na=matchMedia("(pointer: coarse)").matches,zp=Math.min(screen.width,screen.height)<520,$i=navigator.hardwareConcurrency||4,ps=Nn.get("q"),Ps=ps==="high"||ps==="mid"||ps==="low"?ps:Na&&zp||$i<=4?"low":$i>=8&&!Na?"high":"mid",g0=Nn.get("rm")==="1"||Nn.get("rm")!=="0"&&matchMedia("(prefers-reduced-motion: reduce)").matches,hs=Nn.has("still");Vl(Nn.get("drift")!=="0");function As(){D0.classList.add("ss-static"),window.__secondReady=!0}function Pp(e){try{if(e){const o=e.getContext("webgl2",{alpha:!0,depth:!0,stencil:!1,antialias:!1,premultipliedAlpha:!0,preserveDrawingBuffer:!1,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1});return!!o&&!!(o.getExtension("EXT_color_buffer_float")||o.getExtension("EXT_color_buffer_half_float"))}const t=document.createElement("canvas").getContext("webgl2");if(!t)return!1;const n=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("WEBGL_lose_context")?.loseContext(),n}catch{return!1}}function Ra(e){const t=e.time??0,n=e.stopAt!==void 0&&e.stopAt>=0?{station:e.stopAt,t:e.st??t,rare:!0,rel:e.rel??0}:Ha();return{p:e.p??0,time:t,stop:n,pointer:e.pointer??{x:.5,y:.5},lang:zs,quality:Ps,reduced:e.reduced??g0,speed:0,...e.film?{film:e.film}:{}}}async function Ap(){const e=document.getElementById("ss-canvas");if(!e||!Pp(e)||Nn.get("static")==="1"){As();return}const t=document.querySelector(".ss-open img"),n=!D0.classList.contains("ss-opened")&&!!t&&t.complete&&t.naturalWidth>0,o=(scrollY<=2||n)&&!D0.classList.contains("ss-opened");o||D0.classList.add("ss-opened"),addEventListener("pagehide",()=>{try{sessionStorage.setItem("ss-y"+location.pathname,String(Math.round(scrollY)))}catch{}});const a=hs||!o||Nn.has("kit")||Nn.has("out")||Nn.has("words")?null:document.querySelector(".ss-open img");a||D0.classList.add("ss-live"),a&&await Promise.race([a.decode().catch(()=>{}),new Promise(T=>setTimeout(T,1500))]),hs||await new Promise(T=>requestAnimationFrame(()=>setTimeout(T,0)));let s=performance.now();const r=hs?void 0:async()=>{performance.now()-s<40||(await new Promise(T=>setTimeout(T,0)),s=performance.now())};let i;try{i=await cp(e,{quality:Ps,lang:zs,onLost:As,onRestored:()=>D0.classList.remove("ss-static"),pause:r})}catch{As();return}window.__secondRender=T=>i.render(Ra(T),T.live?(le,re)=>re:void 0),window.__secondBench=(T,le)=>i.bench(Ra(T),le),window.__secondInfo=()=>i.info();const c=Nn.get("hud")==="1"?Sp():null;if(hs){const T=Nn.get("stop"),le=T===null?-1:fe.findIndex(se=>se.id===T);await Promise.race([Promise.all(window.__secondWait??[]),new Promise(se=>setTimeout(se,6e3))]);const re=Ra({p:jo("p",0),time:jo("time",0),stopAt:le,st:Nn.has("st")?jo("st",0):void 0,rel:jo("rel",0),pointer:{x:jo("px",.5),y:jo("py",.5)}});if(await Promise.race([Promise.all(globalThis.__secondWait??[]),new Promise(se=>setTimeout(se,6e3))]),Nn.get("trace")==="1"){window.__secondTraceQA={states:se=>i.warm.states({...Ra({}),reduced:se}).map(ye=>({p:ye.p,time:ye.time,stopAt:ye.stop.station,st:ye.stop.t,rel:ye.stop.rel,reduced:ye.reduced})),step:(se,ye)=>i.warm.qa.step(Ra(se),ye),forget:()=>i.warm.qa.forget()},window.__secondReady=!0;return}if(Nn.get("warm")==="1"){const se=i.warm.states({...re,stop:Ha(),speed:0});for(const ye of se)i.warm.compile(ye);for(i.warm.finishCompile();i.warm.pump(1e9,1e9)>0;);for(let ye=0;ye<2e3&&!i.warm.ready();ye++)await new Promise(Pe=>setTimeout(Pe,10));for(const ye of se)i.warm.draw(ye)}i.render(re),requestAnimationFrame(()=>{i.render(re),requestAnimationFrame(()=>{i.render(re),requestAnimationFrame(()=>{window.__secondReady=!0})})}),c?.update(re,i.info(),0);return}let l=null;if(!g0){const{default:T}=await Jc(async()=>{const{default:le}=await import("./lenis.BxbUXgKI.js");return{default:le}},[]);l=new T({lerp:.085,wheelMultiplier:.85,touchMultiplier:1.2,autoRaf:!1})}const d=Fd(),u=Nn.get("qa")==="1"?window.__secondLog=[]:null,f={x:.5,y:.5},p={x:.5,y:.5};let m=!1,h=-1;const v=()=>e.clientWidth||innerWidth,M=()=>e.clientHeight||innerHeight;addEventListener("pointermove",T=>{T.pointerType==="mouse"&&(p.x=T.clientX/v(),p.y=T.clientY/M())},{passive:!0}),document.addEventListener("pointerleave",()=>{p.x=.5,p.y=.5}),addEventListener("touchstart",T=>{const le=T.touches[0];le&&(p.x=le.clientX/v(),p.y=le.clientY/M())},{passive:!0}),addEventListener("touchmove",()=>{m=!0,h=performance.now()},{passive:!0}),addEventListener("touchend",()=>{m=!1},{passive:!0});const w=Nn.get("pull")!=="0",x=matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1024px)").matches?Gi.phone:Gi.pc;let g=performance.now(),y=0,b=xp,z=!1,k=0,I=!1,P=!1,C=-1e9,S=!1,F=document.readyState==="complete",W=!1;addEventListener("load",()=>{F=!0}),addEventListener("scroll",()=>{F&&(W=!0)},{passive:!0});let A=null,B=0;const oe=()=>Na?`${innerWidth}`:`${innerWidth}x${innerHeight}`,ie=!l||Na,U=()=>ie?scrollY:l.animatedScroll;let O=scrollY;const D=()=>{A&&(A=null,ie||l?.reset(),O=U(),d.cut())},E=()=>{g=performance.now(),z=!0,S=!0,A&&(b=ur(b,A,U(),g0)),D()},N=new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," ","Spacebar"]);addEventListener("wheel",E,{passive:!0,capture:!0}),addEventListener("touchstart",()=>{I=!0,E()},{passive:!0,capture:!0}),addEventListener("touchmove",()=>{g=performance.now()},{passive:!0,capture:!0});const V=()=>{I=!1,g=performance.now()};addEventListener("touchend",T=>{T.touches.length||V()},{passive:!0,capture:!0}),addEventListener("touchcancel",T=>{T.touches.length||V()},{passive:!0,capture:!0}),addEventListener("keydown",T=>{N.has(T.key)&&E()},{capture:!0}),addEventListener("mousedown",()=>{P=!0,E()},{passive:!0,capture:!0}),addEventListener("mouseup",()=>{P=!1,g=performance.now()},{passive:!0,capture:!0}),addEventListener("pointermove",T=>{T.pointerType==="mouse"&&T.buttons===0&&(P=!1)},{passive:!0}),document.addEventListener("visibilitychange",()=>{g=performance.now(),D()});const K=()=>{C=performance.now(),A&&oe()!==A.key&&(D(),b=Zo(b,"resize",k,g0))};addEventListener("resize",K,{passive:!0}),visualViewport?.addEventListener("resize",K,{passive:!0});function j(T,le,re){const se=U();if(k=re,A&&(A.el+=Math.min(.1,Math.max(0,T-A.last)/1e3),A.last=T),A&&ie){if(Math.abs(scrollY-A.set)>1.5)g=T,z=!0,y=Math.sign(scrollY-A.set),b=Zo(ur(b,A,A.set,g0),"travel",Za(scrollY/Te),g0),A=null,O=scrollY;else{const vt=A.el/Math.max(.001,A.g.T),bt=vt>=1?A.y1:A.y0+(A.y1-A.y0)*A.g.at(vt);scrollTo({top:bt,behavior:"instant"}),A.set=scrollY,O=scrollY,vt>=1&&(A=null,B=3)}return}if(A){if(Math.abs(scrollY-se)>2){const vt=scrollY-se;b=ur(b,A,se,g0),D(),g=T,z=!0,y=Math.sign(vt),b=Zo(b,"travel",Za(scrollY/Te),g0);return}O=se,A.el>A.g.T+.6&&D();return}const ye=ie?se:l.targetScroll,Pe=ye-O;if(Math.abs(Pe)>.5&&(y=Math.sign(Pe),gp(z,he?(T-he)/1e3:null)&&(z||W&&T-C>Zc*1e3)&&(b=Zo(b,"travel",re,g0)),g=T,O=ye),!w||g0)return;const Je=hp({p:re,dir:y,quiet:(T-g)/1e3,finger:I,mouse:P,sinceResize:(T-C)/1e3,visible:!document.hidden&&!!he,stopRunning:le,armed:b.armed,cuts:wp(b,re)*(S?1:2)});if(Je===null)return;const et=Math.round(Ol(Je)*Te),Ct=se;if(b=Zo(b,"land",re),Math.abs(et-Ct)<1){scrollTo({top:et,behavior:"instant"}),O=scrollY,B=3;return}const pt=Mp(et-Ct,x);if(A={target:Je,p0:re,y0:Ct,y1:et,at:T,g:pt,set:scrollY,el:0,last:T,key:oe()},!ie&&l){const vt=A;l.scrollTo(et,{duration:pt.T,easing:pt.at,force:!0,onComplete:()=>{A===vt&&(A=null,B=3,O=l.targetScroll)}})}}let me=0;const xe=()=>{clearTimeout(me),me=window.setTimeout(()=>i.resize(),120)};addEventListener("resize",xe,{passive:!0}),visualViewport?.addEventListener("resize",xe,{passive:!0});const Me=globalThis.__secondWait??[];let q=!1,he=0,ce=0;const ue=250;let Ae=0,we=!1;Promise.race([Promise.all(Me),new Promise(T=>setTimeout(T,6e3))]).then(()=>{q=!0,Ae=performance.now()}),i.setVeil(1);let De=performance.now(),Ve=De,Ke=0,Xe=0,Ce=0,rt=0,st=0,Te=1,Fe="";const ae=()=>{const T=Na?`${innerWidth}`:`${innerWidth}x${innerHeight}`;return T!==Fe&&(Fe=T,Te=Math.max(1,document.documentElement.scrollHeight-(e.clientHeight||innerHeight))),Math.min(1,Math.max(0,(l?l.scroll:scrollY)/Te))},Y=()=>Za(ae()),J=matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1024px)"),pe=()=>J.matches?(Qr.phone-100)/1e3:(Qr.pc-100)/1300;let Se=performance.now(),Ee=Se;const He=.35;let ct=0,mt=0,ht=1,xt=0,yt="",$=-1,L=0;const Q=4,ee=(T,le,re)=>{if(re)return yt=T,$=ct,L=le>=.5?1:0;(T!==yt||$!==ct-1)&&(yt=T,L=le),$=ct;const se=mt/He;return L=ht>=0?Math.max(0,Math.min(L-se,le)):Math.min(1,Math.max(L+se,le)),L};function be(T){if(requestAnimationFrame(be),document.hidden){Ve=T;return}j(T,d.running(),Ke),Se+=A?Math.min(100,T-Ee):T-Ee,Ee=T,l?.raf(Se);const le=Math.min(.1,Math.max(.001,(T-Ve)/1e3));Ve=T;const re=ae(),se=Za(re),ye=(se-Ke)/le;Ke=se,Ce+=(ye-Ce)*Math.min(1,le*8);const Pe=!!A||B>0,Je=Pe?0:(re-Xe)/le*pe();Xe=re,rt=Pe?0:rt+(Je-rt)*Math.min(1,le*8),B>0&&(B--,d.land());const et=Math.min(1,le*2.8);(he||!a)&&(f.x+=(p.x-f.x)*et,f.y+=(p.y-f.y)*et),m&&T-h>250&&(m=!1);const Ct=!!A&&fs(se)>=0&&fs(se)===fs(A.target);Ct&&d.land(Math.max(0,A.g.T-A.el));const pt=d.update(le,se,rt,m||!!A&&!Ct||!!a&&!he),vt=Re!=="compiling"||i.warm.firstReady();a&&!he&&!ce&&Math.abs(U())>2&&(ce=T,D0.classList.add("ss-dark")),q&&!he&&(!ce||T-ce>=ue)&&(vt&&(we||!a)||T-Ae>1500)&&(he=T,window.__secondUp=T,a&&(De=T-kp*1e3));const bt={p:se,time:(T-De)/1e3,stop:pt,pointer:{...f},lang:zs,quality:Ps,reduced:g0,speed:Ce};u&&(u.push({t:T,p:se,sf:re,st:pt.station,t2:pt.t,rel:pt.rel,y:U(),pl:A?A.target:-1}),u.length>4e4&&u.splice(0,1e4)),i.setVeil(he?a?ce?1-dr((T-he)/ue):0:1-dr((T-he)/1400):1);const It=performance.now();ct++,mt=le;{const Qt=U(),tn=Qt-xt;Math.sign(tn)===ht?xt=Qt:Math.abs(tn)>Q&&(ht=Math.sign(tn),xt=Qt)}if((vt||he)&&(i.render(bt,ee),we=!0),u?.length&&(u[u.length-1].xf=$===ct?dr(L):-1),a&&he===T&&We(),st+=(performance.now()-It-st)*.1,c){c.update(bt,i.info(),st);const Qt=document.querySelector(".ss-hud");Qt&&(Qt.textContent=(Qt.textContent??"").split(`
pull`)[0]+`
pull ${A?`-> p ${A.target.toFixed(4)} hold ${fe[fs(A.target)].id}`:w?"-":"off"}`)}ze(T,se,Ce)}const Le=Nn.get("warm")!=="0";let Re="done",ve=[],_e=[],Ue=[],Ne=0,Qe=!1,_=0;const te=T=>{Re=T,window.__secondWarm=T,(window.__secondWarmAt??={})[T]=Math.round(performance.now())},Z=100,qe=.3;function Be(){if(!Le){te("done");return}ve=i.warm.states({p:0,time:0,stop:Ha(),pointer:{x:.5,y:.5},lang:zs,quality:Ps,reduced:g0,speed:0});const T=Y(),le=Math.max(0,ve.findIndex(re=>re.p>=T-.002));_e=ve.map((re,se)=>(le+se)%ve.length),Ue=ve.map(()=>!1),Ne=0,Qe=!1,i.warm.reset(),te("compiling")}function ze(T,le,re){if(Re==="compiling"){const Je=performance.now();for(;Ne<_e.length&&performance.now()-Je<4&&i.warm.pump(0,0)<400;)performance.now(),i.warm.compile(ve[_e[Ne++]]);i.warm.parallel||i.warm.touch(he?0:4,he?1:3);const et=i.warm.parallel?he?Math.min(4,8-i.warm.busy()):Math.min(8,24-i.warm.busy()):he?1:3,Ct=et>0?i.warm.pump(Math.max(1,6-(performance.now()-Je)),et):1;Ne>=_e.length&&Ct===0&&!Qe?(i.warm.finishCompile(),Qe=!0):Qe&&Ct===0&&i.warm.ready()&&(te("warming"),_=T);return}if(Re!=="warming"||T-_<Z||Math.abs(re)>qe)return;_=T,i.warm.touch(3);let se=-1,ye=9;for(let Je=0;Je<ve.length;Je++)if(!Ue[Je]){const et=(ve[Je].p-le+1.002)%1;et<ye&&(ye=et,se=Je)}const Pe=performance.now();for(;se>=0;){if(Ue[se]=!0,performance.now(),i.warm.draw(ve[se])||performance.now()-Pe>6)return;se=-1,ye=9;for(let et=0;et<ve.length;et++)if(!Ue[et]){const Ct=(ve[et].p-le+1.002)%1;Ct<ye&&(ye=Ct,se=et)}}i.warm.ready()&&i.warm.touch(3)===0&&(i.warm.release(),te("done"))}function We(){g0&&D0.classList.add("ss-reduced"),D0.classList.add("ss-live"),window.__secondLive=performance.now(),Nn.get("first")==="1"&&(window.__secondFirst=e.toDataURL("image/png")),setTimeout(()=>D0.classList.add("ss-opened"),1e3)}Be(),Os(Be),requestAnimationFrame(be)}const dr=e=>{const t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)};Ap().catch(()=>As());
