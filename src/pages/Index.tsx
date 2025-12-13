import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Snowfall } from '@/components/Snowfall';
import { GiftIcon } from '@/components/GiftIcon';
import { FestiveCard } from '@/components/FestiveCard';
import { Gift, Users, Key, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [participantKey, setParticipantKey] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);
  const navigate = useNavigate();

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantKey.trim()) {
      if (isAdminView) {
        navigate(`/admin/${participantKey.trim()}`);
      } else {
        navigate(`/reveal/${participantKey.trim()}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <GiftIcon size="lg" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Secret Santa
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Create magical gift exchanges with friends and family this holiday season
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Create Room Card */}
          <FestiveCard>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-christmas-green/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-christmas-green" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3">
                Create a Room
              </h2>
              <p className="text-muted-foreground mb-6">
                Start a new Secret Santa group and invite your friends
              </p>
              <Button asChild className="w-full" size="lg">
                <Link to="/create">
                  <Gift className="w-5 h-5 mr-2" />
                  Create New Room
                </Link>
              </Button>
            </div>
          </FestiveCard>

          {/* Enter Key Card */}
          <FestiveCard>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isAdminView ? 'bg-christmas-gold/10' : 'bg-christmas-red/10'} flex items-center justify-center transition-colors duration-300`}>
                {isAdminView ? (
                  <Sparkles className="w-8 h-8 text-christmas-gold" />
                ) : (
                  <Key className="w-8 h-8 text-christmas-red" />
                )}
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3">
                {isAdminView ? 'Admin Access' : 'Got a Key?'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isAdminView
                  ? 'Enter your creator key to reveal all matches'
                  : "Enter your unique key to see who you're gifting"}
              </p>
              <form onSubmit={handleKeySubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder={isAdminView ? "Enter creator key..." : "Enter your secret key..."}
                  value={participantKey}
                  onChange={(e) => setParticipantKey(e.target.value)}
                  className="text-center"
                />
                <Button type="submit" variant="secondary" className="w-full" size="lg">
                  {isAdminView ? 'Open Dashboard' : 'Reveal My Match'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdminView(!isAdminView);
                    setParticipantKey('');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline decoration-dotted underline-offset-4 mt-4"
                >
                  {isAdminView
                    ? 'Wait, I just want to find my match'
                    : 'Are you the organizer? Manage room here'}
                </button>
              </form>
            </div>
          </FestiveCard>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h3 className="font-display text-xl font-semibold mb-6 text-muted-foreground">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-christmas-gold/20 flex items-center justify-center text-christmas-gold font-display font-bold">
                1
              </div>
              <p className="text-sm text-muted-foreground">
                Create a room and add everyone's names
              </p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-christmas-gold/20 flex items-center justify-center text-christmas-gold font-display font-bold">
                2
              </div>
              <p className="text-sm text-muted-foreground">
                Share unique keys with each participant
              </p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-christmas-gold/20 flex items-center justify-center text-christmas-gold font-display font-bold">
                3
              </div>
              <p className="text-sm text-muted-foreground">
                Everyone discovers their secret match!
              </p>
            </div>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="mt-16 text-center text-christmas-green/60 text-2xl">
          🎄 🎁 ⭐ 🎁 🎄
        </div>
      </div>
    </div>
  );
};

export default Index;
