import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const SemesterCardNew = ({ semester, index, onClick }) => {
  const sgpa = semester.sgpa || 0;
  const subjectCount = semester.subjects?.length || 0;
  const totalCredits = semester.subjects?.reduce((sum, sub) => sum + sub.credits, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card onClick={onClick} className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{semester.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {subjectCount} {subjectCount === 1 ? 'subject' : 'subjects'}
            </p>
          </div>
          <Badge variant="primary">{sgpa.toFixed(2)}</Badge>
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
