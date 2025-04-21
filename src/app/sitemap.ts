import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

// Function to recursively get all page routes
function getPageRoutes(directory: string, basePath: string = ''): string[] {
  const routes: string[] = []
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    const relativePath = path.join(basePath, entry.name)

    if (entry.isDirectory()) {
      // Skip if it's node_modules, .next, or other non-route directories
      if (['node_modules', '.next', 'public', 'styles', 'components', 'contexts', 'services', 'utils'].includes(entry.name)) {
        continue
      }

      // For directories, recursively search for more routes
      routes.push(...getPageRoutes(fullPath, relativePath))
    } else if (
      entry.isFile() && 
      (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'page.ts' || entry.name === 'page.js')
    ) {
      // For page files, extract the route
      const route = basePath.replace(/\/page$/, '')
      // Avoid duplicate root route
      if (route && !routes.includes(route)) {
        routes.push(route)
      }
    }
  }

  return routes
}

// Sitemap generator
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pizzaria-frontend.vercel.app' // Replace with your production URL
  
  // Get page routes from the app directory
  const pagesDirectory = path.join(process.cwd(), 'src', 'app')
  const pageRoutes = getPageRoutes(pagesDirectory)
  
  // Add home route if not already included
  if (!pageRoutes.includes('')) {
    pageRoutes.unshift('')
  }

  // Add dynamic routes based on the app structure
  // Based on the GitHub repository structure, adding some common pizza shop routes
  const dynamicRoutes = [
    '/cardapio',
    '/sobre',
    '/contato',
    '/promocoes',
    '/pedidos',
    '/checkout',
  ]

  // Combine all routes
  const allRoutes = [...new Set([...pageRoutes, ...dynamicRoutes])]

  // Generate sitemap entries
  return allRoutes.map(route => ({
    url: `${baseUrl}${route.startsWith('/') ? route : `/${route}`}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
