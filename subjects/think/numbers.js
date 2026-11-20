/* 생각콩 · 수 가르기·모으기 */
(()=>{
const {E,N}=K;
K.css(`
.plates{display:flex;justify-content:center;align-items:flex-end;gap:14px;flex-wrap:wrap}
.plate{position:relative;min-width:120px;min-height:86px;padding:10px 8px 16px;border-radius:50% / 30%;background:radial-gradient(#fff 55%,#F1E6D6 56%,#fff 70%);
  border:3px solid var(--line);display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:2px;font-size:30px}
.plate .lb{position:absolute;bottom:-24px;left:0;right:0;text-align:center;font-size:16px;color:var(--muted)}
.plate.drop{border-style:dashed;border-color:var(--blue)}
.basket{min-width:200px;min-height:96px;border-radius:18px 18px 40px 40px;background:#F6E3C3;border:4px solid #D9B27A;display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:2px;padding:8px;font-size:30px}
.fly{transition:transform .7s cubic-bezier(.5,0,.3,1)}
.cloth{position:absolute;inset:-4px;border-radius:50% / 30%;background:repeating-linear-gradient(45deg,#FF9DB5,#FF9DB5 10px,#FFB8C9 10px,#FFB8C9 20px);display:flex;align-items:center;justify-content:center;
  font-family:var(--f-disp);font-size:30px;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.15);transition:transform .6s,opacity .6s;z-index:2}
.cloth.lift{transform:translateY(-70px) rotate(-12deg);opacity:0}
.roof{position:relative;margin:0 auto;width:min(300px,100%);padding:12px 10px 10px;background:#FFE3C7;border-radius:14px;display:flex;flex-wrap:wrap;justify-content:center;gap:4px;font-size:30px}
.roof .gone{filter:grayscale(1) opacity(.35)}
.roof .gone:after{content:"";position:absolute}
.roof .em{position:relative}
.roof .x{position:relative}
.roof .x:after{content:"✕";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--red);font-family:var(--f-disp);font-size:28px}
.roof-cap{text-align:center;font-size:17px;color:var(--orange-d)}
.eqline{display:flex;align-items:center;justify-content:center;gap:8px;font-size:30px;flex-wrap:wrap}
.eqline .n{min-width:44px;text-align:center;color:var(--ink)}
.ways{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:20px;text-align:center}
.ways td{background:#F7F1E8;padding:4px 6px}
.ways td:first-child{border-radius:12px 0 0 12px}.ways td:last-child{border-radius:0 12px 12px 0}
.ways tr.new td{background:#EEF9EF;animation:pop .4s both}
.ways tr.empty td{color:var(--muted);background:#FBF7F1}
.tapit{cursor:pointer}
`);
const many=(k,n,cls='')=>Array.from({length:n},()=>`<span class="em ${cls}">${E(k)}</span>`).join('');
const slotHTML=(id='ans')=>`<div class="slot sm" data-drop="${id}" id="${id}">?</div>`;

/* 모으기: a + b = ? */
function join(p,G){
  const nm=`<span class="em">${E(p.item)}</span>${N(p.item)}${K.josa(N(p.item),'이')}`;
  G.html(`<div class="qline"><span class="tag q">문제</span>두 접시를 모으면 ${nm} 몇 개일까요?</div>
   <div class="plates" style="padding-bottom:22px"><div class="plate" id="pa">${many(p.item,p.a)}<span class="lb">왼쪽 접시</span></div><div class="plate" id="pb">${many(p.item,p.b)}<span class="lb">오른쪽 접시</span></div></div>
   <div class="plates"><div class="basket" id="bk"></div></div>
   <div class="eqline"><span class="n">${p.a}</span>개랑<span class="n">${p.b}</span>개를 모으면 <div class="slot sm" id="ans">?</div>개</div>`);
  G.slot(K.$('#ans'),'a');G.numbers(1,10);
  let gathered=false;
  const gather=cb=>{if(gathered){cb&&cb();return}gathered=true;const bk=K.$('#bk');const its=[...G.board.querySelectorAll('.plate .em')];
    its.forEach((it,i)=>K.later(()=>{const r=it.getBoundingClientRect();const c=it.cloneNode(true);bk.appendChild(c);
      const r2=c.getBoundingClientRect();c.style.transform=`translate(${r.left-r2.left}px,${r.top-r2.top}px)`;c.classList.add('fly');it.style.visibility='hidden';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transform='none'}));K.sfx.tap(i)},i*240));
    K.later(()=>cb&&cb(),its.length*240+800)};
  const countAll=cb=>{const its=[...K.$('#bk').children];its.forEach((it,i)=>K.later(()=>{it.dataset.n=i+1;it.classList.add('it');K.sfx.count()},i*420));K.later(()=>cb&&cb(),its.length*420+200)};
  G.answer({hints:[
     ()=>{G.say('바구니에 모두 모아 볼게! 이제 바구니 안을 하나씩 세어 봐.');gather()},
     ()=>{G.say(`처음부터 다 세지 않아도 돼. ${Math.max(p.a,p.b)}개는 이미 있으니까, 거기서부터 <b>이어서</b> 세어 봐!`)}],
    check:v=>v.a.v===p.a+p.b?(gather(),{ok:true,line:`맞아! ${p.a}개랑 ${p.b}개를 모으면 ${p.a+p.b}개!`}):{ok:false,note:v.a.v+'',mark:K.$('#ans'),why:Math.abs(v.a.v-(p.a+p.b))===1?'아주 가까워! 하나씩 다시 세어 볼까?':''}});
  if(p.guided)G.guide([
    {say:`왼쪽 접시에 ${p.a}개, 오른쪽 접시에 ${p.b}개가 있어. <b>모으기</b>는 한곳에 다 넣는 거야.`,act:()=>G.hl(['#pa','#pb'])},
    {say:'바구니에 모아 볼게! 잘 봐!',act:()=>G.hl(null),wait:next=>gather(next)},
    {say:'이제 바구니 안을 하나씩 세어 보자.',wait:next=>countAll(next)},
    {say:'마지막에 센 숫자가 전부야! 숫자를 칸에 놓고 <b>다 했어요</b>를 눌러 봐.'}]);
  else G.say('두 접시를 모으면 몇 개일까? 숫자를 칸에 놓고 <b>다 했어요</b>!');
}

