import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

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

export default UploadModal;