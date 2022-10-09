export class PulldownOptions {
    public static NEW: string = "/***NEW***/";
    public static ALL: string = "/***ALL***/";
    public options: any[] = [];
    // This array will account for duplicates of the same option
    public labelCount: Array<string> = [];

    constructor() {
    }

    /**
     * Clear this option list
     */
    public clear() {
        this.options = [];
        this.labelCount = [];
    }

    /**
     * Add an option to the list
     * @param label
     * @param value
     */
    public addOption(label: string, value: string, sort: boolean = true): boolean {
        let addOption: boolean = true;
        this.labelCount.push(label);
        for (let ctr = 0; ctr < this.options.length; ++ctr) {
            if (this.options[ctr].label === label) {
                addOption = false;
                break;
            }
        }
        if (addOption) {
            this.options.push({label: label, value: value});
            if (sort) {
                this.options.sort(function sortLabels(a: any, b: any): number {
                    if (a.value == null) {
                        return -1;
                    } else if (b.value == null) {
                        return 1;
                    } else if (a.value === PulldownOptions.ALL) {
                        return -1;
                    } else if (b.value === PulldownOptions.ALL) {
                        return 1;
                    } else if (a.value === PulldownOptions.NEW) {
                        return -1;
                    } else if (b.value === PulldownOptions.NEW) {
                        return 1;
                    } else if (a.label > b.label) {
                        return 1;
                    } else if (a.label < b.label) {
                        return -1;
                    }
                });
            }
        }
        return addOption;
    }

    public updateOption(label: string, value: string) {
        let updated: boolean = false;
        for (let i = 0; i < this.options.length; ++i) {
            if (this.options[i].value === value) {
                this.options[i].label = label;
                updated = true;
                break;
            }
        }
        return updated;
    }

    /**
     * Remove an option from the list
     * @param label
     */
    public removeOption(label: string): boolean {
        let removed = true;
        let i;
        for (i = 0; i < this.labelCount.length; ++i) {
            if (this.labelCount[i] === label) {
                this.labelCount.splice(i, 1);
                break;
            }
        }
        if (--i >= 0) {
            for (let index = i; index < this.labelCount.length; ++index) {
                if (this.labelCount[index] === label) {
                    removed = false;
                    break;
                }
            }
        }
        if (removed) {
            for (i = 0; i < this.options.length; ++i) {
                if (this.options[i].label === label) {
                    this.options.splice(i, 1);
                    break;
                }
            }
        }
        return removed;
    }

    removeValue(value: string): boolean {
        let removed = true;
        let label = null;
        let i;
        for (i = 0; i < this.options.length; ++i) {
            if (this.options[i].value === value) {
                label = this.options[i].label;
                this.options.splice(i, 1);
                break;
            }
        }
        if (removed) {
            for (i = 0; i < this.labelCount.length; ++i) {
                if (this.labelCount[i] === label) {
                    this.labelCount.splice(i, 1);
                    break;
                }
            }
            if (--i >= 0) {
                for (let index = i; index < this.labelCount.length; ++index) {
                    if (this.labelCount[index] === label) {
                        removed = false;
                        break;
                    }
                }
            }
        }
        return removed;
    }

    /**
     * Get the label for the given value
     * @param value
     */
    getLabel(value: string): string {
        for (let i = 0; i < this.options.length; ++i) {
            if (this.options[i].value === value) {
                return this.options[i].label;
            }
        }
        return null;
    }

    /**
     * Check if this value is in the list
     * @param value
     */
    public containsOptionValue(value: any) {
        let found = false;
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].value === value.toString()) {
                found = true;
                break;
            }
        }
        return found;
    }
}
