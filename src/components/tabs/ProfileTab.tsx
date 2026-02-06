import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { User, Wallet, Settings, RotateCcw, Sparkles, QrCode, Gift, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ProfileTab = () => {
  const { state, toggleAlwaysSSR, resetDemo, useReward } = useGameState();
  const [showPassDialog, setShowPassDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const activeRewards = state.rewards.filter(r => !r.used);
  const usedRewards = state.rewards.filter(r => r.used);

  const handleShowPass = (rewardId: string) => {
    setSelectedReward(rewardId);
    setShowPassDialog(true);
  };

  const handleUseReward = () => {
    if (selectedReward) {
      useReward(selectedReward);
      setShowPassDialog(false);
      toast.success('Reward Redeemed! 🎉');
    }
  };

  const handleReset = () => {
    resetDemo();
    toast.success('Demo data reset! 🔄', { description: 'Sample data reloaded.' });
  };

  const reward = selectedReward ? state.rewards.find(r => r.id === selectedReward) : null;

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
        className="bg-card border rounded-2xl p-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
            🧑‍💻
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-foreground">{state.userName}</h2>
            <p className="text-xs text-muted-foreground">{state.school}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Lv.{state.level}
              </span>
              <span className="text-xs text-muted-foreground">{state.points} pts ⭐</span>
            </div>
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

      {/* Rewards Wallet */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-accent" />
          <h3 className="font-bold text-sm">Rewards Wallet</h3>
          <span className="text-xs bg-accent/20 text-accent-foreground font-bold px-2 py-0.5 rounded-full ml-auto">
            {activeRewards.length} active
          </span>
        </div>

        {activeRewards.length === 0 && (
          <div className="bg-card border rounded-2xl p-4 text-center text-muted-foreground">
            <Gift className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No rewards yet. Return containers to earn!</p>
          </div>
        )}

        {activeRewards.map(r => (
          <div key={r.id} className="reward-gradient border rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">{r.type === 'voucher' ? '🎟️' : '⚡'}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">{r.name}</p>
              <p className="text-[10px] text-muted-foreground">From: {r.from}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs"
              onClick={() => handleShowPass(r.id)}
            >
              Show Pass
            </Button>
          </div>
        ))}

        {usedRewards.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-semibold">Used</p>
            {usedRewards.map(r => (
              <div key={r.id} className="bg-muted border rounded-2xl p-3 flex items-center gap-3 opacity-50">
                <span className="text-lg">{r.type === 'voucher' ? '🎟️' : '⚡'}</span>
                <div className="flex-1">
                  <p className="font-medium text-xs text-foreground line-through">{r.name}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">Used</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-sm">Settings</h3>
        </div>

        <div className="bg-card border rounded-2xl divide-y">
          {/* Demo Mode Reset */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Reset Demo Data</p>
                <p className="text-[10px] text-muted-foreground">Reload sample data</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Always SSR */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-rarity-ssr" />
              <div>
                <p className="text-sm font-semibold text-foreground">Always SSR</p>
                <p className="text-[10px] text-muted-foreground">Demo override for pitch</p>
              </div>
            </div>
            <Switch checked={state.alwaysSSR} onCheckedChange={toggleAlwaysSSR} />
          </div>
        </div>
      </motion.div>

      {/* Pass Dialog */}
      <Dialog open={showPassDialog} onOpenChange={setShowPassDialog}>
        <DialogContent className="max-w-xs rounded-2xl text-center">
          <DialogHeader>
            <DialogTitle>🎫 Vendor Pass</DialogTitle>
          </DialogHeader>
          {reward && (
            <div className="space-y-4 py-4">
              <div className="w-48 h-48 mx-auto bg-foreground rounded-2xl flex items-center justify-center">
                <div className="w-40 h-40 bg-background rounded-xl flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-foreground" />
                </div>
              </div>
              <h3 className="font-bold text-lg">{reward.name}</h3>
              <p className="text-xs text-muted-foreground">Show this to the vendor to redeem</p>
              <Button onClick={handleUseReward} className="w-full rounded-xl">
                Mark as Used ✅
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileTab;