/* 가르기: 전체 n개 중 a개가 왼쪽, 보자기 안은? */
function split(p,G){
  const b=p.total-p.left;
  G.html(`<div class="qline"><span class="tag q">문제</span>보자기 안에는 몇 개가 숨어 있을까요?</div>
   <div class="roof-cap">모두 ${p.total}개</div><div class="roof" id="rf">${many(p.item,p.total)}</div>
   <div class="plates" style="padding-bottom:22px"><div class="plate" id="pa">${many(p.item,p.left)}<span class="lb">왼쪽 접시</span></div>
   <div class="plate" id="pb">${many(p.item,b)}<div class="cloth" id="cl">?</div><span class="lb">보자기 접시</span></div></div>
   <div class="eqline"><span class="n">${p.total}</span>개는<span class="n">${p.left}</span>개랑 <div class="slot sm" id="ans">?</div>개로 가를 수 있어요</div>`);
  G.slot(K.$('#ans'),'a');G.numbers(0,9);
  const roof=()=>[...G.board.querySelectorAll('#rf .em')];
  const cross=cb=>{roof().slice(0,p.left).forEach((e,i)=>K.later(()=>{e.classList.add('x');K.sfx.tap(i)},i*400));K.later(()=>cb&&cb(),p.left*400+300)};
  const countRest=cb=>{roof().slice(p.left).forEach((e,i)=>K.later(()=>{e.classList.add('it');e.dataset.n=i+1;K.sfx.count()},i*420));K.later(()=>cb&&cb(),b*420+200)};
  G.answer({hints:[
     ()=>{G.hl('#rf');G.say(`위에 있는 게 <b>전부 ${p.total}개</b>야. 그중 ${p.left}개는 왼쪽 접시에 있어.`)},
     ()=>{G.hl(null);G.say(`왼쪽 접시에 간 ${p.left}개를 위 그림에서 지워 볼게. <b>남은 것</b>을 세어 봐!`);if(!G.board.querySelector('#rf .x'))cross()}],
    check:v=>v.a.v===b?(K.$('#cl').classList.add('lift'),{ok:true,line:`맞아! ${p.total}개는 ${p.left}개랑 ${b}개로 가를 수 있어. 보자기 안에 ${b}개!`})
      :{ok:false,note:v.a.v+'',mark:K.$('#ans'),why:v.a.v===p.total?'그건 전부의 개수야! 보자기 안에는 그중 일부만 있어.':v.a.v===p.left?'그건 왼쪽 접시의 개수야!':''}});
  if(p.guided)G.guide([
    {say:`[${p.item}|이] 모두 ${p.total}개 있었어. 이걸 두 접시에 나눴대.`,act:()=>G.hl('#rf')},
    {say:`왼쪽 접시에는 ${p.left}개! 그럼 나머지는 보자기 밑에 숨어 있겠지?`,act:()=>G.hl(['#pa','#pb'])},
    {say:`위 그림에서 왼쪽 접시로 간 ${p.left}개를 지워 볼게.`,act:()=>G.hl(null),wait:next=>cross(next)},
    {say:'남은 걸 세어 보자!',wait:next=>countRest(next)},
    {say:'남은 개수가 보자기 안에 있는 개수야. 숫자를 놓고 <b>다 했어요</b>!'}]);
  else G.say('보자기 안에 몇 개가 숨어 있을까? 위에 있는 전체 그림을 보면 알 수 있어!');
}

