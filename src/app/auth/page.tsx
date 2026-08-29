"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { setAuthSession } from "@/lib/auth-client";

function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode from URL query parameter or default to "login"
  const modeParam = searchParams.get("mode");
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  const [internalMode, setInternalMode] = useState<"login" | "signup">("login");

  // Determine active mode
  const activeMode: "login" | "signup" =
    modeParam === "signup" ? "signup" : modeParam === "login" ? "login" : internalMode;

  // Initial error / alert messages based on URL query params
  const initialError =
    errorParam === "unauthorized"
      ? "Please log in with an administrator account to access the quote management dashboard."
      : errorParam === "session_expired"
      ? "Your session has expired. Please sign in again."
      : errorParam === "non_admin"
      ? "Your account does not have administrator access."
      : null;

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(messageParam || null);

  const switchMode = (newMode: "login" | "signup") => {
    setInternalMode(newMode);
    setError(null);
    setSuccess(null);
    const params = new URLSearchParams(window.location.search);
    params.set("mode", newMode);
    params.delete("error");
    params.delete("message");
    router.replace(`/auth?${params.toString()}`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          remember: rememberMe,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: {
          access_token: string;
          user: {
            id: string;
            email: string;
            name?: string;
            fullName?: string;
            role: "admin" | "user";
          };
        };
      };

      if (!res.ok || !data.success || !data.data) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      const { access_token, user } = data.data;
      const formattedUser = {
        id: user.id,
        email: user.email,
        fullName: user.name || user.fullName || user.email,
        role: user.role,
      };

      setAuthSession(access_token, formattedUser);

      // Role-based redirection
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/portal");
      }
      router.refresh();
    } catch {
      setError("A network error occurred. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || cleanName.length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your confirmation password.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          password,
          confirmPassword,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.success) {
        setError(data.error || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(
        data.message ||
          "Account created successfully. You can now sign in below with your credentials."
      );
      setFullName("");
      setPassword("");
      setConfirmPassword("");
      switchMode("login");
    } catch {
      setError("A network error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white border border-[#e5e5e5] p-6 sm:p-8 md:p-10 shadow-premium text-[#111111] box-border">
      {/* Header Branding */}
      <div className="flex flex-col items-center text-center mb-7">
        <div className="w-12 h-12 rounded-full bg-[#f7f7f5] border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-3 shadow-subtle">
          <Shield size={22} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#555555] block mb-1">
          [Authentication Portal]
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-[#111111] uppercase">
          {activeMode === "login" ? "Account Sign In" : "Create Account"}
        </h1>
        <p className="text-xs text-[#555555] font-sans mt-1">
          Complete Glass Innovations Access
        </p>
      </div>

      {/* Mode Tabs: [ LOGIN ] [ SIGN UP ] */}
      <div className="grid grid-cols-2 border border-[#e5e5e5] mb-6 bg-[#f7f7f5] p-1">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`py-2.5 text-xs font-mono uppercase tracking-widest font-bold transition-all ${
            activeMode === "login"
              ? "bg-[#111111] text-white shadow-sm"
              : "text-[#555555] hover:text-[#111111]"
          }`}
        >
          [ Login ]
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`py-2.5 text-xs font-mono uppercase tracking-widest font-bold transition-all ${
            activeMode === "signup"
              ? "bg-[#111111] text-white shadow-sm"
              : "text-[#555555] hover:text-[#111111]"
          }`}
        >
          [ Sign Up ]
        </button>
      </div>

      {/* Status & Error Messages */}
      {error && (
        <div
          className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 leading-relaxed"
          role="alert"
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 leading-relaxed"
          role="status"
        >
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* ================================================= */}
      {/* MODE 1: LOGIN FORM                                */}
      {/* ================================================= */}
      {activeMode === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-[10px] uppercase tracking-widest text-[#555555] font-mono mb-1.5 font-bold"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="loginEmail"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5e5e5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-sans transition-colors placeholder:text-[#999999]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="loginPassword"
                className="block text-[10px] uppercase tracking-widest text-[#555555] font-mono font-bold"
              >
                Password *
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-[10px] uppercase tracking-wider text-[#555555] hover:text-[#111111] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#e5e5e5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-sans transition-colors placeholder:text-[#999999]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#555555] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-none border-[#e5e5e5] accent-[#111111]"
              />
              <span className="text-[11px] font-sans">Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#333333] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-subtle cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center pt-4 border-t border-[#e5e5e5]">
            <p className="text-xs text-[#555555] font-sans">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="text-[#111111] underline hover:text-[#555555] font-semibold ml-1 cursor-pointer"
              >
                Create one now
              </button>
            </p>
          </div>
        </form>
      )}

      {/* ================================================= */}
      {/* MODE 2: SIGN UP FORM                              */}
      {/* ================================================= */}
      {activeMode === "signup" && (
        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label
              htmlFor="signupFullName"
              className="block text-[10px] uppercase tracking-widest text-[#555555] font-mono mb-1.5 font-bold"
            >
              Full Name *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="signupFullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5e5e5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-sans transition-colors placeholder:text-[#999999]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signupEmail"
              className="block text-[10px] uppercase tracking-widest text-[#555555] font-mono mb-1.5 font-bold"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="signupEmail"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5e5e5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-sans transition-colors placeholder:text-[#999999]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signupPassword"
              className="block text-[10px] uppercase tracking-widest text-[#555555] font-mono mb-1.5 font-bold"
            >
              Password (Min 6 chars) *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="signupPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#e5e5e5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-sans transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="signupConfirmPassword"
              className="block text-[10px] uppercase tracking-widest text-[#555555] font-mono mb-1.5 font-bold"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="signupConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#e5e5e5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-sans transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] p-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#333333] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-subtle cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center pt-4 border-t border-[#e5e5e5]">
            <p className="text-xs text-[#555555] font-sans">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-[#111111] underline hover:text-[#555555] font-semibold ml-1 cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      )}

      {/* Return link */}
      <div className="mt-6 pt-4 border-t border-[#e5e5e5] text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-mono text-[#555555] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Public Website
        </Link>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24 bg-[#f7f7f5] text-[#111111] min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left: Architectural Glass Image (hidden on mobile) */}
          <div className="hidden lg:block relative bg-[#111111] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/images/why-us/hero-glass.webp"
                alt="Architectural glass installation"
                className="w-full h-full object-cover opacity-60"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 z-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/60 block mb-3">
                [Secure Access Portal]
              </span>
              <h2 className="font-serif text-3xl xl:text-4xl font-light tracking-tight text-white leading-tight mb-4">
                COMPLETE GLASS <br />
                <span className="italic font-normal">INNOVATIONS</span>
              </h2>
              <p className="text-sm text-white/60 font-sans font-light max-w-sm leading-relaxed">
                Premium architectural glass solutions engineered for modern Australian residences and commercial spaces.
              </p>
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                <span className="text-[9px] uppercase tracking-widest font-mono text-white/40">AS1288 Certified</span>
                <span className="text-white/20">|</span>
                <span className="text-[9px] uppercase tracking-widest font-mono text-white/40">Australian Owned</span>
              </div>
            </div>
          </div>

          {/* Right: Auth Form */}
          <div className="flex items-center justify-center py-10 px-4 sm:px-6 lg:px-12">
            <FadeIn direction="up" delay={0.1} className="w-full flex justify-center">
              <Suspense
                fallback={
                  <div className="w-full max-w-[420px] bg-white border border-[#e5e5e5] p-8 text-center text-[#555555] font-mono text-xs shadow-subtle">
                    Loading Authentication Portal...
                  </div>
                }
              >
                <AuthCard />
              </Suspense>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}
