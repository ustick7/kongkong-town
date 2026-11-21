/* 콩콩마을 공통 엔진
   - 과목(subject) → 영역(area) → 단계(level) → 문제(prob) 구조
   - 새 과목: K.subject({...})   새 영역: K.area('과목id', {...})
   - 영역은 types: { 문제종류: (p, G) => {...} } 로 문제 화면을 그림. G는 공통 게임 도구.
*/
'use strict';
const K = window.K = {};
K.BRAND = '콩콩마을';
K.TAGLINE = '콩이랑 놀다 보면 생각이 쑥쑥 자라는 마을';

/* ---------- 물건 사전 (이모지, 이름) ---------- */
K.IT = {
  lemon:['🍋','레몬'],cabbage:['🥬','배추'],apple:['🍎','사과'],straw:['🍓','딸기'],melon:['🍉','수박'],carrot:['🥕','당근'],
  mush:['🍄','버섯'],pear:['🍐','배'],grape:['🍇','포도'],banana:['🍌','바나나'],peach:['🍑','복숭아'],cherry:['🍒','체리'],
  bear:['🐻','곰'],dog:['🐶','강아지'],cat:['🐱','고양이'],mouse:['🐭','생쥐'],ele:['🐘','코끼리'],pig:['🐷','돼지'],
  chick:['🐤','병아리'],rabbit:['🐰','토끼'],fox:['🦊','여우'],frog:['🐸','개구리'],panda:['🐼','판다'],lion:['🦁','사자'],
  candy:['🍬','사탕'],cookie:['🍪','쿠키'],star:['⭐','별'],heart:['❤️','하트'],sun:['🌞','해'],moon:['🌙','달'],
  red:['🔴','빨강'],blue:['🔵','파랑'],yellow:['🟡','노랑'],green:['🟢','초록'],flower:['🌷','꽃'],leaf:['🍀','잎'],
  car:['🚗','자동차'],bus:['🚌','버스'],ball:['⚽','공'],balloon:['🎈','풍선'],fish:['🐟','물고기'],egg:['🥚','달걀']
};
K.E = k => (K.IT[k]||[k,k])[0];
K.N = k => (K.IT[k]||[k,k])[1];

/* ---------- 한국어 조사 ---------- */
function hasBatchim(w){const c=w.charCodeAt(w.length-1);if(c<0xAC00||c>0xD7A3)return false;return (c-0xAC00)%28>0}
function isRieul(w){const c=w.charCodeAt(w.length-1);return (c-0xAC00)%28===8}
const JOSA={'이':['이','가'],'은':['은','는'],'을':['을','를'],'와':['과','와'],'로':['으로','로'],'랑':['이랑','랑'],'야':['이야','야']};
K.josa=(n,j)=>{const p=JOSA[j];if(!p)return j;if(j==='로')return (hasBatchim(n)&&!isRieul(n))?p[0]:p[1];return hasBatchim(n)?p[0]:p[1]};
/* [k] → 🍋레몬 ,  [k|을] → 🍋레몬을 */
K.fmt=str=>{
  const re=/\[(\w+)(?:\|([^\]]+))?\]/g;
  const html=str.replace(re,(m,k,j)=>{const n=K.N(k);return `<b>${K.E(k)}${n}${j?K.josa(n,j):''}</b>`});
  const text=str.replace(re,(m,k,j)=>{const n=K.N(k);return n+(j?K.josa(n,j):'')}).replace(/<[^>]+>/g,'')
    .replace(/&gt;/g,'보다 큼 ').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu,'');
  return {html,text};
};

/* ---------- 저장 ---------- */
const KEY='kongkong-v1';
K.S={stars:{},voice:true,sfx:true};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)Object.assign(K.S,s)}catch(e){}
K.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(K.S))}catch(e){}};

/* ---------- 유틸 ---------- */
const $=K.$=s=>document.querySelector(s); const $$=K.$$=s=>[...document.querySelectorAll(s)];
let timers=[];
K.later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t};
K.clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};
K.css=txt=>{const s=document.createElement('style');s.textContent=txt;document.head.appendChild(s)};
K.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
K.ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
K.pick=a=>a[Math.floor(Math.random()*a.length)];
K.pickN=(a,n)=>K.shuffle(a).slice(0,n);
/* 보기 만들기: 정답 + 헷갈리는 오답들을 섞어서 */
K.opts=(ans,pool,n=3)=>K.shuffle([ans].concat(K.pickN(pool.filter(x=>String(x)!==String(ans)),n-1)));
/* 문제 묶음 만들기: 첫 문제는 같이 하는 연습, 나머지는 매번 새로 */
/* 같은 답이 연달아 나오면 아이가 생각 없이 찍게 돼서, 바로 앞 문제와 답이 같으면 다시 만들어요 */
K.ANSKEY={};
K.ansKey=p=>{if(!p)return '';const f=K.ANSKEY[p.type];if(f)try{return String(f(p))}catch(e){}
  if(p.ans!=null)return JSON.stringify(p.ans);if(p.tilt!=null)return String(p.tilt);if(p.word)return p.word;return ''};
