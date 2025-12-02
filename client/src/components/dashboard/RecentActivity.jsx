import { motion } from 'framer-motion';

const RecentActivity = ({ semesters }) => {
  // Generate activity feed from semester data
  const generateActivities = () => {
    const activities = [];

    semesters.forEach(semester => {
      // Semester creation
      if (semester.createdAt) {
        activities.push({
          id: `sem-${semester.id}`,
          type: 'semester',
          title: `Semester ${semester.semesterNumber} created`,
          timestamp: new Date(semester.createdAt),
          icon: 'calendar',
        });
      }

      // Recent subjects
      if (semester.subjects && semester.subjects.length > 0) {
        semester.subjects.slice(-3).forEach(subject => {
          if (subject.createdAt) {
            activities.push({
              id: `sub-${subject.id}`,
              type: 'subject',
              title: `Added "${subject.name}"`,
              subtitle: `${subject.credits} credits • Grade: ${subject.grade || 'N/A'}`,
              timestamp: new Date(subject.createdAt),
              icon: 'book',
            });
          }
        });
      }
    });

    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  };

  const activities = generateActivities();

  const getIcon = (type) => {
    switch (type) {
      case 'semester':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'subject':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-32 text-gray-400">
          <p className="text-sm">No recent activity</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
                {activity.title}
              </p>
              {activity.subtitle && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {activity.subtitle}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {getRelativeTime(activity.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
