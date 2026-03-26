import { useState, useEffect, useRef } from 'react';

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const activeRequests = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const setupInterceptors = async () => {
      const api = (await import('../services/api')).default;

      if (!isMounted) return;

      const updateProgress = (increment) => {
        activeRequests.current += increment;
        
        if (activeRequests.current > 0) {
          setVisible(true);
          setProgress(prev => Math.min(prev + 20, 90));
        } else {
          setProgress(100);
          timeoutRef.current = setTimeout(() => {
            if (isMounted) {
              setVisible(false);
              setProgress(0);
            }
          }, 300);
        }
      };

      const requestInterceptor = api.interceptors.request.use((config) => {
        updateProgress(1);
        return config;
      });

      const responseInterceptor = api.interceptors.response.use(
        (response) => {
          updateProgress(-1);
          return response;
        },
        (error) => {
          updateProgress(-1);
          return Promise.reject(error);
        }
      );

      return () => {
        api.interceptors.request.eject(requestInterceptor);
        api.interceptors.response.eject(responseInterceptor);
      };
    };

    const cleanup = setupInterceptors();

    return () => {
      isMounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cleanup.then(fn => fn && fn());
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[300] h-1 bg-gray-100">
      <div
        className="h-full bg-naf-black transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(26, 26, 26, 0.3)'
        }}
      />
    </div>
  );
}