K.makeSet=(n,fn,guidedFirst)=>{const out=[];for(let i=0;i<n;i++){let p=fn(i);const prev=out[i-1]&&K.ansKey(out[i-1]);
    for(let t=0;t<25&&prev&&K.ansKey(p)===prev;t++)p=fn(i);if(guidedFirst&&i===0)p.guided=true;out.push(p)}return out};
K.el=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};

/* ---------- 소리 ---------- */
let AC=null;
K.ac=()=>{if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC};
function tone(fs,dur=.12,type='sine',gap=.09,vol=.15){if(!K.S.sfx)return;const a=K.ac();if(!a)return;let t=a.currentTime;
  fs.forEach(f=>{const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);
  g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.02);t+=gap})}
K.tone=tone;
K.sfx={pick:()=>tone([660],.06,'triangle'),drop:()=>tone([520,780],.08,'triangle',.06),good:()=>tone([523,659,784,1046],.16,'triangle',.1),
  soft:()=>tone([392,330],.18,'sine',.14,.1),poof:()=>tone([900,1200,1500],.07,'sine',.04,.08),thud:()=>tone([140,90],.2,'square',.08,.08),
  count:()=>tone([880],.07,'sine'),tap:i=>tone([[523,587,659,698,784,880,988,1046][i%8]],.12,'triangle')};
