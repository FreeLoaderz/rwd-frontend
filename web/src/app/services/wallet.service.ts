import {Injectable} from "@angular/core";
import {Wallet} from "../data/wallet";
import {WalletObserverService} from "./observers/wallet-observer.service";
import converter from "bech32-converting";

@Injectable()
export class WalletService {
    public walletSubstring: string;
    public numWalletCalls: number = 0;
    public walletLoaded: boolean = false;
    public errorLoadingWallet: boolean = false;
    public onlyMainnet: boolean = true;

    constructor(public walletObserver: WalletObserverService) {
        this.walletObserver.loaded$.subscribe(loaded => {
            this.walletLoaded = loaded;
        });
        if (location.host === 'rwd.freeloaderz.io') {
            this.onlyMainnet = false;
        } else {
            this.onlyMainnet = true;
        }
    }

    /**
     * Check if eternl is available
     */
    public eternlAvailable(): boolean {
        return ((globalThis != null) && (globalThis.cardano != null) && (globalThis.cardano.eternl != null));
    }

    /**
     * Connect to eternl wallet ext
     */
    public connectEternl(): string {
        if (globalThis.cardano.eternl != null) {
            globalThis.cardano.eternl.enable().then((api) => {
                    this.finishWalletConnect(api, "eternl");
                }
            ).catch((e) => {
                this.walletObserver.setError("Could not connect with Eternl!");
            });
            return null;
        } else {
            return ("Eternl extension not installed");
        }
        return null;
    }

