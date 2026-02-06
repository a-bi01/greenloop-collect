import { Collectible, rarityBadgeClass, rarityGlowClass } from '@/lib/collectibles';
import { cn } from '@/lib/utils';

interface CollectibleCardProps {
  collectible: Collectible;
  count?: number;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

const CollectibleCard = ({ collectible, count, size = 'md', onClick }: CollectibleCardProps) => {
  const isMd = size === 'md';

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative bg-card border rounded-2xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95",
        isMd ? "p-4 gap-2 w-full" : "p-2 gap-1 w-16 h-20 flex-shrink-0",
        rarityGlowClass(collectible.rarity)
      )}
    >
      {count && count > 1 && (
        <span className="absolute top-1.5 right-1.5 bg-foreground/80 text-background text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          x{count}
        </span>
      )}
      <span className={cn(isMd ? "text-4xl" : "text-2xl")}>{collectible.emoji}</span>
      {isMd && (
        <>
          <h4 className="text-xs font-bold text-center text-card-foreground leading-tight">{collectible.name}</h4>
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", rarityBadgeClass(collectible.rarity))}>
            {collectible.rarity}
          </span>
          <p className="text-[9px] text-muted-foreground">{collectible.series}</p>
        </>
      )}
      {!isMd && (
        <span className={cn("text-[9px] font-semibold", {
          "text-rarity-common": collectible.rarity === 'Common',
          "text-rarity-rare": collectible.rarity === 'Rare',
          "text-rarity-ssr": collectible.rarity === 'SSR',
        })}>
          {collectible.rarity}
        </span>
      )}
    </button>
  );
};

export default CollectibleCard;
