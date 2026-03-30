import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { ConfigProvider, useConfig } from './context/ConfigContext'
import { ToastProvider } from './components/Toast'
import { ModalProvider } from './components/ConfirmModal'
import LoadingBar from './components/LoadingBar'
import Header from './components/Header'
import Banner from './components/Banner'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import FlyingProduct from './components/FlyingProduct'
import SupportChat from './components/SupportChat'
import Auth from './components/Auth'
import ProductDetail from './components/ProductDetail'
import WishlistPage from './components/WishlistPage'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage'
import CheckoutPage from './components/CheckoutPage'
import OrdersPage from './components/OrdersPage'
import TitleUpdater from './components/TitleUpdater'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Admin Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/DashboardPage'
import AdminProducts from './pages/admin/ProductsPage'
import AdminUsers from './pages/admin/UsersPage'
import AdminOrders from './pages/admin/OrdersPage'
import AdminCoupons from './pages/admin/CouponsPage'
import AdminCategories from './pages/admin/CategoriesPage'
import AdminInventory from './pages/admin/InventoryPage'
import AdminConfig from './pages/admin/ConfigPage'
import AdminReviews from './pages/admin/ReviewsPage'

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
      <ConfigProvider>
        <ToastProvider>
          <ModalProvider>
            <LoadingBar />
            <TitleUpdater />
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
                  <Route path="/profile" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ProfilePage />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/checkout" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <CheckoutPage />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/orders" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <OrdersPage />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="admin-orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="config" element={<AdminConfig />} />
                    <Route path="reviews" element={<AdminReviews />} />
                  </Route>
                </Routes>
                <FlyingProduct />
                <SupportChat />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </ConfigProvider>
  </BrowserRouter>
  )
}

export default App