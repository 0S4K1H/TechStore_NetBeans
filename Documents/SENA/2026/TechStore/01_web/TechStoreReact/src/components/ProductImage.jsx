import { useEffect, useState } from 'react'

import { CinematicGlow } from '@/components/CinematicGlow'
import { categoryImage, DEFAULT_PRODUCT_IMAGE, productImage } from '@/lib/productImages'
import { cn } from '@/lib/utils'

export function ProductImage({ idProducto, categoria, nombre, className }) {
  const preferredSrc = productImage(idProducto) ?? categoryImage(categoria)
  const [src, setSrc] = useState(preferredSrc)

  useEffect(() => {
    setSrc(preferredSrc)
  }, [preferredSrc])

  function handleError() {
    setSrc((current) => {
      if (current === DEFAULT_PRODUCT_IMAGE) return current
      return DEFAULT_PRODUCT_IMAGE
    })
  }

  return (
    <div
      className={cn(
        'group relative isolate overflow-hidden rounded-xl bg-[#050B17]',
        className
      )}
    >
      <CinematicGlow className="opacity-75 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_38%,rgba(2,8,23,0.18))]" />
      <img
        src={src}
        alt={nombre || 'TechStore'}
        className="relative z-10 size-full object-contain object-center p-2 transition-transform duration-700 ease-out group-hover:scale-[1.03] hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
    </div>
  )
}
