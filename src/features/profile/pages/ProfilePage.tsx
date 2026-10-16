import { motion } from "framer-motion";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { getErrorMessage } from "@/lib/errors";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileHeader } from "../components/ProfileHeader";
import { useMyProfile } from "../hooks";

export function ProfilePage() {
  const { data, isLoading, isError, error, refetch } = useMyProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ProfileHeader data={data} />
      <ProfileForm profile={data.profile} />
    </motion.div>
  );
}