import Link from "next/link"
import { FaGithub, FaGlobe, FaHeart, FaLinkedin, FaProductHunt } from "react-icons/fa"
import config from "@/common/config"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/"
              title={config?.product?.name}
              prefetch={false}
              className="flex items-center space-x-2 group"
            >
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain transition-all duration-300 dark:invert" />
              </div>
              <span className="text-2xl font-bold">
                {config?.product?.name}
              </span>
            </Link>
          </div>

          <div className="text-start sm:text-center">
            <Link
              href={config?.author?.github}
              className="text flex items-center gap-2 sm:justify-center"
            >
              Made with <FaHeart className="h-4 w-4 text-black dark:text-white" /> by ysskrishna
            </Link>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-start">
            <div className="flex items-center gap-x-4">
              <Link
                href={config?.author?.url}
                prefetch={false}
                title="View my Website"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Website"
              >
                <FaGlobe className="h-5 w-5 text-black dark:text-white" />
              </Link>
              <Link
                href={config?.author?.linkedin}
                prefetch={false}
                title="Connect on LinkedIn"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5 text-black dark:text-white" />
              </Link>
              <Link
                href={config?.author?.github}
                prefetch={false}
                title="View on GitHub"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5 text-black dark:text-white" />
              </Link>
              <Link
                href={config?.author?.productHunt}
                prefetch={false}
                title="Follow on Product Hunt"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Product Hunt"
              >
                <FaProductHunt className="h-5 w-5 text-black dark:text-white" />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </footer>
  )
}