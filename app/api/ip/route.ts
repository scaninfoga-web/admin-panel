import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'Unknown';

  return Response.json({ ip });
}
