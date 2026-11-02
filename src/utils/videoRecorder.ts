/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalConfig, GreetingState, WishTemplate } from '../types';

export interface VideoRecordProgress {
  progress: number;
  statusText: string;
}

export function checkVideoSupport(): {
  isSupported: boolean;
  mimeType: string;
  isDirectMp4WithAac: boolean;
  extension: 'mp4' | 'webm';
} {
  if (typeof window === 'undefined' || !window.MediaRecorder) {
    return { isSupported: false, mimeType: '', isDirectMp4WithAac: false, extension: 'mp4' };
  }

  // 1. High-priority WhatsApp-compatible MP4 with AAC audio
  const directMp4Aac = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1,mp4a.40.2',
  ];

  for (const mime of directMp4Aac) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return { isSupported: true, mimeType: mime, isDirectMp4WithAac: true, extension: 'mp4' };
    }
  }

  // 2. Standard MP4 (e.g. Safari on iOS / macOS encodes H.264 + AAC)
  if (MediaRecorder.isTypeSupported('video/mp4')) {
    return { isSupported: true, mimeType: 'video/mp4', isDirectMp4WithAac: true, extension: 'mp4' };
  }

  // 3. Fallback WebM codecs for browsers that do not support MP4 recording directly
  const webmCandidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  for (const mime of webmCandidates) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return { isSupported: true, mimeType: mime, isDirectMp4WithAac: false, extension: 'webm' };
    }
  }

  return { isSupported: true, mimeType: '', isDirectMp4WithAac: false, extension: 'mp4' };
}


// Helper for capitalized names ("nitin" -> "Nitin")
export function capitalizeName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Ensure all Google Fonts are completely loaded before rendering canvas or recording MP4
export async function ensureFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('600 15px "Cinzel Decorative"'),
      document.fonts.load('700 32px "Yatra One"'),
      document.fonts.load('900 62px "Yatra One"'),
      document.fonts.load('700 28px "Amita"'),
      document.fonts.load('600 22px "Tiro Devanagari Hindi"'),
      document.fonts.load('bold 30px "Tiro Devanagari Hindi"'),
      document.fonts.load('bold 32px "Tiro Devanagari Hindi"'),
      document.fonts.load('italic 18px "Tiro Devanagari Hindi"'),
    ]);
    await document.fonts.ready;
  } catch (err) {
    console.warn('Font loading check:', err);
  }
}

// Helper to split festival wish sentence into two balanced, centered lines
export function splitWishSentenceIntoTwoLines(sentence: string): [string, string] {
  const clean = sentence.trim();
  if (!clean) return ['', ''];

  // 1. Direct match for standard Hindi Diwali pattern:
  // "आपको और आपके परिवार को शुभ दीपावली की हार्दिक शुभकामनाएँ!"
  // or "<name> को शुभ दीपावली की हार्दिक शुभकामनाएँ!"
  const koIdx = clean.indexOf('को ');
  if (koIdx !== -1) {
    const line1 = clean.slice(0, koIdx + 2).trim();
    const line2 = clean.slice(koIdx + 2).trim();
    if (line1 && line2) {
      return [line1, line2];
    }
  }

  // 2. Hindi phrase separator if "पर " is present (e.g. "परिवार पर माँ लक्ष्मी...")
  const parIdx = clean.indexOf('पर ');
  if (parIdx !== -1) {
    const line1 = clean.slice(0, parIdx + 2).trim();
    const line2 = clean.slice(parIdx + 2).trim();
    if (line1 && line2) {
      return [line1, line2];
    }
  }

  // 3. Balanced word split for English or other sentences
  const words = clean.split(/\s+/);
  if (words.length <= 1) return [clean, ''];

  let bestSplit = Math.ceil(words.length / 2);
  let minDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const p1 = words.slice(0, i).join(' ');
    const p2 = words.slice(i).join(' ');
    const diff = Math.abs(p1.length - p2.length);
    if (diff < minDiff) {
      minDiff = diff;
      bestSplit = i;
    }
  }

  return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
}


