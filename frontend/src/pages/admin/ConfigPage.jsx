import { useState, useEffect } from 'react'
import { Save, Upload, Image } from 'lucide-react'
import { configAPI } from '../../services/api'

export default function ConfigPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    storeName: '',
    storeDescription: '',
    email: '',
    phone: '',
    address: '',
    shippingPolicy: '',
    returnPolicy: '',
    privacyPolicy: '',
    facebook: '',
    instagram: '',
    twitter: '',
    whatsapp: '',
    bannerMain: '',
    freeShippingMin: 150000
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await configAPI.getAll()
      const configData = response.data.data || {}
      
      // Mapear las keys de la DB al estado
      setConfig({
        storeName: configData.app_name || '',
        storeDescription: configData.app_description || '',
        email: configData.contact_email || '',
        phone: configData.contact_phone || '',
        address: configData.contact_address || '',
        shippingPolicy: configData.shipping_policy || '',
        returnPolicy: configData.return_policy || '',
        privacyPolicy: configData.privacy_policy || '',
        facebook: configData.social_facebook || '',
        instagram: configData.social_instagram || '',
        twitter: configData.social_twitter || '',
        whatsapp: configData.social_whatsapp || '',
        bannerMain: configData.banner_main || '',
        freeShippingMin: parseInt(configData.free_shipping_min) || 150000
      })
    } catch (err) {
      console.error('Error fetching config:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mapear el estado a las keys de la DB
      const configData = {
        app_name: config.storeName,
        app_description: config.storeDescription,
        contact_email: config.email,
        contact_phone: config.phone,
        contact_address: config.address,
        shipping_policy: config.shippingPolicy,
        return_policy: config.returnPolicy,
        privacy_policy: config.privacyPolicy,
        social_facebook: config.facebook,
        social_instagram: config.instagram,
        social_twitter: config.twitter,
        social_whatsapp: config.whatsapp,
        banner_main: config.bannerMain,
        free_shipping_min: config.freeShippingMin.toString()
      }
      
      await configAPI.update(configData)
      alert('Configuración guardada')
    } catch (err) {
      console.error('Error saving config:', err)
      alert('Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Información de la Tienda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
            <input
              type="text"
              value={config.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              value={config.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={config.storeDescription}
              onChange={(e) => handleChange('storeDescription', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Banner Principal</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
          <input
            type="url"
            value={config.bannerMain}
            onChange={(e) => handleChange('bannerMain', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            placeholder="https://..."
          />
          {config.bannerMain && (
            <div className="mt-4">
              <img src={config.bannerMain} alt="Banner preview" className="w-full h-48 object-cover rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Policies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Políticas</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Política de envío</label>
            <textarea
              value={config.shippingPolicy}
              onChange={(e) => handleChange('shippingPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Política de devolución</label>
            <textarea
              value={config.returnPolicy}
              onChange={(e) => handleChange('returnPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Política de privacidad</label>
            <textarea
              value={config.privacyPolicy}
              onChange={(e) => handleChange('privacyPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Configuración de Envío</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Envío gratis mínimo ($)</label>
          <input
            type="number"
            value={config.freeShippingMin}
            onChange={(e) => handleChange('freeShippingMin', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Social Networks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input
              type="url"
              value={config.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input
              type="url"
              value={config.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <input
              type="url"
              value={config.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="text"
              value={config.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="573001234567"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </div>
  )
}
