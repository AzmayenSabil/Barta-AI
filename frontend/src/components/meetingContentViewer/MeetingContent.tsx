import React, { useState } from 'react';
import { FileText, List, CheckSquare, BarChart3, Users, ThumbsUp, Loader2, Globe, Flag, Download, X } from 'lucide-react';
import TabButton from './TabButton'; // Adjust the path to where TabButton is located
import Transcript from './tabItems/Transcript';
import Summary from './tabItems/Summary';
import Tasks from './tabItems/Tasks';



interface Transcript {
  start_time: string; 
  end_time: string; 
  dialogue: string;
  speakerName?: string;
  sentiment: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: string;
  transcript?: Transcript[];
  audioUrl?: string;
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
          <div>
            {activeTab === 'transcript' && 
            <Transcript 
          transcript={meeting.transcript} 
          audioSrc={meeting.audioUrl} 
        />}
            {activeTab === 'summary' && <Summary keyPoints={keyPoints} keyDecisions={keyDecisions} />}
            {activeTab === 'tasks' && <Tasks />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingContent;