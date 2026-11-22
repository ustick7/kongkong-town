/* 콩콩마을 · 시작 미션, 부모님 비밀번호, 놀이 시간, 콩이 화분 (모두 이 폰 브라우저에 저장) */
'use strict';
(()=>{
const $=K.$,$$=K.$$;
K.css(`
.hud{display:flex;align-items:center;gap:8px}
.hud .beans{background:var(--paper);border-radius:999px;padding:8px 14px;font-size:19px;box-shadow:0 4px 0 var(--line);display:inline-flex;gap:6px;align-items:center}
.hud .grow{flex:1}
.missions{display:flex;flex-direction:column;gap:10px}
.mission{display:flex;align-items:center;gap:12px;background:var(--paper);border-radius:20px;padding:12px 14px;box-shadow:0 5px 0 var(--line);font-size:21px}
.mission .em{font-size:34px}
.mission .tx{flex:1;min-width:0}
.mission button{appearance:none;border:0;border-radius:16px;padding:10px 14px;font-size:18px;background:var(--blue);color:#fff;box-shadow:0 4px 0 var(--blue-d);cursor:pointer;font-family:inherit}
.mission.done{background:var(--s-green)}
.mission.done button{background:var(--green);box-shadow:0 4px 0 var(--green-d)}
.stamp{font-size:30px;animation:stick .5s cubic-bezier(.3,1.6,.5,1) both}
.pin-dots{display:flex;gap:14px;justify-content:center;margin:10px 0}
.pin-dots i{width:18px;height:18px;border-radius:50%;border:3px solid var(--ink);display:block}
.pin-dots i.on{background:var(--ink)}
.pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:300px;margin:0 auto}
.pad button{appearance:none;border:0;background:var(--cream);border-radius:16px;height:58px;font-size:26px;font-family:var(--f-disp);box-shadow:0 4px 0 var(--line);cursor:pointer;color:var(--ink)}
.pad button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--line)}
.set-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0}
.set-row input[type=text]{flex:1;min-width:0;font:inherit;font-size:17px;padding:10px 12px;border-radius:12px;border:2px solid var(--line);background:var(--paper);color:var(--ink)}
.chip{appearance:none;border:2px solid var(--line);background:var(--paper);border-radius:999px;padding:7px 12px;font:inherit;font-size:15px;cursor:pointer;color:var(--ink)}
.chip.on{border-color:var(--orange);background:var(--s-orange)}
.mrow{display:flex;align-items:center;gap:8px;background:var(--s-cream);border-radius:12px;padding:6px 10px;margin:4px 0}
.mrow span{flex:1}
.mrow button{appearance:none;border:0;background:none;font-size:18px;cursor:pointer;color:var(--red)}
.pot-wrap{display:flex;justify-content:center}
.pot{width:min(260px,80%);height:auto}
.pot .sway{transform-origin:130px 230px;animation:sway 3s ease-in-out infinite}
@keyframes sway{50%{transform:rotate(2.5deg)}}
.stage-bar{display:flex;gap:4px;justify-content:center;flex-wrap:wrap}
.stage-bar span{font-size:13px;padding:3px 8px;border-radius:999px;background:var(--line);color:var(--muted)}
.stage-bar span.on{background:var(--green);color:#fff}
.drop-water{position:absolute;font-size:30px;animation:water 1s ease-in forwards}
@keyframes water{from{transform:translateY(-60px);opacity:0}30%{opacity:1}to{transform:translateY(60px);opacity:0}}
`);
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const S=K.S;
S.parent=Object.assign({setupDone:false,pin:null,gate:true,limit:0,name:'',missions:['🪥 양치했어요','🧸 장난감 정리했어요']},S.parent||{});
S.play=Object.assign({date:'',used:0,bonus:0,unlocked:false},S.play||{});
S.beans=S.beans||0; S.plant=Object.assign({water:0},S.plant||{});
const PRESET=['🪥 양치했어요','🚿 샤워했어요','🧸 장난감 정리했어요','🎒 가방 챙겼어요','🍚 밥 다 먹었어요','📚 책 한 권 읽었어요','🧦 옷 정리했어요','💧 물 한 컵 마셨어요'];
const vocative=n=>{if(!n)return '';const c=n.charCodeAt(n.length-1);const b=c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28>0;return n+(b?'아':'야')};
const splitEm=m=>{const r=m.match(/^(\p{Extended_Pictographic}️?)\s*(.*)$/u);return r?[r[1],r[2]]:['⭐',m]};
function newDay(){if(S.play.date!==today()){S.play={date:today(),used:0,bonus:0,unlocked:false};K.save()}}

/* 비밀번호 패드 (모달). mode 'check' | 'set' */
K.pinPad=(title,mode,done,cancel)=>{let v='',first=null;const m=document.createElement('div');m.className='modal-bg';
  m.innerHTML=`<div class="sheet" role="dialog" aria-label="${title}" style="text-align:center"><h2 id="pt">${title}</h2><p id="ps" class="muted" style="margin:0 auto">${mode==='set'?'숫자 4개를 정해 주세요':'부모님만 눌러 주세요'}</p>
   <div class="pin-dots">${'<i></i>'.repeat(4)}</div><div class="pad">${[1,2,3,4,5,6,7,8,9,'닫기',0,'⌫'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div></div>`;
  const dots=()=>m.querySelectorAll('.pin-dots i').forEach((d,i)=>d.classList.toggle('on',i<v.length));
  m.querySelector('.pad').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;K.sfx.tap(+k||0);
    if(k==='닫기'){m.remove();cancel&&cancel();return}if(k==='⌫'){v=v.slice(0,-1);dots();return}if(v.length>=4)return;v+=k;dots();
    if(v.length===4)setTimeout(()=>{
      if(mode==='check'){if(v===S.parent.pin){m.remove();done(v)}else{const s=m.querySelector('.sheet');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');m.querySelector('#ps').textContent='비밀번호가 달라요. 다시 눌러 주세요';v='';dots()}}
      else{if(first===null){first=v;v='';dots();m.querySelector('#ps').textContent='한 번 더 똑같이 눌러 주세요'}
        else if(first===v){m.remove();done(v)}else{first=null;v='';dots();m.querySelector('#ps').textContent='두 번이 달라요. 처음부터 다시 정해 주세요'}}},150)});
  document.body.appendChild(m)};
K.parentCheck=fn=>{if(!S.parent.pin)return fn();K.pinPad('👪 부모님 확인','check',fn)};

/* 처음 설정 */
K.views.setup=a=>{const P=S.parent;let ms=P.missions.slice();
  a.innerHTML=`<div class="screen"><div class="brand">${K.BRAND}<small>부모님, 아이에게 건네주기 전에 1분만 설정해 주세요</small></div>
  <div class="sheet"><h2>👋 아이 이름</h2><div class="set-row"><input type="text" id="nm" maxlength="8" placeholder="예: 서윤" value="${P.name||''}"></div>
  <h2 style="margin-top:14px">✅ 오늘의 미션</h2><p>게임을 시작하기 전에 아이가 할 일이에요. 아이가 "했어요"를 누르면 부모님 비밀번호로 확인해야 시작돼요.</p>
  <div class="set-row" id="pre"></div>
  <h2 style="margin-top:14px">⏰ 하루 놀이 시간</h2><div class="set-row" id="lim"></div>
  <p style="margin-top:16px"><button class="btn big green" id="go">비밀번호 정하고 시작하기</button></p>
  <p><button class="btn ghost big" id="skip">미션 없이 그냥 시작하기</button></p></div></div>`;
  const drawPre=()=>{$('#pre').innerHTML=PRESET.map(x=>`<button class="chip ${ms.includes(x)?'on':''}" data-m="${x}">${x}</button>`).join('')};drawPre();
  $('#pre').onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;const x=b.dataset.m;ms=ms.includes(x)?ms.filter(y=>y!==x):ms.concat(x);drawPre()};
  let lim=P.limit;const drawLim=()=>{$('#lim').innerHTML=[0,10,20,30,60].map(x=>`<button class="chip ${lim===x?'on':''}" data-l="${x}">${x?x+'분':'제한 없음'}</button>`).join('')};drawLim();
  $('#lim').onclick=e=>{const b=e.target.closest('[data-l]');if(!b)return;lim=+b.dataset.l;drawLim()};
  $('#go').onclick=()=>{if(!ms.length){K.toast('미션을 하나 이상 골라 주세요');return}K.pinPad('🔒 부모님 비밀번호','set',pin=>{Object.assign(P,{pin,missions:ms,limit:lim,gate:true,setupDone:true,name:$('#nm').value.trim()});
    S.play.unlocked=true;K.save();K.toast('설정 완료! 오늘은 바로 시작해요');K.go('village')})};
  $('#skip').onclick=()=>{Object.assign(P,{gate:false,setupDone:true,limit:lim,name:$('#nm').value.trim()});K.save();K.go('village')};
};

/* 시작 미션 */
K.views.gate=a=>{const P=S.parent;const done=new Set();
  a.innerHTML=`<div class="screen"><div class="brand" style="font-size:36px">오늘의 미션<small>${P.name?vocative(P.name)+', ':''}콩이랑 놀기 전에 확인해요!</small></div>${K.buddyRow()}
   <div class="missions">${P.missions.map((m,i)=>{const [e,t]=splitEm(m);return `<div class="mission" data-i="${i}"><span class="em">${e}</span><span class="tx">${t}</span><button data-i="${i}">했어요!</button></div>`}).join('')}</div>
   <button class="btn big blue" id="ask" disabled>👪 엄마 아빠한테 확인받기</button></div>`;
  K.say(`${P.name?vocative(P.name)+'! ':''}오늘의 미션을 다 했니? 다 했으면 <b>했어요!</b>를 눌러 줘.`);
  $('.missions').onclick=e=>{const b=e.target.closest('button');if(!b)return;const i=+b.dataset.i;const row=b.closest('.mission');
    if(done.has(i)){done.delete(i);row.classList.remove('done');b.textContent='했어요!'}else{done.add(i);row.classList.add('done');b.innerHTML='<span class="stamp">✔</span>';K.sfx.good()}
    const all=done.size===P.missions.length;$('#ask').disabled=!all;$('#ask').classList.toggle('pulse',all);
    if(all)K.say('와, 다 했구나! 이제 엄마 아빠한테 폰을 보여 주고 확인받자!')};
  $('#ask').onclick=()=>K.pinPad('👪 미션을 확인했나요?','check',()=>{S.play.unlocked=true;K.save();K.confetti(60);K.sfx.good();K.go('village')})};

/* 놀이 시간 끝 */
K.views.timeup=a=>{a.innerHTML=`<div class="screen result"><div style="flex:1"></div><div class="buddy lg">${K.buddySvg('sprout')}</div>
  <div class="brand" style="font-size:34px">오늘은 여기까지!<small>콩이도 이제 쉬어야 해. 내일 또 만나!</small></div>
  <div class="bubble" id="say" style="flex:none;width:100%"></div>
  <button class="btn ghost big" id="more">👪 10분 더 하기 (부모님)</button><div style="flex:1"></div></div>`;
  K.say(`오늘 정말 열심히 생각했어! 모은 콩알은 ${S.beans}개야. 내일 또 놀자!`);
  $('#more').onclick=()=>K.parentCheck(()=>{S.play.bonus+=10;K.save();K.go('village')})};

/* 부모님 설정 */
const RS0='<button class="btn ghost" id="r1">학습 기록만 지우기</button><button class="btn ghost" id="ra">완전히 처음으로</button>';
const RSQ=(id,msg)=>`<p style="width:100%;margin:0"><b>${msg}</b></p><button class="btn" id="${id}" style="background:var(--red);box-shadow:0 6px 0 #C94A43">정말 지울게요</button><button class="btn ghost" id="r3">취소</button>`;
/* 기록 옮기기: 이 기기의 모든 기록을 파일 하나로 */
function exportData(){const d=new Date(),stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const name=`kongkong-${(S.parent.name||'record')}-${stamp}.json`;const blob=new Blob([JSON.stringify({app:'kongkong',v:1,at:Date.now(),data:Object.assign({},S,{ocrKey:undefined})})],{type:'application/json'});
  const file=new File([blob],name,{type:'application/json'});
  if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'콩콩마을 기록'}).catch(err=>{if(err&&err.name!=='AbortError')dl()});else dl();
  function dl(){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);K.toast('기록 파일을 저장했어요. 카톡으로 보내 주세요')}}