    /**
     * Check if Nami is available
     */
    public namiAvailable(): boolean {
        return ((globalThis != null) && (globalThis.cardano != null) && (globalThis.cardano.nami != null));
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
                this.walletObserver.setError("Could not connect with Nami!");
            });
            return null;
        } else {
            return ("Nami extension not installed");
        }
        return null;
    }

    /**
     * Check if gero is available
     */
    public geroAvailable(): boolean {
        return ((globalThis != null) && (globalThis.cardano != null) && (globalThis.cardano.gerowallet != null));
    }

    /**
     * Connect to the gero ext
     */
    public connectGero(): string {
        if (globalThis.cardano.gerowallet != null) {
            globalThis.cardano.gerowallet.enable().then((api) => {
                    this.finishWalletConnect(api, "gero");
                }
            ).catch((e) => {
                this.walletObserver.setError("Could not connect with Gero!");
            });
            return null;
        } else {
            return ("Gero extension not installed");
        }
        return null;
    }

    /**
     * Check if flint is available
     */
    public flintAvailable(): boolean {
        return ((globalThis != null) && (globalThis.cardano != null) && (globalThis.cardano.flint != null));
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
                this.walletObserver.setError("Could not connect with Flint!");
            });
            return null;
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
            this.errorLoadingWallet = false;
            globalThis.walletSource = source;
            globalThis.walletApi = api;
            /**
             * https://cips.cardano.org/cips/cip30/
             */
            globalThis.wallet = new Wallet(null);
            globalThis.walletApi.getNetworkId()
                .then(data => this.processNetworkId(data))
                .catch(e => this.handleError(e));
        }
    }

    public updateWallet() {
        this.walletObserver.setloaded(false);
        this.numWalletCalls = 5;
        globalThis.walletApi.getRewardAddresses()
            .then(res => this.processRewardAddresses(res))
            .catch(e => this.handleError(e));
        globalThis.walletApi.getUtxos()
            .then(res => this.processUtxos(res))
            .catch(e => this.handleError(e));
        /*
        // Deprecated
        if (globalThis.walletSource === "nami") {
            globalThis.walletApi.getUsedAddresses()
                .then(res => this.processUsedAddresses(res))
                .catch(e => this.handleError(e));
        } else {
            globalThis.walletApi.getUnusedAddresses()
                .then(res => this.processUnusedAddresses(res))
                .catch(e => this.handleError(e));
        }
        */
        globalThis.walletApi.getUsedAddresses()
            .then(res => this.processUsedAddresses(res))
            .catch(e => this.handleError(e));
        globalThis.walletApi.experimental.getCollateral()
            .then(res => this.processCollateral(res))
            .catch(e => this.handleError(e));
        globalThis.walletApi.getBalance()
            .then(res => this.processMaskedBalance(res))
            .catch(e => this.handleError(e));
    }

    /**
     * Set the wallet network
     * @param data
     * @private
     */
    private processNetworkId(data: any) {
        globalThis.wallet.network = data;
        if (((this.onlyMainnet) && (globalThis.wallet.network !== 0)) ||
            ((!this.onlyMainnet) && (globalThis.wallet.network === 0))) {
            if (--this.numWalletCalls === 0) {
                this.walletObserver.setloaded(true);
            }
            this.updateWallet();
        } else {
            this.walletObserver.setloaded(false);
            if (this.onlyMainnet) {
                this.walletObserver.setError("Please connect your mainnet wallet");
            } else {
                this.walletObserver.setError("Please connect your preview wallet");
            }
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
            let prefix = "stake";
            if (globalThis.wallet.network === 0) {
                prefix = "stake_test";
            }
            globalThis.wallet.bech32_stake_addr = converter(prefix).toBech32(globalThis.wallet.sending_stake_addr);
            if (--this.numWalletCalls === 0) {
                this.finishedWalletCalls();
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
        globalThis.wallet.inputs = [];
        for (let i = 0; i < data.length; ++i) {
            globalThis.wallet.inputs.push(data[i]);
        }
        if (--this.numWalletCalls === 0) {
            this.finishedWalletCalls();
        }
    }

    /**
     * Process the unused addr/sending_wallet_addr
     * @param data
     * @private
     */
    private processUnusedAddresses(data: any) {
        globalThis.wallet.sending_wal_addrs = [];
        for (let i = 0; i < data.length; ++i) {
            globalThis.wallet.sending_wal_addrs.push(data[i]);
        }
        if (--this.numWalletCalls === 0) {
            this.finishedWalletCalls();
        }
    }

    /**
     * Process the used addr/sending_wallet_addr
     * @param data
     * @private
     */
    private processUsedAddresses(data: any) {
        globalThis.wallet.sending_wal_addrs = [];
        for (let i = 0; i < data.length; ++i) {
            if (data[i].length > 110) {
                globalThis.wallet.sending_wal_addrs.push(data[i]);
            }
        }
        if (--this.numWalletCalls === 0) {
            this.finishedWalletCalls();
        }
    }

    /**
     * Process the collateral data
     * @param data
     * @private
     */
    private processCollateral(data: any) {
        globalThis.wallet.collateral = [];
        for (let i = 0; i < data.length; ++i) {
            globalThis.wallet.collateral.push(data[i]);
        }
        if (--this.numWalletCalls === 0) {
            this.finishedWalletCalls();
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
            this.finishedWalletCalls();
        }
    }

    /**
     * @TODO -> Need some kind of error handling for this.. not just print console
     * @param e
     */
    public handleError(e: any) {
        this.errorLoadingWallet = true;
        console.log(e);
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
        if ((this.eternlAvailable()) ||
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
        } else if ((globalThis.wallet != null)
            && (globalThis.wallet.sending_wal_addrs != null)
            && (globalThis.wallet.sending_wal_addrs.length > 0)) {
            let prefix = "addr";
            if (globalThis.wallet.network === 0) {
                prefix = "addr_test";
            }
            const tempAddr = converter(prefix).toBech32(globalThis.wallet.sending_wal_addrs[0].substring(0, 93));
            this.walletSubstring = tempAddr.substring(0, (prefix.length + 7));
            return this.walletSubstring;
        }
        return "";
    }

    /**
     *
     * @private
     */
    private finishedWalletCalls() {
        this.walletObserver.setloaded(true);
        this.storeWalletToLocal(globalThis.walletSource);
    }

    /**
     *
     * @param source
     */
    private storeWalletToLocal(source: string) {
        localStorage.setItem('SmartClaimzWalletSource', source);
    }
}
