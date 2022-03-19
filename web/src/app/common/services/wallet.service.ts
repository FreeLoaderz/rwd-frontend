import {Injectable} from "@angular/core";
import {Wallet} from "../data/wallet";
import {WalletObserverService} from "./wallet-observer.service";

@Injectable()
export class WalletService {
    public walletSubstring: string;
    public numWalletCalls: number = 0;

    constructor(public walletObserver: WalletObserverService) {

    }

    /**
     * Check if ccvault is available
     */
    public ccvaultAvailable(): boolean {
        return (globalThis.cardano.ccvault != null);
    }

    /**
     * Connect to ccvault wallet ext
     */
    public connectCCVault(): string {
        if (globalThis.cardano.ccvault != null) {
            globalThis.cardano.ccvault.enable().then((api) => {
                    this.finishWalletConnect(api, "ccvault");
                }
            ).catch((e) => {
                return ("Could not connect with CCVault!");
            });
        } else {
            return ("CCVault extension not installed");
        }
        return null;
    }

    /**
     * Check if Nami is available
     */
    public namiAvailable(): boolean {
        return (globalThis.cardano.nami != null);
    }

    /**
     * Connect to the nami ext
     */
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

    /**
     * Check if gero is available
     */
    public geroAvailable(): boolean {
        return (globalThis.cardano.gero != null);
    }

    /**
     * Connect to the gero ext
     */
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

    /**
     * Check if flint is available
     */
    public flintAvailable(): boolean {
        return (globalThis.cardano.flint != null);
    }

    /**
     * Connect to the flint ext
     */
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

    /**
     * Finish connecting to the wallet and pull the wallet data
     * @param api
     * @param source
     */
    public finishWalletConnect(api: any, source: string) {
        if (api != null) {
            globalThis.walletSource = source;
            globalThis.walletApi = api;
            /**
             * https://cips.cardano.org/cips/cip30/
             */
            globalThis.wallet = new Wallet(null);
            this.numWalletCalls = 6;
            globalThis.walletApi.getNetworkId()
                .then(data => this.processNetworkId(data))
                .catch(e => this.handleError(e));
            globalThis.walletApi.getRewardAddresses()
                .then(res => this.processRewardAddresses(res))
                .catch(e => this.handleError(e));
            globalThis.walletApi.getUtxos()
                .then(res => this.processUtxos(res))
                .catch(e => this.handleError(e));
            globalThis.walletApi.getUnusedAddresses()
                .then(res => this.processUnusedAddresses(res))
                .catch(e => this.handleError(e));
            globalThis.walletApi.experimental.getCollateral()
                .then(res => this.processCollateral(res))
                .catch(e => this.handleError(e));
            globalThis.walletApi.getBalance()
                .then(res => this.processMaskedBalance(res))
                .catch(e => this.handleError(e));
        }
    }

    /**
     * Set the wallet network
     * @param data
     * @private
     */
    private processNetworkId(data: any) {
        console.log("processNetworkId [" + data + "]");
        globalThis.wallet.network = data;
        if (--this.numWalletCalls === 0) {
            this.walletObserver.setloaded(true);
        }
    }

    /**
     * Process the reward addresses/stake addr
     * @param data
     * @private
     */
    private processRewardAddresses(data: any) {
        if (data[0] != null) {
            globalThis.wallet.sending_stake_addr = data[0];
            if (--this.numWalletCalls === 0) {
                this.walletObserver.setloaded(true);
            }
        } else {
            this.handleError("Reward Address was null?");
            return;
        }
    }

    /**
     * Process the UTXOs/inputs
     * @param data
     * @private
     */
    private processUtxos(data: any) {
        for (let i = 0; i < data.length; ++i) {
            globalThis.wallet.inputs.push(data[i]);
        }
        if (--this.numWalletCalls === 0) {
            this.walletObserver.setloaded(true);
        }
    }

    /**
     * Process the unused addr/sending_wallet_addr
     * @param data
     * @private
     */
    private processUnusedAddresses(data: any) {
        for (let i = 0; i < data.length; ++i) {
            globalThis.wallet.sending_wal_addrs.push(data[i]);
        }
        if (--this.numWalletCalls === 0) {
            this.walletObserver.setloaded(true);
        }
    }

    /**
     * Process the collateral data
     * @param data
     * @private
     */
    private processCollateral(data: any) {
        for (let i = 0; i < data.length; ++i) {
            globalThis.wallet.collateral.push(data[i]);
        }
        if (--this.numWalletCalls === 0) {
            this.walletObserver.setloaded(true);
        }
    }

    /**
     * Process the balance
     * @param data
     * @private
     */
    private processMaskedBalance(data: any) {
        globalThis.wallet.maskedBalance = data;
        if (--this.numWalletCalls === 0) {
            this.walletObserver.setloaded(true);
        }
    }

    /**
     * @TODO -> Need some kind of error handling for this.. not just print console
     * @param e
     */
    public handleError(e: any) {
        console.log("Wallet Service error occured! [" + e + "]");
        if (--this.numWalletCalls === 0) {
            this.walletObserver.setloaded(true);
        }
    }

    /**
     * Check if the user has ANY wallet available
     *
     * @TODO should display something for the user if false
     */
    public anyWalletAvailable(): boolean {
        if ((this.ccvaultAvailable()) ||
            (this.namiAvailable()) ||
            (this.flintAvailable()) ||
            (this.geroAvailable())) {
            return true;
        }
        return false;
    }

    /**
     * Get the wallet substring to display
     */
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