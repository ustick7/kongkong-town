/* 셈콩 2 · 이야기 문제, 묶어 세기, 크기 비교, 모양, 길이 */
'use strict';
(()=>{
const {quiz}=K.TYPES;
K.css(`
.story{font-family:var(--f-body);font-size:19px;line-height:1.65;background:var(--s-cream);border-radius:16px;padding:10px 14px}
.story b{font-family:var(--f-disp);font-weight:400;color:var(--orange-d)}
.pics{display:flex;flex-wrap:wrap;gap:2px 6px;justify-content:center;font-size:30px;font-family:var(--f-emoji);line-height:1.15}
.pics .gap{width:18px}
.pics .out{opacity:.3;position:relative}
.grp{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.grp span{display:flex;flex-wrap:wrap;gap:1px;justify-content:center;border:3px dashed var(--orange);border-radius:14px;padding:4px 6px;font-size:26px;font-family:var(--f-emoji);max-width:96px}
.cmpbox{display:inline-flex;min-width:64px;height:64px;align-items:center;justify-content:center;background:var(--s-blue);border-radius:16px;font-family:var(--f-disp);font-size:34px;color:var(--blue-d)}
.shp{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:330px;margin:0 auto}
.shp svg{width:46px;height:46px}
.bars{display:flex;flex-direction:column;gap:12px;padding:6px 4px}
.bars .bar{display:flex;align-items:center;gap:8px}
.bars .bar b{font-family:var(--f-disp);font-weight:400;font-size:22px;width:26px;text-align:center}
.bars .bar i{display:block;height:24px;border-radius:12px}
.ruler{display:flex;gap:2px}.ruler i{width:28px;height:28px;border-radius:6px;background:var(--s-yellow2);border:2px solid var(--sun)}
`);
const num=n=>({v:n,html:K.numHtml(n)});
const near=(ans,lo,hi,k=5)=>{const pool=[];for(let d=-3;d<=3;d++){const x=ans+d;if(x>=lo&&x<=hi)pool.push(x)}return K.opts(ans,pool,Math.min(k,pool.length)).sort((a,b)=>a-b).map(num)};
const rep=(e,n)=>Array.from({length:n},()=>`<span>${e}</span>`).join('');

/* ---------- 이야기 문제 ---------- */
const ADD=[
 ['🐤','병아리','마리','병아리 {a}마리가 놀고 있었어요. {b}마리가 더 왔어요. 병아리는 모두 몇 마리일까요?'],
 ['🍎','사과','개','바구니에 사과가 {a}개 있어요. 엄마가 {b}개를 더 넣었어요. 사과는 모두 몇 개일까요?'],
 ['🎈','풍선','개','풍선이 {a}개 있어요. 엄마가 풍선 {b}개를 더 사 오셨어요. 풍선은 모두 몇 개일까요?'],
 ['🐟','물고기','마리','어항에 물고기가 {a}마리 있어요. 아빠가 {b}마리를 더 넣었어요. 물고기는 모두 몇 마리일까요?'],
 ['🍪','쿠키','개','나는 쿠키를 {a}개, 동생은 {b}개 먹었어요. 우리가 먹은 쿠키는 모두 몇 개일까요?'],
 ['🚗','자동차','대','주차장에 자동차가 {a}대 있어요. {b}대가 더 들어왔어요. 자동차는 모두 몇 대일까요?'],
 ['🌷','꽃','송이','꽃밭에 꽃이 {a}송이 피어 있었는데, 오늘 {b}송이가 더 피었어요. 꽃은 모두 몇 송이일까요?'],
 ['📚','책','권','어제 책을 {a}권, 오늘 {b}권 읽었어요. 모두 몇 권 읽었을까요?'],
 ['🐰','토끼','마리','토끼 {a}마리가 풀을 먹고 있어요. 토끼 {b}마리가 깡충깡충 왔어요. 토끼는 모두 몇 마리일까요?'],
 ['⭐','스티커','장','칭찬 스티커를 어제 {a}장, 오늘 {b}장 받았어요. 모두 몇 장일까요?'],
];
const SUB=[
 ['🍬','사탕','개','사탕이 {a}개 있었어요. 동생에게 {b}개를 주었어요. 남은 사탕은 몇 개일까요?'],
 ['🐦','새','마리','나무에 새가 {a}마리 앉아 있었어요. {b}마리가 날아갔어요. 남은 새는 몇 마리일까요?'],
 ['🍩','도넛','개','도넛이 {a}개 있었는데 {b}개를 먹었어요. 남은 도넛은 몇 개일까요?'],
 ['🎈','풍선','개','풍선 {a}개 중에서 {b}개가 펑 터졌어요. 남은 풍선은 몇 개일까요?'],
 ['🚌','버스 손님','명','버스에 {a}명이 타고 있었어요. 정류장에서 {b}명이 내렸어요. 버스에 남은 사람은 몇 명일까요?'],
 ['🐸','개구리','마리','연못에 개구리가 {a}마리 있었어요. {b}마리가 퐁당 뛰어나갔어요. 남은 개구리는 몇 마리일까요?'],
 ['🍓','딸기','개','딸기가 {a}개 있었어요. 친구와 {b}개를 나눠 먹었어요. 남은 딸기는 몇 개일까요?'],
 ['🖍️','크레파스','개','크레파스 {a}개 중에 {b}개를 잃어버렸어요. 남은 크레파스는 몇 개일까요?'],
];
const CMP=[
 ['🍎','🍌','사과','바나나','개'],['🐶','🐱','강아지','고양이','마리'],['🚗','🚌','자동차','버스','대'],['🌷','🌻','튤립','해바라기','송이'],['🍪','🍩','쿠키','도넛','개'],
];
const fill=(s,a,b)=>s.replace('{a}',`<b>${a}</b>`).replace('{b}',`<b>${b}</b>`);
const plain=s=>s.replace(/<[^>]+>/g,'');
function mkStory(kind){
  if(kind==='sadd'){const [e,,u,t]=K.pick(ADD);const a=K.ri(2,6),b=K.ri(1,9-a+1),s=a+b;
    return {type:'quiz',skill:'sadd',prompt:'이야기를 읽고 답을 구해요',show:`<div class="story">${fill(t,a,b)}</div><div class="pics">${rep(e,a)}<span class="gap"></span>${rep(e,b)}</div>`,showSm:true,
      frame:[0,`<span class="op">${u}</span>`],ans:[s],opts:near(s,1,20),nums:true,listen:{text:plain(fill(t,a,b)),lang:'ko-KR',rate:.9},
      hints:['"더 왔어요", "모두"라는 말이 있으면 <b>더하기</b>야.',`${a}에서 ${b}만큼 이어서 세어 봐. ${a+1}, ${a+2}…`],line:`맞아! ${a} 더하기 ${b}는 ${s}. 모두 ${s}${u}!`,
      why:g=>g[0]===Math.abs(a-b)?'빼기를 했구나! 더 왔으면 많아져야 해.':''}}
  if(kind==='ssub'){const [e,,u,t]=K.pick(SUB);const a=K.ri(4,10),b=K.ri(1,a-1),r=a-b;
    return {type:'quiz',skill:'ssub',prompt:'이야기를 읽고 답을 구해요',show:`<div class="story">${fill(t,a,b)}</div><div class="pics">${rep(e,r)}${Array.from({length:b},()=>`<span class="out">${e}</span>`).join('')}</div>`,showSm:true,
      frame:[0,`<span class="op">${u}</span>`],ans:[r],opts:near(r,0,20),nums:true,listen:{text:plain(fill(t,a,b)),lang:'ko-KR',rate:.9},
      hints:['"주었어요", "날아갔어요", "남은"이라는 말이 있으면 <b>빼기</b>야.','흐린 그림은 없어진 거야. 진한 것만 세어 봐.'],line:`맞아! ${a} 빼기 ${b}는 ${r}. 남은 건 ${r}${u}!`,
      why:g=>g[0]===a+b?'더하기를 했구나! 주거나 날아가면 줄어들어.':g[0]===b?'없어진 수를 골랐어. 남은 걸 세어야 해.':''}}
  const [e1,e2,n1,n2,u]=K.pick(CMP);let a=K.ri(3,9),b=K.ri(2,9);while(a===b)b=K.ri(2,9);const d=Math.abs(a-b),more=a>b?n1:n2;
  return {type:'quiz',skill:'sdiff',prompt:`${n1}${K.josa(n1,'와')} ${n2} 중 <b>${more}</b>${K.josa(more,'이')} 몇 ${u} 더 많을까요?`,
    show:`<div class="pics" style="justify-content:flex-start">${rep(e1,a)}</div><div class="pics" style="justify-content:flex-start">${rep(e2,b)}</div>`,frame:[0,`<span class="op">${u} 더 많아요</span>`],ans:[d],opts:near(d,0,10),nums:true,
    hints:['위아래를 하나씩 짝지어 봐. <b>짝이 없는 것</b>이 더 많은 만큼이야.',`${Math.max(a,b)}에서 ${Math.min(a,b)}를 빼도 돼.`],line:`맞아! ${a}${u}와 ${b}${u}, ${more}${K.josa(more,'이')} ${d}${u} 더 많아!`,
    why:g=>g[0]===a+b?'모두 더했구나! 얼마나 <b>더 많은지</b>는 차이를 봐야 해.':g[0]===Math.max(a,b)?'더 많은 쪽 전체를 셌어. 짝이 없는 것만 세어 봐.':''}}

/* ---------- 묶어 세기 ---------- */
const GE=['🍒','👟','🧦','🍡','🐞','🌸','🖐️','🍇'];
function mkGroup(by){const g=by===2?K.ri(3,8):by===5?K.ri(2,6):K.ri(2,5);const e=K.pick(GE);const tot=g*by;
  const ask=Math.random()<.5&&by!==10?'groups':'total';
  const show=by===10?`<div class="grp">${Array.from({length:g},()=>`<span style="max-width:120px">${e.repeat(10)}</span>`).join('')}</div>`:`<div class="grp">${Array.from({length:g},()=>`<span>${e.repeat(by)}</span>`).join('')}</div>`;
  if(ask==='groups')return {type:'quiz',skill:'g'+by,prompt:`${by}개씩 묶었어요. <b>몇 묶음</b>일까요?`,show,frame:[0,'<span class="op">묶음</span>'],ans:[g],opts:near(g,1,12),nums:true,
    hints:['점선 동그라미 하나가 한 묶음이야. 동그라미만 세어 봐!','묶음 안의 개수가 아니라 <b>묶음의 수</b>를 세는 거야.'],line:`맞아! ${by}개씩 ${g}묶음!`,why:g2=>g2[0]===tot?'전체 개수를 셌구나! 묶음이 몇 개인지 세어 봐.':''};
  const seq=Array.from({length:g},(_,i)=>(i+1)*by);
  return {type:'quiz',skill:'g'+by,prompt:`${by}씩 뛰어 세면 <b>모두 몇 개</b>일까요?`,show,frame:[0,'<span class="op">개</span>'],ans:[tot],opts:K.opts(tot,[tot-by,tot+by,tot-1,tot+1,tot+2*by].filter(x=>x>0),4).sort((a,b)=>a-b).map(num),nums:true,
    hints:[`묶음 하나에 ${by}개야. ${seq.slice(0,2).join(', ')}… 하고 묶음마다 ${by}씩 세어 봐!`,`묶음은 모두 ${g}개야.`],line:`맞아! ${seq.join(', ')}. 모두 ${tot}개!`,
    why:g2=>g2[0]===g?'묶음 수를 셌구나! 묶음마다 '+by+'개씩 있어.':''}}

/* ---------- 크기 비교 > < = ---------- */
const SIGN=[{v:'>',html:'<span class="ko" style="font-size:36px">&gt;</span>',note:'>'},{v:'<',html:'<span class="ko" style="font-size:36px">&lt;</span>',note:'<'},{v:'=',html:'<span class="ko" style="font-size:36px">=</span>',note:'='}];
function mkSign(hi){const a=K.ri(1,hi);let b=Math.random()<.15?a:K.ri(1,hi);const s=a>b?'>':a<b?'<':'=';
  return {type:'quiz',skill:'sign',prompt:'두 수를 비교해서 &gt;, &lt;, = 중 알맞은 것을 놓아요',frame:[`<span class="cmpbox">${a}</span>`,0,`<span class="cmpbox">${b}</span>`],ans:[s],opts:SIGN,
    hints:['🐊 악어 입은 배고파서 <b>큰 수 쪽</b>으로 크게 벌려!','두 수가 똑같으면 = 를 놓아.'],line:`맞아! ${a} ${s==='>'?'&gt;':s==='<'?'&lt;':'='} ${b}`,
    why:g=>g[0]&&g[0]!=='='&&s!=='='?'방향이 반대야! 벌린 입이 큰 수를 향해야 해.':''}}
function mkBetween(){const a=K.ri(1,17);const b=a+2;return {type:'quiz',skill:'between',prompt:`<b>${a}</b>와 <b>${b}</b> 사이에 있는 수는?`,frame:[`<span class="cmpbox">${a}</span>`,0,`<span class="cmpbox">${b}</span>`],ans:[a+1],opts:near(a+1,0,20,4),nums:true,
  hints:[`${a} 다음에 오는 수를 생각해 봐.`,`${b} 바로 앞의 수이기도 해.`],line:`맞아! ${a}, ${a+1}, ${b}!`}}

/* ---------- 모양 ---------- */
const SH={circle:['동그라미','<circle cx="23" cy="23" r="19"/>'],tri:['세모','<polygon points="23,4 42,40 4,40"/>'],sq:['네모','<rect x="5" y="5" width="36" height="36" rx="3"/>']};
const SCOL=['#FF8A3D','#4A9FE8','#4CB963','#F2665E','#9B7BE0','#FFC845'];
const svg=(k,c)=>`<svg viewBox="0 0 46 46"><g fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="2">${SH[k][1]}</g></svg>`;
const shOpt=k=>({v:k,html:`<span style="display:inline-block;width:40px">${svg(k,'#FFC845')}</span>`,label:SH[k][0]});
function mkShapeCount(){const ks=Object.keys(SH);const target=K.pick(ks);const list=[];const n=K.ri(2,6);for(let i=0;i<n;i++)list.push(target);while(list.length<K.ri(8,11))list.push(K.pick(ks.filter(k=>k!==target)));
  const items=K.shuffle(list);return {type:'quiz',skill:'shcount',prompt:`<b>${SH[target][0]}</b>는 모두 몇 개일까요?`,show:`<div class="shp">${items.map(k=>svg(k,K.pick(SCOL))).join('')}</div>`,frame:[0,'<span class="op">개</span>'],ans:[n],opts:near(n,1,12),nums:true,
    hints:[`색깔은 상관없어! <b>${SH[target][0]}</b> 모양만 찾아봐.`,target==='tri'?'뾰족한 곳(꼭짓점)이 3개인 모양이야.':target==='sq'?'곧은 변이 4개, 뾰족한 곳이 4개인 모양이야.':'뾰족한 곳 없이 둥근 모양이야.'],line:`맞아! ${SH[target][0]}는 ${n}개!`}}
const THINGS=[['🕐','시계','circle'],['🍩','도넛','circle'],['⚽','공','circle'],['🪙','동전','circle'],['🍪','쿠키','circle'],['🎯','과녁','circle'],['🌕','보름달','circle'],
 ['📦','상자','sq'],['🖼️','액자','sq'],['🪟','창문','sq'],['🧇','와플','sq'],['📺','텔레비전','sq'],['🎁','선물 상자','sq'],
 ['🍙','삼각김밥','tri'],['⚠️','조심 표지판','tri'],['🍕','피자 한 조각','tri'],['⛺','텐트','tri'],['🔺','빨간 세모','tri']];
function mkThing(){const t=K.pick(THINGS);return {type:'quiz',skill:'shthing',prompt:`<b>${t[1]}</b>는 어떤 모양을 닮았나요?`,show:`<span class="big">${t[0]}</span>`,frame:[0],ans:[t[2]],opts:Object.keys(SH).map(shOpt),
  hints:['물건의 테두리를 손가락으로 따라 그려 봐!','뾰족한 곳이 몇 개 있는지 세어 봐. 없으면 동그라미야.'],line:`맞아! ${t[1]}는 ${SH[t[2]][0]} 모양을 닮았어!`}}

/* ---------- 길이 ---------- */
const BCOL=['#FF8A3D','#4A9FE8','#4CB963','#F2665E','#9B7BE0'];
function mkLong(){const n=3;const lens=K.pickN([3,4,5,6,7,8,9],n);const ask=K.pick(['long','short']);const ans=ask==='long'?Math.max(...lens):Math.min(...lens);const lab=['가','나','다'];
  const left=K.ri(0,1);
  return {type:'quiz',skill:'len',prompt:`가장 <b>${ask==='long'?'긴':'짧은'}</b> 막대는 어느 것일까요?`,show:`<div class="bars" style="width:100%">${lens.map((l,i)=>`<div class="bar"><b>${lab[i]}</b><i style="width:${l*30}px;margin-left:${left&&i===1?18:0}px;background:${BCOL[i]}"></i></div>`).join('')}</div>`,frame:[0],ans:[lab[lens.indexOf(ans)]],
    opts:lab.map(x=>({v:x,html:`<span class="ko" style="font-size:30px">${x}</span>`})),hints:['막대의 <b>시작하는 곳</b>이 같은지 먼저 봐!','끝이 가장 '+(ask==='long'?'멀리':'가까이')+' 간 막대를 찾아.'],line:'맞아! 잘 비교했어!'}}
function mkUnit(){const n=K.ri(3,8);const t=K.pick([['✏️','연필'],['🖍️','크레파스'],['🥢','젓가락'],['🪥','칫솔']]);
  return {type:'quiz',skill:'unit',prompt:`${t[1]}의 길이는 작은 칸 몇 개만큼일까요?`,show:`<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;margin:0 auto"><b style="font-size:15px">${t[0]} ${t[1]}</b><i style="display:block;height:20px;width:${n*30}px;border-radius:10px;background:${K.pick(BCOL)}"></i><div class="ruler">${'<i></i>'.repeat(n)}</div></div>`,
    frame:[0,'<span class="op">칸</span>'],ans:[n],opts:near(n,1,12),nums:true,hints:['막대 아래의 노란 칸을 하나씩 세어 봐.','막대 끝까지 칸이 몇 개 있는지 손가락으로 짚어 봐.'],line:`맞아! 칸 ${n}개만큼 길어!`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('math',{id:'story',name:'이야기 문제',desc:'읽고 더하기·빼기',emoji:'📖',color:'#E3F6E0',hello:'이야기를 잘 듣고 몇 개인지 알아볼까?',types:{quiz},
  skills:{sadd:'더하기 이야기',ssub:'빼기 이야기',sdiff:'몇 개 더 많은지'},
  tip:{t:'말 속의 힌트 찾기',b:`<p>"더 왔어요, 모두"는 더하기, "주었어요, 남은"은 빼기예요. 🔊로 이야기를 들려주고, 아이가 <b>어떤 말 때문에</b> 더하기라고 생각했는지 말해 보게 해 주세요.</p><div class="say-line">이야기에서 늘어났어, 줄어들었어?</div>`},
  levels:[{id:'s1',name:'더하기 이야기',desc:'더 왔어요, 모두',emoji:'➕',age:7,gen:S(6,()=>mkStory('sadd'))},
   {id:'s2',name:'빼기 이야기',desc:'주었어요, 남은',emoji:'➖',age:7,gen:S(6,()=>mkStory('ssub'))},
   {id:'s3',name:'몇 개 더 많을까',desc:'짝짓기로 비교',emoji:'⚖️',age:7,gen:S(6,()=>mkStory('sdiff'))},
   {id:'s4',name:'섞어서',desc:'더하기? 빼기?',emoji:'🔀',age:8,gen:S(8,i=>mkStory(K.pick(['sadd','ssub','sadd','ssub','sdiff'])))}]});
K.area('math',{id:'group',name:'묶어 세기',desc:'2씩, 5씩, 10씩',emoji:'🧺',color:'#FFF1B8',hello:'하나씩 세면 오래 걸려! 묶어서 세어 볼까?',types:{quiz},
  skills:{g2:'2씩 묶어 세기',g5:'5씩 묶어 세기',g10:'10씩 묶어 세기'},
  tip:{t:'짝짝 세기',b:`<p>양말, 신발처럼 <b>짝</b>이 있는 물건으로 2씩 세기를 연습해 보세요. 손가락 한 손은 5, 두 손은 10이에요.</p>`},
  levels:[{id:'g1',name:'2씩 세기',desc:'둘, 넷, 여섯',emoji:'🧦',age:7,gen:S(6,()=>mkGroup(2))},{id:'g2',name:'5씩 세기',desc:'다섯, 열',emoji:'🖐️',age:7,gen:S(6,()=>mkGroup(5))},{id:'g3',name:'10씩 세기',desc:'열, 스물, 서른',emoji:'🔟',age:8,gen:S(5,()=>mkGroup(10))}]});
K.area('math',{id:'cmp',name:'크기 비교',desc:'>, <, = 와 사이의 수',emoji:'🐊',color:'#E3F0FF',hello:'악어 입은 큰 수 쪽으로! 비교해 볼까?',types:{quiz},
  skills:{sign:'> < = 비교',between:'사이의 수'},
  tip:{t:'악어 입',b:`<p>&gt;, &lt;는 <b>벌린 쪽이 큰 수</b>예요. 악어가 큰 수를 먹으려고 입을 벌린다고 알려 주면 잘 기억해요.</p>`},
  levels:[{id:'c1',name:'10까지 비교',desc:'악어 입 놓기',emoji:'🐊',age:7,gen:S(6,()=>mkSign(10))},{id:'c2',name:'20까지 비교',desc:'두 자리 수',emoji:'🐲',age:8,gen:S(6,()=>mkSign(20))},{id:'c3',name:'사이의 수',desc:'5와 7 사이는?',emoji:'↔️',age:7,gen:S(6,mkBetween)}]});
K.area('math',{id:'shape',name:'모양',desc:'동그라미, 세모, 네모',emoji:'🔺',color:'#FFE6F0',hello:'여러 가지 모양을 찾아볼까?',types:{quiz},
  skills:{shcount:'모양 세기',shthing:'물건의 모양'},
  tip:{t:'주변에서 모양 찾기',b:`<p>집 안에서 동그라미, 세모, 네모 모양을 찾아보는 놀이를 해 보세요. 색깔과 크기가 달라도 같은 모양이라는 걸 아는 게 중요해요.</p>`},
  levels:[{id:'h1',name:'모양 세기',desc:'색이 달라도 같은 모양',emoji:'🟡',age:6,gen:S(6,mkShapeCount)},{id:'h2',name:'물건의 모양',desc:'시계는 무슨 모양?',emoji:'🕐',age:6,gen:S(6,mkThing)}]});
K.area('math',{id:'measure',name:'길이 재기',desc:'길다, 짧다, 몇 칸',emoji:'📏',color:'#F0E6FF',hello:'누가 더 길까? 재어 볼까?',types:{quiz},
  skills:{len:'길이 비교',unit:'칸으로 재기'},
  tip:{t:'끝을 맞추고 재기',b:`<p>길이를 비교할 때는 <b>한쪽 끝을 맞추는 것</b>이 중요해요. 시작 위치가 다른 막대도 섞여 있어요.</p>`},
  levels:[{id:'m1',name:'어느 것이 길까',desc:'가장 긴 것, 짧은 것',emoji:'📐',age:6,gen:S(6,mkLong)},{id:'m2',name:'몇 칸일까',desc:'칸으로 길이 재기',emoji:'📏',age:7,gen:S(6,mkUnit)}]});
})();
