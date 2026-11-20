/* 받콩 · 받아쓰기 (글자 블록 받아쓰기, 화면에 손으로 쓰기, 띄어쓰기) */
'use strict';
(()=>{
const {quiz,write}=K.TYPES,H=K.hangul;
K.css(`
.sp-row{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;row-gap:10px;padding:6px 0}
.sp-ch{font-family:var(--f-disp);font-size:32px;line-height:1;color:var(--ink);padding:6px 0}
.sp-gap{appearance:none;border:0;background:transparent;width:18px;height:54px;border-radius:10px;cursor:pointer;position:relative;padding:0}
.sp-gap::after{content:'';position:absolute;left:50%;top:10px;bottom:10px;width:2px;background:#EADBC4;transform:translateX(-50%)}
.sp-gap.on{width:34px;background:var(--s-blue);box-shadow:inset 0 0 0 3px var(--blue)}
.sp-gap.on::after{content:'∨';width:auto;background:none;top:auto;bottom:-4px;color:var(--blue-d);font-family:var(--f-disp);font-size:22px}
.sp-gap.bad{box-shadow:inset 0 0 0 3px var(--red)}
.sp-gap:focus-visible{outline:3px solid var(--blue)}
`);
/* 낱말 묶음. s: 소리 나는 대로 쓴 모양(헷갈리는 받침) */
const L={
 nob:[['나비','🦋'],['기차','🚂'],['모자','🧢'],['하마','🦛'],['우유','🥛'],['바나나','🍌'],['사자','🦁'],['포도','🍇'],['치마','👗'],['오리','🦆'],['그네',''],['시소',''],['피아노','🎹'],['두부',''],['다리미',''],['허수아비',''],['고구마','🍠'],['도토리','🌰'],['기러기',''],['거미','🕷️']],
 bat:[['사람','🧑'],['연필','✏️'],['수박','🍉'],['가방','🎒'],['우산','☂️'],['선물','🎁'],['동물',''],['학교','🏫'],['냉장고',''],['운동장',''],['김밥','🍙'],['책상',''],['공책','📒'],['할머니','👵'],['병원','🏥'],['시장',''],['신발','👟'],['젓가락','🥢'],['장갑','🧤'],['솜사탕','🍭']],
 tricky:[['같이','','가치'],['국물','','궁물'],['해돋이','🌅','해도지'],['옷이','','오시'],['낮잠','😴','낟짬'],['꽃잎','🌸','꼰닙'],['부엌','','부억'],['밖에','','바께'],['많이','','마니'],['좋아','👍','조아'],
   ['놀이터','🛝','노리터'],['음악','🎵','으막'],['웃음','😄','우슴'],['깊이','','기피'],['낚시','🎣','낙씨'],['숲속','🌲','숩쏙'],['읽기','📖','일끼'],['앉아','🪑','안자'],['맛있는','😋','마신는'],['굳이','','구지']],
 tense:[['딸기','🍓'],['꼬리',''],['뿌리',''],['토끼','🐰'],['아빠','👨'],['떡볶이','🍢'],['까치','🐦'],['빵','🍞'],['땅콩','🥜'],['쓰레기','🗑️'],['꽃','🌸'],['짜장면','🍜'],['찌개','🍲'],['뻐꾸기',''],['싸움',''],['뜀틀','']],
};
const SENT=['나는 사과를 좋아해요','엄마가 밥을 해요','강아지가 멍멍 짖어요','우리 집에 놀러 와','하늘이 참 파래요','동생이 울어요','친구와 공을 차요','아빠는 키가 커요',
 '토끼가 깡충 뛰어요','오늘은 비가 와요','책을 읽어요','꽃이 활짝 피었어요','나는 학교에 가요','고양이가 잠을 자요','물을 많이 마셔요','손을 깨끗이 씻어요'];
const SKN={nob:'받침 없는 낱말',bat:'받침 있는 낱말',tricky:'소리와 다른 낱말',tense:'된소리 낱말'};
const ko=t=>`<span class="ko">${t}</span>`,syl=s=>({v:s,html:ko(s)});

/* 글자 블록 받아쓰기: 들은 낱말을 글자 블록으로. 헷갈리는 블록이 섞여 있어요 */
function mkBlocks(kind){const [w,em,s]=K.pick(L[kind]);const sy=w.split('');
  let wrong=[];if(s)wrong=s.split('').filter((x,i)=>x!==sy[i]);
  sy.forEach(x=>{const c=H.confuse(x).filter(y=>!sy.includes(y)&&!wrong.includes(y));if(c.length&&wrong.length<sy.length+1)wrong.push(K.pick(c))});
  wrong=[...new Set(wrong)].filter(x=>!sy.includes(x)).slice(0,Math.max(2,sy.length));
  return {type:'quiz',skill:kind,word:w,prompt:'잘 듣고 글자 블록을 순서대로 놓아요',listen:{text:w,lang:'ko-KR',rate:.8},show:em?`<span class="big">${em}</span>`:'',
    frame:sy.map((_,i)=>i),ans:sy,opts:K.shuffle([...new Set(sy)].concat(wrong)).map(syl),join:'',
    hints:[`모두 <b>${sy.length}글자</b>야. 🔊 천천히 듣기를 누르고 한 글자씩 손뼉 쳐 봐!`,s?`소리는 <b>[${s}]</b>처럼 나지만 쓸 때는 달라! 낱말의 뜻을 생각해 봐.`:'받침이 있는지 없는지 귀 기울여 들어 봐.'],
    line:`맞아! ${w}!`,trayLabel:'글자 블록을 끌어다 칸에 놓아요. 헷갈리는 블록도 섞여 있어요',
    why:g=>{const bad=g.map((x,i)=>x!==sy[i]?i+1:0).filter(Boolean);return s&&g.join('')===s?`소리 나는 대로 썼구나! [${s}]라고 들리지만 바르게 쓰면 달라.`:`${bad.join(', ')}번째 글자를 다시 들어 봐.`}}}

/* 화면에 손으로 쓰기 */
function mkWrite(kind){const [w,em,s]=K.pick(L[kind]);
  return {type:'write',skill:'w_'+kind,word:w,prompt:'잘 듣고 칸에 직접 써 보세요',hints:[`모두 <b>${w.length}글자</b>야. 한 칸에 한 글자씩!`,s?`소리는 [${s}]처럼 들려도 쓰는 건 달라. 받침을 잘 생각해 봐.`:'받침이 있는 글자는 아래쪽에 받침을 써야 해.'],
    tip:s?`소리는 [${s}]지만 <b>${w}</b>라고 써.`:''}}
function mkWriteSent(){const t=K.pick(SENT);
  return {type:'write',skill:'w_sent',word:t,cells:t.length,prompt:'잘 듣고 문장을 써 보세요. 띄어 쓰는 곳은 한 칸 비워요',hints:['어디서 띄어 읽는지 잘 들어 봐. 한 칸 비우는 곳이야.','문장 끝에는 마침표를 찍지 않아도 괜찮아.']}}

/* 띄어쓰기: 글자 사이를 눌러서 띄울 곳에 ∨ */
function space(p,G){const chars=p.text.replace(/ /g,'').split('');const ans=new Set();let k=0;p.text.split('').forEach(c=>{if(c===' ')ans.add(k);else k++});
  const on=new Set();
  G.html(`<div class="qline"><span class="tag q">문제</span>띄어 써야 할 곳을 눌러서 ∨를 표시해요</div>
   <div class="listen-row"><button class="listen" id="lsn">🔊</button><button class="listen slow" id="lsn2">천천히</button></div>
   <div class="sp-row" id="sp">${chars.map((c,i)=>(i?`<button class="sp-gap" data-g="${i}" aria-label="${i}번째 사이"></button>`:'')+`<span class="sp-ch">${c}</span>`).join('')}</div>`);
  G.hideTray();
  const play=r=>K.speakLang(p.text,'ko-KR',r);K.$('#lsn').onclick=()=>play(.85);K.$('#lsn2').onclick=()=>play(.55);K.later(()=>play(.85),600);
  G.board.querySelector('#sp').addEventListener('click',e=>{const b=e.target.closest('.sp-gap');if(!b||G.P.done)return;const g=+b.dataset.g;on.has(g)?on.delete(g):on.add(g);b.classList.toggle('on');b.classList.remove('bad');K.sfx.pick();G.edit()});
  const str=()=>chars.map((c,i)=>(on.has(i)?' ':'')+c).join('');
  G.answer({ready:()=>true,hints:['누가? 무엇을? 어떻게? 하고 <b>끊어 읽는 곳</b>이 띄어 쓰는 곳이야.',`이 문장은 <b>${ans.size}군데</b>를 띄어 써. '가, 를, 는, 에' 같은 말은 앞말에 붙여 써!`],
    check:()=>{const bad=[...new Set([...on,...ans])].filter(g=>on.has(g)!==ans.has(g));G.board.querySelectorAll('.sp-gap').forEach(b=>b.classList.remove('bad'));
      if(!bad.length)return {ok:true,line:`맞아! "${p.text}" 띄어쓰기 대장!`};
      if(G.P.wrong>=1)bad.forEach(g=>{const b=G.board.querySelector(`.sp-gap[data-g="${g}"]`);b&&b.classList.add('bad')});
      return {ok:false,note:str(),why:G.P.wrong>=1?'빨간 곳을 다시 봐!':`${bad.length}군데가 달라. 소리 내서 끊어 읽어 볼까?`}}});
  G.say('잘 듣고, 글자 사이를 눌러서 띄어 쓸 곳에 ∨를 표시해 봐!');
}
function mkSpace(){return {type:'space',skill:'space',text:K.pick(SENT)}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('dict',{id:'blocks',name:'블록 받아쓰기',desc:'듣고 글자 블록 놓기',emoji:'🧱',color:'#FFE6F0',hello:'잘 듣고 글자 블록으로 써 볼까?',types:{quiz},
  skills:SKN,
  tip:{t:'소리와 글자가 다를 때',b:`<p>'같이'는 [가치]로 소리 나요. 소리 나는 대로 쓰는 실수는 <b>낱말 뜻</b>을 떠올리게 하면 줄어요.</p><div class="say-line">'같이'는 '같다'에서 왔어. 그래서 ㅌ 받침을 써.</div><p>리포트에서 어떤 받침을 헷갈리는지 볼 수 있어요.</p>`},
  levels:[{id:'l1',name:'받침 없는 낱말',desc:'나비, 기차',emoji:'🦋',gen:S(6,()=>mkBlocks('nob'))},
   {id:'l2',name:'받침 있는 낱말',desc:'사람, 연필',emoji:'✏️',gen:S(6,()=>mkBlocks('bat'))},
   {id:'l3',name:'된소리 낱말',desc:'딸기, 토끼',emoji:'🍓',gen:S(6,()=>mkBlocks('tense'))},
   {id:'l4',name:'소리와 다른 낱말',desc:'같이, 해돋이',emoji:'🤔',gen:S(6,()=>mkBlocks('tricky'))}]});
K.area('dict',{id:'hand',name:'손글씨 받아쓰기',desc:'화면에 직접 써요',emoji:'✍️',color:'#E3F6E0',hello:'손가락이나 펜으로 화면에 써 볼까?',types:{write},
  skills:{w_nob:'받침 없는 낱말 쓰기',w_bat:'받침 있는 낱말 쓰기',w_tense:'된소리 쓰기',w_tricky:'소리와 다른 낱말 쓰기',w_sent:'문장 쓰기'},
  tip:{t:'쓴 글씨는 리포트에',b:`<p>아이가 쓴 글씨는 사진으로 남아서 부모님 리포트에서 볼 수 있어요. 다 쓰면 정답을 보여 주고 <b>아이가 스스로 비교</b>해요.</p><p>태블릿 펜이나 손가락 모두 돼요. 글씨 모양보다 <b>맞춤법</b>을 먼저 봐 주세요.</p>`},
  levels:[{id:'l1',name:'받침 없는 낱말',desc:'또박또박 써요',emoji:'✏️',gen:S(5,()=>mkWrite('nob'))},
   {id:'l2',name:'받침 있는 낱말',desc:'받침을 아래에',emoji:'🖊️',gen:S(5,()=>mkWrite('bat'))},
   {id:'l3',name:'된소리 낱말',desc:'ㄲ ㄸ ㅃ ㅆ ㅉ',emoji:'💪',gen:S(5,()=>mkWrite('tense'))},
   {id:'l4',name:'소리와 다른 낱말',desc:'같이, 꽃잎',emoji:'🧐',gen:S(5,()=>mkWrite('tricky'))},
   {id:'l5',name:'문장 쓰기',desc:'띄어쓰기까지',emoji:'📝',gen:S(4,mkWriteSent)}]});
K.area('dict',{id:'space',name:'띄어쓰기',desc:'어디서 띄울까?',emoji:'↔️',color:'#FFF1B8',hello:'어디서 띄어 쓸까?',types:{space},
  skills:{space:'띄어쓰기'},
  tip:{t:'끊어 읽는 곳',b:`<p>소리 내어 읽을 때 <b>숨 쉬는 곳</b>이 띄어 쓰는 곳이에요. '가, 를, 은, 에' 같은 말은 앞말에 붙여 써요.</p>`},
  levels:[{id:'l1',name:'문장 띄어쓰기',desc:'∨ 표시하기',emoji:'↔️',gen:S(5,mkSpace)}]});
})();
