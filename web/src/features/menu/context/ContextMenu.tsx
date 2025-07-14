import React, { useEffect, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import MarkdownComponents from '../../../config/MarkdownComponents';
import { motion, AnimatePresence } from 'framer-motion';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const ContextMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-40 top-1/2 w-[400px] max-h-[70vh] z-50"
          initial={{
            opacity: 0,
            x: 50,
            y: '-50%',
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: '-50%',
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: 50,
            y: '-50%',
            scale: 0.95,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="gaming-card rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-card to-secondary">
              {contextMenu.menu && (
                <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
              )}

              <div className="flex-1 text-center mx-3">
                <h2 className="text-white font-bold uppercase tracking-wider text-lg">
                  <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
                </h2>
              </div>

              <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
            </div>

            <div className="max-h-[calc(70vh-4rem)] overflow-y-auto">
              <div className="space-y-0">
                {Object.entries(contextMenu.options).map((option, index) => (
                  <ContextButton
                    option={option}
                    key={`context-item-${index}`}
                    isLast={index === Object.entries(contextMenu.options).length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
