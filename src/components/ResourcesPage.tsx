import { motion } from 'framer-motion';
import { ArrowLeft, Phone, BookOpen, Lightbulb, ExternalLink, Heart, Shield, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

interface ResourcesPageProps {
  onBack: () => void;
}

const CRISIS_HOTLINES = [
  {
    country: 'India',
    name: 'iCall',
    number: '9152987821',
    description: 'Mental health support',
  },
  {
    country: 'India',
    name: 'Vandrevala Foundation',
    number: '1860-2662-345',
    description: '24/7 mental health helpline',
  },
  {
    country: 'India',
    name: 'NIMHANS',
    number: '080-46110007',
    description: 'National mental health support',
  },
  {
    country: 'USA',
    name: 'National Suicide Prevention',
    number: '988',
    description: '24/7 crisis support',
  },
  {
    country: 'UK',
    name: 'Samaritans',
    number: '116 123',
    description: 'Emotional support',
  },
  {
    country: 'International',
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Text-based crisis support',
  },
];

const SELF_HELP_TIPS = [
  {
    icon: '🧘',
    title: 'Practice Mindfulness',
    description: 'Take 5 minutes daily to focus on your breath. Notice thoughts without judgment and let them pass.',
  },
  {
    icon: '🌙',
    title: 'Prioritize Sleep',
    description: 'Aim for 7-9 hours of sleep. Create a calming bedtime routine and limit screens before bed.',
  },
  {
    icon: '🏃',
    title: 'Move Your Body',
    description: 'Even a 10-minute walk can boost your mood. Find movement that feels good to you.',
  },
  {
    icon: '📝',
    title: 'Journal Your Thoughts',
    description: 'Write down your feelings without censoring. It helps process emotions and identify patterns.',
  },
  {
    icon: '🤝',
    title: 'Stay Connected',
    description: 'Reach out to someone you trust. Social connection is vital for mental wellbeing.',
  },
  {
    icon: '🌿',
    title: 'Limit Social Media',
    description: 'Take breaks from social media. Compare yourself less and focus on your own journey.',
  },
  {
    icon: '💧',
    title: 'Stay Hydrated',
    description: 'Dehydration affects mood and cognition. Drink water regularly throughout the day.',
  },
  {
    icon: '🎵',
    title: 'Use Music Therapy',
    description: 'Listen to calming music or songs that uplift you. Music can shift your emotional state.',
  },
];

const ARTICLES = [
  {
    title: 'Understanding Anxiety',
    description: 'Learn about anxiety symptoms, triggers, and coping strategies.',
    icon: Brain,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Managing Depression',
    description: 'Practical steps for dealing with depression and when to seek help.',
    icon: Heart,
    color: 'bg-rose-100 text-rose-700',
  },
  {
    title: 'Building Resilience',
    description: 'How to develop mental strength and bounce back from challenges.',
    icon: Shield,
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Self-Care Basics',
    description: 'Essential self-care practices for maintaining mental wellness.',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-700',
  },
];

export function ResourcesPage({ onBack }: ResourcesPageProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-blue-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">{t('resources.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('resources.subtitle')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Crisis Hotlines */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-lg">{t('resources.crisisHotlines')}</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-red-800">
              <strong>{t('resources.emergency')}</strong> {t('resources.emergencyText')}
            </p>
          </div>
          <div className="grid gap-3">
            {CRISIS_HOTLINES.map((hotline, index) => (
              <motion.a
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                href={`tel:${hotline.number.replace(/\s/g, '')}`}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{hotline.country}</span>
                    <span className="font-medium">{hotline.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{hotline.description}</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Phone className="w-4 h-4" />
                  {hotline.number}
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Self-Help Tips */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-lg">{t('resources.selfHelpTips')}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {SELF_HELP_TIPS.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-card rounded-xl border border-border"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-medium text-sm">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-lg">{t('resources.articles')}</h2>
          </div>
          <div className="grid gap-3">
            {ARTICLES.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className={`p-3 rounded-xl ${article.color}`}>
                  <article.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-muted/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {t('resources.disclaimer')}
          </p>
        </section>
      </div>
    </motion.div>
  );
}
