export const cardTransitionVariants = {
  enter: {
    x: 400,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.28,
    },
  },
  exit: {
    x: -400,
    opacity: 0,
    transition: {
      duration: 0.28,
    },
  },
};

// Generate word-by-word animation variants for text
export function generateWordVariants(text: string) {
  const words = text.split(" ");
  const wordCount = words.length;
  
  // Calculate delay to take ~2 seconds total for natural reading pace
  const totalDuration = 2000; // milliseconds
  const delayPerWord = totalDuration / wordCount;
  
  return words.map((word, index) => ({
    word,
    delay: delayPerWord * index,
  }));
}

// Motion variants for individual words
export const wordVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay / 1000, // Convert ms to seconds
      duration: 0.1,
    },
  }),
};

// Button variants
export const buttonVariants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 20px rgba(244, 164, 38, 0.3)",
  },
  tap: {
    scale: 0.98,
  },
};

// Container variants for staggered animations
export const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};
