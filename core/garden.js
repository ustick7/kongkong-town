/* 콩이 정원: 화분 키우기 → 수확 → 콩 도감, 콩이 꾸미기 가게, 오늘의 공부 목표
   콩알은 확인된 공부(맞힌 문제)로만 들어와요. 여기서는 쓰기만 해요. */
'use strict';
(()=>{
const S=K.S,$=K.$;
S.plant=Object.assign({water:0},S.plant||{});
const G0={kind:0,done:[],own:[],acc:'',pot:'',deco:[],goal:{day:'',got:false},pets:0};
S.garden=Object.assign({},G0,S.garden||{});
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

K.css(`
.gdot{position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:50%;background:var(--red);box-shadow:0 0 0 2px var(--paper);animation:gpulse 1.2s infinite}@keyframes gpulse{50%{transform:scale(1.3)}}
.gtabs{display:flex;gap:6px;justify-content:center}
.gtabs button{appearance:none;border:0;font-family:var(--f-disp);font-size:17px;padding:8px 14px;border-radius:999px;background:var(--s-white);color:var(--ink);box-shadow:inset 0 0 0 2px var(--line);cursor:pointer}
.gtabs button.on{background:var(--green);color:#fff;box-shadow:none}
.goal{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border-radius:18px;background:var(--s-yellow);font-size:15px}
.goal .bar{height:14px;border-radius:999px;background:var(--s-track);overflow:hidden}.goal .bar i{display:block;height:100%;background:linear-gradient(90deg,#FFC845,#FF8A3D);border-radius:999px;transition:width .6s}
.shop{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}
.item{appearance:none;border:0;cursor:pointer;border-radius:18px;padding:8px 6px;background:var(--s-white);box-shadow:inset 0 0 0 2px var(--line);font-family:inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:2px}
.item svg{width:72px;height:72px}.item b{font-family:var(--f-disp);font-weight:400;font-size:16px}.item small{font-size:13px;color:var(--muted)}
.item.on{box-shadow:inset 0 0 0 3px var(--green)}.item.lock{opacity:.55}
.dex{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.dex .card{border-radius:16px;padding:4px;background:var(--s-white);box-shadow:inset 0 0 0 2px var(--line);text-align:center;font-size:13px}
.dex .card svg{width:100%;height:auto}.dex .card.lock svg{filter:brightness(0);opacity:.18}.dex .card.cur{box-shadow:inset 0 0 0 3px var(--orange)}
.pot-wrap{position:relative}.pot-wrap .bfly{position:absolute;font-size:26px;animation:bfly 6s ease-in-out infinite}
@keyframes bfly{0%{transform:translate(0,0)}25%{transform:translate(40px,-30px) rotate(10deg)}50%{transform:translate(90px,10px)}75%{transform:translate(30px,40px) rotate(-10deg)}100%{transform:translate(0,0)}}
.pot .kong{cursor:pointer}.pot .kong.hop{animation:hop .6s}
@keyframes hop{30%{transform:translateY(-22px)}60%{transform:translateY(0)}80%{transform:translateY(-6px)}}
.heart-pop{position:absolute;font-size:28px;animation:hp 1s ease-out forwards;pointer-events:none}
@keyframes hp{from{transform:translateY(0) scale(.6);opacity:1}to{transform:translateY(-70px) scale(1.3);opacity:0}}
.harvest{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.harvest svg{width:180px;height:auto}
`);

/* 콩 종류 (수확하면 다음 씨앗이 열려요) */
const KINDS=[
 {n:'분홍꽃콩',p:['#FF9DB5'],c:'#FFC845',pod:'#7CC95E',sh:'oval',t:'처음 키운 콩! 분홍 꽃이 피어요.'},
 {n:'해님콩',p:['#FFD23F'],c:'#8B5A2B',pod:'#9BCB3C',sh:'long',t:'해를 닮아 노랗게 빛나요.'},
 {n:'하늘콩',p:['#7EC8F5'],c:'#FFF4B0',pod:'#5DB7A0',sh:'round',t:'맑은 하늘색 꽃잎이 동글동글.'},
 {n:'보라콩',p:['#B48CF0'],c:'#FFE27A',pod:'#8E6CC9',sh:'oval',t:'보라색 꼬투리가 열리는 신기한 콩.'},
 {n:'하트콩',p:['#FF6F91'],c:'#FFD6E0',pod:'#7CC95E',sh:'heart',t:'꽃잎이 모두 하트 모양이에요.'},
 {n:'별빛콩',p:['#FFE066'],c:'#FFF8D6',pod:'#4F7CD8',sh:'star',t:'밤에도 반짝이는 별 꽃.'},
 {n:'무지개콩',p:['#FF6B6B','#FFB347','#FFE066','#6CD47A','#6AB7FF','#B48CF0'],c:'#fff',pod:'#7CC95E',sh:'oval',t:'꽃잎마다 색이 달라요!'},
 {n:'황금콩',p:['#F5C518'],c:'#FFF1A8',pod:'#E0A800',sh:'star',t:'전설의 황금 콩! 다 모은 친구만 볼 수 있어요.'},
];
const STAGES=[[0,'씨앗'],[1,'새싹'],[3,'떡잎'],[6,'줄기'],[10,'꽃봉오리'],[15,'꽃'],[21,'콩꼬투리']];
const stageOf=w=>STAGES.filter(s=>w>=s[0]).length-1;
const COST=3,GOAL=10,BONUS=5;

/* 꾸미기 물건: kind acc(콩이 몸)·pot(화분)·deco(정원). need: 수확 몇 번 해야 열리는지 */
const ITEMS=[
 {id:'flower',k:'acc',n:'꽃 핀',c:8},{id:'ribbon',k:'acc',n:'리본',c:12},{id:'bowtie',k:'acc',n:'나비넥타이',c:15},{id:'glasses',k:'acc',n:'선글라스',c:20},
 {id:'scarf',k:'acc',n:'목도리',c:25},{id:'cape',k:'acc',n:'망토',c:35,need:1},{id:'crown',k:'acc',n:'왕관',c:60,need:3},
 {id:'sky',k:'pot',n:'하늘 화분',c:15},{id:'sun',k:'pot',n:'노랑 화분',c:15},{id:'dot',k:'pot',n:'물방울 화분',c:25,need:1},{id:'rainbow',k:'pot',n:'무지개 화분',c:45,need:2},
 {id:'bfly',k:'deco',n:'나비 친구',c:20},{id:'bird',k:'deco',n:'새 친구',c:30,need:1},{id:'bee',k:'deco',n:'꿀벌 친구',c:30,need:2},
];
const ACC={
 flower:{f:`<g transform="translate(30 26)"><circle r="5" cx="0" cy="-7" fill="#FF9DB5"/><circle r="5" cx="7" cy="-2" fill="#FF9DB5"/><circle r="5" cx="4" cy="6" fill="#FF9DB5"/><circle r="5" cx="-4" cy="6" fill="#FF9DB5"/><circle r="5" cx="-7" cy="-2" fill="#FF9DB5"/><circle r="4" fill="#FFC845"/></g>`},
 ribbon:{f:`<g transform="translate(88 28) rotate(20)"><path d="M0 0 L-14 -9 L-14 9Z M0 0 L14 -9 L14 9Z" fill="#FF6F91"/><circle r="4.5" fill="#E0507A"/></g>`},
 bowtie:{f:`<g transform="translate(60 98)"><path d="M0 0 L-12 -7 L-12 7Z M0 0 L12 -7 L12 7Z" fill="#4A9FE8"/><circle r="3.5" fill="#2F7AC4"/></g>`},
 glasses:{f:`<path d="M34 52 h52" stroke="#222" stroke-width="2.5"/><rect x="34" y="45" width="22" height="14" rx="6" fill="#222"/><rect x="64" y="45" width="22" height="14" rx="6" fill="#222"/><path d="M38 48 l6 0" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M68 48 l6 0" stroke="#fff" stroke-width="2" opacity=".7"/>`},
 scarf:{f:`<path d="M27 86 Q60 100 93 86 L95 95 Q60 110 25 95Z" fill="#F2665E"/><path d="M78 96 l6 18 l8 -3 l-5 -17Z" fill="#E0504A"/><path d="M30 90 Q60 103 90 90" stroke="#fff" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".7"/>`},
 cape:{b:`<path d="M36 40 Q60 30 84 40 L104 112 Q60 122 16 112Z" fill="#E0504A"/>`,f:`<circle cx="60" cy="100" r="4" fill="#FFC845"/>`},
 crown:{f:`<g transform="translate(72 4) rotate(14)"><path d="M0 14 L2 0 L9 8 L14 -3 L19 8 L26 0 L28 14Z" fill="#FFC845" stroke="#E0A800" stroke-width="1.5"/><circle cx="14" cy="9" r="2.5" fill="#F2665E"/></g>`},
};
const modal=html=>{const m=document.createElement('div');m.className='modal-bg';m.innerHTML=`<div class="sheet" role="dialog">${html}</div>`;
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))m.remove()});document.body.appendChild(m);return m};
K.wearSvg=layer=>{const a=ACC[(K.S.garden||{}).acc];return a?(a[layer]||''):''};
const POTS={'':['#E07A4F','#F08F62'],sky:['#5AA9E6','#7EC0F0'],sun:['#F2B53A','#FFD066'],dot:['#4FAE9B','#6CC7B4'],rainbow:['#B48CF0','#FF9DB5']};

