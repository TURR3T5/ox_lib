import Notifications from './features/notifications/NotificationWrapper';
import CircleProgressbar from './features/progress/CircleProgressbar';
import Progressbar from './features/progress/Progressbar';
import TextUI from './features/textui/TextUI';
import InputDialog from './features/dialog/InputDialog';
import ContextMenu from './features/menu/context/ContextMenu';
import { useNuiEvent } from './hooks/useNuiEvent';
import { setClipboard } from './utils/setClipboard';
import { fetchNui } from './utils/fetchNui';
import AlertDialog from './features/dialog/AlertDialog';
import ListMenu from './features/menu/list';
import Dev from './features/dev';
import { isEnvBrowser } from './utils/misc';
import SkillCheck from './features/skillcheck';
import RadialMenu from './features/menu/radial';
import { theme } from './theme';
import { MantineProvider } from '@mantine/core';
import { useConfig } from './providers/ConfigProvider';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';

const App: React.FC = () => {
  const { config } = useConfig();

  useNuiEvent('setClipboard', (data: string) => {
    setClipboard(data);
  });

  fetchNui('init');

  return (
    <MantineProvider stylesTransform={emotionTransform} defaultColorScheme="dark" theme={{ ...theme, ...config }}>
      <MantineEmotionProvider>
        <Progressbar />
        <CircleProgressbar />
        <Notifications />
        <TextUI />
        <InputDialog />
        <AlertDialog />
        <ContextMenu />
        <ListMenu />
        <RadialMenu />
        <SkillCheck />
        {isEnvBrowser() && <Dev />}
      </MantineEmotionProvider>
    </MantineProvider>
  );
};

export default App;
