import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import MoodCard from './components/MoodCard';
import ChecklistItem from './components/ChecklistItem';

type HeartParticle = {
  id: string;
  left: number;
  top: number;
  color: string;
  size: number;
  delay: number;
  travelX: number;
  travelY: number;
};

const moodOptions = [
  { emoji: '😍', label: 'In Love' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😌', label: 'Chill' },
  { emoji: '🧸', label: 'Comfy' },
];

const tasks = [
  'Drink lots of water 💧',
  'Eat real food 🍽️',
  'Exercise 🏃‍♀️',
  'Take a bath 🛁',
  'Send me pics 📸',
  'Daily Journal Update 📝',
  'Daily Prayer 🙏',
  'Learn new recipes to cook 🍳',
  'Talk to a friend 💬',
];

const moreItems = [
  'Academic improvement',
];

type TaskProgress = {
  completed: boolean;
  completedAt: string | null;
};

const STORAGE_KEY = 'mood-checklist-progress';

const createInitialTaskProgress = (): TaskProgress[] => tasks.map(() => ({ completed: false, completedAt: null }));

const formatCompletionDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
};

const App = () => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [taskProgress, setTaskProgress] = useState<TaskProgress[]>(() => {
    if (typeof window === 'undefined') {
      return createInitialTaskProgress();
    }

    try {
      const savedProgress = window.localStorage.getItem(STORAGE_KEY);
      if (!savedProgress) {
        return createInitialTaskProgress();
      }

      const parsedProgress = JSON.parse(savedProgress) as TaskProgress[];
      if (Array.isArray(parsedProgress) && parsedProgress.length === tasks.length) {
        return parsedProgress;
      }
    } catch {
      // Fall back to the default empty progress state if parsing fails.
    }

    return createInitialTaskProgress();
  });
  const [heartParticles, setHeartParticles] = useState<HeartParticle[]>([]);
  const [showMore, setShowMore] = useState(false);

  const completedTasks = taskProgress.map((task) => task.completed);
  const completedCount = completedTasks.filter(Boolean).length;
  const progressPercentage = useMemo(
    () => Math.round((completedCount / tasks.length) * 100),
    [completedCount],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(taskProgress));
    }
  }, [taskProgress]);

  const createHeartBurst = (event: MouseEvent<HTMLElement>) => {
    const baseX = event.clientX;
    const baseY = event.clientY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const colors = ['#F9D7E7', '#FFFFFF', '#F8B8D3'];

    const newParticles: HeartParticle[] = [];
    const particleCount = 36;

    for (let index = 0; index < particleCount; index++) {
      const startX = Math.max(12, Math.min(viewportWidth - 12, baseX + (Math.random() - 0.5) * viewportWidth * 0.85));
      const startY = Math.max(12, Math.min(viewportHeight - 12, baseY + (Math.random() - 0.5) * viewportHeight * 0.7));
      const travelX = (Math.random() - 0.5) * 360 + (startX > viewportWidth / 2 ? 90 : -90);
      const travelY = -180 - Math.random() * 260 + (Math.random() - 0.5) * 70;

      newParticles.push({
        id: `${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`,
        left: startX,
        top: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 12 + Math.random() * 24,
        delay: Math.random() * 0.1,
        travelX,
        travelY,
      });
    }

    setHeartParticles((previous) => [...previous, ...newParticles]);

    const ids = newParticles.map((particle) => particle.id);
    window.setTimeout(() => {
      setHeartParticles((previous) => previous.filter((particle) => !ids.includes(particle.id)));
    }, 1500);
  };

  const handleToggleTask = (index: number) => {
    setTaskProgress((previous) =>
      previous.map((task, taskIndex) => {
        if (taskIndex !== index) {
          return task;
        }

        return {
          completed: !task.completed,
          completedAt: task.completed ? null : new Date().toISOString(),
        };
      }),
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 text-[#6c4964]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-rose-200/25 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 top-1/4 h-60 w-60 rounded-full bg-rose-200/20 blur-3xl"
          animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white/30 blur-xl"
            style={{
              width: 24 + index * 10,
              height: 24 + index * 10,
              left: `${10 + index * 11}%`,
              top: `${20 + (index % 4) * 12}%`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -14, 0] }}
            transition={{ duration: 8 + index, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl rounded-[44px] border border-white/70 bg-white/80 p-6 shadow-[0_35px_120px_rgba(248,184,211,0.18)] backdrop-blur-3xl sm:p-10"
      >
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {heartParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="pointer-events-none absolute font-black leading-none"
              style={{
                left: particle.left,
                top: particle.top,
                color: particle.color,
                fontSize: particle.size,
              }}
              initial={{ opacity: 1, y: 0, scale: 0.95, rotate: -15 }}
              animate={{ opacity: [1, 0.8, 0], x: particle.travelX, y: particle.travelY, scale: [0.95, 1.25, 1.4], rotate: [-15, 5, -5] }}
              transition={{ duration: 1.25, delay: particle.delay, ease: 'easeOut' }}
            >
              ❤️
            </motion.span>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-[42px] border border-white/60 bg-gradient-to-br from-white/90 via-[#fff3f8]/90 to-[#ffe7f1]/80 p-6 shadow-glow sm:p-10">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,184,211,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(248,184,211,0.12),_transparent_30%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="mb-8 flex flex-col gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-[32px] border border-rose-100/80 bg-white/80 px-5 py-5 shadow-[0_15px_40px_rgba(248,184,211,0.12)]"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-medium uppercase tracking-[0.24em] text-rose-400">
                  <Heart className="h-4 w-4 text-rose-400" />
                  sweet morning ritual
                </div>
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="text-3xl font-black uppercase tracking-[-0.04em] text-[#7f5870] sm:text-5xl"
                  >
                    GOOD MORNING BEAUTIFUL ☀️
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="text-lg font-semibold text-[#8f5c79] sm:text-xl"
                  >
                    Wake up, Night Owl! 🦉💕
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.65 }}
                    className="max-w-2xl text-base text-[#7e5471] sm:text-lg"
                  >
                    Hope your day is as cute as you are.
                  </motion.p>
                </div>
              </motion.div>

              <section className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.9 }}
                  className="rounded-[32px] border border-white/70 bg-blush/80 p-6 shadow-[0_24px_60px_rgba(248,184,211,0.14)]"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-rose-400">💖 How are you feeling today?</p>
                      <p className="mt-3 text-sm text-[#7f5370]">Tap your mood to unlock your checklist.</p>
                    </div>
                    <Sparkles className="h-6 w-6 text-[#f49fbf]" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    {moodOptions.map((mood) => (
                      <MoodCard
                        key={mood.label}
                        emoji={mood.emoji}
                        label={mood.label}
                        selected={selectedMood === mood.label}
                        onSelect={(event) => {
                          setSelectedMood(mood.label);
                          createHeartBurst(event);
                        }}
                      />
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {selectedMood ? (
                      <motion.div
                        key={selectedMood}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 14 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6 rounded-[28px] border border-rose-200/80 bg-white/80 p-5 text-center text-sm font-semibold text-[#7f5370] shadow-sm"
                      >
                        You are feeling <span className="text-rose-500">{selectedMood}</span> today 💕
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-mood"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 rounded-[28px] border border-white/50 bg-white/60 p-5 text-center text-sm text-[#8f4f75] shadow-sm"
                      >
                        Select a mood to brighten your day.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 1.05 }}
                  className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(248,184,211,0.14)]"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-rose-400">✨ Today's Mission ✨</p>
                      <p className="mt-2 text-xs text-[#7f5370]">Complete each tiny love task for bonus smiles.</p>
                    </div>
                    <MotionSparkleIcon />
                  </div>
                  <div className={`space-y-3 ${!selectedMood ? 'pointer-events-none blur-sm opacity-70' : ''}`}>
                    {tasks.map((task, index) => (
                      <ChecklistItem
                        key={task}
                        label={task}
                        completed={completedTasks[index]}
                        onToggle={() => handleToggleTask(index)}
                        onClick={(event) => {
                          handleToggleTask(index);
                          createHeartBurst(event);
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-5 space-y-2">
                    {taskProgress
                      .map((task, index) => ({ ...task, label: tasks[index] }))
                      .filter((task) => task.completedAt)
                      .sort((firstTask, secondTask) => (secondTask.completedAt ?? '').localeCompare(firstTask.completedAt ?? ''))
                      .map((task) => (
                        <div key={task.label} className="rounded-2xl border border-rose-100/80 bg-white/70 px-3 py-2 text-sm text-[#7f5370] shadow-sm">
                          <span className="font-semibold">{task.label}</span>
                          <span className="ml-2 text-rose-500">• completed {formatCompletionDate(task.completedAt)}</span>
                        </div>
                      ))}
                  </div>
                  <div className="mt-6 rounded-[28px] border border-rose-100/80 bg-rose-50/80 p-4 text-center text-sm text-[#7f5370] shadow-inner">
                    {selectedMood
                      ? 'Checklist unlocked. Let the self-care begin!'
                      : 'Mood tracker first—then your love mission opens.'}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 1.2 }}
                  className="rounded-[32px] border border-white/70 bg-gradient-to-br from-[#fff3f8] via-[#ffe9f2] to-[#fff2f7] p-6 shadow-[0_24px_60px_rgba(248,184,211,0.14)]"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-rose-400">Daily Progress</p>
                      <p className="mt-2 text-sm text-[#7f5370]">{completedCount} / {tasks.length} Complete</p>
                    </div>
                    <div className="rounded-3xl bg-white/80 px-4 py-2 text-sm font-semibold text-rose-500 shadow-sm">
                      {progressPercentage}%
                    </div>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-white/70">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-soft to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    />
                  </div>
                  <AnimatePresence>
                    {completedCount === tasks.length ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6 rounded-[28px] border border-rose-200/90 bg-rose-100/80 p-5 text-center text-sm font-semibold text-[#8e5d78] shadow-[0_0_30px_rgba(248,184,211,0.2)]"
                      >
                        <div className="mb-3 flex items-center justify-center gap-2 text-xl">
                          <span>🎉</span>
                          <span>Amazing Job Baby!</span>
                          <span>🎉</span>
                        </div>
                        <p>💖 I'm proud of you. 💖</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </section>
            </div>

            <footer className="relative mt-4 rounded-[32px] border border-white/70 bg-white/80 p-5 text-center text-sm text-[#7f5370] shadow-glow">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="max-w-3xl mx-auto leading-7">
                  💕 Remember: Drink water, eat well, take care of yourself, and think about me sometimes. 💕
                </p>
              </motion.div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowMore((s) => !s)}
                  aria-expanded={showMore}
                  className="rounded-full bg-rose-50/80 px-4 py-2 text-sm font-semibold text-rose-500 shadow-sm hover:brightness-95"
                >
                  More
                </button>
              </div>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 bottom-full mb-3 w-64 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/95 p-3 text-left text-sm text-[#7e2b5e] shadow-lg"
                  >
                    <div className="space-y-1">
                      {moreItems.map((item) => (
                        <button
                          key={item}
                          onClick={() => setShowMore(false)}
                          className="w-full rounded-md px-3 py-2 text-left hover:bg-rose-50"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </footer>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const MotionSparkleIcon = () => (
  <motion.div animate={{ rotate: [0, 12, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
    <Sparkles className="h-7 w-7 text-rose-400" />
  </motion.div>
);

export default App;
