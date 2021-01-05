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

    async getPoints(layerIDs: Array<string>, timestart?: number, timeend?: number): Promise<Array<Point>> {
        if (timestart || timeend) {
            return this.db.prepare(`
                SELECT * FROM points 
                WHERE layer_id IN (${ layerIDs })
                AND timestamp BETWEEN ${ timestart } AND ${ timeend }
                OR timestamp IS NULL
            `).all()
        } else {
            return this.db.prepare(`
                SELECT * FROM points 
                WHERE layer_id IN (${ layerIDs })
            `).all()
        }
    }

    async addLayer(title: string, time_enabled: number, lat: number, lon: number, time_start?: number, time_end?: number): Promise<any> {
        let response: RunResult
        try {
            response = this.db.prepare(`
                INSERT INTO layers
                (title, time_enabled, timestart, timeend, lat, lon)
                VALUES
                ('${ title }', ${ time_enabled }, ${ time_start ? time_start : "NULL" }, ${ time_end ? time_end : "NULL" }, ${ lat }, ${ lon })
            `).run()
        } catch (err) {
            console.log('err: ', err)
            return { success: false, id: null }
        }
        return { success: true, id: response.lastInsertRowid }
    }

    async addPoint(layer_id: number, lat: number, lon: number, timestamp?: number): Promise<any> { 
        try {
            this.db.prepare(`
                INSERT INTO points
                (lat, lon, timestamp, layer_id)
                VALUES
                (${ lat }, ${ lon }, ${ timestamp ? timestamp : "NULL" }, ${ layer_id })
            `).run()
        } catch (err) {
            console.log('err: ', err)
            return { success: false }
        }

        return { success: true }
    }
}

export default LayerAPI;
