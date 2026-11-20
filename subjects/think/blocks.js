/* 생각콩 · 쌓기나무 세기 */
(()=>{
K.css(`
.iso{display:block;margin:0 auto;max-width:100%;overflow:visible}
.iso .cube{transition:transform .9s cubic-bezier(.34,1.3,.5,1)}
.iso.xray polygon{fill-opacity:.35;stroke-dasharray:3 2}
.iso .badge circle{fill:var(--blue)} .iso .badge text{fill:#fff;font-family:var(--f-disp);font-size:13px}
.iso .layer-lb{font-family:var(--f-disp);font-size:14px;fill:var(--orange-d)}
.twin{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.twin>div{flex:1 1 140px;max-width:240px;background:#FAF5EC;border-radius:16px;padding:6px;position:relative;text-align:center}
.twin .nm{font-size:18px}
.twin .stuck{position:absolute;top:-10px;right:-6px}
`);
/* h[y][x] = 그 자리의 높이. 등각 투영으로 그려요 */
const S=34,A=S*.866;
const COLS=[['#FFD58A','#F2B75C','#D9963A'],['#A9DBF5','#79C1EA','#4E9FD0'],['#C5E9A6','#9CD17A','#76B255']];
function cubesOf(h){const cs=[];h.forEach((row,y)=>row.forEach((n,x)=>{for(let z=0;z<n;z++)cs.push({x,y,z})}));
  return cs.sort((a,b)=>(a.x+a.y)-(b.x+b.y)||a.z-b.z)}
function isoSVG(h,id,{color=0}={}){
  const cs=cubesOf(h);const W=h[0].length,D=h.length,Hm=Math.max(...h.flat());
  const ox=D*A+10,oy=Hm*S+S/2+10+ (Hm>1?(Hm-1)*14:0);
  const w=(W+D)*A+20,ht=oy+(W+D)*S/2+S+10;
  const col=COLS[color];
  const poly=(pts,f)=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${f}" stroke="#7A5A3A" stroke-width="1.4" stroke-linejoin="round"/>`;
  const body=cs.map((c,i)=>{const px=ox+(c.x-c.y)*A,py=oy+(c.x+c.y)*S/2-c.z*S;
    const top=[[px,py-S/2],[px+A,py],[px,py+S/2],[px-A,py]],lf=[[px-A,py],[px,py+S/2],[px,py+S*1.5],[px-A,py+S]],rt=[[px,py+S/2],[px+A,py],[px+A,py+S],[px,py+S*1.5]];
    return `<g class="cube" data-z="${c.z}" data-i="${i}" data-cx="${px}" data-cy="${py}">${poly(lf,col[1])}${poly(rt,col[2])}${poly(top,col[0])}</g>`}).join('');
  return `<svg class="iso" id="${id}" viewBox="0 0 ${w} ${ht}" width="${Math.min(w,320)}" role="img" aria-label="쌓기나무">${body}<g class="ov"></g></svg>`;
}
const total=h=>h.flat().reduce((a,b)=>a+b,0);
const hidden=h=>{const cs=cubesOf(h);return cs.length-cs.filter(c=>{/* 위·왼앞·오른앞 중 하나라도 보이면 보이는 것 */
  const H=(x,y)=>(h[y]&&h[y][x])||0;return c.z===H(c.x,c.y)-1||H(c.x+1,c.y)<=c.z||H(c.x,c.y+1)<=c.z}).length};
const GAP=26;
function explode(svg,on){const Hm=Math.max(...[...svg.querySelectorAll('.cube')].map(g=>+g.dataset.z));
  svg.querySelectorAll('.cube').forEach(g=>{g.style.transform=on?`translateY(${-g.dataset.z*GAP}px)`:''});
  svg.querySelector('.ov').innerHTML='';}
function badges(svg,cb){const gs=[...svg.querySelectorAll('.cube')].sort((a,b)=>a.dataset.z-b.dataset.z);const ov=svg.querySelector('.ov');ov.innerHTML='';
  gs.forEach((g,i)=>K.later(()=>{const t=g.style.transform?(-g.dataset.z*GAP):0;ov.insertAdjacentHTML('beforeend',`<g class="badge"><circle cx="${g.dataset.cx}" cy="${+g.dataset.cy+t}" r="10"/><text x="${g.dataset.cx}" y="${+g.dataset.cy+t+4.5}" text-anchor="middle">${i+1}</text></g>`);K.sfx.count()},i*380));
  K.later(()=>cb&&cb(),gs.length*380+200)}
function layerCounts(h){const Hm=Math.max(...h.flat());return Array.from({length:Hm},(_,z)=>h.flat().filter(n=>n>z).length)}

function count(p,G){
  const n=total(p.h),hid=hidden(p.h);
  G.html(`<div class="qline"><span class="tag q">문제</span>쌓기나무는 모두 몇 개일까요?</div>
   <div style="text-align:center">${isoSVG(p.h,'iso',{color:p.color||0})}</div><div class="counts" id="lc" style="justify-content:center;gap:14px"></div>
   <div class="slot-row">모두 <div class="slot sm" data-drop="ans">?</div>개</div>`);
  G.numbers(1,Math.max(10,n+2));
  const svg=K.$('#iso');
  const layers=()=>{explode(svg,true);const lc=layerCounts(p.h);K.$('#lc').innerHTML=lc.map((c,z)=>`<span class="pop" style="animation-delay:${z*.2}s">${z+1}층 ${c}개</span>`).join('');
    return lc};
  const hint=h=>{
    if(h===1){if(hid){svg.classList.add('xray');G.say(`보이지 않는 곳에도 <b>숨어 있는</b> 쌓기나무가 있어! 위에 있는 나무는 아래에서 받쳐 줘야 하거든. 투명하게 해 봤어.`)}
      else G.say('한 층씩 나눠서 세면 쉬워! 💡를 한 번 더 눌러 봐.')}
    else if(h===2){svg.classList.remove('xray');const lc=layers();G.say(`층별로 띄워 봤어! ${lc.map((c,z)=>`${z+1}층 ${c}개`).join(', ')}. 모두 더하면?`)}
    else{layers();badges(svg,()=>G.say(`하나씩 세니까 모두 ${n}개!`))}};
  G.setActs(hint);
  G.drop((pl,d,t)=>{if(pl.kind!=='stk'||d!=='ans')return;
    if(pl.v===n){t.innerHTML='';t.appendChild(K.stuck(pl.html));t.classList.add('ok');K.sfx.drop();layers();G.success(hid?`맞아! 숨어 있던 ${hid}개까지 모두 ${n}개!`:`맞아! 모두 ${n}개!`)}
    else G.wrong(t,hint,pl.v===n-hid&&hid?'보이는 것만 세었구나! 아래에 숨어 있는 나무도 있어.':null)});
  if(p.guided)G.guide([
    {say:'쌓기나무를 셀 때는 <b>한 층씩</b> 나눠서 세면 쉬워. 띄워 볼게!',wait:next=>{K.later(()=>{layers();next()},600)}},
    {say:()=>`${layerCounts(p.h).map((c,z)=>`${z+1}층에 ${c}개`).join(', ')}! 하나씩 세어 보자.`,wait:next=>badges(svg,next)},
    {say:'모두 몇 개인지 숫자를 넣어 봐!',act:()=>{explode(svg,false)}}]);
  else G.say(p.say||(hid?'잘 봐! 보이지 않는 곳에 숨은 쌓기나무도 있을 수 있어.':'쌓기나무를 세어 봐! 층별로 세면 쉬워.'));
}
/* 두 모양 중 더 많은 쪽 */
function more(p,G){
  const na=total(p.a),nb=total(p.b),ans=na>nb?'A':'B';
  G.html(`<div class="qline"><span class="tag q">문제</span>쌓기나무를 더 많이 쓴 쪽에 ⭐를 붙여요</div>
   <div class="twin"><div data-drop="A" id="ta"><span class="nm">가</span>${isoSVG(p.a,'isoA',{color:1})}<div class="counts" id="ca" style="justify-content:center"></div></div>
   <div data-drop="B" id="tb"><span class="nm">나</span>${isoSVG(p.b,'isoB',{color:2})}<div class="counts" id="cb" style="justify-content:center"></div></div></div>`);
  G.stickers([{v:'star',html:'<span class="em">⭐</span>',label:'더 많아요'}]);
  const hint=h=>{
    if(h===1){K.$('#isoA').classList.add('xray');K.$('#isoB').classList.add('xray');G.say('숨어 있는 나무도 있는지 투명하게 봐!')}
    else if(h===2){['A','B'].forEach(s=>{const svg=K.$('#iso'+s);svg.classList.remove('xray');explode(svg,true);K.$('#c'+s.toLowerCase()).innerHTML=layerCounts(s==='A'?p.a:p.b).map((c,z)=>`<span>${z+1}층 ${c}</span>`).join(' · ')});G.say('층별로 나눠서 세어 봐!')}
    else{badges(K.$('#isoA'),()=>badges(K.$('#isoB'),()=>G.say(`가는 ${na}개, 나는 ${nb}개!`)))}};
  G.setActs(hint);
  G.drop((pl,d,t)=>{if(pl.kind!=='stk'||(d!=='A'&&d!=='B'))return;
    if(d===ans){t.appendChild(K.stuck(pl.html));K.sfx.drop();K.$('#ca').textContent=na+'개';K.$('#cb').textContent=nb+'개';G.success(`맞아! 가는 ${na}개, 나는 ${nb}개. ${ans==='A'?'가':'나'}가 더 많아!`)}
    else G.wrong(t,hint)});
  G.say('두 모양 중 쌓기나무를 더 많이 쓴 건 어느 쪽일까? 눈으로 보기에 커 보여도 세어 봐야 알아!');
}
K.area('think',{id:'blocks',name:'쌓기나무',desc:'숨은 나무까지 세어요',emoji:'🧱',color:'#FFF1B8',
  hello:'쌓기나무 탑이야! 몇 개로 만들었을까?',types:{count,more},
  tip:{t:'층별로 나눠 세기',b:`<p>쌓기나무에서 아이들이 가장 많이 틀리는 이유는 <b>보이는 것만 세기</b> 때문이에요. 위에 있는 나무는 아래에서 받쳐 줘야 한다는 걸 알려 주세요.</p>
<div class="say-line">이 나무는 공중에 떠 있을 수 있을까? 밑에 뭐가 있어야 할까?</div>
<div class="say-line">1층부터 세어 볼까? 1층은 몇 개, 2층은 몇 개?</div>
<p>집에 블록이 있다면 그림과 똑같이 쌓아 보게 하는 게 제일 좋아요. 게임에서는 힌트를 누르면 투명하게 보이고, 층별로 띄워서 보여 줘요.</p>`},
  levels:[
   {id:'l1',name:'보이는 대로 세기',desc:'층별로 세어요',emoji:'🧱',probs:[
     {type:'count',h:[[1,1,1]],guided:true,color:0},{type:'count',h:[[2,1],[1,0]],color:1},{type:'count',h:[[1,2,1]],color:2},{type:'count',h:[[3,2,1]],color:0}]},
   {id:'l2',name:'숨은 나무 찾기',desc:'안 보이는 나무도 있어요',emoji:'🔍',probs:[
     {type:'count',h:[[2,2],[1,1]],color:1},{type:'count',h:[[2,1],[2,1]],color:2},{type:'count',h:[[3,1],[1,1]],color:0},{type:'count',h:[[2,2],[2,1]],color:1}]},
   {id:'l3',name:'어느 쪽이 많을까',desc:'두 모양을 비교해요',emoji:'⚖️',probs:[
     {type:'more',a:[[2,1],[1,0]],b:[[1,1,1,1]]},{type:'more',a:[[3,1,1]],b:[[2,2],[1,1]]},{type:'more',a:[[1,1],[1,1]],b:[[3,1]]}]}
  ]});
})();
