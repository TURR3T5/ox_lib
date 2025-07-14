import React, { useState } from 'react';
import { debugAlert } from './debug/alert';
import { debugContext } from './debug/context';
import { debugInput } from './debug/input';
import { debugMenu } from './debug/menu';
import { debugCustomNotification } from './debug/notification';
import { debugProgressbar } from './debug/progress';
import { debugTextUI } from './debug/textui';
import { debugRadial } from './debug/radial';
import LibIcon from '../../components/LibIcon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Dev: React.FC = () => {
  const [opened, setOpened] = useState(false);

  return (
    <TooltipProvider>
      <Sheet open={opened} onOpenChange={setOpened}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-12 right-12 h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-2xl z-50 gaming-glow transition-all duration-300 hover:scale-110"
              >
                <LibIcon icon="wrench" className="h-7 w-7" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" className="gaming-card">
            <p className="font-semibold uppercase tracking-wide">Developer Panel</p>
          </TooltipContent>
        </Tooltip>

        <SheetContent side="left" className="w-96 text-white gaming-card border-r-2 border-primary/20">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <LibIcon icon="code" className="w-6 h-6 text-primary" />
              Developer Panel
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-3 mt-6">
            <div className="gaming-card rounded-lg p-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-primary mb-3 flex items-center gap-2">
                <LibIcon icon="window-restore" className="w-5 h-5" />
                Dialogs
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => debugInput()}>
                  <LibIcon icon="keyboard" className="w-4 h-4 mr-2" />
                  Input Dialog
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => debugAlert()}>
                  <LibIcon icon="exclamation-triangle" className="w-4 h-4 mr-2" />
                  Alert Dialog
                </Button>
              </div>
            </div>

            <div className="gaming-card rounded-lg p-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-primary mb-3 flex items-center gap-2">
                <LibIcon icon="bars" className="w-5 h-5" />
                Menus
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => debugContext()}>
                  <LibIcon icon="mouse-pointer" className="w-4 h-4 mr-2" />
                  Context Menu
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => debugMenu()}>
                  <LibIcon icon="list" className="w-4 h-4 mr-2" />
                  List Menu
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => debugRadial()}>
                  <LibIcon icon="circle-dot" className="w-4 h-4 mr-2" />
                  Radial Menu
                </Button>
              </div>
            </div>

            <div className="gaming-card rounded-lg p-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-primary mb-3 flex items-center gap-2">
                <LibIcon icon="bell" className="w-5 h-5" />
                Notifications
              </h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => debugCustomNotification()}>
                <LibIcon icon="message" className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>

            <div className="gaming-card rounded-lg p-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-primary mb-3 flex items-center gap-2">
                <LibIcon icon="chart-bar" className="w-5 h-5" />
                Progress
              </h3>

              <Button variant="outline" className="w-full justify-start" onClick={() => debugProgressbar()}>
                <LibIcon icon="minus" className="w-4 h-4 mr-2" />
                Progress Bar
              </Button>
            </div>

            <div className="gaming-card rounded-lg p-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-primary mb-3 flex items-center gap-2">
                <LibIcon icon="info" className="w-5 h-5" />
                UI Elements
              </h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => debugTextUI()}>
                <LibIcon icon="font" className="w-4 h-4 mr-2" />
                Text UI
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};

export default Dev;
