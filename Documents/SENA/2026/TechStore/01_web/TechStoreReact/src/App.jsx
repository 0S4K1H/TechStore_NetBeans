import { HashRouter } from 'react-router-dom'
import { MotionProvider } from './layouts/MotionProvider'
import { AuthProvider } from './providers/AuthProvider'
import { CartProvider } from './providers/CartProvider'
import { FavoritesProvider } from './providers/FavoritesProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRoutes } from './routes/AppRoutes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <MotionProvider>
                <TooltipProvider>
                  <AppRoutes />
                  <Toaster position="top-right" richColors closeButton />
                </TooltipProvider>
              </MotionProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
