import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Pool} from "../data/pool";
import {PoolObserverService} from "./observers/pool-observer.service";
import {WalletObserverService} from "./observers/wallet-observer.service";
import {Subscription} from "rxjs";

@Injectable()
export class PoolService {
    public static poolList: Array<Pool> = [];
    public static poolCount: number = 0;
    public static walletSubscription: Subscription;
    public static walletLoaded: boolean = false;
    public static poolsLoaded: boolean = false;

    constructor(private httpClient: HttpClient, public poolObserver: PoolObserverService, public walletObserver: WalletObserverService) {
        if (PoolService.walletSubscription == null) {
            PoolService.walletSubscription = this.walletObserver.loaded$.subscribe(loaded => {
                if (loaded) {
                    PoolService.walletLoaded = loaded;
                    if (PoolService.poolList.length === 0) {
                        this.httpClient.get<Array<any>>("assets/config/fullmetadata.json").subscribe(data => {
                            for (let i = 0; i < data.length; ++i) {
                                const pool: Pool = new Pool(data[i]);
                                PoolService.poolList.push(pool);
                            }

                            this.httpClient.get<Array<any>>("assets/config/fullextended.json").subscribe(exData => {
                                let poolIndex: number = 0;
                                for (let i = 0; i < exData.length; ++i) {
                                    while ((PoolService.poolList[poolIndex].extended == null) &&
                                    (poolIndex < PoolService.poolList.length)) {
                                        ++poolIndex;
                                    }
                                    if ((exData[i].info) && (exData[i].info.url_png_icon_64x64)) {
                                        PoolService.poolList[poolIndex].logo = exData[i].info.url_png_icon_64x64;
                                    }
                                    ++poolIndex;
                                }
                                PoolService.poolList.sort((a, b) => Pool.sort(a, b));
                                this.poolObserver.setPoolList(PoolService.poolList);
                            });
                        });
                    }
                }
            });
        }
    }
}