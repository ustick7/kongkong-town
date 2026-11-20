/* 돈콩 더하기 · 저금통: 100원씩 세기, 1000원 만들기, 모으기 이야기 */
'use strict';
(()=>{
const {quiz}=K.TYPES;
const won=n=>n.toLocaleString('ko-KR')+'원';
const coin=v=>`<span class="coin c${v}">${v>=1000?v.toLocaleString():v}</span>`;
const wonOpt=n=>({v:n,html:`<span class="ko" style="font-size:19px">${won(n)}</span>`});
const near100=(a,lo=100,hi=1500)=>{const pool=[];for(let d=-3;d<=3;d++){const x=a+d*100;if(d&&x>=lo&&x<=hi)pool.push(x)}return K.shuffle([a].concat(K.pickN(pool,3))).sort((x,y)=>x-y).map(wonOpt)};

function mk100(){const n=K.ri(3,10);
  return {type:'quiz',skill:'by100',prompt:'100원짜리가 모두 얼마일까요?',show:`<div class="coins" style="max-width:300px;margin:0 auto">${coin(100).repeat(n)}</div>`,frame:[0],wide:true,ans:[n*100],opts:near100(n*100),
    hints:['100, 200, 300… 하나 짚을 때마다 100씩 커져.',`동전이 ${n}개니까 ${n}백 원!`],line:`맞아! 100원이 ${n}개면 ${won(n*100)}!`}}
function mkTo1000(){const n=K.ri(3,9);const need=10-n;const pool=[];for(let i=1;i<=9;i++)if(i!==need&&Math.abs(i-need)<=3)pool.push(i);
  return {type:'quiz',skill:'to1000',prompt:`1,000원을 모으려면 100원짜리가 <b>몇 개 더</b> 필요할까요?`,show:`<div class="coins" style="max-width:300px;margin:0 auto">${coin(100).repeat(n)}${'<span class="coin c100" style="opacity:.25">?</span>'.repeat(0)}</div><div class="muted" style="margin-top:6px;font-size:15px">지금 ${won(n*100)} · 목표 1,000원 ${coin(1000)}</div>`,
    frame:[0,'<span class="op">개</span>'],ans:[need],nums:true,opts:K.shuffle([need].concat(K.pickN(pool,3))).sort((a,b)=>a-b).map(x=>({v:x,html:K.numHtml(x)})),
    hints:['100원짜리 <b>10개</b>가 1,000원이야.',`지금 ${n}개 있어. 10이 되려면 몇 개 더?`],line:`맞아! ${n}개에 ${need}개를 더하면 10개, 1,000원!`}}
const GOAL=[['🍦','아이스크림',600],['🧃','주스',500],['🍫','초콜릿',700],['🖍️','크레파스',900],['🎈','풍선',400],['🍪','과자',800]];
function mkSave(){const [e,nm,price]=K.pick(GOAL);const per=100;const days=price/per;const pool=[];for(let i=2;i<=10;i++)if(i!==days&&Math.abs(i-days)<=3)pool.push(i);
  return {type:'quiz',skill:'save',prompt:`하루에 100원씩 저금통에 넣어요. <b>${nm}</b>(${won(price)})을 사려면 며칠 모아야 할까요?`,show:`<span class="big">🐷</span><span class="big">${e}</span>`,
    frame:[0,'<span class="op">일</span>'],ans:[days],nums:true,opts:K.shuffle([days].concat(K.pickN(pool,3))).sort((a,b)=>a-b).map(x=>({v:x,html:K.numHtml(x)})),
    hints:['첫날 100원, 둘째 날 200원… 날마다 100원씩 늘어나.',`${won(price)}이 될 때까지 손가락을 펴며 세어 봐.`],line:`맞아! ${days}일 모으면 ${nm}${K.josa(nm,'을')} 살 수 있어. 기다리면 살 수 있어!`}}
function mkWait(){const [e,nm,price]=K.pick(GOAL);const have=K.pick([100,200,300]);const need=price-have;
  return {type:'quiz',skill:'more',prompt:`${coin(100).repeat(have/100)} 지금 ${won(have)} 있어요. <b>${nm}</b>(${won(price)})을 사려면 얼마가 더 필요할까요?`,show:`<span class="big">${e}</span>`,frame:[0],wide:true,ans:[need],opts:near100(need),
    hints:['값에서 지금 가진 돈을 빼면 돼.',`${won(have)}에서 100원씩 세어 올라가 봐: ${have+100}, ${have+200}…`],line:`맞아! ${won(need)} 더 모으면 돼!`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('econ',{id:'save',name:'저금통',desc:'모으면 살 수 있어요',emoji:'🐷',color:'#E3F0FF',hello:'저금통에 돈을 모아 볼까?',types:{quiz},
  skills:{by100:'100원씩 세기',to1000:'1000원 만들기',save:'며칠 모을까',more:'얼마 더 필요할까'},
  tip:{t:'기다리는 힘',b:`<p>갖고 싶은 것을 <b>모아서 사는 경험</b>은 참는 힘을 길러요. 실제 저금통에 날마다 넣고 달력에 표시해 보세요.</p>`},
  levels:[{id:'v1',name:'100원씩 세기',desc:'100, 200, 300…',emoji:'🪙',age:7,gen:S(6,mk100)},{id:'v2',name:'1,000원 만들기',desc:'몇 개 더?',emoji:'💵',age:7,gen:S(5,mkTo1000)},
   {id:'v3',name:'모아서 사기',desc:'며칠? 얼마 더?',emoji:'🐷',age:8,gen:S(6,()=>K.pick([mkSave,mkWait])())}]});
})();
