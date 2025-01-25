import React, { useState } from 'react';
import { Globe, Users, ThumbsUp, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './speakerInfo/dialog';

interface Speaker {
  name: string;
  talkTime: string;
  sentiment: string;
}

interface SummaryProps {
  keyPoints: { bengali: string[]; english: string[] };
  keyDecisions: { bengali: string[]; english: string[] };
  speakers: Speaker[];
}

const Summary: React.FC<SummaryProps> = ({ keyPoints, keyDecisions, speakers }) => {
  const [showEnglish, setShowEnglish] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  const selectSpeaker = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
  };

  // Calculate speaker distribution
  const totalSpeakers = speakers.length;
  const speakerDistribution = speakers
    .map((speaker) => `${speaker.name} (${(100 / totalSpeakers).toFixed(0)}%)`)
    .join(', ');

  // Calculate sentiment distribution
  const sentimentCounts = speakers.reduce(
    (acc, { sentiment }) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const sentimentDistribution = Object.entries(sentimentCounts)
    .map(([sentiment, count]) => `${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} (${((count / totalSpeakers) * 100).toFixed(0)}%)`)
    .join(', ');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {/* Dynamic Speakers Card */}
        <div
          className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition"
          onClick={openModal}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Speakers</h3>
          </div>
          <p className="text-sm text-blue-800">{speakerDistribution}</p>
        </div>

        {/* Dynamic Sentiment Card */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Sentiment</h3>
          </div>
          <p className="text-sm text-green-800">{sentimentDistribution}</p>
        </div>

        {/* Static Engagement Card */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Engagement</h3>
          </div>
          <p className="text-sm text-purple-800">High participation, 85% engagement rate</p>
        </div>
      </div>

      {/* Key Points and Key Decisions Sections */}
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

      {/* Speaker Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Speakers</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-96">
            {!selectedSpeaker ? (
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {speakers.map((speaker, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="p-2">{speaker.name}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => selectSpeaker(speaker)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">{selectedSpeaker.name}</h3>
                <p className="mb-2">
                  <strong>Talk Time:</strong> {selectedSpeaker.talkTime}
                </p>
                <p className="mb-2">
                  <strong>Sentiment:</strong> {selectedSpeaker.sentiment}
                </p>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setSelectedSpeaker(null)}
                >
                  Back to List
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Summary;
