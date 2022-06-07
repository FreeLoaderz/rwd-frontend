export class TokenMetadata {
    public policy: string;
    public shortPolicy: string;
    public name: string;
    public url: string;
    public description: string;
    public logo: string;
    public ticker: string;
    public subject: string;

    constructor(data: any) {
        if (data != null) {
            if (data.policy) {
                this.policy = data.policy;
                const concatPolicy = data.policy.substring(0, 5).concat("...").concat(data.policy.substring(data.policy.length - 5));
                this.shortPolicy = concatPolicy;
            }
            if (data.name) {
                this.name = data.name;
            }
            if (data.url) {
                this.url = data.url;
            }
            if (data.description) {
                this.description = data.description;
            }
            if (data.logo) {
                this.logo = 'data:image/png;base64,' + data.logo;
            }
            if (data.ticker) {
                this.ticker = data.ticker;
            }
            if (data.subject) {
                this.subject = data.subject;
            }
        }
    }
}
