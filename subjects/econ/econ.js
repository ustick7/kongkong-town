/* 돈콩 · 경제 (동전 세기, 값 치르기, 거스름돈, 필요한 것과 갖고 싶은 것) */
'use strict';
(()=>{
const {quiz,sort}=K.TYPES;
K.css(`
.coin{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-family:var(--f-disp);color:#5A4630;box-shadow:inset 0 0 0 3px rgba(0,0,0,.12),0 3px 0 rgba(0,0,0,.15);vertical-align:middle;flex:none}
.coin.c10{width:42px;height:42px;font-size:15px;background:radial-gradient(circle at 35% 30%,#F3C79A,#C98A52)}
.coin.c50{width:46px;height:46px;font-size:15px;background:radial-gradient(circle at 35% 30%,#F4F4F4,#B9BCC2)}
.coin.c100{width:50px;height:50px;font-size:15px;background:radial-gradient(circle at 35% 30%,#FAFAFA,#AEB3BA)}
.coin.c500{width:56px;height:56px;font-size:16px;background:radial-gradient(circle at 35% 30%,#FFFFFF,#A2A8B0)}
.coin.c1000{width:86px;height:44px;border-radius:8px;font-size:16px;background:linear-gradient(135deg,#BFE3C2,#86C48C);color:#245A2B}
.coins{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;max-width:420px;margin:0 auto}
.price{display:inline-flex;align-items:center;gap:6px;background:var(--s-yellow);border:3px solid var(--sun);border-radius:16px;padding:4px 12px;font-family:var(--f-disp);font-size:26px}
.price .em{font-size:40px}
.wallet{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;background:var(--s-tray);border-radius:22px;padding:10px}
.wallet button{appearance:none;border:0;background:none;padding:2px;cursor:pointer;border-radius:50%}
.wallet button:active{transform:scale(.92)}
.paid{min-height:70px;border:3px dashed var(--blue);border-radius:18px;background:var(--s-blue);padding:8px}
.paid .coin{cursor:pointer}
.sum{font-family:var(--f-disp);font-size:20px;text-align:center;color:var(--blue-d)}
.shelf{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
`);
const won=n=>n.toLocaleString('ko-KR')+'원';
const coin=v=>`<span class="coin c${v}">${v>=1000?v.toLocaleString():v}</span>`;
const coinsHtml=list=>`<div class="coins">${list.sort((a,b)=>b-a).map(coin).join('')}</div>`;
const amt=n=>({v:n,html:`<span class="ko" style="font-size:24px">${won(n)}</span>`});
const amtOpts=(ans,step,k=4)=>{const s=new Set([ans]);let t=0;while(s.size<k&&t++<50){const d=K.pick([-2,-1,1,2])*step;if(ans+d>0)s.add(ans+d)}return K.shuffle([...s]).map(amt)};
const ITEMS=[['🍬','사탕'],['🍭','막대사탕'],['🍪','쿠키'],['🧃','주스'],['✏️','연필'],['🎈','풍선'],['🍦','아이스크림'],['🥛','우유'],['🍙','주먹밥'],['📒','공책'],['🧸','곰 인형'],['🚗','장난감 차'],['🍞','빵'],['🧩','퍼즐'],['🖍️','크레파스']];

/* 동전 세기 */
function mkCount(kind){const set={c10:[10],c50:[10,50],c100:[10,50,100],c500:[100,500,50,10]}[kind];const n=K.ri(3,kind==='c10'?7:6);
  const list=Array.from({length:n},()=>K.pick(set));const tot=list.reduce((a,b)=>a+b,0);
  return {type:'quiz',skill:kind,prompt:'동전은 모두 얼마일까요?',show:coinsHtml(list),showSm:true,frame:[0],ans:[tot],opts:amtOpts(tot,kind==='c500'?100:10),wide:true,
    hints:['<b>큰 동전</b>부터 세어 봐. 같은 동전끼리 묶으면 쉬워!',kind==='c10'?'10원짜리는 10, 20, 30… 하고 <b>10씩 뛰어</b> 세어.':'100원짜리는 100씩, 50원짜리는 50씩, 10원짜리는 10씩 이어서 세어 봐.'],
    line:`맞아! 모두 ${won(tot)}!`,why:g=>g[0]===list.length*10?'동전 <b>개수</b>만 셌구나! 동전마다 쓰인 숫자를 더해야 해.':''}}

/* 값 치르기: 지갑에서 동전을 눌러 내요 */
function pay(p,G){const paid=[];
  G.html(`<div class="qline"><span class="tag q">문제</span>${p.min?'<b>가장 적은 동전</b>으로 ':''}딱 맞게 돈을 내요</div>
   <div style="text-align:center"><span class="price"><span class="em">${p.item[0]}</span>${p.item[1]} ${won(p.price)}</span></div>
   <div class="paid" data-k="paid"><div class="coins" id="paidc"></div></div>${p.showSum?'<div class="sum" id="sum"></div>':''}
   <div class="wallet" id="wal">${p.coins.map(v=>`<button data-v="${v}" aria-label="${v}원">${coin(v)}</button>`).join('')}</div>
   <div class="muted" style="text-align:center;font-size:14px">지갑의 동전을 누르면 내고, 낸 동전을 누르면 다시 돌아와요</div>`);
  G.hideTray();
  const draw=()=>{K.$('#paidc').innerHTML=paid.map((v,i)=>`<span data-i="${i}">${coin(v)}</span>`).join('')||'<span class="muted">여기에 동전이 놓여요</span>';if(p.showSum)K.$('#sum').textContent='낸 돈: '+won(paid.reduce((a,b)=>a+b,0));G.edit()};
  K.$('#wal').onclick=e=>{const b=e.target.closest('button');if(!b||G.P.done)return;if(paid.length>=15){K.say('동전이 너무 많아!');return}paid.push(+b.dataset.v);K.sfx.drop();draw()};
  K.$('#paidc').onclick=e=>{const s=e.target.closest('[data-i]');if(!s||G.P.done)return;paid.splice(+s.dataset.i,1);K.sfx.pick();draw()};
  const best=minCoins(p.price,p.coins);
  G.answer({ready:()=>paid.length>0,hints:[p.min?'<b>큰 동전</b>부터 내 봐. 큰 동전을 쓸수록 동전 수가 적어져!':'큰 동전부터 내고, 모자라면 작은 동전을 더해 봐.','낸 동전을 큰 것부터 더해 보면서 <b>얼마 남았는지</b> 생각해 봐. 남은 만큼만 더 내면 돼!'],
    check:()=>{const s=paid.reduce((a,b)=>a+b,0);const note=`${won(s)} (${paid.length}개)`;
      if(s!==p.price)return {ok:false,note,why:s>p.price?`${won(s-p.price)} 더 냈어. 조금 빼 볼까?`:`${won(p.price-s)} 모자라!`};
      if(p.min&&paid.length>best)return {ok:false,note,why:`돈은 딱 맞아! 그런데 동전 ${best}개로도 낼 수 있어. 큰 동전으로 바꿔 볼까?`};
      return {ok:true,line:`딱 맞게 냈어! ${p.item[1]} 샀다!`}}});
  draw();G.P.edits=0;G.say(p.min?'동전 개수를 가장 적게 해서 내 봐!':'지갑의 동전을 눌러서 딱 맞게 내 봐!');
}
function minCoins(n,coins){const cs=coins.slice().sort((a,b)=>b-a);let c=0;for(const v of cs){c+=Math.floor(n/v);n%=v}return c}
function mkPay(kind){const it=K.pick(ITEMS);if(kind==='pay1')return {type:'pay',skill:'pay',item:it,price:K.ri(2,9)*10,coins:[10,50],showSum:true};
  if(kind==='pay2')return {type:'pay',skill:'pay',item:it,price:K.ri(11,49)*10,coins:[10,50,100]};
  return {type:'pay',skill:'paymin',item:it,price:K.pick([60,70,80,150,160,180,230,260,350,560,610,780]),coins:[10,50,100,500],min:true}}

/* 거스름돈 */
function mkChange(kind){const it=K.pick(ITEMS);let give,price;if(kind==='ch1'){give=100;price=K.ri(1,9)*10}else{give=K.pick([500,1000]);price=K.ri(1,give/100-1)*100+(Math.random()<.5?50:0)}
  const ch=give-price;
  return {type:'quiz',skill:kind,prompt:`${won(give)}을 내고 ${it[1]}${K.josa(it[1],'을')} 샀어요. 거스름돈은 얼마일까요?`,show:`<div class="shelf" style="align-items:center">${coin(give)}<span class="op" style="font-size:20px">내고</span><span class="price"><span class="em">${it[0]}</span>${won(price)}</span></div>`,frame:[0],ans:[ch],opts:amtOpts(ch,kind==='ch1'?10:100),wide:true,
    hints:['낸 돈에서 물건값을 <b>빼면</b> 거스름돈이야.',`${won(price)}에서 ${won(give)}까지 ${kind==='ch1'?'10원':'100원'}씩 <b>이어 세어</b> 봐.`],line:`맞아! ${won(give)} − ${won(price)} = ${won(ch)}`,
    why:g=>g[0]===price?'그건 물건값이야! 돌려받는 돈을 찾아야 해.':''}}

/* 필요한 것 / 갖고 싶은 것 */
const NEED=[['💧','물'],['🍚','밥'],['🪥','칫솔'],['👕','옷'],['💊','약'],['🧼','비누'],['👟','신발'],['🛏️','이불'],['📒','공책'],['🥛','우유']];
const WANT=[['🧸','인형'],['🎮','게임기'],['🍭','사탕'],['🎈','풍선'],['🤖','로봇 장난감'],['🍦','아이스크림'],['🦄','스티커'],['🪀','요요'],['🎠','놀이공원'],['🍫','초콜릿']];
function mkNeed(){const items=K.pickN(NEED,3).map(x=>({v:x[1],html:x[0],label:x[1],bin:0})).concat(K.pickN(WANT,3).map(x=>({v:x[1],html:x[0],label:x[1],bin:1})));
  return {type:'sort',skill:'need',prompt:'꼭 <b>필요한 것</b>과 <b>갖고 싶은 것</b>으로 나눠요',bins:['꼭 필요해요 ✅','갖고 싶어요 💭'],items:K.shuffle(items),
    hints:['이게 <b>없으면</b> 생활하기 힘들까? 그러면 꼭 필요한 거야.','없어도 괜찮지만 있으면 신나는 건 갖고 싶은 거야.'],line:'잘 나눴어! 돈은 꼭 필요한 것부터 쓰는 거야.'}}
function mkCheap(){const its=K.pickN(ITEMS,3);const pr=K.pickN([150,200,250,300,350,400,450,500,600,700,800],3);const m=Math.min(...pr),i=pr.indexOf(m);
  return {type:'quiz',skill:'cheap',prompt:'가장 <b>싼</b> 물건을 칸에 놓아요',show:`<div class="shelf">${its.map((x,j)=>`<span class="price"><span class="em">${x[0]}</span>${won(pr[j])}</span>`).join('')}</div>`,showSm:true,frame:[0],ans:[its[i][1]],
    opts:its.map(x=>({v:x[1],html:`<span class="em">${x[0]}</span>`,label:x[1]})),hints:['싸다는 건 돈이 <b>적게</b> 든다는 뜻이야.','값에서 백의 자리 숫자를 먼저 비교해 봐.'],line:`맞아! ${its[i][1]}${K.josa(its[i][1],'이')} ${won(m)}으로 가장 싸!`}}
function mkCan(){const have=K.pick([300,500,700,1000]);const its=K.pickN(ITEMS,6);const pr=its.map(()=>K.ri(1,12)*100);
  if(!pr.some(x=>x<=have))pr[0]=have-100;if(!pr.some(x=>x>have))pr[1]=have+200;
  return {type:'sort',skill:'can',prompt:`내 돈은 <b>${won(have)}</b>이에요. 살 수 있는 것과 없는 것을 나눠요`,show:coinsHtml(have===1000?[1000]:have===700?[500,100,100]:have===500?[500]:[100,100,100]),bins:['살 수 있어요 🛒','못 사요 🙅'],
    items:its.map((x,j)=>({v:x[1],html:x[0],label:`${x[1]} ${won(pr[j])}`,bin:pr[j]<=have?0:1})),hints:[`물건값이 ${won(have)}보다 <b>작거나 같으면</b> 살 수 있어.`,'백의 자리 숫자를 내 돈과 비교해 봐.'],line:'잘했어! 가진 돈 안에서 고르는 게 똑똑한 소비야.'}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('econ',{id:'coin',name:'동전 세기',desc:'모두 얼마일까?',emoji:'🪙',color:'#FFF1B8',hello:'동전이 모두 얼마인지 세어 볼까?',types:{quiz},
  skills:{c10:'10원 세기',c50:'50원 섞어 세기',c100:'100원까지 세기',c500:'500원까지 세기'},
  tip:{t:'큰 동전부터',b:`<p>아이들은 <b>동전 개수</b>를 세는 실수를 많이 해요. 동전마다 쓰인 숫자를 보고 큰 동전부터 묶어서 세게 해 주세요.</p><p>진짜 동전으로 놀아 보면 더 좋아요.</p>`},
  levels:[{id:'l1',name:'10원 세기',desc:'10씩 뛰어 세요',emoji:'🟤',gen:S(5,()=>mkCount('c10'))},
   {id:'l2',name:'50원 섞기',desc:'50과 10',emoji:'⚪',gen:S(5,()=>mkCount('c50'))},
   {id:'l3',name:'100원까지',desc:'100, 50, 10',emoji:'💯',gen:S(5,()=>mkCount('c100'))},
   {id:'l4',name:'500원까지',desc:'큰 동전',emoji:'💰',gen:S(5,()=>mkCount('c500'))}]});
K.area('econ',{id:'shop',name:'콩콩 가게',desc:'값 치르기, 거스름돈',emoji:'🏪',color:'#E3F6E0',hello:'콩콩 가게에 어서 와! 물건을 사 볼까?',types:{pay,quiz},
  skills:{pay:'딱 맞게 내기',paymin:'적은 동전으로 내기',ch1:'100원 거스름돈',ch2:'큰돈 거스름돈'},
  tip:{t:'가게 놀이',b:`<p>값을 딱 맞게 내기 → 적은 동전으로 내기 → 거스름돈 순서로 어려워져요. 집에서 가게 놀이를 하면 금방 늘어요.</p><div class="say-line">100원을 냈는데 70원짜리를 사면 얼마를 돌려받아?</div>`},
  levels:[{id:'l1',name:'딱 맞게 내기',desc:'10원, 50원',emoji:'🍬',gen:S(5,()=>mkPay('pay1'))},
   {id:'l2',name:'100원도 써요',desc:'조금 비싼 물건',emoji:'🧃',gen:S(5,()=>mkPay('pay2'))},
   {id:'l3',name:'적은 동전으로',desc:'큰 동전부터',emoji:'🧠',gen:S(5,()=>mkPay('min'))},
   {id:'l4',name:'거스름돈 (100원)',desc:'얼마 돌려받지?',emoji:'🔁',gen:S(5,()=>mkChange('ch1'))},
   {id:'l5',name:'거스름돈 (큰돈)',desc:'500원, 1000원',emoji:'💵',gen:S(5,()=>mkChange('ch2'))}]});
K.area('econ',{id:'smart',name:'똑똑한 소비',desc:'필요한 것 먼저',emoji:'🛒',color:'#FFE6F0',hello:'돈을 어떻게 쓰면 좋을까?',types:{quiz,sort},
  skills:{need:'필요와 욕구 구분',cheap:'값 비교',can:'예산 안에서 고르기'},
  tip:{t:'필요한 것과 갖고 싶은 것',b:`<p>경제 교육의 첫걸음은 <b>꼭 필요한 것</b>과 <b>갖고 싶은 것</b>을 나누는 거예요. 정답이 하나가 아닐 수 있으니 아이의 이유를 들어 주세요.</p><div class="say-line">이게 없으면 어떻게 될까?</div>`},
  levels:[{id:'l1',name:'필요해? 갖고 싶어?',desc:'두 바구니로',emoji:'🧺',gen:S(4,mkNeed)},
   {id:'l2',name:'가장 싼 물건',desc:'값 비교하기',emoji:'🏷️',gen:S(5,mkCheap)},
   {id:'l3',name:'살 수 있을까?',desc:'내 돈 안에서',emoji:'👛',gen:S(4,mkCan)}]});
})();
