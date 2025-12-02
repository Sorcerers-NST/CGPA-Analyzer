import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

function SearchFilter({ semesters }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  // Get all unique grades
  const grades = useMemo(() => {
    const allGrades = new Set();
    semesters.forEach(sem => {
      sem.subjects?.forEach(sub => allGrades.add(sub.grade));
    });
    return Array.from(allGrades).sort();
  }, [semesters]);

  // Filter subjects based on search and filters
  const filteredResults = useMemo(() => {
    let results = [];
    
    semesters.forEach(sem => {
      if (sem.subjects) {
        sem.subjects.forEach(subject => {
          // Apply semester filter
          if (selectedSemester !== 'all' && sem.id !== selectedSemester) {
            return;
          }
          
          // Apply grade filter
          if (selectedGrade !== 'all' && subject.grade !== selectedGrade) {
            return;
          }
          
          // Apply search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesName = subject.name.toLowerCase().includes(query);
            const matchesCode = subject.code?.toLowerCase().includes(query);
            const matchesSemester = sem.name.toLowerCase().includes(query);
            
            if (!matchesName && !matchesCode && !matchesSemester) {
              return;
            }
          }
          
          results.push({
            ...subject,
            semesterName: sem.name,
            semesterId: sem.id
          });
        });
      }
    });
    
    return results;
  }, [semesters, searchQuery, selectedGrade, selectedSemester]);

  const hasActiveFilters = selectedGrade !== 'all' || selectedSemester !== 'all';

  const clearFilters = () => {
    setSelectedGrade('all');
    setSelectedSemester('all');
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Search Subjects</h3>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Clear filters
          </motion.button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by subject name or code..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {filteredResults.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Found {filteredResults.length} subject{filteredResults.length !== 1 ? 's' : ''}
            </p>
            
            {filteredResults.map((subject, index) => (
              <motion.div
                key={`${subject.semesterId}-${subject.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-2 border-gray-100 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{subject.name}</h4>
                    <p className="text-sm text-gray-600">{subject.semesterName}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-black text-white text-sm font-semibold rounded-lg mb-1">
                      {subject.grade}
                    </span>
                    <p className="text-sm text-gray-600">{subject.credits} credits</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {searchQuery || hasActiveFilters 
                ? 'No subjects found matching your criteria'
                : 'Start typing to search subjects'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;
