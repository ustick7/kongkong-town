/* 단계별 권장 나이. 6=6세, 7=7세, 8=초1, 9=초2 (만 나이가 아니라 한국 나이 기준이에요)
   새 단계는 level에 age:7 처럼 직접 적어도 돼요. 여기 적은 값은 적혀 있지 않은 단계에만 들어가요. */
'use strict';
(()=>{
const A={
 'think/pattern':[6,7,7,7],'think/balance':[6,6,7,7,8,8],'think/numbers':[6,7,7],'think/mirror':[6,7,8],'think/blocks':[7,8,7],'think/logic':[7,7,8],
 'math/count':[6,6,7],'math/add':[6,7,8],'math/sub':[6,7,8],'math/order':[6,6,7,8],'math/ten':[7,7],
 'eng/listen':[6,6,6,7,6],'eng/abc':[7,6,7],'eng/spell':[7,7,8],
 'kor/sound':[6],'kor/letter':[7,7,7],'kor/word':[7,7],
 'dict/blocks':[7,7,8,8],'dict/hand':[7,7,8,8,8],'dict/space':[8],
 'econ/coin':[6,7,7,8],'econ/shop':[7,7,8,8,9],'econ/smart':[6,7,7],
 'way/lr':[6,7,7],'way/pos':[6,6],'way/path':[6,7,8],
 'clock/read':[7,7,8],'clock/set':[7,7,8],'clock/day':[6,8],
 'hero/song':[7,7],'hero/who':[7,7,7,7,7,7],'hero/time':[8],
};
K.AGE_NAME=a=>a<=7?a+'세':'초'+(a-7);
K.subjects.forEach(s=>s.areas.forEach(ar=>{const list=A[s.id+'/'+ar.id]||[];ar.levels.forEach((l,i)=>{if(l.age==null&&list[i]!=null)l.age=list[i]})}));
K.applyAges=()=>K.subjects.forEach(s=>s.areas.forEach(ar=>{const list=A[s.id+'/'+ar.id]||[];ar.levels.forEach((l,i)=>{if(l.age==null&&list[i]!=null)l.age=list[i]})}));
})();
