
import { motion } from "framer-motion";

interface HeroSectionProps {
  children: React.ReactNode;
}

const HeroSection = ({ children }: HeroSectionProps) => {
  return (
    <section className="py-12 text-center">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Skuuy is Your Gateway to Web3 Node Operation
      </motion.h2>
      <motion.p
        className="text-lg text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Comprehensive guides and tools for setting up and managing blockchain nodes
      </motion.p>
      {children}
    </section>
  );
};

export default HeroSection;
