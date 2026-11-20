/* 시콩 · 시계와 시간 (몇 시, 몇 시 30분, 바늘 맞추기, 몇 분, 몇 시간 뒤, 하루 순서) */
'use strict';
(()=>{
const {quiz}=K.TYPES;
K.css(`
.clock{display:block;margin:0 auto;width:min(220px,62vw);height:auto}
.clock .face{fill:var(--s-white);stroke:var(--ink);stroke-width:5}
.clock .tk{stroke:var(--muted);stroke-width:2}.clock .tk.b{stroke:var(--ink);stroke-width:3.5}
.clock text{font-family:var(--f-disp);font-size:19px;fill:var(--ink)}
.clock .hh{stroke:var(--orange);stroke-width:9;stroke-linecap:round;transition:transform .35s}
.clock .mh{stroke:var(--blue);stroke-width:6;stroke-linecap:round;transition:transform .35s}
.clock .hub{fill:var(--ink)}
.clock .mins text{font-size:11px;fill:var(--blue-d)}
.clock .mins{opacity:0;transition:opacity .4s}.clock.showmin .mins{opacity:1}
.clock .blink{animation:hb 1s ease-in-out 3}
@keyframes hb{50%{opacity:.25}}
.hand-ctl{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hand-ctl div{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px;border-radius:16px;padding:6px;font-size:15px}
.hand-ctl div span{width:100%;text-align:center;white-space:nowrap}
.hand-ctl .h{background:var(--s-orange)}.hand-ctl .m{background:var(--s-blue)}
.hand-ctl button{appearance:none;border:0;width:48px;height:48px;border-radius:14px;background:var(--paper);box-shadow:0 4px 0 var(--line);font-size:22px;cursor:pointer;color:var(--ink)}
.hand-ctl button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--line)}
.digi{text-align:center;font-family:var(--f-disp);font-size:30px;color:var(--green-d);min-height:36px}
.legend2{display:flex;gap:12px;justify-content:center;font-size:14px;color:var(--muted)}
.legend2 b{font-weight:400}
`);
const tstr=(h,m)=>m?`${h}시 ${m}분`:`${h}시`;
const tOpt=(h,m)=>({v:`${h}:${m}`,html:`<span class="ko" style="font-size:24px">${tstr(h,m)}</span>`,note:tstr(h,m)});
function clockSVG(h,m,id='clk'){const A=(deg,r)=>[100+r*Math.sin(deg*Math.PI/180),100-r*Math.cos(deg*Math.PI/180)];
  let s=`<svg class="clock" id="${id}" viewBox="0 0 200 200" role="img" aria-label="시계"><circle class="face" cx="100" cy="100" r="92"/>`;
  for(let i=0;i<60;i++){const b=i%5===0;const [x1,y1]=A(i*6,b?78:82),[x2,y2]=A(i*6,87);s+=`<line class="tk ${b?'b':''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`}
  for(let n=1;n<=12;n++){const [x,y]=A(n*30,64);s+=`<text x="${x}" y="${y+7}" text-anchor="middle">${n}</text>`}
  s+='<g class="mins">';for(let n=0;n<12;n++){const [x,y]=A(n*30,98);s+=`<text x="${x}" y="${y+4}" text-anchor="middle">${n*5}</text>`}s+='</g>';
  s+=`<line class="hh" id="${id}h" x1="100" y1="100" x2="100" y2="52" style="transform-origin:100px 100px;transform:rotate(${(h%12+m/60)*30}deg)"/>`;
  s+=`<line class="mh" id="${id}m" x1="100" y1="100" x2="100" y2="26" style="transform-origin:100px 100px;transform:rotate(${m*6}deg)"/><circle class="hub" cx="100" cy="100" r="7"/></svg>`;
  return s}
const legend='<div class="legend2"><span>🟠 <b>짧은 바늘</b>: 시</span><span>🔵 <b>긴 바늘</b>: 분</span></div>';
const blink=s=>{const e=K.$(s);if(e){e.classList.remove('blink');void e.getBBox();e.classList.add('blink')}};

/* 시계 읽기 */
function mkRead(kind){const h=K.ri(1,12);const m=kind==='oclock'?0:kind==='half'?30:K.ri(1,11)*5;
  const next=h%12+1,prev=(h+10)%12+1;let pool;
  if(kind==='oclock')pool=[[h,0],[next,0],[prev,0],[m/5||12,0]].filter((x,i,a)=>x[0]!==h||i===0);
  else if(kind==='half')pool=[[h,30],[next,30],[6,h%12*5||0],[h,0]];
  else pool=[[h,m],[next,m],[h,(m+5)%60],[m/5||12,h%12*5]];
  const seen=new Set();const opts=pool.filter(([a,b])=>{const k=a+':'+b;if(seen.has(k)||!(a>=1&&a<=12))return false;seen.add(k);return true}).slice(0,4);
  while(opts.length<3){const x=[K.ri(1,12),m];if(!opts.some(o=>o[0]===x[0]&&o[1]===x[1]))opts.push(x)}
  return {type:'quiz',skill:kind,prompt:kind==='oclock'?'시계는 몇 시를 가리킬까요?':'시계는 몇 시 몇 분을 가리킬까요?',show:clockSVG(h,m)+legend,frame:[0],ans:[`${h}:${m}`],opts:K.shuffle(opts).map(o=>tOpt(...o)),wide:true,
    hints:[()=>{blink('#clkh');G0().say(kind==='half'?'짧은 바늘이 두 숫자 <b>사이</b>에 있으면, 지나온 <b>작은 숫자</b>가 몇 시야!':'<b>짧은 바늘</b>(주황)이 가리키는 숫자가 몇 시야!')},
      ()=>{blink('#clkm');if(kind==='five')K.$('#clk').classList.add('showmin');G0().say(kind==='oclock'?'긴 바늘이 12에 있으면 딱 <b>정각</b>이야.':kind==='half'?'긴 바늘이 6에 있으면 <b>30분</b>이야.':'긴 바늘은 숫자 하나에 <b>5분</b>씩! 바깥에 작은 숫자를 보여 줄게.')}],
    line:`맞아! ${tstr(h,m)}!`,
    why:g=>{const [a,b]=String(g[0]).split(':').map(Number);if(b===h%12*5&&a===(m/5||12))return '짧은 바늘과 긴 바늘을 바꿔 읽었어! 짧은 바늘이 시야.';if(a===next&&b===m&&m)return '짧은 바늘이 아직 다음 숫자에 도착하지 않았어. 지나온 숫자를 읽어!';return ''}}}
let curG=null;const G0=()=>curG;

/* 바늘 맞추기 */
function setclock(p,G){curG=G;let h=12,m=0;const step=p.mstep||30;
  G.html(`<div class="qline"><span class="tag q">문제</span>시계를 <b>${tstr(p.h,p.m)}</b>로 맞춰요</div>${clockSVG(h,m,'sc')}
   <div class="hand-ctl"><div class="h"><span>🟠 짧은 바늘 (시)</span><button data-d="h-">↺</button><button data-d="h+">↻</button></div><div class="m"><span>🔵 긴 바늘 (분)</span><button data-d="m-">↺</button><button data-d="m+">↻</button></div></div>${legend}`);
  G.hideTray();
  const draw=()=>{K.$('#sch').style.transform=`rotate(${(h%12+m/60)*30}deg)`;K.$('#scm').style.transform=`rotate(${m*6}deg)`};
  G.board.querySelector('.hand-ctl').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b||G.P.done)return;const d=b.dataset.d;
    if(d==='h+')h=h%12+1;if(d==='h-')h=(h+10)%12+1;if(d==='m+')m=(m+step)%60;if(d==='m-')m=(m-step+60)%60;K.sfx.pick();draw();G.edit()});
  G.answer({ready:()=>true,hints:[()=>{blink('#sch');G.say(`짧은 바늘은 <b>${p.h}</b> 쪽을 가리켜야 해.${p.m?' 30분이면 '+p.h+'와 '+(p.h%12+1)+' 사이야!':''}`)},()=>{blink('#scm');if(step<30)K.$('#sc').classList.add('showmin');G.say(p.m?`긴 바늘은 숫자 하나에 5분이야. ${p.m}분이면 ${p.m/5}을 가리켜.`:'정각이면 긴 바늘은 <b>12</b>에 있어야 해.')}],
    check:()=>{if(h===p.h&&m===p.m)return {ok:true,line:`맞아! ${tstr(p.h,p.m)}를 잘 맞췄어!`};
      return {ok:false,note:tstr(h,m),why:h!==p.h&&m===p.m?'긴 바늘은 맞아! 짧은 바늘을 다시 봐.':h===p.h&&m!==p.m?'짧은 바늘은 맞아! 긴 바늘을 다시 봐.':m===p.h%12*5&&h===(p.m/5||12)?'두 바늘이 바뀌었어! 짧은 바늘이 시, 긴 바늘이 분이야.':''}}});
  draw();G.P.edits=0;G.say('↻ 버튼으로 바늘을 돌려서 맞춰 봐! 다 맞추면 <b>다 했어요</b>.');
}
function mkSet(kind){const h=K.ri(1,11);const m=kind==='set0'?0:kind==='set30'?K.pick([0,30]):K.ri(0,11)*5;return {type:'setclock',skill:kind,h,m,mstep:kind==='set5'?5:30}}