function bloom(k,top,size=1){const kd=KINDS[k];const r=n=>kd.p[n%kd.p.length];const cy=top-10;let h='';
  for(let i=0;i<6;i++){const a=i*60;const col=r(i);
    if(kd.sh==='heart')h+=`<path transform="rotate(${a} 130 ${cy}) translate(130 ${cy-20}) scale(${.9*size})" d="M0 8 C-10 0 -10 -10 -4 -12 C-1 -13 0 -10 0 -8 C0 -10 1 -13 4 -12 C10 -10 10 0 0 8Z" fill="${col}"/>`;
    else if(kd.sh==='star')h+=`<path transform="rotate(${a} 130 ${cy})" d="M130 ${cy-4} L125 ${cy-16} L130 ${cy-30} L135 ${cy-16}Z" fill="${col}"/>`;
    else h+=`<ellipse cx="130" cy="${cy-(kd.sh==='round'?16:18)}" rx="${kd.sh==='round'?11:kd.sh==='long'?7:9}" ry="${kd.sh==='round'?11:kd.sh==='long'?19:16}" fill="${col}" transform="rotate(${a} 130 ${cy})"/>`}
  return h+`<circle cx="130" cy="${cy}" r="9" fill="${kd.c}"/>`}
function plantSvg(st,k){const kd=KINDS[k];const stem=[0,30,55,85,110,120,125][st];const top=230-stem;
  const leaf=(y,s,f)=>`<path d="M130 ${y} q${s*28} -18 ${s*44} 0 q${-s*16} 14 ${-s*44} 0Z" fill="${f||'#7CC95E'}"/>`;
  if(st===0)return `<ellipse cx="130" cy="222" rx="12" ry="9" fill="#C9A26B"/><path d="M124 220 q6 -6 12 0" stroke="#A47E4C" stroke-width="2" fill="none"/>`;
  let h=`<path d="M130 230 C128 ${230-stem/2} 134 ${top+20} 130 ${top}" stroke="#5AA845" stroke-width="7" fill="none" stroke-linecap="round"/>`+leaf(top+6,1)+leaf(top+6,-1,'#8FD873');
  if(st>=3)h+=leaf(top+40,1,'#6DBB52')+leaf(top+52,-1,'#7CC95E');if(st>=4)h+=leaf(top+75,1,'#8FD873');
  if(st===4)h+=`<ellipse cx="130" cy="${top-10}" rx="10" ry="14" fill="${kd.p[0]}"/><path d="M122 ${top-2} q8 6 16 0" stroke="#5AA845" stroke-width="4" fill="none"/>`;
  if(st>=5)h+=bloom(k,top);
  if(st>=6)h+=`<path d="M150 ${top+60} q24 6 30 34 q-20 -4 -30 -34Z" fill="${kd.pod}"/><circle cx="160" cy="${top+72}" r="4" fill="#fff" opacity=".6"/><circle cx="167" cy="${top+82}" r="4" fill="#fff" opacity=".6"/><circle cx="173" cy="${top+91}" r="3.5" fill="#fff" opacity=".6"/>
    <path d="M110 ${top+70} q-24 6 -30 34 q20 -4 30 -34Z" fill="${kd.pod}"/><circle cx="100" cy="${top+82}" r="4" fill="#fff" opacity=".6"/><circle cx="93" cy="${top+92}" r="3.5" fill="#fff" opacity=".6"/>`;
  return h}
