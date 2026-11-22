/* 콩콩마을 · 여러 과목이 함께 쓰는 문제 틀
   quiz : 그림/소리를 보고 스티커를 칸에 놓아 답하기
   sort : 물건을 두 바구니로 나누기
   write: 화면에 손으로 쓰기 (받아쓰기)  */
'use strict';
(()=>{
const $=K.$;
K.css(`
.show{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;font-size:44px;min-height:60px;padding:6px;line-height:1.15}
.show.sm{font-size:30px}
.show .big{font-size:84px;line-height:1}
.show .word{font-family:var(--f-disp);font-size:40px;letter-spacing:2px;color:var(--ink)}
.show .en{font-family:'Fredoka','Jua',sans-serif;font-weight:600}
.listen{appearance:none;border:0;cursor:pointer;width:96px;height:96px;border-radius:50%;background:var(--blue);color:#fff;font-size:44px;box-shadow:0 6px 0 var(--blue-d);margin:4px auto;display:flex;align-items:center;justify-content:center}
.listen:active{transform:translateY(4px);box-shadow:0 2px 0 var(--blue-d)}
.listen.slow{width:64px;height:64px;font-size:20px;background:var(--paper);color:var(--blue-d);box-shadow:0 5px 0 var(--line);font-family:var(--f-disp)}
.listen-row{display:flex;gap:14px;align-items:center;justify-content:center}
.frame{display:flex;flex-wrap:nowrap;gap:6px;justify-content:center;align-items:center;font-size:26px;line-height:1.3;max-width:100%}
.frame>span{flex:none}
/* 빈칸은 줄바꿈하지 않고 화면 폭에 맞춰 함께 작아져요 */
.frame .slot{min-width:0;width:72px;flex:0 1 72px;min-height:64px;aspect-ratio:1/1;padding:2px}
.frame .slot .stuck .em{font-size:30px}
.frame.tight{gap:2px}
.frame.wrapf{flex-wrap:wrap;row-gap:8px;font-size:22px;line-height:1.6}
.frame.wrapf>span{flex:0 1 auto}
.frame.tight .word{font-size:44px}
.frame .slot .stuck{font-size:34px}
.frame .slot.wide{width:130px;flex-basis:130px;aspect-ratio:auto}
.stk .en{font-family:'Fredoka','Jua',sans-serif;font-weight:600;font-size:30px;line-height:1.1;color:var(--ink)}
.stk .ko{font-family:var(--f-disp);font-size:30px;line-height:1.15;color:var(--ink)}
.stuck .en,.stuck .ko{font-size:34px;color:var(--ink)}
.bins{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.bin{min-height:150px;border-radius:20px;border:3px dashed var(--blue);background:var(--s-blue);padding:8px;display:flex;flex-direction:column;align-items:center;gap:6px}
.bin h4{margin:0;font-weight:400;font-size:18px;text-align:center}
.bin .its{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.bin .its .chip2{font-size:32px;cursor:pointer;background:var(--paper);border-radius:12px;padding:2px 6px;box-shadow:0 3px 0 var(--line);font-family:var(--f-emoji)}
.bin .its .chip2 small{display:block;font-size:11px;font-family:var(--f-disp);text-align:center;color:var(--muted)}
.bin.bad{border-color:var(--red)}
.speak{background:var(--s-yellow);border-radius:20px;padding:12px;display:flex;flex-direction:column;gap:10px;align-items:center;width:100%;text-align:center}
.speak .tw{font-family:'Fredoka','Jua',sans-serif;font-weight:600;font-size:40px;line-height:1.1;color:var(--ink)}
.speak .tw.ko{font-family:var(--f-disp)}
.speak .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}
.speak .row .btn{flex:1 1 140px}
.speak .heard{font-size:15px;color:var(--muted);min-height:20px}
.mic{appearance:none;border:0;width:84px;height:84px;border-radius:50%;background:var(--red);color:#fff;font-size:38px;box-shadow:0 6px 0 #B9443D;cursor:pointer}
.mic.on{animation:micP 1s ease-in-out infinite}
@keyframes micP{50%{box-shadow:0 0 0 14px rgba(242,102,94,.25),0 6px 0 #B9443D}}
/* 손글씨 */
.pad-wrap{position:relative;background:var(--pad);border-radius:18px;box-shadow:inset 0 0 0 3px var(--line);touch-action:none;overflow:hidden}
.pad-wrap canvas{display:block;width:100%;touch-action:none}
.pad-guide{position:absolute;inset:0;pointer-events:none;display:grid}
.pad-guide i{border-right:2px dashed #EADBC4;border-bottom:2px dashed #EADBC4}
.pad-tools .btn{width:auto;flex:0 1 auto;font-size:16px;padding:9px 14px;border-radius:14px}
.pad-tools{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.compare{display:grid;grid-template-columns:1fr;gap:6px;text-align:center}
.compare .answord{font-family:var(--f-disp);font-size:40px;letter-spacing:6px;color:var(--green-d);background:var(--s-green);border-radius:14px;padding:6px}
.compare img{width:100%;border-radius:12px;background:var(--s-white);box-shadow:inset 0 0 0 2px var(--line)}
.selfcheck{display:flex;gap:10px}.selfcheck.col{flex-direction:column}
.sylchk{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:4px 0 6px}
.syl{appearance:none;border:0;cursor:pointer;min-width:58px;padding:6px 8px;border-radius:14px;background:var(--s-white);box-shadow:inset 0 0 0 3px var(--line),0 4px 0 var(--line);font-family:inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center}
.syl small{font-size:12px;color:var(--red)}.syl b{font-family:var(--f-disp);font-weight:400;font-size:28px;line-height:1.1}.syl i{font-style:normal;font-size:18px}
.syl.o{box-shadow:inset 0 0 0 3px var(--green),0 4px 0 var(--green-d)}.syl.x{box-shadow:inset 0 0 0 3px var(--red),0 4px 0 #C94A43}.syl:disabled{opacity:.6}
.selfcheck .btn{flex:1}
`);

/* 언어별로 읽어 주기 */
K.speakLang=(text,lang='ko-KR',rate=.9)=>{if(!('speechSynthesis' in window)||!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=rate;u.pitch=1.05;
  const vs=speechSynthesis.getVoices();const v=vs.find(v=>v.lang&&v.lang.replace('_','-').toLowerCase().startsWith(lang.toLowerCase().slice(0,2)));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}};
function listenHTML(){return `<div class="listen-row"><button class="listen" id="lsn" aria-label="다시 듣기">🔊</button><button class="listen slow" id="lsn2" aria-label="천천히 듣기">천천히</button></div>`}
function bindListen(L){const play=r=>K.speakLang(L.text,L.lang||'ko-KR',r);$('#lsn').onclick=()=>play(L.rate||.9);$('#lsn2').onclick=()=>play(.6);K.later(()=>play(L.rate||.9),700)}

/* quiz */
function quiz(p,G){
  const n=p.ans.length;const frame=p.frame||Array.from({length:n},(_,i)=>i);
  G.html(`<div class="qline"><span class="tag q">문제</span>${p.prompt}</div>
   ${p.listen?listenHTML():''}${p.show?`<div class="show ${p.showSm?'sm':''}" id="show">${p.show}</div>`:''}
   <div class="frame ${p.tight?'tight':''} ${p.wrapf?'wrapf':''}" id="frame">${frame.map(x=>typeof x==='number'?`<div class="slot ${p.wide?'wide':''}" data-k="${x}">?</div>`:`<span>${x}</span>`).join('')}</div>${p.after||''}`);
  G.board.querySelectorAll('.frame .slot').forEach(el=>G.slot(el,'s'+el.dataset.k));
  G.stickers(p.opts.map(o=>typeof o==='object'?o:{v:o,html:K.numHtml(o)}),p.trayLabel);
  if(p.nums)G.tray.classList.add('nums');
  if(p.listen)bindListen(p.listen);
  if(p.live)G.onChange=()=>p.live(G.vals,G);
  const key=v=>String(v);
  G.answer({ready:v=>frame.filter(x=>typeof x==='number').every(i=>v['s'+i]),
    hints:(p.hints||[]).map(h=>typeof h==='function'?()=>h(G):()=>G.say(h)),
    check:v=>{const got=Array.from({length:n},(_,i)=>v['s'+i]&&v['s'+i].v);const ok=got.every((g,i)=>p.ansSet?p.ansSet[i].map(key).includes(key(g)):key(g)===key(p.ans[i]));
      if(ok)return {ok:true,line:p.line||'맞았어!'};
      const pickTxt=got.map((g,i)=>{const o=p.opts.find(o=>(typeof o==='object'?o.v:o)===g);return o&&typeof o==='object'?(o.note||o.label||K.pickText(o)):g}).join(p.join!=null?p.join:', ');
      return {ok:false,note:pickTxt,why:(p.why&&p.why(got))||''}}});
  G.say(p.say||'알맞은 걸 칸에 놓고 <b>다 했어요</b>를 눌러요!');
  p.onShow&&p.onShow(G);
}

/* sort: 두 바구니로 나누기 */
function sort(p,G){
  G.html(`<div class="qline"><span class="tag q">문제</span>${p.prompt}</div>${p.show?`<div class="show sm">${p.show}</div>`:''}
   <div class="bins">${p.bins.map((b,i)=>`<div class="bin" data-drop="b${i}" id="bin${i}"><h4>${b}</h4><div class="its"></div></div>`).join('')}</div>`);
  const where={};
  const left=()=>p.items.filter(it=>where[it.v]==null);
  const draw=()=>{p.bins.forEach((b,i)=>{G.board.querySelector(`#bin${i} .its`).innerHTML=p.items.filter(it=>where[it.v]===i).map(it=>`<span class="chip2" data-v="${it.v}">${it.html}<small>${it.label}</small></span>`).join('')});
    G.tray.querySelectorAll('.stk').forEach(s=>s.style.display=where[s.dataset.v]!=null?'none':'')};
  G.stickers(p.items.map(it=>({v:it.v,html:`<span class="em">${it.html}</span>`,label:it.label})),'하나씩 끌어서 알맞은 바구니에 넣어요. 바구니 안의 것을 누르면 다시 나와요');
  G.drop((pl,d)=>{if(pl.kind!=='stk'||!d||d[0]!=='b')return;where[pl.v]=+d.slice(1);K.sfx.drop();draw();G.edit()});
  G.board.addEventListener('click',e=>{const c=e.target.closest('.chip2');if(!c||G.P.done)return;delete where[c.dataset.v];K.sfx.pick();draw();G.edit()});
  G.answer({ready:()=>left().length===0,hints:(p.hints||[]).map(h=>()=>G.say(h)),
    check:()=>{const bad=p.items.filter(it=>where[it.v]!==it.bin);p.bins.forEach((_,i)=>K.$('#bin'+i).classList.toggle('bad',bad.some(b=>where[b.v]===i)));
      return bad.length?{ok:false,note:bad.map(b=>b.label).join(', ')+' 잘못 넣음',why:`${bad.length}개가 다른 바구니에 들어갔어.`}:{ok:true,line:p.line||'모두 맞게 나눴어!'}}});
  G.say(p.say||'알맞은 바구니에 나눠 넣고 <b>다 했어요</b>!');
}

/* write: 손글씨 받아쓰기. 쓴 글씨는 사진으로 남겨 부모님 리포트에서 볼 수 있어요 */
function write(p,G){
  const cells=p.cells||p.word.replace(/\s/g,'').length;
  G.html(`<div class="qline"><span class="tag q">문제</span>${p.prompt||'잘 듣고 칸에 써 보세요'}</div>${listenHTML()}
   <div class="pad-wrap" id="pw"><canvas id="cv"></canvas><div class="pad-guide" id="pg"></div></div>
   <div class="pad-tools"><button class="btn ghost" id="undo">↩ 한 획 지우기</button><button class="btn ghost" id="clr">🧽 모두 지우기</button></div>
   <div id="cmp"></div>`);
  G.hideTray();const EN=p.lang==='en';bindListen({text:p.say||p.word,lang:EN?'en-US':'ko-KR',rate:.8});
  const cv=$('#cv'),pw=$('#pw'),ctx=cv.getContext('2d');let strokes=[],cur=null;
  let cols=cells,rows=1;
  const size=()=>{const w=pw.clientWidth;const maxC=Math.max(3,Math.floor(w/64));rows=Math.ceil(cells/maxC);cols=Math.ceil(cells/rows);
    const pg=$('#pg');pg.style.gridTemplateColumns=`repeat(${cols},1fr)`;pg.style.gridTemplateRows=`repeat(${rows},1fr)`;
    pg.innerHTML=Array.from({length:cols*rows},(_,i)=>`<i style="${(i+1)%cols===0?'border-right:0;':''}${i>=cols*(rows-1)?'border-bottom:0;':''}${i>=cells?'background:#F6EFE4':''}"></i>`).join('');
    const h=rows*Math.min(230,Math.max(120,w/cols*1.3));const dpr=window.devicePixelRatio||1;cv.width=w*dpr;cv.height=h*dpr;cv.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);redraw()};
  const redraw=()=>{ctx.clearRect(0,0,cv.width,cv.height);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#3D2E28';ctx.lineWidth=Math.max(5,pw.clientWidth/cols/14);
    strokes.forEach(s=>{ctx.beginPath();s.forEach((pt,i)=>i?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]));if(s.length===1)ctx.lineTo(s[0][0]+.1,s[0][1]);ctx.stroke()})};
  const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  cv.addEventListener('pointerdown',e=>{if(G.P.done)return;e.preventDefault();cv.setPointerCapture(e.pointerId);cur=[pos(e)];strokes.push(cur);redraw()});
  cv.addEventListener('pointermove',e=>{if(!cur)return;e.preventDefault();cur.push(pos(e));redraw()});
  const end=()=>{if(cur){cur=null;G.edit()}};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  $('#undo').onclick=()=>{strokes.pop();redraw();G.edit()};$('#clr').onclick=()=>{strokes=[];redraw();G.edit()};
  const onR=()=>{if(!pw.isConnected){window.removeEventListener('resize',onR);return}size()};window.addEventListener('resize',onR);K.later(size,30);size();
  const snap=(w=360,q=.6)=>{const t=document.createElement('canvas');const h=Math.round(w*cv.height/cv.width);t.width=w;t.height=h;const c=t.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,w,h);c.drawImage(cv,0,0,w,h);return t.toDataURL('image/jpeg',q)};
  /* 다 쓰면 정답을 보여 주고 아이가 스스로 비교해요. 부모님은 리포트에서 쓴 글씨를 봐요 */
  let stage='write';
  G.answer({label:'✔ 다 썼어요',ready:()=>strokes.length>0,hints:(p.hints||[]).map(h=>()=>G.say(h)),
    check:()=>{grade();return {ok:false,silent:true}}});
  G.submit=()=>grade();
  /* 다 쓰면: 채점 주소가 있으면 콩이(AI)가 먼저 읽어 보고, 못 읽으면 아이가 스스로 비교해요 */
  const sy=[...p.word.replace(/\s/g,'')];
  function grade(){if(stage!=='write')return;G.P.img=snap();stage='busy';
    if(!(EN?K.hearOn():K.ocrOn())||!navigator.onLine){stage='self';showCompare();return}
    K.$('#acts').innerHTML='<div class="muted" style="text-align:center;padding:10px">🔎 콩이가 글씨를 읽고 있어요…</div>';pw.style.pointerEvents='none';
    K.ocrRead(snap(640,.8),sy.length,{lang:EN?'en':'ko',cs:!!p.cs}).then(j=>{if(!pw.isConnected)return;stage='self';
        const t=j&&typeof j.text==='string'?[...j.text.replace(/\s/g,'')]:null;
        if(t&&j.sure&&t.length===sy.length){G.P.ocr=t.join('');showAuto(t)}else{G.P.ocr0=t?t.join(''):'';showCompare('콩이가 글씨를 잘 못 읽었어. ')}})}
  function showAuto(t){K.$('#acts').innerHTML='';$('#undo').disabled=true;$('#clr').disabled=true;
    const same=(x,y)=>EN&&!p.cs?String(x).toLowerCase()===String(y).toLowerCase():x===y;const mk=sy.map((c,i)=>same(t[i],c)?'o':'x');const bad=sy.filter((c,i)=>mk[i]==='x');G.P.marks=mk.map((m,i)=>(m==='o'?'⭕':'❌')+sy[i]).join(' ');G.P.self='ai';
    $('#cmp').innerHTML=`<div class="compare"><div class="muted" style="font-size:15px">정답</div><div class="answord">${p.word}</div>
      <div class="sylchk">${sy.map((c,i)=>`<div class="syl ${mk[i]}"><b>${c}</b><i>${mk[i]==='o'?'⭕':'❌'}</i><small>${mk[i]==='o'?'':'쓴 글자: '+t[i]}</small></div>`).join('')}</div>
      ${bad.length?`<div style="font-size:16px"><b>${bad.join(', ')}</b>${K.josa(bad[bad.length-1],'이')} 달라. 정답을 잘 보고 다시 써 볼까?</div>
      <div class="selfcheck"><button class="btn blue" id="again2">✏️ 다시 쓰기</button><button class="btn ghost" id="pok2" style="font-size:15px">👪 부모님: 맞게 썼어요</button></div>`:''}</div>`;
    if(!bad.length){K.later(()=>G.success(p.line||`잘했어! ${p.word}, 맞춤법 대장!`),600);return}
    K.sfx.soft();K.say(K.talk('wbad',{b:bad.join(', '),j:K.josa(bad[bad.length-1],'이')}));
    $('#again2').onclick=()=>retryWrite(bad);
    $('#pok2').onclick=()=>K.parentCheck(()=>{G.P.self='parent';G.P.ocrFix=1;G.success(p.line||`잘했어! ${p.word}!`)})}
  function retryWrite(bad){G.P.wrong++;G.P.picks.push(bad.length?`다르게 쓴 글자: ${bad.join(', ')}`:'정답과 다르게 씀');G.P.img0=G.P.img0||G.P.img;
    $('#cmp').innerHTML=`<div class="compare"><div class="answord">${p.word}</div><div style="font-size:16px">${p.tip?p.tip+' ':''}${bad.length?`<b>${bad.join(', ')}</b>${K.josa(bad[bad.length-1],'을')} 잘 보고 `:'정답을 잘 보고 '}한 번 더 써 볼까?</div></div>`;
    stage='write';strokes=[];redraw();pw.style.pointerEvents='';$('#undo').disabled=false;$('#clr').disabled=false;
    K.later(()=>{const c=K.$('#cmp');if(c&&stage==='write')c.innerHTML='<div class="compare"><div class="muted">이번엔 정답을 안 보고 다시 써 봐!</div></div>'},3000);
    G.actions(G._acts);G.refresh();K.say(bad.length?`괜찮아! ${bad.join(', ')}${K.josa(bad[bad.length-1],'을')} 기억하고 다시 써 보자.`:'스스로 찾아낸 게 대단해! 정답을 기억하고 다시 써 보자.')}
  /* 자동 채점이 안 될 때: 정답을 보여 주고 아이가 비교해요. 아이 혼자 누르는 ⭕로는 별·콩알을 주지 않아요.
     고쳐 쓰거나, 부모님이 그 자리에서 확인하거나, '확인 기다림'으로 넘어가서 부모님이 리포트에서 확인해요 */
  function showCompare(pre=''){K.$('#acts').innerHTML='';pw.style.pointerEvents='none';$('#undo').disabled=true;$('#clr').disabled=true;G.P.self='wait';
    $('#cmp').innerHTML=`<div class="compare"><div class="muted" style="font-size:15px">정답</div><div class="answord">${p.word}</div>
      ${pre&&K.ocrWhy&&K.ocrLast?`<div class="muted" style="font-size:12px">👪 콩이 기록: ${K.ocrWhy(K.ocrLast)}</div>`:''}<div style="font-size:16px">내가 쓴 글씨와 <b>한 글자씩</b> 비교해 봐. 다른 글자가 있으면 고쳐 쓰자!</div>
      <div class="selfcheck col"><button class="btn blue" id="fix" disabled>✏️ 다른 글자가 있어요, 고쳐 쓸래요</button>
      <button class="btn ghost" id="pchk" disabled>👪 부모님께 확인받기</button>
      <button class="btn ghost" id="later" disabled style="font-size:15px">➡️ 다음으로 (나중에 부모님이 확인해요)</button></div></div>`;
    K.say(pre+'정답이랑 내가 쓴 글씨를 한 글자씩 비교해 봐! 부모님이 확인해 주시면 콩알을 받아.');
    /* 바로 이어서 누른 손가락이 버튼에 닿지 않게 잠깐 기다려요 */
    K.later(()=>['fix','pchk','later'].forEach(id=>{const b=$('#'+id);if(b)b.disabled=false}),1200);
    $('#fix').onclick=()=>{G.P.self='diff';retryWrite([])};
    $('#later').onclick=()=>{G.P.self='wait';G.pending('부모님이 확인해 주시면 별이랑 콩알을 받을 수 있어!')};
    $('#pchk').onclick=()=>K.parentCheck(()=>{$('#cmp').querySelector('.selfcheck').innerHTML=`<div class="muted" style="font-size:15px;text-align:center">👪 부모님 판정</div>
        <button class="btn green" id="pok3">⭕ 맞게 썼어요</button><button class="btn" id="pno3" style="background:var(--red);box-shadow:0 6px 0 #C94A43">❌ 틀린 글자가 있어요</button>`;
      $('#pok3').onclick=()=>{G.P.self='parent';G.success(p.line||`잘했어! ${p.word}, 맞춤법 대장!`)};
      $('#pno3').onclick=()=>{G.P.self='diff';retryWrite([])}})}
  G.say(p.sayKo||'잘 듣고 칸에 또박또박 써 봐! 다 쓰면 <b>다 썼어요</b>를 눌러요.');
}

