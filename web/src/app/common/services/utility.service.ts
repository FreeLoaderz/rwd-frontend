import { Buffer } from 'buffer';

export class UtilityService {
    public static hexToBytes(hex: string) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substring(i, (i + 2)), 16));
        }
        return bytes;
    }

    public static hexToString(hex: string) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substring(i, (i + 2)), 16));
        }

        return Buffer.from(bytes).toString();
    }
}