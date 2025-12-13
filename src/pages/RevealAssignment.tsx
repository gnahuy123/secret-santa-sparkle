import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Snowfall } from '@/components/Snowfall';
import { FestiveCard } from '@/components/FestiveCard';
import { GiftIcon } from '@/components/GiftIcon';
import { findParticipantByKey, Participant, Room } from '@/lib/secretSanta';
import { ArrowLeft, Gift, Hash } from 'lucide-react';

const RevealAssignment = () => {
  const { key } = useParams<{ key: string }>();
  const [data, setData] = useState<{ room: Room; participant: Participant } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (key) {
      const result = findParticipantByKey(key);
      if (result) {
        setData(result);
      } else {
        setNotFound(true);
      }
    }
  }, [key]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowfall />
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-md mx-auto text-center">
            <GiftIcon size="lg" className="mx-auto mb-6 opacity-50" />
            <h1 className="font-display text-2xl font-bold mb-4">Key Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This key doesn't match any Secret Santa room. Please check and try again.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
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

  const { participant } = data;

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

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <GiftIcon size="lg" className="mx-auto mb-4" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Hello, {participant.name}!
            </h1>
            <p className="text-muted-foreground">
              Ready to find out who you're getting a gift for?
            </p>
          </div>

          {!revealed ? (
            <FestiveCard className="text-center">
              <p className="text-lg mb-6">
                Your Secret Santa match is waiting...
              </p>
              <Button
                size="lg"
                className="w-full glow-animation"
                onClick={() => setRevealed(true)}
              >
                <Gift className="w-5 h-5 mr-2" />
                Reveal My Match!
              </Button>
            </FestiveCard>
          ) : (
            <div className="space-y-4">
              <FestiveCard className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  You are getting a gift for...
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-christmas-red mb-4">
                  {participant.assignedTo}
                </h2>
                <div className="w-16 h-1 bg-christmas-gold mx-auto rounded-full" />
              </FestiveCard>

              <FestiveCard className="text-center bg-christmas-green/5">
                <div className="flex items-center justify-center gap-3">
                  <Hash className="w-6 h-6 text-christmas-green" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Put this number on your gift:
                    </p>
                    <p className="font-display text-4xl font-bold text-christmas-green">
                      {participant.giftNumber}
                    </p>
                  </div>
                </div>
              </FestiveCard>

              <p className="text-center text-sm text-muted-foreground">
                🤫 Remember: Keep it secret, keep it fun!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevealAssignment;
