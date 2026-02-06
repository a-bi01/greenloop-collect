import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { SHOP_ITEMS, SHOP_CATEGORIES, ShopCategory } from '@/lib/shopItems';
import { ArrowLeft, Coins, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShopPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const ShopPage = ({ onBack, onNavigate }: ShopPageProps) => {
  const { state, purchaseShopItem } = useGameState();
  const [category, setCategory] = useState<ShopCategory>('external_voucher');

  const items = SHOP_ITEMS.filter(i => i.category === category);

  const handlePurchase = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (item.cosmeticId && state.cosmeticsOwned.includes(item.cosmeticId)) {
      toast.error('Already owned!');
      return;
    }

    const result = purchaseShopItem(itemId);
    if (result.success) {
      toast.success(`Redeemed: ${item.name}! 🎉`, {
        description: result.redemptionId
          ? 'Redemption pass created! Check My Redemptions.'
          : item.cosmeticId
          ? 'Cosmetic added! Equip it in Cosmetics.'
          : undefined,
      });
      if (result.redemptionId) {
        setTimeout(() => onNavigate('redemptions'), 500);
      }
    } else {
      toast.error('Not enough coins or out of stock!');
    }
  };

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">Rewards Shop</h1>
        </div>
        <div className="flex items-center gap-2 mt-2 ml-10">
          <Coins className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-foreground">{state.userCoins.toLocaleString()} coins</span>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {SHOP_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              category === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        {items.map(item => {
          const stock = item.stockKey ? (state.shopStock[item.stockKey] ?? 0) : null;
          const outOfStock = stock !== null && stock <= 0;
          const alreadyOwned = item.cosmeticId ? state.cosmeticsOwned.includes(item.cosmeticId) : false;
          const cantAfford = state.userCoins < item.price;
          const disabled = outOfStock || cantAfford || alreadyOwned;

          return (
            <div
              key={item.id}
              className={`bg-card border rounded-2xl p-4 flex items-center gap-3 ${
                disabled ? 'opacity-60' : ''
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                <p className="text-[10px] text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-accent">{item.price.toLocaleString()} 🪙</span>
                  {stock !== null && (
                    <span className={`text-[10px] font-semibold ${outOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {outOfStock ? 'Out of stock' : `${stock} left`}
                    </span>
                  )}
                  {stock === null && (
                    <span className="text-[10px] text-muted-foreground">Unlimited</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant={disabled ? 'outline' : 'default'}
                className="rounded-xl text-xs shrink-0"
                disabled={disabled}
                onClick={() => handlePurchase(item.id)}
              >
                {alreadyOwned ? 'Owned' : outOfStock ? 'Sold Out' : 'Redeem'}
              </Button>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ShopPage;
