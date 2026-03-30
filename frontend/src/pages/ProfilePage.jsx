import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  ArrowLeft, 
  Check, 
  X,
  Loader
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen debe ser menor a 5MB' });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage({ type: '', text: '' });

    try {
      // Si hay avatar nuevo, primero Subirlo
      let avatarUrl = user?.avatar;
      
      if (avatarFile) {
        // Crear FormData para subir imagen
        const imageFormData = new FormData();
        imageFormData.append('avatar', avatarFile);
        
        // NOTE: Endpoint de upload de avatar necesita ser creado en backend
        // Por ahora guardamos el avatar como URL pública o base64
        const reader = new FileReader();
        avatarUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(avatarFile);
        });
      }

      // Actualizar perfil
      const response = await authAPI.updateProfile({
        ...formData,
        avatar: avatarUrl
      });
      
      if (response.data.success) {
        await refreshUser();
        setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error al actualizar perfil'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-naf-gray">Debes iniciar sesión para ver tu perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold">Mi Perfil</h1>
          <p className="text-naf-gray text-base mt-1">Gestiona tu información personal</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center gap-2 mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <h2 className="text-xl font-semibold mb-6">Foto de Perfil</h2>
              
              <div className="relative inline-block">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-naf-black text-white flex items-center justify-center text-5xl font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-3 bg-naf-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>
              
              <p className="text-sm text-gray-500 mt-6">
                JPG, PNG o GIF. Máximo 5MB
              </p>
              
              {avatarFile && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Cancelar
                </button>
              )}
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-8">Información Personal</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-naf-black focus:ring-2 focus:ring-naf-black/10 transition-colors"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-naf-black focus:ring-2 focus:ring-naf-black/10 transition-colors"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">Teléfono (opcional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-naf-black focus:ring-2 focus:ring-naf-black/10 transition-colors"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-naf-black text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {savingProfile ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
