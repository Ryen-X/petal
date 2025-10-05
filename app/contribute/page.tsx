// app/contribute/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Menu } from "lucide-react";

// Dynamic-import client-only components so server build won't try to import them
const ContributeClient = dynamic(() => import("./ContributeClient"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });

export default function ContributePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <div className="hidden sm:flex">
        <Sidebar isSidebarOpen={true} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700/50 z-[1001] transform transition-transform duration-300 sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isSidebarOpen={true} />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-white"
          aria-label="Close sidebar"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sm:hidden">
          <h1 className="text-2xl font-bold text-white">PETAL</h1>
          <button onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto pb-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="relative z-10 w-full max-w-md">
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight text-center">Contribute Data</h1>
            <p className="text-lg text-slate-300 mb-8 text-center">
              Share your observations to help track plant blooms. We suggest you to enter approximate coordinates only.
            </p>

            {/* Client component loaded only on client */}
            <ContributeClient />
          </div>
        </main>
      </div>

      {/* Bottom navigation (client-only via dynamic import) */}
      <BottomNav />
    </div>
  );
}
