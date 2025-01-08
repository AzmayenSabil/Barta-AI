import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MeetingContent from './MeetingContent';
import UploadModal from './UploadModal';
import { Meeting } from '../types';

const meetings: Meeting[] = [
  { id: 1, title: "Team Planning Meeting", date: "April 2, 2025", duration: "45 minutes" },
  { id: 2, title: "Project Review", date: "April 1, 2025", duration: "60 minutes" },
  { id: 3, title: "Sprint Planning", date: "March 31, 2025", duration: "30 minutes" },
];

function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        onUploadClick={() => setUploadModalOpen(true)}
      />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          meetings={meetings}
          selectedMeeting={selectedMeeting}
          onSelectMeeting={setSelectedMeeting}
        />

        <div className="flex-1 p-6">
          <MeetingContent
            meeting={meetings.find(m => m.id === selectedMeeting)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={(file) => {
          console.log('File uploaded:', file);
          setUploadModalOpen(false);
        }}
      />
    </div>
  );
}

export default AppLayout;