K.speak=text=>{if(!K.S.voice||!('speechSynthesis' in window)||!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=.95;u.pitch=1.15;
  const v=speechSynthesis.getVoices().find(v=>/ko/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}};
K.toast=t=>{$$('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)};
K.confetti=(n=60)=>{const c=document.createElement('div');c.className='confetti';const cols=['#FF8A3D','#4CB963','#4A9FE8','#FFC845','#FF9DB5'];
  for(let i=0;i<n;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=cols[i%5];p.style.animationDuration=(1.6+Math.random()*1.6)+'s';p.style.animationDelay=Math.random()*.4+'s';c.appendChild(p)}
  document.body.appendChild(c);setTimeout(()=>c.remove(),3800)};

/* ---------- 콩이 (마스코트) : 과목마다 모자·소품이 바뀌어요 ---------- */
const HATS={
  sprout:`<path d="M60 22 C60 14 60 10 60 6" stroke="#5AA845" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 10 C50 0 38 4 40 12 C46 14 54 14 60 10Z" fill="#7CC95E"/><path d="M60 10 C70 0 82 4 80 12 C74 14 66 14 60 10Z" fill="#8FD873"/>`,
  bulb:`<g class="bulb"><circle cx="60" cy="4" r="16" fill="#FFE27A" opacity=".35"/><path d="M60 -8 a11 11 0 0 1 7 19.5 v4 h-14 v-4 A11 11 0 0 1 60 -8Z" fill="#FFD43B" stroke="#E0A800" stroke-width="2"/><rect x="53.5" y="16" width="13" height="5" rx="2" fill="#B9B2A6"/><path d="M57 4 l3 4 l3 -4" stroke="#E08A00" stroke-width="1.8" fill="none"/></g>
    <path d="M38 52 h16 M66 52 h16" stroke="#3D2E28" stroke-width="2"/><circle cx="46" cy="52" r="10" fill="rgba(255,255,255,.25)" stroke="#3D2E28" stroke-width="3"/><circle cx="74" cy="52" r="10" fill="rgba(255,255,255,.25)" stroke="#3D2E28" stroke-width="3"/><path d="M56 52 h8" stroke="#3D2E28" stroke-width="3"/>`,
  grad:`<path d="M30 24 L60 12 L90 24 L60 34Z" fill="#3D2E28"/><path d="M84 26 v14" stroke="#FFC845" stroke-width="3"/><circle cx="84" cy="42" r="3.5" fill="#FFC845"/>`,
};
K.buddySvg=(hat)=>{hat=hat||'sprout';return `<svg viewBox="0 -14 120 134" aria-hidden="true">
<ellipse cx="60" cy="116" rx="30" ry="4" fill="rgba(0,0,0,.1)"/>
<path d="M46 104 q-2 10 -10 10 h12Z M74 104 q2 10 10 10 h-12Z" fill="#6DAE4E"/>
<path d="M60 18 C88 16 102 40 98 66 C95 90 84 108 60 108 C34 108 22 92 22 66 C22 40 32 20 60 18Z" fill="#9AD27A"/>
<path d="M60 18 C88 16 102 40 98 66 C96 80 92 90 86 98 C90 84 90 60 78 44 C70 32 60 26 46 22 C50 19 55 18 60 18Z" fill="#86C466"/>
<ellipse cx="60" cy="80" rx="22" ry="20" fill="#C9EBB0"/>
<path d="M24 70 q-12 6 -8 18" stroke="#86C466" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M96 70 q12 6 8 18" stroke="#86C466" stroke-width="8" fill="none" stroke-linecap="round"/>
<circle cx="46" cy="52" r="6.5" fill="#3D2E28"/><circle cx="74" cy="52" r="6.5" fill="#3D2E28"/>
<circle cx="48.4" cy="49.6" r="2.2" fill="#fff"/><circle cx="76.4" cy="49.6" r="2.2" fill="#fff"/>
<g class="lid"><ellipse cx="46" cy="52" rx="8" ry="8" fill="#9AD27A"/><ellipse cx="74" cy="52" rx="8" ry="8" fill="#9AD27A"/></g>
<ellipse cx="36" cy="64" rx="6" ry="4" fill="#FF9DB5" opacity=".7"/><ellipse cx="84" cy="64" rx="6" ry="4" fill="#FF9DB5" opacity=".7"/>
<path d="M52 64 q8 8 16 0" stroke="#3D2E28" stroke-width="3" fill="none" stroke-linecap="round"/>
${HATS[hat]||''}</svg>`};
K.curHat=()=>{const c=K.ctx;if(K.view==='village'||K.view==='guide')return 'sprout';const s=(c.level&&c.level.area.subject)||(c.area&&c.area.subject)||c.subj;return (s&&s.hat)||'sprout'};
K.buddyRow=()=>`<div class="buddy-row"><div class="buddy">${K.buddySvg(K.curHat())}</div><div class="bubble" id="say" role="status"></div></div>`;
let lastLine='';
K.say=str=>{const {html,text}=K.fmt(str);lastLine=text;const b=$('#say');if(!b)return;b.innerHTML=html+'<span class="again">🔊 다시 듣기</span>';
  const o=$('.buddy');if(o){o.classList.remove('talk');void o.offsetWidth;o.classList.add('talk')}K.speak(text)};
document.addEventListener('click',e=>{if(e.target.closest('#say')&&lastLine)K.speak(lastLine)});

/* ---------- 끌어다 놓기 & 눌러서 고르기 ---------- */
let sel=null; K.onDrop=null;
K.bindDrag=(el,payload)=>{
  el.addEventListener('pointerdown',e=>{
    if(e.button>0)return;e.preventDefault();K.ac();const sx=e.clientX,sy=e.clientY;let g=null,moved=false,over=null;
    const mv=ev=>{const dx=ev.clientX-sx,dy=ev.clientY-sy;
      if(!moved&&Math.hypot(dx,dy)>8){moved=true;g=el.cloneNode(true);g.classList.add('dragghost');g.classList.remove('sel');document.body.appendChild(g);K.sfx.pick()}
      if(moved){g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';const t=dropAt(ev.clientX,ev.clientY);if(over!==t){over&&over.classList.remove('over');over=t;over&&over.classList.add('over')}}};
    const up=ev=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      over&&over.classList.remove('over');
      if(moved){g.remove();const t=dropAt(ev.clientX,ev.clientY);if(t&&K.onDrop)K.onDrop(payload,t.dataset.drop,t)}
      else{
        if(payload.tap){payload.tap();return}
        $$('.stk.sel').forEach(x=>x.classList.remove('sel'));if(sel&&sel.el===el){sel=null;return}
        sel={el,payload};el.classList.add('sel');K.sfx.pick()}};
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  });
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(payload.tap)return payload.tap();$$('.stk.sel').forEach(x=>x.classList.remove('sel'));sel={el,payload};el.classList.add('sel')}});
};
function dropAt(x,y){for(const e of document.elementsFromPoint(x,y)){if(e.classList&&e.classList.contains('dragghost'))continue;const d=e.closest&&e.closest('[data-drop]');if(d)return d}return null}
document.addEventListener('click',e=>{const t=e.target.closest('[data-drop]');if(t&&sel&&K.onDrop){const p=sel.payload;sel.el.classList.remove('sel');sel=null;K.onDrop(p,t.dataset.drop,t)}});
K.clearSel=()=>{sel=null};

/* 스티커: html(보이는 그림), label(아래 글자), v(값) */
K.pickText=pl=>{if(!pl)return '';const t=(pl.html||'').replace(/<[^>]+>/g,'').trim();return pl.label?(t?t+' '+pl.label:pl.label):(t||String(pl.v))};
K.sticker=(v,html,label)=>{const d=document.createElement('div');d.className='stk';d.tabIndex=0;d.dataset.v=v;
  d.innerHTML=html+(label?`<span>${label}</span>`:'');K.bindDrag(d,{kind:'stk',v,html,label});return d};
K.stuck=html=>{const s=document.createElement('span');s.className='stuck';s.innerHTML=html;return s};
K.numHtml=n=>`<span class="num">${n}</span>`;

/* ---------- 과목·영역 등록 ---------- */
K.subjects=[];
K.subject=def=>{def.areas=def.areas||[];K.subjects.push(def);return def};
K.area=(sid,def)=>{const s=K.subjects.find(x=>x.id===sid);if(!s)throw new Error('과목 없음: '+sid);def.subject=s;s.areas.push(def);
  def.levels.forEach((l,i)=>{l.area=def;l.idx=i});return def};
const starKey=l=>`${l.area.subject.id}/${l.area.id}/${l.id}`;
K.levelStars=l=>K.S.stars[starKey(l)]||0;
K.areaStars=a=>a.levels.filter(l=>l.probs||l.gen).reduce((s,l)=>s+K.levelStars(l),0);
K.areaMax=a=>a.levels.filter(l=>l.probs||l.gen).length*3;

/* ---------- 화면 전환 ---------- */
K.view='village'; K.ctx={};
K.go=(v,c={})=>{if(K.curP&&!K.curP.done&&!K.curP.practice&&(K.curP.wrong||K.curP.hint||K.curP.edits)&&K.logProb)K.logProb(K.curP,false,'','fail');K.curP=null;K.clearTimers();try{speechSynthesis.cancel()}catch(e){};sel=null;K.onDrop=null;$$('.modal-bg').forEach(m=>m.remove());
  K.view=v;Object.assign(K.ctx,c);K.render();window.scrollTo(0,0)};
K.views={};
K.render=()=>{const a=$('#app');a.innerHTML='';K.views[K.view](a)};
K.topbar=(title,extra='')=>`<div class="topbar"><button class="icon-btn" data-a="back" aria-label="뒤로">←</button><div class="mid">${title}</div>${extra}
  <button class="icon-btn" data-a="voice" aria-label="목소리 켜기/끄기">${K.S.voice?'🔊':'🔇'}</button></div>`;
K.back={village:null,subject:'village',area:'subject',play:'area',free:'area',result:'area',guide:null,garden:'village',settings:'village',report:'village'};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;K.ac();const a=b.dataset.a;
  if(a==='back'){if(K.view==='guide')return K.go(K.ctx.guideFrom||'village');const to=K.back[K.view];if(to)K.go(to)}
  else if(a==='voice'){K.S.voice=!K.S.voice;K.save();b.textContent=K.S.voice?'🔊':'🔇';if(!K.S.voice)try{speechSynthesis.cancel()}catch(e){};K.toast(K.S.voice?'콩이가 읽어 줘요':'목소리를 껐어요')}
  else if(a==='tip')K.showTip(K.ctx.area);
  else if(a==='close')$$('.modal-bg').forEach(m=>m.remove());
});
K.showTip=area=>{if(!area||!area.tip)return;const t=area.tip;const m=document.createElement('div');m.className='modal-bg';
  m.innerHTML=`<div class="sheet" role="dialog" aria-label="부모님 설명 팁"><h2>👪 ${t.t}</h2>${t.b}<p style="margin-top:14px"><button class="btn green big" data-a="close">알겠어요</button></p></div>`;
  m.addEventListener('click',e=>{if(e.target===m)m.remove()});document.body.appendChild(m)};

/* 마을 */
K.views.village=a=>{
  a.innerHTML=`<div class="screen">
   <div class="hud"><button class="icon-btn" id="gd" aria-label="콩이 화분">🪴</button><span class="beans">🫘 <b>${K.S.beans||0}</b></span><span class="grow"></span><button class="icon-btn" data-a="voice" aria-label="목소리 켜기/끄기">${K.S.voice?'🔊':'🔇'}</button><button class="icon-btn" id="rp" aria-label="학습 리포트">📊</button><button class="icon-btn" id="st" aria-label="부모님 설정">⚙️</button></div>
   <div class="brand">${K.BRAND}<small>${K.TAGLINE}</small></div>
   <div class="village"><div class="sun"></div><div class="cloud em">☁️</div>
    <div class="houses">${K.subjects.map((s,i)=>`<button class="house ${s.soon?'soon':''}" data-i="${i}" style="--c:${s.color}">
      <span class="roof"></span><span class="wall"><span class="em">${s.emoji}</span><span class="door"></span></span>
      <span class="nm">${s.name}</span><span class="sub">${s.desc||''}</span></button>`).join('')}</div></div>
   ${K.buddyRow()}
   <button class="btn ghost" id="pg">👪 부모님 가이드</button></div>`;
  K.say(`안녕! 나는 콩이야. ${K.BRAND}에 온 걸 환영해! 오늘은 어느 집에 놀러 갈까?`);
  $$('.house').forEach(b=>b.onclick=()=>{const s=K.subjects[+b.dataset.i];if(s.soon){K.sfx.soft();K.say(`${s.name} 집은 지금 짓고 있어! 곧 열려요.`);return}
    if(s.href){location.href=s.href;return}K.sfx.pick();K.go('subject',{subj:s})});
  $('#pg').onclick=()=>K.go('guide',{guideFrom:'village'});
  $('#gd').onclick=()=>K.go('garden');$('#st').onclick=()=>K.parentCheck?K.parentCheck(()=>K.go('settings')):0;$('#rp').onclick=()=>K.parentCheck(()=>K.go('report',{range:'today'}));
};
/* 과목: 영역 고르기 */
K.views.subject=a=>{const s=K.ctx.subj;
  a.innerHTML=`<div class="screen">${K.topbar(`${s.emoji} ${s.name}`)}${K.buddyRow()}
   <div class="tiles">${s.areas.map((ar,i)=>`<button class="tile" data-i="${i}" style="--c:${ar.color}">${ar.badge?`<span class="badge">${ar.badge}</span>`:''}
     <span class="nm">${ar.name}</span><span class="ds">${ar.desc}</span><span class="em">${ar.emoji}</span>
     <span class="st">★ ${K.areaStars(ar)}/${K.areaMax(ar)}</span></button>`).join('')}</div>
   <button class="btn ghost" id="pg">👪 부모님 가이드</button></div>`;
  K.say(s.hello||'무엇을 해 볼까? 하고 싶은 걸 골라 봐!');
  $$('.tile').forEach(b=>b.onclick=()=>{K.sfx.pick();K.go('area',{area:s.areas[+b.dataset.i]})});
  $('#pg').onclick=()=>K.go('guide',{guideFrom:'subject'});
};
/* 영역: 단계 고르기 */
K.views.area=a=>{const ar=K.ctx.area;
  a.innerHTML=`<div class="screen">${K.topbar(ar.name,ar.tip?`<button class="icon-btn" data-a="tip" aria-label="부모님 팁">👪</button>`:'')}${K.buddyRow()}
   <div class="tiles">${ar.levels.map((l,i)=>{const st=K.levelStars(l);return `<button class="tile" data-i="${i}" style="--c:${l.color||ar.color}">${l.badge?`<span class="badge">${l.badge}</span>`:l.age?`<span class="agechip">${K.AGE_NAME(l.age)}</span>`:''}
     <span class="no">${l.no||(i+1)+'단계'}</span><span class="nm">${l.name}</span><span class="ds">${l.desc||''}</span><span class="em">${l.emoji||''}</span>
     ${K.hasProbs(l)?`<span class="st">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span>`:''}</button>`}).join('')}</div>
   ${ar.tip?`<button class="btn ghost" data-a="tip">👪 이 놀이, 이렇게 설명해 주세요</button>`:''}</div>`;
  K.say(ar.hello||'단계를 골라 봐! 처음이면 1단계부터!');
  $$('.tile').forEach(b=>b.onclick=()=>{const l=ar.levels[+b.dataset.i];K.sfx.pick();l.free?K.go('free',{level:l}):K.play(l)});
};
/* 자유 놀이 */
K.views.free=a=>{const l=K.ctx.level;a.innerHTML=`<div class="screen">${K.topbar(l.name,l.area.tip?`<button class="icon-btn" data-a="tip" aria-label="부모님 팁">👪</button>`:'')}${K.buddyRow()}<div id="free" style="display:flex;flex-direction:column;gap:12px"></div></div>`;
  l.free($('#free'),K)};

