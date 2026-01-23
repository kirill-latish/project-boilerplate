import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Video, FileText, RefreshCw } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Create articles and videos faster — with AI that actually{" "}
                <span className="text-orange-500">understands</span> your content
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Write, refine, and structure articles.
                <br />
                Edit, enhance, and repurpose videos.
                <br />
                <span className="font-medium">All in one AI-augmented workspace.</span>
              </p>
            </div>

            {/* Key Bullets */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  AI-assisted article drafting, rewriting, and structuring
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Video className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Smart video editing with scene-aware AI tools
                </span>
              </li>
              <li className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Turn articles into videos and videos into articles
                </span>
              </li>
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/sign-up">Start for free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/#pricing">View pricing</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Visual Mockup */}
          <div className="relative">
            <div className="relative rounded-lg border border-gray-800 bg-gray-900/50 p-4 shadow-2xl">
              {/* Split View Mockup */}
              <div className="grid grid-cols-2 gap-4">
                {/* Article Editor Side */}
                <div className="bg-gray-950 rounded border border-gray-800 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium text-gray-400">Article Editor</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-800 rounded w-3/4" />
                    <div className="h-2 bg-gray-800 rounded w-full" />
                    <div className="h-2 bg-gray-800 rounded w-5/6" />
                  </div>
                  <div className="mt-4 p-2 bg-orange-500/10 border border-orange-500/20 rounded">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-500">AI suggestion</span>
                    </div>
                  </div>
                </div>

                {/* Video Editor Side */}
                <div className="bg-gray-950 rounded border border-gray-800 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium text-gray-400">Video Editor</span>
                  </div>
                  <div className="h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded border border-gray-800 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-800 rounded-full" />
                    <div className="h-1 bg-orange-500 rounded-full w-2/3" />
                    <div className="h-1 bg-gray-800 rounded-full" />
                  </div>
                  <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-500">Scene detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
