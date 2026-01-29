'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout'
import { useCart } from '@/hooks/use-cart'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, count } = useCart()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground">Your Shopping Cart</h1>
            <span className="text-muted-foreground font-medium">({count} items)</span>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card border border-border rounded-3xl group transition-all hover:shadow-xl hover:shadow-primary/5"
                    >
                      <div className="relative w-32 h-32 bg-muted rounded-2xl overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/20 transition-colors">
                        <Image
                          src={item.image_url || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-primary font-bold text-lg mb-4">₹ {Number(item.final_price).toLocaleString('en-IN')}</p>
                        
                        <div className="flex items-center justify-center sm:justify-start gap-4">
                          <div className="flex items-center bg-muted rounded-full p-1 border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-background transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-10 text-center font-bold text-foreground">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-background transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                        <p className="text-xl font-bold text-foreground">₹ {(Number(item.final_price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-3xl p-8 sticky top-24 shadow-xl shadow-primary/5">
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-medium">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <span className="text-3xl font-display font-bold text-primary">₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-[1.02]">
                    Checkout Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  <p className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Secure Checkout Guaranteed
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-card border border-border rounded-[3rem] shadow-xl shadow-primary/5"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Looks like you haven&apos;t added any premium items yet. Explore our collection and find something special!
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 h-14 font-bold shadow-lg shadow-primary/20">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
