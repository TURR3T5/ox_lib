import { Context, createContext, useContext, useEffect, useState } from 'react';
import { fetchNui } from '../utils/fetchNui';

interface Config {
  primaryColor: string;
  primaryShade: number;
}

interface ConfigCtxValue {
  config: Config;
  setConfig: (config: Config) => void;
}

const ConfigCtx = createContext<{ config: Config; setConfig: (config: Config) => void } | null>(null);

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    primaryColor: 'blue',
    primaryShade: 6,
  });

  useEffect(() => {
    fetchNui<Config>('getConfig').then((data) => setConfig(data));
  }, []);

  return <ConfigCtx.Provider value={{ config, setConfig }}>{children}</ConfigCtx.Provider>;
};

export default ConfigProvider;

export const useConfig = () => useContext<ConfigCtxValue>(ConfigCtx as Context<ConfigCtxValue>);
