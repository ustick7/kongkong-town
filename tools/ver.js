/* 배포 전에 실행: node tools/ver.js
   version.json의 v(버전)를 지금 시각으로 바꾸고, index.html의 파일 목록(인터넷 끊겼을 때 쓰는 예비 목록)도 맞춰요.
   폰은 version.json을 항상 새로 받아서 ?v=버전 을 붙여 파일을 불러오니, 예전 파일이 캐시에 남아도 새 버전이 떠요. */
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
const vj=path.join(root,'version.json');const j=JSON.parse(fs.readFileSync(vj,'utf8'));
for(const f of j.files)if(!fs.existsSync(path.join(root,f)))throw new Error('없는 파일: '+f);
const d=new Date();j.v=d.toISOString().replace(/[-:T]/g,'').slice(0,12);
fs.writeFileSync(vj,JSON.stringify(j,null,1)+'\n');
const ih=path.join(root,'index.html');let h=fs.readFileSync(ih,'utf8');
h=h.replace(/\/\*FILES\*\/[\s\S]*?\/\*END\*\//,'/*FILES*/'+JSON.stringify(j.files)+'/*END*/').replace(/\/\*VER\*\/'[^']*'/,"/*VER*/'"+j.v+"'");
fs.writeFileSync(ih,h);console.log('version',j.v,j.files.length,'files');
