import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/useTranslation';

interface GoodbyeDialogProps {
  open: boolean;
  onContinue: () => void;
  onExit: () => void;
}

export function GoodbyeDialog({ open, onContinue, onExit }: GoodbyeDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">
            {t('goodbye.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            {t('goodbye.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-3 justify-center sm:justify-center">
          <AlertDialogCancel 
            onClick={onExit}
            className="mt-0"
          >
            {t('goodbye.no')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>
            {t('goodbye.yes')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
