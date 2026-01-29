import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, CheckCircle, ArrowLeft, Tag, Building2, Clock, Boxes, Calculator } from 'lucide-react'
import type { Product } from '@/lib/types'

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, { cache: 'no-store' })
    return res.ok ? res.json() : null
  } catch { return null }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const details = [
    { label: 'Brand', value: product.brand_name, icon: Tag },
    { label: 'Company', value: product.company_name, icon: Building2 },
    { label: 'Case Size', value: product.case_size, icon: Boxes },
    { label: 'Pack Size', value: product.pack_size, icon: Package },
    { label: 'Shelf Life', value: product.shelf_life, icon: Clock },
    { label: 'Product Code', value: product.product_code, icon: Calculator },
  ].filter(d => d.value)

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#0d4f3c] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e5e2dc]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f5f3ef]">
                    <Package className="w-32 h-32 text-[#e5e2dc]" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                {product.category && (
                  <Link href={`/products?category=${product.category.id}`}>
                    <Badge variant="secondary" className="mb-3 bg-[#c9a96e]/20 text-[#8b6914] hover:bg-[#c9a96e]/30">
                      {product.category.name}
                    </Badge>
                  </Link>
                )}
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#1a1a1a] mb-2">
                  {product.name}
                </h1>
                {product.brand_name && (
                  <p className="text-lg text-muted-foreground">by {product.brand_name}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {product.stock_status === 'IN' ? (
                  <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1 px-3 py-1">
                    <CheckCircle className="w-4 h-4" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1">Out of Stock</Badge>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e2dc]">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-[#0d4f3c]">${product.final_price.toFixed(2)}</span>
                  {product.gst_percentage > 0 && (
                    <span className="text-sm text-muted-foreground">incl. {product.gst_percentage}% GST</span>
                  )}
                </div>
                {product.base_price !== product.final_price && (
                  <p className="text-sm text-muted-foreground">
                    Base price: ${product.base_price.toFixed(2)}
                  </p>
                )}
              </div>

              {product.description && (
                <div className="space-y-2">
                  <h2 className="font-semibold text-lg">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {details.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e2dc]">
                  <h2 className="font-semibold text-lg mb-4">Product Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f5f3ef] rounded-xl flex items-center justify-center flex-shrink-0">
                          <detail.icon className="w-5 h-5 text-[#0d4f3c]" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{detail.label}</p>
                          <p className="font-medium">{detail.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Link href="/contact" className="flex-1">
                  <Button size="lg" className="w-full bg-[#0d4f3c] hover:bg-[#165c47]">
                    Contact for Purchase
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </main>
    </div>
  )
}

