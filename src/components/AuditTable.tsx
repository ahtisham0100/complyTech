import { useState } from 'react';

interface AuditRow {
  component: string;
  automated: string;
  manual: string;
  automatedClass?: string;
}

const auditData: AuditRow[] = [
  { component: 'Color contrast failures', automated: '✅ Detected', manual: '✅ Includes edge cases', automatedClass: 'pass' },
  { component: 'Missing image alt text', automated: '✅ Detected', manual: '✅ Checks contextual accuracy', automatedClass: 'pass' },
  { component: 'Form label errors', automated: '✅ Detected', manual: '✅ Full ARIA validation', automatedClass: 'pass' },
  { component: 'Keyboard navigation', automated: '⚠️ Partial only', manual: '✅ Full screen reader walk', automatedClass: 'partial' },
  { component: 'Focus order & trapping', automated: '❌ Not detected', manual: '✅ Fully tested', automatedClass: 'fail' },
  { component: 'Dynamic content (modals)', automated: '❌ Not detected', manual: '✅ Fully tested', automatedClass: 'fail' },
  { component: 'PDF document accessibility', automated: '❌ Not detected', manual: '✅ Full document audit', automatedClass: 'fail' },
  { component: 'Video captioning', automated: '❌ Not detected', manual: '✅ Synchronized captions verified', automatedClass: 'fail' },
  { component: 'Cognitive accessibility', automated: '❌ Not detected', manual: '✅ Expert review', automatedClass: 'fail' },
];

export default function AuditTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="audit-table-wrapper">
      {/* Desktop Table */}
      <div className="audit-table-desktop">
        <table className="audit-table" aria-label="Audit component comparison: automated vs manual">
          <thead>
            <tr>
              <th scope="col">Audit Component</th>
              <th scope="col">
                <span className="th-label automated-label">🤖 Automated Tool</span>
                <span className="th-sub">Detects ~30–40%</span>
              </th>
              <th scope="col">
                <span className="th-label manual-label">👤 Manual Expert Review</span>
                <span className="th-sub">Detects 100%</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((row, i) => (
              <tr
                key={i}
                className={`audit-row ${hoveredRow === i ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="component-cell">{row.component}</td>
                <td className={`status-cell status-${row.automatedClass}`}>{row.automated}</td>
                <td className="status-cell status-pass manual-cell">{row.manual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="audit-cards-mobile" aria-label="Audit components list">
        {auditData.map((row, i) => (
          <div key={i} className="audit-card">
            <div className="audit-card-title">{row.component}</div>
            <div className="audit-card-row">
              <span className="audit-card-label">🤖 Automated</span>
              <span className={`audit-card-value status-${row.automatedClass}`}>{row.automated}</span>
            </div>
            <div className="audit-card-row">
              <span className="audit-card-label">👤 Manual</span>
              <span className="audit-card-value status-pass manual-cell">{row.manual}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .audit-table-wrapper { margin: 28px 0; }
        .audit-table-desktop { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(15,15,15,0.08); }
        .audit-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          background: #fff;
        }
        .audit-table thead tr {
          background: #1a3a2a;
        }
        .audit-table th {
          padding: 14px 18px;
          text-align: left;
          color: #fff;
          font-weight: 600;
          font-size: 0.82rem;
          vertical-align: top;
        }
        .th-label { display: block; margin-bottom: 2px; }
        .th-sub { font-size: 0.73rem; opacity: 0.65; font-weight: 400; }
        .automated-label { color: #fbbf24; }
        .manual-label { color: #7ed4a0; }
        .audit-row { transition: background 0.18s; }
        .audit-row td { padding: 12px 18px; border-bottom: 1px solid rgba(15,15,15,0.06); vertical-align: middle; }
        .audit-row:last-child td { border-bottom: none; }
        .audit-row.hovered td { background: #e8f2ec; }
        .component-cell { color: #3d3d3a; font-weight: 500; }
        .status-cell { font-size: 0.88rem; }
        .status-pass { color: #1a3a2a; font-weight: 500; }
        .status-partial { color: #b45309; font-weight: 500; }
        .status-fail { color: #c0392b; font-weight: 500; }
        .manual-cell { background: #f0f8f3 !important; }
        .audit-cards-mobile { display: none; flex-direction: column; gap: 12px; }
        .audit-card {
          background: #fff;
          border: 1px solid rgba(15,15,15,0.08);
          border-radius: 10px;
          padding: 16px;
          border-left: 3px solid #1a3a2a;
        }
        .audit-card-title { font-weight: 600; color: #0f0f0f; font-size: 0.92rem; margin-bottom: 10px; }
        .audit-card-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
        .audit-card-label { font-size: 0.78rem; color: #737370; min-width: 90px; }
        .audit-card-value { font-size: 0.85rem; font-weight: 500; text-align: right; }
        @media (max-width: 640px) {
          .audit-table-desktop { display: none; }
          .audit-cards-mobile { display: flex; }
        }
      `}</style>
    </div>
  );
}
