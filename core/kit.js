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
.frame{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;font-size:26px;line-height:1.3}
.frame .slot{min-width:72px;min-height:72px}
.frame.tight{gap:2px}
.frame.tight .word{font-size:44px}
.frame .slot .stuck{font-size:34px}
.frame .slot.wide{min-width:120px}
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
.selfcheck{display:flex;gap:10px}
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
   <div class="frame ${p.tight?'tight':''}" id="frame">${frame.map(x=>typeof x==='number'?`<div class="slot ${p.wide?'wide':''}" data-k="${x}">?</div>`:`<span>${x}</span>`).join('')}</div>${p.after||''}`);
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
  G.hideTray();bindListen({text:p.say||p.word,lang:'ko-KR',rate:.8});
  const cv=$('#cv'),pw=$('#pw'),ctx=cv.getContext('2d');let strokes=[],cur=null;
  let cols=cells,rows=1;
  const size=()=>{const w=pw.clientWidth;const maxC=Math.max(3,Math.floor(w/64));rows=Math.ceil(cells/maxC);cols=Math.ceil(cells/rows);
    const pg=$('#pg');pg.style.gridTemplateColumns=`repeat(${cols},1fr)`;pg.style.gridTemplateRows=`repeat(${rows},1fr)`;
    pg.innerHTML=Array.from({length:cols*rows},(_,i)=>`<i style="${(i+1)%cols===0?'border-right:0;':''}${i>=cols*(rows-1)?'border-bottom:0;':''}${i>=cells?'background:#F6EFE4':''}"></i>`).join('');
    const h=rows*Math.min(200,Math.max(100,w/cols*1.0));const dpr=window.devicePixelRatio||1;cv.width=w*dpr;cv.height=h*dpr;cv.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);redraw()};
  const redraw=()=>{ctx.clearRect(0,0,cv.width,cv.height);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#3D2E28';ctx.lineWidth=Math.max(5,pw.clientWidth/cols/14);
    strokes.forEach(s=>{ctx.beginPath();s.forEach((pt,i)=>i?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]));if(s.length===1)ctx.lineTo(s[0][0]+.1,s[0][1]);ctx.stroke()})};
  const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  cv.addEventListener('pointerdown',e=>{if(G.P.done)return;e.preventDefault();cv.setPointerCapture(e.pointerId);cur=[pos(e)];strokes.push(cur);redraw()});
  cv.addEventListener('pointermove',e=>{if(!cur)return;e.preventDefault();cur.push(pos(e));redraw()});
  const end=()=>{if(cur){cur=null;G.edit()}};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  $('#undo').onclick=()=>{strokes.pop();redraw();G.edit()};$('#clr').onclick=()=>{strokes=[];redraw();G.edit()};
  const onR=()=>{if(!pw.isConnected){window.removeEventListener('resize',onR);return}size()};window.addEventListener('resize',onR);K.later(size,30);size();
  const snap=()=>{const t=document.createElement('canvas');const w=360,h=Math.round(w*cv.height/cv.width);t.width=w;t.height=h;const c=t.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,w,h);c.drawImage(cv,0,0,w,h);return t.toDataURL('image/jpeg',.6)};
  /* 다 쓰면 정답을 보여 주고 아이가 스스로 비교해요. 부모님은 리포트에서 쓴 글씨를 봐요 */
  let stage='write';
  G.answer({label:'✔ 다 썼어요',ready:()=>strokes.length>0,hints:(p.hints||[]).map(h=>()=>G.say(h)),
    check:()=>{if(stage==='write'){stage='self';G.P.img=snap();showCompare();return {ok:false,silent:true}}return {ok:false}}});
  const origSubmit=G.submit;G.submit=()=>{if(stage==='write'){G.P.img=snap();stage='self';showCompare()}};
  function showCompare(){K.$('#acts').innerHTML='';pw.style.pointerEvents='none';$('#undo').disabled=true;$('#clr').disabled=true;
    $('#cmp').innerHTML=`<div class="compare"><div class="muted" style="font-size:15px">정답</div><div class="answord">${p.word}</div><div class="muted" style="font-size:15px">글자 하나하나 똑같이 썼는지 비교해 봐!</div>
      <div class="selfcheck"><button class="btn green" id="same">⭕ 똑같이 썼어요</button><button class="btn" id="diff" style="background:var(--red);box-shadow:0 6px 0 #C94A43">❌ 다르게 썼어요</button></div></div>`;
    K.say('정답이랑 내가 쓴 글씨를 비교해 봐! 똑같이 썼어?');
    $('#same').onclick=()=>{G.P.self='same';G.success(p.line||`잘했어! ${p.word}, 맞춤법 대장!`)};
    $('#diff').onclick=()=>{G.P.self='diff';G.P.wrong++;G.P.picks.push('처음 쓴 글씨가 정답과 달랐어요');G.P.img0=G.P.img0||G.P.img;
      $('#cmp').innerHTML=`<div class="compare"><div class="answord">${p.word}</div><div style="font-size:16px">${p.tip?p.tip+' ':''}한 번 더 써 볼까?</div></div>`;
      stage='write';strokes=[];redraw();pw.style.pointerEvents='';$('#undo').disabled=false;$('#clr').disabled=false;K.$('#cmp .answord').style.opacity='1';
      K.later(()=>{K.$('#cmp').innerHTML='<div class="compare"><div class="muted">이번엔 정답을 안 보고 다시 써 봐!</div></div>'},2500);
      G.actions(G._acts);G.refresh();K.say('괜찮아! 틀린 글자를 기억하고 다시 써 보자.')}}
  G.say(p.sayKo||'잘 듣고 칸에 또박또박 써 봐! 다 쓰면 <b>다 썼어요</b>를 눌러요.');
}

K.TYPES={quiz,sort,write};

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
