import { createContext, useContext, useState, useEffect } from 'react';
import { configAPI } from '../services/api';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    app_name: 'MODACOLOMBIA',
    version: '1.0.0',
    currency: 'COP',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await configAPI.getAll();
      if (response.data.success && response.data.data) {
        setConfig(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const getValue = (key) => {
    return config[key];
  };

  return (
    <ConfigContext.Provider value={{ config, loading, getValue }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}
