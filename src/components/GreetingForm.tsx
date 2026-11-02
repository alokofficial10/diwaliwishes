/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Users,
  Image as ImageIcon,
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { GreetingState, RecipientMode, GreetingType, FestivalConfig } from '../types';
import { festiveAudio } from '../utils/audio';

interface GreetingFormProps {
  festival: FestivalConfig;
  state: GreetingState;
  onChange: (updates: Partial<GreetingState>) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  generationProgress?: { progress: number; statusText: string } | null;
  lang: 'hi' | 'en';
}

export const GreetingForm: React.FC<GreetingFormProps> = ({
  festival,
  state,
  onChange,
  onSubmit,
  isGenerating,
  generationProgress,
  lang,
}) => {
  const [touched, setTouched] = useState({
    sender: false,
    recipient: false,
  });

  const isSenderValid = state.senderName.trim().length > 0;
  const isRecipientValid =
    state.recipientMode === 'all' || state.recipientName.trim().length > 0;
  const isFormValid = isSenderValid && isRecipientValid;

  const activeTemplate =
    festival.templates.find((t) => t.id === state.templateId) || festival.templates[0];

  const handleModeChange = (mode: RecipientMode) => {
    festiveAudio.playChime(520, 0.4);
    onChange({ recipientMode: mode });
  };

  const handleTypeChange = (type: GreetingType) => {
    festiveAudio.playChime(580, 0.4);
    onChange({ greetingType: type });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ sender: true, recipient: true });
    if (!isFormValid || isGenerating) return;

    festiveAudio.playChime(880, 0.8);
    onSubmit();
  };

  const previewSender = state.senderName.trim() || (lang === 'hi' ? 'आपका नाम' : 'Your Name');
  const previewRecipient = state.recipientName.trim() || (lang === 'hi' ? 'प्राप्तकर्ता' : 'Recipient');

  const isSpecial = state.recipientMode === 'special' && Boolean(state.recipientName.trim());

  const previewGreetingText = isSpecial
    ? (lang === 'hi'
        ? activeTemplate.specialTextHi(previewSender, previewRecipient)
        : (activeTemplate.specialTextEn ? activeTemplate.specialTextEn(previewSender, previewRecipient) : `Wishing ${previewRecipient} a very Happy Diwali, from ${previewSender}!`))
    : (lang === 'hi'
        ? activeTemplate.allTextHi(previewSender)
        : (activeTemplate.allTextEn ? activeTemplate.allTextEn(previewSender) : `Wishing you and your family a very Happy Diwali, from ${previewSender}!`));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn pb-8">
      {/* 1. Main Festival Hero Header */}
      <div className="text-center pt-1 pb-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-3 shadow-md">
          <span className="text-base select-none">🪔</span>
          <span>{lang === 'hi' ? 'रोशनी का महापर्व • Festive विशेष' : 'Festival of Lights • Festive विशेष'}</span>
          <span className="text-base select-none">🪔</span>
        </div>

        <h1 className="font-rozha text-3xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
          {lang === 'hi' ? festival.headingHi : 'Happy Diwali'}
        </h1>

        <p className="font-poppins text-xs sm:text-sm text-amber-100/90 max-w-md mx-auto mt-2 leading-relaxed">
          {lang === 'hi' ? festival.subtitleHi : festival.subtitleEn}
        </p>
      </div>

      {/* 2. Sender Name Field (Required) */}
      <div className="bg-[#1c0816]/90 rounded-2xl p-4 sm:p-5 border border-amber-600/30 shadow-lg shadow-black/40">
        <label
          htmlFor="senderNameInput"
          className="flex items-center justify-between text-sm font-semibold text-amber-200 mb-2"
        >
          <span className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'आपका नाम (भेजने वाला)' : "Your Name (Sender's Name)"}</span>
            <span className="text-red-400 text-xs">* {lang === 'hi' ? 'ज़रूरी' : 'Required'}</span>
          </span>
          {isSenderValid && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'hi' ? 'सही' : 'Valid'}
            </span>
          )}
        </label>

        <div className="relative">
          <input
            id="senderNameInput"
            type="text"
            value={state.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            onBlur={() => setTouched((prev) => ({ ...prev, sender: true }))}
            placeholder={lang === 'hi' ? 'उदा. नितिन कुमार, शर्मा परिवार...' : 'e.g. Nitin Kumar, Sharma Family...'}
            maxLength={40}
            className={`w-full bg-[#12040e] text-amber-100 placeholder-amber-400/40 text-base rounded-xl px-4 py-3.5 border transition-all focus:outline-none focus:ring-2 ${
              touched.sender && !isSenderValid
                ? 'border-red-500 focus:ring-red-400/30'
                : 'border-amber-600/40 focus:border-amber-400 focus:ring-amber-400/30'
            }`}
          />
        </div>

        {touched.sender && !isSenderValid && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 mt-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.'}</span>
          </p>
        )}
      </div>

      {/* 3. Recipient Mode: Special (Personalized) vs All (Universal) */}
      <div className="bg-[#1c0816]/90 rounded-2xl p-4 sm:p-5 border border-amber-600/30 shadow-lg shadow-black/40 space-y-3">
        <label className="block text-sm font-semibold text-amber-200">
          {lang === 'hi' ? 'ग्रीटिंग किसके लिए बनाना है?' : 'Who is this greeting for?'}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mode A: खास व्यक्ति */}
          <button
            type="button"
            onClick={() => handleModeChange('special')}
            className={`relative p-3.5 rounded-xl border text-left transition-all active:scale-[0.99] flex flex-col justify-between ${
              state.recipientMode === 'special'
                ? 'bg-gradient-to-br from-amber-950 to-orange-950/80 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#14050d] border-amber-900/50 hover:border-amber-700/60 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    state.recipientMode === 'special' ? 'bg-amber-500 text-black' : 'bg-amber-950 text-amber-400'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-amber-100">
                  {lang === 'hi' ? 'खास व्यक्ति को भेजें' : 'Special Person (Personalized)'}
                </span>
              </div>
              {state.recipientMode === 'special' && (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-amber-300/70 mt-2 font-poppins">
              {lang === 'hi'
                ? 'प्राप्तकर्ता का नाम ग्रीटिंग कार्ड व वीडियो में विशेष रूप से दिखेगा'
                : 'Adds the recipient’s name prominently on the card & video'}
            </p>
          </button>

          {/* Mode B: सभी को भेजें */}
          <button
            type="button"
            onClick={() => handleModeChange('all')}
            className={`relative p-3.5 rounded-xl border text-left transition-all active:scale-[0.99] flex flex-col justify-between ${
              state.recipientMode === 'all'
                ? 'bg-gradient-to-br from-amber-950 to-orange-950/80 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#14050d] border-amber-900/50 hover:border-amber-700/60 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    state.recipientMode === 'all' ? 'bg-amber-500 text-black' : 'bg-amber-950 text-amber-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-amber-100">
                  {lang === 'hi' ? 'सभी को भेजें (यूनिवर्सल)' : 'Universal Greeting (All)'}
                </span>
              </div>
              {state.recipientMode === 'all' && (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-amber-300/70 mt-2 font-poppins">
              {lang === 'hi'
                ? 'एक ग्रीटिंग बनाएँ और सभी दोस्तों व WhatsApp ग्रुप्स में साझा करें'
                : 'Sender name only; perfect for family groups and friends'}
            </p>
          </button>
        </div>

        {/* Mode A Input Field (Recipient Name) */}
        {state.recipientMode === 'special' && (
          <div className="pt-2 animate-fadeIn">
            <label
              htmlFor="recipientNameInput"
              className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-1.5"
            >
              <span>
                {lang === 'hi' ? 'प्राप्तकर्ता का नाम (जिसे आप भेज रहे हैं)' : "Recipient's Name"}
                <span className="text-red-400 ml-1">* {lang === 'hi' ? 'ज़रूरी' : 'Required'}</span>
              </span>
              {state.recipientName.trim() && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> {lang === 'hi' ? 'दर्ज है' : 'Entered'}
                </span>
              )}
            </label>
            <input
              id="recipientNameInput"
              type="text"
              value={state.recipientName}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, recipient: true }))}
              placeholder={lang === 'hi' ? 'उदा. राहुल, दीदी, भैया, अमित जी...' : 'e.g. Rahul, Priya, Friend...'}
              maxLength={40}
              className={`w-full bg-[#12040e] text-amber-100 placeholder-amber-400/40 text-base rounded-xl px-4 py-3 border transition-all focus:outline-none focus:ring-2 ${
                touched.recipient && !state.recipientName.trim()
                  ? 'border-red-500 focus:ring-red-400/30'
                  : 'border-amber-600/40 focus:border-amber-400 focus:ring-amber-400/30'
              }`}
            />
            {touched.recipient && !state.recipientName.trim() && (
              <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {lang === 'hi'
                  ? 'कृपया प्राप्तकर्ता का नाम दर्ज करें अथवा "सभी को भेजें" चुनें।'
                  : 'Please enter recipient name or choose Universal mode.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4. Greeting Format (Card vs Video) */}
      <div className="bg-[#1c0816]/90 rounded-2xl p-4 sm:p-5 border border-amber-600/30 shadow-lg shadow-black/40 space-y-3">
        <label className="block text-sm font-semibold text-amber-200">
          {lang === 'hi' ? 'ग्रीटिंग का प्रकार चुनें' : 'Select Greeting Format'}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('card')}
            className={`p-3.5 rounded-xl border text-center transition-all active:scale-[0.98] ${
              state.greetingType === 'card'
                ? 'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#14050d] border-amber-900/50 hover:border-amber-700/60 opacity-80'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  state.greetingType === 'card' ? 'bg-amber-400 text-black' : 'bg-amber-950 text-amber-300'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-amber-100">
                {lang === 'hi' ? 'ग्रीटिंग कार्ड (PNG)' : 'Greeting Card (PNG)'}
              </span>
              <span className="text-[11px] text-amber-300/70">
                {lang === 'hi' ? '1200×1600 HD पोस्टर' : '1200×1600 HD Poster'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('video')}
            className={`p-3.5 rounded-xl border text-center transition-all active:scale-[0.98] ${
              state.greetingType === 'video'
                ? 'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#14050d] border-amber-900/50 hover:border-amber-700/60 opacity-80'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  state.greetingType === 'video' ? 'bg-amber-400 text-black' : 'bg-amber-950 text-amber-300'
                }`}
              >
                <Video className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-amber-100">
                {lang === 'hi' ? 'एनिमेटेड वीडियो' : 'Animated Video'}
              </span>
              <span className="text-[11px] text-amber-300/70">
                {lang === 'hi' ? 'संगीत व एनिमेशन' : 'Motion & Music'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Wish Template Selection for Diwali */}
      <div className="bg-[#1c0816]/90 rounded-2xl p-4 sm:p-5 border border-amber-600/30 shadow-lg shadow-black/40 space-y-3">
        <label className="block text-xs font-semibold text-amber-300 mb-1">
          {lang === 'hi' ? 'दीपावली शुभकामना संदेश चुनें' : 'Choose Diwali Wish Template'}
        </label>
        <div className="space-y-2">
          {festival.templates.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onChange({ templateId: tmpl.id })}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                state.templateId === tmpl.id
                  ? 'border-amber-400 bg-amber-950/60 text-amber-100 shadow-sm'
                  : 'border-amber-900/40 bg-[#12040e] text-amber-300/70 hover:border-amber-700/60'
              }`}
            >
              <div className="font-semibold text-amber-200">
                {lang === 'hi' ? tmpl.titleHi : tmpl.titleEn}
              </div>
              <div className="line-clamp-1 text-[11px] text-amber-300/70 mt-1">
                {lang === 'hi' ? tmpl.quoteHi : (tmpl.quoteEn || tmpl.englishSubtext)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Live Text Preview */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/70 via-red-950/60 to-amber-950/70 p-3.5 text-center">
        <p className="text-[11px] uppercase tracking-wider text-amber-400/80 font-semibold mb-1">
          {lang === 'hi' ? 'ग्रीटिंग संदेश (लाइव प्रीव्यू)' : 'Greeting Message (Live Preview)'}
        </p>
        <p className="font-rozha text-base sm:text-lg text-amber-100 font-medium leading-relaxed">
          {previewGreetingText}
        </p>
      </div>

      {/* 8. Prominent Generate Greeting Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full relative group overflow-hidden py-4 px-6 rounded-2xl font-bold text-lg sm:text-xl transition-all shadow-xl active:scale-[0.98] ${
            isGenerating
              ? 'bg-amber-900/60 text-amber-300/80 cursor-wait'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 hover:brightness-110 shadow-amber-500/25'
          }`}
        >
          <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

          <div className="flex items-center justify-center gap-2.5">
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                <span>
                  {generationProgress?.statusText ||
                    (lang === 'hi' ? 'दीपावली ग्रीटिंग तैयार हो रहा है...' : 'Generating Diwali Greeting...')}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  {state.greetingType === 'card'
                    ? lang === 'hi'
                      ? 'दीपावली कार्ड बनाएँ ✨'
                      : 'Generate Diwali Card ✨'
                    : lang === 'hi'
                    ? 'दीपावली वीडियो बनाएँ 🎬'
                    : 'Generate Diwali Video 🎬'}
                </span>
              </>
            )}
          </div>
        </button>

        {isGenerating && generationProgress && (
          <div className="mt-3 space-y-1">
            <div className="w-full h-2 rounded-full bg-amber-950 overflow-hidden border border-amber-600/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-150 ease-out"
                style={{ width: `${Math.round(generationProgress.progress * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-amber-300/70 font-poppins">
              <span>{generationProgress.statusText}</span>
              <span>{Math.round(generationProgress.progress * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
