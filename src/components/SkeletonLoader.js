import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <motion.div
    className="skeleton-card"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-line"></div>
    <div className="skeleton skeleton-line short"></div>
  </motion.div>
);

const SkeletonBalanceCard = () => (
  <motion.div
    className="skeleton-balance-card"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="skeleton skeleton-label"></div>
    <div className="skeleton skeleton-value"></div>
  </motion.div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <motion.div
    className="skeleton-table"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="skeleton skeleton-header"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton skeleton-row"></div>
    ))}
  </motion.div>
);

const SkeletonInput = () => (
  <div className="skeleton skeleton-input"></div>
);

export { SkeletonCard, SkeletonBalanceCard, SkeletonTable, SkeletonInput };
export default SkeletonCard;
