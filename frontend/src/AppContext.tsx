import React, { createContext, useContext, useState } from 'react';
import { DigitalAsset } from './types';

interface AppContextType {
  assets: DigitalAsset[];
  setAssets: React.Dispatch<React.SetStateAction<DigitalAsset[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);

  return (
    <AppContext.Provider value={{ assets, setAssets }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return { assets: [], setAssets: () => {} };
  }
  return context;
};