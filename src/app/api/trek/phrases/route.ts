import { NextResponse } from 'next/server'
import { phrases } from '../../../../data/phrases'

export async function GET() {
  return NextResponse.json(phrases, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
