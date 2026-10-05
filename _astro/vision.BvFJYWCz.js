import{a2 as Le,a3 as ue,a4 as ne,a5 as O,a6 as Ue,a7 as ae,a8 as we,p as m,S as ye,a9 as G,aa as xe,V as oe,ab as H,M as Se,a as I,ac as Be,ad as Te,u as se,e as De,f as Oe,G as Ce,X as ke,P as Pe,ae as Ie,af as Re,t as B,v as E,z as fe}from"./WorldChrome.astro_astro_type_script_index_0_lang.CnYqJr12.js";import{a as We}from"./world.BDXwONRz.js";import{p as qe,a as Fe}from"./_lineart.0OiBFh36.js";import"./preload-helper.DArFJGja.js";const pe=new ae,F=new m;class be extends Le{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new ue(e,3)),this.setAttribute("uv",new ue(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new ne(t,6,1);return this.setAttribute("instanceStart",new O(n,3,0)),this.setAttribute("instanceEnd",new O(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new ne(t,6,1);return this.setAttribute("instanceColorStart",new O(n,3,0)),this.setAttribute("instanceColorEnd",new O(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Ue(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ae);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),pe.setFromBufferAttribute(t),this.boundingBox.union(pe))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new we),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let l=0;for(let o=0,c=e.count;o<c;o++)F.fromBufferAttribute(e,o),l=Math.max(l,n.distanceToSquared(F)),F.fromBufferAttribute(t,o),l=Math.max(l,n.distanceToSquared(F));this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}H.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new oe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};G.line={uniforms:xe.merge([H.common,H.fog,H.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class _e extends ye{constructor(e){super({type:"LineMaterial",uniforms:xe.clone(G.line.uniforms),vertexShader:G.line.vertexShader,fragmentShader:G.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Q=new I,he=new m,me=new m,d=new I,u=new I,z=new I,Y=new m,ee=new Te,f=new Be,ve=new m,N=new ae,V=new we,A=new I;let M,D;function ge(r,e,t){return A.set(0,0,-e,1).applyMatrix4(r.projectionMatrix),A.multiplyScalar(1/A.w),A.x=D/t.width,A.y=D/t.height,A.applyMatrix4(r.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}function Ne(r,e){const t=r.matrixWorld,n=r.geometry,l=n.attributes.instanceStart,o=n.attributes.instanceEnd,c=Math.min(n.instanceCount,l.count);for(let s=0,g=c;s<g;s++){f.start.fromBufferAttribute(l,s),f.end.fromBufferAttribute(o,s),f.applyMatrix4(t);const v=new m,p=new m;M.distanceSqToSegment(f.start,f.end,p,v),p.distanceTo(v)<D*.5&&e.push({point:p,pointOnLine:v,distance:M.origin.distanceTo(p),object:r,face:null,faceIndex:s,uv:null,uv1:null})}}function Ve(r,e,t){const n=e.projectionMatrix,o=r.material.resolution,c=r.matrixWorld,s=r.geometry,g=s.attributes.instanceStart,v=s.attributes.instanceEnd,p=Math.min(s.instanceCount,g.count),a=-e.near;M.at(1,z),z.w=1,z.applyMatrix4(e.matrixWorldInverse),z.applyMatrix4(n),z.multiplyScalar(1/z.w),z.x*=o.x/2,z.y*=o.y/2,z.z=0,Y.copy(z),ee.multiplyMatrices(e.matrixWorldInverse,c);for(let S=0,R=p;S<R;S++){if(d.fromBufferAttribute(g,S),u.fromBufferAttribute(v,S),d.w=1,u.w=1,d.applyMatrix4(ee),u.applyMatrix4(ee),d.z>a&&u.z>a)continue;if(d.z>a){const y=d.z-u.z,b=(d.z-a)/y;d.lerp(u,b)}else if(u.z>a){const y=u.z-d.z,b=(u.z-a)/y;u.lerp(d,b)}d.applyMatrix4(n),u.applyMatrix4(n),d.multiplyScalar(1/d.w),u.multiplyScalar(1/u.w),d.x*=o.x/2,d.y*=o.y/2,u.x*=o.x/2,u.y*=o.y/2,f.start.copy(d),f.start.z=0,f.end.copy(u),f.end.z=0;const C=f.closestPointToPointParameter(Y,!0);f.at(C,ve);const k=se.lerp(d.z,u.z,C),L=k>=-1&&k<=1,T=Y.distanceTo(ve)<D*.5;if(L&&T){f.start.fromBufferAttribute(g,S),f.end.fromBufferAttribute(v,S),f.start.applyMatrix4(c),f.end.applyMatrix4(c);const y=new m,b=new m;M.distanceSqToSegment(f.start,f.end,b,y),t.push({point:b,pointOnLine:y,distance:M.origin.distanceTo(b),object:r,face:null,faceIndex:S,uv:null,uv1:null})}}}class je extends Se{constructor(e=new be,t=new _e({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,l=new Float32Array(2*t.count);for(let c=0,s=0,g=t.count;c<g;c++,s+=2)he.fromBufferAttribute(t,c),me.fromBufferAttribute(n,c),l[s]=s===0?0:l[s-1],l[s+1]=l[s]+he.distanceTo(me);const o=new ne(l,2,1);return e.setAttribute("instanceDistanceStart",new O(o,1,0)),e.setAttribute("instanceDistanceEnd",new O(o,1,1)),this}raycast(e,t){const n=this.material.worldUnits,l=e.camera;l===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const o=e.params.Line2!==void 0&&e.params.Line2.threshold||0;M=e.ray;const c=this.matrixWorld,s=this.geometry,g=this.material;D=g.linewidth+o,s.boundingSphere===null&&s.computeBoundingSphere(),V.copy(s.boundingSphere).applyMatrix4(c);let v;if(n)v=D*.5;else{const a=Math.max(l.near,V.distanceToPoint(M.origin));v=ge(l,a,g.resolution)}if(V.radius+=v,M.intersectsSphere(V)===!1)return;s.boundingBox===null&&s.computeBoundingBox(),N.copy(s.boundingBox).applyMatrix4(c);let p;if(n)p=D*.5;else{const a=Math.max(l.near,N.distanceToPoint(M.origin));p=ge(l,a,g.resolution)}N.expandByScalar(p),M.intersectsBox(N)!==!1&&(n?Ne(this,t):Ve(this,l,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Q),this.material.uniforms.resolution.value.set(Q.z,Q.w))}}const j=.5,te=new m(-1.938,1,0),ie=new m(-1.938,-1,0),Ge=new m(0,0,1),He=`
  uniform vec3 uTop, uBot, uAcross; uniform float uDepth;
  varying vec2 vUv; varying vec3 vN, vV;
  void main(){
    float u = position.x + .5, v = .5 - position.y;               // u: front edge 0 → back 1; v: top 0 → bottom 1
    vec3 along = normalize(uBot - uTop);
    vec3 p = mix(uTop, uBot, v) + uAcross * (.5 - u) * uDepth;
    vUv = vec2(u, v);
    vN = normalize(normalMatrix * cross(along, uAcross));
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vV = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`,Ze=`
  uniform float uTime, uFill, uLiquid, uZoom, uImgAsp, uLookA, uLookB, uLookMix; uniform vec2 uSize, uRes; uniform sampler2D uImg;
  varying vec2 vUv; varying vec3 vN, vV;
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
  float fbm2(vec2 p){ return .65 * noise(p) + .35 * noise(p * 2.03 + 17.1); }
  // holographic foil: magenta, gold, lime, cyan, round again
  vec3 foil(float h){
    h = fract(h) * 4.;
    vec3 m = vec3(1., .36, .86), y = vec3(1., .93, .38), l = vec3(.55, 1., .42), c = vec3(.4, .86, 1.);
    return h < 1. ? mix(m, y, smoothstep(0., 1., h)) : h < 2. ? mix(y, l, smoothstep(1., 2., h)) : h < 3. ? mix(l, c, smoothstep(2., 3., h)) : mix(c, m, smoothstep(3., 4., h));
  }
  // the liquid: a slowly flowing surface (domain-warped noise), the same glass as the World's opening
  float surf(vec2 p, float t){ vec2 w = vec2(fbm(p + vec2(t, -t * .7)), fbm(p + vec2(5.2 - t * .8, 1.3 + t))); return fbm(p * 1.2 + w * 1.7 - t * .25); }
  // the glass the words are seen through: the same flow, smoother and broader, so they bend in big strokes and stay legible
  float glass(vec2 p, float t){ vec2 w = vec2(fbm2(p * .6 + vec2(t, -t * .7)), fbm2(p * .6 + vec2(5.2 - t * .8, 1.3 + t))); return fbm2(p * .75 + w * 1.5 - t * .2); }
  // our words seen through the glass (the picture is laid out to the screen's shape, a little bigger than it): bent by the
  // glass, each colour a little differently, soft edges sprayed as grain
  vec3 words(vec2 sp, vec2 q, float g, vec3 ground, vec3 ink){
    float t = uTime * .07, h = glass(q, t), e = .03;
    vec2 slope = vec2(glass(q + vec2(e, 0.), t) - h, glass(q + vec2(0., e), t) - h) / e;
    vec2 tq = sp * vec2(1. / uImgAsp, 1.) * .8 + .5 + vec2(sin(uTime * .05) * .03, uTime * .006);
    vec3 lum;
    for (int i = 0; i < 3; i++) lum[i] = texture2D(uImg, tq - slope * (.07 + .016 * (float(i) - 1.))).r;
    vec3 c = mix(ground, ink, step(vec3(g), lum * 1.15 - .06));
    vec3 nrm = normalize(vec3(-slope * .5, 1.));
    return c + pow(max(dot(nrm, normalize(vec3(-.35, .55, .75))), 0.), 30.) * .4;    // a glint along the glass
  }
  vec3 look(float i, vec2 sp, vec2 q, float g){
    float t = uTime * .07, h = surf(q, t), e = .025;
    vec2 slope = vec2(surf(q + vec2(e, 0.), t) - h, surf(q + vec2(0., e), t) - h) / e;
    vec3 nrm = normalize(vec3(-slope * .45, 1.));
    float glint = pow(max(dot(nrm, normalize(vec3(-.35, .55, .75))), 0.), 28.), steep = smoothstep(1.2, 3.5, length(slope));
    if (i < .5) {                                                    // holographic liquid: soft bands, pale where it crests
      vec3 c = mix(foil(h * 1.9 + uTime * .015 + (g - .5) * .05), vec3(1.), .18);
      return mix(c, vec3(1.), smoothstep(.62, .8, h) * .4) + glint * .2;
    }
    if (i < 1.5) return words(sp, q, g, vec3(.018, .02, .02), mix(vec3(.95, .96, .94), foil(h * 2. + uTime * .02), steep * .25));
    if (i < 2.5) {                                                   // acid: yellow into lime into cyan, grey swirls
      float k = fract(h * 1.5 + uTime * .012 + (g - .5) * .04);
      vec3 c = k < .5 ? mix(vec3(1., .94, .32), vec3(.62, 1., .46), smoothstep(0., .5, k)) : mix(vec3(.62, 1., .46), vec3(.46, .9, 1.), smoothstep(.5, 1., k));
      c = mix(c, vec3(.42, .44, .48), smoothstep(.56, .66, surf(q * .7 + 3., t)) * .55);
      return c + glint * .5;
    }
    if (i < 3.5) return words(sp * .85 + vec2(.05, .1), q + 4., g, vec3(.2, .27, .21), mix(vec3(.96, .95, .88), foil(h * 2.4), steep * .2));
    if (i < 4.5) {                                                   // dark gloss: black liquid, white glints, pastel fringes
      float broad = pow(max(dot(nrm, normalize(vec3(.3, .6, .74))), 0.), 9.);
      vec3 c = vec3(.015) + mix(vec3(.9, .85, 1.), foil(h * 3. + .3), .5) * steep * .55 + vec3(1.) * (broad * .8 + glint);
      return c * step(g * .25, c + .02);
    }
    return words(sp * 1.1 - vec2(.04, .08), q + 8., g, mix(vec3(.03, .05, .2), vec3(.2, .45, 1.), smoothstep(.35, .8, h) * .6), vec3(.94, .97, 1.));   // the words in blue
  }
  void main(){
    if (vUv.y > uFill + (hash(floor(gl_FragCoord.xy * .5)) - .5) * .02) discard;   // it is drawn from the top
    vec3 n = normalize(vN), e = normalize(-vV);
    float facing = abs(dot(n, e));
    // the side: foil whose colour runs with the angle you see it at; one face leans pink, the other green
    vec3 holo = foil(facing * 1.2 + vUv.y * .7 + vUv.x * .2 + uTime * .03 + (gl_FrontFacing ? 0. : .5));
    holo *= .62 + .38 * smoothstep(.05, .6, facing);                                  // darker as it turns edge-on
    holo += pow(max(dot(reflect(-e, n), normalize(vec3(-.3, .6, .75))), 0.), 24.) * .55;   // a sheen sliding along it
    vec3 col = holo;
    if (uLiquid > 0.) {
      // the looks, in screen space, growing as the camera goes deeper; one dissolves into the next grain by grain
      vec2 sp = (gl_FragCoord.xy / uRes - .5) * vec2(uRes.x / uRes.y, 1.) / (.75 + .25 * uZoom);
      vec2 q = sp * 1.6 + 2.;
      float g = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.));
      vec3 L = look(uLookA, sp, q, g);
      if (uLookMix > 0.) L = mix(L, look(uLookB, sp, q, g), step(hash(floor(gl_FragCoord.xy * .5) + 7.3), uLookMix));
      col = mix(holo, L, uLiquid);
    }
    gl_FragColor = vec4(col, 1.);
  }`,Qe=r=>{const e=matchMedia("(prefers-reduced-motion: reduce)").matches,t=new De,n=new Oe(30,r.viewport.aspect,.05,200),l=qe({base:"#d3d8dd",mark:"#f7f9fa",cell:104});t.add(l);const o=new Ce;t.add(o);const c=new be().setPositions(Fe(j)),s=new _e({color:16777215,linewidth:1.7,transparent:!0,opacity:.96}),g=new je(c,s);o.add(g);const v=new ye({side:ke,uniforms:{uTop:{value:te},uBot:{value:ie},uAcross:{value:Ge},uDepth:{value:j},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uZoom:{value:1},uSize:{value:new oe(1,1)},uImg:{value:null},uImgAsp:{value:2},uRes:{value:new oe(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:He,fragmentShader:Ze}),p=new Se(new Pe(1,1,1,96),v);p.frustumCulled=!1,p.visible=!1,o.add(p);const a=v.uniforms;let S=0;function R(){const i=r.viewport.aspect;if(Math.abs(i-S)<.05)return;S=i;const x=r.lang==="ar",U=We(r.lang).vision.lines.map(_=>x?_:_.toUpperCase()),P=i<.9?U.flatMap(_=>_.split(" ")).filter(Boolean):U,h=document.createElement("canvas"),w=h.getContext("2d");h.height=1400,h.width=Math.round(1400*i),w.fillStyle="#000",w.fillRect(0,0,h.width,h.height),w.filter="blur(5px)",w.fillStyle="#fff",w.textAlign="center",w.textBaseline="middle",w.direction=x?"rtl":"ltr";const de=_=>x?`800 ${_}px "Cairo Variable", sans-serif`:`700 ${_}px "Space Grotesk Variable", sans-serif`;P.forEach((_,Ee)=>{let K=h.height/P.length*1.05;w.font=de(K),K*=Math.min(1,h.width*1.1/w.measureText(_).width),w.font=de(K),w.fillText(_,h.width/2,h.height*(Ee+.5)/P.length)});const Me=a.uImg.value,J=new Ie(h);J.wrapS=J.wrapT=Re,a.uImg.value=J,a.uImgAsp.value=i,Me?.dispose()}const W=3.4,C=.8,k=6;let L=-1,T=0;const y=new m,b=new m,re=new m,ze=te.clone().add(ie).multiplyScalar(.5);let q=!1,Z=19,le=1.4,$=0,X=0;const Ae={scene:t,camera:n,light:!0,resize:ce,update({p:i,t:x,dt:U}){a.uFill.value=B.inOut(E(.1,.22,i))*1.03,a.uLiquid.value=B.inOut(E(.4,.56,i)),a.uZoom.value=1+5*B.in(E(.55,.97,i)),a.uSize.value.set(j,te.distanceTo(ie)),a.uTime.value=x,p.visible=i>.1,i>.3&&i<.985&&!e?(L<0&&(L=x,T=0),x-L>W+C&&(T=(T+1)%k,L=x),a.uLookA.value=T,a.uLookB.value=(T+1)%k,a.uLookMix.value=E(W,W+C,x-L)):i<=.3&&(L=-1,a.uLookA.value=0,a.uLookMix.value=0),$=fe($,r.pointer.inside?r.pointer.x:0,2.5,U),X=fe(X,r.pointer.inside?r.pointer.y:0,2.5,U);const P=.38*B.inOut(E(.04,.2,i))+(Math.PI/2-.38)*B.inOut(E(.24,.6,i)),h=B.inOut(E(.2,.6,i));o.rotation.set((X*.05-.06)*(1-h),$*.08*(1-h)+P,0),o.updateMatrixWorld(),b.set(0,0,0).applyMatrix4(o.matrixWorld),re.copy(ze).applyMatrix4(o.matrixWorld),y.lerpVectors(b,re,B.inOut(E(.1,.6,i)));const w=Z*Math.pow(le/Z,h)*se.lerp(1,.72,B.inOut(E(.6,.96,i)));n.position.set(y.x,y.y+.1*Math.sin(Math.PI*h),y.z+w),n.lookAt(y),l.material.uniforms.uShift.value.set(i*120,i*40)},dispose(){c.dispose(),s.dispose(),p.geometry.dispose(),v.dispose(),a.uImg.value?.dispose()}};function ce(){q=r.viewport.portrait;const i=r.viewport,x=Math.tan(se.degToRad(n.fov/2));Z=3.87/(q?.82:.4)/(2*x*i.aspect),le=j/(2*x*i.aspect)*.8;const U=l.material.uniforms;U.uRes.value.set(i.width*i.dpr,i.height*i.dpr),U.uCell.value=104*i.dpr,s.resolution.set(i.width,i.height),a.uRes.value.set(i.width*i.dpr,i.height*i.dpr),R(),o.position.set(q?.15:-.15*(r.lang==="ar"?-1:1),q?.35:0,0),o.updateMatrixWorld()}return ce(),document.fonts?.ready.then(()=>{S=0,R()}),Ae};export{Qe as default};
