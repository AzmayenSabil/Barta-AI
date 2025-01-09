import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
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
  return (
    <div
      className={`bg-white w-80 border-r transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Meeting History</h2>
        <div className="space-y-2">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
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
      </div>
    </div>
  );
};

export default Sidebar;