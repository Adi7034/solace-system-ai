import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Language, useTranslation } from '@/hooks/useTranslation';

const languages: { value: Language; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { value: 'hi', label: 'Hindi', native: 'हिंदी' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">
            {languages.find(l => l.value === language)?.native}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={language === lang.value ? 'bg-muted' : ''}
          >
            <span className="mr-2">{lang.native}</span>
            <span className="text-muted-foreground text-xs">({lang.label})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
