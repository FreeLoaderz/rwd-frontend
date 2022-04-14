import {UtilityService} from "../services/utility.service";
import {DatePipe} from "@angular/common";

export class HistoricalClaim {
    public stake_addr: string;
    public payment_addr: string;
    public policyid: string;
    public tokenname: string;
    public displayName: string;
    public fingerprint: string;
    public amount: number;
    public contract_id: string;
    public user_id: string;
    public txhash: string;
    public txURL: string;
    public invalid: string;
    public invalid_descr: string;
    public timestamp: string;
    public displayTS: string;
    public updated_at: string;

    constructor(data: any) {
        if (data != null) {
            if (data.stake_addr) {
                this.stake_addr = data.stake_addr;
            }
            if (data.payment_addr) {
                this.payment_addr = data.payment_addr;
            }
            if (data.tokenname) {
                this.tokenname = data.tokenname;
                try {
                    this.displayName = UtilityService.hexToString(data.tokenname);
                } catch (e: any) {
                    console.log("Could not convert token name [" + data.tokenname + "]");
                    this.displayName = data.tokenname;
                }
            }
            if (data.fingerprint) {
                this.fingerprint = data.fingerprint;
            }
            if (data.amount) {
                this.amount = data.amount;
            }
            if (data.contract_id) {
                this.contract_id = data.contract_id;
            }
            if (data.user_id) {
                this.user_id = data.user_id;
            }
            if (data.txhash) {
                this.txhash = data.txhash;
                this.txURL = UtilityService.generateTxHashURL(data.txhash, false);
            }
            if (data.invalid) {
                this.invalid = data.invalid;
            }
            if (data.invalid_descr) {
                this.invalid_descr = data.invalid_descr;
            }
            if (data.timestamp) {
                this.timestamp = data.timestamp;
                const date = new Date(this.timestamp);
                const datePipe = new DatePipe("en-US");
                this.displayTS = datePipe.transform(date, 'yy-MM-dd HH:mm:ss');
            }
            if (data.updated_at) {
                this.updated_at = data.updated_at;
            }
        }
    }
    public static sort(a: any, b: any): number {
        if (a.timestamp < b.timestamp) {
            return 1;
        } else if (a.timestamp > b.timestamp) {
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
    "stake_addr": "stake_test1urr8a6dy0zr2wte054xu7x9t63mnksh3gmr2vwfsj24upfcc9krzk",
    "payment_addr": "addr_test1qra78hxqu8pvyugm3uyw56xg05ryxcwp3ezqjtf73dmtrk7x0m56g7yx5uhjlf2deuv2h4rh8dp0z3kx5cunpy4tcznscs90gk",
    "policyid": "542b7ade184b6eea769f42d2d1f2902f366e0e9369b719d671e3d498",
    "tokenname": "61706578636f696e",
    "fingerprint": "asset1wpsl4pru06cnuf8xy8n2s0l0tpwfu6t0t8yxzj",
    "amount": "1",
    "contract_id": 1,
    "user_id": 1,
    "txhash": "2eee3be7ceec6402d37eb9758f028ab770de0ab82d8efe1a5895f75088579951",
    "invalid": null,
    "invalid_descr": null,
    "timestamp": "2022-04-08T19:04:22.646296Z",
    "updated_at": "2022-04-08T19:04:22.646296Z"
};