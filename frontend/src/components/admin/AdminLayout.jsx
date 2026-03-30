import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  const location = useLocation()
  
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{getTitle()}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Panel de Administración</span>
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
