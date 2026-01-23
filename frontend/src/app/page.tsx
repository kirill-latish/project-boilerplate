import { Navigation } from "@/components/landing/navigation"
import { Hero } from "@/components/landing/hero"
import { Pricing } from "@/components/landing/pricing"
import { ArticleFeatures } from "@/components/landing/article-features"
import { VideoFeatures } from "@/components/landing/video-features"
import { Synergy } from "@/components/landing/synergy"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      <main>
        <Hero />
        <Pricing />
        <ArticleFeatures />
        <VideoFeatures />
        <Synergy />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
