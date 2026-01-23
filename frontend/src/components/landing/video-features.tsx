import { Card, CardContent } from "@/components/ui/card"
import { Video, Scissors, Sparkles, RefreshCw, Film } from "lucide-react"

export function VideoFeatures() {
  const features = [
    {
      icon: Scissors,
      title: "Intelligent Timeline Editing",
      description:
        "AI-assisted trimming and scene detection. Silence and filler detection. Faster rough cuts.",
    },
    {
      icon: Sparkles,
      title: "Smart Enhancements",
      description:
        "Automated captions and subtitles. Visual and audio improvements. Style consistency across clips.",
    },
    {
      icon: RefreshCw,
      title: "Content Repurposing",
      description:
        "Turn long videos into short clips. Adapt formats for social platforms. Generate article drafts from video content.",
    },
    {
      icon: Film,
      title: "Video as a First-Class Object",
      description:
        "Metadata and structure. Versioning. AI actions tied to video segments.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI-Powered Video Editing
          </h2>
          <p className="text-xl text-gray-400">
            Edit faster. Enhance smarter. Repurpose effortlessly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Video Timeline Visual */}
          <div className="relative order-2 lg:order-1">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6">
                <div className="bg-gray-950 rounded-lg border border-gray-800 p-6 space-y-4">
                  {/* Video Preview */}
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-lg border border-gray-800 mb-4 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-600" />
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>00:00</span>
                      <span>02:30</span>
                    </div>
                    <div className="relative h-12 bg-gray-800 rounded overflow-hidden">
                      {/* Timeline Segments */}
                      <div className="absolute inset-0 flex">
                        <div className="flex-1 bg-gray-700 border-r border-gray-600" />
                        <div className="flex-1 bg-orange-500/30 border-r border-gray-600 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-orange-500" />
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-700 border-r border-gray-600" />
                        <div className="flex-1 bg-gray-700" />
                      </div>
                      {/* Playhead */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-white left-1/3" />
                    </div>

                    {/* Scene Labels */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Scene 1</span>
                      <span className="text-orange-500">Scene 2 (AI detected)</span>
                      <span>Scene 3</span>
                      <span>Scene 4</span>
                    </div>
                  </div>

                  {/* AI Actions */}
                  <div className="mt-4 space-y-2">
                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-orange-500" />
                      <span className="text-xs text-orange-500">Auto-trim silence detected</span>
                    </div>
                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orange-500" />
                      <span className="text-xs text-orange-500">Caption suggestion available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Feature List */}
          <div className="space-y-8 order-1 lg:order-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
