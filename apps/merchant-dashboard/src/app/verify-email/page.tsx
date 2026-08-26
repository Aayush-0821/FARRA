"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Email verification failed.",
          );
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while verifying your email.",
        );
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;

    if (countdown === 0) {
      window.location.href = "/login";
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef3f5] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[-0.06em] text-[#17252d]"
        >
          FARRA
        </Link>

        {/* Loading */}
        {status === "loading" && (
          <div className="mt-10">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#17252d]" />

            <h1 className="mt-6 text-2xl font-semibold text-[#17252d]">
              Verifying your email
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while we verify your account.
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
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
              Email verified successfully
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Your FARRA account is now verified.
            </p>

            <p className="mt-6 text-sm text-gray-500">
              Redirecting you to login in{" "}
              <span className="font-semibold text-[#17252d]">{countdown}</span>{" "}
              seconds...
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
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
              Verification failed
            </h1>

            <p className="mt-2 text-sm text-red-500">{message}</p>

            <Link
              href="/login"
              className="mt-6 inline-block rounded-xl bg-[#17252d] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#263943]"
            >
              Go to login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
