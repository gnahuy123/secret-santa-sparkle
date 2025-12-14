import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Snowfall } from '@/components/Snowfall';
import { FestiveCard } from '@/components/FestiveCard';
import { GiftIcon } from '@/components/GiftIcon';
import { findRoomById, Room } from '@/lib/secretSanta';
import { Copy, Check, ArrowLeft, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomCreated = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const creatorKey = (location.state as { creatorKey?: string })?.creatorKey;

  useEffect(() => {
    const loadRoom = async () => {
      if (roomId) {
        const foundRoom = await findRoomById(roomId);
        setRoom(foundRoom);
      }
    };
    loadRoom();
  }, [roomId]);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getShareLink = (key: string) => {
    return `${window.location.origin}/reveal/${key}`;
  };

  const copyShareLink = async (key: string, name: string) => {
    const link = getShareLink(key);

    // Convert base64 data to file for checking if share is supported
    const shareData = {
      title: 'Secret Santa Assignment',
      text: `Here is your Secret Santa Reveal Link for ${name}! 🎅`,
      url: link
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: `Link for ${name} shared`,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(link);
        setCopiedKey(key);
        toast({
          title: "Link Copied!",
          description: `Share link for ${name} copied to clipboard`,
        });
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch (err) {
      // If user cancelled or share failed, fallback to clipboard just in case
      // unless it was a user abort, but simple fallback is safer UX usually
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(link);
        setCopiedKey(key);
        toast({
          title: "Link Copied!",
          description: `Share link for ${name} copied to clipboard`,
        });
        setTimeout(() => setCopiedKey(null), 2000);
      }
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Snowfall />
        <div className="text-center">
          <p className="text-muted-foreground">Room not found</p>
          <Button asChild className="mt-4">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex justify-center mb-4">
              <div className="relative">
                <GiftIcon size="md" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-christmas-green rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-christmas-snow" />
                </div>
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Room Created! 🎉
            </h1>
            <p className="text-muted-foreground">
              Share the links below with each participant
            </p>
          </div>

          {/* Creator Key */}
          {creatorKey && (
            <FestiveCard className="mb-6 bg-christmas-gold/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-christmas-gold mb-1">
                    🔑 Your Creator Key (Save This!)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use this to view the reveal page later
                  </p>
                </div>
                <div className="flex gap-2">
                  <code className="px-3 py-2 bg-muted rounded font-mono text-sm">
                    {creatorKey}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(creatorKey, 'Creator key')}
                  >
                    {copiedKey === creatorKey ? (
                      <Check className="w-4 h-4 text-christmas-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                variant="secondary"
                onClick={() => navigate(`/admin/${creatorKey}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Go to Reveal Dashboard
              </Button>
            </FestiveCard>
          )}

          {/* Participant Keys */}
          <FestiveCard>
            <h2 className="font-display text-xl font-semibold mb-4 text-center">
              Share Links with Participants
            </h2>
            <div className="space-y-3">
              {room.participants.map((participant) => (
                <div
                  key={participant.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <span className="font-medium">{participant.name}</span>
                  <div className="flex gap-2">
                    <code className="px-2 py-1 bg-background rounded font-mono text-xs flex-1 sm:flex-none truncate max-w-[120px]">
                      {participant.key}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyShareLink(participant.key, participant.name)}
                    >
                      {copiedKey === participant.key ? (
                        <Check className="w-4 h-4 text-christmas-green" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FestiveCard>

          <p className="text-center text-sm text-muted-foreground mt-6">
            🎁 Each person uses their unique link to discover their match
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomCreated;
