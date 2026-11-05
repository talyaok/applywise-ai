"use client";

import { useState } from "react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout failed.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(err.message || "Unable to start checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 text-center">
      <h2 className="text-2xl font-bold text-white">
        ApplyWise Pro
      </h2>

      <p className="mt-2 text-slate-300">
        Experience our premium checkout demo.
      </p>

      <p className="mt-3 text-3xl font-bold text-cyan-400">
        RM9.90
      </p>

      <p className="mt-1 text-xs text-slate-400">
        One-time test payment. No real charges or premium access.
      </p>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="mt-5 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Try Pro Checkout"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
