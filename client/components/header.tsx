import Link from "next/link"
import Image from "next/image"


export function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png"
              alt="InsightX Logo"
              width={32}
              height={32}
              className="text-primary"
            />
            <span className="text-xl font-bold">InsightX</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="https://github.com/ysskrishna"
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
