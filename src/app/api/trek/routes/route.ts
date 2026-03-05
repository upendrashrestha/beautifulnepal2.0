import { NextResponse } from 'next/server'
import { everestRoute } from '../../../../data/everest'
import { annapurnaRoute } from '../../../../data/annapurna'

export async function GET() {
  return NextResponse.json([everestRoute, annapurnaRoute], {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
