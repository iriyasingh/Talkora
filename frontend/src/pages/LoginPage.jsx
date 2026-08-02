import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../components/common/AuthLayout";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const ok = await login(data);
    if (ok) navigate("/home");
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep the conversation going."
      illustrationTitle="Every message, in one place."
      illustrationText="Connect with friends, discover new people, and chat in real time."
      footer={
        <p className="text-base-content/60">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-primary font-medium">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
              placeholder="••••••••"
              className="grow"
              {...register("password", { required: "Password is required" })}
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-base-content/40">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </label>
          {errors.password && <span className="mt-1 text-xs text-error">{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={isLoggingIn} className="btn btn-primary mt-2 w-full">
          {isLoggingIn ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
