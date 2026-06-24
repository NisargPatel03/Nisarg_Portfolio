import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
  crtFlicker?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
  crtFlicker = false,
}) => {
  const MotionComponent = (motion as any)[as] || motion.div;

  const initialProps = crtFlicker
    ? { opacity: 0, scaleY: 0.005, scaleX: 0, filter: 'brightness(3)' }
    : { opacity: 0, x, y };

  const animateProps = crtFlicker
    ? {
        opacity: [0, 0.8, 0.3, 0.9, 0.5, 1],
        scaleY: [0.005, 0.005, 1, 1, 1, 1],
        scaleX: [0, 1, 1, 1, 1, 1],
        filter: ['brightness(3)', 'brightness(3)', 'brightness(1.5)', 'brightness(1.2)', 'brightness(1)', 'brightness(1)'],
      }
    : { opacity: 1, x: 0, y: 0 };

  const transitionProps = crtFlicker
    ? {
        delay,
        duration: 0.75,
        times: [0, 0.3, 0.5, 0.7, 0.85, 1],
        ease: 'easeInOut',
      }
    : {
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      };

  return (
    <MotionComponent
      className={className}
      initial={initialProps}
      whileInView={animateProps}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={transitionProps}
    >
      {children}
    </MotionComponent>
  );
};
