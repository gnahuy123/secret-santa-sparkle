import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Snowfall } from '@/components/Snowfall';
import { FestiveCard } from '@/components/FestiveCard';
import { GiftIcon } from '@/components/GiftIcon';
import { createRoom } from '@/lib/secretSanta';
import { Plus, X, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateRoom = () => {
  const [names, setNames] = useState<string[]>(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Preparing sleigh...');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const messages = [
        'Checking the list twice...',
        'Wrapping virtual gifts...',
        'Feeding the reindeer...',
        'Mixing hot cocoa...',
        'Polishing sleigh bells...'
      ];
      let i = 0;
      setLoadingMsg(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMsg(messages[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const addName = () => {
    if (names.length >= 30) {
      toast({
        title: "Maximum reached",
        description: "You can only add up to 30 participants",
        variant: "destructive",
      });
      return;
    }
    setNames([...names, '']);
  };

  const removeName = (index: number) => {
    if (names.length <= 2) {
      toast({
        title: "Minimum required",
        description: "You need at least 2 participants",
        variant: "destructive",
      });
      return;
    }
    setNames(names.filter((_, i) => i !== index));
  };

  const updateName = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validNames = names.filter(n => n.trim());

    if (validNames.length < 2) {
      toast({
        title: "Not enough participants",
        description: "Please add at least 2 names",
        variant: "destructive",
      });
      return;
    }

    const uniqueNames = new Set(validNames.map(n => n.trim().toLowerCase()));
    if (uniqueNames.size !== validNames.length) {
      toast({
        title: "Duplicate names",
        description: "All names must be unique",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const room = await createRoom(validNames.map(n => n.trim()));
      navigate(`/room/${room.id}`, { state: { creatorKey: room.creatorKey } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center p-8 bg-card border shadow-lg rounded-xl max-w-sm w-full mx-4">
              <div className="w-20 h-20 mx-auto mb-6 bg-christmas-green/10 rounded-full flex items-center justify-center animate-bounce">
                <GiftIcon size="lg" className="text-christmas-green" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2 animate-pulse text-foreground">
                Creating Magic...
              </h2>
              <p className="text-muted-foreground">
                {loadingMsg}
              </p>
            </div>
          </div>
        )}

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-xl mx-auto">
          {/* ... existing content ... */}
          <div className="text-center mb-8">
            <GiftIcon size="md" className="mx-auto mb-4" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Create Your Room
            </h1>
            <p className="text-muted-foreground">
              Add everyone who's joining the gift exchange
            </p>
          </div>

          <FestiveCard>
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-6">
                {names.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="w-8 h-10 flex items-center justify-center text-christmas-gold font-display font-semibold">
                      {index + 1}
                    </div>
                    <Input
                      type="text"
                      placeholder={`Participant ${index + 1}'s name`}
                      value={name}
                      onChange={(e) => updateName(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeName(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addName}
                  className="w-full"
                  disabled={names.length >= 30}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Participant ({names.length}/30)
                </Button>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Creating...' : 'Create Secret Santa Room'}
                </Button>
              </div>
            </form>
          </FestiveCard>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ✨ Names will be randomly matched — no one gets themselves!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
