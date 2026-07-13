import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminRoute from './components/AdminRoute'

const Home = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ShippingPage = lazy(() => import('./pages/ShippingPage'))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const AdminProducts = lazy(() => import('./admin/AdminProducts'))
const AdminOrders = lazy(() => import('./admin/AdminOrders'))
const AdminCustomers = lazy(() => import('./admin/AdminCustomers'))

function Page({ children }) {
  return <div className="animate-fade-in">{children}</div>
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-5 h-5 border border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  )
}

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
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-xs">
                  Skip to content
                </a>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Page><Home /></Page>} />
                    <Route path="/product/:id" element={<Page><ProductDetail /></Page>} />
                    <Route path="/category/:slug" element={<Page><CategoryPage /></Page>} />
                    <Route path="/cart" element={<Page><Cart /></Page>} />
                    <Route path="/checkout" element={<Page><Checkout /></Page>} />
                    <Route path="/login" element={<Page><Login /></Page>} />
                    <Route path="/register" element={<Page><Register /></Page>} />
                    <Route path="/wishlist" element={<Page><WishlistPage /></Page>} />
                    <Route path="/about" element={<Page><AboutPage /></Page>} />
                    <Route path="/shipping" element={<Page><ShippingPage /></Page>} />
                    <Route path="/returns" element={<Page><ReturnsPage /></Page>} />
                    <Route path="/faq" element={<Page><FAQPage /></Page>} />
                    <Route path="/privacy" element={<Page><PrivacyPage /></Page>} />
                    <Route path="/terms" element={<Page><TermsPage /></Page>} />
                    <Route path="/gift-cards" element={<Page><ComingSoon title="Gift Cards" description="Gift cards coming soon." /></Page>} />
                    <Route path="/sustainability" element={<Page><ComingSoon title="Sustainability" description="Full sustainability report coming soon." /></Page>} />
                    <Route path="/press" element={<Page><ComingSoon title="Press" description="Press kit and media resources coming soon." /></Page>} />
                    <Route path="/contact" element={<Page><ComingSoon title="Contact" description="Contact form coming soon. Email us at hello@atelier.com." /></Page>} />
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<Dashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                    </Route>
                    <Route path="*" element={<Page><NotFound /></Page>} />
                  </Routes>
                </Suspense>
              </Layout>
            </WishlistProvider>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
