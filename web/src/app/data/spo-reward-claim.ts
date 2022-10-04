import { TokenClaim } from "./token-claimv2";

export class SpoRewardClaim {
    public rewards: Array<TokenClaim> = [];
    public recipient_stake_addr: string;
    public recipient_payment_addr: number;

    constructor(data: any) {
        if (data != null) {
            if (data.tokens) {
                data.tokens.foreach((token) => {
                    this.rewards.push(new TokenClaim(token));
                });
            }
            if (data.recipient_stake_addr) {
                this.recipient_stake_addr = data.recipient_stake_addr;
            }
            if (data.recipient_payment_addr) {
                this.recipient_payment_addr = +data.recipient_payment_addr;
            }

        }
    }
}