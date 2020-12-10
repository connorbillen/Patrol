import { Database, Statement } from 'sqlite3'

const initDB = (): void => {
    const db: Database = new Database('./DB.db')

    db.serialize((): void => {
        db.run("CREATE TABLE lorem (info TEXT)")
        
        const stmt: Statement = db.prepare("INSERT INTO lorem VALUES (?)")
        for (let i: number = 0; i < 10; i++) {
            stmt.run("Ipsum " + i)
        }
        stmt.finalize()
        
        db.each("SELECT rowid AS id, info FROM lorem", (err: Error, row: {id: number, info: string}): void => {
            console.log(row.id + ": " + row.info)
        })
    })
        
    db.close()
}

initDB()