K.TYPES={quiz,sort,write};

/* 따라 말하기: 듣고 → 소리 내어 말하면 마이크로 확인. 마이크를 못 쓰는 기기는 스스로 말했다고 눌러요 */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9가-힣]/g,'');
const lev=(a,b)=>{const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]};
const words=s=>String(s||'').toLowerCase().split(/\s+/).map(norm).filter(Boolean);
/* 문장은 낱말의 3/4 이상이 들리면 통과 (아이 발음과 인식 오차를 감안) */
const heardOk=(alts,target)=>{const t=norm(target),tw=words(target);return alts.some(a=>{const x=norm(a);if(x===t||x.includes(t)||(t.length>=4&&lev(x,t)<=1)||(t.length>=6&&lev(x,t)<=2))return true;
  if(tw.length>=3){const aw=words(a);const hit=tw.filter(w=>aw.some(v=>v===w||(w.length>=4&&lev(v,w)<=1))).length;return hit>=Math.ceil(tw.length*.75)}return false})};
/* 콩이(AI)용: 낱말이 정확히 다 들려야 통과. 긴 문장(3낱말 이상)은 3/4 이상 정확히 */
const heardAi=(a,target)=>{const tw=words(target),aw=words(a);if(!tw.length||!aw.length)return false;const hit=tw.filter(w=>aw.includes(w)).length;return tw.length>=3?hit>=Math.ceil(tw.length*.75):hit===tw.length&&aw.length<=tw.length+2};
/* 녹음: 16kHz 모노 WAV (base64). 최대 ms 지나면 저절로 멈춰요 */
K.recWav=async(maxMs,onLevel)=>{const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
  const AC=window.AudioContext||window.webkitAudioContext;const ac=new AC();const src=ac.createMediaStreamSource(st);const pr=ac.createScriptProcessor(4096,1,1);const bufs=[];let peak=0,stopped=false,res;
  pr.onaudioprocess=e=>{if(stopped)return;const d=e.inputBuffer.getChannelData(0);let m=0;for(let i=0;i<d.length;i+=8){const v=Math.abs(d[i]);if(v>m)m=v}peak=Math.max(peak,m);onLevel&&onLevel(m);bufs.push(new Float32Array(d))};
  src.connect(pr);pr.connect(ac.destination);
  const done=new Promise(r=>res=r);
  const stop=()=>{if(stopped)return;stopped=true;try{src.disconnect();pr.disconnect()}catch(e){}st.getTracks().forEach(t=>t.stop());const rate=ac.sampleRate;if(ac.close)ac.close();
    const len=bufs.reduce((a,b)=>a+b.length,0),all=new Float32Array(len);let o=0;bufs.forEach(b=>{all.set(b,o);o+=b.length});
    const R=16000,n=Math.floor(len*R/rate),pcm=new Int16Array(n);for(let i=0;i<n;i++){const v=all[Math.min(len-1,Math.floor(i*rate/R))];pcm[i]=Math.max(-1,Math.min(1,v))*32767}
    const buf=new ArrayBuffer(44+pcm.length*2),dv=new DataView(buf);const ws=(o,t)=>{for(let i=0;i<t.length;i++)dv.setUint8(o+i,t.charCodeAt(i))};
    ws(0,'RIFF');dv.setUint32(4,36+pcm.length*2,true);ws(8,'WAVE');ws(12,'fmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,R,true);dv.setUint32(28,R*2,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);ws(36,'data');dv.setUint32(40,pcm.length*2,true);
    new Int16Array(buf,44).set(pcm);let bin='';const u8=new Uint8Array(buf);for(let i=0;i<u8.length;i+=8192)bin+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));
    res({b64:btoa(bin),ms:Math.round(len/rate*1000),peak})};
  setTimeout(stop,maxMs);return {stop,done}};
