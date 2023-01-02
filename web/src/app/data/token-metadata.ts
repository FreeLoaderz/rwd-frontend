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
                    const concatFingerprint = data.fingerprint.substring(0, 8).concat("...")
                        .concat(data.fingerprint.substring(data.fingerprint.length - 8));
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
                            if (Array.isArray(token["image"])) {
                                for (let i = 0; i < token["image"].length; ++i) {
                                    if (token["image"][i].startsWith("ipfs")) {
                                        this.logo = ipfsPrefix.concat(token["image"][i].replace("ipfs://", ""));
                                        break;
                                    } else {
                                        this.logo = token["image"][i];
                                        break;
                                    }
                                }
                            } else {
                                if (token.image.startsWith("ipfs")) {
                                    this.logo = ipfsPrefix.concat(token.image.replace("ipfs://", ""));
                                } else {
                                    this.logo = token.image;
                                }
                            }
                        } else if (token["files"] != null) {
                            const files = token["files"][0];
                            if (files != null) {
                                if (files.mediaType != null) {
                                    this.mediaType = files.mediaType;
                                }
                                if (files.src != null) {
                                    if (Array.isArray(files.src)) {
                                        if (files.src[0].startsWith("ipfs")) {
                                            this.logo = ipfsPrefix.concat(files.src[0].replace("ipfs://", ""));
                                        } else {
                                            this.logo = files.src[0];
                                        }
                                    } else {
                                        if (files.src.startsWith("ipfs")) {
                                            this.logo = ipfsPrefix.concat(files.src.replace("ipfs://", ""));
                                        } else {
                                            this.logo = files.src;
                                        }
                                    }
                                }
                                if (files.mediaType != null) {
                                    this.mediaType = files.mediaType;
                                }
                            }
                        } else if (token.logo != null) {
                            if (token.logo.startsWith("ipfs")) {
                                this.logo = ipfsPrefix.concat(token.logo.replace("ipfs://", ""));
                            } else {
                                this.logo = token.logo;
                            }
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
                            if (this.description.length > 50) {
                                this.compressedDesc = this.description.substring(0, 50).concat("..");
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
        if ((this.logo == null) || (!this.logo.startsWith("http"))) {
            this.logo = "../../../assets/ada.png";
        }
    }

    fromBackup(fingerprint: string, ipfsPrefix: string, data: any) {
        if ((data != null) && (data[0] != null)) {
            try {
                if (this.fingerprint == null) {
                    this.fingerprint = fingerprint;
                    const concatFingerprint = fingerprint.substring(0, 8).concat("...")
                        .concat(fingerprint.substring(fingerprint.length - 8));
                    this.shortFingerprint = concatFingerprint;
                }
                if (this.policy == null) {
                    this.policy = data[0].policy_id;
                    if (this.policy) {
                        const concatPolicy = data[0].policy_id.substring(0, 8).concat("...").concat(data[0].policy_id.substring(data[0].policy_id.length - 8));
                        this.shortPolicy = concatPolicy;
                    }
                }
                if (this.description == null) {
                    this.description = data[0].description;
                    if (this.description.length > 100) {
                        this.shortDesc = this.description.substring(0, 100).concat("..");
                    } else {
                        this.shortDesc = this.description;
                    }
                    if (this.description.length > 50) {
                        this.compressedDesc = this.description.substring(0, 50).concat("..");
                    } else {
                        this.compressedDesc = this.description;
                    }
                }
                if (data[0].logo.startsWith("http")) {
                    this.logo = data[0].logo;
                } else if (data[0].logo.startsWith("ipfs")) {
                    this.logo = ipfsPrefix.concat(data[0].logo.replace("ipfs://", ""));
                } else {
                    this.logo = "data:image/png;base64,".concat(data[0].logo);
                }
                if (this.homepage == null) {
                    this.homepage = data[0].url;
                }
                if (this.homepageURL == null) {
                    this.homepageURL = data[0].url;
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("Null response on backup metadata?");
            console.log(data);
        }
    }
}
