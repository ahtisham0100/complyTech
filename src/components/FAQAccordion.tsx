import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <div className="faq-accordion" role="list">
      {items.map((item, i) => (
        <div
          key={i}
          className={`faq-item ${open === i ? 'open' : ''}`}
          role="listitem"
        >
          <button
            className="faq-question"
            onClick={() => toggle(i)}
            aria-expanded={open === i}
            aria-controls={`faq-answer-${i}`}
            id={`faq-btn-${i}`}
          >
            <span className="faq-q-text">{item.question}</span>
            <span className="faq-icon material-symbols-outlined" aria-hidden="true">
              {open === i ? 'remove' : 'add'}
            </span>
          </button>
          <div
            className="faq-answer"
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-btn-${i}`}
            style={{
              maxHeight: open === i ? '600px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="faq-answer-inner">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .faq-accordion {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin: 28px 0;
        }
        .faq-item {
          border-bottom: 1px solid var(--border);
        }
        .faq-item:last-child { border-bottom: none; }
        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          background: var(--white);
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s;
          font-family: var(--font-body);
        }
        .faq-question:hover { background: var(--surface); }
        .faq-item.open .faq-question { background: var(--accent-lt); }
        .faq-q-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.45;
          flex: 1;
        }
        .faq-icon {
          color: var(--accent);
          font-size: 1.25rem;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .faq-item.open .faq-icon { transform: rotate(0deg); }
        .faq-answer-inner {
          padding: 4px 22px 20px;
        }
        .faq-answer-inner p {
          font-size: 0.93rem;
          color: var(--ink-2);
          line-height: 1.75;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
