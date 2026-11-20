/* 생각콩 · 규칙 찾기 */
(()=>{
const {E,N}=K;
K.css(`
.train{display:flex;flex-wrap:wrap;gap:12px 4px;justify-content:center;align-items:flex-end;padding:6px 0}
.car{position:relative;width:58px;height:58px;border-radius:14px;background:var(--paper);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:36px;transition:background .3s}
.car .em{line-height:1}
.car.blank{border:3px dashed var(--blue);background:#F2F8FF;color:var(--blue-d);font-family:var(--f-disp);font-size:26px}
.car.ok{border-style:solid;border-color:var(--green);background:#EEF9EF}
.car.read{transform:translateY(-8px);transition:transform .15s;background:#FFF3C4}
.car.g0{background:#FFE3C7;border-color:#F7C08A}.car.g1{background:#D6ECFF;border-color:#9CCBF3}
.car.peek{box-shadow:0 0 0 4px var(--sun)}
.car .ghost-ans{opacity:.3}
.loco{font-size:44px;line-height:1;margin-right:2px}
.boxes{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:flex-end}
.gbox{position:relative;min-width:66px;min-height:70px;border-radius:14px;background:var(--paper);border:3px solid var(--line);display:flex;flex-wrap:wrap;align-content:center;justify-content:center;padding:4px;font-size:20px;max-width:90px}
.gbox.blank{border:3px dashed var(--blue);background:#F2F8FF;color:var(--blue-d);font-family:var(--f-disp);font-size:26px}
.gbox.ok{border-style:solid;border-color:var(--green);background:#EEF9EF}
.gbox .cnt{position:absolute;bottom:-24px;left:0;right:0;text-align:center;font-family:var(--f-disp);font-size:17px;color:var(--blue-d);animation:pop .3s both}
.plus{font-family:var(--f-disp);color:var(--orange-d);font-size:16px;align-self:center;animation:pop .35s both;min-width:22px;text-align:center}
.boxes-wrap{padding-bottom:26px}
.sq{position:relative;width:62px;height:62px;border-radius:12px;background:var(--paper);border:3px solid var(--line)}
.sq.blank{border:3px dashed var(--blue);background:#F2F8FF}
.sq.ok{border-style:solid;border-color:var(--green);background:#EEF9EF}
.sq .bug{position:absolute;font-size:22px;line-height:1;transition:all .5s}
.sq .q{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--f-disp);font-size:26px;color:var(--blue-d)}
.stk .sq{width:48px;height:48px;border-width:2px}.stk .sq .bug{font-size:17px}
.stuck .sq{border:0;background:none;width:54px;height:54px}
.turn-hint{position:absolute;inset:-2px;pointer-events:none}
`);
const C=['tl','tr','br','bl']; /* 네모 안 자리: 시계 방향 */
const POS={tl:'left:4px;top:4px',tr:'right:4px;top:4px',br:'right:4px;bottom:4px',bl:'left:4px;bottom:4px'};
const sqHTML=(c,bug='🐞')=>`<div class="sq"><span class="bug em" style="${POS[c]}">${bug}</span></div>`;
const cluster=(k,n)=>`<span class="em" style="font-size:${n>6?15:n>3?18:22}px;line-height:1.1">${E(k).repeat(n)}</span>`;

/* 반복 규칙 */
function repeat(p,G){
  const seq=p.seq, blanks=seq.map((x,i)=>x==='?'?i:-1).filter(i=>i>=0), ans=i=>p.full[i];
  G.html(`<div class="qline"><span class="tag q">문제</span>규칙을 찾아 빈칸에 알맞은 것을 넣어요</div>
   <div class="train" id="tr"><span class="loco em">🚂</span>${seq.map((k,i)=>k==='?'?`<div class="car blank" data-drop="c${i}" data-i="${i}">?</div>`:`<div class="car" data-i="${i}"><span class="em">${E(k)}</span></div>`).join('')}</div>`);
  G.stickers(p.opts.map(k=>({v:k,html:`<span class="em">${E(k)}</span>`,label:N(k)})));
  const cars=()=>[...G.board.querySelectorAll('.car')];
  const readAloud=(cb)=>{const cs=cars();const names=p.full.map(N);
    K.speak(seq.map((k,i)=>k==='?'?'뭘까':N(k)).join(', '));
    cs.forEach((c,i)=>K.later(()=>{cs.forEach(x=>x.classList.remove('read'));c.classList.add('read');K.sfx.tap(p.full.indexOf(p.full[i]))},i*520));
    K.later(()=>{cs.forEach(x=>x.classList.remove('read'));cb&&cb()},cs.length*520+200)};
  const group=()=>cars().forEach((c,i)=>{c.classList.remove('g0','g1');c.classList.add('g'+(Math.floor(i/p.unit)%2))});
  const unitLine=()=>p.full.slice(0,p.unit).map(k=>`[${k}]`).join(' ');
  const hint=h=>{
    if(h===1){G.say('소리 내어 읽어 볼까? 노래처럼 읽으면 규칙이 들려!');K.later(()=>readAloud(),900)}
    else if(h===2){group();G.say(`색깔로 묶어 봤어! ${unitLine()}, 이게 <b>한 묶음</b>이야. 묶음이 계속 반복돼.`)}
    else{group();const b=blanks.find(i=>!G.board.querySelector(`[data-i="${i}"]`).classList.contains('ok'));const src=b-p.unit;
      const c=G.board.querySelector(`[data-i="${src}"]`);c&&c.classList.add('peek');G.say(`빈칸은 바로 앞 묶음의 <b>같은 자리</b>랑 똑같아! 반짝이는 칸을 봐.`)}};
  G.setActs(hint);
  const filled=new Set();
  G.drop((pl,d,t)=>{if(pl.kind!=='stk'||!d||d[0]!=='c')return;const i=+d.slice(1);if(filled.has(i))return;
    if(pl.v===ans(i)){filled.add(i);t.innerHTML=`<span class="em">${E(pl.v)}</span>`;t.classList.add('ok');t.removeAttribute('data-drop');K.sfx.drop();
      if(filled.size===blanks.length){K.later(()=>readAloud(),300);G.success(`맞아! ${unitLine()} 묶음이 계속 반복되는 규칙이야!`)}}
    else G.wrong(t,hint)});
  if(p.guided)G.guide([
    {say:'기차에 규칙이 숨어 있어! 먼저 소리 내어 읽어 보자.',wait:next=>K.later(()=>readAloud(next),1200)},
    {say:()=>`${unitLine()}, 그다음 또 ${unitLine()}… 같은 게 되풀이되지? 이걸 <b>묶음</b>으로 묶어 볼게.`,act:group},
    {say:'묶음이 반복되니까, 빈칸에는 뭐가 올까? 스티커를 끌어다 넣어 봐!'}]);
  else G.say(p.say||'규칙을 찾아서 빈칸을 채워 봐! 소리 내어 읽으면 쉬워.');
}

/* 늘어나는·줄어드는 규칙 */
function grow(p,G){
  const n=p.counts, bi=n.indexOf('?'), ans=p.ans;
  G.html(`<div class="qline"><span class="tag q">문제</span>몇 개씩 변하는지 찾아 빈칸을 채워요</div>
   <div class="boxes-wrap"><div class="boxes" id="bx">${n.map((c,i)=>(i?'<span class="plus" data-p="'+i+'"></span>':'')+(c==='?'?`<div class="gbox blank" data-drop="g" data-i="${i}">?</div>`:`<div class="gbox" data-i="${i}">${cluster(p.item,c)}</div>`)).join('')}</div></div>`);
  G.stickers(p.opts.map(c=>({v:c,html:`<span style="max-width:76px;display:flex;flex-wrap:wrap;justify-content:center">${cluster(p.item,c)}</span>`})));
  const step=n[1]-n[0];
  const hint=h=>{
    if(h===1){G.say('하나씩 세어 볼까?');n.forEach((c,i)=>{if(c==='?')return;K.later(()=>{const b=G.board.querySelector(`.gbox[data-i="${i}"]`);if(!b.querySelector('.cnt'))b.insertAdjacentHTML('beforeend',`<span class="cnt">${c}개</span>`);K.sfx.count()},i*500)})}
    else if(h===2){G.say(step>0?`옆으로 갈 때마다 <b>${step}개씩 늘어나!</b>`:`옆으로 갈 때마다 <b>${-step}개씩 줄어들어!</b>`);
      G.board.querySelectorAll('.plus').forEach((s,i)=>K.later(()=>{s.textContent=(step>0?'+':'−')+Math.abs(step);K.sfx.tap(i)},i*400))}
    else{G.say(`${n[bi-1]}개에서 ${step>0?Math.abs(step)+'개 더하면':Math.abs(step)+'개 빼면'}? 손가락으로 세어 봐!`)}};
  G.setActs(hint);
  G.drop((pl,d,t)=>{if(pl.kind!=='stk'||d!=='g')return;
    if(pl.v===ans){t.innerHTML=cluster(p.item,ans);t.classList.add('ok');K.sfx.drop();hint(2);G.success(`맞아! ${step>0?Math.abs(step)+'개씩 늘어나서':Math.abs(step)+'개씩 줄어서'} ${ans}개!`)}
    else G.wrong(t,hint)});
  G.say(p.say||'[straw]가 어떻게 변하고 있는지 잘 봐! 빈칸에는 몇 개가 올까?'.replace('[straw]',`[${p.item}|이]`));
}

/* 빙글빙글 자리 규칙 */
function turn(p,G){
  const seq=p.seq, bi=seq.indexOf('?'), ans=p.ans;
  G.html(`<div class="qline"><span class="tag q">문제</span>[ladybug]가 어떻게 움직일까요?</div>
   <div class="train" id="tr">${seq.map((c,i)=>c==='?'?`<div class="sq blank" data-drop="q" data-i="${i}"><span class="q">?</span></div>`:sqHTML(c).replace('class="sq"',`class="sq" data-i="${i}"`)).join('')}</div>`
   .replace('[ladybug]','<span class="em">🐞</span>무당벌레'));
  G.stickers(C.map(c=>({v:c,html:sqHTML(c)})));
  const st=p.step;
  const hint=h=>{
    if(h===1){G.say('무당벌레를 손가락으로 따라가 봐! 한 칸에서 다음 칸으로 갈 때 어디로 움직였어?');G.hl(G.board.querySelectorAll('.sq')[0]);K.later(()=>G.hl(G.board.querySelectorAll('.sq')[1]),900)}
    else if(h===2){G.say(`무당벌레는 시계 방향으로 <b>${st===1?'한 칸씩':'두 칸씩'}</b> 빙글 돌아!`);G.hl(null);
      /* 이동 미리 보기: 첫 칸 무당벌레가 실제로 움직여요 */
      const b=G.board.querySelector('.sq .bug');let c=seq[0];let k=0;const mv=()=>{if(k>=3)return;c=C[(C.indexOf(c)+st)%4];b.setAttribute('style',POS[c]);K.sfx.tap(k);k++;K.later(mv,700)};K.later(mv,500)}
    else{const prev=seq[bi-1];G.say('바로 앞 칸을 봐. 거기서 '+(st===1?'한 칸':'두 칸')+' 더 돌면 어디일까?');G.hl(G.board.querySelector(`.sq[data-i="${bi-1}"]`))}};
  G.setActs(hint);
  G.drop((pl,d,t)=>{if(pl.kind!=='stk'||d!=='q')return;
    if(pl.v===ans){t.innerHTML=`<span class="bug em" style="${POS[ans]}">🐞</span>`;t.classList.add('ok');K.sfx.drop();G.success(`맞아! 시계 방향으로 ${st===1?'한 칸씩':'두 칸씩'} 도는 규칙이야!`)}
    else G.wrong(t,hint)});
  G.say(p.say||'무당벌레가 네모 안에서 움직이고 있어. 규칙을 찾아 빈칸에 알맞은 그림을 붙여 봐!');
}

/* 규칙대로 전체 줄 만들기 */
const mk=(unit,len,blanks)=>{const full=Array.from({length:len},(_,i)=>unit[i%unit.length]);return {full,seq:full.map((k,i)=>blanks.includes(i)?'?':k),unit:unit.length}};
const turns=(start,step,len)=>Array.from({length:len},(_,i)=>C[(C.indexOf(start)+i*step)%4]);
const tq=(start,step,len,say)=>{const s=turns(start,step,len);return {type:'turn',ans:s[len-1],seq:s.slice(0,len-1).concat('?'),step,say}};

K.area('think',{id:'pattern',name:'규칙 찾기',desc:'반복되는 묶음과 변하는 규칙을 찾아요',emoji:'🚂',color:'#FFE3C7',
  hello:'규칙 기차가 왔어! 소리 내어 읽으면 규칙이 들려.',
  types:{repeat,grow,turn},
  tip:{t:'소리 내어 읽고 묶어 주기',b:`<p>규칙 문제는 눈으로만 보면 어렵지만 <b>소리로 들으면</b> 쉬워져요. 노래처럼 리듬을 붙여 읽어 주세요.</p>
<div class="say-line">사과, 바나나, 사과, 바나나… 다음엔 뭐가 올 것 같아?</div>
<p>그래도 어려워하면 반복되는 부분을 <b>손으로 동그라미 쳐서 묶어</b> 주세요. "여기까지가 한 묶음이야"라고 보여 주면 빈칸이 묶음의 몇 번째 자리인지 찾을 수 있어요.</p>
<div class="say-line">빈칸은 앞 묶음의 몇 번째랑 같은 자리야?</div>
<p>늘어나는 규칙은 칸마다 개수를 세어 숫자를 적고, 숫자 사이에 "+1"을 써 보게 하세요. 무당벌레 규칙은 손가락으로 직접 따라 돌려 보면 금방 알아요.</p>`},
  levels:[
   {id:'l1',name:'반복 기차',desc:'같은 묶음이 되풀이돼요',emoji:'🍎🍌🍎🍌',probs:[
     Object.assign({type:'repeat',opts:['banana','apple','grape'],guided:true},mk(['apple','banana'],7,[6])),
     Object.assign({type:'repeat',opts:['dog','cat','mouse']},mk(['dog','cat','cat'],8,[7])),
     Object.assign({type:'repeat',opts:['red','blue','yellow']},mk(['red','blue','yellow'],8,[6,7]),{say:'빈칸이 두 개야! 색깔 규칙을 찾아 봐.'}),
     Object.assign({type:'repeat',opts:['sun','moon','star']},mk(['sun','moon','moon'],8,[3,4]),{say:'이번엔 빈칸이 가운데에 있어! 앞뒤를 잘 봐.'})]},
   {id:'l2',name:'늘었다 줄었다',desc:'몇 개씩 변하는지 찾아요',emoji:'🍓➜🍓🍓',probs:[
     {type:'grow',item:'straw',counts:[1,2,3,'?'],ans:4,opts:[3,4,5]},
     {type:'grow',item:'cookie',counts:[2,4,6,'?'],ans:8,opts:[7,8,10]},
     {type:'grow',item:'candy',counts:[6,5,4,'?'],ans:3,opts:[3,5,2],say:'이번엔 [candy|이] 어떻게 변하지? 늘어나는 게 아닐 수도 있어!'},
     {type:'grow',item:'balloon',counts:[1,3,'?',7],ans:5,opts:[4,5,6],say:'빈칸이 가운데 있어! 앞과 뒤를 둘 다 살펴봐.'}]},
   {id:'l3',name:'빙글빙글 무당벌레',desc:'움직이는 자리 규칙',emoji:'🐞',probs:[
     tq('tl',1,5),tq('tr',1,6),tq('tl',2,5,'이번 무당벌레는 조금 달라! 몇 칸씩 움직이는지 잘 봐.'),tq('bl',1,7)]}
  ]});
})();
