import React from 'react';
import { Menu, User, LogOut, Plus } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onUploadClick: () => void;
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onUploadClick, onProfileClick }) => {
  return (
    <nav className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold">BartaAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Upload</span>
            </button>
            <button 
              onClick={onProfileClick}
              className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <User className="h-6 w-6" />
            </button>
            <button className="p-2 hover:bg-indigo-700 rounded-lg transition-colors">
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;