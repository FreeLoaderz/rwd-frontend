import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Pool} from "../data/pool";
import {PoolObserverService} from "./observers/pool-observer.service";
import {RestService} from "./rest.service";
import {TokenMetadata} from "../data/token-metadata";

@Injectable()
export class PoolService {
    public static poolList: Array<Pool> = [];
    public static poolMap: Map<string, Pool> = new Map<string, Pool>();
    public static seenMap: Map<string, any> = new Map<string, any>();
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
                (location.host.startsWith('dev.d1u08xx2y74gx1.amplifyapp.com')) ||
                (location.host.startsWith("127.0.0.1"))) {
                const nowMs = new Date().getTime();
                this.restService.getAvailablePools()
                    .then(tokens => {
                        for (let i = 0; i < tokens.length; ++i) {
                            for (let j = 0; j < tokens[i].pools.length; ++j) {
                                const poolInfo = tokens[i].pools[j].split(",");
                                if (!PoolService.seenMap.has(poolInfo[0])) {
                                    PoolService.seenMap.set(poolInfo[0], true);
                                    if (localStorage.getItem(poolInfo[0]) != null) {
                                        const pool = new Pool(localStorage.getItem(poolInfo[0]));
                                        if (pool.nextUpdateMs < nowMs) {
                                            localStorage.removeItem(poolInfo[0]);
                                            this.getPoolData(poolInfo[0]);
                                        } else {
                                            PoolService.poolList.push(pool);
                                        }
                                    } else {
                                        this.getPoolData(poolInfo[0]);
                                    }
                                }
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
            PoolService.finished = true;
        }
    }

    public getPoolData(poolId: string) {
        setTimeout(() => {
            this.restService.getPoolMetadata(poolId)
                .then(data => {
                    console.log(data);
                    localStorage.setItem(poolId, data);
                    const pool: Pool = new Pool(data);
                    if (pool.extended != null) {
                        return fetch(pool.extended)
                            .then(res => {
                                res.text().then(exdata => {
                                    const exObj = JSON.parse(exdata);
                                    if (exObj.info) {
                                        if (exObj.info.url_png_icon_64x64) {
                                            pool.logo = exObj.info.url_png_icon_64x64;
                                        } else if (exObj.info.url_png_logo) {
                                            pool.logo = exObj.info.url_png_logo;
                                        }
                                        localStorage.setItem(poolId, data);
                                    }
                                    PoolService.poolList.push(pool);
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                PoolService.poolList.push(pool);
                            });
                    } else {
                        PoolService.poolList.push(pool);
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }
}
