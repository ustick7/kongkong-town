/* 생각콩 · 거울 대칭 (접었다 펴기) */
(()=>{
K.css(`
.mwrap{display:flex;justify-content:center;padding:4px 0}
.mgrid{position:relative;display:grid;gap:3px;background:var(--line);padding:3px;border-radius:12px;perspective:900px}
.mc{width:var(--cs);height:var(--cs);background:var(--paper);border-radius:5px;position:relative;transition:background .2s}
.mc.on{background:var(--col)}
.mc.tap{cursor:pointer;background:#F7FBFF}
.mc.tap.on{background:var(--col)}
.mc.bad{animation:shake .4s;box-shadow:inset 0 0 0 3px var(--red)}
.mc.ghostc{background-image:linear-gradient(var(--colg),var(--colg))}
.mline{position:absolute;background:var(--blue);border-radius:3px;z-index:3;box-shadow:0 0 0 2px #fff}
.mline.v{top:-8px;bottom:-8px;width:5px}
.mline.h{left:-8px;right:-8px;height:5px}
.fold{position:absolute;display:grid;gap:3px;z-index:4;transition:transform 1.2s cubic-bezier(.5,0,.3,1),opacity .5s;backface-visibility:visible}
.fold .mc{background:transparent}
.fold .mc.on{background:var(--col);opacity:.75}
.dist{position:absolute;font-size:14px;color:var(--blue-d);font-family:var(--f-disp);text-align:center;animation:pop .3s both}
`);
/* p.rows: 문자열 배열, '#' 칠한 칸. dir:'v'(왼쪽→오른쪽) 'h'(위→아래). 주어진 쪽만 칠해서 보여 줘요 */
function mirror(p,G){
  const R=p.rows.length,Cn=p.rows[0].length,dir=p.dir||'v';
  const half=dir==='v'?Cn/2:R/2;
  const given=(r,c)=>dir==='v'?c<half:r<half;
  const want=(r,c)=>{if(given(r,c))return p.rows[r][c]==='#';return dir==='v'?p.rows[r][Cn-1-c]==='#':p.rows[R-1-r][c]==='#'};
  const cs=Math.min(48,Math.floor((Math.min(window.innerWidth,760)-90)/Cn));
  G.html(`<div class="qline"><span class="tag q">문제</span>${dir==='v'?'파란 선이 거울이에요. 오른쪽':'파란 선이 거울이에요. 아래쪽'}을 칠해서 똑같은 모양을 완성해요</div>
   <div class="mwrap"><div class="mgrid" id="mg" style="--cs:${cs}px;--col:${p.color};--colg:${p.color}44;grid-template-columns:repeat(${Cn},var(--cs))"></div></div>`);
  G.hideTray();
  const mg=K.$('#mg');const cells=[];
  for(let r=0;r<R;r++)for(let c=0;c<Cn;c++){const d=document.createElement('div');d.className='mc';d.dataset.r=r;d.dataset.c=c;
    if(given(r,c)){if(p.rows[r][c]==='#')d.classList.add('on')}else d.classList.add('tap');mg.appendChild(d);cells.push(d)}
  const line=document.createElement('div');line.className='mline '+dir;
  if(dir==='v')line.style.left=`calc(3px + ${half}*(var(--cs) + 3px) - 4px)`;else line.style.top=`calc(3px + ${half}*(var(--cs) + 3px) - 4px)`;mg.appendChild(line);
  mg.addEventListener('click',e=>{const d=e.target.closest('.mc.tap');if(!d||G.P.done)return;d.classList.toggle('on');d.classList.remove('bad');K.sfx.tap(+d.dataset.c+ +d.dataset.r);G.edit()});
  const at=(r,c)=>cells[r*Cn+c];
  /* 접기 애니메이션: 주어진 쪽을 복사해서 거울선 기준으로 뒤집어요 */
  const fold=(cb,keep)=>{const f=document.createElement('div');f.className='fold';const gw=dir==='v'?half:Cn,gh=dir==='v'?R:half;
    f.style.gridTemplateColumns=`repeat(${gw},var(--cs))`;f.style.left='3px';f.style.top='3px';
    for(let r=0;r<gh;r++)for(let c=0;c<gw;c++){const d=document.createElement('div');d.className='mc'+(p.rows[r][c]==='#'?' on':'');f.appendChild(d)}
    f.style.transformOrigin=dir==='v'?`calc(${half}*(var(--cs) + 3px) - 1.5px) 50%`:`50% calc(${half}*(var(--cs) + 3px) - 1.5px)`;
    mg.appendChild(f);K.sfx.poof();requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=dir==='v'?'rotateY(-180deg)':'rotateX(180deg)'}));
    K.later(()=>{if(keep)cells.forEach(d=>{const r=+d.dataset.r,c=+d.dataset.c;if(!given(r,c)&&want(r,c))d.classList.add('ghostc')});K.later(()=>{f.style.opacity='0';K.later(()=>{f.remove();cb&&cb()},500)},keep?0:1600)},1400)};
  const distances=()=>{mg.querySelectorAll('.dist').forEach(x=>x.remove());
    for(let i=0;i<half;i++){const n=half-i;[i,(dir==='v'?Cn:R)-1-i].forEach(k=>{const s=document.createElement('div');s.className='dist';s.textContent=n;
      if(dir==='v'){s.style.left=`calc(3px + ${k}*(var(--cs) + 3px))`;s.style.width='var(--cs)';s.style.top='-22px'}else{s.style.top=`calc(3px + ${k}*(var(--cs) + 3px) + var(--cs)/2 - 9px)`;s.style.left='-20px'}
      mg.appendChild(s)})}};
  G.answer({label:'✔ 다 칠했어요',ready:()=>true,hints:[
     ()=>{distances();G.say('선에서 <b>몇 칸 떨어져 있는지</b> 세어 봐! 거울 속에서도 똑같이 떨어져 있어.')},
     ()=>{G.say('종이를 반으로 <b>접어 볼게!</b> 접힌 모양을 잘 기억해 봐!');fold(()=>G.say('어디에 겹쳤는지 기억나? 그 자리를 칠해 봐!'))}],
    check:()=>{const bad=cells.filter(d=>{const r=+d.dataset.r,c=+d.dataset.c;return !given(r,c)&&d.classList.contains('on')!==want(r,c)});
      if(!bad.length){cells.forEach(d=>d.classList.remove('ghostc'));K.$('.mline').style.opacity='.25';return {ok:true,line:p.done||'완성! 거울에 비친 것처럼 똑같아!'}}
      if(G.P.wrong>=1)bad.forEach(d=>d.classList.add('bad'));
      return {ok:false,note:`${bad.length}칸 틀림`,why:G.P.wrong>=1?`빨간 테두리 칸 ${bad.length}개를 다시 봐.`:`${bad.length}칸이 거울 모양과 달라.`}}});
  if(p.guided)G.guide([
    {say:'거울 놀이야! 파란 선이 <b>거울</b>이야. 거울에 비치면 반대쪽에 똑같은 모양이 생겨.',act:()=>G.hl('.mline')},
    {say:'종이를 파란 선에서 <b>반으로 접는다</b>고 생각해 봐. 접어 볼게!',act:()=>G.hl(null),wait:next=>fold(next,true)},
    {say:'흐릿한 자국이 생겼지? 그 칸들을 톡톡 눌러서 칠하고 <b>다 칠했어요</b>를 눌러 봐!'}]);
  else G.say(p.say||'거울 선을 기준으로 반대쪽을 똑같이 칠해 봐! 선에서 몇 칸 떨어졌는지 세면 쉬워.');
}
const COLS=['#FF8A3D','#4CB963','#9B7BE0','#F2665E','#4A9FE8','#E8A200'];
const PICS=[{color:'#F2665E',rows:['.##.##','######','######','.####.','..##..','......'],done:'하트 완성! 반으로 접으면 꼭 맞아!'},
  {color:'#E8A200',rows:['..##..','.####.','######','.#..#.','.#..#.','.####.'],done:'집 완성! 왼쪽과 오른쪽이 똑같지?'},
  {color:'#4A9FE8',rows:['#....#','##..##','######','.####.','##..##','#....#'],done:'나비 완성! 나비 날개는 진짜로 대칭이야!'}];
