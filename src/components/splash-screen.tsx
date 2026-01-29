'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/ui/logo'

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('splash-shown')
    if (hasShown) {
      setShow(false)
      return
    }

    const timer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('splash-shown', 'true')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.05, 1],
              opacity: 1,
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeOut",
              times: [0, 0.6, 1]
            }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-48 h-48 relative">
              <Logo className="w-full h-full" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                className="absolute -bottom-4 left-0 h-1 bg-primary rounded-full"
              />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center space-y-2"
            >
              <h1 className="text-primary text-5xl font-display font-black tracking-tighter uppercase">
                SATTY&apos;S
              </h1>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.4em] opacity-60">
                Premium Food Distribution
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
