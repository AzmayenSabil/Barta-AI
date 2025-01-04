import React, { useState } from 'react';
import { Menu, LogOut, ChevronRight, Clock, User, Upload, FileAudio, CheckCircle, AlertCircle, List, FileText, CheckSquare, X, Plus } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileUpload = async (file) => {
    if (!file || (!file.type.includes('audio') && !file.type.includes('video'))) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    // Simulating upload delay
    setTimeout(() => {
      setUploadStatus('success');
      onUpload?.(file);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload an audio or video file to generate a transcript</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Depending on the size of the audio file, it will be processed & transcribed in 10 - 15 mins
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {uploadStatus === 'idle' && <Upload className="h-12 w-12 text-gray-400" />}
              {uploadStatus === 'uploading' && <Upload className="h-12 w-12 text-indigo-500 animate-pulse" />}
              {uploadStatus === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
              {uploadStatus === 'error' && <AlertCircle className="h-12 w-12 text-red-500" />}
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-600">Drag and drop MP3, M4A, WAV or MP4 file here, or select files to upload</p>
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />
                <span className="cursor-pointer text-indigo-600 hover:text-indigo-800">Browse files</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  // Sample meeting data
  const meetings = [
    { id: 1, title: "Team Planning Meeting", date: "April 2, 2025", duration: "45 minutes" },
    { id: 2, title: "Project Review", date: "April 1, 2025", duration: "60 minutes" },
    { id: 3, title: "Sprint Planning", date: "March 31, 2025", duration: "30 minutes" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-indigo-700 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="text-xl font-bold">BartaAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                <Plus className="h-5 w-5" />
                <span>Upload</span>
              </button>
              <button className="p-2 hover:bg-indigo-700 rounded-lg">
                <User className="h-6 w-6" />
              </button>
              <button className="p-2 hover:bg-indigo-700 rounded-lg">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`bg-white w-80 border-r transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Meeting History</h2>
            <div className="space-y-2">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMeeting === meeting.id
                      ? 'bg-indigo-50 border-l-4 border-indigo-600'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMeeting(meeting.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-gray-600">{meeting.date}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{meeting.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedMeeting ? (
            <div className="max-w-4xl mx-auto">
              {/* Action Tabs */}
              <div className="mb-6 border-b">
                <div className="flex space-x-6">
                  <button
                    className={`flex items-center space-x-2 pb-4 ${
                      activeTab === 'transcript'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('transcript')}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Transcript</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 pb-4 ${
                      activeTab === 'summary'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('summary')}
                  >
                    <List className="h-5 w-5" />
                    <span>Summary</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 pb-4 ${
                      activeTab === 'tasks'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('tasks')}
                  >
                    <CheckSquare className="h-5 w-5" />
                    <span>Tasks</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-4">
                  {meetings.find(m => m.id === selectedMeeting)?.title}
                </h1>
                <div className="prose max-w-none">
                  {activeTab === 'transcript' && (
                    <p className="text-gray-600">
                      আমরা আজ টিম প্ল্যানিং নিয়ে আলোচনা করব...
                    </p>
                  )}
                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Key Points</h3>
                      <ul className="list-disc pl-6">
                        <li>Discussion about Q2 objectives</li>
                        <li>Team capacity planning</li>
                        <li>Upcoming project deadlines</li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'tasks' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Action Items</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Update project timeline</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Schedule follow-up meeting</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Select a meeting from the sidebar to view details</p>
            </div>
          )}
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
};

export default AppLayout;