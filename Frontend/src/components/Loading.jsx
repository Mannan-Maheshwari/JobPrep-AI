import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05070a] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.18),transparent)]"
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-500 border-r-indigo-500" />
        </div>

        <p className="text-sm font-medium text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default Loading;