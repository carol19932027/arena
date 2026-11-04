let crcTable;
function crc32(bytes, start, end) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c2 = n;
      for (let k = 0; k < 8; k++) c2 = c2 & 1 ? 3988292384 ^ c2 >>> 1 : c2 >>> 1;
      crcTable[n] = c2 >>> 0;
    }
  }
  let c = 4294967295;
  for (let i = start; i < end; i++) c = crcTable[(c ^ bytes[i]) & 255] ^ c >>> 8;
  return (c ^ 4294967295) >>> 0;
}
function adler32(bytes) {
  let a = 1;
  let b = 0;
  for (let i = 0; i < bytes.length; i++) {
    a = (a + bytes[i]) % 65521;
    b = (b + a) % 65521;
  }
  return (b << 16 | a) >>> 0;
}
function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const blocks = Math.max(1, Math.ceil(raw.length / 65535));
  const zlibLen = 2 + raw.length + blocks * 5 + 4;
  const zlib = new Uint8Array(zlibLen);
  zlib[0] = 120;
  zlib[1] = 1;
  let o = 2;
  for (let i = 0; i < blocks; i++) {
    const start = i * 65535;
    const len = Math.min(65535, raw.length - start);
    zlib[o++] = i === blocks - 1 ? 1 : 0;
    zlib[o++] = len & 255;
    zlib[o++] = len >>> 8 & 255;
    zlib[o++] = ~len & 255;
    zlib[o++] = ~len >>> 8 & 255;
    zlib.set(raw.subarray(start, start + len), o);
    o += len;
  }
  const ad = adler32(raw);
  zlib[o++] = ad >>> 24 & 255;
  zlib[o++] = ad >>> 16 & 255;
  zlib[o++] = ad >>> 8 & 255;
  zlib[o] = ad & 255;
  const chunks = [];
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, width);
  dv.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  chunks.push(["IHDR", ihdr], ["IDAT", zlib], ["IEND", new Uint8Array(0)]);
  let total = 8;
  for (const [, data] of chunks) total += 12 + data.length;
  const png = new Uint8Array(total);
  png.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  let p = 8;
  const view = new DataView(png.buffer);
  for (const [type, data] of chunks) {
    view.setUint32(p, data.length);
    for (let i = 0; i < 4; i++) png[p + 4 + i] = type.charCodeAt(i);
    png.set(data, p + 8);
    view.setUint32(p + 8 + data.length, crc32(png, p + 4, p + 8 + data.length));
    p += 12 + data.length;
  }
  return png;
}
function base64(bytes) {
  let binary = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
let scratch;
function pngDataUrl(width, height, rgba, allowCanvas = true) {
  if (allowCanvas && typeof document !== "undefined") {
    if (scratch === void 0) {
      try {
        scratch = document.createElement("canvas");
        if (!scratch.getContext("2d")) scratch = null;
      } catch {
        scratch = null;
      }
    }
    if (scratch) {
      scratch.width = width;
      scratch.height = height;
      const ctx = scratch.getContext("2d");
      if (ctx) {
        ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
        const url = scratch.toDataURL("image/png");
        if (url.startsWith("data:image/png")) return url;
      }
    }
  }
  return `data:image/png;base64,${base64(encodePng(width, height, rgba))}`;
}
export {
  encodePng,
  pngDataUrl
};
