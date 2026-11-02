/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdPlacementProps {
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ className = '' }) => {
  return (
    <div
      aria-label="Advertising Placement"
      className={`w-full max-w-xl mx-auto rounded-xl border border-dashed border-amber-900/50 bg-amber-950/20 px-4 py-3 text-center ${className}`}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-500/70 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/20">
          Advertisement • विज्ञापन
        </span>
      </div>
      <p className="text-xs text-amber-300/60 font-poppins">
        विज्ञापन स्थान • Policy-compliant ad slot ready for integration
      </p>
    </div>
  );
};
