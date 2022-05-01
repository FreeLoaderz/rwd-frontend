export class HistogramData {
    public label: string;
    public backgroundColor: string;
    public fill: boolean = false;
    public borderColor: string;
    public tension: number = .4;

    public yearMonthTotalMap: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
    public data: Array<number> = [];

    constructor() {
    }

    setArray(minYear: number, minMonth: number, maxYear: number, maxMonth: number) {
        this.data = [];
        let startMonth = minMonth;
        let endMonth = maxMonth;
        for (let i = minYear; i <= maxYear; ++i) {
            if (i > minYear) {
                startMonth = 1;
            }
            if (i < maxYear) {
                endMonth = 12;
            }
            for (let j = startMonth; j <= endMonth; ++j) {
                if (this.yearMonthTotalMap.has(i)) {
                    const monthTotalMap = this.yearMonthTotalMap.get(i);
                    if (monthTotalMap.has(j)) {
                        this.data.push(monthTotalMap.get(j));
                    } else {
                        this.data.push(0);

                    }
                } else {
                    this.data.push(0);
                }
            }
        }
    }

    public static getLabels(minYear: number, minMonth: number, maxYear: number, maxMonth: number): Array<string> {
        const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const labels: Array<string> = [];
        let startMonth = minMonth;
        let endMonth = maxMonth;
        for (let i = minYear; i <= maxYear; ++i) {
            if (i > minYear) {
                startMonth = 1;
            }
            if (i < maxYear) {
                endMonth = 12;
            }
            for (let j = (startMonth - 1); j <= (endMonth - 1); ++j) {
                labels.push(months[j] + " 20" + i);
            }
        }
        return labels;
    }
}