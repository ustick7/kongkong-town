/* 콩콩마을 · 부모님 학습 리포트 (이 폰에 저장된 풀이 기록으로 만들어요) */
'use strict';
(()=>{
const $=K.$,S=K.S;
S.log=S.log||[];
K.css(`
.rtabs{display:flex;gap:6px;justify-content:center}
.rtabs button{appearance:none;border:2px solid var(--line);background:var(--paper);border-radius:999px;padding:8px 16px;font:inherit;font-size:16px;cursor:pointer;color:var(--ink)}
.rtabs button.on{border-color:var(--orange);background:#FFF0E3;color:var(--orange-d)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
@media (max-width:440px){.kpis{grid-template-columns:repeat(2,1fr)}}
.kpi{background:var(--paper);border-radius:18px;padding:10px 8px;text-align:center;box-shadow:0 4px 0 var(--line)}
.kpi b{display:block;font-size:28px;font-weight:400;color:var(--ink);font-variant-numeric:tabular-nums}
.kpi span{font-size:13px;color:var(--muted)}
.rsec h3{font-size:20px;margin:0 0 8px}
.arow{display:grid;grid-template-columns:110px 1fr 74px;gap:8px;align-items:center;margin:8px 0;font-size:15px}
.arow .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.arow .bar{height:14px;border-radius:7px;background:#F1E8DA;overflow:hidden}
.arow .bar i{display:block;height:100%;border-radius:7px;background:var(--green)}
.arow .bar i.mid{background:var(--sun)} .arow .bar i.low{background:var(--red)}
.arow .v{text-align:right;color:var(--muted);font-variant-numeric:tabular-nums}
.miss{border-top:1px dashed var(--line);padding:10px 0;display:flex;flex-direction:column;gap:4px}
.miss:first-of-type{border-top:0}
.miss .hd{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-family:var(--f-disp);font-size:16px}
.miss .when{font-size:13px;color:var(--muted);font-family:var(--f-body)}
.miss .pk{font-size:15px}
.miss .pk s{color:var(--red);text-decoration-thickness:2px}
.miss .ex{font-size:14px;color:var(--muted)}
.pill2{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--line);font-family:var(--f-disp)}
.pill2.ok{background:#DDF3E0;color:#2E7D3E}.pill2.no{background:#FFE0DC;color:#B23A31}.pill2.h{background:#FFF1C9;color:#8A6400}
.miss .btn{align-self:flex-start;font-size:15px;padding:7px 12px;border-radius:14px;box-shadow:0 4px 0 var(--blue-d)}
.coach{background:#F2F8FF;border-radius:16px;padding:10px 12px;font-size:15px;line-height:1.6}
`);

/* 기록 남기기 */
K.logProb=(P,ok,line)=>{const l=K.ctx.level;if(!l)return;const ar=l.area;
  S.log.push({t:Date.now(),s:ar.subject.id,a:ar.id,an:ar.name,l:l.id,ln:l.name,i:K.ctx.pi,ok,w:P.picks.filter(Boolean),wn:P.wrong,h:P.hint,sec:Math.round((Date.now()-P.t0)/1000),
    st:ok?(P.wrong===0&&!P.usedHint?3:P.wrong<=1&&P.hint<=2?2:1):0,ex:line?K.fmt(line).text:''});
  if(S.log.length>1500)S.log=S.log.slice(-1500);K.save()};

const dkey=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const since=r=>{const d=new Date();d.setHours(0,0,0,0);if(r==='today')return d.getTime();if(r==='week'){d.setDate(d.getDate()-6);return d.getTime()}return 0};
const fmtWhen=t=>{const d=new Date(t);const td=dkey(Date.now())===dkey(t);return (td?'오늘':`${d.getMonth()+1}/${d.getDate()}`)+` ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`};
const mins=sec=>sec>=60?Math.round(sec/60)+'분':sec+'초';
const findLevel=r=>{const s=K.subjects.find(x=>x.id===r.s);const a=s&&s.areas.find(x=>x.id===r.a);return a&&a.levels.find(x=>x.id===r.l)};

function stats(range){
  const from=since(range);const rows=S.log.filter(r=>r.t>=from);
  const solved=rows.filter(r=>r.ok);const first=solved.filter(r=>r.wn===0);
  const days=S.days||{};let playSec=0;Object.entries(days).forEach(([k,v])=>{const [y,m,d]=k.split('-').map(Number);if(new Date(y,m-1,d).getTime()>=from)playSec+=v});
  const byArea={};rows.forEach(r=>{const a=byArea[r.a]=byArea[r.a]||{an:r.an,n:0,first:0,hint:0,give:0};if(r.ok){a.n++;if(r.wn===0)a.first++}else a.give++;if(r.h)a.hint++});
  const miss=rows.filter(r=>!r.ok||r.wn>0||r.h>=2).slice().reverse();
  return {rows,solved,first,playSec,byArea,miss,hints:rows.filter(r=>r.h).length};
}
const pct=(a,b)=>b?Math.round(a/b*100):0;

function coachLine(st){const ar=Object.entries(st.byArea).filter(([,a])=>a.n+a.give>=2).map(([id,a])=>({id,...a,p:pct(a.first,a.n+a.give)})).sort((x,y)=>x.p-y.p);
  if(!st.rows.length)return '아직 기록이 없어요. 아이가 문제를 풀면 여기에 쌓여요.';
  const w=ar[0],b=ar[ar.length-1];let s='';
  if(b&&b.p>=70)s+=`<b>${b.an}</b>는 한 번에 맞히는 비율이 ${b.p}%로 잘하고 있어요. `;
  if(w&&w.p<60&&w!==b)s+=`<b>${w.an}</b>에서 자주 막혔어요(한 번에 맞힘 ${w.p}%). 놀이 화면의 👪 버튼에 있는 말하기 대본으로 한 번 같이 해 보세요.`;
  else if(!s)s='골고루 잘하고 있어요. 다음 단계로 넘어가도 좋아요.';
  return s}

K.views.report=a=>{let range=K.ctx.range||'today';const name=S.parent&&S.parent.name;
  const draw=()=>{const st=stats(range);
    a.innerHTML=`<div class="screen">${K.topbar(`📊 ${name?name+'의 ':''}학습 리포트`)}
    <div class="rtabs">${[['today','오늘'],['week','최근 7일'],['all','전체']].map(([k,t])=>`<button data-r="${k}" class="${k===range?'on':''}">${t}</button>`).join('')}</div>
    <div class="kpis"><div class="kpi"><b>${st.solved.length}</b><span>푼 문제</span></div><div class="kpi"><b>${pct(st.first.length,st.rows.length)}%</b><span>한 번에 맞힘</span></div>
     <div class="kpi"><b>${st.hints}</b><span>힌트 쓴 문제</span></div><div class="kpi"><b>${mins(st.playSec)}</b><span>논 시간</span></div></div>
    <div class="sheet rsec"><h3>💬 한 줄 코칭</h3><div class="coach">${coachLine(st)}</div></div>
    <div class="sheet rsec"><h3>놀이별 한 번에 맞힌 비율</h3>${Object.values(st.byArea).length?Object.values(st.byArea).map(x=>{const p=pct(x.first,x.n+x.give);
      return `<div class="arow"><span class="nm">${x.an}</span><span class="bar"><i class="${p>=70?'':p>=40?'mid':'low'}" style="width:${Math.max(p,3)}%"></i></span><span class="v">${x.first}/${x.n+x.give}문제</span></div>`}).join(''):'<p class="muted">아직 기록이 없어요</p>'}</div>
    <div class="sheet rsec"><h3>🔁 다시 볼 문제 <span class="muted" style="font-size:14px">(틀렸거나 힌트를 2번 이상 쓴 문제)</span></h3>
     ${st.miss.length?st.miss.slice(0,30).map((r,i)=>`<div class="miss"><div class="hd">${r.an} · ${r.ln} ${r.i+1}번
       ${r.ok?`<span class="pill2 ${r.wn?'no':'h'}">${r.wn?`${r.wn}번 틀린 뒤 맞힘`:'맞힘'}</span>`:'<span class="pill2 no">못 풀고 나감</span>'}${r.h?`<span class="pill2 h">힌트 ${r.h}번</span>`:''}<span class="when">${fmtWhen(r.t)} · ${mins(r.sec)}</span></div>
       ${r.w.length?`<div class="pk">처음 고른 답: ${r.w.map(x=>`<s>${x}</s>`).join(' → ')}</div>`:''}${r.ex?`<div class="ex">정답 풀이: ${r.ex}</div>`:''}
       <button class="btn blue" data-retry="${st.rows.indexOf(r)}">이 문제 다시 풀기</button></div>`).join(''):'<p class="muted">다시 볼 문제가 없어요. 잘했어요! 👏</p>'}</div>
    <button class="btn big green" id="share">📤 리포트 보내기 (카톡·문자)</button>
    <p class="muted" style="font-size:13px;text-align:center;margin:0">기록은 이 폰에만 저장돼요. 다른 폰에서는 보이지 않아요.</p></div>`;
    a.querySelector('.rtabs').onclick=e=>{const b=e.target.closest('[data-r]');if(b){range=b.dataset.r;K.ctx.range=range;draw()}};
    a.querySelectorAll('[data-retry]').forEach(b=>b.onclick=()=>{const r=st.rows[+b.dataset.retry];const l=findLevel(r);if(!l){K.toast('이 문제를 찾을 수 없어요');return}K.go('play',{level:l,pi:r.i,score:[]})});
    $('#share').onclick=()=>share(st,range)};
  draw();};

function share(st,range){const name=S.parent&&S.parent.name;const rl={today:'오늘',week:'최근 7일',all:'전체'}[range];
  let t=`🫘 콩콩마을 ${name?name+' ':''}${rl} 리포트\n`;
  t+=`푼 문제 ${st.solved.length}개 · 한 번에 맞힘 ${pct(st.first.length,st.rows.length)}% · 힌트 ${st.hints}문제 · ${mins(st.playSec)}\n\n`;
  Object.values(st.byArea).forEach(x=>{t+=`· ${x.an}: ${x.first}/${x.n+x.give} 한 번에 맞힘\n`});
  if(st.miss.length){t+=`\n🔁 다시 볼 문제\n`;st.miss.slice(0,8).forEach(r=>{t+=`· ${r.an} ${r.ln} ${r.i+1}번 (${r.ok?(r.wn?r.wn+'번 틀린 뒤 맞힘':'힌트 '+r.h+'번'):'못 풀고 나감'})${r.w.length?' 고른 답: '+r.w.join(', '):''}\n`})}
  t+=`\n${coachLine(st).replace(/<[^>]+>/g,'')}`;
  const copy=()=>{try{navigator.clipboard.writeText(t).then(()=>K.toast('리포트를 복사했어요. 카톡에 붙여 넣으세요'),()=>K.toast('복사하지 못했어요'))}catch(e){K.toast('복사하지 못했어요')}};
  if(navigator.share)navigator.share({title:'콩콩마을 리포트',text:t}).catch(err=>{if(err&&err.name!=='AbortError')copy()});else copy()}
})();
