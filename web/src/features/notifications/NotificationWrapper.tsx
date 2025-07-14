import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'sonner';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import { cn } from '@/lib/utils';

const Notifications: React.FC = () => {
  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const duration = data.duration || 3000;
    let position = data.position || 'top-right';

    // Backwards compat
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    // Auto-assign icons based on type
    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    const iconColor =
      data.iconColor ||
      (() => {
        switch (data.type) {
          case 'error':
            return 'text-red-500';
          case 'success':
            return 'text-green-500';
          case 'warning':
            return 'text-yellow-500';
          default:
            return 'text-blue-500';
        }
      })();

    const content = (
      <div className="flex items-start gap-3 min-w-0">
        {data.icon && (
          <div className={cn('flex-shrink-0 mt-0.5', iconColor)}>
            <LibIcon icon={data.icon} fixedWidth animation={data.iconAnimation} className="w-4 h-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {data.title && <div className="font-medium text-sm leading-tight">{data.title}</div>}
          {data.description && (
            <div className={cn('text-xs text-muted-foreground leading-tight', !data.title && 'text-sm')}>
              <ReactMarkdown components={MarkdownComponents}>{data.description}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    );

    toast.custom(
      (t) => (
        <div
          className={cn(
            'bg-background border border-border rounded-lg shadow-lg p-3 w-80',
            'animate-in slide-in-from-top-2 duration-200',
            data.style as any
          )}
        >
          {content}
        </div>
      ),
      {
        id: data.id?.toString(),
        duration,
        position: position as any,
      }
    );
  });

  return (
    <Toaster
      richColors={false}
      closeButton={false}
      toastOptions={{
        className: 'bg-transparent border-none shadow-none p-0',
      }}
    />
  );
};

export default Notifications;
