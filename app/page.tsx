"use client"

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import About from '@/components/About'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-navy-900">
      <Header />
      <Hero />
      <About />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
