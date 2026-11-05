"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AccountPanel({ analysis, skills, job }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadHistory = useCallback(async (userId) => {
    if (!supabase || !userId) return;

    const { data, error } = await supabase
      .from("job_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setMessage(error.message);
    } else {
      setHistory(data || []);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadHistory(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (!session?.user) setHistory([]);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [loadHistory]);

  async function handleAuth(mode) {
    if (!supabase) return;

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setBusy(true);
    setMessage("");

    const credentials = { email: email.trim(), password };

    const { data, error } =
      mode === "signup"
        ? await supabase.auth.signUp(credentials)
        : await supabase.auth.signInWithPassword(credentials);

    if (error) {
      setMessage(error.message);
    } else if (data.session) {
      setUser(data.user);
      await loadHistory(data.user.id);
      setMessage("Signed in successfully.");
      setPassword("");
    } else {
      setMessage("Account created. Check your email to confirm your account.");
    }

    setBusy(false);
  }

  async function saveAnalysis() {
    if (!supabase || !user || !analysis) return;

    setBusy(true);
    setMessage("");

    const { error } = await supabase.from("job_analyses").insert({
      user_id: user.id,
      user_skills: skills,
      job_description: job,
      match_score: analysis.score,
      matched_skills: analysis.matchedSkills,
      missing_skills: analysis.missingSkills,
      recommendations: analysis.recommendations,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Analysis saved successfully!");
      await loadHistory(user.id);
    }

    setBusy(false);
  }

  async function deleteAnalysis(id) {
    if (!supabase || !user) return;

    setBusy(true);
    setMessage("");

    const { error } = await supabase
      .from("job_analyses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setMessage(error.message);
    } else {
      await loadHistory(user.id);
      setMessage("Analysis deleted.");
    }

    setBusy(false);
  }

  async function signOut() {
    if (!supabase) return;

    setBusy(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
    } else {
      setUser(null);
      setHistory([]);
      setMessage("Signed out.");
    }

    setBusy(false);
  }

  if (!supabase) {
    return (
      <p className="mt-8 text-center text-sm text-amber-300">
        Supabase is not configured. Local analysis still works.
      </p>
    );
  }

  return (
    <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Your ApplyWise account</h2>

      {message && (
        <p role="status" className="mt-4 rounded-xl bg-slate-800 p-3 text-sm text-cyan-300">
          {message}
        </p>
      )}

      {!user ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-slate-400">
            Create a free account to save your job match analyses.
            You can still analyze jobs without signing in.
          </p>

          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />

          <div className="flex flex-wrap gap-3">
            <button
              disabled={busy}
              onClick={() => handleAuth("signup")}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
            >
              Sign up
            </button>
            <button
              disabled={busy}
              onClick={() => handleAuth("login")}
              className="rounded-xl border border-slate-600 px-5 py-3 font-semibold disabled:opacity-50"
            >
              Log in
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-300">
              Signed in as <strong>{user.email}</strong>
            </p>
            <button
              onClick={signOut}
              disabled={busy}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm disabled:opacity-50"
            >
              Sign out
            </button>
          </div>

          {analysis && (
            <button
              onClick={saveAnalysis}
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"
            >
              {busy ? "Please wait..." : "Save current analysis"}
            </button>
          )}

          <h3 className="mt-8 text-xl font-bold">Your saved analyses</h3>

          {history.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">
              No saved analyses yet. Analyze a job and save your results.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-cyan-400">
                        {item.match_score}% match
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                        {item.job_description}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        Missing: {item.missing_skills.join(", ") || "None"}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteAnalysis(item.id)}
                      disabled={busy}
                      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
