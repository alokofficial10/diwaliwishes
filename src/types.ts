/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FestivalId = 'diwali';

export type RecipientMode = 'special' | 'all';
export type GreetingType = 'card' | 'video';

export interface WishTemplate {
  id: string;
  titleHi: string;
  titleEn: string;
  specialTextHi: (sender: string, recipient: string) => string;
  allTextHi: (sender: string) => string;
  specialTextEn?: (sender: string, recipient: string) => string;
  allTextEn?: (sender: string) => string;
  quoteHi: string;
  quoteEn?: string;
  englishSubtext: string;
}

export type ArtworkType = 'diwali_diya';

export interface FestivalConfig {
  id: FestivalId;
  slug: string;
  name: string;
  nameHi: string;
  headingHi: string;
  subtitleHi: string;
  subtitleEn: string;
  taglineHi: string;
  taglineEn: string;
  icon: string;
  badgeLabel: string;
  cardThumbnailBg: string;
  colors: {
    bgStart: string;
    bgMid: string;
    bgEnd: string;
    accentPrimary: string;
    accentSecondary: string;
    textGold: string;
    badgeBg: string;
    borderGlow: string;
  };
  artworkType: ArtworkType;
  heroAssetUrl?: string;
  templates: WishTemplate[];
}

export interface GreetingState {
  festivalId: FestivalId;
  senderName: string;
  recipientMode: RecipientMode;
  recipientName: string;
  greetingType: GreetingType;
  templateId: string;
}

export interface GeneratedResult {
  festivalId: FestivalId;
  type: GreetingType;
  blobUrl: string;
  blob: Blob;
  file: File;
  mimeType: string;
  extension: 'png' | 'mp4' | 'webm';
  senderName: string;
  recipientName?: string;
  recipientMode: RecipientMode;
  shareableUrl: string;
  shareText: string;
}
