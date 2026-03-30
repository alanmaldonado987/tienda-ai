import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Tag, 
  FolderTree, 
  PackagePlus, 
  Settings, 
  Star,
  LogOut,
  Store
} from 'lucide-react'

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Productos', icon: Package },
  { path: '/admin/users', label: 'Usuarios', icon: Users },
  { path: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { path: '/admin/coupons', label: 'Cupones', icon: Tag },
  { path: '/admin/categories', label: 'Categorías', icon: FolderTree },
  { path: '/admin/inventory', label: 'Inventario', icon: PackagePlus },
  { path: '/admin/config', label: 'Configuración', icon: Settings },
  { path: '/admin/reviews', label: 'Reseñas', icon: Star },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-naf-black text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8" />
          <div>
            <h2 className="text-lg font-semibold tracking-wider">MODA</h2>
            <p className="text-xs text-gray-400">ADMIN</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-naf-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Volver a la tienda</span>
        </NavLink>
      </div>
    </aside>
  )
}
