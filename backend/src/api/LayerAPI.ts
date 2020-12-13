import { DataSource } from 'apollo-datasource'
import { Database } from 'sqlite3'

import { Layer, Point } from '../types'

class LayerAPI extends DataSource<any> {
    protected db: Database
    protected context: any

    constructor(db: Database) {
        super()
        this.db = db
    }

    initialize(config) {
        this.context = config.context
    }

    async getLayers(): Promise<Array<Layer>> {
        const layers: Array<Layer> = new Array<Layer>();
        
        this.db.each(`SELECT * FROM layers`, (_err: Error, layer: Layer): void => {
            layers.push({
                id: layer.id,
                title: layer.title,
                time_enabled: layer.time_enabled
            })
        })

        return layers
    }

    async getPoints(layerID: number): Promise<Array<Point>> {
        const points: Array<Point> = new Array<Point>();
        
        this.db.each(`
            SELECT * FROM points
            WHERE layer_id=${ layerID }
        `,
        (_err: Error, point: Point): void => {
            points.push({
                id: point.id,
                lat: point.lat,
                lon: point.lon
            })
        })

        return points
    }
}

export default LayerAPI;
