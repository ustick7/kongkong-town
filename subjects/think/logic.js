/* 생각콩 · 자리 추리 (단서 맞추기) */
(()=>{
const {E,N}=K;
K.css(`
.bench{display:flex;justify-content:center;gap:8px;padding:10px 8px 18px;background:linear-gradient(transparent 70%,#E2C49A 70%,#E2C49A 82%,transparent 82%);border-radius:14px}
.seat{flex:1 1 0;max-width:80px;min-width:0;height:84px;border-radius:16px 16px 6px 6px;background:var(--s-cream);border:3px dashed var(--blue);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;cursor:pointer}
.seat .em{font-size:42px;line-height:1}
.seat .lb{position:absolute;bottom:-22px;font-size:12px;color:var(--muted);white-space:nowrap}
.seat.full{border-style:solid;border-color:#D9B27A;background:var(--s-orange)}
.tower{display:flex;flex-direction:column-reverse;align-items:center;gap:0;margin:0 auto;width:min(240px,100%)}
.tower .seat{max-width:none;flex:none;width:100%;height:70px;border-radius:0;flex-direction:row;gap:10px;border-width:3px;border-bottom-width:0}
.tower .seat:first-child{border-bottom-width:3px}
.tower .seat .lb{position:static;font-size:15px;color:var(--muted);width:44px}
.tower .roof2{width:110%;height:34px;background:var(--red);clip-path:polygon(50% 0,100% 100%,0 100%)}
.clues{display:flex;flex-direction:column;gap:6px}
.clue{display:flex;align-items:center;gap:8px;background:var(--s-cream);border-radius:14px;padding:8px 10px;font-size:17px;line-height:1.4;transition:background .3s}
.clue b{color:var(--orange-d);font-weight:400}
.clue .st{flex:none;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--line);color:#fff;font-size:17px}
.clue.ok{background:var(--s-green)}.clue.ok .st{background:var(--green)}
.clue.no{background:var(--s-red)}.clue.no .st{background:var(--red)}
`);
function perms(a){if(a.length<=1)return [a];return a.flatMap((x,i)=>perms(a.slice(0,i).concat(a.slice(i+1))).map(r=>[x].concat(r)))}
const posName=(n,i,floor)=>floor?(i===n-1?'맨 위층':(i+1)+'층'):n===3?['맨 왼쪽','가운데','맨 오른쪽'][i]:['맨 왼쪽','왼쪽 둘째','오른쪽 둘째','맨 오른쪽'][i];
function clueText(c,n,floor){const P=i=>posName(n,i,floor);
  switch(c.t){
   case 'pos':return `[${c.k}|은] <b>${P(c.i)}</b>에 있어요.`;
   case 'notpos':return `[${c.k}|은] ${P(c.i)}에 <b>없어요</b>.`;
   case 'next':return floor?`[${c.a}|와] [${c.b}|은] <b>바로 위아래 층</b>이에요.`:`[${c.a}|와] [${c.b}|은] <b>나란히</b> 앉아요.`;
   case 'notnext':return floor?`[${c.a}|와] [${c.b}|은] 바로 위아래 층이 <b>아니에요</b>.`:`[${c.a}|와] [${c.b}|은] 나란히 앉지 <b>않아요</b>.`;
   case 'before':return floor?`[${c.a}|은] [${c.b}]보다 <b>위층</b>에 살아요.`:`[${c.a}|은] [${c.b}]보다 <b>왼쪽</b>에 앉아요.`;
   case 'end':return `[${c.k}|은] <b>맨 끝</b>에 앉아요.`;
  }}
/* 배치 arr에서 단서 확인: true / false / null(아직 모름) */
function test(c,arr){const at=k=>arr.indexOf(k);const has=k=>at(k)>=0;
  switch(c.t){
   case 'pos':return has(c.k)?at(c.k)===c.i:(arr[c.i]?false:null);
   case 'notpos':return has(c.k)?at(c.k)!==c.i:null;
   case 'next':return has(c.a)&&has(c.b)?Math.abs(at(c.a)-at(c.b))===1:null;
   case 'notnext':return has(c.a)&&has(c.b)?Math.abs(at(c.a)-at(c.b))!==1:null;
   case 'before':return has(c.a)&&has(c.b)?(arr.floorMode?at(c.a)>at(c.b):at(c.a)<at(c.b)):null;
   case 'end':return has(c.k)?(at(c.k)===0||at(c.k)===arr.length-1):null;
  }}
function seat(p,G){
  const n=p.who.length,floor=p.layout==='floor';
  const seats=Array.from({length:n},(_,i)=>`<div class="seat" data-drop="s${i}" data-i="${i}"><span class="lb">${floor?(i+1)+'층':posName(n,i,false)}</span></div>`).join('');
  G.html(`<div class="qline"><span class="tag q">문제</span>${floor?'단서를 보고 누가 몇 층에 사는지 맞혀요':'단서를 보고 누가 어디에 앉는지 맞혀요'}</div>
   ${floor?`<div class="tower" id="seats">${seats}<div class="roof2"></div></div>`:`<div class="bench" id="seats">${seats}</div>`}
   <div class="clues" id="clues">${p.clues.map((c,i)=>`<div class="clue" data-c="${i}"><span class="st">${i+1}</span><span>${K.fmt(clueText(c,n,floor)).html}</span></div>`).join('')}</div>`);
  G.stickers(p.who.map(k=>({v:k,html:`<span class="em">${E(k)}</span>`,label:N(k)})),'동물을 끌어다 자리에 놓아요. 다른 자리로 옮겨도 되고, 자리를 누르면 비워져요');
  const arr=Array(n).fill(null);arr.floorMode=floor;
  const seatEl=i=>G.board.querySelector(`.seat[data-i="${i}"]`);
  const clearMarks=()=>G.board.querySelectorAll('.clue').forEach((el,i)=>{el.classList.remove('ok','no');el.querySelector('.st').textContent=i+1});
  const paint=()=>{for(let i=0;i<n;i++){const s=seatEl(i);s.querySelectorAll('.em').forEach(x=>x.remove());s.classList.toggle('full',!!arr[i]);if(arr[i])s.insertAdjacentHTML('afterbegin',`<span class="em pop">${E(arr[i])}</span>`)}
    G.tray.querySelectorAll('.stk').forEach(st=>st.style.opacity=arr.includes(st.dataset.v)?'.35':'1');clearMarks();G.edit()};
  G.board.addEventListener('click',e=>{const s=e.target.closest('.seat');if(!s||G.P.done||K.$('.stk.sel'))return;const i=+s.dataset.i;if(arr[i]){arr[i]=null;K.sfx.pick();paint()}});
  G.drop((pl,d)=>{if(pl.kind!=='stk'||!d||d[0]!=='s')return;const i=+d.slice(1),j=arr.indexOf(pl.v);if(j>=0)arr[j]=null;arr[i]=pl.v;K.sfx.drop();paint()});
  const sure=p.clues.findIndex(c=>c.t==='pos');
  G.answer({ready:()=>arr.every(Boolean),hints:[
     ()=>{G.hl(G.board.querySelector(`.clue[data-c="${sure}"]`));G.say('<b>확실한 단서</b>부터 찾아봐! 반짝이는 단서는 자리를 딱 알려 줘.')},
     ()=>{G.hl(null);G.say('자리를 하나 정했으면, 남은 자리가 몇 개인지 세어 봐. 다른 단서를 읽고 남은 자리에 하나씩 넣어 보자!')}],
    check:()=>{let bad=0;p.clues.forEach((c,i)=>{const r=test(c,arr);const el=G.board.querySelector(`.clue[data-c="${i}"]`);el.classList.toggle('ok',r===true);el.classList.toggle('no',r!==true);el.querySelector('.st').textContent=r===true?'✓':'✗';if(r!==true)bad++});
      return bad?{ok:false,note:arr.map(K.E).join(' ')+' 순서',why:`단서 ${bad}개가 맞지 않아(빨간 ✗). 그 단서를 다시 읽어 볼까?`,mark:K.$('#clues')}
        :{ok:true,line:'정답! 단서가 모두 ✓ 가 됐어. 하나씩 따져 보니까 풀렸지?'}}});
  paint();G.P.edits=0;
  if(p.guided)G.guide([
    {say:'탐정 놀이야! 아래 <b>단서</b>를 잘 읽고 동물들 자리를 찾아 주자.',act:()=>G.hl('#clues')},
    {say:'다 앉히고 <b>다 했어요</b>를 누르면 단서마다 ✓ 나 ✗가 나와. 모두 ✓면 정답이야!',act:()=>G.hl(null)},
    {say:'<b>확실한 단서</b>부터 해 보자! 자리를 딱 알려 주는 단서가 뭘까?',act:()=>G.hl(G.board.querySelector(`.clue[data-c="${sure}"]`))}]);
  else G.say(p.say||'단서를 하나씩 읽고 동물들을 자리에 놓아 봐! 확실한 단서부터!');
}
/* 답이 하나뿐인 단서 묶음 만들기 */
function mkSeat(n,floor,maxClues){
  const who=K.pickN(['rabbit','bear','cat','dog','pig','chick','fox','frog','panda','lion','mouse','ele'],n);
  for(let t=0;t<200;t++){const sol=K.shuffle(who);sol.floorMode=floor;const cand=[];
    sol.forEach((k,i)=>{cand.push({t:'notpos',k,i:(i+K.ri(1,n-1))%n})});
    for(let a=0;a<n;a++)for(let b=a+1;b<n;b++){const A=sol[a],B=sol[b];cand.push(Math.abs(a-b)===1?{t:'next',a:A,b:B}:{t:'notnext',a:A,b:B});cand.push(floor?{t:'before',a:B,b:A}:{t:'before',a:A,b:B})}
    if(!floor)sol.forEach((k,i)=>{if(i===0||i===n-1)cand.push({t:'end',k})});
    const pi=K.ri(0,n-1);const clues=[{t:'pos',k:sol[pi],i:pi}];
    const all=perms(who).map(x=>{x.floorMode=floor;return x});const cnt=cs=>all.filter(a=>cs.every(c=>test(c,a))).length;
    for(const c of K.shuffle(cand)){if(cnt(clues)===1)break;const before=cnt(clues);if(cnt(clues.concat(c))<before)clues.push(c)}
    if(cnt(clues)===1&&clues.length<=maxClues)return {type:'seat',who,layout:floor?'floor':'',clues:K.shuffle(clues),skill:floor?'floor':n>3?'seat4':'seat3'}}
  return {type:'seat',who:['rabbit','bear','cat'],clues:[{t:'pos',k:'rabbit',i:0},{t:'next',a:'cat',b:'rabbit'}],skill:'seat3'}}
const W=(...a)=>a;
K.area('think',{id:'logic',name:'자리 추리',desc:'단서를 보고 자리를 찾아요',emoji:'🕵️',color:'#E8DEFF',
  hello:'꼬마 탐정 놀이야! 단서를 보고 동물들 자리를 찾아 줘.',types:{seat},
  tip:{t:'확실한 단서부터',b:`<p>추리 문제는 단서를 <b>한 번에 하나씩</b> 쓰는 연습이에요. 단서를 모두 머리에 담으려 하면 막혀요.</p>
<div class="say-line">자리를 딱 알려 주는 단서가 어떤 거야? 그것부터 놓아 보자.</div>
<div class="say-line">남은 자리는 몇 개야? 다음 단서를 읽고 넣어 볼까?</div>
<p>게임에서는 단서마다 ✓/✗가 바로 표시돼서, 틀린 단서를 스스로 찾을 수 있어요. 집에서 인형이나 가족으로 "누가 어디 앉을까" 놀이를 해 봐도 좋아요.</p>`},
  skills:{seat3:'단서 3자리',floor:'위아래 순서',seat4:'단서 4자리'},
  levels:[
   {id:'l1',name:'의자 세 개',desc:'세 동물의 자리를 찾아요',emoji:'🪑',gen:()=>[{type:'seat',who:['rabbit','bear','cat'],guided:true,clues:[{t:'pos',k:'rabbit',i:0},{t:'next',a:'cat',b:'rabbit'}],skill:'seat3'}].concat(K.makeSet(4,()=>mkSeat(3,false,3)))},
   {id:'l2',name:'동물 아파트',desc:'누가 몇 층에 살까요?',emoji:'🏢',gen:()=>K.makeSet(4,i=>Object.assign(mkSeat(3,true,3),i===0?{say:'이번엔 아파트야! 1층이 맨 아래야.'}:{}))},
   {id:'l3',name:'의자 네 개',desc:'단서가 더 많아져요',emoji:'🕵️',gen:()=>K.makeSet(4,()=>mkSeat(4,false,4))}
  ]});
})();
