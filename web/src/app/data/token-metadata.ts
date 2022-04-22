export class TokenMetadata {
    public policy;
    public name;
    public url;
    public description;
    public logo;
    public ticker;
    public subject;

    constructor(data: any) {
        if (data != null) {
            if (data.policy) {
                this.policy = data.policy;
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
                this.logo = data.logo;
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
