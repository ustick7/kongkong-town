/* 길콩 · 위치와 방향 (왼쪽·오른쪽, 위·아래·앞·뒤, 화살표 길 찾기) */
'use strict';
(()=>{
const {quiz}=K.TYPES;
K.css(`
.lrrow{display:flex;gap:6px;justify-content:center;align-items:flex-end;font-size:46px;line-height:1.1;font-family:var(--f-emoji);flex-wrap:nowrap}
.lrrow span{display:flex;flex-direction:column;align-items:center}
.lrrow small{font-family:var(--f-disp);font-size:13px;color:var(--muted);opacity:0;transition:opacity .3s}
.lrrow.num small{opacity:1}
.lrlab{display:flex;justify-content:space-between;font-family:var(--f-disp);font-size:18px;color:var(--blue-d);opacity:0;transition:opacity .4s;padding:0 4px}
.lrlab.on{opacity:1}
.shelf3{display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(3,64px);gap:0;margin:0 auto;border:5px solid var(--wood);border-radius:10px;background:var(--s-wood)}
.shelf3 span{display:flex;align-items:center;justify-content:center;font-size:40px;border:2px solid var(--wood);font-family:var(--f-emoji)}
.queue{display:flex;align-items:flex-end;gap:4px;justify-content:center;font-size:42px;font-family:var(--f-emoji)}
.queue .flag{font-family:var(--f-disp);font-size:15px;color:var(--orange-d);display:flex;flex-direction:column;align-items:center}
.grid-map{display:grid;gap:4px;margin:0 auto;background:var(--s-green);padding:6px;border-radius:16px;position:relative}
.grid-map i{width:var(--gc);height:var(--gc);border-radius:10px;background:var(--paper);display:flex;align-items:center;justify-content:center;font-style:normal;font-size:calc(var(--gc)*.62);font-family:var(--f-emoji);position:relative}
.grid-map i.rock{background:transparent}
.grid-map i.step:after{content:'';position:absolute;width:30%;height:30%;border-radius:50%;background:var(--orange);opacity:.75}
.grid-map i.bad{box-shadow:inset 0 0 0 3px var(--red)}
.arrows{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.arrows .slot{min-width:58px;min-height:58px;padding:2px}
.arrows .slot .stuck{font-size:30px}
`);
const ANI=['🐶','🐱','🐰','🐻','🐼','🐸','🐷','🦊','🐯','🐨','🐵','🐤'];
const FR=['🍎','🍌','🍇','🍓','🍉','🍒','🍑','🥕','🍄','🌽','🧁','🍪'];
const NAME={'🐶':'강아지','🐱':'고양이','🐰':'토끼','🐻':'곰','🐼':'판다','🐸':'개구리','🐷':'돼지','🦊':'여우','🐯':'호랑이','🐨':'코알라','🐵':'원숭이','🐤':'병아리',
 '🍎':'사과','🍌':'바나나','🍇':'포도','🍓':'딸기','🍉':'수박','🍒':'체리','🍑':'복숭아','🥕':'당근','🍄':'버섯','🌽':'옥수수','🧁':'컵케이크','🍪':'쿠키'};
const nm=e=>NAME[e]||e;
const em=e=>({v:e,html:`<span class="em">${e}</span>`,label:nm(e)});
const LR=[{v:'L',html:'<span class="ko">⬅️ 왼쪽</span>'},{v:'R',html:'<span class="ko">오른쪽 ➡️</span>'}];
const row=(items,num)=>`<div class="lrrow ${num?'':''}" id="row">${items.map((e,i)=>`<span>${e}<small>${i+1}</small></span>`).join('')}</div><div class="lrlab" id="lrlab"><span>⬅️ 왼쪽</span><span>오른쪽 ➡️</span></div>`;
const showLab=()=>{const l=K.$('#lrlab');l&&l.classList.add('on')};
const handHint='밥 먹을 때 <b>숟가락을 드는 손</b> 쪽이 오른쪽이야. 그 손을 들어 보고 화면을 봐!';

/* 왼쪽·오른쪽 */
function mkLR(kind){const pool=K.shuffle(Math.random()<.5?ANI:FR);
  if(kind==='side'){const [a,b]=pool;const aLeft=Math.random()<.5;const items=aLeft?[a,b]:[b,a];
    return {type:'quiz',skill:'side',prompt:`${a} ${nm(a)}${K.josa(nm(a),'은')} ${b} ${nm(b)}의 어느 쪽에 있나요?`,show:row(items),frame:[0],ans:[aLeft?'L':'R'],opts:LR,wide:true,
      hints:[handHint,()=>{showLab();K.say('화면 아래에 왼쪽, 오른쪽을 적어 줬어!')}],line:`맞아! ${nm(a)}${K.josa(nm(a),'은')} ${nm(b)}의 ${aLeft?'왼쪽':'오른쪽'}에 있어!`,
      why:()=>'반대쪽이야! 오른손을 들고 다시 봐.'}}
  const items=pool.slice(0,5);
  if(kind==='next'){const i=K.ri(1,3),dir=Math.random()<.5?'L':'R';const ans=items[dir==='L'?i-1:i+1],wrongSide=items[dir==='L'?i+1:i-1];
    return {type:'quiz',skill:'next',prompt:`${items[i]} ${nm(items[i])}의 <b>바로 ${dir==='L'?'왼쪽':'오른쪽'}</b>에 있는 것을 칸에 놓아요`,show:row(items),frame:[0],ans:[ans],opts:items.filter(x=>x!==items[i]).map(em),
      hints:[`먼저 ${items[i]}를 찾아 손가락을 올려. 그다음 ${dir==='L'?'왼쪽':'오른쪽'}으로 한 칸만 가 봐!`,()=>{showLab();K.say('왼쪽, 오른쪽을 아래에 적어 줬어!')}],line:`맞아! ${nm(items[i])}의 바로 ${dir==='L'?'왼쪽':'오른쪽'}은 ${nm(ans)}!`,
      why:g=>g[0]===wrongSide?'반대쪽으로 갔어! 왼쪽과 오른쪽을 다시 확인해 봐.':''}}
  const from=Math.random()<.5?'L':'R',n=K.ri(2,4);const ans=from==='L'?items[n-1]:items[5-n];const mirror=from==='L'?items[5-n]:items[n-1];
  return {type:'quiz',skill:'nth',prompt:`<b>${from==='L'?'왼쪽':'오른쪽'}에서 ${n}번째</b>에 있는 것을 칸에 놓아요`,show:row(items),frame:[0],ans:[ans],opts:items.map(em),
    hints:[`${from==='L'?'왼쪽':'오른쪽'} 끝에서부터 손가락으로 하나, 둘… 세어 봐.`,()=>{showLab();K.say('어느 쪽이 왼쪽인지 아래에 적어 줬어!')}],line:`맞아! ${from==='L'?'왼쪽':'오른쪽'}에서 ${n}번째는 ${nm(ans)}!`,
    why:g=>g[0]===mirror&&mirror!==ans?'반대쪽 끝에서 셌구나! 어느 쪽에서 세는지 다시 봐.':''}}

/* 위·아래 (선반) */
function mkShelf(){const it=K.pickN(FR.concat(ANI),9);const c=K.ri(0,8),r=Math.floor(c/3),q=c%3;
  const dirs=[['위',-1,0],['아래',1,0],['왼쪽',0,-1],['오른쪽',0,1]].filter(([,dr,dq])=>r+dr>=0&&r+dr<3&&q+dq>=0&&q+dq<3);
  const [dn,dr,dq]=K.pick(dirs);const ans=it[(r+dr)*3+q+dq];const others=dirs.filter(d=>d[0]!==dn).map(([,a,b])=>it[(r+a)*3+q+b]);
  const opts=K.shuffle([ans].concat(others.slice(0,2),K.pickN(it.filter(x=>x!==ans&&!others.includes(x)&&x!==it[c]),1)));
  return {type:'quiz',skill:dn==='위'||dn==='아래'?'updown':'shelf',prompt:`${it[c]} ${nm(it[c])}의 <b>바로 ${dn}</b> 칸에 있는 것은?`,show:`<div class="shelf3">${it.map(e=>`<span>${e}</span>`).join('')}</div>`,frame:[0],ans:[ans],opts:opts.map(em),
    hints:[`${it[c]}를 먼저 찾아. 거기서 <b>${dn}</b>로 한 칸만 움직여 봐!`,dn==='위'?'위는 하늘 쪽, 머리 쪽이야.':dn==='아래'?'아래는 땅 쪽, 발 쪽이야.':handHint],line:`맞아! ${nm(it[c])} 바로 ${dn}에는 ${nm(ans)}!`,
    why:g=>others.includes(g[0])?'옆 칸으로 갔어! 방향을 다시 읽어 볼까?':''}}
/* 앞·뒤 (줄 서기) */
function mkQueue(){const it=K.pickN(ANI,5);const kind=K.pick(['behind','front','nth']);let q,ans,why='';
  if(kind==='nth'){const n=K.ri(2,4);const back=Math.random()<.5;ans=back?it[5-n]:it[n-1];q=`<b>${back?'뒤':'앞'}에서 ${n}번째</b>에 서 있는 친구는?`;why=`${back?'뒤':'앞'}에서부터 세었는지 확인해 봐!`}
  else{const i=K.ri(1,3);ans=kind==='behind'?it[i+1]:it[i-1];q=`${it[i]} ${nm(it[i])} <b>바로 ${kind==='behind'?'뒤':'앞'}</b>에 서 있는 친구는?`;why=`${nm(it[i])}에서 ${kind==='behind'?'뒤':'앞'}쪽으로 한 칸이야. 🚩가 있는 쪽이 앞이야!`}
  return {type:'quiz',skill:'queue',prompt:`줄을 서 있어요. ${q}`,show:`<div class="queue"><span class="flag">🚩<span>맨 앞</span></span>${it.map(e=>`<span>${e}</span>`).join('')}<span class="flag">　<span>맨 뒤</span></span></div>`,frame:[0],ans:[ans],opts:it.map(em),
    hints:['깃발 🚩이 있는 쪽이 <b>앞</b>이야. 줄의 맨 앞에 선 친구부터 차례대로 봐.','앞에 선 친구가 먼저 들어가고, 뒤에 선 친구는 기다려.'],line:`맞아! ${nm(ans)}!`,why:()=>why}}

/* 화살표 길 찾기 */
const DIR={U:[-1,0,'⬆️'],D:[1,0,'⬇️'],L:[0,-1,'⬅️'],R:[0,1,'➡️']};
function bfs(n,rocks,s,g){const key=(r,c)=>r*n+c;const prev={};prev[key(...s)]=-1;const q=[s];while(q.length){const [r,c]=q.shift();if(r===g[0]&&c===g[1]){let k=key(r,c),d=0;while(prev[k]!==-1){k=prev[k];d++}return d}
  for(const [dr,dc] of Object.values(DIR)){const nr=r+dr,nc=c+dc,k=key(nr,nc);if(nr<0||nc<0||nr>=n||nc>=n||rocks.has(k)||k in prev)continue;prev[k]=key(r,c);q.push([nr,nc])}}return -1}
function mkPath(n,nr,minD,maxD){for(let t=0;t<200;t++){const s=[K.ri(0,n-1),K.ri(0,n-1)],g=[K.ri(0,n-1),K.ri(0,n-1)];const rocks=new Set();
    while(rocks.size<nr){const k=K.ri(0,n*n-1);if(k!==s[0]*n+s[1]&&k!==g[0]*n+g[1])rocks.add(k)}
    const d=bfs(n,rocks,s,g);if(d>=minD&&d<=maxD){const hero=K.pick(['🐰','🐶','🐻','🐱']),goal={'🐰':'🥕','🐶':'🦴','🐻':'🍯','🐱':'🐟'}[hero];
      return {type:'path',skill:nr?'path2':'path1',n,rocks:[...rocks],s,g,d,hero,goal}}}
  return {type:'path',skill:'path1',n:3,rocks:[],s:[0,0],g:[0,2],d:2,hero:'🐰',goal:'🥕'}}
function path(p,G){const n=p.n,gc=n>4?46:n>3?54:64;const rocks=new Set(p.rocks);
  G.html(`<div class="qline"><span class="tag q">문제</span>${p.hero}가 ${p.goal}까지 가려면? 화살표 <b>${p.d}개</b>를 순서대로 놓아요</div>
   <div class="grid-map" id="gm" style="--gc:${gc}px;grid-template-columns:repeat(${n},var(--gc))">${Array.from({length:n*n},(_,k)=>{const r=Math.floor(k/n),c=k%n;
     return `<i data-k="${k}" class="${rocks.has(k)?'rock':''}">${r===p.s[0]&&c===p.s[1]?p.hero:r===p.g[0]&&c===p.g[1]?p.goal:rocks.has(k)?'🪨':''}</i>`}).join('')}</div>
   <div class="arrows" id="arr">${Array.from({length:p.d},(_,i)=>`<div class="slot" data-k="${i}">${i+1}</div>`).join('')}</div>`);
  G.board.querySelectorAll('#arr .slot').forEach(el=>G.slot(el,'s'+el.dataset.k));
  G.stickers(Object.entries(DIR).map(([k,v])=>({v:k,html:`<span class="em">${v[2]}</span>`})),'화살표를 끌어다 1번 칸부터 놓아요. 같은 화살표를 여러 번 써도 돼요');
  const walk=v=>{let r=p.s[0],c=p.s[1];const steps=[];for(let i=0;i<p.d;i++){const a=v['s'+i];if(!a)break;const [dr,dc]=DIR[a.v];r+=dr;c+=dc;
      if(r<0||c<0||r>=n||c>=n||rocks.has(r*n+c))return {steps,bad:true,at:[r,c]};steps.push([r,c])}return {steps,end:[r,c]}};
  const trace=()=>{const v=G.vals;G.board.querySelectorAll('#gm i').forEach(i=>i.classList.remove('step','bad'));const w=walk(v);
    w.steps.forEach(([r,c],i)=>K.later(()=>{const el=G.board.querySelector(`#gm i[data-k="${r*n+c}"]`);el&&el.classList.add('step');K.sfx.pick()},i*350));
    if(w.bad)K.later(()=>{const [r,c]=w.at;const el=G.board.querySelector(`#gm i[data-k="${r*n+c}"]`);el&&el.classList.add('bad');K.say('여기서 막혔어! 바위나 벽에 부딪혔어.')},w.steps.length*350)};
  G.onChange=()=>G.board.querySelectorAll('#gm i').forEach(i=>i.classList.remove('step','bad'));
  G.answer({ready:v=>Array.from({length:p.d},(_,i)=>v['s'+i]).every(Boolean),
    hints:[()=>{trace();G.say('지금 놓은 화살표대로 한 칸씩 따라가 볼게! 어디서 틀렸는지 봐.')},()=>{const dr=p.g[0]-p.s[0],dc=p.g[1]-p.s[1];G.say(`${p.goal}는 ${p.hero}보다 ${dc?`${Math.abs(dc)}칸 ${dc>0?'오른쪽':'왼쪽'}`:''}${dc&&dr?', ':''}${dr?`${Math.abs(dr)}칸 ${dr>0?'아래':'위'}`:''}에 있어. 바위는 돌아가야 해!`)}],
    check:v=>{const w=walk(v);const note=Array.from({length:p.d},(_,i)=>DIR[v['s'+i].v][2]).join('');
      if(!w.bad&&w.end[0]===p.g[0]&&w.end[1]===p.g[1]){trace();return {ok:true,line:`도착! ${p.hero}가 ${p.goal}를 찾았어!`}}
      return {ok:false,note,why:w.bad?'가다가 바위나 벽에 부딪혀.':`${p.goal}까지 못 갔어.`}}});
  G.say(p.say||`${p.hero}가 ${p.goal}까지 가는 길을 화살표로 알려 줘! 바위 🪨는 못 지나가.`);
}

const S=(n,fn)=>()=>K.makeSet(n,fn);
K.area('way',{id:'lr',name:'왼쪽 오른쪽',desc:'어느 쪽에 있을까?',emoji:'↔️',color:'#E3F0FF',hello:'왼쪽, 오른쪽 놀이 해 볼까? 숟가락 드는 손이 오른쪽!',types:{quiz},
  skills:{side:'왼쪽·오른쪽 구분',next:'바로 옆 찾기',nth:'몇 번째 세기'},
  tip:{t:'몸으로 익히는 왼쪽·오른쪽',b:`<p>왼쪽·오른쪽은 <b>내 몸을 기준으로</b> 익혀요. 오른손에 스티커나 팔찌를 붙여 주면 헷갈릴 때 바로 확인할 수 있어요.</p><div class="say-line">숟가락 드는 손이 어느 손이지? 그쪽이 오른쪽!</div><p>마주 보고 있는 사람의 왼쪽·오른쪽은 반대라서 7살에게 어려워요. 처음엔 같은 방향을 보고 연습해 주세요.</p>`},
  levels:[{id:'l1',name:'어느 쪽일까',desc:'왼쪽? 오른쪽?',emoji:'🖐️',gen:S(6,()=>mkLR('side'))},
   {id:'l2',name:'바로 옆',desc:'바로 왼쪽, 바로 오른쪽',emoji:'👉',gen:S(6,()=>mkLR('next'))},
   {id:'l3',name:'몇 번째',desc:'왼쪽에서 3번째',emoji:'🔢',gen:S(6,()=>mkLR('nth'))}]});
K.area('way',{id:'pos',name:'위아래 앞뒤',desc:'선반과 줄 서기',emoji:'🧸',color:'#FFF1B8',hello:'위, 아래, 앞, 뒤! 어디에 있을까?',types:{quiz},
  skills:{updown:'위·아래',shelf:'선반 옆 칸',queue:'앞·뒤'},
  tip:{t:'자리 말하기',b:`<p>정리할 때 "책은 장난감 <b>위</b> 칸에", "신발은 문 <b>앞</b>에"처럼 위치 말을 자주 써 주세요.</p>`},
  levels:[{id:'l1',name:'선반 위아래',desc:'바로 위, 바로 아래',emoji:'🗄️',gen:S(6,mkShelf)},
   {id:'l2',name:'줄 서기',desc:'앞, 뒤, 몇 번째',emoji:'🚶',gen:S(6,mkQueue)}]});
K.area('way',{id:'path',name:'길 찾기',desc:'화살표로 가는 길',emoji:'🗺️',color:'#E3F6E0',hello:'화살표로 길을 알려 줄까? 바위는 돌아가야 해!',types:{path},
  skills:{path1:'화살표 길 찾기',path2:'바위 돌아가기'},
  tip:{t:'코딩의 첫걸음',b:`<p>화살표 순서대로 움직이는 건 <b>코딩의 기초</b>예요. 아이가 손가락으로 한 칸씩 따라가며 말로 해 보게 해 주세요.</p><div class="say-line">오른쪽으로 한 칸, 그다음은?</div>`},
  levels:[{id:'l1',name:'짧은 길',desc:'화살표 2~3개',emoji:'🐾',gen:S(5,()=>mkPath(3,0,2,3))},
   {id:'l2',name:'바위 피하기',desc:'돌아가는 길',emoji:'🪨',gen:S(5,()=>mkPath(4,3,3,5))},
   {id:'l3',name:'먼 길',desc:'화살표 5~7개',emoji:'🧭',gen:S(5,()=>mkPath(5,5,5,7))}]});
})();
