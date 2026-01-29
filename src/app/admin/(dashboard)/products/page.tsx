'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, Pencil, Trash2, Search, Package, Upload, X, FileSpreadsheet, ImageIcon, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { toast } from 'sonner'

const emptyProduct = {
  product_code: '',
  name: '',
  brand_name: '',
  company_name: '',
  category_id: null as number | null,
  case_size: '',
  pack_size: '',
  shelf_life: '',
  base_price: 0,
  gst_percentage: 0,
  final_price: 0,
  description: '',
  image_url: '',
  stock_status: 'IN' as 'IN' | 'OUT',
  is_featured: false
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setFormData(emptyProduct)
    setDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      product_code: product.product_code || '',
      name: product.name,
      brand_name: product.brand_name || '',
      company_name: product.company_name || '',
      category_id: product.category_id,
      case_size: product.case_size || '',
      pack_size: product.pack_size || '',
      shelf_life: product.shelf_life || '',
      base_price: Number(product.base_price),
      gst_percentage: Number(product.gst_percentage),
      final_price: Number(product.final_price),
      description: product.description || '',
      image_url: product.image_url || '',
      stock_status: product.stock_status,
      is_featured: product.is_featured
    })
    setDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setDeleteDialogOpen(false)
      toast.success('Product removed from catalog')
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Auto-calculate final price
    const base = Number(formData.base_price) || 0
    const gst = Number(formData.gst_percentage) || 0
    const final = base + (base * gst / 100)
    
    const payload = {
      ...formData,
      final_price: final
    }

    try {
      const url = selectedProduct ? `/api/products/${selectedProduct.id}` : '/api/products'
      const method = selectedProduct ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error('Save failed')
      
      if (selectedProduct) {
        setProducts(products.map(p => p.id === selectedProduct.id ? data : p))
        toast.success('Product updated successfully')
      } else {
        setProducts([data, ...products])
        toast.success('New product added to catalog')
      }
      setDialogOpen(false)
    } catch (err) {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/products/import', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Import failed')
      
      toast.success(`Successfully imported ${result.success} products`)
      fetchProducts()
      setImportDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Import failed')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.product_code?.toLowerCase().includes(search.toLowerCase())
  )

  const calculatedFinalPrice = Number(formData.base_price) + (Number(formData.base_price) * Number(formData.gst_percentage) / 100)

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Catalog</h1>
          <p className="text-muted-foreground mt-2 text-lg">Curate and manage your premium product collection.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="h-12 px-6 rounded-xl gap-2 border-border hover:bg-muted font-bold transition-all">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Bulk Import
          </Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-[1.02]">
            <Plus className="w-5 h-5" />
            New Masterpiece
          </Button>
        </div>
      </div>

      <Card className="border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand, or product code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-muted/50 border-border rounded-2xl focus:ring-primary font-medium"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">No Products Found</h3>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Refine your search or add a new product to your catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Masterpiece</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Collection</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Financials</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Status</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="group hover:bg-muted/20 transition-colors border-b border-border/50">
                        <TableCell className="py-6 px-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-muted border border-border overflow-hidden flex-shrink-0 relative group-hover:scale-110 transition-transform duration-500">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.brand_name || 'Generic'}</span>
                                <span className="w-1 h-1 bg-border rounded-full" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.product_code || 'No Code'}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          {product.category?.name ? (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-wider">
                              {product.category.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-30">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <p className="text-xl font-display font-bold text-foreground">₹ {Number(product.final_price).toLocaleString('en-IN')}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Base: ₹ {Number(product.base_price).toLocaleString('en-IN')}</p>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <div className="flex flex-col gap-2">
                            <Badge className={`${product.stock_status === 'IN' ? 'bg-emerald-500' : 'bg-destructive'} text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border-none`}>
                              {product.stock_status === 'IN' ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            {product.is_featured && (
                              <Badge className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border-none flex items-center gap-1 w-fit">
                                <Sparkles className="w-2.5 h-2.5" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(product)}
                              className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(product)} 
                              className="h-10 w-10 rounded-xl hover:bg-destructive hover:text-white transition-all text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-0 border-0 shadow-2xl scrollbar-hide">
          <DialogHeader className="bg-primary p-10 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-display font-bold">
                  {selectedProduct ? 'Refine Masterpiece' : 'Craft New Product'}
                </DialogTitle>
                <p className="text-white/70 mt-1 text-lg">Enter the technical specifications and financials.</p>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-12 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Product Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl focus:ring-primary font-bold" required />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Unique Code</Label>
                <Input value={formData.product_code} onChange={(e) => setFormData({ ...formData, product_code: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl focus:ring-primary" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Brand House</Label>
                <Input value={formData.brand_name} onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl focus:ring-primary" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Company Entity</Label>
                <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl focus:ring-primary" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Collection</Label>
                <Select value={formData.category_id?.toString() || ''} onValueChange={(v) => setFormData({ ...formData, category_id: v ? parseInt(v) : null })}>
                  <SelectTrigger className="h-12 bg-muted/50 border-border rounded-xl">
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Stock Readiness</Label>
                <Select value={formData.stock_status} onValueChange={(v: 'IN' | 'OUT') => setFormData({ ...formData, stock_status: v })}>
                  <SelectTrigger className="h-12 bg-muted/50 border-border rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="IN">In Stock</SelectItem>
                    <SelectItem value="OUT">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-8 bg-muted/30 rounded-[2rem] border border-border/50">
              <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-primary mb-6 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Visual Representation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="relative">
                    <Input 
                      value={formData.image_url} 
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
                      className="h-12 bg-background border-border rounded-xl focus:ring-primary pl-10"
                      placeholder="e.g. /products/1.png" 
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Pro-tip: Use the imported product code or index for automatic mapping.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-background rounded-2xl border border-border flex items-center justify-center overflow-hidden">
                    {formData.image_url ? (
                      <img src={formData.image_url} className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/20" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Image Preview</p>
                    <p className="text-xs text-muted-foreground">Will be displayed on the storefront.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary">Base Price (₹) *</Label>
                <Input type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })} className="h-14 bg-background border-primary/20 rounded-xl focus:ring-primary font-bold text-lg" required />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary">GST (%)</Label>
                <Input type="number" step="0.01" value={formData.gst_percentage} onChange={(e) => setFormData({ ...formData, gst_percentage: parseFloat(e.target.value) || 0 })} className="h-14 bg-background border-primary/20 rounded-xl focus:ring-primary font-bold text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary">Final Valuation (₹)</Label>
                <div className="h-14 bg-white/50 border border-primary/10 rounded-xl flex items-center px-4 font-display font-bold text-2xl text-primary">
                  ₹ {calculatedFinalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Case Size</Label>
                <Input value={formData.case_size} onChange={(e) => setFormData({ ...formData, case_size: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl" placeholder="e.g. 12KG" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Pack Size</Label>
                <Input value={formData.pack_size} onChange={(e) => setFormData({ ...formData, pack_size: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl" placeholder="e.g. 1KG" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Shelf Life</Label>
                <Input value={formData.shelf_life} onChange={(e) => setFormData({ ...formData, shelf_life: e.target.value })} className="h-12 bg-muted/50 border-border rounded-xl" placeholder="e.g. 12 Months" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Product Narrative</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-muted/50 border-border rounded-2xl focus:ring-primary min-h-[120px] p-4 leading-relaxed" placeholder="Describe the essence of this product..." />
            </div>

            <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl">
              <div className="flex items-center gap-3">
                <Switch 
                  checked={formData.is_featured} 
                  onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                />
                <Label className="font-bold cursor-pointer">Feature on Homepage</Label>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                {formData.is_featured ? 'Promoted' : 'Standard'}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="flex-1 h-14 rounded-2xl font-bold text-lg">Discard</Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? 'Finalizing...' : selectedProduct ? 'Update Masterpiece' : 'Commit to Catalog'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10">
          <AlertDialogHeader>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="w-10 h-10 text-destructive" />
            </div>
            <AlertDialogTitle className="text-3xl font-display font-bold">Decommission Product?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg leading-relaxed pt-2">
              Are you sure you want to remove <span className="font-bold text-foreground">&quot;{selectedProduct?.name}&quot;</span> from your premium catalog? This operation is permanent and will affect store availability.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-4 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl h-14 px-8 font-bold border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90 rounded-2xl h-14 px-10 font-bold shadow-lg shadow-destructive/20">
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="rounded-[3rem] border-0 shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-emerald-600 p-10 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-display font-bold">Bulk Acquisition</DialogTitle>
                <p className="text-white/70 mt-1">Import your product master from Excel or CSV.</p>
              </div>
            </div>
          </DialogHeader>
          <div className="p-10 space-y-8">
            <div 
              className="border-4 border-dashed border-muted rounded-[2.5rem] p-12 text-center hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Drop your file here</h4>
              <p className="text-muted-foreground mb-8">Support for .xlsx, .xls, and .csv formats.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-emerald-200"
                disabled={importing}
              >
                {importing ? 'Processing Architecture...' : 'Select Master File'}
              </Button>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Required Data Structure
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ensure your file contains columns for <span className="text-foreground font-bold">Name, Brand, Price, and Category</span>. The system will attempt to automatically map images based on the <span className="text-foreground font-bold">Product Code</span>.
              </p>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/10 border-t border-border/50">
            <Button variant="ghost" onClick={() => setImportDialogOpen(false)} className="rounded-xl h-12 font-bold">Close Portal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
