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
  {
    id: 1,
    title: "Q2 Strategy Session",
    date: "January 10, 2025",
    duration: "90 minutes",
    transcript: "Speaker 1: Let's focus on increasing market share.\nSpeaker 2: Agreed, and we should prioritize customer feedback implementation."
  },
  {
    id: 2,
    title: "Weekly Team Sync",
    date: "January 9, 2025",
    duration: "45 minutes",
    transcript: "Speaker 1: Updates from the marketing team?\nSpeaker 2: We’ve launched the new campaign successfully."
  },
  {
    id: 3,
    title: "Product Launch Planning",
    date: "January 8, 2025",
    duration: "60 minutes",
    transcript: "Speaker 1: Are we on track for the launch date?\nSpeaker 2: Yes, but we need to finalize testing by next week."
  },
  {
    id: 4,
    title: "Client Feedback Review",
    date: "January 7, 2025",
    duration: "30 minutes",
    transcript: "Speaker 1: The client suggested improving the onboarding experience.\nSpeaker 2: I’ll work on a new prototype."
  },
  {
    id: 5,
    title: "Budget Planning Meeting",
    date: "January 6, 2025",
    duration: "75 minutes",
    transcript: "Speaker 1: We need to allocate more resources to R&D.\nSpeaker 2: That will require adjustments in other departments’ budgets."
  },
];

function AppLayout() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  // Function to handle transcript upload and update selected meeting
  const handleTranscriptUpload = (transcript: string) => {
    const newMeeting: Meeting = {
      id: meetings.length + 1,
      title: `Meeting ${meetings.length + 1}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      duration: '32 minutes',
      transcript: transcript,
    };

    const updatedMeetings = [newMeeting, ...meetings];
    console.log('Updated meetings:', updatedMeetings);
    setMeetings(updatedMeetings);
    setSelectedMeeting(newMeeting.id); // Automatically select the new meeting
    setUploadModalOpen(false);
    setActiveTab('transcript');
  };

  // Fetch selected meeting data dynamically
  const selectedMeetingData = meetings.find((m) => m.id === selectedMeeting);

  const handleUploadModalClose = () => {
    setUploadModalOpen(false);
  };

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
            meeting={selectedMeetingData} // Pass dynamically updated meeting data
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isProcessing={false}
          />
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        onUpload={handleTranscriptUpload} // Pass updated handler
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
