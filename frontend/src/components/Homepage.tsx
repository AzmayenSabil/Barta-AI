import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './navigation/Footer';
import { Mic, FileText, Zap, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate('/meetings');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <main className="flex-grow bg-white min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 items-center gap-12">
          {/* Left Section: Text and Button */}
          <div className="h-full flex flex-col justify-center space-y-8"> {/* Added space-y-8 for spacing */}
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              BartaAI
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Advanced Bangla meeting transcription and analysis platform that transforms your conversations into actionable insights.
            </p>
            <button 
              onClick={handleTryDemo}
              className="w-fit relative overflow-hidden group px-8 py-3 rounded-full bg-indigo-600 text-white font-medium tracking-wider transition-all duration-300 ease-in-out"
            >
              <span className="relative z-10">Try Demo</span>
              <span 
                className="absolute inset-0 bg-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full"
              />
              <span 
                className="absolute inset-0 border-2 border-indigo-600 group-hover:border-white rounded-full transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* Right Section: Image */}
          <div className="hidden md:block h-full">
            <img 
              src="/images/1.png" // Updated path
              alt="BartaAI Illustration"
              className="w-[600px] h-[400px] object-cover rounded-lg shadow-lg" // Increased image size
            />
          </div>
        </div>
      </main>

      {/* Transcription Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transcription</h2>
            <ul className="text-lg text-gray-600 font-light list-disc list-inside">
              <li>Accurate audio-to-text conversion</li>
              <li>Speaker identification and labeling</li>
              <li>Time-coded transcriptions for easy reference</li>
              <li>Sentiment analysis integrated into transcripts</li>
            </ul>
          </div>
          <div className="hidden md:block">
            <img 
              src="/images/2.png" // Updated path
              alt="Transcription Illustration"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Summaries Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
          <div className="hidden md:block">
            <img 
              src="/images/3.png" // Updated path
              alt="Summaries Illustration"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Summaries</h2>
            <ul className="text-lg text-gray-600 font-light list-disc list-inside">
              <li>Concise extraction of key discussion points</li>
              <li>Highlight critical decisions and outcomes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sentiments Section */}
      <section className="bg-yellow-50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sentiments</h2>
            <ul className="text-lg text-gray-600 font-light list-disc list-inside">
              <li>Overall meeting sentiment analysis</li>
              <li>Segment-wise emotional tone breakdown</li>
              <li>Individual speaker sentiment tracking</li>
            </ul>
          </div>
          <div className="hidden md:block">
            <img 
              src="/images/4.png" // Updated path
              alt="Sentiments Illustration"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Action Items Section */}
      <section className="bg-purple-50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
          <div className="hidden md:block">
            <img 
              src="/images/5.png" // Updated path
              alt="Action Items Illustration"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Action Items</h2>
            <ul className="text-lg text-gray-600 font-light list-disc list-inside">
              <li>Track tasks with assigned owners</li>
              <li>Set deadlines and monitor progress</li>
              <li>Prioritize actions for efficient follow-ups</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;