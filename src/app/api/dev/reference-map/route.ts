import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

/** Fixed research file only; never public/ and never served in production. */
export async function GET() {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });
  const image = await readFile(join(process.cwd(), "reference/bhaktapur/unesco/bhaktapur_map-1.png"));
  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
