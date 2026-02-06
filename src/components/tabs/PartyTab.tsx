import { motion } from 'framer-motion';
import { useGameState } from '@/lib/gameState';
import { Users, UserPlus, Zap, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const MEMBER_EMOJIS = ['🧑‍💻', '👩‍🎓', '🧑‍🔬', '👨‍🎨'];
const MEMBER_NAMES = ['You', 'Alex', 'Sam', 'Jordan'];

const PartyTab = () => {
  const { state, createParty, addPartyMember, leaveParty } = useGameState();
  const { party } = state;

  const handleCreate = () => {
    createParty();
    toast.success('Party Created! 🎉', { description: 'Invite friends to unlock 2x drop rate!' });
  };

  const handleAddMember = () => {
    if (party.memberCount >= 4) {
      toast.info('Party is full! 🎊');
      return;
    }
    addPartyMember();
    const newCount = party.memberCount + 1;
    if (newCount >= 4) {
      toast.success('Party Mode Activated! ✅', { description: '2x Drop Rate unlocked!' });
    } else {
      toast.success(`${MEMBER_NAMES[newCount - 1]} joined! 🎮`, {
        description: `${newCount}/4 members`,
      });
    }
  };

  const handleLeave = () => {
    leaveParty();
    toast('Left the party 👋');
  };

  const isPartyFull = party.active && party.memberCount >= 4;
  const dropRate = isPartyFull ? '2x' : '1x';

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">Squad Mode</h1>
        </div>
        <p className="text-sm text-muted-foreground">Team up for better drops!</p>
      </motion.div>

      {/* Party Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-5 border-2 ${isPartyFull ? 'border-primary glow-eco eco-gradient' : 'bg-card border'}`}
      >
        {/* Members */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                i < party.memberCount
                  ? 'bg-primary/15 border-2 border-primary scale-100'
                  : 'bg-muted border-2 border-dashed border-muted-foreground/30 opacity-40 scale-90'
              }`}
            >
              {i < party.memberCount ? MEMBER_EMOJIS[i] : '?'}
            </div>
          ))}
        </div>

        {/* Member names */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`text-[10px] font-semibold w-14 text-center ${
                i < party.memberCount ? 'text-foreground' : 'text-muted-foreground/40'
              }`}
            >
              {i < party.memberCount ? MEMBER_NAMES[i] : '—'}
            </span>
          ))}
        </div>

        {/* Status badges */}
        <div className="flex justify-center gap-3">
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
            {party.memberCount}/4 Members
          </span>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            isPartyFull ? 'rarity-ssr' : 'bg-muted text-muted-foreground'
          }`}>
            {dropRate} Drop Rate
          </span>
        </div>

        {isPartyFull && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <Crown className="w-5 h-5" />
              <span className="font-bold text-sm">Party Mode Activated!</span>
              <Crown className="w-5 h-5" />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Party Streak */}
      {party.active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border rounded-2xl p-4 flex items-center gap-4"
        >
          <Zap className="w-8 h-8 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground font-medium">Party Streak</p>
            <p className="text-xl font-extrabold text-foreground">{party.partyStreak} returns</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {!party.active ? (
          <div className="space-y-3">
            <Button onClick={handleCreate} className="w-full h-14 text-base font-bold rounded-2xl" size="lg">
              <Users className="w-5 h-5 mr-2" /> Create Party
            </Button>
            <Button onClick={handleCreate} variant="outline" className="w-full h-14 text-base font-bold rounded-2xl" size="lg">
              <UserPlus className="w-5 h-5 mr-2" /> Join Party
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {party.memberCount < 4 && (
              <Button onClick={handleAddMember} className="w-full h-14 text-base font-bold rounded-2xl" size="lg">
                <UserPlus className="w-5 h-5 mr-2" /> Add Member (Simulate)
              </Button>
            )}
            <Button onClick={handleLeave} variant="outline" className="w-full h-12 rounded-2xl text-destructive border-destructive/30">
              Leave Party
            </Button>
          </div>
        )}
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-secondary rounded-2xl p-4 space-y-2"
      >
        <h3 className="font-bold text-sm text-secondary-foreground">How Squad Mode Works</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If all 4 members use reusable containers, everyone gets <span className="font-bold text-primary">2x better drop rates</span> for blind boxes. 
          Team up with friends and compete on the leaderboard! 🏆
        </p>
      </motion.div>
    </div>
  );
};

export default PartyTab;
