import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isMarket, MARKET_COOKIE_MAX_AGE, MARKET_COOKIE_NAME } from '@/lib/stake';

function getRedirectUrl(request: NextRequest, returnTo: FormDataEntryValue | null): URL {
  if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
    return new URL(returnTo, request.url);
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.origin === new URL(request.url).origin) {
        return refererUrl;
      }
    } catch {
      // fall through to /
    }
  }

  return new URL('/', request.url);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const market = formData.get('market');
  const redirectUrl = getRedirectUrl(request, formData.get('returnTo'));
  const response = NextResponse.redirect(redirectUrl, 303);

  if (isMarket(market)) {
    response.cookies.set(MARKET_COOKIE_NAME, market, {
      httpOnly: true,
      maxAge: MARKET_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}