import React, { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams } from "react-router";

// // MOCK DATA
// const REPORT_DATA = {
//   MatchScore: 92,
//   TechnicalQuestions: [
//     {
//       question:
//         "Walk me through the architecture of a typical MERN stack application. How do MongoDB, Express.js, React.js, and Node.js interact to deliver a full-stack experience?",
//       intention:
//         "To assess overall understanding of the MERN stack architecture and how components interact.",
//       answer:
//         "Explain the typical interaction: React handles the UI, sending requests to Express.js. Express.js routes these requests, interacts with MongoDB (via Mongoose/Node.js driver) for data, and sends responses back. Node.js provides the runtime for Express.js. Emphasize RESTful API communication and state management in React.",
//     },
//     {
//       question:
//         "Given your URL Shortener project, how would you enhance its backend using Express.js to include user authentication and custom short links, ensuring data validation and robust error handling?",
//       intention:
//         "To probe depth of Node.js/Express.js, API design, error handling, and database interaction.",
//       answer:
//         "Describe designing routes (e.g., /api/shorten, /:shortCode for redirect), using Express.js middleware for parsing and error handling, connecting to MongoDB for storing/retrieving links, and implementing validation for input URLs. Mention using `async/await` for database operations and proper HTTP status codes.",
//     },
//     {
//       question:
//         "What are the primary advantages of using Next.js for a production-ready web application compared to a traditional Create React App setup? Provide specific use cases.",
//       intention:
//         "To assess understanding of Next.js features, performance optimization, and architectural choices.",
//       answer:
//         "Discuss benefits like Server-Side Rendering (SSR) for initial page load performance and SEO, Static Site Generation (SSG) for highly performant static content, automatic code splitting, optimized image loading, and built-in API routes. Contrast with client-side rendering challenges in plain React.",
//     },
//     {
//       question:
//         "Explain different types of indexes in MongoDB and when you would choose to use each type. How do indexes impact read and write performance?",
//       intention:
//         "To assess database optimization knowledge and understanding of performance implications.",
//       answer:
//         "Discuss common types (e.g., single-field, compound, multikey, text, geospatial), how they improve query performance by reducing scan time, and their trade-offs (e.g., increased write overhead, memory usage). Give examples of when to use each.",
//     },
//     {
//       question:
//         "Describe the process of user authentication in a MERN stack application using JSON Web Tokens (JWTs). What are the security considerations and best practices you would follow?",
//       intention:
//         "To assess knowledge of authentication mechanisms and security best practices in web applications.",
//       answer:
//         "Describe a common flow: user registration/login, server generates JWT, sends to client. Client stores JWT (e.g., in `localStorage`/`httpOnly` cookie) and sends it with subsequent requests. Server validates JWT. Discuss pros (stateless, scalability) and cons (security of storage, token invalidation) of JWTs.",
//     },
//     {
//       question:
//         "Given your interest in Generative AI, how do you envision integrating AI-powered capabilities into a MERN stack web application? What technical challenges might you anticipate?",
//       intention:
//         "To probe interest in Generative AI, creative problem-solving, and foresight regarding new technologies.",
//       answer:
//         "Discuss potential use cases like AI-powered content generation for blogs, personalized recommendations, intelligent chatbots, or dynamic image/video creation. Challenges could include API integration complexity, latency, cost, data privacy, and managing AI model updates.",
//     },
//   ],
//   BehaviouralQuestions: [
//     {
//       question:
//         "Tell me about a time you faced a significant technical challenge in one of your projects. How did you approach it, and what was the outcome?",
//       intention:
//         "To assess problem-solving skills, resilience, and ability to learn from challenges.",
//       answer:
//         "Use the STAR method: Describe a Situation (e.g., a bug in the URL shortener backend or a challenge during a hackathon), the Task you had to complete, the Actions you took (e.g., debugging steps, research, collaboration), and the Result or outcome, including what you learned.",
//     },
//     {
//       question:
//         "You mentioned 'basic' Node.js skills in your resume. How do you plan to strengthen your proficiency in Node.js and other backend technologies relevant to a full-stack role?",
//       intention:
//         "To gauge self-awareness, growth mindset, and initiative in overcoming skill gaps.",
//       answer:
//         "Acknowledge the gap and demonstrate proactive learning. For example, explain how you are actively studying Node.js/Express.js documentation, building small projects, or following online courses. Emphasize your continuous learning mindset and eagerness to quickly ramp up in required technologies.",
//     },
//     {
//       question:
//         "Describe a situation where you had to work effectively within a team, especially during a high-pressure environment like a hackathon. What was your role, and what did you learn about collaboration?",
//       intention:
//         "To evaluate teamwork, communication skills, and ability to collaborate effectively in a development environment.",
//       answer:
//         "Describe a specific instance, perhaps from a hackathon, highlighting your role (e.g., frontend lead, backend contributor). Explain how you communicated with teammates, resolved conflicts, contributed to a shared goal, and learned from the collaborative process. Focus on active listening and constructive feedback.",
//     },
//     {
//       question:
//         "Given your interest in Generative AI and other emerging technologies, how do you stay updated with new developments and trends in the tech industry?",
//       intention:
//         "To assess your curiosity, initiative, and commitment to continuous learning in a rapidly evolving tech landscape.",
//       answer:
//         "Explain your process for staying current, such as following industry blogs, attending webinars, contributing to open-source projects, or taking online courses. Specifically mention how you are exploring Generative AI (e.g., experimenting with APIs, reading research papers).",
//     },
//   ],
//   SkillGaps: [
//     { skill: "Node.js/Express.js Depth", severity: "medium" },
//     { skill: "Web Application Deployment & CI/CD", severity: "medium" },
//     { skill: "Formal Object-Oriented Programming (OOP) Application", severity: "low" },
//   ],
//   PreparationPlan: [
//     {
//       day: 1,
//       focus: "MERN Stack Fundamentals & JavaScript Deep Dive",
//       tasks: [
//         "Review core concepts of MongoDB, Express.js, React.js, and Node.js.",
//         "Brush up on advanced JavaScript features (ES6+, async/await, promises).",
//         "Understand the typical data flow and interaction between MERN stack components.",
//         "Practice implementing basic CRUD operations using all four parts of MERN.",
//       ],
//     },
//     {
//       day: 2,
//       focus: "Node.js & Express.js for Backend Development",
//       tasks: [
//         "Focus on building robust RESTful APIs with Express.js, including routing, middleware, and error handling.",
//         "Implement data validation (e.g., using Joi or Express-validator) and explore authentication strategies (JWTs, session-based).",
//         "Practice integrating MongoDB with Mongoose to perform complex queries and data modeling.",
//       ],
//     },
//     {
//       day: 3,
//       focus: "React & Next.js for Frontend Excellence",
//       tasks: [
//         "Review advanced React concepts: Hooks, Context API, state management (e.g., Redux basics, Zustand).",
//         "Deep dive into Next.js features: Server-Side Rendering (SSR), Static Site Generation (SSG), API routes, and data fetching strategies.",
//         "Practice building complex, responsive UIs using Tailwind CSS and component libraries if applicable.",
//       ],
//     },
//     {
//       day: 4,
//       focus: "Database Design, System Architecture & Deployment",
//       tasks: [
//         "Understand best practices for MongoDB schema design, indexing, and query optimization.",
//         "Learn about basic system design principles for scalable web applications.",
//         "Research common deployment strategies for MERN applications (e.g., Vercel, Netlify, Heroku, AWS EC2/Render) and CI/CD basics.",
//       ],
//     },
//     {
//       day: 5,
//       focus: "Behavioral Questions & Project Review",
//       tasks: [
//         "Prepare answers to common behavioral questions using the STAR method.",
//         "Thoroughly review all past projects, focusing on technical decisions, challenges faced, and lessons learned.",
//         "Formulate intelligent questions to ask the interviewer about the role, team, and company culture.",
//       ],
//     },
//     {
//       day: 6,
//       focus: "Generative AI Integration & Problem Solving",
//       tasks: [
//         "Research practical applications of Generative AI in web development and current trends.",
//         "Think about how you would integrate a third-party AI API into a MERN application (e.g., for content generation, image processing).",
//         "Practice problem-solving for common algorithmic questions (e.g., LeetCode mediums related to data structures).",
//         "Consider edge cases and error handling in your technical solutions.",
//       ],
//     },
//     {
//       day: 7,
//       focus: "Mock Interview & Final Review",
//       tasks: [
//         "Conduct a full mock interview (both technical and behavioral) with a peer or mentor.",
//         "Review all prepared answers and technical concepts one last time.",
//         "Ensure your environment is set up for any coding challenges (IDE, specific tools).",
//         "Get adequate rest and mentally prepare for the interview.",
//       ],
//     },
//   ],
// };

