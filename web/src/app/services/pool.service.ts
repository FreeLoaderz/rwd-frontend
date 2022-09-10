import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Pool} from "../data/pool";
import {PoolObserverService} from "./observers/pool-observer.service";

@Injectable()
export class PoolService {
    public static poolList: Array<Pool> = [];
    public static initialized: boolean = false;

    constructor(private httpClient: HttpClient, public poolObserver: PoolObserverService) {
        if (location.host.endsWith('smartclaimz.io')) {
            if (!PoolService.initialized) {
                PoolService.initialized = true;
                this.httpClient.get<Array<any>>("assets/config/fullmetadata.json").subscribe(data => {
                    for (let i = 0; i < data.length; ++i) {
                        const pool: Pool = new Pool(data[i]);
                        PoolService.poolList.push(pool);
                    }
                    this.httpClient.get<Array<any>>("assets/config/pool_ids.json").subscribe(poolids => {
                        for (let i = 0; i < poolids.length; ++i) {
                            PoolService.poolList[i].setPoolId(poolids[i].pool_id);
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
                });
            }
        }
    }
}