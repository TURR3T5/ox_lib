import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import ListItem from './ListItem';
import Header from './Header';
import { fetchNui } from '../../../utils/fetchNui';
import type { MenuPosition, MenuSettings } from '../../../typings';
import LibIcon from '../../../components/LibIcon';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ListMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: 'top-left',
    title: '',
    items: [],
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [indexStates, setIndexStates] = useState<Record<number, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const firstRenderRef = useRef(false);

  const getPositionClasses = (position?: MenuPosition) => {
    switch (position) {
      case 'top-right':
        return 'top-5 right-5';
      case 'bottom-left':
        return 'bottom-5 left-5';
      case 'bottom-right':
        return 'bottom-5 right-5';
      case 'top-left':
      default:
        return 'top-5 left-5';
    }
  };

  const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
    if (menu.canClose === false && !forceClose) return;
    setVisible(false);
    if (!ignoreFetch) fetchNui('closeMenu', keyPressed);
  };

  const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (firstRenderRef.current) firstRenderRef.current = false;
    switch (e.code) {
      case 'ArrowDown':
        setSelected((selected) => {
          if (selected >= menu.items.length - 1) return 0;
          return selected + 1;
        });
        break;
      case 'ArrowUp':
        setSelected((selected) => {
          if (selected <= 0) return menu.items.length - 1;
          return selected - 1;
        });
        break;
      case 'ArrowRight':
        if (Array.isArray(menu.items[selected].values))
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] + 1 <= menu.items[selected].values?.length! - 1 ? indexStates[selected] + 1 : 0,
          });
        break;
      case 'ArrowLeft':
        if (Array.isArray(menu.items[selected].values))
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] - 1 >= 0 ? indexStates[selected] - 1 : menu.items[selected].values?.length! - 1,
          });
        break;
      case 'Enter':
        if (!menu.items[selected]) return;
        if (menu.items[selected].checked !== undefined && !menu.items[selected].values) {
          return setCheckedStates({
            ...checkedStates,
            [selected]: !checkedStates[selected],
          });
        }
        fetchNui('confirmSelected', [selected, indexStates[selected]]).catch();
        if (menu.items[selected].close === undefined || menu.items[selected].close) setVisible(false);
        break;
    }
  };

  useEffect(() => {
    if (menu.items[selected]?.checked === undefined || firstRenderRef.current) return;
    const timer = setTimeout(() => {
      fetchNui('changeChecked', [selected, checkedStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  useEffect(() => {
    if (!menu.items[selected]?.values || firstRenderRef.current) return;
    const timer = setTimeout(() => {
      fetchNui('changeIndex', [selected, indexStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [indexStates]);

  useEffect(() => {
    if (!menu.items[selected]) return;
    listRefs.current[selected]?.scrollIntoView({
      block: 'nearest',
      inline: 'start',
    });
    listRefs.current[selected]?.focus({ preventScroll: true });

    const timer = setTimeout(() => {
      fetchNui('changeSelected', [
        selected,
        menu.items[selected].values
          ? indexStates[selected]
          : menu.items[selected].checked
          ? checkedStates[selected]
          : null,
        menu.items[selected].values ? 'isScroll' : menu.items[selected].checked ? 'isCheck' : null,
      ]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [selected, menu]);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape', 'Backspace'].includes(e.code)) closeMenu(false, e.code);
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  const isValuesObject = useCallback(
    (values?: Array<string | { label: string; description: string }>) => {
      return Array.isArray(values) && typeof values[indexStates[selected]] === 'object';
    },
    [indexStates, selected]
  );

  useNuiEvent('closeMenu', () => closeMenu(true, undefined, true));

  useNuiEvent('setMenu', (data: MenuSettings) => {
    firstRenderRef.current = true;
    if (!data.startItemIndex || data.startItemIndex < 0) data.startItemIndex = 0;
    else if (data.startItemIndex >= data.items.length) data.startItemIndex = data.items.length - 1;
    setSelected(data.startItemIndex);
    if (!data.position) data.position = 'top-left';
    listRefs.current = [];
    setMenu(data);
    setVisible(true);

    const arrayIndexes: { [key: number]: number } = {};
    const checkedIndexes: { [key: number]: boolean } = {};
    for (let i = 0; i < data.items.length; i++) {
      if (Array.isArray(data.items[i].values)) arrayIndexes[i] = (data.items[i].defaultIndex || 1) - 1;
      else if (data.items[i].checked !== undefined) checkedIndexes[i] = data.items[i].checked || false;
    }
    setIndexStates(arrayIndexes);
    setCheckedStates(checkedIndexes);
    listRefs.current[data.startItemIndex]?.focus();
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn('fixed z-50 w-96', getPositionClasses(menu.position))}
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
          }}
          transition={{ duration: 0.15 }}
        >
          <div className="relative -skew-x-1">
            {(isValuesObject(menu.items[selected].values)
              ? (menu.items[selected].values as any)[indexStates[selected]]?.description
              : menu.items[selected].description) && (
              <motion.div
                className="absolute -right-2 top-0 transform translate-x-full z-10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="gaming-card rounded-lg p-3 text-sm shadow-lg max-w-sm break-words">
                  <p className="text-muted-foreground">
                    {isValuesObject(menu.items[selected].values)
                      ? (menu.items[selected].values as any)[indexStates[selected]].description
                      : menu.items[selected].description}
                  </p>
                </div>
              </motion.div>
            )}

            <Header title={menu.title} />

            <div
              className={cn(
                'gaming-card border-t-0 rounded-t-none overflow-hidden',
                'max-h-[415px]',
                menu.items.length <= 6 || selected === menu.items.length - 1 ? 'rounded-b-lg' : ''
              )}
              onKeyDown={moveMenu}
              tabIndex={0}
            >
              <div className="overflow-y-auto p-2 pb-4 space-y-1">
                {menu.items.map((item, index) => (
                  <React.Fragment key={`menu-item-${index}`}>
                    {item.label && (
                      <ListItem
                        index={index}
                        item={item}
                        scrollIndex={indexStates[index]}
                        checked={checkedStates[index]}
                        ref={(el) => {
                          if (listRefs.current) {
                            listRefs.current[index] = el;
                          }
                        }}
                        isSelected={selected === index}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {menu.items.length > 6 && selected !== menu.items.length - 1 && (
              <motion.div
                className="gaming-card border-t-0 rounded-t-none rounded-b-lg h-6 flex items-center justify-center"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <LibIcon icon="chevron-down" className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ListMenu;
