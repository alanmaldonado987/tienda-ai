import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
    loading: null
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    loading: 'bg-white border-gray-200'
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    loading: 'text-gray-800'
  };

  return (
    <div className={`
      fixed top-4 left-1/2 -translate-x-1/2 z-[100]
      ${bgColors[type]} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md
      animate-slide-down
      ${type === 'loading' ? 'cursor-wait' : ''}
    `}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          {type === 'loading' ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-naf-black border-t-transparent rounded-full animate-spin"></div>
              <span className={`font-medium ${textColors[type]}`}>{message || 'Cargando...'}</span>
            </div>
          ) : (
            <>
              <p className={`font-medium ${textColors[type]}`}>{message}</p>
              <p className="text-sm text-gray-500 mt-1">
                {type === 'success' && 'La acción se completó exitosamente'}
                {type === 'error' && 'Algo salió mal. Intenta de nuevo'}
              </p>
            </>
          )}
        </div>
        {type !== 'loading' && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Contexto para el toast
import { createContext, useContext } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message) => showToast(message, 'info'), [showToast]);
  const loading = useCallback((message) => showToast(message, 'loading'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, info, loading }}>
      {children}
      <div className="fixed top-0 left-0 right-0 z-[200] flex flex-col gap-0.5">
        {toasts.filter(t => t.type === 'loading').map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
        {toasts.filter(t => t.type !== 'loading').map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => hideToast(toast.id)} />
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
