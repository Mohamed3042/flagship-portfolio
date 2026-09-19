import type { Localized } from './projects';
/** Summaries of the owner's sixteen SKILL.md frontmatters, read 2026-09-19. */
export const workshop: {key:string; label:string; line:Localized}[] = [
  ['agent-brain','Project context, capabilities and recoverable progress.','سياق المشاريع، والأدوات المتاحة، وتقدّم يمكن استئنافه.'],
  ['metahuman-cloner','Characters from face and skin to wardrobe and engine delivery.','شخصيات تبدأ بالوجه والبشرة وتنتهي بالملابس والتسليم لمحركات الألعاب.'],
  ['mh-oneshot','An approved character sheet becomes a MetaHuman and engine package.','تحويل لوحة شخصية معتمدة إلى MetaHuman وحزمة للمحرك.'],
  ['head-texture-pipeline','A photograph becomes a verified, exported head texture.','تحويل صورة إلى خامة رأس مع التحقق منها وتصديرها.'],
  ['photo-to-metahuman-skin','Photographed skin fitted and verified on a built MetaHuman.','تركيب البشرة المصوّرة على MetaHuman والتحقق من الوجه والرقبة والجسم.'],
  ['garment-clone','A garment reference becomes a rigged outfit for four games.','تحويل مرجع ملابس إلى زيّ مربوط بالهيكل لأربع ألعاب.'],
  ['blender-character-forge','Blender characters with likeness, rigs, hair and baked materials.','بناء شخصيات في Blender مع الملامح والهيكل والشعر والخامات المخبوزة.'],
  ['map-reimagine','An approved map concept becomes a verified scene in the engine.','تحويل تصور معتمد لخريطة إلى مشهد متحقق منه داخل المحرك.'],
  ['asset-library','Find and index local assets, textures and Blender addons.','البحث في الأصول والخامات وإضافات Blender المحلية وفهرستها.'],
  ['superblender','Find installed addons, their operators and tested workflows.','العثور على الإضافات المثبتة وأوامرها ومسارات العمل المجربة.'],
  ['scroll-world','Connected worlds whose camera follows the visitor’s scroll.','عوالم متصلة تتحرك كاميرتها مع تمرير الزائر.'],
  ['prompt-king','A cinematic production prompt with an exact video credit budget.','صياغة طلب إنتاج سينمائي مع ميزانية دقيقة لرصيد الفيديو.'],
  ['calm-ui','Calm interfaces with progressive disclosure, undo and useful motion.','واجهات هادئة بتفاصيل تظهر عند الحاجة وتراجع وحركة توضّح الأفعال.'],
  ['review-sheet','Scored visual comparisons for a specific human decision.','مقارنات بصرية قابلة للتقييم لاتخاذ قرار بشري محدد.'],
  ['checklist-board','An interactive checklist for a handoff with several actions.','قائمة تفاعلية لتتبّع خطوات التسليم المتعددة.'],
  ['dispatch','Choose an available model or divide work using current evidence.','اختيار نموذج متاح أو تقسيم العمل بناءً على القدرات والأدلة الحالية.'],
].map(([key,en,ar])=>({key,label:key,line:{en,ar}}));
