/**
 * HomeHero - cal.com style
 * 
 * Minimalist hero with large headline, subtext, and CTA buttons
 * Generous white space, fade-in animation
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-tight">
              Your Academic Journey.
              <br />
              <span className="text-gray-600">Organized.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl"
          >
            Track your CGPA, manage semesters, and understand your academic performance 
            with a clean, distraction-free interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-sm text-gray-500"
          >
            No credit card required. Start tracking in seconds.
          </motion.div>
        </div>
      </div>

      {/* Abstract minimal graphic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-96 hidden lg:block"
      >
        <div className="relative w-full h-full">
          <div className="absolute top-0 right-20 w-32 h-32 border border-gray-200 rounded-xl transform rotate-12" />
          <div className="absolute top-20 right-40 w-40 h-40 border border-gray-300 rounded-xl transform -rotate-6" />
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-gray-100 rounded-xl transform rotate-3" />
        </div>
      </motion.div>
    </section>
  );
};

export default HomeHero;
