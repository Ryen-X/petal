'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error logging in with Google:', error.message)
    }
  }

  const handleAnonymousLogin = async () => {
    const { error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('Error with anonymous login:', error.message)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="p-8 space-y-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mx-auto animate-in fade-in slide-in-from-top duration-700">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-emerald-300 font-medium">
              Secure Authentication
            </span>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight animate-in fade-in slide-in-from-top duration-700 delay-100">
              Welcome to PETAL
            </h1>
            <p className="text-lg text-slate-300 animate-in fade-in slide-in-from-top duration-700 delay-200">
              Track and explore global plant bloom events
            </p>
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-top duration-700 delay-300">
            <Button
              className="w-full group px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center space-x-2"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 text-white rounded-lg font-semibold hover:bg-slate-600/50 hover:text-white transition-all duration-200 backdrop-blur-sm"
              onClick={handleAnonymousLogin}
            >
              Continue Anonymously
            </Button>
          </div>

          <p className="text-sm text-center text-slate-400 animate-in fade-in slide-in-from-top duration-700 delay-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>
    </div>
  )
}
