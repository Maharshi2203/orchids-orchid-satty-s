import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const stock = searchParams.get('stock')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let query = supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category_id', parseInt(category))
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,brand_name.ilike.%${search}%,product_code.ilike.%${search}%`)
    }
    if (stock) {
      query = query.eq('stock_status', stock)
    }
    if (brand) {
      query = query.ilike('brand_name', `%${brand}%`)
    }
    if (minPrice) {
      query = query.gte('final_price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('final_price', parseFloat(maxPrice))
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const finalPrice = body.base_price * (1 + (body.gst_percentage || 0) / 100)

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        ...body,
        final_price: finalPrice
      })
      .select('*, category:categories(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
