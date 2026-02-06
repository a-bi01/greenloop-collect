import { motion } from 'framer-motion';
import { useGameState, RedemptionPass } from '@/lib/gameState';
import { QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RedemptionPassViewProps {
  redemption: RedemptionPass;
  onClose: () => void;
}

const RedemptionPassView = ({ redemption, onClose }: RedemptionPassViewProps) => {
  const { claimRedemption } = useGameState();

  const handleStaffScan = () => {
    claimRedemption(redemption.id);
    toast.success('Claimed ✅ Collected', {
      description: `${redemption.itemName} has been collected!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-3xl p-6 max-w-xs w-full mx-4 text-center space-y-4 border shadow-xl"
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <h2 className="text-lg font-extrabold text-foreground">🎫 Redemption Pass</h2>

        {/* QR Code */}
        <div className="w-48 h-48 mx-auto bg-foreground rounded-2xl flex items-center justify-center">
          <div className="w-40 h-40 bg-background rounded-xl flex items-center justify-center">
            <QrCode className="w-24 h-24 text-foreground" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <h3 className="font-bold text-foreground">{redemption.itemName}</h3>
          <p className="text-xs text-muted-foreground font-mono">{redemption.code}</p>
          <p className="text-[10px] text-muted-foreground">
            {new Date(redemption.dateRedeemed).toLocaleString()}
          </p>
        </div>

        {redemption.voucherCode && (
          <div className="bg-accent/10 rounded-xl p-3">
            <p className="text-xs text-muted-foreground">Voucher Code</p>
            <p className="text-lg font-bold font-mono text-accent-foreground">{redemption.voucherCode}</p>
          </div>
        )}

        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
          redemption.status === 'unclaimed'
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}>
          {redemption.status === 'unclaimed' ? '⏳ Unclaimed' : '✅ Claimed'}
        </div>

        {redemption.status === 'unclaimed' && (
          <Button
            onClick={handleStaffScan}
            className="w-full rounded-xl"
            variant="default"
          >
            Simulate Staff Scan (Claim) 📱
          </Button>
        )}

        <p className="text-[10px] text-muted-foreground">
          {redemption.type === 'voucher'
            ? 'Present this QR to claim your voucher'
            : 'Show this QR at the collection counter'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RedemptionPassView;
