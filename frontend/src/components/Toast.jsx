import { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 5000, onClose, progress = true }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const startTimeRef = useRef(Date.now());
  const animationRef = useRef(null);

  useEffect(() => {
    if (type === 'loading' || !progress || duration <= 0) return;

    const updateProgress = () => {
      if (isPaused) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      const percent = (remaining / duration) * 100;
      
      setProgressPercent(percent);
      
      if (remaining <= 0) {
        setIsExiting(true);
        setTimeout(onClose, 300);
      } else {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, onClose, isPaused, progress, type]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - (duration * (progressPercent / 100));
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
    loading: null
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200',
    loading: 'bg-white border-gray-200 shadow-xl'
  };

  const iconBgColors = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    warning: 'bg-amber-100',
    loading: 'bg-gray-100'
  };

  const textColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    info: 'text-blue-900',
    warning: 'text-amber-900',
    loading: 'text-gray-900'
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[100]
        ${bgColors[type]} border rounded-xl shadow-lg 
        min-w-[320px] max-w-md w-full overflow-hidden
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}
        ${type === 'loading' ? 'cursor-wait' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColors[type]} flex items-center justify-center`}>
            {type === 'loading' ? (
              <div className="w-5 h-5 border-2 border-naf-black border-t-transparent rounded-full animate-spin" />
            ) : (
              icons[type]
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {type === 'loading' ? (
              <div className="flex items-center gap-2">
                <span className={`font-medium ${textColors[type]}`}>{message || 'Procesando...'}</span>
              </div>
            ) : (
              <>
                <p className={`font-semibold ${textColors[type]} leading-tight`}>{message}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {type === 'success' && 'Completado'}
                  {type === 'error' && 'Error'
                  }{type === 'info' && 'Información'}
                  {type === 'warning' && 'Advertencia'}
                </p>
              </>
            )}
          </div>

          {/* Close button */}
          {type !== 'loading' && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {type !== 'loading' && progress && duration > 0 && (
        <div className="h-1 bg-black/5">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-amber-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Contexto para el toast
import { createContext, useContext } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000, options = {}) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration, ...options }]);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration = 4000) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration = 6000) => showToast(message, 'error', duration), [showToast]);
  const info = useCallback((message, duration = 5000) => showToast(message, 'info', duration), [showToast]);
  const warning = useCallback((message, duration = 5000) => showToast(message, 'warning', duration), [showToast]);
  const loading = useCallback((message) => showToast(message, 'loading', 0, { progress: false }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, info, warning, loading }}>
      {children}
      
      {/* Stacked toasts container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 w-full max-w-md pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              progress={toast.progress}
              onClose={() => hideToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default Toast;