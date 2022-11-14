import {Component, OnDestroy, OnInit} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../services/rest.service";
import {Subscription} from "rxjs";
import {WalletObserverService} from "../../services/observers/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Title} from "@angular/platform-browser";
import {Pool} from "../../data/pool";
import {PoolService} from "../../services/pool.service";
import {PoolObserverService} from "../../services/observers/pool-observer.service";

@Component({
    selector: 'delegate',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './delegate.html'
})

export class DelegateComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;
    public pools: Array<Pool> = [];
    public initialized: boolean = false;
    public isPreview: boolean = false;
    public wasPreview: boolean = false;
    public poolSub: Subscription;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public titleService: Title, public poolService: PoolService, public poolObserverService: PoolObserverService) {
        super(notifierService);
        if (globalThis.pools == null) {
            globalThis.pools = [];
        }
        this.titleService.setTitle("Pools");
    }

    public ngOnInit() {
        this.poolSub = this.poolObserverService.poolList$.subscribe(poolList => {
            this.processPoolList(poolList);
        });
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (this.walletLoaded) {
                    this.wasPreview = this.isPreview;
                    this.setNetwork();
                    if (this.wasPreview !== this.isPreview) {
                        this.listPools();
                    }
                }
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        this.setNetwork();
        this.listPools();
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
        this.poolSub.unsubscribe();
    }


    public listPools() {
        globalThis.pools = [];
        if (this.isPreview) {
            const pools: Array<Pool> = [];
            const apex: Pool = new Pool({
                "name": "Apex Cardano Pool",
                "description": "APEX Stake Pool: Low fees - 340 Fixed Cost and 1.5% Margin (variable fee). SPO with 24 years of IT experience, supporting the Cardano community and the decentralization of Cardano. Delegate your ADA to APEX Pool!",
                "ticker": "APEX",
                "homepage": "https://apexpool.info/",
                "extended": "https://apexpool.info/extended.json",
                "pool_id": "efae72c07a26e4542ba55ef59d35ad45ffaaac312865e3a758ede997",
                "logo": "https://apexpool.info/img/logo.png"
            });
             const envy: Pool = new Pool({
                "name": "ENVY Preview Pool",
                "description": "ENVY provides excellent staking service, with zero margin fees. 20% operator rewards are donated to Dave Thomas Foundation for Adoption & Save the Children. @EnvyStakePool on Twitter & www.envystakepool.com. We support decentralization.",
                "ticker": "ENVY",
                "homepage": "https://envystakepool.com",
                "extended": "https://git.io/Ju1j9",
                "pool_id": "d5c3796128e9657b52511c11b240f1b0ba53c78b9c44c2c9d7920395",
                "logo": "https://static.wixstatic.com/media/63a3ee_c86a030e820640eda11b6342d3e45610~mv2.png"
            });
            const santo: Pool = new Pool({
                "name": "SANTO",
                "description": "Santo Cardano Stake Pool.",
                "ticker": "SANTO",
                "homepage": "https://www.santoelectronics.com/santonode",
                "pool_id": "e931eea8a3e9344656f3f233e55c32ea5056303b5c313015871bc57f",
                "logo": "https://santoelectronics.com/s/santo.png"
            });
            pools.push(apex);
            pools.push(envy);
            pools.push(santo);
            this.processPoolList(pools);
        } else {
            this.processPoolList(PoolService.poolList);
        }
    }

    public processPoolList(data: any) {
        globalThis.pools = [];
        for (let i = 0; i < data.length; ++i) {
            const newPool = new Pool(data[i]);
            globalThis.pools.push(newPool);
        }
        globalThis.pools.sort((a, b) => Pool.sortByRandom(a, b));
        this.pools = [...globalThis.pools];
        this.initialized = true;
    }


    public setNetwork() {
        if (globalThis.wallet != null) {
            this.isPreview = (true === (0 === globalThis.wallet.network));
        } else if (location.host.endsWith('rwd.freeloaderz.io')) {
            this.isPreview = true;
        } else {
            this.isPreview = false;
        }
    }
}