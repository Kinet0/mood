import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';

interface MoodCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
}

const MoodCard = ({ emoji, label, selected, onSelect }: MoodCardProps) => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!isShaking) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setIsShaking(false), 320);
    return () => window.clearTimeout(timeout);
  }, [isShaking]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsShaking(true);
    onSelect(event);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      animate={isShaking ? { x: [0, -8, 7, -5, 4, 0], rotate: [0, -3, 3, -2, 2, 0] } : { x: 0, rotate: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      whileHover={{ scale: 1.03, rotate: [0, 1, -1, 0] }}
      whileTap={{ scale: 0.98, rotate: [0, -3, 3, 0], x: [0, -6, 6, -4, 4, 0] }}
      className={`relative overflow-hidden rounded-[30px] border border-white/50 bg-white/60 p-6 text-left shadow-glow backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-200/70 ${
        selected
          ? 'border-rose-200 bg-gradient-to-br from-[#fff3f8] via-[#ffe9f2] to-[#fff2f7] shadow-[0_0_40px_rgba(248,184,211,0.25)]'
          : 'hover:border-rose-100/90 hover:bg-white/80'
      }`}
      aria-pressed={selected}
      aria-label={`Select mood ${label}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-4xl">{emoji}</span>
        {selected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="rounded-full bg-rose-100/90 p-2 text-rose-500"
          >
            <CheckCircle2 size={24} />
          </motion.div>
        ) : null}
      </div>
      <p className="mt-6 text-xl font-semibold text-[#7f5870]">{label}</p>
      <motion.div
        animate={selected ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(248,184,211,0.2),_transparent_40%)]"
      />
    </motion.button>
  );
};

export default MoodCard;
