/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Return clean, plain website URL without any query params or hash
export function getPlainWebsiteUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
}

// Build standard caption containing the greeting and website link
export function buildShareCaption(senderName: string, lang: 'hi' | 'en'): string {
  const websiteUrl = getPlainWebsiteUrl();
  const cleanSender = senderName.trim() || (lang === 'hi' ? 'आपके प्रियजन' : 'Your friend');

  let caption = '';
  if (lang === 'en') {
    caption = `🪔 Warm Diwali wishes from ${cleanSender}! 🙏\n\nCreate your own beautiful greeting for your loved ones:\n${websiteUrl}`;
  } else {
    caption = `🪔 ${cleanSender} की ओर से दीपावली की हार्दिक शुभकामनाएँ! 🙏\n\nआप भी अपनों के लिए ऐसा खूबसूरत ग्रीटिंग बनाइए:\n${websiteUrl}`;
  }

  // Ensure pure clean UTF-8 text without replacement character (\uFFFD) or encoding corruption
  return caption.normalize('NFC').replace(/\uFFFD/g, '').trim();
}


// Download any Blob or File to user's device
export function downloadBlob(blob: Blob | File, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

// Share real generated file directly on WhatsApp
export async function shareGreetingFileToWhatsApp(params: {
  file: File;
  caption: string;
  lang: 'hi' | 'en';
  onNotice: (msg: string) => void;
}): Promise<void> {
  // a) Mobile native share sheet with real file
  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [params.file] })
  ) {
    try {
      await navigator.share({
        files: [params.file],
        text: params.caption,
      });
      return;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        // User dismissed/cancelled share sheet, do nothing
        return;
      }
      // If sharing was rejected or failed, proceed to desktop fallback below
    }
  }

  // b) Fallback (e.g. desktop or unsupported browser):
  // Automatically download file, open WhatsApp Web with caption, and display toast message
  downloadBlob(params.file, params.file.name);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(params.caption)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');

  const notice =
    params.lang === 'hi'
      ? 'फाइल डाउनलोड हो गई है, WhatsApp में अटैच करके भेजें'
      : 'File downloaded, please attach it in WhatsApp and send';
  params.onNotice(notice);
}

// Share real file through device native share sheet (More Options button)
export async function shareGreetingFileNative(params: {
  file: File;
  caption: string;
  lang: 'hi' | 'en';
  onNotice: (msg: string) => void;
}): Promise<void> {
  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [params.file] })
  ) {
    try {
      await navigator.share({
        title: 'Diwali Greeting',
        text: params.caption,
        files: [params.file],
      });
      return;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return;
      }
    }
  }

  // Fallback to WhatsApp share flow
  await shareGreetingFileToWhatsApp(params);
}

// Facebook share popup
export function shareToFacebook(shareUrl: string, caption?: string) {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedQuote = caption ? `&quote=${encodeURIComponent(caption)}` : '';
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}${encodedQuote}`;
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
}
