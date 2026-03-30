import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import Modal from './Modal';
import { terminosCondiciones, politicaPrivacidad } from './LegalModals';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, loading, user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerminos, setShowTerminos] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  // Si ya está logueado, redirigir según el rol
  useEffect(() => {
    if (user) {
      if (user.roleId === 1) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        success('¡Bienvenido de vuelta!');
        // Si es admin, redirigir al panel de admin
        const userData = JSON.parse(localStorage.getItem('nafnaf-user'));
        if (userData && userData.roleId === 1) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        showError(result.message || 'Credenciales inválidas');
      }
    } else {
      const result = await register(formData);
      if (result.success) {
        success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión');
        // Limpiar formulario y cambiar a login
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          rememberMe: false
        });
        setIsLogin(true);
      } else {
        showError(result.message || 'Error al crear la cuenta');
      }
    }
  };

  const switchMode = () => {
    setIsAnimating(true);
    setFormErrors({});
    setTimeout(() => {
      setIsLogin(!isLogin);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      });
      setIsAnimating(false);
    }, 150);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Left side - Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-shopping-in-a-store-4476-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h2 className="text-4xl font-semibold mb-4">TU TIENDA</h2>
            <p className="text-lg opacity-90">Moda para toda la familia</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-4">
            <Link to="/" className="text-2xl font-semibold tracking-wider">
              TU<span className="font-light">TIENDA</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold tracking-wide">
              {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin 
                ? 'Ingresa a tu cuenta para continuar' 
                : 'Regístrate para obtener beneficios'}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="flex border-b mb-4">
            <button
              type="button"
              onClick={() => isLogin || switchMode()}
              disabled={isLogin}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                isLogin 
                  ? 'border-b-2 border-naf-black text-naf-black' 
                  : 'text-gray-400 hover:text-naf-black'
              }`}
            >
              Ya tengo cuenta
            </button>
            <button
              type="button"
              onClick={() => isLogin && switchMode()}
              disabled={!isLogin}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'border-b-2 border-naf-black text-naf-black' 
                  : 'text-gray-400 hover:text-naf-black'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Form - con animación */}
          <form onSubmit={handleSubmit} className={`space-y-3 transition-all duration-150 ${isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            {/* Nombre (solo registro) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium mb-1">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-naf-black transition-colors`}
                  />
                </div>
                {formErrors.name && <p className="text-red-500 text-xs mt-0.5">{formErrors.name}</p>}
              </div>
            )}

            {/* Teléfono (solo registro) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="300 123 4567"
                    className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-naf-black transition-colors`}
                  />
                </div>
                {formErrors.phone && <p className="text-red-500 text-xs mt-0.5">{formErrors.phone}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-naf-black transition-colors`}
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-xs mt-0.5">{formErrors.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-medium mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2 text-sm border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-naf-black transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-500 text-xs mt-0.5">{formErrors.password}</p>}
            </div>

            {/* Confirmar contraseña (solo registro) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium mb-1">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2 text-sm border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-naf-black transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{formErrors.confirmPassword}</p>}
              </div>
            )}

            {/* Recordarme (solo login) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-naf-black"
                  />
                  <label htmlFor="rememberMe" className="ml-1.5 text-xs text-gray-600">
                    Recordarme
                  </label>
                </div>
                <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-naf-black transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-naf-black text-white py-2.5 text-sm font-medium tracking-wider hover:bg-naf-gray transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  CARGANDO...
                </>
              ) : (
                isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'
              )}
            </button>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">o continúa con</span>
              </div>
            </div>

            {/* Social login */}
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Términos (solo registro) */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center">
                Al crear una cuenta, aceptas nuestros{' '}
                <button 
                  type="button"
                  onClick={() => setShowTerminos(true)}
                  className="underline hover:text-naf-black"
                >
                  Términos y Condiciones
                </button>
                {' '}y{' '}
                <button 
                  type="button"
                  onClick={() => setShowPrivacidad(true)}
                  className="underline hover:text-naf-black"
                >
                  Política de Privacidad
                </button>
              </p>
            )}
          </form>

          {/* Volver al inicio */}
          <div className="text-center mt-4">
            <Link to="/" className="text-xs text-gray-500 hover:text-naf-black transition-colors">
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Términos y Condiciones */}
      <Modal 
        isOpen={showTerminos} 
        onClose={() => setShowTerminos(false)}
        title="Términos y Condiciones"
      >
        <div className="space-y-6">
          {terminosCondiciones.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-500 mb-4">{section.updated}</p>
              {section.sections.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-start gap-3 mb-1">
                    <span className="flex-shrink-0 w-6 h-6 bg-naf-black text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {item.number}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-9 leading-relaxed">{item.content}</p>
                  {item.list && (
                    <ul className="mt-2 ml-9 space-y-1">
                      {item.list.map((listItem, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.contact && (
                    <div className="mt-2 ml-9 space-y-1">
                      {item.contact.map((c, k) => (
                        <p key={k} className="text-sm text-gray-600">
                          <span className="font-medium">{c.label}:</span> {c.value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal Política de Privacidad */}
      <Modal 
        isOpen={showPrivacidad} 
        onClose={() => setShowPrivacidad(false)}
        title="Política de Privacidad"
      >
        <div className="space-y-6">
          {politicaPrivacidad.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-500 mb-4">{section.updated}</p>
              {section.sections.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-start gap-3 mb-1">
                    <span className="flex-shrink-0 w-6 h-6 bg-naf-black text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {item.number}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-9 leading-relaxed">{item.content}</p>
                  {item.list && (
                    <ul className="mt-2 ml-9 space-y-1">
                      {item.list.map((listItem, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.note && (
                    <p className="text-xs text-gray-500 mt-2 ml-9 italic">{item.note}</p>
                  )}
                  {item.contact && (
                    <div className="mt-2 ml-9 space-y-1">
                      {item.contact.map((c, k) => (
                        <p key={k} className="text-sm text-gray-600">
                          <span className="font-medium">{c.label}:</span> {c.value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
