import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const ContextButton: React.FC<{
  option: [string, Option];
  isLast?: boolean;
}> = ({ option, isLast }) => {
  const button = option[1];
  const buttonKey = option[0];

  const handleClick = () => {
    if (button.disabled || button.readOnly) return;

    if (button.menu) {
      openMenu(button.menu);
    } else {
      clickContext(buttonKey);
    }
  };

  const hasMetadataToShow = button.metadata || button.image;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            'w-full p-4 cursor-pointer transition-all duration-300 border-b border-border/50',
            'hover:bg-primary/10 hover:border-primary/50 hover:shadow-lg',
            isLast && 'border-b-0',
            button.readOnly && 'hover:bg-transparent cursor-default',
            button.disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={handleClick}
        >
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex flex-col min-w-0 flex-1 gap-2">
              {(button.title || Number.isNaN(+buttonKey)) && (
                <div className="flex items-center gap-3">
                  {button?.icon && (
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                      {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                        <img src={button.icon} className="w-6 h-6 object-contain" alt="icon" />
                      ) : (
                        <LibIcon
                          icon={button.icon as IconProp}
                          fixedWidth
                          className="w-5 h-5 text-primary"
                          style={{ color: button.iconColor }}
                          animation={button.iconAnimation}
                        />
                      )}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-white uppercase tracking-wide">
                    <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                  </span>
                </div>
              )}

              {button.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                </p>
              )}

              {button.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={button.progress} className="h-2" />
                </div>
              )}
            </div>

            {(button.menu || button.arrow) && button.arrow !== false && (
              <div className="flex items-center justify-center w-6 h-6 ml-3 flex-shrink-0">
                <LibIcon icon="chevron-right" className="w-4 h-4 text-primary" fixedWidth />
              </div>
            )}
          </div>
        </div>
      </HoverCardTrigger>

      {hasMetadataToShow && (
        <HoverCardContent className="w-80 p-4 gaming-card" side="left" align="start" sideOffset={12}>
          {button.image && (
            <img src={button.image} alt="Preview" className="w-full rounded-lg mb-3 border border-border" />
          )}

          {Array.isArray(button.metadata) ? (
            <div className="space-y-3">
              {button.metadata.map((metadata, index) => (
                <div key={`context-metadata-${index}`}>
                  <p className="text-sm text-muted-foreground">
                    {typeof metadata === 'string' ? metadata : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </p>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress value={metadata.progress} className="h-2 mt-2" />
                  )}
                </div>
              ))}
            </div>
          ) : button.metadata && typeof button.metadata === 'object' ? (
            <div className="space-y-2">
              {Object.entries(button.metadata).map(([key, value], index) => (
                <p key={`context-metadata-${index}`} className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{key}:</span> {value}
                </p>
              ))}
            </div>
          ) : null}
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ContextButton;
