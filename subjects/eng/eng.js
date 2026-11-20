/* 영콩 · 영어 (듣고 고르기, 읽고 고르기, 첫 글자, 대소문자, 철자) */
'use strict';
(()=>{
const {quiz}=K.TYPES;
/* 낱말: [그림, 뜻, 묶음] */
const W={
 cat:['🐱','고양이','a'],dog:['🐶','강아지','a'],pig:['🐷','돼지','a'],fox:['🦊','여우','a'],cow:['🐮','소','a'],bee:['🐝','벌','a'],ant:['🐜','개미','a'],owl:['🦉','부엉이','a'],bat:['🦇','박쥐','a'],hen:['🐔','암탉','a'],
 lion:['🦁','사자','a'],frog:['🐸','개구리','a'],duck:['🦆','오리','a'],bear:['🐻','곰','a'],fish:['🐟','물고기','a'],bird:['🐦','새','a'],zebra:['🦓','얼룩말','a'],horse:['🐴','말','a'],tiger:['🐯','호랑이','a'],sheep:['🐑','양','a'],rabbit:['🐰','토끼','a'],monkey:['🐵','원숭이','a'],
 apple:['🍎','사과','f'],banana:['🍌','바나나','f'],egg:['🥚','달걀','f'],grape:['🍇','포도','f'],milk:['🥛','우유','f'],cake:['🎂','케이크','f'],juice:['🧃','주스','f'],orange:['🍊','오렌지','f'],bread:['🍞','빵','f'],pizza:['🍕','피자','f'],corn:['🌽','옥수수','f'],carrot:['🥕','당근','f'],cheese:['🧀','치즈','f'],
 sun:['🌞','해','t'],moon:['🌙','달','t'],star:['⭐','별','t'],tree:['🌳','나무','t'],rain:['🌧️','비','t'],snow:['❄️','눈','t'],bus:['🚌','버스','t'],car:['🚗','자동차','t'],box:['📦','상자','t'],hat:['🎩','모자','t'],
 bag:['🎒','가방','t'],cup:['☕','컵','t'],pen:['🖊️','펜','t'],bed:['🛏️','침대','t'],map:['🗺️','지도','t'],ball:['⚽','공','t'],kite:['🪁','연','t'],ship:['🚢','배','t'],book:['📖','책','t'],door:['🚪','문','t'],
 shoe:['👟','신발','t'],sock:['🧦','양말','t'],hand:['✋','손','t'],nose:['👃','코','t'],eye:['👁️','눈','t'],ear:['👂','귀','t'],ring:['💍','반지','t'],van:['🚐','승합차','t'],web:['🕸️','거미줄','t'],umbrella:['☂️','우산','t'],watch:['⌚','손목시계','t'],queen:['👸','여왕','t'],
};
const ALL=Object.keys(W),of=g=>ALL.filter(k=>W[k][2]===g);
const say=w=>({text:w,lang:'en-US',rate:.8});
const pic=k=>({v:k,html:`<span class="em">${W[k][0]}</span>`,note:`${W[k][0]} ${k}`});
const letter=c=>({v:c,html:`<span class="en">${c}</span>`});
const AB='abcdefghijklmnopqrstuvwxyz';
const en=t=>`<span class="en">${t}</span>`;

/* 듣고 그림 고르기 */
function mkListen(pool,skill){const w=K.pick(pool);const opts=K.shuffle([w].concat(K.pickN(pool.filter(x=>x!==w&&W[x][0]!==W[w][0]),3)));
  return {type:'quiz',skill,word:w,speak:say(w),prompt:'잘 듣고 알맞은 그림을 칸에 놓아요',listen:say(w),ans:[w],opts:opts.map(pic),frame:[0],
    hints:[()=>{K.speakLang(w,'en-US',.55);K.say('천천히 다시 들려줄게! 첫소리를 잘 들어 봐.')},()=>{K.say(`첫 글자는 <b>${en(w[0])}</b>야! 그 소리로 시작하는 그림은?`)}],
    line:`맞아! ${w}는 ${W[w][1]}!`,say:'🔊를 눌러서 다시 들을 수 있어!',
    why:g=>`그건 ${W[g[0]]?g[0]+'('+W[g[0]][1]+')':g[0]}야. 다시 들어 봐!`}}
/* 글자를 읽고 그림 고르기 */
function mkRead(pool){const w=K.pick(pool);const opts=K.shuffle([w].concat(K.pickN(pool.filter(x=>x!==w),3)));
  return {type:'quiz',skill:'read',word:w,speak:say(w),prompt:'낱말을 읽고 알맞은 그림을 칸에 놓아요',show:`<span class="word en">${w}</span>`,ans:[w],opts:opts.map(pic),frame:[0],
    hints:[`첫 글자 <b>${en(w[0])}</b>는 어떤 소리가 날까? 그 소리로 시작하는 그림을 찾아 봐.`,()=>{K.speakLang(w,'en-US',.7);K.say('소리로 들려줄게!')}],
    line:`맞아! ${w}는 ${W[w][1]}!`,why:g=>`그건 ${g[0]}야. 글자를 하나씩 소리 내서 읽어 볼까?`}}
/* 첫 글자 / 끝 글자 */
function mkFirst(pos){const pool=ALL.filter(w=>w.length<=5);const w=K.pick(pool);const i=pos==='last'?w.length-1:0,c=w[i];
  const frame=pos==='last'?[en(w.slice(0,-1)),0]:[0,en(w.slice(1))];
  return {type:'quiz',skill:pos==='last'?'last':'first',word:w,speak:say(w),prompt:`그림 이름의 <b>${pos==='last'?'끝':'첫'} 글자</b>를 칸에 놓아요`,listen:say(w),show:`<span class="big">${W[w][0]}</span>`,
    frame,ans:[c],opts:K.opts(c,AB.split(''),4).map(letter),
    hints:[()=>{K.speakLang(w,'en-US',.5);K.say(`천천히 들어 봐. ${pos==='last'?'마지막':'처음'} 소리가 뭐지?`)},`${en(c.toUpperCase())}${en(c)} 소리로 ${pos==='last'?'끝나':'시작하'}는 낱말이야.`],
    line:`맞아! ${w}!`}}
/* 대문자·소문자 짝꿍 */
function mkCase(){const c=K.pick(AB.split(''));const up=Math.random()<.5;const q=up?c.toUpperCase():c,a=up?c:c.toUpperCase();
  const look={b:'d',d:'b',p:'q',q:'p',m:'n',n:'m',u:'n',i:'l',l:'i'};const conv=x=>up?x:x.toUpperCase();
  const opts=[a];if(look[c])opts.push(conv(look[c]));while(opts.length<4){const x=conv(K.pick(AB.split('')));if(!opts.includes(x))opts.push(x)}
  return {type:'quiz',skill:'case',prompt:`<b>${up?'소문자':'대문자'}</b> 짝꿍을 찾아요`,show:`<span class="word en" style="font-size:72px">${q}</span>`,frame:[0],ans:[a],opts:K.shuffle(opts).map(letter),
    hints:[`${up?'대문자':'소문자'} ${en(q)}의 이름을 말해 봐. 같은 이름을 가진 ${up?'소문자':'대문자'}를 찾아!`,'b와 d, p와 q처럼 <b>방향만 다른</b> 글자를 조심해!'],line:`맞아! ${c.toUpperCase()}${c} 짝꿍!`,
    why:g=>look[c]&&g[0]&&g[0].toLowerCase()===look[c]?'아깝다! 방향이 반대인 글자야. 동그라미가 어느 쪽에 있는지 봐!':''}}
/* 철자 */
function mkSpell(len){const pool=ALL.filter(w=>w.length===len&&new Set(w).size===w.length);const w=K.pick(pool);
  const extra=K.pickN(AB.split('').filter(c=>!w.includes(c)),2);
  return {type:'quiz',skill:len===3?'spell3':'spell4',word:w,speak:say(w),prompt:'잘 듣고 글자를 순서대로 놓아요',listen:say(w),show:`<span class="big">${W[w][0]}</span>`,
    frame:w.split('').map((_,i)=>i),ans:w.split(''),opts:K.shuffle(w.split('').concat(extra)).map(letter),join:'',
    hints:[()=>{K.speakLang(w.split('').join(' '),'en-US',.5);K.say('소리를 한 글자씩 끊어서 들려줄게!')},`첫 글자는 <b>${en(w[0])}</b>야.`],line:`맞아! ${w.split('').join('-')}, ${w}!`}}

function mkTalk(pool){const w=K.pick(pool);return {type:'say',skill:'talk',word:w,prompt:'그림 이름을 듣고 <b>크게 따라 말해요</b>',show:`<span class="big">${W[w][0]}</span><div class="muted" style="font-size:16px;width:100%">${W[w][1]}</div>`,talk:{text:w,lang:'en-US'},line:`잘했어! ${w}!`}}
const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('eng',{id:'listen',name:'듣고 고르기',desc:'영어 소리를 듣고 그림 찾기',emoji:'👂',color:'#EDE6FF',hello:'Hello! 잘 듣고 그림을 찾아 볼까?',types:{quiz,say:K.TYPES.say},
  skills:{lan:'동물 낱말',lfo:'음식 낱말',lth:'물건 낱말',lall:'섞어서 듣기',talk:'따라 말하기'},
  tip:{t:'소리 먼저',b:`<p>처음엔 뜻을 몰라도 괜찮아요. <b>소리와 그림을 연결</b>하는 게 먼저예요. 🔊를 여러 번 누르고 따라 말하게 해 주세요. 문제를 맞히면 🎤로 낱말을 직접 말해야 다음 문제로 넘어가요.</p><div class="say-line">무슨 소리로 시작했어? 따라 해 볼까?</div><p>휴대폰에 영어 음성이 없으면 소리가 작거나 나오지 않을 수 있어요.</p>`},
  levels:[{id:'l1',name:'동물 친구들',desc:'Animals',emoji:'🐶',gen:S(5,()=>mkListen(of('a'),'lan'))},
   {id:'l2',name:'맛있는 음식',desc:'Food',emoji:'🍎',gen:S(5,()=>mkListen(of('f'),'lfo'))},
   {id:'l3',name:'주변 물건',desc:'Things',emoji:'🎒',gen:S(5,()=>mkListen(of('t'),'lth'))},
   {id:'l4',name:'섞어서 듣기',desc:'모두 섞었어요',emoji:'🎧',gen:S(6,()=>mkListen(ALL,'lall'))},
   {id:'l5',name:'따라 말하기',desc:'듣고 크게 말해요 🎤',emoji:'🗣️',gen:S(6,()=>mkTalk(ALL.filter(w=>w.length<=6)))}]});
K.area('eng',{id:'abc',name:'알파벳',desc:'첫 글자, 대소문자',emoji:'🔤',color:'#FFE6F0',hello:'A, B, C! 글자 놀이 해 볼까?',types:{quiz},
  skills:{first:'첫 글자 소리',case:'대소문자',last:'끝 글자 소리'},
  tip:{t:'글자 이름과 소리',b:`<p>알파벳은 <b>이름</b>(비, 디)과 <b>소리</b>(브, 드)가 달라요. 소리로 낱말을 시작하는 놀이가 읽기의 첫걸음이에요.</p><div class="say-line">cat은 크, 크, 크로 시작하지? 그럼 무슨 글자야?</div>`},
  levels:[{id:'l1',name:'첫 글자 찾기',desc:'_at → cat',emoji:'🅰️',gen:S(5,()=>mkFirst('first'))},
   {id:'l2',name:'대문자 짝꿍',desc:'A와 a',emoji:'🔠',gen:S(6,mkCase)},
   {id:'l3',name:'끝 글자 찾기',desc:'ca_ → cat',emoji:'🔚',gen:S(5,()=>mkFirst('last'))}]});
K.area('eng',{id:'spell',name:'철자 놀이',desc:'글자로 낱말 만들기',emoji:'🧩',color:'#E3F6E0',hello:'글자 블록으로 낱말을 만들어 볼까?',types:{quiz},
  skills:{read:'낱말 읽기',spell3:'3글자 철자',spell4:'4글자 철자'},
  tip:{t:'소리를 끊어 듣기',b:`<p>c-a-t처럼 소리를 <b>하나씩 끊어서</b> 말해 주면 철자를 쉽게 찾아요. 철자를 다 맞히면 같이 읽어 보세요.</p>`},
  levels:[{id:'l1',name:'읽고 고르기',desc:'낱말을 읽어요',emoji:'👀',gen:S(5,()=>mkRead(ALL.filter(w=>w.length<=4)))},
   {id:'l2',name:'세 글자 낱말',desc:'cat, dog, sun',emoji:'3️⃣',gen:S(5,()=>mkSpell(3))},
   {id:'l3',name:'네 글자 낱말',desc:'fish, frog, cake',emoji:'4️⃣',gen:S(5,()=>mkSpell(4))}]});
})();
