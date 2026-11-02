/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { festiveAudio } from '../utils/audio';

interface HeaderProps {
  lang: 'hi' | 'en';
  onToggleLang: () => void;
  onGoHome?: () => void;
  onReset?: () => void;
  isHome: boolean;
  hasActiveOutput?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onGoHome,
  onReset,
  hasActiveOutput,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleSound = () => {
    const muted = festiveAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      festiveAudio.playChime(660, 0.8);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#140612]/92 backdrop-blur-md border-b border-amber-900/40 px-3 py-2.5 sm:px-6 sm:py-3 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand / Logo: Festive विशेष */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-base select-none">🪔</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-rozha text-lg sm:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200">
                Festive विशेष
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-200/70 font-poppins hidden sm:block">
              {lang === 'hi' ? 'दीपावली स्पेशल ग्रीटिंग कार्ड व वीडियो' : 'Diwali Special Greeting Cards & Videos'}
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {hasActiveOutput && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/40 text-amber-200 transition-all active:scale-95"
              title={lang === 'hi' ? 'नया ग्रीटिंग बनाएँ' : 'Create New Greeting'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{lang === 'hi' ? 'नया बनाएँ' : 'New'}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle festive sound"
            className="flex items-center gap-1 p-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/30 text-amber-300 transition-all active:scale-95"
            title={isMuted ? (lang === 'hi' ? 'ध्वनि चालू करें' : 'Unmute sound') : (lang === 'hi' ? 'ध्वनि बंद करें' : 'Mute sound')}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-amber-400/60" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-900/50 to-orange-950/50 hover:from-amber-900/70 hover:to-orange-900/70 border border-amber-500/40 text-xs font-medium text-amber-200 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
