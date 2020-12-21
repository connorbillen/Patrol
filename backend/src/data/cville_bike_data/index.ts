import { readFileSync } from 'fs'
import { parseString } from 'xml2js'

const convertDataToJSON = (): Object => {
    const xml: string = readFileSync(`${ process.cwd() }/src/data/cville_bike_data/data.kml`).toString()
    const jsonData: any = {
        time_enabled: 0,
        title: 'Charlottesville Bicycle Racks',
        points: []
    }

    parseString(xml, (_err: Error, result: { kml: { Document: Array<any> }}): void => {
        result.kml.Document[0].Folder[0].Placemark.map((placemark) => {
            const latlon: Array<string> = placemark.Point[0].coordinates[0].split(',')
            jsonData.points.push({ lon: parseFloat(latlon[0]), lat: parseFloat(latlon[1]), timestamp: null });
        })
    })

    return jsonData
}

export default convertDataToJSON
