import {UtilityService} from "../services/utility.service";

export class Token {
    public tokenname: string;
    public currencysymbol: string;
    public fingerprint: string;
    public amount: number;
    public selected: boolean = false;

    constructor(data: any) {
        if (data != null) {
            if (data.tokenname) {
                try {
                    // Yes, has to be done twice
                    this.tokenname = UtilityService.hexToString(UtilityService.hexToString(data.tokenname));
                } catch (e: any) {
                    console.log("Could not convert token name [" + data.tokenname + "]");
                    this.tokenname = data.tokenname;
                }
            }
            if (data.policy) {
                this.currencysymbol = data.policy;
            } else if (data.currencysymbol) {
                this.currencysymbol = data.currencysymbol;
            }
            if (data.fingerprint) {
                this.fingerprint = data.fingerprint;
            }
            if ((data.tot_earned) && (data.tot_claimed)) {
                this.amount = data.tot_earned - data.tot_claimed;
            } else if (data.amount) {
                this.amount = +data.amount;
            }
            if (data.selected != null) {
                this.selected = data.selected;
            }
        }
    }
}

const example = {
    "tokenname": "4172746966637454657374546f6b656e303030323033",
    "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
    "fingerprint": "",
    "amount": 1
};