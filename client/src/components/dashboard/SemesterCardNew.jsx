import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const SemesterCardNew = ({ semester, index, onClick, onDelete }) => {
  const sgpa = semester.sgpa || 0;
  const subjectCount = semester.subjects?.length || 0;
  const totalCredits = semester.subjects?.reduce((sum, sub) => sum + sub.credits, 0) || 0;

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click when deleting
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${semester.name}?\n\nThis will permanently delete the semester and all its subjects. This action cannot be undone.`
    );
    
    if (confirmed && onDelete) {
      onDelete(semester.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card onClick={onClick} className="p-6 space-y-4 relative group">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{semester.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {subjectCount} {subjectCount === 1 ? 'subject' : 'subjects'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">{sgpa.toFixed(2)}</Badge>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700"
                title="Delete semester"
                aria-label={`Delete ${semester.name}`}
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Credits</span>
            <span className="font-medium text-gray-900">{totalCredits}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SemesterCardNew;
