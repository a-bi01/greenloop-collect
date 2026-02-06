export type Rarity = 'Common' | 'Rare' | 'SSR';

export interface Collectible {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  series: string;
}

export const ALL_COLLECTIBLES: Collectible[] = [
  // Common (7)
  { id: 'mala-monster', name: 'Mala Monster', emoji: '🌶️', rarity: 'Common', series: 'SP Hawkerverse S1' },
  { id: 'chicken-rice-bot', name: 'Chicken Rice Bot', emoji: '🍗', rarity: 'Common', series: 'SP Hawkerverse S1' },
  { id: 'bubble-tea-slime', name: 'Bubble Tea Slime', emoji: '🧋', rarity: 'Common', series: 'SP Hawkerverse S1' },
  { id: 'kopi-uncle', name: 'Kopi Uncle', emoji: '☕', rarity: 'Common', series: 'SP Hawkerverse S1' },
  { id: 'nasi-lemak-ninja', name: 'Nasi Lemak Ninja', emoji: '🍛', rarity: 'Common', series: 'SP Hawkerverse S1' },
  { id: 'roti-prata-ranger', name: 'Roti Prata Ranger', emoji: '🫓', rarity: 'Common', series: 'SP Hawkerverse S1' },
  { id: 'ice-kachang-yeti', name: 'Ice Kachang Yeti', emoji: '🍧', rarity: 'Common', series: 'SP Hawkerverse S1' },
  // Rare (3)
  { id: 'golden-otter', name: 'Golden Otter', emoji: '🦦', rarity: 'Rare', series: 'SP Eco Legends' },
  { id: 'techno-tofu', name: 'Techno Tofu', emoji: '🤖', rarity: 'Rare', series: 'SP Eco Legends' },
  { id: 'recycling-raptor', name: 'Recycling Raptor', emoji: '🦖', rarity: 'Rare', series: 'SP Eco Legends' },
  // SSR (3)
  { id: 'legendary-kopi-king', name: 'Legendary Kopi King', emoji: '👑', rarity: 'SSR', series: 'SP Mythics' },
  { id: 'cyber-chicken-rice', name: 'Cyber Chicken Rice SSR', emoji: '🐔', rarity: 'SSR', series: 'SP Mythics' },
  { id: 'ultra-green-guardian', name: 'Ultra Green Guardian', emoji: '🦸', rarity: 'SSR', series: 'SP Mythics' },
];

export const getCollectibleById = (id: string): Collectible | undefined =>
  ALL_COLLECTIBLES.find(c => c.id === id);

export const rarityBadgeClass = (rarity: Rarity): string => {
  switch (rarity) {
    case 'Common': return 'rarity-common';
    case 'Rare': return 'rarity-rare';
    case 'SSR': return 'rarity-ssr';
  }
};

export const rarityGlowClass = (rarity: Rarity): string => {
  switch (rarity) {
    case 'Common': return '';
    case 'Rare': return 'glow-rare';
    case 'SSR': return 'glow-ssr';
  }
};

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'EcoWarrior_SG', containers: 45, streak: 12 },
  { rank: 2, name: 'GreenQueen88', containers: 38, streak: 9 },
  { rank: 3, name: 'You (SP Student)', containers: 10, streak: 3 },
  { rank: 4, name: 'RecycleKing', containers: 8, streak: 2 },
  { rank: 5, name: 'BubbleTeaFan', containers: 5, streak: 1 },
];
