import { useState, useEffect } from 'react'
import { Search, Ban, Unlock, X, Check } from 'lucide-react'
import { adminUsersAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function EditUserModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    roleId: user?.roleId || 2
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl w-full max-w-lg"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar Usuario</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData({...formData, roleId: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            >
              <option value={2}>Usuario</option>
              <option value={1}>Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
              {loading ? <Check className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminUsersAPI.getAll()
      setUsers(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (formData) => {
    try {
      await adminUsersAPI.update(editingUser.id, formData)
      await fetchUsers()
      setEditingUser(null)
    } catch (err) {
      console.error('Error updating user:', err)
      alert(err.response?.data?.message || 'Error al actualizar usuario')
    }
  }

  const handleToggleBan = async (user) => {
    try {
      await adminUsersAPI.toggleBan(user.id, !user.isBanned)
      await fetchUsers()
    } catch (err) {
      console.error('Error toggling ban:', err)
      alert(err.response?.data?.message || 'Error al cambiar estado')
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchLower) || 
      user.email?.toLowerCase().includes(searchLower)
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && !user.isBanned) ||
      (filterStatus === 'banned' && user.isBanned)
    return matchesSearch && matchesStatus
  })

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const roleColors = {
    1: 'bg-purple-100 text-purple-800',
    2: 'bg-gray-100 text-gray-800'
  }

  const roleNames = {
    1: 'Admin',
    2: 'Usuario'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="banned">Bloqueados</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay usuarios</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registrado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.roleId]}`}>
                        {roleNames[user.roleId] || 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isBanned ? 'Bloqueado' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Editar"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`p-2 rounded-lg ${user.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                          title={user.isBanned ? 'Desbloquear' : 'Bloquear'}
                        >
                          {user.isBanned ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onSave={handleUpdateUser}
            onClose={() => setEditingUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
