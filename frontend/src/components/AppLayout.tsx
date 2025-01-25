import React, { useState } from "react";
import Navbar from "./navigation/Navbar";
import Sidebar from "./navigation/Sidebar";
import MeetingContent from "./meetingContentViewer/MeetingContent";
import UploadModal from "./modals/UploadModal";
import ProfileModal from "./modals/profile/ProfileModal";
import Footer from "./navigation/Footer";

interface TranscriptEntry {
  start_time: string;
  end_time: string;
  dialogue: string;
  sentiment: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: string;
  transcript?: TranscriptEntry[];
  audioUrl: string;
}

const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: "Q2 Strategy Session",
    date: "2025-01-10",
    duration: "90 minutes",
    transcript: [
      {
        start_time: "00:00",
        end_time: "05:00",
        dialogue: "Let's focus on increasing market share.",
        name: "Alice",
        sentiment: "positive",
      },
      {
        start_time: "05:01",
        end_time: "10:00",
        dialogue: "We should prioritize customer feedback implementation.",
        name: "Bob",
        sentiment: "neutral",
      }
    ],
    audioUrl: "src/audio/test_audio.mp3",
  },
  {
    id: 2,
    title: "Weekly Team Sync",
    date: "2025-01-09",
    duration: "45 minutes",
    transcript: [
      {
        start_time: "00:00",
        end_time: "02:30",
        dialogue: "Updates from the marketing team?",
        name: "Charlie",
        sentiment: "neutral",
      },
      {
        start_time: "02:31",
        end_time: "05:00",
        dialogue: "We’ve launched the new campaign successfully.",
        name: "Diana",
        sentiment: "positive",
      },
    ],
    overall_sentiment: "positive",
    audioUrl: "src/audio/test_audio.mp3",
  },
];


function AppLayout() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("transcript");
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleTranscriptUpload = (transcript: TranscriptEntry[]) => {
    const newMeeting: Meeting = {
      id: meetings.length + 1,
      title: `Meeting ${meetings.length + 1}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      duration: "32 minutes",
      transcript: transcript,
    };

    const updatedMeetings = [newMeeting, ...meetings];
    setMeetings(updatedMeetings);
    setSelectedMeeting(newMeeting.id);
    setUploadModalOpen(false);
    setActiveTab("transcript");
  };

  const selectedMeetingData = meetings.find((m) => m.id === selectedMeeting);

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