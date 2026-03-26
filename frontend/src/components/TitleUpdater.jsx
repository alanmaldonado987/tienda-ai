import { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

export default function TitleUpdater() {
  const { config, loading } = useConfig();

  useEffect(() => {
    if (!loading && config.app_name) {
      document.title = `${config.app_name} - Tienda Online`;
    }
  }, [config.app_name, loading]);

  return null;
}
