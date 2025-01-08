import React from 'react';
import { FileText, List, CheckSquare } from 'lucide-react';

interface ActionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ActionTabs = ({ activeTab, onTabChange }: ActionTabsProps) => (
  <div className="mb-6 border-b">
    <div className="flex space-x-6">
      {[
        { id: 'transcript', icon: FileText, label: 'Transcript' },
        { id: 'summary', icon: List, label: 'Summary' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks' }
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`flex items-center space-x-2 pb-4 ${
            activeTab === id
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange(id)}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </div>
);