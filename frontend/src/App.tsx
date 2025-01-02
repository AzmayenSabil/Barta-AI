import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import TranscriptViewer from './components/TranscriptViewer';

function App() {
  const [transcript, setTranscript] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Meetings into Text
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your meeting recordings and get accurate transcripts powered by AI.
            Save time and never miss important details again.
          </p>
        </section>

        <div className="max-w-4xl mx-auto space-y-8">
          <FileUpload onFileUpload={setTranscript} />
          <TranscriptViewer transcript={transcript} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;