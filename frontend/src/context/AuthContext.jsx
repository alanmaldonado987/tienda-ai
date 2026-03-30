import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nafnaf-user');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.warn('JSON corrupto en localStorage, limpiando...', err);
      localStorage.removeItem('nafnaf-user');
      localStorage.removeItem('nafnaf-token');
      return null;
    }
  });
  const [loading, setLoading] = useState(true); // Start as true while checking session
  const [error, setError] = useState(null);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('nafnaf-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nafnaf-user');
    }
  }, [user]);

  // Al iniciar, intentar recuperar sesión con refresh token
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('nafnaf-token');
      
      if (token) {
        try {
          // Intentar obtener datos del usuario actual
          const response = await authAPI.getMe();
          setUser(response.data.data);
        } catch (err) {
          // Token inválido, intentar refresh
          try {
            const refreshResponse = await authAPI.refresh();
            const newToken = refreshResponse.data.data.token;
            localStorage.setItem('nafnaf-token', newToken);
            
            // Reintentar obtener usuario
            const meResponse = await authAPI.getMe();
            setUser(meResponse.data.data);
          } catch (refreshErr) {
            // Refresh falló, limpiar sesión
            localStorage.removeItem('nafnaf-token');
            localStorage.removeItem('nafnaf-user');
            setUser(null);
          }
        }
      }
      
      setLoading(false);
    };

    initSession();
  }, []);

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {boolean} recordMe - Si debe recordar la sesión
   */
  const login = async (email, password, recordMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password, recordMe });
      const { user: userData, token } = response.data.data;
      
      localStorage.setItem('nafnaf-token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data.data;
      
      localStorage.setItem('nafnaf-token', token);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrar usuario';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión
   * Llama al backend para invalidar refresh token
   */
  const logout = (showConfirmation = true) => {
    if (!showConfirmation) {
      confirmLogout();
    }
    return { showConfirmation };
  };

  /**
   * Confirmar logout - limpiar estado local y backend
   */
  const confirmLogout = async () => {
    try {
      // Invalidar refresh token en el backend
      await authAPI.logout();
    } catch (err) {
      // Ignorar errores, limpiar local de todos modos
      console.warn('Error al hacer logout en backend:', err);
    }
    
    localStorage.removeItem('nafnaf-token');
    localStorage.removeItem('nafnaf-user');
    localStorage.removeItem('nafnaf-cart');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('nafnaf-token');
    if (!token) return;

    try {
      const response = await authAPI.getMe();
      setUser(response.data.data);
    } catch (err) {
      // Si falla, intentar refresh
      try {
        const refreshResponse = await authAPI.refresh();
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem('nafnaf-token', newToken);
        
        const meResponse = await authAPI.getMe();
        setUser(meResponse.data.data);
      } catch (refreshErr) {
        confirmLogout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        confirmLogout,
        loading,
        error,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
