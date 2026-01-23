import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-[1280px] mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Start creating smarter content today
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          No setup. No credit card. Just start.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/sign-up">Start for free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8">
            <Link href="/#pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
