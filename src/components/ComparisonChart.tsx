import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureComparison {
  feature: string;
  mindphase: boolean;
  chatgpt: boolean;
  replika: boolean;
  woebot: boolean;
  clue: boolean;
}

const comparisonData: FeatureComparison[] = [
  { feature: 'Empathetic Responses', mindphase: true, chatgpt: false, replika: true, woebot: true, clue: false },
  { feature: 'Multilingual (Malayalam/Hindi)', mindphase: true, chatgpt: false, replika: false, woebot: false, clue: false },
  { feature: 'Period Tracking', mindphase: true, chatgpt: false, replika: false, woebot: false, clue: true },
  { feature: 'Mood Journaling', mindphase: true, chatgpt: false, replika: true, woebot: true, clue: true },
  { feature: 'Mental Health Exercises', mindphase: true, chatgpt: false, replika: false, woebot: true, clue: false },
  { feature: 'Conversation History', mindphase: true, chatgpt: true, replika: true, woebot: false, clue: false },
  { feature: 'Message Editing', mindphase: true, chatgpt: true, replika: false, woebot: false, clue: false },
  { feature: 'Goodbye Flow Control', mindphase: true, chatgpt: false, replika: false, woebot: false, clue: false },
  { feature: 'Crisis Support Links', mindphase: true, chatgpt: false, replika: false, woebot: true, clue: false },
  { feature: 'Free & Privacy-First', mindphase: true, chatgpt: false, replika: false, woebot: false, clue: false },
  { feature: 'Women\'s Health Focus', mindphase: true, chatgpt: false, replika: false, woebot: false, clue: true },
  { feature: 'Personalized Profiles', mindphase: true, chatgpt: false, replika: true, woebot: false, clue: true },
];

const competitors = [
  { key: 'mindphase', name: 'MindPhase-M', highlight: true },
  { key: 'chatgpt', name: 'ChatGPT', highlight: false },
  { key: 'replika', name: 'Replika', highlight: false },
  { key: 'woebot', name: 'Woebot', highlight: false },
  { key: 'clue', name: 'Clue/Flo', highlight: false },
];

export function ComparisonChart() {
  const getScore = (key: string) => {
    return comparisonData.filter(d => d[key as keyof FeatureComparison] === true).length;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-gradient-to-br from-background to-muted/30 border-2">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Feature Comparison Chart
        </CardTitle>
        <p className="text-muted-foreground text-sm">MindPhase-M vs Existing Chatbots</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 border-b-2 border-border font-semibold text-foreground">
                Features
              </th>
              {competitors.map((comp) => (
                <th 
                  key={comp.key} 
                  className={`text-center p-3 border-b-2 border-border font-semibold min-w-[100px] ${
                    comp.highlight 
                      ? 'bg-gradient-to-b from-pink-500/20 to-purple-600/20 text-pink-600 dark:text-pink-400' 
                      : 'text-foreground'
                  }`}
                >
                  {comp.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => (
              <tr 
                key={row.feature} 
                className={idx % 2 === 0 ? 'bg-muted/30' : 'bg-background'}
              >
                <td className="p-3 border-b border-border/50 font-medium text-foreground">
                  {row.feature}
                </td>
                {competitors.map((comp) => {
                  const hasFeature = row[comp.key as keyof FeatureComparison] as boolean;
                  return (
                    <td 
                      key={comp.key} 
                      className={`text-center p-3 border-b border-border/50 ${
                        comp.highlight ? 'bg-gradient-to-b from-pink-500/10 to-purple-600/10' : ''
                      }`}
                    >
                      {hasFeature ? (
                        <Check className="w-6 h-6 mx-auto text-green-500" strokeWidth={3} />
                      ) : (
                        <X className="w-6 h-6 mx-auto text-red-400" strokeWidth={3} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-bold">
              <td className="p-3 border-t-2 border-border text-foreground">
                Total Score
              </td>
              {competitors.map((comp) => (
                <td 
                  key={comp.key} 
                  className={`text-center p-3 border-t-2 border-border ${
                    comp.highlight 
                      ? 'bg-gradient-to-b from-pink-500/20 to-purple-600/20 text-pink-600 dark:text-pink-400 text-xl' 
                      : 'text-foreground'
                  }`}
                >
                  {getScore(comp.key)}/12
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
        
        <div className="mt-6 flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
            <span className="text-muted-foreground">Feature Available</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-400" strokeWidth={3} />
            <span className="text-muted-foreground">Not Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
