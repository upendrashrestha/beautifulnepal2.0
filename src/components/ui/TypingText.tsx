import { motion } from "framer-motion";


export default function TypingText({text}:{text:string}) {
  return (
    <motion.p
      className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03, // typing speed
          },
        },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}
