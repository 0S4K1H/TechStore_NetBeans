import { CpuIcon, HeadphonesIcon, KeyboardIcon, LaptopIcon, SmartphoneIcon } from 'lucide-react'
import { assetUrl } from './assetPath'

// Coincide exacto con el ENUM de la tabla productos. No inventar categorías sin datos reales detrás.
export const CATEGORIAS = [
  { value: 'laptop', label: 'Portátiles', icon: LaptopIcon, image: assetUrl('images/visuals/laptop-cinematic.png') },
  { value: 'movil', label: 'Móviles', icon: SmartphoneIcon, image: assetUrl('images/visuals/smartphone-cinematic.png') },
  { value: 'accesorio', label: 'Accesorios', icon: HeadphonesIcon, image: assetUrl('images/visuals/accessories-cinematic.png') },
  { value: 'componente', label: 'Componentes', icon: CpuIcon, image: assetUrl('images/visuals/components-cinematic.png') },
  { value: 'periferico', label: 'Periféricos', icon: KeyboardIcon, image: assetUrl('images/visuals/peripherals-cinematic.png') },
]

export function categoriaLabel(value) {
  return CATEGORIAS.find((c) => c.value === value)?.label ?? value
}
