import { motion } from 'framer-motion';

const SPARKLE_POSITIONS = [
  { top: '-4px', left: '50%', delay: 0 },
  { top: '20%', right: '-6px', delay: 0.3 },
  { bottom: '10%', right: '0', delay: 0.6 },
  { bottom: '-2px', left: '30%', delay: 0.9 },
  { top: '30%', left: '-8px', delay: 1.2 },
];

const SparkleRing = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {SPARKLE_POSITIONS.map((pos, index) => (
      <motion.span
        key={index}
        className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_2px_rgba(252,211,77,0.8)]"
        style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
        animate={{
          opacity: [0.2, 1, 0.2],
          scale: [0.6, 1.2, 0.6],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          delay: pos.delay,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export default SparkleRing;
