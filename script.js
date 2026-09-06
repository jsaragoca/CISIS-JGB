
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const body = document.body;
const langBtn = $('#lang-toggle');
const themeBtn = $('#theme-toggle');
const menuBtn = $('.menu-toggle');
const nav = $('#site-nav');

function setLang(lang){
  body.classList.toggle('en', lang === 'en');
  document.documentElement.lang = lang;
  langBtn.textContent = lang === 'en' ? 'PT' : 'EN';
  localStorage.setItem('cisis-lang', lang);
}
setLang(localStorage.getItem('cisis-lang') || 'pt');
langBtn.addEventListener('click', ()=>setLang(body.classList.contains('en') ? 'pt' : 'en'));

function setTheme(theme){
  body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('cisis-theme', theme);
}
setTheme(localStorage.getItem('cisis-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
themeBtn.addEventListener('click', ()=>setTheme(body.classList.contains('dark') ? 'light':'dark'));

menuBtn.addEventListener('click', ()=>{
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
$$('.nav a').forEach(a=>a.addEventListener('click', ()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));

$$('.chip').forEach(btn=>btn.addEventListener('click', ()=>{
  $$('.chip').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const f=btn.dataset.filter;
  $$('.project-card').forEach(card=>card.hidden = !(f==='all'||card.dataset.category===f));
}));

$('#team-search').addEventListener('input', e=>{
  const q=e.target.value.trim().toLowerCase();
  $$('.person-card').forEach(card=>card.hidden = !card.dataset.name.includes(q));
});

const lb=$('#lightbox'), lbImg=$('#lightbox img');
$$('.gallery-item').forEach(btn=>btn.addEventListener('click', ()=>{
  lbImg.src=btn.dataset.full; lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
}));
$('.lightbox-close').addEventListener('click', closeLb);
lb.addEventListener('click', e=>{if(e.target===lb) closeLb()});
document.addEventListener('keydown', e=>{if(e.key==='Escape') closeLb()});
function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');lbImg.src=''}

$('#copy-email').addEventListener('click', async()=>{
  const msg = body.classList.contains('en') ? 'Email copied.' : 'E-mail copiado.';
  try{await navigator.clipboard.writeText('cisis.jgb@gmail.com'); $('#copy-status').textContent=msg}
  catch{window.location.href='mailto:cisis.jgb@gmail.com'}
});
$('#share-btn').addEventListener('click', async()=>{
  const data={title:'CISIS-JGB',text:'CISIS-JGB',url:location.href};
  if(navigator.share){try{await navigator.share(data)}catch{}}
  else {await navigator.clipboard.writeText(location.href); alert(body.classList.contains('en')?'Link copied.':'Ligação copiada.')}
});

const back=$('#back-top');
addEventListener('scroll',()=>back.style.display=scrollY>500?'block':'none');
back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
$$('.reveal').forEach(el=>io.observe(el));

$('#year').textContent = new Date().getFullYear();

if ('serviceWorker' in navigator) addEventListener('load', ()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
