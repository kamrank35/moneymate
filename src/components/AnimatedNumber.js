import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedNumber = ({ value, duration = 1.5, prefix = '$', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = 0;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(easeOut * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
