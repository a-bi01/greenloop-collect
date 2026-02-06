import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ALL_COLLECTIBLES, Collectible, Rarity } from './collectibles';
import { EquippedCosmetics, DEFAULT_EQUIPPED, getGachaCosmetics, ALL_COSMETICS, CosmeticType } from './cosmetics';
import { SHOP_ITEMS, DEFAULT_SHOP_STOCK } from './shopItems';

export interface InventoryItem {
  collectibleId: string;
  count: number;
}

export interface RedemptionPass {
  id: string;
  code: string;
  itemName: string;
  dateRedeemed: number;
  status: 'unclaimed' | 'claimed';
  type: 'physical' | 'voucher';
  voucherCode?: string;
  emoji: string;
}

export interface PartyState {
  active: boolean;
  memberCount: number;
  partyStreak: number;
}

export interface BonusReward {
  type: 'collectible_only' | 'coins' | 'cosmetic' | 'sticker_pack_voucher' | 'external_voucher' | 'legendary_set';
  coins?: number;
  cosmeticId?: string;
  cosmeticName?: string;
  redemptionId?: string;
  voucherName?: string;
  description: string;
}

export interface GachaResult {
  collectible: Collectible;
  bonus: BonusReward;
}

export interface GameState {
  userName: string;
  school: string;
  level: number;
  points: number;
  userCoins: number;
  currentStreakDays: number;
  containersBorrowed: number;
  containersReturned: number;
  lastActionTimestamp: number | null;
  inventory: InventoryItem[];
  recentPulls: string[];
  party: PartyState;
  alwaysSSR: boolean;
  alwaysVoucherSSR: boolean;
  monthlyVoucherStock: number;
  cosmeticsOwned: string[];
  equippedCosmetics: EquippedCosmetics;
  redemptions: RedemptionPass[];
  shopStock: Record<string, number>;
}

const STORAGE_KEY = 'greenloop-game-state';

function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GL-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const createDefaultState = (): GameState => ({
  userName: 'SP Student',
  school: 'Singapore Polytechnic',
  level: 3,
  points: 120,
  userCoins: 500,
  currentStreakDays: 3,
  containersBorrowed: 12,
  containersReturned: 10,
  lastActionTimestamp: Date.now(),
  inventory: [
    { collectibleId: 'mala-monster', count: 3 },
    { collectibleId: 'chicken-rice-bot', count: 2 },
    { collectibleId: 'bubble-tea-slime', count: 1 },
    { collectibleId: 'kopi-uncle', count: 1 },
    { collectibleId: 'golden-otter', count: 1 },
  ],
  recentPulls: ['mala-monster', 'golden-otter', 'chicken-rice-bot', 'bubble-tea-slime', 'kopi-uncle'],
  party: { active: false, memberCount: 1, partyStreak: 0 },
  alwaysSSR: false,
  alwaysVoucherSSR: false,
  monthlyVoucherStock: 30,
  cosmeticsOwned: ['badge-sprout', 'frame-leaf'],
  equippedCosmetics: {
    titleId: null,
    avatarFrameId: 'frame-leaf',
    profileBorderId: null,
    badgeIds: ['badge-sprout'],
  },
  redemptions: [],
  shopStock: { ...DEFAULT_SHOP_STOCK },
});

interface GameContextType {
  state: GameState;
  borrowContainer: () => void;
  returnContainer: () => GachaResult;
  addPartyMember: () => void;
  createParty: () => void;
  leaveParty: () => void;
  tradeCollectible: (giveId: string) => Collectible | null;
  toggleAlwaysSSR: () => void;
  toggleAlwaysVoucherSSR: () => void;
  resetDemo: () => void;
  equipCosmetic: (type: CosmeticType, cosmeticId: string) => void;
  unequipCosmetic: (type: CosmeticType, cosmeticId?: string) => void;
  purchaseShopItem: (itemId: string) => { success: boolean; redemptionId?: string };
  claimRedemption: (redemptionId: string) => void;
  resetRedemptions: () => void;
  resetShopStock: () => void;
  resetVoucherStock: () => void;
  grantAllCosmetics: () => void;
  resetCosmetics: () => void;
  randomizeCosmetics: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGameState = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
};

