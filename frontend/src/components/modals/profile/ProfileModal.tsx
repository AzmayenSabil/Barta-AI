import React from 'react';
import { X, Mail, Phone, Calendar } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">John Doe</h3>
              <p className="text-gray-600">Product Manager</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>john.doe@company.com</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone className="h-5 w-5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>Joined January 2024</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;