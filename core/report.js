/* 콩콩마을 · 부모님 학습 리포트
   이 폰에 저장된 풀이 기록으로 과목마다 맞춤 리포트를 만들어요.
   한 문제의 결과는 다섯 가지로 나눠요:
   solo 혼자 맞힘 · hint 힌트 보고 맞힘 · retry 틀린 뒤 고쳐 맞힘 · hintretry 힌트+틀린 뒤 맞힘 · fail 못 풀고 나감
   (practice 같이 해 보기는 실력 계산에서 빼요) */
'use strict';
(()=>{
const $=K.$,S=K.S;
S.log=S.log||[];
K.css(`
.rtabs{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.rtabs button{appearance:none;border:2px solid var(--line);background:var(--paper);border-radius:999px;padding:7px 14px;font:inherit;font-size:15px;cursor:pointer;color:var(--ink)}
.rtabs button.on{border-color:var(--orange);background:var(--s-orange);color:var(--orange-d)}
.stabs{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:none}
.stabs::-webkit-scrollbar{display:none}
.stabs button{flex:none;appearance:none;border:0;background:var(--paper);border-radius:16px;padding:8px 12px;font:inherit;font-size:15px;cursor:pointer;color:var(--ink);box-shadow:0 3px 0 var(--line);display:flex;align-items:center;gap:4px}
.stabs button.on{background:var(--ink);color:#fff;box-shadow:none}
.stabs button small{font-size:12px;opacity:.7}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
@media (max-width:440px){.kpis{grid-template-columns:repeat(2,1fr)}}
.kpi{background:var(--paper);border-radius:18px;padding:10px 8px;text-align:center;box-shadow:0 4px 0 var(--line)}
.kpi b{display:block;font-size:28px;font-weight:400;color:var(--ink);font-variant-numeric:tabular-nums}
.kpi span{font-size:13px;color:var(--muted)}
.rsec h3{font-size:20px;margin:0 0 8px}
.rsec h3 small{font-size:13px;color:var(--muted);font-family:var(--f-body)}
.stack{display:flex;height:22px;border-radius:11px;overflow:hidden;background:var(--s-track)}
.stack i{display:block;height:100%}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:8px;font-size:14px}
.legend span{display:flex;align-items:center;gap:5px}
.legend i{width:12px;height:12px;border-radius:4px;display:inline-block}
.r-solo{background:#4CB963}.r-hint{background:#F5C64A}.r-retry{background:#FF9A57}.r-hintretry{background:#E9785B}.r-fail{background:#D9534F}
.skill{display:grid;grid-template-columns:1fr 92px 64px;gap:8px;align-items:center;padding:7px 0;border-top:1px dashed var(--line);font-size:15px}
.skill:first-of-type{border-top:0}
.skill .nm small{display:block;font-size:12px;color:var(--muted)}
.skill .bar{height:12px;border-radius:6px;background:var(--s-track);overflow:hidden}
.skill .bar i{display:block;height:100%;border-radius:6px}
.badge2{font-size:12px;padding:3px 8px;border-radius:999px;font-family:var(--f-disp);text-align:center;white-space:nowrap}
.b-good{background:#DDF3E0;color:#2E7D3E}.b-mid{background:#FFF1C9;color:#8A6400}.b-low{background:#FFE0DC;color:#B23A31}.b-none{background:#F1E8DA;color:var(--muted)}
.weak{background:var(--s-orange);border-radius:16px;padding:10px 12px;margin:6px 0;display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.55}
.weak b{font-family:var(--f-disp);font-weight:400}
.weak .btn{align-self:flex-start;font-size:15px;padding:7px 12px;border-radius:14px}
.miss{border-top:1px dashed var(--line);padding:10px 0;display:flex;flex-direction:column;gap:4px}
.miss:first-of-type{border-top:0}
.miss .hd{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-family:var(--f-disp);font-size:16px}
.miss .when{font-size:13px;color:var(--muted);font-family:var(--f-body)}
.miss .pk{font-size:15px}
.miss .pk s{color:var(--red);text-decoration-thickness:2px}
.miss .ex{font-size:14px;color:var(--muted)}
.pill2{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--line);font-family:var(--f-disp)}
.pill2.ok{background:#DDF3E0;color:#2E7D3E}.pill2.no{background:#FFE0DC;color:#B23A31}.pill2.h{background:#FFF1C9;color:#8A6400}.pill2.fx{background:#E3F0FF;color:#2F6DB0}
.miss .btn{align-self:flex-start;font-size:15px;padding:7px 12px;border-radius:14px;box-shadow:0 4px 0 var(--blue-d)}
.coach{background:var(--s-blue);border-radius:16px;padding:10px 12px;font-size:15px;line-height:1.6}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.gal figure{margin:0;background:var(--s-white);border-radius:12px;padding:6px;box-shadow:inset 0 0 0 2px var(--line)}
.gal img{width:100%;display:block;border-radius:8px}
.gal figcaption{font-size:14px;display:flex;justify-content:space-between;gap:4px;align-items:center;margin-top:4px}
.gal figcaption b{font-family:var(--f-disp);font-weight:400;font-size:17px}
`);
const RES={solo:'혼자 맞힘',hint:'힌트 보고 맞힘',retry:'틀린 뒤 고쳐 맞힘',hintretry:'힌트+고쳐 맞힘',fail:'못 풀고 나감'};
const ORDER=['solo','hint','retry','hintretry','fail'];
const strip=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
/* 옛 기록(결과 종류가 없던 때)도 읽을 수 있게 */
const resOf=r=>r.res||(r.ok?(r.wn===0?(r.h?'hint':'solo'):(r.h?'hintretry':'retry')):'fail');

/* 기록 남기기 */
K.logProb=(P,ok,line,res)=>{const l=K.ctx.level;if(!l)return;const ar=l.area,p=P.p||{};
  const row={t:Date.now(),s:ar.subject.id,a:ar.id,an:ar.name,l:l.id,ln:l.name,i:K.ctx.pi,ok,res:res||(ok?'solo':'fail'),sk:p.skill||'',
    q:strip(p.word||p.text||p.prompt||'').slice(0,60),w:P.picks.filter(Boolean),wn:P.wrong,h:P.hint,ed:P.edits,sec:Math.round((Date.now()-P.t0)/1000),ex:line?K.fmt(line).text:''};
  if(P.img)row.img=P.img;if(P.sp)row.sp=P.sp;if(P.img0&&P.img0!==P.img)row.img0=P.img0;if(P.self)row.self=P.self;
  S.log.push(row);
  /* 리포트에서 다시 푼 문제를 혼자 맞히면 원래 문제에 '고침' 표시 */
  if(ok&&K.ctx.retryOf&&(res==='solo')){const o=S.log.find(x=>x.t===K.ctx.retryOf);if(o)o.fixed=true;K.ctx.retryOf=null}
  if(S.log.length>2000)S.log=S.log.slice(-2000);
  /* 손글씨 사진은 최근 60장만 */
  let n=0;for(let i=S.log.length-1;i>=0;i--)if(S.log[i].img&&++n>60){delete S.log[i].img;delete S.log[i].img0}
  try{K.save()}catch(e){}};

/* 맞힌 뒤 따라 말하기 결과를 방금 기록에 붙여요 */
K.logSpeak=res=>{const r=S.log[S.log.length-1];if(r&&Date.now()-r.t<120000){r.sp=res;try{K.save()}catch(e){}}};
const dkey=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const since=r=>{const d=new Date();d.setHours(0,0,0,0);if(r==='today')return d.getTime();if(r==='week'){d.setDate(d.getDate()-6);return d.getTime()}return 0};
const fmtWhen=t=>{const d=new Date(t);const td=dkey(Date.now())===dkey(t);return (td?'오늘':`${d.getMonth()+1}/${d.getDate()}`)+` ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`};
const mins=sec=>sec>=60?Math.round(sec/60)+'분':sec+'초';
const pct=(a,b)=>b?Math.round(a/b*100):0;
const subj=id=>K.subjects.find(x=>x.id===id);
const areaOf=r=>{const s=subj(r.s);return s&&s.areas.find(x=>x.id===r.a)};
const findLevel=r=>{const a=areaOf(r);return a&&a.levels.find(x=>x.id===r.l)};
const skillName=r=>{const a=areaOf(r);return (a&&a.skills&&a.skills[r.sk])||r.ln};

function stats(range,sid){
  const from=since(range);const all=S.log.filter(r=>r.t>=from&&(!sid||r.s===sid));
  const rows=all.filter(r=>resOf(r)!=='practice');
  const cnt={};ORDER.forEach(k=>cnt[k]=0);rows.forEach(r=>cnt[resOf(r)]++);
  const days=S.days||{};let playSec=0;Object.entries(days).forEach(([k,v])=>{const [y,m,d]=k.split('-').map(Number);if(new Date(y,m-1,d).getTime()>=from)playSec+=v});
  if(sid)playSec=all.reduce((a,r)=>a+(r.sec||0),0);
  /* 기술별 숙달도: 혼자 맞힘 1점, 힌트/고쳐 맞힘 0.5점, 못 풂 0점 */
  const sk={};rows.forEach(r=>{const key=r.s+'/'+r.a+'/'+(r.sk||r.l);const o=sk[key]=sk[key]||{key,s:r.s,a:r.a,sk:r.sk,nm:skillName(r),an:r.an,n:0,solo:0,pts:0,fail:0,l:{},w:[],last:0};
    const k=resOf(r);o.n++;o.pts+=k==='solo'?1:k==='fail'?0:.5;if(k==='solo')o.solo++;if(k==='fail')o.fail++;o.l[r.l]=(o.l[r.l]||0)+1;o.last=Math.max(o.last,r.t);if(r.w.length)o.w.push(...r.w.slice(0,2))});
  const skills=Object.values(sk).map(o=>Object.assign(o,{m:pct(o.pts,o.n)})).sort((x,y)=>x.m-y.m||y.n-x.n);
  const miss=rows.filter(r=>resOf(r)!=='solo').slice().reverse();
  const imgs=all.filter(r=>r.img).slice().reverse();
  return {all,rows,cnt,playSec,skills,miss,imgs};
}
const level=m=>m>=80?['good','잘해요']:m>=50?['mid','연습 중']:['low','도움 필요'];

/* 과목마다 다른 코칭 문장 */
const ADVICE={
  think:{low:'그림을 손으로 직접 옮겨 보게 하고, "왜 그렇게 생각했어?"라고 물어봐 주세요. 답보다 이유를 말하는 연습이 중요해요.',hint:'힌트를 보고 맞히는 경우가 많아요. 힌트를 누르기 전에 10초만 더 생각해 보자고 말해 주세요.'},
  math:{low:'구체물(바둑돌, 과자)로 직접 세어 보고 나서 다시 풀면 좋아요.',hint:'손가락이나 10칸 상자로 직접 세는 방법을 같이 해 보세요.'},
  eng:{low:'🔊를 여러 번 듣고 따라 말하게 해 주세요. 소리를 먼저 익히면 글자는 금방 따라와요.',hint:'첫소리를 길게 말해 주는 놀이(c-c-cat)가 도움이 돼요.'},
  kor:{low:'낱말을 천천히 소리 내어 읽으며 손뼉으로 글자 수를 세어 보세요.',hint:'자음과 모음 카드를 만들어 붙였다 떼었다 해 보세요.'},
  dict:{low:'틀린 낱말은 뜻과 함께 3번씩 소리 내어 읽고 써 보세요. 소리 나는 대로 쓰는 실수가 많으면 낱말의 원래 모양(같다→같이)을 알려 주세요.',hint:'불러 줄 때 한 글자씩 끊어서 천천히 불러 주세요.'},
  econ:{low:'진짜 동전으로 가게 놀이를 해 보세요. 큰 동전부터 세는 습관이 중요해요.',hint:'동전을 같은 것끼리 줄 세운 뒤 세게 해 주세요.'}};

function coach(st,sid){
  if(!st.rows.length)return '아직 기록이 없어요. 아이가 문제를 풀면 여기에 쌓여요.';
  const n=st.rows.length,solo=pct(st.cnt.solo,n),hint=pct(st.cnt.hint+st.cnt.hintretry,n),slip=st.rows.filter(r=>resOf(r)==='retry'&&r.wn===1).length;
  const good=st.skills.filter(s=>s.n>=3&&s.m>=80).slice(-2).map(s=>s.nm),weak=st.skills.filter(s=>s.n>=2&&s.m<60).slice(0,2).map(s=>s.nm);
  let t=`${n}문제 중 <b>${solo}%</b>를 혼자 힘으로 맞혔어요. `;
  if(good.length)t+=`<b>${good.join(', ')}</b>${K.josa(good[good.length-1],'은')} 잘하고 있어요. `;
  if(weak.length)t+=`<b>${weak.join(', ')}</b>에서 자주 막혔어요. `;
  if(slip)t+=`한 번 틀리고 바로 고친 문제가 ${slip}개 있어요. 손이 미끄러졌거나 서두른 실수일 수 있어요. `;
  const adv=sid&&ADVICE[sid];if(adv)t+=hint>=30?adv.hint:weak.length?adv.low:'';
  else if(hint>=30)t+='힌트를 쓴 문제가 많아요. 힌트를 누르기 전에 조금 더 생각해 보자고 말해 주세요.';
  if(!weak.length&&solo>=80)t+='다음 단계로 넘어가도 좋아요!';
  return t}

K.views.report=a=>{let range=K.ctx.range||'week',sid=K.ctx.rsid||'';const name=S.parent&&S.parent.name;
  const draw=()=>{const st=stats(range,sid);const n=st.rows.length;const sj=sid&&subj(sid);
    const subs=K.subjects.filter(s=>!s.soon).map(s=>({s,c:S.log.filter(r=>r.s===s.id&&r.t>=since(range)).length}));
    a.innerHTML=`<div class="screen">${K.topbar(`📊 ${name?name+'의 ':''}학습 리포트`)}
    <div class="rtabs">${[['today','오늘'],['week','최근 7일'],['all','전체']].map(([k,t])=>`<button data-r="${k}" class="${k===range?'on':''}">${t}</button>`).join('')}</div>
    <div class="stabs"><button data-s="" class="${!sid?'on':''}">🏡 전체</button>${subs.map(x=>`<button data-s="${x.s.id}" class="${sid===x.s.id?'on':''}">${x.s.emoji} ${x.s.name} <small>${x.c}</small></button>`).join('')}</div>
    <div class="kpis"><div class="kpi"><b>${n}</b><span>푼 문제</span></div><div class="kpi"><b>${pct(st.cnt.solo,n)}%</b><span>혼자 맞힘</span></div>
     <div class="kpi"><b>${st.cnt.hint+st.cnt.hintretry}</b><span>힌트 쓴 문제</span></div><div class="kpi"><b>${mins(st.playSec)}</b><span>${sid?'푼 시간':'논 시간'}</span></div></div>
    <div class="sheet rsec"><h3>정말 혼자 맞혔을까? <small>문제마다 어떻게 맞혔는지</small></h3>
      <div class="stack">${ORDER.map(k=>st.cnt[k]?`<i class="r-${k}" style="width:${st.cnt[k]/Math.max(1,n)*100}%"></i>`:'').join('')}</div>
      <div class="legend">${ORDER.map(k=>`<span><i class="r-${k}"></i>${RES[k]} ${st.cnt[k]}</span>`).join('')}</div>
      <p class="muted" style="font-size:13px;margin:8px 0 0">아이는 답을 자유롭게 고치다가 '다 했어요'를 눌러야 채점돼요. 그래서 끌다가 잘못 놓은 건 틀린 것으로 세지 않아요.</p></div>
    <div class="sheet rsec"><h3>💬 ${sj?sj.name+' ':''}맞춤 코칭</h3><div class="coach">${coach(st,sid)}</div></div>
    ${speakHTML(st)}
    ${weakHTML(st)}
    <div class="sheet rsec"><h3>기술별 실력 <small>혼자 맞힘 1점 · 도움받아 맞힘 0.5점</small></h3>${skillsHTML(st,sid)}</div>
    ${st.imgs.length?`<div class="sheet rsec"><h3>✍️ 손글씨 받아쓰기 <small>아이가 직접 쓴 글씨예요</small></h3><div class="gal">${st.imgs.slice(0,24).map(r=>`<figure>${r.img0?`<img src="${r.img0}" alt="${r.q} 처음 쓴 글씨" style="opacity:.75;margin-bottom:4px"><div class="muted" style="font-size:12px">↑ 처음 · ↓ 다시 쓴 글씨</div>`:''}<img src="${r.img}" alt="${r.q} 손글씨"><figcaption><b>${r.q}</b><span class="pill2 ${r.self==='same'&&!r.wn?'ok':r.ok?'h':'no'}">${r.self==='same'?(r.wn?'다시 써서 맞힘':'스스로 ⭕'):'스스로 ❌'}</span></figcaption></figure>`).join('')}</div>
      <p class="muted" style="font-size:13px;margin:8px 0 0">손글씨는 아이가 정답과 스스로 비교해요. 사진을 보고 맞춤법이 정말 맞는지 확인해 주세요.</p></div>`:''}
    <div class="sheet rsec"><h3>🔁 다시 볼 문제 <small>혼자 맞히지 못한 문제</small></h3>
     ${st.miss.length?st.miss.slice(0,30).map(r=>{const k=resOf(r);return `<div class="miss"><div class="hd">${r.an} · ${r.ln}
       <span class="pill2 ${k==='fail'?'no':k==='hint'?'h':'no'}">${RES[k]}</span>${r.h?`<span class="pill2 h">힌트 ${r.h}번</span>`:''}${r.fixed?'<span class="pill2 fx">다시 풀어서 고침 ✓</span>':''}<span class="when">${fmtWhen(r.t)} · ${mins(r.sec)}</span></div>
       ${r.q?`<div class="ex">문제: ${r.q}</div>`:''}
       ${r.w.length?`<div class="pk">틀렸던 답: ${r.w.slice(0,4).map(x=>`<s>${x}</s>`).join(' → ')}</div>`:''}${r.ex?`<div class="ex">정답 풀이: ${r.ex}</div>`:''}
       ${r.fixed?'':`<button class="btn blue" data-retry="${r.t}">비슷한 문제 다시 풀기</button>`}</div>`}).join(''):'<p class="muted">다시 볼 문제가 없어요. 잘했어요! 👏</p>'}</div>
    <button class="btn big green" id="share">📤 리포트 보내기 (카톡·문자)</button>
    <p class="muted" style="font-size:13px;text-align:center;margin:0">기록은 이 기기에만 저장돼요. 다른 기기에서는 보이지 않아요.</p></div>`;
    a.querySelector('.rtabs').onclick=e=>{const b=e.target.closest('[data-r]');if(b){range=b.dataset.r;K.ctx.range=range;draw()}};
    a.querySelector('.stabs').onclick=e=>{const b=e.target.closest('[data-s]');if(b){sid=b.dataset.s;K.ctx.rsid=sid;draw()}};
    a.querySelectorAll('[data-retry]').forEach(b=>b.onclick=()=>{const r=S.log.find(x=>x.t===+b.dataset.retry);retry(r)});
    a.querySelectorAll('[data-prac]').forEach(b=>b.onclick=()=>{const o=st.skills.find(x=>x.key===b.dataset.prac);practice(o)});
    $('#share').onclick=()=>share(st,range,sid)};
  draw();};

function speakHTML(st){const rs=st.all.filter(r=>r.sp);if(!rs.length)return '';const c=k=>rs.filter(r=>k.includes(r.sp)).length;
  const hard=[...new Set(rs.filter(r=>['ok2','parent','skip'].includes(r.sp)).map(r=>r.q).filter(Boolean))].slice(0,10);
  return `<div class="sheet rsec"><h3>🗣️ 따라 말하기 <small>듣고 소리 내어 말했는지</small></h3>
   <div class="legend"><span><i class="r-solo"></i>한 번에 정확히 ${c(['ok'])}</span><span><i class="r-hint"></i>두 번째에 ${c(['ok2'])}</span><span><i class="r-retry"></i>부모님·스스로 확인 ${c(['parent','self'])}</span><span><i class="r-fail"></i>건너뜀 ${c(['skip'])}</span></div>
   ${hard.length?`<p style="font-size:14px;margin:8px 0 0">발음을 더 연습하면 좋은 말: <b>${hard.join(', ')}</b></p>`:''}
   <p class="muted" style="font-size:13px;margin:6px 0 0">마이크가 아이 발음을 못 알아들을 수도 있어요. 옆에서 한 번 들어 봐 주세요.</p></div>`}
function weakHTML(st){const w=st.skills.filter(s=>s.n>=2&&s.m<60).slice(0,3);if(!w.length)return '';
  return `<div class="sheet rsec"><h3>🎯 부족한 부분</h3>${w.map(o=>{const picks=[...new Set(o.w)].slice(0,4);
    return `<div class="weak"><div><b>${o.nm}</b> <span class="muted">(${o.an})</span> · ${o.n}문제 중 혼자 맞힘 ${o.solo}개${o.fail?`, 못 풂 ${o.fail}개`:''}</div>
     ${picks.length?`<div class="muted" style="font-size:14px">자주 고른 틀린 답: ${picks.join(' · ')}</div>`:''}
     <button class="btn blue" data-prac="${o.key}">이 부분 연습하기 ▶</button></div>`}).join('')}</div>`}

function skillsHTML(st,sid){
  /* 해 본 기술 + 아직 안 해 본 기술 */
  const seen=new Set(st.skills.map(s=>s.key));
  const rows=st.skills.slice().sort((x,y)=>(x.s+x.a).localeCompare(y.s+y.a)||x.m-y.m).map(o=>{const [c,t]=o.n<2?['none','기록 적음']:level(o.m);
    return `<div class="skill"><div class="nm">${sid?'':subj(o.s).emoji+' '}${o.nm}<small>${o.an} · ${o.n}문제</small></div><span class="bar"><i class="r-${o.m>=80?'solo':o.m>=50?'hint':'fail'}" style="width:${Math.max(o.m,4)}%"></i></span><span class="badge2 b-${c}">${t}</span></div>`});
  const untried=[];(sid?[subj(sid)]:[]).forEach(s=>s.areas.forEach(ar=>Object.entries(ar.skills||{}).forEach(([k,nm])=>{if(!seen.has(s.id+'/'+ar.id+'/'+k))untried.push(nm)})));
  return (rows.join('')||'<p class="muted">아직 기록이 없어요</p>')+(untried.length?`<p class="muted" style="font-size:13px;margin:8px 0 0">아직 안 해 본 것: ${untried.slice(0,12).join(', ')}</p>`:'')}

/* 같은 기술의 새 문제로 다시 풀기 */
function similar(l,sk,i){if(l.probs)return l.probs[i]||l.probs[0];for(let t=0;t<6;t++){const ps=K.levelProbs(l).filter(p=>!p.guided);const m=ps.find(p=>!sk||p.skill===sk);if(m)return m}return K.levelProbs(l).filter(p=>!p.guided)[0]}
function retry(r){const l=r&&findLevel(r);if(!l){K.toast('이 문제를 찾을 수 없어요');return}
  K.go('play',{level:l,subj:l.area.subject,area:l.area,probs:[similar(l,r.sk,r.i)],pi:0,score:[],retry:true,retryOf:r.t})}
function practice(o){const ar=o&&subj(o.s).areas.find(x=>x.id===o.a);if(!ar)return;const lid=Object.entries(o.l).sort((x,y)=>y[1]-x[1])[0][0];const l=ar.levels.find(x=>x.id===lid);if(!l)return;
  const probs=Array.from({length:3},()=>similar(l,o.sk,0));K.go('play',{level:l,subj:ar.subject,area:ar,probs,pi:0,score:[],retry:true,retryOf:null})}

function share(st,range,sid){const name=S.parent&&S.parent.name;const rl={today:'오늘',week:'최근 7일',all:'전체'}[range];const sj=sid&&subj(sid);const n=st.rows.length;
  let t=`🫘 콩콩마을 ${name?name+' ':''}${sj?sj.name+' ':''}${rl} 리포트\n`;
  t+=`푼 문제 ${n}개 · 혼자 맞힘 ${pct(st.cnt.solo,n)}% · 힌트 ${st.cnt.hint+st.cnt.hintretry}문제 · ${mins(st.playSec)}\n`;
  t+=ORDER.filter(k=>st.cnt[k]).map(k=>`${RES[k]} ${st.cnt[k]}`).join(' · ')+'\n\n';
  const w=st.skills.filter(s=>s.n>=2&&s.m<60).slice(0,3);if(w.length)t+=`🎯 부족한 부분: ${w.map(o=>o.nm).join(', ')}\n`;
  const g=st.skills.filter(s=>s.n>=3&&s.m>=80);if(g.length)t+=`👍 잘하는 부분: ${g.slice(-3).map(o=>o.nm).join(', ')}\n`;
  if(st.miss.length){t+=`\n🔁 다시 볼 문제\n`;st.miss.slice(0,8).forEach(r=>{t+=`· ${r.an} ${r.ln}${r.q?' ('+r.q+')':''}: ${RES[resOf(r)]}${r.w.length?' / 틀린 답: '+r.w.slice(0,3).join(', '):''}\n`})}
  t+=`\n${strip(coach(st,sid))}`;
  const copy=()=>{try{navigator.clipboard.writeText(t).then(()=>K.toast('리포트를 복사했어요. 카톡에 붙여 넣으세요'),()=>K.toast('복사하지 못했어요'))}catch(e){K.toast('복사하지 못했어요')}};
  if(navigator.share)navigator.share({title:'콩콩마을 리포트',text:t}).catch(err=>{if(err&&err.name!=='AbortError')copy()});else copy()}
})();
