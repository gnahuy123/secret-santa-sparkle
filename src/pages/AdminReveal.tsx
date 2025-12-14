import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Snowfall } from '@/components/Snowfall';
import { FestiveCard } from '@/components/FestiveCard';
import { GiftIcon } from '@/components/GiftIcon';
import { findRoomByCreatorKey, Participant, Room } from '@/lib/secretSanta';
import { ArrowLeft, Gift, Eye, EyeOff, Sparkles, Gamepad2, Eraser } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScratchReveal } from '@/components/ScratchReveal';
import { SlotReveal } from '@/components/SlotReveal';
import { SoundManager } from '@/lib/SoundManager';

type RevealMode = 'simple' | 'scratch' | 'slot';

const AdminReveal = () => {
  const { creatorKey } = useParams<{ creatorKey: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [revealedNumbers, setRevealedNumbers] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [revealMode, setRevealMode] = useState<RevealMode>('slot');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadRoom = async () => {
      if (creatorKey) {
        const foundRoom = await findRoomByCreatorKey(creatorKey);
        if (foundRoom) {
          setRoom(foundRoom);
        } else {
          setNotFound(true);
        }
      }
    };
    loadRoom();
  }, [creatorKey]);

  const handleParticipantClick = (participant: Participant) => {
    if (revealMode === 'simple') {
      toggleReveal(participant.giftNumber);
    } else {
      setSelectedParticipant(participant);
      setIsDialogOpen(true);
    }
  };

  const toggleReveal = (giftNumber: number) => {
    const newRevealed = new Set(revealedNumbers);
    if (newRevealed.has(giftNumber)) {
      newRevealed.delete(giftNumber);
    } else {
      newRevealed.add(giftNumber);
      SoundManager.playWin();
    }
    setRevealedNumbers(newRevealed);
  };

  const markAsRevealed = (giftNumber: number) => {
    const newRevealed = new Set(revealedNumbers);
    newRevealed.add(giftNumber);
    setRevealedNumbers(newRevealed);
  };

  const handleModalReveal = () => {
    if (selectedParticipant) {
      markAsRevealed(selectedParticipant.giftNumber);
      // Optional: Close dialog automatically after a delay? 
      // User might want to see the result for a bit.
      // For Slot, the result stays on screen. For Scratch, it stays on screen.
      // We'll let user close it manually or click outside.
    }
  };

  const revealAll = () => {
    if (allRevealed) {
      setRevealedNumbers(new Set());
      setAllRevealed(false);
    } else {
      const allNumbers = new Set(room?.participants.map(p => p.giftNumber) || []);
      setRevealedNumbers(allNumbers);
      setAllRevealed(true);
      SoundManager.playWin();
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowfall />
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-md mx-auto text-center">
            <GiftIcon size="lg" className="mx-auto mb-6 opacity-50" />
            <h1 className="font-display text-2xl font-bold mb-4">Invalid Creator Key</h1>
            <p className="text-muted-foreground mb-6">
              This key doesn't match any Secret Santa room.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Snowfall />
        <div className="text-center">
          <GiftIcon size="md" className="mx-auto animate-pulse" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Sort by gift number for reveal order
  const sortedParticipants = [...room.participants].sort((a, b) => a.giftNumber - b.giftNumber);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <GiftIcon size="lg" className="mx-auto mb-4" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Gift Reveal Dashboard
            </h1>
            <p className="text-muted-foreground mb-4">
              Reveal which gift number belongs to whom
            </p>

            <div className="flex flex-col items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/room/${room.id}`, { state: { creatorKey } })}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                View Access Info
              </Button>

              {/* Mode Selector */}
              <div className="flex justify-center gap-2 bg-muted/50 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setRevealMode('simple')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${revealMode === 'simple'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Simple
                </button>
                <button
                  onClick={() => setRevealMode('scratch')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${revealMode === 'scratch'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Eraser className="w-4 h-4 inline mr-1" />
                  Scratch
                </button>
                <button
                  onClick={() => setRevealMode('slot')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${revealMode === 'slot'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Gamepad2 className="w-4 h-4 inline mr-1" />
                  Slot
                </button>
              </div>
            </div>
          </div>

          <FestiveCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-semibold">
                {room.participants.length} Participants
              </h2>
              <Button variant="outline" onClick={revealAll}>
                {allRevealed ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide All
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Reveal All
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-3">
              {sortedParticipants.map((participant) => {
                const isRevealed = revealedNumbers.has(participant.giftNumber);
                return (
                  <div
                    key={participant.key}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${isRevealed
                      ? 'bg-christmas-green/10 border-christmas-green/30'
                      : 'bg-muted/30 border-transparent hover:border-christmas-gold/30'
                      }`}
                    onClick={() => handleParticipantClick(participant)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg transition-colors ${isRevealed
                            ? 'bg-christmas-green text-christmas-snow'
                            : 'bg-christmas-gold/20 text-christmas-gold'
                            }`}
                        >
                          {participant.giftNumber}
                        </div>
                        <div>
                          {isRevealed ? (
                            <>
                              <p className="font-medium text-christmas-green">
                                For: {participant.assignedTo}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">Gift #{participant.giftNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {revealMode === 'simple' ? 'Click to reveal' : `Click to ${revealMode}`}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        {isRevealed ? (
                          <Eye className="w-5 h-5 text-christmas-green" />
                        ) : (
                          revealMode === 'simple' ? <Gift className="w-5 h-5" /> :
                            revealMode === 'scratch' ? <Eraser className="w-5 h-5" /> :
                              <Gamepad2 className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FestiveCard>

          <p className="text-center text-sm text-muted-foreground mt-6">
            🎄 Click on each gift to reveal who it's for!
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Reveal for Gift #{selectedParticipant?.giftNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedParticipant && (
              <>
                {revealMode === 'scratch' && (
                  <ScratchReveal
                    className="h-64 border-2 border-border"
                    onReveal={handleModalReveal}
                  >
                    <div className="h-full flex flex-col items-center justify-center bg-card p-6 text-center">
                      <p className="text-muted-foreground mb-2">Gift #{selectedParticipant.giftNumber} is for:</p>
                      <h3 className="font-display text-4xl font-bold text-christmas-red animate-pulse">
                        {selectedParticipant.assignedTo}
                      </h3>
                    </div>
                  </ScratchReveal>
                )}
                {revealMode === 'slot' && (
                  <SlotReveal
                    target={selectedParticipant.assignedTo}
                    onReveal={handleModalReveal}
                    candidates={room.participants.map(p => p.name)}
                  />
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AdminReveal;
