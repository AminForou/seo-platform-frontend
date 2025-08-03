import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_CANONICAL_URL;
  
  // Define your routes here
  const routes = [
    '',
    '/contact',
    '/about',
    '/tools/mini-crawler',
    '/tools/bulk-url-opener',
    '/tools/site-structure-analyzer',
    '/tools/robots-txt-analyzer',
    // Add more routes as needed
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }))
}