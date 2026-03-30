import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Package,
  ChevronRight,
  Loader
} from 'lucide-react';

// Sub-pages
import SecuritySettings from '../components/settings/SecuritySettings';

const settingsModules = [
  {
    id: 'profile',
    title: 'Información Personal',
    description: 'Editar tu información de perfil',
    icon: User,
    path: '/profile'
  },
  {
    id: 'security',
    title: 'Seguridad',
    description: 'Cambiar contraseña y configuración de seguridad',
    icon: Lock,
    component: 'SecuritySettings'
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Preferencias de notificaciones',
    icon: Bell,
    comingSoon: true
  },
  {
    id: 'payment',
    title: 'Métodos de Pago',
    description: 'Administrar tus métodos de pago',
    icon: CreditCard,
    comingSoon: true
  },
  {
    id: 'orders',
    title: 'Mis Pedidos',
    description: 'Historial y seguimiento de pedidos',
    icon: Package,
    path: '/orders'
  }
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  const handleModuleClick = (module) => {
    if (module.path) {
      navigate(module.path);
    } else if (module.component) {
      setActiveModule(module.component);
    }
  };

  const handleBack = () => {
    setActiveModule(null);
  };

  // Si hay un módulo activo, mostrar su contenido
  if (activeModule === 'SecuritySettings') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-naf-black mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Configuración
          </button>
          
          <SecuritySettings />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-naf-black mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-naf-gray text-sm">Administra tu cuenta y preferencias</p>
      </motion.div>

      {/* Modules Grid */}
      <div className="grid gap-4">
        {settingsModules.map((module, index) => {
          const Icon = module.icon;
          const isDisabled = module.comingSoon;
          
          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleModuleClick(module)}
              disabled={isDisabled}
              className={`w-full text-left p-6 rounded-xl border transition-all ${
                isDisabled 
                  ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' 
                  : 'border-gray-100 bg-white hover:border-naf-black hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDisabled ? 'bg-gray-100' : 'bg-naf-black bg-opacity-10'}`}>
                    <Icon className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : 'text-naf-black'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {module.title}
                      {isDisabled && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          Pronto
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                </div>
                
                {!isDisabled && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
