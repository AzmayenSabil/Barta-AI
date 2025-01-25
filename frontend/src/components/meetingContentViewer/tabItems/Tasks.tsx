import React from 'react';
import TaskItem from '../TaskItem';

const Tasks: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Action Items</h3>
      <div className="space-y-3">
        <TaskItem
          name="Optimize transcription model"
          assignee="Speaker 1"
          deadline="2025-03-08"
        />
        <TaskItem
          name="Design feedback system UI"
          assignee="Speaker 1"
          deadline="2025-02-06"
        />
        <TaskItem
          name="Integrate spell-checking feature"
          assignee="Speaker 2"
          deadline="2025-02-12"
        />
        <TaskItem
          name="Prepare architecture documentation"
          assignee="Speaker 2"
          deadline="2025-02-09"
        />
      </div>
    </div>
  );
};

export default Tasks;