function pullRandom(alwaysSSR: boolean, partyFull: boolean): Collectible {
  let rarity: Rarity;
  if (alwaysSSR) {
    rarity = 'SSR';
  } else if (partyFull) {
    const roll = Math.random() * 100;
    if (roll < 5) rarity = 'SSR';
    else if (roll < 40) rarity = 'Rare';
    else rarity = 'Common';
  } else {
    const roll = Math.random() * 100;
    if (roll < 1) rarity = 'SSR';
    else if (roll < 20) rarity = 'Rare';
    else rarity = 'Common';
  }
  const pool = ALL_COLLECTIBLES.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function rollBonusReward(
  rarity: Rarity,
  cosmeticsOwned: string[],
  monthlyVoucherStock: number,
  alwaysVoucherSSR: boolean
): { bonus: BonusReward; newRedemption?: RedemptionPass } {
  const roll = Math.floor(Math.random() * 3);

  if (rarity === 'Common') {
    if (roll === 0) {
      return { bonus: { type: 'collectible_only', description: 'Sticker added to collection! ✨' } };
    } else if (roll === 1) {
      const pool = getGachaCosmetics('Common').filter(c => !cosmeticsOwned.includes(c.id));
      if (pool.length > 0) {
        const cos = pool[Math.floor(Math.random() * pool.length)];
        return { bonus: { type: 'cosmetic', cosmeticId: cos.id, cosmeticName: cos.name, description: `Earned: ${cos.emoji} ${cos.name}! 🎨` } };
      }
      const coins = 10 + Math.floor(Math.random() * 21);
      return { bonus: { type: 'coins', coins, description: `+${coins} coins! 🪙` } };
    } else {
      const coins = 10 + Math.floor(Math.random() * 21);
      return { bonus: { type: 'coins', coins, description: `+${coins} coins! 🪙` } };
    }
  }

  if (rarity === 'Rare') {
    if (roll === 0) {
      const coins = 80 + Math.floor(Math.random() * 71);
      return { bonus: { type: 'coins', coins, description: `+${coins} coins! 🪙` } };
    } else if (roll === 1) {
      const pool = getGachaCosmetics('Rare').filter(c => !cosmeticsOwned.includes(c.id));
      if (pool.length > 0) {
        const cos = pool[Math.floor(Math.random() * pool.length)];
        return { bonus: { type: 'cosmetic', cosmeticId: cos.id, cosmeticName: cos.name, description: `Rare cosmetic: ${cos.emoji} ${cos.name}! 🎨` } };
      }
      const coins = 80 + Math.floor(Math.random() * 71);
      return { bonus: { type: 'coins', coins, description: `+${coins} coins! 🪙` } };
    } else {
      const redemptionId = generateRedemptionCode();
      const redemption: RedemptionPass = {
        id: redemptionId,
        code: redemptionId,
        itemName: 'Media & Design Sticker Pack',
        dateRedeemed: Date.now(),
        status: 'unclaimed',
        type: 'physical',
        emoji: '📱',
      };
      return {
        bonus: { type: 'sticker_pack_voucher', redemptionId, description: 'Media & Design Sticker Pack Voucher! 📱' },
        newRedemption: redemption,
      };
    }
  }

  // SSR
  if (alwaysVoucherSSR && monthlyVoucherStock > 0) {
    const vouchers = ['Grab $10', 'NTUC $10', 'Boost $10', 'Grab $20'];
    const voucherName = vouchers[Math.floor(Math.random() * vouchers.length)];
    const redemptionId = generateRedemptionCode();
    const redemption: RedemptionPass = {
      id: redemptionId, code: redemptionId, itemName: voucherName,
      dateRedeemed: Date.now(), status: 'unclaimed', type: 'voucher',
      voucherCode: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`, emoji: '🎟️',
    };
    return {
      bonus: { type: 'external_voucher', redemptionId, voucherName, description: `🎟️ ${voucherName} Voucher!` },
      newRedemption: redemption,
    };
  }

  if (roll === 0) {
    const pool = getGachaCosmetics('SSR').filter(c => !cosmeticsOwned.includes(c.id));
    if (pool.length > 0) {
      const cos = pool[Math.floor(Math.random() * pool.length)];
      return { bonus: { type: 'legendary_set', cosmeticId: cos.id, cosmeticName: cos.name, description: `LEGENDARY: ${cos.emoji} ${cos.name}! 👑` } };
    }
    const coins = 800 + Math.floor(Math.random() * 401);
    return { bonus: { type: 'coins', coins, description: `+${coins} coins! 🪙` } };
  } else if (roll === 1) {
    const coins = 800 + Math.floor(Math.random() * 401);
    return { bonus: { type: 'coins', coins, description: `+${coins} coins! 🪙` } };
  } else {
    if (monthlyVoucherStock > 0) {
      const vouchers = ['Grab $10', 'NTUC $10', 'Boost $10', 'Grab $20'];
      const voucherName = vouchers[Math.floor(Math.random() * vouchers.length)];
      const redemptionId = generateRedemptionCode();
      const redemption: RedemptionPass = {
        id: redemptionId, code: redemptionId, itemName: voucherName,
        dateRedeemed: Date.now(), status: 'unclaimed', type: 'voucher',
        voucherCode: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`, emoji: '🎟️',
      };
      return {
        bonus: { type: 'external_voucher', redemptionId, voucherName, description: `🎟️ ${voucherName} Voucher!` },
        newRedemption: redemption,
      };
    }
    // Stock depleted fallback
    const pool = getGachaCosmetics('SSR').filter(c => !cosmeticsOwned.includes(c.id));
    if (pool.length > 0) {
      const cos = pool[Math.floor(Math.random() * pool.length)];
      return { bonus: { type: 'legendary_set', cosmeticId: cos.id, cosmeticName: cos.name, description: `Voucher stock depleted → LEGENDARY: ${cos.emoji} ${cos.name}! 👑` } };
    }
    const coins = 800 + Math.floor(Math.random() * 401);
    return { bonus: { type: 'coins', coins, description: `Voucher stock depleted → +${coins} coins! 🪙` } };
  }
}

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.userName) {
          // Migrate old state by filling new fields
          return {
            ...createDefaultState(),
            ...parsed,
            userCoins: parsed.userCoins ?? 500,
            cosmeticsOwned: parsed.cosmeticsOwned ?? ['badge-sprout', 'frame-leaf'],
            equippedCosmetics: parsed.equippedCosmetics ?? DEFAULT_EQUIPPED,
            redemptions: parsed.redemptions ?? [],
            shopStock: parsed.shopStock ?? { ...DEFAULT_SHOP_STOCK },
            monthlyVoucherStock: parsed.monthlyVoucherStock ?? 30,
            alwaysVoucherSSR: parsed.alwaysVoucherSSR ?? false,
          };
        }
      }
    } catch { /* ignore */ }
    return createDefaultState();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const borrowContainer = useCallback(() => {
    setState(prev => ({
      ...prev,
      containersBorrowed: prev.containersBorrowed + 1,
      lastActionTimestamp: Date.now(),
    }));
  }, []);

  const returnContainer = useCallback((): GachaResult => {
    const partyFull = state.party.active && state.party.memberCount >= 4;
    const collectible = pullRandom(state.alwaysSSR, partyFull);
    const { bonus, newRedemption } = rollBonusReward(
      collectible.rarity, state.cosmeticsOwned, state.monthlyVoucherStock, state.alwaysVoucherSSR
    );

    setState(prev => {
      const newInventory = [...prev.inventory];
      const existing = newInventory.find(i => i.collectibleId === collectible.id);
      if (existing) existing.count += 1;
      else newInventory.push({ collectibleId: collectible.id, count: 1 });

      const newRecentPulls = [collectible.id, ...prev.recentPulls].slice(0, 5);
      const newPoints = prev.points + 10;
      const newCoins = prev.userCoins + (bonus.coins || 0);

      const newCosmeticsOwned = [...prev.cosmeticsOwned];
      if (bonus.cosmeticId && !newCosmeticsOwned.includes(bonus.cosmeticId)) {
        newCosmeticsOwned.push(bonus.cosmeticId);
      }

      const newRedemptions = [...prev.redemptions];
      if (newRedemption) newRedemptions.unshift(newRedemption);

      const newVoucherStock = bonus.type === 'external_voucher'
        ? Math.max(0, prev.monthlyVoucherStock - 1)
        : prev.monthlyVoucherStock;

      return {
        ...prev,
        containersReturned: prev.containersReturned + 1,
        currentStreakDays: prev.currentStreakDays + 1,
        points: newPoints,
        level: Math.floor(newPoints / 50) + 1,
        lastActionTimestamp: Date.now(),
        inventory: newInventory,
        recentPulls: newRecentPulls,
        userCoins: newCoins,
        cosmeticsOwned: newCosmeticsOwned,
        redemptions: newRedemptions,
        monthlyVoucherStock: newVoucherStock,
        party: {
          ...prev.party,
          partyStreak: prev.party.active ? prev.party.partyStreak + 1 : prev.party.partyStreak,
        },
      };
    });

    return { collectible, bonus };
  }, [state.alwaysSSR, state.alwaysVoucherSSR, state.party.active, state.party.memberCount, state.cosmeticsOwned, state.monthlyVoucherStock]);

  const addPartyMember = useCallback(() => {
    setState(prev => ({
      ...prev,
      party: { ...prev.party, active: true, memberCount: Math.min(prev.party.memberCount + 1, 4) },
    }));
  }, []);

  const createParty = useCallback(() => {
    setState(prev => ({ ...prev, party: { active: true, memberCount: 1, partyStreak: 0 } }));
  }, []);

  const leaveParty = useCallback(() => {
    setState(prev => ({ ...prev, party: { active: false, memberCount: 1, partyStreak: 0 } }));
  }, []);

  const tradeCollectible = useCallback((giveId: string): Collectible | null => {
    const item = state.inventory.find(i => i.collectibleId === giveId);
    if (!item || item.count < 2) return null;
    const possible = ALL_COLLECTIBLES.filter(c => c.id !== giveId);
    const received = possible[Math.floor(Math.random() * possible.length)];
    setState(prev => {
      const newInventory = prev.inventory
        .map(i => i.collectibleId === giveId ? { ...i, count: i.count - 1 } : i)
        .filter(i => i.count > 0);
      const existing = newInventory.find(i => i.collectibleId === received.id);
      if (existing) existing.count += 1;
      else newInventory.push({ collectibleId: received.id, count: 1 });
      return { ...prev, inventory: newInventory };
    });
    return received;
  }, [state.inventory]);

  const toggleAlwaysSSR = useCallback(() => {
    setState(prev => ({ ...prev, alwaysSSR: !prev.alwaysSSR }));
  }, []);

  const toggleAlwaysVoucherSSR = useCallback(() => {
    setState(prev => ({ ...prev, alwaysVoucherSSR: !prev.alwaysVoucherSSR }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(createDefaultState());
  }, []);

  const equipCosmetic = useCallback((type: CosmeticType, cosmeticId: string) => {
    setState(prev => {
      const eq = { ...prev.equippedCosmetics };
      switch (type) {
        case 'title': eq.titleId = cosmeticId; break;
        case 'avatar_frame': eq.avatarFrameId = cosmeticId; break;
        case 'profile_border': eq.profileBorderId = cosmeticId; break;
        case 'badge':
          if (!eq.badgeIds.includes(cosmeticId)) {
            eq.badgeIds = [...eq.badgeIds, cosmeticId].slice(-3);
          }
          break;
      }
      return { ...prev, equippedCosmetics: eq };
    });
  }, []);

  const unequipCosmetic = useCallback((type: CosmeticType, cosmeticId?: string) => {
    setState(prev => {
      const eq = { ...prev.equippedCosmetics };
      switch (type) {
        case 'title': eq.titleId = null; break;
        case 'avatar_frame': eq.avatarFrameId = null; break;
        case 'profile_border': eq.profileBorderId = null; break;
        case 'badge':
          if (cosmeticId) eq.badgeIds = eq.badgeIds.filter(id => id !== cosmeticId);
          break;
      }
      return { ...prev, equippedCosmetics: eq };
    });
  }, []);

  const purchaseShopItem = useCallback((itemId: string): { success: boolean; redemptionId?: string } => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false };
    if (state.userCoins < item.price) return { success: false };
    if (item.stockKey && (state.shopStock[item.stockKey] || 0) <= 0) return { success: false };
    if (item.cosmeticId && state.cosmeticsOwned.includes(item.cosmeticId)) return { success: false };

    const needsRedemption = item.isPhysical || item.category === 'external_voucher';
    const redemptionId = needsRedemption ? generateRedemptionCode() : undefined;

    setState(prev => {
      const newStock = { ...prev.shopStock };
      if (item.stockKey) newStock[item.stockKey] = Math.max(0, (newStock[item.stockKey] || 0) - 1);

      const newCosmeticsOwned = [...prev.cosmeticsOwned];
      if (item.cosmeticId && !newCosmeticsOwned.includes(item.cosmeticId)) {
        newCosmeticsOwned.push(item.cosmeticId);
      }

      const newRedemptions = [...prev.redemptions];
      if (needsRedemption && redemptionId) {
        newRedemptions.unshift({
          id: redemptionId,
          code: redemptionId,
          itemName: item.name,
          dateRedeemed: Date.now(),
          status: 'unclaimed',
          type: item.category === 'external_voucher' ? 'voucher' : 'physical',
          voucherCode: item.category === 'external_voucher' ? `DEMO-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
          emoji: item.emoji,
        });
      }

      return {
        ...prev,
        userCoins: prev.userCoins - item.price,
        shopStock: newStock,
        cosmeticsOwned: newCosmeticsOwned,
        redemptions: newRedemptions,
      };
    });

    return { success: true, redemptionId };
  }, [state.userCoins, state.shopStock, state.cosmeticsOwned]);

  const claimRedemption = useCallback((redemptionId: string) => {
    setState(prev => ({
      ...prev,
      redemptions: prev.redemptions.map(r =>
        r.id === redemptionId ? { ...r, status: 'claimed' as const } : r
      ),
    }));
  }, []);

  const resetRedemptions = useCallback(() => {
    setState(prev => ({ ...prev, redemptions: [] }));
  }, []);

  const resetShopStock = useCallback(() => {
    setState(prev => ({ ...prev, shopStock: { ...DEFAULT_SHOP_STOCK } }));
  }, []);

  const resetVoucherStock = useCallback(() => {
    setState(prev => ({ ...prev, monthlyVoucherStock: 30 }));
  }, []);

  const grantAllCosmetics = useCallback(() => {
    setState(prev => ({
      ...prev,
      cosmeticsOwned: ALL_COSMETICS.map(c => c.id),
    }));
  }, []);

  const resetCosmetics = useCallback(() => {
    setState(prev => ({
      ...prev,
      cosmeticsOwned: ['badge-sprout', 'frame-leaf'],
      equippedCosmetics: { ...DEFAULT_EQUIPPED },
    }));
  }, []);

  const randomizeCosmetics = useCallback(() => {
    const owned = state.cosmeticsOwned;
    if (owned.length === 0) return;
    const titles = owned.filter(id => ALL_COSMETICS.find(c => c.id === id)?.type === 'title');
    const frames = owned.filter(id => ALL_COSMETICS.find(c => c.id === id)?.type === 'avatar_frame');
    const borders = owned.filter(id => ALL_COSMETICS.find(c => c.id === id)?.type === 'profile_border');
    const badges = owned.filter(id => ALL_COSMETICS.find(c => c.id === id)?.type === 'badge');
    const pick = (arr: string[]) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
    const shuffled = [...badges].sort(() => Math.random() - 0.5).slice(0, 3);
    setState(prev => ({
      ...prev,
      equippedCosmetics: {
        titleId: pick(titles),
        avatarFrameId: pick(frames),
        profileBorderId: pick(borders),
        badgeIds: shuffled,
      },
    }));
  }, [state.cosmeticsOwned]);

  return (
    <GameContext.Provider value={{
      state,
      borrowContainer, returnContainer,
      addPartyMember, createParty, leaveParty,
      tradeCollectible, toggleAlwaysSSR, toggleAlwaysVoucherSSR,
      resetDemo, equipCosmetic, unequipCosmetic,
      purchaseShopItem, claimRedemption,
      resetRedemptions, resetShopStock, resetVoucherStock,
      grantAllCosmetics, resetCosmetics, randomizeCosmetics,
    }}>
      {children}
    </GameContext.Provider>
  );
};