function potSvg(st,k,pot){const [a,b]=POTS[pot]||POTS[''];const pat=pot==='dot'?[[92,262],[120,282],[150,262],[165,290],[105,298]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#fff" opacity=".5"/>`).join(''):pot==='rainbow'?['#FF6B6B','#FFB347','#FFE066','#6CD47A','#6AB7FF'].map((c,i)=>`<rect x="${74+i*0}" y="${246+i*12}" width="112" height="6" fill="${c}" opacity=".85"/>`).join(''):'';
  return `<svg class="pot" viewBox="0 0 260 330" aria-label="콩이 화분: ${KINDS[k].n} ${STAGES[st][1]}"><defs><clipPath id="potc"><path d="M70 228 h120 l-14 88 h-92Z"/></clipPath></defs><g class="sway">${plantSvg(st,k)}</g>
   <path d="M70 228 h120 l-14 88 h-92Z" fill="${a}"/><g clip-path="url(#potc)">${pat}</g><rect x="62" y="218" width="136" height="22" rx="8" fill="${b}"/><ellipse cx="130" cy="229" rx="58" ry="6" fill="#7A5236"/>
   <g class="kong" style="transform-origin:130px 300px;transform-box:view-box"><g transform="translate(96 252) scale(.55)">${K.buddySvg('sprout').replace(/<svg[^>]*>|<\/svg>/g,'')}</g></g></svg>`}

/* 오늘 확인된 공부: 맞힌 문제만 (연습·확인 기다림 제외) */
const todayCount=()=>{const d=new Date();d.setHours(0,0,0,0);const t0=d.getTime();return (S.log||[]).filter(r=>r.t>=t0&&r.ok&&r.res!=='pending'&&r.res!=='practice').length};
K.gardenAlert=()=>{const g=S.garden;return (stageOf(S.plant.water)===6)||(g.goal.day!==today()&&todayCount()>=GOAL)||(g.goal.day===today()&&!g.goal.got&&todayCount()>=GOAL)};

let tab='pot';
const TALK=['간지러워! 히히','같이 문제 풀자!','물 주면 쑥쑥 클 거야!','오늘도 고마워!','콩콩! 나 점프 잘하지?','네가 공부하면 나도 힘이 나!'];
K.views.garden=a=>{const g=S.garden;if(g.goal.day!==today())g.goal={day:today(),got:false};
  const st=stageOf(S.plant.water),k=g.kind%KINDS.length,kd=KINDS[k],n=todayCount();
  const next=STAGES[st+1];const owned=id=>g.own.includes(id);
  const goalHtml=`<div class="goal"><div>⭐ <b>오늘의 공부</b> 문제 ${GOAL}개 맞히기 · <b>${Math.min(n,GOAL)}/${GOAL}</b></div><div class="bar"><i style="width:${Math.min(100,n/GOAL*100)}%"></i></div>
    ${g.goal.got?'<div>✅ 오늘 보너스 받았어요! 내일 또 만나!</div>':n>=GOAL?`<button class="btn green pulse" id="bonus">🎁 보너스 콩알 ${BONUS}개 받기</button>`:`<div class="muted">${GOAL-n}개 더 맞히면 보너스 콩알 ${BONUS}개!</div>`}</div>`;
  let body='';
  if(tab==='pot')body=`${goalHtml}<div class="board" style="position:relative"><div class="muted" style="text-align:center;font-size:14px">${k+1}번째 콩 · <b>${kd.n}</b></div>
     <div class="pot-wrap" id="pw">${potSvg(st,k,g.pot)}${g.deco.map((d,i)=>`<span class="bfly" style="left:${10+i*25}%;top:${12+i*14}%;animation-delay:${-i*2}s">${{bfly:'🦋',bird:'🐦',bee:'🐝'}[d]}</span>`).join('')}</div>
     <div class="stage-bar">${STAGES.map((s,i)=>`<span class="${i<=st?'on':''}">${s[1]}</span>`).join('')}</div></div>
     ${st===6?`<button class="btn big green pulse" id="hv">🧺 콩 수확하기</button>`:`<button class="btn big blue" id="wt">💧 물 주기 (콩알 ${COST}개)</button>`}
     <div class="muted" style="text-align:center;font-size:14px">콩이를 콕 눌러 봐!</div>`;
  else if(tab==='shop')body=`<p style="margin:0;text-align:center">콩알로 콩이를 꾸며요. 산 건 언제든 바꿔 입을 수 있어요.</p>${['acc','pot','deco'].map(kk=>`<h3 style="margin:6px 0 0">${{acc:'🎀 콩이 꾸미기',pot:'🪴 화분',deco:'🦋 정원 친구'}[kk]}</h3>
     <div class="shop">${kk==='acc'?`<button class="item ${!g.acc?'on':''}" data-wear="acc"><span style="font-size:40px;line-height:72px">🌱</span><b>그대로</b><small>&nbsp;</small></button>`:kk==='pot'?`<button class="item ${!g.pot?'on':''}" data-wear="pot"><svg viewBox="40 200 180 130">${potSvg(0,0,'').replace(/<svg[^>]*>|<\/svg>/g,'')}</svg><b>기본 화분</b><small>&nbsp;</small></button>`:''}
     ${ITEMS.filter(it=>it.k===kk).map(it=>{const lock=(it.need||0)>g.done.length;const on=kk==='deco'?g.deco.includes(it.id):g[kk]===it.id;
       return `<button class="item ${on?'on':''} ${lock?'lock':''}" data-it="${it.id}">${kk==='acc'?accPic(it.id):kk==='pot'?`<svg viewBox="40 200 180 130">${potSvg(0,0,it.id).replace(/<svg[^>]*>|<\/svg>/g,'')}</svg>`:`<span style="font-size:44px;line-height:72px">${{bfly:'🦋',bird:'🐦',bee:'🐝'}[it.id]}</span>`}
         <b>${it.n}</b><small>${lock?`🔒 콩 ${it.need}번 수확`:owned(it.id)?(on?'입는 중 ✔':'가지고 있어요'):`🫘 ${it.c}`}</small></button>`}).join('')}</div>`).join('')}`;
  else body=`<p style="margin:0;text-align:center">콩을 수확하면 도감에 모여요. <b>${g.done.length}/${KINDS.length}</b></p><div class="dex">${KINDS.map((x,i)=>{const got=g.done.includes(i);
     return `<div class="card ${got?'':'lock'} ${i===k&&!got?'cur':''}"><svg viewBox="60 30 140 140">${bloom(i,120)}</svg><div>${got?`<b>${x.n}</b>`:i===k?'키우는 중':'?'}</div></div>`}).join('')}</div>
     ${g.done.length?`<div class="board" style="font-size:15px">${g.done.map(i=>`<div>🌼 <b>${KINDS[i].n}</b> · ${KINDS[i].t}</div>`).join('')}</div>`:''}`;
  a.innerHTML=`<div class="screen">${K.topbar('콩이 정원')}<div class="hud" style="justify-content:center"><span class="beans">🫘 콩알 <b id="bn">${S.beans}</b>개</span><span class="beans">🌼 수확 ${g.done.length}번</span></div>
   ${K.buddyRow()}<div class="gtabs">${[['pot','🪴 화분'],['shop','🎀 꾸미기'],['dex','📖 도감']].map(([t,l])=>`<button data-tab="${t}" class="${tab===t?'on':''}">${l}</button>`).join('')}</div>
   ${body}<button class="btn ghost" id="pl">공부하러 가기 ▶</button></div>`;
  a.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;K.sfx.pick();K.render()});
  $('#pl').onclick=()=>K.go('village');
  if(tab==='pot'){
    K.say(st===6?`우와! ${kd.n} 꼬투리가 열렸어! 수확해 보자!`:`지금은 <b>${STAGES[st][1]}</b>야. 물을 ${next[0]-S.plant.water}번 더 주면 <b>${next[1]}</b>${K.josa(next[1],'로')} 자라!${S.beans<COST?' 문제를 맞히면 콩알을 받아.':''}`);
    const kong=a.querySelector('.pot .kong');kong.onclick=e=>{kong.classList.remove('hop');void kong.getBoundingClientRect();kong.classList.add('hop');K.sfx.pick();g.pets++;
      const h=document.createElement('span');h.className='heart-pop';h.textContent=n>=GOAL?'💖':'💚';const r=$('#pw').getBoundingClientRect();h.style.left=(e.clientX-r.left-14)+'px';h.style.top=(e.clientY-r.top-30)+'px';$('#pw').appendChild(h);setTimeout(()=>h.remove(),1000);
      K.say(n>=GOAL?'오늘 공부 많이 해서 콩이가 엄청 신나!':n>0?`벌써 ${n}개나 맞혔네! ${K.pick(TALK)}`:K.pick(TALK))};
    const wt=$('#wt');if(wt)wt.onclick=()=>{if(S.beans<COST){K.sfx.soft();K.say(`콩알이 ${COST-S.beans}개 모자라! 문제를 맞히면 콩알을 받을 수 있어.`);return}
      S.beans-=COST;S.plant.water++;K.save();const d=document.createElement('span');d.className='drop-water';d.textContent='💧';d.style.left='48%';d.style.top='30%';a.querySelector('.board').appendChild(d);K.sfx.poof();
      setTimeout(()=>{const ns=stageOf(S.plant.water);if(ns>st){K.confetti(70);K.sfx.good()}K.render();if(ns>st)K.later(()=>K.say(`쑥쑥! <b>${STAGES[ns][1]}</b>${K.josa(STAGES[ns][1],'로')} 자랐어! 고마워!`),300)},900)};
    const hv=$('#hv');if(hv)hv.onclick=()=>{if(!g.done.includes(k))g.done.push(k);g.kind=(k+1)%KINDS.length;S.plant.water=0;K.save();K.confetti(120);K.sfx.good();
      const nk=KINDS[g.kind];const unlock=ITEMS.filter(it=>(it.need||0)===g.done.length);
      modal(`<div class="harvest"><h2 style="margin:0">🧺 ${kd.n} 수확!</h2><svg viewBox="60 30 140 140">${bloom(k,120)}</svg><div>도감에 <b>${kd.n}</b>${K.josa(kd.n,'이')} 들어갔어!</div>
        <div>다음 씨앗은 <b>${g.done.length>=KINDS.length&&g.kind===0?'다시 '+nk.n:nk.n}</b>이야. 또 키워 보자!</div>${unlock.length?`<div>🎁 새로 열린 꾸미기: <b>${unlock.map(x=>x.n).join(', ')}</b></div>`:''}<button class="btn green" data-close>좋아!</button></div>`);
      K.render();K.later(()=>K.say(`${kd.n} 수확 성공! 새 씨앗 <b>${nk.n}</b>${K.josa(nk.n,'을')} 심었어!`),300)};
    const bo=$('#bonus');if(bo)bo.onclick=()=>{if(g.goal.got)return;g.goal.got=true;S.beans+=BONUS;K.save();K.confetti(80);K.sfx.good();K.toast(`🎁 보너스 콩알 ${BONUS}개!`);K.render();K.later(()=>K.say('오늘의 공부 완료! 정말 멋져!'),300)};
  }
  if(tab==='shop'){K.say('콩알로 콩이를 꾸며 볼까? 눌러서 사고, 산 건 눌러서 입어!');
    a.querySelectorAll('[data-wear]').forEach(b=>b.onclick=()=>{g[b.dataset.wear]='';K.save();K.sfx.pick();K.render()});
    a.querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>{const it=ITEMS.find(x=>x.id===b.dataset.it);
      if((it.need||0)>g.done.length){K.sfx.soft();K.say(`이건 콩을 ${it.need}번 수확하면 열려! 지금 ${g.done.length}번.`);return}
      const wear=()=>{if(it.k==='deco'){g.deco=g.deco.includes(it.id)?g.deco.filter(x=>x!==it.id):g.deco.concat(it.id)}else g[it.k]=g[it.k]===it.id?'':it.id;K.save();K.sfx.pick();K.render()};
      if(g.own.includes(it.id))return wear();
      if(S.beans<it.c){K.sfx.soft();K.say(`콩알이 ${it.c-S.beans}개 모자라! 문제를 맞혀서 모아 보자.`);return}
      modal(`<div class="harvest"><h3 style="margin:0">${it.n}${K.josa(it.n,'을')} 살까요?</h3><div>🫘 콩알 ${it.c}개를 써요. (지금 ${S.beans}개)</div><div class="row" style="gap:8px"><button class="btn green" id="buy">살래요</button><button class="btn ghost" data-close>안 살래요</button></div></div>`);
      $('#buy').onclick=()=>{S.beans-=it.c;g.own.push(it.id);document.querySelectorAll('.modal-bg').forEach(m=>m.remove());K.confetti(40);K.sfx.good();wear();K.later(()=>K.say(`짜잔! ${it.n}! 잘 어울려!`),300)}})}
  if(tab==='dex')K.say(g.done.length?`지금까지 ${g.done.length}가지 콩을 모았어! 다 모으면 뭐가 나올까?`:'콩을 수확하면 여기에 모여! 첫 수확을 해 보자!');
};
function accPic(id){const a=ACC[id];return `<svg viewBox="0 -14 120 134">${(a.b||'')}${K.buddySvg('').replace(/<svg[^>]*>|<\/svg>/g,'').replace(K.wearSvg('b'),'').replace(K.wearSvg('f'),'')}${a.f||''}</svg>`}
})();
