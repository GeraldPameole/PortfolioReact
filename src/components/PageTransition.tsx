import { motion } from "framer-motion";

// Spécifiez le type des props, y compris children
interface PageTransitionProps {
  children: React.ReactNode; // Utilisez React.ReactNode pour le type des enfants
}

export const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
