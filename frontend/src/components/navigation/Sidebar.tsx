import React, { useState } from 'react';
import { ChevronRight, Clock, Filter } from 'lucide-react';
import { Meeting } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  meetings: Meeting[];
  selectedMeeting: number | null;
  onSelectMeeting: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  meetings,
  selectedMeeting,
  onSelectMeeting,
}) => {
  console.log("Meeting data:", meetings);
  const [filter, setFilter] = useState({ date: '', speaker: '', sentiment: '', keyword: '' });

  // Clear Filter Function
  const clearFilter = () => {
    setFilter({ date: '', speaker: '', sentiment: '', keyword: '' });
  };

  // Filtered Meetings
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesDate = !filter.date || meeting.date.startsWith(filter.date);
    const matchesSpeaker =
      !filter.speaker ||
      meeting.transcript.some((t) =>
        t.name.toLowerCase().includes(filter.speaker.toLowerCase())
      );
    const matchesSentiment =
      !filter.sentiment ||
      meeting.transcript.some(
        (t) => t.overall_sentiment?.toLowerCase() === filter.sentiment.toLowerCase()
      );
    const matchesKeyword =
      !filter.keyword ||
      meeting.transcript.some((t) =>
        t.dialogue.toLowerCase().includes(filter.keyword.toLowerCase())
      );

    return matchesDate && matchesSpeaker && matchesSentiment && matchesKeyword;
  });

  return (
    <div
      className={`bg-white w-80 border-r transition-all duration-300 h-[90vh] flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex-shrink-0">
        <h2 className="text-xl font-semibold mb-4">Meeting History</h2>
        {/* Filter Section */}
        <div className="space-y-2">
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg text-sm"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            placeholder="Filter by Date"
          />
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg text-sm"
            value={filter.speaker}
            onChange={(e) => setFilter({ ...filter, speaker: e.target.value })}
            placeholder="Filter by Speaker"
          />
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg text-sm"
            value={filter.keyword}
            onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
            placeholder="Filter by Keyword"
          />
          <select
            className="w-full px-4 py-2 border rounded-lg text-sm"
            value={filter.sentiment}
            onChange={(e) =>
              setFilter({ ...filter, sentiment: e.target.value })
            }
          >
            <option value="">Filter by Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <button
            className="w-full px-4 py-2 border rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
            onClick={clearFilter}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Meeting List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {filteredMeetings.length > 0 ? (
          <div className="space-y-2">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  selectedMeeting === meeting.id
                    ? 'bg-indigo-50 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectMeeting(meeting.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{meeting.title}</h3>
                    <p className="text-sm text-gray-600">{meeting.date}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{meeting.duration}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No meetings found.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
