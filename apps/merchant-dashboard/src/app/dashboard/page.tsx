"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    // We'll wire this to the real logout API shortly.
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#eef3f5]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-2xl font-semibold tracking-[-0.06em] text-[#17252d]"
          >
            FARRA
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Merchant Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#17252d]">
            Welcome to FARRA
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your payment recovery dashboard will appear here.
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="mt-3 text-2xl font-semibold text-[#17252d]">
              ₹0
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Recovered Revenue</p>
            <p className="mt-3 text-2xl font-semibold text-[#17252d]">
              ₹0
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Failed Payments</p>
            <p className="mt-3 text-2xl font-semibold text-[#17252d]">
              0
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Recovery Rate</p>
            <p className="mt-3 text-2xl font-semibold text-[#17252d]">
              0%
            </p>
          </div>
        </div>

        {/* Getting started */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#17252d]">
            Get started with FARRA
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Connect your Razorpay account to start receiving payment
            data and recovering failed payments.
          </p>

          <div className="mt-6">
            <button
              className="rounded-xl bg-[#17252d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#263943]"
              onClick={() => {
                // Razorpay connection will go here.
              }}
            >
              Connect Razorpay
            </button>
          </div>
        </div>

        {/* Placeholder activity */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#17252d]">
            Recent activity
          </h2>

          <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">
              No payment activity yet.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Connect Razorpay to start seeing payment activity.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}