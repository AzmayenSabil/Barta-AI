import React from 'react';
import { Mic, FileAudio } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="h-8 w-8" />
            <span className="text-2xl font-bold">BartaAI</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-indigo-200">Home</a></li>
              <li><a href="#" className="hover:text-indigo-200">About</a></li>
              <li><a href="#" className="hover:text-indigo-200">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}