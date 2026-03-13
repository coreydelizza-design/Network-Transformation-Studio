import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import type { ApplicabilityStatus } from './types';
import { APPLICABILITY_OPTIONS, APPLICABILITY_META } from './types';

/* ═══════════════════════════════════════════════════════════════════════════
   PATTERN ELEMENT TOGGLE — four-state applicability selector
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  value: ApplicabilityStatus;
  onChange: (status: ApplicabilityStatus) => void;
  /** Render horizontally compact (default false → full-width row) */
  compact?: boolean;
}

const PatternElementToggle: React.FC<Props> = ({ value, onChange, compact = false }) => {
  const { t, isDark } = useTheme();

  return (
    <div style={{
      display: 'inline-flex', borderRadius: 6, overflow: 'hidden',
      border: `1px solid ${t.border}`, background: t.bgInput,
      flexWrap: compact ? 'wrap' : 'nowrap',
    }}>
      {APPLICABILITY_OPTIONS.map((opt, i) => {
        const active = value === opt.value;
        const meta = APPLICABILITY_META[opt.value];
        const c = t[meta.colorKey];
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            title={opt.label}
            style={{
              padding: compact ? '3px 7px' : '4px 10px',
              border: 'none',
              borderRight: i < APPLICABILITY_OPTIONS.length - 1 ? `1px solid ${t.border}` : 'none',
              background: active ? c + '1a' : 'transparent',
              color: active ? c : t.textDim,
              boxShadow: active ? `inset 0 -2px 0 ${c}40` : 'none',
              fontFamily: t.fontD,
              fontSize: compact ? 8 : 9,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: compact ? 9 : 10 }}>{opt.symbol}</span>
            {!compact && opt.label}
            {compact && opt.label.split(' ')[0]}
          </button>
        );
      })}
    </div>
  );
};

export default PatternElementToggle;
