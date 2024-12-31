import SimplePeer from 'simple-peer';
import { Participant } from '../types/room';

export const createPeer = (
  stream: MediaStream,
  initiator: boolean
): SimplePeer.Instance => {
  return new SimplePeer({
    initiator,
    stream,
    trickle: false
  });
};

export const handlePeerSignaling = (
  peer: SimplePeer.Instance,
  onSignal: (signal: SimplePeer.SignalData) => void,
  onStream: (stream: MediaStream) => void,
  onError: (error: Error) => void
) => {
  peer.on('signal', onSignal);
  peer.on('stream', onStream);
  peer.on('error', onError);
};