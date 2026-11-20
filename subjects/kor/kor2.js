/* 말콩 더하기 · 끝말잇기, 흉내말, 읽기, 문장 완성, 낱말 묶기 (6~7세 중심) */
'use strict';
(()=>{
const {quiz,sort}=K.TYPES,H=K.hangul;
const ko=t=>`<span class="ko">${t}</span>`;
const syl=s=>({v:s,html:ko(s)});
const big=e=>`<span class="big">${e}</span>`;
const KO=t=>({text:t,lang:'ko-KR',rate:.8});

/* 그림 낱말 */
const W={바나나:'🍌',나비:'🦋',비행기:'✈️',비누:'🧼',나무:'🌳',무지개:'🌈',무당벌레:'🐞',개구리:'🐸',리본:'🎀',오리:'🦆',도토리:'🌰',
 사과:'🍎',과자:'🍪',자동차:'🚗',자전거:'🚲',사자:'🦁',거미:'🕷️',피자:'🍕',자석:'🧲',모자:'🧢',의자:'🪑',수박:'🍉',박수:'👏',버스:'🚌',스키:'⛷️',
 키위:'🥝',하마:'🦛',마스크:'😷',크레파스:'🖍️',우산:'☂️',산타:'🎅',토마토:'🍅',토끼:'🐰',지도:'🗺️',포도:'🍇',도넛:'🍩',호랑이:'🐯',이빨:'🦷',
 거북이:'🐢',오이:'🥒',아기:'👶',기차:'🚂',기린:'🦒',시계:'⏰',계란:'🥚',부엉이:'🦉',피아노:'🎹',노래:'🎤',고구마:'🍠',가방:'🎒',방울:'🔔',
 양말:'🧦',말:'🐴',고래:'🐳',우유:'🥛',치즈:'🧀',당근:'🥕',연필:'✏️',사탕:'🍬',침대:'🛏️',문어:'🐙',펭귄:'🐧',로봇:'🤖',달팽이:'🐌',고양이:'🐱',
 돼지:'🐷',강아지:'🐶',딸기:'🍓',양파:'🧅',버섯:'🍄',우주선:'🚀',구름:'☁️',눈사람:'⛄',선물:'🎁',풍선:'🎈',책:'📚',꽃:'🌸',공:'⚽',곰:'🐻',별:'⭐',달:'🌙'};
/* 끝말잇기 짝 (앞 낱말의 끝 글자 → 뒤 낱말의 첫 글자) */
const CH=[['바나나','나비'],['나비','비행기'],['나비','비누'],['비행기','기차'],['비행기','기린'],['나무','무지개'],['나무','무당벌레'],
 ['무지개','개구리'],['개구리','리본'],['오리','리본'],['도토리','리본'],['사과','과자'],['과자','자동차'],['과자','자전거'],['사자','자전거'],['자전거','거미'],
 ['피자','자석'],['모자','자석'],['의자','자석'],['수박','박수'],['박수','수박'],['버스','스키'],['스키','키위'],['하마','마스크'],['마스크','크레파스'],
 ['크레파스','스키'],['우산','산타'],['토마토','토끼'],['지도','도토리'],['포도','도넛'],['포도','도토리'],['호랑이','이빨'],['거북이','이빨'],['오이','이빨'],
 ['아기','기차'],['아기','기린'],['시계','계란'],['피아노','노래'],['고구마','마스크'],['가방','방울'],['양말','말'],['바나나','나무'],['지도','도넛']];
const last=w=>w[w.length-1];
const pic=w=>({v:w,html:`<span class="em">${W[w]}</span>`,label:w});
const chainOpts=(a,b,n=4)=>{const pool=Object.keys(W).filter(x=>x!==a&&x!==b&&x[0]!==last(a));return K.shuffle([b].concat(K.pickN(pool,n-1))).map(pic)};
const card=w=>`<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px"><span style="font-size:52px;line-height:1">${W[w]}</span><b class="ko" style="font-size:22px">${w}</b></span>`;

function mkChain1(){const [a,b]=K.pick(CH);
  return {type:'quiz',skill:'chain',prompt:`<b>${a}</b>의 끝 글자로 시작하는 낱말을 칸에 놓아요`,show:card(a),listen:KO(a),frame:[0],ans:[b],opts:chainOpts(a,b),
    hints:[`${a}의 <b>맨 끝 글자</b>는 뭘까? 소리 내어 말해 봐.`,()=>{K.speakLang(last(a),'ko-KR',.5);K.say(`끝 글자는 <b>${last(a)}</b>! ${last(a)}로 시작하는 그림을 찾아.`)}],
    line:`맞아! ${a} → ${b}!`,word:b,why:g=>`${g[0]}는 ${g[0][0]}로 시작해. ${last(a)}로 시작해야 해!`}}
/* 두 번 이어 가기: 가 → ? → ? */
function mkChain2(){const st=K.shuffle(CH.slice());for(const [a,b] of st){const nx=CH.filter(x=>x[0]===b&&x[1]!==a);if(!nx.length)continue;const c=K.pick(nx)[1];
    const pool=Object.keys(W).filter(x=>![a,b,c].includes(x)&&x[0]!==last(a)&&x[0]!==last(b));
    return {type:'quiz',skill:'chain2',prompt:`<b>${a}</b>부터 끝말잇기를 두 번 이어 가요`,show:card(a),listen:KO(a),frame:[`<span class="op">${W[a]} →</span>`,0,'<span class="op">→</span>',1],
      ans:[b,c],opts:K.shuffle([b,c].concat(K.pickN(pool,2))).map(pic),
      hints:[`먼저 <b>${last(a)}</b>로 시작하는 낱말을 찾아.`,`그다음엔 그 낱말의 끝 글자로 시작하는 낱말을 찾아!`],line:`맞아! ${a} → ${b} → ${c}!`}}
  return mkChain1()}

/* 흉내말: [문장, 답, 그림, 종류 s=소리 m=모양] */
const MIM=[['강아지가 {} 짖어요','멍멍','🐶','s'],['고양이가 {} 울어요','야옹','🐱','s'],['오리가 {} 울어요','꽥꽥','🦆','s'],['병아리가 {} 울어요','삐약삐약','🐥','s'],
 ['돼지가 {} 울어요','꿀꿀','🐷','s'],['소가 {} 울어요','음매','🐮','s'],['개구리가 {} 울어요','개굴개굴','🐸','s'],['닭이 {} 울어요','꼬끼오','🐓','s'],
 ['시계가 {} 가요','똑딱똑딱','⏰','s'],['문을 {} 두드려요','똑똑','🚪','s'],['비가 {} 내려요','주룩주룩','🌧️','s'],['배가 고파서 {} 소리가 나요','꼬르륵','🍽️','s'],
 ['물을 {} 마셔요','꿀꺽꿀꺽','🥛','s'],['바람이 {} 불어요','쌩쌩','🌬️','s'],['초인종이 {} 울려요','딩동','🔔','s'],['친구가 {} 소리 내어 울어요','엉엉','😭','s'],
 ['토끼가 {} 뛰어요','깡충깡충','🐰','m'],['거북이가 {} 기어가요','엉금엉금','🐢','m'],['오리가 {} 걸어요','뒤뚱뒤뚱','🦆','m'],['별이 {} 빛나요','반짝반짝','⭐','m'],
 ['아기가 {} 웃어요','방긋방긋','👶','m'],['눈이 {} 내려요','펑펑','❄️','m'],['나비가 {} 날아가요','팔랑팔랑','🦋','m'],['뱀이 {} 기어가요','스르르','🐍','m'],
 ['아기가 {} 자요','쌔근쌔근','😴','m'],['공이 {} 튀어 올라요','통통','🏀','m'],['개구리가 연못으로 {} 뛰어들어요','퐁당','🐸','m'],['젤리가 {} 흔들려요','말랑말랑','🍮','m'],
 ['얼음이 {} 차가워요','꽁꽁','🧊','m'],['머리카락이 바람에 {} 날려요','살랑살랑','💨','m']];
const verb=s=>s.split(' ').pop();
function mkMim(kind){const r=K.pick(MIM.filter(x=>x[3]===kind));const [pre,post]=r[0].split('{}');
  const pool=MIM.filter(x=>x!==r&&verb(x[0])!==verb(r[0])&&x[1]!==r[1]).map(x=>x[1]);const opts=K.shuffle([r[1]].concat(K.pickN([...new Set(pool)],3)));
  const full=r[0].replace('{}',r[1]);
  return {type:'quiz',skill:kind==='s'?'mims':'mimm',prompt:kind==='s'?'어떤 <b>소리</b>가 날까요? 알맞은 흉내말을 놓아요':'어떤 <b>모습</b>일까요? 알맞은 흉내말을 놓아요',show:big(r[2]),
    wrapf:true,wide:true,frame:[pre.trim()?`<span>${pre.trim()}</span>`:'',0,`<span>${post.trim()}</span>`].filter(x=>x!==''),ans:[r[1]],opts:opts.map(syl),
    hints:[kind==='s'?`${r[2]} 그림을 보고 그 소리를 직접 흉내 내 봐!`:`${r[2]} 그림이 어떻게 움직이는지 몸으로 흉내 내 봐!`,`넣어서 소리 내어 읽어 봐. 자연스러운 말을 골라!`],
    line:`맞아! ${full}.`,speak:{text:full,lang:'ko-KR',show:full},why:g=>`"${r[0].replace('{}',g[0])}" 소리 내어 읽어 봐. 어색하지?`}}

/* 읽기: 그림 보고 바르게 쓴 낱말 고르기 */
const twist=w=>{for(let t=0;t<20;t++){const i=K.ri(0,w.length-1);const c=K.pick(H.confuse(w[i])||[]);if(!c)continue;const x=w.slice(0,i)+c+w.slice(i+1);if(x!==w)return x}return null};
function mkSpell(jong){const cand=Object.keys(W).filter(w=>w.length>=2&&(jong?w.split('').some(H.hasJong):!w.split('').some(H.hasJong)));const w=K.pick(cand);
  const wr=new Set();for(let t=0;t<30&&wr.size<3;t++){const x=twist(w);if(x&&!W[x])wr.add(x)}
  return {type:'quiz',skill:jong?'spell2':'spell1',prompt:'그림 이름을 <b>바르게</b> 쓴 것을 칸에 놓아요',show:big(W[w]),frame:[0],wide:true,ans:[w],opts:K.shuffle([w,...wr]).map(syl),
    hints:['그림 이름을 천천히 소리 내어 말해 봐. 글자 하나하나 소리를 잘 들어!',()=>{K.speakLang(w,'ko-KR',.5);K.say('천천히 들려줄게. 글자마다 받침이 있는지도 봐!')}],
    line:`맞아! ${w}!`,speak:{text:w,lang:'ko-KR',show:w},why:g=>`${g[0]}는 소리가 조금 달라. 소리 내어 비교해 봐!`}}
/* 읽기: 낱말 읽고 그림 고르기 */
function mkRead(){const w=K.pick(Object.keys(W).filter(x=>x.length>=2));const pool=Object.keys(W).filter(x=>x!==w&&(x[0]===w[0]||last(x)===last(w)||x.length===w.length));
  return {type:'quiz',skill:'readw',prompt:'낱말을 읽고 알맞은 그림을 칸에 놓아요',show:`<span class="word">${w}</span>`,showSm:false,frame:[0],ans:[w],
    opts:K.shuffle([w].concat(K.pickN(pool,3))).map(x=>({v:x,html:`<span class="em">${W[x]}</span>`})),
    hints:['글자를 하나씩 손가락으로 짚으면서 읽어 봐.',()=>{K.speakLang(w[0],'ko-KR',.5);K.say(`첫 글자는 <b>${w[0]}</b>! 이 소리로 시작하는 그림은?`)}],line:`맞아! ${w} ${W[w]}`,speak:{text:w,lang:'ko-KR',show:w}}}

/* 문장 완성: 동작 말 */
const ACT=[['🐦','새가 하늘을 {}','날아요'],['🐟','물고기가 물에서 {}','헤엄쳐요'],['📚','나는 책을 {}','읽어요'],['🥛','아기가 우유를 {}','마셔요'],
 ['👟','운동화를 {}','신어요'],['🧢','모자를 {}','써요'],['👕','옷을 {}','입어요'],['🚲','자전거를 {}','타요'],['🎨','도화지에 그림을 {}','그려요'],
 ['🪥','칫솔로 이를 {}','닦아요'],['🎤','노래를 {}','불러요'],['⚽','공을 발로 {}','차요'],['🛏️','졸려서 침대에서 {}','자요'],['🍚','숟가락으로 밥을 {}','먹어요'],
 ['🧼','비누로 손을 {}','씻어요'],['🐶','강아지가 멍멍 {}','짖어요'],['🎁','친구에게 선물을 {}','줘요'],['🚪','추워서 창문을 {}','닫아요']];
function mkAct(){const r=K.pick(ACT);const [pre]=r[1].split('{}');const pool=[...new Set(ACT.filter(x=>x!==r&&x[2]!==r[2]).map(x=>x[2]))];
  const full=r[1].replace('{}',r[2]);
  return {type:'quiz',skill:'act',prompt:'그림을 보고 문장에 알맞은 말을 놓아요',show:big(r[0]),wrapf:true,wide:true,frame:[`<span>${pre.trim()}</span>`,0],ans:[r[2]],
    opts:K.shuffle([r[2]].concat(K.pickN(pool,3))).map(syl),hints:[`${r[0]} 그림에서 무엇을 하고 있는지 봐.`,'골라서 문장을 처음부터 소리 내어 읽어 봐. 말이 되나?'],
    line:`맞아! ${full}.`,speak:{text:full,lang:'ko-KR',show:full},why:g=>`"${r[1].replace('{}',g[0])}" 이상하지? 다시 읽어 봐.`}}
/* 문장 완성: 장소 */
const PLACE=[['📚','책을 빌리러 {}에 가요','도서관'],['🤒','몸이 아파서 {}에 가요','병원'],['🍞','빵을 사러 {}에 가요','빵집'],['🏊','수영하러 {}에 가요','수영장'],
 ['🛝','미끄럼틀 타러 {}에 가요','놀이터'],['✂️','머리를 자르러 {}에 가요','미용실'],['🦁','사자를 보러 {}에 가요','동물원'],['✉️','편지를 부치러 {}에 가요','우체국'],
 ['🦷','이가 아파서 {}에 가요','치과'],['🐟','생선을 사러 {}에 가요','시장'],['✈️','비행기를 타러 {}에 가요','공항'],['🚂','기차를 타러 {}에 가요','기차역']];
function mkPlace(){const r=K.pick(PLACE);const [pre,post]=r[1].split('{}');const pool=PLACE.filter(x=>x!==r).map(x=>x[2]);const full=r[1].replace('{}',r[2]);
  return {type:'quiz',skill:'place',prompt:'어디에 갈까요? 알맞은 곳을 놓아요',show:big(r[0]),wrapf:true,wide:true,frame:[`<span>${pre.trim()}</span>`,0,`<span>${post.trim()}</span>`],ans:[r[2]],
    opts:K.shuffle([r[2]].concat(K.pickN(pool,3))).map(syl),hints:[`${r[0]} 그림을 봐. 그건 어디에서 할 수 있을까?`,'고른 곳을 넣어서 문장을 소리 내어 읽어 봐.'],
    line:`맞아! ${full}.`,speak:{text:full,lang:'ko-KR',show:full}}}

/* 낱말 묶기 */
const CAT={동물:['🐶 강아지','🐱 고양이','🐰 토끼','🦁 사자','🐘 코끼리','🐸 개구리','🦒 기린','🐻 곰'],과일:['🍎 사과','🍌 바나나','🍇 포도','🍓 딸기','🍉 수박','🍊 귤','🍑 복숭아','🥝 키위'],
 탈것:['🚗 자동차','🚌 버스','🚂 기차','✈️ 비행기','🚲 자전거','🚢 배','🚁 헬리콥터','🚒 소방차'],옷:['👕 티셔츠','👖 바지','👗 치마','🧦 양말','🧢 모자','🧥 외투','🧤 장갑','👟 운동화'],
 채소:['🥕 당근','🥒 오이','🧅 양파','🥔 감자','🌽 옥수수','🥬 배추','🥦 브로콜리','🍆 가지'],학용품:['✏️ 연필','🖍️ 크레파스','📏 자','✂️ 가위','📒 공책','🎒 가방','🧽 지우개','📕 책']};
const CE={동물:'🐾',과일:'🍎',탈것:'🚗',옷:'👕',채소:'🥕',학용품:'✏️'};
function mkCat(){const [a,b]=K.pickN(Object.keys(CAT),2);const it=(c,bin)=>K.pickN(CAT[c],3).map(s=>{const [e,n]=s.split(' ');return {v:n,html:e,label:n,bin}});
  return {type:'sort',skill:'cat',prompt:`<b>${a}</b>${K.josa(a,'와')} <b>${b}</b>${K.josa(b,'로')} 나눠요`,bins:[`${CE[a]} ${a}`,`${CE[b]} ${b}`],items:K.shuffle(it(a,0).concat(it(b,1))),
    hints:[`하나씩 보고 "이건 ${a}일까, ${b}일까?" 물어봐.`,'헷갈리면 이름을 소리 내어 말해 봐.'],line:`잘 나눴어! ${a}, ${b} 척척박사!`}}
/* 무리에 안 맞는 하나 */
function mkOdd(){const [a,b]=K.pickN(Object.keys(CAT),2);const ins=K.pickN(CAT[a],3),o=K.pick(CAT[b]);const sp=s=>s.split(' ');const all=K.shuffle(ins.concat([o]));
  return {type:'quiz',skill:'odd',prompt:'<b>다른 무리</b>인 하나를 칸에 놓아요',frame:[0],ans:[sp(o)[1]],opts:all.map(s=>({v:sp(s)[1],html:`<span class="em">${sp(s)[0]}</span>`,label:sp(s)[1]})),
    hints:['세 개는 같은 무리야. 무슨 무리인지 먼저 찾아 봐.',`세 개는 모두 <b>${a}</b>${K.josa(a,'야')}! 아닌 것은?`],line:`맞아! ${sp(o)[1]}만 ${b}${K.josa(b,'야')}. 나머지는 ${a}!`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('kor',{id:'chain',name:'끝말잇기',desc:'끝 글자로 이어요',emoji:'🔗',color:'#E3F0FF',hello:'끝말잇기 하자! 끝 글자를 잘 들어 봐.',types:{quiz},
  skills:{chain:'끝말잇기 한 번',chain2:'끝말잇기 두 번'},
  tip:{t:'차 안에서도 하는 놀이',b:`<p>끝말잇기는 <b>소리를 쪼개 듣는 힘</b>을 길러요. 차 안이나 밥 먹을 때 말로만 해도 좋아요.</p><div class="say-line">바나나! 나로 시작하는 말은?</div>`},
  levels:[{id:'c1',name:'한 번 잇기',desc:'바나나 → 나비',emoji:'🔗',age:7,gen:S(6,mkChain1)},{id:'c2',name:'두 번 잇기',desc:'나비 → 비누 → 누나',emoji:'⛓️',age:8,gen:S(5,mkChain2)}]});
K.area('kor',{id:'mim',name:'흉내말',desc:'멍멍, 깡충깡충',emoji:'🐾',color:'#FFF1B8',hello:'소리랑 모습을 흉내 내 볼까?',types:{quiz},
  skills:{mims:'소리 흉내말',mimm:'모양 흉내말'},
  tip:{t:'몸으로 흉내 내기',b:`<p>흉내말은 <b>직접 소리 내고 몸으로 따라 하면</b> 오래 기억해요.</p><div class="say-line">토끼는 어떻게 뛰지? 깡충깡충!</div>`},
  levels:[{id:'m1',name:'소리 흉내말',desc:'멍멍, 주룩주룩',emoji:'🔊',age:6,gen:S(6,()=>mkMim('s'))},{id:'m2',name:'모양 흉내말',desc:'깡충깡충, 반짝반짝',emoji:'✨',age:7,gen:S(6,()=>mkMim('m'))}]});
K.area('kor',{id:'read',name:'낱말 읽기',desc:'읽고 고르기, 바른 글자',emoji:'👀',color:'#E3F6E0',hello:'글자를 읽어 볼까?',types:{quiz},
  skills:{readw:'낱말 읽기',spell1:'바른 글자(받침 없음)',spell2:'바른 글자(받침)'},
  tip:{t:'손가락으로 짚으며 읽기',b:`<p>글자 하나에 소리 하나. <b>손가락으로 짚으며</b> 읽게 하면 건너뛰지 않아요.</p>`},
  levels:[{id:'r1',name:'읽고 그림 고르기',desc:'낱말 → 그림',emoji:'🖼️',age:6,gen:S(6,mkRead)},{id:'r2',name:'바르게 쓴 낱말',desc:'나비? 너비? 나미?',emoji:'🔍',age:7,gen:S(6,()=>mkSpell(false))},
   {id:'r3',name:'받침 있는 낱말',desc:'사탕? 사탄? 사닥?',emoji:'🧐',age:8,gen:S(6,()=>mkSpell(true))}]});
K.area('kor',{id:'sent',name:'문장 완성',desc:'알맞은 말 넣기',emoji:'📝',color:'#FFE6F0',hello:'문장을 완성해 볼까?',types:{quiz},
  skills:{act:'움직임 말',place:'장소 말'},
  tip:{t:'다 읽어 보기',b:`<p>빈칸에 넣은 뒤 <b>문장 전체를 소리 내어</b> 읽게 해 주세요. 어색한 말을 스스로 찾아요.</p>`},
  levels:[{id:'s1',name:'무엇을 해요?',desc:'책을 ○○○',emoji:'🏃',age:7,gen:S(6,mkAct)},{id:'s2',name:'어디에 가요?',desc:'아파서 ○○에 가요',emoji:'🏫',age:7,gen:S(6,mkPlace)}]});
K.area('kor',{id:'group',name:'낱말 묶기',desc:'같은 무리끼리',emoji:'🧺',color:'#F0E6FF',hello:'같은 무리끼리 모아 볼까?',types:{quiz,sort},
  skills:{cat:'무리 나누기',odd:'다른 하나 찾기'},
  tip:{t:'왜 그렇게 나눴어?',b:`<p>다 나눈 뒤 <b>"왜 여기에 넣었어?"</b> 하고 물어보면 설명하는 힘이 자라요.</p>`},
  levels:[{id:'g1',name:'두 바구니',desc:'동물과 과일',emoji:'🧺',age:6,gen:S(5,mkCat)},{id:'g2',name:'다른 하나',desc:'무리에 안 맞는 것',emoji:'🙅',age:6,gen:S(6,mkOdd)}]});
})();
