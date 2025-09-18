import React from "react";

// JeepediaHero.jsx
// Single-file React component (TailwindCSS) for the Jeepedia landing hero + features section.
// Default export a React component so it can be dropped into any Next.js / CRA project.

export default function JeepediaHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Jeepedia — <span className="text-blue-600">JEE counselling</span> made simple
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Clear college predictions, real cutoffs, seat matrices and placement statistics — all
            in one open-source place. No ads. No noise. Just useful data to help you make the
            right decision.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://jeepedia.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-blue-600 text-white font-medium shadow-lg hover:brightness-95"
            >
              Live demo
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a
              href="https://github.com/J2J-App"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-slate-200 bg-white font-medium shadow-sm hover:bg-slate-50"
            >
              View on GitHub
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-500">
            <div>
              <div className="font-semibold text-slate-800">44.6k+</div>
              <div>Impressions</div>
            </div>
            <div>
              <div className="font-semibold text-slate-800">8.13k</div>
              <div>Total visits</div>
            </div>
            <div>
              <div className="font-semibold text-slate-800">6.03k</div>
              <div>Unique visitors</div>
            </div>
            <div>
              <div className="font-semibold text-slate-800">4m 9s</div>
              <div>Avg. session</div>
            </div>
          </div>
        </div>

        {/* Right: Screenshot card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl p-6">
            <img
              src="https://res.cloudinary.com/dqvwf3z2c/image/upload/v1750174048/image1_k9hyeb.jpg"
              alt="Jeepedia screenshot"
              className="rounded-xl border border-slate-100 shadow-inner"
            />

            <div className="mt-4 text-center text-sm text-slate-500">
              Predictive cutoffs · Seat matrix · Placement stats
            </div>
          </div>
        </div>
      </div>

      {/* Features list */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Feature title="Real cutoffs" desc="JoSAA + JAC Delhi historical cutoffs, shown visually." />
        <Feature title="Seat matrices" desc="Up-to-date seat availability and branch breakdowns." />
        <Feature title="Compare colleges" desc="Filter, sort and compare colleges with meaningful metrics." />
      </div>
    </section>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="font-semibold text-slate-800">{title}</div>
      <div className="mt-2 text-sm text-slate-500">{desc}</div>
    </div>
  );
}