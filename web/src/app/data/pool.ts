import converter from "bech32-converting";

export class Pool {
    public name: string;
    public description: string;
    public shortDesc: string;
    public compressedDesc: string;
    public ticker: string;
    public homepage: string;
    public pool_id: string;
    public poolhash: string;
    public logo: string;
    public extended: string;
    public url: string;
    public randomNum: number;

    constructor(data: any) {
        if (data != null) {
            if (data.name) {
                this.name = data.name;
            }
            if (data.description) {
                this.description = data.description;
                if (this.description.length > 100) {
                    this.shortDesc = this.description.substring(0, 100).concat("..");
                } else {
                    this.shortDesc = this.description;
                }
                if (this.description.length > 70) {
                    this.compressedDesc = this.description.substring(0, 70).concat("..");
                } else {
                    this.compressedDesc = this.description;
                }
            }
            if (data.ticker) {
                this.ticker = data.ticker;
            }
            if (data.homepage) {
                this.homepage = data.homepage;
            }
            if (data.poolhash) {
                this.setPoolhash(data.poolhash);
            }
            if (data.pool_id) {
                this.pool_id = data.pool_id;
            }
            if (data.logo) {
                this.logo = data.logo;
            }
            if (data.url) {
                this.url = data.url;
            }
            if (data.extended) {
                this.extended = data.extended;
            }
            this.randomNum = Math.random() * 1000;
        }
    }

    public setPoolhash(poolhash: string) {
        this.poolhash = poolhash;
        if (this.pool_id == null) {
            this.pool_id = converter('pool').toBech32(this.poolhash);
        }
    }

    public static sortByRandom(a: any, b: any): number {
        if (a.randomNum > b.randomNum) {
            return 1;
        } else if (a.randomNum < b.randomNum) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }

    public static sort(a: any, b: any): number {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        if (a.ticker > b.ticker) {
            return 1;
        } else if (a.ticker < b.ticker) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }
}

const sample = {
    "name": "ADA for Warriors",
    "description": "Mission-driven single pool that donates it's op's rewards to the Third Option Foundation (50%) and Captive Audience (25%). TOF supports the CIA's Spec Ops community and Captive Audience provides an array of security/survivability courses and services.",
    "ticker": "4WARD",
    "homepage": "https://4wardpool.swiftcryptollc.com/",
    "extended": "https://4wardpool.swiftcryptollc.com/extendedPoolMetaData.json",
    "id": "b6063f0f2fa05d98132f15defed4c69c06ea61451b4ea4cea0ce1b80",
    "logo": ""
};