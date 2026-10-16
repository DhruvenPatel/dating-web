import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/errors";
import { authApi } from "../api";
import { AuthPage } from "../components/AuthPage";
import { startOtpCooldown } from "../otpCooldown";
import { registerSchema, type RegisterValues } from "../schemas";

// Latest selectable birth date = exactly 18 years ago.
const maxDob = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
})();

export function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      date_of_birth: "",
    },
  });

  const signUp = useMutation({
    mutationFn: (v: RegisterValues) =>
      authApi.register({
        full_name: v.full_name,
        username: v.username,
        email: v.email,
        password: v.password,
        // Backend expects a valid date or nothing, never an empty string.
        ...(v.date_of_birth ? { date_of_birth: v.date_of_birth } : {}),
      }),
    onSuccess: (_res, v) => {
      toast.success("Account created! Enter the code we emailed you.");
      startOtpCooldown(v.email); // backend just sent an OTP
      navigate(`/verify-email?email=${encodeURIComponent(v.email)}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <AuthPage title="Create your account" subtitle="Join VIPXFRIEND in under a minute.">
      <form onSubmit={handleSubmit((v) => signUp.mutate(v))} className="space-y-4" noValidate>
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Aarav Shah"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <Input
          label="Username"
          autoComplete="username"
          placeholder="aarav.shah"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Date of birth (optional)"
          type="date"
          max={maxDob}
          error={errors.date_of_birth?.message}
          {...register("date_of_birth")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button type="submit" fullWidth loading={signUp.isPending}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthPage>
  );
}