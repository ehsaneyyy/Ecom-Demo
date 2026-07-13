import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminRoute from './components/AdminRoute'
import { ToastContainer } from './components/Toast'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import WishlistPage from './pages/WishlistPage'
import AboutPage from './pages/AboutPage'
import ShippingPage from './pages/ShippingPage'
import ReturnsPage from './pages/ReturnsPage'
import FAQPage from './pages/FAQPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminCustomers from './admin/AdminCustomers'

function Layout({ children }) {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const isAuth = pathname === '/login' || pathname === '/register'

  if (isAdmin) return <>{children}</>

  return (
    <>
      {!isAuth && <Navbar />}
      <main id="main-content">{children}</main>
      {!isAuth && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <WishlistProvider>
              <Layout>
                <ToastContainer />
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-xs">
                  Skip to content
                </a>
                <Routes>
                  <Route path="/" element={<div className="animate-fade-in"><Home /></div>} />
                  <Route path="/product/:id" element={<div className="animate-fade-in"><ProductDetail /></div>} />
                  <Route path="/category/:slug" element={<div className="animate-fade-in"><CategoryPage /></div>} />
                  <Route path="/cart" element={<div className="animate-fade-in"><Cart /></div>} />
                  <Route path="/checkout" element={<div className="animate-fade-in"><Checkout /></div>} />
                  <Route path="/login" element={<div className="animate-fade-in"><Login /></div>} />
                  <Route path="/register" element={<div className="animate-fade-in"><Register /></div>} />
                  <Route path="/wishlist" element={<div className="animate-fade-in"><WishlistPage /></div>} />
                  <Route path="/about" element={<div className="animate-fade-in"><AboutPage /></div>} />
                  <Route path="/shipping" element={<div className="animate-fade-in"><ShippingPage /></div>} />
                  <Route path="/returns" element={<div className="animate-fade-in"><ReturnsPage /></div>} />
                  <Route path="/faq" element={<div className="animate-fade-in"><FAQPage /></div>} />
                  <Route path="/privacy" element={<div className="animate-fade-in"><PrivacyPage /></div>} />
                  <Route path="/terms" element={<div className="animate-fade-in"><TermsPage /></div>} />
                  <Route path="/gift-cards" element={<div className="animate-fade-in"><ComingSoon title="Gift Cards" description="Gift cards will be available soon. Share the gift of considered living." /></div>} />
                  <Route path="/sustainability" element={<div className="animate-fade-in"><ComingSoon title="Sustainability" description="Our full sustainability report is coming soon." /></div>} />
                  <Route path="/press" element={<div className="animate-fade-in"><ComingSoon title="Press" description="Press kit and media resources coming soon." /></div>} />
                  <Route path="/contact" element={<div className="animate-fade-in"><ComingSoon title="Contact" description="Our contact form is coming soon. For now, email us at hello@atelier.com." /></div>} />
                  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                  </Route>
                  <Route path="*" element={<div className="animate-fade-in"><NotFound /></div>} />
                </Routes>
              </Layout>
            </WishlistProvider>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
