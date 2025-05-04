import Link from "next/link"
import Image from "next/image"
import config from "@/common/config"
import { FaGithub } from "react-icons/fa"


export function Header() {
  return (
    <header className="bg-white/80 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/logo.png"
                alt="InsightX Logo"
                fill
                className="object-contain text-primary"
              />
            </div>
            <span className="text-2xl font-bold text-primary">
              {config?.product?.name}
            </span>
          </Link>
          <nav className="flex items-center space-x-8">
            <Link
              href={config.product.github}
              className="text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <FaGithub className="w-5 h-5" />
              <span className="hidden sm:inline">Github Repo</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
