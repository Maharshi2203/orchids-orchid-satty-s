'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HomeHeader } from '@/components/home-header'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-105"
      >
        <source src="/video.mp4" type="video/mp4" />
        {/* Fallback if local video is missing during development */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-vegetables-in-a-professional-kitchen-41011-large.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay (40% for better readability) */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Header */}
      <HomeHeader />

      {/* Hero Content */}
      <main className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl space-y-2"
        >
          {/* Main Heading */}
          <h1 className="text-white text-8xl sm:text-9xl md:text-[10rem] font-display font-bold tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
            Satty's
          </h1>
          
          {/* Subheading */}
          <h2 className="text-white text-3xl sm:text-4xl font-display font-medium tracking-wide opacity-95 drop-shadow-md">
            Gujarat's #1
          </h2>

          {/* Tagline */}
          <h3 className="text-white text-xl sm:text-2xl font-display font-medium tracking-[0.2em] uppercase py-4 drop-shadow-md">
            Food ingredients delivery app
          </h3>

          {/* Small line */}
          <p className="text-white/90 text-lg sm:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm pb-10">
            Experience fast & easy online ordering on the Satty's app
          </p>

          {/* App Store Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <Link 
              href="#" 
              className="group transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative w-[180px] h-[54px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-xl group-hover:bg-white/20 transition-colors overflow-hidden">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </Link>
            <Link 
              href="#" 
              className="group transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative w-[180px] h-[54px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-xl group-hover:bg-white/20 transition-colors overflow-hidden">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                  alt="Download on the App Store"
                  fill
                  className="object-contain p-2 invert"
                />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opacity-50">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}
