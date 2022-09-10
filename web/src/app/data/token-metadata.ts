export class TokenMetadata {
    public fingerprint: string;
    public shortFingerprint: string;
    public policy: string;
    public shortPolicy: string;
    public description: string;
    public shortDesc: string;
    public compressedDesc: string;
    public logo: string;
    public type: string;
    public homepage: string;
    public mediaType: string;

    constructor(data: any, ipfsPrefix: string) {
        if (data != null) {
            if (ipfsPrefix != null) {
                if (data.fingerprint != null) {
                    this.fingerprint = data.fingerprint;
                    const concatFingerprint = data.fingerprint.substring(0, 8).concat("...").concat(data.fingerprint.substring(data.fingerprint.length - 8));
                    this.shortFingerprint = concatFingerprint;
                }
                if (data.policy) {
                    this.policy = data.policy;
                    const concatPolicy = data.policy.substring(0, 8).concat("...").concat(data.policy.substring(data.policy.length - 8));
                    this.shortPolicy = concatPolicy;
                }
                if (data.tokenname != null) {
                    if ((data["json"]) && (data["json"][this.policy]) &&
                        (data["json"][this.policy]) &&
                        (data["json"][this.policy][data.tokenname])) {
                        const token = data["json"][this.policy][data.tokenname];
                        this.type = token.type;
                        if (token.homepage != null) {
                            this.homepage = token.homepage;
                            if (!this.homepage.startsWith("http")) {
                                this.homepage = "https://".concat(this.homepage);
                            }
                        }

                        this.mediaType = token.mediaType;
                        if (token.image.startsWith("ipfs")) {
                            this.logo = ipfsPrefix.concat(token.image.replace("ipfs://", ""));
                        } else {
                            this.logo = token.image;
                        }
                        if (token.description != null) {
                            this.description = token.description;
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
                    }
                }
            } else {
                this.fingerprint = data.fingerprint;
                this.shortFingerprint = data.shortFingerprint;
                this.policy = data.policy;
                this.shortPolicy = data.shortPolicy;
                this.description = data.description;
                this.compressedDesc = data.compressedDesc;
                this.shortDesc = data.shortDesc;
                this.logo = data.logo;
                this.type = data.type;
                this.homepage = data.homepage;
                this.mediaType = data.mediaType;
            }
        }
    }
}
