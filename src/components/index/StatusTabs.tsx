
interface StatusTabsProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  activeCount: number;
  upcomingCount: number;
  endedCount: number;
  theme: string;
}

const StatusTabs = ({ 
  selectedStatus, 
  setSelectedStatus, 
  activeCount, 
  upcomingCount, 
  endedCount,
  theme 
}: StatusTabsProps) => {
  const statuses = [
    { name: 'active', label: 'Active', count: activeCount },
    { name: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { name: 'ended', label: 'Ended', count: endedCount }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 mb-8">
      {statuses.map(status => (
        <button 
          key={status.name}
          className={`flex items-center transition-colors ${
            selectedStatus === status.name 
              ? 'text-purple-600 font-medium' 
              : theme === "dark" 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
          }`} 
          onClick={() => setSelectedStatus(status.name)}
        >
          <span>{status.label}</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            selectedStatus === status.name
              ? theme === "dark"
                ? 'bg-purple-900 text-purple-100'
                : 'bg-purple-100 text-purple-800'
              : theme === "dark" 
                ? 'bg-gray-800 text-gray-400' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {status.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusTabs;
