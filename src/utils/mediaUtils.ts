export const toggleMediaTrack = (stream: MediaStream | undefined, type: 'audio' | 'video'): boolean => {
  if (!stream) return false;
  
  const tracks = type === 'audio' ? stream.getAudioTracks() : stream.getVideoTracks();
  if (tracks.length === 0) return false;
  
  // Get current state before toggling
  const currentState = tracks[0].enabled;
  
  // Toggle to opposite state
  const newState = !currentState;
  
  // Apply new state to all tracks
  tracks.forEach(track => {
    track.enabled = newState;
  });
  
  return newState;
};