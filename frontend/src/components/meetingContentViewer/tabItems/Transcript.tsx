import React from 'react';

interface TranscriptProps {
  transcript?: { start_time: string; end_time: string; dialogue: string }[];
}

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => {
  if (!transcript) {
    return <div>No transcript available for this meeting.</div>;
  }

  return (
    <div className="whitespace-pre-wrap text-gray-600">
      <div className="space-y-4">
        {transcript.map((entry, index) => {
          const speakerNumber = index % 2 === 0 ? 1 : 2;
          return (
            <div key={index} className="flex flex-col">
              <span className="font-semibold text-blue-600">{`Speaker ${speakerNumber}:`}</span>
              <span className="ml-4 text-gray-700">{entry.dialogue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transcript;
