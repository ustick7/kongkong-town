/* 시콩 더하기 · 달력: 요일, 어제·오늘·내일, 계절, 달 순서, 달력 읽기 */
'use strict';
(()=>{
const {quiz}=K.TYPES;
const DAY=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
const DC=['#F2665E','#5B4A42','#5B4A42','#5B4A42','#5B4A42','#5B4A42','#4A9FE8'];
const chip=d=>({v:d,html:`<span class="ko" style="font-size:18px">${d}</span>`});
const dayOpts=a=>K.shuffle([a].concat(K.pickN(DAY.filter(x=>x!==a),3))).map(chip);
const week=hi=>`<div style="display:flex;gap:4px;justify-content:center;flex-wrap:nowrap;width:min(330px,100%);margin:0 auto">${DAY.map((d,i)=>`<span style="flex:1 1 0;min-width:0;padding:8px 0;border-radius:10px;text-align:center;font-family:var(--f-disp);font-size:17px;background:${i===hi?'#FFD66B':'#FFFBF3'};color:${DC[i]};${i===hi?'box-shadow:0 0 0 3px #E8A200':''}">${d[0]}</span>`).join('')}</div>`;

function mkNext(){const i=K.ri(0,6);const after=Math.random()<.6;const a=DAY[(i+(after?1:6))%7];
  return {type:'quiz',skill:'dayseq',prompt:`<b>${DAY[i]}</b> ${after?'다음':'앞'}은 무슨 요일일까요?`,show:week(-1),frame:[0],ans:[a],opts:dayOpts(a),
    hints:['일, 월, 화, 수, 목, 금, 토! 노래처럼 불러 봐. 토요일 다음은 다시 일요일이야.',`위의 요일 줄에서 <b>${DAY[i][0]}</b>를 찾고 ${after?'오른쪽':'왼쪽'} 옆을 봐.`],line:`맞아! ${DAY[i]} ${after?'다음은':'앞은'} ${a}!`}}
function mkYT(){const i=K.ri(0,6);const ask=K.pick(['어제','내일','모레']);const d={어제:6,내일:1,모레:2}[ask];const a=DAY[(i+d)%7];
  return {type:'quiz',skill:'ytd',prompt:`오늘이 <b>${DAY[i]}</b>이면 <b>${ask}</b>는 무슨 요일일까요?`,show:week(i),frame:[0],ans:[a],opts:dayOpts(a),
    hints:[ask==='어제'?'어제는 오늘보다 <b>하루 전</b>이야.':ask==='내일'?'내일은 오늘보다 <b>하루 뒤</b>야.':'모레는 내일의 다음 날, <b>이틀 뒤</b>야.','노란 칸이 오늘이야. 거기서 손가락으로 움직여 봐.'],
    line:`맞아! 오늘이 ${DAY[i]}이면 ${ask}는 ${a}!`}}

const SEA={봄:['🌸','🌷','🐝','🦋','🌱'],여름:['🍉','🏖️','🌻','🌞','🍦'],가을:['🍂','🍁','🌰','🍎','🌾'],겨울:['⛄','🧤','🎄','❄️','🧣']};
const SK=Object.keys(SEA);
const seaChip=s=>({v:s,html:`<span class="ko" style="font-size:20px">${s}</span>`});
function mkSeason(){const s=K.pick(SK);const pics=K.pickN(SEA[s],3);
  return {type:'quiz',skill:'season',prompt:'그림을 보고 어느 <b>계절</b>인지 놓아요',show:`<span class="big" style="letter-spacing:6px">${pics.join('')}</span>`,frame:[0],ans:[s],opts:SK.map(seaChip),
    hints:['날씨가 덥니, 춥니? 그림 속 물건을 언제 쓰는지 생각해 봐.',`${pics[0]}는 언제 볼 수 있을까?`],line:`맞아! ${pics.join(' ')} ${s}!`}}
function mkSeasonNext(){const i=K.ri(0,3);const a=SK[(i+1)%4];
  return {type:'quiz',skill:'season2',prompt:`<b>${SK[i]}</b> 다음에 오는 계절은?`,show:`<span class="big">${SEA[SK[i]][0]}</span>`,frame:[0],ans:[a],opts:SK.map(seaChip),
    hints:['봄 → 여름 → 가을 → 겨울, 그리고 다시 봄!','계절은 동그라미처럼 돌고 돌아.'],line:`맞아! ${SK[i]} 다음은 ${a}!`}}
function mkMonth(){const m=K.ri(1,12);const a=m%12+1;const pool=[];for(let i=1;i<=12;i++)if(i!==a&&Math.abs(i-a)<=3)pool.push(i);
  return {type:'quiz',skill:'month',prompt:`<b>${m}월</b> 다음 달은 몇 월일까요?`,frame:[0,'<span class="op">월</span>'],ans:[a],nums:true,
    opts:K.shuffle([a].concat(K.pickN(pool,3))).sort((x,y)=>x-y).map(x=>({v:x,html:K.numHtml(x)})),
    hints:['1월부터 12월까지 있어. 차례로 세어 봐.',m===12?'12월이 끝나면 새해! 다시 처음으로 돌아가.':`${m} 다음 수는?`],line:`맞아! ${m}월 다음은 ${a}월!`}}
/* 달력 읽기 */
function cal(start,days,hi){let h=DAY.map((d,i)=>`<b style="color:${DC[i]};font-size:14px">${d[0]}</b>`).join('');
  for(let i=0;i<start;i++)h+='<i></i>';
  for(let d=1;d<=days;d++){const w=(start+d-1)%7;h+=`<span style="${d===hi?'background:#FFD66B;box-shadow:0 0 0 2px #E8A200;':''}color:${DC[w]}">${d}</span>`}
  return `<div class="calg" style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;max-width:330px;margin:0 auto;padding:8px;border-radius:14px;background:#FFFBF3;text-align:center;font-family:var(--f-disp);font-size:16px">${h}</div>`}
function mkCal(){const start=K.ri(0,6),days=K.pick([30,31]),m=K.ri(1,12),d=K.ri(2,days-1);const a=DAY[(start+d-1)%7];
  return {type:'quiz',skill:'cal',prompt:`달력에서 <b>${m}월 ${d}일</b>은 무슨 요일일까요?`,show:cal(start,days,d),frame:[0],ans:[a],opts:dayOpts(a),
    hints:[`노란 칸이 ${d}일이야.`,'노란 칸에서 <b>위로 쭉</b> 올라가면 요일이 있어!'],line:`맞아! ${m}월 ${d}일은 ${a}!`}}
function mkCalCount(){const start=K.ri(0,6),days=30,w=K.ri(0,6);let n=0;for(let d=1;d<=days;d++)if((start+d-1)%7===w)n++;
  return {type:'quiz',skill:'cal2',prompt:`이 달에 <b>${DAY[w]}</b>은 모두 몇 번 있을까요?`,show:cal(start,days,-1),frame:[0,'<span class="op">번</span>'],ans:[n],nums:true,
    opts:[3,4,5,6].map(x=>({v:x,html:K.numHtml(x)})),hints:[`맨 위에서 <b>${DAY[w][0]}</b>를 찾아.`,'그 아래로 쭉 내려가며 숫자를 세어 봐.'],line:`맞아! ${DAY[w]}은 ${n}번!`}}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('clock',{id:'cal',name:'달력',desc:'요일, 계절, 달',emoji:'🗓️',color:'#E3F6E0',hello:'달력을 보면 날짜를 알 수 있어!',types:{quiz},
  skills:{dayseq:'요일 순서',ytd:'어제·오늘·내일',season:'계절',season2:'계절 순서',month:'달 순서',cal:'달력 읽기',cal2:'요일 세기'},
  tip:{t:'매일 아침 달력 보기',b:`<p>아침마다 <b>"오늘은 무슨 요일?"</b> 하고 달력을 같이 보면 요일과 날짜가 저절로 익어요.</p><div class="say-line">오늘이 화요일이면 내일은?</div>`},
  levels:[{id:'d1',name:'요일 순서',desc:'월, 화, 수, 목…',emoji:'📆',age:6,gen:S(6,mkNext)},{id:'d2',name:'어제·오늘·내일',desc:'오늘이 수요일이면?',emoji:'⏭️',age:7,gen:S(6,mkYT)},
   {id:'d3',name:'계절',desc:'봄, 여름, 가을, 겨울',emoji:'🍂',age:6,gen:S(6,()=>K.pick([mkSeason,mkSeason,mkSeasonNext])())},{id:'d4',name:'몇 월',desc:'1월부터 12월',emoji:'🔢',age:7,gen:S(5,mkMonth)},
   {id:'d5',name:'달력 읽기',desc:'며칠은 무슨 요일?',emoji:'🗓️',age:8,gen:S(5,()=>K.pick([mkCal,mkCal,mkCalCount])())}]});
})();
