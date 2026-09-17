/* =====================================================================
   ONE SKY — the post stack.

   Scene → bloom → lens. One stack for every device: bloom over the whole
   frame at native resolution, then chromatic edges, radial streaks that
   answer scroll velocity, a vignette and grain. No tone mapping and no
   colour-space conversion on the way out: the scene is authored
   display-referred, exactly as the old direct-to-canvas render was.
   ===================================================================== */
import { HalfFloatType, UnsignedByteType, Vector2, WebGLRenderTarget, type Camera, type Scene, type WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { lensFrag, lensVert } from './shaders';

export interface Post {
  /** renders the scene through the stack, then `overlay` straight to the screen on top */
  render(elapsed: number, velocity: number, overlay?: Scene): void;
  resize(width: number, height: number, dpr: number): void;
  setLight(light: boolean): void;
  dispose(): void;
}

export interface PostOptions {
  strength?: number;
  radius?: number;
  threshold?: number;
  grain?: number;
  vignette?: number;
  aberration?: number;
}

export function createPost(renderer: WebGLRenderer, scene: Scene, camera: Camera, opts: PostOptions = {}): Post {
  const gl2 = renderer.capabilities.isWebGL2;
  const dpr = renderer.getPixelRatio();
  const size = renderer.getSize(new Vector2());
  const target = new WebGLRenderTarget(Math.max(1, Math.round(size.x * dpr)), Math.max(1, Math.round(size.y * dpr)), {
    type: gl2 ? HalfFloatType : UnsignedByteType,
    samples: gl2 ? 4 : 0,
    depthBuffer: true,
    stencilBuffer: false,
  });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(dpr);
  composer.setSize(size.x, size.y);

  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(new Vector2(size.x, size.y), opts.strength ?? 0.85, opts.radius ?? 0.55, opts.threshold ?? 0.72);
  const lens = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uLight: { value: 0 },
      uGrain: { value: opts.grain ?? 0.045 },
      uVignette: { value: opts.vignette ?? 0.55 },
      uAberration: { value: opts.aberration ?? 0.0012 },
    },
    vertexShader: lensVert,
    fragmentShader: lensFrag,
  });
  lens.renderToScreen = true;
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(lens);

  return {
    render(elapsed, velocity, overlay) {
      lens.uniforms.uTime.value = elapsed;
      lens.uniforms.uVelocity.value = velocity;
      composer.render();
      if (overlay) {
        renderer.autoClear = false;
        renderer.clearDepth();
        renderer.render(overlay, camera);
        renderer.autoClear = true;
      }
    },
    resize(width, height, ratio) {
      composer.setPixelRatio(ratio);
      composer.setSize(width, height);
    },
    setLight(light) {
      // A pale ground would bloom to white; light themes keep the lens only.
      bloom.enabled = !light;
      lens.uniforms.uLight.value = light ? 1 : 0;
    },
    dispose() {
      bloom.dispose();
      lens.dispose();
      composer.dispose();
      target.dispose();
    },
  };
}
