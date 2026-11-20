/* 말콩 · 국어 (첫소리, 글자 나누고 모으기, 빠진 글자, 반대말) */
'use strict';
(()=>{
const {quiz}=K.TYPES,H=K.hangul;
const WD={사과:'🍎',나비:'🦋',기차:'🚂',가방:'🎒',나무:'🌳',모자:'🧢',바나나:'🍌',사자:'🦁',우유:'🥛',자동차:'🚗',치즈:'🧀',토끼:'🐰',포도:'🍇',하마:'🦛',고래:'🐳',
 딸기:'🍓',오리:'🦆',거북이:'🐢',기린:'🦒',피자:'🍕',버스:'🚌',시계:'⏰',의자:'🪑',호랑이:'🐯',코끼리:'🐘',토마토:'🍅',햄버거:'🍔',고양이:'🐱',개구리:'🐸',돼지:'🐷',
 수박:'🍉',양말:'🧦',우산:'☂️',비행기:'✈️',눈사람:'⛄',연필:'✏️',사탕:'🍬',바지:'👖',치마:'👗',물고기:'🐟',문어:'🐙',당근:'🥕',라면:'🍜',로봇:'🤖',침대:'🛏️',
 케이크:'🎂',트럭:'🚚',펭귄:'🐧',다람쥐:'🐿️',달팽이:'🐌',모기:'🦟',나팔:'🎺',부엉이:'🦉',피아노:'🎹',기타:'🎸',라디오:'📻'};
const WORDS=Object.keys(WD);
const ONE={소:'🐮',게:'🦀',새:'🐦',해:'🌞',배:'🍐',코:'👃',개:'🐕',비:'🌧️',무:'🥬',차:'🍵'};
const ONEB={곰:'🐻',달:'🌙',별:'⭐',꽃:'🌸',공:'⚽',책:'📚',문:'🚪',발:'🦶',손:'✋',귤:'🍊',밤:'🌰',양:'🐑',말:'🐴',뱀:'🐍',빵:'🍞',산:'⛰️',집:'🏠',옷:'👕',콩:'🫘',불:'🔥',물:'💧',눈:'⛄',돈:'💰'};
const BASIC='ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ'.split(''),VOW='ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅐㅔ'.split('');
const ko=t=>`<span class="ko">${t}</span>`;
const jamo=j=>({v:j,html:ko(j)}),syl=s=>({v:s,html:ko(s)});
const big=e=>`<span class="big">${e}</span>`;

/* 그림 이름의 첫소리 */
function mkCho(){const w=K.pick(WORDS.filter(x=>BASIC.includes(H.cho(x[0]))||H.cho(x[0])==='ㄸ'));const c=H.cho(w[0]);
  return {type:'quiz',skill:'cho',prompt:'그림 이름의 <b>첫소리</b>를 칸에 놓아요',show:big(WD[w]),listen:{text:w,lang:'ko-KR',rate:.8},frame:[0],ans:[c],
    opts:K.opts(c,BASIC.concat(['ㄸ']),4).map(jamo),
    hints:[`그림 이름을 소리 내어 말해 봐. 맨 처음 글자 <b>${w[0]}</b>는 무슨 소리로 시작할까?`,()=>{K.speakLang(w[0],'ko-KR',.5);K.say(`첫 글자만 천천히 들려줄게. ${w[0]}!`)}],
    line:`맞아! ${w}의 첫소리는 ${c}!`,why:g=>`${g[0]}로 시작하면 다른 낱말이 돼. 첫 글자 ${w[0]}를 잘 봐!`}}
/* 글자 나누기 (자음 + 모음 [+ 받침]) */
function mkSplit(bat){const src=bat?ONEB:ONE;const s=K.pick(Object.keys(src));const [a,b,c]=H.dec(s);const parts=[H.CHO[a],H.JUNG[b]].concat(c?[H.JONG[c]]:[]);
  const cons=K.pickN(BASIC.filter(x=>!parts.includes(x)),2),vows=K.pickN(VOW.filter(x=>!parts.includes(x)),2);
  const uniq=[...new Set(parts.concat(cons,vows))];
  const frame=c?['<span class="op">'+s+' = </span>',0,'+',1,'+',2]:['<span class="op">'+s+' = </span>',0,'+',1];
  return {type:'quiz',skill:bat?'split2':'split1',prompt:`<b>${s}</b> 글자를 ${c?'자음, 모음, 받침':'자음과 모음'}으로 나눠요`,show:big(src[s]),frame,ans:parts,opts:K.shuffle(uniq).map(jamo),join:' + ',
    hints:[`모음은 ㅏ, ㅗ처럼 <b>짧은 막대</b>가 있는 글자야. ${s}에 있는 막대는?`,c?`받침은 글자 <b>맨 아래</b>에 있는 자음이야.`:`첫소리를 길게 말해 봐. ${s}~ 하면 무슨 소리가 먼저 나?`],
    line:`맞아! ${parts.join(' + ')} = ${s}`}}
/* 글자 모으기 */
function mkJoin(){const pool=Object.keys(ONE).concat(Object.keys(ONEB));const s=K.pick(pool);const [a,b,c]=H.dec(s);const parts=[H.CHO[a],H.JUNG[b]].concat(c?[H.JONG[c]]:[]);
  const wrong=K.pickN(H.confuse(s),3);
  return {type:'quiz',skill:'join',prompt:'자음과 모음을 모으면 어떤 글자가 될까요?',frame:parts.flatMap((x,i)=>i?['+',ko(x)]:[ko(x)]).concat(['=',0]),
    ans:[s],opts:K.shuffle([s].concat(wrong)).map(syl),
    hints:[`${parts[0]} 소리에 ${parts[1]} 소리를 붙여서 읽어 봐.`,c?`받침 <b>${parts[2]}</b>가 있는 글자를 찾아!`:'받침이 <b>없는</b> 글자를 찾아!'],line:`맞아! ${s}!`}}
/* 빠진 글자 */
function mkMiss(){const w=K.pick(WORDS.filter(x=>x.length>=2));const i=K.ri(0,w.length-1),s=w[i];
  const wrong=K.pickN(H.confuse(s),3);while(wrong.length<3){const x=K.pick('가나다라마바사아자차카타파하'.split(''));if(x!==s&&!wrong.includes(x))wrong.push(x)}
  return {type:'quiz',skill:'miss',prompt:'그림 이름에서 빠진 글자를 칸에 놓아요',show:big(WD[w]),listen:{text:w,lang:'ko-KR',rate:.8},
    tight:true,frame:w.split('').map((x,j)=>j===i?0:`<span class="word">${x}</span>`),ans:[s],opts:K.shuffle([s].concat(wrong)).map(syl),
    hints:['🔊를 눌러 그림 이름을 들어 봐. 빈칸 자리에 무슨 소리가 났어?','받침이 있는지 없는지 잘 들어 봐!'],line:`맞아! ${w}!`,
    why:g=>`${w.split('').map((x,j)=>j===i?g[0]:x).join('')}? 소리 내어 읽어 봐. 이상하지?`}}
/* 반대말 */
const OPP=[['크다','작다','🐘','🐭'],['길다','짧다','🦒','🐁'],['많다','적다','🍪🍪🍪','🍪'],['무겁다','가볍다','🏋️','🪶'],['뜨겁다','차갑다','🔥','🧊'],['높다','낮다','🏔️','🏠'],
 ['빠르다','느리다','🐇','🐢'],['밝다','어둡다','🌞','🌙'],['열다','닫다','📂','📁'],['웃다','울다','😄','😢'],['위','아래','⬆️','⬇️'],['앞','뒤','👦','🔙'],
 ['기쁘다','슬프다','😊','😭'],['넓다','좁다','🏟️','🚪'],['깨끗하다','더럽다','🛁','🐷'],['들어가다','나오다','🚪','🏃'],['새것','헌것','✨','🧦'],['덥다','춥다','🌞','⛄']];
function mkOpp(){const r=K.pick(OPP);const flip=Math.random()<.5;const q=flip?r[1]:r[0],a=flip?r[0]:r[1],qe=flip?r[3]:r[2],ae=flip?r[2]:r[3];
  const pool=OPP.filter(x=>x!==r).map(x=>x[K.ri(0,1)]);const opts=K.shuffle([a,q].concat(K.pickN(pool,2)));
  return {type:'quiz',skill:'opp',prompt:`<b>${q}</b>의 반대말을 칸에 놓아요`,show:`<span class="big">${qe}</span><span class="word">${q}</span>`,showSm:false,frame:[0],ans:[a],opts:opts.map(syl),
    hints:[`${q}의 <b>반대</b> 모습을 떠올려 봐. ${q}는 ${qe}! 그 반대는?`,'같은 말을 고르면 안 돼! 정반대인 말을 찾아.'],line:`맞아! ${q} ↔ ${a}`,
    why:g=>g[0]===q?'그건 같은 말이야! 반대말을 찾아야 해.':''}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('kor',{id:'sound',name:'첫소리',desc:'ㄱ, ㄴ, ㄷ으로 시작해요',emoji:'🔈',color:'#E3F6E0',hello:'그림 이름이 무슨 소리로 시작할까?',types:{quiz},
  skills:{cho:'첫소리 듣기'},
  tip:{t:'소리를 길게 말하기',b:`<p>"사~과"처럼 첫소리를 <b>길게</b> 말해 주면 아이가 자음 소리를 잘 들어요.</p><div class="say-line">사과는 무슨 소리로 시작해? 스~</div>`},
  levels:[{id:'l1',name:'첫소리 찾기',desc:'그림 이름의 첫소리',emoji:'🔈',gen:S(6,mkCho)}]});
K.area('kor',{id:'letter',name:'글자 만들기',desc:'자음과 모음',emoji:'🧱',color:'#FFF1B8',hello:'글자를 나누고 모아 볼까?',types:{quiz},
  skills:{split1:'받침 없는 글자 나누기',split2:'받침 글자 나누기',join:'글자 모으기'},
  tip:{t:'글자는 블록',b:`<p>한글은 <b>자음 + 모음 (+ 받침)</b> 블록이에요. 나누고 모으기를 하면 받아쓰기도 쉬워져요.</p><div class="say-line">ㄱ에 ㅗ를 붙이면? 거기에 ㅁ을 받치면?</div>`},
  levels:[{id:'l1',name:'글자 나누기',desc:'소 = ㅅ + ㅗ',emoji:'✂️',gen:S(5,()=>mkSplit(false))},
   {id:'l2',name:'받침 글자 나누기',desc:'곰 = ㄱ + ㅗ + ㅁ',emoji:'🐻',gen:S(5,()=>mkSplit(true))},
   {id:'l3',name:'글자 모으기',desc:'ㄱ + ㅗ + ㅁ = ?',emoji:'🧲',gen:S(6,mkJoin)}]});
K.area('kor',{id:'word',name:'낱말 놀이',desc:'빠진 글자, 반대말',emoji:'📖',color:'#FFE6F0',hello:'낱말 놀이 해 볼까?',types:{quiz},
  skills:{miss:'빠진 글자',opp:'반대말'},
  tip:{t:'소리 내어 읽기',b:`<p>빈칸에 글자를 넣고 <b>소리 내어 읽어 보게</b> 하면 틀린 걸 스스로 알아채요.</p>`},
  levels:[{id:'l1',name:'빠진 글자',desc:'바_나 → 바나나',emoji:'🕳️',gen:S(6,mkMiss)},
   {id:'l2',name:'반대말',desc:'크다 ↔ 작다',emoji:'🔄',gen:S(6,mkOpp)}]});
})();
