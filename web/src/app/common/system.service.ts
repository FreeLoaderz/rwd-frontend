import {Injectable} from '@angular/core';
import {WebsocketSubscriber} from './websocket-subscriber';

@Injectable()
export class SystemService {
    public static webSocket: WebSocket;
    public static websocketSubscribers: Array<WebsocketSubscriber> = [];
    public static sessionId: string;
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
        // If we want a web socket.. it's here
        if (!SystemService.webSocket) {
//            this.connectWebSocket();
        }
        SystemService.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
    }

    /**
     * Add a subscriber for web socket data
     * @param subscriber
     */
    public register(subscriber: any) {
        this.unregister(subscriber);
        SystemService.websocketSubscribers.push(subscriber);
    }

    /**
     * Remove a subscriber for web socket data
     * @param subscriber
     */
    public unregister(subscriber: any) {
        for (let ctr: number = 0; ctr < SystemService.websocketSubscribers.length; ++ctr) {
            const sub: WebsocketSubscriber = SystemService.websocketSubscribers[ctr];
            if (sub.name === subscriber.name) {
                SystemService.websocketSubscribers.splice(ctr, 1);
                return;
            }
        }
    }

    /**
     * Connect the Ghidorah web socket
     * @private
     */
    private connectWebSocket() {
        //    SystemService.webSocket = new WebSocket("wss://" + location.hostname + "/ws/wss");
        SystemService.webSocket = new WebSocket("ws://127.0.0.1:5000/wss");
        SystemService.webSocket.onmessage = (message) => this.processData(message);
        SystemService.webSocket.onerror = (error) => this.socketError(error);
        SystemService.webSocket.onclose = (closeEvent) => this.reconnectWebsocket(closeEvent);
    }

    private processData(msg: any) {
        const data = JSON.parse(msg.data);
        if (data.type === 'SESSION_ID') {
            if (data.sessionId) {
                SystemService.sessionId = data.sessionId;
                SystemService.hostIp = data.serverIp;
            }
        } else if (data.type === 'PROPERTY') {
            SystemService.propertyMap.set(data.key, data.value);
        }
        for (let i = 0, len = SystemService.websocketSubscribers.length; i < len; i++) {
            SystemService.websocketSubscribers[i].processData(data);
        }
    }

    public static getProperty(key: string) {
        return SystemService.propertyMap.get(key);
    }

    private socketError(error: any) {
        console.error("Websocket error!", error);
        SystemService.webSocket.close(1002, "Error");
    }

    private reconnectWebsocket(closeEvent: any) {
        console.error("Websocket connection closed! Attempting to reconnect...");
        console.error(closeEvent);
        setTimeout(() => this.connectWebSocket(), 3000);
    }

    /**
     *
     * @param ms
     */
    public static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
