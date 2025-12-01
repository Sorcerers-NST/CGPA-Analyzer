import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Button from '../ui/Button';
import { SkeletonCard } from '../ui/Skeleton';
import SemesterCardNew from './SemesterCardNew';
import EmptyStateNew from './EmptyStateNew';

const DashboardSemesters = ({ loading, semesters, onAdd, onSemesterClick, onDelete, onEdit }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Your Semesters
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your academic records
          </p>
        </div>
        <Button
          onClick={onAdd}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add Semester
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : semesters.length === 0 ? (
        <EmptyStateNew onAdd={onAdd} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {semesters.map((semester, index) => (
            <SemesterCardNew
              key={semester.id}
              semester={semester}
              index={index}
              onClick={() => onSemesterClick(semester.id)}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardSemesters;
