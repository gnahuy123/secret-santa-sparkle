import { nanoid } from 'nanoid';

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

export function createRoom(names: string[]): Room {
  const assignments = createAssignments(names);
  const giftNumbers = shuffleArray([...Array(names.length)].map((_, i) => i + 1));
  
  const participants: Participant[] = assignments.map((a, i) => ({
    name: a.name,
    key: nanoid(8),
    assignedTo: a.assignedTo,
    giftNumber: giftNumbers[i],
  }));
  
  return {
    id: nanoid(10),
    creatorKey: nanoid(12),
    participants,
    createdAt: Date.now(),
  };
}

export function saveRoom(room: Room): void {
  const rooms = getRooms();
  rooms[room.id] = room;
  localStorage.setItem('secretSantaRooms', JSON.stringify(rooms));
}

export function getRooms(): Record<string, Room> {
  const data = localStorage.getItem('secretSantaRooms');
  return data ? JSON.parse(data) : {};
}

export function findParticipantByKey(key: string): { room: Room; participant: Participant } | null {
  const rooms = getRooms();
  for (const room of Object.values(rooms)) {
    const participant = room.participants.find(p => p.key === key);
    if (participant) {
      return { room, participant };
    }
  }
  return null;
}

export function findRoomByCreatorKey(creatorKey: string): Room | null {
  const rooms = getRooms();
  for (const room of Object.values(rooms)) {
    if (room.creatorKey === creatorKey) {
      return room;
    }
  }
  return null;
}

export function findRoomById(roomId: string): Room | null {
  const rooms = getRooms();
  return rooms[roomId] || null;
}
