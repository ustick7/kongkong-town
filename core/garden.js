/* 콩이 정원: 화분 키우기 → 수확 → 콩 도감, 콩이 꾸미기 가게, 오늘의 공부 목표
   콩알은 확인된 공부(맞힌 문제)로만 들어와요. 여기서는 쓰기만 해요. */
'use strict';
(()=>{
const S=K.S,$=K.$;
S.plant=Object.assign({water:0},S.plant||{});
const G0={kind:0,done:[],own:[],acc:'',pot:'',deco:[],goal:{day:'',got:false},pets:0};
S.garden=Object.assign({},G0,S.garden||{});
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

K.css(`
.gdot{position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:50%;background:var(--red);box-shadow:0 0 0 2px var(--paper);animation:gpulse 1.2s infinite}@keyframes gpulse{50%{transform:scale(1.3)}}
.gtabs{display:flex;gap:6px;justify-content:center}
.gtabs button{appearance:none;border:0;font-family:var(--f-disp);font-size:17px;padding:8px 14px;border-radius:999px;background:var(--s-white);color:var(--ink);box-shadow:inset 0 0 0 2px var(--line);cursor:pointer}
.gtabs button.on{background:var(--green);color:#fff;box-shadow:none}
.goal{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border-radius:18px;background:var(--s-yellow);font-size:15px}
.goal .bar{height:14px;border-radius:999px;background:var(--s-track);overflow:hidden}.goal .bar i{display:block;height:100%;background:linear-gradient(90deg,#FFC845,#FF8A3D);border-radius:999px;transition:width .6s}
.shop{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.item{appearance:none;border:0;cursor:pointer;border-radius:18px;padding:8px 6px;background:var(--s-white);box-shadow:inset 0 0 0 2px var(--line);font-family:inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:2px}
.item svg{width:72px;height:72px}.item b{font-family:var(--f-disp);font-weight:400;font-size:16px}.item small{font-size:13px;color:var(--muted)}
.item.on{box-shadow:inset 0 0 0 3px var(--green)}.item.lock{opacity:.55}
.dex{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.dex .card{border-radius:16px;padding:4px;background:var(--s-white);box-shadow:inset 0 0 0 2px var(--line);text-align:center;font-size:13px}
.dex .card svg{width:100%;height:auto}.dex .card.lock svg{filter:brightness(0);opacity:.18}.dex .card.cur{box-shadow:inset 0 0 0 3px var(--orange)}
.pot-wrap{position:relative}.pot-wrap .bfly{position:absolute;font-size:26px;animation:bfly 6s ease-in-out infinite}
@keyframes bfly{0%{transform:translate(0,0)}25%{transform:translate(40px,-30px) rotate(10deg)}50%{transform:translate(90px,10px)}75%{transform:translate(30px,40px) rotate(-10deg)}100%{transform:translate(0,0)}}
.pot .kong{cursor:pointer}.pot .kong.hop{animation:hop .6s}
@keyframes hop{30%{transform:translateY(-22px)}60%{transform:translateY(0)}80%{transform:translateY(-6px)}}
.heart-pop{position:absolute;font-size:28px;animation:hp 1s ease-out forwards;pointer-events:none}
@keyframes hp{from{transform:translateY(0) scale(.6);opacity:1}to{transform:translateY(-70px) scale(1.3);opacity:0}}
.gscene{position:relative;border-radius:22px;overflow:hidden;min-height:300px;padding-top:6px}
.gscene .pot-wrap{position:relative;z-index:1}.gscene .pot{width:min(240px,70%)}
.gdec{position:absolute;font-size:22px;opacity:.9;pointer-events:none}.gdec.tw{animation:tw 2s ease-in-out infinite}@keyframes tw{50%{opacity:.2}}
.fr{position:absolute;font-size:34px;cursor:pointer;z-index:2;user-select:none;-webkit-user-select:none;line-height:1}
.fr.fly{font-size:28px;animation:bfly 7s ease-in-out infinite}.fr.walk{animation:frbob 2.6s ease-in-out infinite}
@keyframes frbob{50%{transform:translateY(-5px) rotate(-4deg)}}
.fr.boing{animation:boing .5s}@keyframes boing{40%{transform:translateY(-18px) scale(1.2)}}
.dressup{display:flex;flex-direction:column;gap:10px}
.mirror{border-radius:24px;padding:10px;background:linear-gradient(160deg,#FFE9F2,#E8F3FF);box-shadow:inset 0 0 0 3px #fff,0 4px 0 var(--line)}
:root[data-theme="dark"] .mirror{background:linear-gradient(160deg,#3A2E4A,#25304A)}
.big-kong{width:min(190px,55%);margin:0 auto}.big-kong svg{width:100%;height:auto;display:block}.big-kong.mini-scene{width:100%}.mini-scene .gscene{min-height:220px}
.trybar{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;font-size:15px;margin-top:6px}.trybar .btn{padding:6px 16px;font-size:16px;min-height:0}
.slots{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:none}.slots::-webkit-scrollbar{display:none}
.slots button{flex:0 0 auto;appearance:none;border:0;font-family:var(--f-disp);font-size:15px;padding:7px 12px;border-radius:999px;background:var(--s-white);color:var(--ink);box-shadow:inset 0 0 0 2px var(--line);cursor:pointer}
.slots button.on{background:linear-gradient(135deg,#FF8FB8,#B48CF0);color:#fff;box-shadow:none}
.item .fe{font-size:46px;line-height:72px}.item .bgsw{display:grid;place-items:center;width:72px;height:72px;border-radius:14px;font-size:28px}
.item.try{box-shadow:inset 0 0 0 3px #B48CF0;background:linear-gradient(160deg,#F6EEFF,#FFF);}
:root[data-theme="dark"] .item.try{background:#3A2E4A}
.item:not(.lock):active{transform:scale(.96)}
.fire{animation:tw .3s infinite}
.harvest{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.harvest svg{width:180px;height:auto}
`);

/* 콩 종류 (수확하면 다음 씨앗이 열려요) */
const KINDS=[
 {n:'분홍꽃콩',p:['#FF9DB5'],c:'#FFC845',pod:'#7CC95E',sh:'oval',t:'처음 키운 콩! 분홍 꽃이 피어요.'},
 {n:'해님콩',p:['#FFD23F'],c:'#8B5A2B',pod:'#9BCB3C',sh:'long',t:'해를 닮아 노랗게 빛나요.'},
 {n:'하늘콩',p:['#7EC8F5'],c:'#FFF4B0',pod:'#5DB7A0',sh:'round',t:'맑은 하늘색 꽃잎이 동글동글.'},
 {n:'보라콩',p:['#B48CF0'],c:'#FFE27A',pod:'#8E6CC9',sh:'oval',t:'보라색 꼬투리가 열리는 신기한 콩.'},
 {n:'하트콩',p:['#FF6F91'],c:'#FFD6E0',pod:'#7CC95E',sh:'heart',t:'꽃잎이 모두 하트 모양이에요.'},
 {n:'별빛콩',p:['#FFE066'],c:'#FFF8D6',pod:'#4F7CD8',sh:'star',t:'밤에도 반짝이는 별 꽃.'},
 {n:'무지개콩',p:['#FF6B6B','#FFB347','#FFE066','#6CD47A','#6AB7FF','#B48CF0'],c:'#fff',pod:'#7CC95E',sh:'oval',t:'꽃잎마다 색이 달라요!'},
 {n:'황금콩',p:['#F5C518'],c:'#FFF1A8',pod:'#E0A800',sh:'star',t:'전설의 황금 콩! 다 모은 친구만 볼 수 있어요.'},
];
const STAGES=[[0,'씨앗'],[1,'새싹'],[3,'떡잎'],[6,'줄기'],[10,'꽃봉오리'],[15,'꽃'],[21,'콩꼬투리']];
const stageOf=w=>STAGES.filter(s=>w>=s[0]).length-1;
const COST=3,GOAL=10,BONUS=5;

/* 콩이 꾸미기: 칸(머리·얼굴·목·손·등·몸 색)마다 하나씩 입어요. need: 수확 몇 번 해야 열리는지 */
const fl=(x,y,c,r=4)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<circle r="${r}" cx="${r*1.3*Math.sin(a*Math.PI/180)}" cy="${-r*1.3*Math.cos(a*Math.PI/180)}" fill="${c}"/>`).join('')}<circle r="${r*.8}" fill="#FFC845"/></g>`;
const star=(x,y,r,c)=>`<path transform="translate(${x} ${y}) scale(${r/10})" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.3 1.6 L6.2 9 L0 4.6 L-6.2 9 L-4.3 1.6 L-10 -3.1 L-2.9 -3.1Z" fill="${c}"/>`;
const heart=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C-8 0 -8 -7 -3 -8 C-1 -8.5 0 -7 0 -5.5 C0 -7 1 -8.5 3 -8 C8 -7 8 0 0 6Z" fill="${c}"/>`;
const SLOTS=[['head','🎩 머리'],['face','😎 얼굴'],['neck','🎀 목'],['hand','🎈 손'],['back','🦋 등'],['body','🎨 몸 색'],['friend','🐾 정원 친구'],['bg','🏞️ 정원 배경'],['pot','🪴 화분']];
const WEAR={
 head:[
  {id:'flower',n:'꽃 핀',c:8,f:fl(30,26,'#FF9DB5',5)},
  {id:'ribbon',n:'리본',c:10,f:`<g transform="translate(86 26) rotate(20)"><path d="M0 0 L-15 -10 Q-18 0 -15 10Z M0 0 L15 -10 Q18 0 15 10Z" fill="#FF6F91"/><circle r="4.5" fill="#E0507A"/></g>`},
  {id:'party',n:'고깔모자',c:12,f:`<path d="M44 22 L60 -12 L76 22Z" fill="#4A9FE8"/><path d="M48 14 L72 14 M52 5 L68 5 M56 -4 L64 -4" stroke="#FFC845" stroke-width="3"/><circle cx="60" cy="-12" r="5" fill="#FF6F91"/>`},
  {id:'catear',n:'고양이 귀',c:15,f:`<path d="M28 32 L32 4 L52 20Z M92 32 L88 4 L68 20Z" fill="#9AD27A"/><path d="M33 24 L35 10 L45 19Z M87 24 L85 10 L75 19Z" fill="#FF9DB5"/>`},
  {id:'bunny',n:'토끼 귀',c:15,f:`<ellipse cx="44" cy="2" rx="8" ry="22" fill="#fff" transform="rotate(-12 44 20)"/><ellipse cx="76" cy="2" rx="8" ry="22" fill="#fff" transform="rotate(12 76 20)"/><ellipse cx="44" cy="4" rx="4" ry="15" fill="#FFB8C9" transform="rotate(-12 44 20)"/><ellipse cx="76" cy="4" rx="4" ry="15" fill="#FFB8C9" transform="rotate(12 76 20)"/>`},
  {id:'wreath',n:'꽃 화관',c:20,f:`<path d="M30 30 Q60 6 90 30" stroke="#6DBB52" stroke-width="4" fill="none"/>${fl(32,28,'#FF9DB5',4)}${fl(46,19,'#FFE066',4)}${fl(60,16,'#B48CF0',4)}${fl(74,19,'#7EC8F5',4)}${fl(88,28,'#FF9DB5',4)}`},
  {id:'phones',n:'헤드폰',c:22,f:`<path d="M22 58 Q22 10 60 10 Q98 10 98 58" stroke="#3D3A50" stroke-width="5" fill="none"/><rect x="14" y="48" width="14" height="22" rx="7" fill="#FF6F91"/><rect x="92" y="48" width="14" height="22" rx="7" fill="#FF6F91"/>`},
  {id:'wizard',n:'마법사 모자',c:30,f:`<path d="M36 24 Q56 6 66 -14 Q72 6 86 24Z" fill="#6B4FB0"/><ellipse cx="61" cy="24" rx="32" ry="6" fill="#5A3F99"/>${star(58,4,5,'#FFE066')}${star(70,14,3.5,'#FFE066')}`},
  {id:'crown',n:'왕관',c:60,need:3,f:`<path d="M38 26 L40 2 L50 14 L60 -4 L70 14 L80 2 L82 26Z" fill="#FFC845" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="16" r="3.5" fill="#F2665E"/><circle cx="46" cy="20" r="2.5" fill="#4A9FE8"/><circle cx="74" cy="20" r="2.5" fill="#4CB963"/>`},
 ],
 face:[
  {id:'shades',n:'선글라스',c:12,f:`<path d="M34 52 h52" stroke="#222" stroke-width="2.5"/><rect x="33" y="45" width="23" height="14" rx="6" fill="#222"/><rect x="64" y="45" width="23" height="14" rx="6" fill="#222"/><path d="M37 48 h6 M68 48 h6" stroke="#fff" stroke-width="2" opacity=".7"/>`},
  {id:'heartg',n:'하트 안경',c:15,f:`<path d="M54 50 h12" stroke="#E0507A" stroke-width="2.5"/>${heart(46,52,1.6,'#FF6F91')}${heart(74,52,1.6,'#FF6F91')}${heart(46,52,1.1,'#FFC2D3')}${heart(74,52,1.1,'#FFC2D3')}`},
  {id:'round',n:'동그란 안경',c:10,f:`<circle cx="46" cy="52" r="10" fill="rgba(255,255,255,.2)" stroke="#8B5A2B" stroke-width="2.5"/><circle cx="74" cy="52" r="10" fill="rgba(255,255,255,.2)" stroke="#8B5A2B" stroke-width="2.5"/><path d="M56 52 h8" stroke="#8B5A2B" stroke-width="2.5"/>`},
  {id:'stache',n:'멋진 수염',c:10,f:`<path d="M60 61 C54 56 44 58 40 64 C46 62 52 64 60 63 C68 64 74 62 80 64 C76 58 66 56 60 61Z" fill="#5B3A29"/>`},
  {id:'stars',n:'반짝 볼',c:8,f:`${star(36,64,5,'#FFC845')}${star(84,64,5,'#FFC845')}`},
  {id:'mask',n:'영웅 가면',c:20,f:`<path d="M30 46 Q60 38 90 46 Q92 58 80 60 Q70 60 60 54 Q50 60 40 60 Q28 58 30 46Z" fill="#F2665E"/><circle cx="46" cy="52" r="6.5" fill="#3D2E28"/><circle cx="74" cy="52" r="6.5" fill="#3D2E28"/><circle cx="48.4" cy="49.6" r="2.2" fill="#fff"/><circle cx="76.4" cy="49.6" r="2.2" fill="#fff"/>`},
 ],
 neck:[
  {id:'bowtie',n:'나비넥타이',c:10,f:`<g transform="translate(60 96)"><path d="M0 0 L-13 -8 L-13 8Z M0 0 L13 -8 L13 8Z" fill="#4A9FE8"/><circle r="3.5" fill="#2F7AC4"/></g>`},
  {id:'scarf',n:'목도리',c:15,f:`<path d="M27 86 Q60 100 93 86 L95 95 Q60 110 25 95Z" fill="#F2665E"/><path d="M78 96 l6 18 l8 -3 l-5 -17Z" fill="#E0504A"/><path d="M30 90 Q60 103 90 90" stroke="#fff" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".7"/>`},
  {id:'pearl',n:'진주 목걸이',c:18,f:Array.from({length:11},(_,i)=>{const t=i/10;const x=32+56*t,y=88+10*Math.sin(Math.PI*t);return `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" stroke="#E6DCCF"/>`}).join('')},
  {id:'bell',n:'방울 목걸이',c:12,f:`<path d="M30 88 Q60 100 90 88" stroke="#F2665E" stroke-width="5" fill="none"/><circle cx="60" cy="98" r="6" fill="#FFC845" stroke="#E0A800" stroke-width="1.5"/><path d="M56 99 h8" stroke="#B07A00" stroke-width="1.5"/>`},
  {id:'bandana',n:'반다나',c:12,f:`<path d="M30 86 Q60 96 90 86 L60 108Z" fill="#4A9FE8"/><circle cx="52" cy="94" r="2" fill="#fff"/><circle cx="66" cy="96" r="2" fill="#fff"/><circle cx="60" cy="102" r="2" fill="#fff"/>`},
  {id:'medal',n:'금메달',c:35,need:1,f:`<path d="M50 80 L58 96 M70 80 L62 96" stroke="#4A9FE8" stroke-width="5"/><circle cx="60" cy="100" r="8" fill="#FFC845" stroke="#E0A800" stroke-width="2"/>${star(60,100,4.5,'#FFF1A8')}`},
 ],
 hand:[
  {id:'balloon',n:'풍선',c:10,f:`<path d="M102 86 Q110 60 108 34" stroke="#888" stroke-width="1.2" fill="none"/><ellipse cx="108" cy="22" rx="11" ry="13" fill="#FF6F91"/><ellipse cx="104" cy="17" rx="3" ry="4" fill="#fff" opacity=".6"/><path d="M106 35 l2 -2 l2 2Z" fill="#FF6F91"/>`},
  {id:'lolly',n:'막대사탕',c:10,f:`<path d="M103 88 V62" stroke="#fff" stroke-width="3"/><circle cx="103" cy="54" r="10" fill="#FFB8C9"/><path d="M103 54 m-6 0 a6 6 0 1 1 6 6 a4 4 0 1 1 -4 -4 a2 2 0 1 1 2 2" stroke="#FF6F91" stroke-width="2" fill="none"/>`},
  {id:'icecream',n:'아이스크림',c:12,f:`<path d="M96 70 L104 92 L112 70Z" fill="#E8B57A"/><circle cx="104" cy="66" r="8" fill="#FFB8C9"/><circle cx="104" cy="56" r="7" fill="#C9F0E0"/><circle cx="104" cy="49" r="3" fill="#F2665E"/>`},
  {id:'bouquet',n:'꽃다발',c:15,f:`<path d="M100 92 L104 74 L108 92Z" fill="#8FD873"/>${fl(98,70,'#FF9DB5',3.5)}${fl(110,68,'#FFE066',3.5)}${fl(104,60,'#B48CF0',3.5)}`},
  {id:'wand',n:'요술봉',c:25,f:`<path d="M102 90 L110 56" stroke="#B48CF0" stroke-width="3" stroke-linecap="round"/>${star(111,50,9,'#FFE066')}<circle cx="100" cy="44" r="1.5" fill="#FFE066"/><circle cx="118" cy="62" r="1.5" fill="#FFE066"/>`},
  {id:'pencilh',n:'큰 연필',c:15,f:`<g transform="translate(104 88) rotate(-20)"><rect x="-4" y="-36" width="8" height="32" fill="#FFC845"/><path d="M-4 -36 L0 -46 L4 -36Z" fill="#F6D3A8"/><path d="M-1.5 -42 L0 -46 L1.5 -42Z" fill="#3D2E28"/><rect x="-4" y="-6" width="8" height="6" fill="#FF9DB5"/></g>`},
 ],
 back:[
  {id:'cape',n:'망토',c:25,b:`<path d="M36 40 Q60 30 84 40 L104 112 Q60 122 16 112Z" fill="#E0504A"/>`,f:`<circle cx="60" cy="96" r="4" fill="#FFC845"/>`},
  {id:'angel',n:'천사 날개',c:30,b:`<path d="M28 62 Q0 40 2 70 Q6 86 26 82Z M92 62 Q120 40 118 70 Q114 86 94 82Z" fill="#fff" stroke="#E6E1F2" stroke-width="2"/><path d="M8 64 Q16 70 24 70 M8 74 Q16 78 24 78 M112 64 Q104 70 96 70 M112 74 Q104 78 96 78" stroke="#E6E1F2" stroke-width="2" fill="none"/>`},
  {id:'bflyw',n:'나비 날개',c:30,need:1,b:`<path d="M30 60 Q-2 30 4 64 Q8 78 30 74Z M30 76 Q4 84 10 100 Q20 104 32 86Z M90 60 Q122 30 116 64 Q112 78 90 74Z M90 76 Q116 84 110 100 Q100 104 88 86Z" fill="#B48CF0"/><circle cx="14" cy="60" r="4" fill="#FFE066"/><circle cx="106" cy="60" r="4" fill="#FFE066"/><circle cx="16" cy="92" r="3" fill="#7EC8F5"/><circle cx="104" cy="92" r="3" fill="#7EC8F5"/>`},
  {id:'dino',n:'공룡 가시',c:30,need:1,b:`<path d="M44 22 L50 6 L58 20 L66 4 L74 22 L86 10 L88 30 L100 24 L98 44Z" fill="#F2A33A"/>`},
  {id:'shell',n:'거북 등딱지',c:25,b:`<ellipse cx="60" cy="72" rx="46" ry="40" fill="#8B5A2B"/><path d="M60 40 L78 52 L72 74 L48 74 L42 52Z" fill="#A8703C" stroke="#6E4520" stroke-width="2"/>`},
  {id:'jet',n:'로켓 가방',c:45,need:2,b:`<rect x="8" y="50" width="16" height="36" rx="6" fill="#B9C2D0"/><rect x="96" y="50" width="16" height="36" rx="6" fill="#B9C2D0"/><path class="fire" d="M10 86 L16 104 L22 86Z M98 86 L104 104 L110 86Z" fill="#FF8A3D"/>`},
 ],
 body:[
  {id:'sky',n:'하늘색',c:15,pal:['#8CCBF2','#72B7E6','#D6EEFC','#5EA2D4']},
  {id:'pink',n:'분홍색',c:15,pal:['#F7A8C4','#EE8FB0','#FDDDE8','#D97A9C']},
  {id:'yellow',n:'노란색',c:15,pal:['#FFD95A','#F5C53B','#FFF2B8','#E0AD22']},
  {id:'purple',n:'보라색',c:20,pal:['#B99BEB','#A384DE','#E6DBFA','#8C6CC9']},
  {id:'mint',n:'민트색',c:20,pal:['#7EDCC6','#62CDB4','#CFF5EC','#4AB79E']},
  {id:'peach',n:'복숭아색',c:20,pal:['#FFB48A','#F79D6E','#FFE2CF','#E0855A']},
  {id:'gold',n:'황금색',c:60,need:3,pal:['#F5C518','#E0AE00','#FFF0A8','#C99A00']},
 ],
};
const ALLW=Object.entries(WEAR).flatMap(([k,a])=>a.map(x=>Object.assign({k},x)));
/* 정원 친구: fly는 하늘을 날고, 나머지는 땅에서 놀아요 */
const FRIENDS=[
 {id:'bfly',n:'나비',e:'🦋',c:15,fly:1,say:'팔랑팔랑~'},{id:'bee',n:'꿀벌',e:'🐝',c:15,fly:1,say:'윙윙! 꽃이 예쁘다!'},{id:'lady',n:'무당벌레',e:'🐞',c:12,fly:1,say:'점이 일곱 개야!'},{id:'bird',n:'파랑새',e:'🐦',c:20,fly:1,say:'짹짹! 노래 불러 줄게'},
 {id:'chick',n:'병아리',e:'🐥',c:15,say:'삐약삐약!'},{id:'snail',n:'달팽이',e:'🐌',c:12,say:'천천히… 가도… 괜찮아…'},{id:'frog',n:'개구리',e:'🐸',c:18,say:'개굴개굴! 점프!'},
 {id:'cat',n:'고양이',e:'🐱',c:25,say:'야옹~ 쓰다듬어 줘'},{id:'dog',n:'강아지',e:'🐶',c:25,say:'멍멍! 같이 놀자!'},{id:'bunny',n:'토끼',e:'🐰',c:25,say:'깡충깡충! 당근 있어?'},
 {id:'squirrel',n:'다람쥐',e:'🐿️',c:25,need:1,say:'도토리 숨겨 놨지롱!'},{id:'hedge',n:'고슴도치',e:'🦔',c:30,need:1,say:'가시는 있지만 착해!'},{id:'duck',n:'오리',e:'🦆',c:25,need:2,say:'꽥꽥! 물 주는 거 도와줄게'},
 {id:'turtle',n:'거북이',e:'🐢',c:30,need:2,say:'느려도 끝까지 가!'},{id:'panda',n:'판다',e:'🐼',c:50,need:3,say:'대나무 맛있다~'},{id:'unicorn',n:'유니콘',e:'🦄',c:80,need:5,say:'반짝반짝! 꿈을 이뤄 줄게!'},
];
/* 정원 배경 */
const BGS=[
 {id:'',n:'꽃밭',c:0,css:'linear-gradient(#CFEBFF,#EAF6FF 58%,#B7E08F 58%,#9FD479)',dec:['🌼','🌷','🌱']},
 {id:'beach',n:'바닷가',c:20,css:'linear-gradient(#9FDCFF,#D9F3FF 48%,#5BC0EB 48%,#7FD1F0 62%,#F7E3B0 62%,#EBCF8F)',dec:['🐚','⭐','🦀']},
 {id:'snow',n:'눈 마을',c:20,css:'linear-gradient(#C9D8F0,#EEF3FB 58%,#FFFFFF 58%,#E3ECF7)',dec:['⛄','❄️','🌲']},
 {id:'candy',n:'사탕 나라',c:30,css:'linear-gradient(#FFD6E8,#FFF0F6 58%,#FFB8D2 58%,#FF9CC2)',dec:['🍭','🍬','🧁']},
 {id:'night',n:'별밤',c:30,need:1,css:'linear-gradient(#1F2A5C,#3B4A8C 58%,#2E5A3A 58%,#23452C)',dec:['✨','🌙','🍄']},
 {id:'space',n:'우주',c:50,need:3,css:'radial-gradient(circle at 80% 20%,#6B4FB0 0 8%,transparent 9%),linear-gradient(#0E1030,#2B1F5C 70%,#4A3A8C)',dec:['🪐','🚀','⭐']},
];
const POTLIST=[{id:'',n:'기본 화분',c:0},{id:'sky',n:'하늘 화분',c:12},{id:'sun',n:'노랑 화분',c:12},{id:'dot',n:'물방울 화분',c:20,need:1},{id:'rainbow',n:'무지개 화분',c:40,need:2}];
const CAT=k=>k==='friend'?FRIENDS:k==='bg'?BGS:k==='pot'?POTLIST:WEAR[k];
/* 예전 저장(acc 하나, deco) 옮기기 */
(g=>{g.wear=Object.assign({head:'',face:'',neck:'',hand:'',back:'',body:''},g.wear||{});g.friends=g.friends||[];g.bg=g.bg||'';
  const mp={flower:['head','flower'],ribbon:['head','ribbon'],crown:['head','crown'],glasses:['face','shades'],scarf:['neck','scarf'],bowtie:['neck','bowtie'],cape:['back','cape']};
  if(g.acc&&mp[g.acc]){g.wear[mp[g.acc][0]]=mp[g.acc][1]}if(g.acc)g.acc='';
  g.own=g.own.map(x=>x==='glasses'?'shades':['bfly','bird','bee'].includes(x)?'f:'+x:x);if(g.deco&&g.deco.length){g.deco.forEach(d=>{if(!g.friends.includes(d))g.friends.push(d)});g.deco=[]}})(S.garden);
K.dress=w=>{const wr=w||((K.S.garden||{}).wear)||{};let b='',f='',pal=null;
  for(const k of ['back','neck','face','hand','head']){const it=wr[k]&&WEAR[k].find(x=>x.id===wr[k]);if(it){b+=it.b||'';f+=it.f||''}}
  const bd=wr.body&&WEAR.body.find(x=>x.id===wr.body);if(bd)pal=bd.pal;return {b,f,pal,head:!!wr.head}};
K.wearSvg=()=>'';
const modal=html=>{const m=document.createElement('div');m.className='modal-bg';m.innerHTML=`<div class="sheet" role="dialog">${html}</div>`;
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))m.remove()});document.body.appendChild(m);return m};
const POTS={'':['#E07A4F','#F08F62'],sky:['#5AA9E6','#7EC0F0'],sun:['#F2B53A','#FFD066'],dot:['#4FAE9B','#6CC7B4'],rainbow:['#B48CF0','#FF9DB5']};

