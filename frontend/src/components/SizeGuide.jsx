import { X } from 'lucide-react';

export default function SizeGuide({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sizeCharts = {
    mujeres: {
      title: 'Guía de Tallas - Mujer',
      sizes: [
        { size: 'XS', bust: '80-84', waist: '60-64', hip: '86-90' },
        { size: 'S', bust: '84-88', waist: '64-68', hip: '90-94' },
        { size: 'M', bust: '88-92', waist: '68-72', hip: '94-98' },
        { size: 'L', bust: '92-96', waist: '72-76', hip: '98-102' },
        { size: 'XL', bust: '96-100', waist: '76-80', hip: '102-106' },
        { size: 'XXL', bust: '100-104', waist: '80-84', hip: '106-110' }
      ]
    },
    hombres: {
      title: 'Guía de Tallas - Hombre',
      sizes: [
        { size: 'S', chest: '86-91', waist: '71-76', hip: '86-91' },
        { size: 'M', chest: '91-101', waist: '76-86', hip: '91-101' },
        { size: 'L', chest: '101-111', waist: '86-96', hip: '101-111' },
        { size: 'XL', chest: '111-122', waist: '96-107', hip: '111-122' },
        { size: 'XXL', chest: '122-132', waist: '107-117', hip: '122-132' }
      ]
    },
    ninos: {
      title: 'Guía de Tallas - Niños',
      sizes: [
        { size: '2', age: '2-3', height: '92-98', chest: '53-55', waist: '50-52', hip: '53-56' },
        { size: '4', age: '3-4', height: '98-104', chest: '55-57', waist: '52-54', hip: '56-59' },
        { size: '6', age: '5-6', height: '110-116', chest: '57-61', waist: '54-58', hip: '59-63' },
        { size: '8', age: '7-8', height: '122-128', chest: '61-67', waist: '58-62', hip: '63-67' },
        { size: '10', age: '9-10', height: '134-140', chest: '67-71', waist: '62-66', hip: '67-71' },
        { size: '12', age: '11-12', height: '146-152', chest: '71-75', waist: '66-70', hip: '71-76' }
      ]
    },
    zapatos: {
      title: 'Guía de Tallas - Zapatos',
      sizes: [
        { size: '36', cm: '22.5' },
        { size: '37', cm: '23' },
        { size: '38', cm: '24' },
        { size: '39', cm: '25' },
        { size: '40', cm: '25.5' },
        { size: '41', cm: '26.5' },
        { size: '42', cm: '27' },
        { size: '43', cm: '28' }
      ]
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-lg shadow-2xl flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">GUÍA DE TALLAS</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Mujeres */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              {sizeCharts.mujeres.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Talla</th>
                    <th className="px-3 py-2 text-left font-medium">Busto (cm)</th>
                    <th className="px-3 py-2 text-left font-medium">Cintura (cm)</th>
                    <th className="px-3 py-2 text-left font-medium">Cadera (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.mujeres.sizes.map((row) => (
                    <tr key={row.size} className="border-t">
                      <td className="px-3 py-2 font-medium">{row.size}</td>
                      <td className="px-3 py-2">{row.bust}</td>
                      <td className="px-3 py-2">{row.waist}</td>
                      <td className="px-3 py-2">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hombres */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {sizeCharts.hombres.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Talla</th>
                    <th className="px-3 py-2 text-left font-medium">Pecho (cm)</th>
                    <th className="px-3 py-2 text-left font-medium">Cintura (cm)</th>
                    <th className="px-3 py-2 text-left font-medium">Cadera (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.hombres.sizes.map((row) => (
                    <tr key={row.size} className="border-t">
                      <td className="px-3 py-2 font-medium">{row.size}</td>
                      <td className="px-3 py-2">{row.chest}</td>
                      <td className="px-3 py-2">{row.waist}</td>
                      <td className="px-3 py-2">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Niños */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {sizeCharts.ninos.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Talla</th>
                    <th className="px-3 py-2 text-left font-medium">Edad</th>
                    <th className="px-3 py-2 text-left font-medium">Altura (cm)</th>
                    <th className="px-3 py-2 text-left font-medium">Pecho (cm)</th>
                    <th className="px-3 py-2 text-left font-medium">Cintura (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.ninos.sizes.map((row) => (
                    <tr key={row.size} className="border-t">
                      <td className="px-3 py-2 font-medium">{row.size}</td>
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2">{row.height}</td>
                      <td className="px-3 py-2">{row.chest}</td>
                      <td className="px-3 py-2">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Zapatos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              {sizeCharts.zapatos.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Talla</th>
                    <th className="px-3 py-2 text-left font-medium">Pie (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.zapatos.sizes.map((row) => (
                    <tr key={row.size} className="border-t">
                      <td className="px-3 py-2 font-medium">{row.size}</td>
                      <td className="px-3 py-2">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Consejos para medirte</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Usa una cinta métrica flexible</li>
              <li>• Mide sin ropa ajustada</li>
              <li> • Para el busto, mide la parte más ancha</li>
              <li>• Para la cintura, mide la parte más estrecha</li>
              <li>• Para la cadera, mide la parte más ancha</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-naf-black text-white py-2.5 text-sm font-medium hover:bg-naf-gray transition-colors rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
