import React, { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const calculateFontSize = (text: string): number => {
  if (text.length > 20) return 10;
  if (text.length > 15) return 12;
  return 13;
};

const splitTextIntoLines = (text: string, maxCharPerLine: number = 15): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const PAGE_ITEMS = 6;
const degToRad = (deg: number) => deg * (Math.PI / 180);

const RadialMenu: React.FC = () => {
  const { locale } = useLocales();
  const newDimension = 400;
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  const handleContextMenu = async () => {
    if (menu.page > 1) await changePage();
    else if (menu.sub) fetchNui('radialBack');
  };

  const handleCenterClick = async () => {
    if (menu.page > 1) await changePage();
    else {
      if (menu.sub) fetchNui('radialBack');
      else {
        setVisible(false);
        fetchNui('radialClose');
      }
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onContextMenu={handleContextMenu}
          >
            <svg
              style={{ overflow: 'visible', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
              width={`${newDimension}px`}
              height={`${newDimension}px`}
              viewBox="0 0 400 400"
              transform="rotate(90)"
              className="drop-shadow-2xl"
            >
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(215, 7%, 11%)" />
                  <stop offset="100%" stopColor="hsl(215, 6%, 8%)" />
                </linearGradient>
              </defs>

              <g transform="translate(200, 200)">
                <circle r={200} fill="url(#bgGradient)" stroke="hsl(220, 6%, 20%)" strokeWidth="2" />
              </g>

              {menuItems.map((item, index) => {
                const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
                const angle = degToRad(pieAngle / 2 + 90);
                const radius = 200 * 0.65;
                const sinAngle = Math.sin(angle);
                const cosAngle = Math.cos(angle);
                const iconYOffset = splitTextIntoLines(item.label, 15).length > 3 ? 3 : 0;
                const iconX = 200 + sinAngle * radius;
                const iconY = 200 + cosAngle * radius + iconYOffset;
                const iconWidth = Math.min(Math.max(item.iconWidth || 50, 0), 100);
                const iconHeight = Math.min(Math.max(item.iconHeight || 50, 0), 100);

                return (
                  <g
                    key={`radial-item-${index}`}
                    transform={`rotate(-${index * pieAngle} 200 200)`}
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={async () => {
                      const clickIndex =
                        menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                      if (!item.isMore) fetchNui('radialClick', clickIndex);
                      else await changePage(true);
                    }}
                  >
                    <path
                      d={`M200,200 l${200},0 A200,200 0 0,0 ${200 + 200 * Math.cos(-degToRad(pieAngle))}, ${
                        200 + 200 * Math.sin(-degToRad(pieAngle))
                      } z`}
                      fill="hsl(220, 6%, 13%)"
                      stroke="none"
                      className="group-hover:fill-primary/20 transition-all duration-300"
                    />

                    <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} className="pointer-events-none">
                      {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                        <image
                          href={item.icon}
                          width={iconWidth}
                          height={iconHeight}
                          x={iconX - iconWidth / 2}
                          y={iconY - iconHeight / 2 - iconHeight / 4}
                        />
                      ) : (
                        <LibIcon
                          x={iconX - 16}
                          y={iconY - 20}
                          icon={item.icon as IconProp}
                          width={32}
                          height={32}
                          fixedWidth
                          className="fill-muted-foreground group-hover:fill-primary transition-all duration-300"
                        />
                      )}

                      <text
                        x={iconX}
                        y={iconY + (splitTextIntoLines(item.label, 15).length > 2 ? 18 : 32)}
                        fill="hsl(220, 9%, 76%)"
                        textAnchor="middle"
                        fontSize={calculateFontSize(item.label)}
                        fontWeight="500"
                        className="pointer-events-none group-hover:fill-white transition-all duration-300 uppercase tracking-wide"
                      >
                        {splitTextIntoLines(item.label, 15).map((line, index) => (
                          <tspan x={iconX} dy={index === 0 ? 0 : '1.2em'} key={index}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  </g>
                );
              })}

              <g transform="translate(200, 200)" onClick={handleCenterClick}>
                <circle
                  r={32}
                  fill="hsl(212, 99%, 72%)"
                  stroke="hsl(220, 6%, 15%)"
                  strokeWidth="3"
                  className="cursor-pointer transition-all duration-300 hover:fill-primary/90 drop-shadow-lg"
                />
              </g>
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <LibIcon
                icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
                fixedWidth
                className="w-8 h-8 text-white font-bold"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenu;
