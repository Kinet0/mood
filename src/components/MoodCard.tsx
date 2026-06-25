import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { MouseEvent } from 'react';

interface MoodCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
}

const MoodCard = ({ emoji, label, selected, onSelect }: MoodCardProps) => {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.03, rotate: [0, 1, -1, 0] }}
      whileTap={{ scale: 0.98, rotate: [0, -3, 3, 0] }}
      className={`relative overflow-hidden rounded-[30px] border border-white/50 bg-white/60 p-6 text-left shadow-glow backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-200/70 ${
        selected
          ? 'border-pink-300 bg-gradient-to-br from-[#fff0f4] via-[#ffe7ee] to-[#fff2f6] shadow-[0_0_40px_rgba(255,105,180,0.25)]'
          : 'hover:border-pink-200/90 hover:bg-white/80'
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
            className="rounded-full bg-pink-100/90 p-2 text-pink-600"
          >
            <CheckCircle2 size={24} />
          </motion.div>
        ) : null}
      </div>
      <p className="mt-6 text-xl font-semibold text-[#7c0a5d]">{label}</p>
      <motion.div
        animate={selected ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,105,180,0.2),_transparent_40%)]"
      />
    </motion.button>
  );
};

export default MoodCard;
