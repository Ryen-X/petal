import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
}

const FAQItem = React.memo(({ 
  faq, 
  isOpen, 
  onToggle 
}: { 
  faq: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => (
  <div
    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm hover:border-slate-600 transition-colors"
  >
    <button
      onClick={onToggle}
      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
    >
      <span className="text-lg font-semibold text-white pr-8">
        {faq.question}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    
    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}
    >
      <div className="px-6 pb-5 text-slate-300 leading-relaxed">
        {faq.answer}
      </div>
    </div>
  </div>
));

FAQItem.displayName = 'FAQItem';

export default function FAQ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about PETAL",
  faqs = [
    {
      question: "What is PETAL and how does it work?",
      answer: "PETAL (Plant Ecology Tracking & Analytics Labs) is a comprehensive platform that combines satellite data from NASA, NOAA, and other providers with AI-powered analytics and community observations. We process millions of data points daily to track plant blooms, species migrations, and ecological changes across the globe. Our machine learning models analyze patterns and predict future events, while our community of citizen scientists helps validate and enrich our dataset."
    },
    {
      question: "Is PETAL free to use?",
      answer: "Yes! PETAL is completely free to use. We provide access to our interactive globe, bloom tracking, community, and social features. We aim to make plant ecology data accessible to everyone, regardless of their background or resources. From students to researchers, from local communities to global ecologists, PETAL is here to help you explore, learn, and contribute to the understanding of plant ecosystems."
    },
    {
      question: "Can I contribute my own observations?",
      answer: "Absolutely! Community contributions are essential to PETAL. You can upload photos with GPS coordinates, identify species you've observed, and validate predictions in your area. All contributions are reviewed by our automated systems and community moderators to ensure data quality. Top contributors earn badges, appear on leaderboards, and gain early access to new features."
    },
    {
      question: "What satellite data sources does PETAL use?",
      answer: "We integrate data from multiple sources including NASA's Landsat and MODIS satellites, NOAA weather satellites, and several providers. We process data across multiple spectral bands to assess plant health, biomass, chlorophyll levels, and environmental conditions. Data is updated continuously as new satellite passes occur."
    },
    {
      question: "Is my location data private?",
      answer: "Privacy is a top priority. You have complete control over your data: you can contribute observations anonymously, choose which data to share publicly, and delete your contributions at any time. We never sell user data, and all location information is encrypted. You can review our detailed privacy policy to understand exactly how we handle your information."
    },
    {
      question: "What species and regions does PETAL cover?",
      answer: "PETAL provides global coverage with data for over 150 tracked plant species, including wildflowers, crops, trees, and aquatic plants. Coverage is most comprehensive in North America, Europe, and parts of Asia and Australia, but we're continuously expanding to other regions. If you have specific species or regions of interest, you can request them through our community forum."
    }
  ]
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  const memoizedFaqs = useMemo(() => faqs, [faqs]);

  return (
    <section id="faq" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-300">
            {subtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {memoizedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={isOpen}
                onToggle={() => toggleFAQ(index)}
              />
            );
          })}
        </div>

        {/* Contact Card */}
        <div className="mt-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-300 mb-6">
            Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={"https://linkedin.com/in/aaryan-codes/"}>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/50">
              Contact Support
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