/* ---------- 문제 화면과 게임 도구 G ----------
   답하는 방식: 스티커를 칸에 자유롭게 놓고 바꾸고 빼다가, "다 했어요"를 눌러야 채점해요.
   힌트는 생각하는 방법만 알려 주고 답은 알려 주지 않아요. 힌트를 쓰면 별이 줄어요.
   기록: solo 혼자 맞힘 / hint 힌트 보고 맞힘 / retry 다시 해서 맞힘 / hintretry 힌트+다시 / practice 같이 한 연습 / fail 못 풀고 나감 */
K.levelProbs=l=>typeof l.gen==='function'?l.gen():l.probs;
K.hasProbs=l=>!!(l.probs||l.gen);
K.play=(l,o={})=>K.go('play',Object.assign({level:l,probs:K.levelProbs(l),pi:0,score:[],pend:0,retry:false,retryOf:null},o));
K.views.play=a=>{
  const l=K.ctx.level, ar=l.area, probs=K.ctx.probs, p=probs[K.ctx.pi];
  const dots=probs.map((_,i)=>`<i class="${i<K.ctx.pi?'done':i===K.ctx.pi?'on':''}"></i>`).join('');
  a.innerHTML=`<div class="screen play">${K.topbar(`${ar.name} · ${l.name}<div class="dots">${dots}</div>`,ar.tip?`<button class="icon-btn" data-a="tip" aria-label="부모님 팁">👪</button>`:'')}
   ${K.buddyRow()}<div class="board" id="board"></div><div class="tray" id="tray"></div><div class="actions" id="acts"></div></div>`;
  const G=makeG(p);
  const fn=ar.types[p.type];if(!fn)throw new Error('문제 종류 없음: '+p.type);fn(p,G);
};
const ENC=['다시 한 번 살펴볼까? 고칠 곳을 고치고 <b>다 했어요</b>를 눌러 줘.','아깝다! 천천히 다시 생각해 보자. 💡 힌트도 있어.','괜찮아, 틀리면서 똑똑해지는 거야! 다시 해 볼까?'];
function makeG(p){
  const P={p,hint:0,wrong:0,edits:0,done:false,usedHint:false,practice:!!p.guided,t0:Date.now(),picks:[]};K.curP=P;
  const vals={};
  const G={P,p,vals,say:K.say,later:K.later,
    board:$('#board'),tray:$('#tray'),
    html(h){G.board.innerHTML=h;return G.board},
    actions(btns){const a=$('#acts');a.innerHTML='';btns.forEach(([t,cls,fn,id])=>{const b=document.createElement('button');b.className='btn '+cls;b.innerHTML=t;if(id)b.id=id;b.onclick=()=>{K.ac();fn()};a.appendChild(b)})},
    stickers(list,label='스티커를 끌어다 칸에 놓아요. 바꾸려면 다른 스티커를 놓고, 빼려면 칸을 눌러요'){G.tray.className='tray';G.tray.innerHTML=`<div class="lbl">${label}</div>`;list.forEach(s=>G.tray.appendChild(s instanceof Element?s:K.sticker(s.v,s.html,s.label)));},
    numbers(from,to,label){G.stickers([],label||'알맞은 숫자를 끌어다 칸에 놓아요. 바꾸려면 다른 숫자를 놓으면 돼요');G.tray.classList.add('nums');for(let n=from;n<=to;n++)G.tray.appendChild(K.sticker(n,K.numHtml(n)))},
    trayOff(off){G.tray.classList.toggle('off',off)},
    hideTray(){G.tray.style.display='none'},
    hl(sel){$$('.hl').forEach(x=>x.classList.remove('hl'));if(sel){[].concat(sel instanceof NodeList?[...sel]:sel).flatMap(x=>typeof x==='string'?$$(x):[x]).forEach(e=>e&&e.classList&&e.classList.add('hl'))}},
    /* 칸: 스티커를 놓으면 값이 들어가고, 칸을 누르면 비워져요 */
    slot(el,id,empty){el.dataset.drop=id;el.dataset.slot=id;el.classList.add('slotted');el._empty=empty!=null?empty:el.innerHTML;return el},
    setSlot(id,pl){const el=G.board.querySelector(`[data-slot="${id}"]`);if(!el)return;
      if(pl){vals[id]=pl;el.innerHTML='';el.appendChild(K.stuck(pl.html));el.classList.add('filled');K.sfx.drop()}else{delete vals[id];el.innerHTML=el._empty;el.classList.remove('filled');K.sfx.pick()}
      el.classList.remove('wrongmark');G.edit()},
    /* 직접 만든 놀이(시소 올리기 등)에서 무언가 바꿨을 때 */
    edit(){P.edits++;G.onChange&&G.onChange();G.refresh()},
    drop(fn){G._drop=fn},
    accept(fn){G._accept=fn},
    /* 답 확인 설정: check()는 {ok, note(리포트에 남길 아이 답), why(틀렸을 때 콩이 말), line(맞았을 때 콩이 말)} */
    answer(o){G._answer=o;const hs=o.hints||[];
      G._acts=[[hs.length?`💡 힌트 <small>${hs.length}</small>`:'💡 힌트 없음','ghost',()=>{if(P.done||P.hint>=hs.length)return;P.usedHint=true;P.hint++;hs[P.hint-1]();const b=$('#hintBtn');if(b){const left=hs.length-P.hint;b.innerHTML=left?`💡 힌트 <small>${left}</small>`:'💡 힌트 끝';if(!left)b.disabled=true}},'hintBtn'],
        [o.label||'✔ 다 했어요','green',()=>G.submit(),'chk']];
      if(!P.guiding){G.actions(G._acts);if(!hs.length)$('#hintBtn').disabled=true}G.refresh()},
    refresh(){const b=$('#chk');if(!b||!G._answer)return;const r=G._answer.ready?G._answer.ready(vals):Object.keys(vals).length>0;b.disabled=!r||P.done;b.classList.toggle('pulse',!!r&&!P.done)},
    submit(){if(P.done||!G._answer)return;const r=G._answer.check(vals);
      if(r.ok)return G.success(r.line||'맞았어!');
      P.wrong++;P.picks.push(r.note||Object.values(vals).map(K.pickText).join(', '));K.sfx.soft();
      const box=r.mark||G.board;box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');
      K.say((r.why?r.why+' ':'')+ENC[(P.wrong-1)%ENC.length])},
    result(){if(P.practice)return 'practice';if(P.wrong===0)return P.usedHint?'hint':'solo';return P.usedHint?'hintretry':'retry'},
    stars(){const r=G.result();return r==='solo'||r==='practice'?3:(r==='hint'||(r==='retry'&&P.wrong===1))?2:1},
    success(line){if(P.done)return;P.done=true;K.logProb&&K.logProb(P,true,line,G.result());G.hl(null);K.sfx.good();K.confetti(50);const st=G.stars();K.ctx.score.push(st);K.onSolved&&K.onSolved(st);K.later(()=>K.say(line),250);G.trayOff(true);
      const last=K.ctx.pi>=K.ctx.probs.length-1;
      const next=()=>G.actions([[last?'결과 보기 🎉':'다음 문제 ▶','green pulse',()=>{if(last)K.go('result');else K.go('play',{pi:K.ctx.pi+1})}]]);
      /* 영어·위인 이름 등은 맞힌 뒤 꼭 소리 내어 따라 말하기 */
      if(p.speak&&K.speakPanel)K.later(()=>K.speakPanel(p.speak,G,next),900);else next()},
    /* 채점할 수 없는 답(손글씨 스스로 비교)은 '확인 기다림'으로 남기고 별·콩알을 주지 않아요. 부모님이 리포트에서 확인하면 받아요 */
    pending(line){if(P.done)return;P.done=true;P.pending=true;K.logProb&&K.logProb(P,false,line,'pending');G.hl(null);K.ctx.pend=(K.ctx.pend||0)+1;K.later(()=>K.say(line),150);G.trayOff(true);
      const last=K.ctx.pi>=K.ctx.probs.length-1;G.actions([[last?'결과 보기':'다음 문제 ▶','green pulse',()=>{if(last)K.go('result');else K.go('play',{pi:K.ctx.pi+1})}]])},
    /* 처음 보는 문제는 한 걸음씩 같이 해 보기 (연습으로 기록) */
    guide(steps){let i=0;G.trayOff(true);P.guiding=true;const acts=$('#acts');
      const step=()=>{const st=steps[i];K.say(typeof st.say==='function'?st.say():st.say);st.act&&st.act();
        if(i===steps.length-1){P.guiding=false;G.trayOff(false);G.actions(G._acts||[]);G.refresh();return}
        acts.innerHTML='';
        if(st.wait)st.wait(()=>{i++;K.later(step,400)});
        else{const b=document.createElement('button');b.className='btn blue pulse';b.textContent='알겠어! 다음 ▶';b.onclick=()=>{K.ac();K.sfx.pick();i++;step()};acts.appendChild(b)}};
      step()}
  };
  K.onDrop=(pl,d,t)=>{if(P.done)return;if(t&&t.dataset.slot!=null){if(G._accept&&!G._accept(pl,d))return;G.setSlot(d,pl);return}G._drop&&G._drop(pl,d,t)};
  G.board.addEventListener('click',e=>{const t=e.target.closest('[data-slot].filled');if(!t||P.done||document.querySelector('.stk.sel'))return;G.setSlot(t.dataset.slot,null)});
  return G;
}
K.views.result=a=>{const sc=K.ctx.score,l=K.ctx.level,ar=l.area;const pend=K.ctx.pend||0;const avg=sc.length?Math.max(1,Math.round(sc.reduce((x,y)=>x+y,0)/sc.length)):0;
  if(avg)K.S.stars[starKey(l)]=Math.max(K.levelStars(l),avg);K.save();
  const nx=ar.levels[l.idx+1];
  a.innerHTML=`<div class="screen result">${K.topbar(ar.name)}<div style="flex:1"></div><div class="buddy lg">${K.buddySvg(K.curHat())}</div>
   <div class="big-stars">${[1,2,3].map(i=>`<span class="pop ${i>avg?'off':''}" style="animation-delay:${i*.25}s">⭐</span>`).join('')}</div>
   <div class="bubble" id="say" style="flex:none;width:100%"></div>
   ${nx?`<button class="btn big green" id="nx">다음: ${nx.name} ▶</button>`:''}
   <button class="btn ghost big" id="again">다시 하기</button><button class="btn ghost big" id="mp">다른 놀이 고르기</button><div style="flex:1"></div></div>`;
  if(avg){K.confetti(80);K.sfx.good()}
  if(pend)K.say(`${l.name} 끝까지 썼어! ${avg?'':''}부모님이 글씨를 확인하면 ${avg?'남은 ':''}별과 콩알을 받을 수 있어.`);else K.say(avg===3?`${l.name} 완벽해! 혼자서 생각하는 힘이 쑥쑥 자랐어!`:avg===2?`${l.name} 끝! 힌트를 잘 써서 해냈어. 대단해!`:`${l.name} 끝까지 해냈어! 다시 하면 더 쉬워질 거야.`);
  nx&&($('#nx').onclick=()=>nx.free?K.go('free',{level:nx}):K.play(nx));
  $('#again').onclick=()=>K.play(l);$('#mp').onclick=()=>K.go('subject');
};
/* 부모님 가이드: 공통 원칙 + 각 영역 팁 모음 */
K.views.guide=a=>{
  const areas=K.subjects.flatMap(s=>s.areas.filter(x=>x.tip).map(x=>({s,x})));
  a.innerHTML=`<div class="screen">${K.topbar('부모님 가이드')}
  <div class="sheet"><h2>아이에게 문제를 이해시키는 4단계</h2>
   <p>창의사고력 문제가 어려운 이유는 대부분 <b>머릿속에서 그림을 바꿔야 하기</b> 때문이에요. 그래서 ${K.BRAND}의 모든 놀이는 같은 순서로 설명해요.</p>
   <div class="principle"><div><b>👀</b>① 보여 주기<br>움직이는 그림</div><div><b>✋</b>② 만져 보기<br>직접 끌고 눌러요</div><div><b>💬</b>③ 말로 하기<br>질문 하나씩</div><div><b>🔍</b>④ 확인하기<br>틀려도 다시</div></div>
   <p>아이는 답을 자유롭게 놓고 고치다가 <b>다 했어요</b>를 눌러야 채점돼요. 그래서 손이 미끄러진 실수와 진짜 틀린 답이 구분돼요. 힌트는 답이 아니라 <b>생각하는 방법</b>만 알려 주고, 힌트를 쓰면 별이 줄고 리포트에도 따로 표시돼요. 부모님도 답을 말해 주기보다 아래 '말하기 대본'의 질문 하나만 반복해 주세요.</p>
   <p>각 놀이 화면 위의 👪 버튼을 누르면 그 놀이에 맞는 대본이 바로 나와요.</p></div>
  ${areas.map(({s,x})=>`<div class="sheet"><h2>${x.emoji} ${x.name}: ${x.tip.t}</h2>${x.tip.b}</div>`).join('')}</div>`;
};

/* ---------- 시작 ---------- */
/* 화면 색: auto = 폰이 다크 모드이거나 저녁(시작 시각~아침 7시)이면 밤 화면, light/dark = 항상 */
K.isNight=()=>{const m=K.S.theme||'auto';if(m==='light')return false;if(m==='dark')return true;
  const h=new Date().getHours(),from=K.S.nightFrom==null?19:K.S.nightFrom;const night=from>0&&(h>=from||h<7);
  const phone=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;return phone||night};
K.applyTheme=()=>{const d=K.isNight();const r=document.documentElement;if((r.dataset.theme==='dark')===d&&r.dataset.theme)return;r.dataset.theme=d?'dark':'light';
  const m=document.querySelector('meta[name="color-scheme"]');if(m)m.content=d?'only dark':'only light';const tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.content=d?'#1C1A2B':'#FFF6E5'};
K.applyTheme();try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',K.applyTheme)}catch(e){}
setInterval(K.applyTheme,60000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')K.applyTheme()});
K.start=()=>{if('speechSynthesis' in window){try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices()}catch(e){}}K.view=K.startView?K.startView():'village';K.render()};
