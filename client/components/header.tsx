import Link from "next/link"
import { ImageIcon } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">InsightX</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link
              href="https://github.com/your-username/insightx"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Documentation
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
