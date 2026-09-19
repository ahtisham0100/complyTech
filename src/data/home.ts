// Homepage content — single source of truth for the section components.
// Trusted HTML strings (set:html) are authored here, not user input.

export const WA_LINK = `https://wa.me/923010910933?text=${encodeURIComponent(
  'Hi, I need an ADA compliance audit for my website.'
)}`;

export const hero = {
  pill: 'IAAP-Certified Accessibility Specialists',
  line1: 'Your website has ADA violations.',
  line2: 'We find and fix every one.',
  lead: 'Over <strong>4,000 ADA website lawsuits</strong> were filed in 2024, and small businesses are the top target. Our IAAP-certified team delivers complete WCAG\u00a02.2 manual audits that automated scanners can\u2019t match.',
  trust: ['WCAG\u00a02.2 Level AA', 'VPAT included', '1-day response'],
};

// Illustrative sample data for the hero audit card (not a real client audit).
export const auditCard = {
  score: 72,
  domain: 'example-clinic.com',
  issueCount: 28,
  issues: [
    { label: 'Missing image alt text', count: 11, severity: 'critical' },
    { label: 'Low color contrast', count: 9, severity: 'critical' },
    { label: 'Unlabeled form fields', count: 5, severity: 'serious' },
    { label: 'Keyboard traps', count: 3, severity: 'serious' },
  ] as const,
  footnote: 'Full manual review by a certified specialist',
};

export const stats = {
  ariaLabel: 'ADA compliance statistics',
  items: [
    { value: '4,000+', caption: 'ADA federal lawsuits filed in 2024 alone' },
    { value: '$75K', caption: 'Average lawsuit settlement cost' },
    { value: '30\u201340%', caption: 'Issues caught by automated tools alone', highlight: true },
    { value: '82%', caption: 'Of targets are small businesses' },
  ],
};

export const services = {
  eyebrow: 'What we do',
  heading: 'ADA compliance services',
  deck: 'Comprehensive audits and remediation for businesses of every size and industry.',
  cards: [
    {
      icon: 'search',
      href: '/ada-compliance-audit-small-business',
      title: 'ADA audit for small business',
      body: 'Identify every WCAG\u00a02.2 violation with a full manual expert review — automated tools miss 60\u201370% of issues. Delivery in 5\u201314 business days.',
      badge: { label: 'Most popular', tone: 'mint' as const },
    },
    {
      icon: 'hospital',
      href: '/ada-compliance-healthcare-websites',
      title: 'Healthcare website compliance',
      body: 'Patient portals, telehealth, and appointment systems face dual liability under ADA and Section\u00a01557 of the ACA. Specialized audit coverage.',
      badge: { label: 'Healthcare', tone: 'amber' as const },
    },
    {
      icon: 'book',
      href: '/what-is-ada-compliance-websites',
      title: 'What is ADA compliance?',
      body: 'Our complete guide covers what the ADA requires, who it applies to, WCAG explained, penalties, and how to achieve compliance affordably.',
      cta: 'Read guide',
      badge: { label: 'Free guide', tone: 'neutral' as const },
    },
  ],
};

export const why = {
  eyebrow: 'Why complyTech',
  heading: 'Automated scanners miss what matters most',
  body: 'Our IAAP-certified team runs full manual screen-reader testing, keyboard navigation audits, and cognitive accessibility reviews — catching the 60\u201370% of violations automated tools skip entirely.',
  checklist: [
    'Full WCAG\u00a02.2 Level AA manual review',
    'VPAT and compliance certificate after re-test',
    'Developer-ready fix guide with code examples',
    '60-minute findings walkthrough call',
  ],
};

export const coverage = {
  label: 'Detection coverage',
  meters: [
    { label: 'Automated tools', value: '30\u201340%', percent: 37, tone: 'warn' as const },
    { label: 'Manual expert audit', value: '100%', percent: 100, tone: 'accent' as const },
  ],
  source: {
    text: 'Source: Deque Systems accessibility research. Automated tools reliably detect only a third of WCAG success criteria.',
  },
};

export const process = {
  heading: 'From scan to certified in three steps',
  steps: [
    {
      title: 'Free scan & quote',
      body: 'Send us your URL. We return a snapshot of critical issues and a fixed-price quote within one business day.',
    },
    {
      title: 'Manual expert audit',
      body: 'A certified specialist tests with screen readers and keyboard navigation, then delivers a developer-ready fix guide.',
    },
    {
      title: 'Re-test & certify',
      body: 'After fixes, we re-test and issue your VPAT and compliance certificate — proof of conformance you can show.',
    },
  ],
};

export const faq = {
  heading: 'Answers before you ask',
  items: [
    {
      q: 'Does the ADA apply to my website?',
      a: 'Courts increasingly treat websites as \u201cplaces of public accommodation\u201d under Title III. If you sell to or serve the public in the U.S., you are a potential target — regardless of company size.',
    },
    {
      q: 'Aren\u2019t accessibility overlays enough?',
      a: 'No. Overlay widgets have been named in hundreds of lawsuits and cannot fix the underlying code. Genuine conformance requires remediating the site itself.',
    },
    {
      q: 'How long does an audit take?',
      a: 'Most small-business audits are delivered in 5\u201314 business days, depending on the number of unique page templates and interactive flows.',
    },
    {
      q: 'What do I receive at the end?',
      a: 'A prioritized findings report, a developer-ready fix guide with code examples, a VPAT, and — after re-test — a compliance certificate.',
    },
  ],
};

export const cta = {
  heading: 'Find out what a lawsuit already knows about your site.',
  deck: 'Get a free accessibility scan and a fixed-price quote within one business day. No overlays, no obligation.',
};
