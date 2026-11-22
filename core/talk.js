/* 콩이 말투: 같은 말을 되풀이하지 않고, 상황에 맞게 골라서 사람처럼 말해요.
   - K.talk(종류, {값}) : 말 묶음에서 최근에 안 쓴 말을 골라요
   - K.okLine(정답줄, 결과) : 과목이 준 "맞아! …" 앞부분을 결과(혼자/힌트/고쳐서/연속)에 맞게 바꿔요
   - K.speak(글, 기분) : 문장마다 높낮이·빠르기를 조금씩 바꿔 읽고, 이모지는 읽지 않아요 */
'use strict';
(()=>{
const S=K.S;
const P={
 /* 처음 틀렸을 때 */
 wrong1:['음~ 아깝다! 한 번만 더 볼까?','앗, 살짝 달라. 다시 천천히 봐 볼래?','오, 거의 다 왔어! 어디가 다른지 찾아보자.','흠, 이건 아닌 것 같아. 다시 생각해 보자!','괜찮아 괜찮아, 처음엔 다 그래. 한 번 더!',
   '어라? 콩이 생각이랑은 좀 다르네. 다시 볼까?','아쉽다~ 그래도 방금 생각한 거 좋았어. 다시 해 보자!','앗, 미끄러졌다! 다시 해 보면 될 거야.','조금만 고치면 돼! 어디를 고칠까?','에이, 한 끗 차이야! 다시 한번 가 보자.',
   '틀려도 괜찮아. 틀리면서 머리가 쑥쑥 크는 거래!','오호, 다시 도전? 콩이는 네가 할 수 있는 거 알아.','천천히 해도 돼. 하나씩 다시 짚어 볼까?','음, 다시 보니까 어때? 뭔가 보이지 않아?'],
 /* 두 번째 */
 wrong2:['아직 조금 달라. 💡 힌트를 살짝 볼까?','괜찮아, 어려운 문제일수록 재밌는 거야. 힌트 써도 돼!','흠~ 이거 좀 까다롭다, 그치? 같이 천천히 보자.','포기하지 않는 거 진짜 멋지다! 힌트 보고 다시 해 볼까?',
   '콩이도 이런 거 헷갈려. 💡 힌트 한번 눌러 볼래?','거의 다 왔어. 한 칸씩 손가락으로 짚어 보자.','숨 한번 크게 쉬고~ 다시 해 보자!','어려운 건 당연해. 그래서 연습하는 거야!','방법을 바꿔 볼까? 다른 쪽부터 봐도 좋아.'],
 /* 세 번 이상 */
 wrong3:['계속 해 보는 거, 그게 제일 중요한 거야! 💡 힌트 같이 보자.','오늘은 이 문제가 좀 고집이 세네. 힌트 보면서 같이 풀자!','괜찮아, 틀리면서 크는 거야. 진짜야!','이렇게 끝까지 하는 친구는 꼭 잘하게 돼. 한 번 더!',
   '콩이가 옆에서 같이 볼게. 천천히 다시~','힘들면 힌트 써도 완전 괜찮아. 힌트도 공부야!'],
 /* 맞았을 때 앞말: 혼자 한 번에 */
 solo:['딩동댕!','오~ 정확해!','그렇지!','우와, 바로 맞혔네!','찰떡같이 맞혔어!','빙고!','역시~!','완벽해!','오, 대단한데?','와, 척척이다!','맞았어! 콩이 깜짝 놀랐어.','이야~ 멋지다!','정답! 머리가 반짝반짝!'],
 /* 힌트 보고 맞혔을 때 */
 hint:['힌트를 잘 써서 맞혔어!','그렇지! 힌트를 보고 딱 알아냈네.','좋아! 힌트 활용 최고야.','맞았어! 힌트를 보면 쉬워지지?','오~ 힌트로 길을 찾았구나!'],
 /* 틀린 뒤 고쳐서 맞혔을 때 */
 retry:['고쳐서 맞혔다! 포기 안 한 거 진짜 멋져.','그렇지! 다시 생각하니까 보였지?','해냈다! 틀린 걸 스스로 고친 게 최고야.','맞았어! 한 번 더 해 보길 잘했다, 그치?','오~ 끝까지 해서 맞혔네!','좋아! 실수를 고치는 게 진짜 실력이야.'],
 /* 연속으로 맞힐 때 덧붙이는 말 */
 streak3:['벌써 세 개 연속이야!','세 개 연속! 손이 빨라졌다!','오늘 감 좋은데? 세 개 연속!'],
 streak5:['다섯 개 연속! 완전 불붙었다! 🔥','우와, 다섯 개 연속이야! 콩이 박수 짝짝짝!','연속 다섯 개! 오늘 무슨 일이야?'],
 streak10:['열 개 연속!! 이건 전설이야!','10개 연속이라니, 콩이 기절할 뻔했어!'],
 /* 단계 끝 */
 end3:['{n} 완벽해! 혼자서 생각하는 힘이 쑥쑥 자랐어!','{n} 다 맞혔어! 오늘 진짜 최고다!','와, {n} 별 세 개! 콩이가 자랑하고 다닐 거야.','{n} 끝! 이 정도면 선생님 해도 되겠는데?','{n} 클리어! 머리가 반짝반짝 빛나는 게 보여!'],
 end2:['{n} 끝! 힌트를 잘 써서 해냈어. 대단해!','{n} 해냈다! 어려운 것도 끝까지 했네.','{n} 끝까지 왔어! 한 번 더 하면 별 세 개도 문제없겠다.','{n} 잘했어! 헷갈린 건 다음에 또 해 보자.'],
 end1:['{n} 끝까지 해냈어! 다시 하면 더 쉬워질 거야.','{n} 어려웠지? 그래도 끝까지 한 게 진짜 멋진 거야.','{n} 끝! 오늘 연습한 만큼 내일은 더 쉬울 거야.','끝까지 했다! {n}, 다음엔 콩이가 더 도와줄게.'],
 /* 받아쓰기: 틀린 글자 {b}{j} (예: '가가') */
 wbad:['아까워! {b}{j} 정답이랑 달라. 다시 써 보자!','앗, {b}{j} 조금 달라! 정답을 잘 보고 다시 써 볼까?','거의 다 맞았어! {b}{j} 살짝 다르네. 한 번 더!','음, {b}{j} 콩이 눈엔 다르게 보여. 다시 써 보자~'],
 /* 따라 말하기 성공 */
 sayok:['완벽해! 잘 말했어!','우와, 발음 짱이다!','또박또박 잘했어!','목소리 멋지다! 딱 맞아.','오~ 원어민 같은데?'],
 sayask:['잘 듣고 크게 따라 말해 봐!','이번엔 네 차례! 크게 말해 볼까?','콩이 따라 해 봐~ 크게!','들은 대로 큰 소리로 말해 보자!'],
 /* 마을 인사 */
 hiMorning:['좋은 아침{nm}! 오늘은 어느 집에 놀러 갈까?','{nm2}안녕! 아침부터 공부하러 왔어? 멋지다!','일찍 왔네{nm}! 콩이 막 일어났어. 같이 놀자!'],
 hiDay:['안녕{nm}! 오늘은 어느 집에 가 볼까?','{nm2}왔구나! 콩이 기다리고 있었어.','반가워{nm}! 오늘은 뭐 하고 놀까?','어서 와{nm}! 오늘도 재밌는 거 많아.'],
 hiNight:['저녁이네{nm}! 조금만 하고 푹 자자.','{nm2}안녕! 오늘 하루 어땠어? 하나만 같이 해 볼까?','밤에 왔구나{nm}! 눈 아프지 않게 조금만 하자.'],
};
const recent={};
const fill=(t,v)=>t.replace(/\{(\w+)\}/g,(_,k)=>v&&v[k]!=null?v[k]:'');
/* 최근에 쓴 말은 빼고 골라요 (묶음 크기의 절반만큼 기억) */
K.talk=(kind,v)=>{const a=P[kind];if(!a||!a.length)return '';const r=recent[kind]||(recent[kind]=[]);const keep=Math.max(1,Math.floor(a.length/2));
  const pool=a.filter(x=>!r.includes(x));const t=K.pick(pool.length?pool:a);r.push(t);while(r.length>keep)r.shift();return fill(t,v)};
K.talkPools=P;

/* 과목 정답 줄의 "맞아!" 부분을 결과에 맞게 바꿔요 */
const OPEN=/^\s*(맞아요?|맞았어요?|정답이야|정답|딩동댕|그렇지|좋아)\s*[!~.]*\s*/;
K.okLine=(line,res,streak)=>{line=line||'';const body=line.replace(OPEN,'');const had=body!==line||!line;
  const kind=res==='hint'?'hint':(res==='retry'||res==='hintretry')?'retry':'solo';let open=K.talk(kind);
  let tail='';if(res==='solo'){if(streak===3)tail=' '+K.talk('streak3');else if(streak===5)tail=' '+K.talk('streak5');else if(streak===10)tail=' '+K.talk('streak10')}
  return had?`${open} ${body}${tail}`.trim():`${line}${tail}`};
K.hello=()=>{const h=new Date().getHours();const nm=(S.parent&&S.parent.name)||'';const v={nm:nm?' '+nm:'',nm2:nm?nm+K.josa(nm,'야')+', ':''};
  return K.talk(h<11?'hiMorning':h>=19?'hiNight':'hiDay',v)};

/* ---------- 목소리 ---------- */
let voice=null;
const pickVoice=()=>{const vs=(window.speechSynthesis&&speechSynthesis.getVoices()||[]).filter(v=>/^ko/i.test(v.lang));if(!vs.length)return null;
  const score=v=>(/neural|natural|online|premium|enhanced|wavenet/i.test(v.name)?40:0)+(/google/i.test(v.name)?20:0)+(/samsung|yuna|sunhi|heami|injoon/i.test(v.name)?15:0)+(v.localService?0:5)+(v.default?2:0);
  return vs.sort((a,b)=>score(b)-score(a))[0]};
if('speechSynthesis' in window){voice=pickVoice();speechSynthesis.onvoiceschanged=()=>{voice=pickVoice()}}
/* 이모지·기호는 읽지 않고, 말하기 좋게 다듬어요 */
const clean=t=>String(t||'').replace(/<[^>]+>/g,'').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2B50}\u{2B55}\u{274C}]/gu,'').replace(/[~]+/g,'').replace(/…+/g,', ').replace(/[▶◀→←]/g,' ').replace(/\s+/g,' ').trim();
const MOOD={cheer:[1.04,1.28],comfort:[.9,1.06],ask:[.98,1.18],info:[.97,1.12]};
const moodOf=t=>/딩동댕|정확|맞혔|해냈|최고|대단|완벽|우와|와,|빙고|멋져|멋지다|연속/.test(t)?'cheer':/괜찮|아깝|아쉽|천천히|힘들|어려|틀려/.test(t)?'comfort':/\?$/.test(t)?'ask':'info';
K.speak=(text,mood)=>{if(!K.S.voice||!('speechSynthesis' in window)||!text)return;try{speechSynthesis.cancel();
  const t=clean(text);if(!t)return;const m=MOOD[mood||moodOf(t)]||MOOD.info;
  /* 문장마다 나눠서, 물음은 살짝 올리고 느낌표는 밝게, 조금씩 다르게 */
  const parts=t.match(/[^.!?]+[.!?]*/g)||[t];const jit=()=>(Math.random()-.5)*.08;
  parts.map(x=>x.trim()).filter(Boolean).forEach((s,i)=>{const u=new SpeechSynthesisUtterance(s);u.lang='ko-KR';if(voice)u.voice=voice;
    const q=/\?$/.test(s),ex=/!$/.test(s);u.rate=Math.max(.8,Math.min(1.15,m[0]+jit()+(i?.02:0)));u.pitch=Math.max(.9,Math.min(1.45,m[1]+jit()+(q?.08:0)+(ex?.05:0)));u.volume=1;speechSynthesis.speak(u)})}catch(e){}};
})();
