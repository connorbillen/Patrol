export interface Layer {
    id: number,
    time_enabled: boolean,
    title: string,
    points?: Array<Point>
}

export interface Point {
    id: number,
    lat: number,
    lon: number
}
