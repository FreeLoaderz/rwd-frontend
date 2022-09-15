export class WalletVerification {
    public wallet_addresses: Array<string> = [];

    constructor(data: any) {
        if (data != null) {
            if (data.wallet_addresses) {
                data.wallet_addresses.foreach((wallet_address) => {
                    this.wallet_addresses.push(wallet_address);
                });
            }
        }
    }
}