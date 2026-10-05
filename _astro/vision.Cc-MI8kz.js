import{a3 as me,a4 as te,a5 as Y,a6 as L,a7 as ve,a8 as $,a9 as le,p as g,S as ce,aa as W,ab as de,V as J,ac as q,M as ue,a as O,ad as ge,ae as we,u as X,e as ye,f as xe,G as Se,Y as be,P as _e,c as ze,b as Ee,af as Ae,t as z,v as E,A as ie}from"./WorldChrome.astro_astro_type_script_index_0_lang.IwrUNh_l.js";import{p as Me,a as Ue}from"./_lineart.88XbtuNy.js";import"./preload-helper.DArFJGja.js";const ne=new $,R=new g;class fe extends me{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new te(e,3)),this.setAttribute("uv",new te(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Y(t,6,1);return this.setAttribute("instanceStart",new L(n,3,0)),this.setAttribute("instanceEnd",new L(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Y(t,6,1);return this.setAttribute("instanceColorStart",new L(n,3,0)),this.setAttribute("instanceColorEnd",new L(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new ve(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),ne.setFromBufferAttribute(t),this.boundingBox.union(ne))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new le),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let o=0;for(let r=0,c=e.count;r<c;r++)R.fromBufferAttribute(e,r),o=Math.max(o,n.distanceToSquared(R)),R.fromBufferAttribute(t,r),o=Math.max(o,n.distanceToSquared(R));this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}q.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new J(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};W.line={uniforms:de.merge([q.common,q.fog,q.line]),vertexShader:`
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
		`};class pe extends ce{constructor(e){super({type:"LineMaterial",uniforms:de.clone(W.line.uniforms),vertexShader:W.line.vertexShader,fragmentShader:W.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const j=new O,oe=new g,se=new g,f=new O,p=new O,x=new O,V=new g,G=new we,h=new ge,ae=new g,k=new $,N=new le,S=new O;let b,B;function re(a,e,t){return S.set(0,0,-e,1).applyMatrix4(a.projectionMatrix),S.multiplyScalar(1/S.w),S.x=B/t.width,S.y=B/t.height,S.applyMatrix4(a.projectionMatrixInverse),S.multiplyScalar(1/S.w),Math.abs(Math.max(S.x,S.y))}function Be(a,e){const t=a.matrixWorld,n=a.geometry,o=n.attributes.instanceStart,r=n.attributes.instanceEnd,c=Math.min(n.instanceCount,o.count);for(let s=0,v=c;s<v;s++){h.start.fromBufferAttribute(o,s),h.end.fromBufferAttribute(r,s),h.applyMatrix4(t);const m=new g,l=new g;b.distanceSqToSegment(h.start,h.end,l,m),l.distanceTo(m)<B*.5&&e.push({point:l,pointOnLine:m,distance:b.origin.distanceTo(l),object:a,face:null,faceIndex:s,uv:null,uv1:null})}}function Te(a,e,t){const n=e.projectionMatrix,r=a.material.resolution,c=a.matrixWorld,s=a.geometry,v=s.attributes.instanceStart,m=s.attributes.instanceEnd,l=Math.min(s.instanceCount,v.count),u=-e.near;b.at(1,x),x.w=1,x.applyMatrix4(e.matrixWorldInverse),x.applyMatrix4(n),x.multiplyScalar(1/x.w),x.x*=r.x/2,x.y*=r.y/2,x.z=0,V.copy(x),G.multiplyMatrices(e.matrixWorldInverse,c);for(let w=0,C=l;w<C;w++){if(f.fromBufferAttribute(v,w),p.fromBufferAttribute(m,w),f.w=1,p.w=1,f.applyMatrix4(G),p.applyMatrix4(G),f.z>u&&p.z>u)continue;if(f.z>u){const y=f.z-p.z,_=(f.z-u)/y;f.lerp(p,_)}else if(p.z>u){const y=p.z-f.z,_=(p.z-u)/y;p.lerp(f,_)}f.applyMatrix4(n),p.applyMatrix4(n),f.multiplyScalar(1/f.w),p.multiplyScalar(1/p.w),f.x*=r.x/2,f.y*=r.y/2,p.x*=r.x/2,p.y*=r.y/2,h.start.copy(f),h.start.z=0,h.end.copy(p),h.end.z=0;const M=h.closestPointToPointParameter(V,!0);h.at(M,ae);const T=X.lerp(f.z,p.z,M),I=T>=-1&&T<=1,D=V.distanceTo(ae)<B*.5;if(I&&D){h.start.fromBufferAttribute(v,w),h.end.fromBufferAttribute(m,w),h.start.applyMatrix4(c),h.end.applyMatrix4(c);const y=new g,_=new g;b.distanceSqToSegment(h.start,h.end,_,y),t.push({point:_,pointOnLine:y,distance:b.origin.distanceTo(_),object:a,face:null,faceIndex:w,uv:null,uv1:null})}}}class Le extends ue{constructor(e=new fe,t=new pe({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,o=new Float32Array(2*t.count);for(let c=0,s=0,v=t.count;c<v;c++,s+=2)oe.fromBufferAttribute(t,c),se.fromBufferAttribute(n,c),o[s]=s===0?0:o[s-1],o[s+1]=o[s]+oe.distanceTo(se);const r=new Y(o,2,1);return e.setAttribute("instanceDistanceStart",new L(r,1,0)),e.setAttribute("instanceDistanceEnd",new L(r,1,1)),this}raycast(e,t){const n=this.material.worldUnits,o=e.camera;o===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;b=e.ray;const c=this.matrixWorld,s=this.geometry,v=this.material;B=v.linewidth+r,s.boundingSphere===null&&s.computeBoundingSphere(),N.copy(s.boundingSphere).applyMatrix4(c);let m;if(n)m=B*.5;else{const u=Math.max(o.near,N.distanceToPoint(b.origin));m=re(o,u,v.resolution)}if(N.radius+=m,b.intersectsSphere(N)===!1)return;s.boundingBox===null&&s.computeBoundingBox(),k.copy(s.boundingBox).applyMatrix4(c);let l;if(n)l=B*.5;else{const u=Math.max(o.near,k.distanceToPoint(b.origin));l=re(o,u,v.resolution)}k.expandByScalar(l),b.intersectsBox(k)!==!1&&(n?Be(this,t):Te(this,o,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(j),this.material.uniforms.resolution.value.set(j.z,j.w))}}const F=.5,Z=new g(-1.938,1,0),K=new g(-1.938,-1,0),De=new g(0,0,1),Oe=`
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
  }`,Ce=`
  uniform float uTime, uFill, uLiquid, uNoise, uHasImg, uImgAsp, uZoom; uniform vec2 uSize, uRes; uniform sampler2D uImg;
  varying vec2 vUv; varying vec3 vN, vV;
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
  // holographic foil: magenta, gold, lime, cyan, round again
  vec3 foil(float h){
    h = fract(h) * 4.;
    vec3 m = vec3(1., .36, .86), y = vec3(1., .93, .38), l = vec3(.55, 1., .42), c = vec3(.4, .86, 1.);
    return h < 1. ? mix(m, y, smoothstep(0., 1., h)) : h < 2. ? mix(y, l, smoothstep(1., 2., h)) : h < 3. ? mix(l, c, smoothstep(2., 3., h)) : mix(c, m, smoothstep(3., 4., h));
  }
  void main(){
    if (vUv.y > uFill + (hash(floor(gl_FragCoord.xy * .5)) - .5) * .02) discard;   // it is drawn from the top
    vec3 n = normalize(vN), e = normalize(-vV);
    float facing = abs(dot(n, e));
    // the ribbon: foil whose colour runs with the angle you see it at; one face leans pink, the other green
    vec3 holo = foil(facing * 1.2 + vUv.y * .7 + vUv.x * .2 + uTime * .03 + (gl_FrontFacing ? 0. : .5));
    holo *= .62 + .38 * smoothstep(.05, .6, facing);                                  // darker as it turns edge-on
    holo += pow(max(dot(reflect(-e, n), normalize(vec3(-.3, .6, .75))), 0.), 24.) * .55;   // a sheen sliding along it
    // the panel: liquid colour, a slow domain-warped flow (smooth like the opening glass), sprayed on grain by grain
    vec2 q = (vUv - .5) * uSize * 2.2 / uZoom + 3.;                                 // deeper and deeper in as uZoom grows
    vec2 w = vec2(fbm(q + uTime * .05), fbm(q + 5.2 - uTime * .04));
    float f = fbm(q + 2.4 * w + uTime * .025);
    float k = f * 1.6 + w.x * .6 + uTime * .02, g = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.));
    vec3 liquid = mix(foil(k), foil(k + .12), step(g, fract(k * 8.)));                // two neighbouring tones, dithered
    liquid = mix(liquid, vec3(1.), smoothstep(.62, .75, f) * .55);                    // bright ridges, like light on glass
    liquid *= .9 + .2 * smoothstep(.2, .5, f);
    vec3 col = mix(holo, liquid, uLiquid);
    // last: the MK in grain, each colour a few pixels off the others
    if (uNoise > 0. && uHasImg > .5) {
      vec2 s = gl_FragCoord.xy / uRes, kk = vec2(uRes.x / uRes.y / uImgAsp, 1.);
      if (kk.x < 1.) { kk.y = 1. / kk.x; kk.x = 1.; }
      vec2 iq = (s - .5) / kk * .9 + .5 + vec2(uTime * .004, 0.) + (w - .5) * .04 * uLiquid;   // a little of the liquid flow in it
      vec2 off = vec2(.006 + .01 * uNoise, 0.);
      vec3 im = vec3(texture2D(uImg, iq + off).r, texture2D(uImg, iq).g, texture2D(uImg, iq - off).b);
      vec3 bits = step(vec3(hash(floor(gl_FragCoord.xy) + floor(uTime * 24.))), im * 1.25 - .1);
      col = mix(col, mix(vec3(.06, .05, .09), mix(bits, bits * foil(k), .35), .92), smoothstep(0., 1., uNoise));
    }
    gl_FragColor = vec4(col, 1.);
  }`,ke=a=>{const e=new ye,t=new xe(30,a.viewport.aspect,.05,200),n=Me({base:"#d3d8dd",mark:"#f7f9fa",cell:104});e.add(n);const o=new Se;e.add(o);const r=new fe().setPositions(Ue(F)),c=new pe({color:16777215,linewidth:1.7,transparent:!0,opacity:.96}),s=new Le(r,c);o.add(s);const v=new ce({side:be,uniforms:{uTop:{value:Z},uBot:{value:K},uAcross:{value:De},uDepth:{value:F},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uNoise:{value:0},uZoom:{value:1},uSize:{value:new J(1,1)},uImg:{value:null},uHasImg:{value:0},uImgAsp:{value:16/9},uRes:{value:new J(1,1)}},vertexShader:Oe,fragmentShader:Ce}),m=new ue(new _e(1,1,1,96),v);m.frustumCulled=!1,m.visible=!1,o.add(m);const l=v.uniforms;{const i=document.createElement("canvas"),d=i.getContext("2d");i.width=1024,i.height=576,d.fillStyle="#000",d.fillRect(0,0,i.width,i.height),d.filter="blur(10px)",d.fillStyle="#fff";const A=i.height*1.25/ze.height;d.translate(i.width*.5,i.height*.56),d.rotate(-.12),d.scale(A,-A),d.translate(-3.87/2,-2/2);for(const H of Ee)d.beginPath(),H.forEach(([U,P],he)=>he?d.lineTo(U,P):d.moveTo(U,P)),d.closePath(),d.fill();l.uImg.value=new Ae(i),l.uHasImg.value=1}const u=new g,w=new g,C=new g,Q=Z.clone().add(K).multiplyScalar(.5);let M=!1,T=19,I=1.4,D=0,y=0;const _={scene:e,camera:t,light:!0,resize:ee,update({p:i,t:d,dt:A}){l.uFill.value=z.inOut(E(.1,.22,i))*1.03,l.uLiquid.value=z.inOut(E(.4,.56,i)),l.uZoom.value=1+5*z.in(E(.55,.97,i)),l.uNoise.value=z.inOut(E(.8,.96,i)),l.uSize.value.set(F,Z.distanceTo(K)),l.uTime.value=d,m.visible=i>.1,D=ie(D,a.pointer.inside?a.pointer.x:0,2.5,A),y=ie(y,a.pointer.inside?a.pointer.y:0,2.5,A);const H=.38*z.inOut(E(.04,.2,i))+(Math.PI/2-.38)*z.inOut(E(.24,.6,i)),U=z.inOut(E(.2,.6,i));o.rotation.set((y*.05-.06)*(1-U),D*.08*(1-U)+H,0),o.updateMatrixWorld(),w.set(0,0,0).applyMatrix4(o.matrixWorld),C.copy(Q).applyMatrix4(o.matrixWorld),u.lerpVectors(w,C,z.inOut(E(.1,.6,i)));const P=T*Math.pow(I/T,U)*X.lerp(1,.72,z.inOut(E(.6,.96,i)));t.position.set(u.x,u.y+.1*Math.sin(Math.PI*U),u.z+P),t.lookAt(u),n.material.uniforms.uShift.value.set(i*120,i*40)},dispose(){r.dispose(),c.dispose(),m.geometry.dispose(),v.dispose(),l.uImg.value?.dispose()}};function ee(){M=a.viewport.portrait;const i=a.viewport,d=Math.tan(X.degToRad(t.fov/2));T=3.87/(M?.82:.4)/(2*d*i.aspect),I=F/(2*d*i.aspect)*.8;const A=n.material.uniforms;A.uRes.value.set(i.width*i.dpr,i.height*i.dpr),A.uCell.value=104*i.dpr,c.resolution.set(i.width,i.height),l.uRes.value.set(i.width*i.dpr,i.height*i.dpr),o.position.set(M?.15:-.15*(a.lang==="ar"?-1:1),M?.35:0,0),o.updateMatrixWorld()}return ee(),_};export{ke as default};
