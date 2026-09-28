/* ---------- EASY EDITS ---------- */
const FROM = "Your bestie";           // put your name here, e.g. "Love, Aarav"
const NAME = "Pratiksha";
const BIRTH = {month:0, day:1, year:2011}; // 1 January 2011
const STARS = [
  {t:"Kindness",      c:"var(--mint)", x:14, y:26, m:"You notice when someone needs a hand, and you help without making a big deal of it."},
  {t:"Your laugh",    c:"var(--sun)",  x:34, y:14, m:"It's contagious. One laugh from you fixes a bad day."},
  {t:"Loyalty",       c:"var(--sky)",  x:56, y:30, m:"You stay. Through the easy times and the messy ones. That means everything."},
  {t:"Support",       c:"var(--rose)", x:80, y:16, m:"When I doubt myself, you remind me what I can do."},
  {t:"Fun",           c:"var(--sun)",  x:88, y:52, m:"Even ordinary plans turn into good memories with you."},
  {t:"Honesty",       c:"var(--mint)", x:64, y:70, m:"You tell the truth with care. That's rare, and I trust it."},
  {t:"Your heart",    c:"var(--rose)", x:36, y:62, m:"You care deeply about the people around you, and it shows."},
  {t:"You, being you",c:"var(--sky)",  x:15, y:76, m:"No one else is like you. Never change that."}
];
const WORDS = ["Kind","Funny","Loyal","Brave","Creative","Caring","Real","Sunshine","Trustworthy","Awesome","Thoughtful","Unstoppable"];
/* -------------------------------- */

document.getElementById('sign').textContent = FROM;

// hero name with animated letters
const nameEl = document.getElementById('name');
[...NAME].forEach((ch,i)=>{const s=document.createElement('span');s.textContent=ch;s.setAttribute('aria-hidden','true');nameEl.appendChild(s)});

// constellation
const sky = document.getElementById('sky'), lines = document.getElementById('lines');
const panel = document.getElementById('panel'), found = document.getElementById('found');
const opened = new Set();
function drawLines(){
  const w = sky.clientWidth, h = sky.clientHeight;
  lines.setAttribute('viewBox',`0 0 ${w} ${h}`);
  lines.innerHTML = '';
  STARS.forEach((s,i)=>{
    if(!i) return;
    const p = STARS[i-1];
    const l = document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1',p.x/100*w);l.setAttribute('y1',p.y/100*h);
    l.setAttribute('x2',s.x/100*w);l.setAttribute('y2',s.y/100*h);
    lines.appendChild(l);
  });
}
STARS.forEach((s,i)=>{
  const b = document.createElement('button');
  b.className='star';b.style.left=s.x+'%';b.style.top=s.y+'%';b.style.setProperty('--c',s.c);
  b.setAttribute('aria-label',s.t);
  b.innerHTML=`<i></i><b>${s.t}</b>`;
  b.onclick=()=>{
    document.querySelectorAll('.star.on').forEach(e=>e.classList.remove('on'));
    b.classList.add('on');
    panel.style.setProperty('--panelc',s.c);
    panel.innerHTML=`<h3>${s.t}</h3><p>${s.m}</p>`;
    opened.add(i);
    found.textContent = opened.size===STARS.length
      ? 'All 8 stars found. You shine like every one of them.'
      : `${opened.size} of ${STARS.length} stars found`;
    if(opened.size===STARS.length) burst();
  };
  sky.appendChild(b);
});
drawLines();addEventListener('resize',drawLines);

// words
const wall = document.getElementById('wall');
WORDS.forEach(w=>{
  const s=document.createElement('span');s.textContent=w;s.tabIndex=0;s.style.cursor='pointer';
  const go=()=>burst(s.getBoundingClientRect().left+s.offsetWidth/2,s.getBoundingClientRect().top+s.offsetHeight/2,18);
  s.onclick=go;s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};
  wall.appendChild(s);
});

// countdown to next 1 January
const pad=n=>String(n).padStart(2,'0');
function tick(){
  const now=new Date();
  let y=now.getFullYear();
  let next=new Date(y,BIRTH.month,BIRTH.day);
  if(next<=now) next=new Date(y+1,BIRTH.month,BIRTH.day);
  const turning=next.getFullYear()-BIRTH.year;
  document.getElementById('ageLine').textContent=`Counting down to your ${turning}th birthday on 1 January ${next.getFullYear()}.`;
  const diff=next-now;
  document.getElementById('d').textContent=Math.floor(diff/864e5);
  document.getElementById('h').textContent=pad(Math.floor(diff/36e5)%24);
  document.getElementById('m').textContent=pad(Math.floor(diff/6e4)%60);
  document.getElementById('s').textContent=pad(Math.floor(diff/1e3)%60);
}
tick();setInterval(tick,1000);

// twinkling background stars
const bg=document.getElementById('stars'),bx=bg.getContext('2d');
let pts=[];
function sizeBg(){bg.width=innerWidth;bg.height=innerHeight;pts=Array.from({length:Math.min(120,Math.floor(innerWidth/9))},()=>({x:Math.random()*bg.width,y:Math.random()*bg.height,r:Math.random()*1.6+.3,p:Math.random()*6}))}
sizeBg();addEventListener('resize',sizeBg);
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function drawBg(t){
  bx.clearRect(0,0,bg.width,bg.height);
  pts.forEach(p=>{bx.globalAlpha=.35+.65*Math.abs(Math.sin(p.p+t/1400));bx.fillStyle='#fff';bx.beginPath();bx.arc(p.x,p.y,p.r,0,7);bx.fill()});
  if(!still) requestAnimationFrame(drawBg);
}
requestAnimationFrame(drawBg);

// confetti
const fx=document.getElementById('fx'),fc=fx.getContext('2d');
let bits=[],run=false;
function sizeFx(){fx.width=innerWidth;fx.height=innerHeight}sizeFx();addEventListener('resize',sizeFx);
const cols=['#ffd166','#7be0b5','#6ec1ff','#ff8fab','#ffffff'];
function burst(x=innerWidth/2,y=innerHeight/3,n=140){
  if(still) return;
  for(let i=0;i<n;i++){const a=Math.random()*6.283,v=Math.random()*9+3;
    bits.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,s:Math.random()*7+4,c:cols[i%cols.length],r:Math.random()*6,l:100+Math.random()*60})}
  if(!run){run=true;requestAnimationFrame(loop)}
}
function loop(){
  fc.clearRect(0,0,fx.width,fx.height);
  bits=bits.filter(b=>b.l>0);
  bits.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vy+=.28;b.vx*=.99;b.r+=.2;b.l--;
    fc.save();fc.translate(b.x,b.y);fc.rotate(b.r);fc.fillStyle=b.c;fc.globalAlpha=Math.min(1,b.l/40);fc.fillRect(-b.s/2,-b.s/4,b.s,b.s/2);fc.restore()});
  if(bits.length) requestAnimationFrame(loop); else run=false;
}
document.getElementById('party').onclick=()=>{burst(innerWidth*.3,innerHeight*.4);burst(innerWidth*.7,innerHeight*.4)};
setTimeout(()=>burst(),600);
