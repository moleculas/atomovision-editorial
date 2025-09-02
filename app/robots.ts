import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/checkout/', '/cart/', '/success/', '/cancel/'],
      crawlDelay: 1,
    },
    sitemap: 'https://www.atomovision.es/sitemap.xml',
  }
}
