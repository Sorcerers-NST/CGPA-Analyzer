import { motion } from 'framer-motion';
import { FiTrendingUp, FiBook, FiBarChart2 } from 'react-icons/fi';
import Card from '../ui/Card';

const features = [
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    title: 'Track CGPA',
    description: 'Automatic calculation of your cumulative grade point average across all semesters with real-time updates.'
  },
  {
    icon: <FiBook className="w-6 h-6" />,
    title: 'Manage Semesters',
    description: 'Organize subjects by semester, add grades, and monitor your academic progress semester by semester.'
  },
  {
    icon: <FiBarChart2 className="w-6 h-6" />,
    title: 'Understand Grades',
    description: 'Visualize your performance with clear analytics, identify trends, and make informed academic decisions.'
  }
];

const FeatureBlocks = () => {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete solution for managing your academic records and understanding your performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover={false} className="p-8 h-full">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBlocks;
