/* 길콩 더하기 · 안·밖·위·아래·옆·사이 */
'use strict';
(()=>{
const {quiz}=K.TYPES;
const POS=['위','아래','안','밖','옆','사이'];
const ANI=['🐱','🐶','🐰','🐻','🐥','⚽','🧸','🍎'];
const NAME={'🐱':'고양이','🐶':'강아지','🐰':'토끼','🐻':'곰','🐥':'병아리','⚽':'공','🧸':'곰 인형','🍎':'사과'};
/* 장면 그리기 (크기 s배) */
function scene(pos,a,s=1){const W=150*s,H=110*s,f=34*s;const el=(x,y,e,fs=f)=>`<span style="position:absolute;left:${x*s}px;top:${y*s}px;font-size:${fs}px;line-height:1">${e}</span>`;
  let h='';
  if(pos==='위'||pos==='아래'||pos==='옆'){/* 책상 */
    h+=`<i style="position:absolute;left:${30*s}px;top:${52*s}px;width:${90*s}px;height:${9*s}px;background:#B07A4E;border-radius:3px"></i><i style="position:absolute;left:${36*s}px;top:${60*s}px;width:${7*s}px;height:${44*s}px;background:#8C5E3C"></i><i style="position:absolute;left:${107*s}px;top:${60*s}px;width:${7*s}px;height:${44*s}px;background:#8C5E3C"></i>`;
    h+=pos==='위'?el(58,18,a):pos==='아래'?el(58,68,a):el(122,68,a,f*.9);}
  else if(pos==='안'||pos==='밖'){/* 상자 (앞이 낮아서 안이 보여요) */
    h+=pos==='안'?el(56,30,a):el(118,62,a,f*.9);
    h+=`<i style="position:absolute;left:${36*s}px;top:${58*s}px;width:${76*s}px;height:${46*s}px;background:#D9A066;border:${3*s}px solid #A8743F;border-radius:${4*s}px;box-sizing:border-box"></i><i style="position:absolute;left:${36*s}px;top:${50*s}px;width:${76*s}px;height:${10*s}px;background:#C48A52;border-radius:${3*s}px ${3*s}px 0 0"></i>`;}
  else{/* 사이 */h+=el(8,50,'🌳',f*1.1)+el(58,62,a)+el(104,50,'🌳',f*1.1)}
  return `<span style="position:relative;display:inline-block;width:${W}px;height:${H}px;background:#FFFBF3;border-radius:${12*s}px">${h}</span>`}
const place=p=>p==='위'||p==='아래'||p==='옆'?'책상':p==='사이'?'나무':'상자';
const chip=p=>({v:p,html:`<span class="ko" style="font-size:22px">${p}</span>`});

function mkWhere(){const p=K.pick(POS),a=K.pick(ANI),n=NAME[a];const pl=place(p);
  const opts=K.shuffle([p].concat(K.pickN(POS.filter(x=>x!==p&&!(p==='옆'&&x==='밖')&&!(p==='밖'&&x==='옆')),3)));
  return {type:'quiz',skill:'where',prompt:`${n}${K.josa(n,'은')} 어디에 있나요?`,show:scene(p,a,1.6),wrapf:true,frame:[`<span>${n}${K.josa(n,'은')} ${pl}${p==='사이'?' 두 그루':''}</span>`,0,'<span>에 있어요</span>'],
    ans:[p],opts:opts.map(chip),hints:[`${pl}${K.josa(pl,'을')} 먼저 찾고, ${n}${K.josa(n,'이')} ${pl}보다 높은지, 낮은지, 들어갔는지 봐.`,p==='사이'?'양쪽에 하나씩 있고 가운데 있으면 "사이"야.':'손가락으로 그림을 짚으면서 말해 봐.'],
    line:`맞아! ${n}${K.josa(n,'은')} ${pl}${p==='사이'?' 두 그루':''} ${p}에 있어요.`,speak:{text:`${pl} ${p}`,lang:'ko-KR'}}}
function mkFind(){const a=K.pick(ANI),n=NAME[a];const set=K.pickN(['위','아래','안','밖','사이'],4);const p=set[0];const pl=place(p);
  return {type:'quiz',skill:'find',prompt:`<b>${n}${K.josa(n,'이')} ${pl}${p==='사이'?' 두 그루':''} ${p}</b>에 있는 그림을 칸에 놓아요`,frame:[0],ans:[p],
    opts:K.shuffle(set).map(x=>({v:x,html:scene(x,a,.55)})),hints:[`"${p}"는 어떤 모습일까? 손으로 흉내 내 봐.`,'그림을 하나씩 보며 말로 해 봐: "이건 위, 이건 안…"'],line:`맞아! ${pl} ${p}!`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('way',{id:'in',name:'안·밖·사이',desc:'어디에 있을까?',emoji:'📦',color:'#FFE6F0',hello:'위, 아래, 안, 밖, 옆, 사이! 어디 있는지 말해 볼까?',types:{quiz},
  skills:{where:'자리 말하기',find:'자리 그림 찾기'},
  tip:{t:'집에서 숨바꼭질',b:`<p>인형을 상자 <b>안</b>, 책상 <b>아래</b>에 숨기고 "어디 있어?" 하고 물어보세요. 자리 말로 대답하게 하면 금방 익혀요.</p>`},
  levels:[{id:'i1',name:'어디에 있나요?',desc:'위, 아래, 안, 밖',emoji:'📦',age:6,gen:S(6,mkWhere)},{id:'i2',name:'그림 찾기',desc:'상자 안에 있는 그림은?',emoji:'🔍',age:6,gen:S(6,mkFind)}]});
})();
