import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "../api";
import { AuthPage } from "../components/AuthPage";
import { loginSchema, type LoginValues } from "../schemas";
import { SESSION_KEY } from "../session";
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();
  
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/discover";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: params.get("email") ?? "", password: "" },
  });

  const login = useMutation({
    mutationFn: (v: LoginValues) => authApi.login(v.email, v.password),
    onSuccess: ({ user, tokens }) => {
      setSession(user, tokens.access_token, tokens.refresh_token);
      queryClient.setQueryData(SESSION_KEY, user);
      toast.success(`Welcome back, ${user.full_name.split(" ")[0]}!`);
      navigate(from, { replace: true });
    },
    
    onError: (error, variables) => {
      const message = getErrorMessage(error);
      // Backend answers 403 "Please verify your email..." for unverified accounts.
      if (getErrorStatus(error) === 403 && /verify your email/i.test(message)) {
        toast.info("Please verify your email to continue.");
        navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`);
        return;
      }
      toast.error(message);
    },
  });

  return (
    <AuthPage title="Welcome back" subtitle="Log in to continue to VIPXFRIEND.">
      <form onSubmit={handleSubmit((v) => login.mutate(v))} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={login.isPending}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthPage>
  );
}