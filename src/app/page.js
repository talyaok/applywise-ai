"use client";

import UpgradeButton from "@/components/UpgradeButton";

import { useState } from "react";
import AccountPanel from "@/components/AccountPanel";

const SAMPLE_JOB = `We are looking for a Junior Frontend Developer with experience in React, JavaScript, TypeScript, HTML, and CSS. Knowledge of Git and REST APIs is a plus.`;

export default function Home() {
  const [skills, setSkills] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          jobDescription: job,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold tracking-tight">
          Apply<span className="text-cyan-400">Wise</span>
          <span className="ml-2 text-xs text-slate-400">AI</span>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
          Free Skills Analyzer
        </span>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pb-12 pt-16 text-center">
        <div className="mb-5 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          Built for students and early-career job seekers
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Know your strengths.
          <br />
          <span className="text-cyan-400">Spot your skill gaps.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Compare your skills against a job description, discover what
          you already know, and find out what to learn next.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <form
          onSubmit={handleAnalyze}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-9"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Analyze your job match</h2>
            <p className="mt-2 text-sm text-slate-400">
              No account required. Your input is analyzed in your browser.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="skills" className="mb-3 block font-semibold">
                Your skills
              </label>
              <textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, JavaScript, HTML, CSS..."
                className="h-56 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none transition focus:border-cyan-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter your skills separated by commas.
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <label htmlFor="job" className="font-semibold">
                  Job description
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setJob(SAMPLE_JOB);
                    setSkills("React, JavaScript, HTML, CSS");
                    setResult(null);
                    setError("");
                  }}
                  className="text-sm text-cyan-400 hover:underline"
                >
                  Try sample
                </button>
              </div>
              <textarea
                id="job"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Paste the job description here..."
                className="h-56 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none transition focus:border-cyan-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Include the required skills and technologies.
              </p>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-6 rounded-xl border border-red-800 bg-red-950 p-4 text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Match →"}
          </button>
        </form>

      {result && (
          <div aria-live="polite" className="mt-8 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-sm uppercase tracking-widest text-slate-400">
                Identified skills matched
              </p>
              <p className="mt-3 text-6xl font-extrabold text-cyan-400">
                {result.score}%
              </p>
              <div className="mx-auto mt-5 h-3 max-w-lg overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-slate-400">
                {result.matchedSkills.length} of {result.requiredSkills.length} identified job skills matched.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-800/40 bg-slate-900 p-7">
                <h3 className="mb-5 text-xl font-bold text-emerald-400">
                  ✓ Your matching skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.length ? (
                    result.matchedSkills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400">No matching skills identified yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-800/40 bg-slate-900 p-7">
                <h3 className="mb-5 text-xl font-bold text-amber-400">
                  Your skill gaps
                </h3>
                <div className="flex flex-wrap gap-2">
                {result.missingSkills.length ? (
                    result.missingSkills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400">All identified skills matched!</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <h3 className="mb-5 text-2xl font-bold">
                Your improvement roadmap
              </h3>
              {result.recommendations.length ? (
                <div className="space-y-5">
                  {result.recommendations.map((item, index) => (
                    <div key={item.skill} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 font-bold text-cyan-400">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold">{item.skill}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">
                          {item.advice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">
                  Great work! Consider building projects that demonstrate these skills.
                </p>
              )}
            </div>
          </div>
        )}

        <AccountPanel analysis={result} skills={skills} job={job} />

        <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
          Current analysis uses rule-based skill matching, not live AI.
          Scores measure identified skill overlap, not hiring probability.
        </p>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
        ApplyWise AI — Built to help you apply smarter.
      </footer>
            <UpgradeButton />
      </main>
  );
}
