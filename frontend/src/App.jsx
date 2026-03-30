import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { ConfigProvider, useConfig } from './context/ConfigContext'
import { ToastProvider } from './components/Toast'
import { ModalProvider } from './components/ConfirmModal'
import LoadingBar from './components/LoadingBar'
import Header from './components/Header'
import Banner from './components/Banner'
import CollectionsCarousel from './components/CollectionsCarousel'
import CountdownTimer from './components/CountdownTimer'
import NewArrivals from './components/NewArrivals'
import OnSale from './components/OnSale'
import Testimonials from './components/Testimonials'
import RecentlyViewed from './components/RecentlyViewed'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import FlyingProduct from './components/FlyingProduct'
import SupportChat from './components/SupportChat'
import Auth from './components/Auth'
import ProductDetail from './components/ProductDetail'
import WishlistPage from './components/WishlistPage'
import SearchPage from './components/SearchPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import CheckoutPage from './components/CheckoutPage'
import OrdersPage from './components/OrdersPage'
import TitleUpdater from './components/TitleUpdater'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PaymentResultPage from './pages/PaymentResultPage'
import CollectionsPage from './pages/CollectionsPage'
import PageTransition from './components/PageTransition'

// Componente wrapper para animaciones
function AnimatedRoute({ children }) {
  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
}

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
import AdminCollections from './pages/admin/CollectionsPage'
import AdminTestimonials from './pages/admin/TestimonialsPage'
import AdminCountdown from './pages/admin/CountdownPage'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <CountdownTimer />
      <Header />
      <main className="flex-1">
        <Banner />
        <CollectionsCarousel />
        <NewArrivals />
        <OnSale />
        <Testimonials />
        <ProductGrid />
      </main>
      <Footer />
      <CartDrawer />
      <RecentlyViewed />
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
                <AnimatePresence mode="wait">
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
                  <Route path="/settings" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <SettingsPage />
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
                  <Route path="/payment" element={<PaymentResultPage />} />
                  <Route path="/collections" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <CollectionsPage />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/collections/:slug" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <CollectionsPage />
                      </main>
                      <Footer />
                    </div>
                  } />
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="admin-orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="collections" element={<AdminCollections />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="countdown" element={<AdminCountdown />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="config" element={<AdminConfig />} />
                    <Route path="reviews" element={<AdminReviews />} />
                  </Route>
                </Routes>
                </AnimatePresence>
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