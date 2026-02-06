import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ALL_COLLECTIBLES, Collectible, Rarity } from './collectibles';

export interface InventoryItem {
  collectibleId: string;
  count: number;
}

export interface Reward {
  id: string;
  name: string;
  from: string;
  type: 'voucher' | 'pass';
  used: boolean;
}

export interface PartyState {
  active: boolean;
  memberCount: number;
  partyStreak: number;
}

export interface GameState {
  userName: string;
  school: string;
  level: number;
  points: number;
  currentStreakDays: number;
  containersBorrowed: number;
  containersReturned: number;
  lastActionTimestamp: number | null;
  inventory: InventoryItem[];
  recentPulls: string[];
  party: PartyState;
  rewards: Reward[];
  alwaysSSR: boolean;
}

const STORAGE_KEY = 'greenloop-game-state';

const createDefaultState = (): GameState => ({
  userName: 'SP Student',
  school: 'Singapore Polytechnic',
  level: 3,
  points: 120,
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
  rewards: [
    { id: 'demo-1', name: '$1 Add-on Voucher', from: 'Golden Otter', type: 'voucher', used: false },
  ],
  alwaysSSR: false,
});

interface GameContextType {
  state: GameState;
  borrowContainer: () => void;
  returnContainer: () => Collectible;
  addPartyMember: () => void;
  createParty: () => void;
  leaveParty: () => void;
  tradeCollectible: (giveId: string) => Collectible | null;
  toggleAlwaysSSR: () => void;
  resetDemo: () => void;
  useReward: (rewardId: string) => void;
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
    if (roll < 10) rarity = 'SSR';
    else if (roll < 50) rarity = 'Rare';
    else rarity = 'Common';
  } else {
    const roll = Math.random() * 100;
    if (roll < 5) rarity = 'SSR';
    else if (roll < 30) rarity = 'Rare';
    else rarity = 'Common';
  }

  const pool = ALL_COLLECTIBLES.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.userName) return parsed;
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

  const returnContainer = useCallback((): Collectible => {
    const partyFull = state.party.active && state.party.memberCount >= 4;
    const collectible = pullRandom(state.alwaysSSR, partyFull);

    setState(prev => {
      const newInventory = [...prev.inventory];
      const existing = newInventory.find(i => i.collectibleId === collectible.id);
      if (existing) {
        existing.count += 1;
      } else {
        newInventory.push({ collectibleId: collectible.id, count: 1 });
      }

      const newRecentPulls = [collectible.id, ...prev.recentPulls].slice(0, 5);

      const newRewards = [...prev.rewards];
      if (collectible.reward) {
        newRewards.push({
          id: Date.now().toString(),
          name: collectible.reward,
          from: collectible.name,
          type: collectible.reward.includes('Voucher') ? 'voucher' : 'pass',
          used: false,
        });
      }

      const newPoints = prev.points + 10;

      return {
        ...prev,
        containersReturned: prev.containersReturned + 1,
        currentStreakDays: prev.currentStreakDays + 1,
        points: newPoints,
        level: Math.floor(newPoints / 50) + 1,
        lastActionTimestamp: Date.now(),
        inventory: newInventory,
        recentPulls: newRecentPulls,
        rewards: newRewards,
        party: {
          ...prev.party,
          partyStreak: prev.party.active ? prev.party.partyStreak + 1 : prev.party.partyStreak,
        },
      };
    });

    return collectible;
  }, [state.alwaysSSR, state.party.active, state.party.memberCount]);

  const addPartyMember = useCallback(() => {
    setState(prev => ({
      ...prev,
      party: {
        ...prev.party,
        active: true,
        memberCount: Math.min(prev.party.memberCount + 1, 4),
      },
    }));
  }, []);

  const createParty = useCallback(() => {
    setState(prev => ({
      ...prev,
      party: { active: true, memberCount: 1, partyStreak: 0 },
    }));
  }, []);

  const leaveParty = useCallback(() => {
    setState(prev => ({
      ...prev,
      party: { active: false, memberCount: 1, partyStreak: 0 },
    }));
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
      if (existing) {
        existing.count += 1;
      } else {
        newInventory.push({ collectibleId: received.id, count: 1 });
      }

      return { ...prev, inventory: newInventory };
    });

    return received;
  }, [state.inventory]);

  const toggleAlwaysSSR = useCallback(() => {
    setState(prev => ({ ...prev, alwaysSSR: !prev.alwaysSSR }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(createDefaultState());
  }, []);

  const useReward = useCallback((rewardId: string) => {
    setState(prev => ({
      ...prev,
      rewards: prev.rewards.map(r => r.id === rewardId ? { ...r, used: true } : r),
    }));
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      borrowContainer,
      returnContainer,
      addPartyMember,
      createParty,
      leaveParty,
      tradeCollectible,
      toggleAlwaysSSR,
      resetDemo,
      useReward,
    }}>
      {children}
    </GameContext.Provider>
  );
};
