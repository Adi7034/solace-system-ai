import { ComparisonChart } from '@/components/ComparisonChart';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Comparison() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App
        </Button>
        
        <ComparisonChart />
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            * Comparison based on free tier features as of 2025
          </p>
        </div>
      </div>
    </div>
  );
}
