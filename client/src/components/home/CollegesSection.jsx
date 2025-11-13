/**
 * CollegesSection - cal.com style
 * 
 * Placeholder section showing product adoption
 * NO fake testimonials, just clean college name placeholders
 */

import { motion } from 'framer-motion';

const collegeNames = [
  'University A',
  'College B',
  'Institute C',
  'Academy D',
  'University E',
  'College F'
];

const CollegesSection = () => {
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
            Used across colleges
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Students from various institutions trust CGPA Analyzer for their academic tracking.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {collegeNames.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center"
            >
              <span className="text-gray-400 font-medium text-sm">
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollegesSection;
