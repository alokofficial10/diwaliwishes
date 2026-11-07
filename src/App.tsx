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

        {/* Rich Content Sections for Publisher Value, User Guidance, and Search Crawlers */}
        {!generatedResult && (
          <section className="mt-12 space-y-8 text-amber-100/90 font-poppins">
            {/* 1. How It Works (3 Steps) */}
            <div className="rounded-2xl bg-amber-950/40 border border-amber-600/30 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-rozha mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>{lang === 'hi' ? 'यह कैसे काम करता है (3 सरल चरण)' : 'How It Works (3 Simple Steps)'}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs mb-2">1</div>
                  <h3 className="font-semibold text-amber-200 text-sm mb-1">
                    {lang === 'hi' ? 'नाम और मोड चुनें' : 'Enter Names'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'अपना नाम लिखें और चुनें कि किसी खास व्यक्ति को भेजना है या पूरे परिवार/ग्रुप को।'
                      : 'Type your name and choose whether wishing a specific person or everyone.'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs mb-2">2</div>
                  <h3 className="font-semibold text-amber-200 text-sm mb-1">
                    {lang === 'hi' ? 'कार्ड या वीडियो चुनें' : 'Select Format'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'पारंपरिक फोटो कार्ड (PNG) या रामलला भक्ति संगीत वाला एनिमेटेड वीडियो (MP4) चुनें।'
                      : 'Pick high-definition photo card (PNG) or Ayodhya Ram Lala animated video (MP4).'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs mb-2">3</div>
                  <h3 className="font-semibold text-amber-200 text-sm mb-1">
                    {lang === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share & Save'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'एक क्लिक में सीधे WhatsApp चैट में भेजें या अपने फोन की गैलरी में सुरक्षित डाउनलोड करें।'
                      : 'Send directly to WhatsApp chats/status or download safely to your device.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Significance of Diwali */}
            <div className="rounded-2xl bg-amber-950/40 border border-amber-600/30 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-rozha mb-3 flex items-center gap-2">
                <span>🪔</span>
                <span>{lang === 'hi' ? 'दीपावली का पावन महत्व' : 'The Significance of Diwali'}</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-amber-200/80 leading-relaxed">
                <p>
                  {lang === 'hi'
                    ? 'दीपावली सनातन संस्कृति का वह महापर्व है जो अंधकार पर प्रकाश, अज्ञान पर ज्ञान और अधर्म पर धर्म की शाश्वत विजय का उत्सव मनाता है। कार्तिक मास की अमावस्या को जब मर्यादा पुरुषोत्तम भगवान श्री राम चौदह वर्ष के वनवास के पश्चात लंका पर विजय प्राप्त कर माता सीता और भ्राता लक्ष्मण संग अयोध्या पधारे थे, तब अवधवासियों ने घी के असंख्य दीपक जलाकर उनका स्वागत किया था।'
                    : 'Diwali, the Divine Festival of Lights, commemorates the triumphant homecoming of Lord Rama, Mother Sita, and Lakshmana to Ayodhya after 14 years of exile. Celebrated on the auspicious night of Kartik Amavasya, the citizens illuminated every threshold with rows of golden earthen lamps (diyas), marking the eternal victory of righteous virtue over darkness.'}
                </p>
                <p>
                  {lang === 'hi'
                    ? 'दीपावली की मुख्य संध्या को सुख-समृद्धि की देवी माता महालक्ष्मी और बुद्धि के प्रदाता विघ्नहर्ता भगवान श्री गणेश का पूजन किया जाता है। यह पर्व हमें सिखाता है कि धन के साथ विवेक का होना अनिवार्य है। अपने हृदय के अज्ञान को मिटाकर प्रेम, क्षमा और परोपकार के दीप जलाना ही इस महापर्व की सच्ची साधना है।'
                    : 'On the main festive night, families worship Goddess Lakshmi for prosperity and Lord Ganesha for wisdom and auspicious beginnings. Diwali inspires us to illuminate not just our physical homes, but our inner consciousness with generosity, forgiveness, and unconditional love.'}
                </p>
              </div>
            </div>

            {/* 3. Tips for Sending Diwali Wishes */}
            <div className="rounded-2xl bg-amber-950/40 border border-amber-600/30 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-rozha mb-3 flex items-center gap-2">
                <span>💌</span>
                <span>{lang === 'hi' ? 'दीपावली की शुभकामनाएँ कैसे भेजें' : 'Tips for Sending Festive Wishes'}</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-200/80 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-amber-200">
                    {lang === 'hi' ? 'व्यक्तिगत नाम जोड़ें: ' : 'Use Personal Names: '}
                  </strong>
                  {lang === 'hi'
                    ? 'सामान्य फॉरवर्डेड संदेशों की बजाय प्राप्तकर्ता का नाम लिखकर भेजें, इससे अपनापन और आदर प्रकट होता है।'
                    : 'Add the recipient\'s real name rather than generic forwarded messages for genuine warmth.'}
                </li>
                <li>
                  <strong className="text-amber-200">
                    {lang === 'hi' ? 'वीडियो का चुनाव करें: ' : 'Choose Video for WhatsApp Status: '}
                  </strong>
                  {lang === 'hi'
                    ? 'हमारे 8-सेकंड के भक्तिमय वीडियो में रामलला दर्शन और मधुर भजन है, जो WhatsApp स्टेटस और पारिवारिक ग्रुप्स के लिए सर्वोत्तम है।'
                    : 'Our vertical 8-second video includes divine Ayodhya Ram Lala visual and audio, perfect for status updates.'}
                </li>
                <li>
                  <strong className="text-amber-200">
                    {lang === 'hi' ? 'स्वास्थ्य और शांति की कामना: ' : 'Wish for Health & Peace: '}
                  </strong>
                  {lang === 'hi'
                    ? 'केवल धन ही नहीं, बल्कि परिवार के आरोग्य, संतोष और मानसिक शांति की मंगलकामनाएँ साझा करें।'
                    : 'Always combine wishes for material success with blessings for robust health, harmony, and peace of mind.'}
                </li>
              </ul>
            </div>

            {/* 4. Festive Guides & Articles */}
            <div className="rounded-2xl bg-amber-950/40 border border-amber-600/30 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-rozha mb-4 flex items-center gap-2">
                <span>📖</span>
                <span>{lang === 'hi' ? 'त्योहारी लेख एवं उपयोगी मार्गदर्शिकाएँ' : 'Festive Guides & Articles'}</span>
              </h2>
              <div className="space-y-2.5">
                <a
                  href="/articles/diwali-significance.html"
                  className="block p-3 rounded-xl bg-black/30 hover:bg-amber-900/30 border border-amber-500/20 text-xs sm:text-sm transition-all text-amber-200 hover:text-amber-100"
                >
                  <strong className="block text-amber-300 mb-0.5">🪔 दीपावली का पावन महत्व, आध्यात्मिक इतिहास और संदेश</strong>
                  <span className="text-[11px] text-amber-400/60">भगवान श्री राम का अयोध्या आगमन और पंचदिवसीय दीपोत्सव का आध्यात्मिक रहस्य पढ़ें।</span>
                </a>
                <a
                  href="/articles/laxmi-puja-vidhi.html"
                  className="block p-3 rounded-xl bg-black/30 hover:bg-amber-900/30 border border-amber-500/20 text-xs sm:text-sm transition-all text-amber-200 hover:text-amber-100"
                >
                  <strong className="block text-amber-300 mb-0.5">🕯️ घर पर सरल लक्ष्मी-गणेश पूजन विधि (Laxmi Puja Vidhi)</strong>
                  <span className="text-[11px] text-amber-400/60">दीपावली की शाम घर पर आवश्यक सामग्री और चरणबद्ध पूजन की सरल व सात्विक विधि।</span>
                </a>
                <a
                  href="/articles/diwali-wishes-in-hindi.html"
                  className="block p-3 rounded-xl bg-black/30 hover:bg-amber-900/30 border border-amber-500/20 text-xs sm:text-sm transition-all text-amber-200 hover:text-amber-100"
                >
                  <strong className="block text-amber-300 mb-0.5">💌 25 सर्वश्रेष्ठ दीपावली शुभकामना संदेश (Diwali Wishes in Hindi)</strong>
                  <span className="text-[11px] text-amber-400/60">परिवार, दोस्तों और सहकर्मियों के लिए चुनिंदा मौलिक व अर्थपूर्ण बधाई संदेश।</span>
                </a>
                <a
                  href="/articles/how-to-send-diwali-greeting-on-whatsapp.html"
                  className="block p-3 rounded-xl bg-black/30 hover:bg-amber-900/30 border border-amber-500/20 text-xs sm:text-sm transition-all text-amber-200 hover:text-amber-100"
                >
                  <strong className="block text-amber-300 mb-0.5">📲 WhatsApp पर व्यक्तिगत कार्ड व वीडियो भेजने का तरीका</strong>
                  <span className="text-[11px] text-amber-400/60">अपने नाम का कार्ड व स्टेटस वीडियो 1 क्लिक में डाउनलोड और शेयर करने की गाइड।</span>
                </a>
                <a
                  href="/how-to-use.html"
                  className="block p-3 rounded-xl bg-black/30 hover:bg-amber-900/30 border border-amber-500/20 text-xs sm:text-sm transition-all text-amber-200 hover:text-amber-100"
                >
                  <strong className="block text-amber-300 mb-0.5">❓ diwaliwishes.online का उपयोग कैसे करें (User Guide & FAQs)</strong>
                  <span className="text-[11px] text-amber-400/60">वेबसाइट की सभी सुविधाओं का विवरण और अक्सर पूछे जाने वाले 6 प्रश्नोत्तर।</span>
                </a>
                <a
                  href="/articles/index.html"
                  className="block p-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs sm:text-sm transition-all text-amber-200 hover:text-white font-medium text-center"
                >
                  <strong className="block text-amber-300 mb-0.5">
                    {lang === 'hi' ? '📚 सभी १५ दीपावली लेख एवं मार्गदर्शिकाएँ पढ़ें' : '📚 View All 15 Festive Articles & Guides'}
                  </strong>
                  <span className="text-[11px] text-amber-300/80">
                    {lang === 'hi' ? 'धनतेरस, गोवर्धन, भाई दूज, रंगोली, पर्यावरण, सुरक्षा, शायरी व शुभकामनाओं पर विस्तृत लेख' : 'Explore all guides on Dhanteras, Bhai Dooj, Rangoli, Safety, Aarti & Wishes'}
                  </span>
                </a>
              </div>
            </div>

            {/* 5. FAQ (6 Questions) */}
            <div className="rounded-2xl bg-amber-950/40 border border-amber-600/30 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-rozha mb-4 flex items-center gap-2">
                <span>💬</span>
                <span>{lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}</span>
              </h2>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <h3 className="font-semibold text-amber-200 text-xs sm:text-sm mb-1">
                    {lang === 'hi' ? '1. क्या diwaliwishes.online का उपयोग पूरी तरह मुफ़्त है?' : '1. Is diwaliwishes.online completely free?'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'हाँ, यहाँ कार्ड और वीडियो बनाना 100% मुफ़्त है। किसी भी सुविधा के लिए कोई शुल्क नहीं लिया जाता।'
                      : 'Yes, generating personalized cards and animated videos is 100% free with no hidden charges.'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <h3 className="font-semibold text-amber-200 text-xs sm:text-sm mb-1">
                    {lang === 'hi' ? '2. क्या मुझे कोई ऐप डाउनलोड या अकाउंट बनाना होगा?' : '2. Do I need an app or sign-up?'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'बिल्कुल नहीं। यह सेवा सीधे आपके फोन या कंप्यूटर के ब्राउज़र में बिना किसी लॉगिन या ऐप के काम करती है।'
                      : 'No app download or account registration is required; it runs directly in your browser.'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <h3 className="font-semibold text-amber-200 text-xs sm:text-sm mb-1">
                    {lang === 'hi' ? '3. क्या वीडियो में भक्ति संगीत WhatsApp पर भी बजेगा?' : '3. Does the video audio play on WhatsApp?'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'हाँ, हमारा सिस्टम WhatsApp-कंपैटिबल AAC MP4 फॉर्मेट तैयार करता है, जिससे शेयर करने पर ऑडियो स्पष्ट सुनाई देता है।'
                      : 'Yes, our MP4 encoding uses WhatsApp-compatible AAC audio so music plays seamlessly upon sharing.'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <h3 className="font-semibold text-amber-200 text-xs sm:text-sm mb-1">
                    {lang === 'hi' ? '4. क्या मेरा नाम या व्यक्तिगत डेटा सर्वर पर स्टोर होता है?' : '4. Is my personal data stored on your server?'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'नहीं। सारा काम आपके डिवाइस (ब्राउज़र मेमोरी) में ही होता है। हम कोई भी नाम, संदेश या निजी डेटा अपने सर्वर पर नहीं रखते।'
                      : 'No. All rendering occurs locally inside your browser canvas; no names or personal messages are ever stored.'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <h3 className="font-semibold text-amber-200 text-xs sm:text-sm mb-1">
                    {lang === 'hi' ? '5. क्या मैं इसे WhatsApp स्टेटस और ग्रुप्स में शेयर कर सकता हूँ?' : '5. Can I share this on WhatsApp status and groups?'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'हाँ, आप सीधे WhatsApp बटन दबाकर चैट, फैमिली ग्रुप्स या स्टेटस में वीडियो और कार्ड आसानी से शेयर कर सकते हैं।'
                      : 'Yes, you can share directly via the WhatsApp button or download the file to post on your status and groups.'}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-amber-500/20">
                  <h3 className="font-semibold text-amber-200 text-xs sm:text-sm mb-1">
                    {lang === 'hi' ? '6. क्या मैं किसी खास व्यक्ति के नाम से भी कार्ड बना सकता हूँ?' : '6. Can I personalize wishes for a specific individual?'}
                  </h3>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    {lang === 'hi'
                      ? 'हाँ, आप "खास व्यक्ति को भेजें" विकल्प चुनकर प्राप्तकर्ता (जैसे माता-पिता, मित्र, भाई-बहन) का नाम भी जोड़ सकते हैं।'
                      : 'Yes, simply select "Special Person" mode to add the recipient\'s name alongside your own name for a personal touch.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Policy Reminder for Google AdSense:
          Ads should be placed strictly on editorial content pages (about.html, how-to-use.html, articles/*),
          and never inside the interactive greeting creator form, generation canvas, or result player. */}

      {/* Official Footer: Festive विशेष / diwaliwishes.online */}
      <footer className="relative z-10 bg-[#09020a]/95 backdrop-blur-md border-t border-amber-950/80 py-6 px-4 text-center text-xs text-amber-300/70 font-poppins space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium">
          <a href="/about.html" className="text-amber-300 hover:text-amber-100 hover:underline">About Us (हमारे बारे में)</a>
          <span className="text-amber-600/60">•</span>
          <a href="/how-to-use.html" className="text-amber-300 hover:text-amber-100 hover:underline">How to Use (उपयोग विधि)</a>
          <span className="text-amber-600/60">•</span>
          <a href="/articles/index.html" className="text-amber-300 hover:text-amber-100 hover:underline">Articles (लेख)</a>
          <span className="text-amber-600/60">•</span>
          <a href="/contact.html" className="text-amber-300 hover:text-amber-100 hover:underline">Contact Us (संपर्क)</a>
          <span className="text-amber-600/60">•</span>
          <a href="/privacy-policy.html" className="text-amber-300 hover:text-amber-100 hover:underline">Privacy Policy (गोपनीयता)</a>
          <span className="text-amber-600/60">•</span>
          <a href="/terms.html" className="text-amber-300 hover:text-amber-100 hover:underline">Terms & Conditions (नियम)</a>
        </div>

        <div className="flex items-center justify-center gap-2 pt-1">
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

        <div className="text-[11px] text-amber-500/50 pt-1">
          © 2026 diwaliwishes.online - सर्वाधिकार सुरक्षित | All rights reserved.
        </div>
      </footer>
    </div>
  );
}
