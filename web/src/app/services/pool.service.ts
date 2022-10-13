import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Pool} from "../data/pool";
import {PoolObserverService} from "./observers/pool-observer.service";
import {RestService} from "./rest.service";

@Injectable()
export class PoolService {
    public static poolList: Array<Pool> = [];
    public static poolMap: Map<string, Pool> = new Map<string, Pool>();
    public static initialized: boolean = false;
    public static finished: boolean = false;

    constructor(private httpClient: HttpClient, public poolObserver: PoolObserverService,
                public restService: RestService) {
    }

    public initialize() {
        if (PoolService.initialized === false) {
            PoolService.initialized = true;
            if ((location.host.endsWith('smartclaimz.io')) ||
                (location.host.endsWith('smartclaimz.com')) ||
                (location.host.startsWith("127.0.0.1"))) {
                PoolService.initialized = true;
                this.httpClient.get<Array<any>>("assets/config/fullmetadata.json").subscribe(data => {
                    for (let i = 0; i < data.length; ++i) {
                        const pool: Pool = new Pool(data[i]);
                        PoolService.poolList.push(pool);
                    }
                    this.httpClient.get<Array<any>>("assets/config/poolhash.json").subscribe(poolhashes => {
                        for (let i = 0; i < poolhashes.length; ++i) {
                            PoolService.poolList[i].setPoolhash(poolhashes[i].poolhash);
                            PoolService.poolMap.set(PoolService.poolList[i].pool_id, PoolService.poolList[i]);
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
                            PoolService.finished = true;
                        });
                    });
                });
            }
        }
    }
}