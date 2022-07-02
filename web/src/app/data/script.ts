import {MarketPlace} from "./market-place";
import {SpoRewardClaim} from "./spo-reward-claim";

export class Script {
    public Marketplace: MarketPlace;
    public SpoRewardClaim: SpoRewardClaim;
    constructor(data: any) {
        if (data != null) {
            if (data.SpoRewardClaim) {
                this.SpoRewardClaim = new SpoRewardClaim(data.Marketplace);
            }
        }
    }
}