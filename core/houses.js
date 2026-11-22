/* 콩콩마을 집 그림: 과목마다 다른 모양 (전구집, 블록집, 연필집, 돼지 저금통집, 등대, 시계탑, 한옥…) */
'use strict';
(()=>{
const W='class="win"';/* 창문: 밤에는 불이 켜져요 */
const door=(x,y,w,h,c,knob='#FFE27A')=>`<path d="M${x} ${y+h} V${y+w/2} a${w/2} ${w/2} 0 0 1 ${w} 0 V${y+h}Z" fill="${c}"/><circle cx="${x+w*.75}" cy="${y+h*.62}" r="1.8" fill="${knob}"/>`;
const T=(x,y,t,s=12,c='#fff')=>`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" style="font-family:var(--f-disp)" fill="${c}">${t}</text>`;
const H={
/* 생각콩: 전구 지붕 집 */
think:`<g class="glow"><circle cx="60" cy="16" r="15" fill="#FFE27A" opacity=".35"/><path d="M60 4 a10 10 0 0 1 6 18 v4 h-12 v-4 A10 10 0 0 1 60 4Z" fill="#FFD43B" stroke="#E0A800" stroke-width="1.5"/><rect x="54.5" y="26" width="11" height="5" rx="2" fill="#B9B2A6"/></g>
 <path d="M14 60 Q60 4 106 60Z" fill="#FF8A3D"/><path d="M30 46 Q60 18 90 46" stroke="#FFB37A" stroke-width="5" fill="none" stroke-linecap="round"/>
 <circle cx="36" cy="44" r="4" fill="#FFD3A8"/><circle cx="84" cy="44" r="4" fill="#FFD3A8"/>
 <rect x="22" y="58" width="76" height="54" rx="10" fill="#FFF1DE"/><rect x="22" y="58" width="76" height="8" fill="#FFE0BF"/>
 <circle cx="40" cy="78" r="9" ${W} fill="#BFE3FF" stroke="#FF8A3D" stroke-width="3"/><circle cx="80" cy="78" r="9" ${W} fill="#BFE3FF" stroke="#FF8A3D" stroke-width="3"/>
 <path d="M40 69 v18 M31 78 h18 M80 69 v18 M71 78 h18" stroke="#FF8A3D" stroke-width="1.5"/>${door(51,86,18,26,'#D9672A')}`,
/* 셈콩: 숫자 블록 집 */
math:`<path d="M30 46 L60 14 L90 46Z" fill="#FF8A3D"/><path d="M60 14 L90 46 H76Z" fill="#E8742A"/>${T(60,40,'+',16)}
 <rect x="26" y="46" width="34" height="32" rx="4" fill="#4CB963"/>${T(43,68,'3',18)}<rect x="60" y="46" width="34" height="32" rx="4" fill="#9B7BE0"/>${T(77,68,'4',18)}
 <rect x="10" y="78" width="34" height="34" rx="4" fill="#4A9FE8"/>${T(27,101,'1',18)}<rect x="44" y="78" width="32" height="34" rx="4" fill="#FFC845"/>${door(52,88,16,24,'#E8A200','#fff')}
 <rect x="76" y="78" width="34" height="34" rx="4" fill="#F2665E"/>${T(93,101,'2',18)}
 <path d="M10 82 h34 M76 82 h34 M26 50 h68" stroke="#fff" stroke-width="2" opacity=".35"/>`,
/* 영콩: ABC 깃발 탑 */
eng:`<path d="M60 4 v12" stroke="#6B4FB0" stroke-width="2"/><path class="flag" d="M60 4 l14 4 l-14 4Z" fill="#FF6F91"/>
 <path d="M24 48 L60 14 L96 48Z" fill="#9B7BE0"/><path d="M60 14 L96 48 H82Z" fill="#8462CF"/>
 <rect x="28" y="46" width="64" height="66" rx="6" fill="#F1E9FF"/>
 <path d="M22 54 Q42 64 60 54 Q78 64 98 54" stroke="#6B4FB0" stroke-width="1.5" fill="none"/>
 <path d="M30 57 l6 10 l6 -9Z" fill="#FF6F91"/><path d="M50 59 l6 10 l6 -10Z" fill="#FFC845"/><path d="M70 58 l6 10 l6 -10Z" fill="#4A9FE8"/>
 ${T(36,65,'A',7)}${T(56,67,'B',7)}${T(76,66,'C',7)}
 <path d="M34 92 v-12 a8 8 0 0 1 16 0 v12Z" ${W} fill="#D9CBFF"/><path d="M70 92 v-12 a8 8 0 0 1 16 0 v12Z" ${W} fill="#D9CBFF"/>${door(51,88,18,24,'#7B5CC4')}`,
/* 말콩: 펼친 책 지붕 집 */
kor:`<path d="M60 26 Q36 12 8 22 L8 60 Q36 50 60 62 Q84 50 112 60 L112 22 Q84 12 60 26Z" fill="#3E9A52"/>
 <path d="M60 28 Q38 16 12 24 L12 56 Q38 48 60 58Z" fill="#fff"/><path d="M60 28 Q82 16 108 24 L108 56 Q82 48 60 58Z" fill="#F4FFF0"/>
 <path d="M18 32 Q36 26 54 34 M18 40 Q36 34 54 42 M66 34 Q84 26 102 32 M66 42 Q84 34 102 40" stroke="#A8D8B0" stroke-width="2" fill="none"/>
 <path d="M60 28 V58" stroke="#3E9A52" stroke-width="2"/>
 <rect x="20" y="58" width="80" height="54" rx="8" fill="#E8F7E0"/>
 <rect x="28" y="68" width="18" height="18" rx="4" ${W} fill="#C9EFC0"/>${T(37,82,'가',11,'#3E9A52')}<rect x="74" y="68" width="18" height="18" rx="4" ${W} fill="#C9EFC0"/>${T(83,82,'나',11,'#3E9A52')}
 ${door(50,86,20,26,'#4CB963')}<path class="bookmark" d="M92 58 v16 l4 -4 l4 4 v-16Z" fill="#F2665E"/>`,
/* 받콩: 연필 집 */
dict:`<path d="M32 44 L60 6 L88 44Z" fill="#F6D3A8"/><path d="M52 17 L60 6 L68 17Z" fill="#3D2E28"/><path d="M32 44 q7 -6 14 0 q7 -6 14 0 q7 -6 14 0 q7 -6 14 0" fill="#F6D3A8" stroke="#E7B985" stroke-width="1"/>
 <rect x="32" y="44" width="56" height="68" fill="#FF9DB5"/><rect x="42" y="44" width="10" height="68" fill="#FFB8C9"/><rect x="68" y="44" width="10" height="68" fill="#FFB8C9"/>
 <circle cx="47" cy="62" r="7" ${W} fill="#FFF1F5" stroke="#E0708F" stroke-width="2"/><circle cx="73" cy="62" r="7" ${W} fill="#FFF1F5" stroke="#E0708F" stroke-width="2"/>
 ${door(51,86,18,26,'#D9567B')}
 <rect x="88" y="72" width="24" height="40" rx="3" fill="#fff"/><path d="M88 80 h24 M88 88 h24 M88 96 h24 M88 104 h24" stroke="#9CC7F0" stroke-width="1.5"/><path d="M94 72 v40" stroke="#F2A0A0" stroke-width="1.5"/>
 <rect x="8" y="96" width="24" height="16" rx="4" fill="#FFC0CF"/><rect x="8" y="92" width="24" height="6" rx="2" fill="#C9C3B8"/>`,
/* 돈콩: 돼지 저금통 집 */
econ:`<g class="coin"><circle cx="58" cy="18" r="10" fill="#FFC845" stroke="#E0A800" stroke-width="2"/>${T(58,23,'₩',11,'#B07A00')}</g>
 <path d="M30 44 l-6 -16 l18 9Z M84 40 l10 -14 l2 18Z" fill="#F7A1B4"/>
 <ellipse cx="60" cy="74" rx="50" ry="36" fill="#FFB8C8"/><ellipse cx="54" cy="64" rx="34" ry="18" fill="#FFCAD6"/>
 <rect x="50" y="36" width="18" height="4" rx="2" fill="#D97A92"/>
 <ellipse cx="106" cy="74" rx="9" ry="11" fill="#F79AB0"/><ellipse cx="104" cy="70" rx="2" ry="3" fill="#C96A82"/><ellipse cx="104" cy="78" rx="2" ry="3" fill="#C96A82"/>
 <circle cx="88" cy="58" r="3.5" fill="#3D2E28"/><path d="M80 66 q4 3 8 0" stroke="#3D2E28" stroke-width="1.5" fill="none"/>
 <rect x="20" y="104" width="12" height="10" rx="3" fill="#F79AB0"/><rect x="84" y="104" width="12" height="10" rx="3" fill="#F79AB0"/>
 <path d="M10 70 q-8 -4 -4 -10 q4 4 0 8" stroke="#F79AB0" stroke-width="3" fill="none"/>
 <circle cx="34" cy="76" r="8" ${W} fill="#FFF1A8" stroke="#E0A800" stroke-width="2"/>${door(48,82,20,24,'#E8A200','#fff')}`,
/* 길콩: 등대 */
way:`<path class="beam" d="M60 26 L4 10 L4 40Z M60 26 L116 10 L116 40Z" fill="#FFF3A8" opacity=".45"/>
 <path d="M42 22 L60 6 L78 22Z" fill="#2E8E9B"/><rect x="46" y="20" width="28" height="12" rx="2" class="win glow" fill="#FFE27A" stroke="#2E8E9B" stroke-width="2"/>
 <rect x="42" y="31" width="36" height="4" rx="2" fill="#2E8E9B"/>
 <path d="M47 35 L73 35 L80 112 L40 112Z" fill="#fff"/><path d="M45.6 50 L74.4 50 L76 66 L44 66Z M43.6 82 L76.4 82 L78 98 L42 98Z" fill="#3FA7B5"/>
 <circle cx="60" cy="58" r="4" ${W} fill="#BFE9EE"/>${door(53,96,14,16,'#2E8E9B')}
 <path d="M6 112 V90 L22 78 L38 90 V112Z" fill="#E6F6F7"/><path d="M2 92 L22 74 L42 92" stroke="#3FA7B5" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <rect x="16" y="94" width="12" height="10" rx="2" ${W} fill="#BFE9EE"/>
 <g transform="translate(100 98)"><circle r="10" fill="#fff" stroke="#3FA7B5" stroke-width="2"/><path d="M0 -8 L3 0 L0 8 L-3 0Z" fill="#F2665E"/><path d="M0 8 L3 0 L-3 0Z" fill="#3FA7B5"/></g>`,
/* 시콩: 시계탑 집 */
clock:`<path d="M60 2 v6" stroke="#B5476A" stroke-width="2"/><path d="M54 14 a6 6 0 0 1 12 0 v4 h-12Z" fill="#FFC845"/>
 <path d="M16 60 L60 16 L104 60Z" fill="#E46A8F"/><path d="M60 16 L104 60 H88Z" fill="#CF5579"/>
 <circle cx="60" cy="44" r="14" fill="#fff" stroke="#B5476A" stroke-width="3"/>
 ${[0,90,180,270].map(a=>`<circle cx="${60+11*Math.sin(a*Math.PI/180)}" cy="${44-11*Math.cos(a*Math.PI/180)}" r="1.3" fill="#B5476A"/>`).join('')}
 <path d="M60 44 V36" stroke="#3D2E28" stroke-width="2.5" stroke-linecap="round"/><path class="hand" d="M60 44 V33" stroke="#F2665E" stroke-width="1.8" stroke-linecap="round"/><circle cx="60" cy="44" r="1.8" fill="#3D2E28"/>
 <rect x="24" y="60" width="72" height="52" rx="6" fill="#FFEAF1"/>
 <rect x="30" y="70" width="16" height="16" rx="3" ${W} fill="#FFD0DE"/><rect x="74" y="70" width="16" height="16" rx="3" ${W} fill="#FFD0DE"/><path d="M38 70 v16 M30 78 h16 M82 70 v16 M74 78 h16" stroke="#fff" stroke-width="1.5"/>
 ${door(50,86,20,26,'#C2486F')}`,
/* 위콩: 한옥 */
hero:`<path d="M10 52 Q22 46 26 34 L94 34 Q98 46 110 52 Q86 46 60 47 Q34 46 10 52Z" fill="#59607A"/>
 <path d="M24 34 Q60 28 96 34" stroke="#3F4559" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M20 36 q-6 -6 -4 -12 M100 36 q6 -6 4 -12" stroke="#3F4559" stroke-width="3" fill="none" stroke-linecap="round"/>
 <path d="M30 40 h60 M26 44 h68" stroke="#7B8399" stroke-width="1.5"/>
 <rect x="20" y="50" width="80" height="50" fill="#F7EEDC"/><rect x="18" y="50" width="6" height="50" fill="#8B5A2B"/><rect x="96" y="50" width="6" height="50" fill="#8B5A2B"/><rect x="18" y="50" width="84" height="5" fill="#A8703C"/>
 <rect x="28" y="62" width="20" height="22" fill="#FFF8EA" ${W} stroke="#8B5A2B" stroke-width="2"/><path d="M38 62 v22 M28 69 h20 M28 77 h20" stroke="#8B5A2B" stroke-width="1"/>
 <rect x="72" y="62" width="20" height="22" fill="#FFF8EA" ${W} stroke="#8B5A2B" stroke-width="2"/><path d="M82 62 v22 M72 69 h20 M72 77 h20" stroke="#8B5A2B" stroke-width="1"/>
 <rect x="51" y="62" width="18" height="38" fill="#C0623B"/><path d="M60 62 v38 M51 74 h18 M51 86 h18" stroke="#8B3F22" stroke-width="1.2"/>
 <rect x="10" y="100" width="100" height="12" rx="2" fill="#C9B79C"/><path d="M10 106 h100" stroke="#B3A084" stroke-width="1"/>
 <circle cx="104" cy="30" r="5" fill="#F28C38"/><path d="M104 25 v-3" stroke="#5AA845" stroke-width="2"/>`,
};
K.HOUSE=id=>H[id]?`<svg class="hz" viewBox="0 0 120 116" aria-hidden="true"><ellipse cx="60" cy="113" rx="52" ry="4" fill="rgba(0,0,0,.12)"/>${H[id]}</svg>`:'';
K.css(`
.house .hz{width:100%;max-width:150px;height:auto;display:block;overflow:visible;filter:drop-shadow(0 4px 0 rgba(61,46,40,.12))}
.house .nm2{margin-top:2px;font-family:var(--f-disp);font-size:17px;color:#fff;background:var(--c);padding:2px 12px;border-radius:999px;box-shadow:0 3px 0 rgba(0,0,0,.15)}
.house .sub{margin-top:2px}
.hz .glow{animation:hglow 2.4s ease-in-out infinite}@keyframes hglow{50%{opacity:.75}}
.hz .flag{transform-origin:60px 8px;animation:hflag 1.6s ease-in-out infinite}@keyframes hflag{50%{transform:scaleX(.7)}}
.hz .coin{animation:hcoin 2.2s ease-in-out infinite}@keyframes hcoin{0%,100%{transform:translateY(-4px)}50%{transform:translateY(6px)}}
.hz .hand{transform-origin:60px 44px;animation:hhand 6s linear infinite}@keyframes hhand{to{transform:rotate(360deg)}}
.hz .beam{transform-origin:60px 26px;animation:hbeam 3s ease-in-out infinite}@keyframes hbeam{50%{opacity:.1}}
.hz .bookmark{animation:hbm 2s ease-in-out infinite;transform-origin:96px 58px}@keyframes hbm{50%{transform:rotate(6deg)}}
.house:hover .hz{transform:translateY(-3px)}.house .hz{transition:transform .15s}
:root[data-theme="dark"] .hz .win{fill:#FFD966;filter:drop-shadow(0 0 4px #FFD966)}
.village{background:radial-gradient(120% 60% at 15% 46%,rgba(255,255,255,.0) 0 40%,transparent 41%),
  radial-gradient(70% 22% at 20% 47%,var(--hill1,#8FD873) 0 98%,transparent 100%),radial-gradient(80% 24% at 85% 48%,var(--hill2,#7CC95E) 0 98%,transparent 100%),
  linear-gradient(var(--sky-top),var(--sky-bot) 45%,var(--ground-top) 45%,var(--ground-bot))}
.village .houses{z-index:1}
.vdeco span{position:absolute;font-size:26px;pointer-events:none;z-index:0}
.vdeco .vbf{animation:bfly 9s ease-in-out infinite}
@keyframes bfly{0%{transform:translate(0,0)}25%{transform:translate(40px,-20px) rotate(10deg)}50%{transform:translate(90px,10px)}75%{transform:translate(30px,30px) rotate(-10deg)}100%{transform:translate(0,0)}}
.village .path{position:absolute;left:50%;bottom:0;width:60px;height:55%;transform:translateX(-50%);background:linear-gradient(transparent,rgba(232,206,160,.6));clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);z-index:0}
:root[data-theme="dark"] .village{--hill1:#2E4F37;--hill2:#27452F}
@media (prefers-reduced-motion:reduce){.hz *,.vdeco *{animation:none!important}}
`);
})();