function bloom(k,top,size=1){const kd=KINDS[k];const r=n=>kd.p[n%kd.p.length];const cy=top-10;let h='';
  for(let i=0;i<6;i++){const a=i*60;const col=r(i);
    if(kd.sh==='heart')h+=`<path transform="rotate(${a} 130 ${cy}) translate(130 ${cy-20}) scale(${.9*size})" d="M0 8 C-10 0 -10 -10 -4 -12 C-1 -13 0 -10 0 -8 C0 -10 1 -13 4 -12 C10 -10 10 0 0 8Z" fill="${col}"/>`;
    else if(kd.sh==='star')h+=`<path transform="rotate(${a} 130 ${cy})" d="M130 ${cy-4} L125 ${cy-16} L130 ${cy-30} L135 ${cy-16}Z" fill="${col}"/>`;
    else h+=`<ellipse cx="130" cy="${cy-(kd.sh==='round'?16:18)}" rx="${kd.sh==='round'?11:kd.sh==='long'?7:9}" ry="${kd.sh==='round'?11:kd.sh==='long'?19:16}" fill="${col}" transform="rotate(${a} 130 ${cy})"/>`}
  return h+`<circle cx="130" cy="${cy}" r="9" fill="${kd.c}"/>`}
function plantSvg(st,k){const kd=KINDS[k];const stem=[0,30,55,85,110,120,125][st];const top=230-stem;
  const leaf=(y,s,f)=>`<path d="M130 ${y} q${s*28} -18 ${s*44} 0 q${-s*16} 14 ${-s*44} 0Z" fill="${f||'#7CC95E'}"/>`;
  if(st===0)return `<ellipse cx="130" cy="222" rx="12" ry="9" fill="#C9A26B"/><path d="M124 220 q6 -6 12 0" stroke="#A47E4C" stroke-width="2" fill="none"/>`;
  let h=`<path d="M130 230 C128 ${230-stem/2} 134 ${top+20} 130 ${top}" stroke="#5AA845" stroke-width="7" fill="none" stroke-linecap="round"/>`+leaf(top+6,1)+leaf(top+6,-1,'#8FD873');
  if(st>=3)h+=leaf(top+40,1,'#6DBB52')+leaf(top+52,-1,'#7CC95E');if(st>=4)h+=leaf(top+75,1,'#8FD873');
  if(st===4)h+=`<ellipse cx="130" cy="${top-10}" rx="10" ry="14" fill="${kd.p[0]}"/><path d="M122 ${top-2} q8 6 16 0" stroke="#5AA845" stroke-width="4" fill="none"/>`;
  if(st>=5)h+=bloom(k,top);
  if(st>=6)h+=`<path d="M150 ${top+60} q24 6 30 34 q-20 -4 -30 -34Z" fill="${kd.pod}"/><circle cx="160" cy="${top+72}" r="4" fill="#fff" opacity=".6"/><circle cx="167" cy="${top+82}" r="4" fill="#fff" opacity=".6"/><circle cx="173" cy="${top+91}" r="3.5" fill="#fff" opacity=".6"/>
    <path d="M110 ${top+70} q-24 6 -30 34 q20 -4 30 -34Z" fill="${kd.pod}"/><circle cx="100" cy="${top+82}" r="4" fill="#fff" opacity=".6"/><circle cx="93" cy="${top+92}" r="3.5" fill="#fff" opacity=".6"/>`;
  return h}
