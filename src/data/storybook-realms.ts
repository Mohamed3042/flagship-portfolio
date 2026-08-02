import type { ProjectMeta } from './projects';

export const STORYBOOK_REALMS = ['workshop', 'observatory', 'archive', 'garden', 'forge', 'harbor', 'clocktower', 'theatre'] as const;
export type StorybookRealm = (typeof STORYBOOK_REALMS)[number];

/** Deliberate art direction: each paper environment follows the project's actual idea. */
const realmBySlug: Record<string, StorybookRealm> = {
  'career-autopilot': 'workshop',
  'lifeos': 'observatory',
  'medmac-document-studio': 'archive',
  'medmac-box-studio': 'workshop',
  'cake-studio': 'theatre',
  'quotations-locker': 'archive',
  'reclaim': 'clocktower',
  'sheep-cycle': 'garden',
  'resume-builder-skill': 'archive',
  'polyblast-arena': 'forge',
  'petpoint-ops-hub': 'workshop',
  'relayops': 'harbor',
  'statement-styler': 'archive',
  'meta-ads': 'observatory',
  'al-maali': 'theatre',
  'crm': 'clocktower',
  'brand-system': 'theatre',
  'sheep-app': 'garden',
  'hr-system': 'archive',
  'medmac-website': 'theatre',
  'ai-workflow': 'workshop',
  'my-resume': 'archive',
  'spaceframe-world': 'observatory',
  'b2mh': 'workshop',
  'artillery3d': 'forge',
  'war-strikes': 'forge',
  'uberstrike-restoration': 'archive',
  'cocolani-3d': 'theatre',
  'job-apply-engine': 'clocktower',
  'portfolio-design-system': 'workshop',
};

export function storybookRealmFor(project: ProjectMeta): StorybookRealm {
  return realmBySlug[project.slug] ?? STORYBOOK_REALMS[0];
}
