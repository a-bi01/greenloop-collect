import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { getCollectibleById, ALL_COLLECTIBLES, Rarity, rarityBadgeClass } from '@/lib/collectibles';
import CollectibleCard from '@/components/CollectibleCard';
import { Grid3X3, Filter, ArrowLeftRight, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type RarityFilter = 'All' | Rarity;

const CollectionTab = () => {
  const { state, tradeCollectible } = useGameState();
  const [filter, setFilter] = useState<RarityFilter>('All');
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [selectedForTrade, setSelectedForTrade] = useState<string | null>(null);
  const [showTradeQR, setShowTradeQR] = useState(false);

  const filters: RarityFilter[] = ['All', 'Common', 'Rare', 'SSR'];

  const filteredInventory = state.inventory.filter(item => {
    if (filter === 'All') return true;
    const c = getCollectibleById(item.collectibleId);
    return c?.rarity === filter;
  });

  const totalCollected = state.inventory.length;
  const totalAvailable = ALL_COLLECTIBLES.length;

  const handleTrade = () => {
    if (!selectedForTrade) return;
    const received = tradeCollectible(selectedForTrade);
    if (received) {
      toast.success(`Trade Complete! 🔄`, {
        description: `Received ${received.emoji} ${received.name}!`,
      });
      setTradeDialogOpen(false);
      setSelectedForTrade(null);
      setShowTradeQR(false);
    } else {
      toast.error('Need at least 2 copies to trade!');
    }
  };

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Grid3X3 className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">Collection</h1>
          <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full ml-auto">
            {totalCollected}/{totalAvailable}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Your SP Hawkerverse album</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-muted'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredInventory.map(item => {
            const c = getCollectibleById(item.collectibleId);
            if (!c) return null;
            return (
              <motion.div
                key={item.collectibleId}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CollectibleCard
                  collectible={c}
                  count={item.count}
                  size="md"
                  onClick={() => {
                    if (item.count >= 2) {
                      setSelectedForTrade(item.collectibleId);
                      setTradeDialogOpen(true);
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-4xl block mb-3">📦</span>
          <p className="font-medium">No collectibles yet!</p>
          <p className="text-xs">Return containers to earn blind boxes</p>
        </div>
      )}

      {/* Trade Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border rounded-2xl p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm">Trade Duplicates</h3>
        </div>
        <p className="text-xs text-muted-foreground">Tap any card with x2+ to start a trade</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => {
              setShowTradeQR(true);
              toast.success('Trade QR Generated! 📱');
            }}
          >
            <QrCode className="w-3.5 h-3.5 mr-1" /> Generate Trade QR
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => toast.info('Simulated: Scanning trade QR... 📷')}
          >
            Scan Trade QR
          </Button>
        </div>
      </motion.div>

      {/* Trade QR Display */}
      {showTradeQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border rounded-2xl p-6 text-center space-y-3"
        >
          <div className="w-40 h-40 mx-auto bg-foreground rounded-2xl flex items-center justify-center">
            <div className="w-32 h-32 bg-background rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Show this to your friend to trade!</p>
          <Button variant="ghost" size="sm" onClick={() => setShowTradeQR(false)} className="text-xs">
            Dismiss
          </Button>
        </motion.div>
      )}

      {/* Trade Dialog */}
      <Dialog open={tradeDialogOpen} onOpenChange={setTradeDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" /> Trade
            </DialogTitle>
          </DialogHeader>
          {selectedForTrade && (() => {
            const c = getCollectibleById(selectedForTrade);
            const item = state.inventory.find(i => i.collectibleId === selectedForTrade);
            if (!c || !item) return null;
            return (
              <div className="space-y-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{c.emoji}</span>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">You have x{item.count}</p>
                </div>
                <p className="text-sm text-muted-foreground">Trade 1 copy for a random collectible?</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleTrade} className="rounded-xl">
                    Confirm Trade 🔄
                  </Button>
                  <Button variant="outline" onClick={() => setTradeDialogOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionTab;
