/**
 * proxy/[...path]/route.ts
 *
 * Server-side gateway between the Next.js frontend and the FastAPI backend.
 *
 * Why proxy.ts instead of middleware.ts:
 *   - Auth lives entirely server-side — the Clerk JWT never reaches the browser.
 *   - The backend URL stays internal; the client only ever calls /api/proxy/*.
 *   - `auth()` from @clerk/nextjs/server gives us the session token without any
 *     extra round-trips or cookies exposed to client code.
 *
 * Usage from the client:
 *   fetch("/api/proxy/intent", { method: "POST", body: JSON.stringify({...}) })
 *   // → proxied to http://localhost:8000/api/intent with Authorization header
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 1. Verify Clerk session server-side
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return NextResponse.json(
      { detail: "Authentication required. Please sign in to continue." },
      { status: 401 }
    );
  }

  // 2. Build the upstream FastAPI URL: /api/proxy/intent → /api/intent
  const { path } = await params;
  const upstreamPath = "/api/" + path.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  const upstreamUrl = `${BACKEND_URL}${upstreamPath}${searchParams ? `?${searchParams}` : ""}`;

  // 3. Forward the request with the Clerk JWT attached
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body,
  });

  // 4. Stream the upstream response back transparently
  const responseBody = await upstream.text();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
