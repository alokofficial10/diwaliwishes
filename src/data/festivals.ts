/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalConfig } from '../types';

export const FESTIVALS: FestivalConfig[] = [
  {
    id: 'diwali',
    slug: 'diwali',
    name: 'Diwali',
    nameHi: 'दीपावली',
    headingHi: 'शुभ दीपावली',
    subtitleHi: 'दीपों और खुशियों का पावन महापर्व',
    subtitleEn: 'The Divine Festival of Lights, Joy & Prosperity',
    taglineHi: 'दीप जले, जगमगाए संसार',
    taglineEn: 'Festival of Lights',
    icon: '🪔',
    badgeLabel: 'रोशनी का महापर्व',
    cardThumbnailBg: 'from-amber-950 via-red-950 to-stone-950',
    colors: {
      bgStart: '#2A0812',
      bgMid: '#5B0F24',
      bgEnd: '#130308',
      accentPrimary: '#F59E0B',
      accentSecondary: '#EF4444',
      textGold: '#FDE047',
      badgeBg: '#7F1D1D',
      borderGlow: 'rgba(245, 158, 11, 0.6)',
    },
    artworkType: 'diwali_diya',
    heroAssetUrl: '/assets/diwali_ram_mandir_personalized.png',
    templates: [
      {
        id: 'diwali_classic',
        titleHi: 'पारंपरिक दीपावली शुभकामना',
        titleEn: 'Classic Diwali Wish',
        specialTextHi: (s, r) => `${s} की ओर से ${r} को शुभ दीपावली की हार्दिक शुभकामनाएँ!`,
        allTextHi: (s) => `${s} की ओर से आपको और आपके परिवार को शुभ दीपावली की हार्दिक शुभकामनाएँ!`,
        specialTextEn: (s, r) => `Wishing ${r} a very Happy and prosperous Diwali, with warm wishes from ${s}!`,
        allTextEn: (s) => `Wishing you and your entire family a joyous Happy Diwali, from ${s}!`,
        quoteHi: 'दीपों की रोशनी से जगमगाए आपका संसार, सुख, समृद्धि और शांति का मिले उपहार।',
        quoteEn: 'May the divine glow of holy diyas bring endless peace, happiness and prosperity into your home.',
        englishSubtext: 'May the divine light of Diwali illuminate your life with joy and prosperity.',
      },
      {
        id: 'diwali_lakshmi',
        titleHi: 'माँ लक्ष्मी का आशीर्वाद',
        titleEn: 'Lakshmi Blessings',
        specialTextHi: (s, r) => `${s} की ओर से ${r} को दीपावली पर माँ लक्ष्मी और गणेश जी की असीम कृपा मिले!`,
        allTextHi: (s) => `${s} की ओर से आपके पूरे परिवार पर माँ लक्ष्मी व गणेश जी का आशीर्वाद बना रहे!`,
        specialTextEn: (s, r) => `May Goddess Lakshmi and Lord Ganesha shower boundless prosperity on ${r}, from ${s}!`,
        allTextEn: (s) => `May Goddess Lakshmi bless your entire family with abundant wealth and peace, from ${s}!`,
        quoteHi: 'माँ लक्ष्मी का हाथ हो, सरस्वती का साथ हो, गणेश जी का वास हो, और खुशियों का प्रकाश हो।',
        quoteEn: 'May your home be blessed with eternal fortune, divine wisdom, and auspicious celebrations.',
        englishSubtext: 'May Goddess Lakshmi bestow wealth, wisdom, happiness and enduring health upon you.',
      },
      {
        id: 'diwali_ram_mandir',
        titleHi: 'अयोध्या धाम दीपोत्सव',
        titleEn: 'Ayodhya Deepotsav Wish',
        specialTextHi: (s, r) => `${s} की ओर से ${r} को पावन दीपोत्सव व श्री राम कृपा की मंगलकामनाएँ!`,
        allTextHi: (s) => `${s} की ओर से अयोध्या धाम दीपोत्सव व दीपावली की हार्दिक शुभकामनाएँ!`,
        specialTextEn: (s, r) => `Heartfelt greetings of Sacred Deepotsav and Diwali to ${r}, with love from ${s}!`,
        allTextEn: (s) => `Warm greetings of Divine Deepotsav & Happy Diwali to you and your family, from ${s}!`,
        quoteHi: 'दीपों की माला सजे, प्रभु राम की कृपा बरसे, हर घर में खुशहाली और पावन उत्सव चमके।',
        quoteEn: 'May the sacred lamps of Ayodhya illuminate our hearts with righteous joy and harmony.',
        englishSubtext: 'May the sacred festive lights bring peace, noble virtues and righteous triumphs.',
      },
    ],
  },
];

export function getFestivalById(id?: string): FestivalConfig {
  return FESTIVALS[0];
}

export function isValidFestivalId(id?: string): boolean {
  return true;
}
