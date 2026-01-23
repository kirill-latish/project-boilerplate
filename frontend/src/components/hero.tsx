import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-800/30 via-transparent to-transparent" />
      
      {/* 3D Graphics Placeholder - Right side */}
      <div className="absolute right-0 top-1/4 w-1/2 h-3/4 opacity-40">
        <div className="relative w-full h-full">
          {/* Geometric shapes simulation */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-gray-700 to-gray-900 transform rotate-45 rounded-lg shadow-2xl" />
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-tl from-white/10 to-white/5 transform -rotate-12 rounded-lg shadow-xl" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-800 transform rotate-12 shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          
          {/* Coin/Token element */}
          <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-2xl flex items-center justify-center border-4 border-gray-200">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-300 rounded-lg transform rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Unlock growth with every payment
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-xl">
            Run payments, extend net terms and automate collections compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Get started
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Talk to a human
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  )
}
