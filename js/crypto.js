/**
 * StegaVault Web Crypto Engine
 * PBKDF2-HMAC-SHA256 (480,000 iter) + Fernet (AES-128-CBC + HMAC-SHA256)
 * 100% Interoperable con Python cryptography (StegaVault v2.0)
 */

class StegaCrypto {
  static MAGIC = new Uint8Array([83, 86, 49]); // "SV1"
  static PBKDF2_ITERATIONS = 480000;
  static SALT_BYTES = 16;

  /**
   * Deriva la clave de 32 bytes usando PBKDF2-HMAC-SHA256
   */
  static async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const pwBytes = encoder.encode(password);
    
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      pwBytes,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.PBKDF2_ITERATIONS,
        hash: "SHA-256"
      },
      baseKey,
      256 // 32 bytes
    );

    const keyBytes = new Uint8Array(derivedBits);
    const signingKey = keyBytes.slice(0, 16);
    const encryptionKey = keyBytes.slice(16, 32);

    return { signingKey, encryptionKey };
  }

  /**
   * Decodifica Base64URL
   */
  static base64UrlToBytes(base64urlStr) {
    let base64 = base64urlStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Codifica a Base64URL
   */
  static bytesToBase64Url(bytes) {
    let binaryStr = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binaryStr += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binaryStr);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /**
   * Desencripta un Fernet token dado las llaves derivadas
   */
  static async decryptFernet(tokenStr, signingKey, encryptionKey) {
    const tokenBytes = this.base64UrlToBytes(tokenStr);
    
    if (tokenBytes.length < 57) {
      throw new Error("Token Fernet demasiado corto.");
    }

    const version = tokenBytes[0];
    if (version !== 0x80) {
      throw new Error("Versión de token Fernet inválida.");
    }

    const timestamp = tokenBytes.slice(1, 9);
    const iv = tokenBytes.slice(9, 25);
    const ciphertext = tokenBytes.slice(25, tokenBytes.length - 32);
    const hmacReceived = tokenBytes.slice(tokenBytes.length - 32);

    // Verificar HMAC-SHA256 sobre (version + timestamp + iv + ciphertext)
    const hmacData = tokenBytes.slice(0, tokenBytes.length - 32);
    
    const hmacCryptoKey = await window.crypto.subtle.importKey(
      "raw",
      signingKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValidHmac = await window.crypto.subtle.verify(
      "HMAC",
      hmacCryptoKey,
      hmacReceived,
      hmacData
    );

    if (!isValidHmac) {
      throw new Error("Contraseña incorrecta o firma de datos alterada.");
    }

    // Desencriptar AES-128-CBC
    const aesCryptoKey = await window.crypto.subtle.importKey(
      "raw",
      encryptionKey,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      aesCryptoKey,
      ciphertext
    );

    return new Uint8Array(decryptedBuffer);
  }

  /**
   * Encripta datos en un Fernet token
   */
  static async encryptFernet(dataBytes, signingKey, encryptionKey) {
    const version = 0x80;
    
    // Timestamp (8 bytes uint64 big endian)
    const nowSec = Math.floor(Date.now() / 1000);
    const timestamp = new Uint8Array(8);
    const view = new DataView(timestamp.buffer);
    view.setUint32(4, nowSec, false); // 32 bits inferiores

    // IV (16 bytes random)
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // Encriptar AES-128-CBC
    const aesCryptoKey = await window.crypto.subtle.importKey(
      "raw",
      encryptionKey,
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      aesCryptoKey,
      dataBytes
    );

    const ciphertext = new Uint8Array(cipherBuffer);

    // Concatenar (version + timestamp + iv + ciphertext)
    const hmacData = new Uint8Array(1 + 8 + 16 + ciphertext.length);
    hmacData[0] = version;
    hmacData.set(timestamp, 1);
    hmacData.set(iv, 9);
    hmacData.set(ciphertext, 25);

    // Calcular HMAC-SHA256
    const hmacCryptoKey = await window.crypto.subtle.importKey(
      "raw",
      signingKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const hmacSig = await window.crypto.subtle.sign("HMAC", hmacCryptoKey, hmacData);
    const hmacBytes = new Uint8Array(hmacSig);

    // Unir todo
    const fullFernet = new Uint8Array(hmacData.length + 32);
    fullFernet.set(hmacData, 0);
    fullFernet.set(hmacBytes, hmacData.length);

    return this.bytesToBase64Url(fullFernet);
  }
}

window.StegaCrypto = StegaCrypto;
