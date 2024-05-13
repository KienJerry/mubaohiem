import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// export function middleware(): any {
  export function middleware(req: NextRequest): any {
  let token = req.cookies?.get('access_token')

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/login`)
  }
}

export const config = {
  matcher: ['/blog/:path*'],
}
