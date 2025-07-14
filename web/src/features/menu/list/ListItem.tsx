import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  isSelected: boolean;
}

const ListItem = forwardRef<HTMLDivElement, Props>(({ item, index, scrollIndex, checked, isSelected }, ref) => {
  return (
    <div
      tabIndex={index}
      className={cn(
        'rounded-lg p-3 h-16 transition-all duration-300 focus:outline-none border cursor-pointer',
        isSelected
          ? 'bg-primary/20 border-primary gaming-glow text-white'
          : 'bg-muted/50 border-border hover:bg-muted/80 hover:border-primary/30'
      )}
      key={`item-${index}`}
      ref={ref}
    >
      <div className="flex items-center gap-4 h-full px-1">
        {item.icon && (
          <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="icon" className="w-8 h-8 object-contain" />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={cn('w-6 h-6', isSelected ? 'text-primary' : 'text-muted-foreground')}
                style={{ color: item.iconColor }}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </div>
        )}

        {Array.isArray(item.values) ? (
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex flex-col min-w-0">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
              <span className={cn('text-sm truncate font-medium', isSelected ? 'text-white' : 'text-foreground')}>
                {typeof item.values[scrollIndex] === 'object'
                  ? (item.values[scrollIndex] as any).label
                  : item.values[scrollIndex]}
              </span>
            </div>
            <div
              className={cn('flex items-center gap-1 text-xs', isSelected ? 'text-primary' : 'text-muted-foreground')}
            >
              <LibIcon icon="chevron-left" className="w-3 h-3" />
              <span className="font-medium">
                {scrollIndex + 1}/{item.values.length}
              </span>
              <LibIcon icon="chevron-right" className="w-3 h-3" />
            </div>
          </div>
        ) : item.checked !== undefined ? (
          <div className="flex items-center justify-between w-full">
            <span className={cn('text-sm font-medium', isSelected ? 'text-white' : 'text-foreground')}>
              {item.label}
            </span>
            <CustomCheckbox checked={checked} />
          </div>
        ) : item.progress !== undefined ? (
          <div className="flex flex-col w-full gap-2">
            <span className={cn('text-sm font-semibold', isSelected ? 'text-white' : 'text-foreground')}>
              {item.label}
            </span>
            <Progress value={item.progress} className="h-2" />
          </div>
        ) : (
          <span className={cn('text-sm font-medium', isSelected ? 'text-white' : 'text-foreground')}>{item.label}</span>
        )}
      </div>
    </div>
  );
});

export default React.memo(ListItem);
