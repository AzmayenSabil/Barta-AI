import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, X, FileAudio, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (transcript: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file: File) => {
    if (!file || (!file.type.includes("audio") && !file.type.includes("video"))) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    onClose(); // Close the modal immediately after starting the upload

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/transcribe/google", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        const formattedTranscript = data.transcript.map(
          (entry: { start: string; end: string; text: string }) => ({
            start_time: entry.start || "00:00",
            end_time: entry.end || "00:00",
            dialogue: entry.text || "",
            name: null,
            sentiment: null,
          })
        );
        setUploadStatus("success");
        onUpload(formattedTranscript);
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setUploadStatus("error");
    }
  };

  return (
    <>
      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all">
            <div className="flex justify-end">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              onClick={handleClick}
              className={`mt-4 border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
                ${isDragging
                  ? 'border-indigo-500 bg-indigo-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="audio/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />

                <div className="flex justify-center">
                  <div className="p-4 bg-indigo-50 rounded-full">
                    <FileAudio className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                    Drop audio file or click anywhere to upload
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Right Loading Animation */}
      {uploadStatus === 'uploading' && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 border">
          <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
          <p className="text-sm text-indigo-600">Transcribing your audio...</p>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-50 shadow-lg rounded-lg p-4 flex items-center space-x-3 border">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <p className="text-sm text-green-600">Transcription successful!</p>
        </div>
      )}

      {/* Error Message */}
      {uploadStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-50 shadow-lg rounded-lg p-4 flex items-center space-x-3 border">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <p className="text-sm text-red-600">Failed to transcribe the file. Try again.</p>
        </div>
      )}
    </>
  );
};

export default UploadModal;
