// File: app/api/ipinfo/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  console.log("API /api/ipinfo called");
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Proxy to ipapi.co failed:', err);
    return NextResponse.json({ error: 'Failed to fetch IP info' }, { status: 500 });
  }
}
