/* 손글씨 읽기 (받아쓰기 자동 채점)
   - 부모님 설정에 Gemini 키(AIza…)를 넣으면 이 폰에서 바로 구글 Gemini에 물어봐요.
   - 채점 서버 주소(https://…)를 넣으면 그 서버(worker/ocr-worker.js)에 물어봐요.
   정답은 절대 보내지 않아요. 정답을 알면 AI가 틀린 글씨를 맞게 고쳐 읽을 수 있어서예요.
   확실할 때만 채점해요: 같은 사진을 두 가지 방법(글자 그대로 / 자음·모음으로 나눠서)으로 읽고,
   둘이 똑같고 둘 다 확실하다고 할 때만 sure=true. 아니면 부모님 확인으로 넘어가요. */
'use strict';
(()=>{
const S=K.S;
const MODELS=['gemini-3.5-flash','gemini-3.1-flash-lite','gemini-2.5-flash'];
const DAY_MAX=300; /* 하루 최대 호출 수(한 번 채점에 2번 불러요) */
const API='https://generativelanguage.googleapis.com/v1beta/models/';

const P_TEXT=n=>`이 사진은 어린아이가 손으로 쓴 한글 받아쓰기예요. 칸이 ${n}개 있어요.
아이가 실제로 쓴 글자를 한 글자씩 그대로 옮겨 적어요.
- 맞춤법이 틀려도 절대 고치지 말고, 보이는 그대로 적어요.
- 받침이 없거나 획이 빠졌으면 빠진 그대로 적어요. 비슷한 낱말로 짐작하지 말아요.
- 알아볼 수 없거나 두 글자 중 헷갈리는 글자는 ? 로 적어요.
- 빈칸은 ? 로 적어요. 띄어쓰기는 무시하고 글자만 이어서 적어요.
JSON으로만 답해요: {"text":"읽은 글자","sure":true 또는 false}
sure는 모든 글자를 확실히 읽었을 때만 true예요.`;
const P_JAMO=n=>`이 사진은 어린아이가 손으로 쓴 한글 받아쓰기예요. 칸이 ${n}개 있어요.
칸마다 아이가 실제로 쓴 획을 보고 초성, 중성, 종성(받침)으로 나눠 적어요.
- 낱말을 짐작하지 말고 획만 봐요. 받침이 없으면 종성은 "" 로 적어요.
- 겹받침·겹모음은 하나로 적어요 (예: "ㄳ", "ㅘ"). 된소리도 하나로 적어요 (예: "ㄲ").
- 알아볼 수 없는 칸은 ["?","?","?"] 로 적어요.
JSON으로만 답해요: {"cells":[["초성","중성","종성"], ...],"sure":true 또는 false}
sure는 모든 칸의 모든 자모를 확실히 읽었을 때만 true예요.`;

/* 영어 쓰기: 글자 그대로 / 칸마다 한 글자씩 (대·소문자 구분) */
const P_TEXT_EN=n=>`This photo shows English letters handwritten by a young child, in ${n} boxes.
Copy exactly the letters the child actually wrote, box by box, keeping upper/lower case as written.
- Never fix spelling. Do not guess a real word. If a letter is missing or wrong, keep it that way.
- If a box is empty or a letter is unreadable or could be two different letters, write ? for it.
Reply only JSON: {"text":"letters you read","sure":true or false}. sure is true only if you are certain of every letter.`;
const P_LET_EN=n=>`This photo shows English letters handwritten by a young child, in ${n} boxes.
Look at the strokes in each box separately, from left to right, and name the single letter in it.
- Do not read it as a word. Judge each box only by its own strokes. Keep upper/lower case as written.
- Empty or unreadable box: "?".
Reply only JSON: {"cells":["a","B", ...],"sure":true or false}. sure is true only if you are certain of every box.`;
/* 말하기: 녹음을 그대로 받아 적기 / 낱말마다 나눠 적기. 정답은 보내지 않아요 */
const P_HEAR=lang=>`This is a short recording of a young child speaking ${lang==='ko'?'Korean':'English'}.
Write down exactly what the child said, word for word, as it actually sounded. Do not fix grammar or pronunciation into the word you think they meant.
If there is no speech, write "". If a word is unclear, write ? for it.
Also rate how clearly the child pronounced it: 1 (hard to understand), 2 (understandable), 3 (very clear).
Reply only JSON: {"text":"what was said","clarity":1-3,"sure":true or false}. sure is true only if you are certain of every word.`;
const P_HEAR2=lang=>`Listen to this short recording of a young child speaking ${lang==='ko'?'Korean':'English'}.
List every word you hear, one by one, in order, exactly as pronounced. Do not guess intended words. Unclear word: "?".
Reply only JSON: {"words":["word1","word2", ...],"sure":true or false}. sure is true only if you are certain of every word.`;

/* 자모 → 글자 */
const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',JUNG='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ',JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const compose=c=>{if(!Array.isArray(c))return '?';const [a,b,z]=c.map(x=>String(x==null?'':x).trim());const i=CHO.indexOf(a),j=JUNG.indexOf(b),k=JONG.indexOf(z||'');
  if(!a||!b||i<0||j<0||k<0)return '?';return String.fromCharCode(0xAC00+(i*21+j)*28+k)};
K.ocrCompose=compose;

/* 답 글에서 JSON 꺼내기 (```json … ``` 으로 감싸 와도) */
const parse=raw=>{const s=String(raw||'').replace(/```(?:json)?/gi,'').trim();try{return JSON.parse(s)}catch(e){}
  const m=/\{[\s\S]*\}/.exec(s);if(m){try{return JSON.parse(m[0])}catch(e){}}return null};
const clean=t=>String(t||'').replace(/\s/g,'').slice(0,40);
/* 두 번 읽은 결과로 확실한지 정해요 */
K.ocrDecideEn=(a,b,n,cs)=>{const ta=a?clean(a.text):'';const tb=b&&Array.isArray(b.cells)?b.cells.map(x=>String(x||'?').trim().slice(0,1)||'?').join(''):'';
  const eq=(x,y)=>cs?x===y:x.toLowerCase()===y.toLowerCase();
  const why=!a||!b?'read':!ta?'empty':ta.length!==n?'len':/\?/.test(ta+tb)||/[^A-Za-z]/.test(ta)?'unclear':!eq(ta,tb)?'differ':!(a.sure===true||b.sure===true)?'unsure':'';
  return {text:ta,alt:tb,sure:!why,why}};
K.ocrDecide=(a,b,n)=>{const ta=a?clean(a.text):'';const tb=b&&Array.isArray(b.cells)?b.cells.map(compose).join(''):'';
  const why=!a||!b?'read':!ta?'empty':[...ta].length!==n?'len':/\?/.test(ta+tb)?'unclear':ta!==tb?'differ':!(a.sure===true||b.sure===true)?'unsure':'';
  return {text:ta,alt:tb,sure:!why,why}};

/* 구글 키: 예전 형식 AIza…(39자), 2026년 5월부터 새 형식 AQ.…(53자) */
K.keyFix=u=>String(u||'').replace(/[\s"'`]/g,'');
K.isKey=u=>{u=K.keyFix(u);return /^AIza[\w-]{30,}$/.test(u)||/^AQ\.[\w.-]{30,}$/.test(u)};
/* 키 모양 점검: '' 이면 괜찮음, 아니면 안내 문장 */
K.keyHint=u=>{u=K.keyFix(u);if(/[…*•]|\.\.\./.test(u))return '키가 가려진(…) 모양이에요. AI Studio에서 키를 눌러 열고 「키 복사(Copy key)」로 전체를 복사해 주세요.';
  if(/^AQ\./.test(u)&&u.length<50)return `키가 잘린 것 같아요 (${u.length}자, 보통 53자). 「키 복사(Copy key)」로 전체를 다시 복사해 주세요.`;
  if(/^AIza/.test(u)&&u.length<39)return `키가 잘린 것 같아요 (${u.length}자, 보통 39자). 전체를 다시 복사해 주세요.`;
  if(!/^(AIza|AQ\.|https:\/\/)/.test(u))return '구글 키는 AQ. 또는 AIza로 시작해요. 다른 걸 복사한 것 같아요.';return ''};
K.ocrOn=()=>!!(S.ocrKey||S.ocrUrl);
K.setOcr=u=>{u=/^https:/.test(String(u||'').trim())?String(u).trim():K.keyFix(u);if(K.isKey(u)){S.ocrKey=u;S.ocrUrl=''}else{S.ocrUrl=u;S.ocrKey=''}K.save()};
const count=()=>{const d=new Date().toISOString().slice(0,10);if(!S.ocrN||S.ocrN.d!==d)S.ocrN={d,n:0};return S.ocrN};

const timeout=(ms,ac)=>setTimeout(()=>ac.abort(),ms);
/* 이 키로 쓸 수 있는 모델을 구글에 물어서 고르고 하루 동안 기억해요 (없는 모델을 부르느라 느려지지 않게) */
const FALLBACK=['gemini-3.1-flash-lite','gemini-2.5-flash-lite','gemini-2.5-flash','gemini-3-flash-preview'];
const verOf=n=>{const m=/^gemini-(\d+(?:\.\d+)?)-flash/.exec(n);return m?+m[1]:0};
/* 무료 키로 쓸 모델 고르기: 가장 새 모델은 무료 한도가 없거나(0) 붐비는 일이 많아서,
   가볍고 빠른 flash-lite를 먼저, 그다음 flash. 같은 종류면 새 버전 먼저. 실제로 되는지는 써 보면서 배워요 */
K.ocrRank=names=>{const ok=names.filter(n=>/^gemini-\d+(\.\d+)?-flash(-lite)?(-preview)?(-\d\d-\d\d\d?\d?)?$/.test(n));
  const score=n=>(/-lite/.test(n)?100:0)+verOf(n)*10+(/preview|-\d\d-\d\d/.test(n)?0:2);
  return ok.sort((x,y)=>score(y)-score(x)).slice(0,8)};
let modelsP=null;
const models=key=>{const c=S.ocrModels;if(c&&c.v===2&&c.k===key.slice(-6)&&c.t>Date.now()-864e5&&c.list.length)return Promise.resolve(c.list);
  if(modelsP)return modelsP;
  const ac=new AbortController();setTimeout(()=>ac.abort(),8000);modelsP=fetch(API.replace(/\/$/,'')+'?pageSize=200',{headers:{'x-goog-api-key':key},signal:ac.signal}).then(r=>r.ok?r.json():null).then(j=>{
    const names=((j&&j.models)||[]).filter(m=>!m.supportedGenerationMethods||m.supportedGenerationMethods.includes('generateContent')).map(m=>String(m.name||'').replace(/^models\//,''));
    const list=K.ocrRank(names);if(list.length){S.ocrModels={v:2,k:key.slice(-6),t:Date.now(),list};K.save();return list}return FALLBACK}).catch(()=>FALLBACK).finally(()=>{modelsP=null});
  return modelsP};
/* 생각(추론)을 최소로: 3세대부터는 thinkingLevel, 2.5는 thinkingBudget. 생각도 출력 길이에 들어가서 넉넉히 둬요 */
/* 모델이 'minimal'을 모르면 'low', 그것도 모르면 설정 없이 */
const thinkList=m=>verOf(m)>=3?[{thinkingLevel:'minimal'},{thinkingLevel:'low'},null]:/2\.5-flash/.test(m)?[{thinkingBudget:0},null]:[null];
const LOG=[];K.ocrLog=LOG;const log=e=>{LOG.unshift(Object.assign({t:Date.now()},e));LOG.length=Math.min(LOG.length,16)};
/* 한 모델에 너무 오래 매달리지 않아요: 한 번 묻는 데 최대 14초, 넘으면 다음 모델로 */
const PER=14000;
/* 안 되는 모델은 한동안 건너뛰어요: 무료 한도 없음/다 씀 6시간, 1분 한도 1분, 붐빔 10분, 느림 30분, 없음 하루 */
const skip=(m,ms)=>{S.ocrSkip=Object.assign({},S.ocrSkip,{[m]:Date.now()+ms})};
const order=list=>{const g=S.ocrGood||{},sk=S.ocrSkip||{},now=Date.now();
  const live=list.filter(m=>!(sk[m]>now));const use=live.length?live:list.slice().sort((x,y)=>(sk[x]||0)-(sk[y]||0)).slice(0,1);
  /* 최근에 잘 된 모델이 있으면 그걸 먼저 */
  return use.map((m,i)=>[m,i]).sort((a,b)=>((g[b[0]]||0)>now-6*36e5)-((g[a[0]]||0)>now-6*36e5)||a[1]-b[1]).map(x=>x[0])};
const why429=msg=>/per.?minute|PerMinute|RPM/i.test(msg)?6e4:6*36e5;
async function gemini(key,prompt,mime,data,signal){let last=0;const list=order(await models(key));
  for(const model of list){for(const tc of thinkList(model)){const think=!!tc;if(signal.aborted)throw new Error('시간 초과');
    /* 3세대 모델은 temperature를 낮추면 같은 말을 되풀이하며 멈추지 않을 수 있어서 기본값(1.0)을 그대로 둬요 */
    const gc=Object.assign({responseMimeType:'application/json',maxOutputTokens:1024},verOf(model)>=3?{}:{temperature:0},tc?{thinkingConfig:tc}:{});
    const body={contents:[{parts:[{text:prompt},{inline_data:{mime_type:mime,data}}]}],generationConfig:gc};
    const one=new AbortController();const kill=()=>one.abort();signal.addEventListener('abort',kill);const tm=setTimeout(kill,PER);const t1=Date.now();
    let r;try{r=await fetch(API+model+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify(body),signal:one.signal});
      last=r.status;
      if(r.ok){const j=await r.json();const c=(j.candidates||[])[0]||{};const raw=(c.content||{}).parts;const out=parse((raw||[]).filter(p=>!p.thought).map(p=>p.text||'').join(''));
        log({model,ms:Date.now()-t1,st:200,fin:c.finishReason||'',ok:!!out});
        if(out){S.ocrGood=Object.assign({},S.ocrGood,{[model]:Date.now()});return Object.assign(out,{_m:model})}last='빈 답 '+(c.finishReason||'');break}
      let msg='',full='';try{const e=await r.json();full=JSON.stringify(e||{});msg=((e&&e.error&&e.error.message)||'').replace(/[<>&"]/g,'').slice(0,60)}catch(e){}
      if(r.status===429)skip(model,why429(full));else if(r.status===503||r.status===500)skip(model,10*6e4);else if(r.status===404||r.status===403)skip(model,864e5);
      log({model,ms:Date.now()-t1,st:r.status,msg})}
    catch(e){const outer=signal.aborted;log({model,ms:Date.now()-t1,st:outer?'시간 초과':'느림'});
      if(outer)throw new Error('시간 초과');skip(model,30*6e4);last='느림';break}
    finally{clearTimeout(tm);signal.removeEventListener('abort',kill)}
    if(r.status===400&&think)continue; /* 생각 설정을 모르는 모델이면 다르게 한 번 더 */
    break}
    if(typeof last==='number'&&![400,403,404,429,500,503].includes(last))break; /* 키가 틀린 것(401 등)이면 다른 모델도 소용없어요 */}
  throw new Error('gemini '+last)}

/* 읽기: {text, sure, why} 또는 null(연결 안 됨) */
K.ocrRead=async(img,n,o={})=>{const en=o.lang==='en';const ac=new AbortController();const to=timeout(45000,ac);
  try{
    if(S.ocrKey){const c=count();if(c.n+2>DAY_MAX){K.ocrLast={why:'cap'};return null}c.n+=2;K.save();
      const m=/^data:(image\/(?:jpeg|png));base64,(.+)$/.exec(img||'');if(!m)return null;const t0=Date.now(),errs=[];K.ocrLast={t0};const er=e=>{errs.push(ac.signal.aborted?'시간 초과':String(e&&e.message||e));return null};
      const [a,b]=await Promise.all([gemini(S.ocrKey,(en?P_TEXT_EN:P_TEXT)(n),m[1],m[2],ac.signal).catch(er),gemini(S.ocrKey,(en?P_LET_EN:P_JAMO)(n),m[1],m[2],ac.signal).catch(er)]);
      const ms=Date.now()-t0;if(!a&&!b){K.ocrLast={t0,why:'net',err:[...new Set(errs)].join(', '),ms};return null}
      const d=en?K.ocrDecideEn(a,b,n,!!o.cs):K.ocrDecide(a,b,n);K.ocrLast=Object.assign({t0,ms,m:(a&&a._m)||(b&&b._m)||'',err:errs.join(', ')},d);return d}
    if(S.ocrUrl&&!en){const r=await fetch(S.ocrUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:img,cells:n}),signal:ac.signal});
      if(!r.ok)return null;const j=await r.json();if(!j||typeof j.text!=='string')return null;
      const t=clean(j.text);return {text:t,sure:!!j.sure&&[...t].length===n&&!/\?/.test(t),why:j.why||''}}
    return null}
  catch(e){return null}finally{clearTimeout(to)}};

/* 설정 시험용: 칸 안에 손글씨처럼 그린 글자 사진 */
K.ocrSample=t=>{const n=[...t].length,c=document.createElement('canvas');c.width=200*n;c.height=260;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='#ddd';x.lineWidth=2;for(let i=1;i<n;i++){x.beginPath();x.moveTo(200*i,0);x.lineTo(200*i,260);x.stroke()}
  x.fillStyle='#3D2E28';x.font='bold 150px "Gaegu","Jua",sans-serif';x.textAlign='center';x.textBaseline='middle';[...t].forEach((ch,i)=>x.fillText(ch,200*i+100,135));
  return c.toDataURL('image/jpeg',.8)};
/* 설정에 보여 줄 오늘 사용량: 이 폰에서 센 값이에요 (구글 쪽 정확한 잔량은 AI Studio에서) */
K.ocrUsage=()=>{if(!S.ocrKey)return '';const d=new Date().toISOString().slice(0,10);const n=S.ocrN&&S.ocrN.d===d?S.ocrN.n:0;const now=Date.now();
  const sk=Object.entries(S.ocrSkip||{}).filter(([m,t])=>t>now).map(([m,t])=>`${m.replace('gemini-','')} (${Math.ceil((t-now)/6e4)}분 뒤 다시)`);
  const g=Object.entries(S.ocrGood||{}).sort((a,b)=>b[1]-a[1])[0];
  return `오늘 이 폰에서 AI에 물어본 횟수: <b>${n}번</b> (채점 한 번에 2번, 하루 최대 ${DAY_MAX}번)`+(g?`<br>최근에 잘 된 모델: ${g[0].replace('gemini-','')}`:'')+(sk.length?`<br>잠시 쉬는 모델: ${sk.join(', ')}`:'')};
/* 왜 못 읽었는지 부모님께 보여 줄 말 */
K.ocrWhy=l=>{if(!l)return '';const W={cap:'오늘 사용량을 다 썼어요',net:'구글에 연결하지 못했어요'+(l.err?' ('+l.err+')':''),read:'두 번 중 한 번만 읽혔어요'+(l.err?' ('+l.err+')':''),empty:'빈 칸으로 읽었어요',
  len:`글자 수가 다르게 읽혔어요 (${l.text||''})`,unclear:`알아보기 어려운 글자가 있어요 (${l.text||''} / ${l.alt||''})`,differ:`두 번 읽은 게 달라요 (${l.text||''} / ${l.alt||''})`,unsure:`두 번 다 자신 없다고 했어요 (${l.text||''})`};
  const tries=LOG.filter(e=>!l.t0||e.t>=l.t0).slice(0,6).reverse().map(e=>`${e.model.replace('gemini-','')} ${e.st}${e.fin&&e.fin!=='STOP'?'/'+e.fin:''} ${(e.ms/1000).toFixed(1)}초${e.msg?' ('+e.msg+')':''}`).join(' → ');
  return (W[l.why]||l.why||'')+(l.ms?` · ${(l.ms/1000).toFixed(1)}초`:'')+(tries?`<br><small>${tries}</small>`:'')};
/* 말 듣기: {text, alt, sure, clarity, why} 또는 null. 키가 있을 때만 */
K.hearOn=()=>!!S.ocrKey;
K.hearRead=async(b64,lang)=>{if(!S.ocrKey)return null;const c=count();if(c.n+2>DAY_MAX)return null;c.n+=2;K.save();
  const ac=new AbortController();const to=timeout(45000,ac);
  try{const [a,b]=await Promise.all([gemini(S.ocrKey,P_HEAR(lang),'audio/wav',b64,ac.signal).catch(()=>null),gemini(S.ocrKey,P_HEAR2(lang),'audio/wav',b64,ac.signal).catch(()=>null)]);
    if(!a&&!b)return null;return K.hearDecide(a,b)}catch(e){return null}finally{clearTimeout(to)}};
const nw=t=>String(t||'').toLowerCase().replace(/[^a-z0-9가-힣?\s']/g,' ').replace(/\s+/g,' ').trim();
K.hearDecide=(a,b)=>{const ta=a?nw(a.text):'';const tb=b&&Array.isArray(b.words)?nw(b.words.join(' ')):'';
  const why=!a||!b?'read':!ta?'empty':/\?/.test(ta+' '+tb)?'unclear':ta.replace(/[\s']/g,'')!==tb.replace(/[\s']/g,'')?'differ':!(a.sure===true||b.sure===true)?'unsure':'';
  return {text:ta,alt:tb,sure:!why,why,clarity:a&&+a.clarity||0}};

/* 설정의 '연결 확인': true 또는 안내 문장 */
K.ocrCheck=async u=>{
  if(K.isKey(u)){u=K.keyFix(u);const r=await fetch(API.replace(/models\/$/,'models')+'?pageSize=50',{headers:{'x-goog-api-key':u}});
    if(r.ok){const j=await r.json().catch(()=>({}));const names=(j.models||[]).map(x=>x.name||'');return names.length&&!names.some(x=>/gemini-[\d.]+-flash/.test(x))?'키는 맞지만 글씨를 읽을 Flash 모델이 안 보여요. 잠시 뒤 다시 확인해 주세요.':true}
    if(r.status===400||r.status===401||r.status===403)return '키가 맞지 않아요. AI Studio에서 키를 눌러 열고 「키 복사(Copy key)」로 처음부터 끝까지 다시 복사해 주세요.';
    if(r.status===429)return '오늘 무료 사용량을 다 썼어요. 내일 다시 확인해 주세요.';return '구글 서버가 답하지 않아요 (오류 '+r.status+'). 잠시 뒤 다시 해 주세요.'}
  const r=await fetch(u);const j=await r.json().catch(()=>null);
  if(j&&j.ok&&j.key===false)return '서버는 찾았지만 GEMINI_KEY가 없어요. 안내서를 확인해 주세요.';
  if(j&&j.ok)return true;return '주소는 열렸지만 채점 서버가 아니에요. 주소를 다시 확인해 주세요.'};
})();
