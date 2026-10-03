/* Accessible discovery object. Direct URLs still open the original standalone world. */
(() => {
  const token = document.querySelector('[data-cake-film-token]');
  if (!token) return;
  const query = new URLSearchParams(location.search);
  if (['en', 'ar'].includes(query.get('lang'))) {
    const ar = query.get('lang') === 'ar';
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('lang-ar', ar);
    document.querySelectorAll('[data-lang-toggle]').forEach(button => button.setAttribute('aria-pressed', String(ar)));
  }
  const sync = () => {
    const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    token.href = `../motion/cake-studio/?lang=${lang}#portal`;
    token.title = lang === 'ar' ? 'باب صغير يعود بك إلى الفيلم' : 'A little door back to the film';
  };
  sync();
  new MutationObserver(sync).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
})();
