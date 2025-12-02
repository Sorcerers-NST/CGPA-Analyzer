import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
            Start tracking your academic performance
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join students who are taking control of their academic journey with clear, organized grade tracking.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Create an account
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
