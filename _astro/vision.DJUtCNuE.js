import{au as Ie,aa as ze,aK as pe,aL as W,aM as Re,aN as ve,aO as Ue,V as m,i as Be,aP as te,aQ as De,s as he,aR as ie,M as ke,a3 as G,aS as We,av as Fe,p as me,S as Ne,P as Ve,G as je,J as He,a as Ge,am as Ze,aD as $e,o as D,r as T,u as re}from"./EditionWorld.astro_astro_type_script_index_0_lang.CdACCPuN.js";import{b as Je}from"./world.0NuJufzz.js";import{p as Ke,a as Qe}from"./_lineart.CJ5KKA4K.js";import{g as Xe,s as Ye}from"./lens.D7EpV7mk.js";import"./preload-helper.DArFJGja.js";import"./profile.BvGii9HA.js";const Me=new ve,Q=new m;class Oe extends Ie{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new ze(e,3)),this.setAttribute("uv",new ze(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new pe(t,6,1);return this.setAttribute("instanceStart",new W(n,3,0)),this.setAttribute("instanceEnd",new W(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new pe(t,6,1);return this.setAttribute("instanceColorStart",new W(n,3,0)),this.setAttribute("instanceColorEnd",new W(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Re(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ve);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Me.setFromBufferAttribute(t),this.boundingBox.union(Me))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ue),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let l=0;for(let a=0,c=e.count;a<c;a++)Q.fromBufferAttribute(e,a),l=Math.max(l,n.distanceToSquared(Q)),Q.fromBufferAttribute(t,a),l=Math.max(l,n.distanceToSquared(Q));this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}ie.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new he(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};te.line={uniforms:De.merge([ie.common,ie.fog,ie.line]),vertexShader:`
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
		`};class Ce extends Be{constructor(e){super({type:"LineMaterial",uniforms:De.clone(te.line.uniforms),vertexShader:te.line.vertexShader,fragmentShader:te.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const le=new G,Ee=new m,Ae=new m,u=new G,f=new G,z=new G,ce=new m,de=new Fe,p=new We,Le=new m,X=new ve,Y=new Ue,M=new G;let E,C;function Te(o,e,t){return M.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),M.multiplyScalar(1/M.w),M.x=C/t.width,M.y=C/t.height,M.applyMatrix4(o.projectionMatrixInverse),M.multiplyScalar(1/M.w),Math.abs(Math.max(M.x,M.y))}function et(o,e){const t=o.matrixWorld,n=o.geometry,l=n.attributes.instanceStart,a=n.attributes.instanceEnd,c=Math.min(n.instanceCount,l.count);for(let r=0,x=c;r<x;r++){p.start.fromBufferAttribute(l,r),p.end.fromBufferAttribute(a,r),p.applyMatrix4(t);const v=new m,h=new m;E.distanceSqToSegment(p.start,p.end,h,v),h.distanceTo(v)<C*.5&&e.push({point:h,pointOnLine:v,distance:E.origin.distanceTo(h),object:o,face:null,faceIndex:r,uv:null,uv1:null})}}function tt(o,e,t){const n=e.projectionMatrix,a=o.material.resolution,c=o.matrixWorld,r=o.geometry,x=r.attributes.instanceStart,v=r.attributes.instanceEnd,h=Math.min(r.instanceCount,x.count),s=-e.near;E.at(1,z),z.w=1,z.applyMatrix4(e.matrixWorldInverse),z.applyMatrix4(n),z.multiplyScalar(1/z.w),z.x*=a.x/2,z.y*=a.y/2,z.z=0,ce.copy(z),de.multiplyMatrices(e.matrixWorldInverse,c);for(let A=0,k=h;A<k;A++){if(u.fromBufferAttribute(x,A),f.fromBufferAttribute(v,A),u.w=1,f.w=1,u.applyMatrix4(de),f.applyMatrix4(de),u.z>s&&f.z>s)continue;if(u.z>s){const L=u.z-f.z,b=(u.z-s)/L;u.lerp(f,b)}else if(f.z>s){const L=f.z-u.z,b=(f.z-s)/L;f.lerp(u,b)}u.applyMatrix4(n),f.applyMatrix4(n),u.multiplyScalar(1/u.w),f.multiplyScalar(1/f.w),u.x*=a.x/2,u.y*=a.y/2,f.x*=a.x/2,f.y*=a.y/2,p.start.copy(u),p.start.z=0,p.end.copy(f),p.end.z=0;const _=p.closestPointToPointParameter(ce,!0);p.at(_,Le);const F=me.lerp(u.z,f.z,_),U=F>=-1&&F<=1,N=ce.distanceTo(Le)<C*.5;if(U&&N){p.start.fromBufferAttribute(x,A),p.end.fromBufferAttribute(v,A),p.start.applyMatrix4(c),p.end.applyMatrix4(c);const L=new m,b=new m;E.distanceSqToSegment(p.start,p.end,b,L),t.push({point:b,pointOnLine:L,distance:E.origin.distanceTo(b),object:o,face:null,faceIndex:A,uv:null,uv1:null})}}}class it extends ke{constructor(e=new Oe,t=new Ce({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,l=new Float32Array(2*t.count);for(let c=0,r=0,x=t.count;c<x;c++,r+=2)Ee.fromBufferAttribute(t,c),Ae.fromBufferAttribute(n,c),l[r]=r===0?0:l[r-1],l[r+1]=l[r]+Ee.distanceTo(Ae);const a=new pe(l,2,1);return e.setAttribute("instanceDistanceStart",new W(a,1,0)),e.setAttribute("instanceDistanceEnd",new W(a,1,1)),this}raycast(e,t){const n=this.material.worldUnits,l=e.camera;l===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const a=e.params.Line2!==void 0&&e.params.Line2.threshold||0;E=e.ray;const c=this.matrixWorld,r=this.geometry,x=this.material;C=x.linewidth+a,r.boundingSphere===null&&r.computeBoundingSphere(),Y.copy(r.boundingSphere).applyMatrix4(c);let v;if(n)v=C*.5;else{const s=Math.max(l.near,Y.distanceToPoint(E.origin));v=Te(l,s,x.resolution)}if(Y.radius+=v,E.intersectsSphere(Y)===!1)return;r.boundingBox===null&&r.computeBoundingBox(),X.copy(r.boundingBox).applyMatrix4(c);let h;if(n)h=C*.5;else{const s=Math.max(l.near,X.distanceToPoint(E.origin));h=Te(l,s,x.resolution)}X.expandByScalar(h),E.intersectsBox(X)!==!1&&(n?et(this,t):tt(this,l,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(le),this.material.uniforms.resolution.value.set(le.z,le.w))}}const ee=.5,ue=new m(-1.938,1,0),fe=new m(-1.938,-1,0),nt=new m(0,0,1),ot=`
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
  }`,st=`
  uniform float uTime, uFill, uLiquid, uZoom, uImgAsp, uLookA, uLookB, uLookMix, uDive, uPulse, uEnd; uniform vec2 uSize, uRes; uniform sampler2D uImg;
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
      c = mix(c, vec3(.07, .08, .09), step(.58 + (g - .5) * .09, surf(q * .7 + 3., t)));   // dark liquid shapes, their edges in grain
      return c + glint * .5;
    }
    if (i < 3.5) return words(sp * .85 + vec2(.05, .1), q + 4., g, vec3(.2, .27, .21), mix(vec3(.96, .95, .88), foil(h * 2.4), steep * .2));
    if (i < 4.5) {                                                   // dark gloss: black liquid, white glints, pastel fringes
      float broad = pow(max(dot(nrm, normalize(vec3(.3, .6, .74))), 0.), 9.);
      vec3 c = vec3(.015) + mix(vec3(.9, .85, 1.), foil(h * 3. + .3), .5) * steep * .55 + vec3(1.) * (broad * .8 + glint);
      return c * step(g * .25, c + .02);
    }
    if (i < 5.5) return words(sp * 1.1 - vec2(.04, .08), q + 8., g, mix(vec3(.03, .05, .2), vec3(.2, .45, 1.), smoothstep(.35, .8, h) * .6), vec3(.94, .97, 1.));   // the words in blue
    if (i < 6.5) {                                                   // blue chrome: deep blue liquid, black troughs, white light on the crests
      float broad = pow(max(dot(nrm, normalize(vec3(-.2, .7, .68))), 0.), 6.);
      vec3 c = mix(vec3(.004, .01, .05), vec3(.08, .26, 1.), smoothstep(.32, .72, h));
      return c * step(g * .2, smoothstep(.2, .45, h) + .05) + vec3(.85, .92, 1.) * (broad * .7 + glint * 1.2);
    }
    if (i < 7.5) {                                                   // zebra: black and white liquid bands, grain at every edge, a rainbow fringe
      vec3 z = h * 7. + uTime * .05 + vec3(-.012, 0., .012) * (1. + steep * 2.);
      return step(vec3((g - .5) * .5), sin(z * 6.2832));
    }
    if (i < 8.5) {                                                   // teal swirl: teal into lime into yellow, black liquid with grainy edges
      float k = fract(h * 1.3 - uTime * .01);
      vec3 c = k < .5 ? mix(vec3(.1, .78, .72), vec3(.6, 1., .4), smoothstep(0., .5, k)) : mix(vec3(.6, 1., .4), vec3(1., .95, .45), smoothstep(.5, 1., k));
      return mix(c, vec3(.02), step(.6 + (g - .5) * .12, surf(q * .8 - 2., t * 1.3))) + glint * .6;
    }
    if (i < 9.5) return words(sp * .95, q + 12., g, vec3(.86, .87, .88), vec3(.025)) + glint * .1;   // the words dark on pale grey, fringed red and blue
    // chrome: the words in grey metal on black, banded as they bend
    vec3 metal = mix(vec3(.3, .31, .33), vec3(.97), smoothstep(.25, .75, fract(h * 2.2 + .3)));
    return words(sp * 1.05 + vec2(.06, 0.), q - 6., g, vec3(.012), metal) + glint * .3;
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
      // the dive: scrolling in pushes you into the colour in a pulse, the picture coming closer and the flowing glass
      // bending it the harder you go (at rest it only breathes); toward the end it carries you through
      float push = uDive * (.8 + .2 * sin(uPulse * 2.2)) + uEnd * 2.2 + .04 * (.5 + .5 * sin(uTime * 1.5));
      sp /= 1. + push * .22;
      float gt = uTime * .05, gh = glass(sp * 1.1 + 4., gt), ge = .04;
      vec2 gs = vec2(glass(sp * 1.1 + 4. + vec2(ge, 0.), gt) - gh, glass(sp * 1.1 + 4. + vec2(0., ge), gt) - gh) / ge;
      sp += gs * push * .05;
      vec2 q = sp * 1.6 + 2.;
      float g = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.));
      vec3 L = look(uLookA, sp, q, g);
      if (uLookMix > 0.) L = mix(L, look(uLookB, sp, q, g), step(glass(q * .5 - 1., uTime * .05) * .8 + hash(floor(gl_FragCoord.xy * .5) + 7.3) * .2, uLookMix * 1.05));
      // the glass of the dive: its steep folds catch the light in foil
      L += foil(gh * 2. + uPulse * .1) * smoothstep(.8, 2.4, length(gs)) * min(push, 1.5) * .25;
      col = mix(holo, L, uLiquid);
    }
    gl_FragColor = vec4(col, 1.);
  }`,ft=o=>{const e=matchMedia("(prefers-reduced-motion: reduce)").matches,t=new Ne,n=new Ve(30,o.viewport.aspect,.05,200),l=Ke({base:"#d3d8dd",mark:"#f7f9fa",cell:104});t.add(l);const a=new je;t.add(a);const c=new Oe().setPositions(Qe(ee)),r=new Ce({color:16777215,linewidth:1.7,transparent:!0,opacity:.96}),x=new it(c,r);a.add(x);const v=new Be({side:He,uniforms:{uTop:{value:ue},uBot:{value:fe},uAcross:{value:nt},uDepth:{value:ee},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uZoom:{value:1},uSize:{value:new he(1,1)},uImg:{value:null},uImgAsp:{value:2},uRes:{value:new he(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0},uDive:{value:0},uPulse:{value:0},uEnd:{value:0}},vertexShader:ot,fragmentShader:st}),h=new ke(new Ge(1,1,1,96),v);h.frustumCulled=!1,h.visible=!1,a.add(h);const s=v.uniforms,A=.46;let k=0,Z=0,_=-1,F=!1;const U=Xe(t,n,[],i=>{s.uLiquid.value=i?Z:k});U.warm(o.renderer);let N=0;function L(){const i=o.viewport.aspect;if(Math.abs(i-N)<.05)return;N=i;const g=o.lang==="ar",S=Je(o.lang).vision.lines.map(y=>g?y:y.toUpperCase()),B=i<.9?S.flatMap(y=>y.split(" ")).filter(Boolean):S,d=document.createElement("canvas"),w=d.getContext("2d");d.height=1400,d.width=Math.round(1400*i),w.fillStyle="#000",w.fillRect(0,0,d.width,d.height),w.filter="blur(5px)",w.fillStyle="#fff",w.textAlign="center",w.textBaseline="middle",w.direction=g?"rtl":"ltr";const K=y=>g?`800 ${y}px "Cairo Variable", sans-serif`:`700 ${y}px "Space Grotesk Variable", sans-serif`;B.forEach((y,I)=>{let R=d.height/B.length*1.05;w.font=K(R),R*=Math.min(1,d.width*1.1/w.measureText(y).width),w.font=K(R),w.fillText(y,d.width/2,d.height*(I+.5)/B.length)});const q=s.uImg.value,H=new Ze(d);H.wrapS=H.wrapT=$e,s.uImg.value=H,s.uImgAsp.value=i,q?.dispose()}const b=2.6,ge=1,$=[0,1,6,2,7,3,8,9,4,10,5];let O=-1,P=0;const V=new m,we=new m,ye=new m,Pe=ue.clone().add(fe).multiplyScalar(.5);let J=!1,ne=19,xe=1.4,oe=0,se=0,ae=-1,j=0,Se=0;const qe={scene:t,camera:n,light:!0,resize:be,update({p:i,t:g,dt:S}){s.uFill.value=D.inOut(T(.1,.22,i))*1.03;const B=i>=A?1:0;e||!F?(k=B,F=!0):_<0&&B!==k&&(_=0,Z=B,B&&(O=g,P=1));const d=_<0?null:Ye(_);d?.passed&&(k=Z),d&&(_=_>1.7?-1:_+S),s.uLiquid.value=k,s.uZoom.value=1+5*D.in(T(.55,.97,i)),s.uSize.value.set(ee,ue.distanceTo(fe));const w=ae<0?0:Math.abs(i-ae)/Math.max(S,.001);ae=i,j=e?0:re(j,Math.min(1,w*8),w*8>j?6:1.6,S),Se+=S*(1+j*5),s.uDive.value=j,s.uPulse.value=Se,s.uEnd.value=e?0:D.in(T(.88,.985,i)),s.uTime.value=g,h.visible=i>.1,i>.3&&i<.985&&!e?(O<0&&(O=g,P=0),g-O>b+ge&&(P=(P+1)%$.length,O=g),s.uLookA.value=$[P],s.uLookB.value=$[(P+1)%$.length],s.uLookMix.value=T(b,b+ge,g-O)):i<=.3&&(O=-1,s.uLookA.value=0,s.uLookMix.value=0),oe=re(oe,o.pointer.inside?o.pointer.x:0,2.5,S),se=re(se,o.pointer.inside?o.pointer.y:0,2.5,S);const K=.38*D.inOut(T(.04,.2,i))+(Math.PI/2-.38)*D.inOut(T(.24,.6,i)),q=D.inOut(T(.2,.6,i));a.rotation.set((se*.05-.06)*(1-q),oe*.08*(1-q)+K,0),a.updateMatrixWorld(),we.set(0,0,0).applyMatrix4(a.matrixWorld),ye.copy(Pe).applyMatrix4(a.matrixWorld),V.lerpVectors(we,ye,D.inOut(T(.1,.6,i)));const H=ne*Math.pow(xe/ne,q)*me.lerp(1,.72,D.inOut(T(.6,.96,i)));if(n.position.set(V.x,V.y+.1*Math.sin(Math.PI*q),V.z+H),n.lookAt(V),l.material.uniforms.uShift.value.set(i*120,i*40),U.mesh.visible=!!d,!d)U.resize(1,1);else{const y=Math.round(o.viewport.width*o.viewport.dpr),I=Math.round(o.viewport.height*o.viewport.dpr),R=I/6,_e=Math.hypot(y,I)/R*.6+1;U.resize(y,I),U.set({center:[y/2,I/2],unit:R,sphere:1,radius:d.passed?0:_e*d.grow,far:_e,puff:0,alpha:1,screen:d.screen,time:g})}},dispose(){c.dispose(),r.dispose(),h.geometry.dispose(),v.dispose(),s.uImg.value?.dispose(),U.dispose()}};function be(){J=o.viewport.portrait;const i=o.viewport,g=Math.tan(me.degToRad(n.fov/2));ne=3.87/(J?.82:.4)/(2*g*i.aspect),xe=ee/(2*g*i.aspect)*.8;const S=l.material.uniforms;S.uRes.value.set(i.width*i.dpr,i.height*i.dpr),S.uCell.value=104*i.dpr,r.resolution.set(i.width,i.height),s.uRes.value.set(i.width*i.dpr,i.height*i.dpr),L(),a.position.set(J?.15:-.15*(o.lang==="ar"?-1:1),J?.35:0,0),a.updateMatrixWorld()}return be(),document.fonts?.ready.then(()=>{N=0,L()}),qe};export{ft as default};
