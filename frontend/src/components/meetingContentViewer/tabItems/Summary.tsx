import React, { useState } from 'react';
import { Globe, Users, ThumbsUp, BarChart3 } from 'lucide-react';

interface SummaryProps {
  keyPoints: { bengali: string[]; english: string[] };
  keyDecisions: { bengali: string[]; english: string[] };
}

const Summary: React.FC<SummaryProps> = ({ keyPoints, keyDecisions }) => {
  const [showEnglish, setShowEnglish] = useState(false);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Speakers</h3>
          </div>
          <p className="text-sm text-blue-800">Speaker 1 (50%), Speaker 2 (50%)</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Sentiment</h3>
          </div>
          <p className="text-sm text-green-800">Positive (75%), Neutral (20%), Negative (5%)</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Engagement</h3>
          </div>
          <p className="text-sm text-purple-800">High participation, 85% engagement rate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Key Points</h3>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className="flex items-center space-x-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm">{showEnglish ? 'Show Bengali' : 'Show English'}</span>
          </button>
        </div>
        <ul className="list-disc pl-6 space-y-2">
          {(showEnglish ? keyPoints.english : keyPoints.bengali).map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Decisions</h3>
        <ul className="list-disc pl-6 space-y-2">
          {(showEnglish ? keyDecisions.english : keyDecisions.bengali).map((decision, index) => (
            <li key={index}>{decision}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Summary;
