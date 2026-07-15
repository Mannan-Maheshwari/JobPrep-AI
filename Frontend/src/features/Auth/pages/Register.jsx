import React from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../Hooks/useAuth';



const Register = () => {

    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const {loading, handleRegister} = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await handleRegister(username, email, password);
            navigate('/');
        } catch (err) {
            const message = err?.response?.data?.message || "Something went wrong. Please try again.";
            setError(message);
        }
    }

    if (loading) {
        return (
            <main className="flex h-screen items-center justify-center bg-[#05070a] text-white">
                <p className="text-lg font-semibold">Creating your account...</p>
            </main>
        );
    } 

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-violet-500/30">
      {/* subtle radial glow — matches Home */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.18),transparent)]"
      />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Logo lockup — matches Home header */}
          <div className="mb-8 flex items-center justify-center gap-2.5">
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

          <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-xl shadow-black/20 sm:p-8">
            <h1 className="text-2xl font-bold sm:text-3xl">
                Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
                Start building your interview strategy.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>  
                    <label htmlFor="Username" className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.15em] text-white/50 sm:text-sm">
                        Username
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        id="Username"
                        name="Username"
                        placeholder="Enter username"
                        className="h-11 w-full rounded-xl border border-white/10 bg-[#080b10] px-4 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 sm:text-base"
                    />
                </div>
                <div>  
                    <label htmlFor="email" className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.15em] text-white/50 sm:text-sm">
                        Email
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email address"
                        className="h-11 w-full rounded-xl border border-white/10 bg-[#080b10] px-4 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 sm:text-base"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.15em] text-white/50 sm:text-sm">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        className="h-11 w-full rounded-xl border border-white/10 bg-[#080b10] px-4 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 sm:text-base"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0d1117] sm:py-4 sm:text-base"
                >
                    Register
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
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account? <Link to="/login" className="font-medium text-violet-400 transition-colors hover:text-violet-300">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register