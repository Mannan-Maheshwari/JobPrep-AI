import React, { useRef, useState } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/Hooks/useAuth.js";
import Loading from "../../../components/Loading.jsx";

const MAX_JOB_DESC_CHARS = 5000;

const Home = () => {
  const { loading, generateAiReport, reports = [] } = useInterview();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState(""); 
  const [selfDescription, setSelfDescription] = useState("");
  const resumeFileRef = useRef(); 
  const { user, handlelogout } = useAuth();

  const handlegenerateReport = async () => {
    const resumeFile = resumeFileRef.current?.files?.[0];

    
    console.log("HOME:", resumeFile);
    console.log("HOME instanceof File:", resumeFile instanceof File);


    const report = await generateAiReport({ jobDescription, selfDescription, resumeFile });
    console.log("REPORT:", report);

    if (!report) {
        console.log("Report is null");
        return;
    }

    console.log("Navigating to:", `/interview/${report._id}`);
    navigate(`/interview/${report._id}`);
  };

  if(loading){
    <Loading message="Generating your interview strategy..." />;
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-violet-500/30">
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.18),transparent)]"
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <svg
                className="h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              Job-Prep AI
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex md:flex-nowrap md:whitespace-nowrap">
            <a href="#" className="transition-colors hover:text-white  rounded-lg px-3 
          py-2.5 transition-colors hover:text-white border border-transparent hover:border-white/50">
              How it Works
            </a>
            <button
              onClick={() => {
                if (user) {
                  handlelogout();
                } else {
                  navigate("/login");
                }
              }}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:text-white  rounded-lg px-3 
          py-2.5 transition-colors hover:text-white border border-transparent hover:border-white/50"
              
            >
              
              Logout
            </button>
          </nav>

          <button
            type="button"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 md:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        {/* Hero */}
        <section className="mb-10 max-w-3xl sm:mb-14">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Architect your next{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
              career breakthrough.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Leverage hyper-personalized AI analysis to transform job requirements
            into a tactical, high-impact interview roadmap.
          </p>
        </section>

        {/* Two-column form layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Phase 01 — Job Description */}
          <section className="lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-center gap-3">
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold sm:text-2xl">The Opportunity</h2>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-xl shadow-black/20">
              <textarea
                onChange={(e) => setJobDescription(e.target.value)}
                id="jobDescription"
                name="jobDescription"
                maxLength={MAX_JOB_DESC_CHARS}
                placeholder="Paste the full job description here... Our engine will extract core competencies  and hidden technical requirements."
                className="min-h-[280px] w-full resize-y bg-transparent px-5 py-5 text-sm leading-relaxed text-slate-200 placeholder:text-slate-500 focus:outline-none sm:min-h-[360px] sm:px-6 sm:py-6 sm:text-base"
              />
              <div className="flex justify-end border-t border-white/5 px-5 py-3 sm:px-6">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-600" />
                  {jobDescription.toLocaleString()} /{" "}
                  {MAX_JOB_DESC_CHARS.toLocaleString()} Characters
                </span>
              </div>
            </div>

          {/* Recent Reports */}
          <section className="lg:col-span-2 mt-10">
            <h2 className="mb-5 text-xl font-semibold sm:text-2xl">Recent Reports</h2>
            <div className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div key={report._id} className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 shadow-xl shadow-black/20 sm:p-6" onClick={() => navigate(`/interview/${report._id}`)}>
                  <h3 className="text-lg font-semibold text-slate-200">{report.title}</h3>
                  <p className="text-sm text-slate-500">Created At: {new Date(report.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Match Score: {report.MatchScore}/100</p>
                </div>
              ))}
            </div>
          </section>

          </section>


          {/* Phase 02 — Profile + CTA */}
          <section className="flex flex-col gap-6 lg:col-span-2">
            <div>
              <div className="mb-4">
              </div>
              <h2 className="mb-5 text-xl font-semibold sm:text-2xl">Your Profile</h2>

              <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 shadow-xl shadow-black/20 sm:p-6">
                {/* Resume upload */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                    </span>
                    <span className="text-md font-medium text-white/80">
                      Resume Analysis
                    </span>
                  </div>
                </div>

                <label
                  htmlFor="resume"
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 transition-colors sm:py-10`}
                >
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {"Drop resume to sync"}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    PDF, DOCX up to 10MB
                  </span>
                  <input
                    ref={resumeFileRef}
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    className="sr-only"
                  />
                </label>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                </div>

                {/* Self description */}
                <div>
                  <label
                    htmlFor="selfDescription"
                    className="mb-2 mt-10 block text-[12px] font-semibold uppercase tracking-[0.15em] text-white/50 sm:text-sm"
                  >
                    Self-Description
                  </label>
                  <textarea
                    onChange={(e) => setSelfDescription(e.target.value)}
                    id="selfDescription"
                    name="selfDescription"
                    rows={4}
                    placeholder="Highlight specific achievements or focus areas..."
                    className="w-full h-[250px] resize-y rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Generate CTA card */}
            <div className="rounded-2xl mt-10 border border-white/10 bg-[#0d1117] p-5 shadow-xl shadow-black/20 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[16px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Ready to build?
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Approx. 30s generation time
                  </p>
                </div>
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0d1117] bg-gradient-to-br from-violet-500 to-indigo-600 text-[10px] font-bold">
                    AI
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlegenerateReport}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0d1117] sm:py-4 sm:text-base"
              >
                Generate My Strategy
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>

              <p className="mt-4 text-center text-xs italic text-slate-600">
                Precision strategy for professional impact.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <svg
              className="h-3.5 w-3.5 text-violet-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
            <span>Job-Prep AI @2026</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#" className="tracking-wider transition-colors hover:text-slate-300">
              Privacy
            </a>
            <a href="#" className="tracking-wider transition-colors hover:text-slate-300">
              Security
            </a>
            <a href="#" className="tracking-wider transition-colors hover:text-slate-300">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
