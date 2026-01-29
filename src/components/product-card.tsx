'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      final_price: Number(product.final_price),
      image_url: product.image_url,
    })
    toast.success(`${product.name} added to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-500"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-muted overflow-hidden">
          <Image
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.stock_status === 'OUT' ? (
              <Badge variant="destructive" className="bg-destructive/90 backdrop-blur-md rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider">
                Out of Stock
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/90 backdrop-blur-md text-white border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider">
                In Stock
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-amber-500/90 backdrop-blur-md text-white border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 delay-100">
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1 opacity-70">
            {product.brand_name || 'Premium'}
          </p>
          <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">Price</p>
              <p className="text-xl font-display font-bold text-foreground">
                ₹ {Number(product.final_price).toLocaleString('en-IN')}
              </p>
            </div>
            
            <Button 
              size="icon" 
              className="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-110 active:scale-95 group/btn"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
