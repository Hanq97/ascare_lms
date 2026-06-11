// Lớp lưu trữ video — bản LOCAL (dev). Sau này thay S3/CloudFront mà không đổi code gọi.
// File lưu ở uploads/videos/ (ngoài public, gitignore), serve qua /api/media/[key] có kiểm tra đăng nhập.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const VIDEO_DIR = path.join(process.cwd(), "uploads", "videos");

const EXT_MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
};

export const ALLOWED_VIDEO_EXT = Object.keys(EXT_MIME);

export function mimeForKey(key: string): string {
  return EXT_MIME[path.extname(key).toLowerCase()] ?? "application/octet-stream";
}

/** URL phát cho client (qua route có auth). Video.url lưu KEY; UI gọi hàm này để ra URL. */
export function mediaUrl(key: string): string {
  return `/api/media/${encodeURIComponent(key)}`;
}

async function ensureDir() {
  await fs.mkdir(VIDEO_DIR, { recursive: true });
}

/** Đường dẫn tuyệt đối tới file theo key — chống path traversal (chỉ lấy basename). */
export function videoFilePath(key: string): string {
  return path.join(VIDEO_DIR, path.basename(key));
}

/** Lưu buffer video → trả về key (tên file ngẫu nhiên). */
export async function saveVideo(buffer: Buffer, ext: string): Promise<string> {
  await ensureDir();
  const safeExt = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  const key = `${randomUUID()}${safeExt}`;
  await fs.writeFile(videoFilePath(key), buffer);
  return key;
}

export async function videoExists(key: string): Promise<boolean> {
  try {
    await fs.access(videoFilePath(key));
    return true;
  } catch {
    return false;
  }
}

export async function deleteVideo(key: string): Promise<void> {
  try {
    await fs.unlink(videoFilePath(key));
  } catch {
    /* bỏ qua nếu file không tồn tại */
  }
}
