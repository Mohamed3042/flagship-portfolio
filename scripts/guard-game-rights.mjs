import fs from 'node:fs';
import path from 'node:path';
const sources=JSON.parse(fs.readFileSync('docs/deep-field/r05/sources.json','utf8'));
if(sources.length!==4 || sources.some(s=>typeof s.raw_allowed!=='boolean'))throw Error('Four explicit game rights records required');
export function guard(html,rows=sources){
  for(const row of rows){
    const section=html.match(new RegExp(`<article\\b[^>]*data-chapter="game-${row.key}"[\\s\\S]*?</article>`,'g'))??[];
    if(!row.raw_allowed && section.some(s=>/<video\b/i.test(s)))throw Error(`Raw game video refused: ${row.key}`);
  }
}
if(process.argv.includes('--self-test')){
  let red=false;try{guard('<article data-chapter="game-war-strikes"><video src="planted.mp4"></video></article>');}catch{red=true;}
  if(!red)throw Error('Rights negative control did not fail');console.log('Rights guard: planted raw video rejected.');
}else{
  const out=process.argv[2]??'dist';
  const visit=p=>{for(const ent of fs.readdirSync(p,{withFileTypes:true})){const file=path.join(p,ent.name);if(ent.isDirectory())visit(file);else if(file.endsWith('.html'))guard(fs.readFileSync(file,'utf8'));}};
  visit(out);console.log('Game rights guard: holograms only.');
}
