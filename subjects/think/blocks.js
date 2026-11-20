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
   <div class="slot-row">모두 <div class="slot sm" id="ans">?</div>개</div>`);
  G.slot(K.$('#ans'),'a');G.numbers(1,Math.max(10,n+2));
  const svg=K.$('#iso');
  G.answer({hints:[
     ()=>{svg.classList.add('xray');G.say('위에 있는 나무는 아래에서 받쳐 줘야 해! 투명하게 보면 <b>숨어 있는</b> 나무가 있는지 알 수 있어.')},
     ()=>{svg.classList.remove('xray');explode(svg,true);G.say('층별로 띄워 봤어! 1층부터 한 층씩 세어서 더해 봐.')}],
    check:v=>{if(v.a.v===n){explode(svg,true);const lc=layerCounts(p.h);K.$('#lc').innerHTML=lc.map((c,z)=>`<span class="pop">${z+1}층 ${c}개</span>`).join('');
        return {ok:true,line:hid?`맞아! 숨어 있던 ${hid}개까지 모두 ${n}개!`:`맞아! 모두 ${n}개!`}}
      return {ok:false,note:v.a.v+'개',mark:K.$('#ans'),why:hid&&v.a.v===n-hid?'보이는 것만 세었구나! 아래에 숨어 있는 나무도 있어.':''}}});
  if(p.guided)G.guide([
    {say:'쌓기나무를 셀 때는 <b>한 층씩</b> 나눠서 세면 쉬워. 띄워 볼게!',wait:next=>K.later(()=>{explode(svg,true);next()},600)},
    {say:'1층부터 하나씩 세어 보자.',wait:next=>badges(svg,next)},
    {say:'모두 몇 개인지 숫자를 칸에 놓고 <b>다 했어요</b>!',act:()=>explode(svg,false)}]);
  else G.say(p.say||(hid?'잘 봐! 보이지 않는 곳에 숨은 쌓기나무도 있을 수 있어.':'쌓기나무를 세어 봐! 층별로 세면 쉬워.'));
}
/* 두 모양 중 더 많은 쪽 */
function more(p,G){
  const na=total(p.a),nb=total(p.b),ans=na>nb?'A':'B';
  G.html(`<div class="qline"><span class="tag q">문제</span>쌓기나무를 더 많이 쓴 쪽에 ⭐를 붙여요</div>
   <div class="twin"><div data-drop="A" id="ta"><span class="nm">가</span>${isoSVG(p.a,'isoA',{color:1})}<div class="counts" id="ca" style="justify-content:center"></div></div>
   <div data-drop="B" id="tb"><span class="nm">나</span>${isoSVG(p.b,'isoB',{color:2})}<div class="counts" id="cb" style="justify-content:center"></div></div></div>`);
  G.stickers([{v:'star',html:'<span class="em">⭐</span>',label:'더 많아요'}],'⭐를 끌어다 붙여요. 다른 쪽에 다시 붙이면 옮겨져요');
  let cur=null;const render=()=>{G.board.querySelectorAll('.mark').forEach(m=>m.remove());if(cur){const m=K.stuck('<span class="em">⭐</span>');m.classList.add('mark');K.$(cur==='A'?'#ta':'#tb').appendChild(m)}};
  G.drop((pl,d)=>{if(pl.kind!=='stk'||(d!=='A'&&d!=='B'))return;cur=d;K.sfx.drop();render();G.edit()});
  G.answer({ready:()=>!!cur,hints:[
     ()=>{K.$('#isoA').classList.add('xray');K.$('#isoB').classList.add('xray');G.say('숨어 있는 나무도 있는지 투명하게 봐!')},
     ()=>{['A','B'].forEach(s=>{const svg=K.$('#iso'+s);svg.classList.remove('xray');explode(svg,true)});G.say('층별로 띄웠어! 양쪽을 각각 세어서 비교해 봐.')}],
    check:()=>cur===ans?(K.$('#ca').textContent=na+'개',K.$('#cb').textContent=nb+'개',{ok:true,line:`맞아! 가는 ${na}개, 나는 ${nb}개. ${ans==='A'?'가':'나'}가 더 많아!`})
      :{ok:false,note:(cur==='A'?'가':'나')+' 선택'}});
  G.say('두 모양 중 쌓기나무를 더 많이 쓴 건 어느 쪽일까? 눈으로 보기에 커 보여도 세어 봐야 알아!');
}
/* 높이 지도 만들기: 위에 있는 나무는 항상 아래가 받쳐요 */
function mkH(w,d,maxH,fill){return Array.from({length:d},()=>Array.from({length:w},()=>Math.random()<fill?K.ri(1,maxH):0)).map((row,y,a)=>row)}
function mkCount(i,hard){let h;for(let t=0;t<40;t++){h=hard?mkH(K.ri(2,3),2,3,.85):mkH(K.ri(2,4),1,i<2?2:3,.95);const n=total(h);
  if(n>=3&&n<=(hard?12:9)&&(!hard||hidden(h)>0)&&h.flat().some(x=>x>0))break}
  return {type:'count',h,color:i%3,skill:hard?'hidden':'count'}}
function mkMore(){let a,b;for(let t=0;t<40;t++){a=mkH(K.ri(2,3),K.ri(1,2),3,.8);b=mkH(K.ri(2,4),K.ri(1,2),2,.8);if(total(a)!==total(b)&&total(a)>=3&&total(b)>=3&&total(a)<=10&&total(b)<=10)break}
  return {type:'more',a,b,skill:'more'}}
K.area('think',{id:'blocks',name:'쌓기나무',desc:'숨은 나무까지 세어요',emoji:'🧱',color:'#FFF1B8',
  hello:'쌓기나무 탑이야! 몇 개로 만들었을까?',types:{count,more},
  tip:{t:'층별로 나눠 세기',b:`<p>쌓기나무에서 아이들이 가장 많이 틀리는 이유는 <b>보이는 것만 세기</b> 때문이에요. 위에 있는 나무는 아래에서 받쳐 줘야 한다는 걸 알려 주세요.</p>
<div class="say-line">이 나무는 공중에 떠 있을 수 있을까? 밑에 뭐가 있어야 할까?</div>
<div class="say-line">1층부터 세어 볼까? 1층은 몇 개, 2층은 몇 개?</div>
<p>집에 블록이 있다면 그림과 똑같이 쌓아 보게 하는 게 제일 좋아요. 게임에서는 힌트를 누르면 투명하게 보이고, 층별로 띄워서 보여 줘요.</p>`},
  skills:{count:'층별로 세기',hidden:'숨은 나무 찾기',more:'개수 비교'},
  levels:[
   {id:'l1',name:'보이는 대로 세기',desc:'층별로 세어요',emoji:'🧱',gen:()=>K.makeSet(5,i=>mkCount(i,false),true)},
   {id:'l2',name:'숨은 나무 찾기',desc:'안 보이는 나무도 있어요',emoji:'🔍',gen:()=>K.makeSet(5,i=>mkCount(i,true))},
   {id:'l3',name:'어느 쪽이 많을까',desc:'두 모양을 비교해요',emoji:'⚖️',gen:()=>K.makeSet(4,mkMore)}
  ]});
})();
