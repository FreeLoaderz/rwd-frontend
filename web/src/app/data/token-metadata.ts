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
    public homepageURL: string;
    public mediaType: string;

    constructor(data: any, ipfsPrefix: string) {
        if (data != null) {
            if (ipfsPrefix != null) {
                if (data.fingerprint != null) {
                    this.fingerprint = data.fingerprint;
                    const concatFingerprint = data.fingerprint.substring(0, 8).concat("...").concat(data.fingerprint.substring(data.fingerprint.length - 8));
                    this.shortFingerprint = concatFingerprint;
                }
                if (data.policy != null) {
                    this.policy = data.policy;
                    const concatPolicy = data.policy.substring(0, 8).concat("...").concat(data.policy.substring(data.policy.length - 8));
                    this.shortPolicy = concatPolicy;
                }
                if (data.tokenname != null) {
                    if ((data["json"]) && (data["json"][this.policy]) &&
                        (data["json"][this.policy][data.tokenname])) {
                        const token = data["json"][this.policy][data.tokenname];
                        this.type = token.type;
                        if (token.homepage != null) {
                            this.homepage = token.homepage;
                        } else if (token.url != null) {
                            this.homepage = token.url;
                        } else if (token.website != null) {
                            this.homepage = token.website;
                        } else if ((token[data.tokenname]) && (token[data.tokenname].website != null)) {
                            this.homepage = token[data.tokenname].website;
                        }
                        if (this.homepage != null) {
                            if (!this.homepage.startsWith("http")) {
                                this.homepageURL = "https://".concat(this.homepage);
                            } else {
                                this.homepageURL = this.homepage;
                            }
                        }
                        if (token.mediaType != null) {
                            this.mediaType = token.mediaType;
                        }
                        if (token.image != null) {
                            if (token.image.startsWith("ipfs")) {
                                this.logo = ipfsPrefix.concat(token.image.replace("ipfs://", ""));
                            } else {
                                this.logo = token.image;
                            }
                            console.log("1 -> " + this.logo);
                        } else if (token["files"] != null) {
                            const files = token["files"][0];
                            if (files.mediaType != null) {
                                this.mediaType = files.mediaType;
                            }
                            if (files.src != null) {
                                if (files.src.startsWith("ipfs")) {
                                    this.logo = ipfsPrefix.concat(files.src.replace("ipfs://", ""));
                                } else {
                                    this.logo = files.src;
                                }
                            }
                            console.log("2 -> " + this.logo);
                        } else if (token.logo != null) {
                            if (token.logo.startsWith("ipfs")) {
                                this.logo = ipfsPrefix.concat(token.logo.replace("ipfs://", ""));
                            } else {
                                this.logo = token.logo;
                            }
                            console.log("3 -> " + this.logo);
                        }
                        if (token.description != null) {
                            this.description = token.description;
                        } else if (token.about != null) {
                            this.description = "";
                            for (let i = 0; i < token.about.length; ++i) {
                                if (i > 0) {
                                    this.description = this.description.concat(" ");
                                }
                                this.description = this.description.concat(token.about[i]);
                            }
                        } else if (token.desc != null) {
                            this.description = token.desc;
                        }

                        if (this.description != null) {
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
                this.homepageURL = data.homepageURL;
                this.mediaType = data.mediaType;
            }
        }
    }
}
