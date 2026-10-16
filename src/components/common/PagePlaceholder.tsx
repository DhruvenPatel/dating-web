import { motion } from "framer-motion";

export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border bg-card p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </motion.div>
  );
}