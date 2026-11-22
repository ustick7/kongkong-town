/* 영콩 · 영어 더하기: 손으로 쓰기(콩이 AI가 읽어요), 말하기(콩이 AI가 들어요), 소리 놀이(라임, 소리 합치기, 가운데 소리) */
'use strict';
(()=>{
const {quiz,write,say}=K.TYPES;
/* 낱말: [그림, 뜻] */
const W={cat:['🐱','고양이'],dog:['🐶','강아지'],pig:['🐷','돼지'],fox:['🦊','여우'],bee:['🐝','벌'],hen:['🐔','암탉'],bat:['🦇','박쥐'],ant:['🐜','개미'],
 sun:['🌞','해'],bus:['🚌','버스'],hat:['🎩','모자'],cup:['☕','컵'],pen:['🖊️','펜'],bed:['🛏️','침대'],box:['📦','상자'],bag:['🎒','가방'],map:['🗺️','지도'],
 egg:['🥚','달걀'],van:['🚐','승합차'],web:['🕸️','거미줄'],car:['🚗','자동차'],net:['🥅','그물'],jet:['✈️','비행기'],log:['🪵','통나무'],mug:['🍺','머그잔'],
 frog:['🐸','개구리'],duck:['🦆','오리'],fish:['🐟','물고기'],bird:['🐦','새'],cake:['🎂','케이크'],milk:['🥛','우유'],star:['⭐','별'],tree:['🌳','나무'],
 ball:['⚽','공'],book:['📖','책'],kite:['🪁','연'],ship:['🚢','배'],moon:['🌙','달'],lion:['🦁','사자'],bear:['🐻','곰'],corn:['🌽','옥수수'],
 hand:['✋','손'],nose:['👃','코'],sock:['🧦','양말'],shoe:['👟','신발'],door:['🚪','문'],rain:['🌧️','비'],snow:['❄️','눈'],king:['🤴','왕'],
 apple:['🍎','사과'],grape:['🍇','포도'],bread:['🍞','빵'],horse:['🐴','말'],tiger:['🐯','호랑이'],zebra:['🦓','얼룩말'],juice:['🧃','주스'],pizza:['🍕','피자'],
 sit:['🪑','앉다'],mop:['🧹','대걸레'],pot:['🍲','냄비'],wig:['💇','가발'],rat:['🐀','쥐'],nut:['🥜','땅콩']};
const has=k=>!!W[k];
const en=t=>`<span class="en">${t}</span>`,emo=k=>`<span class="em">${W[k][0]}</span>`;
const sayEn=(t,r=.8)=>({text:t,lang:'en-US',rate:r});
const pic=k=>({v:k,html:emo(k),note:`${W[k][0]} ${k}`});
const S=(n,fn)=>()=>K.makeSet(n,fn);
/* 글씨 모양이 대문자·소문자 구분이 어려운 글자(l, I)는 빼요 */
const LOW='abcdefghjkmnpqrstuvwxyz',UP='ABCDEFGHJKLMNPQRSTUVWXYZ';
const CVC=['cat','dog','pig','fox','sun','bus','hat','cup','pen','bed','box','bag','map','egg','van','web','net','jet','hen','bat','ant','bee','car','log','mug'];
const W4=['frog','duck','fish','bird','cake','milk','star','tree','ball','book','kite','ship','moon','lion','bear','corn','hand','nose','sock','shoe','door','rain','snow','king'];
const W5=['apple','grape','bread','horse','tiger','zebra','juice','pizza'];

/* ---------- 손으로 쓰기 ---------- */
function mkLetter(up){const c=K.pick(up?UP:LOW);
  return {type:'write',lang:'en',cs:up,skill:up?'w_up':'w_low',word:c,cells:1,say:up?`capital ${c}`:c,
    prompt:up?'잘 듣고 <b>대문자</b>로 써 보세요':'잘 듣고 <b>소문자</b>로 써 보세요',
    hints:[up?`대문자는 크고 반듯한 글자야. 이 글자의 소문자는 ${en(c.toLowerCase())}야.`:`소문자는 작은 글자야. 이 글자의 대문자는 ${en(c.toUpperCase())}야.`,`이렇게 생겼어: ${en(c)}`],
    tip:up?`대문자 ${c}`:`소문자 ${c}`}}
function mkWord(pool,skill){const w=K.pick(pool);
  return {type:'write',lang:'en',skill,word:w,say:w,
    prompt:`잘 듣고 영어로 써 보세요 ${emo(w)} <span class="muted">${W[w][1]}</span>`,
    hints:[`모두 <b>${w.length}글자</b>야. 한 칸에 한 글자씩! 첫 글자는 ${en(w[0])}.`,`${en(w.slice(0,-1)+'_')} 마지막 글자 소리를 잘 들어 봐.`],
    tip:`${W[w][0]} ${w} = ${W[w][1]}`}}

/* ---------- 말하기 ---------- */
/* 그림만 보고 영어 이름 말하기: 먼저 들려주지 않아요. 🔊를 누르면 힌트를 쓴 걸로 쳐요 */
function mkName(pool){const w=K.pick(pool);
  return {type:'say',skill:'t_name',word:w,prompt:'그림을 보고 <b>영어 이름</b>을 크게 말해요',show:`<span class="big">${W[w][0]}</span><div class="muted" style="font-size:16px;width:100%">${W[w][1]}</div>`,
    talk:{text:w,lang:'en-US',noAuto:true,hide:'❓ 영어로 뭘까?'},line:`그렇지! ${w}!`}}
const SENTS=[['I like apples.','나는 사과를 좋아해요.','🍎'],['I see a cat.','고양이가 보여요.','🐱'],['I have a ball.','나는 공이 있어요.','⚽'],['It is big.','그건 커요.','🐘'],
 ['I can jump.','나는 뛸 수 있어요.','🦘'],['I am happy.','나는 기뻐요.','😄'],['Thank you.','고마워요.','🙏'],['Good morning!','좋은 아침!','🌞'],['Nice to meet you.','만나서 반가워요.','🤝'],
 ['I am seven.','나는 일곱 살이에요.','7️⃣'],['Let\'s play!','같이 놀자!','🛝'],['I love you.','사랑해요.','💗'],['Good night!','잘 자요!','🌙'],['How are you?','어떻게 지내?','👋']];
function mkSay(){const [t,ko,e]=K.pick(SENTS);
  return {type:'say',skill:'t_sent',word:t,prompt:'잘 듣고 문장을 <b>크게 따라 말해요</b>',show:`<span class="big">${e}</span><div class="muted" style="font-size:16px;width:100%">${ko}</div>`,
    talk:{text:t,lang:'en-US'},line:`멋져! ${t}`}}
/* 이럴 땐 뭐라고 할까? 고르고 나서 말하기 */
const SIT=[['아침에 친구를 만났어요','🌅','Good morning!'],['잘 자라고 인사해요','🛌','Good night!'],['선물을 받았어요','🎁','Thank you!'],['친구와 헤어져요','👋','Goodbye!'],
 ['친구 발을 밟았어요','😣','I am sorry.'],['처음 만난 친구예요','🤝','Nice to meet you.'],['생일인 친구에게','🎂','Happy birthday!'],['친구가 고맙다고 해요','😊','You are welcome.']];
function mkSit(){const [s,e,a]=K.pick(SIT);const wrong=K.pickN(SIT.filter(x=>x[2]!==a).map(x=>x[2]),2);const opts=K.shuffle([a].concat(wrong));
  return {type:'quiz',skill:'t_sit',prompt:`이럴 땐 영어로 뭐라고 할까? <b>${s}</b>`,show:`<span class="big">${e}</span>`,frame:[0],ans:[a],
    opts:opts.map(o=>({v:o,html:`<span class="en" style="font-size:20px">${o}</span>`})),
    hints:[()=>{K.say('하나씩 들어 볼까?');K.speakLang(opts.join('. '),'en-US',.75)},()=>K.say(`첫 낱말은 <b>${en(a.split(' ')[0])}</b>야!`)],
    line:`맞아! ${s}엔 ${a}`,speak:sayEn(a),why:g=>`'${g[0]}'는 다른 때 쓰는 말이야.`}}

/* ---------- 소리 놀이 ---------- */
const RHY=[['cat','hat','bat','rat'],['dog','log','fog'],['pig','wig','big'],['sun','bun','run'],['hen','pen','ten'],['bed','red'],['box','fox'],['cake','lake','snake'],
 ['moon','spoon'],['star','car','jar'],['bee','tree','see'],['mop','pot'],['nut','cut'],['jet','net','wet'],['mug','bug','rug'],['frog','log','dog']];
function mkRhyme(){for(let g=0;g<50;g++){const grp=K.pick(RHY).filter(has);if(grp.length<2)continue;const [a,b]=K.pickN(grp,2);
    const others=K.pickN(Object.keys(W).filter(k=>k.length<=4&&!RHY.some(r=>r.includes(a)&&r.includes(k))&&k.slice(-2)!==a.slice(-2)),2);
    return {type:'quiz',skill:'p_rhyme',prompt:`${emo(a)} <b>${en(a)}</b>랑 끝소리가 같은 그림은?`,listen:sayEn(a),frame:[0],ans:[b],opts:K.shuffle([b].concat(others)).map(pic),
      hints:[()=>{K.speakLang(a,'en-US',.6);K.say(`${a}, 끝소리를 잘 들어 봐!`)},()=>K.say(`끝이 <b>${en('-'+a.slice(-2))}</b>로 끝나는 낱말이야.`)],
      line:`맞아! ${a}, ${b}! 끝소리가 똑같지?`,speak:sayEn(`${a}, ${b}`),why:g=>`${g[0]}는 끝소리가 달라. ${a}랑 소리 내 봐!`}}}
function mkBlend(){const w=K.pick(CVC.filter(has));const opts=K.shuffle([w].concat(K.pickN(CVC.filter(x=>x!==w&&has(x)&&W[x][0]!==W[w][0]),2)));
  return {type:'quiz',skill:'p_blend',prompt:`글자 소리를 합쳐 읽으면? <b style="letter-spacing:.3em">${en(w.split('').join(' · '))}</b>`,frame:[0],ans:[w],opts:opts.map(pic),
    hints:[()=>K.say(`첫 글자 ${en(w[0])}부터 천천히, 손가락으로 짚으면서 읽어 봐.`),()=>{K.speakLang(w,'en-US',.55);K.say('콩이가 천천히 읽어 줄게!')}],
    line:`맞아! ${w.split('').join('-')}, ${w}!`,speak:sayEn(w),why:g=>`그건 ${g[0]}야. 글자를 하나씩 다시 읽어 볼까?`}}
function mkMid(){const w=K.pick(CVC.filter(has));const v=w[1];if(!'aeiou'.includes(v))return mkMid();
  return {type:'quiz',skill:'p_mid',prompt:`${emo(w)} 가운데 들어갈 글자는? <b style="font-size:26px">${en(w[0]+' _ '+w[2])}</b>`,listen:sayEn(w),frame:[0],ans:[v],
    opts:'aeiou'.split('').map(c=>({v:c,html:en(c)})),
    hints:[()=>{K.speakLang(w,'en-US',.55);K.say('가운데 소리를 잘 들어 봐!')},()=>K.say(`${W[w][1]}는 영어로 <b>${en(w)}</b>야.`)],
    line:`맞아! ${w[0]}-${v}-${w[2]}, ${w}!`,speak:sayEn(w),why:g=>`${w[0]}${g[0]}${w[2]}가 되면 다른 소리야. 다시 들어 봐!`}}

K.area('eng',{id:'ewrite',name:'영어 쓰기',desc:'듣고 화면에 써요 ✍️',emoji:'✍️',color:'#FFF1B8',hello:'Let\'s write! 잘 듣고 영어로 써 볼까?',types:{write},
  skills:{w_low:'소문자 쓰기',w_up:'대문자 쓰기',w_cvc:'세 글자 낱말',w_4:'네 글자 낱말',w_5:'다섯 글자 낱말'},
  tip:{t:'천천히 또박또박',b:`<p>설정에서 손글씨 채점 키를 넣으면 <b>콩이가 글씨를 두 번 따로 읽어서</b>, 두 번 다 똑같이 확실할 때만 맞았다고 해요. 애매하면 아이가 정답과 비교하고, 부모님이 리포트에서 확인해요.</p><div class="say-line">칸 하나에 글자 하나씩 크게 써 봐!</div><p>낱말 쓰기는 대문자로 써도 맞게 쳐요. 대문자 단계만 대문자를 꼭 써야 해요.</p>`},
  levels:[{id:'e1',name:'소문자 쓰기',desc:'a, b, c',emoji:'🔡',age:6,gen:S(6,()=>mkLetter(false))},{id:'e2',name:'대문자 쓰기',desc:'A, B, C',emoji:'🔠',age:7,gen:S(6,()=>mkLetter(true))},
   {id:'e3',name:'세 글자 낱말',desc:'cat, dog, sun',emoji:'🐱',age:7,gen:S(5,()=>mkWord(CVC,'w_cvc'))},{id:'e4',name:'네 글자 낱말',desc:'frog, cake, star',emoji:'🐸',age:8,gen:S(5,()=>mkWord(W4,'w_4'))},
   {id:'e5',name:'다섯 글자 낱말',desc:'apple, tiger',emoji:'🍎',age:9,gen:S(4,()=>mkWord(W5,'w_5'))}]});
K.area('eng',{id:'etalk',name:'영어 말하기',desc:'콩이가 듣고 확인해요 🎤',emoji:'🎤',color:'#E3F0FF',hello:'Hello! 큰 목소리로 영어로 말해 볼까?',types:{say,quiz},
  skills:{t_name:'그림 보고 말하기',t_sent:'문장 따라 말하기',t_sit:'상황에 맞는 말'},
  tip:{t:'틀려도 크게!',b:`<p>설정에 키가 있으면 <b>콩이가 녹음을 두 번 따로 받아 적어서</b> 똑같고 확실할 때만 맞았다고 해요. 잘 안 들리면 다시 말하게 하고, 두 번 안 되면 부모님이 직접 듣고 확인할 수 있어요.</p><div class="say-line">조용한 곳에서 휴대폰을 입 가까이 대고 말해 봐!</div><p>키가 없으면 휴대폰 음성 인식으로 확인해요.</p>`},
  levels:[{id:'k1',name:'그림 보고 말하기',desc:'이건 영어로 뭘까?',emoji:'🖼️',age:7,gen:S(5,()=>mkName(CVC.concat(W4).filter(has)))},
   {id:'k2',name:'문장 따라 말하기',desc:'I like apples.',emoji:'💬',age:7,gen:S(5,mkSay)},
   {id:'k3',name:'이럴 땐 뭐라고?',desc:'Thank you! Sorry!',emoji:'🙋',age:7,gen:S(5,mkSit)}]});
K.area('eng',{id:'phon',name:'소리 놀이',desc:'라임, 소리 합치기',emoji:'🎶',color:'#E3F6E0',hello:'cat, hat, bat! 소리 놀이 해 볼까?',types:{quiz},
  skills:{p_rhyme:'끝소리 같은 말',p_blend:'소리 합쳐 읽기',p_mid:'가운데 소리'},
  tip:{t:'소리를 가지고 놀아요',b:`<p>영어 읽기는 <b>글자 소리를 합치는 힘</b>에서 시작해요. c, a, t를 하나씩 소리 내고 빠르게 이어 붙이면 cat이 돼요.</p><div class="say-line">c… a… t… 빨리 하면? cat!</div>`},
  levels:[{id:'r1',name:'끝소리 같은 말',desc:'cat · hat',emoji:'🎵',age:7,gen:S(5,mkRhyme)},{id:'r2',name:'소리 합치기',desc:'c·a·t → cat',emoji:'🧲',age:7,gen:S(5,mkBlend)},
   {id:'r3',name:'가운데 소리',desc:'c _ t',emoji:'🔤',age:8,gen:S(6,mkMid)}]});
})();
