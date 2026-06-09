// Kiểu trả về chuẩn cho Server Action / service.
export type Ok<T> = { ok: true; data: T };
export type Err = { ok: false; error: string };
export type ActionResult<T = undefined> = Ok<T> | Err;

export function ok<T = undefined>(data?: T): Ok<T> {
  return { ok: true, data: data as T };
}

export function fail(error: string): Err {
  return { ok: false, error };
}
