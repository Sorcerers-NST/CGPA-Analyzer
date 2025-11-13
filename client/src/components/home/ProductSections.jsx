/**
 * ProductSections - cal.com style
 * 
 * Alternating left-right layout sections showcasing features
 * Generous spacing, clean typography, subtle animations
 */

import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Clean grade management',
    description: 'Add subjects, assign grades, and calculate SGPA instantly. Our intuitive interface makes grade tracking effortless and accurate.',
    details: [
      'Subject-wise grade entry',
      'Automatic SGPA calculation',
      'Credit-based weighting',
      'Edit anytime, updates instantly'
    ],
    alignment: 'left'
  },
  {
    title: 'Instant CGPA recalculation',
    description: 'Every change reflects immediately. No manual calculations, no errors. Your CGPA updates automatically as you add or modify subjects.',
    details: [
      'Real-time updates',
      'Semester-by-semester view',
      'Historical tracking',
      'Export your records anytime'
    ],
    alignment: 'right'
  },
  {
    title: 'Subject-level insights',
    description: 'Understand which subjects impact your CGPA the most. Make informed decisions about your academic priorities.',
    details: [
      'Grade distribution visualization',
      'Performance trends',
      'Subject comparison',
      'Identify improvement areas'
    ],
    alignment: 'left'
  }
];

const ProductSections = () => {
  return (
    <>
      {sections.map((section, index) => (
        <section
          key={section.title}
          className="bg-white border-b border-gray-100 last:border-b-0"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
              section.alignment === 'right' ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: section.alignment === 'left' ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={section.alignment === 'right' ? 'lg:order-2' : ''}
              >
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-6">
                  {section.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {section.description}
                </p>
                <ul className="space-y-3">
                  {section.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: section.alignment === 'left' ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={section.alignment === 'right' ? 'lg:order-1' : ''}
              >
                <div className="relative">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 aspect-[4/3] flex items-center justify-center">
                    {/* Abstract wireframe illustration */}
                    <div className="w-full h-full p-8">
                      <div className="grid grid-cols-3 gap-4 h-full">
                        <div className="space-y-4">
                          <div className="h-8 bg-gray-200 rounded" />
                          <div className="h-24 bg-gray-200 rounded" />
                          <div className="h-16 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-4">
                          <div className="h-16 bg-gray-300 rounded" />
                          <div className="h-32 bg-gray-200 rounded" />
                          <div className="h-8 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-4">
                          <div className="h-12 bg-gray-200 rounded" />
                          <div className="h-20 bg-gray-200 rounded" />
                          <div className="h-24 bg-gray-300 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default ProductSections;
