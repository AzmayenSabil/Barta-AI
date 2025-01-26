import React, { useState, useEffect } from "react";
import { FileText, List, CheckSquare, Download, Loader2, X } from "lucide-react";
import TabButton from "./TabButton";
import Transcript from "./tabItems/Transcript";
import Summary from "./tabItems/Summary";
import Tasks from "./tabItems/Tasks";
import axios from "axios";

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

const calculateTalkTime = (transcripts) => {
  const speakerData = {};

  transcripts.forEach((item) => {
    const { name, start_time, end_time, sentiment } = item;

    const [startMinutes, startSeconds] = start_time.split(":").map(Number);
    const [endMinutes, endSeconds] = end_time.split(":").map(Number);

    const startInSeconds = startMinutes * 60 + startSeconds;
    const endInSeconds = endMinutes * 60 + endSeconds;
    const durationInMinutes = (endInSeconds - startInSeconds) / 60;

    if (!speakerData[name]) {
      speakerData[name] = { talkTime: 0, sentiments: [] };
    }

    speakerData[name].talkTime += durationInMinutes;
    speakerData[name].sentiments.push(sentiment);
  });

  return Object.entries(speakerData).map(([name, data]) => ({
    name,
    talkTime: `${Math.round(data.talkTime)} minutes`,
    sentiment: data.sentiments.join(", "),
  }));
};

const MeetingContent = ({
  meeting,
  setMeetings,
  activeTab,
  onTabChange,
  isProcessing,
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [summary, setSummary] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (meeting?.transcript) {
      setIsFetching(true);
      axios
        .post("http://localhost:8000/api/summary/process-meeting", meeting.transcript)
        .then((response) => {
          if (response.data.status === "success") {
            setSummary(response.data.data.summary || []);
            setTasks(response.data.data.action_items || []);
          }
        })
        .catch((error) => {
          console.error("Error fetching summary and tasks:", error);
          setSummary(["Error fetching summary"]);
          setTasks(["Error fetching tasks"]);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [meeting?.transcript]);

  const handleDownload = () => {
    setIsDownloadModalOpen(true);
    setIsDownloading(true);
    setDownloadComplete(false);

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

  const speakersData = meeting?.transcript
    ? calculateTalkTime(meeting.transcript)
    : [];

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
          <div className="flex space-x-6">
            <TabButton
              icon={<FileText className="h-5 w-5" />}
              label="Transcript"
              isActive={activeTab === "transcript"}
              onClick={() => onTabChange("transcript")}
            />
            <TabButton
              icon={<List className="h-5 w-5" />}
              label="Summary"
              isActive={activeTab === "summary"}
              onClick={() => onTabChange("summary")}
            />
            <TabButton
              icon={<CheckSquare className="h-5 w-5" />}
              label="Tasks"
              isActive={activeTab === "tasks"}
              onClick={() => onTabChange("tasks")}
            />
          </div>

          <div>
            <TabButton
              icon={<Download className="h-5 w-5" />}
              label="Download"
              isActive={activeTab === "download"}
              onClick={handleDownload}
            />
          </div>
        </div>
      </div>

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
          {activeTab === "transcript" && (
            <Transcript
              transcript={meeting.transcript}
              audioSrc={meeting.audioUrl}
              setMeetings={setMeetings}
            />
          )}
          {activeTab === "summary" &&
            (isFetching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-lg">Fetching summary...</p>
              </div>
            ) : (
              <Summary summary={summary} speakers={speakersData} />
            ))}
          {activeTab === "tasks" &&
            (isFetching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-lg">Fetching tasks...</p>
              </div>
            ) : (
              <Tasks tasks={tasks} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingContent;
