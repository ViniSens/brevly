import { api } from '../lib/axios'

interface ShortLink {
  id: string
  code: string
  original_url: string
  custom_name?: string
  created_at: string
  access_count?: number // Add this field for visit counter
}

export async function createShortLink(original_url: string, customName?: string): Promise<ShortLink> {
  const response = await api.post('/api/links', {
    original_url: original_url,
    ...(customName && { custom_name: customName }), // Only include if customName is provided
  })

  return response.data
}

// Nova função para buscar os links
export async function getLinks(): Promise<ShortLink[]> {
  const response = await api.get('/api/links')
  return response.data
}

// Nova função para deletar o link
export async function deleteLink(code: string): Promise<void> {
  await api.delete(`/api/links/${code}`)
}

// --- NOVA FUNÇÃO: Buscar link pelo código ---
export async function getLinkByCode(code: string): Promise<ShortLink> {
  const response = await api.get(`/api/links/${code}`)
  return response.data
}

// --- NOVA FUNÇÃO: Incrementar contador de visitas ---
export async function incrementVisitCount(code: string): Promise<void> {
  await api.post(`/api/links/${code}/visit`)
}

// --- NOVA FUNÇÃO: Exportar CSV ---
export async function exportLinksToCSV(): Promise<{ csvUrl: string }> {
  const response = await api.post('/api/links/export/csv')
  return response.data
}