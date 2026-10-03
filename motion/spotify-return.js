(() => {
  const q=new URLSearchParams(location.search),lang=q.get('lang')==='ar'?'ar':'en';
  const valid=['intro','my-voice','clone-lab','live','text-to-speech','training','voice-arcade','evolution','settings','guide','finale'];
  const chapter=valid.includes(q.get('chapter'))?q.get('chapter'):'intro';
  const link=document.createElement('a');link.href=`../motion/mk-voice/?lang=${lang}#${chapter}`;
  link.textContent=lang==='ar'?'MK Voice · الاستوديو':'MK Voice · The studio';
  link.style.cssText='color:#1ed760;border:1px solid #1ed76066;border-radius:99px;padding:7px 13px;font:600 12px system-ui;display:inline-flex;align-items:center;min-height:40px';
  link.setAttribute('aria-label',lang==='ar'?'عد إلى فيلم MK Voice':'Return to the MK Voice film');
  (document.querySelector('.chrome .grp')||document.querySelector('.chrome'))?.append(link);
})();
