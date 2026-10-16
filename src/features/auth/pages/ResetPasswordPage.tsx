import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/errors";
import { authApi } from "../api";
import { AuthPage } from "../components/AuthPage";
import { resetPasswordSchema, type ResetPasswordValues } from "../schemas";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const reset = useMutation({
    mutationFn: (v: ResetPasswordValues) => authApi.resetPassword(token, v.new_password),
    onSuccess: () => {
      toast.success("Password updated. Please log in.");
      navigate("/login", { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (!token) {
    return (
      <AuthPage title="Invalid reset link">
        <p className="text-sm text-muted-foreground">
          This password reset link is missing or broken. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Request a new link
        </Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit((v) => reset.mutate(v))} className="space-y-4" noValidate>
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.new_password?.message}
          {...register("new_password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />
        <Button type="submit" fullWidth loading={reset.isPending}>
          Update password
        </Button>
      </form>
    </AuthPage>
  );
}