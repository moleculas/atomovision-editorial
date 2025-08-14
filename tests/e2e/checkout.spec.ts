import { test, expect } from '@playwright/test'

test.describe('Flujo de compra completo', () => {
  test('Usuario puede añadir libro al carrito y proceder al checkout', async ({ page }) => {
    // Ir a la página principal
    await page.goto('/')
    
    // Esperar a que cargue la escena o el fallback
    await page.waitForLoadState('networkidle')
    
    // Navegar al catálogo
    await page.click('text=Catálogo')
    await page.waitForURL('**/catalog')
    
    // Añadir primer libro al carrito
    await page.locator('[aria-label="Añadir al carrito"]').first().click()
    
    // Verificar que el contador del carrito se actualizó
    await expect(page.locator('header').getByText('1')).toBeVisible()
    
    // Ir al carrito
    await page.click('[aria-label="Carrito"]')
    await page.waitForURL('**/cart')
    
    // Verificar que el libro está en el carrito
    await expect(page.locator('h1')).toContainText('Tu carrito')
    await expect(page.locator('[class*="book-"]')).toHaveCount(1)
    
    // Proceder al checkout
    await page.click('text=Proceder al pago')
    
    // Verificar redirección a Stripe (en desarrollo mostraría error)
    // En producción esto redireccionaría a Stripe Checkout
  })
  
  test('Modo 2D funciona correctamente', async ({ page }) => {
    // Forzar modo 2D
    await page.goto('/?mode=2d')
    
    // Verificar que no hay canvas 3D
    await expect(page.locator('canvas')).not.toBeVisible()
    
    // Verificar que el catálogo 2D está visible
    await expect(page.locator('[class*="grid"]')).toBeVisible()
  })
  
  test('Búsqueda y filtros funcionan', async ({ page }) => {
    await page.goto('/catalog')
    
    // Abrir filtros
    await page.click('text=Filtros')
    
    // Seleccionar categoría
    await page.click('text=Ficción')
    
    // Verificar que los resultados se actualizan
    await expect(page.locator('text=Mostrando')).toBeVisible()
  })
})
