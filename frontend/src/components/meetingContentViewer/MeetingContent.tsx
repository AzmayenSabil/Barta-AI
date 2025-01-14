import React from 'react';
import { FileText, List, CheckSquare, BarChart3, Users, ThumbsUp, Loader2 } from 'lucide-react';

interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: string;
  transcript?: string;
}

interface MeetingContentProps {
  meeting?: Meeting;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isProcessing: boolean;
}

const MeetingContent: React.FC<MeetingContentProps> = ({
  meeting,
  activeTab,
  onTabChange,
  isProcessing,
}) => {
  if (!meeting) {
    return (
      <div className="text-center text-gray-600">
        <p>Select a meeting from the sidebar to view details</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-gray-600 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-lg">Processing your audio file...</p>
        <p className="text-sm">This might take a few minutes</p>
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
            <div className="whitespace-pre-wrap text-gray-600">
              {meeting.transcript ? (
                <div className="space-y-4">
                  {meeting.transcript
                    .split('\n')
                    .map((line, index) => {
                      const [speaker, text] = line.split(':');
                      return (
                        <div key={index} className="flex flex-col">
                          <span className="font-semibold text-blue-600">{speaker.trim()}:</span>
                          <span className="ml-4 text-gray-700">{text.trim()}</span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                'No transcript available for this meeting.'
              )}
            </div>
          )}
          {activeTab === 'summary' && (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Speakers</h3>
                  </div>
                  <p className="text-sm text-blue-800">John (45%), Sarah (35%), Mike (20%)</p>
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

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Q2 objectives defined and prioritized</li>
                  <li>Team capacity assessment completed</li>
                  <li>Project deadlines reviewed and adjusted</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Decisions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Increase team capacity by hiring two developers</li>
                  <li>Postpone feature X launch to Q3</li>
                  <li>Implement new sprint planning process</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Topic Distribution</h3>
                <div className="h-40 flex items-end space-x-4">
                  <div className="flex-1 bg-indigo-200 rounded-t h-[80%]" title="Planning"></div>
                  <div className="flex-1 bg-indigo-300 rounded-t h-[60%]" title="Technical"></div>
                  <div className="flex-1 bg-indigo-400 rounded-t h-[40%]" title="Resources"></div>
                  <div className="flex-1 bg-indigo-500 rounded-t h-[30%]" title="Timeline"></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Planning</span>
                  <span>Technical</span>
                  <span>Resources</span>
                  <span>Timeline</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Action Items</h3>
              <div className="space-y-3">
                <TaskItem
                  name="Update project timeline"
                  assignee="John Doe"
                  deadline="2024-04-05"
                />
                <TaskItem
                  name="Schedule follow-up meeting"
                  assignee="Sarah Smith"
                  deadline="2024-04-03"
                />
                <TaskItem
                  name="Create technical documentation"
                  assignee="Mike Johnson"
                  deadline="2024-04-10"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{
  name: string;
  assignee: string;
  deadline: string;
}> = ({ name, assignee, deadline }) => (
  <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <input
      type="checkbox"
      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
    />
    <div className="flex-1">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-600">Assigned to {assignee}</p>
    </div>
    <div className="text-sm text-gray-500">
      Due {new Date(deadline).toLocaleDateString()}
    </div>
  </div>
);

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