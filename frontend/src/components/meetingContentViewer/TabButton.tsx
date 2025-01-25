const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ icon, label, isActive, onClick }) => (
    <button
      className={`flex items-center space-x-2 pb-4 ${
        isActive
          ? 'border-b-2 border-indigo-600 text-indigo-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
  
  export default TabButton;