import { useState, createContext, useContext } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState(null);

  const openConfirm = (options) => {
    return new Promise((resolve) => {
      setModalState({
        type: 'confirm',
        ...options,
        onConfirm: () => {
          setModalState(null);
          resolve(true);
        },
        onCancel: () => {
          setModalState(null);
          resolve(false);
        }
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

function ConfirmModal({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
        {/* Icon */}
        <div className="w-14 h-14 bg-naf-light-gray rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-7 h-7 text-naf-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-center text-naf-black mb-3">{title}</h3>
        <p className="text-naf-gray text-sm text-center mb-6 leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-naf-black text-white rounded-xl text-sm font-semibold hover:bg-naf-gray transition-all active:scale-[0.98]"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 border-2 border-naf-black text-naf-black rounded-xl text-sm font-semibold hover:bg-naf-light-gray transition-all active:scale-[0.98]"
          >
            {cancelText}
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