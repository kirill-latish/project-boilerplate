import { Card, CardContent } from "@/components/ui/card"
import { FileText, Sparkles, Wand2, History } from "lucide-react"

export function ArticleFeatures() {
  const features = [
    {
      icon: Sparkles,
      title: "Smart Drafting & Expansion",
      description:
        "Generate drafts from prompts, outlines, or notes. Expand short ideas into full articles. Maintain tone and structure across sections.",
    },
    {
      icon: Wand2,
      title: "Structure & Clarity Assistance",
      description:
        "AI-suggested headings and sections. Content flow improvements. Readability and clarity enhancements.",
    },
    {
      icon: FileText,
      title: "Editing & Refinement",
      description:
        "Rewrite paragraphs without losing meaning. Summarize long sections. Improve style without 'AI-ish' language.",
    },
    {
      icon: History,
      title: "Article Lifecycle",
      description:
        "Draft → Review → Final workflow. Version history. AI suggestions tracked per section.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI-Augmented Article Creation
          </h2>
          <p className="text-xl text-gray-400">
            From idea to publish-ready content — faster and cleaner.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature List */}
          <div className="space-y-8">
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

          {/* Right: Editor Mockup */}
          <div className="relative">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6">
                <div className="bg-gray-950 rounded-lg border border-gray-800 p-6 space-y-4">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Article Editor</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-700" />
                      <div className="h-2 w-2 rounded-full bg-gray-700" />
                      <div className="h-2 w-2 rounded-full bg-gray-700" />
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="space-y-4">
                    <div>
                      <div className="h-6 bg-gray-800 rounded w-1/3 mb-2" />
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-800 rounded w-full" />
                        <div className="h-2 bg-gray-800 rounded w-5/6" />
                        <div className="h-2 bg-gray-800 rounded w-4/5" />
                      </div>
                    </div>

                    {/* AI Suggestion Highlight */}
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-orange-500" />
                        <span className="text-xs font-medium text-orange-500">
                          AI Suggestion
                        </span>
                      </div>
                      <div className="h-2 bg-orange-500/20 rounded w-3/4" />
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 bg-gray-800 rounded w-full" />
                      <div className="h-2 bg-gray-800 rounded w-4/5" />
                    </div>

                    {/* Section Heading */}
                    <div className="pt-2">
                      <div className="h-5 bg-gray-700 rounded w-1/2 mb-2" />
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-800 rounded w-full" />
                        <div className="h-2 bg-gray-800 rounded w-5/6" />
                      </div>
                    </div>
                  </div>

                  {/* Version History Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
                    <History className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Version 3 • 2 AI suggestions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