/* 콩이(AI)가 녹음을 듣고 확인해요. 정답은 보내지 않고, 두 번 받아 적은 게 같고 확실할 때만 판단해요 */
function aiHear(sp,lang,finish,play){let tries=0,busy=false,ctl=null;const $$=K.$;
  const m0=$$('#mic'),mb='<button class="mic" id="mic" aria-label="말하기">🎤</button>';if(m0)m0.outerHTML=mb;else $$('#sl').insertAdjacentHTML('afterend',mb);$$('#sr2').innerHTML='';
  $$('#hd').textContent='🎤를 누르고 크게 말한 다음, ⏹를 눌러요';K.say(sp.noAuto?'이건 영어로 뭘까? 🎤를 누르고 말해 봐!':K.talk('sayask'));
  const giveUp=()=>{$$('#sr2').innerHTML='<button class="btn green" id="pok">👪 부모님: 잘 말했어요</button><button class="btn ghost" id="psk">다음에 할게요</button>';
    $$('#pok').onclick=()=>K.parentCheck(()=>finish('parent'));$$('#psk').onclick=()=>finish('skip')};
  const again=msg=>{tries++;K.sfx.soft();$$('#hd').innerHTML=msg;if(tries>=2)giveUp()};
  $$('#mic').onclick=async()=>{const mic=$$('#mic');if(busy==='rec'){if(ctl)ctl.stop();return}if(busy)return;busy='rec';
    try{ctl=await K.recWav(String(sp.text).split(' ').length>2?7000:4500,m=>{const b=$$('#mic');if(b)b.style.boxShadow=`0 0 0 ${Math.round(Math.min(1,m*3)*16)}px rgba(242,102,94,.35)`})}
    catch(e){busy=false;$$('#hd').textContent='마이크를 쓸 수 없어요. 크게 말하고 아래를 눌러요';giveUp();return}
    mic.classList.add('on');mic.textContent='⏹';$$('#hd').textContent='듣고 있어요… 다 말하면 ⏹를 눌러요';
    const r=await ctl.done;busy='think';if(!mic.isConnected)return;mic.classList.remove('on');mic.textContent='🎤';mic.style.boxShadow='';
    if(r.peak<.03||r.ms<400){busy=false;again('소리가 너무 작았어. 🎤를 누르고 더 크게 말해 봐!');return}
    $$('#hd').textContent='🔎 콩이가 듣고 있어요…';
    const h=await K.hearRead(r.b64,lang.slice(0,2));busy=false;if(!$$('#hd'))return;
    if(!h){again('콩이가 지금 잘 못 들었어. 한 번 더 말해 볼래?');return}
    sp.heard=h.text;const ok=heardAi(h.text,sp.text)&&heardAi(h.alt,sp.text);
    if(h.sure&&ok){K.sfx.good();$$('#hd').innerHTML=`<b style="color:var(--green-d)">${h.clarity>=3?'발음 최고! 또박또박 완벽해!':'잘 말했어! 콩이가 다 알아들었어.'}</b>`;K.say(K.talk('sayok'));K.later(()=>finish(tries?'ok2':'ok'),900);return}
    if(h.sure&&!ok){again(`'<b>${h.text}</b>'(으)로 들렸어. 🔊 한 번 더 듣고 말해 봐!`);play();return}
    again('콩이가 확실히 못 알아들었어. 조용한 곳에서 한 번 더 크게!')}}
