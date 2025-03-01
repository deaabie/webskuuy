
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
          className={`flex items-center ${
            selectedStatus === status.name 
              ? 'text-purple-500' 
              : theme === "dark" 
                ? 'text-gray-500' 
                : 'text-gray-600'
          }`} 
          onClick={() => setSelectedStatus(status.name)}
        >
          <span>{status.label}</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${theme === "dark" ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {status.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusTabs;
