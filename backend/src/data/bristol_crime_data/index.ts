import dayjs from 'dayjs'
import { readFileSync } from 'fs'
import CSVParse from 'csv-parse/lib/sync'

const convertDataToJSON = (): Object => {
    const csv: string = readFileSync(`${ process.cwd() }/backend/src/data/bristol_crime_data/data.csv`).toString()
    const csvData = CSVParse(csv, { 'columns': true, 'autoParse': true })

    const jsonData = {
        time_enabled: 1,
        title: 'Bristol Crime Data',
        points: []
    }

    csvData.map((row: { location_1: string, month_and_year: string }) => {
        const [lat, lon] = row.location_1.substring(1, row.location_1.length - 1).split(',')
        jsonData.points.push({
            lat: lat,
            lon: lon,
            timestamp: dayjs(row.month_and_year).unix()
        })
    })

    return jsonData
}

export default convertDataToJSON