function importData(f){const rd=new FileReader();rd.onload=()=>{let o;try{o=JSON.parse(rd.result)}catch(e){K.toast('콩콩마을 기록 파일이 아니에요');return}
  if(!o||o.app!=='kongkong'||!o.data){K.toast('콩콩마을 기록 파일이 아니에요');return}
  const n=(o.data.log||[]).length,nm=(o.data.parent&&o.data.parent.name)||'아이';
  const m=document.createElement('div');m.className='modal-bg';m.innerHTML=`<div class="sheet"><h2>📥 기록 불러오기</h2><p><b>${nm}</b>의 기록(문제 ${n}개, ${new Date(o.at).toLocaleDateString('ko-KR')} 저장)을 불러올까요? 지금 이 폰의 기록은 이 파일로 바뀌어요.</p>
    <div class="set-row"><button class="btn green" id="imok">불러올게요</button><button class="btn ghost" data-a="close">취소</button></div></div>`;document.body.appendChild(m);
  m.querySelector('#imok').onclick=()=>{try{localStorage.setItem('kongkong-v1',JSON.stringify(Object.assign({},o.data,S.ocrKey&&!o.data.ocrKey?{ocrKey:S.ocrKey}:{})))}catch(e){K.toast('저장 공간이 부족해요');return}location.reload()}};rd.readAsText(f)}
