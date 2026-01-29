"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Store, CheckCircle } from 'lucide-react'
import type { ShopInfo } from '@/lib/types'

export default function ShopInfoPage() {
  const [shopInfo, setShopInfo] = useState<Partial<ShopInfo>>({
    shop_name: '',
    owner_name: '',
    business_idea: '',
    concept_vision: '',
    logo_url: '',
    banner_url: '',
    address: '',
    phone: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchShopInfo()
  }, [])

  const fetchShopInfo = async () => {
    try {
      const res = await fetch('/api/shop-info')
      const data = await res.json()
      if (data && Object.keys(data).length > 0) {
        setShopInfo(data)
      }
    } catch (err) {
      console.error('Failed to fetch shop info:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/shop-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopInfo)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d4f3c]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Shop Information</h1>
        <p className="text-muted-foreground">Manage your store details displayed on the website</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Store className="w-5 h-5 text-[#0d4f3c]" />
                Basic Information
              </CardTitle>
              <CardDescription>Core details about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Shop Name</Label>
                <Input 
                  value={shopInfo.shop_name || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, shop_name: e.target.value })}
                  placeholder="Your Store Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Owner Name</Label>
                <Input 
                  value={shopInfo.owner_name || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, owner_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Business Idea</Label>
                <Textarea 
                  value={shopInfo.business_idea || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, business_idea: e.target.value })}
                  placeholder="What your business is about..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Concept / Vision</Label>
                <Textarea 
                  value={shopInfo.concept_vision || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, concept_vision: e.target.value })}
                  placeholder="Your vision for the business..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display">Contact & Media</CardTitle>
              <CardDescription>Contact info and branding assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={shopInfo.email || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                  placeholder="contact@store.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={shopInfo.phone || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea 
                  value={shopInfo.address || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                  placeholder="123 Commerce St, City, Country"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input 
                  value={shopInfo.logo_url || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Banner URL</Label>
                <Input 
                  value={shopInfo.banner_url || ''} 
                  onChange={(e) => setShopInfo({ ...shopInfo, banner_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-4 mt-6">
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Saved successfully!</span>
            </div>
          )}
          <Button type="submit" className="bg-[#0d4f3c] hover:bg-[#165c47] gap-2" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
