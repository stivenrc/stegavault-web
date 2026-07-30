/**
 * StegaVault Pure Bit LSB Engine (Dual Engine: Raw PNG Binary & Canvas)
 * 100% Interoperabilidad Matematica con Python PIL / StegaVault v2.0
 */

class StegaEngine {
  /**
   * Calcula la capacidad máxima en bytes de una imagen PNG (ancho x alto)
   */
  static getCapacityBytes(width, height) {
    const totalPixels = width * height;
    const availableBits = totalPixels * 3; // R, G, B canales LSB
    const totalBytes = Math.floor(availableBits / 8);
    return Math.max(0, totalBytes - 23);
  }

  /**
   * Extrae la carga útil directamente desde el File u ArrayBuffer usando decodificación binaria PNG pura
   * Evita cualquier alteración de color de los navegadores (sRGB / ICC profiles)
   */
  static async extractPayloadFromFile(file, progressCallback) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. Verificar firma PNG (8 bytes: 137, 80, 78, 71, 13, 10, 26, 10)
    if (bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) {
      throw new Error("El archivo no es una imagen PNG válida.");
    }

    // Parsear Chunks PNG (IHDR e IDAT)
    let offset = 8;
    let width = 0;
    let height = 0;
    let bitDepth = 0;
    let colorType = 0;
    const idatChunks = [];

    const dataView = new DataView(buffer);

    while (offset < bytes.length) {
      if (offset + 8 > bytes.length) break;
      const chunkLength = dataView.getUint32(offset, false);
      const chunkType = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);

      if (chunkType === 'IHDR') {
        width = dataView.getUint32(offset + 8, false);
        height = dataView.getUint32(offset + 12, false);
        bitDepth = bytes[offset + 16];
        colorType = bytes[offset + 17];
      } else if (chunkType === 'IDAT') {
        idatChunks.push(bytes.subarray(offset + 8, offset + 8 + chunkLength));
      } else if (chunkType === 'IEND') {
        break;
      }

