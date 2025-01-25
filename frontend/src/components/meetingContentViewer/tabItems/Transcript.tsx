import React, { useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import { Timer } from 'lucide-react';

interface TranscriptEntry {
  start_time: string; 
  end_time: string; 
  dialogue: string;
  speakerName?: string;
  sentiment?: string;
}

interface TranscriptProps {
  transcript?: TranscriptEntry[]; 
  audioSrc: string;
  setMeetings: (updatedTranscript: TranscriptEntry[]) => void;
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, audioSrc, setMeetings }) => {
  const [editableTranscript, setEditableTranscript] = useState<TranscriptEntry[]>(
    transcript?.map((entry, index) => ({
      ...entry, 
      speakerName: entry.speakerName || '', // Default blank if name is missing
      sentiment: entry.sentiment || '' // Default blank if sentiment is missing
    })) || []
  );
  console.log(editableTranscript);

  const speakerNames = [
    'Speaker 1', 
    'Speaker 2', 
    'John Doe', 
    'Jane Smith', 
    'Alex Johnson', 
    'Emily Brown', 
    'Michael Lee'
  ];

  const sentimentColors = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-yellow-100 text-yellow-800',
    '': '' // Default for missing sentiment
  };

  const updateSpeakerName = (index: number, newName: string) => {
    const updatedTranscript = [...editableTranscript];
    updatedTranscript[index].speakerName = newName;
    setEditableTranscript(updatedTranscript);
    setMeetings(updatedTranscript); // Update parent state
  };

  const updateSentiment = (index: number, newSentiment: string) => {
    const updatedTranscript = [...editableTranscript];
    updatedTranscript[index].sentiment = newSentiment;
    setEditableTranscript(updatedTranscript);
    setMeetings(updatedTranscript); // Update parent state
  };

  if (!transcript) {
    return <div>No transcript available for this meeting.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <AudioPlayer audioSrc={audioSrc} />
      </div>
      
      <div className="transcript-container">
        {editableTranscript.map((entry, index) => {
          return (
            <div 
              key={index} 
              className={`dialogue-entry p-2 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'} rounded-md mb-2 flex items-center`}
            >
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  {/* Dropdown for Speaker Name */}
                  <select 
                    value={entry.speakerName}
                    onChange={(e) => updateSpeakerName(index, e.target.value)}
                    className="mr-2 p-1 border rounded"
                  >
                    <option value="">Select Speaker</option>
                    {speakerNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>

                  {/* Timestamp */}
                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Timer className="w-3.5 h-3.5 mr-1.5" />
                    <span>{entry.start_time} - {entry.end_time}</span>
                  </div>

                  {/* Dropdown for Sentiment */}
                  <select
                    value={entry.sentiment}
                    onChange={(e) => updateSentiment(index, e.target.value)}
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[entry.sentiment || '']}`}
                  >
                    <option value="">Select Sentiment</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>

                {/* Dialogue */}
                <div>{entry.dialogue}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transcript;