/* 몇 시간 뒤 */
function mkAfter(){const h=K.ri(1,11),d=K.ri(1,4),half=Math.random()<.4;const m=half?30:0;const t=(h+d-1)%12+1;
  const opts=[[t,m],[(t%12)+1,m],[(h-d+11)%12+1,m],[d,m]];const seen=new Set();const o=opts.filter(([a,b])=>{const k=a+':'+b;if(seen.has(k))return false;seen.add(k);return true});
  return {type:'quiz',skill:'after',prompt:`지금 <b>${tstr(h,m)}</b>예요. <b>${d}시간 뒤</b>는 몇 시일까요?`,show:clockSVG(h,m),frame:[0],ans:[`${t}:${m}`],opts:K.shuffle(o).map(x=>tOpt(...x)),wide:true,
    hints:[`짧은 바늘이 숫자 <b>${d}칸</b>을 앞으로(↻) 가면 ${d}시간이 지난 거야.`,`${h}에서 손가락으로 ${Array.from({length:d},(_,i)=>(h+i)%12+1).join(', ')}… 하고 세어 봐.`],line:`맞아! ${tstr(h,m)}에서 ${d}시간 뒤는 ${tstr(t,m)}!`,
    why:g=>String(g[0]).split(':')[0]==String((h-d+11)%12+1)?'거꾸로 셌어! 시간이 지나면 바늘은 ↻ 방향으로 가.':''}}
