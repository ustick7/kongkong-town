/* 위콩 · 우리나라 위인 (이름과 한 일 익히기, 시대 순서, 이름 따라 말하기) */
'use strict';
(()=>{
const {quiz,say}=K.TYPES;
K.css(`
.hero-card{display:flex;flex-direction:column;align-items:center;gap:4px;background:var(--s-cream);border-radius:18px;padding:10px 12px;width:100%}
.hero-card .big{font-size:64px;line-height:1.1}
.hero-card .nm{font-family:var(--f-disp);font-size:34px;color:var(--ink)}
.hero-card .ds{font-size:18px;line-height:1.5;text-align:center;font-family:var(--f-body)}
.hero-card .era{font-size:13px;padding:2px 10px;border-radius:999px;background:var(--s-orange);color:var(--orange-d);font-family:var(--f-disp)}
.stk .tag2{font-family:var(--f-disp);font-size:17px;line-height:1.25;color:var(--ink);max-width:130px;text-align:center}
.stuck .tag2{font-family:var(--f-disp);font-size:18px;color:var(--ink)}
.stk .hn{font-family:var(--f-disp);font-size:24px;color:var(--ink)}
.stuck .hn{font-size:26px;color:var(--ink)}
`);
const ERA=['고조선','삼국·남북국','고려','조선','근대·독립'];
/* [이름, 그림, 시대, 짧은 한 일(스티커), 설명] */
const H=[
 ['단군왕검','🏔️',0,'첫 나라 고조선','우리 민족의 첫 나라, 고조선을 세웠어요.'],
 ['주몽','🏹',1,'고구려를 세움','활을 아주 잘 쏘았고, 고구려를 세웠어요. 동명왕이라고도 해요.'],
 ['온조왕','🏯',1,'백제를 세움','주몽의 아들로, 남쪽으로 내려와 백제를 세웠어요.'],
 ['박혁거세','🥚',1,'신라를 세움','알에서 태어났다는 이야기가 있고, 신라를 세웠어요.'],
 ['광개토대왕','🐎',1,'고구려 땅 넓힘','고구려의 땅을 아주 넓게 넓힌 왕이에요.'],
 ['을지문덕','⚔️',1,'살수대첩','고구려 장군으로, 살수에서 수나라 대군을 물리쳤어요.'],
 ['선덕여왕','🔭',1,'첨성대','신라의 첫 여왕이에요. 별을 살피는 첨성대가 이때 세워졌어요.'],
 ['계백','🛡️',1,'황산벌 싸움','백제 장군으로, 황산벌에서 끝까지 나라를 지키려고 싸웠어요.'],
 ['김유신','🗡️',1,'삼국 통일','신라 장군으로, 삼국을 하나로 통일하는 데 큰 힘이 되었어요.'],
 ['원효대사','💧',1,'해골 물 깨달음','해골에 담긴 물을 마시고 큰 깨달음을 얻은 스님이에요.'],
 ['대조영','🏰',1,'발해를 세움','고구려가 망한 뒤 발해를 세웠어요.'],
 ['장보고','⛵',1,'청해진, 바다의 왕','청해진을 만들어 해적을 막고 바다 무역을 이끌었어요.'],
 ['최치원','📜',1,'뛰어난 글솜씨','신라의 학자로, 글을 아주 잘 써서 이름을 떨쳤어요.'],
 ['왕건','👑',2,'고려를 세움','후삼국을 하나로 모으고 고려를 세웠어요.'],
 ['서희','🗣️',2,'말로 거란을 물리침','싸우지 않고 말(담판)로 거란을 돌려보내고 땅까지 얻었어요.'],
 ['강감찬','⭐',2,'귀주대첩','거란군을 귀주에서 크게 물리친 고려의 장군이에요.'],
 ['김부식','📚',2,'삼국사기','삼국의 역사를 담은 책, 삼국사기를 썼어요.'],
 ['일연','📖',2,'삼국유사','단군 이야기가 담긴 책, 삼국유사를 썼어요.'],
 ['문익점','🌱',2,'목화씨','목화씨를 들여와서 사람들이 따뜻한 솜옷을 입게 되었어요.'],
 ['최무선','💥',2,'화약과 화포','화약과 화포를 만들어 바다의 왜구를 물리쳤어요.'],
 ['최영','🪙',2,'황금 보기를 돌같이','"황금 보기를 돌같이 하라"는 말을 지킨 청렴한 장군이에요.'],
 ['정몽주','🌸',2,'고려를 끝까지 지킴','단심가를 지어 고려에 대한 마음을 끝까지 지킨 충신이에요.'],
 ['이성계','🏹',3,'조선을 세움','고려 장군이었고, 조선을 세웠어요.'],
 ['세종대왕','✍️',3,'한글을 만듦','백성을 위해 한글(훈민정음)을 만든 왕이에요.'],
 ['장영실','⏲️',3,'측우기, 해시계','비의 양을 재는 측우기와 해시계, 물시계를 만든 과학자예요.'],
 ['황희','⚖️',3,'청렴한 정승','오랫동안 백성을 아끼며 나라 일을 한 정승이에요.'],
 ['신사임당','🎨',3,'그림과 글씨','그림과 글씨를 잘한 예술가이고, 율곡 이이의 어머니예요.'],
 ['이황','📘',3,'퇴계, 큰 학자','퇴계라고 불린 큰 학자예요. 천 원짜리 지폐에 있어요.'],
 ['이이','📗',3,'율곡, 큰 학자','율곡이라고 불린 큰 학자예요. 오천 원짜리 지폐에 있어요.'],
 ['이순신','🐢',3,'거북선','거북선을 만들고 바다에서 왜군을 물리친 장군이에요.'],
 ['권율','🧱',3,'행주대첩','행주산성에서 왜군을 크게 물리친 장군이에요.'],
 ['곽재우','🧥',3,'붉은 옷 의병장','붉은 옷을 입고 싸운 의병장, 홍의장군이에요.'],
 ['허준','💊',3,'동의보감','아픈 사람을 고치는 법을 모은 책, 동의보감을 쓴 의사예요.'],
 ['한석봉','🖌️',3,'명필, 글씨','글씨를 아주 잘 쓴 명필이에요. 어머니와 떡 썰기 이야기가 있어요.'],
 ['김홍도','🤼',3,'씨름 그림','씨름, 서당처럼 사람들의 생활을 그린 화가예요.'],
 ['정약용','🏗️',3,'거중기','무거운 돌을 드는 거중기를 만들어 수원 화성을 쌓는 데 썼어요.'],
 ['김정호','🗺️',3,'대동여지도','우리나라 지도, 대동여지도를 만들었어요.'],
 ['김정희','🖋️',3,'추사체','추사체라는 멋진 글씨체를 만든 학자예요.'],
 ['지석영','💉',4,'종두법','천연두를 막는 종두법을 널리 알렸어요.'],
 ['주시경','🔤',4,'한글 연구','한글을 연구하고 널리 가르친 학자예요.'],
 ['안중근','🚉',4,'하얼빈 의거','나라를 되찾으려고 하얼빈 역에서 싸운 독립운동가예요.'],
 ['안창호','🏫',4,'교육으로 힘을','배우고 힘을 길러야 나라를 되찾는다고 가르친 독립운동가예요.'],
 ['유관순','🇰🇷',4,'대한 독립 만세','3·1 운동 때 "대한 독립 만세"를 외친 독립운동가예요.'],
 ['방정환','🎈',4,'어린이날','어린이를 아끼자며 어린이날을 만들었어요.'],
 ['김구','📕',4,'임시정부, 백범일지','대한민국 임시정부를 이끈 독립운동가예요. 백범일지를 썼어요.'],
 ['윤봉길','🕊️',4,'상하이 의거','상하이에서 나라의 독립을 위해 싸운 독립운동가예요.'],
 ['손기정','🏃',4,'올림픽 마라톤 금메달','베를린 올림픽 마라톤에서 금메달을 딴 선수예요.'],
];
const of=eras=>H.filter(h=>eras.includes(h[2]));
const nameOpt=h=>({v:h[0],html:`<span class="hn">${h[0]}</span>`,note:h[0]});
const tagOpt=h=>({v:h[0],html:`<span class="em">${h[1]}</span><span class="tag2">${h[3]}</span>`,note:h[3]});
const card=(h,{name=true,desc=true}={})=>`<div class="hero-card"><span class="era">${ERA[h[2]]}</span><span class="big em">${h[1]}</span>${name?`<span class="nm">${h[0]}</span>`:''}${desc?`<span class="ds">${h[4]}</span>`:''}</div>`;
const pickOthers=(h,pool,n)=>{const same=pool.filter(x=>x!==h&&x[2]===h[2]);const rest=pool.filter(x=>x!==h&&x[2]!==h[2]);return K.pickN(same,Math.min(n,same.length)).concat(K.pickN(rest,n)).slice(0,n)};

/* 누가 했을까? (한 일 → 이름) */
function mkWho(pool,skill){const h=K.pick(pool);const opts=K.shuffle([h].concat(pickOthers(h,H,3)));
  return {type:'quiz',skill,word:h[0],prompt:'이 일을 한 위인은 누구일까요?',show:card(h,{name:false}),frame:[0],ans:[h[0]],opts:opts.map(nameOpt),wide:true,speak:{text:h[0],lang:'ko-KR',show:h[0]},
    hints:[`${ERA[h[2]]} 때 사람이야. 노래에서 그 시대에 나오는 위인을 떠올려 봐!`,`이름이 <b>${h[0][0]}</b>(으)로 시작해.`],line:`맞아! ${h[0]}! ${h[4]}`,
    why:g=>{const o=H.find(x=>x[0]===g[0]);return o?`${o[0]}${K.josa(o[0],'은')} '${o[3]}'로 유명해.`:''}}}
/* 무엇을 했을까? (이름 → 한 일) */
function mkWhat(pool,skill){const h=K.pick(pool);const opts=K.shuffle([h].concat(pickOthers(h,H,2)));
  return {type:'quiz',skill,word:h[0],prompt:`<b>${h[0]}</b>${K.josa(h[0],'은')} 무엇을 했을까요?`,listen:{text:h[0],lang:'ko-KR',rate:.85},show:`<span class="word">${h[0]}</span>`,frame:[0],ans:[h[0]],opts:opts.map(tagOpt),wide:true,speak:{text:h[0],lang:'ko-KR',show:h[0]},
    hints:[`${h[0]}${K.josa(h[0],'은')} <b>${ERA[h[2]]}</b> 때 사람이야.`,`그림 힌트: ${h[1]}`],line:`맞아! ${h[4]}`,
    why:g=>{const o=H.find(x=>x[0]===g[0]);return o?`그건 ${o[0]}${K.josa(o[0],'이')} 한 일이야.`:''}}}
/* 누가 먼저? (시대 순서) */
function mkOrder(){let hs;for(let t=0;t<30;t++){hs=K.pickN(H,3);if(new Set(hs.map(h=>h[2])).size===3)break}
  const sorted=hs.slice().sort((a,b)=>a[2]-b[2]||H.indexOf(a)-H.indexOf(b));
  return {type:'quiz',skill:'order',prompt:'<b>먼저 살았던</b> 위인부터 순서대로 놓아요',frame:[0,'→',1,'→',2],ans:sorted.map(h=>h[0]),opts:K.shuffle(hs).map(h=>({v:h[0],html:`<span class="em">${h[1]}</span><span class="hn" style="font-size:18px">${h[0]}</span>`,note:h[0]})),join:' → ',
    hints:[`시대 순서: ${ERA.join(' → ')}. 각 위인이 어느 시대인지 떠올려 봐!`,`${sorted[0][0]}${K.josa(sorted[0][0],'은')} ${ERA[sorted[0][2]]} 때 사람이야.`],
    line:`맞아! ${sorted.map(h=>`${h[0]}(${ERA[h[2]]})`).join(' → ')}`}}
/* 이름 따라 말하기 */
function mkTalk(pool){const h=K.pick(pool);return {type:'say',skill:'talk',word:h[0],prompt:'위인 이름을 듣고 <b>크게 따라 말해요</b>',show:card(h),talk:{text:h[0],lang:'ko-KR',show:h[0]},line:`잘했어! ${h[0]}! ${h[3]}!`}}

const mix=(pool,sk)=>()=>K.makeSet(6,i=>i%2?mkWhat(pool,sk):mkWho(pool,sk));
K.area('hero',{id:'who',name:'위인 이름 익히기',desc:'누가 무엇을 했을까?',emoji:'🦸',color:'#FFE6F0',hello:'노래에 나오는 위인들, 누가 무엇을 했는지 알아볼까?',types:{quiz,say},
  skills:{h0:'나라를 세운 사람',h1:'삼국·남북국 위인',h2:'고려 위인',h3:'조선 위인',h4:'근대·독립운동가',talk:'이름 따라 말하기'},
  tip:{t:'노래와 함께',b:`<p>아이가 부르는 위인 노래는 <b>시대 순서</b>대로 되어 있어요. 노래를 부르다 멈추고 "이 사람은 뭘 했지?"라고 물어보면 이름과 한 일이 함께 기억돼요.</p><div class="say-line">세종대왕은 뭘 만들었지? 우리가 지금 쓰는 글자!</div><p>문제를 맞히면 위인 이름을 소리 내어 따라 말하게 해요.</p>`},
  levels:[{id:'l0',name:'나라를 세운 사람',desc:'단군, 주몽, 왕건…',emoji:'👑',gen:()=>K.makeSet(6,i=>{const pool=H.filter(h=>/세움|첫 나라/.test(h[3]));return i%2?mkWhat(pool,'h0'):mkWho(pool,'h0')})},
   {id:'l1',name:'삼국 시대',desc:'고구려, 백제, 신라',emoji:'🏹',gen:mix(of([0,1]),'h1')},
   {id:'l2',name:'고려 시대',desc:'강감찬, 문익점…',emoji:'🏺',gen:mix(of([2]),'h2')},
   {id:'l3',name:'조선 시대',desc:'세종대왕, 이순신…',emoji:'📜',gen:mix(of([3]),'h3')},
   {id:'l4',name:'나라를 되찾은 사람들',desc:'유관순, 김구…',emoji:'🇰🇷',gen:mix(of([4]),'h4')},
   {id:'l5',name:'이름 크게 말하기',desc:'듣고 따라 말해요 🎤',emoji:'🗣️',gen:()=>K.makeSet(6,()=>mkTalk(H))}]});
K.area('hero',{id:'time',name:'누가 먼저?',desc:'시대 순서대로',emoji:'⏳',color:'#FFF1B8',hello:'누가 먼저 살았을까? 노래 순서를 떠올려 봐!',types:{quiz},
  skills:{order:'시대 순서'},
  tip:{t:'시대 순서',b:`<p>${ERA.join(' → ')} 순서예요. 노래 가사 순서가 거의 이 순서라서 노래를 떠올리면 도움이 돼요.</p>`},
  levels:[{id:'l1',name:'세 명 줄 세우기',desc:'먼저 산 사람부터',emoji:'🧑‍🤝‍🧑',gen:()=>K.makeSet(5,mkOrder)}]});
})();
