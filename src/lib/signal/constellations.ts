/** Fixed stars on rays from one alignment eye; the camera creates the picture. */
import * as THREE from 'three';
import type { Figure, Seat } from './types';
import { ROAD } from './road';
import { STAR_FRAGMENT } from './field';

export function rayHomes(figure: Figure, seat: Seat, alignment: number, rings = false): Float32Array {
  const out = new Float32Array(figure.count * 4);
  const scale = Math.min(seat.width / figure.aspect, seat.height);
  for (let i = 0; i < figure.count; i++) {
    // Stable identity, independent of draw count, time, navigation and random state.
    const t = ((Math.imul(i + 1, 16807) >>> 0) % 65521) / 65521;
    const depth = rings ? ROAD.depthNear + (i % 5) * (ROAD.depthFar - ROAD.depthNear) / 4
      : ROAD.depthNear + t * (ROAD.depthFar - ROAD.depthNear);
    out[i * 4] = ((seat.offsetX ?? 0) + figure.positions[i * 3] * scale) * depth / seat.distance;
    out[i * 4 + 1] = ((seat.offsetY ?? 0) + figure.positions[i * 3 + 1] * scale) * depth / seat.distance;
    out[i * 4 + 2] = alignment + depth;
    out[i * 4 + 3] = figure.weights[i];
  }
  return out;
}

const vertex = /* glsl */ `
attribute float aWeight;
attribute vec2 aMeta;
uniform float uDolly;
uniform float uBend;
uniform float uIndex;
uniform float uOpacity;
uniform float uPixelRatio;
uniform float uReveal;
varying float vAlpha;
varying vec3 vTint;
varying float vHalo;
varying float vCore;
varying float vSpike;
void main() {
  float depth = -position.z - uDolly;
  vec3 p = position;
  p.x += uBend * depth * depth;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  float show = step(uIndex - 1.1, aMeta.x) * step(aMeta.x, uIndex + 3.1);
  float nearFade = smoothstep(0.4, 1.2, depth);
  float farFade = 1.0 - smoothstep(140.0, 480.0, depth);
  vAlpha = show * nearFade * farFade * uOpacity * uReveal * mix(0.66, 1.0, aWeight);
  vTint = mix(vec3(0.8745, 0.9098, 1.0), vec3(0.9137, 0.5922, 0.3882), aMeta.y);
  vHalo = 0.45 + aWeight * 0.4;
  vSpike = smoothstep(0.86, 1.0, aWeight);
  vCore = 1.0 / (1.0 + vSpike * 1.9);
  gl_PointSize = clamp((2.1 + aWeight * aWeight * 6.0) * uPixelRatio * (1.0 + vSpike * 1.9), 0.8, 26.0);
  if (depth < 0.4) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;

export function createConstellations(pixelRatio: number) {
  const geometry = new THREE.BufferGeometry();
  const uniforms = {
    uDolly: { value: 0 }, uBend: { value: 0 }, uIndex: { value: 0 },
    uOpacity: { value: 1 }, uReveal: { value: 1 }, uPixelRatio: { value: pixelRatio },
  };
  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: STAR_FRAGMENT,
    uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.NormalBlending });
  const object = new THREE.Points(geometry, material);
  object.frustumCulled = false;
  object.renderOrder = 2;
  return {
    object,
    set(entries: { homes: Float32Array; index: number; gold: boolean }[]) {
      const count = entries.reduce((n, e) => n + e.homes.length / 4, 0);
      const positions = new Float32Array(count * 3), weights = new Float32Array(count), meta = new Float32Array(count * 2);
      let n = 0;
      for (const e of entries) for (let i = 0; i < e.homes.length; i += 4, n++) {
        positions.set([e.homes[i], e.homes[i + 1], -e.homes[i + 2]], n * 3);
        weights[n] = e.homes[i + 3];
        meta.set([e.index, e.gold ? 1 : 0], n * 2);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aWeight', new THREE.BufferAttribute(weights, 1));
      geometry.setAttribute('aMeta', new THREE.BufferAttribute(meta, 2));
      geometry.setDrawRange(0, count);
    },
    frame(dolly: number, bend: number, index: number, opacity: number, reveal: number) {
      uniforms.uDolly.value = dolly; uniforms.uBend.value = bend; uniforms.uIndex.value = index;
      uniforms.uOpacity.value = opacity; uniforms.uReveal.value = reveal;
    },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
