import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameStateProvider, GachaResult } from '@/lib/gameState';
import BottomNav, { TabId } from '@/components/BottomNav';
import GachaReveal from '@/components/GachaReveal';
import HomeTab from '@/components/tabs/HomeTab';
import ScanTab from '@/components/tabs/ScanTab';
import PartyTab from '@/components/tabs/PartyTab';
import CollectionTab from '@/components/tabs/CollectionTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import ShopPage from '@/components/ShopPage';
import CosmeticsPanel from '@/components/CosmeticsPanel';
import RedemptionsList from '@/components/RedemptionsList';
import RedemptionPassView from '@/components/RedemptionPassView';
import { useGameState } from '@/lib/gameState';

type SubView = null | 'shop' | 'cosmetics' | 'redemptions';

const AppContent = () => {
  const { state } = useGameState();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [subView, setSubView] = useState<SubView>(null);
  const [gachaResult, setGachaResult] = useState<GachaResult | null>(null);
  const [viewingRedemptionId, setViewingRedemptionId] = useState<string | null>(null);

  const handleGachaReveal = (result: GachaResult) => {
    setGachaResult(result);
  };

  const handleNavigate = (view: string) => {
    if (view === 'shop' || view === 'cosmetics' || view === 'redemptions') {
      setSubView(view as SubView);
    } else if (view === 'collection') {
      setSubView(null);
      setActiveTab('collection');
    } else if (view === 'profile') {
      setSubView(null);
      setActiveTab('profile');
    }
  };

  const viewingRedemption = viewingRedemptionId
    ? state.redemptions.find(r => r.id === viewingRedemptionId)
    : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {subView === null && (
          <>
            {activeTab === 'home' && <HomeTab onNavigate={handleNavigate} />}
            {activeTab === 'scan' && <ScanTab onGachaReveal={handleGachaReveal} />}
            {activeTab === 'party' && <PartyTab />}
            {activeTab === 'collection' && <CollectionTab />}
            {activeTab === 'profile' && <ProfileTab onNavigate={handleNavigate} />}
          </>
        )}
        {subView === 'shop' && (
          <ShopPage onBack={() => setSubView(null)} onNavigate={handleNavigate} />
        )}
        {subView === 'cosmetics' && (
          <CosmeticsPanel onBack={() => setSubView(null)} />
        )}
        {subView === 'redemptions' && (
          <RedemptionsList
            onBack={() => setSubView(null)}
            onShowPass={(id) => setViewingRedemptionId(id)}
          />
        )}
      </div>

      {subView === null && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <AnimatePresence>
        {gachaResult && (
          <GachaReveal
            collectible={gachaResult.collectible}
            bonus={gachaResult.bonus}
            onClose={() => setGachaResult(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingRedemption && (
          <RedemptionPassView
            redemption={viewingRedemption}
            onClose={() => setViewingRedemptionId(null)}
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
