import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthPage({ title, subtitle, children }: AuthPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}