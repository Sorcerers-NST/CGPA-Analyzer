import { useState } from 'react';
import TemplateBuilder from '../../components/predictor/TemplateBuilder';
import ScoreTracker from '../../components/predictor/ScoreTracker';
import PredictionView from '../../components/predictor/PredictionView';

const Predictor = () => {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', label: 'Create Structure', icon: '📋' },
    { id: 'track', label: 'Track Progress', icon: '📊' },
    { id: 'predict', label: 'View Predictions', icon: '🎯' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CGPA Predictor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create assessment structures, track your progress, and predict your grades
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-navy-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-navy-800 rounded-lg shadow-sm p-6">
          {activeTab === 'create' && <TemplateBuilder />}
          {activeTab === 'track' && <ScoreTracker />}
          {activeTab === 'predict' && <PredictionView />}
        </div>
      </div>
    </div>
  );
};

export default Predictor;
