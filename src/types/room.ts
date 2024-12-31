export interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  stream?: MediaStream;
}

export interface Room {
  id: string;
  participants: Participant[];
}