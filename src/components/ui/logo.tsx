'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'header' | 'footer'
}

export function Logo({ className, variant = 'header' }: LogoProps) {
  const logoUrl = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/a11ab257-30c1-49e8-874d-6d4d6f2ce61a/WhatsApp-Image-2025-12-18-at-9.43.50-PM-1767878288662.jpeg?width=8000&height=8000&resize=contain'

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      <Image
        src={logoUrl}
        alt="Satty's"
        width={180}
        height={180}
        className={cn(
          "object-contain transition-all duration-300",
          "light:mix-blend-multiply",
          "dark:brightness-110"
        )}
        priority
      />
    </div>
  )
}
