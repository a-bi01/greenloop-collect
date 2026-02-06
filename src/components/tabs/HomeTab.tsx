import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { getCollectibleById, MOCK_LEADERBOARD } from '@/lib/collectibles';
import { getCosmeticById } from '@/lib/cosmetics';
import CollectibleCard from '@/components/CollectibleCard';
import AvatarWithFrame from '@/components/AvatarWithFrame';
import { Zap, Flame, Leaf, Trophy, Coins, ShoppingBag } from 'lucide-react';

interface HomeTabProps {
  onNavigate?: (view: string) => void;
}

const HomeTab = ({ onNavigate }: HomeTabProps) => {
  const { state } = useGameState();

  const streakMilestone = Math.ceil((state.currentStreakDays + 1) / 7) * 7;
  const streakProgress = ((state.currentStreakDays % 7) / 7) * 100;

  const equippedTitle = state.equippedCosmetics.titleId
    ? getCosmeticById(state.equippedCosmetics.titleId)
    : null;
  const equippedBadges = state.equippedCosmetics.badgeIds
    .map(getCosmeticById)
    .filter(Boolean);
  const profileBorder = state.equippedCosmetics.profileBorderId
    ? getCosmeticById(state.equippedCosmetics.profileBorderId)
    : null;

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header with Avatar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <AvatarWithFrame size="sm" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">GreenLoop</h1>
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
                Lv.{state.level}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                Hey {state.userName}! 🔥
              </p>
              {equippedBadges.map(b => b && (
                <span key={b.id} className="text-xs">{b.emoji}</span>
              ))}
            </div>
            {equippedTitle && (
              <p className="text-[10px] font-semibold text-primary">{equippedTitle.titleText}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Today's Impact */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Today's Impact
        </h2>
        <div className={`grid grid-cols-2 gap-3 ${profileBorder?.cssClass || ''} rounded-2xl`}>
          {/* Containers Returned */}
          <div className="bg-card border rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">♻️</span>
              <span className="text-2xl font-extrabold text-foreground">{state.containersReturned}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Containers Returned</p>
          </div>

          {/* Streak */}
          <div className="bg-card border rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive animate-streak" />
              <span className="text-2xl font-extrabold text-foreground">{state.currentStreakDays}d</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(streakProgress, 10)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{state.currentStreakDays}/{streakMilestone} to milestone</p>
          </div>
        </div>
      </motion.div>

      {/* Coins + Points Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="reward-gradient rounded-2xl p-4 border">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            <span className="text-2xl font-extrabold text-foreground">{state.userCoins.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Coins 🪙</p>
        </div>
        <div className="reward-gradient rounded-2xl p-4 border">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="text-2xl font-extrabold text-foreground">{state.points}</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Points</p>
        </div>
      </motion.div>

      {/* Shop Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <button
          onClick={() => onNavigate?.('shop')}
          className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-3 flex items-center gap-3 hover:bg-primary/15 transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-primary" />
          <p className="text-xs font-semibold text-foreground text-left">
            Save coins to redeem merch / $10 vouchers in <span className="text-primary">Shop</span> →
          </p>
        </button>
      </motion.div>

      {/* Eco Impact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="eco-gradient rounded-2xl p-4 border"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">{state.containersReturned}</p>
            <p className="text-xs text-muted-foreground font-medium">Disposables Avoided 🌍</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Pulls */}
      {state.recentPulls.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-sm font-bold mb-2">Recent Pulls</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {state.recentPulls.map((id, i) => {
              const c = getCollectibleById(id);
              if (!c) return null;
              return <CollectibleCard key={`${id}-${i}`} collectible={c} size="sm" />;
            })}
          </div>
        </motion.div>
      )}

      {/* Campus Impact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span>🏫</span>
          <h3 className="font-bold text-sm">Campus Impact</h3>
        </div>
        <p className="text-2xl font-extrabold text-primary">12,480</p>
        <p className="text-xs text-muted-foreground">disposables avoided this semester at SP</p>
      </motion.div>

      {/* Mini Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-accent" />
          <h3 className="font-bold text-sm">Leaderboard</h3>
        </div>
        <div className="space-y-2">
          {MOCK_LEADERBOARD.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 text-sm p-2 rounded-xl ${
                entry.rank === 3 ? 'bg-primary/10 border border-primary/20' : ''
              }`}
            >
              <span className="font-bold text-muted-foreground w-5 text-center">
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
              </span>
              <span className="font-semibold text-foreground flex-1">{entry.name}</span>
              <span className="text-xs text-muted-foreground">{entry.containers} 🔄</span>
              <span className="text-xs text-muted-foreground">{entry.streak}🔥</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeTab;
