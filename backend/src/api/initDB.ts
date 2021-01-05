import { Database, Statement, Transaction } from 'better-sqlite3'
import MakeBikeData from '../data/cville_bike_data'
import MakeCrimeData from '../data/bristol_crime_data'

const initDB = (db: Database): void => {
    const layers: any[] = [MakeBikeData(), MakeCrimeData()]

    db.prepare(`
        CREATE TABLE layers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            timestart INTEGER,
            timeend INTEGER,
            time_enabled INTEGER NOT NULL,
            lat REAL NOT NULL,
            lon REAL NOT NULL)
    `).run()
    
    db.prepare(`
        CREATE TABLE points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            timestamp INTEGER,
            layer_id INTEGER NOT NULL,
            FOREIGN KEY (layer_id) REFERENCES layers (id)
    )`).run()
    
    const layerInsert: Statement = db.prepare(`
        INSERT INTO layers
        (title, time_enabled, timestart, timeend, lat, lon)
        VALUES
        (@title, @time_enabled, @timestart, @timeend, @lat, @lon)
    `)
    const layerInsertTransaction: Transaction = db.transaction((layers) => {
        layers.map((layer) => {
            if (layer.time_enabled) {
                const timestamps: number[] = layer.points.map((point) => { return point.timestamp })
                const timestart: number = Math.min(...timestamps)
                const timeend: number = Math.max(...timestamps)
                const lat: number = layer.lat
                const lon: number = layer.lon
                layerInsert.run({...layer, timestart: timestart, timeend: timeend})
            } else {
                layerInsert.run({...layer, timestart: null, timeend: null})
            }
        })
    })
    layerInsertTransaction(layers)

    const pointInsert: Statement = db.prepare(`
        INSERT INTO points
        (lat, lon, timestamp, layer_id)
        VALUES
        (@lat, @lon, @timestamp, @layer_id)
    `)
    const pointInsertTransaction: Transaction = db.transaction((points, layer_id) => {
        points.map((point) => {
            pointInsert.run({...point, layer_id})
        })
    })
    layers.map((layer, index) => {
        pointInsertTransaction(layer.points, index + 1)
    })
}

export default initDB
