"use client";

import { useState } from "react";
import ForecastClient from "@/app/forecast/ForecastClient";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { Menu } from "lucide-react";

export default function ForecastPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed for mobile

  return (
    <div className="relative min-h-screen flex bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden"> {/* Added overflow-x-hidden here */}
      {/* Sidebar for larger screens */}
      <div className="hidden sm:flex">
        <Sidebar isSidebarOpen={true} /> {/* Always open on desktop */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700/50 z-[1001] transform transition-transform duration-300 sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isSidebarOpen={true} />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sm:hidden">
          <h1 className="text-2xl font-bold text-white">PETAL</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto pb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative z-10 w-full"> {/* Added w-full here */}
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight">Bloom Forecast</h1>
            <ForecastClient />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
