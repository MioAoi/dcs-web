const letters = "abcdefghijklmnopqrstuvwxyz"
const capsLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const digits = "0123456789"

export function bytesToBase260(bytes: Uint8Array, caps: boolean = false): string {
    // For representing bytes as sequences "safe" to be transmitted as text over Chinese internet
    // i.e. avoiding sequences like LXXXIX.LXIV
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
        result += (caps ? capsLetters[bytes[i] / 10 | 0] : letters[bytes[i] / 10 | 0]) + digits[bytes[i] % 10]
    }
    return result;
}

export function base260ToBytes(base260: string): Uint8Array {
    const normalized = base260.toLowerCase(); 
    const bytes = new Uint8Array(base260.length / 2 | 0);
    for (let i = 0; i < bytes.length; i++) {
        const letter = normalized[i * 2];
        const digit = normalized[i * 2 + 1];
        bytes[i] = letters.indexOf(letter) * 10 + digits.indexOf(digit);
    }
    return bytes;
}
