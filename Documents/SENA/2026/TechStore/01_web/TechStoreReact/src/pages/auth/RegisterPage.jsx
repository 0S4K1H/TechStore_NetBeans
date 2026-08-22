import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'

import { BrandMark } from '@/components/BrandMark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getLandingPath } from '@/lib/access'
import { useAuth } from '@/providers/AuthProvider'

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [form, setForm] = useState({ username: '', email: '', password: '', nombre: '', ciudad: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const usuario = await signUp(form)
      navigate(getLandingPath(usuario.role), { replace: true })
    } catch (err) {
      setError(err.message || 'No fue posible crear la cuenta. Verifica los datos ingresados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08162F] p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="bg-primary/30 absolute -top-24 -left-24 size-96 rounded-full blur-3xl"
          animate={reduceMotion ? undefined : { opacity: [0.4, 0.7, 0.4] }}
          transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-24 -bottom-24 size-96 rounded-full bg-[#00B5FF]/20 blur-3xl"
          animate={reduceMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
          transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <NavLink
        to="/"
        className="relative z-10 mb-6 flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a la tienda
      </NavLink>

      <motion.section
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark featured className="h-16 w-auto sm:h-20" />
          <p className="mt-4 text-lg font-semibold text-white">Crea tu cuenta</p>
          <p className="mt-1 text-sm text-white/50">Compra, sigue tus pedidos y pide soporte técnico</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="nombre" className="text-white/70">
              Nombre completo
            </Label>
            <Input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={update('nombre')}
              placeholder="Tu nombre"
              autoComplete="name"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-white/70">
              Usuario
            </Label>
            <Input
              id="username"
              type="text"
              value={form.username}
              onChange={update('username')}
              placeholder="tu-usuario"
              autoComplete="username"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/70">
              Correo
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="tu@correo.com"
              autoComplete="email"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ciudad" className="text-white/70">
              Ciudad
            </Label>
            <Input
              id="ciudad"
              type="text"
              value={form.ciudad}
              onChange={update('ciudad')}
              placeholder="Bogotá"
              autoComplete="address-level2"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-white/70">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="Mínimo 5 caracteres"
              autoComplete="new-password"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <AnimatePresence>
            {error ? (
              <motion.p
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="border-destructive/30 bg-destructive/10 text-destructive overflow-hidden rounded-md border px-3 py-2 text-sm"
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          ¿Ya tienes cuenta?{' '}
          <NavLink to="/login" className="text-white hover:underline">
            Inicia sesión
          </NavLink>
        </p>
      </motion.section>
    </main>
  )
}
