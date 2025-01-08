import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MeetingContent from './MeetingContent';
import UploadModal from './UploadModal';
import ProfileModal from './ProfileModal';
import { Meeting } from '../types';

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
    // Create new meeting entry
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

    // Add new meeting to list
    setMeetings([newMeeting, ...meetings]);
    
    // Select the new meeting
    setSelectedMeeting(newMeeting.id);
    
    // Close upload modal
    setUploadModalOpen(false);
    
    // Show transcript tab
    setActiveTab('transcript');

    // Simulate processing completion after 2 seconds
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
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        onUploadClick={() => setUploadModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
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
            isProcessing={meetings.find(m => m.id === selectedMeeting)?.duration === "Processing..."}
          />
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}

export default AppLayout;