K.speakPanel=(sp,G,done)=>{const acts=K.$('#acts');if(!acts){done();return}const lang=sp.lang||'en-US';let tries=0,busy=false;
  const finish=res=>{if(sp.own){G.P.sp=res;done(res);return}K.logSpeak&&K.logSpeak(res);done(res)};
  acts.innerHTML=`<div class="speak"><div style="font-size:16px">${sp.noAuto?'🗣️ 영어로 <b>소리 내어</b> 말해 봐! 모르면 🔊':'🗣️ 이제 <b>소리 내어</b> 따라 말해 봐!'}</div><div class="tw ${lang.startsWith('ko')?'ko':''}">${sp.hide||sp.show||sp.text}</div>
    <div class="row" style="align-items:center"><button class="listen" id="sl" style="width:64px;height:64px;font-size:28px" aria-label="듣기">🔊</button>${SR?'<button class="mic" id="mic" aria-label="말하기">🎤</button>':''}</div>
    <div class="heard" id="hd">${SR?'🎤를 누르고 크게 말해 봐':'잘 듣고 크게 따라 말해 봐'}</div><div class="row" id="sr2">${SR?'':'<button class="btn green" id="said" disabled>🗣️ 크게 따라 말했어요</button>'}</div></div>`;
  const play=()=>K.speakLang(sp.text,lang,.8);K.$('#sl').onclick=()=>{if(sp.noAuto&&G&&G.P&&!G.P.usedHint){G.P.usedHint=true;const tw=acts.querySelector('.tw');if(tw)tw.textContent=sp.text}play()};if(!sp.noAuto)K.later(play,300);
  if(K.hearOn&&K.hearOn()&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(window.AudioContext||window.webkitAudioContext)){aiHear(sp,lang,finish,play);return}
  if(!SR){K.later(()=>{const b=K.$('#said');if(b)b.disabled=false},2200);K.$('#said').onclick=()=>finish('self');K.say(K.talk('sayask'));return}
  K.say('잘 듣고 🎤를 누른 다음 크게 따라 말해 봐!');
  const giveUp=()=>{K.$('#sr2').innerHTML='<button class="btn green" id="pok">👪 부모님: 잘 말했어요</button><button class="btn ghost" id="psk">다음에 할게요</button>';
    K.$('#pok').onclick=()=>K.parentCheck(()=>finish('parent'));K.$('#psk').onclick=()=>finish('skip')};
  K.$('#mic').onclick=()=>{if(busy)return;busy=true;let r;try{r=new SR()}catch(e){giveUp();return}r.lang=lang;r.interimResults=false;r.maxAlternatives=5;
    const mic=K.$('#mic');mic.classList.add('on');K.$('#hd').textContent='듣고 있어요… 말해 봐!';let got=false;
    r.onresult=e=>{got=true;const alts=[...e.results[0]].map(x=>x.transcript);mic.classList.remove('on');busy=false;
      if(heardOk(alts,sp.text)){K.sfx.good();K.$('#hd').innerHTML=`<b style="color:var(--green-d)">완벽해! 또박또박 잘 말했어!</b>`;K.say(K.talk('sayok'));K.later(()=>finish(tries?'ok2':'ok'),900)}
      else{tries++;K.sfx.soft();K.$('#hd').textContent=`'${alts[0]}'(으)로 들렸어. 한 번 더 들어 보고 말해 봐!`;play();if(tries>=2)giveUp()}};
    r.onerror=e=>{mic.classList.remove('on');busy=false;if(e.error==='not-allowed'||e.error==='service-not-allowed'){K.$('#hd').textContent='마이크를 쓸 수 없어요. 크게 말하고 아래를 눌러요';giveUp()}else{K.$('#hd').textContent='잘 안 들렸어. 다시 🎤를 누르고 말해 봐!';tries++;if(tries>=2)giveUp()}};
    r.onend=()=>{mic.classList.remove('on');busy=false;if(!got&&K.$('#hd')&&K.$('#hd').textContent.startsWith('듣고'))K.$('#hd').textContent='잘 안 들렸어. 다시 🎤를 누르고 말해 봐!'};
    try{r.start()}catch(e){busy=false;giveUp();return}
    K.later(()=>{if(busy&&!got){try{r.abort()}catch(e){}busy=false;mic.classList.remove('on');tries++;const hd=K.$('#hd');if(hd)hd.textContent='잘 안 들렸어. 다시 🎤를 누르고 크게 말해 봐!';if(tries>=2)giveUp()}},8000)};
};
/* say: 그림을 보고 듣고, 따라 말하는 것 자체가 문제 */
function say(p,G){G.html(`<div class="qline"><span class="tag q">문제</span>${p.prompt||'잘 듣고 따라 말해요'}</div>${p.show?`<div class="show">${p.show}</div>`:''}`);G.hideTray();
  K.speakPanel(Object.assign({own:true},p.talk),G,res=>{if(res==='skip'||res==='self'){G.P.picks.push(res==='skip'?'말하기를 건너뜀':'스스로 말했다고 함');G.pending(res==='skip'?'괜찮아, 다음에 또 해 보자!':'좋아! 부모님이 나중에 확인해 줄 거야.');return}if(res==='ok2'){G.P.wrong++;G.P.picks.push('두 번째에 성공')}G.success(p.line||'잘 말했어!')});}
