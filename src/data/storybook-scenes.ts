import type { ProjectMeta } from './projects';

export type StorybookMotion = 'pan' | 'dolly' | 'track' | 'crane' | 'orbit' | 'reveal' | 'sweep' | 'settle';

export interface StorybookScene {
  readonly image?: string;
  readonly transition?: string;
  readonly motion: StorybookMotion;
  readonly startX: number;
  readonly endX: number;
  readonly lift: number;
  readonly zoom: number;
  readonly tilt: number;
  readonly focal: 'left' | 'center' | 'right';
}

const scenes: Record<string, StorybookScene> = {
  'career-autopilot': { image: '/images/storybook/career-autopilot.webp', transition: 'approval-lever', motion: 'track', startX: 10, endX: -10, lift: -2, zoom: 1.22, tilt: -0.35, focal: 'center' },
  'lifeos': { image: '/images/storybook/lifeos.webp', transition: 'closing-shutters', motion: 'dolly', startX: 8, endX: -8, lift: 1, zoom: 1.28, tilt: 0.18, focal: 'center' },
  'medmac-document-studio': { image: '/images/storybook/medmac-document-studio.webp', transition: 'press-impression', motion: 'sweep', startX: 11, endX: -11, lift: -1, zoom: 1.2, tilt: -0.18, focal: 'center' },
  'medmac-box-studio': { image: '/images/storybook/medmac-box-studio.webp', transition: 'carton-fold', motion: 'orbit', startX: 9, endX: -12, lift: 2, zoom: 1.24, tilt: 0.4, focal: 'center' },
  'cake-studio': { image: '/images/storybook/cake-studio.webp', transition: 'icing-reveal', motion: 'settle', startX: 12, endX: -9, lift: -3, zoom: 1.19, tilt: -0.12, focal: 'center' },
  'quotations-locker': { image: '/images/storybook/quotations-locker.webp', transition: 'vault-seal', motion: 'reveal', startX: 10, endX: -12, lift: 0, zoom: 1.25, tilt: 0.26, focal: 'right' },
  'reclaim': { image: '/images/storybook/reclaim.webp', transition: 'shelf-rush', motion: 'track', startX: 13, endX: -13, lift: -1, zoom: 1.3, tilt: -0.22, focal: 'center' },
  'sheep-cycle': { image: '/images/storybook/sheep-cycle.webp', transition: 'balance-drop', motion: 'crane', startX: 9, endX: -10, lift: -4, zoom: 1.18, tilt: 0.2, focal: 'center' },
  'resume-builder-skill': { image: '/images/storybook/resume-builder-skill.webp', transition: 'page-measure', motion: 'dolly', startX: 10, endX: -9, lift: 1, zoom: 1.24, tilt: -0.16, focal: 'right' },
  'polyblast-arena': { image: '/images/storybook/polyblast-arena.webp', transition: 'referee-tick', motion: 'orbit', startX: 12, endX: -12, lift: -2, zoom: 1.27, tilt: 0.34, focal: 'center' },
  'petpoint-ops-hub': { image: '/images/storybook/petpoint-ops-hub.webp', transition: 'branch-route', motion: 'sweep', startX: 13, endX: -11, lift: 2, zoom: 1.21, tilt: -0.28, focal: 'center' },
  'relayops': { image: '/images/storybook/relayops.webp', transition: 'rail-switch', motion: 'track', startX: 14, endX: -14, lift: -1, zoom: 1.29, tilt: 0.22, focal: 'center' },
  'statement-styler': { image: '/images/storybook/statement-styler.webp', transition: 'scanner-pass', motion: 'crane', startX: 10, endX: -10, lift: -5, zoom: 1.23, tilt: -0.14, focal: 'right' },
  'meta-ads': { image: '/images/storybook/meta-ads.webp', transition: 'spotlight-narrow', motion: 'reveal', startX: 12, endX: -13, lift: 1, zoom: 1.26, tilt: 0.12, focal: 'center' },
  'al-maali': { image: '/images/storybook/al-maali.webp', transition: 'audience-widen', motion: 'dolly', startX: 11, endX: -12, lift: -2, zoom: 1.19, tilt: -0.3, focal: 'right' },
  'crm': { image: '/images/storybook/crm.webp', transition: 'drawer-sort', motion: 'settle', startX: 9, endX: -11, lift: 2, zoom: 1.22, tilt: 0.17, focal: 'center' },
  'brand-system': { image: '/images/storybook/brand-system.webp', transition: 'print-registration', motion: 'sweep', startX: 13, endX: -9, lift: -2, zoom: 1.2, tilt: -0.24, focal: 'right' },
  'sheep-app': { image: '/images/storybook/sheep-app.webp', transition: 'ledger-bind', motion: 'track', startX: 10, endX: -12, lift: 0, zoom: 1.25, tilt: 0.21, focal: 'right' },
  'hr-system': { image: '/images/storybook/hr-system.webp', transition: 'intake-sort', motion: 'reveal', startX: 13, endX: -10, lift: -1, zoom: 1.23, tilt: -0.19, focal: 'center' },
  'medmac-website': { image: '/images/storybook/medmac-website.webp', transition: 'bilingual-gate', motion: 'crane', startX: 12, endX: -12, lift: -4, zoom: 1.21, tilt: 0.15, focal: 'right' },
  'ai-workflow': { image: '/images/storybook/ai-workflow.webp', transition: 'conductor-cue', motion: 'orbit', startX: 11, endX: -13, lift: 1, zoom: 1.28, tilt: -0.23, focal: 'center' },
  'my-resume': { image: '/images/storybook/my-resume.webp', transition: 'evidence-pin', motion: 'settle', startX: 10, endX: -11, lift: -2, zoom: 1.2, tilt: 0.27, focal: 'right' },
  'spaceframe-world': { image: '/images/storybook/spaceframe-world.webp', transition: 'load-deflect', motion: 'crane', startX: 12, endX: -10, lift: -5, zoom: 1.24, tilt: -0.11, focal: 'center' },
  'b2mh': { image: '/images/storybook/b2mh.webp', transition: 'material-layer', motion: 'dolly', startX: 9, endX: -12, lift: 1, zoom: 1.3, tilt: 0.2, focal: 'right' },
  'artillery3d': { image: '/images/storybook/artillery3d.webp', transition: 'turn-referee', motion: 'orbit', startX: 13, endX: -13, lift: -1, zoom: 1.26, tilt: -0.33, focal: 'center' },
  'war-strikes': { image: '/images/storybook/war-strikes.webp', transition: 'test-wall', motion: 'track', startX: 14, endX: -12, lift: 2, zoom: 1.27, tilt: 0.16, focal: 'right' },
  'uberstrike-restoration': { image: '/images/storybook/uberstrike-restoration.webp', transition: 'museum-glass', motion: 'reveal', startX: 11, endX: -10, lift: -2, zoom: 1.22, tilt: -0.2, focal: 'center' },
  'cocolani-3d': { image: '/images/storybook/cocolani-3d.webp', transition: 'archive-fragment', motion: 'sweep', startX: 12, endX: -13, lift: 0, zoom: 1.25, tilt: 0.31, focal: 'right' },
  'job-apply-engine': { image: '/images/storybook/job-apply-engine.webp', transition: 'receipt-stamp', motion: 'settle', startX: 10, endX: -12, lift: -1, zoom: 1.23, tilt: -0.17, focal: 'right' },
  'portfolio-design-system': { image: '/images/storybook/portfolio-design-system.webp', transition: 'stage-change', motion: 'crane', startX: 13, endX: -11, lift: -4, zoom: 1.29, tilt: 0.24, focal: 'center' },
};

export function storybookSceneFor(project: ProjectMeta): StorybookScene {
  return scenes[project.slug] ?? {
    image: `/images/storybook/${project.slug}.webp`,
    transition: 'page-turn',
    motion: 'pan', startX: 10, endX: -10, lift: 0, zoom: 1.22, tilt: 0, focal: 'center',
  };
}
