"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, BarChart2, Settings } from 'lucide-react'

const navItems = [
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/forecast', icon: BarChart2, label: 'Forecast' },
  { href: '/contribute', icon: Settings, label: 'Contribute' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900/70 backdrop-blur-lg border-t border-slate-700/50 z-[1001]">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
              pathname === item.href
                ? 'text-emerald-300'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