/* 가르는 방법 모두 찾기 */
function ways(p,G){
  const n=p.total,need=n-1,found=new Set();
  G.html(`<div class="qline"><span class="tag q">문제</span><span class="em">${E(p.item)}</span>${N(p.item)} ${n}개를 두 접시에 나누는 방법을 모두 찾아요 (접시마다 1개 이상)</div>
   <div class="plates" style="padding-bottom:22px"><div class="plate" id="pa"><span class="lb">왼쪽 (누르면 오른쪽으로)</span></div><div class="plate" id="pb"><span class="lb">오른쪽 (누르면 왼쪽으로)</span></div></div>
   <div class="slot-row"><button class="btn blue" id="rec">📝 이 방법 적기</button></div>
   <table class="ways" id="tb"><tbody></tbody></table>`);
  G.hideTray();
  const pa=K.$('#pa'),pb=K.$('#pb');
  const put=(pl,k)=>{const s=document.createElement('span');s.className='em tapit pop';s.textContent=E(k);pl.insertBefore(s,pl.querySelector('.lb'))};
  for(let i=0;i<n;i++)put(pa,p.item);
  G.board.addEventListener('click',e=>{const it=e.target.closest('.tapit');if(!it||G.P.done)return;const to=it.parentElement===pa?pb:pa;it.remove();put(to,p.item);K.sfx.pick();G.edit()});
  let ordered=false,last=0;
  const draw=()=>{const rows=ordered?Array.from({length:need},(_,i)=>i+1):[...found].sort((a,b)=>a-b);
    K.$('#tb tbody').innerHTML=`<tr><td>왼쪽</td><td>오른쪽</td></tr>`+rows.map(l=>found.has(l)?`<tr class="${l===last?'new':''}"><td>${l}</td><td>${n-l}</td></tr>`:`<tr class="empty"><td>?</td><td>?</td></tr>`).join('')};
  K.$('#rec').onclick=()=>{if(G.P.done)return;const l=pa.querySelectorAll('.tapit').length;
    if(l===0||l===n){K.sfx.soft();G.say('한쪽 접시가 비었어! 접시마다 1개 이상 있어야 해.');return}
    if(found.has(l)){K.sfx.soft();G.say(`왼쪽 ${l}개, 오른쪽 ${n-l}개는 이미 적었어! 다른 방법을 찾아 볼까?`);return}
    found.add(l);last=l;draw();K.sfx.good();G.refresh();G.say(`적었어! 왼쪽 ${l}개, 오른쪽 ${n-l}개. 다 찾았다고 생각하면 <b>다 찾았어요</b>를 눌러!`)};
  G.answer({label:'✔ 다 찾았어요',ready:()=>found.size>0,hints:[
     ()=>G.say('왼쪽 접시에 <b>1개만</b> 남기고 적어 봐. 그다음엔 2개, 그다음엔 3개…'),
     ()=>{ordered=true;draw();G.say('표를 순서대로 정리했어. <b>?</b> 칸이 아직 못 찾은 방법이야!')}],
    check:()=>found.size===need?{ok:true,line:`모두 ${need}가지를 찾았어! 왼쪽을 1개씩 늘리면 빠짐없이 찾을 수 있어.`}
      :{ok:false,note:`${found.size}가지만 찾음`,why:`아직 못 찾은 방법이 있어! 모두 ${need}가지야.`}});
  draw();
  G.say(p.guided?`[${p.item}|을] 눌러서 다른 접시로 옮길 수 있어. 나눈 다음 <b>이 방법 적기</b>를 눌러 봐! 몇 가지나 찾을 수 있을까?`:`${n}개를 나누는 방법을 모두 찾아 봐! 빠뜨리지 않으려면 어떻게 하면 좋을까?`);
}
const ITM=['candy','apple','cookie','straw','egg','cherry','fish','star','balloon','grape'];

