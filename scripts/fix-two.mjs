import fs from 'fs';
const special = { CheckCircle2: 'check-circle', CircleDollarSign: 'circle-dollar-sign', Building2: 'building-2', FileEdit: 'file-pen', HelpCircle: 'help-circle', AlertTriangle: 'alert-triangle', Unlock: 'lock-open' };
const kebab = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])([0-9])/g, '$1-$2').toLowerCase();
for (const file of ['src/pages/ada-compliance-checklist-2026.astro', 'src/pages/ada-compliance-audit-pricing.astro']) {
  let src = fs.readFileSync(file, 'utf8');
  const names = ['CheckCircle2','ShieldCheck','Globe','MapPin','Store','ImageComponent','Palette','FileEdit','Keyboard','AlignLeft','AppWindow','Unlock','FileText','ClipboardCheck','Route','Code','PhoneCall','Award'];
  for (const use of names) {
    const orig = Object.keys(special).find(k => special[k] === kebab(use) || k === use);
    const key = special[use] ?? kebab(use);
    const elRe = new RegExp('<' + use + '(?=[\s/>])', 'g');
    const n = (src.match(elRe) || []).length;
    src = src.replace(elRe, `<Icon name="${key}"`);
    if (n) console.log(file, use, '->', key, 'x' + n);
  }
  src = src.replace(/className="lucide-icon"/g, 'class="lucide-icon"');
  if (!src.includes('ui/Icon.astro')) {
    const lines = src.split('\n');
    let idx = 0;
    for (let i = 0; i < lines.length; i++) if (/^import /.test(lines[i])) idx = i;
    lines.splice(idx + 1, 0, "import Icon from '../components/ui/Icon.astro';");
    src = lines.join('\n');
  }
  fs.writeFileSync(file, src);
}
