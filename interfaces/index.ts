export interface Layer {
    active: boolean,
    title: string,
    time_enabled: number,
    color: string,
    id: number,
    timestart?: number,
    timeend?: number
}

export interface Layers {
    [k: string]: {
        title: string,
        expanded: boolean,
        active: boolean,
        layers: { [k: string]: Layer }
    }
}

export interface Point {
    lat: number,
    lon: number,
    timestamp?: number
}

export interface Map {
    timestart: number,
    timeend: number,
    zoom: number,
    center: number[]
}

export interface TimeSlider {
    enabled: boolean,
    timestart: number,
    timeend: number,
    currentStart: number,
    currentEnd: number
}

export interface Upload {
    modalOpen: boolean
}

export interface State {
    ToolDrawer: {
        open: boolean
    },
    Layers: Layers,
    Map: Map,
    TimeSlider: TimeSlider,
    Upload: Upload
}
