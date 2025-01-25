import React, { useState } from 'react';
import { FileText, List, CheckSquare, BarChart3, Users, ThumbsUp, Loader2, Globe, Flag, Download, X } from 'lucide-react';

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

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};


const MeetingContent: React.FC<MeetingContentProps> = ({
  meeting,
  activeTab,
  onTabChange,
  isProcessing,
}) => {
  const [showEnglish, setShowEnglish] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  console.log('===================', meeting?.transcript) //


  const handleDownload = () => {
    setIsDownloadModalOpen(true);
    setIsDownloading(true);
    setDownloadComplete(false);

    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);
    }, 5000);
  };

  const closeModal = () => {
    setIsDownloadModalOpen(false);
    setIsDownloading(false);
    setDownloadComplete(false);
  };


  const keyPoints = {
    bengali: [
      "বাংলা, বাংলা-ইংরেজি মিশ্রিত কথোপকথনের জন্য উন্নত ট্রান্সক্রিপশন মডেলের প্রয়োজন।",
      "ব্যবহারকারীর ফিডব্যাক গ্রহণ সহজ করার জন্য ১-ক্লিক রেটিং সিস্টেমের প্রস্তাব।",
      "বানানের চ্যালেঞ্জ মোকাবিলার জন্য শক্তিশালী স্পেল-চেকিং সিস্টেমের প্রয়োজন।",
      "মেম্বারশিপ কার্ডের মতো ফিচারের মাধ্যমে ব্যবহারকারীর সম্পৃক্ততা বাড়ানোর পরিকল্পনা।"
    ],
    english: [
      "Need for advanced transcription models to handle Bangla and Bangla-English mixed conversations.",
      "Proposal for 1-click rating system to simplify user feedback collection.",
      "Need for robust spell-checking system to address spelling challenges.",
      "Plan to increase user engagement through features like membership cards."
    ]
  };

  const keyDecisions = {
    bengali: [
      "ফিডব্যাক সিস্টেমে ১-ক্লিক রেটিং অন্তর্ভুক্ত করার পরিকল্পনা।",
      "রিয়েল-টাইম ট্রান্সক্রিপশন স্ক্রিন আরও ব্যবহারকারী-বান্ধব করে তোলার কাজ।",
      "আঞ্চলিক উচ্চারণ ট্রান্সক্রিপশনের সঠিকতা নিশ্চিত করতে মডেল উন্নয়নের সিদ্ধান্ত।"
    ],
    english: [
      "Plan to implement 1-click rating in the feedback system.",
      "Work on making the real-time transcription screen more user-friendly.",
      "Decision to improve model development for ensuring accurate regional pronunciation transcription."
    ]
  };

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
        <div className="flex justify-between">
          {/* Tabs on the left */}
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
          
          {/* Download tab on the right */}
          <div>
            <TabButton
              icon={<Download className="h-5 w-5" />}
              label="Download"
              isActive={activeTab === 'download'}
              onClick={handleDownload}
            />
          </div>
        </div>
      </div>

        {/* Custom Modal */}
      <Modal isOpen={isDownloadModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Download Meeting Content</h2>
          {isDownloading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
              <p>Preparing your download...</p>
            </div>
          ) : downloadComplete ? (
            <div className="py-4">
              <p className="text-green-600 mb-2">Download completed!</p>
              <p className="text-sm text-gray-500">Check your downloads folder</p>
            </div>
          ) : null}
        </div>
      </Modal>

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
                      const speakerNumber = index % 2 === 0 ? 1 : 2;
                      return (
                        <div key={index} className="flex flex-col">
                          <span className="font-semibold text-blue-600">{`Speaker ${speakerNumber}:`}</span>
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Key Decisions</h3>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  {(showEnglish ? keyDecisions.english : keyDecisions.bengali).map((decision, index) => (
                    <li key={index}>{decision}</li>
                  ))}
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
                  name="Optimize transcription model"
                  assignee="Speaker 1"
                  deadline="2025-03-08"
                />
                <TaskItem
                  name="Design feedback system UI"
                  assignee="Speaker 1"
                  deadline="2025-02-06"
                />
                <TaskItem
                  name="Integrate spell-checking feature"
                  assignee="Speaker 2"
                  deadline="2025-02-12"
                />
                <TaskItem
                  name="Prepare architecture documentation"
                  assignee="Speaker 2"
                  deadline="2025-02-09"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TaskItemProps {
  name: string;
  assignee: string;
  deadline: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ name, assignee, deadline }) => {
  const [priority, setPriority] = useState('medium');
  const [selectedAssignee, setSelectedAssignee] = useState(assignee);
  const [dueDate, setDueDate] = useState(deadline);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <p className="font-medium">{name}</p>
          <div className="flex items-center space-x-1">
            <Flag className="h-4 w-4" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()} border-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Assigned to:</span>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Speaker 1">Speaker 1</option>
              <option value="Speaker 2">Speaker 2</option>
            </select>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {isEditingDate ? (
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onBlur={() => setIsEditingDate(false)}
            className="border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditingDate(true)}
            className="cursor-pointer hover:text-indigo-600"
          >
            Due {new Date(dueDate).toLocaleDateString()}
          </div>
        )}
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
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default MeetingContent;