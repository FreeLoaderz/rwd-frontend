import {Buffer} from 'buffer';

export class UtilityService {
    public static scanURLs = ["https://preview.cexplorer.io/tx/", "https://cexplorer.io/tx/"];

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

    public static generateTxHashURL(txhash: string, addBR: boolean) {
        let url = "<a class=\"notifier__notification-message\" target=\"_blank\" href=\"" +
            this.scanURLs[globalThis.wallet.network] + txhash + "\">" + txhash + "</a>";
        if (addBR) {
            url = "<br>" + url;
        }
        return url;
    }

    public static generateShortTxHashURL(txhash: string, txShortHash: string, addBR: boolean) {
        let url = "<a class=\"notifier__notification-message\" target=\"_blank\" href=\"" +
            this.scanURLs[globalThis.wallet.network] + txhash + "\">" + txShortHash + "</a>";
        if (addBR) {
            url = "<br>" + url;
        }
        return url;
    }
}