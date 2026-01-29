'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
  { href: '/login', label: 'Log in' },
]

export function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <h1 className="text-4xl sm:text-5xl font-pacifico text-[#C8102B] drop-shadow-sm">
              Satty's
            </h1>
          </Link>

            <nav className="hidden md:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-white text-lg font-medium tracking-wide hover:text-white/80 transition-all cursor-pointer group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-screen border-b border-white/10" : "max-h-0"
        )}>
          <nav className="flex flex-col p-8 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-2xl font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
