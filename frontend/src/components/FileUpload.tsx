import React, { useState } from 'react';
import { Upload, FileAudio, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload({ onFileUpload }: { onFileUpload: (transcript: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = async (file: File) => {
    if (!file.type.includes('audio') && !file.type.includes('video')) {
      setStatus('error');
      return;
    }

    setFile(file);
    setStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/transcribe/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus('success');
        onFileUpload(data.transcript);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setStatus('error');
      console.error('Transcription error:', error);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          {status === 'idle' && <FileAudio className="h-12 w-12 text-gray-400" />}
          {status === 'uploading' && <Upload className="h-12 w-12 text-indigo-500 animate-pulse" />}
          {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
          {status === 'error' && <AlertCircle className="h-12 w-12 text-red-500" />}
        </div>
        
        <div className="text-lg">
          {status === 'idle' && "Drag and drop your audio/video file here"}
          {status === 'uploading' && "Transcribing your file..."}
          {status === 'success' && "Transcription complete!"}
          {status === 'error' && "Please upload an audio or video file"}
        </div>
        
        {status === 'idle' && (
          <>
            <div className="text-sm text-gray-500">or</div>
            <div>
              <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*,video/*"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          </>
        )}
        
        {file && (
          <div className="text-sm text-gray-600">
            Selected file: {file.name}
          </div>
        )}
      </div>
    </div>
  );
}