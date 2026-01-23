import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, FileText, Video, RefreshCw } from "lucide-react"

export function Synergy() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Articles and videos work better together
          </h2>
          <p className="text-xl text-gray-400">
            Seamless cross-media workflows in one workspace
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Article to Video */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-orange-500" />
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-600 rotate-90 md:rotate-0" />
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Video className="h-10 w-10 text-orange-500" />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Article → Video</h3>
                <p className="text-gray-400 text-sm">
                  Transform blog posts into explainer videos with AI-assisted scene generation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Video to Article */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Video className="h-10 w-10 text-orange-500" />
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-600 rotate-90 md:rotate-0" />
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-orange-500" />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Video → Article</h3>
                <p className="text-gray-400 text-sm">
                  Extract key points from webinars and create comprehensive article series
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-gray-800 bg-gray-900/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold">Blog → Explainer</h4>
              </div>
              <p className="text-sm text-gray-400">
                Turn your best articles into engaging video content
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold">Webinar → Series</h4>
              </div>
              <p className="text-sm text-gray-400">
                Convert long-form videos into article collections
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold">Update → Clips</h4>
              </div>
              <p className="text-sm text-gray-400">
                Break down product updates into social media clips
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
