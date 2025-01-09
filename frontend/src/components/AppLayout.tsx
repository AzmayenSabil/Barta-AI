import React, { useState } from 'react';
import Navbar from './navigation/Navbar';
import Sidebar from './navigation/Sidebar';
import MeetingContent from './meetingContentViewer/MeetingContent';
import UploadModal from './modals/UploadModal';
import ProfileModal from './modals/profile/ProfileModal';
import { Meeting } from '../types';
import Footer from './navigation/Footer';

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

  const handleFileUpload = (file: File) => {
    const newMeeting: Meeting = {
      id: meetings.length + 1,
      title: file.name.replace(/\.[^/.]+$/, ""),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      duration: "Processing...",
    };

    setMeetings([newMeeting, ...meetings]);
    setSelectedMeeting(newMeeting.id);
    setUploadModalOpen(false);
    setActiveTab('transcript');

    setTimeout(() => {
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === newMeeting.id 
            ? { ...meeting, duration: "32 minutes" }
            : meeting
        )
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        onUploadClick={() => setUploadModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1">
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
            isProcessing={meetings.find(m => m.id === selectedMeeting)?.duration === "Processing..."}
          />
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AppLayout;
