import { useState, useEffect, useRef } from 'react'
import { Save, Store, Mail, Phone, MapPin, Truck, Shield, Share2, Image as ImageIcon, X } from 'lucide-react'
import { configAPI } from '../../services/api'
import { motion } from 'framer-motion'

// Image Upload Component
function ImageUpload({ value, onChange, label }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
        onChange(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const clearImage = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-naf-black bg-gray-50' 
            : 'border-gray-300 hover:border-naf-black'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearImage() }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-naf-black">Click para subir</span> o arrastra una imagen
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400">o</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label || 'URL de Imagen'}</label>
        <input
          type="url"
          value={value}
          onChange={(e) => { onChange(e.target.value); setPreview(e.target.value) }}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
          placeholder="https://..."
        />
      </div>
    </div>
  )
}

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
          <p className="text-gray-500">Administra la información de tu tienda</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Store Info & Contact */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6">
          {/* Store Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Store className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold">Información de la Tienda</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
                <input
                  type="text"
                  value={config.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={config.storeDescription}
                  onChange={(e) => handleChange('storeDescription', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold">Información de Contacto</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={config.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold">Banner Principal</h3>
            </div>
            <ImageUpload
              value={config.bannerMain}
              onChange={(url) => handleChange('bannerMain', url)}
              label="URL de imagen"
            />
          </div>

          {/* Policies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Shield className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold">Políticas</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Política de envío</label>
                <textarea
                  value={config.shippingPolicy}
                  onChange={(e) => handleChange('shippingPolicy', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Política de devolución</label>
                <textarea
                  value={config.returnPolicy}
                  onChange={(e) => handleChange('returnPolicy', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Política de privacidad</label>
                <textarea
                  value={config.privacyPolicy}
                  onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Shipping & Social */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Shipping */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Truck className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold">Envío</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto mínimo para envío gratis</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={config.freeShippingMin}
                  onChange={(e) => handleChange('freeShippingMin', parseInt(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Los pedidos superiores a este monto tendrá envío gratis</p>
            </div>
          </div>

          {/* Social Networks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold">Redes Sociales</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="url"
                  value={config.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={config.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="url"
                  value={config.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={config.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                  placeholder="573001234567"
                />
              </div>
            </div>
          </div>

          {/* Quick Save */}
          <div className="bg-naf-black rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">¿Listo?</h3>
            <p className="text-sm text-gray-300 mb-4">No olvides guardar tus cambios antes de salir</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-white text-naf-black rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-naf-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Guardar Configuración
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
