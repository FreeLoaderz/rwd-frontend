import {Injectable} from '@angular/core';

@Injectable()
export class SystemService {
    public static hostIp: string;
    public static host: string;
    public static isAndroid: boolean = true;
    public static propertyMap: any = new Map();
    public static dateFormat = "YY-MM-dd HH:mm:ss.SSS";
    public static timezone = "UTC";
    public static screenWidth: number;
    public static screenHeight: number;

    constructor() {
        SystemService.host = location.hostname;
    }

    public init() {
        SystemService.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
    }

    /**
     *
     * @param ms
     */
    public static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
