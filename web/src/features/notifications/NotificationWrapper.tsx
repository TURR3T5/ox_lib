import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'sonner';
import ReactMarkdown from 'react-markdown';
import React, { useEffect, useState } from 'react';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import { cn } from '@/lib/utils';

const NotificationContent: React.FC<{
  data: NotificationProps;
  duration: number;
  toastId: string | number;
}> = ({ data, duration, toastId }) => {
  const [progress, setProgress] = useState(100);
  const [remainingTime, setRemainingTime] = useState(Math.ceil(duration / 1000));

  useEffect(() => {
    if (!data.showDuration) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.max(0, prev - 100 / (duration / 100));
        return newProgress;
      });

      setRemainingTime((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [duration, data.showDuration]);

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

  const progressColor = (() => {
    switch (data.type) {
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-primary';
    }
  })();

  return (
    <div
      className={cn(
        'gaming-card rounded-lg p-4 w-80 border-l-4 relative overflow-hidden -skew-x-1',
        borderColor,
        data.style as any
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {data.icon && (
          <div className={cn('flex-shrink-0 w-5 h-5 flex items-center justify-center', iconColor)}>
            <LibIcon icon={data.icon} fixedWidth animation={data.iconAnimation} className="w-5 h-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {data.title && (
                <div className="font-bold text-sm leading-tight text-white uppercase tracking-wider mb-1">
                  {data.title}
                </div>
              )}
              {data.description && (
                <div className={cn('text-xs text-muted-foreground leading-tight', !data.title && 'text-sm')}>
                  <ReactMarkdown components={MarkdownComponents}>{data.description}</ReactMarkdown>
                </div>
              )}
            </div>

            {data.showDuration && (
              <div className="flex-shrink-0 ml-3 text-right">
                <div className="text-xs font-bold text-muted-foreground">{Math.ceil(remainingTime)}s</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {data.showDuration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className={cn('h-full transition-all duration-75 ease-linear', progressColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

const Notifications: React.FC = () => {
  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const duration = data.duration || 3000;
    let position = data.position || 'top-right';

    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'top-center':
        position = 'top-center';
        break;
      case 'top-right':
        position = 'top-right';
        break;
      case 'top-left':
        position = 'top-left';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
      case 'bottom-center':
        position = 'bottom-center';
        break;
      case 'bottom-right':
        position = 'bottom-right';
        break;
      case 'bottom-left':
        position = 'bottom-left';
        break;
      case 'center-right':
        position = 'top-right';
        break;
      case 'center-left':
        position = 'top-left';
        break;
      default:
        position = 'top-right';
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

    toast.custom((t) => <NotificationContent data={data} duration={duration} toastId={t} />, {
      id: data.id?.toString(),
      duration,
      position: position as any,
    });
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
