/* 생각콩(창의사고력) · 무게 비교 (시소) */
(()=>{
const {E,N}=K;
K.css(`
.ss{position:relative;height:var(--h);--isz:46px;--h:190px;--deg:0deg}
.ss.sm{--isz:25px;--h:96px}
.ss .beam{position:absolute;left:3%;right:3%;bottom:calc(var(--h)*.3);height:calc(var(--h)*.065);min-height:7px;
  background:linear-gradient(var(--wood),var(--wood-d));border-radius:8px;transform:rotate(var(--deg));transition:transform 1s cubic-bezier(.34,1.45,.5,1);z-index:2}
.ss.q .beam{animation:wob 1.4s ease-in-out infinite}
@keyframes wob{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
.ss .pan{position:absolute;bottom:100%;width:45%;min-height:calc(var(--isz)*1.15);display:flex;flex-wrap:wrap-reverse;justify-content:center;align-items:flex-end;align-content:flex-start;gap:0 1px;border-radius:14px 14px 0 0}
.ss .pan.L{left:0}.ss .pan.R{right:0}
.ss .pan[data-drop]{background:rgba(74,159,232,.08);outline:3px dashed rgba(74,159,232,.45);outline-offset:-3px;min-height:calc(var(--isz)*1.5)}
.ss .fulcrum{position:absolute;left:50%;bottom:calc(var(--h)*.02);width:calc(var(--h)*.36);height:calc(var(--h)*.3);transform:translateX(-50%);
  background:linear-gradient(#8C7A6B,#6E5E52);clip-path:polygon(50% 0,100% 100%,0 100%);z-index:1}
.ss:after{content:"";position:absolute;left:8%;right:8%;bottom:0;height:5px;border-radius:5px;background:rgba(61,46,40,.12)}
.ss .qm{position:absolute;left:50%;bottom:calc(var(--h)*.05);transform:translateX(-50%);width:calc(var(--h)*.2);height:calc(var(--h)*.2);border-radius:50%;
  background:var(--paper);color:var(--blue-d);font-size:calc(var(--h)*.14);display:none;align-items:center;justify-content:center;z-index:3;box-shadow:0 2px 0 var(--line)}
.ss.q .qm{display:flex}
.ss .mid{position:absolute;left:50%;bottom:0;width:calc(var(--h)*.42);height:calc(var(--h)*.36);transform:translateX(-50%);z-index:4;border-radius:14px;display:flex;align-items:center;justify-content:center}
.ss .mid[data-drop]{outline:3px dashed rgba(74,159,232,.45)}
.ss .it{font-size:calc(var(--isz)*var(--f,1));line-height:1.05;position:relative;display:inline-block}
.it.sw{animation:pop .45s cubic-bezier(.3,1.6,.5,1) both}
.it.sw:before{content:"";position:absolute;inset:-1px;border:2px dashed var(--orange);border-radius:10px}
.it.poof{animation:poof .38s ease-in forwards}
@keyframes poof{to{transform:scale(1.6) rotate(20deg);opacity:0;filter:blur(2px)}}
.it.tapme{cursor:pointer;animation:tapme .9s ease-in-out infinite}
.it.tapme:after{content:"👆";position:absolute;right:-6px;bottom:-14px;font-size:22px}
@keyframes tapme{50%{transform:scale(1.18)}}
.it.rm{cursor:pointer}
.pan .stuck{position:absolute;top:-36px;left:50%;margin-left:-17px}
.arrow-down{position:absolute;top:-58px;left:50%;margin-left:-15px;font-size:30px;animation:bounceD .7s ease-in-out infinite;z-index:5}
@keyframes bounceD{50%{transform:translateY(10px)}}
.qarea{position:relative;border-radius:20px;padding:6px 6px 4px;background:linear-gradient(var(--sky),#F7FBFF 70%,var(--grass) 70%)}
.bogi-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.bogi-row>.ss{flex:1 1 150px;max-width:260px}
.eqs{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px}
.ladder{display:flex;align-items:center;justify-content:center;gap:6px;font-size:36px;flex-wrap:wrap}
.ladder .gt{font-size:24px;color:var(--orange-d);font-family:var(--f-disp)}
.ladder .lb{display:block;font-size:13px;color:var(--muted);font-family:var(--f-disp);text-align:center}
.cards{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.card{width:92px;height:104px;border-radius:18px;background:var(--paper);border:3px dashed var(--blue);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;font-size:46px;font-family:var(--f-emoji)}
.card .nm{font-size:15px;color:var(--muted);font-family:var(--f-disp)}
.card .stuck{position:absolute;top:-22px;right:-10px;font-size:32px}
.found{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;min-height:30px}
`);

/* 시소 그리기 */
const tiltIcon=st=>{const y1={L:31,F:22,R:13}[st],y2={L:13,F:22,R:31}[st];
  return `<svg viewBox="0 0 64 44" aria-hidden="true"><path d="M32 22 L42 41 L22 41Z" fill="#8C7A6B"/><line x1="5" y1="${y1}" x2="59" y2="${y2}" stroke="#C98A4B" stroke-width="5" stroke-linecap="round"/>
  <circle cx="10" cy="${y1-6}" r="5" fill="#FF8A3D"/><circle cx="54" cy="${y2-6}" r="5" fill="#4A9FE8"/></svg>`};
const ssHTML=(id,{sm=false,dropL=false,dropR=false,mid=false}={})=>`<div class="ss ${sm?'sm':''}" id="${id}"><div class="beam"><div class="pan L" ${dropL?'data-drop="L"':''}></div><div class="pan R" ${dropR?'data-drop="R"':''}></div></div>
  <div class="fulcrum"></div><div class="qm">?</div>${mid?'<div class="mid" data-drop="mid"></div>':''}</div>`;
const itemEl=(k,cls='')=>{const s=document.createElement('span');s.className='it '+cls;s.dataset.k=k;s.textContent=E(k);s.setAttribute('aria-label',N(k));return s};
const fitPan=p=>{const n=p.querySelectorAll('.it').length;p.style.setProperty('--f',n<=2?1:n<=3?.86:n<=4?.74:n<=6?.6:n<=8?.5:.42)};
const fillPan=(p,list)=>{p.querySelectorAll('.it').forEach(x=>x.remove());list.forEach(k=>p.appendChild(itemEl(k)));fitPan(p)};
const setSS=(ss,L,R)=>{fillPan(ss.querySelector('.pan.L'),L);fillPan(ss.querySelector('.pan.R'),R)};
const tilt=(ss,st,deg)=>{ss.classList.toggle('q',st==='?');const d=deg!=null?deg:11;ss.style.setProperty('--deg',st==='L'?-d+'deg':st==='R'?d+'deg':'0deg')};
const panItems=(ss,side)=>[...ss.querySelectorAll('.pan.'+side+' .it')].map(x=>x.dataset.k);
const TILT={L:{v:'L',html:tiltIcon('L'),label:'왼쪽이 쿵'},F:{v:'F',html:tiltIcon('F'),label:'평평해요'},R:{v:'R',html:tiltIcon('R'),label:'오른쪽이 쿵'}};

/* 무게 계산 */
const weight=(k,rules)=>{const r=rules.find(r=>r[0]===k);return r?r[2]*weight(r[1],rules):1};
const sumW=(list,rules)=>list.reduce((a,k)=>a+weight(k,rules),0);
const cmp=(a,b)=>a>b?'L':a<b?'R':'F';
const baseOf=rules=>{const froms=rules.map(r=>r[0]);return rules.map(r=>r[1]).find(k=>!froms.includes(k))};

/* 보기 */
const bogiHTML=rules=>`<div class="bogi" id="bogi"><span class="tag">보기</span><div class="bogi-row">${rules.map((r,i)=>ssHTML('b'+i,{sm:true})).join('')}</div><div class="eqs" id="eqs"></div></div>`;
const setupBogi=rules=>rules.forEach((r,i)=>{const s=K.$('#b'+i);setSS(s,[r[0]],Array(r[2]).fill(r[1]));tilt(s,'F')});
const showEqs=rules=>{const e=K.$('#eqs');if(e.children.length)return;rules.forEach((r,i)=>K.later(()=>{const d=document.createElement('span');d.className='eq em';d.innerHTML=`${E(r[0])}<span class="is">=</span>${E(r[1]).repeat(r[2])}`;e.appendChild(d)},i*500))};
const ruleLine=r=>`[${r[0]}] 1개와 [${r[1]}] ${r[2]}개는 <b>무게가 같아!</b>`;

/* 바꿔치기 */
function subItem(it,rules,done){const r=rules.find(r=>r[0]===it.dataset.k);if(!r)return;const pan=it.parentElement;it.classList.remove('tapme');it.classList.add('poof');K.sfx.poof();
  setTimeout(()=>{const fr=[];for(let i=0;i<r[2];i++)fr.push(itemEl(r[1],'sw'));it.replaceWith(...fr);fitPan(pan);done&&done()},380)}
const subTargets=(ss,rules)=>[...ss.querySelectorAll('.it')].filter(x=>rules.some(r=>r[0]===x.dataset.k));
function armTaps(ss,rules,onAll){const mark=()=>{const t=subTargets(ss,rules);t.forEach(x=>x.classList.add('tapme'));if(!t.length)onAll&&onAll()};
  ss.onclick=e=>{const it=e.target.closest('.it.tapme');if(!it)return;e.stopPropagation();subItem(it,rules,mark)};mark()}
function autoSub(ss,rules,onAll){const t=subTargets(ss,rules);if(!t.length){onAll&&onAll();return}let k=0;
  t.forEach((it,i)=>K.later(()=>subItem(it,rules,()=>{k++;if(k===t.length)K.later(()=>autoSub(ss,rules,onAll),300)}),i*450))}
function countUp(ss,sides,cb){let d=0;sides.forEach(side=>{const its=[...ss.querySelectorAll('.pan.'+side+' .it')];its.forEach((it,i)=>K.later(()=>{it.dataset.n=i+1;K.sfx.count()},d+i*380));d+=its.length*380+250});K.later(cb||(()=>{}),d)}
const clearNums=ss=>ss.querySelectorAll('[data-n]').forEach(x=>delete x.dataset.n);

/* 스티커 하나를 여러 곳 중 한 곳에 붙이는 문제 (붙인 걸 옮기거나 눌러서 뗄 수 있어요) */
function onePlace(G,targets,onSet){let cur=null;
  const render=()=>{G.board.querySelectorAll('.mark').forEach(m=>m.remove());if(!cur)return;const t=targets(cur.d);if(!t)return;
    const m=K.stuck(cur.pl.html);m.classList.add('mark');t.appendChild(m);m.addEventListener('click',e=>{e.stopPropagation();if(G.P.done)return;cur=null;K.sfx.pick();render();G.edit()})};
  G.drop((pl,d)=>{if(pl.kind!=='stk'||!targets(d))return;cur={pl,d};K.sfx.drop();render();G.edit();onSet&&onSet(cur)});
  return ()=>cur}

/* 1단계: 내려간 쪽이 무거워요 */
function heavy(p,G){
  G.html(`<div class="qline"><span class="tag q">문제</span>${'더 무거운 쪽에 ⭐, 똑같으면 가운데에 🟰를 붙여요'}</div><div class="qarea">${ssHTML('qss',{dropL:true,dropR:true,mid:true})}</div>`);
  const ss=K.$('#qss');setSS(ss,p.L,p.R);tilt(ss,'F');
  G.stickers([{v:'star',html:'<span class="em">⭐</span>',label:'더 무거워요'},{v:'eq',html:'<span class="em">🟰</span>',label:'똑같아요'}],'스티커를 끌어다 붙여요. 다른 곳에 다시 붙이면 옮겨져요');G.trayOff(true);
  K.later(()=>{tilt(ss,p.tilt);if(p.tilt!=='F')K.sfx.thud();G.trayOff(false)},900);
  const get=onePlace(G,d=>d==='L'||d==='R'?ss.querySelector('.pan.'+d):d==='mid'?ss.querySelector('.mid'):null);
  const hk=p.tilt==='L'?p.L[0]:p.R[0];
  G.answer({ready:()=>!!get(),hints:[
     ()=>G.say('시소를 잘 봐! 어느 쪽이 <b>땅에 더 가까워?</b> 평평한지도 살펴봐.'),
     ()=>G.say('아래로 내려간 쪽이 더 무거운 거야. 평평하면 양쪽이 똑같아.')],
    check:()=>{const c=get(),ok=p.tilt==='F'?(c.pl.v==='eq'&&c.d==='mid'):(c.pl.v==='star'&&c.d===p.tilt);
      const where={L:'왼쪽',R:'오른쪽',mid:'가운데'}[c.d];
      return ok?{ok:true,line:p.tilt==='F'?'맞아! 평평하면 양쪽 무게가 똑같아.':p.odd?`맞아! 진짜랑 달라도 시소 그림대로 [${hk}|이] 더 무거워!`:`맞아! 쿵 내려간 쪽, [${hk}|이] 더 무거워!`}
        :{ok:false,note:`${where}에 ${c.pl.v==='star'?'⭐':'🟰'}`}}});
  if(p.intro)G.say('시소는 <b>무거운 쪽이 쿵!</b> 내려가요. 아빠랑 시소 타면 아빠 쪽이 내려가지? 더 무거운 쪽에 ⭐를 붙이고 <b>다 했어요</b>!');
  else if(p.odd)G.say('어? 이 시소 나라에서는 어느 쪽이 내려갔지? 진짜 세상이랑 달라도 <b>시소 그림이 정답</b>이야.');
  else G.say('시소를 보고 알맞은 곳에 스티커를 붙여요!');
}

/* 2·4단계: 바꿔서 비교하기 */
function compare(p,G){
  G.html(`${bogiHTML(p.rules)}<div class="qline"><span class="tag q">문제</span>어느 쪽이 내려갈까요?</div>
   <div class="qarea" id="qa">${ssHTML('qss')}</div><div class="counts" id="cnt"></div><div class="slot-row"><div class="slot" id="slot">여기에<br>스티커를 붙여요</div></div>`);
  G.slot(K.$('#slot'),'s');
  setupBogi(p.rules);const ss=K.$('#qss');setSS(ss,p.L,p.R);tilt(ss,'?');
  const ans=cmp(sumW(p.L,p.rules),sumW(p.R,p.rules)),base=baseOf(p.rules);
  G.stickers([TILT.L,TILT.F,TILT.R]);
  const showCounts=()=>{K.$('#cnt').innerHTML=`<span class="pop">왼쪽 ${panItems(ss,'L').length}개</span><span class="pop">오른쪽 ${panItems(ss,'R').length}개</span>`};
  const after=()=>{G.hl(null);showCounts();G.say('모두 같은 것이 됐어! 이제 어느 쪽이 더 무거울까?')};
  G.answer({hints:[
     ()=>{G.hl('#bogi');showEqs(p.rules);G.say('<b>보기</b>를 다시 보자. 시소가 평평하지? '+p.rules.map(ruleLine).join(' 그리고 '))},
     ()=>{G.hl('#qa');if(!subTargets(ss,p.rules).length){after();return}const r=p.rules.find(r=>r[0]===subTargets(ss,p.rules)[0].dataset.k);
       G.say(`무게가 같으니까 바꿔도 돼! [${r[0]}|을] 톡! 눌러서 바꿔 봐.`);armTaps(ss,p.rules,after)}],
    check:v=>{const wl=sumW(p.L,p.rules),wr=sumW(p.R,p.rules);
      if(v.s.v===ans){K.later(()=>{tilt(ss,ans);if(ans!=='F')K.sfx.thud()},300);
        return {ok:true,line:ans==='F'?`맞아! [${base}]로 바꾸면 ${wl}개 대 ${wr}개, 똑같아서 <b>평평해!</b>`:`맞아! [${base}]로 바꾸면 ${wl}개 대 ${wr}개! ${ans==='L'?'왼쪽':'오른쪽'}이 쿵!`}}
      return {ok:false,note:v.s.label,mark:K.$('#slot')}}});
  if(!p.guided){G.say(p.say||'먼저 <b>보기</b>를 보고, 문제 시소가 어떻게 될지 스티커를 붙여요!');return}
  const r=p.rules[0],multi=p.rules.length>1,steps=[
    {say:'먼저 <b>보기</b>를 봐요. 시소가 <b>평평</b>하지? 평평하면 양쪽 무게가 똑같다는 뜻이야.',act:()=>G.hl('#bogi')},
    {say:p.rules.map(ruleLine).join(' 그리고 ')+' 이게 보기의 <b>약속</b>이야.',act:()=>showEqs(p.rules)}];
  if(p.odd)steps.push({say:`진짜 [${r[0]}|은] 작지만 괜찮아. 이 문제 나라에서는 <b>보기가 정답</b>이야!`});
  steps.push({say:'이제 문제 시소를 봐. 서로 다른 게 올라가 있어서 바로 비교하기 어렵지?',act:()=>G.hl('#qa')});
  steps.push({say:multi?`[${r[0]}|을] 톡! 눌러서 바꿔 봐. 바뀐 것도 또 바꿀 수 있으면 계속 눌러! 모두 같은 것이 될 때까지!`:`[${r[0]}|을] 톡! 눌러 봐. 무게가 같으니까 [${r[1]}] ${r[2]}개로 바꿔도 시소는 그대로야!`,
    wait:next=>armTaps(ss,p.rules,()=>{G.hl(null);next()})});
  steps.push({say:'짠! 이제 모두 같은 것이 됐어. 몇 개인지 세어 볼까?',wait:next=>{showCounts();countUp(ss,['L','R'],next)}});
  steps.push({say:'개수가 많은 쪽이 더 무거워. 알맞은 스티커를 붙이고 <b>다 했어요</b>를 눌러 봐!'});
  G.guide(steps);
}

/* 3·4단계: 평평하게 만들기 */
function fill(p,G){
  const gn=N(p.give);
  G.html(`${bogiHTML(p.rules)}<div class="qline"><span class="tag q">문제</span>오른쪽에 <span class="em">${E(p.give)}</span>${gn}${K.josa(gn,'을')} 몇 개 올려야 평평할까요?</div>
   <div class="qarea" id="qa">${ssHTML('qss',{dropR:true})}</div><div class="counts" id="cnt"></div>`);
  setupBogi(p.rules);const ss=K.$('#qss');setSS(ss,p.L,[]);tilt(ss,'?');
  const need=sumW(p.L,p.rules),rp=ss.querySelector('.pan.R');
  G.stickers([],'끌어서 오른쪽에 올려요 (누르면 하나씩 올라가요 · 올린 것을 누르면 내려와요)');
  const src=document.createElement('div');src.className='stk src';src.tabIndex=0;src.innerHTML=`<span class="em">${E(p.give)}</span><span>${gn}</span>`;
  const changed=()=>{tilt(ss,'?');K.$('#cnt').innerHTML=`<span></span><span>오른쪽 ${panItems(ss,'R').length}개</span>`;G.edit()};
  const addOne=()=>{if(G.P.done)return;if(rp.querySelectorAll('.it').length>=12){K.toast('12개까지만 올릴 수 있어요');return}rp.appendChild(itemEl(p.give,'sw rm'));fitPan(rp);K.sfx.drop();changed()};
  K.bindDrag(src,{kind:'item',k:p.give,html:E(p.give),tap:addOne});G.tray.appendChild(src);
  rp.addEventListener('click',e=>{const it=e.target.closest('.it.rm');if(!it||G.P.done)return;e.stopPropagation();it.remove();fitPan(rp);K.sfx.pick();changed()});
  G.drop((pl,d)=>{if(pl.kind==='item'&&d==='R')addOne()});
  G.answer({label:'⚖️ 다 올렸어요',ready:()=>panItems(ss,'R').length>0,hints:[
     ()=>{G.hl('#bogi');showEqs(p.rules);G.say('<b>보기</b>를 봐. '+p.rules.map(ruleLine).join(' 그리고 '))},
     ()=>{G.hl('#qa');if(!subTargets(ss,p.rules).length){G.say(`왼쪽에 있는 [${p.give}|을] 세어 봐!`);return}
       G.say(`왼쪽을 모두 [${p.give}]로 바꿔 보면 몇 개인지 셀 수 있어. 톡톡 눌러 봐!`);armTaps(ss,p.rules,()=>{G.hl(null);G.say('다 바꿨어! 왼쪽을 세어 보고 오른쪽도 똑같이 맞춰 봐.')})}],
    check:()=>{const have=panItems(ss,'R').length,st=cmp(need,have);tilt(ss,st);if(st!=='F')K.sfx.thud();
      return st==='F'?{ok:true,line:`평평해! [${p.give}] ${need}개가 왼쪽이랑 똑같은 무게야. 대단해!`}
        :{ok:false,note:`${have}개 올림`,why:st==='L'?'시소를 봐! 아직 왼쪽이 쿵 내려갔어.':'시소를 봐! 오른쪽이 쿵 내려갔어.'}}});
  G.onChange=()=>{};
  if(!p.guided){G.say(`왼쪽과 똑같은 무게가 되도록 [${p.give}|을] 올리고 <b>다 올렸어요</b>를 눌러요!`);return}
  G.guide([
    {say:'<b>보기</b>를 먼저 봐! 평평하니까 '+ruleLine(p.rules[0]),act:()=>{G.hl('#bogi');showEqs(p.rules)}},
    {say:`왼쪽 [${p.L[0]}|을] 톡톡! 눌러서 [${p.give}]로 바꿔 봐.`,act:()=>G.hl('#qa'),wait:next=>armTaps(ss,p.rules,()=>{G.hl(null);next()})},
    {say:'몇 개가 됐는지 세어 볼까?',wait:next=>countUp(ss,['L'],next)},
    {say:'오른쪽에도 똑같이 올리고 <b>다 올렸어요</b>를 눌러 봐!'}]);
}

/* 5단계: 누가 제일 무거울까 */
function order(p,G){
  const all=[...new Set(p.pairs.flat())];
  const heav=all.find(k=>!p.pairs.some(q=>q[1]===k)),light=all.find(k=>!p.pairs.some(q=>q[0]===k)),mid=all.find(k=>k!==heav&&k!==light);
  const ans=p.ask==='heavy'?heav:light;const cards=K.shuffle(all);
  G.html(`<div class="bogi" id="bogi"><span class="tag">보기</span><div class="bogi-row">${p.pairs.map((_,i)=>ssHTML('b'+i,{sm:true})).join('')}</div></div>
   <div class="qline"><span class="tag q">문제</span>${p.ask==='heavy'?'제일 무거운 것에 👑':'제일 가벼운 것에 🪶'} 스티커를 붙여요</div>
   <div class="cards">${cards.map(k=>`<div class="card" data-drop="${k}">${E(k)}<span class="nm">${N(k)}</span></div>`).join('')}</div><div id="lad"></div>`);
  p.pairs.forEach((q,i)=>{const s=K.$('#b'+i),f=p.flip?p.flip[i]:i%2===1;setSS(s,f?[q[1]]:[q[0]],f?[q[0]]:[q[1]]);tilt(s,'F');K.later(()=>{tilt(s,f?'R':'L');K.sfx.thud()},700+i*500)});
  G.stickers([p.ask==='heavy'?{v:'crown',html:'<span class="em">👑</span>',label:'제일 무거워'}:{v:'feather',html:'<span class="em">🪶</span>',label:'제일 가벼워'}],'스티커를 끌어다 붙여요. 다른 카드에 다시 붙이면 옮겨져요');
  const get=onePlace(G,d=>K.IT[d]?G.board.querySelector(`.card[data-drop="${d}"]`):null);
  const pl=(a,b)=>`[${a}|이] [${b}]보다 무거워.`;
  G.answer({ready:()=>!!get(),hints:[
     ()=>{G.hl('#b0');const q=p.pairs[0];G.say('첫 번째 시소를 봐. 쿵 내려간 쪽이 무거워! '+pl(q[0],q[1]))},
     ()=>{G.hl('#b1');const q=p.pairs[1];G.say('두 번째 시소! '+pl(q[0],q[1])+' 두 시소에 똑같이 나오는 친구가 누군지 찾아봐.')}],
    check:()=>{const c=get();if(c.d===ans){K.$('#lad').innerHTML=`<div class="ladder pop"><span class="em">${E(heav)}<span class="lb">무거워</span></span><span class="gt">&gt;</span><span class="em">${E(mid)}</span><span class="gt">&gt;</span><span class="em">${E(light)}<span class="lb">가벼워</span></span></div>`;
      return {ok:true,line:`맞아! [${heav}], [${mid}], [${light}] 순서야. 제일 ${p.ask==='heavy'?'무거운':'가벼운'} 건 [${ans}]!`}}
      return {ok:false,note:N(c.d)+'에 붙임'}}});
  G.say(p.intro?'시소 두 개를 잘 봐! 둘 다 <b>쿵 내려간 쪽이 무거워</b>. 셋 중에 누가 제일 무거울까?':p.ask==='heavy'?'두 시소를 보고 <b>제일 무거운</b> 것을 찾아 👑를 붙여요!':'이번엔 <b>제일 가벼운</b> 것을 찾아 🪶를 붙여요!');
}

/* ---------- 문제 만들기 ---------- */
const FRUIT=['lemon','cabbage','apple','straw','melon','carrot','mush','pear','grape','banana','peach','cherry'];
const ANIM=['bear','dog','cat','mouse','ele','pig','chick','rabbit','fox','frog','panda','lion'];
function mkHeavy(i){const [a,b]=K.pickN(K.pick([FRUIT,ANIM]),2);const t=i===0?'L':K.pick(['L','R','L','R','F']);
  return {type:'heavy',L:[a],R:[b],tilt:t,intro:i===0,odd:i===2,skill:'tilt'}}
function mkCompare(i,chain){const pool=K.pick([FRUIT,ANIM]);
  if(!chain){const [a,b]=K.pickN(pool,2),n=K.pick([2,2,3]);const rules=[[a,b,n]];
    let L=K.pick([[a],[a],[a,a],[a,b]]);const w=sumW(L,rules);const k=Math.max(1,Math.min(7,w+K.pick([-1,0,1])));let R=Array(k).fill(b);
    if(Math.random()<.5)[L,R]=[R,L];return {type:'compare',rules,L,R,skill:'sub'}}
  const [a,b,c]=K.pickN(pool,3),m=K.pick([2,2,3]);const rules=[[a,b,2],[b,c,m]];const w=2*m;
  const k=Math.max(1,Math.min(7,w+K.pick([-1,0,1])));let R=k>m&&Math.random()<.5?[b].concat(Array(k-m).fill(c)):Array(k).fill(c);let L=[a];
  if(Math.random()<.5)[L,R]=[R,L];return {type:'compare',rules,L,R,skill:'chain'}}
function mkFill(i,chain){const pool=K.pick([FRUIT,ANIM]);let rules,give;
  if(chain){const [a,b,c]=K.pickN(pool,3);rules=[[a,b,2],[b,c,2]];give=c}else{const [a,b]=K.pickN(pool,2);rules=[[a,b,K.pick([2,3])]];give=b}
  const big=rules[0][0];let L=[big];if(i>1&&!chain)L.push(K.pick([big,give]));if(i>3)L.push(give);
  return {type:'fill',rules,L,give,skill:chain?'chain':'fill'}}
function mkOrder(i){const [a,b,c]=K.pickN(K.pick([FRUIT,ANIM]),3);const pairs=K.shuffle([[a,b],[b,c]]);
  return {type:'order',pairs,ask:i%2?'light':'heavy',flip:[Math.random()<.5,Math.random()<.5],intro:i===0,skill:'order'}}

/* 놀이터 */
const YW={mouse:1,chick:1,rabbit:2,cat:2,dog:3,pig:4,bear:6,ele:12};
function yard(box){
  box.innerHTML=`<div class="board"><div class="qarea">${ssHTML('yss',{dropL:true,dropR:true})}</div>
   <div><span class="tag">내가 찾은 약속</span></div><div class="found" id="found"><span class="muted" style="font-size:15px">양쪽을 평평하게 맞춰 보세요</span></div></div>
   <div class="tray" id="ytray"><div class="lbl">끌어서 시소에 올려요 · 시소 위 동물을 누르면 내려와요</div></div>
   <button class="btn ghost" id="clr">모두 내리기</button>`;
  const ss=K.$('#yss');tilt(ss,'F');const found=[];
  Object.keys(YW).forEach(k=>{const d=document.createElement('div');d.className='stk src';d.tabIndex=0;d.innerHTML=`<span class="em">${E(k)}</span><span>${N(k)}</span>`;K.bindDrag(d,{kind:'item',k,html:E(k)});K.$('#ytray').appendChild(d)});
  const sorted=a=>a.slice().sort().join();
  const upd=()=>{const L=panItems(ss,'L'),R=panItems(ss,'R');const wl=L.reduce((s,k)=>s+YW[k],0),wr=R.reduce((s,k)=>s+YW[k],0);
    const st=cmp(wl,wr);tilt(ss,st,Math.min(14,4+Math.abs(wl-wr)*1.5));
    if(L.length&&R.length&&st==='F'){const key=[sorted(L),sorted(R)].sort().join('=');
      if(sorted(L)!==sorted(R)&&!found.includes(key)){found.push(key);K.sfx.good();K.confetti(30);
        const f=K.$('#found');if(found.length===1)f.innerHTML='';const s=document.createElement('span');s.className='eq em';s.innerHTML=`${L.map(E).join('')}<span class="is">=</span>${R.map(E).join('')}`;f.appendChild(s);
        K.say('와! 평평해졌어! 이게 바로 <b>약속</b>이야. 문제집의 <b>보기</b>가 이런 약속을 알려 주는 거야.')}
      else K.say('평평해! 양쪽 무게가 똑같아.')}
    else if(L.length||R.length){K.say(st==='L'?'쿵! 왼쪽이 더 무거워서 내려갔어.':st==='R'?'쿵! 오른쪽이 더 무거워서 내려갔어.':'평평해!');if(st!=='F')K.sfx.thud()}};
  K.onDrop=(pl,d)=>{if(pl.kind!=='item'||(d!=='L'&&d!=='R'))return;const p=ss.querySelector('.pan.'+d);if(p.querySelectorAll('.it').length>=8){K.toast('한쪽에 8마리까지만 올릴 수 있어요');return}
    p.appendChild(itemEl(pl.k,'sw rm'));fitPan(p);K.sfx.drop();upd()};
  ss.addEventListener('click',e=>{const it=e.target.closest('.it.rm');if(!it)return;e.stopPropagation();const p=it.parentElement;it.remove();fitPan(p);K.sfx.pick();upd()});
  K.$('#clr').onclick=()=>{setSS(ss,[],[]);tilt(ss,'F');K.say('다 내렸어! 다시 올려 볼까?')};
  K.say('동물을 시소에 올려 봐! 무거운 쪽이 쿵 내려가. 양쪽을 <b>평평하게</b> 맞추면 약속을 찾은 거야. [dog] 한 마리는 [mouse] 몇 마리랑 같을까?');
}

K.area('think',{id:'balance',name:'무게 비교',desc:'시소로 무겁고 가벼움을 비교해요',emoji:'⚖️',color:'#FFD9E2',badge:'추천',
  hello:'시소 놀이야! 처음이면 놀이터부터, 레몬과 배추 문제는 <b>2단계</b>야!',
  types:{heavy,compare,fill,order},
  tip:{t:'바꿔치기로 설명하기',b:`<p>"레몬 1개 = 배추 2개" 보기를 보고 "레몬 1개와 배추 1개"를 비교하는 문제는 아이 머릿속에서 <b>세 계단</b>을 올라가야 해요. 어른에게는 한 번이지만 아이에게는 세 번이라, 막히는 게 당연해요.</p>
<div class="steps3"><div><b>⚖️</b>① 평평하면<br>무게가 같다</div><div><b>🍋➜🥬🥬</b>② 레몬 자리에<br>배추 2개 넣기</div><div><b>🥬🥬 vs 🥬</b>③ 같은 것끼리<br>개수 비교</div></div>
<div class="say-line">보기 시소가 평평하지? 평평하면 양쪽이 똑같이 무겁다는 뜻이야.</div>
<div class="say-line">그러니까 레몬 1개랑 배추 2개는 무게가 같아. 이게 이 문제의 약속이야.</div>
<div class="say-line">문제 시소에서 레몬을 빼고, 그 자리에 배추 2개를 놓아 볼까? 무게가 같으니까 시소는 그대로야.</div>
<div class="say-line">이제 배추 2개랑 배추 1개! 어느 쪽이 더 무거워? 그럼 어느 쪽이 내려가?</div>
<p>아이가 "배추가 더 크잖아!" 하면 좋은 신호예요. "진짜 세상이랑 달라도, 이 문제 나라에서는 보기가 정답이야"라고 말해 주세요.</p>
<p>종이 위에서는 <b>손가락으로 레몬을 가리고 옆에 배추 2개를 그려</b> 주세요. 레고 블록 2개를 붙여 '레몬'이라 부르고 블록 1개를 '배추'라고 하면, 손에 들어 보고 바로 알아요. 게임 2단계에서는 레몬을 톡 누르면 배추 2개로 변신해요.</p>`},
  skills:{tilt:'시소 읽기',sub:'바꿔치기 비교',fill:'같은 무게 맞추기',chain:'두 번 바꾸기',order:'무게 순서'},
  levels:[
   {id:'yard',no:'놀이터',name:'시소 놀이터',desc:'동물을 올려 무게를 느껴요',emoji:'🐘🐭',color:'#DDF0C8',free:yard},
   {id:'l1',name:'쿵! 무거운 쪽',desc:'내려간 쪽이 더 무거워요',emoji:'⬇️⭐',gen:()=>K.makeSet(5,mkHeavy)},
   {id:'l2',name:'바꿔치기 시소',desc:'보기를 보고 바꿔서 비교해요',emoji:'🍋➜🥬🥬',badge:'핵심',color:'#FFC2D1',gen:()=>[
     {type:'compare',rules:[['lemon','cabbage',2]],L:['lemon'],R:['cabbage'],guided:true,odd:true,skill:'sub'}].concat(K.makeSet(6,i=>mkCompare(i,false)))},
   {id:'l3',name:'평평하게 만들기',desc:'몇 개를 올려야 똑같을까요?',emoji:'⚖️',color:'#D6ECFF',gen:()=>K.makeSet(6,i=>mkFill(i,false),true)},
   {id:'l4',name:'두 번 바꾸기',desc:'바꾸고 또 바꿔요',emoji:'🍉➜🍎➜🍓',color:'#E8DEFF',gen:()=>K.makeSet(6,i=>i%2?mkFill(i,true):mkCompare(i,true),true)},
   {id:'l5',name:'누가 제일 무거울까',desc:'시소 두 개로 순서를 찾아요',emoji:'👑',color:'#FFF1B8',gen:()=>K.makeSet(6,mkOrder)}
  ]});
K.ANSKEY.compare=p=>cmp(sumW(p.L,p.rules),sumW(p.R,p.rules));K.ANSKEY.fill=p=>JSON.stringify(p.give||'');
})();
