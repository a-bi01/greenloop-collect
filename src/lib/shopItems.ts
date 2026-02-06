export type ShopCategory = 'external_voucher' | 'sp_merch' | 'sticker_pack' | 'cosmetic';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  emoji: string;
  stockKey?: string;
  isPhysical: boolean;
  cosmeticId?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // External Vouchers (Limited)
  { id: 'grab-10', name: 'Grab $10 Voucher', category: 'external_voucher', price: 8000, description: 'Grab ride or food voucher', emoji: '🚗', stockKey: 'grab-10', isPhysical: false },
  { id: 'ntuc-10', name: 'NTUC $10 Voucher', category: 'external_voucher', price: 8000, description: 'NTUC FairPrice voucher', emoji: '🛒', stockKey: 'ntuc-10', isPhysical: false },
  { id: 'boost-10', name: 'Boost $10 Voucher', category: 'external_voucher', price: 7000, description: 'Boost juice voucher', emoji: '🧃', stockKey: 'boost-10', isPhysical: false },
  { id: 'grab-20', name: 'Grab $20 Voucher', category: 'external_voucher', price: 16000, description: 'Premium Grab voucher', emoji: '🚗', stockKey: 'grab-20', isPhysical: false },

  // SP Merch (Limited)
  { id: 'sp-shirt', name: 'SP GreenLoop Shirt', category: 'sp_merch', price: 7000, description: 'Exclusive SP eco tee', emoji: '👕', stockKey: 'sp-shirt', isPhysical: true },
  { id: 'sp-tote', name: 'SP Eco Tote Bag', category: 'sp_merch', price: 5000, description: 'Reusable canvas tote', emoji: '👜', stockKey: 'sp-tote', isPhysical: true },
  { id: 'sp-bottle', name: 'SP Water Bottle', category: 'sp_merch', price: 6000, description: 'Stainless steel bottle', emoji: '🍶', stockKey: 'sp-bottle', isPhysical: true },

  // Media & Design Sticker Packs (Limited)
  { id: 'sticker-hawker', name: 'Hawker Heroes Pack', category: 'sticker_pack', price: 1500, description: 'Food-themed sticker set', emoji: '🍜', stockKey: 'sticker-hawker', isPhysical: true },
  { id: 'sticker-eco', name: 'Eco Warriors Pack', category: 'sticker_pack', price: 2000, description: 'Eco-themed sticker set', emoji: '🌿', stockKey: 'sticker-eco', isPhysical: true },
  { id: 'sticker-campus', name: 'SP Campus Pack', category: 'sticker_pack', price: 2500, description: 'SP campus sticker set', emoji: '🏫', stockKey: 'sticker-campus', isPhysical: true },

  // Cosmetics (Unlimited)
  { id: 'shop-cos-frame-pixel', name: 'Pixel Art Frame', category: 'cosmetic', price: 300, description: 'Retro pixel avatar frame', emoji: '🎮', isPhysical: false, cosmeticId: 'shop-frame-pixel' },
  { id: 'shop-cos-frame-rainbow', name: 'Rainbow Frame', category: 'cosmetic', price: 500, description: 'Colorful rainbow frame', emoji: '🌈', isPhysical: false, cosmeticId: 'shop-frame-rainbow' },
  { id: 'shop-cos-badge-star', name: 'Star Badge', category: 'cosmetic', price: 200, description: 'Classic star badge', emoji: '⭐', isPhysical: false, cosmeticId: 'shop-badge-star' },
  { id: 'shop-cos-badge-fire', name: 'Fire Badge', category: 'cosmetic', price: 200, description: 'Hot fire badge', emoji: '🔥', isPhysical: false, cosmeticId: 'shop-badge-fire' },
  { id: 'shop-cos-badge-diamond', name: 'Diamond+ Badge', category: 'cosmetic', price: 600, description: 'Premium diamond badge', emoji: '💠', isPhysical: false, cosmeticId: 'shop-badge-diamond-plus' },
  { id: 'shop-cos-title-king', name: 'Green King Title', category: 'cosmetic', price: 400, description: 'Royal green title', emoji: '🤴', isPhysical: false, cosmeticId: 'shop-title-green-king' },
  { id: 'shop-cos-title-champion', name: 'Eco Champion+ Title', category: 'cosmetic', price: 800, description: 'Ultimate champion title', emoji: '🏅', isPhysical: false, cosmeticId: 'shop-title-eco-champion' },
  { id: 'shop-cos-border-dots', name: 'Dotted Border', category: 'cosmetic', price: 300, description: 'Dotted card border', emoji: '⬜', isPhysical: false, cosmeticId: 'shop-border-dots' },
  { id: 'shop-cos-border-gradient', name: 'Gradient Border', category: 'cosmetic', price: 500, description: 'Gradient card border', emoji: '🎨', isPhysical: false, cosmeticId: 'shop-border-gradient' },
];

export const DEFAULT_SHOP_STOCK: Record<string, number> = {
  'grab-10': 20,
  'ntuc-10': 20,
  'boost-10': 20,
  'grab-20': 10,
  'sp-shirt': 10,
  'sp-tote': 20,
  'sp-bottle': 15,
  'sticker-hawker': 50,
  'sticker-eco': 50,
  'sticker-campus': 50,
};

export const getShopItemById = (id: string): ShopItem | undefined =>
  SHOP_ITEMS.find(i => i.id === id);

export const SHOP_CATEGORIES: { key: ShopCategory; label: string; emoji: string }[] = [
  { key: 'external_voucher', label: 'Vouchers', emoji: '🎟️' },
  { key: 'sp_merch', label: 'SP Merch', emoji: '👕' },
  { key: 'sticker_pack', label: 'Stickers', emoji: '🍜' },
  { key: 'cosmetic', label: 'Cosmetics', emoji: '🎨' },
];