K.area('think',{id:'numbers',name:'가르기·모으기',desc:'수를 나누고 합치며 생각해요',emoji:'🍪',color:'#D6F0D0',
  hello:'접시와 바구니로 수를 나누고 모아 보자!',
  types:{join,split,ways},
  tip:{t:'전체와 부분 보여 주기',b:`<p>가르기·모으기는 덧셈 뺄셈의 뿌리예요. 숫자보다 먼저 <b>"전체는 부분 두 개로 되어 있다"</b>는 그림이 머리에 생겨야 해요.</p>
<div class="say-line">쿠키가 모두 5개야. 왼쪽 접시에 2개 있으면, 보자기 밑에는 몇 개 있을까?</div>
<p>막히면 전체 그림에서 <b>왼쪽 접시에 간 만큼 손가락으로 가리고</b> 남은 걸 세게 해 주세요. 게임에서도 짝꿍처럼 하나씩 ✕ 표시를 해 줘요.</p>
<p>'모든 방법 찾기'는 경우의 수의 첫걸음이에요. 아무렇게나 찾다가 빠뜨리면 이렇게 말해 주세요.</p>
<div class="say-line">왼쪽을 1개, 2개, 3개… 순서대로 해 보면 빠뜨린 게 보여.</div>`},
  skills:{join:'모으기',split:'가르기',ways:'빠짐없이 찾기'},
  levels:[
   {id:'l1',name:'바구니에 모으기',desc:'두 접시를 모으면 몇 개?',emoji:'🍬+🍬',gen:()=>K.makeSet(6,i=>{const a=K.ri(1,i<3?4:6),b=K.ri(1,Math.min(i<3?4:6,10-a));return {type:'join',item:K.pick(ITM),a,b,skill:'join'}},true)},
   {id:'l2',name:'보자기 속 가르기',desc:'숨은 개수를 찾아요',emoji:'🎁',gen:()=>K.makeSet(6,i=>{const total=K.ri(i<3?4:6,i<3?7:10),left=K.ri(1,total-1);return {type:'split',item:K.pick(ITM),total,left,skill:'split'}},true)},
   {id:'l3',name:'모든 방법 찾기',desc:'빠짐없이 나눠 봐요',emoji:'📝',gen:()=>K.makeSet(3,i=>({type:'ways',item:K.pick(ITM),total:[4,5,6][i],skill:'ways'}),true)}
  ]});
})();
