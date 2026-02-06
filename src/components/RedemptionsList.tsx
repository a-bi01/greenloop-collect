import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { ArrowLeft, Ticket, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RedemptionsListProps {
  onBack: () => void;
  onShowPass: (redemptionId: string) => void;
}

const RedemptionsList = ({ onBack, onShowPass }: RedemptionsListProps) => {
  const { state } = useGameState();

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <Ticket className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">My Redemptions</h1>
        </div>
      </motion.div>

      {state.redemptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <Ticket className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No redemptions yet</p>
          <p className="text-xs">Earn passes from gacha or buy from Shop!</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {state.redemptions.map(r => (
            <div
              key={r.id}
              className={`bg-card border rounded-2xl p-4 flex items-center gap-3 ${
                r.status === 'claimed' ? 'opacity-60' : ''
              }`}
            >
              <span className="text-2xl">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground truncate">{r.itemName}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    r.status === 'unclaimed'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {r.status === 'unclaimed' ? 'Unclaimed' : 'Claimed ✅'}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {r.code} • {new Date(r.dateRedeemed).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs shrink-0"
                onClick={() => onShowPass(r.id)}
              >
                <QrCode className="w-3.5 h-3.5 mr-1" /> Show QR
              </Button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RedemptionsList;
