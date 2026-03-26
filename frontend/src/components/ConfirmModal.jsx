import { useState, createContext, useContext } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState(null);

  const openConfirm = (options) => {
    return new Promise((resolve) => {
      setModalState({
        type: 'confirm',
        ...options,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  };

  const closeModal = () => {
    setModalState(null);
  };

  return (
    <ModalContext.Provider value={{ openConfirm }}>
      {children}
      {modalState && (
        <ConfirmModal 
          {...modalState} 
          onClose={closeModal}
        />
      )}
    </ModalContext.Provider>
  );
}

function ConfirmModal({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-scale-in">
        {/* Icon */}
        <div className="w-12 h-12 bg-naf-light-gray rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-naf-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
        <p className="text-naf-gray text-sm text-center mb-6 whitespace-pre-line">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-naf-black text-white rounded-lg text-sm font-medium hover:bg-naf-gray transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}