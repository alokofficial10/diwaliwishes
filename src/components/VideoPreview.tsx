/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { FestivalConfig, GeneratedResult } from '../types';
import {
  downloadBlob,
  shareGreetingFileToWhatsApp,
  shareGreetingFileNative,
  shareToFacebook,
} from '../utils/share';
import { festiveAudio } from '../utils/audio';
import { drawFestivalVideoFrame, ensureFontsLoaded } from '../utils/videoRecorder';

interface VideoPreviewProps {
  result: GeneratedResult;
  festival: FestivalConfig;
  onBack: () => void;
  lang: 'hi' | 'en';
  templateId?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  result,
  festival,
  onBack,
  lang,
  templateId,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const startTimeRef = useRef<number>(performance.now());
  const pausedOffsetRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  const activeTemplate =
    festival.templates.find((t) => t.id === templateId) || festival.templates[0];
  const recipientNameClean =
    result.recipientMode === 'special' ? result.recipientName : undefined;

  // Master Clock & Continuous Seamless Loop Animation Engine (8-second cycle)
  useEffect(() => {
    ensureFontsLoaded();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startTimeRef.current = performance.now();
    pausedOffsetRef.current = 0;
    isPausedRef.current = false;
    setIsPlaying(true);

    const bgVideo = bgVideoRef.current;
    const audio = audioRef.current;

    if (bgVideo) {
      bgVideo.currentTime = 0;
      bgVideo.play().catch(() => {});
    }

    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.85;
      if (!festiveAudio.isMuted) {
        audio.play().catch(() => {});
      }
    }

    // Subscribe to sound on/off (speaker) button in header
    const unsubscribeMute = festiveAudio.onMuteChange((muted) => {
      if (!audioRef.current) return;
      if (muted) {
        audioRef.current.pause();
      } else if (!isPausedRef.current) {
        const now = performance.now();
        const elapsedSec = (now - startTimeRef.current) / 1000 + pausedOffsetRef.current;
        const curCycle = elapsedSec % 8.0;
        audioRef.current.currentTime = curCycle;
        audioRef.current.play().catch(() => {});
      }
    });

    const render = () => {
      if (!isPausedRef.current) {
        const now = performance.now();
        const elapsedSec = (now - startTimeRef.current) / 1000 + pausedOffsetRef.current;
        const cycleTime = elapsedSec % 8.0;

        // Video drift correction: if currentTime drifts > 0.3s from cycleTime, sync it
        if (bgVideoRef.current && !bgVideoRef.current.paused) {
          if (Math.abs(bgVideoRef.current.currentTime - cycleTime) > 0.3) {
            bgVideoRef.current.currentTime = cycleTime;
          }
        }

        // Audio drift correction: keep devotional loop tightly locked to cycle
        if (audioRef.current && !audioRef.current.paused && !festiveAudio.isMuted) {
          if (Math.abs(audioRef.current.currentTime - cycleTime) > 0.3) {
            audioRef.current.currentTime = cycleTime;
          }
        }

        // Render current animation frame using the unified frame renderer
        if (bgVideoRef.current) {
          drawFestivalVideoFrame(
            ctx,
            720,
            960,
            bgVideoRef.current,
            festival,
            activeTemplate,
            result.senderName,
            recipientNameClean,
            result.recipientMode,
            cycleTime
          );
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      unsubscribeMute();
      if (bgVideoRef.current) {
        bgVideoRef.current.pause();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [festival, activeTemplate, result, recipientNameClean]);

  // Controls: Pause / Play toggle
  const togglePlay = () => {
    if (isPausedRef.current) {
      // Resume
      isPausedRef.current = false;
      setIsPlaying(true);
      startTimeRef.current = performance.now();
      bgVideoRef.current?.play().catch(() => {});
      if (!festiveAudio.isMuted) {
        audioRef.current?.play().catch(() => {});
      }
    } else {
      // Pause
      isPausedRef.current = true;
      setIsPlaying(false);
      const now = performance.now();
      pausedOffsetRef.current = ((now - startTimeRef.current) / 1000 + pausedOffsetRef.current) % 8.0;
      bgVideoRef.current?.pause();
      audioRef.current?.pause();
    }
  };

  // Controls: Replay from 0 seconds
  const restartVideo = () => {
    startTimeRef.current = performance.now();
    pausedOffsetRef.current = 0;
    isPausedRef.current = false;
    setIsPlaying(true);

    if (bgVideoRef.current) {
      bgVideoRef.current.currentTime = 0;
      bgVideoRef.current.play().catch(() => {});
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!festiveAudio.isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleDownload = () => {
    festiveAudio.playChime(680, 0.5);
    downloadBlob(result.file, result.file.name);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleWhatsApp = async () => {
    festiveAudio.playSparkle();
    await shareGreetingFileToWhatsApp({
      file: result.file,
      caption: result.shareText,
      lang,
      onNotice: showToast,
    });
  };

  const handleFacebook = () => {
    festiveAudio.playSparkle();
    shareToFacebook(result.shareableUrl, result.shareText);
  };

  const handleNativeShare = async () => {
    festiveAudio.playChime(740, 0.5);
    await shareGreetingFileNative({
      file: result.file,
      caption: result.shareText,
      lang,
      onNotice: showToast,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(result.shareableUrl);
      setCopied(true);
      festiveAudio.playChime(800, 0.3);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] px-4 py-3 rounded-2xl bg-amber-950/95 border-2 border-amber-500 text-amber-100 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md animate-fadeIn flex items-center gap-2.5 text-center justify-center">
          <span className="text-base select-none">💡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Back & Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-300 hover:text-amber-100 px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-600/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'बदलाव करें' : 'Edit / Back'}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'hi' ? `${festival.nameHi} वीडियो तैयार है!` : 'Video Ready!'}</span>
        </div>
      </div>

      {/* Video Player Display Frame with continuous 8s master clock loop on canvas */}
      <div className="relative mx-auto max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-2xl shadow-amber-900/40 bg-black aspect-[3/4]">
        {/* Hidden video background element */}
        <video
          ref={bgVideoRef}
          src="/ram-greeting-bg.mp4"
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          className="hidden"
        />

        {/* Hidden audio element playing ram-bhakti-loop.wav */}
        <audio
          ref={audioRef}
          src="/ram-bhakti-loop.wav"
          loop
          preload="auto"
          className="hidden"
        />

        {/* Live Master-Clock Canvas Player */}
        <canvas
          ref={canvasRef}
          width={720}
          height={960}
          className="w-full h-full object-cover block cursor-pointer"
          onClick={togglePlay}
        />

        {/* Video Overlay Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <span className="text-[11px] font-medium text-amber-200">
            {result.extension.toUpperCase()} Video (HD)
          </span>

          <button
            onClick={restartVideo}
            className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40"
            title="पुनः चलाएँ"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-3 max-w-md mx-auto">
        {/* WhatsApp Share Button (Primary) */}
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-base shadow-lg shadow-[#25D366]/20 transition-all active:scale-[0.98]"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.199.534 1.286.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.174.45 0.742.965 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.102-.116.433-.506.549-.68.116-.173.231-.144.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.073.043.42-.101.825z" />
          </svg>
          <span>{lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</span>
        </button>

        {/* Facebook Share Button (Directly beneath WhatsApp) */}
        <button
          onClick={handleFacebook}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-base shadow-lg shadow-[#1877F2]/20 transition-all active:scale-[0.98]"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>{lang === 'hi' ? 'फेसबुक पर शेयर करें' : 'Share on Facebook'}</span>
        </button>

        {/* Honest Sharing Note */}
        <p className="text-[11px] text-center text-amber-200/70 leading-relaxed px-2">
          {lang === 'hi'
            ? '💡 फेसबुक या इंस्टाग्राम पर वीडियो पोस्ट करने के लिए पहले "वीडियो डाउनलोड करें" दबाएँ, फिर अपलोड करें।'
            : '💡 Tip: To attach this video on Facebook or Instagram, download the video first, then upload it to your post.'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Download Video Button */}
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloadSuccess
                ? lang === 'hi'
                  ? 'डाउनलोड हो गया!'
                  : 'Downloaded!'
                : lang === 'hi'
                ? 'वीडियो डाउनलोड करें'
                : 'Download Video'}
            </span>
          </button>

          {/* Native Share Button */}
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-950/70 hover:bg-amber-900/70 border border-amber-600/40 text-amber-200 font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'अन्य शेयर' : 'More Options'}</span>
          </button>
        </div>
      </div>

      {/* Shareable Link Box */}
      <div className="max-w-md mx-auto rounded-2xl bg-[#1c0816]/90 border border-amber-600/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300">
            {lang === 'hi' ? 'आपका खास शेयर लिंक' : 'Your Shareable Greeting Link'}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-100 px-2 py-1 rounded bg-amber-950 border border-amber-600/30"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{lang === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>

        <div className="p-2.5 rounded-lg bg-black/50 border border-amber-900/50 font-mono text-xs text-amber-200/80 truncate">
          {result.shareableUrl}
        </div>
      </div>
    </div>
  );
};
