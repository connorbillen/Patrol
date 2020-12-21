export interface Layer {
    id: number,
    time_enabled: number,
    title: string,
    timestart: number,
    timeend: number
    points?: Array<Point>
}

export interface Point {
    id: number,
    lat: number,
    lon: number,
    timestamp?: number
}
