// Serve video local có kiểm tra đăng nhập + hỗ trợ HTTP Range (seek/tua). Mô phỏng signed-URL S3.
import { promises as fs } from "fs";
import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { videoFilePath, videoExists, mimeForKey } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string }> }) {
  // Chỉ người đã đăng nhập mới xem được (gạc như signed-URL)
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { key } = await ctx.params;
  if (!(await videoExists(key))) return new Response("Not Found", { status: 404 });

  const filePath = videoFilePath(key);
  const stat = await fs.stat(filePath);
  const total = stat.size;
  const mime = mimeForKey(key);
  const range = req.headers.get("range");

  if (range) {
    const m = /bytes=(\d+)-(\d*)/.exec(range);
    const start = m ? parseInt(m[1], 10) : 0;
    const end = m && m[2] ? Math.min(parseInt(m[2], 10), total - 1) : total - 1;
    if (start >= total || start > end) {
      return new Response("Range Not Satisfiable", {
        status: 416,
        headers: { "Content-Range": `bytes */${total}` },
      });
    }
    const chunkSize = end - start + 1;
    const fd = await fs.open(filePath, "r");
    try {
      const buf = Buffer.alloc(chunkSize);
      await fd.read(buf, 0, chunkSize, start);
      return new Response(buf, {
        status: 206,
        headers: {
          "Content-Type": mime,
          "Content-Length": String(chunkSize),
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, max-age=0, no-store",
        },
      });
    } finally {
      await fd.close();
    }
  }

  const buf = await fs.readFile(filePath);
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(total),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
