/* 콩이 놀이터: 옆으로 넓은 마을 마당. 콩이와 친구들이 걸어 다니며 놀이기구를 타요.
   놀이기구·장식은 콩알로 사서 아무 데나 놓고 끌어서 옮길 수 있어요.
   콩알은 여기서 쓰기만 해요(버는 곳은 확인된 공부뿐). */
'use strict';
(()=>{
const S=K.S;
const W=1600,H=440,HOR=205,YMIN=246,YMAX=430;

K.css(`
.pk{position:relative;margin:0 -4px}
.pkv{position:relative;height:${H}px;overflow-x:auto;overflow-y:hidden;border-radius:24px;box-shadow:0 4px 0 var(--line),inset 0 0 0 3px rgba(255,255,255,.6);scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.pkv::-webkit-scrollbar{display:none}
.pkw{position:relative;width:${W}px;height:${H}px;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.pkw>svg.pkbg{position:absolute;inset:0;width:${W}px;height:${H}px;display:block}
.pki{position:absolute;cursor:pointer;-webkit-tap-highlight-color:transparent}
.pki svg{display:block;width:100%;height:100%;overflow:visible}
.pki.fl svg{transform:scaleX(-1)}
.pk.edit .pki{cursor:grab;touch-action:none}.pk.edit .pki:after{content:'';position:absolute;inset:-4px;border:2px dashed rgba(255,255,255,.9);border-radius:14px;pointer-events:none;filter:drop-shadow(0 0 2px rgba(0,0,0,.35))}
.pk.edit .pki.sel:after{border:3px solid #FFC845;filter:drop-shadow(0 0 4px rgba(255,170,0,.6))}
.pk.edit .pki.drag{cursor:grabbing;filter:drop-shadow(0 10px 8px rgba(0,0,0,.25))}
.pc{position:absolute;width:72px;height:78px;margin:-78px 0 0 -36px;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}
.pc.fr2{width:48px;height:48px;margin:-48px 0 0 -24px;font-size:40px;line-height:48px;text-align:center}
.pc.fly{width:40px;height:40px;margin:-40px 0 0 -20px;font-size:30px;line-height:40px;pointer-events:auto}
.pc .pa,.pc .pf,.pc .pb{width:100%;height:100%}
.pc .pf{transition:transform .2s}.pc.left .pf{transform:scaleX(-1)}
.pc svg{width:100%;height:100%;display:block;overflow:visible}
.pc.walk .pb{animation:pwalk .42s ease-in-out infinite}@keyframes pwalk{50%{transform:translateY(-6px) rotate(3deg)}}
.pc.fly .pb{animation:pflap .5s ease-in-out infinite}@keyframes pflap{50%{transform:translateY(-4px) scale(1.05,.92)}}
.pc .sh{position:absolute;left:18%;right:18%;bottom:-4px;height:8px;border-radius:50%;background:rgba(0,0,0,.14)}
.pc.fly .sh,.pc.home .sh{display:none}
.pc.hop .pa{animation:phop .55s}@keyframes phop{35%{transform:translateY(-34px) scale(.95,1.08)}70%{transform:translateY(0) scale(1.08,.92)}}
.a-slide .pa{animation:kslide 3.2s ease-in-out forwards}
@keyframes kslideL{0%{transform:none}35%{transform:translate(-4px,-108px)}45%{transform:translate(-12px,-112px)}80%{transform:translate(-128px,-12px)}90%,100%{transform:translate(-142px,0)}}
@keyframes kslide{0%{transform:none}35%{transform:translate(4px,-108px)}45%{transform:translate(12px,-112px)}80%{transform:translate(128px,-12px)}90%,100%{transform:translate(142px,0)}}
.a-swing .pa{transform-origin:50% -18px;animation:kswing 1.5s ease-in-out infinite alternate}
@keyframes kswing{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}
.pki .sw.on{animation:kswing 1.5s ease-in-out infinite alternate}
.pki .saw.on{animation:ksaw 1.6s ease-in-out infinite}@keyframes ksaw{0%,100%{transform:rotate(12deg)}50%{transform:rotate(-12deg)}}
.a-saw .pa{animation:ksawc 1.6s ease-in-out infinite}@keyframes ksawc{0%,100%{transform:translateY(-18px)}50%{transform:translateY(18px)}}
.a-jump .pa{animation:kjump .8s cubic-bezier(.3,.6,.4,1) infinite}@keyframes kjump{0%,100%{transform:scale(1.1,.88)}12%{transform:none}50%{transform:translateY(-90px) rotate(8deg)}88%{transform:none}}
.pki .mat.on{animation:kmat .8s infinite}@keyframes kmat{0%,100%{transform:scaleY(.6)}15%,85%{transform:none}}
.a-spin .pa{animation:kspin 2.4s linear infinite}@keyframes kspin{0%{transform:translateX(-46px) scale(.9)}25%{transform:translateX(0) scale(1.05)}50%{transform:translateX(46px) scale(.9)}75%{transform:translateX(0) scale(.8);opacity:.6}100%{transform:translateX(-46px) scale(.9)}}
.pki .top.on{animation:ktop .6s linear infinite}@keyframes ktop{to{stroke-dashoffset:-24}}
.a-dig .pa{animation:kdig .5s ease-in-out infinite}@keyframes kdig{50%{transform:rotate(-10deg) translateY(4px)}}
.a-swim .pa{animation:kswim 1s ease-in-out infinite}@keyframes kswim{50%{transform:translateY(6px) rotate(-4deg)}}
.a-swim .pb{clip-path:inset(0 0 22% 0)}
.a-sit .pa{animation:ksit 2s ease-in-out infinite}@keyframes ksit{50%{transform:rotate(-5deg)}}
.a-home .pa{animation:khome 4s ease-in-out forwards}@keyframes khome{0%{transform:none;opacity:1}20%,80%{transform:translateY(-6px) scale(.5);opacity:0}100%{transform:none;opacity:1}}
.a-dance .pa{animation:kdance .7s ease-in-out infinite}@keyframes kdance{25%{transform:rotate(-12deg) translateY(-8px)}75%{transform:rotate(12deg) translateY(-8px)}}
.pkbub{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#3D2E28;font-family:var(--f-disp);font-size:16px;padding:6px 12px;border-radius:16px;white-space:nowrap;box-shadow:0 3px 0 rgba(0,0,0,.12);pointer-events:none;z-index:999;animation:pkb .25s ease-out}
.pkbub:after{content:'';position:absolute;left:50%;bottom:-7px;margin-left:-7px;border:7px solid transparent;border-bottom:0;border-top-color:#fff}
@keyframes pkb{from{transform:translate(-50%,-80%) scale(.6);opacity:0}}
.ppop{position:absolute;font-size:26px;pointer-events:none;z-index:998;animation:ppop 1.2s ease-out forwards}
@keyframes ppop{0%{transform:translate(-50%,0) scale(.5);opacity:0}20%{opacity:1;transform:translate(-50%,-14px) scale(1.1)}100%{transform:translate(-50%,-70px) scale(1);opacity:0}}
.pkbg .cl{animation:pcl 140s linear infinite}.pkbg .cl2{animation-duration:200s;animation-delay:-60s}@keyframes pcl{from{transform:translateX(-300px)}to{transform:translateX(${W+300}px)}}
.pkbg .ray{transform-origin:1380px 78px;animation:pray 30s linear infinite}@keyframes pray{to{transform:rotate(360deg)}}
.pkbg .tw{animation:ptw 2.4s ease-in-out infinite}@keyframes ptw{50%{opacity:.2}}
.pki .wtr{stroke-dasharray:6 6;animation:pwtr .5s linear infinite}@keyframes pwtr{to{stroke-dashoffset:-12}}
.pki .glow{opacity:0;transition:opacity .4s}.pk.night .pki .glow{opacity:1}
.pki .bln{animation:pbln 3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}@keyframes pbln{50%{transform:rotate(4deg) translateY(-3px)}}
.pkn{position:absolute;top:50%;margin-top:-22px;width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.88);box-shadow:0 3px 0 rgba(0,0,0,.15);font-size:20px;color:#3D2E28;cursor:pointer;z-index:1000;display:grid;place-items:center}
.pkn.l{left:8px}.pkn.r{right:8px}
.pktools{position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:1000}
.pktools button,.pkfind{appearance:none;border:0;border-radius:999px;padding:7px 13px;font-family:var(--f-disp);font-size:15px;background:rgba(255,255,255,.92);color:#3D2E28;box-shadow:0 3px 0 rgba(0,0,0,.15);cursor:pointer}
.pktools button.on{background:#FFC845}
.pkfind{position:absolute;top:10px;left:10px;z-index:1000}
.pkmm{position:relative;height:12px;margin:8px 18px 0;border-radius:999px;background:var(--s-track);overflow:hidden;cursor:pointer}
.pkmm i{position:absolute;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#8FD873,#4CB963)}
.pkmm b{position:absolute;top:2px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#FF6F91;box-shadow:0 0 0 2px #fff}
.pksel{position:absolute;z-index:1001;display:flex;gap:6px;transform:translate(-50%,-100%);padding-bottom:8px}
.pksel button{appearance:none;border:0;border-radius:999px;width:42px;height:42px;font-size:19px;background:#fff;box-shadow:0 3px 0 rgba(0,0,0,.18);cursor:pointer}
.pktray{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.pktray .row{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 8px;scrollbar-width:thin}
.pkit{flex:0 0 96px;appearance:none;border:0;cursor:pointer;border-radius:18px;padding:6px 4px;background:var(--s-white);box-shadow:inset 0 0 0 2px var(--line);font-family:inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:2px}
.pkit .th{width:80px;height:62px;display:grid;place-items:center}.pkit .th svg{max-width:80px;max-height:62px;width:auto;height:auto}
.pkit b{font-family:var(--f-disp);font-weight:400;font-size:15px}.pkit small{font-size:12.5px;color:var(--muted)}
.pkit.have small{color:var(--green-d,#3A9A4F);font-weight:700}.pkit.lock{opacity:.5}.pkit.try{box-shadow:inset 0 0 0 3px #B48CF0;background:linear-gradient(160deg,#F6EEFF,#FFF)}
:root[data-theme="dark"] .pkit.try{background:#3A2E4A}
.pkcat{display:flex;gap:6px}.pkcat button{appearance:none;border:0;font-family:var(--f-disp);font-size:15px;padding:6px 12px;border-radius:999px;background:var(--s-white);color:var(--ink);box-shadow:inset 0 0 0 2px var(--line);cursor:pointer}
.pkcat button.on{background:linear-gradient(135deg,#8FD873,#4CB963);color:#fff;box-shadow:none}
.pkbuy{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;font-size:15px;padding:8px;border-radius:16px;background:var(--s-yellow)}
.pkbuy .btn{padding:6px 16px;font-size:16px;min-height:0}
.pkhint{text-align:center;font-size:14px;color:var(--muted)}
.pkpot .alert{position:absolute;left:50%;top:-8px;transform:translateX(-50%);font-size:28px;animation:phop 1.2s infinite}
`);

/* ---------- 그림 도구 ---------- */
const sh=(w,h,r=.4)=>`<ellipse cx="${w/2}" cy="${h-4}" rx="${w*r}" ry="7" fill="#000" opacity=".13"/>`;
const flw=(x,y,c,r=4)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<circle r="${r}" cx="${(r*1.3*Math.sin(a*Math.PI/180)).toFixed(1)}" cy="${(-r*1.3*Math.cos(a*Math.PI/180)).toFixed(1)}" fill="${c}"/>`).join('')}<circle r="${r*.75}" fill="#FFC845"/></g>`;
const canopy=(cs)=>`<circle cx="60" cy="74" r="42" fill="${cs[0]}"/><circle cx="32" cy="88" r="28" fill="${cs[0]}"/><circle cx="88" cy="88" r="28" fill="${cs[0]}"/><circle cx="60" cy="48" r="32" fill="${cs[1]}"/><circle cx="38" cy="70" r="22" fill="${cs[1]}"/><circle cx="84" cy="66" r="20" fill="${cs[1]}"/><circle cx="48" cy="38" r="11" fill="${cs[2]}" opacity=".8"/><circle cx="74" cy="56" r="8" fill="${cs[2]}" opacity=".7"/><circle cx="28" cy="78" r="7" fill="${cs[2]}" opacity=".6"/>`;
const trunk=`<path d="M52 158 L54 100 Q60 92 66 100 L68 158Z" fill="#9B6B43"/><path d="M61 158 L62 102 Q64 98 66 100 L68 158Z" fill="#7E5434"/><path d="M60 118 L44 104 M61 128 L76 112" stroke="#9B6B43" stroke-width="5" stroke-linecap="round"/>`;

/* 놀이기구·장식. act: 콩이·친구가 와서 하는 놀이, sp: 놀이 자리(밑동 가운데 기준), d: 노는 시간 */
const ITEMS=[
 {id:'tree',cat:'deco',n:'나무',c:48,w:120,h:162,svg:()=>sh(120,162,.3)+trunk+canopy(['#5DB33E','#73C94F','#A6E386'])+`<circle cx="40" cy="96" r="4" fill="#F2665E"/><circle cx="80" cy="84" r="4" fill="#F2665E"/><circle cx="62" cy="64" r="4" fill="#F2665E"/>`},
 {id:'blossom',cat:'deco',n:'벚꽃나무',c:120,w:120,h:162,svg:()=>sh(120,162,.3)+trunk+canopy(['#F7A8C4','#FFC4D8','#FFE6EF'])+[[30,70],[70,40],[90,92],[50,96],[64,70]].map(([x,y])=>flw(x,y,'#fff',3)).join('')},
 {id:'pine',cat:'deco',n:'소나무',c:64,w:100,h:160,svg:()=>sh(100,160,.28)+`<rect x="44" y="124" width="12" height="34" rx="3" fill="#8B5E3C"/><path d="M50 8 L84 62 L66 62 L92 104 L70 104 L96 136 L4 136 L30 104 L8 104 L34 62 L16 62Z" fill="#3E9E5A"/><path d="M50 8 L84 62 L66 62 L92 104 L70 104 L96 136 L50 136Z" fill="#33874C"/><circle cx="40" cy="70" r="4" fill="#FFC845"/><circle cx="62" cy="96" r="4" fill="#4A9FE8"/><circle cx="34" cy="118" r="4" fill="#F2665E"/>`},
 {id:'flowers',cat:'deco',n:'꽃밭',c:40,w:120,h:56,svg:()=>sh(120,56,.45)+`<ellipse cx="60" cy="42" rx="54" ry="13" fill="#8B5E3C"/><ellipse cx="60" cy="39" rx="50" ry="10" fill="#A0703F"/>`+[[18,30],[34,22],[52,30],[68,20],[86,28],[102,24],[44,38],[78,38]].map(([x,y],i)=>`<path d="M${x} ${y+10} V${y+2}" stroke="#4E9E3A" stroke-width="2.5"/><ellipse cx="${x-5}" cy="${y+8}" rx="5" ry="2.5" fill="#6DBB52"/>`+flw(x,y,['#FF9DB5','#FFE066','#B48CF0','#7EC8F5','#FF8A5B'][i%5],4.5)).join('')},
 {id:'bench',cat:'deco',n:'벤치',c:64,w:110,h:66,act:'sit',sp:[-14,-22],d:5000,svg:()=>sh(110,66,.42)+`<rect x="14" y="40" width="6" height="22" rx="2" fill="#6B6B7B"/><rect x="90" y="40" width="6" height="22" rx="2" fill="#6B6B7B"/><rect x="8" y="8" width="94" height="10" rx="4" fill="#D98A4E"/><rect x="8" y="21" width="94" height="10" rx="4" fill="#E39A5E"/><rect x="4" y="36" width="102" height="10" rx="4" fill="#C27440"/><rect x="4" y="36" width="102" height="4" rx="2" fill="#E8A86E"/><rect x="18" y="6" width="5" height="34" fill="#6B6B7B"/><rect x="87" y="6" width="5" height="34" fill="#6B6B7B"/>`},
 {id:'lamp',cat:'deco',n:'가로등',c:64,w:44,h:150,svg:()=>sh(44,150,.36)+`<circle class="glow" cx="22" cy="26" r="26" fill="#FFE9A8" opacity=".55"/><rect x="19" y="34" width="6" height="108" fill="#4A4F63"/><rect x="13" y="138" width="18" height="8" rx="3" fill="#3A3E50"/><path d="M10 34 L34 34 L30 14 L14 14Z" fill="#FFE9A8" stroke="#4A4F63" stroke-width="3" stroke-linejoin="round"/><path d="M10 14 L22 4 L34 14Z" fill="#4A4F63"/>`},
 {id:'tent',cat:'deco',n:'텐트',c:160,w:140,h:100,act:'home',sp:[0,0],d:4000,svg:()=>sh(140,100,.46)+`<path d="M70 8 L134 94 L6 94Z" fill="#FFB347"/><path d="M70 8 L98 94 L42 94Z" fill="#FF8A3D"/><path d="M70 8 L134 94 L118 94Z" fill="#F2A33A"/><path d="M70 40 L84 94 L56 94Z" fill="#5B3A29"/><path d="M70 8 V0" stroke="#5B3A29" stroke-width="3"/><path d="M70 0 L84 5 L70 10Z" fill="#F2665E"/>`},
 {id:'balloons',cat:'deco',n:'풍선 가게',c:120,w:80,h:150,svg:()=>sh(80,150,.4)+[['#FF6F91',22,30],['#FFC845',44,18],['#4A9FE8',60,40],['#8FD873',34,52],['#B48CF0',54,62]].map(([c,x,y])=>`<g class="bln"><path d="M40 112 Q${x} ${y+40} ${x} ${y+14}" stroke="#999" stroke-width="1.2" fill="none"/><ellipse cx="${x}" cy="${y}" rx="11" ry="13" fill="${c}"/><ellipse cx="${x-4}" cy="${y-5}" rx="3" ry="4" fill="#fff" opacity=".55"/></g>`).join('')+`<rect x="14" y="108" width="52" height="30" rx="6" fill="#F2665E"/><rect x="14" y="108" width="52" height="8" rx="4" fill="#fff" opacity=".5"/><circle cx="24" cy="142" r="6" fill="#4A4F63"/><circle cx="56" cy="142" r="6" fill="#4A4F63"/>`},
 {id:'swing',cat:'play',n:'그네',c:200,w:160,h:150,act:'swing',sp:[-20,-38],d:6000,svg:()=>sh(160,150,.46)+`<path d="M22 12 L6 146 M22 12 L38 146 M138 12 L122 146 M138 12 L154 146" stroke="#4A9FE8" stroke-width="7" stroke-linecap="round"/><rect x="14" y="7" width="132" height="10" rx="5" fill="#2F7AC4"/>
   <g class="sw" style="transform-origin:60px 14px"><path d="M48 14 V108 M72 14 V108" stroke="#8C7A6B" stroke-width="2.5"/><rect x="44" y="106" width="32" height="7" rx="3" fill="#F2665E"/></g>
   <g class="sw2" style="transform-origin:100px 14px"><path d="M88 14 V108 M112 14 V108" stroke="#8C7A6B" stroke-width="2.5"/><rect x="84" y="106" width="32" height="7" rx="3" fill="#FFC845"/></g>`},
 {id:'slide',cat:'play',n:'미끄럼틀',c:240,w:190,h:150,act:'slide',sp:[-60,0],d:3300,svg:()=>sh(190,150,.46)+`<path d="M24 146 V36 M50 146 V36" stroke="#4A9FE8" stroke-width="6" stroke-linecap="round"/>${[56,76,96,116,136].map(y=>`<path d="M24 ${y} H50" stroke="#2F7AC4" stroke-width="4"/>`).join('')}
   <rect x="16" y="30" width="62" height="10" rx="4" fill="#FFC845"/><path d="M18 30 V14 H76 V30" stroke="#FFC845" stroke-width="4" fill="none"/><path d="M74 146 V40" stroke="#4A9FE8" stroke-width="6"/>
   <path d="M72 34 C110 40 120 120 182 134 L182 146 C112 136 102 56 72 48Z" fill="#FF8A5B"/><path d="M72 34 C110 40 120 120 182 134" stroke="#FFB38F" stroke-width="5" fill="none"/>`},
 {id:'seesaw',cat:'play',n:'시소',c:200,w:180,h:74,act:'saw',sp:[-72,-38],d:5000,svg:()=>sh(180,74,.46)+`<path d="M76 70 L90 38 L104 70Z" fill="#8C7A6B"/><g class="saw" style="transform-origin:90px 38px"><rect x="4" y="32" width="172" height="9" rx="4" fill="#F2665E"/><rect x="4" y="32" width="172" height="3" rx="2" fill="#FF9B8F"/><path d="M20 32 V20 M160 32 V20" stroke="#FFC845" stroke-width="5" stroke-linecap="round"/></g><circle cx="90" cy="38" r="5" fill="#5B4A42"/>`},
 {id:'sandbox',cat:'play',n:'모래놀이',c:160,w:160,h:70,act:'dig',sp:[-10,-14],d:5000,pop:['🏰','⭐','🐚'],svg:()=>sh(160,70,.48)+`<path d="M6 40 L80 20 L154 40 L80 64Z" fill="#C9894E"/><path d="M14 40 L80 24 L146 40 L80 58Z" fill="#F3D58E"/><ellipse cx="62" cy="40" rx="14" ry="5" fill="#E8C270"/><path d="M98 32 l10 2 l-2 10 l-10 -2Z" fill="#F2665E"/><path d="M104 30 q4 -6 8 0" stroke="#F2665E" stroke-width="2" fill="none"/><path d="M40 36 l10 -10" stroke="#4A9FE8" stroke-width="3"/><path d="M50 26 l4 -2 l2 4 l-4 2Z" fill="#4A9FE8"/><path d="M6 40 L80 64 L154 40 L154 46 L80 70 L6 46Z" fill="#A86E3C"/>`},
 {id:'tramp',cat:'play',n:'트램펄린',c:200,w:140,h:60,act:'jump',sp:[0,-24],d:4500,svg:()=>sh(140,60,.46)+`<path d="M20 34 L14 56 M120 34 L126 56 M50 40 L48 58 M90 40 L92 58" stroke="#4A4F63" stroke-width="5" stroke-linecap="round"/><ellipse cx="70" cy="32" rx="64" ry="16" fill="#4A9FE8"/><g class="mat" style="transform-origin:70px 32px"><ellipse cx="70" cy="32" rx="52" ry="11" fill="#2D3A5C"/></g>${[0,1,2,3,4,5,6,7].map(i=>{const a=i/8*Math.PI*2;return `<circle cx="${(70+58*Math.cos(a)).toFixed(1)}" cy="${(32+14*Math.sin(a)).toFixed(1)}" r="3.5" fill="#FFC845"/>`}).join('')}`},
 {id:'merry',cat:'play',n:'회전놀이',c:320,need:1,w:160,h:120,act:'spin',sp:[0,-20],d:5000,svg:()=>sh(160,120,.48)+`<ellipse cx="80" cy="100" rx="70" ry="16" fill="#C27440"/><ellipse cx="80" cy="96" rx="70" ry="16" fill="#FFC845"/><path class="top" d="M14 96 A66 14 0 0 0 146 96" stroke="#F2665E" stroke-width="5" stroke-dasharray="12 12" fill="none"/><rect x="76" y="34" width="8" height="62" fill="#8C7A6B"/><path d="M26 96 V60 M134 96 V60 M54 104 V64 M106 104 V64" stroke="#4A9FE8" stroke-width="4"/><path d="M80 6 L150 46 L10 46Z" fill="#FF6F91"/><path d="M80 6 L104 46 L56 46Z" fill="#fff"/><path d="M10 46 Q27 56 45 46 Q62 56 80 46 Q97 56 115 46 Q132 56 150 46" fill="#FF6F91"/><circle cx="80" cy="6" r="5" fill="#FFC845"/>`},
 {id:'pool',cat:'play',n:'물놀이 풀',c:280,w:180,h:66,act:'swim',sp:[-14,-12],d:5500,pop:['💦','💧'],svg:()=>sh(180,66,.48)+`<ellipse cx="90" cy="38" rx="86" ry="24" fill="#4A9FE8"/><ellipse cx="90" cy="34" rx="86" ry="22" fill="#7EC8F5"/><ellipse cx="90" cy="34" rx="74" ry="16" fill="#9FE0FF"/><path class="wtr" d="M40 32 q10 -5 20 0 t20 0 M100 40 q10 -5 20 0 t20 0" stroke="#fff" stroke-width="2.5" fill="none"/><g transform="translate(132 28)"><circle r="10" fill="none" stroke="#F2665E" stroke-width="6"/><path d="M0 -10 v4 M0 6 v4 M-10 0 h4 M6 0 h4" stroke="#fff" stroke-width="6"/></g>`},
 {id:'fountain',cat:'play',n:'분수',c:280,need:1,w:130,h:126,act:'dance',sp:[62,0],d:4500,pop:['💧','✨'],svg:()=>sh(130,126,.48)+`<ellipse cx="65" cy="104" rx="60" ry="16" fill="#B9C2D0"/><ellipse cx="65" cy="98" rx="60" ry="16" fill="#DDE3EC"/><ellipse cx="65" cy="98" rx="50" ry="11" fill="#7EC8F5"/><rect x="58" y="52" width="14" height="44" fill="#DDE3EC"/><ellipse cx="65" cy="52" rx="28" ry="8" fill="#B9C2D0"/><ellipse cx="65" cy="50" rx="24" ry="6" fill="#7EC8F5"/><path class="wtr" d="M65 48 V18 M65 20 Q40 18 30 92 M65 20 Q90 18 100 92 M65 48 Q46 50 42 92 M65 48 Q84 50 88 92" stroke="#9FE0FF" stroke-width="3.5" fill="none" stroke-linecap="round"/>`},
 {id:'house',cat:'play',n:'콩이네 집',c:400,need:2,w:170,h:166,act:'home',sp:[0,0],d:4000,pop:['💤','🎵'],svg:()=>sh(170,166,.45)+`<rect x="122" y="22" width="18" height="40" fill="#C27440"/><rect x="22" y="70" width="126" height="90" rx="8" fill="#FFF3D6"/><rect x="22" y="70" width="126" height="10" fill="#F0DEB8"/><path d="M8 78 L85 14 L162 78Z" fill="#F2665E" stroke="#D94F48" stroke-width="4" stroke-linejoin="round"/><path d="M8 78 Q27 90 46 78 Q66 90 85 78 Q104 90 124 78 Q143 90 162 78" fill="#F2665E"/>
   <circle cx="85" cy="48" r="13" fill="#9FE0FF" stroke="#fff" stroke-width="4"/><path d="M85 35 V61 M72 48 H98" stroke="#fff" stroke-width="2.5"/><path d="M68 160 V122 Q85 104 102 122 V160Z" fill="#B07A4E"/><circle cx="96" cy="140" r="3" fill="#FFC845"/>
   <rect x="34" y="98" width="24" height="22" rx="4" fill="#9FE0FF" stroke="#fff" stroke-width="3"/><rect x="112" y="98" width="24" height="22" rx="4" fill="#9FE0FF" stroke="#fff" stroke-width="3"/><rect x="30" y="122" width="32" height="8" rx="3" fill="#8FD873"/>${flw(38,120,'#FF9DB5',3)}${flw(52,120,'#FFE066',3)}<rect x="108" y="122" width="32" height="8" rx="3" fill="#8FD873"/>${flw(116,120,'#B48CF0',3)}${flw(130,120,'#FF9DB5',3)}`},
 {id:'rainbow',cat:'deco',n:'무지개 문',c:480,need:3,w:220,h:124,svg:()=>sh(220,124,.46)+['#FF6B6B','#FFB347','#FFE066','#6CD47A','#6AB7FF','#B48CF0'].map((c,i)=>`<path d="M${14+i*9} 118 A${96-i*9} ${96-i*9} 0 0 1 ${206-i*9} 118" stroke="${c}" stroke-width="9.5" fill="none"/>`).join('')+`<ellipse cx="18" cy="114" rx="20" ry="10" fill="#fff"/><ellipse cx="202" cy="114" rx="20" ry="10" fill="#fff"/><ellipse cx="30" cy="110" rx="12" ry="8" fill="#fff"/><ellipse cx="190" cy="110" rx="12" ry="8" fill="#fff"/>`},
];
const IT=id=>ITEMS.find(x=>x.id===id);
const ART=(it,extra='')=>`<svg viewBox="0 0 ${it.w} ${it.h}" ${extra}>${it.svg()}</svg>`;

/* 배경 색 (정원 배경을 사면 놀이터도 바뀌어요) */
const PAL={
 '':{sky:['#9FD8FF','#E4F5FF'],far:'#BDE6A8',near:'#A3D886',g:['#94D06F','#7DC05A'],path:'#F5E1B5',edge:'#E6CB92',fence:1,sun:1},
 beach:{sky:['#8FD3FF','#DDF4FF'],far:'#4FB6E6',near:'#79CDEE',g:['#F5DFA8','#EBCD8A'],path:'#FFF0CF',edge:'#E3C487',fence:0,sun:1,sea:1},
 snow:{sky:['#BFD0EE','#EEF3FB'],far:'#DCE6F5',near:'#EEF3FA',g:['#FFFFFF','#E5ECF7'],path:'#D3DDEC',edge:'#C1CDE0',fence:1,sun:1,snow:1},
 candy:{sky:['#FFC9E2','#FFF0F6'],far:'#FFD1E6',near:'#FFB3D3',g:['#FFC2DA','#FFA7CB'],path:'#FFF3CF',edge:'#F7D98F',fence:1,sun:1},
 night:{sky:['#18224F','#3B4A8C'],far:'#2B4A62',near:'#2A5640',g:['#2F6142','#244A33'],path:'#5D6E52',edge:'#4A5A40',fence:1,moon:1,night:1},
 space:{sky:['#0B0D2A','#33246A'],far:'#3A2E6B',near:'#4A3A8C',g:['#5E4CA6','#4A3A8C'],path:'#8C7BD0',edge:'#7563BA',fence:0,moon:1,night:1,space:1},
};
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function bgSvg(bid){const p=PAL[bid]||PAL[''];seed=11;let h=`<defs><linearGradient id="pks" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>
  <linearGradient id="pkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.g[0]}"/><stop offset="1" stop-color="${p.g[1]}"/></linearGradient>
  <radialGradient id="pksun"><stop offset=".55" stop-color="#FFE066"/><stop offset="1" stop-color="#FFE066" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#pks)"/>`;
  if(p.sun)h+=`<circle cx="1380" cy="78" r="70" fill="url(#pksun)" opacity=".6"/><g class="ray">${Array.from({length:12},(_,i)=>`<path d="M1380 78 L${(1380+Math.cos(i*Math.PI/6)*70).toFixed(0)} ${(78+Math.sin(i*Math.PI/6)*70).toFixed(0)}" stroke="#FFE066" stroke-width="6" stroke-linecap="round" opacity=".5" stroke-dasharray="0 48 22"/>`).join('')}</g><circle cx="1380" cy="78" r="34" fill="#FFD23F"/><circle cx="1370" cy="70" r="5" fill="#5B4A42"/><circle cx="1392" cy="70" r="5" fill="#5B4A42"/><path d="M1368 84 q12 10 24 0" stroke="#5B4A42" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="1362" cy="82" r="5" fill="#FF9DB5" opacity=".7"/><circle cx="1398" cy="82" r="5" fill="#FF9DB5" opacity=".7"/>`;
  if(p.night){for(let i=0;i<40;i++){const x=rnd()*W,y=rnd()*170;h+=`<circle class="tw" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1+rnd()*2).toFixed(1)}" fill="#fff" style="animation-delay:-${(rnd()*2.4).toFixed(1)}s"/>`}}
  if(p.moon)h+=`<circle cx="1380" cy="78" r="56" fill="#FFF6C9" opacity=".18"/><circle cx="1380" cy="78" r="32" fill="#FFF3B0"/><circle cx="1394" cy="68" r="28" fill="${p.sky[0]}"/>`;
  if(p.space)h+=`<circle cx="260" cy="90" r="30" fill="#FF9DB5"/><ellipse cx="260" cy="90" rx="50" ry="10" fill="none" stroke="#FFE066" stroke-width="4" transform="rotate(-18 260 90)"/><circle cx="760" cy="60" r="14" fill="#7EC8F5"/><circle cx="1080" cy="130" r="9" fill="#8FD873"/>`;
  if(!p.night){const cloud=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="46" ry="18" fill="#fff"/><circle cx="-18" cy="-10" r="18" fill="#fff"/><circle cx="12" cy="-16" r="22" fill="#fff"/><ellipse cx="0" cy="6" rx="40" ry="8" fill="#000" opacity=".04"/></g>`;
    h+=`<g class="cl" opacity=".95">${cloud(120,70,1)}${cloud(620,40,.8)}${cloud(1100,100,.9)}</g><g class="cl cl2" opacity=".8">${cloud(380,130,.6)}${cloud(900,60,.7)}${cloud(1500,40,.6)}</g>`}
  /* 먼 언덕, 가까운 언덕 */
  const hills=(base,amp,step,col,ph)=>{let d=`M0 ${H} L0 ${base}`;for(let x=0;x<=W+step;x+=step){const y=base-amp*(.55+.45*Math.sin(x/step*1.7+ph));d+=` Q${x-step/2} ${(y-amp*.5).toFixed(0)} ${x} ${y.toFixed(0)}`}return `<path d="${d} L${W} ${H}Z" fill="${col}"/>`};
  if(p.sea)h+=`<rect x="0" y="${HOR-60}" width="${W}" height="80" fill="${p.far}"/><path d="M0 ${HOR-40} ${Array.from({length:40},(_,i)=>`q20 -6 40 0`).join(' ')}" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`+`<g transform="translate(300 ${HOR-58})"><path d="M0 0 L30 0 L24 10 L6 10Z" fill="#F2665E"/><path d="M15 0 V-30 L32 -6Z" fill="#fff"/></g>`;
  else h+=hills(HOR-30,46,220,p.far,0);
  h+=hills(HOR-4,26,160,p.near,2);
  if(!p.space&&!p.sea&&!p.snow)for(let i=0;i<14;i++){const x=60+i*115+rnd()*40,y=HOR-6-rnd()*10;h+=`<rect x="${x-2}" y="${y}" width="4" height="12" fill="#7E5434" opacity=".7"/><circle cx="${x}" cy="${y-6}" r="${9+rnd()*5}" fill="${p.night?'#24503A':'#6DBB52'}" opacity=".85"/>`}
  if(p.snow)for(let i=0;i<10;i++){const x=80+i*160+rnd()*40,y=HOR-4;h+=`<path d="M${x} ${y-34} L${x+14} ${y} L${x-14} ${y}Z" fill="#4E8C6A"/><path d="M${x} ${y-34} L${x+6} ${y-20} L${x-6} ${y-20}Z" fill="#fff"/>`}
  /* 땅 */
  h+=`<path d="M0 ${HOR+6} Q400 ${HOR-6} 800 ${HOR+4} T${W} ${HOR+2} L${W} ${H} L0 ${H}Z" fill="url(#pkg)"/>`;
  if(p.fence){h+=`<g opacity=".95">`;for(let x=8;x<W;x+=26){if((x>520&&x<640)||(x>1180&&x<1260))continue;h+=`<path d="M${x} ${HOR+20} V${HOR-6} l6 -6 l6 6 V${HOR+20}Z" fill="${p.night?'#C9C2B8':'#FFFFFF'}" stroke="${p.night?'#8F887E':'#E6DCCF'}" stroke-width="1.5"/>`}
    h+=`<path d="M0 ${HOR} H520 M640 ${HOR} H1180 M1260 ${HOR} H${W} M0 ${HOR+12} H520 M640 ${HOR+12} H1180 M1260 ${HOR+12} H${W}" stroke="${p.night?'#B8B1A6':'#F3EBE0'}" stroke-width="4"/></g>`}
  /* 꼬불꼬불 길 */
  const pd=`M-20 ${HOR+60} C200 ${HOR+40} 380 ${HOR+190} 700 ${HOR+150} S1150 ${HOR+50} 1380 ${HOR+110} S1560 ${HOR+170} ${W+20} ${HOR+150}`;
  h+=`<path d="${pd}" stroke="${p.edge}" stroke-width="62" fill="none" stroke-linecap="round"/><path d="${pd}" stroke="${p.path}" stroke-width="52" fill="none" stroke-linecap="round"/><path d="${pd}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="2 26" opacity=".7"/>`;
  /* 풀, 작은 꽃, 조약돌 */
  const fc=['#FF9DB5','#FFE066','#fff','#B48CF0','#7EC8F5'];
  for(let i=0;i<120;i++){const x=rnd()*W,y=HOR+18+rnd()*(H-HOR-24);
    if(p.snow){h+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(4+rnd()*6).toFixed(0)}" ry="2" fill="#D7E1F0"/>`;continue}
    if(p.space){if(i%4===0)h+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2+rnd()*4).toFixed(0)}" fill="#3D2F7A" opacity=".7"/>`;continue}
    if(p.sea){if(i%3===0)h+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.6" fill="#D9B978"/>`;continue}
    const gc=p.night?'#3D7A52':'#6DB84A';h+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-3 -8 M${x.toFixed(0)} ${y.toFixed(0)} l0 -10 M${x.toFixed(0)} ${y.toFixed(0)} l3 -8" stroke="${gc}" stroke-width="2" stroke-linecap="round"/>`;
    if(i%5===0)h+=flw(+x.toFixed(0)+6,+y.toFixed(0)-4,fc[i%fc.length],2.4)}
  return `<svg class="pkbg" viewBox="0 0 ${W} ${H}" aria-hidden="true">${h}</svg>`}

/* ---------- 저장 ---------- */
let uid=Date.now()%100000;
function park(){const g=S.garden;if(!g.park||!g.park.items){g.park={inv:{tree:2,flowers:1,bench:1,swing:1},items:[
  {u:1,id:'pot',x:820,y:345},{u:2,id:'tree',x:150,y:300},{u:3,id:'tree',x:1460,y:292},{u:4,id:'swing',x:470,y:318},{u:5,id:'flowers',x:640,y:412},{u:6,id:'bench',x:1090,y:328}]}}
  return g.park}
const avail=(pk,id)=>(pk.inv[id]||0)-pk.items.filter(x=>x.id===id).length;

/* ---------- 화면 ---------- */
let cat='play',sel=null,edit=false,tryId=null,scrollX=null;
K.parkHtml=()=>{const g=S.garden,pk=park();const pal=PAL[g.bg]||PAL[''];
  const items=pk.items.map(o=>itemHtml(o)).join('');
  const tray=edit?`<div class="pktray"><div class="pkcat">${[['play','🛝 놀이기구'],['deco','🌳 꾸미기']].map(([c,l])=>`<button data-pc="${c}" class="${cat===c?'on':''}">${l}</button>`).join('')}</div>
    ${tryId?(()=>{const it=IT(tryId);return `<div class="pkbuy">${ART(it,'style="width:46px;height:40px"')}<b>${it.n}</b> · 🫘 ${it.c}<button class="btn green" id="pkb">사서 놓기</button><button class="btn ghost" id="pkx">그만</button></div>`})():''}
    <div class="row">${ITEMS.filter(x=>x.cat===cat).map(it=>{const lock=(it.need||0)>g.done.length,n=avail(pk,it.id),own=(pk.inv[it.id]||0)>0;
      return `<button class="pkit ${n>0?'have':''} ${lock?'lock':''} ${tryId===it.id?'try':''}" data-add="${it.id}"><span class="th">${ART(it)}</span><b>${it.n}</b><small>${lock?`🔒 수확 ${it.need}번`:n>0?`놓을 수 있어요 ${n}개`:own?`🫘 ${it.c} · 하나 더`:`🫘 ${it.c}`}</small></button>`}).join('')}</div>
    <div class="pkhint">눌러서 놓고, 끌어서 옮겨요. 놓은 걸 누르면 뒤집거나 넣을 수 있어요.</div></div>`:'';
  return `<div class="pk ${edit?'edit':''} ${pal.night?'night':''}"><div class="pkv" id="pkv"><div class="pkw" id="pkw">${bgSvg(g.bg)}${items}</div></div>
    <button class="pkn l" data-nav="-1" aria-label="왼쪽으로">◀</button><button class="pkn r" data-nav="1" aria-label="오른쪽으로">▶</button>
    ${edit?'':'<button class="pkfind" id="pkf">📍 콩이 찾기</button>'}<div class="pktools"><button id="pke" class="${edit?'on':''}">${edit?'✔ 다 했어':'✏️ 놀이터 꾸미기'}</button></div></div>
    <div class="pkmm" id="pkmm"><i></i><b></b></div>${tray}${edit?'':'<div class="pkhint">땅을 누르면 콩이가 걸어가요. 놀이기구를 누르면 타러 가요!</div>'}`};
function itemHtml(o){if(o.id==='pot'){const w=120,h=152;return `<div class="pki pkpot" data-u="${o.u}" style="left:${o.x-w/2}px;top:${o.y-h}px;width:${w}px;height:${h}px;z-index:${o.y|0}">${K.gardenPot?K.gardenPot():''}${K.gardenAlert&&K.gardenAlert()?'<span class="alert">✨</span>':''}</div>`}
  const it=IT(o.id);if(!it)return '';return `<div class="pki ${o.f?'fl':''}" data-u="${o.u}" style="left:${o.x-it.w/2}px;top:${o.y-it.h}px;width:${it.w}px;height:${it.h}px;z-index:${o.y|0}">${ART(it)}</div>`}

/* ---------- 콩이와 친구들 ---------- */
const kongSvg=()=>`<svg viewBox="-6 -20 132 142">${K.buddySvg('sprout',S.garden.wear).replace(/<svg[^>]*>|<\/svg>/g,'')}</svg>`;
const TALK=['콩콩! 신난다!','같이 놀자!','오늘도 공부 고마워!','여기 진짜 넓다!','나 잘 타지?','친구들이랑 노는 거 좋아!'];
const PLAYTALK={slide:'슝~ 미끄럼틀 최고!',swing:'하늘까지 날아갈 것 같아!',saw:'쿵덕쿵덕~',jump:'콩! 콩! 높이 뛰기!',spin:'빙글빙글~ 어지러워!',dig:'모래성 만들기!',swim:'첨벙첨벙! 시원해!',sit:'잠깐 쉬어 갈래~',home:'잠깐 집에 다녀올게!',dance:'분수 앞에서 춤추기!'};
K.parkBind=a=>{const pk=park(),g=S.garden;const v=a.querySelector('#pkv'),w=a.querySelector('#pkw'),root=a.querySelector('.pk');if(!v)return;
  const mm=a.querySelector('#pkmm');const upd=()=>{const i=mm.querySelector('i');i.style.left=(v.scrollLeft/W*100)+'%';i.style.width=(v.clientWidth/W*100)+'%';const k=agents[0];if(k)mm.querySelector('b').style.left=(k.x/W*100)+'%'};
  v.addEventListener('scroll',()=>{scrollX=v.scrollLeft;upd()},{passive:true});
  mm.onclick=e=>{const r=mm.getBoundingClientRect();v.scrollTo({left:(e.clientX-r.left)/r.width*W-v.clientWidth/2,behavior:'smooth'})};
  a.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{K.sfx.pick();v.scrollBy({left:+b.dataset.nav*v.clientWidth*.7,behavior:'smooth'})});
  const pop=(x,y,t)=>{const s=document.createElement('span');s.className='ppop';s.textContent=t;s.style.left=x+'px';s.style.top=y+'px';w.appendChild(s);setTimeout(()=>s.remove(),1200)};
  let bubT=null;const bubble=(ag,t,speak)=>{w.querySelectorAll('.pkbub').forEach(x=>x.remove());const b=document.createElement('div');b.className='pkbub';b.innerHTML=t;b.style.left=ag.x+'px';b.style.top=(ag.y-(ag.kind==='kong'?84:52))+'px';w.appendChild(b);clearTimeout(bubT);bubT=setTimeout(()=>b.remove(),2400);if(speak&&K.speak)K.speak(b.textContent)};
  const itemEl=o=>w.querySelector(`.pki[data-u="${o.u}"]`);
  /* 등장인물 */
  const agents=[],OCC=new Map();const alive=()=>w.isConnected;
  const mk=(kind,html,x,y,extra)=>{const el=document.createElement('div');el.className='pc '+(kind==='kong'?'':kind==='fly'?'fly':'fr2');el.innerHTML=`<span class="sh"></span><div class="pa"><div class="pf"><div class="pb">${html}</div></div></div>`;
    const ag=Object.assign({kind,el,x,y,tok:0,busy:null,speed:kind==='kong'?95:kind==='fly'?60:70},extra);place(ag,x,y,0);w.appendChild(el);agents.push(ag);return ag};
  const place=(ag,x,y,dur)=>{ag.el.style.transition=dur?`left ${dur}ms linear,top ${dur}ms linear`:'none';if(x<ag.x-2)ag.el.classList.add('left');else if(x>ag.x+2)ag.el.classList.remove('left');ag.x=x;ag.y=y;ag.el.style.left=x+'px';ag.el.style.top=y+'px';ag.el.style.zIndex=(y|0)+1};
  const kong=mk('kong',kongSvg(),(pk.items.find(x=>x.id==='pot')||{x:800}).x+90,372);
  const fr=(g.friends||[]).map(id=>K.gardenFriend&&K.gardenFriend(id)).filter(Boolean);
  fr.forEach((f,i)=>{if(f.fly)mk('fly',f.e,200+((i*397)%1200),70+((i*53)%120),{f});else mk('friend',f.e,120+((i*331)%1360),270+((i*47)%150),{f})});
  /* 움직이기 */
  const stop=ag=>{ag.tok++;if(ag.busy){const o=ag.busy;OCC.delete(o.u);const ie=itemEl(o);if(ie)ie.querySelectorAll('.on').forEach(x=>x.classList.remove('on'));ag.busy=null}
    ag.el.className=ag.el.className.replace(/\ba-\w+/g,'').replace(/\bwalk\b/,'').trim();const cs=getComputedStyle(ag.el);place(ag,parseFloat(cs.left),parseFloat(cs.top),0)};
  const walkTo=(ag,x,y,then)=>{const t=++ag.tok;const d=Math.hypot(x-ag.x,y-ag.y);const dur=Math.max(200,d/ag.speed*1000);ag.el.classList.add('walk');place(ag,x,y,dur);
    K.later(()=>{if(!alive()||t!==ag.tok)return;ag.el.classList.remove('walk');ag.el.style.zIndex=(y|0)+1;then&&then(t)},dur+30)};
  const playOn=(ag,o,talk)=>{const it=IT(o.id);if(!it||!it.act)return false;if(OCC.get(o.u)&&OCC.get(o.u)!==ag){const other=OCC.get(o.u);stop(other);later(other,400)}
    OCC.set(o.u,ag);const sp=it.sp||[0,0];const fx=o.f?-1:1;const tx=o.x+sp[0]*fx,ty=o.y+sp[1];
    walkTo(ag,tx,Math.max(o.y+4,HOR+20),t=>{if(o.f&&it.act==='slide'){ag.el.classList.add('left')}
      place(ag,tx,ty,0);ag.el.style.zIndex=(o.y|0)+2;ag.busy=o;ag.el.classList.add('a-'+it.act);if(o.f&&it.act==='slide')ag.el.querySelector('.pa').style.animationName='kslideL';
      const ie=itemEl(o);if(ie){const sel={swing:'.sw',saw:'.saw',jump:'.mat',spin:'.top'}[it.act];if(sel)ie.querySelectorAll(sel).forEach(x=>x.classList.add('on'))}
      if(talk)bubble(ag,PLAYTALK[it.act],true);
      const pops=it.pop||(it.act==='slide'?['✨']:it.act==='jump'?['⭐']:['💛']);let k=0;const pp=()=>{if(!alive()||t!==ag.tok)return;pop(ag.x+K.ri(-20,20),ag.y-60,K.pick(pops));if(++k<3)K.later(pp,1100)};K.later(pp,600);
      K.later(()=>{if(!alive()||t!==ag.tok)return;const endX=it.act==='slide'?tx+142*fx:tx;ag.el.querySelector('.pa').style.animationName='';stop(ag);
        if(it.act==='slide')place(ag,endX,o.y,0);else if(ty<o.y)place(ag,tx+(fx*it.w*.3),o.y+10,0);later(ag,K.ri(600,1600))},it.d||4000)});return true};
  const wander=ag=>{if(ag.kind==='fly'){const x=Math.max(30,Math.min(W-30,ag.x+K.ri(-350,350))),y=K.ri(50,HOR+40);const t=++ag.tok;const d=Math.hypot(x-ag.x,y-ag.y),dur=d/ag.speed*1000;place(ag,x,y,dur);K.later(()=>{if(alive()&&t===ag.tok)later(ag,K.ri(300,1500))},dur);return}
    const x=Math.max(40,Math.min(W-40,ag.x+K.ri(-360,360))),y=K.ri(YMIN+10,YMAX);walkTo(ag,x,y,()=>later(ag,K.ri(800,2600)))};
  const later=(ag,ms)=>{const t=ag.tok;K.later(()=>{if(alive()&&t===ag.tok)next(ag)},ms)};
  const next=ag=>{if(!alive()||edit)return;if(ag.kind!=='fly'&&Math.random()<(ag.kind==='kong'?.6:.4)){const free=pk.items.filter(o=>{const it=IT(o.id);return it&&it.act&&!OCC.get(o.u)});
      if(free.length){free.sort((p,q)=>Math.abs(p.x-ag.x)-Math.abs(q.x-ag.x));if(playOn(ag,K.pick(free.slice(0,3)),ag.kind==='kong'&&Math.random()<.5))return}}wander(ag)};
  pk.items.forEach(o=>delete o.occ);
  if(!edit)agents.forEach((ag,i)=>later(ag,400+i*350));
  /* 처음 보이는 곳: 콩이 근처 */
  v.scrollLeft=scrollX!=null?scrollX:Math.max(0,kong.x-v.clientWidth/2);upd();const mmT=()=>{if(!alive())return;upd();K.later(mmT,500)};mmT();
  const fb=a.querySelector('#pkf');if(fb)fb.onclick=()=>{K.sfx.pick();v.scrollTo({left:kong.x-v.clientWidth/2,behavior:'smooth'});K.later(()=>{kong.el.classList.remove('hop');void kong.el.offsetWidth;kong.el.classList.add('hop');bubble(kong,'나 여기 있어!',true)},450)};
  /* 누르기 */
  const wpos=e=>{const r=w.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  agents.forEach(ag=>ag.el.addEventListener('click',e=>{e.stopPropagation();if(edit)return;K.sfx.pick();ag.el.classList.remove('hop');void ag.el.offsetWidth;ag.el.classList.add('hop');
    if(ag.kind==='kong'){g.pets=(g.pets||0)+1;pop(ag.x,ag.y-70,'💚');bubble(ag,K.pick(TALK),true)}else{pop(ag.x,ag.y-40,'💛');bubble(ag,`${ag.f.n}: ${ag.f.say}`,true)}}));
  w.addEventListener('click',e=>{if(edit||drag.moved)return;const ie=e.target.closest('.pki');const [x,y]=wpos(e);
    if(ie){const o=pk.items.find(q=>q.u==ie.dataset.u);if(!o)return;K.sfx.pick();
      if(o.id==='pot'){stop(kong);walkTo(kong,o.x+70,o.y+12,()=>{pop(kong.x,kong.y-70,'💧');bubble(kong,K.gardenAlert&&K.gardenAlert()?'화분에 할 일이 있어! 🪴 화분 탭을 눌러 봐':'내 콩 화분이야. 쑥쑥 자라라~',true);later(kong,2500)});return}
      stop(kong);if(!playOn(kong,o,true)){walkTo(kong,o.x+(IT(o.id).w/2+20)*(x>o.x?1:-1),Math.min(YMAX,o.y+8),()=>{bubble(kong,`${IT(o.id).n} 예쁘다!`,true);later(kong,2200)})}return}
    if(y<HOR+10){pop(x,y,K.pick(['☁️','✨','🎈']));return}
    stop(kong);pop(x,y+10,'👣');walkTo(kong,x,Math.max(YMIN,Math.min(YMAX,y)),()=>{bubble(kong,'도착!',false);later(kong,2200)})});
  /* 꾸미기: 끌어서 옮기기 */
  const drag={moved:false};
  const selUI=()=>{w.querySelectorAll('.pksel').forEach(x=>x.remove());w.querySelectorAll('.pki.sel').forEach(x=>x.classList.remove('sel'));if(!edit||!sel)return;const o=pk.items.find(q=>q.u===sel);if(!o)return;
    const ie=itemEl(o);ie.classList.add('sel');const it=o.id==='pot'?{h:152}:IT(o.id);const b=document.createElement('div');b.className='pksel';b.style.left=o.x+'px';b.style.top=(o.y-it.h-4)+'px';b.style.zIndex=1001;
    b.innerHTML=(o.id==='pot'?'':'<button data-fl aria-label="뒤집기">↔️</button><button data-rm aria-label="넣기">📦</button>')+'<button data-ok aria-label="다 했어">✔️</button>';w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();const t=e.target.closest('button');if(!t)return;K.sfx.pick();
      if(t.hasAttribute('data-fl')){o.f=!o.f;ie.classList.toggle('fl',!!o.f)}
      else if(t.hasAttribute('data-rm')){pk.items=pk.items.filter(q=>q!==o);sel=null;K.save();K.render();return}
      else sel=null;K.save();selUI()}};
  if(edit){selUI();
    w.addEventListener('pointerdown',e=>{const ie=e.target.closest('.pki');if(!ie)return;const o=pk.items.find(q=>q.u==ie.dataset.u);if(!o)return;e.preventDefault();
      sel=o.u;selUI();drag.o=o;drag.ie=ie;drag.sx=e.clientX;drag.sy=e.clientY;drag.ox=o.x;drag.oy=o.y;drag.moved=false;ie.setPointerCapture(e.pointerId);ie.classList.add('drag')});
    w.addEventListener('pointermove',e=>{if(!drag.o)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;if(!drag.moved)return;
      const o=drag.o,it=o.id==='pot'?{w:120,h:152}:IT(o.id);o.x=Math.max(it.w/2,Math.min(W-it.w/2,drag.ox+dx));o.y=Math.max(HOR+26,Math.min(H-4,drag.oy+dy));
      drag.ie.style.left=(o.x-it.w/2)+'px';drag.ie.style.top=(o.y-it.h)+'px';drag.ie.style.zIndex=o.y|0;w.querySelectorAll('.pksel').forEach(x=>x.remove());
      const r=v.getBoundingClientRect();if(e.clientX>r.right-40)v.scrollLeft+=12;else if(e.clientX<r.left+40)v.scrollLeft-=12});
    const up=()=>{if(!drag.o)return;drag.ie.classList.remove('drag');if(drag.moved){K.sfx.drop();K.save()}drag.o=null;selUI();setTimeout(()=>drag.moved=false,0)};
    w.addEventListener('pointerup',up);w.addEventListener('pointercancel',up);
    w.addEventListener('click',e=>{if(!e.target.closest('.pki')&&!e.target.closest('.pksel')&&sel){sel=null;selUI()}});
    a.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{cat=b.dataset.pc;tryId=null;K.sfx.pick();K.render()});
    const addAt=id=>{const it=IT(id);const o={u:++uid,id,x:Math.max(it.w/2,Math.min(W-it.w/2,v.scrollLeft+v.clientWidth/2+K.ri(-40,40))),y:K.ri(320,400)};pk.items.push(o);sel=o.u;K.save();K.sfx.drop();K.render()};
    a.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const id=b.dataset.add,it=IT(id);
      if((it.need||0)>g.done.length){K.sfx.soft();K.toast(`콩을 ${it.need}번 수확하면 열려요 (지금 ${g.done.length}번)`);return}
      if(avail(pk,id)>0){tryId=null;addAt(id);return}tryId=id;K.sfx.pick();K.render()});
    const pb=a.querySelector('#pkb');if(pb)pb.onclick=()=>{const it=IT(tryId);if(S.beans<it.c){K.sfx.soft();K.toast(`콩알이 ${it.c-S.beans}개 모자라요. 문제를 맞혀서 모아요!`);return}
      S.beans-=it.c;pk.inv[it.id]=(pk.inv[it.id]||0)+1;tryId=null;K.confetti(40);K.sfx.good();addAt(it.id)};
    const px=a.querySelector('#pkx');if(px)px.onclick=()=>{tryId=null;K.sfx.pick();K.render()}}
  a.querySelector('#pke').onclick=()=>{edit=!edit;sel=null;tryId=null;K.sfx.pick();K.render()};
};
K.parkReset=()=>{edit=false;sel=null;tryId=null;scrollX=null};
})();
