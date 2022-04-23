export class ColorService {

    public static calculatePoint(i, intervalSize, colorRangeInfo) {
        const {colorStart, colorEnd, useEndAsStart} = colorRangeInfo;
        return (useEndAsStart
            ? (colorEnd - (i * intervalSize))
            : (colorStart + (i * intervalSize)));
    }

    /* Must use an interpolated color scale, which has a range of [0, 1] */
    public static interpolateColors(dataLength, colorScale, colorRangeInfo) {
        const {colorStart, colorEnd} = colorRangeInfo;
        const colorRange = colorEnd - colorStart;
        const intervalSize = colorRange / dataLength;
        let i, colorPoint;
        const colorArray = [];

        for (i = 0; i < dataLength; i++) {
            colorPoint = ColorService.calculatePoint(i, intervalSize, colorRangeInfo);
            colorArray.push(colorScale(colorPoint));
        }

        return colorArray;
    }
}