import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, X, FileAudio } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (transcript: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleFileUpload = async (file: File) => {
    if (!file || (!file.type.includes('audio') && !file.type.includes('video'))) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      //http://localhost:8000/api/transcribe/whisper
      //http://localhost:8000/api/transcribe/wav2vec
      //http://localhost:8000/api/transcribe/google
      const response = await fetch('http://localhost:8000/api/transcribe/google', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUploadStatus('success');
        setTranscript(data.transcript);
        onUpload(data.transcript); // Pass transcript to parent component
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`mt-4 border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 scale-105'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {uploadStatus === 'idle' && (
                <div className="p-4 bg-indigo-50 rounded-full">
                  <FileAudio className="h-8 w-8 text-indigo-600" />
                </div>
              )}
              {uploadStatus === 'uploading' && (
                <div className="p-4 bg-indigo-50 rounded-full animate-pulse">
                  <Upload className="h-8 w-8 text-indigo-600" />
                </div>
              )}
              {uploadStatus === 'success' && (
                <div className="p-4 bg-green-50 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="p-4 bg-red-50 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              )}
            </div>

            <div>
              <label className="cursor-pointer group">
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />
                <span className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                  Drop audio file or click to upload
                </span>
              </label>
            </div>
          </div>
        </div>

        {transcript && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700">Generated Transcript:</h3>
            <div className="p-4 mt-2 bg-gray-100 border rounded-md text-sm text-gray-800">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
