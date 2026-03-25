import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Banner from './components/Banner'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Auth from './components/Auth'
import ProductDetail from './components/ProductDetail'
import WishlistPage from './components/WishlistPage'
import SearchPage from './components/SearchPage'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Banner />
        <ProductGrid />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <SearchPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/product/:id" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <ProductDetail />
                  </main>
                  <Footer />
                  <CartDrawer />
                </div>
              } />
              <Route path="/wishlist" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <WishlistPage />
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
