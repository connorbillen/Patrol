import { DataSource } from 'apollo-datasource'
import { Database, RunResult } from 'better-sqlite3'

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
        return this.db.prepare(`SELECT * FROM layers`).all()
    }

    async getPoints(layerID: number): Promise<Array<Point>> {
        return this.db.prepare(`
            SELECT * FROM points 
            WHERE layer_id = ${ layerID }
        `).all()
    }

    async addLayer(title: string, time_enabled: boolean): Promise<any> {
        let response: RunResult
        try {
            response = this.db.prepare(`
                INSERT INTO layers
                (title, time_enabled)
                VALUES
                ('${ title }', ${ time_enabled })
            `).run()
        } catch (err) {
            console.log('err: ', err)
            return { success: false }
        }
        return { success: true, id: response.lastInsertRowid }
    }

    async addPoint(layer_id: number, lat: number, lon: number, timestart?: number, timeend?: number): Promise<any> { 
        try {
            this.db.prepare(`
                INSERT INTO points
                (lat, lon, timestart, timeend, layer_id)
                VALUES
                (${ lat }, ${ lon }, ${ timestart ? timestart : "NULL" }, ${ timeend ? timeend : "NULL" }, ${ layer_id })
            `).run()
        } catch (err) {
            console.log('err: ', err)
            return { success: false }
        }

        return { success: true }
    }
}

export default LayerAPI;