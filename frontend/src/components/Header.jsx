import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, User, Heart, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartButtonRef = useRef(null);
  const { cartCount, setIsCartOpen, setCartButtonPosition } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  // Actualizar posición del botón del carrito
  useEffect(() => {
    const updatePosition = () => {
      if (cartButtonRef.current) {
        const rect = cartButtonRef.current.getBoundingClientRect();
        setCartButtonPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [setCartButtonPosition]);

  const menuItems = [
    'Novedades',
    'Hombre',
    'Mujer',
    'Niños',
    'Zapatos',
    'Accesorios',
    'Sale'
  ];

  return (
    <header className="sticky top-0 z-50 bg-white w-full">
      {/* Top bar - full width */}
      <div className="w-full bg-naf-black text-white text-center py-2 text-xs tracking-wider">
        <p>ENVÍOS gratis pedidos superiores a $150.000 | 5 DÍAS para cambios y devoluciones</p>
      </div>

      {/* Main header - full width */}
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-wider cursor-pointer" onClick={() => navigate('/')}>
              MODA<span className="font-light">COLOMBIA</span>
            </h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm hover:text-naf-gray transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-naf-black transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  className="flex items-center bg-naf-light-gray rounded-full px-4 py-2 animate-fade-in"
                >
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm w-32 lg:w-48"
                    autoFocus
                  />
                  <button type="submit" className="ml-1">
                    <Search className="w-4 h-4 text-naf-gray hover:text-naf-black" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <X className="w-4 h-4 text-naf-gray ml-1" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 hover:bg-naf-light-gray rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Search dropdown */}
              {searchOpen && searchQuery && (
                <button
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 hover:bg-gray-50 animate-fade-in text-left"
                >
                  <p className="text-sm text-naf-gray">
                    Buscar: <span className="font-medium text-naf-black">"{searchQuery}"</span>
                  </p>
                </button>
              )}
            </div>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="p-2 hover:bg-naf-light-gray rounded-full transition-colors hidden sm:block">
                  <User className="w-5 h-5" />
                </button>
                {/* User dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Mi perfil
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-naf-gray">
                    Mis pedidos
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="p-2 hover:bg-naf-light-gray rounded-full transition-colors hidden sm:block"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist */}
            <button 
              onClick={() => navigate('/wishlist')}
              className="p-2 hover:bg-naf-light-gray rounded-full transition-colors hidden sm:block relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-naf-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              ref={cartButtonRef}
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-naf-light-gray rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-naf-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 animate-fade-in">
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold tracking-wider cursor-pointer" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
                MODA<span className="font-light">COLOMBIA</span>
              </h1>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg py-2 border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
