import { UtilityService } from "../services/utility.service";
import { TokenMetadata } from "./token-metadata";

export class TokenClaim {
    public contract_id: number;
    public stake_addr: string;
    public policy: string;
    public tot_earned: number;
    public tot_claimed: number;
    public displayName: string;
    public tokenname: string;
    public currencysymbol: string;
    public fingerprint: string;
    public amount: number;
    public last_calc_epoch: number;
    public selected: boolean = false;
    public tokenMetadata: TokenMetadata;

    constructor(data: any) {
        if (data != null) {
            try {
                if (data.tokenname) {
                    this.tokenname = data.tokenname;
                    try {
                        this.displayName = UtilityService.hexToString(data.tokenname);
                    } catch (e: any) {
                        this.displayName = data.tokenname;
                    }
                }
                if (data.policy) {
                    this.currencysymbol = data.policy;
                    this.policy = data.policy;
                } else if (data.currencysymbol) {
                    this.currencysymbol = data.currencysymbol;
                    this.policy = data.currencysymbol;
                }
                if (data.fingerprint) {
                    this.fingerprint = data.fingerprint;
                }
                if ((data.tot_earned) && (data.tot_claimed)) {
                    this.tot_earned = data.tot_earned;
                    this.tot_claimed = data.tot_claimed;
                    this.amount = data.tot_earned - data.tot_claimed;
                } else if (data.amount) {
                    this.amount = +data.amount;
                }
                if (data.stake_addr != null) {
                    this.stake_addr = data.stake_addr;
                }
                if (data.contract_id != null) {
                    this.contract_id = data.contract_id;
                }
                if (data.selected != null) {
                    this.selected = data.selected;
                }
                if (data.last_calc_epoch) {
                    this.last_calc_epoch = data.last_calc_epoch;
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    public static sort(a: any, b: any): number {
        if (a.amount < b.amount) {
            return 1;
        } else if (a.amount > b.amount) {
            return -1;
        }
        if (a.displayName > b.displayName) {
            return 1;
        } else if (a.displayName < b.displayName) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }
}

const example = {
    "tokenname": "4172746966637454657374546f6b656e303030323033",
    "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
    "fingerprint": "",
    "amount": 1
};