const severityStyles = {
  high: "border-red-500/40 bg-red-500/10 text-red-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  low: "border-slate-500/40 bg-slate-500/10 text-slate-300",
};

const Interview = () => {
  const { report, fetchReportById, loading } = useInterview();
  const { id: interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      fetchReportById(interviewId);
    }
  }, [interviewId]);

  if (!report) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0a0e1b] text-white">Loading...</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e1b] text-white">
        <p className="text-lg font-semibold">Fetching your interview strategy...</p>
      </div>
    );
  }

  const [techOpen, setTechOpen] = useState(true);
  const [behavOpen, setBehavOpen] = useState(true);
  const [roadmapOpen, setRoadmapOpen] = useState(true);


  return (
    <div className="flex min-h-screen bg-[#0a0e1b] text-white">
      {/* Left sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#080c16] lg:flex xl:w-72">
        <div className="border-b border-white/5 px-6 py-6">
          <p className="font-semibold text-white">
            {/* /**
            @name
            @description - Name of the person Who logged in
             */ }
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
            {[
              { label: "Technical questions", icon: "help",active: true, href: "#" },
              { label: "Behavioral questions", icon: "chat", href: "#" },
              { label: "Road Map", icon: "map", href: "#" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    item.active
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

          <div className="mt-auto space-y-1 pt-6">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-orange-400/80 hover:bg-white/5"
            >
              <NavIcon type="logout" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/5 bg-[#0a0e1b]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <span className="shrink-0 text-lg font-bold tracking-tight lg:hidden">ProCareer</span>
          <span className="hidden shrink-0 text-lg font-bold tracking-tight lg:block xl:hidden">
            ProCareer
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
              placeholder="Search strategy resources..."
              className="w-full rounded-full border border-white/10 bg-[#111827] py-2.5 pl-11 pr-4 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <IconButton label="Notifications">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </IconButton>
            <IconButton label="Messages">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </IconButton>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold">
              MM
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col xl:flex-row">
          {/* Center content */}
          <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {/* Roadmap moved below behavioral questions */}

            {/* Technical questions */}
            <section id="technical-questions" className="mt-5 border-t border-white/5 pt-5">
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
                    <QuestionCard key={item.question} index={i + 1} {...item} accent="blue" />
                  ))}
                </div>
              )}
            </section>

            {/* Behavioral questions */}
            <section id="behavioral-questions" className=" mt-5 border-t border-white/5 pt-5 ">
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
                    <QuestionCard key={item.question} index={i + 1} {...item} accent="violet" />
                  ))}
                </div>
              )}
            </section>

            {/* Roadmap section (moved) */}
            <section id="roadmap">
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
                                Phase {phase.day}: {phase.focus}
                              </h2>
                            </div>

                            {(
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {phase.tasks.slice(0, 2).map((task) => (
                                  <div key={task} className="rounded-xl border border-white/10 bg-[#111827] p-4">
                                    <p className="line-clamp-2 text-sm font-medium text-slate-200">
                                      {task.split(".")[0]}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{task}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(
                              <div className="rounded-xl border border-blue-500/20 bg-[#111827] p-5">
                                <p className="text-sm font-medium text-slate-200">{phase.focus}</p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500">{phase.tasks[0]}</p>
                              </div>
                            )}

                            {(
                              <div className="rounded-xl border border-white/5 bg-[#111827]/50 p-4 opacity-70">
                                <ul className="space-y-2">
                                  {phase.tasks.map((task) => (
                                    <li key={task} className="flex gap-2 text-xs text-slate-500">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                                      {task}
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
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${severityStyles[severity]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-[#111827] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Analysis
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Your profile shows strong frontend and MERN fundamentals. Focus on deepening
                  Node.js/Express.js patterns and deployment workflows to close remaining gaps
                  before your interview.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-blue-400/50 py-2 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-500/10"
                >
                  View Study Plan
                </button>
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

function QuestionCard({ index, question, intention, answer, accent }) {
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
              {question}
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
              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{intention}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-[#0a0e1b] p-3 sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                Suggested Answer
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">{answer}</p>
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