// Delicate ornamental divider with central lotus/diya diamond motif
function drawOrnamentalDivider(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  width: number,
  alpha: number
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1.2;

  const half = width / 2;
  const gap = 16;

  // Left fading line
  const leftGrad = ctx.createLinearGradient(centerX - half, y, centerX - gap, y);
  leftGrad.addColorStop(0, 'rgba(232, 192, 96, 0)');
  leftGrad.addColorStop(1, 'rgba(232, 192, 96, 0.75)');
  ctx.strokeStyle = leftGrad;
  ctx.beginPath();
  ctx.moveTo(centerX - half, y);
  ctx.lineTo(centerX - gap, y);
  ctx.stroke();

  // Right fading line
  const rightGrad = ctx.createLinearGradient(centerX + gap, y, centerX + half, y);
  rightGrad.addColorStop(0, 'rgba(232, 192, 96, 0.75)');
  rightGrad.addColorStop(1, 'rgba(232, 192, 96, 0)');
  ctx.strokeStyle = rightGrad;
  ctx.beginPath();
  ctx.moveTo(centerX + gap, y);
  ctx.lineTo(centerX + half, y);
  ctx.stroke();

  // Center motif: golden diamond diya flourish
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(centerX, y - 4.5);
  ctx.lineTo(centerX + 4.5, y);
  ctx.lineTo(centerX, y + 4.5);
  ctx.lineTo(centerX - 4.5, y);
  ctx.closePath();
  ctx.fill();

  // Flanking accent dots
  ctx.beginPath();
  ctx.arc(centerX - 9, y, 1.2, 0, Math.PI * 2);
  ctx.arc(centerX + 9, y, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Corner ornaments for the translucent message panel
function drawPanelCornerOrnaments(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.strokeStyle = '#FFD700';
  ctx.fillStyle = '#FFD700';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
  ctx.shadowBlur = 6;

  const inset = 12;
  const len = 14;

  const corners = [
    { cx: x + inset, cy: y + inset, dx: 1, dy: 1 },
    { cx: x + w - inset, cy: y + inset, dx: -1, dy: 1 },
    { cx: x + inset, cy: y + h - inset, dx: 1, dy: -1 },
    { cx: x + w - inset, cy: y + h - inset, dx: -1, dy: -1 },
  ];

  corners.forEach(({ cx, cy, dx, dy }) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + dx * 3, cy + dy * 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Master frame renderer used by both live preview canvas and MP4 export recorder
export function drawFestivalVideoFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgVideo: HTMLVideoElement,
  festival: FestivalConfig,
  template: WishTemplate,
  senderName: string,
  recipientName: string | undefined,
  recipientMode: 'special' | 'all',
  time: number
) {
  // 1. Draw current video frame scaled to cover the whole frame (object-fit: cover, no stretching)
  const vw = bgVideo.videoWidth || width;
  const vh = bgVideo.videoHeight || height;
  const canvasRatio = width / height;
  const videoRatio = vw / vh;

  let dw = width;
  let dh = height;
  let dx = 0;
  let dy = 0;

  if (videoRatio > canvasRatio) {
    dh = height;
    dw = height * videoRatio;
    dx = (width - dw) / 2;
  } else {
    dw = width;
    dh = width / videoRatio;
    dy = (height - dh) / 2;
  }

  if (bgVideo.readyState >= 2) {
    ctx.drawImage(bgVideo, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = '#0f050d';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Light dark gradient layer - kept very soft in middle so idol face & jewellery are luminous
  const darkGrad = ctx.createLinearGradient(0, 0, 0, height);
  darkGrad.addColorStop(0, 'rgba(0, 0, 0, 0.40)');
  darkGrad.addColorStop(0.18, 'rgba(0, 0, 0, 0.12)');
  darkGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.08)');
  darkGrad.addColorStop(0.68, 'rgba(0, 0, 0, 0.45)');
  darkGrad.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
  ctx.fillStyle = darkGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Ornate Double Gold Border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.8;
  ctx.strokeRect(18, 18, width - 36, height - 36);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Helper for staged entrance with soft fade-in and 20px upward slide
  const getEntrance = (start: number, dur = 0.65) => {
    const p = Math.min(1, Math.max(0, (time - start) / dur));
    const eased = 1 - Math.pow(1 - p, 3);
    return { alpha: eased, slideY: (1 - eased) * 20, isVisible: p > 0 };
  };

  // Slow subtle glow pulse after appearance (from 3.8s to 8.0s)
  const pulseFactor = time > 3.8 ? Math.sin((time - 3.8) * 2.0) * 0.05 : 0;

  // 4. Header: Small line "Festive Wishes • Festival of Lights" (Order 1)
  const entHeader = getEntrance(0.1, 0.6);
  if (entHeader.isVisible) {
    ctx.save();
    ctx.globalAlpha = entHeader.alpha;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FDE047';
    ctx.font = '600 15px "Cinzel Decorative", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 8;
    ctx.fillText('FESTIVE WISHES • FESTIVAL OF LIGHTS', width / 2, 58 + entHeader.slideY);
    ctx.letterSpacing = '0px';
    ctx.restore();
  }

  // 5. Line 2: "जय श्री राम" (Order 2, Saffron-to-Gold gradient, warm glow, above Shubh Deepawali)
  const entJsr = getEntrance(0.45, 0.65);
  if (entJsr.isVisible) {
    ctx.save();
    ctx.globalAlpha = entJsr.alpha;
    ctx.textAlign = 'center';
    const jsrY = 98 + entJsr.slideY;

    ctx.font = '700 32px "Yatra One", sans-serif';
    const jsrGrad = ctx.createLinearGradient(width / 2 - 120, 0, width / 2 + 120, 0);
    jsrGrad.addColorStop(0, '#FF8A00');
    jsrGrad.addColorStop(0.5, '#FFE082');
    jsrGrad.addColorStop(1, '#FF6D00');

    // Soft warm glow
    ctx.shadowColor = 'rgba(255, 140, 0, 0.75)';
    ctx.shadowBlur = 14 + pulseFactor * 8;

    // Thin dark outline for depth
    ctx.strokeStyle = 'rgba(30, 8, 0, 0.75)';
    ctx.lineWidth = 3;
    ctx.strokeText('॥ जय श्री राम ॥', width / 2, jsrY);

    ctx.fillStyle = jsrGrad;
    ctx.fillText('॥ जय श्री राम ॥', width / 2, jsrY);
    ctx.restore();
  }

  // 6. Line 3: "शुभ दीपावली" (Order 3, Rich vertical gold gradient, outline, outer glow, shine sweep)
  const entTitle = getEntrance(0.85, 0.7);
  if (entTitle.isVisible) {
    ctx.save();
    ctx.globalAlpha = entTitle.alpha;
    ctx.textAlign = 'center';
    const titleY = 162 + entTitle.slideY;

    ctx.font = '900 62px "Yatra One", serif';

    // Rich vertical gold gradient (#FFF3C4 at top, #FFD966 in middle, #B8860B at bottom)
    const sdGrad = ctx.createLinearGradient(0, titleY - 50, 0, titleY + 12);
    sdGrad.addColorStop(0, '#FFF3C4');
    sdGrad.addColorStop(0.48, '#FFD966');
    sdGrad.addColorStop(1, '#B8860B');

    // Thin dark outline for depth
    ctx.strokeStyle = 'rgba(24, 6, 2, 0.9)';
    ctx.lineWidth = 4.5;
    ctx.strokeText('शुभ दीपावली', width / 2, titleY);

    // Soft golden outer glow & dark shadow
    ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
    ctx.shadowBlur = 18 + pulseFactor * 10;
    ctx.fillStyle = sdGrad;
    ctx.fillText('शुभ दीपावली', width / 2, titleY);

    // Light shine sweep across title (passes twice during 8s loop)
    const isShining1 = time >= 2.0 && time <= 3.4;
    const isShining2 = time >= 5.8 && time <= 7.2;
    if (isShining1 || isShining2) {
      const sProg = isShining1 ? (time - 2.0) / 1.4 : (time - 5.8) / 1.4;
      const sX = width / 2 - 220 + sProg * 440;
      ctx.save();
      const shineGrad = ctx.createLinearGradient(sX - 45, titleY - 45, sX + 45, titleY + 15);
      shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shineGrad;
      ctx.shadowColor = 'transparent';
      ctx.fillText('शुभ दीपावली', width / 2, titleY);
      ctx.restore();
    }

    ctx.restore();
  }

  // 7. Message Block (Moved LOWER to 62% - 88% of height: y ≈ 596 to 844)
  const isSpecial = recipientMode === 'special' && Boolean(recipientName);
  const capSender = capitalizeName(senderName);
  const capRecipient = recipientName ? capitalizeName(recipientName) : '';

  const fullWishText = isSpecial && capRecipient
    ? template.specialTextHi(capSender, capRecipient)
    : template.allTextHi(capSender);

  // Extract wishes sentence after "<name> की ओर से"
  let wishesSentence = fullWishText;
  const marker = 'की ओर से';
  const markerIdx = fullWishText.indexOf(marker);
  if (markerIdx !== -1) {
    wishesSentence = fullWishText.slice(markerIdx + marker.length).trim();
  }
  // Trim leading punctuation if any
  wishesSentence = wishesSentence.replace(/^[,:\s]+/, '');

  const panelX = 42;
  const panelW = width - 84; // 636px
  const panelY = 596;
  const panelH = 248;
  const panelRadius = 18;

  // Order 4: Message Panel Entrance
  const entPanel = getEntrance(1.6, 0.65);
  if (entPanel.isVisible) {
    ctx.save();
    ctx.globalAlpha = entPanel.alpha;
    const curPanelY = panelY + entPanel.slideY;

    // Translucent blurred-look glass panel (rgba(20,8,0,0.52))
    ctx.fillStyle = 'rgba(20, 8, 4, 0.52)';
    ctx.strokeStyle = '#E8C060';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(panelX, curPanelY, panelW, panelH, panelRadius);
    ctx.fill();
    ctx.stroke();

    // Corner ornaments in gold
    drawPanelCornerOrnaments(ctx, panelX, curPanelY, panelW, panelH);
    ctx.restore();
  }

  const curPanelY = panelY + entPanel.slideY;

  // Order 5: Sender Name Entrance ("<name> की ओर से" in Amita font, gold gradient with glow)
  const entSender = getEntrance(2.0, 0.65);
  if (entSender.isVisible && entPanel.isVisible) {
    ctx.save();
    ctx.globalAlpha = entSender.alpha;
    ctx.textAlign = 'center';
    const senderY = curPanelY + 38 + entSender.slideY;

    ctx.font = '700 28px "Amita", cursive, sans-serif';
    const sGrad = ctx.createLinearGradient(width / 2 - 140, 0, width / 2 + 140, 0);
    sGrad.addColorStop(0, '#FFE082');
    sGrad.addColorStop(0.5, '#FFF8E1');
    sGrad.addColorStop(1, '#FFCA28');

    ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
    ctx.shadowBlur = 10 + pulseFactor * 6;

    ctx.strokeStyle = 'rgba(20, 5, 0, 0.8)';
    ctx.lineWidth = 2.2;
    const senderLineText = `✨ ${capSender} की ओर से ✨`;
    ctx.strokeText(senderLineText, width / 2, senderY);
    ctx.fillStyle = sGrad;
    ctx.fillText(senderLineText, width / 2, senderY);
    ctx.restore();
  }

  // Order 6: Divider 1 Entrance (Tighter vertical spacing)
  const entDiv1 = getEntrance(2.35, 0.55);
  if (entDiv1.isVisible && entPanel.isVisible) {
    drawOrnamentalDivider(ctx, width / 2, curPanelY + 60 + entDiv1.slideY, 260, entDiv1.alpha);
  }

  // Order 7: Wishes Sentence Entrance (Two balanced lines, bold, auto-fit 35%-45% larger)
  const [wishLine1, wishLine2] = splitWishSentenceIntoTwoLines(wishesSentence);
  const maxAllowedWidth = panelW * (1 - 2 * 0.06); // 636 * 0.88 = 559.68px (min 6% side padding)

  let wishFontSize = 31.5; // ~43% larger than previous 22px
  while (wishFontSize >= 23) {
    ctx.font = `bold ${wishFontSize}px "Tiro Devanagari Hindi", serif`;
    const w1 = ctx.measureText(wishLine1).width;
    const w2 = wishLine2 ? ctx.measureText(wishLine2).width : 0;
    if (w1 <= maxAllowedWidth && w2 <= maxAllowedWidth) {
      break;
    }
    wishFontSize -= 0.5;
  }

  const entWishes = getEntrance(2.55, 0.65);
  if (entWishes.isVisible && entPanel.isVisible) {
    ctx.save();
    ctx.globalAlpha = entWishes.alpha;
    ctx.textAlign = 'center';
    ctx.font = `bold ${wishFontSize}px "Tiro Devanagari Hindi", serif`;
    ctx.fillStyle = '#FFF1C9';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;

    if (wishLine2) {
      ctx.fillText(wishLine1, width / 2, curPanelY + 98 + entWishes.slideY);
      ctx.fillText(wishLine2, width / 2, curPanelY + 138 + entWishes.slideY);
    } else {
      ctx.fillText(wishLine1, width / 2, curPanelY + 116 + entWishes.slideY);
    }

    ctx.restore();
  }

  // Order 8: Divider 2 Entrance (Tighter vertical spacing)
  const entDiv2 = getEntrance(2.95, 0.55);
  if (entDiv2.isVisible && entPanel.isVisible) {
    drawOrnamentalDivider(ctx, width / 2, curPanelY + 168 + entDiv2.slideY, 260, entDiv2.alpha);
  }

  // Order 9: Quote Line Entrance (italic-style, softer gold #E8C77A, with gold quote marks)
  const entQuote = getEntrance(3.25, 0.65);
  if (entQuote.isVisible && entPanel.isVisible) {
    ctx.save();
    ctx.globalAlpha = entQuote.alpha;
    ctx.textAlign = 'center';
    ctx.font = 'italic 18px "Tiro Devanagari Hindi", serif';
    ctx.fillStyle = '#E8C77A';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 6;

    const quoteText = `“ ${template.quoteHi} ”`;
    if (ctx.measureText(quoteText).width > 570) {
      const qWords = quoteText.split(' ');
      const qLines: string[] = [];
      let cur = '';
      for (const w of qWords) {
        const test = cur ? `${cur} ${w}` : w;
        if (ctx.measureText(test).width > 560) {
          qLines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) qLines.push(cur);
      qLines.forEach((ln, idx) => {
        ctx.fillText(ln, width / 2, curPanelY + 196 + idx * 22 + entQuote.slideY);
      });
    } else {
      ctx.fillText(quoteText, width / 2, curPanelY + 206 + entQuote.slideY);
    }

    ctx.restore();
  }
}

// Master Animated Video Generator with Ram Mandir Video Background and WhatsApp-Compatible Devotional Audio
export async function generateFestivalGreetingVideo(
  state: GreetingState,
  festival: FestivalConfig,
  template: WishTemplate,
  onProgress?: (p: VideoRecordProgress) => void
): Promise<{ blob: Blob; mimeType: string; extension: 'mp4' }> {
  // Wait until all custom fonts are completely loaded before starting recording
  await ensureFontsLoaded();

  const { mimeType: chosenMime, isDirectMp4WithAac } = checkVideoSupport();

  const width = 720;
  const height = 960;
  const fps = 30;
  const durationSeconds = 8;
  const totalFrames = fps * durationSeconds;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot acquire canvas 2D context for video export');

  // Load ram-greeting-bg.mp4 in a hidden <video> element with muted, playsInline, preload="auto"
  const bgVideo = document.createElement('video');
  bgVideo.src = '/ram-greeting-bg.mp4';
  bgVideo.muted = true;
  bgVideo.defaultMuted = true;
  bgVideo.playsInline = true;
  bgVideo.loop = true;
  bgVideo.preload = 'auto';
  bgVideo.setAttribute('playsinline', '');
  bgVideo.setAttribute('webkit-playsinline', '');
  bgVideo.setAttribute('muted', '');
  bgVideo.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
  document.body.appendChild(bgVideo);

  // Wait until background video has loaded (loadeddata) before starting animation or recording
  await new Promise<void>((resolve, reject) => {
    if (bgVideo.readyState >= 2) {
      resolve();
      return;
    }
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Failed to load ram-greeting-bg.mp4 background video'));
    };
    const timer = setTimeout(() => {
      cleanup();
      if (bgVideo.readyState >= 1) resolve();
      else reject(new Error('Background video load timeout'));
    }, 8000);

    function cleanup() {
      clearTimeout(timer);
      bgVideo.removeEventListener('loadeddata', onLoaded);
      bgVideo.removeEventListener('canplay', onLoaded);
      bgVideo.removeEventListener('error', onError);
    }

    bgVideo.addEventListener('loadeddata', onLoaded);
    bgVideo.addEventListener('canplay', onLoaded);
    bgVideo.addEventListener('error', onError);
    bgVideo.load();
  });

  // 1) Initialize ONE AudioContext and resume immediately on user gesture
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioContext = new AudioContextClass();
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // Fetch and decode the devotional music file
  const audioResponse = await fetch('/ram-bhakti-loop.wav');
  if (!audioResponse.ok) {
    throw new Error('Failed to fetch /ram-bhakti-loop.wav for audio track');
  }
  const arrayBuffer = await audioResponse.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Create AudioBufferSourceNode (loop = false, covers exactly 8 seconds of video)
  const audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = audioBuffer;
  audioBufferSource.loop = false;

  // Connect through GainNode (gain 1.0) to destination ONLY.
  // CRITICAL: Do NOT connect to audioContext.destination so recording remains silent to the user.
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 1.0;
  const destination = audioContext.createMediaStreamDestination();

  audioBufferSource.connect(gainNode);
  gainNode.connect(destination);

  // Capture canvas video tracks
  const canvasStream = canvas.captureStream(30);
  const videoTracks = canvasStream.getVideoTracks();
  if (!videoTracks || videoTracks.length === 0) {
    throw new Error('Canvas video track is missing from stream');
  }

  // Destination audio tracks
  const audioTracks = destination.stream.getAudioTracks();
  if (!audioTracks || audioTracks.length === 0) {
    throw new Error('Destination audio track is missing from stream');
  }

  // Build the recording stream:
  // new MediaStream([...canvas.captureStream(30).getVideoTracks(), ...destination.stream.getAudioTracks()])
  const recordingStream = new MediaStream([
    ...videoTracks,
    ...audioTracks,
  ]);

  // Check that the stream has 1 video track and 1 audio track
  if (recordingStream.getVideoTracks().length !== 1) {
    throw new Error(`Expected exactly 1 video track, got ${recordingStream.getVideoTracks().length}`);
  }
  if (recordingStream.getAudioTracks().length !== 1) {
    throw new Error(`Expected exactly 1 audio track, got ${recordingStream.getAudioTracks().length}`);
  }

  // WhatsApp-compatible bitrates: 128kbps AAC audio & 4Mbps H.264 video
  const recorderOptions: MediaRecorderOptions = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 4000000,
  };
  if (chosenMime) {
    recorderOptions.mimeType = chosenMime;
  }

  const recorder = new MediaRecorder(recordingStream, recorderOptions);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const finalBlob = new Blob(chunks, {
        type: recorder.mimeType || chosenMime || 'video/mp4',
      });
      try {
        audioBufferSource.stop();
      } catch {
        // Already stopped
      }
      if (audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
      try {
        bgVideo.pause();
        bgVideo.src = '';
        if (bgVideo.parentNode) {
          bgVideo.parentNode.removeChild(bgVideo);
        }
      } catch {
        // Cleanup
      }
      resolve(finalBlob);
    };

    recorder.onerror = (err) => {
      try {
        bgVideo.pause();
        bgVideo.src = '';
        if (bgVideo.parentNode) {
          bgVideo.parentNode.removeChild(bgVideo);
        }
      } catch {
        // Cleanup
      }
      reject(err);
    };
  });

  // Start background video and audio at the exact same moment recording starts
  bgVideo.currentTime = 0;
  try {
    await bgVideo.play();
  } catch (err) {
    console.warn('Background video play error:', err);
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  audioBufferSource.start(0);
  recorder.start();

  const recipientNameClean =
    state.recipientMode === 'special' ? state.recipientName.trim() : undefined;

  for (let frame = 0; frame < totalFrames; frame++) {
    const time = frame / fps;

    drawFestivalVideoFrame(
      ctx,
      width,
      height,
      bgVideo,
      festival,
      template,
      state.senderName.trim(),
      recipientNameClean,
      state.recipientMode,
      time
    );

    // Notify progress
    const pct = (frame + 1) / totalFrames;
    if (onProgress) {
      onProgress({
        progress: pct * 0.9,
        statusText:
          pct < 0.3
            ? `रामलला दिव्य दर्शन सजीव हो रहा है...`
            : pct < 0.7
            ? `भक्ति संगीत व 3D प्रकाश संकलित हो रहा है...`
            : `सिनेमैटिक वीडियो रेंडर हो रहा है...`,
      });
    }

    await new Promise((r) => setTimeout(r, 1000 / fps));
  }

  recorder.stop();
  const rawRecordedBlob = await recordingPromise;

  let finalMp4Blob: Blob = rawRecordedBlob;

  // WhatsApp audio compatibility check:
  // If the browser natively recorded MP4 with AAC (e.g. Safari / iOS), use it directly.
  // If recorded as WebM/Opus, transcode to real MP4 (H.264 + AAC) with faststart flags.
  if (isDirectMp4WithAac && rawRecordedBlob.type.includes('mp4')) {
    finalMp4Blob = new Blob([rawRecordedBlob], { type: 'video/mp4' });
  } else {
    if (onProgress) {
      onProgress({
        progress: 0.95,
        statusText: 'वीडियो तैयार हो रहा है...',
      });
    }

    try {
      const transcodeResp = await fetch('/api/transcode-mp4', {
        method: 'POST',
        headers: { 'Content-Type': rawRecordedBlob.type || 'video/webm' },
        body: rawRecordedBlob,
      });

      if (transcodeResp.ok) {
        const transBlob = await transcodeResp.blob();
        if (transBlob.size > 1000) {
          finalMp4Blob = new Blob([transBlob], { type: 'video/mp4' });
        }
      } else {
        console.warn('Transcode API returned error, keeping recorded blob as mp4');
        finalMp4Blob = new Blob([rawRecordedBlob], { type: 'video/mp4' });
      }
    } catch (err) {
      console.warn('Transcode request failed:', err);
      finalMp4Blob = new Blob([rawRecordedBlob], { type: 'video/mp4' });
    }
  }

  return {
    blob: finalMp4Blob,
    mimeType: 'video/mp4',
    extension: 'mp4',
  };
}

