import React, { useMemo } from 'react';
import { Satellite, Brain, Users, TrendingUp } from 'lucide-react';

interface AboutProps {
  title?: string;
  description?: string;
}

const PillarItem = React.memo(({ pillar }: { pillar: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; description: string; color: string } }) => {
  const Icon = pillar.icon;
  return (
    <div
      className="group bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 backdrop-blur-sm"
    >
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${pillar.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        {pillar.title}
      </h3>
      <p className="text-slate-300 leading-relaxed">
        {pillar.description}
      </p>
    </div>
  );
});

PillarItem.displayName = 'PillarItem';

export default function About({
  title = "Plant Ecology Tracking & Analytics Labs",
  description = "PETAL is a revolutionary platform that combines cutting-edge satellite technology, artificial intelligence, and community-driven science to provide unprecedented insights into Earth's plant ecosystems."
}: AboutProps) {
  const pillars = useMemo(() => [
    {
      icon: Satellite,
      title: "Satellite Integration",
      description: "Real-time data from NASA, ESA, and other space agencies providing global coverage of plant health, bloom cycles, and environmental changes.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI Forecasting",
      description: "Machine learning models predict bloom seasons, species migrations, and ecosystem shifts with unprecedented accuracy.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Community Science",
      description: "Thousands of citizen scientists contribute observations, validating data and discovering patterns that algorithms might miss.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Comprehensive tools for researchers, conservationists, and policymakers to understand and respond to ecological changes.",
      color: "from-orange-500 to-red-500"
    }
  ], []);

  return (
    <section id="about" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{title}</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 md:p-12 mb-16 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed">
                To democratize access to Earth observation data and empower everyone, from researchers to curious citizens, to understand, protect, and celebrate our planet&apos;s incredible plant diversity. We believe that by making ecological data accessible and actionable, we can drive meaningful conservation efforts and foster a deeper connection with nature.
              </p>
            </div>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <PillarItem key={index} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
