import { useState, useEffect } from 'react';
import { ChevronDown, Grid3X3, Grid2X2, Loader2, SlidersHorizontal, X, Check } from 'lucide-react';
import ProductCard from './ProductCard';
import { productsAPI } from '../services/api';

// Categorías
const categories = [
  { id: "todos", name: "Todos" },
  { id: "hombre", name: "Hombre" },
  { id: "mujer", name: "Mujer" },
  { id: "ninos", name: "Niños" },
  { id: "zapatos", name: "Zapatos" },
  { id: "accesorios", name: "Accesorios" }
];

// Géneros
const genders = [
  { id: "todos", name: "Todos" },
  { id: "hombre", name: "Hombre" },
  { id: "mujer", name: "Mujer" },
  { id: "unisex", name: "Unisex" },
  { id: "ninos", name: "Niños" },
  { id: "ninas", name: "Niñas" }
];

// Tallas
const sizes = [
  { id: "xs", name: "XS" },
  { id: "s", name: "S" },
  { id: "m", name: "M" },
  { id: "l", name: "L" },
  { id: "xl", name: "XL" },
  { id: "xxl", name: "XXL" },
  { id: "28", name: "28" },
  { id: "30", name: "30" },
  { id: "32", name: "32" },
  { id: "34", name: "34" },
  { id: "36", name: "36" }
];

// Rango de precios
const priceRanges = [
  { id: "all", name: "Todos los precios", min: 0, max: Infinity },
  { id: "0-50000", name: "Menos de $50.000", min: 0, max: 50000 },
  { id: "50000-100000", name: "$50.000 - $100.000", min: 50000, max: 100000 },
  { id: "100000-150000", name: "$100.000 - $150.000", min: 100000, max: 150000 },
  { id: "150000-200000", name: "$150.000 - $200.000", min: 150000, max: 200000 },
  { id: "200000+", name: "Más de $200.000", min: 200000, max: Infinity }
];

// Colores disponibles
const availableColors = [
  { id: "negro", name: "Negro", hex: "#1a1a1a" },
  { id: "blanco", name: "Blanco", hex: "#FFFFFF" },
  { id: "gris", name: "Gris", hex: "#6B7280" },
  { id: "azul", name: "Azul", hex: "#3B82F6" },
  { id: "rojo", name: "Rojo", hex: "#DC2626" },
  { id: "rosa", name: "Rosa", hex: "#EC4899" },
  { id: "cafe", name: "Café", hex: "#8B4513" },
  { id: "beige", name: "Beige", hex: "#F5E6D3" },
  { id: "verde", name: "Verde", hex: "#10B981" },
  { id: "morado", name: "Morado", hex: "#8B5CF6" }
];

