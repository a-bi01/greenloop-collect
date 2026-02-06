import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { ALL_COSMETICS, getCosmeticById, CosmeticType, CosmeticItem } from '@/lib/cosmetics';
import { rarityBadgeClass } from '@/lib/collectibles';
import { ArrowLeft, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AvatarWithFrame from './AvatarWithFrame';

interface CosmeticsPanelProps {
  onBack: () => void;
}

const TYPE_TABS: { key: CosmeticType; label: string; emoji: string }[] = [
  { key: 'title', label: 'Titles', emoji: '🏷️' },
  { key: 'avatar_frame', label: 'Frames', emoji: '🖼️' },
  { key: 'profile_border', label: 'Borders', emoji: '✨' },
  { key: 'badge', label: 'Badges', emoji: '🎖️' },
];

const CosmeticsPanel = ({ onBack }: CosmeticsPanelProps) => {
  const { state, equipCosmetic, unequipCosmetic } = useGameState();
  const [activeType, setActiveType] = useState<CosmeticType>('title');
  const [previewId, setPreviewId] = useState<string | null>(null);

  const ownedOfType = ALL_COSMETICS.filter(
    c => c.type === activeType && state.cosmeticsOwned.includes(c.id)
  );

  const isEquipped = (cosmeticId: string) => {
    const eq = state.equippedCosmetics;
    switch (activeType) {
      case 'title': return eq.titleId === cosmeticId;
      case 'avatar_frame': return eq.avatarFrameId === cosmeticId;
      case 'profile_border': return eq.profileBorderId === cosmeticId;
      case 'badge': return eq.badgeIds.includes(cosmeticId);
    }
  };

  const handleEquip = (cosmetic: CosmeticItem) => {
    if (isEquipped(cosmetic.id)) {
      unequipCosmetic(cosmetic.type, cosmetic.id);
      toast.success(`Unequipped ${cosmetic.name}`);
    } else {
      equipCosmetic(cosmetic.type, cosmetic.id);
      toast.success(`Equipped ${cosmetic.emoji} ${cosmetic.name}!`);
    }
    setPreviewId(null);
  };

  // Get equipped title for preview
  const equippedTitle = state.equippedCosmetics.titleId
    ? getCosmeticById(state.equippedCosmetics.titleId)
    : null;
  const equippedBadges = state.equippedCosmetics.badgeIds
    .map(getCosmeticById)
    .filter(Boolean);

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <Palette className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">Cosmetics</h1>
        </div>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border rounded-2xl p-4 flex items-center gap-4"
      >
        <AvatarWithFrame size="lg" />
        <div>
          <h3 className="font-extrabold text-foreground">{state.userName}</h3>
          {equippedTitle && (
            <p className="text-xs font-semibold text-primary">{equippedTitle.titleText}</p>
          )}
          {equippedBadges.length > 0 && (
            <div className="flex gap-1 mt-1">
              {equippedBadges.map(b => b && (
                <span key={b.id} className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">
                  {b.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Type Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {TYPE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveType(tab.key); setPreviewId(null); }}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              activeType === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-muted'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Owned Cosmetics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        {ownedOfType.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-3xl block mb-2">🎨</span>
            <p className="text-sm font-medium">No {activeType.replace('_', ' ')}s owned yet</p>
            <p className="text-xs">Earn from gacha or buy from Shop!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {ownedOfType.map(cosmetic => {
              const equipped = isEquipped(cosmetic.id);
              const isPreviewing = previewId === cosmetic.id;
              return (
                <div
                  key={cosmetic.id}
                  className={`bg-card border rounded-2xl p-3 space-y-2 transition-all cursor-pointer ${
                    equipped ? 'ring-2 ring-primary' : ''
                  } ${isPreviewing ? 'ring-2 ring-accent' : ''}`}
                  onClick={() => setPreviewId(isPreviewing ? null : cosmetic.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cosmetic.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{cosmetic.name}</p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${rarityBadgeClass(cosmetic.rarity)}`}>
                        {cosmetic.rarity}
                      </span>
                    </div>
                  </div>
                  {cosmetic.type === 'avatar_frame' && cosmetic.cssClass && (
                    <div className={`w-10 h-10 mx-auto rounded-xl bg-primary/15 flex items-center justify-center ${cosmetic.cssClass}`}>
                      🧑‍💻
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant={equipped ? 'outline' : 'default'}
                    className="w-full rounded-xl text-xs"
                    onClick={(e) => { e.stopPropagation(); handleEquip(cosmetic); }}
                  >
                    {equipped ? 'Equipped ✅' : 'Apply'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CosmeticsPanel;
