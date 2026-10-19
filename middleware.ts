import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 const protectedPath = request.nextUrl.pathname.startsWith("/hra");
 if (!protectedPath) return NextResponse.next();
 if (!url || !key) {
  const destination = request.nextUrl.clone();
  destination.pathname = "/prihlaseni";
  destination.searchParams.set("reason", "auth-config");
  return NextResponse.redirect(destination);
 }
 let response = NextResponse.next({ request });
 const supabase = createServerClient(url, key, {
  cookies: {
   getAll() { return request.cookies.getAll(); },
   setAll(cookiesToSet) {
    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
    response = NextResponse.next({ request });
    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
   },
  },
 });
 const { data: { user } } = await supabase.auth.getUser();
 if (!user) {
  const destination = request.nextUrl.clone();
  destination.pathname = "/prihlaseni";
  destination.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(destination);
 }
 return response;
}
export const config = { matcher: ["/hra/:path*"] };
