/* 생각콩 더하기 · 다른 하나, 똑같은 그림, 그림자 찾기, 그림 스도쿠, 순서대로 */
'use strict';
(()=>{
const {quiz}=K.TYPES;
const L='abcd';
const COLS=['#F2665E','#4A9FE8','#F5C518','#4CB963','#9B7BE0','#FF8A3D'];
const KIND=['circle','square','tri','star','heart'];
/* 도형 SVG */
function shp(kind,col,sz=1){const s=Math.round(44*sz),c=`fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width="2"`;let b;
  if(kind==='circle')b=`<circle cx="22" cy="22" r="17" ${c}/>`;else if(kind==='square')b=`<rect x="6" y="6" width="32" height="32" rx="4" ${c}/>`;
  else if(kind==='tri')b=`<path d="M22 4 L40 38 L4 38 Z" ${c} stroke-linejoin="round"/>`;
  else if(kind==='star')b=`<path d="M22 3l5.6 12 13 1.4-9.8 8.8 2.8 12.8L22 31.4 10.4 38l2.8-12.8L3.4 16.4l13-1.4z" ${c} stroke-linejoin="round"/>`;
  else b=`<path d="M22 38 C6 27 3 18 8 11 C13 5 20 7 22 13 C24 7 31 5 36 11 C41 18 38 27 22 38Z" ${c}/>`;
  return `<svg viewBox="0 0 44 44" width="${s}" height="${s}" style="display:block;margin:auto">${b}</svg>`}
const dots=(n,col)=>`<svg viewBox="0 0 44 44" width="44" height="44" style="display:block;margin:auto">${[[22,22],[12,12],[32,32],[32,12],[12,32],[12,22],[32,22]].slice(0,n).sort((a,b)=>a[1]-b[1]).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${col}"/>`).join('')}</svg>`;
const NAME={shape:'모양',color:'색깔',size:'크기',count:'개수'};

/* 다른 하나: 한 가지만 다른 것 (lv1), 다른 것도 섞여 있어 기준을 찾아야 하는 것 (lv2) */
function mkOdd(lv){const by=K.pick(lv===1?['shape','color','size','count']:['shape','color','count']);const odd=K.ri(0,3);
  const [k1,k2]=K.pickN(KIND,2),[c1,c2]=K.pickN(COLS,2);const items=[];
  for(let i=0;i<4;i++){const o=i===odd;let kind=k1,col=c1,sz=.85,n=3;
    if(lv===2){/* 기준이 아닌 것은 넷이 제각각 */ if(by!=='color')col=COLS[(COLS.indexOf(c1)+i)%COLS.length];if(by!=='shape'&&by!=='count')kind=KIND[(KIND.indexOf(k1)+i)%KIND.length]}
    if(by==='shape'&&o)kind=k2;if(by==='color'&&o)col=c2;if(by==='size'&&o)sz=K.pick([.5,1.15]);if(by==='count'&&o)n=K.pick([2,4]);
    items.push(m=>by==='count'?dots(n,col).replace(/width="44" height="44"/,`width="${44*m}" height="${44*m}"`):shp(kind,col,sz*m))}
  return {type:'quiz',skill:lv===1?'odd1':'odd2',prompt:'<b>하나만 다른</b> 것을 칸에 놓아요',show:`<div style="display:flex;gap:10px;justify-content:center">${items.map((h,i)=>`<div style="text-align:center">${h(1.35)}<b class="muted" style="font-size:15px">${'가나다라'[i]}</b></div>`).join('')}</div>`,
    frame:[0],ans:[L[odd]],opts:items.map((h,i)=>({v:L[i],html:h(1),label:'가나다라'[i]})),
    hints:[lv===1?'모양, 색깔, 크기, 개수를 하나씩 비교해 봐.':'색깔이 다 달라도 헷갈리지 마! 셋이 <b>똑같은 것</b>이 무엇인지 찾아.',`<b>${NAME[by]}</b>${K.josa(NAME[by],'을')} 잘 봐!`],
    line:`맞아! ${'가나다라'[odd]}만 ${NAME[by]}${K.josa(NAME[by],'이')} 달라!`,why:()=>`그건 나머지와 ${NAME[by]}${K.josa(NAME[by],'이')} 같아. 다시 비교해 봐!`}}

/* 똑같은 그림 찾기: 3×3 색 무늬 */
const PAL=['#F2665E','#4A9FE8','#F5C518','#FFFFFF'];
const tile=(g,cs=14)=>`<div style="display:grid;grid-template-columns:repeat(3,${cs}px);gap:2px;padding:3px;background:#5B4A42;border-radius:6px">${g.map(c=>`<i style="width:${cs}px;height:${cs}px;background:${PAL[c]};border-radius:2px;display:block"></i>`).join('')}</div>`;
function mkSame(diff){const g=Array.from({length:9},()=>K.ri(0,3));const variants=[];
  while(variants.length<3){const v=g.slice();K.pickN([0,1,2,3,4,5,6,7,8],diff).forEach(i=>{v[i]=(v[i]+K.ri(1,3))%4});const key=v.join('');if(!variants.some(x=>x.join('')===key))variants.push(v)}
  const ans=K.ri(0,3);const all=variants.slice();all.splice(ans,0,g);
  return {type:'quiz',skill:diff===2?'same1':'same2',prompt:'위 그림과 <b>똑같은</b> 것을 칸에 놓아요',show:tile(g,26),frame:[0],ans:[L[ans]],opts:all.map((v,i)=>({v:L[i],html:tile(v,12)})),
    hints:['맨 윗줄부터 한 칸씩 차례로 비교해 봐.','다른 칸이 하나라도 있으면 그건 아니야. 하나씩 지워 가 봐!'],line:'맞아! 눈이 정말 좋구나!',why:()=>'비슷하지만 다른 칸이 있어. 한 줄씩 비교해 봐!'}}

/* 그림자 찾기 */
const SH=['🐶','🐱','🐰','🐻','🦊','🐭','🐷','🐸','🦁','🐘','🦒','🐢','🐟','🐦','🦋','🐌','🦀','🐙','🦕','🐿️','🦔','🐧','🦉','🐳','✈️','🚗','🚲','🎸','☂️','🔑'];
const sil=e=>`<span style="display:inline-grid;place-items:center;width:52px;height:52px;border-radius:12px;background:#F4EEE6"><span style="font-size:38px;filter:brightness(0);opacity:.85">${e}</span></span>`;
function mkShadow(){const set=K.pickN(SH,4);const a=set[0];const opts=K.shuffle(set);
  return {type:'quiz',skill:'shadow',prompt:'이 그림의 <b>그림자</b>를 칸에 놓아요',show:`<span class="big">${a}</span>`,frame:[0],ans:[a],opts:opts.map(e=>({v:e,html:sil(e)})),
    hints:['귀, 꼬리, 다리처럼 <b>튀어나온 곳</b>을 봐.','그림자는 색은 없고 테두리 모양만 같아.'],line:'맞아! 모양이 딱 맞지?'}}

/* 그림 스도쿠: 줄마다, 칸마다 하나씩 */
const FR=['🍎','🍌','🍇','🍓'];
function latin(n){let g;if(n===3){g=[[0,1,2],[1,2,0],[2,0,1]]}else{g=[[0,1,2,3],[2,3,0,1],[1,0,3,2],[3,2,1,0]];
    if(Math.random()<.5)g=[g[1],g[0],g[2],g[3]];if(Math.random()<.5)g=[g[0],g[1],g[3],g[2]];if(Math.random()<.5)g=g.map(r=>[r[1],r[0],r[2],r[3]]);if(Math.random()<.5)g=g.map(r=>[r[0],r[1],r[3],r[2]])}
  if(n===3){g=K.shuffle(g)}const perm=K.shuffle([...Array(n).keys()]);return g.map(r=>r.map(x=>perm[x]))}
function mkSudoku(n,blanks){const g=latin(n);const cells=[];
  for(let t=0;t<50&&cells.length<blanks;t++){const r=K.ri(0,n-1),c=K.ri(0,n-1);if(cells.some(x=>x[0]===r&&x[1]===c||g[x[0]][x[1]]===g[r][c]))continue;cells.push([r,c])}
  const mark=['①','②'];const cs=n===3?56:48;
  const grid=`<div style="display:grid;grid-template-columns:repeat(${n},${cs}px);gap:3px;padding:6px;background:#8C6A55;border-radius:12px;margin:0 auto;width:max-content">${g.map((row,r)=>row.map((x,c)=>{const b=cells.findIndex(y=>y[0]===r&&y[1]===c);
    const thick=n===4?`${c===1?'margin-right:4px;':''}${r===1?'margin-bottom:4px;':''}`:'';
    return `<div style="${thick}width:${cs}px;height:${cs}px;border-radius:8px;display:grid;place-items:center;font-size:${cs*.6}px;background:${b>=0?'#FFF4C2':'#FFFBF3'};color:#3D2E28;font-weight:800">${b>=0?mark[b]:FR[x]}</div>`}).join('')).join('')}</div>`;
  const ans=cells.map(([r,c])=>FR[g[r][c]]);
  return {type:'quiz',skill:n===3?'sudo3':'sudo4',prompt:`가로줄, 세로줄${n===4?', 굵은 네모':''}에 과일이 <b>하나씩만</b> 있어요. ${blanks>1?'①, ②':'빈칸'}에 들어갈 과일은?`,show:grid,
    frame:blanks>1?['<span class="op">①</span>',0,'<span class="op">②</span>',1]:[0],ans,opts:FR.slice(0,n).map(e=>({v:e,html:`<span class="em">${e}</span>`})),
    hints:[`${blanks>1?'①':'빈칸'}이 있는 <b>가로줄</b>을 봐. 어떤 과일이 빠졌어?`,'가로줄로 모르겠으면 <b>세로줄</b>도 봐!'],line:'맞아! 줄마다 하나씩, 스도쿠 박사!'}}

/* 순서대로 */
const SEQ=[[['🥚','알'],['🐣','깨어나요'],['🐥','병아리'],['🐔','닭']],[['🌰','씨앗'],['🌱','싹'],['🌿','줄기'],['🌳','나무']],[['🌅','아침'],['☀️','낮'],['🌇','저녁'],['🌃','밤']],
 [['👶','아기'],['🧒','어린이'],['🧑','어른'],['🧓','할머니']],[['🧊','얼음'],['💧','물'],['♨️','김']],[['🌸','봄'],['🏖️','여름'],['🍂','가을'],['⛄','겨울']],
 [['🛒','장보기'],['🔪','썰기'],['🍳','요리'],['🍽️','먹기']],[['🎂','케이크'],['🕯️','초 켜기'],['🎉','후!'],['🍰','나눠 먹기']],
 [['🛌','일어나요'],['🪥','이 닦기'],['🎒','유치원 가요']],[['📦','택배 와요'],['✂️','열어요'],['🧸','놀아요']],[['🫘','콩 심기'],['💦','물 주기'],['🌱','싹 나요']]];
function mkSeq(len){const s=K.pick(SEQ.filter(x=>len===3?x.length===3||x.length===4:x.length===4)).slice(0,len);
  const opts=K.shuffle(s.map(x=>({v:x[1],html:`<span class="em">${x[0]}</span>`,label:x[1]})));
  const fr=[];s.forEach((_,i)=>{if(i)fr.push('<span class="op">→</span>');fr.push(i)});
  return {type:'quiz',skill:len===3?'seq3':'seq4',prompt:'<b>먼저 일어나는 것</b>부터 순서대로 놓아요',frame:fr,ans:s.map(x=>x[1]),opts,
    hints:['맨 처음은 무엇일까? 가장 먼저 일어나는 것을 찾아.',`처음은 <b>${s[0][1]}</b>! 그다음은?`],line:`맞아! ${s.map(x=>x[1]).join(' → ')}`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('think',{id:'odd',name:'다른 하나',desc:'하나만 다른 것 찾기',emoji:'🔍',color:'#FFE6E6',hello:'하나만 다른 게 숨어 있어! 찾아볼까?',types:{quiz},
  skills:{odd1:'한 가지만 다른 것',odd2:'기준 찾기'},
  tip:{t:'왜 달라?',b:`<p>고른 뒤 <b>"왜 이게 달라?"</b> 하고 물어보세요. "모양이 달라서"처럼 기준을 말로 하면 생각이 또렷해져요.</p>`},
  levels:[{id:'o1',name:'하나만 달라요',desc:'모양, 색깔, 크기, 개수',emoji:'🔴',age:6,gen:S(6,()=>mkOdd(1))},{id:'o2',name:'기준을 찾아요',desc:'색이 섞여도 찾을 수 있어?',emoji:'🧠',age:7,gen:S(6,()=>mkOdd(2))}]});
K.area('think',{id:'look',name:'눈 크게 뜨기',desc:'똑같은 그림, 그림자',emoji:'👀',color:'#E3F0FF',hello:'눈을 크게 뜨고 찾아 보자!',types:{quiz},
  skills:{same1:'똑같은 그림(쉬움)',same2:'똑같은 그림(어려움)',shadow:'그림자 찾기'},
  tip:{t:'차례로 비교하기',b:`<p>한 번에 전체를 보지 말고 <b>한 줄씩, 한 칸씩</b> 비교하는 습관을 길러 주세요.</p>`},
  levels:[{id:'w1',name:'그림자 찾기',desc:'모양만 보고 맞혀요',emoji:'🌑',age:6,gen:S(6,mkShadow)},{id:'w2',name:'똑같은 그림',desc:'두 칸이 달라요',emoji:'🟥',age:6,gen:S(5,()=>mkSame(2))},
   {id:'w3',name:'똑같은 그림 (어려움)',desc:'한 칸만 달라요',emoji:'🧩',age:7,gen:S(5,()=>mkSame(1))}]});
K.area('think',{id:'sudoku',name:'그림 스도쿠',desc:'줄마다 하나씩',emoji:'🍓',color:'#E3F6E0',hello:'줄마다 과일이 하나씩! 빈칸을 채워 볼까?',types:{quiz},
  skills:{sudo3:'3×3 스도쿠',sudo4:'4×4 스도쿠'},
  tip:{t:'빠진 것 찾기',b:`<p>"이 줄에 뭐가 있지? 뭐가 없지?" 하고 <b>있는 것부터</b> 손가락으로 짚게 해 주세요.</p>`},
  levels:[{id:'k1',name:'3×3',desc:'빈칸 하나',emoji:'🍎',age:6,gen:S(5,()=>mkSudoku(3,1))},{id:'k2',name:'4×4',desc:'빈칸 하나',emoji:'🍌',age:7,gen:S(5,()=>mkSudoku(4,1))},
   {id:'k3',name:'4×4 두 칸',desc:'빈칸 둘',emoji:'🍇',age:8,gen:S(5,()=>mkSudoku(4,2))}]});
K.area('think',{id:'seq',name:'순서대로',desc:'먼저, 그다음, 나중',emoji:'➡️',color:'#FFF1B8',hello:'무엇이 먼저 일어날까?',types:{quiz},
  skills:{seq3:'세 단계 순서',seq4:'네 단계 순서'},
  tip:{t:'먼저, 그다음, 마지막',b:`<p>다 놓은 뒤 <b>"먼저 ~하고, 그다음 ~하고"</b> 이야기로 말하게 해 보세요.</p>`},
  levels:[{id:'q1',name:'세 단계',desc:'알 → 병아리 → 닭',emoji:'🐣',age:6,gen:S(6,()=>mkSeq(3))},{id:'q2',name:'네 단계',desc:'봄 → 여름 → 가을 → 겨울',emoji:'🍂',age:7,gen:S(6,()=>mkSeq(4))}]});
})();
