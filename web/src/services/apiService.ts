import { api } from '../lib/axios'

interface ShortLink {
  id: string
  code: string
  original_url: string
  short_url?: string
  created_at: string
  access_count?: number 
}

export async function createShortLink(original_url: string, short_url?: string): Promise<ShortLink> {
  const response = await api.post('/api/links', {
    original_url: original_url,
    ...(short_url && { short_url: short_url }), 
  })

  return response.data
}

export async function getLinks(): Promise<ShortLink[]> {
  const response = await api.get('/api/links')
  return response.data
}

export async function deleteLink(id: string): Promise<void> {
  await api.delete(`/api/links/${id}`)
}

export async function getLinkByCode(id: string): Promise<ShortLink> {
  const response = await api.get(`/api/links/${id}`)
  return response.data
}

export async function incrementVisitCount(id: string): Promise<void> {
  await api.post(`/api/links/${id}/hit`)
}

export async function exportLinksToCSV(): Promise<{ csvUrl: string }> {
  const response = await api.post('/api/links/export/csv')
  return response.data
}