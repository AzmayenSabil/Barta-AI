import React, { useState } from "react";
import { Globe, Users, ThumbsUp, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./speakerInfo/dialog";

const Summary = ({ summary, speakers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  const selectSpeaker = (speaker) => setSelectedSpeaker(speaker);

  // Render speaker distribution
  const totalSpeakers = speakers.length;
  const speakerDistribution = speakers
    .map((speaker) => `${speaker.name} (${((100 / totalSpeakers) || 0).toFixed(0)}%)`)
    .join(", ");

  // Calculate sentiment distribution
  const sentimentCounts = speakers.reduce((acc, { sentiment }) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});
  const sentimentDistribution = Object.entries(sentimentCounts)
    .map(([sentiment, count]) => `${sentiment} (${((count / totalSpeakers) * 100 || 0).toFixed(0)}%)`)
    .join(", ");

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="grid grid-cols-3 gap-4">
        {/* Speaker Distribution */}
        <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" onClick={openModal}>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Speakers</h3>
          </div>
          <p className="text-sm text-blue-800">{speakerDistribution || "No data available"}</p>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Sentiment</h3>
          </div>
          <p className="text-sm text-green-800">{sentimentDistribution || "No data available"}</p>
        </div>

        {/* Engagement Placeholder */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Engagement</h3>
          </div>
          <p className="text-sm text-purple-800">High engagement, 85% participation</p>
        </div>
      </div>

      {/* Render Summary Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Meeting Summary</h3>
        <ul className="list-disc pl-6 space-y-2">
          {summary.map((point, index) => (
            <li key={index}>{point || "No data available"}</li>
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
