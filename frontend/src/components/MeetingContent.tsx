import React from 'react';
import { FileText, List, CheckSquare } from 'lucide-react';
import { Meeting } from '../types';

interface MeetingContentProps {
  meeting: Meeting | undefined;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MeetingContent: React.FC<MeetingContentProps> = ({
  meeting,
  activeTab,
  onTabChange,
}) => {
  if (!meeting) {
    return (
      <div className="text-center text-gray-600">
        <p>Select a meeting from the sidebar to view details</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 border-b">
        <div className="flex space-x-6">
          <TabButton
            icon={<FileText className="h-5 w-5" />}
            label="Transcript"
            isActive={activeTab === 'transcript'}
            onClick={() => onTabChange('transcript')}
          />
          <TabButton
            icon={<List className="h-5 w-5" />}
            label="Summary"
            isActive={activeTab === 'summary'}
            onClick={() => onTabChange('summary')}
          />
          <TabButton
            icon={<CheckSquare className="h-5 w-5" />}
            label="Tasks"
            isActive={activeTab === 'tasks'}
            onClick={() => onTabChange('tasks')}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">{meeting.title}</h1>
        <div className="prose max-w-none">
          {activeTab === 'transcript' && (
            <p className="text-gray-600">
              আমরা আজ টিম প্ল্যানিং নিয়ে আলোচনা করব...
            </p>
          )}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Points</h3>
              <ul className="list-disc pl-6">
                <li>Discussion about Q2 objectives</li>
                <li>Team capacity planning</li>
                <li>Upcoming project deadlines</li>
              </ul>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Action Items</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Update project timeline</span>
                </li>
                <li className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Schedule follow-up meeting</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    className={`flex items-center space-x-2 pb-4 ${
      isActive
        ? 'border-b-2 border-indigo-600 text-indigo-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default MeetingContent;