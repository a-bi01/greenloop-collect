import { useGameState } from '@/lib/gameState';
import { getCosmeticById } from '@/lib/cosmetics';
import { cn } from '@/lib/utils';

interface AvatarWithFrameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarWithFrame = ({ size = 'md', className }: AvatarWithFrameProps) => {
  const { state } = useGameState();
  const frame = state.equippedCosmetics.avatarFrameId
    ? getCosmeticById(state.equippedCosmetics.avatarFrameId)
    : null;

  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-primary/15 flex items-center justify-center',
        sizeClasses[size],
        frame?.cssClass,
        className
      )}
    >
      🧑‍💻
    </div>
  );
};

export default AvatarWithFrame;
