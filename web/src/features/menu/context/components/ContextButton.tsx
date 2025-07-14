import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';
import { Button } from '@/components/ui/button';
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
}> = ({ option }) => {
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
        <Button
          variant="outline"
          className={cn(
            'w-full h-auto p-3 justify-start text-left',
            button.readOnly && 'hover:bg-background active:transform-none cursor-default',
            button.disabled && 'opacity-50'
          )}
          onClick={handleClick}
          disabled={button.disabled}
        >
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex flex-col min-w-0 flex-1 gap-1">
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
                          className="w-4 h-4"
                          style={{ color: button.iconColor }}
                          animation={button.iconAnimation}
                        />
                      )}
                    </div>
                  )}
                  <span className="text-sm font-medium break-words">
                    <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                  </span>
                </div>
              )}

              {button.description && (
                <p className="text-xs text-muted-foreground">
                  <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                </p>
              )}

              {button.progress !== undefined && <Progress value={button.progress} className="h-2 mt-1" />}
            </div>

            {(button.menu || button.arrow) && button.arrow !== false && (
              <div className="flex items-center justify-center w-6 h-6 ml-2 flex-shrink-0">
                <LibIcon icon="chevron-right" className="w-3 h-3" fixedWidth />
              </div>
            )}
          </div>
        </Button>
      </HoverCardTrigger>

      {hasMetadataToShow && (
        <HoverCardContent className="w-64 p-3" side="right" align="start">
          {button.image && <img src={button.image} alt="Preview" className="w-full rounded-md mb-2" />}

          {Array.isArray(button.metadata) ? (
            <div className="space-y-2">
              {button.metadata.map((metadata, index) => (
                <div key={`context-metadata-${index}`}>
                  <p className="text-sm">
                    {typeof metadata === 'string' ? metadata : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </p>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress value={metadata.progress} className="h-2 mt-1" />
                  )}
                </div>
              ))}
            </div>
          ) : button.metadata && typeof button.metadata === 'object' ? (
            <div className="space-y-1">
              {Object.entries(button.metadata).map(([key, value], index) => (
                <p key={`context-metadata-${index}`} className="text-sm">
                  {key}: {value}
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
