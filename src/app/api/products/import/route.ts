import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const { data: existingCategories } = await supabaseAdmin.from('categories').select('*')
    const categoryMap = new Map(existingCategories?.map(c => [c.name.toLowerCase(), c.id]) || [])

    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const row of data as Record<string, unknown>[]) {
      try {
        let categoryId = null
        const categoryName = String(row['Category'] || row['category'] || '').trim()
        
        if (categoryName) {
          const existing = categoryMap.get(categoryName.toLowerCase())
          if (existing) {
            categoryId = existing
          } else {
            const { data: newCat } = await supabaseAdmin
              .from('categories')
              .insert({ name: categoryName })
              .select()
              .single()
            if (newCat) {
              categoryId = newCat.id
              categoryMap.set(categoryName.toLowerCase(), newCat.id)
            }
          }
        }

        const basePrice = parseFloat(String(row['Base Price'] || row['base_price'] || row['Price'] || 0))
        const gstPercentage = parseFloat(String(row['GST'] || row['gst_percentage'] || row['GST %'] || 0))
        const finalPrice = basePrice * (1 + gstPercentage / 100)

        const product = {
          product_code: String(row['Product Code'] || row['product_code'] || row['Code'] || '').trim() || null,
          name: String(row['Product Name'] || row['name'] || row['Name'] || '').trim(),
          brand_name: String(row['Brand'] || row['brand_name'] || row['Brand Name'] || '').trim() || null,
          company_name: String(row['Company'] || row['company_name'] || row['Company Name'] || '').trim() || null,
          category_id: categoryId,
          case_size: String(row['Case Size'] || row['case_size'] || '').trim() || null,
          pack_size: String(row['Pack Size'] || row['pack_size'] || '').trim() || null,
          shelf_life: String(row['Shelf Life'] || row['shelf_life'] || '').trim() || null,
          base_price: basePrice,
          gst_percentage: gstPercentage,
          final_price: finalPrice,
          description: String(row['Description'] || row['description'] || '').trim() || null,
          stock_status: String(row['Stock'] || row['stock_status'] || row['Stock Status'] || 'IN').toUpperCase() === 'OUT' ? 'OUT' : 'IN',
          image_url: String(row['Image'] || row['image_url'] || row['Image URL'] || '').trim() || null
        }

        if (!product.name) {
          results.failed++
          results.errors.push(`Row missing product name`)
          continue
        }

        const { error } = await supabaseAdmin.from('products').insert(product)
        
        if (error) {
          results.failed++
          results.errors.push(`${product.name}: ${error.message}`)
        } else {
          results.success++
        }
      } catch (err) {
        results.failed++
        results.errors.push(`Error processing row: ${err}`)
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} products added, ${results.failed} failed`,
      ...results
    })
  } catch (err) {
    return NextResponse.json({ error: `Import failed: ${err}` }, { status: 500 })
  }
}
