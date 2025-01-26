import React from "react";
import TaskItem from "../TaskItem";

interface Task {
  name: string;
  assignee: string;
  deadline: string;
}

interface TasksProps {
  tasks: string[];
}

const Tasks: React.FC<TasksProps> = ({ tasks }) => {
  const parsedTasks: Task[] = tasks
    .map((taskString) => {
      // Find the second occurrence of 'কর্মপরিকল্পনা'
      const secondOccurrenceIndex = taskString.indexOf("কর্মপরিকল্পনা", taskString.indexOf("কর্মপরিকল্পনা") + 1);

      if (secondOccurrenceIndex !== -1) {
        // Extract the substring starting from the second occurrence
        const relevantTasks = taskString.substring(secondOccurrenceIndex);

        // Extract common details (name, assignee, deadline)
        const nameMatch = relevantTasks.match(/কর্মপরিকল্পনা:\s*([\s\S]*?)(?:\n|$)/);
        const assigneeMatch = relevantTasks.match(/দায়িত্বপ্রাপ্ত:\s*([\s\S]*?)(?:\n|$)/);
        const deadlineMatch = relevantTasks.match(/সময়সীমা:\s*([\s\S]*?)(?:\n|$)/);

        const name = nameMatch ? nameMatch[1].trim() : "Unknown Task";
        const assignee = assigneeMatch ? assigneeMatch[1].trim() : "Unassigned";
        const deadline = deadlineMatch ? deadlineMatch[1].trim() : "No deadline";

        // Extract individual items after the deadline
        const items = relevantTasks
          .split("\n*") // Split based on '*'
          .slice(1) // Skip the first part before the first '*'
          .map((item) => item.trim()) // Trim each item
          .filter((item) => item !== ""); // Remove empty items

        // Map each item to a task
        return items.map((item) => ({
          name: item,
          assignee,
          deadline,
        }));
      }

      return [];
    })
    .flat(); // Flatten the array of tasks

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Action Items</h3>
      <div className="space-y-3">
        {parsedTasks.length > 0 ? (
          parsedTasks.map((task, index) => (
            <TaskItem
              key={index}
              name={task.name}
              assignee={task.assignee}
              deadline={task.deadline}
            />
          ))
        ) : (
          <p>No action items available</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
