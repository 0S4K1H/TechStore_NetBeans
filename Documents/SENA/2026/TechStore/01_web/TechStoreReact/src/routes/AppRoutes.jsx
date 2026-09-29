import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import { AdminShell } from '../layouts/AdminShell'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { ProductosPage } from '../pages/admin/ProductosPage'
import { PedidosPage } from '../pages/admin/PedidosPage'
import { CarritosPage } from '../pages/admin/CarritosPage'
import { UsuariosPage } from '../pages/admin/UsuariosPage'
import { ProveedoresPage } from '../pages/admin/ProveedoresPage'
import { TicketsPage } from '../pages/admin/TicketsPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { StorefrontPage } from '../pages/public/StorefrontPage'
import { CatalogoPage } from '../pages/public/CatalogoPage'
import { ProductoDetailPage } from '../pages/public/ProductoDetailPage'
import { CarritoPage } from '../pages/public/CarritoPage'
import { CheckoutPage } from '../pages/public/CheckoutPage'
import { MisPedidosPage } from '../pages/public/MisPedidosPage'
import { SoportePage } from '../pages/public/SoportePage'
import { EntregaPage } from '../pages/public/EntregaPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { canAccessModule, getLandingPath, isInternalRole } from '../lib/access'

// ponytail: recharts es pesado, se separa del bundle principal.
const ReportesPage = lazy(() => import('../pages/admin/ReportesPage').then((m) => ({ default: m.ReportesPage })))

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2Icon className="text-muted-foreground size-6 animate-spin" />
    </div>
  )
}

function RequireModule({ moduleKey, children }) {
  const { session } = useAuth()
  if (!canAccessModule(session?.role, moduleKey)) {
    return <Navigate to="/app/dashboard" replace />
  }
  return children
}

function LandingGate() {
  const { session, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (!session) {
    return <StorefrontPage />
  }

  return isInternalRole(session.role) ? (
    <Navigate to={getLandingPath(session.role)} replace />
  ) : (
    <StorefrontPage />
  )
}

function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function RequireInternal({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isInternalRole(session.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingGate />} />
      <Route path="/entrega" element={<EntregaPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/productos" element={<CatalogoPage />} />
      <Route path="/productos/:id" element={<ProductoDetailPage />} />
      <Route
        path="/carrito"
        element={
          <RequireAuth>
            <CarritoPage />
          </RequireAuth>
        }
      />
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mis-pedidos"
        element={
          <RequireAuth>
            <MisPedidosPage />
          </RequireAuth>
        }
      />
      <Route
        path="/soporte"
        element={
          <RequireAuth>
            <SoportePage />
          </RequireAuth>
        }
      />
      <Route
        path="/app"
        element={
          <RequireInternal>
            <AdminShell />
          </RequireInternal>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="productos"
          element={
            <RequireModule moduleKey="productos">
              <ProductosPage />
            </RequireModule>
          }
        />
        <Route
          path="pedidos"
          element={
            <RequireModule moduleKey="pedidos">
              <PedidosPage />
            </RequireModule>
          }
        />
        <Route
          path="carritos"
          element={
            <RequireModule moduleKey="carritos">
              <CarritosPage />
            </RequireModule>
          }
        />
        <Route
          path="usuarios"
          element={
            <RequireModule moduleKey="usuarios">
              <UsuariosPage />
            </RequireModule>
          }
        />
        <Route
          path="proveedores"
          element={
            <RequireModule moduleKey="proveedores">
              <ProveedoresPage />
            </RequireModule>
          }
        />
        <Route
          path="tickets"
          element={
            <RequireModule moduleKey="tickets">
              <TicketsPage />
            </RequireModule>
          }
        />
        <Route
          path="reportes"
          element={
            <RequireModule moduleKey="reportes">
              <Suspense fallback={<FullScreenLoader />}>
                <ReportesPage />
              </Suspense>
            </RequireModule>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
