
(function(){
  const langWrap=document.querySelector('.kg-lang');
  const langBtn=document.querySelector('.kg-lang-current');
  if(langBtn && langWrap){
    langBtn.addEventListener('click',()=>langWrap.classList.toggle('open'));
    document.addEventListener('click',e=>{
      if(!langWrap.contains(e.target)) langWrap.classList.remove('open');
    });
  }
  const applyLang=(lang)=>{
    const dict=(window.KIMPACT_I18N||{})[lang]||(window.KIMPACT_I18N||{}).ko||{};
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const v=dict[el.dataset.i18n];
      if(v!==undefined) el.innerHTML=v;
    });
    const label=document.querySelector('#kg-lang-label');
    if(label) label.textContent=lang.toUpperCase();
    localStorage.setItem('kimpact-lang',lang);
    langWrap && langWrap.classList.remove('open');
  };
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>applyLang(btn.dataset.lang)));
  applyLang(localStorage.getItem('kimpact-lang')||'ko');

  const burger=document.querySelector('.kg-hamburger');
  const mobile=document.querySelector('.kg-mobile-nav');
  if(burger && mobile){
    burger.addEventListener('click',()=>mobile.classList.toggle('open'));
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));
  }
})();
