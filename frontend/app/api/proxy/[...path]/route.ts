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
  // 1. Check Clerk session server-side
  let token: string | null = null;
  try {
    const authObj = await auth();
    token = await authObj.getToken();
  } catch {
    // Guest/unauthenticated
  }

  // 2. Build the upstream FastAPI URL: /api/proxy/intent → /api/intent
  const { path } = await params;
  const pathStr = path.join("/");
  const isPublicRoute =
    pathStr.startsWith("health") ||
    pathStr.startsWith("manual-filing") ||
    pathStr.startsWith("copilot") ||
    pathStr.startsWith("analyze-response") ||
    pathStr.startsWith("appeal");




  if (!token && !isPublicRoute) {
    return NextResponse.json(
      { detail: "Authentication required. Please sign in to continue." },
      { status: 401 }
    );
  }

  const upstreamPath = "/api/" + path.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  const upstreamUrl = `${BACKEND_URL}${upstreamPath}${searchParams ? `?${searchParams}` : ""}`;

  // 3. Forward the request with the Clerk JWT attached if present
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }


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
