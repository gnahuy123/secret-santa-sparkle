-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  creator_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  participant_key TEXT NOT NULL UNIQUE,
  assigned_to TEXT NOT NULL,
  gift_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert rooms (no auth required)
CREATE POLICY "Anyone can create rooms"
ON public.rooms FOR INSERT
WITH CHECK (true);

-- Allow reading rooms by creator key or room code
CREATE POLICY "Anyone can read rooms"
ON public.rooms FOR SELECT
USING (true);

-- Allow anyone to insert participants
CREATE POLICY "Anyone can create participants"
ON public.participants FOR INSERT
WITH CHECK (true);

-- Allow reading participants
CREATE POLICY "Anyone can read participants"
ON public.participants FOR SELECT
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_participants_room_id ON public.participants(room_id);
CREATE INDEX idx_participants_key ON public.participants(participant_key);
CREATE INDEX idx_rooms_creator_key ON public.rooms(creator_key);
CREATE INDEX idx_rooms_room_code ON public.rooms(room_code);