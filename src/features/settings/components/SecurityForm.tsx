import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/errors";
import type { MyProfileData } from "@/types/profile";
import { settingsApi } from "../api";
import { changePasswordSchema, type ChangePasswordValues } from "../schemas";

export function SecurityForm({ user }: { user: MyProfileData["user"] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const change = useMutation({
    mutationFn: (v: ChangePasswordValues) =>
      settingsApi.changePassword(v.current_password, v.new_password),
    onSuccess: () => {
      toast.success("Password changed successfully.");
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-5 sm:p-8">
        <h3 className="text-lg font-semibold">Account</h3>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
              {user.email}
              {user.is_verified && <BadgeCheck size={16} className="text-primary" />}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Username</dt>
            <dd className="mt-0.5 font-medium">@{user.username}</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleSubmit((v) => change.mutate(v))}
        noValidate
        className="space-y-4 rounded-lg border bg-card p-5 sm:p-8"
      >
        <div>
          <h3 className="text-lg font-semibold">Change password</h3>
          <p className="text-sm text-muted-foreground">Use at least 8 characters.</p>
        </div>

        <div className="max-w-md space-y-4">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            error={errors.current_password?.message}
            {...register("current_password")}
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.new_password?.message}
            {...register("new_password")}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />
        </div>

        <Button type="submit" loading={change.isPending}>
          Update password
        </Button>
      </form>
    </div>
  );
}