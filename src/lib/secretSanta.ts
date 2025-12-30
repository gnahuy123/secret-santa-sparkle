import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';

export interface Participant {
  name: string;
  key: string;
  assignedTo: string;
  giftNumber: number;
}

export interface Room {
  id: string;
  creatorKey: string;
  participants: Participant[];
  createdAt: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createAssignments(names: string[]): { name: string; assignedTo: string }[] {
  // Create a derangement (no one gets themselves)
  let shuffled: string[];
  let isValid = false;

  while (!isValid) {
    shuffled = shuffleArray(names);
    isValid = names.every((name, i) => name !== shuffled[i]);
  }

  return names.map((name, i) => ({
    name,
    assignedTo: shuffled![i],
  }));
}

export async function createRoom(names: string[]): Promise<Room> {
  const assignments = createAssignments(names);
  const giftNumbers = shuffleArray([...Array(names.length)].map((_, i) => i + 1));

  const roomCode = nanoid(10);
  const creatorKey = nanoid(12);

  // Insert room into Supabase
  const { data: roomData, error: roomError } = await supabase
    .from('rooms')
    .insert({
      room_code: roomCode,
      creator_key: creatorKey,
    })
    .select()
    .single();

  if (roomError) throw roomError;

  const participants: Participant[] = assignments.map((a, i) => ({
    name: a.name,
    key: nanoid(8),
    assignedTo: a.assignedTo,
    giftNumber: giftNumbers[i],
  }));

  // Insert participants into Supabase
  const participantsToInsert = participants.map(p => ({
    room_id: roomData.id,
    name: p.name,
    participant_key: p.key,
    assigned_to: p.assignedTo,
    gift_number: p.giftNumber,
  }));

  const { error: participantsError } = await supabase
    .from('participants')
    .insert(participantsToInsert);

  if (participantsError) throw participantsError;

  return {
    id: roomCode,
    creatorKey,
    participants,
    createdAt: Date.now(),
  };
}

export async function findParticipantByKey(key: string): Promise<{ room: Room; participant: Participant } | null> {
  const { data: participantData, error: participantError } = await supabase
    .from('participants')
    .select(`
      *,
      rooms (*)
    `)
    .eq('participant_key', key)
    .maybeSingle();

  if (participantError || !participantData) {
    return null;
  }

  const roomInfo = participantData.rooms as any;

  // Fetch all participants for this room
  const { data: allParticipants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .eq('room_id', roomInfo.id);

  if (participantsError) {
    // silently fail fetching other participants if that's the only issue
  }

  const participants: Participant[] = (allParticipants || []).map(p => ({
    name: p.name,
    key: p.participant_key,
    assignedTo: p.assigned_to,
    giftNumber: p.gift_number,
  }));

  const room: Room = {
    id: roomInfo.room_code,
    creatorKey: roomInfo.creator_key,
    participants,
    createdAt: new Date(roomInfo.created_at).getTime(),
  };

  const participant: Participant = {
    name: participantData.name,
    key: participantData.participant_key,
    assignedTo: participantData.assigned_to,
    giftNumber: participantData.gift_number,
  };



  return { room, participant };
}

export async function findRoomByCreatorKey(creatorKey: string): Promise<Room | null> {
  const { data: roomData, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('creator_key', creatorKey)
    .maybeSingle();

  if (error || !roomData) return null;

  const { data: participantsData } = await supabase
    .from('participants')
    .select('*')
    .eq('room_id', roomData.id);

  const participants: Participant[] = (participantsData || []).map(p => ({
    name: p.name,
    key: p.participant_key,
    assignedTo: p.assigned_to,
    giftNumber: p.gift_number,
  }));

  return {
    id: roomData.room_code,
    creatorKey: roomData.creator_key,
    participants,
    createdAt: new Date(roomData.created_at).getTime(),
  };
}

export async function findRoomById(roomId: string): Promise<Room | null> {
  const { data: roomData, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('room_code', roomId)
    .maybeSingle();

  if (error || !roomData) return null;

  const { data: participantsData } = await supabase
    .from('participants')
    .select('*')
    .eq('room_id', roomData.id);

  const participants: Participant[] = (participantsData || []).map(p => ({
    name: p.name,
    key: p.participant_key,
    assignedTo: p.assigned_to,
    giftNumber: p.gift_number,
  }));

  return {
    id: roomData.room_code,
    creatorKey: roomData.creator_key,
    participants,
    createdAt: new Date(roomData.created_at).getTime(),
  };
}
