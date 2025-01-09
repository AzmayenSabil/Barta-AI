import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';

interface MeetingItemProps {
  meeting: {
    id: number;
    title: string;
    date: string;
    duration: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const MeetingItem = ({ meeting, isSelected, onClick }: MeetingItemProps) => (
  <div
    className={`p-3 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'
    }`}
    onClick={onClick}
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
);