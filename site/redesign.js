/* Section navigation for long pages. No data collection or external requests. */
(function(){
 const root=document.documentElement,fr=root.lang==='fr',main=document.querySelector('main');if(!main||document.body.dataset.page==='index')return;
 const headings=Array.from(main.querySelectorAll('section>h2,section>.section-top>div>h2')).filter(h=>!h.closest('[hidden]'));
 if(headings.length<3)return;
 const nav=document.createElement('nav');nav.className='page-index';nav.setAttribute('aria-label',fr?'Dans cette page':'On this page');const label=document.createElement('span');label.textContent=fr?'DANS CETTE PAGE':'ON THIS PAGE';nav.appendChild(label);
 headings.forEach((h,i)=>{const section=h.closest('section');if(!section.id)section.id='chapter-'+(i+1);const link=document.createElement('a');link.href='#'+section.id;link.textContent=h.innerText.trim().replace(/\s+/g,' ');nav.appendChild(link);});
 const header=main.querySelector('.page-head');if(header)header.after(nav);
 if('IntersectionObserver'in window){const links=Array.from(nav.querySelectorAll('a'));const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(a=>a.removeAttribute('aria-current'));const active=links.find(a=>a.hash==='#'+e.target.id);if(active)active.setAttribute('aria-current','true');}},{rootMargin:'-15% 0px -65% 0px'});headings.forEach(h=>io.observe(h.closest('section')));}
})();
