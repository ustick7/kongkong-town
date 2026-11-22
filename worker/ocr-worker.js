/* 콩콩마을 손글씨 채점 서버 (Cloudflare Workers 무료 + Google Gemini 무료)
 * 게임이 아이가 쓴 글씨 사진을 보내면, Gemini가 읽은 글자를 돌려줘요.
 * 정답은 보내지 않아요. 정답을 알면 AI가 틀린 글씨도 맞게 고쳐 읽을 수 있어서예요.
 *
 * 설정 (Cloudflare 대시보드 > Worker > 설정 > 변수):
 *   GEMINI_KEY    (비밀) Google AI Studio에서 받은 키
 *   ALLOW_ORIGIN  게임 주소. 기본값 https://ustick7.github.io
 *   MODEL         (선택) 쓸 모델. 비워 두면 아래 MODELS를 차례로 시도해요
 *   DAILY_MAX     (선택) 하루 최대 채점 횟수. 기본값 300
 *   COUNT         (선택) KV 이름공간 연결. 연결하면 하루 횟수를 정확히 세요
 */
/* 무료로 쓸 수 있는 Flash 모델 (2026년 11월 공식 가격표 기준). 앞의 것이 안 되면 다음 것으로 */
const MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];
let mem = { day: '', n: 0 };
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

const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',JUNG='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ',JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const compose=c=>{if(!Array.isArray(c))return '?';const [a,b,z]=c.map(x=>String(x==null?'':x).trim());const i=CHO.indexOf(a),j=JUNG.indexOf(b),k=JONG.indexOf(z||'');
  if(!a||!b||i<0||j<0||k<0)return '?';return String.fromCharCode(0xAC00+(i*21+j)*28+k)};
const parse=raw=>{const s=String(raw||'').replace(/```(?:json)?/gi,'').trim();try{return JSON.parse(s)}catch(e){}
  const m=/\{[\s\S]*\}/.exec(s);if(m){try{return JSON.parse(m[0])}catch(e){}}return null};
const clean=t=>String(t||'').replace(/\s/g,'').slice(0,40);
/* 두 번 읽은 결과로 확실한지 정해요 */
const decide=(a,b,n)=>{const ta=a?clean(a.text):'';const tb=b&&Array.isArray(b.cells)?b.cells.map(compose).join(''):'';
  const why=!a||!b?'read':!ta?'empty':[...ta].length!==n?'len':/\?/.test(ta+tb)?'unclear':ta!==tb?'differ':!(a.sure===true&&b.sure===true)?'unsure':'';
  return {text:ta,alt:tb,sure:!why,why}};


export default {
  async fetch(req, env) {
    const allow = env.ALLOW_ORIGIN || 'https://ustick7.github.io';
    const origin = req.headers.get('Origin') || '';
    const okOrigin = origin === allow || origin.startsWith('http://localhost') || origin === 'null';
    const cors = { 'Access-Control-Allow-Origin': okOrigin ? origin : allow, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Content-Type': 'application/json; charset=utf-8' };
    const out = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: cors });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method === 'GET') return out({ ok: true, name: 'kongkong-ocr', key: !!env.GEMINI_KEY, count: !!env.COUNT });
    if (req.method !== 'POST') return out({ error: 'method' }, 405);
    if (!okOrigin) return out({ error: 'origin' }, 403);
    if (!env.GEMINI_KEY) return out({ error: 'no key' }, 500);
    let body;
    try { body = await req.json(); } catch (e) { return out({ error: 'json' }, 400); }
    const m = /^data:(image\/(?:jpeg|png));base64,(.+)$/.exec(body.image || '');
    if (!m || m[2].length > 400000) return out({ error: 'image' }, 400);
    const cells = Math.max(1, Math.min(30, +body.cells || 1));
    /* 하루 횟수 제한: 무료 사용량을 지키고, 주소가 새어 나가도 마구 쓰이지 않게 */
    const day = new Date().toISOString().slice(0, 10), max = +env.DAILY_MAX || 300;
    let n;
    if (env.COUNT) { n = +(await env.COUNT.get(day)) || 0; } else { if (mem.day !== day) mem = { day, n: 0 }; n = mem.n; }
    if (n >= max) return out({ error: 'limit' }, 429);
    if (env.COUNT) await env.COUNT.put(day, String(n + 1), { expirationTtl: 172800 }); else mem.n++;
    const call = (prompt, model, think) => fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: m[1], data: m[2] } }] }],
        generationConfig: Object.assign({ temperature: 0, responseMimeType: 'application/json', maxOutputTokens: 600 }, think ? { thinkingConfig: { thinkingBudget: 0 } } : {})
      })
    });
    /* 같은 사진을 두 가지 방법으로 읽어요: 글자 그대로, 자음·모음으로 나눠서. 둘이 같을 때만 확실 */
    const read = async prompt => {
      let r;
      for (const model of env.MODEL ? [env.MODEL] : MODELS) {
        r = await call(prompt, model, true);
        if (r.status === 400) r = await call(prompt, model, false);
        if (r.ok || ![400, 403, 404, 429, 500, 503].includes(r.status)) break;
      }
      if (!r.ok) return null;
      const j = await r.json();
      return parse((((j.candidates || [])[0] || {}).content || {}).parts?.map(p => p.text || '').join('') || '');
    };
    const [a, b] = await Promise.all([read(P_TEXT(cells)).catch(() => null), read(P_JAMO(cells)).catch(() => null)]);
    if (!a && !b) return out({ error: 'gemini' }, 502);
    return out(decide(a, b, cells));
  }
};
