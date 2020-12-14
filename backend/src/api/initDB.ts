import { Database } from 'better-sqlite3'
import MakeBikeData from '../data/cville_bike_data'

const initDB = (db: Database): void => {
    const bikeData: any = MakeBikeData()

    db.prepare(`
        CREATE TABLE layers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            time_enabled INTEGER NOT NULL)
    `).run()
    
    db.prepare(`
        CREATE TABLE points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            timestart INTEGER,
            timeend INTEGER,
            layer_id INTEGER NOT NULL,
            FOREIGN KEY (layer_id) REFERENCES layers (id)
    )`).run()
    
    db.prepare(`
        INSERT INTO layers
        (title, time_enabled)
        VALUES
        ('Charlottesville Bike Racks', 0)
    `).run()

    bikeData.points.map((point) => {
        db.prepare(`
            INSERT INTO points
            (lat, lon, timestart, timeend, layer_id)
            VALUES
            (${ point.lat }, ${ point.lon }, NULL, NULL, 1)
        `).run()
    })
}

export default initDB
