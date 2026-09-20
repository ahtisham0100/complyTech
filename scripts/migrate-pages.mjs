import fs from 'fs';

const special = {
  CheckCircle2: 'check-circle', CircleDollarSign: 'circle-dollar-sign', Building2: 'building-2',
  FileEdit: 'file-pen', HelpCircle: 'help-circle', AlertTriangle: 'alert-triangle',
  Unlock: 'lock-open', Quote: 'quote', Star: 'star', Zap: 'zap',
};
const kebab = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])([0-9])/g, '$1-$2').toLowerCase();

const files = fs.readdirSync('src/pages').filter(f => f.endsWith('.astro'))
  .filter(f => !['index.astro', 'services.astro', 'ada-compliance-audit-small-business.astro'].includes(f));

const ACTIONS = `    <Button href={WA_LINK} variant="on-dark-solid" target="_blank" rel="noopener noreferrer" slot="actions">
      <Icon name="whatsapp" size={18} slot="leading" />
      Get free quote on WhatsApp
    </Button>`;

const DEFAULT_HEADING = 'Get Your Free ADA Compliance Audit Quote';
const DEFAULT_DECK = 'Protecting your business from ADA liability starts with understanding your risk. Our IAAP-certified specialists deliver a complete WCAG\u00a02.2 audit with a clear remediation roadmap \u2014 so you know exactly what to fix and in what order.';

for (const file of files) {
  const p = 'src/pages/' + file;
  let src = fs.readFileSync(p, 'utf8');
  const notes = [];
  const need = new Set();

  // --- lucide-react import -> Icon usages ---
  const lucideRe = /import \{([^}]+)\} from 'lucide-react';\n/;
  const lm = src.match(lucideRe);
  if (lm) {
    const names = lm[1].split(',').map(s => s.trim()).filter(Boolean).map(entry => {
      const [orig, alias] = entry.split(/\s+as\s+/);
      return { orig: orig.trim(), use: (alias || orig).trim() };
    });
    for (const { orig, use } of names) {
      const key = special[orig] ?? kebab(orig);
      const elRe = new RegExp('<' + use + '(?=[\\s/>])', 'g');
      const count = (src.match(elRe) || []).length;
      src = src.replace(elRe, `<Icon name="${key}"`);
      if (count) notes.push(`${use}->${key} x${count}`);
    }
    src = src.replace(lucideRe, '');
    need.add('Icon');
  }
  src = src.replace(/className="lucide-icon"/g, 'class="lucide-icon"');
  src = src.replace(/ style=\{\{ fontSize: '1rem' \}\}/g, '');

  // --- layout component swaps ---
  src = src.replace(/import Nav from '\.\.\/components\/Nav\.astro';/, () => { need.add('SiteHeader'); return `import SiteHeader from '../components/sections/SiteHeader.astro';`; });
  src = src.replace(/import Footer from '\.\.\/components\/Footer\.astro';/, () => { need.add('SiteFooter'); return `import SiteFooter from '../components/sections/SiteFooter.astro';`; });
  src = src.replace(/import CTASection from '\.\.\/components\/CTASection\.astro';/, () => { need.add('CtaPanel'); need.add('Button'); need.add('WA_LINK'); return `import CtaPanel from '../components/sections/CtaPanel.astro';`; });
  src = src.replace(/import FAQAccordion from '\.\.\/components\/FAQAccordion\.tsx';/, () => { need.add('FaqAccordion'); return `import FaqAccordion from '../components/ui/FaqAccordion.astro';`; });

  src = src.replace(/<Nav slot="nav" \/>/, '<SiteHeader slot="nav" />');
  src = src.replace(/<Footer slot="footer" \/>/, '<SiteFooter slot="footer" />');
  src = src.replace(/<FAQAccordion items={(.*?)} client:(load|visible) \/>/g, '<FaqAccordion items={$1} />');

  // --- ds prop ---
  if (!/<BaseLayout[^>]*\n\s*ds\b/.test(src) && !/<BaseLayout\s+ds/.test(src)) {
    src = src.replace(/<BaseLayout(\s*\n)/, '<BaseLayout\n  ds$1');
    notes.push('ds');
  }

  // --- CTASection -> CtaPanel ---
  const ctaRe = /<CTASection\b([\s\S]*?)\/>/;
  if (ctaRe.test(src)) {
    src = src.replace(ctaRe, (m, attrs) => {
      const heading = attrs.match(/heading="((?:[^"\\]|\\.)*)"/);
      const subtext = attrs.match(/subtext="((?:[^"\\]|\\.)*)"/);
      const h = heading ? heading[1] : DEFAULT_HEADING;
      const d = subtext ? subtext[1] : DEFAULT_DECK;
      return `<CtaPanel id="cta" heading="${h}" deck="${d}">\n${ACTIONS}\n  </CtaPanel>`;
    });
    notes.push('CTA->CtaPanel');
  }

  // --- add missing imports after the last import line ---
  const importAdd = [];
  if (need.has('SiteHeader') && !src.includes('sections/SiteHeader.astro')) importAdd.push(`import SiteHeader from '../components/sections/SiteHeader.astro';`);
  if (need.has('SiteFooter') && !src.includes('sections/SiteFooter.astro')) importAdd.push(`import SiteFooter from '../components/sections/SiteFooter.astro';`);
  if (need.has('CtaPanel') && !src.includes('sections/CtaPanel.astro')) importAdd.push(`import CtaPanel from '../components/sections/CtaPanel.astro';`);
  if (need.has('FaqAccordion') && !src.includes('ui/FaqAccordion.astro')) importAdd.push(`import FaqAccordion from '../components/ui/FaqAccordion.astro';`);
  if (need.has('Button') && !src.includes('ui/Button.astro')) importAdd.push(`import Button from '../components/ui/Button.astro';`);
  if ((need.has('Icon') || src.includes('<Icon name=')) && !src.includes('ui/Icon.astro')) importAdd.push(`import Icon from '../components/ui/Icon.astro';`);
  if (need.has('WA_LINK') && !src.includes('WA_LINK') && !src.includes("from '../data/home'")) importAdd.push(`import { WA_LINK } from '../data/home';`);
  if (importAdd.length) {
    const lines = src.split('\n');
    let idx = 0;
    for (let i = 0; i < lines.length; i++) if (/^import /.test(lines[i])) idx = i;
    lines.splice(idx + 1, 0, ...importAdd);
    src = lines.join('\n');
  }

  fs.writeFileSync(p, src);
  console.log(file, '->', notes.join(', ') || '(no changes)');
}