/* 하루 순서 */
const DAY=[['🌅','일어나요'],['🪥','양치해요'],['🥣','아침 먹어요'],['🏫','유치원 가요'],['🍱','점심 먹어요'],['🛝','놀이터에서 놀아요'],['🍲','저녁 먹어요'],['🛁','목욕해요'],['📖','책 읽어요'],['🌙','잠자요']];
function mkDay(){const idx=K.pickN(DAY.map((_,i)=>i),4).sort((a,b)=>a-b);const it=idx.map(i=>DAY[i]);
  return {type:'quiz',skill:'day',prompt:'하루에 하는 일을 <b>먼저 하는 것부터</b> 순서대로 놓아요',frame:[0,'→',1,'→',2,'→',3],ans:it.map(x=>x[1]),opts:K.shuffle(it).map(x=>({v:x[1],html:`<span class="em">${x[0]}</span>`,label:x[1],note:x[1]})),join:' → ',
    hints:['아침에 눈을 뜨고 나서 제일 먼저 하는 건 뭘까?','해가 지고 깜깜해지면 하는 일은 맨 뒤로!'],line:'맞아! 하루를 순서대로 잘 정리했어!'}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
const wrap=fn=>(p,G)=>{curG=G;fn(p,G)};
const qz=wrap(quiz);
K.area('clock',{id:'read',name:'시계 읽기',desc:'몇 시 몇 분일까?',emoji:'🕒',color:'#FFE6F0',hello:'째깍째깍! 시계를 읽어 볼까? 짧은 바늘이 시야!',types:{quiz:qz},
  skills:{oclock:'정각 읽기',half:'30분 읽기',five:'5분 단위 읽기'},
  tip:{t:'짧은 바늘이 먼저',b:`<p>시계 읽기는 <b>짧은 바늘(시) → 긴 바늘(분)</b> 순서로 읽어요. 3시 30분처럼 짧은 바늘이 두 숫자 사이에 있으면 <b>지나온 숫자</b>를 읽는 게 가장 많이 틀리는 부분이에요.</p><div class="say-line">짧은 바늘이 3과 4 사이에 있네. 아직 4시가 안 됐으니까 3시야.</div><p>집에 바늘 시계를 걸어 두고 "지금 몇 시야?"를 자주 물어봐 주세요.</p>`},
  levels:[{id:'l1',name:'정각',desc:'긴 바늘이 12',emoji:'🕐',gen:S(5,()=>mkRead('oclock'))},
   {id:'l2',name:'30분',desc:'긴 바늘이 6',emoji:'🕧',gen:S(5,()=>mkRead('half'))},
   {id:'l3',name:'몇 분',desc:'5분씩 세기',emoji:'⏱️',gen:S(5,()=>mkRead('five'))}]});
K.area('clock',{id:'set',name:'바늘 맞추기',desc:'시계를 직접 돌려요',emoji:'🔧',color:'#E3F0FF',hello:'바늘을 돌려서 시계를 맞춰 볼까?',types:{setclock},
  skills:{set0:'정각 맞추기',set30:'30분 맞추기',set5:'몇 분 맞추기'},
  tip:{t:'직접 돌려 보기',b:`<p>바늘을 직접 돌려 보면 <b>긴 바늘이 한 바퀴 돌 때 짧은 바늘은 한 칸</b> 간다는 걸 느껴요. 진짜 시계로도 함께 해 보세요.</p>`},
  levels:[{id:'l1',name:'정각 맞추기',desc:'3시, 7시',emoji:'🕒',gen:S(5,()=>mkSet('set0'))},
   {id:'l2',name:'30분 맞추기',desc:'2시 30분',emoji:'🕝',gen:S(5,()=>mkSet('set30'))},
   {id:'l3',name:'몇 분 맞추기',desc:'4시 15분',emoji:'🕓',gen:S(5,()=>mkSet('set5'))}]});
K.area('clock',{id:'day',name:'시간 흐름',desc:'몇 시간 뒤, 하루 순서',emoji:'📅',color:'#FFF1B8',hello:'시간이 지나면 시계가 어떻게 될까?',types:{quiz:qz},
  skills:{after:'몇 시간 뒤',day:'하루 순서'},
  tip:{t:'시간은 흘러가요',b:`<p>"30분 뒤에 밥 먹자"처럼 생활 속에서 시간 말을 써 주세요. 하루 일과표를 그림으로 붙여 두면 순서 감각이 생겨요.</p>`},
  levels:[{id:'l1',name:'하루 순서',desc:'아침부터 밤까지',emoji:'🌞',gen:S(5,mkDay)},
   {id:'l2',name:'몇 시간 뒤',desc:'바늘이 ↻로 가요',emoji:'⏩',gen:S(5,mkAfter)}]});
})();
