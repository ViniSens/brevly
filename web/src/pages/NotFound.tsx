export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Desktop image - hidden on mobile */}
      <img 
        src="/NotFound_desktop.png" 
        alt="Página não encontrada" 
        className="hidden md:block max-w-full h-auto"
      />
      
      {/* Mobile image - hidden on desktop */}
      <img 
        src="/NotFound_mobile.png" 
        alt="Página não encontrada" 
        className="block md:hidden max-w-full h-auto"
      />
      
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold text-gray-600 mb-2">404</h1>
        <p className="text-gray-500 text-lg">Página não encontrada</p>
      </div>
    </div>
  )
}