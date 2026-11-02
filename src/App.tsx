/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  GreetingState,
  GeneratedResult,
} from './types';
import { getFestivalById } from './data/festivals';
import { Header } from './components/Header';
import { GreetingForm } from './components/GreetingForm';
import { CardPreview } from './components/CardPreview';
import { VideoPreview } from './components/VideoPreview';
import { AdPlacement } from './components/AdPlacement';
import { renderFestivalCard } from './utils/canvasRenderer';
import { generateFestivalGreetingVideo } from './utils/videoRecorder';
import { getPlainWebsiteUrl, buildShareCaption } from './utils/share';
import { festiveAudio } from './utils/audio';

export default function App() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // Form state - Diwali only
  const [formState, setFormState] = useState<GreetingState>({
    festivalId: 'diwali',
    senderName: '',
    recipientMode: 'special',
    recipientName: '',
    greetingType: 'card',
    templateId: 'diwali_classic',
  });

  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    progress: number;
    statusText: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentFestival = getFestivalById('diwali');

  const handleGoHome = () => {
    festiveAudio.playChime(500, 0.4);
    setGeneratedResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormChange = (updates: Partial<GreetingState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  // Master Generator: Produces either 1200x1600 PNG Card or 8-second MP4 Video with File in memory
  const handleGenerate = async () => {
    if (!formState.senderName.trim()) {
      setErrorMessage(
        lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.'
      );
      return;
    }

    if (
      formState.recipientMode === 'special' &&
      !formState.recipientName.trim()
    ) {
      setErrorMessage(
        lang === 'hi'
          ? 'कृपया प्राप्तकर्ता का नाम दर्ज करें अथवा "सभी को भेजें" चुनें।'
          : 'Please enter recipient name or choose universal mode.'
      );
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationProgress({
      progress: 0.1,
      statusText:
        lang === 'hi'
          ? 'दीपावली ग्रीटिंग तैयार किया जा रहा है...'
          : 'Preparing Diwali greeting...',
    });

    try {
      const activeTemplate =
        currentFestival.templates.find((t) => t.id === formState.templateId) ||
        currentFestival.templates[0];

      const cleanWebsiteUrl = getPlainWebsiteUrl();
      const shareCaption = buildShareCaption(formState.senderName.trim(), lang);

      if (formState.greetingType === 'card') {
        setGenerationProgress({
          progress: 0.45,
          statusText:
            lang === 'hi'
              ? 'दीपावली कार्ड रेंडर हो रहा है...'
              : 'Rendering Diwali card...',
        });

        // High-resolution canvas rendering
        const canvas = await renderFestivalCard(
          formState,
          currentFestival,
          activeTemplate
        );

        setGenerationProgress({
          progress: 0.85,
          statusText:
            lang === 'hi'
              ? 'एचडी इमेज एक्सपोर्ट हो रही है...'
              : 'Exporting HD artwork...',
        });

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas to blob conversion failed'));
          }, 'image/png');
        });

        const filename = 'Diwali-Greeting.png';
        const file = new File([blob], filename, { type: 'image/png' });
        const blobUrl = URL.createObjectURL(blob);

        festiveAudio.playChime(880, 0.7);
        festiveAudio.playSparkle();

        setGeneratedResult({
          festivalId: 'diwali',
          type: 'card',
          blobUrl,
          blob,
          file,
          mimeType: 'image/png',
          extension: 'png',
          senderName: formState.senderName.trim(),
          recipientName:
            formState.recipientMode === 'special'
              ? formState.recipientName.trim()
              : undefined,
          recipientMode: formState.recipientMode,
          shareableUrl: cleanWebsiteUrl,
          shareText: shareCaption,
        });
      } else {
        // Video Generation
        setGenerationProgress({
          progress: 0.15,
          statusText:
            lang === 'hi'
              ? 'दीपावली एनिमेशन फ्रेम तैयार हो रहे हैं...'
              : 'Synthesizing animation frames...',
        });

        const videoResult = await generateFestivalGreetingVideo(
          formState,
          currentFestival,
          activeTemplate,
          (progress) => setGenerationProgress(progress)
        );

        const filename = 'Diwali-Greeting.mp4';
        const file = new File([videoResult.blob], filename, { type: 'video/mp4' });
        const blobUrl = URL.createObjectURL(videoResult.blob);

        festiveAudio.playChime(880, 0.7);
        festiveAudio.playSparkle();

        setGeneratedResult({
          festivalId: 'diwali',
          type: 'video',
          blobUrl,
          blob: videoResult.blob,
          file,
          mimeType: 'video/mp4',
          extension: 'mp4',
          senderName: formState.senderName.trim(),
          recipientName:
            formState.recipientMode === 'special'
              ? formState.recipientName.trim()
              : undefined,
          recipientMode: formState.recipientMode,
          shareableUrl: cleanWebsiteUrl,
          shareText: shareCaption,
        });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Generation error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown generation error';
      setErrorMessage(
        lang === 'hi'
          ? `ग्रीटिंग तैयार करने में समस्या आई: ${msg}`
          : `Failed to create greeting: ${msg}`
      );
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const handleReset = () => {
    festiveAudio.playChime(500, 0.4);
    if (generatedResult?.blobUrl) {
      URL.revokeObjectURL(generatedResult.blobUrl);
    }
    setGeneratedResult(null);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-amber-50 font-poppins flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Header Bar with Official Brand Name "Festive विशेष" */}
      <Header
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'hi' ? 'en' : 'hi'))}
        onGoHome={handleGoHome}
        onReset={generatedResult ? handleReset : undefined}
        isHome={!generatedResult}
        hasActiveOutput={Boolean(generatedResult)}
      />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-xl w-full mx-auto px-4 py-4 sm:py-6">
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm font-medium flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-200 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Display Output Screen or Creator Form directly (No gate/receiver screens) */}
        {generatedResult ? (
          generatedResult.type === 'card' ? (
            <CardPreview
              result={generatedResult}
              festival={currentFestival}
              onBack={() => setGeneratedResult(null)}
              lang={lang}
            />
          ) : (
            <VideoPreview
              result={generatedResult}
              festival={currentFestival}
              onBack={() => setGeneratedResult(null)}
              lang={lang}
              templateId={formState.templateId}
            />
          )
        ) : (
          <GreetingForm
            festival={currentFestival}
            state={formState}
            onChange={handleFormChange}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            lang={lang}
          />
        )}

        {/* Policy-compliant Ad Placement */}
        <div className="mt-8 pt-4 border-t border-amber-900/30">
          <AdPlacement />
        </div>
      </main>

      {/* Official Footer: Festive विशेष */}
      <footer className="relative z-10 bg-[#09020a]/90 backdrop-blur-sm border-t border-amber-950/80 py-5 px-4 text-center text-xs text-amber-300/60 font-poppins space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <span className="font-rozha text-sm sm:text-base font-bold text-amber-200">
            Festive विशेष
          </span>
          <span className="text-[11px] text-amber-400/50">•</span>
          <span className="text-xs text-amber-300/80">
            {lang === 'hi' ? 'दीपावली स्पेशल ग्रीटिंग कार्ड व वीडियो' : 'Diwali Special Greeting Cards & Videos'}
          </span>
        </div>

        <p className="text-[11px] text-amber-400/60 max-w-md mx-auto">
          {lang === 'hi'
            ? 'शुभ दीपावली के पावन पर्व पर अपने नाम के साथ सुंदर ग्रीटिंग कार्ड और वीडियो बनाएँ, डाउनलोड करें और WhatsApp पर शेयर करें।'
            : 'Create personalized Happy Diwali greeting cards and animated videos with your name, download in HD, and share on WhatsApp.'}
        </p>
      </footer>
    </div>
  );
}
