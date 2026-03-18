import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const isLocalDev = process.env.NODE_ENV === 'development';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => isLocalDev || !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = { matcher: ['/admin', '/admin/:path*'] };
