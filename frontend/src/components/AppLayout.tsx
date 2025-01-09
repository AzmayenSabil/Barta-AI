import React, { useState } from 'react';
import Navbar from './navigation/Navbar';
import Sidebar from './navigation/Sidebar';
import MeetingContent from './meetingContentViewer/MeetingContent';
import UploadModal from './modals/UploadModal';
import ProfileModal from './modals/profile/ProfileModal';
import Footer from './navigation/Footer';

// Define interface directly in the component file
interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: string;
  transcript?: string;
}

const initialMeetings: Meeting[] = [
  { id: 1, title: "Team Planning Meeting", date: "April 2, 2025", duration: "45 minutes" },
  { id: 2, title: "Project Review", date: "April 1, 2025", duration: "60 minutes" },
  { id: 3, title: "Sprint Planning", date: "March 31, 2025", duration: "30 minutes" },
];

function AppLayout() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleTranscriptUpload = (transcript: string) => {
    const newMeeting: Meeting = {
      id: meetings.length + 1,
      title: `Meeting ${meetings.length + 1}`,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      duration: "32 minutes",
      transcript: transcript
    };

    setMeetings([newMeeting, ...meetings]);
    setSelectedMeeting(newMeeting.id);
    setUploadModalOpen(false);
    setActiveTab('transcript');
  };

  const selectedMeetingData = meetings.find(m => m.id === selectedMeeting);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        onUploadClick={() => setUploadModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          meetings={meetings}
          selectedMeeting={selectedMeeting}
          onSelectMeeting={setSelectedMeeting}
        />

        <div className="flex-1 p-6">
          <MeetingContent
            meeting={selectedMeetingData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isProcessing={false}
          />
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleTranscriptUpload}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default AppLayout;