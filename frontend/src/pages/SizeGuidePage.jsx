import { useState } from 'react'
import { Ruler } from 'lucide-react'

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState('women')

  const sizeCharts = {
    women: {
      title: 'Mujer',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      categories: [
        {
          name: 'Tops y Blusas',
          headers: ['Medida', 'XS', 'S', 'M', 'L', 'XL'],
          rows: [
            { label: 'Busto (cm)', values: ['82-85', '86-89', '90-93', '94-97', '98-101'] },
            { label: 'Cintura (cm)', values: ['62-65', '66-69', '70-73', '74-77', '78-81'] },
            { label: 'Cadera (cm)', values: ['88-91', '92-95', '96-99', '100-103', '104-107'] }
          ]
        },
        {
          name: 'Pantalones',
          headers: ['Medida', 'XS', 'S', 'M', 'L', 'XL'],
          rows: [
            { label: 'Cintura (cm)', values: ['62-65', '66-69', '70-73', '74-77', '78-81'] },
            { label: 'Cadera (cm)', values: ['88-91', '92-95', '96-99', '100-103', '104-107'] }
          ]
        }
      ]
    },
    men: {
      title: 'Hombre',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      categories: [
        {
          name: 'Camisas',
          headers: ['Medida', 'S', 'M', 'L', 'XL', 'XXL'],
          rows: [
            { label: 'Pecho (cm)', values: ['90-94', '95-99', '100-104', '105-109', '110-114'] },
            { label: 'Cintura (cm)', values: ['78-82', '83-87', '88-92', '93-97', '98-102'] }
          ]
        },
        {
          name: 'Pantalones',
          headers: ['Medida', 'S', 'M', 'L', 'XL', 'XXL'],
          rows: [
            { label: 'Cintura (cm)', values: ['78-82', '83-87', '88-92', '93-97', '98-102'] },
            { label: 'Cadera (cm)', values: ['94-98', '99-103', '104-108', '109-113', '114-118'] }
          ]
        }
      ]
    },
    shoes: {
      title: 'Zapatos',
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      categories: [
        {
          name: 'Mujer',
          headers: ['Colombia', '35', '36', '37', '38', '39', '40'],
          rows: [
            { label: 'EU', values: ['35', '36', '37', '38', '39', '40'] },
            { label: 'US', values: ['5', '6', '7', '8', '9', '10'] },
            { label: 'cm', values: ['22', '23', '24', '25', '26', '27'] }
          ]
        },
        {
          name: 'Hombre',
          headers: ['Colombia', '38', '39', '40', '41', '42'],
          rows: [
            { label: 'EU', values: ['38', '39', '40', '41', '42'] },
            { label: 'US', values: ['6', '7', '8', '9', '10'] },
            { label: 'cm', values: ['24', '25', '26', '27', '28'] }
          ]
        }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 flex items-center gap-3">
          <Ruler className="w-8 h-8" />
          Guía de Tallas
        </h1>

        <p className="text-gray-600 mb-8 max-w-2xl">
          Usa esta guía para encontrar tu talla perfecta. Recuerda que las medidas 
          pueden variar según el corte de cada prenda.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {Object.entries(sizeCharts).map(([key, chart]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === key
                  ? 'border-b-2 border-naf-black text-naf-black'
                  : 'text-gray-500 hover:text-naf-black'
              }`}
            >
              {chart.title}
            </button>
          ))}
        </div>

        {/* Content */}
        {Object.entries(sizeCharts).map(([key, chart]) => (
          activeTab === key && (
            <div key={key} className="space-y-8">
              {chart.categories.map((category, idx) => (
                <div key={idx} className="overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {category.headers.map((header, i) => (
                          <th key={i} className="border p-3 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {category.rows.map((row, i) => (
                        <tr key={i}>
                          <td className="border p-3 font-medium">{row.label}</td>
                          {row.values.map((val, j) => (
                            <td key={j} className="border p-3">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )
        ))}

        <div className="mt-12 p-6 bg-gray-50">
          <h2 className="font-semibold mb-2">¿Necesitas ayuda?</h2>
          <p className="text-gray-600">
            Escríbenos a 
            <a href="mailto:soporte@modacolombia.com" className="text-naf-black underline ml-1">
              soporte@modacolombia.com
            </a> 
            {' '}o por WhatsApp para asesoramiento personalizado.
          </p>
        </div>
      </div>
    </div>
  )
}
