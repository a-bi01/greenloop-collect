import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameStateProvider } from '@/lib/gameState';
import { Collectible } from '@/lib/collectibles';
import BottomNav, { TabId } from '@/components/BottomNav';
import GachaReveal from '@/components/GachaReveal';
import HomeTab from '@/components/tabs/HomeTab';
import ScanTab from '@/components/tabs/ScanTab';
import PartyTab from '@/components/tabs/PartyTab';
import CollectionTab from '@/components/tabs/CollectionTab';
import ProfileTab from '@/components/tabs/ProfileTab';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [gachaCollectible, setGachaCollectible] = useState<Collectible | null>(null);

  const handleGachaReveal = (collectible: Collectible) => {
    setGachaCollectible(collectible);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'scan' && <ScanTab onGachaReveal={handleGachaReveal} />}
        {activeTab === 'party' && <PartyTab />}
        {activeTab === 'collection' && <CollectionTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence>
        {gachaCollectible && (
          <GachaReveal
            collectible={gachaCollectible}
            onClose={() => setGachaCollectible(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => (
  <GameStateProvider>
    <AppContent />
  </GameStateProvider>
);

export default Index;
