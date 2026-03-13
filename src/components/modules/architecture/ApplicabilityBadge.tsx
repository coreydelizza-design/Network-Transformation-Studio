import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import type { ApplicabilityStatus } from './types';
import { APPLICABILITY_META } from './types';

/* ═══════════════════════════════════════════════════════════════════════════
   APPLICABILITY BADGE — small, color-coded status indicator
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  status: ApplicabilityStatus;
  /** Show the text label next to the symbol (default false) */
  showLabel?: boolean;
  /** Compact sizing for inline use */
  compact?: boolean;
}

const ApplicabilityBadge: React.FC<Props> = ({ status, showLabel = false, compact = false }) => {
  const { t } = useTheme();
  const meta = APPLICABILITY_META[status];
  const color = t[meta.colorKey];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: compact ? 3 : 4,
      padding: compact ? '1px 5px' : '2px 8px',
      borderRadius: compact ? 3 : 4,
      background: color + '12',
      border: `1px solid ${color}25`,
      fontFamily: t.fontM,
      fontSize: compact ? 7 : 8,
      fontWeight: 700,
      color,
      letterSpacing: compact ? 0.5 : 0.8,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: compact ? 8 : 9 }}>{meta.symbol}</span>
      {showLabel && <span style={{ textTransform: 'uppercase' }}>{meta.label}</span>}
    </span>
  );
};

export default ApplicabilityBadge;
