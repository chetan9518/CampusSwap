import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Search, Package, User, Inbox, ShoppingBag, Settings } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  icon?: 'spinner' | 'refresh' | 'search' | 'package' | 'user' | 'inbox' | 'shopping' | 'settings';
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  text, 
  icon = 'spinner',
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconComponents = {
    spinner: Loader2,
    refresh: RefreshCw,
    search: Search,
    package: Package,
    user: User,
    inbox: Inbox,
    shopping: ShoppingBag,
    settings: Settings
  };

  const IconComponent = iconComponents[icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <IconComponent className={`${sizeClasses[size]} text-blue-600`} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`mt-3 text-gray-600 font-medium ${textSizes[size]}`}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
