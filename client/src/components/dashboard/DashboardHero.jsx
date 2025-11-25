import { motion } from 'framer-motion';

const DashboardHero = ({ username }) => {
  return (
    <div className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-2">
            Welcome back, {username}
          </h1>
          <p className="text-gray-600">
            Here's your academic overview for this semester.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHero;
