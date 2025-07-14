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

    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

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
            return 'text-red-400';
          case 'success':
            return 'text-green-400';
          case 'warning':
            return 'text-yellow-400';
          default:
            return 'text-primary';
        }
      })();

    const borderColor = (() => {
      switch (data.type) {
        case 'error':
          return 'border-red-500/30';
        case 'success':
          return 'border-green-500/30';
        case 'warning':
          return 'border-yellow-500/30';
        default:
          return 'border-primary/30';
      }
    })();

    const content = (
      <div className="flex items-start gap-3 min-w-0">
        {data.icon && (
          <div className={cn('flex-shrink-0 mt-0.5', iconColor)}>
            <LibIcon icon={data.icon} fixedWidth animation={data.iconAnimation} className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {data.title && (
            <div className="font-bold text-sm leading-tight text-white uppercase tracking-wider mb-1">{data.title}</div>
          )}
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
            'gaming-card rounded-lg p-4 w-80 border-l-4 relative overflow-hidden',
            borderColor,
            data.style as any
          )}
          style={{ transform: 'skewX(-1deg)' }}
        >
          {content}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
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
      expand={true}
      visibleToasts={10}
      toastOptions={{
        className: 'bg-transparent border-none shadow-none p-0',
      }}
    />
  );
};

export default Notifications;
