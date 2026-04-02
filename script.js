/* DATRIX — script.js */

/* ── 2. CURSOR ── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
document.addEventListener('mousemove', e=>{
  cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px';
  setTimeout(()=>{ trail.style.left=e.clientX+'px'; trail.style.top=e.clientY+'px'; },80);
});
document.addEventListener('mousedown',()=>{ cursor.style.transform='translate(-50%,-50%) scale(.6)'; cursor.style.background='var(--silver)'; });
document.addEventListener('mouseup',  ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1)';  cursor.style.background='var(--gold)'; });

/* ── 3. NAVBAR ── */
window.addEventListener('scroll',()=>{ document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>40); });

/* ── 4. MOBILE MENU ── */
function toggleMenu(){
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}));

/* ── 5. PAGE NAVIGATION ── */
function navigate(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById('page-'+page);
  if(t){t.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.page===page));
  setTimeout(()=>{ runReveal(); if(page==='home') runCounters(); },100);
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ── 6. BG PARTICLES ── */
(function(){
  const c=document.getElementById('bg-canvas'),ctx=c.getContext('2d');
  let W,H;
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);
  const COLS=['rgba(200,169,110,','rgba(184,196,212,','rgba(232,213,163,'];
  const pts=Array.from({length:55},()=>mk());
  function mk(r=false){return{x:Math.random()*(W||window.innerWidth),y:r?(H||window.innerHeight)+10:Math.random()*(H||window.innerHeight),r:.6+Math.random()*1.8,vx:(Math.random()-.5)*.3,vy:-(0.2+Math.random()*.6),col:COLS[Math.floor(Math.random()*COLS.length)],op:.1+Math.random()*.3};}
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-10){pts[i]=mk(true);return;}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.col+p.op+')';ctx.shadowBlur=5;ctx.shadowColor=p.col+'.5)';ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 7. CONFETTI ── */
function fireConfetti(){
  const c=document.getElementById('confetti-canvas');
  c.style.display='block';c.width=window.innerWidth;c.height=window.innerHeight;
  const ctx=c.getContext('2d');
  const COLS=['#c8a96e','#e8d5a3','#b8c4d4','#9a7d4a','#ffffff','#d4af6e','#8b9dc3','#f0e6c8'];
  const ps=Array.from({length:280},()=>({
    x:Math.random()*c.width, y:Math.random()*c.height-c.height,
    w:5+Math.random()*10,h:3+Math.random()*6,
    color:COLS[Math.floor(Math.random()*COLS.length)],
    rot:Math.random()*Math.PI*2,vx:(Math.random()-.5)*5,vy:2+Math.random()*5,
    vr:(Math.random()-.5)*.25,op:1,shape:Math.random()>.55?'circle':'rect'
  }));
  let fr=0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);fr++;
    let alive=false;
    ps.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
      if(fr>90)p.op-=.01;
      if(p.y<c.height+20&&p.op>0){
        alive=true;ctx.save();ctx.globalAlpha=Math.max(0,p.op);
        ctx.translate(p.x,p.y);ctx.rotate(p.rot);
        ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;
        if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill();}
        else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
        ctx.restore();
      }
    });
    if(alive)requestAnimationFrame(draw);
    else{ctx.clearRect(0,0,c.width,c.height);c.style.display='none';}
  }
  draw();
}

/* ── 8. SCROLL REVEAL ── */
function runReveal(){
  const els=document.querySelectorAll('[data-reveal]:not(.revealed)');
  if(!els.length)return;
  const obs=new IntersectionObserver((ents)=>{
    ents.forEach((e,i)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('revealed'),i*100);obs.unobserve(e.target);}
    });
  },{threshold:.12});
  els.forEach(el=>obs.observe(el));
}
runReveal();

/* ── 9. STAT COUNTERS ── */
function animateCounter(el,target,dur=1800){
  let s=null;
  function step(ts){
    if(!s)s=ts;
    const p=Math.min((ts-s)/dur,1),ease=1-Math.pow(1-p,3);
    el.textContent=Math.floor(ease*target);
    if(p<1)requestAnimationFrame(step);
    else el.textContent=target+(target>=50?'+':'');
  }
  requestAnimationFrame(step);
}
function runCounters(){
  const cs=document.querySelectorAll('.stat-num[data-count]');
  if(!cs.length)return;
  const obs=new IntersectionObserver(ents=>{
    ents.forEach(e=>{if(e.isIntersecting){animateCounter(e.target,parseInt(e.target.dataset.count));obs.unobserve(e.target);}});
  },{threshold:.4});
  cs.forEach(el=>obs.observe(el));
}
runCounters();

/* ── 10. NEWSLETTER ── */
function subscribeNewsletter(){
  const inp=document.getElementById('emailInput'),suc=document.getElementById('newsletterSuccess');
  const v=inp.value.trim();
  if(!v||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){
    inp.style.borderColor='#cc4444';inp.placeholder='Enter a valid email!';
    setTimeout(()=>{inp.style.borderColor='';inp.placeholder='your@email.com';},2000);return;
  }
  suc.style.display='block';inp.value='';inp.style.borderColor='rgba(200,169,110,.5)';
  setTimeout(()=>{suc.style.display='none';inp.style.borderColor='';},5000);
}

/* ── 11. SEND MESSAGE ── */
function sendMessage(btn){
  const orig=btn.innerHTML;
  btn.innerHTML='✓ Message Sent!';btn.style.background='linear-gradient(135deg,rgba(200,169,110,.4),rgba(184,196,212,.4))';btn.disabled=true;
  setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';btn.disabled=false;},4000);
}

/* ── 12. RIPPLE ── */
document.querySelectorAll('.btn-primary,.btn-ghost,.splash-inaugurate-btn').forEach(btn=>{
  btn.addEventListener('click',function(e){
    const r=document.createElement('span'),rect=this.getBoundingClientRect();
    const sz=Math.max(rect.width,rect.height)*1.5;
    r.style.cssText=`position:absolute;border-radius:50%;pointer-events:none;width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px;background:rgba(255,255,255,.15);animation:ripA .6s ease-out forwards;`;
    if(getComputedStyle(this).position==='static')this.style.position='relative';
    this.appendChild(r);setTimeout(()=>r.remove(),700);
  });
});
const rs=document.createElement('style');
rs.textContent='@keyframes ripA{from{transform:scale(0);opacity:1;}to{transform:scale(1);opacity:0;}}';
document.head.appendChild(rs);

/* ── 13. HERO GLOW + KEYBOARD ── */
const ht=document.querySelector('.hero-title');
if(ht){
  ht.addEventListener('mouseenter',()=>ht.style.filter='drop-shadow(0 0 50px rgba(200,169,110,.7))');
  ht.addEventListener('mouseleave',()=>ht.style.filter='drop-shadow(0 0 30px rgba(200,169,110,.4))');
}
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='2')navigate('about');
  if(e.key==='ArrowLeft' ||e.key==='1')navigate('home');
  if(e.key==='3')navigate('contact');
});
