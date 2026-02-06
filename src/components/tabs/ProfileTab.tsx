import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { getCosmeticById } from '@/lib/cosmetics';
import AvatarWithFrame from '@/components/AvatarWithFrame';
import { User, Wallet, Settings, RotateCcw, Sparkles, Coins, ShoppingBag, Palette, Ticket, Shuffle, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ProfileTabProps {
  onNavigate: (view: string) => void;
}

const ProfileTab = ({ onNavigate }: ProfileTabProps) => {
  const {
    state, toggleAlwaysSSR, toggleAlwaysVoucherSSR, resetDemo,
    resetRedemptions, resetShopStock, resetVoucherStock,
    grantAllCosmetics, resetCosmetics, randomizeCosmetics,
  } = useGameState();

  const equippedTitle = state.equippedCosmetics.titleId
    ? getCosmeticById(state.equippedCosmetics.titleId)
    : null;
  const equippedBadges = state.equippedCosmetics.badgeIds
    .map(getCosmeticById)
    .filter(Boolean);
  const profileBorder = state.equippedCosmetics.profileBorderId
    ? getCosmeticById(state.equippedCosmetics.profileBorderId)
    : null;

  const unclaimedCount = state.redemptions.filter(r => r.status === 'unclaimed').length;

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">Profile</h1>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-card border rounded-2xl p-5 ${profileBorder?.cssClass || ''}`}
      >
        <div className="flex items-center gap-4">
          <AvatarWithFrame size="md" />
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-foreground">{state.userName}</h2>
            {equippedTitle && (
              <p className="text-xs font-semibold text-primary">{equippedTitle.titleText}</p>
            )}
            <p className="text-xs text-muted-foreground">{state.school}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Lv.{state.level}
              </span>
              <span className="text-xs text-muted-foreground">{state.points} pts ⭐</span>
              <span className="text-xs font-bold text-accent">{state.userCoins.toLocaleString()} 🪙</span>
            </div>
            {equippedBadges.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {equippedBadges.map(b => b && (
                  <span key={b.id} className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">{b.emoji}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-card border rounded-2xl p-3 text-center">
          <p className="text-xl font-extrabold text-foreground">{state.containersBorrowed}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Borrowed</p>
        </div>
        <div className="bg-card border rounded-2xl p-3 text-center">
          <p className="text-xl font-extrabold text-foreground">{state.containersReturned}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Returned</p>
        </div>
        <div className="bg-card border rounded-2xl p-3 text-center">
          <p className="text-xl font-extrabold text-foreground">{state.currentStreakDays}d</p>
          <p className="text-[10px] text-muted-foreground font-medium">Streak 🔥</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="grid grid-cols-3 gap-3"
      >
        <button
          onClick={() => onNavigate('shop')}
          className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
        >
          <ShoppingBag className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-foreground">Shop</span>
        </button>
        <button
          onClick={() => onNavigate('cosmetics')}
          className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
        >
          <Palette className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-foreground">Cosmetics</span>
        </button>
        <button
          onClick={() => onNavigate('redemptions')}
          className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors relative"
        >
          <Ticket className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-foreground">Redemptions</span>
          {unclaimedCount > 0 && (
            <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unclaimedCount}
            </span>
          )}
        </button>
      </motion.div>

      {/* Recent Redemptions Preview */}
      {state.redemptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-sm">Recent Redemptions</h3>
          </div>
          {state.redemptions.slice(0, 3).map(r => (
            <div key={r.id} className={`bg-card border rounded-2xl p-3 flex items-center gap-3 ${r.status === 'claimed' ? 'opacity-50' : ''}`}>
              <span className="text-lg">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs text-foreground truncate">{r.itemName}</p>
                <span className={`text-[9px] font-bold ${r.status === 'unclaimed' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {r.status === 'unclaimed' ? 'Unclaimed' : 'Claimed ✅'}
                </span>
              </div>
            </div>
          ))}
          {state.redemptions.length > 3 && (
            <Button variant="ghost" size="sm" className="text-xs w-full" onClick={() => onNavigate('redemptions')}>
              View all ({state.redemptions.length}) →
            </Button>
          )}
        </motion.div>
      )}

      {/* Demo Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-sm">Demo Settings</h3>
        </div>

        <div className="bg-card border rounded-2xl divide-y">
          {/* Reset Demo */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Reset All Data</p>
                <p className="text-[10px] text-muted-foreground">Full demo reset</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              resetDemo();
              toast.success('Demo data reset! 🔄');
            }}>Reset</Button>
          </div>

          {/* Always SSR */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-rarity-ssr" />
              <div>
                <p className="text-sm font-semibold text-foreground">Always SSR</p>
                <p className="text-[10px] text-muted-foreground">Force SSR rarity pulls</p>
              </div>
            </div>
            <Switch checked={state.alwaysSSR} onCheckedChange={toggleAlwaysSSR} />
          </div>

          {/* Force Voucher SSR */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">Force Voucher SSR</p>
                <p className="text-[10px] text-muted-foreground">SSR → voucher (if stock: {state.monthlyVoucherStock})</p>
              </div>
            </div>
            <Switch checked={state.alwaysVoucherSSR} onCheckedChange={toggleAlwaysVoucherSSR} />
          </div>

          {/* Reset Voucher Stock */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Reset Voucher Stock</p>
                <p className="text-[10px] text-muted-foreground">Monthly cap: {state.monthlyVoucherStock}/30</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              resetVoucherStock();
              toast.success('Voucher stock reset to 30!');
            }}>Reset</Button>
          </div>

          {/* Reset Shop Stock */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Reset Shop Stocks</p>
                <p className="text-[10px] text-muted-foreground">All shop items restocked</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              resetShopStock();
              toast.success('Shop stocks reset! 🛍️');
            }}>Reset</Button>
          </div>

          {/* Reset Redemptions */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Reset Redemptions</p>
                <p className="text-[10px] text-muted-foreground">Clear all passes</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              resetRedemptions();
              toast.success('Redemptions cleared!');
            }}>Reset</Button>
          </div>

          {/* Grant All Cosmetics */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Grant All Cosmetics</p>
                <p className="text-[10px] text-muted-foreground">Unlock everything for demo</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              grantAllCosmetics();
              toast.success('All cosmetics unlocked! 🎨');
            }}>Grant</Button>
          </div>

          {/* Randomize Cosmetics */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shuffle className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Randomize Equipped</p>
                <p className="text-[10px] text-muted-foreground">Random cosmetic loadout</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              randomizeCosmetics();
              toast.success('Cosmetics randomized! 🎲');
            }}>Random</Button>
          </div>

          {/* Reset Cosmetics */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Reset Cosmetics</p>
                <p className="text-[10px] text-muted-foreground">Reset owned + equipped</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => {
              resetCosmetics();
              toast.success('Cosmetics reset!');
            }}>Reset</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileTab;
