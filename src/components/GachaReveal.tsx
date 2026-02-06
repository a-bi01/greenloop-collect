import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Collectible, rarityBadgeClass, rarityGlowClass } from '@/lib/collectibles';
import { BonusReward } from '@/lib/gameState';
import { Button } from '@/components/ui/button';

interface GachaRevealProps {
  collectible: Collectible;
  bonus: BonusReward;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

const GachaReveal = ({ collectible, bonus, onClose, onNavigate }: GachaRevealProps) => {
  const [phase, setPhase] = useState<'shake' | 'burst' | 'reveal'>('shake');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('burst'), 1200);
    const t2 = setTimeout(() => setPhase('reveal'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase === 'reveal' && collectible.rarity !== 'Common') {
      const colors = collectible.rarity === 'SSR'
        ? ['#FFD700', '#FFA500', '#FF6347', '#FFE4B5']
        : ['#4A90D9', '#6BB5FF', '#A8D8FF'];

      confetti({
        particleCount: collectible.rarity === 'SSR' ? 150 : 80,
        spread: 80,
        origin: { y: 0.5 },
        colors,
      });

      if (collectible.rarity === 'SSR') {
        setTimeout(() => {
          confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors });
          confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors });
        }, 300);
      }
    }
  }, [phase, collectible.rarity]);

  const handleNavigate = (view: string) => {
    onClose();
    setTimeout(() => onNavigate?.(view), 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
      onClick={phase === 'reveal' ? onClose : undefined}
    >
      <AnimatePresence mode="wait">
        {phase === 'shake' && (
          <motion.div
            key="shake"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="animate-shake-box text-8xl">📦</div>
            <p className="text-primary-foreground font-bold text-lg animate-pulse">Opening...</p>
          </motion.div>
        )}

        {phase === 'burst' && (
          <motion.div
            key="burst"
            initial={{ scale: 0 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-32 h-32 rounded-full gacha-burst"
          />
        )}

        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ rotateY: 180, scale: 0.3, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Collectible Card */}
            <div
              className={`w-52 h-64 rounded-3xl bg-card border-2 flex flex-col items-center justify-center gap-2 p-5 ${rarityGlowClass(collectible.rarity)}`}
            >
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${rarityBadgeClass(collectible.rarity)}`}>
                {collectible.rarity}
              </span>
              <span className="text-6xl">{collectible.emoji}</span>
              <h3 className="text-base font-bold text-center text-card-foreground">{collectible.name}</h3>
              <p className="text-[10px] text-muted-foreground">{collectible.series}</p>
            </div>

            {/* Bonus Reward Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/90 backdrop-blur rounded-2xl px-5 py-3 text-center max-w-[240px]"
            >
              <p className="text-sm font-bold text-foreground">{bonus.description}</p>
              {bonus.coins && (
                <p className="text-xs text-accent mt-1">🪙 +{bonus.coins} coins added</p>
              )}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 flex-wrap justify-center"
            >
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs bg-card/80"
                onClick={() => handleNavigate('collection')}
              >
                📦 Collection
              </Button>
              {(bonus.type === 'sticker_pack_voucher' || bonus.type === 'external_voucher') && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs bg-card/80"
                  onClick={() => handleNavigate('redemptions')}
                >
                  🎫 Redemption
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs bg-card/80"
                onClick={() => handleNavigate('shop')}
              >
                🛍️ Shop
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-primary-foreground/60 text-[10px] font-medium"
            >
              Tap background to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GachaReveal;
