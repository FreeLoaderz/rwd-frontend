import {Injectable} from "@angular/core";
import properties from '../../assets/config/properties.json';

@Injectable()
export class PropertyService {
    public propertyMap: Map<string, string> = new Map<string, string>();


    constructor() {
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                this.propertyMap.set(key, properties[key]);
            }
        }
    }

    public getProperty(key: string) {
        if (this.propertyMap.has(key)) {
            return this.propertyMap.get(key);
        }
        return null;
    }
}