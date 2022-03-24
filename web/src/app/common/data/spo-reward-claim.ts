import {Token} from "./token";

export class SpoRewardClaim {
    public reward_tokens: Array<Token> = [];
    public recipient_stake_addr: string;
    public recipient_payment_addr: number;

    constructor(data: any) {
        if (data != null) {
            if (data.tokens) {
                data.tokens.foreach((token) => {
                    this.reward_tokens.push(new Token(token));
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


const example = {
    "tokens": [{
        "tokenname": "4172746966637454657374546f6b656e303030323033",
        "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
        "fingerprint": "",
        "amount": 1
    },
        {
            "tokenname": "4172746966637454657374546f6b656e303030323034",
            "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
            "fingerprint": "",
            "amount": 1
        }
    ],
    "metadata": [
        "3435303030303030",
        "bae29468a207f24428dabbf5b5d8fcb699002cea33d6381672851a31",
        "30",
        "1ed9a5cd8796440d22d11198046cf8a680e634ff564a5b40eb3b2830",
        "517cfcde73912db9a4385adc3da8515cb6361b78ca0e5a97d66f832c",
        "4172746966637473546573744e6674303030303032",
        "616464725f7374616b65316e3264347478667374336632646e38766764676b",
        "6e336530717939616c63356d766b766d326b63337066706779776d61736668",
        "617274696663742d636c692d417274694c42554376312e302e30"
    ],
    "royalties_addr": "000e5a9d20e9a5b16c5c1879368422b6c864d512ba5a8ccc40bfdaae4030b592cedfb75533b2dc0cec3dee1c893e23adaa3379f757046dde0b",
    "royalties_rate": 0.2,
    "selling_price": 20000000
};