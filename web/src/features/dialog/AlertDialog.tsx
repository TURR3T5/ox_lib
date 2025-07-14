import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LibIcon from '../../components/LibIcon';

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <Dialog open={opened} onOpenChange={() => closeAlert('cancel')}>
      <DialogContent
        className={`max-w-${dialogData.size || 'md'} ${dialogData.overflow ? 'max-h-[80vh] overflow-y-auto' : ''}`}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-3">
            <LibIcon icon="exclamation-triangle" className="w-6 h-6 text-primary" />
            <ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="text-muted-foreground leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...MarkdownComponents,
                img: ({ ...props }) => (
                  <img className="max-w-full max-h-full rounded-lg border border-border" {...props} />
                ),
              }}
            >
              {dialogData.content}
            </ReactMarkdown>
          </div>
        </DialogDescription>

        <DialogFooter className="gap-3 pt-4">
          {dialogData.cancel && (
            <Button variant="outline" onClick={() => closeAlert('cancel')} className="flex items-center gap-2">
              <LibIcon icon="xmark" className="w-4 h-4" />
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
          )}
          <Button
            variant={dialogData.cancel ? 'default' : 'outline'}
            onClick={() => closeAlert('confirm')}
            className="flex items-center gap-2"
          >
            <LibIcon icon="check" className="w-4 h-4" />
            {dialogData.labels?.confirm || locale.ui.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
