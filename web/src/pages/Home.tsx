import { useState, type FormEvent } from 'react'
import {
  createShortLink,
  getLinks,
  deleteLink,
  exportLinksToCSV,
} from '../services/apiService'
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

  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  })

  const { mutateAsync: createLinkFn, isPending: isCreatingLink } = useMutation({
    mutationFn: ({ url, name }: { url: string; name?: string }) =>
      createShortLink(url, name),
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
        name: customName.trim() || undefined,
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
      'Tem certeza de que deseja excluir este link? Esta ação não pode ser desfeita.',
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

  const hasLinks = !!links && links.length > 0

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8 text-gray-600">
      {/* “Quadro” central, igual ao frame do Figma */}
      <div className="w-full max-w-5xl bg-gray-100 rounded-3xl shadow-2xl px-4 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Logo alinhada à esquerda */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2">
            <img
              src="/link.svg"
              alt="Link"
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
            <span className="text-xl sm:text-2xl font-semibold text-brand-base">
              brev.ly
            </span>
          </div>
        </header>

        {/* Grid principal: Novo link (esquerda) + Meus links (direita) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* CARD: Novo link */}
          <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
              Novo link
            </h2>

            <form
              onSubmit={handleCreateShortLink}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <Input
                label="Link original"
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
                className="w-full text-sm sm:text-base font-semibold py-3 sm:py-3.5 mt-2 shadow-md hover:shadow-lg"
              >
                <Link className="w-4 h-4" />
                Salvar link
              </Button>
            </form>
          </section>

          {/* CARD: Meus links */}
          <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col min-h-[260px]">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                Meus links
              </h2>

              <Button
                type="button"
                variant="secondary"
                onClick={downloadCSV}
                disabled={!links}
                className="text-xs sm:text-sm font-medium bg-gray-100 hover:bg-gray-200 border-gray-300 w-full sm:w-auto px-3 py-2 sm:py-2.5"
              >
                <img
                  src="/download-simple.svg"
                  alt="Download"
                  className="w-4 h-4 opacity-70"
                />
                Baixar CSV
              </Button>
            </header>

            {/* CONTEÚDO DO CARD: loading / erro / lista / vazio, tudo aqui dentro igual ao Figma */}
            <div className="flex-1 mt-1">
              {/* Loading */}
              {isLoading && (
                <div className="flex h-full items-center justify-center py-10">
                  <p className="text-sm text-gray-500">Carregando links...</p>
                </div>
              )}

              {/* Erro */}
              {isError && !isLoading && (
                <div className="flex h-full items-center justify-center py-10">
                  <p className="text-sm text-danger">
                    Ocorreu um erro ao buscar os links.
                  </p>
                </div>
              )}

              {/* Lista de links */}
              {!isLoading && !isError && hasLinks && (
                <div className="mt-2 max-h-[26rem] overflow-y-auto pr-1 space-y-3">
                  <ul className="space-y-2">
                    {links!.map((link) => {
                      const displayName = link.short_url || link.id
                      const shortUrl = `brev.ly/${displayName}`
                      const workingUrl = `${import.meta.env.VITE_FRONTEND_URL}/${displayName}`

                      return (
                        <li
                          key={link.id}
                          className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleLinkClickWithRedirect(displayName)
                              }
                              className="text-sm sm:text-[15px] font-semibold text-brand-base hover:underline hover:text-brand-dark transition-colors text-left truncate max-w-[180px] sm:max-w-xs"
                              title={`Clique para abrir: ${link.original_url}`}
                            >
                              {shortUrl}
                            </button>

                            <p
                              className="text-xs text-gray-500 mt-1 truncate max-w-[200px] sm:max-w-sm"
                              title={link.original_url}
                            >
                              {link.original_url || 'URL não disponível'}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                              {link.access_count || 0} acessos
                            </span>

                            <div className="flex items-center gap-2">
                              <IconButton
                                onClick={() =>
                                  handleCopyToClipboard(workingUrl)
                                }
                                title="Copiar link"
                                className="p-1.5 sm:p-2"
                              >
                                <img
                                  src="/copy-simple.svg"
                                  alt="Copy"
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                />
                              </IconButton>

                              <IconButton
                                variant="danger"
                                onClick={() =>
                                  handleDeleteLink(link.short_url!)
                                }
                                isLoading={
                                  deletingId === link.short_url &&
                                  isDeletingLink
                                }
                                title="Excluir link"
                                className="p-1.5 sm:p-2"
                              >
                                <img
                                  src="/trash.svg"
                                  alt="Delete"
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                />
                              </IconButton>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Estado vazio - igual ao Figma: dentro do card Meus links */}
              {!isLoading && !isError && !hasLinks && (
                <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
                  <p className="text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase text-center">
                    Ainda não existem links cadastrados
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
