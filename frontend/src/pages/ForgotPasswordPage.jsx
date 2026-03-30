import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Clock3 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { useConfig } from '../context/ConfigContext';

export default function ForgotPasswordPage() {
  const { success, error: showError } = useToast();
  const { config } = useConfig();
  const appName = config.app_name || 'MODACOLOMBIA';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.data.success) {
        setSubmitted(true);
        success('Revisa tu email');
      } else {
        showError(response.data.message || 'Error al enviar el email');
      }
    } catch (err) {
      // Por seguridad, mostramos éxito aunque falle
      // para no revelar si el email existe o no
      setSubmitted(true);
      success('Si el email existe, recibirás instrucciones');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
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

            <h1 className="text-xl font-semibold mb-2">¡Revisa tu email!</h1>
            
            <p className="text-gray-600 text-sm mb-6">
              Si existe una cuenta con el email <strong>{email}</strong>, 
              te enviamos instrucciones para restablecer tu contraseña.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm flex items-center justify-center gap-2">
                <Clock3 className="w-4 h-4" />
                <span>El enlace expira en <strong>15 minutos</strong></span>
              </p>
            </div>

            <p className="text-gray-500 text-xs mb-6">
              No recibiste el email? Revisa tu carpeta de spam o intenta de nuevo.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Enviar de nuevo
              </button>
              
              <Link
                to="/auth"
                className="block w-full py-2.5 text-sm font-medium text-white bg-naf-black rounded-lg hover:bg-naf-gray transition-colors text-center"
              >
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de solicitud
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

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold mb-2">¿Olvidaste tu contraseña?</h1>
            <p className="text-gray-500 text-sm">
              No te preocupes, te enviamos instrucciones para restablecerla.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="correo@ejemplo.com"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:border-naf-black transition-colors`}
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
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
                  Enviando...
                </>
              ) : (
                'Enviar instrucciones'
              )}
            </button>
          </form>

          {/* Volver */}
          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-naf-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
