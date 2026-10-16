import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { authApi } from "../api";
import { AuthPage } from "../components/AuthPage";
import {
  OTP_COOLDOWN_SECONDS,
  getOtpCooldownRemaining,
  startOtpCooldown,
} from "../otpCooldown";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [remaining, setRemaining] = useState(() => getOtpCooldownRemaining(email));
  const cooling = remaining > 0;

  useEffect(() => {
    if (!cooling) return;
    const timer = setInterval(() => setRemaining(getOtpCooldownRemaining(email)), 1000);
    return () => clearInterval(timer);
  }, [cooling, email]);

  const verify = useMutation({
    mutationFn: (code: string) => authApi.verifyOtp(email, code),
    onSuccess: () => {
      toast.success("Email verified! You can log in now.");
      // Backend returns no tokens here, so the user logs in next.
      navigate(`/login?email=${encodeURIComponent(email)}`, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      setOtp("");
    },
  });

  const resend = useMutation({
    mutationFn: () => authApi.resendOtp(email),
    onSuccess: (res) => {
      if (/already verified/i.test(res.message)) {
        toast.info(res.message);
        navigate(`/login?email=${encodeURIComponent(email)}`, { replace: true });
        return;
      }
      toast.success("A new code has been sent.");
      startOtpCooldown(email);
      setRemaining(OTP_COOLDOWN_SECONDS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      if (getErrorStatus(error) === 429) {
        startOtpCooldown(email);
        setRemaining(OTP_COOLDOWN_SECONDS);
      }
    },
  });

  if (!email) return <Navigate to="/login" replace />;

  const handleChange = (value: string) => {
    setOtp(value);
    if (value.length === 6 && !verify.isPending) verify.mutate(value); // auto-submit
  };

  return (
    <AuthPage
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${email}. It expires in 10 minutes.`}
    >
      <div className="space-y-5">
        <OtpInput value={otp} onChange={handleChange} disabled={verify.isPending} />

        <Button
          fullWidth
          loading={verify.isPending}
          disabled={otp.length !== 6}
          onClick={() => verify.mutate(otp)}
        >
          Verify email
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't get the code?{" "}
          <button
            type="button"
            disabled={cooling || resend.isPending}
            onClick={() => resend.mutate()}
            className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
          >
            {cooling ? `Resend in ${remaining}s` : "Resend code"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium hover:text-foreground">
            Back to login
          </Link>
        </p>
      </div>
    </AuthPage>
  );
}