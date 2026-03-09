import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Crown, Rocket } from 'lucide-react';

const tiers = [
  {
    name: 'Nexus 3D Scholar+',
    subtitle: 'The Essentials',
    price: '19',
    color: 'from-blue-500 to-indigo-500',
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    features: [
      {
        title: 'The "Clear Any Concept" Engine',
        desc: 'Access to MIT, Harvard, and IIT-style explanations for any topic.',
      },
      {
        title: 'Unlimited Summaries',
        desc: 'Upload any lecture PDF or YouTube link and get a "Genius Summary" (Key points + Formula Sheets).',
      },
      {
        title: 'Entrance Exam Lite',
        desc: 'Generate 5 custom practice papers per month for exams like JEE, SAT, or GRE.',
      },
      {
        title: 'AI Tutor Chat',
        desc: '24/7 access to an AI that speaks 50+ languages (including Chinese for Gaokao prep).',
      },
    ],
  },
  {
    name: 'Nexus 3D Elite Pro',
    subtitle: 'The Top 1% Tier',
    price: '49',
    color: 'from-purple-500 to-pink-500',
    icon: <Crown className="w-6 h-6 text-purple-400" />,
    popular: true,
    features: [
      {
        title: 'The "Professor Mode"',
        desc: 'Toggle between specific university teaching styles (e.g., Harvard Law vs. IIT Physics).',
      },
      {
        title: 'Advanced Exam Generator',
        desc: 'Unlimited exam papers with Real-time Scoring. Instantly rebuilds papers focusing on weak spots.',
      },
      {
        title: 'Step-by-Step Derivations',
        desc: 'Uses LaTeX to show the beautiful, complex math required for Cambridge or MIT exams.',
      },
      {
        title: 'Earn While You Learn (3% Stack)',
        desc: 'Includes 5 AI-Fulfillment Jobs/month to earn Credits for tuition or subscription.',
      },
    ],
  },
  {
    name: 'Nexus 3D Global Ultra',
    subtitle: 'The "Future Billionaire" Tier',
    price: '99',
    color: 'from-amber-400 to-orange-500',
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
    features: [
      {
        title: 'Priority Research Agent',
        desc: 'A dedicated Antigravity agent that stays updated on ArXiv and alerts you to breakthroughs.',
      },
      {
        title: 'The "Autonomous Degree"',
        desc: 'AI builds a 4-year curriculum based on your goal, schedules study, generates exams, and tracks progress.',
      },
      {
        title: 'Everything in Elite Pro',
        desc: 'Includes all features from the previous tiers with priority processing.',
      },
    ],
  },
];

export default function PricingTiers() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-32 mb-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Unlock Your Full Potential</h2>
        <p className="text-xl text-gray-400">Choose the tier that matches your ambition.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`relative flex flex-col backdrop-blur-xl bg-white/5 border rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
              tier.popular 
                ? 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)]' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10`}>
                {tier.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{tier.subtitle}</p>
              </div>
            </div>

            <div className="my-8">
              <span className="text-5xl font-bold">${tier.price}</span>
              <span className="text-gray-400">/month</span>
            </div>

            <div className="flex-1 space-y-6 mb-8">
              {tier.features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className={`w-6 h-6 shrink-0 bg-clip-text text-transparent bg-gradient-to-br ${tier.color}`} style={{ color: 'inherit' }} />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${
                tier.popular
                  ? `bg-gradient-to-r ${tier.color} text-white hover:opacity-90 shadow-lg`
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
