import fs from 'fs';
const files = fs.readdirSync('src/pages').filter(f => f.endsWith('.astro'));
for (const file of files) {
  const p = 'src/pages/' + file;
  let src = fs.readFileSync(p, 'utf8');
  if (src.includes('WA_LINK') && !src.includes("from '../data/home'")) {
    const lines = src.split('\n');
    let idx = 0;
    for (let i = 0; i < lines.length; i++) if (/^import /.test(lines[i])) idx = i;
    lines.splice(idx + 1, 0, "import { WA_LINK } from '../data/home';");
    fs.writeFileSync(p, lines.join('\n'));
    console.log('fixed', file);
  }
}
