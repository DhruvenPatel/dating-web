import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { useMyProfile } from "@/features/profile/hooks";
import { getErrorMessage } from "@/lib/errors";
import { PrivacyForm } from "../components/PrivacyForm";
import { SecurityForm } from "../components/SecurityForm";

type SettingsTab = "privacy" | "security";

const TABS: { value: SettingsTab; label: string }[] = [
  { value: "privacy", label: "Privacy" },
  { value: "security", label: "Security" },
];

export function SettingsPage() {
  const [params, setParams] = useSearchParams();
  const tab: SettingsTab = params.get("tab") === "security" ? "security" : "privacy";
  const { data, isLoading, isError, error, refetch } = useMyProfile();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your privacy and account security.</p>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={(t) => setParams({ tab: t }, { replace: true })} />

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : isError || !data ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : (
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "privacy" ? (
            <PrivacyForm key={data.privacy.updated_at} privacy={data.privacy} />
          ) : (
            <SecurityForm user={data.user} />
          )}
        </motion.div>
      )}
    </div>
  );
}