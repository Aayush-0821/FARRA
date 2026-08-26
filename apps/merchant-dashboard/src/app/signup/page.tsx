"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    merchantName: "",
    razorpayAccountId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        merchantName: formData.merchantName,
        ...(formData.razorpayAccountId
          ? { razorpayAccountId: formData.razorpayAccountId }
          : {}),
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Registration failed",
        );
      }

      setSuccess(
        "Account created successfully. Please check your email to verify your account.",
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        merchantName: "",
        razorpayAccountId: "",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <main className="min-h-screen bg-[#eef3f5] px-4 py-8 sm:px-6 sm:py-5">
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[-0.06em]"
        >
          FARRA
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#17252d] sm:text-3xl">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Start recovering revenue with FARRA.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Your name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 text-[#17252d]"
          />
        </div>

        <div>
          <label
            htmlFor="merchantName"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Business name
          </label>

          <input
            id="merchantName"
            name="merchantName"
            type="text"
            value={formData.merchantName}
            onChange={handleChange}
            required
            placeholder="Your business"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 text-[#17252d]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 text-[#17252d]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 text-[#17252d]"
          />
        </div>

        <div>
          <label
            htmlFor="razorpayAccountId"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Razorpay Account ID{" "}
            <span className="text-gray-400">(optional)</span>
          </label>

          <input
            id="razorpayAccountId"
            name="razorpayAccountId"
            type="text"
            value={formData.razorpayAccountId}
            onChange={handleChange}
            placeholder="acc_..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 text-[#17252d]"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#17252d] py-2.5 text-sm font-medium text-white transition hover:bg-[#263943] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
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