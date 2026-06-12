// Serve ảnh thumbnail コース (local) có kiểm tra đăng nhập. Key ngẫu nhiên → cache được.
import { promises as fs } from "fs";
import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { imageFilePath, imageExists, imageMimeForKey } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ key: string }> }) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { key } = await ctx.params;
  if (!(await imageExists(key))) return new Response("Not Found", { status: 404 });

  const buf = await fs.readFile(imageFilePath(key));
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": imageMimeForKey(key),
      "Content-Length": String(buf.length),
      "Cache-Control": "private, max-age=86400",
    },
  });
}
