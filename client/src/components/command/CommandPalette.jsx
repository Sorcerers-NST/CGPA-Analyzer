import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiHome, FiBarChart2, FiSettings, FiPlus, FiBook } from 'react-icons/fi';
import { useDebounce } from '../../hooks/useDebounce';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 150);

  const isOnSemesterPage = location.pathname.startsWith('/semester/');


  const allCommands = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your academic overview',
      icon: <FiHome className="w-5 h-5" />,
      action: () => navigate('/dashboard'),
      keywords: ['dashboard', 'home', 'overview']
    },
    {
      id: 'analytics',
      title: 'Go to Analytics',
      subtitle: 'View detailed performance analytics',
      icon: <FiBarChart2 className="w-5 h-5" />,
      action: () => navigate('/analytics'),
      keywords: ['analytics', 'charts', 'stats', 'performance']
    },
    {
      id: 'settings',
      title: 'Go to Settings',
      subtitle: 'Manage your account and preferences',
      icon: <FiSettings className="w-5 h-5" />,
      action: () => navigate('/settings'),
      keywords: ['settings', 'preferences', 'account', 'profile']
    },
    {
      id: 'add-semester',
      title: 'Add Semester',
      subtitle: 'Create a new semester',
      icon: <FiPlus className="w-5 h-5" />,
      action: () => {
        navigate('/dashboard');
        setTimeout(() => {
          const event = new CustomEvent('open-add-semester');
          window.dispatchEvent(event);
        }, 100);
      },
      keywords: ['add', 'semester', 'new', 'create']
    },
    {
      id: 'add-subject',
      title: 'Add Subject',
      subtitle: 'Add a new subject to current semester',
      icon: <FiBook className="w-5 h-5" />,
      action: () => {
        const event = new CustomEvent('open-add-subject');
        window.dispatchEvent(event);
      },
      keywords: ['add', 'subject', 'course', 'new', 'create'],
      showOnlyOn: 'semester' 
    }
  ];

  const commands = allCommands.filter(cmd => {
    if (cmd.showOnlyOn === 'semester') {
      return isOnSemesterPage;
    }
    return true;
  });

  // Fuzzy search
  const filteredCommands = commands.filter(cmd => {
    if (!debouncedQuery) return true;
    const searchText = debouncedQuery.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchText) ||
      cmd.subtitle.toLowerCase().includes(searchText) ||
      cmd.keywords.some(k => k.includes(searchText))
    );
  });

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  const executeCommand = (command) => {
    command.action();
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Command Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <FiSearch className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pages, actions..."
              className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-400"
            />
            <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${
                        index === selectedIndex
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
                      {command.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {command.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {command.subtitle}
                      </p>
                    </div>
                    {index === selectedIndex && (
                      <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded">
                        ↵
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <p className="text-sm">No results found</p>
              </div>
            )}
          </div>

          {/* Footer Hint */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Navigate with ↑↓ arrows</span>
            <span>Press Enter to select</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
