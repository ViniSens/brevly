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
          // Increment visit counter first
          await incrementVisitCount(shortUrl)
          
          // Add a small delay to show the redirect page (1.5 seconds)
          setTimeout(() => {
            // Add protocol if missing
            let urlToRedirect = data.original_url
            if (!urlToRedirect.startsWith('http://') && !urlToRedirect.startsWith('https://')) {
              urlToRedirect = 'https://' + urlToRedirect
            }
            
            // Redirect to the original URL
            window.location.href = urlToRedirect
          }, 1500)
          
        } catch (error) {
          console.error('Error incrementing visit count:', error)
          // Still redirect even if counter increment fails, but with delay
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

  // Show loading state while fetching data OR while waiting for redirect
  if (isLoading || data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        {/* Desktop image - hidden on mobile */}
        <img 
          src="/redirecting_desktop.png" 
          alt="Redirecionando" 
          className="hidden md:block max-w-full h-auto"
        />
        
        {/* Mobile image - hidden on desktop */}
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