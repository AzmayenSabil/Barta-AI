import React from 'react';

export default function TranscriptViewer({ transcript }: { transcript: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Transcript</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {transcript || 'No transcript available. Upload a file to see the transcript here.'}
        </pre>
      </div>
    </div>
  );
}