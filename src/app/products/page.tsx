'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout'
import { ProductCard } from '@/components/product-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, Package, LayoutGrid, List } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
  const [stockStatus, setStockStatus] = useState(searchParams.get('stock') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [maxPrice, setMaxPrice] = useState(5000)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchParams.get('search')) params.set('search', searchParams.get('search')!)
      if (searchParams.get('category')) params.set('category', searchParams.get('category')!)
      if (searchParams.get('stock')) params.set('stock', searchParams.get('stock')!)
      if (searchParams.get('minPrice')) params.set('minPrice', searchParams.get('minPrice')!)
      if (searchParams.get('maxPrice')) params.set('maxPrice', searchParams.get('maxPrice')!)
      
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data)
      
      if (data.length > 0) {
        const max = Math.max(...data.map((p: Product) => Number(p.final_price)))
        const calculatedMax = Math.ceil(max / 500) * 500 || 5000
        setMaxPrice(calculatedMax)
        if (!searchParams.get('maxPrice')) {
          setPriceRange([0, calculatedMax])
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (categoryId && categoryId !== 'all') params.set('category', categoryId)
    if (stockStatus && stockStatus !== 'all') params.set('stock', stockStatus)
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < maxPrice) params.set('maxPrice', priceRange[1].toString())
    router.push(`/products?${params.toString()}`)
    setFiltersOpen(false)
  }, [search, categoryId, stockStatus, priceRange, maxPrice, router])

  const clearFilters = () => {
    setSearch('')
    setCategoryId('')
    setStockStatus('')
    setPriceRange([0, maxPrice])
    router.push('/products')
    setFiltersOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6">Explore Excellence</h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Discover our curated selection of premium products, where quality meets craftsmanship in every detail.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display font-bold text-foreground">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80 font-bold"
                  >
                    Reset All
                  </Button>
                </div>

                <div className="space-y-8 bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-primary/5">
                  <form onSubmit={handleSearchSubmit} className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="What are you looking for?"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-12 bg-muted/50 border-border rounded-xl focus:ring-primary"
                      />
                    </div>
                  </form>

                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border rounded-xl">
                        <SelectValue placeholder="All Collections" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Collections</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Availability</Label>
                    <Select value={stockStatus} onValueChange={setStockStatus}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border rounded-xl">
                        <SelectValue placeholder="Any Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">Any Status</SelectItem>
                        <SelectItem value="IN">In Stock</SelectItem>
                        <SelectItem value="OUT">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Price Range</Label>
                      <span className="text-sm font-bold text-primary">₹ {priceRange[0]} - ₹ {priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={maxPrice}
                      step={50}
                      className="py-4"
                    />
                  </div>

                  <Button 
                    onClick={applyFilters} 
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {loading ? 'Discovering...' : `${products.length} Exceptional Products`}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Curated selection for your premium lifestyle</p>
                </div>
                
                <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                  <Button variant="ghost" size="icon" className="h-9 w-9 bg-background shadow-sm rounded-lg text-primary">
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2rem]" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-24 bg-card border border-border rounded-[3rem] shadow-xl shadow-primary/5"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">No Results Found</h3>
                  <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Try refining your search or adjusting filters to discover more.</p>
                  <Button variant="outline" onClick={clearFilters} className="rounded-xl px-8">Clear All Filters</Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
