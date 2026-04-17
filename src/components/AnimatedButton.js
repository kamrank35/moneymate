import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  icon = null
}) => {
  const baseClasses = {
    primary: 'primary-contained-btn',
    secondary: 'primary-outlined-btn',
    danger: 'danger-btn',
    ghost: 'ghost-btn'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses[variant]} ${className} ${loading ? 'btn-loading' : ''}`}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}    >
      {loading ? (
        <span className="btn-spinner">
          <i className="ri-loader-4-line spin"></i>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="btn-content">
          {icon && <i className={icon}></i>}
          {children}
        </span>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
