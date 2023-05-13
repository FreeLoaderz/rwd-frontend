import {Component, HostListener, Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {NotificationComponent} from "../../notification/notification.component";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {WalletObserverService} from "../../../services/observers/wallet-observer.service";
import {NotifierService} from "angular-notifier";
import {WalletService} from "../../../services/wallet.service";
import {DOCUMENT} from "@angular/common";
import {PropertyService} from "../../../services/property.service";
import {PropertyObserverService} from "../../../services/observers/property-observer.service";
import {Subscription} from "rxjs";
import {RestService} from "../../../services/rest.service";
import {Script} from "../../../data/script";
import {WalletVerification} from "../../../data/wallet-verification";
import {Mint} from "../../../data/mint";

@Component({
    selector: 'bank-manager',
    styleUrls: ['../../../../styles/page-content.css',
        '../../../../styles/extensions/meld/meld.css',
        '../../../../styles/extensions/meld/responsive.css'],
    templateUrl: './bank-manager.html'
})
@Injectable()
export class BankManagerComponent extends NotificationComponent implements OnInit, OnDestroy {
    public fullScreen: boolean = false;
    public docElem: any;
    public meldHomepage: string = null;
    public logoClickCount = 0;
    public propertySubscription: Subscription;
    public walletLoaded: boolean = false;
    public walletLoading: boolean = false;
    public setWalletLoading: boolean = false;
    public invalidAddress: boolean = true;
    public manualAddress: string = null;
    public previousCheckedWalletAddress: string = null;
    public walletAddress: string = "";
    public shortWalletAddress: string = "";
    public isPreview: boolean = false;
    public requiresVerification: boolean = false;
    public mintError: boolean = false;
    public mintFinalized: boolean = false;
    public checkingVerification: boolean = false;
    public walletVerified: boolean = false;
    public isMinting: boolean = false;
    public validAddressLength = 103;
    public validAddressStart = "addr1";
    public verifiedAddress: string = null;
    public compressed: boolean = false;
    public addressRegEx: RegExp = new RegExp("addr[1|_test1][a-zA-Z0-9]{98}");
    public walletSubscription: Subscription;
    public walletErrorSubscription: Subscription;

    constructor(@Inject(DOCUMENT) public document: any,
                public router: Router, public titleService: Title, public walletObserverService: WalletObserverService,
                public notifierService: NotifierService, public walletService: WalletService,
                public propertyObserver: PropertyObserverService, public restService: RestService) {
        super(notifierService);
        titleService.setTitle("Meld Bank Manager");
    }

    ngOnInit() {
        this.docElem = this.document.documentElement;
        this.propertySubscription = this.propertyObserver.propertyMapSubject.subscribe(propertyMap => {
            this.processProperties(propertyMap);
        });
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (!loaded) {
                    if (this.setWalletLoading) {
                        this.walletLoading = true;
                    }
                    this.setWalletLoading = false;
                } else {
                    this.walletLoading = false;
                    this.isPreview = (true === (0 === globalThis.wallet.network));
                    if (this.isPreview) {
                        this.validAddressLength = 108;
                        this.validAddressStart = "addr_test1";
                    }
                    this.verifyWallet(null);
                    setTimeout(() => {
                        localStorage.removeItem('SmartClaimzWalletSource');
                    }, 1000);
                }
            }
        );

        this.walletErrorSubscription = this.walletObserverService.error$.subscribe(
            error => {
                this.walletLoaded = false;
                this.walletLoading = false;
                this.errorNotification(error);
                this.disconnectWallet();
            }
        );
        this.processProperties(this.propertyObserver.propertyMap);
        this.getScreenSize(null);
    }

    /**
     *
     */
    public ngOnDestroy() {
        this.disconnect();
    }

    disconnectWallet() {
        this.walletObserverService.setShowConnect(false);
    }

    processProperties(propertyMap: Map<string, string>) {
        if (propertyMap.has(PropertyService.MELD_HOMEPAGE)) {
            this.meldHomepage = propertyMap.get(PropertyService.MELD_HOMEPAGE);
        }
    }

    public verifyWallet(singleAddress: string) {
        // Verify the wallet
        if (!this.checkingVerification) {
            this.checkingVerification = true;
            if (singleAddress == null) {
                try {
                    this.restService.verifyWallet()
                        .then(res => {
                            if (res != null) {
                                this.processVerification(res);
                            } else {
                                this.showVerificationErrorInfo("Connected wallet has either been minted or it is not on the ISPO list");
                            }
                        })
                        .catch(e => this.processVerificationError(e));
                } catch (e) {
                    console.log(e);
                }
                /*                for (let i = 0; i < globalThis.wallet.sending_wal_addrs; ++i) {
                                    walletVerScript.wallet_addresses.push(globalThis.wallet.sending_wal_addrs[i]);
                                }*/
            } else {
                this.previousCheckedWalletAddress = singleAddress;
                try {
                    this.restService.verifyAddress(singleAddress)
                        .then(res => {
                            if (res != null) {
                                this.processVerification(res);
                            } else {
                                this.showVerificationError("Address has either been minted or it is not on the ISPO list");
                            }
                        })
                        .catch(e => this.processVerificationError(e));
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    public processVerification(res: any) {
        this.checkingVerification = false;
        if (res.address != null) {
            this.verifiedAddress = res;
            this.walletVerified = true;
            this.requiresVerification = false;
        } else {
            this.walletVerified = false;
            this.requiresVerification = true;
        }
    }

    public showVerificationErrorInfo(error) {
        this.checkingVerification = false;
        this.invalidAddress = true;
        // remove
        this.walletVerified = false;
        this.requiresVerification = true;
        //   this.invalidAddress = false;
        // end remove
        this.infoNotification(error);
    }

    public showVerificationError(error) {
        this.checkingVerification = false;
        this.invalidAddress = true;
        // remove
        this.walletVerified = false;
        this.requiresVerification = true;
        //   this.invalidAddress = false;
        // end remove
        this.errorNotification(error);
    }

    public processVerificationError(error) {
        this.checkingVerification = false;
        this.invalidAddress = true;
        // remove
        this.walletVerified = false;
        this.requiresVerification = true;
        //  this.invalidAddress = false;
        // end remove

        this.handleError(error);
    }

    public mintBankManager() {
        if (!this.isMinting) {
            this.mintFinalized = false;
            this.mintError = false;
            this.isMinting = true;
            globalThis.wallet.script = new Script(null);
            const mintScript = new Mint(null);
            globalThis.wallet.script.Mint = mintScript;
            this.restService.mint("")
                .then(res => {
                    if (res.msg) {
                        this.showMintError(res.msg);
                    } else {
                        this.processMint(res);
                    }
                })
                .catch(e => this.processMintError(e));
        }
    }

    public processMint(res: string) {
        if (res !== '') {
            this.mintFinalized = true;
        } else {
            this.mintError = true;
        }
    }


    public showMintError(error) {
        this.mintError = true;
        this.errorNotification(error);
    }

    public processMintError(error) {
        this.mintError = true;
        this.handleError(error);
    }


    toggleFullScreen() {
        if (this.logoClickCount++ === 0) {
            setTimeout(() => {
                if (this.logoClickCount > 1) {
                    if (this.fullScreen) {
                        this.closeFullscreen();
                    } else {
                        this.openFullscreen();
                    }
                } else if (this.meldHomepage != null) {
                    window.open(this.meldHomepage);
                } else {
                    this.warnNotification("Meld homepage isn't set!");
                }
                this.logoClickCount = 0;
            }, 250);
        }
    }

    openFullscreen() {
        this.fullScreen = true;
        if (this.docElem.requestFullscreen) {
            this.docElem.requestFullscreen();
        } else if (this.docElem.mozRequestFullScreen) {
            /* Firefox */
            this.docElem.mozRequestFullScreen();
        } else if (this.docElem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.docElem.webkitRequestFullscreen();
        } else if (this.docElem.msRequestFullscreen) {
            /* IE/Edge */
            this.docElem.msRequestFullscreen();
        }
    }

    /* Close fullscreen */
    closeFullscreen() {
        this.fullScreen = false;
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }
    }

    public routeFreeloaderz() {
        window.open("https://freeloaderz.io");
    }

    public connectWallet() {
        this.setWalletLoading = true;
        this.walletObserverService.setShowConnect(true);
    }

    public checkAddress() {
        this.invalidAddress = true;
        if (this.manualAddress != null) {
            if (this.manualAddress === this.previousCheckedWalletAddress) {
                this.invalidAddress = true;
            } else if (!this.manualAddress.startsWith(this.validAddressStart)) {
                this.invalidAddress = true;
            } else if (this.manualAddress.length !== this.validAddressLength) {
                this.invalidAddress = true;
            } else if (this.addressRegEx.test(this.manualAddress)) {
                this.invalidAddress = false;
            } else {
                this.invalidAddress = true;
            }
            if (!this.invalidAddress) {
                this.verifyWallet(this.manualAddress);
            }
        } else {
            this.invalidAddress = true;
        }
    }

    public disconnect() {
        globalThis.walletApi = null;
        globalThis.wallet = null;
        this.mintError = false;
        this.mintFinalized = false;
        this.checkingVerification = false;
        this.walletVerified = false;
        this.isMinting = false;
        this.walletObserverService.setloaded(false);
        localStorage.removeItem('SmartClaimzWalletSource');
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        if (window.innerWidth <= 973) {
            this.compressed = true;
        } else {
            this.compressed = false;
        }
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.getScreenSize(event);
    }
}
