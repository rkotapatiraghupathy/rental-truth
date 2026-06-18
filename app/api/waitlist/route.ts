import { NextRequest, NextResponse } from "next/server";

// Uses Vercel KV in production (set KV_REST_API_URL + KV_REST_API_TOKEN env vars)
// Falls back to in-memory for local dev (resets on restart)
const localFallback = new Set<string>();

async function kvSet(email: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    await fetch(`${url}/sadd/waitlist/${encodeURIComponent(email)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch {
    return false;
  }
}

async function kvCount(): Promise<number | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/scard/waitlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}

async function kvHas(email: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/sismember/waitlist/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.result === 1;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

    if (useKV) {
      const already = await kvHas(email);
      if (already) return NextResponse.json({ message: "Already on the list!", alreadyExists: true });
      await kvSet(email);
      const count = await kvCount();
      console.log(`New waitlist signup: ${email} (total: ${count})`);
      return NextResponse.json({ message: "You're on the list! We'll notify you when RentalTruth launches.", count });
    } else {
      // Local dev fallback
      if (localFallback.has(email)) return NextResponse.json({ message: "Already on the list!", alreadyExists: true });
      localFallback.add(email);
      console.log(`[DEV] Waitlist signup: ${email} (total: ${localFallback.size})`);
      return NextResponse.json({ message: "You're on the list! We'll notify you when RentalTruth launches.", count: localFallback.size });
    }
  } catch {
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}

export async function GET() {
  const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  const count = useKV ? (await kvCount() ?? 0) : localFallback.size;
  return NextResponse.json({ count });
}
