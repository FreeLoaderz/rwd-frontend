import {ModifierEquation} from "./modifier-equation";
import {DatePipe} from "@angular/common";
import {TokenMetadata} from "./token-metadata";
import {UtilityService} from "../services/utility.service";

export class Token {

    public id: number;
    public fingerprint: string;
    public policy_id: string;
    public tokenname: string;
    public displayName: string;
    public contract_id: number;
    public user_id: number;
    public vesting_period: string;
    public pools: Array<string> = [];
    public mode: string;
    public equation: string;
    public start_epoch: number;
    public end_epoch: string;
    public modificator_equ: ModifierEquation;
    public created_at: string;
    public displayCreatedDate: string;
    public updated_at: string;
    public displayUpdatedDate: string;
    public tokenMetadata: TokenMetadata;
    public storageId: string;

    constructor(data: any) {
        if (data != null) {
            const datePipe = new DatePipe("en-US");
            if (data.id != null) {
                this.id = data.id;
            }
            if (data.fingerprint != null) {
                this.fingerprint = data.fingerprint;
            }
            if (data.policy_id != null) {
                this.policy_id = data.policy_id;
            }
            if (data.tokenname != null) {
                this.tokenname = data.tokenname;
                try {
                    this.displayName = UtilityService.hexToString(data.tokenname);
                } catch (e: any) {
                    this.displayName = data.tokenname;
                }
            }
            if (data.contract_id != null) {
                this.contract_id = data.contract_id;
            }
            if (data.user_id != null) {
                this.user_id = data.user_id;
            }
            if (data.vesting_period != null) {
                this.vesting_period = data.vesting_period;
            }
            if ((data.pools != null) && (data.pools.length > 0)) {
                for (let i = 0; i < data.pools.length; ++i) {
                    const pool_id = data.pools[i].substring(0, data.pools[i].indexOf(","));
                    this.pools.push(pool_id);
                }
            }
            if (data.mode != null) {
                this.mode = data.mode;
            }
            if (data.equation != null) {
                this.equation = data.equation;
            }
            if (data.start_epoch != null) {
                this.start_epoch = data.start_epoch;
            }
            if (data.end_epoch != null) {
                this.end_epoch = data.end_epoch;
            }
            if (data.modificator_equ != null) {
                this.modificator_equ = new ModifierEquation(data.modificator_equ);
            }
            if (data.created_at != null) {
                this.created_at = data.created_at;
                this.displayCreatedDate = datePipe.transform(new Date(this.created_at), 'yy-MM-dd');
            }
            if (data.updated_at != null) {
                this.updated_at = data.updated_at;
                this.displayUpdatedDate = datePipe.transform(new Date(this.updated_at), 'yy-MM-dd');
            }
            if (data.tokenMetadata != null) {
                this.tokenMetadata = new TokenMetadata(data.tokenMetadata, null);
            }
            this.storageId = this.fingerprint.concat(this.updated_at);
        }
    }
}

export function sortByName(a: any, b: any): number {
    if (a.displayName > b.displayName) {
        return 1;
    } else if (a.displayName < b.displayName) {
        return -1;
    }
    // a must be equal to b
    return 0;
}
