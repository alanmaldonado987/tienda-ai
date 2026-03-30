import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Clock3 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { useConfig } from '../context/ConfigContext';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: showError } = useToast();
  const { config } = useConfig();
  const appName = config.app_name;
  
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold mb-2">Link inválido</h1>
            <p className="text-gray-600 text-sm mb-6">
              El link de reseteo de contraseña no es válido o está incompleto.
            </p>

            <Link
              to="/forgot-password"
              className="inline-block bg-naf-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-naf-gray transition-colors"
            >
              Solicitar nuevo link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token, password);
      
      if (response.data.success) {
        setSubmitted(true);
        success('Contraseña actualizada');
      } else {
        showError(response.data.message || 'Error al restablecer la contraseña');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restablecer la contraseña';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Logo */}
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-semibold tracking-wider">{appName}</span>
            </Link>

            {/* Icono de éxito */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-xl font-semibold mb-2">¡Contraseña actualizada!</h1>
            
            <p className="text-gray-600 text-sm mb-6">
              Tu contraseña ha sido restablecida exitosamente.
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <Link
              to="/auth"
              className="block w-full bg-naf-black text-white py-3 rounded-lg font-medium hover:bg-naf-gray transition-colors text-center"
            >
              Ir al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-semibold tracking-wider">{appName}</span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold mb-2">Nueva contraseña</h1>
            <p className="text-gray-500 text-sm">
              Ingresa tu nueva contraseña abajo.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-amber-800 text-sm text-center flex items-center justify-center gap-2">
              <Clock3 className="w-4 h-4" />
              <span>Este link expira en <strong>15 minutos</strong></span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:border-naf-black transition-colors`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Repite tu contraseña"
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:border-naf-black transition-colors`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-naf-black text-white py-3 rounded-lg font-medium hover:bg-naf-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                'Restablecer contraseña'
              )}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="text-sm text-gray-500 hover:text-naf-black transition-colors"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
