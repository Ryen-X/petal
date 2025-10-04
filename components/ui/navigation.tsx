'use client'

import { Button } from './button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="fixed w-full z-50 bg-transparent backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              PETAL
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/map" className="text-gray-300 hover:text-white px-3 py-2">
              Global Map
            </Link>
            <Link href="/timeline" className="text-gray-300 hover:text-white px-3 py-2">
              Timeline
            </Link>
            <Link href="/species" className="text-gray-300 hover:text-white px-3 py-2">
              Species
            </Link>
            <Link href="/forecast" className="text-gray-300 hover:text-white px-3 py-2">
              Forecast
            </Link>
            <Link href="/data" className="text-gray-300 hover:text-white px-3 py-2">
              Data
            </Link>
            <Link href="/community" className="text-gray-300 hover:text-white px-3 py-2">
              Community
            </Link>
            <Button
              variant="outline"
              className="ml-4 text-white border-white/20 hover:bg-white/10"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}