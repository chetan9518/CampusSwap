import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  children?: React.ReactNode;
  fullScreen?: boolean;
  text?: string;
}

const PageLoading = ({ children, fullScreen = false, text = 'Loading...' }: PageLoadingProps) => {
  const content = children || (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="mb-4"
      >
        <Loader2 className="w-8 h-8 text-blue-600" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-gray-600 text-lg font-medium"
      >
        {text}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex items-center justify-center"
    >
      {content}
    </motion.div>
  );
};

export default PageLoading;
