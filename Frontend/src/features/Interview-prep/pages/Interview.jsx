import React, { useState, useEffect, useRef } from "react";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../../Auth/Hooks/useAuth";
import { useNavigate, useParams, Link} from "react-router";
import Loading from "../../../components/Loading.jsx";

const severityStyles = {
  high: "border-red-500/40 bg-red-500/10 text-red-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  low: "border-slate-500/40 bg-slate-500/10 text-slate-300",
};

// Wraps any substring of `text` that matches `query` (case-insensitive) in
// a <mark> tag so it renders highlighted. Returns the original text
// untouched if there's no query or no match.
function highlightText(text, query) {
  if (text === null || text === undefined) return text;
  const value = String(text);
  const q = query ? query.trim() : "";
  if (!q) return value;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = value.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded bg-yellow-400/40 px-0.5 text-yellow-100">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const Interview = () => {
  const { report, fetchReportById, generateResumePdfFromReport, loading } = useInterview();
  const { id: interviewId } = useParams();

  // Sections default to collapsed on load/refresh
  const [techOpen, setTechOpen] = useState(false);
  const [behavOpen, setBehavOpen] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const { user, handlelogout } = useAuth();
  const navigate = useNavigate();

  // Derive a display name from the logged-in user (username field, per
  // useAuth's register() call), falling back to the email prefix
  const displayName = user?.username || (user?.email ? user.email.split("@")[0] : "");
  const avatarInitial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  // Strategy nav items carry a key so we can drive exclusive expand/collapse
  // behavior and highlight whichever section is currently open
  const strategyNavItems = [
    { label: "Technical questions", icon: "help", key: "tech" },
    { label: "Behavioral questions", icon: "chat", key: "behav" },
    { label: "Road Map", icon: "map", key: "roadmap" },
  ];

  const handleStrategyNavClick = (key) => {
    setTechOpen(key === "tech");
    setBehavOpen(key === "behav");
    setRoadmapOpen(key === "roadmap");
  };

  const isNavItemActive = (key) => {
    if (key === "tech") return techOpen;
    if (key === "behav") return behavOpen;
    if (key === "roadmap") return roadmapOpen;
    return false;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const technicalSectionRef = useRef(null);
  const behavioralSectionRef = useRef(null);
  const roadmapSectionRef = useRef(null);

  useEffect(() => {
    if (interviewId) {
      fetchReportById(interviewId);
    }
  }, [interviewId]);

  useEffect(() => {
    if (!report) return;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const techHasMatch = (report.TechnicalQuestions || []).some(
      (q) =>
        q.question.toLowerCase().includes(query) ||
        q.intention.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query)
    );
    const behavHasMatch = (report.BehaviouralQuestions || []).some(
      (q) =>
        q.question.toLowerCase().includes(query) ||
        q.intention.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query)
    );
    const roadmapHasMatch = (report.PreparationPlan || []).some(
      (p) =>
        p.focus.toLowerCase().includes(query) ||
        (p.tasks || []).some((t) => t.toLowerCase().includes(query))
    );

    setTechOpen(techHasMatch);
    setBehavOpen(behavHasMatch);
    setRoadmapOpen(roadmapHasMatch);

    const firstMatchRef = techHasMatch
      ? technicalSectionRef
      : behavHasMatch
      ? behavioralSectionRef
      : roadmapHasMatch
      ? roadmapSectionRef
      : null;

    if (firstMatchRef) {
      // wait a tick so the section has actually expanded before scrolling
      setTimeout(() => {
        firstMatchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [searchQuery, report]);

  if (!report) {
    return <Loading />;
  }

  if (loading) {
    return <Loading message="Fetching your interview strategy..." />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0e1b] text-white">
      {/* Left sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#080c16] lg:flex xl:w-72">
        <div className="border-b border-white/5 px-6 py-6">
          <p className="font-semibold text-white">
            {displayName}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">Full Stack Developer</p>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4">
          <ul className="space-y-1">
            {[
              { label: "Dashboard", icon: "grid" },
              { label: "Resumes", icon: "doc" },
              { label: "Job Board", icon: "briefcase" },
            ].map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (item.label === "Dashboard") {
                      navigate("/");
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <NavIcon type={item.icon} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Strategy
          </p>
          <ul className="space-y-1">
            {strategyNavItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleStrategyNavClick(item.key);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isNavItemActive(item.key)
                      ? "border-l-2 border-blue-400 bg-blue-500/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <NavIcon type={item.icon} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => { generateResumePdfFromReport(report._id) }}
            type="button"
            className="mt-10 bold flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-[#0b1220] px-3 py-2.5 text-sm text-white hover:bg-white/5">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm7-1l.7 2.3L22 4l-2.3.7L19 7l-.7-2.3L16 4l2.3-.7L19 1zM5 15l1 2.8L9 19l-3 1-1 3-1-3-3-1 3-1.2L5 15z"/>
            </svg>  
            <span className="leading-none">Download AI Generated Resume</span>
          </button>

        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/5 bg-[#0a0e1b]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <span className="shrink-0 text-lg font-bold tracking-tight lg:hidden">Job-Prep AI</span>
          <span className="hidden shrink-0 text-lg font-bold tracking-tight lg:block xl:hidden">
            Job-Prep AI
          </span>

          <div className="relative mx-auto hidden max-w-xl flex-1 lg:block">
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search strategy resources..."
              className="w-full rounded-full border border-white/10 bg-[#111827] py-2.5 pl-11 pr-4 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div>
              <button
                onClick={() => {
                  if (user) {
                    handlelogout();
                  } else {
                    navigate("/login");
                  }
                }}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:text-white rounded-lg px-3 py-2.5 border border-transparent hover:border-white/50">
                <NavIcon type="logout" />
                Logout
              </button>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold">
              {avatarInitial}
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col xl:flex-row">
          {/* Center content */}
          <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {/* Roadmap moved below behavioral questions */}

            {/* Technical questions */}
            <section id="technical-questions" ref={technicalSectionRef} className="mt-5 border-t border-white/5 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">Technical Questions</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {report.TechnicalQuestions.length} questions tailored to your MERN stack profile
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTechOpen((s) => !s)}
                  className="ml-4 flex items-center gap-2 rounded-md border border-white/5 bg-[#0b1220] px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  <span>{techOpen ? "Collapse" : "Expand"}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${techOpen ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {techOpen && (
                <div className="mt-6 space-y-4">
                  {report.TechnicalQuestions.map((item, i) => (
                    <QuestionCard key={item.question} index={i + 1} {...item} accent="blue" searchQuery={searchQuery} />
                  ))}
                </div>
              )}
            </section>

            {/* Behavioral questions */}
            <section id="behavioral-questions" ref={behavioralSectionRef} className=" mt-5 border-t border-white/5 pt-5 ">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">Behavioral Questions</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {report.BehaviouralQuestions.length} questions to prepare your STAR responses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBehavOpen((s) => !s)}
                  className="ml-4 flex items-center gap-2 rounded-md border border-white/5 bg-[#0b1220] px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  <span>{behavOpen ? "Collapse" : "Expand"}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${behavOpen ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {behavOpen && (
                <div className="mt-6 space-y-4">
                  {report.BehaviouralQuestions.map((item, i) => (
                    <QuestionCard key={item.question} index={i + 1} {...item} accent="violet" searchQuery={searchQuery} />
                  ))}
                </div>
              )}
            </section>

            {/* Roadmap section (moved) */}
            <section id="roadmap" ref={roadmapSectionRef}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mt-5 pt-5 text-xl font-bold sm:text-2xl">Interview Road Map</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    A personalized 7-day preparation timeline mapped to your profile strengths,
                    skill gaps, and target role requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRoadmapOpen((s) => !s)}
                  className="ml-4 mt-10 flex items-center gap-2 rounded-md border border-white/5 bg-[#0b1220] px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  <span>{roadmapOpen ? "Collapse" : "Expand"}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${roadmapOpen ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {roadmapOpen && (
                <>


                  {/* Match score — visible on mobile/tablet */}
                  <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/10 bg-[#111827] p-4 xl:hidden">
                    <MatchScoreRing score={report.MatchScore} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Profile Match
                      </p>
                      <p className="text-sm text-slate-400">Strong alignment with MERN stack requirements</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-8 space-y-0">
                    {report.PreparationPlan.map((phase, index) => {
                      const isLast = index === report.PreparationPlan.length - 1;

                      return (
                        <div key={phase.day} className="relative flex gap-4 sm:gap-6">
                          {/* Timeline rail */}
                          <div className="flex flex-col items-center">
                            {!isLast && (
                              <div className="my-1 w-px flex-1 min-h-[2rem] bg-gradient-to-b from-blue-500/50 to-slate-700/50" />
                            )}
                          </div>

                          {/* Phase content */}
                          <div className={`min-w-0 flex-1 ${!isLast ? "pb-10" : "pb-4"}`}>
                            <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                              <h2 className="text-base font-semibold sm:text-lg">
                                Phase {phase.day}: {highlightText(phase.focus, searchQuery)}
                              </h2>
                            </div>

                            {(
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {phase.tasks.slice(0, 2).map((task) => (
                                  <div key={task} className="rounded-xl border border-white/10 bg-[#111827] p-4">
                                    <p className="line-clamp-2 text-sm font-medium text-slate-200">
                                      {highlightText(task.split(".")[0], searchQuery)}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{highlightText(task, searchQuery)}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(
                              <div className="rounded-xl border border-blue-500/20 bg-[#111827] p-5">
                                <p className="text-sm font-medium text-slate-200">{highlightText(phase.focus, searchQuery)}</p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500">{highlightText(phase.tasks[0], searchQuery)}</p>
                              </div>
                            )}

                            {(
                              <div className="rounded-xl border border-white/5 bg-[#111827]/50 p-4 opacity-70">
                                <ul className="space-y-2">
                                  {phase.tasks.map((task) => (
                                    <li key={task} className="flex gap-2 text-xs text-slate-500">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                                      {highlightText(task, searchQuery)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="w-full shrink-0 border-t border-white/5 bg-[#080c16] px-4 py-6 sm:px-6 xl:w-80 xl:border-l xl:border-t-0">
            {/* Match score */}
            <div className="hidden rounded-xl border border-white/10 bg-[#111827] p-5 xl:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Profile Match Score
              </p>
              <div className="mt-4 flex items-center gap-4">
                <MatchScoreRing score={report.MatchScore} size="lg" />
                <div>
                  <p className="text-2xl font-bold text-white">{report.MatchScore}%</p>
                  <p className="text-xs text-slate-500">Role alignment</p>
                </div>
              </div>
            </div>

            {/* Skill gaps */}
            <div className="mt-0 xl:mt-6">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                <h3 className="font-semibold text-white">Skill Gaps</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {report.SkillGaps.map(({ skill, severity }) => (
                  <span
                    key={skill}
                    className={`rounded-full border p-3 text-s font-medium text-center break-words ${severityStyles[severity]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-[#111827] p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Analysis
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Your profile shows strong frontend and MERN fundamentals. Focus on deepening
                  Node.js/Express.js patterns and deployment workflows to close remaining gaps
                  before your interview.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

function MatchScoreRing({ score, size = "md" }) {
  const dim = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  const r = size === "lg" ? 28 : 24;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative ${dim} shrink-0`}>
      <svg className={`${dim} -rotate-90`} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
        {score}
      </span>
    </div>
  );
}

function QuestionCard({ index, question, intention, answer, accent, searchQuery }) {
  const [open, setOpen] = useState(false);
  const accentBorder = accent === "blue" ? "border-l-blue-500" : "border-l-violet-500";
  const accentBadge =
    accent === "blue" ? "bg-blue-500/10 text-blue-400" : "bg-violet-500/10 text-violet-400";

  return (
    <article
      className={`rounded-xl border border-white/10 border-l-4 bg-[#111827] ${accentBorder}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 items-start gap-3">
            <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${accentBadge}`}>
              Q{index}
            </span>
            <h3 className="min-w-0 flex-1 cursor-pointer text-sm font-medium leading-relaxed text-slate-200 sm:text-base" onClick={() => setOpen((s) => !s)}>
              {highlightText(question, searchQuery)}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/5"
          >
            <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {open && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Interviewer Intention
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{highlightText(intention, searchQuery)}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-[#0a0e1b] p-3 sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                Suggested Answer
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">{highlightText(answer, searchQuery)}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function IconButton({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
    >
      {children}
    </button>
  );
}

function NavIcon({ type }) {
  const cls = "h-4 w-4 shrink-0";
  switch (type) {
    case "grid":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      );
    case "doc":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25m0 0h4.125c.621 0 1.125-.504 1.125-1.125V11.25c0-4.556-4.03-8.25-9-8.25S3 6.694 3 11.25v1.775c0 .621.504 1.125 1.125 1.125h4.125m9.75-3.375V6.375c0-.621-.504-1.125-1.125-1.125H8.25c-.621 0-1.125.504-1.125 1.125v3.375m9.75 0H8.25" />
        </svg>
      );
    case "help":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      );
    case "chat":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.375c0-2.278-1.764-4.122-3.976-4.122S8.25 4.097 8.25 6.375V8.72m13.5 0V6.375c0-2.278-1.764-4.122-3.976-4.122S8.25 4.097 8.25 6.375v2.345m13.5 0c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193" />
        </svg>
      );
    case "map":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      );
    case "logout":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      );
    default:
      return null;
  }
}

export default Interview;
