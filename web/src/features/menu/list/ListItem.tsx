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
      className={cn('bg-muted rounded-md p-2 h-15 transition-colors focus:outline-none', isSelected && 'bg-accent')}
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
                className={cn('w-6 h-6')}
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
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</span>
              <span className="text-sm truncate">
                {typeof item.values[scrollIndex] === 'object'
                  ? (item.values[scrollIndex] as any).label
                  : item.values[scrollIndex]}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <LibIcon icon="chevron-left" className="w-3 h-3" />
              <span>
                {scrollIndex + 1}/{item.values.length}
              </span>
              <LibIcon icon="chevron-right" className="w-3 h-3" />
            </div>
          </div>
        ) : item.checked !== undefined ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">{item.label}</span>
            <CustomCheckbox checked={checked} />
          </div>
        ) : item.progress !== undefined ? (
          <div className="flex flex-col w-full gap-1">
            <span className="text-sm font-medium">{item.label}</span>
            <Progress value={item.progress} className="h-2" />
          </div>
        ) : (
          <span className="text-sm">{item.label}</span>
        )}
      </div>
    </div>
  );
});

export default React.memo(ListItem);
