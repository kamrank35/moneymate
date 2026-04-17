import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(value);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000
  });

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;

    spring.set(endValue);

    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });

    prevValueRef.current = value;

    return () => unsubscribe();
  }, [value, spring]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <motion.span
      className="animated-counter"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{formatNumber(displayValue)}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