function potSvg(st,k,pot){const [a,b]=POTS[pot]||POTS[''];const pat=pot==='dot'?[[92,262],[120,282],[150,262],[165,290],[105,298]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#fff" opacity=".5"/>`).join(''):pot==='rainbow'?['#FF6B6B','#FFB347','#FFE066','#6CD47A','#6AB7FF'].map((c,i)=>`<rect x="${74+i*0}" y="${246+i*12}" width="112" height="6" fill="${c}" opacity=".85"/>`).join(''):'';
  return `<svg class="pot" viewBox="0 0 260 330" aria-label="콩이 화분: ${KINDS[k].n} ${STAGES[st][1]}"><defs><clipPath id="potc"><path d="M70 228 h120 l-14 88 h-92Z"/></clipPath></defs><g class="sway">${plantSvg(st,k)}</g>
   <path d="M70 228 h120 l-14 88 h-92Z" fill="${a}"/><g clip-path="url(#potc)">${pat}</g><rect x="62" y="218" width="136" height="22" rx="8" fill="${b}"/><ellipse cx="130" cy="229" rx="58" ry="6" fill="#7A5236"/>
   <g class="kong" style="transform-origin:130px 300px;transform-box:view-box"><g transform="translate(96 252) scale(.55)">${K.buddySvg('sprout').replace(/<svg[^>]*>|<\/svg>/g,'')}</g></g></svg>`}

/* 오늘 확인된 공부: 맞힌 문제만 (연습·확인 기다림 제외) */
const todayCount=()=>{const d=new Date();d.setHours(0,0,0,0);const t0=d.getTime();return (S.log||[]).filter(r=>r.t>=t0&&r.ok&&r.res!=='pending'&&r.res!=='practice').length};
K.gardenAlert=()=>{const g=S.garden;return (stageOf(S.plant.water)===6)||(g.goal.day!==today()&&todayCount()>=GOAL)||(g.goal.day===today()&&!g.goal.got&&todayCount()>=GOAL)};

let tab='pot',slot='head',trial=null;
const TALK=['간지러워! 히히','같이 문제 풀자!','물 주면 쑥쑥 클 거야!','오늘도 고마워!','콩콩! 나 점프 잘하지?','네가 공부하면 나도 힘이 나!','오늘 옷 어때? 멋지지?'];
const SPOT=[[3,74],[78,76],[14,58],[70,60],[2,40],[84,44],[24,82],[60,84]];
const kongMini=w=>`<svg viewBox="-6 -20 132 142">${K.buddySvg('sprout',w).replace(/<svg[^>]*>|<\/svg>/g,'')}</svg>`;
function scene(st,k,g){const bg=BGS.find(x=>x.id===g.bg)||BGS[0];const fr=g.friends.map(id=>FRIENDS.find(x=>x.id===id)).filter(Boolean);let gi=0,fi=0;
  return `<div class="gscene" style="background:${bg.css}">${bg.dec.map((d,i)=>`<span class="gdec" style="left:${[6,80,46][i]}%;top:${[64,70,86][i]}%">${d}</span>`).join('')}
    ${bg.id==='night'||bg.id==='space'?'<span class="gdec tw" style="left:20%;top:10%">✨</span><span class="gdec tw" style="left:66%;top:18%;animation-delay:-1s">✨</span>':''}
    <div class="pot-wrap" id="pw">${potSvg(st,k,g.pot)}</div>
    ${fr.map(f=>{if(f.fly){const i=fi++;return `<span class="fr fly" data-fr="${f.id}" style="left:${[12,64,30,78][i%4]}%;top:${[10,16,30,6][i%4]}%;animation-delay:${-i*1.7}s">${f.e}</span>`}
      const p=SPOT[gi++%SPOT.length];return `<span class="fr walk" data-fr="${f.id}" style="left:${p[0]}%;top:${p[1]}%;animation-delay:${-gi*.7}s">${f.e}</span>`}).join('')}</div>`}
K.views.garden=a=>{const g=S.garden;if(g.goal.day!==today())g.goal={day:today(),got:false};
  const st=stageOf(S.plant.water),k=g.kind%KINDS.length,kd=KINDS[k],n=todayCount();const next=STAGES[st+1];
  const goalHtml=`<div class="goal"><div>⭐ <b>오늘의 공부</b> 문제 ${GOAL}개 맞히기 · <b>${Math.min(n,GOAL)}/${GOAL}</b></div><div class="bar"><i style="width:${Math.min(100,n/GOAL*100)}%"></i></div>
    ${g.goal.got?'<div>✅ 오늘 보너스 받았어요! 내일 또 만나!</div>':n>=GOAL?`<button class="btn green pulse" id="bonus">🎁 보너스 콩알 ${BONUS}개 받기</button>`:`<div class="muted">${GOAL-n}개 더 맞히면 보너스 콩알 ${BONUS}개!</div>`}</div>`;
  let body='';
  if(tab==='pot')body=`${goalHtml}<div class="board" style="position:relative;padding:8px"><div class="muted" style="text-align:center;font-size:14px;margin-bottom:4px">${k+1}번째 콩 · <b>${kd.n}</b></div>
     ${scene(st,k,g)}<div class="stage-bar" style="margin-top:8px">${STAGES.map((s,i)=>`<span class="${i<=st?'on':''}">${s[1]}</span>`).join('')}</div></div>
     ${st===6?`<button class="btn big green pulse" id="hv">🧺 콩 수확하기</button>`:`<button class="btn big blue" id="wt">💧 물 주기 (콩알 ${COST}개)</button>`}
     <div class="muted" style="text-align:center;font-size:14px">콩이랑 친구들을 콕 눌러 봐!</div>`;
  else if(tab==='shop'){const list=CAT(slot);const wearSlot=WEAR[slot];
    const cur=slot==='friend'?null:slot==='bg'?g.bg:slot==='pot'?g.pot:g.wear[slot];
    const pw=Object.assign({},g.wear,trial&&WEAR[trial.k]?{[trial.k]:trial.id}:{});
    const tItem=trial&&(trial.k==='friend'?FRIENDS:trial.k==='bg'?BGS:trial.k==='pot'?POTLIST:WEAR[trial.k]).find(x=>x.id===trial.id);
    body=`<div class="dressup"><div class="mirror">${wearSlot||!trial?`<div class="big-kong">${kongMini(pw)}</div>`:''}
        ${trial&&trial.k==='friend'?`<div class="big-kong" style="font-size:90px;line-height:150px;text-align:center">${tItem.e}</div>`:''}
        ${trial&&(trial.k==='bg'||trial.k==='pot')?`<div class="big-kong mini-scene">${scene(stageOf(S.plant.water),k,Object.assign({},g,{friends:[],[trial.k]:trial.id}))}</div>`:''}
        ${tItem?`<div class="trybar"><b>${tItem.n}</b> 입어 보는 중 · 🫘 ${tItem.c}<button class="btn green" id="buy">사기</button><button class="btn ghost" id="untry">벗기</button></div>`:`<div class="muted" style="font-size:14px;text-align:center">물건을 누르면 먼저 입어 볼 수 있어요</div>`}</div>
      <div class="slots">${SLOTS.map(([id,l])=>`<button data-slot="${id}" class="${slot===id?'on':''}">${l}</button>`).join('')}</div>
      <div class="shop">${slot!=='friend'&&slot!=='bg'&&slot!=='pot'?`<button class="item ${!cur?'on':''}" data-none="1">${kongMini(Object.assign({},g.wear,{[slot]:''}))}<b>안 하기</b><small>&nbsp;</small></button>`:''}
      ${list.map(it=>{const id=it.id;const lock=(it.need||0)>g.done.length;const own=!it.c||g.own.includes(slot+':'+id)||g.own.includes(id)&&slot!=='friend'&&slot!=='bg'||(slot==='friend'&&g.own.includes('f:'+id))||(slot==='bg'&&g.own.includes('bg:'+id));
        const on=slot==='friend'?g.friends.includes(id):cur===id;
        const pic=wearSlot?kongMini({[slot]:id}):slot==='friend'?`<span class="fe">${it.e}</span>`:slot==='bg'?`<span class="bgsw" style="background:${it.css}">${it.dec[0]}</span>`:`<svg viewBox="40 200 180 130">${potSvg(0,0,id).replace(/<svg[^>]*>|<\/svg>/g,'')}</svg>`;
        return `<button class="item ${on?'on':''} ${lock?'lock':''} ${trial&&trial.id===id&&trial.k===slot?'try':''}" data-it="${id}">${pic}<b>${it.n}</b><small>${lock?`🔒 수확 ${it.need}번`:own?(on?(slot==='friend'?'정원에 있어요 ✔':'하는 중 ✔'):'가지고 있어요'):`🫘 ${it.c}`}</small></button>`}).join('')}</div></div>`;}
  else body=`<p style="margin:0;text-align:center">콩을 수확하면 도감에 모여요. <b>${g.done.length}/${KINDS.length}</b></p><div class="dex">${KINDS.map((x,i)=>{const got=g.done.includes(i);
     return `<div class="card ${got?'':'lock'} ${i===k&&!got?'cur':''}"><svg viewBox="60 30 140 140">${bloom(i,120)}</svg><div>${got?`<b>${x.n}</b>`:i===k?'키우는 중':'?'}</div></div>`}).join('')}</div>
     ${g.done.length?`<div class="board" style="font-size:15px">${g.done.map(i=>`<div>🌼 <b>${KINDS[i].n}</b> · ${KINDS[i].t}</div>`).join('')}</div>`:''}`;
  a.innerHTML=`<div class="screen">${K.topbar('콩이 정원')}<div class="hud" style="justify-content:center"><span class="beans">🫘 콩알 <b id="bn">${S.beans}</b>개</span><span class="beans">🌼 수확 ${g.done.length}번</span></div>
   ${tab==='shop'?'':K.buddyRow()}<div class="gtabs">${[['pot','🪴 정원'],['shop','👗 꾸미기'],['dex','📖 도감']].map(([t,l])=>`<button data-tab="${t}" class="${tab===t?'on':''}">${l}</button>`).join('')}</div>
   ${body}<button class="btn ghost" id="pl">공부하러 가기 ▶</button></div>`;
  a.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;trial=null;K.sfx.pick();K.render()});
  $('#pl').onclick=()=>K.go('village');
  if(tab==='pot'){
    K.say(st===6?`우와! ${kd.n} 꼬투리가 열렸어! 수확해 보자!`:`지금은 <b>${STAGES[st][1]}</b>야. 물을 ${next[0]-S.plant.water}번 더 주면 <b>${next[1]}</b>${K.josa(next[1],'로')} 자라!${S.beans<COST?' 문제를 맞히면 콩알을 받아.':''}`);
    const pop=(e,t)=>{const h=document.createElement('span');h.className='heart-pop';h.textContent=t;const sc=a.querySelector('.gscene'),r=sc.getBoundingClientRect();h.style.left=(e.clientX-r.left-14)+'px';h.style.top=(e.clientY-r.top-30)+'px';sc.appendChild(h);setTimeout(()=>h.remove(),1000)};
    const kong=a.querySelector('.pot .kong');kong.onclick=e=>{kong.classList.remove('hop');void kong.getBoundingClientRect();kong.classList.add('hop');K.sfx.pick();g.pets++;pop(e,n>=GOAL?'💖':'💚');
      K.say(n>=GOAL?'오늘 공부 많이 해서 콩이가 엄청 신나!':n>0?`벌써 ${n}개나 맞혔네! ${K.pick(TALK)}`:K.pick(TALK))};
    a.querySelectorAll('[data-fr]').forEach(el=>el.onclick=e=>{const f=FRIENDS.find(x=>x.id===el.dataset.fr);el.classList.remove('boing');void el.offsetWidth;el.classList.add('boing');K.sfx.pick();pop(e,'💛');K.say(`${f.e} ${f.n}: "${f.say}"`)});
    const wt=$('#wt');if(wt)wt.onclick=()=>{if(S.beans<COST){K.sfx.soft();K.say(`콩알이 ${COST-S.beans}개 모자라! 문제를 맞히면 콩알을 받을 수 있어.`);return}
      S.beans-=COST;S.plant.water++;K.save();const d=document.createElement('span');d.className='drop-water';d.textContent='💧';d.style.left='48%';d.style.top='30%';a.querySelector('.board').appendChild(d);K.sfx.poof();
      setTimeout(()=>{const ns=stageOf(S.plant.water);if(ns>st){K.confetti(70);K.sfx.good()}K.render();if(ns>st)K.later(()=>K.say(`쑥쑥! <b>${STAGES[ns][1]}</b>${K.josa(STAGES[ns][1],'로')} 자랐어! 고마워!`),300)},900)};
    const hv=$('#hv');if(hv)hv.onclick=()=>{if(!g.done.includes(k))g.done.push(k);g.kind=(k+1)%KINDS.length;S.plant.water=0;K.save();K.confetti(120);K.sfx.good();
      const nk=KINDS[g.kind];const unlock=ALLW.concat(FRIENDS,BGS,POTLIST).filter(it=>(it.need||0)===g.done.length);
      modal(`<div class="harvest"><h2 style="margin:0">🧺 ${kd.n} 수확!</h2><svg viewBox="60 30 140 140">${bloom(k,120)}</svg><div>도감에 <b>${kd.n}</b>${K.josa(kd.n,'이')} 들어갔어!</div>
        <div>다음 씨앗은 <b>${nk.n}</b>이야. 또 키워 보자!</div>${unlock.length?`<div>🎁 새로 열린 꾸미기: <b>${unlock.map(x=>x.n).join(', ')}</b></div>`:''}<button class="btn green" data-close>좋아!</button></div>`);
      K.render();K.later(()=>K.say(`${kd.n} 수확 성공! 새 씨앗 <b>${nk.n}</b>${K.josa(nk.n,'을')} 심었어!`),300)};
    const bo=$('#bonus');if(bo)bo.onclick=()=>{if(g.goal.got)return;g.goal.got=true;S.beans+=BONUS;K.save();K.confetti(80);K.sfx.good();K.toast(`🎁 보너스 콩알 ${BONUS}개!`);K.render();K.later(()=>K.say('오늘의 공부 완료! 정말 멋져!'),300)};
  }
  if(tab==='shop'){if(!trial)K.say('어떻게 꾸밀까? 눌러서 먼저 입어 보고, 마음에 들면 사!');
    const key=(k,id)=>k==='friend'?'f:'+id:k==='bg'?'bg:'+id:k==='pot'?'pot:'+id:id;
    const owns=(k,id)=>{const it=CAT(k).find(x=>x.id===id);return !it.c||g.own.includes(key(k,id))||(k==='pot'&&g.own.includes(id))};
    const put=(k,id)=>{if(k==='friend'){g.friends=g.friends.includes(id)?g.friends.filter(x=>x!==id):g.friends.concat(id).slice(-8)}else if(k==='bg')g.bg=id;else if(k==='pot')g.pot=id;else g.wear[k]=g.wear[k]===id?'':id;K.save()};
    a.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{slot=b.dataset.slot;trial=null;K.sfx.pick();K.render()});
    const nb=a.querySelector('[data-none]');if(nb)nb.onclick=()=>{g.wear[slot]='';trial=null;K.save();K.sfx.pick();K.render()};
    a.querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>{const id=b.dataset.it,it=CAT(slot).find(x=>x.id===id);
      if((it.need||0)>g.done.length){K.sfx.soft();K.say(`이건 콩을 ${it.need}번 수확하면 열려! 지금 ${g.done.length}번.`);return}
      if(owns(slot,id)){put(slot,id);trial=null;K.sfx.pick();K.render();if(slot==='friend'&&g.friends.includes(id))K.later(()=>K.say(`${it.e} ${it.n}${K.josa(it.n,'이')} 정원에 놀러 왔어!`),200);return}
      trial={k:slot,id};K.sfx.pick();K.render();K.later(()=>K.say(S.beans>=it.c?`${it.n}! 어때? 마음에 들면 <b>사기</b>를 눌러!`:`${it.n}! 콩알이 ${it.c-S.beans}개 모자라. 문제를 맞혀서 모아 보자!`),150)});
    const by=$('#buy');if(by)by.onclick=()=>{const it=CAT(trial.k).find(x=>x.id===trial.id);if(S.beans<it.c){K.sfx.soft();K.say(`콩알이 ${it.c-S.beans}개 모자라! 문제를 맞혀서 모아 보자.`);return}
      S.beans-=it.c;g.own.push(key(trial.k,trial.id));put(trial.k,trial.id);if(trial.k==='friend'&&!g.friends.includes(trial.id))put('friend',trial.id);const nm=it.n;trial=null;K.save();K.confetti(50);K.sfx.good();K.render();K.later(()=>K.say(`짜잔! ${nm}! 정말 잘 어울려!`),300)};
    const ut=$('#untry');if(ut)ut.onclick=()=>{trial=null;K.sfx.pick();K.render()}}
  if(tab==='dex')K.say(g.done.length?`지금까지 ${g.done.length}가지 콩을 모았어! 다 모으면 뭐가 나올까?`:'콩을 수확하면 여기에 모여! 첫 수확을 해 보자!');
};
})();
