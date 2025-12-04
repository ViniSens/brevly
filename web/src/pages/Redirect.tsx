import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLinkByCode, incrementVisitCount } from '../services/apiService'

export function RedirectPage() {
  const navigate = useNavigate()
  const { shortUrl } = useParams<{ shortUrl: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['redirectLink', shortUrl],
    queryFn: () => getLinkByCode(shortUrl!),
    retry: false,
    enabled: !!shortUrl,
  })

  useEffect(() => {
    const handleRedirect = async () => {
      if (data?.original_url && shortUrl) {
        try {
          await incrementVisitCount(shortUrl)
          setTimeout(() => {
            let urlToRedirect = data.original_url
            if (!urlToRedirect.startsWith('http://') && !urlToRedirect.startsWith('https://')) {
              urlToRedirect = 'https://' + urlToRedirect
            }
            window.location.href = urlToRedirect
          }, 9500)
          
        } catch (error) {
          console.error('Error incrementing visit count:', error)
          setTimeout(() => {
            let urlToRedirect = data.original_url
            if (!urlToRedirect.startsWith('http://') && !urlToRedirect.startsWith('https://')) {
              urlToRedirect = 'https://' + urlToRedirect
            }
            window.location.href = urlToRedirect
          }, 1500)
        }
      }
    }

    handleRedirect()
  }, [data, shortUrl])

  useEffect(() => {
    if (isError) {
      navigate('/not-found', { replace: true })
    }
  }, [isError, navigate])

  if (isLoading || data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <img 
          src="/redirecting_desktop.png" 
          alt="Redirecionando" 
          className="hidden md:block max-w-full h-auto"
        />
        <img 
          src="/redirecting_mobile.png" 
          alt="Redirecionando" 
          className="block md:hidden max-w-full h-auto"
        />
        
        <div className="text-center mt-6">
          <h1 className="text-4xl font-bold text-gray-600 mb-2">Redirecionando...</h1>
          <p className="text-gray-500 text-lg">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return null
}