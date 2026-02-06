import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState, GachaResult } from '@/lib/gameState';
import { toast } from 'sonner';
import { QrCode, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScanTabProps {
  onGachaReveal: (result: GachaResult) => void;
}

const ScanTab = ({ onGachaReveal }: ScanTabProps) => {
  const { borrowContainer, returnContainer } = useGameState();
  const [qrInput, setQrInput] = useState('');
  const [lastAction, setLastAction] = useState<'borrow' | 'return' | null>(null);

  const handleBorrow = () => {
    borrowContainer();
    setLastAction('borrow');
    toast.success('Container Checked Out ✅', {
      description: 'Return within 24h to keep your streak + earn a Blind Box!',
    });
  };

  const handleReturn = () => {
    const result = returnContainer();
    setLastAction('return');
    toast.success('Return Confirmed 🎉', {
      description: `+10 points${result.bonus.coins ? ` +${result.bonus.coins} coins` : ''}! Opening Blind Box...`,
    });
    setTimeout(() => {
      onGachaReveal(result);
    }, 800);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <QrCode className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">Scan</h1>
        </div>
        <p className="text-sm text-muted-foreground">Simulate scanning a container QR code</p>
      </motion.div>

      {/* QR Input (optional realism) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border rounded-2xl p-4 space-y-3"
      >
        <p className="text-xs font-semibold text-muted-foreground">Optional: Enter QR Code</p>
        <Input
          placeholder="e.g. GL-2024-001"
          value={qrInput}
          onChange={(e) => setQrInput(e.target.value)}
          className="bg-secondary border-0"
        />
        <p className="text-[10px] text-muted-foreground">QR-only MVP (no RFID needed)</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <button
          onClick={handleBorrow}
          className="w-full bg-primary text-primary-foreground rounded-2xl p-6 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-eco"
        >
          <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <ArrowDownToLine className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold">Borrow Container</h3>
            <p className="text-sm opacity-80">Simulate scan (checkout)</p>
          </div>
          <span className="text-3xl ml-auto">🍱</span>
        </button>

        <button
          onClick={handleReturn}
          className="w-full bg-card border-2 border-primary text-foreground rounded-2xl p-6 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <ArrowUpFromLine className="w-7 h-7 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold">Return Container</h3>
            <p className="text-sm text-muted-foreground">Scan & earn Blind Box!</p>
          </div>
          <span className="text-3xl ml-auto">♻️</span>
        </button>
      </motion.div>

      {/* Last Action Feedback */}
      {lastAction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-4 border ${lastAction === 'borrow' ? 'eco-gradient' : 'reward-gradient'}`}
        >
          {lastAction === 'borrow' ? (
            <div className="space-y-2">
              <p className="font-bold text-foreground">📋 Next Step:</p>
              <p className="text-sm text-muted-foreground">Return within 24h to keep streak + earn a Blind Box pull!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-bold text-foreground">🎉 Awesome!</p>
              <p className="text-sm text-muted-foreground">+10 points earned! Check your collection for the new item.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ScanTab;
