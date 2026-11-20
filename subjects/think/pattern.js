/* 생각콩 · 규칙 찾기 */
(()=>{
const {E,N}=K;
K.css(`
.train{display:flex;flex-wrap:wrap;row-gap:10px;gap:4px;max-width:100%;--per:8;justify-content:center;align-items:flex-end;padding:6px 0}
.car{position:relative;width:58px;flex:0 0 calc((100% - 52px - var(--per) * 4px) / var(--per));max-width:58px;min-width:34px;aspect-ratio:1/1;height:auto;border-radius:14px;background:var(--paper);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:min(36px,7vw);transition:background .3s}
.car .em{line-height:1}
.car.blank{border:3px dashed var(--blue);background:var(--s-blue);color:var(--blue-d);font-family:var(--f-disp);font-size:26px;cursor:pointer}
.car.blank.filled{border-style:solid}
.car .stuck{font-size:min(34px,6.5vw)}
.car.read{transform:translateY(-8px);transition:transform .15s;background:var(--s-yellow)}
.car.g0{background:var(--s-orange2);border-color:#F7C08A}.car.g1{background:var(--s-blue2);border-color:#9CCBF3}
.loco{flex:none;font-size:min(44px,9vw);line-height:1;margin-right:2px}
.boxes{display:flex;flex-wrap:nowrap;gap:4px;max-width:100%;justify-content:center;align-items:flex-end}
.gbox{position:relative;min-width:0;flex:0 1 80px;min-height:70px;border-radius:14px;background:var(--paper);border:3px solid var(--line);display:flex;flex-wrap:wrap;align-content:center;justify-content:center;padding:4px;font-size:20px;max-width:96px}
.gbox.blank{border:3px dashed var(--blue);background:var(--s-blue);color:var(--blue-d);font-family:var(--f-disp);font-size:26px;cursor:pointer}
.gbox .cnt{position:absolute;bottom:-24px;left:0;right:0;text-align:center;font-family:var(--f-disp);font-size:17px;color:var(--blue-d);animation:pop .3s both}
.plus{font-family:var(--f-disp);color:var(--orange-d);font-size:16px;align-self:center;animation:pop .35s both;min-width:14px;flex:none;text-align:center}
.boxes-wrap{padding-bottom:26px}
.sq{position:relative;width:62px;flex:0 1 62px;min-width:36px;aspect-ratio:1/1;height:auto;border-radius:12px;background:var(--paper);border:3px solid var(--line)}
.sq.blank{border:3px dashed var(--blue);background:var(--s-blue);cursor:pointer}
.sq .bug{position:absolute;font-size:22px;line-height:1;transition:all .5s}
.sq .q{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--f-disp);font-size:26px;color:var(--blue-d)}
.stk .sq{width:48px;height:48px;flex:none;min-width:0;border-width:2px}.stk .sq .bug{font-size:17px}
.sq.blank .stuck .sq{width:56px;height:56px;border:0;background:none}
`);
const C=['tl','tr','br','bl'];
const POS={tl:'left:4px;top:4px',tr:'right:4px;top:4px',br:'right:4px;bottom:4px',bl:'left:4px;bottom:4px'};
const CN={tl:'왼쪽 위',tr:'오른쪽 위',br:'오른쪽 아래',bl:'왼쪽 아래'};
const sqHTML=c=>`<div class="sq"><span class="bug em" style="${POS[c]}">🐞</span></div>`;
const cluster=(k,n)=>`<span class="em" style="font-size:${n>6?15:n>3?18:22}px;line-height:1.1">${E(k).repeat(n)}</span>`;

/* 반복 규칙 */
function repeat(p,G){
  const blanks=p.seq.map((x,i)=>x==='?'?i:-1).filter(i=>i>=0);
  G.html(`<div class="qline"><span class="tag q">문제</span>규칙을 찾아 빈칸에 알맞은 것을 넣어요</div>
   <div class="train" id="tr" style="--per:${p.seq.length<=8?p.seq.length:Math.ceil(p.seq.length/2)}"><span class="loco em">🚂</span>${p.seq.map((k,i)=>k==='?'?`<div class="car blank" data-i="${i}">?</div>`:`<div class="car" data-i="${i}"><span class="em">${E(k)}</span></div>`).join('')}</div>`);
  blanks.forEach(i=>G.slot(G.board.querySelector(`.car[data-i="${i}"]`),'c'+i));
  G.stickers(p.opts.map(k=>({v:k,html:`<span class="em">${E(k)}</span>`,label:N(k)})));
  const cars=()=>[...G.board.querySelectorAll('.car')];
  const readAloud=cb=>{const cs=cars();K.speak(p.seq.map(k=>k==='?'?'뭘까':N(k)).join(', '));
    cs.forEach((c,i)=>K.later(()=>{cs.forEach(x=>x.classList.remove('read'));c.classList.add('read');K.sfx.tap(i%p.unit)},i*520));
    K.later(()=>{cs.forEach(x=>x.classList.remove('read'));cb&&cb()},cs.length*520+200)};
  const group=()=>cars().forEach((c,i)=>{c.classList.remove('g0','g1');c.classList.add('g'+(Math.floor(i/p.unit)%2))});
  const unitLine=()=>p.full.slice(0,p.unit).map(k=>`[${k}]`).join(' ');
  G.answer({ready:v=>blanks.every(i=>v['c'+i]),
    hints:[()=>{G.say('소리 내어 읽어 볼까? 노래처럼 읽으면 규칙이 들려!');K.later(()=>readAloud(),900)},
           ()=>{group();G.say('반복되는 부분을 색깔로 묶어 봤어. 빈칸은 묶음의 <b>몇 번째 자리</b>일까?')}],
    check:v=>{const bad=blanks.filter(i=>v['c'+i].v!==p.full[i]);
      return bad.length?{ok:false,note:blanks.map(i=>E(v['c'+i].v)).join(''),why:bad.length<blanks.length?`빈칸 ${blanks.length}개 중에 ${bad.length}개가 규칙과 달라.`:''}
        :{ok:true,line:`맞아! ${unitLine()} 묶음이 계속 반복되는 규칙이야!`}}});
  if(p.guided)G.guide([
    {say:'기차에 규칙이 숨어 있어! 먼저 소리 내어 읽어 보자.',wait:next=>K.later(()=>readAloud(next),1200)},
    {say:()=>`${unitLine()}, 그다음 또 ${unitLine()}… 같은 게 되풀이되지? 이걸 <b>묶음</b>이라고 해.`,act:group},
    {say:'빈칸에 뭐가 올지 스티커를 놓고 <b>다 했어요</b>를 눌러 봐! 놓은 걸 바꾸고 싶으면 다른 스티커를 위에 놓으면 돼.'}]);
  else G.say(p.say||'규칙을 찾아서 빈칸을 채워 봐! 소리 내어 읽으면 쉬워.');
}

/* 늘어나는·줄어드는 규칙 */
function grow(p,G){
  const n=p.counts,step=p.step;
  G.html(`<div class="qline"><span class="tag q">문제</span>몇 개씩 변하는지 찾아 빈칸을 채워요</div>
   <div class="boxes-wrap"><div class="boxes" id="bx">${n.map((c,i)=>(i?'<span class="plus"></span>':'')+(c==='?'?`<div class="gbox blank" data-i="${i}">?</div>`:`<div class="gbox" data-i="${i}">${cluster(p.item,c)}</div>`)).join('')}</div></div>`);
  G.slot(G.board.querySelector('.gbox.blank'),'g');
  G.stickers(p.opts.map(c=>({v:c,html:`<span style="max-width:80px;display:flex;flex-wrap:wrap;justify-content:center">${cluster(p.item,c)}</span>`})));
  G.answer({hints:[
    ()=>{G.say('칸마다 몇 개인지 세어 볼까?');n.forEach((c,i)=>{if(c==='?')return;K.later(()=>{const b=G.board.querySelector(`.gbox[data-i="${i}"]`);if(!b.querySelector('.cnt'))b.insertAdjacentHTML('beforeend',`<span class="cnt">${c}개</span>`);K.sfx.count()},i*450)})},
    ()=>{G.say('옆 칸으로 갈 때 몇 개가 <b>더해지거나 빠지는지</b> 비교해 봐! 손가락으로 세어 보자.');G.hl(G.board.querySelectorAll('.gbox:not(.blank)'))}],
    check:v=>v.g.v===p.ans?{ok:true,line:`맞아! ${Math.abs(step)}개씩 ${step>0?'늘어나서':'줄어서'} ${p.ans}개!`}:{ok:false,note:v.g.v+'개'}});
  G.say(p.say||`[${p.item}|이] 어떻게 변하고 있는지 잘 봐! 빈칸에는 몇 개가 올까?`);
}

/* 빙글빙글 자리 규칙 */
function turn(p,G){
  const bi=p.seq.indexOf('?');
  G.html(`<div class="qline"><span class="tag q">문제</span><span class="em">🐞</span>무당벌레가 다음에 어디 있을까요?</div>
   <div class="train" id="tr">${p.seq.map((c,i)=>c==='?'?`<div class="sq blank" data-i="${i}"><span class="q">?</span></div>`:sqHTML(c).replace('class="sq"',`class="sq" data-i="${i}"`)).join('')}</div>`);
  G.slot(G.board.querySelector('.sq.blank'),'q');
  G.stickers(C.map(c=>({v:c,html:sqHTML(c),label:CN[c]})));
  G.answer({hints:[
    ()=>{G.say('첫 번째 칸에서 두 번째 칸으로 갈 때, 무당벌레가 <b>어느 쪽으로</b> 움직였는지 손가락으로 따라가 봐!');G.hl([G.board.querySelectorAll('.sq')[0],G.board.querySelectorAll('.sq')[1]])},
    ()=>{G.say('시계 바늘처럼 도는지, 반대로 도는지, 한 칸씩인지 두 칸씩인지 살펴봐!');G.hl(null)}],
    check:v=>v.q.v===p.ans?{ok:true,line:`맞아! ${p.step===1?'한 칸씩':p.step===3?'거꾸로 한 칸씩':'두 칸씩'} 도는 규칙이야!`}:{ok:false,note:CN[v.q.v]}});
  G.say(p.say||'무당벌레가 네모 안에서 움직이고 있어. 규칙을 찾아 빈칸에 알맞은 그림을 놓아 봐!');
}

/* 문제 만들기 */
const UNITS2=[['apple','banana'],['star','heart'],['red','blue'],['dog','cat'],['sun','moon'],['car','bus'],['flower','leaf'],['fish','frog']];
const UNITS3=[['red','blue','yellow'],['dog','cat','cat'],['sun','moon','moon'],['apple','apple','grape'],['car','bus','ball'],['star','star','heart'],['chick','pig','rabbit'],['flower','leaf','leaf']];
const POOL=['apple','banana','grape','star','heart','red','blue','yellow','green','dog','cat','sun','moon','car','bus','ball','flower','leaf','fish','frog','chick','pig','rabbit'];
function mkRepeat(unit,len,blanks,say){const full=Array.from({length:len},(_,i)=>unit[i%unit.length]);const set=[...new Set(unit)];
  const extra=K.pickN(POOL.filter(x=>!set.includes(x)),Math.max(1,3-set.length));
  return {type:'repeat',full,seq:full.map((k,i)=>blanks.includes(i)?'?':k),unit:unit.length,opts:K.shuffle(set.concat(extra)),say}}
const ITEMS=['straw','cookie','candy','balloon','apple','star','egg','fish'];
function mkGrow(i){const step=i<3?K.pick([1,2]):K.pick([1,2,-1,-2]);const len=4;let start=step>0?K.ri(1,3):K.ri(1-step*(len-1),9);
  const counts=Array.from({length:len},(_,j)=>start+step*j);const bi=i<4?len-1:K.ri(1,len-1);const ans=counts[bi];
  const c=counts.map((x,j)=>j===bi?'?':x);
  return {type:'grow',item:K.pick(ITEMS),counts:c,ans,step,opts:K.shuffle([ans,ans+1,Math.max(1,ans-1)].filter((x,j,a)=>a.indexOf(x)===j).concat(ans+2).slice(0,3)),
    say:step<0?'이번엔 어떻게 변하지? 늘어나는 게 아닐 수도 있어!':bi<len-1?'빈칸이 가운데 있어! 앞과 뒤를 둘 다 살펴봐.':''}}
function mkTurn(i){const step=i<3?1:K.pick([1,2,3]);const len=i<3?5:K.ri(5,6);const s=Array.from({length:len},(_,j)=>C[(C.indexOf(C[K.ri(0,3)])+j*step)%4]);
  const st=K.ri(0,3);const seq=Array.from({length:len},(_,j)=>C[(st+j*step)%4]);
  return {type:'turn',ans:seq[len-1],seq:seq.slice(0,len-1).concat('?'),step,say:step===3?'이번 무당벌레는 반대쪽으로 돌 수도 있어! 잘 봐.':step===2?'몇 칸씩 움직이는지 잘 봐!':''}}

K.area('think',{id:'pattern',name:'규칙 찾기',desc:'반복되는 묶음과 변하는 규칙을 찾아요',emoji:'🚂',color:'#FFE3C7',
  hello:'규칙 기차가 왔어! 소리 내어 읽으면 규칙이 들려.',
  types:{repeat,grow,turn},
  skills:{rep:'반복 묶음 찾기',grow:'늘고 주는 규칙',turn:'위치 이동 규칙'},
  tip:{t:'소리 내어 읽고 묶어 주기',b:`<p>규칙 문제는 눈으로만 보면 어렵지만 <b>소리로 들으면</b> 쉬워져요. 노래처럼 리듬을 붙여 읽어 주세요.</p>
<div class="say-line">사과, 바나나, 사과, 바나나… 다음엔 뭐가 올 것 같아?</div>
<p>그래도 어려워하면 반복되는 부분을 <b>손으로 동그라미 쳐서 묶어</b> 주세요. "여기까지가 한 묶음이야"라고 보여 주면 빈칸이 묶음의 몇 번째 자리인지 찾을 수 있어요.</p>
<div class="say-line">빈칸은 앞 묶음의 몇 번째랑 같은 자리야?</div>
<p>늘어나는 규칙은 칸마다 개수를 세어 숫자를 적고, 숫자 사이에 "+1"을 써 보게 하세요. 무당벌레 규칙은 손가락으로 직접 따라 돌려 보면 금방 알아요.</p>`},
  levels:[
   {id:'l1',name:'반복 기차',desc:'같은 묶음이 되풀이돼요',emoji:'🍎🍌🍎🍌',gen:()=>K.makeSet(6,i=>{const u=K.pick(i<3?UNITS2:UNITS3);const len=i<3?7:9;
     const bl=i<4?[len-1]:i===4?[len-2,len-1]:[K.ri(2,len-3),len-1];return Object.assign(mkRepeat(u,len,bl,bl.length>1?'빈칸이 두 개야! 앞뒤를 잘 봐.':''),{skill:'rep'})},true)},
   {id:'l2',name:'긴 반복 기차',desc:'묶음이 길어져요',emoji:'🔴🔵🟡',gen:()=>K.makeSet(6,i=>{const u=i<3?K.pick(UNITS3):K.shuffle(K.pick(UNITS3)).concat(K.pick(POOL));const len=u.length*3;
     const bl=[K.ri(u.length,len-2),len-1];return Object.assign(mkRepeat(u,len,bl),{skill:'rep'})})},
   {id:'l3',name:'늘었다 줄었다',desc:'몇 개씩 변하는지 찾아요',emoji:'🍓➜🍓🍓',gen:()=>K.makeSet(6,i=>Object.assign(mkGrow(i),{skill:'grow'}))},
   {id:'l4',name:'빙글빙글 무당벌레',desc:'움직이는 자리 규칙',emoji:'🐞',gen:()=>K.makeSet(6,i=>Object.assign(mkTurn(i),{skill:'turn'}))}
  ]});
})();