export default function ProductGrid({ searchQuery = '' }) {
  const [activeCategory, setActiveCategory] = useState(searchQuery ? 'todos' : 'todos');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [onSale, setOnSale] = useState(false);

  // Cargar productos desde API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (activeCategory !== 'todos') {
          params.category = activeCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        if (sortBy !== 'recommended') {
          params.sort = sortBy;
        }

        const response = await productsAPI.getAll(params);
        
        let filteredProducts = response.data.data;
        
        // Aplicar filtros locales
        if (selectedPriceRange !== 'all') {
          const range = priceRanges.find(r => r.id === selectedPriceRange);
          if (range) {
            filteredProducts = filteredProducts.filter(p => 
              p.price >= range.min && p.price <= range.max
            );
          }
        }
        
        if (selectedColors.length > 0) {
          filteredProducts = filteredProducts.filter(p => {
            if (!p.colors) return false;
            return p.colors.some(color => 
              selectedColors.some(sc => {
                const colorHex = color.toLowerCase();
                const selectedHex = availableColors.find(c => c.id === sc)?.hex.toLowerCase() || '';
                return colorHex === selectedHex || colorHex === '#' + selectedHex.replace('#', '');
              })
            );
          });
        }

        if (selectedGenders.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            selectedGenders.includes(p.gender)
          );
        }

        if (onSale) {
          filteredProducts = filteredProducts.filter(p => p.originalPrice);
        }

        // Filtrar por tallas
        if (selectedSizes.length > 0) {
          filteredProducts = filteredProducts.filter(p => {
            if (!p.sizes) return false;
            return p.sizes.some(size => selectedSizes.includes(size.toLowerCase()));
          });
        }

        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, sortBy, searchQuery, selectedPriceRange, selectedColors, selectedGenders, selectedSizes, onSale]);

  const sortOptions = [
    { value: 'recommended', label: 'Recomendados' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' }
  ];

  const toggleColor = (colorId) => {
    setSelectedColors(prev => 
      prev.includes(colorId) 
        ? prev.filter(c => c !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleGender = (genderId) => {
    setSelectedGenders(prev => 
      prev.includes(genderId)
        ? prev.filter(g => g !== genderId)
        : [...prev, genderId]
    );
  };

  const toggleSize = (sizeId) => {
    setSelectedSizes(prev => 
      prev.includes(sizeId)
        ? prev.filter(s => s !== sizeId)
        : [...prev, sizeId]
    );
  };

  const clearFilters = () => {
    setSelectedPriceRange('all');
    setSelectedColors([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setOnSale(false);
  };

  const hasActiveFilters = selectedPriceRange !== 'all' || selectedColors.length > 0 || selectedGenders.length > 0 || selectedSizes.length > 0 || onSale;
  const activeFilterCount = selectedColors.length + selectedGenders.length + selectedSizes.length + (selectedPriceRange !== 'all' ? 1 : 0) + (onSale ? 1 : 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      {/* Section title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-wide mb-2">
          {searchQuery ? `Resultados para "${searchQuery}"` : 'NUESTROS PRODUCTOS'}
        </h2>
        <p className="text-naf-gray text-sm">
          {loading ? 'Cargando...' : `${products.length} productos`}
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 text-sm tracking-wider transition-all ${
              activeCategory === category.id
                ? 'bg-naf-black text-white'
                : 'bg-naf-light-gray text-naf-gray hover:bg-naf-black hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        {/* Filter button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm border transition-all ${
              showFilters || hasActiveFilters 
                ? 'border-naf-black bg-naf-black text-white' 
                : 'border-gray-200 hover:border-naf-black bg-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className={`text-xs px-1.5 rounded-full ${showFilters || hasActiveFilters ? 'bg-white text-naf-black' : 'bg-naf-black text-white'}`}>
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-naf-black underline"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>

        {/* Sort & View */}
        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 pr-10 pl-4 py-2 text-sm cursor-pointer focus:outline-none focus:border-naf-black rounded-md hover:border-naf-black transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* View mode */}
          <div className="flex gap-1 bg-gray-100 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-naf-black' : 'text-gray-400 hover:text-naf-black'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-naf-black' : 'text-gray-400 hover:text-naf-black'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Precio */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-naf-black"></span>
                Precio
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {priceRanges.map((range) => (
                  <label 
                    key={range.id} 
                    className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                      selectedPriceRange === range.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range.id}
                      onChange={() => setSelectedPriceRange(range.id)}
                      className="w-4 h-4 text-naf-black accent-naf-black"
                    />
                    <span className="text-sm">{range.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Género */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-naf-black"></span>
                Género
              </h3>
              <div className="flex flex-wrap gap-2">
                {genders.filter(g => g.id !== 'todos').map((gender) => (
                  <button
                    key={gender.id}
                    onClick={() => toggleGender(gender.id)}
                    className={`px-3 py-1.5 text-xs border rounded-full transition-all ${
                      selectedGenders.includes(gender.id)
                        ? 'border-naf-black bg-naf-black text-white'
                        : 'border-gray-200 hover:border-naf-black'
                    }`}
                  >
                    {gender.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Talla */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-naf-black"></span>
                Talla
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => toggleSize(size.id)}
                    className={`w-9 h-9 text-xs border rounded transition-all ${
                      selectedSizes.includes(size.id)
                        ? 'border-naf-black bg-naf-black text-white'
                        : 'border-gray-200 hover:border-naf-black'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-naf-black"></span>
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.id) 
                        ? 'border-naf-black scale-110 shadow-md' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColors.includes(color.id) && (
                      <Check className={`w-4 h-4 mx-auto ${color.id === 'blanco' || color.id === 'beige' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>

              {/* Solo ofertas */}
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSale}
                    onChange={(e) => setOnSale(e.target.checked)}
                    className="w-4 h-4 text-naf-black accent-naf-black"
                  />
                  <span className="text-sm">Solo ofertas</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-naf-black" />
          <span className="ml-2 text-gray-500">Cargando productos...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => { setActiveCategory('todos'); clearFilters(); }}
            className="text-naf-black underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'
              : 'grid grid-cols-1 md:grid-cols-2 gap-6'
          }
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-naf-gray mb-4">
            {searchQuery 
              ? `No se encontraron resultados para "${searchQuery}"`
              : 'No se encontraron productos con los filtros seleccionados'}
          </p>
          <button 
            onClick={clearFilters}
            className="text-naf-black underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
