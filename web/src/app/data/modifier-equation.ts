export class ModifierEquation {
    public min_stake: number;
    public min_earned: number;
    public flatten: number;

    constructor(data: any) {
        if (data != null) {
            if (data.min_stake != null) {
                this.min_stake = data.min_stake;
            }
            if (data.min_earned != null) {
                this.min_earned = data.min_earned;
            }
            if (data.flatten != null) {
                this.flatten = data.flatten;
            }
        }
    }
}