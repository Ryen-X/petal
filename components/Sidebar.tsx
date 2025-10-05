"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, BarChart2, Settings } from 'lucide-react'

const navItems = [
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/forecast', icon: BarChart2, label: 'Forecast' },
  { href: '/contribute', icon: Settings, label: 'Contribute' },
]

export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const pathname = usePathname()

  return (
    <aside
      className={`hidden sm:flex flex-col bg-slate-900/70 backdrop-blur-lg border-r border-slate-700/50 transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-center h-20 border-b border-slate-700/50">
        <h1 className={`text-2xl font-bold text-white ${!isSidebarOpen && 'hidden'}`}>
          PETAL
        </h1>
        <Map className={`w-8 h-8 text-emerald-400 ${isSidebarOpen && 'hidden'}`} />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-emerald-500/10 text-emerald-300'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            } ${!isSidebarOpen && 'justify-center'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className={`ml-4 ${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
