import { FiBook, FiPlus } from 'react-icons/fi';
import Card from '../ui/Card';
import Button from '../ui/Button';

const EmptyStateNew = ({ onAdd }) => (
  <Card className="p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FiBook className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No semesters yet
    </h3>
    <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
      Start tracking your academic performance by adding your first semester.
    </p>
    <Button onClick={onAdd} icon={<FiPlus className="w-4 h-4" />}>
      Add Your First Semester
    </Button>
  </Card>
);

export default EmptyStateNew;