K.views.settings=a=>{const P=S.parent;
  a.innerHTML=`<div class="screen">${K.topbar('부모님 설정')}<p class="muted" style="text-align:center;font-size:13px;margin:0">콩콩마을 버전 ${window.KK_VER||'-'}</p>
  <div class="sheet"><h2>👋 아이 이름</h2><div class="set-row"><input type="text" id="nm" maxlength="8" value="${P.name||''}" placeholder="예: 서윤"></div>
  <h2 style="margin-top:12px">✅ 시작 미션</h2>
  <div class="set-row"><button class="chip ${P.gate?'on':''}" id="gate">${P.gate?'켜짐: 미션 확인 후 시작':'꺼짐: 바로 시작'}</button></div>
  <div id="ml"></div><div class="set-row"><input type="text" id="mi" maxlength="20" placeholder="새 미션 (예: 🥛 우유 마셨어요)"><button class="btn green" id="ma">추가</button></div>
  <div class="set-row" id="pre"></div>
  <h2 style="margin-top:12px">⏰ 하루 놀이 시간</h2><div class="set-row" id="lim"></div><p class="muted" id="used"></p>
  <h2 style="margin-top:12px">🎵 위인 노래 가사 (위콩)</h2><p>집에 있는 위인 노래 가사를 붙여 넣으면 가사 속 이름이 빈칸인 문제가 만들어져요. 가사는 이 기기에만 저장돼요.</p>
  <div class="set-row"><textarea id="lyr" rows="5" style="width:100%;font:inherit;font-size:16px;border-radius:14px;border:2px solid var(--line);padding:10px;background:var(--paper);color:var(--ink)" placeholder="가사를 한 줄씩 붙여 넣어요">${(S.lyrics||'').replace(/</g,'&lt;')}</textarea></div><p class="muted" id="lyc"></p>
  <h2 style="margin-top:12px">✍️ 손글씨 자동 채점</h2><p>구글 <b>Gemini 키</b>(AQ. 또는 AIza로 시작)를 붙여 넣고 <b>연결 확인</b>을 누르면 끝이에요. 콩이가 받아쓰기 글씨를 직접 읽고 글자마다 채점해요. 키는 이 폰에만 저장되고 기록 내보내기에도 들어가지 않아요. 비워 두면 아이가 정답과 스스로 비교해요. 키 받는 법은 <a href="https://github.com/ustick7/kongkong-town/blob/main/worker/README.md" target="_blank" rel="noopener">안내서</a>에 있어요.</p>
  <div class="set-row"><input type="text" autocapitalize="off" autocomplete="off" spellcheck="false" id="ocr" placeholder="AQ.… 또는 AIza… 키를 붙여 넣어요" value="${(S.ocrKey||S.ocrUrl||'').replace(/"/g,'&quot;')}" style="flex:1;min-width:0;-webkit-text-security:${S.ocrKey?'disc':'none'}"><button class="btn ghost" id="ocrt">연결 확인</button></div><p class="muted" id="ocrm"></p>
  <h2 style="margin-top:12px">🌙 밤 화면 (눈 보호)</h2><p>밤 화면은 어두운 색이라 저녁에 눈이 덜 부셔요. 자동이면 폰이 다크 모드이거나 정한 시각부터 아침 7시까지 밤 화면이 돼요.</p>
  <div class="set-row" id="thm"></div><div class="set-row" id="nf"></div>
  <h2 style="margin-top:12px">🔒 비밀번호</h2><div class="set-row"><button class="btn ghost" id="pc">비밀번호 바꾸기</button></div>
  <h2 style="margin-top:12px">📦 다른 폰으로 기록 옮기기</h2><p>기록 파일을 만들어 카톡으로 보내고, 다른 폰의 이 화면에서 불러오면 별점·콩알·리포트·설정이 똑같이 옮겨져요. 불러오면 그 폰의 기록은 이 파일로 바뀌어요.</p>
  <div class="set-row"><button class="btn ghost" id="ex">📤 기록 내보내기</button><button class="btn ghost" id="im">📥 기록 불러오기</button><input type="file" id="imf" accept=".json,application/json,text/plain" style="display:none"></div>
  <h2 style="margin-top:12px">🗑 기록 지우기</h2><p>이 기기에 저장된 기록을 지우고 처음부터 시작해요. 지운 기록은 되돌릴 수 없어요.</p><div class="set-row" id="rs">${RS0}</div>
  <p style="margin-top:14px"><button class="btn big green" id="sv">저장하고 돌아가기</button></p></div></div>`;
  $('#imf').onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)importData(f);e.target.value=''};
  let ms=P.missions.slice(),lim=P.limit,gate=P.gate,th=S.theme||'auto',nf=S.nightFrom==null?19:S.nightFrom;
  const draw=()=>{$('#ml').innerHTML=ms.map((m,i)=>`<div class="mrow"><span>${m}</span><button data-x="${i}" aria-label="지우기">✕</button></div>`).join('')||'<p class="muted">미션이 없어요</p>';
    $('#pre').innerHTML=PRESET.filter(x=>!ms.includes(x)).map(x=>`<button class="chip" data-m="${x}">+ ${x}</button>`).join('');
    $('#lim').innerHTML=[0,10,20,30,60].map(x=>`<button class="chip ${lim===x?'on':''}" data-l="${x}">${x?x+'분':'제한 없음'}</button>`).join('');
    $('#gate').className='chip '+(gate?'on':'');$('#gate').textContent=gate?'켜짐: 미션 확인 후 시작':'꺼짐: 바로 시작';
    $('#thm').innerHTML=[['auto','자동'],['light','항상 밝게'],['dark','항상 밤 화면']].map(([k,n])=>`<button class="chip ${th===k?'on':''}" data-th="${k}">${n}</button>`).join('');
    $('#nf').innerHTML=th==='auto'?[18,19,20,21,0].map(h=>`<button class="chip ${nf===h?'on':''}" data-nf="${h}">${h?'저녁 '+(h-12)+'시부터':'시간 말고 폰 설정만'}</button>`).join(''):'';
    $('#used').textContent=`오늘 논 시간: ${Math.floor(S.play.used/60)}분`};draw();
  a.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.th){th=t.dataset.th;S.theme=th;K.save();K.applyTheme();draw();return}
    if(t.dataset.nf!=null){nf=+t.dataset.nf;S.nightFrom=nf;K.save();K.applyTheme();draw();return}
    if(t.dataset.x!=null){ms.splice(+t.dataset.x,1);draw()}else if(t.dataset.m){ms.push(t.dataset.m);draw()}else if(t.dataset.l!=null){lim=+t.dataset.l;draw()}
    else if(t.id==='gate'){gate=!gate;draw()}else if(t.id==='ma'){const v=$('#mi').value.trim();if(v){ms.push(v);$('#mi').value='';draw()}}
    else if(t.id==='pc')K.pinPad('🔒 새 비밀번호','set',pin=>{P.pin=pin;K.save();K.toast('비밀번호를 바꿨어요')});
    else if(t.id==='r1'){$('#rs').innerHTML=RSQ('r2','별점, 콩알, 화분, 리포트 기록, 손글씨 사진을 모두 지워요. 이름·미션·비밀번호는 그대로예요.')}
    else if(t.id==='ra'){$('#rs').innerHTML=RSQ('r4','이름, 미션, 비밀번호까지 모두 지우고 처음 설치한 상태로 돌아가요.')}
    else if(t.id==='r2'){S.stars={};S.beans=0;S.plant={water:0};S.garden={kind:0,done:[],own:[],pot:'',bg:'',friends:[],wear:{head:'',face:'',neck:'',hand:'',back:'',body:''},goal:{day:'',got:false},pets:0};S.log=[];S.days={};if(S.play){S.play.used=0;S.play.bonus=0}K.save();K.toast('학습 기록을 지웠어요');$('#rs').innerHTML=RS0}
    else if(t.id==='r4'){try{localStorage.removeItem('kongkong-v1')}catch(e){}location.reload()}
    else if(t.id==='r3'){$('#rs').innerHTML=RS0}
    else if(t.id==='ex')exportData();
    else if(t.id==='im')$('#imf').click();
    else if(t.id==='ocrt'){const u=$('#ocr').value.trim();const m=$('#ocrm');const say=(h,c)=>{m.innerHTML=`<span style="display:block;padding:10px 12px;border-radius:12px;background:var(--s-${c||'yellow'});color:var(--ink);font-size:15px">${h}</span>`;m.scrollIntoView({block:'nearest',behavior:'smooth'})};
      if(!u){K.setOcr('');say('칸이 비어 있어요. 비워 두면 아이가 스스로 비교해요.');return}
      const hint=/^https:\/\//.test(u)?'':K.keyHint(u);if(hint){say('⚠️ '+hint,'orange');K.sfx.soft();return}
      t.disabled=true;const lb=t.textContent;t.textContent='확인 중…';say('🔎 구글에 연결해 보는 중이에요…','blue');
      K.ocrCheck(u).then(r=>{if(r===true){K.setOcr(u);say('✅ <b>연결됐어요!</b> 이제 콩이가 받아쓰기 글씨를 읽어요.','green');K.sfx.good()}else{say('⚠️ '+r,'orange');K.sfx.soft()}})
        .catch(()=>say('⚠️ 구글에 연결이 안 돼요. 인터넷을 확인하고 다시 눌러 주세요. 계속 안 되면 이 화면을 캡처해서 보내 주세요.','orange'))
        .finally(()=>{t.disabled=false;t.textContent=lb});return}
    else if(t.id==='sv'){if(gate&&!ms.length){K.toast('미션을 하나 이상 넣어 주세요');return}Object.assign(P,{missions:ms,limit:lim,gate,name:$('#nm').value.trim()});S.lyrics=$('#lyr').value.slice(0,6000);K.setOcr($('#ocr').value.trim());K.save();K.toast('저장했어요');K.go('village')}});
};

/* 콩이 화분은 core/garden.js */

/* 문제를 맞히면 콩알 받기 */
K.onSolved=stars=>{S.beans+=stars;K.save();K.toast(`🫘 콩알 ${stars}개 받았어요!`)};

/* 놀이 시간 재기 */
const FREE=['gate','timeup','setup','settings','report'];
setInterval(()=>{if(document.visibilityState!=='visible'||FREE.includes(K.view))return;newDay();S.play.used+=5;S.days=S.days||{};S.days[S.play.date]=(S.days[S.play.date]||0)+5;
  if(S.play.used%30===0)K.save();const lim=S.parent.limit;if(lim&&S.play.used>=(lim+S.play.bonus)*60){K.save();K.go('timeup')}},5000);

/* 시작 화면 고르기 */
K.startView=()=>{newDay();const P=S.parent;if(!P.setupDone)return 'setup';
  if(P.limit&&S.play.used>=(P.limit+S.play.bonus)*60)return 'timeup';if(P.gate&&!S.play.unlocked)return 'gate';return 'village'};
})();
