/* 셈콩 · 수와 셈 (수 세기, 덧셈, 뺄셈, 수의 순서, 10 만들기) */
'use strict';
(()=>{
const {quiz}=K.TYPES;
K.css(`
.tf{display:inline-grid;grid-template-columns:repeat(5,var(--tfc,34px));gap:3px;background:var(--s-yellow2);padding:5px;border-radius:12px;vertical-align:middle}
.tf i{width:var(--tfc,34px);height:var(--tfc,34px);background:var(--s-white);border-radius:7px;font-style:normal;font-size:calc(var(--tfc,34px)*.7);display:flex;align-items:center;justify-content:center;position:relative;font-family:var(--f-emoji)}
.tf i.x{opacity:.35}.tf i.x::after{content:'✕';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--red);font-size:calc(var(--tfc,34px)*.8);font-family:var(--f-disp);opacity:1}
.tfs{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center}
.pile{display:flex;flex-wrap:wrap;gap:4px 8px;justify-content:center;max-width:340px;font-size:40px;line-height:1.1}
.pile span{cursor:pointer;border-radius:12px;padding:0 2px;transition:opacity .2s;font-family:var(--f-emoji)}
.pile span.done{opacity:.3;box-shadow:inset 0 0 0 3px var(--green)}
.nbox{display:inline-flex;min-width:56px;height:62px;align-items:center;justify-content:center;background:var(--s-blue);border-radius:14px;font-family:var(--f-disp);font-size:32px;color:var(--blue-d);padding:0 6px}
.op{font-family:var(--f-disp);font-size:34px;color:var(--ink)}
`);
const FOOD=['🍎','🍓','🍪','🍬','🍩','🍇','🍒','🧁'];
const EM=['🍎','🍓','🐤','⭐','🍪','🎈','🐟','🌷','🍬','🚗','⚽','🐞'];
const num=n=>({v:n,html:K.numHtml(n)});
/* 정답 근처의 숫자 보기 (작은 수부터) */
const near=(ans,lo,hi,k=5)=>{const pool=[];for(let d=-3;d<=3;d++){const x=ans+d;if(x>=lo&&x<=hi)pool.push(x)}return K.opts(ans,pool,Math.min(k,pool.length)).sort((a,b)=>a-b).map(num)};
const tf=(n,em,cross=0,cells)=>{cells=cells||Math.max(10,Math.ceil(n/10)*10);let h='';for(let f=0;f<cells;f+=10){h+='<span class="tf">';for(let i=f;i<f+10;i++)h+=`<i class="${i<n&&i>=n-cross?'x':''}">${i<n?em:''}</i>`;h+='</span>'}return h};
const pile=(n,em)=>`<div class="pile" id="pile">${Array.from({length:n},()=>`<span>${em}</span>`).join('')}</div>`;
const nb=n=>`<span class="nbox">${n}</span>`,op=o=>`<span class="op">${o}</span>`;
/* 센 것을 눌러서 표시하기 */
const tapCount=G=>{const p=K.$('#pile');p&&p.addEventListener('click',e=>{const s=e.target.closest('span');if(s&&!G.P.done){s.classList.toggle('done');K.sfx.pick()}})};

/* 수 세기 */
function mkCount(lo,hi,skill){const n=K.ri(lo,hi),em=K.pick(EM);const big=n>10;
  return {type:'quiz',skill,prompt:`${em}는 모두 몇 개일까요?`,show:big?`<div class="tfs">${tf(n,em)}</div>`:pile(n,em),ans:[n],opts:near(n,1,30),nums:true,frame:[0,'<span class="op">개</span>'],
    hints:big?['10칸 상자 하나가 꽉 차면 <b>10</b>이야. 10 다음부터 하나씩 이어서 세어 봐!','꽉 찬 상자 하나는 10, 나머지 칸은 몇 개? 10하고 몇이면 십몇이야.']
      :['하나씩 <b>눌러서</b> 표시하면서 세어 봐. 누른 건 흐려져서 두 번 세지 않아!','<b>마지막</b>에 센 수가 모두의 수야. 하나, 둘, 셋… 소리 내서 세어 봐.'],
    onShow:tapCount,line:`맞아! 모두 ${n}개!`,say:big?'10칸 상자를 이용해서 세어 봐!':'하나씩 눌러서 표시하면서 세어 봐!',
    why:g=>g[0]===n-1||g[0]===n+1?'아주 가까워! 하나를 빠뜨렸거나 두 번 센 건 아닐까?':''}}

/* 덧셈 */
function mkAdd(kind){let a,b;if(kind==='add5'){a=K.ri(1,4);b=K.ri(1,5-a)}else if(kind==='add10'){a=K.ri(2,8);b=K.ri(1,10-a)}else{a=K.ri(5,9);b=K.ri(11-a,9)}
  const e1=K.pick(EM),e2=K.pick(EM.filter(x=>x!==e1)),s=a+b;
  const show=kind==='carry'?`<div class="tfs">${tf(a,e1)}${op('+')}${tf(b,e2)}</div>`:`<div class="tfs">${tf(a,e1)}${op('+')}${tf(b,e2)}</div>`;
  return {type:'quiz',skill:kind,prompt:'두 수를 더하면 얼마일까요?',show,frame:[nb(a),op('+'),nb(b),op('='),0],ans:[s],opts:near(s,0,20),nums:true,
    hints:kind==='carry'?[`${a}에 몇을 더하면 <b>10</b>이 될까? 먼저 10을 만들어 봐!`,`${b}를 ${10-a}와 ${b-(10-a)}로 나누면, 10하고 남은 수를 더하면 돼.`]
      :[`큰 수 <b>${Math.max(a,b)}</b>를 머리에 넣고, 나머지를 손가락으로 하나씩 <b>이어서</b> 세어 봐.`,'그림을 모두 합치면 몇 개인지 세어 봐도 돼.'],
    line:`맞아! ${a} 더하기 ${b}는 ${s}!`,say:'그림을 보고 더해 봐!',
    why:g=>g[0]===Math.abs(a-b)?'빼기를 했구나! 더하기는 두 묶음을 <b>합치는</b> 거야.':''}}

/* 뺄셈 */
function mkSub(kind){let a,b;if(kind==='sub5'){a=K.ri(2,5);b=K.ri(1,a-1)}else if(kind==='sub10'){a=K.ri(4,10);b=K.ri(1,a-1)}else{a=K.ri(11,18);b=K.ri(a-9,9)}
  const em=K.pick(FOOD),r=a-b;
  return {type:'quiz',skill:kind,prompt:`${em} ${a}개 중에서 ${b}개를 먹었어요. 몇 개 남았을까요?`,show:`<div class="tfs">${tf(a,em,b)}</div>`,frame:[nb(a),op('−'),nb(b),op('='),0],ans:[r],opts:near(r,0,20),nums:true,
    hints:kind==='borrow'?[`${a}에서 먼저 <b>${a-10}</b>개를 빼면 10이 남아. 그다음 남은 걸 빼 봐!`,'✕ 표시가 없는 칸만 세어 봐.']
      :['✕ 표시된 건 먹은 거야. ✕가 <b>없는 것</b>만 세어 봐.',`${b}에서 ${a}까지 몇 칸 가야 하는지 세어 봐도 돼.`],
    line:`맞아! ${a} 빼기 ${b}는 ${r}!`,say:'✕가 없는 것이 남은 거야!',
    why:g=>g[0]===a+b?'더하기를 했구나! 먹으면 <b>줄어들어야</b> 해.':g[0]===b?'먹은 수를 골랐어! 남은 걸 세어야 해.':''}}

/* 수의 순서 */
function mkSeq(kind){if(kind==='cmp'){const a=K.ri(1,20);let b=K.ri(1,20);while(b===a)b=K.ri(1,20);const m=Math.max(a,b);
    return {type:'quiz',skill:'cmp',prompt:'둘 중에 <b>더 큰 수</b>를 칸에 놓아요',show:`${nb(a)} ${nb(b)}`,ans:[m],opts:[num(Math.min(a,b)),num(m)].sort(()=>Math.random()-.5),nums:true,frame:[0],
      hints:['수를 셀 때 <b>나중에</b> 나오는 수가 더 커.','두 자리 수는 앞자리(10의 자리)부터 비교해 봐.'],line:`맞아! 더 큰 수는 ${m}!`}}
  const step=kind==='skip'?K.pick([2,5,10]):kind==='back'?-1:1;const len=5,start=step>0?K.ri(1,kind==='skip'?step*2:15):K.ri(6,20);
  const seq=Array.from({length:len},(_,i)=>start+i*step);const hole=K.ri(1,len-2);const ans=seq[hole];
  return {type:'quiz',skill:kind,prompt:step===-1?'거꾸로 세어요. 빈칸에 들어갈 수는?':step>1?`${step}씩 뛰어 세어요. 빈칸에 들어갈 수는?`:'빈칸에 들어갈 수는?',
    frame:seq.map((x,i)=>i===hole?0:nb(x)),ans:[ans],opts:near(ans,0,60),nums:true,
    hints:[step===-1?'수가 하나씩 <b>작아지고</b> 있어. 바로 앞의 수보다 1 작은 수는?':step>1?`옆 수끼리 얼마씩 커지는지 봐. ${seq[0]}에서 ${seq[1]}까지 몇 칸이야?`:'바로 앞의 수보다 <b>1 큰</b> 수를 찾아 봐.',
      `빈칸 뒤의 수 <b>${seq[hole+1]}</b>도 힌트야. 앞뒤가 다 맞는 수를 찾아!`],line:'맞아! 수가 차례대로 이어졌어!'}}

/* 10 만들기, 가르기 */
function mkTen(kind){if(kind==='make10'){const a=K.ri(1,9),em=K.pick(EM);
    return {type:'quiz',skill:'make10',prompt:'10칸을 꽉 채우려면 몇 개가 더 필요할까요?',show:`<div class="tfs">${tf(a,em)}</div>`,frame:[nb(a),op('+'),0,op('='),nb(10)],ans:[10-a],opts:near(10-a,0,10),nums:true,
      hints:['<b>빈칸</b>이 몇 개인지 세어 봐!','10을 손가락으로 펴고, 앞의 수만큼 접어 봐. 남은 손가락은?'],line:`맞아! ${a}하고 ${10-a}, 둘이 만나면 10!`}}
  const n=K.ri(4,10),a=K.ri(1,n-1),em=K.pick(EM);
  return {type:'quiz',skill:'split',prompt:`${em} ${n}개를 두 접시에 나눠요. 한 접시에 ${a}개면 다른 접시는?`,show:`<div class="tfs">${tf(n,em,n-a)}</div>`,frame:[nb(n),op('→'),nb(a),op('와'),0],ans:[n-a],opts:near(n-a,0,10),nums:true,
    hints:['✕가 있는 칸이 다른 접시로 간 거야. 몇 개일까?',`${a}에서 ${n}까지 몇 개 더 세어야 할까?`],line:`맞아! ${n}은 ${a}와 ${n-a}로 가를 수 있어!`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('math',{id:'count',name:'수 세기',desc:'하나씩, 10씩 세어요',emoji:'🍎',color:'#DCEEFF',hello:'몇 개인지 세어 볼까?',types:{quiz},
  skills:{count5:'5까지 세기',count10:'10까지 세기',count20:'20까지 세기'},
  tip:{t:'하나씩 짚으며 세기',b:`<p>아이들은 세다가 <b>같은 것을 두 번 세거나 빠뜨리는</b> 실수를 많이 해요. 하나씩 손가락으로 짚거나 눌러서 표시하게 해 주세요.</p><div class="say-line">마지막에 센 수가 모두 몇 개야?</div><p>10이 넘으면 10칸 상자를 이용해 <b>10과 몇</b>으로 보게 해 주세요.</p>`},
  levels:[{id:'l1',name:'5까지 세기',desc:'하나, 둘, 셋',emoji:'🖐️',gen:S(5,()=>mkCount(1,5,'count5'))},
   {id:'l2',name:'10까지 세기',desc:'10까지 세어요',emoji:'🔟',gen:S(5,()=>mkCount(6,10,'count10'))},
   {id:'l3',name:'20까지 세기',desc:'10칸 상자로 세어요',emoji:'📦',gen:S(5,()=>mkCount(11,20,'count20'))}]});
K.area('math',{id:'add',name:'덧셈',desc:'모으면 얼마?',emoji:'➕',color:'#E3F6E0',hello:'두 묶음을 합쳐 볼까?',types:{quiz},
  skills:{add5:'합 5까지',add10:'합 10까지',carry:'10을 넘는 덧셈'},
  tip:{t:'이어 세기와 10 만들기',b:`<p>처음엔 전부 세지만, 큰 수를 기억하고 <b>이어 세기</b>를 하면 빨라져요. 10이 넘는 덧셈은 <b>10을 먼저 만드는</b> 방법을 알려 주세요.</p><div class="say-line">8에 몇을 더하면 10이 될까? 남은 건 몇이지?</div>`},
  levels:[{id:'l1',name:'합이 5까지',desc:'작은 수 더하기',emoji:'🌱',gen:S(5,()=>mkAdd('add5'))},
   {id:'l2',name:'합이 10까지',desc:'이어 세기',emoji:'🌿',gen:S(5,()=>mkAdd('add10'))},
   {id:'l3',name:'10을 넘는 덧셈',desc:'10을 먼저 만들어요',emoji:'🌳',gen:S(5,()=>mkAdd('carry'))}]});
K.area('math',{id:'sub',name:'뺄셈',desc:'먹으면 몇 개 남지?',emoji:'➖',color:'#FFE6E6',hello:'먹고 나면 몇 개 남을까?',types:{quiz},
  skills:{sub5:'5까지 빼기',sub10:'10까지 빼기',borrow:'10을 넘는 뺄셈'},
  tip:{t:'남은 것 보기',b:`<p>뺄셈은 <b>없어진 것</b>이 아니라 <b>남은 것</b>을 세는 거예요. 아이가 뺀 수를 답으로 고르면 리포트에 따로 표시돼요.</p><div class="say-line">✕가 없는 건 몇 개야?</div>`},
  levels:[{id:'l1',name:'5까지 빼기',desc:'조금 먹어요',emoji:'🍪',gen:S(5,()=>mkSub('sub5'))},
   {id:'l2',name:'10까지 빼기',desc:'남은 것 세기',emoji:'🍩',gen:S(5,()=>mkSub('sub10'))},
   {id:'l3',name:'10을 넘는 뺄셈',desc:'10을 먼저 남겨요',emoji:'🎂',gen:S(5,()=>mkSub('borrow'))}]});
K.area('math',{id:'order',name:'수의 순서',desc:'다음 수는 뭘까?',emoji:'🔢',color:'#FFF1B8',hello:'수가 줄을 서 있어! 빈칸을 채워 볼까?',types:{quiz},
  skills:{seq:'수 이어 세기',cmp:'크기 비교',back:'거꾸로 세기',skip:'뛰어 세기'},
  tip:{t:'수 줄 세우기',b:`<p>계단 오르듯 수가 하나씩 커지고, 내려갈 때는 하나씩 작아져요.</p><div class="say-line">7 다음은? 7 바로 앞은?</div>`},
  levels:[{id:'l1',name:'빈칸 채우기',desc:'1씩 커져요',emoji:'🚂',gen:S(5,()=>mkSeq('seq'))},
   {id:'l2',name:'어느 수가 클까',desc:'크기 비교',emoji:'⚖️',gen:S(5,()=>mkSeq('cmp'))},
   {id:'l3',name:'거꾸로 세기',desc:'1씩 작아져요',emoji:'🚀',gen:S(5,()=>mkSeq('back'))},
   {id:'l4',name:'뛰어 세기',desc:'2, 5, 10씩',emoji:'🐸',gen:S(5,()=>mkSeq('skip'))}]});
K.area('math',{id:'ten',name:'10 만들기',desc:'모으기와 가르기',emoji:'🔟',color:'#F0E6FF',hello:'10칸 상자를 꽉 채워 볼까?',types:{quiz},
  skills:{make10:'10 만들기',split:'가르기'},
  tip:{t:'10의 짝꿍',b:`<p>1과 9, 2와 8, 3과 7… <b>10의 짝꿍</b>을 외우면 받아올림 덧셈이 쉬워져요. 손가락 10개로 놀이처럼 해 보세요.</p>`},
  levels:[{id:'l1',name:'10의 짝꿍',desc:'빈칸을 채워요',emoji:'🧩',gen:S(5,()=>mkTen('make10'))},
   {id:'l2',name:'가르기',desc:'두 접시로 나눠요',emoji:'🍽️',gen:S(5,()=>mkTen('split'))}]});
})();
