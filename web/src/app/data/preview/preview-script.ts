import {NftMinter} from "./nft-minter";

export class PreviewScript {
    public NftMinter: NftMinter;

    constructor() {
        this.NftMinter = new NftMinter();
    }
}

/**
 * The "script" part should be excluded
 */
const example = {
    "script": {
        "NftMinter": {
            "mint_tokens": [],
            "mint_metadata": "",
            "receiver_payment_addr": "00f81aecb5b5d743fbf2310798b5da6cf3291d6e9a8da9cb57935cd8ff30b592cedfb75533b2dc0cec3dee1c893e23adaa3379f757046dde0b",
            "auto_mint": false,
            "contract_id": 0
        }

    }
};