      offset += 12 + chunkLength;
    }

    if (idatChunks.length === 0) {
      throw new Error("No se encontraron bloques de datos IDAT en la imagen PNG.");
    }

    // Unir chunks IDAT
    let totalIdatLen = idatChunks.reduce((acc, c) => acc + c.length, 0);
    const combinedIdat = new Uint8Array(totalIdatLen);
    let currPos = 0;
    for (const chunk of idatChunks) {
      combinedIdat.set(chunk, currPos);
      currPos += chunk.length;
    }

    // Descomprimir zlib (Ignorar 2 bytes header zlib y 4 bytes Adler32 checksum al final)
    const rawDeflateData = combinedIdat.subarray(2, combinedIdat.length - 4);
    let decompressedBytes;

    try {
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      writer.write(rawDeflateData);
      writer.close();
      const response = new Response(ds.readable);
      decompressedBytes = new Uint8Array(await response.arrayBuffer());
    } catch (e) {
      // Fallback si no soporta deflate-raw directamente
      const ds = new DecompressionStream('deflate');
      const writer = ds.writable.getWriter();
      writer.write(combinedIdat);
      writer.close();
      const response = new Response(ds.readable);
      decompressedBytes = new Uint8Array(await response.arrayBuffer());
    }

    // Reconstruir filtros PNG por escaneo de filas (Scanlines)
    const channels = (colorType === 6) ? 4 : (colorType === 2) ? 3 : 3;
    const bpp = Math.max(1, Math.floor(channels * (bitDepth / 8)));
    const stride = width * channels;
    const unfilteredPixels = new Uint8Array(width * height * channels);

    let srcIdx = 0;
    let dstIdx = 0;

    for (let row = 0; row < height; row++) {
      const filterType = decompressedBytes[srcIdx++];
      const rowStartDst = dstIdx;

      for (let col = 0; col < stride; col++) {
        let x = decompressedBytes[srcIdx++];
        let a = (col >= bpp) ? unfilteredPixels[dstIdx - bpp] : 0;
        let b = (row > 0) ? unfilteredPixels[dstIdx - stride] : 0;
        let c = (row > 0 && col >= bpp) ? unfilteredPixels[dstIdx - stride - bpp] : 0;

        let val = x;
        if (filterType === 1) { // Sub
          val = (x + a) & 0xFF;
        } else if (filterType === 2) { // Up
          val = (x + b) & 0xFF;
        } else if (filterType === 3) { // Average
          val = (x + Math.floor((a + b) / 2)) & 0xFF;
        } else if (filterType === 4) { // Paeth
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          let pr = c;
          if (pa <= pb && pa <= pc) pr = a;
          else if (pb <= pc) pr = b;
          val = (x + pr) & 0xFF;
        }

        unfilteredPixels[dstIdx++] = val;
      }
    }

    // Extraer LSB bits directamente de los canales R, G, B desfiltrados
    const totalPixels = width * height;
    const maxAvailableBits = totalPixels * 3;

    // 1. Leer Header (32 bits = 4 bytes)
    let bitCount = 0;
    let headerVal = 0;
    let pixIndex = 0;

    while (bitCount < 32 && pixIndex < totalPixels) {
      const pixelOffset = pixIndex * channels;
      // R
      headerVal = (headerVal << 1) | (unfilteredPixels[pixelOffset] & 1);
      bitCount++;
      if (bitCount === 32) break;

      // G
      headerVal = (headerVal << 1) | (unfilteredPixels[pixelOffset + 1] & 1);
      bitCount++;
      if (bitCount === 32) break;

      // B
      headerVal = (headerVal << 1) | (unfilteredPixels[pixelOffset + 2] & 1);
      bitCount++;
      if (bitCount === 32) break;

      pixIndex++;
    }

    const payloadLength = headerVal >>> 0;
    const maxCapacity = Math.floor(maxAvailableBits / 8) - 4;

    if (payloadLength <= 0 || payloadLength > maxCapacity) {
      throw new Error("La imagen seleccionada no contiene información oculta de StegaVault.");
    }

    // 2. Leer Payload
    const payloadBuffer = new Uint8Array(payloadLength);
    const totalBitsToRead = payloadLength * 8;

    let byteVal = 0;
    let bitInByte = 0;
    let byteIdx = 0;

    let currBitPos = 32;

    for (let i = 0; i < totalBitsToRead; i++) {
      const bitPos = currBitPos + i;
      const pIdx = Math.floor(bitPos / 3);
      const cIdx = bitPos % 3;
      const pixelOffset = pIdx * channels + cIdx;

      const bit = unfilteredPixels[pixelOffset] & 1;
      byteVal = (byteVal << 1) | bit;
      bitInByte++;

      if (bitInByte === 8) {
        payloadBuffer[byteIdx] = byteVal;
        byteIdx++;
        byteVal = 0;
        bitInByte = 0;
      }
    }

    if (progressCallback) progressCallback(100);

    // 3. Validar Magic "SV1" (83, 86, 49)
    if (payloadBuffer[0] !== 83 || payloadBuffer[1] !== 86 || payloadBuffer[2] !== 49) {
      throw new Error("Formato StegaVault no reconocido (Firma SV1 no coincide).");
    }

    const salt = payloadBuffer.slice(3, 19);
    const encryptedBytes = payloadBuffer.slice(19);
    const tokenStr = new TextDecoder().decode(encryptedBytes);

    return { salt, tokenStr };
  }

  /**
   * Extrae la carga útil usando HTML5 Canvas (fallback)
   */
  static async extractPayload(canvas, progressCallback) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const totalPixels = canvas.width * canvas.height;
    const maxAvailableBits = totalPixels * 3;

    let pos = 0;
    let headerVal = 0;
    for (let i = 0; i < 32; i++) {
      const pixelIdx = Math.floor(i / 3);
      const channelIdx = i % 3;
      const bit = data[pixelIdx * 4 + channelIdx] & 1;
      headerVal = (headerVal << 1) | bit;
    }
    pos = 32;

    const payloadLength = headerVal >>> 0;
    const maxCapacity = Math.floor(maxAvailableBits / 8) - 4;

    if (payloadLength <= 0 || payloadLength > maxCapacity) {
      throw new Error("La imagen seleccionada no contiene información oculta de StegaVault.");
    }

    const payloadBuffer = new Uint8Array(payloadLength);
    const totalBitsToRead = payloadLength * 8;

    let byteVal = 0;
    let bitInByte = 0;
    let byteIdx = 0;

    for (let i = 0; i < totalBitsToRead; i++) {
      const currPos = pos + i;
      if (currPos >= maxAvailableBits) break;

      const pixelIdx = Math.floor(currPos / 3);
      const channelIdx = currPos % 3;
      const bit = data[pixelIdx * 4 + channelIdx] & 1;

      byteVal = (byteVal << 1) | bit;
      bitInByte++;

      if (bitInByte === 8) {
        payloadBuffer[byteIdx] = byteVal;
        byteIdx++;
        byteVal = 0;
        bitInByte = 0;
      }
    }

    if (progressCallback) progressCallback(100);

    if (payloadBuffer[0] !== 83 || payloadBuffer[1] !== 86 || payloadBuffer[2] !== 49) {
      throw new Error("Formato StegaVault no reconocido (Firma SV1 no coincide).");
    }

    const salt = payloadBuffer.slice(3, 19);
    const encryptedBytes = payloadBuffer.slice(19);
    const tokenStr = new TextDecoder().decode(encryptedBytes);

    return { salt, tokenStr };
  }
}

window.StegaEngine = StegaEngine;