/* 반쪽을 무작위로 칠한 뒤 거울로 비춰 완성 그림을 만들어요 */
function mkMirror(R,C,dir,cnt){const H=dir==='v'?C/2:R/2;const cells=[];for(let r=0;r<(dir==='v'?R:H);r++)for(let c=0;c<(dir==='v'?H:C);c++)cells.push([r,c]);
  const on=new Set(K.pickN(cells,Math.min(cnt,cells.length)).map(x=>x.join(',')));
  const rows=Array.from({length:R},(_,r)=>Array.from({length:C},(_,c)=>{let rr=r,cc=c;if(dir==='v'&&c>=H)cc=C-1-c;if(dir==='h'&&r>=H)rr=R-1-r;return on.has(rr+','+cc)?'#':'.'}).join(''));
  return {type:'mirror',dir,rows,color:K.pick(COLS),skill:dir==='v'?'mv':'mh'}}
K.area('think',{id:'mirror',name:'거울 대칭',desc:'접었다 펴면 똑같은 모양',emoji:'🦋',color:'#D6ECFF',
  hello:'거울 놀이야! 종이를 반으로 접는다고 생각해 봐.',types:{mirror},
  tip:{t:'진짜로 접어 보기',b:`<p>대칭은 머리로 뒤집기가 어려워요. 종이에 반쪽 그림을 그리고 <b>물감 데칼코마니</b>나 <b>접어서 비춰 보기</b>를 먼저 해 보세요.</p>
<div class="say-line">선에서 몇 칸 떨어져 있어? 반대쪽에서도 똑같이 몇 칸 떨어진 곳에 칠해 봐.</div>
<p>틀린 칸이 있으면 게임이 빨간 테두리로 그 칸만 알려 줘요. 힌트를 누르면 실제로 반을 접는 모습이 나오고, 접힌 자국이 흐릿하게 남아요.</p>`},
  skills:{mv:'좌우 대칭',mh:'위아래 대칭'},
  levels:[
   {id:'l1',name:'작은 거울',desc:'4칸 그림을 완성해요',emoji:'🪞',gen:()=>K.makeSet(5,i=>mkMirror(4,4,'v',i<2?3:4),true)},
   {id:'l2',name:'큰 거울 그림',desc:'6칸 그림을 완성해요',emoji:'❤️',gen:()=>[PICS[0],PICS[1],PICS[2]].map(x=>Object.assign({type:'mirror',skill:'mv'},x)).concat(K.makeSet(3,()=>mkMirror(6,6,'v',K.ri(6,9))))},
   {id:'l3',name:'위아래 거울',desc:'물에 비친 모양',emoji:'🌊',gen:()=>K.makeSet(5,i=>Object.assign(mkMirror(6,6,'h',K.ri(5,8)),i===0?{say:'이번엔 거울이 가로로 누워 있어! 호수에 비친 것처럼 아래쪽을 칠해 봐.'}:{}))}
  ]});
})();
