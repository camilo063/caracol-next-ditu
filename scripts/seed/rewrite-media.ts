/**
 * Helper recursivo para reemplazar referencias hardcoded a assets (objetos
 * con shape `{ url, alt? }`) por mediaIds (number) en estructuras profundas
 * (block layouts, globals data).
 *
 * Si no se encuentra el path en el map, se reemplaza por `null` para que
 * Payload no falle por un mediaId inválido.
 */

type MediaRefHardcoded = { url: string; alt?: string };

function isMediaRefHardcoded(value: unknown): value is MediaRefHardcoded {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.url !== "string") return false;
  // Solo aceptar el shape {url, alt} (o solo {url}). No queremos consumir objetos
  // más grandes que casualmente tengan `url`.
  const keys = Object.keys(obj);
  return keys.every((k) => k === "url" || k === "alt");
}

export function rewriteMediaRefs<T>(node: T, assetMap: Map<string, number>): T {
  if (node === null || node === undefined) return node;
  if (Array.isArray(node)) {
    return node.map((n) => rewriteMediaRefs(n, assetMap)) as unknown as T;
  }
  if (typeof node === "object") {
    if (isMediaRefHardcoded(node)) {
      const id = assetMap.get(node.url);
      return (id ?? null) as unknown as T;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      out[k] = rewriteMediaRefs(v, assetMap);
    }
    return out as unknown as T;
  }
  return node;
}
