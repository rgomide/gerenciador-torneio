export function middleware(req) {
  const token = req.cookies.get('authToken')

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()

}

export const config = {
  matcher: ['private/path*']
}