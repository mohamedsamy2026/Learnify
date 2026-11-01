
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import {
  authApi,
  getApiError,
  getSafeRedirect,
  saveSession,
} from "@/lib/auth";

// LOGIN VALIDATION
const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

// REGISTER VALIDATION
const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters."),

    email: z.email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

const inputClass = `
  h-[58px] w-full rounded-2xl
  border border-[#DDE8F6]
  bg-[#F7FAFF]
  pl-13 pr-4
  text-[15px] font-medium text-[#102C57]
  outline-none
  transition-all duration-300 ease-out
  placeholder:text-[#A0AFC3]
  hover:border-[#BBD5F5]
  hover:bg-white
  focus:border-[#438DE9]
  focus:bg-white
  focus:shadow-[0_0_0_4px_rgba(59,141,250,0.10),0_12px_30px_-18px_rgba(40,107,193,0.4)]
`;

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const isLogin = mode === "login";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      isLogin ? loginSchema : registerSchema
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ORIGINAL AUTHENTICATION LOGIC
  async function onSubmit(values) {
    setServerError("");

    try {
      let response;

      if (isLogin) {
        response = await authApi.login({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
      } else {
        response = await authApi.register({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
      }

      if (!response?.token) {
        throw new Error("INVALID_AUTH_RESPONSE");
      }

      const user = saveSession(response);

      if (!user) {
        throw new Error("INVALID_AUTH_RESPONSE");
      }

      const query = new URLSearchParams(
        window.location.search
      );

      const requestedRedirect = query.get("redirect");

      const destination = getSafeRedirect(
        requestedRedirect,
        user.role
      );

      router.replace(destination);
      router.refresh();
    } catch (error) {
      console.error("Authentication failed:", error);

      if (
        error.message === "INVALID_AUTH_RESPONSE" ||
        error.message === "Authentication token missing" ||
        error.message === "User information missing"
      ) {
        setServerError(
          "Unexpected authentication response. Please try again."
        );
        return;
      }

      setServerError(getApiError(error));
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="relative space-y-5"
      >
        {/* SERVER ERROR */}
        {serverError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* FULL NAME */}
        {!isLogin && (
          <div className="auth-field-enter">
            <FormField
              id="auth-full-name"
              label="Full Name"
              icon={UserRound}
              error={errors.name?.message}
            >
              <input
                id="auth-full-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name
                    ? "auth-full-name-error"
                    : undefined
                }
                {...register("name")}
                className={inputClass}
              />
            </FormField>
          </div>
        )}

        {/* EMAIL */}
        <div className="auth-field-enter">
          <FormField
            id="auth-email"
            label="Email Address"
            icon={Mail}
            error={errors.email?.message}
          >
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email
                  ? "auth-email-error"
                  : undefined
              }
              {...register("email")}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* PASSWORD */}
        <div className="auth-field-enter auth-delay-1">
          <FormField
            id="auth-password"
            label="Password"
            icon={LockKeyhole}
            error={errors.password?.message}
          >
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                isLogin
                  ? "current-password"
                  : "new-password"
              }
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password
                  ? "auth-password-error"
                  : undefined
              }
              {...register("password")}
              className={`${inputClass} pr-13`}
            />

            <PasswordToggle
              visible={showPassword}
              onClick={() =>
                setShowPassword((value) => !value)
              }
            />
          </FormField>
        </div>

        {/* CONFIRM PASSWORD */}
        {!isLogin && (
          <div className="auth-field-enter auth-delay-2">
            <FormField
              id="auth-confirm-password"
              label="Confirm Password"
              icon={LockKeyhole}
              error={errors.confirmPassword?.message}
            >
              <input
                id="auth-confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? "auth-confirm-password-error"
                    : undefined
                }
                {...register("confirmPassword")}
                className={`${inputClass} pr-13`}
              />

              <PasswordToggle
                visible={showConfirm}
                onClick={() =>
                  setShowConfirm((value) => !value)
                }
              />
            </FormField>
          </div>
        )}

        {/* PASSWORD REQUIREMENTS */}
        {!isLogin && (
          <p className="text-xs leading-6 text-[#7286A1]">
            Use at least 8 characters for your password.
          </p>
        )}

        {/* SUBMIT BUTTON */}
      <button
  type="submit"
  disabled={isSubmitting}
  className={`
    group/submit relative mt-5 flex h-[58px] w-full
    items-center justify-center gap-3 overflow-hidden
    rounded-2xl bg-gradient-to-r
    from-[#2465BE] to-[#438DE9]
    font-bold text-white
    transition-all duration-300
    hover:shadow-lg
    disabled:cursor-not-allowed
    disabled:opacity-60
  `}
>
          {/* Animated light reflection */}
         <span
  aria-hidden="true"
  className={`
    pointer-events-none absolute inset-0
    -translate-x-full skew-x-[-20deg]
    bg-gradient-to-r
    from-transparent via-white/25 to-transparent
    transition-transform duration-700
    motion-safe:group-hover/submit:translate-x-full
  `}
/>

          {isSubmitting ? (
            <span className="relative z-10 flex items-center gap-3">
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
              Please wait...
            </span>
          ) : (
            <span className="relative z-10 flex items-center gap-3">
              {isLogin ? "Log In" : "Create Account"}

              <ArrowRight
                size={19}
                className="
                  transition-transform duration-300
                  motion-safe:group-hover/submit:translate-x-1.5
                "
              />
            </span>
          )}
        </button>

        {/* FOOTER TEXT */}
        <p className="pt-1 text-center text-xs leading-6 text-[#899AB0]">
          Your account helps you access courses
          and track your learning progress.
        </p>
      </form>

      <style jsx>{`
        @keyframes authFieldEnter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .auth-field-enter {
            animation: authFieldEnter 0.55s
              cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .auth-delay-1 {
            animation-delay: 0.08s;
          }

          .auth-delay-2 {
            animation-delay: 0.16s;
          }
        }
      `}</style>
    </>
  );
}

// REUSABLE FORM FIELD
function FormField({
  id,
  label,
  icon: Icon,
  error,
  children,
}) {
  return (
    <div className="group/field">
      <label
        htmlFor={id}
        className="
          mb-2.5 block text-sm font-bold text-[#17365F]
          transition-colors duration-300
          group-focus-within/field:text-[#286BC1]
        "
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={19}
          strokeWidth={1.9}
          aria-hidden="true"
          className="
            pointer-events-none absolute left-4 top-1/2
            z-10 -translate-y-1/2 text-[#8DA3BC]
            transition-all duration-300
            group-focus-within/field:scale-110
            group-focus-within/field:text-[#3478D4]
          "
        />

        {children}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// PASSWORD VISIBILITY BUTTON
function PasswordToggle({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className="
        absolute right-3 top-1/2 flex h-9 w-9
        -translate-y-1/2 items-center justify-center
        rounded-xl text-[#8196AE]
        transition-all duration-300
        hover:bg-[#E8F2FF] hover:text-[#286BC1]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[#438DE9]
      "
    >
      {visible ? <EyeOff size={19} /> : <Eye size={19} />}
    </button>
  );
}
