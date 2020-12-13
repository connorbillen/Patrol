import { Database } from 'sqlite3'
import MakeBikeData from '../data/cville_bike_data'

const initDB = (): void => {
    const bikeData: any = MakeBikeData()
    const db: Database = new Database('./DB.db')

    db.serialize((): void => {
        db.run(`
            CREATE TABLE layers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            time_enabled INTEGER NOT NULL)
        `)
        
        db.run(`
            CREATE TABLE points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            timestart INTEGER,
            timeend INTEGER,
            layer_id INTEGER NOT NULL,
            FOREIGN KEY (layer_id) REFERENCES layers (id)
        )`)
        
        db.run(`
            INSERT INTO layers
            (title, time_enabled)
            VALUES
            ('cville_bike_data', 0)
        `)

        bikeData.points.map((point) => {
            db.run(`
                INSERT INTO points
                (lat, lon, timestart, timeend, layer_id)
                VALUES
                (${ point.lat }, ${ point.lon }, NULL, NULL, 1)
            `)
        })
    })
        
    db.close()
}

initDB()
