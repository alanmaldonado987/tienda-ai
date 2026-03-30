import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { User, LogOut, Settings } from 'lucide-react'
import { useState, useRef } from 'react'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, confirmLogout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const getTitle = () => {
    const path = location.pathname.split('/admin/')[1]
    const titles = {
      dashboard: 'Dashboard',
      products: 'Productos',
      users: 'Usuarios',
      orders: 'Pedidos',
      coupons: 'Cupones',
      categories: 'Categorías',
      inventory: 'Inventario',
      config: 'Configuración',
      reviews: 'Reseñas'
    }
    return titles[path] || 'Admin'
  }

  const handleLogout = async () => {
    await confirmLogout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{getTitle()}</h1>
              <p className="text-sm text-gray-500">Panel de Administración</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-naf-black rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-red-600 font-medium">ADMIN</p>
                    </div>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <button
                        onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </button>
                      <button
                        onClick={() => { navigate('/admin/config'); setDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configuración
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
