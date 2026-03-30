import { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  Loader,
  Shield,
  AlertCircle
} from 'lucide-react';

export default function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
    return validation;
  };

  const passwordValidation = validatePassword(passwordData.newPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setErrors({});

    // Validaciones
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Mínimo 8 caracteres';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar contraseña';
      
      if (errorMsg.includes('actual')) {
        setErrors({ currentPassword: errorMsg });
      } else {
        setMessage({ type: 'error', text: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ name, label, placeholder, showKey }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPasswords[showKey] ? 'text' : 'password'}
          name={name}
          value={passwordData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors[name] 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-naf-black focus:ring-naf-black/10'
          }`}
        />
        <button
          type="button"
          onClick={() => toggleShowPassword(showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[showKey] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-400'}`}>
      {met ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {text}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-naf-black bg-opacity-10 rounded-lg">
          <Shield className="w-6 h-6 text-naf-black" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Seguridad</h2>
          <p className="text-sm text-gray-500">Gestiona tu contraseña y seguridad de la cuenta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        <div className="space-y-4">
          <PasswordInput 
            name="currentPassword"
            label="Contraseña Actual"
            placeholder="••••••••"
            showKey="current"
          />

          <PasswordInput 
            name="newPassword"
            label="Nueva Contraseña"
            placeholder="••••••••"
            showKey="new"
          />

          {/* Password Requirements */}
          {passwordData.newPassword && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 p-4 rounded-lg space-y-2"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">La contraseña debe tener:</p>
              <PasswordRequirement met={passwordValidation.length} text="Mínimo 8 caracteres" />
              <PasswordRequirement met={passwordValidation.uppercase} text="Una letra mayúscula" />
              <PasswordRequirement met={passwordValidation.lowercase} text="Una letra minúscula" />
              <PasswordRequirement met={passwordValidation.number} text="Un número" />
            </motion.div>
          )}

          <PasswordInput 
            name="confirmPassword"
            label="Confirmar Nueva Contraseña"
            placeholder="••••••••"
            showKey="confirm"
          />
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-naf-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Cambiando contraseña...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Cambiar Contraseña
              </>
            )}
          </button>
        </div>
      </form>

      {/* Additional Security Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Consejo:</strong> Usa una contraseña única que no hayas usado en otros sitios. 
          Combina letras, números y símbolos para mayor seguridad.
        </p>
      </div>
    </div>
  );
}