K.TYPES.say=say;

/* 한글 자모 도구 */
const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',JUNG='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ',JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const isH=s=>{const c=s.charCodeAt(0);return c>=0xAC00&&c<=0xD7A3};
const dec=s=>{const c=s.charCodeAt(0)-0xAC00;return [Math.floor(c/588),Math.floor(c%588/28),c%28]};
const comp=(a,b,c=0)=>String.fromCharCode(0xAC00+a*588+b*28+c);
const grp=(sets,ch)=>{const g=sets.find(s=>s.includes(ch));return g?[...g].filter(x=>x!==ch):[]};
const CG=['ㄱㄲㅋ','ㄷㄸㅌ','ㅂㅃㅍ','ㅅㅆ','ㅈㅉㅊ'],VG=['ㅐㅔ','ㅒㅖ','ㅙㅚㅞ','ㅓㅗ','ㅜㅡ','ㅕㅛ'],FG=[['ㄱ','ㄲ','ㅋ'],['ㄷ','ㅅ','ㅆ','ㅈ','ㅊ','ㅌ','ㅎ'],['ㅂ','ㅍ'],['ㄴ','ㅇ','ㅁ'],['ㄹ']];
/* 소리가 비슷해서 헷갈리는 글자들 */
function confuse(s){if(!isH(s))return [];const [a,b,c]=dec(s);const out=new Set();
  grp(CG,CHO[a]).forEach(x=>out.add(comp(CHO.indexOf(x),b,c)));
  grp(VG,JUNG[b]).forEach(x=>out.add(comp(a,JUNG.indexOf(x),c)));
  if(c){out.add(comp(a,b,0));grp(FG,JONG[c]).forEach(x=>out.add(comp(a,b,JONG.indexOf(x))))}else['ㄴ','ㅇ','ㄹ'].forEach(x=>out.add(comp(a,b,JONG.indexOf(x))));
  out.delete(s);return [...out]}
K.hangul={CHO,JUNG,JONG,isH,dec,comp,confuse,cho:s=>isH(s)?CHO[dec(s)[0]]:s,hasJong:s=>isH(s)&&dec(s)[2]>0};
})();
