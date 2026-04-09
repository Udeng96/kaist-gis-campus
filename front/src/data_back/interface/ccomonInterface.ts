import L, {
    DivIcon,
    Icon,
    type LatLngExpression, type LeafletEventHandlerFn, Marker,
    type MarkerOptions
} from "leaflet";


export interface CommonResponse {
    code : number;
    message : string;
}

export interface WeatherType{
    regDtm : string;
    updDtm : string;
    temp : string;
    sky : string;
    dust : string;
    ultraDust : string;
    pty: string,
    skyCd : string,
    ptyCd : string,
}

export interface ReportType{
    regDtm : string;
    updDtm : string;
    content : string;
}

export interface SensorResponse {
    fireSensors : SensorType[],
    gasSensors : SensorType[],
    flameSensors : SensorType[],
}

export interface SensorType{
    cd : string,
    nm : string,
    building : string,
}

interface DataMarkerOptions<T> extends MarkerOptions {
    data: T
}

export class DataMarker<T = any> {
    private marker: Marker;
    private data: T;

    constructor(latlng: LatLngExpression, options: DataMarkerOptions<T>) {
        this.marker = new Marker(latlng, options);
        this.data = options.data;
    }

    getLeafletMarker(): Marker {
        return this.marker;
    }

    getData(): T {
        return this.data;
    }

    addTo(map: L.Map): this {
        this.marker.addTo(map);
        return this;
    }

    remove(): this {
        this.marker.remove();
        return this;
    }

    on(type:string, fn: LeafletEventHandlerFn):this{
        this.marker.on(type, fn);
        return this;
    }

    off(type:string ):this{
        this.marker.off(type);
        return this;
    }

    setIcon(icon: Icon | DivIcon) : this{
        this.marker.setIcon(icon);
        return this;
    }
}