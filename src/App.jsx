import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Breadcrumbs from './components/Breadcrumbs'
import AdminRoute from './components/AdminRoute'
import AdminBlock from './components/AdminBlock'
import { ToastContainer } from './components/Toast'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Category = lazy(() => import('./pages/Category'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const OrderHistory = lazy(() => import('./pages/OrderHistory'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Profile = lazy(() => import('./pages/Profile'))
const StaticContent = lazy(() => import('./pages/StaticContent'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./admin/AdminProducts'))
const AdminCategories = lazy(() => import('./admin/AdminCategories'))
const AdminOrders = lazy(() => import('./admin/AdminOrders'))
const AdminCustomers = lazy(() => import('./admin/AdminCustomers'))
const AdminPromoCodes = lazy(() => import('./admin/AdminPromoCodes'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
})

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (isAdmin) return <>{children}</>

  return (
    <>
      {!isAuth && <Navbar />}
      <main id="main-content" className="animate-fade-in" key={pathname}>
        {!isAdmin && <Breadcrumbs />}
        {children}
      </main>
      {!isAuth && <Footer />}
      {!isAuth && <ScrollToTop />}
      <ToastContainer />
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <WishlistProvider>
                <Layout>
                  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-xs">
                    Skip to content
                  </a>
                  <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                      <Routes>
                      <Route path="/" element={<AdminBlock><Home /></AdminBlock>} />
                      <Route path="/product/:id" element={<AdminBlock><ProductDetail /></AdminBlock>} />
                      <Route path="/category/:slug" element={<AdminBlock><Category /></AdminBlock>} />
                      <Route path="/cart" element={<AdminBlock><Cart /></AdminBlock>} />
                      <Route path="/checkout" element={<AdminBlock><Checkout /></AdminBlock>} />
                      <Route path="/order-success" element={<AdminBlock><OrderSuccess /></AdminBlock>} />
                      <Route path="/order/:id/track" element={<AdminBlock><OrderTracking /></AdminBlock>} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/wishlist" element={<AdminBlock><Wishlist /></AdminBlock>} />
                      <Route path="/orders" element={<AdminBlock><OrderHistory /></AdminBlock>} />
                      <Route path="/profile" element={<AdminBlock><Profile /></AdminBlock>} />
                      <Route path="/about" element={<AdminBlock><StaticContent /></AdminBlock>} />
                      <Route path="/shipping" element={<AdminBlock><StaticContent /></AdminBlock>} />
                      <Route path="/returns" element={<AdminBlock><StaticContent /></AdminBlock>} />
                      <Route path="/faq" element={<AdminBlock><StaticContent /></AdminBlock>} />
                      <Route path="/privacy" element={<AdminBlock><StaticContent /></AdminBlock>} />
                      <Route path="/terms" element={<AdminBlock><StaticContent /></AdminBlock>} />
                      <Route path="/gift-cards" element={<AdminBlock><ComingSoon title="Gift Cards" description="Gift cards coming soon." /></AdminBlock>} />
                      <Route path="/sustainability" element={<AdminBlock><ComingSoon title="Sustainability" description="Full sustainability report coming soon." /></AdminBlock>} />
                      <Route path="/press" element={<AdminBlock><ComingSoon title="Press" description="Press kit coming soon." /></AdminBlock>} />
                      <Route path="/contact" element={<AdminBlock><ComingSoon title="Contact" description="Email us at hello@atelier.com." /></AdminBlock>} />
                      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="promos" element={<AdminPromoCodes />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  </ErrorBoundary>
                </Layout>
              </WishlistProvider>
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
