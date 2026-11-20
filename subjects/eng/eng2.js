/* 영콩 더하기 · 색깔, 숫자, 몸, 기분, 움직임, 짧은 문장 (모두 듣고 고른 뒤 따라 말하기) */
'use strict';
(()=>{
const {quiz}=K.TYPES;
const say=t=>({text:t,lang:'en-US',rate:.8});
const en=t=>`<span class="en">${t}</span>`;
const em=e=>`<span class="em">${e}</span>`;

const COL={red:['#E8443A','빨간색',['🍎','🍓','🍒','🌹']],blue:['#3A7BE8','파란색',['🐳','🫐','💙','🧢']],yellow:['#F5C518','노란색',['🍌','🌻','🐥','🌽']],
 green:['#3BAA4A','초록색',['🥦','🐸','🥒','🍀']],orange:['#F2862E','주황색',['🥕','🍊','🎃','🦊']],purple:['#8E55C9','보라색',['🍇','🍆','💜','☂️']],
 pink:['#F27BB3','분홍색',['🌸','🐷','🦩','🎀']],brown:['#8B5A2B','갈색',['🐻','🌰','🍫','🪵']],black:['#222','검은색',['🎩','🐜','🎱','🕷️']],white:['#FAFAFA','흰색',['⛄','🥚','🐑','☁️']]};
const dot=c=>`<span style="display:inline-block;width:44px;height:44px;border-radius:50%;background:${COL[c][0]};border:3px solid rgba(0,0,0,.18)"></span>`;
const NUM=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
const BODY={head:['🗣️','머리'],eye:['👁️','눈'],ear:['👂','귀'],nose:['👃','코'],mouth:['👄','입'],hand:['✋','손'],foot:['🦶','발'],leg:['🦵','다리'],arm:['💪','팔'],tooth:['🦷','이'],hair:['💇','머리카락'],finger:['☝️','손가락']};
const FEEL={happy:['😄','기뻐요'],sad:['😢','슬퍼요'],angry:['😠','화나요'],sleepy:['😴','졸려요'],scared:['😱','무서워요'],surprised:['😲','깜짝 놀랐어요'],sick:['🤒','아파요'],hot:['🥵','더워요'],cold:['🥶','추워요'],hungry:['🤤','배고파요']};
const ACT={run:['🏃','달려요'],jump:['🤸','뛰어올라요'],swim:['🏊','헤엄쳐요'],eat:['🍽️','먹어요'],sleep:['🛌','자요'],sing:['🎤','노래해요'],dance:['💃','춤춰요'],
 read:['📖','읽어요'],walk:['🚶','걸어요'],clap:['👏','손뼉 쳐요'],draw:['🎨','그려요'],ride:['🚲','타요'],cry:['😭','울어요'],wash:['🧼','씻어요']};
/* 짧은 문장: [문장, 그림, 뜻] 같은 틀끼리 비교 */
const SENT={see:[['I see a cat.','🐱'],['I see a dog.','🐶'],['I see a bird.','🐦'],['I see a fish.','🐟'],['I see a lion.','🦁'],['I see a frog.','🐸']],
 like:[['I like apples.','🍎'],['I like bananas.','🍌'],['I like milk.','🥛'],['I like pizza.','🍕'],['I like cake.','🎂'],['I like grapes.','🍇']],
 have:[['I have a ball.','⚽'],['I have a book.','📖'],['I have a hat.','🎩'],['I have a bag.','🎒'],['I have a pen.','🖊️'],['I have a kite.','🪁']],
 it:[['It is big.','🐘'],['It is small.','🐭'],['It is hot.','🔥'],['It is cold.','🧊'],['It is long.','🦒'],['It is fast.','🚀']]};
const KO_SENT={'It is big.':'커요','It is small.':'작아요','It is hot.':'뜨거워요','It is cold.':'차가워요','It is long.':'길어요','It is fast.':'빨라요'};

const H1=w=>()=>{K.speakLang(w,'en-US',.55);K.say('천천히 다시 들려줄게!')};
/* 사전에서 하나 듣고 그림 고르기 */
function pick(bank,skill,prompt){const keys=Object.keys(bank);const w=K.pick(keys);const opts=K.shuffle([w].concat(K.pickN(keys.filter(x=>x!==w),3)));
  return {type:'quiz',skill,word:w,speak:say(w),prompt,listen:say(w),frame:[0],ans:[w],opts:opts.map(k=>({v:k,html:em(bank[k][0]),note:`${bank[k][0]} ${k}`})),
    hints:[H1(w),()=>K.say(`첫 글자는 <b>${en(w[0])}</b>! ${en(w)}는 '${bank[w][1]}'라는 뜻이야.`)],line:`맞아! ${w}는 ${bank[w][1]}!`,why:g=>`그건 ${g[0]}(${bank[g[0]][1]})야. 다시 들어 봐!`}}

function mkColor(){const keys=Object.keys(COL);const c=K.pick(keys);const opts=K.shuffle([c].concat(K.pickN(keys.filter(x=>x!==c),3)));
  return {type:'quiz',skill:'color',word:c,speak:say(c),prompt:'잘 듣고 알맞은 색깔을 칸에 놓아요',listen:say(c),frame:[0],ans:[c],opts:opts.map(k=>({v:k,html:dot(k),note:k})),
    hints:[H1(c),()=>K.say(`${en(c)}는 <b>${COL[c][1]}</b>이야. ${COL[c][2][0]} 같은 색!`)],line:`맞아! ${c}는 ${COL[c][1]}!`}}
/* Find something yellow! */
function mkColorThing(){const keys=Object.keys(COL);const c=K.pick(keys);const right=K.pick(COL[c][2]);const others=K.pickN(keys.filter(x=>x!==c),3).map(k=>K.pick(COL[k][2]));
  const t=`Find something ${c}!`;
  return {type:'quiz',skill:'color2',word:c,speak:say(c),prompt:'잘 듣고 그 색깔인 것을 칸에 놓아요',listen:say(t),frame:[0],ans:[right],opts:K.shuffle([right].concat(others)).map(e=>({v:e,html:em(e)})),
    hints:[H1(t),()=>K.say(`${en(c)}는 <b>${COL[c][1]}</b>이야!`)],line:`맞아! ${right}는 ${c}!`}}
function mkNum(){const n=K.ri(1,10);const pool=[];for(let i=1;i<=10;i++)if(i!==n)pool.push(i);const opts=K.shuffle([n].concat(K.pickN(pool,3)));
  return {type:'quiz',skill:'num',word:NUM[n],speak:say(NUM[n]),prompt:'잘 듣고 알맞은 숫자를 칸에 놓아요',listen:say(NUM[n]),frame:[0],ans:[n],nums:true,
    opts:opts.map(x=>({v:x,html:K.numHtml(x)})),hints:[H1(NUM[n]),()=>K.say(`one, two, three… 하나씩 세면서 ${en(NUM[n])}를 찾아 봐!`)],line:`맞아! ${NUM[n]}는 ${n}!`}}
function mkCountEn(){const n=K.ri(2,10);const e=K.pick(['🍎','⭐','🐟','🎈','🐥','🍪']);const w=NUM[n];const pool=[];for(let i=1;i<=10;i++)if(i!==n&&Math.abs(i-n)<=3)pool.push(i);
  const opts=K.shuffle([n].concat(K.pickN(pool,3)));
  return {type:'quiz',skill:'count',word:w,speak:say(w),prompt:'영어로 세어 보고 몇 개인지 놓아요',show:`<div style="font-size:34px;max-width:300px;margin:0 auto;line-height:1.3">${e.repeat(n)}</div>`,
    frame:[0],ans:[n],nums:true,opts:opts.map(x=>({v:x,html:K.numHtml(x)})),
    hints:[()=>{K.speakLang(NUM.slice(1,n+1).join(', '),'en-US',.7);K.say('같이 영어로 세어 보자!')},'하나씩 손가락으로 짚으며 one, two, three… 세어 봐.'],line:`맞아! ${w}! ${n}개야.`}}
function mkSent(kind){const set=SENT[kind];const r=K.pick(set);const opts=K.shuffle([r].concat(K.pickN(set.filter(x=>x!==r),3)));
  return {type:'quiz',skill:'sent',word:r[0],speak:say(r[0]),prompt:'잘 듣고 문장에 맞는 그림을 칸에 놓아요',listen:say(r[0]),frame:[0],ans:[r[0]],
    opts:opts.map(x=>({v:x[0],html:em(x[1]),note:x[0]})),hints:[H1(r[0]),()=>K.say(`문장의 <b>마지막 낱말</b>을 잘 들어 봐!`)],
    line:`맞아! ${r[0]}${KO_SENT[r[0]]?' ('+KO_SENT[r[0]]+')':''}`}}
const mkSentMix=()=>mkSent(K.pick(Object.keys(SENT)));

const S=(n,fn)=>()=>K.makeSet(n,fn);
const TIP={t:'듣고, 고르고, 말하기',b:`<p>맞힌 뒤에는 꼭 <b>소리 내어 따라 말해야</b> 다음으로 넘어가요. 부모님이 같이 말해 주면 더 신나요.</p><div class="say-line">What color is it? Red!</div>`};
K.area('eng',{id:'color',name:'색깔과 숫자',desc:'red, blue, one, two',emoji:'🎨',color:'#FFE6E6',hello:'색깔이랑 숫자를 영어로 말해 볼까?',types:{quiz},
  skills:{color:'색깔 듣기',color2:'그 색깔 찾기',num:'숫자 듣기',count:'영어로 세기'},tip:TIP,
  levels:[{id:'c1',name:'색깔 듣기',desc:'red, blue, yellow',emoji:'🎨',age:6,gen:S(6,mkColor)},{id:'c2',name:'그 색깔 찾기',desc:'Find something red!',emoji:'🔎',age:7,gen:S(6,mkColorThing)},
   {id:'n1',name:'숫자 듣기',desc:'one ~ ten',emoji:'🔢',age:6,gen:S(6,mkNum)},{id:'n2',name:'영어로 세기',desc:'one, two, three…',emoji:'🍎',age:7,gen:S(5,mkCountEn)}]});
K.area('eng',{id:'me',name:'몸과 기분',desc:'nose, happy, run',emoji:'🙋',color:'#E3F0FF',hello:'내 몸이랑 기분을 영어로!',types:{quiz},
  skills:{body:'몸',feel:'기분',act:'움직임'},tip:{t:'몸으로 하기',b:`<p>"Touch your nose!" 하고 같이 코를 만져 보세요. <b>몸으로 하면</b> 금방 외워요.</p><div class="say-line">How are you? I'm happy!</div>`},
  levels:[{id:'b1',name:'내 몸',desc:'eye, nose, hand',emoji:'👃',age:6,gen:S(6,()=>pick(BODY,'body','잘 듣고 알맞은 몸 그림을 칸에 놓아요'))},
   {id:'f1',name:'기분',desc:'happy, sad, angry',emoji:'😄',age:7,gen:S(6,()=>pick(FEEL,'feel','잘 듣고 알맞은 얼굴을 칸에 놓아요'))},
   {id:'a1',name:'움직임',desc:'run, jump, swim',emoji:'🏃',age:7,gen:S(6,()=>pick(ACT,'act','잘 듣고 알맞은 그림을 칸에 놓아요'))}]});
K.area('eng',{id:'sent',name:'짧은 문장',desc:'I see a cat.',emoji:'💬',color:'#E3F6E0',hello:'짧은 문장을 듣고 말해 볼까?',types:{quiz},
  skills:{sent:'문장 듣기'},tip:{t:'문장 통째로',b:`<p>낱말을 알면 <b>짧은 문장</b>으로 넓혀요. 같은 틀(I like ___)을 여러 번 들으면 스스로 바꿔 말하기 시작해요.</p><div class="say-line">I like apples. I like bananas!</div>`},
  levels:[{id:'s1',name:'I see a ___.',desc:'무엇이 보여요?',emoji:'👀',age:7,gen:S(5,()=>mkSent('see'))},{id:'s2',name:'I like ___.',desc:'좋아하는 것',emoji:'❤️',age:7,gen:S(5,()=>mkSent('like'))},
   {id:'s3',name:'I have ___.',desc:'가진 것',emoji:'🎒',age:7,gen:S(5,()=>mkSent('have'))},{id:'s4',name:'It is ___.',desc:'big, small, hot',emoji:'🐘',age:8,gen:S(5,()=>mkSent('it'))},
   {id:'s5',name:'섞어서',desc:'여러 문장',emoji:'🔀',age:8,gen:S(6,mkSentMix)}]});
})();
