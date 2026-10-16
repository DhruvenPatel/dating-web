import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/errors";
import { authApi } from "../api";
import { AuthPage } from "../components/AuthPage";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas";

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgot = useMutation({
    mutationFn: (v: ForgotPasswordValues) => authApi.forgotPassword(v.email),
    onSuccess: (_res, v) => setSentTo(v.email),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (sentTo) {
    return (
      <AuthPage title="Check your email">
        <div className="space-y-4 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <MailCheck size={28} />
          </div>
          {/* Backend never reveals whether an email exists, so we say "if". */}
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{sentTo}</span>,
            a password reset link is on its way. It expires in 15 minutes.
          </p>
          <Link to="/login" className="inline-block text-sm font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit((v) => forgot.mutate(v))} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" fullWidth loading={forgot.isPending}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-muted-foreground hover:text-foreground">
          Back to login
        </Link>
      </p>
    </AuthPage>
  );
}