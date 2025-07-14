import React, { useState } from 'react';
import { debugAlert } from './debug/alert';
import { debugContext } from './debug/context';
import { debugInput } from './debug/input';
import { debugMenu } from './debug/menu';
import { debugCustomNotification } from './debug/notification';
import { debugCircleProgressbar, debugProgressbar } from './debug/progress';
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
                className="fixed bottom-12 right-12 h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg z-50"
              >
                <LibIcon icon="wrench" className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Developer drawer</p>
          </TooltipContent>
        </Tooltip>

        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Developer drawer</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 mt-6">
            <Separator />

            <Button variant="outline" className="w-full" onClick={() => debugInput()}>
              Open input dialog
            </Button>

            <Button variant="outline" className="w-full" onClick={() => debugAlert()}>
              Open alert dialog
            </Button>

            <Separator />

            <Button variant="outline" className="w-full" onClick={() => debugContext()}>
              Open context menu
            </Button>

            <Button variant="outline" className="w-full" onClick={() => debugMenu()}>
              Open list menu
            </Button>

            <Button variant="outline" className="w-full" onClick={() => debugRadial()}>
              Open radial menu
            </Button>

            <Separator />

            <Button variant="outline" className="w-full" onClick={() => debugCustomNotification()}>
              Send notification
            </Button>

            <Separator />

            <Button variant="outline" className="w-full" onClick={() => debugProgressbar()}>
              Activate progress bar
            </Button>

            <Button variant="outline" className="w-full" onClick={() => debugCircleProgressbar()}>
              Activate progress circle
            </Button>

            <Separator />

            <Button variant="outline" className="w-full" onClick={() => debugTextUI()}>
              Show TextUI
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};

export default Dev;
