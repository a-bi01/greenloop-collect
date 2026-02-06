import { Rarity } from './collectibles';

export type CosmeticType = 'title' | 'avatar_frame' | 'profile_border' | 'badge';

export interface CosmeticItem {
  id: string;
  name: string;
  type: CosmeticType;
  rarity: Rarity;
  emoji: string;
  description: string;
  cssClass: string;
  titleText?: string;
}

export interface EquippedCosmetics {
  titleId: string | null;
  avatarFrameId: string | null;
  profileBorderId: string | null;
  badgeIds: string[];
}

export const DEFAULT_EQUIPPED: EquippedCosmetics = {
  titleId: null,
  avatarFrameId: null,
  profileBorderId: null,
  badgeIds: [],
};

export const ALL_COSMETICS: CosmeticItem[] = [
  // === GACHA COSMETICS ===
  // Common - Badges
  { id: 'badge-sprout', name: 'Sprout', type: 'badge', rarity: 'Common', emoji: '🌱', description: 'A tiny green sprout', cssClass: '' },
  { id: 'badge-recycler', name: 'Recycler', type: 'badge', rarity: 'Common', emoji: '♻️', description: 'Recycle champion', cssClass: '' },
  { id: 'badge-leaf', name: 'Leaf', type: 'badge', rarity: 'Common', emoji: '🍃', description: 'Fresh leaf badge', cssClass: '' },
  // Common - Frames
  { id: 'frame-leaf', name: 'Leaf Border', type: 'avatar_frame', rarity: 'Common', emoji: '🌿', description: 'Simple green border', cssClass: 'cosmetic-frame-leaf' },
  { id: 'frame-eco', name: 'Eco Frame', type: 'avatar_frame', rarity: 'Common', emoji: '🌍', description: 'Basic eco frame', cssClass: 'cosmetic-frame-eco' },
  // Common - Borders
  { id: 'border-green', name: 'Basic Green', type: 'profile_border', rarity: 'Common', emoji: '💚', description: 'Simple green card border', cssClass: 'cosmetic-border-green' },
  // Common - Titles
  { id: 'title-eco-newbie', name: 'Eco Newbie', type: 'title', rarity: 'Common', emoji: '🌱', description: 'Starting your green journey', cssClass: '', titleText: 'Eco Newbie' },

  // Rare - Badges
  { id: 'badge-otter', name: 'Otter Star', type: 'badge', rarity: 'Rare', emoji: '🦦', description: 'Rare otter badge', cssClass: '' },
  { id: 'badge-power', name: 'Power Green', type: 'badge', rarity: 'Rare', emoji: '⚡', description: 'Electrifying eco power', cssClass: '' },
  { id: 'badge-wave', name: 'Wave Rider', type: 'badge', rarity: 'Rare', emoji: '🌊', description: 'Ride the eco wave', cssClass: '' },
  // Rare - Frames
  { id: 'frame-ocean', name: 'Ocean Wave', type: 'avatar_frame', rarity: 'Rare', emoji: '🌊', description: 'Blue gradient frame', cssClass: 'cosmetic-frame-ocean' },
  { id: 'frame-neon', name: 'Neon Green', type: 'avatar_frame', rarity: 'Rare', emoji: '💚', description: 'Glowing neon frame', cssClass: 'cosmetic-frame-neon' },
  // Rare - Borders
  { id: 'border-rare-glow', name: 'Rare Glow', type: 'profile_border', rarity: 'Rare', emoji: '✨', description: 'Glowing card border', cssClass: 'cosmetic-border-rare' },
  // Rare - Titles
  { id: 'title-eco-warrior', name: 'Eco Warrior', type: 'title', rarity: 'Rare', emoji: '⚔️', description: 'Battle for the planet', cssClass: '', titleText: 'Eco Warrior' },
  { id: 'title-green-champion', name: 'Green Champion', type: 'title', rarity: 'Rare', emoji: '🏆', description: 'Champion of green', cssClass: '', titleText: 'Green Champion' },

  // SSR - Badges
  { id: 'badge-crown', name: 'Crown', type: 'badge', rarity: 'SSR', emoji: '👑', description: 'Legendary crown badge', cssClass: '' },
  { id: 'badge-superstar', name: 'Superstar', type: 'badge', rarity: 'SSR', emoji: '🌟', description: 'Ultra rare superstar', cssClass: '' },
  { id: 'badge-diamond', name: 'Diamond', type: 'badge', rarity: 'SSR', emoji: '💎', description: 'Flawless diamond badge', cssClass: '' },
  // SSR - Frames
  { id: 'frame-golden', name: 'Golden Legendary', type: 'avatar_frame', rarity: 'SSR', emoji: '👑', description: 'Shimmering gold frame', cssClass: 'cosmetic-frame-golden' },
  { id: 'frame-cosmic', name: 'Cosmic Shimmer', type: 'avatar_frame', rarity: 'SSR', emoji: '🌌', description: 'Cosmic animated frame', cssClass: 'cosmetic-frame-cosmic' },
  // SSR - Borders
  { id: 'border-shimmer', name: 'SSR Shimmer', type: 'profile_border', rarity: 'SSR', emoji: '💫', description: 'Animated shimmer border', cssClass: 'cosmetic-border-ssr' },
  { id: 'border-golden-pulse', name: 'Golden Pulse', type: 'profile_border', rarity: 'SSR', emoji: '✨', description: 'Pulsing gold border', cssClass: 'cosmetic-border-golden' },
  // SSR - Titles
  { id: 'title-legendary-guardian', name: 'Legendary Guardian', type: 'title', rarity: 'SSR', emoji: '🛡️', description: 'Legendary protector', cssClass: '', titleText: '✦ Legendary Guardian ✦' },
  { id: 'title-ultra-eco-king', name: 'Ultra Eco King', type: 'title', rarity: 'SSR', emoji: '👑', description: 'The ultimate eco ruler', cssClass: '', titleText: '♛ Ultra Eco King ♛' },

  // === SHOP-EXCLUSIVE COSMETICS ===
  { id: 'shop-frame-pixel', name: 'Pixel Art', type: 'avatar_frame', rarity: 'Common', emoji: '🎮', description: 'Retro pixel border', cssClass: 'cosmetic-frame-pixel' },
  { id: 'shop-frame-rainbow', name: 'Rainbow', type: 'avatar_frame', rarity: 'Rare', emoji: '🌈', description: 'Colorful rainbow frame', cssClass: 'cosmetic-frame-rainbow' },
  { id: 'shop-badge-star', name: 'Star', type: 'badge', rarity: 'Common', emoji: '⭐', description: 'Classic star badge', cssClass: '' },
  { id: 'shop-badge-fire', name: 'Fire', type: 'badge', rarity: 'Common', emoji: '🔥', description: 'Hot fire badge', cssClass: '' },
  { id: 'shop-badge-diamond-plus', name: 'Diamond+', type: 'badge', rarity: 'Rare', emoji: '💠', description: 'Premium diamond badge', cssClass: '' },
  { id: 'shop-title-green-king', name: 'Green King', type: 'title', rarity: 'Rare', emoji: '🤴', description: 'King of green', cssClass: '', titleText: '♚ Green King' },
  { id: 'shop-title-eco-champion', name: 'Eco Champion+', type: 'title', rarity: 'Rare', emoji: '🏅', description: 'Ultimate champion', cssClass: '', titleText: '★ Eco Champion ★' },
  { id: 'shop-border-dots', name: 'Dotted', type: 'profile_border', rarity: 'Common', emoji: '⬜', description: 'Dotted card border', cssClass: 'cosmetic-border-dots' },
  { id: 'shop-border-gradient', name: 'Gradient', type: 'profile_border', rarity: 'Rare', emoji: '🎨', description: 'Gradient card border', cssClass: 'cosmetic-border-gradient' },
];

export const getCosmeticById = (id: string): CosmeticItem | undefined =>
  ALL_COSMETICS.find(c => c.id === id);

export const getCosmeticsByType = (type: CosmeticType): CosmeticItem[] =>
  ALL_COSMETICS.filter(c => c.type === type);

export const getGachaCosmetics = (rarity: Rarity): CosmeticItem[] =>
  ALL_COSMETICS.filter(c => c.rarity === rarity && !c.id.startsWith('shop-'));
