const letters = "abcdefghijklmnopqrstuvwxyz"
const digits = "0123456789"

export function bytesToBase260(bytes: Uint8Array): string {
    // For representing bytes as sequences "safe" to be transmitted as text over Chinese internet
    // i.e. avoiding sequences like LXXXIX.LXIV
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
        result += letters[bytes[i] / 10 | 0] + digits[bytes[i] % 10]
    }
    return result;
}

export function base260ToBytes(base260: string): Uint8Array {
    const bytes = new Uint8Array(base260.length / 2 | 0);
    for (let i = 0; i < bytes.length; i++) {
        const letter = base260[i * 2];
        const digit = base260[i * 2 + 1];
        bytes[i] = letters.indexOf(letter) * 10 + digits.indexOf(digit);
    }
    return bytes;
}
