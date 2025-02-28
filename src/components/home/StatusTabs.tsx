
interface StatusTabsProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  activeCount: number;
  upcomingCount: number;
  endedCount: number;
}

const StatusTabs = ({
  selectedStatus,
  setSelectedStatus,
  activeCount,
  upcomingCount,
  endedCount,
}: StatusTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-8 mb-8">
      <button
        className={`flex items-center ${
          selectedStatus === "active" ? "text-purple-500" : "text-gray-500"
        }`}
        onClick={() => setSelectedStatus("active")}
      >
        <span>Active</span>
        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800">
          {activeCount}
        </span>
      </button>
      <button
        className={`flex items-center ${
          selectedStatus === "upcoming" ? "text-purple-500" : "text-gray-500"
        }`}
        onClick={() => setSelectedStatus("upcoming")}
      >
        <span>Upcoming</span>
        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800">
          {upcomingCount}
        </span>
      </button>
      <button
        className={`flex items-center ${
          selectedStatus === "ended" ? "text-purple-500" : "text-gray-500"
        }`}
        onClick={() => setSelectedStatus("ended")}
      >
        <span>Ended</span>
        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800">
          {endedCount}
        </span>
      </button>
    </div>
  );
};

export default StatusTabs;
