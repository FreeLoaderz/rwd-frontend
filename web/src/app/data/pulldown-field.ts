import {PulldownOptions} from "./pulldown-options";

export class PulldownField {
    public options: any[] = [];
    private pulldownOptions: PulldownOptions = new PulldownOptions();
    public filter: string = null;

    constructor(public allowAll: boolean = true, public addBoolean: boolean = false, public numericBoolean: boolean = false) {
        this.resetOptions();
    }

    public addOption(label: string, value: string, sort: boolean = true): boolean {
        let added: boolean = false;
        if (this.pulldownOptions.addOption(label, value, sort)) {
            this.options = [...this.pulldownOptions.options];
            added = true;
        }
        return added;
    }

    public removeLabel(label: string) {
        this.pulldownOptions.removeOption(label);
        this.pulldownOptions.options = [...this.pulldownOptions.options];
        this.options = [...this.pulldownOptions.options];
    }

    public removeValue(value: string): boolean {
        const removed = this.pulldownOptions.removeValue(value);
        this.pulldownOptions.options = [...this.pulldownOptions.options];
        this.options = [...this.pulldownOptions.options];
        return removed;
    }

    public getLabel(value: string) {
        return this.pulldownOptions.getLabel(value);
    }

    public clear() {
        this.pulldownOptions.clear();
        this.options.splice(0);
        this.resetOptions();
    }

    private resetOptions() {
        if (this.allowAll) {
            this.pulldownOptions.addOption("All", null);
        }
        if (this.addBoolean) {
            if (!this.numericBoolean) {
                this.pulldownOptions.addOption("True", String(true));
                this.pulldownOptions.addOption("False", String(false));
            } else {
                this.pulldownOptions.addOption("True", "1");
                this.pulldownOptions.addOption("False", "0");
            }
        }
        this.options = [...this.pulldownOptions.options];
    }

    public updateOption(label: string, value: string): boolean {
        return this.pulldownOptions.updateOption(label, value);
    }

    public containsOptionValue(value: any) {
        return this.pulldownOptions.containsOptionValue(value);
    }
}