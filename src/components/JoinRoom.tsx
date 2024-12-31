import React, { useState } from 'react';
import { Video, Users, Share2, Globe, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useRoomStore } from '../store/useRoomStore';
import { FeatureCard } from './ui/FeatureCard';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const JoinRoom: React.FC = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const { setCurrentRoom, setLocalParticipant } = useRoomStore();

  React.useEffect(() => {
    const urlRoomId = new URLSearchParams(window.location.search).get('roomId');
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }
  }, []);

  const handleJoin = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const participant = {
        id: uuidv4(),
        name,
        videoEnabled: true,
        audioEnabled: true,
        stream,
      };

      const room = {
        id: roomId || uuidv4(),
        participants: [participant],
      };

      const newUrl = `${window.location.origin}?roomId=${room.id}`;
      window.history.pushState({}, '', newUrl);

      setLocalParticipant(participant);
      setCurrentRoom(room);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Failed to access camera and microphone');
    }
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "Group Meetings",
      description: "Connect with multiple participants in high-quality video calls."
    },
    {
      icon: <Share2 className="w-8 h-8 text-indigo-500" />,
      title: "Easy Sharing",
      description: "Share your room link instantly with anyone you want to meet."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: "No Downloads",
      description: "Works directly in your browser. No installations required."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 rounded-2xl shadow-xl">
              <Video className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Connect Face to Face <br />
            <span className="text-indigo-600">Anywhere, Anytime</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience high-quality video meetings designed for modern teams.
            No downloads, no hassle — just seamless communication.
          </p>
        </div>

        {/* Feature Banner */}
        <div className="bg-indigo-600 text-white rounded-2xl p-8 mb-20">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Zap className="w-6 h-6" />
            <span className="text-lg font-semibold">Why Choose BartaAI?</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} variant="light" />
            ))}
          </div>
        </div>

        {/* Join Meeting Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm backdrop-filter">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">
              {roomId ? 'Join Meeting' : 'Start Meeting'}
            </h2>
            <div className="space-y-6">
              <Input
                label="Your Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />

              <Input
                label="Room ID (optional)"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID to join existing room"
              />

              <Button
                onClick={handleJoin}
                disabled={!name.trim()}
                fullWidth
              >
                {roomId ? 'Join Room' : 'Create Room'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};