/**
 * Genera un slug amigable a partir del título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y final
}
