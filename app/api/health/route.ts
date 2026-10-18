import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", app: "hodny-pes-psi-svet", version: "0.2.0" });
}
