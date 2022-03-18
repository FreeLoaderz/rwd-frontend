import {Injectable} from "@angular/core";

@Injectable()
export class WalletService {
    public walletSubstring: string;

    constructor() {

    }

    public ccvaultAvailable(): boolean {
        return (globalThis.cardano.ccvault != null);
    }

    public connectCCVault(): string {
        if (globalThis.cardano.ccvault != null) {
            globalThis.cardano.ccvault.enable().then((api) => {
                    this.finishWalletConnect(api, "nami");
                }
            ).catch((e) => {
                return ("Could not connect with CCVault!");
            });
        } else {
            return ("CCVault extension not installed");
        }
        return null;
    }

    public namiAvailable(): boolean {
        return (globalThis.cardano.nami != null);
    }

    public connectNami(): string {
        if (globalThis.cardano.nami != null) {
            globalThis.cardano.nami.enable().then((api) => {
                    this.finishWalletConnect(api, "nami");
                }
            ).catch((e) => {
                return ("Could not connect with Nami!");
            });
        } else {
            return ("Nami extension not installed");
        }
        return null;
    }

    // Gero Wallet
    public connectGero(): string {
        if (globalThis.cardano.gero != null) {
            globalThis.cardano.gero.enable().then((api) => {
                    this.finishWalletConnect(api, "gero");
                }
            ).catch((e) => {
                return ("Could not connect with Gero!");
            });
        } else {
            return ("Gero extension not installed");
        }
        return null;
    }

    public geroAvailable(): boolean {
        return (globalThis.cardano.gero != null);
    }


    // Flint
    public connectFlint(): string {
        if (globalThis.cardano.flint != null) {
            globalThis.cardano.flint.enable().then((api) => {
                    this.finishWalletConnect(api, "flint");
                }
            ).catch((e) => {
                return ("Could not connect with flint!");
            });
        } else {
            return ("Flint extension not installed");
        }
        return null;
    }

    public flintAvailable(): boolean {
        return (globalThis.cardano.flint != null);
    }

    public finishWalletConnect(api: any, source: string) {
        if (api != null) {
            globalThis.wallet = source;
            globalThis.walletApi = api;
        }
    }

    public anyWalletAvailable(): boolean {
        if ((this.ccvaultAvailable()) ||
            (this.namiAvailable()) ||
            (this.flintAvailable()) ||
            (this.geroAvailable())) {
            return true;
        }
        return false;
    }

    public getWalletSubstring() {
        if (this.walletSubstring != null) {
            return this.walletSubstring;
        } else if ((globalThis.wallet != null) && (globalThis.wallet.sending_stake_addr != null)) {
            const toEndOfString = globalThis.wallet.sending_stake_addr.length - 5;
            this.walletSubstring = globalThis.wallet.sending_stake_addr.substring(0, 5)
                .concat("...")
                .concat(globalThis.wallet.sending_stake_addr.substring(toEndOfString));
            return this.walletSubstring;
        }
        return "";
    }
}