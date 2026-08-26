"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "form" | "success" | "error"
  >("form");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid or missing password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setStatus("error");
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to reset your password.",
        );
      }

      setStatus("success");
      setSuccess(
        data.message || "Password reset successfully.",
      );

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "error" && !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef3f5] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-[-0.06em] text-[#17252d]"
          >
            FARRA
          </Link>

          <div className="mt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-[#17252d]">
              Invalid reset link
            </h1>

            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>

            <Link
              href="/forgot-password"
              className="mt-6 inline-block rounded-xl bg-[#17252d] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#263943]"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef3f5] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-[-0.06em] text-[#17252d]"
          >
            FARRA
          </Link>

          <div className="mt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-[#17252d]">
              Password reset successfully
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Your password has been changed successfully.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-block rounded-xl bg-[#17252d] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#263943]"
            >
              Continue to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef3f5] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-[-0.06em] text-[#17252d]"
          >
            FARRA
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[#17252d]">
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#17252d] outline-none transition focus:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              minLength={8}
              maxLength={128}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#17252d] outline-none transition focus:border-gray-400"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#17252d] py-3 text-sm font-medium text-white transition hover:bg-[#263943] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-[#17252d] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}