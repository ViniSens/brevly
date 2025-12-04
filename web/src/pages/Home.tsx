import {  useState, type FormEvent } from 'react'
import { createShortLink, getLinks, deleteLink, incrementVisitCount, exportLinksToCSV } from '../services/apiService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { IconButton } from '../components/IconButton'
import { Link } from 'lucide-react'

export function Home() {
  const [url, setUrl] = useState('')
  const [customName, setCustomName] = useState('')
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: links, isLoading, isError } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  })

  const { mutateAsync: createLinkFn, isPending: isCreatingLink } = useMutation({
    mutationFn: ({ url, name }: { url: string; name?: string }) => createShortLink(url, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const { mutateAsync: deleteLinkFn, isPending: isDeletingLink } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
    onSettled: () => {
      setDeletingId(null)
    },
  })

async function handleCreateShortLink(event: FormEvent) {
  event.preventDefault()
  if (!url.trim()) return

  try {
    const newLink = await createLinkFn({ 
      url: url.trim(), 
      name: customName.trim() || undefined 
    })
    const displayName = newLink.short_url
    alert(`Link criado: brev.ly/${displayName}`)
    setUrl('')
    setCustomName('')
  } catch (error: any) {
    console.error('Erro ao criar o link:', error)
    if (error?.response?.status === 400 && error?.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('Não foi possível criar o link.')
    }
  }
}

async function handleDeleteLink(id: string) {
  const confirmDelete = window.confirm(
    'Tem certeza de que deseja excluir este link? Esta ação não pode ser desfeita.'
  )
  
  if (!confirmDelete) {
    return 
  }

  setDeletingId(id)
  try {
    await deleteLinkFn(id)
    alert('Link excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir o link:', error)
    alert('Não foi possível excluir o link.')
  }
}
  async function handleCopyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link copiado para a área de transferência!')
    } catch (err) {
      console.error('Falha ao copiar o texto: ', err)
      alert('Não foi possível copiar o link.')
    }
  }

  function handleLinkClickWithRedirect(displayName: string) {
    const redirectUrl = `${import.meta.env.VITE_FRONTEND_URL}/${displayName}`
    window.open(redirectUrl, '_blank', 'noopener,noreferrer')
  }

  const hasLinksToShow = links && links.length > 0

  async function downloadCSV() {
    if (!links || links.length === 0) {
      alert('Não há links para exportar.')
      return
    }

    try {
      const { csvUrl } = await exportLinksToCSV()
      window.open(csvUrl, '_blank')
      
    } catch (error) {
      console.error('Erro ao exportar CSV:', error)
      alert('Não foi possível exportar o CSV.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-600">
      {/* Container with responsive padding */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Header - responsive spacing and sizing */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 flex items-center justify-center gap-2">
            <img src="/link.svg" alt="Link" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            <span className="text-brand-base">brev.ly</span>
          </h1>
        </header>
        
        {/* Main content with improved responsive layout */}
          <div className={`
            ${hasLinksToShow 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8" 
              : "flex justify-center"
            }
          `}>          
          {/* Form section - responsive width and spacing */}
          <div className={`
            ${hasLinksToShow 
              ? "lg:col-span-1 w-full" 
              : "w-full max-w-md"
            }
          `}>
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-md">
              <form
                onSubmit={handleCreateShortLink}
                className="flex flex-col gap-4 sm:gap-5"
              >
                <Input
                  label="Link Original"
                  name="url"
                  type="url"
                  placeholder="https://www.exemplo.com.br"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <Input
                  label="Link encurtado"
                  name="customName"
                  type="text"
                  prefix="brev.ly/"
                  placeholder="meu-link-personalizado"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
                <Button
                  type="submit"
                  isLoading={isCreatingLink}
                  className="w-full text-sm sm:text-md font-semibold py-3 sm:py-4"
                >
                  <Link className="w-4 h-4" />
                  Salvar
                </Button>
              </form>
            </div>
          </div>

          {/* Table section - improved responsive design */}
          {hasLinksToShow && (
            <div className="xl:col-span-2 w-full">
              <div className="lg:col-span-1 xl:col-span-2 w-full">
                
                {/* Header with responsive layout */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-600">Meus Links</h2>
                  <Button
                    variant="secondary"
                    onClick={downloadCSV}
                    className="text-xs sm:text-sm group w-full sm:w-auto bg-gray-200 hover:bg-gray-300 py-2 sm:py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2"
                  >
                    <img 
                      src="/download-simple.svg" 
                      alt="Download" 
                      className="w-4 h-4 opacity-50 group-hover:opacity-100 group-active:opacity-100 transition-opacity" 
                    />
                    Baixar CSV
                  </Button>
                </div>
                
                {/* Responsive table container */}
                <div className="overflow-x-auto">
                  <div className="max-h-[28rem] sm:max-h-96 lg:max-h-[32rem] overflow-y-auto custom-scrollbar">
                    <table className="min-w-full text-left">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Link Encurtado
                          </th>
                          <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            URL Original
                          </th>
                          <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                            Visitas
                          </th>
                          <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {links.map((link) => {
                          const displayName = link.short_url || link.id
                          const shortUrl = `brev.ly/${displayName}`
                          const workingUrl = `${import.meta.env.VITE_FRONTEND_URL}/${displayName}`
                          
                          return (
                            <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                              {/* Short URL column - responsive */}
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                <div className="flex flex-col sm:block">
                                  <button
                                    onClick={() => handleLinkClickWithRedirect(displayName)}
                                    className="text-xs sm:text-sm font-semibold text-brand-base hover:underline cursor-pointer text-left transition-colors hover:text-brand-dark truncate max-w-[120px] sm:max-w-xs"
                                    title={`Clique para abrir: ${link.original_url} (será redirecionado)`}
                                  >
                                    {shortUrl}
                                  </button>
                                  {/* Show original URL on mobile below short URL */}
                                  <div className="text-xs text-gray-500 mt-1 sm:hidden truncate max-w-[120px]" title={link.original_url}>
                                    {link.original_url || 'URL não disponível'}
                                  </div>
                                </div>
                              </td>
                              
                              {/* Original URL column - hidden on mobile */}
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 hidden sm:table-cell">
                                <div className="max-w-[200px] lg:max-w-xs truncate" title={link.original_url}>
                                  {link.original_url || 'URL não disponível'}
                                </div>
                              </td>
                              
                              {/* Visit count - responsive */}
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 text-center">
                                {link.access_count || 0}
                              </td>
                              
                              {/* Actions - responsive */}
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                  <IconButton
                                    onClick={() => handleCopyToClipboard(workingUrl)}
                                    title="Copiar link"
                                    className="p-1.5 sm:p-2"
                                  >
                                    <img src="/copy-simple.svg" alt="Copy" className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </IconButton>
                                  <IconButton
                                    variant="danger"
                                    onClick={() => handleDeleteLink(link.short_url!)}
                                    isLoading={deletingId === link.short_url && isDeletingLink}
                                    title="Excluir link"
                                    className="p-1.5 sm:p-2"
                                  >
                                    <img src="/trash.svg" alt="Delete" className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </IconButton>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading and error states - responsive */}
        {!hasLinksToShow && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="w-full max-w-md">
              {isLoading && (
                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
                  <p className="text-sm sm:text-base">Carregando links...</p>
                </div>
              )}
              
              {isError && (
                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
                  <p className="text-danger text-sm sm:text-base">Ocorreu um erro ao buscar os links.</p>
                </div>
              )}
              
              {links?.length === 0 && !isLoading && (
                <div className="bg-white rounded-lg shadow-md p-8 sm:p-10 text-center text-gray-400">
                  <p className="text-sm sm:text-md font-semibold">Nenhum link encurtado ainda. Comece a criar o seu!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}