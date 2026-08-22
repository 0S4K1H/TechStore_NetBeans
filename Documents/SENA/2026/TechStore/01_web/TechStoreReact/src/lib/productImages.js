import { assetUrl } from './assetPath'

// Visuales cinematográficos alineados al catálogo real. Clave = idProducto real de la base de datos.
export const PRODUCT_IMAGES = {
  p1: assetUrl('images/visuals/laptop-cinematic.png'),
  p2: assetUrl('images/visuals/smartphone-cinematic.png'),
  p3: assetUrl('images/visuals/accessories-cinematic.png'),
  p4: assetUrl('images/visuals/accessories-cinematic.png'),
  p5: assetUrl('images/visuals/components-cinematic.png'),
  p6: assetUrl('images/visuals/peripherals-cinematic.png'),
  p7: assetUrl('images/visuals/components-cinematic.png'),
  p8: assetUrl('images/visuals/peripherals-cinematic.png'),
  p9: assetUrl('images/visuals/printer-cinematic.png'),
}

export const CATEGORY_IMAGES = {
  laptop: assetUrl('images/visuals/laptop-cinematic.png'),
  movil: assetUrl('images/visuals/smartphone-cinematic.png'),
  accesorio: assetUrl('images/visuals/accessories-cinematic.png'),
  componente: assetUrl('images/visuals/components-cinematic.png'),
  periferico: assetUrl('images/visuals/peripherals-cinematic.png'),
}

export const DEFAULT_PRODUCT_IMAGE = assetUrl('images/visuals/product-fallback-cinematic.png')

export function productImage(idProducto) {
  return PRODUCT_IMAGES[idProducto] ?? null
}

export function categoryImage(categoria) {
  return CATEGORY_IMAGES[categoria] ?? DEFAULT_PRODUCT_IMAGE
}
