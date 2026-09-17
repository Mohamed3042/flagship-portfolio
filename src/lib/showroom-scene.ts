/** One renderer, visible scene regions only. Illustrations are not analysis or product sessions. */
import * as THREE from 'three';
type Mechanism = { object: THREE.Group; update: (progress: number, time: number) => void };
const clamp = THREE.MathUtils.clamp;
function truss(): Mechanism {
  const object = new THREE.Group(), nodes: THREE.Vector3[] = [], edges: [number, number][] = [];
  const segments = 20, rings = 3;
  for (let layer = 0; layer < 2; layer++) for (let ring = 0; ring < rings; ring++) for (let i = 0; i < segments; i++) {
    const a = i / segments * Math.PI * 2, radius = [.55, 1.5, 2.55][ring];
    nodes.push(new THREE.Vector3(Math.cos(a) * radius, 1.3 - ring * .29 - layer * .32, Math.sin(a) * radius));
  }
  const at = (l: number, r: number, i: number) => l * rings * segments + r * segments + (i % segments);
  for (let l = 0; l < 2; l++) for (let r = 0; r < rings; r++) for (let i = 0; i < segments; i++) {
    edges.push([at(l,r,i),at(l,r,i+1)]);
    if (r < rings-1) { edges.push([at(l,r,i),at(l,r+1,i)]); edges.push([at(l,r,i),at(l,r+1,i+1)]); }
    if (l === 0) edges.push([at(0,r,i),at(1,r,i)]);
  }
  for (let i = 0; i < segments; i += 5) {
    const top = at(1,2,i), foot = nodes[top].clone(); foot.y = -1.2;
    const id = nodes.push(foot)-1; edges.push([top,id]);
  }
  const steel = new THREE.MeshStandardMaterial({color:0x84ccec,roughness:.32,metalness:.5});
  const brass = new THREE.MeshStandardMaterial({color:0xffd39a,roughness:.26,metalness:.45});
  const bars = new THREE.InstancedMesh(new THREE.CylinderGeometry(.021,.021,1,6),steel,edges.length);
  const joints = new THREE.InstancedMesh(new THREE.SphereGeometry(.046,8,6),brass,nodes.length);
  bars.instanceMatrix.setUsage(THREE.DynamicDrawUsage); joints.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bars.frustumCulled = false; joints.frustumCulled = false; object.add(bars,joints);
  const temp = new THREE.Object3D(), up = new THREE.Vector3(0,1,0), direction = new THREE.Vector3();
  let last = -1;
  return { object, update(p) {
    if (Math.abs(last-p)<.001) return; last=p;
    const assembled = nodes.map((n,i) => n.clone().add(new THREE.Vector3(0,(1-p)*(i<60?1.5:-.6),0)));
    assembled.forEach((n,i) => { temp.position.copy(n); temp.quaternion.identity(); temp.scale.setScalar(1); temp.updateMatrix(); joints.setMatrixAt(i,temp.matrix); });
    edges.forEach(([a,b],i) => {
      direction.subVectors(assembled[b],assembled[a]); temp.position.copy(assembled[a]).add(assembled[b]).multiplyScalar(.5);
      temp.quaternion.setFromUnitVectors(up,direction.clone().normalize()); temp.scale.set(1,direction.length(),1); temp.updateMatrix(); bars.setMatrixAt(i,temp.matrix);
    });
    bars.instanceMatrix.needsUpdate=true; joints.instanceMatrix.needsUpdate=true;
  }};
}
function carton(): Mechanism {
  const object = new THREE.Group(), walls: {pivot:THREE.Group;axis:'x'|'z';sign:number;lid?:THREE.Group}[] = [];
  const paper = new THREE.MeshStandardMaterial({color:0x6dbee2,roughness:.6,metalness:.12,side:THREE.DoubleSide});
  const edgeMaterial = new THREE.LineBasicMaterial({color:0xc7eeff,transparent:true,opacity:.75});
  function panel(w:number,h:number,d:number) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),paper);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),edgeMaterial)); return mesh;
  }
  const base=panel(2,.035,2); base.position.y=-.75; object.add(base);
  for(let i=0;i<4;i++) {
    const pivot=new THREE.Group(), front=i<2, sign=i%2===0?1:-1;
    pivot.position.set(front?0:sign, -.75, front?sign:0);
    const wall=panel(front?2:.035,1.5,front ? .035 : 2); wall.position.y=.75; pivot.add(wall); object.add(pivot);
    const lid=new THREE.Group(); lid.position.y=1.5;
    const flap=panel(front?2:.032,.98,front ? .032 : 2); flap.position.y=.49; lid.add(flap); pivot.add(lid);
    walls.push({pivot,axis:front?'x':'z',sign:front?sign:-sign,lid});
  }
  return {object,update(p){const w=clamp(p*1.45,0,1),l=clamp((p-.65)/.35,0,1);walls.forEach(v=>{v.pivot.rotation[v.axis]=(1-w)*v.sign*Math.PI/2;v.lid!.rotation[v.axis]=-l*v.sign*Math.PI/2;});}};
}
function approvalFlow(): Mechanism {
  const object=new THREE.Group();
  const metal=new THREE.MeshStandardMaterial({color:0x8585e9,metalness:.35,roughness:.3});
  const light=new THREE.MeshStandardMaterial({color:0x74ddff,emissive:0x1598d5,emissiveIntensity:.6,metalness:.2,roughness:.3});
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-2.8,0,0),new THREE.Vector3(-1.3,.2,-.2),new THREE.Vector3(0,.2,0),new THREE.Vector3(1.5,.2,.2),new THREE.Vector3(2.8,0,0)]);
  object.add(new THREE.Mesh(new THREE.TubeGeometry(curve,48,.026,6,false),light));
  [-2.6,0,2.6].forEach(x=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(.68,.07,8,40),metal);ring.position.set(x,.2,0);object.add(ring);});
  const gate=new THREE.Group();gate.position.set(0,-.46,0);
  const arm=new THREE.Mesh(new THREE.BoxGeometry(.13,1.35,.14),new THREE.MeshStandardMaterial({color:0xffc17b,emissive:0x5e2700,roughness:.35}));
  arm.position.y=.675;gate.add(arm);object.add(gate);
  const packet=new THREE.Mesh(new THREE.OctahedronGeometry(.21),light);object.add(packet);
  for(let i=0;i<7;i++){const tile=new THREE.Mesh(new THREE.BoxGeometry(.34,.06,.44),metal);tile.position.set(-2.4+i*.8,-.72,.08);object.add(tile);}
  return {object,update(p,t){gate.rotation.z=-clamp((p-.6)/.2,0,1)*Math.PI/2;packet.position.copy(curve.getPoint(p));packet.rotation.set(t*.3,t*.4,0);}};
}
function backdrop(scene:THREE.Scene) {
  const positions:number[]=[],colors:number[]=[];
  let seed=27;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<1100;i++){const r=1.8+rnd()*5.5,a=r*1.1+(i%3)*Math.PI*2/3+(rnd()-.5)*.8;positions.push(Math.cos(a)*r,(rnd()-.5)*1.3-1.25,Math.sin(a)*r);colors.push(.35+rnd()*.45,.45+rnd()*.4,1);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const stars=new THREE.Points(geo,new THREE.PointsMaterial({size:.025,vertexColors:true,transparent:true,opacity:.55,depthWrite:false}));scene.add(stars);
  const orbit=new THREE.Mesh(new THREE.RingGeometry(3.05,3.06,96),new THREE.MeshBasicMaterial({color:0x539dca,transparent:true,opacity:.35,side:THREE.DoubleSide}));
  orbit.rotation.x=-Math.PI/2;orbit.position.y=-1.22;scene.add(orbit);
  return stars;
}
export function createShowroomScenes(root:HTMLElement,isPaused:()=>boolean) {
  const canvas=root.querySelector<HTMLCanvasElement>('[data-showroom-renderer]')!;
  const hosts=Array.from(root.querySelectorAll<HTMLElement>('[data-exhibit]'));
  const mobile=innerWidth<700;
  const fallback=()=>{root.dataset.graphics='fallback';hosts.forEach(h=>{h.dataset.webgl='fallback';h.querySelector<HTMLElement>('[data-exhibit-controls]')!.hidden=true;h.querySelector<HTMLElement>('[data-exhibit-note]')!.textContent=document.documentElement.lang==='ar'?'تعذّر العرض ثلاثي الأبعاد. تظهر صورة المنتج بدلًا منه.':'3D unavailable. Showing the product screenshot instead.';});};
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:mobile?'low-power':'high-performance'});} catch {fallback();return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.35:1.75));
  renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  const abort=new AbortController(),{signal}=abort;
  let frame=0,disposed=false,contextLost=false,width=0,height=0,lastPaint=0;
  const views=hosts.map(host=>{
    const viewport=host.querySelector<HTMLElement>('[data-exhibit-viewport]')!;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,60);
    camera.position.set(4.3,3.6,7);camera.lookAt(0,.25,0);
    scene.add(new THREE.HemisphereLight(0xd4edff,0x1c1840,2.8));
    const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(3,7,5);scene.add(key);
    const rim=new THREE.DirectionalLight(0x78bfff,3);rim.position.set(-4,2,-4);scene.add(rim);
    const warm=new THREE.DirectionalLight(0xffc490,2);warm.position.set(3,1,-3);scene.add(warm);
    const stars=backdrop(scene);
    const models:Record<string,Mechanism>={truss:truss(),box:carton(),flow:approvalFlow()};
    let kind=host.dataset.kind||'truss';if(!models[kind])kind='truss';
    scene.add(models[kind].object);
    host.dataset.webgl='ready';host.querySelector<HTMLElement>('[data-exhibit-controls]')!.hidden=false;
    const note=host.querySelector<HTMLElement>('[data-exhibit-note]')!;note.textContent=note.dataset.interactive??'';
    return {host,viewport,scene,camera,stars,models,kind,drag:0,progress:.8,visible:true};
  });
  root.dataset.graphics='webgl';
  function request(){if(!frame&&!disposed&&!contextLost&&!document.hidden)frame=requestAnimationFrame(render);}
  let motionTime=0,lastTick=0;
  function render(now:number){
    frame=0;if(disposed||contextLost||document.hidden)return;
    if(!isPaused()&&now-lastPaint<(mobile?32:15)){request();return;}
    if(!isPaused()&&lastTick)motionTime+=Math.min(now-lastTick,50)/1000;
    lastTick=now;lastPaint=now;
    if(width!==innerWidth||height!==innerHeight){width=innerWidth;height=innerHeight;renderer.setSize(width,height,false);}
    renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
    let visible=false;
    for(const view of views){
      const rect=view.viewport.getBoundingClientRect();
      if(rect.bottom<=0||rect.top>=height||rect.width<=0||rect.right<=0||rect.left>=width)continue;
      visible=true;view.visible=true;
      view.camera.aspect=rect.width/rect.height;view.camera.updateProjectionMatrix();
      const model=view.models[view.kind];
      model.object.rotation.y=-.25+view.drag+Math.sin(motionTime*.2)*.1;
      model.update(view.progress,motionTime);view.stars.rotation.y=motionTime*.015;
      renderer.setViewport(rect.left,height-rect.bottom,rect.width,rect.height);
      const left=Math.max(0,rect.left),right=Math.min(width,rect.right),top=Math.max(0,rect.top),bottom=Math.min(height,rect.bottom);
      renderer.setScissor(left,height-bottom,right-left,bottom-top);
      renderer.render(view.scene,view.camera);
    }
    if(visible&&!isPaused())request();
  }
  const visibility=new IntersectionObserver(entries=>{for(const entry of entries){const v=views.find(v=>v.viewport===entry.target);if(v)v.visible=entry.isIntersecting;}request();},{threshold:0});
  const size=new ResizeObserver(request);
  views.forEach(view=>{visibility.observe(view.viewport);size.observe(view.viewport);
    const slider=view.host.querySelector<HTMLInputElement>('[data-assembly]')!;
    slider.addEventListener('input',()=>{view.progress=Number(slider.value)/100;request();},{signal});
    let pointer:number|null=null,startX=0,startDrag=0;
    view.viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pointer=e.pointerId;startX=e.clientX;startDrag=view.drag;view.viewport.setPointerCapture(e.pointerId);},{signal});
    view.viewport.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;view.drag=startDrag+(e.clientX-startX)*.008;request();},{signal});
    const release=()=>{pointer=null;};
    view.viewport.addEventListener('pointerup',release,{signal});view.viewport.addEventListener('pointercancel',release,{signal});
  });
  window.addEventListener('scroll',request,{passive:true,signal});window.addEventListener('resize',request,{passive:true,signal});
  root.addEventListener('showroom:motion',()=>{lastTick=0;request();},{signal});
  document.addEventListener('visibilitychange',()=>{lastTick=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();},{signal});
  document.addEventListener('mm:themechange',()=>{const light=document.documentElement.dataset.theme==='light';views.forEach(v=>{(v.stars.material as THREE.PointsMaterial).opacity=light ? .18 : .55;});request();},{signal});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;fallback();},{signal});
  canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;root.dataset.graphics='webgl';hosts.forEach(h=>{h.dataset.webgl='ready';h.querySelector<HTMLElement>('[data-exhibit-controls]')!.hidden=false;const note=h.querySelector<HTMLElement>('[data-exhibit-note]')!;note.textContent=note.dataset.interactive??'';});request();},{signal});
  request();
  return {
    select(kind:string){views.forEach(view=>{if(!view.models[kind])return;view.scene.remove(view.models[view.kind].object);view.kind=kind;view.drag=0;view.scene.add(view.models[kind].object);});request();},
    dispose(){
      disposed=true;cancelAnimationFrame(frame);abort.abort();visibility.disconnect();size.disconnect();
      const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
      function collect(object:THREE.Object3D){object.traverse(node=>{const drawable=node as THREE.Mesh;if(drawable.geometry)geometries.add(drawable.geometry);if(drawable.material)(Array.isArray(drawable.material)?drawable.material:[drawable.material]).forEach(m=>materials.add(m));});}
      views.forEach(v=>{collect(v.scene);Object.values(v.models).forEach(m=>collect(m.object));});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();
    }
  };
}
