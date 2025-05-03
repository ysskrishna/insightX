import type { Metadata } from 'next'
import './globals.css'
import config from '@/common/config'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: config?.product?.name,
  description: config?.product?.description
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <body>{children}</body>
        <Footer />
      </div>  
    </html>
  )
}
