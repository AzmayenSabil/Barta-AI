import React, { useState } from 'react';
import { Flag } from 'lucide-react';

interface TaskItemProps {
    name: string;
    assignee: string;
    deadline: string;
  }
  
  const TaskItem: React.FC<TaskItemProps> = ({ name, assignee, deadline }) => {
    const [priority, setPriority] = useState('medium');
    const [selectedAssignee, setSelectedAssignee] = useState(assignee);
    const [dueDate, setDueDate] = useState(deadline);
    const [isEditingDate, setIsEditingDate] = useState(false);
  
    const getPriorityColor = () => {
      switch (priority) {
        case 'high':
          return 'bg-red-100 text-red-800';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800';
        case 'low':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <p className="font-medium">{name}</p>
            <div className="flex items-center space-x-1">
              <Flag className="h-4 w-4" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()} border-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Assigned to:</span>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Speaker 1">Speaker 1</option>
                <option value="Speaker 2">Speaker 2</option>
              </select>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {isEditingDate ? (
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={() => setIsEditingDate(false)}
              className="border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditingDate(true)}
              className="cursor-pointer hover:text-indigo-600"
            >
              Due {new Date(dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default TaskItem;
  