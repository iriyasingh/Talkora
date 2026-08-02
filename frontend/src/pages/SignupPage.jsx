import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../components/common/AuthLayout";

const SignupPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const ok = await signup(data);
    if (ok) navigate("/onboarding");
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Talkora and start chatting in seconds."
      illustrationTitle="Made for real conversations."
      illustrationText="Build your circle, send friend requests, and jump into chat instantly."
      footer={
        <p className="text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-medium">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="form-control">
          <label className="label" htmlFor="fullName">
            <span className="label-text font-medium">Full name</span>
          </label>
          <label className="input input-bordered flex w-full items-center gap-2">
            <User className="size-4 text-base-content/40" />
            <input
              id="fullName"
              type="text"
              placeholder="Jane Doe"
              className="grow"
              {...register("fullName", { required: "Full name is required" })}
            />
          </label>
          {errors.fullName && <span className="mt-1 text-xs text-error">{errors.fullName.message}</span>}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text font-medium">Email</span>
          </label>
          <label className="input input-bordered flex w-full items-center gap-2">
            <Mail className="size-4 text-base-content/40" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="grow"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
          </label>
          {errors.email && <span className="mt-1 text-xs text-error">{errors.email.message}</span>}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text font-medium">Password</span>
          </label>
          <label className="input input-bordered flex w-full items-center gap-2">
            <Lock className="size-4 text-base-content/40" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="grow"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-base-content/40">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </label>
          {errors.password && <span className="mt-1 text-xs text-error">{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={isSigningUp} className="btn btn-primary mt-2 w-full">
          {isSigningUp ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
        </button>

        <p className="text-center text-xs text-base-content/50">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
