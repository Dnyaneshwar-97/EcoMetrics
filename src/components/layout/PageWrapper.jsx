import { motion } from 'framer-motion';

const PageWrapper = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className={`flex-1 page-bg ${className}`}
  >
    {children}
  </motion.section>
);

export default PageWrapper;
